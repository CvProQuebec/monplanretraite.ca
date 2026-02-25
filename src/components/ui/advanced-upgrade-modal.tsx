// src/components/ui/advanced-upgrade-modal.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Zap, Shield, ArrowRight, X, Star } from 'lucide-react';
import { SubscriptionPlan, PlanLimits } from '@/types/subscription';
import { PLAN_CONFIG } from '@/config/plans';
import { stripeUpgradeService } from '@/services/stripeUpgradeService';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { PromoCodeInput } from './promo-code-input';

interface AdvancedUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan: SubscriptionPlan;
  featureName: string;
  currentPlan: SubscriptionPlan;
  subscriptionStartDate?: Date;
}

const AdvancedUpgradeModal: React.FC<AdvancedUpgradeModalProps> = ({
  isOpen,
  onClose,
  requiredPlan,
  featureName,
  currentPlan,
  subscriptionStartDate = new Date()
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isFrench = language === 'fr';
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  
  const requiredPlanInfo = PLAN_CONFIG[requiredPlan];
  const currentPlanInfo = PLAN_CONFIG[currentPlan];

  // Prix original pour le plan Expert (pour les codes promo)
  const expertPrice = 597;

  const t = {
    fr: {
      errorNotLoggedIn: 'Vous devez être connecté pour effectuer une mise à niveau',
      errorUpgrade: 'Erreur lors de la mise à niveau',
      upgradeNotAuthorized: 'Mise à niveau non autorisée',
      upgradeError: 'Erreur lors de la mise à niveau',
      choosePlan: 'Choisissez votre plan',
      upgradePlan: 'Mise à niveau de votre plan',
      selectPlanDescription: 'Sélectionnez le plan qui correspond à vos besoins',
      unlockFeaturesDescription: 'Débloquez de nouvelles fonctionnalités premium'
    },
    en: {
      errorNotLoggedIn: 'You must be logged in to perform an upgrade',
      errorUpgrade: 'Upgrade error',
      upgradeNotAuthorized: 'Upgrade not authorized',
      upgradeError: 'Error during upgrade',
      choosePlan: 'Choose your plan',
      upgradePlan: 'Upgrade your plan',
      selectPlanDescription: 'Select the plan that matches your needs',
      unlockFeaturesDescription: 'Unlock new premium features'
    }
  };

  const handleUpgrade = async (targetPlan: SubscriptionPlan) => {
    if (!user) {
      setError(t[isFrench ? 'fr' : 'en'].errorNotLoggedIn);
      return;
    }

    if (appliedPromoCode && promoDiscount === 100) {
      console.log('Code promo 100 % appliqué - Accès Expert déverrouillé');
      onClose();
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      if (!stripeUpgradeService.canUpgrade(currentPlan, targetPlan)) {
        throw new Error(t[isFrench ? 'fr' : 'en'].upgradeNotAuthorized);
      }

      const { sessionId, url } = await stripeUpgradeService.createUpgradeCheckoutSession(
        currentPlan,
        targetPlan,
        user.id,
        subscriptionStartDate
      );

      if (url) {
        window.location.href = url;
      } else {
        await stripeUpgradeService.redirectToCheckout(sessionId);
      }

      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'upgrade:', error);
      setError(error instanceof Error ? error.message : t[isFrench ? 'fr' : 'en'].upgradeError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePromoCodeApplied = (code: string, discount: number) => {
    setAppliedPromoCode(code);
    setPromoDiscount(discount);
    
    if (discount === 100) {
      setError(null);
    }
  };

  const handlePromoCodeCleared = () => {
    setAppliedPromoCode(null);
    setPromoDiscount(0);
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
      fr: {
        maxSimulations: 'Simulations illimitées',
        maxReports: 'Rapports illimités',
        maxProfiles: 'Profils multiples',
        hasAdvancedAnalytics: 'Analyses avancées',
        hasAIConsulting: 'Conseils IA',
        hasIntegrations: 'Intégrations',
        hasPersonalizedTraining: 'Formation personnalisée',
        hasExportPDF: 'Export PDF',
        hasMonteCarloSimulations: 'Simulations Monte Carlo',
        hasCashflowManagement: 'Gestion du flux de trésorerie',
        hasWithdrawalStrategies: 'Stratégies de décaissement',
        hasExpensePlanning: 'Planification des dépenses',
        hasTaxOptimization: 'Optimisation fiscale',
        hasFinancialAssistant: 'Assistant Financier Personnel',
        hasBudgetModule: 'Module Budget',
        maxExpenseProjects: 'Projets de dépenses'
      },
      en: {
        maxSimulations: 'Unlimited simulations',
        maxReports: 'Unlimited reports',
        maxProfiles: 'Multiple profiles',
        hasAdvancedAnalytics: 'Advanced analytics',
        hasAIConsulting: 'AI consulting',
        hasIntegrations: 'Integrations',
        hasPrioritySupport: 'Priority support',
        hasPersonalizedTraining: 'Personalized training',
        hasExportPDF: 'PDF export',
        hasMonteCarloSimulations: 'Monte Carlo simulations',
        hasCashflowManagement: 'Cash flow management',
        hasWithdrawalStrategies: 'Withdrawal strategies',
        hasExpensePlanning: 'Expense planning',
        hasTaxOptimization: 'Tax optimization',
        hasFinancialAssistant: 'Personal Financial Assistant',
        hasBudgetModule: 'Budget Module',
        maxExpenseProjects: 'Expense projects'
      }
    };
    return featureNames[isFrench ? 'fr' : 'en'][feature] || feature;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {currentPlan === 'free' ? t[isFrench ? 'fr' : 'en'].choosePlan : t[isFrench ? 'fr' : 'en'].upgradePlan}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {currentPlan === 'free' 
                    ? t[isFrench ? 'fr' : 'en'].selectPlanDescription
                    : t[isFrench ? 'fr' : 'en'].unlockFeaturesDescription
                  }
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

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-red-800">
              <Shield className="h-5 w-5" />
              <span className="font-medium">{isFrench ? 'Erreur lors de la mise à jour' : 'Upgrade error'}</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Message spécial pour les codes 100 % gratuits */}
        {appliedPromoCode && promoDiscount === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-green-800">
              <Crown className="h-5 w-5" />
              <span className="font-medium">🎉 {isFrench ? 'Accès Expert déverrouillé !' : 'Expert access unlocked!'}</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              {isFrench 
                ? `Votre code promo ${appliedPromoCode} vous donne accès à toutes les fonctionnalités Expert gratuitement !`
                : `Your promo code ${appliedPromoCode} gives you access to all Expert features for free!`
              }
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Feature that triggered the upgrade */}
          {featureName !== 'plan_upgrade' && (
            <div className="bg-mpr-interactive-lt border border-mpr-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                {getFeatureIcon(featureName as keyof PlanLimits['features'])}
                <div>
                  <h3 className="font-semibold text-mpr-navy">
                    {isFrench ? 'Fonctionnalité verrouillée :' : 'Locked feature:'} {getFeatureName(featureName as keyof PlanLimits['features'])}
                  </h3>
                  <p className="text-mpr-navy text-sm">
                    {isFrench 
                      ? `Cette fonctionnalité nécessite le forfait ${requiredPlanInfo.badge}`
                      : `This feature requires the ${requiredPlanInfo.badge} plan`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Codes promo */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
            <PromoCodeInput
              originalPrice={expertPrice}
              onCodeApplied={handlePromoCodeApplied}
              onCodeCleared={handlePromoCodeCleared}
            />
          </div>

          {/* Grille complète des 3 plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan Gratuit */}
            <Card className={`border-2 relative ${currentPlan === 'free' ? 'border-mpr-interactive bg-mpr-interactive-lt' : 'border-gray-200'}`}>
              {currentPlan === 'free' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-mpr-interactive-lt text-mpr-navy border border-mpr-border">
                    {isFrench ? 'Plan Actuel' : 'Current Plan'}
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg text-gray-900">{PLAN_CONFIG.free.badge}</CardTitle>
                <CardDescription className="text-3xl font-bold text-gray-900">
                  {PLAN_CONFIG.free.price}
                </CardDescription>
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {isFrench ? 'VALEUR : 500 $ GRATUIT' : 'VALUE: 500$+ FREE'}
                </div>
                <div className="text-xs text-green-600">
                  {isFrench ? 'Seule plateforme au Québec à offrir cela gratuitement' : 'Only platform in Quebec to offer this for free'}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{isFrench ? 'Module d\'urgence professionnel (8 sections)' : 'Professional emergency module (8 sections)'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{isFrench ? 'Planification budget et dépenses' : 'Budget and expense planning'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{isFrench ? 'Calculateurs de base (5 outils)' : 'Basic calculators (5 tools)'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{isFrench ? 'Gestion revenus et prestations RREGOP/CPP' : 'Income and benefits management RREGOP/CPP'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{isFrench ? 'Sécurité bancaire (chiffrement AES-256)' : 'Banking security (AES-256 encryption)'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{isFrench ? '2 simulations/mois • Données 100 % privées' : '2 simulations/month • 100% private data'}</span>
                </div>
                {currentPlan === 'free' && (
                  <Button 
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
                    disabled
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {isFrench ? 'Commencer GRATUITEMENT' : 'Start FREE'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Plan Professionnel */}
            <Card className={`border-2 relative ${currentPlan === 'professional' ? 'border-mpr-interactive bg-mpr-interactive-lt' : 'border-purple-500'}`}>
              {currentPlan === 'professional' ? (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-mpr-interactive-lt text-mpr-navy border border-mpr-border">
                    {isFrench ? 'Plan Actuel' : 'Current Plan'}
                  </Badge>
                </div>
              ) : (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
                    ☆ {isFrench ? 'Recommandé' : 'Recommended'}
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 mx-auto mb-2 bg-mpr-interactive-lt rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-mpr-interactive" />
                </div>
                <CardTitle className="text-lg text-purple-900">{PLAN_CONFIG.professional.badge}</CardTitle>
                <CardDescription className="text-3xl font-bold text-purple-900">
                  {PLAN_CONFIG.professional.price}
                </CardDescription>
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {isFrench ? '80 % moins cher que la concurrence' : '80% cheaper than competition'}
                </div>
                <div className="text-xs text-mpr-interactive">
                  {isFrench ? 'Économie de 94 %' : 'Save 94%'}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="bg-mpr-interactive-lt text-mpr-navy text-xs px-2 py-1 rounded-full mb-2">
                  {isFrench ? `VALEUR : 5 000 $ pour 297 $` : `VALUE: 5000$+ for 297 $`}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{isFrench ? 'Tout du plan Gratuit + 45 fonctionnalités' : 'All Free plan + 45 features'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{isFrench ? 'Assistant IA Personnel (prévention catastrophes)' : 'Personal AI Assistant (disaster prevention)'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{isFrench ? 'Calculateurs avancés (IRR, TWR, Monte Carlo)' : 'Advanced calculators (IRR, TWR, Monte Carlo)'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{isFrench ? 'Modules RREGOP + SRG complets' : 'Complete RREGOP + SRG modules'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{isFrench ? 'Optimisation fiscale avancée (REER/CELI)' : 'Advanced tax optimization (RRSP/TFSA)'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{isFrench ? 'Rapports professionnels • Simulations illimitées' : 'Professional reports • Unlimited simulations'}</span>
                </div>
                {currentPlan !== 'professional' && currentPlan !== 'expert' && (
                  <Button 
                    className="w-full mt-4 bg-mpr-interactive hover:bg-mpr-interactive-dk text-white"
                    onClick={() => handleUpgrade('professional')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>{isFrench ? 'Mise à niveau en cours...' : 'Upgrading...'}</>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        {isFrench ? 'Générer mon étude (Pro)' : 'Generate my study (Pro)'}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Plan Expert */}
            <Card className={`border-2 relative ${currentPlan === 'expert' ? 'border-mpr-interactive bg-mpr-interactive-lt' : 'border-gray-200'}`}>
              {currentPlan === 'expert' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-mpr-interactive-lt text-mpr-navy border border-mpr-border">
                    {isFrench ? 'Plan actuel' : 'Current Plan'}
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg text-gray-900">{PLAN_CONFIG.expert.badge}</CardTitle>
                <CardDescription className="text-3xl font-bold text-gray-900">
                  {appliedPromoCode && promoDiscount > 0 ? (
                    <div>
                      <span className="line-through text-gray-500 text-xl">{PLAN_CONFIG.expert.price}</span>
                      <br />
                      <span className="text-green-600">
                        {promoDiscount === 100 ? (
                          isFrench ? 'GRATUIT !' : 'FREE!'
                        ) : (
                          `${Math.round(expertPrice * (1 - promoDiscount / 100))} $ ${isFrench ? '/an' : '/year'}`
                        )}
                      </span>
                    </div>
                  ) : (
                    PLAN_CONFIG.expert.price
                  )}
                </CardDescription>
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {isFrench ? '60 % moins cher que la concurrence' : '60% cheaper than competition'}
                </div>
                <div className="text-xs text-purple-600">
                  {isFrench ? 'Niveau consultant • Économie de 94 % • Évite erreurs coûteuses' : 'Consultant level • Save 94% • Avoid costly errors'}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mb-2">
                  {isFrench ? `VALEUR : 10 000 $ pour 597 $` : `VALUE: 10 000$+ for 597 $`}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{isFrench ? 'Suite complète : 75+ fonctionnalités' : 'Complete suite: 75+ features'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="h-4 w-4 text-purple-600" />
                  <span className="text-gray-700">{isFrench ? 'Planification successorale complète' : 'Complete succession planning'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="h-4 w-4 text-purple-600" />
                  <span className="text-gray-700">{isFrench ? 'Monte Carlo 1000+ itérations • IA prédictive' : 'Monte Carlo 1000+ iterations • Predictive AI'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="h-4 w-4 text-purple-600" />
                  <span className="text-gray-700">{isFrench ? 'Optimisation immobilière avancée' : 'Advanced real estate optimization'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="h-4 w-4 text-purple-600" />
                  <span className="text-gray-700">{isFrench ? 'Rapports niveau consultant • Export PDF' : 'Consultant-level reports • PDF export'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="h-4 w-4 text-purple-600" />

                </div>
                {currentPlan !== 'expert' && (
                  <Button 
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => handleUpgrade('expert')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>{isFrench ? 'Mise à niveau en cours...' : 'Upgrading...'}</>
                    ) : (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        {isFrench ? 'Générer mon étude (Expert)' : 'Generate my study (Expert)'}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upgrade Benefits */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {isFrench ? 'Pourquoi mettre à niveau?' : 'Why upgrade?'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-purple-700">
                  {isFrench ? 'Accès à toutes les fonctionnalités premium' : 'Access to all premium features'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />

              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-purple-700">
                  {isFrench ? 'Prix ajusté selon votre temps restant' : 'Price adjusted based on your remaining time'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-purple-700">
                  {isFrench ? 'Annulation à tout moment' : 'Cancel at any time'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-8 py-3 text-lg"
            >
              {isFrench ? 'Peut-être plus tard' : 'Maybe later'}
            </Button>
          </div>

          {/* Security Note */}
          <div className="text-center text-sm text-gray-500">
            <Shield className="h-4 w-4 inline mr-1" />
            {isFrench 
              ? 'Paiement sécurisé par Stripe • Annulation 14 jours'
              : 'Secure payment by Stripe • 30-day cancellation'
            }
          </div>
          
          {/* Important Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800 mb-1">
                  {isFrench ? 'Important' : 'Important'}
                </h4>
                <p className="text-orange-700 text-sm">
                  {isFrench 
                    ? 'Si le forfait est annulé, les données du module annulé ne seront plus considérées/utilisées/traitées par l\'application web.'
                    : 'If the plan is cancelled, the cancelled module data will no longer be considered/used/processed by the web application.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedUpgradeModal;
