export type BlogLanguage = 'fr' | 'en';

export type BlogCategoryDef = {
  key: string;
  fr: string;
  en: string;
  descriptionFr: string;
  descriptionEn: string;
  aliases: string[];
};

export const BLOG_TAXONOMY: BlogCategoryDef[] = [
  {
    key: 'retirement-basics',
    fr: 'Les bases de la retraite',
    en: 'Retirement Basics',
    descriptionFr:
      'Les notions essentielles pour comprendre la retraite, savoir par ou commencer et eviter les erreurs les plus frequentes.',
    descriptionEn:
      'The essential concepts to understand retirement, know where to start, and avoid the most common mistakes.',
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
    descriptionFr:
      'Les articles sur la RRQ, la SV, le SRG, les pensions et les grands choix de revenu a la retraite.',
    descriptionEn:
      'Articles about QPP, OAS, GIS, pensions, and major retirement income decisions.',
    aliases: [
      'Revenus de retraite',
      'Retirement Income',
      'Comprendre les regimes gouvernementaux',
      'Government programs',
      'Pension Plans',
      'Regimes de retraite',
    ],
  },
  {
    key: 'taxation',
    fr: 'Fiscalite',
    en: 'Taxation',
    descriptionFr:
      "Les strategies simples pour mieux comprendre l'impot a la retraite, proteger la SV et reduire la facture fiscale.",
    descriptionEn:
      'Simple strategies to better understand retirement taxes, protect OAS, and reduce your tax bill.',
    aliases: [
      'Fiscalite',
      'Fiscalité',
      'Taxation',
      'Fiscalite simplifiee',
      'Fiscalité simplifiée',
      'Simple taxation',
      "Sujets saisonniers et d'actualite",
      'Sujets saisonniers et d’actualite',
      'Seasonal and current topics',
    ],
  },
  {
    key: 'investments',
    fr: 'Investissements',
    en: 'Investments',
    descriptionFr:
      'Les reperes pour gerer vos placements, votre decaissement et la duree de votre argent a la retraite.',
    descriptionEn:
      'Guidance to manage investments, withdrawals, and how long your money may last in retirement.',
    aliases: [
      'Investissements',
      'Investments',
      'Gerer son epargne et ses placements',
      'Manage savings and investments',
    ],
  },
  {
    key: 'estate-planning',
    fr: 'Planification successorale',
    en: 'Estate Planning',
    descriptionFr:
      'Les sujets lies a la succession, aux documents importants et a la transmission du patrimoine.',
    descriptionEn:
      'Topics related to estate planning, important documents, and wealth transfer.',
    aliases: ['Planification successorale', 'Estate Planning'],
  },
  {
    key: 'health-wellness',
    fr: 'Sante et bien-etre',
    en: 'Health & Wellness',
    descriptionFr:
      "Les articles sur la sante, la qualite de vie, l'autonomie et le bien-etre a la retraite.",
    descriptionEn:
      'Articles about health, quality of life, autonomy, and well-being in retirement.',
    aliases: [
      'Sante et bien-etre',
      'Santé et bien-être',
      'Health & Wellness',
      'Bien-etre et qualite de vie',
      'Bien-être et qualité de vie',
      'Well-being and quality of life',
      'Defis specifiques aux femmes',
      'Défis spécifiques aux femmes',
      'Women-specific challenges',
    ],
  },
  {
    key: 'couple-family',
    fr: 'Couple et famille',
    en: 'Couple & Family',
    descriptionFr:
      'Les decisions de retraite a deux, les enjeux familiaux et les transitions qui touchent le couple.',
    descriptionEn:
      'Retirement decisions for couples, family issues, and transitions that affect the household.',
    aliases: [
      'Couple et famille',
      'Couple & Family',
      'Planification pour les couples',
      'Planning for couples',
    ],
  },
  {
    key: 'budget-expenses',
    fr: 'Budget et depenses',
    en: 'Budget & Expenses',
    descriptionFr:
      'Les guides pour prevoir vos depenses, organiser votre budget et proteger votre marge de manoeuvre.',
    descriptionEn:
      'Guides to plan expenses, organize your budget, and protect your financial breathing room.',
    aliases: [
      'Budget et depenses',
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
    descriptionFr:
      'Les ressources pratiques pour choisir les bons outils, mieux vous informer et preparer votre dossier.',
    descriptionEn:
      'Practical resources to choose the right tools, learn faster, and prepare your dossier.',
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

export function getCategoryDescription(category: string, language: BlogLanguage): string {
  const normalized = normalizeCategoryLabel(category);
  const def = CATEGORY_LOOKUP.get(normalizeKey(normalized));
  if (!def) {
    return language === 'fr'
      ? 'Parcourez les articles de cette categorie pour mieux comprendre votre retraite.'
      : 'Browse the articles in this category to better understand retirement.';
  }
  return language === 'fr' ? def.descriptionFr : def.descriptionEn;
}

export function sortCategories(categories: string[]): string[] {
  const unique = Array.from(
    new Set(categories.map((category) => normalizeCategoryLabel(category)).filter(Boolean))
  );
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
