import { useState, useEffect, useCallback, useMemo } from 'react';

// Types pour l'IA et l'apprentissage
export interface UserPreference {
  id: string;
  category: 'theme' | 'particles' | 'physics' | 'performance' | 'accessibility';
  value: any;
  confidence: number; // 0-1, confiance de l'IA dans cette préférence
  usageCount: number; // Nombre de fois utilisée
  lastUsed: Date;
  context: UserContext;
}

export interface UserContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number; // 0-6 (dimanche-samedi)
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'ultrawide';
  connectionSpeed: 'slow' | 'medium' | 'fast';
  userActivity: 'active' | 'passive' | 'focused' | 'casual';
  sessionDuration: number; // en minutes
  interactionFrequency: number; // interactions par minute
}

export interface AIPrediction {
  preference: UserPreference;
  probability: number; // 0-1
  reasoning: string;
  suggestedAction: string;
}

export interface LearningPattern {
  pattern: string;
  confidence: number;
  frequency: number;
  lastObserved: Date;
}

export interface AIPreferences {
  // Apprentissage et prédictions
  learnFromInteraction: (category: string, value: any, context: UserContext) => void;
  predictPreferences: (context: UserContext) => AIPrediction[];
  getRecommendations: (context: UserContext) => UserPreference[];
  
  // Analyse des patterns
  analyzePatterns: () => LearningPattern[];
  getConfidenceScore: (category: string) => number;
  
  // Adaptation contextuelle
  adaptToContext: (context: UserContext) => void;
  getContextualPreferences: (context: UserContext) => UserPreference[];
  
  // Optimisation prédictive
  optimizeForContext: (context: UserContext) => void;
  predictOptimalSettings: (context: UserContext) => any;
  
  // Données d'apprentissage
  preferences: UserPreference[];
  patterns: LearningPattern[];
  learningEnabled: boolean;
  toggleLearning: () => void;
}

// Configuration de l'IA
const AI_CONFIG = {
  minConfidence: 0.6,
  learningRate: 0.1,
  patternThreshold: 3,
  contextWeight: 0.7,
  timeWeight: 0.3,
  maxPreferences: 100
};

// Algorithmes d'apprentissage
class AILearningEngine {
  private preferences: UserPreference[] = [];
  private patterns: LearningPattern[] = [];

