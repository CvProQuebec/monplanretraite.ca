import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Sparkles, 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  Gauge,
  Sliders,
  Palette,
  Monitor,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useDemoControls } from '../hooks/useDemoControls';
import { InteractiveParticles } from './InteractiveParticles';
import { PhysicsCard } from './PhysicsCard';

export const AdvancedDemoControls: React.FC = () => {
  const {
    isRotating,
    startThemeRotation,
    showParticles,
    toggleParticles,
    showPhysics,
    togglePhysics,
    performanceMode,
    togglePerformanceMode,
    isDemoMode,
    toggleDemoMode,
    particleIntensity,
    setParticleIntensity,
    physicsGravity,
    setPhysicsGravity,
    physicsFriction,
    setPhysicsFriction
  } = useDemoControls();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-mpr-interactive-lt to-mpr-interactive-lt p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎭 Contrôles de Démonstration Avancés
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Testez et contrôlez tous les aspects de l'expérience immersive Phase 2 : 
            thèmes dynamiques, particules interactives, physique réaliste et optimisation automatique.
          </p>
        </motion.div>

        {/* Mode Démo Global */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${isDemoMode ? 'bg-purple-100' : 'bg-gray-100'}`}>
                  <Palette className={`w-6 h-6 ${isDemoMode ? 'text-purple-600' : 'text-gray-500'}`} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Mode Démo Global</h2>
                  <p className="text-gray-600">
                    {isDemoMode 
                      ? 'Tous les effets sont activés pour une expérience maximale' 
                      : 'Mode normal avec contrôles individuels'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDemoMode}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isDemoMode
                    ? 'bg-purple-600 text-white shadow-lg hover:bg-purple-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isDemoMode ? 'Désactiver Démo' : 'Activer Démo'}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contrôles de Thèmes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-mpr-border"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Rocket className="w-6 h-6 text-mpr-interactive" />
              Contrôles de Thèmes
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-mpr-interactive-lt rounded-xl">
                <div>
                  <h4 className="font-semibold text-mpr-navy">Rotation Automatique</h4>
                  <p className="text-sm text-mpr-interactive">
                    {isRotating ? 'Thèmes en rotation toutes les 3 secondes' : 'Thèmes statiques'}
                  </p>
                </div>
                <button
                  onClick={startThemeRotation}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isRotating
                      ? 'bg-mpr-interactive text-white shadow-md'
                      : 'bg-white text-mpr-interactive border-2 border-mpr-border hover:bg-mpr-interactive-lt'
                  }`}
                >
                  {isRotating ? (
                    <div className="flex items-center gap-2">
                      <Pause className="w-4 h-4" />
                      Arrêter
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Démarrer
                    </div>
                  )}
                </button>
              </div>

              <div className="p-4 bg-gradient-to-r from-mpr-interactive-lt to-purple-100 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">Thème Actuel</h4>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-mpr-interactive to-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    {isRotating ? 'Rotation active' : 'Thème statique'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contrôles de Particules */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Contrôles de Particules
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-purple-800">Affichage des Particules</h4>
                  <p className="text-sm text-purple-600">
                    {showParticles ? 'Particules visibles' : 'Particules masquées'}
                  </p>
                </div>
                <button
                  onClick={toggleParticles}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    showParticles
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-purple-600 border-2 border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  {showParticles ? 'Masquer' : 'Afficher'}
                </button>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl">
                <h4 className="font-semibold text-purple-800 mb-2">Intensité des Particules</h4>
                <label htmlFor="particle-intensity" className="sr-only">Intensité des particules</label>
                <input
                  id="particle-intensity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={particleIntensity}
                  onChange={(e) => setParticleIntensity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                  aria-label="Intensité des particules"
                />
                <div className="flex justify-between text-xs text-purple-600 mt-1">
                  <span>Faible</span>
                  <span>{Math.round(particleIntensity * 100)}%</span>
                  <span>Élevée</span>
                </div>
              </div>

              {/* Zone de test des particules */}
              {showParticles && (
                <div className="h-32 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl border-2 border-dashed border-purple-300 relative overflow-hidden">
                  <InteractiveParticles
                    count={Math.round(particleIntensity * 50)}
                    theme="creative"
                    interactive={true}
                    magnetic={true}
                    energy={true}
                    className="absolute inset-0"
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Contrôles de Physique */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-green-600" />
              Contrôles de Physique
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-green-800">Moteur Physique</h4>
                  <p className="text-sm text-green-600">
                    {showPhysics ? 'Physique activée' : 'Physique désactivée'}
                  </p>
                </div>
                <button
                  onClick={togglePhysics}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    showPhysics
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-green-600 border-2 border-green-300 hover:bg-green-50'
                  }`}
                >
                  {showPhysics ? 'Désactiver' : 'Activer'}
                </button>
              </div>

              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-2">Gravité</h4>
                <button
                  onClick={() => setPhysicsGravity(!physicsGravity)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    physicsGravity
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-green-600 border-2 border-green-300 hover:bg-green-50'
                  }`}
                >
                  {physicsGravity ? 'Activée' : 'Désactivée'}
                </button>
              </div>

              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-2">Friction</h4>
                <label htmlFor="physics-friction" className="sr-only">Friction de la physique</label>
                <input
                  id="physics-friction"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={physicsFriction}
                  onChange={(e) => setPhysicsFriction(parseFloat(e.target.value))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                  aria-label="Friction de la physique"
                />
                <div className="flex justify-between text-xs text-green-600 mt-1">
                  <span>Glissante</span>
                  <span>{Math.round(physicsFriction * 100)}%</span>
                  <span>Adhérente</span>
                </div>
              </div>

              {/* Zone de test de la physique */}
              {showPhysics && (
                <div className="h-32 bg-gradient-to-br from-green-50 to-mpr-interactive-lt rounded-xl border-2 border-dashed border-green-300 relative overflow-hidden">
                  <PhysicsCard
                    physics={{ 
                      gravity: physicsGravity, 
                      friction: physicsFriction, 
                      bounce: 0.8 
                    }}
                    effects={{ shadow: true, glow: false }}
                    className="absolute top-4 left-4 w-16 h-16 cursor-grab"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-mpr-interactive rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Test</span>
                    </div>
                  </PhysicsCard>
                </div>
              )}
            </div>
          </motion.div>

          {/* Contrôles de Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Gauge className="w-6 h-6 text-orange-600" />
              Contrôles de Performance
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-orange-800">Mode Performance</h4>
                  <p className="text-sm text-orange-600">
                    {performanceMode 
                      ? 'Optimisé pour la performance' 
                      : 'Mode normal avec tous les effets'
                    }
                  </p>
                </div>
                <button
                  onClick={togglePerformanceMode}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    performanceMode
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-white text-orange-600 border-2 border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  {performanceMode ? 'Désactiver' : 'Activer'}
                </button>
              </div>

              <div className="p-4 bg-orange-50 rounded-xl">
                <h4 className="font-semibold text-orange-800 mb-2">Adaptation Automatique</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-orange-600" />
                    <span>Desktop: Effets complets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-orange-600" />
                    <span>Mobile: Effets réduits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {performanceMode ? (
                      <WifiOff className="w-4 h-4 text-red-600" />
                    ) : (
                      <Wifi className="w-4 h-4 text-green-600" />
                    )}
                    <span>Connexion: {performanceMode ? 'Optimisée' : 'Normale'}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Informations de Debug */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 bg-gray-800 text-white rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Informations de Debug
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-300 mb-2">État des Contrôles</h4>
              <div className="space-y-1 text-gray-400">
                <div>Rotation: {isRotating ? '🟢 Active' : '🔴 Inactive'}</div>
                <div>Particules: {showParticles ? '🟢 Visibles' : '🔴 Masquées'}</div>
                <div>Physique: {showPhysics ? '🟢 Active' : '🔴 Inactive'}</div>
                <div>Performance: {performanceMode ? '🟢 Optimisé' : '🔴 Normal'}</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Paramètres</h4>
              <div className="space-y-1 text-gray-400">
                <div>Intensité Particules: {Math.round(particleIntensity * 100)}%</div>
                <div>Gravité: {physicsGravity ? '🟢 Oui' : '🔴 Non'}</div>
                <div>Friction: {Math.round(physicsFriction * 100)}%</div>
                <div>Mode Démo: {isDemoMode ? '🟢 Oui' : '🔴 Non'}</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Actions</h4>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    toggleParticles();
                    togglePhysics();
                    startThemeRotation();
                  }}
                  className="px-3 py-1 bg-mpr-interactive text-white text-xs rounded hover:bg-mpr-interactive-dk transition-colors"
                >
                  Activer Tout
                </button>
                <button
                  onClick={() => {
                    if (showParticles) toggleParticles();
                    if (showPhysics) togglePhysics();
                    if (isRotating) startThemeRotation();
                  }}
                  className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors ml-2"
                >
                  Désactiver Tout
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
