import { useState, useEffect, useCallback } from 'react';

// Types pour les thèmes dynamiques
export interface DynamicTheme {
  id: string;
  name: string;
  mood: string;
  intensity: number;
  particles: boolean;
  animations: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}

// Configuration des thèmes intelligents
const THEMES: Record<string, DynamicTheme> = {
  morning: {
    id: 'morning',
    name: 'Matin Énergisant',
    mood: 'Énergique et optimiste',
    intensity: 0.8,
    particles: true,
    animations: 'fluide',
    primary: 'from-amber-400 to-orange-500',
    secondary: 'from-blue-400 to-cyan-500',
    accent: 'from-yellow-300 to-amber-400',
    background: 'from-orange-50 via-amber-50 to-yellow-50',
    timeOfDay: 'morning'
  },
  afternoon: {
    id: 'afternoon',
    name: 'Après-midi Productif',
    mood: 'Concentré et efficace',
    intensity: 0.6,
    particles: false,
    animations: 'subtile',
    primary: 'from-blue-500 to-indigo-600',
    secondary: 'from-green-400 to-emerald-500',
    accent: 'from-cyan-300 to-blue-400',
    background: 'from-blue-50 via-indigo-50 to-purple-50',
    timeOfDay: 'afternoon'
  },
  evening: {
    id: 'evening',
    name: 'Soirée Détendue',
    mood: 'Calme et réfléchi',
    intensity: 0.4,
    particles: true,
    animations: 'douce',
    primary: 'from-purple-500 to-pink-600',
    secondary: 'from-indigo-400 to-purple-500',
    accent: 'from-pink-300 to-rose-400',
    background: 'from-purple-50 via-pink-50 to-rose-50',
    timeOfDay: 'evening'
  },
  night: {
    id: 'night',
    name: 'Nuit Mystérieuse',
    mood: 'Mystique et inspirant',
    intensity: 0.9,
    particles: true,
    animations: 'magique',
    primary: 'from-slate-600 to-gray-800',
    secondary: 'from-purple-600 to-indigo-700',
    accent: 'from-blue-400 to-purple-500',
    background: 'from-slate-900 via-gray-800 to-indigo-900',
    timeOfDay: 'night'
  },
  premium: {
    id: 'premium',
    name: 'Premium Luxe',
    mood: 'Luxueux et sophistiqué',
    intensity: 1.0,
    particles: true,
    animations: 'premium',
    primary: 'from-amber-500 to-yellow-600',
    secondary: 'from-purple-600 to-pink-600',
    accent: 'from-rose-400 to-pink-500',
    background: 'from-amber-50 via-yellow-50 to-orange-50'
  },
  creative: {
    id: 'creative',
    name: 'Créatif Artistique',
    mood: 'Créatif et expressif',
    intensity: 0.9,
    particles: true,
    animations: 'artistique',
    primary: 'from-pink-500 to-rose-600',
    secondary: 'from-purple-500 to-indigo-600',
    accent: 'from-cyan-400 to-blue-500',
    background: 'from-pink-50 via-rose-50 to-purple-50'
  }
};

export const useDynamicTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<DynamicTheme>(THEMES.afternoon);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationInterval, setRotationInterval] = useState<NodeJS.Timeout | null>(null);

  // Détection automatique du thème selon l'heure
  const getAutoTheme = useCallback((): DynamicTheme => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) return THEMES.morning;
    if (hour >= 12 && hour < 17) return THEMES.afternoon;
    if (hour >= 17 && hour < 21) return THEMES.evening;
    return THEMES.night;
  }, []);

  // Application automatique du thème selon l'heure
  useEffect(() => {
    if (!isRotating) {
      const autoTheme = getAutoTheme();
      setCurrentTheme(autoTheme);
    }
  }, [getAutoTheme, isRotating]);

  // Changement manuel de thème
  const changeTheme = useCallback((themeId: string) => {
    if (THEMES[themeId]) {
      setCurrentTheme(THEMES[themeId]);
      console.log('🎨 Thème changé:', THEMES[themeId].name);
    }
  }, []);

  // Rotation automatique des thèmes
  const startThemeRotation = useCallback(() => {
    if (isRotating) {
      // Arrêter la rotation
      if (rotationInterval) {
        clearInterval(rotationInterval);
        setRotationInterval(null);
      }
      setIsRotating(false);
      console.log('⏹️ Rotation des thèmes arrêtée');
      return;
    }

    // Démarrer la rotation
    setIsRotating(true);
    const themeKeys = Object.keys(THEMES);
    let currentIndex = 0;

    const interval = setInterval(() => {
      const themeKey = themeKeys[currentIndex];
      setCurrentTheme(THEMES[themeKey]);
      console.log('🎭 Rotation automatique:', THEMES[themeKey].name);
      
      currentIndex = (currentIndex + 1) % themeKeys.length;
    }, 3000); // Changement toutes les 3 secondes

    setRotationInterval(interval);
    console.log('▶️ Rotation des thèmes démarrée');
  }, [isRotating, rotationInterval]);

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      if (rotationInterval) {
        clearInterval(rotationInterval);
      }
    };
  }, [rotationInterval]);

  return {
    currentTheme,
    themes: THEMES,
    changeTheme,
    startThemeRotation,
    isRotating,
    getAutoTheme
  };
};