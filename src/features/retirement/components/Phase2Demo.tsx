// Démonstration complète de la Phase 2 : L'Expérience Immersive & Intelligente
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Brain, 
  Palette, 
  Cpu, 
  Atom, 
  Star, 
  Rocket,
  Eye,
  Heart,
  Target,
  TrendingUp,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Sun,
  Moon,
  Coffee,
  Palette as PaletteIcon
} from 'lucide-react';

// Import de nos composants Phase 2
import { InteractiveParticles } from './InteractiveParticles';
import { PhysicsCard } from './PhysicsCard';
import { useDynamicTheme } from '../hooks/useDynamicTheme';
import { useAdaptiveLayout } from '../hooks/useAdaptiveLayout';

// Types pour les modules
interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'learning' | 'optimizing' | 'ready';
  performance: number;
  features: string[];
}

// Configuration des modules IA
const IA_MODULES: Module[] = [
  {
    id: 'themes',
    name: 'Thèmes IA Dynamiques',
    description: 'Adaptation automatique des couleurs et styles selon l\'heure et l\'humeur',
    icon: <Palette className="w-6 h-6" />,
    status: 'active',
    performance: 95,
    features: ['Rotation automatique', 'Adaptation temporelle', '6 thèmes intelligents']
  },
  {
    id: 'skeletons',
    name: 'Skeletons Intelligents',
    description: 'Chargement adaptatif avec prédiction de contenu',
    icon: <Brain className="w-6 h-6" />,
    status: 'learning',
    performance: 87,
    features: ['Prédiction IA', 'Chargement progressif', 'Placeholders adaptatifs']
  },
  {
    id: 'physics',
    name: 'Physique Réaliste',
    description: 'Mouvements naturels avec gravité et rebonds authentiques',
    icon: <Atom className="w-6 h-6" />,
    status: 'optimizing',
    performance: 92,
    features: ['Gravité réaliste', 'Rebonds naturels', 'Inertie physique']
  },
  {
    id: 'particles',
    name: 'Particules Interactives',
    description: 'Système de particules magnétiques et énergétiques',
    icon: <Sparkles className="w-6 h-6" />,
    status: 'ready',
    performance: 89,
    features: ['Magnétisme', 'Explosions d\'énergie', '7 thèmes visuels']
  },
  {
    id: 'layout',
    name: 'Layout IA Adaptatif',
    description: 'Interface qui s\'adapte intelligemment à l\'utilisateur',
    icon: <Cpu className="w-6 h-6" />,
    status: 'active',
    performance: 93,
    features: ['Détection d\'écran', 'Recommandations IA', 'Optimisation automatique']
  }
];

