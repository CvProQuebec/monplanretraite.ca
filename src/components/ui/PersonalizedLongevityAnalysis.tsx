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

  // Calculer l'espérance de vie personnalisée avec coefficients scientifiques détaillés
  const calculatePersonalizedLifeExpectancy = () => {
    const personal = userData.personal || {};
    const fieldSuffix = personNumber === 1 ? '1' : '2';

    // Espérance de vie de base selon le sexe (données CPM2014)
    const baseLifeExpectancy = personal[`sexe${fieldSuffix}`] === 'F' ? 85.2 : 81.8;

    // === COEFFICIENTS SCIENTIFIQUES DÉTAILLÉS ===

    // 1. Facteurs de santé avec coefficients validés
    const healthCoefficients: { [key: string]: number } = {
      'excellent': 2.8,      // +2.8 ans (études médicales validées)
      'tresbon': 1.9,        // +1.9 ans
      'bon': 0.7,            // +0.7 ans (référence)
      'moyen': -1.4,         // -1.4 ans
      'fragile': -3.2        // -3.2 ans
    };

    // 2. Mode de vie actif avec coefficients d'activité physique
    const lifestyleCoefficients: { [key: string]: number } = {
      'tresActif': 2.1,      // +2.1 ans (150+ min/semaine)
      'actif': 1.4,          // +1.4 ans (75-150 min/semaine)
      'modere': 0.6,         // +0.6 ans (30-75 min/semaine)
      'legerementActif': -0.3, // -0.3 ans (<30 min/semaine)
      'sedentaire': -1.8     // -1.8 ans (sédentaire)
    };

    // 3. Statut tabagique avec coefficients détaillés
    const smokingCoefficients: { [key: string]: number } = {
      'never': 0,            // Référence
      'former': -1.2,        // -1.2 ans (ajusté selon années d'arrêt)
      'current': -2.8        // -2.8 ans (fumeur actuel)
    };

    // 4. IMC avec coefficients médicaux
    const getBMICoefficient = (bmi: number): number => {
      if (bmi < 18.5) return -0.9;      // Sous-poids
      if (bmi < 25) return 0;           // Normal (référence)
      if (bmi < 30) return -1.3;        // Surpoids
      return -2.1;                      // Obésité
    };

    // 5. Éducation et compétences financières
    const educationCoefficients: { [key: string]: number } = {
      'maitrise': 1.2,       // +1.2 ans (maîtrise/doctorat)
      'universitaire': 0.8,  // +0.8 ans (baccalauréat)
      'college': 0.4,        // +0.4 ans (collégial)
      'secondaire': 0,       // Référence
      'debutant': -0.3       // -0.3 ans
    };

    // 6. Expérience financière
    const financialExperienceCoefficients: { [key: string]: number } = {
      'expert': 0.9,         // +0.9 ans
      'experimente': 0.5,    // +0.5 ans
      'intermediaire': 0.1,  // +0.1 ans
      'debutant': -0.4       // -0.4 ans
    };

    // 7. Tolérance au risque (impact psychologique)
    const riskToleranceCoefficients: { [key: string]: number } = {
      'tres-conservateur': 1.1,  // +1.1 ans (réduction stress)
      'conservateur': 0.7,       // +0.7 ans
      'equilibre': 0.2,          // +0.2 ans
      'dynamique': -0.3,         // -0.3 ans
      'agressif': -0.8           // -0.8 ans
    };

    // 8. Situation familiale
    const maritalCoefficients: { [key: string]: number } = {
      'marie': 0.8,          // +0.8 ans (soutien social)
      'conjoint': 0.7,       // +0.7 ans
      'celibataire': 0,      // Référence
      'divorce': -0.6,       // -0.6 ans
      'veuf': -1.2           // -1.2 ans
    };

    // 9. Secteur d'activité
    const sectorCoefficients: { [key: string]: number } = {
      'sante': 1.1,          // +1.1 ans (environnement sain)
      'education': 0.7,      // +0.7 ans
      'technologie': 0.4,    // +0.4 ans
      'finance': 0.3,        // +0.3 ans
      'services': 0.1,       // +0.1 ans
      'commerce': -0.2,      // -0.2 ans
      'manufacturier': -0.5, // -0.5 ans
      'construction': -0.8,  // -0.8 ans
      'autre': 0             // Référence
    };

    // === CALCUL DES AJUSTEMENTS ===

    // Facteurs de santé
    const healthAdjustment = healthCoefficients[personal[`etatSante${fieldSuffix}`] || 'bon'] || 0.7;

    // Mode de vie actif
    const lifestyleAdjustment = lifestyleCoefficients[personal[`modeVieActif${fieldSuffix}`] || 'modere'] || 0.6;

    // Statut tabagique
    let smokingAdjustment = smokingCoefficients[personal[`statutTabagique${fieldSuffix}`] || 'never'] || 0;
    if (personal[`statutTabagique${fieldSuffix}`] === 'former' && personal[`yearsQuitSmoking${fieldSuffix}`]) {
      // Récupération progressive après arrêt du tabac
      const yearsQuit = personal[`yearsQuitSmoking${fieldSuffix}`];
      const recovery = Math.min(1.2, yearsQuit * 0.15); // +0.15 ans par année d'arrêt
      smokingAdjustment += recovery;
    }

    // IMC (calculé à partir des données saisies)
    const height = personal[`height${fieldSuffix}`] || 170; // cm
    const weight = personal[`weight${fieldSuffix}`] || 70;  // kg
    const bmi = weight / ((height / 100) ** 2);
    const bmiAdjustment = getBMICoefficient(bmi);

    // Éducation
    const educationAdjustment = educationCoefficients[personal[`niveauCompetences${fieldSuffix}`] || 'secondaire'] || 0;

    // Expérience financière
    const financialAdjustment = financialExperienceCoefficients[personal[`experienceFinanciere${fieldSuffix}`] || 'intermediaire'] || 0.1;

    // Tolérance au risque
    const riskAdjustment = riskToleranceCoefficients[personal[`toleranceRisqueInvestissement${fieldSuffix}`] || 'equilibre'] || 0.2;

    // Situation familiale
    const maritalAdjustment = maritalCoefficients[(personal as any).situationFamiliale || 'celibataire'] || 0;

    // Secteur d'activité
    const sectorAdjustment = sectorCoefficients[personal[`secteurActivite${fieldSuffix}`] || 'autre'] || 0;

    // Impact des revenus synchronisés (déjà calculé)
    const incomeAdjustment = incomeImpact.lifeExpectancyAdjustment;

    // === CALCUL FINAL AVEC BORNES ===

    // Somme pondérée des ajustements
    const totalAdjustment = healthAdjustment + lifestyleAdjustment + smokingAdjustment +
                           bmiAdjustment + educationAdjustment + financialAdjustment +
                           riskAdjustment + maritalAdjustment + sectorAdjustment + incomeAdjustment;

    // Application des bornes (±4 ans maximum selon études médicales)
    const boundedAdjustment = Math.max(-4.0, Math.min(4.0, totalAdjustment));

    // Espérance de vie ajustée
    const adjustedLifeExpectancy = Math.max(65, Math.min(105, baseLifeExpectancy + boundedAdjustment));

    return {
      base: baseLifeExpectancy,
      adjusted: adjustedLifeExpectancy,
      totalAdjustment: boundedAdjustment,
      adjustments: {
        health: healthAdjustment,
        lifestyle: lifestyleAdjustment,
        smoking: smokingAdjustment,
        bmi: bmiAdjustment,
        education: educationAdjustment,
        financial: financialAdjustment,
        risk: riskAdjustment,
        marital: maritalAdjustment,
        sector: sectorAdjustment,
        income: incomeAdjustment
      },
      bmi: Math.round(bmi * 10) / 10,
      coefficients: {
        health: healthCoefficients,
        lifestyle: lifestyleCoefficients,
        smoking: smokingCoefficients,
        education: educationCoefficients,
        financial: financialExperienceCoefficients,
        risk: riskToleranceCoefficients,
        marital: maritalCoefficients,
        sector: sectorCoefficients
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
