import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { calculateIncomeFromPeriods } from '@/utils/incomeCalculationUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Star,
  Info,
  Shield,
  Save,
  User,
  Building2,
  CreditCard,
  BarChart3,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Briefcase,
  Landmark,
  PiggyBank,
  Heart,
  Users,
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

// CSS pour seniors 55-90 ans - Layout condensé et lisible
const seniorOptimizedStyles = `
.senior-layout {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 18px;
  line-height: 1.6;
  color: #1a365d;
}

.senior-compact-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  max-height: 400px;
  overflow-y: auto;
}

.senior-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.senior-form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.senior-form-label {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.senior-form-input {
  font-size: 16px;
  min-height: 44px;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  transition: border-color 0.2s;
}

.senior-form-input:focus {
  outline: none;
  border-color: #4c6ef5;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
}

.senior-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #e2e8f0;
}

.senior-summary-label {
  font-size: 16px;
  font-weight: 500;
  color: #4a5568;
}

.senior-summary-value {
  font-size: 18px;
  font-weight: 700;
  text-align: right;
}

.senior-financial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.senior-analysis-results {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
}

.senior-couple-analysis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.senior-metric-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.senior-metric-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.senior-metric-label {
  font-size: 14px;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .senior-form-grid {
    grid-template-columns: 1fr;
  }
  .senior-financial-grid {
    grid-template-columns: 1fr;
  }
}
`;

