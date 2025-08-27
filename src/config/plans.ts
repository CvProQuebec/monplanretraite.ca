// src/config/plans.ts
import { PlanLimits, SubscriptionPlan, UpgradePath, PromoCode } from '@/types/subscription';

export const PLAN_CONFIG: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    plan: 'free',
    price: '0 $',
    badge: 'Trousse de Protection',
    description: 'Module d\'urgence professionnel gratuit',
    features: {
      maxSimulations: 5, // 5 simulations par mois pour donner un avant-goût
      maxReports: 1,
      maxProfiles: 1,
      hasAdvancedAnalytics: false,
      hasAIConsulting: false,
      hasIntegrations: false,
      hasPrioritySupport: false,
      hasPersonalizedTraining: false,
      hasExportPDF: false,
      hasMonteCarloSimulations: false,
      hasCashflowManagement: true, // Gestion de base
      hasWithdrawalStrategies: false,
      hasExpensePlanning: true, // Planification de base
      hasTaxOptimization: false,
      hasFinancialAssistant: false, // RESTREINT : Plans payants uniquement
      hasBudgetModule: false, // RESTREINT : Plans payants uniquement
      maxExpenseProjects: 1
    }
  },
  professional: {
    plan: 'professional',
    price: '99,99 $/an',
    priceId: 'price_professional_annual',
    badge: 'Planification Avancée',
    description: 'Assistant IA + Gestion financière complète',
    features: {
      maxSimulations: -1, // Illimité
      maxReports: -1, // Illimité
      maxProfiles: 3,
      hasAdvancedAnalytics: true,
      hasAIConsulting: false, // Réservé au plan Expert
      hasIntegrations: false,
      hasPrioritySupport: false,
      hasPersonalizedTraining: false,
      hasExportPDF: true,
      hasMonteCarloSimulations: true,
      hasCashflowManagement: true,
      hasWithdrawalStrategies: true,
      hasExpensePlanning: true,
      hasTaxOptimization: true, // Optimisation fiscale de base
      hasFinancialAssistant: true, // INCLUS : Assistant Financier Personnel
      hasBudgetModule: true, // INCLUS : Module Budget
      maxExpenseProjects: -1 // Illimité
    }
  },
  ultimate: {
    plan: 'ultimate',
    price: '199,99 $/an',
    priceId: 'price_ultimate_annual',
    badge: 'Solution Complète',
    description: 'Planification successorale + IA prédictive',
    features: {
      maxSimulations: -1, // Illimité
      maxReports: -1, // Illimité
      maxProfiles: -1, // Illimité
      hasAdvancedAnalytics: true,
      hasAIConsulting: true, // IA prédictive avancée
      hasIntegrations: true, // Intégrations complètes
      hasPrioritySupport: true, // Support premium
      hasPersonalizedTraining: true, // Formation personnalisée
      hasExportPDF: true,
      hasMonteCarloSimulations: true,
      hasCashflowManagement: true,
      hasWithdrawalStrategies: true,
      hasExpensePlanning: true,
      hasTaxOptimization: true,
      hasFinancialAssistant: true, // INCLUS : Assistant Financier Personnel
      hasBudgetModule: true, // INCLUS : Module Budget
      maxExpenseProjects: -1 // Illimité
    }
  }
};

// NOUVEAU : Types d'upgrade avec ajustement temporel
export type UpgradeType = 'immediate' | 'discounted' | 'prorated' | 'time_adjusted' | 'credit_based';

