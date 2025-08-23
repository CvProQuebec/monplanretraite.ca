import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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

  const handleLanguageSwitch = (lang: 'fr' | 'en') => {
    const currentPath = location.pathname;
    let newPath = '/';

    if (lang === 'en') {
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
    } else { // lang === 'fr'
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
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(
            "gap-1",
            "bg-transparent text-blue-900 hover:text-amber-600 data-[state=open]:text-amber-600"
          )}>
            <Globe className="h-4 w-4" />
            <span className="text-sm">
              {isEnglish ? "EN" : "FR"}
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <button 
                onClick={() => handleLanguageSwitch('fr')}
                className={cn(
                  "block p-2 rounded-md transition-colors w-full text-left text-gray-900",
                  "hover:bg-gray-100",
                  isEnglish ? "text-gray-600" : "font-medium text-gray-900"
                )}
              >
                FR
              </button>
              <button 
                onClick={() => handleLanguageSwitch('en')}
                className={cn(
                  "block p-2 rounded-md transition-colors w-full text-left text-gray-900",
                  "hover:bg-gray-100",
                  isEnglish ? "font-medium text-gray-900" : "text-gray-600"
                )}
              >
                EN
              </button>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default LanguageSelector;
