import React, { useState, useEffect, lazy, Suspense } from 'react';

/* CSS pour disposition 3 colonnes des dépenses */
const expenseStyles = `
.senior-expense-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 16px;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  min-height: 48px;
  font-size: 18px;
}

.senior-expense-category {
  display: flex;
  align-items: center;
  gap: 12px;
}

.senior-expense-icon {
  font-size: 16px;
  min-width: 20px;
}

.senior-expense-label {
  font-weight: 500;
  color: #1a365d;
}

.senior-expense-amount {
  font-weight: 600;
  color: #1a365d;
  text-align: right;
  min-width: 80px;
}

.senior-expense-percentage {
  font-size: 16px;
  color: #4a5568;
  text-align: right;
  min-width: 60px;
}

@media (max-width: 768px) {
  .senior-expense-row {
    grid-template-columns: 1fr auto auto;
    gap: 12px;
    padding: 16px 12px;
  }
}
`;
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { IncomeIntegrationService } from '@/services/IncomeIntegrationService';
import { useAuth } from '@/hooks/useAuth';
import { checkFeatureAccess, getRequiredPlanForFeature, getContextualUpgradeMessage } from '@/config/plans';
import { PromoCodeService } from '@/services/promoCodeService';
import { usePromoCode } from '@/hooks/usePromoCode';
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
  ArrowRight,
  Download
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
import { BudgetComputationService } from '@/services/BudgetComputationService';
import { formatCurrencyLocale, formatPercentLocale, formatCurrencyOQLF, formatPercentOQLF } from '@/utils/localeFormat';
import { BudgetSettings, BudgetTargets } from '@/types/budget';
import BudgetLinkService, { BudgetLink } from '@/services/BudgetLinkService';
import { useSearchParams } from 'react-router-dom';
import { NotificationSchedulerService } from '@/services/NotificationSchedulerService';

const IncomeDeductionsForm = lazy(() => import('@/components/budget/IncomeDeductionsForm'));
const BudgetTargetsGauges = lazy(() => import('@/components/budget/BudgetTargetsGauges'));
const EmergencyFundCard = lazy(() => import('@/components/budget/EmergencyFundCard'));
const SinkingFundsManager = lazy(() => import('@/components/budget/SinkingFundsManager'));
const DebtSnowballWizard = lazy(() => import('@/components/budget/DebtSnowballWizard'));
const ContextualTipsPanel = lazy(() => import('@/components/budget/ContextualTipsPanel'));

// Types pour le budget
interface ExpenseEntry {
  id: string;
  category: 'logement' | 'services' | 'transport' | 'alimentation' | 'sante' | 'loisirs' | 'epargne' | 'divers';
  subcategory: string;
  description: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually' | 'seasonal';
  /** Part de besoin (%) pour zones grises (0-100). Si non défini, dérivé de la catégorie par défaut. */
  needSharePct?: number;
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
  // Injecter les styles CSS pour les dépenses
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = expenseStyles;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const { language } = useLanguage();
  const { userData, updateUserData } = useRetirementData();
  const { user } = useAuth();
  const { appliedCode } = usePromoCode();
  const isFrench = language === 'fr';

