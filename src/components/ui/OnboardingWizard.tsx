/**
 * Composant OnboardingWizard - Phase 2 Modules Néophytes
 * Interface d'accompagnement interactive pour les nouveaux utilisateurs
 * Système de guidage progressif et personnalisé
 */

import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  CheckCircle, 
  Circle, 
  Play, 
  Pause, 
  RotateCcw,
  User,
  Target,
  BookOpen,
  Award,
  Info,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { Alert, AlertDescription } from './alert';
import { 
  OnboardingService, 
  OnboardingPath, 
  OnboardingStep, 
  UserProfile 
} from '../../services/OnboardingService';
import { useLanguage } from '../../features/retirement/hooks/useLanguage';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  userProfile?: UserProfile;
  className?: string;
}

interface WizardState {
  currentPath: OnboardingPath | null;
  currentStepIndex: number;
  isProfileSetup: boolean;
  showStepDetails: boolean;
  isPlaying: boolean;
  timeSpent: number;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
  userProfile,
  className = ''
}) => {
  const { language } = useLanguage();
  const isFrench = language === 'fr';
  
  const [wizardState, setWizardState] = useState<WizardState>({
    currentPath: null,
    currentStepIndex: 0,
    isProfileSetup: !userProfile,
    showStepDetails: false,
    isPlaying: false,
    timeSpent: 0
  });

  const [profile, setProfile] = useState<UserProfile | null>(userProfile || null);
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [currentStep, setCurrentStep] = useState<OnboardingStep | null>(null);

  const onboardingService = OnboardingService.getInstance();

  // Textes bilingues
  const t = {
    // Navigation
    next: isFrench ? 'Continuer' : 'Next',
    back: isFrench ? 'Précédent' : 'Back',
    finish: isFrench ? 'Commencer ma planification' : 'Start My Planning',
    skip: isFrench ? 'Passer cette étape' : 'Skip This Step',
    
    // Titres et labels
    pathTitle: isFrench ? 'Parcours d\'accompagnement' : 'Guidance Path',
    progression: isFrench ? 'Progression' : 'Progress',
    steps: isFrench ? 'étapes' : 'steps',
    details: isFrench ? 'Détails' : 'Details',
    essential: isFrench ? 'Essentiel' : 'Essential',
    recommended: isFrench ? 'Recommandé' : 'Recommended',
    advanced: isFrench ? 'Avancé' : 'Advanced',
    optional: isFrench ? 'Optionnel' : 'Optional',
    minutes: isFrench ? 'min' : 'min',
    
    // Boutons
    markCompleted: isFrench ? 'Marquer comme terminé' : 'Mark as Completed',
    skipStep: isFrench ? 'Passer cette étape' : 'Skip This Step',
    restart: isFrench ? 'Recommencer' : 'Restart',
    previous: isFrench ? 'Précédent' : 'Previous',
    step: isFrench ? 'Étape' : 'Step',
    of: isFrench ? 'sur' : 'of',
    
    // Contenu
    stepContent: isFrench ? 'Contenu interactif de l\'étape' : 'Interactive Step Content',
    stepComponent: isFrench ? 'Ici sera intégré le composant spécifique à cette étape' : 'Here will be integrated the specific component for this step',
    
    // Conseils
    practicalTips: isFrench ? '💡 Conseils pratiques :' : '💡 Practical Tips:',

    
    // Parcours terminé
    pathCompleted: isFrench ? 'Parcours terminé !' : 'Path Completed!',
    congratulations: isFrench ? 'Félicitations ! Vous avez terminé le parcours d\'accompagnement.' : 'Congratulations! You have completed the guidance path.',
    startPlanning: isFrench ? 'Commencer ma planification' : 'Start My Planning',
    
    // Messages de sécurité
    securityMessage: isFrench 
      ? '🛡️ Vos données restent sur VOTRE appareil - Aucune transmission à nos serveurs'
      : '🛡️ Your data stays on YOUR device - No transmission to our servers'
  };

  useEffect(() => {
    if (profile && !wizardState.currentPath) {
      const path = onboardingService.generatePersonalizedPath(profile);
      setWizardState(prev => ({ ...prev, currentPath: path, isProfileSetup: false }));
    }
  }, [profile]);

  useEffect(() => {
    if (wizardState.currentPath) {
      const pathProgress = onboardingService.calculateProgress(wizardState.currentPath);
      setProgress(pathProgress);
      
      const nextStep = onboardingService.getNextStep(wizardState.currentPath);
      setCurrentStep(nextStep);
    }
  }, [wizardState.currentPath, wizardState.currentStepIndex]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (wizardState.isPlaying) {
      interval = setInterval(() => {
        setWizardState(prev => ({ ...prev, timeSpent: prev.timeSpent + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [wizardState.isPlaying]);

  const handleProfileSubmit = (newProfile: UserProfile) => {
    setProfile(newProfile);
    onboardingService.saveUserProfile(newProfile);
    setWizardState(prev => ({ ...prev, isProfileSetup: false }));
  };

  const handleStepComplete = (stepId: string) => {
    if (wizardState.currentPath) {
      onboardingService.completeStep(wizardState.currentPath.id, stepId);
      setWizardState(prev => ({ 
        ...prev, 
        currentStepIndex: prev.currentStepIndex + 1 
      }));
      
      // Vérifier si c'est la dernière étape
      const pathProgress = onboardingService.calculateProgress(wizardState.currentPath);
      if (pathProgress.percentage === 100) {
        onComplete?.();
      }
    }
  };

  const handleSkipStep = () => {
    if (currentStep && currentStep.isOptional) {
      setWizardState(prev => ({ 
        ...prev, 
        currentStepIndex: prev.currentStepIndex + 1 
      }));
    }
  };

  const handlePreviousStep = () => {
    setWizardState(prev => ({ 
      ...prev, 
      currentStepIndex: Math.max(0, prev.currentStepIndex - 1) 
    }));
  };

  const handleRestartPath = () => {
    if (wizardState.currentPath) {
      onboardingService.resetPath(wizardState.currentPath.id);
      setWizardState(prev => ({ 
        ...prev, 
        currentStepIndex: 0,
        timeSpent: 0
      }));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: OnboardingStep['category']) => {
    switch (category) {
      case 'essential':
        return <Target className="h-4 w-4 text-red-500" />;
      case 'recommended':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'advanced':
        return <Award className="h-4 w-4 text-purple-500" />;
    }
  };

  const getCategoryColor = (category: OnboardingStep['category']) => {
    switch (category) {
      case 'essential':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'recommended':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  if (!isOpen) return null;

  // Écran de configuration du profil
  if (wizardState.isProfileSetup) {
    return (
      <div className={`fixed inset-0 bg-white bg-opacity-95 flex items-start justify-center z-50 pt-8 ${className}`}>
        <Card className="w-full max-w-2xl max-h-[85vh] overflow-y-auto m-4 shadow-2xl border-2 border-blue-200">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center">
                <User className="h-6 w-6 mr-2 text-blue-600" />
                Configuration de votre profil
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ProfileSetupForm onSubmit={handleProfileSubmit} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Écran principal du wizard
  if (!isOpen) return null;
  
  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${className} animate-in fade-in duration-300`}
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-blue-200 relative animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture en haut à droite */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 hover:bg-red-100 hover:text-red-600"
        >
          <X className="h-5 w-5" />
        </Button>
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-blue-900">
                {wizardState.currentPath?.name || t.pathTitle}
              </CardTitle>
              <p className="text-sm text-blue-700 mt-1">
                {wizardState.currentPath?.description}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(wizardState.timeSpent)}
              </Badge>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-blue-700 mb-2">
              <span>{t.progression}</span>
              <span>{progress.completed}/{progress.total} {t.steps}</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {currentStep ? (
            <div className="space-y-6">
              {/* En-tête de l'étape */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getCategoryIcon(currentStep.category)}
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentStep.title}
                    </h2>
                    <Badge className={`text-xs ${getCategoryColor(currentStep.category)}`}>
                      {currentStep.category === 'essential' ? t.essential :
                       currentStep.category === 'recommended' ? t.recommended : t.advanced}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-lg">
                    {currentStep.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      ~{currentStep.estimatedTime} {t.minutes}
                    </span>
                    {currentStep.isOptional && (
                      <Badge variant="outline" className="text-xs">
                        {t.optional}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWizardState(prev => ({ 
                    ...prev, 
                    showStepDetails: !prev.showStepDetails 
                  }))}
                >
                  <Info className="h-4 w-4 mr-1" />
                  {t.details}
                </Button>
              </div>

              {/* Détails de l'étape */}
              {wizardState.showStepDetails && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <p className="text-sm">{currentStep.helpText}</p>
                      
                      {currentStep.tips.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">{t.practicalTips}</h4>
                          <ul className="text-sm space-y-1">
                            {currentStep.tips.map((tip, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      

                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Contenu de l'étape */}
              <Card className="border-2 border-dashed border-gray-200">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      {getCategoryIcon(currentStep.category)}
                    </div>
                    <h3 className="text-lg font-semibold">
                      {t.stepContent}
                    </h3>
                    <p className="text-gray-600">
                      {t.stepComponent}
                    </p>
                    <div className="flex items-center justify-center space-x-3 pt-4">
                      <Button
                        onClick={() => handleStepComplete(currentStep.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {t.markCompleted}
                      </Button>
                      {currentStep.isOptional && (
                        <Button variant="outline" onClick={handleSkipStep}>
                          {t.skipStep}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={wizardState.currentStepIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {t.previous}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRestartPath}
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    {t.restart}
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setWizardState(prev => ({ 
                      ...prev, 
                      isPlaying: !prev.isPlaying 
                    }))}
                    size="sm"
                  >
                    {wizardState.isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <span className="text-sm text-gray-500">
                    {t.step} {wizardState.currentStepIndex + 1} {t.of} {wizardState.currentPath?.steps.length || 0}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // Parcours terminé
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t.pathCompleted}
              </h2>
              <p className="text-gray-600 mb-6">
                Vous avez complété votre parcours d'accompagnement en {formatTime(wizardState.timeSpent)}.
                Vous êtes maintenant prêt à utiliser tous les outils de MonPlanRetraite.ca !
              </p>
              <div className="flex items-center justify-center space-x-3">
                <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                  {t.startPlanning}
                </Button>
                <Button variant="outline" onClick={handleRestartPath}>
                  {t.restart}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Composant de configuration du profil (simplifié pour l'exemple)
const ProfileSetupForm: React.FC<{ onSubmit: (profile: UserProfile) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    age: 30,
    retirementAge: 65,
    hasFinancialExperience: false,
    primaryGoal: 'budget',
    timeAvailable: 'moderate',
    preferredLearningStyle: 'interactive',
    hasPartner: false,
    hasChildren: false,
    employmentStatus: 'employed'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as UserProfile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Personnalisons votre expérience
        </h3>
        <p className="text-gray-600">
          Ces informations nous aident à créer un parcours adapté à vos besoins.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="age-input" className="block text-sm font-medium mb-2">Âge</label>
          <input
            id="age-input"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
            className="w-full p-2 border rounded-md"
            min="18"
            max="100"
            title="Votre âge actuel"
            placeholder="Ex: 30"
          />
        </div>

        <div>
          <label htmlFor="retirement-age-input" className="block text-sm font-medium mb-2">Âge de retraite souhaité</label>
          <input
            id="retirement-age-input"
            type="number"
            value={formData.retirementAge}
            onChange={(e) => setFormData(prev => ({ ...prev, retirementAge: parseInt(e.target.value) }))}
            className="w-full p-2 border rounded-md"
            min="50"
            max="75"
            title="L'âge auquel vous souhaitez prendre votre retraite"
            placeholder="Ex: 65"
          />
        </div>

        <div>
          <label htmlFor="goal-select" className="block text-sm font-medium mb-2">Objectif principal</label>
          <select
            id="goal-select"
            value={formData.primaryGoal}
            onChange={(e) => setFormData(prev => ({ ...prev, primaryGoal: e.target.value as any }))}
            className="w-full p-2 border rounded-md"
            title="Votre objectif financier principal"
          >
            <option value="budget">Maîtriser mon budget</option>
            <option value="savings">Développer mon épargne</option>
            <option value="retirement">Planifier ma retraite</option>
            <option value="debt">Gérer mes dettes</option>
            <option value="investment">Apprendre à investir</option>
          </select>
        </div>

        <div>
          <label htmlFor="time-select" className="block text-sm font-medium mb-2">Temps disponible</label>
          <select
            id="time-select"
            value={formData.timeAvailable}
            onChange={(e) => setFormData(prev => ({ ...prev, timeAvailable: e.target.value as any }))}
            className="w-full p-2 border rounded-md"
            title="Temps que vous souhaitez consacrer au parcours"
          >
            <option value="quick">Express (15-20 min)</option>
            <option value="moderate">Équilibré (30-45 min)</option>
            <option value="thorough">Complet (60+ min)</option>
          </select>
        </div>

        <div>
          <label htmlFor="experience-select" className="block text-sm font-medium mb-2">Expérience financière</label>
          <select
            id="experience-select"
            value={formData.hasFinancialExperience ? 'yes' : 'no'}
            onChange={(e) => setFormData(prev => ({ ...prev, hasFinancialExperience: e.target.value === 'yes' }))}
            className="w-full p-2 border rounded-md"
            title="Votre niveau d'expérience en planification financière"
          >
            <option value="no">Débutant</option>
            <option value="yes">Intermédiaire</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-center pt-4">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Créer mon parcours personnalisé
        </Button>
      </div>
    </form>
  );
};

export default OnboardingWizard;
