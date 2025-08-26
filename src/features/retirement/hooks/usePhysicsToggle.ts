import { useState, useCallback } from 'react';

/**
 * Hook pour gérer l'activation/désactivation de la physique
 * Contrôle les simulations physiques dans l'interface
 */
export const usePhysicsToggle = (initialState: boolean = false) => {
  const [isPhysicsEnabled, setIsPhysicsEnabled] = useState(initialState);

  const togglePhysics = useCallback(() => {
    setIsPhysicsEnabled(prev => !prev);
  }, []);

  const enablePhysics = useCallback(() => {
    setIsPhysicsEnabled(true);
  }, []);

  const disablePhysics = useCallback(() => {
    setIsPhysicsEnabled(false);
  }, []);

  return {
    isPhysicsEnabled,
    togglePhysics,
    enablePhysics,
    disablePhysics,
  };
};
