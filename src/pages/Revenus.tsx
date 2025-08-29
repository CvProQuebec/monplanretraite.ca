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
  Calculator
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import MoneyInput from '@/components/ui/MoneyInput';
import AdvancedEIManager from '@/components/ui/AdvancedEIManager';
import ReturnCalculator from '@/components/ui/ReturnCalculator';
import RRQInfoCard from '@/components/ui/RRQInfoCard';
import UnifiedIncomeTable from '@/components/ui/UnifiedIncomeTable';
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
  
  const [showHelp, setShowHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showRRQInfo, setShowRRQInfo] = useState(false);

  // Correction du reflow mobile pour Samsung S23 Ultra
  useMobileReflowFix();

  const handleChange = (field: string, value: any) => {
    updateUserData('personal', { [field]: value });
  };

  const handleNotesChange = (field: string, value: string) => {
    // BYPASS sanitization completely for notes fields to preserve spaces and natural typing
    updateUserData('personal', { [field]: value });
  };

  const handleSalaryChange = (person: '1' | '2', value: number) => {
    handleChange(`salaire${person}`, value);
  };

  const getProgressPercentage = () => {
    const personalData = userData.personal;
    if (!personalData) return 0;
    
    const requiredFields = [
      'statutProfessionnel1', 'salaire1'
    ];
    
    const filledFields = requiredFields.filter(field => {
      const value = personalData[field as keyof typeof personalData];
      return value !== null && value !== undefined && value !== '' && value !== 0;
    }).length;
    
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const progress = getProgressPercentage();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white mobile-reflow-fix revenus-page revenus-container">
      {/* Particules de fond visibles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-teal-400 rounded-full animate-ping"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-lime-400 rounded-full animate-pulse"></div>
        <div className="absolute top-96 left-1/2 w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        <div className="absolute top-72 left-1/3 w-1 h-1 bg-teal-400 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10 mobile-reflow-fix">
        {/* En-tête spectaculaire */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500 bg-clip-text text-transparent drop-shadow-2xl">
            {isFrench ? '💰 Mes revenus' : '💰 My Income'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            {isFrench 
              ? 'Gérez vos sources de revenus pour optimiser votre planification de retraite'
              : 'Manage your income sources to optimize your retirement planning'
            }
          </p>
        </div>

        {/* Barre de progression encourageante */}
        <Card className="bg-white/10 backdrop-blur-sm border-2 border-green-200 shadow-lg mb-8">
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-semibold text-white">
                  {isFrench ? 'Progression des revenus' : 'Income progress'}
                </span>
              </div>
              <span className="text-2xl font-bold text-green-400">
                {progress} %
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-300 mt-2 text-center">
              {isFrench 
                ? `Excellent ! Vous avez complété ${progress} % de vos informations de revenus.`
                : `Great! You have completed ${progress} % of your income information.`
              }
            </p>
          </CardContent>
        </Card>

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

        {/* Section Assurance Emploi Avancée */}
        {((userData.personal?.typeRevenu1 === 'assurance-emploi' && userData.personal?.naissance1) || 
          (userData.personal?.typeRevenu2 === 'assurance-emploi' && userData.personal?.naissance2)) && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-indigo-300 mb-4 flex items-center justify-center gap-3">
                <Calculator className="w-8 h-8 text-indigo-400" />
                {isFrench ? 'Analyse Avancée - Assurance Emploi' : 'Advanced Analysis - Employment Insurance'}
              </h2>
              <p className="text-indigo-200 text-lg">
                {isFrench 
                  ? 'Calculateur intelligent pour optimiser votre transition vers la retraite'
                  : 'Smart calculator to optimize your transition to retirement'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {userData.personal?.typeRevenu1 === 'assurance-emploi' && userData.personal?.naissance1 && (
                <AdvancedEIManager
                  personNumber={1}
                  personName={userData.personal?.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')}
                  birthDate={userData.personal.naissance1}
                  onDataChange={(data) => {
                    updateUserData('personal', { advancedEI1: data });
                  }}
                  isFrench={isFrench}
                />
              )}
              
              {userData.personal?.typeRevenu2 === 'assurance-emploi' && userData.personal?.naissance2 && (
                <AdvancedEIManager
                  personNumber={2}
                  personName={userData.personal?.prenom2 || (isFrench ? 'Personne 2' : 'Person 2')}
                  birthDate={userData.personal.naissance2}
                  onDataChange={(data) => {
                    updateUserData('personal', { advancedEI2: data });
                  }}
                  isFrench={isFrench}
                />
              )}
            </div>
          </div>
        )}

        {/* Section Information RRQ - Affichée quand pertinent */}
        {(() => {
          // Logique pour déterminer quand afficher les informations RRQ
          const shouldShowRRQInfo = 
            // Si quelqu'un planifie sa retraite
            userData.personal?.statutProfessionnel1 === 'retraite' ||
            userData.personal?.statutProfessionnel2 === 'retraite' ||
            // Si quelqu'un reçoit de l'assurance emploi (transition vers retraite)
            userData.personal?.typeRevenu1 === 'assurance-emploi' ||
            userData.personal?.typeRevenu2 === 'assurance-emploi' ||
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
              
              <RRQInfoCard 
                isFrench={isFrench}
                isVisible={true}
                showAsModal={false}
              />
            </div>
          );
        })()}

        {/* Section Tableau Unifié des Revenus */}
        <div className="space-y-8 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-300 mb-4 flex items-center justify-center gap-3">
              <Calculator className="w-8 h-8 text-green-400" />
              {isFrench ? 'Tableau Unifié des Revenus' : 'Unified Income Table'}
            </h2>
            <p className="text-green-200 text-lg">
              {isFrench 
                ? 'Gérez tous vos types de revenus avec calculs automatiques "à ce jour" pour l\'assurance emploi'
                : 'Manage all your income types with automatic "to date" calculations for employment insurance'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Personne 1 - Tableau des revenus */}
            <UnifiedIncomeTable
              personNumber={1}
              personName={userData.personal?.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')}
              data={(userData.personal as any)?.unifiedIncome1 || []}
              onDataChange={(data) => {
                updateUserData('personal', { unifiedIncome1: data } as any);
              }}
              isFrench={isFrench}
            />

            {/* Personne 2 - Tableau des revenus */}
            <UnifiedIncomeTable
              personNumber={2}
              personName={userData.personal?.prenom2 || (isFrench ? 'Personne 2' : 'Person 2')}
              data={(userData.personal as any)?.unifiedIncome2 || []}
              onDataChange={(data) => {
                updateUserData('personal', { unifiedIncome2: data } as any);
              }}
              isFrench={isFrench}
            />
          </div>
        </div>

        {/* Section Investissements */}
        <div className="space-y-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-orange-300 mb-4 flex items-center justify-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-400" />
              {isFrench ? 'Mes investissements' : 'My Investments'}
            </h2>
            <p className="text-orange-200 text-lg">
              {isFrench 
                ? 'Gérez vos comptes d\'investissement et leurs soldes actuels'
                : 'Manage your investment accounts and their current balances'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personne 1 - Investissements */}
            <Card className="bg-gradient-to-br from-orange-800/90 to-red-800/90 border-0 shadow-2xl backdrop-blur-sm">
              <CardHeader className="border-b border-orange-600 bg-gradient-to-r from-orange-600/20 to-red-600/20">
                <CardTitle className="text-2xl font-bold text-orange-300 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    1
                  </div>
                  {userData.personal?.prenom1 
                    ? `${isFrench ? 'Investissements' : 'Investments'} - ${userData.personal.prenom1}`
                    : (isFrench ? 'Investissements - Personne 1' : 'Investments - Person 1')
                  }
                </CardTitle>
                <CardDescription className="text-orange-200">
                  {userData.personal?.prenom1 || (isFrench ? 'Première personne' : 'First person')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* REER */}
                <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="text-lg font-semibold text-orange-300 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {isFrench ? 'REER (Régime enregistré d\'épargne-retraite)' : 'RRSP (Registered Retirement Savings Plan)'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold">
                        {isFrench ? 'Solde REER' : 'RRSP Balance'}
                      </Label>
                      <MoneyInput
                        value={userData.personal?.soldeREER1 || 0}
                        onChange={(value) => handleChange('soldeREER1', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                        placeholder={isFrench ? "Ex: 150 000" : "Ex: 150,000"}
                        allowDecimals={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {isFrench ? 'Date du solde' : 'Balance Date'}
                      </Label>
                      <DateInput
                        value={userData.personal?.dateREER1 || ''}
                        onChange={(value) => handleChange('dateREER1', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                        placeholder={isFrench ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                      />
                    </div>
                  </div>
                </div>

                {/* CELI */}
                <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="text-lg font-semibold text-orange-300 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {isFrench ? 'CELI (Compte d\'épargne libre d\'impôt)' : 'TFSA (Tax-Free Savings Account)'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold">
                        {isFrench ? 'Solde CELI' : 'TFSA Balance'}
                      </Label>
                      <MoneyInput
                        value={userData.personal?.soldeCELI1 || 0}
                        onChange={(value) => handleChange('soldeCELI1', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                        placeholder={isFrench ? "Ex: 75 000" : "Ex: 75,000"}
                        allowDecimals={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {isFrench ? 'Date du solde' : 'Balance Date'}
                      </Label>
                      <DateInput
                        value={userData.personal?.dateCELI1 || ''}
                        onChange={(value) => handleChange('dateCELI1', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                        placeholder={isFrench ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                      />
                    </div>
                  </div>
                </div>

                {/* CRI */}
                <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="text-lg font-semibold text-orange-300 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    {isFrench ? 'CRI (Compte de retraite immobilisé)' : 'LIRA (Locked-in Retirement Account)'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold">
                        {isFrench ? 'Solde CRI' : 'LIRA Balance'}
                      </Label>
                      <MoneyInput
                        value={userData.personal?.soldeCRI1 || 0}
                        onChange={(value) => handleChange('soldeCRI1', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                        placeholder={isFrench ? "Ex: 200 000" : "Ex: 200,000"}
                        allowDecimals={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {isFrench ? 'Date du solde' : 'Balance Date'}
                      </Label>
                      <DateInput
                        value={userData.personal?.dateCRI1 || ''}
                        onChange={(value) => handleChange('dateCRI1', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                        placeholder={isFrench ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                      />
                    </div>
                  </div>
                </div>

                {/* Crypto-monnaie */}
                <div className="space-y-4 p-4 bg-gradient-to-r from-purple-700/50 to-pink-700/50 rounded-lg border border-purple-500/30">
                  <h4 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
                    <span className="text-xl">₿</span>
                    {isFrench ? 'Crypto-monnaie' : 'Cryptocurrency'}
                    <span className="text-xs bg-purple-600 px-2 py-1 rounded-full">
                      {isFrench ? 'NOUVEAU' : 'NEW'}
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold">
                        {isFrench ? 'Valeur totale crypto' : 'Total Crypto Value'}
                      </Label>
                      <MoneyInput
                        value={userData.personal?.soldeCrypto1 || 0}
                        onChange={(value) => handleChange('soldeCrypto1', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                        placeholder={isFrench ? "Ex: 25 000" : "Ex: 25,000"}
                        allowDecimals={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {isFrench ? 'Date d\'évaluation' : 'Valuation Date'}
                      </Label>
                      <DateInput
                        value={userData.personal?.dateCrypto1 || ''}
                        onChange={(value) => handleChange('dateCrypto1', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                        placeholder={isFrench ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold">
                      {isFrench ? 'Détails crypto (optionnel)' : 'Crypto Details (optional)'}
                    </Label>
                    <textarea
                      value={userData.personal?.detailsCrypto1 || ''}
                      onChange={(e) => handleNotesChange('detailsCrypto1', e.target.value)}
                      className="w-full bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400 rounded-md p-3 min-h-[60px]"
                      placeholder={isFrench ? 'Ex: Bitcoin, Ethereum, portefeuilles...' : 'Ex: Bitcoin, Ethereum, wallets...'}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personne 2 - Investissements */}
            <Card className="bg-gradient-to-br from-amber-800/90 to-orange-800/90 border-0 shadow-2xl backdrop-blur-sm">
              <CardHeader className="border-b border-amber-600 bg-gradient-to-r from-amber-600/20 to-orange-600/20">
                <CardTitle className="text-2xl font-bold text-amber-300 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    2
                  </div>
                  {userData.personal?.prenom2 
                    ? `${isFrench ? 'Investissements' : 'Investments'} - ${userData.personal.prenom2}`
                    : (isFrench ? 'Investissements - Personne 2' : 'Investments - Person 2')
                  }
                </CardTitle>
                <CardDescription className="text-amber-200">
                  {userData.personal?.prenom2 || (isFrench ? 'Deuxième personne (optionnel)' : 'Second person (optional)')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* REER */}
                <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="text-lg font-semibold text-amber-300 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {isFrench ? 'REER (Régime enregistré d\'épargne-retraite)' : 'RRSP (Registered Retirement Savings Plan)'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold">
                        {isFrench ? 'Solde REER' : 'RRSP Balance'}
                      </Label>
                      <MoneyInput
                        value={userData.personal?.soldeREER2 || 0}
                        onChange={(value) => handleChange('soldeREER2', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-amber-400"
                        placeholder={isFrench ? "Ex: 150 000" : "Ex: 150,000"}
                        allowDecimals={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {isFrench ? 'Date du solde' : 'Balance Date'}
                      </Label>
                      <DateInput
                        value={userData.personal?.dateREER2 || ''}
                        onChange={(value) => handleChange('dateREER2', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-amber-400"
                        placeholder={isFrench ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                      />
                    </div>
                  </div>
                </div>

                {/* CELI */}
                <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="text-lg font-semibold text-amber-300 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {isFrench ? 'CELI (Compte d\'épargne libre d\'impôt)' : 'TFSA (Tax-Free Savings Account)'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold">
                        {isFrench ? 'Solde CELI' : 'TFSA Balance'}
                      </Label>
                      <MoneyInput
                        value={userData.personal?.soldeCELI2 || 0}
                        onChange={(value) => handleChange('soldeCELI2', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-amber-400"
                        placeholder={isFrench ? "Ex: 75 000" : "Ex: 75,000"}
                        allowDecimals={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {isFrench ? 'Date du solde' : 'Balance Date'}
                      </Label>
                      <DateInput
                        value={userData.personal?.dateCELI2 || ''}
                        onChange={(value) => handleChange('dateCELI2', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-amber-400"
                        placeholder={isFrench ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                      />
                    </div>
                  </div>
                </div>

                {/* CRI */}
                <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="text-lg font-semibold text-amber-300 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    {isFrench ? 'CRI (Compte de retraite immobilisé)' : 'LIRA (Locked-in Retirement Account)'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold">
                        {isFrench ? 'Solde CRI' : 'LIRA Balance'}
                      </Label>
                      <MoneyInput
                        value={userData.personal?.soldeCRI2 || 0}
                        onChange={(value) => handleChange('soldeCRI2', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-amber-400"
                        placeholder={isFrench ? "Ex: 200 000" : "Ex: 200,000"}
                        allowDecimals={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {isFrench ? 'Date du solde' : 'Balance Date'}
                      </Label>
                      <DateInput
                        value={userData.personal?.dateCRI2 || ''}
                        onChange={(value) => handleChange('dateCRI2', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-amber-400 focus:ring-amber-400"
                        placeholder={isFrench ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                      />
                    </div>
                  </div>
                </div>

                {/* Crypto-monnaie */}
                <div className="space-y-4 p-4 bg-gradient-to-r from-purple-700/50 to-pink-700/50 rounded-lg border border-purple-500/30">
                  <h4 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
                    <span className="text-xl">₿</span>
                    {isFrench ? 'Crypto-monnaie' : 'Cryptocurrency'}
                    <span className="text-xs bg-purple-600 px-2 py-1 rounded-full">
                      {isFrench ? 'NOUVEAU' : 'NEW'}
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold">
                        {isFrench ? 'Valeur totale crypto' : 'Total Crypto Value'}
                      </Label>
                      <MoneyInput
                        value={userData.personal?.soldeCrypto2 || 0}
                        onChange={(value) => handleChange('soldeCrypto2', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                        placeholder={isFrench ? "Ex: 25 000" : "Ex: 25,000"}
                        allowDecimals={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {isFrench ? 'Date d\'évaluation' : 'Valuation Date'}
                      </Label>
                      <DateInput
                        value={userData.personal?.dateCrypto2 || ''}
                        onChange={(value) => handleChange('dateCrypto2', value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                        placeholder={isFrench ? 'YYYY-MM-DD' : 'YYYY-MM-DD'}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold">
                      {isFrench ? 'Détails crypto (optionnel)' : 'Crypto Details (optional)'}
                    </Label>
                    <textarea
                      value={userData.personal?.detailsCrypto2 || ''}
                      onChange={(e) => handleNotesChange('detailsCrypto2', e.target.value)}
                      className="w-full bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400 rounded-md p-3 min-h-[60px]"
                      placeholder={isFrench ? 'Ex: Bitcoin, Ethereum, portefeuilles...' : 'Ex: Bitcoin, Ethereum, wallets...'}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé des investissements */}
          <Card className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border border-orange-500/30">
            <CardContent className="p-6">
              <h4 className="text-lg font-bold text-orange-300 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {isFrench ? 'Résumé des investissements' : 'Investment Summary'}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    ${((userData.personal?.soldeREER1 || 0) + (userData.personal?.soldeREER2 || 0)).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-300">
                    {isFrench ? 'Total REER' : 'Total RRSP'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    ${((userData.personal?.soldeCELI1 || 0) + (userData.personal?.soldeCELI2 || 0)).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-300">
                    {isFrench ? 'Total CELI' : 'Total TFSA'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    ${((userData.personal?.soldeCRI1 || 0) + (userData.personal?.soldeCRI2 || 0)).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-300">
                    {isFrench ? 'Total CRI' : 'Total LIRA'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    ${((userData.personal?.soldeCrypto1 || 0) + (userData.personal?.soldeCrypto2 || 0)).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-300">
                    {isFrench ? 'Total Crypto' : 'Total Crypto'}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">
                    ${(
                      (userData.personal?.soldeREER1 || 0) + (userData.personal?.soldeREER2 || 0) +
                      (userData.personal?.soldeCELI1 || 0) + (userData.personal?.soldeCELI2 || 0) +
                      (userData.personal?.soldeCRI1 || 0) + (userData.personal?.soldeCRI2 || 0) +
                      (userData.personal?.soldeCrypto1 || 0) + (userData.personal?.soldeCrypto2 || 0)
                    ).toLocaleString()}
                  </div>
                  <div className="text-lg text-gray-300">
                    {isFrench ? 'Valeur totale des investissements' : 'Total Investment Value'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conseils pour les investissements */}
          <Card className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30">
            <CardContent className="p-6">
              <h4 className="text-lg font-bold text-indigo-300 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                {isFrench ? 'Conseils pour vos investissements' : 'Investment Tips'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                <div>
                  <strong className="text-indigo-300">{isFrench ? 'REER :' : 'RRSP:'}</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>{isFrench ? 'Déduction fiscale immédiate' : 'Immediate tax deduction'}</li>
                    <li>{isFrench ? 'Imposable au retrait' : 'Taxable on withdrawal'}</li>
                    <li>{isFrench ? 'Conversion obligatoire à 71 ans' : 'Mandatory conversion at 71'}</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-green-300">{isFrench ? 'CELI :' : 'TFSA:'}</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>{isFrench ? 'Croissance libre d\'impôt' : 'Tax-free growth'}</li>
                    <li>{isFrench ? 'Retraits non imposables' : 'Tax-free withdrawals'}</li>
                    <li>{isFrench ? 'Droits de cotisation récupérables' : 'Contribution room recoverable'}</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-purple-300">{isFrench ? 'Crypto :' : 'Crypto:'}</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>{isFrench ? 'Actif volatil et spéculatif' : 'Volatile and speculative asset'}</li>
                    <li>{isFrench ? 'Gains en capital imposables' : 'Taxable capital gains'}</li>
                    <li>{isFrench ? 'Diversification limitée recommandée' : 'Limited diversification recommended'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Sécurité de la vieillesse avec ajustements */}
        <div className="space-y-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-purple-300 mb-4 flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              {isFrench ? 'Sécurité de la vieillesse (SV)' : 'Old Age Security (OAS)'}
            </h2>
            <p className="text-purple-200 text-lg">
              {isFrench 
                ? 'Gérez vos prestations réelles avec les ajustements par période'
                : 'Manage your actual benefits with period-specific adjustments'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personne 1 - Gestion SV Biannuelle */}
            <SVBiannualManager
              personNumber={1}
              personName={userData.personal?.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')}
              data={(userData.retirement as any)?.svBiannual1}
              onDataChange={(data) => {
                updateUserData('retirement', { svBiannual1: data } as any);
              }}
              isFrench={isFrench}
            />

            {/* Personne 2 - Gestion SV Biannuelle */}
            <SVBiannualManager
              personNumber={2}
              personName={userData.personal?.prenom2 || (isFrench ? 'Personne 2' : 'Person 2')}
              data={(userData.retirement as any)?.svBiannual2}
              onDataChange={(data) => {
                updateUserData('retirement', { svBiannual2: data } as any);
              }}
              isFrench={isFrench}
            />
          </div>

          {/* Recommandations SV */}
          <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30">
            <CardContent className="p-6">
              <h4 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                {isFrench ? 'Recommandations pour la SV' : 'OAS Recommendations'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <strong className="text-purple-300">{isFrench ? 'Stratégie optimale :' : 'Optimal Strategy:'}</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>{isFrench ? 'Reporter si revenus élevés (récupération fiscale)' : 'Defer if high income (tax clawback)'}</li>
                    <li>{isFrench ? 'Commencer à 65 ans si revenus modestes' : 'Start at 65 if modest income'}</li>
                    <li>{isFrench ? 'Considérer l\'espérance de vie' : 'Consider life expectancy'}</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-pink-300">{isFrench ? 'Points importants :' : 'Important Points:'}</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>{isFrench ? 'Récupération si revenu > 90 997$ (2024)' : 'Clawback if income > $90,997 (2024)'}</li>
                    <li>{isFrench ? 'Demande automatique à 64 ans' : 'Automatic application at 64'}</li>
                    <li>{isFrench ? 'Indexée à l\'inflation' : 'Indexed to inflation'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Résumé des revenus */}
        <Card className="bg-gradient-to-br from-blue-800/90 to-indigo-800/90 border-0 shadow-2xl backdrop-blur-sm mb-8">
          <CardHeader className="border-b border-blue-600 bg-gradient-to-r from-blue-600/20 to-indigo-600/20">
            <CardTitle className="text-2xl font-bold text-blue-300 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-400" />
              {isFrench ? 'Résumé des revenus' : 'Income Summary'}
            </CardTitle>
            <CardDescription className="text-blue-200">
              {isFrench 
                ? 'Vue d\'ensemble de vos revenus pour la planification de retraite'
                : 'Overview of your income for retirement planning'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  ${((userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Revenus d\'emploi annuels' : 'Annual Employment Income'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  ${(() => {
                    const baseSV = 707.68;
                    const ageSV1 = userData.personal?.ageSV1 || 65;
                    const ageSV2 = userData.personal?.ageSV2 || 65;
                    const bonus1 = ageSV1 > 65 ? (ageSV1 - 65) * 0.072 : 0;
                    const bonus2 = ageSV2 > 65 ? (ageSV2 - 65) * 0.072 : 0;
                    const sv1 = Math.round(baseSV * (1 + bonus1)) * 12;
                    const sv2 = Math.round(baseSV * (1 + bonus2)) * 12;
                    return (sv1 + sv2).toLocaleString();
                  })()}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'SV annuelle estimée' : 'Estimated Annual OAS'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  ${(() => {
                    const emploi = (userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0);
                    const baseSV = 707.68;
                    const ageSV1 = userData.personal?.ageSV1 || 65;
                    const ageSV2 = userData.personal?.ageSV2 || 65;
                    const bonus1 = ageSV1 > 65 ? (ageSV1 - 65) * 0.072 : 0;
                    const bonus2 = ageSV2 > 65 ? (ageSV2 - 65) * 0.072 : 0;
                    const sv1 = Math.round(baseSV * (1 + bonus1)) * 12;
                    const sv2 = Math.round(baseSV * (1 + bonus2)) * 12;
                    const total = emploi + sv1 + sv2;
                    return Math.round(total / 12).toLocaleString();
                  })()}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Revenus mensuels totaux' : 'Total Monthly Income'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {userData.personal?.statutProfessionnel1 === 'actif' || userData.personal?.statutProfessionnel2 === 'actif' ? '✅' : '⚠️'}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Statut d\'activité' : 'Activity Status'}
                </div>
              </div>
            </div>

            {/* Alertes importantes */}
            {(userData.personal?.typeEmploi1 === 'contrat' || userData.personal?.typeEmploi2 === 'contrat') && (
              <Alert className="border-yellow-400 bg-yellow-900/20 text-yellow-200 mt-6">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <AlertDescription>
                  <strong>{isFrench ? 'Attention :' : 'Warning:'}</strong> {
                    isFrench 
                      ? 'Vous avez des revenus contractuels. Assurez-vous de planifier la transition après la fin du contrat.'
                      : 'You have contract income. Make sure to plan for the transition after the contract ends.'
                  }
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Section Calculette de Rendement */}
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
            
            {/* Calculette de Rendement */}
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
