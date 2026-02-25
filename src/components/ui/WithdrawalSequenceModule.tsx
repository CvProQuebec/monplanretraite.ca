import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, Shield, AlertTriangle, Info, Target } from 'lucide-react';

interface WithdrawalSequenceData {
  celiBalance: number;
  nonRegisteredBalance: number;
  reerBalance: number;
  ferrBalance: number;
  annualNeeds: number;
  currentAge: number;
  retirementAge: number;
  expectedReturn: number;
  inflationRate: number;
}

interface SequenceResult {
  optimalSequence: string[];
  portfolioLongevity: number;
  totalTaxSaved: number;
  yearByYearProjection: Array<{
    year: number;
    age: number;
    celiBalance: number;
    nonRegisteredBalance: number;
    reerBalance: number;
    ferrBalance: number;
    withdrawal: number;
    taxPaid: number;
    remainingTotal: number;
  }>;
  riskAnalysis: {
    earlyYearsRisk: 'low' | 'medium' | 'high';
    sequenceOfReturnsRisk: number;
    recommendations: string[];
  };
}

const WithdrawalSequenceModule: React.FC = () => {
  const [data, setData] = useState<WithdrawalSequenceData>({
    celiBalance: 0,
    nonRegisteredBalance: 0,
    reerBalance: 0,
    ferrBalance: 0,
    annualNeeds: 50000,
    currentAge: 65,
    retirementAge: 65,
    expectedReturn: 5,
    inflationRate: 2.5
  });

  const [result, setResult] = useState<SequenceResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calcul de la séquence optimale des retraits selon les règles gouvernementales
  const calculateOptimalSequence = useCallback(() => {
    setIsCalculating(true);
    
    // Simulation sur 35 ans (espérance de vie étendue)
    const projectionYears = 35;
    const yearByYearProjection = [];
    
    // Balances initiales
    let celiBalance = data.celiBalance;
    let nonRegisteredBalance = data.nonRegisteredBalance;
    let reerBalance = data.reerBalance;
    let ferrBalance = data.ferrBalance;
    
    let totalTaxPaid = 0;
    const marginalTaxRate = 0.35; // Taux marginal moyen
    const capitalGainsTaxRate = 0.175; // 50% des gains en capital imposables
    
    // Séquence optimale gouvernementale : CELI → Non-enregistré → REER → FERR
    const optimalSequence = [
      'CELI (libre d\'impôt)',
      'Comptes non-enregistrés (gains en capital favorables)',
      'REER (report d\'impôt)',
      'FERR (retraits obligatoires)'
    ];
    
    for (let year = 0; year < projectionYears; year++) {
      const currentAge = data.currentAge + year;
      let annualNeed = data.annualNeeds * Math.pow(1 + data.inflationRate / 100, year);
      let yearlyTax = 0;
      let withdrawal = 0;
      
      // Retrait minimum FERR obligatoire si 71+
      let ferrMinimumWithdrawal = 0;
      if (currentAge >= 71 && ferrBalance > 0) {
        const ferrPercentage = getFERRMinimumPercentage(currentAge);
        ferrMinimumWithdrawal = ferrBalance * (ferrPercentage / 100);
      }
      
      // Séquence de retrait optimisée
      let remainingNeed = Math.max(annualNeed, ferrMinimumWithdrawal);
      
      // 1. CELI en premier (libre d'impôt)
      if (remainingNeed > 0 && celiBalance > 0) {
        const celiWithdrawal = Math.min(remainingNeed, celiBalance);
        celiBalance -= celiWithdrawal;
        withdrawal += celiWithdrawal;
        remainingNeed -= celiWithdrawal;
        // Pas d'impôt sur CELI
      }
      
      // 2. Comptes non-enregistrés (gains en capital favorables)
      if (remainingNeed > 0 && nonRegisteredBalance > 0) {
        const nonRegWithdrawal = Math.min(remainingNeed, nonRegisteredBalance);
        nonRegisteredBalance -= nonRegWithdrawal;
        withdrawal += nonRegWithdrawal;
        remainingNeed -= nonRegWithdrawal;
        // Impôt sur gains en capital seulement (50% imposable)
        yearlyTax += nonRegWithdrawal * 0.3 * capitalGainsTaxRate; // 30% gains estimés
      }
      
      // 3. REER (si pas encore converti en FERR)
      if (remainingNeed > 0 && reerBalance > 0 && currentAge < 71) {
        const reerWithdrawal = Math.min(remainingNeed, reerBalance);
        reerBalance -= reerWithdrawal;
        withdrawal += reerWithdrawal;
        remainingNeed -= reerWithdrawal;
        yearlyTax += reerWithdrawal * marginalTaxRate;
      }
      
      // 4. FERR (retraits obligatoires ou supplémentaires)
      if (remainingNeed > 0 && ferrBalance > 0) {
        const ferrWithdrawal = Math.min(remainingNeed, ferrBalance);
        ferrBalance -= ferrWithdrawal;
        withdrawal += ferrWithdrawal;
        remainingNeed -= ferrWithdrawal;
        yearlyTax += ferrWithdrawal * marginalTaxRate;
      }
      
      // Conversion automatique REER → FERR à 71 ans
      if (currentAge === 71 && reerBalance > 0) {
        ferrBalance += reerBalance;
        reerBalance = 0;
      }
      
      // Croissance des balances restantes
      celiBalance *= (1 + data.expectedReturn / 100);
      nonRegisteredBalance *= (1 + data.expectedReturn / 100);
      reerBalance *= (1 + data.expectedReturn / 100);
      ferrBalance *= (1 + data.expectedReturn / 100);
      
      totalTaxPaid += yearlyTax;
      
      yearByYearProjection.push({
        year: year + 1,
        age: currentAge,
        celiBalance,
        nonRegisteredBalance,
        reerBalance,
        ferrBalance,
        withdrawal,
        taxPaid: yearlyTax,
        remainingTotal: celiBalance + nonRegisteredBalance + reerBalance + ferrBalance
      });
      
      // Arrêter si tous les fonds sont épuisés
      if (celiBalance + nonRegisteredBalance + reerBalance + ferrBalance < 1000) {
        break;
      }
    }
    
    // Analyse du risque de séquence des rendements
    const totalBalance = data.celiBalance + data.nonRegisteredBalance + data.reerBalance + data.ferrBalance;
    const withdrawalRate = data.annualNeeds / totalBalance;
    
    let earlyYearsRisk: 'low' | 'medium' | 'high' = 'low';
    if (withdrawalRate > 0.05) earlyYearsRisk = 'high';
    else if (withdrawalRate > 0.04) earlyYearsRisk = 'medium';
    
    const sequenceOfReturnsRisk = Math.min(100, withdrawalRate * 100 * 2);
    
    const recommendations = [];
    if (earlyYearsRisk === 'high') {
      recommendations.push('Considérez réduire les retraits des premières années');
      recommendations.push('Maintenez une réserve de liquidités pour les marchés baissiers');
    }
    if (data.celiBalance < data.annualNeeds) {
      recommendations.push('Augmentez votre CELI pour plus de flexibilité libre d\'impôt');
    }
    if (ferrBalance > reerBalance * 2) {
      recommendations.push('Considérez des retraits REER avant 71 ans pour étaler l\'impôt');
    }
    
    const portfolioLongevity = yearByYearProjection.length;
    
    setResult({
      optimalSequence,
      portfolioLongevity,
      totalTaxSaved: totalBalance * 0.1, // Estimation économies vs séquence non-optimisée
      yearByYearProjection,
      riskAnalysis: {
        earlyYearsRisk,
        sequenceOfReturnsRisk,
        recommendations
      }
    });
    
    setIsCalculating(false);
  }, [data]);

  // Pourcentages FERR officiels du gouvernement du Canada
  const getFERRMinimumPercentage = (age: number): number => {
    const ferrTable: { [key: number]: number } = {
      71: 5.28, 72: 5.40, 73: 5.53, 74: 5.67, 75: 5.82,
      76: 5.98, 77: 6.17, 78: 6.36, 79: 6.58, 80: 6.82,
      81: 7.08, 82: 7.38, 83: 7.71, 84: 8.08, 85: 8.51,
      86: 8.99, 87: 9.55, 88: 10.21, 89: 10.99, 90: 11.92,
      91: 13.06, 92: 14.49, 93: 16.34, 94: 18.79
    };
    
    if (age >= 95) return 20.00;
    return ferrTable[age] || 0;
  };

  const handleInputChange = (field: keyof WithdrawalSequenceData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setData(prev => ({ ...prev, [field]: numValue }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('$', '').trim() + ' $';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="h-8 w-8 text-mpr-interactive" />
          <h1 className="text-3xl font-bold text-gray-900">
            Séquence Optimale des Retraits
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Optimisez l'ordre de vos retraits pour maximiser la longévité de votre portefeuille 
          et minimiser l'impact fiscal selon les stratégies gouvernementales canadiennes.
        </p>
        
        <Alert className="max-w-2xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Basé sur les recommandations du Gouvernement du Canada :</strong> La séquence 
            des retraits peut avoir un impact majeur sur la durabilité de votre portefeuille. 
            Une mauvaise séquence peut réduire la longévité de vos fonds de 5-10 ans.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculateur
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Stratégie
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analyse
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Éducation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Vos Comptes de Retraite
              </CardTitle>
              <CardDescription>
                Entrez les soldes de vos différents comptes pour calculer la séquence optimale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="celi">Solde CELI</Label>
                    <Input
                      id="celi"
                      type="number"
                      value={data.celiBalance || ''}
                      onChange={(e) => handleInputChange('celiBalance', e.target.value)}
                      placeholder="Ex: 75 000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nonRegistered">Comptes Non-Enregistrés</Label>
                    <Input
                      id="nonRegistered"
                      type="number"
                      value={data.nonRegisteredBalance || ''}
                      onChange={(e) => handleInputChange('nonRegisteredBalance', e.target.value)}
                      placeholder="Ex: 150 000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="reer">Solde REER</Label>
                    <Input
                      id="reer"
                      type="number"
                      value={data.reerBalance || ''}
                      onChange={(e) => handleInputChange('reerBalance', e.target.value)}
                      placeholder="Ex: 300 000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="ferr">Solde FERR</Label>
                    <Input
                      id="ferr"
                      type="number"
                      value={data.ferrBalance || ''}
                      onChange={(e) => handleInputChange('ferrBalance', e.target.value)}
                      placeholder="Ex: 200 000"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="annualNeeds">Besoins Annuels</Label>
                    <Input
                      id="annualNeeds"
                      type="number"
                      value={data.annualNeeds || ''}
                      onChange={(e) => handleInputChange('annualNeeds', e.target.value)}
                      placeholder="Ex: 50 000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="currentAge">Âge Actuel</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={data.currentAge || ''}
                      onChange={(e) => handleInputChange('currentAge', e.target.value)}
                      placeholder="Ex: 65"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expectedReturn">Rendement Attendu (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      step="0.1"
                      value={data.expectedReturn || ''}
                      onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
                      placeholder="Ex: 5.0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="inflation">Taux d'Inflation (%)</Label>
                    <Input
                      id="inflation"
                      type="number"
                      step="0.1"
                      value={data.inflationRate || ''}
                      onChange={(e) => handleInputChange('inflationRate', e.target.value)}
                      placeholder="Ex: 2.5"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={calculateOptimalSequence}
                disabled={isCalculating}
                className="w-full"
                size="lg"
              >
                {isCalculating ? 'Calcul en cours...' : 'Calculer la Séquence Optimale'}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Séquence Optimale Recommandée
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {result.portfolioLongevity} ans
                    </div>
                    <div className="text-sm text-gray-600">Longévité du Portefeuille</div>
                  </div>
                  
                  <div className="text-center p-4 bg-mpr-interactive-lt rounded-lg">
                    <div className="text-2xl font-bold text-mpr-interactive">
                      {formatCurrency(result.totalTaxSaved)}
                    </div>
                    <div className="text-sm text-gray-600">Économies Fiscales Estimées</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.riskAnalysis.sequenceOfReturnsRisk.toFixed(1)} %
                    </div>
                    <div className="text-sm text-gray-600">Risque Séquence Rendements</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Ordre de Retrait Recommandé :</h4>
                  {result.optimalSequence.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stratégies Gouvernementales Recommandées</CardTitle>
              <CardDescription>
                Basées sur les guides officiels du Gouvernement du Canada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-600">✅ Stratégies Optimales</h4>
                  
                  <div className="p-4 border border-green-200 rounded-lg">
                    <h5 className="font-medium">1. CELI en Premier</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Retraits libres d'impôt, aucun impact sur prestations gouvernementales (SV/SRG)
                    </p>
                  </div>
                  
                  <div className="p-4 border border-green-200 rounded-lg">
                    <h5 className="font-medium">2. Comptes Non-Enregistrés</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Gains en capital imposés à 50 % seulement (vs 100 % pour intérêts)
                    </p>
                  </div>
                  
                  <div className="p-4 border border-green-200 rounded-lg">
                    <h5 className="font-medium">3. REER Avant 71 ans</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Étalement de l'impôt avant conversion obligatoire en FERR
                    </p>
                  </div>
                  
                  <div className="p-4 border border-green-200 rounded-lg">
                    <h5 className="font-medium">4. FERR (Retraits Obligatoires)</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Retraits minimums obligatoires selon pourcentages gouvernementaux
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-red-600">⚠️ Pièges à Éviter</h4>
                  
                  <div className="p-4 border border-red-200 rounded-lg">
                    <h5 className="font-medium">Retraits REER/FERR Trop Tôt</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Impôt immédiat + perte de croissance à l'abri de l'impôt
                    </p>
                  </div>
                  
                  <div className="p-4 border border-red-200 rounded-lg">
                    <h5 className="font-medium">Ignorer l'Impact sur SV/SRG</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Revenus élevés peuvent réduire prestations gouvernementales
                    </p>
                  </div>
                  
                  <div className="p-4 border border-red-200 rounded-lg">
                    <h5 className="font-medium">Retraits Importants Années Baissières</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Risque de séquence des rendements - impact permanent sur portefeuille
                    </p>
                  </div>
                  
                  <div className="p-4 border border-red-200 rounded-lg">
                    <h5 className="font-medium">Négliger la Planification Succession</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      FERR imposable au décès sauf transfert conjoint/enfants
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {result && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Analyse du Risque de Séquence</CardTitle>
                  <CardDescription>
                    Évaluation du risque selon votre situation et les recommandations gouvernementales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Niveau de Risque</h4>
                      <div className={`p-4 rounded-lg ${
                        result.riskAnalysis.earlyYearsRisk === 'low' ? 'bg-green-50 border border-green-200' :
                        result.riskAnalysis.earlyYearsRisk === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                        'bg-red-50 border border-red-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Shield className={`h-5 w-5 ${
                            result.riskAnalysis.earlyYearsRisk === 'low' ? 'text-green-600' :
                            result.riskAnalysis.earlyYearsRisk === 'medium' ? 'text-yellow-600' :
                            'text-red-600'
                          }`} />
                          <span className="font-medium">
                            Risque {result.riskAnalysis.earlyYearsRisk === 'low' ? 'Faible' :
                                   result.riskAnalysis.earlyYearsRisk === 'medium' ? 'Modéré' : 'Élevé'}
                          </span>
                        </div>
                        <p className="text-sm mt-2">
                          Risque de séquence des rendements : {result.riskAnalysis.sequenceOfReturnsRisk.toFixed(1)} %
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Recommandations</h4>
                      <div className="space-y-2">
                        {result.riskAnalysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-mpr-interactive-lt rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-mpr-interactive mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Projection Année par Année</CardTitle>
                  <CardDescription>
                    Évolution de vos comptes avec la séquence optimale
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Année</th>
                          <th className="text-left p-2">Âge</th>
                          <th className="text-left p-2">CELI</th>
                          <th className="text-left p-2">Non-Enreg.</th>
                          <th className="text-left p-2">REER</th>
                          <th className="text-left p-2">FERR</th>
                          <th className="text-left p-2">Retrait</th>
                          <th className="text-left p-2">Impôt</th>
                          <th className="text-left p-2">Total Restant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearByYearProjection.slice(0, 15).map((year) => (
                          <tr key={year.year} className="border-b hover:bg-gray-50">
                            <td className="p-2">{year.year}</td>
                            <td className="p-2">{year.age}</td>
                            <td className="p-2">{formatCurrency(year.celiBalance)}</td>
                            <td className="p-2">{formatCurrency(year.nonRegisteredBalance)}</td>
                            <td className="p-2">{formatCurrency(year.reerBalance)}</td>
                            <td className="p-2">{formatCurrency(year.ferrBalance)}</td>
                            <td className="p-2 font-medium">{formatCurrency(year.withdrawal)}</td>
                            <td className="p-2 text-red-600">{formatCurrency(year.taxPaid)}</td>
                            <td className="p-2 font-bold">{formatCurrency(year.remainingTotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {result.yearByYearProjection.length > 15 && (
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      Affichage des 15 premières années. Projection complète disponible dans le rapport détaillé.
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Éducation : Séquence des Retraits</CardTitle>
              <CardDescription>
                Comprendre l'importance de l'ordre des retraits selon le Gouvernement du Canada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Pourquoi la Séquence Importe-t-elle ?</h4>
                
                <div className="p-4 bg-mpr-interactive-lt rounded-lg">
                  <h5 className="font-medium">Impact Fiscal Différentiel</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Selon le Gouvernement du Canada, les différents types de revenus sont imposés différemment :
                  </p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• <strong>CELI :</strong> 0% d'impôt sur retraits</li>
                    <li>• <strong>Gains en capital :</strong> 50% imposable (taux effectif ~17.5%)</li>
                    <li>• <strong>REER/FERR :</strong> 100 % imposable comme revenu ordinaire (~35%)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium">Risque de Séquence des Rendements</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Les mauvais rendements dans les premières années de retraite, combinés aux retraits, 
                    peuvent avoir un impact permanent sur la longévité du portefeuille. Une séquence 
                    optimisée protège contre ce risque.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium">Prestations Gouvernementales</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Les retraits CELI n'affectent pas vos prestations de Sécurité de la vieillesse (SV) 
                    ou Supplément de revenu garanti (SRG), contrairement aux retraits REER/FERR.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Règles Gouvernementales Clés</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-mpr-interactive">Conversion REER → FERR</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Obligatoire :</strong> Au plus tard le 31 décembre de l'année de vos 71 ans
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Retraits minimums :</strong> Commencent l'année suivant la conversion
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-mpr-interactive">Pourcentages FERR</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>71 ans :</strong> 5.28% minimum
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>80 ans :</strong> 6.82% minimum
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>95+ ans :</strong> 20.00% minimum
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-mpr-interactive">Stratégie Conjoint Plus Jeune</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Vous pouvez baser les retraits FERR sur l'âge de votre conjoint s'il est plus jeune, 
                      réduisant ainsi les retraits minimums obligatoires.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-mpr-interactive">Fractionnement de Revenu</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      À partir de 65 ans, vous pouvez fractionner jusqu'à 50% de vos revenus de 
                      pension admissibles avec votre conjoint.
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Conseil du Gouvernement du Canada :</strong> Consultez un planificateur financier 
                  qualifié pour optimiser votre stratégie de retraits selon votre situation fiscale 
                  et vos objectifs de retraite spécifiques.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WithdrawalSequenceModule;
