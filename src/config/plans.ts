// src/config/plans.ts
import { PlanLimits, SubscriptionPlan, UpgradePath, PromoCode } from '@/types/subscription';

export const PLAN_CONFIG: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    plan: 'free',
    price: '0 $',
    badge: 'Gratuit',
    description:
      '🔍 DÉCOUVREZ VOTRE POTENTIEL ! Inclut la trousse d’urgence complète (sauvegarde + impression) et 5 calculateurs de base — initiation professionnelle pour développer votre confiance. Parfait pour se familiariser avec MonPlanRetraite.ca',
    features: {
      // Limites numériques (initiation)
      maxSimulations: 5, // 5 simulations pour découvrir le potentiel
      maxReports: 1, // 1 rapport pour voir la qualité
      maxProfiles: 1, // Individuel seulement
      maxExpenseProjects: 1, // 1 projet pour tester
      maxSavedScenarios: 1, // 1 scénario sauvegardé
      // Caps avancés (bornage)
      maxMonteCarloIterations: 0,
      maxCompareScenarios: 0,
      // Exports
      allowCSVExport: false,
      exportWatermark: false,

      // Fonctionnalités de base
      hasAdvancedAnalytics: false,
      hasExportPDF: false,
      hasCashflowManagement: true, // Gestion cashflow basique
      hasExpensePlanning: true, // Planification dépenses basique

      // Fonctionnalités avancées
      hasMonteCarloSimulations: false,
      hasWithdrawalStrategies: false,
      hasTaxOptimization: false,
      hasFinancialAssistant: true, // Assistant IA (prévention)
      hasBudgetModule: false,

      // NOUVEAUX MODULES PHASE 1 - VERROUILLÉS
      hasCELISuccessionModule: false,
      hasTaxImpactAt65Calculator: false,
      hasTenEssentialTipsDashboard: false,

      // NOUVEAUX MODULES PHASE 2 - VERROUILLÉS
      hasAssetConsolidationModule: false,
      hasCashWedgeBucketModule: false,
      hasTaxEducationCenter: false,

      // NOUVEAUX MODULES PHASE 3 - VERROUILLÉS
      hasFourPercentRuleModule: false,
      hasOptimalAllocationModule: false,
      hasExcessLiquidityDetector: false,
      hasInflationProtectionCenter: false,
      hasBehavioralBiasEducator: false,

      // Fonctionnalités premium
      hasAIConsulting: false,
      hasSuccessionPlanning: false,
      hasRealEstateOptimization: false,

      // Modules gouvernementaux - VERROUILLÉS
      hasRREGOPModule: false,
      hasSRGModule: false,
      hasRRQCPPOptimization: false,
      hasOASGISAnalysis: false,

      // Calculateurs spécialisés - VERROUILLÉS
      hasAdvancedCalculators: false,
      hasCoastFIRECalculator: false,
      hasMortgageCalculator: false,
      hasRetirementProjections: false,

      // Rapports et analyses
      hasProfessionalReports: false,
      hasComparativeAnalysis: false,
      hasPredictiveAnalytics: false,
      hasStressTestAnalysis: false,

      // Sécurité et sauvegarde
      hasSecureStorage: true,
      hasAutomaticBackup: false,
      hasDataEncryption: true,

      // Interface et expérience
      hasAdvancedInterface: true,
      hasMultiLanguageSupport: true,
      hasMobileOptimization: true,
      hasAccessibilityFeatures: true,

      // Fonctionnalités supprimées
      hasIntegrations: false,
      hasPrioritySupport: false,
      hasPersonalizedTraining: false,
    },
  },
  professional: {
    plan: 'professional',
    price: '297 $/an',
    priceId: 'price_professional_annual',
    badge: 'Professionnel',
    description:
      '💪 OUTILS COMPLETS POUR COUPLES ! Tout ce qu’il faut pour planifier sérieusement à la maison: analyses avancées bornées, Monte Carlo (aperçu), PDF résumé. Idéal pour budgéter et comparer des scénarios simples.',
    features: {
      // Limites numériques (bornées)
      maxSimulations: 50, // 50 simulations par mois
      maxReports: 30, // 30 rapports (PDF résumé)
      maxProfiles: 2, // Couple ou individuel
      maxExpenseProjects: -1, // Illimité
      maxSavedScenarios: 20, // 20 scénarios sauvegardés
      // Caps avancés (bornage)
      maxMonteCarloIterations: 100,
      maxCompareScenarios: 3,
      // Exports
      allowCSVExport: false,
      exportWatermark: true, // filigrane pour PDF résumé

      // Fonctionnalités de base
      hasAdvancedAnalytics: true,
      hasExportPDF: true, // PDF résumé robuste
      hasCashflowManagement: true,
      hasExpensePlanning: true,

      // Fonctionnalités avancées
      hasMonteCarloSimulations: true, // aperçu (caps 100)
      hasWithdrawalStrategies: true,
      hasTaxOptimization: true, // basique
      hasFinancialAssistant: true, // essentiel
      hasBudgetModule: true,

      // NOUVEAUX MODULES PHASE 1 - INCLUS
      hasCELISuccessionModule: true,
      hasTaxImpactAt65Calculator: true,
      hasTenEssentialTipsDashboard: true,

      // NOUVEAUX MODULES PHASE 2 - INCLUS
      hasAssetConsolidationModule: true,
      hasCashWedgeBucketModule: true,
      hasTaxEducationCenter: true,

      // NOUVEAUX MODULES PHASE 3 - INCLUS
      hasFourPercentRuleModule: true,
      hasOptimalAllocationModule: true,
      hasExcessLiquidityDetector: true,
      hasInflationProtectionCenter: true,
      hasBehavioralBiasEducator: true,

      // Fonctionnalités premium - sélection
      hasAIConsulting: false,
      hasSuccessionPlanning: false,
      hasRealEstateOptimization: false,

      // Modules gouvernementaux - INCLUS
      hasRREGOPModule: true,
      hasSRGModule: true,
      hasRRQCPPOptimization: true,
      hasOASGISAnalysis: true,

      // Calculateurs spécialisés - INCLUS
      hasAdvancedCalculators: true,
      hasCoastFIRECalculator: true,
      hasMortgageCalculator: true,
      hasRetirementProjections: true,

      // Rapports et analyses
      hasProfessionalReports: false, // pas de “niveau consultant” en Pro
      hasComparativeAnalysis: true,
      hasPredictiveAnalytics: false,
      hasStressTestAnalysis: false,

      // Sécurité et sauvegarde
      hasSecureStorage: true,
      hasAutomaticBackup: true,
      hasDataEncryption: true,

      // Interface et expérience
      hasAdvancedInterface: true,
      hasMultiLanguageSupport: true,
      hasMobileOptimization: true,
      hasAccessibilityFeatures: true,

      // Fonctionnalités supprimées
      hasIntegrations: false,
      hasPrioritySupport: false,
      hasPersonalizedTraining: false,
    },
  },
  expert: {
    plan: 'expert',
    price: '597 $/an',
    priceId: 'price_expert_annual',
    badge: 'Expert',
    description:
      '🚀 NIVEAU CONSULTANT SANS RENDEZ-VOUS. Simulations illimitées, Monte Carlo 2000 itérations, rapports professionnels, analyses de sensibilité et exports (PDF pro + CSV). Alternative au plan à 3 000 $ (sans conseil personnalisé).',
    features: {
      // Limites numériques - ILLIMITÉ
      maxSimulations: -1,
      maxReports: -1,
      maxProfiles: -1,
      maxExpenseProjects: -1,
      maxSavedScenarios: -1,
      // Caps avancés
      maxMonteCarloIterations: 2000,
      maxCompareScenarios: 10,
      // Exports
      allowCSVExport: true,
      exportWatermark: false,

      // Fonctionnalités de base
      hasAdvancedAnalytics: true,
      hasExportPDF: true, // Rapports niveau consultant
      hasCashflowManagement: true,
      hasExpensePlanning: true,

      // Fonctionnalités avancées
      hasMonteCarloSimulations: true,
      hasWithdrawalStrategies: true,
      hasTaxOptimization: true, // avancée
      hasFinancialAssistant: true, // proactif
      hasBudgetModule: true,

      // NOUVEAUX MODULES PHASE 1 - INCLUS
      hasCELISuccessionModule: true,
      hasTaxImpactAt65Calculator: true,
      hasTenEssentialTipsDashboard: true,

      // NOUVEAUX MODULES PHASE 2 - INCLUS
      hasAssetConsolidationModule: true,
      hasCashWedgeBucketModule: true,
      hasTaxEducationCenter: true,

      // NOUVEAUX MODULES PHASE 3 - INCLUS
      hasFourPercentRuleModule: true,
      hasOptimalAllocationModule: true,
      hasExcessLiquidityDetector: true,
      hasInflationProtectionCenter: true,
      hasBehavioralBiasEducator: true,

      // Fonctionnalités premium - TOUTES
      hasAIConsulting: true,
      hasSuccessionPlanning: true,
      hasRealEstateOptimization: true,

      // Modules gouvernementaux - OPTIMISÉS
      hasRREGOPModule: true,
      hasSRGModule: true,
      hasRRQCPPOptimization: true,
      hasOASGISAnalysis: true,

      // Calculateurs spécialisés - EXPERT
      hasAdvancedCalculators: true,
      hasCoastFIRECalculator: true,
      hasMortgageCalculator: true,
      hasRetirementProjections: true,

      // Rapports et analyses - NIVEAU CONSULTANT
      hasProfessionalReports: true,
      hasComparativeAnalysis: true,
      hasPredictiveAnalytics: true,
      hasStressTestAnalysis: true,

      // Sécurité et sauvegarde
      hasSecureStorage: true,
      hasAutomaticBackup: true,
      hasDataEncryption: true,

      // Interface et expérience
      hasAdvancedInterface: true,
      hasMultiLanguageSupport: true,
      hasMobileOptimization: true,
      hasAccessibilityFeatures: true,

      // Fonctionnalités supprimées
      hasIntegrations: false,
      hasPrioritySupport: false,
      hasPersonalizedTraining: false,
    },
  },
};

