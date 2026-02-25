import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Info,
  Heart,
  Activity,
  Cigarette,
  Calculator,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Scale
} from 'lucide-react';

interface HealthFactorsSectionProps {
  userData: any;
  updateUserData: (section: string, data: any) => void;
  isFrench: boolean;
  personNumber?: 1 | 2;
}

const HealthFactorsSection: React.FC<HealthFactorsSectionProps> = ({
  userData,
  updateUserData,
  isFrench,
  personNumber = 1
}) => {
  const [localData, setLocalData] = useState({
    healthStatus: '',
    lifestyle: '',
    smokingStatus: '',
    yearsQuitSmoking: 0,
    height: 0, // in cm
    weight: 0, // in kg
    physicalActivity: '',
    chronicConditions: [] as string[]
  });

  const [bmi, setBmi] = useState(0);
  const [bmiCategory, setBmiCategory] = useState('');
  const [completionProgress, setCompletionProgress] = useState(0);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);

  // Initialize data from userData
  useEffect(() => {
    const personal = userData.personal || {};
    const fieldSuffix = personNumber === 1 ? '1' : '2';

    setLocalData({
      healthStatus: personal[`etatSante${fieldSuffix}`] || '',
      lifestyle: personal[`modeVieActif${fieldSuffix}`] || '',
      smokingStatus: personal[`smokingStatus${fieldSuffix}`] || '',
      yearsQuitSmoking: personal[`yearsQuitSmoking${fieldSuffix}`] || 0,
      height: personal[`height${fieldSuffix}`] || 0,
      weight: personal[`weight${fieldSuffix}`] || 0,
      physicalActivity: personal[`physicalActivity${fieldSuffix}`] || '',
      chronicConditions: personal[`chronicConditions${fieldSuffix}`] || []
    });
  }, [userData, personNumber]);

  // Calculate BMI
  useEffect(() => {
    if (localData.height > 0 && localData.weight > 0) {
      const calculatedBmi = localData.weight / ((localData.height / 100) ** 2);
      setBmi(Math.round(calculatedBmi * 10) / 10);

      // Determine BMI category
      if (calculatedBmi < 18.5) {
        setBmiCategory(isFrench ? 'Sous-poids' : 'Underweight');
      } else if (calculatedBmi < 25) {
        setBmiCategory(isFrench ? 'Poids normal' : 'Normal weight');
      } else if (calculatedBmi < 30) {
        setBmiCategory(isFrench ? 'Surpoids' : 'Overweight');
      } else {
        setBmiCategory(isFrench ? 'Obésité' : 'Obese');
      }
    } else {
      setBmi(0);
      setBmiCategory('');
    }
  }, [localData.height, localData.weight, isFrench]);

  // Calculate completion progress
  useEffect(() => {
    const fields = [
      localData.healthStatus,
      localData.lifestyle,
      localData.smokingStatus,
      localData.height > 0 ? localData.height : '',
      localData.weight > 0 ? localData.weight : '',
      localData.physicalActivity
    ];
    const filledFields = fields.filter(field =>
      field !== '' && field !== 0 && field !== null && field !== undefined
    ).length;
    const progress = Math.round((filledFields / fields.length) * 100);
    setCompletionProgress(progress);
  }, [localData]);

  const handleFieldChange = (field: string, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));

    // Update userData based on field
    const personal = userData.personal || {};
    const fieldSuffix = personNumber === 1 ? '1' : '2';

    switch (field) {
      case 'healthStatus':
        updateUserData('personal', { [`etatSante${fieldSuffix}`]: value });
        break;
      case 'lifestyle':
        updateUserData('personal', { [`modeVieActif${fieldSuffix}`]: value });
        break;
      case 'smokingStatus':
        updateUserData('personal', { [`smokingStatus${fieldSuffix}`]: value });
        break;
      case 'yearsQuitSmoking':
        updateUserData('personal', { [`yearsQuitSmoking${fieldSuffix}`]: value });
        break;
      case 'height':
        updateUserData('personal', { [`height${fieldSuffix}`]: value });
        break;
      case 'weight':
        updateUserData('personal', { [`weight${fieldSuffix}`]: value });
        break;
      case 'physicalActivity':
        updateUserData('personal', { [`physicalActivity${fieldSuffix}`]: value });
        break;
      case 'chronicConditions':
        updateUserData('personal', { [`chronicConditions${fieldSuffix}`]: value });
        break;
    }
  };

  const getHealthImpact = (healthStatus: string) => {
    switch (healthStatus) {
      case 'excellent': return { impact: 2.0, description: isFrench ? '+2.0 ans d\'espérance de vie' : '+2.0 years life expectancy' };
      case 'tresbon': return { impact: 1.0, description: isFrench ? '+1.0 an d\'espérance de vie' : '+1.0 year life expectancy' };
      case 'bon': return { impact: 0.5, description: isFrench ? '+0.5 an d\'espérance de vie' : '+0.5 year life expectancy' };
      case 'moyen': return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
      case 'fragile': return { impact: -1.5, description: isFrench ? '-1.5 ans d\'espérance de vie' : '-1.5 years life expectancy' };
      default: return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
    }
  };

  const getLifestyleImpact = (lifestyle: string) => {
    switch (lifestyle) {
      case 'sedentaire': return { impact: -0.5, description: isFrench ? '-0.5 an (sédentaire)' : '-0.5 year (sedentary)' };
      case 'legerementActif': return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
      case 'modere': return { impact: 0.5, description: isFrench ? '+0.5 an (activité modérée)' : '+0.5 year (moderate activity)' };
      case 'actif': return { impact: 0.8, description: isFrench ? '+0.8 an (actif)' : '+0.8 year (active)' };
      case 'tresActif': return { impact: 1.0, description: isFrench ? '+1.0 an (très actif)' : '+1.0 year (very active)' };
      default: return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
    }
  };

  const getSmokingImpact = (smokingStatus: string, yearsQuit?: number) => {
    switch (smokingStatus) {
      case 'never':
        return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
      case 'former':
        const quitImpact = yearsQuit ? Math.min(yearsQuit * 0.1, 1.0) : 0;
        return {
          impact: -2.0 + quitImpact,
          description: isFrench ? `Fumeur ancien: -2.0 ans +${quitImpact.toFixed(1)} ans récupérés` : `Former smoker: -2.0 years +${quitImpact.toFixed(1)} years recovered`
        };
      case 'current':
        return { impact: -2.0, description: isFrench ? '-2.0 ans (fumeur actuel)' : '-2.0 years (current smoker)' };
      default:
        return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
    }
  };

  const getBmiImpact = (bmiValue: number) => {
    if (bmiValue < 18.5) return { impact: -0.3, description: isFrench ? '-0.3 an (sous-poids)' : '-0.3 year (underweight)' };
    if (bmiValue < 25) return { impact: 0, description: isFrench ? 'Optimal' : 'Optimal' };
    if (bmiValue < 30) return { impact: -0.5, description: isFrench ? '-0.5 an (surpoids)' : '-0.5 year (overweight)' };
    return { impact: -1.0, description: isFrench ? '-1.0 an (obésité)' : '-1.0 year (obesity)' };
  };

  const calculateHealthImpact = () => {
    const healthImpact = getHealthImpact(localData.healthStatus);
    const lifestyleImpact = getLifestyleImpact(localData.lifestyle);
    const smokingImpact = getSmokingImpact(localData.smokingStatus, localData.yearsQuitSmoking);
    const bmiImpact = getBmiImpact(bmi);

    const totalImpact = healthImpact.impact + lifestyleImpact.impact + smokingImpact.impact + bmiImpact.impact;

    return {
      healthImpact,
      lifestyleImpact,
      smokingImpact,
      bmiImpact,
      totalImpact
    };
  };

  const impact = calculateHealthImpact();

  return (
    <TooltipProvider>
      <Card className="bg-white border-2 border-green-200 shadow-lg">
        <CardHeader className="border-b-2 border-green-100 bg-green-50">
          <CardTitle className="text-xl font-bold text-green-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              {personNumber}
            </div>
            <Heart className="w-6 h-6" />
            {isFrench ? 'Facteurs de santé' : 'Health Factors'}
            <Badge variant={completionProgress === 100 ? "default" : "secondary"} className="ml-auto">
              {completionProgress}% {isFrench ? 'complété' : 'complete'}
            </Badge>
          </CardTitle>
          <Progress value={completionProgress} className="w-full h-2" />
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Health Status */}
          <div className="flex items-center gap-3">
            <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
              <Heart className="w-5 h-5 inline mr-2" />
              {isFrench ? 'État de santé général' : 'General Health Status'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.healthStatus}
                onValueChange={(value) => handleFieldChange('healthStatus', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="excellent" className="text-lg py-3">
                    {isFrench ? 'Excellent' : 'Excellent'}
                  </SelectItem>
                  <SelectItem value="tresbon" className="text-lg py-3">
                    {isFrench ? 'Très bon' : 'Very good'}
                  </SelectItem>
                  <SelectItem value="bon" className="text-lg py-3">
                    {isFrench ? 'Bon' : 'Good'}
                  </SelectItem>
                  <SelectItem value="moyen" className="text-lg py-3">
                    {isFrench ? 'Moyen' : 'Average'}
                  </SelectItem>
                  <SelectItem value="fragile" className="text-lg py-3">
                    {isFrench ? 'Fragile' : 'Poor'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lifestyle Activity */}
          <div className="flex items-center gap-3">
            <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
              <Activity className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Mode de vie actif' : 'Active Lifestyle'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.lifestyle}
                onValueChange={(value) => handleFieldChange('lifestyle', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="sedentaire" className="text-lg py-3">
                    {isFrench ? 'Sédentaire' : 'Sedentary'}
                  </SelectItem>
                  <SelectItem value="legerementActif" className="text-lg py-3">
                    {isFrench ? 'Légèrement actif' : 'Lightly active'}
                  </SelectItem>
                  <SelectItem value="modere" className="text-lg py-3">
                    {isFrench ? 'Modérément actif' : 'Moderately active'}
                  </SelectItem>
                  <SelectItem value="actif" className="text-lg py-3">
                    {isFrench ? 'Actif' : 'Active'}
                  </SelectItem>
                  <SelectItem value="tresActif" className="text-lg py-3">
                    {isFrench ? 'Très actif' : 'Very active'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Smoking Status */}
          <div className="flex items-center gap-3">
            <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
              <Cigarette className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Statut tabagique' : 'Smoking Status'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.smokingStatus}
                onValueChange={(value) => handleFieldChange('smokingStatus', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="never" className="text-lg py-3">
                    {isFrench ? 'Jamais fumé' : 'Never smoked'}
                  </SelectItem>
                  <SelectItem value="former" className="text-lg py-3">
                    {isFrench ? 'Ancien fumeur' : 'Former smoker'}
                  </SelectItem>
                  <SelectItem value="current" className="text-lg py-3">
                    {isFrench ? 'Fumeur actuel' : 'Current smoker'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conditional: Years quit smoking */}
          {localData.smokingStatus === 'former' && (
            <div className="flex items-center gap-3">
              <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                {isFrench ? 'Années depuis l\'arrêt' : 'Years since quitting'}
              </Label>
              <div className="flex-1">
                <Input
                  type="number"
                  value={localData.yearsQuitSmoking || ''}
                  onChange={(e) => handleFieldChange('yearsQuitSmoking', parseInt(e.target.value) || 0)}
                  className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-lg h-12"
                  placeholder={isFrench ? 'Ex: 5' : 'Ex: 5'}
                  min="0"
                  max="50"
                />
              </div>
            </div>
          )}

          {/* BMI Calculator */}
          <div className="space-y-4 p-4 bg-mpr-interactive-lt rounded-lg border border-mpr-border">
            <div className="flex items-center gap-2">
              <Label className="text-lg font-semibold text-gray-900">
                <Scale className="w-5 h-5 inline mr-2" />
                {isFrench ? 'Calculateur d\'IMC' : 'BMI Calculator'}
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFrench ? 'L\'indice de masse corporelle (IMC) influence la santé et l\'espérance de vie' : 'Body Mass Index (BMI) affects health and life expectancy'}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-700">
                  {isFrench ? 'Taille (cm)' : 'Height (cm)'}
                </Label>
                <Input
                  type="number"
                  value={localData.height || ''}
                  onChange={(e) => handleFieldChange('height', parseFloat(e.target.value) || 0)}
                  className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-mpr-interactive focus:ring-2 focus:ring-mpr-border text-lg h-12"
                  placeholder={isFrench ? 'Ex: 170' : 'Ex: 170'}
                  min="100"
                  max="250"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-700">
                  {isFrench ? 'Poids (kg)' : 'Weight (kg)'}
                </Label>
                <Input
                  type="number"
                  value={localData.weight || ''}
                  onChange={(e) => handleFieldChange('weight', parseFloat(e.target.value) || 0)}
                  className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-mpr-interactive focus:ring-2 focus:ring-mpr-border text-lg h-12"
                  placeholder={isFrench ? 'Ex: 70' : 'Ex: 70'}
                  min="30"
                  max="300"
                />
              </div>
            </div>

            {bmi > 0 && (
              <div className="mt-4 p-3 bg-white rounded border">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-semibold">
                      {isFrench ? 'IMC:' : 'BMI:'} {bmi}
                    </span>
                    <span className="ml-4 text-sm text-gray-600">
                      ({bmiCategory})
                    </span>
                  </div>
                  <Badge variant={bmi >= 18.5 && bmi < 25 ? "default" : "destructive"}>
                    {bmi >= 18.5 && bmi < 25 ? (isFrench ? 'Optimal' : 'Optimal') : (isFrench ? 'À surveiller' : 'Needs attention')}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Impact Analysis Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowImpactAnalysis(!showImpactAnalysis)}
              className="flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              {isFrench ? 'Analyse d\'impact' : 'Impact Analysis'}
            </Button>
            {completionProgress === 100 && (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {isFrench ? 'Profil complet' : 'Complete Profile'}
              </Badge>
            )}
          </div>

          {/* Impact Analysis */}
          {showImpactAnalysis && (
            <Alert className="border-green-300 bg-green-50">
              <Calculator className="h-5 w-5 text-green-500" />
              <AlertDescription className="space-y-2">
                <h4 className="font-semibold text-green-800">
                  {isFrench ? 'Analyse d\'impact sur la santé et longévité' : 'Health and Longevity Impact Analysis'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>{isFrench ? 'État de santé:' : 'Health status:'}</strong>
                    <span className={`ml-2 ${impact.healthImpact.impact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {impact.healthImpact.impact >= 0 ? '+' : ''}{impact.healthImpact.impact} {isFrench ? 'ans' : 'years'}
                    </span>
                  </div>
                  <div>
                    <strong>{isFrench ? 'Mode de vie:' : 'Lifestyle:'}</strong>
                    <span className={`ml-2 ${impact.lifestyleImpact.impact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {impact.lifestyleImpact.impact >= 0 ? '+' : ''}{impact.lifestyleImpact.impact} {isFrench ? 'ans' : 'years'}
                    </span>
                  </div>
                  <div>
                    <strong>{isFrench ? 'Tabagisme:' : 'Smoking:'}</strong>
                    <span className={`ml-2 ${impact.smokingImpact.impact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {impact.smokingImpact.impact >= 0 ? '+' : ''}{impact.smokingImpact.impact.toFixed(1)} {isFrench ? 'ans' : 'years'}
                    </span>
                  </div>
                  <div>
                    <strong>{isFrench ? 'IMC:' : 'BMI:'}</strong>
                    <span className={`ml-2 ${impact.bmiImpact.impact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {impact.bmiImpact.impact >= 0 ? '+' : ''}{impact.bmiImpact.impact} {isFrench ? 'ans' : 'years'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border">
                  <strong className="text-green-800">
                    {isFrench ? 'Impact total sur l\'espérance de vie:' : 'Total impact on life expectancy:'}
                  </strong>
                  <span className={`ml-2 text-lg font-bold ${impact.totalImpact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {impact.totalImpact >= 0 ? '+' : ''}{impact.totalImpact.toFixed(1)} {isFrench ? 'ans' : 'years'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {isFrench
                    ? 'Ces calculs sont des estimations basées sur des études médicales. Consultez un professionnel de santé pour des conseils personnalisés.'
                    : 'These calculations are estimates based on medical studies. Consult a healthcare professional for personalized advice.'
                  }
                </p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default HealthFactorsSection;
