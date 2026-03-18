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
import { Clock, TrendingUp, Shield, Target, Info, Calendar } from 'lucide-react';

interface LongevityPlanningData {
  currentAge: number;
  retirementAge: number;
  gender: 'male' | 'female';
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  familyLongevity: 'low' | 'average' | 'high';
  lifestyle: 'sedentary' | 'active' | 'very-active';
  totalAssets: number;
  monthlyExpenses: number;
  inflationRate: number;
  expectedReturn: number;
  hasSpouse: boolean;
  spouseAge: number;
  spouseGender: 'male' | 'female';
}

interface LongevityProjection {
  lifeExpectancy: number;
  retirementDuration: number;
  probabilityAge90: number;
  probabilityAge95: number;
  probabilityAge100: number;
  totalRetirementNeeds: number;
  assetSufficiency: 'sufficient' | 'marginal' | 'insufficient';
  yearByYearProjection: Array<{
    year: number;
    age: number;
    expenses: number;
    assetValue: number;
    withdrawalRate: number;
    survivalProbability: number;
  }>;
  recommendations: string[];
  riskFactors: string[];
}

const FinancialLongevityPlanningModule: React.FC = () => {
  const [data, setData] = useState<LongevityPlanningData>({
    currentAge: 60,
    retirementAge: 65,
    gender: 'male',
    healthStatus: 'good',
    familyLongevity: 'average',
    lifestyle: 'active',
    totalAssets: 750000,
    monthlyExpenses: 4000,
    inflationRate: 2.5,
    expectedReturn: 5.0,
    hasSpouse: false,
    spouseAge: 58,
    spouseGender: 'female'
  });

  const [projection, setProjection] = useState<LongevityProjection | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calcul de l'espÃ©rance de vie selon les donnÃ©es de Statistique Canada
  const calculateLongevityProjection = useCallback(() => {
    setIsCalculating(true);
    
    // EspÃ©rance de vie de base selon Statistique Canada (2025)
    const baseLifeExpectancy = {
      male: 81,
      female: 85
    };
    
    // Ajustements selon les facteurs de santÃ© et mode de vie
    const healthAdjustment = {
      excellent: 3,
      good: 0,
      fair: -3,
      poor: -6
    };
    
    const familyAdjustment = {
      low: -2,
      average: 0,
      high: 4
    };
    
    const lifestyleAdjustment = {
      sedentary: -2,
      active: 1,
      'very-active': 3
    };
    
    // Calcul de l'espÃ©rance de vie ajustÃ©e
    const adjustedLifeExpectancy = baseLifeExpectancy[data.gender] +
      healthAdjustment[data.healthStatus] +
      familyAdjustment[data.familyLongevity] +
      lifestyleAdjustment[data.lifestyle];
    
    const retirementDuration = adjustedLifeExpectancy - data.retirementAge;
    
    // ProbabilitÃ©s de survie selon les tables actuarielles canadiennes
    const calculateSurvivalProbability = (targetAge: number): number => {
      const yearsToTarget = targetAge - data.currentAge;
      const baseProbability = Math.exp(-yearsToTarget * 0.02); // ModÃ¨le exponentiel simplifiÃ©
      
      // Ajustements selon les facteurs personnels
      let adjustment = 1.0;
      adjustment *= (1 + healthAdjustment[data.healthStatus] * 0.02);
      adjustment *= (1 + familyAdjustment[data.familyLongevity] * 0.015);
      adjustment *= (1 + lifestyleAdjustment[data.lifestyle] * 0.01);
      
      return Math.min(100, Math.max(0, baseProbability * adjustment * 100));
    };
    
    const probabilityAge90 = calculateSurvivalProbability(90);
    const probabilityAge95 = calculateSurvivalProbability(95);
    const probabilityAge100 = calculateSurvivalProbability(100);
    
    // Projection annÃ©e par annÃ©e
    const yearByYearProjection = [];
    let currentAssets = data.totalAssets;
    const annualExpenses = data.monthlyExpenses * 12;
    
    for (let year = 0; year <= 40; year++) {
      const currentAge = data.retirementAge + year;
      const inflatedExpenses = annualExpenses * Math.pow(1 + data.inflationRate / 100, year);
      
      // Calcul du taux de retrait
      const withdrawalRate = currentAssets > 0 ? (inflatedExpenses / currentAssets) * 100 : 0;
      
      // Croissance des actifs moins les retraits
      const assetGrowth = currentAssets * (data.expectedReturn / 100);
      currentAssets = Math.max(0, currentAssets + assetGrowth - inflatedExpenses);
      
      const survivalProbability = calculateSurvivalProbability(currentAge);
      
      yearByYearProjection.push({
        year: year + 1,
        age: currentAge,
        expenses: inflatedExpenses,
        assetValue: currentAssets,
        withdrawalRate,
        survivalProbability
      });
      
      // ArrÃªter si les actifs sont Ã©puisÃ©s
      if (currentAssets <= 0) break;
    }
    
    // Calcul du total des besoins de retraite
    const totalRetirementNeeds = annualExpenses * retirementDuration * 
      Math.pow(1 + data.inflationRate / 100, retirementDuration / 2); // Inflation moyenne
    
    // Ã‰valuation de la suffisance des actifs
    let assetSufficiency: 'sufficient' | 'marginal' | 'insufficient';
    const assetToNeedsRatio = data.totalAssets / totalRetirementNeeds;
    
    if (assetToNeedsRatio >= 1.2) {
      assetSufficiency = 'sufficient';
    } else if (assetToNeedsRatio >= 0.8) {
      assetSufficiency = 'marginal';
    } else {
      assetSufficiency = 'insufficient';
    }
    
    // Recommandations basÃ©es sur l'analyse
    const recommendations = [];
    const riskFactors = [];
    
    if (adjustedLifeExpectancy > 85) {
      recommendations.push('Planifiez pour une retraite de 25-30 ans minimum');
      recommendations.push('ConsidÃ©rez une rente viagÃ¨re pour garantir un revenu Ã  vie');
    }
    
    if (probabilityAge90 > 50) {
      recommendations.push('Forte probabilitÃ© de vivre au-delÃ  de 90 ans - planifiez en consÃ©quence');
      riskFactors.push('Risque de longÃ©vitÃ© Ã©levÃ©');
    }
    
    if (assetSufficiency === 'insufficient') {
      recommendations.push('Vos actifs actuels sont insuffisants - augmentez votre Ã©pargne');
      recommendations.push('ConsidÃ©rez reporter votre retraite de 2-3 ans');
      riskFactors.push('Actifs insuffisants pour la durÃ©e de retraite projetÃ©e');
    } else if (assetSufficiency === 'marginal') {
      recommendations.push('Vos actifs sont marginaux - surveillez vos dÃ©penses');
      recommendations.push('Optimisez votre stratÃ©gie de retrait');
      riskFactors.push('Marge de sÃ©curitÃ© financiÃ¨re limitÃ©e');
    }
    
    // VÃ©rification de la rÃ¨gle des 4 %
    const safeWithdrawalRate = (data.monthlyExpenses * 12) / data.totalAssets * 100;
    if (safeWithdrawalRate > 4) {
      recommendations.push('Votre taux de retrait dÃ©passe la rÃ¨gle des 4 % - risque d\'Ã©puisement');
      riskFactors.push(`Taux de retrait initial de ${safeWithdrawalRate.toFixed(1)} % (>4%)`);
    }
    
    if (data.expectedReturn < data.inflationRate + 2) {
      recommendations.push('Votre rendement attendu est trop faible face Ã  l\'inflation');
      riskFactors.push('Rendement insuffisant pour maintenir le pouvoir d\'achat');
    }
    
    if (data.hasSpouse) {
      recommendations.push('Planifiez pour le conjoint survivant - besoins diffÃ©rents');
      recommendations.push('ConsidÃ©rez l\'assurance vie pour protÃ©ger le conjoint survivant');
    }
    
    recommendations.push('RÃ©visez votre plan tous les 3-5 ans');
    recommendations.push('Maintenez un fonds d\'urgence sÃ©parÃ© pour les imprÃ©vus');
    
    setProjection({
      lifeExpectancy: adjustedLifeExpectancy,
      retirementDuration,
      probabilityAge90,
      probabilityAge95,
      probabilityAge100,
      totalRetirementNeeds,
      assetSufficiency,
      yearByYearProjection,
      recommendations,
      riskFactors
    });
    
    setIsCalculating(false);
  }, [data]);

  const handleInputChange = (field: keyof LongevityPlanningData, value: string | boolean) => {
    if (typeof value === 'boolean') {
      setData(prev => ({ ...prev, [field]: value }));
    } else {
      const numValue = parseFloat(value) || 0;
      setData(prev => ({ ...prev, [field]: numValue }));
    }
  };

  const handleSelectChange = (field: keyof LongevityPlanningData, value: string) => {
    setData(prev => ({ ...prev, [field]: value as any }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('$', '').trim() + ' $';
  };

  const getSufficiencyColor = (sufficiency: string): string => {
    switch (sufficiency) {
      case 'sufficient': return 'text-green-600';
      case 'marginal': return 'text-yellow-600';
      case 'insufficient': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSufficiencyBgColor = (sufficiency: string): string => {
    switch (sufficiency) {
      case 'sufficient': return 'bg-green-50 border-green-200';
      case 'marginal': return 'bg-yellow-50 border-yellow-200';
      case 'insufficient': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <GuidedPageIntro
        eyebrow="LongÃ©vitÃ© financiÃ¨re"
        title="VÃ©rifier si votre argent peut durer aussi longtemps que vous"
        description="Cette page estime la durÃ©e possible de votre retraite selon votre Ã¢ge, votre santÃ©, votre mode de vie, vos dÃ©penses et vos actifs. Lâ€™objectif nâ€™est pas de prÃ©dire parfaitement lâ€™avenir, mais de vous donner une marge de sÃ©curitÃ© rÃ©aliste."
        bullets={[
          'Commencez par votre Ã¢ge de retraite et vos dÃ©penses mensuelles.',
          'Ajoutez ensuite vos actifs et un rendement prudent.',
          'Regardez enfin la durÃ©e projetÃ©e et les recommandations de prudence.',
        ]}
        primaryLink={{ label: 'PrÃ©parer mon dossier', href: '/mon-dossier' }}
        secondaryLink={{ label: 'Voir les outils de revenus', href: '/outils#revenus' }}
      />

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Faire durer votre argent
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Estimez combien de temps votre argent pourrait durer si votre retraite s'étend sur 25, 30 ou même 35 ans.
        </p>
        
        <Alert className="max-w-2xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Repère utile :</strong> Une retraite dure souvent plus longtemps qu'on le croit. Pour un couple de 65 ans, il est courant qu'au moins un conjoint vive au-delà de 90 ans.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Mes chiffres
          </TabsTrigger>
          <TabsTrigger value="projection" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Projection
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Risques à surveiller
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
                <Calendar className="h-5 w-5" />
                Vos informations
              </CardTitle>
              <CardDescription>
                Entrez vos renseignements pour voir si votre capital semble suffisant pour une retraite qui peut durer longtemps.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Votre profil</h4>
                  
                  <div>
                    <Label htmlFor="currentAge">Ã‚ge Actuel</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={data.currentAge || ''}
                      onChange={(e) => handleInputChange('currentAge', e.target.value)}
                      placeholder="Ex: 60"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="retirementAge">Ã‚ge de Retraite PrÃ©vu</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      value={data.retirementAge || ''}
                      onChange={(e) => handleInputChange('retirementAge', e.target.value)}
                      placeholder="Ex: 65"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gender">Sexe</Label>
                    <select
                      id="gender"
                      value={data.gender}
                      onChange={(e) => handleSelectChange('gender', e.target.value)}
                      title="Sexe"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="healthStatus">Ã‰tat de SantÃ©</Label>
                    <select
                      id="healthStatus"
                      value={data.healthStatus}
                      onChange={(e) => handleSelectChange('healthStatus', e.target.value)}
                      title="Ã‰tat de santÃ©"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Bon</option>
                      <option value="fair">Moyen</option>
                      <option value="poor">Pauvre</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="familyLongevity">LongÃ©vitÃ© Familiale</Label>
                    <select
                      id="familyLongevity"
                      value={data.familyLongevity}
                      onChange={(e) => handleSelectChange('familyLongevity', e.target.value)}
                      title="LongÃ©vitÃ© familiale"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Faible (parents dÃ©cÃ©dÃ©s avant 75 ans)</option>
                      <option value="average">Moyenne (parents dÃ©cÃ©dÃ©s 75-85 ans)</option>
                      <option value="high">Ã‰levÃ©e (parents dÃ©cÃ©dÃ©s aprÃ¨s 85 ans)</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="lifestyle">Mode de Vie</Label>
                    <select
                      id="lifestyle"
                      value={data.lifestyle}
                      onChange={(e) => handleSelectChange('lifestyle', e.target.value)}
                      title="Mode de vie"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="sedentary">SÃ©dentaire</option>
                      <option value="active">Actif</option>
                      <option value="very-active">TrÃ¨s Actif</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Votre situation financière</h4>
                  
                  <div>
                    <Label htmlFor="totalAssets">Total des Actifs ($)</Label>
                    <Input
                      id="totalAssets"
                      type="number"
                      value={data.totalAssets || ''}
                      onChange={(e) => handleInputChange('totalAssets', e.target.value)}
                      placeholder="Ex: 750 000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="monthlyExpenses">DÃ©penses Mensuelles PrÃ©vues ($)</Label>
                    <Input
                      id="monthlyExpenses"
                      type="number"
                      value={data.monthlyExpenses || ''}
                      onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                      placeholder="Ex: 4 000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="inflationRate">Taux d'Inflation (%)</Label>
                    <Input
                      id="inflationRate"
                      type="number"
                      step="0.1"
                      value={data.inflationRate || ''}
                      onChange={(e) => handleInputChange('inflationRate', e.target.value)}
                      placeholder="Ex: 2.5"
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
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasSpouse"
                      checked={data.hasSpouse}
                      onChange={(e) => handleInputChange('hasSpouse', e.target.checked)}
                      title="J'ai un conjoint"
                      className="rounded"
                    />
                    <Label htmlFor="hasSpouse">J'ai un conjoint</Label>
                  </div>
                  
                  {data.hasSpouse && (
                    <>
                      <div>
                        <Label htmlFor="spouseAge">Ã‚ge du Conjoint</Label>
                        <Input
                          id="spouseAge"
                          type="number"
                          value={data.spouseAge || ''}
                          onChange={(e) => handleInputChange('spouseAge', e.target.value)}
                          placeholder="Ex: 58"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="spouseGender">Sexe du Conjoint</Label>
                        <select
                          id="spouseGender"
                          value={data.spouseGender}
                          onChange={(e) => handleSelectChange('spouseGender', e.target.value)}
                          title="Sexe du conjoint"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="male">Homme</option>
                          <option value="female">Femme</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={calculateLongevityProjection}
                disabled={isCalculating}
                className="w-full"
                size="lg"
              >
                {isCalculating ? 'Calcul en cours...' : 'Voir combien de temps votre argent pourrait durer'}
              </Button>
            </CardContent>
          </Card>

          {projection && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  RÃ©sultats de la Projection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {projection.lifeExpectancy} ans
                    </div>
                    <div className="text-sm text-gray-600">EspÃ©rance de Vie AjustÃ©e</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {projection.retirementDuration} ans
                    </div>
                    <div className="text-sm text-gray-600">DurÃ©e de Retraite</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {projection.probabilityAge90.toFixed(0)} %
                    </div>
                    <div className="text-sm text-gray-600">ProbabilitÃ© 90 ans</div>
                  </div>
                  
                  <div className={`text-center p-4 rounded-lg border ${getSufficiencyBgColor(projection.assetSufficiency)}`}>
                    <div className={`text-2xl font-bold ${getSufficiencyColor(projection.assetSufficiency)}`}>
                      {projection.assetSufficiency === 'sufficient' ? 'Suffisant' :
                       projection.assetSufficiency === 'marginal' ? 'Marginal' : 'Insuffisant'}
                    </div>
                    <div className="text-sm text-gray-600">Suffisance des Actifs</div>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(projection.totalRetirementNeeds)}
                  </div>
                  <div className="text-sm text-gray-600">Besoins Totaux de Retraite EstimÃ©s</div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="projection" className="space-y-6">
          {projection && (
            <Card>
              <CardHeader>
                <CardTitle>Projection AnnÃ©e par AnnÃ©e</CardTitle>
                <CardDescription>
                  Ã‰volution de vos actifs et probabilitÃ©s de survie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">AnnÃ©e</th>
                        <th className="text-left p-2">Ã‚ge</th>
                        <th className="text-left p-2">DÃ©penses</th>
                        <th className="text-left p-2">Valeur Actifs</th>
                        <th className="text-left p-2">Taux Retrait</th>
                        <th className="text-left p-2">Prob. Survie</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projection.yearByYearProjection.slice(0, 15).map((year) => (
                        <tr key={year.year} className="border-b hover:bg-gray-50">
                          <td className="p-2">{year.year}</td>
                          <td className="p-2">{year.age}</td>
                          <td className="p-2">{formatCurrency(year.expenses)}</td>
                          <td className="p-2 font-medium">{formatCurrency(year.assetValue)}</td>
                          <td className="p-2">
                            <span className={year.withdrawalRate > 4 ? 'text-red-600 font-bold' : ''}>
                              {year.withdrawalRate.toFixed(1)} %
                            </span>
                          </td>
                          <td className="p-2">{year.survivalProbability.toFixed(0)} %</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          {projection && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Facteurs de Risque IdentifiÃ©s</CardTitle>
                  <CardDescription>
                    Risques potentiels pour votre sÃ©curitÃ© financiÃ¨re Ã  long terme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projection.riskFactors.map((risk, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                        <Shield className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{risk}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Actions à envisager</CardTitle>
                  <CardDescription>
                    Quelques pistes concrètes si votre marge de sécurité semble mince.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projection.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
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
                Les repères les plus utiles pour planifier une retraite qui peut durer longtemps.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">DonnÃ©es de Statistique Canada</h4>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium">EspÃ©rance de Vie Actuelle</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Hommes : 81 ans | Femmes : 85 ans. Ces chiffres continuent d'augmenter 
                    grÃ¢ce aux progrÃ¨s mÃ©dicaux et aux meilleures habitudes de vie.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium">ProbabilitÃ©s de LongÃ©vitÃ©</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Pour un couple de 65 ans : 50% de chance qu'un conjoint vive au-delÃ  de 90 ans, 
                    25% de chance qu'un conjoint vive au-delÃ  de 95 ans.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium">Impact sur la Planification</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Une retraite peut durer 25-35 ans. Vos actifs doivent Ãªtre suffisants 
                    pour maintenir votre niveau de vie pendant toute cette pÃ©riode.
                  </p>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium">RÃ¨gle des 4%</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    La rÃ¨gle des 4 % suggÃ¨re qu'un taux de retrait initial de 4% de vos actifs 
                    devrait permettre de maintenir votre capital pendant 30 ans.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">StratÃ©gies de Protection</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-blue-600">Rente ViagÃ¨re</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Garantit un revenu Ã  vie, Ã©limine le risque de longÃ©vitÃ©. 
                      ConsidÃ©rez pour 25-30% de vos actifs.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-blue-600">Diversification Temporelle</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      RÃ©partissez vos actifs selon diffÃ©rents horizons : court terme (liquiditÃ©s), 
                      moyen terme (obligations), long terme (actions).
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-blue-600">Assurance Vie</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      ProtÃ¨ge le conjoint survivant en cas de dÃ©cÃ¨s prÃ©maturÃ©. 
                      ParticuliÃ¨rement important si un conjoint a une pension rÃ©duite.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-blue-600">FlexibilitÃ© des DÃ©penses</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Planifiez des dÃ©penses variables : plus Ã©levÃ©es en dÃ©but de retraite, 
                      rÃ©duites en fin de vie.
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>À retenir :</strong> Personne ne sait combien d'années durera sa retraite. Mieux vaut prévoir large, puis revoir le plan régulièrement selon votre santé, vos dépenses et vos revenus.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <NextStepPanel
        title="Prochaine Ã©tape"
        text="Si votre marge de sÃ©curitÃ© semble faible, reliez maintenant cette projection Ã  votre budget, Ã  vos retraits et Ã  votre dossier pour voir quelles dÃ©cisions peuvent amÃ©liorer la situation."
        primaryLabel="PrÃ©parer mon dossier"
        primaryHref="/mon-dossier"
        secondaryLabel="Voir mon budget"
        secondaryHref="/mon-budget"
      />
    </div>
  );
};

export default FinancialLongevityPlanningModule;


