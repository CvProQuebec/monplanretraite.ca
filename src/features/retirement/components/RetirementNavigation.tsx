import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { TabbedNavigation } from './TabbedNavigation';
import { InteractiveCard, CardGrid } from './InteractiveCard';
import { StepNavigation } from './StepNavigation';
import { 
  Home, 
  User, 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  FileText,
  AlertTriangle,
  Database,
  Settings,
  Zap
} from 'lucide-react';

export const RetirementNavigation: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentStep, setCurrentStep] = useState(0);

  // Configuration des onglets
  const tabs = [
    { id: 'dashboard', label: language === 'fr' ? 'Tableau de bord' : 'Dashboard', icon: Home },
    { id: 'planning', label: language === 'fr' ? 'Planification' : 'Planning', icon: Calculator },
    { id: 'analysis', label: language === 'fr' ? 'Analyse' : 'Analysis', icon: TrendingUp },
    { id: 'reports', label: language === 'fr' ? 'Rapports' : 'Reports', icon: FileText },
    { id: 'emergency', label: language === 'fr' ? 'Urgence' : 'Emergency', icon: AlertTriangle },
    { id: 'session', label: language === 'fr' ? 'Session' : 'Session', icon: Database },
  ];

  // Configuration des étapes
  const steps = [
    { id: 'profile', label: language === 'fr' ? 'Profil' : 'Profile', status: 'completed' as const },
    { id: 'planning', label: language === 'fr' ? 'Planification' : 'Planning', status: 'current' as const },
    { id: 'analysis', label: language === 'fr' ? 'Analyse' : 'Analysis', status: 'upcoming' as const },
    { id: 'reports', label: language === 'fr' ? 'Rapports' : 'Reports', status: 'upcoming' as const },
    { id: 'security', label: language === 'fr' ? 'Sécurité' : 'Security', status: 'upcoming' as const },
  ];

  // Configuration des cartes principales
  const mainCards = [
    {
      title: language === 'fr' ? 'Tableau de bord' : 'Dashboard',
      description: language === 'fr' ? 'Vue d\'ensemble de votre planification retraite' : 'Overview of your retirement planning',
      icon: Home,
      status: 'completed' as const,
      progress: 100,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=dashboard' : '/en/retirement-module?section=dashboard'),
      external: true
    },
    {
      title: language === 'fr' ? 'Profil personnel' : 'Personal Profile',
      description: language === 'fr' ? 'Informations personnelles et objectifs' : 'Personal information and goals',
      icon: User,
      status: 'completed' as const,
      progress: 85,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=profile' : '/en/retirement-module?section=profile'),
      external: true
    },
    {
      title: language === 'fr' ? 'Planification retraite' : 'Retirement Planning',
      description: language === 'fr' ? 'Calculs et projections de retraite' : 'Retirement calculations and projections',
      icon: Calculator,
      status: 'in-progress' as const,
      progress: 60,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=planning' : '/en/retirement-module?section=planning'),
      external: true
    },
    {
      title: language === 'fr' ? 'Gestion épargne' : 'Savings Management',
      description: language === 'fr' ? 'Suivi de vos économies et investissements' : 'Track your savings and investments',
      icon: TrendingUp,
      status: 'in-progress' as const,
      progress: 40,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=savings' : '/en/retirement-module?section=savings'),
      external: true
    },
    {
      title: language === 'fr' ? 'Analyse cashflow' : 'Cashflow Analysis',
      description: language === 'fr' ? 'Analyse détaillée de vos flux de trésorerie' : 'Detailed analysis of your cash flows',
      icon: BarChart3,
      status: 'locked' as const,
      progress: 0,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=cashflow' : '/en/retirement-module?section=cashflow'),
      external: true
    },
    {
      title: language === 'fr' ? 'Calculs CPP/RRQ' : 'CPP/RRQ Calculations',
      description: language === 'fr' ? 'Calculs des prestations gouvernementales' : 'Government benefits calculations',
      icon: FileText,
      status: 'locked' as const,
      progress: 0,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=cpp-rrq' : '/en/retirement-module?section=cpp-rrq'),
      external: true
    },
    {
      title: language === 'fr' ? 'Informations d\'urgence' : 'Emergency Info',
      description: language === 'fr' ? 'Directives médicales et contacts d\'urgence' : 'Medical directives and emergency contacts',
      icon: AlertTriangle,
      status: 'completed' as const,
      progress: 90,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=emergency' : '/en/retirement-module?section=emergency'),
      external: true
    },
    {
      title: language === 'fr' ? 'Rapports et analyses' : 'Reports & Analysis',
      description: language === 'fr' ? 'Générez des rapports détaillés de votre planification' : 'Generate detailed planning reports',
      icon: FileText,
      status: 'locked' as const,
      progress: 0,
      onClick: () => navigate(language === 'fr' ? '/fr/rapports-retraite' : '/en/retirement-reports'),
      external: true
    },
    {
      title: language === 'fr' ? 'Gestion des sessions' : 'Session Management',
      description: language === 'fr' ? 'Sauvegardez, chargez et sécurisez vos données' : 'Save, load and secure your data',
      icon: Database,
      status: 'completed' as const,
      progress: 75,
      onClick: () => navigate(language === 'fr' ? '/fr/sauvegarde-securite' : '/en/backup-security'),
      external: true
    }
  ];

  // Configuration des cartes d'action rapide
  const quickActionCards = [
    {
      title: language === 'fr' ? 'Démos Phase 1' : 'Phase 1 Demos',
      description: language === 'fr' ? 'Navigation fluide et cartes interactives' : 'Fluid navigation and interactive cards',
      icon: Zap,
      status: 'completed' as const,
      progress: 100,
      onClick: () => navigate(language === 'fr' ? '/fr/navigation-demo' : '/en/navigation-demo'),
      external: true
    },
    {
      title: language === 'fr' ? 'Démos Phase 2' : 'Phase 2 Demos',
      description: language === 'fr' ? 'Expérience immersive et IA adaptative' : 'Immersive experience and adaptive AI',
      icon: Settings,
      status: 'completed' as const,
      progress: 100,
      onClick: () => navigate(language === 'fr' ? '/fr/phase2-demo' : '/en/phase2-demo'),
      external: true
    }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleStepClick = (stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    }
  };

  const handleCardClick = (card: any) => {
    console.log('🔍 handleCardClick appelé avec:', card);
    console.log('🔍 card.external:', card.external);
    console.log('🔍 card.onClick:', card.onClick);
    
    if (card.external) {
      console.log('🔍 Navigation externe détectée');
      // Navigation externe déjà gérée par onClick
      return;
    }
    
    console.log('🔍 Exécution de card.onClick()');
    card.onClick();
  };

  const handleExternalNavigation = (path: string) => {
    console.log('🔍 handleExternalNavigation appelé avec:', path);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header avec titre */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            🚀 {language === 'fr' ? 'Navigation Phase 1 intégrée' : 'Integrated Phase 1 Navigation'}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {language === 'fr' 
              ? 'Expérience utilisateur fluide et intuitive pour votre planification de retraite'
              : 'Smooth and intuitive user experience for your retirement planning'
            }
          </p>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <TabbedNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onExternalNavigation={handleExternalNavigation}
        />
      </div>

      {/* Navigation par étapes */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200">
        <StepNavigation
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          showProgress={true}
        />
      </div>

      {/* Contenu principal */}
      <main className="container mx-auto px-6 py-12">
        {/* Grille principale des cartes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🎯 {language === 'fr' ? 'Fonctionnalités principales' : 'Main Features'}
          </h2>
          <CardGrid columns={4} gap="lg">
            {mainCards.map((card, index) => (
              <InteractiveCard
                key={index}
                title={card.title}
                description={card.description}
                icon={card.icon}
                status={card.status}
                progress={card.progress}
                onClick={card.onClick}
              />
            ))}
          </CardGrid>
        </div>

        {/* Actions rapides */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            ⚡ {language === 'fr' ? 'Actions rapides' : 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {quickActionCards.map((card, index) => (
              <InteractiveCard
                key={index}
                title={card.title}
                description={card.description}
                icon={card.icon}
                status={card.status}
                progress={card.progress}
                onClick={card.onClick}
              />
            ))}
          </div>
        </div>

        {/* Section des nouvelles fonctionnalités */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              🆕 {language === 'fr' ? 'Nouvelles fonctionnalités ajoutées' : 'New features added'}
            </h3>
            <p className="text-blue-700 max-w-3xl mx-auto">
              {language === 'fr'
                ? 'Découvrez nos dernières améliorations pour une expérience complète et sécurisée'
                : 'Discover our latest improvements for a complete and secure experience'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Carte Urgence */}
            <div 
              className="bg-white rounded-xl p-6 shadow-lg border border-blue-200 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate(language === 'fr' ? '/fr/retraite-module?section=emergency' : '/en/retirement-module?section=emergency')}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900">
                  {language === 'fr' ? 'Informations d\'urgence' : 'Emergency Info'}
                </h4>
              </div>
              <p className="text-gray-600 mb-4">
                {language === 'fr'
                  ? 'Directives médicales et contacts d\'urgence complets'
                  : 'Complete medical directives and emergency contacts'
                }
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {language === 'fr' ? 'Disponible maintenant' : 'Available now'}
              </div>
            </div>

            {/* Carte Rapports */}
            <div 
              className="bg-white rounded-xl p-6 shadow-lg border border-blue-200 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate(language === 'fr' ? '/fr/rapports-retraite' : '/en/retirement-reports')}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">
                  {language === 'fr' ? 'Rapports et analyses' : 'Reports & Analysis'}
                </h4>
              </div>
              <p className="text-gray-600 mb-4">
                {language === 'fr'
                  ? 'Générez des rapports détaillés de votre planification'
                  : 'Generate detailed planning reports'
                }
              </p>
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                {language === 'fr' ? 'Plan professionnel' : 'Professional plan'}
              </div>
            </div>

            {/* Carte Session */}
            <div 
              className="bg-white rounded-xl p-6 shadow-lg border border-blue-200 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate(language === 'fr' ? '/fr/sauvegarde-securite' : '/en/backup-security')}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Database className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">
                  {language === 'fr' ? 'Gestion des sessions' : 'Session Management'}
                </h4>
              </div>
              <p className="text-gray-600 mb-4">
                {language === 'fr'
                  ? 'Sauvegardez, chargez et sécurisez vos données'
                  : 'Save, load and secure your data'
                }
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {language === 'fr' ? 'Disponible maintenant' : 'Available now'}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
