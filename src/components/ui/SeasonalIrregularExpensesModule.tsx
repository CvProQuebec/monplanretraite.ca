import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Snowflake, 
  Sun, 
  Leaf, 
  Flower,
  Car,
  Home,
  Droplets,
  Zap,
  Gift,
  Building,
  Shield,
  Heart,
  Wrench,
  TreePine,
  Info,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Clock,
  Settings,
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '@/features/retirement/utils/formatters';

interface SeasonalIrregularExpensesProps {
  data: any;
  onUpdate: (updates: any) => void;
  language?: 'fr' | 'en';
}

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  category: string;
  linkedField?: string; // Pour la synchronisation avec les champs existants
  description?: string;
  dueDate?: string;
  isGovernmental?: boolean;
}

const SeasonalIrregularExpensesModule: React.FC<SeasonalIrregularExpensesProps> = ({ 
  data, 
  onUpdate, 
  language = 'fr' 
}) => {
  const [activeTab, setActiveTab] = useState('seasonal');
  const [showHelp, setShowHelp] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [syncedFields, setSyncedFields] = useState<Record<string, number>>({});

  const t = {
    title: language === 'fr' ? 'Dépenses Saisonnières et Irrégulières' : 'Seasonal and Irregular Expenses',
    subtitle: language === 'fr' 
      ? 'Planifiez vos dépenses non-récurrentes pour une meilleure gestion budgétaire'
      : 'Plan your non-recurring expenses for better budget management',
    seasonal: language === 'fr' ? 'Saisonnières' : 'Seasonal',
    irregular: language === 'fr' ? 'Irrégulières' : 'Irregular',
    governmental: language === 'fr' ? 'Gouvernementales' : 'Governmental',
    spring: language === 'fr' ? 'Printemps' : 'Spring',
    summer: language === 'fr' ? 'Été' : 'Summer',
    fall: language === 'fr' ? 'Automne' : 'Fall',
    winter: language === 'fr' ? 'Hiver' : 'Winter',
    monthlyEquivalent: language === 'fr' ? 'Équivalent mensuel' : 'Monthly equivalent',
    totalAnnual: language === 'fr' ? 'Total annuel' : 'Annual total',
    syncWithHousing: language === 'fr' ? 'Synchroniser avec Logement' : 'Sync with Housing',
    syncWarning: language === 'fr' 
      ? 'Cette dépense est liée au champ "Logement". Les modifications seront synchronisées.'
      : 'This expense is linked to the "Housing" field. Changes will be synchronized.',
    help: language === 'fr' ? 'Aide' : 'Help',
    save: language === 'fr' ? 'Sauvegarder' : 'Save',
    cancel: language === 'fr' ? 'Annuler' : 'Cancel',
    add: language === 'fr' ? 'Ajouter' : 'Add',
    edit: language === 'fr' ? 'Modifier' : 'Edit',
    delete: language === 'fr' ? 'Supprimer' : 'Delete'
  };

  // Définition des dépenses saisonnières selon le document
  const seasonalExpensesTemplate: ExpenseItem[] = [
    // PRINTEMPS (Mars - Mai)
    {
      id: 'spring-oil-change',
      name: language === 'fr' ? 'Changement d\'huile (mars/avril)' : 'Oil change (March/April)',
      amount: 80,
      frequency: 'biannual',
      season: 'spring',
      category: 'automobile',
      description: language === 'fr' ? 'Entretien saisonnier du véhicule' : 'Seasonal vehicle maintenance'
    },
    {
      id: 'spring-summer-tires',
      name: language === 'fr' ? 'Pneus d\'été' : 'Summer tires',
      amount: 800,
      frequency: 'annual',
      season: 'spring',
      category: 'automobile',
      description: language === 'fr' ? 'Changement et entreposage' : 'Change and storage'
    },
    {
      id: 'spring-tree-pruning',
      name: language === 'fr' ? 'Émondage des arbres' : 'Tree pruning',
      amount: 300,
      frequency: 'annual',
      season: 'spring',
      category: 'exterior-maintenance',
      description: language === 'fr' ? 'Avant bourgeonnement' : 'Before budding'
    },
    {
      id: 'spring-gutter-cleaning',
      name: language === 'fr' ? 'Nettoyage des gouttières' : 'Gutter cleaning',
      amount: 150,
      frequency: 'biannual',
      season: 'spring',
      category: 'exterior-maintenance'
    },
    {
      id: 'spring-roof-inspection',
      name: language === 'fr' ? 'Inspection et réparation toiture' : 'Roof inspection and repair',
      amount: 500,
      frequency: 'annual',
      season: 'spring',
      category: 'exterior-maintenance',
      description: language === 'fr' ? 'Après l\'hiver' : 'After winter'
    },

    // ÉTÉ (Juin - Août)
    {
      id: 'summer-pool-opening',
      name: language === 'fr' ? 'Ouverture piscine' : 'Pool opening',
      amount: 400,
      frequency: 'annual',
      season: 'summer',
      category: 'pool-spa',
      description: language === 'fr' ? 'Produits chimiques, équipements' : 'Chemicals, equipment'
    },
    {
      id: 'summer-garden-supplies',
      name: language === 'fr' ? 'Fleurs, légumes, semences' : 'Flowers, vegetables, seeds',
      amount: 300,
      frequency: 'annual',
      season: 'summer',
      category: 'garden-landscaping'
    },
    {
      id: 'summer-lawn-maintenance',
      name: language === 'fr' ? 'Entretien tondeuse-tracteur' : 'Lawn mower maintenance',
      amount: 200,
      frequency: 'annual',
      season: 'summer',
      category: 'lawn'
    },

    // AUTOMNE (Septembre - Novembre)
    {
      id: 'fall-oil-change',
      name: language === 'fr' ? 'Changement d\'huile (automne)' : 'Oil change (fall)',
      amount: 80,
      frequency: 'biannual',
      season: 'fall',
      category: 'automobile'
    },
    {
      id: 'fall-winter-tires',
      name: language === 'fr' ? 'Pneus d\'hiver' : 'Winter tires',
      amount: 800,
      frequency: 'annual',
      season: 'fall',
      category: 'automobile'
    },
    {
      id: 'fall-pool-closing',
      name: language === 'fr' ? 'Fermeture piscine' : 'Pool closing',
      amount: 200,
      frequency: 'annual',
      season: 'fall',
      category: 'winter-prep'
    },
    {
      id: 'fall-firewood',
      name: language === 'fr' ? 'Bois de chauffage' : 'Firewood',
      amount: 400,
      frequency: 'annual',
      season: 'fall',
      category: 'winter-prep'
    },
    {
      id: 'fall-chimney-cleaning',
      name: language === 'fr' ? 'Nettoyage cheminée/conduits' : 'Chimney/duct cleaning',
      amount: 250,
      frequency: 'annual',
      season: 'fall',
      category: 'winter-prep'
    },

    // HIVER (Décembre - Février)
    {
      id: 'winter-heating-extra',
      name: language === 'fr' ? 'Surcoût chauffage hivernal' : 'Winter heating surcharge',
      amount: 150,
      frequency: 'monthly',
      season: 'winter',
      category: 'heating-energy',
      description: language === 'fr' ? 'Décembre à mars' : 'December to March'
    },
    {
      id: 'winter-snow-removal',
      name: language === 'fr' ? 'Déneigement' : 'Snow removal',
      amount: 600,
      frequency: 'annual',
      season: 'winter',
      category: 'heating-energy',
      description: language === 'fr' ? 'Paiements septembre et janvier' : 'September and January payments'
    },
    {
      id: 'winter-christmas-gifts',
      name: language === 'fr' ? 'Cadeaux de Noël' : 'Christmas gifts',
      amount: 800,
      frequency: 'annual',
      season: 'winter',
      category: 'celebrations'
    },
    {
      id: 'winter-family-travel',
      name: language === 'fr' ? 'Déplacements famille' : 'Family travel',
      amount: 500,
      frequency: 'annual',
      season: 'winter',
      category: 'celebrations',
      description: language === 'fr' ? 'Période des Fêtes' : 'Holiday season'
    }
  ];

  // Définition des dépenses irrégulières gouvernementales
  const governmentalExpensesTemplate: ExpenseItem[] = [
    {
      id: 'municipal-taxes',
      name: language === 'fr' ? 'Taxes municipales' : 'Municipal taxes',
      amount: 3600,
      frequency: 'annual',
      category: 'taxes',
      linkedField: 'logement', // Synchronisation avec le champ logement
      isGovernmental: true,
      description: language === 'fr' ? '6 versements annuels' : '6 annual payments'
    },
    {
      id: 'school-taxes',
      name: language === 'fr' ? 'Taxes scolaires' : 'School taxes',
      amount: 800,
      frequency: 'biannual',
      category: 'taxes',
      isGovernmental: true,
      description: language === 'fr' ? 'Août et novembre' : 'August and November'
    },
    {
      id: 'home-insurance',
      name: language === 'fr' ? 'Assurance habitation' : 'Home insurance',
      amount: 1200,
      frequency: 'annual',
      category: 'insurance',
      linkedField: 'assurances', // Synchronisation avec le champ assurances
      isGovernmental: false
    },
    {
      id: 'vehicle-insurance',
      name: language === 'fr' ? 'Assurance véhicule' : 'Vehicle insurance',
      amount: 1800,
      frequency: 'annual',
      category: 'insurance',
      linkedField: 'assurances', // Synchronisation avec le champ assurances
      isGovernmental: false
    }
  ];

  // Initialiser les dépenses
  useEffect(() => {
    const allExpenses = [...seasonalExpensesTemplate, ...governmentalExpensesTemplate];
    setExpenses(allExpenses);
    
    // Calculer les champs synchronisés
    const synced: Record<string, number> = {};
    allExpenses.forEach(expense => {
      if (expense.linkedField) {
        const monthlyAmount = calculateMonthlyEquivalent(expense.amount, expense.frequency);
        synced[expense.linkedField] = (synced[expense.linkedField] || 0) + monthlyAmount;
      }
    });
    setSyncedFields(synced);
  }, []);

  // Calculer l'équivalent mensuel selon la fréquence
  const calculateMonthlyEquivalent = (amount: number, frequency: string): number => {
    switch (frequency) {
      case 'monthly': return amount;
      case 'quarterly': return amount / 3;
      case 'biannual': return amount / 6;
      case 'annual': return amount / 12;
      default: return amount / 12;
    }
  };

  // Calculer les totaux par saison
  const calculateSeasonTotals = () => {
    const totals = {
      spring: 0,
      summer: 0,
      fall: 0,
      winter: 0,
      governmental: 0
    };

    expenses.forEach(expense => {
      const monthlyAmount = calculateMonthlyEquivalent(expense.amount, expense.frequency);
      if (expense.isGovernmental) {
        totals.governmental += monthlyAmount;
      } else if (expense.season) {
        totals[expense.season] += monthlyAmount;
      }
    });

    return totals;
  };

  // Synchroniser avec les champs existants - Version améliorée
  const handleSyncWithExistingFields = () => {
    const updates: any = {};
    
    // Synchronisations critiques (doublons directs)
    const criticalSyncs = {
      // Taxes municipales → logement breakdown
      'municipal-taxes': {
        targetField: 'logement',
        breakdownField: 'logementBreakdown',
        breakdownKey: 'taxesMunicipales'
      },
      // Assurance habitation → assurances breakdown
      'home-insurance': {
        targetField: 'assurances',
        breakdownField: 'assurancesBreakdown',
        breakdownKey: 'habitation'
      },
      // Assurance véhicule → assurances breakdown
      'vehicle-insurance': {
        targetField: 'assurances',
        breakdownField: 'assurancesBreakdown',
        breakdownKey: 'auto'
      }
    };

    // Synchronisations fonctionnelles
    const functionalSyncs = {
      // Entretien automobile saisonnier → transport breakdown
      'automotive-maintenance': {
        targetField: 'transport',
        breakdownField: 'transportBreakdown',
        breakdownKey: 'maintenance',
        sourceExpenses: ['spring-oil-change', 'fall-oil-change', 'spring-summer-tires', 'fall-winter-tires']
      },
      // Entretien domiciliaire saisonnier → logement breakdown
      'home-maintenance': {
        targetField: 'logement',
        breakdownField: 'logementBreakdown',
        breakdownKey: 'entretien',
        sourceExpenses: ['spring-tree-pruning', 'spring-gutter-cleaning', 'spring-roof-inspection', 'fall-chimney-cleaning']
      },
      // Chauffage hivernal → services publics breakdown
      'winter-heating': {
        targetField: 'servicesPublics',
        breakdownField: 'servicesPublicsBreakdown',
        breakdownKey: 'chauffage',
        sourceExpenses: ['winter-heating-extra']
      }
    };

    // Appliquer les synchronisations critiques
    Object.entries(criticalSyncs).forEach(([expenseId, config]) => {
      const expense = expenses.find(e => e.id === expenseId);
      if (expense) {
        const monthlyAmount = calculateMonthlyEquivalent(expense.amount, expense.frequency);
        
        // Mettre à jour le breakdown spécifique
        const currentBreakdown = data.cashflow[config.breakdownField] || {};
        updates[config.breakdownField] = {
          ...currentBreakdown,
          [config.breakdownKey]: monthlyAmount
        };
        
        // Recalculer le total du champ principal
        const newBreakdownTotal = Object.values({
          ...currentBreakdown,
          [config.breakdownKey]: monthlyAmount
        }).reduce((sum: number, value: number) => sum + (value || 0), 0);
        
        updates[config.targetField] = newBreakdownTotal;
      }
    });

    // Appliquer les synchronisations fonctionnelles
    Object.entries(functionalSyncs).forEach(([syncId, config]) => {
      const totalAmount = config.sourceExpenses.reduce((sum, expenseId) => {
        const expense = expenses.find(e => e.id === expenseId);
        return sum + (expense ? calculateMonthlyEquivalent(expense.amount, expense.frequency) : 0);
      }, 0);

      if (totalAmount > 0) {
        // Mettre à jour le breakdown spécifique
        const currentBreakdown = data.cashflow[config.breakdownField] || {};
        const currentAmount = currentBreakdown[config.breakdownKey] || 0;
        
        updates[config.breakdownField] = {
          ...currentBreakdown,
          [config.breakdownKey]: currentAmount + totalAmount
        };
        
        // Recalculer le total du champ principal
        const newBreakdownTotal = Object.values({
          ...currentBreakdown,
          [config.breakdownKey]: currentAmount + totalAmount
        }).reduce((sum: number, value: number) => sum + (value || 0), 0);
        
        updates[config.targetField] = newBreakdownTotal;
      }
    });

    // Mettre à jour les dépenses saisonnières générales
    updates.depensesSaisonnieres = totalMonthly;

    onUpdate(updates);
    
    // Afficher confirmation détaillée
    const syncCount = Object.keys(updates).length;
    alert(language === 'fr' 
      ? `Synchronisation effectuée ! ${syncCount} champs mis à jour avec les dépenses saisonnières et irrégulières.` 
      : `Synchronization completed! ${syncCount} fields updated with seasonal and irregular expenses.`
    );
  };

  const totals = calculateSeasonTotals();
  const totalMonthly = Object.values(totals).reduce((sum, value) => sum + value, 0);
  const totalAnnual = totalMonthly * 12;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'automobile': return <Car className="w-4 h-4" />;
      case 'exterior-maintenance': return <Home className="w-4 h-4" />;
      case 'pool-spa': return <Droplets className="w-4 h-4" />;
      case 'garden-landscaping': return <TreePine className="w-4 h-4" />;
      case 'lawn': return <Leaf className="w-4 h-4" />;
      case 'winter-prep': return <Snowflake className="w-4 h-4" />;
      case 'heating-energy': return <Zap className="w-4 h-4" />;
      case 'celebrations': return <Gift className="w-4 h-4" />;
      case 'taxes': return <Building className="w-4 h-4" />;
      case 'insurance': return <Shield className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Calendar className="w-8 h-8 text-blue-600" />
          {t.title}
        </h2>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-4">
          {t.subtitle}
        </p>
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setShowHelp(!showHelp)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Info className="w-4 h-4" />
            {t.help}
          </Button>
          
          <Button
            onClick={handleSyncWithExistingFields}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            {language === 'fr' ? 'Synchroniser' : 'Synchronize'}
          </Button>
        </div>
      </div>

      {/* Message d'aide */}
      {showHelp && (
        <Alert className="border-blue-300 bg-blue-50">
          <Info className="h-5 w-5 text-blue-700" />
          <AlertDescription className="text-blue-900 text-base leading-relaxed">
            <strong>{language === 'fr' ? 'Dépenses saisonnières :' : 'Seasonal expenses:'}</strong> 
            {language === 'fr' 
              ? ' Planifiez vos dépenses récurrentes selon les saisons (entretien auto, jardinage, chauffage, etc.)'
              : ' Plan your recurring expenses by season (car maintenance, gardening, heating, etc.)'
            }
            <br /><br />
            <strong>{language === 'fr' ? 'Dépenses irrégulières :' : 'Irregular expenses:'}</strong>
            {language === 'fr'
              ? ' Gérez vos taxes, assurances et autres dépenses non-mensuelles avec rappels automatiques.'
              : ' Manage your taxes, insurance and other non-monthly expenses with automatic reminders.'
            }
            <br /><br />
            <strong>{language === 'fr' ? 'Synchronisation :' : 'Synchronization:'}</strong>
            {language === 'fr'
              ? ' Les dépenses liées (ex: taxes municipales) se synchronisent automatiquement avec vos champs de dépenses existants.'
              : ' Linked expenses (e.g. municipal taxes) automatically sync with your existing expense fields.'
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-700">{t.monthlyEquivalent}</p>
              <p className="text-3xl font-bold text-blue-900">{formatCurrency(totalMonthly)}</p>
              <p className="text-xs text-blue-600">{language === 'fr' ? 'À prévoir chaque mois' : 'To plan each month'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-green-700">{t.totalAnnual}</p>
              <p className="text-3xl font-bold text-green-900">{formatCurrency(totalAnnual)}</p>
              <p className="text-xs text-green-600">{language === 'fr' ? 'Total sur 12 mois' : 'Total over 12 months'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-orange-700">{language === 'fr' ? 'Épargne requise' : 'Required savings'}</p>
              <p className="text-3xl font-bold text-orange-900">{formatCurrency(totalMonthly)}</p>
              <p className="text-xs text-orange-600">{language === 'fr' ? 'Compte dédié recommandé' : 'Dedicated account recommended'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation par onglets */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="seasonal" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t.seasonal}
              </TabsTrigger>
              <TabsTrigger value="irregular" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t.irregular}
              </TabsTrigger>
              <TabsTrigger value="governmental" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                {t.governmental}
              </TabsTrigger>
            </TabsList>

            {/* Onglet Dépenses Saisonnières */}
            <TabsContent value="seasonal" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Printemps */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Flower className="w-5 h-5 text-green-500" />
                      {t.spring}
                    </CardTitle>
                    <CardDescription>Mars - Mai</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {expenses.filter(e => e.season === 'spring').map(expense => (
                      <div key={expense.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(expense.category)}
                          <div>
                            <p className="text-sm font-medium">{expense.name}</p>
                            <p className="text-xs text-gray-500">{expense.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{formatCurrency(calculateMonthlyEquivalent(expense.amount, expense.frequency))}</p>
                          <p className="text-xs text-gray-500">/mois</p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>{language === 'fr' ? 'Total mensuel' : 'Monthly total'}</span>
                        <span>{formatCurrency(totals.spring)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Été */}
                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sun className="w-5 h-5 text-yellow-500" />
                      {t.summer}
                    </CardTitle>
                    <CardDescription>Juin - Août</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {expenses.filter(e => e.season === 'summer').map(expense => (
                      <div key={expense.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(expense.category)}
                          <div>
                            <p className="text-sm font-medium">{expense.name}</p>
                            <p className="text-xs text-gray-500">{expense.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{formatCurrency(calculateMonthlyEquivalent(expense.amount, expense.frequency))}</p>
                          <p className="text-xs text-gray-500">/mois</p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>{language === 'fr' ? 'Total mensuel' : 'Monthly total'}</span>
                        <span>{formatCurrency(totals.summer)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Automne */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-orange-500" />
                      {t.fall}
                    </CardTitle>
                    <CardDescription>Septembre - Novembre</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {expenses.filter(e => e.season === 'fall').map(expense => (
                      <div key={expense.id} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(expense.category)}
                          <div>
                            <p className="text-sm font-medium">{expense.name}</p>
                            <p className="text-xs text-gray-500">{expense.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{formatCurrency(calculateMonthlyEquivalent(expense.amount, expense.frequency))}</p>
                          <p className="text-xs text-gray-500">/mois</p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>{language === 'fr' ? 'Total mensuel' : 'Monthly total'}</span>
                        <span>{formatCurrency(totals.fall)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hiver */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Snowflake className="w-5 h-5 text-blue-500" />
                      {t.winter}
                    </CardTitle>
                    <CardDescription>Décembre - Février</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {expenses.filter(e => e.season === 'winter').map(expense => (
                      <div key={expense.id} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(expense.category)}
                          <div>
                            <p className="text-sm font-medium">{expense.name}</p>
                            <p className="text-xs text-gray-500">{expense.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{formatCurrency(calculateMonthlyEquivalent(expense.amount, expense.frequency))}</p>
                          <p className="text-xs text-gray-500">/mois</p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>{language === 'fr' ? 'Total mensuel' : 'Monthly total'}</span>
                        <span>{formatCurrency(totals.winter)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Dépenses Irrégulières */}
            <TabsContent value="irregular" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{language === 'fr' ? 'Dépenses Occasionnelles' : 'Occasional Expenses'}</CardTitle>
                    <CardDescription>{language === 'fr' ? 'Réparations et remplacements' : 'Repairs and replacements'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">{language === 'fr' ? 'Réparations majeures' : 'Major repairs'}</Label>
                      <Input
                        type="number"
                        placeholder={formatCurrency(2000)}
                        className="text-lg p-3"
                      />
                      <p className="text-sm text-gray-600">{language === 'fr' ? 'Toiture, plomberie, électricité' : 'Roof, plumbing, electrical'}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">{language === 'fr' ? 'Remplacement électroménagers' : 'Appliance replacement'}</Label>
                      <Input
                        type="number"
                        placeholder={formatCurrency(1500)}
                        className="text-lg p-3"
                      />
                      <p className="text-sm text-gray-600">{language === 'fr' ? 'Réfrigérateur, laveuse, sécheuse' : 'Refrigerator, washer, dryer'}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{language === 'fr' ? 'Soins de Santé' : 'Healthcare'}</CardTitle>
                    <CardDescription>{language === 'fr' ? 'Soins spécialisés et équipements' : 'Specialized care and equipment'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">{language === 'fr' ? 'Soins dentaires majeurs' : 'Major dental care'}</Label>
                      <Input
                        type="number"
                        placeholder={formatCurrency(3000)}
                        className="text-lg p-3"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">{language === 'fr' ? 'Équipements médicaux' : 'Medical equipment'}</Label>
                      <Input
                        type="number"
                        placeholder={formatCurrency(1000)}
                        className="text-lg p-3"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Dépenses Gouvernementales */}
            <TabsContent value="governmental" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Taxes et Impôts */}
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="w-5 h-5 text-red-500" />
                      {language === 'fr' ? 'Taxes et Impôts' : 'Taxes'}
                    </CardTitle>
                    <CardDescription>{language === 'fr' ? 'Obligations gouvernementales' : 'Government obligations'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {expenses.filter(e => e.category === 'taxes').map(expense => (
                      <div key={expense.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-red-500" />
                            <div>
                              <p className="font-medium text-red-800">{expense.name}</p>
                              <p className="text-sm text-red-600">{expense.description}</p>
                            </div>
                          </div>
                          {expense.linkedField && (
                            <Badge variant="outline" className="text-xs">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              {language === 'fr' ? 'Synchronisé' : 'Synced'}
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {language === 'fr' ? 'Équivalent mensuel' : 'Monthly equivalent'}
                          </span>
                          <span className="font-bold text-red-700">
                            {formatCurrency(calculateMonthlyEquivalent(expense.amount, expense.frequency))}
                          </span>
                        </div>
                        {expense.linkedField && (
                          <Alert className="mt-2 border-orange-200 bg-orange-50">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <AlertDescription className="text-orange-800 text-xs">
                              {t.syncWarning}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Assurances */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-500" />
                      {language === 'fr' ? 'Assurances Annuelles' : 'Annual Insurance'}
                    </CardTitle>
                    <CardDescription>{language === 'fr' ? 'Renouvellements et révisions' : 'Renewals and reviews'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {expenses.filter(e => e.category === 'insurance').map(expense => (
                      <div key={expense.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <div>
                              <p className="font-medium text-blue-800">{expense.name}</p>
                              <p className="text-sm text-blue-600">{expense.description}</p>
                            </div>
                          </div>
                          {expense.linkedField && (
                            <Badge variant="outline" className="text-xs">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              {language === 'fr' ? 'Synchronisé' : 'Synced'}
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {language === 'fr' ? 'Équivalent mensuel' : 'Monthly equivalent'}
                          </span>
                          <span className="font-bold text-blue-700">
                            {formatCurrency(calculateMonthlyEquivalent(expense.amount, expense.frequency))}
                          </span>
                        </div>
                        {expense.linkedField && (
                          <Alert className="mt-2 border-orange-200 bg-orange-50">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <AlertDescription className="text-orange-800 text-xs">
                              {t.syncWarning}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Résumé des synchronisations */}
              <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                    {language === 'fr' ? 'Synchronisation avec Dépenses Existantes' : 'Sync with Existing Expenses'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'fr' 
                      ? 'Ces montants seront ajoutés aux champs correspondants lors de la synchronisation'
                      : 'These amounts will be added to corresponding fields during synchronization'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(syncedFields).map(([field, amount]) => (
                      <div key={field} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">
                            {field === 'logement' ? (language === 'fr' ? 'Logement' : 'Housing') : 
                             field === 'assurances' ? (language === 'fr' ? 'Assurances' : 'Insurance') : field}
                          </span>
                        </div>
                        <span className="font-bold text-green-600">+{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeasonalIrregularExpensesModule;
