/*
  scripts/audit-nav.ts
  Navigation & Routing Auditor (read-only)
  - Detects PAGES (filesystem), ROUTES (React Router config), and MENU links.
  - Emits audit-nav.json and audit-nav.md at repo root.
  - No writes under src/**. No network. Deterministic.
*/
import * as fs from 'fs';
import * as path from 'path';

type AuditData = {
  framework: 'react-router' | 'next' | 'gatsby' | 'astro' | 'unknown';
  pages: string[];
  routes: string[];
  menuLinks: string[];
  unroutedPages: string[];
  nonMenuRoutablePages: string[];
  unusedComponents: string[];
  dynamicRoutesSummary: { count: number; examples: string[] };
  notes: string[];
};

const REPO_ROOT = process.cwd();
const SRC = path.join(REPO_ROOT, 'src');

function readText(p: string): string {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}

function listFiles(dir: string, exts: string[], ignoreDirs: string[] = []): string[] {
  const out: string[] = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop()!;
    let entries: fs.Dirent[] = [];
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { continue; }
    for (const ent of entries) {
      const fp = path.join(d, ent.name);
      if (ent.isDirectory()) {
        if (ignoreDirs.some((g) => fp.includes(path.sep + g + path.sep))) continue;
        stack.push(fp);
      } else {
        const ext = path.extname(ent.name).toLowerCase();
        if (exts.includes(ext)) out.push(fp);
      }
    }
  }
  return out;
}

function detectFramework(): AuditData['framework'] {
  // Best-effort detection
  const hasReactRouter = fs.existsSync(path.join(SRC, 'routes')) || /react-router/.test(readText(path.join(SRC, 'App.tsx')));
  if (hasReactRouter) return 'react-router';
  const hasNextPages = fs.existsSync(path.join(SRC, 'pages', '_app.tsx')) || fs.existsSync(path.join(SRC, 'pages', 'api'));
  if (hasNextPages) return 'next';
  const hasGatsby = fs.existsSync(path.join(REPO_ROOT, 'gatsby-node.js'));
  if (hasGatsby) return 'gatsby';
  const hasAstro = fs.existsSync(path.join(SRC, 'pages')) && listFiles(path.join(SRC, 'pages'), ['.astro']).length > 0;
  if (hasAstro) return 'astro';
  return 'unknown';
}

function normalizeRoute(p: string): string | null {
  // Keep only absolute app paths starting with '/'
  if (!p) return null;
  if (!p.startsWith('/')) return null;
  return p.replace(/\s+/g, ' ').trim();
}

function extractRoutesReactRouter(): string[] {
  const files = [path.join(SRC, 'App.tsx'), ...listFiles(path.join(SRC, 'routes'), ['.tsx', '.ts'])];
  const routes = new Set<string>();
  const add = (s: string | null) => { const n = normalizeRoute(s || ''); if (n) routes.add(n); };
  const frRe = /\bfr\s*[:=]\s*["']([^"']+)["']/g;
  const enRe = /\ben\s*[:=]\s*["']([^"']+)["']/g;
  const pathAttr = /\bpath\s*=\s*["']([^"']+)["']/g;
  for (const f of files) {
    const txt = readText(f);
    if (!txt) continue;
    // <Route path="/..." ...>
    for (const m of txt.matchAll(pathAttr)) add(m[1]);
    // LocalizedRoute JSX and function calls (fr/en props)
    for (const m of txt.matchAll(frRe)) add(m[1]);
    for (const m of txt.matchAll(enRe)) add(m[1]);
  }
  return Array.from(routes).sort();
}

