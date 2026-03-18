import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import yaml from 'js-yaml';

const DEFAULT_PIPELINE_ROOT = 'C:\\Users\\riven\\MonPlanRetraiteTranscriptMaster';
const DEFAULT_SOURCE_FR = path.join(DEFAULT_PIPELINE_ROOT, 'Blog');
const DEFAULT_SOURCE_EN = path.join(DEFAULT_PIPELINE_ROOT, 'BlogEN');
const DEFAULT_TARGET_FR = path.join(process.cwd(), 'src', 'pages', 'blog', 'posts', 'fr');
const DEFAULT_TARGET_EN = path.join(process.cwd(), 'src', 'pages', 'blog', 'posts', 'en');

const CATEGORY_DEFS = [
  {
    fr: 'Les bases de la retraite',
    en: 'Retirement Basics',
    aliases: [
      'Les bases de la retraite',
      'Retirement Basics',
      'Retirement basics',
      'Planification de la retraite',
      'Retirement Planning',
    ],
  },
  {
    fr: 'Revenus de retraite',
    en: 'Retirement Income',
    aliases: [
      'Revenus de retraite',
      'Retirement Income',
      'Comprendre les régimes gouvernementaux',
      'Government programs',
      'Pension Plans',
      'Régimes de retraite',
    ],
  },
  {
    fr: 'Fiscalité',
    en: 'Taxation',
    aliases: [
      'Fiscalité',
      'Taxation',
      'Fiscalité simplifiée',
      'Simple taxation',
      'Sujets saisonniers et d’actualité',
      "Sujets saisonniers et d'actualité",
      'Seasonal and current topics',
    ],
  },
  {
    fr: 'Investissements',
    en: 'Investments',
    aliases: [
      'Investissements',
      'Investments',
      'Gérer son épargne et ses placements',
      'Manage savings and investments',
    ],
  },
  {
    fr: 'Planification successorale',
    en: 'Estate Planning',
    aliases: [
      'Planification successorale',
      'Estate Planning',
    ],
  },
  {
    fr: 'Santé et bien-être',
    en: 'Health & Wellness',
    aliases: [
      'Santé et bien-être',
      'Health & Wellness',
      'Bien-être et qualité de vie',
      'Well-being and quality of life',
      'Défis spécifiques aux femmes',
      'Women-specific challenges',
    ],
  },
  {
    fr: 'Couple et famille',
    en: 'Couple & Family',
    aliases: [
      'Couple et famille',
      'Couple & Family',
      'Planification pour les couples',
      'Planning for couples',
    ],
  },
  {
    fr: 'Budget et dépenses',
    en: 'Budget & Expenses',
    aliases: [
      'Budget et dépenses',
      'Budget & Expenses',
      'Aspects pratiques et quotidiens',
      'Practical everyday aspects',
    ],
  },
  {
    fr: 'Outils et ressources',
    en: 'Tools & Resources',
    aliases: [
      'Outils et ressources',
      'Tools & Resources',
      'Tools and resources',
    ],
  },
];

const DEFAULT_CATEGORY = {
  fr: CATEGORY_DEFS[0].fr,
  en: CATEGORY_DEFS[0].en,
};

const CATEGORY_LOOKUP = new Map();
for (const category of CATEGORY_DEFS) {
  for (const alias of [category.fr, category.en, ...category.aliases]) {
    CATEGORY_LOOKUP.set(normalizeLookupKey(alias), category);
  }
}

