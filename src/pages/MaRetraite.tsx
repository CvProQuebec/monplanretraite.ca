import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DollarSign,
  Star,
  Info,
  Shield,
  Save,
  User,
  Building,
  CreditCard,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import { LicenseManager } from '@/services/LicenseManager';
import { EnhancedSaveManager } from '@/services/EnhancedSaveManager';
import OnboardingWizard from '@/features/retirement/components/OnboardingWizard';
import { CustomBirthDateInput } from '@/features/retirement/components/CustomBirthDateInput';
import { MortalityDisplayCPM2014 } from '@/components/MortalityDisplayCPM2014';
import { MORTALITY_CPM2014 } from '@/config/financial-assumptions';

const MaRetraite: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';

  const { userData, updateUserData } = useRetirementData();

  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);

  const [revenusData, setRevenusData] = useState({
    salaire: '',
    pensions: '',
    epargne: '',
    immobilier: '',
    autres: '',
  });

  useEffect(() => {
    if (userData.personal?.salaire1) {
      setRevenusData((prev) => ({
        ...prev,
        salaire: userData.personal.salaire1.toString(),
      }));
    }
  }, [userData.personal?.salaire1]);

  const handleRevenusChange = (field: string, value: string) => {
    setRevenusData((prev) => ({ ...prev, [field]: value }));
    if (field === 'salaire') {
      const numericValue = parseFloat(value.replace(/[^\d.]/g, '')) || 0;
      updateUserData('personal', { salaire1: numericValue });
    }
  };

  const handleOnboardingComplete = (data: any) => {
    setShowOnboardingWizard(false);
    if (data?.personal) {
      updateUserData('personal', data.personal);
    }
  };

  const handleOnboardingSkip = () => setShowOnboardingWizard(false);

  const [depensesData, setDepensesData] = useState({
    logement: '',
    alimentation: '',
    transport: '',
    sante: '',
    loisirs: '',
    autres: '',
  });

  const [calculsData, setCalculsData] = useState({
    ageRetraite: '',
    revenusMensuels: '',
    depensesMensuelles: '',
    epargneNecessaire: '',
  });

  const [showHelp, setShowHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [licenseBlocked, setLicenseBlocked] = useState(false);
  const [licenseMessage, setLicenseMessage] = useState('');
  const [showMortalityDetails, setShowMortalityDetails] = useState(false);
  const [showMortalityDetails2, setShowMortalityDetails2] = useState(false);

  const handleDepensesChange = (field: string, value: string) => {
    setDepensesData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalculsChange = (field: string, value: string) => {
    setCalculsData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileChange = (field: string, value: any) => {
    console.log('handleProfileChange called:', { field, value, currentData: userData.personal });
    
    // TEMPORAIRE: Désactivation du blocage de licence pour 1 mois
    // const newData = { ...userData, personal: { ...userData.personal, [field]: value } };
    // const licenseCheck = LicenseManager.checkLicense(newData as any);
    // if (!licenseCheck.isValid) {
    //   setLicenseBlocked(true);
    //   setLicenseMessage(licenseCheck.reason || 'Modification bloquée');
    //   return;
    // }
    setLicenseBlocked(false);
    setLicenseMessage('');
    updateUserData('personal', { [field]: value });
  };

  const handleNameChange = (field: string, value: string) => {
    updateUserData('personal', { [field]: value });
  };





  const handleNavigation = (path: string) => navigate(path);

  const getRevenusProgress = () => {
    const filledFields = Object.values(revenusData).filter((value) => value.trim() !== '').length;
    return Math.round((filledFields / Object.keys(revenusData).length) * 100);
  };

  const getDepensesProgress = () => {
    const filledFields = Object.values(depensesData).filter((value) => value.trim() !== '').length;
    return Math.round((filledFields / Object.keys(depensesData).length) * 100);
  };

  const getCalculsProgress = () => {
    const filledFields = Object.values(calculsData).filter((value) => value.trim() !== '').length;
    return Math.round((filledFields / Object.keys(calculsData).length) * 100);
  };

  const computeAgeFromBirthdate = (birthDate?: string): number => {
    if (!birthDate) return 65;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return 65;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return Math.max(18, Math.min(100, age));
  };

  const getGenderForMortality = (sexe?: string): 'male' | 'female' => {
    if (!sexe) return 'male';
    const val = String(sexe).toLowerCase();
    if (val === 'f' || val === 'femme' || val === 'female') return 'female';
    return 'male';
  };

  const canComputeMortality = (personNumber: 1 | 2 = 1): boolean => {
    const p = (userData.personal || {}) as any;
    const birthField = personNumber === 1 ? 'naissance1' : 'naissance2';
    const birthValue = p[birthField];
    const hasBirth = !!birthValue && !isNaN(new Date(birthValue).getTime());
    
    console.log(`canComputeMortality(${personNumber}):`, {
      birthField,
      birthValue,
      hasBirth,
      userData: userData.personal
    });
    
    return hasBirth; // Seulement besoin de la date de naissance pour commencer
  };

  const hasCompleteMortalityData = (personNumber: 1 | 2 = 1): boolean => {
    const p = (userData.personal || {}) as any;
    const birthField = personNumber === 1 ? 'naissance1' : 'naissance2';
    const genderField = personNumber === 1 ? 'sexe1' : 'sexe2';
    const provinceField = personNumber === 1 ? 'province1' : 'province2';
    const hasBirth = !!p[birthField] && !isNaN(new Date(p[birthField]).getTime());
    const hasGender = !!p[genderField];
    const hasProvince = !!p[provinceField] && String(p[provinceField]).trim() !== '';
    return hasBirth && hasGender && hasProvince;
  };

  const calculateMortalityForPerson = (personNumber: 1 | 2) => {
    if (!canComputeMortality(personNumber)) {
      return {
        lifeExpectancy: 0,
        finalAge: 0,
        planningAge: 0,
        source: isFrench ? 'Date de naissance requise' : 'Birth date required',
      };
    }

    const birthField = personNumber === 1 ? 'naissance1' : 'naissance2';
    const genderField = personNumber === 1 ? 'sexe1' : 'sexe2';
    const age = computeAgeFromBirthdate(userData.personal?.[birthField]);
    // Utiliser des valeurs par défaut si les champs ne sont pas remplis
    const gender = getGenderForMortality(userData.personal?.[genderField] as any);
    const base = MORTALITY_CPM2014.calculateLifeExpectancy({ age, gender });

    let adj = 0;
    const etatField = personNumber === 1 ? 'etatSante1' : 'etatSante2';
    const modeField = personNumber === 1 ? 'modeVieActif1' : 'modeVieActif2';
    
    const etat = userData.personal?.[etatField] as
      | 'excellent'
      | 'tresbon'
      | 'bon'
      | 'moyen'
      | 'fragile'
      | undefined;
    if (etat === 'excellent') adj += 2;
    else if (etat === 'tresbon') adj += 1;
    else if (etat === 'bon') adj += 0.5;
    else if (etat === 'moyen') adj += 0;
    else if (etat === 'fragile') adj -= 1.5;
    // Valeur par défaut si non spécifié
    else adj += 0.5;

    const mode = userData.personal?.[modeField] as
      | 'sedentaire'
      | 'legerementActif'
      | 'modere'
      | 'actif'
      | 'tresActif'
      | undefined;
    if (mode === 'sedentaire') adj -= 0.5;
    else if (mode === 'legerementActif') adj += 0;
    else if (mode === 'modere') adj += 0.5;
    else if (mode === 'actif') adj += 0.8;
    else if (mode === 'tresActif') adj += 1;
    // Valeur par défaut si non spécifié
    else adj += 0.5;

    if (adj > 2) adj = 2;
    if (adj < -2) adj = -2;

    const lifeExp = Math.max(0, Number((base.lifeExpectancy + adj).toFixed(1)));
    const finalAge = Math.round(age + lifeExp);
    const planningAge = Math.min(100, Math.round(base.recommendedPlanningAge + adj));

    const isComplete = hasCompleteMortalityData(personNumber);
    const source = isComplete 
      ? (base.source || 'CPM2014') + (adj !== 0 ? ' + ajustements (profil)' : '')
      : (base.source || 'CPM2014') + ' (valeurs par défaut utilisées)';

    return {
      lifeExpectancy: lifeExp,
      finalAge,
      planningAge,
      source: source,
    };
  };

  const mortalityOverride = useMemo(() => calculateMortalityForPerson(1), [
    userData.personal?.naissance1,
    userData.personal?.sexe1,
    userData.personal?.province1,
    userData.personal?.etatSante1,
    userData.personal?.modeVieActif1,
    isFrench,
  ]);

  const mortalityOverride2 = useMemo(() => calculateMortalityForPerson(2), [
    userData.personal?.naissance2,
    userData.personal?.sexe2,
    userData.personal?.province2,
    userData.personal?.etatSante2,
    userData.personal?.modeVieActif2,
    isFrench,
  ]);

  useEffect(() => {
    const value = mortalityOverride.lifeExpectancy || 0;
    updateUserData('retirement', { esperanceVie1: value });
  }, [mortalityOverride.lifeExpectancy]);

  useEffect(() => {
    const value = mortalityOverride2.lifeExpectancy || 0;
    updateUserData('retirement', { esperanceVie2: value });
  }, [mortalityOverride2.lifeExpectancy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">


        {/* Sections regroupées sans onglets */}
        <div className="space-y-10">
          {/* Profil */}
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
                {isFrench ? '🚀 Mon Profil' : '🚀 My Profile'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                {isFrench
                  ? 'Transformez vos informations en planification financière spectaculaire'
                  : 'Transform your information into spectacular financial planning'}
              </p>
              <Button
                onClick={() => setShowOnboardingWizard(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                {isFrench ? '🎯 Planificateur de retraite automatisé' : '🎯 Automated Retirement Planner'}
              </Button>
            </div>



            {showHelp && (
              <Alert className="border-yellow-400 bg-yellow-50 text-yellow-800">
                <Info className="h-5 w-5 text-yellow-400" />
                <AlertDescription className="text-lg">
                  <strong>{isFrench ? 'Conseils :' : 'Tips:'}</strong>{' '}
                  {isFrench
                  ? "Entrez vos noms complets (prénoms composés, noms de famille) pour une personnalisation optimale de vos rapports. Si vous êtes seul(e), laissez la section « Personne 2 » vide. Les montants en dollars n\'incluent pas les centimes pour simplifier la saisie."
                    : 'Enter your full names for better personalization. If single, leave "Person 2" empty. Dollar amounts do not include cents.'}
                </AlertDescription>
              </Alert>
            )}

            {/* Formulaire principal du profil */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Personne 1 */}
              <Card className="bg-white border-2 border-gray-300 shadow-lg">
                <CardHeader className="border-b-2 border-gray-200 bg-gray-50">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    {isFrench ? 'Personne 1' : 'Person 1'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Nom complet */}
                    <div className="flex items-center gap-4">
                      <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                        {isFrench ? 'Nom complet' : 'Full Name'}
                      </Label>
                      <Input
                        type="text"
                        value={userData.personal?.prenom1 || ''}
                        onChange={(e) => handleNameChange('prenom1', e.target.value)}
                        className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-lg h-12 w-48"
                        placeholder={isFrench ? 'Ex: Jean Philippe…' : 'Ex: John Smith…'}
                      />
                    </div>

                    {/* Date de naissance */}
                    <div className="flex items-center gap-4">
                      <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                        {isFrench ? 'Date de naissance' : 'Date of Birth'}
                      </Label>
                      <div className="flex-1">
                      <CustomBirthDateInput
                        id="naissance1"
                          label=""
                        value={userData.personal?.naissance1 || ''}
                        onChange={(date) => handleProfileChange('naissance1', date)}
                          className="bg-white border-2 border-gray-300 text-gray-900"
                      />
                      </div>
                    </div>

                    {/* Sexe */}
                    <div className="flex items-center gap-4">
                      <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                        {isFrench ? 'Sexe' : 'Gender'}
                      </Label>
                      <Select
                        value={userData.personal?.sexe1 || 'homme'}
                        onValueChange={(value) => handleProfileChange('sexe1', value)}
                      >
                        <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg w-80">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-gray-300">
                          <SelectItem value="homme" className="text-lg py-3">{isFrench ? 'Homme' : 'Male'}</SelectItem>
                          <SelectItem value="femme" className="text-lg py-3">{isFrench ? 'Femme' : 'Female'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Statut professionnel */}
                    <div className="flex items-center gap-4">
                      <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                        {isFrench ? 'Statut professionnel' : 'Professional Status'}
                      </Label>
                      <Select
                        value={userData.personal?.statutProfessionnel1 || 'actif'}
                        onValueChange={(value) => handleProfileChange('statutProfessionnel1', value)}
                      >
                        <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg w-80">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-gray-300">
                          <SelectItem value="actif" className="text-lg py-3">{isFrench ? 'Actif' : 'Active'}</SelectItem>
                          <SelectItem value="retraite" className="text-lg py-3">{isFrench ? 'Retraité' : 'Retired'}</SelectItem>
                          <SelectItem value="inactif" className="text-lg py-3">{isFrench ? 'Inactif' : 'Inactive'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personne 2 */}
              <Card className="bg-white border-2 border-gray-300 shadow-lg">
                <CardHeader className="border-b-2 border-gray-200 bg-gray-50">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    {isFrench ? 'Personne 2' : 'Person 2'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Nom complet */}
                    <div className="flex items-center gap-4">
                      <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                        {isFrench ? 'Nom complet (optionnel)' : 'Full Name (optional)'}
                      </Label>
                      <Input
                        type="text"
                        value={userData.personal?.prenom2 || ''}
                        onChange={(e) => handleNameChange('prenom2', e.target.value)}
                        className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-lg h-12 w-48"
                        placeholder={isFrench ? 'Ex: Marie…' : 'Ex: Mary…'}
                      />
                    </div>

                    {/* Date de naissance */}
                    <div className="flex items-center gap-4">
                      <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                        {isFrench ? 'Date de naissance' : 'Date of Birth'}
                      </Label>
                      <div className="flex-1">
                      <CustomBirthDateInput
                        id="naissance2"
                          label=""
                        value={userData.personal?.naissance2 || ''}
                        onChange={(date) => handleProfileChange('naissance2', date)}
                          className="bg-white border-2 border-gray-300 text-gray-900"
                      />
                      </div>
                    </div>

                    {/* Sexe */}
                    <div className="flex items-center gap-4">
                      <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                        {isFrench ? 'Sexe' : 'Gender'}
                      </Label>
                      <Select
                        value={userData.personal?.sexe2 || 'femme'}
                        onValueChange={(value) => handleProfileChange('sexe2', value)}
                      >
                        <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg w-80">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-gray-300">
                          <SelectItem value="homme" className="text-lg py-3">{isFrench ? 'Homme' : 'Male'}</SelectItem>
                          <SelectItem value="femme" className="text-lg py-3">{isFrench ? 'Femme' : 'Female'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Statut professionnel */}
                    <div className="flex items-center gap-4">
                      <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                        {isFrench ? 'Statut professionnel' : 'Professional Status'}
                      </Label>
                      <Select
                        value={userData.personal?.statutProfessionnel2 || 'actif'}
                        onValueChange={(value) => handleProfileChange('statutProfessionnel2', value)}
                      >
                        <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg w-80">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-gray-300">
                          <SelectItem value="actif" className="text-lg py-3">{isFrench ? 'Actif' : 'Active'}</SelectItem>
                          <SelectItem value="retraite" className="text-lg py-3">{isFrench ? 'Retraité' : 'Retired'}</SelectItem>
                          <SelectItem value="inactif" className="text-lg py-3">{isFrench ? 'Inactif' : 'Inactive'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {licenseBlocked && (
              <Alert className="border-red-400 bg-red-50 text-red-800">
                <Shield className="h-5 w-5 text-red-400" />
                <AlertDescription className="text-lg">
                  <strong>{isFrench ? '🚫 Modification bloquée' : '🚫 Modification blocked'}</strong>
                  <br />
                  {licenseMessage}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Tableau de bord pour couples */}
          <div className="space-y-8">
            {/* Profils personnels - 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personne 1 - Profil personnel */}
              <Card className="bg-white border-2 border-blue-200 shadow-lg">
            <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    {isFrench ? 'Profil Personnel - Personne 1' : 'Personal Profile - Person 1'}
              </CardTitle>
            </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Province de résidence' : 'Province of residence'}
                    </Label>
                  <Select
                      value={userData.personal?.province1 || ''}
                      onValueChange={(value) => updateUserData('personal', { province1: value })}
                  >
                      <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg w-96">
                      <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                    </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-300">
                        <SelectItem value="QC" className="text-lg py-3">Québec</SelectItem>
                        <SelectItem value="ON" className="text-lg py-3">Ontario</SelectItem>
                        <SelectItem value="BC" className="text-lg py-3">Colombie-Britannique</SelectItem>
                        <SelectItem value="AB" className="text-lg py-3">Alberta</SelectItem>
                        <SelectItem value="MB" className="text-lg py-3">Manitoba</SelectItem>
                        <SelectItem value="SK" className="text-lg py-3">Saskatchewan</SelectItem>
                        <SelectItem value="NS" className="text-lg py-3">Nouvelle-Écosse</SelectItem>
                        <SelectItem value="NB" className="text-lg py-3">Nouveau-Brunswick</SelectItem>
                        <SelectItem value="PE" className="text-lg py-3">Île-du-Prince-Édouard</SelectItem>
                        <SelectItem value="NL" className="text-lg py-3">Terre-Neuve-et-Labrador</SelectItem>
                        <SelectItem value="YT" className="text-lg py-3">Yukon</SelectItem>
                        <SelectItem value="NT" className="text-lg py-3">Territoires du Nord-Ouest</SelectItem>
                        <SelectItem value="NU" className="text-lg py-3">Nunavut</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'État de santé général' : 'General health'}
                    </Label>
                  <Select
                      value={userData.personal?.etatSante1 || ''}
                      onValueChange={(value) => updateUserData('personal', { etatSante1: value })}
                  >
                      <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg w-80">
                      <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                    </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-300">
                        <SelectItem value="excellent" className="text-lg py-3">{isFrench ? 'Excellent' : 'Excellent'}</SelectItem>
                        <SelectItem value="tresbon" className="text-lg py-3">{isFrench ? 'Très bon' : 'Very good'}</SelectItem>
                        <SelectItem value="bon" className="text-lg py-3">{isFrench ? 'Bon' : 'Good'}</SelectItem>
                        <SelectItem value="moyen" className="text-lg py-3">{isFrench ? 'Moyen' : 'Average'}</SelectItem>
                        <SelectItem value="fragile" className="text-lg py-3">{isFrench ? 'Fragile' : 'Poor'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Mode de vie' : 'Lifestyle'}
                    </Label>
                  <Select
                      value={userData.personal?.modeVieActif1 || ''}
                      onValueChange={(value) => updateUserData('personal', { modeVieActif1: value })}
                  >
                      <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg w-80">
                      <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                    </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-300">
                        <SelectItem value="sedentaire" className="text-lg py-3">{isFrench ? 'Sédentaire' : 'Sedentary'}</SelectItem>
                        <SelectItem value="legerementActif" className="text-lg py-3">{isFrench ? 'Légèrement actif' : 'Lightly active'}</SelectItem>
                        <SelectItem value="modere" className="text-lg py-3">{isFrench ? 'Modérément actif' : 'Moderately active'}</SelectItem>
                        <SelectItem value="actif" className="text-lg py-3">{isFrench ? 'Actif' : 'Active'}</SelectItem>
                        <SelectItem value="tresActif" className="text-lg py-3">{isFrench ? 'Très actif' : 'Very active'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                </CardContent>
              </Card>

              {/* Personne 2 - Profil personnel */}
              <Card className="bg-white border-2 border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    {isFrench ? 'Profil Personnel - Personne 2' : 'Personal Profile - Person 2'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Province de résidence' : 'Province of residence'}
                    </Label>
                    <Select
                      value={userData.personal?.province2 || ''}
                      onValueChange={(value) => updateUserData('personal', { province2: value })}
                    >
                      <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg w-96">
                        <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-300">
                        <SelectItem value="QC" className="text-lg py-3">Québec</SelectItem>
                        <SelectItem value="ON" className="text-lg py-3">Ontario</SelectItem>
                        <SelectItem value="BC" className="text-lg py-3">Colombie-Britannique</SelectItem>
                        <SelectItem value="AB" className="text-lg py-3">Alberta</SelectItem>
                        <SelectItem value="MB" className="text-lg py-3">Manitoba</SelectItem>
                        <SelectItem value="SK" className="text-lg py-3">Saskatchewan</SelectItem>
                        <SelectItem value="NS" className="text-lg py-3">Nouvelle-Écosse</SelectItem>
                        <SelectItem value="NB" className="text-lg py-3">Nouveau-Brunswick</SelectItem>
                        <SelectItem value="PE" className="text-lg py-3">Île-du-Prince-Édouard</SelectItem>
                        <SelectItem value="NL" className="text-lg py-3">Terre-Neuve-et-Labrador</SelectItem>
                        <SelectItem value="YT" className="text-lg py-3">Yukon</SelectItem>
                        <SelectItem value="NT" className="text-lg py-3">Territoires du Nord-Ouest</SelectItem>
                        <SelectItem value="NU" className="text-lg py-3">Nunavut</SelectItem>
                      </SelectContent>
                    </Select>
              </div>

                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'État de santé général' : 'General health'}
                    </Label>
                    <Select
                      value={userData.personal?.etatSante2 || ''}
                      onValueChange={(value) => updateUserData('personal', { etatSante2: value })}
                    >
                      <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg w-80">
                        <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-300">
                        <SelectItem value="excellent" className="text-lg py-3">{isFrench ? 'Excellent' : 'Excellent'}</SelectItem>
                        <SelectItem value="tresbon" className="text-lg py-3">{isFrench ? 'Très bon' : 'Very good'}</SelectItem>
                        <SelectItem value="bon" className="text-lg py-3">{isFrench ? 'Bon' : 'Good'}</SelectItem>
                        <SelectItem value="moyen" className="text-lg py-3">{isFrench ? 'Moyen' : 'Average'}</SelectItem>
                        <SelectItem value="fragile" className="text-lg py-3">{isFrench ? 'Fragile' : 'Poor'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Mode de vie' : 'Lifestyle'}
                    </Label>
                    <Select
                      value={userData.personal?.modeVieActif2 || ''}
                      onValueChange={(value) => updateUserData('personal', { modeVieActif2: value })}
                    >
                      <SelectTrigger className="bg-white border-2 border-gray-300 text-gray-900 h-12 text-lg w-80">
                        <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-300">
                        <SelectItem value="sedentaire" className="text-lg py-3">{isFrench ? 'Sédentaire' : 'Sedentary'}</SelectItem>
                        <SelectItem value="legerementActif" className="text-lg py-3">{isFrench ? 'Légèrement actif' : 'Lightly active'}</SelectItem>
                        <SelectItem value="modere" className="text-lg py-3">{isFrench ? 'Modérément actif' : 'Moderately active'}</SelectItem>
                        <SelectItem value="actif" className="text-lg py-3">{isFrench ? 'Actif' : 'Active'}</SelectItem>
                        <SelectItem value="tresActif" className="text-lg py-3">{isFrench ? 'Très actif' : 'Very active'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenus - 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personne 1 - Revenus */}
              <Card className="bg-white border-2 border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    {isFrench ? 'Revenus - Personne 1' : 'Income - Person 1'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Salaire annuel' : 'Annual salary'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.salaire1 || ''}
                      onChange={(e) => handleProfileChange('salaire1', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 75000' : 'Ex: 75000'}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Pensions/RRQ' : 'Pensions/CPP'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.pensions1 || ''}
                      onChange={(e) => handleProfileChange('pensions1', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 12000' : 'Ex: 12000'}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Autres revenus' : 'Other income'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.autresRevenus1 || ''}
                      onChange={(e) => handleProfileChange('autresRevenus1', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 5000' : 'Ex: 5000'}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Personne 2 - Revenus */}
              <Card className="bg-white border-2 border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    {isFrench ? 'Revenus - Personne 2' : 'Income - Person 2'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Salaire annuel' : 'Annual salary'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.salaire2 || ''}
                      onChange={(e) => handleProfileChange('salaire2', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 65000' : 'Ex: 65000'}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Pensions/RRQ' : 'Pensions/CPP'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.pensions2 || ''}
                      onChange={(e) => handleProfileChange('pensions2', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 10000' : 'Ex: 10000'}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Autres revenus' : 'Other income'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.autresRevenus2 || ''}
                      onChange={(e) => handleProfileChange('autresRevenus2', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 3000' : 'Ex: 3000'}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dépenses - 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personne 1 - Dépenses */}
              <Card className="bg-white border-2 border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    {isFrench ? 'Dépenses - Personne 1' : 'Expenses - Person 1'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Logement/Hypothèque' : 'Housing/Mortgage'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.logement1 || ''}
                      onChange={(e) => handleProfileChange('logement1', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 1500' : 'Ex: 1500'}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Transport' : 'Transportation'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.transport1 || ''}
                      onChange={(e) => handleProfileChange('transport1', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 400' : 'Ex: 400'}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Autres dépenses' : 'Other expenses'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.autresDepenses1 || ''}
                      onChange={(e) => handleProfileChange('autresDepenses1', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 300' : 'Ex: 300'}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Personne 2 - Dépenses */}
              <Card className="bg-white border-2 border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    {isFrench ? 'Dépenses - Personne 2' : 'Expenses - Person 2'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Épicerie/Alimentation' : 'Groceries/Food'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.epicerie2 || ''}
                      onChange={(e) => handleProfileChange('epicerie2', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 600' : 'Ex: 600'}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Services publics' : 'Utilities'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.servicesPublics2 || ''}
                      onChange={(e) => handleProfileChange('servicesPublics2', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 200' : 'Ex: 200'}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Autres dépenses' : 'Other expenses'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.autresDepenses2 || ''}
                      onChange={(e) => handleProfileChange('autresDepenses2', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 250' : 'Ex: 250'}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calculs de retraite - 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personne 1 - Calculs */}
              <Card className="bg-white border-2 border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    {isFrench ? 'Calculs de Retraite - Personne 1' : 'Retirement Calculations - Person 1'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Âge de retraite souhaité' : 'Desired retirement age'}
                    </Label>
                    <Input
                      type="number"
                      value={userData.personal?.ageRetraiteSouhaite1 || ''}
                      onChange={(e) => handleProfileChange('ageRetraiteSouhaite1', parseInt(e.target.value) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 65' : 'Ex: 65'}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Épargne actuelle' : 'Current savings'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.epargneActuelle1 || ''}
                      onChange={(e) => handleProfileChange('epargneActuelle1', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 50000' : 'Ex: 50000'}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Cotisations annuelles' : 'Annual contributions'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.cotisationsAnnuelles1 || ''}
                      onChange={(e) => handleProfileChange('cotisationsAnnuelles1', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 5000' : 'Ex: 5000'}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Personne 2 - Calculs */}
              <Card className="bg-white border-2 border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    {isFrench ? 'Calculs de Retraite - Personne 2' : 'Retirement Calculations - Person 2'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Âge de retraite souhaité' : 'Desired retirement age'}
                    </Label>
                    <Input
                      type="number"
                      value={userData.personal?.ageRetraiteSouhaite2 || ''}
                      onChange={(e) => handleProfileChange('ageRetraiteSouhaite2', parseInt(e.target.value) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 63' : 'Ex: 63'}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Épargne actuelle' : 'Current savings'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.epargneActuelle2 || ''}
                      onChange={(e) => handleProfileChange('epargneActuelle2', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 35000' : 'Ex: 35000'}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-lg font-semibold text-gray-900 w-72 flex-shrink-0">
                      {isFrench ? 'Cotisations annuelles' : 'Annual contributions'}
                    </Label>
                    <Input
                      type="text"
                      value={userData.personal?.cotisationsAnnuelles2 || ''}
                      onChange={(e) => handleProfileChange('cotisationsAnnuelles2', parseFloat(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                      className="bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-600 focus:ring-2 focus:ring-green-200 text-lg h-12 w-48"
                      placeholder={isFrench ? 'Ex: 4000' : 'Ex: 4000'}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analyse de longévité - 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personne 1 - Longévité */}
              <Card className="bg-white border-2 border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    {isFrench ? 'Analyse de Longévité - Personne 1' : 'Longevity Analysis - Person 1'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!canComputeMortality(1) && (
                <Alert className="border-amber-300 bg-amber-50 text-amber-800">
                  <Info className="h-5 w-5 text-amber-500" />
                  <AlertDescription>
                    {isFrench
                          ? 'Complétez la date de naissance pour afficher l\'analyse.'
                          : 'Complete date of birth to display the analysis.'}
                  </AlertDescription>
                </Alert>
              )}

              {canComputeMortality(1) && !hasCompleteMortalityData(1) && (
                <Alert className="border-blue-300 bg-blue-50 text-blue-800">
                  <Info className="h-5 w-5 text-blue-500" />
                  <AlertDescription>
                    {isFrench
                          ? 'Analyse basée sur la date de naissance. Complétez le sexe et la province pour une analyse plus précise.'
                          : 'Analysis based on birth date. Complete gender and province for more precise analysis.'}
                  </AlertDescription>
                </Alert>
              )}

              <MortalityDisplayCPM2014
                age={computeAgeFromBirthdate(userData.personal?.naissance1)}
                gender={getGenderForMortality(userData.personal?.sexe1 as any) || 'male'}
                showDetails={showMortalityDetails}
                resultOverride={mortalityOverride}
              />

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowMortalityDetails(!showMortalityDetails)}
                  className="border-amber-400 text-amber-700 hover:bg-amber-50"
                >
                  {showMortalityDetails ? (isFrench ? 'Masquer les détails' : 'Hide details') : (isFrench ? 'Afficher les détails' : 'Show details')}
                </Button>
              </div>
                </CardContent>
              </Card>

              {/* Personne 2 - Longévité */}
              <Card className="bg-white border-2 border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    {isFrench ? 'Analyse de Longévité - Personne 2' : 'Longevity Analysis - Person 2'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!canComputeMortality(2) && (
                    <Alert className="border-amber-300 bg-amber-50 text-amber-800">
                      <Info className="h-5 w-5 text-amber-500" />
                      <AlertDescription>
                        {isFrench
                          ? 'Complétez la date de naissance pour afficher l\'analyse.'
                          : 'Complete date of birth to display the analysis.'}
                      </AlertDescription>
                    </Alert>
                  )}

                  {canComputeMortality(2) && !hasCompleteMortalityData(2) && (
                    <Alert className="border-green-300 bg-green-50 text-green-800">
                      <Info className="h-5 w-5 text-green-500" />
                      <AlertDescription>
                        {isFrench
                          ? 'Analyse basée sur la date de naissance. Complétez le sexe et la province pour une analyse plus précise.'
                          : 'Analysis based on birth date. Complete gender and province for more precise analysis.'}
                      </AlertDescription>
                    </Alert>
                  )}

                  <MortalityDisplayCPM2014
                    age={computeAgeFromBirthdate(userData.personal?.naissance2)}
                    gender={getGenderForMortality(userData.personal?.sexe2 as any) || 'male'}
                    showDetails={showMortalityDetails2}
                    resultOverride={mortalityOverride2}
                  />

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowMortalityDetails2(!showMortalityDetails2)}
                      className="border-amber-400 text-amber-700 hover:bg-amber-50"
                    >
                      {showMortalityDetails2 ? (isFrench ? 'Masquer les détails' : 'Hide details') : (isFrench ? 'Afficher les détails' : 'Show details')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

                        {/* Conformité IPF 2025 */}
            <Card className="bg-white border-2 border-amber-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{isFrench ? 'Conformité IPF 2025' : 'IPF 2025 compliance'}</span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      MORTALITY_CPM2014.validateCompliance() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {MORTALITY_CPM2014.validateCompliance() ? (isFrench ? 'Conforme' : 'Compliant') : (isFrench ? 'Non conforme' : 'Non-compliant')}
                  </span>
                </div>
                <div className="mt-4 text-sm text-gray-700 space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800">
                      <strong>IPF</strong> = {isFrench ? 'Institut de planification financière' : 'Institut de planification financière (IPF)'}
                    </p>
                    <p className="text-blue-700 mt-1">
                      {isFrench 
                        ? 'L\'organisme qui régit la profession de planificateur financier au Québec. Nos calculs respectent leurs normes de projection 2025.'
                        : 'The organization that governs the financial planning profession in Quebec. Our calculations comply with their 2025 projection standards.'}
                    </p>
                    <a 
                      href="https://institutpf.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline mt-2"
                    >
                      {isFrench ? 'Visiter le site de l\'IPF' : 'Visit IPF website'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  <div>
                    <strong>Source:</strong> {MORTALITY_CPM2014.metadata.source}
                  </div>
                  <div>
                    <strong>Table:</strong> {MORTALITY_CPM2014.metadata.table}
                  </div>
                  <div>
                    <strong>Projection:</strong> {MORTALITY_CPM2014.metadata.projection}
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Revenus et actifs */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <Building className="w-6 h-6" />
                {isFrench ? 'Mes revenus et actifs — Tableau de bord' : 'My income and assets — Dashboard'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-white">
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Salaires combinés (annuel)' : 'Combined salaries (annual)'}
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {formatCurrency((userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0), { showCents: false })}
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-white">
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'RRQ combinée (par mois)' : 'Combined CPP/QPP (per month)'}
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {formatCurrency((userData.retirement?.rrqMontantActuel1 || 0) + (userData.retirement?.rrqMontantActuel2 || 0), { showCents: false })}
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-white">
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Pensions privées (annuel)' : 'Private pensions (annual)'}
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {formatCurrency((userData.retirement?.pensionPrivee1 || 0) + (userData.retirement?.pensionPrivee2 || 0), { showCents: false })}
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-white">
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Épargne REER totale' : 'Total RRSP savings'}
                  </div>
                  <div className="text-2xl font-bold text-amber-700">
                    {formatCurrency((userData.savings?.reer1 || 0) + (userData.savings?.reer2 || 0), { showCents: false })}
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-white">
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Épargne CELI totale' : 'Total TFSA savings'}
                  </div>
                  <div className="text-2xl font-bold text-cyan-700">
                    {formatCurrency((userData.savings?.celi1 || 0) + (userData.savings?.celi2 || 0), { showCents: false })}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => handleNavigation('/mes-revenus')}>
                  {isFrench ? 'Modifier sur la page Revenus' : 'Edit on Revenues page'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dépenses et budget */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-800">
                <CreditCard className="w-6 h-6" />
                {isFrench ? 'Mes dépenses et budget — Tableau de bord' : 'My expenses and budget — Dashboard'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-white">
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Dépenses mensuelles saisies' : 'Entered monthly expenses'}
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(userData.personal?.depensesMensuelles || 0, { showCents: false })}
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-white">
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Revenus mensuels estimés' : 'Estimated monthly income'}
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {formatCurrency(
                      Math.round(
                        (((userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0)) / 12) +
                        ((userData.retirement?.rrqMontantActuel1 || 0) + (userData.retirement?.rrqMontantActuel2 || 0)) +
                        (((userData.retirement?.pensionPrivee1 || 0) + (userData.retirement?.pensionPrivee2 || 0)) / 12)
                      ),
                      { showCents: false }
                    )}
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-white">
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Flux de trésorerie (mois)' : 'Monthly cashflow'}
                  </div>
                  <div className={`text-2xl font-bold ${Math.round(
                        (((userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0)) / 12) +
                        ((userData.retirement?.rrqMontantActuel1 || 0) + (userData.retirement?.rrqMontantActuel2 || 0)) +
                        (((userData.retirement?.pensionPrivee1 || 0) + (userData.retirement?.pensionPrivee2 || 0)) / 12)
                      ) - (userData.personal?.depensesMensuelles || 0) >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {formatCurrency(
                      Math.round(
                        (((userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0)) / 12) +
                        ((userData.retirement?.rrqMontantActuel1 || 0) + (userData.retirement?.rrqMontantActuel2 || 0)) +
                        (((userData.retirement?.pensionPrivee1 || 0) + (userData.retirement?.pensionPrivee2 || 0)) / 12)
                      ) - (userData.personal?.depensesMensuelles || 0),
                      { showCents: false }
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => handleNavigation('/depenses')}>
                  {isFrench ? 'Modifier sur la page Dépenses' : 'Edit on Expenses page'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Calculs de retraite */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-800">
                <BarChart3 className="w-6 h-6" />
                {isFrench ? 'Mes calculs de retraite — Tableau de bord' : 'My retirement calculations — Dashboard'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-white">
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Âge de retraite souhaité' : 'Desired retirement age'}
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {userData.personal?.ageRetraiteSouhaite1 || 65} {isFrench ? 'ans' : 'yrs'}
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-white">
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Années avant la retraite (approx.)' : 'Years to retirement (approx.)'}
                  </div>
                  <div className="text-2xl font-bold text-indigo-700">
                    {Math.max(0, (userData.personal?.ageRetraiteSouhaite1 || 65) - computeAgeFromBirthdate(userData.personal?.naissance1))} {isFrench ? 'ans' : 'yrs'}
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-white">
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Espérance de vie (CPM2014)' : 'Life expectancy (CPM2014)'}
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {(userData.retirement?.esperanceVie1 || 0)} {isFrench ? 'ans' : 'yrs'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isFrench ? 'Âge de planification recommandé' : 'Recommended planning age'}: {mortalityOverride?.planningAge || MORTALITY_CPM2014.getRecommendedPlanningAge(computeAgeFromBirthdate(userData.personal?.naissance1), getGenderForMortality(userData.personal?.sexe1 as any) || 'male')}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => handleNavigation('/fr/rapports-retraite')}>
                  {isFrench ? 'Voir les rapports' : 'View reports'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sauvegarde */}
          <div className="text-center">
            <Button
              size="lg"
              disabled={isSaving}
              className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white font-bold text-2xl py-6 px-12 shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={async () => {
                setIsSaving(true);
                try {
                  if (userData.personal?.depensesRetraite && userData.personal.depensesRetraite > 0) {
                    const depensesMensuelles = Math.round(userData.personal.depensesRetraite / 12);
                    handleProfileChange('depensesMensuelles', depensesMensuelles);
                  }
                  const saveResult = await EnhancedSaveManager.saveWithDialog(userData, { includeTimestamp: true });
                  if (saveResult.success) {
                    alert(
                      isFrench
                        ? `✅ Données sauvegardées avec succès dans ${saveResult.filename} !`
                        : `✅ Data saved successfully to ${saveResult.filename}!`,
                    );
                  } else if (saveResult.blocked) {
                    alert(isFrench ? `🚫 Sauvegarde bloquée: ${saveResult.reason}` : `🚫 Save blocked: ${saveResult.reason}`);
                  } else {
                    alert(isFrench ? `❌ Erreur: ${saveResult.error}` : `❌ Error: ${saveResult.error}`);
                  }
                } catch (error) {
                  console.error('❌ Erreur lors de la sauvegarde:', error);
                  alert(isFrench ? '❌ Erreur lors de la sauvegarde' : '❌ Error saving data');
                } finally {
                  setIsSaving(false);
                }
              }}
            >
              <Save className="w-8 h-8 mr-4 animate-pulse" />
              {isSaving ? (isFrench ? '💾 SAUVEGARDE...' : '💾 SAVING...') : isFrench ? '💾 SAUVEGARDER' : '💾 SAVE'}
              <Shield className="w-8 h-8 ml-4 animate-bounce" />
            </Button>
          </div>

          {/* Navigation */}
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <CardContent className="py-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Star className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-800">{isFrench ? 'Excellent travail!' : 'Excellent work!'}</h2>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                {isFrench
                  ? 'Vous construisez votre avenir financier étape par étape. Chaque détail compte pour créer un plan qui vous ressemble vraiment.'
                  : 'You are building your financial future step by step. Every detail counts to create a plan that truly reflects you.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onClick={() => handleNavigation('/fr/rapports-retraite')}
                >
                  {isFrench ? 'Voir mes résultats' : 'View my results'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showOnboardingWizard && (
        <OnboardingWizard onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} isFrench={isFrench} />
      )}
    </div>
  );
};

export default MaRetraite;
