import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Settings,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CombinedPensionData, 
  CombinedCalculationResult, 
  RetirementScenario,
  MonteCarloSimulation 
} from '../types/combined-pension';
import { CPPData } from '../types/cpp';
import { CombinedPensionService } from '../services/CombinedPensionService';
import { CPPService } from '../services/CPPService';
import { useLanguage } from '../hooks/useLanguage';
import { AdvancedVisualizations } from './AdvancedVisualizations';

interface CombinedPensionPlannerProps {
  className?: string;
}

export const CombinedPensionPlanner: React.FC<CombinedPensionPlannerProps> = ({ className }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isMonteCarloRunning, setIsMonteCarloRunning] = useState(false);
  
  // Données combinées
  const [combinedData, setCombinedData] = useState<CombinedPensionData>({
    cpp: CPPService.generateDefaultCPPData(),
    rrq: {
      dateNaissance: new Date(1980, 0, 1),
      dateRetraite: new Date(2045, 0, 1),
      gainsAnnuels: [50000, 52000, 54000, 56000, 58000],
      anneesContribution: 25,
      pensionBase: 12000,
      pensionAjustee: 12000
    },
    personalSavings: {
      montantInitial: 25000,
      contributionMensuelle: 500,
      typeCompte: 'REER',
      tauxRendement: 0.06
    },
    retirementAge: 65,
    lifeExpectancy: 85,
    inflationRate: 0.025,
    investmentReturn: 0.06
  });
  
  // Résultats
  const [combinedResults, setCombinedResults] = useState<CombinedCalculationResult | null>(null);
  const [scenarios, setScenarios] = useState<RetirementScenario[]>([]);
  const [monteCarloResults, setMonteCarloResults] = useState<MonteCarloSimulation | null>(null);
  
  // États pour les onglets
  const [showTaxOptimization, setShowTaxOptimization] = useState(false);
  const [showSurvivorBenefits, setShowSurvivorBenefits] = useState(false);
  
  const texts = {
    fr: {
      title: 'Planificateur de Retraite Combiné',
      subtitle: 'CPP + RRQ + Épargne personnelle',
      overview: 'Vue d\'ensemble',
      scenarios: 'Scénarios',
      monteCarlo: 'Simulation Monte Carlo',
      taxOptimization: 'Optimisation fiscale',
      survivorBenefits: 'Prestations de survivant',
      calculate: 'Calculer',
      calculating: 'Calcul en cours...',
      runMonteCarlo: 'Lancer Monte Carlo',
      stopMonteCarlo: 'Arrêter',
      reset: 'Réinitialiser',
      totalIncome: 'Revenu total mensuel',
      replacementRate: 'Taux de remplacement',
      sustainabilityScore: 'Score de durabilité',
      recommendations: 'Recommandations',
      cppPension: 'Pension CPP',
      rrqPension: 'Pension RRQ',
      personalSavings: 'Épargne personnelle',
      conservative: 'Conservateur',
      moderate: 'Modéré',
      aggressive: 'Agressif',
      successProbability: 'Probabilité de succès',
      riskLevel: 'Niveau de risque',
      low: 'Faible',
      medium: 'Modéré',
      high: 'Élevé',
      exportPDF: 'Exporter PDF',
      noResults: 'Aucun résultat disponible. Lancez un calcul pour commencer.',
      monteCarloRunning: 'Simulation Monte Carlo en cours...',
      monteCarloComplete: 'Simulation terminée',
      iterations: 'Itérations',
      averageIncome: 'Revenu moyen',
      medianIncome: 'Revenu médian',
      standardDeviation: 'Écart-type',
      percentiles: 'Percentiles'
    },
    en: {
      title: 'Combined Retirement Planner',
      subtitle: 'CPP + RRQ + Personal Savings',
      overview: 'Overview',
      scenarios: 'Scenarios',
      monteCarlo: 'Monte Carlo Simulation',
      taxOptimization: 'Tax Optimization',
      survivorBenefits: 'Survivor Benefits',
      calculate: 'Calculate',
      calculating: 'Calculating...',
      runMonteCarlo: 'Run Monte Carlo',
      stopMonteCarlo: 'Stop',
      reset: 'Reset',
      totalIncome: 'Total monthly income',
      replacementRate: 'Replacement rate',
      sustainabilityScore: 'Sustainability score',
      recommendations: 'Recommendations',
      cppPension: 'CPP Pension',
      rrqPension: 'RRQ Pension',
      personalSavings: 'Personal Savings',
      conservative: 'Conservative',
      moderate: 'Moderate',
      aggressive: 'Aggressive',
      successProbability: 'Success probability',
      riskLevel: 'Risk level',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      exportPDF: 'Export PDF',
      noResults: 'No results available. Run a calculation to get started.',
      monteCarloRunning: 'Monte Carlo simulation running...',
      monteCarloComplete: 'Simulation complete',
      iterations: 'Iterations',
      averageIncome: 'Average income',
      medianIncome: 'Median income',
      standardDeviation: 'Standard deviation',
      percentiles: 'Percentiles'
    }
  };
  
  const t = texts[language];
  
  // Calcul principal
  const calculateCombinedPension = async () => {
    setIsCalculating(true);
    try {
      const results = CombinedPensionService.calculateCombinedPension(combinedData);
      setCombinedResults(results);
      
      // Générer les scénarios
      const generatedScenarios = CombinedPensionService.generateRetirementScenarios(combinedData);
      setScenarios(generatedScenarios);
      
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Simulation Monte Carlo
  const runMonteCarloSimulation = async () => {
    setIsMonteCarloRunning(true);
    try {
      const results = CombinedPensionService.runMonteCarloSimulation(combinedData, 1000);
      setMonteCarloResults(results);
    } catch (error) {
      console.error('Erreur lors de la simulation Monte Carlo:', error);
    } finally {
      setIsMonteCarloRunning(false);
    }
  };
  
  // Mise à jour des données
  const updateCombinedData = (field: keyof CombinedPensionData, value: any) => {
    setCombinedData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Mise à jour des données CPP
  const updateCPPData = (field: keyof CPPData, value: any) => {
    setCombinedData(prev => ({
      ...prev,
      cpp: {
        ...prev.cpp,
        [field]: value
      }
    }));
  };
  
  // Mise à jour des données RRQ
  const updateRRQData = (field: string, value: any) => {
    setCombinedData(prev => ({
      ...prev,
      rrq: {
        ...prev.rrq,
        [field]: value
      }
    }));
  };
  
  // Mise à jour des données d'épargne
  const updateSavingsData = (field: string, value: any) => {
    setCombinedData(prev => ({
      ...prev,
      personalSavings: {
        ...prev.personalSavings,
        [field]: value
      }
    }));
  };
  
  // Export PDF
  const exportToPDF = () => {
    // TODO: Implémenter l'export PDF avec les résultats combinés
    console.log('Export PDF des résultats combinés');
  };
  
  // Réinitialisation
  const resetData = () => {
    setCombinedData({
      cpp: CPPService.generateDefaultCPPData(),
      rrq: {
        dateNaissance: new Date(1980, 0, 1),
        dateRetraite: new Date(2045, 0, 1),
        gainsAnnuels: [50000, 52000, 54000, 56000, 58000],
        anneesContribution: 25,
        pensionBase: 12000,
        pensionAjustee: 12000
      },
      personalSavings: {
        montantInitial: 25000,
        contributionMensuelle: 500,
        typeCompte: 'REER',
        tauxRendement: 0.06
      },
      retirementAge: 65,
      lifeExpectancy: 85,
      inflationRate: 0.025,
      investmentReturn: 0.06
    });
    setCombinedResults(null);
    setScenarios([]);
    setMonteCarloResults(null);
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t.subtitle}
        </p>
      </div>
      
      {/* Contrôles principaux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Paramètres de planification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Paramètres de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Âge de retraite</label>
              <input
                type="number"
                value={combinedData.retirementAge}
                onChange={(e) => updateCombinedData('retirementAge', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
                min="55"
                max="75"
                aria-label="Âge de retraite"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Espérance de vie</label>
              <input
                type="number"
                value={combinedData.lifeExpectancy}
                onChange={(e) => updateCombinedData('lifeExpectancy', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
                min="70"
                max="100"
                aria-label="Espérance de vie"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Taux d'inflation (%)</label>
              <input
                type="number"
                value={combinedData.inflationRate * 100}
                onChange={(e) => updateCombinedData('inflationRate', parseFloat(e.target.value) / 100)}
                className="w-full px-3 py-2 border rounded-md"
                step="0.1"
                min="0"
                max="10"
                aria-label="Taux d'inflation en pourcentage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rendement investissement (%)</label>
              <input
                type="number"
                value={combinedData.investmentReturn * 100}
                onChange={(e) => updateCombinedData('investmentReturn', parseFloat(e.target.value) / 100)}
                className="w-full px-3 py-2 border rounded-md"
                step="0.1"
                min="0"
                max="15"
                aria-label="Rendement d'investissement en pourcentage"
              />
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={calculateCombinedPension} 
              disabled={isCalculating}
              className="flex items-center gap-2"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t.calculating}
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4" />
                  {t.calculate}
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={runMonteCarloSimulation}
              disabled={isMonteCarloRunning}
              className="flex items-center gap-2"
            >
              {isMonteCarloRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  {t.stopMonteCarlo}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  {t.runMonteCarlo}
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetData}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {t.reset}
            </Button>
            
            {combinedResults && (
              <Button 
                variant="outline" 
                onClick={exportToPDF}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {t.exportPDF}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Onglets de résultats */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="scenarios">{t.scenarios}</TabsTrigger>
          <TabsTrigger value="monteCarlo">{t.monteCarlo}</TabsTrigger>
          <TabsTrigger value="visualizations">Visualisations</TabsTrigger>
          <TabsTrigger value="taxOptimization">{t.taxOptimization}</TabsTrigger>
          <TabsTrigger value="survivorBenefits">{t.survivorBenefits}</TabsTrigger>
        </TabsList>
        
        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          {combinedResults ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Résumé des revenus */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Résumé des revenus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t.cppPension}:</span>
                      <span className="font-semibold">
                        ${combinedResults.cpp.pensionMensuelle.toFixed(2)}/mois
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.rrqPension}:</span>
                      <span className="font-semibold">
                        ${combinedResults.rrq.pensionMensuelle.toFixed(2)}/mois
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.personalSavings}:</span>
                      <span className="font-semibold">
                        ${combinedResults.personalSavings.revenuMensuel.toFixed(2)}/mois
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t.totalIncome}:</span>
                      <span className="text-green-600">
                        ${combinedResults.totalMonthlyIncome.toFixed(2)}/mois
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t.replacementRate}:</span>
                      <Badge variant={combinedResults.replacementRate >= 70 ? "default" : "destructive"}>
                        {combinedResults.replacementRate.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.sustainabilityScore}:</span>
                      <Badge variant={combinedResults.sustainabilityScore >= 70 ? "default" : "destructive"}>
                        {combinedResults.sustainabilityScore}/100
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recommandations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {t.recommendations}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {combinedResults.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-mpr-interactive mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                {t.noResults}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Scénarios */}
        <TabsContent value="scenarios" className="space-y-4">
          {scenarios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <Card key={scenario.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{scenario.nom}</CardTitle>
                    <CardDescription>{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Revenu mensuel:</span>
                        <span className="font-semibold">
                          ${scenario.resultats.totalMonthlyIncome.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.successProbability}:</span>
                        <Badge variant={scenario.probabiliteReussite >= 0.7 ? "default" : "destructive"}>
                          {(scenario.probabiliteReussite * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.riskLevel}:</span>
                        <Badge 
                          variant={
                            scenario.niveauRisque === 'Faible' ? "default" : 
                            scenario.niveauRisque === 'Modéré' ? "secondary" : "destructive"
                          }
                        >
                          {scenario.niveauRisque}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Lancez un calcul pour voir les scénarios
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
                  {/* Simulation Monte Carlo */}
          <TabsContent value="monteCarlo" className="space-y-4">
            {isMonteCarloRunning ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mpr-interactive mx-auto mb-4"></div>
                  <p className="text-lg font-medium">{t.monteCarloRunning}</p>
                  <p className="text-sm text-gray-500">Veuillez patienter...</p>
                </CardContent>
              </Card>
            ) : monteCarloResults ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Résultats de la simulation Monte Carlo
                    </CardTitle>
                    <CardDescription>
                      {t.monteCarloComplete} - {monteCarloResults.iterations} {t.iterations}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-mpr-interactive">
                          ${monteCarloResults.statistiques.revenuMoyen.toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-500">{t.averageIncome}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ${monteCarloResults.statistiques.revenuMedian.toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-500">{t.medianIncome}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          ${monteCarloResults.statistiques.ecartType.toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-500">{t.standardDeviation}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {(monteCarloResults.statistiques.probabiliteReussite * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-500">Probabilité de succès</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Percentiles */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t.percentiles}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {Object.entries(monteCarloResults.statistiques.percentiles).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-gray-700">
                            ${value.toFixed(0)}
                          </div>
                          <div className="text-sm text-gray-500">{key.toUpperCase()}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  Lancez une simulation Monte Carlo pour voir les résultats
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Visualisations avancées */}
          <TabsContent value="visualizations" className="space-y-4">
            <AdvancedVisualizations 
              combinedResults={combinedResults}
              scenarios={scenarios}
            />
          </TabsContent>
        
        {/* Optimisation fiscale */}
        <TabsContent value="taxOptimization" className="space-y-4">
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              Fonctionnalité d'optimisation fiscale en développement
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Prestations de survivant */}
        <TabsContent value="survivorBenefits" className="space-y-4">
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              Fonctionnalité des prestations de survivant en développement
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
