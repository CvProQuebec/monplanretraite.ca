import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  DollarSign, 
  PiggyBank, 
  Home, 
  Calculator,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Building,
  CreditCard,
  BarChart3,
  AlertTriangle,
  Users,
  Info,
  HelpCircle,
  Calendar,
  Target,
  Rocket,
  Sparkles,
  Brain,
  Shield,
  Zap,
  Save,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/features/retirement/utils/formatters';
import { InputSanitizer } from '@/utils/inputSanitizer';
import { LicenseManager } from '@/services/LicenseManager';
import { EnhancedSaveManager } from '@/services/EnhancedSaveManager';
import OnboardingWizard from '@/features/retirement/components/OnboardingWizard';
import { CustomBirthDateInput } from '@/features/retirement/components/CustomBirthDateInput';


const MaRetraite: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isFrench = language === 'fr';
  const [activeTab, setActiveTab] = useState('profil');
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  
  // Hook pour les données de retraite
  const { userData, updateUserData } = useRetirementData();

  const [revenusData, setRevenusData] = useState({
    salaire: '',
    pensions: '',
    epargne: '',
    immobilier: '',
    autres: ''
  });

  // Synchronisation des données du profil avec la page revenus
  useEffect(() => {
    if (userData.personal) {
      // Synchroniser le salaire du profil avec la page revenus
      if (userData.personal.salaire1) {
        setRevenusData(prev => ({
          ...prev,
          salaire: userData.personal.salaire1.toString()
        }));
      }
    }
  }, [userData.personal]);

  // Synchronisation inverse : mettre à jour le profil quand le salaire change
  const handleRevenusChange = (field: string, value: string) => {
    setRevenusData(prev => ({ ...prev, [field]: value }));
    
    // Si c'est le salaire, mettre à jour le profil
    if (field === 'salaire') {
      const numericValue = parseFloat(value.replace(/[^\d.]/g, '')) || 0;
      updateUserData('personal', { salaire1: numericValue });
    }
  };

  const handleOnboardingComplete = (userData: any) => {
    console.log('✅ Onboarding terminé avec succès:', userData);
    setShowOnboardingWizard(false);
    // Mettre à jour les données locales avec les nouvelles informations
    if (userData.personal) {
      updateUserData('personal', userData.personal);
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboardingWizard(false);
  };

  const [depensesData, setDepensesData] = useState({
    logement: '',
    alimentation: '',
    transport: '',
    sante: '',
    loisirs: '',
    autres: ''
  });

  const [calculsData, setCalculsData] = useState({
    ageRetraite: '',
    revenusMensuels: '',
    depensesMensuelles: '',
    epargneNecessaire: ''
  });

  // États pour le profil
  const [showHelp, setShowHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [licenseBlocked, setLicenseBlocked] = useState(false);
  const [licenseMessage, setLicenseMessage] = useState('');



  const handleDepensesChange = (field: string, value: string) => {
    setDepensesData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculsChange = (field: string, value: string) => {
    setCalculsData(prev => ({ ...prev, [field]: value }));
  };

  // Fonctions pour le profil
  const handleProfileChange = (field: string, value: any) => {
    // Vérifier la licence avant de permettre les modifications
    const newData = { ...userData };
    newData.personal = { ...newData.personal, [field]: value };
    
    const licenseCheck = LicenseManager.checkLicense(newData);
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
    // TEMPORARY FIX: Bypass sanitization completely for name fields to preserve spaces
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
      'prenom1', 'naissance1', 'sexe1', 'salaire1', 'statutProfessionnel1', 
      'ageRetraiteSouhaite1', 'depensesRetraite'
    ];
    
    const filledFields = requiredFields.filter(field => {
      const value = personalData[field as keyof typeof personalData];
      return value !== null && value !== undefined && value !== '' && value !== 0;
    }).length;
    
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getRevenusProgress = () => {
    const filledFields = Object.values(revenusData).filter(value => value.trim() !== '').length;
    return Math.round((filledFields / Object.keys(revenusData).length) * 100);
  };

  const getDepensesProgress = () => {
    const filledFields = Object.values(depensesData).filter(value => value.trim() !== '').length;
    return Math.round((filledFields / Object.keys(depensesData).length) * 100);
  };

  const getCalculsProgress = () => {
    const filledFields = Object.values(calculsData).filter(value => value.trim() !== '').length;
    return Math.round((filledFields / Object.keys(calculsData).length) * 100);
  };

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
              ? 'Travaillons ensemble avec vos ressources réelles. Chaque source de revenus et chaque dépense compte pour créer votre plan personnalisé.'
              : 'Let\'s work together with your real resources. Every source of income and every expense counts to create your personalized plan.'
            }
          </p>
        </div>

        {/* Onglets thématiques - Améliorés pour l'harmonie visuelle */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-6 sm:mb-8 gap-2 p-1 bg-gray-100/50 rounded-xl">
            <TabsTrigger 
              value="profil" 
              className="flex items-center gap-2 px-3 py-2 text-sm sm:text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 transition-all duration-200"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{isFrench ? 'Mon Profil' : 'My Profile'}</span>
              <span className="sm:hidden">{isFrench ? 'Profil' : 'Profile'}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 px-3 py-2 text-sm sm:text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 transition-all duration-200"
            >
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{isFrench ? 'Tableau de Bord' : 'Dashboard'}</span>
              <span className="sm:hidden">{isFrench ? 'Dashboard' : 'Dashboard'}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="revenus" 
              className="flex items-center gap-2 px-3 py-2 text-sm sm:text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 transition-all duration-200"
            >
              <Building className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{isFrench ? 'Mes revenus et actifs' : 'My income and assets'}</span>
              <span className="sm:hidden">{isFrench ? 'Revenus' : 'Income'}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="depenses" 
              className="flex items-center gap-2 px-3 py-2 text-sm sm:text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 transition-all duration-200"
            >
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{isFrench ? 'Mes dépenses et budget' : 'My expenses and budget'}</span>
              <span className="sm:hidden">{isFrench ? 'Budget' : 'Budget'}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="calculs" 
              className="flex items-center gap-2 px-3 py-2 text-sm sm:text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 transition-all duration-200"
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{isFrench ? 'Mes calculs de retraite' : 'My retirement calculations'}</span>
              <span className="sm:hidden">{isFrench ? 'Calculs' : 'Calculations'}</span>
            </TabsTrigger>
          </TabsList>

          {/* NOUVEAU - Onglet 0 : Profil Personnel - Intégré depuis MonProfil */}
          <TabsContent value="profil" className="space-y-6">
            {/* En-tête du profil */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
                {isFrench ? '🚀 Mon Profil' : '🚀 My Profile'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                {isFrench 
                  ? 'Transformez vos informations en planification financière spectaculaire'
                  : 'Transform your information into spectacular financial planning'
                }
              </p>
              
              {/* Bouton "Commencez ici" pour l'Onboarding Wizard */}
              <Button 
                onClick={() => setShowOnboardingWizard(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                {isFrench ? '🎯 Commencez ici' : '🎯 Start here'}
              </Button>
            </div>

            {/* Barre de progression encourageante */}
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
              <CardContent className="py-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Star className="w-6 h-6 text-yellow-300" />
                    <span className="text-lg font-semibold text-white">
                      {isFrench ? 'Votre progression' : 'Your progress'}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {getProfileProgress()} %
                  </span>
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
                    : `Great work! You have completed ${getProfileProgress()} % of your profile.`
                  }
                </p>
              </CardContent>
            </Card>

            {/* Message d'aide */}
            {showHelp && (
              <Alert className="border-yellow-400 bg-yellow-50 text-yellow-800">
                <Info className="h-5 w-5 text-yellow-400" />
                <AlertDescription className="text-lg">
                  <strong>{isFrench ? 'Conseils :' : 'Tips:'}</strong> {
                    isFrench 
                      ? 'Entrez vos noms complets (prénoms composés, noms de famille) pour une personnalisation optimale de vos rapports. Si vous êtes seul(e), laissez la section « Personne 2 » vide. Les montants en dollars n\'incluent pas les centimes pour simplifier la saisie.'
                      : 'Enter your full names (compound first names, last names) for optimal personalization of your reports. If you are single, leave the "Person 2" section empty. Dollar amounts do not include cents to simplify entry.'
                  }
                </AlertDescription>
              </Alert>
            )}

            {/* Alerte de protection de licence */}
            {licenseBlocked && (
              <Alert className="border-red-400 bg-red-50 text-red-800">
                <Shield className="h-5 w-5 text-red-400" />
                <AlertDescription className="text-lg">
                  <strong>{isFrench ? '🚫 Modification bloquée' : '🚫 Modification blocked'}</strong>
                  <br />
                  {licenseMessage}
                  <br />
                  <div className="mt-4 space-y-2">
                    <p className="text-sm">
                      {isFrench 
                        ? 'Pour créer un nouveau profil, vous devez souscrire à un plan ou contacter le service à la clientèle.'
                        : 'To create a new profile, you must subscribe to a plan or contact customer service.'
                      }
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Formulaire principal du profil */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Personne 1 */}
              <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-xl">
                <CardHeader className="border-b border-blue-500/30 bg-blue-500/20">
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
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
                        placeholder={isFrench ? 'Ex: Jean Philippe ou Louis-Alexandre Veillette' : 'Ex: John Smith or Mary-Jane Watson'}
                      />
                      <p className="text-xs text-white/80 mt-1">
                        {isFrench 
                          ? 'Entrez votre nom complet tel que vous souhaitez qu\'il apparaisse dans vos rapports'
                          : 'Enter your full name as you want it to appear in your reports'
                        }
                      </p>
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
                      <Label className="text-white font-semibold">
                        {isFrench ? 'Sexe' : 'Gender'}
                      </Label>
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
                        min="50"
                        max="100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white font-semibold">
                        {isFrench ? 'Dépenses de retraite annuelles' : 'Annual Retirement Expenses'}
                      </Label>
                      <Input
                        type="number"
                        value={userData.personal?.depensesRetraite || ''}
                        onChange={(e) => handleProfileChange('depensesRetraite', Number(e.target.value))}
                        className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-white focus:ring-white/20"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personne 2 */}
              <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0 shadow-xl">
                <CardHeader className="border-b border-indigo-500/30 bg-indigo-500/20">
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
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
                        placeholder={isFrench ? 'Ex: Marie ou Anne-Sophie' : 'Ex: Mary or Anne-Sophie'}
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
                      <Label className="text-white font-semibold">
                        {isFrench ? 'Sexe' : 'Gender'}
                      </Label>
                      <Select
                        value={userData.personal?.sexe2 || 'femme'}
                        onValueChange={(value) => handleProfileChange('sexe2', value)}
                      >
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectTrigger className="bg-white/20 border-white/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
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
                        min="50"
                        max="100"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bouton SAUVEGARDER - Protection des données ! */}
            <div className="text-center">
              <Button
                size="lg"
                disabled={isSaving}
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white font-bold text-2xl py-6 px-12 shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={async () => {
                  setIsSaving(true);
                  try {
                    // Calculer automatiquement les dépenses mensuelles si les annuelles sont renseignées
                    if (userData.personal?.depensesRetraite && userData.personal.depensesRetraite > 0) {
                      const depensesMensuelles = Math.round(userData.personal.depensesRetraite / 12);
                      handleProfileChange('depensesMensuelles', depensesMensuelles);
                      console.log(`🔄 Dépenses mensuelles calculées et sauvegardées: $${depensesMensuelles}`);
                    }
                    
                    // Utiliser le nouveau système de sauvegarde
                    const saveResult = await EnhancedSaveManager.saveWithDialog(userData, {
                      includeTimestamp: true
                    });
                    
                    if (saveResult.success) {
                      alert(isFrench 
                        ? `✅ Données sauvegardées avec succès dans ${saveResult.filename} !`
                        : `✅ Data saved successfully to ${saveResult.filename}!`
                      );
                    } else if (saveResult.blocked) {
                      alert(isFrench 
                        ? `🚫 Sauvegarde bloquée: ${saveResult.reason}`
                        : `🚫 Save blocked: ${saveResult.reason}`
                      );
                    } else {
                      alert(isFrench 
                        ? `❌ Erreur: ${saveResult.error}`
                        : `❌ Error: ${saveResult.error}`
                      );
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
                {isSaving 
                  ? (isFrench ? '💾 SAUVEGARDE...' : '💾 SAVING...')
                  : (isFrench ? '💾 SAUVEGARDER' : '💾 SAVE')
                }
                <Shield className="w-8 h-8 ml-4 animate-bounce" />
              </Button>
              <p className="text-gray-600 mt-4 text-lg">
                {isFrench 
                  ? '✨ Protégez vos données et continuez en toute sécurité!'
                  : '✨ Protect your data and continue safely!'
                }
              </p>
            </div>

            {/* Bouton d'aide */}
            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHelp(!showHelp)}
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                {isFrench ? 'Afficher l\'aide' : 'Show help'}
              </Button>
            </div>
          </TabsContent>

          {/* NOUVEAU - Onglet 1 : Tableau de Bord avec Onboarding - Amélioré */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Section Onboarding et Vue d'ensemble - Harmonisée */}
            <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white border-0 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <CardHeader className="relative z-10 pb-4">
                <CardTitle className="flex items-center gap-3 text-white text-2xl sm:text-3xl font-bold mb-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  {isFrench ? 'Bienvenue dans votre planification de retraite!' : 'Welcome to your retirement planning!'}
                </CardTitle>
                <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-4xl">
                  {isFrench 
                    ? 'Commencez votre parcours avec nos modules spécialisés. Chaque étape vous rapproche de votre retraite rêvée.'
                    : 'Start your journey with our specialized modules. Each step brings you closer to your dream retirement.'
                  }
                </p>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Module SRG */}
                  <Button
                    onClick={() => handleNavigation('/module-srg')}
                    variant="outline"
                    className="group bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 h-auto py-4 px-3"
                  >
                    <div className="text-center w-full">
                      <div className="p-2 bg-white/20 rounded-full w-fit mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                        <Building className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <div className="font-semibold text-sm sm:text-base mb-1">Module SRG</div>
                      <div className="text-xs text-blue-100 leading-tight">Supplément de Revenu Garanti</div>
                    </div>
                  </Button>

                  {/* Module RREGOP */}
                  <Button
                    onClick={() => handleNavigation('/module-rregop')}
                    variant="outline"
                    className="group bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 h-auto py-4 px-3"
                  >
                    <div className="text-center w-full">
                      <div className="p-2 bg-white/20 rounded-full w-fit mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                        <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <div className="font-semibold text-sm sm:text-base mb-1">Module RREGOP</div>
                      <div className="text-xs text-blue-100 leading-tight">Régime de Retraite Gouvernemental</div>
                    </div>
                  </Button>

                  {/* Module Immobilier */}
                  <Button
                    onClick={() => handleNavigation('/optimisation-immobiliere')}
                    variant="outline"
                    className="group bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 h-auto py-4 px-3"
                  >
                    <div className="text-center w-full">
                      <div className="p-2 bg-white/20 rounded-full w-fit mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                        <Home className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <div className="font-semibold text-sm sm:text-base mb-1">Optimisation immobilière</div>
                      <div className="text-xs text-blue-100 leading-tight">Stratégies RREGOP Priority</div>
                    </div>
                  </Button>

                  {/* Module d'Optimisation Fiscale */}
                  <Button
                    onClick={() => handleNavigation('/optimisation-fiscale')}
                    variant="outline"
                    className="group bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 h-auto py-4 px-3"
                  >
                    <div className="text-center w-full">
                      <div className="p-2 bg-white/20 rounded-full w-fit mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                        <Calculator className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <div className="font-semibold text-sm sm:text-base mb-1">Optimisation fiscale</div>
                      <div className="text-xs text-blue-100 leading-tight">Stratégies avancées</div>
                    </div>
                  </Button>

                  {/* Simulateur Monte Carlo */}
                  <Button
                    onClick={() => handleNavigation('/simulateur-monte-carlo')}
                    variant="outline"
                    className="group bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 h-auto py-4 px-3"
                  >
                    <div className="text-center w-full">
                      <div className="p-2 bg-white/20 rounded-full w-fit mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                        <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <div className="font-semibold text-sm sm:text-base mb-1">Simulateur Monte Carlo</div>
                      <div className="text-xs text-blue-100 leading-tight">Analyses probabilistes</div>
                    </div>
                  </Button>

                  {/* Planification d'Urgence */}
                  <Button
                    onClick={() => handleNavigation('/planification-urgence')}
                    variant="outline"
                    className="group bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 h-auto py-4 px-3"
                  >
                    <div className="text-center w-full">
                      <div className="p-2 bg-white/20 rounded-full w-fit mx-auto mb-3 group-hover:bg-white/30 transition-colors">
                        <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <div className="font-semibold text-sm sm:text-base mb-1">Planification d'urgence</div>
                      <div className="text-xs text-blue-100 leading-tight">Protection familiale</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section Progression Globale - Harmonisée */}
            <Card className="bg-gradient-to-br from-white/90 to-green-50/80 backdrop-blur-sm border border-green-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-800 text-xl sm:text-2xl font-bold">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  {isFrench ? 'Progression globale de votre planification' : 'Overall Planning Progress'}
                </CardTitle>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  {isFrench 
                    ? 'Suivez votre avancement dans chaque domaine de planification'
                    : 'Track your progress in each planning area'
                  }
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center p-4 bg-white/60 rounded-xl border border-blue-200/50 hover:bg-white/80 transition-colors duration-200">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{getRevenusProgress()}%</div>
                    <div className="text-sm sm:text-base text-gray-700 font-medium mb-3">
                      {isFrench ? 'Revenus et Actifs' : 'Income & Assets'}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${getRevenusProgress()}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/60 rounded-xl border border-green-200/50 hover:bg-white/80 transition-colors duration-200">
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{getDepensesProgress()}%</div>
                    <div className="text-sm sm:text-base text-gray-700 font-medium mb-3">
                      {isFrench ? 'Dépenses et Budget' : 'Expenses & Budget'}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${getDepensesProgress()}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/60 rounded-xl border border-purple-200/50 hover:bg-white/80 transition-colors duration-200">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{getCalculsProgress()}%</div>
                    <div className="text-sm sm:text-base text-gray-700 font-medium mb-3">
                      {isFrench ? 'Calculs de Retraite' : 'Retirement Calculations'}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${getCalculsProgress()}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet 1 : Revenus et actifs */}
          <TabsContent value="revenus" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-800">
                  <Building className="w-6 h-6" />
                  {isFrench ? 'Mes revenus et actifs' : 'My income and assets'}
                </CardTitle>
                <p className="text-gray-600">
                  {isFrench 
                    ? 'Chaque source de revenus compte, peu importe le montant. Soyez fiers de ce que vous avez !'
                    : 'Every source of income counts, regardless of the amount. Be proud of what you have!'
                  }
                </p>
                {/* Barre de progression */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {isFrench ? 'Progression' : 'Progress'}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {getRevenusProgress()} %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getRevenusProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salaire" className="text-gray-700">
                      {isFrench ? 'Salaire actuel' : 'Current salary'}
                    </Label>
                    <Input
                      id="salaire"
                      value={revenusData.salaire}
                      onChange={(e) => handleRevenusChange('salaire', e.target.value)}
                      placeholder={isFrench ? 'Salaire annuel ou mensuel' : 'Annual or monthly salary'}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pensions" className="text-gray-700">
                      {isFrench ? 'Pensions gouvernementales' : 'Government pensions'}
                    </Label>
                    <Input
                      id="pensions"
                      value={revenusData.pensions}
                      onChange={(e) => handleRevenusChange('pensions', e.target.value)}
                      placeholder={isFrench ? 'CPP, RRQ, OAS, GIS...' : 'CPP, RRQ, OAS, GIS...'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="epargne" className="text-gray-700">
                      {isFrench ? 'Épargne et investissements' : 'Savings and investments'}
                    </Label>
                    <Input
                      id="epargne"
                      value={revenusData.epargne}
                      onChange={(e) => handleRevenusChange('epargne', e.target.value)}
                      placeholder={isFrench ? 'REER, CELI, autres...' : 'RRSP, TFSA, others...'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="immobilier" className="text-gray-700">
                      {isFrench ? 'Revenus immobiliers' : 'Real estate income'}
                    </Label>
                    <Input
                      id="immobilier"
                      value={revenusData.immobilier}
                      onChange={(e) => handleRevenusChange('immobilier', e.target.value)}
                      placeholder={isFrench ? 'Loyers, propriétés...' : 'Rent, properties...'}
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="autres" className="text-gray-700">
                      {isFrench ? 'Autres sources de revenus' : 'Other sources of income'}
                    </Label>
                    <Textarea
                      id="autres"
                      value={revenusData.autres}
                      onChange={(e) => handleRevenusChange('autres', e.target.value)}
                      placeholder={isFrench ? 'Travail à temps partiel, passe-temps rémunérés...' : 'Part-time work, paid hobbies...'}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet 2 : Dépenses et budget */}
          <TabsContent value="depenses" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <CreditCard className="w-6 h-6" />
                  {isFrench ? 'Mes dépenses et budget' : 'My expenses and budget'}
                </CardTitle>
                <p className="text-gray-600">
                  {isFrench 
                    ? 'Planifiez avec vos moyens réels. Chaque dépense peut être optimisée sans sacrifier votre qualité de vie.'
                    : 'Plan with your real means. Every expense can be optimized without sacrificing your quality of life.'
                  }
                </p>
                {/* Barre de progression */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {isFrench ? 'Progression' : 'Progress'}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {getDepensesProgress()} %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getDepensesProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="logement" className="text-gray-700">
                      {isFrench ? 'Logement' : 'Housing'}
                    </Label>
                    <Input
                      id="logement"
                      value={depensesData.logement}
                      onChange={(e) => handleDepensesChange('logement', e.target.value)}
                      placeholder={isFrench ? 'Loyer, hypothèque, taxes...' : 'Rent, mortgage, taxes...'}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="alimentation" className="text-gray-700">
                      {isFrench ? 'Alimentation' : 'Food'}
                    </Label>
                    <Input
                      id="alimentation"
                      value={depensesData.alimentation}
                      onChange={(e) => handleDepensesChange('alimentation', e.target.value)}
                      placeholder={isFrench ? 'Épicerie, restaurants...' : 'Groceries, restaurants...'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="transport" className="text-gray-700">
                      {isFrench ? 'Transport' : 'Transportation'}
                    </Label>
                    <Input
                      id="transport"
                      value={depensesData.transport}
                      onChange={(e) => handleDepensesChange('transport', e.target.value)}
                      placeholder={isFrench ? 'Voiture, transport en commun...' : 'Car, public transport...'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sante" className="text-gray-700">
                      {isFrench ? 'Santé' : 'Health'}
                    </Label>
                    <Input
                      id="sante"
                      value={depensesData.sante}
                      onChange={(e) => handleDepensesChange('sante', e.target.value)}
                      placeholder={isFrench ? 'Médicaments, soins...' : 'Medications, care...'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="loisirs" className="text-gray-700">
                      {isFrench ? 'Loisirs' : 'Entertainment'}
                    </Label>
                    <Input
                      id="loisirs"
                      value={depensesData.loisirs}
                      onChange={(e) => handleDepensesChange('loisirs', e.target.value)}
                      placeholder={isFrench ? 'Sorties, hobbies...' : 'Outings, hobbies...'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="autres" className="text-gray-700">
                      {isFrench ? 'Autres dépenses' : 'Other expenses'}
                    </Label>
                    <Input
                      id="autres"
                      value={depensesData.autres}
                      onChange={(e) => handleDepensesChange('autres', e.target.value)}
                      placeholder={isFrench ? 'Vêtements, services...' : 'Clothing, services...'}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet 3 : Calculs de retraite */}
          <TabsContent value="calculs" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-800">
                  <BarChart3 className="w-6 h-6" />
                  {isFrench ? 'Mes calculs de retraite' : 'My retirement calculations'}
                </CardTitle>
                <p className="text-gray-700">
                  {isFrench 
                    ? 'Votre retraite sera unique, comme vous. Ces calculs vous donnent une vision réaliste de votre avenir.'
                    : 'Your retirement will be unique, just like you. These calculations give you a realistic vision of your future.'
                  }
                </p>
                {/* Barre de progression */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {isFrench ? 'Progression' : 'Progress'}
                    </span>
                    <span className="text-sm font-bold text-purple-600">
                      {getCalculsProgress()} %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getCalculsProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ageRetraite" className="text-gray-700">
                      {isFrench ? 'Âge souhaité de retraite' : 'Desired retirement age'}
                    </Label>
                    <Input
                      id="ageRetraite"
                      type="number"
                      value={calculsData.ageRetraite}
                      onChange={(e) => handleCalculsChange('ageRetraite', e.target.value)}
                      placeholder={isFrench ? 'Ex : 65 ans' : 'Ex: 65 years'}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="revenusMensuels" className="text-gray-700">
                      {isFrench ? 'Revenus mensuels projetés' : 'Projected monthly income'}
                    </Label>
                    <Input
                      id="revenusMensuels"
                      value={calculsData.revenusMensuels}
                      onChange={(e) => handleCalculsChange('revenusMensuels', e.target.value)}
                      placeholder={isFrench ? 'Montant en dollars' : 'Amount in dollars'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="depensesMensuelles" className="text-gray-700">
                      {isFrench ? 'Dépenses mensuelles projetées' : 'Projected monthly expenses'}
                    </Label>
                    <Input
                      id="depensesMensuelles"
                      value={calculsData.depensesMensuelles}
                      onChange={(e) => handleCalculsChange('depensesMensuelles', e.target.value)}
                      placeholder={isFrench ? 'Montant en dollars' : 'Amount in dollars'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="epargneNecessaire" className="text-gray-700">
                      {isFrench ? 'Épargne nécessaire' : 'Required savings'}
                    </Label>
                    <Input
                      id="epargneNecessaire"
                      value={calculsData.epargneNecessaire}
                      onChange={(e) => handleCalculsChange('epargneNecessaire', e.target.value)}
                      placeholder={isFrench ? 'Montant en dollars' : 'Amount in dollars'}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Résumé encourageant */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200 mt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-purple-800">
                      {isFrench ? 'Votre plan prend forme !' : 'Your plan is taking shape!'}
                    </h3>
                  </div>
                  <p className="text-purple-700">
                    {isFrench 
                      ? 'Chaque information que vous ajoutez nous aide à créer un plan de retraite plus précis et personnalisé. Continuez, vous y êtes presque !'
                      : 'Every piece of information you add helps us create a more accurate and personalized retirement plan. Keep going, you\'re almost there!'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation et encouragement */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 mt-8">
          <CardContent className="py-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-8 h-8 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800">
                {isFrench ? 'Excellent travail !' : 'Excellent work!'}
              </h2>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              {isFrench 
                ? 'Vous construisez votre avenir financier étape par étape. Chaque détail compte pour créer un plan qui vous ressemble vraiment.'
                : 'You are building your financial future step by step. Every detail counts to create a plan that truly reflects you.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => setActiveTab('profil')}
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                {isFrench ? 'Retour à mon profil' : 'Back to my profile'}
              </Button>
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

      {/* Onboarding Wizard */}
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
