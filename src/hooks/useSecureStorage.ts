import { useState, useEffect, useCallback } from 'react';
import { secureStorage } from '../lib/secureStorage';

export function useSecureStorage<T = any>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T | null>(() => {
    // Initialisation avec la valeur sécurisée
    return secureStorage.getItem<T>(key) ?? defaultValue ?? null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour mettre à jour la valeur
  const updateValue = useCallback((newValue: T) => {
    try {
      setIsLoading(true);
      setError(null);
      
      secureStorage.setItem(key, newValue);
      setValue(newValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur lors de la sauvegarde sécurisée:', err);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  // Fonction pour supprimer la valeur
  const removeValue = useCallback(() => {
    try {
      secureStorage.removeItem(key);
      setValue(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur lors de la suppression:', err);
    }
  }, [key]);

  // Fonction pour recharger la valeur depuis le stockage
  const refreshValue = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      
      const storedValue = secureStorage.getItem<T>(key);
      setValue(storedValue ?? defaultValue ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur lors du rechargement:', err);
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue]);

  // Écoute les changements dans le localStorage (pour synchronisation entre onglets)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `secure_${key}` && e.newValue !== null) {
        try {
          const newValue = secureStorage.getItem<T>(key);
          setValue(newValue ?? defaultValue ?? null);
        } catch (err) {
          console.error('Erreur lors de la synchronisation:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue]);

  return {
    value,
    setValue: updateValue,
    removeValue,
    refreshValue,
    isLoading,
    error,
    hasValue: secureStorage.hasItem(key)
  };
}

// Hook spécialisé pour les formulaires
export function useSecureFormStorage<T = any>(key: string, defaultValue?: T) {
  const storage = useSecureStorage<T>(key, defaultValue);
  
  const autoSave = useCallback((data: T) => {
    storage.setValue(data);
  }, [storage]);

  const clearForm = useCallback(() => {
    storage.removeValue();
  }, [storage]);

  return {
    ...storage,
    autoSave,
    clearForm
  };
}

// Hook pour les configurations sensibles
export function useSecureConfig<T = any>(key: string, defaultValue?: T) {
  const storage = useSecureStorage<T>(key, defaultValue);
  
  const updateConfig = useCallback((updates: Partial<T>) => {
    const currentValue = storage.value ?? defaultValue ?? {} as T;
    const newValue = { ...currentValue, ...updates };
    storage.setValue(newValue);
  }, [storage, defaultValue]);

  return {
    ...storage,
    updateConfig
  };
} 