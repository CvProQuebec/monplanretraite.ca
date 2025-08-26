import React, { useEffect } from 'react';

interface MobileReflowFixProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Composant utilitaire pour corriger les problèmes de reflow mobile
 * Spécialement conçu pour Samsung S23 Ultra et autres appareils Android
 */
const MobileReflowFix: React.FC<MobileReflowFixProps> = ({ children, className = '' }) => {
  useEffect(() => {
    // Force le reflow au chargement de la page
    const forceReflow = () => {
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
    };

    // Force le reflow au chargement
    forceReflow();

    // Force le reflow lors du changement d'orientation
    const handleOrientationChange = () => {
      document.body.classList.add('orientation-change');
      setTimeout(() => {
        document.body.classList.remove('orientation-change');
      }, 500);
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    // Force le reflow lors du redimensionnement
    const handleResize = () => {
      forceReflow();
    };

    window.addEventListener('resize', handleResize);

    // Force le reflow lors du scroll (pour les éléments dynamiques)
    const handleScroll = () => {
      // Force le reflow seulement si nécessaire
      if (document.body.classList.contains('mobile-reflow-fix')) {
        requestAnimationFrame(() => {
          forceReflow();
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`mobile-reflow-fix gpu-accelerated ${className}`}>
      {children}
    </div>
  );
};

export default MobileReflowFix;