// Types d'upgrade
export type UpgradeType =
  | 'immediate'
  | 'discounted'
  | 'prorated'
  | 'time_adjusted'
  | 'credit_based';

// Chemins d'upgrade (annuel uniquement)
export const UPGRADE_PATHS: UpgradePath[] = [
  {
    from: 'free',
    to: 'professional',
    upgradePrice: '297 $/an',
    priceId: 'price_professional_annual',
    upgradeType: 'immediate',
    savings: 'Économisez par rapport à un plan en cabinet',
    isRecommended: true,
    features: [
      'Assistant Financier Personnel (essentiel)',
      'Module Budget complet',
      'PDF résumé (filigrane)',
      'Analyses avancées (bornées)',
      'Monte Carlo (aperçu)',
      '50 simulations/mois',
    ],
  },
  {
    from: 'free',
    to: 'expert',
    upgradePrice: '597 $/an',
    priceId: 'price_expert_annual',
    upgradeType: 'immediate',
    savings: 'Alternative au plan à 3 000 $ (sans conseil personnalisé)',
    features: [
      'Rapports niveau consultant',
      'Simulations illimitées',
      'IA prédictive',
      'Export PDF pro + CSV',
      'Analyses de sensibilité',
    ],
  },
  {
    from: 'professional',
    to: 'expert',
    upgradePrice: '100,00 $/an', // base indicatif; ajusté selon temps restant
    priceId: 'price_upgrade_pro_to_expert',
    upgradeType: 'time_adjusted',
    savings: 'Prix ajusté selon votre temps restant',
    isRecommended: true,
    features: [
      'Rapports niveau consultant',
      'Simulations illimitées',
      'IA prédictive',
      'Export PDF pro + CSV',
      'Monte Carlo 2000 itérations',
    ],
  },
];

