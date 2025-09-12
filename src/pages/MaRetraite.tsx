import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { calculateIncomeFromPeriods } from '@/utils/incomeCalculationUtils';
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
  Flag,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import { LicenseManager } from '@/services/LicenseManager';
import { EnhancedSaveManager } from '@/services/EnhancedSaveManager';
import OnboardingWizard from '@/features/retirement/components/OnboardingWizard';
import { CustomBirthDateInput } from '@/features/retirement/components/CustomBirthDateInput';
import { MortalityDisplayCPM2014 } from '@/components/MortalityDisplayCPM2014';
import { MORTALITY_CPM2014 } from '@/config/financial-assumptions';
import LongevityModeSelector from '@/components/ui/LongevityModeSelector';
import SocioEconomicSection from '@/components/ui/SocioEconomicSection';
import SynchronizedIncomeDisplay from '@/components/ui/SynchronizedIncomeDisplay';
import HealthFactorsSection from '@/components/ui/HealthFactorsSection';
import PersonalizedLongevityAnalysis from '@/components/ui/PersonalizedLongevityAnalysis';
import ValidationAlert from '@/components/ui/ValidationAlert';

/* CSS pour disposition horizontale des formulaires */
const inlineFormStyles = `
.senior-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  min-height: 48px;
}

.senior-form-label {
  font-size: 18px;
  font-weight: 600;
  color: #1a365d;
  text-align: left;
}

.senior-form-input {
  font-size: 18px;
  min-height: 48px;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.senior-form-input:focus {
  border-color: #4c6ef5;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
  outline: none;
}

@media (max-width: 768px) {
  .senior-form-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .senior-form-label {
    text-align: left;
  }
}

/* Styles pour les sommaires horizontaux */
.senior-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  min-height: 48px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e2e8f0;
}

.senior-summary-label {
  font-size: 18px;
  font-weight: 500;
  color: #4a5568;
  flex: 1;
}

.senior-summary-value {
  font-size: 20px;
  font-weight: 700;
  text-align: right;
}

.senior-summary-unit {
  font-size: 14px;
  font-weight: 400;
  color: #718096;
  margin-left: 8px;
}
`;

