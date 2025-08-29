// src/types/subscription.ts

export type SubscriptionPlan = 'free' | 'professional' | 'expert';

export interface PlanFeatures {
  // Limites numériques
  maxSimulations: number;
  maxReports: number;
  maxProfiles: number;
  maxExpenseProjects: number;
  maxSavedScenarios: number;
  
  // Fonctionnalités de base
  hasAdvancedAnalytics: boolean;
  hasExportPDF: boolean;
  hasCashflowManagement: boolean;
  hasExpensePlanning: boolean;
  
  // Fonctionnalités avancées
  hasMonteCarloSimulations: boolean;
  hasWithdrawalStrategies: boolean;
  hasTaxOptimization: boolean;
  hasFinancialAssistant: boolean; // Assistant IA Personnel
  hasBudgetModule: boolean; // Module Budget complet
  
  // NOUVEAUX MODULES PHASE 1
  hasCELISuccessionModule: boolean; // Module CELI et succession
  hasTaxImpactAt65Calculator: boolean; // Calculateur impact fiscal 65 ans
  hasTenEssentialTipsDashboard: boolean; // Dashboard 10 conseils essentiels
  
  // NOUVEAUX MODULES PHASE 2
  hasAssetConsolidationModule: boolean; // Module consolidation d'actifs
  hasCashWedgeBucketModule: boolean; // Module stratégie de seau/cash wedge
  hasTaxEducationCenter: boolean; // Centre d'éducation fiscale
  
  // NOUVEAUX MODULES PHASE 3 (Optimisation Avancée)
  hasFourPercentRuleModule: boolean; // Module règle des 4% modernisée
  hasOptimalAllocationModule: boolean; // Optimisateur allocation retraite
  hasExcessLiquidityDetector: boolean; // Détecteur sur-liquidités
  hasInflationProtectionCenter: boolean; // Centre anti-inflation
  hasBehavioralBiasEducator: boolean; // Éducateur biais comportementaux
  
  // Fonctionnalités premium
  hasAIConsulting: boolean; // IA prédictive et conseils avancés
  hasSuccessionPlanning: boolean; // Planification successorale
  hasEmergencyPlanning: boolean; // Planification d'urgence (8 sections)
  hasRealEstateOptimization: boolean; // Optimisation immobilière
  
  // Modules gouvernementaux
  hasRREGOPModule: boolean; // Module RREGOP complet
  hasSRGModule: boolean; // Module SRG/GIS complet
  hasRRQCPPOptimization: boolean; // Optimisation RRQ/CPP
  hasOASGISAnalysis: boolean; // Analyse OAS/GIS
  
  // Calculateurs spécialisés
  hasAdvancedCalculators: boolean; // IRR, TWR, MWR
  hasCoastFIRECalculator: boolean; // Indépendance financière
  hasMortgageCalculator: boolean; // Calculateur hypothécaire avancé
  hasRetirementProjections: boolean; // Projections de retraite
  
  // Rapports et analyses
  hasProfessionalReports: boolean; // Rapports niveau consultant
  hasComparativeAnalysis: boolean; // Analyses comparatives
  hasPredictiveAnalytics: boolean; // Analyses prédictives IA
  hasStressTestAnalysis: boolean; // Tests de résistance
  
  // Sécurité et sauvegarde
  hasSecureStorage: boolean; // Stockage sécurisé AES-256
  hasAutomaticBackup: boolean; // Sauvegarde automatique
  hasDataEncryption: boolean; // Chiffrement niveau bancaire
  
  // Interface et expérience
  hasAdvancedInterface: boolean; // Interface avancée
  hasMultiLanguageSupport: boolean; // Support multilingue
  hasMobileOptimization: boolean; // Optimisation mobile
  hasAccessibilityFeatures: boolean; // Fonctionnalités d'accessibilité
  
  // Fonctionnalités supprimées (pour compatibilité)
  hasIntegrations: boolean; // Supprimé pour sécurité
  hasPrioritySupport: boolean; // Supprimé (opération solo)
  hasPersonalizedTraining: boolean; // Supprimé (pas de permis AMF)
}

export interface PlanLimits {
  plan: SubscriptionPlan;
  features: PlanFeatures;
  price: string;
  priceId?: string; // Stripe price ID
  badge: string;
  description: string;
}

export interface FeatureCheck {
  hasAccess: boolean;
  requiredPlan: SubscriptionPlan;
  upgradeMessage: string;
  currentPlan: SubscriptionPlan;
}

export interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan: SubscriptionPlan;
  featureName: string;
  currentPlan: SubscriptionPlan;
}

// NOUVEAU : Logique d'upgrade
export interface UpgradePath {
  from: SubscriptionPlan;
  to: SubscriptionPlan;
  upgradePrice: string;
  priceId: string;
  upgradeType: 'immediate' | 'discounted' | 'prorated' | 'time_adjusted' | 'credit_based'; // NOUVEAU
  savings?: string;
  isRecommended?: boolean;
  features: string[];
}

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  startDate: Date;
  endDate: Date;
  stripeSubscriptionId?: string;
  autoRenew: boolean;
}

export interface UpgradeOptions {
  availableUpgrades: UpgradePath[];
  currentPlan: SubscriptionPlan;
  recommendedUpgrade?: UpgradePath;
}

export interface PromoCode {
  code: string;
  discount: number; // Pourcentage de réduction
  description: string;
  validUntil: string; // Date de fin de validité
  maxUses: number;
  unlimitedFeatures?: boolean; // Pour les codes 100% gratuits
  testMode?: boolean; // Pour les codes de test
  currentUses?: number; // Nombre d'utilisations actuelles
}

export interface PromoCodeValidation {
  isValid: boolean;
  discount: number;
  message: string;
  code?: PromoCode;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  plan: SubscriptionPlan;
  createdAt: Date;
  updatedAt: Date;
  subscription?: UserSubscription;
}
