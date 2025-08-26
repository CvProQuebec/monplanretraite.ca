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
      if (path === "/ma-retraite") path = "/my-retirement";
      else if (path === "/mon-profil") path = "/my-profile";
      else if (path === "/mes-revenus") path = "/my-income";
      else if (path === "/planification-urgence") path = "/emergency-planning";
      else if (path === "/planification-successorale") path = "/succession-planning";
      else if (path === "/planification-depenses") path = "/expense-planning";
      else if (path === "/assistant-financier") path = "/financial-assistant";
      else if (path === "/mon-budget") path = "/my-budget";
      else if (path === "/") path = "/en";
      else path = "/en" + path;
    } else if (!toEnglish && isEnglish) {
      // Switch to French
      if (path === "/my-retirement") path = "/ma-retraite";
      else if (path === "/my-profile") path = "/mon-profil";
      else if (path === "/my-income") path = "/mes-revenus";
      else if (path === "/emergency-planning") path = "/planification-urgence";
      else if (path === "/succession-planning") path = "/planification-successorale";
      else if (path === "/expense-planning") path = "/planification-depenses";
      else if (path === "/financial-assistant") path = "/assistant-financier";
      else if (path === "/my-budget") path = "/mon-budget";
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
          
          {/* Ma Retraite / My Retirement */}
          <Link
            to={isEnglish ? "/my-retirement" : "/ma-retraite"}
            className={getMobileLinkClasses(isEnglish ? "/my-retirement" : "/ma-retraite")}
            onClick={toggleMenu}
          >
            {isEnglish ? "My Retirement" : "Ma Retraite"}
          </Link>
          
          {/* Mon Profil / My Profile */}
          <Link
            to={isEnglish ? "/my-profile" : "/mon-profil"}
            className={getMobileLinkClasses(isEnglish ? "/my-profile" : "/mon-profil")}
            onClick={toggleMenu}
          >
            {isEnglish ? "My Profile" : "Mon Profil"}
          </Link>
          
          {/* Mes Revenus / My Income */}
          <Link
            to={isEnglish ? "/my-income" : "/mes-revenus"}
            className={getMobileLinkClasses(isEnglish ? "/my-income" : "/mes-revenus")}
            onClick={toggleMenu}
          >
            {isEnglish ? "My Income" : "Mes Revenus"}
          </Link>
          
          {/* Planification d'urgence / Emergency Planning */}
          <Link
            to={isEnglish ? "/emergency-planning" : "/planification-urgence"}
            className={getMobileLinkClasses(isEnglish ? "/emergency-planning" : "/planification-urgence")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Emergency Planning" : "Planification d'urgence"}
          </Link>
          
          {/* Planification successorale / Succession Planning */}
          <Link
            to={isEnglish ? "/succession-planning" : "/planification-successorale"}
            className={getMobileLinkClasses(isEnglish ? "/succession-planning" : "/planification-successorale")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Succession Planning" : "Planification successorale"}
          </Link>
          
          {/* Planification de dépenses / Expense Planning */}
          <Link
            to={isEnglish ? "/expense-planning" : "/planification-depenses"}
            className={getMobileLinkClasses(isEnglish ? "/expense-planning" : "/planification-depenses")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Expense Planning" : "Planification de dépenses"}
          </Link>
          
          {/* Assistant financier / Financial Assistant */}
          <Link
            to={isEnglish ? "/financial-assistant" : "/assistant-financier"}
            className={getMobileLinkClasses(isEnglish ? "/financial-assistant" : "/assistant-financier")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Financial Assistant" : "Assistant financier"}
          </Link>
          
          {/* Budget */}
          <Link
            to={isEnglish ? "/my-budget" : "/mon-budget"}
            className={getMobileLinkClasses(isEnglish ? "/my-budget" : "/mon-budget")}
            onClick={toggleMenu}
          >
            {isEnglish ? "My Budget" : "Mon Budget"}
          </Link>
          
          {/* Module Retraite / Retirement Module */}
          <Link
            to={isEnglish ? "/en/retirement-module" : "/fr/retraite-module"}
            className={getMobileLinkClasses(isEnglish ? "/en/retirement-module" : "/fr/retraite-module")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Retirement Module" : "Module Retraite"}
          </Link>
          
          {/* Rapports / Reports */}
          <Link
            to={isEnglish ? "/en/retirement-reports" : "/fr/rapports-retraite"}
            className={getMobileLinkClasses(isEnglish ? "/en/retirement-reports" : "/fr/rapports-retraite")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Reports" : "Rapports"}
          </Link>
          
          {/* Sauvegarder/Charger / Save/Load */}
          <Link
            to={isEnglish ? "/en/save-load" : "/fr/sauvegarder-charger"}
            className={getMobileLinkClasses(isEnglish ? "/en/save-load" : "/fr/sauvegarder-charger")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Save/Load" : "Sauvegarder/Charger"}
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
