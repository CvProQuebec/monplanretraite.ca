import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Progress } from '../../../components/ui/progress';
import { 
  ExpenseScenario, 
  ScenarioOption, 
  PaymentOption, 
  ExpenseScenarioState,
  SCENARIO_TEMPLATES,
  ExpenseCategory
} from '../types/expense-scenarios';
import { ExpenseScenarioService } from '../services/ExpenseScenarioService';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  Calendar,
  Plus,
  Trash2,
  Eye,
  Download
} from 'lucide-react';

interface ExpenseScenarioPlannerProps {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  onStateChange?: (state: ExpenseScenarioState) => void;
}

export const ExpenseScenarioPlanner: React.FC<ExpenseScenarioPlannerProps> = ({
  currentBalance,
  monthlyIncome,
  monthlyExpenses,
  onStateChange
}) => {
  const [state, setState] = useState<ExpenseScenarioState>({
    scenarios: [],
    weeklySnapshots: [],
    currentBalance,
    monthlyIncome,
    monthlyExpenses,
    emergencyFund: 0,
    settings: {
      alertThresholds: {
        lowBalance: 500,
        overspendingPercentage: 10,
        upcomingExpenseDays: 7
      },
      defaultCategories: ['appliances', 'travel', 'housing'],
      autoSaveEnabled: true,
      weeklyReminderEnabled: true
    }
  });

  const [selectedScenario, setSelectedScenario] = useState<ExpenseScenario | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [newScenarioName, setNewScenarioName] = useState('');
  const [newScenarioCategory, setNewScenarioCategory] = useState<ExpenseCategory>('other');

  useEffect(() => {
    const savedState = ExpenseScenarioService.loadState();
    if (savedState) {
      setState(prev => ({ ...prev, ...savedState }));
    }
  }, []);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      currentBalance,
      monthlyIncome,
      monthlyExpenses
    }));
  }, [currentBalance, monthlyIncome, monthlyExpenses]);

  useEffect(() => {
    if (state.settings.autoSaveEnabled) {
      ExpenseScenarioService.saveState(state);
    }
    onStateChange?.(state);
  }, [state, onStateChange]);

  const createScenarioFromTemplate = (templateName: string) => {
    const scenario = ExpenseScenarioService.createScenarioFromTemplate(templateName);
    if (scenario) {
      // Calculate impacts for each scenario option
      scenario.scenarios = scenario.scenarios.map(option => ({
        ...option,
        paymentOptions: option.paymentOptions.map(paymentOption => ({
          ...paymentOption,
          // Calculate impact for this payment option
        })),
        impact: ExpenseScenarioService.calculateCashFlowImpact(
          option,
          currentBalance,
          monthlyIncome,
          monthlyExpenses,
          option.paymentOptions[0]
        )
      }));

      setState(prev => ({
        ...prev,
        scenarios: [...prev.scenarios, scenario]
      }));
    }
  };

  const createCustomScenario = () => {
    if (!newScenarioName.trim()) return;

    const scenario: ExpenseScenario = {
      id: `custom_${Date.now()}`,
      name: newScenarioName,
      description: `Scénario personnalisé: ${newScenarioName}`,
      category: newScenarioCategory,
      scenarios: [],
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setState(prev => ({
      ...prev,
      scenarios: [...prev.scenarios, scenario]
    }));

    setNewScenarioName('');
    setSelectedScenario(scenario);
  };

  const deleteScenario = (scenarioId: string) => {
    setState(prev => ({
      ...prev,
      scenarios: prev.scenarios.filter(s => s.id !== scenarioId)
    }));
    if (selectedScenario?.id === scenarioId) {
      setSelectedScenario(null);
    }
  };

  const getRiskColor = (riskLevel: 'low' | 'medium' | 'high') => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
    }
  };

  const getRiskIcon = (riskLevel: 'low' | 'medium' | 'high') => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const ScenarioComparison: React.FC<{ scenario: ExpenseScenario }> = ({ scenario }) => {
    const comparisons = ExpenseScenarioService.compareScenarios(
      scenario.scenarios,
      currentBalance,
      monthlyIncome,
      monthlyExpenses
    );

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comparaison des options</h3>
        <div className="grid gap-4">
          {comparisons.map(({ scenario: option, bestPaymentOption, impact }, index) => (
            <Card key={option.id} className={`border-l-4 ${
              impact.riskLevel === 'low' ? 'border-l-green-500' :
              impact.riskLevel === 'medium' ? 'border-l-yellow-500' : 'border-l-red-500'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{option.name}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </div>
                  <Badge className={getRiskColor(impact.riskLevel)}>
                    {getRiskIcon(impact.riskLevel)}
                    <span className="ml-1 capitalize">{impact.riskLevel}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-gray-500">Coût initial</Label>
                    <p className="font-semibold">{formatCurrency(option.amount)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Coût total</Label>
                    <p className="font-semibold">{formatCurrency(impact.totalCost)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Impact mensuel</Label>
                    <p className="font-semibold">{formatCurrency(impact.monthlyImpact)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Solde minimum</Label>
                    <p className={`font-semibold ${impact.worstCaseBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(impact.worstCaseBalance)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Meilleure option de paiement</Label>
                  <p className="text-sm font-medium">{bestPaymentOption.description}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Avantages</Label>
                  <ul className="text-sm text-green-600 space-y-1">
                    {option.pros.map((pro, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Inconvénients</Label>
                  <ul className="text-sm text-red-600 space-y-1">
                    {option.cons.map((con, i) => (
                      <li key={i} className="flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-2" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>

                <Alert>
                  <AlertDescription>
                    <div className="space-y-1">
                      {impact.recommendations.map((rec, i) => (
                        <p key={i} className="text-sm">{rec}</p>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Optimal timing analysis */}
                {(() => {
                  const timing = ExpenseScenarioService.findOptimalTiming(
                    option,
                    bestPaymentOption,
                    currentBalance,
                    monthlyIncome,
                    monthlyExpenses
                  );
                  return (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                        <Label className="text-sm font-medium text-blue-800">Moment optimal</Label>
                      </div>
                      <p className="text-sm text-blue-700">{timing.reasoning}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Date recommandée: {timing.optimalDate.toLocaleDateString('fr-CA')}
                      </p>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Planification de dépenses</h1>
          <p className="text-gray-600">
            Comparez différentes options d'achat et optimisez votre flux de trésorerie
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Solde actuel</p>
                <p className="text-xl font-bold">{formatCurrency(currentBalance)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenus mensuels</p>
                <p className="text-xl font-bold">{formatCurrency(monthlyIncome)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dépenses mensuelles</p>
                <p className="text-xl font-bold">{formatCurrency(monthlyExpenses)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Flux net mensuel</p>
                <p className={`text-xl font-bold ${
                  monthlyIncome - monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(monthlyIncome - monthlyExpenses)}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="scenarios">Scénarios</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            {state.scenarios.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun scénario créé</h3>
                  <p className="text-gray-600 mb-4">
                    Commencez par créer un scénario de dépense ou utilisez un modèle prédéfini.
                  </p>
                  <Button onClick={() => setActiveTab('templates')}>
                    Voir les modèles
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {state.scenarios.map(scenario => (
                  <Card key={scenario.id} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedScenario(scenario)}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{scenario.name}</CardTitle>
                          <CardDescription>{scenario.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="capitalize">
                            {scenario.category}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteScenario(scenario.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          {scenario.scenarios.length} option{scenario.scenarios.length > 1 ? 's' : ''} disponible{scenario.scenarios.length > 1 ? 's' : ''}
                        </p>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Analyser
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          {selectedScenario ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{selectedScenario.name}</h2>
                  <p className="text-gray-600">{selectedScenario.description}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedScenario(null)}>
                  Retour à la liste
                </Button>
              </div>
              <ScenarioComparison scenario={selectedScenario} />
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">Sélectionnez un scénario</h3>
                <p className="text-gray-600">
                  Choisissez un scénario dans la vue d'ensemble pour voir l'analyse détaillée.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Créer un scénario personnalisé</CardTitle>
                <CardDescription>
                  Définissez votre propre scénario de dépense
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scenario-name">Nom du scénario</Label>
                    <Input
                      id="scenario-name"
                      value={newScenarioName}
                      onChange={(e) => setNewScenarioName(e.target.value)}
                      placeholder="Ex: Rénovation cuisine"
                    />
                  </div>
                  <div>
                    <Label htmlFor="scenario-category">Catégorie</Label>
                    <Select value={newScenarioCategory} onValueChange={(value: ExpenseCategory) => setNewScenarioCategory(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="housing">Logement</SelectItem>
                        <SelectItem value="transportation">Transport</SelectItem>
                        <SelectItem value="appliances">Électroménagers</SelectItem>
                        <SelectItem value="travel">Voyage</SelectItem>
                        <SelectItem value="healthcare">Santé</SelectItem>
                        <SelectItem value="entertainment">Divertissement</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={createCustomScenario} disabled={!newScenarioName.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le scénario
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Modèles prédéfinis</h3>
              {SCENARIO_TEMPLATES.map((template, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {template.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        {template.scenarios?.length} options prédéfinies
                      </p>
                      <Button 
                        onClick={() => createScenarioFromTemplate(template.name!)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Utiliser ce modèle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
