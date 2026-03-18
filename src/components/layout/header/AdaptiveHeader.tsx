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

  const isHomePage = location.pathname === '/' || location.pathname === '/fr' || location.pathname === '/en';

  const seniorsPages = isEnglish
    ? [
        {
          key: '/start-here',
          label: 'Where to start',
          description: 'A simple guided path',
          icon: '1',
        },
        {
          key: '/tools',
          label: 'My tools',
          description: 'Grouped by real needs',
          icon: '2',
        },
        {
          key: '/my-dossier',
          label: 'My dossier',
          description: 'Prepare for my planner',
          icon: '3',
        },
        {
          key: '/en/blog',
          label: 'Guides',
          description: 'Read simple articles',
          icon: '4',
        },
      ]
    : [
        {
          key: '/commencer',
          label: 'Par où commencer',
          description: 'Un parcours guidé simple',
          icon: '1',
        },
        {
          key: '/outils',
          label: 'Mes outils',
          description: 'Classés par besoin',
          icon: '2',
        },
        {
          key: '/mon-dossier',
          label: 'Mon dossier',
          description: 'Préparer mon rendez-vous',
          icon: '3',
        },
        {
          key: '/blog',
          label: 'Articles',
          description: 'Lire des guides simples',
          icon: '4',
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
      <UniformHeader isEnglish={isEnglish} />

      {isHomePage && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <SeniorsNavigation
              title={isEnglish ? 'Main Menu' : 'Menu principal'}
              subtitle={isEnglish ? 'Choose a simple path' : 'Choisissez un parcours simple'}
              pages={seniorsPages}
            />
          </div>
        </div>
      )}

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
