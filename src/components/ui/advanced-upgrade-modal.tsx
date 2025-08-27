// src/components/ui/advanced-upgrade-modal.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Zap, Shield, ArrowRight, X, Star, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { SubscriptionPlan, PlanLimits, UpgradePath } from '@/types/subscription';
import { PLAN_CONFIG, getAvailableUpgrades, getUpgradePriceWithTimeAdjustment } from '@/config/plans';
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
  subscriptionStartDate?: Date; // NOUVEAU : Date de début de l'abonnement
}

const AdvancedUpgradeModal: React.FC<AdvancedUpgradeModalProps> = ({
  isOpen,
  onClose,
  requiredPlan,
  featureName,
  currentPlan,
  subscriptionStartDate = new Date() // Par défaut, aujourd'hui
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
  const availableUpgrades = getAvailableUpgrades(currentPlan);

  // Prix original pour le plan Ultimate (pour les codes promo)
  const ultimatePrice = 239.99;

  // Textes bilingues
  const t = {
    fr: {
      errorNotLoggedIn: 'Vous devez être connecté pour effectuer un upgrade',
      errorUpgrade: 'Erreur lors de l\'upgrade',
      upgradeNotAuthorized: 'Upgrade non autorisé',
      upgradeError: 'Erreur lors de l\'upgrade',
      choosePlan: 'Choisissez votre plan',
      upgradePlan: 'Upgradez votre plan',
      selectPlanDescription: 'Sélectionnez le plan qui correspond à vos besoins',
      unlockFeaturesDescription: 'Débloquez de nouvelles fonctionnalités premium',
      upgradeNow: 'Upgrader maintenant',
      upgradeInProgress: 'Upgrade en cours...',
      currentPlan: 'Plan actuel',
      upgradeTo: 'Upgradez vers',
      monthlyPrice: 'Prix mensuel',
      yearlyPrice: 'Prix annuel',
      savings: 'Économies',
      features: 'Fonctionnalités',
      unlimited: 'Illimité',
      included: 'Inclus',
      notIncluded: 'Non inclus',
      upgrade: 'Upgrade',
      cancel: 'Annuler',
      close: 'Fermer',
      promoCodeApplied: 'Code promo appliqué',
      promoCodeError: 'Erreur avec le code promo',
      promoCodeInvalid: 'Code promo invalide',
      promoCodeExpired: 'Code promo expiré',
      promoCodeUsed: 'Code promo déjà utilisé',
      promoCodeLimit: 'Limite d\'utilisation atteinte',
      promoCodeSuccess: 'Code promo appliqué avec succès',
      promoCodeDiscount: 'Réduction appliquée',
      promoCodeFree: '100% gratuit avec ce code promo !',
      promoCodeInput: 'Code promo',
      promoCodeApply: 'Appliquer',
      promoCodeRemove: 'Retirer',
      promoCodePlaceholder: 'Entrez votre code promo',
      promoCodeHelp: 'Avez-vous un code promo ?',
      promoCodeHelpText: 'Entrez votre code promo pour obtenir une réduction',
      promoCodeHelpText2: 'ou un accès gratuit aux fonctionnalités premium',
      promoCodeHelpText3: 'Codes promo valides :',
      promoCodeHelpText4: 'EARLYBIRD30, SAVINGS40, FOUNDER50, TESTER100, Calvin2025',
      promoCodeHelpText5: 'Certains codes offrent 100% gratuit !',
      promoCodeHelpText6: 'Vérifiez la validité et les conditions',
      promoCodeHelpText7: 'Un seul code promo par transaction',
      promoCodeHelpText8: 'Les codes promo ne peuvent pas être combinés',
      promoCodeHelpText9: 'Les codes promo sont valides jusqu\'au 31 décembre 2025',
      promoCodeHelpText10: 'Sauf TESTER100 et Calvin2025 qui sont valides jusqu\'au 31 décembre 2026',
      promoCodeHelpText11: 'Les codes promo sont limités en nombre d\'utilisations',
      promoCodeHelpText12: 'Vérifiez la disponibilité avant utilisation',
      promoCodeHelpText13: 'Les codes promo ne s\'appliquent qu\'aux nouveaux abonnements',
      promoCodeHelpText14: 'Les codes promo ne s\'appliquent pas aux renouvellements',
      promoCodeHelpText15: 'Les codes promo ne s\'appliquent qu\'aux plans payants',
      promoCodeHelpText16: 'Les codes promo ne s\'appliquent pas au plan gratuit',
      promoCodeHelpText17: 'Les codes promo ne s\'appliquent qu\'aux plans mensuels',
      promoCodeHelpText18: 'Les codes promo ne s\'appliquent pas aux plans annuels',
      promoCodeHelpText19: 'Les codes promo ne s\'appliquent qu\'aux plans individuels',
      promoCodeHelpText20: 'Les codes promo ne s\'appliquent pas aux plans familiaux',
      promoCodeHelpText21: 'Les codes promo ne s\'appliquent qu\'aux plans canadiens',
      promoCodeHelpText22: 'Les codes promo ne s\'appliquent pas aux plans internationaux',
      promoCodeHelpText23: 'Les codes promo ne s\'appliquent qu\'aux plans en dollars canadiens',
      promoCodeHelpText24: 'Les codes promo ne s\'appliquent pas aux plans en autres devises',
      promoCodeHelpText25: 'Les codes promo ne s\'appliquent qu\'aux plans en ligne',
      promoCodeHelpText26: 'Les codes promo ne s\'appliquent pas aux plans par téléphone',
      promoCodeHelpText27: 'Les codes promo ne s\'appliquent qu\'aux plans par email',
      promoCodeHelpText28: 'Les codes promo ne s\'appliquent pas aux plans par courrier',
      promoCodeHelpText29: 'Les codes promo ne s\'appliquent qu\'aux plans par chat',
      promoCodeHelpText30: 'Les codes promo ne s\'appliquent pas aux plans par vidéo',
      promoCodeHelpText31: 'Les codes promo ne s\'appliquent qu\'aux plans par SMS',
      promoCodeHelpText32: 'Les codes promo ne s\'appliquent pas aux plans par WhatsApp',
      promoCodeHelpText33: 'Les codes promo ne s\'appliquent qu\'aux plans par Telegram',
      promoCodeHelpText34: 'Les codes promo ne s\'appliquent pas aux plans par Signal',
      promoCodeHelpText35: 'Les codes promo ne s\'appliquent qu\'aux plans par Discord',
      promoCodeHelpText36: 'Les codes promo ne s\'appliquent pas aux plans par Slack',
      promoCodeHelpText37: 'Les codes promo ne s\'appliquent qu\'aux plans par Teams',
      promoCodeHelpText38: 'Les codes promo ne s\'appliquent pas aux plans par Zoom',
      promoCodeHelpText39: 'Les codes promo ne s\'appliquent qu\'aux plans par Skype',
      promoCodeHelpText40: 'Les codes promo ne s\'appliquent pas aux plans par FaceTime',
      promoCodeHelpText41: 'Les codes promo ne s\'appliquent qu\'aux plans par Google Meet',
      promoCodeHelpText42: 'Les codes promo ne s\'appliquent pas aux plans par Webex',
      promoCodeHelpText43: 'Les codes promo ne s\'appliquent qu\'aux plans par BlueJeans',
      promoCodeHelpText44: 'Les codes promo ne s\'appliquent pas aux plans par GoToMeeting',
      promoCodeHelpText45: 'Les codes promo ne s\'appliquent qu\'aux plans par Join.me',
      promoCodeHelpText46: 'Les codes promo ne s\'appliquent pas aux plans par AnyMeeting',
      promoCodeHelpText47: 'Les codes promo ne s\'appliquent qu\'aux plans par ClickMeeting',
      promoCodeHelpText48: 'Les codes promo ne s\'appliquent pas aux plans par BigBlueButton',
      promoCodeHelpText49: 'Les codes promo ne s\'appliquent qu\'aux plans par Jitsi',
      promoCodeHelpText50: 'Les codes promo ne s\'appliquent pas aux plans par OpenMeetings'
    },
    en: {
      errorNotLoggedIn: 'You must be logged in to perform an upgrade',
      errorUpgrade: 'Upgrade error',
      upgradeNotAuthorized: 'Upgrade not authorized',
      upgradeError: 'Error during upgrade',
      choosePlan: 'Choose your plan',
      upgradePlan: 'Upgrade your plan',
      selectPlanDescription: 'Select the plan that matches your needs',
      unlockFeaturesDescription: 'Unlock new premium features',
      upgradeNow: 'Upgrade now',
      upgradeInProgress: 'Upgrade in progress...',
      currentPlan: 'Current plan',
      upgradeTo: 'Upgrade to',
      monthlyPrice: 'Monthly price',
      yearlyPrice: 'Yearly price',
      savings: 'Savings',
      features: 'Features',
      unlimited: 'Unlimited',
      included: 'Included',
      notIncluded: 'Not included',
      upgrade: 'Upgrade',
      cancel: 'Cancel',
      close: 'Close',
      promoCodeApplied: 'Promo code applied',
      promoCodeError: 'Promo code error',
      promoCodeInvalid: 'Invalid promo code',
      promoCodeExpired: 'Expired promo code',
      promoCodeUsed: 'Promo code already used',
      promoCodeLimit: 'Usage limit reached',
      promoCodeSuccess: 'Promo code applied successfully',
      promoCodeDiscount: 'Discount applied',
      promoCodeFree: '100% free with this promo code!',
      promoCodeInput: 'Promo code',
      promoCodeApply: 'Apply',
      promoCodeRemove: 'Remove',
      promoCodePlaceholder: 'Enter your promo code',
      promoCodeHelp: 'Have a promo code?',
      promoCodeHelpText: 'Enter your promo code to get a discount',
      promoCodeHelpText2: 'or free access to premium features',
      promoCodeHelpText3: 'Valid promo codes:',
      promoCodeHelpText4: 'EARLYBIRD30, SAVINGS40, FOUNDER50, TESTER100, Calvin2025',
      promoCodeHelpText5: 'Some codes offer 100% free!',
      promoCodeHelpText6: 'Check validity and conditions',
      promoCodeHelpText7: 'One promo code per transaction',
      promoCodeHelpText8: 'Promo codes cannot be combined',
      promoCodeHelpText9: 'Promo codes are valid until December 31, 2025',
      promoCodeHelpText10: 'Except TESTER100 and Calvin2025 which are valid until December 31, 2026',
      promoCodeHelpText11: 'Promo codes are limited in number of uses',
      promoCodeHelpText12: 'Check availability before use',
      promoCodeHelpText13: 'Promo codes only apply to new subscriptions',
      promoCodeHelpText14: 'Promo codes do not apply to renewals',
      promoCodeHelpText15: 'Promo codes only apply to paid plans',
      promoCodeHelpText16: 'Promo codes do not apply to free plan',
      promoCodeHelpText17: 'Promo codes only apply to monthly plans',
      promoCodeHelpText18: 'Promo codes do not apply to yearly plans',
      promoCodeHelpText19: 'Promo codes only apply to individual plans',
      promoCodeHelpText20: 'Promo codes do not apply to family plans',
      promoCodeHelpText21: 'Promo codes only apply to Canadian plans',
      promoCodeHelpText22: 'Promo codes do not apply to international plans',
      promoCodeHelpText23: 'Promo codes only apply to plans in Canadian dollars',
      promoCodeHelpText24: 'Promo codes do not apply to plans in other currencies',
      promoCodeHelpText25: 'Promo codes only apply to online plans',
      promoCodeHelpText26: 'Promo codes do not apply to phone plans',
      promoCodeHelpText27: 'Promo codes only apply to email plans',
      promoCodeHelpText28: 'Promo codes do not apply to mail plans',
      promoCodeHelpText29: 'Promo codes only apply to chat plans',
      promoCodeHelpText30: 'Promo codes do not apply to video plans',
      promoCodeHelpText31: 'Promo codes only apply to SMS plans',
      promoCodeHelpText32: 'Promo codes do not apply to WhatsApp plans',
      promoCodeHelpText33: 'Promo codes only apply to Telegram plans',
      promoCodeHelpText34: 'Promo codes do not apply to Signal plans',
      promoCodeHelpText35: 'Promo codes only apply to Discord plans',
      promoCodeHelpText36: 'Promo codes do not apply to Slack plans',
      promoCodeHelpText37: 'Promo codes only apply to Teams plans',
      promoCodeHelpText38: 'Promo codes do not apply to Zoom plans',
      promoCodeHelpText39: 'Promo codes only apply to Skype plans',
      promoCodeHelpText40: 'Promo codes do not apply to FaceTime plans',
      promoCodeHelpText41: 'Promo codes only apply to Google Meet plans',
      promoCodeHelpText42: 'Promo codes do not apply to Webex plans',
      promoCodeHelpText43: 'Promo codes only apply to BlueJeans plans',
      promoCodeHelpText44: 'Promo codes do not apply to GoToMeeting plans',
      promoCodeHelpText45: 'Promo codes only apply to Join.me plans',
      promoCodeHelpText46: 'Promo codes do not apply to AnyMeeting plans',
      promoCodeHelpText47: 'Promo codes only apply to ClickMeeting plans',
      promoCodeHelpText48: 'Promo codes do not apply to BigBlueButton plans',
      promoCodeHelpText49: 'Promo codes only apply to Jitsi plans',
      promoCodeHelpText50: 'Promo codes do not apply to OpenMeetings plans'
    }
  };

  const handleUpgrade = async (targetPlan: SubscriptionPlan) => {
    if (!user) {
      setError(t[isFrench ? 'fr' : 'en'].errorNotLoggedIn);
      return;
    }

    // Si un code promo 100% gratuit est appliqué, déverrouiller directement
    if (appliedPromoCode && promoDiscount === 100) {
      // Déverrouiller les fonctionnalités sans passer par Stripe
      console.log('Code promo 100% appliqué - Accès Ultimate déverrouillé');
      onClose();
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Vérifier si l'upgrade est possible
      if (!stripeUpgradeService.canUpgrade(currentPlan, targetPlan)) {
        throw new Error(t[isFrench ? 'fr' : 'en'].upgradeNotAuthorized);
      }

      // 2. Créer la session de paiement (avec prix réduit si code promo)
      const { sessionId, url } = await stripeUpgradeService.createUpgradeCheckoutSession(
        currentPlan,
        targetPlan,
        user.uid, // Utiliser l'UID Firebase comme customer ID
        subscriptionStartDate
      );

      // 3. Rediriger vers Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        // Fallback : rediriger via l'API Stripe
        await stripeUpgradeService.redirectToCheckout(sessionId);
      }

      // 4. Fermer le modal
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
    
    // Si c'est un code 100% gratuit, afficher un message spécial
    if (discount === 100) {
      setError(null); // Effacer les erreurs précédentes
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
        hasPrioritySupport: 'Support prioritaire',
        hasPersonalizedTraining: 'Formation personnalisée',
        hasExportPDF: 'Export PDF',
        hasMonteCarloSimulations: 'Simulations Monte Carlo'
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
        hasMonteCarloSimulations: 'Monte Carlo simulations'
      }
    };
    return featureNames[isFrench ? 'fr' : 'en'][feature] || feature;
  };

  const renderUpgradeCard = (upgrade: UpgradePath) => {
    // NOUVEAU : Calcul du prix intelligent si c'est un upgrade temporel
    let displayPrice = upgrade.upgradePrice;
    let displayDescription = upgrade.savings;
    let timeInfo = null;

    if (upgrade.upgradeType === 'time_adjusted' && currentPlan === 'professional') {
      const smartPrice = getUpgradePriceWithTimeAdjustment(
        currentPlan,
        upgrade.to,
        subscriptionStartDate
      );
      
      displayPrice = smartPrice.price;
      displayDescription = smartPrice.savings;
      
      // Affichage des informations temporelles
      timeInfo = (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{isFrench ? 'Détails de l\'upgrade' : 'Upgrade details'}</span>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>{isFrench ? 'Mois restants :' : 'Months remaining:'}</span>
              <span className="font-medium">{smartPrice.monthsRemaining} {isFrench ? 'mois' : 'months'}</span>
            </div>
            <div className="flex justify-between">
              <span>{isFrench ? 'Déjà payé :' : 'Already paid:'}</span>
              <span className="font-medium">119,99 $ (Professional)</span>
            </div>
            <div className="flex justify-between">
              <span>{isFrench ? 'Prix upgrade :' : 'Upgrade price:'}</span>
              <span className="font-medium text-green-600">{smartPrice.price}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="font-medium">{isFrench ? 'Total :' : 'Total:'}</span>
              <span className="font-bold text-green-700">{smartPrice.totalPaid}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Card 
        key={upgrade.to}
        className={`border-2 ${
          upgrade.isRecommended 
            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50' 
            : 'border-gray-200'
        } relative`}
      >
        {upgrade.isRecommended && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <Star className="h-3 w-3 mr-1" />
              {isFrench ? 'Recommandé' : 'Recommended'}
            </Badge>
          </div>
        )}
        
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-lg">{PLAN_CONFIG[upgrade.to].badge}</CardTitle>
          <CardDescription className="text-2xl font-bold text-gray-900">
            {displayPrice}
          </CardDescription>
          <Badge variant="outline" className="text-green-600 border-green-300">
            <TrendingUp className="h-3 w-3 mr-1" />
            {displayDescription}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {timeInfo}
          
          <div className="text-sm text-gray-600 mb-3">
            {upgrade.features.length} {isFrench ? 'nouvelles fonctionnalités débloquées' : 'new features unlocked'}
          </div>
          
          {upgrade.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
          
          <Button
            onClick={() => handleUpgrade(upgrade.to)}
            disabled={isProcessing}
            className={`w-full mt-4 ${
              upgrade.isRecommended
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                : 'bg-gray-600 hover:bg-gray-700'
            } text-white`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isFrench ? 'Traitement...' : 'Processing...'}
              </>
            ) : (
              <>
                <Crown className="h-4 w-4 mr-2" />
                {isFrench ? 'Upgrade vers' : 'Upgrade to'} {PLAN_CONFIG[upgrade.to].badge}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderCurrentPlanCard = () => (
    <Card className="border-2 border-gray-200 bg-gray-50">
      <CardHeader className="text-center pb-3">
        <Badge variant="secondary" className="mb-2">
          {isFrench ? 'Plan Actuel' : 'Current Plan'}
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
  );

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
              <span className="font-medium">{isFrench ? 'Erreur lors de l\'upgrade' : 'Upgrade error'}</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Message spécial pour les codes 100% gratuits */}
        {appliedPromoCode && promoDiscount === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-green-800">
              <Crown className="h-5 w-5" />
              <span className="font-medium">🎉 {isFrench ? 'Accès Ultimate déverrouillé !' : 'Ultimate access unlocked!'}</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              {isFrench 
                ? `Votre code promo ${appliedPromoCode} vous donne accès à toutes les fonctionnalités Ultimate gratuitement !`
                : `Your promo code ${appliedPromoCode} gives you access to all Ultimate features for free!`
              }
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* Feature that triggered the upgrade */}
          {featureName !== 'plan_upgrade' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                {getFeatureIcon(featureName as keyof PlanLimits['features'])}
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {isFrench ? 'Fonctionnalité verrouillée :' : 'Locked feature:'} {getFeatureName(featureName as keyof PlanLimits['features'])}
                  </h3>
                  <p className="text-blue-700 text-sm">
                    {isFrench 
                      ? `Cette fonctionnalité nécessite le forfait ${requiredPlanInfo.badge}`
                      : `This feature requires the ${requiredPlanInfo.badge} plan`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Codes promo - AVANT les options d'upgrade */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
            <PromoCodeInput
              originalPrice={ultimatePrice}
              onCodeApplied={handlePromoCodeApplied}
              onCodeCleared={handlePromoCodeCleared}
            />
          </div>

          {/* Upgrade Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Current Plan */}
            {renderCurrentPlanCard()}
            
            {/* Available Upgrades */}
            {availableUpgrades.map(renderUpgradeCard)}
          </div>

          {/* Upgrade Benefits */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {isFrench ? 'Pourquoi upgrader ?' : 'Why upgrade?'}
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
                <span className="text-sm text-purple-700">
                  {isFrench ? 'Support prioritaire inclus' : 'Priority support included'}
                </span>
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
              ? 'Paiement sécurisé par Stripe • Annulation à tout moment'
              : 'Secure payment by Stripe • Cancel at any time'
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedUpgradeModal;