// NOUVEAU : Chemins d'upgrade avec stratégies intelligentes
export const UPGRADE_PATHS: UpgradePath[] = [
  {
    from: 'free',
    to: 'professional',
    upgradePrice: '99,99 $/an',
    priceId: 'price_professional_annual',
    upgradeType: 'immediate',
    savings: '80% moins cher que la concurrence',
    isRecommended: true,
    features: [
      'Assistant Financier Personnel',
      'Module Budget',
      'simulations illimitées',
      'rapports illimités',
      'analyses avancées',
      'simulations Monte Carlo',
      'export PDF'
    ]
  },
  {
    from: 'free',
    to: 'ultimate',
    upgradePrice: '199,99 $/an',
    priceId: 'price_ultimate_annual',
    upgradeType: 'immediate',
    savings: '60% moins cher que la concurrence',
    features: [
      'tout inclus',
      'profils illimités',
      'conseils IA',
      'intégrations',
      'formation personnalisée'
    ]
  },
  {
    from: 'professional',
    to: 'ultimate',
    upgradePrice: '100,00 $/an', // Prix de base - sera ajusté selon le temps
    priceId: 'price_upgrade_pro_to_ultimate',
    upgradeType: 'time_adjusted', // Ajustement selon le temps restant
    savings: 'Prix ajusté selon votre temps restant',
    isRecommended: true,
    features: [
      'profils illimités',
      'conseils IA',
      'intégrations',
      'formation personnalisée'
    ]
  }
];

// NOUVEAU : Fonction pour calculer le prix d'upgrade intelligent
export const calculateSmartUpgradePrice = (
  fromPlan: SubscriptionPlan,
  toPlan: SubscriptionPlan,
  monthsRemaining: number
): { price: number; description: string; savings: string; totalPaid: number } => {
  if (fromPlan === 'professional' && toPlan === 'ultimate') {
    // Prix mensuels
    const professionalMonthly = 119.99 / 12; // ~10$/mois
    const ultimateMonthly = 239.99 / 12;     // ~20$/mois
    
    // Différence mensuelle : Ultimate - Professional = 10$/mois
    const monthlyDifference = ultimateMonthly - professionalMonthly;
    
    // Prix d'upgrade : différence × mois restants
    const upgradePrice = monthsRemaining * monthlyDifference;
    
    // Total payé par le client
    const totalPaid = 119.99 + upgradePrice;
    
    // Économies vs achat séparé
    const savings = 239.99 - totalPaid;
    
    return {
      price: upgradePrice,
      description: `Upgrade Ultimate pour ${monthsRemaining} mois restants`,
      savings: `Économisez ${savings.toFixed(2)} $ vs achat séparé`,
      totalPaid: totalPaid
    };
  }
  
  // Pour les autres upgrades, prix standard
  return {
    price: 120.00,
    description: 'Upgrade standard',
    savings: 'Prix fixe',
    totalPaid: 120.00
  };
};

// NOUVEAU : Fonction pour obtenir le prix d'upgrade selon le temps restant
export const getUpgradePriceWithTimeAdjustment = (
  fromPlan: SubscriptionPlan,
  toPlan: SubscriptionPlan,
  subscriptionStartDate: Date
): { price: string; description: string; savings: string; monthsRemaining: number; totalPaid: string } => {
  const now = new Date();
  const startDate = new Date(subscriptionStartDate);
  const monthsElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
  const monthsRemaining = Math.max(12 - monthsElapsed, 0);
  
  if (monthsRemaining === 0) {
    // Abonnement expiré, prix normal
    return {
      price: '239,99 $/an',
      description: 'Nouvel abonnement Ultimate',
      savings: 'Prix standard',
      monthsRemaining: 0,
      totalPaid: '239,99 $'
    };
  }
  
  const smartPrice = calculateSmartUpgradePrice(fromPlan, toPlan, monthsRemaining);
  
  return {
    price: `${smartPrice.price.toFixed(2)} $`,
    description: smartPrice.description,
    savings: smartPrice.savings,
    monthsRemaining: monthsRemaining,
    totalPaid: `${smartPrice.totalPaid.toFixed(2)} $`
  };
};

// NOUVEAU : Fonction pour obtenir les upgrades disponibles
export const getAvailableUpgrades = (currentPlan: SubscriptionPlan): UpgradePath[] => {
  return UPGRADE_PATHS.filter(path => path.from === currentPlan);
};

