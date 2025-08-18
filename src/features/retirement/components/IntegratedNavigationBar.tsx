// Composant de navigation intégrée pour la page retraite-module
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
  Download,
  Flag,
  Crown,
  AlertTriangle,
  ExternalLink,
  Database,
  Lock,
} from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { translations } from '@/features/retirement/translations/index';
import { PlanRestrictedButton, useSectionAccess } from '../components/PlanRestrictedButton';
import { useNavigate } from 'react-router-dom';

interface IntegratedNavigationBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const IntegratedNavigationBar: React.FC<IntegratedNavigationBarProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();

  // Sections regroupées par catégorie
  const sectionGroups = [
    {
      title: language === 'fr' ? 'Planification de base' : 'Basic Planning',
      sections: [
        { id: 'dashboard', label: t.navigation.dashboard, icon: BarChart3, requiredPlan: 'free' },
        { id: 'personal', label: t.navigation.profile, icon: Users, requiredPlan: 'free' },
        { id: 'retirement', label: t.navigation.retirement, icon: Shield, requiredPlan: 'free' },
        { id: 'savings', label: t.navigation.savings, icon: DollarSign, requiredPlan: 'free' },
      ]
    },
    {
      title: language === 'fr' ? 'Fonctionnalités avancées' : 'Advanced Features',
      sections: [
        { id: 'cashflow', label: t.navigation.cashflow, icon: TrendingUp, requiredPlan: 'professional' },
        { id: 'cpp', label: language === 'fr' ? 'CPP' : 'CPP', icon: Flag, requiredPlan: 'professional' },
        { id: 'combined-pension', label: language === 'fr' ? 'CPP+RRQ' : 'CPP+RRQ', icon: BarChart3, requiredPlan: 'professional' },
        { id: 'advanced-expenses', label: t.navigation.advancedExpenses, icon: Calendar, requiredPlan: 'professional' },
        { id: 'tax', label: t.navigation.taxOptimization, icon: Calculator, requiredPlan: 'professional' },
        { id: 'simulator', label: t.navigation.simulator, icon: Zap, requiredPlan: 'professional' },
      ]
    },
    {
      title: language === 'fr' ? 'Sauvegarde et sécurité' : 'Backup & Security',
      sections: [
        { id: 'session', label: language === 'fr' ? 'Sauvegarder/Charger' : 'Save/Load', icon: Database, requiredPlan: 'free' },
        { id: 'backup-security', label: language === 'fr' ? 'Conseils de sécurité' : 'Security Tips', icon: Lock, requiredPlan: 'free', external: true },
      ]
    },
    {
      title: language === 'fr' ? 'Rapports et analyses' : 'Reports & Analysis',
      sections: [
        { id: 'reports', label: t.navigation.reports, icon: FileText, requiredPlan: 'professional', external: true },
        { id: 'emergency-info', label: language === 'fr' ? 'Informations d\'urgence' : 'Emergency Info', icon: AlertTriangle, requiredPlan: 'free' },
      ]
    },
    {
      title: language === 'fr' ? 'Fonctionnalités premium' : 'Premium Features',
      sections: [
        { id: 'premium-features', label: language === 'fr' ? 'Premium' : 'Premium', icon: Crown, requiredPlan: 'ultimate' },
      ]
    },
    {
      title: language === 'fr' ? 'Démonstrations' : 'Demos',
      sections: [
        { id: 'demos', label: language === 'fr' ? 'Voir les démos' : 'View Demos', icon: Zap, requiredPlan: 'free', external: true },
      ]
    }
  ];

  const handleSectionClick = (section: any) => {
    if (section.external) {
      // Navigation vers les pages externes
      let externalPath = '';
      if (section.id === 'backup-security') {
        externalPath = language === 'fr' 
          ? `/fr/sauvegarde-securite` 
          : `/en/backup-security`;
      } else if (section.id === 'reports') {
        externalPath = language === 'fr' 
          ? `/fr/rapports-retraite` 
          : `/en/retirement-reports`;
      } else if (section.id === 'demos') {
        externalPath = language === 'fr' 
          ? `/fr/demos` 
          : `/en/demos`;
      }
      navigate(externalPath);
    } else {
      // Section normale du module
      onSectionChange(section.id);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-b-4 border-blue-400 shadow-2xl">
      <div className="container mx-auto px-6">
        <div className="py-6 space-y-6">
          {/* Titre principal */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {language === 'fr' ? 'Module de Planification de Retraite' : 'Retirement Planning Module'}
            </h1>
            <p className="text-blue-100 text-lg">
              {language === 'fr' 
                ? 'Planifiez votre avenir financier avec nos outils professionnels'
                : 'Plan your financial future with our professional tools'
              }
            </p>
          </div>

          {/* Navigation par groupes */}
          <div className="space-y-4">
            {sectionGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-3">
                <h3 className="text-sm font-bold text-blue-100 uppercase tracking-wide px-2 bg-blue-500/30 rounded-lg py-1 inline-block">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg ${
                        activeSection === section.id
                          ? 'bg-white text-blue-600 shadow-xl transform scale-105'
                          : 'bg-white/90 text-gray-700 border-2 border-white/50 hover:bg-white hover:border-blue-300 hover:shadow-xl'
                      }`}
                    >
                      <section.icon className="w-4 h-4" />
                      {section.label}
                      {section.external && <ExternalLink className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Indicateur de plan actuel */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-bold border-2 border-white/30 shadow-lg">
              <Shield className="w-5 h-5" />
              {language === 'fr' ? 'Plan actuel : Gratuit' : 'Current plan: Free'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
