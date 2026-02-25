import React from 'react';
import { PLAN_CONFIG, isFeatureEnabled, getRequiredPlanForFeature } from '@/config/plans';
import type { SubscriptionPlan, PlanLimits } from '@/types/subscription';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';

type FeatureKey = keyof PlanLimits['features'];

interface FeatureGateProps {
  feature: FeatureKey;
  children: React.ReactNode;
  lockedFallback?: React.ReactNode;
  className?: string;
}

const DefaultLockedCard: React.FC<{ feature: FeatureKey; currentPlan: SubscriptionPlan }> = ({ feature, currentPlan }) => {
  const required = getRequiredPlanForFeature(feature);
  const requiredBadge = PLAN_CONFIG[required]?.badge || required;
  return (
    <div className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
      <div className="text-sm text-gray-800">
        Cette fonctionnalité nécessite le forfait <strong>{requiredBadge}</strong>.
      </div>
      <div className="mt-2">
        <a href="/premium" className="inline-block px-4 py-2 rounded bg-mpr-interactive text-white hover:bg-mpr-interactive-dk">
          Voir les forfaits
        </a>
      </div>
    </div>
  );
};

const FeatureGate: React.FC<FeatureGateProps> = ({ feature, children, lockedFallback, className }) => {
  const { currentPlan } = useSubscriptionLimits();
  const enabled = isFeatureEnabled(currentPlan as SubscriptionPlan, feature);
  if (enabled) return <>{children}</>;
  return (
    <div className={className}>
      {lockedFallback ?? <DefaultLockedCard feature={feature} currentPlan={currentPlan as SubscriptionPlan} />}
    </div>
  );
};

export default FeatureGate;
