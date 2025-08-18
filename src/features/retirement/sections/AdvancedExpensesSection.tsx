// src/features/retirement/sections/AdvancedExpensesSection.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
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
  Snowflake,
  Sun,
  Clock,
  Target,
  PieChart,
  CalendarDays,
  Receipt,
  Building,
  Leaf,
  Wrench,
  FileText
} from 'lucide-react';
import { UserData } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useTranslation } from '../translations/index';

interface AdvancedExpensesSectionProps {
  data: UserData;
  onUpdate: (section: keyof UserData, updates: any) => void;
}

// Fonction pour détecter la langue selon l'URL
const getLanguageFromURL = (): 'fr' | 'en' => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path.includes('/en/')) return 'en';
    if (path.includes('/fr/')) return 'fr';
  }
  return 'fr'; // par défaut
};

// Composant pour les dépenses saisonnières
const SeasonalExpensesComponent: React.FC<{ data: any; onUpdate: any }> = ({ data, onUpdate }) => {
  const [selectedSeason, setSelectedSeason] = useState<'winter' | 'summer'>('winter');
  const language = getLanguageFromURL();
  const t = useTranslation(language);

  const winterExpenses = [
    { 
      key: 'deneigement', 
      label: t.advancedExpenses.snowRemoval, 
      icon: <Snowflake className="w-4 h-4 text-blue-500" />,
      payments: [
        { key: 'septembre', label: language === 'fr' ? 'Versement septembre' : 'September payment', date: '2024-09-15' },
        { key: 'janvier', label: language === 'fr' ? 'Versement janvier' : 'January payment', date: '2025-01-15' }
      ]
    },
    { 
      key: 'chauffage', 
      label: t.advancedExpenses.additionalHeating, 
      icon: <Zap className="w-4 h-4 text-orange-500" />,
      payments: [
        { key: 'novembre', label: language === 'fr' ? 'Versement novembre' : 'November payment', date: '2024-11-01' },
        { key: 'fevrier', label: language === 'fr' ? 'Versement février' : 'February payment', date: '2025-02-01' }
      ]
    },
    { 
      key: 'isolation', 
      label: t.advancedExpenses.insulation, 
      icon: <Home className="w-4 h-4 text-gray-500" />,
      payments: [
        { key: 'octobre', label: language === 'fr' ? 'Versement octobre' : 'October payment', date: '2024-10-01' }
      ]
    },
    { 
      key: 'vetements', 
      label: t.advancedExpenses.winterClothing, 
      icon: <ShoppingCart className="w-4 h-4 text-blue-600" />,
      payments: [
        { key: 'novembre', label: language === 'fr' ? 'Versement novembre' : 'November payment', date: '2024-11-15' }
      ]
    }
  ];

  const summerExpenses = [
    { 
      key: 'amenagement', 
      label: t.advancedExpenses.landscaping, 
      icon: <Leaf className="w-4 h-4 text-green-500" />,
      payments: [
        { key: 'mai', label: language === 'fr' ? 'Versement mai' : 'May payment', date: '2024-05-01' },
        { key: 'juin', label: language === 'fr' ? 'Versement juin' : 'June payment', date: '2024-06-01' }
      ]
    },
    { 
      key: 'climatisation', 
      label: t.advancedExpenses.airConditioning, 
      icon: <Zap className="w-4 h-4 text-blue-500" />,
      payments: [
        { key: 'juin', label: language === 'fr' ? 'Versement juin' : 'June payment', date: '2024-06-15' }
      ]
    },
    { 
      key: 'entretien', 
      label: t.advancedExpenses.exteriorMaintenance, 
      icon: <Wrench className="w-4 h-4 text-gray-500" />,
      payments: [
        { key: 'avril', label: language === 'fr' ? 'Versement avril' : 'April payment', date: '2024-04-01' },
        { key: 'septembre', label: language === 'fr' ? 'Versement septembre' : 'September payment', date: '2024-09-01' }
      ]
    },
    { 
      key: 'activites', 
      label: t.advancedExpenses.summerActivities, 
      icon: <Sun className="w-4 h-4 text-yellow-500" />,
      payments: [
        { key: 'juillet', label: language === 'fr' ? 'Versement juillet' : 'July payment', date: '2024-07-01' },
        { key: 'aout', label: language === 'fr' ? 'Versement août' : 'August payment', date: '2024-08-01' }
      ]
    }
  ];

  const handleChange = (key: string, value: number) => {
    const seasonKey = selectedSeason === 'winter' ? 'winterExpenses' : 'summerExpenses';
    const currentExpenses = data[seasonKey] || {};
    onUpdate('advancedExpenses', {
      [seasonKey]: { ...currentExpenses, [key]: value }
    });
  };

  const handlePaymentChange = (expenseKey: string, paymentKey: string, field: 'amount' | 'date', value: string | number) => {
    const seasonKey = selectedSeason === 'winter' ? 'winterExpenses' : 'summerExpenses';
    const currentExpenses = data[seasonKey] || {};
    const currentPayments = currentExpenses[`${expenseKey}Payments`] || {};
    
    onUpdate('advancedExpenses', {
      [seasonKey]: { 
        ...currentExpenses, 
        [`${expenseKey}Payments`]: { 
          ...currentPayments, 
          [paymentKey]: { 
            ...currentPayments[paymentKey], 
            [field]: value 
          } 
        }
      }
    });
  };

  const currentExpenses = selectedSeason === 'winter' ? winterExpenses : summerExpenses;
  const expensesData = data[selectedSeason === 'winter' ? 'winterExpenses' : 'summerExpenses'] || {};

  return (
    <div className="space-y-6">
      {/* Sélecteur de saison */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Snowflake className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium">{t.advancedExpenses.winter}</span>
        </div>
        <Button
          variant={selectedSeason === 'winter' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedSeason('winter')}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {t.advancedExpenses.winter}
        </Button>
        <Button
          variant={selectedSeason === 'summer' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedSeason('summer')}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {t.advancedExpenses.summer}
        </Button>
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-medium">{t.advancedExpenses.summer}</span>
        </div>
      </div>

      {/* Dépenses de la saison */}
      <div className="space-y-6">
        {currentExpenses.map((expense) => {
          const paymentsData = expensesData[`${expense.key}Payments`] || {};
          const totalAmount = Object.values(paymentsData).reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0);
          
          return (
            <Card key={expense.key} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {expense.icon}
                  {expense.label}
                </CardTitle>
                <CardDescription>
                  {language === 'fr' ? 'Total prévu : ' : 'Planned total: '}{formatCurrency(totalAmount as number)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Versements */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">{t.advancedExpenses.scheduledPayments}</h4>
                  {expense.payments.map((payment) => (
                    <div key={payment.key} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">{payment.label}</Label>
                        <Input
                          type="date"
                          value={paymentsData[payment.key]?.date || payment.date}
                          onChange={(e) => handlePaymentChange(expense.key, payment.key, 'date', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">{t.advancedExpenses.amount}</Label>
                        <Input
                          type="number"
                          value={paymentsData[payment.key]?.amount || ''}
                          onChange={(e) => handlePaymentChange(expense.key, payment.key, 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Résumé du versement */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-800">{t.advancedExpenses.totalPayments}</span>
                    <span className="text-lg font-bold text-blue-900">{formatCurrency(totalAmount as number)}</span>
                  </div>
                  <div className="mt-2 text-xs text-blue-600">
                    {expense.payments.length > 1 
                      ? `${expense.payments.length} ${t.advancedExpenses.paymentsScheduled}` 
                      : `1 ${t.advancedExpenses.payment}`
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Résumé saisonnier */}
      <Card className="bg-gradient-to-r from-blue-50 to-orange-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">{t.advancedExpenses.seasonalExpensesSummary}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-blue-600">{t.advancedExpenses.winterExpenses}</p>
              <p className="text-2xl font-bold text-blue-800">
                {formatCurrency(
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
              <p className="text-sm text-orange-600">{t.advancedExpenses.summerExpenses}</p>
              <p className="text-2xl font-bold text-orange-800">
                {formatCurrency(
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
  );
};

// Composant pour les factures complexes
const ComplexBillsComponent: React.FC<{ data: any; onUpdate: any }> = ({ data, onUpdate }) => {
  const [selectedBill, setSelectedBill] = useState<string>('taxes');
  const language = getLanguageFromURL();
  const t = useTranslation(language);

  const billTypes = [
    { key: 'taxes', label: t.advancedExpenses.taxes, icon: <Building className="w-4 h-4 text-red-500" /> },
    { key: 'electricite', label: t.advancedExpenses.variableElectricity, icon: <Zap className="w-4 h-4 text-yellow-500" /> },
    { key: 'autres', label: t.advancedExpenses.otherBills, icon: <Receipt className="w-4 h-4 text-gray-500" /> }
  ];

  const handleChange = (key: string, value: number) => {
    const currentBills = data.complexBills || {};
    onUpdate('advancedExpenses', {
      complexBills: { ...currentBills, [key]: value }
    });
  };

  const handlePaymentChange = (billType: string, paymentKey: string, field: 'amount' | 'date', value: string | number) => {
    const currentBills = data.complexBills || {};
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

  const billsData = data.complexBills || {};

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
      {/* Alertes de trésorerie */}
      {cashflowAlerts.length > 0 && (
        <Card className="border-l-4 border-l-orange-500 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {t.advancedExpenses.cashflowAlerts}
            </CardTitle>
            <CardDescription className="text-orange-700">
              {t.advancedExpenses.importantPaymentsNext3Months}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cashflowAlerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  alert.urgency === 'high' ? 'bg-red-100 border-red-300' :
                  alert.urgency === 'medium' ? 'bg-orange-100 border-orange-300' :
                  'bg-yellow-100 border-yellow-300'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">
                        {alert.type === 'taxes' ? 'Taxes' : 'Électricité'} - {new Date(alert.date).toLocaleDateString('fr-CA')}
                      </p>
                      <p className="text-sm opacity-80">
                        {alert.monthsAhead === 0 ? 'Ce mois-ci' : 
                         alert.monthsAhead === 1 ? 'Dans 1 mois' : 
                         `Dans ${alert.monthsAhead} mois`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(alert.amount)}</p>
                      <p className="text-xs opacity-70">
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
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          {billTypes.map((bill) => (
            <TabsTrigger
              key={bill.key}
              value={bill.key}
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                {bill.icon}
                {bill.label}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="taxes" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.advancedExpenses.municipalTaxesTitle}</CardTitle>
              <CardDescription>{t.advancedExpenses.annualBillsWithDates}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Versements des taxes */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-700">{t.advancedExpenses.scheduledPayments}</h4>
                
                {/* Taxes municipales */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-3">{t.advancedExpenses.municipalTaxes}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.advancedExpenses.firstPayment} {t.advancedExpenses.generallyMarch}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={billsData.taxesPayments?.municipales1?.date || '2024-03-01'}
                          onChange={(e) => handlePaymentChange('taxes', 'municipales1', 'date', e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          value={billsData.taxesPayments?.municipales1?.amount || ''}
                          onChange={(e) => handlePaymentChange('taxes', 'municipales1', 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="Montant"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.advancedExpenses.secondPayment} {t.advancedExpenses.generallyJune}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={billsData.taxesPayments?.municipales2?.date || '2024-06-01'}
                          onChange={(e) => handlePaymentChange('taxes', 'municipales2', 'date', e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          value={billsData.taxesPayments?.municipales2?.amount || ''}
                          onChange={(e) => handlePaymentChange('taxes', 'municipales2', 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="Montant"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Taxes scolaires */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-3">{t.advancedExpenses.schoolTaxes}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.advancedExpenses.firstPayment} {t.advancedExpenses.generallyJuly}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={billsData.taxesPayments?.scolaires1?.date || '2024-07-01'}
                          onChange={(e) => handlePaymentChange('taxes', 'scolaires1', 'date', e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          value={billsData.taxesPayments?.scolaires1?.amount || ''}
                          onChange={(e) => handlePaymentChange('taxes', 'scolaires1', 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="Montant"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.advancedExpenses.secondPayment} {t.advancedExpenses.generallyNovember}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={billsData.taxesPayments?.scolaires2?.date || '2024-11-01'}
                          onChange={(e) => handlePaymentChange('taxes', 'scolaires2', 'date', e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          value={billsData.taxesPayments?.scolaires2?.amount || ''}
                          onChange={(e) => handlePaymentChange('taxes', 'scolaires2', 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="Montant"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Résumé des taxes */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-800">{t.advancedExpenses.totalAnnualTaxes}</span>
                  <span className="text-lg font-bold text-blue-900">
                    {formatCurrency(
                      Object.values(billsData.taxesPayments || {}).reduce((sum: number, payment: any) => {
                        const amount = payment && typeof payment === 'object' && 'amount' in payment ? Number(payment.amount) : 0;
                        return sum + (amount || 0);
                      }, 0) as number
                    )}
                  </span>
                </div>
                <div className="mt-2 text-xs text-blue-600">
                  {t.advancedExpenses.distributedOver} {Object.keys(billsData.taxesPayments || {}).length} {t.advancedExpenses.payments}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="electricite" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.advancedExpenses.electricityTitle}</CardTitle>
              <CardDescription>{t.advancedExpenses.bimonthlyBillingWithDates}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Versements de l'électricité */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-700">{t.advancedExpenses.scheduledPayments}</h4>
                
                {/* Hiver */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-3">{t.advancedExpenses.winterPeriod}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.advancedExpenses.decemberJanuary}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={billsData.electricitePayments?.hiver1?.date || '2024-12-15'}
                          onChange={(e) => handlePaymentChange('electricite', 'hiver1', 'date', e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          value={billsData.electricitePayments?.hiver1?.amount || ''}
                          onChange={(e) => handlePaymentChange('electricite', 'hiver1', 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="Montant"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.advancedExpenses.februaryMarch}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={billsData.electricitePayments?.hiver2?.date || '2025-02-15'}
                          onChange={(e) => handlePaymentChange('electricite', 'hiver2', 'date', e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          value={billsData.electricitePayments?.hiver2?.amount || ''}
                          onChange={(e) => handlePaymentChange('electricite', 'hiver2', 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="Montant"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Été */}
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800 mb-3">{t.advancedExpenses.summerPeriod}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.advancedExpenses.juneJuly}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={billsData.electricitePayments?.ete1?.date || '2024-06-15'}
                          onChange={(e) => handlePaymentChange('electricite', 'ete1', 'date', e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          value={billsData.electricitePayments?.ete1?.amount || ''}
                          onChange={(e) => handlePaymentChange('electricite', 'ete1', 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="Montant"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.advancedExpenses.augustSeptember}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={billsData.electricitePayments?.ete2?.date || '2024-08-15'}
                          onChange={(e) => handlePaymentChange('electricite', 'ete2', 'date', e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          value={billsData.electricitePayments?.ete2?.amount || ''}
                          onChange={(e) => handlePaymentChange('electricite', 'ete2', 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="Montant"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Intersaisons */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-3">{t.advancedExpenses.offSeasonPeriod}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.advancedExpenses.aprilMay}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={billsData.electricitePayments?.intersaison1?.date || '2024-04-15'}
                          onChange={(e) => handlePaymentChange('electricite', 'intersaison1', 'date', e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          value={billsData.electricitePayments?.intersaison1?.amount || ''}
                          onChange={(e) => handlePaymentChange('electricite', 'intersaison1', 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="Montant"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.advancedExpenses.octoberNovember}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={billsData.electricitePayments?.intersaison2?.date || '2024-10-15'}
                          onChange={(e) => handlePaymentChange('electricite', 'intersaison2', 'date', e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          value={billsData.electricitePayments?.intersaison2?.amount || ''}
                          onChange={(e) => handlePaymentChange('electricite', 'intersaison2', 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="Montant"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Résumé de l'électricité */}
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-yellow-800">{t.advancedExpenses.totalAnnualElectricity}</span>
                  <span className="text-lg font-bold text-yellow-900">
                    {formatCurrency(
                      Object.values(billsData.electricitePayments || {}).reduce((sum: number, payment: any) => {
                        const amount = payment && typeof payment === 'object' && 'amount' in payment ? Number(payment.amount) : 0;
                        return sum + (amount || 0);
                      }, 0) as number
                    )}
                  </span>
                </div>
                <div className="mt-2 text-xs text-yellow-600">
                  {t.advancedExpenses.distributedOverBills} {Object.keys(billsData.electricitePayments || {}).length} {t.advancedExpenses.bimonthlyBills}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="autres" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.advancedExpenses.otherBills}</CardTitle>
              <CardDescription>{t.advancedExpenses.billsWithVariablePeriods}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.advancedExpenses.homeInsurance}</Label>
                  <Input
                    type="number"
                    value={billsData.assuranceHabitation || ''}
                    onChange={(e) => handleChange('assuranceHabitation', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="text-lg p-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.advancedExpenses.autoInsurance}</Label>
                  <Input
                    type="number"
                    value={billsData.assuranceAuto || ''}
                    onChange={(e) => handleChange('assuranceAuto', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="text-lg p-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const AdvancedExpensesSection: React.FC<AdvancedExpensesSectionProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('seasonal');
  const [showHelp, setShowHelp] = useState(false);
  const language = getLanguageFromURL();
  const t = useTranslation(language);

  const handleChange = (field: string, value: any) => {
    onUpdate('advancedExpenses', { [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec aide */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900">
              {t.advancedExpenses.title}
            </h1>
            <p className="text-lg text-charcoal-600 mt-1">
              {t.advancedExpenses.subtitle}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Info className="w-4 h-4 inline mr-2" />
          {t.advancedExpenses.help}
        </button>
      </div>

      {/* Message d'aide */}
      {showHelp && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            {t.advancedExpenses.helpText}
          </AlertDescription>
        </Alert>
      )}

      {/* Navigation par onglets */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg h-10">
              <TabsTrigger 
                value="seasonal" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium"
              >
                {t.advancedExpenses.seasonal}
              </TabsTrigger>
              <TabsTrigger 
                value="complex"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium"
              >
                {t.advancedExpenses.complex}
              </TabsTrigger>
              <TabsTrigger 
                value="monthly"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium"
              >
                {t.advancedExpenses.monthly}
              </TabsTrigger>
              <TabsTrigger 
                value="weekly"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium"
              >
                {t.advancedExpenses.weekly}
              </TabsTrigger>
            </TabsList>

            {/* Onglet Dépenses saisonnières */}
            <TabsContent value="seasonal" className="mt-6">
              <SeasonalExpensesComponent data={data.advancedExpenses || {}} onUpdate={handleChange} />
            </TabsContent>

            {/* Onglet Factures complexes */}
            <TabsContent value="complex" className="mt-6">
              <ComplexBillsComponent data={data.advancedExpenses || {}} onUpdate={handleChange} />
            </TabsContent>

            {/* Onglet Vue mensuelle */}
            <TabsContent value="monthly" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vue mensuelle des dépenses</CardTitle>
                    <CardDescription>Répartition mensuelle de toutes vos dépenses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Fonctionnalité en développement...</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Vue hebdomadaire */}
            <TabsContent value="weekly" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vue hebdomadaire des dépenses</CardTitle>
                    <CardDescription>Suivi hebdomadaire de vos dépenses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Fonctionnalité en développement...</p>
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