import { useAuth } from './useAuth';

export interface SubscriptionLimits {
  hasCashflowManagement: boolean;
  hasMonteCarloSimulations: boolean;
  hasAdvancedAnalytics: boolean;
  hasPremiumFeatures: boolean;
  hasAPIIntegration: boolean;
  maxReportsPerMonth: number;
  maxDataPoints: number;
  hasExportFeatures: boolean;
}

export const useSubscriptionLimits = () => {
  const { user } = useAuth();
  
  const getPlanLimits = (plan: string): SubscriptionLimits => {
    switch (plan) {
      case 'expert':
        return {
          hasCashflowManagement: true,
          hasMonteCarloSimulations: true,
          hasAdvancedAnalytics: true,
          hasPremiumFeatures: true,
          hasAPIIntegration: true,
          maxReportsPerMonth: 100,
          maxDataPoints: 10000,
          hasExportFeatures: true
        };
      case 'professional':
        return {
          hasCashflowManagement: true,
          hasMonteCarloSimulations: true,
          hasAdvancedAnalytics: true,
          hasPremiumFeatures: false,
          hasAPIIntegration: false,
          maxReportsPerMonth: 50,
          maxDataPoints: 5000,
          hasExportFeatures: true
        };
      case 'free':
      default:
        return {
          hasCashflowManagement: false,
          hasMonteCarloSimulations: false,
          hasAdvancedAnalytics: false,
          hasPremiumFeatures: false,
          hasAPIIntegration: false,
          maxReportsPerMonth: 5,
          maxDataPoints: 1000,
          hasExportFeatures: false
        };
    }
  };

  const currentPlan = user?.subscription?.plan || 'free';
  const limits = getPlanLimits(currentPlan);

  const checkAccess = (feature: keyof SubscriptionLimits): boolean => {
    return limits[feature] as boolean;
  };

  const checkLimit = (limit: keyof SubscriptionLimits, currentValue: number): boolean => {
    const maxValue = limits[limit] as number;
    return currentValue < maxValue;
  };

  const getRemainingQuota = (limit: keyof SubscriptionLimits, currentValue: number): number => {
    const maxValue = limits[limit] as number;
    return Math.max(0, maxValue - currentValue);
  };

  return {
    limits,
    currentPlan,
    checkAccess,
    checkLimit,
    getRemainingQuota,
    isFree: currentPlan === 'free',
    isProfessional: currentPlan === 'professional',
    isExpert: currentPlan === 'expert'
  };
};
