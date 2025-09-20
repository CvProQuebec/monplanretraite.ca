import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Config
 */
const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'Articles Blogs');
const OUT_FR = path.join(ROOT, 'src/pages/blog/posts/fr');
const OUT_EN = path.join(ROOT, 'src/pages/blog/posts/en');

/**
 * Utils
 */
function log(...args) {
  console.log('[migrate]', ...args);
}

function isMarkdown(file) {
  return file.toLowerCase().endsWith('.md');
}

function detectLanguageFromName(name) {
  return name.includes('-EN-') ? 'en' : 'fr';
}

function extractIndexNumber(name) {
  const m = name.match(/^(\d+)-/);
  if (m) return parseInt(m[1], 10);
  return null;
}

function stripExt(filename) {
  return filename.replace(/\.md$/i, '');
}

function normalizeSlug(raw) {
  const accentMap = {
    'à': 'a', 'á': 'a', 'â': 'a', 'ä': 'a', 'ã': 'a', 'å': 'a',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'ö': 'o', 'õ': 'o',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
    'ñ': 'n', 'ç': 'c',
    'œ': 'oe', 'æ': 'ae',
  };
  let s = (raw || '').toLowerCase();
  s = s.replace(/./g, ch => accentMap[ch] ?? ch);
  s = s.replace(/%/g, ' pourcent ');
  s = s.replace(/&/g, ' et ');
  s = s.replace(/[^a-z0-9\s\-]/g, ' ');
  s = s.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return s || 'article';
}

function deriveTitle(md, filename) {
  const m = md.match(/^#\s+(.+?)\s*$/m);
  if (m) return m[1].trim();
  const base = stripExt(filename).replace(/^\d+-/, '');
  return base.replace(/[-_]+/g, ' ');
}

function deriveExcerpt(md) {
  const lines = md.split(/\r?\n/);
  for (const raw of lines) {
    const l = raw.trim();
    if (!l) continue;
    if (l.startsWith('#')) continue;
    if (l.startsWith('*Publié') || l.startsWith('*Published')) continue;
    if (l.startsWith('---') || l.startsWith('```')) continue;
    return l.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
  }
  return '';
}

function estimateReadingTime(md) {
  const text = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.round(words / 200));
}

const FR_MONTHS = {
  janvier: 0, février: 1, fevrier: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, août: 7, aout: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11, decembre: 11,
};

function parseFrenchDate(str) {
  // Handle patterns like "Publié le 18 septembre 2025" or "Publié le 18 septembre 2025 | ..."
  const m = str.toLowerCase().match(/(\d{1,2})\s+([a-z\u00E0-\u00FC]+)\s+(\d{4})/i);
  if (m) {
    const day = parseInt(m[1], 10);
    const monthName = m[2].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const monthIndex = FR_MONTHS[monthName] ?? null;
    const year = parseInt(m[3], 10);
    if (monthIndex != null) {
      const d = new Date(Date.UTC(year, monthIndex, day));
      return d.toISOString().slice(0, 10);
    }
  }
  return null;
}

function parseDateFromContent(md) {
  const lines = md.split(/\r?\n/);
  for (const l of lines) {
    if (l.toLowerCase().includes('publié le') || l.toLowerCase().includes('published')) {
      // try FR
      const fr = parseFrenchDate(l);
      if (fr) return fr;
      // try native parse for EN "Published September 18, 2025"
      const m = l.match(/Published\s+(.+)\|?|\*Published\s+(.+)\*/i);
      const dateStr = m ? (m[1] || m[2]) : l;
      const parsed = Date.parse(dateStr);
      if (!Number.isNaN(parsed)) {
        return new Date(parsed).toISOString().slice(0, 10);
      }
    }
  }
  // fallback today
  return new Date().toISOString().slice(0, 10);
}

function mapCategoryByIndex(idx) {
  if (idx == null) return 'Les bases de la retraite';
  if (idx >= 1 && idx <= 10) return 'Les bases de la retraite';
  if (idx >= 11 && idx <= 15) return 'Comprendre les régimes gouvernementaux';
  if (idx >= 16 && idx <= 20) return 'Gérer son épargne et ses placements';
  if (idx >= 21 && idx <= 24) return 'Planification pour les couples';
  if (idx >= 25 && idx <= 27) return 'Défis spécifiques aux femmes';
  if (idx >= 28 && idx <= 32) return 'Aspects pratiques et quotidiens';
  if (idx >= 33 && idx <= 35) return 'Fiscalité simplifiée';
  if (idx >= 36 && idx <= 38) return 'Sujets saisonniers et d’actualité';
  if (idx >= 39 && idx <= 41) return 'Outils et ressources';
  if (idx >= 42 && idx <= 45) return 'Bien-être et qualité de vie';
  return 'Les bases de la retraite';
}

