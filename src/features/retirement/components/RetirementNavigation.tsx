import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { TabbedNavigation } from './TabbedNavigation';
import { InteractiveCard, CardGrid } from './InteractiveCard';
import { StepNavigation } from './StepNavigation';
import { 
  Home, 
  User, 
  Shield, 
  DollarSign, 
  TrendingUp, 
  Calculator, 
  FileText, 
  Settings, 
  Crown,
  Star,
  Zap,
  Brain,
  Sparkles,
  Rocket,
  Target,
  BarChart3,
  Calendar,
  Database,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  AlertTriangle,
  Info
} from 'lucide-react';

// Import de la Phase 2
import { InteractiveParticles } from './InteractiveParticles';
import { PhysicsCard } from './PhysicsCard';
import { useDynamicTheme } from '../hooks/useDynamicTheme';
import { useAdaptiveLayout } from '../hooks/useAdaptiveLayout';

export const RetirementNavigation: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  // Hooks Phase 2
  const { currentTheme, changeTheme, startThemeRotation, isRotating } = useDynamicTheme();
  const { currentLayout, screenContext, recommendations } = useAdaptiveLayout();

  // États locaux
  const [showParticles, setShowParticles] = useState(true);
  const [showPhysics, setShowPhysics] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentStep, setCurrentStep] = useState(0);

  // Configuration des onglets
  const tabs = [
    { 
      id: 'dashboard', 
      label: language === 'fr' ? 'Tableau de bord' : 'Dashboard', 
      icon: Home,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module-phase1' : '/en/retirement-module-phase1')
    },
    { 
      id: 'profile', 
      label: language === 'fr' ? 'Profil' : 'Profile', 
      icon: User,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=personal' : '/en/retirement-module?section=personal')
    },
    { 
      id: 'retirement', 
      label: language === 'fr' ? 'Retraite' : 'Retirement', 
      icon: Calculator,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=retirement' : '/en/retirement-module?section=retirement')
    },
    { 
      id: 'savings', 
      label: language === 'fr' ? '$ Épargne' : '$ Savings', 
      icon: TrendingUp,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=savings' : '/en/retirement-module?section=savings')
    },
    { 
      id: 'cashflow', 
      label: language === 'fr' ? 'Flux de trésorerie' : 'Cash Flow', 
      icon: BarChart3,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=cashflow' : '/en/retirement-module?section=cashflow'),
      badge: 'Pro'
    },
    { 
      id: 'cpp', 
      label: 'CPP', 
      icon: FileText,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=cpp' : '/en/retirement-module?section=cpp'),
      badge: 'Pro'
    },
    { 
      id: 'cpp-rrq', 
      label: 'CPP+RRQ', 
      icon: FileText,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=cpp-rrq' : '/en/retirement-module?section=cpp-rrq'),
      badge: 'Pro'
    },
    { 
      id: 'advanced-expenses', 
      label: language === 'fr' ? 'Dépenses avancées' : 'Advanced Expenses', 
      icon: Calculator,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=advanced-expenses' : '/en/retirement-module?section=advanced-expenses'),
      badge: 'Pro'
    },
    { 
      id: 'optimization', 
      label: language === 'fr' ? 'Optimisation' : 'Optimization', 
      icon: TrendingUp,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=tax' : '/en/retirement-module?section=tax'),
      badge: 'Pro'
    }
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
      id: 'dashboard',
      title: language === 'fr' ? 'Tableau de bord' : 'Dashboard',
      description: language === 'fr' ? 'Vue d\'ensemble de votre planification retraite' : 'Overview of your retirement planning',
      icon: Home,
      status: 'completed' as const,
      progress: 100,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module-phase1' : '/en/retirement-module-phase1'),
      external: false
    },
    {
      id: 'profile',
      title: language === 'fr' ? 'Profil personnel' : 'Personal Profile',
      description: language === 'fr' ? 'Informations personnelles et objectifs' : 'Personal information and goals',
      icon: User,
      status: 'completed' as const,
      progress: 85,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=personal' : '/en/retirement-module?section=personal'),
      external: false
    },
    {
      id: 'retirement',
      title: language === 'fr' ? 'Planification retraite' : 'Retirement Planning',
      description: language === 'fr' ? 'Calculs et projections de retraite' : 'Retirement calculations and projections',
      icon: Calculator,
      status: 'in-progress' as const,
      progress: 60,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=retirement' : '/en/retirement-module?section=retirement'),
      external: false
    },
    {
      id: 'savings',
      title: language === 'fr' ? 'Gestion épargne' : 'Savings Management',
      description: language === 'fr' ? 'Suivi de vos économies et investissements' : 'Track your savings and investments',
      icon: TrendingUp,
      status: 'in-progress' as const,
      progress: 40,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=savings' : '/en/retirement-module?section=savings'),
      external: false
    },
    {
      id: 'cashflow',
      title: language === 'fr' ? 'Analyse cashflow' : 'Cashflow Analysis',
      description: language === 'fr' ? 'Analyse détaillée de vos flux de trésorerie' : 'Detailed analysis of your cash flows',
      icon: BarChart3,
      status: 'locked' as const,
      progress: 0,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=cashflow' : '/en/retirement-module?section=cashflow'),
      external: false
    },
    {
      id: 'cpp',
      title: language === 'fr' ? 'Calculs CPP/RRQ' : 'CPP/RRQ Calculations',
      description: language === 'fr' ? 'Calculs des prestations gouvernementales' : 'Government benefits calculations',
      icon: FileText,
      status: 'locked' as const,
      progress: 0,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=cpp' : '/en/retirement-module?section=cpp'),
      external: false
    },
    {
      id: 'emergency',
      title: language === 'fr' ? 'Informations d\'urgence' : 'Emergency Info',
      description: language === 'fr' ? 'Directives médicales et contacts d\'urgence' : 'Medical directives and emergency contacts',
      icon: AlertTriangle,
      status: 'completed' as const,
      progress: 90,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=emergency-info' : '/en/retirement-module?section=emergency-info'),
      external: false
    },
    {
      id: 'reports',
      title: language === 'fr' ? 'Rapports et analyses' : 'Reports & Analysis',
      description: language === 'fr' ? 'Générez des rapports détaillés de votre planification' : 'Generate detailed planning reports',
      icon: FileText,
      status: 'locked' as const,
      progress: 0,
      onClick: () => navigate(language === 'fr' ? '/fr/rapports-retraite' : '/en/retirement-reports'),
      external: true
    },
    {
      id: 'session',
      title: language === 'fr' ? 'Gestion des sessions' : 'Session Management',
      description: language === 'fr' ? 'Sauvegardez, chargez et sécurisez vos données' : 'Save, load and secure your data',
      icon: Database,
      status: 'completed' as const,
      progress: 75,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=session' : '/en/retirement-module?section=session'),
      external: false
    }
  ];

  // Configuration des cartes d'action rapide
  const quickActionCards = [
    {
      id: 'phase1',
      title: language === 'fr' ? 'Démos Phase 1' : 'Phase 1 Demos',
      description: language === 'fr' ? 'Navigation fluide et cartes interactives' : 'Fluid navigation and interactive cards',
      icon: Zap,
      status: 'completed' as const,
      progress: 100,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module-phase1' : '/en/retirement-module-phase1'),
      external: false
    },
    {
      id: 'phase2',
      title: language === 'fr' ? 'Démos Phase 2' : 'Phase 2 Demos',
      description: language === 'fr' ? 'Expérience immersive et IA adaptative' : 'Immersive experience and adaptive AI',
      icon: Settings,
      status: 'completed' as const,
      progress: 100,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module' : '/en/retirement-module'),
      external: false
    }
  ];

  // Configuration des nouvelles fonctionnalités
  const newFeatures = [
    {
      id: 'monte-carlo',
      title: language === 'fr' ? 'Simulations Monte Carlo' : 'Monte Carlo Simulations',
      description: language === 'fr' ? 'Analyses avancées avec 10,000 scénarios' : 'Advanced analysis with 10,000 scenarios',
      icon: BarChart3,
      status: language === 'fr' ? 'Disponible maintenant' : 'Available now'
    },
    {
      id: 'risk-analysis',
      title: language === 'fr' ? 'Analyse des risques' : 'Risk Analysis',
      description: language === 'fr' ? 'Évaluation complète des risques de retraite' : 'Complete retirement risk assessment',
      icon: Shield,
      status: language === 'fr' ? 'Disponible maintenant' : 'Available now'
    },
    {
      id: 'advanced-dashboard',
      title: language === 'fr' ? 'Tableau de bord avancé' : 'Advanced Dashboard',
      description: language === 'fr' ? 'Interface moderne avec 5 onglets spécialisés' : 'Modern interface with 5 specialized tabs',
      icon: Target,
      status: language === 'fr' ? 'Disponible maintenant' : 'Available now'
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
    <div className={`min-h-screen transition-all duration-1000 ${
      currentTheme.id === 'morning' ? 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50' :
      currentTheme.id === 'afternoon' ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50' :
      currentTheme.id === 'evening' ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50' :
      currentTheme.id === 'night' ? 'bg-gradient-to-br from-slate-900 via-gray-800 to-indigo-900' :
      currentTheme.id === 'premium' ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50' :
      'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Particules de fond Phase 2 */}
      {showParticles && (
        <InteractiveParticles
          count={currentLayout.columns === 1 ? 20 : 40}
          theme={currentTheme.id as any}
          interactive={true}
          magnetic={true}
          energy={true}
          className="fixed inset-0 pointer-events-none z-0"
        />
      )}

      {/* Header avec thème dynamique */}
      <motion.header 
        className="relative z-10 p-6 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          animate={{ 
            scale: [1, 1.02, 1],
            rotateZ: [0, 0.5, -0.5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          🚀 Navigation Phase 1 Intégrée
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-700 max-w-3xl mx-auto mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Expérience utilisateur fluide et intuitive pour votre planification de retraite
        </motion.p>

        {/* Contrôles Phase 2 */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <PhysicsCard
            physics={{ gravity: false, friction: 0.8 }}
            effects={{ shadow: true, glow: isRotating }}
            className="cursor-pointer"
            onClick={startThemeRotation}
          >
            <div className="text-center p-3">
              <motion.div
                animate={{ rotate: isRotating ? 360 : 0 }}
                transition={{ duration: 2, repeat: isRotating ? Infinity : 0 }}
              >
                <Rocket className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              </motion.div>
              <span className="text-sm font-medium">
                {isRotating ? 'Arrêter' : 'Démarrer'} Rotation
              </span>
            </div>
          </PhysicsCard>

          <PhysicsCard
            physics={{ gravity: false, friction: 0.8 }}
            effects={{ shadow: true, glow: showParticles }}
            className="cursor-pointer"
            onClick={() => setShowParticles(!showParticles)}
          >
            <div className="text-center p-3">
              <Sparkles className={`w-6 h-6 mx-auto mb-2 ${showParticles ? 'text-purple-500' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">
                {showParticles ? 'Masquer' : 'Afficher'} Particules
              </span>
            </div>
          </PhysicsCard>

          <PhysicsCard
            physics={{ gravity: false, friction: 0.8 }}
            effects={{ shadow: true, glow: showPhysics }}
            className="cursor-pointer"
            onClick={() => setShowPhysics(!showPhysics)}
          >
            <div className="text-center p-3">
              <Zap className={`w-6 h-6 mx-auto mb-2 ${showPhysics ? 'text-green-500' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">
                {showPhysics ? 'Désactiver' : 'Activer'} Physique
              </span>
            </div>
          </PhysicsCard>
        </motion.div>

        {/* Indicateur de thème actuel */}
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full"
          whileHover={{ scale: 1.05 }}
        >
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-medium">{currentTheme.name}</span>
          <span className="text-sm opacity-75">• {currentTheme.mood}</span>
        </motion.div>
      </motion.header>

      {/* Navigation principale avec cartes physiques */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {tabs.map((tab, index) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
            >
              <PhysicsCard
                physics={{ 
                  gravity: showPhysics, 
                  friction: 0.9, 
                  bounce: 0.8 
                }}
                effects={{ 
                  shadow: true, 
                  glow: activeSection === tab.id,
                  particles: tab.badge === 'Pro'
                }}
                className={`cursor-pointer transition-all duration-300 ${
                  activeSection === tab.id 
                    ? 'ring-4 ring-blue-400/50 scale-105' 
                    : ''
                }`}
                onClick={() => setActiveSection(tab.id)}
              >
                <div className="p-4 text-center min-w-[120px]">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <tab.icon className="w-5 h-5" />
                    {tab.badge && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{tab.label}</span>
                </div>
              </PhysicsCard>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Indicateurs de plan et progression */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
              Plan actuel : Gratuit
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Progression globale</span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '35%' }}
                transition={{ delay: 1.3, duration: 1 }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">35%</span>
          </div>
        </motion.div>
      </div>

      {/* Étapes de progression */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          {['Profil', '2', '3', '4', '5'].map((step, index) => (
            <motion.div
              key={step}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.6 }}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                index === 0 ? 'bg-green-500' : 'bg-blue-500'
              }`}>
                {index === 0 ? <User className="w-6 h-6" /> : step}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {index === 0 ? 'Profil' : 
                 index === 1 ? 'Planification' :
                 index === 2 ? 'Analyse' :
                 index === 3 ? 'Rapports' : 'Sécurité'}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Fonctionnalités principales avec cartes physiques */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <motion.h2 
          className="text-2xl font-bold text-center mb-6 text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.8 }}
        >
          Fonctionnalités principales
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 + index * 0.1, duration: 0.6 }}
            >
              <PhysicsCard
                physics={{ 
                  gravity: showPhysics, 
                  friction: 0.9, 
                  bounce: 0.8 
                }}
                effects={{ 
                  shadow: true, 
                  glow: card.status === 'completed',
                  particles: card.status === 'completed'
                }}
                className="cursor-pointer h-full"
                onClick={() => handleCardClick(card)}
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      card.status === 'completed' ? 'bg-green-100 text-green-600' :
                      card.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{card.title}</h3>
                      <p className="text-sm text-gray-600">{card.description}</p>
                    </div>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="mt-auto">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression</span>
                      <span className="font-medium">{card.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          card.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${card.progress}%` }}
                        transition={{ delay: 2.1 + index * 0.1, duration: 1 }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        card.status === 'completed' ? 'bg-green-100 text-green-800' :
                        card.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {card.status === 'completed' ? 'Terminé' : 
                         card.status === 'in-progress' ? 'En cours' : 'Verrouillé'}
                      </span>
                      <span className="text-xs text-blue-600 hover:underline cursor-pointer">
                        Cliquez pour accéder
                      </span>
                    </div>
                  </div>
                </div>
              </PhysicsCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <motion.h2 
          className="text-2xl font-bold text-center mb-6 text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          Actions rapides
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActionCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7 + index * 0.1, duration: 0.6 }}
            >
              <PhysicsCard
                physics={{ 
                  gravity: showPhysics, 
                  friction: 0.9, 
                  bounce: 0.8 
                }}
                effects={{ 
                  shadow: true, 
                  glow: true,
                  particles: true
                }}
                className="cursor-pointer h-full"
                onClick={() => handleCardClick(card)}
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-100 text-green-600">
                      <card.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{card.title}</h3>
                      <p className="text-sm text-gray-600">{card.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression</span>
                      <span className="font-medium">{card.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="h-2 bg-green-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${card.progress}%` }}
                        transition={{ delay: 2.9 + index * 0.1, duration: 1 }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                        {card.status}
                      </span>
                      <span className="text-xs text-blue-600 hover:underline cursor-pointer">
                        Cliquez pour accéder
                      </span>
                    </div>
                  </div>
                </div>
              </PhysicsCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Nouvelles fonctionnalités */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <motion.h2 
          className="text-2xl font-bold text-center mb-6 text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.1, duration: 0.8 }}
        >
          Nouvelles fonctionnalités ajoutées
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.3 + index * 0.1, duration: 0.6 }}
            >
              <PhysicsCard
                physics={{ 
                  gravity: showPhysics, 
                  friction: 0.9, 
                  bounce: 0.8 
                }}
                effects={{ 
                  shadow: true, 
                  glow: feature.status === 'Disponible maintenant',
                  particles: feature.status === 'Disponible maintenant'
                }}
                className="cursor-pointer h-full"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      feature.status === 'Disponible maintenant' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      feature.status === 'Disponible maintenant' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                </div>
              </PhysicsCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer avec informations Phase 2 */}
      <motion.footer 
        className="text-center py-8 text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 0.8 }}
      >
        <p className="text-lg">
          🚀 <strong>Phase 2</strong> - Expérience Immersive & Intelligente
        </p>
        <p className="text-sm mt-2">
          Propulsé par l'IA adaptative, la physique réaliste et la magie des particules
        </p>
      </motion.footer>
    </div>
  );
};
