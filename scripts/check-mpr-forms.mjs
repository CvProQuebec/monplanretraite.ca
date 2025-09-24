#!/usr/bin/env node
/**
 * check-mpr-forms.mjs
 * Vérification légère de conformité UI “mpr-*” pour prévenir les régressions d’accessibilité/OQLF.
 *
 * Règles vérifiées (heuristiques non bloquantes):
 * 1) Les labels devraient se trouver dans un conteneur .mpr-field (ou via <Field .../>).
 * 2) Les formulaires devraient utiliser .mpr-form et .mpr-form-row (cols-1/2/3).
 * 3) Alerte si des labels sont détectés sans wrapper mpr-field dans un rayon de 5 lignes.
 *
 * Usage:
 *   node scripts/check-mpr-forms.mjs [dir=src]
 *
 * Sortie:
 *   - Liste d’avertissements avec fichier:ligne + message
 *   - Code de sortie 0 (non bloquant); intégrer à CI en mode advisory
 */

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targetDir = process.argv[2] || 'src';
const exts = new Set(['.tsx', '.ts']);

let warnings = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full);
    } else {
      const ext = path.extname(e.name);
      if (exts.has(ext) && !full.includes(`${path.sep}workers${path.sep}`)) {
        checkFile(full);
      }
    }
  }
}

function checkFile(file) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);

  // Quick presence of mpr containers
  const hasMprForm = text.includes('className="mpr-form"') || text.includes("className='mpr-form'") || text.includes('FormGrid');
  const hasMprRow = text.includes('mpr-form-row') || text.includes('FormRow');

  // Find label lines
  lines.forEach((line, idx) => {
    const i = idx + 1;
    // Simple label detection (skip Field component)
    const isLabelTag = /<label\b/i.test(line);
    const isFieldComponent = /<Field\b/i.test(line);

    if (isLabelTag && !isFieldComponent) {
      // Look back/forward a few lines for mpr-field container or Field component
      const windowStart = Math.max(0, idx - 5);
      const windowEnd = Math.min(lines.length - 1, idx + 5);
      let inMprField = false;
      for (let k = windowStart; k <= windowEnd; k++) {
        if (/mpr-field/.test(lines[k]) || /<Field\b/.test(lines[k])) {
          inMprField = true;
          break;
        }
      }
      if (!inMprField) {
        warnings.push({
          file,
          line: i,
          msg: 'label sans conteneur .mpr-field ou <Field /> à proximité (±5 lignes)'
        });
      }
    }
  });

  // If there are inputs/selects/textarea but no mpr containers, warn
  if (!hasMprForm || !hasMprRow) {
    const hasInput = /<\s*(input|select|textarea)\b/.test(text);
    if (hasInput) {
      warnings.push({
        file,
        line: 1,
        msg: 'form inputs détectés sans .mpr-form/.mpr-form-row (ou FormGrid/FormRow)'
      });
    }
  }
}

function main() {
  const fullDir = path.join(root, targetDir);
  if (!fs.existsSync(fullDir)) {
    console.error(`Dossier introuvable: ${fullDir}`);
    process.exit(0);
  }

  walk(fullDir);

  if (warnings.length === 0) {
    console.log('✅ mpr-forms: aucune anomalie détectée (vérifications heuristiques)');
    process.exit(0);
  }

  console.log(`⚠️ mpr-forms: ${warnings.length} avertissement(s) — vérifiez les formulaires pour respecter “1 ligne = 1 label + 1 champ”`);
  for (const w of warnings) {
    console.log(`- ${w.file}:${w.line} → ${w.msg}`);
  }

  // Non-bloquant (advisory)
  process.exit(0);
}

main();