// Calcul du prix d'upgrade intelligent (annuel → annuel)
export const calculateSmartUpgradePrice = (
  fromPlan: SubscriptionPlan,
  toPlan: SubscriptionPlan,
  monthsRemaining: number
): { price: number; description: string; savings: string; totalPaid: number } => {
  if (fromPlan === 'professional' && toPlan === 'expert') {
    const professionalAnnual = 297;
    const expertAnnual = 597;
    const professionalMonthly = professionalAnnual / 12;
    const expertMonthly = expertAnnual / 12;
    const monthlyDifference = expertMonthly - professionalMonthly; // ~25$/mois
    const upgradePrice = Math.max(0, monthsRemaining) * monthlyDifference;
    const totalPaid = professionalAnnual + upgradePrice;
    const savings = expertAnnual - totalPaid;
    return {
      price: Math.round(upgradePrice * 100) / 100,
      description: `Upgrade Expert pour ${monthsRemaining} mois restants`,
      savings: `Économisez ${savings.toFixed(2)} $ vs achat séparé`,
      totalPaid: Math.round(totalPaid * 100) / 100,
    };
  }
  // Par défaut
  return {
    price: 120.0,
    description: 'Upgrade standard',
    savings: 'Prix fixe',
    totalPaid: 120.0,
  };
};

// Prix d'upgrade selon temps restant
export const getUpgradePriceWithTimeAdjustment = (
  fromPlan: SubscriptionPlan,
  toPlan: SubscriptionPlan,
  subscriptionStartDate: Date
): {
  price: string;
  description: string;
  savings: string;
  monthsRemaining: number;
  totalPaid: string;
} => {
  const now = new Date();
  const startDate = new Date(subscriptionStartDate);
  const monthsElapsed = Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  );
  const monthsRemaining = Math.max(12 - monthsElapsed, 0);

  if (monthsRemaining === 0) {
    return {
      price: '597,00 $',
      description: 'Nouvel abonnement Expert',
      savings: 'Prix standard',
      monthsRemaining: 0,
      totalPaid: '597,00 $',
    };
  }

  const smartPrice = calculateSmartUpgradePrice(fromPlan, toPlan, monthsRemaining);
  return {
    price: `${smartPrice.price.toFixed(2)} $`,
    description: smartPrice.description,
    savings: smartPrice.savings,
    monthsRemaining,
    totalPaid: `${smartPrice.totalPaid.toFixed(2)} $`,
  };
};

