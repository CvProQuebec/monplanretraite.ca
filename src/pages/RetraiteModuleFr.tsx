// src/pages/RetraiteModuleFr.tsx
import React, { useEffect, useState } from 'react';
import { RetirementApp } from '@/features/retirement';
import { Phase2Wrapper } from '../features/retirement/components/Phase2Wrapper';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, User, Calculator, TrendingUp, BarChart3, FileText, 
  AlertTriangle, Database, Lock, Crown, Zap, Settings 
} from 'lucide-react';
import '@/styles/retirement-module.css';

const RetraiteModuleFr: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth();

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

  // Fonction pour vérifier l'accès à une section selon le plan
  const hasSectionAccess = (sectionId: string): boolean => {
    if (!user) return false;
    
    const planHierarchy = { free: 0, professional: 1, ultimate: 2 };
    const currentPlan = user.plan;
    
    // Sections gratuites
    const freeSections = ['dashboard', 'personal', 'retirement', 'savings', 'cashflow', 'cpp', 'combined-pension', 'session', 'emergency-info', 'demos'];
    if (freeSections.includes(sectionId)) return true;
    
    // Sections professionnelles
    const professionalSections = ['advanced-expenses', 'tax', 'simulator', 'reports'];
    if (professionalSections.includes(sectionId)) {
      return planHierarchy[currentPlan] >= planHierarchy.professional;
    }
    
    // Sections premium
    const premiumSections = ['premium-features'];
    if (premiumSections.includes(sectionId)) {
      return planHierarchy[currentPlan] >= planHierarchy.ultimate;
    }
    
    return true; // Par défaut, accessible
  };

  // Configuration des onglets de navigation avec vérification d'accès
  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, requiredPlan: 'free' },
    { id: 'emergency-info', label: 'Informations d\'urgence', icon: AlertTriangle, requiredPlan: 'free' },
    { id: 'personal', label: 'Profil', icon: User, requiredPlan: 'free' },
    { id: 'retirement', label: 'Retraite', icon: Calculator, requiredPlan: 'free' },
    { id: 'savings', label: '$ Épargne', icon: TrendingUp, requiredPlan: 'free' },
    { id: 'cashflow', label: 'Flux de trésorerie', icon: BarChart3, requiredPlan: 'free' },
    { id: 'cpp', label: 'CPP', icon: FileText, requiredPlan: 'free' },
    { id: 'combined-pension', label: 'CPP+RRQ', icon: FileText, requiredPlan: 'free' },
    { id: 'advanced-expenses', label: 'Dépenses avancées', icon: Calculator, requiredPlan: 'professional' },
    { id: 'tax', label: 'Optimisation fiscale', icon: Settings, requiredPlan: 'professional' },
    { id: 'simulator', label: 'Simulateur', icon: Zap, requiredPlan: 'professional' },
    { id: 'session', label: 'Sauvegarder/Charger', icon: Database, requiredPlan: 'free' },
    { id: 'backup-security', label: 'Conseils de sécurité', icon: Lock, requiredPlan: 'free' },
    { id: 'reports', label: 'Rapports', icon: FileText, requiredPlan: 'professional' },
    { id: 'premium-features', label: 'Premium', icon: Crown, requiredPlan: 'ultimate' }
  ];

  // Obtenir le nom du plan en français
  const getPlanName = (plan: string): string => {
    const planNames = {
      'free': 'Gratuit',
      'professional': 'Professionnel',
      'ultimate': 'Ultimate'
    };
    return planNames[plan as keyof typeof planNames] || 'Gratuit';
  };

  // Obtenir la couleur du plan
  const getPlanColor = (plan: string): string => {
    const planColors = {
      'free': 'bg-gray-600',
      'professional': 'bg-blue-600',
      'ultimate': 'bg-purple-600'
    };
    return planColors[plan as keyof typeof planColors] || 'bg-gray-600';
  };

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
            {tabs.map((tab) => {
              const hasAccess = hasSectionAccess(tab.id);
              const isActive = activeSection === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => hasAccess && handleSectionChange(tab.id)}
                  disabled={!hasAccess}
                  className={`
                    relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                    whitespace-nowrap flex items-center gap-2 backdrop-blur-sm
                    ${!hasAccess 
                      ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                      : isActive
                        ? 'bg-blue-600/90 text-white shadow-lg transform scale-105'
                        : 'bg-white/70 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600'
                    }
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.requiredPlan !== 'free' && (
                    <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                      tab.requiredPlan === 'professional' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {tab.requiredPlan === 'professional' ? 'Pro' : 'Ultimate'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Indicateur de plan et progression */}
          <div className="flex items-center justify-between py-3 border-t border-gray-200/50">
            <div className={`inline-flex items-center gap-2 px-4 py-2 ${getPlanColor(user?.plan || 'free')} text-white rounded-full text-sm font-bold backdrop-blur-sm`}>
              Plan actuel : {getPlanName(user?.plan || 'free')}
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
        <RetirementApp 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          onDataLoad={(data) => console.log('Données chargées:', data)}
        />
      </div>
    </Phase2Wrapper>
  );
};

export default RetraiteModuleFr;
