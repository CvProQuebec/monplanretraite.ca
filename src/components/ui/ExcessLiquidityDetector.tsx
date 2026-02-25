import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Badge } from './badge';
import { Alert, AlertDescription } from './alert';
import { Progress } from './progress';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Calculator,
  Target,
  Shield,
  Zap,
  PiggyBank,
  BarChart3
} from 'lucide-react';

interface ExcessLiquidityDetectorProps {
  userPlan: 'free' | 'professional' | 'expert';
}

interface LiquidityData {
  monthlyExpenses: number;
  emergencyFundMonths: number;
  cashSavings: number;
  shortTermGoals: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  timeHorizon: number;
}

interface LiquidityAnalysis {
  recommendedCash: number;
  excessLiquidity: number;
  opportunityCost: number;
  potentialGains: number;
  recommendations: string[];
}

export const ExcessLiquidityDetector: React.FC<ExcessLiquidityDetectorProps> = ({ userPlan }) => {
  const [liquidityData, setLiquidityData] = useState<LiquidityData>({
    monthlyExpenses: 4000,
    emergencyFundMonths: 6,
    cashSavings: 50000,
    shortTermGoals: 10000,
    riskTolerance: 'moderate',
    timeHorizon: 10
  });

  const [analysis, setAnalysis] = useState<LiquidityAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Calcul de l'analyse de liquidité excessive
  const analyzeLiquidity = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const { monthlyExpenses, emergencyFundMonths, cashSavings, shortTermGoals, riskTolerance, timeHorizon } = liquidityData;
      
      // Calcul du fonds d'urgence recommandé
      let emergencyFund = monthlyExpenses * emergencyFundMonths;
      
      // Ajustement selon la tolérance au risque
      if (riskTolerance === 'conservative') emergencyFund *= 1.2;
      else if (riskTolerance === 'aggressive') emergencyFund *= 0.8;
      
      // Liquidités recommandées totales
      const recommendedCash = emergencyFund + shortTermGoals;
      
      // Liquidités excessives
      const excessLiquidity = Math.max(0, cashSavings - recommendedCash);
      
      // Coût d'opportunité (différence entre rendement potentiel et taux d'épargne)
      const savingsRate = 0.015; // 1.5% pour épargne
      const investmentRate = riskTolerance === 'conservative' ? 0.05 : 
                            riskTolerance === 'moderate' ? 0.07 : 0.09;
      
      const opportunityCost = excessLiquidity * (investmentRate - savingsRate);
      const potentialGains = opportunityCost * timeHorizon * 1.5; // Effet composé approximatif
      
      // Recommandations
      const recommendations: string[] = [];
      
      if (excessLiquidity > 10000) {
        recommendations.push("Considérez investir l'excédent de liquidités dans un portefeuille diversifié");
      }
      
      if (excessLiquidity > monthlyExpenses * 12) {
        recommendations.push("Vous avez plus d'un an de dépenses en liquidités - optimisation recommandée");
      }
      
      if (opportunityCost > 1000) {
        recommendations.push("Le coût d'opportunité annuel dépasse 1000$ - action recommandée");
      }
      
      if (excessLiquidity > 0) {
        recommendations.push("Utilisez une approche par paliers pour investir graduellement");
        recommendations.push("Considérez des placements à court terme pour une partie des liquidités");
      }
      
      if (recommendations.length === 0) {
        recommendations.push("Votre niveau de liquidités semble approprié pour votre situation");
      }
      
      const analysisResult: LiquidityAnalysis = {
        recommendedCash,
        excessLiquidity,
        opportunityCost,
        potentialGains,
        recommendations
      };
      
      setAnalysis(analysisResult);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getLiquidityStatus = () => {
    if (!analysis) return null;
    
    const ratio = liquidityData.cashSavings / analysis.recommendedCash;
    
    if (ratio < 0.8) return { status: 'low', color: 'red', message: 'Liquidités insuffisantes' };
    if (ratio < 1.2) return { status: 'optimal', color: 'green', message: 'Niveau optimal' };
    if (ratio < 2) return { status: 'high', color: 'yellow', message: 'Liquidités élevées' };
    return { status: 'excessive', color: 'orange', message: 'Liquidités excessives' };
  };

  const liquidityStatus = getLiquidityStatus();

  if (userPlan === 'free') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-mpr-interactive to-cyan-500 rounded-full flex items-center justify-center mb-4">
            <PiggyBank className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Détecteur de Liquidités Excessives
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Optimisez vos liquidités et maximisez vos rendements
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Fonctionnalité Premium
            </h3>
            <p className="text-gray-600 mb-6">
              L'analyse des liquidités excessives est disponible avec les plans Professionnel et Expert.
            </p>
            <div className="bg-mpr-interactive-lt border border-mpr-border rounded-lg p-4 mb-6">
              <p className="text-sm text-mpr-navy">
                <strong>Économies potentielles:</strong> Jusqu'à 5000$+ par année en coût d'opportunité évité
              </p>
            </div>
            <Button className="bg-gradient-to-r from-mpr-interactive to-purple-600 hover:from-mpr-navy-mid hover:to-purple-700">
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
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-mpr-interactive to-cyan-500 rounded-full flex items-center justify-center mb-4">
            <PiggyBank className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Détecteur de Liquidités Excessives
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Identifiez et optimisez vos liquidités pour maximiser vos rendements
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Formulaire de données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Vos Données Financières
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="monthlyExpenses">Dépenses mensuelles ($)</Label>
              <Input
                id="monthlyExpenses"
                type="number"
                value={liquidityData.monthlyExpenses}
                onChange={(e) => setLiquidityData(prev => ({
                  ...prev,
                  monthlyExpenses: parseInt(e.target.value) || 0
                }))}
                min="0"
                step="100"
              />
            </div>
            
            <div>
              <Label htmlFor="emergencyFundMonths">Fonds d'urgence (mois)</Label>
              <Input
                id="emergencyFundMonths"
                type="number"
                value={liquidityData.emergencyFundMonths}
                onChange={(e) => setLiquidityData(prev => ({
                  ...prev,
                  emergencyFundMonths: parseInt(e.target.value) || 6
                }))}
                min="3"
                max="12"
              />
            </div>
            
            <div>
              <Label htmlFor="cashSavings">Liquidités actuelles ($)</Label>
              <Input
                id="cashSavings"
                type="number"
                value={liquidityData.cashSavings}
                onChange={(e) => setLiquidityData(prev => ({
                  ...prev,
                  cashSavings: parseInt(e.target.value) || 0
                }))}
                min="0"
                step="1000"
              />
            </div>
            
            <div>
              <Label htmlFor="shortTermGoals">Objectifs court terme ($)</Label>
              <Input
                id="shortTermGoals"
                type="number"
                value={liquidityData.shortTermGoals}
                onChange={(e) => setLiquidityData(prev => ({
                  ...prev,
                  shortTermGoals: parseInt(e.target.value) || 0
                }))}
                min="0"
                step="1000"
              />
            </div>
            
            <div>
              <Label htmlFor="riskTolerance">Tolérance au risque</Label>
              <select
                id="riskTolerance"
                title="Sélectionnez votre tolérance au risque"
                value={liquidityData.riskTolerance}
                onChange={(e) => setLiquidityData(prev => ({
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
            
            <div>
              <Label htmlFor="timeHorizon">Horizon de placement (années)</Label>
              <Input
                id="timeHorizon"
                type="number"
                value={liquidityData.timeHorizon}
                onChange={(e) => setLiquidityData(prev => ({
                  ...prev,
                  timeHorizon: parseInt(e.target.value) || 10
                }))}
                min="1"
                max="30"
              />
            </div>
          </div>

          <Button 
            onClick={analyzeLiquidity}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-mpr-interactive to-cyan-500 hover:from-mpr-interactive hover:to-cyan-600"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyse en cours...
              </>
            ) : (
              <>
                <PiggyBank className="w-4 h-4 mr-2" />
                Analyser les Liquidités
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultats de l'analyse */}
      {analysis && (
        <>
          {/* Statut des liquidités */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analyse des Liquidités
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {analysis.recommendedCash.toLocaleString()}$
                  </div>
                  <div className="text-sm text-gray-600">Liquidités Recommandées</div>
                </div>
                
                <div className="text-center p-4 bg-mpr-interactive-lt rounded-lg">
                  <div className="text-2xl font-bold text-mpr-interactive">
                    {liquidityData.cashSavings.toLocaleString()}$
                  </div>
                  <div className="text-sm text-gray-600">Liquidités Actuelles</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${
                  analysis.excessLiquidity > 0 ? 'bg-orange-50' : 'bg-green-50'
                }`}>
                  <div className={`text-2xl font-bold ${
                    analysis.excessLiquidity > 0 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {analysis.excessLiquidity.toLocaleString()}$
                  </div>
                  <div className="text-sm text-gray-600">Liquidités Excessives</div>
                </div>
              </div>

              {liquidityStatus && (
                <div className="flex items-center justify-center mb-6">
                  <Badge 
                    variant={liquidityStatus.status === 'optimal' ? 'default' : 'secondary'}
                    className={`px-4 py-2 text-sm ${
                      liquidityStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                      liquidityStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      liquidityStatus.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {liquidityStatus.message}
                  </Badge>
                </div>
              )}

              {/* Barre de progression */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Ratio de liquidités</span>
                  <span>{((liquidityData.cashSavings / analysis.recommendedCash) * 100).toFixed(0)}%</span>
                </div>
                <Progress 
                  value={Math.min(200, (liquidityData.cashSavings / analysis.recommendedCash) * 100)} 
                  className="h-3"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Insuffisant</span>
                  <span>Optimal</span>
                  <span>Excessif</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coût d'opportunité */}
          {analysis.excessLiquidity > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Coût d'Opportunité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Coût annuel:</span>
                      <span className="font-semibold text-red-600">
                        -{analysis.opportunityCost.toLocaleString()}$
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Gains potentiels ({liquidityData.timeHorizon} ans):</span>
                      <span className="font-semibold text-green-600">
                        +{analysis.potentialGains.toLocaleString()}$
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-green-50 border rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Impact total sur {liquidityData.timeHorizon} ans</div>
                      <div className="text-2xl font-bold text-green-600">
                        +{analysis.potentialGains.toLocaleString()}$
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        En investissant l'excédent de liquidités
                      </div>
                    </div>
                  </div>
                </div>

                {analysis.opportunityCost > 2000 && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Coût d'opportunité élevé détecté!</strong> Vous pourriez économiser 
                      {analysis.opportunityCost.toLocaleString()}$ par année en optimisant vos liquidités.
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
                <Target className="w-5 h-5" />
                Recommandations Personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-mpr-interactive rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>

              {analysis.excessLiquidity > 0 && (
                <div className="mt-6 p-4 bg-mpr-interactive-lt border border-mpr-border rounded-lg">
                  <h4 className="font-semibold text-mpr-navy mb-2">Plan d'Action Suggéré:</h4>
                  <div className="space-y-2 text-sm text-mpr-navy">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Conservez {analysis.recommendedCash.toLocaleString()}$ en liquidités</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span>Investissez {analysis.excessLiquidity.toLocaleString()}$ graduellement sur 3-6 mois</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Économisez {analysis.opportunityCost.toLocaleString()}$ par année en coût d'opportunité</span>
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

export default ExcessLiquidityDetector;