  // Apprentissage par renforcement
  learnFromInteraction(category: string, value: any, context: UserContext): void {
    const existing = this.preferences.find(p => p.category === category && p.value === value);
    
    if (existing) {
      // Renforcer la préférence existante
      existing.confidence = Math.min(1, existing.confidence + AI_CONFIG.learningRate);
      existing.usageCount++;
      existing.lastUsed = new Date();
      existing.context = context;
    } else {
      // Créer une nouvelle préférence
      const newPreference: UserPreference = {
        id: `${category}_${Date.now()}`,
        category: category as any,
        value,
        confidence: 0.5,
        usageCount: 1,
        lastUsed: new Date(),
        context
      };
      this.preferences.push(newPreference);
    }

    // Analyser les patterns
    this.analyzePatterns();
    
    // Limiter le nombre de préférences
    if (this.preferences.length > AI_CONFIG.maxPreferences) {
      this.preferences = this.preferences
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, AI_CONFIG.maxPreferences);
    }
  }

  // Analyse des patterns d'utilisation
  private analyzePatterns(): void {
    const patterns: { [key: string]: { count: number, contexts: UserContext[] } } = {};
    
    this.preferences.forEach(pref => {
      const patternKey = `${pref.category}_${pref.value}`;
      if (!patterns[patternKey]) {
        patterns[patternKey] = { count: 0, contexts: [] };
      }
      patterns[patternKey].count++;
      patterns[patternKey].contexts.push(pref.context);
    });

    this.patterns = Object.entries(patterns)
      .filter(([_, data]) => data.count >= AI_CONFIG.patternThreshold)
      .map(([pattern, data]) => ({
        pattern,
        confidence: Math.min(1, data.count / 10),
        frequency: data.count,
        lastObserved: new Date()
      }));
  }

  // Prédiction basée sur le contexte
  predictPreferences(context: UserContext): AIPrediction[] {
    return this.preferences
      .map(pref => {
        const contextSimilarity = this.calculateContextSimilarity(pref.context, context);
        const timeSimilarity = this.calculateTimeSimilarity(pref.context, context);
        const probability = (contextSimilarity * AI_CONFIG.contextWeight) + 
                          (timeSimilarity * AI_CONFIG.timeWeight);
        
        return {
          preference: pref,
          probability,
          reasoning: this.generateReasoning(pref, context, probability),
          suggestedAction: this.generateSuggestedAction(pref, probability)
        };
      })
      .filter(pred => pred.probability >= AI_CONFIG.minConfidence)
      .sort((a, b) => b.probability - a.probability);
  }

  // Calcul de similarité contextuelle
  private calculateContextSimilarity(context1: UserContext, context2: UserContext): number {
    let similarity = 0;
    let totalFactors = 0;

    // Type d'appareil
    if (context1.deviceType === context2.deviceType) similarity += 1;
    totalFactors++;

    // Vitesse de connexion
    if (context1.connectionSpeed === context2.connectionSpeed) similarity += 1;
    totalFactors++;

    // Activité utilisateur
    if (context1.userActivity === context2.userActivity) similarity += 1;
    totalFactors++;

    // Session et interactions (normalisées)
    const sessionDiff = Math.abs(context1.sessionDuration - context2.sessionDuration) / 60;
    const interactionDiff = Math.abs(context1.interactionFrequency - context2.interactionFrequency);
    
    similarity += Math.max(0, 1 - sessionDiff / 2);
    similarity += Math.max(0, 1 - interactionDiff / 10);
    totalFactors += 2;

    return similarity / totalFactors;
  }

  // Calcul de similarité temporelle
  private calculateTimeSimilarity(context1: UserContext, context2: UserContext): number {
    let similarity = 0;
    let totalFactors = 0;

    // Heure de la journée
    if (context1.timeOfDay === context2.timeOfDay) similarity += 1;
    totalFactors++;

    // Jour de la semaine
    const dayDiff = Math.abs(context1.dayOfWeek - context2.dayOfWeek);
    similarity += Math.max(0, 1 - dayDiff / 3.5); // Normalisé sur 7 jours
    totalFactors++;

    return similarity / totalFactors;
  }

  // Génération du raisonnement
  private generateReasoning(pref: UserPreference, context: UserContext, probability: number): string {
    const reasons: string[] = [];
    
    if (pref.usageCount > 5) {
      reasons.push(`Utilisé ${pref.usageCount} fois`);
    }
    
    if (pref.confidence > 0.8) {
      reasons.push('Préférence fortement établie');
    }
    
    if (context.deviceType === pref.context.deviceType) {
      reasons.push('Même type d\'appareil');
    }
    
    if (context.timeOfDay === pref.context.timeOfDay) {
      reasons.push('Même période de la journée');
    }
    
    return reasons.join(', ') || 'Basé sur l\'historique d\'utilisation';
  }

  // Génération d'action suggérée
  private generateSuggestedAction(pref: UserPreference, probability: number): string {
    if (probability > 0.9) {
      return 'Appliquer automatiquement';
    } else if (probability > 0.7) {
      return 'Suggérer fortement';
    } else if (probability > 0.5) {
      return 'Suggérer';
    } else {
      return 'Garder en observation';
    }
  }

  // Optimisation prédictive
  predictOptimalSettings(context: UserContext): any {
    const predictions = this.predictPreferences(context);
    const optimalSettings: any = {};
    
    predictions.forEach(pred => {
      if (pred.probability > 0.7) {
        optimalSettings[pred.preference.category] = pred.preference.value;
      }
    });
    
    return optimalSettings;
  }

  // Getters
  getPreferences(): UserPreference[] {
    return [...this.preferences];
  }

  getPatterns(): LearningPattern[] {
    return [...this.patterns];
  }

  getConfidenceScore(category: string): number {
    const categoryPrefs = this.preferences.filter(p => p.category === category);
    if (categoryPrefs.length === 0) return 0;
    
    return categoryPrefs.reduce((sum, pref) => sum + pref.confidence, 0) / categoryPrefs.length;
  }
}

