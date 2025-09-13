import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { MORTALITY_CPM2014 } from '@/config/financial-assumptions';
import {
  Star,
  Info,
  Shield,
  Save,
  User,
  Heart,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Home,
  DollarSign,
  Activity,
  Brain,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Settings,
  Zap,
  Cigarette,
  Apple,
  MapPin,
  Stethoscope,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Styles optimisés pour seniors
const seniorOptimizedStyles = `
.senior-layout {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 18px;
  line-height: 1.6;
  color: #1a365d;
}

.senior-compact-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  max-height: 320px;
}

.senior-inline-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.senior-inline-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.senior-field-inline {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.senior-form-label {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.senior-form-input {
  font-size: 16px;
  min-height: 44px;
  padding: 10px 14px;
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

.senior-form-select {
  font-size: 16px;
  min-height: 44px;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.mode-selector {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
}

.mode-option {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-option:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.mode-option.selected {
  background: rgba(255, 255, 255, 0.3);
  border-color: #10b981;
  box-shadow: 0 0 0 2px #10b981;
}

.factor-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.factor-card:hover {
  border-color: #4c6ef5;
  box-shadow: 0 4px 12px rgba(76, 110, 245, 0.1);
}

.impact-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.impact-positive {
  background: #dcfce7;
  color: #166534;
}

.impact-negative {
  background: #fee2e2;
  color: #dc2626;
}

.impact-neutral {
  background: #f3f4f6;
  color: #374151;
}

.longevity-result-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #0ea5e9;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.result-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 12px;
}

.result-value {
  font-size: 32px;
  font-weight: 700;
  color: #0c4a6e;
}

.result-label {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .senior-inline-grid-3 {
    grid-template-columns: 1fr;
  }
  .senior-inline-grid-2 {
    grid-template-columns: 1fr;
  }
}
`;

// Types et interfaces
interface Contact {
  id: string;
  nom: string;
  relation: string;
  telephone: string;
  email: string;
  adresse: string;
}

interface PersonalData {
  prenom1?: string;
  prenom2?: string;
  naissance1?: string;
  naissance2?: string;
  sexe1?: string;
  sexe2?: string;
  province?: string;
  province1?: string;
  province2?: string;
  salaire1?: number;
  salaire2?: number;
  
  // Facteurs socio-économiques
  trancheRevenu1?: string;
  trancheRevenu2?: string;
  niveauEducation1?: string;
  niveauEducation2?: string;
  secteurEmploi1?: string;
  secteurEmploi2?: string;
  statutMatrimonial?: string;
  
  // Facteurs de santé
  etatSante1?: string;
  etatSante2?: string;
  statutTabagique1?: string;
  statutTabagique2?: string;
  anneesArretTabac1?: number;
  anneesArretTabac2?: number;
  modeVieActif1?: string;
  modeVieActif2?: string;
  heuresExercice1?: number;
  heuresExercice2?: number;
  taille1?: number;
  taille2?: number;
  poids1?: number;
  poids2?: number;
  
  // Facteurs environnementaux
  milieuVie?: string;
  medecinFamille?: boolean;
  distanceSoins?: number;
  qualiteAir?: string;
  
  // Conditions médicales
  conditionsChroniques1?: string[];
  conditionsChroniques2?: string[];
  
  // Facteurs psychosociaux
  niveauStress1?: string;
  niveauStress2?: string;
  qualiteSommeil1?: string;
  qualiteSommeil2?: string;
  reseauSocial1?: string;
  reseauSocial2?: string;
}

const MaRetraite: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';
  const { userData, updateUserData } = useRetirementData();

  // États locaux
  const [longevityMode, setLongevityMode] = useState<'standard' | 'advanced'>('standard');
  const [isSaving, setIsSaving] = useState(false);
  const [showAdvancedFactors, setShowAdvancedFactors] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    socioeconomic: true,
    health: false,
    environment: false,
    psychosocial: false
  });

  // Injection des styles CSS
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

  // Fonction pour basculer l'expansion d'une section
  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Fonctions de calcul d'âge et genre
  const computeAgeFromBirthdate = useCallback((birthDate: string | undefined): number => {
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
  }, []);

  const getGenderForMortality = useCallback((sexe: string | undefined): 'male' | 'female' => {
    if (!sexe) return 'male';
    const val = String(sexe).toLowerCase();
    return (val === 'f' || val === 'femme' || val === 'female') ? 'female' : 'male';
  }, []);

  // Calcul IMC
  const calculateBMI = useCallback((height: number | undefined, weight: number | undefined): number | null => {
    if (!height || !weight || height <= 0) return null;
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }, []);

  const getBMICategory = useCallback((bmi: number | null): string => {
    if (!bmi) return 'Non calculé';
    if (bmi < 18.5) return 'Insuffisant';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Surpoids';
    if (bmi < 35) return 'Obésité I';
    if (bmi < 40) return 'Obésité II';
    return 'Obésité III';
  }, []);

  // Calculs de mortalité de base (CPM2014)
  const calculateBasicMortality = useCallback((personNumber: 1 | 2) => {
    const birthField = personNumber === 1 ? 'naissance1' : 'naissance2';
    const genderField = personNumber === 1 ? 'sexe1' : 'sexe2';

    const age = computeAgeFromBirthdate(userData.personal?.[birthField]);
    const gender = getGenderForMortality(userData.personal?.[genderField]);
    
    const base = MORTALITY_CPM2014.calculateLifeExpectancy({ age, gender });
    
    return {
      currentAge: age,
      lifeExpectancy: base.lifeExpectancy,
      finalAge: Math.round(age + base.lifeExpectancy),
      planningAge: base.recommendedPlanningAge,
      source: base.source
    };
  }, [userData.personal, computeAgeFromBirthdate, getGenderForMortality]);

  // Calculs de mortalité avancés avec facteurs personnalisés
  const calculateAdvancedMortality = useCallback((personNumber: 1 | 2) => {
    const basic = calculateBasicMortality(personNumber);
    
    let totalAdjustment = 0;
    const adjustments: {[key: string]: number} = {};
    const suffix = personNumber === 1 ? '1' : '2';

    // Facteurs de santé
    const healthStatus = userData.personal?.[`etatSante${suffix}`];
    if (healthStatus === 'excellent') adjustments.health = 2.5;
    else if (healthStatus === 'tresbon') adjustments.health = 1.5;
    else if (healthStatus === 'bon') adjustments.health = 0.5;
    else if (healthStatus === 'moyen') adjustments.health = 0;
    else if (healthStatus === 'fragile') adjustments.health = -2;
    else adjustments.health = 0.5;

    // Mode de vie actif
    const lifestyle = userData.personal?.[`modeVieActif${suffix}`];
    if (lifestyle === 'tresActif') adjustments.lifestyle = 1.5;
    else if (lifestyle === 'actif') adjustments.lifestyle = 1;
    else if (lifestyle === 'modere') adjustments.lifestyle = 0.5;
    else if (lifestyle === 'legerementActif') adjustments.lifestyle = 0;
    else if (lifestyle === 'sedentaire') adjustments.lifestyle = -1.5;
    else adjustments.lifestyle = 0.5;

    // Tabagisme
    const smoking = userData.personal?.[`statutTabagique${suffix}`];
    if (smoking === 'jamais') adjustments.smoking = 1;
    else if (smoking === 'ancien') {
      const yearsQuit = userData.personal?.[`anneesArretTabac${suffix}`] || 0;
      if (yearsQuit >= 10) adjustments.smoking = 0.5;
      else if (yearsQuit >= 5) adjustments.smoking = -0.5;
      else adjustments.smoking = -1.5;
    }
    else if (smoking === 'actuel') adjustments.smoking = -4;
    else adjustments.smoking = 0;

    // IMC
    const height = userData.personal?.[`taille${suffix}`];
    const weight = userData.personal?.[`poids${suffix}`];
    const bmi = calculateBMI(height, weight);
    if (bmi) {
      if (bmi < 18.5) adjustments.bmi = -1;
      else if (bmi < 25) adjustments.bmi = 0.5;
      else if (bmi < 30) adjustments.bmi = 0.3; // Paradoxe du surpoids léger
      else if (bmi < 35) adjustments.bmi = -1;
      else if (bmi < 40) adjustments.bmi = -2.5;
      else adjustments.bmi = -4;
    }

    // Facteurs socio-économiques
    const education = userData.personal?.[`niveauEducation${suffix}`];
    if (education === 'universitaire') adjustments.education = 1.5;
    else if (education === 'collegial') adjustments.education = 0.8;
    else if (education === 'secondaire') adjustments.education = 0;
    else if (education === 'primaire') adjustments.education = -1;
    else adjustments.education = 0;

    // Revenu familial
    const incomeRange = userData.personal?.[`trancheRevenu${suffix}`];
    if (incomeRange === 'plus110k') adjustments.income = 1.5;
    else if (incomeRange === '75-110k') adjustments.income = 0.8;
    else if (incomeRange === '50-75k') adjustments.income = 0;
    else if (incomeRange === '30-50k') adjustments.income = -0.5;
    else if (incomeRange === 'moins30k') adjustments.income = -1.5;
    else adjustments.income = 0;

    // Calcul total avec bornes
    totalAdjustment = Object.values(adjustments).reduce((sum, adj) => sum + adj, 0);
    totalAdjustment = Math.max(-8, Math.min(8, totalAdjustment));

    return {
      ...basic,
      adjustments,
      totalAdjustment,
      adjustedLifeExpectancy: Math.max(0, basic.lifeExpectancy + totalAdjustment),
      adjustedFinalAge: Math.round(basic.currentAge + basic.lifeExpectancy + totalAdjustment)
    };
  }, [calculateBasicMortality, userData.personal, calculateBMI]);

  // Validation des données
  const validatePersonData = useCallback((personNumber: 1 | 2): boolean => {
    const suffix = personNumber === 1 ? '1' : '2';
    const birthField = `naissance${suffix}`;
    const sexField = `sexe${suffix}`;
    return !!(userData.personal?.[birthField] && userData.personal?.[sexField]);
  }, [userData.personal]);

  const person1Valid = validatePersonData(1);
  const person2Valid = validatePersonData(2);
  const hasPerson2Data = !!(userData.personal?.prenom2 || userData.personal?.naissance2);

  // Calculs de mortalité selon le mode
  const person1Mortality = useMemo(() => {
    if (!person1Valid) return null;
    return longevityMode === 'advanced' ? 
      calculateAdvancedMortality(1) : 
      calculateBasicMortality(1);
  }, [userData.personal, longevityMode, person1Valid, calculateAdvancedMortality, calculateBasicMortality]);

  const person2Mortality = useMemo(() => {
    if (!hasPerson2Data || !person2Valid) return null;
    return longevityMode === 'advanced' ? 
      calculateAdvancedMortality(2) : 
      calculateBasicMortality(2);
  }, [userData.personal, longevityMode, hasPerson2Data, person2Valid, calculateAdvancedMortality, calculateBasicMortality]);

  // Sauvegarde des données
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(isFrench ? 'Données sauvegardées avec succès!' : 'Data saved successfully!');
    } catch (error) {
      alert(isFrench ? 'Erreur lors de la sauvegarde' : 'Error saving data');
    } finally {
      setIsSaving(false);
    }
  }, [isFrench]);

  // Composants UI simplifiés (utilisation des composants natifs HTML)
  const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );

  const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="px-6 py-4 border-b border-gray-200">
      {children}
    </div>
  );

  const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <h3 className={`text-lg font-semibold ${className}`}>
      {children}
    </h3>
  );

  const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="px-6 py-4">
      {children}
    </div>
  );

  const Alert: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`rounded-md p-4 ${className}`}>
      {children}
    </div>
  );

  const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50 senior-layout">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        
        {/* En-tête principal */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <User className="w-10 h-10 text-blue-600" />
            {isFrench ? 'Mon Profil de Retraite' : 'My Retirement Profile'}
          </h1>
          <p className="text-xl text-gray-600">
            {isFrench
              ? 'Planification financière avec analyse de longévité personnalisée'
              : 'Financial planning with personalized longevity analysis'}
          </p>
        </div>

        {/* Alerte de validation */}
        {(!person1Valid || (hasPerson2Data && !person2Valid)) && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <strong className="text-red-900">
                  {isFrench ? 'Champs requis manquants' : 'Required fields missing'}
                </strong>
                <p className="text-red-700 text-sm mt-1">
                  {isFrench 
                    ? 'Veuillez compléter les informations de base (date de naissance et sexe) pour activer l\'analyse de longévité.' 
                    : 'Please complete basic information (birth date and gender) to activate longevity analysis.'}
                </p>
              </div>
            </div>
          </Alert>
        )}

        {/* SECTION 1: INFORMATIONS DE BASE - Version condensée */}
        <div className="senior-compact-section">
          <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            {isFrench ? 'Informations de Base' : 'Basic Information'}
          </h2>
          
          <div className="senior-inline-grid-2">
            {/* Personne 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <span className="font-semibold text-blue-800">
                  {isFrench ? 'Personne 1' : 'Person 1'}
                </span>
                {person1Valid && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
              
              <div className="senior-inline-grid-2 gap-3">
                <div className="senior-field-inline">
                  <label className="senior-form-label">
                    {isFrench ? 'Nom complet' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={userData.personal?.prenom1 || ''}
                    onChange={(e) => updateUserData('personal', { prenom1: e.target.value })}
                    className="senior-form-input"
                    placeholder={isFrench ? 'Jean Tremblay' : 'John Smith'}
                  />
                </div>

                <div className="senior-field-inline">
                  <label className="senior-form-label">
                    {isFrench ? 'Date de naissance *' : 'Birth Date *'}
                  </label>
                  <input
                    type="date"
                    value={userData.personal?.naissance1 || ''}
                    onChange={(e) => updateUserData('personal', { naissance1: e.target.value })}
                    className="senior-form-input"
                  />
                </div>

                <div className="senior-field-inline">
                  <label className="senior-form-label">
                    {isFrench ? 'Sexe *' : 'Gender *'}
                  </label>
                  <select
                    value={userData.personal?.sexe1 || ''}
                    onChange={(e) => updateUserData('personal', { sexe1: e.target.value })}
                    className="senior-form-select"
                  >
                    <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                    <option value="homme">{isFrench ? 'Homme' : 'Male'}</option>
                    <option value="femme">{isFrench ? 'Femme' : 'Female'}</option>
                  </select>
                </div>

                <div className="senior-field-inline">
                  <label className="senior-form-label">
                    {isFrench ? 'Province' : 'Province'}
                  </label>
                  <select
                    value={userData.personal?.province1 || userData.personal?.province || ''}
                    onChange={(e) => updateUserData('personal', { province1: e.target.value, province: e.target.value })}
                    className="senior-form-select"
                  >
                    <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                    <option value="QC">Québec</option>
                    <option value="ON">Ontario</option>
                    <option value="BC">Colombie-Britannique</option>
                    <option value="AB">Alberta</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Personne 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <span className="font-semibold text-green-800">
                  {isFrench ? 'Personne 2 (optionnel)' : 'Person 2 (optional)'}
                </span>
                {hasPerson2Data && person2Valid && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
              
              <div className="senior-inline-grid-2 gap-3">
                <div className="senior-field-inline">
                  <label className="senior-form-label">
                    {isFrench ? 'Nom complet' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={userData.personal?.prenom2 || ''}
                    onChange={(e) => updateUserData('personal', { prenom2: e.target.value })}
                    className="senior-form-input"
                    placeholder={isFrench ? 'Marie Tremblay' : 'Mary Smith'}
                  />
                </div>

                <div className="senior-field-inline">
                  <label className="senior-form-label">
                    {isFrench ? 'Date de naissance' : 'Birth Date'}
                  </label>
                  <input
                    type="date"
                    value={userData.personal?.naissance2 || ''}
                    onChange={(e) => updateUserData('personal', { naissance2: e.target.value })}
                    className="senior-form-input"
                  />
                </div>

                <div className="senior-field-inline">
                  <label className="senior-form-label">
                    {isFrench ? 'Sexe' : 'Gender'}
                  </label>
                  <select
                    value={userData.personal?.sexe2 || ''}
                    onChange={(e) => updateUserData('personal', { sexe2: e.target.value })}
                    className="senior-form-select"
                  >
                    <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                    <option value="homme">{isFrench ? 'Homme' : 'Male'}</option>
                    <option value="femme">{isFrench ? 'Femme' : 'Female'}</option>
                  </select>
                </div>

                <div className="senior-field-inline">
                  <label className="senior-form-label">
                    {isFrench ? 'Province' : 'Province'}
                  </label>
                  <select
                    value={userData.personal?.province2 || ''}
                    onChange={(e) => updateUserData('personal', { province2: e.target.value })}
                    className="senior-form-select"
                  >
                    <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                    <option value="QC">Québec</option>
                    <option value="ON">Ontario</option>
                    <option value="BC">Colombie-Britannique</option>
                    <option value="AB">Alberta</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: SÉLECTEUR DE MODE D'ANALYSE */}
        {person1Valid && (
          <div className="mode-selector">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <TrendingUp className="w-8 h-8" />
                {isFrench ? 'Mode d\'Analyse de Longévité' : 'Longevity Analysis Mode'}
              </h2>
              <p className="text-lg opacity-90">
                {isFrench 
                  ? 'Choisissez le niveau d\'analyse souhaité pour vos projections'
                  : 'Choose your desired level of analysis for your projections'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mode Standard IPF2025 */}
              <div 
                className={`mode-option ${longevityMode === 'standard' ? 'selected' : ''}`}
                onClick={() => setLongevityMode('standard')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6" />
                  <h3 className="text-xl font-bold">
                    {isFrench ? 'Standard CPM2014/IPF2025' : 'Standard CPM2014/IPF2025'}
                  </h3>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {isFrench ? 'Recommandé' : 'Recommended'}
                  </Badge>
                </div>
                <p className="text-sm opacity-90 mb-4">
                  {isFrench 
                    ? 'Calculs basés sur les tables CPM2014 conformes aux normes IPF2025. Approche conservative et professionnelle.'
                    : 'Calculations based on CPM2014 tables compliant with IPF2025 standards. Conservative and professional approach.'}
                </p>
                <div className="text-xs space-y-1">
                  <div>✓ {isFrench ? 'Conforme réglementation québécoise' : 'Quebec regulation compliant'}</div>
                  <div>✓ {isFrench ? 'Tables actuarielles validées' : 'Validated actuarial tables'}</div>
                  <div>✓ {isFrench ? 'Approche conservative' : 'Conservative approach'}</div>
                </div>
              </div>

              {/* Mode Avancé Personnalisé */}
              <div 
                className={`mode-option ${longevityMode === 'advanced' ? 'selected' : ''}`}
                onClick={() => setLongevityMode('advanced')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-6 h-6" />
                  <h3 className="text-xl font-bold">
                    {isFrench ? 'Avancé Personnalisé' : 'Advanced Personalized'}
                  </h3>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    {isFrench ? 'Premium' : 'Premium'}
                  </Badge>
                </div>
                <p className="text-sm opacity-90 mb-4">
                  {isFrench 
                    ? 'Analyse multi-facteurs incluant santé, mode de vie, éducation et situation socio-économique.'
                    : 'Multi-factor analysis including health, lifestyle, education and socio-economic situation.'}
                </p>
                <div className="text-xs space-y-1">
                  <div>✓ {isFrench ? 'Facteurs de santé personnalisés' : 'Personalized health factors'}</div>
                  <div>✓ {isFrench ? 'Variables socio-économiques' : 'Socio-economic variables'}</div>
                  <div>✓ {isFrench ? 'Ajustements scientifiques' : 'Scientific adjustments'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: RÉSULTATS DE LONGÉVITÉ */}
        {person1Valid && person1Mortality && (
          <div className="longevity-result-card">
            <h2 className="text-2xl font-bold text-center mb-6">
              {isFrench ? 'Analyse de Longévité' : 'Longevity Analysis'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Personne 1 */}
              <div className="result-metric">
                <div className="result-value">
                  {person1Mortality.currentAge} ans
                </div>
                <div className="result-label">
                  {isFrench ? 'Âge actuel - Personne 1' : 'Current Age - Person 1'}
                </div>
              </div>
              
              <div className="result-metric">
                <div className="result-value">
                  {longevityMode === 'advanced' && 'adjustedLifeExpectancy' in person1Mortality
                    ? person1Mortality.adjustedLifeExpectancy.toFixed(1)
                    : person1Mortality.lifeExpectancy.toFixed(1)} ans
                </div>
                <div className="result-label">
                  {isFrench ? 'Espérance de vie' : 'Life Expectancy'}
                </div>
              </div>
              
              <div className="result-metric">
                <div className="result-value">
                  {longevityMode === 'advanced' && 'adjustedFinalAge' in person1Mortality
                    ? person1Mortality.adjustedFinalAge
                    : person1Mortality.finalAge} ans
                </div>
                <div className="result-label">
                  {isFrench ? 'Âge de planification' : 'Planning Age'}
                </div>
              </div>
            </div>

            {/* Personne 2 si applicable */}
            {person2Mortality && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-200">
                <div className="result-metric">
                  <div className="result-value">
                    {person2Mortality.currentAge} ans
                  </div>
                  <div className="result-label">
                    {isFrench ? 'Âge actuel - Personne 2' : 'Current Age - Person 2'}
                  </div>
                </div>
                
                <div className="result-metric">
                  <div className="result-value">
                    {longevityMode === 'advanced' && 'adjustedLifeExpectancy' in person2Mortality
                      ? person2Mortality.adjustedLifeExpectancy.toFixed(1)
                      : person2Mortality.lifeExpectancy.toFixed(1)} ans
                  </div>
                  <div className="result-label">
                    {isFrench ? 'Espérance de vie' : 'Life Expectancy'}
                  </div>
                </div>
                
                <div className="result-metric">
                  <div className="result-value">
                    {longevityMode === 'advanced' && 'adjustedFinalAge' in person2Mortality
                      ? person2Mortality.adjustedFinalAge
                      : person2Mortality.finalAge} ans
                  </div>
                  <div className="result-label">
                    {isFrench ? 'Âge de planification' : 'Planning Age'}
                  </div>
                </div>
              </div>
            )}

            {/* Ajustements détaillés en mode avancé */}
            {longevityMode === 'advanced' && 'adjustments' in person1Mortality && (
              <div className="mt-6 pt-6 border-t border-blue-200">
                <h3 className="text-lg font-semibold mb-4">
                  {isFrench ? 'Impact des facteurs personnalisés' : 'Personalized Factors Impact'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(person1Mortality.adjustments).map(([key, value]) => (
                    <div key={key} className={`impact-indicator ${value > 0 ? 'impact-positive' : value < 0 ? 'impact-negative' : 'impact-neutral'}`}>
                      <span className="capitalize">{key}</span>
                      <span className="font-bold">{value > 0 ? '+' : ''}{value.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: FACTEURS AVANCÉS (si mode avancé sélectionné) */}
        {person1Valid && longevityMode === 'advanced' && (
          <Card className="mb-8 border-2 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-800 text-2xl">
                <Settings className="w-8 h-8" />
                {isFrench ? 'Facteurs Personnalisés' : 'Personalized Factors'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Section Socio-économique */}
              <div className="factor-card mb-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('socioeconomic')}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    <h4 className="text-lg font-semibold">
                      {isFrench ? 'Facteurs Socio-économiques' : 'Socio-economic Factors'}
                    </h4>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-transform ${expandedSections.socioeconomic ? 'rotate-90' : ''}`} />
                </div>
                
                {expandedSections.socioeconomic && (
                  <div className="mt-4 space-y-4">
                    <div className="senior-inline-grid-2">
                      {/* Personne 1 */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-sm text-gray-700">Personne 1</h5>
                        
                        <div className="senior-field-inline">
                          <label className="senior-form-label">
                            {isFrench ? 'Tranche de revenu familial' : 'Household Income Range'}
                          </label>
                          <select
                            value={userData.personal?.trancheRevenu1 || ''}
                            onChange={(e) => updateUserData('personal', { trancheRevenu1: e.target.value })}
                            className="senior-form-select"
                          >
                            <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                            <option value="moins30k">{isFrench ? 'Moins de 30 000 $' : 'Under $30,000'}</option>
                            <option value="30-50k">30 000 $ - 50 000 $</option>
                            <option value="50-75k">50 000 $ - 75 000 $</option>
                            <option value="75-110k">75 000 $ - 110 000 $</option>
                            <option value="plus110k">{isFrench ? 'Plus de 110 000 $' : 'Over $110,000'}</option>
                          </select>
                        </div>

                        <div className="senior-field-inline">
                          <label className="senior-form-label">
                            {isFrench ? 'Niveau d\'éducation' : 'Education Level'}
                          </label>
                          <select
                            value={userData.personal?.niveauEducation1 || ''}
                            onChange={(e) => updateUserData('personal', { niveauEducation1: e.target.value })}
                            className="senior-form-select"
                          >
                            <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                            <option value="primaire">{isFrench ? 'Primaire' : 'Elementary'}</option>
                            <option value="secondaire">{isFrench ? 'Secondaire' : 'High School'}</option>
                            <option value="collegial">{isFrench ? 'Collégial/CÉGEP' : 'College'}</option>
                            <option value="universitaire">{isFrench ? 'Universitaire' : 'University'}</option>
                          </select>
                        </div>

                        <div className="senior-field-inline">
                          <label className="senior-form-label">
                            {isFrench ? 'Secteur d\'emploi' : 'Employment Sector'}
                          </label>
                          <select
                            value={userData.personal?.secteurEmploi1 || ''}
                            onChange={(e) => updateUserData('personal', { secteurEmploi1: e.target.value })}
                            className="senior-form-select"
                          >
                            <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                            <option value="public">{isFrench ? 'Public' : 'Public'}</option>
                            <option value="prive">{isFrench ? 'Privé' : 'Private'}</option>
                            <option value="autonome">{isFrench ? 'Travailleur autonome' : 'Self-employed'}</option>
                            <option value="retraite">{isFrench ? 'Retraité' : 'Retired'}</option>
                          </select>
                        </div>
                      </div>

                      {/* Personne 2 si applicable */}
                      {hasPerson2Data && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-sm text-gray-700">Personne 2</h5>
                          
                          <div className="senior-field-inline">
                            <label className="senior-form-label">
                              {isFrench ? 'Tranche de revenu familial' : 'Household Income Range'}
                            </label>
                            <select
                              value={userData.personal?.trancheRevenu2 || ''}
                              onChange={(e) => updateUserData('personal', { trancheRevenu2: e.target.value })}
                              className="senior-form-select"
                            >
                              <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                              <option value="moins30k">{isFrench ? 'Moins de 30 000 $' : 'Under $30,000'}</option>
                              <option value="30-50k">30 000 $ - 50 000 $</option>
                              <option value="50-75k">50 000 $ - 75 000 $</option>
                              <option value="75-110k">75 000 $ - 110 000 $</option>
                              <option value="plus110k">{isFrench ? 'Plus de 110 000 $' : 'Over $110,000'}</option>
                            </select>
                          </div>

                          <div className="senior-field-inline">
                            <label className="senior-form-label">
                              {isFrench ? 'Niveau d\'éducation' : 'Education Level'}
                            </label>
                            <select
                              value={userData.personal?.niveauEducation2 || ''}
                              onChange={(e) => updateUserData('personal', { niveauEducation2: e.target.value })}
                              className="senior-form-select"
                            >
                              <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                              <option value="primaire">{isFrench ? 'Primaire' : 'Elementary'}</option>
                              <option value="secondaire">{isFrench ? 'Secondaire' : 'High School'}</option>
                              <option value="collegial">{isFrench ? 'Collégial/CÉGEP' : 'College'}</option>
                              <option value="universitaire">{isFrench ? 'Universitaire' : 'University'}</option>
                            </select>
                          </div>

                          <div className="senior-field-inline">
                            <label className="senior-form-label">
                              {isFrench ? 'Secteur d\'emploi' : 'Employment Sector'}
                            </label>
                            <select
                              value={userData.personal?.secteurEmploi2 || ''}
                              onChange={(e) => updateUserData('personal', { secteurEmploi2: e.target.value })}
                              className="senior-form-select"
                            >
                              <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                              <option value="public">{isFrench ? 'Public' : 'Public'}</option>
                              <option value="prive">{isFrench ? 'Privé' : 'Private'}</option>
                              <option value="autonome">{isFrench ? 'Travailleur autonome' : 'Self-employed'}</option>
                              <option value="retraite">{isFrench ? 'Retraité' : 'Retired'}</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Section Santé et Mode de Vie */}
              <div className="factor-card mb-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('health')}
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-red-500" />
                    <h4 className="text-lg font-semibold">
                      {isFrench ? 'Santé et Mode de Vie' : 'Health and Lifestyle'}
                    </h4>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-transform ${expandedSections.health ? 'rotate-90' : ''}`} />
                </div>
                
                {expandedSections.health && (
                  <div className="mt-4 space-y-4">
                    <div className="senior-inline-grid-2">
                      {/* Personne 1 */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-sm text-gray-700">Personne 1</h5>
                        
                        <div className="senior-field-inline">
                          <label className="senior-form-label">
                            {isFrench ? 'État de santé général' : 'General Health Status'}
                          </label>
                          <select
                            value={userData.personal?.etatSante1 || ''}
                            onChange={(e) => updateUserData('personal', { etatSante1: e.target.value })}
                            className="senior-form-select"
                          >
                            <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                            <option value="excellent">{isFrench ? 'Excellent' : 'Excellent'}</option>
                            <option value="tresbon">{isFrench ? 'Très bon' : 'Very Good'}</option>
                            <option value="bon">{isFrench ? 'Bon' : 'Good'}</option>
                            <option value="moyen">{isFrench ? 'Moyen' : 'Fair'}</option>
                            <option value="fragile">{isFrench ? 'Fragile' : 'Poor'}</option>
                          </select>
                        </div>

                        <div className="senior-field-inline">
                          <label className="senior-form-label">
                            {isFrench ? 'Statut tabagique' : 'Smoking Status'}
                          </label>
                          <select
                            value={userData.personal?.statutTabagique1 || ''}
                            onChange={(e) => updateUserData('personal', { statutTabagique1: e.target.value })}
                            className="senior-form-select"
                          >
                            <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                            <option value="jamais">{isFrench ? 'Jamais fumé' : 'Never Smoked'}</option>
                            <option value="ancien">{isFrench ? 'Ex-fumeur' : 'Former Smoker'}</option>
                            <option value="actuel">{isFrench ? 'Fumeur actuel' : 'Current Smoker'}</option>
                          </select>
                        </div>

                        {userData.personal?.statutTabagique1 === 'ancien' && (
                          <div className="senior-field-inline">
                            <label className="senior-form-label">
                              {isFrench ? 'Années depuis l\'arrêt' : 'Years Since Quitting'}
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="50"
                              value={userData.personal?.anneesArretTabac1 || ''}
                              onChange={(e) => updateUserData('personal', { anneesArretTabac1: parseInt(e.target.value) })}
                              className="senior-form-input"
                            />
                          </div>
                        )}

                        <div className="senior-field-inline">
                          <label className="senior-form-label">
                            {isFrench ? 'Mode de vie actif' : 'Active Lifestyle'}
                          </label>
                          <select
                            value={userData.personal?.modeVieActif1 || ''}
                            onChange={(e) => updateUserData('personal', { modeVieActif1: e.target.value })}
                            className="senior-form-select"
                          >
                            <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                            <option value="sedentaire">{isFrench ? 'Sédentaire' : 'Sedentary'}</option>
                            <option value="legerementActif">{isFrench ? 'Légèrement actif' : 'Lightly Active'}</option>
                            <option value="modere">{isFrench ? 'Modéré' : 'Moderate'}</option>
                            <option value="actif">{isFrench ? 'Actif' : 'Active'}</option>
                            <option value="tresActif">{isFrench ? 'Très actif' : 'Very Active'}</option>
                          </select>
                        </div>

                        <div className="senior-inline-grid-2">
                          <div className="senior-field-inline">
                            <label className="senior-form-label">
                              {isFrench ? 'Taille (cm)' : 'Height (cm)'}
                            </label>
                            <input
                              type="number"
                              min="100"
                              max="250"
                              value={userData.personal?.taille1 || ''}
                              onChange={(e) => updateUserData('personal', { taille1: parseInt(e.target.value) })}
                              className="senior-form-input"
                            />
                          </div>

                          <div className="senior-field-inline">
                            <label className="senior-form-label">
                              {isFrench ? 'Poids (kg)' : 'Weight (kg)'}
                            </label>
                            <input
                              type="number"
                              min="30"
                              max="300"
                              value={userData.personal?.poids1 || ''}
                              onChange={(e) => updateUserData('personal', { poids1: parseInt(e.target.value) })}
                              className="senior-form-input"
                            />
                          </div>
                        </div>

                        {userData.personal?.taille1 && userData.personal?.poids1 && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm font-semibold text-blue-900">
                              IMC : {calculateBMI(userData.personal.taille1, userData.personal.poids1)?.toFixed(1)}
                            </div>
                            <div className="text-xs text-blue-700">
                              Catégorie : {getBMICategory(calculateBMI(userData.personal.taille1, userData.personal.poids1))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Personne 2 si applicable */}
                      {hasPerson2Data && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-sm text-gray-700">Personne 2</h5>
                          
                          <div className="senior-field-inline">
                            <label className="senior-form-label">
                              {isFrench ? 'État de santé général' : 'General Health Status'}
                            </label>
                            <select
                              value={userData.personal?.etatSante2 || ''}
                              onChange={(e) => updateUserData('personal', { etatSante2: e.target.value })}
                              className="senior-form-select"
                            >
                              <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                              <option value="excellent">{isFrench ? 'Excellent' : 'Excellent'}</option>
                              <option value="tresbon">{isFrench ? 'Très bon' : 'Very Good'}</option>
                              <option value="bon">{isFrench ? 'Bon' : 'Good'}</option>
                              <option value="moyen">{isFrench ? 'Moyen' : 'Fair'}</option>
                              <option value="fragile">{isFrench ? 'Fragile' : 'Poor'}</option>
                            </select>
                          </div>

                          <div className="senior-field-inline">
                            <label className="senior-form-label">
                              {isFrench ? 'Statut tabagique' : 'Smoking Status'}
                            </label>
                            <select
                              value={userData.personal?.statutTabagique2 || ''}
                              onChange={(e) => updateUserData('personal', { statutTabagique2: e.target.value })}
                              className="senior-form-select"
                            >
                              <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                              <option value="jamais">{isFrench ? 'Jamais fumé' : 'Never Smoked'}</option>
                              <option value="ancien">{isFrench ? 'Ex-fumeur' : 'Former Smoker'}</option>
                              <option value="actuel">{isFrench ? 'Fumeur actuel' : 'Current Smoker'}</option>
                            </select>
                          </div>

                          {userData.personal?.statutTabagique2 === 'ancien' && (
                            <div className="senior-field-inline">
                              <label className="senior-form-label">
                                {isFrench ? 'Années depuis l\'arrêt' : 'Years Since Quitting'}
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="50"
                                value={userData.personal?.anneesArretTabac2 || ''}
                                onChange={(e) => updateUserData('personal', { anneesArretTabac2: parseInt(e.target.value) })}
                                className="senior-form-input"
                              />
                            </div>
                          )}

                          <div className="senior-field-inline">
                            <label className="senior-form-label">
                              {isFrench ? 'Mode de vie actif' : 'Active Lifestyle'}
                            </label>
                            <select
                              value={userData.personal?.modeVieActif2 || ''}
                              onChange={(e) => updateUserData('personal', { modeVieActif2: e.target.value })}
                              className="senior-form-select"
                            >
                              <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                              <option value="sedentaire">{isFrench ? 'Sédentaire' : 'Sedentary'}</option>
                              <option value="legerementActif">{isFrench ? 'Légèrement actif' : 'Lightly Active'}</option>
                              <option value="modere">{isFrench ? 'Modéré' : 'Moderate'}</option>
                              <option value="actif">{isFrench ? 'Actif' : 'Active'}</option>
                              <option value="tresActif">{isFrench ? 'Très actif' : 'Very Active'}</option>
                            </select>
                          </div>

                          <div className="senior-inline-grid-2">
                            <div className="senior-field-inline">
                              <label className="senior-form-label">
                                {isFrench ? 'Taille (cm)' : 'Height (cm)'}
                              </label>
                              <input
                                type="number"
                                min="100"
                                max="250"
                                value={userData.personal?.taille2 || ''}
                                onChange={(e) => updateUserData('personal', { taille2: parseInt(e.target.value) })}
                                className="senior-form-input"
                              />
                            </div>

                            <div className="senior-field-inline">
                              <label className="senior-form-label">
                                {isFrench ? 'Poids (kg)' : 'Weight (kg)'}
                              </label>
                              <input
                                type="number"
                                min="30"
                                max="300"
                                value={userData.personal?.poids2 || ''}
                                onChange={(e) => updateUserData('personal', { poids2: parseInt(e.target.value) })}
                                className="senior-form-input"
                              />
                            </div>
                          </div>

                          {userData.personal?.taille2 && userData.personal?.poids2 && (
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <div className="text-sm font-semibold text-blue-900">
                                IMC : {calculateBMI(userData.personal.taille2, userData.personal.poids2)?.toFixed(1)}
                              </div>
                              <div className="text-xs text-blue-700">
                                Catégorie : {getBMICategory(calculateBMI(userData.personal.taille2, userData.personal.poids2))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Section Environnement */}
              <div className="factor-card mb-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('environment')}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-green-600" />
                    <h4 className="text-lg font-semibold">
                      {isFrench ? 'Environnement de Vie' : 'Living Environment'}
                    </h4>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-transform ${expandedSections.environment ? 'rotate-90' : ''}`} />
                </div>
                
                {expandedSections.environment && (
                  <div className="mt-4 space-y-4">
                    <div className="senior-inline-grid-2">
                      <div className="senior-field-inline">
                        <label className="senior-form-label">
                          {isFrench ? 'Type de milieu' : 'Environment Type'}
                        </label>
                        <select
                          value={userData.personal?.milieuVie || ''}
                          onChange={(e) => updateUserData('personal', { milieuVie: e.target.value })}
                          className="senior-form-select"
                        >
                          <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                          <option value="urbainDense">{isFrench ? 'Urbain dense (>100k hab)' : 'Dense Urban (>100k)'}</option>
                          <option value="urbainMoyen">{isFrench ? 'Urbain moyen (10-100k)' : 'Medium Urban (10-100k)'}</option>
                          <option value="ruralProche">{isFrench ? 'Rural proche (<10k)' : 'Near Rural (<10k)'}</option>
                          <option value="ruralEloigne">{isFrench ? 'Rural éloigné' : 'Remote Rural'}</option>
                        </select>
                      </div>

                      <div className="senior-field-inline">
                        <label className="senior-form-label">
                          {isFrench ? 'Médecin de famille' : 'Family Doctor'}
                        </label>
                        <select
                          value={userData.personal?.medecinFamille ? 'oui' : 'non'}
                          onChange={(e) => updateUserData('personal', { medecinFamille: e.target.value === 'oui' })}
                          className="senior-form-select"
                        >
                          <option value="oui">{isFrench ? 'Oui' : 'Yes'}</option>
                          <option value="non">{isFrench ? 'Non' : 'No'}</option>
                        </select>
                      </div>

                      <div className="senior-field-inline">
                        <label className="senior-form-label">
                          {isFrench ? 'Distance soins spécialisés (km)' : 'Distance to Specialized Care (km)'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="500"
                          value={userData.personal?.distanceSoins || ''}
                          onChange={(e) => updateUserData('personal', { distanceSoins: parseInt(e.target.value) })}
                          className="senior-form-input"
                        />
                      </div>

                      <div className="senior-field-inline">
                        <label className="senior-form-label">
                          {isFrench ? 'Qualité de l\'air' : 'Air Quality'}
                        </label>
                        <select
                          value={userData.personal?.qualiteAir || ''}
                          onChange={(e) => updateUserData('personal', { qualiteAir: e.target.value })}
                          className="senior-form-select"
                        >
                          <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                          <option value="excellente">{isFrench ? 'Excellente (campagne)' : 'Excellent (countryside)'}</option>
                          <option value="bonne">{isFrench ? 'Bonne (banlieue)' : 'Good (suburb)'}</option>
                          <option value="moderee">{isFrench ? 'Modérée (ville)' : 'Moderate (city)'}</option>
                          <option value="pauvre">{isFrench ? 'Pauvre (industriel)' : 'Poor (industrial)'}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bouton de sauvegarde */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isSaving 
              ? (isFrench ? 'Sauvegarde en cours...' : 'Saving...') 
              : (isFrench ? 'Sauvegarder les modifications' : 'Save Changes')}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <strong>{isFrench ? 'Avertissement :' : 'Disclaimer:'}</strong>
              {' '}
              {isFrench 
                ? 'Ces calculs sont basés sur des données statistiques populationnelles et ne remplacent pas un avis médical professionnel. Les résultats sont fournis à titre indicatif pour la planification financière uniquement.'
                : 'These calculations are based on population statistical data and do not replace professional medical advice. Results are provided for financial planning purposes only.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaRetraite;