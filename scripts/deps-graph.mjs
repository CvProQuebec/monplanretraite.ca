#!/usr/bin/env node
/**
 * deps-graph.mjs
 * Génère une matrice/graph de dépendances inter-fichiers (JSON) pour monitorer cycles et traversées de couches.
 *
 * Stratégie:
 * - Essaie dependency-cruiser (API) si disponible → export JSON complet (incluant metadata/violations si règles fournies)
 * - Sinon, fallback: scan local des imports (regex) et construit un graphe minimal { nodes, edges }
 *
 * Sortie:
 * - .deps-graph.json à la racine du dépôt
 *
 * Usage:
 *   node scripts/deps-graph.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const OUTPUT_FILE = path.join(root, '.deps-graph.json');

async function runDependencyCruiser() {
  try {
    const dc = await import('dependency-cruiser');
    const { cruise } = dc;
    const result = await cruise(
      ['src'],
      {
        doNotFollow: { path: 'node_modules|dist|public' },
        exclude: '(^node_modules|^dist|^public)',
        tsConfig: { fileName: 'tsconfig.json' },
        /* Vous pouvez étendre ruleSet pour inclure vos frontières */
        ruleSet: {
          forbidden: [
            { name: 'no-circular', severity: 'warn', from: {}, to: { circular: true } },
            { name: 'ui-to-workers', severity: 'warn', from: { path: '^src/(pages|components)' }, to: { path: '^src/workers' } },
            { name: 'services-to-ui', severity: 'warn', from: { path: '^src/services' }, to: { path: '^src/(pages|components)' } },
            { name: 'routes-to-services', severity: 'warn', from: { path: '^src/routes' }, to: { path: '^src/services' } },
            { name: 'routes-to-workers', severity: 'warn', from: { path: '^src/routes' }, to: { path: '^src/workers' } }
          ]
        }
      },
      { maxDepth: 0 }
    );
    const output = typeof result.output === 'string' ? JSON.parse(result.output) : result.output;
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`✅ Dépendances (dependency-cruiser) → ${path.basename(OUTPUT_FILE)}`);
    return true;
  } catch (e) {
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
  if (spec.startsWith('@/')) return path.join(root, 'src', spec.slice(2));
  if (spec.startsWith('src/')) return path.join(root, spec);
  if (spec.startsWith('./') || spec.startsWith('../')) return path.normalize(path.join(path.dirname(fromFile), spec));
  return null; // external
}

function runFallbackScan() {
  const files = listFiles(path.join(root, 'src'));
  const importRe = /import\s+[^'"]*['"]([^'"]+)['"]/g;
  const dynamicImportRe = /import\(\s*['"]([^'"]+)['"]\s*\)/g;

  const nodes = new Set();
  const edges = [];

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const relFrom = path.relative(root, file).replace(/\\/g, '/');
    nodes.add(relFrom);

    const specs = [];
    let m;
    importRe.lastIndex = 0;
    while ((m = importRe.exec(text))) specs.push(m[1]);
    dynamicImportRe.lastIndex = 0;
    while ((m = dynamicImportRe.exec(text))) specs.push(m[1]);

    for (const spec of specs) {
      const toPath = resolveImport(file, spec);
      if (!toPath) continue;
      const relTo = path.relative(root, toPath).replace(/\\/g, '/');
      nodes.add(relTo);
      edges.push({ from: relFrom, to: relTo });
    }
  }

  const output = {
    meta: { tool: 'fallback-scan', generatedAt: new Date().toISOString() },
    nodes: Array.from(nodes).map((id) => ({ id })),
    edges
  };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`✅ Dépendances (fallback) → ${path.basename(OUTPUT_FILE)} [nodes=${output.nodes.length}, edges=${output.edges.length}]`);
}

(async function main() {
  const ok = await runDependencyCruiser();
  if (!ok) {
    console.log('ℹ️ dependency-cruiser non disponible — génération fallback du graphe');
    runFallbackScan();
  }
})();
