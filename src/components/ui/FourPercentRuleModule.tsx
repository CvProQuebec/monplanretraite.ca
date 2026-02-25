// src/components/ui/FourPercentRuleModule.tsx
import React, { useState, useEffect, useMemo } from 'react';
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
import { useNavigate } from 'react-router-dom';

import { FourPercentRuleService } from '@/services/FourPercentRuleService';
import { FINANCIAL_ASSUMPTIONS, FINANCIAL_UTILS } from '@/config/financial-assumptions';
import { formatCurrencyOQLF, formatPercentOQLF } from '@/utils/localeFormat';

interface FourPercentRuleModuleProps {
  className?: string;
}

interface ProjectionPoint {
  year: number;
  portfolioValue: number;
  withdrawal: number;
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
  // Entrées interactives (Phase 1: calculs déterministes + matrice Trinity)
  const [initialAmount, setInitialAmount] = useState<number>(500000);
  const [withdrawalRate, setWithdrawalRate] = useState<number>(4.0); // %
  const [inflationRate, setInflationRate] = useState<number>(Math.round(FINANCIAL_ASSUMPTIONS.INFLATION * 1000) / 10); // 2.1% => 2.1
  const [stockAllocation, setStockAllocation] = useState<number>(60); // %
  const [projection, setProjection] = useState<ProjectionPoint[]>([]);
  const [allocationScenarios, setAllocationScenarios] = useState<AllocationScenario[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const navigate = useNavigate();

  // Rendement nominal attendu basé sur allocation actuelle (actions/obligations/liquidités)
  const nominalReturn = useMemo(() => {
    const alloc = {
      actions: stockAllocation / 100,
      obligations: Math.max(0, 1 - stockAllocation / 100),
      liquidites: 0
    };
    return FINANCIAL_UTILS.calculatePortfolioReturn(alloc);
  }, [stockAllocation]);

  const buildDeterministicProjection = (
    initial: number,
    withdrawalPercent: number,
    inflation: number,
    nominal: number,
    years: number = 30
  ): ProjectionPoint[] => {
    const pts: ProjectionPoint[] = [];
    let portfolio = initial;
    const withdrawalInitial = initial * (withdrawalPercent / 100);

    for (let y = 1; y <= years; y++) {
      // Retrait de l'année y (ajusté pour inflation)
      const withdrawalY = withdrawalInitial * Math.pow(1 + inflation / 100, y - 1);
      // Croissance nominale puis retrait
      portfolio = portfolio * (1 + nominal) - withdrawalY;
      const inflationAdjusted = portfolio / Math.pow(1 + inflation / 100, y - 1);

      pts.push({
        year: y,
        portfolioValue: Math.max(0, portfolio),
        withdrawal: withdrawalY,
        inflationAdjustedValue: Math.max(0, inflationAdjusted)
      });

      if (portfolio <= 0) {
        // Si le portefeuille s'épuise, on remplit le reste à zéro pour la lisibilité du graphique
        for (let yy = y + 1; yy <= years; yy++) {
          pts.push({
            year: yy,
            portfolioValue: 0,
            withdrawal: withdrawalInitial * Math.pow(1 + inflation / 100, yy - 1),
            inflationAdjustedValue: 0
          });
        }
        break;
      }
    }
    return pts;
  };

  const computeAllocationScenarios = (
    initial: number,
    withdrawalPercent: number,
    inflation: number
  ): AllocationScenario[] => {
    const scenarios: AllocationScenario[] = [];
    for (let stocks = 0; stocks <= 100; stocks += 10) {
      const bonds = Math.max(0, 100 - stocks);
      const nominal = FINANCIAL_UTILS.calculatePortfolioReturn({
        actions: stocks / 100,
        obligations: bonds / 100,
        liquidites: 0
      });

      const proj = buildDeterministicProjection(initial, withdrawalPercent, inflation, nominal, 30);
      const endValue = proj[proj.length - 1]?.portfolioValue ?? 0;

      const successRate =
        FourPercentRuleService.calculateTrinityProbability(withdrawalPercent, stocks / 100, 30) * 100;

      scenarios.push({
        stocks,
        bonds,
        cash: 0,
        successRate,
        averageEndValue: endValue,
        // Estimations simplifiées pour borne basse/haute (déterministes atténuées)
        worstCase: endValue * 0.5,
        bestCase: endValue * 1.5
      });
    }
    return scenarios;
  };

  const runCalculations = () => {
    setIsCalculating(true);
    const proj = buildDeterministicProjection(initialAmount, withdrawalRate, inflationRate, nominalReturn, 30);
    setProjection(proj);
    setAllocationScenarios(computeAllocationScenarios(initialAmount, withdrawalRate, inflationRate));
    setIsCalculating(false);
  };

  useEffect(() => {
    runCalculations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAmount, withdrawalRate, inflationRate, stockAllocation]);

  const currentSuccessRate =
    FourPercentRuleService.calculateTrinityProbability(withdrawalRate, stockAllocation / 100, 30) * 100;

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 90) return 'text-emerald-600';
    if (rate >= 80) return 'text-yellow-600';
    if (rate >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSuccessRateMessage = (rate: number) => {
    if (rate >= 95) return 'Excellent ! Votre stratégie est très robuste.';
    if (rate >= 90) return 'Très bien ! Stratégie solide avec marge de sécurité.';
    if (rate >= 80) return 'Acceptable, mais considérez des ajustements.';
    if (rate >= 70) return 'Risqué. Réduction du taux de retrait recommandée.';
    return 'Très risqué ! Révision majeure nécessaire.';
  };

  const optimalAllocation = allocationScenarios.reduce(
    (best, current) => (current.successRate > best.successRate ? current : best),
    allocationScenarios[0] || { stocks: 60, bonds: 40, cash: 0, successRate: 0, averageEndValue: 0, worstCase: 0, bestCase: 0 }
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-mpr-interactive" />
            <CardTitle>Règle des 4 % modernisée</CardTitle>
          </div>
          <CardDescription>
            Basé sur l’étude de William Bengen et la matrice Trinity (30 ans). Vérifiez rapidement la viabilité de votre stratégie.
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
                    <Label htmlFor="inflation-rate">Taux d’inflation (%)</Label>
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
<div className="text-2xl font-bold text-mpr-interactive">
                        {formatPercentOQLF(currentSuccessRate, { min: 1, max: 1 })}
                      </div>
                      <div className="text-sm text-gray-600">Probabilité de succès (Trinity, 30 ans)</div>
                      <Progress value={currentSuccessRate} className="w-full" />
                      <div className={`text-sm font-medium ${getSuccessRateColor(currentSuccessRate)}`}>
                        {getSuccessRateMessage(currentSuccessRate)}
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        Note éducative : la règle du 4 % n’est pas une garantie. Testez votre plan avec un coussin de liquidités (3–5 ans).
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Retrait annuel initial :</span>
                        <span className="font-medium">
                          {formatCurrencyOQLF((initialAmount * withdrawalRate) / 100)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Retrait année 30 :</span>
                        <span className="font-medium">
                          {formatCurrencyOQLF((initialAmount * (withdrawalRate / 100)) * Math.pow(1 + inflationRate / 100, 30))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Allocation optimale :</span>
<span className="font-medium">{formatPercentOQLF(optimalAllocation.stocks)} actions</span>
                      </div>
                    </div>
                  </Card>

                  {currentSuccessRate < 80 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
Taux de succès faible. Réduisez le taux de retrait à {formatPercentOQLF(Math.max(withdrawalRate - 0.5, 2.0))} 
                        ou augmentez l’allocation en actions à {formatPercentOQLF(Math.min(stockAllocation + 10, 80))}.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {projection.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Évolution du portefeuille sur 30 ans</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={projection}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M$`}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          formatCurrencyOQLF(value),
                          name === 'portfolioValue' ? 'Valeur portefeuille' : name === 'inflationAdjustedValue' ? 'Valeur ajustée inflation' : 'Retrait annuel'
                        ]}
                        labelFormatter={(label: any) => `Année ${label}`}
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
                      <Line
                        type="monotone"
                        dataKey="withdrawal"
                        stroke="#10b981"
                        dot={false}
                        name="withdrawal"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              )}
              <div className="pt-2">
                <Button className="w-full four-percent-btn" onClick={() => navigate('/simulateur-monte-carlo')}>
                  Mettre à l’épreuve (Stress test)
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comparaison des allocations d’actifs</CardTitle>
                  <CardDescription>
                    Impact de l’allocation sur la probabilité de succès (matrice Trinity)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allocationScenarios.map((scenario, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
<div className="font-semibold">{formatPercentOQLF(scenario.stocks)}</div>
                            <div className="text-xs text-gray-500">Actions</div>
                          </div>
                          <div className="text-center">
<div className="font-semibold">{formatPercentOQLF(scenario.bonds)}</div>
                            <div className="text-xs text-gray-500">Obligations</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
<div className={`font-bold ${getSuccessRateColor(scenario.successRate)}`}>
                              {formatPercentOQLF(scenario.successRate, { min: 1, max: 1 })}
                            </div>
                            <div className="text-xs text-gray-500">Succès</div>
                          </div>
                          <div className="hidden md:block text-center">
                            <div className="font-semibold">{formatCurrencyOQLF(scenario.averageEndValue)}</div>
                            <div className="text-xs text-gray-500">Valeur année 30</div>
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
                      <strong>Découverte clé :</strong> 100 % liquidités est souvent le plus risqué (probabilité faible sur 30 ans).
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Données historiques (rappel)</CardTitle>
                  <CardDescription>
                    La règle des 4 % a résisté à de nombreux contextes de marché sur 30 ans.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-red-50 rounded">
                        <span>1929 (Grande Dépression)</span>
                        <span className="font-semibold text-green-600">✓ Résilience</span>
                      </div>
                      <div className="flex justify-between p-3 bg-red-50 rounded">
                        <span>1973 (Choc pétrolier)</span>
                        <span className="font-semibold text-green-600">✓ Résilience</span>
                      </div>
                      <div className="flex justify-between p-3 bg-red-50 rounded">
                        <span>2000 (Bulle techno)</span>
                        <span className="font-semibold text-green-600">✓ Résilience</span>
                      </div>
                      <div className="flex justify-between p-3 bg-red-50 rounded">
                        <span>2008 (Crise financière)</span>
                        <span className="font-semibold text-green-600">✓ Résilience</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Card className="p-4 text-center">
                        <div className="text-3xl font-bold text-mpr-interactive">~30 ans</div>
                        <div className="text-sm text-gray-600">
                          Horizon typique d’une retraite
                        </div>
                      </Card>

                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                          Maintenir une composante d’actions raisonnable aide à préserver le pouvoir d’achat (inflation).
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
                    Retirer 4 % la 1ère année, puis ajuster pour l’inflation chaque année.
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
                        Un taux de retrait bien calibré augmente vos chances de succès sur 30 ans sans épuiser trop vite votre épargne.
                      </p>

                      <h4 className="font-semibold flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Allocation recommandée
                      </h4>
                      <p className="text-sm text-gray-600">
                        Une allocation équilibrée (ex.: 60 % actions / 40 % obligations) tend à mieux protéger contre l’inflation.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Mythes à éviter
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="p-2 bg-red-50 rounded">
                          ❌ 100 % liquidités = sécurité (souvent faux à long terme)
                        </div>
                        <div className="p-2 bg-green-50 rounded">
                          ✅ Miser sur la croissance raisonnable soutient le pouvoir d’achat
                        </div>
                      </div>

                      <h4 className="font-semibold flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Facteurs de succès
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Diversification</li>
                        <li>• Rééquilibrage périodique</li>
                        <li>• Flexibilité sur le taux de retrait</li>
                        <li>• Discipline émotionnelle</li>
                      </ul>
                    </div>
                  </div>
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
