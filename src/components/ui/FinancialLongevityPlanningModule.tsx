import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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

  // Calcul de l'espérance de vie selon les données de Statistique Canada
  const calculateLongevityProjection = useCallback(() => {
    setIsCalculating(true);
    
    // Espérance de vie de base selon Statistique Canada (2025)
    const baseLifeExpectancy = {
      male: 81,
      female: 85
    };
    
    // Ajustements selon les facteurs de santé et mode de vie
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
    
    // Calcul de l'espérance de vie ajustée
    const adjustedLifeExpectancy = baseLifeExpectancy[data.gender] +
      healthAdjustment[data.healthStatus] +
      familyAdjustment[data.familyLongevity] +
      lifestyleAdjustment[data.lifestyle];
    
    const retirementDuration = adjustedLifeExpectancy - data.retirementAge;
    
    // Probabilités de survie selon les tables actuarielles canadiennes
    const calculateSurvivalProbability = (targetAge: number): number => {
      const yearsToTarget = targetAge - data.currentAge;
      const baseProbability = Math.exp(-yearsToTarget * 0.02); // Modèle exponentiel simplifié
      
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
    
    // Projection année par année
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
      
      // Arrêter si les actifs sont épuisés
      if (currentAssets <= 0) break;
    }
    
    // Calcul du total des besoins de retraite
    const totalRetirementNeeds = annualExpenses * retirementDuration * 
      Math.pow(1 + data.inflationRate / 100, retirementDuration / 2); // Inflation moyenne
    
    // Évaluation de la suffisance des actifs
    let assetSufficiency: 'sufficient' | 'marginal' | 'insufficient';
    const assetToNeedsRatio = data.totalAssets / totalRetirementNeeds;
    
    if (assetToNeedsRatio >= 1.2) {
      assetSufficiency = 'sufficient';
    } else if (assetToNeedsRatio >= 0.8) {
      assetSufficiency = 'marginal';
    } else {
      assetSufficiency = 'insufficient';
    }
    
    // Recommandations basées sur l'analyse
    const recommendations = [];
    const riskFactors = [];
    
    if (adjustedLifeExpectancy > 85) {
      recommendations.push('Planifiez pour une retraite de 25-30 ans minimum');
      recommendations.push('Considérez une rente viagère pour garantir un revenu à vie');
    }
    
    if (probabilityAge90 > 50) {
      recommendations.push('Forte probabilité de vivre au-delà de 90 ans - planifiez en conséquence');
      riskFactors.push('Risque de longévité élevé');
    }
    
    if (assetSufficiency === 'insufficient') {
      recommendations.push('Vos actifs actuels sont insuffisants - augmentez votre épargne');
      recommendations.push('Considérez reporter votre retraite de 2-3 ans');
      riskFactors.push('Actifs insuffisants pour la durée de retraite projetée');
    } else if (assetSufficiency === 'marginal') {
      recommendations.push('Vos actifs sont marginaux - surveillez vos dépenses');
      recommendations.push('Optimisez votre stratégie de retrait');
      riskFactors.push('Marge de sécurité financière limitée');
    }
    
    // Vérification de la règle des 4 %
    const safeWithdrawalRate = (data.monthlyExpenses * 12) / data.totalAssets * 100;
    if (safeWithdrawalRate > 4) {
      recommendations.push('Votre taux de retrait dépasse la règle des 4 % - risque d\'épuisement');
      riskFactors.push(`Taux de retrait initial de ${safeWithdrawalRate.toFixed(1)} % (>4%)`);
    }
    
    if (data.expectedReturn < data.inflationRate + 2) {
      recommendations.push('Votre rendement attendu est trop faible face à l\'inflation');
      riskFactors.push('Rendement insuffisant pour maintenir le pouvoir d\'achat');
    }
    
    if (data.hasSpouse) {
      recommendations.push('Planifiez pour le conjoint survivant - besoins différents');
      recommendations.push('Considérez l\'assurance vie pour protéger le conjoint survivant');
    }
    
    recommendations.push('Révisez votre plan tous les 3-5 ans');
    recommendations.push('Maintenez un fonds d\'urgence séparé pour les imprévus');
    
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
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-8 w-8 text-mpr-interactive" />
          <h1 className="text-3xl font-bold text-gray-900">
            Planification de Longévité Financière
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Planifiez votre retraite pour 25-35 ans selon votre espérance de vie et 
          les données de Statistique Canada sur la longévité.
        </p>
        
        <Alert className="max-w-2xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Statistique Canada :</strong> L'espérance de vie est de 81 ans (hommes) et 
            85 ans (femmes). 50% des couples de 65 ans verront un conjoint vivre au-delà de 90 ans.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Calculateur
          </TabsTrigger>
          <TabsTrigger value="projection" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Projection
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Facteurs Risque
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
                <Calendar className="h-5 w-5" />
                Vos Informations Personnelles
              </CardTitle>
              <CardDescription>
                Entrez vos informations pour calculer votre espérance de vie et besoins financiers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Informations Démographiques</h4>
                  
                  <div>
                    <Label htmlFor="currentAge">Âge Actuel</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={data.currentAge || ''}
                      onChange={(e) => handleInputChange('currentAge', e.target.value)}
                      placeholder="Ex: 60"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="retirementAge">Âge de Retraite Prévu</Label>
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
                    <Label htmlFor="healthStatus">État de Santé</Label>
                    <select
                      id="healthStatus"
                      value={data.healthStatus}
                      onChange={(e) => handleSelectChange('healthStatus', e.target.value)}
                      title="État de santé"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Bon</option>
                      <option value="fair">Moyen</option>
                      <option value="poor">Pauvre</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="familyLongevity">Longévité Familiale</Label>
                    <select
                      id="familyLongevity"
                      value={data.familyLongevity}
                      onChange={(e) => handleSelectChange('familyLongevity', e.target.value)}
                      title="Longévité familiale"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Faible (parents décédés avant 75 ans)</option>
                      <option value="average">Moyenne (parents décédés 75-85 ans)</option>
                      <option value="high">Élevée (parents décédés après 85 ans)</option>
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
                      <option value="sedentary">Sédentaire</option>
                      <option value="active">Actif</option>
                      <option value="very-active">Très Actif</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Informations Financières</h4>
                  
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
                    <Label htmlFor="monthlyExpenses">Dépenses Mensuelles Prévues ($)</Label>
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
                        <Label htmlFor="spouseAge">Âge du Conjoint</Label>
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
                {isCalculating ? 'Calcul en cours...' : 'Calculer la Projection de Longévité'}
              </Button>
            </CardContent>
          </Card>

          {projection && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-mpr-interactive" />
                  Résultats de la Projection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-mpr-interactive-lt rounded-lg">
                    <div className="text-2xl font-bold text-mpr-interactive">
                      {projection.lifeExpectancy} ans
                    </div>
                    <div className="text-sm text-gray-600">Espérance de Vie Ajustée</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {projection.retirementDuration} ans
                    </div>
                    <div className="text-sm text-gray-600">Durée de Retraite</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {projection.probabilityAge90.toFixed(0)} %
                    </div>
                    <div className="text-sm text-gray-600">Probabilité 90 ans</div>
                  </div>
                  
                  <div className={`text-center p-4 rounded-lg border ${getSufficiencyBgColor(projection.assetSufficiency)}`}>
                    <div className={`text-2xl font-bold ${getSufficiencyColor(projection.assetSufficiency)}`}>
                      {projection.assetSufficiency === 'sufficient' ? 'Suffisant' :
                       projection.assetSufficiency === 'marginal' ? 'Marginal' : 'Insuffisant'}
                    </div>
                    <div className="text-sm text-gray-600">Suffisance des Actifs</div>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-r from-mpr-interactive-lt to-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-mpr-interactive">
                    {formatCurrency(projection.totalRetirementNeeds)}
                  </div>
                  <div className="text-sm text-gray-600">Besoins Totaux de Retraite Estimés</div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="projection" className="space-y-6">
          {projection && (
            <Card>
              <CardHeader>
                <CardTitle>Projection Année par Année</CardTitle>
                <CardDescription>
                  Évolution de vos actifs et probabilités de survie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Année</th>
                        <th className="text-left p-2">Âge</th>
                        <th className="text-left p-2">Dépenses</th>
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
                  <CardTitle>Facteurs de Risque Identifiés</CardTitle>
                  <CardDescription>
                    Risques potentiels pour votre sécurité financière à long terme
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
                  <CardTitle>Recommandations Personnalisées</CardTitle>
                  <CardDescription>
                    Actions recommandées pour optimiser votre sécurité financière
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projection.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-mpr-interactive-lt rounded-lg">
                        <Target className="h-4 w-4 text-mpr-interactive mt-0.5 flex-shrink-0" />
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
              <CardTitle>Éducation : Planification de Longévité</CardTitle>
              <CardDescription>
                Comprendre les enjeux de la longévité financière au Canada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Données de Statistique Canada</h4>
                
                <div className="p-4 bg-mpr-interactive-lt rounded-lg">
                  <h5 className="font-medium">Espérance de Vie Actuelle</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Hommes : 81 ans | Femmes : 85 ans. Ces chiffres continuent d'augmenter 
                    grâce aux progrès médicaux et aux meilleures habitudes de vie.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium">Probabilités de Longévité</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Pour un couple de 65 ans : 50% de chance qu'un conjoint vive au-delà de 90 ans, 
                    25% de chance qu'un conjoint vive au-delà de 95 ans.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium">Impact sur la Planification</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Une retraite peut durer 25-35 ans. Vos actifs doivent être suffisants 
                    pour maintenir votre niveau de vie pendant toute cette période.
                  </p>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium">Règle des 4%</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    La règle des 4 % suggère qu'un taux de retrait initial de 4% de vos actifs 
                    devrait permettre de maintenir votre capital pendant 30 ans.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Stratégies de Protection</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-mpr-interactive">Rente Viagère</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Garantit un revenu à vie, élimine le risque de longévité. 
                      Considérez pour 25-30% de vos actifs.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-mpr-interactive">Diversification Temporelle</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Répartissez vos actifs selon différents horizons : court terme (liquidités), 
                      moyen terme (obligations), long terme (actions).
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-mpr-interactive">Assurance Vie</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Protège le conjoint survivant en cas de décès prématuré. 
                      Particulièrement important si un conjoint a une pension réduite.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-mpr-interactive">Flexibilité des Dépenses</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Planifiez des dépenses variables : plus élevées en début de retraite, 
                      réduites en fin de vie.
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Conseil Important :</strong> La longévité est imprévisible. 
                  Planifiez pour vivre jusqu'à 95 ans minimum et révisez votre plan 
                  régulièrement selon l'évolution de votre santé et situation financière.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialLongevityPlanningModule;
