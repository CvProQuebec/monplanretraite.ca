export type BlogLanguage = 'fr' | 'en';

export type BlogCategoryDef = {
  key: string;
  fr: string;
  en: string;
  aliases: string[];
};

export const BLOG_TAXONOMY: BlogCategoryDef[] = [
  {
    key: 'retirement-basics',
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
    key: 'retirement-income',
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
    key: 'taxation',
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
    key: 'investments',
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
    key: 'estate-planning',
    fr: 'Planification successorale',
    en: 'Estate Planning',
    aliases: [
      'Planification successorale',
      'Estate Planning',
    ],
  },
  {
    key: 'health-wellness',
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
    key: 'couple-family',
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
    key: 'budget-expenses',
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
    key: 'tools-resources',
    fr: 'Outils et ressources',
    en: 'Tools & Resources',
    aliases: [
      'Outils et ressources',
      'Tools & Resources',
      'Tools and resources',
    ],
  },
];

function cleanCategory(value: string): string {
  return value.trim().replace(/^"(.+)"$/, '$1');
}

function normalizeKey(value: string): string {
  return cleanCategory(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

const CATEGORY_LOOKUP = new Map<string, BlogCategoryDef>();

for (const category of BLOG_TAXONOMY) {
  CATEGORY_LOOKUP.set(normalizeKey(category.fr), category);
  CATEGORY_LOOKUP.set(normalizeKey(category.en), category);
  for (const alias of category.aliases) {
    CATEGORY_LOOKUP.set(normalizeKey(alias), category);
  }
}

export const BLOG_CATEGORIES = BLOG_TAXONOMY.map((category) => category.fr);

export function normalizeCategoryLabel(value: string): string {
  const cleaned = cleanCategory(value || '');
  if (!cleaned) return BLOG_CATEGORIES[0];
  const category = CATEGORY_LOOKUP.get(normalizeKey(cleaned));
  return category ? category.fr : cleaned;
}

export function getCategoryDisplayLabel(category: string, language: BlogLanguage): string {
  const normalized = normalizeCategoryLabel(category);
  const def = CATEGORY_LOOKUP.get(normalizeKey(normalized));
  if (!def) return normalized;
  return language === 'fr' ? def.fr : def.en;
}

export function sortCategories(categories: string[]): string[] {
  const unique = Array.from(new Set(categories.map((category) => normalizeCategoryLabel(category)).filter(Boolean)));
  const taxonomyIndex = new Map(BLOG_CATEGORIES.map((category, index) => [category, index]));

  return unique.sort((a, b) => {
    const aIndex = taxonomyIndex.get(a);
    const bIndex = taxonomyIndex.get(b);

    if (aIndex != null && bIndex != null) return aIndex - bIndex;
    if (aIndex != null) return -1;
    if (bIndex != null) return 1;
    return a.localeCompare(b, 'fr-CA');
  });
}

export function isKnownCategory(category: string): boolean {
  return CATEGORY_LOOKUP.has(normalizeKey(category));
}
