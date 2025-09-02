import React from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import MainTopNav from './MainTopNav';

interface UniformHeaderProps {
  isEnglish: boolean;
}

export const UniformHeader: React.FC<UniformHeaderProps> = ({ isEnglish }) => {
  const navigate = useNavigate();

  const pages = isEnglish
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

  return (
    <header className="bg-white shadow-lg border-b-2 border-blue-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        {/* Top bar with logo + language */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(isEnglish ? '/home' : '/accueil')}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo-planretraite.png"
              alt="MonPlanRetraite.ca Logo"
              className="h-6 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span className="sr-only">MonPlanRetraite.ca</span>
          </button>

          <LanguageSelector isEnglish={isEnglish} />
        </div>

        {/* Top navigation bar */}
        <div className="mt-1">
          <MainTopNav isEnglish={isEnglish} />
        </div>
      </div>
    </header>
  );
};

export default UniformHeader;
