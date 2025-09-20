import { promises as fs } from 'fs';
import path from 'path';

/**
 * Corrige les espaces avant ! et ? dans tous les articles Markdown
 * - Parcourt src/pages/blog/posts (fr et en)
 * - Remplace " espace + ! " -> "!" et " espace + ? " -> "?"
 * - Évite de modifier l'intérieur des blocs de code ```...```
 * - Évite d'altérer la syntaxe d'image Markdown "![...]" (on ne touche pas aux " ![")
 */

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'src/pages/blog/posts');

function log(...args) {
  console.log('[fix-punctuation]', ...args);
}

async function walkMarkdownFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkMarkdownFiles(full)));
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

// Remplace " espace (y compris nbsp) + !|? " par le signe sans espace, sauf lorsqu'il est suivi de "[" (images: ![)
// Exemple: "Bonjour !" -> "Bonjour!"
//          "Quoi ?" -> "Quoi?"
const RE_SPACE_BEFORE_EXC_OR_Q = /([ \u00A0])+([!?])(?!\[)/g;

function fixOutsideCodeFences(content) {
  // Sépare par blocs code ```...```
  const parts = content.split(/```/);
  let replacedTotal = 0;

  for (let i = 0; i < parts.length; i++) {
    // indices pairs = hors code
    if (i % 2 === 0) {
      parts[i] = parts[i].replace(RE_SPACE_BEFORE_EXC_OR_Q, (_m, _s, p) => {
        replacedTotal++;
        return p;
      });
    }
  }
  return { fixed: parts.join('```'), replacedTotal };
}

async function processFile(file) {
  const original = await fs.readFile(file, 'utf8');
  const { fixed, replacedTotal } = fixOutsideCodeFences(original);

  if (replacedTotal > 0) {
    await fs.writeFile(file, fixed, 'utf8');
    log(`updated: ${path.relative(ROOT, file)} (${replacedTotal} remplacement(s))`);
    return replacedTotal;
  } else {
    log(`ok:      ${path.relative(ROOT, file)} (aucun remplacement)`);
    return 0;
  }
}

async function run() {
  try {
    const exists = await fs.stat(POSTS_DIR).then(() => true).catch(() => false);
    if (!exists) {
      log('Dossier introuvable:', POSTS_DIR);
      process.exit(1);
    }

    const files = await walkMarkdownFiles(POSTS_DIR);
    log('Fichiers MD détectés:', files.length);

    let total = 0;
    for (const file of files) {
      total += await processFile(file);
    }
    log('Terminé. Remplacements totaux:', total);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