function extractMenuLinks(): string[] {
  const candidatesDirs = [path.join(SRC, 'components'), path.join(SRC, 'components', 'layout'), path.join(SRC, 'pages')];
  const files = candidatesDirs.flatMap((d) => fs.existsSync(d) ? listFiles(d, ['.tsx', '.ts', '.jsx', '.js']) : []);
  const links = new Set<string>();
  const add = (s: string | null) => { const n = normalizeRoute(s || ''); if (n) links.add(n); };
  const linkTo = /\bto\s*=\s*["']([^"']+)["']/g; // <Link to="/...">
  const href = /\bhref\s*=\s*["']([^"']+)["']/g; // <a href="/...">
  const catalog = path.join(SRC, 'config', 'tools-catalog.ts');
  for (const f of files) {
    const txt = readText(f);
    if (!txt) continue;
    for (const m of txt.matchAll(linkTo)) add(m[1]);
    for (const m of txt.matchAll(href)) add(m[1]);
  }
  // Also include Tool catalog entries as intended navigation targets on the Outils page
  const catTxt = readText(catalog);
  if (catTxt) {
    for (const m of catTxt.matchAll(/\brouteFr\s*:\s*["']([^"']+)["']/g)) add(m[1]);
    for (const m of catTxt.matchAll(/\brouteEn\s*:\s*["']([^"']+)["']/g)) add(m[1]);
  }
  return Array.from(links).sort();
}

function extractPages(): string[] {
  const pagesDir = path.join(SRC, 'pages');
  if (!fs.existsSync(pagesDir)) return [];
  const files = listFiles(pagesDir, ['.tsx', '.jsx']).map((p) => path.relative(REPO_ROOT, p).replace(/\\/g, '/'));
  return files.sort();
}

function extractHideFromNavFlags(pages: string[]): Set<string> {
  const flagged = new Set<string>();
  for (const rel of pages) {
    const abs = path.join(REPO_ROOT, rel);
    const txt = readText(abs);
    if (/export\s+const\s+hideFromNav\s*=\s*true\b/.test(txt)) flagged.add(rel);
  }
  return flagged;
}

function mapPagesToRoutePresence(pages: string[], routeFiles: string[]): { routed: Set<string>; unrouted: Set<string> } {
  const routed = new Set<string>();
  const routeTexts = routeFiles.map((f) => readText(f));
  for (const rel of pages) {
    const base = path.basename(rel).replace(/\.(tsx|jsx)$/i, '');
    const found = routeTexts.some((txt) =>
      txt.includes(`/pages/${base}`) ||
      txt.includes(`\\pages\\${base}`) ||
      (txt.includes('/pages/') && txt.includes(base)) ||
      new RegExp(`\\b${base}\\b`).test(txt)
    );
    if (found) routed.add(rel);
  }
  const unrouted = new Set(pages.filter((p) => !routed.has(p)));
  return { routed, unrouted };
}function resolveImport(fromFile: string, spec: string): string | null {
  const alias = spec.startsWith('@/') ? path.join(SRC, spec.slice(2)) : spec.startsWith('~/' ) ? path.join(SRC, spec.slice(2)) : null;
  let base = spec;
  if (alias) base = alias; else if (spec.startsWith('.')) base = path.resolve(path.dirname(fromFile), spec);
  else return null; // ignore package imports
  const tryPaths = [
    base,
    `${base}.tsx`, `${base}.ts`, `${base}.jsx`, `${base}.js`,
    path.join(base, 'index.tsx'), path.join(base, 'index.ts'),
  ];
  for (const p of tryPaths) { if (fs.existsSync(p)) return p; }
  return null;
}

