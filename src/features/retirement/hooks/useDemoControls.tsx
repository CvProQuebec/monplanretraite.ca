import { useState, useEffect, useCallback } from 'react';
import { useDynamicTheme } from './useDynamicTheme';
import { useAdaptiveLayout } from './useAdaptiveLayout';

// Types pour les contrôles de démonstration
export interface DemoControls {
  // Contrôles de thèmes
  isRotating: boolean;
  startThemeRotation: () => void;
  stopThemeRotation: () => void;
  
  // Contrôles de particules
  showParticles: boolean;
  toggleParticles: () => void;
  particleIntensity: number;
  setParticleIntensity: (intensity: number) => void;
  
  // Contrôles de physique
  showPhysics: boolean;
  togglePhysics: () => void;
  physicsGravity: boolean;
  setPhysicsGravity: (enabled: boolean) => void;
  physicsFriction: number;
  setPhysicsFriction: (friction: number) => void;
  
  // Contrôles de performance
  performanceMode: boolean;
  togglePerformanceMode: () => void;
  
  // État global
  isDemoMode: boolean;
  toggleDemoMode: () => void;
}

// Configuration des contrôles par défaut
const DEFAULT_CONTROLS = {
  showParticles: true,
  showPhysics: true,
  particleIntensity: 0.7,
  physicsGravity: true,
  physicsFriction: 0.8,
  performanceMode: false,
  isDemoMode: false
};

