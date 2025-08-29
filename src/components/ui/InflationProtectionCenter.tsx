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
  Shield, 
  AlertTriangle,
  CheckCircle,
  Calculator,
  Target,
  Zap,
  BarChart3,
  PieChart
} from 'lucide-react';

interface InflationProtectionCenterProps {
  userPlan: 'free' | 'professional' | 'expert';
}

interface InflationData {
  currentAge: number;
  retirementAge: number;
  currentIncome: number;
  expectedInflation: number;
  currentAssets: number;
  monthlyExpenses: number;
  inflationProtectedAssets: number;
}

interface InflationAnalysis {
  inflationImpact: number;
  realPurchasingPower: number;
  protectionGap: number;
  recommendedProtection: number;
  strategies: InflationStrategy[];
  projections: YearlyProjection[];
}

interface InflationStrategy {
  name: string;
  description: string;
  effectiveness: number;
  riskLevel: 'low' | 'medium' | 'high';
  allocation: number;
}

interface YearlyProjection {
  year: number;
  nominalValue: number;
  realValue: number;
  inflationImpact: number;
}

export const InflationProtectionCenter: React.FC<InflationProtectionCenterProps> = ({ userPlan }) => {
  const [inflationData, setInflationData] = useState<InflationData>({
    currentAge: 55,
    retirementAge: 65,
    currentIncome: 80000,
    expectedInflation: 2.5,
    currentAssets: 500000,
    monthlyExpenses: 5000,
    inflationProtectedAssets: 100000
  });

  const [analysis, setAnalysis] = useState<InflationAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Calcul de l'analyse de protection contre l'inflation
  const analyzeInflationProtection = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const { currentAge, retirementAge, currentIncome, expectedInflation, currentAssets, monthlyExpenses, inflationProtectedAssets } = inflationData;
      
      const yearsToRetirement = retirementAge - currentAge;
      const retirementYears = 25; // Espérance de vie en retraite
      
      // Impact de l'inflation sur le pouvoir d'achat
      const inflationFactor = Math.pow(1 + expectedInflation / 100, yearsToRetirement);
      const inflationImpact = (inflationFactor - 1) * 100;
      
      // Pouvoir d'achat réel à la retraite
      const realPurchasingPower = currentIncome / inflationFactor;
      
      // Calcul du gap de protection
      const totalRetirementNeeds = monthlyExpenses * 12 * retirementYears;
      const inflationAdjustedNeeds = totalRetirementNeeds * inflationFactor;
      const protectionGap = Math.max(0, inflationAdjustedNeeds - currentAssets);
      
      // Protection recommandée (60-80% des actifs selon l'âge)
      const protectionRatio = currentAge < 50 ? 0.8 : currentAge < 60 ? 0.7 : 0.6;
      const recommendedProtection = currentAssets * protectionRatio;
      
      // Stratégies de protection contre l'inflation
      const strategies: InflationStrategy[] = [
        {
          name: "Actions de croissance",
          description: "Actions d'entreprises avec pouvoir de fixation des prix",
          effectiveness: 85,
          riskLevel: 'medium',
          allocation: 40
        },
        {
          name: "Obligations indexées (ORI)",
          description: "Obligations du gouvernement indexées à l'inflation",
          effectiveness: 95,
          riskLevel: 'low',
          allocation: 25
        },
        {
          name: "Immobilier (REITs)",
          description: "Fiducies de placement immobilier",
          effectiveness: 75,
          riskLevel: 'medium',
          allocation: 15
        },
        {
          name: "Matières premières",
          description: "Or, pétrole, produits agricoles",
          effectiveness: 70,
          riskLevel: 'high',
          allocation: 10
        },
        {
          name: "Actions de services publics",
          description: "Entreprises de services essentiels",
          effectiveness: 65,
          riskLevel: 'low',
          allocation: 10
        }
      ];
      
      // Projections annuelles
      const projections: YearlyProjection[] = [];
      for (let i = 0; i <= retirementYears; i++) {
        const year = currentAge + yearsToRetirement + i;
        const inflationFactor = Math.pow(1 + expectedInflation / 100, yearsToRetirement + i);
        const nominalValue = currentAssets * Math.pow(1.06, yearsToRetirement + i); // 6% rendement nominal
        const realValue = nominalValue / inflationFactor;
        const inflationImpactYear = (inflationFactor - 1) * currentAssets;
        
        projections.push({
          year,
          nominalValue,
          realValue,
          inflationImpact: inflationImpactYear
        });
      }
      
      const analysisResult: InflationAnalysis = {
        inflationImpact,
        realPurchasingPower,
        protectionGap,
        recommendedProtection,
        strategies,
        projections: projections.slice(0, 11) // Première décennie
      };
      
      setAnalysis(analysisResult);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getProtectionLevel = () => {
    if (!analysis) return null;
    
    const protectionRatio = inflationData.inflationProtectedAssets / analysis.recommendedProtection;
    
    if (protectionRatio < 0.4) return { level: 'faible', color: 'red', message: 'Protection insuffisante' };
    if (protectionRatio < 0.7) return { level: 'modérée', color: 'yellow', message: 'Protection modérée' };
    if (protectionRatio < 1) return { level: 'bonne', color: 'blue', message: 'Bonne protection' };
    return { level: 'excellente', color: 'green', message: 'Protection excellente' };
  };

  const protectionLevel = getProtectionLevel();

  if (userPlan === 'free') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Centre de Protection contre l'Inflation
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Protégez votre pouvoir d'achat contre l'érosion monétaire
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Fonctionnalité Premium
            </h3>
            <p className="text-gray-600 mb-6">
              L'analyse de protection contre l'inflation est disponible avec les plans Professionnel et Expert.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>Protection essentielle:</strong> L'inflation peut réduire votre pouvoir d'achat de 50%+ sur 25 ans
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
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Centre de Protection contre l'Inflation
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Analysez et protégez votre patrimoine contre l'érosion du pouvoir d'achat
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Formulaire de données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Vos Paramètres Financiers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="currentAge">Âge actuel</Label>
              <Input
                id="currentAge"
                type="number"
                value={inflationData.currentAge}
                onChange={(e) => setInflationData(prev => ({
                  ...prev,
                  currentAge: parseInt(e.target.value) || 55
                }))}
                min="25"
                max="75"
              />
            </div>
            
            <div>
              <Label htmlFor="retirementAge">Âge de retraite</Label>
              <Input
                id="retirementAge"
                type="number"
                value={inflationData.retirementAge}
                onChange={(e) => setInflationData(prev => ({
                  ...prev,
                  retirementAge: parseInt(e.target.value) || 65
                }))}
                min="55"
                max="75"
              />
            </div>
            
            <div>
              <Label htmlFor="currentIncome">Revenu actuel ($)</Label>
              <Input
                id="currentIncome"
                type="number"
                value={inflationData.currentIncome}
                onChange={(e) => setInflationData(prev => ({
                  ...prev,
                  currentIncome: parseInt(e.target.value) || 0
                }))}
                min="0"
                step="5000"
              />
            </div>
            
            <div>
              <Label htmlFor="expectedInflation">Inflation attendue (%)</Label>
              <Input
                id="expectedInflation"
                type="number"
                step="0.1"
                value={inflationData.expectedInflation}
                onChange={(e) => setInflationData(prev => ({
                  ...prev,
                  expectedInflation: parseFloat(e.target.value) || 2.5
                }))}
                min="0"
                max="10"
              />
            </div>
            
            <div>
              <Label htmlFor="currentAssets">Actifs actuels ($)</Label>
              <Input
                id="currentAssets"
                type="number"
                value={inflationData.currentAssets}
                onChange={(e) => setInflationData(prev => ({
                  ...prev,
                  currentAssets: parseInt(e.target.value) || 0
                }))}
                min="0"
                step="10000"
              />
            </div>
            
            <div>
              <Label htmlFor="monthlyExpenses">Dépenses mensuelles ($)</Label>
              <Input
                id="monthlyExpenses"
                type="number"
                value={inflationData.monthlyExpenses}
                onChange={(e) => setInflationData(prev => ({
                  ...prev,
                  monthlyExpenses: parseInt(e.target.value) || 0
                }))}
                min="0"
                step="500"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="inflationProtectedAssets">Actifs protégés contre l'inflation ($)</Label>
              <Input
                id="inflationProtectedAssets"
                type="number"
                value={inflationData.inflationProtectedAssets}
                onChange={(e) => setInflationData(prev => ({
                  ...prev,
                  inflationProtectedAssets: parseInt(e.target.value) || 0
                }))}
                min="0"
                step="5000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Actions, REITs, obligations indexées, matières premières, etc.
              </p>
            </div>
          </div>

          <Button 
            onClick={analyzeInflationProtection}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyse en cours...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Analyser la Protection Inflation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultats de l'analyse */}
      {analysis && (
        <>
          {/* Impact de l'inflation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Impact de l'Inflation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    -{analysis.inflationImpact.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Érosion du Pouvoir d'Achat</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {analysis.realPurchasingPower.toLocaleString()}$
                  </div>
                  <div className="text-sm text-gray-600">Pouvoir d'Achat Réel</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysis.recommendedProtection.toLocaleString()}$
                  </div>
                  <div className="text-sm text-gray-600">Protection Recommandée</div>
                </div>
              </div>

              {protectionLevel && (
                <div className="flex items-center justify-center mb-6">
                  <Badge 
                    className={`px-4 py-2 text-sm ${
                      protectionLevel.color === 'green' ? 'bg-green-100 text-green-800' :
                      protectionLevel.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      protectionLevel.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {protectionLevel.message}
                  </Badge>
                </div>
              )}

              {/* Barre de progression de protection */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Niveau de protection actuel</span>
                  <span>{((inflationData.inflationProtectedAssets / analysis.recommendedProtection) * 100).toFixed(0)}%</span>
                </div>
                <Progress 
                  value={Math.min(100, (inflationData.inflationProtectedAssets / analysis.recommendedProtection) * 100)} 
                  className="h-3"
                />
              </div>

              {analysis.inflationImpact > 30 && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Impact significatif détecté!</strong> L'inflation pourrait réduire votre pouvoir d'achat 
                    de {analysis.inflationImpact.toFixed(1)}% d'ici la retraite.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Stratégies de protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Stratégies de Protection Recommandées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.strategies.map((strategy, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                        <p className="text-sm text-gray-600">{strategy.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{strategy.allocation}%</div>
                        <div className="text-xs text-gray-500">Allocation</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-600">Efficacité:</span>
                          <span className="text-sm font-semibold text-green-600">{strategy.effectiveness}%</span>
                        </div>
                        <Badge 
                          variant="secondary"
                          className={`text-xs ${
                            strategy.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                            strategy.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          Risque {strategy.riskLevel === 'low' ? 'Faible' : strategy.riskLevel === 'medium' ? 'Modéré' : 'Élevé'}
                        </Badge>
                      </div>
                      
                      <Progress value={strategy.effectiveness} className="w-24 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Projections sur 10 ans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.projections.slice(0, 6).map((projection, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">
                      Année {projection.year}
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-blue-600 font-semibold">
                          {projection.nominalValue.toLocaleString()}$
                        </div>
                        <div className="text-xs text-gray-500">Valeur nominale</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-600 font-semibold">
                          {projection.realValue.toLocaleString()}$
                        </div>
                        <div className="text-xs text-gray-500">Valeur réelle</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-600 font-semibold">
                          -{projection.inflationImpact.toLocaleString()}$
                        </div>
                        <div className="text-xs text-gray-500">Impact inflation</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan d'action */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Plan d'Action Recommandé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Diversification Anti-Inflation</h4>
                    <p className="text-sm text-gray-600">
                      Répartissez vos investissements selon les allocations recommandées ci-dessus.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Révision Régulière</h4>
                    <p className="text-sm text-gray-600">
                      Ajustez votre stratégie annuellement selon l'évolution de l'inflation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Protection Graduelle</h4>
                    <p className="text-sm text-gray-600">
                      Augmentez progressivement votre exposition aux actifs protégés contre l'inflation.
                    </p>
                  </div>
                </div>
              </div>

              {analysis.protectionGap > 0 && (
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Gap de Protection Identifié:</h4>
                  <div className="space-y-2 text-sm text-orange-800">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Déficit de protection: {analysis.protectionGap.toLocaleString()}$</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span>Augmentez vos actifs protégés de {((analysis.recommendedProtection - inflationData.inflationProtectedAssets) / 1000).toFixed(0)}k$</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default InflationProtectionCenter;
