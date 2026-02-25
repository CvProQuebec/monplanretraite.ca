import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Heart, Calculator, TrendingUp, Shield, AlertTriangle, Info } from 'lucide-react';

interface HealthcarePlanningData {
  currentAge: number;
  retirementAge: number;
  currentHealthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  familyHistory: 'low' | 'medium' | 'high';
  currentHealthExpenses: number;
  hasExtendedBenefits: boolean;
  benefitsEndAge: number;
  inflationRate: number;
  healthcareInflationRate: number;
}

interface HealthcareProjection {
  totalEstimatedCost: number;
  averageAnnualCost: number;
  yearByYearProjection: Array<{
    year: number;
    age: number;
    basicHealthcare: number;
    extendedCare: number;
    emergencyReserve: number;
    totalAnnualCost: number;
    cumulativeCost: number;
  }>;
  riskFactors: {
    longTermCareRisk: number;
    criticalIllnessRisk: number;
    medicationCostRisk: number;
  };
  recommendations: string[];
}

const HealthcareCostPlanningModule: React.FC = () => {
  const [data, setData] = useState<HealthcarePlanningData>({
    currentAge: 55,
    retirementAge: 65,
    currentHealthStatus: 'good',
    familyHistory: 'medium',
    currentHealthExpenses: 2000,
    hasExtendedBenefits: true,
    benefitsEndAge: 65,
    inflationRate: 2.5,
    healthcareInflationRate: 4.5
  });

  const [projection, setProjection] = useState<HealthcareProjection | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calcul des coûts de santé selon les données gouvernementales canadiennes
  const calculateHealthcareCosts = useCallback(() => {
    setIsCalculating(true);
    
    const projectionYears = 35; // Jusqu'à 100 ans
    const yearByYearProjection = [];
    let cumulativeCost = 0;
    
    // Facteurs de risque selon l'âge et l'état de santé
    const healthStatusMultiplier = {
      excellent: 0.8,
      good: 1.0,
      fair: 1.3,
      poor: 1.8
    };
    
    const familyHistoryMultiplier = {
      low: 0.9,
      medium: 1.0,
      high: 1.2
    };
    
    // Coûts de base selon les statistiques canadiennes
    const baseHealthcareCosts = {
      basic: 3000, // Soins de base annuels
      dental: 1500, // Soins dentaires
      vision: 500,  // Soins de la vue
      prescription: 2000, // Médicaments
      emergency: 1000 // Réserve urgence médicale
    };
    
    for (let year = 0; year < projectionYears; year++) {
      const currentAge = data.currentAge + year;
      const yearsFromNow = year;
      
      // Inflation des coûts de santé (plus élevée que l'inflation générale)
      const healthcareInflationFactor = Math.pow(1 + data.healthcareInflationRate / 100, yearsFromNow);
      const generalInflationFactor = Math.pow(1 + data.inflationRate / 100, yearsFromNow);
      
      // Facteur d'âge - les coûts augmentent exponentiellement après 75 ans
      let ageFactor = 1.0;
      if (currentAge >= 75) {
        ageFactor = 1.0 + (currentAge - 75) * 0.15; // +15% par année après 75 ans
      } else if (currentAge >= 65) {
        ageFactor = 1.0 + (currentAge - 65) * 0.05; // +5% par année après 65 ans
      }
      
      // Calcul des coûts par catégorie
      let basicHealthcare = (baseHealthcareCosts.basic + baseHealthcareCosts.dental + baseHealthcareCosts.vision) 
        * healthcareInflationFactor 
        * ageFactor 
        * healthStatusMultiplier[data.currentHealthStatus]
        * familyHistoryMultiplier[data.familyHistory];
      
      let prescriptionCosts = baseHealthcareCosts.prescription 
        * healthcareInflationFactor 
        * ageFactor 
        * healthStatusMultiplier[data.currentHealthStatus];
      
      // Coûts de soins prolongés (augmentent drastiquement après 80 ans)
      let extendedCare = 0;
      if (currentAge >= 80) {
        const longTermCareRisk = Math.min(0.5, (currentAge - 80) * 0.05); // 5% de risque par année après 80
        extendedCare = 50000 * longTermCareRisk * generalInflationFactor; // Coût moyen soins prolongés
      }
      
      // Réserve d'urgence médicale
      let emergencyReserve = baseHealthcareCosts.emergency * generalInflationFactor;
      
      // Réduction si avantages sociaux encore actifs
      if (data.hasExtendedBenefits && currentAge < data.benefitsEndAge) {
        basicHealthcare *= 0.3; // 70% couvert par avantages sociaux
        prescriptionCosts *= 0.2; // 80% couvert
      }
      
      const totalAnnualCost = basicHealthcare + prescriptionCosts + extendedCare + emergencyReserve;
      cumulativeCost += totalAnnualCost;
      
      yearByYearProjection.push({
        year: year + 1,
        age: currentAge,
        basicHealthcare: basicHealthcare + prescriptionCosts,
        extendedCare,
        emergencyReserve,
        totalAnnualCost,
        cumulativeCost
      });
    }
    
    // Analyse des facteurs de risque
    const longTermCareRisk = Math.min(100, 
      (data.currentAge >= 65 ? 30 : 15) + 
      (familyHistoryMultiplier[data.familyHistory] - 1) * 20 +
      (healthStatusMultiplier[data.currentHealthStatus] - 1) * 15
    );
    
    const criticalIllnessRisk = Math.min(100,
      (data.currentAge >= 60 ? 25 : 10) +
      (familyHistoryMultiplier[data.familyHistory] - 1) * 25 +
      (healthStatusMultiplier[data.currentHealthStatus] - 1) * 20
    );
    
    const medicationCostRisk = Math.min(100,
      (data.currentAge >= 65 ? 40 : 20) +
      (healthStatusMultiplier[data.currentHealthStatus] - 1) * 30
    );
    
    // Recommandations basées sur l'analyse
    const recommendations = [];
    
    if (longTermCareRisk > 50) {
      recommendations.push('Considérez une assurance soins de longue durée');
      recommendations.push('Évaluez les options de soins à domicile vs établissement');
    }
    
    if (criticalIllnessRisk > 40) {
      recommendations.push('Assurance maladie grave recommandée');
      recommendations.push('Maintenez un fonds d\'urgence médical séparé');
    }
    
    if (!data.hasExtendedBenefits || data.benefitsEndAge <= data.retirementAge) {
      recommendations.push('Planifiez la transition des avantages sociaux');
      recommendations.push('Recherchez une assurance santé privée pour combler les lacunes');
    }
    
    if (medicationCostRisk > 60) {
      recommendations.push('Budgétez pour l\'augmentation des coûts de médicaments');
      recommendations.push('Explorez les programmes d\'aide gouvernementaux disponibles');
    }
    
    recommendations.push('Maintenez un mode de vie sain pour réduire les coûts futurs');
    recommendations.push('Révisez annuellement vos besoins et couvertures');
    
    setProjection({
      totalEstimatedCost: cumulativeCost,
      averageAnnualCost: cumulativeCost / projectionYears,
      yearByYearProjection,
      riskFactors: {
        longTermCareRisk,
        criticalIllnessRisk,
        medicationCostRisk
      },
      recommendations
    });
    
    setIsCalculating(false);
  }, [data]);

  const handleInputChange = (field: keyof HealthcarePlanningData, value: string | boolean) => {
    if (typeof value === 'boolean') {
      setData(prev => ({ ...prev, [field]: value }));
    } else {
      const numValue = parseFloat(value) || 0;
      setData(prev => ({ ...prev, [field]: numValue }));
    }
  };

  const handleSelectChange = (field: keyof HealthcarePlanningData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('$', '').trim() + ' $';
  };

  const getRiskColor = (risk: number): string => {
    if (risk < 30) return 'text-green-600';
    if (risk < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBgColor = (risk: number): string => {
    if (risk < 30) return 'bg-green-50 border-green-200';
    if (risk < 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Heart className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Planification des Coûts de Santé
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Planifiez et budgétez les coûts de santé pour votre retraite selon les données 
          du système de santé canadien et les recommandations gouvernementales.
        </p>
        
        <Alert className="max-w-2xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Statistique Canada :</strong> Les coûts de santé augmentent de 4-6% annuellement, 
            soit le double de l'inflation générale. Une planification adéquate est essentielle.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculateur
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Analyse Risques
          </TabsTrigger>
          <TabsTrigger value="projection" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Projection
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
                Vos Informations de Santé
              </CardTitle>
              <CardDescription>
                Entrez vos informations pour estimer vos coûts de santé futurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentAge">Âge Actuel</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={data.currentAge || ''}
                      onChange={(e) => handleInputChange('currentAge', e.target.value)}
                      placeholder="Ex: 55"
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
                    <Label htmlFor="currentHealth">État de Santé Actuel</Label>
                    <select
                      id="currentHealth"
                      value={data.currentHealthStatus}
                      onChange={(e) => handleSelectChange('currentHealthStatus', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Bon</option>
                      <option value="fair">Moyen</option>
                      <option value="poor">Pauvre</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="familyHistory">Antécédents Familiaux</Label>
                    <select
                      id="familyHistory"
                      value={data.familyHistory}
                      onChange={(e) => handleSelectChange('familyHistory', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Faible risque</option>
                      <option value="medium">Risque modéré</option>
                      <option value="high">Risque élevé</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentExpenses">Dépenses Santé Actuelles ($/an)</Label>
                    <Input
                      id="currentExpenses"
                      type="number"
                      value={data.currentHealthExpenses || ''}
                      onChange={(e) => handleInputChange('currentHealthExpenses', e.target.value)}
                      placeholder="Ex: 2 000"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasExtendedBenefits"
                      checked={data.hasExtendedBenefits}
                      onChange={(e) => handleInputChange('hasExtendedBenefits', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="hasExtendedBenefits">
                      J'ai des avantages sociaux étendus
                    </Label>
                  </div>
                  
                  {data.hasExtendedBenefits && (
                    <div>
                      <Label htmlFor="benefitsEndAge">Âge de Fin des Avantages</Label>
                      <Input
                        id="benefitsEndAge"
                        type="number"
                        value={data.benefitsEndAge || ''}
                        onChange={(e) => handleInputChange('benefitsEndAge', e.target.value)}
                        placeholder="Ex: 65"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="healthcareInflation">Inflation Soins de Santé (%)</Label>
                    <Input
                      id="healthcareInflation"
                      type="number"
                      step="0.1"
                      value={data.healthcareInflationRate || ''}
                      onChange={(e) => handleInputChange('healthcareInflationRate', e.target.value)}
                      placeholder="Ex: 4.5"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={calculateHealthcareCosts}
                disabled={isCalculating}
                className="w-full"
                size="lg"
              >
                {isCalculating ? 'Calcul en cours...' : 'Calculer les Coûts de Santé'}
              </Button>
            </CardContent>
          </Card>

          {projection && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Estimation des Coûts de Santé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(projection.totalEstimatedCost)}
                    </div>
                    <div className="text-sm text-gray-600">Coût Total Estimé (Vie Entière)</div>
                  </div>
                  
                  <div className="text-center p-4 bg-mpr-interactive-lt rounded-lg">
                    <div className="text-2xl font-bold text-mpr-interactive">
                      {formatCurrency(projection.averageAnnualCost)}
                    </div>
                    <div className="text-sm text-gray-600">Coût Annuel Moyen</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          {projection && (
            <Card>
              <CardHeader>
                <CardTitle>Analyse des Facteurs de Risque</CardTitle>
                <CardDescription>
                  Évaluation personnalisée selon vos informations de santé
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg border ${getRiskBgColor(projection.riskFactors.longTermCareRisk)}`}>
                    <h4 className="font-semibold">Soins de Longue Durée</h4>
                    <div className={`text-2xl font-bold ${getRiskColor(projection.riskFactors.longTermCareRisk)}`}>
                      {projection.riskFactors.longTermCareRisk.toFixed(0)}%
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Probabilité de nécessiter des soins prolongés
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${getRiskBgColor(projection.riskFactors.criticalIllnessRisk)}`}>
                    <h4 className="font-semibold">Maladie Critique</h4>
                    <div className={`text-2xl font-bold ${getRiskColor(projection.riskFactors.criticalIllnessRisk)}`}>
                      {projection.riskFactors.criticalIllnessRisk.toFixed(0)}%
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Risque de maladie critique coûteuse
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${getRiskBgColor(projection.riskFactors.medicationCostRisk)}`}>
                    <h4 className="font-semibold">Coûts Médicaments</h4>
                    <div className={`text-2xl font-bold ${getRiskColor(projection.riskFactors.medicationCostRisk)}`}>
                      {projection.riskFactors.medicationCostRisk.toFixed(0)}%
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Risque de coûts élevés de médicaments
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Recommandations Personnalisées</h4>
                  <div className="space-y-2">
                    {projection.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-mpr-interactive-lt rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-mpr-interactive mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="projection" className="space-y-6">
          {projection && (
            <Card>
              <CardHeader>
                <CardTitle>Projection des Coûts par Année</CardTitle>
                <CardDescription>
                  Évolution estimée de vos coûts de santé selon l'âge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Année</th>
                        <th className="text-left p-2">Âge</th>
                        <th className="text-left p-2">Soins de Base</th>
                        <th className="text-left p-2">Soins Prolongés</th>
                        <th className="text-left p-2">Urgence Médicale</th>
                        <th className="text-left p-2">Total Annuel</th>
                        <th className="text-left p-2">Cumulatif</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projection.yearByYearProjection.slice(0, 20).map((year) => (
                        <tr key={year.year} className="border-b hover:bg-gray-50">
                          <td className="p-2">{year.year}</td>
                          <td className="p-2">{year.age}</td>
                          <td className="p-2">{formatCurrency(year.basicHealthcare)}</td>
                          <td className="p-2">{formatCurrency(year.extendedCare)}</td>
                          <td className="p-2">{formatCurrency(year.emergencyReserve)}</td>
                          <td className="p-2 font-medium">{formatCurrency(year.totalAnnualCost)}</td>
                          <td className="p-2 font-bold">{formatCurrency(year.cumulativeCost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {projection.yearByYearProjection.length > 20 && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Affichage des 20 premières années. Projection complète disponible dans le rapport détaillé.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Éducation : Coûts de Santé à la Retraite</CardTitle>
              <CardDescription>
                Comprendre l'évolution des coûts de santé selon les données canadiennes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Réalités du Système de Santé Canadien</h4>
                
                <div className="p-4 bg-mpr-interactive-lt rounded-lg">
                  <h5 className="font-medium">Couverture Publique vs Privée</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Le système public couvre les soins hospitaliers et médicaux de base, mais plusieurs 
                    coûts restent à votre charge : médicaments, soins dentaires, soins de la vue, 
                    physiothérapie, et soins de longue durée.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium">Inflation des Coûts de Santé</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Selon Statistique Canada, les coûts de santé augmentent de 4-6% annuellement, 
                    soit le double de l'inflation générale. Cette tendance s'accélère avec le 
                    vieillissement de la population.
                  </p>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium">Coûts de Soins de Longue Durée</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Au Canada, les coûts de soins de longue durée peuvent atteindre 50 000$ à 80 000$ 
                    par année. Seulement 30% des coûts sont couverts par les programmes publics.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Stratégies de Protection</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-green-600">Assurance Maladie Grave</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Couvre les coûts associés aux maladies critiques (cancer, AVC, crise cardiaque). 
                      Paiement forfaitaire pour couvrir les frais non remboursés.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-green-600">Assurance Soins de Longue Durée</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Couvre les coûts de soins prolongés à domicile ou en établissement. 
                      Essentielle pour protéger votre épargne-retraite.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-green-600">Compte Santé Dédié</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Maintenez un compte séparé pour les urgences médicales. Recommandation : 
                      10 000$ à 25 000$ selon votre situation.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-green-600">Prévention et Mode de Vie</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Investir dans la prévention (exercice, nutrition, examens réguliers) 
                      peut réduire significativement les coûts futurs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Programmes Gouvernementaux Disponibles</h4>
                
                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-mpr-interactive bg-mpr-interactive-lt">
                    <h5 className="font-medium">Crédit d'Impôt pour Frais Médicaux</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Crédit fédéral et provincial pour frais médicaux dépassant 3% du revenu net 
                      ou 2 635$ (2025), selon le moindre des deux.
                    </p>
                  </div>
                  
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h5 className="font-medium">Crédit d'Impôt pour Maintien à Domicile</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Crédit d'impôt remboursable du Québec pour aider les aînés à demeurer 
                      à domicile (entretien ménager, déneigement, etc.).
                    </p>
                  </div>
                  
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                    <h5 className="font-medium">Programmes d'Aide aux Médicaments</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Régime public d'assurance médicaments du Québec et programmes fédéraux 
                      pour personnes à faible revenu.
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Conseil Important :</strong> Les coûts de santé sont imprévisibles. 
                  Une planification conservatrice avec des marges de sécurité est recommandée 
                  pour protéger votre qualité de vie à la retraite.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthcareCostPlanningModule;
