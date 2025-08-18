// Composant de navigation par onglets avec animations fluides
import React from 'react';
import { 
  BarChart3, 
  Users, 
  Shield, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Calculator, 
  Zap, 
  FileText,
  Database,
  Lock,
  Flag,
  Crown,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../translations/index';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPlan: 'free' | 'professional' | 'ultimate';
  external?: boolean;
}

interface TabbedNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onExternalNavigation?: (path: string) => void;
}

export const TabbedNavigation: React.FC<TabbedNavigationProps> = ({
  activeTab,
  onTabChange,
  onExternalNavigation
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  const tabs: Tab[] = [
    // Planification de base
    { id: 'dashboard', label: t.navigation.dashboard, icon: BarChart3, requiredPlan: 'free' },
    { id: 'personal', label: t.navigation.profile, icon: Users, requiredPlan: 'free' },
    { id: 'retirement', label: t.navigation.retirement, icon: Shield, requiredPlan: 'free' },
    { id: 'savings', label: t.navigation.savings, icon: DollarSign, requiredPlan: 'free' },
    
    // Fonctionnalités avancées
    { id: 'cashflow', label: t.navigation.cashflow, icon: TrendingUp, requiredPlan: 'professional' },
    { id: 'cpp', label: 'CPP', icon: Flag, requiredPlan: 'professional' },
    { id: 'combined-pension', label: 'CPP+RRQ', icon: BarChart3, requiredPlan: 'professional' },
    { id: 'advanced-expenses', label: t.navigation.advancedExpenses, icon: Calendar, requiredPlan: 'professional' },
    { id: 'tax', label: t.navigation.taxOptimization, icon: Calculator, requiredPlan: 'professional' },
    { id: 'simulator', label: t.navigation.simulator, icon: Zap, requiredPlan: 'professional' },
    
    // Sauvegarde et sécurité
    { id: 'session', label: language === 'fr' ? 'Sauvegarder/Charger' : 'Save/Load', icon: Database, requiredPlan: 'free' },
    { id: 'backup-security', label: language === 'fr' ? 'Conseils de sécurité' : 'Security Tips', icon: Lock, requiredPlan: 'free', external: true },
    
    // Rapports et analyses
    { id: 'reports', label: t.navigation.reports, icon: FileText, requiredPlan: 'professional', external: true },
    { id: 'emergency-info', label: language === 'fr' ? 'Informations d\'urgence' : 'Emergency Info', icon: AlertTriangle, requiredPlan: 'free' },
    
    // Fonctionnalités premium
    { id: 'premium-features', label: language === 'fr' ? 'Premium' : 'Premium', icon: Crown, requiredPlan: 'ultimate' },
  ];

  const handleTabClick = (tab: Tab) => {
    if (tab.external && onExternalNavigation) {
      // Navigation vers les pages externes
      let externalPath = '';
      if (tab.id === 'backup-security') {
        externalPath = language === 'fr' 
          ? `/fr/sauvegarde-securite` 
          : `/en/backup-security`;
      } else if (tab.id === 'reports') {
        externalPath = language === 'fr' 
          ? `/fr/rapports-retraite` 
          : `/en/retirement-reports`;
      }
      onExternalNavigation(externalPath);
    } else {
      onTabChange(tab.id);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex space-x-1 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`
                relative px-6 py-4 text-sm font-medium rounded-t-lg transition-all duration-300
                whitespace-nowrap flex items-center gap-2
                ${activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg transform -translate-y-1 z-10' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:-translate-y-0.5 hover:text-gray-800'
                }
                ${tab.requiredPlan === 'professional' ? 'border-l-2 border-l-blue-400' : ''}
                ${tab.requiredPlan === 'ultimate' ? 'border-l-2 border-l-purple-400' : ''}
              `}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
              {tab.label}
              
              {/* Indicateur de plan requis */}
              {tab.requiredPlan === 'professional' && (
                <span className="ml-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                  Pro
                </span>
              )}
              {tab.requiredPlan === 'ultimate' && (
                <span className="ml-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                  Ultimate
                </span>
              )}
              
              {/* Effet de brillance au hover */}
              <div className={`
                absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-t-lg
                ${activeTab === tab.id ? 'hidden' : ''}
              `} />
            </button>
          ))}
        </div>
        
        {/* Indicateur de plan actuel */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4" />
            {language === 'fr' ? 'Plan actuel : Gratuit' : 'Current plan: Free'}
          </div>
        </div>
      </div>
    </div>
  );
};
