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

  const handleDepensesChange = (field: string, value: string) => {
    setDepensesData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalculsChange = (field: string, value: string) => {
    setCalculsData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileChange = (field: string, value: any) => {
    const newData = { ...userData, personal: { ...userData.personal, [field]: value } };
    const licenseCheck = LicenseManager.checkLicense(newData as any);
    if (!licenseCheck.isValid) {
      setLicenseBlocked(true);
      setLicenseMessage(licenseCheck.reason || 'Modification bloquée');
      return;
    }
    setLicenseBlocked(false);
    setLicenseMessage('');
    updateUserData('personal', { [field]: value });
  };

  const handleNameChange = (field: string, value: string) => {
    updateUserData('personal', { [field]: value });
  };

  const handleSalaryChange = (person: '1' | '2', value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d.]/g, '')) || 0;
    handleProfileChange(`salaire${person}`, numericValue);
  };

  const formatSalaryInput = (value: number): string => {
    return value > 0 ? formatCurrency(value, { showCents: false }) : '';
  };

  const getProfileProgress = () => {
    const personalData = userData.personal;
    if (!personalData) return 0;

    const requiredFields = [
      'prenom1',
      'naissance1',
      'sexe1',
      'salaire1',
      'statutProfessionnel1',
      'ageRetraiteSouhaite1'
    ];

    const filledFields = requiredFields.filter((field) => {
      const value = (personalData as any)[field];
      return value !== null && value !== undefined && value !== '' && value !== 0;
    }).length;

    return Math.round((filledFields / requiredFields.length) * 100);
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

  const canComputeMortality = (): boolean => {
    const p = (userData.personal || {}) as any;
    const hasBirth = !!p.naissance1 && !isNaN(new Date(p.naissance1).getTime());
    const hasGender = !!p.sexe1;
    const hasProvince = !!p.province && String(p.province).trim() !== '';
    return hasBirth && hasGender && hasProvince;
  };

  const mortalityOverride = useMemo(() => {
    if (!canComputeMortality()) {
      return {
        lifeExpectancy: 0,
        finalAge: 0,
        planningAge: 0,
        source: isFrench ? 'Champs requis incomplets' : 'Required fields incomplete',
      };
    }

    const age = computeAgeFromBirthdate(userData.personal?.naissance1);
    const gender = getGenderForMortality(userData.personal?.sexe1 as any);
    const base = MORTALITY_CPM2014.calculateLifeExpectancy({ age, gender });

    let adj = 0;
    const etat = userData.personal?.etatSante as
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

    const mode = userData.personal?.modeVieActif as
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

    if (adj > 2) adj = 2;
    if (adj < -2) adj = -2;

    const lifeExp = Math.max(0, Number((base.lifeExpectancy + adj).toFixed(1)));
    const finalAge = Math.round(age + lifeExp);
    const planningAge = Math.min(100, Math.round(base.recommendedPlanningAge + adj));

    return {
      lifeExpectancy: lifeExp,
      finalAge,
      planningAge,
      source: (base.source || 'CPM2014') + (adj !== 0 ? ' + ajustements (profil)' : ''),
    };
  }, [
    userData.personal?.naissance1,
    userData.personal?.sexe1,
    userData.personal?.province,
    userData.personal?.etatSante,
    userData.personal?.modeVieActif,
    isFrench,
  ]);

  useEffect(() => {
    const value = mortalityOverride.lifeExpectancy || 0;
    updateUserData('retirement', { esperanceVie1: value });
  }, [mortalityOverride.lifeExpectancy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* En-tête simple */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
              {isFrench ? 'Ma retraite' : 'My retirement'}
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            {isFrench
              ? "Travaillons ensemble avec vos ressources réelles. Chaque source de revenus et chaque dépense compte pour créer votre plan personnalisé."
              : "Let's work together with your real resources. Every source of income and every expense counts to create your personalized plan."}
          </p>
        </div>

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
                {isFrench ? '🎯 Commencez ici' : '🎯 Start here'}
              </Button>
            </div>

            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
              <CardContent className="py-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Star className="w-6 h-6 text-yellow-300" />
                    <span className="text-lg font-semibold text-white">
                      {isFrench ? 'Votre progression' : 'Your progress'}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-white">{getProfileProgress()} %</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-300 to-orange-300 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getProfileProgress()}%` }}
                  ></div>
                </div>
                <p className="text-sm text-white/90 mt-2 text-center">
                  {isFrench
                    ? `Excellent travail ! Vous avez complété ${getProfileProgress()} % de votre profil.`
                    : `Great work! You have completed ${getProfileProgress()} % of your profile.`}
                </p>
              </CardContent>
            </Card>

            {showHelp && (
              <Alert className="border-yellow-400 bg-yellow-50 text-yellow-800">
                <Info className="h-5 w-5 text-yellow-400" />
                <AlertDescription className="text-lg">
                  <strong>{isFrench ? 'Conseils :' : 'Tips:'}</strong>{' '}
                  {isFrench
                    ? "Entrez vos noms complets (prénoms composés, noms de famille) pour une personnalisation optimale de vos rapports. Si vous êtes seul(e), laissez la section « Personne 2 » vide. Les montants en dollars n'incluent pas les centimes pour simplifier la saisie."
                    : 'Enter your full names for better personalization. If single, leave "Person 2" empty. Dollar amounts do not include cents.'}
                </AlertDescription>
              </Alert>
            )}

            {/* Formulaire principal du profil */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Personne 1 */}
              <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-xl">
                <CardHeader className="border-b border-blue-500/30 bg-blue-500/20">
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    {isFrench ? 'Personne 1' : 'Person 1'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white font-semibold">
                        {isFrench ? 'Nom complet' : 'Full Name'}
                      </Label>
                      <Input
                        type="text"
                        value={userData.personal?.prenom1 || ''}
                        onChange={(e) => handleNameChange('prenom1', e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-white focus:ring-white/20"
                        placeholder={isFrench ? 'Ex: Jean Philippe…' : 'Ex: John Smith…'}
                      />
                    </div>

                    <div className="space-y-2">
                      <CustomBirthDateInput
                        id="naissance1"
                        label={isFrench ? 'Date de naissance' : 'Date of Birth'}
                        value={userData.personal?.naissance1 || ''}
                        onChange={(date) => handleProfileChange('naissance1', date)}
                        className="bg-white/20 border-white/30 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-semibold">{isFrench ? 'Sexe' : 'Gender'}</Label>
                      <Select
                        value={userData.personal?.sexe1 || 'homme'}
                        onValueChange={(value) => handleProfileChange('sexe1', value)}
                      >
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem value="homme">{isFrench ? 'Homme' : 'Male'}</SelectItem>
                          <SelectItem value="femme">{isFrench ? 'Femme' : 'Female'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-semibold">
                        {isFrench ? 'Salaire annuel' : 'Annual Salary'}
                      </Label>
                      <Input
                        type="text"
                        value={formatSalaryInput(userData.personal?.salaire1 || 0)}
                        onChange={(e) => handleSalaryChange('1', e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-white focus:ring-white/20"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-semibold">
                        {isFrench ? 'Statut professionnel' : 'Professional Status'}
                      </Label>
                      <Select
                        value={userData.personal?.statutProfessionnel1 || 'actif'}
                        onValueChange={(value) => handleProfileChange('statutProfessionnel1', value)}
                      >
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem value="actif">{isFrench ? 'Actif' : 'Active'}</SelectItem>
                          <SelectItem value="retraite">{isFrench ? 'Retraité' : 'Retired'}</SelectItem>
                          <SelectItem value="inactif">{isFrench ? 'Inactif' : 'Inactive'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-semibold">
                        {isFrench ? 'Âge de retraite souhaité' : 'Desired Retirement Age'}
                      </Label>
                      <Input
                        type="number"
                        value={userData.personal?.ageRetraiteSouhaite1 || 65}
                        onChange={(e) => handleProfileChange('ageRetraiteSouhaite1', Number(e.target.value))}
                        className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-white focus:ring-white/20"
                        min={50}
                        max={100}
                      />
                    </div>

                    
                  </div>
                </CardContent>
              </Card>

              {/* Personne 2 */}
              <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0 shadow-xl">
                <CardHeader className="border-b border-indigo-500/30 bg-indigo-500/20">
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    {isFrench ? 'Personne 2' : 'Person 2'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white font-semibold">
                        {isFrench ? 'Nom complet (optionnel)' : 'Full Name (optional)'}
                      </Label>
                      <Input
                        type="text"
                        value={userData.personal?.prenom2 || ''}
                        onChange={(e) => handleNameChange('prenom2', e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-white focus:ring-white/20"
                        placeholder={isFrench ? 'Ex: Marie…' : 'Ex: Mary…'}
                      />
                    </div>

                    <div className="space-y-2">
                      <CustomBirthDateInput
                        id="naissance2"
                        label={isFrench ? 'Date de naissance' : 'Date of Birth'}
                        value={userData.personal?.naissance2 || ''}
                        onChange={(date) => handleProfileChange('naissance2', date)}
                        className="bg-white/20 border-white/30 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-semibold">{isFrench ? 'Sexe' : 'Gender'}</Label>
                      <Select
                        value={userData.personal?.sexe2 || 'femme'}
                        onValueChange={(value) => handleProfileChange('sexe2', value)}
                      >
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem value="homme">{isFrench ? 'Homme' : 'Male'}</SelectItem>
                          <SelectItem value="femme">{isFrench ? 'Femme' : 'Female'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-semibold">
                        {isFrench ? 'Salaire annuel' : 'Annual Salary'}
                      </Label>
                      <Input
                        type="text"
                        value={formatSalaryInput(userData.personal?.salaire2 || 0)}
                        onChange={(e) => handleSalaryChange('2', e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-white focus:ring-white/20"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-semibold">
                        {isFrench ? 'Statut professionnel' : 'Professional Status'}
                      </Label>
                      <Select
                        value={userData.personal?.statutProfessionnel2 || 'actif'}
                        onValueChange={(value) => handleProfileChange('statutProfessionnel2', value)}
                      >
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem value="actif">{isFrench ? 'Actif' : 'Active'}</SelectItem>
                          <SelectItem value="retraite">{isFrench ? 'Retraité' : 'Retired'}</SelectItem>
                          <SelectItem value="inactif">{isFrench ? 'Inactif' : 'Inactive'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-semibold">
                        {isFrench ? 'Âge de retraite souhaité' : 'Desired Retirement Age'}
                      </Label>
                      <Input
                        type="number"
                        value={userData.personal?.ageRetraiteSouhaite2 || 65}
                        onChange={(e) => handleProfileChange('ageRetraiteSouhaite2', Number(e.target.value))}
                        className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-white focus:ring-white/20"
                        min={50}
                        max={100}
                      />
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

          {/* Optionnel — Modules et hypothèses avancées */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-amber-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-800">
                <Info className="w-6 h-6" />
                {isFrench ? 'Optionnel — Modules et hypothèses avancées' : 'Optional — Advanced modules and assumptions'}
              </CardTitle>
              <p className="text-gray-700">
                {isFrench
                  ? "Section pour alimenter les modules techniques (CPM2014, hypothèses IPF 2025) et visualiser l’analyse de longévité."
                  : 'Section to feed technical modules (CPM2014, IPF 2025 assumptions) and visualize longevity analysis.'}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-gray-700">{isFrench ? 'Province de résidence' : 'Province of residence'}</Label>
                  <Select
                    value={userData.personal?.province || ''}
                    onValueChange={(value) => updateUserData('personal', { province: value })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QC">Québec</SelectItem>
                      <SelectItem value="ON">Ontario</SelectItem>
                      <SelectItem value="BC">Colombie-Britannique</SelectItem>
                      <SelectItem value="AB">Alberta</SelectItem>
                      <SelectItem value="MB">Manitoba</SelectItem>
                      <SelectItem value="SK">Saskatchewan</SelectItem>
                      <SelectItem value="NS">Nouvelle-Écosse</SelectItem>
                      <SelectItem value="NB">Nouveau-Brunswick</SelectItem>
                      <SelectItem value="PE">Île-du-Prince-Édouard</SelectItem>
                      <SelectItem value="NL">Terre-Neuve-et-Labrador</SelectItem>
                      <SelectItem value="YT">Yukon</SelectItem>
                      <SelectItem value="NT">Territoires du Nord-Ouest</SelectItem>
                      <SelectItem value="NU">Nunavut</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-gray-700">{isFrench ? 'État de santé général' : 'General health'}</Label>
                  <Select
                    value={userData.personal?.etatSante || ''}
                    onValueChange={(value) => updateUserData('personal', { etatSante: value })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">{isFrench ? 'Excellent' : 'Excellent'}</SelectItem>
                      <SelectItem value="tresbon">{isFrench ? 'Très bon' : 'Very good'}</SelectItem>
                      <SelectItem value="bon">{isFrench ? 'Bon' : 'Good'}</SelectItem>
                      <SelectItem value="moyen">{isFrench ? 'Moyen' : 'Average'}</SelectItem>
                      <SelectItem value="fragile">{isFrench ? 'Fragile' : 'Poor'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-gray-700">{isFrench ? 'Mode de vie' : 'Lifestyle'}</Label>
                  <Select
                    value={userData.personal?.modeVieActif || ''}
                    onValueChange={(value) => updateUserData('personal', { modeVieActif: value })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentaire">{isFrench ? 'Sédentaire' : 'Sedentary'}</SelectItem>
                      <SelectItem value="legerementActif">{isFrench ? 'Légèrement actif' : 'Lightly active'}</SelectItem>
                      <SelectItem value="modere">{isFrench ? 'Modérément actif' : 'Moderately active'}</SelectItem>
                      <SelectItem value="actif">{isFrench ? 'Actif' : 'Active'}</SelectItem>
                      <SelectItem value="tresActif">{isFrench ? 'Très actif' : 'Very active'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {!canComputeMortality() && (
                <Alert className="border-amber-300 bg-amber-50 text-amber-800">
                  <Info className="h-5 w-5 text-amber-500" />
                  <AlertDescription>
                    {isFrench
                      ? 'Complétez la date de naissance, le sexe et la province pour afficher l’analyse. Les résultats resteront à 0 tant que ces champs ne sont pas remplis.'
                      : 'Complete date of birth, gender and province to display the analysis. Results remain 0 until fields are filled.'}
                  </AlertDescription>
                </Alert>
              )}

              <MortalityDisplayCPM2014
                age={computeAgeFromBirthdate(userData.personal?.naissance1)}
                gender={getGenderForMortality(userData.personal?.sexe1 as any)}
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

              <div className="rounded-lg border p-4 bg-gray-50">
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
                <div className="mt-4 text-sm text-gray-700 space-y-1">
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
              </div>
            </CardContent>
          </Card>

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
                    {isFrench ? 'Âge de planification recommandé' : 'Recommended planning age'}: {mortalityOverride?.planningAge || MORTALITY_CPM2014.getRecommendedPlanningAge(computeAgeFromBirthdate(userData.personal?.naissance1), getGenderForMortality(userData.personal?.sexe1 as any))}
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
