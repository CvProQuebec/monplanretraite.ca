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

  return null; // Menu de navigation supprimé - seul le menu principal UniformHeader reste
};
