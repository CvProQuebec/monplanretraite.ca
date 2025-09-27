/*
  scripts/audit-tools.ts
  Navigation & Tools Coverage Auditor (read-only)
  - Parses tools catalog (src/config/tools-catalog.ts)
  - Extracts routes (React Router) and menu links (from audit-nav.json or scan)
  - Cross-references tools with routes, menu, and smoke tests
  - Emits tools-coverage.json and tools-coverage.md
*/
import * as fs from 'fs';
import * as path from 'path';

type Tool = {
  id: string;
  plan?: string;
  routeFr?: string;
  routeEn?: string;
  titleFr?: string;
  titleEn?: string;
  descFr?: string;
  descEn?: string;
  icon?: string;
  hideFromNav?: boolean;
};

type CoverageItem = {
  id: string;
  title: string;
  locale: 'fr' | 'en' | null;
  path: string;
  hasRoute: boolean;
  inMenu: boolean;
  inSmoke: boolean;
  isHidden: boolean;
  status: 'OK' | 'MISSING_ROUTE' | 'MISSING_MENU' | 'MISSING_SMOKE' | 'HIDDEN_OK';
  notes: string;
};

type CoverageReport = {
  framework: 'react-router' | 'unknown';
  items: CoverageItem[];
  summary: {
    totalTools: number;
    unroutedTools: string[]; // ids (any locale missing route)
    toolsMissingInMenu: string[]; // ids (any locale missing menu)
    toolsMissingInSmoke: string[]; // ids (any locale missing smoke)
    routesNotInCatalog: string[]; // static routes not matched by any tool route
    dynamicRoutes: string[]; // detected dynamic routes
    scannedAt: string;
    notes: string[];
  };
};

const REPO_ROOT = process.cwd();
const SRC = path.join(REPO_ROOT, 'src');

function readText(p: string): string {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}

function listFiles(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop()!;
    let entries: fs.Dirent[] = [];
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { continue; }
    for (const ent of entries) {
      const fp = path.join(d, ent.name);
      if (ent.isDirectory()) stack.push(fp);
      else if (exts.includes(path.extname(ent.name).toLowerCase())) out.push(fp);
    }
  }
  return out;
}

function extractRoutesReactRouter(): { routes: string[]; dynamic: string[] } {
  const files = [path.join(SRC, 'App.tsx'), ...listFiles(path.join(SRC, 'routes'), ['.tsx', '.ts'])];
  const all = new Set<string>();
  const add = (s: string | null) => { if (s && s.startsWith('/')) all.add(s.trim()); };
  const frRe = /\bfr\s*[:=]\s*["']([^"']+)["']/g;
  const enRe = /\ben\s*[:=]\s*["']([^"']+)["']/g;
  const pathAttr = /\bpath\s*=\s*["']([^"']+)["']/g;
  for (const f of files) {
    const txt = readText(f);
    if (!txt) continue;
    for (const m of txt.matchAll(pathAttr)) add(m[1]);
    for (const m of txt.matchAll(frRe)) add(m[1]);
    for (const m of txt.matchAll(enRe)) add(m[1]);
  }
  const routes = Array.from(all).sort();
  const dynamic = routes.filter((r) => /[:*]/.test(r));
  return { routes, dynamic };
}

function extractMenuLinksFromAudit(): { links: string[]; source: 'audit'|'fallback' } {
  const auditJson = path.join(REPO_ROOT, 'audit-nav.json');
  const txt = readText(auditJson);
  if (!txt) return { links: [], source: 'fallback' };
  try {
    const data = JSON.parse(txt);
    if (Array.isArray(data.menuLinks)) return { links: data.menuLinks as string[], source: 'audit' };
  } catch {}
  return { links: [], source: 'fallback' };
}

