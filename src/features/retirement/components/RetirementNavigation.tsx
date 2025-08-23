import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useRetirementData } from '../hooks/useRetirementData';
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
  Info,
  Layers,
  Cpu
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
  
  // Hook pour les données de retraite avec progressions dynamiques
  const { calculateSectionProgress, getSectionStatus } = useRetirementData();

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

  // Configuration des étapes - Mise à jour selon le nouvel ordre séquentiel
  const steps = [
    { id: 'profile', label: language === 'fr' ? 'Profil' : 'Profile', status: 'completed' as const },
    { id: 'planning', label: language === 'fr' ? 'Planification' : 'Planning', status: 'current' as const },
    { id: 'savings', label: language === 'fr' ? 'Épargne' : 'Savings', status: 'in-progress' as const },
    { id: 'advanced', label: language === 'fr' ? 'Fonctionnalités avancées' : 'Advanced Features', status: 'upcoming' as const },
    { id: 'reports', label: language === 'fr' ? 'Rapports' : 'Reports', status: 'upcoming' as const },
  ];

  // Configuration des cartes principales - Réorganisées dans l'ordre séquentiel de complétion du profil
  const mainCards = [
    {
      id: 'profile',
      title: language === 'fr' ? 'Profil personnel' : 'Personal Profile',
      description: language === 'fr' ? 'Informations personnelles et objectifs' : 'Personal information and goals',
      icon: User,
      status: getSectionStatus(calculateSectionProgress('personal')),
      progress: calculateSectionProgress('personal'),
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=personal' : '/en/retirement-module?section=personal'),
      external: false
    },

    {
      id: 'retirement',
      title: language === 'fr' ? 'Planification retraite' : 'Retirement Planning',
      description: language === 'fr' ? 'Calculs et projections de retraite' : 'Retirement calculations and projections',
      icon: Calculator,
      status: getSectionStatus(calculateSectionProgress('retirement')),
      progress: calculateSectionProgress('retirement'),
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=retirement' : '/en/retirement-module?section=retirement'),
      external: false
    },
    {
      id: 'savings',
      title: language === 'fr' ? 'Gestion épargne' : 'Savings Management',
      description: language === 'fr' ? 'Suivi de vos économies et investissements' : 'Track your savings and investments',
      icon: TrendingUp,
      status: getSectionStatus(calculateSectionProgress('savings')),
      progress: calculateSectionProgress('savings'),
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=savings' : '/en/retirement-module?section=savings'),
      external: false
    },
    {
      id: 'emergency',
      title: language === 'fr' ? 'Informations d\'urgence' : 'Emergency Info',
      description: language === 'fr' ? 'Directives médicales et contacts d\'urgence' : 'Medical directives and emergency contacts',
      icon: AlertTriangle,
      status: getSectionStatus(calculateSectionProgress('emergency')),
      progress: calculateSectionProgress('emergency'),
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=emergency-info' : '/en/retirement-module?section=emergency-info'),
      external: false
    },
    {
      id: 'session',
      title: language === 'fr' ? 'Gestion des sessions' : 'Session Management',
      description: language === 'fr' ? 'Sauvegardez, chargez et sécurisez vos données' : 'Save, load and secure your data',
      icon: Database,
      status: getSectionStatus(calculateSectionProgress('session')),
      progress: calculateSectionProgress('session'),
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=session' : '/en/retirement-module?section=session'),
      external: false
    },
    {
      id: 'cashflow',
      title: language === 'fr' ? 'Analyse cashflow' : 'Cashflow Analysis',
      description: language === 'fr' ? 'Analyse détaillée de vos flux de trésorerie' : 'Detailed analysis of your cash flows',
      icon: BarChart3,
      status: getSectionStatus(calculateSectionProgress('cashflow')),
      progress: calculateSectionProgress('cashflow'),
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
      id: 'monte-carlo',
      title: language === 'fr' ? 'Simulations Monte Carlo' : 'Monte Carlo Simulations',
      description: language === 'fr' ? 'Analyses avancées avec 10,000 scénarios' : 'Advanced analysis with 10,000 scenarios',
      icon: BarChart3,
      status: 'locked' as const, // Fonctionnalité avancée verrouillée
      progress: 0,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=monte-carlo' : '/en/retirement-module?section=monte-carlo'),
      external: false
    },
    {
      id: 'risk-analysis',
      title: language === 'fr' ? 'Analyse des risques' : 'Risk Analysis',
      description: language === 'fr' ? 'Évaluation complète des risques de retraite' : 'Complete retirement risk assessment',
      icon: Shield,
      status: 'locked' as const, // Fonctionnalité avancée verrouillée
      progress: 0,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=risk-analysis' : '/en/retirement-module?section=risk-analysis'),
      external: false
    },
    {
      id: 'advanced-dashboard',
      title: language === 'fr' ? 'Tableau de bord avancé' : 'Advanced Dashboard',
      description: language === 'fr' ? 'Interface moderne avec 5 onglets spécialisés' : 'Modern interface with 5 specialized tabs',
      icon: Layers,
      status: 'locked' as const, // Fonctionnalité avancée verrouillée
      progress: 0,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module' : '/en/retirement-module'),
      external: false
    },
    {
      id: 'ai-optimization',
      title: language === 'fr' ? 'Optimisation IA' : 'AI Optimization',
      description: language === 'fr' ? 'Recommandations personnalisées par intelligence artificielle' : 'Personalized recommendations by artificial intelligence',
      icon: Cpu,
      status: 'locked' as const,
      progress: 0,
      onClick: () => navigate(language === 'fr' ? '/fr/retraite-module?section=ai-optimization' : '/en/retirement-module?section=ai-optimization'),
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



      {/* Tableau de bord avec cartes physiques - Navigation vers tous les modules */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <motion.h2 
          className="text-2xl font-bold text-center mb-6 text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.8 }}
        >
          Vue d'ensemble - Planification Retraite
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                 className="cursor-pointer h-full min-h-[320px] max-h-[320px]"
                 onClick={() => handleCardClick(card)}
               >
                                 <div className="p-6 h-full flex flex-col min-h-[280px]">
                                     <div className="flex items-center gap-3 mb-4 min-h-[80px]">
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
                   <div className="mt-auto min-h-[80px] flex flex-col justify-end">
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



      


    </div>
  );
};