function standardizeTags(title, content) {
  const t = (title + ' ' + content.slice(0, 500)).toLowerCase();
  const tags = new Set();
  if (t.includes('rrq') || t.includes('rpc') || t.includes('qpp')) tags.add('RRQ');
  if (t.includes('sécurité de la vieillesse') || t.includes('sv') || t.includes('oas')) tags.add('SV');
  if (t.includes('reer') || t.includes('rrsp')) tags.add('REER');
  if (t.includes('celi') || t.includes('tfsa')) tags.add('CELI');
  if (t.includes('budget')) tags.add('budget');
  if (t.includes('impôt') || t.includes('impot') || t.includes('tax')) tags.add('fiscalité');
  if (t.includes('retraite') || t.includes('retirement')) tags.add('retraite');
  if (tags.size === 0) tags.add('retraite');
  return Array.from(tags);
}

/**
 * Main
 */
async function ensureDirs() {
  await fs.mkdir(OUT_FR, { recursive: true });
  await fs.mkdir(OUT_EN, { recursive: true });
}

async function readAllMdFiles() {
  const entries = await fs.readdir(SRC_DIR, { withFileTypes: true });
  const files = entries.filter(e => e.isFile() && isMarkdown(e.name)).map(e => e.name);
  return files;
}

async function run() {
  await ensureDirs();
  const files = await readAllMdFiles();

  // First pass: collect meta
  const registry = []; // { idx, lang, filename, title, slug }
  const rawMap = new Map(); // filename -> content
  for (const filename of files) {
    const full = path.join(SRC_DIR, filename);
    const content = await fs.readFile(full, 'utf8');
    rawMap.set(filename, content);

    const lang = detectLanguageFromName(filename);
    const idx = extractIndexNumber(filename);
    const title = deriveTitle(content, filename);
    const slug = normalizeSlug(title);
    registry.push({ idx, lang, filename, title, slug });
  }

  // Build quick lookup by index
  const byIndex = new Map();
  for (const item of registry) {
    if (item.idx == null) continue;
    if (!byIndex.has(item.idx)) byIndex.set(item.idx, {});
    const obj = byIndex.get(item.idx);
    obj[item.lang] = item;
  }

  // Second pass: write files with front-matter
  for (const meta of registry) {
    const { idx, lang, filename, title } = meta;
    const content = rawMap.get(filename);
    const category = mapCategoryByIndex(idx);
    const date = parseDateFromContent(content);
    const excerpt = deriveExcerpt(content);
    const readingTime = estimateReadingTime(content);
    const tags = standardizeTags(title, content);
    const related = idx != null ? byIndex.get(idx) : null;
    const relatedSlugFr = related && related.fr ? related.fr.slug : undefined;
    const relatedSlugEn = related && related.en ? related.en.slug : undefined;

    // Compose front-matter
    const fm = {
      title,
      slug: normalizeSlug(title),
      date,
      excerpt,
      tags,
      category,
      language: lang,
      status: 'published',
      readingTime,
      oqlfChecked: false,
      relatedSlugFr,
      relatedSlugEn,
    };

    const outDir = lang === 'en' ? OUT_EN : OUT_FR;
    const outName = `${fm.slug}.md`;
    const outPath = path.join(outDir, outName);

    // If the source contained existing front-matter, strip it to avoid nesting
    const parsed = matter(content);
    const body = parsed.content.trim();

    // Remove undefined/null keys to avoid YAML dumping errors
    const fmClean = Object.fromEntries(Object.entries(fm).filter(([, v]) => v !== undefined && v !== null));
    const fileOut = matter.stringify(body, fmClean);
    await fs.writeFile(outPath, fileOut, 'utf8');
    log(`${filename} -> ${path.relative(ROOT, outPath)}`);
  }

  log('Done. Total files:', registry.length);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
