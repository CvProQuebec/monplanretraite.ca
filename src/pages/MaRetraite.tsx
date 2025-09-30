import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { MORTALITY_CPM2014 } from '@/config/financial-assumptions';
import {
  User,
  Users,
  Shield,
  Zap,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Heart,
  Save
} from 'lucide-react';
import SocioEconomicSection from '@/components/ui/SocioEconomicSection';
import HealthFactorsSection from '@/components/ui/HealthFactorsSection';
import EnvironmentFactorsSection from '@/components/ui/EnvironmentFactorsSection';
import '../../senior-unified-styles.css';

// Styles locaux complémentaires (petit complément aux styles unifiés)
const pageLocalStyles = `
.senior-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.04);
  margin-bottom: 16px;
}
.senior-compact-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}
.senior-inline-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.senior-inline-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.senior-field-inline { display: grid; grid-template-columns: minmax(160px, 200px) 1fr; align-items: center; gap: 8px; }
.senior-form-label { font-size: 14px; font-weight: 600; color: #2d3748; }
.senior-form-input, .senior-form-select {
  font-size: 16px; min-height: 48px; padding: 10px 14px; border: 2px solid #e2e8f0; border-radius: 8px; background: white;
}
.mode-option {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.mode-option:hover { border-color: #4c6ef5; box-shadow: 0 4px 12px rgba(76,110,245,0.1); }
.mode-option.selected { border-color: #10b981; box-shadow: 0 0 0 2px #10b98122; }
.result-metric { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 12px; }
.result-value { font-size: 32px; font-weight: 700; color: #0c4a6e; }
.result-label { font-size: 14px; color: #64748b; margin-top: 4px; }
.impact-indicator {
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 600;
}
.impact-positive { background: #dcfce7; color: #166534; }
.impact-negative { background: #fee2e2; color: #dc2626; }
.impact-neutral { background: #f3f4f6; color: #374151; }
.senior-btn { font-size: 18px; font-weight: 700; padding: 12px 20px; border-radius: 8px; border: 2px solid transparent; min-height: 48px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 8px; }
.senior-btn-primary { background: #4c6ef5; color: white; border-color: #4c6ef5; }
.senior-btn-primary:hover { background: #364fc7; border-color: #364fc7; }
@media (max-width: 768px) { .senior-inline-grid-2, .senior-inline-grid-3 { grid-template-columns: 1fr; } }
`;

interface PersonalData {
  prenom1?: string;
  nom1?: string;
  prenom2?: string;
  nom2?: string;
  naissance1?: string;
  naissance2?: string;
  sexe1?: string;
  sexe2?: string;
  province?: string;
  province1?: string;
  province2?: string;

  // socio
  statutMatrimonial?: string;
  enfants?: boolean;
  trancheRevenu1?: string;
  trancheRevenu2?: string;
  niveauEducation1?: string;
  niveauEducation2?: string;
  secteurEmploi1?: string;
  secteurEmploi2?: string;

  // santé / style de vie
  etatSante1?: string;
  etatSante2?: string;
  statutTabagique1?: string;
  statutTabagique2?: string;
  anneesArretTabac1?: number;
  anneesArretTabac2?: number;
  heuresExercice1?: number;
  heuresExercice2?: number;
  modeVieActif1?: string;
  modeVieActif2?: string;
  taille1?: number;
  taille2?: number;
  poids1?: number;
  poids2?: number;

  // statuts cliniques
  hypertension1?: 'aucune'|'detectee'|'traitement'|'remission';
  glycemie1?: 'aucune'|'detectee'|'traitement'|'remission';
  cholesterol1?: 'aucune'|'detectee'|'traitement'|'remission';
  hypertension2?: 'aucune'|'detectee'|'traitement'|'remission';
  glycemie2?: 'aucune'|'detectee'|'traitement'|'remission';
  cholesterol2?: 'aucune'|'detectee'|'traitement'|'remission';

  // sports
  sports1?: string[];
  sports2?: string[];
}

