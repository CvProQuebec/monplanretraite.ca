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
  prenom2?: string;
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

    const total = Math.max(-10, Math.min(10, Object.values(adj).reduce((a, b) => a + b, 0)));

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
            {isFrench ? 'Mon Profil de Retraite' : 'My Retirement Profile'}
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
            {isFrench ? 'Informations de Base' : 'Basic Information'}
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
                  <input id="p1-fullname" className="senior-form-input" type="text" placeholder={isFrench ? 'Jean Tremblay' : 'John Smith'} aria-label={isFrench ? 'Nom complet personne 1' : 'Full name person 1'} value={personal.prenom1 || ''} onChange={(e) => updateUserData('personal', { prenom1: e.target.value })} />
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
                  <input id="p2-fullname" className="senior-form-input" type="text" placeholder={isFrench ? 'Marie Tremblay' : 'Mary Smith'} aria-label={isFrench ? 'Nom complet personne 2' : 'Full name person 2'} value={personal.prenom2 || ''} onChange={(e) => updateUserData('personal', { prenom2: e.target.value })} />
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
            {isFrench ? 'Situation Familiale' : 'Family Situation'}
          </h2>
          <div className="mpr-form-row cols-2">
            <div className="senior-field-inline">
              <label className="senior-form-label" htmlFor="marital">{isFrench ? 'Statut matrimonial' : 'Marital Status'}</label>
              <select id="marital" className="senior-form-select" aria-label={isFrench ? 'Statut matrimonial' : 'Marital status'} value={personal.statutMatrimonial || ''} onChange={(e) => updateUserData('personal', { statutMatrimonial: e.target.value })}>
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
                {isFrench ? 'Mode d\'Analyse de Longévité' : 'Longevity Analysis Mode'}
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
                  <h3 className="text-xl font-bold">{isFrench ? 'Avancé Personnalisé' : 'Advanced Personalized'}</h3>
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
            <h2 className="text-2xl font-bold text-center mb-6">{isFrench ? 'Analyse de Longévité' : 'Longevity Analysis'}</h2>
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
                    return (
                      <div key={k} className={`impact-indicator ${val > 0 ? 'impact-positive' : val < 0 ? 'impact-negative' : 'impact-neutral'}`}>
                        <span className="capitalize">{k}</span>
                        <span className="font-bold">{val > 0 ? '+' : ''}{val.toFixed(1)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Facteurs avancés - UI */}
        {p1Valid && longevityMode === 'advanced' && (
          <div className="senior-card">
            <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              {isFrench ? 'Facteurs Personnalisés' : 'Personalized Factors'}
            </h2>

            <div className="mpr-form-row cols-2">
              {/* Person 1 */}
              <div className="space-y-3">
                <h5 className="font-semibold text-sm text-gray-700">{isFrench ? 'Personne 1' : 'Person 1'}</h5>

                <div className="senior-field-inline">
                  <label className="senior-form-label" htmlFor="p1-health">{isFrench ? 'État de santé' : 'Health status'}</label>
                  <select id="p1-health" className="senior-form-select" aria-label={isFrench ? 'État de santé personne 1' : 'Health status person 1'} value={personal.etatSante1 || ''} onChange={(e) => updateUserData('personal', { etatSante1: e.target.value })}>
                    <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                    <option value="excellent">Excellent</option>
                    <option value="tresbon">{isFrench ? 'Très bon' : 'Very good'}</option>
                    <option value="bon">{isFrench ? 'Bon' : 'Good'}</option>
                    <option value="moyen">{isFrench ? 'Moyen' : 'Fair'}</option>
                    <option value="fragile">{isFrench ? 'Fragile' : 'Poor'}</option>
                  </select>
                </div>

                <div className="senior-field-inline">
                  <label className="senior-form-label" htmlFor="p1-smoke">{isFrench ? 'Statut tabagique' : 'Smoking status'}</label>
                  <select id="p1-smoke" className="senior-form-select" aria-label={isFrench ? 'Statut tabagique personne 1' : 'Smoking status person 1'} value={personal.statutTabagique1 || ''} onChange={(e) => updateUserData('personal', { statutTabagique1: e.target.value })}>
                    <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                    <option value="jamais">{isFrench ? 'Jamais fumé' : 'Never smoked'}</option>
                    <option value="ancien">{isFrench ? 'Ex-fumeur' : 'Former smoker'}</option>
                    <option value="actuel">{isFrench ? 'Fumeur actuel' : 'Current smoker'}</option>
                  </select>
                </div>

                {personal.statutTabagique1 === 'ancien' && (
                  <div className="senior-field-inline">
                    <label className="senior-form-label" htmlFor="p1-quit">{isFrench ? 'Années depuis l\'arrêt' : 'Years since quitting'}</label>
                    <input id="p1-quit" className="senior-form-input" type="number" min={0} max={60} aria-label={isFrench ? 'Années depuis arrêt personne 1' : 'Years since quitting person 1'} value={personal.anneesArretTabac1 || 0} onChange={(e) => updateUserData('personal', { anneesArretTabac1: Number(e.target.value) })} />
                  </div>
                )}

                <div className="mpr-form-row cols-3">
                  <div className="senior-field-inline">
                    <label className="senior-form-label" htmlFor="p1-htn">Hypertension</label>
                    <select id="p1-htn" className="senior-form-select" aria-label={isFrench ? 'Hypertension personne 1' : 'Hypertension person 1'} value={personal.hypertension1 || ''} onChange={(e) => updateUserData('personal', { hypertension1: e.target.value })}>
                      <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                      <option value="aucune">{isFrench ? 'Aucune' : 'None'}</option>
                      <option value="detectee">{isFrench ? 'Détectée' : 'Detected'}</option>
                      <option value="traitement">{isFrench ? 'Traitement' : 'Treatment'}</option>
                      <option value="remission">{isFrench ? 'Rémission' : 'Remission'}</option>
                    </select>
                  </div>
                  <div className="senior-field-inline">
                    <label className="senior-form-label" htmlFor="p1-glu">{isFrench ? 'Glycémie/Diabète' : 'Glycemia/Diabetes'}</label>
                    <select id="p1-glu" className="senior-form-select" aria-label={isFrench ? 'Glycémie personne 1' : 'Glycemia person 1'} value={personal.glycemie1 || ''} onChange={(e) => updateUserData('personal', { glycemie1: e.target.value })}>
                      <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                      <option value="aucune">{isFrench ? 'Aucune' : 'None'}</option>
                      <option value="detectee">{isFrench ? 'Détectée' : 'Detected'}</option>
                      <option value="traitement">{isFrench ? 'Traitement' : 'Treatment'}</option>
                      <option value="remission">{isFrench ? 'Rémission' : 'Remission'}</option>
                    </select>
                  </div>
                  <div className="senior-field-inline">
                    <label className="senior-form-label" htmlFor="p1-chol">Cholestérol</label>
                    <select id="p1-chol" className="senior-form-select" aria-label={isFrench ? 'Cholestérol personne 1' : 'Cholesterol person 1'} value={personal.cholesterol1 || ''} onChange={(e) => updateUserData('personal', { cholesterol1: e.target.value })}>
                      <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                      <option value="aucune">{isFrench ? 'Aucune' : 'None'}</option>
                      <option value="detectee">{isFrench ? 'Détectée' : 'Detected'}</option>
                      <option value="traitement">{isFrench ? 'Traitement' : 'Treatment'}</option>
                      <option value="remission">{isFrench ? 'Rémission' : 'Remission'}</option>
                    </select>
                  </div>
                </div>

                <div className="mpr-form-row cols-3">
                  <div className="senior-field-inline">
                    <label className="senior-form-label" htmlFor="p1-hours">{isFrench ? 'Heures d\'exercice/semaine' : 'Exercise hours/week'}</label>
                    <input id="p1-hours" className="senior-form-input" type="number" min={0} max={40} aria-label={isFrench ? 'Heures exercice personne 1' : 'Exercise hours person 1'} value={personal.heuresExercice1 || 0} onChange={(e) => updateUserData('personal', { heuresExercice1: Number(e.target.value) })} />
                  </div>
                  <div className="senior-field-inline">
                    <label className="senior-form-label" htmlFor="p1-height">{isFrench ? 'Taille (cm)' : 'Height (cm)'}</label>
                    <input id="p1-height" className="senior-form-input" type="number" min={100} max={250} aria-label={isFrench ? 'Taille personne 1' : 'Height person 1'} value={personal.taille1 || 0} onChange={(e) => updateUserData('personal', { taille1: Number(e.target.value) })} />
                  </div>
                  <div className="senior-field-inline">
                    <label className="senior-form-label" htmlFor="p1-weight">{isFrench ? 'Poids (kg)' : 'Weight (kg)'}</label>
                    <input id="p1-weight" className="senior-form-input" type="number" min={30} max={300} aria-label={isFrench ? 'Poids personne 1' : 'Weight person 1'} value={personal.poids1 || 0} onChange={(e) => updateUserData('personal', { poids1: Number(e.target.value) })} />
                  </div>
                </div>

                {(personal.taille1 && personal.poids1) && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-semibold text-blue-900">
                      IMC : {calcBMI(personal.taille1, personal.poids1)?.toFixed(1)}
                    </div>
                  </div>
                )}

                <div className="senior-field-inline">
                  <label className="senior-form-label">{isFrench ? 'Sports pratiqués' : 'Sports practiced'}</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2" role="group" aria-label={isFrench ? 'Sports personne 1' : 'Sports person 1'}>
                    {sportsOptions.map(opt => {
                      const current = personal.sports1 || [];
                      const checked = current.includes(opt.value);
                      return (
                        <label key={opt.value} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            aria-label={opt.label}
                            checked={checked}
                            onChange={() => {
                              const next = checked ? current.filter(s => s !== opt.value) : [...current, opt.value];
                              updateUserData('personal', { sports1: next } as any);
                            }}
                          />
                          <span>{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Person 2 (optionnel - résumé) */}
              {p2HasData && (
                <div className="space-y-3">
                  <h5 className="font-semibold text-sm text-gray-700">{isFrench ? 'Personne 2' : 'Person 2'}</h5>

                  <div className="senior-field-inline">
                    <label className="senior-form-label" htmlFor="p2-health">{isFrench ? 'État de santé' : 'Health status'}</label>
                    <select id="p2-health" className="senior-form-select" aria-label={isFrench ? 'État de santé personne 2' : 'Health status person 2'} value={personal.etatSante2 || ''} onChange={(e) => updateUserData('personal', { etatSante2: e.target.value })}>
                      <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                      <option value="excellent">Excellent</option>
                      <option value="tresbon">{isFrench ? 'Très bon' : 'Very good'}</option>
                      <option value="bon">{isFrench ? 'Bon' : 'Good'}</option>
                      <option value="moyen">{isFrench ? 'Moyen' : 'Fair'}</option>
                      <option value="fragile">{isFrench ? 'Fragile' : 'Poor'}</option>
                    </select>
                  </div>

                  <div className="senior-field-inline">
                    <label className="senior-form-label" htmlFor="p2-smoke">{isFrench ? 'Statut tabagique' : 'Smoking status'}</label>
                    <select id="p2-smoke" className="senior-form-select" aria-label={isFrench ? 'Statut tabagique personne 2' : 'Smoking status person 2'} value={personal.statutTabagique2 || ''} onChange={(e) => updateUserData('personal', { statutTabagique2: e.target.value })}>
                      <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                      <option value="jamais">{isFrench ? 'Jamais fumé' : 'Never smoked'}</option>
                      <option value="ancien">{isFrench ? 'Ex-fumeur' : 'Former smoker'}</option>
                      <option value="actuel">{isFrench ? 'Fumeur actuel' : 'Current smoker'}</option>
                    </select>
                  </div>

                  <div className="mpr-form-row cols-3">
                    <div className="senior-field-inline">
                      <label className="senior-form-label" htmlFor="p2-htn">Hypertension</label>
                      <select id="p2-htn" className="senior-form-select" aria-label={isFrench ? 'Hypertension personne 2' : 'Hypertension person 2'} value={personal.hypertension2 || ''} onChange={(e) => updateUserData('personal', { hypertension2: e.target.value })}>
                        <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                        <option value="aucune">{isFrench ? 'Aucune' : 'None'}</option>
                        <option value="detectee">{isFrench ? 'Détectée' : 'Detected'}</option>
                        <option value="traitement">{isFrench ? 'Traitement' : 'Treatment'}</option>
                        <option value="remission">{isFrench ? 'Rémission' : 'Remission'}</option>
                      </select>
                    </div>
                    <div className="senior-field-inline">
                      <label className="senior-form-label" htmlFor="p2-glu">{isFrench ? 'Glycémie/Diabète' : 'Glycemia/Diabetes'}</label>
                      <select id="p2-glu" className="senior-form-select" aria-label={isFrench ? 'Glycémie personne 2' : 'Glycemia person 2'} value={personal.glycemie2 || ''} onChange={(e) => updateUserData('personal', { glycemie2: e.target.value })}>
                        <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                        <option value="aucune">{isFrench ? 'Aucune' : 'None'}</option>
                        <option value="detectee">{isFrench ? 'Détectée' : 'Detected'}</option>
                        <option value="traitement">{isFrench ? 'Traitement' : 'Treatment'}</option>
                        <option value="remission">{isFrench ? 'Rémission' : 'Remission'}</option>
                      </select>
                    </div>
                    <div className="senior-field-inline">
                      <label className="senior-form-label" htmlFor="p2-chol">Cholestérol</label>
                      <select id="p2-chol" className="senior-form-select" aria-label={isFrench ? 'Cholestérol personne 2' : 'Cholesterol person 2'} value={personal.cholesterol2 || ''} onChange={(e) => updateUserData('personal', { cholesterol2: e.target.value })}>
                        <option value="">{isFrench ? 'Sélectionner' : 'Select'}</option>
                        <option value="aucune">{isFrench ? 'Aucune' : 'None'}</option>
                        <option value="detectee">{isFrench ? 'Détectée' : 'Detected'}</option>
                        <option value="traitement">{isFrench ? 'Traitement' : 'Treatment'}</option>
                        <option value="remission">{isFrench ? 'Rémission' : 'Remission'}</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
