// src/config/plans.ts
import { PlanLimits, SubscriptionPlan, UpgradePath, PromoCode } from '@/types/subscription';

export const PLAN_CONFIG: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    plan: 'free',
    price: '0 $',
    badge: 'Gratuit',
    description: '🔍 DÉCOUVREZ VOTRE POTENTIEL ! Initiation professionnelle pour développer votre confiance - Parfait pour se familiariser avec MonPlanRetraite.ca',
    features: {
      // Limites numériques - RÉDUITES pour initiation
      maxSimulations: 2, // 2 simulations pour découvrir le potentiel
      maxReports: 1, // 1 rapport pour voir la qualité
      maxProfiles: 1, // Individuel seulement (couple = upgrade)
      maxExpenseProjects: 1, // 1 projet pour tester
      maxSavedScenarios: 1, // 1 scénario sauvegardé
      
      // Fonctionnalités de base - GARDÉES pour rassurer
      hasAdvancedAnalytics: false,
      hasExportPDF: false,
      hasCashflowManagement: true, // ✅ GARDÉ - Gestion cashflow basique
      hasExpensePlanning: true, // ✅ GARDÉ - Planification dépenses basique
      
      // Fonctionnalités avancées - TOUTES verrouillées
      hasMonteCarloSimulations: false,
      hasWithdrawalStrategies: false,
      hasTaxOptimization: false,
      hasFinancialAssistant: true, // ✅ GRATUIT - Assistant IA (prévention catastrophes)
      hasBudgetModule: false, // 🔒 PROFESSIONNEL
      
      // NOUVEAUX MODULES PHASE 1 - VERROUILLÉS
      hasCELISuccessionModule: false, // 🔒 PROFESSIONNEL
      hasTaxImpactAt65Calculator: false, // 🔒 PROFESSIONNEL
      hasTenEssentialTipsDashboard: false, // 🔒 PROFESSIONNEL
      
      // NOUVEAUX MODULES PHASE 2 - VERROUILLÉS
      hasAssetConsolidationModule: false, // 🔒 PROFESSIONNEL
      hasCashWedgeBucketModule: false, // 🔒 PROFESSIONNEL
      hasTaxEducationCenter: false, // 🔒 PROFESSIONNEL
      
      // NOUVEAUX MODULES PHASE 3 - VERROUILLÉS
      hasFourPercentRuleModule: false, // 🔒 PROFESSIONNEL
      hasOptimalAllocationModule: false, // 🔒 PROFESSIONNEL
      hasExcessLiquidityDetector: false, // 🔒 PROFESSIONNEL
      hasInflationProtectionCenter: false, // 🔒 PROFESSIONNEL
      hasBehavioralBiasEducator: false, // 🔒 PROFESSIONNEL
      
      // Fonctionnalités premium - DÉPLACÉES vers Professionnel
      hasAIConsulting: false,
      hasSuccessionPlanning: false,
      hasEmergencyPlanning: false, // 🔒 → PROFESSIONNEL (valeur 500$)
      hasRealEstateOptimization: false,
      
      // Modules gouvernementaux - DÉPLACÉS vers Professionnel
      hasRREGOPModule: false,
      hasSRGModule: false,
      hasRRQCPPOptimization: false,
      hasOASGISAnalysis: false, // 🔒 → PROFESSIONNEL (valeur 200$)
      
      // Calculateurs spécialisés - DÉPLACÉS vers Professionnel
      hasAdvancedCalculators: false,
      hasCoastFIRECalculator: false, // 🔒 → PROFESSIONNEL (valeur 300$)
      hasMortgageCalculator: false, // 🔒 → PROFESSIONNEL (valeur 200$)
      hasRetirementProjections: false, // 🔒 → PROFESSIONNEL (valeur 400$)
      
      // Rapports et analyses - Basiques
      hasProfessionalReports: false,
      hasComparativeAnalysis: false,
      hasPredictiveAnalytics: false,
      hasStressTestAnalysis: false,
      
      // Sécurité et sauvegarde - GARDÉES pour confiance
      hasSecureStorage: true, // ✅ GARDÉ - Sécurité (argument de vente)
      hasAutomaticBackup: false, // 🔒 → PROFESSIONNEL (valeur 100$)
      hasDataEncryption: true, // ✅ GARDÉ - Chiffrement (confiance)
      
      // Interface et expérience - GARDÉES pour expérience
      hasAdvancedInterface: true, // ✅ GARDÉ - Interface moderne
      hasMultiLanguageSupport: true, // ✅ GARDÉ - Français/Anglais
      hasMobileOptimization: true, // ✅ GARDÉ - Optimisation mobile
      hasAccessibilityFeatures: true, // ✅ GARDÉ - Accessibilité seniors
      
      // Fonctionnalités supprimées
      hasIntegrations: false,
      hasPrioritySupport: false,
      hasPersonalizedTraining: false
    }
  },
  professional: {
    plan: 'professional',
    price: '297 $/an',
    priceId: 'price_professional_annual',
    badge: 'Professionnel',
    description: '💪 OUTILS COMPLETS POUR COUPLES ! Récupère tout ce qui était gratuit + suite professionnelle complète (5 000 $ de valeur) + 11 NOUVEAUX MODULES EXCLUSIFS basés sur l\'expertise d\'Adam Parallel Wealth - Parfait pour planification autonome sérieuse',
    features: {
      // Limites numériques - ILLIMITÉES
      maxSimulations: -1, // ✅ ILLIMITÉ - Testez tous vos scénarios
      maxReports: -1, // ✅ ILLIMITÉ - Rapports professionnels
      maxProfiles: 2, // Couple ou individuel
      maxExpenseProjects: -1, // ✅ ILLIMITÉ - Tous vos projets
      maxSavedScenarios: -1, // ✅ ILLIMITÉ - Sauvegardez tout
      
      // Fonctionnalités de base - TOUTES INCLUSES
      hasAdvancedAnalytics: true, // ✅ INCLUS - Analyses avancées complètes
      hasExportPDF: true, // ✅ INCLUS - Rapports PDF professionnels
      hasCashflowManagement: true, // ✅ INCLUS - Gestion cashflow avancée
      hasExpensePlanning: true, // ✅ INCLUS - Planification dépenses complète
      
      // Fonctionnalités avancées - TOUTES INCLUSES
      hasMonteCarloSimulations: true, // ✅ INCLUS - Simulations Monte Carlo
      hasWithdrawalStrategies: true, // ✅ INCLUS - Stratégies de décaissement
      hasTaxOptimization: true, // ✅ INCLUS - Optimisation fiscale REER/CELI
      hasFinancialAssistant: true, // ✅ INCLUS - Assistant IA (prévention catastrophes)
      hasBudgetModule: true, // ✅ INCLUS - Module Budget complet
      
      // NOUVEAUX MODULES PHASE 1 - INCLUS
      hasCELISuccessionModule: true, // ✅ INCLUS - Module CELI et succession
      hasTaxImpactAt65Calculator: true, // ✅ INCLUS - Calculateur impact fiscal 65 ans
      hasTenEssentialTipsDashboard: true, // ✅ INCLUS - Dashboard 10 conseils essentiels
      
      // NOUVEAUX MODULES PHASE 2 - INCLUS
      hasAssetConsolidationModule: true, // ✅ INCLUS - Module consolidation d'actifs
      hasCashWedgeBucketModule: true, // ✅ INCLUS - Module stratégie de seau/cash wedge
      hasTaxEducationCenter: true, // ✅ INCLUS - Centre d'éducation fiscale
      
      // NOUVEAUX MODULES PHASE 3 - INCLUS
      hasFourPercentRuleModule: true, // ✅ INCLUS - Module règle des 4% modernisée
      hasOptimalAllocationModule: true, // ✅ INCLUS - Optimisateur allocation retraite
      hasExcessLiquidityDetector: true, // ✅ INCLUS - Détecteur sur-liquidités
      hasInflationProtectionCenter: true, // ✅ INCLUS - Centre anti-inflation
      hasBehavioralBiasEducator: true, // ✅ INCLUS - Éducateur biais comportementaux
      
      // Fonctionnalités premium - Sélectionnées
      hasAIConsulting: false, // 🔒 EXPERT - IA prédictive avancée
      hasSuccessionPlanning: false, // 🔒 EXPERT - Planification successorale avancée
      hasEmergencyPlanning: true, // ✅ INCLUS - Module d'urgence complet
      hasRealEstateOptimization: false, // 🔒 EXPERT - Optimisation immobilière experte
      
      // Modules gouvernementaux - TOUS INCLUS
      hasRREGOPModule: true, // ✅ INCLUS - Module RREGOP complet
      hasSRGModule: true, // ✅ INCLUS - Module SRG/GIS complet
      hasRRQCPPOptimization: true, // ✅ INCLUS - Optimisation RRQ/CPP
      hasOASGISAnalysis: true, // ✅ INCLUS - Analyse OAS/GIS complète
      
      // Calculateurs spécialisés - TOUS INCLUS
      hasAdvancedCalculators: true, // ✅ INCLUS - IRR, TWR, MWR
      hasCoastFIRECalculator: true, // ✅ INCLUS - Calculateur FIRE complet
      hasMortgageCalculator: true, // ✅ INCLUS - Calculateur hypothécaire avancé
      hasRetirementProjections: true, // ✅ INCLUS - Projections complètes
      
      // Rapports et analyses - Avancés
      hasProfessionalReports: true, // ✅ INCLUS - Rapports niveau consultant
      hasComparativeAnalysis: true, // ✅ INCLUS - Analyses comparatives
      hasPredictiveAnalytics: false, // 🔒 EXPERT - IA prédictive
      hasStressTestAnalysis: false, // 🔒 EXPERT - Tests de résistance experts
      
      // Sécurité et sauvegarde - MAXIMALES
      hasSecureStorage: true, // ✅ INCLUS - Stockage sécurisé AES-256
      hasAutomaticBackup: true, // ✅ INCLUS - Sauvegarde automatique
      hasDataEncryption: true, // ✅ INCLUS - Chiffrement niveau bancaire
      
      // Interface et expérience - COMPLÈTES
      hasAdvancedInterface: true, // ✅ INCLUS - Interface avancée
      hasMultiLanguageSupport: true, // ✅ INCLUS - Français/Anglais
      hasMobileOptimization: true, // ✅ INCLUS - Optimisation mobile
      hasAccessibilityFeatures: true, // ✅ INCLUS - Accessibilité seniors
      
      // Fonctionnalités supprimées
      hasIntegrations: false,
      hasPrioritySupport: false,
      hasPersonalizedTraining: false
    }
  },
  expert: {
    plan: 'expert',
    price: '597 $/an',
    priceId: 'price_expert_annual',
    badge: 'Expert',
    description: '🚀 MAÎTRISEZ L\'AVENIR ! IA prédictive + optimisation maximale (10 000$+ de valeur) + 11 NOUVEAUX MODULES EXCLUSIFS basés sur l\'expertise d\'Adam Parallel Wealth + Analyses comportementales avancées - Pour ceux qui refusent de laisser le hasard décider de leur retraite',
    features: {
      // Limites numériques - TOUT ILLIMITÉ
      maxSimulations: -1, // ✅ ILLIMITÉ - Simulations infinies
      maxReports: -1, // ✅ ILLIMITÉ - Rapports professionnels illimités
      maxProfiles: -1, // ✅ ILLIMITÉ - Famille élargie et scénarios multiples
      maxExpenseProjects: -1, // ✅ ILLIMITÉ - Tous vos projets de vie
      maxSavedScenarios: -1, // ✅ ILLIMITÉ - Sauvegardez tout
      
      // Fonctionnalités de base - MAXIMALES
      hasAdvancedAnalytics: true, // ✅ INCLUS - Analyses ultra-avancées
      hasExportPDF: true, // ✅ INCLUS - Rapports PDF niveau consultant
      hasCashflowManagement: true, // ✅ INCLUS - Gestion cashflow experte
      hasExpensePlanning: true, // ✅ INCLUS - Planification dépenses maximale
      
      // Fonctionnalités avancées - TOUTES MAXIMALES
      hasMonteCarloSimulations: true, // ✅ INCLUS - Monte Carlo 1000+ itérations
      hasWithdrawalStrategies: true, // ✅ INCLUS - Stratégies décaissement expertes
      hasTaxOptimization: true, // ✅ INCLUS - Optimisation fiscale maximale
      hasFinancialAssistant: true, // ✅ INCLUS - Assistant IA ultra-avancé
      hasBudgetModule: true, // ✅ INCLUS - Module Budget expert
      
      // NOUVEAUX MODULES PHASE 1 - INCLUS
      hasCELISuccessionModule: true, // ✅ INCLUS - Module CELI et succession
      hasTaxImpactAt65Calculator: true, // ✅ INCLUS - Calculateur impact fiscal 65 ans
      hasTenEssentialTipsDashboard: true, // ✅ INCLUS - Dashboard 10 conseils essentiels
      
      // NOUVEAUX MODULES PHASE 2 - INCLUS
      hasAssetConsolidationModule: true, // ✅ INCLUS - Module consolidation d'actifs
      hasCashWedgeBucketModule: true, // ✅ INCLUS - Module stratégie de seau/cash wedge
      hasTaxEducationCenter: true, // ✅ INCLUS - Centre d'éducation fiscale
      
      // NOUVEAUX MODULES PHASE 3 - INCLUS
      hasFourPercentRuleModule: true, // ✅ INCLUS - Module règle des 4% modernisée
      hasOptimalAllocationModule: true, // ✅ INCLUS - Optimisateur allocation retraite
      hasExcessLiquidityDetector: true, // ✅ INCLUS - Détecteur sur-liquidités
      hasInflationProtectionCenter: true, // ✅ INCLUS - Centre anti-inflation
      hasBehavioralBiasEducator: true, // ✅ INCLUS - Éducateur biais comportementaux
      
      // Fonctionnalités premium - TOUTES INCLUSES
      hasAIConsulting: true, // ✅ INCLUS - IA prédictive + conseils avancés
      hasSuccessionPlanning: true, // ✅ INCLUS - Planification successorale complète
      hasEmergencyPlanning: true, // ✅ INCLUS - Module d'urgence expert
      hasRealEstateOptimization: true, // ✅ INCLUS - Optimisation immobilière avancée
      
      // Modules gouvernementaux - TOUS OPTIMISÉS
      hasRREGOPModule: true, // ✅ INCLUS - Module RREGOP expert
      hasSRGModule: true, // ✅ INCLUS - Module SRG/GIS expert
      hasRRQCPPOptimization: true, // ✅ INCLUS - Optimisation RRQ/CPP maximale
      hasOASGISAnalysis: true, // ✅ INCLUS - Analyse OAS/GIS experte
      
      // Calculateurs spécialisés - TOUS EXPERTS
      hasAdvancedCalculators: true, // ✅ INCLUS - IRR, TWR, MWR experts
      hasCoastFIRECalculator: true, // ✅ INCLUS - Calculateur FIRE expert
      hasMortgageCalculator: true, // ✅ INCLUS - Calculateur hypothécaire expert
      hasRetirementProjections: true, // ✅ INCLUS - Projections expertes
      
      // Rapports et analyses - NIVEAU CONSULTANT
      hasProfessionalReports: true, // ✅ INCLUS - Rapports niveau consultant
      hasComparativeAnalysis: true, // ✅ INCLUS - Analyses comparatives expertes
      hasPredictiveAnalytics: true, // ✅ INCLUS - IA prédictive complète
      hasStressTestAnalysis: true, // ✅ INCLUS - Tests de résistance experts
      
      // Sécurité et sauvegarde - NIVEAU BANCAIRE
      hasSecureStorage: true, // ✅ INCLUS - Stockage ultra-sécurisé
      hasAutomaticBackup: true, // ✅ INCLUS - Sauvegarde automatique avancée
      hasDataEncryption: true, // ✅ INCLUS - Chiffrement niveau bancaire
      
      // Interface et expérience - PREMIUM
      hasAdvancedInterface: true, // ✅ INCLUS - Interface premium
      hasMultiLanguageSupport: true, // ✅ INCLUS - Support multilingue complet
      hasMobileOptimization: true, // ✅ INCLUS - Optimisation mobile premium
      hasAccessibilityFeatures: true, // ✅ INCLUS - Accessibilité maximale
      
      // Fonctionnalités supprimées (pour sécurité/conformité)
      hasIntegrations: false, // Supprimé pour sécurité
      hasPrioritySupport: false, // Supprimé (opération solo)
      hasPersonalizedTraining: false // Supprimé (pas de permis AMF)
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
    upgradePrice: '297 $/an',
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
    to: 'expert',
    upgradePrice: '597 $/an',
    priceId: 'price_expert_annual',
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
    to: 'expert',
    upgradePrice: '100,00 $/an', // Prix de base - sera ajusté selon le temps
    priceId: 'price_upgrade_pro_to_expert',
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
  if (fromPlan === 'professional' && toPlan === 'expert') {
    // Prix mensuels
    const professionalMonthly = 297 / 12; // ~25$/mois
    const expertMonthly = 597 / 12;     // ~50$/mois
    
    // Différence mensuelle : Expert - Professional = 10$/mois
    const monthlyDifference = expertMonthly - professionalMonthly;
    
    // Prix d'upgrade : différence × mois restants
    const upgradePrice = monthsRemaining * monthlyDifference;
    
    // Total payé par le client
    const totalPaid = 297 + upgradePrice;
    
    // Économies vs achat séparé
    const savings = 597 - totalPaid;
    
    return {
      price: upgradePrice,
      description: `Upgrade Expert pour ${monthsRemaining} mois restants`,
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
      description: 'Nouvel abonnement Expert',
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
    return '297 $/an';
  }
  if (fromPlan === 'free' && toPlan === 'expert') {
    return '597 $/an';
  }
  if (fromPlan === 'professional' && toPlan === 'expert') {
    return '100,00 $/an'; // Prix de base - sera ajusté selon le temps
  }
  return PLAN_CONFIG[toPlan].price;
};

// NOUVEAU : Fonction pour vérifier si un upgrade est possible
export const canUpgrade = (
  fromPlan: SubscriptionPlan,
  toPlan: SubscriptionPlan
): boolean => {
  const planHierarchy = { free: 0, professional: 1, expert: 2 };
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
  // Fonctionnalités du plan Professionnel (ÉTENDUES avec celles déplacées du gratuit)
  if (feature === 'hasAdvancedAnalytics' ||
      feature === 'hasMonteCarloSimulations' ||
      feature === 'hasBudgetModule' ||
      feature === 'hasExportPDF' ||
      feature === 'hasWithdrawalStrategies' ||
      feature === 'hasTaxOptimization' ||
      feature === 'hasRREGOPModule' ||
      feature === 'hasSRGModule' ||
      feature === 'hasRRQCPPOptimization' ||
      feature === 'hasAdvancedCalculators' ||
      feature === 'hasProfessionalReports' ||
      feature === 'hasComparativeAnalysis' ||
      // NOUVELLES fonctionnalités déplacées du gratuit vers professionnel
      feature === 'hasEmergencyPlanning' ||      // 🔒 → PROFESSIONNEL (valeur 500$)
      feature === 'hasOASGISAnalysis' ||         // 🔒 → PROFESSIONNEL (valeur 200$)
      feature === 'hasCoastFIRECalculator' ||    // 🔒 → PROFESSIONNEL (valeur 300$)
      feature === 'hasMortgageCalculator' ||     // 🔒 → PROFESSIONNEL (valeur 200$)
      feature === 'hasRetirementProjections' ||  // 🔒 → PROFESSIONNEL (valeur 400$)
      feature === 'hasAutomaticBackup') {        // 🔒 → PROFESSIONNEL (valeur 100$)
    return 'professional';
  }
  
  // Fonctionnalités exclusives au plan Expert (ÉTENDUES)
  if (feature === 'hasAIConsulting' ||
      feature === 'hasPredictiveAnalytics' ||
      feature === 'hasSuccessionPlanning' ||     // 🔒 → EXPERT - Planification successorale avancée
      feature === 'hasRealEstateOptimization' || // 🔒 → EXPERT - Optimisation immobilière experte
      feature === 'hasStressTestAnalysis') {     // 🔒 → EXPERT - Tests de résistance experts
    return 'expert';
  }
  
  // Fonctionnalités supprimées (plus disponibles) - Forcer upgrade vers Expert
  if (feature === 'hasIntegrations' || 
      feature === 'hasPersonalizedTraining' || 
      feature === 'hasPrioritySupport') {
    return 'expert';
  }
  
  // Fonctionnalités RESTANTES dans le plan gratuit (RÉDUITES)
  if (feature === 'hasCashflowManagement' ||     // ✅ GARDÉ - Gestion cashflow basique
      feature === 'hasExpensePlanning' ||        // ✅ GARDÉ - Planification dépenses basique
      feature === 'hasFinancialAssistant' ||     // ✅ GRATUIT - Assistant IA (prévention catastrophes)
      feature === 'hasSecureStorage' ||          // ✅ GARDÉ - Sécurité (argument de vente)
      feature === 'hasDataEncryption' ||         // ✅ GARDÉ - Chiffrement (confiance)
      feature === 'hasAdvancedInterface' ||      // ✅ GARDÉ - Interface moderne
      feature === 'hasMultiLanguageSupport' ||   // ✅ GARDÉ - Français/Anglais
      feature === 'hasMobileOptimization' ||     // ✅ GARDÉ - Optimisation mobile
      feature === 'hasAccessibilityFeatures') {  // ✅ GARDÉ - Accessibilité seniors
    return 'free';
  }
  
  // Par défaut, retourner 'professional' pour les fonctionnalités non spécifiées
  return 'professional';
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
    expert: 'Expert'
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
    return `Passez de la version gratuite à la version ${PLAN_CONFIG[requiredPlan].badge} pour débloquer cette fonctionnalité`;
  }
  if (currentPlan === 'professional' && requiredPlan === 'expert') {
    return `Passez de la version ${PLAN_CONFIG.professional.badge} à la version ${PLAN_CONFIG.expert.badge} pour accéder aux fonctionnalités premium`;
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