// Upgrades disponibles
export const getAvailableUpgrades = (currentPlan: SubscriptionPlan): UpgradePath[] => {
  return UPGRADE_PATHS.filter((path) => path.from === currentPlan);
};

// Upgrade recommandé
export const getRecommendedUpgrade = (
  currentPlan: SubscriptionPlan
): UpgradePath | null => {
  const upgrades = getAvailableUpgrades(currentPlan);
  return upgrades.find((u) => u.isRecommended) || upgrades[0] || null;
};

// Prix d'upgrade simple (fallback)
export const calculateUpgradePrice = (
  fromPlan: SubscriptionPlan,
  toPlan: SubscriptionPlan
): string => {
  if (fromPlan === 'free' && toPlan === 'professional') return '297 $/an';
  if (fromPlan === 'free' && toPlan === 'expert') return '597 $/an';
  if (fromPlan === 'professional' && toPlan === 'expert') return '100,00 $/an';
  return PLAN_CONFIG[toPlan].price;
};

// Upgrade possible ?
export const canUpgrade = (
  fromPlan: SubscriptionPlan,
  toPlan: SubscriptionPlan
): boolean => {
  const planHierarchy = { free: 0, professional: 1, expert: 2 };
  return planHierarchy[toPlan] > planHierarchy[fromPlan];
};

// Description d'upgrade
export const getUpgradeDescription = (upgrade: UpgradePath): string => {
  switch (upgrade.upgradeType) {
    case 'immediate':
      return 'Upgrade immédiat - Nouvelle période de 12 mois';
    case 'discounted':
      return 'Upgrade avec remise fidélité';
    case 'prorated':
      return 'Upgrade au prorata';
    case 'time_adjusted':
      return 'Upgrade ajusté selon le temps restant';
    case 'credit_based':
      return 'Upgrade avec crédit du temps restant';
    default:
      return 'Upgrade disponible';
  }
};

// Accès à une fonctionnalité ?
export const checkFeatureAccess = (
  feature: keyof PlanLimits['features'],
  userPlan: SubscriptionPlan
): boolean => {
  const plan = PLAN_CONFIG[userPlan];
  const featureValue = plan.features[feature];

  if (typeof featureValue === 'boolean') return featureValue;
  if (typeof featureValue === 'number') return featureValue === -1 || featureValue > 0;
  return false;
};

// Plan requis pour une fonctionnalité (UI gating)
export const getRequiredPlanForFeature = (
  feature: keyof PlanLimits['features']
): SubscriptionPlan => {
  // Professionnel
  if (
    feature === 'hasAdvancedAnalytics' ||
    feature === 'hasMonteCarloSimulations' ||
    feature === 'hasBudgetModule' ||
    feature === 'hasExportPDF' ||
    feature === 'hasWithdrawalStrategies' ||
    feature === 'hasTaxOptimization' ||
    feature === 'hasRREGOPModule' ||
    feature === 'hasSRGModule' ||
    feature === 'hasRRQCPPOptimization' ||
    feature === 'hasAdvancedCalculators' ||
    feature === 'hasComparativeAnalysis' ||
    feature === 'hasOASGISAnalysis' ||
    feature === 'hasCoastFIRECalculator' ||
    feature === 'hasMortgageCalculator' ||
    feature === 'hasRetirementProjections' ||
    feature === 'hasAutomaticBackup'
  ) {
    return 'professional';
  }

  // Expert
  if (
    feature === 'hasAIConsulting' ||
    feature === 'hasPredictiveAnalytics' ||
    feature === 'hasSuccessionPlanning' ||
    feature === 'hasRealEstateOptimization' ||
    feature === 'hasStressTestAnalysis' ||
    feature === 'hasProfessionalReports'
  ) {
    return 'expert';
  }

  // Gratuit
  if (
    feature === 'hasCashflowManagement' ||
    feature === 'hasExpensePlanning' ||
    feature === 'hasFinancialAssistant' ||
    feature === 'hasSecureStorage' ||
    feature === 'hasDataEncryption' ||
    feature === 'hasAdvancedInterface' ||
    feature === 'hasMultiLanguageSupport' ||
    feature === 'hasMobileOptimization' ||
    feature === 'hasAccessibilityFeatures'
  ) {
    return 'free';
  }

  // Par défaut
  return 'professional';
};

// Limites numériques (utilisation)
export const checkNumericLimit = (
  feature: 'maxSimulations' | 'maxReports' | 'maxProfiles',
  userPlan: SubscriptionPlan,
  currentUsage: number
): boolean => {
  const plan = PLAN_CONFIG[userPlan];
  const limit = plan.features[feature];
  return limit === -1 || currentUsage < limit;
};