function fallbackExtractMenuLinks(): string[] {
  // Basic scan of layout/nav and pages for href/to strings
  const candidates = [path.join(SRC, 'components'), path.join(SRC, 'pages')]
    .filter((p) => fs.existsSync(p))
    .flatMap((p) => listFiles(p, ['.tsx', '.ts', '.jsx', '.js']));
  const links = new Set<string>();
  const add = (s: string | null) => { if (s && s.startsWith('/')) links.add(s.trim()); };
  const linkTo = /\bto\s*=\s*["']([^"']+)["']/g;
  const href = /\bhref\s*=\s*["']([^"']+)["']/g;
  for (const f of candidates) {
    const txt = readText(f);
    for (const m of txt.matchAll(linkTo)) add(m[1]);
    for (const m of txt.matchAll(href)) add(m[1]);
  }
  return Array.from(links).sort();
}

function parseToolsCatalog(): Tool[] {
  const p = path.join(SRC, 'config', 'tools-catalog.ts');
  const txt = readText(p);
  if (!txt) return [];
  const tools: Tool[] = [];
  // Simple object block regex – tolerant to newlines, stops at top-level '},' boundaries
  const objRe = /\{[\s\S]*?\bid\s*:\s*['"]([^'"]+)['"][\s\S]*?\}/g;
  let m: RegExpExecArray | null;
  while ((m = objRe.exec(txt))) {
    const block = m[0];
    const id = m[1];
    const g = (re: RegExp) => ((re.exec(block) || [])[1] || '').trim();
    const getBool = (re: RegExp) => /true\b/.test((re.exec(block) || [])[1] || '') || /\bhideFromNav\s*:\s*true\b/.test(block);
    const t: Tool = {
      id,
      plan: g(/\bplan\s*:\s*['"]([^'"]+)['"]/),
      routeFr: g(/\brouteFr\s*:\s*['"]([^'"]+)['"]/),
      routeEn: g(/\brouteEn\s*:\s*['"]([^'"]+)['"]/),
      titleFr: g(/\btitleFr\s*:\s*['"]([^'"]+)['"]/),
      titleEn: g(/\btitleEn\s*:\s*['"]([^'"]+)['"]/),
      descFr: g(/\bdescFr\s*:\s*['"]([^'"]+)['"]/),
      descEn: g(/\bdescEn\s*:\s*['"]([^'"]+)['"]/),
      icon: g(/\bicon\s*:\s*['"]([^'"]+)['"]/),
      hideFromNav: getBool(/\bhideFromNav\s*:\s*(true|false)\b/),
    };
    // Guard: ensure it's indeed inside TOOLS_CATALOG by checking presence of route/title fields
    if (t.titleFr || t.routeFr || t.routeEn) tools.push(t);
  }
  // Deduplicate by id (keep first)
  const seen = new Set<string>();
  return tools.filter((t) => (seen.has(t.id) ? false : (seen.add(t.id), true)));
}

