import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Star, 
  Lock, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SubscriptionPlan } from '@/types/subscription';
import { PLAN_CONFIG } from '@/config/plans';

interface PlanIndicatorProps {
  className?: string;
}

// Fonction pour obtenir l'icône du plan
const getPlanIcon = (plan: SubscriptionPlan) => {
  switch (plan) {
    case 'professional':
      return <Star className="w-5 h-5 text-mpr-interactive" />;
    case 'expert':
      return <Crown className="w-5 h-5 text-purple-600" />;
    default:
      return <Lock className="w-5 h-5 text-gray-500" />;
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

// Fonction pour obtenir la description du plan
const getPlanDescription = (plan: SubscriptionPlan, language: 'fr' | 'en'): string => {
  const descriptions = {
    fr: {
      'free': 'Accès de base pour commencer',
      'professional': 'Pour les utilisateurs sérieux',
      'ultimate': 'Solution complète avec IA'
    },
    en: {
      'free': 'Basic access to get started',
      'professional': 'For serious users',
      'ultimate': 'Complete solution with AI'
    }
  };
  return descriptions[language][plan];
};

// Fonction pour obtenir le prix du plan
const getPlanPrice = (plan: SubscriptionPlan, language: 'fr' | 'en'): string => {
  const prices = {
    fr: {
      'free': 'Gratuit',
      'professional': '297 $/an',
      'ultimate': '597 $/an'
    },
    en: {
      'free': 'Free',
      'professional': '$297/year',
      'ultimate': '$597/year'
    }
  };
  return prices[language][plan];
};

// Fonction pour obtenir les fonctionnalités du plan
const getPlanFeatures = (plan: SubscriptionPlan, language: 'fr' | 'en'): string[] => {
  const features = {
    fr: {
      'free': [
        'Simulations de base',
        '1 rapport par mois',
        '1 profil utilisateur',
        'Gestion des dépenses basique'
      ],
      'professional': [
        'Simulations illimitées',
        'Rapports illimités',
        '3 profils utilisateurs',
        'Analyses avancées',
        'Simulations Monte Carlo',
        'Export PDF',
        'Optimisation fiscale'
      ],
      'ultimate': [
        'Tout du plan Professionnel',
        'Profils illimités',
        'Conseils IA',

        'Collaboration conseiller',
        'Support prioritaire',
        'Formation personnalisée'
      ]
    },
    en: {
      'free': [
        'Basic simulations',
        '1 report per month',
        '1 user profile',
        'Basic expense management'
      ],
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
  return features[language][plan];
};

export const PlanIndicator: React.FC<PlanIndicatorProps> = ({ className }) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Détection de la langue depuis l'URL
  const isEnglish = window.location.pathname.includes('/en/');
  const language: 'fr' | 'en' = isEnglish ? 'en' : 'fr';
  
  if (!user) {
    return null;
  }

  const currentPlan = user.plan;
  const planConfig = PLAN_CONFIG[currentPlan];
  const planFeatures = getPlanFeatures(currentPlan, language);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            {getPlanIcon(currentPlan)}
            <span className={getPlanColor(currentPlan)}>
              {getPlanName(currentPlan, language)}
            </span>
            <Badge variant="outline" className="ml-2">
              {planConfig?.badge || 'Actuel'}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {getPlanDescription(currentPlan, language)}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Prix du plan */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-charcoal-900">
            {getPlanPrice(currentPlan, language)}
          </div>
        </div>

        {/* Fonctionnalités du plan */}
        {isExpanded && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-sm text-charcoal-700">
              {language === 'fr' ? 'Fonctionnalités incluses :' : 'Included features:'}
            </h4>
            <div className="space-y-2">
              {planFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-charcoal-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bouton d'upgrade si plan gratuit */}
        {currentPlan === 'free' && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              className="w-full bg-gradient-to-r from-mpr-interactive to-purple-600 hover:from-mpr-navy-mid hover:to-purple-700"
              onClick={() => {
                // Rediriger vers la page de tarification
                window.location.href = language === 'fr' ? '/fr/retraite' : '/en/retirement';
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              {language === 'fr' ? 'Voir les plans premium' : 'View premium plans'}
            </Button>
          </div>
        )}

        {/* Indicateur de statut */}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="w-3 h-3" />
          <span>
            {language === 'fr' 
              ? 'Plan actif depuis le ' 
              : 'Active plan since '
            }
            {new Date(user.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant compact pour afficher juste le plan actuel
export const CompactPlanIndicator: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }

  const isEnglish = window.location.pathname.includes('/en/');
  const language: 'fr' | 'en' = isEnglish ? 'en' : 'fr';

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border">
      {getPlanIcon(user.plan)}
      <span className="text-sm font-medium text-charcoal-700">
        {getPlanName(user.plan, language)}
      </span>
      <Badge variant="outline">
        {PLAN_CONFIG[user.plan]?.badge || 'Actuel'}
      </Badge>
    </div>
  );
};
