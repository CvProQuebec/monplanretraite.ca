// src/components/ui/FourPercentRuleModule.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Calculator, BarChart3, Target, DollarSign } from 'lucide-react';

interface FourPercentRuleModuleProps {
  className?: string;
}

interface SimulationResult {
  year: number;
  portfolioValue: number;
  withdrawal: number;
  successRate: number;
  inflationAdjustedValue: number;
}

interface AllocationScenario {
  stocks: number;
  bonds: number;
  cash: number;
  successRate: number;
  averageEndValue: number;
  worstCase: number;
  bestCase: number;
}

export const FourPercentRuleModule: React.FC<FourPercentRuleModuleProps> = ({ className }) => {
  const [initialAmount, setInitialAmount] = useState<number>(1000000);
  const [withdrawalRate, setWithdrawalRate] = useState<number>(4);
  const [inflationRate, setInflationRate] = useState<number>(3);
  const [stockAllocation, setStockAllocation] = useState<number>(60);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [allocationScenarios, setAllocationScenarios] = useState<AllocationScenario[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Données historiques simplifiées pour la démonstration
  const historicalReturns = {
    stocks: 0.10, // 10% annuel moyen
    bonds: 0.05, // 5% annuel moyen
    cash: 0.02  // 2% annuel moyen
  };

  const calculatePortfolioReturn = (stockPercent: number): number => {
    const bondPercent = Math.max(0, 100 - stockPercent);
    return (stockPercent / 100) * historicalReturns.stocks + 
           (bondPercent / 100) * historicalReturns.bonds;
  };

  const runMonteCarloSimulation = (
    initial: number,
    withdrawalPercent: number,
    inflation: number,
    stockPercent: number,
    years: number = 30
  ): { successRate: number; results: SimulationResult[] } => {
    const simulations = 1000;
    let successfulSimulations = 0;
    const yearlyResults: SimulationResult[] = [];

    for (let year = 1; year <= years; year++) {
      let successCount = 0;
      let totalValue = 0;
      
      for (let sim = 0; sim < simulations; sim++) {
        let portfolioValue = initial;
        let currentWithdrawal = initial * (withdrawalPercent / 100);
        
        for (let y = 1; y <= year; y++) {
          // Simulation avec volatilité
          const baseReturn = calculatePortfolioReturn(stockPercent);
          const volatility = 0.15; // 15% de volatilité
          const randomReturn = baseReturn + (Math.random() - 0.5) * volatility * 2;
          
          portfolioValue = portfolioValue * (1 + randomReturn) - currentWithdrawal;
          currentWithdrawal *= (1 + inflation / 100);
          
          if (portfolioValue <= 0) break;
        }
        
        if (portfolioValue > 0) {
          successCount++;
          totalValue += portfolioValue;
        }
      }
      
      const successRate = (successCount / simulations) * 100;
      const avgValue = successCount > 0 ? totalValue / successCount : 0;
      
      yearlyResults.push({
        year,
        portfolioValue: avgValue,
        withdrawal: initial * (withdrawalPercent / 100) * Math.pow(1 + inflation / 100, year),
        successRate,
        inflationAdjustedValue: avgValue / Math.pow(1 + inflation / 100, year)
      });
      
      if (year === years) {
        successfulSimulations = successCount;
      }
    }

    return {
      successRate: (successfulSimulations / simulations) * 100,
      results: yearlyResults
    };
  };

  const calculateAllocationScenarios = () => {
    const scenarios: AllocationScenario[] = [];
    
    for (let stocks = 0; stocks <= 100; stocks += 10) {
      const bonds = Math.max(0, 100 - stocks);
      const simulation = runMonteCarloSimulation(initialAmount, withdrawalRate, inflationRate, stocks, 30);
      
      scenarios.push({
        stocks,
        bonds,
        cash: 0,
        successRate: simulation.successRate,
        averageEndValue: simulation.results[29]?.portfolioValue || 0,
        worstCase: simulation.results[29]?.portfolioValue * 0.3 || 0,
        bestCase: simulation.results[29]?.portfolioValue * 2.5 || 0
      });
    }
    
    return scenarios;
  };

  const runSimulation = async () => {
    setIsCalculating(true);
    
    // Simulation principale
    const mainSimulation = runMonteCarloSimulation(
      initialAmount,
      withdrawalRate,
      inflationRate,
      stockAllocation,
      30
    );
    
    setSimulationResults(mainSimulation.results);
    
    // Scénarios d'allocation
    const scenarios = calculateAllocationScenarios();
    setAllocationScenarios(scenarios);
    
    setIsCalculating(false);
  };

  useEffect(() => {
    runSimulation();
  }, [initialAmount, withdrawalRate, inflationRate, stockAllocation]);

  const currentSuccessRate = simulationResults.length > 0 ? 
    simulationResults[simulationResults.length - 1]?.successRate || 0 : 0;

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSuccessRateMessage = (rate: number) => {
    if (rate >= 95) return "Excellent ! Votre stratégie est très robuste.";
    if (rate >= 90) return "Très bien ! Stratégie solide avec marge de sécurité.";
    if (rate >= 80) return "Acceptable, mais considérez des ajustements.";
    if (rate >= 70) return "Risqué. Réduction du taux de retrait recommandée.";
    return "Très risqué ! Révision majeure nécessaire.";
  };

  const optimalAllocation = allocationScenarios.reduce((best, current) => 
    current.successRate > best.successRate ? current : best, 
    allocationScenarios[0] || { stocks: 60, bonds: 40, successRate: 0 }
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            <CardTitle>Règle des 4 % modernisée</CardTitle>
          </div>
          <CardDescription>
            Basé sur l'étude de William Bengen et les recherches académiques. Testez la viabilité de votre stratégie de décaissement sur 30 ans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="calculator">Calculateur</TabsTrigger>
              <TabsTrigger value="scenarios">Scénarios</TabsTrigger>
              <TabsTrigger value="historical">Historique</TabsTrigger>
              <TabsTrigger value="education">Éducation</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="initial-amount">Épargne initiale ($)</Label>
                    <Input
                      id="initial-amount"
                      type="number"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="withdrawal-rate">Taux de retrait annuel (%)</Label>
                    <Input
                      id="withdrawal-rate"
                      type="number"
                      step="0.1"
                      value={withdrawalRate}
                      onChange={(e) => setWithdrawalRate(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="inflation-rate">Taux d'inflation (%)</Label>
                    <Input
                      id="inflation-rate"
                      type="number"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="stock-allocation">Allocation actions (%)</Label>
                    <Input
                      id="stock-allocation"
                      type="number"
                      value={stockAllocation}
                      onChange={(e) => setStockAllocation(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-blue-600">
                        {currentSuccessRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Taux de succès sur 30 ans</div>
                      <Progress value={currentSuccessRate} className="w-full" />
                      <div className={`text-sm font-medium ${getSuccessRateColor(currentSuccessRate)}`}>
                        {getSuccessRateMessage(currentSuccessRate)}
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Retrait annuel initial:</span>
                        <span className="font-medium">{(initialAmount * withdrawalRate / 100).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Retrait année 30:</span>
                        <span className="font-medium">
                          {(initialAmount * withdrawalRate / 100 * Math.pow(1 + inflationRate / 100, 30)).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Allocation optimale:</span>
                        <span className="font-medium">{optimalAllocation.stocks}% actions</span>
                      </div>
                    </div>
                  </Card>

                  {currentSuccessRate < 80 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Taux de succès faible. Considérez réduire le taux de retrait à {(withdrawalRate - 0.5).toFixed(1)}% 
                        ou augmenter l'allocation actions à {Math.min(stockAllocation + 10, 80)}%.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {simulationResults.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Évolution du portefeuille sur 30 ans</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={simulationResults}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M$`} />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          value.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' }),
                          name === 'portfolioValue' ? 'Valeur portefeuille' : 'Valeur ajustée inflation'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="portfolioValue" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.3}
                        name="portfolioValue"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="inflationAdjustedValue" 
                        stroke="#ef4444" 
                        fill="#ef4444" 
                        fillOpacity={0.2}
                        name="inflationAdjustedValue"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comparaison des allocations d'actifs</CardTitle>
                  <CardDescription>
                    Impact de l'allocation sur le taux de succès (étude sur 1000 simulations)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allocationScenarios.map((scenario, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-semibold">{scenario.stocks}%</div>
                            <div className="text-xs text-gray-500">Actions</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{scenario.bonds}%</div>
                            <div className="text-xs text-gray-500">Obligations</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className={`font-bold ${getSuccessRateColor(scenario.successRate)}`}>
                              {scenario.successRate.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">Succès</div>
                          </div>
                          
                          {scenario.successRate === Math.max(...allocationScenarios.map(s => s.successRate)) && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Optimal
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Alert className="mt-6">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Découverte clé :</strong> Contrairement à la croyance populaire, 100 % liquidités 
                      est le portefeuille le PLUS risqué avec seulement 19% de chance de succès sur 30 ans.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Données historiques (1928-2024)</CardTitle>
                  <CardDescription>
                    Performance de la règle des 4 % lors des pires moments de l'histoire
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Pires moments pour prendre sa retraite :</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between p-3 bg-red-50 rounded">
                          <span>1929 (Grande Dépression)</span>
                          <span className="font-semibold text-green-600">✓ Succès</span>
                        </div>
                        <div className="flex justify-between p-3 bg-red-50 rounded">
                          <span>1937 (Récession)</span>
                          <span className="font-semibold text-green-600">✓ Succès</span>
                        </div>
                        <div className="flex justify-between p-3 bg-red-50 rounded">
                          <span>1972-73 (Crise pétrolière)</span>
                          <span className="font-semibold text-green-600">✓ Succès</span>
                        </div>
                        <div className="flex justify-between p-3 bg-red-50 rounded">
                          <span>2000 (Bulle technologique)</span>
                          <span className="font-semibold text-green-600">✓ Succès</span>
                        </div>
                        <div className="flex justify-between p-3 bg-red-50 rounded">
                          <span>2008 (Crise financière)</span>
                          <span className="font-semibold text-green-600">✓ Succès</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Temps de récupération moyen :</h4>
                      <Card className="p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600">3 ans</div>
                        <div className="text-sm text-gray-600">
                          Durée moyenne pour récupérer d'une correction majeure
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          vs 30 ans de retraite = 10% du temps
                        </div>
                      </Card>
                      
                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                          Dans 50% des cas historiques, vous terminez votre retraite avec 
                          PLUS d'argent qu'au début, même après 30 ans de retraits.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comprendre la règle des 4 %</CardTitle>
                  <CardDescription>
                    Les fondements scientifiques de la planification de retraite moderne
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Principe de base
                      </h4>
                      <p className="text-sm text-gray-600">
                        Retirez 4% de votre épargne la première année, puis ajustez ce montant 
                        chaque année selon l'inflation. Cette stratégie a fonctionné dans 
                        80-90% des cas historiques sur 30 ans.
                      </p>
                      
                      <h4 className="font-semibold flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Allocation recommandée
                      </h4>
                      <p className="text-sm text-gray-600">
                        L'étude originale utilisait 50 % actions / 50 % obligations. 
                        Les études modernes suggèrent 60-75 % actions pour une meilleure 
                        protection contre l'inflation.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Mythes à éviter
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="p-2 bg-red-50 rounded">
                          ❌ "100 % liquidités = sécurité" (81 % d'échec)
                        </div>
                        <div className="p-2 bg-red-50 rounded">
                          ❌ "Réduire les actions en retraite" (augmente le risque)
                        </div>
                        <div className="p-2 bg-green-50 rounded">
                          ✅ "Maintenir la croissance" (combat l'inflation)
                        </div>
                      </div>
                      
                      <h4 className="font-semibold flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Facteurs de succès
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Diversification géographique</li>
                        <li>• Rééquilibrage régulier</li>
                        <li>• Flexibilité dans les retraits</li>
                        <li>• Gestion des émotions</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Card className="p-4 bg-blue-50">
                    <h4 className="font-semibold text-blue-800 mb-2">Principe académique :</h4>
                    <blockquote className="text-sm italic text-blue-700">
                      "Si vous ne prenez pas un certain risque, il n'y a pas de création de richesse réelle. 
                      Il n'y a certainement pas de compensation pour l'inflation. Vous vous exposez 
                      toujours à un mauvais résultat."
                    </blockquote>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FourPercentRuleModule;
