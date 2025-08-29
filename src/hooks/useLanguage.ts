import { useState, useEffect } from 'react';

export interface LanguageContextType {
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
  isEnglish: boolean;
  isFrench: boolean;
}

/**
 * Hook pour la gestion de la langue de l'application
 * Détecte automatiquement la langue depuis l'URL ou utilise le français par défaut
 */
export const useLanguage = (): LanguageContextType => {
  const [language, setLanguageState] = useState<'fr' | 'en'>(() => {
    // Détection depuis l'URL
    const path = window.location.pathname;
    if (path.includes('/en/') || path.startsWith('/en')) {
      return 'en';
    }
    // Français par défaut (normes OQLF)
    return 'fr';
  });

  useEffect(() => {
    // Écouter les changements d'URL pour mise à jour automatique
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const newLang = path.includes('/en/') || path.startsWith('/en') ? 'en' : 'fr';
      if (newLang !== language) {
        setLanguageState(newLang);
      }
    };

    // Écouter les changements de navigation
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [language]);

  const setLanguage = (lang: 'fr' | 'en') => {
    setLanguageState(lang);
    
    // Optionnel: Mettre à jour l'URL si nécessaire
    const currentPath = window.location.pathname;
    let newPath = currentPath;
    
    if (lang === 'en' && !currentPath.includes('/en')) {
      newPath = `/en${currentPath}`;
    } else if (lang === 'fr' && currentPath.includes('/en')) {
      newPath = currentPath.replace('/en', '');
    }
    
    if (newPath !== currentPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  return {
    language,
    setLanguage,
    isEnglish: language === 'en',
    isFrench: language === 'fr'
  };
};

export default useLanguage;
