// src/features/retirement/hooks/useLanguage.tsx
import React, { useState, useEffect, createContext, useContext } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Détection automatique de la langue
const detectLanguage = (): Language => {
  // Vérifier l'URL pour la langue
  const path = window.location.pathname;
  if (path.includes('/en/')) return 'en';
  if (path.includes('/fr/')) return 'fr';
  
  // Vérifier le localStorage
  const saved = localStorage.getItem('retirement-language');
  if (saved === 'en' || saved === 'fr') return saved;
  
  // Détecter la langue du navigateur
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('en')) return 'en';
  
  // Par défaut français
  return 'fr';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(detectLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('retirement-language', lang);
    
    // Mettre à jour l'URL de manière simple
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(fr|en)\//, '/');
    const newPath = `/${lang}${pathWithoutLang}`;
    
    // Utiliser window.history pour éviter les erreurs de React Router
    window.history.replaceState({}, '', newPath);
  };

  // Fonction de traduction simplifiée
  const t = (key: string): string => {
    try {
      // Import dynamique des traductions
      const translations = require('../translations').translations[language];
      const keys = key.split('.');
      let value: any = translations;
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      return value || key;
    } catch (error) {
      console.warn('Erreur de traduction:', error);
      return key; // Retourner la clé si les traductions ne sont pas disponibles
    }
  };

  // Écouter les changements d'URL pour détecter les changements de langue
  useEffect(() => {
    const detectedLang = detectLanguage();
    if (detectedLang !== language) {
      setLanguageState(detectedLang);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Hook simplifié pour obtenir juste la langue
export const useCurrentLanguage = (): Language => {
  const { language } = useLanguage();
  return language;
};

// Hook pour changer de langue
export const useLanguageSwitcher = () => {
  const { setLanguage } = useLanguage();
  return setLanguage;
};