const MaRetraite: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';
  const { userData, updateUserData } = useRetirementData();

  // États locaux
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const [longevityMode, setLongevityMode] = useState<'standard' | 'personalized'>('standard');
  const [isSaving, setIsSaving] = useState(false);
  const [licenseBlocked, setLicenseBlocked] = useState(false);
  const [licenseMessage, setLicenseMessage] = useState('');

  // Injection des styles CSS seniors
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = seniorOptimizedStyles;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Fonction de formatage monétaire québécoise
  const formatCurrencyQuebec = (amount: number): string => {
    if (amount === 0) return '0 $';
    return new Intl.NumberFormat('fr-CA', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.round(amount)) + ' $';
  };

  // Chargement des données depuis localStorage
  useEffect(() => {
    const loadImportedData = () => {
      try {
        const importedData = localStorage.getItem('retirement_data');
        if (importedData) {
          const parsedData = JSON.parse(importedData);
          if (parsedData.personal) updateUserData('personal', parsedData.personal);
          if (parsedData.retirement) updateUserData('retirement', parsedData.retirement);
          if (parsedData.savings) updateUserData('savings', parsedData.savings);
          if (parsedData.cashflow) updateUserData('cashflow', parsedData.cashflow);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    loadImportedData();

    const handleDataImported = (event: CustomEvent) => {
      try {
        const importedData = event.detail.data;
        if (importedData.personal) updateUserData('personal', importedData.personal);
        if (importedData.retirement) updateUserData('retirement', importedData.retirement);
        if (importedData.savings) updateUserData('savings', importedData.savings);
        if (importedData.cashflow) updateUserData('cashflow', importedData.cashflow);
      } catch (error) {
        console.error('Erreur lors du traitement des données importées:', error);
      }
    };

    window.addEventListener('retirementDataImported', handleDataImported as EventListener);
    return () => {
      window.removeEventListener('retirementDataImported', handleDataImported as EventListener);
    };
  }, [updateUserData]);

  // Gestionnaire de changements de profil avec validation de licence
  const handleProfileChange = (field: string, value: any) => {
    setLicenseBlocked(false);
    setLicenseMessage('');
    updateUserData('personal', { [field]: value });
  };

  const handleNameChange = (field: string, value: string) => {
    updateUserData('personal', { [field]: value });
  };

  // Calculs financiers harmonisés avec le résumé familial
  const calculateFamilyFinancials = () => {
    // Revenus de travail (Person 1 + Person 2)
    const salaire1 = userData.personal?.salaire1 || 0;
    const salaire2 = userData.personal?.salaire2 || 0;
    const travailAutonome1 = userData.personal?.travailAutonome1 || 0;
    const travailAutonome2 = userData.personal?.travailAutonome2 || 0;
    const autresRevenus1 = userData.personal?.autresRevenus1 || 0;
    const autresRevenus2 = userData.personal?.autresRevenus2 || 0;

    const totalRevenusTravail = salaire1 + salaire2 + travailAutonome1 + travailAutonome2 + autresRevenus1 + autresRevenus2;

    // Prestations (RRQ, SV, AE, etc.)
    const rrq1 = userData.retirement?.rrqMontantActuel1 || 0;
    const rrq2 = userData.retirement?.rrqMontantActuel2 || 0;
    const sv1 = (userData.retirement?.svBiannual1?.periode1?.montant || 0) * 12 + 
                (userData.retirement?.svBiannual1?.periode2?.montant || 0) * 12;
    const sv2 = (userData.retirement?.svBiannual2?.periode1?.montant || 0) * 12 + 
                (userData.retirement?.svBiannual2?.periode2?.montant || 0) * 12;
    const ae1 = userData.retirement?.assuranceEmploi1 || 0;
    const ae2 = userData.retirement?.assuranceEmploi2 || 0;

    const totalPrestations = (rrq1 + rrq2 + sv1 + sv2) * 12 + ae1 + ae2;

    // Investissements (REER, CELI, CRI, etc.)
    const reer1 = userData.personal?.soldeREER1 || userData.savings?.reer1 || 0;
    const reer2 = userData.personal?.soldeREER2 || userData.savings?.reer2 || 0;
    const celi1 = userData.personal?.soldeCELI1 || userData.savings?.celi1 || 0;
    const celi2 = userData.personal?.soldeCELI2 || userData.savings?.celi2 || 0;
    const cri1 = userData.personal?.soldeCRI1 || userData.savings?.cri1 || 0;
    const cri2 = userData.personal?.soldeCRI2 || userData.savings?.cri2 || 0;
    const placements1 = userData.savings?.placements1 || 0;
    const placements2 = userData.savings?.placements2 || 0;

    const totalInvestissements = reer1 + reer2 + celi1 + celi2 + cri1 + cri2 + placements1 + placements2;

    return {
      revenusTravail: {
        total: totalRevenusTravail,
        person1: salaire1 + travailAutonome1 + autresRevenus1,
        person2: salaire2 + travailAutonome2 + autresRevenus2,
        details: {
          salaires: salaire1 + salaire2,
          travailAutonome: travailAutonome1 + travailAutonome2,
          autresRevenus: autresRevenus1 + autresRevenus2
        }
      },
      prestations: {
        total: totalPrestations,
        person1: (rrq1 + sv1) * 12 + ae1,
        person2: (rrq2 + sv2) * 12 + ae2,
        details: {
          rrqCpp: (rrq1 + rrq2) * 12,
          securiteVieillesse: (sv1 + sv2) * 12,
          assuranceEmploi: ae1 + ae2
        }
      },
      investissements: {
        total: totalInvestissements,
        person1: reer1 + celi1 + cri1 + placements1,
        person2: reer2 + celi2 + cri2 + placements2,
        details: {
          reer: reer1 + reer2,
          celi: celi1 + celi2,
          cri: cri1 + cri2,
          autres: placements1 + placements2
        }
      },
      grandTotal: totalRevenusTravail + totalPrestations
    };
  };

  const familyFinancials = useMemo(() => calculateFamilyFinancials(), [
    userData.personal,
    userData.retirement,
    userData.savings
  ]);

  // Calculs d'âge et de mortalité corrigés
  const computeAgeFromBirthdate = (birthDate?: string): number => {
    if (!birthDate) return 65;
    
    let birth: Date;
    if (/^\d{8}$/.test(birthDate)) {
      const year = parseInt(birthDate.substring(0, 4));
      const month = parseInt(birthDate.substring(4, 6)) - 1;
      const day = parseInt(birthDate.substring(6, 8));
      birth = new Date(year, month, day);
    } else {
      birth = new Date(birthDate);
    }
    
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
    return (val === 'f' || val === 'femme' || val === 'female') ? 'female' : 'male';
  };

  // Calculs de mortalité pour chaque personne
  const calculateMortalityForPerson = (personNumber: 1 | 2) => {
    const birthField = personNumber === 1 ? 'naissance1' : 'naissance2';
    const genderField = personNumber === 1 ? 'sexe1' : 'sexe2';
    const healthField = personNumber === 1 ? 'etatSante1' : 'etatSante2';
    const lifestyleField = personNumber === 1 ? 'modeVieActif1' : 'modeVieActif2';

    const age = computeAgeFromBirthdate(userData.personal?.[birthField]);
    const gender = getGenderForMortality(userData.personal?.[genderField]);
    
    const base = MORTALITY_CPM2014.calculateLifeExpectancy({ age, gender });

    // Ajustements basés sur les facteurs de santé
    let adjustment = 0;
    const healthStatus = userData.personal?.[healthField];
    const lifestyle = userData.personal?.[lifestyleField];

    // Ajustements santé
    if (healthStatus === 'excellent') adjustment += 2;
    else if (healthStatus === 'tresbon') adjustment += 1;
    else if (healthStatus === 'bon') adjustment += 0.5;
    else if (healthStatus === 'moyen') adjustment += 0;
    else if (healthStatus === 'fragile') adjustment -= 1.5;
    else adjustment += 0.5; // Défaut

    // Ajustements style de vie
    if (lifestyle === 'sedentaire') adjustment -= 0.5;
    else if (lifestyle === 'legerementActif') adjustment += 0;
    else if (lifestyle === 'modere') adjustment += 0.5;
    else if (lifestyle === 'actif') adjustment += 0.8;
    else if (lifestyle === 'tresActif') adjustment += 1;
    else adjustment += 0.5; // Défaut

    // Limites d'ajustement
    adjustment = Math.max(-2, Math.min(2, adjustment));

    const lifeExpectancy = Math.max(0, Number((base.lifeExpectancy + adjustment).toFixed(1)));
    const finalAge = Math.round(age + lifeExpectancy);
    const planningAge = Math.min(100, Math.round(base.recommendedPlanningAge + adjustment));

    return {
      currentAge: age,
      lifeExpectancy,
      finalAge,
      planningAge,
      adjustment,
      source: base.source + (adjustment !== 0 ? ' + ajustements personnels' : ''),
    };
  };

  const person1Mortality = useMemo(() => calculateMortalityForPerson(1), [
    userData.personal?.naissance1,
    userData.personal?.sexe1,
    userData.personal?.etatSante1,
    userData.personal?.modeVieActif1,
  ]);

  const person2Mortality = useMemo(() => calculateMortalityForPerson(2), [
    userData.personal?.naissance2,
    userData.personal?.sexe2,
    userData.personal?.etatSante2,
    userData.personal?.modeVieActif2,
  ]);

  // Calcul d'analyse comparative du couple CORRIGÉ
  const calculateCoupleAnalysis = () => {
    if (!userData.personal?.naissance1 || !userData.personal?.naissance2) {
      return null;
    }

    const finalAge1 = person1Mortality.finalAge;
    const finalAge2 = person2Mortality.finalAge;
    
    return {
      ecartAge: Math.abs(finalAge1 - finalAge2),
      // CORRECTION CRITIQUE: Prendre le maximum, pas la somme
      dernierSurvivant: Math.max(finalAge1, finalAge2),
      planificationJusqua: Math.max(finalAge1, finalAge2) + 5,
      premierDeces: Math.min(finalAge1, finalAge2),
      anneesVeuvage: Math.abs(finalAge1 - finalAge2)
    };
  };

  const coupleAnalysis = useMemo(() => calculateCoupleAnalysis(), [
    person1Mortality.finalAge,
    person2Mortality.finalAge
  ]);

  // Validation des champs requis
  const validatePersonData = (personNumber: 1 | 2) => {
    const prefix = personNumber === 1 ? '1' : '2';
    const required = [`naissance${prefix}`, `sexe${prefix}`];
    return required.every(field => userData.personal?.[field]);
  };

  const person1Valid = validatePersonData(1);
  const person2Valid = validatePersonData(2);
  const hasPerson2Data = userData.personal?.prenom2 || userData.personal?.naissance2;

  // Gestionnaires d'événements
  const handleOnboardingComplete = (data: any) => {
    setShowOnboardingWizard(false);
    if (data?.personal) {
      updateUserData('personal', data.personal);
    }
  };

  const handleOnboardingSkip = () => setShowOnboardingWizard(false);

  const reloadData = () => {
    try {
      const importedData = localStorage.getItem('retirement_data');
      if (importedData) {
        const parsedData = JSON.parse(importedData);
        if (parsedData.personal) updateUserData('personal', parsedData.personal);
        if (parsedData.retirement) updateUserData('retirement', parsedData.retirement);
        if (parsedData.savings) updateUserData('savings', parsedData.savings);
        if (parsedData.cashflow) updateUserData('cashflow', parsedData.cashflow);
        alert('Données rechargées avec succès !');
      } else {
        alert('Aucune donnée trouvée dans le stockage local.');
      }
    } catch (error) {
      console.error('Erreur lors du rechargement:', error);
      alert('Erreur lors du rechargement des données.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 senior-layout">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        
        {/* En-tête principal */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <User className="w-10 h-10 text-blue-600" />
            {isFrench ? 'Mon Profil de Retraite' : 'My Retirement Profile'}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {isFrench
              ? 'Planification financière personnalisée pour votre retraite'
              : 'Personalized financial planning for your retirement'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowOnboardingWizard(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6"
            >
              {isFrench ? 'Assistant de planification automatisé' : 'Automated Planning Assistant'}
            </Button>
            <Button
              onClick={reloadData}
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50 font-semibold py-3 px-6"
            >
              {isFrench ? 'Recharger les données' : 'Reload Data'}
            </Button>
          </div>
        </div>

        {/* Validation des données requises */}
        {(!person1Valid || (hasPerson2Data && !person2Valid)) && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="text-base">
              <strong>{isFrench ? 'Champs requis manquants' : 'Required fields missing'}</strong>
              <br />
              {isFrench ? 'Veuillez compléter les champs suivants pour obtenir une analyse de longévité :' : 'Please complete the following fields to get longevity analysis:'}
              <ul className="mt-2 list-disc list-inside">
                {!person1Valid && (
                  <li>
                    {isFrench ? 'Personne 1: ' : 'Person 1: '}
                    {!userData.personal?.naissance1 && (isFrench ? 'Date de naissance ' : 'Birth date ')}
                    {!userData.personal?.sexe1 && (isFrench ? 'Sexe ' : 'Gender ')}
                  </li>
                )}
                {hasPerson2Data && !person2Valid && (
                  <li>
                    {isFrench ? 'Personne 2: ' : 'Person 2: '}
                    {!userData.personal?.naissance2 && (isFrench ? 'Date de naissance ' : 'Birth date ')}
                    {!userData.personal?.sexe2 && (isFrench ? 'Sexe ' : 'Gender ')}
                  </li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Section 1: Profils personnels */}
          <div className="senior-financial-grid">
            {/* Personne 1 */}
            <Card className="senior-compact-card border-blue-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-blue-800">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  {isFrench ? 'Personne 1' : 'Person 1'}
                  {person1Valid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="senior-form-grid">
                  <div className="senior-form-field">
                    <Label className="senior-form-label">
                      {isFrench ? 'Nom complet' : 'Full Name'}
                    </Label>
                    <Input
                      value={userData.personal?.prenom1 || ''}
                      onChange={(e) => handleNameChange('prenom1', e.target.value)}
                      className="senior-form-input"
                      placeholder={isFrench ? 'Ex: Jean Philippe...' : 'Ex: John Smith...'}
                    />
                  </div>

                  <div className="senior-form-field">
                    <Label className="senior-form-label">
                      {isFrench ? 'Date de naissance' : 'Birth Date'}
                    </Label>
                    <CustomBirthDateInput
                      id="naissance1"
                      label=""
                      value={userData.personal?.naissance1 || ''}
                      onChange={(date) => handleProfileChange('naissance1', date)}
                      className="senior-form-input"
                    />
                  </div>

                  <div className="senior-form-field">
                    <Label className="senior-form-label">
                      {isFrench ? 'Sexe' : 'Gender'}
                    </Label>
                    <Select
                      value={userData.personal?.sexe1 || ''}
                      onValueChange={(value) => handleProfileChange('sexe1', value)}
                    >
                      <SelectTrigger className="senior-form-input">
                        <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homme">{isFrench ? 'Homme' : 'Male'}</SelectItem>
                        <SelectItem value="femme">{isFrench ? 'Femme' : 'Female'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="senior-form-field">
                    <Label className="senior-form-label">
                      {isFrench ? 'Province' : 'Province'}
                    </Label>
                    <Select
                      value={userData.personal?.province1 || userData.personal?.province || ''}
                      onValueChange={(value) => updateUserData('personal', { province1: value, province: value })}
                    >
                      <SelectTrigger className="senior-form-input">
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Facteurs de santé pour Personne 1 */}
                <div className="mt-4 space-y-3">
                  <h4 className="flex items-center gap-2 text-green-700 font-semibold">
                    <Heart className="w-4 h-4" />
                    {isFrench ? 'Facteurs de santé' : 'Health Factors'}
                  </h4>
                  <div className="senior-form-grid">
                    <div className="senior-form-field">
                      <Label className="senior-form-label text-sm">
                        {isFrench ? 'État de santé' : 'Health Status'}
                      </Label>
                      <Select
                        value={userData.personal?.etatSante1 || ''}
                        onValueChange={(value) => updateUserData('personal', { etatSante1: value })}
                      >
                        <SelectTrigger className="senior-form-input h-10">
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

                    <div className="senior-form-field">
                      <Label className="senior-form-label text-sm">
                        {isFrench ? 'Mode de vie' : 'Lifestyle'}
                      </Label>
                      <Select
                        value={userData.personal?.modeVieActif1 || ''}
                        onValueChange={(value) => updateUserData('personal', { modeVieActif1: value })}
                      >
                        <SelectTrigger className="senior-form-input h-10">
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
                </div>

                {/* Résultats de longévité Personne 1 */}
                {person1Valid && (
                  <div className="mt-4 bg-blue-50 rounded-lg p-4">
                    <h5 className="flex items-center gap-2 text-blue-700 font-semibold mb-3">
                      <Star className="w-4 h-4" />
                      {isFrench ? 'Analyse de longévité' : 'Longevity Analysis'}
                    </h5>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-blue-600">
                          {person1Mortality.lifeExpectancy} {isFrench ? 'ans' : 'years'}
                        </div>
                        <div className="text-xs text-gray-600">{isFrench ? 'Espérance de vie' : 'Life expectancy'}</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-600">
                          {person1Mortality.finalAge} {isFrench ? 'ans' : 'years'}
                        </div>
                        <div className="text-xs text-gray-600">{isFrench ? 'Âge final estimé' : 'Estimated final age'}</div>
                      </div>
                      <div>
                        <div className={`text-xl font-bold ${person1Mortality.adjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {person1Mortality.adjustment >= 0 ? '+' : ''}{person1Mortality.adjustment.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-600">{isFrench ? 'Ajustement' : 'Adjustment'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Personne 2 */}
            <Card className="senior-compact-card border-green-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  {isFrench ? 'Personne 2 (optionnel)' : 'Person 2 (optional)'}
                  {hasPerson2Data && (
                    person2Valid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="senior-form-grid">
                  <div className="senior-form-field">
                    <Label className="senior-form-label">
                      {isFrench ? 'Nom complet' : 'Full Name'}
                    </Label>
                    <Input
                      value={userData.personal?.prenom2 || ''}
                      onChange={(e) => handleNameChange('prenom2', e.target.value)}
                      className="senior-form-input"
                      placeholder={isFrench ? 'Ex: Marie...' : 'Ex: Mary...'}
                    />
                  </div>

                  <div className="senior-form-field">
                    <Label className="senior-form-label">
                      {isFrench ? 'Date de naissance' : 'Birth Date'}
                    </Label>
                    <CustomBirthDateInput
                      id="naissance2"
                      label=""
                      value={userData.personal?.naissance2 || ''}
                      onChange={(date) => handleProfileChange('naissance2', date)}
                      className="senior-form-input"
                    />
                  </div>

                  <div className="senior-form-field">
                    <Label className="senior-form-label">
                      {isFrench ? 'Sexe' : 'Gender'}
                    </Label>
                    <Select
                      value={userData.personal?.sexe2 || ''}
                      onValueChange={(value) => handleProfileChange('sexe2', value)}
                    >
                      <SelectTrigger className="senior-form-input">
                        <SelectValue placeholder={isFrench ? 'Sélectionner' : 'Select'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homme">{isFrench ? 'Homme' : 'Male'}</SelectItem>
                        <SelectItem value="femme">{isFrench ? 'Femme' : 'Female'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="senior-form-field">
                    <Label className="senior-form-label">
                      {isFrench ? 'Province' : 'Province'}
                    </Label>
                    <Select
                      value={userData.personal?.province2 || ''}
                      onValueChange={(value) => updateUserData('personal', { province2: value })}
                    >
                      <SelectTrigger className="senior-form-input">
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Facteurs de santé pour Personne 2 */}
                {hasPerson2Data && (
                  <div className="mt-4 space-y-3">
                    <h4 className="flex items-center gap-2 text-green-700 font-semibold">
                      <Heart className="w-4 h-4" />
                      {isFrench ? 'Facteurs de santé' : 'Health Factors'}
                    </h4>
                    <div className="senior-form-grid">
                      <div className="senior-form-field">
                        <Label className="senior-form-label text-sm">
                          {isFrench ? 'État de santé' : 'Health Status'}
                        </Label>
                        <Select
                          value={userData.personal?.etatSante2 || ''}
                          onValueChange={(value) => updateUserData('personal', { etatSante2: value })}
                        >
                          <SelectTrigger className="senior-form-input h-10">
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

                      <div className="senior-form-field">
                        <Label className="senior-form-label text-sm">
                          {isFrench ? 'Mode de vie' : 'Lifestyle'}
                        </Label>
                        <Select
                          value={userData.personal?.modeVieActif2 || ''}
                          onValueChange={(value) => updateUserData('personal', { modeVieActif2: value })}
                        >
                          <SelectTrigger className="senior-form-input h-10">
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
                  </div>
                )}

                {/* Résultats de longévité Personne 2 */}
                {person2Valid && hasPerson2Data && (
                  <div className="mt-4 bg-green-50 rounded-lg p-4">
                    <h5 className="flex items-center gap-2 text-green-700 font-semibold mb-3">
                      <Star className="w-4 h-4" />
                      {isFrench ? 'Analyse de longévité' : 'Longevity Analysis'}
                    </h5>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-green-600">
                          {person2Mortality.lifeExpectancy} {isFrench ? 'ans' : 'years'}
                        </div>
                        <div className="text-xs text-gray-600">{isFrench ? 'Espérance de vie' : 'Life expectancy'}</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-600">
                          {person2Mortality.finalAge} {isFrench ? 'ans' : 'years'}
                        </div>
                        <div className="text-xs text-gray-600">{isFrench ? 'Âge final estimé' : 'Estimated final age'}</div>
                      </div>
                      <div>
                        <div className={`text-xl font-bold ${person2Mortality.adjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {person2Mortality.adjustment >= 0 ? '+' : ''}{person2Mortality.adjustment.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-600">{isFrench ? 'Ajustement' : 'Adjustment'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Section 2: Analyse comparative du couple (CORRIGÉE) */}
          {person1Valid && person2Valid && hasPerson2Data && coupleAnalysis && (
            <div className="senior-analysis-results">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6" />
                <h2 className="text-2xl font-bold">
                  {isFrench ? 'Analyse Comparative du Couple' : 'Couple Comparative Analysis'}
                </h2>
              </div>
              
              <div className="senior-couple-analysis">
                <div className="senior-metric-card">
                  <div className="senior-metric-value">{coupleAnalysis.ecartAge} {isFrench ? 'ans' : 'years'}</div>
                  <div className="senior-metric-label">{isFrench ? 'Écart d\'âge final' : 'Final age gap'}</div>
                </div>
                
                <div className="senior-metric-card">
                  <div className="senior-metric-value">{coupleAnalysis.dernierSurvivant} {isFrench ? 'ans' : 'years'}</div>
                  <div className="senior-metric-label">{isFrench ? 'Dernier survivant estimé' : 'Last survivor estimated'}</div>
                </div>
                
                <div className="senior-metric-card">
                  <div className="senior-metric-value">{coupleAnalysis.planificationJusqua} {isFrench ? 'ans' : 'years'}</div>
                  <div className="senior-metric-label">{isFrench ? 'Planification jusqu\'à' : 'Planning until'}</div>
                </div>
                
                <div className="senior-metric-card">
                  <div className="senior-metric-value">{coupleAnalysis.anneesVeuvage} {isFrench ? 'ans' : 'years'}</div>
                  <div className="senior-metric-label">{isFrench ? 'Années de veuvage' : 'Years of widowhood'}</div>
                </div>
              </div>
              
              <div className="mt-4 text-sm bg-white/10 rounded-lg p-3">
                <strong>{isFrench ? 'Recommandation :' : 'Recommendation:'}</strong>{' '}
                {isFrench 
                  ? `Planifiez vos finances jusqu'à ${coupleAnalysis.planificationJusqua} ans pour couvrir le conjoint survivant avec une marge de sécurité.`
                  : `Plan your finances until age ${coupleAnalysis.planificationJusqua} to cover the surviving spouse with a safety margin.`}
              </div>
            </div>
          )}

          {/* Section 3: Résumé financier familial harmonisé */}
          <div className="senior-analysis-results">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-6 h-6" />
              <h2 className="text-2xl font-bold">
                {isFrench ? 'Résumé Familial' : 'Family Summary'}
              </h2>
            </div>
            
            <div className="senior-financial-grid">
              {/* 1. REVENUS DE TRAVAIL (premier ordre) */}
              <div className="senior-metric-card">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5" />
                  <h3 className="font-semibold">{isFrench ? 'Revenus de travail' : 'Work Income'}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{isFrench ? 'Salaire:' : 'Salary:'}</span>
                    <span className="font-semibold">{formatCurrencyQuebec(familyFinancials.revenusTravail.details.salaires)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isFrench ? 'Travail autonome:' : 'Self-employment:'}</span>
                    <span className="font-semibold">{formatCurrencyQuebec(familyFinancials.revenusTravail.details.travailAutonome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isFrench ? 'Autres revenus:' : 'Other income:'}</span>
                    <span className="font-semibold">{formatCurrencyQuebec(familyFinancials.revenusTravail.details.autresRevenus)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-2 font-bold">
                    <span>{isFrench ? 'Total revenus:' : 'Total income:'}</span>
                    <span className="text-lg">{formatCurrencyQuebec(familyFinancials.revenusTravail.total)}</span>
                  </div>
                </div>
              </div>

              {/* 2. PRESTATIONS (deuxième ordre) */}
              <div className="senior-metric-card">
                <div className="flex items-center gap-2 mb-3">
                  <Landmark className="w-5 h-5" />
                  <h3 className="font-semibold">{isFrench ? 'Prestations' : 'Benefits'}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>RRQ/CPP:</span>
                    <span className="font-semibold">{formatCurrencyQuebec(familyFinancials.prestations.details.rrqCpp)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isFrench ? 'Sécurité vieillesse:' : 'Old Age Security:'}</span>
                    <span className="font-semibold">{formatCurrencyQuebec(familyFinancials.prestations.details.securiteVieillesse)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isFrench ? 'Assurance emploi:' : 'Employment Insurance:'}</span>
                    <span className="font-semibold">{formatCurrencyQuebec(familyFinancials.prestations.details.assuranceEmploi)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-2 font-bold">
                    <span>{isFrench ? 'Total prestations:' : 'Total benefits:'}</span>
                    <span className="text-lg">{formatCurrencyQuebec(familyFinancials.prestations.total)}</span>
                  </div>
                </div>
              </div>

              {/* 3. INVESTISSEMENTS (troisième ordre) */}
              <div className="senior-metric-card">
                <div className="flex items-center gap-2 mb-3">
                  <PiggyBank className="w-5 h-5" />
                  <h3 className="font-semibold">{isFrench ? 'Investissements' : 'Investments'}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>REER:</span>
                    <span className="font-semibold">{formatCurrencyQuebec(familyFinancials.investissements.details.reer)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CELI:</span>
                    <span className="font-semibold">{formatCurrencyQuebec(familyFinancials.investissements.details.celi)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CRI:</span>
                    <span className="font-semibold">{formatCurrencyQuebec(familyFinancials.investissements.details.cri)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-2 font-bold">
                    <span>{isFrench ? 'Total investissements:' : 'Total investments:'}</span>
                    <span className="text-lg">{formatCurrencyQuebec(familyFinancials.investissements.total)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Total général */}
            <div className="text-center mt-6">
              <div className="senior-metric-value text-3xl">
                {formatCurrencyQuebec(familyFinancials.grandTotal)}
              </div>
              <div className="senior-metric-label text-lg">
                {isFrench ? 'Total des revenus et prestations annuels' : 'Total annual income and benefits'}
              </div>
            </div>
          </div>

          {/* Section 4: Sélecteur de mode d'analyse */}
          <LongevityModeSelector
            mode={longevityMode}
            onModeChange={setLongevityMode}
            isFrench={isFrench}
          />

          {/* Section 5: Analyse détaillée selon le mode */}
          {longevityMode === 'personalized' && person1Valid && (
            <div className="space-y-6">
              <SynchronizedIncomeDisplay
                userData={userData}
                isFrench={isFrench}
                showDetails={true}
                className="max-w-4xl mx-auto"
              />
              
              <div className="senior-financial-grid">
                <SocioEconomicSection
                  userData={userData}
                  updateUserData={updateUserData}
                  isFrench={isFrench}
                  personNumber={1}
                />
                {hasPerson2Data && (
                  <SocioEconomicSection
                    userData={userData}
                    updateUserData={updateUserData}
                    isFrench={isFrench}
                    personNumber={2}
                  />
                )}
              </div>

              <div className="senior-financial-grid">
                <PersonalizedLongevityAnalysis
                  userData={userData}
                  isFrench={isFrench}
                  personNumber={1}
                />
                {hasPerson2Data && (
                  <PersonalizedLongevityAnalysis
                    userData={userData}
                    isFrench={isFrench}
                    personNumber={2}
                  />
                )}
              </div>
            </div>
          )}

          {/* Section 6: Conformité et méthodologie */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-lg">
                    {isFrench ? 'Conformité IPF 2025' : 'IPF 2025 Compliance'}
                  </span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {isFrench ? 'Conforme' : 'Compliant'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Source: CPM2014 - {isFrench ? 'Institut canadien des actuaires' : 'Canadian Institute of Actuaries'}
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-blue-800 text-sm">
                  <strong>IPF</strong> = {isFrench ? 'Institut de planification financière' : 'Institut de planification financière (IPF)'}
                </p>
                <p className="text-blue-700 mt-1 text-sm">
                  {isFrench 
                    ? 'L\'organisme qui régit la profession de planificateur financier au Québec. Nos calculs respectent leurs normes de projection 2025.'
                    : 'The organization that governs the financial planning profession in Quebec. Our calculations comply with their 2025 projection standards.'}
                </p>
                <Alert className="mt-3 border-yellow-200 bg-yellow-50">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>{isFrench ? 'Avertissement :' : 'Warning:'}</strong>{' '}
                    {isFrench 
                      ? 'Ces projections sont basées sur des statistiques populationnelles et ne constituent pas des prédictions individuelles. Utilisation limitée à la planification financière uniquement.'
                      : 'These projections are based on population statistics and do not constitute individual predictions. Use limited to financial planning only.'}
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Actions utilisateur */}
          <div className="text-center space-y-4">
            <Button
              size="lg"
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-6 px-12 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={async () => {
                setIsSaving(true);
                try {
                  const saveResult = await EnhancedSaveManager.saveWithDialog(userData, { includeTimestamp: true });
                  if (saveResult.success) {
                    alert(isFrench
                      ? `Données sauvegardées avec succès dans ${saveResult.filename} !`
                      : `Data saved successfully to ${saveResult.filename}!`);
                  } else if (saveResult.blocked) {
                    alert(isFrench ? `Sauvegarde bloquée: ${saveResult.reason}` : `Save blocked: ${saveResult.reason}`);
                  } else {
                    alert(isFrench ? `Erreur: ${saveResult.error}` : `Error: ${saveResult.error}`);
                  }
                } catch (error) {
                  console.error('Erreur lors de la sauvegarde:', error);
                  alert(isFrench ? 'Erreur lors de la sauvegarde' : 'Error saving data');
                } finally {
                  setIsSaving(false);
                }
              }}
            >
              <Save className="w-6 h-6 mr-3" />
              {isSaving ? (isFrench ? 'SAUVEGARDE...' : 'SAVING...') : (isFrench ? 'SAUVEGARDER' : 'SAVE')}
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8"
                onClick={() => navigate('/fr/rapports-retraite')}
              >
                {isFrench ? 'Voir mes résultats' : 'View my results'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8"
                onClick={() => navigate('/revenus')}
              >
                {isFrench ? 'Gérer mes revenus' : 'Manage my income'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Onboarding */}
      {showOnboardingWizard && (
        <OnboardingWizard 
          onComplete={handleOnboardingComplete} 
          onSkip={handleOnboardingSkip} 
          isFrench={isFrench} 
        />
      )}
    </div>
  );
};

export default MaRetraite;