import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DateInput from '@/components/ui/DateInput';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import SVBiannualManager from '@/components/ui/SVBiannualManager';
import { 
  DollarSign, 
  Info, 
  HelpCircle, 
  Calendar, 
  Target, 
  Briefcase, 
  TrendingUp, 
  Save,
  Star,
  Clock,
  Shield,
  AlertTriangle,
  Users,
  Calculator,
  Flag,
  Expand,
  Minimize2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import MoneyInput from '@/components/ui/MoneyInput';
import ReturnCalculator from '@/components/ui/ReturnCalculator';
import RRQInfoCard from '@/components/ui/RRQInfoCard';
import UnifiedIncomeTable from '@/components/ui/UnifiedIncomeTable';
import SeniorsFriendlyIncomeTable from '@/components/ui/SeniorsFriendlyIncomeTable';
import SeniorsFinancialHelp from '@/components/ui/SeniorsFinancialHelp';
import SeasonalJobsManager from '@/components/ui/SeasonalJobsManager';
import BenefitsTable from '@/components/ui/BenefitsTable';
import InvestmentsTable from '@/components/ui/InvestmentsTable';
import GlobalSummary from '@/components/ui/GlobalSummary';
import CollapsibleSection from '@/components/ui/CollapsibleSection';
import SeasonalWorkToggle from '@/components/ui/SeasonalWorkToggle';
import RRQManager from '@/components/ui/RRQManager';
import { EnhancedSaveManager } from '@/services/EnhancedSaveManager';

// Import des corrections mobile pour Samsung S23 Ultra
import '@/styles/mobile-reflow-fix.css';
import { useMobileReflowFix } from '@/hooks/useMobileReflowFix';

const Revenus: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';
  
  // Hook pour les données de retraite
  const { userData, updateUserData } = useRetirementData();
  
  // Log pour déboguer le chargement des données
  useEffect(() => {
    console.log('🔍 Revenus - Données chargées:', userData);
    console.log('🔍 Revenus - unifiedIncome1:', (userData.personal as any)?.unifiedIncome1);
    console.log('🔍 Revenus - unifiedIncome2:', (userData.personal as any)?.unifiedIncome2);
    
    // Vérifier localStorage directement
    const localStorageData = localStorage.getItem('retirement_data');
    if (localStorageData) {
      const parsed = JSON.parse(localStorageData);
      console.log('🔍 Revenus - Données dans localStorage:', parsed);
      console.log('🔍 Revenus - unifiedIncome1 dans localStorage:', parsed.personal?.unifiedIncome1);
      console.log('🔍 Revenus - unifiedIncome2 dans localStorage:', parsed.personal?.unifiedIncome2);
    } else {
      console.log('❌ Revenus - Aucune donnée dans localStorage');
    }
  }, [userData]);
  
  const [showHelp, setShowHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showRRQInfo, setShowRRQInfo] = useState(false);
  
  // États pour les sections collapsibles
  const [isRevenusCollapsed, setIsRevenusCollapsed] = useState(false);
  const [isPrestationsCollapsed, setIsPrestationsCollapsed] = useState(false);
  const [isInvestissementsCollapsed, setIsInvestissementsCollapsed] = useState(false);
  const [isAllExpanded, setIsAllExpanded] = useState(true);

  // Correction du reflow mobile pour Samsung S23 Ultra
  useMobileReflowFix();

  // Debug pour les données SV
  useEffect(() => {
    console.log('🔍 DEBUG SV - userData.retirement:', userData.retirement);
    console.log('🔍 DEBUG SV - svBiannual1:', userData.retirement?.svBiannual1);
    console.log('🔍 DEBUG SV - svBiannual2:', userData.retirement?.svBiannual2);
  }, [userData.retirement]);

  const handleChange = (field: string, value: any) => {
    updateUserData('personal', { [field]: value });
  };

  const handleRetirementChange = (field: string, value: any) => {
    updateUserData('retirement', { [field]: value });
  };

  const handleNotesChange = (field: string, value: string) => {
    // BYPASS sanitization completely for notes fields to preserve spaces and natural typing
    updateUserData('personal', { [field]: value });
  };

  const handleSalaryChange = (person: '1' | '2', value: number) => {
    handleChange(`salaire${person}`, value);
  };

  // Fonctions pour gérer l'expansion/réduction des sections
  const toggleAllSections = () => {
    const newState = !isAllExpanded;
    setIsAllExpanded(newState);
    setIsRevenusCollapsed(!newState);
    setIsPrestationsCollapsed(!newState);
    setIsInvestissementsCollapsed(!newState);
  };



  // Types de revenus disponibles avec métadonnées
  const typesRevenu = [
    { 
      value: 'salaire', 
      label: isFrench ? 'Salaire' : 'Salary',
      frequency: 'annual',
      temporary: false,
      needsEmploymentType: true
    },
    { 
      value: 'assurance-emploi', 
      label: isFrench ? 'Assurance emploi' : 'Employment Insurance',
      frequency: 'weekly',
      temporary: true,
      needsEmploymentType: false,
      maxDuration: 45 // semaines maximum
    },
    { 
      value: 'rentes', 
      label: isFrench ? 'Rentes' : 'Pensions',
      frequency: 'monthly',
      temporary: false,
      needsEmploymentType: false
    },
    { 
      value: 'dividendes', 
      label: isFrench ? 'Dividendes' : 'Dividends',
      frequency: 'annual',
      temporary: false,
      needsEmploymentType: false
    },
    { 
      value: 'revenus-location', 
      label: isFrench ? 'Revenus de location' : 'Rental Income',
      frequency: 'monthly',
      temporary: false,
      needsEmploymentType: false
    },
    { 
      value: 'travail-autonome', 
      label: isFrench ? 'Travail autonome' : 'Self-Employment',
      frequency: 'annual',
      temporary: false,
      needsEmploymentType: false
    },
    { 
      value: 'autres', 
      label: isFrench ? 'Autres' : 'Other',
      frequency: 'annual',
      temporary: false,
      needsEmploymentType: false
    }
  ];

  // Types d'emploi disponibles (pour salaires uniquement)
  const typesEmploi = [
    { value: 'permanent', label: isFrench ? 'Permanent' : 'Permanent' },
    { value: 'partiel', label: isFrench ? 'Temps partiel' : 'Part-time' },
    { value: 'contrat', label: isFrench ? 'Contrat' : 'Contract' },
    { value: 'saisonnier', label: isFrench ? 'Saisonnier' : 'Seasonal' },
    { value: 'autonome', label: isFrench ? 'Travailleur autonome' : 'Self-employed' }
  ];

  // Fréquences de paiement
  const frequencesPaiement = [
    { value: 'weekly', label: isFrench ? 'Hebdomadaire' : 'Weekly' },
    { value: 'biweekly', label: isFrench ? 'Aux 2 semaines' : 'Bi-weekly' },
    { value: 'monthly', label: isFrench ? 'Mensuel' : 'Monthly' },
    { value: 'quarterly', label: isFrench ? 'Trimestriel' : 'Quarterly' },
    { value: 'annual', label: isFrench ? 'Annuel' : 'Annual' }
  ];

  // Fonction pour obtenir les métadonnées d'un type de revenu
  const getRevenueTypeMetadata = (typeRevenu: string) => {
    return typesRevenu.find(type => type.value === typeRevenu) || typesRevenu[0];
  };

  // Fonction pour calculer le montant annuel selon la fréquence
  const calculateAnnualAmount = (amount: number, frequency: string) => {
    const multipliers = {
      weekly: 52,
      biweekly: 26,
      monthly: 12,
      quarterly: 4,
      annual: 1
    };
    return amount * (multipliers[frequency as keyof typeof multipliers] || 1);
  };

  // Fonction pour générer des suggestions de planification
  const generatePlanningAdvice = (person: '1' | '2') => {
    const typeRevenu = userData.personal?.[`typeRevenu${person}` as keyof typeof userData.personal] as string;
    const dateFin = userData.personal?.[`dateFinRevenu${person}` as keyof typeof userData.personal] as string;
    const metadata = getRevenueTypeMetadata(typeRevenu);
    
    if (metadata.temporary && dateFin) {
      const endDate = new Date(dateFin);
      const today = new Date();
      const daysUntilEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilEnd > 0 && daysUntilEnd <= 365) {
        return {
          type: 'transition',
          message: isFrench 
            ? `Votre ${metadata.label.toLowerCase()} se termine dans ${daysUntilEnd} jours. Considérez demander votre RRQ le ${new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('fr-CA')}.`
            : `Your ${metadata.label.toLowerCase()} ends in ${daysUntilEnd} days. Consider applying for CPP on ${new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-CA')}.`,
          urgency: daysUntilEnd <= 90 ? 'high' : 'medium'
        };
      }
    }
    
    return null;
  };

  // Statuts professionnels
  const statutsProfessionnels = [
    { value: 'actif', label: isFrench ? 'Actif' : 'Active' },
    { value: 'sans-emploi', label: isFrench ? 'Sans emploi' : 'Unemployed' },
    { value: 'retraite', label: isFrench ? 'À la retraite' : 'Retired' },
    { value: 'conge-maladie', label: isFrench ? 'Congé maladie' : 'Sick Leave' },
    { value: 'conge-parental', label: isFrench ? 'Congé parental' : 'Parental Leave' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 mobile-reflow-fix revenus-page revenus-container">
      <div className="container mx-auto px-6 py-8 mobile-reflow-fix">
        {/* En-tête simple */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            {isFrench ? '💰 Mes revenus' : '💰 My Income'}
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {isFrench 
              ? 'Gérez vos sources de revenus pour optimiser votre planification de retraite'
              : 'Manage your income sources to optimize your retirement planning'
            }
          </p>

          {/* Lien rapide vers le module Budget (onglet revenus) */}
          <div className="mt-6">
            <Button
              onClick={() => navigate(isFrench ? '/mon-budget?tab=income' : '/my-budget?tab=income')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              {isFrench ? 'Voir dans le budget' : 'View in budget'}
            </Button>
          </div>
        </div>



        {/* Message d'aide */}
        {showHelp && (
          <Alert className="border-green-400 bg-green-900/20 text-green-200 mb-8">
            <Info className="h-5 w-5 text-green-400" />
            <AlertDescription className="text-lg">
              <strong>{isFrench ? 'Conseils :' : 'Tips:'}</strong> {
                isFrench 
                  ? 'Renseignez toutes vos sources de revenus pour une planification précise. Ces informations sont cruciales pour les calculs de retraite et remplacent les informations de salaire du profil.'
                  : 'Fill in all your income sources for accurate planning. This information is crucial for retirement calculations and replaces the salary information from the profile.'
              }
            </AlertDescription>
          </Alert>
        )}


        {/* Section Information RRQ - Affichée quand pertinent */}
        {(() => {
          // Logique pour déterminer quand afficher les informations RRQ
          const shouldShowRRQInfo = 
            // Si quelqu'un planifie sa retraite
            userData.personal?.statutProfessionnel1 === 'retraite' ||
            userData.personal?.statutProfessionnel2 === 'retraite' ||
            // Si quelqu'un reçoit de l'assurance emploi (transition vers retraite)
            (userData.personal as any)?.typeRevenu1 === 'assurance-emploi' ||
            (userData.personal as any)?.typeRevenu2 === 'assurance-emploi' ||
            // Si quelqu'un a plus de 60 ans (approche de la retraite)
            (userData.personal?.naissance1 && new Date().getFullYear() - new Date(userData.personal.naissance1).getFullYear() >= 60) ||
            (userData.personal?.naissance2 && new Date().getFullYear() - new Date(userData.personal.naissance2).getFullYear() >= 60) ||
            // Si l'utilisateur a explicitement demandé à voir l'info
            showRRQInfo;

          if (!shouldShowRRQInfo) return null;

          return (
            <div className="mb-12">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4">
                  <h2 className="text-3xl font-bold text-blue-300 mb-4 flex items-center justify-center gap-3">
                    <Shield className="w-8 h-8 text-blue-400" />
                    {isFrench ? 'Information Importante - RRQ' : 'Important Information - QPP'}
                  </h2>
                  {!showRRQInfo && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRRQInfo(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </Button>
                  )}
                </div>
                <p className="text-blue-200 text-lg">
                  {isFrench 
                    ? 'Délais et procédures pour votre demande de rente sans carence'
                    : 'Deadlines and procedures for your pension application without gaps'
                  }
                </p>
              </div>
              
            </div>
          );
        })()}

        {/* Résumé Global */}
        <GlobalSummary userData={userData} isFrench={isFrench} />

        {/* Bouton Tout développer/réduire */}
        <div className="text-center mb-8">
              <Button 
            onClick={toggleAllSections}
                variant="outline"
            size="lg"
            className="bg-white border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 font-bold text-lg px-8 py-3"
          >
            {isAllExpanded ? (
              <>
                <Minimize2 className="w-5 h-5 mr-2" />
                {isFrench ? 'Tout réduire' : 'Collapse All'}
              </>
            ) : (
              <>
                <Expand className="w-5 h-5 mr-2" />
                {isFrench ? 'Tout développer' : 'Expand All'}
              </>
            )}
              </Button>
            </div>

        {/* Section Revenus */}
        <CollapsibleSection
          title={isFrench ? 'Revenus de travail' : 'Work Income'}
          isCollapsed={isRevenusCollapsed}
          onToggle={() => setIsRevenusCollapsed(!isRevenusCollapsed)}
          icon={<Briefcase className="w-8 h-8 text-green-600" />}
          className="mb-8"
        >
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-6">
                {isFrench
                  ? 'Gérez vos revenus de travail : salaire, emploi saisonnier, travail autonome, revenus de location'
                  : 'Manage your work income: salary, seasonal employment, self-employment, rental income'
                }
              </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
              {/* Personne 1 - Tableau des revenus */}
            <SeniorsFriendlyIncomeTable
              personNumber={1}
              personName={userData.personal?.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')}
              data={(userData.personal as any)?.unifiedIncome1 || []}
              onDataChange={(data) => {
                updateUserData('personal', { unifiedIncome1: data } as any);
              }}
              isFrench={isFrench}
                userData={userData}
            />

              {/* Personne 2 - Tableau des revenus */}
            <SeniorsFriendlyIncomeTable
              personNumber={2}
              personName={userData.personal?.prenom2 || (isFrench ? 'Personne 2' : 'Person 2')}
              data={(userData.personal as any)?.unifiedIncome2 || []}
              onDataChange={(data) => {
                console.log('🚨 PERSONNE 2 - onDataChange appelé avec:', data);
                console.log('🚨 PERSONNE 2 - Avant updateUserData, userData.unifiedIncome2:', (userData.personal as any)?.unifiedIncome2);
                updateUserData('personal', { unifiedIncome2: data } as any);
                console.log('🚨 PERSONNE 2 - Après updateUserData');
              }}
              isFrench={isFrench}
                userData={userData}
            />
        </div>


          </div>
        </CollapsibleSection>

        {/* Section Prestations */}
        <CollapsibleSection
          title={isFrench ? 'Prestations' : 'Benefits'}
          isCollapsed={isPrestationsCollapsed}
          onToggle={() => setIsPrestationsCollapsed(!isPrestationsCollapsed)}
          icon={<Shield className="w-8 h-8 text-purple-600" />}
          className="mb-8"
        >
          <div className="space-y-6">
                <div className="text-center">
              <p className="text-lg text-gray-600 mb-6">
              {isFrench 
                  ? 'Gérez vos prestations gouvernementales : RRQ/CPP, Sécurité de la vieillesse, Assurance emploi, rentes privées'
                  : 'Manage your government benefits: QPP/CPP, Old Age Security, Employment Insurance, private pensions'
              }
            </p>
            <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 font-semibold">
                {isFrench 
                  ? 'DEBUG: Section Prestations ouverte - RRQ, SV et Rentes privées devraient être visibles'
                  : 'DEBUG: Benefits section open - RRQ, OAS and Private Pensions should be visible'
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
              {/* Personne 1 - Prestations */}
              <BenefitsTable
                personNumber={1}
                personName={userData.personal?.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')}
                userData={userData}
                onDataChange={(data) => updateUserData('retirement', data)}
                isFrench={isFrench}
              />

              {/* Personne 2 - Prestations */}
              <BenefitsTable
                personNumber={2}
                personName={userData.personal?.prenom2 || (isFrench ? 'Personne 2' : 'Person 2')}
                userData={userData}
                onDataChange={(data) => updateUserData('retirement', data)}
                isFrench={isFrench}
              />
                </div>
                </div>
        </CollapsibleSection>

        {/* Section Investissements */}
        <CollapsibleSection
          title={isFrench ? 'Investissements' : 'Investments'}
          isCollapsed={isInvestissementsCollapsed}
          onToggle={() => setIsInvestissementsCollapsed(!isInvestissementsCollapsed)}
          icon={<TrendingUp className="w-8 h-8 text-orange-600" />}
          className="mb-8"
        >
          <div className="space-y-6">
                <div className="text-center">
              <p className="text-lg text-gray-600 mb-6">
              {isFrench 
                  ? 'Gérez vos investissements : REER, CELI, CRI, crypto-monnaie'
                  : 'Manage your investments: RRSP, TFSA, LIRA, cryptocurrency'
              }
            </p>
          </div>

            <div className="grid grid-cols-1 gap-8">
            {/* Personne 1 - Investissements */}
              <InvestmentsTable
              personNumber={1}
              personName={userData.personal?.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')}
                userData={userData}
                onDataChange={(data) => updateUserData('personal', data)}
              isFrench={isFrench}
            />

            {/* Personne 2 - Investissements */}
              <InvestmentsTable
              personNumber={2}
              personName={userData.personal?.prenom2 || (isFrench ? 'Personne 2' : 'Person 2')}
                userData={userData}
                onDataChange={(data) => updateUserData('personal', data)}
              isFrench={isFrench}
            />
          </div>
                </div>
        </CollapsibleSection>



        {/* Section Calculette de rendement */}
        <div className="space-y-8 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-indigo-300 mb-4 flex items-center justify-center gap-3">
              <Calculator className="w-8 h-8 text-indigo-400" />
              {isFrench ? 'Analyse de Performance' : 'Performance Analysis'}
            </h2>
            <p className="text-indigo-200 text-lg mb-8">
              {isFrench 
                ? 'Calculez et comparez les rendements de vos investissements REER, CELI et CRI'
                : 'Calculate and compare the returns of your RRSP, TFSA and LIRA investments'
              }
            </p>
            
            {/* Calculette de rendement */}
            <div className="flex justify-center">
              <ReturnCalculator isFrench={isFrench} />
            </div>
          </div>

          {/* Informations sur la calculette */}
          <Card className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30">
            <CardContent className="p-6">
              <h4 className="text-lg font-bold text-indigo-300 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                {isFrench ? 'À propos de la calculette de rendement' : 'About the Return Calculator'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                <div>
                  <strong className="text-indigo-300">{isFrench ? 'Fonctionnalités :' : 'Features:'}</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>{isFrench ? 'Calcul IRR (Taux de rendement interne)' : 'IRR (Internal Rate of Return) calculation'}</li>
                    <li>{isFrench ? 'Rendement pondéré dans le temps (TWR)' : 'Time-Weighted Return (TWR)'}</li>
                    <li>{isFrench ? 'Rendement pondéré par l\'argent (MWR)' : 'Money-Weighted Return (MWR)'}</li>
                    <li>{isFrench ? 'Gestion des contributions multiples' : 'Multiple contributions management'}</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-purple-300">{isFrench ? 'Utilisations :' : 'Uses:'}</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>{isFrench ? 'Comparer la performance entre comptes' : 'Compare performance between accounts'}</li>
                    <li>{isFrench ? 'Analyser l\'impact des versements' : 'Analyze contribution impact'}</li>
                    <li>{isFrench ? 'Évaluer les stratégies d\'investissement' : 'Evaluate investment strategies'}</li>
                    <li>{isFrench ? 'Optimiser les décisions futures' : 'Optimize future decisions'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bouton SAUVEGARDER */}
        <div className="text-center">
          <Button
            size="lg"
            disabled={isSaving}
            className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white font-bold text-2xl py-6 px-12 shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={async () => {
              setIsSaving(true);
              try {
                // Utiliser la nouvelle méthode de sauvegarde directe avec gestion des accents
                const result = await EnhancedSaveManager.saveDirectly(userData, {
                  includeTimestamp: true
                });
                
                if (result.success) {
                  console.log('💾 Données de revenus sauvegardées avec succès:', result.filename);
                  
                  // Afficher un message de succès avec le nom du fichier
                  alert(isFrench 
                    ? `✅ Revenus sauvegardés avec succès !\nFichier: ${result.filename}`
                    : `✅ Income data saved successfully!\nFile: ${result.filename}`
                  );
                } else if (result.blocked) {
                  console.warn('🚫 Sauvegarde bloquée:', result.reason);
                  alert(isFrench 
                    ? `🚫 Sauvegarde bloquée: ${result.reason}`
                    : `🚫 Save blocked: ${result.reason}`
                  );
                } else {
                  throw new Error(result.error || 'Erreur inconnue');
                }
                
              } catch (error) {
                console.error('❌ Erreur lors de la sauvegarde:', error);
                alert(isFrench 
                  ? `❌ Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
                  : `❌ Error saving data: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
              } finally {
                setIsSaving(false);
              }
            }}
          >
            <Save className="w-8 h-8 mr-4 animate-pulse" />
            {isSaving 
              ? (isFrench ? '💾 SAUVEGARDE...' : '💾 SAVING...')
              : (isFrench ? '💾 SAUVEGARDER' : '💾 SAVE')
            }
            <Shield className="w-8 h-8 ml-4 animate-bounce" />
          </Button>
          <p className="text-gray-300 mt-4 text-lg">
            {isFrench 
              ? '✨ Vos informations de revenus sont sécurisées!'
              : '✨ Your income information is secure!'
            }
          </p>
        </div>

        {/* Boutons d'aide et d'information */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-slate-900"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              {isFrench ? 'Afficher l\'aide' : 'Show help'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRRQInfo(!showRRQInfo)}
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900"
            >
              <Shield className="w-4 h-4 mr-2" />
              {isFrench ? 'Info RRQ' : 'QPP Info'}
            </Button>
          </div>
          
          <p className="text-gray-400 text-sm">
            {isFrench 
              ? 'Cliquez sur "Info RRQ" pour consulter les délais de demande de rente'
              : 'Click "QPP Info" to view pension application deadlines'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Revenus;
