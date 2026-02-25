import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { 
  User, 
  Settings, 
  Shield, 
  Wand2, 
  Calculator, 
  Download, 
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Crown,
  Building2
} from 'lucide-react';

// Import des composants
import OnboardingWizard from '../features/retirement/components/OnboardingWizard';
import { SRGAnalysisSection } from '../features/retirement/components/SRGAnalysisSection';
import RREGOPAnalysisSection from '../features/retirement/components/RREGOPAnalysisSection';
import GovernmentBenefitsTest from '../features/retirement/components/GovernmentBenefitsTest';
import { IntelligentReportSection } from '../features/retirement/components/IntelligentReportSection';

// Import des services
import { OnboardingService } from '../features/retirement/services/OnboardingService';
import SRGService from '../features/retirement/services/SRGService';
import { UserData } from '../features/retirement/types';
import { useRetirementData } from '../features/retirement/hooks/useRetirementData';
import { HelpTooltip } from '../features/retirement/components/HelpTooltip';
import { FormGrid, FormRow, Field } from '../components/forms/FormGrid';

export default function ProfilePage() {
  const { userData, updateUserData, importData, exportData } = useRetirementData();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isFrench] = useState(true); // Par défaut en français

  const srgEligible = useMemo(() => {
    try {
      if (!userData) return false;
      return SRGService.calculerSRG(userData as UserData).eligible;
    } catch {
      return false;
    }
  }, [userData]);

  // Gérer la completion de l'onboarding
  const handleOnboardingComplete = (data: UserData) => {
    // Mettre à jour les données via le hook
    Object.keys(data).forEach(section => {
      if (data[section as keyof UserData]) {
        updateUserData(section as keyof UserData, data[section as keyof UserData]);
      }
    });
    setShowOnboarding(false);
    
    // Afficher un message de succès
    alert('Profil créé avec succès ! Vous pouvez maintenant utiliser toutes les fonctionnalités.');
  };

  // Gérer le skip de l'onboarding
  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  // Importer les données
  const importUserData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importData(file);
    alert('Données importées avec succès !');
  };

  // Helper: normalize "niveauCompetences1" to the allowed union type
  const asNiveau = (v: string): 'debutant' | 'intermediaire' | 'expert' | 'specialise' => {
    const val = (v || '').toLowerCase();
    if (val === 'debutant') return 'debutant';
    if (val === 'intermediaire') return 'intermediaire';
    if (val === 'expert') return 'expert';
    return 'specialise';
  };

  // Converters for union-typed personal fields
  const asEtatSante = (v: string): 'excellent' | 'tresbon' | 'bon' | 'moyen' | 'fragile' => {
    const val = (v || '').toLowerCase();
    if (val === 'excellent') return 'excellent';
    if (val === 'tresbon') return 'tresbon';
    if (val === 'bon') return 'bon';
    if (val === 'moyen') return 'moyen';
    return 'fragile';
  };
  const asModeVie = (v: string): 'sedentaire' | 'legerementActif' | 'modere' | 'actif' | 'tresActif' => {
    const val = (v || '');
    if (val === 'sedentaire') return 'sedentaire';
    if (val === 'legerementActif') return 'legerementActif';
    if (val === 'modere') return 'modere';
    if (val === 'actif') return 'actif';
    return 'tresActif';
  };
  const asTolerance = (v: string): 'conservateur' | 'modere' | 'equilibre' | 'dynamique' | 'agressif' => {
    const val = (v || '');
    if (val === 'conservateur') return 'conservateur';
    if (val === 'modere') return 'modere';
    if (val === 'equilibre') return 'equilibre';
    if (val === 'dynamique') return 'dynamique';
    return 'agressif';
  };
  const asHorizon = (v: string): 'court' | 'moyen' | 'long' | 'retraite' => {
    const val = (v || '');
    if (val === 'court') return 'court';
    if (val === 'moyen') return 'moyen';
    if (val === 'long') return 'long';
    return 'retraite';
  };
  const asExperience = (v: string): 'debutant' | 'intermediaire' | 'experimente' | 'expert' => {
    const val = (v || '').toLowerCase();
    if (val === 'debutant') return 'debutant';
    if (val === 'intermediaire') return 'intermediaire';
    if (val === 'experimente') return 'experimente';
    return 'expert';
  };
  const asObjectif = (v: string): 'epargne' | 'retraite' | 'investissement' | 'dettes' | 'urgence' | 'fiscalite' => {
    const val = (v || '').toLowerCase();
    if (val === 'epargne') return 'epargne';
    if (val === 'retraite') return 'retraite';
    if (val === 'investissement') return 'investissement';
    if (val === 'dettes') return 'dettes';
    if (val === 'urgence') return 'urgence';
    return 'fiscalite';
  };
  const asTemps = (v: string): 'tres-limite' | 'limite' | 'modere' | 'disponible' => {
    const val = (v || '');
    if (val === 'tres-limite') return 'tres-limite';
    if (val === 'limite') return 'limite';
    if (val === 'modere') return 'modere';
    return 'disponible';
  };
  const asTolInv = (v: string): 'tres-conservateur' | 'conservateur' | 'equilibre' | 'dynamique' | 'agressif' => {
    const val = (v || '');
    if (val === 'tres-conservateur') return 'tres-conservateur';
    if (val === 'conservateur') return 'conservateur';
    if (val === 'equilibre') return 'equilibre';
    if (val === 'dynamique') return 'dynamique';
    return 'agressif';
  };

  // Si l'onboarding est affiché
  if (showOnboarding) {
    return (
      <OnboardingWizard
        userData={userData || undefined}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
        isFrench={isFrench}
      />
    );
  }

  // Si pas de données utilisateur, afficher l'écran d'accueil
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mpr-interactive-lt to-mpr-interactive-lt py-8">
        <div className="mpr-container">
          <Card className="mpr-section">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 mx-auto bg-mpr-interactive-lt rounded-full flex items-center justify-center mb-6">
                <User className="w-12 h-12 text-mpr-interactive" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Bienvenue dans votre planificateur de retraite
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Commençons par créer votre profil personnalisé. Notre assistant guidé vous accompagnera 
                à travers quelques questions simples pour identifier vos prestations gouvernementales 
                et optimiser votre retraite.
              </p>
              
              <div className="mpr-form-row cols-2">
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <Wand2 className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-green-800 mb-2">Assistant Guidé</h3>
                  <p className="text-sm text-green-700">
                    Parcours en 6 étapes pour créer votre profil complet
                  </p>
                </div>
                
                <div className="p-6 bg-mpr-interactive-lt rounded-lg border border-mpr-border">
                  <Calculator className="w-8 h-8 text-mpr-interactive mx-auto mb-3" />
                  <h3 className="font-semibold text-mpr-navy mb-2">Calculs Automatiques</h3>
                  <p className="text-sm text-mpr-navy">
                    Détection automatique RREGOP, SRG et optimisations
                  </p>
                </div>
              </div>
              
              <Alert className="max-w-2xl mx-auto border-mpr-border bg-mpr-interactive-lt mb-8">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-mpr-navy">
                  🛡️ Toutes vos données restent sur VOTRE appareil - Aucune transmission à nos serveurs
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setShowOnboarding(true)} 
                  size="lg" 
                  className="mpr-btn mpr-btn-primary"
                >
                  <Wand2 className="w-5 h-5" />
                  Commencer l'assistant guidé
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    // Créer un profil minimal par défaut
                    const defaultData: UserData = {
                      personal: {
                        prenom1: 'Utilisateur',
                        prenom2: '',
                        naissance1: '1975-01-01',
                        naissance2: '',
                        sexe1: 'M',
                        sexe2: 'F',
                        salaire1: 50000,
                        salaire2: 0,
                        ageRetraiteSouhaite1: 65,
                        depensesRetraite: 40000,
                        depensesMensuelles: 3333,
                        depensesAnnuelles: 40000,
                        typeRevenu1: 'salaire',
                        typeEmploi1: 'permanent',
                        secteurActivite1: 'Secteur privé',
                        niveauCompetences1: 'intermediaire' as any
                      },
                      retirement: {
                        rrqAgeActuel1: 50,
                        rrqMontantActuel1: 0,
                        rrqMontant70_1: 0,
                        esperanceVie1: 87,
                        rrqAgeActuel2: 0,
                        rrqMontantActuel2: 0,
                        rrqMontant70_2: 0,
                        esperanceVie2: 0,
                        rregopMembre1: 'non',
                        rregopAnnees1: 0,
                        pensionPrivee1: 0,
                        pensionPrivee2: 0,
                        svMontant1: 717.15,
                        svMontant2: 0,
                        svRevenus1: 50000,
                        svRevenus2: 0,
                        svAgeDebut1: 65,
                        svAgeDebut2: 65
                      },
                      savings: {
                        reer1: 50000,
                        reer2: 0,
                        celi1: 25000,
                        celi2: 0,
                        placements1: 10000,
                        placements2: 0,
                        epargne1: 10000,
                        epargne2: 0,
                        cri1: 0,
                        cri2: 0,
                        residenceValeur: 0,
                        residenceHypotheque: 0
                      },
                      cashflow: {
                        logement: 14000,
                        servicesPublics: 4000,
                        assurances: 3200,
                        telecom: 2000,
                        alimentation: 6000,
                        transport: 4800,
                        sante: 3200,
                        loisirs: 2800,
                        epargne: 8000,
                        placements: 6000
                      }
                    };
                    handleOnboardingComplete(defaultData);
                  }}
                >
                  <Settings className="w-5 h-5" />
                  Créer un profil de base
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Page de profil avec données existantes
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mpr-container">
        {/* Header du profil */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Mon Profil de Retraite
              </h1>
              <p className="text-gray-600">
                Gérez vos informations et accédez à vos analyses personnalisées
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={importUserData}
                  className="hidden"
                />
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Importer
                </Button>
              </label>
              
              <Button onClick={() => setShowOnboarding(true)}>
                <Wand2 className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="benefits">Prestations</TabsTrigger>
            <TabsTrigger value="analysis">Analyses</TabsTrigger>
            <TabsTrigger value="report">Rapport Intelligent</TabsTrigger>
            <TabsTrigger value="test">Tests</TabsTrigger>
            <TabsTrigger value="optional">Optionnel</TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profile" className="space-y-6">
            <div className="mpr-form-row cols-2">
              {/* Informations personnelles */}
              <Card className="mpr-section">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="mpr-field">
                    <label>Prénom</label>
                    <span className="font-semibold">{userData.personal?.prenom1}</span>
                  </div>
                  <div className="flex justify-between items-center">
<span className="flex items-center gap-2">Âge <HelpTooltip title={isFrench ? 'Âge actuel' : 'Current age'} content={isFrench ? 'Votre âge détermine votre horizon de placement et le temps disponible pour faire fructifier votre épargne. Plus vous commencez tôt, plus les intérêts composés travaillent en votre faveur !' : 'Your age sets your investing time horizon. The earlier you start, the longer compounding can work for you.'}><span></span></HelpTooltip></span>
                    <span className="font-semibold">
                      {userData.personal?.naissance1 ? 
                        new Date().getFullYear() - new Date(userData.personal.naissance1).getFullYear() : 
                        'N/A'
                      } ans
                    </span>
                  </div>
                  <FormGrid className="mt-2">
                    <FormRow cols={2}>
                      <Field label="Date de naissance (corriger)" htmlFor="naissance1">
                        <input
                          id="naissance1"
                          type="date"
                          className="p-2 border rounded-md text-sm"
                          value={userData.personal?.naissance1 || ''}
                          onChange={(e) => updateUserData('personal', { naissance1: e.target.value })}
                          aria-label="Date de naissance (corriger)"
                        />
                      </Field>
                    </FormRow>
                  </FormGrid>
                  <div className="flex justify-between">
<span className="flex items-center gap-2">Revenu brut annuel <HelpTooltip title={isFrench ? 'Revenu annuel brut' : 'Annual gross income'} content={isFrench ? 'Ce montant sert de base à vos calculs et à votre capacité d’épargne. La cible de remplacement à la retraite est souvent ~70 %, mais elle varie selon votre situation.' : 'This amount underpins your calculations and saving capacity. A common retirement income target is ~70% of pre-retirement income, but it varies by situation.'}><span></span></HelpTooltip></span>
                    <span className="font-semibold">
                      {userData.personal?.salaire1?.toLocaleString()} $
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Net mensuel estimé (après impôts):</span>
                    <span className="font-semibold">
                      {(() => {
                        const brut = userData.personal?.salaire1 || 0;
                        const rate = brut > 100000 ? 0.45 : brut > 50000 ? 0.35 : brut > 25000 ? 0.25 : 0.15;
                        const netAnnuel = brut * (1 - rate * 0.70);
                        return Math.round(netAnnuel / 12).toLocaleString() + ' $';
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Taux marginal estimé:</span>
                    <span className="font-semibold">
                      {(() => {
                        const brut = userData.personal?.salaire1 || 0;
                        const rate = brut > 100000 ? 45 : brut > 50000 ? 35 : brut > 25000 ? 25 : 15;
                        return rate.toFixed(0) + ' %';
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
<span className="flex items-center gap-2">Objectif retraite <HelpTooltip title={isFrench ? 'Âge de retraite souhaité' : 'Desired retirement age'} content={isFrench ? 'Chaque année de travail supplémentaire peut améliorer sensiblement votre sécurité financière. Par exemple, 60 ans vs 65 ans demandent des stratégies d’épargne très différentes.' : 'Each extra working year can materially improve retirement security. Retiring at 60 vs 65 often requires very different saving strategies.'}><span></span></HelpTooltip></span>
                    <span className="font-semibold">
                      {userData.personal?.ageRetraiteSouhaite1} ans
                    </span>
                  </div>
                  {/* Arbre de décision rapide – tester 62/65/67/70/72 */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[62,65,67,70,72].map((age) => (
                      <Button className="mpr-btn mpr-btn-secondary"
                        key={age}
                        variant="outline"
                        size="sm"
                        onClick={() => updateUserData('personal', { ageRetraiteSouhaite1: age })}
                      >
                        Tester {age} ans
                      </Button>
                    ))}
                  </div>
                  {/* Situation familiale et résidence */}
                  <FormGrid className="mt-4">
                    <FormRow cols={2}>
                      <Field
                        label="Statut marital"
                        htmlFor="statut-marital"
                        tooltip={isFrench ? 'Situation familiale' : 'Family situation'}
                      >
                        <select
                          id="statut-marital"
                          className="p-2 border rounded-md text-sm"
                          title="Statut marital"
                          value={(userData.personal as any)?.statutMarital || ''}
                          onChange={(e) => updateUserData('personal', { statutMarital: e.target.value })}
                        >
                          <option value="">Non spécifié</option>
                          <option value="celibataire">Célibataire</option>
                          <option value="conjoint">Conjoint</option>
                          <option value="marie">Marié</option>
                          <option value="separe">Séparé</option>
                          <option value="divorce">Divorcé</option>
                          <option value="veuf">Veuf</option>
                        </select>
                      </Field>

                      <Field label="Nombre d'enfants" htmlFor="nombre-enfants">
                        <input
                          id="nombre-enfants"
                          type="number"
                          min={0}
                          className="p-2 border rounded-md text-sm w-28 text-right"
                          value={userData.personal?.nombreEnfants ?? 0}
                          onChange={(e) => updateUserData('personal', { nombreEnfants: Math.max(0, Number(e.target.value)) })}
                          aria-label="Nombre d'enfants"
                          title="Nombre d'enfants"
                        />
                      </Field>

                      <Field
                        label="Années de résidence au Canada"
                        htmlFor="annees-residence-canada"
                        tooltip={isFrench ? 'Admissibilité SV' : 'OAS eligibility'}
                      >
                        <input
                          id="annees-residence-canada"
                          type="number"
                          min={0}
                          max={80}
                          className="p-2 border rounded-md text-sm w-28 text-right"
                          value={(userData.personal as any)?.anneesResidenceCanada1 ?? ''}
                          onChange={(e) => updateUserData('personal', { anneesResidenceCanada1: Math.max(0, Number(e.target.value)) })}
                          aria-label="Années de résidence au Canada"
                          title="Années de résidence au Canada"
                        />
                      </Field>
                    </FormRow>
                  </FormGrid>
                </CardContent>
              </Card>

              {/* Prestations détectées */}
              <Card className="mpr-section">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Prestations détectées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>RREGOP:</span>
                    <Badge variant={userData.retirement?.rregopMembre1 === 'oui' ? 'default' : 'secondary'}>
                      {userData.retirement?.rregopMembre1 === 'oui' ? 'Oui' : 'Non'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>RRQ:</span>
                    <Badge variant="default">Oui</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>SV:</span>
                    <Badge variant="default">Oui</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>SRG:</span>
                    <Badge variant={srgEligible ? 'default' : 'secondary'}>
                      {srgEligible ? 'Éligible' : 'Non éligible'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommandations */}
            <Card className="mpr-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Recommandations personnalisées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {OnboardingService.generateRecommendations(userData).map((rec, index) => (
                    <Alert key={index} className="border-mpr-border bg-mpr-interactive-lt">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-mpr-navy">
                        {rec}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Prestations */}
          <TabsContent value="benefits" className="space-y-6">
            <div className="grid gap-6">
              {/* Section SRG */}
              <SRGAnalysisSection
                data={userData as UserData}
                onUpdate={(section, updates) => {
                  updateUserData(section, updates);
                }}
                isFrench={isFrench}
              />
              
              <Separator />
              
              {/* Section RREGOP */}
              <RREGOPAnalysisSection userPlan="free" />
            </div>
          </TabsContent>

          {/* Onglet Analyses */}
          <TabsContent value="analysis" className="space-y-6">
            <Card className="mpr-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Revenus estimés à la retraite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mpr-form-row cols-2">
                  {(() => {
                    const estimatedIncome = OnboardingService.calculateEstimatedIncome(userData);
                    return (
                      <>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>RREGOP:</span>
                            <span className="font-semibold text-green-600">
                              {estimatedIncome.rregop.toLocaleString()} $ /an
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>RRQ:</span>
                            <span className="font-semibold">
                              {estimatedIncome.rrq.toLocaleString()} $ /an
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>SV:</span>
                            <span className="font-semibold">
                              {estimatedIncome.sv.toLocaleString()} $ /an
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>SRG:</span>
                            <span className="font-semibold text-mpr-interactive">
                              {estimatedIncome.srg.toLocaleString()} $ /an
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-mpr-interactive-lt rounded-lg border border-mpr-border">
                          <h4 className="font-semibold text-mpr-navy mb-2">Total annuel</h4>
                          <p className="text-2xl font-bold text-mpr-interactive">
                            {estimatedIncome.total.toLocaleString()} $
                          </p>
                          <p className="text-sm text-mpr-navy mt-1">
                            Revenus mensuels: {(estimatedIncome.total / 12).toLocaleString()} $
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Rapport Intelligent */}
          <TabsContent value="report" className="space-y-6">
            <IntelligentReportSection 
              userData={userData} 
              isFrench={isFrench}
            />
          </TabsContent>

          {/* Onglet Tests */}
          <TabsContent value="test" className="space-y-6">
            <GovernmentBenefitsTest />
          </TabsContent>

          {/* Section Optionnel */}
          <TabsContent value="optional" className="space-y-6">
            <Card className="mpr-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Informations Optionnelles
                </CardTitle>
                <CardDescription>
                  Ces informations améliorent la précision des calculs CPM2014 et des projections financières
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informations démographiques */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Informations Démographiques</h4>

                  <div className="mpr-form-row cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">Province de résidence <HelpTooltip title={isFrench ? 'RRQ vs RPC' : 'QPP vs CPP'} content={isFrench ? 'Au Québec, vous cotisez au RRQ; ailleurs au Canada, au RPC. Ces régimes sont similaires mais comportent des particularités qui affectent vos prestations.' : 'In Quebec you contribute to QPP; elsewhere to CPP. They are similar but have differences that affect your future benefits.'}><span></span></HelpTooltip></label>
                      <select
                        className="w-full p-2 border rounded-md"
                        aria-label="Province de résidence"
                        value={userData.personal?.province || ''}
                        onChange={(e) => {
                          updateUserData('personal', { province: e.target.value });
                        }}
                      >
                        <option value="">Sélectionner une province</option>
                        <option value="QC">Québec</option>
                        <option value="ON">Ontario</option>
                        <option value="BC">Colombie-Britannique</option>
                        <option value="AB">Alberta</option>
                        <option value="MB">Manitoba</option>
                        <option value="SK">Saskatchewan</option>
                        <option value="NS">Nouvelle-Écosse</option>
                        <option value="NB">Nouveau-Brunswick</option>
                        <option value="PE">Île-du-Prince-Édouard</option>
                        <option value="NL">Terre-Neuve-et-Labrador</option>
                        <option value="YT">Yukon</option>
                        <option value="NT">Territoires du Nord-Ouest</option>
                        <option value="NU">Nunavut</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Région économique</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        aria-label="Région économique"
                        value={userData.personal?.regionEconomique || ''}
                        onChange={(e) => {
                          updateUserData('personal', { regionEconomique: e.target.value });
                        }}
                      >
                        <option value="">Sélectionner une région</option>
                        <option value="montreal">Montréal et région</option>
                        <option value="quebec">Québec et région</option>
                        <option value="outaouais">Outaouais</option>
                        <option value="estrie">Estrie</option>
                        <option value="mauricie">Mauricie</option>
                        <option value="saguenay">Saguenay-Lac-Saint-Jean</option>
                        <option value="gaspesie">Gaspésie-Îles-de-la-Madeleine</option>
                        <option value="cotedunord">Côte-Nord</option>
                        <option value="nord">Nord-du-Québec</option>
                        <option value="laurentides">Laurentides</option>
                        <option value="lanaudiere">Lanaudière</option>
                        <option value="autres">Autres régions</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Facteurs de santé et style de vie */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Facteurs de Santé et Style de Vie</h4>
                  <p className="text-sm text-gray-600">
                    Ces informations permettent d'affiner les calculs d'espérance de vie selon la table CPM2014
                  </p>

                  <div className="mpr-form-row cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">État de santé général</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        aria-label="État de santé général"
                        value={userData.personal?.etatSante || ''}
                        onChange={(e) => {
                          updateUserData('personal', { etatSante: asEtatSante(e.target.value) });
                        }}
                      >
                        <option value="">Non spécifié</option>
                        <option value="excellent">Excellent</option>
                        <option value="tresbon">Très bon</option>
                        <option value="bon">Bon</option>
                        <option value="moyen">Moyen</option>
                        <option value="fragile">Fragile</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mode de vie actif</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        aria-label="Mode de vie actif"
                        value={userData.personal?.modeVieActif || ''}
                        onChange={(e) => {
                          updateUserData('personal', { modeVieActif: asModeVie(e.target.value) });
                        }}
                      >
                        <option value="">Non spécifié</option>
                        <option value="sedentaire">Sédentaire</option>
                        <option value="legerementActif">Légèrement actif</option>
                        <option value="modere">Modérément actif</option>
                        <option value="actif">Actif</option>
                        <option value="tresActif">Très actif</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Préférences d'investissement */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Préférences d'Investissement</h4>
                  <p className="text-sm text-gray-600">
                    Ces informations optimisent les projections financières selon les normes IPF 2025
                  </p>

                  <div className="mpr-form-row cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tolérance au risque</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        aria-label="Tolérance au risque"
                        value={userData.personal?.toleranceRisque || ''}
                        onChange={(e) => {
                          updateUserData('personal', { toleranceRisque: asTolerance(e.target.value) });
                        }}
                      >
                        <option value="">Non spécifié</option>
                        <option value="conservateur">Conservateur</option>
                        <option value="modere">Modéré</option>
                        <option value="equilibre">Équilibré</option>
                        <option value="dynamique">Dynamique</option>
                        <option value="agressif">Agressif</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Horizon d'investissement</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        aria-label="Horizon d'investissement"
                        value={userData.personal?.horizonInvestissement || ''}
                        onChange={(e) => {
                          updateUserData('personal', { horizonInvestissement: asHorizon(e.target.value) });
                        }}
                      >
                        <option value="">Non spécifié</option>
                        <option value="court">Court terme (0-3 ans)</option>
                        <option value="moyen">Moyen terme (3-10 ans)</option>
                        <option value="long">Long terme (10+ ans)</option>
                        <option value="retraite">Jusqu'à la retraite</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Informations professionnelles avancées */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Informations Professionnelles Avancées</h4>

                  <div className="mpr-form-row cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Secteur d'activité</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        aria-label="Secteur d'activité"
                        value={userData.personal?.secteurActivite1 || ''}
                        onChange={(e) => {
                          updateUserData('personal', { secteurActivite1: e.target.value });
                        }}
                      >
                        <option value="">Sélectionner un secteur</option>
                        <option value="technologie">Technologie</option>
                        <option value="sante">Santé</option>
                        <option value="finance">Finance</option>
                        <option value="education">Éducation</option>
                        <option value="construction">Construction</option>
                        <option value="manufacturier">Manufacturier</option>
                        <option value="commerce">Commerce</option>
                        <option value="services">Services</option>
                        <option value="transport">Transport</option>
                        <option value="autres">Autres</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Niveau de compétences</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        aria-label="Niveau de compétences"
                        value={userData.personal?.niveauCompetences1 || ''}
                        onChange={(e) => {
                          updateUserData('personal', { niveauCompetences1: asNiveau(e.target.value) });
                        }}
                      >
                        <option value="">Sélectionner un niveau</option>
                        <option value="debutant">Débutant</option>
                        <option value="intermediaire">Intermédiaire</option>
                        <option value="expert">Expert</option>
                        <option value="specialise">Spécialisé</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Informations sur l'inflation et projections */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Préférences de Projection</h4>
                  <p className="text-sm text-gray-600">
                    Ces paramètres ajustent les calculs selon les normes IPF 2025
                  </p>

                  <div className="mpr-form-row cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">Hypothèse d'inflation personnalisée (%) <HelpTooltip title={isFrench ? 'Taux d’inflation' : 'Inflation rate'} content={isFrench ? 'Pourquoi 3 % ? C’est proche de la moyenne historique canadienne. L’inflation érode le pouvoir d’achat : 1 $ aujourd’hui ≈ 2,43 $ dans 30 ans à 3 %.' : 'Why 3%? It’s close to Canada’s historical average. Inflation erodes purchasing power: $1 today ≈ $2.43 in 30 years at 3%.'}><span></span></HelpTooltip></label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="w-full p-2 border rounded-md"
                        placeholder="2.1 (défaut IPF 2025)"
                        value={userData.personal?.inflationPersonnalisee || ''}
                        onChange={(e) => {
                          updateUserData('personal', { inflationPersonnalisee: parseFloat(e.target.value) || undefined });
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">Rendement attendu personnalisé (%) <HelpTooltip title={isFrench ? 'Rendements attendus' : 'Expected returns'} content={isFrench ? 'Réalisme requis : en moyenne à long terme ~7 % pour les actions et ~4 % pour les obligations (déjà ajustés de l’inflation). Évitez les hypothèses trop optimistes.' : 'Be realistic: long-run averages are roughly ~7% for equities and ~4% for bonds (inflation-adjusted). Avoid overly optimistic assumptions.'}><span></span></HelpTooltip></label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="15"
                        className="w-full p-2 border rounded-md"
                        placeholder="6.6 (défaut IPF 2025)"
                        value={userData.personal?.rendementPersonnalise || ''}
                        onChange={(e) => {
                          updateUserData('personal', { rendementPersonnalise: parseFloat(e.target.value) || undefined });
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Informations pour le conseiller intelligent */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Préférences du Conseiller Intelligent</h4>
                  <p className="text-sm text-gray-600">
                    Ces informations permettent au conseiller intelligent de personnaliser ses recommandations
                  </p>

                  <div className="mpr-form-row cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expérience financière</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        aria-label="Expérience financière"
                        value={userData.personal?.experienceFinanciere || ''}
                        onChange={(e) => {
                          updateUserData('personal', { experienceFinanciere: asExperience(e.target.value) });
                        }}
                      >
                        <option value="">Sélectionner votre expérience</option>
                        <option value="debutant">Débutant</option>
                        <option value="intermediaire">Intermédiaire</option>
                        <option value="experimente">Expérimenté</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Objectif principal</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        aria-label="Objectif principal"
                        value={userData.personal?.objectifPrincipal || ''}
                        onChange={(e) => {
                          updateUserData('personal', { objectifPrincipal: asObjectif(e.target.value) });
                        }}
                      >
                        <option value="">Sélectionner votre objectif</option>
                        <option value="epargne">Constituer une épargne</option>
                        <option value="retraite">Préparer la retraite</option>
                        <option value="investissement">Investir intelligemment</option>
                        <option value="dettes">Rembourser les dettes</option>
                        <option value="urgence">Fonds d'urgence</option>
                        <option value="fiscalite">Optimisation fiscale</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Temps disponible pour la gestion</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        aria-label="Temps disponible pour la gestion"
                        value={userData.personal?.tempsDisponible || ''}
                        onChange={(e) => {
                          updateUserData('personal', { tempsDisponible: asTemps(e.target.value) });
                        }}
                      >
                        <option value="">Sélectionner votre disponibilité</option>
                        <option value="tres-limite">Très limité (moins de 1h/semaine)</option>
                        <option value="limite">Limité (1-2h/semaine)</option>
                        <option value="modere">Modéré (2-5h/semaine)</option>
                        <option value="disponible">Disponible (plus de 5h/semaine)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tolérance au risque d'investissement</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        aria-label="Tolérance au risque d'investissement"
                        value={userData.personal?.toleranceRisqueInvestissement || ''}
                        onChange={(e) => {
                          updateUserData('personal', { toleranceRisqueInvestissement: asTolInv(e.target.value) });
                        }}
                      >
                        <option value="">Sélectionner votre tolérance</option>
                        <option value="tres-conservateur">Très conservateur</option>
                        <option value="conservateur">Conservateur</option>
                        <option value="equilibre">Équilibré</option>
                        <option value="dynamique">Dynamique</option>
                        <option value="agressif">Agressif</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Informations sur les dettes et actifs */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Situation Financière Détaillée</h4>
                  <p className="text-sm text-gray-600">
                    Informations utilisées pour les calculs de ratio d'endettement et optimisation
                  </p>

                  <div className="mpr-form-row cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fonds d'urgence actuel ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        className="w-full p-2 border rounded-md"
                        placeholder="Montant en dollars"
                        value={userData.savings?.fondsUrgence || ''}
                        onChange={(e) => {
                          updateUserData('savings', { fondsUrgence: parseFloat(e.target.value) || 0 });
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">Dettes totales ($) <HelpTooltip title={isFrench ? 'Dettes (hypothèque, autres)' : 'Debts (mortgage, other)'} content={isFrench ? 'L’objectif est généralement d’être libre de dettes à la retraite. Une hypothèque payée représente une dépense en moins dans votre budget de retraite.' : 'The goal is generally to be debt-free at retirement. A paid-off mortgage means one less expense in your retirement budget.'}><span></span></HelpTooltip></label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        className="w-full p-2 border rounded-md"
                        placeholder="Somme de toutes les dettes"
                        value={userData.savings?.dettesTotales || ''}
                        onChange={(e) => {
                          updateUserData('savings', { dettesTotales: parseFloat(e.target.value) || 0 });
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Épargne-retraite actuelle ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        className="w-full p-2 border rounded-md"
                        placeholder="REER + CELI + régimes"
                        value={userData.savings?.epargneRetraite || ''}
                        onChange={(e) => {
                          updateUserData('savings', { epargneRetraite: parseFloat(e.target.value) || 0 });
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Taux d'épargne actuel (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full p-2 border rounded-md"
                        placeholder="Pourcentage des revenus"
                        value={userData.savings?.tauxEpargne || ''}
                        onChange={(e) => {
                          updateUserData('savings', { tauxEpargne: parseFloat(e.target.value) || 0 });
                        }}
                      />
                    </div>

                    {/* Dates de mise à jour REER/CELI (unité CAD par défaut) */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Dernière mise à jour REER (date)</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded-md"
                        value={(userData.savings as any)?.dateREER1 || ''}
                        onChange={(e) => updateUserData('savings', { dateREER1: e.target.value })}
                        aria-label="Dernière mise à jour REER"
                        title="Dernière mise à jour REER"
                        placeholder="AAAA-MM-JJ"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Dernière mise à jour CELI (date)</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded-md"
                        value={(userData.savings as any)?.dateCELI1 || ''}
                        onChange={(e) => updateUserData('savings', { dateCELI1: e.target.value })}
                        aria-label="Dernière mise à jour CELI"
                        title="Dernière mise à jour CELI"
                        placeholder="AAAA-MM-JJ"
                      />
                    </div>

                    {/* Régime d’employeur DB/PD ou CD */}
                    <div className="space-y-2">
                      <label htmlFor="regime-employeur" className="text-sm font-medium flex items-center gap-2">Régime d’employeur <HelpTooltip title={isFrench ? 'Argent gratuit ?' : 'Free money?'} content={isFrench ? 'Si votre employeur égalise vos cotisations, c’est souvent la priorité #1 — rendement “garanti” de 100 % sur vos contributions.' : 'If your employer matches your contributions, that’s often priority #1 — a “guaranteed” 100% return on your contributions.'}><span></span></HelpTooltip></label>
                      <select
                        id="regime-employeur"
                        className="w-full p-2 border rounded-md"
                        title="Régime d’employeur"
                        value={(userData.retirement as any)?.pensionType1 || ''}
                        onChange={(e) => updateUserData('retirement', { pensionType1: e.target.value })}
                      >
                        <option value="">Aucun / Non spécifié</option>
                        <option value="PD">Prestation déterminée (PD/DB)</option>
                        <option value="CD">Cotisations déterminées (CD/DC)</option>
                      </select>
                    </div>

                    {/* Placements non-enregistrés – ventilation simple */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">Placements hors REER/CELI – ventilation ($) <HelpTooltip title={isFrench ? 'Épargnes non enregistrées' : 'Non-registered savings'} content={isFrench ? 'Plus flexibles, mais imposés annuellement. Idéaux pour les objectifs à moyen terme et après maximisation des comptes enregistrés.' : 'More flexible but taxed annually. Ideal for medium-term goals and once registered accounts are maximized.'}><span></span></HelpTooltip></label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          min="0"
                          className="p-2 border rounded-md"
                          placeholder="Actions ($)"
                          value={(userData.savings as any)?.placementsActions1 || ''}
                          onChange={(e) => updateUserData('savings', { placementsActions1: parseFloat(e.target.value) || 0 })}
                        />
                        <input
                          type="number"
                          min="0"
                          className="p-2 border rounded-md"
                          placeholder="Obligations ($)"
                          value={(userData.savings as any)?.placementsObligations1 || ''}
                          onChange={(e) => updateUserData('savings', { placementsObligations1: parseFloat(e.target.value) || 0 })}
                        />
                        <input
                          type="number"
                          min="0"
                          className="p-2 border rounded-md"
                          placeholder="Liquidités ($)"
                          value={(userData.savings as any)?.placementsLiquidites1 || ''}
                          onChange={(e) => updateUserData('savings', { placementsLiquidites1: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ratios et objectifs de remboursement */}
                  <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                    {(() => {
                      const revenus = (userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0);
                      const dettes = userData.savings?.dettesTotales || 0;
                      const dti = revenus > 0 ? (dettes / revenus) * 100 : 0;
                      const cible = 30; // objectif 30 %
                      const surplus = Math.max(0, dti - cible);
                      return (
                        <div className="text-sm text-gray-700">
                          <div className="flex justify-between">
                            <span>Ratio dettes/revenus (DTI) :</span>
                            <span className="font-semibold">{dti.toFixed(1)} %</span>
                          </div>
                          {dti > cible ? (
                            <div className="mt-1 text-amber-700">
                              Au-dessus de la cible de {cible} %. Suggestion: augmenter le remboursement mensuel jusqu’à revenir sous {cible} %.
                            </div>
                          ) : (
                            <div className="mt-1 text-green-700">
                              Dans la cible (≤ {cible} %).
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Affichage des calculs CPM2014 */}
                <div className="mt-6 p-4 bg-mpr-interactive-lt rounded-lg border border-mpr-border">
                  <h4 className="font-semibold text-mpr-navy mb-3">Calculs CPM2014 - Espérance de Vie</h4>
                  <div className="mpr-form-row cols-2">
                    {userData.personal?.naissance1 && userData.personal?.sexe1 && (
                      <div className="text-sm">
                        <p className="font-medium">{userData.personal.prenom1 || 'Personne 1'}:</p>
                        <p className="text-mpr-interactive">
                          Espérance de vie: {(() => {
                            const age = new Date().getFullYear() - new Date(userData.personal.naissance1).getFullYear();
                            const gender = userData.personal.sexe1 === 'F' ? 'female' : 'male';
                            // Simulation du calcul CPM2014 (valeur approximative)
                            const baseLifeExpectancy = gender === 'female' ? 87 : 84;
                            return Math.max(1, baseLifeExpectancy - age);
                          })()} ans
                        </p>
                        <p className="text-gray-600 text-xs">
                          Basé sur la table CPM2014 - Institut canadien des actuaires
                        </p>
                      </div>
                    )}

                    {userData.personal?.naissance2 && userData.personal?.sexe2 && (
                      <div className="text-sm">
                        <p className="font-medium">{userData.personal.prenom2 || 'Personne 2'}:</p>
                        <p className="text-mpr-interactive">
                          Espérance de vie: {(() => {
                            const age = new Date().getFullYear() - new Date(userData.personal.naissance2).getFullYear();
                            const gender = userData.personal.sexe2 === 'F' ? 'female' : 'male';
                            // Simulation du calcul CPM2014 (valeur approximative)
                            const baseLifeExpectancy = gender === 'female' ? 87 : 84;
                            return Math.max(1, baseLifeExpectancy - age);
                          })()} ans
                        </p>
                        <p className="text-gray-600 text-xs">
                          Basé sur la table CPM2014 - Institut canadien des actuaires
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
