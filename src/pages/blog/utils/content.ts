import yaml from 'js-yaml';
import {
  BLOG_CATEGORIES,
  getCategoryDisplayLabel,
  getCategoryDescription,
  normalizeCategoryLabel,
  sortCategories,
  type BlogLanguage,
} from './categories';

/**
 * Types
 */
export type BlogFrontMatter = {
  title: string;
  slug?: string;
  date?: string; // ISO YYYY-MM-DD
  excerpt?: string;
  tags?: string[];
  category?: string;
  language?: 'fr' | 'en';
  status?: 'draft' | 'published';
  readingTime?: number;
  coverImage?: string;
  sources?: string[];
  oqlfChecked?: boolean;
  relatedSlugFr?: string;
  relatedSlugEn?: string;
  keyPoints?: string[];
  featured?: boolean;
  priority?: number;
  collection?: string;
};

export type BlogPost = {
  id: string;
  language: 'fr' | 'en';
  slug: string;
  title: string;
  seoTitle: string;
  date: string; // ISO
  excerpt: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published';
  readingTime: number;
  coverImage?: string;
  sources?: string[];
  oqlfChecked?: boolean;
  relatedSlugFr?: string;
  relatedSlugEn?: string;
  keyPoints?: string[];
  featured?: boolean;
  priority?: number;
  collection?: string;
  content: string; // raw markdown (without front-matter)
  path: string; // virtual module path
};

/**
 * Utilities
 */
const wordsPerMinute = 200;

/**
 * Text helpers - be resilient to non-string inputs
 */
// Remove any spaces placed before ! or ? (OQLF: no space before !?)
function fixPunctuation(input: unknown): string {
  const s = typeof input === 'string' ? input : (input == null ? '' : String(input));
  return s.replace(/\s+([!?])/g, '$1');
}

