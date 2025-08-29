import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Badge } from './badge';
import { Alert, AlertDescription } from './alert';
import { Progress } from './progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target,
  Shield,
  Zap
} from 'lucide-react';

interface OptimalAllocationModuleProps {
  userPlan: 'free' | 'professional' | 'expert';
}

interface AllocationData {
  age: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  timeHorizon: number;
  currentAllocation: {
    stocks: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
}

interface OptimalAllocation {
  stocks: number;
  bonds: number;
  cash: number;
  alternatives: number;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
}

export const OptimalAllocationModule: React.FC<OptimalAllocationModuleProps> = ({ userPlan }) => {
  const [allocationData, setAllocationData] = useState<AllocationData>({
    age: 65,
    riskTolerance: 'moderate',
    timeHorizon: 20,
    currentAllocation: {
      stocks: 60,
      bonds: 30,
      cash: 10,
      alternatives: 0
    }
  });

  const [optimalAllocation, setOptimalAllocation] = useState<OptimalAllocation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calcul de l'allocation optimale basé sur les principes académiques
  const calculateOptimalAllocation = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const { age, riskTolerance, timeHorizon } = allocationData;
      
      // Formule basée sur les principes académiques: 70-75% actions pour la retraite
      let baseStocks = 70;
      
      // Ajustements selon l'âge et l'horizon temporel
      if (age < 60) baseStocks = 80;
      else if (age > 75) baseStocks = 65;
      
      // Ajustements selon la tolérance au risque
      if (riskTolerance === 'conservative') baseStocks -= 10;
      else if (riskTolerance === 'aggressive') baseStocks += 5;
      
      // Ajustements selon l'horizon temporel
      if (timeHorizon < 10) baseStocks -= 10;
      else if (timeHorizon > 25) baseStocks += 5;
      
      // Limites de sécurité
      baseStocks = Math.max(50, Math.min(85, baseStocks));
      
      const optimal: OptimalAllocation = {
        stocks: baseStocks,
        bonds: Math.max(10, 90 - baseStocks - 5),
        cash: 5,
        alternatives: Math.min(10, 100 - baseStocks - Math.max(10, 90 - baseStocks - 5) - 5),
        expectedReturn: baseStocks * 0.07 + (90 - baseStocks) * 0.035,
        volatility: baseStocks * 0.16 + (90 - baseStocks) * 0.05,
        sharpeRatio: (baseStocks * 0.07 + (90 - baseStocks) * 0.035 - 0.02) / (baseStocks * 0.16 + (90 - baseStocks) * 0.05)
      };
      
      setOptimalAllocation(optimal);
      setIsCalculating(false);
    }, 1500);
  };

  const calculateRebalancingNeeded = () => {
    if (!optimalAllocation) return null;
    
    const current = allocationData.currentAllocation;
    const optimal = optimalAllocation;
    
    return {
      stocks: optimal.stocks - current.stocks,
      bonds: optimal.bonds - current.bonds,
      cash: optimal.cash - current.cash,
      alternatives: optimal.alternatives - current.alternatives
    };
  };

  const calculatePotentialImpact = () => {
    if (!optimalAllocation) return null;
    
    const currentReturn = 
      allocationData.currentAllocation.stocks * 0.07 +
      allocationData.currentAllocation.bonds * 0.035 +
      allocationData.currentAllocation.cash * 0.015 +
      allocationData.currentAllocation.alternatives * 0.06;
    
    const optimalReturn = optimalAllocation.expectedReturn;
    const improvementBps = (optimalReturn - currentReturn) * 10000;
    
    return {
      currentReturn: currentReturn * 100,
      optimalReturn: optimalReturn * 100,
      improvementBps: Math.round(improvementBps),
      annualImpact: improvementBps * 100, // Sur 100k$
      twentyYearImpact: improvementBps * 100 * 20 * 1.5 // Effet composé approximatif
    };
  };

  const rebalancingNeeded = calculateRebalancingNeeded();
  const potentialImpact = calculatePotentialImpact();

  if (userPlan === 'free') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Module d'Allocation Optimale
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Optimisez votre portefeuille selon les principes académiques
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Fonctionnalité Premium
            </h3>
            <p className="text-gray-600 mb-6">
              L'optimisation d'allocation basée sur les principes académiques est disponible avec les plans Professionnel et Expert.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-orange-800">
                <strong>Économies potentielles:</strong> Jusqu'à 2-3% de rendement annuel supplémentaire
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Débloquer le Module
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Module d'Allocation Optimale
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Basé sur les principes académiques: 70-75% actions pour maximiser les rendements en retraite
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Formulaire de données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Vos Paramètres
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="age">Âge actuel</Label>
              <Input
                id="age"
                type="number"
                value={allocationData.age}
                onChange={(e) => setAllocationData(prev => ({
                  ...prev,
                  age: parseInt(e.target.value) || 65
                }))}
                min="50"
                max="90"
              />
            </div>
            
            <div>
              <Label htmlFor="timeHorizon">Horizon de placement (années)</Label>
              <Input
                id="timeHorizon"
                type="number"
                value={allocationData.timeHorizon}
                onChange={(e) => setAllocationData(prev => ({
                  ...prev,
                  timeHorizon: parseInt(e.target.value) || 20
                }))}
                min="5"
                max="40"
              />
            </div>
            
            <div>
              <Label htmlFor="riskTolerance">Tolérance au risque</Label>
              <select
                id="riskTolerance"
                title="Sélectionnez votre tolérance au risque"
                value={allocationData.riskTolerance}
                onChange={(e) => setAllocationData(prev => ({
                  ...prev,
                  riskTolerance: e.target.value as 'conservative' | 'moderate' | 'aggressive'
                }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="conservative">Conservateur</option>
                <option value="moderate">Modéré</option>
                <option value="aggressive">Agressif</option>
              </select>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Allocation Actuelle (%)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="stocks">Actions</Label>
                <Input
                  id="stocks"
                  type="number"
                  value={allocationData.currentAllocation.stocks}
                  onChange={(e) => setAllocationData(prev => ({
                    ...prev,
                    currentAllocation: {
                      ...prev.currentAllocation,
                      stocks: parseInt(e.target.value) || 0
                    }
                  }))}
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <Label htmlFor="bonds">Obligations</Label>
                <Input
                  id="bonds"
                  type="number"
                  value={allocationData.currentAllocation.bonds}
                  onChange={(e) => setAllocationData(prev => ({
                    ...prev,
                    currentAllocation: {
                      ...prev.currentAllocation,
                      bonds: parseInt(e.target.value) || 0
                    }
                  }))}
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <Label htmlFor="cash">Liquidités</Label>
                <Input
                  id="cash"
                  type="number"
                  value={allocationData.currentAllocation.cash}
                  onChange={(e) => setAllocationData(prev => ({
                    ...prev,
                    currentAllocation: {
                      ...prev.currentAllocation,
                      cash: parseInt(e.target.value) || 0
                    }
                  }))}
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <Label htmlFor="alternatives">Alternatifs</Label>
                <Input
                  id="alternatives"
                  type="number"
                  value={allocationData.currentAllocation.alternatives}
                  onChange={(e) => setAllocationData(prev => ({
                    ...prev,
                    currentAllocation: {
                      ...prev.currentAllocation,
                      alternatives: parseInt(e.target.value) || 0
                    }
                  }))}
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={calculateOptimalAllocation}
            disabled={isCalculating}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Calcul en cours...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Calculer l'Allocation Optimale
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultats */}
      {optimalAllocation && (
        <>
          {/* Allocation recommandée */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Allocation Optimale Recommandée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {optimalAllocation.stocks}%
                  </div>
                  <div className="text-sm text-gray-600">Actions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {optimalAllocation.bonds}%
                  </div>
                  <div className="text-sm text-gray-600">Obligations</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {optimalAllocation.cash}%
                  </div>
                  <div className="text-sm text-gray-600">Liquidités</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {optimalAllocation.alternatives}%
                  </div>
                  <div className="text-sm text-gray-600">Alternatifs</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">
                    {(optimalAllocation.expectedReturn * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Rendement Attendu</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">
                    {(optimalAllocation.volatility * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Volatilité</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">
                    {optimalAllocation.sharpeRatio.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Ratio de Sharpe</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rééquilibrage nécessaire */}
          {rebalancingNeeded && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Rééquilibrage Recommandé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(rebalancingNeeded).map(([asset, change]) => (
                    <div key={asset} className="text-center p-4 border rounded-lg">
                      <div className={`text-lg font-semibold ${
                        change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {change > 0 ? '+' : ''}{change.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {asset === 'stocks' ? 'Actions' : 
                         asset === 'bonds' ? 'Obligations' :
                         asset === 'cash' ? 'Liquidités' : 'Alternatifs'}
                      </div>
                      {change !== 0 && (
                        <div className="mt-1">
                          {change > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600 mx-auto" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600 mx-auto" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Impact potentiel */}
          {potentialImpact && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Impact Financier Potentiel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rendement actuel:</span>
                      <span className="font-semibold">{potentialImpact.currentReturn.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rendement optimal:</span>
                      <span className="font-semibold text-green-600">{potentialImpact.optimalReturn.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amélioration:</span>
                      <span className="font-semibold text-blue-600">
                        +{potentialImpact.improvementBps} points de base
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-sm text-green-800 mb-1">Sur 100 000$ par année:</div>
                      <div className="text-lg font-bold text-green-900">
                        +{potentialImpact.annualImpact.toLocaleString()}$
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm text-blue-800 mb-1">Impact sur 20 ans:</div>
                      <div className="text-lg font-bold text-blue-900">
                        +{potentialImpact.twentyYearImpact.toLocaleString()}$
                      </div>
                    </div>
                  </div>
                </div>

                {potentialImpact.improvementBps > 50 && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Opportunité significative détectée!</strong> Votre allocation actuelle pourrait 
                      être optimisée pour générer {potentialImpact.improvementBps} points de base supplémentaires.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recommandations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Recommandations d'Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Rééquilibrage Graduel</h4>
                    <p className="text-sm text-gray-600">
                      Effectuez le rééquilibrage sur 3-6 mois pour minimiser l'impact des fluctuations du marché.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Révision Annuelle</h4>
                    <p className="text-sm text-gray-600">
                      Révisez votre allocation chaque année ou lors de changements majeurs de situation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Considérations Fiscales</h4>
                    <p className="text-sm text-gray-600">
                      Tenez compte des implications fiscales lors du rééquilibrage, privilégiez les comptes enregistrés.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default OptimalAllocationModule;
