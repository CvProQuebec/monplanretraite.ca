import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { UniformHeader } from './UniformHeader';
import { SeniorsNavigation } from '../../navigation/SeniorsNavigation';

interface AdaptiveHeaderProps {
  isEnglish: boolean;
}

export const AdaptiveHeader: React.FC<AdaptiveHeaderProps> = ({ isEnglish }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, signOut } = useAuth();

  // Déterminer si on est sur la page d'accueil
  const isHomePage = location.pathname === '/' || location.pathname === '/fr' || location.pathname === '/en';

  // Pages pour les 4 blocs seniors (uniquement sur la page d'accueil)
  const seniorsPages = isEnglish
    ? [
        {
          key: '/home',
          label: 'How does it work?',
          description: 'Simple step-by-step guide',
          icon: '🧭',
        },
        {
          key: '/profile',
          label: 'Who am I?',
          description: 'Your basic information',
          icon: '👤',
        },
        {
          key: '/en/retirement',
          label: 'How much money will I have?',
          description: 'Plan my retirement',
          icon: '💰',
        },
        {
          key: '/en/retirement-reports',
          label: 'Will I be okay?',
          description: 'See my results',
          icon: '📊',
        },
      ]
    : [
        {
          key: '/accueil',
          label: 'Comment ça fonctionne?',
          description: 'Guide simple pas à pas',
          icon: '🧭',
        },
        {
          key: '/profil',
          label: 'Qui suis-je?',
          description: 'Mes informations de base',
          icon: '👤',
        },
        {
          key: '/fr/retraite',
          label: "Combien d'argent aurai-je?",
          description: 'Calculer ma retraite',
          icon: '💰',
        },
        {
          key: '/fr/rapports-retraite',
          label: 'Est-ce que je serai correct?',
          description: 'Voir mes résultats',
          icon: '📊',
        },
      ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <div>
      {/* Header avec navigation élégante */}
      <UniformHeader isEnglish={isEnglish} />
      
      {/* Seniors-friendly 4-block navigation - UNIQUEMENT sur la page d'accueil */}
      {isHomePage && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <SeniorsNavigation
              title={isEnglish ? 'Main Menu' : 'Menu principal'}
              subtitle={isEnglish ? 'Click on the desired section' : 'Cliquez sur la section désirée'}
              pages={seniorsPages}
            />
          </div>
        </div>
      )}

      {/* User info and sign out - only show if user is logged in and not on home page */}
      {user && !isHomePage && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-end gap-4 text-sm">
              <span className="text-gray-600">
                {language === 'fr' ? 'Bonjour' : 'Hello'} {user.displayName || user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {language === 'fr' ? 'Déconnexion' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveHeader;