function estimateReadingTime(markdown: string): number {
  // Roughly strip markdown formatting to count words
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

function deriveExcerpt(md: string): string {
  // Take first non-empty paragraph (skip headings and metadata lines)
  const lines = md.split(/\r?\n/);
  for (const line of lines) {
    const l = line.trim();
    if (!l) continue;
    if (l.startsWith('#')) continue;
    if (l.startsWith('*Publié') || l.startsWith('*Published')) continue;
    if (l.startsWith('---') || l.startsWith('```')) continue;
    // Strip markdown emphasis
    return l.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
  }
  return '';
}

function stripMarkdownDecorations(input: string): string {
  return input
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeTitleText(input: unknown): string {
  const raw = fixPunctuation(input)
    .replace(/''/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  return raw
    .replace(/\s+-\s+/g, ' : ')
    .replace(/\s+:\s+/g, ' : ')
    .replace(/\s+\|\s+/g, ' | ');
}

function deriveSeoExcerpt(md: string): string {
  const paragraphs = md
    .split(/\r?\n\r?\n/)
    .map((p) => stripMarkdownDecorations(p))
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !p.startsWith('#'))
    .filter((p) => !/^Updated\b/i.test(p))
    .filter((p) => !/^Published\b/i.test(p))
    .filter((p) => !/^Mis à jour\b/i.test(p))
    .filter((p) => !/^Publié\b/i.test(p))
    .filter((p) => p.length > 45);

  return paragraphs[0] || deriveExcerpt(md);
}

function clampExcerpt(input: string, max = 165): string {
  if (input.length <= max) return input;

  const sentenceBreak = input.slice(0, max + 15).match(/^(.+?[.!?])(?:\s|$)/);
  if (sentenceBreak && sentenceBreak[1].length >= 110) {
    return sentenceBreak[1].trim();
  }

  const clipped = input.slice(0, max);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, lastSpace > 90 ? lastSpace : max).trim()}...`;
}

function normalizeExcerptText(input: unknown, content: string): string {
  let excerpt = fixPunctuation(input)
    .replace(/^>-\s*/g, '')
    .replace(/''/g, "'")
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  excerpt = stripMarkdownDecorations(excerpt);

  if (
    !excerpt ||
    excerpt.length < 100 ||
    excerpt.length > 220 ||
    /^Updated\b/i.test(excerpt) ||
    /^Published\b/i.test(excerpt) ||
    /^Mis à jour\b/i.test(excerpt) ||
    /^Publié\b/i.test(excerpt)
  ) {
    excerpt = stripMarkdownDecorations(deriveSeoExcerpt(content));
  }

  return clampExcerpt(excerpt);
}

export function buildArticleSeoTitle(title: string): string {
  const cleanTitle = normalizeTitleText(title);
  return `${cleanTitle} | MonPlanRetraite.ca`;
}

function ensureISODate(input?: string): string {
  if (!input) return new Date().toISOString().slice(0, 10);
  // accept "Publié le 18 septembre 2025" etc. Fallback to today.
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  const parsed = Date.parse(input);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

function normalizeSlug(raw: string): string {
  // lower, remove accents, spaces to dashes, remove invalid chars, convert % to 'pourcent'
  const map: Record<string, string> = {
    à: 'a', á: 'a', â: 'a', ä: 'a', ã: 'a', å: 'a',
    è: 'e', é: 'e', ê: 'e', ë: 'e',
    ì: 'i', í: 'i', î: 'i', ï: 'i',
    ò: 'o', ó: 'o', ô: 'o', ö: 'o', õ: 'o',
    ù: 'u', ú: 'u', û: 'u', ü: 'u',
    ñ: 'n', ç: 'c',
    œ: 'oe', æ: 'ae'
  };
  let s = raw.toLowerCase();
  s = s.replace(/./g, (ch) => map[ch as keyof typeof map] ?? ch);
  s = s.replace(/%/g, ' pourcent ');
  s = s.replace(/&/g, ' et ');
  s = s.replace(/[^a-z0-9\s\-]/g, ' ');
  s = s.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return s;
}

/**
 * Simple front-matter parser (YAML between --- blocks).
 */
function parseFrontMatter(raw: string): { data: Partial<BlogFrontMatter>; content: string } {
  const match = raw.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]?/);
  if (match) {
    let data: any = {};
    try {
      data = yaml.load(match[1]) || {};
    } catch {
      data = {};
    }
    const body = raw.slice(match[0].length);
    return { data, content: body };
  }
  return { data: {}, content: raw };
}

/**
 * Load all markdown posts at build/run-time using Vite import glob.
 * We load raw and parse front-matter with a lightweight parser.
 */
const modules = import.meta.glob('../posts/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

type LoadedPost = {
  fm: BlogFrontMatter;
  content: string;
  virtualPath: string;
  derivedLanguage: 'fr' | 'en';
  filename: string;
};

function loadAll(): LoadedPost[] {
  const results: LoadedPost[] = [];
  for (const [pathKey, raw] of Object.entries(modules)) {
    const fileContent = raw as unknown as string;
    const { data, content } = parseFrontMatter(fileContent);
    const fm = (data || {}) as BlogFrontMatter;
    // language from fm or directory segment
    const derivedLanguage: 'fr' | 'en' =
      (fm.language as 'fr' | 'en') ??
      (pathKey.includes('/fr/') ? 'fr' : pathKey.includes('/en/') ? 'en' : 'fr');
    // filename (for default slug)
    const filename = pathKey.split('/').pop() || '';
    results.push({ fm, content, virtualPath: pathKey, derivedLanguage, filename });
  }
  return results;
}

let cacheAllPosts: BlogPost[] | null = null;

function buildCache(): BlogPost[] {
  const loaded = loadAll();
  const posts: BlogPost[] = loaded.map(({ fm, content, virtualPath, derivedLanguage, filename }) => {
    const rawTitle = (fm.title as unknown) || deriveTitleFromContent(content, filename);
    const title = normalizeTitleText(rawTitle);
    const slug = fm.slug ? normalizeSlug(fm.slug) : normalizeSlug(title);
    const date = ensureISODate(fm.date);
    const readingTime = typeof fm.readingTime === 'number' ? fm.readingTime : estimateReadingTime(content);
    const rawExcerpt = (fm.excerpt as unknown) || deriveExcerpt(content);
    const excerpt = normalizeExcerptText(rawExcerpt, content);
    // Normalize tags: allow string (comma/space separated) or array
    const normalizedTags: string[] = Array.isArray(fm.tags)
      ? (fm.tags as unknown[]).map((t) => fixPunctuation(t).toLowerCase()).filter(Boolean)
      : (typeof (fm as any).tags === 'string'
          ? (fm as any).tags.split(/[,\s]+/).map((t: string) => t.trim().toLowerCase()).filter(Boolean)
          : []);
    const tags = normalizedTags.length > 0 ? normalizedTags : standardizeTagsFromTitle(title);
    const categoryRaw = typeof fm.category === 'string' ? fm.category : 'Les bases de la retraite';
    const category = normalizeCategory(categoryRaw);
    const status = (fm.status ?? 'published') as 'draft' | 'published';

    const post: BlogPost = {
      id: virtualPath,
      language: derivedLanguage,
      slug,
      title,
      seoTitle: buildArticleSeoTitle(title),
      date,
      excerpt,
      tags,
      category,
      status,
      readingTime,
      coverImage: fm.coverImage,
      sources: fm.sources,
      oqlfChecked: fm.oqlfChecked,
      relatedSlugFr: fm.relatedSlugFr,
      relatedSlugEn: fm.relatedSlugEn,
      // keyPoints may be string or array; coerce to string[]
      keyPoints: Array.isArray(fm.keyPoints)
        ? (fm.keyPoints as unknown[]).map((kp) => fixPunctuation(kp)).filter(Boolean)
        : (typeof (fm as any).keyPoints === 'string'
            ? [fixPunctuation((fm as any).keyPoints)]
            : undefined),
      featured: (fm as any).featured === true,
      priority: typeof (fm as any).priority === 'number' ? (fm as any).priority : undefined,
      collection: (fm as any).collection as string | undefined,
      content,
      path: virtualPath,
    };
    return post;
  });

  // de-duplicate by language+slug; prefer published, then most recent date
  const mapByKey = new Map<string, BlogPost>();
  for (const p of posts) {
    const key = `${p.language}:${p.slug}`;
    const existing = mapByKey.get(key);
    if (!existing) {
      mapByKey.set(key, p);
    } else {
      const pick =
        (p.status === 'published' && existing.status !== 'published') ? p :
        (existing.status === 'published' && p.status !== 'published') ? existing :
        (p.date > existing.date ? p : existing);
      mapByKey.set(key, pick);
    }
  }
  const deduped = Array.from(mapByKey.values());

  // sort desc by date then title
  deduped.sort((a, b) => {
    if (a.date === b.date) return a.title.localeCompare(b.title);
    return a.date > b.date ? -1 : 1;
  });

  return deduped;
}

function deriveTitleFromContent(md: string, filename: string): string {
  const m = md.match(/^#\s+(.+)$/m);
  if (m) return m[1].trim();
  // fallback: filename without extension and ordering prefix
  const base = filename.replace(/\.md$/i, '');
  return base.replace(/^\d+-/, '').replace(/[-_]+/g, ' ');
}

function standardizeTagsFromTitle(title: string): string[] {
  const t = title.toLowerCase();
  const tags: Set<string> = new Set();
  if (t.includes('rrq') || t.includes('rpc') || t.includes('qpp')) tags.add('RRQ');
  if (t.includes('sécurité de la vieillesse') || t.includes('oas') || t.includes('sv')) tags.add('SV');
  if (t.includes('reer') || t.includes('rrsp')) tags.add('REER');
  if (t.includes('celi') || t.includes('tfsa')) tags.add('CELI');
  if (t.includes('budget')) tags.add('budget');
  if (t.includes('impôt') || t.includes('tax')) tags.add('fiscalité');
  if (t.includes('retraite') || t.includes('retirement')) tags.add('retraite');
  if (tags.size === 0) tags.add('retraite');
  return Array.from(tags);
}

function normalizeCategory(cat: string): string {
  return normalizeCategoryLabel(cat);
}

/**
 * Public API
 */
export function getAllPosts(language?: 'fr' | 'en'): BlogPost[] {
  if (!cacheAllPosts) {
    cacheAllPosts = buildCache();
  }
  return language ? cacheAllPosts.filter(p => p.language === language && p.status === 'published') : cacheAllPosts;
}

export function getPostBySlug(slug: string, language?: 'fr' | 'en'): BlogPost | undefined {
  const all = getAllPosts(undefined);
  return all.find(p => p.slug === slug && (!language || p.language === language));
}

export function getPrevNext(slug: string, language?: 'fr' | 'en'): { prev?: BlogPost; next?: BlogPost } {
  const list = getAllPosts(language);
  const idx = list.findIndex(p => p.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? list[idx - 1] : undefined,
    next: idx < list.length - 1 ? list[idx + 1] : undefined,
  };
}

/**
 * Categories helper (static list for filters if needed)
 */
export { BLOG_CATEGORIES, getCategoryDisplayLabel, getCategoryDescription };

/**
 * Helpers for categories and featured curation
 */
export function getAvailableCategories(language?: BlogLanguage): string[] {
  const list = getAllPosts(language);
  return sortCategories(list.map((post) => post.category || BLOG_CATEGORIES[0]));
}

export function getCategoryCounts(language?: BlogLanguage): { category: string; count: number }[] {
  const list = getAllPosts(language);
  const map = new Map<string, number>();
  for (const p of list) {
    const c = p.category || BLOG_CATEGORIES[0];
    map.set(c, (map.get(c) || 0) + 1);
  }
  return getAvailableCategories(language).map((c) => ({ category: c, count: map.get(c) || 0 }));
}

export function slugifyCategory(cat: string): string {
  return cat
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function resolveCategorySlug(slug: string, language?: BlogLanguage): string | undefined {
  return getAvailableCategories(language).find((c) => slugifyCategory(c) === slug);
}

export function getPostsByCategorySlug(slug: string, language?: BlogLanguage) {
  const cat = resolveCategorySlug(slug, language);
  if (!cat) return [];
  return getAllPosts(language).filter((p) => p.category === cat);
}

export function getFeaturedPosts(language?: 'fr' | 'en') {
  const all = getAllPosts(language);
  const featured = all.filter((p) => p.featured);
  if (featured.length > 0) {
    return [...featured].sort((a, b) => {
      const pa = a.priority ?? 999;
      const pb = b.priority ?? 999;
      if (pa !== pb) return pa - pb;
      return a.date > b.date ? -1 : 1;
    });
  }
  // Fallback: latest posts
  return all.slice(0, 6);
}
