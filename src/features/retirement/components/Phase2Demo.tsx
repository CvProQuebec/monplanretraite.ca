// Démonstration complète de la Phase 2 : L'Expérience Immersive & Intelligente
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useDynamicTheme, 
  useAdaptiveLayout,
  IntelligentSkeleton,
  PhysicsCard,
  InteractiveParticles,
  TabbedNavigation,
  InteractiveCard,
  CardGrid,
  StepNavigation
} from '../index';
import {
  Sun,
  Moon,
  Zap,
  Palette,
  Brain,
  Sparkles,
  Target,
  Users,
  Shield,
  DollarSign,
  TrendingUp,
  Calendar,
  Calculator,
  Crown,
  Star,
  Heart,
  Rocket,
  Magic,
  Eye,
  Sparkle
} from 'lucide-react';

export const Phase2Demo: React.FC = () => {
  const { currentTheme, themes, changeTheme, startThemeRotation, isRotating } = useDynamicTheme();
  const { currentLayout, screenContext, getLayoutRecommendations, recordFeatureUsage } = useAdaptiveLayout();
  const [activeTab, setActiveTab] = useState('themes');
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);

  // Simulation de chargement
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Enregistrement de l'utilisation
  useEffect(() => {
    recordFeatureUsage('phase2-demo', 'Phase 2 Demo', 0);
  }, [recordFeatureUsage]);

  // Données de démonstration
  const demoData = {
    cards: [
      { id: 1, title: 'Thèmes Dynamiques', description: 'IA qui s\'adapte à votre humeur', type: 'card' },
      { id: 2, title: 'Skeletons Intelligents', description: 'Prédiction automatique du contenu', type: 'table' },
      { id: 3, title: 'Physique Réaliste', description: 'Cartes avec gravité et rebonds', type: 'chart' }
    ],
    steps: [
      { id: 'themes', label: 'Thèmes IA', description: 'Adaptation automatique', status: 'completed' as const },
      { id: 'skeletons', label: 'Skeletons', description: 'Chargement intelligent', status: 'current' as const },
      { id: 'physics', label: 'Physique', description: 'Mouvement réaliste', status: 'upcoming' as const },
      { id: 'particles', label: 'Particules', description: 'Interactions magiques', status: 'upcoming' as const }
    ]
  };

  // Configuration des onglets
  const tabs = [
    { id: 'themes', label: '🎨 Thèmes IA', icon: Palette },
    { id: 'skeletons', label: '⚡ Skeletons', icon: Zap },
    { id: 'physics', label: '🎭 Physique', icon: Sparkles },
    { id: 'particles', label: '✨ Particules', icon: Star },
    { id: 'layout', label: '🧠 Layout IA', icon: Brain }
  ];

  // Gestion des changements d'onglets
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    recordFeatureUsage(`tab-${tabId}`, `Tab ${tabId}`, 0);
  };

  // Gestion des étapes
  const handleStepClick = (stepId: string) => {
    const stepIndex = demoData.steps.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    }
  };

  // Rotation automatique des thèmes
  const handleThemeRotation = () => {
    console.log('🎭 Rotation des thèmes déclenchée');
    startThemeRotation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Particules de fond interactives */}
      {showParticles && (
        <InteractiveParticles
          count={100}
          interactive={true}
          magnetic={true}
          energy={true}
          theme="auto"
          className="fixed inset-0 pointer-events-none z-0"
        />
      )}

      {/* En-tête avec thème dynamique */}
      <motion.header
        className="relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <motion.h1
              className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              🚀 Phase 2 : L'Expérience Immersive
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Découvrez la magie de l'IA, de la physique réaliste et des animations immersives
            </motion.p>

            {/* Contrôles interactifs */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <motion.button
                className={`px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 ${
                  isRotating 
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleThemeRotation}
              >
                {isRotating ? '⏹️ Arrêter Rotation' : '🎭 Rotation Auto des Thèmes'}
              </motion.button>
              
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('✨ Particules toggle:', !showParticles);
                  setShowParticles(!showParticles);
                }}
              >
                {showParticles ? '🔇 Désactiver Particules' : '✨ Activer Particules'}
              </motion.button>
              
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('🎭 Physique toggle:', !physicsEnabled);
                  setPhysicsEnabled(!physicsEnabled);
                }}
              >
                {physicsEnabled ? '⏸️ Désactiver Physique' : '▶️ Activer Physique'}
              </motion.button>
            </div>

            {/* Indicateur de thème actuel */}
            {currentTheme && (
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full shadow-lg"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${currentTheme.primary}`} />
                <span className="font-medium text-gray-700">
                  Thème actuel : {currentTheme.name}
                </span>
                <span className="text-sm text-gray-500">
                  Humeur : {currentTheme.mood}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Navigation par onglets */}
      <div className="relative z-10">
        <TabbedNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Navigation par étapes */}
      <div className="relative z-10 bg-white/60 backdrop-blur-sm border-b border-gray-200">
        <StepNavigation
          steps={demoData.steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          showProgress={true}
        />
      </div>

      {/* Contenu principal */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* Onglet Thèmes IA */}
          {activeTab === 'themes' && (
            <motion.div
              key="themes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  🎨 Thèmes Dynamiques avec IA
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Des thèmes qui s'adaptent automatiquement à l'heure, votre humeur et vos préférences
                </p>
              </div>

              {/* Grille de thèmes */}
              <CardGrid columns={3} gap="lg">
                {Object.entries(themes).map(([key, theme]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <InteractiveCard
                      title={theme.name}
                      description={theme.mood}
                      icon={key === 'morning' ? Sun : key === 'night' ? Moon : key === 'premium' ? Crown : key === 'creative' ? Sparkles : Palette}
                      status={currentTheme?.id === key ? 'completed' : 'in-progress'}
                      progress={currentTheme?.id === key ? 100 : 60}
                      onClick={() => changeTheme(key)}
                      className="cursor-pointer"
                    />
                  </motion.div>
                ))}
              </CardGrid>

              {/* Informations sur le thème actuel */}
              {currentTheme && (
                <motion.div
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    🎯 Thème Actuel : {currentTheme.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Caractéristiques</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Humeur : {currentTheme.mood}</li>
                        <li>• Intensité : {Math.round(currentTheme.intensity * 100)}%</li>
                        <li>• Particules : {currentTheme.particles ? 'Activées' : 'Désactivées'}</li>
                        <li>• Animations : {currentTheme.animations}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Couleurs</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded bg-gradient-to-r ${currentTheme.primary}`} />
                          <span className="text-sm text-gray-600">Primaire</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded bg-gradient-to-r ${currentTheme.secondary}`} />
                          <span className="text-sm text-gray-600">Secondaire</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded bg-gradient-to-r ${currentTheme.accent}`} />
                          <span className="text-sm text-gray-600">Accent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Onglet Skeletons Intelligents */}
          {activeTab === 'skeletons' && (
            <motion.div
              key="skeletons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  ⚡ Skeletons Intelligents avec IA
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Des placeholders qui prédient automatiquement le type de contenu et s'adaptent
                </p>
              </div>

              {/* Démonstration des skeletons */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Skeleton Automatique</h3>
                  <IntelligentSkeleton
                    isLoading={isLoading}
                    data={demoData.cards}
                    className="bg-white p-6 rounded-xl shadow-lg"
                  />
                  
                  <motion.button
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => setIsLoading(!isLoading)}
                  >
                    {isLoading ? 'Chargement...' : 'Recharger'}
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Types Spécialisés</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Skeleton Carte</h4>
                      <CardSkeleton
                        isLoading={true}
                        className="bg-white p-4 rounded-lg shadow"
                      />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Skeleton Tableau</h4>
                      <TableSkeleton
                        isLoading={true}
                        className="bg-white p-4 rounded-lg shadow"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Onglet Physique Réaliste */}
          {activeTab === 'physics' && (
            <motion.div
              key="physics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  🎭 Physique Réaliste avec Framer Motion
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Des cartes avec gravité, élasticité, inertie et effets 3D qui vous donnent l'impression de toucher l'écran
                </p>
              </div>

              {/* Grille de cartes physiques */}
              <CardGrid columns={3} gap="lg">
                <PhysicsCard
                  drag={physicsEnabled}
                  physics={{ gravity: true, friction: 0.9, bounce: 0.8 }}
                  effects={{ shadow: true, glow: true, particles: true, ripple: true }}
                  className="group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Carte Physique</h3>
                    <p className="text-gray-600">Glissez-moi ! J'ai de la gravité et des rebonds</p>
                  </div>
                </PhysicsCard>

                <SimplePhysicsCard
                  drag={physicsEnabled}
                  className="group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Carte Simple</h3>
                    <p className="text-gray-600">Physique de base avec effets subtils</p>
                  </div>
                </SimplePhysicsCard>

                <AdvancedPhysicsCard
                  drag={physicsEnabled}
                  className="group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Carte Avancée</h3>
                    <p className="text-gray-600">Tous les effets activés + physique avancée</p>
                  </div>
                </AdvancedPhysicsCard>
              </CardGrid>

              {/* Instructions */}
              <motion.div
                className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  🎯 Comment interagir
                </h3>
                <p className="text-blue-700">
                  {physicsEnabled 
                    ? "Glissez les cartes pour voir la physique en action ! Elles ont de la gravité, des rebonds et des effets 3D."
                    : "Activez la physique pour interagir avec les cartes !"
                  }
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Onglet Particules Interactives */}
          {activeTab === 'particles' && (
            <motion.div
              key="particles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  ✨ Particules Interactives Magiques
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Des particules vivantes qui réagissent à votre souris et créent une expérience immersive
                </p>
              </div>

              {/* Démonstrations de particules */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Particules Magnétiques</h3>
                  <MagneticParticles
                    count={80}
                    theme="creative"
                    className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200"
                  >
                    <div className="text-center pt-8">
                      <p className="text-purple-700 font-medium">Déplacez votre souris ici</p>
                      <p className="text-purple-600 text-sm">Les particules vous suivent !</p>
                    </div>
                  </MagneticParticles>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Particules Énergétiques</h3>
                  <EnergyParticles
                    count={60}
                    theme="premium"
                    className="h-64 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200"
                  >
                    <div className="text-center pt-8">
                      <p className="text-amber-700 font-medium">Cliquez pour activer l'énergie !</p>
                      <p className="text-amber-600 text-sm">Les particules explosent !</p>
                    </div>
                  </EnergyParticles>
                </div>
              </div>

              {/* Particules de fond */}
              <div className="relative">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Particules de Fond</h3>
                <SimpleParticles
                  count={120}
                  theme="auto"
                  className="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                >
                  <div className="text-center pt-4">
                    <p className="text-blue-700 font-medium">Particules décoratives</p>
                    <p className="text-blue-600 text-sm">Pas d'interaction, juste de la beauté</p>
                  </div>
                </SimpleParticles>
              </div>
            </motion.div>
          )}

          {/* Onglet Layout IA */}
          {activeTab === 'layout' && (
            <motion.div
              key="layout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  🧠 Layout Adaptatif Intelligent
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Une interface qui apprend de vos habitudes et s'adapte automatiquement
                </p>
              </div>

              {/* Informations sur le layout actuel */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  🎯 Configuration Actuelle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Affichage</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Colonnes : {currentLayout.columns}</p>
                      <p>• Espacement : {currentLayout.spacing}</p>
                      <p>• Densité : {currentLayout.density}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Animations</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Niveau : {currentLayout.animations}</p>
                      <p>• Raccourcis : {currentLayout.shortcuts ? 'Oui' : 'Non'}</p>
                      <p>• Préchargement : {currentLayout.predictiveLoading ? 'Oui' : 'Non'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Contexte</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Écran : {screenContext.size}</p>
                      <p>• Orientation : {screenContext.orientation}</p>
                      <p>• Résolution : {screenContext.viewport.width}x{screenContext.viewport.height}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommandations IA */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-4">
                  🤖 Recommandations de l'IA
                </h3>
                <div className="space-y-3">
                  {(() => {
                    const recommendations = getLayoutRecommendations();
                    if (!recommendations || recommendations.length === 0) {
                      // Recommandations par défaut si aucune n'est disponible
                      return [
                        {
                          type: 'default',
                          message: 'Configuration optimale pour votre écran actuel',
                          config: { columns: currentLayout.columns, spacing: currentLayout.spacing }
                        },
                        {
                          type: 'performance',
                          message: 'Animations équilibrées pour une expérience fluide',
                          config: { animations: currentLayout.animations, density: currentLayout.density }
                        }
                      ].map((rec, index) => (
                        <motion.div
                          key={rec.type}
                          className="flex items-center gap-3 p-3 bg-white/60 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Sparkle className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-purple-900">{rec.message}</p>
                            <p className="text-sm text-purple-700">
                              Configuration : {Object.entries(rec.config).map(([k, v]) => `${k}: ${v}`).join(', ')}
                            </p>
                          </div>
                        </motion.div>
                      ));
                    }
                    
                    return recommendations.map((rec, index) => (
                      <motion.div
                        key={rec.type}
                        className="flex items-center gap-3 p-3 bg-white/60 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Sparkle className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-purple-900">{rec.message}</p>
                          <p className="text-sm text-purple-700">
                            Configuration : {Object.entries(rec.config).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </p>
                        </div>
                      </motion.div>
                    ));
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer avec statistiques */}
      <motion.footer
        className="relative z-10 bg-white/80 backdrop-blur-md border-t border-gray-200 py-8 mt-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Expérience Immersive</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>IA Adaptative</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              <span>Performance Optimisée</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>Fait avec ❤️</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};
