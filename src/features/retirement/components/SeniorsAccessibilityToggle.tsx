import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Settings, Palette, Type, Contrast } from 'lucide-react';

interface SeniorsAccessibilityToggleProps {
  className?: string;
}

export const SeniorsAccessibilityToggle: React.FC<SeniorsAccessibilityToggleProps> = ({ 
  className = '' 
}) => {
  const [isSeniorsMode, setIsSeniorsMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

  return (
    <div className={`relative ${className}`}>
      {/* Bouton principal */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200
          ${isSeniorsMode 
            ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          }
          hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        title="Options d'accessibilité pour seniors"
      >
        <Eye className="w-5 h-5" />
        <span className="font-medium">
          {isSeniorsMode ? 'Mode Seniors Actif' : 'Mode Seniors'}
        </span>
        <Settings className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
      </button>

      {/* Panneau de paramètres */}
      {showSettings && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Accessibilité pour Seniors
            </h3>
            
            <div className="space-y-4">
              {/* Mode seniors principal */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Type className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-800">Mode Seniors</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Textes plus grands, meilleur contraste, boutons plus larges
                  </p>
                </div>
                <button
                  onClick={toggleSeniorsMode}
                  title={isSeniorsMode ? 'Désactiver le mode seniors' : 'Activer le mode seniors'}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isSeniorsMode ? 'bg-blue-600' : 'bg-gray-300'}
                  `}
                >
                  <div className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200
                    ${isSeniorsMode ? 'translate-x-6' : 'translate-x-0.5'}
                  `} />
                </button>
              </div>

              {/* Options supplémentaires (seulement si mode seniors actif) */}
              {isSeniorsMode && (
                <>
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
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
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
                </>
              )}
            </div>

            {/* Informations */}
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>💡 Conseil :</strong> Ces paramètres sont sauvegardés automatiquement 
                et s'appliquent à toute l'application.
              </p>
            </div>

            {/* Bouton de fermeture */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Fermer
              </button>
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

export default SeniorsAccessibilityToggle;
