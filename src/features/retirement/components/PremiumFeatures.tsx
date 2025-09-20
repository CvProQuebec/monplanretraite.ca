// Composant principal pour les fonctionnalités premium du module CPP
// Phase 3: Modélisation Monte Carlo, Optimisation fiscale, Planification successorale, API

import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Calculator, Shield,
  Play, Pause, RotateCcw, Info, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { CPPData } from '../types/cpp';
import { AdvancedCPPService } from '../services/AdvancedCPPService';
import { useLanguage } from '../hooks/useLanguage';
import { PlanRestrictedSection } from './PlanRestrictedSection';
import PortfolioOptimizer from '@/components/ui/PortfolioOptimizer';
import StressTestModule from '@/components/ui/StressTestModule';
import PredictiveInsights from '@/components/ui/PredictiveInsights';
import TaxOptimizationLab from '@/components/ui/TaxOptimizationLab';

interface PremiumFeaturesProps {
  cppData: CPPData;
  className?: string;
}

export const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ cppData, className }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('monte-carlo');
  const [isMonteCarloRunning, setIsMonteCarloRunning] = useState(false);
  const [isTaxCalculating, setIsTaxCalculating] = useState(false);
  const [isSurvivorCalculating, setIsSurvivorCalculating] = useState(false);

  // États pour Monte Carlo
  const [monteCarloParams, setMonteCarloParams] = useState({
    iterations: 1000,
    timeHorizon: 30,
    confidenceLevel: 0.95,
    inflationRange: { min: 0.01, max: 0.08, mean: 0.025, stdDev: 0.015 },
    investmentReturnRange: { min: 0.03, max: 0.12, mean: 0.07, stdDev: 0.025 },
    interestRateRange: { min: 0.01, max: 0.08, mean: 0.03, stdDev: 0.015 },
    gdpGrowthRange: { min: 0.01, max: 0.05, mean: 0.025, stdDev: 0.01 },
    unemploymentRateRange: { min: 0.03, max: 0.12, mean: 0.06, stdDev: 0.02 },
    lifeExpectancyRange: { min: 75, max: 95, mean: 85, stdDev: 3 },
    mortalityRateRange: { min: 0.005, max: 0.05, mean: 0.02, stdDev: 0.008 }
  });
  const [monteCarloResults, setMonteCarloResults] = useState<any>(null);

  // États pour l'optimisation fiscale
  const [taxResults, setTaxResults] = useState<any>(null);

  // États pour les prestations de survivant
  const [survivorResults, setSurvivorResults] = useState<any>(null);

  // États pour l'API

  const texts = {
    fr: {
      title: 'Fonctionnalités Premium CPP',
      description: 'Outils avancés pour la planification de retraite',
      tabs: {
        monteCarlo: 'Monte Carlo Avancé',
        taxOptimization: 'Optimisation Fiscale',
        survivorBenefits: 'Prestations Survivant',
        optimizer: 'Optimiseur de portefeuille',
        stressTest: 'Stress-test',
        predictive: 'Analyses prédictives IA',
        taxLab: 'Lab optimisation fiscale'
      },
      monteCarlo: {
        title: 'Modélisation Monte Carlo Avancée',
        description: 'Simulations de marché avec paramètres économiques réalistes',
        parameters: 'Paramètres de simulation',
        iterations: 'Nombre d\'itérations',
        timeHorizon: 'Horizon temporel (années)',
        confidenceLevel: 'Niveau de confiance',
        inflationRange: 'Plage d\'inflation',
        investmentReturnRange: 'Plage de rendement',
        gdpGrowthRange: 'Plage de croissance PIB',
        runSimulation: 'Lancer la simulation',
        stopSimulation: 'Arrêter la simulation',
        resetParameters: 'Réinitialiser',
        results: 'Résultats de simulation',
        summary: 'Résumé',
        scenarios: 'Scénarios',
        riskMetrics: 'Métriques de risque',
        recommendations: 'Recommandations'
      },
      taxOptimization: {
        title: 'Optimisation Fiscale CPP + RRQ',
        description: 'Stratégies pour minimiser l\'impôt sur les prestations',
        calculate: 'Calculer l\'optimisation',
        currentTax: 'Impôt actuel',
        optimizedTax: 'Impôt optimisé',
        strategies: 'Stratégies disponibles',
        savings: 'Économies d\'impôt',
        recommendations: 'Recommandations'
      },
      survivorBenefits: {
        title: 'Planification Successorale',
        description: 'Calcul des prestations de survivant CPP et RRQ',
        calculate: 'Calculer les prestations',
        cppBenefits: 'Prestations CPP',
        rrqBenefits: 'Prestations RRQ',
        combinedBenefits: 'Prestations combinées',
        planning: 'Planification',
        documents: 'Documents requis'
      },
    },
    en: {
      title: 'CPP Premium Features',
      description: 'Advanced retirement planning tools',
      tabs: {
        monteCarlo: 'Advanced Monte Carlo',
        taxOptimization: 'Tax Optimization',
        survivorBenefits: 'Survivor Benefits',
        optimizer: 'Portfolio Optimizer',
        stressTest: 'Stress Test',
        predictive: 'Predictive Analytics (AI)',
        taxLab: 'Tax Optimization Lab'
      },
      monteCarlo: {
        title: 'Advanced Monte Carlo Modeling',
        description: 'Market simulations with realistic economic parameters',
        parameters: 'Simulation parameters',
        iterations: 'Number of iterations',
        timeHorizon: 'Time horizon (years)',
        confidenceLevel: 'Confidence level',
        inflationRange: 'Inflation range',
        investmentReturnRange: 'Investment return range',
        gdpGrowthRange: 'GDP growth range',
        runSimulation: 'Run simulation',
        stopSimulation: 'Stop simulation',
        resetParameters: 'Reset',
        results: 'Simulation results',
        summary: 'Summary',
        scenarios: 'Scenarios',
        riskMetrics: 'Risk metrics',
        recommendations: 'Recommendations'
      },
      taxOptimization: {
        title: 'CPP + RRQ Tax Optimization',
        description: 'Strategies to minimize tax on benefits',
        calculate: 'Calculate optimization',
        currentTax: 'Current tax',
        optimizedTax: 'Optimized tax',
        strategies: 'Available strategies',
        savings: 'Tax savings',
        recommendations: 'Recommendations'
      },
      survivorBenefits: {
        title: 'Survivor Planning',
        description: 'Calculation of CPP and RRQ survivor benefits',
        calculate: 'Calculate benefits',
        cppBenefits: 'CPP Benefits',
        rrqBenefits: 'RRQ Benefits',
        combinedBenefits: 'Combined benefits',
        planning: 'Planning',
        documents: 'Required documents'
      },
    }
  };

  const t = texts[language];

  // === MONTE CARLO AVANCÉ ===
  const runAdvancedMonteCarlo = async () => {
    setIsMonteCarloRunning(true);
    try {
      const results = await AdvancedCPPService.runAdvancedMonteCarlo(cppData, monteCarloParams);
      setMonteCarloResults(results);
    } catch (error) {
      console.error('Erreur Monte Carlo:', error);
    } finally {
      setIsMonteCarloRunning(false);
    }
  };

  const stopMonteCarlo = () => {
    setIsMonteCarloRunning(false);
  };

  const resetMonteCarloParams = () => {
    setMonteCarloParams({
      iterations: 1000,
      timeHorizon: 30,
      confidenceLevel: 0.95,
      inflationRange: { min: 0.01, max: 0.08, mean: 0.025, stdDev: 0.015 },
      investmentReturnRange: { min: 0.03, max: 0.12, mean: 0.07, stdDev: 0.025 },
      interestRateRange: { min: 0.01, max: 0.08, mean: 0.03, stdDev: 0.015 },
      gdpGrowthRange: { min: 0.01, max: 0.05, mean: 0.025, stdDev: 0.01 },
      unemploymentRateRange: { min: 0.03, max: 0.12, mean: 0.06, stdDev: 0.02 },
      lifeExpectancyRange: { min: 75, max: 95, mean: 85, stdDev: 3 },
      mortalityRateRange: { min: 0.005, max: 0.05, mean: 0.02, stdDev: 0.008 }
    });
    setMonteCarloResults(null);
  };

  // === OPTIMISATION FISCALE ===
  const calculateTaxOptimization = async () => {
    setIsTaxCalculating(true);
    try {
      const results = AdvancedCPPService.calculateTaxOptimization(cppData);
      setTaxResults(results);
    } catch (error) {
      console.error('Erreur optimisation fiscale:', error);
    } finally {
      setIsTaxCalculating(false);
    }
  };

  // === PRESTATIONS DE SURVIVANT ===
  const calculateSurvivorBenefits = async () => {
    setIsSurvivorCalculating(true);
    try {
      const results = AdvancedCPPService.calculateSurvivorBenefits(cppData);
      setSurvivorResults(results);
    } catch (error) {
      console.error('Erreur prestations survivant:', error);
    } finally {
      setIsSurvivorCalculating(false);
    }
  };


  return (
    <PlanRestrictedSection sectionId="premium-features" requiredPlan="expert">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            {t.description}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="monte-carlo" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t.tabs.monteCarlo}
            </TabsTrigger>
            <TabsTrigger value="tax-optimization" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              {t.tabs.taxOptimization}
            </TabsTrigger>
            <TabsTrigger value="survivor-benefits" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {t.tabs.survivorBenefits}
            </TabsTrigger>
            <TabsTrigger value="optimizer" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t.tabs.optimizer}
            </TabsTrigger>
            <TabsTrigger value="stress-test" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t.tabs.stressTest}
            </TabsTrigger>
            <TabsTrigger value="predictive" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t.tabs.predictive}
            </TabsTrigger>
            <TabsTrigger value="tax-lab" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              {t.tabs.taxLab}
            </TabsTrigger>
          </TabsList>

          {/* === MONTE CARLO AVANCÉ === */}
          <TabsContent value="monte-carlo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {t.monteCarlo.title}
                </CardTitle>
                <CardDescription>
                  {t.monteCarlo.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Paramètres */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t.monteCarlo.parameters}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="iterations">{t.monteCarlo.iterations}</Label>
                      <Input
                        id="iterations"
                        type="number"
                        value={monteCarloParams.iterations}
                        onChange={(e) => setMonteCarloParams(prev => ({
                          ...prev,
                          iterations: parseInt(e.target.value) || 1000
                        }))}
                        min="100"
                        max="10000"
                        step="100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeHorizon">{t.monteCarlo.timeHorizon}</Label>
                      <Input
                        id="timeHorizon"
                        type="number"
                        value={monteCarloParams.timeHorizon}
                        onChange={(e) => setMonteCarloParams(prev => ({
                          ...prev,
                          timeHorizon: parseInt(e.target.value) || 30
                        }))}
                        min="10"
                        max="50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confidenceLevel">{t.monteCarlo.confidenceLevel}</Label>
                      <Select
                        value={monteCarloParams.confidenceLevel.toString()}
                        onValueChange={(value) => setMonteCarloParams(prev => ({
                          ...prev,
                          confidenceLevel: parseFloat(value)
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.90">90{' %'}</SelectItem>
                          <SelectItem value="0.95">95{' %'}</SelectItem>
                          <SelectItem value="0.99">99{' %'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-3">
                    <Button
                      onClick={runAdvancedMonteCarlo}
                      disabled={isMonteCarloRunning}
                      className="flex items-center gap-2"
                    >
                      {isMonteCarloRunning ? (
                        <>
                          <Pause className="w-4 h-4" />
                          {t.monteCarlo.stopSimulation}
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          {t.monteCarlo.runSimulation}
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={resetMonteCarloParams}
                      disabled={isMonteCarloRunning}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      {t.monteCarlo.resetParameters}
                    </Button>
                  </div>
                </div>

                {/* Résultats */}
                {monteCarloResults && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">{t.monteCarlo.results}</h3>
                    
                    {/* Résumé */}
                    <Card>
                      <CardHeader>
                        <CardTitle>{t.monteCarlo.summary}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {monteCarloResults.summary.successRate.toFixed(1)}{' %'}
                            </div>
                            <div className="text-sm text-gray-600">Taux de succès</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              ${monteCarloResults.summary.averageIncome.toFixed(0)}
                            </div>
                            <div className="text-sm text-gray-600">Revenu moyen</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              ${monteCarloResults.summary.medianIncome.toFixed(0)}
                            </div>
                            <div className="text-sm text-gray-600">Revenu médian</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                              {monteCarloResults.summary.volatility.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Volatilité</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Métriques de risque */}
                    <Card>
                      <CardHeader>
                        <CardTitle>{t.monteCarlo.riskMetrics}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-gray-600">VaR 95 %</div>
                            <div className="text-lg font-semibold">
                              ${monteCarloResults.riskMetrics.valueAtRisk.p95.toFixed(0)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Sharpe Ratio</div>
                            <div className="text-lg font-semibold">
                              {monteCarloResults.riskMetrics.sharpeRatio.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Max Drawdown</div>
                            <div className="text-lg font-semibold">
                              {(monteCarloResults.riskMetrics.maximumDrawdown * 100).toFixed(1)}{' %'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommandations */}
                    {monteCarloResults.recommendations.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>{t.monteCarlo.recommendations}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {monteCarloResults.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* === OPTIMISATION FISCALE === */}
          <TabsContent value="tax-optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  {t.taxOptimization.title}
                </CardTitle>
                <CardDescription>
                  {t.taxOptimization.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button
                  onClick={calculateTaxOptimization}
                  disabled={isTaxCalculating}
                  className="flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  {isTaxCalculating ? 'Calcul en cours...' : t.taxOptimization.calculate}
                </Button>

                {taxResults && (
                  <div className="space-y-6">
                    {/* Comparaison des taxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>{t.taxOptimization.currentTax}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Impôt total:</span>
                              <span className="font-semibold text-red-600">
                                ${taxResults.currentTax.totalTax.toFixed(0)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Taux effectif:</span>
                              <span className="font-semibold">
                                {(taxResults.currentTax.effectiveTaxRate * 100).toFixed(1)}{' %'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>{t.taxOptimization.optimizedTax}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Impôt total:</span>
                              <span className="font-semibold text-green-600">
                                ${taxResults.optimizedTax.totalTax.toFixed(0)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Taux effectif:</span>
                              <span className="font-semibold">
                                {(taxResults.optimizedTax.effectiveTaxRate * 100).toFixed(1)}{' %'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Économies */}
                    <Card>
                      <CardHeader>
                        <CardTitle>{t.taxOptimization.savings}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">
                            ${taxResults.savings.annual.toFixed(0)}
                          </div>
                          <div className="text-lg text-gray-600">
                            Économies annuelles
                          </div>
                          <div className="text-sm text-gray-500 mt-2">
                            {taxResults.savings.percentage.toFixed(1)}{' %'} de réduction
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommandations */}
                    <Card>
                      <CardHeader>
                        <CardTitle>{t.taxOptimization.recommendations}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {taxResults.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                              <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                                {rec.priority === 'high' ? 'Élevé' : 'Moyen'}
                              </Badge>
                              <div>
                                <div className="font-semibold">{rec.strategy.name}</div>
                                <div className="text-sm text-gray-600">{rec.reason}</div>
                                <div className="text-sm text-gray-500 mt-1">
                                  Timeline: {rec.timeline}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* === PRESTATIONS DE SURVIVANT === */}
          <TabsContent value="survivor-benefits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t.survivorBenefits.title}
                </CardTitle>
                <CardDescription>
                  {t.survivorBenefits.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button
                  onClick={calculateSurvivorBenefits}
                  disabled={isSurvivorCalculating}
                  className="flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  {isSurvivorCalculating ? 'Calcul en cours...' : t.survivorBenefits.calculate}
                </Button>

                {survivorResults && (
                  <div className="space-y-6">
                    {/* Prestations combinées */}
                    <Card>
                      <CardHeader>
                        <CardTitle>{t.survivorBenefits.combinedBenefits}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              ${survivorResults.combined.totalDeathBenefit.toFixed(0)}
                            </div>
                            <div className="text-sm text-gray-600">Prestation de décès</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              ${survivorResults.combined.totalSurvivorPension.toFixed(0)}
                            </div>
                            <div className="text-sm text-gray-600">Pension de survivant</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              ${survivorResults.combined.totalChildrenBenefit.toFixed(0)}
                            </div>
                            <div className="text-sm text-gray-600">Prestation enfants</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Planification */}
                    <Card>
                      <CardHeader>
                        <CardTitle>{t.survivorBenefits.planning}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-gray-600">Prestations estimées</div>
                            <div className="text-2xl font-bold text-green-600">
                              ${survivorResults.planning.estimatedBenefits.toFixed(0)}/an
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Timeline</div>
                            <div className="text-lg font-semibold">
                              {survivorResults.planning.timeline}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Prochaines étapes</div>
                            <ul className="mt-2 space-y-1">
                              {survivorResults.planning.nextSteps.map((step, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* === OPTIMISEUR DE PORTEFEUILLE === */}
          <TabsContent value="optimizer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {language === 'fr' ? 'Optimiseur de portefeuille (60–75 % actions)' : 'Portfolio Optimizer (60–75% equities)'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr'
                    ? 'Aligné avec notre guide: 60–75 % d’actions, coussin de 12–24 mois, rééquilibrage ±5 % et diversification géographique.'
                    : 'Aligned with our guide: 60–75% equities, 12–24 months cash cushion, ±5% rebalancing and geographic diversification.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PortfolioOptimizer />
              </CardContent>
            </Card>
          </TabsContent>

          {/* === STRESS-TEST === */}
          <TabsContent value="stress-test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {language === 'fr' ? 'Stress-test (séquence, inflation, longévité)' : 'Stress Test (sequence, inflation, longevity)'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr'
                    ? 'Test dédié: -30 %/-15 % en années 1–2, pic d’inflation et longévité +5 ans. Conseils alignés avec notre article.'
                    : 'Dedicated test: -30%/-15% in years 1–2, inflation spike and +5 years longevity. Guidance aligned with our article.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StressTestModule />
              </CardContent>
            </Card>
          </TabsContent>

          {/* === ANALYSES PREDICTIVES IA === */}
          <TabsContent value="predictive" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {language === 'fr' ? 'Analyses prédictives (IA locale)' : 'Predictive Analytics (local AI)'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr'
                    ? 'Score de succès, risques clés et prévision 12 mois — basé sur taux d’épargne, coussin, allocation et volatilité.'
                    : 'Success score, key risks and 12-month forecast — based on savings rate, cushion, allocation and volatility.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PredictiveInsights />
              </CardContent>
            </Card>
          </TabsContent>

          {/* === LAB OPTIMISATION FISCALE (v1) === */}
          <TabsContent value="tax-lab" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  {language === 'fr' ? 'Laboratoire d’optimisation fiscale (v1)' : 'Tax Optimization Lab (v1)'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr'
                    ? 'Comparez l’optimiseur Greedy (Non-enregistré → REER → CELI, CPP/SV configurables) au plan de référence “REER seulement”. Heatmaps MTR / Récup. SV / SRG et tableau multi‑années.'
                    : 'Compare the Greedy optimizer (Non-registered → RRSP → TFSA, configurable CPP/OAS) to a “RRSP only” baseline. MTR / OAS clawback / GIS heatmaps and multi‑year table.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaxOptimizationLab />
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </PlanRestrictedSection>
  );
};
