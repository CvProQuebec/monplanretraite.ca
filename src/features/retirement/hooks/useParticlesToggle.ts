import { useState, useCallback } from 'react';

/**
 * Hook pour gérer l'activation/désactivation des particules
 * Contrôle l'affichage des particules interactives
 */
export const useParticlesToggle = (initialState: boolean = true) => {
  const [areParticlesEnabled, setAreParticlesEnabled] = useState(initialState);

  const toggleParticles = useCallback(() => {
    setAreParticlesEnabled(prev => !prev);
  }, []);

  const enableParticles = useCallback(() => {
    setAreParticlesEnabled(true);
  }, []);

  const disableParticles = useCallback(() => {
    setAreParticlesEnabled(false);
  }, []);

  return {
    areParticlesEnabled,
    toggleParticles,
    enableParticles,
    disableParticles,
  };
};
