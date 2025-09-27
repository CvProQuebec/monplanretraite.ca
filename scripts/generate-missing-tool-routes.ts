/*
  scripts/generate-missing-tool-routes.ts
  Routes Integrator (read-only generator)
  - Reads tools-coverage.json
  - Generates bilingual route stubs for items with status === 'MISSING_ROUTE'
  - Emits files under generated/fix-tools/ only (no src/** changes)
  - Placeholders are feature-flagged by VITE_SHOW_PLACEHOLDERS; otherwise Navigate to /outils
*/
import * as fs from 'fs';
import * as path from 'path';

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
  items: CoverageItem[];
};

const REPO_ROOT = process.cwd();
const OUT_DIR = path.join(REPO_ROOT, 'generated', 'fix-tools');

function readJSON(p: string): any | null {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function ensureDir(d: string) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function buildRoutesTsx(stubs: Array<{ id: string; locale: 'fr'|'en'; title: string; path: string }>): string {
  const lines: string[] = [];
  lines.push("/* GENERATED: do not edit by hand. Safe, add-only route stubs. */");
  lines.push("import React from 'react';");
  lines.push("import { Navigate } from 'react-router-dom';");
  lines.push("import type { RouteObject } from 'react-router';");
  lines.push("import { ToolPlaceholder } from './ToolPlaceholder';");
  lines.push('');
  lines.push('const SHOW_PLACEHOLDERS = (typeof importMeta !== \"undefined\" ? (importMeta as any) : (import.meta as any))?.env?.VITE_SHOW_PLACEHOLDERS === "true" as boolean;');
  lines.push('');
  lines.push('function placeholder(id: string, title: string) {');
  lines.push('  return SHOW_PLACEHOLDERS ? (<ToolPlaceholder id={id} title={title} />) : (<Navigate to="/outils" replace />);');
  lines.push('}');
  lines.push('');
  lines.push('export const GENERATED_TOOL_ROUTES: RouteObject[] = [');
  for (const s of stubs) {
    lines.push(`  { path: ${JSON.stringify(s.path)}, element: placeholder(${JSON.stringify(s.id)}, ${JSON.stringify(s.title)}) },`);
  }
  lines.push('];');
  lines.push('');
  return lines.join('\n');
}

function buildPlaceholderTsx(): string {
  return `/* GENERATED: ToolPlaceholder (safe, neutral) */\nimport React from 'react';\n\nexport function ToolPlaceholder({ id, title }: { id: string; title: string }) {\n  return (\n    <section aria-labelledby=\"tool-placeholder-title\" style={{ padding: 24 }}>\n      <h1 id=\"tool-placeholder-title\" style={{ fontSize: 28, marginBottom: 8 }}>{title}</h1>\n      <p style={{ fontSize: 18, color: '#334155' }}>\n        Cette page est en préparation ({id}). Activez VITE_SHOW_PLACEHOLDERS=true en développement pour visualiser les gabarits.\n      </p>\n      <p style={{ fontSize: 16, color: '#475569', marginTop: 12 }}>\n        En production (flag OFF), ces routes redirigent vers /outils.\n      </p>\n    </section>\n  );\n}\n`;
}

function buildReadme(total: number, menuMissing: number, ids: string[]): string {
  return `# Fix Tools � Generated Route Stubs\n\nWhat\n- Adds React Router stubs for tools missing routes (using catalog paths routeFr/routeEn).\n- Placeholders are gated by VITE_SHOW_PLACEHOLDERS (default OFF); otherwise redirects to /outils.\n\nHow to use\n1) Import and spread into your router where appropriate (e.g., next to other route arrays):\n\n   import { GENERATED_TOOL_ROUTES } from '../../generated/fix-tools/ROUTES.react-router';\n   // If using array-based routes: const routes = [...baseRoutes, ...GENERATED_TOOL_ROUTES];\n   // If using <Routes>, you can map these objects to <Route> elements.\n\n2) Ensure VITE_SHOW_PLACEHOLDERS remains false in production.\n\nScope\n- No changes under src/**. You may delete this folder once proper pages are implemented.\n\nSummary\n- Routes generated: ${total}\n- Tools missing menu (see MENU.missing.csv): ${menuMissing}\n- Affected tool ids: ${ids.join(', ')}\n`;
}

function buildMenuCsv(rows: Array<{ id: string; titleFr: string; titleEn: string; frPath: string; enPath: string }>): string {
  const header = 'id,titleFr,titleEn,frPath,enPath';
  const data = rows.map(r => [r.id, r.titleFr, r.titleEn, r.frPath, r.enPath].map(v => '"' + (v || '') + '"').join(','));
  return [header, ...data].join('\n');
}

function main() {
  const covPath = path.join(REPO_ROOT, 'tools-coverage.json');
  const cov = readJSON(covPath) as CoverageReport | null;
  if (!cov || !Array.isArray(cov.items)) {
    console.error('tools-coverage.json not found or invalid. Run: npm run audit:tools');
    process.exit(1);
  }

  // Build stubs from items with MISSING_ROUTE
  const stubs: Array<{ id: string; locale: 'fr'|'en'; title: string; path: string }> = [];
  const titles = new Map<string, { fr?: string; en?: string }>();
  const idsMissingRoute = new Set<string>();
  for (const it of cov.items as CoverageItem[]) {
    if (it.locale === 'fr') {
      const t = titles.get(it.id) || {}; t.fr = it.title; titles.set(it.id, t);
    } else if (it.locale === 'en') {
      const t = titles.get(it.id) || {}; t.en = it.title; titles.set(it.id, t);
    }
    if (it.status === 'MISSING_ROUTE' && (it.locale === 'fr' || it.locale === 'en')) {
      if (it.path && it.path.startsWith('/')) {
        stubs.push({ id: it.id, locale: it.locale, title: it.title, path: it.path });
      }
      idsMissingRoute.add(it.id);
    }
  }

  // Compute menu-missing grouped rows
  const menuRows = new Map<string, { id: string; titleFr: string; titleEn: string; frPath: string; enPath: string }>();
  for (const it of cov.items as CoverageItem[]) {
    if (it.status === 'MISSING_MENU' && (it.locale === 'fr' || it.locale === 'en')) {
      const row = menuRows.get(it.id) || { id: it.id, titleFr: '', titleEn: '', frPath: '', enPath: '' };
      if (it.locale === 'fr') { row.titleFr = it.title; row.frPath = it.path; }
      if (it.locale === 'en') { row.titleEn = it.title; row.enPath = it.path; }
      menuRows.set(it.id, row);
    }
  }

  ensureDir(OUT_DIR);
  const routesTsx = buildRoutesTsx(stubs);
  const placeholderTsx = buildPlaceholderTsx();
  const readme = buildReadme(stubs.length, menuRows.size, Array.from(idsMissingRoute));
  const menuCsv = buildMenuCsv(Array.from(menuRows.values()));

  fs.writeFileSync(path.join(OUT_DIR, 'ROUTES.react-router.tsx'), routesTsx, 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, 'ToolPlaceholder.tsx'), placeholderTsx, 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, 'README.fix-tools.md'), readme, 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, 'MENU.missing.csv'), menuCsv, 'utf8');

  const summary = {
    addedRoutesCount: stubs.length,
    missingMenuCount: menuRows.size,
    affectedToolIds: Array.from(idsMissingRoute).sort(),
  };
  // Print console summary
  console.log('Fix-Tools Summary');
  console.table(summary);

  // Exit code rule: 0 if no MISSING_ROUTE and no MISSING_MENU, 1 otherwise
  const hasCritical = stubs.length > 0 || menuRows.size > 0;
  process.exit(hasCritical ? 1 : 0);
}

main();

