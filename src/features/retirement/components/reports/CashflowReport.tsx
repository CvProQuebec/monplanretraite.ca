import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, DollarSign, AlertTriangle, FileText, BarChart3, PieChart, Clock } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface CashflowReportProps {
  includeCharts?: boolean;
  includeLegalWarnings?: boolean;
  language?: 'fr' | 'en';
}

const CashflowReport: React.FC<CashflowReportProps> = ({
  includeCharts = true,
  includeLegalWarnings = true,
  language = 'fr'
}) => {
  const { language: currentLanguage } = useLanguage();
  const isEnglish = currentLanguage === 'en';
  
  const tr = {
    title: isEnglish ? 'Monthly Cashflow Report' : 'Rapport de flux de trésorerie mensuel',
    subtitle: isEnglish ? 'Weekly breakdown of income and expenses' : 'Répartition hebdomadaire des revenus et dépenses',
    generatedOn: isEnglish ? 'Generated on' : 'Généré le',
    currentMonth: isEnglish ? 'Current Month' : 'Mois actuel',
    nextMonth: isEnglish ? 'Next Month' : 'Mois suivant',
    weeklyBreakdown: isEnglish ? 'Weekly Breakdown' : 'Répartition hebdomadaire',
    income: isEnglish ? 'Income' : 'Revenus',
    expenses: isEnglish ? 'Expenses' : 'Dépenses',
    balance: isEnglish ? 'Balance' : 'Solde',
    week: isEnglish ? 'Week' : 'Semaine',
    total: isEnglish ? 'Total' : 'Total',
    trends: isEnglish ? 'Trends & Insights' : 'Tendances et insights',
    recommendations: isEnglish ? 'Recommendations' : 'Recommandations',
    legalDisclaimer: isEnglish ? 'Legal Disclaimer' : 'Avertissement légal',
    notReplacement: isEnglish ? 'This report does not replace professional consultation' : 'Ce rapport ne remplace pas une consultation professionnelle',
    consultProfessional: isEnglish ? 'Always consult a qualified financial advisor' : 'Consultez toujours un conseiller financier qualifié',
    savingsRate: isEnglish ? 'Savings Rate' : 'Taux d\'épargne',
    expenseCategories: isEnglish ? 'Expense Categories' : 'Catégories de dépenses',
    cashflowHealth: isEnglish ? 'Cashflow Health' : 'Santé du flux de trésorerie',
    improvement: isEnglish ? 'Areas for Improvement' : 'Zones d\'amélioration'
  };

  // Données simulées pour la démonstration
  const mockData = {
    currentMonth: {
      name: 'Décembre 2024',
      weeks: [
        { week: 1, income: 2500, expenses: 1800, balance: 700 },
        { week: 2, income: 2500, expenses: 2200, balance: 300 },
        { week: 3, income: 2500, expenses: 1900, balance: 600 },
        { week: 4, income: 2500, expenses: 2100, balance: 400 }
      ],
      totalIncome: 10000,
      totalExpenses: 8000,
      totalBalance: 2000
    },
    nextMonth: {
      name: 'Janvier 2025',
      weeks: [
        { week: 1, income: 2500, expenses: 1950, balance: 550 },
        { week: 2, income: 2500, expenses: 1850, balance: 650 },
        { week: 3, income: 2500, expenses: 2000, balance: 500 },
        { week: 4, income: 2500, expenses: 1900, balance: 600 }
      ],
      totalIncome: 10000,
      totalExpenses: 7700,
      totalBalance: 2300
    },
    expenseCategories: [
      { name: 'Housing', amount: 2500, percentage: 31.25 },
      { name: 'Transportation', amount: 800, percentage: 10 },
      { name: 'Food', amount: 600, percentage: 7.5 },
      { name: 'Utilities', amount: 400, percentage: 5 },
      { name: 'Entertainment', amount: 300, percentage: 3.75 },
      { name: 'Other', amount: 3400, percentage: 42.5 }
    ]
  };

  const getCashflowHealth = (balance: number, income: number) => {
    const ratio = balance / income;
    if (ratio >= 0.3) return { status: 'Excellent', color: 'green', badge: 'default' };
    if (ratio >= 0.2) return { status: 'Good', color: 'blue', badge: 'secondary' };
    if (ratio >= 0.1) return { status: 'Fair', color: 'yellow', badge: 'outline' };
    return { status: 'Poor', color: 'red', badge: 'destructive' };
  };

  const currentHealth = getCashflowHealth(mockData.currentMonth.totalBalance, mockData.currentMonth.totalIncome);
  const nextHealth = getCashflowHealth(mockData.nextMonth.totalBalance, mockData.nextMonth.totalIncome);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 space-y-6">
      {/* En-tête du rapport */}
      <div className="text-center border-b pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{tr.title}</h1>
        </div>
        <p className="text-gray-600 text-lg">{tr.subtitle}</p>
        <p className="text-sm text-gray-500 mt-2">
          {tr.generatedOn}: {new Date().toLocaleDateString(currentLanguage === 'fr' ? 'fr-CA' : 'en-US')}
        </p>
      </div>

      {/* Avertissement légal */}
      {includeLegalWarnings && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg text-red-800">{tr.legalDisclaimer}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-red-700 space-y-2">
              <p><strong>⚠️ {tr.notReplacement}</strong></p>
              <p>{tr.consultProfessional}</p>
              <p>This tool is for educational purposes only and is intended to inform discussions with an independent professional of your choice.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résumé du mois actuel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {tr.currentMonth} - {mockData.currentMonth.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">{tr.income}</p>
              <p className="text-2xl font-bold text-green-900">${mockData.currentMonth.totalIncome.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">{tr.expenses}</p>
              <p className="text-2xl font-bold text-red-900">${mockData.currentMonth.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">{tr.balance}</p>
              <p className="text-2xl font-bold text-blue-900">${mockData.currentMonth.totalBalance.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Santé du cashflow */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">{tr.cashflowHealth}</span>
            <Badge variant={currentHealth.badge as any}>{currentHealth.status}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Répartition hebdomadaire - Mois actuel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            {tr.weeklyBreakdown} - {mockData.currentMonth.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.currentMonth.weeks.map((week) => (
              <div key={week.week} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="font-medium">{tr.week} {week.week}</span>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-green-600">+${week.income.toLocaleString()}</span>
                    <span className="text-red-600">-${week.expenses.toLocaleString()}</span>
                  </div>
                </div>
                <Badge variant={week.balance >= 0 ? 'default' : 'destructive'}>
                  {week.balance >= 0 ? '+' : ''}${week.balance.toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projection du mois suivant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            {tr.nextMonth} - {mockData.nextMonth.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">{tr.income}</p>
              <p className="text-2xl font-bold text-green-900">${mockData.nextMonth.totalIncome.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">{tr.expenses}</p>
              <p className="text-2xl font-bold text-red-900">${mockData.nextMonth.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">{tr.balance}</p>
              <p className="text-2xl font-bold text-blue-900">${mockData.nextMonth.totalBalance.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Santé du cashflow projeté */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">{tr.cashflowHealth} (Projected)</span>
            <Badge variant={nextHealth.badge as any}>{nextHealth.status}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Catégories de dépenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-600" />
            {tr.expenseCategories}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.expenseCategories.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{category.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-red-600">${category.amount.toLocaleString()}</span>
                  <Badge variant="outline">{category.percentage.toFixed(1)}{' %'}</Badge>
                </div>
              </div>
            ))}
          </div>
          {includeCharts && (
            <div className="p-4 bg-gray-50 rounded-lg text-center mt-4">
              <p className="text-gray-600">📊 Pie chart visualization would appear here</p>
              <p className="text-sm text-gray-500">Expense breakdown by category</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tendances et insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            {tr.trends}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">📈 Positive Trends</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Monthly savings rate: {(mockData.currentMonth.totalBalance / mockData.currentMonth.totalIncome * 100).toFixed(1)}{' %'}</li>
                <li>• Expenses decreased by ${(mockData.currentMonth.totalExpenses - mockData.nextMonth.totalExpenses).toLocaleString()} next month</li>
                <li>• Consistent weekly income flow</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Areas to Watch</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Week 2 expenses were 12{' %'} higher than average</li>
                <li>• Housing costs represent 31.25{' %'} of total expenses</li>
                <li>• Consider setting up emergency fund</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            {tr.recommendations}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
              <div>
                <p className="font-medium">Set up automatic savings transfers</p>
                <p className="text-sm text-gray-600">Transfer ${mockData.currentMonth.totalBalance} monthly to savings account</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
              <div>
                <p className="font-medium">Review housing expenses</p>
                <p className="text-sm text-gray-600">Consider refinancing or downsizing to reduce housing costs</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
              <div>
                <p className="font-medium">Create weekly budget targets</p>
                <p className="text-sm text-gray-600">Aim for weekly expenses under $2,000</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pied de page */}
      <div className="text-center text-sm text-gray-500 border-t pt-6">
        <p>This report was generated by the AI Retirement Planner platform</p>
        <p>For professional advice, consult a qualified financial advisor</p>
      </div>
    </div>
  );
};

export default CashflowReport;
