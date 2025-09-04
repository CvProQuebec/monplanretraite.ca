import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import SeniorsFriendlyInput from '../forms/SeniorsFriendlyInput';
import SeniorsAmountDisplay from '../display/SeniorsAmountDisplay';
import SeniorsHelpTooltip from './SeniorsHelpTooltip';
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
import SeniorsTaxManagementModule from './SeniorsTaxManagementModule';

interface TaxPayment {
  id: string;
  date: string;
  amount: number;
  isPaid: boolean;
}

interface MunicipalTaxData {
  totalAmount: number;
  municipality: string;
  year: number;
  payments: TaxPayment[];
  customDates: boolean;
}

interface SchoolTaxData {
  totalAmount: number;
  year: number;
  payments: TaxPayment[];
}

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
  linkedField?: string;
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
  
  // États pour les données de taxes
  const [municipalTaxData, setMunicipalTaxData] = useState<MunicipalTaxData>({
    totalAmount: 3600,
    municipality: 'montreal',
    year: 2025,
    payments: [],
    customDates: false
  });
  
  const [schoolTaxData, setSchoolTaxData] = useState<SchoolTaxData>({
    totalAmount: 800,
    year: 2025,
    payments: []
  });

  const t = {
    title: language === 'fr' ? 'Dépenses saisonnières et irrégulières' : 'Seasonal and Irregular Expenses',
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
      ? 'Cette dépense sera automatiquement ajoutée à votre section Logement lors de la synchronisation.'
      : 'This expense will be automatically added to your Housing section during synchronization.',
    help: language === 'fr' ? 'Aide' : 'Help'
  };

  // Template des dépenses saisonnières
  const seasonalExpensesTemplate: ExpenseItem[] = [
    // Printemps
    {
      id: 'spring-oil-change',
      name: language === 'fr' ? 'Changement d\'huile (mars/avril)' : 'Oil change (March/April)',
      amount: 80,
      frequency: 'annual',
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
      description: language === 'fr' ? 'Taille et élagage' : 'Trimming and pruning'
    },
    // Été
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
      id: 'summer-gardening',
      name: language === 'fr' ? 'Fleurs, légumes, semences' : 'Flowers, vegetables, seeds',
      amount: 300,
      frequency: 'annual',
      season: 'summer',
      category: 'garden-landscaping',
      description: language === 'fr' ? 'Plantation et entretien' : 'Planting and maintenance'
    },
    {
      id: 'summer-lawn-maintenance',
      name: language === 'fr' ? 'Entretien tondeuse-tracteur' : 'Lawnmower-tractor maintenance',
      amount: 200,
      frequency: 'annual',
      season: 'summer',
      category: 'lawn',
      description: language === 'fr' ? 'Réparation et entretien' : 'Repair and maintenance'
    },
    // Automne
    {
      id: 'fall-oil-change',
      name: language === 'fr' ? 'Changement d\'huile (automne)' : 'Oil change (autumn)',
      amount: 80,
      frequency: 'annual',
      season: 'fall',
      category: 'automobile',
      description: language === 'fr' ? 'Préparation hivernale' : 'Winter preparation'
    },
    {
      id: 'fall-winter-tires',
      name: language === 'fr' ? 'Pneus d\'hiver' : 'Winter tires',
      amount: 800,
      frequency: 'annual',
      season: 'fall',
      category: 'automobile',
      description: language === 'fr' ? 'Changement et entreposage' : 'Change and storage'
    },
    {
      id: 'fall-pool-closing',
      name: language === 'fr' ? 'Fermeture piscine' : 'Pool closing',
      amount: 200,
      frequency: 'annual',
      season: 'fall',
      category: 'pool-spa',
      description: language === 'fr' ? 'Hivernage et protection' : 'Winterizing and protection'
    },
    // Hiver
    {
      id: 'winter-heating-extra',
      name: language === 'fr' ? 'Surcoût chauffage hivernal' : 'Winter heating surcharge',
      amount: 1800,
      frequency: 'annual',
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
      category: 'winter-prep',
      description: language === 'fr' ? 'Paiements septembre et janvier' : 'Payments September and January'
    },
    {
      id: 'winter-christmas-gifts',
      name: language === 'fr' ? 'Cadeaux de Noël' : 'Christmas gifts',
      amount: 800,
      frequency: 'annual',
      season: 'winter',
      category: 'celebrations',
      description: language === 'fr' ? 'Période des Fêtes' : 'Holiday season'
    }
  ];

  // Template des dépenses gouvernementales
  const governmentalExpensesTemplate: ExpenseItem[] = [
    {
      id: 'municipal-taxes',
      name: language === 'fr' ? 'Taxes municipales' : 'Municipal taxes',
      amount: 3600,
      frequency: 'annual',
      category: 'taxes',
      linkedField: 'logement',
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
      linkedField: 'assurances',
      isGovernmental: false
    },
    {
      id: 'vehicle-insurance',
      name: language === 'fr' ? 'Assurance véhicule' : 'Vehicle insurance',
      amount: 1800,
      frequency: 'annual',
      category: 'insurance',
      linkedField: 'assurances',
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
      default: return amount;
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

  // Gestion des taxes municipales
  const handleMunicipalTaxUpdate = (updatedData: MunicipalTaxData) => {
    setMunicipalTaxData(updatedData);
  };

  // Gestion des taxes scolaires
  const handleSchoolTaxUpdate = (updatedData: SchoolTaxData) => {
    setSchoolTaxData(updatedData);
  };

  // Synchronisation avec le logement
  const handleSyncToHousing = () => {
    const updates = {
      logement: municipalTaxData.totalAmount / 12,
      logementBreakdown: {
        taxesMunicipales: municipalTaxData.totalAmount / 12
      }
    };
    onUpdate(updates);
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
    <div className="space-y-8 bg-white p-6 rounded-lg border-2 border-gray-300">
      {/* En-tête - Standards Seniors Stricts */}
      <div className="text-center border-b-2 border-gray-400 pb-6">
        <h2 className="text-3xl font-bold text-black mb-4">
          {t.title}
        </h2>
        <p className="text-lg text-black max-w-3xl mx-auto mb-6">
          {t.subtitle}
        </p>
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setShowHelp(!showHelp)}
            variant="outline"
            className="flex items-center gap-2 h-16 px-8 text-lg font-bold border-2 border-black bg-white text-black hover:bg-gray-100"
          >
            <Info className="w-6 h-6" />
            {t.help}
          </Button>
          
          <Button
            onClick={() => {}}
            className="flex items-center gap-2 h-16 px-8 text-lg font-bold bg-black text-white hover:bg-gray-800 border-2 border-black"
          >
            <RefreshCw className="w-6 h-6" />
            {language === 'fr' ? 'Synchroniser' : 'Synchronize'}
          </Button>
        </div>
      </div>

      {/* Message d'aide - Version Seniors */}
      {showHelp && (
        <Alert className="border-2 border-blue-400 bg-blue-50">
          <Info className="h-6 w-6 text-blue-700" />
          <AlertDescription className="text-blue-900 text-lg leading-relaxed">
            <strong className="text-xl">{language === 'fr' ? 'Dépenses saisonnières :' : 'Seasonal expenses:'}</strong> 
            <br />
            {language === 'fr' 
              ? 'Planifiez vos dépenses récurrentes selon les saisons (entretien auto, jardinage, chauffage, etc.)'
              : 'Plan your recurring expenses by season (car maintenance, gardening, heating, etc.)'
            }
            <br /><br />
            <strong className="text-xl">{language === 'fr' ? 'Dépenses irrégulières :' : 'Irregular expenses:'}</strong>
            <br />
            {language === 'fr'
              ? 'Gérez vos taxes, assurances et autres dépenses non-mensuelles avec rappels automatiques.'
              : 'Manage your taxes, insurance and other non-monthly expenses with automatic reminders.'
            }
            <br /><br />
            <strong className="text-xl">{language === 'fr' ? 'Synchronisation :' : 'Synchronization:'}</strong>
            <br />
            {language === 'fr'
              ? 'Les dépenses liées (ex: taxes municipales) se synchronisent automatiquement avec vos champs de dépenses existants.'
              : 'Linked expenses (e.g. municipal taxes) automatically sync with your existing expense fields.'
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Métriques principales - Standards Seniors Stricts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-black p-6 text-center">
          <p className="text-xl font-bold text-black mb-3">{t.monthlyEquivalent}</p>
          <div className="text-4xl font-bold text-black mb-3">
            {totalMonthly.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
          </div>
          <p className="text-lg text-black">{language === 'fr' ? 'À prévoir chaque mois' : 'To plan each month'}</p>
        </div>

        <div className="bg-white border-2 border-black p-6 text-center">
          <p className="text-xl font-bold text-black mb-3">{t.totalAnnual}</p>
          <div className="text-4xl font-bold text-black mb-3">
            {totalAnnual.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
          </div>
          <p className="text-lg text-black">{language === 'fr' ? 'Total sur 12 mois' : 'Total over 12 months'}</p>
        </div>

        <div className="bg-white border-2 border-black p-6 text-center">
          <p className="text-xl font-bold text-black mb-3">{language === 'fr' ? 'Épargne requise' : 'Required savings'}</p>
          <div className="text-4xl font-bold text-black mb-3">
            {totalMonthly.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
          </div>
          <p className="text-lg text-black">{language === 'fr' ? 'Compte dédié recommandé' : 'Dedicated account recommended'}</p>
        </div>
      </div>

      {/* Navigation par onglets - Standards Seniors Stricts */}
      <div className="bg-white border-2 border-black p-6">
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            onClick={() => setActiveTab('seasonal')}
            className={`h-16 px-4 text-lg font-bold border-2 border-black ${
              activeTab === 'seasonal' 
                ? 'bg-black text-white' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {t.seasonal}
          </button>
          <button
            onClick={() => setActiveTab('irregular')}
            className={`h-16 px-4 text-lg font-bold border-2 border-black ${
              activeTab === 'irregular' 
                ? 'bg-black text-white' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {t.irregular}
          </button>
          <button
            onClick={() => setActiveTab('governmental')}
            className={`h-16 px-4 text-lg font-bold border-2 border-black ${
              activeTab === 'governmental' 
                ? 'bg-black text-white' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {t.governmental}
          </button>
        </div>

        {/* Onglet Dépenses Saisonnières - Standards Seniors Stricts */}
        {activeTab === 'seasonal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Printemps - Standards Seniors Stricts */}
              <div className="bg-white border-2 border-black p-4">
                <h3 className="text-xl font-bold text-black mb-3 text-center">
                  {t.spring}
                </h3>
                <p className="text-lg text-black mb-4 text-center">Mars - Mai</p>
                <div className="space-y-3">
                  {expenses.filter(e => e.season === 'spring').map(expense => (
                    <div key={expense.id} className="bg-gray-100 border border-black p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-black">{expense.name}</p>
                          <p className="text-base text-black">{expense.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-black">
                            {calculateMonthlyEquivalent(expense.amount, expense.frequency).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </div>
                          <p className="text-base text-black">/mois</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t-2 border-black pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-black">{language === 'fr' ? 'Total mensuel' : 'Monthly total'}</span>
                      <div className="text-xl font-bold text-black">
                        {totals.spring.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Été - Standards Seniors Stricts */}
              <div className="bg-white border-2 border-black p-4">
                <h3 className="text-xl font-bold text-black mb-3 text-center">
                  {t.summer}
                </h3>
                <p className="text-lg text-black mb-4 text-center">Juin - Août</p>
                <div className="space-y-3">
                  {expenses.filter(e => e.season === 'summer').map(expense => (
                    <div key={expense.id} className="bg-gray-100 border border-black p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-black">{expense.name}</p>
                          <p className="text-base text-black">{expense.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-black">
                            {calculateMonthlyEquivalent(expense.amount, expense.frequency).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </div>
                          <p className="text-base text-black">/mois</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t-2 border-black pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-black">{language === 'fr' ? 'Total mensuel' : 'Monthly total'}</span>
                      <div className="text-xl font-bold text-black">
                        {totals.summer.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automne - Standards Seniors Stricts */}
              <div className="bg-white border-2 border-black p-4">
                <h3 className="text-xl font-bold text-black mb-3 text-center">
                  {t.fall}
                </h3>
                <p className="text-lg text-black mb-4 text-center">Septembre - Novembre</p>
                <div className="space-y-3">
                  {expenses.filter(e => e.season === 'fall').map(expense => (
                    <div key={expense.id} className="bg-gray-100 border border-black p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-black">{expense.name}</p>
                          <p className="text-base text-black">{expense.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-black">
                            {calculateMonthlyEquivalent(expense.amount, expense.frequency).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </div>
                          <p className="text-base text-black">/mois</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t-2 border-black pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-black">{language === 'fr' ? 'Total mensuel' : 'Monthly total'}</span>
                      <div className="text-xl font-bold text-black">
                        {totals.fall.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hiver - Standards Seniors Stricts */}
              <div className="bg-white border-2 border-black p-4">
                <h3 className="text-xl font-bold text-black mb-3 text-center">
                  {t.winter}
                </h3>
                <p className="text-lg text-black mb-4 text-center">Décembre - Février</p>
                <div className="space-y-3">
                  {expenses.filter(e => e.season === 'winter').map(expense => (
                    <div key={expense.id} className="bg-gray-100 border border-black p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-black">{expense.name}</p>
                          <p className="text-base text-black">{expense.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-black">
                            {calculateMonthlyEquivalent(expense.amount, expense.frequency).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </div>
                          <p className="text-base text-black">/mois</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t-2 border-black pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-black">{language === 'fr' ? 'Total mensuel' : 'Monthly total'}</span>
                      <div className="text-xl font-bold text-black">
                        {totals.winter.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Dépenses Irrégulières - Standards Seniors Stricts */}
        {activeTab === 'irregular' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-black p-6">
                <h3 className="text-xl font-bold text-black mb-4">{language === 'fr' ? 'Dépenses Occasionnelles' : 'Occasional Expenses'}</h3>
                <p className="text-lg text-black mb-6">{language === 'fr' ? 'Réparations et remplacements' : 'Repairs and replacements'}</p>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-lg font-bold text-black block">{language === 'fr' ? 'Réparations majeures' : 'Major repairs'}</label>
                    <input
                      type="number"
                      placeholder="2000"
                      className="w-full h-16 px-4 text-lg font-bold border-2 border-black bg-white text-black"
                    />
                    <p className="text-base text-black">{language === 'fr' ? 'Toiture, plomberie, électricité' : 'Roof, plumbing, electrical'}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-lg font-bold text-black block">{language === 'fr' ? 'Remplacement électroménagers' : 'Appliance replacement'}</label>
                    <input
                      type="number"
                      placeholder="1500"
                      className="w-full h-16 px-4 text-lg font-bold border-2 border-black bg-white text-black"
                    />
                    <p className="text-base text-black">{language === 'fr' ? 'Réfrigérateur, laveuse, sécheuse' : 'Refrigerator, washer, dryer'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-black p-6">
                <h3 className="text-xl font-bold text-black mb-4">{language === 'fr' ? 'Soins de Santé' : 'Healthcare'}</h3>
                <p className="text-lg text-black mb-6">{language === 'fr' ? 'Soins spécialisés et équipements' : 'Specialized care and equipment'}</p>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-lg font-bold text-black block">{language === 'fr' ? 'Soins dentaires majeurs' : 'Major dental care'}</label>
                    <input
                      type="number"
                      placeholder="3000"
                      className="w-full h-16 px-4 text-lg font-bold border-2 border-black bg-white text-black"
                    />
                    <p className="text-base text-black">{language === 'fr' ? 'Couronnes, implants, prothèses' : 'Crowns, implants, dentures'}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-lg font-bold text-black block">{language === 'fr' ? 'Équipements médicaux' : 'Medical equipment'}</label>
                    <input
                      type="number"
                      placeholder="1000"
                      className="w-full h-16 px-4 text-lg font-bold border-2 border-black bg-white text-black"
                    />
                    <p className="text-base text-black">{language === 'fr' ? 'Fauteuil roulant, déambulateur, oxygène' : 'Wheelchair, walker, oxygen'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Dépenses Gouvernementales - Standards Seniors Stricts */}
        {activeTab === 'governmental' && (
          <div className="space-y-6">
            {/* Module de gestion des taxes - Version Seniors */}
            <SeniorsTaxManagementModule
              municipalTaxData={municipalTaxData}
              schoolTaxData={schoolTaxData}
              onMunicipalTaxUpdate={handleMunicipalTaxUpdate}
              onSchoolTaxUpdate={handleSchoolTaxUpdate}
              onSyncToHousing={handleSyncToHousing}
              language={language}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assurances - Standards Seniors Stricts */}
              <div className="bg-white border-2 border-black p-6">
                <h3 className="text-xl font-bold text-black mb-4">{language === 'fr' ? 'Assurances Annuelles' : 'Annual Insurance'}</h3>
                <p className="text-lg text-black mb-6">{language === 'fr' ? 'Renouvellements et révisions' : 'Renewals and reviews'}</p>
                
                <div className="space-y-4">
                  {expenses.filter(e => e.category === 'insurance').map(expense => (
                    <div key={expense.id} className="bg-gray-100 border-2 border-black p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-lg font-bold text-black">{expense.name}</p>
                          <p className="text-base text-black">{expense.description}</p>
                        </div>
                        {expense.linkedField && (
                          <span className="text-base font-bold text-black bg-yellow-200 px-3 py-1 border border-black">
                            {language === 'fr' ? 'Synchronisé' : 'Synced'}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-black">
                          {language === 'fr' ? 'Équivalent mensuel' : 'Monthly equivalent'}
                        </span>
                        <div className="text-lg font-bold text-black">
                          {calculateMonthlyEquivalent(expense.amount, expense.frequency).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Résumé des synchronisations - Standards Seniors Stricts */}
            <div className="bg-white border-2 border-black p-6">
              <h3 className="text-xl font-bold text-black mb-4">{language === 'fr' ? 'Synchronisation avec Dépenses Existantes' : 'Sync with Existing Expenses'}</h3>
              <p className="text-lg text-black mb-6">
                {language === 'fr' 
                  ? 'Ces montants seront ajoutés aux champs correspondants lors de la synchronisation'
                  : 'These amounts will be added to corresponding fields during synchronization'
                }
              </p>
              
              <div className="space-y-4">
                {Object.entries(syncedFields).map(([field, amount]) => (
                  <div key={field} className="flex justify-between items-center p-4 bg-gray-100 border-2 border-black">
                    <div className="flex items-center gap-3">
                      <Home className="w-5 h-5 text-black" />
                      <span className="text-lg font-bold text-black">
                        {field === 'logement' ? (language === 'fr' ? 'Logement' : 'Housing') : 
                         field === 'assurances' ? (language === 'fr' ? 'Assurances' : 'Insurance') : field}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-black">
                      +{amount.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonalIrregularExpensesModule;