import React, { useState, useEffect } from 'react';
import { FinancialAssistantDashboard } from '../features/retirement/components/FinancialAssistantDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useRetirementData } from '../features/retirement/hooks/useRetirementData';
import { IncomeIntegrationService } from '../services/IncomeIntegrationService';
import { useAuth } from '../hooks/useAuth';
import { checkFeatureAccess, getRequiredPlanForFeature, getContextualUpgradeMessage } from '../config/plans';
import AdvancedUpgradeModal from '../components/ui/advanced-upgrade-modal';
import { 
  Brain, 
  Shield, 
  Zap, 
  Target, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Star,
  Award,
  Lightbulb,
  Calculator,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../features/retirement/hooks/useLanguage';

export const AssistantFinancier: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isFrench = language === 'fr';
  const [currentBalance, setCurrentBalance] = useState(5000);
  const [monthlyIncome, setMonthlyIncome] = useState(4500);
  const [monthlyExpenses, setMonthlyExpenses] = useState(3200);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Vérifier l'accès à l'Assistant Financier Personnel
  const userPlan = user?.subscription?.plan || 'free';
  const hasAccess = checkFeatureAccess('hasFinancialAssistant', userPlan);
  const requiredPlan = getRequiredPlanForFeature('hasFinancialAssistant');

  // Load financial data from localStorage or other sources
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('retirement_data');
      const hasVisited = localStorage.getItem('financial_assistant_visited');
      
      if (hasVisited) {
        setIsFirstVisit(false);
      }

      if (savedData) {
        const data = JSON.parse(savedData);
        // Extract relevant financial information
        if (data.person1?.monthlyIncome || data.person2?.monthlyIncome) {
          const totalIncome = (data.person1?.monthlyIncome || 0) + (data.person2?.monthlyIncome || 0);
          setMonthlyIncome(totalIncome);
        }
        if (data.person1?.monthlyExpenses || data.person2?.monthlyExpenses) {
          const totalExpenses = (data.person1?.monthlyExpenses || 0) + (data.person2?.monthlyExpenses || 0);
          setMonthlyExpenses(totalExpenses);
        }
        if (data.currentSavings) {
          setCurrentBalance(data.currentSavings);
        }
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    }
  }, []);

  const handleGetStarted = () => {
    setIsFirstVisit(false);
    localStorage.setItem('financial_assistant_visited', 'true');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  // Si l'utilisateur n'a pas accès, afficher le message d'upgrade
  if (!hasAccess) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-full shadow-lg">
                  <Shield className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {isFrench ? 'Assistant Financier Personnel' : 'Personal Financial Assistant'}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                {isFrench 
                  ? 'Cette fonctionnalité est réservée aux plans Professionnel et Expert.'
                  : 'This feature is reserved for Professional and Expert plans.'
                }
              </p>
              
              <Alert className="max-w-2xl mx-auto mb-8 border-orange-200 bg-orange-50">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>
                    {isFrench ? 'Accès restreint :' : 'Restricted access:'}
                  </strong> {getContextualUpgradeMessage(userPlan, requiredPlan)}
                </AlertDescription>
              </Alert>

              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => setShowUpgradeModal(true)}
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 text-lg"
                >
                  {isFrench ? 'Mettre à niveau maintenant' : 'Upgrade now'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <AdvancedUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          requiredPlan={requiredPlan}
          featureName="hasFinancialAssistant"
          currentPlan={userPlan}
          subscriptionStartDate={user?.subscription?.startDate}
        />
      </>
    );
  }

  if (isFirstVisit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-lg">
                <Brain className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Votre Assistant Financier Personnel
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Un compagnon intelligent qui analyse votre situation financière en temps réel, 
              vous aide à éviter les catastrophes financières et vous guide vers une meilleure santé financière.
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
              >
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center">
                  <Calculator className="h-6 w-6 text-blue-600 mr-3" />
                  <CardTitle className="text-lg">Planification de dépenses</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Comparez différentes options d'achat (électroménagers, vacances, etc.) 
                  et découvrez le meilleur moment pour effectuer vos achats importants.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Scénarios de comparaison automatiques
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Optimisation du timing d'achat
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Analyse d'impact sur le flux de trésorerie
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-green-600 mr-3" />
                  <CardTitle className="text-lg">Suivi hebdomadaire</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Surveillez vos finances semaine par semaine avec des alertes intelligentes 
                  pour éviter les découverts et maintenir un budget équilibré.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Suivi revenus vs dépenses
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Alertes préventives automatiques
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Tendances et analyses
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center">
                  <Brain className="h-6 w-6 text-purple-600 mr-3" />
                  <CardTitle className="text-lg">Intelligence artificielle</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Recevez des recommandations personnalisées basées sur votre situation 
                  unique et des conseils proactifs pour améliorer votre santé financière.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Score de santé financière
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Recommandations personnalisées
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Objectifs financiers suggérés
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Use Cases */}
          <Card className="mb-12 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardHeader>
              <div className="flex items-center">
                <Lightbulb className="h-6 w-6 text-amber-600 mr-3" />
                <CardTitle className="text-xl text-amber-800">Cas d'usage concrets</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-amber-800 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Éviter les catastrophes financières
                  </h4>
                  <div className="space-y-3 text-sm text-amber-700">
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Situation:</strong> Vous voulez acheter un électroménager à 2000$
                      </span>
                    </div>
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>L'assistant analyse:</strong> Impact sur votre flux de trésorerie, 
                        options de financement, meilleur moment pour l'achat
                      </span>
                    </div>
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Résultat:</strong> Évite un découvert bancaire en recommandant 
                        d'attendre 2 mois ou de choisir l'option usagée
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-amber-800 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Optimiser vos décisions financières
                  </h4>
                  <div className="space-y-3 text-sm text-amber-700">
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Situation:</strong> Planifier des vacances (8000$ croisière vs 2000$ Cuba)
                      </span>
                    </div>
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>L'assistant compare:</strong> Impact sur votre fonds d'urgence, 
                        options de paiement, conséquences à long terme
                      </span>
                    </div>
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Résultat:</strong> Recommande Cuba maintenant ou croisière 
                        dans 6 mois avec plan d'épargne
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Privacy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Données sécurisées</h3>
                <p className="text-gray-600 text-sm">
                  Toutes vos informations financières restent privées et 
                  sont stockées localement sur votre appareil.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Analyses en temps réel</h3>
                <p className="text-gray-600 text-sm">
                  L'assistant analyse votre situation instantanément 
                  et s'adapte à chaque changement.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Conseils personnalisés</h3>
                <p className="text-gray-600 text-sm">
                  Chaque recommandation est adaptée à votre situation 
                  financière unique et vos objectifs.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  Prêt à prendre le contrôle de vos finances?
                </h2>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Rejoignez les milliers d'utilisateurs qui ont déjà évité des catastrophes 
                  financières grâce à leur assistant personnel intelligent.
                </p>
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                >
                  Démarrer mon analyse gratuite
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FinancialAssistantDashboard
      currentBalance={currentBalance}
      monthlyIncome={monthlyIncome}
      monthlyExpenses={monthlyExpenses}
    />
  );
};

export default AssistantFinancier;