  const [budgetData, setBudgetData] = useState<BudgetData>({
    currentBalance: 0,
    balanceDate: new Date().toISOString().split('T')[0],
    expenses: [],
    savingsGoal: 0,
    emergencyFund: 0
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Vérifier l'accès au Module Budget avec considération des codes promo
  const userPlan = user?.subscription?.plan || 'free';
  const effectivePlan = PromoCodeService.getEffectivePlan(userPlan, appliedCode || '');
  const hasAccess = checkFeatureAccess('hasBudgetModule', effectivePlan);
  const requiredPlan = getRequiredPlanForFeature('hasBudgetModule');
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Nouveau: paramètres revenus/déductions et cibles 50/30/20
  const [budgetSettings, setBudgetSettings] = useState<BudgetSettings>({
    netIncomeMethod: 'regular',
    deductions: [],
    targets: { needsPct: 50, wantsPct: 30, savingsDebtPct: 20 },
    lastUpdated: new Date().toISOString()
  });
  const [budgetTargets, setBudgetTargets] = useState<BudgetTargets>({ needsPct: 50, wantsPct: 30, savingsDebtPct: 20 });
  const [budgetLinks, setBudgetLinks] = useState<BudgetLink[]>([]);
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');

  // Valeur nette (actifs/passifs) + snapshots mensuels
  const [netWorth, setNetWorth] = useState<{
    assets: { cash: number; investments: number; realEstate: number; other: number };
    liabilities: { mortgage: number; auto: number; credit: number; student: number; other: number };
  }>({
    assets: { cash: 0, investments: 0, realEstate: 0, other: 0 },
    liabilities: { mortgage: 0, auto: 0, credit: 0, student: 0, other: 0 }
  });
  const [netWorthSnapshots, setNetWorthSnapshots] = useState<{ date: string; assets: number; liabilities: number; net: number }[]>([]);
  const [smartGoals, setSmartGoals] = useState<any[]>([]);
  const [smartDraft, setSmartDraft] = useState<{ title: string; measure: string; target: number; deadline: string; relevance: string }>({
    title: '',
    measure: '',
    target: 0,
    deadline: '',
    relevance: ''
  });

  // Importer automatiquement les catégories principales de la page Dépenses (cashflow) dans le Budget
  const importFromCashflow = () => {
    const cf = (userData as any)?.cashflow;
    if (!cf) {
      console.warn('Aucune donnée "cashflow" trouvée dans userData');
      return;
    }

    const include = (cf as any)?.includeFlags || {};
    const isIncluded = (key: string) => include[key] !== false;

    const newExpenses = [...budgetData.expenses];
    const newLinks = [...budgetLinks];

    const alreadyLinked = (sourceId: string) =>
      newLinks.some(l => l.sourceType === 'expense' && l.sourceId === sourceId);

    const addIf = (
      key: string,
      category: ExpenseEntry['category'],
      subcategory: string,
      description: string
    ) => {
      if (!isIncluded(key)) return;
      const sourceId = `cashflow:${key}`;
      const amount = Number(cf[key] || 0);
      if (!amount || amount <= 0) return;
      if (alreadyLinked(sourceId)) return;

      const id = `expense-${key}-${Date.now()}`;
      newExpenses.push({
        id,
        category,
        subcategory,
        description,
        amount,
        frequency: 'monthly',
        paymentDate: 1,
        isActive: true,
        isFixed: true
      });
      newLinks.push({ budgetItemId: id, sourceType: 'expense', sourceId });
    };

    // Mappage cashflow -> catégories Budget
    addIf('logement', 'logement', 'Hypothèque/Loyer', isFrench ? 'Logement' : 'Housing');
    addIf('servicesPublics', 'services', isFrench ? 'Services publics' : 'Utilities', isFrench ? 'Services publics' : 'Utilities');
    addIf('assurances', 'divers', isFrench ? 'Assurances' : 'Insurance', isFrench ? 'Assurances' : 'Insurance');
    addIf('telecom', 'services', isFrench ? 'Télécommunications' : 'Telecommunications', isFrench ? 'Télécommunications' : 'Telecommunications');
    addIf('alimentation', 'alimentation', isFrench ? 'Épicerie' : 'Groceries', isFrench ? 'Alimentation' : 'Food');
    addIf('transport', 'transport', isFrench ? 'Transport' : 'Transport', isFrench ? 'Transport' : 'Transport');
    addIf('sante', 'sante', isFrench ? 'Santé' : 'Health', isFrench ? 'Santé' : 'Health');
    addIf('loisirs', 'loisirs', isFrench ? 'Loisirs' : 'Leisure', isFrench ? 'Loisirs' : 'Leisure');

    setBudgetData(prev => ({ ...prev, expenses: newExpenses }));
    setBudgetLinks(newLinks);
  };

  // Catégories de dépenses avec icônes et couleurs
  const expenseCategories = [
    {
      value: 'logement',
      label: isFrench ? 'Logement' : 'Housing',
      icon: <Home className="w-4 h-4" />,
      color: 'bg-mpr-interactive',
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
      color: 'bg-mpr-navy',
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

  // Historique de revenu net mensuel agrégé pour gérer les revenus irréguliers
  const getBudgetIncomeHistory = (): Record<string, number> => {
    return ((userData.personal as any)?.budgetIncomeHistory) || {};
  };

  const computeNetMonthlyIncome = (): number => {
    const base = (budgetSettings.netIncome ?? incomeData.monthlyIncome) || 0;
    const method = budgetSettings.netIncomeMethod || 'regular';
    const history = getBudgetIncomeHistory();

    if (method === 'regular') return base;

    // Extraire les 12 derniers mois si disponibles
    const keys = Object.keys(history).filter(k => /^\d{4}-\d{2}$/.test(k)).sort(); // tri lexicographique YYYY-MM
    const last12Keys = keys.slice(-12);
    const values = (last12Keys.length ? last12Keys : keys)
      .map(k => Number(history[k]))
      .filter(v => Number.isFinite(v) && v > 0);

    if (values.length === 0) return base;

    if (method === 'avg12') {
      const arr = values.slice(-12); // au plus 12 valeurs
      const avg = arr.reduce((s, v) => s + v, 0) / arr.length;
      return Math.round(avg);
    }

    if (method === 'lowestMonth') {
      const min = Math.min(...values);
      return Math.round(min);
    }

    return base;
  };

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

    // Propagation (MVP) vers la source si l'item est lié à une catégorie cashflow
    const link = budgetLinks.find(l => l.budgetItemId === id && l.sourceType === 'expense' && l.sourceId.startsWith('cashflow:'));
    if (link) {
      const key = link.sourceId.replace('cashflow:', '');
      // Demande simple à l'utilisateur (UX seniors: confirmation explicite)
      const apply = window.confirm(
        isFrench
          ? `Cet élément est lié à la catégorie "${key}" dans la section Dépenses. Appliquer cette modification à la source ?`
          : `This item is linked to "${key}" category in Expenses. Apply this change to the source?`
      );
      if (apply) {
        // Calculer le montant mensuel en fonction de la fréquence (si fournie dans updates)
        const targetExpense = budgetData.expenses.find(e => e.id === id);
        const freqValue = updates.frequency || targetExpense?.frequency || 'monthly';
        const amountValue = updates.amount ?? targetExpense?.amount ?? 0;
        const freqDef = frequencies.find(f => f.value === freqValue);
        const monthly = freqValue === 'seasonal'
          ? amountValue / 12
          : ((amountValue || 0) * (freqDef?.multiplier || 12)) / 12;

        // Appliquer à userData.cashflow[key]
        try {
          updateUserData('cashflow', { [key]: Math.max(0, Math.round(monthly)) } as any);
          console.log('?? Budget sauvegard� avec succ�s:', result.filename);
        } catch (e) {
          console.error('❌ Erreur de propagation vers cashflow:', e);
        }
      }
    }
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
    // OQLF: en français, utiliser l’espace insécable avant le $
    return isFrench ? formatCurrencyOQLF(amount, { min: 0, max: 2 }) : formatCurrencyLocale(amount, 'en');
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
      // Mettre à jour l'historique de revenu net mensuel (YYYY-MM -> montant)
      try {
        const now = new Date();
        const ymKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const prevHistory = ((userData.personal as any)?.budgetIncomeHistory) || {};
        const updatedHistory = { ...prevHistory, [ymKey]: netMonthlyIncome };

        // Mettre à jour/capturer un snapshot de valeur nette pour le mois courant
        const nwAssets = (netWorth.assets.cash || 0) + (netWorth.assets.investments || 0) + (netWorth.assets.realEstate || 0) + (netWorth.assets.other || 0);
        const nwLiab = (netWorth.liabilities.mortgage || 0) + (netWorth.liabilities.auto || 0) + (netWorth.liabilities.credit || 0) + (netWorth.liabilities.student || 0) + (netWorth.liabilities.other || 0);
        const nwNet = nwAssets - nwLiab;
        const prevSnapshots = ((userData.personal as any)?.netWorthSnapshots || []) as typeof netWorthSnapshots;
        const others = prevSnapshots.filter(s => s.date.slice(0, 7) !== ymKey);
        const nextSnapshots = [...others, { date: new Date().toISOString(), assets: nwAssets, liabilities: nwLiab, net: nwNet }]
          .sort((a, b) => a.date.localeCompare(b.date));

        updateUserData('personal', { budgetData, budgetSettings, budgetLinks, netWorth, netWorthSnapshots: nextSnapshots, budgetIncomeHistory: updatedHistory } as any);
      } catch {
        // Fallback si échec: sauvegarde sans historique
        updateUserData('personal', { budgetData, budgetSettings, budgetLinks, netWorth, netWorthSnapshots } as any);
      }
      
      const result = await EnhancedSaveManager.saveWithDialog({...userData, personal: {...userData.personal, budgetData, budgetSettings, budgetLinks, netWorth, netWorthSnapshots}}, { includeTimestamp: true });
      
      if (result.success) {
        console.log('?? Budget sauvegard� avec succ�s:', result.filename);
        // Gamification: journaliser et récompenser l'action
        try {
          const g = GamificationService.getInstance();
          g.logActivity('budget_created');
          g.addPoints(20, isFrench ? 'Budget sauvegardé' : 'Budget saved');
          // Succès: Fonds d'urgence complété si la cible est atteinte
          const monthsTarget = budgetSettings.emergencyMonthsTarget ?? 0;
          if (monthsTarget > 0 && allocations.totalNeeds > 0) {
            const monthsSaved = (budgetData.emergencyFund || 0) / allocations.totalNeeds;
            if (monthsSaved >= monthsTarget) {
              g.updateAchievementProgress('emergency-fund-complete', 1);
            }
          }
        } catch (e) {
          console.warn('Gamification non appliquée:', e);
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du budget:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const { PDFExportService } = await import('@/services/PDFExportService');
      const blob = await PDFExportService.generateBudgetReport(isFrench ? 'fr' : 'en', {
        netMonthlyIncome,
        allocations,
        targets: budgetTargets,
        emergencyMonthsTarget: budgetSettings.emergencyMonthsTarget ?? 0,
        emergencySaved: budgetData.emergencyFund ?? 0,
        sinkingFunds: budgetSettings.sinkingFunds ?? [],
        debt: budgetSettings.debtSnowball,
        reportTitle: isFrench ? 'Budget personnel' : 'Personal Budget'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = isFrench ? 'Budget-personnel.pdf' : 'Personal-Budget.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('❌ Export PDF échoué:', e);
      alert(isFrench ? 'Erreur lors de la génération du PDF' : 'Error generating PDF');
    }
  };

  // Export CSV des agrégats (mensuel/annuel) par catégorie
  const handleExportCSV = () => {
    try {
      const period = viewMode === 'annual' ? (isFrench ? 'Annuel' : 'Annual') : (isFrench ? 'Mensuel' : 'Monthly');

      const rows = expenseCategories.map(category => {
        const monthly = (budgetData.expenses || [])
          .filter(e => e.isActive && e.category === (category as any).value)
          .reduce((sum, e) => {
            const freq = frequencies.find(f => f.value === e.frequency);
            if (!freq) return sum;
            const m = e.frequency === 'seasonal'
              ? (e.amount || 0) / 12
              : ((e.amount || 0) * (freq.multiplier)) / 12;
            return sum + m;
          }, 0);
        const amount = viewMode === 'annual' ? monthly * 12 : monthly;
        return { category: (category as any).label as string, amount };
      });

      const total = rows.reduce((s, r) => s + r.amount, 0);

      const header = isFrench ? 'Catégorie,Montant,Période' : 'Category,Amount,Period';
      const lines = [header, ...rows.map(r => {
        const cat = `"${(r.category || '').replace(/"/g, '""')}"`;
        // Valeurs numériques en point décimal pour CSV standard
        return `${cat},${r.amount.toFixed(2)},${period}`;
      }), `${isFrench ? '"Total"' : '"Total"'},${total.toFixed(2)},${period}`];

      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = (isFrench ? 'budget_' : 'budget_') + (viewMode === 'annual' ? (isFrench ? 'annuel_' : 'annual_') : (isFrench ? 'mensuel_' : 'monthly_')) + date + '.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('❌ Export CSV échoué:', e);
      alert(isFrench ? 'Erreur lors de l’export CSV' : 'Error during CSV export');
    }
  };

  // Rappels budgétaires (90/60/30 pour objectifs + fin de mois)
  const scheduleAllSinkingReminders = () => {
    try {
      const scenarioId = ((userData.personal as any)?.activeScenarioId) || 'budget-default';
      const funds = budgetSettings.sinkingFunds ?? [];
      let scheduled = 0;
      for (const f of funds) {
        const dueISO = (f as any)?.dueDate?.slice(0, 10);
        if (!dueISO) continue;
        try {
          NotificationSchedulerService.scheduleWithdrawalNotice(scenarioId, dueISO, {
            leads: [90, 60, 30],
            channels: ['inapp'],
            titleOverride: isFrench ? 'Rappel objectif planifié' : 'Planned goal reminder',
            messageOverride: isFrench ? `Préparez: ${f.name} (échéance ${dueISO})` : `Prepare: ${f.name} (due ${dueISO})`
          });
          scheduled++;
        } catch (err) {
          console.error('Schedule fund reminder error:', err);
        }
      }
      if (scheduled > 0) {
        alert(isFrench ? `Rappels programmés pour ${scheduled} objectif(s).` : `Scheduled reminders for ${scheduled} goal(s).`);
      } else {
        alert(isFrench ? 'Aucun objectif avec date valide.' : 'No goals with valid dates.');
      }
    } catch (e) {
      console.error('❌ Échec planification rappels objectifs:', e);
      alert(isFrench ? 'Erreur de planification des rappels' : 'Error scheduling reminders');
    }
  };

  const scheduleEndOfMonthReminders = () => {
    try {
      const scenarioId = ((userData.personal as any)?.activeScenarioId) || 'budget-default';
      const today = new Date();
      const eom = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const targetISO = eom.toISOString().slice(0, 10);
      NotificationSchedulerService.scheduleSeries({
        type: 'WITHDRAWAL_NOTICE',
        scenarioId,
        targetDate: targetISO,
        options: {
          leads: [7, 1],
          channels: ['inapp'],
          titleOverride: isFrench ? 'Rappel fin de mois (Budget)' : 'Month-end reminder (Budget)',
          messageOverride: isFrench ? 'Révisez vos dépenses et sauvegardez votre budget.' : 'Review expenses and save your budget.'
        }
      });
      alert(isFrench ? 'Rappels fin de mois programmés (J-7 et J-1).' : 'Month-end reminders scheduled (D-7 and D-1).');
    } catch (e) {
      console.error('❌ Échec planification EOM:', e);
      alert(isFrench ? 'Erreur lors de la planification fin de mois' : 'Error scheduling month-end reminders');
    }
  };

  // SMART goals handlers
  const saveSmartGoal = () => {
    const draft = smartDraft;
    if (!draft.title || !draft.deadline) {
      alert(isFrench ? 'Titre et échéance requis.' : 'Title and deadline are required.');
      return;
    }
    const goal = { id: `sg-${Date.now()}`, ...draft };
    const next = [...smartGoals, goal];
    setSmartGoals(next);
    try {
      updateUserData('personal', { smartGoals: next } as any);
    } catch (e) {
      console.error('❌ Sauvegarde SMART échouée:', e);
    }
    try {
      const g = GamificationService.getInstance();
      g.logActivity('goal_created', { title: draft.title, deadline: draft.deadline });
      g.addPoints(30, isFrench ? 'Objectif SMART créé' : 'SMART goal created');
    } catch {}
    setSmartDraft({ title: '', measure: '', target: 0, deadline: '', relevance: '' });
  };

  const removeSmartGoal = (id: string) => {
    const next = smartGoals.filter((g) => g.id !== id);
    setSmartGoals(next);
    try {
      updateUserData('personal', { smartGoals: next } as any);
    } catch (e) {
      console.error('❌ Suppression SMART échouée:', e);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    const savedBudgetData = (userData.personal as any)?.budgetData;
    if (savedBudgetData) {
      setBudgetData(savedBudgetData);
    }
    const savedBudgetSettings = (userData.personal as any)?.budgetSettings;
    if (savedBudgetSettings) {
      setBudgetSettings(savedBudgetSettings);
    }
    const savedLinks = (userData.personal as any)?.budgetLinks;
    if (savedLinks) {
      setBudgetLinks(savedLinks);
    }
    const savedNW = (userData.personal as any)?.netWorth;
    if (savedNW) {
      setNetWorth(savedNW);
    }
    const savedNWS = (userData.personal as any)?.netWorthSnapshots;
    if (savedNWS) {
      setNetWorthSnapshots(savedNWS);
    }
    const savedSG = (userData.personal as any)?.smartGoals;
    if (savedSG) {
      setSmartGoals(savedSG);
    }
  }, [userData]);

  const monthlyExpenses = calculateMonthlyExpenses();
  const netCashFlow = calculateNetCashFlow();

  // Nouveau: revenu net mensuel et allocations 50/30/20
  const netMonthlyIncome = computeNetMonthlyIncome();
  const allocations = BudgetComputationService.computeAllocations(budgetData as any, netMonthlyIncome);
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') ?? 'overview';

  // Si l'utilisateur n'a pas accès, afficher le message d'upgrade
  if (!hasAccess) {
    return (
      <>
        <div className="mpr-container min-h-screen">
          <div className="mpr-container">
            <div className="mpr-section text-center">
              <div className="flex justify-center mb-6">
                <div className="senior-btn senior-btn-primary">
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

              <div className="mpr-form-row cols-auto">
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
    <div className="senior-layout min-h-screen bg-gradient-to-br from-slate-50 via-mpr-bg-section to-mpr-bg-section text-gray-900">
      {/* Particules de fond */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-mpr-interactive/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-mpr-navy/30 rounded-full animate-bounce"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-purple-300 rounded-full animate-ping"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-cyan-300 rounded-full animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">

        {/* En-tête spectaculaire */}
        <div className="mpr-section text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-mpr-interactive via-mpr-navy to-purple-400 bg-clip-text text-transparent drop-shadow-2xl" style={{fontSize: '3.5rem'}}>
            💰 {isFrench ? 'Mon budget intelligent' : 'My Smart Budget'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed" style={{fontSize: '1.375rem'}}>
            {isFrench 
              ? 'Gérez vos finances avec précision - revenus, dépenses, et prévisions saisonnières'
              : 'Manage your finances with precision - income, expenses, and seasonal forecasts'
            }
          </p>
        </div>

        {/* Résumé financier */}
        <div className="mpr-form-row cols-4">
          <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700" style={{fontSize: '1.5rem'}}>
                {formatCurrency(incomeData.monthlyIncome)}
              </div>
              <div className="text-lg text-green-600" style={{fontSize: '1.125rem'}}>
                {isFrench ? 'Revenus mensuels' : 'Monthly Income'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-100 to-pink-100 border-2 border-red-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-700" style={{fontSize: '1.5rem'}}>
                {formatCurrency(monthlyExpenses)}
              </div>
              <div className="text-lg text-red-600" style={{fontSize: '1.125rem'}}>
                {isFrench ? 'Dépenses mensuelles' : 'Monthly Expenses'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-mpr-interactive-lt to-mpr-interactive-lt border-2 border-mpr-border shadow-lg">
            <CardContent className="p-6 text-center">
              <Calculator className="w-8 h-8 text-mpr-interactive mx-auto mb-2" />
              <div className={`text-2xl font-bold ${getAmountColor(netCashFlow)}`}>
                {formatCurrency(netCashFlow)}
              </div>
              <div className="text-lg text-mpr-interactive" style={{fontSize: '1.125rem'}}>
                {isFrench ? 'Flux net mensuel' : 'Net Monthly Flow'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-100 to-violet-100 border-2 border-purple-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <PiggyBank className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700" style={{fontSize: '1.5rem'}}>
                {formatCurrency(budgetData.currentBalance)}
              </div>
              <div className="text-lg text-purple-600" style={{fontSize: '1.125rem'}}>
                {isFrench ? 'Solde actuel' : 'Current Balance'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertes budgétaires */}
        {netCashFlow < 0 && (
          <Alert className="border-red-300 bg-red-50 text-red-800 mb-8">
            <AlertTriangle className="h-5 w-5 text-red-600" />
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
        <Tabs defaultValue={initialTab} className="mpr-form">
          <TabsList className="w-full flex flex-wrap gap-2 gap-y-2 bg-slate-100 backdrop-blur-sm border border-slate-300 p-2 rounded-md h-auto items-stretch overflow-visible">
            {/* ordre optimisé pour FR (libellés plus longs) */}
            <TabsTrigger value="overview" className="font-medium text-sm md:text-base leading-6 px-3 py-2 text-center whitespace-normal break-words max-w-[200px] sm:max-w-none">{isFrench ? 'Vue d\'ensemble' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="income" className="font-medium text-sm md:text-base leading-6 px-3 py-2 text-center whitespace-normal break-words max-w-[200px] sm:max-w-none">{isFrench ? 'Revenus et déductions' : 'Income and deductions'}</TabsTrigger>
            <TabsTrigger value="budgetRule" className="font-medium text-sm md:text-base leading-6 px-3 py-2 text-center whitespace-normal break-words max-w-[200px] sm:max-w-none">50/30/20</TabsTrigger>
            <TabsTrigger value="emergency" className="font-medium text-sm md:text-base leading-6 px-3 py-2 text-center whitespace-normal break-words max-w-[200px] sm:max-w-none">{isFrench ? 'Fonds d’urgence' : 'Emergency fund'}</TabsTrigger>
            <TabsTrigger value="sinking" className="font-medium text-sm md:text-base leading-6 px-3 py-2 text-center whitespace-normal break-words max-w-[220px] sm:max-w-none">{isFrench ? 'Objectifs planifiés' : 'Planned goals'}</TabsTrigger>
            <TabsTrigger value="debts" className="font-medium text-sm md:text-base leading-6 px-3 py-2 text-center whitespace-normal break-words max-w-[200px] sm:max-w-none">{isFrench ? 'Dettes' : 'Debts'}</TabsTrigger>
            <TabsTrigger value="expenses" className="font-medium text-sm md:text-base leading-6 px-3 py-2 text-center whitespace-normal break-words max-w-[200px] sm:max-w-none">{isFrench ? 'Dépenses' : 'Expenses'}</TabsTrigger>
            <TabsTrigger value="calendar" className="font-medium text-sm md:text-base leading-6 px-3 py-2 text-center whitespace-normal break-words max-w-[200px] sm:max-w-none">{isFrench ? 'Calendrier' : 'Calendar'}</TabsTrigger>
            <TabsTrigger value="coastfire" className="font-medium text-sm md:text-base leading-6 px-3 py-2 text-center whitespace-normal break-words max-w-[200px] sm:max-w-none">{isFrench ? 'Liberté financière' : 'CoastFIRE'}</TabsTrigger>
            <TabsTrigger value="tips" className="font-medium text-sm md:text-base leading-6 px-3 py-2 text-center whitespace-normal break-words max-w-[200px] sm:max-w-none">{isFrench ? '99 trucs' : '99 tips'}</TabsTrigger>
            <TabsTrigger value="learning" className="font-medium text-sm md:text-base leading-6 px-3 py-2 text-center whitespace-normal break-words max-w-[200px] sm:max-w-none">{isFrench ? 'Apprentissage' : 'Learning'}</TabsTrigger>
            <TabsTrigger value="networth" className="font-medium text-sm md:text-base leading-6 px-3 py-2 text-center whitespace-normal break-words max-w-[200px] sm:max-w-none">{isFrench ? 'Valeur nette' : 'Net worth'}</TabsTrigger>
            <TabsTrigger value="settings" className="font-medium text-sm md:text-base leading-6 px-3 py-2 text-center whitespace-normal break-words max-w-[200px] sm:max-w-none">{isFrench ? 'Paramètres' : 'Settings'}</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="mpr-form">
            <Suspense fallback={<div className="text-gray-600">{isFrench ? 'Chargement…' : 'Loading…'}</div>}>
              <ContextualTipsPanel
                language={isFrench ? 'fr' : 'en'}
                allocations={allocations}
                targets={budgetTargets}
                emergencyMonthsTarget={budgetSettings.emergencyMonthsTarget ?? 0}
                emergencySaved={budgetData.emergencyFund ?? 0}
                debtState={budgetSettings.debtSnowball}
                expenses={budgetData.expenses}
                sinkingFunds={budgetSettings.sinkingFunds ?? []}
              />
            </Suspense>
            <div className="mpr-form-row cols-2">
              {/* Graphique des catégories */}
              <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-mpr-navy flex items-center gap-2" style={{fontSize: '1.25rem'}}>
                    <BarChart3 className="w-5 h-5" />
                    {isFrench ? 'Dépenses par catégorie' : 'Expenses by Category'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="text-sm text-slate-600">
                      {isFrench ? (viewMode === 'annual' ? 'Vue annuelle' : 'Vue mensuelle') : (viewMode === 'annual' ? 'Annual view' : 'Monthly view')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={viewMode} onValueChange={(v) => setViewMode((v as 'monthly' | 'annual'))}>
                        <SelectTrigger className="bg-white border-slate-300 text-gray-900 w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-300">
                          <SelectItem value="monthly">{isFrench ? 'Mensuel' : 'Monthly'}</SelectItem>
                          <SelectItem value="annual">{isFrench ? 'Annuel' : 'Annual'}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" onClick={handleExportCSV} title={isFrench ? 'Exporter les agrégats en CSV' : 'Export aggregates as CSV'}>
                        {isFrench ? 'Exporter CSV' : 'Export CSV'}
                      </Button>
                    </div>
                  </div>
                  <div className="mpr-form">
                    {expenseCategories.map(category => {
                      const categoryExpenses = budgetData.expenses
                        .filter(e => e.isActive && e.category === category.value)
                        .reduce((sum, e) => {
                          const freq = frequencies.find(f => f.value === e.frequency);
                          if (!freq) return sum;
                          return sum + (e.frequency === 'seasonal' ? e.amount / 12 : (e.amount * freq.multiplier) / 12);
                        }, 0);

                      const percentage = monthlyExpenses > 0 ? (categoryExpenses / monthlyExpenses) * 100 : 0;

                      // Convertir l'icône colorée en emoji selon la catégorie
                      const getIconByCategory = (categoryValue: string) => {
                        switch(categoryValue) {
                          case 'logement': return '🏠';
                          case 'services': return '⚡';
                          case 'transport': return '🚗';
                          case 'alimentation': return '🍽️';
                          case 'sante': return '❤️';
                          case 'loisirs': return '🎮';
                          case 'epargne': return '🐷';
                          case 'divers': return '🛒';
                          default: return '💰';
                        }
                      };

                      return (
                        <div key={category.value} className="senior-expense-row">
                          <div className="senior-expense-category">
                            <span className="senior-expense-icon">{getIconByCategory(category.value)}</span>
                            <span className="senior-expense-label">{category.label}</span>
                          </div>
                          <div className="senior-expense-amount">
                            {formatCurrency(viewMode === 'annual' ? (categoryExpenses * 12) : categoryExpenses)}
                          </div>
                          <div className="senior-expense-percentage">
                            {isFrench
                              ? formatPercentOQLF(percentage, { min: 0, max: 1 })
                              : formatPercentLocale(percentage, 'en', { min: 0, max: 1 })
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Prévisions */}
              <Card className="bg-gradient-to-br from-mpr-interactive-lt to-mpr-interactive-lt border-2 border-mpr-border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-mpr-navy flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {isFrench ? 'Prévisions financières' : 'Financial Forecasts'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mpr-form">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{isFrench ? 'Dans 3 mois' : 'In 3 months'}</span>
                      <span className={`font-bold ${getAmountColor(budgetData.currentBalance + (netCashFlow * 3))}`}>
                        {formatCurrency(budgetData.currentBalance + (netCashFlow * 3))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{isFrench ? 'Dans 6 mois' : 'In 6 months'}</span>
                      <span className={`font-bold ${getAmountColor(budgetData.currentBalance + (netCashFlow * 6))}`}>
                        {formatCurrency(budgetData.currentBalance + (netCashFlow * 6))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{isFrench ? 'Dans 1 an' : 'In 1 year'}</span>
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
          <TabsContent value="expenses" className="mpr-form">
            {(() => {
              const linkedCount = budgetLinks.filter(l => l.sourceType === 'expense' && l.sourceId.startsWith('cashflow:')).length;
              if (linkedCount === 0) return null;
              const applyAll = () => {
                const changes: any = {};
                for (const exp of budgetData.expenses) {
                  const link = budgetLinks.find(l => l.budgetItemId === exp.id && l.sourceType === 'expense' && l.sourceId.startsWith('cashflow:'));
                  if (!link) continue;
                  const key = link.sourceId.replace('cashflow:', '');
                  const freqDef = frequencies.find(f => f.value === exp.frequency);
                  const monthly = exp.frequency === 'seasonal' ? (exp.amount || 0) / 12 : ((exp.amount || 0) * (freqDef?.multiplier || 12)) / 12;
                  changes[key] = Math.max(0, Math.round(monthly));
                }
                try {
                  updateUserData('cashflow', changes);
                } catch (e) {
                  console.error('❌ Appliquer tout (cashflow) a échoué:', e);
                }
              };
              const dissociateAll = () => {
                const newLinks = budgetLinks.filter(l => !(l.sourceType === 'expense' && l.sourceId.startsWith('cashflow:')));
                setBudgetLinks(newLinks);
                try {
                  updateUserData('personal', { budgetLinks: newLinks } as any);
                } catch (e) {
                  console.error('❌ Dissocier tout a échoué:', e);
                }
              };
              return (
                <Alert className="border-mpr-border bg-mpr-interactive-lt text-mpr-navy">
                  <AlertDescription className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <span>{isFrench ? `Synchronisation active: ${linkedCount} poste(s) lié(s) aux Dépenses.` : `Active sync: ${linkedCount} linked item(s) with Expenses.`}</span>
                    <div className="flex gap-2">
                      <Button onClick={applyAll} className="bg-mpr-interactive hover:bg-mpr-interactive-dk text-white">
                        {isFrench ? 'Appliquer tout' : 'Apply all'}
                      </Button>
                      <Button onClick={dissociateAll} variant="outline">
                        {isFrench ? 'Dissocier tout' : 'Dissociate all'}
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              );
            })()}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <h2 className="text-2xl font-bold text-mpr-navy">
                {isFrench ? 'Gestion des dépenses' : 'Expense Management'}
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={importFromCashflow}
                  className="bg-mpr-interactive hover:bg-mpr-interactive-dk text-white"
                  title={isFrench ? 'Importer vos dépenses mensuelles depuis la section Dépenses' : 'Import your monthly expenses from the Expenses section'}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isFrench ? 'Importer depuis Dépenses' : 'Import from Expenses'}
                </Button>
                <Button
                  onClick={addExpense}
                  className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isFrench ? 'Ajouter une dépense' : 'Add Expense'}
                </Button>
              </div>
            </div>

            {/* Liste des dépenses */}
            <div className="mpr-form">
              {budgetData.expenses.map(expense => {
                const category = expenseCategories.find(c => c.value === expense.category);
                const isEditing = editingExpense === expense.id;

                return (
                  <Card key={expense.id} className="bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 shadow-lg">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Catégorie */}
                        <div className="col-span-2">
                          {isEditing ? (
                            <Select
                              value={expense.category}
                              onValueChange={(value) => updateExpense(expense.id, { category: value as any })}
                            >
                              <SelectTrigger className="bg-white border-slate-300 text-gray-900">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-slate-300">
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
                              <span className="text-lg text-gray-900">{category?.label}</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <div className="col-span-3">
                          {isEditing ? (
                            <Input
                              value={expense.description}
                              onChange={(e) => updateExpense(expense.id, { description: e.target.value })}
                              className="bg-white border-slate-300 text-gray-900"
                              placeholder={isFrench ? 'Description...' : 'Description...'}
                            />
                          ) : (
                            <div>
                              <div className="text-lg font-medium text-gray-900">{expense.description}</div>
                              <div className="text-base text-gray-600">{expense.subcategory}</div>
                            </div>
                          )}
                        </div>

                        {/* Montant */}
                        <div className="col-span-2">
                          {isEditing ? (
                            <MoneyInput
                              value={expense.amount}
                              onChange={(value) => updateExpense(expense.id, { amount: value })}
                              className="bg-white border-slate-300 text-gray-900"
                              placeholder="0"
                              allowDecimals={true}
                            />
                          ) : (
                            <span className="text-lg font-medium text-gray-900">
                              {formatCurrency(expense.amount)}
                            </span>
                          )}
                        </div>

                        {/* Fréquence + part de besoin (%) */}
                        <div className="col-span-2">
                          {isEditing ? (
                            <>
                              <Select
                                value={expense.frequency}
                                onValueChange={(value) => updateExpense(expense.id, { frequency: value as any })}
                              >
                                <SelectTrigger className="bg-white border-slate-300 text-gray-900">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-300">
                                  {frequencies.map(freq => (
                                    <SelectItem key={freq.value} value={freq.value}>
                                      {freq.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="mt-2 flex items-center gap-2">
                                <Label className="text-sm text-gray-700">{isFrench ? 'Part de besoin (%)' : 'Need share (%)'}</Label>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={typeof expense.needSharePct === 'number' ? expense.needSharePct : 0}
                                  onChange={(e) => updateExpense(expense.id, { needSharePct: Number(e.target.value) })}
                                  className="w-32"
                                  aria-label={isFrench ? 'Part de besoin en pourcentage' : 'Need share percent'}
                                />
                                <span className="text-sm text-gray-700">
                                  {isFrench
                                    ? formatPercentOQLF((typeof expense.needSharePct === 'number' ? expense.needSharePct : 0), { min: 0, max: 0 })
                                    : `${typeof expense.needSharePct === 'number' ? expense.needSharePct : 0}%`
                                  }
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-lg text-gray-700">
                                {frequencies.find(f => f.value === expense.frequency)?.label}
                              </span>
                              <span className="text-sm text-gray-500">
                                {isFrench ? 'Besoin :' : 'Need:'}{' '}
                                {typeof expense.needSharePct === 'number'
                                  ? (isFrench ? formatPercentOQLF(expense.needSharePct, { min: 0, max: 0 }) : `${expense.needSharePct}%`)
                                  : (isFrench ? '—' : '—')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Date de paiement */}
                        <div className="col-span-1">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={expense.paymentDate || ''}
                              onChange={(e) => updateExpense(expense.id, { paymentDate: Number(e.target.value) })}
                              className="bg-white border-slate-300 text-gray-900"
                              placeholder="1"
                              min="1"
                              max="31"
                            />
                          ) : (
                            <span className="text-lg text-gray-700">
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
                              expense.isActive ? 'bg-green-400 text-white' : 'bg-gray-400 text-gray-100'
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
                            className="p-2 text-mpr-interactive hover:text-mpr-interactive-dk hover:bg-mpr-interactive-lt rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeExpense(expense.id)}
                            title={isFrench ? 'Supprimer cette dépense' : 'Delete this expense'}
                            className="p-2 text-red-600 hover:text-red-500 hover:bg-red-50 rounded"
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
          <TabsContent value="calendar" className="mpr-form">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-mpr-navy">
                {isFrench ? 'Calendrier des paiements' : 'Payment Calendar'}
              </h2>
              <div className="flex gap-4">
                <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number(value))}>
                  <SelectTrigger className="bg-white border-slate-300 text-gray-900 w-40" style={{fontSize: '1.125rem', minHeight: '48px'}}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-300">
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {new Date(2024, i, 1).toLocaleDateString(isFrench ? 'fr-CA' : 'en-CA', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
                  <SelectTrigger className="bg-white border-slate-300 text-gray-900 w-32" style={{fontSize: '1.125rem', minHeight: '48px'}}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-300">
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
                <CardTitle className="text-xl font-bold text-mpr-navy flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {new Date(selectedYear, selectedMonth, 1).toLocaleDateString(isFrench ? 'fr-CA' : 'en-CA', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mpr-form-row cols-7">
                  {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                    <div key={day} className="text-center text-lg font-semibold text-gray-700 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="mpr-form-row cols-7">
                  {Array.from({ length: 35 }, (_, i) => {
                    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
                    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
                    const dayNumber = i - firstDay + 1;
                    const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
                    
                    const dayExpenses = budgetData.expenses.filter(expense => 
                      expense.isActive && expense.paymentDate === dayNumber
                    );
                    
                    return (
                      <div key={i} className={`p-2 min-h-[80px] border border-slate-300 rounded ${
                        isValidDay ? 'bg-slate-50' : 'bg-slate-100'
                      }`}>
                        {isValidDay && (
                          <>
                            <div className="text-lg font-medium text-gray-900 mb-1">{dayNumber}</div>
                            {dayExpenses.map(expense => (
                              <div key={expense.id} className="text-sm bg-mpr-interactive text-white px-1 py-0.5 rounded mb-1 truncate">
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
          <TabsContent value="coastfire" className="mpr-form">
            <CoastFIRECalculator />
          </TabsContent>

          {/* 99 Trucs pour économiser */}
          <TabsContent value="tips" className="mpr-form">
            <EconomyTipsGuide />
          </TabsContent>

          {/* Module d'apprentissage */}
          <TabsContent value="learning" className="mpr-form">
            <LearningModule 
              moduleId="budget-fundamentals"
              onComplete={() => {
                console.log('?? Budget sauvegard� avec succ�s:', result.filename);
              }}
              onClose={() => {
                console.log('?? Budget sauvegard� avec succ�s:', result.filename);
              }}
            />
          </TabsContent>

          {/* Règle 50/30/20 */}
          <TabsContent value="budgetRule" className="mpr-form">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setBudgetTargets({ needsPct: 55, wantsPct: 25, savingsDebtPct: 20 })}>
                {isFrench ? 'Preset: Essentiels 55/25/20' : 'Preset: Essentials 55/25/20'}
              </Button>
              <Button variant="outline" onClick={() => setBudgetTargets({ needsPct: 50, wantsPct: 30, savingsDebtPct: 20 })}>
                {isFrench ? 'Preset: Classique 50/30/20' : 'Preset: Classic 50/30/20'}
              </Button>
              <Button variant="outline" onClick={() => setBudgetTargets({ needsPct: 45, wantsPct: 25, savingsDebtPct: 30 })}>
                {isFrench ? 'Preset: Épargne 45/25/30' : 'Preset: Savings 45/25/30'}
              </Button>
            </div>
            <Suspense fallback={<div className="text-gray-600">{isFrench ? 'Chargement…' : 'Loading…'}</div>}>
              <BudgetTargetsGauges
                language={isFrench ? 'fr' : 'en'}
                netMonthlyIncome={netMonthlyIncome}
                allocations={allocations}
                targets={budgetTargets}
                onChangeTargets={setBudgetTargets}
              />
            </Suspense>
          </TabsContent>

          {/* Fonds d’urgence */}
          <TabsContent value="emergency" className="mpr-form">
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
              <AlertDescription>
                {isFrench
                  ? 'Recommandation: gardez 3 à 12 mois de “besoins essentiels” en réserve. Ajustez la cible et suivez votre progression.'
                  : 'Recommendation: keep 3 to 12 months of “essential needs” in reserve. Adjust the target and track your progress.'}
              </AlertDescription>
            </Alert>
            <Suspense fallback={<div className="text-gray-600">{isFrench ? 'Chargement…' : 'Loading…'}</div>}>
              <EmergencyFundCard
                language={isFrench ? 'fr' : 'en'}
                monthlyNeeds={allocations.totalNeeds}
                currentSaved={budgetData.emergencyFund}
                onSavedChange={(v) => setBudgetData(prev => ({ ...prev, emergencyFund: v }))}
                monthsTarget={budgetSettings.emergencyMonthsTarget ?? 3}
                onMonthsTargetChange={(m) => setBudgetSettings(prev => ({ ...prev, emergencyMonthsTarget: m }))}
              />
            </Suspense>
          </TabsContent>

          {/* Objectifs planifiés (sinking funds) */}
          <TabsContent value="sinking" className="mpr-form">
            <Alert className="border-mpr-border bg-mpr-interactive-lt text-mpr-navy">
              <AlertDescription>
                {isFrench
                  ? 'Planifiez vos projets (ex.: taxes, voyage, réparation). Indiquez une échéance et un montant cible — la mensualité requise est calculée automatiquement.'
                  : 'Plan your projects (e.g., taxes, travel, repair). Set a due date and a target amount — the required monthly saving is computed automatically.'}
              </AlertDescription>
            </Alert>
            <div className="flex justify-end">
              <Button onClick={scheduleAllSinkingReminders} variant="outline" className="mb-2">
                {isFrench ? 'Planifier rappels 90/60/30' : 'Schedule 90/60/30 reminders'}
              </Button>
            </div>
            <Suspense fallback={<div className="text-gray-600">{isFrench ? 'Chargement…' : 'Loading…'}</div>}>
              <SinkingFundsManager
                language={isFrench ? 'fr' : 'en'}
                funds={budgetSettings.sinkingFunds ?? []}
                onChange={(next) => setBudgetSettings(prev => ({ ...prev, sinkingFunds: next }))}
              />
            </Suspense>
          </TabsContent>

          {/* Dettes — Snowball */}
          <TabsContent value="debts" className="mpr-form">
            <Alert className="border-purple-200 bg-purple-50 text-purple-900">
              <AlertDescription>
                {isFrench
                  ? 'Stratégie “boule de neige”: payez le minimum partout et concentrez un montant additionnel sur la plus petite (ou la plus coûteuse) en premier. Lorsque soldée, enchaînez avec la suivante.'
                  : '“Snowball” strategy: pay the minimum on all debts and focus an extra amount on the smallest (or the highest rate) first. When paid off, roll the amount into the next.'}
              </AlertDescription>
            </Alert>
            <Suspense fallback={<div className="text-gray-600">{isFrench ? 'Chargement…' : 'Loading…'}</div>}>
              <DebtSnowballWizard
                language={isFrench ? 'fr' : 'en'}
                state={budgetSettings.debtSnowball ?? { debts: [], extraPerMonth: 0, method: 'balance' }}
                onChange={(next) => setBudgetSettings(prev => ({ ...prev, debtSnowball: next }))}
              />
            </Suspense>
          </TabsContent>

          {/* Revenus & Déductions */}
          <TabsContent value="income" className="mpr-form">
            <Alert className="border-mpr-border bg-mpr-interactive-lt text-mpr-navy">
              <AlertDescription>
                {isFrench
                  ? 'Meilleure pratique : saisissez vos revenus dans la section Revenus. Le budget les utilise automatiquement. Cette section vous permet de démarrer rapidement ou d’ajuster au besoin.'
                  : 'Best practice: enter your income in the Income section. The budget uses it automatically. This section lets you get started quickly or make adjustments if needed.'}
              </AlertDescription>
            </Alert>
            <Suspense fallback={<div className="text-gray-600">{isFrench ? 'Chargement…' : 'Loading…'}</div>}>
              <IncomeDeductionsForm
                language={isFrench ? 'fr' : 'en'}
                value={budgetSettings}
                onChange={setBudgetSettings}
              />
            </Suspense>
          </TabsContent>

          {/* Valeur nette */}
          <TabsContent value="networth" className="mpr-form">
            <div className="mpr-form-row cols-2">
              {/* Actifs */}
              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-emerald-700 flex items-center gap-2">
                    {isFrench ? 'Actifs' : 'Assets'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mpr-form">
                  <div className="senior-form-row">
                    <Label className="senior-form-label">{isFrench ? 'Encaisse / Banque' : 'Cash / Bank'}</Label>
                    <MoneyInput
                      value={netWorth.assets.cash}
                      onChange={(v) => setNetWorth(prev => ({ ...prev, assets: { ...prev.assets, cash: v } }))}
                      className="senior-form-input"
                      allowDecimals
                    />
                  </div>
                  <div className="senior-form-row">
                    <Label className="senior-form-label">{isFrench ? 'Placements' : 'Investments'}</Label>
                    <MoneyInput
                      value={netWorth.assets.investments}
                      onChange={(v) => setNetWorth(prev => ({ ...prev, assets: { ...prev.assets, investments: v } }))}
                      className="senior-form-input"
                      allowDecimals
                    />
                  </div>
                  <div className="senior-form-row">
                    <Label className="senior-form-label">{isFrench ? 'Immobilier (valeur nette)' : 'Real estate (net value)'}</Label>
                    <MoneyInput
                      value={netWorth.assets.realEstate}
                      onChange={(v) => setNetWorth(prev => ({ ...prev, assets: { ...prev.assets, realEstate: v } }))}
                      className="senior-form-input"
                      allowDecimals
                    />
                  </div>
                  <div className="senior-form-row">
                    <Label className="senior-form-label">{isFrench ? 'Autres' : 'Other'}</Label>
                    <MoneyInput
                      value={netWorth.assets.other}
                      onChange={(v) => setNetWorth(prev => ({ ...prev, assets: { ...prev.assets, other: v } }))}
                      className="senior-form-input"
                      allowDecimals
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Passifs */}
              <Card className="bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-rose-700 flex items-center gap-2">
                    {isFrench ? 'Passifs' : 'Liabilities'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mpr-form">
                  <div className="senior-form-row">
                    <Label className="senior-form-label">{isFrench ? 'Hypothèque' : 'Mortgage'}</Label>
                    <MoneyInput
                      value={netWorth.liabilities.mortgage}
                      onChange={(v) => setNetWorth(prev => ({ ...prev, liabilities: { ...prev.liabilities, mortgage: v } }))}
                      className="senior-form-input"
                      allowDecimals
                    />
                  </div>
                  <div className="senior-form-row">
                    <Label className="senior-form-label">{isFrench ? 'Auto' : 'Auto'}</Label>
                    <MoneyInput
                      value={netWorth.liabilities.auto}
                      onChange={(v) => setNetWorth(prev => ({ ...prev, liabilities: { ...prev.liabilities, auto: v } }))}
                      className="senior-form-input"
                      allowDecimals
                    />
                  </div>
                  <div className="senior-form-row">
                    <Label className="senior-form-label">{isFrench ? 'Crédit' : 'Credit'}</Label>
                    <MoneyInput
                      value={netWorth.liabilities.credit}
                      onChange={(v) => setNetWorth(prev => ({ ...prev, liabilities: { ...prev.liabilities, credit: v } }))}
                      className="senior-form-input"
                      allowDecimals
                    />
                  </div>
                  <div className="senior-form-row">
                    <Label className="senior-form-label">{isFrench ? 'Études' : 'Student loans'}</Label>
                    <MoneyInput
                      value={netWorth.liabilities.student}
                      onChange={(v) => setNetWorth(prev => ({ ...prev, liabilities: { ...prev.liabilities, student: v } }))}
                      className="senior-form-input"
                      allowDecimals
                    />
                  </div>
                  <div className="senior-form-row">
                    <Label className="senior-form-label">{isFrench ? 'Autres' : 'Other'}</Label>
                    <MoneyInput
                      value={netWorth.liabilities.other}
                      onChange={(v) => setNetWorth(prev => ({ ...prev, liabilities: { ...prev.liabilities, other: v } }))}
                      className="senior-form-input"
                      allowDecimals
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Résumé + snapshots */}
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-mpr-navy flex items-center gap-2">
                  {isFrench ? 'Résumé de la valeur nette' : 'Net worth summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="mpr-form">
                {(() => {
                  const assetsTotal = (netWorth.assets.cash || 0) + (netWorth.assets.investments || 0) + (netWorth.assets.realEstate || 0) + (netWorth.assets.other || 0);
                  const liabTotal = (netWorth.liabilities.mortgage || 0) + (netWorth.liabilities.auto || 0) + (netWorth.liabilities.credit || 0) + (netWorth.liabilities.student || 0) + (netWorth.liabilities.other || 0);
                  const net = assetsTotal - liabTotal;
                  const captureSnapshot = () => {
                    const ym = new Date().toISOString().slice(0, 7);
                    const others = netWorthSnapshots.filter(s => s.date.slice(0, 7) !== ym);
                    const next = [...others, { date: new Date().toISOString(), assets: assetsTotal, liabilities: liabTotal, net }];
                    setNetWorthSnapshots(next.sort((a, b) => a.date.localeCompare(b.date)));
                    try {
                      const g = GamificationService.getInstance();
                      g.addPoints(10, isFrench ? 'Instantané de valeur nette' : 'Net worth snapshot');
                      g.logActivity('savings_updated', { amount: assetsTotal });
                    } catch {}
                  };
                  return (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded bg-white">
                          <div className="text-sm text-gray-600">{isFrench ? 'Actifs' : 'Assets'}</div>
                          <div className="text-2xl font-bold text-emerald-700">{formatCurrency(assetsTotal)}</div>
                        </div>
                        <div className="p-4 border rounded bg-white">
                          <div className="text-sm text-gray-600">{isFrench ? 'Passifs' : 'Liabilities'}</div>
                          <div className="text-2xl font-bold text-rose-700">{formatCurrency(liabTotal)}</div>
                        </div>
                        <div className="p-4 border rounded bg-white">
                          <div className="text-sm text-gray-600">{isFrench ? 'Valeur nette' : 'Net worth'}</div>
                          <div className={`text-2xl font-bold ${net >= 0 ? 'text-mpr-navy' : 'text-red-700'}`}>{formatCurrency(net)}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button onClick={captureSnapshot} className="bg-mpr-interactive hover:bg-mpr-interactive-dk text-white">
                          {isFrench ? 'Capturer un instantané' : 'Capture snapshot'}
                        </Button>
                        <div className="text-sm text-gray-600">
                          {isFrench ? 'Instantanés enregistrés' : 'Saved snapshots'}: {netWorthSnapshots.length}
                        </div>
                      </div>
                      <div className="max-h-48 overflow-auto border rounded bg-white">
                        <div className="grid grid-cols-4 gap-2 p-2 text-sm font-medium text-gray-700">
                          <div>{isFrench ? 'Date' : 'Date'}</div>
                          <div>{isFrench ? 'Actifs' : 'Assets'}</div>
                          <div>{isFrench ? 'Passifs' : 'Liabilities'}</div>
                          <div>{isFrench ? 'Valeur nette' : 'Net'}</div>
                        </div>
                        <div className="divide-y">
                          {netWorthSnapshots.map(s => (
                            <div key={s.date} className="grid grid-cols-4 gap-2 p-2 text-sm">
                              <div className="text-gray-700">{new Date(s.date).toLocaleDateString(isFrench ? 'fr-CA' : 'en-CA')}</div>
                              <div className="text-emerald-700 font-medium">{formatCurrency(s.assets)}</div>
                              <div className="text-rose-700 font-medium">{formatCurrency(s.liabilities)}</div>
                              <div className={`font-bold ${s.net >= 0 ? 'text-mpr-navy' : 'text-red-700'}`}>{formatCurrency(s.net)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paramètres */}
          <TabsContent value="settings" className="mpr-form">
            <div className="mpr-form-row cols-2">
              {/* Solde bancaire */}
              <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-mpr-navy flex items-center gap-2">
                    <PiggyBank className="w-5 h-5" />
                    {isFrench ? 'Solde bancaire' : 'Bank Balance'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mpr-form">
                  <div className="senior-form-row">
                    <Label className="senior-form-label">
                      {isFrench ? 'Solde actuel' : 'Current Balance'}
                    </Label>
                    <MoneyInput
                      value={budgetData.currentBalance}
                      onChange={(value) => setBudgetData(prev => ({ ...prev, currentBalance: value }))}
                      className="senior-form-input"
                      placeholder="0"
                      allowDecimals={true}
                    />
                  </div>
                  <div className="senior-form-row">
                    <Label className="senior-form-label">
                      {isFrench ? 'Date du solde' : 'Balance Date'}
                    </Label>
                    <DateInput
                      value={budgetData.balanceDate}
                      onChange={(value) => setBudgetData(prev => ({ ...prev, balanceDate: value }))}
                      className="senior-form-input"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Objectifs d'épargne */}
              <Card className="bg-gradient-to-br from-mpr-interactive-lt to-mpr-interactive-lt border-2 border-mpr-border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-mpr-navy flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {isFrench ? 'Objectifs d\'épargne' : 'Savings Goals'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mpr-form">
                  <div className="senior-form-row">
                    <Label className="senior-form-label">
                      {isFrench ? 'Objectif d\'épargne mensuel' : 'Monthly Savings Goal'}
                    </Label>
                    <MoneyInput
                      value={budgetData.savingsGoal}
                      onChange={(value) => setBudgetData(prev => ({ ...prev, savingsGoal: value }))}
                      className="senior-form-input"
                      placeholder="0"
                      allowDecimals={true}
                    />
                  </div>
                  <div className="senior-form-row">
                    <Label className="senior-form-label">
                      {isFrench ? 'Fonds d\'urgence cible' : 'Emergency Fund Target'}
                    </Label>
                    <MoneyInput
                      value={budgetData.emergencyFund}
                      onChange={(value) => setBudgetData(prev => ({ ...prev, emergencyFund: value }))}
                      className="senior-form-input"
                      placeholder="0"
                      allowDecimals={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SMART goals + Rappels fin de mois */}
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-mpr-navy flex items-center justify-between gap-2">
                  <span>{isFrench ? 'Objectifs SMART' : 'SMART Goals'}</span>
                  <Button variant="outline" onClick={scheduleEndOfMonthReminders}>
                    {isFrench ? 'Rappels fin de mois' : 'Month-end reminders'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="mpr-form">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <Input
                    placeholder={isFrench ? 'Spécifique (ex.: réduire restos)' : 'Specific (e.g., reduce dining)'}
                    value={smartDraft.title}
                    onChange={(e) => setSmartDraft((d) => ({ ...d, title: e.target.value }))}
                    className="md:col-span-2 bg-white border-slate-300 text-gray-900"
                  />
                  <Input
                    placeholder={isFrench ? 'Mesurable (ex.: -100$/mois)' : 'Measurable (e.g., -$100/mo)'}
                    value={smartDraft.measure}
                    onChange={(e) => setSmartDraft((d) => ({ ...d, measure: e.target.value }))}
                    className="bg-white border-slate-300 text-gray-900"
                  />
                  <MoneyInput
                    value={smartDraft.target}
                    onChange={(v) => setSmartDraft((d) => ({ ...d, target: v }))}
                    className="bg-white border-slate-300 text-gray-900"
                    placeholder="0"
                    allowDecimals
                  />
                  <DateInput
                    value={smartDraft.deadline}
                    onChange={(v) => setSmartDraft((d) => ({ ...d, deadline: v }))}
                    className="bg-white border-slate-300 text-gray-900"
                  />
                </div>
                <Input
                  placeholder={isFrench ? 'Pertinence (Pourquoi ?)' : 'Relevant (Why?)'}
                  value={smartDraft.relevance}
                  onChange={(e) => setSmartDraft((d) => ({ ...d, relevance: e.target.value }))}
                  className="bg-white border-slate-300 text-gray-900"
                />
                <div className="flex justify-end">
                  <Button onClick={saveSmartGoal} className="bg-mpr-interactive hover:bg-mpr-interactive-dk text-white">
                    {isFrench ? 'Enregistrer l’objectif' : 'Save goal'}
                  </Button>
                </div>

                {smartGoals.length > 0 && (
                  <div className="mt-2 border rounded bg-white">
                    <div className="grid grid-cols-6 gap-2 p-2 text-sm font-medium text-gray-700">
                      <div>{isFrench ? 'Objectif' : 'Goal'}</div>
                      <div>{isFrench ? 'Mesure' : 'Measure'}</div>
                      <div>{isFrench ? 'Cible' : 'Target'}</div>
                      <div>{isFrench ? 'Échéance' : 'Deadline'}</div>
                      <div>{isFrench ? 'Pertinence' : 'Relevant'}</div>
                      <div></div>
                    </div>
                    <div className="divide-y">
                      {smartGoals.map((g) => (
                        <div key={g.id} className="grid grid-cols-6 gap-2 p-2 text-sm items-center">
                          <div className="text-gray-800 truncate">{g.title}</div>
                          <div className="text-gray-700 truncate">{g.measure}</div>
                          <div className="text-gray-700">{formatCurrency(Number(g.target) || 0)}</div>
                          <div className="text-gray-700">{new Date(g.deadline).toLocaleDateString(isFrench ? 'fr-CA' : 'en-CA')}</div>
                          <div className="text-gray-700 truncate">{g.relevance}</div>
                          <div className="text-right">
                            <Button variant="outline" onClick={() => removeSmartGoal(g.id)}>{isFrench ? 'Retirer' : 'Remove'}</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bouton de sauvegarde */}
        <div className="text-center mt-12">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500 hover:from-green-500 hover:via-emerald-500 hover:to-teal-600 text-white font-bold text-2xl py-6 px-12 shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-green-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed" style={{fontSize: '1.5rem', minHeight: '64px'}}
          >
            <Save className="w-8 h-8 mr-4 animate-pulse" />
            {isSaving ? (isFrench ? 'Sauvegarde...' : 'Saving...') : (isFrench ? 'Sauvegarder' : 'Save')}
          </Button>
          <Button
            onClick={handleExportPDF}
            size="lg"
            className="ml-4 bg-mpr-interactive hover:bg-mpr-interactive-dk text-white font-bold text-xl py-6 px-8 border-2 border-mpr-border"
          >
            {isFrench ? '📄 Exporter PDF' : '📄 Export PDF'}
          </Button>
          <p className="text-gray-700 mt-4 text-lg" style={{fontSize: '1.125rem'}}>
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
