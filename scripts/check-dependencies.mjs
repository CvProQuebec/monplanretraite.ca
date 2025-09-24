#!/usr/bin/env node
/**
 * check-dependencies.mjs
 * Détection simple des cycles + imports transverses interdits entre couches.
 * - Essaie d'utiliser dependency-cruiser ou madge si disponibles (facultatif).
 * - Fallback: scanner local des imports (regex) + détection basique.
 *
 * Règles (advisory - code sortie 0):
 *  - UI (src/pages|src/components) → ne doit pas importer src/workers
 *  - Services (src/services) → ne doit pas importer src/pages|src/components
 *  - Routes (src/routes) → ne doit pas importer src/services|src/workers
 *  - Cycles (si madge dispo)
 *
 * Usage:
 *   node scripts/check-dependencies.mjs
 *
 * Intégration:
 *   "deps:check": "node scripts/check-dependencies.mjs"
 */

import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();

const PATTERNS = {
  ui: [/^src[\\/](pages|components)[\\/]/i],
  services: [/^src[\\/]services[\\/]/i],
  routes: [/^src[\\/]routes[\\/]/i],
  workers: [/^src[\\/]workers[\\/]/i],
};

const FORBIDDEN = [
  { name: 'ui-to-workers', from: PATTERNS.ui, to: PATTERNS.workers, message: 'UI (pages/components) ne doit pas importer les workers directement.' },
  { name: 'services-to-ui', from: PATTERNS.services, to: PATTERNS.ui, message: 'Services ne doivent pas dépendre des pages/components (UI).' },
  { name: 'routes-to-services', from: PATTERNS.routes, to: PATTERNS.services, message: 'Routes ne doivent pas importer directement les services.' },
  { name: 'routes-to-workers', from: PATTERNS.routes, to: PATTERNS.workers, message: 'Routes ne doivent pas importer les workers.' },
];

// Try advanced tools if present (optional)
async function tryDependencyCruiser() {
  try {
    const dc = await import('dependency-cruiser');
    const { cruise } = dc;
    const result = await cruise(
      ['src'],
      {
        doNotFollow: { path: 'node_modules|dist|public' },
        exclude: '(^node_modules|^dist|^public)',
        ruleSet: {
          forbidden: [
            { name: 'no-circular', severity: 'warn', from: {}, to: { circular: true } },
            { name: 'ui-to-workers', severity: 'warn', from: { path: '^src/(pages|components)' }, to: { path: '^src/workers' } },
            { name: 'services-to-ui', severity: 'warn', from: { path: '^src/services' }, to: { path: '^src/(pages|components)' } },
            { name: 'routes-to-services', severity: 'warn', from: { path: '^src/routes' }, to: { path: '^src/services' } },
            { name: 'routes-to-workers', severity: 'warn', from: { path: '^src/routes' }, to: { path: '^src/workers' } },
          ],
        },
        tsConfig: { fileName: 'tsconfig.json' },
      },
      { maxDepth: 0 }
    );

    if (result?.output) {
      const out = typeof result.output === 'string' ? JSON.parse(result.output) : result.output;
      const errs = out?.summary?.error || 0;
      const warns = out?.summary?.warn || 0;
      console.log(`dependency-cruiser: ${warns} avertissement(s), ${errs} erreur(s) (advisory)`);
      (out?.summary?.violations || out?.violations || []).forEach((v) => {
        console.log(`- ${v.rule.name}: ${v.from} -> ${v.to} (${v.rule.severity})`);
      });
      return true;
    }
  } catch {
    // Ignore - not installed
  }
  return false;
}

async function tryMadgeCycles() {
  try {
    const madge = await import('madge');
    const res = await madge.default('src', {
      fileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      tsConfig: 'tsconfig.json',
      includeNpm: false,
    });
    const circular = await res.circular();
    if (circular.length) {
      console.log(`⚠️ Cycles détectés (madge): ${circular.length}`);
      circular.forEach((c) => console.log(`- ${c.join(' -> ')}`));
    } else {
      console.log('✅ Aucun cycle détecté (madge)');
    }
    return true;
  } catch {
    return false;
  }
}

function listFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name === 'public') continue;
      out.push(...listFiles(full));
    } else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

function resolveImport(fromFile, spec) {
  if (spec.startsWith('@/')) {
    return path.join(root, 'src', spec.slice(2));
  }
  if (spec.startsWith('src/')) {
    return path.join(root, spec);
  }
  if (spec.startsWith('./') || spec.startsWith('../')) {
    return path.normalize(path.join(path.dirname(fromFile), spec));
  }
  // external dependency -> ignore
  return null;
}

function matchesAny(p, patterns) {
  const rel = path.relative(root, p).replace(/\\/g, '/');
  return patterns.some((re) => re.test(rel));
}

function scanForbidden() {
  const files = listFiles(path.join(root, 'src'));
  const importRe = /import\s+[^'"]*['"]([^'"]+)['"]/g;
  const dynamicImportRe = /import\(\s*['"]([^'"]+)['"]\s*\)/g;

  const violations = [];

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const relFrom = path.relative(root, file);

    const imports = [];
    let m;
    importRe.lastIndex = 0;
    while ((m = importRe.exec(text))) imports.push(m[1]);
    dynamicImportRe.lastIndex = 0;
    while ((m = dynamicImportRe.exec(text))) imports.push(m[1]);

    for (const spec of imports) {
      const toPath = resolveImport(file, spec);
      if (!toPath) continue;
      const relTo = path.relative(root, toPath);

      for (const rule of FORBIDDEN) {
        const fromMatch = rule.from.some((re) => re.test(relFrom.replace(/\\/g, '/')));
        const toMatch = rule.to.some((re) => re.test(relTo.replace(/\\/g, '/')));
        if (fromMatch && toMatch) {
          violations.push({ rule: rule.name, from: relFrom, to: relTo, message: rule.message });
        }
      }
    }
  }

  if (violations.length) {
    console.log(`⚠️ Dépendances interdites détectées: ${violations.length}`);
    violations.forEach((v) => console.log(`- [${v.rule}] ${v.from} -> ${v.to} — ${v.message}`));
  } else {
    console.log('✅ Aucune dépendance interdite détectée (scan local)');
  }
}

(async function main() {
  let usedAdvanced = false;

  // Try advanced tools if available (optional - advisory)
  usedAdvanced = await tryDependencyCruiser();
  if (!usedAdvanced) {
    const madgeOk = await tryMadgeCycles();
    if (!madgeOk) {
      console.log('ℹ️ dependency-cruiser / madge non installés — fallback sur scan local.');
    }
  }

  // Always run local forbidden import scan
  scanForbidden();

  // advisory: always 0
  process.exit(0);
})();
