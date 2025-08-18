// Composant de navigation par étapes avec indicateur de progression
import React from 'react';
import { Check, ChevronRight, Lock, Star } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface Step {
  id: string;
  label: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming' | 'locked' | 'premium';
  requiredPlan?: 'free' | 'professional' | 'ultimate';
  icon?: React.ComponentType<{ className?: string }>;
}

interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: string) => void;
  showProgress?: boolean;
  className?: string;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  currentStep,
  onStepClick,
  showProgress = true,
  className = ''
}) => {
  const { language } = useLanguage();

  const getStepStatus = (index: number, step: Step) => {
    if (step.status === 'locked') return 'locked';
    if (step.status === 'premium') return 'premium';
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (step: Step, status: string, index: number) => {
    if (status === 'locked') return <Lock className="w-5 h-5" />;
    if (status === 'premium') return <Star className="w-5 h-5" />;
    if (status === 'completed') return <Check className="w-5 h-5" />;
    if (step.icon) return <step.icon className="w-5 h-5" />;
    return <span className="font-semibold text-sm">{index + 1}</span>;
  };

  const getStepColors = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
          text: 'text-green-700',
          border: 'border-green-300',
          shadow: 'shadow-green-200'
        };
      case 'current':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-purple-600',
          text: 'text-blue-700',
          border: 'border-blue-300',
          shadow: 'shadow-blue-200'
        };
      case 'upcoming':
        return {
          bg: 'bg-gray-200',
          text: 'text-gray-400',
          border: 'border-gray-200',
          shadow: 'shadow-gray-100'
        };
      case 'locked':
        return {
          bg: 'bg-gradient-to-r from-gray-400 to-gray-600',
          text: 'text-gray-700',
          border: 'border-gray-300',
          shadow: 'shadow-gray-200'
        };
      case 'premium':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-pink-600',
          text: 'text-purple-700',
          border: 'border-purple-300',
          shadow: 'shadow-purple-200'
        };
      default:
        return {
          bg: 'bg-gray-200',
          text: 'text-gray-400',
          border: 'border-gray-200',
          shadow: 'shadow-gray-100'
        };
    }
  };

  const calculateProgress = () => {
    const completedSteps = steps.filter((_, index) => index < currentStep).length;
    return (completedSteps / steps.length) * 100;
  };

  return (
    <div className={`bg-white border-b border-gray-200 py-8 ${className}`}>
      <div className="container mx-auto px-6">
        {/* Barre de progression globale */}
        {showProgress && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'fr' ? 'Progression globale' : 'Overall Progress'}
              </h3>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(calculateProgress())}% {language === 'fr' ? 'terminé' : 'completed'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
        )}

        {/* Navigation par étapes */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(index, step);
            const colors = getStepColors(status);
            const isClickable = status !== 'locked' && step.status !== 'premium';

            return (
              <div key={step.id} className="flex items-center">
                {/* Bouton de l'étape */}
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={`
                    relative flex items-center justify-center w-16 h-16 rounded-full 
                    transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300/50
                    ${colors.bg} ${colors.text} ${colors.border} ${colors.shadow}
                    ${isClickable ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed opacity-60'}
                    ${status === 'current' ? 'ring-4 ring-blue-300/50 animate-pulse' : ''}
                    ${status === 'completed' ? 'hover:scale-110 hover:shadow-xl' : ''}
                  `}
                >
                  {getStepIcon(step, status, index)}
                  
                  {/* Effet de brillance au hover */}
                  {isClickable && (
                    <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
                
                {/* Connecteur entre les étapes */}
                {index < steps.length - 1 && (
                  <div className="relative mx-6">
                    <div className={`
                      w-20 h-1 transition-all duration-500
                      ${index < currentStep 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                        : 'bg-gray-200'
                      }
                    `} />
                    
                    {/* Indicateur de progression sur le connecteur */}
                    {index < currentStep && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 h-1 rounded-full animate-pulse" />
                    )}
                  </div>
                )}
                
                {/* Informations de l'étape */}
                <div className="ml-4 max-w-32">
                  <h4 className={`
                    text-sm font-medium mb-1 transition-colors duration-300
                    ${status === 'current' ? 'text-blue-900' : colors.text}
                  `}>
                    {step.label}
                  </h4>
                  
                  {step.description && (
                    <p className="text-xs text-gray-500 leading-tight">
                      {step.description}
                    </p>
                  )}
                  
                  {/* Badge de plan requis */}
                  {step.requiredPlan && step.requiredPlan !== 'free' && (
                    <div className={`
                      mt-2 px-2 py-1 rounded-full text-xs font-medium
                      ${step.requiredPlan === 'professional' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                      }
                    `}>
                      {step.requiredPlan === 'professional' ? 'Pro' : 'Ultimate'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicateur de plan actuel */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <Check className="w-4 h-4" />
            {language === 'fr' ? 'Plan actuel : Gratuit' : 'Current plan: Free'}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant de navigation par étapes simplifié pour mobile
export const MobileStepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = ''
}) => {
  const { language } = useLanguage();

  return (
    <div className={`bg-white border-b border-gray-200 py-4 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Barre de progression mobile */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              {language === 'fr' ? 'Étape' : 'Step'} {currentStep + 1} {language === 'fr' ? 'sur' : 'of'} {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation mobile avec scroll horizontal */}
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <button
                key={step.id}
                onClick={() => onStepClick(step.id)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : isCompleted 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }
                  hover:scale-105 hover:shadow-md
                `}
              >
                {step.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