// Message d'upgrade
export const getUpgradeMessage = (
  feature: keyof PlanLimits['features'],
  requiredPlan: SubscriptionPlan
): string => {
  const planNames = {
    professional: 'Professional',
    expert: 'Expert',
  } as const;

  const featureNames: Record<string, string> = {
    maxSimulations: 'simulations illimitées',
    maxReports: 'rapports illimités',
    maxProfiles: 'profils multiples',
    hasAdvancedAnalytics: 'analyses avancées',
    hasAIConsulting: 'conseils IA',
    hasIntegrations: 'intégrations',
    hasPrioritySupport: 'support prioritaire',
    hasPersonalizedTraining: 'formation personnalisée',
    hasExportPDF: 'export PDF',
    hasMonteCarloSimulations: 'simulations Monte Carlo',
    hasFinancialAssistant: 'Assistant Financier Personnel',
    hasBudgetModule: 'Module Budget',
  };

  const label = featureNames[feature as string] || feature;
  return `Cette fonctionnalité (${label}) fait partie du forfait ${planNames[requiredPlan]}. Voulez-vous souscrire au forfait ${planNames[requiredPlan]} ?`;
};

// Message d'upgrade contextuel
export const getContextualUpgradeMessage = (
  currentPlan: SubscriptionPlan,
  requiredPlan: SubscriptionPlan
): string => {
  if (currentPlan === 'free') {
    return `Passez de la version gratuite à la version ${PLAN_CONFIG[requiredPlan].badge} pour débloquer cette fonctionnalité`;
  }
  if (currentPlan === 'professional' && requiredPlan === 'expert') {
    return `Passez de la version ${PLAN_CONFIG.professional.badge} à la version ${PLAN_CONFIG.expert.badge} pour accéder aux fonctionnalités premium`;
  }
  return `Cette fonctionnalité nécessite le forfait ${PLAN_CONFIG[requiredPlan].badge}`;
};

// Codes promo (annuel)
export const PROMO_CODES: Record<string, PromoCode> = {
  EARLYBIRD30: {
    code: 'EARLYBIRD30',
    discount: 30,
    description: '30 % de réduction - Lancement',
    validUntil: '2025-12-31',
    maxUses: 100,
  },
  SAVINGS40: {
    code: 'SAVINGS40',
    discount: 40,
    description: '40 % de réduction - Économies',
    validUntil: '2025-12-31',
    maxUses: 50,
  },
  FOUNDER50: {
    code: 'FOUNDER50',
    discount: 50,
    description: '50 % de réduction - Fondateurs',
    validUntil: '2025-12-31',
    maxUses: 25,
  },
  TESTER100: {
    code: 'TESTER100',
    discount: 100,
    description: '100 % gratuit - Tests et développement',
    validUntil: '2025-12-31',
    maxUses: 999,
    unlimitedFeatures: true,
    testMode: true,
  },
  Calvin2025: {
    code: 'Calvin2025',
    discount: 100,
    description: "100 % gratuit - Tests Calvin jusqu'au 31 décembre 2026",
    validUntil: '2026-12-31',
    maxUses: 9999,
    unlimitedFeatures: true,
    testMode: true,
  },
};

// Tarifs avec code promo
export const calculatePriceWithPromo = (
  originalPrice: number,
  promoCode: string
): { finalPrice: number; discount: number; savings: string } => {
  const promo = PROMO_CODES[promoCode.toUpperCase()];
  if (!promo) {
    return { finalPrice: originalPrice, discount: 0, savings: '0,00 $' };
    }
  const discount = (originalPrice * promo.discount) / 100;
  const finalPrice = originalPrice - discount;
  return {
    finalPrice: Math.round(finalPrice * 100) / 100,
    discount: promo.discount,
    savings: `${discount.toFixed(2)} $`,
  };
};

// Économie annuelle (comparaison mensuel vs annuel — informatif)
export const calculateAnnualSavings = (monthlyPrice: number, annualPrice: number): string => {
  const monthlyTotal = monthlyPrice * 12;
  const savings = monthlyTotal - annualPrice;
  const percentage = (savings / monthlyTotal) * 100;
  return `${percentage.toFixed(0)} %`;
};

// Export pour compatibilité
export const PLANS = PLAN_CONFIG;

// Feature flag utilitaire
export const isFeatureEnabled = (
  userPlan: SubscriptionPlan,
  feature: keyof PlanLimits['features']
): boolean => {
  const plan = PLAN_CONFIG[userPlan];
  if (!plan) return false;
  const featureValue = plan.features[feature];
  if (typeof featureValue === 'boolean') return featureValue;
  if (typeof featureValue === 'number') return featureValue === -1 || featureValue > 0;
  return false;
};

// ===== Feature catalog for Plan Comparison (Home page) =====
export type Tier = 'free' | 'pro' | 'expert';

export interface FeatureCatalogItem {
  key: string;
  labelFr: string;
  labelEn: string;
  tier: Tier;
  descFr?: string;
  descEn?: string;
}

// Liste officielle des 5 calculateurs de base (palier Gratuit)
export interface BasicCalculatorItem {
  key: string;
  labelFr: string;
  labelEn: string;
}

