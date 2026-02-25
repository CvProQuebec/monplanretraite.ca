import React from "react";
import { Link, useLocation } from "react-router-dom";
import NavLink from "./NavLink";
import LanguageSelector from "./LanguageSelector";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DesktopNavProps {
  isEnglish: boolean;
  isHomePage: boolean;
}

const DesktopNav = ({ isEnglish, isHomePage }: DesktopNavProps) => {
  const location = useLocation();

  // Helper to check if current page is active
  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  // Base classes for navigation links
  const getNavLinkClasses = (path?: string) => {
    const isActive = path ? isActivePage(path) : false;
    const baseColor = "text-mpr-navy";
    const hoverColor = "hover:text-amber-600";
    const activeColor = "text-amber-600";
    const afterBg = "after:bg-amber-600";
    
    return `whitespace-nowrap transition-colors duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${
      isActive 
        ? `${activeColor} font-bold ${afterBg} after:scale-x-100` 
        : `${baseColor} ${hoverColor} ${afterBg}`
    }`;
  };

  return (
    <div className="hidden md:flex items-center space-x-2">
      <ScrollArea className="max-w-4xl">
        <nav className="flex items-center space-x-6 pb-2">
          <NavLink href={isEnglish ? (isHomePage ? "#" : "/en") : (isHomePage ? "#" : "/fr")} className={"text-mpr-navy hover:text-amber-600"}>
            {isEnglish ? "Home" : "Accueil"}
          </NavLink>
          
          <Link
                          to={isEnglish ? "/en/solutions" : "/fr/solutions"}
              className={getNavLinkClasses(isEnglish ? "/en/solutions" : "/fr/solutions")}
            >
              {isEnglish ? "Solutions" : "Solutions"}
          </Link>
          
          <Link
            to={isEnglish ? "/en/M2M" : "/fr/surMesure"}
            className={getNavLinkClasses(isEnglish ? "/en/M2M" : "/fr/surMesure")}
          >
            {isEnglish ? "Custom" : "Sur mesure"}
          </Link>
          
          <Link
            to={isEnglish ? "/en/demo" : "/fr/demo"}
            className={getNavLinkClasses(isEnglish ? "/en/demo" : "/fr/demo")}
          >
            {isEnglish ? "Demo" : "Démo"}
          </Link>
          
          <Link
            to={isEnglish ? "/en/assistants" : "/fr/assistants"}
            className={getNavLinkClasses(isEnglish ? "/en/assistants" : "/fr/assistants")}
          >
            {isEnglish ? "Assistants" : "Assistants"}
          </Link>
          
          {/* Rentabilité et Évaluation supprimées du menu - disponibles via footer */}
          {/* ROI masqué temporairement */}
          {/* <Link
            to={isEnglish ? "/en/roi" : "/roi"}
            className={getNavLinkClasses(isEnglish ? "/en/roi" : "/roi")}
          >
            ROI
          </Link> */}

          <Link
            to={isEnglish ? "/en/content-media" : "/fr/contenu-media"}
            className={getNavLinkClasses(isEnglish ? "/en/content-media" : "/fr/contenu-media")}
          >
            {isEnglish ? "Media" : "Média"}
          </Link>
          <Link
            to={isEnglish ? "/en/recrutementrh" : "/fr/recrutementrh"}
            className={getNavLinkClasses(isEnglish ? "/en/recrutementrh" : "/fr/recrutementrh")}
          >
            {isEnglish ? "HR Solution" : "RH"}
          </Link>
          
          <Link
            to={isEnglish ? "/en/training" : "/fr/formation"}
            className={getNavLinkClasses(isEnglish ? "/en/training" : "/fr/formation")}
          >
            {isEnglish ? "Training" : "Formation"}
          </Link>
          <Link
            to={isEnglish ? "/en/templates" : "/fr/gabarits"}
            className={getNavLinkClasses(isEnglish ? "/en/templates" : "/fr/gabarits")}
          >
            {isEnglish ? "Templates" : "Gabarits"}
          </Link>
          <Link
            to={isEnglish ? "/en/about" : "/fr/a-propos"}
            className={getNavLinkClasses(isEnglish ? "/en/about" : "/fr/a-propos")}
          >
            {isEnglish ? "About" : "À propos"}
          </Link>
          
          {/* Retraite intégré dans la navigation principale */}
          <Link
            to={isEnglish ? "/en/retirement" : "/fr/retraite"}
            className={getNavLinkClasses(isEnglish ? "/en/retirement" : "/fr/retraite")}
          >
            {isEnglish ? "Retirement" : "Retraite"}
          </Link>
        </nav>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      {/* Language Selector */}
      <LanguageSelector isEnglish={isEnglish} />
      
      {/* Admin moved to the very end, only for French */}
      {!isEnglish && (
        <Link 
          to="/admin" 
          className={getNavLinkClasses("/admin")}
        >
          Admin
        </Link>
      )}
    </div>
  );
};

export default DesktopNav;