function parseArgs(argv) {
  const args = {
    sourceFr: DEFAULT_SOURCE_FR,
    sourceEn: DEFAULT_SOURCE_EN,
    targetFr: DEFAULT_TARGET_FR,
    targetEn: DEFAULT_TARGET_EN,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--source-fr') args.sourceFr = argv[++i];
    else if (arg === '--source-en') args.sourceEn = argv[++i];
    else if (arg === '--target-fr') args.targetFr = argv[++i];
    else if (arg === '--target-en') args.targetEn = argv[++i];
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--help') {
      printHelp();
      process.exit(0);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/sync-generated-blog-posts.mjs [options]

Options:
  --source-fr <dir>   Source folder for French articles
  --source-en <dir>   Source folder for English articles
  --target-fr <dir>   Destination folder for French markdown files
  --target-en <dir>   Destination folder for English markdown files
  --dry-run           Preview copy/update actions without writing files
  --help              Show this help
`);
}

function extractFrontMatter(raw) {
  const match = raw.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]?/);
  if (!match) {
    return {
      data: {},
      body: raw.replace(/^\uFEFF/, ''),
    };
  }

  return {
    data: yaml.load(match[1]) || {},
    body: raw.slice(match[0].length),
  };
}

function ensureMarkdownFilename(frontMatter, fallbackName) {
  const slug = typeof frontMatter.slug === 'string' ? normalizeSlug(frontMatter.slug) : '';
  const fileBase = slug || fallbackName.replace(/\.md$/i, '');
  return fileBase.endsWith('.md') ? fileBase : `${fileBase}.md`;
}

async function listMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
    .map((entry) => path.join(dir, entry.name));
}

function normalizeLookupKey(value) {
  return String(value || '')
    .trim()
    .replace(/^"(.+)"$/, '$1')
    .replace(/[’]/g, "'")
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function normalizeSlug(value) {
  return String(value || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function deriveTitle(body, fallbackName) {
  const headingMatch = body.match(/^#\s+(.+)$/m);
  if (headingMatch) return headingMatch[1].trim();

  const fallbackSlug = fallbackName.replace(/\.md$/i, '');
  return fallbackSlug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function deriveExcerpt(body) {
  const lines = body.split(/\r?\n/);
  for (const line of lines) {
    const clean = line.trim();
    if (!clean) continue;
    if (clean.startsWith('#')) continue;
    if (clean.startsWith('*Publié') || clean.startsWith('*Published')) continue;
    if (clean === '---') continue;

    const excerpt = clean
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .trim();

    return excerpt.length > 280 ? `${excerpt.slice(0, 277).trim()}...` : excerpt;
  }

  return '';
}

function ensureISODate(value, fallback) {
  const candidate = typeof value === 'string' ? value.trim() : '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(candidate)) return candidate;

  if (candidate) {
    const parsed = Date.parse(candidate);
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString().slice(0, 10);
  }

  return fallback;
}

function normalizeCategory(value, expectedLanguage) {
  const category = CATEGORY_LOOKUP.get(normalizeLookupKey(value));
  if (!category) return DEFAULT_CATEGORY[expectedLanguage];
  return expectedLanguage === 'fr' ? category.fr : category.en;
}

function sanitizeFrontMatter(frontMatter, body, fallbackName, expectedLanguage) {
  const title = String(frontMatter.title || '').trim() || deriveTitle(body, fallbackName);
  const slug = normalizeSlug(frontMatter.slug || fallbackName.replace(/\.md$/i, '') || title);
  const date = ensureISODate(frontMatter.date, new Date().toISOString().slice(0, 10));
  const lastUpdated = ensureISODate(frontMatter.lastUpdated, date);
  const excerpt = String(frontMatter.excerpt || '').trim() || deriveExcerpt(body);
  const category = normalizeCategory(frontMatter.category, expectedLanguage);
  const language = expectedLanguage;

  const sanitized = {
    title,
    slug,
    date,
    lastUpdated,
    excerpt,
    category,
    language,
  };

  for (const key of [
    'tags',
    'status',
    'readingTime',
    'coverImage',
    'sources',
    'oqlfChecked',
    'relatedSlugFr',
    'relatedSlugEn',
    'keyPoints',
    'featured',
    'priority',
    'collection',
  ]) {
    if (frontMatter[key] !== undefined && frontMatter[key] !== null && frontMatter[key] !== '') {
      sanitized[key] = frontMatter[key];
    }
  }

  return sanitized;
}

function stringifyMarkdown(frontMatter, body) {
  const yamlBlock = yaml.dump(frontMatter, {
    lineWidth: 1000,
    noRefs: true,
    quotingType: "'",
    forceQuotes: false,
  }).trimEnd();

  const normalizedBody = body.replace(/^\s+/, '').trimEnd();
  return `---\n${yamlBlock}\n---\n\n${normalizedBody}\n`;
}

async function syncLanguage({ sourceDir, targetDir, expectedLanguage, dryRun }) {
  const files = await listMarkdownFiles(sourceDir);
  const summary = {
    language: expectedLanguage,
    scanned: files.length,
    copied: 0,
    updated: 0,
    unchanged: 0,
    skipped: [],
  };

  await fs.mkdir(targetDir, { recursive: true });

  for (const filePath of files) {
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      const { data, body } = extractFrontMatter(raw);
      const sanitizedFrontMatter = sanitizeFrontMatter(data, body, path.basename(filePath), expectedLanguage);
      const targetName = ensureMarkdownFilename(sanitizedFrontMatter, path.basename(filePath));
      const targetPath = path.join(targetDir, targetName);
      const normalizedRaw = stringifyMarkdown(sanitizedFrontMatter, body);

      let previous = null;
      try {
        previous = await fs.readFile(targetPath, 'utf8');
      } catch {
        previous = null;
      }

      if (previous === normalizedRaw) {
        summary.unchanged += 1;
        continue;
      }

      if (!dryRun) {
        await fs.writeFile(targetPath, normalizedRaw, 'utf8');
      }

      if (previous == null) summary.copied += 1;
      else summary.updated += 1;
    } catch (error) {
      summary.skipped.push({
        file: path.basename(filePath),
        errors: [error instanceof Error ? error.message : String(error)],
      });
    }
  }

  return summary;
}

function printSummary(summary) {
  console.log(`\n[${summary.language.toUpperCase()}] ${summary.scanned} fichiers analysés`);
  console.log(`  Nouveaux : ${summary.copied}`);
  console.log(`  Mis à jour : ${summary.updated}`);
  console.log(`  Inchangés : ${summary.unchanged}`);
  if (summary.skipped.length > 0) {
    console.log(`  Ignorés : ${summary.skipped.length}`);
    for (const item of summary.skipped) {
      console.log(`    - ${item.file}: ${item.errors.join('; ')}`);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const summaries = await Promise.all([
    syncLanguage({
      sourceDir: args.sourceFr,
      targetDir: args.targetFr,
      expectedLanguage: 'fr',
      dryRun: args.dryRun,
    }),
    syncLanguage({
      sourceDir: args.sourceEn,
      targetDir: args.targetEn,
      expectedLanguage: 'en',
      dryRun: args.dryRun,
    }),
  ]);

  console.log(args.dryRun ? 'Simulation de synchronisation terminée.' : 'Synchronisation terminée.');
  summaries.forEach(printSummary);
}

main().catch((error) => {
  console.error('Erreur pendant la synchronisation des articles générés :');
  console.error(error);
  process.exit(1);
});
