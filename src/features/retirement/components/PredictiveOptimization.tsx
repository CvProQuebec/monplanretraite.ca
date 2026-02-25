import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Zap, 
  Target, 
  BarChart3, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Clock,
  Activity
} from 'lucide-react';
import { useAIPreferences, UserContext } from '../hooks/useAIPreferences';

interface PredictiveOptimizationProps {
  className?: string;
}

interface OptimizationResult {
  id: string;
  timestamp: Date;
  context: UserContext;
  predictedSettings: any;
  confidence: number;
  improvements: string[];
  estimatedPerformance: number;
  applied: boolean;
}

export const PredictiveOptimization: React.FC<PredictiveOptimizationProps> = ({ 
  className = '' 
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationHistory, setOptimizationHistory] = useState<OptimizationResult[]>([]);
  const [currentOptimization, setCurrentOptimization] = useState<OptimizationResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [autoOptimization, setAutoOptimization] = useState(false);

  const {
    predictOptimalSettings,
    optimizeForContext,
    getConfidenceScore,
    preferences,
    patterns,
    learningEnabled
  } = useAIPreferences();

  // Détection automatique du contexte (simplifiée)
  const detectCurrentContext = useCallback((): UserContext => {
    const now = new Date();
    const hour = now.getHours();
    
    return {
      timeOfDay: hour >= 6 && hour < 12 ? 'morning' :
                 hour >= 12 && hour < 18 ? 'afternoon' :
                 hour >= 18 && hour < 22 ? 'evening' : 'night',
      dayOfWeek: now.getDay(),
      deviceType: window.innerWidth < 768 ? 'mobile' :
                  window.innerWidth < 1024 ? 'tablet' :
                  window.innerWidth < 1920 ? 'desktop' : 'ultrawide',
      connectionSpeed: 'fast', // Simulation
      userActivity: 'casual',
      sessionDuration: 0,
      interactionFrequency: 2
    };
  }, []);

  // Optimisation prédictive
  const runPredictiveOptimization = useCallback(async () => {
    if (!learningEnabled) {
      alert('L\'apprentissage IA doit être activé pour l\'optimisation prédictive');
      return;
    }

    setIsOptimizing(true);
    
    try {
      const context = detectCurrentContext();
      
      // Prédire les paramètres optimaux
      const predictedSettings = predictOptimalSettings(context);
      
      // Optimiser pour le contexte
      const optimalSettings = optimizeForContext(context);
      
      // Calculer la confiance globale
      const confidence = Object.keys(predictedSettings).reduce((sum, category) => {
        return sum + getConfidenceScore(category);
      }, 0) / Math.max(Object.keys(predictedSettings).length, 1);
      
      // Identifier les améliorations
      const improvements = analyzeImprovements(predictedSettings, optimalSettings);
      
      // Estimer la performance
      const estimatedPerformance = calculatePerformanceEstimate(predictedSettings, confidence);
      
      const result: OptimizationResult = {
        id: `opt_${Date.now()}`,
        timestamp: new Date(),
        context,
        predictedSettings,
        confidence,
        improvements,
        estimatedPerformance,
        applied: false
      };
      
      setCurrentOptimization(result);
      setOptimizationHistory(prev => [result, ...prev.slice(0, 9)]);
      
      console.log('🧠 Optimisation prédictive:', result);
      
      // Simuler un délai d'optimisation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error('Erreur lors de l\'optimisation prédictive:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [learningEnabled, detectCurrentContext, predictOptimalSettings, optimizeForContext, getConfidenceScore]);

  // Analyser les améliorations
  const analyzeImprovements = (predicted: any, optimal: any): string[] => {
    const improvements: string[] = [];
    
    if (predicted.theme && optimal.theme) {
      improvements.push('Thème optimisé pour la période de la journée');
    }
    
    if (predicted.particles !== undefined) {
      improvements.push('Particules adaptées au contexte d\'utilisation');
    }
    
    if (predicted.physics !== undefined) {
      improvements.push('Physique optimisée pour la performance');
    }
    
    if (predicted.performance !== undefined) {
      improvements.push('Mode performance adaptatif activé');
    }
    
    return improvements.length > 0 ? improvements : ['Aucune amélioration majeure détectée'];
  };

  // Calculer l'estimation de performance
  const calculatePerformanceEstimate = (settings: any, confidence: number): number => {
    let basePerformance = 75; // Performance de base
    
    // Bonus pour les optimisations
    if (settings.performance === true) basePerformance += 15;
    if (settings.particles === false) basePerformance += 10;
    if (settings.physics === false) basePerformance += 10;
    
    // Ajuster selon la confiance
    const confidenceBonus = confidence * 20;
    
    return Math.min(100, Math.round(basePerformance + confidenceBonus));
  };

  // Appliquer l'optimisation
  const applyOptimization = useCallback((optimization: OptimizationResult) => {
    setOptimizationHistory(prev => 
      prev.map(opt => 
        opt.id === optimization.id 
          ? { ...opt, applied: true }
          : opt
      )
    );
    
    setCurrentOptimization(prev => 
      prev?.id === optimization.id 
        ? { ...prev, applied: true }
        : prev
    );
    
    console.log('✅ Optimisation appliquée:', optimization);
    
    // Ici, vous pourriez appliquer réellement les paramètres
    // aux composants de l'application
  }, []);

  // Auto-optimisation
  useEffect(() => {
    if (!autoOptimization || !learningEnabled) return;
    
    const interval = setInterval(() => {
      if (preferences.length > 5) { // Seulement si assez de données
        runPredictiveOptimization();
      }
    }, 300000); // Toutes les 5 minutes
    
    return () => clearInterval(interval);
  }, [autoOptimization, learningEnabled, preferences.length, runPredictiveOptimization]);

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
    
    return {
      timeOfDay: timeLabels[context.timeOfDay],
      deviceType: deviceLabels[context.deviceType]
    };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Optimisation Prédictive IA
              </h3>
              <p className="text-gray-600">
                Anticipation et optimisation automatique des paramètres
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoOptimization(!autoOptimization)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                autoOptimization
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {autoOptimization ? (
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Auto
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Pause className="w-4 h-4" />
                  Manuel
                </div>
              )}
            </button>
            
            <button
              onClick={runPredictiveOptimization}
              disabled={isOptimizing || !learningEnabled}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isOptimizing
                  ? 'bg-purple-600 text-white shadow-md'
                  : learningEnabled
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isOptimizing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Optimisation...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Optimiser
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Statut de l'IA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-800">Préférences</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{preferences.length}</div>
            <div className="text-sm text-purple-600">Apprises par l'IA</div>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-800">Patterns</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{patterns.length}</div>
            <div className="text-sm text-purple-600">Tendances détectées</div>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-800">Confiance</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((preferences.reduce((sum, p) => sum + p.confidence, 0) / Math.max(preferences.length, 1)) * 100)}%
            </div>
            <div className="text-sm text-purple-600">Précision IA</div>
          </div>
        </div>
      </motion.div>

      {/* Résultat d'optimisation actuel */}
      <AnimatePresence>
        {currentOptimization && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-green-600" />
                Optimisation Prédictive
              </h4>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {currentOptimization.timestamp.toLocaleTimeString()}
                </span>
                
                {!currentOptimization.applied ? (
                  <button
                    onClick={() => applyOptimization(currentOptimization)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Appliquer
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    Appliquée
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contexte et prédictions */}
              <div>
                <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-mpr-interactive" />
                  Contexte d'Optimisation
                </h5>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Période:</span>
                    <span className="font-medium">
                      {formatContext(currentOptimization.context).timeOfDay}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Appareil:</span>
                    <span className="font-medium">
                      {formatContext(currentOptimization.context).deviceType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confiance IA:</span>
                    <span className="font-medium text-mpr-interactive">
                      {Math.round(currentOptimization.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Améliorations et performance */}
              <div>
                <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  Améliorations Prédites
                </h5>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Performance:</span>
                    <span className="font-medium text-green-600">
                      {currentOptimization.estimatedPerformance}%
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {currentOptimization.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-gray-700">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Paramètres prédits */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-2">Paramètres Prédits</h5>
              <div className="text-sm text-gray-600 font-mono">
                {JSON.stringify(currentOptimization.predictedSettings, null, 2)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Historique des optimisations */}
      {optimizationHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border-2 border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Historique des Optimisations
            </h4>
            
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-3 py-1 text-sm text-mpr-interactive hover:text-mpr-navy transition-colors"
            >
              {showAdvanced ? 'Masquer' : 'Afficher'}
            </button>
          </div>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 max-h-60 overflow-y-auto"
              >
                {optimizationHistory.map((optimization) => (
                  <div key={optimization.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {optimization.timestamp.toLocaleTimeString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatContext(optimization.context).timeOfDay}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatContext(optimization.context).deviceType}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          optimization.applied 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {optimization.applied ? 'Appliquée' : 'En attente'}
                        </span>
                        
                        <span className="text-sm text-mpr-interactive font-medium">
                          {Math.round(optimization.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Avertissement si l'IA n'est pas activée */}
      {!learningEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <h5 className="font-medium text-yellow-800">IA Désactivée</h5>
              <p className="text-sm text-yellow-700">
                Activez l'apprentissage IA pour bénéficier de l'optimisation prédictive
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
