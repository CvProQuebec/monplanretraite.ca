// src/features/retirement/sections/BackupSection.tsx
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Download, Upload, Lock, FileText, AlertTriangle, CheckCircle, LogIn } from 'lucide-react';
import DataBackupManager from '../components/DataBackupManager';
import { UserData } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../translations/index';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface BackupSectionProps {
  data: UserData;
  onDataLoad: (data: UserData) => void;
}

export const BackupSection: React.FC<BackupSectionProps> = ({ data, onDataLoad }) => {
  const { language } = useLanguage();
  const { user, signInWithGoogle, loading, signOut } = useAuth();
  const t = translations[language];

  // Logs de débogage
  useEffect(() => {
    console.log('🔍 BackupSection - État de l\'authentification:', { user, loading });
    console.log('🔍 BackupSection - signInWithGoogle disponible:', typeof signInWithGoogle);
    console.log('🔍 BackupSection - Variables Firebase:', {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
    });
    console.log('🔍 BackupSection - Condition !user:', !user);
    console.log('🔍 BackupSection - Type de user:', typeof user);
    console.log('🔍 BackupSection - Valeur exacte de user:', user);
    console.log('🔍 BackupSection - Condition de rendu de la carte de connexion:', !user && !loading);
    
    // Log spécifique pour l'utilisateur connecté
    if (user) {
      console.log('🔍 BackupSection - UTILISATEUR CONNECTÉ:', {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        plan: user.plan
      });
    } else {
      console.log('🔍 BackupSection - AUCUN UTILISATEUR CONNECTÉ');
    }
  }, [user, loading, signInWithGoogle]);

  const handleGoogleSignIn = async () => {
    console.log('🚀 Tentative de connexion Google...');
    try {
      console.log('📞 Appel de signInWithGoogle...');
      await signInWithGoogle();
      console.log('✅ Connexion réussie !');
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          {language === 'fr' ? 'Sauvegarde et Sécurité' : 'Backup & Security'}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {language === 'fr' 
            ? 'Protégez vos données de retraite avec un chiffrement de niveau bancaire. Sauvegardez et restaurez vos informations en toute sécurité.'
            : 'Protect your retirement data with bank-level encryption. Save and restore your information securely.'
          }
        </p>
      </div>

      {/* Indicateur de connexion */}
      {user && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-800 text-lg">
              <Shield className="h-5 w-5" />
              {language === 'fr' ? 'Connecté' : 'Connected'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-green-700">
                  {language === 'fr' ? 'Connecté en tant que :' : 'Connected as:'}
                </p>
                <p className="font-medium text-green-800">{user.displayName || user.email}</p>
                <p className="text-xs text-green-600">
                  {language === 'fr' ? 'Plan :' : 'Plan:'} {user.plan}
                </p>
              </div>
              <Button
                onClick={async () => {
                  try {
                    await signOut();
                    console.log('🔍 BackupSection - Déconnexion réussie');
                  } catch (error) {
                    console.error('❌ BackupSection - Erreur de déconnexion:', error);
                  }
                }}
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                {language === 'fr' ? 'Déconnecter' : 'Sign Out'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section de connexion si l'utilisateur n'est pas connecté */}
      {(() => {
        console.log('🔍 BackupSection - Rendu conditionnel - user:', user, 'loading:', loading, '!user:', !user);
        return !user && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-blue-800">
                {language === 'fr' ? 'Connexion Requise' : 'Login Required'}
              </CardTitle>
              <CardDescription className="text-blue-600">
                {language === 'fr' 
                  ? 'Connectez-vous pour accéder à la sauvegarde sécurisée de vos données'
                  : 'Sign in to access secure backup of your data'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  État: {loading ? 'Chargement...' : 'Prêt'} | 
                  Utilisateur: {user ? 'Connecté' : 'Non connecté'}
                </p>
              </div>
              <Button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 px-8 py-3"
              >
                <LogIn className="w-5 h-5 mr-3" />
                {loading 
                  ? (language === 'fr' ? 'Connexion...' : 'Signing in...')
                  : (language === 'fr' ? 'Continuer avec Google' : 'Continue with Google')
                }
              </Button>
              
              <div className="text-sm text-blue-600">
                <Shield className="w-4 h-4 inline mr-1" />
                {language === 'fr' 
                  ? 'Connexion sécurisée et privée'
                  : 'Secure and private login'
                }
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Gestionnaire de sauvegarde principal - visible seulement si connecté */}
      {user && <DataBackupManager data={data} onDataLoad={onDataLoad} />}

      {/* Informations sur la sécurité */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SecurityFeatureCard
          icon={<Lock className="h-6 w-6" />}
          title={language === 'fr' ? 'Chiffrement AES-256' : 'AES-256 Encryption'}
          description={
            language === 'fr'
              ? 'Vos données sont protégées par un chiffrement militaire de niveau bancaire'
              : 'Your data is protected by military-grade, bank-level encryption'
          }
        />
        
        <SecurityFeatureCard
          icon={<Shield className="h-6 w-6" />}
          title={language === 'fr' ? 'Protection par mot de passe' : 'Password Protection'}
          description={
            language === 'fr'
              ? 'Seul vous pouvez accéder à vos données avec votre mot de passe personnel'
              : 'Only you can access your data with your personal password'
          }
        />
        
        <SecurityFeatureCard
          icon={<FileText className="h-6 w-6" />}
          title={language === 'fr' ? 'Fichiers locaux' : 'Local Files'}
          description={
            language === 'fr'
              ? 'Vos données restent sur votre appareil, jamais sur nos serveurs'
              : 'Your data stays on your device, never on our servers'
          }
        />
      </div>

      {/* Conseils de sécurité */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            {language === 'fr' ? 'Conseils de sécurité' : 'Security Tips'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">
                {language === 'fr' ? 'Utilisez un mot de passe fort' : 'Use a strong password'}
              </p>
              <p className="text-sm text-amber-700">
                {language === 'fr' 
                  ? 'Minimum 8 caractères avec lettres, chiffres et symboles'
                  : 'Minimum 8 characters with letters, numbers and symbols'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">
                {language === 'fr' ? 'Sauvegardez régulièrement' : 'Backup regularly'}
              </p>
              <p className="text-sm text-amber-700">
                {language === 'fr' 
                  ? 'Créez des sauvegardes après chaque modification importante'
                  : 'Create backups after each significant change'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">
                {language === 'fr' ? 'Stockez en lieu sûr' : 'Store safely'}
              </p>
              <p className="text-sm text-amber-700">
                {language === 'fr' 
                  ? 'Gardez vos fichiers de sauvegarde dans un endroit sécurisé'
                  : 'Keep your backup files in a secure location'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques de sauvegarde - visible seulement si connecté */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              {language === 'fr' ? 'Statistiques de sauvegarde' : 'Backup Statistics'}
            </CardTitle>
            <CardDescription>
              {language === 'fr' 
                ? 'Informations sur vos données et leur protection'
                : 'Information about your data and its protection'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {language === 'fr' ? 'Dernière sauvegarde' : 'Last backup'}
                </p>
                <p className="text-lg font-semibold">
                  {language === 'fr' ? 'Jamais' : 'Never'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {language === 'fr' ? 'Taille des données' : 'Data size'}
                </p>
                <p className="text-lg font-semibold">
                  {new Blob([JSON.stringify(data)]).size} bytes
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {language === 'fr' ? 'Version de l\'application' : 'App version'}
                </p>
                <p className="text-lg font-semibold">1.0.0</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {language === 'fr' ? 'Niveau de sécurité' : 'Security level'}
                </p>
                <p className="text-lg font-semibold text-green-600">
                  {language === 'fr' ? 'Élevé' : 'High'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Composant pour les fonctionnalités de sécurité
const SecurityFeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <div className="text-blue-600">{icon}</div>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};
