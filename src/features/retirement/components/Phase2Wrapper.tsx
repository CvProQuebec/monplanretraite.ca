import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveParticles } from './InteractiveParticles';
import { useDynamicTheme } from '../hooks/useDynamicTheme';
import { useScreenContext } from '../hooks/useScreenContext';
import { useAdaptiveLayout } from '../hooks/useAdaptiveLayout';
import { useThemeRotation } from '../hooks/useThemeRotation';
import { usePhysicsToggle } from '../hooks/usePhysicsToggle';
import { useParticlesToggle } from '../hooks/useParticlesToggle';
import { useMobileDetection } from '../hooks/useMobileDetection';

interface Phase2WrapperProps {
  children: React.ReactNode;
  showParticles?: boolean;
  showPhysics?: boolean;
  theme?: 'auto' | 'morning' | 'afternoon' | 'evening' | 'night' | 'premium' | 'creative';
  className?: string;
  enableThemeRotation?: boolean;
  enableAdaptiveLayout?: boolean;
  enablePhysicsToggle?: boolean;
  enableParticlesToggle?: boolean;
  showControls?: boolean;
}

export const Phase2Wrapper: React.FC<Phase2WrapperProps> = ({
  children,
  showParticles = true,
  showPhysics = false,
  theme = 'auto',
  className = '',
  enableThemeRotation = true,
  enableAdaptiveLayout = true,
  enablePhysicsToggle = true,
  enableParticlesToggle = true,
  showControls = true,
}) => {
  // Hooks Phase 2
  const { currentTheme, setTheme } = useDynamicTheme(theme);
  const screenContext = useScreenContext();
  const { currentLayout } = useAdaptiveLayout(screenContext);
  const { isRotating, startThemeRotation, stopThemeRotation } = useThemeRotation(currentTheme, setTheme);
  const { isPhysicsEnabled: physicsFromHook, togglePhysics } = usePhysicsToggle(showPhysics);
  const { areParticlesEnabled: particlesFromHook, toggleParticles } = useParticlesToggle(showParticles);
  const isMobile = useMobileDetection();

  // États locaux
  const [isParticlesVisible, setIsParticlesVisible] = useState(showParticles);
  const [isPhysicsEnabledLocal, setIsPhysicsEnabledLocal] = useState(showPhysics);
  const [showControlsLocal, setShowControlsLocal] = useState(false);

  // Rotation automatique des thèmes si activée
  useEffect(() => {
    if (enableThemeRotation && !isRotating) {
      const timer = setTimeout(() => {
        startThemeRotation();
      }, 5000); // Démarrer après 5 secondes
      
      return () => clearTimeout(timer);
    }
  }, [enableThemeRotation, isRotating, startThemeRotation]);

  // Classes dynamiques basées sur le thème
  const getThemeClasses = () => {
    const themeId = theme === 'auto' ? currentTheme.id : theme;
    
    switch (themeId) {
      case 'morning':
        return 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50';
      case 'afternoon':
        return 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';
      case 'evening':
        return 'bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50';
      case 'night':
        return 'bg-gradient-to-br from-slate-900 via-gray-800 to-indigo-900';
      case 'premium':
        return 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50';
      case 'creative':
        return 'bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50';
      default:
        return 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';
    }
  };

  const themeClasses = getThemeClasses();

  // Toggle des contrôles avec la touche Alt + Shift + P
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key === 'P') {
        setShowControlsLocal(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${themeClasses} ${className}`}>
      {/* Particules de fond Phase 2 */}
      {isParticlesVisible && (
        <InteractiveParticles
          count={enableAdaptiveLayout ? (currentLayout.columns === 1 ? 15 : 30) : 25}
          theme={theme === 'auto' ? currentTheme.id : theme}
          interactive={true}
          magnetic={true}
          energy={true}
          className="fixed inset-0 pointer-events-none z-0"
        />
      )}

      {/* Contrôles flottants (Ctrl + Shift + P pour afficher) */}
      <AnimatePresence>
        {showControlsLocal && (
          <motion.div
            className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 p-4"
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 text-sm">🎛️ Contrôles Phase 2</h3>
              
              {/* Toggle particules */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="particles-toggle"
                  checked={isParticlesVisible}
                  onChange={(e) => setIsParticlesVisible(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="particles-toggle" className="text-sm text-gray-700">
                  Particules
                </label>
              </div>

              {/* Toggle physique */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="physics-toggle"
                  checked={isPhysicsEnabledLocal}
                  onChange={(e) => setIsPhysicsEnabledLocal(e.target.checked)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="physics-toggle" className="text-sm text-gray-700">
                  Physique
                </label>
              </div>

              {/* Rotation des thèmes */}
              {enableThemeRotation && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rotation-toggle"
                    checked={isRotating}
                    onChange={(e) => {
                      if (e.target.checked) {
                        startThemeRotation();
                      }
                    }}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="rotation-toggle" className="text-sm text-gray-700">
                    Rotation thèmes
                  </label>
                </div>
              )}

              {/* Informations de debug */}
              {enableAdaptiveLayout && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Écran: {screenContext.size}</div>
                    <div>Colonnes: {currentLayout.columns}</div>
                    <div>Thème: {currentTheme.name}</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicateur de thème flottant - Masqué sur mobile */}
      {!isMobile && (
        <motion.div
          className="fixed bottom-4 left-4 z-40 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-3 h-3 rounded-full ${
              currentTheme.id === 'morning' ? 'bg-orange-400' :
              currentTheme.id === 'afternoon' ? 'bg-blue-400' :
              currentTheme.id === 'evening' ? 'bg-purple-400' :
              currentTheme.id === 'night' ? 'bg-slate-400' :
              currentTheme.id === 'premium' ? 'bg-amber-400' :
              'bg-pink-400'
            }`} />
            <span className="font-medium text-gray-700">{currentTheme.name}</span>
          </div>
        </motion.div>
      )}

      {/* Contenu principal avec animations d'entrée */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.div>

      {/* Indicateur de raccourci clavier - Masqué sur mobile */}
      {!isMobile && (
        <motion.div
          className="fixed bottom-4 right-4 z-40 bg-black/20 backdrop-blur-sm rounded-full px-3 py-2 text-white text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          Alt + Shift + P
        </motion.div>
      )}
    </div>
  );
};

// Variantes spécialisées
export const Phase2WrapperLight: React.FC<Omit<Phase2WrapperProps, 'showParticles' | 'showPhysics'>> = (props) => (
  <Phase2Wrapper {...props} showParticles={false} showPhysics={false} />
);

export const Phase2WrapperHeavy: React.FC<Omit<Phase2WrapperProps, 'showParticles' | 'showPhysics'>> = (props) => (
  <Phase2Wrapper {...props} showParticles={true} showPhysics={true} />
);

export const Phase2WrapperAuto: React.FC<Omit<Phase2WrapperProps, 'theme'>> = (props) => (
  <Phase2Wrapper {...props} theme="auto" />
);

export default Phase2Wrapper;
