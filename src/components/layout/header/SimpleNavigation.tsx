import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import '@/styles/modern-retirement.css';
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
    <nav className="retirement-navigation bg-gradient-to-r from-blue-800 to-blue-900 border-b-0 shadow-xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo et titre - FORCÉ avec timestamp */}
          <div className="flex items-center space-x-3">
            <img 
              src={`/logo-planretraite.png?v=${Date.now()}`}
              alt="MonPlanRetraite.ca Logo" 
              className="h-10 w-auto drop-shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden text-xl font-bold text-white bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
              MonPlanRetraite.ca
            </div>
          </div>

          {/* Navigation horizontale - MODERNE et DYNAMIQUE */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigationClick(item.id)}
                className="nav-item flex items-center space-x-2 px-4 py-3 text-sm font-semibold text-white hover:text-white rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Utilisateur et déconnexion - MODERNE et DYNAMIQUE */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-white/90 font-medium">
                  {language === 'fr' ? 'Bonjour' : 'Hello'} {user.displayName || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="btn-primary bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-semibold text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {language === 'fr' ? 'Déconnexion' : 'Sign Out'}
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="btn-secondary bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