export const Phase2Demo: React.FC = () => {
  // Hooks Phase 2
  const { 
    currentTheme, 
    themes, 
    changeTheme, 
    startThemeRotation, 
    isRotating 
  } = useDynamicTheme();
  
  const { 
    currentLayout, 
    screenContext, 
    recommendations, 
    recordFeatureUsage 
  } = useAdaptiveLayout();

  // États locaux
  const [activeModule, setActiveModule] = useState<string>('themes');
  const [showParticles, setShowParticles] = useState(true);
  const [showPhysics, setShowPhysics] = useState(true);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Enregistrement de l'utilisation
  useEffect(() => {
    recordFeatureUsage('phase2-demo', 'Phase 2 Demo', 0);
  }, [recordFeatureUsage]);

  // Changement de thème automatique
  const handleThemeChange = (themeId: string) => {
    changeTheme(themeId);
    recordFeatureUsage('theme-change', `Thème ${themeId}`, 1);
  };

  // Gestion des modules
  const handleModuleSelect = (moduleId: string) => {
    setActiveModule(moduleId);
    recordFeatureUsage('module-select', `Module ${moduleId}`, 2);
  };

  // Toggle des effets
  const toggleParticles = () => {
    setShowParticles(!showParticles);
    recordFeatureUsage('toggle-particles', 'Particules', 1);
  };

  const togglePhysics = () => {
    setShowPhysics(!showPhysics);
    recordFeatureUsage('toggle-physics', 'Physique', 1);
  };

  // Mode performance
  const togglePerformanceMode = () => {
    setPerformanceMode(!performanceMode);
    recordFeatureUsage('performance-mode', 'Mode Performance', 1);
  };

  // Classes dynamiques basées sur le thème
  const getThemeClasses = () => {
    const theme = themes[currentTheme.id] || themes.afternoon;
    return {
      background: `bg-gradient-to-br ${theme.background}`,
      primary: `from-${theme.primary.split('-')[1]}-500 to-${theme.primary.split('-')[2]}-600`,
      secondary: `from-${theme.secondary.split('-')[1]}-400 to-${theme.secondary.split('-')[2]}-500`
    };
  };

  const themeClasses = getThemeClasses();

  return (
    <div className={`min-h-screen ${themeClasses.background} transition-all duration-1000`}>
      {/* Particules de fond */}
      {showParticles && (
        <InteractiveParticles
          count={performanceMode ? 20 : 50}
          theme={currentTheme.id}
          className="fixed inset-0 pointer-events-none"
        />
      )}

      {/* Header principal */}
      <motion.header 
        className="relative z-10 p-6 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-5xl font-bold mb-4 bg-gradient-to-r from-mpr-interactive to-purple-600 bg-clip-text text-transparent"
          animate={{ 
            scale: [1, 1.05, 1],
            rotateZ: [0, 1, -1, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          🚀 Phase 2 : L'Expérience Immersive & Intelligente
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-700 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Découvrez la puissance de l'IA adaptative, de la physique réaliste et des particules interactives
        </motion.p>

        {/* Indicateur de thème actuel */}
        <motion.div 
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full"
          whileHover={{ scale: 1.05 }}
        >
          <PaletteIcon className="w-5 h-5" />
          <span className="font-medium">{currentTheme.name}</span>
          <span className="text-sm opacity-75">• {currentTheme.mood}</span>
        </motion.div>
      </motion.header>

      {/* Contrôles principaux */}
      <motion.div 
        className="max-w-6xl mx-auto px-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sélecteur de thème */}
          <PhysicsCard
            physics={{ gravity: false, friction: 0.8 }}
            effects={{ shadow: true, glow: false }}
            className="cursor-pointer"
            onClick={() => handleThemeChange('premium')}
          >
            <div className="text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <h3 className="font-semibold">Thème Premium</h3>
              <p className="text-sm text-gray-600">Luxe et sophistication</p>
            </div>
          </PhysicsCard>

          {/* Rotation automatique */}
          <PhysicsCard
            physics={{ gravity: false, friction: 0.8 }}
            effects={{ shadow: true, glow: isRotating }}
            className="cursor-pointer"
            onClick={startThemeRotation}
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: isRotating ? 360 : 0 }}
                transition={{ duration: 2, repeat: isRotating ? Infinity : 0 }}
              >
                <RotateCcw className="w-8 h-8 mx-auto mb-2 text-mpr-interactive" />
              </motion.div>
              <h3 className="font-semibold">
                {isRotating ? 'Arrêter' : 'Démarrer'} Rotation
              </h3>
              <p className="text-sm text-gray-600">
                {isRotating ? 'Rotation active' : 'Rotation automatique'}
              </p>
            </div>
          </PhysicsCard>

          {/* Toggle particules */}
          <PhysicsCard
            physics={{ gravity: false, friction: 0.8 }}
            effects={{ shadow: true, glow: showParticles }}
            className="cursor-pointer"
            onClick={toggleParticles}
          >
            <div className="text-center">
              <Sparkles className={`w-8 h-8 mx-auto mb-2 ${showParticles ? 'text-purple-500' : 'text-gray-400'}`} />
              <h3 className="font-semibold">Particules</h3>
              <p className="text-sm text-gray-600">
                {showParticles ? 'Activées' : 'Désactivées'}
              </p>
            </div>
          </PhysicsCard>

          {/* Mode performance */}
          <PhysicsCard
            physics={{ gravity: false, friction: 0.8 }}
            effects={{ shadow: true, glow: performanceMode }}
            className="cursor-pointer"
            onClick={togglePerformanceMode}
          >
            <div className="text-center">
              <Zap className={`w-8 h-8 mx-auto mb-2 ${performanceMode ? 'text-green-500' : 'text-gray-400'}`} />
              <h3 className="font-semibold">Performance</h3>
              <p className="text-sm text-gray-600">
                {performanceMode ? 'Optimisé' : 'Standard'}
              </p>
            </div>
          </PhysicsCard>
        </div>
      </motion.div>

      {/* Modules IA */}
      <motion.div 
        className="max-w-6xl mx-auto px-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          🧠 Modules IA Intelligents
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {IA_MODULES.map((module, index) => (
            <motion.div
              key={module.id}
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
                  glow: activeModule === module.id,
                  particles: module.status === 'active'
                }}
                className={`cursor-pointer transition-all duration-300 ${
                  activeModule === module.id 
                    ? 'ring-4 ring-mpr-interactive/50 scale-105' 
                    : ''
                }`}
                onClick={() => handleModuleSelect(module.id)}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      module.status === 'active' ? 'bg-green-100 text-green-600' :
                      module.status === 'learning' ? 'bg-mpr-interactive-lt text-mpr-interactive' :
                      module.status === 'optimizing' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {module.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{module.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-600 capitalize">{module.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{module.description}</p>
                  
                  {/* Barre de performance */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Performance</span>
                      <span className="font-medium">{module.performance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-green-400 to-mpr-interactive h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${module.performance}%` }}
                        transition={{ delay: 0.2 * index, duration: 1 }}
                      />
                    </div>
                  </div>
                  
                  {/* Fonctionnalités */}
                  <div className="space-y-1">
                    {module.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-mpr-interactive"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </PhysicsCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Démonstration interactive */}
      <motion.div 
        className="max-w-6xl mx-auto px-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          🎮 Zone de Démonstration Interactive
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Zone de test physique */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-4">🧪 Test de Physique</h3>
            <div className="h-64 bg-gradient-to-br from-mpr-interactive-lt to-mpr-interactive-lt rounded-xl border-2 border-dashed border-mpr-border flex items-center justify-center">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-mpr-interactive to-purple-600 rounded-full cursor-grab"
                drag
                dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                dragElastic={0.8}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
            <p className="text-center text-sm text-gray-600">
              Glissez-déposez la boule pour tester la physique !
            </p>
          </div>

          {/* Zone de test de particules */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-4">✨ Test de Particules</h3>
            <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl border-2 border-dashed border-purple-300 relative overflow-hidden">
              <InteractiveParticles
                count={30}
                theme={currentTheme.id}
                interactive={true}
                magnetic={true}
                energy={true}
                className="absolute inset-0"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p className="text-sm font-medium">Cliquez pour des explosions !</p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600">
              Cliquez dans la zone pour créer des explosions d'énergie !
            </p>
          </div>
        </div>
      </motion.div>

      {/* Informations de debug */}
      {showDebug && (
        <motion.div 
          className="max-w-6xl mx-auto px-6 mb-8"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="bg-gray-800 text-white p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">🔧 Informations de Debug</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Contexte d'écran</h4>
                <pre className="text-sm bg-gray-900 p-3 rounded overflow-auto">
                  {JSON.stringify(screenContext, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">Layout actuel</h4>
                <pre className="text-sm bg-gray-900 p-3 rounded overflow-auto">
                  {JSON.stringify(currentLayout, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bouton de debug */}
      <div className="text-center mb-8">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          {showDebug ? 'Masquer' : 'Afficher'} Debug
        </button>
      </div>

      {/* Footer avec statistiques */}
      <motion.footer 
        className="text-center py-8 text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
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

export default Phase2Demo;
