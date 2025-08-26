import { useState, useEffect } from 'react';

interface ScreenContext {
  size: 'small' | 'medium' | 'large' | 'xlarge';
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Hook pour gérer le contexte de l'écran
 * Fournit des informations sur la taille et le type d'écran
 */
export const useScreenContext = (): ScreenContext => {
  const [screenContext, setScreenContext] = useState<ScreenContext>({
    size: 'medium',
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const updateScreenContext = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Déterminer la taille de l'écran
      let size: 'small' | 'medium' | 'large' | 'xlarge';
      if (width < 640) size = 'small';
      else if (width < 1024) size = 'medium';
      else if (width < 1536) size = 'large';
      else size = 'xlarge';

      // Déterminer le type d'appareil
      const isMobile = width <= 768;
      const isTablet = width > 768 && width <= 1024;
      const isDesktop = width > 1024;

      setScreenContext({
        size,
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
      });
    };

    // Mise à jour initiale
    updateScreenContext();

    // Écouter les changements de taille
    window.addEventListener('resize', updateScreenContext);
    window.addEventListener('orientationchange', updateScreenContext);

    return () => {
      window.removeEventListener('resize', updateScreenContext);
      window.removeEventListener('orientationchange', updateScreenContext);
    };
  }, []);

  return screenContext;
};
