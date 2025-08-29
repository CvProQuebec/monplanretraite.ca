import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, AlertTriangle, FileText, BarChart3, Target, Shield, Activity } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useRetirementData } from '../../hooks/useRetirementData';

interface MonteCarloReportProps {
  includeCharts?: boolean;
  includeLegalWarnings?: boolean;
  language?: 'fr' | 'en';
}

const MonteCarloReport: React.FC<MonteCarloReportProps> = ({
  includeCharts = true,
  includeLegalWarnings = true,
  language = 'fr'
}) => {
  const { isEnglish } = useLanguage();
  const { data: retirementData } = useRetirementData();
  
  const tr = {
    title: isEnglish ? 'Monte Carlo Simulation Report' : 'Rapport de simulation Monte Carlo',
    subtitle: isEnglish ? 'Risk analysis and probability scenarios for retirement planning' : 'Analyse des risques et scénarios de probabilité pour la planification de retraite',
    generatedOn: isEnglish ? 'Generated on' : 'Généré le',
    simulationSummary: isEnglish ? 'Simulation Summary' : 'Résumé de simulation',
    riskScenarios: isEnglish ? 'Risk Scenarios' : 'Scénarios de risque',
    probabilityAnalysis: isEnglish ? 'Probability Analysis' : 'Analyse des probabilités',
    recommendations: isEnglish ? 'Risk Management Recommendations' : 'Recommandations de gestion des risques',
    legalDisclaimer: isEnglish ? 'Legal Disclaimer' : 'Avertissement légal',
    notReplacement: isEnglish ? 'This report does not replace professional consultation' : 'Ce rapport ne remplace pas une consultation professionnelle',
    consultProfessional: isEnglish ? 'Always consult a qualified financial advisor' : 'Consultez toujours un conseiller financier qualifié',
    simulations: isEnglish ? 'Simulations' : 'Simulations',
    successRate: isEnglish ? 'Success Rate' : 'Taux de succès',
    worstCase: isEnglish ? 'Worst Case' : 'Pire scénario',
    bestCase: isEnglish ? 'Best Case' : 'Meilleur scénario',
    medianCase: isEnglish ? 'Median Case' : 'Scénario médian',
    confidenceLevel: isEnglish ? 'Confidence Level' : 'Niveau de confiance',
    riskFactors: isEnglish ? 'Risk Factors' : 'Facteurs de risque',
    marketVolatility: isEnglish ? 'Market Volatility' : 'Volatilité du marché',
    inflationRisk: isEnglish ? 'Inflation Risk' : 'Risque d\'inflation',
    longevityRisk: isEnglish ? 'Longevity Risk' : 'Risque de longévité',
    sequenceRisk: isEnglish ? 'Sequence of Returns Risk' : 'Risque de séquence des rendements'
  };

  // Données simulées pour la démonstration
  const mockData = {
    totalSimulations: 1000,
    successRate: 78.5,
    targetAmount: 1000000,
    scenarios: {
      worstCase: 650000,
      bestCase: 1800000,
      medianCase: 1050000,
      percentile10: 750000,
      percentile25: 850000,
      percentile75: 1250000,
      percentile90: 1400000
    },
    riskFactors: [
      { name: 'Market Volatility', impact: 'High', probability: 85, mitigation: 'Diversification' },
      { name: 'Inflation', impact: 'Medium', probability: 70, mitigation: 'TIPS/Real Assets' },
      { name: 'Longevity', impact: 'Medium', probability: 60, mitigation: 'Annuities' },
      { name: 'Sequence Risk', impact: 'High', probability: 45, mitigation: 'Bond Tent' }
    ],
    timeHorizon: 20,
    annualReturn: 7.2,
    volatility: 15.5
  };

  const getRiskColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 space-y-6">
      {/* En-tête du rapport */}
      <div className="text-center border-b pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
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

      {/* Résumé de simulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            {tr.simulationSummary}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">{tr.simulations}</p>
              <p className="text-2xl font-bold text-blue-900">{mockData.totalSimulations.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">{tr.successRate}</p>
              <p className="text-2xl font-bold text-green-900">{mockData.successRate}%</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Time Horizon</p>
              <p className="text-2xl font-bold text-purple-900">{mockData.timeHorizon} years</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Annual Return</p>
              <p className="text-2xl font-bold text-orange-900">{mockData.annualReturn}%</p>
            </div>
          </div>
          
          {/* Objectif de retraite */}
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-900">
              ${mockData.targetAmount.toLocaleString()}
            </p>
            <p className="text-gray-600">Target Retirement Amount</p>
          </div>
        </CardContent>
      </Card>

      {/* Scénarios de risque */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            {tr.riskScenarios}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">{tr.worstCase}</p>
              <p className="text-xl font-bold text-red-900">${mockData.scenarios.worstCase.toLocaleString()}</p>
              <p className="text-xs text-gray-500">10th percentile</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">25th Percentile</p>
              <p className="text-xl font-bold text-yellow-900">${mockData.scenarios.percentile25.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Conservative</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">{tr.medianCase}</p>
              <p className="text-xl font-bold text-blue-900">${mockData.scenarios.medianCase.toLocaleString()}</p>
              <p className="text-xs text-gray-500">50th percentile</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">{tr.bestCase}</p>
              <p className="text-xl font-bold text-green-900">${mockData.scenarios.bestCase.toLocaleString()}</p>
              <p className="text-xs text-gray-500">90th percentile</p>
            </div>
          </div>
          
          {includeCharts && (
            <div className="p-4 bg-gray-50 rounded-lg text-center mt-6">
              <p className="text-gray-600">📊 Distribution chart would appear here</p>
              <p className="text-sm text-gray-500">Probability distribution of retirement outcomes</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analyse des probabilités */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            {tr.probabilityAnalysis}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Probability of Success</p>
                <p className="text-2xl font-bold text-green-900">{mockData.successRate}%</p>
                <p className="text-xs text-gray-500">Reaching target amount</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Confidence Interval</p>
                <p className="text-lg font-bold text-blue-900">75% - 90%</p>
                <p className="text-xs text-gray-500">Range of outcomes</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Volatility</p>
                <p className="text-lg font-bold text-purple-900">{mockData.volatility}%</p>
                <p className="text-xs text-gray-500">Annual standard deviation</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Key Insights:</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• {mockData.successRate}% chance of reaching your retirement goal</li>
                <li>• Median outcome: ${mockData.scenarios.medianCase.toLocaleString()} (5% above target)</li>
                <li>• Worst 10% of scenarios: ${mockData.scenarios.worstCase.toLocaleString()}</li>
                <li>• Best 10% of scenarios: ${mockData.scenarios.bestCase.toLocaleString()}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facteurs de risque */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            {tr.riskFactors}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.riskFactors.map((factor) => (
              <div key={factor.name} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{factor.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={getRiskColor(factor.impact) as any}>{factor.impact}</Badge>
                    <Badge variant="outline">{factor.probability}%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Mitigation Strategy:</span>
                  <span className="text-blue-600 font-medium">{factor.mitigation}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommandations de gestion des risques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            {tr.recommendations}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">🎯 Immediate Actions</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Increase monthly savings by 15% to improve success probability</li>
                <li>• Diversify portfolio across multiple asset classes</li>
                <li>• Consider adding inflation-protected securities (TIPS)</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">📊 Portfolio Adjustments</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Implement bond tent strategy for sequence risk protection</li>
                <li>• Add real estate and commodities for inflation hedge</li>
                <li>• Consider annuities for longevity risk management</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">🔄 Ongoing Monitoring</h4>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Re-run simulations annually with updated data</li>
                <li>• Adjust strategy based on market conditions</li>
                <li>• Review risk tolerance and goals every 5 years</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pied de page */}
      <div className="text-center text-sm text-gray-500 border-t pt-6">
        <p>This report was generated by the AI Retirement Planner platform</p>
        <p>For professional advice, consult a qualified financial advisor</p>
        <p className="mt-2 text-xs">
          Monte Carlo simulations are based on historical data and assumptions. 
          Past performance does not guarantee future results.
        </p>
      </div>
    </div>
  );
};

export default MonteCarloReport;