export const BASIC_CALCULATORS: BasicCalculatorItem[] = [
  { key: 'return', labelFr: 'Calculatrice de rendement simple', labelEn: 'Simple return calculator' },
  { key: 'purchase-compare', labelFr: "Comparateur d'options d'achat", labelEn: 'Purchase options comparator' },
  { key: 'budget-lite', labelFr: 'Estimateur de budget mensuel (lite)', labelEn: 'Monthly budget estimator (lite)' },
  { key: 'rrq-cpp-view', labelFr: 'Aperçu RRQ/CPP — montants et impact', labelEn: 'RRQ/CPP preview — amounts and impact' },
  { key: 'tips-preview', labelFr: 'Conseils essentiels (aperçu)', labelEn: 'Essential tips (preview)' },
];

// Détail des 8 sections de la trousse d'urgence (marketing/UI)
export interface EmergencySectionItem {
  key: string;
  labelFr: string;
  labelEn: string;
}

export const EMERGENCY_SECTIONS: EmergencySectionItem[] = [
  { key: 'personnel', labelFr: 'Personnes et contacts clés', labelEn: 'People and key contacts' },
  { key: 'documents', labelFr: 'Documents essentiels', labelEn: 'Essential documents' },
  { key: 'finances', labelFr: 'Finances et comptes', labelEn: 'Finances and accounts' },
  { key: 'testament', labelFr: 'Testament et volontés', labelEn: 'Will and directives' },
  { key: 'sante', labelFr: 'Santé et médicaments', labelEn: 'Health and medications' },
  { key: 'assurances', labelFr: 'Propriétés et assurances', labelEn: 'Properties and insurance' },
  { key: 'acces', labelFr: 'Accès et mots de passe', labelEn: 'Access and passwords' },
  { key: 'verification', labelFr: 'Vérification finale', labelEn: 'Final verification' },
];

