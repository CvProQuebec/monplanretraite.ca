import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Layers, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Calculator,
  Target,
  Lightbulb,
  DollarSign,
  Clock,
  BarChart3,
  PieChart,
  Wallet
} from 'lucide-react';

interface BucketStrategy {
  bucket1: {
    name: string;
    timeframe: string;
    amount: number;
    allocation: number;
    riskLevel: 'low' | 'medium' | 'high';
    expectedReturn: number;
  };
  bucket2: {
    name: string;
    timeframe: string;
    amount: number;
    allocation: number;
    riskLevel: 'low' | 'medium' | 'high';
    expectedReturn: number;
  };
  bucket3: {
    name: string;
    timeframe: string;
    amount: number;
    allocation: number;
    riskLevel: 'low' | 'medium' | 'high';
    expectedReturn: number;
  };
}

interface RetirementInputs {
  totalAssets: number;
  annualIncome: number;
  retirementAge: number;
  lifeExpectancy: number;
  inflationRate: number;
  conservativeReturn: number;
  moderateReturn: number;
  aggressiveReturn: number;
}

const CashWedgeBucketModule: React.FC = () => {
  const [inputs, setInputs] = useState<RetirementInputs>({
    totalAssets: 500000,
    annualIncome: 40000,
    retirementAge: 65,
    lifeExpectancy: 85,
    inflationRate: 2.5,
    conservativeReturn: 3.0,
    moderateReturn: 6.0,
    aggressiveReturn: 8.0
  });

  const [bucketStrategy, setBucketStrategy] = useState<BucketStrategy | null>(null);
  const [activeTab, setActiveTab] = useState('calculator');
  const [marketScenario, setMarketScenario] = useState<'normal' | 'bear' | 'bull'>('normal');

  // Calculer la stratégie de buckets
  const calculateBucketStrategy = () => {
    const yearsInRetirement = inputs.lifeExpectancy - inputs.retirementAge;
    
    // Bucket 1: Liquidités (0-3 ans)
    const bucket1Amount = inputs.annualIncome * 3; // 3 ans de revenus
    const bucket1Allocation = (bucket1Amount / inputs.totalAssets) * 100;

    // Bucket 2: Croissance modérée (4-10 ans)
    const bucket2Amount = inputs.annualIncome * 7; // 7 ans de revenus
    const bucket2Allocation = (bucket2Amount / inputs.totalAssets) * 100;

    // Bucket 3: Croissance à long terme (10+ ans)
    const bucket3Amount = inputs.totalAssets - bucket1Amount - bucket2Amount;
    const bucket3Allocation = (bucket3Amount / inputs.totalAssets) * 100;

    const strategy: BucketStrategy = {
      bucket1: {
        name: "Liquidités & Sécurité",
        timeframe: "0-3 ans",
        amount: bucket1Amount,
        allocation: bucket1Allocation,
        riskLevel: 'low',
        expectedReturn: inputs.conservativeReturn
      },
      bucket2: {
        name: "Croissance Modérée",
        timeframe: "4-10 ans", 
        amount: bucket2Amount,
        allocation: bucket2Allocation,
        riskLevel: 'medium',
        expectedReturn: inputs.moderateReturn
      },
      bucket3: {
        name: "Croissance Long Terme",
        timeframe: "10+ ans",
        amount: bucket3Amount,
        allocation: bucket3Allocation,
        riskLevel: 'high',
        expectedReturn: inputs.aggressiveReturn
      }
    };

    setBucketStrategy(strategy);
  };

  // Calculer automatiquement quand les inputs changent
  useEffect(() => {
    calculateBucketStrategy();
  }, [inputs]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMarketImpact = (bucket: any, scenario: string) => {
    let impactMultiplier = 1;
    switch (scenario) {
      case 'bear':
        impactMultiplier = bucket.riskLevel === 'high' ? 0.7 : bucket.riskLevel === 'medium' ? 0.9 : 0.98;
        break;
      case 'bull':
        impactMultiplier = bucket.riskLevel === 'high' ? 1.3 : bucket.riskLevel === 'medium' ? 1.15 : 1.02;
        break;
      default:
        impactMultiplier = 1;
    }
    return bucket.amount * impactMultiplier;
  };

  const calculateProtectionScore = () => {
    if (!bucketStrategy) return { score: 0, status: 'Non calculé', color: 'text-gray-600' };
    
    const cashWedgeYears = bucketStrategy.bucket1.amount / inputs.annualIncome;
    
    if (cashWedgeYears >= 5) return { score: 95, status: 'Excellent', color: 'text-green-600' };
    if (cashWedgeYears >= 3) return { score: 85, status: 'Très bon', color: 'text-green-600' };
    if (cashWedgeYears >= 2) return { score: 70, status: 'Bon', color: 'text-yellow-600' };
    if (cashWedgeYears >= 1) return { score: 50, status: 'Insuffisant', color: 'text-orange-600' };
    return { score: 25, status: 'Critique', color: 'text-red-600' };
  };

  const protectionScore = calculateProtectionScore();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Layers className="h-8 w-8 text-mpr-interactive" />
          <h1 className="text-3xl font-bold text-gray-900">
            Stratégie Cash Wedge & Buckets
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Protégez votre retraite avec une stratégie de buckets. Gardez 3-5 ans de liquidités 
          pour naviguer les marchés baissiers sans toucher vos investissements.
        </p>
      </div>

      {/* Score de protection */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Score de Protection
            </CardTitle>
            <Badge className={`${protectionScore.color} bg-transparent border-current`}>
              {protectionScore.score}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={protectionScore.score} className="h-3" />
            <div className="flex items-center justify-between">
              <span className={`font-semibold ${protectionScore.color}`}>
                {protectionScore.status}
              </span>
              {bucketStrategy && (
                <span className="text-sm text-gray-600">
                  {(bucketStrategy.bucket1.amount / inputs.annualIncome).toFixed(1)} ans de liquidités
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Calculateur</TabsTrigger>
          <TabsTrigger value="strategy">Stratégie</TabsTrigger>
          <TabsTrigger value="scenarios">Scénarios</TabsTrigger>
          <TabsTrigger value="education">Éducation</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Paramètres de Retraite
                </CardTitle>
                <CardDescription>
                  Entrez vos informations pour calculer votre stratégie optimale
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalAssets">Actifs totaux ($)</Label>
                    <Input
                      id="totalAssets"
                      type="number"
                      value={inputs.totalAssets}
                      onChange={(e) => setInputs({...inputs, totalAssets: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="annualIncome">Revenus annuels souhaités ($)</Label>
                    <Input
                      id="annualIncome"
                      type="number"
                      value={inputs.annualIncome}
                      onChange={(e) => setInputs({...inputs, annualIncome: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="retirementAge">Âge de retraite</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      value={inputs.retirementAge}
                      onChange={(e) => setInputs({...inputs, retirementAge: parseInt(e.target.value) || 65})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lifeExpectancy">Espérance de vie</Label>
                    <Input
                      id="lifeExpectancy"
                      type="number"
                      value={inputs.lifeExpectancy}
                      onChange={(e) => setInputs({...inputs, lifeExpectancy: parseInt(e.target.value) || 85})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="conservativeReturn">Rendement conservateur (%)</Label>
                    <Input
                      id="conservativeReturn"
                      type="number"
                      step="0.1"
                      value={inputs.conservativeReturn}
                      onChange={(e) => setInputs({...inputs, conservativeReturn: parseFloat(e.target.value) || 3})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="moderateReturn">Rendement modéré (%)</Label>
                    <Input
                      id="moderateReturn"
                      type="number"
                      step="0.1"
                      value={inputs.moderateReturn}
                      onChange={(e) => setInputs({...inputs, moderateReturn: parseFloat(e.target.value) || 6})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="aggressiveReturn">Rendement agressif (%)</Label>
                    <Input
                      id="aggressiveReturn"
                      type="number"
                      step="0.1"
                      value={inputs.aggressiveReturn}
                      onChange={(e) => setInputs({...inputs, aggressiveReturn: parseFloat(e.target.value) || 8})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Répartition Recommandée
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bucketStrategy && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <div className="font-medium text-green-800">Bucket 1 - Liquidités</div>
                          <div className="text-sm text-green-600">{bucketStrategy.bucket1.timeframe}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-800">
                            {bucketStrategy.bucket1.allocation.toFixed(1)}%
                          </div>
                          <div className="text-sm text-green-600">
                            {bucketStrategy.bucket1.amount.toLocaleString('fr-CA', {
                              style: 'currency',
                              currency: 'CAD',
                              maximumFractionDigits: 0
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div>
                          <div className="font-medium text-yellow-800">Bucket 2 - Modéré</div>
                          <div className="text-sm text-yellow-600">{bucketStrategy.bucket2.timeframe}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-yellow-800">
                            {bucketStrategy.bucket2.allocation.toFixed(1)}%
                          </div>
                          <div className="text-sm text-yellow-600">
                            {bucketStrategy.bucket2.amount.toLocaleString('fr-CA', {
                              style: 'currency',
                              currency: 'CAD',
                              maximumFractionDigits: 0
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <div className="font-medium text-red-800">Bucket 3 - Croissance</div>
                          <div className="text-sm text-red-600">{bucketStrategy.bucket3.timeframe}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-800">
                            {bucketStrategy.bucket3.allocation.toFixed(1)}%
                          </div>
                          <div className="text-sm text-red-600">
                            {bucketStrategy.bucket3.amount.toLocaleString('fr-CA', {
                              style: 'currency',
                              currency: 'CAD',
                              maximumFractionDigits: 0
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">
                          {inputs.totalAssets.toLocaleString('fr-CA', {
                            style: 'currency',
                            currency: 'CAD',
                            maximumFractionDigits: 0
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          {bucketStrategy && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bucket 1 */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Wallet className="h-5 w-5" />
                    {bucketStrategy.bucket1.name}
                  </CardTitle>
                  <CardDescription>{bucketStrategy.bucket1.timeframe}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {bucketStrategy.bucket1.amount.toLocaleString('fr-CA', {
                        style: 'currency',
                        currency: 'CAD',
                        maximumFractionDigits: 0
                      })}
                    </div>
                    <div className="text-sm text-green-600">
                      {bucketStrategy.bucket1.allocation.toFixed(1)}% du portefeuille
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Niveau de risque</span>
                      <Badge className={getRiskColor(bucketStrategy.bucket1.riskLevel)}>
                        Faible
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Rendement attendu</span>
                      <span className="text-sm font-medium">{bucketStrategy.bucket1.expectedReturn}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Années couvertes</span>
                      <span className="text-sm font-medium">
                        {(bucketStrategy.bucket1.amount / inputs.annualIncome).toFixed(1)} ans
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <h4 className="font-medium mb-2">Investissements suggérés:</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
