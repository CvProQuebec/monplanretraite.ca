import { useState, useEffect } from 'react';

/**
 * Hook pour détecter si l'appareil est mobile
 * Utilise plusieurs méthodes de détection pour une précision maximale
 */
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      // Méthode 1: User Agent
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

      // Méthode 2: Largeur de l'écran
      const isMobileScreen = window.innerWidth <= 768;

      // Méthode 3: Touch support
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Méthode 4: Orientation mobile
      const isMobileOrientation = window.orientation !== undefined;

      // Méthode 5: DPI élevé (appareils haute résolution)
      const isHighDPI = window.devicePixelRatio > 1.5;

      // Considère comme mobile si au moins 3 critères sont remplis
      const mobileCriteria = [isMobileUA, isMobileScreen, hasTouchSupport, isMobileOrientation, isHighDPI];
      const mobileScore = mobileCriteria.filter(Boolean).length;

      setIsMobile(mobileScore >= 3);
    };

    // Vérification initiale
    checkIfMobile();

    // Réécoute lors du redimensionnement
    window.addEventListener('resize', checkIfMobile);
    
    // Réécoute lors du changement d'orientation
    window.addEventListener('orientationchange', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('orientationchange', checkIfMobile);
    };
  }, []);

  return isMobile;
};
