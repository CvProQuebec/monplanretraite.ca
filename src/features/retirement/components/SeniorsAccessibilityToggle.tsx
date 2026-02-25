import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Settings, Palette, Type, Contrast, Navigation, Rocket, Sparkles, Zap, Play, Pause, RotateCcw } from 'lucide-react';
import { useDemoControls } from '../hooks/useDemoControls';

interface NavigationToggleProps {
  className?: string;
}

export const NavigationToggle: React.FC<NavigationToggleProps> = ({ 
  className = '' 
}) => {
  const [isSeniorsMode, setIsSeniorsMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Hook centralisé pour les contrôles de démonstration
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
    toggleDemoMode
  } = useDemoControls();

  // Charger les préférences depuis localStorage
  useEffect(() => {
    const savedSeniorsMode = localStorage.getItem('seniors-mode') === 'true';
    const savedHighContrast = localStorage.getItem('high-contrast') === 'true';
    const savedReducedMotion = localStorage.getItem('reduced-motion') === 'true';
    
    setIsSeniorsMode(savedSeniorsMode);
    setIsHighContrast(savedHighContrast);
    setIsReducedMotion(savedReducedMotion);
    
    // Appliquer les classes au body
    updateBodyClasses(savedSeniorsMode, savedHighContrast, savedReducedMotion);
  }, []);

  // Fonction pour mettre à jour les classes du body
  const updateBodyClasses = (seniors: boolean, contrast: boolean, motion: boolean) => {
    const body = document.body;
    
    // Mode seniors
    if (seniors) {
      body.classList.add('seniors-mode');
    } else {
      body.classList.remove('seniors-mode');
    }
    
    // Contraste élevé
    if (contrast && seniors) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }
    
    // Mouvement réduit
    if (motion && seniors) {
      body.classList.add('reduce-motion');
    } else {
      body.classList.remove('reduce-motion');
    }
  };

  // Toggle mode seniors
  const toggleSeniorsMode = () => {
    const newValue = !isSeniorsMode;
    setIsSeniorsMode(newValue);
    localStorage.setItem('seniors-mode', newValue.toString());
    updateBodyClasses(newValue, isHighContrast, isReducedMotion);
  };

  // Toggle contraste élevé
  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('high-contrast', newValue.toString());
    updateBodyClasses(isSeniorsMode, newValue, isReducedMotion);
  };

  // Toggle mouvement réduit
  const toggleReducedMotion = () => {
    const newValue = !isReducedMotion;
    setIsReducedMotion(newValue);
    localStorage.setItem('reduced-motion', newValue.toString());
    updateBodyClasses(isSeniorsMode, isHighContrast, newValue);
  };

  // Les contrôles de démonstration sont maintenant gérés par le hook useDemoControls

  return (
    <div className={`relative ${className}`}>
      {/* Bouton principal - Maintenant "Navigation" au lieu de "Mode Seniors" */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200
          ${isSeniorsMode 
            ? 'bg-mpr-interactive text-white border-mpr-interactive shadow-lg' 
            : 'bg-white text-gray-700 border-gray-300 hover:border-mpr-interactive'
          }
          hover:shadow-md focus:outline-none focus:ring-2 focus:ring-mpr-interactive focus:ring-offset-2
        `}
        title="Options de navigation et d'accessibilité"
      >
        <Navigation className="w-5 h-5" />
        <span className="font-medium">
          {isSeniorsMode ? 'Navigation Active' : 'Navigation'}
        </span>
        <Settings className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
      </button>

      {/* Panneau de paramètres */}
      {showSettings && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Options de Navigation
            </h3>
            
            <div className="space-y-4">
              {/* Section 1: Options de navigation (Capture 2) */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-700 mb-3">Mode de Navigation</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setIsSeniorsMode(false)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      !isSeniorsMode 
                        ? 'bg-mpr-interactive-lt border-mpr-border text-mpr-navy' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-mpr-interactive"></div>
                      <span className="font-medium">Mode Standard</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Interface standard avec toutes les fonctionnalités</p>
                  </button>
                  
                  <button
                    onClick={() => setIsSeniorsMode(true)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      isSeniorsMode 
                        ? 'bg-mpr-interactive-lt border-mpr-border text-mpr-navy' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium">Mode Senior</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Interface simplifiée et accessible</p>
                  </button>
                </div>
              </div>

              {/* Section 2: Contrôles de démonstration (Capture 3) */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-700 mb-3">Contrôles de Démonstration</h4>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={startThemeRotation}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                      isRotating 
                        ? 'bg-mpr-interactive-lt border-mpr-border text-mpr-navy' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Rocket className={`w-5 h-5 ${isRotating ? 'text-mpr-interactive' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <div className="font-medium">Démarrer Rotation</div>
                      <div className="text-sm text-gray-500">
                        {isRotating ? 'Rotation active' : 'Rotation des thèmes automatique'}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={toggleParticles}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                      !showParticles 
                        ? 'bg-purple-50 border-purple-300 text-purple-800' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Sparkles className={`w-5 h-5 ${!showParticles ? 'text-purple-600' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <div className="font-medium">Masquer Particules</div>
                      <div className="text-sm text-gray-500">
                        {!showParticles ? 'Particules masquées' : 'Particules visibles'}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={togglePhysics}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                      !showPhysics 
                        ? 'bg-green-50 border-green-300 text-green-800' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Zap className={`w-5 h-5 ${!showPhysics ? 'text-green-600' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <div className="font-medium">Désactiver Physique</div>
                      <div className="text-sm text-gray-500">
                        {!showPhysics ? 'Physique désactivée' : 'Physique activée'}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Section 3: Options d'accessibilité (seulement si mode senior actif) */}
              {isSeniorsMode && (
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-700 mb-3">Accessibilité</h4>
                  
                  {/* Contraste élevé */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Contrast className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-800">Contraste Élevé</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Contraste maximum pour une meilleure visibilité
                      </p>
                    </div>
                    <button
                      onClick={toggleHighContrast}
                      title={isHighContrast ? 'Désactiver le contraste élevé' : 'Activer le contraste élevé'}
                      className={`
                        relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500
                        ${isHighContrast ? 'bg-gray-800' : 'bg-gray-300'}
                      `}
                    >
                      <div className={`
                        absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200
                        ${isHighContrast ? 'translate-x-6' : 'translate-x-0.5'}
                      `} />
                    </button>
                  </div>

                  {/* Mouvement réduit */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg mt-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <EyeOff className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-800">Mouvement Réduit</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Désactive les animations pour réduire les distractions
                      </p>
                    </div>
                    <button
                      onClick={toggleReducedMotion}
                      title={isReducedMotion ? 'Désactiver le mouvement réduit' : 'Activer le mouvement réduit'}
                      className={`
                        relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500
                        ${isReducedMotion ? 'bg-green-600' : 'bg-gray-300'}
                      `}
                    >
                      <div className={`
                        absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200
                        ${isReducedMotion ? 'translate-x-6' : 'translate-x-0.5'}
                      `} />
                    </button>
                  </div>
                </div>
              )}

              {/* Informations */}
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Conseil :</strong> Ces paramètres sont sauvegardés automatiquement 
                  et s'appliquent à toute l'application.
                </p>
              </div>

              {/* Bouton de fermeture */}
              <div className="text-center">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay pour fermer le panneau */}
      {showSettings && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default NavigationToggle;
