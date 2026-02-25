import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Alert, AlertDescription } from './alert';
import { Progress } from './progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { FinancialMasterWizard, UserGovernmentProfile, WizardRecommendation, GovernmentStrategy } from '../../services/FinancialMasterWizard';
import GovernmentEducationCenter from './GovernmentEducationCenter';
import { useAuth } from '../../hooks/useAuth';
import { 
  Heart, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Home,
  Calculator,
  Users,
  Clock,
  Shield,
  Lightbulb,
  HelpCircle,
  Phone,
  BookOpen,
  Star,
  Crown,
  Sparkles,
  Brain,
  GraduationCap,
  Target,
  BarChart3,
  TrendingUp
} from 'lucide-react';

interface FinancialMasterWizardDashboardProps {
  currentBalance?: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
}

export const FinancialMasterWizardDashboard: React.FC<FinancialMasterWizardDashboardProps> = ({
  currentBalance = 5000,
  monthlyIncome = 4500,
  monthlyExpenses = 3200
}) => {
  const { user } = useAuth();
  const userPlan = user?.subscription?.plan || 'free';
  
  const [wizard] = useState(() => FinancialMasterWizard.getInstance());
  const [governmentProfile, setGovernmentProfile] = useState<UserGovernmentProfile | null>(null);
  const [strategies, setStrategies] = useState<GovernmentStrategy[]>([]);
  const [recommendations, setRecommendations] = useState<WizardRecommendation[]>([]);
  const [financialScore, setFinancialScore] = useState(0);
  const [showEducationCenter, setShowEducationCenter] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [wizardInsights, setWizardInsights] = useState<any[]>([]);

  useEffect(() => {
    initializeWizard();
  }, [currentBalance, monthlyIncome, monthlyExpenses, userPlan]);

  const initializeWizard = async () => {
    try {
      // Load retirement data to build government profile
      const savedData = localStorage.getItem('retirement_data');
      let retirementData: any = {};
      
      if (savedData) {
        retirementData = JSON.parse(savedData);
      }

      // Build comprehensive government profile using correct interface
      const profile: UserGovernmentProfile = {
        age: retirementData.person1?.age || 35,
        spouseAge: retirementData.person2?.age,
        employmentStatus: 'employed',
        hasRREGOP: retirementData.person1?.hasRREGOP || false,
        hasEmployerPension: retirementData.person1?.hasEmployerPension || false,
        estimatedRetirementAge: retirementData.person1?.retirementAge || 65,
        currentRRSPValue: retirementData.person1?.rrspContributions || 0,
        currentTFSAValue: retirementData.person1?.tfsa || 0,
        annualIncome: monthlyIncome * 12,
        spouseAnnualIncome: retirementData.person2?.monthlyIncome ? retirementData.person2.monthlyIncome * 12 : undefined,
        hasFirstHomeBuyer: false,
        province: 'QC'
      };

      setGovernmentProfile(profile);

      // Get government strategies and recommendations
      const governmentStrategies = wizard.generateGovernmentStrategies(profile, userPlan);
      const governmentRecommendations = wizard.detectGovernmentMistakes(profile, retirementData, userPlan);
      
      setStrategies(governmentStrategies);
      setRecommendations(governmentRecommendations);
      
      // Calculate enhanced financial score with government expertise
      const score = calculateEnhancedFinancialScore(profile, governmentStrategies);
      setFinancialScore(score);

      // Generate wizard insights
      const insights = generateWizardInsights(profile, governmentStrategies);
      setWizardInsights(insights);

    } catch (error) {
      console.error('Error initializing Financial Master Wizard:', error);
    }
  };

  const calculateEnhancedFinancialScore = (profile: UserGovernmentProfile, strategies: GovernmentStrategy[]): number => {
    let score = 0;
    
    // Base financial health (40 points)
    const netFlow = monthlyIncome - monthlyExpenses;
    if (netFlow > 0) score += 20;
    else if (netFlow > -500) score += 10;
    
    const emergencyMonths = currentBalance / monthlyExpenses;
    if (emergencyMonths >= 6) score += 20;
    else if (emergencyMonths >= 3) score += 15;
    else if (emergencyMonths >= 1) score += 10;
    
    // Government program optimization (30 points)
    const ageToRetirement = profile.estimatedRetirementAge - profile.age;
    if (ageToRetirement > 10 && profile.currentRRSPValue > 0) score += 10;
    if (profile.currentTFSAValue > 0) score += 5;
    if (profile.hasEmployerPension) score += 10;
    if (strategies.some(s => s.category === 'SV_SRG_RRQ')) score += 5;
    
    // Advanced planning (30 points)
    if (profile.age >= 50 && strategies.some(s => s.category === 'REER_FERR')) score += 10;
    if (strategies.some(s => s.category === 'TAX_OPTIMIZATION')) score += 10;
    if (strategies.some(s => s.category === 'RVDAA')) score += 10;
    
    return Math.min(score, 100);
  };

  const generateWizardInsights = (profile: UserGovernmentProfile, strategies: GovernmentStrategy[]) => {
    const insights = [];
    
    // Government program insights based on age and situation
    if (profile.age >= 60) {
      insights.push({
        type: 'government',
        icon: Crown,
        title: 'Optimisation RRQ/RPC',
        description: 'Analysez le meilleur moment pour demander vos rentes gouvernementales',
        action: 'Voir les stratégies RRQ',
        priority: 'high',
        module: 'rrq_optimization'
      });
    }

    if (profile.age >= 65) {
      insights.push({
        type: 'government',
        icon: Shield,
        title: 'Sécurité de la vieillesse',
        description: 'Optimisez vos retraits pour maximiser vos prestations SV',
        action: 'Calculer l\'impact SV',
        priority: 'high',
        module: 'sv_optimization'
      });
    }

    if (profile.currentRRSPValue > 100000) {
      insights.push({
        type: 'advanced',
        icon: Calculator,
        title: 'FERR et optimisation fiscale',
        description: 'Planifiez la conversion REER→FERR et l\'ordre de décaissement optimal',
        action: 'Voir les stratégies FERR',
        priority: 'medium',
        module: 'ferr_optimization'
      });
    }

    if (profile.hasFirstHomeBuyer && profile.age < 40) {
      insights.push({
        type: 'government',
        icon: Home,
        title: 'CELIAPP - Première propriété',
        description: 'Nouveau programme gouvernemental pour l\'achat d\'une première maison',
        action: 'Explorer le CELIAPP',
        priority: 'medium',
        module: 'celiapp'
      });
    }

    // Add expert insights for expert plan
    if (userPlan === 'expert') {
      insights.push({
        type: 'expert',
        icon: Sparkles,
        title: 'RVDAA - Rente différée',
        description: 'Stratégie avancée pour optimiser vos revenus de retraite tardive',
        action: 'Analyser la RVDAA',
        priority: 'low',
        module: 'rvdaa'
      });
    }

    return insights;
  };

  const handleModuleAccess = (moduleId: string) => {
    const moduleAccess: Record<string, string> = {
      'rrq_optimization': 'professional',
      'sv_optimization': 'professional', 
      'ferr_optimization': 'expert',
      'celiapp': 'free',
      'rvdaa': 'expert',
      'tax_optimization': 'expert',
      'withdrawal_sequence': 'expert'
    };

    const requiredPlan = moduleAccess[moduleId] || 'free';
    const hasAccess = (requiredPlan === 'free') ||
                     (requiredPlan === 'professional' && ['professional', 'expert'].includes(userPlan)) ||
                     (requiredPlan === 'expert' && userPlan === 'expert');

    if (hasAccess) {
      setSelectedModule(moduleId);
      setShowEducationCenter(true);
    } else {
      alert(`Cette fonctionnalité nécessite le plan ${requiredPlan.toUpperCase()}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellente';
    if (score >= 60) return 'Bonne';
    if (score >= 40) return 'Moyenne';
    return 'À améliorer';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-mpr-interactive bg-mpr-interactive-lt';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const MasterWizardHeader = () => (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="bg-mpr-interactive p-4 rounded-full shadow-lg">
          <Heart className="h-10 w-10 text-white" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Votre Guide Financier Personnel
      </h1>
      <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-4">
        Je vous aide à prendre le contrôle de vos finances pour une meilleure retraite
      </p>
      <div className="bg-mpr-interactive-lt p-4 rounded-lg max-w-xl mx-auto">
        <p className="text-mpr-navy font-medium">
          ✓ Simple et facile à comprendre
        </p>
        <p className="text-mpr-navy font-medium">
          ✓ Basé sur les règles du gouvernement du Canada
        </p>
        <p className="text-mpr-navy font-medium">
          ✓ Vos données restent privées sur votre ordinateur
        </p>
      </div>
    </div>
  );

  const GovernmentExpertisePanel = () => (
    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-mpr-interactive-lt">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Crown className="h-6 w-6 text-purple-600 mr-2" />
            <CardTitle className="text-xl text-purple-800">Expertise Gouvernementale</CardTitle>
          </div>
          <Badge className="bg-purple-600 text-white">
            Maître Certifié
          </Badge>
        </div>
        <CardDescription className="text-purple-700">
          Analyse basée sur les documents officiels du Gouvernement du Canada (2024-2025)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wizardInsights.map((insight, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer hover:shadow-md transition-all ${getPriorityColor(insight.priority)}`}
              onClick={() => handleModuleAccess(insight.module)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <insight.icon className="h-6 w-6 text-gray-700 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full"
                    >
                      {insight.action}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-purple-200">
          <Button 
            onClick={() => setShowEducationCenter(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-mpr-interactive hover:from-purple-700 hover:to-mpr-interactive-dk"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Accéder au Centre d'Éducation Gouvernementale
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const WizardRecommendationsPanel = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-mpr-interactive mr-2" />
          <CardTitle>Recommandations du Maître Financier</CardTitle>
        </div>
        <CardDescription>
          Conseils personnalisés basés sur l'expertise gouvernementale et votre situation unique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analyse en cours...</h3>
            <p className="text-gray-600">
              Le Maître Financier analyse votre situation avec l'expertise gouvernementale
            </p>
          </div>
        ) : (
          recommendations.map((rec, index) => (
            <Alert key={index} className={
              rec.severity === 'CRITICAL' ? 'border-red-200 bg-red-50' :
              rec.severity === 'HIGH' ? 'border-yellow-200 bg-yellow-50' :
              'border-mpr-border bg-mpr-interactive-lt'
            }>
              <div className="flex items-start space-x-3">
                {rec.severity === 'CRITICAL' ? <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" /> :
                 rec.severity === 'HIGH' ? <Clock className="h-5 w-5 text-yellow-500 mt-0.5" /> :
                 <Lightbulb className="h-5 w-5 text-mpr-interactive mt-0.5" />}
                <div className="flex-1">
                  <AlertDescription>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{rec.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {rec.type}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">{rec.message}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Impact: {rec.impact}</p>
                      {rec.estimatedValue !== 0 && (
                        <div className={`p-2 rounded text-sm ${
                          rec.estimatedValue > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          <strong>Valeur estimée:</strong> {formatCurrency(Math.abs(rec.estimatedValue))}
                          {rec.estimatedValue > 0 ? ' (économies)' : ' (coût potentiel)'}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          ))
        )}
      </CardContent>
    </Card>
  );

  const QuickInsights = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Score Maître Financier</p>
              <p className={`text-2xl font-bold ${getScoreColor(financialScore)}`}>
                {financialScore}/100
              </p>
              <p className="text-xs text-gray-400">{getScoreLabel(financialScore)}</p>
            </div>
            <Crown className={`h-8 w-8 ${getScoreColor(financialScore)}`} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Flux mensuel net</p>
              <p className={`text-2xl font-bold ${
                monthlyIncome - monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(monthlyIncome - monthlyExpenses)}
              </p>
              <p className="text-xs text-gray-400">
                {((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1)}% du revenu
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Modules disponibles</p>
              <p className="text-2xl font-bold text-mpr-interactive">
                {userPlan === 'expert' ? '11' : userPlan === 'professional' ? '7' : '3'}
              </p>
              <p className="text-xs text-gray-400">
                Expertise gouvernementale
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-mpr-interactive" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Stratégies actives</p>
              <p className="text-2xl font-bold text-orange-600">{strategies.length}</p>
              <p className="text-xs text-gray-400">
                {strategies.filter(s => s.priority === 'CRITIQUE').length} critiques
              </p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Simple step-by-step wizard for non-technical users
  const SimpleFinancialWizard = () => (
    <div className="space-y-8">
      {/* Step 1: Your Financial Health */}
      <Card className="border-2 border-mpr-border">
        <CardHeader className="bg-mpr-interactive-lt">
          <CardTitle className="flex items-center text-xl">
            <Heart className="h-6 w-6 text-mpr-interactive mr-2" />
            Étape 1: Votre santé financière
          </CardTitle>
          <CardDescription className="text-lg">
            Voici un résumé simple de votre situation financière actuelle
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Vos revenus et dépenses</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-base">
                  <span>Revenus mensuels:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(monthlyIncome)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Dépenses mensuelles:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(monthlyExpenses)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Il vous reste chaque mois:</span>
                  <span className={monthlyIncome - monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(monthlyIncome - monthlyExpenses)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Votre note financière</h3>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(financialScore)}`}>
                  {financialScore}/100
                </div>
                <div className="text-lg font-medium mb-3">
                  {getScoreLabel(financialScore)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      financialScore >= 80 ? 'bg-green-500' :
                      financialScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${financialScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Government Programs */}
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center text-xl">
            <Shield className="h-6 w-6 text-green-600 mr-2" />
            Étape 2: Programmes du gouvernement pour vous
          </CardTitle>
          <CardDescription className="text-lg">
            Découvrez les programmes gouvernementaux qui peuvent vous aider
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {governmentProfile && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-semibold mb-3">Votre profil</h3>
                <div className="grid grid-cols-2 gap-4 text-base">
                  <div>
                    <span className="text-gray-600">Votre âge:</span>
                    <span className="font-semibold ml-2">{governmentProfile.age} ans</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Retraite prévue à:</span>
                    <span className="font-semibold ml-2">{governmentProfile.estimatedRetirementAge} ans</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Années restantes:</span>
                    <span className="font-semibold ml-2">{governmentProfile.estimatedRetirementAge - governmentProfile.age} ans</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Situation:</span>
                    <span className="font-semibold ml-2">{governmentProfile.spouseAge ? 'En couple' : 'Célibataire'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-semibold mb-3">Programmes disponibles pour vous</h3>
                <div className="space-y-3">
                  {governmentProfile.age >= 60 && (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <div className="font-semibold">Rente du Québec (RRQ)</div>
                        <div className="text-sm text-gray-600">Vous pouvez maintenant demander votre rente</div>
                      </div>
                    </div>
                  )}
                  {governmentProfile.age >= 65 && (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <div className="font-semibold">Sécurité de la vieillesse (SV)</div>
                        <div className="text-sm text-gray-600">Pension de base du gouvernement canadien</div>
                      </div>
                    </div>
                  )}
                  {governmentProfile.currentRRSPValue > 50000 && (
                    <div className="flex items-center p-3 bg-mpr-interactive-lt rounded-lg">
                      <Calculator className="h-5 w-5 text-mpr-interactive mr-3" />
                      <div>
                        <div className="font-semibold">Optimisation REER/FERR</div>
                        <div className="text-sm text-gray-600">Stratégies pour économiser sur les impôts</div>
                      </div>
                    </div>
                  )}
                  {governmentProfile.hasFirstHomeBuyer && governmentProfile.age < 40 && (
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <Home className="h-5 w-5 text-purple-500 mr-3" />
                      <div>
                        <div className="font-semibold">CELIAPP - Première maison</div>
                        <div className="text-sm text-gray-600">Nouveau programme pour acheter votre première maison</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 3: Simple Recommendations */}
      <Card className="border-2 border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="flex items-center text-xl">
            <Lightbulb className="h-6 w-6 text-orange-600 mr-2" />
            Étape 3: Mes conseils pour vous
          </CardTitle>
          <CardDescription className="text-lg">
            Actions simples que vous pouvez faire maintenant
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-mpr-interactive mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">J'analyse votre situation...</h3>
              <p className="text-gray-600 text-lg">
                Je regarde vos informations pour vous donner les meilleurs conseils
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  rec.severity === 'CRITICAL' ? 'border-l-red-500 bg-red-50' :
                  rec.severity === 'HIGH' ? 'border-l-orange-500 bg-orange-50' :
                  'border-l-blue-500 bg-mpr-interactive-lt'
                }`}>
                  <div className="flex items-start space-x-3">
                    {rec.severity === 'CRITICAL' ? <AlertTriangle className="h-6 w-6 text-red-500 mt-1" /> :
                     rec.severity === 'HIGH' ? <Clock className="h-6 w-6 text-orange-500 mt-1" /> :
                     <Lightbulb className="h-6 w-6 text-mpr-interactive mt-1" />}
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-2">{rec.title}</h4>
                      <p className="text-base mb-3">{rec.message}</p>
                      <p className="text-sm font-medium text-gray-700 mb-2">Pourquoi c'est important: {rec.impact}</p>
                      {rec.estimatedValue !== 0 && (
                        <div className={`p-3 rounded text-base font-semibold ${
                          rec.estimatedValue > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {rec.estimatedValue > 0 ? '💰 Vous pourriez économiser: ' : '⚠️ Coût potentiel: '}
                          {formatCurrency(Math.abs(rec.estimatedValue))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 4: Learn More */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-purple-50">
          <CardTitle className="flex items-center text-xl">
            <BookOpen className="h-6 w-6 text-purple-600 mr-2" />
            Étape 4: Apprendre davantage
          </CardTitle>
          <CardDescription className="text-lg">
            Ressources simples pour mieux comprendre vos finances
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => setShowEducationCenter(true)}
              className="h-16 text-lg bg-mpr-interactive hover:bg-mpr-interactive-dk"
            >
              <BookOpen className="h-6 w-6 mr-2" />
              Guide d'éducation financière
            </Button>
            <Button 
              variant="outline"
              className="h-16 text-lg border-2 border-green-500 text-green-700 hover:bg-green-50"
            >
              <Phone className="h-6 w-6 mr-2" />
              Parler à un conseiller
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-mpr-interactive-lt rounded-lg">
            <h4 className="font-semibold text-mpr-navy mb-2">💡 Le saviez-vous?</h4>
            <p className="text-mpr-navy">
              Commencer à planifier sa retraite même avec de petits montants peut faire une grande différence. 
              Même 50$ par mois peut devenir plusieurs milliers de dollars avec le temps!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-mpr-interactive-lt via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <MasterWizardHeader />
        
        {/* Simple Wizard Interface */}
        <SimpleFinancialWizard />

        {/* Government Education Center Dialog */}
        <Dialog open={showEducationCenter} onOpenChange={setShowEducationCenter}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <BookOpen className="h-6 w-6 text-mpr-interactive mr-2" />
                Guide d'éducation financière
              </DialogTitle>
              <DialogDescription>
                Ressources simples pour mieux comprendre vos finances et la retraite
              </DialogDescription>
            </DialogHeader>
            <GovernmentEducationCenter />
          </DialogContent>
        </Dialog>

        {/* Simple Footer */}
        <div className="mt-12 text-center">
          <Card className="bg-mpr-interactive-lt border-mpr-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-3">
                <Heart className="h-6 w-6 text-mpr-interactive mr-2" />
                <h3 className="text-xl font-semibold text-mpr-navy">
                  Votre Guide Financier Personnel
                </h3>
              </div>
              <p className="text-mpr-navy text-lg max-w-2xl mx-auto">
                Je suis là pour vous aider à prendre le contrôle de vos finances, 
                étape par étape, avec des mots simples et des conseils pratiques.
              </p>
              <div className="flex justify-center items-center mt-4 space-x-8 text-mpr-interactive">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="font-medium">Vos données sont privées</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Conseils du gouvernement</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
