import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Calculator, Shield, AlertTriangle, FileText, BarChart3, PieChart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ComprehensiveReportProps {
  includeCharts?: boolean;
  includeLegalWarnings?: boolean;
  language?: 'fr' | 'en';
}

const ComprehensiveReport: React.FC<ComprehensiveReportProps> = ({
  includeCharts = true,
  includeLegalWarnings = true,
  language = 'fr'
}) => {
  const { isEnglish } = useLanguage();
  
  const tr = {
    title: isEnglish ? 'Comprehensive Financial Planning Report' : 'Rapport de planification financière complète',
    subtitle: isEnglish ? 'Professional report for financial advisors' : 'Rapport professionnel pour conseillers financiers',
    generatedOn: isEnglish ? 'Generated on' : 'Généré le',
    personalInfo: isEnglish ? 'Personal Information' : 'Informations personnelles',
    currentFinancial: isEnglish ? 'Current Financial Situation' : 'Situation financière actuelle',
    retirementGoals: isEnglish ? 'Retirement Goals' : 'Objectifs de retraite',
    projections: isEnglish ? 'Financial Projections' : 'Projections financières',
    recommendations: isEnglish ? 'Action Plan & Recommendations' : 'Plan d\'action et recommandations',
    riskAnalysis: isEnglish ? 'Risk Analysis' : 'Analyse des risques',
    legalDisclaimer: isEnglish ? 'Legal Disclaimer' : 'Avertissement légal',
    notReplacement: isEnglish ? 'This report does not replace professional consultation' : 'Ce rapport ne remplace pas une consultation professionnelle',
    consultProfessional: isEnglish ? 'Always consult a qualified financial advisor' : 'Consultez toujours un conseiller financier qualifié',
    age: isEnglish ? 'Age' : 'Âge',
    income: isEnglish ? 'Annual Income' : 'Revenu annuel',
    savings: isEnglish ? 'Current Savings' : 'Épargne actuelle',
    targetRetirement: isEnglish ? 'Target Retirement Age' : 'Âge de retraite cible',
    targetAmount: isEnglish ? 'Target Retirement Amount' : 'Montant de retraite cible',
    monthlySavings: isEnglish ? 'Required Monthly Savings' : 'Épargne mensuelle requise',
    riskTolerance: isEnglish ? 'Risk Tolerance' : 'Tolérance au risque',
    investmentStrategy: isEnglish ? 'Investment Strategy' : 'Stratégie d\'investissement',
    timeline: isEnglish ? 'Timeline' : 'Échéancier',
    nextSteps: isEnglish ? 'Next Steps' : 'Prochaines étapes'
  };

  // Données simulées pour la démonstration
  const mockData = {
    age: 45,
    income: 75000,
    savings: 150000,
    targetAge: 65,
    targetAmount: 1000000,
    monthlySavings: 1200,
    riskTolerance: 'Moderate',
    debtToIncome: 0.25
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 space-y-6">
      {/* En-tête du rapport */}
      <div className="text-center border-b pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-mpr-interactive to-purple-600 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{tr.title}</h1>
        </div>
        <p className="text-gray-600 text-lg">{tr.subtitle}</p>
        <p className="text-sm text-gray-500 mt-2">
          {tr.generatedOn}: {new Date().toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-US')}
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

      {/* Informations personnelles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-mpr-interactive" />
            {tr.personalInfo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-mpr-interactive-lt rounded-lg">
              <p className="text-sm text-gray-600">{tr.age}</p>
              <p className="text-xl font-bold text-mpr-navy">{mockData.age}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">{tr.income}</p>
              <p className="text-xl font-bold text-green-900">${mockData.income.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">{tr.savings}</p>
              <p className="text-xl font-bold text-purple-900">${mockData.savings.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">{tr.targetRetirement}</p>
              <p className="text-xl font-bold text-orange-900">{mockData.targetAge}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Situation financière actuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            {tr.currentFinancial}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{tr.income}</span>
              <Badge variant="outline">${mockData.income.toLocaleString()}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{tr.savings}</span>
              <Badge variant="outline">${mockData.savings.toLocaleString()}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Debt-to-Income Ratio</span>
              <Badge variant="outline">{(mockData.debtToIncome * 100).toFixed(1)}%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objectifs de retraite */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            {tr.retirementGoals}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-mpr-interactive-lt rounded-lg">
              <p className="text-2xl font-bold text-purple-900">
                ${mockData.targetAmount.toLocaleString()}
              </p>
              <p className="text-gray-600">{tr.targetAmount}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-mpr-interactive-lt rounded-lg">
                <p className="text-sm text-gray-600">{tr.targetRetirement}</p>
                <p className="text-xl font-bold text-mpr-navy">{mockData.targetAge} ans</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">{tr.monthlySavings}</p>
                <p className="text-xl font-bold text-green-900">${mockData.monthlySavings}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projections financières */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            {tr.projections}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">5 years</p>
                <p className="text-lg font-bold text-orange-900">$250,000</p>
              </div>
              <div className="text-center p-4 bg-mpr-interactive-lt rounded-lg">
                <p className="text-sm text-gray-600">10 years</p>
                <p className="text-lg font-bold text-mpr-navy">$450,000</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">20 years</p>
                <p className="text-lg font-bold text-green-900">$1,000,000</p>
              </div>
            </div>
            {includeCharts && (
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600">📊 Chart visualization would appear here</p>
                <p className="text-sm text-gray-500">Projected savings growth over time</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan d'action et recommandations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-600" />
            {tr.recommendations}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">{tr.monthlySavings}</h4>
              <p className="text-green-700">Increase monthly savings to ${mockData.monthlySavings} to reach your retirement goal</p>
            </div>
            <div className="p-4 bg-mpr-interactive-lt rounded-lg">
              <h4 className="font-semibold text-mpr-navy mb-2">{tr.investmentStrategy}</h4>
              <p className="text-mpr-navy">Consider a balanced portfolio with 60% stocks, 30% bonds, and 10% alternatives</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">{tr.riskTolerance}</h4>
              <p className="text-purple-700">Your moderate risk tolerance allows for growth-oriented investments</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analyse des risques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            {tr.riskAnalysis}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-red-700">Market volatility risk</span>
              <Badge variant="destructive">High</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-700">Inflation risk</span>
              <Badge variant="secondary">Medium</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-700">Longevity risk</span>
              <Badge variant="default">Low</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prochaines étapes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-mpr-interactive" />
            {tr.nextSteps}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-mpr-interactive text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
              <div>
                <p className="font-medium">Share this report with a financial advisor of your choice</p>
                <p className="text-sm text-gray-600">Review this report together and discuss personalized strategies</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-mpr-interactive text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
              <div>
                <p className="font-medium">Implement monthly savings plan</p>
                <p className="text-sm text-gray-600">Set up automatic transfers to retirement accounts</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-mpr-interactive text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
              <div>
                <p className="font-medium">Review and adjust annually</p>
                <p className="text-sm text-gray-600">Monitor progress and update goals as needed</p>
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

export default ComprehensiveReport;
