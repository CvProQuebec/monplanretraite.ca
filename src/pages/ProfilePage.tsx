import React, { useState, useEffect } from 'react';
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
import { OnboardingWizard } from '../features/retirement/components/OnboardingWizard';
import { SRGAnalysisSection } from '../features/retirement/components/SRGAnalysisSection';
import { RREGOPAnalysisSection } from '../features/retirement/components/RREGOPAnalysisSection';
import { GovernmentBenefitsTest } from '../features/retirement/components/GovernmentBenefitsTest';
import { IntelligentReportSection } from '../features/retirement/components/IntelligentReportSection';

// Import des services
import { OnboardingService } from '../features/retirement/services/OnboardingService';
import { UserData } from '../features/retirement/types';

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isFrench] = useState(true); // Par défaut en français

  // Charger les données utilisateur depuis le localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      try {
        setUserData(JSON.parse(savedData));
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, []);

  // Sauvegarder les données utilisateur
  const saveUserData = (data: UserData) => {
    try {
      localStorage.setItem('userData', JSON.stringify(data));
      setUserData(data);
      setShowOnboarding(false);
      
      // Afficher un message de succès
      alert('Profil créé avec succès ! Vous pouvez maintenant utiliser toutes les fonctionnalités.');
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  // Gérer la completion de l'onboarding
  const handleOnboardingComplete = (data: UserData) => {
    saveUserData(data);
  };

  // Gérer le skip de l'onboarding
  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  // Exporter les données
  const exportUserData = () => {
    if (!userData) return;
    
    try {
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `profil_retraite_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export. Veuillez réessayer.');
    }
  };

  // Importer les données
  const importUserData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setUserData(data);
        localStorage.setItem('userData', JSON.stringify(data));
        alert('Données importées avec succès !');
      } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        alert('Fichier invalide. Veuillez vérifier le format.');
      }
    };
    reader.readAsText(file);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Bienvenue dans votre planificateur de retraite
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Commençons par créer votre profil personnalisé. Notre assistant guidé vous accompagnera 
                à travers quelques questions simples pour identifier vos prestations gouvernementales 
                et optimiser votre retraite.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <Wand2 className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-green-800 mb-2">Assistant Guidé</h3>
                  <p className="text-sm text-green-700">
                    Parcours en 6 étapes pour créer votre profil complet
                  </p>
                </div>
                
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-blue-800 mb-2">Calculs Automatiques</h3>
                  <p className="text-sm text-blue-700">
                    Détection automatique RREGOP, SRG et optimisations
                  </p>
                </div>
              </div>
              
              <Alert className="max-w-2xl mx-auto border-blue-200 bg-blue-50 mb-8">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-blue-800">
                  🛡️ Toutes vos données restent sur VOTRE appareil - Aucune transmission à nos serveurs
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setShowOnboarding(true)} 
                  size="lg" 
                  className="flex items-center gap-2"
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
                        niveauCompetences1: 'intermediaire'
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
                    saveUserData(defaultData);
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
      <div className="container mx-auto px-4 max-w-6xl">
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
              <Button variant="outline" onClick={exportUserData}>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="benefits">Prestations</TabsTrigger>
            <TabsTrigger value="analysis">Analyses</TabsTrigger>
            <TabsTrigger value="report">Rapport Intelligent</TabsTrigger>
            <TabsTrigger value="test">Tests</TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Prénom:</span>
                    <span className="font-semibold">{userData.personal?.prenom1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Âge:</span>
                    <span className="font-semibold">
                      {userData.personal?.naissance1 ? 
                        new Date().getFullYear() - new Date(userData.personal.naissance1).getFullYear() : 
                        'N/A'
                      } ans
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Salaire:</span>
                    <span className="font-semibold">
                      {userData.personal?.salaire1?.toLocaleString()} $
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Objectif retraite:</span>
                    <span className="font-semibold">
                      {userData.personal?.ageRetraiteSouhaite1} ans
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Prestations détectées */}
              <Card>
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
                    <Badge variant={userData.retirement?.srgEligibilite1 ? 'default' : 'secondary'}>
                      {userData.retirement?.srgEligibilite1 ? 'Éligible' : 'Non éligible'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommandations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Recommandations personnalisées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {OnboardingService.generateRecommendations(userData).map((rec, index) => (
                    <Alert key={index} className="border-blue-200 bg-blue-50">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-blue-800">
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
              <SRGAnalysisSection userData={userData} />
              
              <Separator />
              
              {/* Section RREGOP */}
              <RREGOPAnalysisSection userData={userData} />
            </div>
          </TabsContent>

          {/* Onglet Analyses */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Revenus estimés à la retraite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
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
                            <span className="font-semibold text-blue-600">
                              {estimatedIncome.srg.toLocaleString()} $ /an
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Total annuel</h4>
                          <p className="text-2xl font-bold text-blue-600">
                            {estimatedIncome.total.toLocaleString()} $
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
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
        </Tabs>
      </div>
    </div>
  );
}
