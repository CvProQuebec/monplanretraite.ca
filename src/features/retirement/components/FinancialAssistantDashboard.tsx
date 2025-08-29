import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Progress } from '../../../components/ui/progress';
import { ExpenseScenarioPlanner } from './ExpenseScenarioPlanner';
import { WeeklyFinancialTracker } from './WeeklyFinancialTracker';
import { 
  ExpenseScenarioState, 
  WeeklyFinancialSnapshot, 
  FinancialAlert 
} from '../types/expense-scenarios';
import { ExpenseScenarioService } from '../services/ExpenseScenarioService';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Lightbulb,
  Shield,
  Zap,
  Clock,
  ArrowRight,
  Star,
  Award
} from 'lucide-react';

interface FinancialAssistantDashboardProps {
  currentBalance?: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
}

export const FinancialAssistantDashboard: React.FC<FinancialAssistantDashboardProps> = ({
  currentBalance = 5000,
  monthlyIncome = 4500,
  monthlyExpenses = 3200
}) => {
  const [expenseScenarioState, setExpenseScenarioState] = useState<ExpenseScenarioState | null>(null);
  const [currentWeekSnapshot, setCurrentWeekSnapshot] = useState<WeeklyFinancialSnapshot | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<FinancialAlert[]>([]);
  const [seasonalAlerts, setSeasonalAlerts] = useState<FinancialAlert[]>([]);
  const [financialScore, setFinancialScore] = useState(0);

  useEffect(() => {
    calculateFinancialScore();
    generateSmartRecommendations();
    generateSeasonalAlerts();
  }, [expenseScenarioState, currentWeekSnapshot, currentBalance, monthlyIncome, monthlyExpenses]);

  const generateSeasonalAlerts = () => {
    const seasonalAlerts = ExpenseScenarioService.generateSeasonalExpenseAlerts(
      currentBalance,
      monthlyIncome,
      monthlyExpenses
    );
    setSeasonalAlerts(seasonalAlerts);
  };

  const calculateFinancialScore = () => {
    let score = 0;
    
    // Base score from cash flow
    const netFlow = monthlyIncome - monthlyExpenses;
    if (netFlow > 0) score += 30;
    else if (netFlow > -500) score += 15;
    
    // Emergency fund score
    const emergencyMonths = currentBalance / monthlyExpenses;
    if (emergencyMonths >= 6) score += 25;
    else if (emergencyMonths >= 3) score += 15;
    else if (emergencyMonths >= 1) score += 10;
    
    // Debt-to-income ratio (assuming reasonable debt)
    const debtRatio = monthlyExpenses / monthlyIncome;
    if (debtRatio <= 0.3) score += 20;
    else if (debtRatio <= 0.5) score += 15;
    else if (debtRatio <= 0.7) score += 10;
    
    // Planning and tracking bonus
    if (expenseScenarioState?.scenarios.length > 0) score += 15;
    if (currentWeekSnapshot) score += 10;
    
    setFinancialScore(Math.min(score, 100));
  };

  const generateSmartRecommendations = () => {
    const alerts: FinancialAlert[] = [];
    const netFlow = monthlyIncome - monthlyExpenses;
    const emergencyMonths = currentBalance / monthlyExpenses;

    // Emergency fund alerts
    if (emergencyMonths < 1) {
      alerts.push({
        id: 'emergency_critical',
        type: 'low_balance',
        severity: 'error',
        message: 'Fonds d\'urgence critique - Moins d\'un mois de dépenses',
        actionRequired: true,
        suggestedActions: [
          'Réduisez immédiatement les dépenses non essentielles',
          'Cherchez des sources de revenus supplémentaires',
          'Évitez tout achat important'
        ],
        createdAt: new Date()
      });
    } else if (emergencyMonths < 3) {
      alerts.push({
        id: 'emergency_low',
        type: 'low_balance',
        severity: 'warning',
        message: 'Fonds d\'urgence insuffisant - Moins de 3 mois de dépenses',
        actionRequired: true,
        suggestedActions: [
          'Augmentez votre épargne d\'urgence',
          'Automatisez un virement hebdomadaire vers l\'épargne',
          'Révisez vos dépenses pour identifier des économies'
        ],
        createdAt: new Date()
      });
    }

    // Cash flow alerts
    if (netFlow < 0) {
      alerts.push({
        id: 'negative_cashflow',
        type: 'overspending',
        severity: 'error',
        message: 'Flux de trésorerie négatif - Vous dépensez plus que vous gagnez',
        actionRequired: true,
        suggestedActions: [
          'Analysez vos dépenses pour identifier les coupes possibles',
          'Cherchez des moyens d\'augmenter vos revenus',
          'Évitez les dépenses non essentielles'
        ],
        createdAt: new Date()
      });
    } else if (netFlow < 500) {
      alerts.push({
        id: 'low_savings',
        type: 'low_balance',
        severity: 'warning',
        message: 'Capacité d\'épargne limitée - Peu de marge de manœuvre',
        actionRequired: false,
        suggestedActions: [
          'Cherchez des moyens d\'optimiser vos dépenses',
          'Explorez des opportunités d\'augmentation de revenus',
          'Planifiez soigneusement vos achats importants'
        ],
        createdAt: new Date()
      });
    }

    // Positive reinforcement
    if (netFlow > 1000 && emergencyMonths >= 3) {
      alerts.push({
        id: 'good_financial_health',
        type: 'scenario_impact',
        severity: 'info',
        message: 'Excellente santé financière - Vous êtes sur la bonne voie!',
        actionRequired: false,
        suggestedActions: [
          'Considérez augmenter vos investissements',
          'Planifiez des objectifs financiers à long terme',
          'Maintenez vos bonnes habitudes'
        ],
        createdAt: new Date()
      });
    }

    setActiveAlerts(alerts);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const QuickInsights = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Score financier</p>
              <p className={`text-2xl font-bold ${getScoreColor(financialScore)}`}>
                {financialScore}/100
              </p>
              <p className="text-xs text-gray-400">{getScoreLabel(financialScore)}</p>
            </div>
            <Award className={`h-8 w-8 ${getScoreColor(financialScore)}`} />
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

      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Fonds d'urgence</p>
              <p className="text-2xl font-bold text-purple-600">
                {(currentBalance / monthlyExpenses).toFixed(1)} mois
              </p>
              <p className="text-xs text-gray-400">
                {formatCurrency(currentBalance)} disponible
              </p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Alertes actives</p>
              <p className="text-2xl font-bold text-orange-600">{activeAlerts.length}</p>
              <p className="text-xs text-gray-400">
                {activeAlerts.filter(a => a.actionRequired).length} nécessitent une action
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SmartRecommendations = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-blue-600 mr-2" />
          <CardTitle>Recommandations intelligentes</CardTitle>
        </div>
        <CardDescription>
          Conseils personnalisés basés sur votre situation financière
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Situation financière stable</h3>
            <p className="text-gray-600">
              Aucune alerte active. Continuez vos bonnes habitudes financières!
            </p>
          </div>
        ) : (
          activeAlerts.map((alert, index) => (
            <Alert key={index} className={
              alert.severity === 'error' ? 'border-red-200 bg-red-50' :
              alert.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
              'border-blue-200 bg-blue-50'
            }>
              <div className="flex items-start space-x-3">
                {alert.severity === 'error' ? <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" /> :
                 alert.severity === 'warning' ? <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" /> :
                 <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />}
                <div className="flex-1">
                  <AlertDescription>
                    <p className="font-medium mb-2">{alert.message}</p>
                    {alert.suggestedActions.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Actions recommandées:</p>
                        <ul className="text-sm space-y-1">
                          {alert.suggestedActions.map((action, i) => (
                            <li key={i} className="flex items-start">
                              <ArrowRight className="h-3 w-3 mr-2 mt-1 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          ))
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assistant Financier Personnel
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Votre compagnon intelligent pour une gestion financière optimale et 
            la prévention des catastrophes financières
          </p>
        </div>

        {/* Quick Insights */}
        <div className="mb-8">
          <QuickInsights />
        </div>

        {/* Smart Recommendations */}
        <div className="mb-8">
          <SmartRecommendations />
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="weekly">Suivi hebdomadaire</TabsTrigger>
            <TabsTrigger value="scenarios">Scénarios de dépenses</TabsTrigger>
            <TabsTrigger value="insights">Analyses avancées</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Financial Health Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Score de santé financière
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className={`text-6xl font-bold ${getScoreColor(financialScore)} mb-2`}>
                      {financialScore}
                    </div>
                    <p className="text-lg text-gray-600">{getScoreLabel(financialScore)}</p>
                  </div>
                  <Progress value={financialScore} className="h-3 mb-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Flux de trésorerie</span>
                      <span className={monthlyIncome - monthlyExpenses > 0 ? 'text-green-600' : 'text-red-600'}>
                        {monthlyIncome - monthlyExpenses > 0 ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fonds d'urgence (3+ mois)</span>
                      <span className={currentBalance / monthlyExpenses >= 3 ? 'text-green-600' : 'text-red-600'}>
                        {currentBalance / monthlyExpenses >= 3 ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ratio dépenses/revenus (&lt;70%)</span>
                      <span className={monthlyExpenses / monthlyIncome <= 0.7 ? 'text-green-600' : 'text-red-600'}>
                        {monthlyExpenses / monthlyIncome <= 0.7 ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Planification active</span>
                      <span className={expenseScenarioState?.scenarios.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                        {expenseScenarioState?.scenarios.length > 0 ? '✓' : '○'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cash Flow Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Analyse du flux de trésorerie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Revenus mensuels</span>
                      <span className="font-semibold text-green-600">{formatCurrency(monthlyIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Dépenses mensuelles</span>
                      <span className="font-semibold text-red-600">{formatCurrency(monthlyExpenses)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Flux net mensuel</span>
                      <span className={`font-bold text-lg ${
                        monthlyIncome - monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(monthlyIncome - monthlyExpenses)}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Utilisation du revenu</span>
                        <span>{((monthlyExpenses / monthlyIncome) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(monthlyExpenses / monthlyIncome) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="weekly">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <WeeklyFinancialTracker onSnapshotUpdate={setCurrentWeekSnapshot} />
            </div>
          </TabsContent>

          <TabsContent value="scenarios">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <ExpenseScenarioPlanner
                currentBalance={currentBalance}
                monthlyIncome={monthlyIncome}
                monthlyExpenses={monthlyExpenses}
                onStateChange={setExpenseScenarioState}
              />
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Objectifs financiers suggérés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Court terme (1-3 mois)</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Constituer un fonds d'urgence de {formatCurrency(monthlyExpenses * 3)}</li>
                        <li>• Automatiser l'épargne de {formatCurrency(Math.max(200, (monthlyIncome - monthlyExpenses) * 0.2))} par mois</li>
                        <li>• Réviser et optimiser les dépenses récurrentes</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Moyen terme (3-12 mois)</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Augmenter le fonds d'urgence à {formatCurrency(monthlyExpenses * 6)}</li>
                        <li>• Planifier les gros achats avec l'outil de scénarios</li>
                        <li>• Explorer des opportunités d'augmentation de revenus</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Long terme (1+ ans)</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Commencer à investir {formatCurrency((monthlyIncome - monthlyExpenses) * 0.3)} par mois</li>
                        <li>• Planifier la retraite et les objectifs à long terme</li>
                        <li>• Optimiser la fiscalité et les assurances</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-3">
                <Brain className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-blue-800">
                  Assistant Financier Personnel
                </h3>
              </div>
              <p className="text-blue-700 max-w-3xl mx-auto">
                Cet assistant intelligent analyse votre situation financière en temps réel, 
                vous aide à éviter les catastrophes financières et vous guide vers une 
                meilleure santé financière. Toutes vos données restent privées et sécurisées 
                sur votre appareil.
              </p>
              <div className="flex justify-center items-center mt-4 space-x-6 text-sm text-blue-600">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Données sécurisées
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  Analyses en temps réel
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  Conseils personnalisés
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
