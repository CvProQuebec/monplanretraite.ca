import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, AlertTriangle, FileText, BarChart3, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useRetirementData } from '../../hooks/useRetirementData';

interface ExecutiveSummaryReportProps {
  includeCharts?: boolean;
  includeLegalWarnings?: boolean;
  language?: 'fr' | 'en';
}

const ExecutiveSummaryReport: React.FC<ExecutiveSummaryReportProps> = ({
  includeCharts = true,
  includeLegalWarnings = true,
  language = 'fr'
}) => {
  const { isEnglish } = useLanguage();
  const { data: retirementData } = useRetirementData();
  
  const tr = {
    title: isEnglish ? 'Executive Summary Report' : 'Rapport de résumé exécutif',
    subtitle: isEnglish ? 'Key insights and recommendations overview' : 'Aperçu des points clés et recommandations',
    generatedOn: isEnglish ? 'Generated on' : 'Généré le',
    executiveSummary: isEnglish ? 'Executive Summary' : 'Résumé exécutif',
    keyMetrics: isEnglish ? 'Key Metrics' : 'Métriques clés',
    currentStatus: isEnglish ? 'Current Status' : 'Statut actuel',
    goals: isEnglish ? 'Goals & Objectives' : 'Objectifs et buts',
    recommendations: isEnglish ? 'Key Recommendations' : 'Recommandations clés',
    nextSteps: isEnglish ? 'Next Steps' : 'Prochaines étapes',
    timeline: isEnglish ? 'Timeline' : 'Échéancier',
    legalDisclaimer: isEnglish ? 'Legal Disclaimer' : 'Avertissement légal',
    notReplacement: isEnglish ? 'This report does not replace professional consultation' : 'Ce rapport ne remplace pas une consultation professionnelle',
    consultProfessional: isEnglish ? 'Always consult a qualified financial advisor' : 'Consultez toujours un conseiller financier qualifié',
    age: isEnglish ? 'Age' : 'Âge',
    income: isEnglish ? 'Annual Income' : 'Revenu annuel',
    savings: isEnglish ? 'Current Savings' : 'Épargne actuelle',
    targetRetirement: isEnglish ? 'Target Retirement Age' : 'Âge de retraite cible',
    targetAmount: isEnglish ? 'Target Retirement Amount' : 'Montant de retraite cible',
    monthlySavings: isEnglish ? 'Required Monthly Savings' : 'Épargne mensuelle requise',
    progress: isEnglish ? 'Progress' : 'Progrès',
    onTrack: isEnglish ? 'On Track' : 'Sur la bonne voie',
    needsAttention: isEnglish ? 'Needs Attention' : 'Nécessite attention',
    atRisk: isEnglish ? 'At Risk' : 'À risque',
    priority: isEnglish ? 'Priority' : 'Priorité',
    high: isEnglish ? 'High' : 'Élevée',
    medium: isEnglish ? 'Medium' : 'Moyenne',
    low: isEnglish ? 'Low' : 'Faible'
  };

  // Données simulées pour la démonstration
  const mockData = {
    age: 45,
    income: 75000,
    savings: 150000,
    targetAge: 65,
    targetAmount: 1000000,
    monthlySavings: 1200,
    currentMonthlySavings: 800,
    yearsToRetirement: 20,
    progressPercentage: 15,
    riskLevel: 'Medium',
    keyMetrics: {
      savingsRate: 12.8,
      debtToIncome: 0.25,
      emergencyFund: 6,
      investmentAllocation: 'Balanced'
    },
    goals: [
      { name: 'Emergency Fund', status: 'Complete', priority: 'High' },
      { name: 'Debt Reduction', status: 'In Progress', priority: 'High' },
      { name: 'Retirement Savings', status: 'On Track', priority: 'High' },
      { name: 'Tax Optimization', status: 'Not Started', priority: 'Medium' }
    ],
    recommendations: [
      { action: 'Increase monthly savings', impact: 'High', effort: 'Medium', timeline: '3 months' },
      { action: 'Diversify investments', impact: 'Medium', effort: 'Low', timeline: '1 month' },
      { action: 'Review insurance coverage', impact: 'Medium', effort: 'Low', timeline: '2 months' },
      { action: 'Estate planning', impact: 'Low', effort: 'High', timeline: '6 months' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'default';
      case 'On Track': return 'default';
      case 'In Progress': return 'secondary';
      case 'Not Started': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'default';
      default: return 'outline';
    }
  };

  const getProgressStatus = (percentage: number) => {
    if (percentage >= 80) return { status: tr.onTrack, color: 'default', icon: '✅' };
    if (percentage >= 50) return { status: tr.onTrack, color: 'secondary', icon: '🟡' };
    if (percentage >= 25) return { status: tr.needsAttention, color: 'outline', icon: '⚠️' };
    return { status: tr.atRisk, color: 'destructive', icon: '🔴' };
  };

  const progressStatus = getProgressStatus(mockData.progressPercentage);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 space-y-6">
      {/* En-tête du rapport */}
      <div className="text-center border-b pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-mpr-interactive to-green-600 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
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
              <p>This tool is for educational purposes only and should be used as a starting point for professional consultation.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résumé exécutif */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-mpr-interactive" />
            {tr.executiveSummary}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-mpr-interactive-lt rounded-lg">
              <h4 className="font-semibold text-mpr-navy mb-2">📊 Current Situation</h4>
              <p className="text-mpr-navy">
                You are {mockData.age} years old with ${mockData.savings.toLocaleString()} in savings, 
                targeting retirement at age {mockData.targetAge} with a goal of ${mockData.targetAmount.toLocaleString()}. 
                You are currently {progressStatus.icon} <strong>{progressStatus.status}</strong> with {mockData.progressPercentage}% progress.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">🎯 Key Insight</h4>
              <p className="text-green-700">
                To reach your retirement goal, you need to increase monthly savings from ${mockData.currentMonthlySavings} 
                to ${mockData.monthlySavings} (${mockData.monthlySavings - mockData.currentMonthlySavings} additional per month).
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">⏰ Timeline</h4>
              <p className="text-purple-700">
                You have {mockData.yearsToRetirement} years until retirement. With consistent saving and 
                reasonable investment returns, your goal is achievable with focused effort.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métriques clés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            {tr.keyMetrics}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-mpr-interactive-lt rounded-lg">
              <p className="text-sm text-gray-600">Savings Rate</p>
              <p className="text-xl font-bold text-mpr-navy">{mockData.keyMetrics.savingsRate}%</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Debt/Income</p>
              <p className="text-xl font-bold text-green-900">{(mockData.keyMetrics.debtToIncome * 100).toFixed(1)}%</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Emergency Fund</p>
              <p className="text-xl font-bold text-purple-900">{mockData.keyMetrics.emergencyFund} months</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Investment Style</p>
              <p className="text-lg font-bold text-orange-900">{mockData.keyMetrics.investmentAllocation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statut actuel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-mpr-interactive" />
            {tr.currentStatus}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{tr.progress}</span>
              <div className="flex items-center gap-2">
                <span>{progressStatus.icon}</span>
                <Badge variant={progressStatus.color as any}>{progressStatus.status}</Badge>
                <span className="text-sm text-gray-500">{mockData.progressPercentage}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Risk Level</span>
              <Badge variant="secondary">{mockData.riskLevel}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Years to Retirement</span>
              <Badge variant="outline">{mockData.yearsToRetirement} years</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objectifs et buts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            {tr.goals}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.goals.map((goal) => (
              <div key={goal.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{goal.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(goal.status) as any}>{goal.status}</Badge>
                  <Badge variant={getPriorityColor(goal.priority) as any}>{goal.priority}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommandations clés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            {tr.recommendations}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{rec.action}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(rec.impact) as any}>{rec.impact}</Badge>
                    <Badge variant="outline">{rec.effort}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {rec.timeline}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {rec.impact} impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prochaines étapes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-mpr-interactive" />
            {tr.nextSteps}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-mpr-interactive text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
              <div>
                <p className="font-medium">Immediate (This Month)</p>
                <p className="text-sm text-gray-600">Increase monthly savings by ${mockData.monthlySavings - mockData.currentMonthlySavings}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-mpr-interactive text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
              <div>
                <p className="font-medium">Short-term (3 months)</p>
                <p className="text-sm text-gray-600">Review and optimize investment portfolio allocation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-mpr-interactive text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
              <div>
                <p className="font-medium">Medium-term (6 months)</p>
                <p className="text-sm text-gray-600">Consult with financial advisor for comprehensive review</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-mpr-interactive text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">4</div>
              <div>
                <p className="font-medium">Long-term (Annually)</p>
                <p className="text-sm text-gray-600">Reassess goals and adjust strategy as needed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pied de page */}
      <div className="text-center text-sm text-gray-500 border-t pt-6">
        <p>This report was generated by the AI Retirement Planner platform</p>
        <p>For professional advice, consult a qualified financial advisor</p>
        <p className="mt-2 text-xs">
          This summary provides a high-level overview. For detailed analysis, 
          refer to comprehensive reports or consult a financial professional.
        </p>
      </div>
    </div>
  );
};

export default ExecutiveSummaryReport;
