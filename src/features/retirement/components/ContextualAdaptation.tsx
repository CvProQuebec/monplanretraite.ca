import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Clock, 
  Smartphone, 
  Monitor, 
  Wifi, 
  Activity, 
  Zap, 
  Settings,
  TrendingUp,
  Lightbulb,
  Target,
  CheckCircle
} from 'lucide-react';
import { useAIPreferences, UserContext } from '../hooks/useAIPreferences';

interface ContextualAdaptationProps {
  className?: string;
}

export const ContextualAdaptation: React.FC<ContextualAdaptationProps> = ({ 
  className = '' 
}) => {
  const [currentContext, setCurrentContext] = useState<UserContext | null>(null);
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptationHistory, setAdaptationHistory] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const {
    adaptToContext,
    getContextualPreferences,
    optimizeForContext,
    predictOptimalSettings,
    preferences,
    patterns,
    learningEnabled,
    toggleLearning
  } = useAIPreferences();

  // Détection automatique du contexte
  const detectContext = useCallback((): UserContext => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Heure de la journée
    let timeOfDay: UserContext['timeOfDay'];
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    // Type d'appareil (simulation)
    const deviceType: UserContext['deviceType'] = 
      window.innerWidth < 768 ? 'mobile' :
      window.innerWidth < 1024 ? 'tablet' :
      window.innerWidth < 1920 ? 'desktop' : 'ultrawide';

    // Vitesse de connexion (simulation)
    const connectionSpeed: UserContext['connectionSpeed'] = 
      navigator.connection?.effectiveType === 'slow-2g' || 
      navigator.connection?.effectiveType === '2g' ? 'slow' :
      navigator.connection?.effectiveType === '3g' ? 'medium' : 'fast';

    // Activité utilisateur (basée sur les interactions)
    const userActivity: UserContext['userActivity'] = 'casual'; // À améliorer

    // Durée de session (en minutes)
    const sessionStart = sessionStorage.getItem('session-start');
    const sessionDuration = sessionStart ? 
      Math.floor((Date.now() - parseInt(sessionStart)) / 60000) : 0;

    // Fréquence d'interactions (simulation)
    const interactionFrequency = 2; // À améliorer avec un vrai tracker

    return {
      timeOfDay,
      dayOfWeek: day,
      deviceType,
      connectionSpeed,
      userActivity,
      sessionDuration,
      interactionFrequency
    };
  }, []);

  // Mise à jour du contexte
  useEffect(() => {
    const updateContext = () => {
      const context = detectContext();
      setCurrentContext(context);
      
      // Adapter automatiquement si l'apprentissage est activé
      if (learningEnabled) {
        adaptToContext(context);
      }
    };

    // Mise à jour initiale
    updateContext();

    // Mise à jour toutes les minutes
    const interval = setInterval(updateContext, 60000);

    // Mise à jour lors des changements de taille d'écran
    const handleResize = () => updateContext();
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [detectContext, adaptToContext, learningEnabled]);

  // Démarrer la session
  useEffect(() => {
    if (!sessionStorage.getItem('session-start')) {
      sessionStorage.setItem('session-start', Date.now().toString());
    }
  }, []);

  // Adaptation contextuelle
  const handleContextualAdaptation = useCallback(async () => {
    if (!currentContext) return;

    setIsAdapting(true);
    
    try {
      // Obtenir les préférences contextuelles
      const contextualPrefs = getContextualPreferences(currentContext);
      
      // Optimiser pour le contexte
      const optimalSettings = optimizeForContext(currentContext);
      
      // Prédire les paramètres optimaux
      const predictedSettings = predictOptimalSettings(currentContext);
      
      const adaptation = {
        timestamp: new Date(),
        context: currentContext,
        contextualPreferences: contextualPrefs,
        optimalSettings,
        predictedSettings
      };
      
      setAdaptationHistory(prev => [adaptation, ...prev.slice(0, 9)]);
      
      console.log('🧠 Adaptation contextuelle:', adaptation);
      
      // Simuler un délai d'adaptation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Erreur lors de l\'adaptation contextuelle:', error);
    } finally {
      setIsAdapting(false);
    }
  }, [currentContext, getContextualPreferences, optimizeForContext, predictOptimalSettings]);

  // Formatage du contexte
  const formatContext = (context: UserContext) => {
    const timeLabels = {
      morning: 'Matin',
      afternoon: 'Après-midi', 
      evening: 'Soirée',
      night: 'Nuit'
    };
    
    const deviceLabels = {
      mobile: 'Mobile',
      tablet: 'Tablette',
      desktop: 'Ordinateur',
      ultrawide: 'Écran large'
    };
    
    const connectionLabels = {
      slow: 'Lente',
      medium: 'Moyenne',
      fast: 'Rapide'
    };
    
    const activityLabels = {
      active: 'Active',
      passive: 'Passive',
      focused: 'Concentrée',
      casual: 'Détendue'
    };

    return {
      timeOfDay: timeLabels[context.timeOfDay],
      dayOfWeek: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][context.dayOfWeek],
      deviceType: deviceLabels[context.deviceType],
      connectionSpeed: connectionLabels[context.connectionSpeed],
      userActivity: activityLabels[context.userActivity],
      sessionDuration: `${context.sessionDuration} min`,
      interactionFrequency: `${context.interactionFrequency}/min`
    };
  };

  if (!currentContext) {
    return (
      <div className={`p-4 bg-gray-100 rounded-lg ${className}`}>
        <div className="flex items-center gap-2 text-gray-600">
          <Brain className="w-5 h-5 animate-pulse" />
          <span>Détection du contexte...</span>
        </div>
      </div>
    );
  }

  const formattedContext = formatContext(currentContext);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* En-tête avec statut d'adaptation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-mpr-interactive-lt to-purple-50 rounded-xl p-6 border-2 border-mpr-border"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-mpr-interactive-lt rounded-full">
              <Brain className="w-6 h-6 text-mpr-interactive" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Adaptation Contextuelle IA
              </h3>
              <p className="text-gray-600">
                {learningEnabled ? 'Apprentissage actif' : 'Apprentissage désactivé'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLearning}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                learningEnabled
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {learningEnabled ? 'IA Active' : 'IA Inactive'}
            </button>
            
            <button
              onClick={handleContextualAdaptation}
              disabled={isAdapting}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isAdapting
                  ? 'bg-mpr-interactive text-white shadow-md'
                  : 'bg-mpr-interactive text-white hover:bg-mpr-interactive'
              }`}
            >
              {isAdapting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adaptation...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Adapter
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Contexte actuel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-mpr-border">
            <Clock className="w-4 h-4 text-mpr-interactive" />
            <div>
              <div className="text-xs text-gray-500">Période</div>
              <div className="font-medium text-gray-800">{formattedContext.timeOfDay}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-mpr-border">
            <Smartphone className="w-4 h-4 text-mpr-interactive" />
            <div>
              <div className="text-xs text-gray-500">Appareil</div>
              <div className="font-medium text-gray-800">{formattedContext.deviceType}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-mpr-border">
            <Wifi className="w-4 h-4 text-mpr-interactive" />
            <div>
              <div className="text-xs text-gray-500">Connexion</div>
              <div className="font-medium text-gray-800">{formattedContext.connectionSpeed}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-mpr-border">
            <Activity className="w-4 h-4 text-mpr-interactive" />
            <div>
              <div className="text-xs text-gray-500">Activité</div>
              <div className="font-medium text-gray-800">{formattedContext.userActivity}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Détails et historique */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 border-2 border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Détails de l'Adaptation
          </h4>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 text-sm text-mpr-interactive hover:text-mpr-navy transition-colors"
          >
            {showDetails ? 'Masquer' : 'Afficher'}
          </button>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* Statistiques IA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Préférences Apprises</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{preferences.length}</div>
                  <div className="text-sm text-purple-600">Patterns détectés</div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Patterns Identifiés</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{patterns.length}</div>
                  <div className="text-sm text-green-600">Tendances détectées</div>
                </div>
                
                <div className="p-4 bg-mpr-interactive-lt rounded-lg border border-mpr-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-mpr-interactive" />
                    <span className="font-medium text-mpr-navy">Confiance Moyenne</span>
                  </div>
                  <div className="text-2xl font-bold text-mpr-interactive">
                    {Math.round((preferences.reduce((sum, p) => sum + p.confidence, 0) / Math.max(preferences.length, 1)) * 100)}%
                  </div>
                  <div className="text-sm text-mpr-interactive">Précision IA</div>
                </div>
              </div>

              {/* Historique des adaptations */}
              {adaptationHistory.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Historique des Adaptations
                  </h5>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {adaptationHistory.map((adaptation, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {adaptation.timestamp.toLocaleTimeString()}
                          </span>
                          <span className="text-gray-500">
                            {adaptation.contextualPreferences.length} préférences
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {adaptation.context.deviceType} • {adaptation.context.timeOfDay}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
