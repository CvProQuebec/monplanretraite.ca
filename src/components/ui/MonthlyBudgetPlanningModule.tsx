import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  AlertCircle,
  DollarSign,
  CalendarDays,
  Target,
  TrendingUp,
  Bell,
  Settings
} from 'lucide-react';
import { UserData, ExpenseDueDate } from '@/features/retirement/types';
import { formatCurrency } from '@/features/retirement/utils/formatters';

interface MonthlyBudgetPlanningModuleProps {
  data: UserData;
  onUpdate: (updates: any) => void;
  language: string;
}

const MonthlyBudgetPlanningModule: React.FC<MonthlyBudgetPlanningModuleProps> = ({
  data,
  onUpdate,
  language
}) => {
  const [activeTab, setActiveTab] = useState('dueDates');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [isAddingDueDate, setIsAddingDueDate] = useState(false);
  const [editingDueDate, setEditingDueDate] = useState<ExpenseDueDate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('logement');

  const isFrench = language === 'fr';

  // Traductions
  const t = {
    title: isFrench ? 'Planification Budgétaire Mensuelle' : 'Monthly Budget Planning',
    subtitle: isFrench ? 'Gérez les dates d\'échéance et planifiez votre budget mensuel' : 'Manage due dates and plan your monthly budget',
    dueDatesTab: isFrench ? 'Dates d\'échéance' : 'Due Dates',
    budgetPlanTab: isFrench ? 'Plan budgétaire' : 'Budget Plan',
    upcomingExpensesTab: isFrench ? 'Dépenses à venir' : 'Upcoming Expenses',
    addDueDate: isFrench ? 'Ajouter une échéance' : 'Add Due Date',
    expenseName: isFrench ? 'Nom de la dépense' : 'Expense Name',
    category: isFrench ? 'Catégorie' : 'Category',
    amount: isFrench ? 'Montant' : 'Amount',
    frequency: isFrench ? 'Fréquence' : 'Frequency',
    dueDay: isFrench ? 'Jour d\'échéance' : 'Due Day',
    specificDates: isFrench ? 'Dates spécifiques' : 'Specific Dates',
    notes: isFrench ? 'Notes' : 'Notes',
    save: isFrench ? 'Sauvegarder' : 'Save',
    cancel: isFrench ? 'Annuler' : 'Cancel',
    nextDue: isFrench ? 'Prochaine échéance' : 'Next Due',
    monthlyIncome: isFrench ? 'Revenus mensuels' : 'Monthly Income',
    plannedExpenses: isFrench ? 'Dépenses planifiées' : 'Planned Expenses',
    remainingBudget: isFrench ? 'Budget restant' : 'Remaining Budget',
    actualSavings: isFrench ? 'Épargne réelle' : 'Actual Savings',
    selectMonth: isFrench ? 'Sélectionner le mois' : 'Select Month',
    noExpenses: isFrench ? 'Aucune dépense planifiée' : 'No planned expenses',
    recurring: isFrench ? 'Récurrent' : 'Recurring',
    frequencies: {
      monthly: isFrench ? 'Mensuel' : 'Monthly',
      bimonthly: isFrench ? 'Bimensuel' : 'Bimonthly',
      quarterly: isFrench ? 'Trimestriel' : 'Quarterly',
      biannual: isFrench ? 'Semestriel' : 'Biannual',
      annual: isFrench ? 'Annuel' : 'Annual',
      irregular: isFrench ? 'Irrégulier' : 'Irregular'
    },
    categories: {
      logement: isFrench ? 'Logement' : 'Housing',
      servicesPublics: isFrench ? 'Services publics' : 'Utilities',
      assurances: isFrench ? 'Assurances' : 'Insurance',
      telecom: isFrench ? 'Télécommunications' : 'Telecommunications',
      alimentation: isFrench ? 'Alimentation' : 'Food',
      transport: isFrench ? 'Transport' : 'Transportation',
      sante: isFrench ? 'Santé' : 'Health',
      loisirs: isFrench ? 'Loisirs' : 'Leisure'
    }
  };

  // Initialiser les données par défaut
  const dueDates = data.cashflow?.dueDates || {};

  // Calculer la prochaine date d'échéance
  const calculateNextDueDate = (dueDate: ExpenseDueDate): string => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (dueDate.frequency === 'monthly' && dueDate.dueDay) {
      const nextDate = new Date(currentYear, currentMonth, dueDate.dueDay);
      if (nextDate <= now) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      return nextDate.toISOString().split('T')[0];
    }

    if (dueDate.frequency === 'irregular' && dueDate.dueDates) {
      for (const dateStr of dueDate.dueDates) {
        const [month, day] = dateStr.split('-').map(Number);
        const targetDate = new Date(currentYear, month - 1, day);
        
        if (targetDate > now) {
          return targetDate.toISOString().split('T')[0];
        }
      }
      
      // Si aucune date cette année, prendre la première de l'année suivante
      if (dueDate.dueDates.length > 0) {
        const [month, day] = dueDate.dueDates[0].split('-').map(Number);
        const nextYearDate = new Date(currentYear + 1, month - 1, day);
        return nextYearDate.toISOString().split('T')[0];
      }
    }

    return '';
  };

  // Gestionnaire pour ajouter/modifier une date d'échéance
  const handleSaveDueDate = (formData: ExpenseDueDate) => {
    const updatedDueDates = { ...dueDates };
    
    if (!updatedDueDates[selectedCategory as keyof typeof updatedDueDates]) {
      updatedDueDates[selectedCategory as keyof typeof updatedDueDates] = [];
    }

    const categoryExpenses = updatedDueDates[selectedCategory as keyof typeof updatedDueDates] || [];
    const existingIndex = categoryExpenses.findIndex(item => item.id === formData.id);

    const dueDate = { ...formData, nextDueDate: calculateNextDueDate(formData) };

    if (existingIndex >= 0) {
      categoryExpenses[existingIndex] = dueDate;
    } else {
      categoryExpenses.push(dueDate);
    }

    onUpdate({ dueDates: updatedDueDates });
    setIsAddingDueDate(false);
    setEditingDueDate(null);
  };

  // Gestionnaire pour supprimer une date d'échéance
  const handleDeleteDueDate = (category: string, id: string) => {
    const updatedDueDates = { ...dueDates };
    const categoryExpenses = updatedDueDates[category as keyof typeof updatedDueDates] || [];
    updatedDueDates[category as keyof typeof updatedDueDates] = categoryExpenses.filter(item => item.id !== id);
    onUpdate({ dueDates: updatedDueDates });
  };

  // Composant pour le formulaire d'ajout/modification
  const DueDateForm: React.FC<{ 
    dueDate?: ExpenseDueDate; 
    onSave: (dueDate: ExpenseDueDate) => void; 
    onCancel: () => void 
  }> = ({ dueDate, onSave, onCancel }) => {
    const [formData, setFormData] = useState<ExpenseDueDate>(
      dueDate || {
        id: Date.now().toString(),
        name: '',
        amount: 0,
        frequency: 'monthly',
        dueDay: 1,
        dueDates: [],
        isActive: true,
        notes: ''
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.name && formData.amount > 0 && selectedCategory) {
        onSave(formData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="expenseName">{t.expenseName}</Label>
          <Input
            id="expenseName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={isFrench ? "ex: Hydro-Québec" : "ex: Hydro-Quebec"}
            required
          />
        </div>

        <div>
          <Label htmlFor="amount">{t.amount}</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            required
          />
        </div>

        <div>
          <Label htmlFor="frequency">{t.frequency}</Label>
          <Select 
            value={formData.frequency} 
            onValueChange={(value) => setFormData({ ...formData, frequency: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">{t.frequencies.monthly}</SelectItem>
              <SelectItem value="bimonthly">{t.frequencies.bimonthly}</SelectItem>
              <SelectItem value="quarterly">{t.frequencies.quarterly}</SelectItem>
              <SelectItem value="biannual">{t.frequencies.biannual}</SelectItem>
              <SelectItem value="annual">{t.frequencies.annual}</SelectItem>
              <SelectItem value="irregular">{t.frequencies.irregular}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.frequency === 'monthly' && (
          <div>
            <Label htmlFor="dueDay">{t.dueDay}</Label>
            <Input
              id="dueDay"
              type="number"
              min="1"
              max="31"
              value={formData.dueDay || ''}
              onChange={(e) => setFormData({ ...formData, dueDay: parseInt(e.target.value) || 1 })}
              placeholder="6"
            />
          </div>
        )}

        {formData.frequency === 'irregular' && (
          <div>
            <Label htmlFor="specificDates">{t.specificDates}</Label>
            <Input
              id="specificDates"
              value={formData.dueDates?.join(', ') || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                dueDates: e.target.value.split(',').map(d => d.trim()).filter(d => d) 
              })}
              placeholder={isFrench ? "09-07, 11-08, 01-04" : "09-07, 11-08, 01-04"}
            />
            <p className="text-xs text-gray-500 mt-1">
              {isFrench ? 'Format: MM-JJ, séparés par des virgules' : 'Format: MM-DD, separated by commas'}
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="notes">{t.notes}</Label>
          <Input
            id="notes"
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder={isFrench ? "Notes optionnelles" : "Optional notes"}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t.cancel}
          </Button>
          <Button type="submit">
            {t.save}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Calendar className="w-8 h-8 text-blue-300" />
          {t.title}
        </h2>
        <p className="text-lg text-blue-100">
          {t.subtitle}
        </p>
      </div>

      {/* Navigation par onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
          <TabsTrigger value="dueDates" className="text-white data-[state=active]:bg-blue-600">
            <Clock className="w-4 h-4 mr-2" />
            {t.dueDatesTab}
          </TabsTrigger>
          <TabsTrigger value="budgetPlan" className="text-white data-[state=active]:bg-green-600">
            <Target className="w-4 h-4 mr-2" />
            {t.budgetPlanTab}
          </TabsTrigger>
        </TabsList>

        {/* Onglet Dates d'échéance */}
        <TabsContent value="dueDates" className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl text-gray-800">{t.dueDatesTab}</CardTitle>
                  <CardDescription>
                    {isFrench 
                      ? 'Configurez les dates d\'échéance pour vos dépenses régulières'
                      : 'Configure due dates for your regular expenses'
                    }
                  </CardDescription>
                </div>
                <Dialog open={isAddingDueDate} onOpenChange={setIsAddingDueDate}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setSelectedCategory('logement');
                        setEditingDueDate(null);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t.addDueDate}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{t.addDueDate}</DialogTitle>
                    </DialogHeader>
                    <div className="mb-4">
                      <Label>{t.category}</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(t.categories).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DueDateForm
                      dueDate={editingDueDate || undefined}
                      onSave={handleSaveDueDate}
                      onCancel={() => {
                        setIsAddingDueDate(false);
                        setEditingDueDate(null);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(t.categories).map(([categoryKey, categoryLabel]) => {
                  const categoryExpenses = dueDates[categoryKey as keyof typeof dueDates] || [];
                  
                  return (
                    <div key={categoryKey} className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-600" />
                        {categoryLabel}
                      </h3>
                      
                      {categoryExpenses.length === 0 ? (
                        <p className="text-gray-500 italic">
                          {isFrench ? 'Aucune échéance configurée' : 'No due dates configured'}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {categoryExpenses.map(expense => (
                            <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <h4 className="font-medium text-gray-800">{expense.name}</h4>
                                  <Badge variant="outline">
                                    {t.frequencies[expense.frequency]}
                                  </Badge>
                                  {expense.nextDueDate && (
                                    <Badge variant="secondary">
                                      {t.nextDue}: {new Date(expense.nextDueDate).toLocaleDateString(isFrench ? 'fr-CA' : 'en-CA')}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-lg font-semibold text-green-600">
                                    {formatCurrency(expense.amount)}
                                  </span>
                                  {expense.frequency === 'monthly' && expense.dueDay && (
                                    <span className="text-sm text-gray-600">
                                      {isFrench ? `Le ${expense.dueDay} de chaque mois` : `${expense.dueDay}th of each month`}
                                    </span>
                                  )}
                                  {expense.frequency === 'irregular' && expense.dueDates && (
                                    <span className="text-sm text-gray-600">
                                      {expense.dueDates.join(', ')}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedCategory(categoryKey);
                                    setEditingDueDate(expense);
                                    setIsAddingDueDate(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteDueDate(categoryKey, expense.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Plan budgétaire */}
        <TabsContent value="budgetPlan" className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">{t.budgetPlanTab}</CardTitle>
              <CardDescription>
                {isFrench 
                  ? 'Visualisez votre plan budgétaire mensuel'
                  : 'Visualize your monthly budget plan'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">
                  {isFrench 
                    ? 'Fonctionnalité en développement - Configurez d\'abord vos dates d\'échéance'
                    : 'Feature in development - Configure your due dates first'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonthlyBudgetPlanningModule;
