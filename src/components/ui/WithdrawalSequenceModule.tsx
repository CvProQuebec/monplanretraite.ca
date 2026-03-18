import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import GuidedPageIntro from '@/components/ui/GuidedPageIntro';
import NextStepPanel from '@/components/ui/NextStepPanel';
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

  // Calcul de la sÃ©quence optimale des retraits selon les rÃ¨gles gouvernementales
  const calculateOptimalSequence = useCallback(() => {
    setIsCalculating(true);
    
    // Simulation sur 35 ans (espÃ©rance de vie Ã©tendue)
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
    
    // SÃ©quence optimale gouvernementale : CELI â†’ Non-enregistrÃ© â†’ REER â†’ FERR
    const optimalSequence = [
      'CELI (libre d\'impÃ´t)',
      'Comptes non-enregistrÃ©s (gains en capital favorables)',
      'REER (report d\'impÃ´t)',
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
      
      // SÃ©quence de retrait optimisÃ©e
      let remainingNeed = Math.max(annualNeed, ferrMinimumWithdrawal);
      
      // 1. CELI en premier (libre d'impÃ´t)
      if (remainingNeed > 0 && celiBalance > 0) {
        const celiWithdrawal = Math.min(remainingNeed, celiBalance);
        celiBalance -= celiWithdrawal;
        withdrawal += celiWithdrawal;
        remainingNeed -= celiWithdrawal;
        // Pas d'impÃ´t sur CELI
      }
      
      // 2. Comptes non-enregistrÃ©s (gains en capital favorables)
      if (remainingNeed > 0 && nonRegisteredBalance > 0) {
        const nonRegWithdrawal = Math.min(remainingNeed, nonRegisteredBalance);
        nonRegisteredBalance -= nonRegWithdrawal;
        withdrawal += nonRegWithdrawal;
        remainingNeed -= nonRegWithdrawal;
        // ImpÃ´t sur gains en capital seulement (50% imposable)
        yearlyTax += nonRegWithdrawal * 0.3 * capitalGainsTaxRate; // 30% gains estimÃ©s
      }
      
      // 3. REER (si pas encore converti en FERR)
      if (remainingNeed > 0 && reerBalance > 0 && currentAge < 71) {
        const reerWithdrawal = Math.min(remainingNeed, reerBalance);
        reerBalance -= reerWithdrawal;
        withdrawal += reerWithdrawal;
        remainingNeed -= reerWithdrawal;
        yearlyTax += reerWithdrawal * marginalTaxRate;
      }
      
      // 4. FERR (retraits obligatoires ou supplÃ©mentaires)
      if (remainingNeed > 0 && ferrBalance > 0) {
        const ferrWithdrawal = Math.min(remainingNeed, ferrBalance);
        ferrBalance -= ferrWithdrawal;
        withdrawal += ferrWithdrawal;
        remainingNeed -= ferrWithdrawal;
        yearlyTax += ferrWithdrawal * marginalTaxRate;
      }
      
      // Conversion automatique REER â†’ FERR Ã  71 ans
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
      
      // ArrÃªter si tous les fonds sont Ã©puisÃ©s
      if (celiBalance + nonRegisteredBalance + reerBalance + ferrBalance < 1000) {
        break;
      }
    }
    
    // Vérifier le risque du risque de sÃ©quence des rendements
    const totalBalance = data.celiBalance + data.nonRegisteredBalance + data.reerBalance + data.ferrBalance;
    const withdrawalRate = data.annualNeeds / totalBalance;
    
    let earlyYearsRisk: 'low' | 'medium' | 'high' = 'low';
    if (withdrawalRate > 0.05) earlyYearsRisk = 'high';
    else if (withdrawalRate > 0.04) earlyYearsRisk = 'medium';
    
    const sequenceOfReturnsRisk = Math.min(100, withdrawalRate * 100 * 2);
    
    const recommendations = [];
    if (earlyYearsRisk === 'high') {
      recommendations.push('ConsidÃ©rez rÃ©duire les retraits des premiÃ¨res annÃ©es');
      recommendations.push('Maintenez une rÃ©serve de liquiditÃ©s pour les marchÃ©s baissiers');
    }
    if (data.celiBalance < data.annualNeeds) {
      recommendations.push('Augmentez votre CELI pour plus de flexibilitÃ© libre d\'impÃ´t');
    }
    if (ferrBalance > reerBalance * 2) {
      recommendations.push('ConsidÃ©rez des retraits REER avant 71 ans pour Ã©taler l\'impÃ´t');
    }
    
    const portfolioLongevity = yearByYearProjection.length;
    
    setResult({
      optimalSequence,
      portfolioLongevity,
      totalTaxSaved: totalBalance * 0.1, // Estimation Ã©conomies vs sÃ©quence non-optimisÃ©e
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
      <GuidedPageIntro
        eyebrow="Ordre des retraits"
        title="DÃ©cider quel compte retirer en premier"
        description="Cette page compare un ordre de retraits entre CELI, placements non enregistrÃ©s, REER et FERR. Le but est de faire durer votre argent plus longtemps tout en rÃ©duisant lâ€™impÃ´t inutile."
        bullets={[
          'Commencez par vos soldes de comptes.',
          'Ajoutez ensuite votre besoin annuel de revenu.',
          'Regardez enfin la sÃ©quence suggÃ©rÃ©e et son effet sur la durÃ©e de votre portefeuille.',
        ]}
        primaryLink={{ label: 'PrÃ©parer mon dossier', href: '/mon-dossier' }}
        secondaryLink={{ label: 'Voir les outils fiscaux', href: '/outils#impots' }}
      />

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            SÃ©quence Optimale des Retraits
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Optimisez l'ordre de vos retraits pour maximiser la longÃ©vitÃ© de votre portefeuille 
          et minimiser l'impact fiscal selon les stratÃ©gies gouvernementales canadiennes.
        </p>
        
        <Alert className="max-w-2xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>BasÃ© sur les recommandations du Gouvernement du Canada :</strong> La sÃ©quence 
            des retraits peut avoir un impact majeur sur la durabilitÃ© de votre portefeuille. 
            Une mauvaise sÃ©quence peut rÃ©duire la longÃ©vitÃ© de vos fonds de 5-10 ans.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Mes chiffres
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Ordre suggéré
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Vérifier le risque
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            À retenir
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
                Entrez vos soldes pour voir dans quel ordre retirer votre argent de façon plus souple et plus fiscale.
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
                    <Label htmlFor="nonRegistered">Comptes Non-EnregistrÃ©s</Label>
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
                    <Label htmlFor="currentAge">Ã‚ge Actuel</Label>
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
                {isCalculating ? 'Calcul en cours...' : 'Calculer la SÃ©quence Optimale'}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Ordre suggéré
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {result.portfolioLongevity} ans
                    </div>
                    <div className="text-sm text-gray-600">LongÃ©vitÃ© du Portefeuille</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(result.totalTaxSaved)}
                    </div>
                    <div className="text-sm text-gray-600">Ã‰conomies Fiscales EstimÃ©es</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.riskAnalysis.sequenceOfReturnsRisk.toFixed(1)} %
                    </div>
                    <div className="text-sm text-gray-600">Risque SÃ©quence Rendements</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Ordre suggéré :</h4>
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
              <CardTitle>Ordre suggéré</CardTitle>
              <CardDescription>
                Repères pratiques pour comprendre quel ordre est souvent le plus avantageux.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-600">Ce qui aide le plus souvent</h4>
                  
                  <div className="p-4 border border-green-200 rounded-lg">
                    <h5 className="font-medium">1. CELI en Premier</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Retraits libres d'impÃ´t, aucun impact sur prestations gouvernementales (SV/SRG)
                    </p>
                  </div>
                  
                  <div className="p-4 border border-green-200 rounded-lg">
                    <h5 className="font-medium">2. Comptes Non-EnregistrÃ©s</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Gains en capital imposÃ©s Ã  50 % seulement (vs 100 % pour intÃ©rÃªts)
                    </p>
                  </div>
                  
                  <div className="p-4 border border-green-200 rounded-lg">
                    <h5 className="font-medium">3. REER Avant 71 ans</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Ã‰talement de l'impÃ´t avant conversion obligatoire en FERR
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
                  <h4 className="font-semibold text-red-600">âš ï¸ PiÃ¨ges Ã  Ã‰viter</h4>
                  
                  <div className="p-4 border border-red-200 rounded-lg">
                    <h5 className="font-medium">Retraits REER/FERR Trop TÃ´t</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      ImpÃ´t immÃ©diat + perte de croissance Ã  l'abri de l'impÃ´t
                    </p>
                  </div>
                  
                  <div className="p-4 border border-red-200 rounded-lg">
                    <h5 className="font-medium">Ignorer l'Impact sur SV/SRG</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Revenus Ã©levÃ©s peuvent rÃ©duire prestations gouvernementales
                    </p>
                  </div>
                  
                  <div className="p-4 border border-red-200 rounded-lg">
                    <h5 className="font-medium">Retraits Importants AnnÃ©es BaissiÃ¨res</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Risque de sÃ©quence des rendements - impact permanent sur portefeuille
                    </p>
                  </div>
                  
                  <div className="p-4 border border-red-200 rounded-lg">
                    <h5 className="font-medium">NÃ©gliger la Planification Succession</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      FERR imposable au dÃ©cÃ¨s sauf transfert conjoint/enfants
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
                  <CardTitle>Risque des premières années</CardTitle>
                  <CardDescription>
                    Vérifiez si de mauvais rendements en début de retraite pourraient fragiliser votre plan.
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
                                   result.riskAnalysis.earlyYearsRisk === 'medium' ? 'ModÃ©rÃ©' : 'Ã‰levÃ©'}
                          </span>
                        </div>
                        <p className="text-sm mt-2">
                          Risque de sÃ©quence des rendements : {result.riskAnalysis.sequenceOfReturnsRisk.toFixed(1)} %
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Recommandations</h4>
                      <div className="space-y-2">
                        {result.riskAnalysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
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
                  <CardTitle>Projection</CardTitle>
                  <CardDescription>
                    Voyez comment vos comptes pourraient évoluer avec l'ordre suggéré.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">AnnÃ©e</th>
                          <th className="text-left p-2">Ã‚ge</th>
                          <th className="text-left p-2">CELI</th>
                          <th className="text-left p-2">Non-Enreg.</th>
                          <th className="text-left p-2">REER</th>
                          <th className="text-left p-2">FERR</th>
                          <th className="text-left p-2">Retrait</th>
                          <th className="text-left p-2">ImpÃ´t</th>
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
                      Affichage des 15 premiÃ¨res annÃ©es. Projection complÃ¨te disponible dans le rapport dÃ©taillÃ©.
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
              <CardTitle>À retenir</CardTitle>
              <CardDescription>
                Les grands principes utiles pour comprendre pourquoi l'ordre des retraits compte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Pourquoi l'ordre des retraits est important</h4>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium">Impact Fiscal DiffÃ©rentiel</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Selon le Gouvernement du Canada, les diffÃ©rents types de revenus sont imposÃ©s diffÃ©remment :
                  </p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>â€¢ <strong>CELI :</strong> 0% d'impÃ´t sur retraits</li>
                    <li>â€¢ <strong>Gains en capital :</strong> 50% imposable (taux effectif ~17.5%)</li>
                    <li>â€¢ <strong>REER/FERR :</strong> 100 % imposable comme revenu ordinaire (~35%)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium">Risque de SÃ©quence des Rendements</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Les mauvais rendements dans les premiÃ¨res annÃ©es de retraite, combinÃ©s aux retraits, 
                    peuvent avoir un impact permanent sur la longÃ©vitÃ© du portefeuille. Une sÃ©quence 
                    optimisÃ©e protÃ¨ge contre ce risque.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium">Prestations Gouvernementales</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Les retraits CELI n'affectent pas vos prestations de SÃ©curitÃ© de la vieillesse (SV) 
                    ou SupplÃ©ment de revenu garanti (SRG), contrairement aux retraits REER/FERR.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">RÃ¨gles Gouvernementales ClÃ©s</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-blue-600">Conversion REER â†’ FERR</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Obligatoire :</strong> Au plus tard le 31 dÃ©cembre de l'annÃ©e de vos 71 ans
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Retraits minimums :</strong> Commencent l'annÃ©e suivant la conversion
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-blue-600">Pourcentages FERR</h5>
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
                    <h5 className="font-medium text-blue-600">Conjoint plus jeune</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Vous pouvez baser les retraits FERR sur l'Ã¢ge de votre conjoint s'il est plus jeune, 
                      rÃ©duisant ainsi les retraits minimums obligatoires.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-blue-600">Fractionnement de Revenu</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Ã€ partir de 65 ans, vous pouvez fractionner jusqu'Ã  50% de vos revenus de 
                      pension admissibles avec votre conjoint.
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>À retenir :</strong> L'ordre idéal n'est pas toujours le même pour tout le monde. Servez-vous surtout de ce module pour repérer les bons sujets à discuter avec votre planificateur.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <NextStepPanel
        title="Prochaine Ã©tape"
        text="Une fois votre ordre de retraits mieux compris, vÃ©rifiez comment il sâ€™intÃ¨gre avec votre FERR, votre RRQ et votre objectif de payer moins dâ€™impÃ´t."
        primaryLabel="PrÃ©parer mon dossier"
        primaryHref="/mon-dossier"
        secondaryLabel="Voir les outils de revenus"
        secondaryHref="/outils#revenus"
      />
    </div>
  );
};

export default WithdrawalSequenceModule;


