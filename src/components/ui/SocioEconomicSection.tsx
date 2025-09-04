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
import {
  Info,
  TrendingUp,
  Users,
  GraduationCap,
  Briefcase,
  DollarSign,
  Calculator,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import { IncomeSynchronizationService } from '@/services/IncomeSynchronizationService';

interface SocioEconomicSectionProps {
  userData: any;
  updateUserData: (section: string, data: any) => void;
  isFrench: boolean;
  personNumber?: 1 | 2;
}

const SocioEconomicSection: React.FC<SocioEconomicSectionProps> = ({
  userData,
  updateUserData,
  isFrench,
  personNumber = 1
}) => {
  const [localData, setLocalData] = useState({
    householdIncome: 0,
    education: '',
    workSector: '',
    maritalStatus: '',
    region: '',
    unemploymentRate: 0,
    financialExperience: '',
    mainObjective: '',
    availableTime: '',
    riskTolerance: ''
  });

  const [completionProgress, setCompletionProgress] = useState(0);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);

  // Initialize data from userData
  useEffect(() => {
    const personal = userData.personal || {};
    const fieldSuffix = personNumber === 1 ? '1' : '2';

    // Utiliser le service de synchronisation des revenus
    const incomeData = IncomeSynchronizationService.synchronizeHouseholdIncome(userData);

    setLocalData({
      householdIncome: incomeData.totalHouseholdIncome, // Afficher le total des revenus synchronisés
      education: personal[`niveauCompetences${fieldSuffix}`] || '',
      workSector: personal[`secteurActivite${fieldSuffix}`] || '',
      maritalStatus: personal.situationFamiliale || '',
      region: personal.regionEconomique || '',
      unemploymentRate: personal.tauxChomageRegional || 0,
      financialExperience: personal[`experienceFinanciere${fieldSuffix}`] || '',
      mainObjective: personal.objectifPrincipal || '',
      availableTime: personal.tempsDisponible || '',
      riskTolerance: personal[`toleranceRisqueInvestissement${fieldSuffix}`] || ''
    });

    // Mettre à jour les données utilisateur avec les revenus synchronisés
    IncomeSynchronizationService.updateUserDataWithSynchronizedIncome(userData, updateUserData);
  }, [userData, personNumber, updateUserData]);

  // Calculate completion progress
  useEffect(() => {
    const fields = Object.values(localData);
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
      case 'householdIncome':
        updateUserData('personal', { [`salaire${fieldSuffix}`]: value });
        break;
      case 'education':
        updateUserData('personal', { [`niveauCompetences${fieldSuffix}`]: value });
        break;
      case 'workSector':
        updateUserData('personal', { [`secteurActivite${fieldSuffix}`]: value });
        break;
      case 'maritalStatus':
        updateUserData('personal', { situationFamiliale: value });
        break;
      case 'region':
        updateUserData('personal', { regionEconomique: value });
        break;
      case 'unemploymentRate':
        updateUserData('personal', { tauxChomageRegional: value });
        break;
      case 'financialExperience':
        updateUserData('personal', { [`experienceFinanciere${fieldSuffix}`]: value });
        break;
      case 'mainObjective':
        updateUserData('personal', { objectifPrincipal: value });
        break;
      case 'availableTime':
        updateUserData('personal', { tempsDisponible: value });
        break;
      case 'riskTolerance':
        updateUserData('personal', { [`toleranceRisqueInvestissement${fieldSuffix}`]: value });
        break;
    }
  };

  const getRiskImpact = (riskLevel: string) => {
    switch (riskLevel) {
      case 'tres-conservateur': return { impact: -0.5, description: isFrench ? 'Réduction de 0.5 an d\'espérance de vie' : '0.5 year reduction in life expectancy' };
      case 'conservateur': return { impact: -0.3, description: isFrench ? 'Réduction de 0.3 an d\'espérance de vie' : '0.3 year reduction in life expectancy' };
      case 'equilibre': return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
      case 'dynamique': return { impact: 0.2, description: isFrench ? 'Augmentation de 0.2 an d\'espérance de vie' : '0.2 year increase in life expectancy' };
      case 'agressif': return { impact: 0.3, description: isFrench ? 'Augmentation de 0.3 an d\'espérance de vie' : '0.3 year increase in life expectancy' };
      default: return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
    }
  };

  const getEducationMultiplier = (education: string) => {
    switch (education) {
      case 'debutant': return 0.95;
      case 'intermediaire': return 1.0;
      case 'experimente': return 1.05;
      case 'expert': return 1.1;
      default: return 1.0;
    }
  };

  const calculateRetirementImpact = () => {
    const riskImpact = getRiskImpact(localData.riskTolerance);
    const educationMultiplier = getEducationMultiplier(localData.financialExperience);
    const baseRetirementAge = 65;

    // Utiliser le service de synchronisation pour les calculs de revenus
    const incomeData = IncomeSynchronizationService.synchronizeHouseholdIncome(userData);
    const incomeImpact = IncomeSynchronizationService.calculateIncomeLongevityImpact(incomeData);

    const adjustedRetirementAge = Math.max(60, Math.min(70,
      baseRetirementAge + riskImpact.impact + (educationMultiplier - 1) * 2 + incomeImpact.lifeExpectancyAdjustment
    ));

    return {
      adjustedRetirementAge,
      riskImpact,
      educationMultiplier,
      incomeMultiplier: incomeImpact.healthMultiplier,
      sectorImpact: incomeData.sectorImpact,
      lifeExpectancyAdjustment: incomeImpact.lifeExpectancyAdjustment,
      stressReduction: incomeImpact.stressReduction,
      totalAdjustment: riskImpact.impact + (educationMultiplier - 1) * 2 + incomeImpact.lifeExpectancyAdjustment
    };
  };

  const getSectorLongevityImpact = (sector: string) => {
    switch (sector) {
      case 'sante': return 0.5; // Secteur santé = meilleure longévité
      case 'education': return 0.3; // Éducation = longévité positive
      case 'technologie': return 0.2; // Technologie = légèrement positif
      case 'construction': return -0.3; // Construction = plus risqué
      case 'manufacturier': return -0.2; // Manufacturier = légèrement négatif
      default: return 0;
    }
  };

  const impact = calculateRetirementImpact();

  return (
    <TooltipProvider>
      <Card className="bg-white border-2 border-blue-200 shadow-lg">
        <CardHeader className="border-b-2 border-blue-100 bg-blue-50">
          <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {personNumber}
            </div>
            <Users className="w-6 h-6" />
            {isFrench ? 'Profil Socio-Économique' : 'Socio-Economic Profile'}
            <Badge variant={completionProgress === 100 ? "default" : "secondary"} className="ml-auto">
              {completionProgress}% {isFrench ? 'complété' : 'complete'}
            </Badge>
          </CardTitle>
          <Progress value={completionProgress} className="w-full h-2" />
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Marital Status - First Position */}
          <div className="flex items-center gap-3">
            <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
              <Users className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Situation familiale' : 'Marital Status'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.maritalStatus}
                onValueChange={(value) => handleFieldChange('maritalStatus', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="celibataire" className="text-lg py-3">
                    {isFrench ? 'Célibataire' : 'Single'}
                  </SelectItem>
                  <SelectItem value="marie" className="text-lg py-3">
                    {isFrench ? 'Marié(e)' : 'Married'}
                  </SelectItem>
                  <SelectItem value="conjoint" className="text-lg py-3">
                    {isFrench ? 'Conjoint(e) de fait' : 'Common-law'}
                  </SelectItem>
                  <SelectItem value="divorce" className="text-lg py-3">
                    {isFrench ? 'Divorcé(e)' : 'Divorced'}
                  </SelectItem>
                  <SelectItem value="veuf" className="text-lg py-3">
                    {isFrench ? 'Veuf(ve)' : 'Widowed'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Household Income - Read-only field from Revenus page */}
          <div className="flex items-center gap-3">
            <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
              <DollarSign className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Revenus annuels totaux' : 'Total Annual Income'}
            </Label>
            <div className="flex-1">
              <div className="bg-gray-50 border-2 border-gray-300 text-gray-700 text-lg h-12 px-3 flex items-center rounded-md">
                {localData.householdIncome > 0 ? (
                  <>
                    ${localData.householdIncome.toLocaleString()}
                    <span className="text-sm text-gray-500 ml-2">
                      ({isFrench ? 'Mensuel:' : 'Monthly:'} {formatCurrency(localData.householdIncome / 12, { showCents: false })})
                    </span>
                    <span className="text-xs text-blue-600 ml-2">
                      ({isFrench ? 'Personne 1 + 2' : 'Person 1 + 2'})
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500 italic">
                    {isFrench ? 'Complétez la section "Revenus"' : 'Complete the "Income" section'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Education Level */}
          <div className="flex items-center gap-3">
            <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
              <GraduationCap className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Niveau d\'éducation' : 'Education Level'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.education}
                onValueChange={(value) => handleFieldChange('education', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="secondaire" className="text-lg py-3">
                    {isFrench ? 'Secondaire' : 'High School'}
                  </SelectItem>
                  <SelectItem value="college" className="text-lg py-3">
                    {isFrench ? 'Collégial' : 'College/CEGEP'}
                  </SelectItem>
                  <SelectItem value="universitaire" className="text-lg py-3">
                    {isFrench ? 'Universitaire' : 'University'}
                  </SelectItem>
                  <SelectItem value="maitrise" className="text-lg py-3">
                    {isFrench ? 'Maîtrise/Doctorat' : 'Master\'s/PhD'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Work Sector */}
          <div className="flex items-center gap-3">
            <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
              <Briefcase className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Secteur d\'activité' : 'Work Sector'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.workSector}
                onValueChange={(value) => handleFieldChange('workSector', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="technologie" className="text-lg py-3">
                    {isFrench ? 'Technologie' : 'Technology'}
                  </SelectItem>
                  <SelectItem value="sante" className="text-lg py-3">
                    {isFrench ? 'Santé' : 'Healthcare'}
                  </SelectItem>
                  <SelectItem value="finance" className="text-lg py-3">
                    {isFrench ? 'Finance' : 'Finance'}
                  </SelectItem>
                  <SelectItem value="education" className="text-lg py-3">
                    {isFrench ? 'Éducation' : 'Education'}
                  </SelectItem>
                  <SelectItem value="construction" className="text-lg py-3">
                    {isFrench ? 'Construction' : 'Construction'}
                  </SelectItem>
                  <SelectItem value="commerce" className="text-lg py-3">
                    {isFrench ? 'Commerce' : 'Retail'}
                  </SelectItem>
                  <SelectItem value="manufacturier" className="text-lg py-3">
                    {isFrench ? 'Manufacturier' : 'Manufacturing'}
                  </SelectItem>
                  <SelectItem value="services" className="text-lg py-3">
                    {isFrench ? 'Services' : 'Services'}
                  </SelectItem>
                  <SelectItem value="autre" className="text-lg py-3">
                    {isFrench ? 'Autre' : 'Other'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>



          {/* Financial Experience */}
          <div className="flex items-center gap-3">
            <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
              <TrendingUp className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Expérience financière' : 'Financial Experience'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.financialExperience}
                onValueChange={(value) => handleFieldChange('financialExperience', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="debutant" className="text-lg py-3">
                    {isFrench ? 'Débutant' : 'Beginner'}
                  </SelectItem>
                  <SelectItem value="intermediaire" className="text-lg py-3">
                    {isFrench ? 'Intermédiaire' : 'Intermediate'}
                  </SelectItem>
                  <SelectItem value="experimente" className="text-lg py-3">
                    {isFrench ? 'Expérimenté' : 'Experienced'}
                  </SelectItem>
                  <SelectItem value="expert" className="text-lg py-3">
                    {isFrench ? 'Expert' : 'Expert'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Risk Tolerance */}
          <div className="flex items-center gap-3">
            <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Tolérance au risque' : 'Risk Tolerance'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.riskTolerance}
                onValueChange={(value) => handleFieldChange('riskTolerance', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="tres-conservateur" className="text-lg py-3">
                    {isFrench ? 'Très conservateur' : 'Very conservative'}
                  </SelectItem>
                  <SelectItem value="conservateur" className="text-lg py-3">
                    {isFrench ? 'Conservateur' : 'Conservative'}
                  </SelectItem>
                  <SelectItem value="equilibre" className="text-lg py-3">
                    {isFrench ? 'Équilibré' : 'Balanced'}
                  </SelectItem>
                  <SelectItem value="dynamique" className="text-lg py-3">
                    {isFrench ? 'Dynamique' : 'Dynamic'}
                  </SelectItem>
                  <SelectItem value="agressif" className="text-lg py-3">
                    {isFrench ? 'Agressif' : 'Aggressive'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <Alert className="border-blue-300 bg-blue-50">
              <Calculator className="h-5 w-5 text-blue-500" />
              <AlertDescription className="space-y-2">
                <h4 className="font-semibold text-blue-800">
                  {isFrench ? 'Analyse d\'impact sur la retraite' : 'Retirement Impact Analysis'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>{isFrench ? 'Âge de retraite ajusté:' : 'Adjusted retirement age:'}</strong>
                    <span className="ml-2 text-blue-700">{impact.adjustedRetirementAge} {isFrench ? 'ans' : 'years'}</span>
                  </div>
                  <div>
                    <strong>{isFrench ? 'Impact du risque:' : 'Risk impact:'}</strong>
                    <span className={`ml-2 ${impact.riskImpact.impact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {impact.riskImpact.impact >= 0 ? '+' : ''}{impact.riskImpact.impact} {isFrench ? 'ans' : 'years'}
                    </span>
                  </div>
                  <div>
                    <strong>{isFrench ? 'Multiplicateur éducation:' : 'Education multiplier:'}</strong>
                    <span className="ml-2 text-purple-700">{impact.educationMultiplier.toFixed(2)}x</span>
                  </div>
                  <div>
                    <strong>{isFrench ? 'Impact revenus:' : 'Income impact:'}</strong>
                    <span className="ml-2 text-green-700">{impact.incomeMultiplier.toFixed(2)}x</span>
                  </div>
                  <div>
                    <strong>{isFrench ? 'Ajustement longévité:' : 'Longevity adjustment:'}</strong>
                    <span className={`ml-2 ${impact.lifeExpectancyAdjustment >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {impact.lifeExpectancyAdjustment >= 0 ? '+' : ''}{impact.lifeExpectancyAdjustment.toFixed(1)} {isFrench ? 'ans' : 'years'}
                    </span>
                  </div>
                  <div>
                    <strong>{isFrench ? 'Réduction stress:' : 'Stress reduction:'}</strong>
                    <span className="ml-2 text-blue-700">{(impact.stressReduction * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <strong>{isFrench ? 'Ajustement total:' : 'Total adjustment:'}</strong>
                    <span className={`ml-2 ${impact.totalAdjustment >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {impact.totalAdjustment >= 0 ? '+' : ''}{impact.totalAdjustment.toFixed(1)} {isFrench ? 'ans' : 'years'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {isFrench
                    ? 'Ces calculs sont des estimations basées sur vos réponses. Consultez un professionnel pour des conseils personnalisés.'
                    : 'These calculations are estimates based on your answers. Consult a professional for personalized advice.'
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

export default SocioEconomicSection;
