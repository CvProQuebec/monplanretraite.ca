// src/types/subscription.ts

export type SubscriptionPlan = 'free' | 'professional' | 'ultimate';

export interface PlanFeatures {
  maxSimulations: number;
  maxReports: number;
  maxProfiles: number;
  hasAdvancedAnalytics: boolean;
  hasAIConsulting: boolean;
  hasIntegrations: boolean;
  hasPrioritySupport: boolean;
  hasPersonalizedTraining: boolean;
  hasExportPDF: boolean;
  hasMonteCarloSimulations: boolean;
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