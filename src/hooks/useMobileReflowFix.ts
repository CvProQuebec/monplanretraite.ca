import { useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour corriger les problèmes de reflow mobile
 * Spécialement conçu pour Samsung S23 Ultra et autres appareils Android
 */
export const useMobileReflowFix = () => {
  // Force le reflow en modifiant temporairement le DOM
  const forceReflow = useCallback(() => {
    // Ajoute la classe de correction
    document.body.classList.add('mobile-reflow-fix');
    
    // Force un reflow en modifiant temporairement le DOM
    const temp = document.createElement('div');
    temp.style.position = 'absolute';
    temp.style.visibility = 'hidden';
    temp.style.height = '0';
    document.body.appendChild(temp);
    
    // Force le reflow
    temp.offsetHeight;
    
    // Supprime l'élément temporaire
    document.body.removeChild(temp);
    
    // Ajoute la classe page-loaded après un délai
    setTimeout(() => {
      document.body.classList.add('page-loaded');
    }, 100);
  }, []);

  // Force le reflow lors du changement d'orientation
  const handleOrientationChange = useCallback(() => {
    document.body.classList.add('orientation-change');
    setTimeout(() => {
      document.body.classList.remove('orientation-change');
    }, 500);
    
    // Force le reflow après le changement d'orientation
    setTimeout(() => {
      forceReflow();
    }, 100);
  }, [forceReflow]);

  // Force le reflow lors du redimensionnement
  const handleResize = useCallback(() => {
    // Utilise requestAnimationFrame pour optimiser les performances
    requestAnimationFrame(() => {
      forceReflow();
    });
  }, [forceReflow]);

  // Force le reflow lors du scroll (pour les éléments dynamiques)
  const handleScroll = useCallback(() => {
    // Force le reflow seulement si nécessaire
    if (document.body.classList.contains('mobile-reflow-fix')) {
      requestAnimationFrame(() => {
        forceReflow();
      });
    }
  }, [forceReflow]);

  // Force le reflow lors du focus (pour les formulaires)
  const handleFocus = useCallback(() => {
    requestAnimationFrame(() => {
      forceReflow();
    });
  }, []);

  // Force le reflow lors du blur (pour les formulaires)
  const handleBlur = useCallback(() => {
    requestAnimationFrame(() => {
      forceReflow();
    });
  }, []);

  useEffect(() => {
    // Force le reflow au chargement de la page
    forceReflow();

    // Ajoute les event listeners
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('focus', handleFocus, true);
    window.addEventListener('blur', handleBlur, true);

    // Force le reflow après un délai pour s'assurer que tout est chargé
    const delayedReflow = setTimeout(() => {
      forceReflow();
    }, 500);

    return () => {
      // Nettoie les event listeners
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('focus', handleFocus, true);
      window.removeEventListener('blur', handleBlur, true);
      
      // Nettoie le timeout
      clearTimeout(delayedReflow);
    };
  }, [forceReflow, handleOrientationChange, handleResize, handleScroll, handleFocus, handleBlur]);

  // Retourne les fonctions pour un usage manuel si nécessaire
  return {
    forceReflow,
    handleOrientationChange,
    handleResize,
    handleScroll,
    handleFocus,
    handleBlur
  };
};