const MaRetraite: React.FC = () => {
  const { language } = useLanguage();
  const isFrench = language === 'fr';
  const { userData, updateUserData } = useRetirementData();

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = pageLocalStyles;
    document.head.appendChild(el);
    return () => { if (document.head.contains(el)) document.head.removeChild(el); };
  }, []);

  const personal = (userData.personal || {}) as PersonalData;

  const [longevityMode, setLongevityMode] = useState<'standard'|'advanced'>('standard');
  const [isSaving, setIsSaving] = useState(false);

  const computeAge = useCallback((birth?: string) => {
    if (!birth) return 65;
    const d = new Date(birth);
    if (isNaN(d.getTime())) return 65;
    const now = new Date();
    let a = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
    return Math.max(18, Math.min(100, a));
  }, []);

  const genderFor = useCallback((sexe?: string): 'male'|'female' => {
    const s = (sexe || '').toLowerCase();
    return (s === 'f' || s === 'femme' || s === 'female') ? 'female' : 'male';
  }, []);

  const calcBMI = useCallback((t?: number, p?: number): number | null => {
    if (!t || !p || t <= 0) return null;
    const m = t / 100;
    return p / (m*m);
  }, []);

  // Mortalité de base CPM2014
  const basicMortality = useCallback((person: 1|2) => {
    const age = computeAge(person === 1 ? personal.naissance1 : personal.naissance2);
    const gender = genderFor(person === 1 ? personal.sexe1 : personal.sexe2);
    const base = MORTALITY_CPM2014.calculateLifeExpectancy({ age, gender });
    return {
      currentAge: age,
      lifeExpectancy: base.lifeExpectancy,
      finalAge: Math.round(age + base.lifeExpectancy),
      planningAge: base.recommendedPlanningAge,
      source: base.source
    };
  }, [personal, computeAge, genderFor]);

  // Ajustements avancés
  const advancedMortality = useCallback((person: 1|2) => {
    const base = basicMortality(person);
    const s = person === 1 ? '1' : '2';
    const adj: Record<string, number> = {};

    // État de santé auto-rapporté
    const etat = (personal as any)[`etatSante${s}`] as string | undefined;
    if (etat === 'excellent') adj.health = 2.5;
    else if (etat === 'tresbon') adj.health = 1.5;
    else if (etat === 'bon') adj.health = 0.5;
    else if (etat === 'moyen') adj.health = 0;
    else if (etat === 'fragile') adj.health = -2;
    else adj.health = 0;

    // Mode de vie actif
    const style = (personal as any)[`modeVieActif${s}`] as string | undefined;
    if (style === 'tresActif') adj.lifestyle = 1.5;
    else if (style === 'actif') adj.lifestyle = 1;
    else if (style === 'modere') adj.lifestyle = 0.5;
    else if (style === 'legerementActif') adj.lifestyle = 0;
    else if (style === 'sedentaire') adj.lifestyle = -1.5;
    else adj.lifestyle = 0;

    // Heures d'exercice
    const heures = Number((personal as any)[`heuresExercice${s}`] ?? 0);
    if (heures >= 6) adj.exercise = 1.2;
    else if (heures >= 4) adj.exercise = 0.8;
    else if (heures >= 2) adj.exercise = 0.4;
    else if (heures > 0) adj.exercise = 0.1;
    else adj.exercise = 0;

    // Sports pratiqués
    const sports = (((personal as any)[`sports${s}`] as string[]) || []);
    const perSport: Record<string, number> = { marche: 0.3, velo: 0.5, tennis: 0.4, quilles: 0.1, curling: 0.2, patinage: 0.3, hockey: 0.2 };
    adj.sports = Math.min(1.5, sports.reduce((sum, sp) => sum + (perSport[sp] || 0), 0));

    // Tabac
    const tabac = (personal as any)[`statutTabagique${s}`] as string | undefined;
    if (tabac === 'jamais') adj.smoking = 1;
    else if (tabac === 'ancien') {
      const y = Number((personal as any)[`anneesArretTabac${s}`] ?? 0);
      if (y >= 10) adj.smoking = 0.5;
      else if (y >= 5) adj.smoking = -0.5;
      else adj.smoking = -1.5;
    } else if (tabac === 'actuel') adj.smoking = -4;
    else adj.smoking = 0;

    // IMC
    const bmi = calcBMI((personal as any)[`taille${s}`], (personal as any)[`poids${s}`]);
    if (bmi !== null) {
      if (bmi < 18.5) adj.bmi = -1;
      else if (bmi < 25) adj.bmi = 0.5;
      else if (bmi < 30) adj.bmi = 0.3;
      else if (bmi < 35) adj.bmi = -1;
      else if (bmi < 40) adj.bmi = -2.5;
      else adj.bmi = -4;
    } else adj.bmi = 0;

    // Pathologies ciblées
    const h = (personal as any)[`hypertension${s}`] as PersonalData['hypertension1'];
    const g = (personal as any)[`glycemie${s}`] as PersonalData['glycemie1'];
    const c = (personal as any)[`cholesterol${s}`] as PersonalData['cholesterol1'];
    if (h === 'aucune') adj.hypertension = 0.1;
    else if (h === 'detectee') adj.hypertension = -1.0;
    else if (h === 'traitement') adj.hypertension = -0.4;
    else if (h === 'remission') adj.hypertension = 0;

    if (g === 'aucune') adj.glycemie = 0.2;
    else if (g === 'detectee') adj.glycemie = -2.0;
    else if (g === 'traitement') adj.glycemie = -1.0;
    else if (g === 'remission') adj.glycemie = -0.3;

    if (c === 'aucune') adj.cholesterol = 0.1;
    else if (c === 'detectee') adj.cholesterol = -0.8;
    else if (c === 'traitement') adj.cholesterol = -0.3;
    else if (c === 'remission') adj.cholesterol = 0;

    // Statut familial
    const marital = personal.statutMatrimonial;
    if (marital === 'marie' || marital === 'conjoint-fait') adj.marital = 1.0;
    else if (marital === 'celibataire' || marital === 'separe' || marital === 'veuf') adj.marital = -0.5;
    else adj.marital = 0;

    // Enfants
    adj.children = personal.enfants ? 0.3 : 0;

    // Facteurs socio-économiques
    const education = (personal as any)[`niveauCompetences${s}`] as string | undefined;
    if (education === 'expert') adj.education = 0.8;
    else if (education === 'experimente') adj.education = 0.5;
    else if (education === 'intermediaire') adj.education = 0.2;
    else if (education === 'debutant') adj.education = -0.2;
    else adj.education = 0;

    const sector = (personal as any)[`secteurActivite${s}`] as string | undefined;
    if (sector === 'sante') adj.workSector = 0.5;
    else if (sector === 'education') adj.workSector = 0.3;
    else if (sector === 'technologie') adj.workSector = 0.2;
    else if (sector === 'construction') adj.workSector = -0.3;
    else if (sector === 'manufacturier') adj.workSector = -0.2;
    else adj.workSector = 0;

    const riskTolerance = (personal as any)[`toleranceRisqueInvestissement${s}`] as string | undefined;
    if (riskTolerance === 'agressif') adj.riskTolerance = 0.3;
    else if (riskTolerance === 'dynamique') adj.riskTolerance = 0.2;
    else if (riskTolerance === 'equilibre') adj.riskTolerance = 0;
    else if (riskTolerance === 'conservateur') adj.riskTolerance = -0.3;
    else if (riskTolerance === 'tres-conservateur') adj.riskTolerance = -0.5;
    else adj.riskTolerance = 0;

    // Facteurs environnementaux
    const livingEnv = (personal as any)[`livingEnvironment${s}`] as string | undefined;
    if (livingEnv === 'rural') adj.livingEnvironment = 0.5;
    else if (livingEnv === 'suburbain') adj.livingEnvironment = 0.3;
    else if (livingEnv === 'urbain') adj.livingEnvironment = -0.2;
    else adj.livingEnvironment = 0;

    const airQuality = (personal as any)[`airQuality${s}`] as string | undefined;
    if (airQuality === 'excellente') adj.airQuality = 0.8;
    else if (airQuality === 'bonne') adj.airQuality = 0.3;
    else if (airQuality === 'moyenne') adj.airQuality = 0;
    else if (airQuality === 'pauvre') adj.airQuality = -1.2;
    else adj.airQuality = 0;

    const waterQuality = (personal as any)[`waterQuality${s}`] as string | undefined;
    if (waterQuality === 'excellente') adj.waterQuality = 0.3;
    else if (waterQuality === 'bonne') adj.waterQuality = 0.1;
    else if (waterQuality === 'moyenne') adj.waterQuality = 0;
    else if (waterQuality === 'pauvre') adj.waterQuality = -0.5;
    else adj.waterQuality = 0;

    const greenSpaces = (personal as any)[`accessToGreenSpaces${s}`] as string | undefined;
    if (greenSpaces === 'excellent') adj.greenSpaces = 0.6;
    else if (greenSpaces === 'bon') adj.greenSpaces = 0.3;
    else if (greenSpaces === 'limite') adj.greenSpaces = 0;
    else if (greenSpaces === 'aucun') adj.greenSpaces = -0.4;
    else adj.greenSpaces = 0;

    const healthcareDistance = Number((personal as any)[`distanceToSpecializedCare${s}`] ?? 0);
    if (healthcareDistance <= 5) adj.healthcareAccess = 0.4;
    else if (healthcareDistance <= 15) adj.healthcareAccess = 0.1;
    else if (healthcareDistance <= 30) adj.healthcareAccess = 0;
    else if (healthcareDistance <= 60) adj.healthcareAccess = -0.3;
    else adj.healthcareAccess = -0.8;

    const communitySupport = (personal as any)[`communitySupport${s}`] as string | undefined;
    if (communitySupport === 'fort') adj.communitySupport = 0.7;
    else if (communitySupport === 'modere') adj.communitySupport = 0.2;
    else if (communitySupport === 'faible') adj.communitySupport = -0.3;
    else adj.communitySupport = 0;

    const total = Math.max(-15, Math.min(15, Object.values(adj).reduce((a, b) => a + b, 0)));

    return {
      ...base,
      adjustments: adj,
      totalAdjustment: total,
      adjustedLifeExpectancy: Math.max(0, base.lifeExpectancy + total),
      adjustedFinalAge: Math.round(base.currentAge + base.lifeExpectancy + total)
    };
  }, [personal, basicMortality, calcBMI]);

  const p1Valid = Boolean(personal.naissance1 && personal.sexe1);
  const p2HasData = Boolean(personal.prenom2 || personal.naissance2);
  const p2Valid = Boolean(p2HasData && personal.naissance2 && personal.sexe2);

  const p1Result = useMemo(() => {
    if (!p1Valid) return null;
    return longevityMode === 'advanced' ? advancedMortality(1) : basicMortality(1);
  }, [p1Valid, longevityMode, advancedMortality, basicMortality]);

  const p2Result = useMemo(() => {
    if (!p2Valid) return null;
    return longevityMode === 'advanced' ? advancedMortality(2) : basicMortality(2);
  }, [p2Valid, longevityMode, advancedMortality, basicMortality]);

  const save = async () => {
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      alert(isFrench ? 'Données sauvegardées avec succès!' : 'Data saved successfully!');
    } finally {
      setIsSaving(false);
    }
  };

  const sportsOptions = useMemo(() => [
    { value: 'marche', label: isFrench ? 'Marche' : 'Walking' },
    { value: 'velo', label: isFrench ? 'Vélo' : 'Cycling' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'quilles', label: isFrench ? 'Quilles' : 'Bowling' },
    { value: 'curling', label: 'Curling' },
    { value: 'patinage', label: isFrench ? 'Patinage' : 'Skating' },
    { value: 'hockey', label: 'Hockey' },
  ], [isFrench]);

  return (
    <div className="min-h-screen bg-gray-50 senior-layout">
      <div className="container mx-auto px-4 sm:px-6 py-8 mpr-form">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <User className="w-10 h-10 text-blue-600" />
            {isFrench ? 'Mon profil de retraite' : 'My Retirement Profile'}
          </h1>
          <p className="text-xl text-gray-600">
            {isFrench ? 'Planification financière avec analyse de longévité personnalisée' : 'Financial planning with personalized longevity analysis'}
          </p>
        </div>

        {/* Validation alert */}
        {(!p1Valid || (p2HasData && !p2Valid)) && (
          <div className="senior-card" style={{ borderColor: '#fecaca', background: '#fff7f7' }}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <strong className="text-red-900">{isFrench ? 'Champs requis manquants' : 'Required fields missing'}</strong>
                <p className="text-red-700 text-sm mt-1">
                  {isFrench ? 'Veuillez compléter la date de naissance et le sexe pour activer l\'analyse de longévité.' : 'Please complete birth date and gender to enable longevity analysis.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 1: Informations de base */}
        <div className="senior-compact-section">
          <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            {isFrench ? 'Informations de base' : 'Basic Information'}
          </h2>

          <div className="mpr-form-row cols-2">
            {/* Person 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <span className="font-semibold text-blue-800">{isFrench ? 'Personne 1' : 'Person 1'}</span>
                {p1Valid && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>

          <div className="mpr-form-row cols-2">
                <div className="senior-field-inline">
                  <label className="senior-form-label" htmlFor="p1-fullname">{isFrench ? 'Nom complet' : 'Full Name'}</label>
                  <input
                    id="p1-fullname"
                    className="senior-form-input"
                    type="text"
                    placeholder={isFrench ? 'Jean Tremblay' : 'John Smith'}
                    aria-label={isFrench ? 'Nom complet personne 1' : 'Full name person 1'}
                    value={`${personal.prenom1 || ''}${personal.nom1 ? ' ' + personal.nom1 : ''}`}
                    onChange={(e) => {
                      const full = (e.target.value || '').trim();
                      if (!full) {
                        updateUserData('personal', { prenom1: '', nom1: '' });
                        return;
                      }
                      const parts = full.split(/\s+/);
                      const last = parts.length > 1 ? parts.pop() as string : '';
                      const first = parts.join(' ');
                      updateUserData('personal', { prenom1: first, nom1: last });
                    }}
                  />
                </div>
                <div className="senior-field-inline">
                  <label className="senior-form-label" htmlFor="p1-birth">{isFrench ? 'Date de naissance *' : 'Birth Date *'}</label>
                  <input id="p1-birth" className="senior-form-input" type="date" aria-label={isFrench ? 'Date de naissance personne 1' : 'Birth date person 1'} value={personal.naissance1 || ''} onChange={(e) => updateUserData('personal', { naissance1: e.target.value })} />
                </div>
              </div>

            <div className="mpr-form-row cols-2">
                <div className="senior-field-inline">
                  <label className="senior-form-label" htmlFor="p1-gender">{isFrench ? 'Sexe *' : 'Gender *'}</label>
                  <select id="p1-gender" className="senior-form-select" aria-label={isFrench ? 'Sexe personne 1' : 'Gender person 1'} value={personal.sexe1 || ''} onChange={(e) => updateUserData('personal', { sexe1: e.target.value })}>
                    <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                    <option value="homme">{isFrench ? 'Homme' : 'Male'}</option>
                    <option value="femme">{isFrench ? 'Femme' : 'Female'}</option>
                  </select>
                </div>
                <div className="senior-field-inline">
                  <label className="senior-form-label" htmlFor="p1-province">Province</label>
                  <select id="p1-province" className="senior-form-select" aria-label={isFrench ? 'Province personne 1' : 'Province person 1'} value={personal.province1 || personal.province || ''} onChange={(e) => updateUserData('personal', { province1: e.target.value, province: e.target.value })}>
                    <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                    <option value="QC">Québec</option>
                    <option value="ON">Ontario</option>
                    <option value="BC">Colombie-Britannique</option>
                    <option value="AB">Alberta</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Person 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <span className="font-semibold text-green-800">{isFrench ? 'Personne 2 (optionnel)' : 'Person 2 (optional)'}</span>
                {p2Valid && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>

              <div className="mpr-form-row cols-2">
                <div className="senior-field-inline">
                  <label className="senior-form-label" htmlFor="p2-fullname">{isFrench ? 'Nom complet' : 'Full Name'}</label>
                  <input
                    id="p2-fullname"
                    className="senior-form-input"
                    type="text"
                    placeholder={isFrench ? 'Marie Tremblay' : 'Mary Smith'}
                    aria-label={isFrench ? 'Nom complet personne 2' : 'Full name person 2'}
                    value={`${personal.prenom2 || ''}${personal.nom2 ? ' ' + personal.nom2 : ''}`}
                    onChange={(e) => {
                      const full = (e.target.value || '').trim();
                      if (!full) {
                        updateUserData('personal', { prenom2: '', nom2: '' });
                        return;
                      }
                      const parts = full.split(/\s+/);
                      const last = parts.length > 1 ? parts.pop() as string : '';
                      const first = parts.join(' ');
                      updateUserData('personal', { prenom2: first, nom2: last });
                    }}
                  />
                </div>
                <div className="senior-field-inline">
                  <label className="senior-form-label" htmlFor="p2-birth">{isFrench ? 'Date de naissance' : 'Birth Date'}</label>
                  <input id="p2-birth" className="senior-form-input" type="date" aria-label={isFrench ? 'Date de naissance personne 2' : 'Birth date person 2'} value={personal.naissance2 || ''} onChange={(e) => updateUserData('personal', { naissance2: e.target.value })} />
                </div>
              </div>

              <div className="mpr-form-row cols-2">
                <div className="senior-field-inline">
                  <label className="senior-form-label" htmlFor="p2-gender">{isFrench ? 'Sexe' : 'Gender'}</label>
                  <select id="p2-gender" className="senior-form-select" aria-label={isFrench ? 'Sexe personne 2' : 'Gender person 2'} value={personal.sexe2 || ''} onChange={(e) => updateUserData('personal', { sexe2: e.target.value })}>
                    <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                    <option value="homme">{isFrench ? 'Homme' : 'Male'}</option>
                    <option value="femme">{isFrench ? 'Femme' : 'Female'}</option>
                  </select>
                </div>
                <div className="senior-field-inline">
                  <label className="senior-form-label" htmlFor="p2-province">Province</label>
                  <select id="p2-province" className="senior-form-select" aria-label={isFrench ? 'Province personne 2' : 'Province person 2'} value={personal.province2 || ''} onChange={(e) => updateUserData('personal', { province2: e.target.value })}>
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

        {/* Situation familiale */}
        <div className="senior-card">
          <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            {isFrench ? 'Situation familiale' : 'Family Situation'}
          </h2>
          <div className="mpr-form-row cols-2">
            <div className="senior-field-inline">
              <label className="senior-form-label" htmlFor="marital">{isFrench ? 'Statut matrimonial' : 'Marital Status'}</label>
              <select
                id="marital"
                className="senior-form-select"
                aria-label={isFrench ? 'Statut matrimonial' : 'Marital status'}
                value={personal.statutMatrimonial || ''}
                onChange={(e) => {
                  const v = e.target.value;
                  const updates: any = { statutMatrimonial: v };
                  // Si célibataire: vider Personne 2 et mettre ses montants à 0
                  if (v === 'celibataire' || v === 'single') {
                    updates.prenom2 = '';
                    updates.nom2 = '';
                    updates.naissance2 = '';
                    updates.sexe2 = '';
                    updates.salaire2 = 0;
                    updates.unifiedIncome2 = [];
                  }
                  updateUserData('personal', updates);
                  if (v === 'celibataire' || v === 'single') {
                    updateUserData('savings', {
                      reer2: 0,
                      celi2: 0,
                      placements2: 0,
                      epargne2: 0,
                      cri2: 0
                    });
                  }
                }}
              >
                <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                <option value="marie">{isFrench ? 'Marié' : 'Married'}</option>
                <option value="celibataire">{isFrench ? 'Célibataire' : 'Single'}</option>
                <option value="conjoint-fait">{isFrench ? 'Conjoint de fait' : 'Common-law'}</option>
                <option value="separe">{isFrench ? 'Séparé' : 'Separated'}</option>
                <option value="veuf">{isFrench ? 'Veuf' : 'Widowed'}</option>
              </select>
            </div>
            <div className="senior-field-inline">
              <label className="senior-form-label" htmlFor="children">{isFrench ? 'Enfants' : 'Children'}</label>
              <select id="children" className="senior-form-select" aria-label={isFrench ? 'Enfants' : 'Children'} value={personal.enfants ? 'oui' : 'non'} onChange={(e) => updateUserData('personal', { enfants: e.target.value === 'oui' })}>
                <option value="oui">{isFrench ? 'Oui' : 'Yes'}</option>
                <option value="non">{isFrench ? 'Non' : 'No'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sélecteur de mode */}
        {p1Valid && (
          <div className="senior-card">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <TrendingUp className="w-8 h-8" />
                {isFrench ? 'Mode d\'analyse de longévité' : 'Longevity Analysis Mode'}
              </h2>
              <p className="text-lg opacity-90">
                {isFrench ? 'Choisissez le niveau d\'analyse souhaité pour vos projections' : 'Choose your desired level of analysis for your projections'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`mode-option ${longevityMode === 'standard' ? 'selected' : ''}`} onClick={() => setLongevityMode('standard')}>
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Standard CPM2014/IPF2025</h3>
                </div>
                <p className="text-sm opacity-90">
                  {isFrench ? 'Calculs basés sur la table CPM2014 (IPF 2025).' : 'Calculations based on CPM2014 table (IPF 2025).'}
                </p>
              </div>

              <div className={`mode-option ${longevityMode === 'advanced' ? 'selected' : ''}`} onClick={() => setLongevityMode('advanced')}>
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-6 h-6" />
                  <h3 className="text-xl font-bold">{isFrench ? 'Avancé personnalisé' : 'Advanced Personalized'}</h3>
                </div>
                <p className="text-sm opacity-90">
                  {isFrench ? 'Analyse multi-facteurs (santé, style de vie, statut familial).' : 'Multi-factor analysis (health, lifestyle, family status).'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Résultats de longévité */}
        {p1Valid && p1Result && (
          <div className="senior-card">
            <h2 className="text-2xl font-bold text-center mb-6">{isFrench ? 'Analyse de longévité' : 'Longevity Analysis'}</h2>
            <div className="mpr-result-grid">
              <div className="result-metric">
                <div className="result-value">{p1Result.currentAge} {isFrench ? 'ans' : 'years'}</div>
                <div className="result-label">{isFrench ? 'Âge actuel - Personne 1' : 'Current Age - Person 1'}</div>
              </div>
              <div className="result-metric">
                <div className="result-value">
                  {longevityMode === 'advanced' && (p1Result as any).adjustedLifeExpectancy !== undefined
                    ? Number((p1Result as any).adjustedLifeExpectancy).toFixed(1)
                    : Number(p1Result.lifeExpectancy).toFixed(1)} {isFrench ? 'ans' : 'years'}
                </div>
                <div className="result-label">{isFrench ? 'Espérance de vie' : 'Life Expectancy'}</div>
              </div>
              <div className="result-metric">
                <div className="result-value">
                  {longevityMode === 'advanced' && (p1Result as any).adjustedFinalAge !== undefined
                    ? (p1Result as any).adjustedFinalAge
                    : p1Result.finalAge} {isFrench ? 'ans' : 'years'}
                </div>
                <div className="result-label">{isFrench ? 'Âge de planification' : 'Planning Age'}</div>
              </div>
            </div>

            {p2Result && (
              <div className="mpr-result-grid mt-6 pt-6 border-t border-blue-200">
                <div className="result-metric">
                  <div className="result-value">{p2Result.currentAge} {isFrench ? 'ans' : 'years'}</div>
                  <div className="result-label">{isFrench ? 'Âge actuel - Personne 2' : 'Current Age - Person 2'}</div>
                </div>
                <div className="result-metric">
                  <div className="result-value">
                    {longevityMode === 'advanced' && (p2Result as any).adjustedLifeExpectancy !== undefined
                      ? Number((p2Result as any).adjustedLifeExpectancy).toFixed(1)
                      : Number(p2Result.lifeExpectancy).toFixed(1)} {isFrench ? 'ans' : 'years'}
                  </div>
                  <div className="result-label">{isFrench ? 'Espérance de vie' : 'Life Expectancy'}</div>
                </div>
                <div className="result-metric">
                  <div className="result-value">
                    {longevityMode === 'advanced' && (p2Result as any).adjustedFinalAge !== undefined
                      ? (p2Result as any).adjustedFinalAge
                      : p2Result.finalAge} {isFrench ? 'ans' : 'years'}
                  </div>
                  <div className="result-label">{isFrench ? 'Âge de planification' : 'Planning Age'}</div>
                </div>
              </div>
            )}

            {longevityMode === 'advanced' && (p1Result as any).adjustments && (
              <div className="mt-6 pt-6 border-t border-blue-200">
                <h3 className="text-lg font-semibold mb-4">{isFrench ? 'Impact des facteurs personnalisés' : 'Personalized Factors Impact'}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(((p1Result as any).adjustments as Record<string, number>)).map(([k, v]) => {
                    const val = Number(v);
                    
                    // Traduction des facteurs selon l'OQLF
                    const getFactorLabel = (key: string) => {
                      const translations: Record<string, { fr: string; en: string }> = {
                        'health': { fr: 'Santé', en: 'Health' },
                        'lifestyle': { fr: 'Mode de vie', en: 'Lifestyle' },
                        'exercise': { fr: 'Exercice', en: 'Exercise' },
                        'sports': { fr: 'Sports', en: 'Sports' },
                        'smoking': { fr: 'Tabagisme', en: 'Smoking' },
                        'bmi': { fr: 'IMC', en: 'BMI' },
                        'hypertension': { fr: 'Hypertension', en: 'Hypertension' },
                        'glycemie': { fr: 'Glycémie', en: 'Blood Sugar' },
                        'cholesterol': { fr: 'Cholestérol', en: 'Cholesterol' },
                        'marital': { fr: 'Situation familiale', en: 'Marital Status' },
                        'children': { fr: 'Enfants', en: 'Children' },
                        'education': { fr: 'Éducation', en: 'Education' },
                        'workSector': { fr: 'Secteur d\'activité', en: 'Work Sector' },
                        'riskTolerance': { fr: 'Tolérance au risque', en: 'Risk Tolerance' },
                        'livingEnvironment': { fr: 'Milieu de vie', en: 'Living Environment' },
                        'airQuality': { fr: 'Qualité de l\'air', en: 'Air Quality' },
                        'waterQuality': { fr: 'Qualité de l\'eau', en: 'Water Quality' },
                        'greenSpaces': { fr: 'Espaces verts', en: 'Green Spaces' },
                        'healthcareAccess': { fr: 'Accès aux soins', en: 'Healthcare Access' },
                        'communitySupport': { fr: 'Soutien communautaire', en: 'Community Support' }
                      };
                      
                      const translation = translations[key];
                      if (translation) {
                        return isFrench ? translation.fr : translation.en;
                      }
                      return key;
                    };
                    
                    return (
                      <div key={k} className={`impact-indicator ${val > 0 ? 'impact-positive' : val < 0 ? 'impact-negative' : 'impact-neutral'}`}>
                        <span className="capitalize">{getFactorLabel(k)}</span>
                        <span className="font-bold">{val > 0 ? '+' : ''}{val.toFixed(1)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Facteurs Personnalisés - Modules complets */}
        {p1Valid && longevityMode === 'advanced' && (
          <div className="space-y-6">
            {/* Facteurs Socio-économiques */}
            <SocioEconomicSection
              userData={userData}
              updateUserData={updateUserData}
              isFrench={isFrench}
              personNumber={1}
            />

            {p2HasData && (
              <SocioEconomicSection
                userData={userData}
                updateUserData={updateUserData}
                isFrench={isFrench}
                personNumber={2}
              />
            )}

            {/* Santé et Mode de Vie */}
            <HealthFactorsSection
              userData={userData}
              updateUserData={updateUserData}
              isFrench={isFrench}
              personNumber={1}
            />

            {p2HasData && (
              <HealthFactorsSection
                userData={userData}
                updateUserData={updateUserData}
                isFrench={isFrench}
                personNumber={2}
              />
            )}

            {/* Environnement de Vie */}
            <EnvironmentFactorsSection
              userData={userData}
              updateUserData={updateUserData}
              isFrench={isFrench}
              personNumber={1}
            />

            {p2HasData && (
              <EnvironmentFactorsSection
                userData={userData}
                updateUserData={updateUserData}
                isFrench={isFrench}
                personNumber={2}
              />
            )}
          </div>
        )}

        {/* Save */}
        <div className="flex justify-center mt-6">
          <button className="senior-btn senior-btn-primary" disabled={isSaving} onClick={save}>
            <Save className="w-5 h-5" />
            {isSaving ? (isFrench ? 'Sauvegarde...' : 'Saving...') : (isFrench ? 'Sauvegarder' : 'Save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaRetraite;
