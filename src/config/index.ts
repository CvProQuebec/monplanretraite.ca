// ===== INDEX DE LA CONFIGURATION DE BASE DE BASE DE BASE DE BASE DE BASE DE BASE DE BASE DE BASE =====
// Export centralisé de toute la configuration de base de base de base de base de base de base de base de base

// Configuration du site
export { SITE_CONFIG } from './branding';

// Configuration des plans
export { 
  PLAN_CONFIG, 
  UPGRADE_PATHS, 
  calculateSmartUpgradePrice, 
  getUpgradePriceWithTimeAdjustment, 
  getAvailableUpgrades, 
  getRecommendedUpgrade, 
  calculateUpgradePrice, 
  canUpgrade, 
  getUpgradeDescription, 
  checkFeatureAccess, 
  getRequiredPlanForFeature, 
  checkNumericLimit, 
  getUpgradeMessage, 
  getContextualUpgradeMessage, 
  PROMO_CODES, 
  calculatePriceWithPromo, 
  calculateAnnualSavings, 
  PLANS, 
  isFeatureEnabled 
} from './plans';
