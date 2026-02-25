import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileNavLink from "./MobileNavLink";
import { useWizardProgress } from "@/hooks/useWizardProgress";

interface MobileNavProps {
  isEnglish: boolean;
  isHomePage: boolean;
  toggleMenu: () => void;
}

const MobileNav = ({ isEnglish, isHomePage, toggleMenu }: MobileNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { badges } = useWizardProgress('default', isEnglish);

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
      else if (path === "/mes-revenus") path = "/my-income";
      else if (path === "/depenses") path = "/expenses";
      else if (path === "/mon-budget") path = "/my-budget";
      else if (path === "/immobilier") path = "/real-estate";
      else if (path === "/planification-urgence") path = "/emergency-planning";
      else if (path === "/planification-successorale") path = "/succession-planning";
      else if (path === "/planification-depenses") path = "/expense-planning";
      else if (path === "/assistant-financier") path = "/financial-assistant";
      else if (path === "/") path = "/en";
      else path = "/en" + path;
    } else if (!toEnglish && isEnglish) {
      // Switch to French
      if (path === "/my-retirement") path = "/ma-retraite";
      else if (path === "/my-income") path = "/mes-revenus";
      else if (path === "/expenses") path = "/depenses";
      else if (path === "/my-budget") path = "/mon-budget";
      else if (path === "/real-estate") path = "/immobilier";
      else if (path === "/emergency-planning") path = "/planification-urgence";
      else if (path === "/succession-planning") path = "/planification-successorale";
      else if (path === "/expense-planning") path = "/planification-depenses";
      else if (path === "/financial-assistant") path = "/assistant-financier";
      else if (path.startsWith("/en")) path = path.replace(/^\/en/, "") || "/";
    }
    
    navigate(path + location.hash);
    toggleMenu();
  };

  // Helper to get link classes based on active state
  const getMobileLinkClasses = (path: string) => {
    const isActive = location.pathname === path;
    const baseColor = "text-mpr-navy";
    const hoverColor = "hover:text-amber-600";
    const activeColor = "text-amber-600";
    
    return `transition-colors duration-300 py-2 ${
      isActive ? `${activeColor} font-bold` : `${baseColor} ${hoverColor}`
    }`;
  };

  // Petit indicateur de statut par étape du wizard
  const renderBadge = (stepId: 'profil' | 'revenus' | 'actifs' | 'prestations' | 'depenses' | 'budget' | 'optimisations' | 'plan' | 'rapports') => {
    // @ts-ignore index signature permissive
    const b = badges ? badges[stepId] : null;
    if (!b) return null;
    const title = b.complete
      ? (isEnglish ? 'Complete' : 'Complet')
      : `${b.missingCount} ${isEnglish ? 'missing' : 'à compléter'}`;
    return (
      <span
        className={`ml-2 inline-block w-2 h-2 rounded-full ${b.complete ? 'bg-green-500' : 'bg-amber-500'}`}
        title={title}
        aria-label={title}
      />
    );
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
            {isEnglish ? "My Retirement" : "Ma Retraite"} {renderBadge('actifs')}
          </Link>
          
          {/* Revenus / Income */}
          <Link
            to={isEnglish ? "/my-income" : "/mes-revenus"}
            className={getMobileLinkClasses(isEnglish ? "/my-income" : "/mes-revenus")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Income" : "Revenus"} {renderBadge('revenus')}
          </Link>
          
          {/* Dépenses / Expenses */}
          <Link
            to={isEnglish ? "/expenses" : "/depenses"}
            className={getMobileLinkClasses(isEnglish ? "/expenses" : "/depenses")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Expenses" : "Dépenses"} {renderBadge('depenses')}
          </Link>
          
          {/* Budget */}
          <Link
            to={isEnglish ? "/my-budget" : "/mon-budget"}
            className={getMobileLinkClasses(isEnglish ? "/my-budget" : "/mon-budget")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Budget" : "Budget"} {renderBadge('budget')}
          </Link>
          
          {/* Immobilier / Real Estate */}
          <Link
            to={isEnglish ? "/real-estate" : "/immobilier"}
            className={getMobileLinkClasses(isEnglish ? "/real-estate" : "/immobilier")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Real Estate" : "Immobilier"}
          </Link>
          
          {/* Gouvernement / Government */}
          <Link
            to={isEnglish ? "/module-srg" : "/module-srg"}
            className={getMobileLinkClasses("/module-srg")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Government" : "Gouvernement"} {renderBadge('prestations')}
          </Link>
          
          {/* Section Outils / Tools */}
          <div className="py-2 border-t border-gray-200">
            <h3 className="text-sm font-bold text-mpr-interactive uppercase tracking-wide mb-2">
              {isEnglish ? "Tools" : "Outils"}
            </h3>
            
            {/* Assistant financier / Financial Assistant */}
            <Link
              to={isEnglish ? "/financial-assistant" : "/assistant-financier"}
              className={getMobileLinkClasses(isEnglish ? "/financial-assistant" : "/assistant-financier")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Financial Assistant" : "Assistant financier"}
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
            
            {/* Calculette de rendement avancée / Advanced Performance Calculator */}
            <Link
              to={isEnglish ? "/advanced-performance-calculator" : "/calculette-rendement-avancee"}
              className={getMobileLinkClasses(isEnglish ? "/advanced-performance-calculator" : "/calculette-rendement-avancee")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Advanced Performance Calculator" : "Calculette de rendement avancée"}
            </Link>
            
            {/* Modules de calcul déplacés des "Modules Avancés" */}
            <Link
              to={isEnglish ? "/ferr-optimization" : "/optimisation-ferr"}
              className={getMobileLinkClasses(isEnglish ? "/ferr-optimization" : "/optimisation-ferr")}
              onClick={toggleMenu}
            >
              {isEnglish ? "RRIF Optimization" : "Optimisation FERR"}
            </Link>
            
            <Link
              to={isEnglish ? "/celiapp" : "/celiapp"}
              className={getMobileLinkClasses("/celiapp")}
              onClick={toggleMenu}
            >
              CELIAPP
            </Link>
            
            <Link
              to={isEnglish ? "/withdrawal-sequence" : "/sequence-retrait"}
              className={getMobileLinkClasses(isEnglish ? "/withdrawal-sequence" : "/sequence-retrait")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Withdrawal Sequence" : "Séquence de Retrait"}
            </Link>
            
            <Link
              to={isEnglish ? "/healthcare-costs" : "/couts-sante"}
              className={getMobileLinkClasses(isEnglish ? "/healthcare-costs" : "/couts-sante")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Healthcare Costs" : "Coûts de Santé"}
            </Link>
            
            <Link
              to={isEnglish ? "/tax-optimization" : "/optimisation-fiscale"}
              className={getMobileLinkClasses(isEnglish ? "/tax-optimization" : "/optimisation-fiscale")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Multi-Source Tax Optimization" : "Optimisation Fiscale Multi-Sources"}
            </Link>
            
            <Link
              to={isEnglish ? "/longevity-planning" : "/planification-longevite"}
              className={getMobileLinkClasses(isEnglish ? "/longevity-planning" : "/planification-longevite")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Longevity Planning" : "Planification Longévité"}
            </Link>
            
            <Link
              to={isEnglish ? "/financial-consolidation" : "/consolidation-financiere"}
              className={getMobileLinkClasses(isEnglish ? "/financial-consolidation" : "/consolidation-financiere")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Financial Consolidation" : "Consolidation Financière"}
            </Link>
            
            <Link
              to={isEnglish ? "/progressive-retirement" : "/retraite-progressive"}
              className={getMobileLinkClasses(isEnglish ? "/progressive-retirement" : "/retraite-progressive")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Progressive Retirement" : "Retraite Progressive"}
            </Link>
            
            <Link
              to={isEnglish ? "/inflation-protection" : "/protection-inflation"}
              className={getMobileLinkClasses(isEnglish ? "/inflation-protection" : "/protection-inflation")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Inflation Protection" : "Protection Inflation"}
            </Link>
            
            <Link
              to={isEnglish ? "/rrsp-meltdown" : "/strategies-reer-meltdown"}
              className={getMobileLinkClasses(isEnglish ? "/rrsp-meltdown" : "/strategies-reer-meltdown")}
              onClick={toggleMenu}
            >
              {isEnglish ? "RRSP Meltdown Strategies" : "Stratégies REER Meltdown"}
            </Link>
            
            <Link
              to={isEnglish ? "/cpp-timing" : "/optimisation-timing-cpp"}
              className={getMobileLinkClasses(isEnglish ? "/cpp-timing" : "/optimisation-timing-cpp")}
              onClick={toggleMenu}
            >
              {isEnglish ? "CPP Timing Optimization" : "Optimisation Timing CPP"}
            </Link>

            {/* RRQ/CPP Quick Compare */}
            <Link
              to="/rrq-quick-compare"
              className={getMobileLinkClasses("/rrq-quick-compare")}
              onClick={toggleMenu}
            >
              {isEnglish ? "RRQ/CPP Quick Compare" : "Comparateur RRQ/CPP"}
            </Link>

            {/* RRQ/CPP Defer by X Months */}
            <Link
              to="/rrq-delay-simulator"
              className={getMobileLinkClasses("/rrq-delay-simulator")}
              onClick={toggleMenu}
            >
              {isEnglish ? "RRQ/CPP Defer by X Months" : "Report RRQ/CPP de X mois"}
            </Link>
            
            <Link
              to={isEnglish ? "/spending-psychology" : "/psychologie-depenses"}
              className={getMobileLinkClasses(isEnglish ? "/spending-psychology" : "/psychologie-depenses")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Spending Psychology" : "Psychologie des Dépenses"}
            </Link>
            
            <Link
              to={isEnglish ? "/dynamic-withdrawal" : "/planification-retrait-dynamique"}
              className={getMobileLinkClasses(isEnglish ? "/dynamic-withdrawal" : "/planification-retrait-dynamique")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Dynamic Withdrawal Planning" : "Planification Retrait Dynamique"}
            </Link>
            
            <Link
              to={isEnglish ? "/four-percent-rule" : "/regle-4-pourcent"}
              className={getMobileLinkClasses(isEnglish ? "/four-percent-rule" : "/regle-4-pourcent")}
              onClick={toggleMenu}
            >
              {isEnglish ? "4% Rule" : "Règle des 4 %"}
            </Link>
            
            <Link
              to={isEnglish ? "/rvdaa" : "/rvdaa"}
              className={getMobileLinkClasses("/rvdaa")}
              onClick={toggleMenu}
            >
              RVDAA
            </Link>
          </div>
          
          {/* Section Modules Éducatifs / Educational Modules */}
          <div className="py-2 border-t border-gray-200">
            <h3 className="text-sm font-bold text-mpr-interactive uppercase tracking-wide mb-2">
              {isEnglish ? "Educational Modules" : "Modules Éducatifs"}
            </h3>
            
            <Link
              to={isEnglish ? "/government-education" : "/education-gouvernementale"}
              className={getMobileLinkClasses(isEnglish ? "/government-education" : "/education-gouvernementale")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Government Education Center" : "Centre d'Éducation Gouvernementale"}
            </Link>
          </div>
          
          {/* Autres sections existantes */}
          <div className="py-2 border-t border-gray-200">
            <h3 className="text-sm font-bold text-mpr-interactive uppercase tracking-wide mb-2">
              {isEnglish ? "Analysis Tools" : "Outils d'Analyse"}
            </h3>
            
            {/* Simulateur Monte Carlo / Monte Carlo Simulator */}
            <Link
              to={isEnglish ? "/monte-carlo-simulator" : "/simulateur-monte-carlo"}
              className={getMobileLinkClasses(isEnglish ? "/monte-carlo-simulator" : "/simulateur-monte-carlo")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Monte Carlo Simulator" : "Simulateur Monte Carlo"}
            </Link>
            
            {/* Analyse de sensibilité / Sensitivity Analysis */}
            <Link
              to={isEnglish ? "/sensitivity-analysis" : "/analyse-sensibilite"}
              className={getMobileLinkClasses(isEnglish ? "/sensitivity-analysis" : "/analyse-sensibilite")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Sensitivity Analysis" : "Analyse de sensibilité"}
            </Link>
            
            {/* Comparaison de scénarios / Scenario Comparison */}
            <Link
              to={isEnglish ? "/scenario-comparison" : "/comparaison-scenarios"}
              className={getMobileLinkClasses(isEnglish ? "/scenario-comparison" : "/comparaison-scenarios")}
              onClick={toggleMenu}
            >
              {isEnglish ? "Scenario Comparison" : "Comparaison de scénarios"}
            </Link>
          </div>
          
          {/* Rapports / Reports */}
          <Link
            to={isEnglish ? "/en/retirement-reports" : "/fr/rapports-retraite"}
            className={getMobileLinkClasses(isEnglish ? "/en/retirement-reports" : "/fr/rapports-retraite")}
            onClick={toggleMenu}
          >
            {isEnglish ? "Reports" : "Rapports"} {renderBadge('rapports')}
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
