import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileNavLink from "./MobileNavLink";

interface MobileNavProps {
  isEnglish: boolean;
  isHomePage: boolean;
  toggleMenu: () => void;
}

const MobileNav = ({ isEnglish, isHomePage, toggleMenu }: MobileNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper for creating anchor links
  const getAnchorLink = (anchor: string) => {
    if (isEnglish) {
      return isHomePage ? `#${anchor}` : `/en#${anchor}`;
    }
    return isHomePage ? `#${anchor}` : `/fr#${anchor}`;
  };

  const handleLanguageSwitch = (toEnglish: boolean) => {
    let path = location.pathname;
    
    if (toEnglish && !isEnglish) {
      // Switch to English
      if (path === "/calculroi") path = "/en/roicalcul";
      else if (path === "/consultation") path = "/en/consultation";
      else if (path === "/formation") path = "/en/formation";
      else if (path === "/retraite") path = "/en/retirement";
      else if (path === "/") path = "/en";
      else path = "/en" + path;
    } else if (!toEnglish && isEnglish) {
      // Switch to French
      if (path === "/en/roicalcul") path = "/calculroi";
      else if (path === "/en/consultation") path = "/consultation";
      else if (path === "/en/formation") path = "/formation";
      else if (path === "/en/retirement") path = "/retraite";
      else if (path.startsWith("/en")) path = path.replace(/^\/en/, "") || "/";
    }
    
    navigate(path + location.hash);
    toggleMenu();
  };

  // Helper to get link classes based on active state
  const getMobileLinkClasses = (path: string) => {
    const isActive = location.pathname === path;
    const baseColor = "text-blue-900";
    const hoverColor = "hover:text-amber-600";
    const activeColor = "text-amber-600";
    
    return `transition-colors duration-300 py-2 ${
      isActive ? `${activeColor} font-bold` : `${baseColor} ${hoverColor}`
    }`;
  };

  return (
    <div className={`md:hidden absolute top-full left-0 w-full animate-fade-in bg-white/95 backdrop-blur-lg shadow-lg border-t border-gray-200 z-50`}>
      <div className="container-custom py-4">
        <nav className="flex flex-col space-y-3 py-4 max-h-[70vh] overflow-y-auto">
          <MobileNavLink href={isEnglish ? (isHomePage ? "#" : "/en") : (isHomePage ? "#" : "/fr")} onClick={toggleMenu}>
            {isEnglish ? "Home" : "Accueil"}
          </MobileNavLink>
          
          <Link
            to={isEnglish ? "/en/solutions" : "/fr/solutions"}
            className={getMobileLinkClasses(isEnglish ? "/en/solutions" : "/fr/solutions")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Solutions" : "Solutions"}
          </Link>
          
          {/* Sur mesure / Custom */}
          <Link
            to={isEnglish ? "/en/M2M" : "/fr/surMesure"}
            className={getMobileLinkClasses(isEnglish ? "/en/M2M" : "/fr/surMesure")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Custom" : "Sur mesure"}
          </Link>
          
          {/* Assistants */}
          <Link
            to={isEnglish ? "/en/assistants" : "/fr/assistants"}
            className={getMobileLinkClasses(isEnglish ? "/en/assistants" : "/fr/assistants")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Assistants" : "Assistants"}
          </Link>
          
          <Link
            to={isEnglish ? "/en/demo" : "/fr/demo"}
            className={getMobileLinkClasses(isEnglish ? "/en/demo" : "/fr/demo")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Demo" : "Démo"}
          </Link>
          
          {/* Rentabilité et Évaluation supprimées du menu - disponibles via footer */}
          {/* Removed Benefits - not in desktop nav */}
          <Link
            to={isEnglish ? "/en/content-media" : "/fr/contenu-media"}
            className={getMobileLinkClasses(isEnglish ? "/en/content-media" : "/fr/contenu-media")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Media" : "Média"}
          </Link>
          <Link
            to={isEnglish ? "/en/recrutementrh" : "/fr/recrutementrh"}
            className={getMobileLinkClasses(isEnglish ? "/en/recrutementrh" : "/fr/recrutementrh")}
            onClick={toggleMenu}
          >
            {isEnglish ? "HR Solution" : "RH"}
          </Link>
          
          <Link
            to={isEnglish ? "/en/training" : "/fr/formation"}
            className={getMobileLinkClasses(isEnglish ? "/en/training" : "/fr/formation")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Training docs" : "Formation"}
          </Link>
          <Link
            to={isEnglish ? "/en/templates" : "/fr/gabarits"}
            className={getMobileLinkClasses(isEnglish ? "/en/templates" : "/fr/gabarits")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Templates" : "Gabarits"}
          </Link>
          
          {/* About */}
          <Link
            to={isEnglish ? "/en/about" : "/fr/a-propos"}
            className={getMobileLinkClasses(isEnglish ? "/en/about" : "/fr/a-propos")}
            onClick={toggleMenu}
          >
            {isEnglish ? "About" : "À propos"}
          </Link>
          
          {/* Retraite intégré dans la navigation principale */}
          <Link
            to={isEnglish ? "/en/retirement" : "/fr/retraite"}
            className={getMobileLinkClasses(isEnglish ? "/en/retirement" : "/fr/retraite")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Retirement" : "Retraite"}
          </Link>
          
          {/* Language Mobile Toggle */}
          <div className="flex space-x-2 pt-4 border-t border-gray-200">
            <Button 
              variant={!isEnglish ? "default" : "outline"}
              size="sm"
              className={!isEnglish ? "bg-amber-600 hover:bg-amber-700 text-white w-1/2" : "w-1/2 border-amber-600 text-amber-600 hover:bg-amber-50"}
              onClick={() => handleLanguageSwitch(false)}
            >
              Français
            </Button>
            <Button 
              variant={isEnglish ? "default" : "outline"}
              size="sm"
              className={isEnglish ? "bg-amber-600 hover:bg-amber-700 text-white w-1/2" : "w-1/2 border-amber-600 text-amber-600 hover:bg-amber-50"}
              onClick={() => handleLanguageSwitch(true)}
            >
              English
            </Button>
          </div>
          {/* Admin at the very end, only for French */}
          {!isEnglish && (
            <div className="pt-2 border-t border-gray-200">
              <Link 
                to="/admin" 
                className={`${getMobileLinkClasses("/admin")} text-sm opacity-70`}
                onClick={toggleMenu}
              >
                Admin
              </Link>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
