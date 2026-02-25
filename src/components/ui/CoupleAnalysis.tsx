import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Heart,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calculator,
  Target
} from 'lucide-react';
import { UserData } from '@/types';

interface CoupleAnalysisProps {
  userData: UserData;
  isFrench: boolean;
}

interface CoupleSurvivalData {
  year: number;
  person1Survival: number;
  person2Survival: number;
  jointSurvival: number;
  expectedLongevity: number;
}

interface CoupleMetrics {
  jointLifeExpectancy: number;
  longerLivingProbability: number;
  bothAliveAt65: number;
  bothAliveAt70: number;
  bothAliveAt75: number;
  bothAliveAt80: number;
  carePlanningYears: number;
  inheritancePlanningYears: number;
}

const CoupleAnalysis: React.FC<CoupleAnalysisProps> = ({
  userData,
  isFrench
}) => {
  const [selectedAge, setSelectedAge] = useState<number>(65);

  // Calculate individual life expectancies
  const calculateIndividualLifeExpectancy = (personNumber: 1 | 2) => {
    const personal = userData.personal || {};
    const fieldSuffix = personNumber === 1 ? '1' : '2';

    // Base life expectancy from CPM2014
    const baseLifeExpectancy = personal[`sexe${fieldSuffix}`] === 'F' ? 85.2 : 81.8;

    // Health adjustments
    const healthCoefficients: { [key: string]: number } = {
      'excellent': 2.8, 'tresbon': 1.9, 'bon': 0.7, 'moyen': -1.4, 'fragile': -3.2
    };

    const lifestyleCoefficients: { [key: string]: number } = {
      'tresActif': 2.1, 'actif': 1.4, 'modere': 0.6, 'legerementActif': -0.3, 'sedentaire': -1.8
    };

    const smokingCoefficients: { [key: string]: number } = {
      'never': 0, 'former': -1.2, 'current': -2.8
    };

    const healthAdjustment = healthCoefficients[personal[`etatSante${fieldSuffix}`] || 'bon'] || 0.7;
    const lifestyleAdjustment = lifestyleCoefficients[personal[`modeVieActif${fieldSuffix}`] || 'modere'] || 0.6;
    const smokingAdjustment = smokingCoefficients[personal[`statutTabagique${fieldSuffix}`] || 'never'] || 0;

    const totalAdjustment = Math.max(-4.0, Math.min(4.0, healthAdjustment + lifestyleAdjustment + smokingAdjustment));

    return Math.max(65, Math.min(105, baseLifeExpectancy + totalAdjustment));
  };

  const person1LifeExpectancy = calculateIndividualLifeExpectancy(1);
  const person2LifeExpectancy = calculateIndividualLifeExpectancy(2);

  // Calculate couple survival data
  const coupleData = useMemo((): CoupleSurvivalData[] => {
    const data: CoupleSurvivalData[] = [];
    const maxAge = Math.max(person1LifeExpectancy, person2LifeExpectancy) + 5;

    for (let age = 60; age <= maxAge; age += 2) {
      const person1Age = age;
      const person2Age = age;

      // Calculate survival probabilities (simplified model)
      const person1Survival = person1Age <= person1LifeExpectancy ?
        Math.max(0, 100 - (person1Age - 60) * 2) : 0;
      const person2Survival = person2Age <= person2LifeExpectancy ?
        Math.max(0, 100 - (person2Age - 60) * 2) : 0;

      // Joint survival probability (simplified - assumes independence)
      const jointSurvival = (person1Survival / 100) * (person2Survival / 100) * 100;

      // Expected longevity for planning
      const expectedLongevity = Math.max(person1Age, person2Age);

      data.push({
        year: age,
        person1Survival,
        person2Survival,
        jointSurvival,
        expectedLongevity
      });
    }

    return data;
  }, [person1LifeExpectancy, person2LifeExpectancy]);

  // Calculate couple metrics
  const coupleMetrics = useMemo((): CoupleMetrics => {
    const jointLifeExpectancy = Math.min(person1LifeExpectancy, person2LifeExpectancy) +
                               (Math.abs(person1LifeExpectancy - person2LifeExpectancy) * 0.3);

    // Calculate probabilities of both being alive at different ages
    const calculateBothAliveProbability = (targetAge: number) => {
      const p1Alive = targetAge <= person1LifeExpectancy ? 0.8 : 0.2;
      const p2Alive = targetAge <= person2LifeExpectancy ? 0.8 : 0.2;
      return p1Alive * p2Alive * 100;
    };

    return {
      jointLifeExpectancy,
      longerLivingProbability: Math.max(person1LifeExpectancy, person2LifeExpectancy),
      bothAliveAt65: calculateBothAliveProbability(65),
      bothAliveAt70: calculateBothAliveProbability(70),
      bothAliveAt75: calculateBothAliveProbability(75),
      bothAliveAt80: calculateBothAliveProbability(80),
      carePlanningYears: Math.max(0, jointLifeExpectancy - 75),
      inheritancePlanningYears: Math.max(0, Math.max(person1LifeExpectancy, person2LifeExpectancy) - 80)
    };
  }, [person1LifeExpectancy, person2LifeExpectancy]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{isFrench ? `Âge: ${label} ans` : `Age: ${label} years`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}{entry.dataKey.includes('Survival') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getAgeMilestone = (age: number) => {
    const data = coupleData.find(d => d.year === age);
    return data || coupleData[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          {isFrench ? 'Analyse de Couple' : 'Couple Analysis'}
        </h3>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {isFrench ? 'Analyse Conjointe' : 'Joint Analysis'}
        </Badge>
      </div>

      {/* Individual Life Expectancies */}
      <Card className="bg-gradient-to-r from-pink-50 to-rose-50">
        <CardHeader>
          <CardTitle className="text-lg text-pink-800 flex items-center gap-2">
            <Users className="w-5 h-5" />
            {isFrench ? 'Espérances de Vie Individuelles' : 'Individual Life Expectancies'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-mpr-navy mb-2">
                {person1LifeExpectancy.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {isFrench ? 'Personne 1' : 'Person 1'}
              </div>
              <div className="text-xs text-gray-500">
                {userData.personal?.[`sexe1`] === 'F' ? (isFrench ? 'Femme' : 'Female') : (isFrench ? 'Homme' : 'Male')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">
                {person2LifeExpectancy.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {isFrench ? 'Personne 2' : 'Person 2'}
              </div>
              <div className="text-xs text-gray-500">
                {userData.personal?.[`sexe2`] === 'F' ? (isFrench ? 'Femme' : 'Female') : (isFrench ? 'Homme' : 'Male')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Joint Survival Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isFrench ? 'Probabilités de Survie Conjointe' : 'Joint Survival Probabilities'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={coupleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: isFrench ? 'Âge' : 'Age', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: isFrench ? 'Probabilité (%)' : 'Probability (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="person1Survival"
                stroke="#3B82F6"
                strokeWidth={2}
                name={isFrench ? 'Personne 1' : 'Person 1'}
              />
              <Line
                type="monotone"
                dataKey="person2Survival"
                stroke="#10B981"
                strokeWidth={2}
                name={isFrench ? 'Personne 2' : 'Person 2'}
              />
              <Line
                type="monotone"
                dataKey="jointSurvival"
                stroke="#EF4444"
                strokeWidth={3}
                strokeDasharray="5 5"
                name={isFrench ? 'Survie Conjointe' : 'Joint Survival'}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Age Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {isFrench ? 'Jalons d\'Âge Importants' : 'Important Age Milestones'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[65, 70, 75, 80].map(age => {
              const milestone = getAgeMilestone(age);
              return (
                <div key={age} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-800 mb-1">{age}</div>
                  <div className="text-xs text-gray-600 mb-2">
                    {isFrench ? 'ans' : 'years'}
                  </div>
                  <div className="text-sm font-medium text-mpr-interactive">
                    {milestone.jointSurvival.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {isFrench ? 'survie conjointe' : 'joint survival'}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Couple Planning Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {isFrench ? 'Métriques de Planification' : 'Planning Metrics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {isFrench ? 'Espérance de vie conjointe:' : 'Joint life expectancy:'}
                </span>
                <span className="font-bold text-lg">
                  {coupleMetrics.jointLifeExpectancy.toFixed(1)} {isFrench ? 'ans' : 'years'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {isFrench ? 'Plus longue espérance:' : 'Longer life expectancy:'}
                </span>
                <span className="font-bold text-lg">
                  {coupleMetrics.longerLivingProbability.toFixed(1)} {isFrench ? 'ans' : 'years'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {isFrench ? 'Années de soins à planifier:' : 'Care planning years:'}
                </span>
                <span className="font-bold text-lg">
                  {coupleMetrics.carePlanningYears.toFixed(1)} {isFrench ? 'ans' : 'years'}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {isFrench ? 'Probabilité survie à 75 ans:' : 'Survival probability at 75:'}
                </span>
                <span className="font-bold text-lg">
                  {coupleMetrics.bothAliveAt75.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {isFrench ? 'Probabilité survie à 80 ans:' : 'Survival probability at 80:'}
                </span>
                <span className="font-bold text-lg">
                  {coupleMetrics.bothAliveAt80.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {isFrench ? 'Planification succession:' : 'Inheritance planning:'}
                </span>
                <span className="font-bold text-lg">
                  {coupleMetrics.inheritancePlanningYears.toFixed(1)} {isFrench ? 'ans' : 'years'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planning Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-green-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {isFrench ? 'Recommandations de Planification' : 'Planning Recommendations'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-green-800">
                  {isFrench ? 'Assurance Vie et Succession' : 'Life Insurance and Estate Planning'}
                </div>
                <div className="text-sm text-green-700 mt-1">
                  {isFrench
                    ? `Planifiez pour ${coupleMetrics.inheritancePlanningYears.toFixed(0)} années potentielles de survie du conjoint survivant.`
                    : `Plan for ${coupleMetrics.inheritancePlanningYears.toFixed(0)} potential years of surviving spouse.`
                  }
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-mpr-interactive-lt rounded-lg">
              <Target className="w-5 h-5 text-mpr-interactive mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-mpr-navy">
                  {isFrench ? 'Soins de Longue Durée' : 'Long-term Care Planning'}
                </div>
                <div className="text-sm text-mpr-navy mt-1">
                  {isFrench
                    ? `Préparez-vous pour ${coupleMetrics.carePlanningYears.toFixed(0)} années potentielles de soins requis.`
                    : `Prepare for ${coupleMetrics.carePlanningYears.toFixed(0)} potential years of care needs.`
                  }
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <Heart className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-purple-800">
                  {isFrench ? 'Planification Financière Conjointe' : 'Joint Financial Planning'}
                </div>
                <div className="text-sm text-purple-700 mt-1">
                  {isFrench
                    ? 'Considérez les scénarios où un conjoint survit plus longtemps que l\'autre.'
                    : 'Consider scenarios where one spouse outlives the other.'
                  }
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {isFrench ? 'Évaluation des Risques' : 'Risk Assessment'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Math.abs(person1LifeExpectancy - person2LifeExpectancy) > 5 && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-orange-800">
                    {isFrench ? 'Écart d\'Espérance de Vie' : 'Life Expectancy Gap'}
                  </div>
                  <div className="text-sm text-orange-700 mt-1">
                    {isFrench
                      ? `Écart significatif de ${(Math.abs(person1LifeExpectancy - person2LifeExpectancy)).toFixed(1)} années entre les conjoints.`
                      : `Significant gap of ${(Math.abs(person1LifeExpectancy - person2LifeExpectancy)).toFixed(1)} years between spouses.`
                    }
                  </div>
                </div>
              </div>
            )}

            {coupleMetrics.bothAliveAt75 < 30 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-red-800">
                    {isFrench ? 'Risque de Survie Conjointe Faible' : 'Low Joint Survival Risk'}
                  </div>
                  <div className="text-sm text-red-700 mt-1">
                    {isFrench
                      ? 'Probabilité faible de survie conjointe à 75 ans. Planification accrue recommandée.'
                      : 'Low probability of joint survival to age 75. Increased planning recommended.'
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoupleAnalysis;
