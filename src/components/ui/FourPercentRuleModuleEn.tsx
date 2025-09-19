// src/components/ui/FourPercentRuleModuleEn.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, AlertTriangle, Calculator, BarChart3, Target, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { FourPercentRuleService } from '@/services/FourPercentRuleService';
import { FINANCIAL_ASSUMPTIONS, FINANCIAL_UTILS } from '@/config/financial-assumptions';

// Simple EN formatters (English Canada)
const formatCurrencyEN = (value: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 2 }).format(
    isFinite(value) ? value : 0
  );

const formatPercentEN = (value: number, digits = 1) =>
  `${isFinite(value) ? value.toFixed(digits) : '0.0'}%`;

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
}

export default function FourPercentRuleModuleEn({ className }: { className?: string }) {
  // User inputs
  const [initialAmount, setInitialAmount] = useState<number>(500000);
  const [withdrawalRate, setWithdrawalRate] = useState<number>(4.0); // %
  const [inflationRate, setInflationRate] = useState<number>(
    Math.round(FINANCIAL_ASSUMPTIONS.INFLATION * 1000) / 10
  ); // e.g. 2.1
  const [stockAllocation, setStockAllocation] = useState<number>(60); // %
  const [projection, setProjection] = useState<ProjectionPoint[]>([]);
  const [allocationScenarios, setAllocationScenarios] = useState<AllocationScenario[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const navigate = useNavigate();

  // Expected nominal return based on allocation
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
      const withdrawalY = withdrawalInitial * Math.pow(1 + inflation / 100, y - 1);
      portfolio = portfolio * (1 + nominal) - withdrawalY;
      const inflationAdjusted = portfolio / Math.pow(1 + inflation / 100, y - 1);

      pts.push({
        year: y,
        portfolioValue: Math.max(0, portfolio),
        withdrawal: withdrawalY,
        inflationAdjustedValue: Math.max(0, inflationAdjusted)
      });

      if (portfolio <= 0) {
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
        averageEndValue: endValue
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
    if (rate >= 95) return 'Excellent! Your plan is very robust.';
    if (rate >= 90) return 'Very good! Solid strategy with safety margin.';
    if (rate >= 80) return 'Acceptable, but consider adjustments.';
    if (rate >= 70) return 'Risky. Reducing the withdrawal rate is recommended.';
    return 'Very risky! A major review is needed.';
  };

  const optimalAllocation = allocationScenarios.reduce(
    (best, current) => (current.successRate > best.successRate ? current : best),
    allocationScenarios[0] || { stocks: 60, bonds: 40, cash: 0, successRate: 0, averageEndValue: 0 }
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            <CardTitle>Modernized 4% Rule</CardTitle>
          </div>
          <CardDescription>
            Based on William Bengen’s work and the Trinity study (30 years). Quickly check the viability of your plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
              <TabsTrigger value="historical">History</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="initial-amount-en">Initial savings ($)</Label>
                    <Input
                      id="initial-amount-en"
                      type="number"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="withdrawal-rate-en">Annual withdrawal rate (%)</Label>
                    <Input
                      id="withdrawal-rate-en"
                      type="number"
                      step="0.1"
                      value={withdrawalRate}
                      onChange={(e) => setWithdrawalRate(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="inflation-rate-en">Inflation rate (%)</Label>
                    <Input
                      id="inflation-rate-en"
                      type="number"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock-allocation-en">Equity allocation (%)</Label>
                    <Input
                      id="stock-allocation-en"
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
                        {formatPercentEN(currentSuccessRate, 1)}
                      </div>
                      <div className="text-sm text-gray-600">Probability of success (Trinity, 30 years)</div>
                      <Progress value={currentSuccessRate} className="w-full" />
                      <div className={`text-sm font-medium ${getSuccessRateColor(currentSuccessRate)}`}>
                        {getSuccessRateMessage(currentSuccessRate)}
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        Educational note: the 4% rule is not a guarantee. Test your plan with a cash cushion (3–5 years).
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Initial annual withdrawal:</span>
                        <span className="font-medium">
                          {formatCurrencyEN((initialAmount * withdrawalRate) / 100)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Year 30 withdrawal:</span>
                        <span className="font-medium">
                          {formatCurrencyEN((initialAmount * (withdrawalRate / 100)) * Math.pow(1 + inflationRate / 100, 30))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Optimal allocation:</span>
                        <span className="font-medium">{formatPercentEN(optimalAllocation.stocks, 0)} equities</span>
                      </div>
                    </div>
                  </Card>

                  {currentSuccessRate < 80 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Low success rate. Reduce withdrawal to {formatPercentEN(Math.max(withdrawalRate - 0.5, 2.0), 1)} or increase equity allocation to {formatPercentEN(Math.min(stockAllocation + 10, 80), 0)}.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {projection.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Portfolio over 30 years</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={projection}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          formatCurrencyEN(value),
                          name === 'portfolioValue'
                            ? 'Portfolio value'
                            : name === 'inflationAdjustedValue'
                            ? 'Inflation-adjusted value'
                            : 'Annual withdrawal'
                        ]}
                        labelFormatter={(label: any) => `Year ${label}`}
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
                      <Line type="monotone" dataKey="withdrawal" stroke="#10b981" dot={false} name="withdrawal" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              )}
              <div className="pt-2">
                <Button className="w-full four-percent-btn" onClick={() => navigate('/monte-carlo-simulator')}>
                  Put to the test (Stress test)
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset allocation comparison</CardTitle>
                  <CardDescription>Impact of allocation on success probability (Trinity matrix)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allocationScenarios.map((scenario, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-semibold">{formatPercentEN(scenario.stocks, 0)}</div>
                            <div className="text-xs text-gray-500">Equities</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{formatPercentEN(scenario.bonds, 0)}</div>
                            <div className="text-xs text-gray-500">Bonds</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className={`font-bold ${getSuccessRateColor(scenario.successRate)}`}>
                              {formatPercentEN(scenario.successRate, 1)}
                            </div>
                            <div className="text-xs text-gray-500">Success</div>
                          </div>
                          <div className="hidden md:block text-center">
                            <div className="font-semibold">{formatCurrencyEN(scenario.averageEndValue)}</div>
                            <div className="text-xs text-gray-500">Value at year 30</div>
                          </div>

                          {scenario.successRate === Math.max(...allocationScenarios.map((s) => s.successRate)) && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Optimal
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Alert className="mt-6">
                    <BarChart3 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Key insight:</strong> 100% cash is often the riskiest over 30 years (lower success probability).
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historical context (recap)</CardTitle>
                  <CardDescription>The 4% rule has endured many market regimes over 30-year spans.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-red-50 rounded">
                        <span>1929 (Great Depression)</span>
                        <span className="font-semibold text-green-600">✓ Endured</span>
                      </div>
                      <div className="flex justify-between p-3 bg-red-50 rounded">
                        <span>1973 (Oil shock)</span>
                        <span className="font-semibold text-green-600">✓ Endured</span>
                      </div>
                      <div className="flex justify-between p-3 bg-red-50 rounded">
                        <span>2000 (Tech bubble)</span>
                        <span className="font-semibold text-green-600">✓ Endured</span>
                      </div>
                      <div className="flex justify-between p-3 bg-red-50 rounded">
                        <span>2008 (Financial crisis)</span>
                        <span className="font-semibold text-green-600">✓ Endured</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Card className="p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600">~30 years</div>
                        <div className="text-sm text-gray-600">Typical retirement horizon</div>
                      </Card>

                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                          Maintaining a reasonable equity allocation helps preserve purchasing power (inflation).
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
                  <CardTitle>Understanding the 4% rule</CardTitle>
                  <CardDescription>Withdraw 4% in year one, then adjust for inflation annually.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Core idea
                      </h4>
                      <p className="text-sm text-gray-600">
                        A well-calibrated withdrawal rate increases your chances of success over 30 years without exhausting savings too quickly.
                      </p>

                      <h4 className="font-semibold flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Suggested allocation
                      </h4>
                      <p className="text-sm text-gray-600">
                        A balanced allocation (e.g., 60% equities / 40% bonds) tends to better protect against inflation.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Pitfalls to avoid
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="p-2 bg-red-50 rounded">❌ 100% cash = safety (often false in the long run)</div>
                        <div className="p-2 bg-green-50 rounded">✅ Reasonable growth helps protect purchasing power</div>
                      </div>

                      <h4 className="font-semibold flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Success factors
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Diversification</li>
                        <li>• Periodic rebalancing</li>
                        <li>• Flexible withdrawal rate</li>
                        <li>• Emotional discipline</li>
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
}
