import { useState, useEffect, useCallback } from 'react';

interface Theme {
  id: string;
  name: string;
}

interface UseThemeRotationProps {
  currentTheme: Theme;
  setTheme: (theme: string) => void;
}

/**
 * Hook pour gérer la rotation automatique des thèmes
 * Change automatiquement le thème selon l'heure de la journée
 */
export const useThemeRotation = ({ currentTheme, setTheme }: UseThemeRotationProps) => {
  const [isRotating, setIsRotating] = useState(false);

  const startThemeRotation = useCallback(() => {
    setIsRotating(true);
  }, []);

  const stopThemeRotation = useCallback(() => {
    setIsRotating(false);
  }, []);

  useEffect(() => {
    if (!isRotating) return;

    const interval = setInterval(() => {
      const hour = new Date().getHours();
      
      // Déterminer le thème selon l'heure
      let newTheme: string;
      if (hour >= 6 && hour < 12) {
        newTheme = 'morning';
      } else if (hour >= 12 && hour < 18) {
        newTheme = 'afternoon';
      } else if (hour >= 18 && hour < 22) {
        newTheme = 'evening';
      } else {
        newTheme = 'night';
      }

      // Changer le thème seulement s'il est différent
      if (newTheme !== currentTheme.id) {
        setTheme(newTheme);
      }
    }, 30000); // Changer toutes les 30 secondes

    return () => clearInterval(interval);
  }, [isRotating, currentTheme.id, setTheme]);

  return {
    isRotating,
    startThemeRotation,
    stopThemeRotation,
  };
};
