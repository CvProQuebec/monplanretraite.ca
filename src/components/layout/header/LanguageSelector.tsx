import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/features/retirement/hooks/useLanguage";

interface LanguageSelectorProps {
  isEnglish: boolean;
}

const routeMapping: { [key: string]: string } = {
  // FR -> EN
  "/": "/en",
  "/accueil": "/home",
  "/mon-profil": "/my-profile",
  "/ma-retraite": "/my-retirement",
  "/mes-revenus": "/my-income",
  "/fr": "/en",
  "/fr/retraite": "/en/retirement",
  "/fr/retraite-entree": "/en/retirement-entry",
  "/fr/retraite-module": "/en/retirement-module",
  "/fr/retraite-module-phase1": "/en/retirement-module-phase1",
  "/fr/rapports-retraite": "/en/retirement-reports",
  "/fr/sauvegarder-charger": "/en/save-load",
  
  // EN -> FR
  "/en": "/fr",
  "/home": "/accueil",
  "/my-profile": "/mon-profil",
  "/my-retirement": "/ma-retraite",
  "/my-income": "/mes-revenus",
  "/en/retirement": "/fr/retraite",
  "/en/retirement-entry": "/fr/retraite-entree",
  "/en/retirement-module": "/fr/retraite-module",
  "/en/retirement-module-phase1": "/fr/retraite-module-phase1",
  "/en/retirement-reports": "/fr/rapports-retraite",
  "/en/save-load": "/fr/sauvegarder-charger",
};

const LanguageSelector = ({ isEnglish }: LanguageSelectorProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  const handleLanguageToggle = () => {
    const newLang = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLang);
    
    // Navigation basée sur le mapping des routes
    const currentPath = location.pathname;
    let newPath = '/';

    if (newLang === 'en') {
      if (currentPath.startsWith('/en')) {
        newPath = currentPath;
      } else if (routeMapping[currentPath]) {
        newPath = routeMapping[currentPath];
      } else if (currentPath.startsWith('/fr/')) {
        newPath = '/en' + currentPath.slice(3);
      } else if (currentPath === '/fr') {
        newPath = '/en';
      } else {
        newPath = '/en';
      }
    } else { // newLang === 'fr'
      if (!currentPath.startsWith('/en')) {
        newPath = currentPath;
      } else {
        // Cherche dans le mapping
        const matchingFrenchPath = Object.keys(routeMapping).find(
          (key) => routeMapping[key] === currentPath
        );
        if (matchingFrenchPath) {
          newPath = matchingFrenchPath;
        } else if (currentPath.startsWith('/en/')) {
          newPath = '/fr' + currentPath.slice(3);
        } else if (currentPath === '/en') {
          newPath = '/fr';
        } else {
          newPath = '/fr';
        }
      }
    }
    navigate(newPath);
  };

  return (
    <button
      onClick={handleLanguageToggle}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
        "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200",
        "border border-blue-200 hover:border-blue-300",
        "text-blue-900 hover:text-blue-700",
        "shadow-sm hover:shadow-md",
        "transform hover:scale-105 active:scale-95"
      )}
      title={language === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium text-sm">
        {language === 'fr' ? 'FR' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSelector;