// src/pages/RetraiteModuleFr.tsx
import React, { useEffect, useState } from 'react';
import { RetirementApp } from '@/features/retirement';
import { Phase2Wrapper } from '../features/retirement/components/Phase2Wrapper';
import { useSearchParams } from 'react-router-dom';
import { 
  Home, User, Calculator, TrendingUp, BarChart3, FileText, 
  AlertTriangle, Database, Lock, Crown, Zap, Settings 
} from 'lucide-react';
import '@/styles/retirement-module.css';

const RetraiteModuleFr: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    console.log('🔍 RetraiteModuleFr - Composant chargé');
  }, []);

  // Gérer les paramètres d'URL pour la section active
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      console.log('🔍 Section détectée dans l\'URL:', section);
      setActiveSection(section);
    }
  }, [searchParams]);

  const handleSectionChange = (newSection: string) => {
    setActiveSection(newSection);
    // Mettre à jour l'URL sans recharger la page
    const url = new URL(window.location.href);
    url.searchParams.set('section', newSection);
    window.history.replaceState({}, '', url.toString());
  };

  // Thèmes différents selon la section pour une expérience immersive
  const getSectionTheme = (section: string) => {
    switch (section) {
      case 'dashboard': return 'auto';
      case 'personal': return 'afternoon';
      case 'retirement': return 'evening';
      case 'savings': return 'morning';
      case 'cashflow': return 'evening';
      case 'cpp': return 'afternoon';
      case 'combined-pension': return 'premium';
      case 'advanced-expenses': return 'creative';
      case 'tax': return 'night';
      case 'simulator': return 'premium';
      case 'session': return 'morning';
      case 'backup-security': return 'night';
      case 'reports': return 'evening';
      case 'emergency-info': return 'creative';
      case 'premium-features': return 'premium';
      case 'demos': return 'auto';
      default: return 'auto';
    }
  };

  // Configuration des onglets de navigation
  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'personal', label: 'Profil', icon: User },
    { id: 'retirement', label: 'Retraite', icon: Calculator },
    { id: 'savings', label: '$ Épargne', icon: TrendingUp },
    { id: 'cashflow', label: 'Flux de trésorerie', icon: BarChart3, badge: 'Pro' },
    { id: 'cpp', label: 'CPP', icon: FileText, badge: 'Pro' },
    { id: 'combined-pension', label: 'CPP+RRQ', icon: FileText, badge: 'Pro' },
    { id: 'advanced-expenses', label: 'Dépenses avancées', icon: Calculator, badge: 'Pro' },
    { id: 'tax', label: 'Optimisation fiscale', icon: Settings, badge: 'Pro' },
    { id: 'simulator', label: 'Simulateur', icon: Zap, badge: 'Pro' },
    { id: 'session', label: 'Sauvegarder/Charger', icon: Database },
    { id: 'backup-security', label: 'Conseils de sécurité', icon: Lock },
    { id: 'reports', label: 'Rapports', icon: FileText, badge: 'Pro' },
    { id: 'emergency-info', label: 'Informations d\'urgence', icon: AlertTriangle },
    { id: 'premium-features', label: 'Premium', icon: Crown, badge: 'Pro' },
    { id: 'demos', label: 'Voir les démos', icon: Zap }
  ];

  return (
    <Phase2Wrapper 
      theme={getSectionTheme(activeSection)}
      showParticles={true} 
      showPhysics={true}
      enableThemeRotation={false}
      enableAdaptiveLayout={true}
    >
      {/* Menu de navigation principal avec fond transparent pour les particules */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="container mx-auto px-6">
          {/* Barre de navigation par onglets */}
          <div className="flex space-x-1 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSectionChange(tab.id)}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                  whitespace-nowrap flex items-center gap-2 backdrop-blur-sm
                  ${activeSection === tab.id
                    ? 'bg-blue-600/90 text-white shadow-lg transform scale-105'
                    : 'bg-white/70 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Indicateur de plan et progression */}
          <div className="flex items-center justify-between py-3 border-t border-gray-200/50">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/90 text-white rounded-full text-sm font-bold backdrop-blur-sm">
              Plan actuel : Gratuit
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">Progression globale</div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200/70 rounded-full overflow-hidden backdrop-blur-sm">
                  <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">35%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenu de la section active directement sous le menu */}
      <div className="container mx-auto px-6 py-8">
        <RetirementApp activeSection={activeSection} onSectionChange={handleSectionChange} />
      </div>
    </Phase2Wrapper>
  );
};

export default RetraiteModuleFr;