// Catalogue UI (palier minimal requis)
export const FEATURE_CATALOG: FeatureCatalogItem[] = [
  // Free
  {
    key: 'inflation-protection',
    labelFr: "Centre anti‑inflation — protéger le pouvoir d'achat",
    labelEn: 'Inflation protection center — protect purchasing power',
    descFr: 'Des idées simples pour garder votre pouvoir d’achat.',
    descEn: 'Simple ideas to keep your purchasing power.',
    tier: 'expert',
  },
  {
    key: 'budget',
    labelFr: 'Budget et dépenses — suivre votre argent chaque mois',
    labelEn: 'Budget and expenses — track your money monthly',
    descFr: 'Notez vos revenus et vos dépenses. Voyez où va votre argent chaque mois.',
    descEn: 'Write down income and expenses. See where your money goes each month.',
    tier: 'free',
  },
  {
    key: 'basic-calcs',
    labelFr: 'Calculateurs de base (5 outils) — réponses rapides',
    labelEn: 'Basic calculators (5 tools) — quick answers',
    descFr: "Rendement simple, Comparateur d’achat, Budget (lite), Aperçu RRQ/CPP, Conseils essentiels (aperçu).",
    descEn: 'Simple return, Purchase comparator, Budget (lite), RRQ/CPP preview, Essential tips (preview).',
    tier: 'free',
  },
  {
    key: 'blog-44',
    labelFr: '44+ articles de blog — bien vous préparer',
    labelEn: '44+ blog articles — get retirement-ready',
    descFr: 'Accédez gratuitement à notre bibliothèque pour bien vous préparer à la retraite.',
    descEn: 'Free access to our library to get ready for retirement.',
    tier: 'free',
  },
  {
    key: 'rrq-cpp',
    labelFr: 'Revenus et RRQ/CPP — voir vos montants',
    labelEn: 'Income and RRQ/CPP — see your amounts',
    descFr: 'Entrez vos montants de retraite et voyez l’effet dans votre budget.',
    descEn: 'Enter retirement amounts and see the impact in your budget.',
    tier: 'free',
  },
  {
    key: 'security',
    labelFr: 'Sécurité bancaire (AES‑256) — vos données restent ici',
    labelEn: 'Bank‑level security (AES‑256) — data stays here',
    descFr: 'Vos données ne quittent pas votre appareil. Chiffrées comme une banque.',
    descEn: 'Your data never leaves your device. Encrypted like a bank.',
    tier: 'free',
  },

  // Pro
  {
    key: 'adv-calcs',
    labelFr: 'Comprendre vos rendements (aperçu Monte Carlo)',
    labelEn: 'Understand your returns (Monte Carlo preview)',
    descFr: 'Voyez simplement si votre argent progresse bien, sans jargon.',
    descEn: 'See simply if your money is doing well, without jargon.',
    tier: 'pro',
  },
  {
    key: 'ai-assistant',
    labelFr: 'Assistant IA — évite les grosses erreurs',
    labelEn: 'AI Assistant — avoids big mistakes',
    descFr: 'Avertit avant une mauvaise décision (impôts, retraits, dates clés).',
    descEn: 'Warns you before a bad decision (tax, withdrawals, key dates).',
    tier: 'pro',
  },
  {
    key: 'tax-opt',
    labelFr: 'Moins d’impôt: ordre de retraits plus intelligent',
    labelEn: 'Pay less tax: smarter withdrawal order',
    descFr: 'Aide à payer moins d’impôt sur plusieurs années, simplement.',
    descEn: 'Helps pay less tax over the years, in simple terms.',
    tier: 'pro',
  },
  {
    key: 'rrq-cpp-optim',
    labelFr: 'RRQ/CPP: meilleur moment pour commencer',
    labelEn: 'RRQ/CPP: best time to start',
    descFr: 'Vous guide pour choisir le moment qui vous avantage le plus.',
    descEn: 'Guides you to pick the time that benefits you most.',
    tier: 'pro',
  },
  {
    key: 'oas-gis',
    labelFr: 'SV/OAS & SRG: éviter les pertes',
    labelEn: 'OAS & GIS: avoid losses',
    descFr: 'Réduit les pertes liées aux seuils de revenu, simplement.',
    descEn: 'Reduces losses from income thresholds, in simple terms.',
    tier: 'pro',
  },
  { key: 'rregop', labelFr: 'Module RREGOP complet', labelEn: 'Complete RREGOP module', tier: 'pro' },
  { key: 'srg', labelFr: 'Module SRG complet', labelEn: 'Complete GIS module', tier: 'pro' },
  {
    key: 'export-opt',
    labelFr: 'Export Optimisation (résumé robuste) — PDF clair à partager',
    labelEn: 'Optimization export (robust summary) — clear PDF to share',
    descFr: 'Un PDF simple à montrer à votre conseiller ou votre famille.',
    descEn: 'A clear PDF to show your advisor or family.',
    tier: 'pro',
  },
  {
    key: 'backup-auto',
    labelFr: 'Sauvegarde automatique locale — copie de sécurité',
    labelEn: 'Automatic local backup — safety copy',
    descFr: 'Sauvegarde votre dossier sur votre clé USB ou disque, sans internet.',
    descEn: 'Backs up your file on your USB or drive, no internet needed.',
    tier: 'pro',
  },
  {
    key: 'cash-wedge',
    labelFr: 'Stratégie de seau (cash wedge) — coussin pour les dépenses',
    labelEn: 'Cash wedge strategy — cushion for expenses',
    descFr: 'Mets de côté quelques mois d’argent pour dormir tranquille.',
    descEn: 'Set aside a few months of money so you can sleep well.',
    tier: 'pro',
  },
  {
    key: 'asset-consolidation',
    labelFr: "Consolidation d'actifs — tout voir en un endroit",
    labelEn: 'Asset consolidation — see everything in one place',
    descFr: 'Regroupez vos comptes pour avoir une vue simple et complète.',
    descEn: 'Group your accounts for a simple, complete view.',
    tier: 'pro',
  },
  {
    key: 'tax-edu',
    labelFr: "Centre d'éducation fiscale — apprendre pas à pas",
    labelEn: 'Tax education center — learn step by step',
    descFr: 'Des explications claires pour comprendre vos impôts à la retraite.',
    descEn: 'Clear explanations to understand retirement taxes.',
    tier: 'pro',
  },
  {
    key: 'four-percent',
    labelFr: 'Règle des 4 % (modernisée) — repères simples',
    labelEn: '4% rule (modernized) — simple guideposts',
    descFr: 'Un repère facile pour éviter de retirer trop d’argent trop vite.',
    descEn: 'A simple guide to avoid taking out money too fast.',
    tier: 'pro',
  },
  {
    key: 'optimal-allocation',
    labelFr: "Allocation optimale — répartir l'argent simplement",
    labelEn: 'Optimal allocation — simple asset mix',
    descFr: 'Une recette simple pour choisir combien en actions, obligations, etc.',
    descEn: 'A simple recipe to choose how much in stocks, bonds, etc.',
    tier: 'pro',
  },
  {
    key: 'excess-liquidity',
    labelFr: 'Détecteur de sur‑liquidités — argent qui dort',
    labelEn: 'Excess liquidity detector — idle cash finder',
    descFr: 'Repère l’argent qui ne travaille pas pour vous.',
    descEn: 'Finds money that isn’t working for you.',
    tier: 'pro',
  },
  {
    key: 'behavioral-bias',
    labelFr: 'Biais comportementaux — éviter les pièges courants',
    labelEn: 'Behavioral biases — avoid common pitfalls',
    descFr: 'Explique les pièges fréquents qui font perdre de l’argent.',
    descEn: 'Explains common traps that make people lose money.',
    tier: 'pro',
  },
  {
    key: 'longevity',
    labelFr: 'Planification de longévité — vivre 25–35 ans en retraite',
    labelEn: 'Longevity planning — plan for 25–35 years retired',
    descFr: 'Planifiez sur 25–35 ans pour ne pas manquer d’argent.',
    descEn: 'Plan for 25–35 years so you don’t run out of money.',
    tier: 'pro',
  },

  // Expert
  {
    key: 'mc-1000',
    labelFr: 'Tester votre plan dans 1000 scénarios',
    labelEn: 'Test your plan in 1000 scenarios',
    descFr: 'Vérifie si votre plan tient la route quand la vie bouge.',
    descEn: 'Checks if your plan holds up when life changes.',
    tier: 'expert',
  },
  {
    key: 'stress-tests',
    labelFr: 'Stress tests (séquence, inflation, longévité) — résister aux chocs',
    labelEn: 'Stress tests (sequence, inflation, longevity) — withstand shocks',
    descFr: 'Vérifie si votre plan tient le coup si la vie bouscule vos finances.',
    descEn: 'Checks if your plan holds up when life shakes your finances.',
    tier: 'expert',
  },
  {
    key: 'predictive-ai',
    labelFr: 'IA — voir les tendances à venir',
    labelEn: 'AI — see upcoming trends',
    descFr: 'Apercevez les tendances possibles pour décider plus simplement.',
    descEn: 'See possible trends to decide more simply.',
    tier: 'expert',
  },
  {
    key: 'consultant-reports',
    labelFr: 'Rapports prêts à imprimer (niveau consultant)',
    labelEn: 'Print‑ready reports (consultant level)',
    descFr: 'Rapports clairs à montrer à un conseiller ou à la famille.',
    descEn: 'Clear reports to show an advisor or family.',
    tier: 'expert',
  },
  {
    key: 'estate',
    labelFr: 'Planification successorale complète',
    labelEn: 'Complete estate planning',
    descFr: 'Préparez votre héritage pour protéger vos proches.',
    descEn: 'Prepare your legacy to protect your loved ones.',
    tier: 'expert',
  },
  {
    key: 'real-estate',
    labelFr: 'Optimisation immobilière avancée',
    labelEn: 'Advanced real estate optimization',
    descFr: 'Choix immobiliers plus clairs (garder, vendre, louer).',
    descEn: 'Clearer real‑estate choices (keep, sell, rent).',
    tier: 'expert',
  },
  {
    key: 'ai-consulting',
    labelFr: 'Conseils IA avancés — suggestions plus poussées',
    labelEn: 'Advanced AI consulting — deeper suggestions',
    descFr: 'Des recommandations plus fines et adaptées à vos choix.',
    descEn: 'Finer recommendations adapted to your choices.',
    tier: 'expert',
  },

  /* Nouveaux différenciateurs Expert (alignés avec la page Outils) */
  {
    key: 'dyn-withdrawal',
    labelFr: 'Retraits dynamiques — adapter le rythme',
    labelEn: 'Dynamic withdrawals — adapt the pace',
    descFr: 'Ajuste les retraits selon les marchés et vos objectifs, avec règles avancées.',
    descEn: 'Adjust withdrawals to markets and goals with advanced rules.',
    tier: 'expert',
  },
  {
    key: 'ferr-opt',
    labelFr: 'Optimisation du FERR — réduire l’impôt sur la durée',
    labelEn: 'RRIF optimization — reduce long‑term tax',
    descFr: 'Planifie des retraits FERR efficaces pour limiter l’impôt futur.',
    descEn: 'Plans effective RRIF withdrawals to limit future tax.',
    tier: 'expert',
  },
  {
    key: 'rrsp-meltdown',
    labelFr: 'Fonte du REER — stratégie contrôlée',
    labelEn: 'RRSP meltdown — controlled strategy',
    descFr: 'Réduit prudemment vos REER pour lisser l’impôt et éviter les seuils.',
    descEn: 'Carefully wind down RRSPs to smooth taxes and avoid thresholds.',
    tier: 'expert',
  },
  {
    key: 'tax-opt-multi',
    labelFr: 'Optimisation fiscale multi‑sources — mieux coordonner',
    labelEn: 'Multi‑source tax optimization — better coordination',
    descFr: 'Coordonne retraits et revenus (REER/CELI/Non‑enreg.) pour payer moins.',
    descEn: 'Coordinates withdrawals and income (RRSP/TFSA/Non‑registered) to pay less.',
    tier: 'expert',
  },
  {
    key: 'rvdaa',
    labelFr: 'RVDAA — scénarios avancés',
    labelEn: 'RVDAA — advanced scenarios',
    descFr: 'Outil spécialisé pour tester des scénarios d’épargne et de décaissement.',
    descEn: 'Specialized tool to test saving and decumulation scenarios.',
    tier: 'expert',
  },
];