function extractSmokeTargets(): string[] {
  const testFile = path.join(SRC, 'routes', '__tests__', 'routes-smoke.test.tsx');
  const txt = readText(testFile);
  if (!txt) return [];
  const paths: string[] = [];
  for (const m of txt.matchAll(/["'](\/[A-Za-z0-9_\-\/]+)["']/g)) paths.push(m[1]);
  // Filter to leading slash, simple heuristic
  return Array.from(new Set(paths.filter((p) => p.startsWith('/')))).sort();
}

function main() {
  const tools = parseToolsCatalog();
  const { routes, dynamic } = extractRoutesReactRouter();
  const smokeTargets = extractSmokeTargets();
  const menuProbe = extractMenuLinksFromAudit();
  let menuLinks = menuProbe.links;
  if (!menuLinks.length) menuLinks = fallbackExtractMenuLinks();

  const routeSet = new Set(routes);
  const menuSet = new Set(menuLinks);
  const smokeSet = new Set(smokeTargets);

  const items: CoverageItem[] = [];
  for (const t of tools) {
    const variants: Array<{ locale: 'fr'|'en'; path?: string; title?: string }> = [
      { locale: 'fr', path: t.routeFr, title: t.titleFr },
      { locale: 'en', path: t.routeEn, title: t.titleEn },
    ];
    for (const v of variants) {
      const pathVal = v.path || '';
      const titleVal = v.title || t.id;
      const hasRoute = !!(pathVal && routeSet.has(pathVal));
      const inMenu = v.locale === 'fr' ? (menuSet.has('/outils') || menuSet.has('/fr/outils')) : (menuSet.has('/tools') || menuSet.has('/en/tools'));
      const inSmoke = !!(pathVal && smokeSet.has(pathVal));
      const isHidden = !!t.hideFromNav;
      let status: CoverageItem['status'] = 'OK';
      let notes = '';
      if (isHidden) {
        status = 'HIDDEN_OK';
        notes = 'Hidden by design (hideFromNav)';
      } else if (!hasRoute) {
        status = 'MISSING_ROUTE';
        notes = pathVal ? `Route not found for ${pathVal}` : 'No path declared in catalog';
      } else if (!inMenu) {
        status = 'MISSING_MENU';
        notes = 'Outils/Tools page link not detected in menu links';
      } else if (!inSmoke) {
        status = 'MISSING_SMOKE';
        notes = 'Path not covered by routes smoke test';
      }
      items.push({
        id: t.id,
        title: titleVal,
        locale: v.locale,
        path: pathVal,
        hasRoute,
        inMenu,
        inSmoke,
        isHidden,
        status,
        notes,
      });
    }
  }

  const unroutedTools = Array.from(new Set(items.filter((i) => !i.hasRoute && !i.isHidden).map((i) => i.id))).sort();
  const toolsMissingInMenu = Array.from(new Set(items.filter((i) => i.hasRoute && !i.inMenu && !i.isHidden).map((i) => i.id))).sort();
  const toolsMissingInSmoke = Array.from(new Set(items.filter((i) => i.hasRoute && i.inMenu && !i.inSmoke && !i.isHidden).map((i) => i.id))).sort();

  const toolRoutes = new Set<string>();
  for (const t of tools) {
    if (t.routeFr) toolRoutes.add(t.routeFr);
    if (t.routeEn) toolRoutes.add(t.routeEn);
  }
  const routesNotInCatalog = routes.filter((r) => !toolRoutes.has(r) && !/[:*]/.test(r)).sort();

  const report: CoverageReport = {
    framework: 'react-router',
    items,
    summary: {
      totalTools: tools.length,
      unroutedTools,
      toolsMissingInMenu,
      toolsMissingInSmoke,
      routesNotInCatalog: routesNotInCatalog.slice(0, 200),
      dynamicRoutes: dynamic.slice(0, 200),
      scannedAt: new Date().toISOString(),
      notes: [
        'inMenu indicates presence of Outils/Tools link in global navigation (cards live under that page).',
        'Dynamic routes are excluded from menu candidacy by default.',
        menuProbe.source === 'audit' ? 'Menu links derived from audit-nav.json.' : 'Menu links derived from fallback scan (low confidence).',
      ],
    },
  };

  const jsonPath = path.join(REPO_ROOT, 'tools-coverage.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');

  // Group FR/EN per tool for human summary table
  const grouped = new Map<string, { fr?: CoverageItem; en?: CoverageItem; overall: CoverageItem['status'] }>();
  function computeOverall(fr?: CoverageItem, en?: CoverageItem): CoverageItem['status'] {
    const list = [fr, en].filter(Boolean) as CoverageItem[];
    const hasHidden = list.some(i => i.isHidden);
    if (hasHidden) return 'HIDDEN_OK';
    const anyMissingRoute = list.some(i => !i.hasRoute);
    if (anyMissingRoute) return 'MISSING_ROUTE';
    const anyMissingMenu = list.some(i => i.hasRoute && !i.inMenu);
    if (anyMissingMenu) return 'MISSING_MENU';
    const anyMissingSmoke = list.some(i => i.hasRoute && i.inMenu && !i.inSmoke);
    if (anyMissingSmoke) return 'MISSING_SMOKE';
    return 'OK';
  }
  for (const it of items) {
    const g = grouped.get(it.id) || { overall: 'OK' as CoverageItem['status'] };
    if (it.locale === 'fr') g.fr = it; else if (it.locale === 'en') g.en = it; else g.fr = it;
    g.overall = computeOverall(g.fr, g.en);
    grouped.set(it.id, g);
  }

  const md: string[] = [];
  md.push('# Tools Coverage Report');
  md.push('');
  md.push(`Total tools: ${report.summary.totalTools}`);
  md.push(`Unrouted tools: ${report.summary.unroutedTools.length}`);
  md.push(`Missing in menu (Outils/Tools link not found): ${report.summary.toolsMissingInMenu.length}`);
  md.push(`Missing in smoke tests: ${report.summary.toolsMissingInSmoke.length}`);
  md.push('');
  md.push('## Tableau synthèse (FR/EN)');
  for (const [id, g] of grouped) {
    const fr = g.fr; const en = g.en;
    const frStr = fr ? `${fr.path || '-'} · ${fr.status}` : '-';
    const enStr = en ? `${en.path || '-'} · ${en.status}` : '-';
    md.push(`- ${id} | FR: ${frStr} | EN: ${enStr} | Overall: ${g.overall}`);
  }
  md.push('');
  // Sections per spec
  const ok = Array.from(grouped.entries()).filter(([_, g]) => g.overall === 'OK').map(([id]) => id);
  const missingRoute = Array.from(grouped.entries()).filter(([_, g]) => g.overall === 'MISSING_ROUTE').map(([id]) => id);
  const missingMenu = Array.from(grouped.entries()).filter(([_, g]) => g.overall === 'MISSING_MENU').map(([id]) => id);
  const missingSmoke = Array.from(grouped.entries()).filter(([_, g]) => g.overall === 'MISSING_SMOKE').map(([id]) => id);
  const hiddenOk = Array.from(grouped.entries()).filter(([_, g]) => g.overall === 'HIDDEN_OK').map(([id]) => id);

  if (ok.length) { md.push('## Outils OK'); for (const id of ok) md.push('- ' + id); md.push(''); }
  if (missingRoute.length) { md.push('## Outils sans route'); for (const id of missingRoute) md.push('- ' + id); md.push(''); }
  if (missingMenu.length) { md.push('## Outils hors menu'); for (const id of missingMenu) md.push('- ' + id); md.push(''); }
  if (missingSmoke.length) { md.push('## Outils non couverts par smoke tests'); for (const id of missingSmoke) md.push('- ' + id); md.push(''); }

  // Orphelins: routes under /outils or /tools without a catalog entry
  const toolRoutesSet = new Set<string>();
  for (const t of tools) { if (t.routeFr) toolRoutesSet.add(t.routeFr); if (t.routeEn) toolRoutesSet.add(t.routeEn); }
  const orphans = routes.filter((r) => (r.startsWith('/outils') || r.startsWith('/tools')) && r !== '/outils' && r !== '/tools' && !toolRoutesSet.has(r));
  if (orphans.length) { md.push('## Orphelins (routes sous /outils|/tools sans entrée catalog)'); for (const r of Array.from(new Set(orphans))) md.push('- ' + r); md.push(''); }

  if (hiddenOk.length) { md.push('## Intentional exclusions (hideFromNav)'); for (const id of hiddenOk) md.push('- ' + id); md.push(''); }

  md.push('## Routes Not in Catalog (static)');
  for (const r of report.summary.routesNotInCatalog.slice(0, 50)) md.push('- ' + r);
  md.push('');
  md.push('Notes:');
  for (const n of report.summary.notes) md.push('- ' + n);
  md.push('- See audit-nav.md for PAGES/ROUTES/MENU discrepancies (nonMenuRoutablePages, unroutedPages).');
  md.push('');
  md.push('## Recommandations rapides');
  md.push('- Ajouter/valider le lien global vers `/outils` (FR) et `/tools` (EN) si manquant.');
  md.push('- Ajouter des cas dans `src/routes/__tests__/routes-smoke.test.tsx` pour couvrir les chemins clés.');
  md.push('- Annoter `hideFromNav` dans le catalogue si l’exclusion du menu est intentionnelle.');
  const mdPath = path.join(REPO_ROOT, 'tools-coverage.md');
  fs.writeFileSync(mdPath, md.join('\n'), 'utf8');

  // eslint-disable-next-line no-console
  console.log(`Wrote ${path.relative(REPO_ROOT, jsonPath)} and ${path.relative(REPO_ROOT, mdPath)}`);
}

main();