// NOUVEAU : Fonction pour obtenir l'upgrade recommandé
export const getRecommendedUpgrade = (currentPlan: SubscriptionPlan): UpgradePath | null => {
  const upgrades = getAvailableUpgrades(currentPlan);
  return upgrades.find(upgrade => upgrade.isRecommended) || upgrades[0] || null;
};

// NOUVEAU : Fonction pour calculer le prix d'upgrade
export const calculateUpgradePrice = (
  fromPlan: SubscriptionPlan,
  toPlan: SubscriptionPlan
): string => {
  if (fromPlan === 'free' && toPlan === 'professional') {
    return '99,99 $/an';
  }
  if (fromPlan === 'free' && toPlan === 'ultimate') {
    return '199,99 $/an';
  }
  if (fromPlan === 'professional' && toPlan === 'ultimate') {
    return '100,00 $/an'; // Prix de base - sera ajusté selon le temps
  }
  return PLAN_CONFIG[toPlan].price;
};

// NOUVEAU : Fonction pour vérifier si un upgrade est possible
export const canUpgrade = (
  fromPlan: SubscriptionPlan,
  toPlan: SubscriptionPlan
): boolean => {
  const planHierarchy = { free: 0, professional: 1, ultimate: 2 };
  return planHierarchy[toPlan] > planHierarchy[fromPlan];
};

// NOUVEAU : Fonction pour obtenir la description de l'upgrade
export const getUpgradeDescription = (upgrade: UpgradePath): string => {
  switch (upgrade.upgradeType) {
    case 'immediate':
      return 'Upgrade immédiat - Nouvelle période de 12 mois';
    case 'discounted':
      return 'Upgrade avec remise fidélité';
    case 'prorated':
      return 'Upgrade au prorata (non recommandé)';
    case 'time_adjusted':
      return 'Upgrade avec ajustement selon votre temps restant';
    case 'credit_based':
      return 'Upgrade avec crédit du temps restant';
    default:
      return 'Upgrade disponible';
  }
};

// Fonction utilitaire pour vérifier l'accès aux fonctionnalités
export const checkFeatureAccess = (
  feature: keyof PlanLimits['features'],
  userPlan: SubscriptionPlan
): boolean => {
  const plan = PLAN_CONFIG[userPlan];
  const featureValue = plan.features[feature];
  
  if (typeof featureValue === 'boolean') {
    return featureValue;
  }
  
  if (typeof featureValue === 'number') {
    return featureValue === -1 || featureValue > 0;
  }
  
  return false;
};

// Fonction pour obtenir le plan requis pour une fonctionnalité
export const getRequiredPlanForFeature = (
  feature: keyof PlanLimits['features']
): SubscriptionPlan => {
  if (feature === 'hasAdvancedAnalytics' || feature === 'hasMonteCarloSimulations' || 
      feature === 'hasFinancialAssistant' || feature === 'hasBudgetModule') {
    return 'professional';
  }
  if (feature === 'hasAIConsulting' || feature === 'hasIntegrations' || feature === 'hasPersonalizedTraining') {
    return 'ultimate';
  }
  return 'free';
};

// Fonction pour vérifier les limites numériques
export const checkNumericLimit = (
  feature: 'maxSimulations' | 'maxReports' | 'maxProfiles',
  userPlan: SubscriptionPlan,
  currentUsage: number
): boolean => {
  const plan = PLAN_CONFIG[userPlan];
  const limit = plan.features[feature];
  return limit === -1 || currentUsage < limit;
};

// Messages d'upgrade personnalisés
export const getUpgradeMessage = (
  feature: keyof PlanLimits['features'],
  requiredPlan: SubscriptionPlan
): string => {
  const planNames = {
    professional: 'Professional',
    ultimate: 'Ultimate'
  };

  const featureNames = {
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
    hasBudgetModule: 'Module Budget'
  };

  return `Cette fonctionnalité (${featureNames[feature]}) fait partie du forfait ${planNames[requiredPlan]}. Voulez-vous souscrire au forfait ${planNames[requiredPlan]} ?`;
};

