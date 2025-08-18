// Hook intelligent pour le layout adaptatif avec IA
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDynamicTheme } from './useDynamicTheme';

export interface UserBehavior {
  features: Array<{
    id: string;
    name: string;
    usageCount: number;
    lastUsed: Date;
    timeSpent: number;
    clickPattern: 'frequent' | 'occasional' | 'rare';
  }>;
  layouts: Array<{
    id: string;
    screenSize: 'mobile' | 'tablet' | 'desktop';
    type: 'grid' | 'list' | 'compact' | 'spacious';
    columns: number;
    spacing: 'tight' | 'comfortable' | 'spacious';
    preferences: {
      animations: 'minimal' | 'moderate' | 'intensive';
      density: 'compact' | 'balanced' | 'spacious';
      organization: 'alphabetical' | 'frequency' | 'category' | 'recent';
    };
  }>;
  interactions: Array<{
    type: 'click' | 'hover' | 'scroll' | 'drag' | 'search';
    target: string;
    timestamp: Date;
    duration: number;
    success: boolean;
  }>;
  patterns: {
    sessionDuration: number;
    peakUsageHours: number[];
    preferredFeatures: string[];
    navigationStyle: 'direct' | 'exploratory' | 'systematic';
    multitasking: boolean;
  };
}

export interface AdaptiveLayoutConfig {
  columns: number;
  spacing: 'tight' | 'comfortable' | 'spacious';
  animations: 'minimal' | 'moderate' | 'intensive';
  density: 'compact' | 'balanced' | 'spacious';
  organization: 'alphabetical' | 'frequency' | 'category' | 'recent';
  shortcuts: boolean;
  predictiveLoading: boolean;
  autoOrganization: boolean;
}

export interface ScreenContext {
  size: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  viewport: {
    width: number;
    height: number;
  };
}

export const useAdaptiveLayout = () => {
  const { currentTheme, userContext } = useDynamicTheme();
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    features: [],
    layouts: [],
    interactions: [],
    patterns: {
      sessionDuration: 0,
      peakUsageHours: [],
      preferredFeatures: [],
      navigationStyle: 'direct',
      multitasking: false
    }
  });

  const [screenContext, setScreenContext] = useState<ScreenContext>({
    size: 'desktop',
    orientation: 'landscape',
    pixelRatio: 1,
    viewport: { width: 1920, height: 1080 }
  });

  const [currentLayout, setCurrentLayout] = useState<AdaptiveLayoutConfig>({
    columns: 3,
    spacing: 'comfortable',
    animations: 'moderate',
    density: 'balanced',
    organization: 'category',
    shortcuts: false,
    predictiveLoading: true,
    autoOrganization: true
  });

  // Détection automatique de la taille d'écran
  useEffect(() => {
    const updateScreenContext = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = window.devicePixelRatio || 1;
      
      let size: 'mobile' | 'tablet' | 'desktop';
      if (width < 768) size = 'mobile';
      else if (width < 1024) size = 'tablet';
      else size = 'desktop';
      
      const orientation = width > height ? 'landscape' : 'portrait';
      
      setScreenContext({
        size,
        orientation,
        pixelRatio,
        viewport: { width, height }
      });
    };

    updateScreenContext();
    window.addEventListener('resize', updateScreenContext);
    window.addEventListener('orientationchange', updateScreenContext);

    return () => {
      window.removeEventListener('resize', updateScreenContext);
      window.removeEventListener('orientationchange', updateScreenContext);
    };
  }, []);

  // Analyse intelligente du comportement utilisateur
  const analyzeUserBehavior = useCallback((): AdaptiveLayoutConfig => {
    const { size } = screenContext;
    const { userType, userMood } = userContext;
    
    // Configuration de base selon la taille d'écran
    let baseConfig: Partial<AdaptiveLayoutConfig> = {};
    
    switch (size) {
      case 'mobile':
        baseConfig = {
          columns: 1,
          spacing: 'tight',
          density: 'compact',
          animations: 'minimal',
          shortcuts: false
        };
        break;
      case 'tablet':
        baseConfig = {
          columns: 2,
          spacing: 'comfortable',
          density: 'balanced',
          animations: 'moderate',
          shortcuts: true
        };
        break;
      case 'desktop':
        baseConfig = {
          columns: 3,
          spacing: 'comfortable',
          density: 'balanced',
          animations: 'moderate',
          shortcuts: true
        };
        break;
    }

    // Adaptation selon le type d'utilisateur
    switch (userType) {
      case 'power':
        baseConfig = {
          ...baseConfig,
          columns: Math.min((baseConfig.columns || 3) + 1, 4),
          spacing: 'tight',
          density: 'compact',
          animations: 'intensive',
          shortcuts: true,
          predictiveLoading: true,
          autoOrganization: true
        };
        break;
      case 'casual':
        baseConfig = {
          ...baseConfig,
          spacing: 'comfortable',
          density: 'balanced',
          animations: 'moderate',
          shortcuts: false,
          predictiveLoading: true,
          autoOrganization: false
        };
        break;
      case 'minimalist':
        baseConfig = {
          ...baseConfig,
          columns: Math.max((baseConfig.columns || 3) - 1, 1),
          spacing: 'spacious',
          density: 'spacious',
          animations: 'minimal',
          shortcuts: false,
          predictiveLoading: false,
          autoOrganization: false
        };
        break;
    }

    // Adaptation selon l'humeur
    switch (userMood) {
      case 'energetic':
        baseConfig.animations = 'intensive';
        baseConfig.density = 'compact';
        break;
      case 'focused':
        baseConfig.animations = 'minimal';
        baseConfig.density = 'balanced';
        break;
      case 'relaxed':
        baseConfig.animations = 'moderate';
        baseConfig.spacing = 'spacious';
        break;
      case 'creative':
        baseConfig.animations = 'intensive';
        baseConfig.organization = 'category';
        break;
    }

    // Adaptation selon le thème actuel
    if (currentTheme) {
      switch (currentTheme.animations) {
        case 'subtle':
          baseConfig.animations = 'minimal';
          break;
        case 'moderate':
          baseConfig.animations = 'moderate';
          break;
        case 'intensive':
          baseConfig.animations = 'intensive';
          break;
      }
    }

    return {
      columns: baseConfig.columns || 3,
      spacing: baseConfig.spacing || 'comfortable',
      animations: baseConfig.animations || 'moderate',
      density: baseConfig.density || 'balanced',
      organization: baseConfig.organization || 'category',
      shortcuts: baseConfig.shortcuts || false,
      predictiveLoading: baseConfig.predictiveLoading !== false,
      autoOrganization: baseConfig.autoOrganization !== false
    };
  }, [screenContext, userContext, currentTheme]);

  // Mise à jour automatique du layout
  useEffect(() => {
    const newLayout = analyzeUserBehavior();
    setCurrentLayout(newLayout);
  }, [analyzeUserBehavior]);

  // Enregistrement des interactions utilisateur
  const recordInteraction = useCallback((
    type: UserBehavior['interactions'][0]['type'],
    target: string,
    duration: number = 0,
    success: boolean = true
  ) => {
    const interaction = {
      type,
      target,
      timestamp: new Date(),
      duration,
      success
    };

    setUserBehavior(prev => ({
      ...prev,
      interactions: [...prev.interactions, interaction].slice(-100) // Garder seulement les 100 dernières
    }));
  }, []);

  // Enregistrement de l'utilisation des fonctionnalités
  const recordFeatureUsage = useCallback((featureId: string, featureName: string, timeSpent: number = 0) => {
    setUserBehavior(prev => {
      const existingFeature = prev.features.find(f => f.id === featureId);
      
      if (existingFeature) {
        // Mise à jour de la fonctionnalité existante
        const updatedFeatures = prev.features.map(f => 
          f.id === featureId 
            ? {
                ...f,
                usageCount: f.usageCount + 1,
                lastUsed: new Date(),
                timeSpent: f.timeSpent + timeSpent,
                clickPattern: f.usageCount > 10 ? 'frequent' : f.usageCount > 5 ? 'occasional' : 'rare'
              }
            : f
        );
        
        return { ...prev, features: updatedFeatures };
      } else {
        // Ajout d'une nouvelle fonctionnalité
        const newFeature = {
          id: featureId,
          name: featureName,
          usageCount: 1,
          lastUsed: new Date(),
          timeSpent,
          clickPattern: 'rare' as const
        };
        
        return { ...prev, features: [...prev.features, newFeature] };
      }
    });
  }, []);

  // Prédiction des fonctionnalités les plus utilisées
  const getPredictedFeatures = useCallback(() => {
    return userBehavior.features
      .sort((a, b) => {
        // Score basé sur l'utilisation récente et la fréquence
        const timeWeight = 0.7;
        const frequencyWeight = 0.3;
        
        const timeScore = (Date.now() - a.lastUsed.getTime()) / (1000 * 60 * 60 * 24); // Jours
        const frequencyScore = a.usageCount;
        
        return (timeScore * timeWeight + frequencyScore * frequencyWeight) - 
               (timeScore * timeWeight + frequencyScore * frequencyWeight);
      })
      .slice(0, 5);
  }, [userBehavior.features]);

  // Recommandations de layout personnalisées
  const getLayoutRecommendations = useCallback(() => {
    const recommendations = [];
    
    // Recommandation basée sur l'heure
    const hour = new Date().getHours();
    if (hour >= 9 && hour <= 17) {
      recommendations.push({
        type: 'productivity',
        message: 'Mode productivité activé - Layout compact pour plus d\'efficacité',
        config: { density: 'compact', animations: 'minimal' }
      });
    } else if (hour >= 18 && hour <= 22) {
      recommendations.push({
        type: 'relaxation',
        message: 'Mode détente - Layout spacieux et animations douces',
        config: { spacing: 'spacious', animations: 'moderate' }
      });
    }

    // Recommandation basée sur l'utilisation
    if (userBehavior.patterns.sessionDuration > 30) {
      recommendations.push({
        type: 'long-session',
        message: 'Session longue détectée - Activation des raccourcis et préchargement',
        config: { shortcuts: true, predictiveLoading: true }
      });
    }

    // Recommandation basée sur la navigation
    if (userBehavior.patterns.navigationStyle === 'exploratory') {
      recommendations.push({
        type: 'exploration',
        message: 'Mode exploration - Organisation par catégorie et animations engageantes',
        config: { organization: 'category', animations: 'intensive' }
      });
    }

    // Toujours ajouter au moins une recommandation par défaut
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'default',
        message: 'Configuration optimale pour votre écran actuel',
        config: { 
          columns: currentLayout.columns, 
          spacing: currentLayout.spacing,
          animations: currentLayout.animations 
        }
      });
    }

    return recommendations;
  }, [userBehavior.patterns, currentLayout]);

  // Hook pour les animations adaptatives
  const useAdaptiveAnimation = () => {
    const getAnimationConfig = useCallback(() => {
      switch (currentLayout.animations) {
        case 'minimal':
          return {
            duration: 0.2,
            ease: "easeOut",
            type: "tween"
          };
        case 'moderate':
          return {
            duration: 0.4,
            ease: "easeInOut",
            type: "spring",
            stiffness: 300,
            damping: 20
          };
        case 'intensive':
          return {
            duration: 0.6,
            ease: "easeInOut",
            type: "spring",
            stiffness: 400,
            damping: 15
          };
        default:
          return {
            duration: 0.4,
            ease: "easeInOut",
            type: "spring"
          };
      }
    }, [currentLayout.animations]);

    return { getAnimationConfig };
  };

  // Hook pour la grille adaptative
  const useAdaptiveGrid = () => {
    const getGridConfig = useCallback(() => {
      const { columns, spacing, density } = currentLayout;
      
      const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      };

      const gaps = {
        tight: 'gap-2',
        comfortable: 'gap-4',
        spacious: 'gap-6'
      };

      const padding = {
        tight: 'p-2',
        comfortable: 'p-4',
        spacious: 'p-6'
      };

      return {
        gridCols: gridCols[columns as keyof typeof gridCols] || gridCols[3],
        gap: gaps[spacing] || gaps.comfortable,
        padding: padding[density] || padding.comfortable
      };
    }, [currentLayout]);

    return { getGridConfig };
  };

  return {
    currentLayout,
    screenContext,
    userBehavior,
    recordInteraction,
    recordFeatureUsage,
    getPredictedFeatures,
    getLayoutRecommendations,
    useAdaptiveAnimation,
    useAdaptiveGrid,
    updateLayout: setCurrentLayout
  };
};
