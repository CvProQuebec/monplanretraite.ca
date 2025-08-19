import { useState, useEffect, useCallback } from 'react';

// Types pour le layout adaptatif
export interface AdaptiveLayout {
  columns: number;
  spacing: 'sm' | 'md' | 'lg' | 'xl';
  density: 'compact' | 'comfortable' | 'spacious';
  animations: 'none' | 'subtle' | 'smooth' | 'energetic';
  shortcuts: boolean;
  predictiveLoading: boolean;
}

export interface ScreenContext {
  size: 'mobile' | 'tablet' | 'desktop' | 'ultrawide';
  orientation: 'portrait' | 'landscape';
  viewport: {
    width: number;
    height: number;
  };
  touchCapable: boolean;
  connectionSpeed: 'slow' | 'fast' | 'unknown';
}

export interface LayoutRecommendation {
  type: 'performance' | 'accessibility' | 'productivity' | 'aesthetic';
  message: string;
  config: Partial<AdaptiveLayout>;
  confidence: number;
}

export interface FeatureUsage {
  featureId: string;
  featureName: string;
  usageCount: number;
  lastUsed: Date;
  averageTime: number;
}

export const useAdaptiveLayout = () => {
  const [currentLayout, setCurrentLayout] = useState<AdaptiveLayout>({
    columns: 3,
    spacing: 'md',
    density: 'comfortable',
    animations: 'smooth',
    shortcuts: true,
    predictiveLoading: true
  });

  const [screenContext, setScreenContext] = useState<ScreenContext>({
    size: 'desktop',
    orientation: 'landscape',
    viewport: { width: 1920, height: 1080 },
    touchCapable: false,
    connectionSpeed: 'fast'
  });

  const [featureUsage, setFeatureUsage] = useState<Map<string, FeatureUsage>>(new Map());
  const [recommendations, setRecommendations] = useState<LayoutRecommendation[]>([]);

  // Détection du contexte d'écran
  const updateScreenContext = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    let size: ScreenContext['size'] = 'desktop';
    if (width < 768) size = 'mobile';
    else if (width < 1024) size = 'tablet';
    else if (width > 2560) size = 'ultrawide';

    const orientation = width > height ? 'landscape' : 'portrait';
    const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Estimation simple de la vitesse de connexion
    const connection = (navigator as any).connection;
    let connectionSpeed: ScreenContext['connectionSpeed'] = 'unknown';
    if (connection) {
      connectionSpeed = connection.effectiveType === '4g' || connection.effectiveType === '5g' ? 'fast' : 'slow';
    }

    setScreenContext({
      size,
      orientation,
      viewport: { width, height },
      touchCapable,
      connectionSpeed
    });

    console.log('📱 Contexte d\'écran mis à jour:', { size, orientation, width, height });
  }, []);

  // Adaptation automatique du layout selon le contexte
  const adaptLayout = useCallback(() => {
    const newLayout: AdaptiveLayout = { ...currentLayout };

    // Adaptation selon la taille d'écran
    switch (screenContext.size) {
      case 'mobile':
        newLayout.columns = 1;
        newLayout.spacing = 'sm';
        newLayout.density = 'compact';
        newLayout.animations = screenContext.connectionSpeed === 'slow' ? 'subtle' : 'smooth';
        break;
      case 'tablet':
        newLayout.columns = 2;
        newLayout.spacing = 'md';
        newLayout.density = 'comfortable';
        newLayout.animations = 'smooth';
        break;
      case 'desktop':
        newLayout.columns = 3;
        newLayout.spacing = 'lg';
        newLayout.density = 'comfortable';
        newLayout.animations = 'energetic';
        break;
      case 'ultrawide':
        newLayout.columns = 4;
        newLayout.spacing = 'xl';
        newLayout.density = 'spacious';
        newLayout.animations = 'energetic';
        break;
    }

    // Adaptation selon les capacités tactiles
    if (screenContext.touchCapable) {
      newLayout.spacing = newLayout.spacing === 'sm' ? 'md' : newLayout.spacing;
      newLayout.shortcuts = false; // Moins de raccourcis clavier sur tactile
    }

    // Adaptation selon la vitesse de connexion
    if (screenContext.connectionSpeed === 'slow') {
      newLayout.animations = 'subtle';
      newLayout.predictiveLoading = false;
    }

    setCurrentLayout(newLayout);
    console.log('🎯 Layout adapté:', newLayout);
  }, [screenContext, currentLayout]);

  // Enregistrement de l'utilisation des fonctionnalités
  const recordFeatureUsage = useCallback((featureId: string, featureName: string, timeSpent: number) => {
    setFeatureUsage(prev => {
      const updated = new Map(prev);
      const existing = updated.get(featureId);
      
      if (existing) {
        updated.set(featureId, {
          ...existing,
          usageCount: existing.usageCount + 1,
          lastUsed: new Date(),
          averageTime: (existing.averageTime + timeSpent) / 2
        });
      } else {
        updated.set(featureId, {
          featureId,
          featureName,
          usageCount: 1,
          lastUsed: new Date(),
          averageTime: timeSpent
        });
      }
      
      console.log('📊 Utilisation enregistrée:', featureName, 'Temps:', timeSpent);
      return updated;
    });
  }, []);

  // Génération de recommandations IA
  const generateRecommendations = useCallback(() => {
    const newRecommendations: LayoutRecommendation[] = [];

    // Recommandation basée sur la performance
    if (screenContext.connectionSpeed === 'slow') {
      newRecommendations.push({
        type: 'performance',
        message: 'Connexion lente détectée - animations réduites recommandées',
        config: { animations: 'subtle', predictiveLoading: false },
        confidence: 0.9
      });
    }

    // Recommandation basée sur l'utilisation
    const mostUsedFeatures = Array.from(featureUsage.values())
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 3);

    if (mostUsedFeatures.length > 0) {
      newRecommendations.push({
        type: 'productivity',
        message: `Optimisation pour vos fonctionnalités les plus utilisées: ${mostUsedFeatures.map(f => f.featureName).join(', ')}`,
        config: { shortcuts: true, predictiveLoading: true },
        confidence: 0.8
      });
    }

    // Recommandation basée sur l'écran
    if (screenContext.size === 'ultrawide') {
      newRecommendations.push({
        type: 'aesthetic',
        message: 'Écran ultra-large détecté - layout étendu recommandé',
        config: { columns: 4, spacing: 'xl', density: 'spacious' },
        confidence: 0.85
      });
    }

    // Recommandation d'accessibilité
    if (screenContext.touchCapable) {
      newRecommendations.push({
        type: 'accessibility',
        message: 'Interface tactile détectée - espacement augmenté recommandé',
        config: { spacing: 'lg', density: 'comfortable' },
        confidence: 0.75
      });
    }

    setRecommendations(newRecommendations);
    console.log('🤖 Recommandations générées:', newRecommendations.length);
  }, [screenContext, featureUsage]);

  // Obtention des recommandations actuelles
  const getLayoutRecommendations = useCallback(() => {
    return recommendations;
  }, [recommendations]);

  // Initialisation et événements
  useEffect(() => {
    updateScreenContext();
    
    const handleResize = () => {
      updateScreenContext();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateScreenContext]);

  // Adaptation automatique quand le contexte change
  useEffect(() => {
    adaptLayout();
  }, [screenContext]);

  // Génération périodique de recommandations
  useEffect(() => {
    generateRecommendations();
    
    const interval = setInterval(generateRecommendations, 30000); // Toutes les 30 secondes
    return () => clearInterval(interval);
  }, [generateRecommendations]);

  return {
    currentLayout,
    screenContext,
    featureUsage: Array.from(featureUsage.values()),
    recommendations,
    recordFeatureUsage,
    getLayoutRecommendations,
    updateScreenContext,
    adaptLayout
  };
};