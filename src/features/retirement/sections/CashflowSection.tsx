// src/features/retirement/sections/CashflowSection.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  TrendingUp,
  DollarSign,
  Home,
  Zap,
  Phone,
  ShoppingCart,
  Car,
  Heart,
  Gamepad2,
  Info,
  Calculator,
  PiggyBank,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Shield,
  Plus,
  X,
  Settings,
  Target,
  Calendar,
  Snowflake,
  Flame,
  Plane,
  Sun,
  Wind,
  Waves,
  Leaf,
  GraduationCap,
  Flower
} from 'lucide-react';
import { UserData } from '../types';
import { formatMontantOQLF } from '@/utils/formatters';
import { useLanguage } from '../hooks/useLanguage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building,
  Receipt,
  Wrench,
  FileText
} from 'lucide-react';

interface CashflowSectionProps {
  data: UserData;
  onUpdate: (section: keyof UserData, updates: any) => void;
}

// Composant pour la ventilation des dépenses
interface ExpenseBreakdownProps {
  title: string;
  total: number;
  breakdown: Record<string, number>;
  onUpdate: (breakdown: Record<string, number>) => void;
  categories: { key: string; label: string; icon: React.ReactNode }[];
}

const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({
  title,
  total,
  breakdown,
  onUpdate,
  categories
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localBreakdown, setLocalBreakdown] = useState(breakdown);

  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');

  const handleChange = (key: string, value: number) => {
    const newBreakdown = { ...localBreakdown, [key]: value };
    setLocalBreakdown(newBreakdown);
  };

  const handleSave = () => {
    onUpdate(localBreakdown);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalBreakdown(breakdown);
    setIsOpen(false);
  };

  const calculatedTotal = Object.values(localBreakdown).reduce((sum, value) => sum + (value || 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs px-3 py-2 h-auto bg-gradient-to-r from-blue-500 to-indigo-600 border-0 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Settings className="w-3 h-3 mr-2" />
          {isFrench ? 'Ventiler' : 'Breakdown'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50 to-indigo-100 border-0 shadow-2xl">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ✨ {isFrench ? 'Ventilation' : 'Breakdown'} : {title}
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            {isFrench 
              ? 'Détaillez vos dépenses par sous-catégorie pour une analyse précise'
              : 'Detail your expenses by subcategory for precise analysis'
            }
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonne de gauche - Résumé visuel */}
          <div className="space-y-6">
            {/* Total actuel avec design créatif */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              <div className="relative z-10 text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg font-medium text-blue-100">
                    {isFrench ? 'Total actuel' : 'Current Total'}
                  </p>
                </div>
                <p className="text-4xl font-bold text-white drop-shadow-lg">
                  {isFrench ? formatMontantOQLF(total) : `$${total.toLocaleString()}`}
                </p>
                <p className="text-sm text-blue-100 bg-white/10 rounded-full px-4 py-2 inline-block">
                  {isFrench ? 'Montant saisi manuellement' : 'Manually entered amount'}
                </p>
              </div>
            </div>

            {/* Total calculé avec design créatif */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 text-white shadow-xl">
              <div className="absolute top-0 left-0 w-28 h-28 bg-white/10 rounded-full -translate-y-14 -translate-x-14"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 translate-x-10"></div>
              <div className="relative z-10 text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg font-medium text-emerald-100">
                    {isFrench ? 'Total calculé' : 'Calculated Total'}
                  </p>
                </div>
                <p className="text-4xl font-bold text-white drop-shadow-lg">
                  {isFrench ? formatMontantOQLF(calculatedTotal) : `$${calculatedTotal.toLocaleString()}`}
                </p>
                <p className="text-sm text-emerald-100 bg-white/10 rounded-full px-4 py-2 inline-block">
                  {isFrench ? 'Somme des sous-catégories' : 'Sum of subcategories'}
                </p>
              </div>
            </div>

            {/* Indicateur de différence avec animation */}
            {Math.abs(total - calculatedTotal) > 0.01 && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 text-white shadow-xl animate-pulse">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="relative z-10 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-lg font-medium text-amber-100">
                      {isFrench ? 'Différence détectée' : 'Difference Detected'}
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-white drop-shadow-lg">
                    {isFrench ? formatMontantOQLF(Math.abs(total - calculatedTotal)) : `$${Math.abs(total - calculatedTotal).toLocaleString()}`}
                  </p>
                  <p className="text-sm text-amber-100 bg-white/10 rounded-full px-4 py-2 inline-block">
                    {isFrench 
                      ? 'Total manuel ≠ Total calculé'
                      : 'Manual ≠ Calculated'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Indicateur de correspondance parfaite */}
            {Math.abs(total - calculatedTotal) <= 0.01 && total > 0 && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 p-6 text-white shadow-xl">
                <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 -translate-x-10"></div>
                <div className="relative z-10 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-lg font-medium text-green-100">
                      {isFrench ? 'Parfait !' : 'Perfect!'}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-white drop-shadow-lg">
                    {isFrench ? 'Totaux synchronisés' : 'Totals Synced'}
                  </p>
                  <p className="text-sm text-green-100 bg-white/10 rounded-full px-4 py-2 inline-block">
                    {isFrench ? '✅ Correspondance exacte' : '✅ Exact match'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Colonne de droite - Détails avec design amélioré */}
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {isFrench ? '🎯 Sous-catégories détaillées' : '🎯 Detailed Subcategories'}
              </h3>
              <p className="text-gray-600">
                {isFrench 
                  ? 'Saisissez les montants pour chaque sous-catégorie'
                  : 'Enter amounts for each subcategory'
                }
              </p>
            </div>

            <div className="space-y-4">
              {categories.map((category, index) => (
                <div 
                  key={category.key} 
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white to-gray-50 p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300"
                >
                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 space-y-3">
                    <Label className="flex items-center gap-3 text-base font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                        {category.icon}
                      </div>
                      <span className="text-lg">{category.label}</span>
                    </Label>
                    
                    <div className="relative">
                      <Input
                        type="number"
                        value={localBreakdown[category.key] || ''}
                        onChange={(e) => handleChange(category.key, parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-4 bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-300 hover:border-blue-300"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        $
                      </div>
                    </div>

                    {/* Indicateur visuel de saisie */}
                    {localBreakdown[category.key] && localBreakdown[category.key] > 0 && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>
                          {isFrench 
                            ? `Saisi : ${formatMontantOQLF(localBreakdown[category.key])}`
                            : `Entered: $${localBreakdown[category.key].toLocaleString()}`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé des totaux en temps réel */}
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-indigo-700">
                  {isFrench ? 'Résumé en temps réel' : 'Real-time Summary'}
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-indigo-600">
                      {isFrench ? 'Sous-catégories' : 'Subcategories'}
                    </p>
                    <p className="text-lg font-bold text-indigo-800">
                      {Object.keys(localBreakdown).length}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-indigo-300"></div>
                  <div className="text-center">
                    <p className="text-xs text-indigo-600">
                      {isFrench ? 'Total saisi' : 'Total Entered'}
                    </p>
                    <p className="text-lg font-bold text-indigo-800">
                      {isFrench ? formatMontantOQLF(calculatedTotal) : `$${calculatedTotal.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action avec design amélioré */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-8">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="px-6 py-3 text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 rounded-lg font-medium"
          >
            <X className="w-4 h-4 mr-2" />
            {isFrench ? 'Annuler' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg font-medium transform hover:scale-105"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {isFrench ? 'Enregistrer' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Composant pour les dépenses saisonnières avancées (intégré depuis AdvancedExpensesSection)
const SeasonalExpensesAdvanced: React.FC<{ data: UserData; onUpdate: (section: keyof UserData, updates: any) => void }> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('seasonal');
  const [selectedSeason, setSelectedSeason] = useState<'winter' | 'summer'>('winter');
  const [selectedBill, setSelectedBill] = useState<string>('taxes');
  const [showHelp, setShowHelp] = useState(false);

  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');

  // Traductions
  const t = {
    title: isFrench ? 'Dépenses saisonnières avancées' : 'Advanced Seasonal Expenses',
    subtitle: isFrench ? 'Planifiez vos dépenses selon les saisons et gérez vos factures complexes' : 'Plan your seasonal expenses and manage complex bills',
    help: isFrench ? 'Aide' : 'Help',
    helpText: isFrench ? 'Ce module vous permet de planifier vos dépenses saisonnières et de gérer vos factures avec des dates de paiement spécifiques. Idéal pour les taxes, l\'électricité variable, et les dépenses comme le déneigement ou l\'aménagement paysager.' : 'This module allows you to plan your seasonal expenses and manage bills with specific payment dates. Ideal for taxes, variable electricity, and expenses like snow removal or landscaping.',
    seasonal: isFrench ? 'Saisonnières' : 'Seasonal',
    complex: isFrench ? 'Factures complexes' : 'Complex Bills',
    monthly: isFrench ? 'Vue mensuelle' : 'Monthly View',
    weekly: isFrench ? 'Vue hebdomadaire' : 'Weekly View',
    winter: isFrench ? 'Hiver' : 'Winter',
    summer: isFrench ? 'Été' : 'Summer',
    snowRemoval: isFrench ? 'Déneigement' : 'Snow Removal',
    additionalHeating: isFrench ? 'Chauffage supplémentaire' : 'Additional Heating',
    insulation: isFrench ? 'Isolation/Réparations' : 'Insulation/Repairs',
    winterClothing: isFrench ? 'Vêtements d\'hiver' : 'Winter Clothing',
    landscaping: isFrench ? 'Aménagement paysager' : 'Landscaping',
    airConditioning: isFrench ? 'Climatisation' : 'Air Conditioning',
    exteriorMaintenance: isFrench ? 'Entretien extérieur' : 'Exterior Maintenance',
    summerActivities: isFrench ? 'Activités estivales' : 'Summer Activities',
    scheduledPayments: isFrench ? 'Versements programmés' : 'Scheduled Payments',
    amount: isFrench ? 'Montant' : 'Amount',
    totalPayments: isFrench ? 'Total des versements' : 'Total Payments',
    paymentsScheduled: isFrench ? 'versements programmés' : 'payments scheduled',
    payment: isFrench ? 'versement' : 'payment',
    seasonalExpensesSummary: isFrench ? 'Résumé des dépenses saisonnières' : 'Seasonal Expenses Summary',
    winterExpenses: isFrench ? 'Dépenses hivernales' : 'Winter Expenses',
    summerExpenses: isFrench ? 'Dépenses estivales' : 'Summer Expenses',
    taxes: isFrench ? 'Taxes' : 'Taxes',
    variableElectricity: isFrench ? 'Électricité variable' : 'Variable Electricity',
    otherBills: isFrench ? 'Autres factures' : 'Other Bills',
    municipalTaxesTitle: isFrench ? 'Taxes municipales et scolaires' : 'Municipal and School Taxes',
    annualBillsWithDates: isFrench ? 'Factures annuelles avec dates de versement' : 'Annual bills with payment dates',
    municipalTaxes: isFrench ? 'Taxes municipales' : 'Municipal Taxes',
    schoolTaxes: isFrench ? 'Taxes scolaires' : 'School Taxes',
    firstPayment: isFrench ? 'Premier versement' : 'First Payment',
    secondPayment: isFrench ? 'Deuxième versement' : 'Second Payment',
    generallyMarch: isFrench ? '(généralement mars)' : '(generally March)',
    generallyJune: isFrench ? '(généralement juin)' : '(generally June)',
    generallyJuly: isFrench ? '(généralement juillet)' : '(generally July)',
    generallyNovember: isFrench ? '(généralement novembre)' : '(generally November)',
    totalAnnualTaxes: isFrench ? 'Total annuel des taxes' : 'Total Annual Taxes',
    distributedOver: isFrench ? 'Réparti sur' : 'Distributed over',
    payments: isFrench ? 'versements' : 'payments',
    electricityTitle: isFrench ? 'Électricité variable' : 'Variable Electricity',
    bimonthlyBillingWithDates: isFrench ? 'Facturation bimestrielle avec dates' : 'Bimonthly billing with dates',
    winterPeriod: isFrench ? 'Période hivernale' : 'Winter Period',
    summerPeriod: isFrench ? 'Période estivale' : 'Summer Period',
    offSeasonPeriod: isFrench ? 'Période intersaisons' : 'Off-Season Period',
    decemberJanuary: isFrench ? 'Décembre-Janvier' : 'December-January',
    februaryMarch: isFrench ? 'Février-Mars' : 'February-March',
    juneJuly: isFrench ? 'Juin-Juillet' : 'June-July',
    augustSeptember: isFrench ? 'Août-Septembre' : 'August-September',
    aprilMay: isFrench ? 'Avril-Mai' : 'April-May',
    octoberNovember: isFrench ? 'Octobre-Novembre' : 'October-November',
    totalAnnualElectricity: isFrench ? 'Total annuel électricité' : 'Total Annual Electricity',
    distributedOverBills: isFrench ? 'Réparti sur' : 'Distributed over',
    bimonthlyBills: isFrench ? 'factures bimestrielles' : 'bimonthly bills',
    billsWithVariablePeriods: isFrench ? 'Factures avec périodes variables' : 'Bills with variable periods',
    homeInsurance: isFrench ? 'Assurance habitation' : 'Home Insurance',
    autoInsurance: isFrench ? 'Assurance automobile' : 'Auto Insurance',
    cashflowAlerts: isFrench ? 'Alertes de trésorerie' : 'Cashflow Alerts',
    importantPaymentsNext3Months: isFrench ? 'Paiements importants dans les 3 prochains mois' : 'Important payments in the next 3 months'
  };

  const handleChange = (field: string, value: any) => {
    onUpdate('advancedExpenses', { [field]: value });
  };

  const handlePaymentChange = (billType: string, paymentKey: string, field: 'amount' | 'date', value: string | number) => {
    const currentBills = data.advancedExpenses?.complexBills || {};
    const currentPayments = currentBills[`${billType}Payments`] || {};
    
    onUpdate('advancedExpenses', {
      complexBills: { 
        ...currentBills, 
        [`${billType}Payments`]: { 
          ...currentPayments, 
          [paymentKey]: { 
            ...currentPayments[paymentKey], 
            [field]: value 
          } 
        }
      }
    });
  };

  const winterExpenses = [
    { 
      key: 'deneigement', 
      label: t.snowRemoval, 
      icon: <Snowflake className="w-4 h-4 text-blue-500" />,
      payments: [
        { key: 'septembre', label: isFrench ? 'Versement septembre' : 'September payment', date: '2024-09-15' },
        { key: 'janvier', label: isFrench ? 'Versement janvier' : 'January payment', date: '2025-01-15' }
      ]
    },
    { 
      key: 'chauffage', 
      label: t.additionalHeating, 
      icon: <Zap className="w-4 h-4 text-orange-500" />,
      payments: [
        { key: 'novembre', label: isFrench ? 'Versement novembre' : 'November payment', date: '2024-11-01' },
        { key: 'fevrier', label: isFrench ? 'Versement février' : 'February payment', date: '2025-02-01' }
      ]
    },
    { 
      key: 'isolation', 
      label: t.insulation, 
      icon: <Home className="w-4 h-4 text-gray-500" />,
      payments: [
        { key: 'octobre', label: isFrench ? 'Versement octobre' : 'October payment', date: '2024-10-01' }
      ]
    },
    { 
      key: 'vetements', 
      label: t.winterClothing, 
      icon: <ShoppingCart className="w-4 h-4 text-blue-600" />,
      payments: [
        { key: 'novembre', label: isFrench ? 'Versement novembre' : 'November payment', date: '2024-11-15' }
      ]
    }
  ];

  const summerExpenses = [
    { 
      key: 'amenagement', 
      label: t.landscaping, 
      icon: <Leaf className="w-4 h-4 text-green-500" />,
      payments: [
        { key: 'mai', label: isFrench ? 'Versement mai' : 'May payment', date: '2024-05-01' },
        { key: 'juin', label: isFrench ? 'Versement juin' : 'June payment', date: '2024-06-01' }
      ]
    },
    { 
      key: 'climatisation', 
      label: t.airConditioning, 
      icon: <Zap className="w-4 h-4 text-blue-500" />,
      payments: [
        { key: 'juin', label: isFrench ? 'Versement juin' : 'June payment', date: '2024-06-15' }
      ]
    },
    { 
      key: 'entretien', 
      label: t.exteriorMaintenance, 
      icon: <Wrench className="w-4 h-4 text-gray-500" />,
      payments: [
        { key: 'avril', label: isFrench ? 'Versement avril' : 'April payment', date: '2024-04-01' },
        { key: 'septembre', label: isFrench ? 'Versement septembre' : 'September payment', date: '2024-09-01' }
      ]
    },
    { 
      key: 'activites', 
      label: t.summerActivities, 
      icon: <Sun className="w-4 h-4 text-yellow-500" />,
      payments: [
        { key: 'juillet', label: isFrench ? 'Versement juillet' : 'July payment', date: '2024-07-01' },
        { key: 'aout', label: isFrench ? 'Versement août' : 'August payment', date: '2024-08-01' }
      ]
    }
  ];

  const billTypes = [
    { key: 'taxes', label: t.taxes, icon: <Building className="w-4 h-4 text-red-500" /> },
    { key: 'electricite', label: t.variableElectricity, icon: <Zap className="w-4 h-4 text-yellow-500" /> },
    { key: 'autres', label: t.otherBills, icon: <Receipt className="w-4 h-4 text-gray-500" /> }
  ];

  const billsData = data.advancedExpenses?.complexBills || {};
  const expensesData = data.advancedExpenses?.[selectedSeason === 'winter' ? 'winterExpenses' : 'summerExpenses'] || {};
  const currentExpenses = selectedSeason === 'winter' ? winterExpenses : summerExpenses;

  // Fonction pour calculer les alertes de trésorerie
  const calculateCashflowAlerts = () => {
    const alerts = [];
    const currentDate = new Date();
    
    // Vérifier les taxes
    const taxesPayments = billsData.taxesPayments || {};
    Object.entries(taxesPayments).forEach(([key, payment]: [string, any]) => {
      if (payment.date && payment.amount) {
        const paymentDate = new Date(payment.date);
        const monthsDiff = (paymentDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                          (paymentDate.getMonth() - currentDate.getMonth());
        
        if (monthsDiff <= 3 && monthsDiff >= 0) {
          alerts.push({
            type: 'taxes',
            date: payment.date,
            amount: payment.amount,
            monthsAhead: monthsDiff,
            urgency: monthsDiff <= 1 ? 'high' : monthsDiff <= 2 ? 'medium' : 'low'
          });
        }
      }
    });

    // Vérifier l'électricité
    const electricitePayments = billsData.electricitePayments || {};
    Object.entries(electricitePayments).forEach(([key, payment]: [string, any]) => {
      if (payment.date && payment.amount) {
        const paymentDate = new Date(payment.date);
        const monthsDiff = (paymentDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                          (paymentDate.getMonth() - currentDate.getMonth());
        
        if (monthsDiff <= 3 && monthsDiff >= 0) {
          alerts.push({
            type: 'electricite',
            date: payment.date,
            amount: payment.amount,
            monthsAhead: monthsDiff,
            urgency: monthsDiff <= 1 ? 'high' : monthsDiff <= 2 ? 'medium' : 'low'
          });
        }
      }
    });

    return alerts.sort((a, b) => a.monthsAhead - b.monthsAhead);
  };

  const cashflowAlerts = calculateCashflowAlerts();

  return (
    <div className="space-y-6">
      {/* En-tête avec aide */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {t.title}
            </h1>
            <p className="text-lg text-blue-200 mt-1">
              {t.subtitle}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Info className="w-4 h-4 inline mr-2" />
          {t.help}
        </button>
      </div>

      {/* Message d'aide */}
      {showHelp && (
        <Alert className="border-blue-200 bg-blue-50/10 backdrop-blur-sm">
          <Info className="h-5 w-5 text-blue-400" />
          <AlertDescription className="text-blue-200">
            {t.helpText}
          </AlertDescription>
        </Alert>
      )}

      {/* Navigation par onglets */}
      <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm p-1 rounded-lg h-10">
              <TabsTrigger 
                value="seasonal" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium text-white"
              >
                {t.seasonal}
              </TabsTrigger>
              <TabsTrigger 
                value="complex"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium text-white"
              >
                {t.complex}
              </TabsTrigger>
              <TabsTrigger 
                value="monthly"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium text-white"
              >
                {t.monthly}
              </TabsTrigger>
              <TabsTrigger 
                value="weekly"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium text-white"
              >
                {t.weekly}
              </TabsTrigger>
            </TabsList>

            {/* Onglet Dépenses saisonnières */}
            <TabsContent value="seasonal" className="mt-6">
              <div className="space-y-6">
                {/* Sélecteur de saison */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Snowflake className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-blue-200">{t.winter}</span>
                  </div>
                  <Button
                    variant={selectedSeason === 'winter' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSeason('winter')}
                    className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                  >
                    {t.winter}
                  </Button>
                  <Button
                    variant={selectedSeason === 'summer' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSeason('summer')}
                    className="bg-orange-500 hover:bg-orange-600 text-white border-0"
                  >
                    {t.summer}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-orange-400" />
                    <span className="text-sm font-medium text-orange-200">{t.summer}</span>
                  </div>
                </div>

                {/* Dépenses de la saison */}
                <div className="space-y-6">
                  {currentExpenses.map((expense) => {
                    const paymentsData = expensesData[`${expense.key}Payments`] || {};
                    const totalAmount = Object.values(paymentsData).reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0);
                    
                    return (
                      <Card key={expense.key} className="bg-white/10 backdrop-blur-sm border-blue-300/30">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2 text-white">
                            {expense.icon}
                            {expense.label}
                          </CardTitle>
                          <CardDescription className="text-blue-200">
                            {isFrench ? 'Total prévu : ' : 'Planned total: '}{formatMontantOQLF(totalAmount as number)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Versements */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-blue-200">{t.scheduledPayments}</h4>
                            {expense.payments.map((payment) => (
                              <div key={payment.key} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-white/5 rounded-lg">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-blue-200">{payment.label}</Label>
                                  <Input
                                    type="date"
                                    value={paymentsData[payment.key]?.date || payment.date}
                                    onChange={(e) => handlePaymentChange(expense.key, payment.key, 'date', e.target.value)}
                                    className="text-sm bg-white/10 border-blue-300/30 text-white"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-blue-200">{t.amount}</Label>
                                  <Input
                                    type="number"
                                    value={paymentsData[payment.key]?.amount || ''}
                                    onChange={(e) => handlePaymentChange(expense.key, payment.key, 'amount', parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                    className="text-sm bg-white/10 border-blue-300/30 text-white"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Résumé du versement */}
                          <div className="p-3 bg-blue-500/20 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-blue-200">{t.totalPayments}</span>
                              <span className="text-lg font-bold text-blue-100">{formatMontantOQLF(totalAmount as number)}</span>
                            </div>
                            <div className="mt-2 text-xs text-blue-300">
                              {expense.payments.length > 1 
                                ? `${expense.payments.length} ${t.paymentsScheduled}` 
                                : `1 ${t.payment}`
                              }
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Résumé saisonnier */}
                <Card className="bg-gradient-to-r from-blue-500/20 to-orange-500/20 border-blue-300/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">{t.seasonalExpensesSummary}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-blue-300">{t.winterExpenses}</p>
                        <p className="text-2xl font-bold text-blue-200">
                          {formatMontantOQLF(
                            Object.keys(expensesData)
                              .filter(key => key.includes('Payments'))
                              .reduce((sum: number, key) => {
                                const payments = expensesData[key] || {};
                                 const reduceResult = Object.values(payments).reduce((pSum: number, payment: any) => {
                                   const amount = payment && typeof payment === 'object' && 'amount' in payment ? Number(payment.amount) : 0;
                                   return pSum + (amount || 0);
                                 }, 0) as number;
                                 return sum + reduceResult;
                              }, 0)
                          )}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-orange-300">{t.summerExpenses}</p>
                        <p className="text-2xl font-bold text-orange-200">
                          {formatMontantOQLF(
                            Object.keys(expensesData)
                              .filter(key => key.includes('Payments'))
                              .reduce((sum: number, key) => {
                                const payments = expensesData[key] || {};
                                 const reduceResult = Object.values(payments).reduce((pSum: number, payment: any) => {
                                   const amount = payment && typeof payment === 'object' && 'amount' in payment ? Number(payment.amount) : 0;
                                   return pSum + (amount || 0);
                                 }, 0) as number;
                                 return sum + reduceResult;
                               }, 0)
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Factures complexes */}
            <TabsContent value="complex" className="mt-6">
              <div className="space-y-6">
                {/* Alertes de trésorerie */}
                {cashflowAlerts.length > 0 && (
                  <Card className="bg-orange-500/20 backdrop-blur-sm border-orange-300/30">
                    <CardHeader>
                      <CardTitle className="text-lg text-orange-200 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {t.cashflowAlerts}
                      </CardTitle>
                      <CardDescription className="text-orange-300">
                        {t.importantPaymentsNext3Months}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {cashflowAlerts.map((alert, index) => (
                          <div key={index} className={`p-3 rounded-lg border ${
                            alert.urgency === 'high' ? 'bg-red-500/20 border-red-300/30' :
                            alert.urgency === 'medium' ? 'bg-orange-500/20 border-orange-300/30' :
                            'bg-yellow-500/20 border-yellow-300/30'
                          }`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-sm text-white">
                                  {alert.type === 'taxes' ? 'Taxes' : 'Électricité'} - {new Date(alert.date).toLocaleDateString('fr-CA')}
                                </p>
                                <p className="text-sm text-gray-300">
                                  {alert.monthsAhead === 0 ? 'Ce mois-ci' : 
                                   alert.monthsAhead === 1 ? 'Dans 1 mois' : 
                                   `Dans ${alert.monthsAhead} mois`}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg text-white">{formatMontantOQLF(alert.amount)}</p>
                                <p className="text-xs text-gray-300">
                                  {alert.urgency === 'high' ? '⚠️ Urgent' :
                                   alert.urgency === 'medium' ? '⚡ Important' : '📅 À prévoir'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation des factures */}
                <Tabs value={selectedBill} onValueChange={setSelectedBill}>
                  <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm p-1 rounded-lg">
                    {billTypes.map((bill) => (
                      <TabsTrigger
                        key={bill.key}
                        value={bill.key}
                        className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium text-white"
                      >
                        <div className="flex items-center gap-2">
                          {bill.icon}
                          {bill.label}
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="taxes" className="space-y-4 mt-6">
                    <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">{t.municipalTaxesTitle}</CardTitle>
                        <CardDescription className="text-blue-200">{t.annualBillsWithDates}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Versements des taxes */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-sm text-blue-200">{t.scheduledPayments}</h4>
                          
                          {/* Taxes municipales */}
                          <div className="p-4 bg-blue-500/20 rounded-lg">
                            <h5 className="font-medium text-blue-200 mb-3">{t.municipalTaxes}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-blue-200">{t.firstPayment} {t.generallyMarch}</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="date"
                                    value={billsData.taxesPayments?.municipales1?.date || '2024-03-01'}
                                    onChange={(e) => handlePaymentChange('taxes', 'municipales1', 'date', e.target.value)}
                                    className="text-sm bg-white/10 border-blue-300/30 text-white"
                                  />
                                  <Input
                                    type="number"
                                    value={billsData.taxesPayments?.municipales1?.amount || ''}
                                    onChange={(e) => handlePaymentChange('taxes', 'municipales1', 'amount', parseFloat(e.target.value) || 0)}
                                    placeholder="Montant"
                                    className="text-sm bg-white/10 border-blue-300/30 text-white"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-blue-200">{t.secondPayment} {t.generallyJune}</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="date"
                                    value={billsData.taxesPayments?.municipales2?.date || '2024-06-01'}
                                    onChange={(e) => handlePaymentChange('taxes', 'municipales2', 'date', e.target.value)}
                                    className="text-sm bg-white/10 border-blue-300/30 text-white"
                                  />
                                  <Input
                                    type="number"
                                    value={billsData.taxesPayments?.municipales2?.amount || ''}
                                    onChange={(e) => handlePaymentChange('taxes', 'municipales2', 'amount', parseFloat(e.target.value) || 0)}
                                    placeholder="Montant"
                                    className="text-sm bg-white/10 border-blue-300/30 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Taxes scolaires */}
                          <div className="p-4 bg-green-500/20 rounded-lg">
                            <h5 className="font-medium text-green-200 mb-3">{t.schoolTaxes}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-green-200">{t.firstPayment} {t.generallyJuly}</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="date"
                                    value={billsData.taxesPayments?.scolaires1?.date || '2024-07-01'}
                                    onChange={(e) => handlePaymentChange('taxes', 'scolaires1', 'date', e.target.value)}
                                    className="text-sm bg-white/10 border-green-300/30 text-white"
                                  />
                                  <Input
                                    type="number"
                                    value={billsData.taxesPayments?.scolaires1?.amount || ''}
                                    onChange={(e) => handlePaymentChange('taxes', 'scolaires1', 'amount', parseFloat(e.target.value) || 0)}
                                    placeholder="Montant"
                                    className="text-sm bg-white/10 border-green-300/30 text-white"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-green-200">{t.secondPayment} {t.generallyNovember}</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="date"
                                    value={billsData.taxesPayments?.scolaires2?.date || '2024-11-01'}
                                    onChange={(e) => handlePaymentChange('taxes', 'scolaires2', 'date', e.target.value)}
                                    className="text-sm bg-white/10 border-green-300/30 text-white"
                                  />
                                  <Input
                                    type="number"
                                    value={billsData.taxesPayments?.scolaires2?.amount || ''}
                                    onChange={(e) => handlePaymentChange('taxes', 'scolaires2', 'amount', parseFloat(e.target.value) || 0)}
                                    placeholder="Montant"
                                    className="text-sm bg-white/10 border-green-300/30 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Résumé des taxes */}
                        <div className="p-4 bg-blue-500/20 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-blue-200">{t.totalAnnualTaxes}</span>
                            <span className="text-lg font-bold text-blue-100">
                              {formatMontantOQLF(
                                Object.values(billsData.taxesPayments || {}).reduce((sum: number, payment: any) => {
                                  const amount = payment && typeof payment === 'object' && 'amount' in payment ? Number(payment.amount) : 0;
                                  return sum + (amount || 0);
                                }, 0) as number
                              )}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-blue-300">
                            {t.distributedOver} {Object.keys(billsData.taxesPayments || {}).length} {t.payments}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="electricite" className="space-y-4 mt-6">
                    <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">{t.electricityTitle}</CardTitle>
                        <CardDescription className="text-blue-200">{t.bimonthlyBillingWithDates}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-sm text-blue-200">{t.scheduledPayments}</h4>
                          
                          {/* Hiver */}
                          <div className="p-4 bg-blue-500/20 rounded-lg">
                            <h5 className="font-medium text-blue-200 mb-3">{t.winterPeriod}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-blue-200">{t.decemberJanuary}</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="date"
                                    value={billsData.electricitePayments?.hiver1?.date || '2024-12-15'}
                                    onChange={(e) => handlePaymentChange('electricite', 'hiver1', 'date', e.target.value)}
                                    className="text-sm bg-white/10 border-blue-300/30 text-white"
                                  />
                                  <Input
                                    type="number"
                                    value={billsData.electricitePayments?.hiver1?.amount || ''}
                                    onChange={(e) => handlePaymentChange('electricite', 'hiver1', 'amount', parseFloat(e.target.value) || 0)}
                                    placeholder="Montant"
                                    className="text-sm bg-white/10 border-blue-300/30 text-white"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-blue-200">{t.februaryMarch}</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="date"
                                    value={billsData.electricitePayments?.hiver2?.date || '2025-02-15'}
                                    onChange={(e) => handlePaymentChange('electricite', 'hiver2', 'date', e.target.value)}
                                    className="text-sm bg-white/10 border-blue-300/30 text-white"
                                  />
                                  <Input
                                    type="number"
                                    value={billsData.electricitePayments?.hiver2?.amount || ''}
                                    onChange={(e) => handlePaymentChange('electricite', 'hiver2', 'amount', parseFloat(e.target.value) || 0)}
                                    placeholder="Montant"
                                    className="text-sm bg-white/10 border-blue-300/30 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Été */}
                          <div className="p-4 bg-orange-500/20 rounded-lg">
                            <h5 className="font-medium text-orange-200 mb-3">{t.summerPeriod}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-orange-200">{t.juneJuly}</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="date"
                                    value={billsData.electricitePayments?.ete1?.date || '2024-06-15'}
                                    onChange={(e) => handlePaymentChange('electricite', 'ete1', 'date', e.target.value)}
                                    className="text-sm bg-white/10 border-orange-300/30 text-white"
                                  />
                                  <Input
                                    type="number"
                                    value={billsData.electricitePayments?.ete1?.amount || ''}
                                    onChange={(e) => handlePaymentChange('electricite', 'ete1', 'amount', parseFloat(e.target.value) || 0)}
                                    placeholder="Montant"
                                    className="text-sm bg-white/10 border-orange-300/30 text-white"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-orange-200">{t.augustSeptember}</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="date"
                                    value={billsData.electricitePayments?.ete2?.date || '2024-08-15'}
                                    onChange={(e) => handlePaymentChange('electricite', 'ete2', 'date', e.target.value)}
                                    className="text-sm bg-white/10 border-orange-300/30 text-white"
                                  />
                                  <Input
                                    type="number"
                                    value={billsData.electricitePayments?.ete2?.amount || ''}
                                    onChange={(e) => handlePaymentChange('electricite', 'ete2', 'amount', parseFloat(e.target.value) || 0)}
                                    placeholder="Montant"
                                    className="text-sm bg-white/10 border-orange-300/30 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Intersaisons */}
                          <div className="p-4 bg-green-500/20 rounded-lg">
                            <h5 className="font-medium text-green-200 mb-3">{t.offSeasonPeriod}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-green-200">{t.aprilMay}</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="date"
                                    value={billsData.electricitePayments?.intersaison1?.date || '2024-04-15'}
                                    onChange={(e) => handlePaymentChange('electricite', 'intersaison1', 'date', e.target.value)}
                                    className="text-sm bg-white/10 border-green-300/30 text-white"
                                  />
                                  <Input
                                    type="number"
                                    value={billsData.electricitePayments?.intersaison1?.amount || ''}
                                    onChange={(e) => handlePaymentChange('electricite', 'intersaison1', 'amount', parseFloat(e.target.value) || 0)}
                                    placeholder="Montant"
                                    className="text-sm bg-white/10 border-green-300/30 text-white"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-green-200">{t.octoberNovember}</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="date"
                                    value={billsData.electricitePayments?.intersaison2?.date || '2024-10-15'}
                                    onChange={(e) => handlePaymentChange('electricite', 'intersaison2', 'date', e.target.value)}
                                    className="text-sm bg-white/10 border-green-300/30 text-white"
                                  />
                                  <Input
                                    type="number"
                                    value={billsData.electricitePayments?.intersaison2?.amount || ''}
                                    onChange={(e) => handlePaymentChange('electricite', 'intersaison2', 'amount', parseFloat(e.target.value) || 0)}
                                    placeholder="Montant"
                                    className="text-sm bg-white/10 border-green-300/30 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Résumé de l'électricité */}
                        <div className="p-4 bg-yellow-500/20 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-yellow-200">{t.totalAnnualElectricity}</span>
                            <span className="text-lg font-bold text-yellow-100">
                              {formatMontantOQLF(
                                Object.values(billsData.electricitePayments || {}).reduce((sum: number, payment: any) => {
                                  const amount = payment && typeof payment === 'object' && 'amount' in payment ? Number(payment.amount) : 0;
                                  return sum + (amount || 0);
                                }, 0) as number
                              )}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-yellow-300">
                            {t.distributedOverBills} {Object.keys(billsData.electricitePayments || {}).length} {t.bimonthlyBills}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="autres" className="space-y-4 mt-6">
                    <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">{t.otherBills}</CardTitle>
                        <CardDescription className="text-blue-200">{t.billsWithVariablePeriods}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-blue-200">{t.homeInsurance}</Label>
                            <Input
                              type="number"
                              value={billsData.assuranceHabitation || ''}
                              onChange={(e) => handleChange('assuranceHabitation', parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="text-lg p-3 bg-white/10 border-blue-300/30 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-blue-200">{t.autoInsurance}</Label>
                            <Input
                              type="number"
                              value={billsData.assuranceAuto || ''}
                              onChange={(e) => handleChange('assuranceAuto', parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="text-lg p-3 bg-white/10 border-blue-300/30 text-white"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            {/* Onglet Vue mensuelle */}
            <TabsContent value="monthly" className="mt-6">
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Vue mensuelle des dépenses</CardTitle>
                    <CardDescription className="text-blue-200">Répartition mensuelle de toutes vos dépenses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200">Fonctionnalité en développement...</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Vue hebdomadaire */}
            <TabsContent value="weekly" className="mt-6">
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Vue hebdomadaire des dépenses</CardTitle>
                    <CardDescription className="text-blue-200">Suivi hebdomadaire de vos dépenses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200">Fonctionnalité en développement...</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export const CashflowSection: React.FC<CashflowSectionProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');

  const handleChange = (field: string, value: any) => {
    onUpdate('cashflow', { [field]: value });
  };

  const handleBreakdownUpdate = (category: string, breakdown: Record<string, number>) => {
    const total = Object.values(breakdown).reduce((sum, value) => sum + (value || 0), 0);
    
    // Mapping des noms de catégories vers les propriétés du type CashflowData
    const categoryMapping: Record<string, string> = {
      'housing': 'logement',
      'transportation': 'transport',
      'utilities': 'servicesPublics',
      'healthcare': 'sante',
      'entertainment': 'loisirs'
    };
    
    const mappedCategory = categoryMapping[category] || category;
    onUpdate('cashflow', { 
      [mappedCategory]: total,
      [`${mappedCategory}Breakdown`]: breakdown 
    });
  };

  // Données des dépenses
  const housingExpenses = data.cashflow?.logement || 0;
  const transportationExpenses = data.cashflow?.transport || 0;
  const foodExpenses = data.cashflow?.alimentation || 0;
  const utilitiesExpenses = data.cashflow?.servicesPublics || 0;
  const healthcareExpenses = data.cashflow?.sante || 0;
  const entertainmentExpenses = data.cashflow?.loisirs || 0;
  const otherExpenses = data.cashflow?.assurances || 0;

  // Calculs
  const totalExpenses = housingExpenses + transportationExpenses + foodExpenses + utilitiesExpenses + healthcareExpenses + entertainmentExpenses + otherExpenses;
  const essentialExpenses = housingExpenses + transportationExpenses + foodExpenses + utilitiesExpenses + healthcareExpenses;
  const discretionaryExpenses = entertainmentExpenses + otherExpenses;
  const essentialPercentage = totalExpenses > 0 ? (essentialExpenses / totalExpenses) * 100 : 0;
  const discretionaryPercentage = totalExpenses > 0 ? (discretionaryExpenses / totalExpenses) * 100 : 0;

  // Définitions des sous-catégories détaillées
  const housingCategories = [
    { key: 'rent', label: isFrench ? 'Loyer' : 'Rent', icon: <Home className="w-4 h-4 text-blue-500" /> },
    { key: 'mortgage', label: isFrench ? 'Hypothèque' : 'Mortgage', icon: <Home className="w-4 h-4 text-blue-500" /> },
    { key: 'propertyTax', label: isFrench ? 'Taxes municipales' : 'Property Tax', icon: <Home className="w-4 h-4 text-blue-500" /> },
    { key: 'homeInsurance', label: isFrench ? 'Assurance habitation' : 'Home Insurance', icon: <Home className="w-4 h-4 text-blue-500" /> },
    { key: 'maintenance', label: isFrench ? 'Entretien' : 'Maintenance', icon: <Home className="w-4 h-4 text-blue-500" /> }
  ];

  const transportationCategories = [
    { key: 'gas', label: isFrench ? 'Essence' : 'Gasoline', icon: <Car className="w-4 h-4 text-green-500" /> },
    { key: 'publicTransport', label: isFrench ? 'Transport en commun' : 'Public Transport', icon: <Car className="w-4 h-4 text-green-500" /> },
    { key: 'maintenance', label: isFrench ? 'Maintenance' : 'Maintenance', icon: <Car className="w-4 h-4 text-green-500" /> },
    { key: 'parking', label: isFrench ? 'Stationnement' : 'Parking', icon: <Car className="w-4 h-4 text-green-500" /> },
    { key: 'licenses', label: isFrench ? 'Permis et immatriculation' : 'Licenses & Registration', icon: <Car className="w-4 h-4 text-green-500" /> }
  ];

  const utilitiesCategories = [
    { key: 'electricity', label: isFrench ? 'Électricité' : 'Electricity', icon: <Zap className="w-4 h-4 text-yellow-500" /> },
    { key: 'water', label: isFrench ? 'Eau' : 'Water', icon: <Zap className="w-4 h-4 text-yellow-500" /> },
    { key: 'naturalGas', label: isFrench ? 'Gaz naturel' : 'Natural Gas', icon: <Zap className="w-4 h-4 text-yellow-500" /> },
    { key: 'heating', label: isFrench ? 'Chauffage' : 'Heating', icon: <Zap className="w-4 h-4 text-yellow-500" /> },
    { key: 'waste', label: isFrench ? 'Collecte des déchets' : 'Waste Collection', icon: <Zap className="w-4 h-4 text-yellow-500" /> }
  ];

  const healthcareCategories = [
    { key: 'medications', label: isFrench ? 'Médicaments' : 'Medications', icon: <Heart className="w-4 h-4 text-red-500" /> },
    { key: 'dental', label: isFrench ? 'Soins dentaires' : 'Dental Care', icon: <Heart className="w-4 h-4 text-red-500" /> },
    { key: 'vision', label: isFrench ? 'Lunettes/Contacts' : 'Vision Care', icon: <Heart className="w-4 h-4 text-red-500" /> },
    { key: 'specialists', label: isFrench ? 'Spécialistes' : 'Specialists', icon: <Heart className="w-4 h-4 text-red-500" /> },
    { key: 'otherCare', label: isFrench ? 'Autres soins' : 'Other Care', icon: <Heart className="w-4 h-4 text-red-500" /> }
  ];

  const entertainmentCategories = [
    { key: 'restaurants', label: isFrench ? 'Restaurants' : 'Restaurants', icon: <Gamepad2 className="w-4 h-4 text-purple-500" /> },
    { key: 'movies', label: isFrench ? 'Cinéma/Théâtre' : 'Movies/Theater', icon: <Gamepad2 className="w-4 h-4 text-purple-500" /> },
    { key: 'hobbies', label: isFrench ? 'Hobbies' : 'Hobbies', icon: <Gamepad2 className="w-4 h-4 text-purple-500" /> },
    { key: 'sports', label: isFrench ? 'Sports' : 'Sports', icon: <Gamepad2 className="w-4 h-4 text-purple-500" /> },
    { key: 'travel', label: isFrench ? 'Voyages' : 'Travel', icon: <Gamepad2 className="w-4 h-4 text-purple-500" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {isFrench ? 'Gestion des dépenses' : 'xpenses Management'}
            </h1>
          </div>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            {isFrench
              ? 'Planifiez et suivez vos dépenses mensuelles pour optimiser votre budget de retraite'
              : 'Plan and track your monthly expenses to optimize your retirement budget'
            }
          </p>
        </div>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {isFrench ? 'Vue d\'ensemble' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger
              value="breakdown"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {isFrench ? 'Dépenses mensuelles' : 'MonthlyBreakdown'}
            </TabsTrigger>
            <TabsTrigger
              value="seasonal"
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {isFrench ? 'Dépenses saisonnières' : 'Seasonal Expenses'}
            </TabsTrigger>
            <TabsTrigger
              value="planning"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              {isFrench ? 'Planification' : 'Planning'}
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Résumé des dépenses */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    {isFrench ? 'Total mensuel' : 'Monthly Total'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">
                    {isFrench ? formatMontantOQLF(totalExpenses) : `$${totalExpenses.toLocaleString()}`}
                  </div>
                  <div className="text-blue-200 text-sm">
                    {isFrench ? 'Dépenses totales' : 'Total expenses'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-green-300/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {isFrench ? 'Essentielles' : 'Essential'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    {isFrench ? formatMontantOQLF(essentialExpenses) : `$${essentialExpenses.toLocaleString()}`}
                  </div>
                  <div className="text-green-200 text-sm">
                    {isFrench ? `${essentialPercentage.toFixed(1)}% du total` : `${essentialPercentage.toFixed(1)}% of total`}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-purple-300/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <PiggyBank className="w-5 h-5" />
                    {isFrench ? 'Discrétionnaires' : 'Discretionary'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">
                    {isFrench ? formatMontantOQLF(discretionaryExpenses) : `$${discretionaryExpenses.toLocaleString()}`}
                  </div>
                  <div className="text-purple-200 text-sm">
                    {isFrench ? `${discretionaryPercentage.toFixed(1)}% du total` : `${discretionaryPercentage.toFixed(1)}% of total`}
                  </div>
                </CardContent>
              </Card>
            </div>

                         {/* Graphique des proportions */}
             <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
               <CardHeader>
                 <CardTitle className="text-blue-400">
                   {isFrench ? 'Répartition des dépenses' : 'Expense Distribution'}
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <span className="text-blue-200">{isFrench ? 'Dépenses essentielles' : 'Essential expenses'}</span>
                     <span className="text-blue-400 font-semibold">
                       {isFrench ? formatMontantOQLF(essentialExpenses) : `$${essentialExpenses.toLocaleString()}`}
                     </span>
                   </div>
                   <Progress value={essentialPercentage} className="h-2 bg-blue-900/30" />

                   <div className="flex items-center justify-between">
                     <span className="text-purple-200">{isFrench ? 'Dépenses discrétionnaires' : 'Discretionary expenses'}</span>
                     <span className="text-purple-400 font-semibold">
                       {isFrench ? formatMontantOQLF(discretionaryExpenses) : `$${discretionaryExpenses.toLocaleString()}`}
                     </span>
                   </div>
                   <Progress value={discretionaryPercentage} className="h-2 bg-purple-900/30" />
                 </div>
               </CardContent>
             </Card>

             {/* Dépenses de retraite synchronisées */}
             <Card className="bg-white/10 backdrop-blur-sm border-emerald-300/30">
               <CardHeader>
                 <CardTitle className="text-emerald-400 flex items-center gap-2">
                   <Target className="w-5 h-5" />
                   {isFrench ? 'Dépenses de retraite' : 'Retirement Expenses'}
                 </CardTitle>
                 <CardDescription className="text-emerald-200">
                   {isFrench 
                     ? 'Montant estimé pour vos dépenses de retraite (synchronisé avec votre profil)'
                     : 'Estimated amount for your retirement expenses (synced with your profile)'
                   }
                 </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                   <span className="text-emerald-200">{isFrench ? 'Dépenses mensuelles estimées' : 'Estimated monthly expenses'}</span>
                   <span className="text-emerald-400 font-semibold text-xl">
                     {isFrench 
                       ? formatMontantOQLF(data.personal?.depensesRetraite || 0)
                       : `$${(data.personal?.depensesRetraite || 0).toLocaleString()}`
                     }
                   </span>
                 </div>
                 
                 <div className="flex items-center justify-between">
                   <span className="text-emerald-200">{isFrench ? 'Dépenses annuelles estimées' : 'Estimated annual expenses'}</span>
                   <span className="text-emerald-400 font-semibold text-xl">
                     {isFrench 
                       ? formatMontantOQLF((data.personal?.depensesRetraite || 0) * 12)
                       : `$${((data.personal?.depensesRetraite || 0) * 12).toLocaleString()}`
                     }
                   </span>
                 </div>

                 <div className="p-3 bg-emerald-900/20 rounded-lg border border-emerald-400/30">
                   <p className="text-sm text-emerald-200 text-center">
                     {isFrench 
                       ? '💡 Ce montant est automatiquement synchronisé avec votre profil. Modifiez-le dans "Mon profil" pour le mettre à jour ici.'
                       : '💡 This amount is automatically synced with your profile. Modify it in "My Profile" to update it here.'
                     }
                   </p>
                 </div>
               </CardContent>
             </Card>
          </TabsContent>

          {/* Ventilation détaillée */}
          <TabsContent value="breakdown" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-indigo-300/30">
              <CardHeader>
                <CardTitle className="text-indigo-400">
                  {isFrench ? 'Ventilation par catégorie' : 'Category Breakdown'}
                </CardTitle>
                <CardDescription className="text-indigo-200">
                  {isFrench
                    ? 'Saisissez vos dépenses par catégorie pour une analyse détaillée'
                    : 'Enter your expenses by category for detailed analysis'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Grille des catégories avec ventilation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logement */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-indigo-300 flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        {isFrench ? 'Logement' : 'Housing'}
                      </Label>
                      <ExpenseBreakdown
                        title={isFrench ? 'Logement' : 'Housing'}
                        total={housingExpenses}
                        breakdown={data.cashflow?.logementBreakdown || {}}
                        onUpdate={(breakdown) => handleBreakdownUpdate('housing', breakdown)}
                        categories={housingCategories}
                      />
                    </div>
                    <Input
                      type="number"
                      value={housingExpenses || ''}
                      onChange={(e) => handleChange('housing', parseFloat(e.target.value) || 0)}
                      placeholder={isFrench ? 'Ex: 1200' : 'Ex: 1200'}
                      className="bg-white/20 border-indigo-300/30 text-white placeholder-indigo-200"
                    />
                  </div>

                  {/* Transport */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-indigo-300 flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        {isFrench ? 'Transport' : 'Transportation'}
                      </Label>
                      <ExpenseBreakdown
                        title={isFrench ? 'Transport' : 'Transportation'}
                        total={transportationExpenses}
                        breakdown={data.cashflow?.transportBreakdown || {}}
                        onUpdate={(breakdown) => handleBreakdownUpdate('transportation', breakdown)}
                        categories={transportationCategories}
                      />
                    </div>
                    <Input
                      type="number"
                      value={transportationExpenses || ''}
                      onChange={(e) => handleChange('transportation', parseFloat(e.target.value) || 0)}
                      placeholder={isFrench ? 'Ex: 400' : 'Ex: 400'}
                      className="bg-white/20 border-indigo-300/30 text-white placeholder-indigo-200"
                    />
                  </div>

                  {/* Alimentation */}
                  <div className="space-y-2">
                    <Label className="text-indigo-300 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      {isFrench ? 'Alimentation' : 'Food'}
                    </Label>
                    <Input
                      type="number"
                      value={foodExpenses || ''}
                      onChange={(e) => handleChange('food', parseFloat(e.target.value) || 0)}
                      placeholder={isFrench ? 'Ex: 600' : 'Ex: 600'}
                      className="bg-white/20 border-indigo-300/30 text-white placeholder-indigo-200"
                    />
                  </div>

                  {/* Services publics */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-indigo-300 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        {isFrench ? 'Services publics' : 'Utilities'}
                      </Label>
                      <ExpenseBreakdown
                        title={isFrench ? 'Services publics' : 'Utilities'}
                        total={utilitiesExpenses}
                        breakdown={data.cashflow?.servicesPublicsBreakdown || {}}
                        onUpdate={(breakdown) => handleBreakdownUpdate('utilities', breakdown)}
                        categories={utilitiesCategories}
                      />
                    </div>
                    <Input
                      type="number"
                      value={utilitiesExpenses || ''}
                      onChange={(e) => handleChange('utilities', parseFloat(e.target.value) || 0)}
                      placeholder={isFrench ? 'Ex: 300' : 'Ex: 300'}
                      className="bg-white/20 border-indigo-300/30 text-white placeholder-indigo-200"
                    />
                  </div>

                  {/* Santé */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-indigo-300 flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        {isFrench ? 'Santé' : 'Healthcare'}
                      </Label>
                      <ExpenseBreakdown
                        title={isFrench ? 'Santé' : 'Healthcare'}
                        total={healthcareExpenses}
                        breakdown={data.cashflow?.santeBreakdown || {}}
                        onUpdate={(breakdown) => handleBreakdownUpdate('healthcare', breakdown)}
                        categories={healthcareCategories}
                      />
                    </div>
                    <Input
                      type="number"
                      value={healthcareExpenses || ''}
                      onChange={(e) => handleChange('healthcare', parseFloat(e.target.value) || 0)}
                      placeholder={isFrench ? 'Ex: 200' : 'Ex: 200'}
                      className="bg-white/20 border-indigo-300/30 text-white placeholder-indigo-200"
                    />
                  </div>

                  {/* Loisirs */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-indigo-300 flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4" />
                        {isFrench ? 'Loisirs' : 'Entertainment'}
                      </Label>
                      <ExpenseBreakdown
                        title={isFrench ? 'Loisirs' : 'Entertainment'}
                        total={entertainmentExpenses}
                        breakdown={{}}
                        onUpdate={(breakdown) => handleBreakdownUpdate('entertainment', breakdown)}
                        categories={entertainmentCategories}
                      />
                    </div>
                    <Input
                      type="number"
                      value={entertainmentExpenses || ''}
                      onChange={(e) => handleChange('entertainment', parseFloat(e.target.value) || 0)}
                      placeholder={isFrench ? 'Ex: 300' : 'Ex: 300'}
                      className="bg-white/20 border-indigo-300/30 text-white placeholder-indigo-200"
                    />
                  </div>

                  {/* Autres */}
                  <div className="space-y-2">
                    <Label className="text-indigo-300 flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      {isFrench ? 'Autres' : 'Other'}
                    </Label>
                    <Input
                      type="number"
                      value={otherExpenses || ''}
                      onChange={(e) => handleChange('other', parseFloat(e.target.value) || 0)}
                      placeholder={isFrench ? 'Ex: 200' : 'Ex: 200'}
                      className="bg-white/20 border-indigo-300/30 text-white placeholder-indigo-200"
                    />
                  </div>
                </div>

                {/* Validation du total */}
                {totalExpenses > 0 && (
                  <Alert className="bg-indigo-900/50 border-indigo-400/30">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-indigo-200">
                      {isFrench
                        ? `Total calculé : ${formatMontantOQLF(totalExpenses)}`
                        : `Total calculated: $${totalExpenses.toLocaleString()}`
                      }
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saisonnières - Contenu avancé intégré */}
          <TabsContent value="seasonal" className="space-y-6">
            <SeasonalExpensesAdvanced data={data} onUpdate={onUpdate} />
          </TabsContent>

          {/* Planification */}
          <TabsContent value="planning" className="space-y-6">
            {/* En-tête de la planification */}
            <div className="text-center mb-8">
                               <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                   🚀 {isFrench ? 'Planification financière intelligente' : 'Smart Financial Planning'}
                 </h2>
              <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                {isFrench
                  ? 'Transformez vos données en actions concrètes pour optimiser votre budget et atteindre vos objectifs'
                  : 'Transform your data into concrete actions to optimize your budget and reach your goals'
                }
              </p>
            </div>

            {/* Simulateur de budget intelligent */}
            <Card className="bg-white/10 backdrop-blur-sm border-purple-300/30">
              <CardHeader>
                                 <CardTitle className="text-purple-400 flex items-center gap-3">
                   <Target className="w-6 h-6" />
                   {isFrench ? 'Simulateur de budget intelligent' : 'Smart Budget Simulator'}
                 </CardTitle>
                <CardDescription className="text-purple-200">
                  {isFrench
                    ? 'Explorez des scénarios "Et si..." pour voir l\'impact sur vos finances'
                    : 'Explore "What if..." scenarios to see the impact on your finances'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Scénarios prédéfinis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-300/20 hover:border-purple-400/40 transition-all duration-300 cursor-pointer group">
                                         <h4 className="font-semibold text-purple-300 mb-2 group-hover:text-purple-200">
                       🍽️ {isFrench ? 'Réduction restaurants' : 'Restaurant Reduction'}
                     </h4>
                    <p className="text-purple-200 text-sm mb-3">
                      {isFrench 
                        ? 'Réduire de 50 % vos dépenses restaurants'
                        : 'Reduce restaurant expenses by 50%'
                      }
                    </p>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-300">
                        {isFrench 
                          ? `+${formatMontantOQLF((entertainmentExpenses * 0.5) || 0)}/mois`
                          : `+$${((entertainmentExpenses * 0.5) || 0).toLocaleString()}/month`
                        }
                      </div>
                      <div className="text-xs text-purple-400">
                        {isFrench ? 'Économies mensuelles' : 'Monthly savings'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-300/20 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group">
                                         <h4 className="font-semibold text-blue-300 mb-2 group-hover:text-blue-200">
                       ⚡ {isFrench ? 'Optimisation énergie' : 'Energy Optimization'}
                     </h4>
                    <p className="text-blue-200 text-sm mb-3">
                      {isFrench 
                        ? 'Réduire de 20 % vos factures d\'énergie'
                        : 'Reduce energy bills by 20%'
                      }
                    </p>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-300">
                        {isFrench 
                          ? `+${formatMontantOQLF((utilitiesExpenses * 0.2) || 0)}/mois`
                          : `+$${((utilitiesExpenses * 0.2) || 0).toLocaleString()}/month`
                        }
                      </div>
                      <div className="text-xs text-blue-400">
                        {isFrench ? 'Économies mensuelles' : 'Monthly savings'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-900/20 rounded-lg border border-green-300/20 hover:border-green-400/40 transition-all duration-300 cursor-pointer group">
                                         <h4 className="font-semibold text-green-300 mb-2 group-hover:text-green-200">
                       🚗 {isFrench ? 'Transport économique' : 'Economic Transport'}
                     </h4>
                    <p className="text-green-200 text-sm mb-3">
                      {isFrench 
                        ? 'Réduire de 30 % vos coûts de transport'
                        : 'Reduce transportation costs by 30%'
                      }
                    </p>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-300">
                        {isFrench 
                          ? `+${formatMontantOQLF((transportationExpenses * 0.3) || 0)}/mois`
                          : `+$${((transportationExpenses * 0.3) || 0).toLocaleString()}/month`
                        }
                      </div>
                      <div className="text-xs text-green-400">
                        {isFrench ? 'Économies mensuelles' : 'Monthly savings'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-900/20 rounded-lg border border-orange-300/20 hover:border-orange-400/40 transition-all duration-300 cursor-pointer group">
                                         <h4 className="font-semibold text-orange-300 mb-2 group-hover:text-orange-200">
                       🏠 {isFrench ? 'Optimisation logement' : 'Housing Optimization'}
                     </h4>
                    <p className="text-orange-200 text-sm mb-3">
                      {isFrench 
                        ? 'Réduire de 15 % vos coûts de logement'
                        : 'Reduce housing costs by 15%'
                      }
                    </p>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-300">
                        {isFrench 
                          ? `+${formatMontantOQLF((housingExpenses * 0.15) || 0)}/mois`
                          : `+$${((housingExpenses * 0.15) || 0).toLocaleString()}/month`
                        }
                      </div>
                      <div className="text-xs text-orange-400">
                        {isFrench ? 'Économies mensuelles' : 'Monthly savings'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Résumé des économies potentielles */}
                <div className="p-4 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-lg border border-emerald-400/30">
                  <div className="text-center space-y-2">
                                         <p className="text-emerald-300 font-medium">
                       {isFrench ? 'Économies potentielles totales' : 'Total Potential Savings'}
                     </p>
                    <div className="text-3xl font-bold text-emerald-200">
                      {isFrench 
                        ? formatMontantOQLF(
                            ((entertainmentExpenses * 0.5) || 0) +
                            ((utilitiesExpenses * 0.2) || 0) +
                            ((transportationExpenses * 0.3) || 0) +
                            ((housingExpenses * 0.15) || 0)
                          )
                        : `$${(
                            ((entertainmentExpenses * 0.5) || 0) +
                            ((utilitiesExpenses * 0.2) || 0) +
                            ((transportationExpenses * 0.3) || 0) +
                            ((housingExpenses * 0.15) || 0)
                          ).toLocaleString()}`
                      }
                    </div>
                    <p className="text-sm text-emerald-300">
                      {isFrench ? 'par mois avec ces optimisations' : 'per month with these optimizations'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan d'action personnalisé */}
            <Card className="bg-white/10 backdrop-blur-sm border-indigo-300/30">
              <CardHeader>
                                 <CardTitle className="text-indigo-400 flex items-center gap-3">
                   <BarChart3 className="w-6 h-6" />
                   {isFrench ? 'Plan d\'action personnalisé' : 'Personalized Action Plan'}
                 </CardTitle>
                <CardDescription className="text-indigo-200">
                  {isFrench
                    ? 'Votre feuille de route pour optimiser vos finances étape par étape'
                    : 'Your roadmap to optimize your finances step by step'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Objectifs personnalisés */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-indigo-900/20 rounded-lg border border-indigo-300/20">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto">
                        <Target className="w-6 h-6 text-indigo-300" />
                      </div>
                                             <h4 className="font-semibold text-indigo-300">
                         {isFrench ? 'Objectif mensuel' : 'Monthly Goal'}
                       </h4>
                      <div className="text-2xl font-bold text-indigo-200">
                        {isFrench 
                          ? formatMontantOQLF(Math.round(totalExpenses * 0.1))
                          : `$${Math.round(totalExpenses * 0.1).toLocaleString()}`
                        }
                      </div>
                      <p className="text-xs text-indigo-400">
                        {isFrench ? '10 % de réduction' : '10% reduction'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-900/20 rounded-lg border border-emerald-300/20">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                        <PiggyBank className="w-6 h-6 text-emerald-300" />
                      </div>
                                             <h4 className="font-semibold text-emerald-300">
                         {isFrench ? 'Épargne cible' : 'Target Savings'}
                       </h4>
                      <div className="text-2xl font-bold text-emerald-200">
                        {isFrench 
                          ? formatMontantOQLF(Math.round(totalExpenses * 0.2))
                          : `$${Math.round(totalExpenses * 0.2).toLocaleString()}`
                        }
                      </div>
                      <p className="text-xs text-emerald-400">
                        {isFrench ? '20 % du budget' : '20% of budget'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-300/20">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                        <TrendingUp className="w-6 h-6 text-purple-300" />
                      </div>
                      <h4 className="font-semibold text-purple-300">
                        {isFrench ? 'Progression' : 'Progress'}
                      </h4>
                      <div className="text-2xl font-bold text-purple-200">
                        {essentialPercentage.toFixed(0)}%
                      </div>
                      <p className="text-xs text-purple-400">
                        {isFrench ? 'Dépenses essentielles' : 'Essential expenses'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Étapes d'action concrètes */}
                <div className="space-y-4">
                                     <h4 className="text-lg font-semibold text-indigo-300 mb-4">
                     📋 {isFrench ? 'Étapes d\'action concrètes' : 'Concrete Action Steps'}
                   </h4>
                  
                  <div className="space-y-3">
                    {entertainmentExpenses > 300 && (
                      <div className="flex items-center gap-3 p-3 bg-orange-900/20 rounded-lg border border-orange-300/20">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <span className="text-orange-300 font-bold">1</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-orange-200 font-medium">
                            {isFrench ? 'Réduire les dépenses de loisirs' : 'Reduce entertainment expenses'}
                          </p>
                          <p className="text-orange-300 text-sm">
                            {isFrench 
                              ? `Actuel: ${formatMontantOQLF(entertainmentExpenses)}/mois → Objectif: ${formatMontantOQLF(Math.round(entertainmentExpenses * 0.7))}/mois`
                              : `Current: $${entertainmentExpenses.toLocaleString()}/month → Target: $${Math.round(entertainmentExpenses * 0.7).toLocaleString()}/month`
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-orange-200">
                            {isFrench 
                              ? `+${formatMontantOQLF(Math.round(entertainmentExpenses * 0.3))}`
                              : `+$${Math.round(entertainmentExpenses * 0.3).toLocaleString()}`
                            }
                          </div>
                          <div className="text-xs text-orange-400">
                            {isFrench ? 'Économies' : 'Savings'}
                          </div>
                        </div>
                      </div>
                    )}

                    {utilitiesExpenses > 250 && (
                      <div className="flex items-center gap-3 p-3 bg-blue-900/20 rounded-lg border border-blue-300/20">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-300 font-bold">2</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-blue-200 font-medium">
                            {isFrench ? 'Optimiser la consommation d\'énergie' : 'Optimize energy consumption'}
                          </p>
                          <p className="text-blue-300 text-sm">
                            {isFrench 
                              ? `Actuel: ${formatMontantOQLF(utilitiesExpenses)}/mois → Objectif: ${formatMontantOQLF(Math.round(utilitiesExpenses * 0.8))}/mois`
                              : `Current: $${utilitiesExpenses.toLocaleString()}/month → Target: $${Math.round(utilitiesExpenses * 0.8).toLocaleString()}/month`
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-200">
                            {isFrench 
                              ? `+${formatMontantOQLF(Math.round(utilitiesExpenses * 0.2))}`
                              : `+$${Math.round(utilitiesExpenses * 0.2).toLocaleString()}`
                            }
                          </div>
                          <div className="text-xs text-blue-400">
                            {isFrench ? 'Économies' : 'Savings'}
                          </div>
                        </div>
                      </div>
                    )}

                    {transportationExpenses > 400 && (
                      <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-300/20">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <span className="text-green-300 font-bold">3</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-green-200 font-medium">
                            {isFrench ? 'Optimiser les déplacements' : 'Optimize transportation'}
                          </p>
                          <p className="text-green-300 text-sm">
                            {isFrench 
                              ? `Actuel: ${formatMontantOQLF(transportationExpenses)}/mois → Objectif: ${formatMontantOQLF(Math.round(transportationExpenses * 0.75))}/mois`
                              : `Current: $${transportationExpenses.toLocaleString()}/month → Target: $${Math.round(transportationExpenses * 0.75).toLocaleString()}/month`
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-200">
                            {isFrench 
                              ? `+${formatMontantOQLF(Math.round(transportationExpenses * 0.25))}`
                              : `+$${Math.round(transportationExpenses * 0.25).toLocaleString()}`
                            }
                          </div>
                          <div className="text-xs text-green-400">
                            {isFrench ? 'Économies' : 'Savings'}
                          </div>
                        </div>
                      </div>
                    )}

                    {housingExpenses > 1000 && (
                      <div className="flex items-center gap-3 p-3 bg-purple-900/20 rounded-lg border border-purple-300/20">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <span className="text-purple-300 font-bold">4</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-purple-200 font-medium">
                            {isFrench ? 'Négocier les coûts de logement' : 'Negotiate housing costs'}
                          </p>
                          <p className="text-purple-300 text-sm">
                            {isFrench 
                              ? `Actuel: ${formatMontantOQLF(housingExpenses)}/mois → Objectif: ${formatMontantOQLF(Math.round(housingExpenses * 0.9))}/mois`
                              : `Current: $${housingExpenses.toLocaleString()}/month → Target: $${Math.round(housingExpenses * 0.9).toLocaleString()}/month`
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-200">
                            {isFrench 
                              ? `+${formatMontantOQLF(Math.round(housingExpenses * 0.1))}`
                              : `+$${Math.round(housingExpenses * 0.1).toLocaleString()}`
                            }
                          </div>
                          <div className="text-xs text-purple-400">
                            {isFrench ? 'Économies' : 'Savings'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Outils d'optimisation actifs */}
            <Card className="bg-white/10 backdrop-blur-sm border-green-300/30">
              <CardHeader>
                                 <CardTitle className="text-green-400 flex items-center gap-3">
                   <Zap className="w-6 h-6" />
                   {isFrench ? 'Outils d\'optimisation actifs' : 'Active Optimization Tools'}
                 </CardTitle>
                <CardDescription className="text-green-200">
                  {isFrench
                    ? 'Outils concrets pour réduire vos dépenses et optimiser votre budget'
                    : 'Concrete tools to reduce your expenses and optimize your budget'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Négociateur de factures */}
                  <div className="p-4 bg-green-900/20 rounded-lg border border-green-300/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-300" />
                      </div>
                      <div className="flex-1">
                                                 <h4 className="font-semibold text-green-300 mb-2">
                           {isFrench ? 'Négociateur de factures' : 'Bill Negotiator'}
                         </h4>
                        <p className="text-green-200 text-sm mb-3">
                          {isFrench 
                            ? 'Rappels pour renégocier vos factures d\'assurance, téléphone, etc.'
                            : 'Reminders to renegotiate your insurance, phone bills, etc.'
                          }
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-300">
                              {isFrench ? 'Assurance habitation' : 'Home insurance'}
                            </span>
                            <span className="text-green-200 font-medium">
                              {isFrench ? 'Renouvellement dans 2 mois' : 'Renewal in 2 months'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-300">
                              {isFrench ? 'Téléphone mobile' : 'Mobile phone'}
                            </span>
                            <span className="text-green-200 font-medium">
                              {isFrench ? 'Contrat dans 6 mois' : 'Contract in 6 months'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comparateur de fournisseurs */}
                  <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-300/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-blue-300" />
                      </div>
                      <div className="flex-1">
                                                 <h4 className="font-semibold text-blue-300 mb-2">
                           {isFrench ? 'Comparateur de fournisseurs' : 'Provider Comparator'}
                         </h4>
                        <p className="text-blue-200 text-sm mb-3">
                          {isFrench 
                            ? 'Suggestions d\'alternatives moins chères pour vos services'
                            : 'Suggestions for cheaper alternatives for your services'
                          }
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-300">
                              {isFrench ? 'Électricité' : 'Electricity'}
                            </span>
                            <span className="text-blue-200 font-medium">
                              {isFrench ? 'Économies potentielles: 15 %' : 'Potential savings: 15%'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-300">
                              {isFrench ? 'Internet' : 'Internet'}
                            </span>
                            <span className="text-blue-200 font-medium">
                              {isFrench ? 'Économies potentielles: 25 %' : 'Potential savings: 25%'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculateur d'impact */}
                <div className="p-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-lg border border-indigo-400/30">
                  <div className="text-center space-y-4">
                                         <h4 className="text-lg font-semibold text-indigo-300">
                       🧮 {isFrench ? 'Calculateur d\'impact' : 'Impact Calculator'}
                     </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-200">
                          {isFrench 
                            ? formatMontantOQLF(Math.round(totalExpenses * 0.1 * 12))
                            : `$${Math.round(totalExpenses * 0.1 * 12).toLocaleString()}`
                          }
                        </div>
                        <p className="text-sm text-indigo-300">
                          {isFrench ? 'Économies annuelles' : 'Annual savings'}
                        </p>
                        <p className="text-xs text-indigo-400">
                          {isFrench ? 'avec 10 % de réduction' : 'with 10% reduction'}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-200">
                          {isFrench 
                            ? formatMontantOQLF(Math.round(totalExpenses * 0.1 * 12 * 5))
                            : `$${Math.round(totalExpenses * 0.1 * 12 * 5).toLocaleString()}`
                          }
                        </div>
                        <p className="text-sm text-purple-300">
                          {isFrench ? 'Économies en 5 ans' : 'Savings in 5 years'}
                        </p>
                        <p className="text-xs text-purple-400">
                          {isFrench ? 'avec 10 % de réduction' : 'with 10% reduction'}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-200">
                          {isFrench 
                            ? formatMontantOQLF(Math.round(totalExpenses * 0.1 * 12 * 10))
                            : `$${Math.round(totalExpenses * 0.1 * 12 * 10).toLocaleString()}`
                          }
                        </div>
                        <p className="text-sm text-emerald-300">
                          {isFrench ? 'Économies en 10 ans' : 'Savings in 10 years'}
                        </p>
                        <p className="text-xs text-emerald-400">
                          {isFrench ? 'avec 10 % de réduction' : 'with 10% reduction'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
