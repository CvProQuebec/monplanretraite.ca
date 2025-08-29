// src/features/retirement/sections/NavigationBar.tsx
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
} from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { translations } from '@/features/retirement/translations/index';
import { PlanRestrictedButton, useSectionAccess } from '../components/PlanRestrictedButton';
import { useNavigate } from 'react-router-dom';

interface NavigationBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();

  const sections: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    requiredPlan: 'free' | 'professional' | 'ultimate';
    external?: boolean;
  }> = [
    { id: 'dashboard', label: t.navigation.dashboard, icon: BarChart3, requiredPlan: 'free' },
    { id: 'personal', label: t.navigation.profile, icon: Users, requiredPlan: 'free' },
    { id: 'retirement', label: t.navigation.retirement, icon: Shield, requiredPlan: 'free' },
    { id: 'savings', label: t.navigation.savings, icon: DollarSign, requiredPlan: 'free' },
    { id: 'cashflow', label: t.navigation.cashflow, icon: TrendingUp, requiredPlan: 'professional' },
    { id: 'emergency-info', label: language === 'fr' ? 'Urgence' : 'Emergency', icon: AlertTriangle, requiredPlan: 'free' },
    { id: 'cpp', label: language === 'fr' ? 'CPP' : 'CPP', icon: Flag, requiredPlan: 'professional' },
    { id: 'combined-pension', label: language === 'fr' ? 'CPP+RRQ' : 'CPP+RRQ', icon: BarChart3, requiredPlan: 'professional' },
    { id: 'premium-features', label: language === 'fr' ? 'Premium' : 'Premium', icon: Crown, requiredPlan: 'ultimate' },
    { id: 'advanced-expenses', label: t.navigation.advancedExpenses, icon: Calendar, requiredPlan: 'professional' },
    { id: 'tax', label: t.navigation.taxOptimization, icon: Calculator, requiredPlan: 'professional' },
    { id: 'simulator', label: t.navigation.simulator, icon: Zap, requiredPlan: 'professional' },
    { id: 'reports', label: t.navigation.reports, icon: FileText, requiredPlan: 'professional' },
    { id: 'session', label: language === 'fr' ? 'Session' : 'Session', icon: Download, requiredPlan: 'free' },
    { id: 'backup-security', label: language === 'fr' ? 'Sauvegarde & Sécurité' : 'Backup & Security', icon: Shield, requiredPlan: 'free', external: true },
    { id: 'reports', label: language === 'fr' ? 'Rapports' : 'Reports', icon: FileText, requiredPlan: 'professional', external: true },
  ];

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-2 py-4">
          {/* Sections du module */}
          {sections.map((section) => {
            if (section.external) {
              // Lien externe vers une page dédiée
              let externalPath = '';
              if (section.id === 'backup-security') {
                externalPath = language === 'fr' 
                  ? `/fr/sauvegarde-securite` 
                  : `/en/backup-security`;
              } else if (section.id === 'reports') {
                externalPath = language === 'fr' 
                  ? `/fr/rapports-retraite` 
                  : `/en/retirement-reports`;
              }
              
              return (
                <button
                  key={section.id}
                  onClick={() => navigate(externalPath)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-blue-300'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                  <ExternalLink className="w-3 h-3" />
                </button>
              );
            }
            
            // Section normale du module
            return (
              <PlanRestrictedButton
                key={section.id}
                sectionId={section.id}
                label={section.label}
                icon={section.icon}
                requiredPlan={section.requiredPlan}
                isActive={activeSection === section.id}
                onClick={() => onSectionChange(section.id)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};