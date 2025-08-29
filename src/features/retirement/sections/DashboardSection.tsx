// src/features/retirement/sections/DashboardSection.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import DataBackupManager from '../components/DataBackupManager';
import { useRetirementData } from '../hooks/useRetirementData';
import { useToast } from '@/hooks/use-toast';
import AdvancedUpgradeModal from '@/components/ui/advanced-upgrade-modal';
import { PLAN_CONFIG } from '@/config/plans';
import { Shield, ArrowRight, Lock, AlertTriangle, Crown, Zap, TrendingUp, Target, Users, Calculator, Rocket, Sparkles, Brain, Star, DollarSign, BarChart3, Database, Lock as LockIcon, AlertCircle, CheckCircle, Info, FileText, Building, CreditCard, PiggyBank, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AdvancedResultsDashboard } from '../components/AdvancedResultsDashboard';
import { useNavigate } from 'react-router-dom';

interface DashboardSectionProps {
  data?: any;
  calculations?: any;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ data, calculations }) => {
  const { user, loading, signInWithGoogle } = useAuth();
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const { userData: localData, updateUserData } = useRetirementData();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // États pour les onglets de planification
  const [activeTab, setActiveTab] = useState('revenus');
  
  const [revenusData, setRevenusData] = useState({
    salaire: '',
    pensions: '',
    epargne: '',
    immobilier: '',
    autres: ''
  });

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

  // Synchronisation des données du profil avec la page revenus
  useEffect(() => {
    if (localData.personal) {
      // Synchroniser le salaire du profil avec la page revenus
      if (localData.personal.salaire1) {
        setRevenusData(prev => ({
          ...prev,
          salaire: localData.personal.salaire1.toString()
        }));
      }
    }
  }, [localData.personal]);

  // Gestionnaires pour les changements de données
  const handleRevenusChange = (field: string, value: string) => {
    setRevenusData(prev => ({ ...prev, [field]: value }));
    
    // Si c'est le salaire, mettre à jour le profil
    if (field === 'salaire') {
      const numericValue = parseFloat(value.replace(/[^\d.]/g, '')) || 0;
      updateUserData('personal', { salaire1: numericValue });
    }
  };

  const handleDepensesChange = (field: string, value: string) => {
    setDepensesData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculsChange = (field: string, value: string) => {
    setCalculsData(prev => ({ ...prev, [field]: value }));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Calculs de progression
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
  
  // Fonction pour gérer le chargement des données
  const handleDataLoad = (newData: any) => {
    console.log('🔄 Données chargées dans DashboardSection:', newData);
    
    try {
      // Vérifier que les données sont valides
      if (!newData || typeof newData !== 'object') {
        console.error('❌ Données invalides reçues:', newData);
        toast({
          title: "Erreur de chargement",
          description: "Les données reçues sont invalides",
          variant: "destructive"
        });
        return;
      }
      
      // Vérifier la structure des données
      console.log('🔍 Structure des données reçues:', Object.keys(newData));
      console.log('🔍 Données locales actuelles:', Object.keys(localData));
      
      // Mettre à jour chaque section des données
      let updatedSections = 0;
      Object.keys(newData).forEach(section => {
        if (section in localData && newData[section]) {
          console.log(`🔄 Mise à jour de la section: ${section}`, newData[section]);
          try {
            updateUserData(section as keyof typeof localData, newData[section]);
            updatedSections++;
            console.log(`✅ Section ${section} mise à jour avec succès`);
          } catch (updateError) {
            console.error(`❌ Erreur lors de la mise à jour de ${section}:`, updateError);
          }
        } else {
          console.warn(`⚠️ Section ${section} non trouvée dans localData ou vide`);
        }
      });
      
      console.log(`✅ ${updatedSections} sections mises à jour sur ${Object.keys(newData).length} reçues`);
      
      if (updatedSections > 0) {
        // Afficher un message de succès
        toast({
          title: "Données chargées",
          description: `${updatedSections} sections de données ont été restaurées avec succès`,
          variant: "default"
        });
        
        // Attendre que les données soient bien appliquées
        setTimeout(() => {
          console.log('🔄 Interface mise à jour avec succès');
          // Forcer une mise à jour de l'interface si nécessaire
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('storage'));
          }
        }, 500);
      } else {
        toast({
          title: "Aucune donnée restaurée",
          description: "Vérifiez que le fichier contient des données valides",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour des données:', error);
      toast({
        title: "Erreur de mise à jour",
        description: "Erreur lors de la restauration des données",
        variant: "destructive"
      });
    }
  };
  
  // Utiliser les props ou les données locales
  const userData = data || localData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      {/* Particules de fond visibles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
        <div className="absolute top-96 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute top-72 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute top-48 left-1/5 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-88 right-1/5 w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* En-tête spectaculaire */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
            {isEnglish ? '🚀 Financial Dashboard' : '🚀 Tableau de bord financier'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            {isEnglish 
              ? 'Transform your financial data into spectacular insights and planning'
              : 'Transformez vos données financières en insights et planification spectaculaires'
            }
          </p>
        </div>

        {/* 1. Votre Aperçu Financier - Déplacé en première position */}
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl backdrop-blur-sm mb-12">
          <CardHeader className="border-b border-slate-600 bg-gradient-to-r from-slate-600/20 to-slate-500/20">
            <CardTitle className="text-2xl font-bold text-slate-300 flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              {isEnglish ? 'Your Financial Overview' : 'Votre Aperçu Financier'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-green-500/20 rounded-lg border border-green-500/30">
                <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-green-300">
                  ${(userData?.savings?.totalEpargne || 0).toLocaleString()}
                </div>
                <div className="text-green-200">
                  {isEnglish ? 'Total Savings' : 'Épargne Totale'}
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-600/20 to-blue-500/20 rounded-lg border border-blue-500/30">
                <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-blue-300">
                  {userData?.personal?.ageRetraite1 || 65}
                </div>
                <div className="text-blue-200">
                  {isEnglish ? 'Retirement Age' : 'Âge de Retraite'}
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-purple-500/20 rounded-lg border border-purple-500/30">
                <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-purple-300">
                  {isEnglish ? 'Progress' : 'Progression'}
                </div>
                <div className="text-purple-200">
                  {isEnglish ? '35% Complete' : '35% Complété'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Planification de retraite - Déplacé en deuxième position */}
        <Card className="bg-gradient-to-br from-emerald-800/90 to-teal-800/90 border-0 shadow-2xl backdrop-blur-sm mb-12">
          <CardHeader className="border-b border-emerald-600 bg-gradient-to-r from-emerald-600/20 to-teal-600/20">
            <CardTitle className="text-2xl font-bold text-emerald-300 flex items-center gap-3">
              <Target className="w-8 h-8" />
              {isEnglish ? 'Retirement Planning' : 'Planification de retraite'}
            </CardTitle>
            <p className="text-emerald-200">
              {isEnglish 
                ? 'Plan your retirement step by step with our comprehensive tools'
                : 'Planifiez votre retraite étape par étape avec nos outils complets'
              }
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
                <TabsTrigger value="revenus" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  {isEnglish ? 'Income & Assets' : 'Revenus & Actifs'}
                </TabsTrigger>
                <TabsTrigger value="depenses" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  {isEnglish ? 'Expenses & Budget' : 'Dépenses & Budget'}
                </TabsTrigger>
                <TabsTrigger value="calculs" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  {isEnglish ? 'Calculations' : 'Calculs'}
                </TabsTrigger>
              </TabsList>

              {/* Onglet 1 : Revenus et actifs */}
              <TabsContent value="revenus" className="space-y-6">
                <Card className="bg-slate-700/50 border-slate-600 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-emerald-300">
                      <DollarSign className="w-6 h-6" />
                      {isEnglish ? 'My income sources' : 'Mes sources de revenus'}
                    </CardTitle>
                    <p className="text-slate-300">
                      {isEnglish 
                        ? 'Let\'s identify all your income sources to build a solid retirement plan.'
                        : 'Identifions toutes vos sources de revenus pour construire un plan de retraite solide.'
                      }
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="salaire" className="text-slate-300">
                          {isEnglish ? 'Salary / Employment income' : 'Salaire / Revenus d\'emploi'}
                        </Label>
                        <Input
                          id="salaire"
                          value={revenusData.salaire}
                          onChange={(e) => handleRevenusChange('salaire', e.target.value)}
                          placeholder={isEnglish ? 'Annual salary amount' : 'Montant du salaire annuel'}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="pensions" className="text-slate-300">
                          {isEnglish ? 'Pensions / RRSP' : 'Pensions / REER'}
                        </Label>
                        <Input
                          id="pensions"
                          value={revenusData.pensions}
                          onChange={(e) => handleRevenusChange('pensions', e.target.value)}
                          placeholder={isEnglish ? 'Pension amounts' : 'Montants des pensions'}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="epargne" className="text-slate-300">
                          {isEnglish ? 'Savings & Investments' : 'Épargne & Investissements'}
                        </Label>
                        <Input
                          id="epargne"
                          value={revenusData.epargne}
                          onChange={(e) => handleRevenusChange('epargne', e.target.value)}
                          placeholder={isEnglish ? 'Total savings amount' : 'Montant total de l\'épargne'}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="immobilier" className="text-slate-300">
                          {isEnglish ? 'Real Estate Income' : 'Revenus immobiliers'}
                        </Label>
                        <Input
                          id="immobilier"
                          value={revenusData.immobilier}
                          onChange={(e) => handleRevenusChange('immobilier', e.target.value)}
                          placeholder={isEnglish ? 'Rental income, property value' : 'Revenus locatifs, valeur des biens'}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="autres" className="text-slate-300">
                          {isEnglish ? 'Other Income' : 'Autres revenus'}
                        </Label>
                        <Input
                          id="autres"
                          value={revenusData.autres}
                          onChange={(e) => handleRevenusChange('autres', e.target.value)}
                          placeholder={isEnglish ? 'Business, inheritance, etc.' : 'Entreprise, héritage, etc.'}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet 2 : Dépenses et budget */}
              <TabsContent value="depenses" className="space-y-6">
                <Card className="bg-slate-700/50 border-slate-600 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-emerald-300">
                      <CreditCard className="w-6 h-6" />
                      {isEnglish ? 'My monthly expenses' : 'Mes dépenses mensuelles'}
                    </CardTitle>
                    <p className="text-slate-300">
                      {isEnglish 
                        ? 'Understanding your expenses helps us calculate how much you\'ll need in retirement.'
                        : 'Comprendre vos dépenses nous aide à calculer combien vous aurez besoin à la retraite.'
                      }
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="logement" className="text-slate-300">
                          {isEnglish ? 'Housing' : 'Logement'}
                        </Label>
                        <Input
                          id="logement"
                          value={depensesData.logement}
                          onChange={(e) => handleDepensesChange('logement', e.target.value)}
                          placeholder={isEnglish ? 'Rent, mortgage, utilities' : 'Loyer, hypothèque, services publics'}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="alimentation" className="text-slate-300">
                          {isEnglish ? 'Food & Groceries' : 'Alimentation & Épicerie'}
                        </Label>
                        <Input
                          id="alimentation"
                          value={depensesData.alimentation}
                          onChange={(e) => handleDepensesChange('alimentation', e.target.value)}
                          placeholder={isEnglish ? 'Monthly food budget' : 'Budget alimentaire mensuel'}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="transport" className="text-slate-300">
                          {isEnglish ? 'Transportation' : 'Transport'}
                        </Label>
                        <Input
                          id="transport"
                          value={depensesData.transport}
                          onChange={(e) => handleDepensesChange('transport', e.target.value)}
                          placeholder={isEnglish ? 'Car, public transit, fuel' : 'Voiture, transport en commun, essence'}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="sante" className="text-slate-300">
                          {isEnglish ? 'Healthcare' : 'Santé'}
                        </Label>
                        <Input
                          id="sante"
                          value={depensesData.sante}
                          onChange={(e) => handleDepensesChange('sante', e.target.value)}
                          placeholder={isEnglish ? 'Medications, insurance, care' : 'Médicaments, assurances, soins'}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Onglet 3 : Calculs de retraite */}
              <TabsContent value="calculs" className="space-y-6">
                <Card className="bg-slate-700/50 border-slate-600 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-emerald-300">
                      <BarChart3 className="w-6 h-6" />
                      {isEnglish ? 'My retirement calculations' : 'Mes calculs de retraite'}
                    </CardTitle>
                    <p className="text-slate-300">
                      {isEnglish 
                        ? 'Let\'s calculate your retirement needs and create a personalized plan.'
                        : 'Calculons vos besoins de retraite et créons un plan personnalisé.'
                      }
                    </p>
                    {/* Barre de progression */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300">
                          {isEnglish ? 'Progress' : 'Progression'}
                        </span>
                        <span className="text-sm font-bold text-emerald-400">
                          {getCalculsProgress()} %
                        </span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getCalculsProgress()}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ageRetraite" className="text-slate-300">
                          {isEnglish ? 'Desired retirement age' : 'Âge souhaité de retraite'}
                        </Label>
                        <Input
                          id="ageRetraite"
                          type="number"
                          value={calculsData.ageRetraite}
                          onChange={(e) => handleCalculsChange('ageRetraite', e.target.value)}
                          placeholder={isEnglish ? 'Ex: 65 years' : 'Ex : 65 ans'}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="revenusMensuels" className="text-slate-300">
                          {isEnglish ? 'Projected monthly income' : 'Revenus mensuels projetés'}
                        </Label>
                        <Input
                          id="revenusMensuels"
                          value={calculsData.revenusMensuels}
                          onChange={(e) => handleCalculsChange('revenusMensuels', e.target.value)}
                          placeholder={isEnglish ? 'Amount in dollars' : 'Montant en dollars'}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="depensesMensuelles" className="text-slate-300">
                          {isEnglish ? 'Projected monthly expenses' : 'Dépenses mensuelles projetées'}
                        </Label>
                        <Input
                          id="depensesMensuelles"
                          value={calculsData.depensesMensuelles}
                          onChange={(e) => handleCalculsChange('depensesMensuelles', e.target.value)}
                          placeholder={isEnglish ? 'Amount in dollars' : 'Montant en dollars'}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="epargneNecessaire" className="text-slate-300">
                          {isEnglish ? 'Required savings' : 'Épargne nécessaire'}
                        </Label>
                        <Input
                          id="epargneNecessaire"
                          value={calculsData.epargneNecessaire}
                          onChange={(e) => handleCalculsChange('epargneNecessaire', e.target.value)}
                          placeholder={isEnglish ? 'Amount in dollars' : 'Montant en dollars'}
                          className="mt-1 bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                    </div>

                    {/* Résumé encourageant */}
                    <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-4 rounded-lg border border-emerald-400/30 mt-6">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <h3 className="text-lg font-semibold text-emerald-300">
                          {isEnglish ? 'Your plan is taking shape!' : 'Votre plan prend forme !'}
                        </h3>
                      </div>
                      <p className="text-slate-300">
                        {isEnglish 
                          ? 'Every piece of information you add helps us create a more accurate and personalized retirement plan. Keep going, you\'re almost there!'
                          : 'Chaque information que vous ajoutez nous aide à créer un plan de retraite plus précis et personnalisé. Continuez, vous y êtes presque !'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 3. Outils Financiers - Réorganisé selon l'ordre demandé */}
        <Card className="bg-gradient-to-br from-indigo-800/90 to-blue-800/90 border-0 shadow-2xl backdrop-blur-sm mb-12">
          <CardHeader className="border-b border-indigo-600 bg-gradient-to-r from-indigo-600/20 to-blue-600/20">
            <CardTitle className="text-2xl font-bold text-indigo-300 flex items-center gap-3">
              <Zap className="w-8 h-8" />
              {isEnglish ? 'Financial Tools' : 'Outils Financiers'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 1. Profil personnel */}
              <Card className="bg-gradient-to-br from-green-600/20 to-green-500/20 border border-green-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-green-300 mb-2">
                    {isEnglish ? 'Personal Profile' : 'Profil personnel'}
                  </h3>
                  <p className="text-sm text-green-200 mb-3">
                    {isEnglish ? 'Personal information and objectives' : 'Informations personnelles et objectifs'}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-300">Progression</span>
                    <span className="text-gray-300">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <Badge variant="destructive" className="text-xs">Verrouillé</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-green-300 border-green-500/30 hover:bg-green-500/20">
                    {isEnglish ? 'Click to access' : 'Cliquez pour accéder'}
                  </Button>
                </CardContent>
              </Card>

              {/* 2. Informations d'urgence */}
              <Card className="bg-gradient-to-br from-red-600/20 to-red-500/20 border border-red-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-red-300 mb-2">
                    {isEnglish ? 'Emergency Information' : 'Informations d\'urgence'}
                  </h3>
                  <p className="text-sm text-red-200 mb-3">
                    {isEnglish ? 'Medical directives and emergency contacts' : 'Directives médicales et contacts d\'urgence'}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-300">Progression</span>
                    <span className="text-gray-300">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <Badge variant="destructive" className="text-xs">Verrouillé</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-red-300 border-red-500/30 hover:bg-red-500/20">
                    {isEnglish ? 'Click to access' : 'Cliquez pour accéder'}
                  </Button>
                </CardContent>
              </Card>

              {/* 3. Revenus */}
              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-500/20 border border-blue-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-blue-300 mb-2">
                    {isEnglish ? 'Income' : 'Revenus'}
                  </h3>
                  <p className="text-sm text-blue-200 mb-3">
                    {isEnglish ? 'Income sources and employment' : 'Sources de revenus et emploi'}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-300">Progression</span>
                    <span className="text-gray-300">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <Badge variant="destructive" className="text-xs">Verrouillé</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-blue-300 border-blue-500/30 hover:bg-blue-500/20">
                    {isEnglish ? 'Click to access' : 'Cliquez pour accéder'}
                  </Button>
                </CardContent>
              </Card>

              {/* 4. Dépenses */}
              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-500/20 border border-purple-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <CreditCard className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-purple-300 mb-2">
                    {isEnglish ? 'Expenses' : 'Dépenses'}
                  </h3>
                  <p className="text-sm text-purple-200 mb-3">
                    {isEnglish ? 'Monthly expenses and budget' : 'Dépenses mensuelles et budget'}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-300">Progression</span>
                    <span className="text-gray-300">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <Badge variant="destructive" className="text-xs">Verrouillé</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-purple-300 border-purple-500/30 hover:bg-purple-500/20">
                    {isEnglish ? 'Click to access' : 'Cliquez pour accéder'}
                  </Button>
                </CardContent>
              </Card>

              {/* 5. Gestion des épargnes */}
              <Card className="bg-gradient-to-br from-emerald-600/20 to-emerald-500/20 border border-emerald-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-emerald-300 mb-2">
                    {isEnglish ? 'Savings' : 'Épargnes'}
                  </h3>
                  <p className="text-sm text-emerald-200 mb-3">
                    {isEnglish ? 'Track your savings and investments' : 'Suivi de vos économies et investissements'}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-300">Progression</span>
                    <span className="text-gray-300">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <Badge variant="destructive" className="text-xs">Verrouillé</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20">
                    {isEnglish ? 'Click to access' : 'Cliquez pour accéder'}
                  </Button>
                </CardContent>
              </Card>

              {/* 6. Flux de trésorerie */}
              <Card className="bg-gradient-to-br from-orange-600/20 to-orange-500/20 border border-orange-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-orange-300 mb-2">
                    {isEnglish ? 'Cash Flow' : 'Flux de trésorerie'}
                  </h3>
                  <p className="text-sm text-orange-200 mb-3">
                    {isEnglish ? 'Detailed analysis of your cash flow' : 'Analyse détaillée de vos flux de trésorerie'}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-300">Progression</span>
                    <span className="text-gray-300">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <Badge variant="destructive" className="text-xs">Verrouillé</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-orange-300 border-orange-500/30 hover:bg-orange-500/20">
                    {isEnglish ? 'Click to access' : 'Cliquez pour accéder'}
                  </Button>
                </CardContent>
              </Card>

              {/* 7. Prestations gouvernementales */}
              <Card className="bg-gradient-to-br from-indigo-600/20 to-indigo-500/20 border border-indigo-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-indigo-300 mb-2">
                    {isEnglish ? 'Government Benefits' : 'Prestations gouvernementales'}
                  </h3>
                  <p className="text-sm text-indigo-200 mb-3">
                    {isEnglish ? 'OAS, CPP, RRQ calculations' : 'Calculs SV, CPP, RRQ'}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-300">Progression</span>
                    <span className="text-gray-300">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <Badge variant="destructive" className="text-xs">Verrouillé</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20">
                    {isEnglish ? 'Click to access' : 'Cliquez pour accéder'}
                  </Button>
                </CardContent>
              </Card>

              {/* 8. Assistant Financier Personnel */}
              <Card className="bg-gradient-to-br from-pink-600/20 to-pink-500/20 border border-pink-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Brain className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-pink-300 mb-2">
                    {isEnglish ? 'Personal Financial Assistant' : 'Assistant Financier Personnel'}
                  </h3>
                  <p className="text-sm text-pink-200 mb-3">
                    {isEnglish ? 'AI-powered financial advice' : 'Conseils financiers par IA'}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-300">Progression</span>
                    <span className="text-gray-300">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <Badge variant="destructive" className="text-xs">Verrouillé</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-pink-300 border-pink-500/30 hover:bg-pink-500/20">
                    {isEnglish ? 'Click to access' : 'Cliquez pour accéder'}
                  </Button>
                </CardContent>
              </Card>

              {/* 9. Optimisation fiscale */}
              <Card className="bg-gradient-to-br from-amber-600/20 to-amber-500/20 border border-amber-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Calculator className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-amber-300 mb-2">
                    {isEnglish ? 'Tax Optimization' : 'Optimisation fiscale'}
                  </h3>
                  <p className="text-sm text-amber-200 mb-3">
                    {isEnglish ? 'Tax strategies and optimization' : 'Stratégies et optimisation fiscales'}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-300">Progression</span>
                    <span className="text-gray-300">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <Badge variant="destructive" className="text-xs">Verrouillé</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-amber-300 border-amber-500/30 hover:bg-amber-500/20">
                    {isEnglish ? 'Click to access' : 'Cliquez pour accéder'}
                  </Button>
                </CardContent>
              </Card>

              {/* 10. Monte Carlo */}
              <Card className="bg-gradient-to-br from-violet-600/20 to-violet-500/20 border border-violet-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-violet-300 mb-2">
                    {isEnglish ? 'Monte Carlo' : 'Monte Carlo'}
                  </h3>
                  <p className="text-sm text-violet-200 mb-3">
                    {isEnglish ? 'Advanced analyses with 10,000 scenarios' : 'Analyses avancées avec 10,000 scénarios'}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-300">Progression</span>
                    <span className="text-gray-300">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <Badge variant="destructive" className="text-xs">Verrouillé</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-violet-300 border-violet-500/30 hover:bg-violet-500/20">
                    {isEnglish ? 'Click to access' : 'Cliquez pour accéder'}
                  </Button>
                </CardContent>
              </Card>

              {/* 11. Planification successorale */}
              <Card className="bg-gradient-to-br from-rose-600/20 to-rose-500/20 border border-rose-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Crown className="w-8 h-8 text-rose-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-rose-300 mb-2">
                    {isEnglish ? 'Estate Planning' : 'Planification successorale'}
                  </h3>
                  <p className="text-sm text-rose-200 mb-3">
                    {isEnglish ? 'Succession and estate planning' : 'Succession et planification successorale'}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-300">Progression</span>
                    <span className="text-gray-300">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <Badge variant="destructive" className="text-xs">Verrouillé</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-rose-300 border-rose-500/30 hover:bg-rose-500/20">
                    {isEnglish ? 'Click to access' : 'Cliquez pour accéder'}
                  </Button>
                </CardContent>
              </Card>

              {/* 12. Rapports */}
              <Card className="bg-gradient-to-br from-slate-600/20 to-slate-500/20 border border-slate-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-300 mb-2">
                    {isEnglish ? 'Reports' : 'Rapports'}
                  </h3>
                  <p className="text-sm text-slate-200 mb-3">
                    {isEnglish ? 'Detailed financial reports and analysis' : 'Rapports financiers détaillés et analyse'}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-300">Progression</span>
                    <span className="text-gray-300">0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <Badge variant="destructive" className="text-xs">Verrouillé</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-slate-300 border-slate-500/30 hover:bg-slate-500/20">
                    {isEnglish ? 'Click to access' : 'Cliquez pour accéder'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* 4. Excellent travail - Déplacé en quatrième position */}
        <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/30 mt-8 mb-12">
          <CardContent className="py-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-bold text-yellow-300">
                {isEnglish ? 'Excellent work!' : 'Excellent travail !'}
              </h2>
            </div>
            <p className="text-lg text-slate-300 mb-6">
              {isEnglish 
                ? 'You are building your financial future step by step. Every detail counts to create a plan that truly reflects you.'
                : 'Vous construisez votre avenir financier étape par étape. Chaque détail compte pour créer un plan qui vous ressemble vraiment.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => handleNavigation('/mon-profil')}
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
              >
                {isEnglish ? 'Back to my profile' : 'Retour à mon profil'}
              </Button>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                onClick={() => handleNavigation('/mes-resultats')}
              >
                {isEnglish ? 'View my results' : 'Voir mes résultats'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Simulations Monte Carlo avancées */}
        {calculations?.monteCarloResults && (
          <div className="mb-12">
            <AdvancedResultsDashboard 
              calculations={calculations}
              userData={userData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSection;