const MaRetraite: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Fonction de formatage monétaire québécoise
  const formatCurrencyQuebec = (amount: number): string => {
    if (amount === 0) return '0 $';
    
    return new Intl.NumberFormat('fr-CA', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' $';
  };

  // Injecter les styles CSS pour les formulaires horizontaux
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = inlineFormStyles;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  const isFrench = language === 'fr';

  const { userData, updateUserData } = useRetirementData();

  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);

  // Mode d'analyse de longévité
  const [longevityMode, setLongevityMode] = useState<'standard' | 'personalized'>('standard');

  // Charger les données depuis localStorage au montage du composant
  useEffect(() => {
    const loadImportedData = () => {
      try {
        const importedData = localStorage.getItem('retirement_data');
        if (importedData) {
          const parsedData = JSON.parse(importedData);
          console.log('📥 Données trouvées dans localStorage:', parsedData);
          
          // Mettre à jour les données si elles existent
          if (parsedData.personal) {
            updateUserData('personal', parsedData.personal);
          }
          if (parsedData.retirement) {
            updateUserData('retirement', parsedData.retirement);
          }
          if (parsedData.savings) {
            updateUserData('savings', parsedData.savings);
          }
          if (parsedData.cashflow) {
            updateUserData('cashflow', parsedData.cashflow);
          }
        } else {
          console.log('📭 Aucune donnée trouvée dans localStorage');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    loadImportedData();

    // Écouter les événements d'importation de données
    const handleDataImported = (event: CustomEvent) => {
      try {
        const importedData = event.detail.data;
        console.log('📥 Données importées reçues via événement:', importedData);
        
        // Mettre à jour les données si elles existent
        if (importedData.personal) {
          updateUserData('personal', importedData.personal);
        }
        if (importedData.retirement) {
          updateUserData('retirement', importedData.retirement);
        }
        if (importedData.savings) {
          updateUserData('savings', importedData.savings);
        }
        if (importedData.cashflow) {
          updateUserData('cashflow', importedData.cashflow);
        }
      } catch (error) {
        console.error('Erreur lors du traitement des données importées:', error);
      }
    };

    window.addEventListener('retirementDataImported', handleDataImported as EventListener);

    return () => {
      window.removeEventListener('retirementDataImported', handleDataImported as EventListener);
    };
  }, [updateUserData]);

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

  // Fonctions de calcul des revenus depuis unifiedIncome avec périodes réelles
  const calculatePersonIncome = (personNumber: 1 | 2) => {
    const incomeData = personNumber === 1 ? 
      (userData.personal as any)?.unifiedIncome1 || [] : 
      (userData.personal as any)?.unifiedIncome2 || [];
    
    // Utiliser la nouvelle logique de calcul basée sur les périodes
    const result = calculateIncomeFromPeriods(incomeData);
    
    return {
      totalSalary: result.totalSalary,
      totalPensions: result.totalPensions,
      totalOtherIncome: result.totalOtherIncome,
      totalIncome: result.totalIncome
    };
  };

  const calculatePersonSavings = (personNumber: 1 | 2) => {
    const personal = (userData.personal as any) || {};
    const savings = userData.savings || {};

    if (personNumber === 1) {
      return {
        reer: personal.soldeREER1 || savings.reer1 || 0,
        celi: personal.soldeCELI1 || savings.celi1 || 0,
        placements: savings.placements1 || 0,
        epargne: savings.epargne1 || 0,
        cri: personal.soldeCRI1 || savings.cri1 || 0
      };
    } else {
      return {
        reer: personal.soldeREER2 || savings.reer2 || 0,
        celi: personal.soldeCELI2 || savings.celi2 || 0,
        placements: savings.placements2 || 0,
        epargne: savings.epargne2 || 0,
        cri: personal.soldeCRI2 || savings.cri2 || 0
      };
    }
  };

  // Calculs pour Personne 1 et Personne 2
  const person1Income = calculatePersonIncome(1);
  const person2Income = calculatePersonIncome(2);
  const person1Savings = calculatePersonSavings(1);
  const person2Savings = calculatePersonSavings(2);

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

  // Fonction pour forcer le rechargement des données
  const reloadData = () => {
    try {
      const importedData = localStorage.getItem('retirement_data');
      if (importedData) {
        const parsedData = JSON.parse(importedData);
        console.log('🔄 Rechargement forcé des données:', parsedData);
        
        // Mettre à jour les données si elles existent
        if (parsedData.personal) {
          updateUserData('personal', parsedData.personal);
        }
        if (parsedData.retirement) {
          updateUserData('retirement', parsedData.retirement);
        }
        if (parsedData.savings) {
          updateUserData('savings', parsedData.savings);
        }
        if (parsedData.cashflow) {
          updateUserData('cashflow', parsedData.cashflow);
        }
        
        alert('Données rechargées avec succès !');
      } else {
        alert('Aucune donnée trouvée dans le stockage local.');
      }
    } catch (error) {
      console.error('Erreur lors du rechargement:', error);
      alert('Erreur lors du rechargement des données.');
    }
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
    
    let birth: Date;
    
    // Gérer le format "19560706" (YYYYMMDD)
    if (/^\d{8}$/.test(birthDate)) {
      const year = parseInt(birthDate.substring(0, 4));
      const month = parseInt(birthDate.substring(4, 6)) - 1; // Les mois commencent à 0
      const day = parseInt(birthDate.substring(6, 8));
      birth = new Date(year, month, day);
    } else {
      // Gérer le format standard "1956-07-06" ou autres
      birth = new Date(birthDate);
    }
    
    if (isNaN(birth.getTime())) {
      console.warn('Date de naissance invalide:', birthDate);
      return 65;
    }
    
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
    
    if (!birthValue) {
      console.log(`canComputeMortality(${personNumber}): Pas de date de naissance`);
      return false;
    }
    
    // Vérifier le format "19560706" (YYYYMMDD)
    let isValidDate = false;
    if (/^\d{8}$/.test(birthValue)) {
      const year = parseInt(birthValue.substring(0, 4));
      const month = parseInt(birthValue.substring(4, 6)) - 1;
      const day = parseInt(birthValue.substring(6, 8));
      const testDate = new Date(year, month, day);
      isValidDate = !isNaN(testDate.getTime());
    } else {
      // Vérifier le format standard
      isValidDate = !isNaN(new Date(birthValue).getTime());
    }
    
    console.log(`canComputeMortality(${personNumber}):`, {
      birthField,
      birthValue,
      isValidDate,
      userData: userData.personal
    });
    
    return isValidDate;
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
      console.log(`calculateMortalityForPerson(${personNumber}): Ne peut pas calculer - date de naissance manquante ou invalide`);
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
    
    console.log(`calculateMortalityForPerson(${personNumber}):`, {
      birthField,
      birthValue: userData.personal?.[birthField],
      age,
      gender,
      genderField,
      genderValue: userData.personal?.[genderField]
    });
    
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setShowOnboardingWizard(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                {isFrench ? '🎯 Planificateur de retraite automatisé' : '🎯 Automated Retirement Planner'}
              </Button>
                <Button
                  onClick={reloadData}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50 font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isFrench ? '🔄 Recharger les données' : '🔄 Reload Data'}
                </Button>
              </div>
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
                    <div className="senior-form-row">
                      <Label className="senior-form-label">
                        {isFrench ? 'Nom complet' : 'Full Name'}
                      </Label>
                      <Input
                        type="text"
                        value={userData.personal?.prenom1 || ''}
                        onChange={(e) => handleNameChange('prenom1', e.target.value)}
                        className="senior-form-input"
                        placeholder={isFrench ? 'Ex: Jean Philippe…' : 'Ex: John Smith…'}
                      />
                    </div>

                    {/* Date de naissance */}
                    <div className="senior-form-row">
                      <Label className="senior-form-label">
                        {isFrench ? 'Date de naissance' : 'Date of Birth'}
                      </Label>
                      <CustomBirthDateInput
                        id="naissance1"
                        label=""
                        value={userData.personal?.naissance1 || ''}
                        onChange={(date) => handleProfileChange('naissance1', date)}
                        className="senior-form-input"
                      />
                    </div>

                    {/* Sexe */}
                    <div className="senior-form-row">
                      <Label className="senior-form-label">
                        {isFrench ? 'Sexe' : 'Gender'}
                      </Label>
                      <Select
                        value={userData.personal?.sexe1 || 'homme'}
                        onValueChange={(value) => handleProfileChange('sexe1', value)}
                      >
                        <SelectTrigger className="senior-form-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-gray-300">
                          <SelectItem value="homme" className="text-lg py-3">{isFrench ? 'Homme' : 'Male'}</SelectItem>
                          <SelectItem value="femme" className="text-lg py-3">{isFrench ? 'Femme' : 'Female'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Statut professionnel */}
                    <div className="senior-form-row">
                      <Label className="senior-form-label">
                        {isFrench ? 'Statut professionnel' : 'Professional Status'}
                      </Label>
                      <Select
                        value={userData.personal?.statutProfessionnel1 || 'actif'}
                        onValueChange={(value) => handleProfileChange('statutProfessionnel1', value)}
                      >
                        <SelectTrigger className="senior-form-input">
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
                    <div className="senior-form-row">
                      <Label className="senior-form-label">
                        {isFrench ? 'Nom complet (optionnel)' : 'Full Name (optional)'}
                      </Label>
                      <Input
                        type="text"
                        value={userData.personal?.prenom2 || ''}
                        onChange={(e) => handleNameChange('prenom2', e.target.value)}
                        className="senior-form-input"
                        placeholder={isFrench ? 'Ex: Marie…' : 'Ex: Mary…'}
                      />
                    </div>

                    {/* Date de naissance */}
                    <div className="senior-form-row">
                      <Label className="senior-form-label">
                        {isFrench ? 'Date de naissance' : 'Date of Birth'}
                      </Label>
                      <CustomBirthDateInput
                        id="naissance2"
                        label=""
                        value={userData.personal?.naissance2 || ''}
                        onChange={(date) => handleProfileChange('naissance2', date)}
                        className="senior-form-input"
                      />
                    </div>

                    {/* Sexe */}
                    <div className="senior-form-row">
                      <Label className="senior-form-label">
                        {isFrench ? 'Sexe' : 'Gender'}
                      </Label>
                      <Select
                        value={userData.personal?.sexe2 || 'femme'}
                        onValueChange={(value) => handleProfileChange('sexe2', value)}
                      >
                        <SelectTrigger className="senior-form-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-gray-300">
                          <SelectItem value="homme" className="text-lg py-3">{isFrench ? 'Homme' : 'Male'}</SelectItem>
                          <SelectItem value="femme" className="text-lg py-3">{isFrench ? 'Femme' : 'Female'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Statut professionnel */}
                    <div className="senior-form-row">
                      <Label className="senior-form-label">
                        {isFrench ? 'Statut professionnel' : 'Professional Status'}
                      </Label>
                      <Select
                        value={userData.personal?.statutProfessionnel2 || 'actif'}
                        onValueChange={(value) => handleProfileChange('statutProfessionnel2', value)}
                      >
                        <SelectTrigger className="senior-form-input">
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

          {/* 1. INFORMATIONS DE BASE - Personne 1 et Personne 2 */}
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isFrench ? '👤 Informations de Base' : '👤 Basic Information'}
              </h2>
              <p className="text-lg text-gray-600">
                {isFrench
                  ? 'Informations personnelles essentielles pour vos calculs de retraite'
                  : 'Essential personal information for your retirement calculations'}
              </p>
            </div>
            
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
                      value={userData.personal?.province1 || userData.personal?.province || ''}
                      onValueChange={(value) => updateUserData('personal', { province1: value, province: value })}
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

            {/* 2. PENSIONS/PRESTATIONS */}
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {isFrench ? '🏛️ Pensions/Prestations' : '🏛️ Pensions/Benefits'}
                </h3>
                <p className="text-lg text-gray-600">
                  {isFrench
                    ? 'Vos pensions publiques et prestations gouvernementales'
                    : 'Your public pensions and government benefits'}
                </p>
              </div>

              {/* Sécurité de la vieillesse */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personne 1 - Sécurité de la vieillesse */}
                <Card className="bg-white border-2 border-emerald-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-emerald-800">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <Shield className="w-6 h-6" />
                      {isFrench ? 'Sécurité de la vieillesse' : 'Old Age Security'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="senior-summary-row" style={{ background: '#ecfdf5' }}>
                        <div className="senior-summary-label">
                          {isFrench ? 'Période 1 (Jan-Juin)' : 'Period 1 (Jan-June)'}
                        </div>
                        <div className="senior-summary-value text-emerald-600">
                          {formatCurrencyQuebec(userData.retirement?.svBiannual1?.periode1?.montant || 0)}
                          <span className="senior-summary-unit">
                            {isFrench ? 'par mois' : 'per month'}
                          </span>
                        </div>
                      </div>
                      <div className="senior-summary-row" style={{ background: '#fff7ed' }}>
                        <div className="senior-summary-label">
                          {isFrench ? 'Période 2 (Juil-Déc)' : 'Period 2 (Jul-Dec)'}
                        </div>
                        <div className="senior-summary-value text-orange-600">
                          {formatCurrencyQuebec(userData.retirement?.svBiannual1?.periode2?.montant || 0)}
                          <span className="senior-summary-unit">
                            {isFrench ? 'par mois' : 'per month'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button 
                        variant="link" 
                        className="text-emerald-600 hover:text-emerald-800"
                        onClick={() => navigate('/revenus')}
                      >
                        {isFrench ? 'Modifier sur la page Revenus' : 'Edit on the Income page'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Personne 2 - Sécurité de la vieillesse */}
                <Card className="bg-white border-2 border-emerald-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-emerald-800">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <Shield className="w-6 h-6" />
                      {isFrench ? 'Sécurité de la vieillesse' : 'Old Age Security'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="senior-summary-row" style={{ background: '#ecfdf5' }}>
                        <div className="senior-summary-label">
                          {isFrench ? 'Période 1 (Jan-Juin)' : 'Period 1 (Jan-June)'}
                        </div>
                        <div className="senior-summary-value text-emerald-600">
                          {formatCurrencyQuebec(userData.retirement?.svBiannual2?.periode1?.montant || 0)}
                          <span className="senior-summary-unit">
                            {isFrench ? 'par mois' : 'per month'}
                          </span>
                        </div>
                      </div>
                      <div className="senior-summary-row" style={{ background: '#fff7ed' }}>
                        <div className="senior-summary-label">
                          {isFrench ? 'Période 2 (Juil-Déc)' : 'Period 2 (Jul-Dec)'}
                        </div>
                        <div className="senior-summary-value text-orange-600">
                          {formatCurrencyQuebec(userData.retirement?.svBiannual2?.periode2?.montant || 0)}
                          <span className="senior-summary-unit">
                            {isFrench ? 'par mois' : 'per month'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button 
                        variant="link" 
                        className="text-emerald-600 hover:text-emerald-800"
                        onClick={() => navigate('/revenus')}
                      >
                        {isFrench ? 'Modifier sur la page Revenus' : 'Edit on the Income page'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* RRQ et CPP */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personne 1 - RRQ/CPP */}
                <Card className="bg-white border-2 border-blue-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-blue-800">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <Flag className="w-6 h-6" />
                      {isFrench ? 'RRQ/CPP' : 'QPP/CPP'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="senior-summary-row" style={{ background: '#eff6ff' }}>
                        <div className="senior-summary-label">
                          {isFrench ? 'Prestation actuelle' : 'Current benefit'}
                        </div>
                        <div className="senior-summary-value text-blue-600">
                          {formatCurrencyQuebec(userData.retirement?.rrqMontantActuel1 || 0)}
                          <span className="senior-summary-unit">
                            {isFrench ? 'par mois' : 'per month'}
                          </span>
                        </div>
                      </div>
                      <div className="senior-summary-row" style={{ background: '#faf5ff' }}>
                        <div className="senior-summary-label">
                          {isFrench ? 'Prestation à 70 ans' : 'Benefit at 70 years'}
                        </div>
                        <div className="senior-summary-value text-purple-600">
                          {formatCurrencyQuebec(userData.retirement?.rrqMontant70_1 || 0)}
                          <span className="senior-summary-unit">
                            {isFrench ? 'par mois' : 'per month'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button 
                        variant="link" 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => navigate('/rrq-cpp-analysis')}
                      >
                        {isFrench ? 'Compléter dans RRQ/CPP' : 'Complete in QPP/CPP'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Personne 2 - RRQ/CPP */}
                <Card className="bg-white border-2 border-blue-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-blue-800">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <Flag className="w-6 h-6" />
                      {isFrench ? 'RRQ/CPP' : 'QPP/CPP'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="senior-summary-row" style={{ background: '#eff6ff' }}>
                        <div className="senior-summary-label">
                          {isFrench ? 'Prestation actuelle' : 'Current benefit'}
                        </div>
                        <div className="senior-summary-value text-blue-600">
                          {formatCurrencyQuebec(userData.retirement?.rrqMontantActuel2 || 0)}
                          <span className="senior-summary-unit">
                            {isFrench ? 'par mois' : 'per month'}
                          </span>
                        </div>
                      </div>
                      <div className="senior-summary-row" style={{ background: '#faf5ff' }}>
                        <div className="senior-summary-label">
                          {isFrench ? 'Prestation à 70 ans' : 'Benefit at 70 years'}
                        </div>
                        <div className="senior-summary-value text-purple-600">
                          {formatCurrencyQuebec(userData.retirement?.rrqMontant70_2 || 0)}
                          <span className="senior-summary-unit">
                            {isFrench ? 'par mois' : 'per month'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button 
                        variant="link" 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => navigate('/rrq-cpp-analysis')}
                      >
                        {isFrench ? 'Compléter dans RRQ/CPP' : 'Complete in QPP/CPP'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 3. TABLEAUX DE BORD */}
            <div className="space-y-8">
              {/* Revenus et actifs - 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personne 1 - Revenus et actifs */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <Building className="w-6 h-6" />
                      {isFrench ? 'Mes revenus et actifs' : 'My income and assets'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Salaires (annuel)' : 'Salaries (annual)'}
                        </div>
                        <div className="senior-summary-value text-blue-600">
                          {formatCurrencyQuebec(person1Income.totalSalary)}
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Pensions (annuel)' : 'Pensions (annual)'}
                        </div>
                        <div className="senior-summary-value text-green-600">
                          {formatCurrencyQuebec(person1Income.totalPensions)}
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Autres revenus (annuel)' : 'Other income (annual)'}
                        </div>
                        <div className="senior-summary-value text-purple-600">
                          {formatCurrencyQuebec(person1Income.totalOtherIncome)}
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Épargne REER' : 'RRSP savings'}
                        </div>
                        <div className="senior-summary-value text-orange-600">
                          {formatCurrencyQuebec(person1Savings.reer)}
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Épargne CELI' : 'TFSA savings'}
                        </div>
                        <div className="senior-summary-value text-cyan-600">
                          {formatCurrencyQuebec(person1Savings.celi)}
                        </div>
                      </div>
                    </div>
                                        <div className="text-right">
                      <Button 
                        variant="link" 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => navigate('/revenus')}
                      >
                        {isFrench ? 'Modifier sur la page Revenus' : 'Edit on the Income page'}
                      </Button>
                    </div>
                </CardContent>
              </Card>

                {/* Personne 2 - Revenus et actifs */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <Building className="w-6 h-6" />
                      {isFrench ? 'Mes revenus et actifs' : 'My income and assets'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Salaires (annuel)' : 'Salaries (annual)'}
                        </div>
                        <div className="senior-summary-value text-blue-600">
                          {formatCurrencyQuebec(person2Income.totalSalary)}
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Pensions (annuel)' : 'Pensions (annual)'}
                        </div>
                        <div className="senior-summary-value text-green-600">
                          {formatCurrencyQuebec(person2Income.totalPensions)}
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Autres revenus (annuel)' : 'Other income (annual)'}
                        </div>
                        <div className="senior-summary-value text-purple-600">
                          {formatCurrencyQuebec(person2Income.totalOtherIncome)}
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Épargne REER' : 'RRSP savings'}
                        </div>
                        <div className="senior-summary-value text-orange-600">
                          {formatCurrencyQuebec(person2Savings.reer)}
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Épargne CELI' : 'TFSA savings'}
                        </div>
                        <div className="senior-summary-value text-cyan-600">
                          {formatCurrencyQuebec(person2Savings.celi)}
                        </div>
                      </div>
                    </div>
                                        <div className="text-right">
                      <Button 
                        variant="link" 
                        className="text-green-600 hover:text-green-800"
                        onClick={() => navigate('/revenus')}
                      >
                        {isFrench ? 'Modifier sur la page Revenus' : 'Edit on the Income page'}
                      </Button>
                    </div>
                </CardContent>
              </Card>
            </div>

              {/* Dépenses et budget - 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personne 1 - Dépenses et budget */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <CreditCard className="w-6 h-6" />
                      {isFrench ? 'Mes dépenses et budget' : 'My expenses and budget'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Dépenses mensuelles' : 'Monthly expenses'}
                        </div>
                        <div className="senior-summary-value text-green-600">
                          {formatCurrencyQuebec(userData.personal?.depensesMensuelles || 0)}
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Revenus mensuels estimés' : 'Estimated monthly income'}
                        </div>
                        <div className="senior-summary-value text-blue-600">
                          {formatCurrencyQuebec(person1Income.totalIncome / 12)}
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Flux de trésorerie (mois)' : 'Cash flow (month)'}
                        </div>
                        <div className="senior-summary-value text-green-600">
                          {formatCurrencyQuebec((person1Income.totalIncome / 12) - (userData.personal?.depensesMensuelles || 0))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button variant="link" className="text-blue-600 hover:text-blue-800">
                        {isFrench ? 'Modifier sur la page Dépenses' : 'Edit on the Expenses page'}
                      </Button>
                  </div>
                </CardContent>
              </Card>

                {/* Personne 2 - Dépenses et budget */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <CreditCard className="w-6 h-6" />
                      {isFrench ? 'Mes dépenses et budget' : 'My expenses and budget'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Dépenses mensuelles' : 'Monthly expenses'}
                        </div>
                        <div className="senior-summary-value text-green-600">
                          {formatCurrencyQuebec((userData.personal?.epicerie1 || 0) + (userData.personal?.epicerie2 || 0))}
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Revenus mensuels estimés' : 'Estimated monthly income'}
                        </div>
                        <div className="senior-summary-value text-blue-600">
                          {formatCurrencyQuebec(person2Income.totalIncome / 12)}
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Flux de trésorerie (mois)' : 'Cash flow (month)'}
                        </div>
                        <div className="senior-summary-value text-green-600">
                          {formatCurrencyQuebec((person2Income.totalIncome / 12) - ((userData.personal?.epicerie1 || 0) + (userData.personal?.epicerie2 || 0)))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button variant="link" className="text-green-600 hover:text-green-800">
                        {isFrench ? 'Modifier sur la page Dépenses' : 'Edit on the Expenses page'}
                      </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calculs de retraite - 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personne 1 - Calculs de retraite */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <BarChart3 className="w-6 h-6" />
                      {isFrench ? 'Mes calculs de retraite' : 'My retirement calculations'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Âge de retraite souhaité' : 'Desired retirement age'}
                        </div>
                        <div className="senior-summary-value text-purple-600">
                          {userData.personal?.ageRetraiteSouhaite1 || 65}
                          <span className="senior-summary-unit">
                            {isFrench ? 'ans' : 'years'}
                          </span>
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Années avant la retraite (approx.)' : 'Years until retirement (approx.)'}
                        </div>
                        <div className="senior-summary-value text-blue-600">
                          {Math.max(0, (userData.personal?.ageRetraiteSouhaite1 || 65) - computeAgeFromBirthdate(userData.personal?.naissance1))}
                          <span className="senior-summary-unit">
                            {isFrench ? 'ans' : 'years'}
                          </span>
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Espérance de vie (CPM2014)' : 'Life expectancy (CPM2014)'}
                        </div>
                        <div className="senior-summary-value text-green-600">
                          {calculateMortalityForPerson(1).lifeExpectancy}
                          <span className="senior-summary-unit">
                            {isFrench ? 'ans' : 'years'}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {isFrench ? 'Âge recommandé:' : 'Recommended age:'} {calculateMortalityForPerson(1).finalAge}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button variant="link" className="text-blue-600 hover:text-blue-800">
                        {isFrench ? 'Voir les rapports' : 'View reports'}
                      </Button>
                  </div>
                </CardContent>
              </Card>

                {/* Personne 2 - Calculs de retraite */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <BarChart3 className="w-6 h-6" />
                      {isFrench ? 'Mes calculs de retraite' : 'My retirement calculations'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Âge de retraite souhaité' : 'Desired retirement age'}
                        </div>
                        <div className="senior-summary-value text-purple-600">
                          {userData.personal?.ageRetraiteSouhaite2 || 65}
                          <span className="senior-summary-unit">
                            {isFrench ? 'ans' : 'years'}
                          </span>
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Années avant la retraite (approx.)' : 'Years until retirement (approx.)'}
                        </div>
                        <div className="senior-summary-value text-blue-600">
                          {Math.max(0, (userData.personal?.ageRetraiteSouhaite2 || 65) - computeAgeFromBirthdate(userData.personal?.naissance2))}
                          <span className="senior-summary-unit">
                            {isFrench ? 'ans' : 'years'}
                          </span>
                        </div>
                      </div>
                      <div className="senior-summary-row">
                        <div className="senior-summary-label">
                          {isFrench ? 'Espérance de vie (CPM2014)' : 'Life expectancy (CPM2014)'}
                        </div>
                        <div className="senior-summary-value text-green-600">
                          {calculateMortalityForPerson(2).lifeExpectancy}
                          <span className="senior-summary-unit">
                            {isFrench ? 'ans' : 'years'}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {isFrench ? 'Âge recommandé:' : 'Recommended age:'} {calculateMortalityForPerson(2).finalAge}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button variant="link" className="text-green-600 hover:text-green-800">
                        {isFrench ? 'Voir les rapports' : 'View reports'}
                      </Button>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>

            {/* 3. MODE D'ANALYSE DE LONGÉVITÉ */}
            <LongevityModeSelector
              mode={longevityMode}
              onModeChange={setLongevityMode}
              isFrench={isFrench}
            />

            {/* 4. INFORMATIONS POUR LE MODE STANDARD IPF2025 */}
            {longevityMode === 'standard' && (
              <div className="space-y-8">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {isFrench ? '📋 Informations Standard IPF2025' : '📋 Standard IPF2025 Information'}
                  </h3>
                  <p className="text-lg text-gray-600">
                    {isFrench
                      ? 'Informations de base pour les calculs de longévité standard'
                      : 'Basic information for standard longevity calculations'}
                  </p>
                </div>
                
                {/* Analyse de longévité personnalisée */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MortalityDisplayCPM2014
                age={computeAgeFromBirthdate(userData.personal?.naissance1)}
                gender={getGenderForMortality(userData.personal?.sexe1 as any) || 'male'}
                    showDetails={true}
                  />
                  <MortalityDisplayCPM2014
                    age={computeAgeFromBirthdate(userData.personal?.naissance2)}
                    gender={getGenderForMortality(userData.personal?.sexe2 as any) || 'male'}
                    showDetails={true}
                  />
              </div>
              </div>
            )}

            {/* 5. FACTEURS DE SANTÉ */}
            {longevityMode === 'personalized' && (
              <div className="space-y-8">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    {isFrench ? '🏥 Facteurs de Santé' : '🏥 Health Factors'}
                  </h3>
                  <p className="text-lg text-gray-600">
                        {isFrench
                      ? 'Vos facteurs de santé influencent votre espérance de vie'
                      : 'Your health factors influence your life expectancy'}
                  </p>
                </div>

                {/* Health Factors Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <HealthFactorsSection
                    userData={userData}
                    updateUserData={updateUserData}
                    isFrench={isFrench}
                    personNumber={1}
                  />
                  <HealthFactorsSection
                    userData={userData}
                    updateUserData={updateUserData}
                    isFrench={isFrench}
                    personNumber={2}
                  />
                  </div>
            </div>
            )}

            {/* 6. FACTEURS PERSONNALISÉS (Socio-économiques) */}
            {longevityMode === 'personalized' && (
              <div className="space-y-8">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    {isFrench ? '📊 Facteurs Personnalisés' : '📊 Personalized Factors'}
                  </h3>
                  <p className="text-lg text-gray-600">
                        {isFrench
                      ? 'Ces facteurs influencent vos calculs de retraite personnalisés'
                      : 'These factors influence your personalized retirement calculations'}
                  </p>
                </div>

                {/* Revenus Synchronisés */}
                <div className="mb-8">
                  <SynchronizedIncomeDisplay
                    userData={userData}
                    isFrench={isFrench}
                    showDetails={true}
                    className="max-w-4xl mx-auto"
                  />
                </div>

                {/* Socio-Economic Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <SocioEconomicSection
                    userData={userData}
                    updateUserData={updateUserData}
                    isFrench={isFrench}
                    personNumber={1}
                  />
                  <SocioEconomicSection
                    userData={userData}
                    updateUserData={updateUserData}
                    isFrench={isFrench}
                    personNumber={2}
                  />
                </div>
              </div>
            )}





            {/* 7. SOMMAIRE POUR MODE ANALYSE PERSONNALISÉE */}
            {longevityMode === 'personalized' && (
              <div className="space-y-8">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {isFrench ? '📊 Analyse Personnalisée Complète' : '📊 Complete Personalized Analysis'}
                  </h3>
                  <p className="text-lg text-gray-600">
                    {isFrench
                      ? 'Synthèse de vos facteurs de santé et socio-économiques pour une analyse personnalisée'
                      : 'Summary of your health and socio-economic factors for personalized analysis'}
                  </p>
                </div>

                {/* Validation des champs requis */}
                <div className="mb-6">
                  <ValidationAlert
                    userData={userData}
                    isFrench={isFrench}
                    onValidationComplete={(isValid) => {
                      // Callback pour gérer la validation
                      console.log('Validation status:', isValid);
                    }}
                  />
                </div>
                
                {/* Sommaire personnalisé avec santé et socio-économique */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personne 1 - Analyse personnalisée */}
                  <Card className="bg-white border-2 border-blue-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-blue-800">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <User className="w-6 h-6" />
                        {isFrench ? 'Analyse Personnalisée' : 'Personalized Analysis'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Facteurs de santé */}
                      <div className="p-4 rounded-lg border bg-green-50">
                        <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          {isFrench ? 'Facteurs de Santé' : 'Health Factors'}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'État de santé:' : 'Health status:'}</span>
                            <span className="font-medium">{(userData.personal as any)?.etatSante1 || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Mode de vie actif:' : 'Active lifestyle:'}</span>
                            <span className="font-medium">{(userData.personal as any)?.modeVieActif1 || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Statut tabagique:' : 'Smoking status:'}</span>
                            <span className="font-medium">{(userData.personal as any)?.statutTabagique1 || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Facteurs socio-économiques */}
                      <div className="p-4 rounded-lg border bg-blue-50">
                        <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          {isFrench ? 'Facteurs Socio-Économiques' : 'Socio-Economic Factors'}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Situation familiale:' : 'Family situation:'}</span>
                            <span className="font-medium">{userData.personal?.situationFamiliale || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Niveau d\'éducation:' : 'Education level:'}</span>
                            <span className="font-medium">{userData.personal?.niveauCompetences1 || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Secteur d\'activité:' : 'Activity sector:'}</span>
                            <span className="font-medium">{userData.personal?.secteurActivite1 || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Expérience financière:' : 'Financial experience:'}</span>
                            <span className="font-medium">{userData.personal?.experienceFinanciere1 || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Tolérance au risque:' : 'Risk tolerance:'}</span>
                            <span className="font-medium">{userData.personal?.toleranceRisqueInvestissement1 || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Revenus annuels totaux:' : 'Total annual income:'}</span>
                            <span className="font-medium text-green-700">
                              ${((userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Analyse de longévité personnalisée */}
                      <PersonalizedLongevityAnalysis
                        userData={userData}
                        isFrench={isFrench}
                        personNumber={1}
                      />
                    </CardContent>
                  </Card>

                  {/* Personne 2 - Analyse personnalisée */}
                  <Card className="bg-white border-2 border-green-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-green-800">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <User className="w-6 h-6" />
                        {isFrench ? 'Analyse Personnalisée' : 'Personalized Analysis'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Facteurs de santé */}
                      <div className="p-4 rounded-lg border bg-green-50">
                        <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          {isFrench ? 'Facteurs de Santé' : 'Health Factors'}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'État de santé:' : 'Health status:'}</span>
                            <span className="font-medium">{(userData.personal as any)?.etatSante2 || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Mode de vie actif:' : 'Active lifestyle:'}</span>
                            <span className="font-medium">{(userData.personal as any)?.modeVieActif2 || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Statut tabagique:' : 'Smoking status:'}</span>
                            <span className="font-medium">{(userData.personal as any)?.statutTabagique2 || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Facteurs socio-économiques */}
                      <div className="p-4 rounded-lg border bg-blue-50">
                        <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          {isFrench ? 'Facteurs Socio-Économiques' : 'Socio-Economic Factors'}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Situation familiale:' : 'Family situation:'}</span>
                            <span className="font-medium">{userData.personal?.situationFamiliale || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Niveau d\'éducation:' : 'Education level:'}</span>
                            <span className="font-medium">{userData.personal?.niveauCompetences2 || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Secteur d\'activité:' : 'Activity sector:'}</span>
                            <span className="font-medium">{userData.personal?.secteurActivite2 || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Expérience financière:' : 'Financial experience:'}</span>
                            <span className="font-medium">{userData.personal?.experienceFinanciere2 || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Tolérance au risque:' : 'Risk tolerance:'}</span>
                            <span className="font-medium">{userData.personal?.toleranceRisqueInvestissement2 || (isFrench ? 'Non spécifié' : 'Not specified')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isFrench ? 'Revenus annuels totaux:' : 'Total annual income:'}</span>
                            <span className="font-medium text-green-700">
                              ${((userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Analyse de longévité personnalisée */}
                      <PersonalizedLongevityAnalysis
                        userData={userData}
                        isFrench={isFrench}
                        personNumber={2}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

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
