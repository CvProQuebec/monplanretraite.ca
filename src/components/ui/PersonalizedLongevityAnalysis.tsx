import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, DollarSign, Users, Shield, BarChart3 } from 'lucide-react';
import { IncomeSynchronizationService } from '@/services/IncomeSynchronizationService';
import { UserData } from '@/types';

interface PersonalizedLongevityAnalysisProps {
  userData: UserData;
  isFrench: boolean;
  personNumber: 1 | 2;
}

const PersonalizedLongevityAnalysis: React.FC<PersonalizedLongevityAnalysisProps> = ({
  userData,
  isFrench,
  personNumber
}) => {
  // Calculer les données de revenus synchronisées
  const incomeData = IncomeSynchronizationService.synchronizeHouseholdIncome(userData);
  const incomeImpact = IncomeSynchronizationService.calculateIncomeLongevityImpact(incomeData);

  // Calculer l'âge actuel
  const computeAgeFromBirthdate = (birthdate?: string): number => {
    if (!birthdate) return 65;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Calculer l'espérance de vie personnalisée
  const calculatePersonalizedLifeExpectancy = () => {
    const personal = userData.personal || {};
    const fieldSuffix = personNumber === 1 ? '1' : '2';
    
    // Espérance de vie de base selon le sexe
    const baseLifeExpectancy = personal[`sexe${fieldSuffix}`] === 'F' ? 85 : 81;
    
    // Ajustements selon les facteurs de santé
    const healthAdjustments: { [key: string]: number } = {
      'excellent': 3,
      'tresbon': 2,
      'bon': 0,
      'moyen': -2,
      'fragile': -4
    };
    
    // Ajustements selon le mode de vie
    const lifestyleAdjustments: { [key: string]: number } = {
      'tresActif': 2,
      'actif': 1,
      'modere': 0,
      'legerementActif': -1,
      'sedentaire': -2
    };
    
    // Ajustements selon l'expérience financière
    const financialAdjustments: { [key: string]: number } = {
      'expert': 1,
      'experimente': 0.5,
      'intermediaire': 0,
      'debutant': -0.5
    };
    
    // Ajustements selon la tolérance au risque
    const riskAdjustments: { [key: string]: number } = {
      'agressif': -1,
      'dynamique': 0,
      'equilibre': 0.5,
      'conservateur': 1,
      'tres-conservateur': 1.5
    };
    
    // Calculer les ajustements
    const healthAdjustment = healthAdjustments[personal[`etatSante${fieldSuffix}`] || 'bon'] || 0;
    const lifestyleAdjustment = lifestyleAdjustments[personal[`modeVieActif${fieldSuffix}`] || 'modere'] || 0;
    const financialAdjustment = financialAdjustments[personal[`experienceFinanciere${fieldSuffix}`] || 'intermediaire'] || 0;
    const riskAdjustment = riskAdjustments[personal[`toleranceRisqueInvestissement${fieldSuffix}`] || 'equilibre'] || 0;
    
    // Impact des revenus synchronisés
    const incomeAdjustment = incomeImpact.lifeExpectancyAdjustment;
    
    // Calculer l'espérance de vie ajustée
    const adjustedLifeExpectancy = baseLifeExpectancy + 
      healthAdjustment + 
      lifestyleAdjustment + 
      financialAdjustment + 
      riskAdjustment + 
      incomeAdjustment;
    
    return {
      base: baseLifeExpectancy,
      adjusted: Math.max(70, Math.min(100, adjustedLifeExpectancy)),
      adjustments: {
        health: healthAdjustment,
        lifestyle: lifestyleAdjustment,
        financial: financialAdjustment,
        risk: riskAdjustment,
        income: incomeAdjustment
      }
    };
  };

  const longevityData = calculatePersonalizedLifeExpectancy();
  const currentAge = computeAgeFromBirthdate(userData.personal?.[`naissance${personNumber}`]);
  const remainingYears = Math.max(0, longevityData.adjusted - currentAge);
  const planningAge = Math.min(longevityData.adjusted + 5, 100);

  return (
    <div className="p-4 rounded-lg border bg-purple-50">
      <h4 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
        <Star className="w-5 h-5" />
        {isFrench ? 'Analyse de Longévité Personnalisée' : 'Personalized Longevity Analysis'}
      </h4>
      
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-700">
            {remainingYears.toFixed(1)} {isFrench ? 'ans' : 'years'}
          </div>
          <div className="text-sm text-gray-600">
            {isFrench ? 'Espérance de vie' : 'Life expectancy'}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700">
            {longevityData.adjusted.toFixed(0)} {isFrench ? 'ans' : 'years'}
          </div>
          <div className="text-sm text-gray-600">
            {isFrench ? 'Âge final estimé' : 'Estimated final age'}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-700">
            {planningAge} {isFrench ? 'ans' : 'years'}
          </div>
          <div className="text-sm text-gray-600">
            {isFrench ? 'Planification jusqu\'à' : 'Planning until'}
          </div>
        </div>
      </div>

      {/* Détail des ajustements */}
      <div className="bg-white rounded-lg p-3 mb-3">
        <h5 className="font-semibold text-gray-800 mb-2 text-sm">
          {isFrench ? 'Ajustements appliqués:' : 'Applied adjustments:'}
        </h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">{isFrench ? 'Base:' : 'Base:'}</span>
            <span className="font-medium">{longevityData.base} {isFrench ? 'ans' : 'years'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{isFrench ? 'Santé:' : 'Health:'}</span>
            <span className={`font-medium ${longevityData.adjustments.health >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {longevityData.adjustments.health >= 0 ? '+' : ''}{longevityData.adjustments.health.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{isFrench ? 'Mode de vie:' : 'Lifestyle:'}</span>
            <span className={`font-medium ${longevityData.adjustments.lifestyle >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {longevityData.adjustments.lifestyle >= 0 ? '+' : ''}{longevityData.adjustments.lifestyle.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{isFrench ? 'Finance:' : 'Financial:'}</span>
            <span className={`font-medium ${longevityData.adjustments.financial >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {longevityData.adjustments.financial >= 0 ? '+' : ''}{longevityData.adjustments.financial.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{isFrench ? 'Risque:' : 'Risk:'}</span>
            <span className={`font-medium ${longevityData.adjustments.risk >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {longevityData.adjustments.risk >= 0 ? '+' : ''}{longevityData.adjustments.risk.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{isFrench ? 'Revenus:' : 'Income:'}</span>
            <span className={`font-medium ${longevityData.adjustments.income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {longevityData.adjustments.income >= 0 ? '+' : ''}{longevityData.adjustments.income.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Impact des revenus synchronisés */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3">
        <h5 className="font-semibold text-green-800 mb-2 text-sm flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          {isFrench ? 'Impact des Revenus Synchronisés:' : 'Synchronized Income Impact:'}
        </h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">{isFrench ? 'Revenus totaux:' : 'Total income:'}</span>
            <span className="font-medium text-green-700">
              ${incomeData.totalHouseholdIncome.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{isFrench ? 'Multiplicateur santé:' : 'Health multiplier:'}</span>
            <span className="font-medium text-blue-700">
              {incomeImpact.healthMultiplier.toFixed(2)}x
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{isFrench ? 'Réduction stress:' : 'Stress reduction:'}</span>
            <span className="font-medium text-purple-700">
              {(incomeImpact.stressReduction * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{isFrench ? 'Ajustement longévité:' : 'Longevity adjustment:'}</span>
            <span className={`font-medium ${incomeImpact.lifeExpectancyAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {incomeImpact.lifeExpectancyAdjustment >= 0 ? '+' : ''}{incomeImpact.lifeExpectancyAdjustment.toFixed(1)} {isFrench ? 'ans' : 'years'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedLongevityAnalysis;