function extractImports(file: string): string[] {
  const txt = readText(file);
  if (!txt) return [];
  const out: string[] = [];
  // static imports
  for (const m of txt.matchAll(/import\s+[^'"\n]+from\s*["']([^"']+)["']/g)) out.push(m[1]);
  // dynamic imports (lazy)
  for (const m of txt.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g)) out.push(m[1]);
  return out;
}

function computeReachableFiles(entryGlobs: string[]): Set<string> {
  const entries = entryGlobs.filter((p) => fs.existsSync(p));
  const seen = new Set<string>();
  const stack = [...entries];
  while (stack.length) {
    const f = stack.pop()!;
    if (seen.has(f)) continue;
    seen.add(f);
    for (const spec of extractImports(f)) {
      const resolved = resolveImport(f, spec);
      if (resolved && !seen.has(resolved)) stack.push(resolved);
    }
  }
  return seen;
}

function main() {
  const framework = detectFramework();
  const pages = extractPages();
  const routes = framework === 'react-router' ? extractRoutesReactRouter() : [];
  const menuLinks = extractMenuLinks();

  // Unrouted pages: page files not referenced by any routes file
  const routeFiles = [path.join(SRC, 'App.tsx'), ...listFiles(path.join(SRC, 'routes'), ['.tsx', '.ts'])];
  const { unrouted } = mapPagesToRoutePresence(pages, routeFiles);

  // Non-menu routable: consider non-dynamic top-level routes
  const dynamic = routes.filter((r) => /[:*]/.test(r));
  const staticRoutes = routes.filter((r) => !/[:*]/.test(r));
  const topLevelCandidates = staticRoutes; // already filtered for ':' or '*'
  const nonMenu = topLevelCandidates.filter((r) => !menuLinks.includes(r));

  // Unused components: components not reachable from app/routes/pages/layout
  const componentsAll = listFiles(path.join(SRC, 'components'), ['.tsx', '.jsx']).map((p) => path.relative(REPO_ROOT, p).replace(/\\/g, '/'));
  const reachable = computeReachableFiles([
    path.join(SRC, 'App.tsx'),
    ...listFiles(path.join(SRC, 'routes'), ['.tsx', '.ts']),
    ...listFiles(path.join(SRC, 'pages'), ['.tsx', '.jsx']),
    ...listFiles(path.join(SRC, 'components', 'layout'), ['.tsx', '.jsx']),
  ]);
  const reachableRel = new Set(Array.from(reachable).map((p) => path.relative(REPO_ROOT, p).replace(/\\/g, '/')));
  const unusedComponents = componentsAll.filter((c) => !reachableRel.has(c));

  const hideFlags = extractHideFromNavFlags(pages);

  const data: AuditData = {
    framework,
    pages,
    routes,
    menuLinks,
    unroutedPages: Array.from(unrouted).sort(),
    nonMenuRoutablePages: nonMenu.sort(),
    unusedComponents: unusedComponents.sort(),
    dynamicRoutesSummary: { count: dynamic.length, examples: dynamic.slice(0, 10) },
    notes: [
      `hideFromNav flags detected on ${hideFlags.size} page(s) (excluded from menu by design).`,
      'Dynamic routes (with :param or *) are excluded from MENU candidates by default.'
    ],
  };

  // Write outputs
  const jsonPath = path.join(REPO_ROOT, 'audit-nav.json');
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

  const mdLines: string[] = [];
  mdLines.push('# Navigation & Routing Audit');
  mdLines.push('');
  mdLines.push(`Framework: ${framework}`);
  mdLines.push('');
  mdLines.push(`- Pages discovered: ${pages.length}`);
  mdLines.push(`- Routes discovered: ${routes.length}`);
  mdLines.push(`- Menu links discovered: ${menuLinks.length}`);
  mdLines.push(`- Unrouted pages: ${data.unroutedPages.length}`);
  mdLines.push(`- Non-menu routable pages: ${data.nonMenuRoutablePages.length}`);
  mdLines.push(`- Unused components (candidates): ${data.unusedComponents.length}`);
  mdLines.push(`- Dynamic routes: ${data.dynamicRoutesSummary.count}`);
  mdLines.push('');
  if (data.unroutedPages.length) {
    mdLines.push('## Unrouted Pages');
    for (const p of data.unroutedPages) mdLines.push('- `' + p + '`');
    mdLines.push('');
  }
  if (data.nonMenuRoutablePages.length) {
    mdLines.push('## Non-Menu Routable Pages');
    for (const r of data.nonMenuRoutablePages) mdLines.push('- `' + r + '`');
    mdLines.push('');
  }
  if (data.unusedComponents.length) {
    mdLines.push('## Unused Components (Candidates)');
    for (const c of data.unusedComponents.slice(0, 200)) mdLines.push('- `' + c + '`');
    if (data.unusedComponents.length > 200) mdLines.push('- ...and ' + (data.unusedComponents.length - 200) + ' more');
    mdLines.push('');
  }
  mdLines.push('## Notes');
  for (const n of data.notes) mdLines.push(`- ${n}`);
  mdLines.push('');
  mdLines.push('This report is read-only and deterministic. No runtime code was modified.');
  const mdPath = path.join(REPO_ROOT, 'audit-nav.md');
  fs.writeFileSync(mdPath, mdLines.join('\n'), 'utf8');

  // eslint-disable-next-line no-console
  console.log(`Wrote ${path.relative(REPO_ROOT, jsonPath)} and ${path.relative(REPO_ROOT, mdPath)}`);
}

main();

