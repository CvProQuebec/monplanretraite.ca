// src/components/ui/upgrade-modal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Zap, Shield, ArrowRight, X } from 'lucide-react';
import { SubscriptionPlan, PlanLimits } from '@/types/subscription';
import { PLAN_CONFIG } from '@/config/plans';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan: SubscriptionPlan;
  featureName: string;
  currentPlan: SubscriptionPlan;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  requiredPlan,
  featureName,
  currentPlan
}) => {
  const requiredPlanInfo = PLAN_CONFIG[requiredPlan];
  const currentPlanInfo = PLAN_CONFIG[currentPlan];

  const handleUpgrade = () => {
    // Ici vous intégrerez la logique Stripe
    console.log(`Upgrade to ${requiredPlan} plan`);
    // Rediriger vers Stripe ou ouvrir le processus de paiement
    onClose();
  };

  const getFeatureIcon = (feature: keyof PlanLimits['features']) => {
    switch (feature) {
      case 'hasMonteCarloSimulations':
        return <Zap className="h-4 w-4" />;
      case 'hasExportPDF':
        return <Shield className="h-4 w-4" />;
      case 'hasAIConsulting':
        return <Crown className="h-4 w-4" />;
      case 'hasIntegrations':
        return <Zap className="h-4 w-4" />;
      default:
        return <Check className="h-4 w-4" />;
    }
  };

  const getFeatureName = (feature: keyof PlanLimits['features']) => {
    const featureNames = {
      maxSimulations: 'Simulations illimitées',
      maxReports: 'Rapports illimités',
      maxProfiles: 'Profils multiples',
      hasAdvancedAnalytics: 'Analyses avancées',
      hasAIConsulting: 'Conseils IA',

      hasPrioritySupport: 'Support prioritaire',
      hasPersonalizedTraining: 'Formation personnalisée',
      hasExportPDF: 'Export PDF',
      hasMonteCarloSimulations: 'Simulations Monte Carlo'
    };
    return featureNames[feature] || feature;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Upgrade Your Plan
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Unlock premium features and take your experience to the next level
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Feature that triggered the upgrade */}
          <div className="bg-mpr-interactive-lt border border-mpr-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              {getFeatureIcon(featureName as keyof PlanLimits['features'])}
              <div>
                <h3 className="font-semibold text-mpr-navy">
                  Feature Locked: {getFeatureName(featureName as keyof PlanLimits['features'])}
                </h3>
                <p className="text-mpr-navy text-sm">
                  This feature requires the {requiredPlanInfo.badge} plan
                </p>
              </div>
            </div>
          </div>

          {/* Plan Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center pb-3">
                <Badge variant="secondary" className="mb-2">
                  Current Plan
                </Badge>
                <CardTitle className="text-lg">{currentPlanInfo.badge}</CardTitle>
                <CardDescription className="text-2xl font-bold text-gray-900">
                  {currentPlanInfo.price}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(currentPlanInfo.features).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    {value === true || value === -1 ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={value === true || value === -1 ? 'text-gray-700' : 'text-gray-400'}>
                      {getFeatureName(key as keyof PlanLimits['features'])}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Required Plan */}
            <Card className="border-2 border-purple-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  Recommended
                </Badge>
              </div>
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg">{requiredPlanInfo.badge}</CardTitle>
                <CardDescription className="text-2xl font-bold text-purple-900">
                  {requiredPlanInfo.price}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(requiredPlanInfo.features).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    {value === true || value === -1 ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={value === true || value === -1 ? 'text-gray-700' : 'text-gray-400'}>
                      {getFeatureName(key as keyof PlanLimits['features'])}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Expert Plan (if not already required) */}
            {requiredPlan !== 'expert' && (
              <Card className="border-2 border-gray-200">
                <CardHeader className="text-center pb-3">
                  <Badge variant="outline" className="mb-2">
                    Premium
                  </Badge>
                  <CardTitle className="text-lg">Expert</CardTitle>
                  <CardDescription className="text-2xl font-bold text-gray-900">
                    {PLAN_CONFIG.expert.price}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(PLAN_CONFIG.expert.features).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      {value === true || value === -1 ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={value === true || value === -1 ? 'text-gray-700' : 'text-gray-400'}>
                        {getFeatureName(key as keyof PlanLimits['features'])}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Upgrade Benefits */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Why Upgrade to {requiredPlanInfo.badge}?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-purple-700">
                  Access to {getFeatureName(featureName as keyof PlanLimits['features'])}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-purple-700">
                  {requiredPlanInfo.description}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-purple-700">
                  Priority support included
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-purple-700">
                  Annual savings vs monthly
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8 py-3 text-lg font-medium"
            >
              <Crown className="h-5 w-5 mr-2" />
              Upgrade to {requiredPlanInfo.badge}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="px-8 py-3 text-lg"
            >
              Maybe Later
            </Button>
          </div>

          {/* Security Note */}
          <div className="text-center text-sm text-gray-500">
            <Shield className="h-4 w-4 inline mr-1" />
            Secure payment powered by Stripe • Cancel anytime
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
