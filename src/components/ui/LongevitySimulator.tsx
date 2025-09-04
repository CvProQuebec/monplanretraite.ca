import React, { useState, useMemo, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Play,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Target,
  Calculator,
  Zap,
  Heart,
  DollarSign,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { UserData } from '@/types';

interface LongevitySimulatorProps {
  userData: UserData;
  currentLifeExpectancy: number;
  isFrench: boolean;
  personNumber: 1 | 2;
}

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  adjustments: {
    healthImprovement: number;
    lifestyleChange: number;
    smokingChange: number;
    weightChange: number;
    exerciseIncrease: number;
  };
  projectedLifeExpectancy: number;
  costSavings: number;
  qualityOfLife: number;
}

interface SimulationResult {
  baselineLifeExpectancy: number;
  projectedLifeExpectancy: number;
  yearsGained: number;
  costSavings: number;
  qualityOfLife: number;
  breakEvenAge: number;
  monthlySavings: number;
}

const LongevitySimulator: React.FC<LongevitySimulatorProps> = ({
  userData,
  currentLifeExpectancy,
  isFrench,
  personNumber
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('baseline');
  const [customAdjustments, setCustomAdjustments] = useState({
    healthScore: 50,
    exerciseHours: 2,
    smokingStatus: 'current' as 'never' | 'former' | 'current',
    bmiChange: 0,
    stressLevel: 50
  });

  // Predefined scenarios
  const scenarios = useMemo((): SimulationScenario[] => {
    const baseAdjustments = {
      healthImprovement: 0,
      lifestyleChange: 0,
      smokingChange: 0,
      weightChange: 0,
      exerciseIncrease: 0
    };

    return [
      {
        id: 'baseline',
        name: isFrench ? 'Situation Actuelle' : 'Current Situation',
        description: isFrench ? 'Vos habitudes actuelles' : 'Your current habits',
        adjustments: { ...baseAdjustments },
        projectedLifeExpectancy: currentLifeExpectancy,
        costSavings: 0,
        qualityOfLife: 50
      },
      {
        id: 'quit-smoking',
        name: isFrench ? 'Arrêter de Fumer' : 'Quit Smoking',
        description: isFrench ? 'Arrêter complètement de fumer' : 'Quit smoking completely',
        adjustments: {
          ...baseAdjustments,
          smokingChange: 2.8,
          healthImprovement: 1.0
        },
        projectedLifeExpectancy: currentLifeExpectancy + 3.8,
        costSavings: 2400, // Annual savings from cigarettes
        qualityOfLife: 75
      },
      {
        id: 'exercise-routine',
        name: isFrench ? 'Routine d\'Exercice' : 'Exercise Routine',
        description: isFrench ? '150 minutes d\'exercice par semaine' : '150 minutes of exercise per week',
        adjustments: {
          ...baseAdjustments,
          exerciseIncrease: 2.1,
          lifestyleChange: 1.2
        },
        projectedLifeExpectancy: currentLifeExpectancy + 3.3,
        costSavings: 800, // Gym membership + equipment
        qualityOfLife: 80
      },
      {
        id: 'healthy-diet',
        name: isFrench ? 'Alimentation Saine' : 'Healthy Diet',
        description: isFrench ? 'Adopter une alimentation équilibrée' : 'Adopt a balanced diet',
        adjustments: {
          ...baseAdjustments,
          weightChange: 1.5,
          healthImprovement: 1.8
        },
        projectedLifeExpectancy: currentLifeExpectancy + 3.3,
        costSavings: 1200, // Cost difference vs unhealthy eating
        qualityOfLife: 75
      },
      {
        id: 'stress-management',
        name: isFrench ? 'Gestion du Stress' : 'Stress Management',
        description: isFrench ? 'Techniques de méditation et relaxation' : 'Meditation and relaxation techniques',
        adjustments: {
          ...baseAdjustments,
          lifestyleChange: 1.1,
          healthImprovement: 0.8
        },
        projectedLifeExpectancy: currentLifeExpectancy + 1.9,
        costSavings: 600, // Cost of classes/programs
        qualityOfLife: 85
      },
      {
        id: 'comprehensive',
        name: isFrench ? 'Programme Complet' : 'Comprehensive Program',
        description: isFrench ? 'Tous les changements combinés' : 'All changes combined',
        adjustments: {
          healthImprovement: 2.5,
          lifestyleChange: 2.8,
          smokingChange: 2.8,
          weightChange: 1.5,
          exerciseIncrease: 2.1
        },
        projectedLifeExpectancy: currentLifeExpectancy + 8.2,
        costSavings: 1800,
        qualityOfLife: 90
      }
    ];
  }, [currentLifeExpectancy, isFrench]);

  // Calculate custom simulation
  const customSimulation = useMemo((): SimulationResult => {
    const { healthScore, exerciseHours, smokingStatus, bmiChange, stressLevel } = customAdjustments;

    // Calculate adjustments based on custom inputs
    let totalAdjustment = 0;

    // Health score adjustment (0-100 scale)
    totalAdjustment += (healthScore - 50) * 0.04; // ±2 years max

    // Exercise adjustment (0-7 hours/week)
    const exerciseAdjustment = Math.min(exerciseHours * 0.3, 2.1);
    totalAdjustment += exerciseAdjustment;

    // Smoking adjustment
    const smokingAdjustments = {
      'never': 0,
      'former': -1.2,
      'current': -2.8
    };
    totalAdjustment += smokingAdjustments[smokingStatus];

    // BMI adjustment (±10 points)
    totalAdjustment += bmiChange * 0.1;

    // Stress adjustment (inverse relationship)
    const stressAdjustment = (50 - stressLevel) * 0.02;
    totalAdjustment += stressAdjustment;

    // Bound the adjustment
    const boundedAdjustment = Math.max(-4.0, Math.min(6.0, totalAdjustment));
    const projectedLifeExpectancy = currentLifeExpectancy + boundedAdjustment;

    // Calculate cost savings (rough estimates)
    let costSavings = 0;
    if (smokingStatus === 'former') costSavings += 2400;
    if (exerciseHours > 3) costSavings += 400;
    if (bmiChange < -2) costSavings += 800; // Weight loss programs

    // Quality of life score
    const qualityOfLife = Math.min(100, 50 + (boundedAdjustment * 8) + (healthScore - 50) * 0.5);

    // Break-even analysis
    const breakEvenAge = currentLifeExpectancy + (costSavings / 1000); // Rough estimate

    return {
      baselineLifeExpectancy: currentLifeExpectancy,
      projectedLifeExpectancy,
      yearsGained: boundedAdjustment,
      costSavings,
      qualityOfLife,
      breakEvenAge,
      monthlySavings: costSavings / 12
    };
  }, [customAdjustments, currentLifeExpectancy]);

  // Get selected scenario data
  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario) || scenarios[0];

  // Generate projection data for charts
  const projectionData = useMemo(() => {
    const data = [];
    const maxAge = Math.max(currentLifeExpectancy, customSimulation.projectedLifeExpectancy) + 5;

    for (let age = Math.max(30, Math.floor(currentLifeExpectancy - 30)); age <= maxAge; age += 2) {
      const baselineRemaining = Math.max(0, currentLifeExpectancy - age);
      const projectedRemaining = Math.max(0, customSimulation.projectedLifeExpectancy - age);

      data.push({
        age,
        baseline: baselineRemaining,
        projected: projectedRemaining,
        difference: projectedRemaining - baselineRemaining
      });
    }

    return data;
  }, [currentLifeExpectancy, customSimulation.projectedLifeExpectancy]);

  const handleCustomAdjustment = useCallback((key: string, value: any) => {
    setCustomAdjustments(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetCustomAdjustments = useCallback(() => {
    setCustomAdjustments({
      healthScore: 50,
      exerciseHours: 2,
      smokingStatus: 'current',
      bmiChange: 0,
      stressLevel: 50
    });
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{isFrench ? `Âge: ${label} ans` : `Age: ${label} years`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)} {entry.dataKey === 'baseline' || entry.dataKey === 'projected' ? (isFrench ? 'ans restants' : 'years remaining') : ''}
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
          <Zap className="w-5 h-5" />
          {isFrench ? 'Simulateur de Longévité' : 'Longevity Simulator'}
        </h3>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Calculator className="w-3 h-3" />
          {isFrench ? 'Scénarios Interactifs' : 'Interactive Scenarios'}
        </Badge>
      </div>

      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isFrench ? 'Choisir un Scénario' : 'Select a Scenario'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedScenario === scenario.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedScenario(scenario.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{scenario.name}</h4>
                  {selectedScenario === scenario.id && (
                    <Target className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
                <div className="text-sm">
                  <span className="font-medium text-green-600">
                    +{scenario.adjustments.healthImprovement +
                      scenario.adjustments.lifestyleChange +
                      scenario.adjustments.smokingChange +
                      scenario.adjustments.weightChange +
                      scenario.adjustments.exerciseIncrease} {isFrench ? 'ans' : 'years'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenario Results */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-green-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {isFrench ? 'Résultats du Scénario' : 'Scenario Results'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700 mb-2">
                {selectedScenarioData.projectedLifeExpectancy.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">
                {isFrench ? 'Espérance Projetée' : 'Projected Life Expectancy'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700 mb-2">
                +{(selectedScenarioData.projectedLifeExpectancy - currentLifeExpectancy).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">
                {isFrench ? 'Années Supplémentaires' : 'Additional Years'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700 mb-2">
                ${selectedScenarioData.costSavings.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {isFrench ? 'Économies Annuelles' : 'Annual Savings'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700 mb-2">
                {selectedScenarioData.qualityOfLife}%
              </div>
              <div className="text-sm text-gray-600">
                {isFrench ? 'Qualité de Vie' : 'Quality of Life'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Simulator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {isFrench ? 'Simulateur Personnalisé' : 'Custom Simulator'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium">
                  {isFrench ? 'Score de Santé Global (0-100)' : 'Overall Health Score (0-100)'}
                </Label>
                <Slider
                  value={[customAdjustments.healthScore]}
                  onValueChange={(value) => handleCustomAdjustment('healthScore', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {customAdjustments.healthScore}/100
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {isFrench ? 'Heures d\'Exercice par Semaine' : 'Exercise Hours per Week'}
                </Label>
                <Slider
                  value={[customAdjustments.exerciseHours]}
                  onValueChange={(value) => handleCustomAdjustment('exerciseHours', value[0])}
                  max={7}
                  min={0}
                  step={0.5}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {customAdjustments.exerciseHours} {isFrench ? 'heures' : 'hours'}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {isFrench ? 'Statut Tabagique' : 'Smoking Status'}
                </Label>
                <Select
                  value={customAdjustments.smokingStatus}
                  onValueChange={(value) => handleCustomAdjustment('smokingStatus', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">{isFrench ? 'Jamais fumé' : 'Never smoked'}</SelectItem>
                    <SelectItem value="former">{isFrench ? 'Ancien fumeur' : 'Former smoker'}</SelectItem>
                    <SelectItem value="current">{isFrench ? 'Fumeur actuel' : 'Current smoker'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {isFrench ? 'Changement d\'IMC' : 'BMI Change'}
                </Label>
                <Slider
                  value={[customAdjustments.bmiChange]}
                  onValueChange={(value) => handleCustomAdjustment('bmiChange', value[0])}
                  max={5}
                  min={-5}
                  step={0.5}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {customAdjustments.bmiChange > 0 ? '+' : ''}{customAdjustments.bmiChange} {isFrench ? 'points' : 'points'}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {isFrench ? 'Niveau de Stress (0-100)' : 'Stress Level (0-100)'}
                </Label>
                <Slider
                  value={[customAdjustments.stressLevel]}
                  onValueChange={(value) => handleCustomAdjustment('stressLevel', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {customAdjustments.stressLevel}/100
                </div>
              </div>

              <Button
                onClick={resetCustomAdjustments}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isFrench ? 'Réinitialiser' : 'Reset'}
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">
                    {isFrench ? 'Espérance de Vie' : 'Life Expectancy'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {customSimulation.projectedLifeExpectancy.toFixed(1)} {isFrench ? 'ans' : 'years'}
                </div>
                <div className="text-sm text-blue-600">
                  {customSimulation.yearsGained >= 0 ? '+' : ''}{customSimulation.yearsGained.toFixed(1)} {isFrench ? 'ans' : 'years'}
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">
                    {isFrench ? 'Économies Annuelles' : 'Annual Savings'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  ${customSimulation.costSavings.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">
                  ${customSimulation.monthlySavings.toFixed(0)}/{isFrench ? 'mois' : 'month'}
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-800">
                    {isFrench ? 'Qualité de Vie' : 'Quality of Life'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  {customSimulation.qualityOfLife.toFixed(0)}%
                </div>
                <div className="text-sm text-purple-600">
                  {isFrench ? 'Amélioration estimée' : 'Estimated improvement'}
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-800">
                    {isFrench ? 'Point d\'Équilibre' : 'Break-even Point'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-orange-700">
                  {customSimulation.breakEvenAge.toFixed(0)} {isFrench ? 'ans' : 'years'}
                </div>
                <div className="text-sm text-orange-600">
                  {isFrench ? 'Âge où les économies compensent les coûts' : 'Age when savings offset costs'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projection Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isFrench ? 'Projection des Années Restantes' : 'Remaining Years Projection'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" label={{ value: isFrench ? 'Âge Actuel' : 'Current Age', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: isFrench ? 'Années Restantes' : 'Years Remaining', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                name={isFrench ? 'Situation Actuelle' : 'Current Situation'}
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#10b981"
                strokeWidth={3}
                name={isFrench ? 'Projection Améliorée' : 'Improved Projection'}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-green-800 flex items-center gap-2">
            <Play className="w-5 h-5" />
            {isFrench ? 'Plan d\'Action Recommandé' : 'Recommended Action Plan'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customSimulation.yearsGained > 0 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-green-800">
                    {isFrench ? 'Changements Positifs Identifiés' : 'Positive Changes Identified'}
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    {isFrench
                      ? `Vos ajustements pourraient ajouter ${customSimulation.yearsGained.toFixed(1)} années à votre espérance de vie.`
                      : `Your adjustments could add ${customSimulation.yearsGained.toFixed(1)} years to your life expectancy.`
                    }
                  </div>
                </div>
              </div>
            )}

            {customSimulation.costSavings > 0 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-blue-800">
                    {isFrench ? 'Avantages Financiers' : 'Financial Benefits'}
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    {isFrench
                      ? `Économies potentielles de $${customSimulation.costSavings.toLocaleString()} par année.`
                      : `Potential savings of $${customSimulation.costSavings.toLocaleString()} per year.`
                    }
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <Target className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-purple-800">
                  {isFrench ? 'Prochaines Étapes' : 'Next Steps'}
                </div>
                <div className="text-sm text-purple-700 mt-1">
                  {isFrench
                    ? 'Consultez un professionnel de la santé pour établir un plan personnalisé.'
                    : 'Consult a healthcare professional to establish a personalized plan.'
                  }
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LongevitySimulator;
