// Composant de démonstration des nouveaux composants de navigation
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabbedNavigation } from './TabbedNavigation';
import { InteractiveCard, CardGrid } from './InteractiveCard';
import { StepNavigation, MobileStepNavigation } from './StepNavigation';
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

export const NavigationDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentStep, setCurrentStep] = useState(0);
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Configuration des étapes pour la démonstration
  const demoSteps = [
    {
      id: 'profile',
      label: language === 'fr' ? 'Profil personnel' : 'Personal Profile',
      description: language === 'fr' ? 'Informations de base' : 'Basic information',
      status: 'completed' as const,
      requiredPlan: 'free' as const,
      icon: Users
    },
    {
      id: 'retirement',
      label: language === 'fr' ? 'Planification retraite' : 'Retirement Planning',
      description: language === 'fr' ? 'Calculs de base' : 'Basic calculations',
      status: 'current' as const,
      requiredPlan: 'free' as const,
      icon: Shield
    },
    {
      id: 'cashflow',
      label: language === 'fr' ? 'Analyse cashflow' : 'Cashflow Analysis',
      description: language === 'fr' ? 'Plan professionnel' : 'Professional plan',
      status: 'upcoming' as const,
      requiredPlan: 'professional' as const,
      icon: TrendingUp
    },
    {
      id: 'premium',
      label: language === 'fr' ? 'Fonctionnalités premium' : 'Premium Features',
      description: language === 'fr' ? 'Plan ultime' : 'Ultimate plan',
      status: 'premium' as const,
      requiredPlan: 'ultimate' as const,
      icon: Crown
    }
  ];

  // Configuration des cartes interactives
  const demoCards = [
    {
      title: language === 'fr' ? 'Tableau de bord' : 'Dashboard',
      description: language === 'fr' ? 'Vue d\'ensemble de votre planification' : 'Overview of your planning',
      icon: BarChart3,
      status: 'completed' as const,
      progress: 100,
      onClick: () => setActiveTab('dashboard')
    },
    {
      title: language === 'fr' ? 'Profil personnel' : 'Personal Profile',
      description: language === 'fr' ? 'Gérez vos informations personnelles' : 'Manage your personal information',
      icon: Users,
      status: 'completed' as const,
      progress: 85,
      onClick: () => setActiveTab('personal')
    },
    {
      title: language === 'fr' ? 'Planification retraite' : 'Retirement Planning',
      description: language === 'fr' ? 'Planifiez votre avenir financier' : 'Plan your financial future',
      icon: Shield,
      status: 'in-progress' as const,
      progress: 60,
      onClick: () => setActiveTab('retirement')
    },
    {
      title: language === 'fr' ? 'Gestion épargne' : 'Savings Management',
      description: language === 'fr' ? 'Suivez vos économies et investissements' : 'Track your savings and investments',
      icon: DollarSign,
      status: 'in-progress' as const,
      progress: 40,
      onClick: () => setActiveTab('savings')
    },
    {
      title: language === 'fr' ? 'Analyse cashflow' : 'Cashflow Analysis',
      description: language === 'fr' ? 'Analysez vos flux de trésorerie' : 'Analyze your cash flows',
      icon: TrendingUp,
      status: 'locked' as const,
      progress: 0,
      onClick: () => setActiveTab('cashflow')
    },
    {
      title: language === 'fr' ? 'Calculs CPP/RRQ' : 'CPP/RRQ Calculations',
      description: language === 'fr' ? 'Optimisez vos pensions gouvernementales' : 'Optimize your government pensions',
      icon: Flag,
      status: 'locked' as const,
      progress: 0,
      onClick: () => setActiveTab('cpp')
    },
    // Nouvelles tuiles ajoutées
    {
      title: language === 'fr' ? 'Informations d\'urgence' : 'Emergency Info',
      description: language === 'fr' ? 'Directives médicales et contacts d\'urgence' : 'Medical directives and emergency contacts',
      icon: AlertTriangle,
      status: 'completed' as const,
      progress: 90,
      onClick: () => setActiveTab('emergency'),
      external: true,
      externalPath: language === 'fr' ? '/fr/retraite-module' : '/en/retirement-module'
    },
    {
      title: language === 'fr' ? 'Rapports et analyses' : 'Reports & Analysis',
      description: language === 'fr' ? 'Générez des rapports détaillés de votre planification' : 'Generate detailed planning reports',
      icon: FileText,
      status: 'locked' as const,
      progress: 0,
      onClick: () => setActiveTab('reports'),
      external: true,
      externalPath: language === 'fr' ? '/fr/rapports-retraite' : '/en/retirement-reports'
    },
    {
      title: language === 'fr' ? 'Gestion des sessions' : 'Session Management',
      description: language === 'fr' ? 'Sauvegardez, chargez et sécurisez vos données' : 'Save, load and secure your data',
      icon: Database,
      status: 'completed' as const,
      progress: 75,
      onClick: () => setActiveTab('session'),
      external: true,
      externalPath: language === 'fr' ? '/fr/sauvegarde-securite' : '/en/backup-security'
    }
  ];

  const handleExternalNavigation = (path: string) => {
    navigate(path);
  };

  const handleCardClick = (card: any) => {
    if (card.external && card.externalPath) {
      navigate(card.externalPath);
    } else {
      card.onClick();
    }
  };

  const handleStepClick = (stepId: string) => {
    const stepIndex = demoSteps.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
      setActiveTab(stepId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation par onglets */}
      <TabbedNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExternalNavigation={handleExternalNavigation}
      />

      {/* Navigation par étapes - Desktop */}
      <div className="hidden md:block">
        <StepNavigation
          steps={demoSteps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          showProgress={true}
        />
      </div>

      {/* Navigation par étapes - Mobile */}
      <div className="md:hidden">
        <MobileStepNavigation
          steps={demoSteps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Grille de cartes interactives */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? 'Vos modules de planification' : 'Your Planning Modules'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {language === 'fr' 
              ? 'Explorez les différentes fonctionnalités disponibles selon votre plan d\'abonnement'
              : 'Explore the different features available based on your subscription plan'
            }
          </p>
        </div>

        <CardGrid columns={4} gap="lg">
          {demoCards.map((card, index) => (
            <InteractiveCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              status={card.status}
              progress={card.progress}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </CardGrid>

        {/* Section d'information */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Navigation fluide et intuitive' : 'Smooth and intuitive navigation'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {language === 'fr'
                ? 'Découvrez notre nouvelle interface de navigation avec des animations fluides, des indicateurs de progression clairs et une expérience utilisateur optimisée.'
                : 'Discover our new navigation interface with smooth animations, clear progress indicators and an optimized user experience.'
              }
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {language === 'fr' ? 'Navigation par onglets' : 'Tab Navigation'}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === 'fr' 
                    ? 'Accès rapide à toutes les fonctionnalités'
                    : 'Quick access to all features'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {language === 'fr' ? 'Progression visuelle' : 'Visual Progress'}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === 'fr' 
                    ? 'Suivez votre avancement étape par étape'
                    : 'Track your progress step by step'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {language === 'fr' ? 'Cartes interactives' : 'Interactive Cards'}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === 'fr' 
                    ? 'Interface moderne avec animations 3D'
                    : 'Modern interface with 3D animations'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section des nouvelles fonctionnalités */}
        <div className="mt-16">
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
              <div className="bg-white rounded-xl p-6 shadow-md border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'fr' ? 'Informations d\'urgence' : 'Emergency Info'}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {language === 'fr'
                    ? 'Directives médicales anticipées, contacts d\'urgence et informations vitales accessibles en un clic.'
                    : 'Advance medical directives, emergency contacts and vital information accessible in one click.'
                  }
                </p>
                <div className="text-xs text-gray-500">
                  {language === 'fr' ? '✅ Disponible maintenant' : '✅ Available now'}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'fr' ? 'Rapports détaillés' : 'Detailed Reports'}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {language === 'fr'
                    ? 'Générez des rapports complets de votre planification avec analyses et recommandations personnalisées.'
                    : 'Generate comprehensive planning reports with personalized analysis and recommendations.'
                  }
                </p>
                <div className="text-xs text-gray-500">
                  {language === 'fr' ? '🔒 Plan professionnel' : '🔒 Professional plan'}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    {language === 'fr' ? 'Gestion des sessions' : 'Session Management'}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {language === 'fr'
                    ? 'Sauvegardez et chargez vos données, avec conseils de sécurité et protection avancée.'
                    : 'Save and load your data, with security tips and advanced protection.'
                  }
                </p>
                <div className="text-xs text-gray-500">
                  {language === 'fr' ? '✅ Disponible maintenant' : '✅ Available now'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
