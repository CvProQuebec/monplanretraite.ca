import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Star, 
  Lock, 
  Zap, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SubscriptionPlan } from '@/types/subscription';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '@/lib/utils';

interface PlanRestrictedSectionProps {
  sectionId: string;
  requiredPlan: SubscriptionPlan;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

// Configuration des restrictions par section (même que dans PlanRestrictedButton)
const SECTION_PLAN_REQUIREMENTS: Record<string, SubscriptionPlan> = {
  'dashboard': 'free',
  'personal': 'free',
  'retirement': 'free',
  'savings': 'free',
  'cashflow': 'free', // Accessible gratuitement
  'advanced-expenses': 'professional',
  'tax': 'professional',
  'simulator': 'professional',
  'reports': 'professional',
  'session': 'free',
  'emergency-info': 'free',
  'cpp': 'free', // Accessible gratuitement
  'combined-pension': 'free', // Accessible gratuitement
  'premium-features': 'ultimate',
  'demos': 'free'
};

// Fonction pour vérifier si un plan a accès à une fonctionnalité
const hasPlanAccess = (userPlan: SubscriptionPlan, requiredPlan: SubscriptionPlan): boolean => {
  const planHierarchy: Record<SubscriptionPlan, number> = {
    'free': 0,
    'professional': 1,
    'expert': 2
  };

  return planHierarchy[userPlan] >= planHierarchy[requiredPlan];
};

// Fonction pour obtenir l'icône du plan requis
const getPlanIcon = (plan: SubscriptionPlan) => {
  switch (plan) {
    case 'professional':
      return <Star className="w-6 h-6 text-mpr-interactive" />;
    case 'expert':
      return <Crown className="w-6 h-6 text-purple-600" />;
    default:
      return <Lock className="w-6 h-6 text-gray-500" />;
  }
};

// Fonction pour obtenir la couleur du plan
const getPlanColor = (plan: SubscriptionPlan) => {
  switch (plan) {
    case 'professional':
      return 'text-mpr-interactive';
    case 'expert':
      return 'text-purple-600';
    default:
      return 'text-gray-500';
  }
};

// Fonction pour obtenir le nom du plan
const getPlanName = (plan: SubscriptionPlan, language: 'fr' | 'en'): string => {
  const names = {
    fr: {
      'free': 'Gratuit',
      'professional': 'Professionnel',
      'ultimate': 'Expert'
    },
    en: {
      'free': 'Free',
      'professional': 'Professional',
      'ultimate': 'Expert'
    }
  };
  return names[language][plan];
};

// Fonction pour obtenir les fonctionnalités du plan
const getPlanFeatures = (plan: SubscriptionPlan, language: 'fr' | 'en'): string[] => {
  const features = {
    fr: {
      'professional': [
        'simulations illimitées',
        'rapports illimités',
        '3 profils utilisateurs',
        'analyses avancées',
        'simulations Monte Carlo',
        'export PDF',
        'optimisation fiscale'
      ],
      'ultimate': [
        'tout du plan Professionnel',
        'profils illimités',
        'conseils IA',

        'collaboration conseiller',
        'support prioritaire',
        'formation personnalisée'
      ]
    },
    en: {
      'professional': [
        'Unlimited simulations',
        'Unlimited reports',
        '3 user profiles',
        'Advanced analytics',
        'Monte Carlo simulations',
        'PDF export',
        'Tax optimization'
      ],
      'ultimate': [
        'Everything from Professional',
        'Unlimited profiles',
        'AI advice',

        'Advisor collaboration',
        'Priority support',
        'Personalized training'
      ]
    }
  };
  return features[language][plan] || [];
};

export const PlanRestrictedSection: React.FC<PlanRestrictedSectionProps> = ({
  sectionId,
  requiredPlan,
  children,
  fallback,
  showUpgrade = true
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  
  if (!user) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-500" />
            {language === 'fr' ? 'Connexion requise' : 'Login required'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {language === 'fr' 
              ? 'Connectez-vous pour accéder à cette fonctionnalité'
              : 'Please login to access this feature'
            }
          </p>
          <Button variant="outline" className="w-full">
            {language === 'fr' ? 'Se connecter' : 'Login'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentPlan = user.plan;
  const hasAccess = hasPlanAccess(currentPlan, requiredPlan);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  const planFeatures = getPlanFeatures(requiredPlan, language);

  return (
    <Card className="border-dashed border-2 border-amber-300 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          {getPlanIcon(requiredPlan)}
          {language === 'fr' 
            ? `Plan ${getPlanName(requiredPlan, language)} requis`
            : `${getPlanName(requiredPlan, language)} plan required`
          }
        </CardTitle>
        <p className="text-amber-700">
          {language === 'fr'
            ? 'Cette section nécessite un plan supérieur'
            : 'This section requires a higher plan'
          }
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Plan actuel vs plan requis */}
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-amber-800">
                {language === 'fr' ? 'Votre plan actuel :' : 'Your current plan:'}
              </span>
              <span className={cn("font-medium", getPlanColor(currentPlan))}>
                {getPlanName(currentPlan, language)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-amber-800">
                {language === 'fr' ? 'Plan requis :' : 'Required plan:'}
              </span>
              <span className={cn("font-medium", getPlanColor(requiredPlan))}>
                {getPlanName(requiredPlan, language)}
              </span>
            </div>
          </div>

          {/* Fonctionnalités du plan requis */}
          <div>
            <h4 className="font-medium text-amber-800 mb-2">
              {language === 'fr' 
                ? `Fonctionnalités du plan ${getPlanName(requiredPlan, language)} :`
                : `${getPlanName(requiredPlan, language)} plan features:`
              }
            </h4>
            <div className="space-y-2">
              {planFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-amber-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton d'upgrade */}
          <Button 
            className="w-full bg-gradient-to-r from-mpr-interactive to-purple-600 hover:from-mpr-navy-mid hover:to-purple-700"
            onClick={() => {
              // Rediriger vers la page de tarification
              window.location.href = language === 'fr' ? '/fr/retraite' : '/en/retirement';
            }}
          >
            <Zap className="w-4 h-4 mr-2" />
            {language === 'fr' 
              ? 'Passer au plan supérieur'
              : 'Upgrade to higher plan'
            }
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Hook pour vérifier l'accès à une section
export const useSectionAccess = (sectionId: string) => {
  const { user } = useAuth();
  const currentPlan = user?.plan || 'free';
  const requiredPlan = SECTION_PLAN_REQUIREMENTS[sectionId] || 'free';
  
  return {
    hasAccess: hasPlanAccess(currentPlan, requiredPlan),
    requiredPlan,
    currentPlan,
    isPremium: requiredPlan !== 'free'
  };
};

// Composant pour afficher un message d'upgrade simple
export const UpgradeMessage: React.FC<{ 
  requiredPlan: SubscriptionPlan; 
  feature?: string;
  className?: string;
}> = ({ requiredPlan, feature, className }) => {
  const { language } = useLanguage();
  
  return (
    <div className={cn("text-center p-6 bg-gradient-to-r from-mpr-interactive-lt to-purple-50 rounded-lg border border-mpr-border", className)}>
      <div className="flex items-center justify-center gap-2 mb-3">
        {getPlanIcon(requiredPlan)}
        <span className="font-medium text-mpr-navy">
          {language === 'fr' 
            ? `Plan ${getPlanName(requiredPlan, language)} requis`
            : `${getPlanName(requiredPlan, language)} plan required`
          }
        </span>
      </div>
      {feature && (
        <p className="text-mpr-navy mb-4">
          {language === 'fr'
            ? `La fonctionnalité "${feature}" nécessite un plan supérieur`
            : `The "${feature}" feature requires a higher plan`
          }
        </p>
      )}
      <Button 
        size="sm"
        className="bg-gradient-to-r from-mpr-interactive to-purple-600 hover:from-mpr-navy-mid hover:to-purple-700"
        onClick={() => {
          window.location.href = language === 'fr' ? '/fr/retraite' : '/en/retirement';
        }}
      >
        <Zap className="w-4 h-4 mr-2" />
        {language === 'fr' ? 'Voir les plans' : 'View plans'}
      </Button>
    </div>
  );
};
