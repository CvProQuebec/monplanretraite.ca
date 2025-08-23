import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Activity,
  Zap,
  Star,
  ArrowRight,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAIPreferences, UserContext, AIPrediction } from '../hooks/useAIPreferences';

interface SmartRecommendationsProps {
  className?: string;
}

interface Recommendation {
  id: string;
  type: 'optimization' | 'suggestion' | 'warning' | 'insight';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  category: string;
  estimatedImpact: number;
  actionRequired: boolean;
  applied: boolean;
  timestamp: Date;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ 
  className = '' 
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendation[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showApplied, setShowApplied] = useState(true);
  const [sortBy, setSortBy] = useState<'priority' | 'confidence' | 'impact' | 'recent'>('priority');

  const {
    predictPreferences,
    getRecommendations,
    analyzePatterns,
    getConfidenceScore,
    preferences,
    patterns,
    learningEnabled
  } = useAIPreferences();

  // Détection du contexte actuel
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
      connectionSpeed: 'fast',
      userActivity: 'casual',
      sessionDuration: 0,
      interactionFrequency: 2
    };
  }, []);

  // Générer des recommandations intelligentes
  const generateRecommendations = useCallback(async () => {
    if (!learningEnabled) return;

    const context = detectCurrentContext();
    const predictions = predictPreferences(context);
    
    const newRecommendations: Recommendation[] = [];

    // Recommandations basées sur les prédictions
    predictions.forEach((prediction, index) => {
      const recommendation: Recommendation = {
        id: `rec_${Date.now()}_${index}`,
        type: 'optimization',
        title: `Optimisation ${prediction.preference.category}`,
        description: `L'IA recommande ${prediction.preference.value} pour ${prediction.preference.category} (${prediction.reasoning})`,
        priority: prediction.probability > 0.8 ? 'high' : 
                  prediction.probability > 0.6 ? 'medium' : 'low',
        confidence: prediction.probability,
        category: prediction.preference.category,
        estimatedImpact: Math.round(prediction.probability * 100),
        actionRequired: prediction.probability > 0.7,
        applied: false,
        timestamp: new Date()
      };
      
      newRecommendations.push(recommendation);
    });

    // Recommandations basées sur les patterns
    patterns.forEach((pattern, index) => {
      if (pattern.confidence > 0.6) {
        const recommendation: Recommendation = {
          id: `pattern_${Date.now()}_${index}`,
          type: 'insight',
          title: `Tendance détectée: ${pattern.pattern}`,
          description: `L'IA a identifié un pattern d'utilisation avec ${Math.round(pattern.confidence * 100)}% de confiance`,
          priority: pattern.confidence > 0.8 ? 'high' : 'medium',
          confidence: pattern.confidence,
          category: 'pattern',
          estimatedImpact: Math.round(pattern.confidence * 80),
          actionRequired: false,
          applied: false,
          timestamp: new Date()
        };
        
        newRecommendations.push(recommendation);
      }
    });

    // Recommandations de performance
    if (preferences.length > 10) {
      const performanceRecommendation: Recommendation = {
        id: `perf_${Date.now()}`,
        type: 'suggestion',
        title: 'Optimisation de performance recommandée',
        description: 'Avec suffisamment de données, l\'IA peut optimiser automatiquement les performances',
        priority: 'medium',
        confidence: 0.7,
        category: 'performance',
        estimatedImpact: 85,
        actionRequired: true,
        applied: false,
        timestamp: new Date()
      };
      
      newRecommendations.push(performanceRecommendation);
    }

    // Recommandations contextuelles
    const timeBasedRecommendation = generateTimeBasedRecommendation(context);
    if (timeBasedRecommendation) {
      newRecommendations.push(timeBasedRecommendation);
    }

    setRecommendations(prev => {
      const combined = [...newRecommendations, ...prev];
      return combined.slice(0, 20); // Limiter à 20 recommandations
    });
  }, [learningEnabled, detectCurrentContext, predictPreferences, patterns, preferences.length]);

  // Recommandation basée sur l'heure
  const generateTimeBasedRecommendation = (context: UserContext): Recommendation | null => {
    const timeRecommendations = {
      morning: {
        title: 'Mode matin recommandé',
        description: 'L\'IA suggère un thème clair et des effets réduits pour commencer la journée'
      },
      afternoon: {
        title: 'Mode après-midi optimisé',
        description: 'Équilibre entre performance et visuels pour la productivité'
      },
      evening: {
        title: 'Mode soirée relaxant',
        description: 'Thème plus doux et effets visuels apaisants'
      },
      night: {
        title: 'Mode nuit adaptatif',
        description: 'Réduction automatique des effets pour un usage nocturne confortable'
      }
    };

    const timeRec = timeRecommendations[context.timeOfDay];
    if (!timeRec) return null;

    return {
      id: `time_${Date.now()}`,
      type: 'suggestion',
      title: timeRec.title,
      description: timeRec.description,
      priority: 'medium',
      confidence: 0.8,
      category: 'context',
      estimatedImpact: 70,
      actionRequired: false,
      applied: false,
      timestamp: new Date()
    };
  };

  // Appliquer une recommandation
  const applyRecommendation = useCallback((recommendation: Recommendation) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === recommendation.id 
          ? { ...rec, applied: true }
          : rec
      )
    );
    
    console.log('✅ Recommandation appliquée:', recommendation);
    
    // Ici, vous pourriez appliquer réellement la recommandation
    // aux composants de l'application
  }, []);

  // Filtrer les recommandations
  useEffect(() => {
    let filtered = recommendations;
    
    // Filtrer par type si des filtres sont actifs
    if (activeFilters.length > 0) {
      filtered = filtered.filter(rec => activeFilters.includes(rec.type));
    }
    
    // Filtrer les appliquées si nécessaire
    if (!showApplied) {
      filtered = filtered.filter(rec => !rec.applied);
    }
    
    // Trier selon le critère sélectionné
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'confidence':
          return b.confidence - a.confidence;
        case 'impact':
          return b.estimatedImpact - a.estimatedImpact;
        case 'recent':
          return b.timestamp.getTime() - a.timestamp.getTime();
        default:
          return 0;
      }
    });
    
    setFilteredRecommendations(filtered);
  }, [recommendations, activeFilters, showApplied, sortBy]);

  // Générer des recommandations au chargement et toutes les 2 minutes
  useEffect(() => {
    generateRecommendations();
    
    const interval = setInterval(generateRecommendations, 120000);
    return () => clearInterval(interval);
  }, [generateRecommendations]);

  // Obtenir l'icône et la couleur selon le type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return { icon: Zap, color: 'text-blue-600', bgColor: 'bg-blue-100' };
      case 'suggestion':
        return { icon: Lightbulb, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      case 'warning':
        return { icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-100' };
      case 'insight':
        return { icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-100' };
      default:
        return { icon: Brain, color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  // Obtenir la couleur de priorité
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Recommandations Intelligentes IA
              </h3>
              <p className="text-gray-600">
                Suggestions personnalisées basées sur l'apprentissage automatique
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {recommendations.length} recommandations
            </span>
            <button
              onClick={() => setShowApplied(!showApplied)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              title={showApplied ? 'Masquer appliquées' : 'Afficher appliquées'}
            >
              {showApplied ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">Total</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{recommendations.length}</div>
            <div className="text-sm text-green-600">Recommandations</div>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">Appliquées</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {recommendations.filter(r => r.applied).length}
            </div>
            <div className="text-sm text-green-600">Actions réalisées</div>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">Haute Priorité</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {recommendations.filter(r => r.priority === 'high' || r.priority === 'critical').length}
            </div>
            <div className="text-sm text-green-600">À traiter</div>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">Impact Moyen</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {recommendations.length > 0 
                ? Math.round(recommendations.reduce((sum, r) => sum + r.estimatedImpact, 0) / recommendations.length)
                : 0}%
            </div>
            <div className="text-sm text-green-600">Amélioration estimée</div>
          </div>
        </div>
      </motion.div>

      {/* Filtres et tri */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 border-2 border-gray-200"
      >
        <div className="flex flex-wrap items-center gap-4">
          {/* Filtres par type */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Types:</span>
            {['optimization', 'suggestion', 'warning', 'insight'].map(type => (
              <button
                key={type}
                onClick={() => setActiveFilters(prev => 
                  prev.includes(type) 
                    ? prev.filter(t => t !== type)
                    : [...prev, type]
                )}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeFilters.includes(type)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Tri */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              title="Trier les recommandations par"
              aria-label="Trier les recommandations par"
            >
              <option value="priority">Priorité</option>
              <option value="confidence">Confiance</option>
              <option value="impact">Impact</option>
              <option value="recent">Récent</option>
            </select>
          </div>

          {/* Bouton de rafraîchissement */}
          <button
            onClick={generateRecommendations}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Actualiser
          </button>
        </div>
      </motion.div>

      {/* Liste des recommandations */}
      <div className="space-y-4">
        {filteredRecommendations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Aucune recommandation disponible</p>
            <p className="text-sm">L'IA générera des suggestions au fur et à mesure de l'utilisation</p>
          </motion.div>
        ) : (
          filteredRecommendations.map((recommendation, index) => {
            const typeInfo = getTypeIcon(recommendation.type);
            const TypeIcon = typeInfo.icon;
            
            return (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-6 border-2 transition-all duration-200 ${
                  recommendation.applied 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icône de type */}
                    <div className={`p-3 rounded-full ${typeInfo.bgColor}`}>
                      <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {recommendation.title}
                        </h4>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                          {recommendation.priority.toUpperCase()}
                        </span>
                        
                        {recommendation.applied && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            APPLIQUÉE
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{recommendation.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{recommendation.category}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Impact: {recommendation.estimatedImpact}%</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Confiance: {Math.round(recommendation.confidence * 100)}%</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">
                            {recommendation.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  {!recommendation.applied && recommendation.actionRequired && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => applyRecommendation(recommendation)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Appliquer
                      </button>
                      
                      <button 
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Voir plus de détails"
                        aria-label="Voir plus de détails"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

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
                Activez l'apprentissage IA pour recevoir des recommandations personnalisées
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