// NOUVEAU : Messages d'upgrade contextuels
export const getContextualUpgradeMessage = (
  currentPlan: SubscriptionPlan,
  requiredPlan: SubscriptionPlan
): string => {
  if (currentPlan === 'free') {
    return `Upgradez de ${PLAN_CONFIG.free.badge} à ${PLAN_CONFIG[requiredPlan].badge} pour débloquer cette fonctionnalité`;
  }
  if (currentPlan === 'professional' && requiredPlan === 'ultimate') {
    return `Upgradez de ${PLAN_CONFIG.professional.badge} à ${PLAN_CONFIG.ultimate.badge} pour accéder aux fonctionnalités premium`;
  }
  return `Cette fonctionnalité nécessite le forfait ${PLAN_CONFIG[requiredPlan].badge}`;
};

// Codes promo
export const PROMO_CODES: Record<string, PromoCode> = {
  EARLYBIRD30: {
    code: 'EARLYBIRD30',
    discount: 30,
    description: '30 % de réduction - Lancement',
    validUntil: '2025-12-31',
    maxUses: 100
  },
  SAVINGS40: {
    code: 'SAVINGS40',
    discount: 40,
    description: '40 % de réduction - Économies',
    validUntil: '2025-12-31',
    maxUses: 50
  },
  FOUNDER50: {
    code: 'FOUNDER50',
    discount: 50,
    description: '50 % de réduction - Fondateurs',
    validUntil: '2025-12-31',
    maxUses: 25
  },
  TESTER100: {
    code: 'TESTER100',
    discount: 100,
    description: '100 % gratuit - Tests et développement',
    validUntil: '2025-12-31',
    maxUses: 999,
    unlimitedFeatures: true,
    testMode: true
  },
  Calvin2025: {
    code: 'Calvin2025',
    discount: 100,
    description: '100 % gratuit - Tests Calvin jusqu\'au 31 décembre 2026',
    validUntil: '2026-12-31',
    maxUses: 9999,
    unlimitedFeatures: true,
    testMode: true
  }
};

// Fonctions manquantes pour PricingSection.tsx
export const calculatePriceWithPromo = (
  originalPrice: number,
  promoCode: string
): { finalPrice: number; discount: number; savings: string } => {
  const promo = PROMO_CODES[promoCode.toUpperCase()];
  
  if (!promo) {
    return {
      finalPrice: originalPrice,
      discount: 0,
      savings: '0,00 $'
    };
  }

  const discount = (originalPrice * promo.discount) / 100;
  const finalPrice = originalPrice - discount;

  return {
    finalPrice: Math.round(finalPrice * 100) / 100,
    discount: promo.discount,
    savings: `${discount.toFixed(2)} $`
  };
};

export const calculateAnnualSavings = (
  monthlyPrice: number,
  annualPrice: number
): string => {
  const monthlyTotal = monthlyPrice * 12;
  const savings = monthlyTotal - annualPrice;
  const percentage = ((savings / monthlyTotal) * 100);
  
  return `${percentage.toFixed(0)} %`;
};

// Export PLANS pour compatibilité (si nécessaire)
export const PLANS = PLAN_CONFIG;

// Fonction manquante pour FeatureGate.tsx
export const isFeatureEnabled = (
  userPlan: SubscriptionPlan,
  feature: keyof PlanLimits['features']
): boolean => {
  const plan = PLAN_CONFIG[userPlan];
  if (!plan) return false;
  
  const featureValue = plan.features[feature];
  
  if (typeof featureValue === 'boolean') {
    return featureValue;
  }
  
  if (typeof featureValue === 'number') {
    return featureValue === -1 || featureValue > 0;
  }
  
  return false;
};
