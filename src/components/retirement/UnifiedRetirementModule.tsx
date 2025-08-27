import React, { useEffect, useState } from 'react';
import { RetirementApp } from '@/features/retirement';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import '@/styles/retirement-module.css';

const UnifiedRetirementModule: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth();
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  useEffect(() => {
    // Component loaded
  }, []);

  // Handle URL parameters for active section
  useEffect(() => {
    const section = searchParams.get('section');
    
    // Fallback detection from window.location (French version logic)
    const urlParams = new URLSearchParams(window.location.search);
    const sectionFromURL = urlParams.get('section');
    
    // Direct test with current URL
    const currentUrl = new URL(window.location.href);
    const sectionFromCurrentUrl = currentUrl.searchParams.get('section');
    
    if (section) {
      setActiveSection(section);
    } else if (sectionFromURL) {
      setActiveSection(sectionFromURL);
    }
  }, [searchParams]);

  const handleSectionChange = (newSection: string) => {
    setActiveSection(newSection);
    // Update URL without reloading the page
    const url = new URL(window.location.href);
    url.searchParams.set('section', newSection);
    window.history.replaceState({}, '', url.toString());
  };

  // Different themes per section for immersive experience (French version logic)
  const getSectionTheme = (section: string) => {
    switch (section) {
      case 'dashboard': return 'auto';
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
      case 'premium-features': return 'premium';
      case 'demos': return 'auto';
      default: return 'auto';
    }
  };

  // Translation object
  const translations = {
    fr: {
      title: 'Module de Retraite',
      welcome: 'Bienvenue dans votre tableau de bord de planification de retraite',
      navigation: 'Navigation',
      activeSection: 'Section Active',
      currentStatus: 'Statut Actuel',
      currentStatusText: 'Vous consultez actuellement la section',
      userInfo: 'Informations Utilisateur',
      loggedInAs: 'Connecté en tant que',
      notLoggedIn: 'Non connecté',
      debugInfo: 'Informations de Débogage',
      debugText: 'Composant chargé avec succès. Vérifiez la console pour les journaux détaillés.',
      footer: 'Module de Retraite Version Test - Mode Débogage',
      sections: {
        dashboard: 'Tableau de bord',
        savings: 'Épargne',
        cashflow: 'Flux de trésorerie',
        cpp: 'RRQ/RPC',
        tax: 'Fiscalité',
        simulator: 'Simulateur'
      }
    },
    en: {
      title: 'Retirement Module',
      welcome: 'Welcome to your retirement planning dashboard',
      navigation: 'Navigation',
      activeSection: 'Active Section',
      currentStatus: 'Current Status',
      currentStatusText: 'You are currently viewing the',
      userInfo: 'User Information',
      loggedInAs: 'Logged in as',
      notLoggedIn: 'Not logged in',
      debugInfo: 'Debug Information',
      debugText: 'Component loaded successfully. Check console for detailed logs.',
      footer: 'Retirement Module Test Version - Debug Mode',
      sections: {
        dashboard: 'Dashboard',
        savings: 'Savings',
        cashflow: 'Cashflow',
        cpp: 'CPP',
        tax: 'Tax',
        simulator: 'Simulator'
      }
    }
  };

  const t = translations[isFrench ? 'fr' : 'en'];

  // For French: use full RetirementApp, for English: use debug interface
  if (isFrench) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-6 py-8">
          <RetirementApp 
            activeSection={activeSection || new URLSearchParams(window.location.search).get('section') || 'dashboard'} 
            onSectionChange={handleSectionChange}
            onDataLoad={(data) => {/* Data loaded */}}
          />
        </div>
      </div>
    );
  }

  // English debug interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t.title} - English Version
          </h1>
          <p className="text-xl text-gray-600">
            {t.welcome}
          </p>
        </div>

        {/* Section Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.navigation}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['dashboard', 'savings', 'cashflow', 'cpp', 'tax', 'simulator'].map((section) => (
              <button
                key={section}
                onClick={() => handleSectionChange(section)}
                className={`p-3 rounded-lg transition-colors ${
                  activeSection === section
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.sections[section as keyof typeof t.sections] || section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Active Section Display */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {t.activeSection}: {t.sections[activeSection as keyof typeof t.sections] || activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">{t.currentStatus}</h3>
              <p className="text-gray-600">
                {t.currentStatusText} <strong>{t.sections[activeSection as keyof typeof t.sections] || activeSection}</strong> section.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">{t.userInfo}</h3>
              <p className="text-blue-600">
                {user ? `${t.loggedInAs}: ${user.email || 'User'}` : t.notLoggedIn}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">{t.debugInfo}</h3>
              <p className="text-green-600 text-sm">
                {t.debugText}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>{t.footer}</p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedRetirementModule;
