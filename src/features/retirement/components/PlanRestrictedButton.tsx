import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock, Crown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { SubscriptionPlan } from '@/types/subscription';

interface PlanRestrictedButtonProps {
  sectionId: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPlan: SubscriptionPlan;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

// Configuration des restrictions par section
const SECTION_PLAN_REQUIREMENTS: Record<string, SubscriptionPlan> = {
  'dashboard': 'free', // Toujours accessible
  'personal': 'free', // Toujours accessible
  'retirement': 'free', // Toujours accessible
  'savings': 'free', // Toujours accessible
  'cashflow': 'free', // Accessible gratuitement
  'advanced-expenses': 'professional', // Plan Pro requis
  'tax': 'professional', // Plan Pro requis
  'simulator': 'professional', // Plan Pro requis
  'reports': 'professional', // Plan Pro requis
  'session': 'free', // Toujours accessible
  'emergency-info': 'free', // Toujours accessible
  'cpp': 'free', // Accessible gratuitement
  'combined-pension': 'free', // Accessible gratuitement
  'premium-features': 'ultimate', // Plan Ultimate requis
  'demos': 'free' // Toujours accessible
};

// Fonction pour vérifier si un plan a accès à une fonctionnalité
const hasPlanAccess = (userPlan: SubscriptionPlan, requiredPlan: SubscriptionPlan): boolean => {
  const planHierarchy: Record<SubscriptionPlan, number> = {
    'free': 0,
    'professional': 1,
    'ultimate': 2
  };
  
  return planHierarchy[userPlan] >= planHierarchy[requiredPlan];
};

// Fonction pour obtenir l'icône du plan requis
const getPlanIcon = (plan: SubscriptionPlan) => {
  switch (plan) {
    case 'professional':
      return <Star className="w-3 h-3 text-blue-600" />;
    case 'ultimate':
      return <Crown className="w-3 h-3 text-purple-600" />;
    default:
      return <Lock className="w-3 h-3 text-gray-500" />;
  }
};

// Fonction pour obtenir la couleur du plan
const getPlanColor = (plan: SubscriptionPlan) => {
  switch (plan) {
    case 'professional':
      return 'text-blue-600';
    case 'ultimate':
      return 'text-purple-600';
    default:
      return 'text-gray-500';
  }
};

// Fonction pour obtenir le nom du plan en français
const getPlanName = (plan: SubscriptionPlan, language: 'fr' | 'en'): string => {
  const names = {
    fr: {
      'free': 'Gratuit',
      'professional': 'Professionnel',
      'ultimate': 'Ultimate'
    },
    en: {
      'free': 'Free',
      'professional': 'Professional',
      'ultimate': 'Ultimate'
    }
  };
  return names[language][plan];
};

export const PlanRestrictedButton: React.FC<PlanRestrictedButtonProps> = ({
  sectionId,
  label,
  icon: Icon,
  requiredPlan,
  isActive,
  onClick,
  className
}) => {
  const { user } = useAuth();
  const currentPlan = user?.plan || 'free';
  const hasAccess = hasPlanAccess(currentPlan, requiredPlan);
  
  // Détection de la langue depuis l'URL
  const isEnglish = window.location.pathname.includes('/en/');
  const language: 'fr' | 'en' = isEnglish ? 'en' : 'fr';

  // Si l'utilisateur n'a pas accès, afficher un bouton grisé avec tooltip
  if (!hasAccess) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              disabled
              className={cn(
                "flex items-center gap-2 opacity-50 cursor-not-allowed",
                "text-gray-400 hover:text-gray-400",
                className
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              <div className="flex items-center gap-1 ml-1">
                {getPlanIcon(requiredPlan)}
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                {getPlanIcon(requiredPlan)}
                <span className="font-medium">
                  {getPlanName(requiredPlan, language)} requis
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {language === 'fr' 
                  ? `Cette fonctionnalité nécessite le plan ${getPlanName(requiredPlan, language)}`
                  : `This feature requires the ${getPlanName(requiredPlan, language)} plan`
                }
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                <span>
                  {language === 'fr' ? 'Votre plan actuel :' : 'Your current plan:'}
                </span>
                <span className={cn("font-medium", getPlanColor(currentPlan))}>
                  {getPlanName(currentPlan, language)}
                </span>
              </div>
              <Button 
                size="sm" 
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={(e) => {
                  e.stopPropagation();
                  // Rediriger vers la page de tarification
                  window.location.href = language === 'fr' ? '/fr/retraite' : '/en/retirement';
                }}
              >
                {language === 'fr' ? 'Voir les plans' : 'View plans'}
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Si l'utilisateur a accès, afficher le bouton normal
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={cn(
        "flex items-center gap-2",
        isActive 
          ? "bg-gold-500 hover:bg-gold-600 text-charcoal-900" 
          : "text-charcoal-700 hover:text-charcoal-900",
        className
      )}
      onClick={onClick}
    >
      <Icon className="w-4 h-4" />
      {label}
      {/* Indicateur visuel pour les fonctionnalités premium */}
      {requiredPlan !== 'free' && (
        <div className="flex items-center gap-1 ml-1">
          {getPlanIcon(requiredPlan)}
        </div>
      )}
    </Button>
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

// Composant pour afficher un indicateur de plan requis
export const PlanRequirementBadge: React.FC<{ plan: SubscriptionPlan; language?: 'fr' | 'en' }> = ({ 
  plan, 
  language = 'fr' 
}) => {
  if (plan === 'free') return null;
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
      plan === 'professional' 
        ? "bg-blue-100 text-blue-800 border border-blue-200"
        : "bg-purple-100 text-purple-800 border border-purple-200"
    )}>
      {getPlanIcon(plan)}
      {getPlanName(plan, language)}
    </div>
  );
};
