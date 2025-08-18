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
import { Shield, ArrowRight, Lock, AlertTriangle, Crown, Zap, TrendingUp, Target, Users, Calculator } from 'lucide-react';

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
  
  // Plan simple par défaut (free)
  const currentPlan = 'free';
  const planInfo = { badge: 'Free', price: 'Gratuit' };
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<string>('');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Erreur de connexion Google:', error);
    }
  };

  const handleUpgradeClick = (feature: string) => {
    setUpgradeFeature(feature);
    setShowUpgradeModal(true);
  };

  const handlePlanUpgradeClick = (targetPlan: string) => {
    setUpgradeFeature('plan_upgrade');
    setShowUpgradeModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section de connexion si l'utilisateur n'est pas connecté */}
      {!user ? (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-900">
              {isEnglish ? 'Connection Required' : 'Connexion Requise'}
            </CardTitle>
            <CardDescription className="text-blue-700">
              {isEnglish 
                ? 'Connect to access the secure backup of your data'
                : 'Connectez-vous pour accéder à la sauvegarde sécurisée de vos données'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4 p-4 bg-blue-100 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-800">
                <Lock className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {isEnglish ? 'Status: Ready' : 'État: Prêt'}
                </span>
                <span className="text-blue-600">|</span>
                <span className="text-sm">
                  {isEnglish ? 'User: Not connected' : 'Utilisateur: Non connecté'}
                </span>
              </div>
            </div>
            <Button
              onClick={handleGoogleSignIn}
              className="bg-white text-blue-700 border-blue-300 hover:bg-blue-50 px-6 py-3 text-lg font-medium"
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              {isEnglish ? 'Continue with Google' : 'Continuer avec Google'}
            </Button>
            <div className="mt-4 text-sm text-blue-600">
              {isEnglish ? 'Secure and private connection' : 'Connexion sécurisée et privée'}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Gestionnaire de sauvegarde si l'utilisateur est connecté
        <div>
          <DataBackupManager data={userData} onDataLoad={handleDataLoad} />
        </div>
      )}

      {/* Section d'informations de sécurité */}
      <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Shield className="h-5 w-5 text-green-600" />
            {isEnglish ? '100% Secure and Confidential' : '100% sécuritaire et confidentiel'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 mb-4">
            {isEnglish 
              ? 'Your data is saved locally, at the location of your choice. No information transits through our servers.'
              : 'Vos données sont sauvegardées localement, à l\'emplacement de votre choix. Aucune information ne transite par nos serveurs.'
            }
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-medium">
                  {isEnglish ? 'Important Notice' : 'Avertissement important'}
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  {isEnglish 
                    ? 'You are responsible for your data, no copy in cache. Save your data regularly.'
                    : 'Vous êtes responsables de vos données, aucune copie en cache. Sauvegardez vos données régulièrement.'
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section des fonctionnalités avec limitations */}
      {user && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Crown className="h-5 w-5 text-purple-600" />
              {isEnglish ? 'Your Plan Features' : 'Fonctionnalités de votre forfait'}
            </CardTitle>
            <CardDescription className="text-purple-600">
              {isEnglish 
                ? `Current plan: Free`
                : `Forfait actuel : Gratuit`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Fonctionnalités du plan gratuit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Planification de base */}
              <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">
                    {isEnglish ? 'Basic Planning' : 'Planification de base'}
                  </h4>
                  <p className="text-sm text-green-600">
                    {isEnglish ? 'Essential retirement planning tools' : 'Outils essentiels de planification'}
                  </p>
                </div>
              </div>

              {/* Gestion du profil */}
              <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">
                    {isEnglish ? 'Profile Management' : 'Gestion du profil'}
                  </h4>
                  <p className="text-sm text-green-600">
                    {isEnglish ? 'Personal data management' : 'Gestion des données personnelles'}
                  </p>
                </div>
              </div>

              {/* Calculs de base */}
              <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg">
                <Calculator className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">
                    {isEnglish ? 'Basic Calculations' : 'Calculs de base'}
                  </h4>
                  <p className="text-sm text-green-600">
                    {isEnglish ? 'Fundamental retirement calculations' : 'Calculs de retraite fondamentaux'}
                  </p>
                </div>
              </div>

              {/* Gestion de l'épargne */}
              <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">
                    {isEnglish ? 'Savings Management' : 'Gestion de l\'épargne'}
                  </h4>
                  <p className="text-sm text-green-600">
                    {isEnglish ? 'Track your savings progress' : 'Suivez vos progrès d\'épargne'}
                  </p>
                </div>
              </div>
            </div>

            {/* Boutons d'upgrade selon le plan actuel */}
            {currentPlan === 'free' && (
              <div className="text-center pt-4 space-y-3">
                <Button
                  onClick={() => handleUpgradeClick('hasMonteCarloSimulations')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  {isEnglish ? 'Upgrade to Professional' : 'Passer au forfait Professional'}
                </Button>
                <div className="text-sm text-purple-600">
                  {isEnglish ? 'Unlock unlimited simulations and advanced features' : 'Débloquez les simulations illimitées et fonctionnalités avancées'}
                </div>
              </div>
            )}

            {/* Pour l'instant, affichons toujours l'option d'upgrade vers Ultimate */}
            <div className="text-center pt-4 space-y-3">
              <Button
                onClick={() => handlePlanUpgradeClick('ultimate')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {isEnglish ? 'Upgrade to Ultimate' : 'Passer au forfait Ultimate'}
              </Button>
              <div className="text-sm text-purple-600">
                {isEnglish ? 'Get AI consulting, integrations and personalized training' : 'Obtenez conseils IA, intégrations et formation personnalisée'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal d'upgrade avancé */}
      {showUpgradeModal && (
        <AdvancedUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          requiredPlan={upgradeFeature === 'plan_upgrade' ? 'ultimate' : 'professional'}
          featureName={upgradeFeature}
          currentPlan={currentPlan}
        />
      )}
    </div>
  );
};

export default DashboardSection;