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
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  
  const requiredPlanInfo = PLAN_CONFIG[requiredPlan];
  const currentPlanInfo = PLAN_CONFIG[currentPlan];
  const availableUpgrades = getAvailableUpgrades(currentPlan);

  // Prix original pour le plan Ultimate (pour les codes promo)
  const ultimatePrice = 239.99;

  const handleUpgrade = async (targetPlan: SubscriptionPlan) => {
    if (!user) {
      setError('Vous devez être connecté pour effectuer un upgrade');
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
        throw new Error('Upgrade non autorisé');
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
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'upgrade');
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
    };
    return featureNames[feature] || feature;
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
            <span className="font-medium">Détails de l'upgrade</span>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Mois restants :</span>
              <span className="font-medium">{smartPrice.monthsRemaining} mois</span>
            </div>
            <div className="flex justify-between">
              <span>Déjà payé :</span>
              <span className="font-medium">119,99 $ (Professional)</span>
            </div>
            <div className="flex justify-between">
              <span>Prix upgrade :</span>
              <span className="font-medium text-green-600">{smartPrice.price}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="font-medium">Total :</span>
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
              Recommandé
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
            {upgrade.features.length} nouvelles fonctionnalités débloquées
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
                Traitement...
              </>
            ) : (
              <>
                <Crown className="h-4 w-4 mr-2" />
                Upgrade vers {PLAN_CONFIG[upgrade.to].badge}
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
          Plan Actuel
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
                  {currentPlan === 'free' ? 'Choisissez votre plan' : 'Upgradez votre plan'}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {currentPlan === 'free' 
                    ? 'Sélectionnez le plan qui correspond à vos besoins'
                    : 'Débloquez de nouvelles fonctionnalités premium'
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
              <span className="font-medium">Erreur lors de l'upgrade</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Message spécial pour les codes 100% gratuits */}
        {appliedPromoCode && promoDiscount === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-green-800">
              <Crown className="h-5 w-5" />
              <span className="font-medium">🎉 Accès Ultimate déverrouillé !</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Votre code promo {appliedPromoCode} vous donne accès à toutes les fonctionnalités Ultimate gratuitement !
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
                    Fonctionnalité verrouillée : {getFeatureName(featureName as keyof PlanLimits['features'])}
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Cette fonctionnalité nécessite le forfait {requiredPlanInfo.badge}
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
              Pourquoi upgrader ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-purple-700">
                  Accès à toutes les fonctionnalités premium
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-purple-700">
                  Support prioritaire inclus
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-purple-700">
                  Prix ajusté selon votre temps restant
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-purple-700">
                  Annulation à tout moment
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
              Peut-être plus tard
            </Button>
          </div>

          {/* Security Note */}
          <div className="text-center text-sm text-gray-500">
            <Shield className="h-4 w-4 inline mr-1" />
            Paiement sécurisé par Stripe • Annulation à tout moment
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedUpgradeModal;
