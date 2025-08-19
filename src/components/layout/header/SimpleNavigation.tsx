import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  Users, 
  Shield, 
  DollarSign, 
  TrendingUp, 
  Calculator,
  Zap, 
  FileText,
  AlertTriangle,
  Crown
} from 'lucide-react';

export const SimpleNavigation: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: language === 'fr' ? 'Tableau de bord' : 'Dashboard', icon: BarChart3 },
    { id: 'profile', label: language === 'fr' ? 'Profil' : 'Profile', icon: Users },
    { id: 'retirement', label: language === 'fr' ? 'Retraite' : 'Retirement', icon: Shield },
    { id: 'savings', label: language === 'fr' ? 'Épargne' : 'Savings', icon: DollarSign },
    { id: 'cashflow', label: language === 'fr' ? 'Flux de trésorerie' : 'Cashflow', icon: TrendingUp },
    { id: 'cpp', label: 'CPP', icon: Calculator },
    { id: 'cpp-rrq', label: 'CPP+RRQ', icon: FileText },
    { id: 'advanced-expenses', label: language === 'fr' ? 'Dépenses avancées' : 'Advanced Expenses', icon: Zap },
    { id: 'optimization', label: language === 'fr' ? 'Optimisation' : 'Optimization', icon: Crown },
  ];

  const handleNavigationClick = (itemId: string) => {
    if (itemId === 'dashboard') {
      navigate(language === 'fr' ? '/fr/retraite-module-phase1' : '/en/retirement-module-phase1');
    } else {
      navigate(language === 'fr' ? `/fr/retraite-module?section=${itemId}` : `/en/retirement-module?section=${itemId}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo et titre - FORCÉ avec timestamp */}
          <div className="flex items-center space-x-3">
            <img 
              src={`/logo-planretraite.png?v=${Date.now()}`}
              alt="MonPlanRetraite.ca Logo" 
              className="h-8 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden text-lg font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded">
              MonPlanRetraite.ca
            </div>
          </div>

          {/* Navigation horizontale */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigationClick(item.id)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Utilisateur et déconnexion */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  {language === 'fr' ? 'Bonjour' : 'Hello'} {user.displayName || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {language === 'fr' ? 'Déconnexion' : 'Sign Out'}
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {language === 'fr' ? 'Se connecter' : 'Sign In'}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavigation;