export const useDemoControls = (): DemoControls => {
  // Hooks existants
  const { 
    currentTheme, 
    isRotating, 
    startThemeRotation: startThemeRotationOriginal 
  } = useDynamicTheme();
  
  const { currentLayout, screenContext } = useAdaptiveLayout();

  // États locaux pour les contrôles
  const [showParticles, setShowParticles] = useState(DEFAULT_CONTROLS.showParticles);
  const [showPhysics, setShowPhysics] = useState(DEFAULT_CONTROLS.showPhysics);
  const [particleIntensity, setParticleIntensity] = useState(DEFAULT_CONTROLS.particleIntensity);
  const [physicsGravity, setPhysicsGravity] = useState(DEFAULT_CONTROLS.physicsGravity);
  const [physicsFriction, setPhysicsFriction] = useState(DEFAULT_CONTROLS.physicsFriction);
  const [performanceMode, setPerformanceMode] = useState(DEFAULT_CONTROLS.performanceMode);
  const [isDemoMode, setIsDemoMode] = useState(DEFAULT_CONTROLS.isDemoMode);

  // Charger les préférences depuis localStorage
  useEffect(() => {
    const savedControls = localStorage.getItem('demo-controls');
    if (savedControls) {
      try {
        const parsed = JSON.parse(savedControls);
        setShowParticles(parsed.showParticles ?? DEFAULT_CONTROLS.showParticles);
        setShowPhysics(parsed.showPhysics ?? DEFAULT_CONTROLS.showPhysics);
        setParticleIntensity(parsed.particleIntensity ?? DEFAULT_CONTROLS.particleIntensity);
        setPhysicsGravity(parsed.physicsGravity ?? DEFAULT_CONTROLS.physicsGravity);
        setPhysicsFriction(parsed.physicsFriction ?? DEFAULT_CONTROLS.physicsFriction);
        setPerformanceMode(parsed.performanceMode ?? DEFAULT_CONTROLS.performanceMode);
        setIsDemoMode(parsed.isDemoMode ?? DEFAULT_CONTROLS.isDemoMode);
      } catch (error) {
        console.warn('Erreur lors du chargement des contrôles de démo:', error);
      }
    }
  }, []);

  // Sauvegarder les préférences dans localStorage
  const saveControls = useCallback(() => {
    const controls = {
      showParticles,
      showPhysics,
      particleIntensity,
      physicsGravity,
      physicsFriction,
      performanceMode,
      isDemoMode
    };
    localStorage.setItem('demo-controls', JSON.stringify(controls));
  }, [showParticles, showPhysics, particleIntensity, physicsGravity, physicsFriction, performanceMode, isDemoMode]);

  // Sauvegarder automatiquement lors des changements
  useEffect(() => {
    saveControls();
  }, [saveControls]);

  // Contrôles de thèmes
  const startThemeRotation = useCallback(() => {
    startThemeRotationOriginal();
    console.log('🚀 Rotation des thèmes démarrée via les contrôles de démo');
  }, [startThemeRotationOriginal]);

  const stopThemeRotation = useCallback(() => {
    startThemeRotationOriginal(); // Cette fonction fait déjà le toggle
    console.log('⏹️ Rotation des thèmes arrêtée via les contrôles de démo');
  }, [startThemeRotationOriginal]);

  // Contrôles de particules
  const toggleParticles = useCallback(() => {
    setShowParticles(prev => {
      const newValue = !prev;
      console.log(`✨ Particules ${newValue ? 'affichées' : 'masquées'}`);
      return newValue;
    });
  }, []);

  const setParticleIntensityValue = useCallback((intensity: number) => {
    setParticleIntensity(intensity);
    console.log(`🎯 Intensité des particules réglée à: ${intensity}`);
  }, []);

  // Contrôles de physique
  const togglePhysics = useCallback(() => {
    setShowPhysics(prev => {
      const newValue = !prev;
      console.log(`⚡ Physique ${newValue ? 'activée' : 'désactivée'}`);
      return newValue;
    });
  }, []);

  const setPhysicsGravityValue = useCallback((enabled: boolean) => {
    setPhysicsGravity(enabled);
    console.log(`🌍 Gravité ${enabled ? 'activée' : 'désactivée'}`);
  }, []);

  const setPhysicsFrictionValue = useCallback((friction: number) => {
    setPhysicsFriction(friction);
    console.log(`🔄 Friction réglée à: ${friction}`);
  }, []);

  // Contrôle de performance
  const togglePerformanceMode = useCallback(() => {
    setPerformanceMode(prev => {
      const newValue = !prev;
      console.log(`⚡ Mode performance ${newValue ? 'activé' : 'désactivé'}`);
      
      // Ajuster automatiquement les paramètres selon le mode performance
      if (newValue) {
        // Mode performance : réduire les effets
        setShowParticles(false);
        setShowPhysics(false);
        setParticleIntensity(0.3);
        setPhysicsFriction(0.9);
      } else {
        // Mode normal : restaurer les paramètres
        setShowParticles(true);
        setShowPhysics(true);
        setParticleIntensity(0.7);
        setPhysicsFriction(0.8);
      }
      
      return newValue;
    });
  }, []);

  // Mode démo global
  const toggleDemoMode = useCallback(() => {
    setIsDemoMode(prev => {
      const newValue = !prev;
      console.log(`🎭 Mode démo ${newValue ? 'activé' : 'désactivé'}`);
      
      if (newValue) {
        // Activer tous les effets en mode démo
        setShowParticles(true);
        setShowPhysics(true);
        setParticleIntensity(1.0);
        setPhysicsGravity(true);
        setPhysicsFriction(0.6);
        setPerformanceMode(false);
      }
      
      return newValue;
    });
  }, []);

  // Adaptation automatique selon le contexte d'écran
  useEffect(() => {
    if (screenContext.size === 'mobile' && !performanceMode) {
      // Sur mobile, réduire automatiquement les effets pour la performance
      setShowParticles(false);
      setShowPhysics(false);
      setParticleIntensity(0.4);
      console.log('📱 Adaptation automatique pour mobile : effets réduits');
    }
  }, [screenContext.size, performanceMode]);

  // Adaptation selon la vitesse de connexion
  useEffect(() => {
    if (screenContext.connectionSpeed === 'slow' && !performanceMode) {
      setShowParticles(false);
      setShowPhysics(false);
      console.log('🐌 Adaptation automatique pour connexion lente : effets réduits');
    }
  }, [screenContext.connectionSpeed, performanceMode]);

  return {
    // Contrôles de thèmes
    isRotating,
    startThemeRotation,
    stopThemeRotation,
    
    // Contrôles de particules
    showParticles,
    toggleParticles,
    particleIntensity,
    setParticleIntensity: setParticleIntensityValue,
    
    // Contrôles de physique
    showPhysics,
    togglePhysics,
    physicsGravity,
    setPhysicsGravity: setPhysicsGravityValue,
    physicsFriction,
    setPhysicsFriction: setPhysicsFrictionValue,
    
    // Contrôles de performance
    performanceMode,
    togglePerformanceMode,
    
    // État global
    isDemoMode,
    toggleDemoMode
  };
};
