// src/features/retirement/sections/MonteCarloSection.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface MonteCarloSectionProps {
  data?: any;
  onUpdate?: (section: string, updates: any) => void;
}

interface MonteCarloParams {
  iterations: number;
  timeHorizon: number;
  confidenceLevel: number;
}

interface MonteCarloResults {
  summary: {
    successRate: number;
    averageIncome: number;
    medianIncome: number;
    volatility: number;
  };
  riskMetrics: {
    valueAtRisk: {
      p90: number;
      p95: number;
      p99: number;
    };
    sharpeRatio: number;
    maxDrawdown: number;
  };
  scenarios: Array<{
    year: number;
    income: number;
    probability: number;
  }>;
}

export const MonteCarloSection: React.FC<MonteCarloSectionProps> = ({ data, onUpdate }) => {
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  // États pour Monte Carlo
  const [monteCarloParams, setMonteCarloParams] = useState<MonteCarloParams>({
    iterations: 1000,
    timeHorizon: 30,
    confidenceLevel: 0.95
  });

  const [isMonteCarloRunning, setIsMonteCarloRunning] = useState(false);
  const [monteCarloResults, setMonteCarloResults] = useState<MonteCarloResults | null>(null);

  // Traductions
  const t = {
    title: isFrench ? 'Modélisation Monte Carlo Avancée' : 'Advanced Monte Carlo Modeling',
    description: isFrench 
      ? 'Simulez des milliers de scénarios pour évaluer les risques et optimiser votre plan de retraite'
      : 'Simulate thousands of scenarios to assess risks and optimize your retirement plan',
    parameters: isFrench ? 'Paramètres de simulation' : 'Simulation Parameters',
    iterations: isFrench ? 'Nombre d\'itérations' : 'Number of Iterations',
    timeHorizon: isFrench ? 'Horizon temporel (années)' : 'Time Horizon (years)',
    confidenceLevel: isFrench ? 'Niveau de confiance' : 'Confidence Level',
    runSimulation: isFrench ? 'Lancer la simulation' : 'Run Simulation',
    stopSimulation: isFrench ? 'Arrêter la simulation' : 'Stop Simulation',
    resetParameters: isFrench ? 'Réinitialiser les paramètres' : 'Reset Parameters',
    results: isFrench ? 'Résultats de la simulation' : 'Simulation Results',
    summary: isFrench ? 'Résumé' : 'Summary',
    successRate: isFrench ? 'Taux de succès' : 'Success Rate',
    averageIncome: isFrench ? 'Revenu moyen' : 'Average Income',
    medianIncome: isFrench ? 'Revenu médian' : 'Median Income',
    volatility: isFrench ? 'Volatilité' : 'Volatility',
    riskMetrics: isFrench ? 'Métriques de risque' : 'Risk Metrics',
    valueAtRisk: isFrench ? 'Value at Risk' : 'Value at Risk',
    sharpeRatio: isFrench ? 'Ratio de Sharpe' : 'Sharpe Ratio',
    maxDrawdown: isFrench ? 'Perte maximale' : 'Maximum Drawdown',
    scenarios: isFrench ? 'Scénarios' : 'Scenarios',
    year: isFrench ? 'Année' : 'Year',
    income: isFrench ? 'Revenu' : 'Income',
    probability: isFrench ? 'Probabilité' : 'Probability'
  };

  // Fonction pour lancer la simulation Monte Carlo
  const runAdvancedMonteCarlo = async () => {
    if (isMonteCarloRunning) {
      setIsMonteCarloRunning(false);
      return;
    }

    setIsMonteCarloRunning(true);
    
    try {
      // Simulation des résultats (remplacez par votre logique réelle)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResults: MonteCarloResults = {
        summary: {
          successRate: 87.5,
          averageIncome: 45000,
          medianIncome: 47000,
          volatility: 0.23
        },
        riskMetrics: {
          valueAtRisk: {
            p90: 38000,
            p95: 35000,
            p99: 30000
          },
          sharpeRatio: 1.45,
          maxDrawdown: 0.18
        },
        scenarios: Array.from({ length: 30 }, (_, i) => ({
          year: i + 1,
          income: 45000 + Math.random() * 20000,
          probability: 0.95 - (i * 0.01)
        }))
      };
      
      setMonteCarloResults(mockResults);
    } catch (error) {
      console.error('Erreur Monte Carlo:', error);
    } finally {
      setIsMonteCarloRunning(false);
    }
  };

  // Réinitialiser les paramètres
  const resetMonteCarloParams = () => {
    setMonteCarloParams({
      iterations: 1000,
      timeHorizon: 30,
      confidenceLevel: 0.95
    });
    setMonteCarloResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Paramètres de simulation */}
        <Card className="bg-white/10 backdrop-blur-sm border-purple-300/30 mb-8">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Target className="w-5 h-5" />
              {t.parameters}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="iterations" className="text-purple-200">{t.iterations}</Label>
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
                  className="bg-white/20 border-purple-300/30 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeHorizon" className="text-purple-200">{t.timeHorizon}</Label>
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
                  className="bg-white/20 border-purple-300/30 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confidenceLevel" className="text-purple-200">{t.confidenceLevel}</Label>
                <Select
                  value={monteCarloParams.confidenceLevel.toString()}
                  onValueChange={(value) => setMonteCarloParams(prev => ({
                    ...prev,
                    confidenceLevel: parseFloat(value)
                  }))}
                >
                  <SelectTrigger className="bg-white/20 border-purple-300/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="0.90">90%</SelectItem>
                    <SelectItem value="0.95">95%</SelectItem>
                    <SelectItem value="0.99">99%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3">
              <Button
                onClick={runAdvancedMonteCarlo}
                disabled={isMonteCarloRunning}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isMonteCarloRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    {t.stopSimulation}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    {t.runSimulation}
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={resetMonteCarloParams}
                disabled={isMonteCarloRunning}
                className="flex items-center gap-2 border-purple-300/30 text-purple-200 hover:bg-purple-500/20"
              >
                <RotateCcw className="w-4 h-4" />
                {t.resetParameters}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        {monteCarloResults && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-purple-300 text-center">{t.results}</h3>
            
            {/* Résumé */}
            <Card className="bg-white/10 backdrop-blur-sm border-purple-300/30">
              <CardHeader>
                <CardTitle className="text-purple-400">{t.summary}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {monteCarloResults.summary.successRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-blue-200">{t.successRate}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      ${monteCarloResults.summary.averageIncome.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-200">{t.averageIncome}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">
                      ${monteCarloResults.summary.medianIncome.toLocaleString()}
                    </div>
                    <div className="text-sm text-orange-200">{t.medianIncome}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {monteCarloResults.summary.volatility.toFixed(2)}
                    </div>
                    <div className="text-sm text-red-200">{t.volatility}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métriques de risque */}
            <Card className="bg-white/10 backdrop-blur-sm border-purple-300/30">
              <CardHeader>
                <CardTitle className="text-purple-400">{t.riskMetrics}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-purple-200">VaR 95%</div>
                    <div className="text-lg font-semibold text-purple-300">
                      ${monteCarloResults.riskMetrics.valueAtRisk.p95.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-purple-200">{t.sharpeRatio}</div>
                    <div className="text-lg font-semibold text-purple-300">
                      {monteCarloResults.riskMetrics.sharpeRatio.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-purple-200">{t.maxDrawdown}</div>
                    <div className="text-lg font-semibold text-purple-300">
                      {(monteCarloResults.riskMetrics.maxDrawdown * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scénarios */}
            <Card className="bg-white/10 backdrop-blur-sm border-purple-300/30">
              <CardHeader>
                <CardTitle className="text-purple-400">{t.scenarios}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {monteCarloResults.scenarios.slice(0, 15).map((scenario, index) => (
                    <div key={index} className="p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-200">
                          {t.year} {scenario.year}
                        </div>
                        <div className="text-2xl font-bold text-purple-300">
                          ${scenario.income.toLocaleString()}
                        </div>
                        <div className="text-sm text-purple-400">
                          {(scenario.probability * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Message d'information si pas de résultats */}
        {!monteCarloResults && !isMonteCarloRunning && (
          <Card className="bg-white/10 backdrop-blur-sm border-blue-300/30">
            <CardContent className="p-8 text-center">
              <Info className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-300 mb-2">
                {isFrench ? 'Prêt pour la simulation' : 'Ready for Simulation'}
              </h3>
              <p className="text-blue-200">
                {isFrench 
                  ? 'Configurez vos paramètres et lancez une simulation Monte Carlo pour analyser les risques de votre plan de retraite.'
                  : 'Configure your parameters and run a Monte Carlo simulation to analyze the risks of your retirement plan.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
