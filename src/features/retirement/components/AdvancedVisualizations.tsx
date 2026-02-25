import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  LineChart, 
  Target,
  Info,
  Download,
  RefreshCw
} from 'lucide-react';
import { CombinedCalculationResult, RetirementScenario } from '../types/combined-pension';
import { useLanguage } from '../hooks/useLanguage';

interface AdvancedVisualizationsProps {
  combinedResults: CombinedCalculationResult | null;
  scenarios: RetirementScenario[];
  className?: string;
}

export const AdvancedVisualizations: React.FC<AdvancedVisualizationsProps> = ({ 
  combinedResults, 
  scenarios, 
  className 
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('income-breakdown');
  const [chartData, setChartData] = useState<any>(null);
  
  const texts = {
    fr: {
      title: 'Visualisations Avancées',
      subtitle: 'Analysez vos données de retraite avec des graphiques et comparaisons détaillées',
      incomeBreakdown: 'Répartition des revenus',
      scenarioComparison: 'Comparaison des scénarios',
      sustainabilityAnalysis: 'Analyse de durabilité',
      recommendations: 'Recommandations',
      exportChart: 'Exporter le graphique',
      refreshData: 'Actualiser',
      noData: 'Aucune donnée disponible pour la visualisation',
      cpp: 'CPP',
      rrq: 'RRQ',
      personalSavings: 'Épargne personnelle',
      monthlyIncome: 'Revenu mensuel ($)',
      annualIncome: 'Revenu annuel ($)',
      replacementRate: 'Taux de remplacement (%)',
      sustainabilityScore: 'Score de durabilité',
      conservative: 'Conservateur',
      moderate: 'Modéré',
      aggressive: 'Agressif',
      successProbability: 'Probabilité de succès',
      riskLevel: 'Niveau de risque',
      low: 'Faible',
      medium: 'Modéré',
      high: 'Élevé'
    },
    en: {
      title: 'Advanced Visualizations',
      subtitle: 'Analyze your retirement data with detailed charts and comparisons',
      incomeBreakdown: 'Income breakdown',
      scenarioComparison: 'Scenario comparison',
      sustainabilityAnalysis: 'Sustainability analysis',
      recommendations: 'Recommendations',
      exportChart: 'Export chart',
      refreshData: 'Refresh',
      noData: 'No data available for visualization',
      cpp: 'CPP',
      rrq: 'RRQ',
      personalSavings: 'Personal savings',
      monthlyIncome: 'Monthly income ($)',
      annualIncome: 'Annual income ($)',
      replacementRate: 'Replacement rate (%)',
      sustainabilityScore: 'Sustainability score',
      conservative: 'Conservative',
      moderate: 'Moderate',
      aggressive: 'Aggressive',
      successProbability: 'Success probability',
      riskLevel: 'Risk level',
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    }
  };
  
  const t = texts[language];
  
  // Génération des données de graphique
  useEffect(() => {
    if (combinedResults) {
      generateChartData();
    }
  }, [combinedResults, scenarios]);
  
  const generateChartData = () => {
    if (!combinedResults) return;
    
    // Données pour la répartition des revenus
    const incomeData = {
      labels: [t.cpp, t.rrq, t.personalSavings],
      datasets: [{
        data: [
          combinedResults.cpp.pensionMensuelle,
          combinedResults.rrq.pensionMensuelle,
          combinedResults.personalSavings.revenuMensuel
        ],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
        borderColor: ['#2563EB', '#059669', '#D97706'],
        borderWidth: 2
      }]
    };
    
    // Données pour la comparaison des scénarios
    const scenarioData = {
      labels: scenarios.map(s => s.nom),
      datasets: [{
        label: t.monthlyIncome,
        data: scenarios.map(s => s.resultats.totalMonthlyIncome),
        backgroundColor: scenarios.map((_, i) => 
          i === 0 ? '#3B82F6' : i === 1 ? '#10B981' : '#F59E0B'
        ),
        borderColor: scenarios.map((_, i) => 
          i === 0 ? '#2563EB' : i === 1 ? '#059669' : '#D97706'
        ),
        borderWidth: 2
      }]
    };
    
    // Données pour l'analyse de durabilité
    const sustainabilityData = {
      labels: [t.replacementRate, t.sustainabilityScore],
      datasets: [{
        label: 'Valeurs',
        data: [
          combinedResults.replacementRate,
          combinedResults.sustainabilityScore
        ],
        backgroundColor: [
          combinedResults.replacementRate >= 70 ? '#10B981' : '#EF4444',
          combinedResults.sustainabilityScore >= 70 ? '#10B981' : '#EF4444'
        ],
        borderColor: [
          combinedResults.replacementRate >= 70 ? '#059669' : '#DC2626',
          combinedResults.sustainabilityScore >= 70 ? '#059669' : '#DC2626'
        ],
        borderWidth: 2
      }]
    };
    
    setChartData({
      income: incomeData,
      scenarios: scenarioData,
      sustainability: sustainabilityData
    });
  };
  
  // Export des graphiques
  const exportChart = (chartType: string) => {
    // TODO: Implémenter l'export des graphiques
    console.log(`Export du graphique: ${chartType}`);
  };
  
  // Actualisation des données
  const refreshData = () => {
    generateChartData();
  };
  
  if (!combinedResults || !chartData) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center text-gray-500">
          {t.noData}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {t.subtitle}
        </p>
      </div>
      
      {/* Onglets de visualisation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="income-breakdown">{t.incomeBreakdown}</TabsTrigger>
          <TabsTrigger value="scenario-comparison">{t.scenarioComparison}</TabsTrigger>
          <TabsTrigger value="sustainability-analysis">{t.sustainabilityAnalysis}</TabsTrigger>
          <TabsTrigger value="recommendations">{t.recommendations}</TabsTrigger>
        </TabsList>
        
        {/* Répartition des revenus */}
        <TabsContent value="income-breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Répartition des revenus mensuels
              </CardTitle>
              <CardDescription>
                Visualisez la contribution de chaque source de revenu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Graphique en camembert simplifié */}
                <div className="flex justify-center">
                  <div className="relative w-64 h-64">
                    <svg width="256" height="256" viewBox="0 0 256 256">
                      {/* CPP */}
                      <circle
                        cx="128"
                        cy="128"
                        r="100"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="40"
                        strokeDasharray={`${(combinedResults.cpp.pensionMensuelle / combinedResults.totalMonthlyIncome) * 628} 628`}
                        transform="rotate(-90 128 128)"
                      />
                      {/* RRQ */}
                      <circle
                        cx="128"
                        cy="128"
                        r="60"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="40"
                        strokeDasharray={`${(combinedResults.rrq.pensionMensuelle / combinedResults.totalMonthlyIncome) * 377} 377`}
                        transform="rotate(-90 128 128)"
                      />
                      {/* Épargne personnelle */}
                      <circle
                        cx="128"
                        cy="128"
                        r="20"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="40"
                        strokeDasharray={`${(combinedResults.personalSavings.revenuMensuel / combinedResults.totalMonthlyIncome) * 126} 126`}
                        transform="rotate(-90 128 128)"
                      />
                    </svg>
                  </div>
                </div>
                
                {/* Légende */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="w-4 h-4 bg-mpr-interactive rounded mx-auto"></div>
                    <div className="text-sm font-medium">{t.cpp}</div>
                    <div className="text-lg font-bold text-mpr-interactive">
                      ${combinedResults.cpp.pensionMensuelle.toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-4 h-4 bg-green-500 rounded mx-auto"></div>
                    <div className="text-sm font-medium">{t.rrq}</div>
                    <div className="text-lg font-bold text-green-600">
                      ${combinedResults.rrq.pensionMensuelle.toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded mx-auto"></div>
                    <div className="text-sm font-medium">{t.personalSavings}</div>
                    <div className="text-lg font-bold text-yellow-600">
                      ${combinedResults.personalSavings.revenuMensuel.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => exportChart('income-breakdown')}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {t.exportChart}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Comparaison des scénarios */}
        <TabsContent value="scenario-comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Comparaison des scénarios de retraite
              </CardTitle>
              <CardDescription>
                Analysez les différents scénarios et leurs résultats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Graphique en barres simplifié */}
                <div className="space-y-4">
                  {scenarios.map((scenario, index) => {
                    const maxIncome = Math.max(...scenarios.map(s => s.resultats.totalMonthlyIncome));
                    const barWidth = (scenario.resultats.totalMonthlyIncome / maxIncome) * 100;
                    const colors = ['#3B82F6', '#10B981', '#F59E0B'];
                    
                    return (
                      <div key={scenario.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{scenario.nom}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              scenario.niveauRisque === 'Faible' ? "default" : 
                              scenario.niveauRisque === 'Modéré' ? "secondary" : "destructive"
                            }>
                              {scenario.niveauRisque}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {(scenario.probabiliteReussite * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="h-4 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${barWidth}%`, 
                              backgroundColor: colors[index],
                              minWidth: '20px'
                            }}
                          ></div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          ${scenario.resultats.totalMonthlyIncome.toFixed(2)}/mois
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => exportChart('scenario-comparison')}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {t.exportChart}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analyse de durabilité */}
        <TabsContent value="sustainability-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analyse de la durabilité du plan
              </CardTitle>
              <CardDescription>
                Évaluez la viabilité à long terme de votre plan de retraite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Métriques de durabilité */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-mpr-interactive mb-2">
                      {combinedResults.replacementRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">{t.replacementRate}</div>
                    <div className="mt-2">
                      <Badge variant={combinedResults.replacementRate >= 70 ? "default" : "destructive"}>
                        {combinedResults.replacementRate >= 70 ? 'Suffisant' : 'Insuffisant'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {combinedResults.sustainabilityScore}/100
                    </div>
                    <div className="text-sm text-gray-600">{t.sustainabilityScore}</div>
                    <div className="mt-2">
                      <Badge variant={combinedResults.sustainabilityScore >= 70 ? "default" : "destructive"}>
                        {combinedResults.sustainabilityScore >= 70 ? 'Durable' : 'À améliorer'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Barre de progression de durabilité */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Durabilité</span>
                    <span>{combinedResults.sustainabilityScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${combinedResults.sustainabilityScore}%`,
                        backgroundColor: combinedResults.sustainabilityScore >= 70 ? '#10B981' : 
                                       combinedResults.sustainabilityScore >= 40 ? '#F59E0B' : '#EF4444'
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => exportChart('sustainability-analysis')}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {t.exportChart}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Recommandations */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recommandations personnalisées
              </CardTitle>
              <CardDescription>
                Actions recommandées pour améliorer votre plan de retraite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {combinedResults.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-mpr-interactive-lt rounded-lg">
                    <Info className="h-5 w-5 text-mpr-interactive mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{recommendation}</span>
                  </div>
                ))}
                
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={refreshData}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t.refreshData}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
