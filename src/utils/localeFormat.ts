/**
 * Formatage localisé conforme aux pratiques OQLF (fr-CA) et en-CA
 * - Monnaie (CAD) : fr-CA -> 1 234,56 $ ; en-CA -> $1,234.56
 * - Pourcentage : fr-CA -> 4,57 % (espace avant %) ; en-CA -> 4.57%
 * - Titres (FR) : seule la première lettre du premier mot en majuscule
 */

export type AppLanguage = 'fr' | 'en';

export const formatCurrencyLocale = (
  amount: number,
  language: AppLanguage = 'fr',
  options?: Intl.NumberFormatOptions
): string => {
  const locale = language === 'fr' ? 'fr-CA' : 'en-CA';
  const fmt = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  });
  return fmt.format(amount);
};

/**
 * Formate un pourcentage à partir d'une valeur déjà en pourcentage (ex: 12.34)
 * - fr : "12,34 %"
 * - en : "12.34%"
 */
export const formatPercentLocale = (
  percentValue: number,
  language: AppLanguage = 'fr',
  fractionDigits: { min?: number; max?: number } = { min: 0, max: 2 }
): string => {
  const locale = language === 'fr' ? 'fr-CA' : 'en-CA';
  const number = new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits.min ?? 0,
    maximumFractionDigits: fractionDigits.max ?? 2
  }).format(percentValue);

  // Espace insécable fine recommandée, mais on garde un espace normal pour compatibilité UI
  return language === 'fr' ? `${number} %` : `${number}%`;
};

/**
 * Convertit un ratio (0..1) en pourcentage lisible
 */
export const formatRatioAsPercent = (
  ratio: number,
  language: AppLanguage = 'fr',
  fractionDigits: { min?: number; max?: number } = { min: 0, max: 2 }
): string => {
  const percent = (ratio || 0) * 100;
  return formatPercentLocale(percent, language, fractionDigits);
};

/**
 * Applique la règle OQLF basique sur un titre français :
 * - 1er mot : première lettre majuscule, reste du mot minuscule
 * - autres mots : minuscules
 * NOTE: On évite d'appliquer automatiquement pour noms propres/marques
 */
export const enforceOqlfFrenchTitle = (title: string): string => {
  if (!title) return title;
  const parts = title.trim().split(/\s+/);
  if (parts.length === 0) return title;

  const first = parts[0];
  const firstFixed = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  const rest = parts.slice(1).map(w => w.toLowerCase());

  return [firstFixed, ...rest].join(' ');
};

/**
 * Met en casse phrase anglaise (phrase case) — optionnel
 */
export const toSentenceCaseEn = (text: string): string => {
  if (!text) return text;
  const trimmed = text.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};