// Hook principal d'IA
export const useAIPreferences = (): AIPreferences => {
  const [learningEngine] = useState(() => new AILearningEngine());
  const [learningEnabled, setLearningEnabled] = useState(true);
  const [preferences, setPreferences] = useState<UserPreference[]>([]);
  const [patterns, setPatterns] = useState<LearningPattern[]>([]);

  // Charger les préférences depuis localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('ai-preferences');
    const savedPatterns = localStorage.getItem('ai-patterns');
    
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
      } catch (error) {
        console.warn('Erreur lors du chargement des préférences IA:', error);
      }
    }
    
    if (savedPatterns) {
      try {
        const parsed = JSON.parse(savedPatterns);
        setPatterns(parsed);
      } catch (error) {
        console.warn('Erreur lors du chargement des patterns IA:', error);
      }
    }
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    if (preferences.length > 0) {
      localStorage.setItem('ai-preferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  useEffect(() => {
    if (patterns.length > 0) {
      localStorage.setItem('ai-patterns', JSON.stringify(patterns));
    }
  }, [patterns]);

  // Apprentissage depuis les interactions
  const learnFromInteraction = useCallback((category: string, value: any, context: UserContext) => {
    if (!learningEnabled) return;
    
    learningEngine.learnFromInteraction(category, value, context);
    setPreferences(learningEngine.getPreferences());
    setPatterns(learningEngine.getPatterns());
    
    console.log(`🧠 IA: Apprentissage de ${category} = ${value}`, context);
  }, [learningEnabled, learningEngine]);

  // Prédiction des préférences
  const predictPreferences = useCallback((context: UserContext): AIPrediction[] => {
    return learningEngine.predictPreferences(context);
  }, [learningEngine]);

  // Obtention des recommandations
  const getRecommendations = useCallback((context: UserContext): UserPreference[] => {
    const predictions = predictPreferences(context);
    return predictions
      .filter(pred => pred.probability > 0.6)
      .map(pred => pred.preference);
  }, [predictPreferences]);

  // Analyse des patterns
  const analyzePatterns = useCallback((): LearningPattern[] => {
    return learningEngine.getPatterns();
  }, [learningEngine]);

  // Score de confiance
  const getConfidenceScore = useCallback((category: string): number => {
    return learningEngine.getConfidenceScore(category);
  }, [learningEngine]);

  // Adaptation contextuelle
  const adaptToContext = useCallback((context: UserContext) => {
    const predictions = predictPreferences(context);
    console.log(`🧠 IA: Adaptation au contexte`, context, predictions);
  }, [predictPreferences]);

  // Préférences contextuelles
  const getContextualPreferences = useCallback((context: UserContext): UserPreference[] => {
    return getRecommendations(context);
  }, [getRecommendations]);

  // Optimisation prédictive
  const optimizeForContext = useCallback((context: UserContext) => {
    const optimalSettings = learningEngine.predictOptimalSettings(context);
    console.log(`🧠 IA: Optimisation prédictive`, context, optimalSettings);
    return optimalSettings;
  }, [learningEngine]);

  // Prédiction des paramètres optimaux
  const predictOptimalSettings = useCallback((context: UserContext): any => {
    return learningEngine.predictOptimalSettings(context);
  }, [learningEngine]);

  // Toggle de l'apprentissage
  const toggleLearning = useCallback(() => {
    setLearningEnabled(prev => !prev);
    console.log(`🧠 IA: Apprentissage ${!learningEnabled ? 'activé' : 'désactivé'}`);
  }, [learningEnabled]);

  return {
    learnFromInteraction,
    predictPreferences,
    getRecommendations,
    analyzePatterns,
    getConfidenceScore,
    adaptToContext,
    getContextualPreferences,
    optimizeForContext,
    predictOptimalSettings,
    preferences,
    patterns,
    learningEnabled,
    toggleLearning
  };
};
