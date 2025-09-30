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
  MapPin,
  Home,
  Droplets,
  Wind,
  Car,
  Building2,
  Calculator,
  CheckCircle,
  AlertTriangle,
  TreePine
} from 'lucide-react';

interface EnvironmentFactorsSectionProps {
  userData: any;
  updateUserData: (section: string, data: any) => void;
  isFrench: boolean;
  personNumber?: 1 | 2;
}

const EnvironmentFactorsSection: React.FC<EnvironmentFactorsSectionProps> = ({
  userData,
  updateUserData,
  isFrench,
  personNumber = 1
}) => {
  const [localData, setLocalData] = useState({
    livingEnvironment: '', // urbain, suburbain, rural
    housingType: '', // maison, appartement, condo, etc.
    familyComposition: '', // seul, couple, famille
    distanceToSpecializedCare: 0, // en km
    waterQuality: '', // excellente, bonne, moyenne, pauvre
    airQuality: '', // excellente, bonne, moyenne, pauvre
    noiseLevel: '', // faible, modéré, élevé
    accessToGreenSpaces: '', // excellent, bon, limité, aucun
    transportAccess: '', // excellent, bon, limité, aucun
    communitySupport: '', // fort, modéré, faible
    crimeRate: '', // faible, modéré, élevé
    climateStressors: [] as string[] // canicule, froid-extreme, humidite, etc.
  });

  const [completionProgress, setCompletionProgress] = useState(0);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);

  // Initialize data from userData
  useEffect(() => {
    const personal = userData.personal || {};
    const fieldSuffix = personNumber === 1 ? '1' : '2';

    setLocalData({
      livingEnvironment: personal[`livingEnvironment${fieldSuffix}`] || '',
      housingType: personal[`housingType${fieldSuffix}`] || '',
      familyComposition: personal[`familyComposition${fieldSuffix}`] || '',
      distanceToSpecializedCare: personal[`distanceToSpecializedCare${fieldSuffix}`] || 0,
      waterQuality: personal[`waterQuality${fieldSuffix}`] || '',
      airQuality: personal[`airQuality${fieldSuffix}`] || '',
      noiseLevel: personal[`noiseLevel${fieldSuffix}`] || '',
      accessToGreenSpaces: personal[`accessToGreenSpaces${fieldSuffix}`] || '',
      transportAccess: personal[`transportAccess${fieldSuffix}`] || '',
      communitySupport: personal[`communitySupport${fieldSuffix}`] || '',
      crimeRate: personal[`crimeRate${fieldSuffix}`] || '',
      climateStressors: personal[`climateStressors${fieldSuffix}`] || []
    });
  }, [userData, personNumber]);

  // Calculate completion progress
  useEffect(() => {
    const fields = [
      localData.livingEnvironment,
      localData.housingType,
      localData.familyComposition,
      localData.distanceToSpecializedCare > 0 ? localData.distanceToSpecializedCare : '',
      localData.waterQuality,
      localData.airQuality,
      localData.noiseLevel,
      localData.accessToGreenSpaces,
      localData.transportAccess,
      localData.communitySupport,
      localData.crimeRate
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
    const fieldSuffix = personNumber === 1 ? '1' : '2';

    switch (field) {
      case 'livingEnvironment':
        updateUserData('personal', { [`livingEnvironment${fieldSuffix}`]: value });
        break;
      case 'housingType':
        updateUserData('personal', { [`housingType${fieldSuffix}`]: value });
        break;
      case 'familyComposition':
        updateUserData('personal', { [`familyComposition${fieldSuffix}`]: value });
        break;
      case 'distanceToSpecializedCare':
        updateUserData('personal', { [`distanceToSpecializedCare${fieldSuffix}`]: value });
        break;
      case 'waterQuality':
        updateUserData('personal', { [`waterQuality${fieldSuffix}`]: value });
        break;
      case 'airQuality':
        updateUserData('personal', { [`airQuality${fieldSuffix}`]: value });
        break;
      case 'noiseLevel':
        updateUserData('personal', { [`noiseLevel${fieldSuffix}`]: value });
        break;
      case 'accessToGreenSpaces':
        updateUserData('personal', { [`accessToGreenSpaces${fieldSuffix}`]: value });
        break;
      case 'transportAccess':
        updateUserData('personal', { [`transportAccess${fieldSuffix}`]: value });
        break;
      case 'communitySupport':
        updateUserData('personal', { [`communitySupport${fieldSuffix}`]: value });
        break;
      case 'crimeRate':
        updateUserData('personal', { [`crimeRate${fieldSuffix}`]: value });
        break;
      case 'climateStressors':
        updateUserData('personal', { [`climateStressors${fieldSuffix}`]: value });
        break;
    }
  };

  const getEnvironmentImpact = (environment: string) => {
    switch (environment) {
      case 'urbain': return { impact: -0.2, description: isFrench ? '-0.2 an (stress urbain)' : '-0.2 year (urban stress)' };
      case 'suburbain': return { impact: 0.3, description: isFrench ? '+0.3 an (équilibre optimal)' : '+0.3 year (optimal balance)' };
      case 'rural': return { impact: 0.5, description: isFrench ? '+0.5 an (air pur, moins de stress)' : '+0.5 year (clean air, less stress)' };
      default: return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
    }
  };

  const getWaterQualityImpact = (quality: string) => {
    switch (quality) {
      case 'excellente': return { impact: 0.3, description: isFrench ? '+0.3 an (eau pure)' : '+0.3 year (pure water)' };
      case 'bonne': return { impact: 0.1, description: isFrench ? '+0.1 an (bonne qualité)' : '+0.1 year (good quality)' };
      case 'moyenne': return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
      case 'pauvre': return { impact: -0.5, description: isFrench ? '-0.5 an (contamination)' : '-0.5 year (contamination)' };
      default: return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
    }
  };

  const getAirQualityImpact = (quality: string) => {
    switch (quality) {
      case 'excellente': return { impact: 0.8, description: isFrench ? '+0.8 an (air pur)' : '+0.8 year (clean air)' };
      case 'bonne': return { impact: 0.3, description: isFrench ? '+0.3 an (bonne qualité)' : '+0.3 year (good quality)' };
      case 'moyenne': return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
      case 'pauvre': return { impact: -1.2, description: isFrench ? '-1.2 ans (pollution)' : '-1.2 years (pollution)' };
      default: return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
    }
  };

  const getGreenSpacesImpact = (access: string) => {
    switch (access) {
      case 'excellent': return { impact: 0.6, description: isFrench ? '+0.6 an (nature accessible)' : '+0.6 year (accessible nature)' };
      case 'bon': return { impact: 0.3, description: isFrench ? '+0.3 an (espaces verts)' : '+0.3 year (green spaces)' };
      case 'limite': return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
      case 'aucun': return { impact: -0.4, description: isFrench ? '-0.4 an (manque de nature)' : '-0.4 year (lack of nature)' };
      default: return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
    }
  };

  const getHealthcareAccessImpact = (distance: number) => {
    if (distance <= 5) return { impact: 0.4, description: isFrench ? '+0.4 an (soins proches)' : '+0.4 year (nearby care)' };
    if (distance <= 15) return { impact: 0.1, description: isFrench ? '+0.1 an (accès raisonnable)' : '+0.1 year (reasonable access)' };
    if (distance <= 30) return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
    if (distance <= 60) return { impact: -0.3, description: isFrench ? '-0.3 an (accès limité)' : '-0.3 year (limited access)' };
    return { impact: -0.8, description: isFrench ? '-0.8 an (accès difficile)' : '-0.8 year (difficult access)' };
  };

  const getCommunitySupportImpact = (support: string) => {
    switch (support) {
      case 'fort': return { impact: 0.7, description: isFrench ? '+0.7 an (soutien social fort)' : '+0.7 year (strong social support)' };
      case 'modere': return { impact: 0.2, description: isFrench ? '+0.2 an (soutien modéré)' : '+0.2 year (moderate support)' };
      case 'faible': return { impact: -0.3, description: isFrench ? '-0.3 an (isolement social)' : '-0.3 year (social isolation)' };
      default: return { impact: 0, description: isFrench ? 'Aucun impact' : 'No impact' };
    }
  };

  const calculateEnvironmentImpact = () => {
    const environmentImpact = getEnvironmentImpact(localData.livingEnvironment);
    const waterImpact = getWaterQualityImpact(localData.waterQuality);
    const airImpact = getAirQualityImpact(localData.airQuality);
    const greenSpacesImpact = getGreenSpacesImpact(localData.accessToGreenSpaces);
    const healthcareImpact = getHealthcareAccessImpact(localData.distanceToSpecializedCare);
    const communityImpact = getCommunitySupportImpact(localData.communitySupport);

    const totalImpact = environmentImpact.impact + waterImpact.impact + airImpact.impact + 
                       greenSpacesImpact.impact + healthcareImpact.impact + communityImpact.impact;

    return {
      environmentImpact,
      waterImpact,
      airImpact,
      greenSpacesImpact,
      healthcareImpact,
      communityImpact,
      totalImpact
    };
  };

  const impact = calculateEnvironmentImpact();

  const climateStressorsOptions = [
    { value: 'canicule', label: isFrench ? 'Canicules fréquentes' : 'Frequent heat waves' },
    { value: 'froid-extreme', label: isFrench ? 'Froid extrême' : 'Extreme cold' },
    { value: 'humidite', label: isFrench ? 'Humidité élevée' : 'High humidity' },
    { value: 'secheresse', label: isFrench ? 'Sécheresse' : 'Drought' },
    { value: 'tempetes', label: isFrench ? 'Tempêtes fréquentes' : 'Frequent storms' },
    { value: 'inondations', label: isFrench ? 'Risque d\'inondations' : 'Flood risk' }
  ];

  return (
    <TooltipProvider>
      <Card className="bg-white border-2 border-emerald-200 shadow-lg">
        <CardHeader className="border-b-2 border-emerald-100 bg-emerald-50">
          <CardTitle className="text-xl font-bold text-emerald-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
              {personNumber}
            </div>
            <TreePine className="w-6 h-6" />
            {isFrench ? 'Environnement de vie' : 'Living Environment'}
            <Badge variant={completionProgress === 100 ? "default" : "secondary"} className="ml-auto">
              {completionProgress}% {isFrench ? 'complété' : 'complete'}
            </Badge>
          </CardTitle>
          <Progress value={completionProgress} className="w-full h-2" />
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Type de milieu */}
          <div className="flex items-center gap-4">
            <Label className="text-lg font-semibold text-gray-900 w-80 flex-shrink-0">
              <MapPin className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Type de milieu' : 'Environment Type'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.livingEnvironment}
                onValueChange={(value) => handleFieldChange('livingEnvironment', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="urbain" className="text-lg py-3">
                    {isFrench ? 'Urbain (ville)' : 'Urban (city)'}
                  </SelectItem>
                  <SelectItem value="suburbain" className="text-lg py-3">
                    {isFrench ? 'Suburbain (banlieue)' : 'Suburban'}
                  </SelectItem>
                  <SelectItem value="rural" className="text-lg py-3">
                    {isFrench ? 'Rural (campagne)' : 'Rural (countryside)'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Type de logement */}
          <div className="flex items-center gap-4">
            <Label className="text-lg font-semibold text-gray-900 w-80 flex-shrink-0">
              <Home className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Type de logement' : 'Housing Type'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.housingType}
                onValueChange={(value) => handleFieldChange('housingType', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="maison" className="text-lg py-3">
                    {isFrench ? 'Maison individuelle' : 'Single house'}
                  </SelectItem>
                  <SelectItem value="condo" className="text-lg py-3">
                    {isFrench ? 'Condominium' : 'Condominium'}
                  </SelectItem>
                  <SelectItem value="appartement" className="text-lg py-3">
                    {isFrench ? 'Appartement' : 'Apartment'}
                  </SelectItem>
                  <SelectItem value="duplex" className="text-lg py-3">
                    {isFrench ? 'Duplex/Triplex' : 'Duplex/Triplex'}
                  </SelectItem>
                  <SelectItem value="residence" className="text-lg py-3">
                    {isFrench ? 'Résidence pour aînés' : 'Senior residence'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Composition familiale */}
          <div className="flex items-center gap-4">
            <Label className="text-lg font-semibold text-gray-900 w-80 flex-shrink-0">
              <Home className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Composition du ménage' : 'Household Composition'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.familyComposition}
                onValueChange={(value) => handleFieldChange('familyComposition', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="seul" className="text-lg py-3">
                    {isFrench ? 'Seul' : 'Alone'}
                  </SelectItem>
                  <SelectItem value="couple" className="text-lg py-3">
                    {isFrench ? 'En couple' : 'Couple'}
                  </SelectItem>
                  <SelectItem value="famille" className="text-lg py-3">
                    {isFrench ? 'Famille avec enfants' : 'Family with children'}
                  </SelectItem>
                  <SelectItem value="multigenerationnel" className="text-lg py-3">
                    {isFrench ? 'Multigénérationnel' : 'Multigenerational'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Distance aux soins spécialisés */}
          <div className="flex items-center gap-4">
            <Label className="text-lg font-semibold text-gray-900 w-80 flex-shrink-0">
              <Building2 className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Distance soins spécialisés (km)' : 'Distance to Specialized Care (km)'}
            </Label>
            <div className="flex-1">
              <Input
                type="number"
                value={localData.distanceToSpecializedCare || ''}
                onChange={(e) => handleFieldChange('distanceToSpecializedCare', parseInt(e.target.value) || 0)}
                className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-lg h-12"
                placeholder={isFrench ? 'Ex: 15' : 'Ex: 15'}
                min="0"
                max="500"
              />
            </div>
          </div>

          {/* Qualité de l'eau */}
          <div className="flex items-center gap-4">
            <Label className="text-lg font-semibold text-gray-900 w-80 flex-shrink-0">
              <Droplets className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Qualité de l\'eau' : 'Water Quality'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.waterQuality}
                onValueChange={(value) => handleFieldChange('waterQuality', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="excellente" className="text-lg py-3">
                    {isFrench ? 'Excellente' : 'Excellent'}
                  </SelectItem>
                  <SelectItem value="bonne" className="text-lg py-3">
                    {isFrench ? 'Bonne' : 'Good'}
                  </SelectItem>
                  <SelectItem value="moyenne" className="text-lg py-3">
                    {isFrench ? 'Moyenne' : 'Average'}
                  </SelectItem>
                  <SelectItem value="pauvre" className="text-lg py-3">
                    {isFrench ? 'Pauvre' : 'Poor'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Qualité de l'air */}
          <div className="flex items-center gap-4">
            <Label className="text-lg font-semibold text-gray-900 w-80 flex-shrink-0">
              <Wind className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Qualité de l\'air' : 'Air Quality'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.airQuality}
                onValueChange={(value) => handleFieldChange('airQuality', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="excellente" className="text-lg py-3">
                    {isFrench ? 'Excellente' : 'Excellent'}
                  </SelectItem>
                  <SelectItem value="bonne" className="text-lg py-3">
                    {isFrench ? 'Bonne' : 'Good'}
                  </SelectItem>
                  <SelectItem value="moyenne" className="text-lg py-3">
                    {isFrench ? 'Moyenne' : 'Average'}
                  </SelectItem>
                  <SelectItem value="pauvre" className="text-lg py-3">
                    {isFrench ? 'Pauvre' : 'Poor'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Accès aux espaces verts */}
          <div className="flex items-center gap-4">
            <Label className="text-lg font-semibold text-gray-900 w-80 flex-shrink-0">
              <TreePine className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Accès aux espaces verts' : 'Access to Green Spaces'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.accessToGreenSpaces}
                onValueChange={(value) => handleFieldChange('accessToGreenSpaces', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="excellent" className="text-lg py-3">
                    {isFrench ? 'Excellent (parcs, forêts à proximité)' : 'Excellent (parks, forests nearby)'}
                  </SelectItem>
                  <SelectItem value="bon" className="text-lg py-3">
                    {isFrench ? 'Bon (quelques espaces verts)' : 'Good (some green spaces)'}
                  </SelectItem>
                  <SelectItem value="limite" className="text-lg py-3">
                    {isFrench ? 'Limité (peu d\'espaces verts)' : 'Limited (few green spaces)'}
                  </SelectItem>
                  <SelectItem value="aucun" className="text-lg py-3">
                    {isFrench ? 'Aucun (environnement bétonné)' : 'None (concrete environment)'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Accès aux transports */}
          <div className="flex items-center gap-4">
            <Label className="text-lg font-semibold text-gray-900 w-80 flex-shrink-0">
              <Car className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Accès aux transports' : 'Transportation Access'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.transportAccess}
                onValueChange={(value) => handleFieldChange('transportAccess', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="excellent" className="text-lg py-3">
                    {isFrench ? 'Excellent (transport public fréquent)' : 'Excellent (frequent public transport)'}
                  </SelectItem>
                  <SelectItem value="bon" className="text-lg py-3">
                    {isFrench ? 'Bon (transport disponible)' : 'Good (transport available)'}
                  </SelectItem>
                  <SelectItem value="limite" className="text-lg py-3">
                    {isFrench ? 'Limité (transport occasionnel)' : 'Limited (occasional transport)'}
                  </SelectItem>
                  <SelectItem value="aucun" className="text-lg py-3">
                    {isFrench ? 'Aucun (voiture nécessaire)' : 'None (car required)'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Soutien communautaire */}
          <div className="flex items-center gap-4">
            <Label className="text-lg font-semibold text-gray-900 w-80 flex-shrink-0">
              <Home className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Soutien communautaire' : 'Community Support'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.communitySupport}
                onValueChange={(value) => handleFieldChange('communitySupport', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="fort" className="text-lg py-3">
                    {isFrench ? 'Fort (communauté active, voisinage solidaire)' : 'Strong (active community, supportive neighborhood)'}
                  </SelectItem>
                  <SelectItem value="modere" className="text-lg py-3">
                    {isFrench ? 'Modéré (quelques liens sociaux)' : 'Moderate (some social connections)'}
                  </SelectItem>
                  <SelectItem value="faible" className="text-lg py-3">
                    {isFrench ? 'Faible (peu de liens sociaux)' : 'Weak (few social connections)'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Taux de criminalité */}
          <div className="flex items-center gap-4">
            <Label className="text-lg font-semibold text-gray-900 w-80 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Sécurité du quartier' : 'Neighborhood Safety'}
            </Label>
            <div className="flex-1">
              <Select
                value={localData.crimeRate}
                onValueChange={(value) => handleFieldChange('crimeRate', value)}
              >
                <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg">
                  <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300">
                  <SelectItem value="tres-securitaire" className="text-lg py-3">
                    {isFrench ? 'Très sécuritaire' : 'Very safe'}
                  </SelectItem>
                  <SelectItem value="securitaire" className="text-lg py-3">
                    {isFrench ? 'Sécuritaire' : 'Safe'}
                  </SelectItem>
                  <SelectItem value="moyen" className="text-lg py-3">
                    {isFrench ? 'Moyennement sécuritaire' : 'Moderately safe'}
                  </SelectItem>
                  <SelectItem value="peu-securitaire" className="text-lg py-3">
                    {isFrench ? 'Peu sécuritaire' : 'Not very safe'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Facteurs climatiques stressants */}
          <div className="flex items-start gap-4">
            <Label className="text-lg font-semibold text-gray-900 w-80 flex-shrink-0 pt-2">
              <Wind className="w-5 h-5 inline mr-2" />
              {isFrench ? 'Facteurs climatiques stressants' : 'Climate Stressors'}
            </Label>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {climateStressorsOptions.map(option => {
                  const current = localData.climateStressors || [];
                  const checked = current.includes(option.value);
                  return (
                    <label key={option.value} className="flex items-center gap-2 text-sm p-2 border rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const next = checked 
                            ? current.filter(s => s !== option.value) 
                            : [...current, option.value];
                          handleFieldChange('climateStressors', next);
                        }}
                        className="rounded"
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
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
            <Alert className="border-emerald-300 bg-emerald-50">
              <Calculator className="h-5 w-5 text-emerald-500" />
              <AlertDescription className="space-y-2">
                <h4 className="font-semibold text-emerald-800">
                  {isFrench ? 'Analyse d\'impact environnemental sur la longévité' : 'Environmental Impact Analysis on Longevity'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>{isFrench ? 'Type de milieu:' : 'Environment type:'}</strong>
                    <span className={`ml-2 ${impact.environmentImpact.impact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {impact.environmentImpact.impact >= 0 ? '+' : ''}{impact.environmentImpact.impact} {isFrench ? 'ans' : 'years'}
                    </span>
                  </div>
                  <div>
                    <strong>{isFrench ? 'Qualité de l\'eau:' : 'Water quality:'}</strong>
                    <span className={`ml-2 ${impact.waterImpact.impact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {impact.waterImpact.impact >= 0 ? '+' : ''}{impact.waterImpact.impact} {isFrench ? 'ans' : 'years'}
                    </span>
                  </div>
                  <div>
                    <strong>{isFrench ? 'Qualité de l\'air:' : 'Air quality:'}</strong>
                    <span className={`ml-2 ${impact.airImpact.impact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {impact.airImpact.impact >= 0 ? '+' : ''}{impact.airImpact.impact} {isFrench ? 'ans' : 'years'}
                    </span>
                  </div>
                  <div>
                    <strong>{isFrench ? 'Espaces verts:' : 'Green spaces:'}</strong>
                    <span className={`ml-2 ${impact.greenSpacesImpact.impact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {impact.greenSpacesImpact.impact >= 0 ? '+' : ''}{impact.greenSpacesImpact.impact} {isFrench ? 'ans' : 'years'}
                    </span>
                  </div>
                  <div>
                    <strong>{isFrench ? 'Accès aux soins:' : 'Healthcare access:'}</strong>
                    <span className={`ml-2 ${impact.healthcareImpact.impact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {impact.healthcareImpact.impact >= 0 ? '+' : ''}{impact.healthcareImpact.impact} {isFrench ? 'ans' : 'years'}
                    </span>
                  </div>
                  <div>
                    <strong>{isFrench ? 'Soutien communautaire:' : 'Community support:'}</strong>
                    <span className={`ml-2 ${impact.communityImpact.impact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {impact.communityImpact.impact >= 0 ? '+' : ''}{impact.communityImpact.impact} {isFrench ? 'ans' : 'years'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border">
                  <strong className="text-emerald-800">
                    {isFrench ? 'Impact total environnemental sur l\'espérance de vie:' : 'Total environmental impact on life expectancy:'}
                  </strong>
                  <span className={`ml-2 text-lg font-bold ${impact.totalImpact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {impact.totalImpact >= 0 ? '+' : ''}{impact.totalImpact.toFixed(1)} {isFrench ? 'ans' : 'years'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {isFrench
                    ? 'Ces calculs sont des estimations basées sur des études environnementales et de santé publique. Consultez un professionnel pour des conseils personnalisés.'
                    : 'These calculations are estimates based on environmental and public health studies. Consult a professional for personalized advice.'
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

export default EnvironmentFactorsSection;
