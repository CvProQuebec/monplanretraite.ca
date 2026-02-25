import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Activity } from 'lucide-react';
import { UserData } from '@/types';

interface LongevityImpactChartsProps {
  userData: UserData;
  isFrench: boolean;
  personNumber: 1 | 2;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

const LongevityImpactCharts: React.FC<LongevityImpactChartsProps> = ({
  userData,
  isFrench,
  personNumber
}) => {
  // Calculate longevity data similar to PersonalizedLongevityAnalysis
  const longevityData = useMemo(() => {
    const personal = userData.personal || {};
    const fieldSuffix = personNumber === 1 ? '1' : '2';

    const baseLifeExpectancy = personal[`sexe${fieldSuffix}`] === 'F' ? 85.2 : 81.8;

    // Health factors data for charts
    const healthFactors = [
      {
        factor: isFrench ? 'Santé' : 'Health',
        value: personal[`etatSante${fieldSuffix}`] === 'excellent' ? 100 :
               personal[`etatSante${fieldSuffix}`] === 'tresbon' ? 80 :
               personal[`etatSante${fieldSuffix}`] === 'bon' ? 60 :
               personal[`etatSante${fieldSuffix}`] === 'moyen' ? 40 : 20,
        impact: personal[`etatSante${fieldSuffix}`] === 'excellent' ? 2.8 :
                personal[`etatSante${fieldSuffix}`] === 'tresbon' ? 1.9 :
                personal[`etatSante${fieldSuffix}`] === 'bon' ? 0.7 :
                personal[`etatSante${fieldSuffix}`] === 'moyen' ? -1.4 : -3.2
      },
      {
        factor: isFrench ? 'Mode de Vie' : 'Lifestyle',
        value: personal[`modeVieActif${fieldSuffix}`] === 'tresActif' ? 100 :
               personal[`modeVieActif${fieldSuffix}`] === 'actif' ? 80 :
               personal[`modeVieActif${fieldSuffix}`] === 'modere' ? 60 :
               personal[`modeVieActif${fieldSuffix}`] === 'legerementActif' ? 40 : 20,
        impact: personal[`modeVieActif${fieldSuffix}`] === 'tresActif' ? 2.1 :
                personal[`modeVieActif${fieldSuffix}`] === 'actif' ? 1.4 :
                personal[`modeVieActif${fieldSuffix}`] === 'modere' ? 0.6 :
                personal[`modeVieActif${fieldSuffix}`] === 'legerementActif' ? -0.3 : -1.8
      },
      {
        factor: isFrench ? 'Éducation' : 'Education',
        value: personal[`niveauCompetences${fieldSuffix}`] === 'maitrise' ? 100 :
               personal[`niveauCompetences${fieldSuffix}`] === 'universitaire' ? 80 :
               personal[`niveauCompetences${fieldSuffix}`] === 'college' ? 60 :
               personal[`niveauCompetences${fieldSuffix}`] === 'secondaire' ? 40 : 20,
        impact: personal[`niveauCompetences${fieldSuffix}`] === 'maitrise' ? 1.2 :
                personal[`niveauCompetences${fieldSuffix}`] === 'universitaire' ? 0.8 :
                personal[`niveauCompetences${fieldSuffix}`] === 'college' ? 0.4 :
                personal[`niveauCompetences${fieldSuffix}`] === 'secondaire' ? 0 : -0.3
      },
      {
        factor: isFrench ? 'Finance' : 'Financial',
        value: personal[`experienceFinanciere${fieldSuffix}`] === 'expert' ? 100 :
               personal[`experienceFinanciere${fieldSuffix}`] === 'experimente' ? 80 :
               personal[`experienceFinanciere${fieldSuffix}`] === 'intermediaire' ? 60 :
               personal[`experienceFinanciere${fieldSuffix}`] === 'debutant' ? 40 : 20,
        impact: personal[`experienceFinanciere${fieldSuffix}`] === 'expert' ? 0.9 :
                personal[`experienceFinanciere${fieldSuffix}`] === 'experimente' ? 0.5 :
                personal[`experienceFinanciere${fieldSuffix}`] === 'intermediaire' ? 0.1 :
                personal[`experienceFinanciere${fieldSuffix}`] === 'debutant' ? -0.4 : -0.4
      },
      {
        factor: isFrench ? 'Risque' : 'Risk',
        value: personal[`toleranceRisqueInvestissement${fieldSuffix}`] === 'tres-conservateur' ? 100 :
               personal[`toleranceRisqueInvestissement${fieldSuffix}`] === 'conservateur' ? 80 :
               personal[`toleranceRisqueInvestissement${fieldSuffix}`] === 'equilibre' ? 60 :
               personal[`toleranceRisqueInvestissement${fieldSuffix}`] === 'dynamique' ? 40 : 20,
        impact: personal[`toleranceRisqueInvestissement${fieldSuffix}`] === 'tres-conservateur' ? 1.1 :
                personal[`toleranceRisqueInvestissement${fieldSuffix}`] === 'conservateur' ? 0.7 :
                personal[`toleranceRisqueInvestissement${fieldSuffix}`] === 'equilibre' ? 0.2 :
                personal[`toleranceRisqueInvestissement${fieldSuffix}`] === 'dynamique' ? -0.3 : -0.8
      }
    ];

    // Age progression data for line chart
    const currentAge = new Date().getFullYear() - (personal[`naissance${fieldSuffix}`] ?
      new Date(personal[`naissance${fieldSuffix}`]).getFullYear() : 1960);

    const ageProgression = [];
    for (let age = currentAge; age <= baseLifeExpectancy + 5; age += 2) {
      const remainingLife = Math.max(0, baseLifeExpectancy - age);
      ageProgression.push({
        age,
        remainingLife: remainingLife.toFixed(1),
        healthScore: Math.max(0, 100 - (age - currentAge) * 2)
      });
    }

    // Impact distribution for pie chart
    const impactDistribution = [
      { name: isFrench ? 'Santé' : 'Health', value: Math.abs(healthFactors[0].impact), color: '#8884d8' },
      { name: isFrench ? 'Mode de Vie' : 'Lifestyle', value: Math.abs(healthFactors[1].impact), color: '#82ca9d' },
      { name: isFrench ? 'Éducation' : 'Education', value: Math.abs(healthFactors[2].impact), color: '#ffc658' },
      { name: isFrench ? 'Finance' : 'Financial', value: Math.abs(healthFactors[3].impact), color: '#ff7c7c' },
      { name: isFrench ? 'Risque' : 'Risk', value: Math.abs(healthFactors[4].impact), color: '#8dd1e1' }
    ];

    return {
      healthFactors,
      ageProgression,
      impactDistribution,
      baseLifeExpectancy,
      currentAge
    };
  }, [userData, isFrench, personNumber]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey.includes('impact') ? ' ans' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          {isFrench ? 'Visualisations d\'Impact sur la Longévité' : 'Longevity Impact Visualizations'}
        </h3>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Target className="w-3 h-3" />
          {isFrench ? 'Analyse Avancée' : 'Advanced Analysis'}
        </Badge>
      </div>

      {/* Radar Chart - Health Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isFrench ? 'Facteurs de Santé - Radar' : 'Health Factors - Radar'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={longevityData.healthFactors}>
              <PolarGrid />
              <PolarAngleAxis dataKey="factor" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name={isFrench ? 'Score' : 'Score'}
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart - Impact Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isFrench ? 'Impact sur l\'Espérance de Vie' : 'Life Expectancy Impact'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={longevityData.healthFactors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="factor" />
              <YAxis label={{ value: isFrench ? 'Années' : 'Years', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="impact" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart - Age Progression */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isFrench ? 'Progression de l\'Âge et Espérance de Vie' : 'Age Progression & Life Expectancy'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={longevityData.ageProgression}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" label={{ value: isFrench ? 'Âge' : 'Age', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: isFrench ? 'Années Restantes' : 'Years Remaining', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="remainingLife"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart - Impact Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isFrench ? 'Distribution des Impacts' : 'Impact Distribution'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={longevityData.impactDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {longevityData.impactDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card className="bg-gradient-to-r from-mpr-interactive-lt to-purple-50">
        <CardHeader>
          <CardTitle className="text-lg text-mpr-navy">
            {isFrench ? 'Résumé des Métriques' : 'Metrics Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-mpr-navy">
                {longevityData.healthFactors.reduce((sum, factor) => sum + Math.abs(factor.impact), 0).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">
                {isFrench ? 'Impact Total' : 'Total Impact'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {longevityData.healthFactors.filter(f => f.impact > 0).length}
              </div>
              <div className="text-sm text-gray-600">
                {isFrench ? 'Facteurs Positifs' : 'Positive Factors'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-700">
                {longevityData.healthFactors.filter(f => f.impact < 0).length}
              </div>
              <div className="text-sm text-gray-600">
                {isFrench ? 'Facteurs Négatifs' : 'Negative Factors'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">
                {((longevityData.healthFactors.reduce((sum, factor) => sum + factor.value, 0) / longevityData.healthFactors.length)).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">
                {isFrench ? 'Score Moyen' : 'Average Score'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LongevityImpactCharts;
