// src/features/retirement/hooks/useLanguage.tsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import { translations } from '../translations';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any; // Objet de traductions complet
  translate: (key: string) => string; // Fonction de traduction par clé
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Détection automatique de la langue
const detectLanguage = (): Language => {
  // Vérifier l'URL pour la langue
  const path = window.location.pathname;
  
  // Routes spécifiques anglaises
  if (path === '/emergency-planning' || 
      path === '/home' || 
      path === '/my-retirement' || 
      path === '/my-income' ||
      path.includes('/en/')) {
    return 'en';
  }
  
  // Routes spécifiques françaises  
  if (path === '/planification-urgence' ||
      path === '/accueil' ||
      path === '/ma-retraite' ||
      path === '/mes-revenus' ||
      path.includes('/fr/')) {
    return 'fr';
  }
  
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

  // Fonction de traduction par clé
  const translate = (key: string): string => {
    try {
      const keys = key.split('.');
      let value: any = translations[language];
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      return value || key;
    } catch (error) {
      console.warn('Erreur de traduction:', error);
      return key;
    }
  };

  // Objet de traductions complet
  const t = translations[language] || {};

  // Écouter les changements d'URL pour détecter les changements de langue
  useEffect(() => {
    const detectedLang = detectLanguage();
    if (detectedLang !== language) {
      setLanguageState(detectedLang);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translate }}>
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