// src/features/retirement/sections/DashboardSection.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import DataBackupManager from '../components/DataBackupManager';
import { useRetirementData } from '../hooks/useRetirementData';
import { useToast } from '@/hooks/use-toast';
import AdvancedUpgradeModal from '@/components/ui/advanced-upgrade-modal';
import { PLAN_CONFIG } from '@/config/plans';
import { Shield, ArrowRight, Lock, AlertTriangle, Crown, Zap, TrendingUp, Target, Users, Calculator, Rocket, Sparkles, Brain, Star, DollarSign, BarChart3, Database, Lock as LockIcon, AlertCircle, CheckCircle, Info } from 'lucide-react';

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
            {isEnglish ? '🚀 Advanced Financial Dashboard' : '🚀 Tableau de bord financier avancé'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            {isEnglish 
              ? 'Transform your financial data into spectacular insights and planning'
              : 'Transformez vos données financières en insights et planification spectaculaires'
            }
          </p>
        </div>

        {/* Gestion des sauvegardes - Design moderne */}
        <Card className="bg-gradient-to-br from-pink-800/90 to-purple-800/90 border-0 shadow-2xl backdrop-blur-sm mb-12">
          <CardHeader className="border-b border-pink-600 bg-gradient-to-r from-pink-600/20 to-purple-600/20">
            <CardTitle className="text-2xl font-bold text-pink-300 flex items-center gap-3">
              <Shield className="w-8 h-8" />
              {isEnglish ? 'Backup Management' : 'Gestion des sauvegardes'}
            </CardTitle>
            <CardDescription className="text-pink-200">
              {isEnglish 
                ? 'Save and load your retirement data securely'
                : 'Sauvegardez et chargez vos données de retraite en toute sécurité'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <DataBackupManager data={userData} onDataLoad={handleDataLoad} />
          </CardContent>
        </Card>

        {/* Sécurité et confidentialité - Design moderne */}
        <Card className="bg-gradient-to-br from-green-800/90 to-emerald-800/90 border-0 shadow-2xl backdrop-blur-sm mb-12">
          <CardHeader className="border-b border-green-600 bg-gradient-to-r from-green-600/20 to-emerald-600/20">
            <CardTitle className="text-2xl font-bold text-green-300 flex items-center gap-3">
              <LockIcon className="w-8 h-8" />
              {isEnglish ? '100% Secure and Confidential' : '100% sécuritaire et confidentiel'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-green-200 text-lg leading-relaxed">
              {isEnglish 
                ? 'Your data is saved locally, at your chosen location. No information transits through our servers.'
                : 'Vos données sont sauvegardées localement, à l\'emplacement de votre choix. Aucune information ne transite par nos serveurs.'
              }
            </div>
            
            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-300 mb-2">
                    {isEnglish ? 'Important Warning' : 'Avertissement important'}
                  </h4>
                  <p className="text-yellow-200">
                    {isEnglish 
                      ? 'You are responsible for your data, no cached copy. Save your data regularly.'
                      : 'Vous êtes responsables de vos données, aucune copie en cache. Sauvegardez vos données régulièrement.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fonctionnalités du forfait - Design moderne */}
        <Card className="bg-gradient-to-br from-blue-800/90 to-indigo-800/90 border-0 shadow-2xl backdrop-blur-sm mb-12">
          <CardHeader className="border-b border-blue-600 bg-gradient-to-r from-blue-600/20 to-indigo-600/20">
            <CardTitle className="text-2xl font-bold text-blue-300 flex items-center gap-3">
              <Crown className="w-8 h-8" />
              {isEnglish ? 'Features of your Plan' : 'Fonctionnalités de votre forfait'}
            </CardTitle>
            <CardDescription className="text-blue-200">
              {isEnglish ? 'Current plan: Free' : 'Forfait actuel : Gratuit'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Planification de base */}
              <Card className="bg-gradient-to-br from-green-600/20 to-green-500/20 border border-green-500/30 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-300 mb-2">
                    {isEnglish ? 'Basic Planning' : 'Planification de base'}
                  </h3>
                  <p className="text-green-200">
                    {isEnglish ? 'Essential planning tools' : 'Outils essentiels de planification'}
                  </p>
                </CardContent>
              </Card>

              {/* Gestion du profil */}
              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-500/20 border border-blue-500/30 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">
                    {isEnglish ? 'Profile Management' : 'Gestion du profil'}
                  </h3>
                  <p className="text-blue-200">
                    {isEnglish ? 'Personal data management' : 'Gestion des données personnelles'}
                  </p>
                </CardContent>
              </Card>

              {/* Calculs de base */}
              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-500/20 border border-purple-500/30 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Calculator className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-purple-300 mb-2">
                    {isEnglish ? 'Basic Calculations' : 'Calculs de base'}
                  </h3>
                  <p className="text-purple-200">
                    {isEnglish ? 'Fundamental retirement calculations' : 'Calculs de retraite fondamentaux'}
                  </p>
                </CardContent>
              </Card>

              {/* Gestion de l'épargne */}
              <Card className="bg-gradient-to-br from-orange-600/20 to-orange-500/20 border border-orange-500/30 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-orange-300 mb-2">
                    {isEnglish ? 'Savings Management' : 'Gestion de l\'épargne'}
                  </h3>
                  <p className="text-orange-200">
                    {isEnglish ? 'Track your savings progress' : 'Suivez vos progrès d\'épargne'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Boutons d'upgrade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg py-4 shadow-2xl transform hover:scale-105 transition-all duration-300"
                size="lg"
              >
                <Crown className="w-6 h-6 mr-3" />
                {isEnglish ? 'Upgrade to Professional Plan' : 'Passer au forfait Professional'}
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg py-4 shadow-2xl transform hover:scale-105 transition-all duration-300"
                size="lg"
              >
                <TrendingUp className="w-6 h-6 mr-3" />
                {isEnglish ? 'Upgrade to Ultimate Plan' : 'Passer au forfait Ultimate'}
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-blue-200 text-sm">
                {isEnglish 
                  ? 'Unlock unlimited simulations and advanced features'
                  : 'Débloquez les simulations illimitées et fonctionnalités avancées'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques et métriques - Design moderne */}
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl backdrop-blur-sm">
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
      </div>
    </div>
  );
};

export default DashboardSection;