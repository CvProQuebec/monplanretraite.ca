// src/features/retirement/components/MonteCarloSimulator.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import {
  Dices,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Play,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserData, Calculations } from '../types';
import { MonteCarloService, MonteCarloResult, MonteCarloParameters } from '../services/MonteCarloService';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { useLanguage } from '../hooks/useLanguage';

interface MonteCarloSimulatorProps {
  userData: UserData;
  calculations: Calculations;
}

export const MonteCarloSimulator: React.FC<MonteCarloSimulatorProps> = ({
  userData,
  calculations
}) => {
  const { t } = useLanguage();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<MonteCarloResult | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [parameters, setParameters] = useState<MonteCarloParameters>({
    numberOfSimulations: 1000,
    expectedReturn: 0.06,
    returnVolatility: 0.15,
    inflationMean: 0.02,
    inflationVolatility: 0.01,
    sequenceRisk: true,
    marketCrashProbability: 0.02,
    crashMagnitude: -0.35
  });

  // Simuler la progression
  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simuler la progression (en production, utiliser un Web Worker)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    // Lancer la simulation
    setTimeout(() => {
      const simulationResults = MonteCarloService.runSimulation(
        userData,
        calculations,
        parameters
      );
      setResults(simulationResults);
      setIsRunning(false);
      clearInterval(interval);
    }, 2000);
  };

  // Préparer les données pour les graphiques
  const chartData = useMemo(() => {
    if (!results) return null;
    
    return {
      confidence: results.confidenceIntervals.map(ci => ({
        age: ci.age,
        p5: ci.lower95,
        p25: ci.lower50,
        median: ci.median,
        p75: ci.upper50,
        p95: ci.upper95
      })),
      distribution: Object.entries(results.percentiles).map(([key, value]) => ({
        percentile: key.replace('p', ''),
        capital: value
      }))
    };
  }, [results]);

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Dices className="w-6 h-6 text-purple-600" />
                {t('simulator.monteCarloTitle')}
              </CardTitle>
              <CardDescription>
                {t('simulator.monteCarloSubtitle')}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4 mr-2" />
                {t('simulator.settings')}
              </Button>
              <Button
                onClick={runSimulation}
                disabled={isRunning}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isRunning ? (
                  <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                {t('simulator.simulationInProgress')}
                  </>
                ) : (
                  <>
                                    <Play className="w-4 h-4 mr-2" />
                {t('simulator.runSimulation')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Barre de progression */}
        {isRunning && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{t('simulator.simulating').replace('{count}', parameters.numberOfSimulations.toString())}</span>
                <span>{progress} %</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Paramètres */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('simulator.settings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre de simulations */}
                  <div className="space-y-2">
                    <Label>{t('simulator.numberOfSimulations')}: {parameters.numberOfSimulations}</Label>
                    <Slider
                      value={[parameters.numberOfSimulations]}
                      onValueChange={([value]) => setParameters({
                        ...parameters,
                        numberOfSimulations: value
                      })}
                      min={100}
                      max={10000}
                      step={100}
                    />
                                <p className="text-xs text-gray-500">
              {t('simulator.moreSimulations')}
            </p>
                  </div>
                  
                  {/* Rendement espéré */}
                  <div className="space-y-2">
                    <Label>{t('simulator.expectedReturn')}: {formatPercentage(parameters.expectedReturn * 100)}</Label>
                    <Slider
                      value={[parameters.expectedReturn * 100]}
                      onValueChange={([value]) => setParameters({
                        ...parameters,
                        expectedReturn: value / 100
                      })}
                      min={0}
                      max={12}
                      step={0.5}
                    />
                  </div>
                  
                  {/* Volatilité */}
                  <div className="space-y-2">
                    <Label>{t('simulator.volatility')}: {formatPercentage(parameters.returnVolatility * 100)}</Label>
                    <Slider
                      value={[parameters.returnVolatility * 100]}
                      onValueChange={([value]) => setParameters({
                        ...parameters,
                        returnVolatility: value / 100
                      })}
                      min={5}
                      max={30}
                      step={1}
                    />
                  </div>
                  
                  {/* Inflation */}
                  <div className="space-y-2">
                    <Label>{t('simulator.averageInflation')}: {formatPercentage(parameters.inflationMean * 100)}</Label>
                    <Slider
                      value={[parameters.inflationMean * 100]}
                      onValueChange={([value]) => setParameters({
                        ...parameters,
                        inflationMean: value / 100
                      })}
                      min={0}
                      max={5}
                      step={0.25}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Résultats */}
      {results && (
        <>
          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title={t('simulator.successRate')}
                              value={`${results.successRate.toFixed(1)} %`}
              subtitle={t('simulator.successRateSubtitle')}
              trend={results.successRate >= 90 ? 'success' : results.successRate >= 75 ? 'warning' : 'danger'}
              icon={results.successRate >= 90 ? <CheckCircle /> : <AlertTriangle />}
            />
            
            <MetricCard
              title={t('simulator.medianFinalCapital')}
              value={formatCurrency(results.statistics.median)}
              subtitle={t('simulator.medianSubtitle')}
              icon={<TrendingUp />}
            />
            
            <MetricCard
              title={t('simulator.pessimisticScenario')}
              value={formatCurrency(results.percentiles.p10)}
              subtitle={t('simulator.pessimisticSubtitle')}
              trend="danger"
              icon={<TrendingDown />}
            />
            
            <MetricCard
              title={t('simulator.optimisticScenario')}
              value={formatCurrency(results.percentiles.p90)}
              subtitle={t('simulator.optimisticSubtitle')}
              trend="success"
              icon={<TrendingUp />}
            />
          </div>

          {/* Graphiques détaillés */}
          <Tabs defaultValue="intervals" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="intervals">{t('simulator.confidenceIntervals')}</TabsTrigger>
            <TabsTrigger value="distribution">{t('simulator.resultsDistribution')}</TabsTrigger>
            <TabsTrigger value="trajectories">{t('simulator.simulatedTrajectories')}</TabsTrigger>
          </TabsList>
            
            {/* Intervalles de confiance */}
            <TabsContent value="intervals">
              <Card>
                <CardHeader>
                                <CardTitle>{t('simulator.confidenceIntervals')}</CardTitle>
              <CardDescription>
                {t('simulator.confidenceIntervalsSubtitle')}
              </CardDescription>
                </CardHeader>
                <CardContent>
                  {chartData && (
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={chartData.confidence}>
                        <defs>
                          <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5 %" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95 %" stopColor="#8B5CF6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" label={{ value: 'Âge', position: 'insideBottom', offset: -5 }} />
                        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M$`} />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                          labelFormatter={(label) => `Âge: ${label}`}
                        />
                        <Legend />
                        
                        {/* Zone 90 % */}
                        <Area
                          dataKey="p95"
                          stackId="1"
                          stroke="none"
                          fill="url(#colorConfidence)"
                          name="95e percentile"
                        />
                        <Area
                          dataKey="p5"
                          stackId="2"
                          stroke="none"
                          fill="#fff"
                          name="5e percentile"
                        />
                        
                        {/* Lignes principales */}
                        <Line
                          type="monotone"
                          dataKey="median"
                          stroke="#8B5CF6"
                          strokeWidth={3}
                          name="Médiane"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="p25"
                          stroke="#EC4899"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="25e percentile"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="p75"
                          stroke="#10B981"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="75e percentile"
                          dot={false}
                        />
                        
                        <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Distribution */}
            <TabsContent value="distribution">
              <Card>
                <CardHeader>
                  <CardTitle>Distribution des capitaux finaux</CardTitle>
                  <CardDescription>
                    Répartition des résultats par percentile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DistributionChart results={results} />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Trajectoires */}
            <TabsContent value="trajectories">
              <Card>
                <CardHeader>
                  <CardTitle>Échantillon de trajectoires simulées</CardTitle>
                  <CardDescription>
                    Visualisation de 20 scénarios aléatoires
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TrajectoriesChart simulations={results.simulations.slice(0, 20)} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Alertes et recommandations */}
          {results.successRate < 90 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Attention : Risque élevé</AlertTitle>
              <AlertDescription>
                Votre taux de succès de {results.successRate.toFixed(1)} % est inférieur au seuil recommandé de 90 %.
                Considérez d'augmenter votre épargne ou de réduire vos dépenses prévues.
              </AlertDescription>
            </Alert>
          )}
          
          {results.statistics.averageDepletionAge > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Information importante</AlertTitle>
              <AlertDescription>
                Dans les scénarios d'échec, l'épuisement du capital survient en moyenne à {Math.round(results.statistics.averageDepletionAge)} ans.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

// Composant pour les cartes métriques
const MetricCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  trend?: 'success' | 'warning' | 'danger';
  icon: React.ReactNode;
}> = ({ title, value, subtitle, trend, icon }) => {
  const trendColors = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card className={trend ? trendColors[trend] : ''}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">{title}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
              <p className="text-xs opacity-70 mt-1">{subtitle}</p>
            </div>
            <div className="opacity-60">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Graphique de distribution
const DistributionChart: React.FC<{ results: MonteCarloResult }> = ({ results }) => {
  // Créer un histogramme des résultats
  const createHistogram = () => {
    const capitals = results.simulations.map(s => s.finalCapital);
    const min = Math.min(...capitals);
    const max = Math.max(...capitals);
    const binCount = 20;
    const binSize = (max - min) / binCount;
    
    const bins = Array(binCount).fill(0).map((_, i) => ({
      range: `${formatCurrency(min + i * binSize)} - ${formatCurrency(min + (i + 1) * binSize)}`,
      min: min + i * binSize,
      max: min + (i + 1) * binSize,
      count: 0,
      percentage: 0
    }));
    
    capitals.forEach(capital => {
      const binIndex = Math.min(
        Math.floor((capital - min) / binSize),
        binCount - 1
      );
      bins[binIndex].count++;
    });
    
    bins.forEach(bin => {
      bin.percentage = (bin.count / results.simulations.length) * 100;
    });
    
    return bins;
  };
  
  const histogram = createHistogram();
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={histogram}>
        <defs>
          <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5 %" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95 %" stopColor="#8B5CF6" stopOpacity={0.2}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="range" 
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 10 }}
        />
        <YAxis 
                          tickFormatter={(value) => `${value} %`}
        />
        <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)} %`, 'Fréquence']}
        />
        <Area
          type="monotone"
          dataKey="percentage"
          stroke="#8B5CF6"
          fillOpacity={1}
          fill="url(#colorDist)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Graphique des trajectoires
const TrajectoriesChart: React.FC<{ simulations: any[] }> = ({ simulations }) => {
  // Préparer les données pour afficher plusieurs lignes
  const prepareData = () => {
    if (!simulations || simulations.length === 0) return [];
    
    const maxLength = Math.max(...simulations.map(s => s.trajectory.length));
    const data = [];
    
    for (let i = 0; i < maxLength; i++) {
      const point: any = {
        age: simulations[0].trajectory[i]?.age || 0
      };
      
      simulations.forEach((sim, idx) => {
        if (sim.trajectory[i]) {
          point[`sim${idx}`] = sim.trajectory[i].capital;
        }
      });
      
      data.push(point);
    }
    
    return data;
  };
  
  const data = prepareData();
  const colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="age" />
        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M$`} />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          labelFormatter={(label) => `Âge: ${label}`}
        />
        
        {simulations.map((sim, idx) => (
          <Line
            key={idx}
            type="monotone"
            dataKey={`sim${idx}`}
            stroke={colors[idx % colors.length]}
            strokeWidth={1}
            dot={false}
            opacity={0.6}
            name={`Simulation ${idx + 1}`}
          />
        ))}
        
        <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" />
      </LineChart>
    </ResponsiveContainer>
  );
};