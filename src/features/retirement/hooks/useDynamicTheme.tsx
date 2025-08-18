// Hook magique pour les thèmes dynamiques avec IA
import { useState, useEffect, useCallback } from 'react';
import { useMotionValue, useTransform, useSpring } from 'framer-motion';

export interface ThemeConfig {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  mood: string;
  intensity: number;
  particles: boolean;
  animations: 'subtle' | 'moderate' | 'intensive';
}

export interface UserContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  userMood: 'energetic' | 'focused' | 'relaxed' | 'creative';
  userType: 'power' | 'casual' | 'minimalist';
  screenSize: 'mobile' | 'tablet' | 'desktop';
  isPremium: boolean;
}

export const useDynamicTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [userContext, setUserContext] = useState<UserContext>({
    timeOfDay: 'morning',
    userMood: 'focused',
    userType: 'casual',
    screenSize: 'desktop',
    isPremium: false
  });

  // Thèmes magiques qui s'adaptent
  const themes: Record<string, ThemeConfig> = {
    // 🌅 Thèmes du matin - Énergisants
    morning: {
      id: 'morning',
      name: 'Aube Énergisante',
      primary: 'from-orange-400 via-yellow-400 to-amber-500',
      secondary: 'from-green-400 via-emerald-400 to-teal-500',
      accent: 'from-pink-400 to-rose-500',
      background: 'from-orange-50 via-yellow-50 to-amber-50',
      text: 'text-orange-900',
      mood: 'énergisant et motivant',
      intensity: 0.8,
      particles: true,
      animations: 'moderate'
    },
    
    // ☀️ Thèmes de l'après-midi - Professionnels
    afternoon: {
      id: 'afternoon',
      name: 'Focus Professionnel',
      primary: 'from-blue-500 via-indigo-500 to-purple-600',
      secondary: 'from-cyan-400 via-blue-400 to-indigo-500',
      accent: 'from-emerald-400 to-teal-500',
      background: 'from-blue-50 via-indigo-50 to-purple-50',
      text: 'text-blue-900',
      mood: 'concentré et productif',
      intensity: 0.6,
      particles: false,
      animations: 'subtle'
    },
    
    // 🌆 Thèmes du soir - Détendus
    evening: {
      id: 'evening',
      name: 'Sérénité du Soir',
      primary: 'from-purple-400 via-pink-400 to-rose-500',
      secondary: 'from-indigo-400 via-purple-400 to-pink-500',
      accent: 'from-amber-400 to-orange-500',
      background: 'from-purple-50 via-pink-50 to-rose-50',
      text: 'text-purple-900',
      mood: 'détendu et réfléchi',
      intensity: 0.4,
      particles: true,
      animations: 'moderate'
    },
    
    // 🌙 Thèmes de la nuit - Mystérieux
    night: {
      id: 'night',
      name: 'Mystère Nocturne',
      primary: 'from-slate-600 via-gray-600 to-slate-700',
      secondary: 'from-blue-600 via-indigo-600 to-purple-700',
      accent: 'from-cyan-400 to-blue-500',
      background: 'from-slate-900 via-gray-900 to-slate-800',
      text: 'text-slate-100',
      mood: 'mystérieux et contemplatif',
      intensity: 0.3,
      particles: true,
      animations: 'intensive'
    },
    
    // 👑 Thèmes Premium - Luxueux
    premium: {
      id: 'premium',
      name: 'Luxe Ultime',
      primary: 'from-amber-400 via-yellow-400 to-orange-500',
      secondary: 'from-purple-500 via-pink-500 to-rose-500',
      accent: 'from-emerald-400 to-teal-500',
      background: 'from-amber-50 via-yellow-50 to-orange-50',
      text: 'text-amber-900',
      mood: 'exclusif et sophistiqué',
      intensity: 1.0,
      particles: true,
      animations: 'intensive'
    },
    
    // 🎨 Thèmes Créatifs - Inspirants
    creative: {
      id: 'creative',
      name: 'Inspiration Créative',
      primary: 'from-pink-400 via-purple-400 to-indigo-500',
      secondary: 'from-cyan-400 via-blue-400 to-indigo-500',
      accent: 'from-yellow-400 to-orange-500',
      background: 'from-pink-50 via-purple-50 to-indigo-50',
      text: 'text-pink-900',
      mood: 'inspirant et créatif',
      intensity: 0.9,
      particles: true,
      animations: 'intensive'
    }
  };

  // IA qui analyse le contexte et choisit le thème
  const analyzeContext = useCallback((): ThemeConfig => {
    const hour = new Date().getHours();
    let timeBasedTheme: string;
    
    // Détection automatique de l'heure
    if (hour >= 5 && hour < 12) timeBasedTheme = 'morning';
    else if (hour >= 12 && hour < 18) timeBasedTheme = 'afternoon';
    else if (hour >= 18 && hour < 22) timeBasedTheme = 'evening';
    else timeBasedTheme = 'night';
    
    // Adaptation selon l'humeur utilisateur
    let moodBasedTheme = timeBasedTheme;
    if (userContext.userMood === 'energetic' && timeBasedTheme === 'afternoon') {
      moodBasedTheme = 'creative';
    } else if (userContext.userMood === 'relaxed' && timeBasedTheme === 'evening') {
      moodBasedTheme = 'evening';
    }
    
    // Thème premium si l'utilisateur l'est
    if (userContext.isPremium && Math.random() > 0.7) {
      return themes.premium;
    }
    
    // Thème créatif si l'utilisateur est en mode créatif
    if (userContext.userMood === 'creative') {
      return themes.creative;
    }
    
    return themes[moodBasedTheme] || themes.afternoon;
  }, [userContext]);

  // Mise à jour automatique du thème
  useEffect(() => {
    const newTheme = analyzeContext();
    setCurrentTheme(newTheme);
    
    // Changement de thème avec transition fluide
    document.documentElement.style.setProperty('--theme-transition', 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)');
    
    // Application des variables CSS du thème
    document.documentElement.style.setProperty('--theme-primary', newTheme.primary);
    document.documentElement.style.setProperty('--theme-secondary', newTheme.secondary);
    document.documentElement.style.setProperty('--theme-accent', newTheme.accent);
    document.documentElement.style.setProperty('--theme-background', newTheme.background);
    document.documentElement.style.setProperty('--theme-text', newTheme.text);
    document.documentElement.style.setProperty('--theme-intensity', newTheme.intensity.toString());
    
  }, [analyzeContext]);

  // Mise à jour du contexte utilisateur
  const updateUserContext = useCallback((updates: Partial<UserContext>) => {
    setUserContext(prev => ({ ...prev, ...updates }));
  }, []);

  // Changement manuel de thème
  const changeTheme = useCallback((themeId: string) => {
    if (themes[themeId]) {
      setCurrentTheme(themes[themeId]);
    }
  }, []);

  // Rotation automatique des thèmes
  const startThemeRotation = useCallback(() => {
    if (isRotating) {
      setIsRotating(false);
      return;
    }
    
    setIsRotating(true);
    const themeIds = Object.keys(themes);
    let currentIndex = themeIds.findIndex(id => id === currentTheme?.id) || 0;
    
    const interval = setInterval(() => {
      if (!isRotating) {
        clearInterval(interval);
        return;
      }
      
      currentIndex = (currentIndex + 1) % themeIds.length;
      changeTheme(themeIds[currentIndex]);
    }, 3000); // Changement toutes les 3 secondes pour la démo
    
    // Nettoyer l'intervalle si la rotation s'arrête
    if (!isRotating) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [changeTheme, currentTheme, isRotating]);

  // Hook pour les animations basées sur le thème
  const useThemeAnimation = () => {
    const scale = useMotionValue(1);
    const rotate = useMotionValue(0);
    
    const animatedScale = useSpring(scale, {
      stiffness: 300,
      damping: 20
    });
    
    const animatedRotate = useSpring(rotate, {
      stiffness: 200,
      damping: 15
    });
    
    return {
      scale: animatedScale,
      rotate: animatedRotate,
      setScale: scale.set,
      setRotate: rotate.set
    };
  };

  return {
    currentTheme,
    userContext,
    themes,
    isRotating,
    updateUserContext,
    changeTheme,
    startThemeRotation,
    useThemeAnimation,
    isThemeActive: (themeId: string) => currentTheme?.id === themeId
  };
};
