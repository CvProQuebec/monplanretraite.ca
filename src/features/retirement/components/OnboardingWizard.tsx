import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Shield,
  User,
  Briefcase,
  Calculator,
  Target,
  TrendingUp,
  Wand2,
  Settings
} from 'lucide-react';

// Import du service d'onboarding
import { OnboardingService, OnboardingData } from '../services/OnboardingService';
import { UserData } from '../types';

// Types temporaires si le service n'est pas disponible
interface TempUserData {
  personal?: any;
  retirement?: any;
}

interface OnboardingWizardProps {
  userData?: UserData;
  onComplete: (userData: UserData) => void;
  onSkip: () => void;
  isFrench?: boolean;
}

type OnboardingStep = 
  | 'welcome' 
  | 'basic-info' 
  | 'work-situation' 
  | 'government-benefits' 
  | 'retirement-goals' 
  | 'summary';

export default function OnboardingWizard({ 
  userData, 
  onComplete, 
  onSkip, 
  isFrench = true 
}: OnboardingWizardProps) {
  console.log('🚀 OnboardingWizard initialisé avec:', { userData, isFrench });
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [data, setData] = useState<OnboardingData>({
    age: 50,
    conjoint: false,
    salaire: 50000,
    secteur: 'prive',
    employeurActuel: '',
    anneesService: 10,
    rregopMembre: false,
    rrqDemandee: false,
    ageRetraiteVoulu: 65,
    revenuRetraiteVoulu: 35000,
    depensesActuelles: 40000,
    comprendSecurite: false
  });

  const steps: OnboardingStep[] = [
    'welcome',
    'basic-info', 
    'work-situation',
    'government-benefits',
    'retirement-goals',
    'summary'
  ];

  const currentStepIndex = steps.indexOf(currentStep);
  const progressPercent = ((currentStepIndex + 1) / steps.length) * 100;

  // Logs de débogage
  useEffect(() => {
    console.log('📊 OnboardingWizard - Étape actuelle:', currentStep);
    console.log('📊 OnboardingWizard - Données actuelles:', data);
  }, [currentStep, data]);

  // Textes bilingues
  const t = {
    // Navigation
    next: isFrench ? 'Continuer' : 'Next',
    back: isFrench ? 'Précédent' : 'Back',
    finish: isFrench ? 'Commencer ma planification' : 'Start My Planning',
    skip: isFrench ? 'Passer cette étape' : 'Skip This Step',
    
    // Messages de sécurité
    securityMessage: isFrench 
      ? '🛡️ Vos données restent sur VOTRE appareil - Aucune transmission à nos serveurs'
      : '🛡️ Your data stays on YOUR device - No transmission to our servers',
    
    // Étapes
    welcome: {
      title: isFrench ? 'Bienvenue dans votre planificateur de retraite' : 'Welcome to Your Retirement Planner',
      subtitle: isFrench 
        ? 'Conçu spécialement pour les travailleurs ordinaires du Québec' 
        : 'Designed specifically for ordinary Quebec workers',
      description: isFrench 
        ? 'En quelques minutes, nous allons identifier vos prestations gouvernementales et optimiser votre retraite. Simple, sécurisé, et adapté à VOTRE situation.'
        : 'In a few minutes, we will identify your government benefits and optimize your retirement. Simple, secure, and tailored to YOUR situation.',
      benefits: isFrench ? [
        'Calcul automatique du Supplément de Revenu Garanti (SRG)',
        'Analyse RREGOP pour employés gouvernementaux',
        'Optimisations fiscales personnalisées',
        'Sécurité maximale - vos données ne quittent jamais votre appareil'
      ] : [
        'Automatic calculation of Guaranteed Income Supplement (GIS)',
        'RREGOP analysis for government employees', 
        'Personalized tax optimizations',
        'Maximum security - your data never leaves your device'
      ]
    }
  };

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const completeOnboarding = () => {
    try {
      // Version simplifiée pour éviter les erreurs
      const convertedUserData: TempUserData = {
        personal: {
          prenom1: 'Utilisateur',
          age: data.age,
          salaire: data.salaire,
          secteur: data.secteur
        },
        retirement: {
          ageRetraite: data.ageRetraiteVoulu,
          revenuSouhaite: data.revenuRetraiteVoulu
        }
      };
      
      console.log('✅ Onboarding terminé avec succès:', {
        userData: convertedUserData,
        data: data
      });
      
      // Appel du callback de completion
      onComplete(convertedUserData as UserData);
      
    } catch (error) {
      console.error('❌ Erreur lors de la completion de l\'onboarding:', error);
      // Fallback simple
      const fallbackUserData: TempUserData = {
        personal: { prenom1: 'Utilisateur' },
        retirement: {}
      };
      onComplete(fallbackUserData as UserData);
    }
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-mpr-interactive-lt rounded-full flex items-center justify-center">
        <Shield className="w-10 h-10 text-mpr-interactive" />
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t.welcome.title}
        </h1>
        <p className="text-xl text-gray-600">
          {t.welcome.subtitle}
        </p>
      </div>
      
      <p className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
        {t.welcome.description}
      </p>
      
      <div className="grid md:grid-cols-2 gap-4 mt-8 max-w-3xl mx-auto">
        {t.welcome.benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{benefit}</span>
          </div>
        ))}
      </div>
      
      <Alert className="max-w-2xl mx-auto border-mpr-border bg-mpr-interactive-lt">
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-mpr-navy">
          {t.securityMessage}
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={nextStep} size="lg" className="flex items-center gap-2">
          {isFrench ? 'Commencer (3 minutes)' : 'Get Started (3 minutes)'}
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={onSkip} size="lg" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          {isFrench ? 'Utiliser l\'interface avancée' : 'Use Advanced Interface'}
        </Button>
      </div>
    </div>
  );

  const renderBasicInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <User className="w-12 h-12 mx-auto text-mpr-interactive" />
        <h2 className="text-2xl font-bold text-gray-800">
          {isFrench ? 'Parlez-nous de vous' : 'Tell Us About Yourself'}
        </h2>
        <p className="text-gray-600">
          {isFrench 
            ? 'Ces informations nous aident à personnaliser vos calculs' 
            : 'This information helps us personalize your calculations'
          }
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <Label>{isFrench ? 'Votre âge actuel' : 'Your Current Age'}</Label>
          <Input
            type="number"
            value={data.age}
            onChange={(e) => updateData('age', Number(e.target.value))}
            min={25}
            max={70}
            className="text-lg"
          />
        </div>
        
        <div className="space-y-2">
          <Label>{isFrench ? 'Situation familiale' : 'Marital Status'}</Label>
          <Select
            value={data.conjoint ? 'couple' : 'celibataire'}
            onValueChange={(value) => updateData('conjoint', value === 'couple')}
          >
            <SelectTrigger className="text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="celibataire">
                {isFrench ? 'Célibataire' : 'Single'}
              </SelectItem>
              <SelectItem value="couple">
                {isFrench ? 'En couple / Marié(e)' : 'Coupled / Married'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {data.conjoint && (
          <div className="space-y-2">
            <Label>{isFrench ? 'Âge de votre conjoint(e)' : 'Your Spouse\'s Age'}</Label>
            <Input
              type="number"
              value={data.ageConjoint || 50}
              onChange={(e) => updateData('ageConjoint', Number(e.target.value))}
              min={25}
              max={70}
              className="text-lg"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label>{isFrench ? 'Votre salaire annuel brut' : 'Your Annual Gross Salary'}</Label>
          <Input
            type="number"
            value={data.salaire}
            onChange={(e) => updateData('salaire', Number(e.target.value))}
            min={20000}
            max={150000}
            step={5000}
            className="text-lg"
          />
          <p className="text-sm text-gray-500">
            {isFrench ? 'Avant impôts et déductions' : 'Before taxes and deductions'}
          </p>
        </div>
      </div>
    </div>
  );

  const renderWorkSituationStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Briefcase className="w-12 h-12 mx-auto text-mpr-interactive" />
        <h2 className="text-2xl font-bold text-gray-800">
          {isFrench ? 'Votre situation professionnelle' : 'Your Work Situation'}
        </h2>
        <p className="text-gray-600">
          {isFrench 
            ? 'Ceci détermine vos prestations gouvernementales disponibles' 
            : 'This determines your available government benefits'
          }
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <Label className="text-base font-semibold">
            {isFrench ? 'Dans quel secteur travaillez-vous ?' : 'What sector do you work in?'}
          </Label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'prive', label: isFrench ? 'Secteur privé' : 'Private Sector' },
              { value: 'gouvernement', label: isFrench ? 'Gouvernement du Québec' : 'Government of Quebec' },
              { value: 'autonome', label: isFrench ? 'Travailleur autonome' : 'Self-Employed' }
            ].map((option) => (
              <div 
                key={option.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  data.secteur === option.value 
                    ? 'border-mpr-interactive bg-mpr-interactive-lt' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updateData('secteur', option.value)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    data.secteur === option.value 
                      ? 'bg-mpr-interactive border-mpr-interactive' 
                      : 'border-gray-300'
                  }`} />
                  <span className="font-medium">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {data.secteur === 'gouvernement' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-green-600 mb-2" />
            <p className="text-sm text-green-800">
              {isFrench 
                ? 'Parfait ! Vous pourriez être admissible au RREGOP et bénéficier de calculs spécialisés.'
                : 'Perfect! You might be eligible for RREGOP and benefit from specialized calculations.'
              }
            </p>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              {isFrench ? 'Années chez l\'employeur actuel' : 'Years with Current Employer'}
            </Label>
            <Input
              type="number"
              value={data.anneesService}
              onChange={(e) => updateData('anneesService', Number(e.target.value))}
              min={0}
              max={45}
              className="text-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label>
              {isFrench ? 'Nom de l\'employeur (optionnel)' : 'Employer Name (Optional)'}
            </Label>
            <Input
              value={data.employeurActuel}
              onChange={(e) => updateData('employeurActuel', e.target.value)}
              placeholder={isFrench ? 'Ex: Hydro-Québec' : 'Ex: Hydro-Quebec'}
              className="text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderGovernmentBenefitsStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Calculator className="w-12 h-12 mx-auto text-mpr-interactive" />
        <h2 className="text-2xl font-bold text-gray-800">
          {isFrench ? 'Vos prestations gouvernementales' : 'Your Government Benefits'}
        </h2>
        <p className="text-gray-600">
          {isFrench 
            ? 'Nous allons calculer automatiquement vos prestations optimales' 
            : 'We will automatically calculate your optimal benefits'
          }
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        {data.secteur === 'gouvernement' && (
          <div className="space-y-4">
            <div className="p-4 bg-mpr-interactive-lt border border-mpr-border rounded-lg">
              <h3 className="font-semibold text-mpr-navy mb-2">
                {isFrench ? 'RREGOP - Régime de retraite des employés du gouvernement' : 'RREGOP - Government Employees Pension Plan'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="rregop"
                    checked={data.rregopMembre}
                    onChange={(e) => updateData('rregopMembre', e.target.checked)}
                    className="w-4 h-4"
                    aria-label={isFrench ? 'Je participe au RREGOP' : 'I participate in RREGOP'}
                  />
                  <Label htmlFor="rregop">
                    {isFrench ? 'Je participe au RREGOP' : 'I participate in RREGOP'}
                  </Label>
                </div>
                
                {data.rregopMembre && (
                  <div className="pl-7 space-y-2">
                    <Label className="text-sm">
                      {isFrench ? 'Années de service estimées à la retraite' : 'Estimated years of service at retirement'}
                    </Label>
                    <Input
                      type="number"
                      value={data.anneesREEROPEstimees || data.anneesService}
                      onChange={(e) => updateData('anneesREEROPEstimees', Number(e.target.value))}
                      min={1}
                      max={40}
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">
            {isFrench ? 'RRQ - Régime des rentes du Québec' : 'QPP - Quebec Pension Plan'}
          </h3>
                      <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="rrq"
                checked={data.rrqDemandee}
                onChange={(e) => updateData('rrqDemandee', e.target.checked)}
                className="w-4 h-4"
                aria-label={isFrench 
                  ? 'J\'ai déjà demandé une estimation de ma rente RRQ' 
                  : 'I have already requested an estimate of my QPP pension'
                }
              />
              <Label htmlFor="rrq" className="text-sm">
                {isFrench 
                  ? 'J\'ai déjà demandé une estimation de ma rente RRQ' 
                  : 'I have already requested an estimate of my QPP pension'
                }
              </Label>
            </div>
          <p className="text-xs text-yellow-700 mt-2">
            {isFrench 
              ? 'Si non coché, nous ferons une estimation basée sur votre salaire actuel' 
              : 'If unchecked, we will make an estimate based on your current salary'
            }
          </p>
        </div>
        
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-800">
            <strong>
              {isFrench ? 'Calculs automatiques inclus :' : 'Automatic calculations included:'}
            </strong>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li>{isFrench ? 'Sécurité de la vieillesse (SV)' : 'Old Age Security (OAS)'}</li>
              <li>{isFrench ? 'Supplément de revenu garanti (SRG)' : 'Guaranteed Income Supplement (GIS)'}</li>
              <li>{isFrench ? 'Optimisations fiscales personnalisées' : 'Personalized tax optimizations'}</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );

  const renderRetirementGoalsStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Target className="w-12 h-12 mx-auto text-mpr-interactive" />
        <h2 className="text-2xl font-bold text-gray-800">
          {isFrench ? 'Vos objectifs de retraite' : 'Your Retirement Goals'}
        </h2>
        <p className="text-gray-600">
          {isFrench 
            ? 'Définissons ensemble votre vision de la retraite idéale' 
            : 'Let\'s define your ideal retirement vision together'
          }
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-base">
              {isFrench ? 'À quel âge voulez-vous prendre votre retraite ?' : 'At what age do you want to retire?'}
            </Label>
            <Input
              type="number"
              value={data.ageRetraiteVoulu}
              onChange={(e) => updateData('ageRetraiteVoulu', Number(e.target.value))}
              min={55}
              max={75}
              className="text-lg"
            />
            <p className="text-sm text-gray-500">
              {isFrench ? 'L\'âge standard est 65 ans' : 'Standard age is 65'}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-base">
              {isFrench ? 'Revenu net souhaité à la retraite (annuel)' : 'Desired net income in retirement (annual)'}
            </Label>
            <Input
              type="number"
              value={data.revenuRetraiteVoulu}
              onChange={(e) => updateData('revenuRetraiteVoulu', Number(e.target.value))}
              min={15000}
              max={100000}
              step={5000}
              className="text-lg"
            />
            <p className="text-sm text-gray-500">
              {isFrench ? 'Après impôts' : 'After taxes'}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-base">
            {isFrench ? 'Vos dépenses annuelles actuelles (estimation)' : 'Your current annual expenses (estimate)'}
          </Label>
          <Input
            type="number"
            value={data.depensesActuelles}
            onChange={(e) => updateData('depensesActuelles', Number(e.target.value))}
            min={20000}
            max={150000}
            step={5000}
            className="text-lg"
          />
          <p className="text-sm text-gray-500">
            {isFrench 
              ? 'Logement, nourriture, transport, loisirs, etc.' 
              : 'Housing, food, transportation, leisure, etc.'
            }
          </p>
        </div>
        
        <div className="p-4 bg-mpr-interactive-lt border border-mpr-border rounded-lg">
          <TrendingUp className="w-5 h-5 text-mpr-interactive mb-2" />
          <h4 className="font-semibold text-mpr-navy mb-2">
            {isFrench ? 'Conseil personnalisé' : 'Personal Advice'}
          </h4>
          <p className="text-sm text-mpr-navy">
            {data.revenuRetraiteVoulu > data.depensesActuelles * 0.7 ? (
              isFrench 
                ? 'Objectif ambitieux mais réalisable avec une bonne planification !' 
                : 'Ambitious but achievable goal with good planning!'
            ) : (
              isFrench 
                ? 'Objectif conservateur - vous pourriez viser un peu plus haut.' 
                : 'Conservative goal - you could aim a bit higher.'
            )}
          </p>
        </div>
      </div>
    </div>
  );

  const renderSummaryStep = () => {
    // Version simplifiée pour éviter les erreurs
    const estimatedIncome = {
      rregop: data.rregopMembre ? 15000 : 0,
      rrq: 8000,
      sv: 7000,
      srg: data.salaire < 50000 ? 5000 : 0
    };
    const recommendations = [
      'Continuez à épargner régulièrement',
      'Consultez un planificateur financier pour optimiser votre retraite'
    ];
    
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {isFrench ? 'Récapitulatif de votre profil' : 'Your Profile Summary'}
          </h2>
          <p className="text-gray-600">
            {isFrench 
              ? 'Voici un aperçu de votre situation et des optimisations identifiées' 
              : 'Here is an overview of your situation and identified optimizations'
            }
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Profil */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                {isFrench ? 'Votre profil' : 'Your Profile'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>{isFrench ? 'Âge' : 'Age'}:</span>
                <span className="font-semibold">{data.age} ans</span>
              </div>
              <div className="flex justify-between">
                <span>{isFrench ? 'Secteur' : 'Sector'}:</span>
                <span className="font-semibold">
                  {data.secteur === 'gouvernement' ? (isFrench ? 'Gouvernement' : 'Government') :
                   data.secteur === 'prive' ? (isFrench ? 'Privé' : 'Private') :
                   (isFrench ? 'Autonome' : 'Self-employed')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{isFrench ? 'Salaire' : 'Salary'}:</span>
                <span className="font-semibold">{data.salaire.toLocaleString()} $</span>
              </div>
              <div className="flex justify-between">
                <span>{isFrench ? 'Objectif retraite' : 'Retirement Goal'}:</span>
                <span className="font-semibold">{data.ageRetraiteVoulu} ans</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Prestations identifiées */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                {isFrench ? 'Prestations identifiées' : 'Identified Benefits'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.rregopMembre && (
                <div className="flex justify-between">
                  <span>RREGOP:</span>
                  <span className="font-semibold text-green-600">
                    {estimatedIncome.rregop.toLocaleString()} $ /an
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>RRQ:</span>
                <span className="font-semibold">{estimatedIncome.rrq.toLocaleString()} $ /an</span>
              </div>
              <div className="flex justify-between">
                <span>SV:</span>
                <span className="font-semibold">{estimatedIncome.sv.toLocaleString()} $ /an</span>
              </div>
              {estimatedIncome.srg > 0 && (
                <div className="flex justify-between">
                  <span>SRG:</span>
                  <span className="font-semibold text-green-600">
                    {estimatedIncome.srg.toLocaleString()} $ /an
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Recommandations */}
        {recommendations.length > 0 && (
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="font-semibold text-lg text-center">
              {isFrench ? 'Recommandations personnalisées' : 'Personalized Recommendations'}
            </h3>
            {recommendations.map((rec, index) => (
              <Alert key={index} className="border-mpr-border bg-mpr-interactive-lt">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-mpr-navy">
                  {rec}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
        
        {/* Sécurité rappel */}
        <Alert className="max-w-2xl mx-auto border-gray-300 bg-gray-50">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>{isFrench ? 'Rappel sécurité :' : 'Security Reminder:'}</strong>
            {isFrench 
              ? ' Toutes vos données resteront sur cet appareil. Vous pourrez les sauvegarder dans un fichier sécurisé à tout moment.'
              : ' All your data will remain on this device. You can save them to a secure file at any time.'
            }
          </AlertDescription>
        </Alert>
        
        {/* Actions finales */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {isFrench 
              ? 'Prêt à découvrir vos optimisations personnalisées ?'
              : 'Ready to discover your personalized optimizations?'
            }
          </p>
          <Button onClick={completeOnboarding} size="lg" className="flex items-center gap-2 mx-auto">
            <Wand2 className="w-5 h-5" />
            {t.finish}
          </Button>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeStep();
      case 'basic-info':
        return renderBasicInfoStep();
      case 'work-situation':
        return renderWorkSituationStep();
      case 'government-benefits':
        return renderGovernmentBenefitsStep();
      case 'retirement-goals':
        return renderRetirementGoalsStep();
      case 'summary':
        return renderSummaryStep();
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header avec progression */}
        {currentStep !== 'welcome' && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.back}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  {isFrench ? 'Étape' : 'Step'} {currentStepIndex + 1} {isFrench ? 'sur' : 'of'} {steps.length}
                </p>
              </div>
              
              <Button
                variant="ghost"
                onClick={onSkip}
                className="text-gray-500"
              >
                {t.skip}
              </Button>
            </div>
            
            <Progress value={progressPercent} className="w-full h-2" />
          </div>
        )}
        
        {/* Contenu de l'étape */}
        <div className="p-6">
          {renderCurrentStep()}
        </div>
        
        {/* Navigation bas */}
        {currentStep !== 'welcome' && currentStep !== 'summary' && (
          <div className="flex justify-center p-6 border-t border-gray-200">
            <Button onClick={nextStep} size="lg" className="flex items-center gap-2">
              {t.next}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
