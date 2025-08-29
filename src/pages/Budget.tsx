import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { IncomeIntegrationService } from '@/services/IncomeIntegrationService';
import { useAuth } from '@/hooks/useAuth';
import { checkFeatureAccess, getRequiredPlanForFeature, getContextualUpgradeMessage } from '@/config/plans';
import AdvancedUpgradeModal from '@/components/ui/advanced-upgrade-modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DateInput from '@/components/ui/DateInput';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import MoneyInput from '@/components/ui/MoneyInput';
import { 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Home,
  Zap,
  Car,
  ShoppingCart,
  Utensils,
  Gamepad2,
  Heart,
  PiggyBank,
  Target,
  BarChart3,
  Clock,
  Save,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react';
import { EnhancedSaveManager } from '@/services/EnhancedSaveManager';
import { SmartAlerts } from '@/components/ui/SmartAlerts';
import { OnboardingWizard } from '@/components/ui/OnboardingWizard';
import { LearningModule } from '@/components/ui/LearningModule';
import { CoastFIRECalculator } from '@/components/ui/CoastFIRECalculator';
import { EconomyTipsGuide } from '@/components/ui/EconomyTipsGuide';
import { SeasonalWorkerBudget } from '@/components/ui/SeasonalWorkerBudget';
import { ErrorPreventionService } from '@/services/ErrorPreventionService';
import { OnboardingService } from '@/services/OnboardingService';
import { GamificationService } from '@/services/GamificationService';

// Types pour le budget
interface ExpenseEntry {
  id: string;
  category: 'logement' | 'services' | 'transport' | 'alimentation' | 'sante' | 'loisirs' | 'epargne' | 'divers';
  subcategory: string;
  description: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually' | 'seasonal';
  paymentDate?: number; // Jour du mois (1-31)
  seasonalMonths?: number[]; // Mois pour les dépenses saisonnières
  isActive: boolean;
  isFixed: boolean; // Fixe ou variable
  notes?: string;
}

interface MortgageInfo {
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  paymentDate: number;
  startDate: string;
  isActive: boolean;
}

interface BudgetData {
  currentBalance: number;
  balanceDate: string;
  expenses: ExpenseEntry[];
  mortgage?: MortgageInfo;
  savingsGoal: number;
  emergencyFund: number;
}

const Budget: React.FC = () => {
  const { language } = useLanguage();
  const { userData, updateUserData } = useRetirementData();
  const { user } = useAuth();
  const isFrench = language === 'fr';
  
  const [budgetData, setBudgetData] = useState<BudgetData>({
    currentBalance: 0,
    balanceDate: new Date().toISOString().split('T')[0],
    expenses: [],
    savingsGoal: 0,
    emergencyFund: 0
  });
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Vérifier l'accès au Module Budget
  const userPlan = user?.subscription?.plan || 'free';
  const hasAccess = checkFeatureAccess('hasBudgetModule', userPlan);
  const requiredPlan = getRequiredPlanForFeature('hasBudgetModule');
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Catégories de dépenses avec icônes et couleurs
  const expenseCategories = [
    {
      value: 'logement',
      label: isFrench ? 'Logement' : 'Housing',
      icon: <Home className="w-4 h-4" />,
      color: 'bg-blue-500',
      subcategories: [
        'Hypothèque/Loyer', 'Taxes municipales', 'Assurance habitation', 
        'Entretien', 'Réparations', 'Amélioration'
      ]
    },
    {
      value: 'services',
      label: isFrench ? 'Services publics' : 'Utilities',
      icon: <Zap className="w-4 h-4" />,
      color: 'bg-yellow-500',
      subcategories: [
        'Électricité', 'Gaz naturel', 'Eau', 'Internet', 'Téléphone', 
        'Câble/Streaming', 'Déneigement', 'Ordures'
      ]
    },
    {
      value: 'transport',
      label: isFrench ? 'Transport' : 'Transportation',
      icon: <Car className="w-4 h-4" />,
      color: 'bg-green-500',
      subcategories: [
        'Paiement auto', 'Essence', 'Assurance auto', 'Entretien', 
        'Réparations', 'Immatriculation', 'Transport public', 'Stationnement'
      ]
    },
    {
      value: 'alimentation',
      label: isFrench ? 'Alimentation' : 'Food',
      icon: <Utensils className="w-4 h-4" />,
      color: 'bg-orange-500',
      subcategories: [
        'Épicerie', 'Restaurants', 'Livraison', 'Café', 'Alcool', 'Suppléments'
      ]
    },
    {
      value: 'sante',
      label: isFrench ? 'Santé' : 'Health',
      icon: <Heart className="w-4 h-4" />,
      color: 'bg-red-500',
      subcategories: [
        'Assurance santé', 'Médicaments', 'Dentiste', 'Optométriste', 
        'Physiothérapie', 'Gym', 'Massothérapie'
      ]
    },
    {
      value: 'loisirs',
      label: isFrench ? 'Loisirs' : 'Entertainment',
      icon: <Gamepad2 className="w-4 h-4" />,
      color: 'bg-purple-500',
      subcategories: [
        'Sorties', 'Cinéma', 'Concerts', 'Voyages', 'Hobbies', 
        'Livres', 'Jeux', 'Abonnements'
      ]
    },
    {
      value: 'epargne',
      label: isFrench ? 'Épargne' : 'Savings',
      icon: <PiggyBank className="w-4 h-4" />,
      color: 'bg-indigo-500',
      subcategories: [
        'REER', 'CELI', 'Épargne urgence', 'Placements', 'Objectifs', 'Retraite'
      ]
    },
    {
      value: 'divers',
      label: isFrench ? 'Divers' : 'Miscellaneous',
      icon: <ShoppingCart className="w-4 h-4" />,
      color: 'bg-gray-500',
      subcategories: [
        'Vêtements', 'Cadeaux', 'Dons', 'Frais bancaires', 'Impôts', 
        'Assurance vie', 'Frais professionnels', 'Autres'
      ]
    }
  ];

  // Fréquences de paiement
  const frequencies = [
    { value: 'weekly', label: isFrench ? 'Hebdomadaire' : 'Weekly', multiplier: 52 },
    { value: 'biweekly', label: isFrench ? 'Aux 2 semaines' : 'Bi-weekly', multiplier: 26 },
    { value: 'monthly', label: isFrench ? 'Mensuel' : 'Monthly', multiplier: 12 },
    { value: 'quarterly', label: isFrench ? 'Trimestriel' : 'Quarterly', multiplier: 4 },
    { value: 'annually', label: isFrench ? 'Annuel' : 'Annual', multiplier: 1 },
    { value: 'seasonal', label: isFrench ? 'Saisonnier' : 'Seasonal', multiplier: 1 }
  ];

  // Obtenir les revenus depuis le tableau unifié
  const getIncomeData = () => {
    const unifiedIncome1 = (userData.personal as any)?.unifiedIncome1 || [];
    const unifiedIncome2 = (userData.personal as any)?.unifiedIncome2 || [];
    
    return IncomeIntegrationService.convertToFinancialAssistantFormat(
      unifiedIncome1,
      unifiedIncome2
    );
  };

  const incomeData = getIncomeData();

  // Calculer les dépenses mensuelles
  const calculateMonthlyExpenses = () => {
    let total = 0;
    
    budgetData.expenses.forEach(expense => {
      if (!expense.isActive) return;
      
      const freq = frequencies.find(f => f.value === expense.frequency);
      if (!freq) return;
      
      if (expense.frequency === 'seasonal') {
        total += expense.amount / 12;
      } else {
        total += (expense.amount * freq.multiplier) / 12;
      }
    });
    
    // Ajouter l'hypothèque
    if (budgetData.mortgage?.isActive) {
      const mortgageFreq = frequencies.find(f => f.value === budgetData.mortgage!.frequency);
      if (mortgageFreq) {
        total += (budgetData.mortgage.amount * mortgageFreq.multiplier) / 12;
      }
    }
    
    return total;
  };

  // Calculer le flux de trésorerie net
  const calculateNetCashFlow = () => {
    const monthlyIncome = incomeData.monthlyIncome;
    const monthlyExpenses = calculateMonthlyExpenses();
    return monthlyIncome - monthlyExpenses;
  };

  // Ajouter une nouvelle dépense
  const addExpense = () => {
    const newExpense: ExpenseEntry = {
      id: `expense-${Date.now()}`,
      category: 'divers',
      subcategory: 'Autres',
      description: '',
      amount: 0,
      frequency: 'monthly',
      paymentDate: 1,
      isActive: true,
      isFixed: true
    };

    setBudgetData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));

    setEditingExpense(newExpense.id);
    setShowAddExpense(false);
  };

  // Mettre à jour une dépense
  const updateExpense = (id: string, updates: Partial<ExpenseEntry>) => {
    setBudgetData(prev => ({
      ...prev,
      expenses: prev.expenses.map(expense =>
        expense.id === id ? { ...expense, ...updates } : expense
      )
    }));
  };

  // Supprimer une dépense
  const removeExpense = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== id)
    }));
  };

  // Formater la devise
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Obtenir la couleur selon le montant (positif/négatif)
  const getAmountColor = (amount: number) => {
    if (amount > 0) return 'text-green-600';
    if (amount < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Sauvegarder les données
  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateUserData('personal', { budgetData } as any);
      
      const result = await EnhancedSaveManager.saveDirectly(userData, {
        includeTimestamp: true
      });
      
      if (result.success) {
        console.log('💾 Budget sauvegardé avec succès:', result.filename);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du budget:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    const savedBudgetData = (userData.personal as any)?.budgetData;
    if (savedBudgetData) {
      setBudgetData(savedBudgetData);
    }
  }, [userData]);

  const monthlyExpenses = calculateMonthlyExpenses();
  const netCashFlow = calculateNetCashFlow();

  // Si l'utilisateur n'a pas accès, afficher le message d'upgrade
  if (!hasAccess) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-full shadow-lg">
                  <PiggyBank className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {isFrench ? 'Module Budget' : 'Budget Module'}
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
          featureName="hasBudgetModule"
          currentPlan={userPlan}
          subscriptionStartDate={user?.subscription?.startDate}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Particules de fond */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* En-tête spectaculaire */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl">
            💰 {isFrench ? 'Mon Budget Intelligent' : 'My Smart Budget'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            {isFrench 
              ? 'Gérez vos finances avec précision - revenus, dépenses, et prévisions saisonnières'
              : 'Manage your finances with precision - income, expenses, and seasonal forecasts'
            }
          </p>
        </div>

        {/* Résumé financier */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-800/90 to-emerald-800/90 border-0 shadow-2xl">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">
                {formatCurrency(incomeData.monthlyIncome)}
              </div>
              <div className="text-sm text-green-200">
                {isFrench ? 'Revenus mensuels' : 'Monthly Income'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-800/90 to-pink-800/90 border-0 shadow-2xl">
            <CardContent className="p-6 text-center">
              <TrendingDown className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-400">
                {formatCurrency(monthlyExpenses)}
              </div>
              <div className="text-sm text-red-200">
                {isFrench ? 'Dépenses mensuelles' : 'Monthly Expenses'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-800/90 to-indigo-800/90 border-0 shadow-2xl">
            <CardContent className="p-6 text-center">
              <Calculator className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${getAmountColor(netCashFlow)}`}>
                {formatCurrency(netCashFlow)}
              </div>
              <div className="text-sm text-blue-200">
                {isFrench ? 'Flux net mensuel' : 'Net Monthly Flow'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-800/90 to-violet-800/90 border-0 shadow-2xl">
            <CardContent className="p-6 text-center">
              <PiggyBank className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">
                {formatCurrency(budgetData.currentBalance)}
              </div>
              <div className="text-sm text-purple-200">
                {isFrench ? 'Solde actuel' : 'Current Balance'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertes budgétaires */}
        {netCashFlow < 0 && (
          <Alert className="border-red-400 bg-red-900/20 text-red-200 mb-8">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <AlertDescription>
              <strong>{isFrench ? 'Attention :' : 'Warning:'}</strong> {
                isFrench 
                  ? `Votre flux de trésorerie est négatif de ${formatCurrency(Math.abs(netCashFlow))} par mois. Révisez vos dépenses ou augmentez vos revenus.`
                  : `Your cash flow is negative by ${formatCurrency(Math.abs(netCashFlow))} per month. Review your expenses or increase your income.`
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Onglets principaux */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-slate-800/50 backdrop-blur-sm">
            <TabsTrigger value="overview">{isFrench ? 'Vue d\'ensemble' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="expenses">{isFrench ? 'Dépenses' : 'Expenses'}</TabsTrigger>
            <TabsTrigger value="calendar">{isFrench ? 'Calendrier' : 'Calendar'}</TabsTrigger>
            <TabsTrigger value="coastfire">{isFrench ? 'CoastFIRE' : 'CoastFIRE'}</TabsTrigger>
            <TabsTrigger value="tips">{isFrench ? '99 Trucs' : '99 Tips'}</TabsTrigger>
            <TabsTrigger value="learning">{isFrench ? 'Apprentissage' : 'Learning'}</TabsTrigger>
            <TabsTrigger value="settings">{isFrench ? 'Paramètres' : 'Settings'}</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique des catégories */}
              <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-blue-300 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {isFrench ? 'Dépenses par catégorie' : 'Expenses by Category'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expenseCategories.map(category => {
                      const categoryExpenses = budgetData.expenses
                        .filter(e => e.isActive && e.category === category.value)
                        .reduce((sum, e) => {
                          const freq = frequencies.find(f => f.value === e.frequency);
                          if (!freq) return sum;
                          return sum + (e.frequency === 'seasonal' ? e.amount / 12 : (e.amount * freq.multiplier) / 12);
                        }, 0);

                      const percentage = monthlyExpenses > 0 ? (categoryExpenses / monthlyExpenses) * 100 : 0;

                      return (
                        <div key={category.value} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                            <span className="text-sm text-gray-300">{category.label}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-white">
                              {formatCurrency(categoryExpenses)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Prévisions */}
              <Card className="bg-gradient-to-br from-indigo-800/90 to-purple-800/90 border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-indigo-300 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {isFrench ? 'Prévisions financières' : 'Financial Forecasts'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{isFrench ? 'Dans 3 mois' : 'In 3 months'}</span>
                      <span className={`font-bold ${getAmountColor(budgetData.currentBalance + (netCashFlow * 3))}`}>
                        {formatCurrency(budgetData.currentBalance + (netCashFlow * 3))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{isFrench ? 'Dans 6 mois' : 'In 6 months'}</span>
                      <span className={`font-bold ${getAmountColor(budgetData.currentBalance + (netCashFlow * 6))}`}>
                        {formatCurrency(budgetData.currentBalance + (netCashFlow * 6))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{isFrench ? 'Dans 1 an' : 'In 1 year'}</span>
                      <span className={`font-bold ${getAmountColor(budgetData.currentBalance + (netCashFlow * 12))}`}>
                        {formatCurrency(budgetData.currentBalance + (netCashFlow * 12))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gestion des dépenses */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-300">
                {isFrench ? 'Gestion des dépenses' : 'Expense Management'}
              </h2>
              <Button
                onClick={addExpense}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isFrench ? 'Ajouter une dépense' : 'Add Expense'}
              </Button>
            </div>

            {/* Liste des dépenses */}
            <div className="space-y-4">
              {budgetData.expenses.map(expense => {
                const category = expenseCategories.find(c => c.value === expense.category);
                const isEditing = editingExpense === expense.id;

                return (
                  <Card key={expense.id} className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 border-0 shadow-xl">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Catégorie */}
                        <div className="col-span-2">
                          {isEditing ? (
                            <Select
                              value={expense.category}
                              onValueChange={(value) => updateExpense(expense.id, { category: value as any })}
                            >
                              <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-700 border-slate-600">
                                {expenseCategories.map(cat => (
                                  <SelectItem key={cat.value} value={cat.value}>
                                    <div className="flex items-center gap-2">
                                      {cat.icon}
                                      {cat.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-center gap-2">
                              {category?.icon}
                              <span className="text-sm text-white">{category?.label}</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <div className="col-span-3">
                          {isEditing ? (
                            <Input
                              value={expense.description}
                              onChange={(e) => updateExpense(expense.id, { description: e.target.value })}
                              className="bg-slate-600 border-slate-500 text-white"
                              placeholder={isFrench ? 'Description...' : 'Description...'}
                            />
                          ) : (
                            <div>
                              <div className="text-sm font-medium text-white">{expense.description}</div>
                              <div className="text-xs text-gray-400">{expense.subcategory}</div>
                            </div>
                          )}
                        </div>

                        {/* Montant */}
                        <div className="col-span-2">
                          {isEditing ? (
                            <MoneyInput
                              value={expense.amount}
                              onChange={(value) => updateExpense(expense.id, { amount: value })}
                              className="bg-slate-600 border-slate-500 text-white"
                              placeholder="0"
                              allowDecimals={true}
                            />
                          ) : (
                            <span className="text-sm font-medium text-white">
                              {formatCurrency(expense.amount)}
                            </span>
                          )}
                        </div>

                        {/* Fréquence */}
                        <div className="col-span-2">
                          {isEditing ? (
                            <Select
                              value={expense.frequency}
                              onValueChange={(value) => updateExpense(expense.id, { frequency: value as any })}
                            >
                              <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-700 border-slate-600">
                                {frequencies.map(freq => (
                                  <SelectItem key={freq.value} value={freq.value}>
                                    {freq.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-sm text-gray-300">
                              {frequencies.find(f => f.value === expense.frequency)?.label}
                            </span>
                          )}
                        </div>

                        {/* Date de paiement */}
                        <div className="col-span-1">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={expense.paymentDate || ''}
                              onChange={(e) => updateExpense(expense.id, { paymentDate: Number(e.target.value) })}
                              className="bg-slate-600 border-slate-500 text-white"
                              placeholder="1"
                              min="1"
                              max="31"
                            />
                          ) : (
                            <span className="text-sm text-gray-300">
                              {expense.paymentDate || '-'}
                            </span>
                          )}
                        </div>

                        {/* Statut */}
                        <div className="col-span-1">
                          <button
                            onClick={() => updateExpense(expense.id, { isActive: !expense.isActive })}
                            title={expense.isActive ? (isFrench ? 'Désactiver cette dépense' : 'Deactivate this expense') : (isFrench ? 'Activer cette dépense' : 'Activate this expense')}
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              expense.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-300'
                            }`}
                          >
                            {expense.isActive ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex gap-1">
                          <button
                            onClick={() => setEditingExpense(isEditing ? null : expense.id)}
                            title={isEditing ? (isFrench ? 'Arrêter l\'édition' : 'Stop editing') : (isFrench ? 'Modifier cette dépense' : 'Edit this expense')}
                            className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeExpense(expense.id)}
                            title={isFrench ? 'Supprimer cette dépense' : 'Delete this expense'}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Calendrier des paiements */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-300">
                {isFrench ? 'Calendrier des paiements' : 'Payment Calendar'}
              </h2>
              <div className="flex gap-4">
                <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number(value))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {new Date(2024, i, 1).toLocaleDateString(isFrench ? 'fr-CA' : 'en-CA', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {Array.from({ length: 5 }, (_, i) => (
                      <SelectItem key={i} value={(new Date().getFullYear() + i).toString()}>
                        {new Date().getFullYear() + i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Calendrier mensuel */}
            <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-300 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {new Date(selectedYear, selectedMonth, 1).toLocaleDateString(isFrench ? 'fr-CA' : 'en-CA', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-400 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
                    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
                    const dayNumber = i - firstDay + 1;
                    const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
                    
                    const dayExpenses = budgetData.expenses.filter(expense => 
                      expense.isActive && expense.paymentDate === dayNumber
                    );
                    
                    return (
                      <div key={i} className={`p-2 min-h-[80px] border border-slate-600 rounded ${
                        isValidDay ? 'bg-slate-700/50' : 'bg-slate-800/30'
                      }`}>
                        {isValidDay && (
                          <>
                            <div className="text-sm font-medium text-white mb-1">{dayNumber}</div>
                            {dayExpenses.map(expense => (
                              <div key={expense.id} className="text-xs bg-blue-600 text-white px-1 py-0.5 rounded mb-1 truncate">
                                {expense.description || expense.subcategory}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CoastFIRE Calculator */}
          <TabsContent value="coastfire" className="space-y-6">
            <CoastFIRECalculator />
          </TabsContent>

          {/* 99 Trucs pour économiser */}
          <TabsContent value="tips" className="space-y-6">
            <EconomyTipsGuide />
          </TabsContent>

          {/* Module d'apprentissage */}
          <TabsContent value="learning" className="space-y-6">
            <LearningModule 
              moduleId="budget-basics"
              onComplete={() => {
                console.log('Module budget-basics complété');
              }}
              onClose={() => {
                console.log('Module fermé');
              }}
            />
          </TabsContent>

          {/* Paramètres */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Solde bancaire */}
              <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-blue-300 flex items-center gap-2">
                    <PiggyBank className="w-5 h-5" />
                    {isFrench ? 'Solde bancaire' : 'Bank Balance'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-200 font-semibold">
                      {isFrench ? 'Solde actuel' : 'Current Balance'}
                    </Label>
                    <MoneyInput
                      value={budgetData.currentBalance}
                      onChange={(value) => setBudgetData(prev => ({ ...prev, currentBalance: value }))}
                      className="bg-slate-600 border-slate-500 text-white mt-2"
                      placeholder="0"
                      allowDecimals={true}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-200 font-semibold">
                      {isFrench ? 'Date du solde' : 'Balance Date'}
                    </Label>
                    <DateInput
                      value={budgetData.balanceDate}
                      onChange={(value) => setBudgetData(prev => ({ ...prev, balanceDate: value }))}
                      className="bg-slate-600 border-slate-500 text-white mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Objectifs d'épargne */}
              <Card className="bg-gradient-to-br from-indigo-800/90 to-purple-800/90 border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-indigo-300 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {isFrench ? 'Objectifs d\'épargne' : 'Savings Goals'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-200 font-semibold">
                      {isFrench ? 'Objectif d\'épargne mensuel' : 'Monthly Savings Goal'}
                    </Label>
                    <MoneyInput
                      value={budgetData.savingsGoal}
                      onChange={(value) => setBudgetData(prev => ({ ...prev, savingsGoal: value }))}
                      className="bg-slate-600 border-slate-500 text-white mt-2"
                      placeholder="0"
                      allowDecimals={true}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-200 font-semibold">
                      {isFrench ? 'Fonds d\'urgence cible' : 'Emergency Fund Target'}
                    </Label>
                    <MoneyInput
                      value={budgetData.emergencyFund}
                      onChange={(value) => setBudgetData(prev => ({ ...prev, emergencyFund: value }))}
                      className="bg-slate-600 border-slate-500 text-white mt-2"
                      placeholder="0"
                      allowDecimals={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bouton de sauvegarde */}
        <div className="text-center mt-12">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white font-bold text-2xl py-6 px-12 shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-8 h-8 mr-4 animate-pulse" />
            {isSaving 
              ? (isFrench ? '💾 SAUVEGARDE...' : '💾 SAVING...')
              : (isFrench ? '💾 SAUVEGARDER BUDGET' : '💾 SAVE BUDGET')
            }
          </Button>
          <p className="text-gray-300 mt-4 text-lg">
            {isFrench 
              ? '✨ Votre budget intelligent est sécurisé!'
              : '✨ Your smart budget is secure!'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Budget;
