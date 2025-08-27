import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './features/retirement/hooks/useLanguage';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/layout/Layout';

// Nouvelles pages principales
import Accueil from './pages/Accueil';
import Home from './pages/Home';
import MaRetraite from './pages/MaRetraite';
import Revenus from './pages/Revenus';
import PlanificationUrgence from './pages/PlanificationUrgence';
import PlanificationSuccessorale from './pages/PlanificationSuccessorale';
import PlanificationDepenses from './pages/PlanificationDepenses';
import AssistantFinancier from './pages/AssistantFinancier';
import Budget from './pages/Budget';

// NOUVEAUX MODULES INTÉGRÉS
import { SRGAnalysisSection } from './features/retirement/components/SRGAnalysisSection';
import RREGOPAnalysisSection from './features/retirement/components/RREGOPAnalysisSection';
import { RealEstateOptimizationSection } from './features/retirement/components/RealEstateOptimizationSection';
import { TaxOptimizationDashboard } from './features/retirement/components/TaxOptimizationDashboard';
import { MonteCarloSimulator } from './features/retirement/components/MonteCarloSimulator';
import { SensitivityAnalysis } from './features/retirement/components/SensitivityAnalysis';
import { ScenarioComparison } from './features/retirement/components/ScenarioComparison';
import { UltimatePlanningDashboard } from './features/retirement/components/UltimatePlanningDashboard';
import ExpensesPage from './pages/ExpensesPage';
import RRQCPPAnalysis from './pages/RRQCPPAnalysis';
import ImmobilierPage from './pages/ImmobilierPage';

// Composants de test et validation
import FinalValidation from './components/FinalValidation';
import { AdvancedDemoControls } from './features/retirement/components/AdvancedDemoControls';

// Pages unifiées avec lazy loading
import UnifiedRetirementPage from './pages/UnifiedRetirementPage';

// Pages existantes (pour compatibilité) - Lazy loaded
const RetraiteEntreeFr = React.lazy(() => import('./pages/RetraiteEntreeFr'));
const RetraiteEntreeEn = React.lazy(() => import('./pages/RetraiteEntreeEn'));
const RetraiteModuleFr = React.lazy(() => import('./pages/RetraiteModuleFr'));
const RetraiteModuleEn = React.lazy(() => import('./pages/RetraiteModuleEn'));
const RetraiteModulePhase1Fr = React.lazy(() => import('./pages/RetraiteModulePhase1Fr'));
const RetraiteModulePhase1En = React.lazy(() => import('./pages/RetraiteModulePhase1En'));
import RapportsRetraiteFr from './pages/RapportsRetraiteFr';
import RetirementReportsEn from './pages/RetirementReportsEn';
import Phase2DemoPage from './pages/Phase2DemoPage';
import SauvegarderCharger from './pages/SauvegarderCharger';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Layout>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              </div>
            }>
              <Routes>
              {/* 🏠 NOUVELLES ROUTES PRINCIPALES - Navigation restructurée */}
              
              {/* Page d'accueil - "VOTRE RETRAITE, VOTRE HISTOIRE" */}
              <Route path="/" element={<Accueil />} />
              <Route path="/accueil" element={<Accueil />} />
              <Route path="/fr" element={<Accueil />} />
              <Route path="/home" element={<Home />} />
              <Route path="/en" element={<Home />} />
              
              {/* Page profil - INTÉGRÉE dans Ma Retraite */}
              {/* <Route path="/mon-profil" element={<MonProfil />} /> */}
              {/* <Route path="/my-profile" element={<MyProfile />} /> */}
              
              {/* Page retraite - "TRAVAILLER AVEC CE QU'ON A" */}
              <Route path="/ma-retraite" element={<MaRetraite />} />
              <Route path="/my-retirement" element={<MaRetraite />} />
              
              {/* Page revenus - "GÉREZ VOS SOURCES DE REVENUS" */}
              <Route path="/mes-revenus" element={<Revenus />} />
              <Route path="/my-income" element={<Revenus />} />
              
              {/* Page planification d'urgence - "PROTÉGEZ VOS PROCHES" */}
              <Route path="/planification-urgence" element={<PlanificationUrgence />} />
              <Route path="/emergency-planning" element={<PlanificationUrgence />} />
              
              {/* Page planification successorale - "ORGANISEZ VOTRE SUCCESSION" */}
              <Route path="/planification-successorale" element={<PlanificationSuccessorale />} />
              <Route path="/succession-planning" element={<PlanificationSuccessorale />} />
              
              {/* Page planification de dépenses - "OPTIMISEZ VOS ACHATS" */}
              <Route path="/planification-depenses" element={<PlanificationDepenses />} />
              <Route path="/expense-planning" element={<PlanificationDepenses />} />
              
              {/* Assistant financier personnel - "ÉVITEZ LES CATASTROPHES FINANCIÈRES" */}
              <Route path="/assistant-financier" element={<AssistantFinancier />} />
              <Route path="/financial-assistant" element={<AssistantFinancier />} />
              
              {/* Module Budget - "GÉREZ VOS FINANCES INTELLIGEMMENT" */}
              <Route path="/budget" element={<Budget />} />
              <Route path="/mon-budget" element={<Budget />} />
              <Route path="/my-budget" element={<Budget />} />
              
              {/* 🏛️ NOUVELLES ROUTES - PRESTATIONS GOUVERNEMENTALES */}
              
              {/* Module SRG (Supplément de Revenu Garanti) */}
              <Route path="/module-srg" element={<div className="p-8"><SRGAnalysisSection data={{} as any} onUpdate={() => {}} /></div>} />
              <Route path="/srg-module" element={<div className="p-8"><SRGAnalysisSection data={{} as any} onUpdate={() => {}} /></div>} />
              
              {/* Module RREGOP (Régime de Retraite Gouvernemental) */}
              <Route path="/module-rregop" element={<RREGOPAnalysisSection userPlan="professional" />} />
              <Route path="/rregop-module" element={<RREGOPAnalysisSection userPlan="professional" />} />
              
                      {/* Module RRQ/CPP */}
        <Route path="/rrq-cpp-analysis" element={<RRQCPPAnalysis />} />
        <Route path="/analyse-rrq-cpp" element={<RRQCPPAnalysis />} />
              
              {/* Module OAS/GIS */}
              <Route path="/oas-gis-analysis" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold text-gray-800">Analyse OAS/GIS</h1><p className="text-gray-600 mt-4">Module en développement</p></div>} />
              <Route path="/analyse-oas-gis" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold text-gray-800">Analyse OAS/GIS</h1><p className="text-gray-600 mt-4">Module en développement</p></div>} />
              
              {/* 🏠 NOUVELLES ROUTES - OPTIMISATION IMMOBILIÈRE */}
              
              {/* Module Immobilier */}
              <Route path="/optimisation-immobiliere" element={<RealEstateOptimizationSection userPlan="professional" />} />
              <Route path="/real-estate-optimization" element={<RealEstateOptimizationSection userPlan="professional" />} />
              
              {/* Page Immobilier - Gestion complète du patrimoine immobilier */}
              <Route path="/immobilier" element={<ImmobilierPage />} />
              <Route path="/real-estate" element={<ImmobilierPage />} />
              
              {/* 📊 NOUVELLES ROUTES - SIMULATIONS */}
              
              {/* Simulateur Monte Carlo */}
              <Route path="/simulateur-monte-carlo" element={<MonteCarloSimulator />} />
              <Route path="/monte-carlo-simulator" element={<MonteCarloSimulator />} />
              
              {/* Analyse de Sensibilité */}
              <Route path="/analyse-sensibilite" element={<SensitivityAnalysis />} />
              <Route path="/sensitivity-analysis" element={<SensitivityAnalysis />} />
              
              {/* Comparaison de Scénarios */}
              <Route path="/comparaison-scenarios" element={<ScenarioComparison />} />
              <Route path="/scenario-comparison" element={<ScenarioComparison />} />
              
              {/* 🎯 NOUVELLES ROUTES - OPTIMISATION FISCALE ET PLANIFICATION */}
              
              {/* Optimisation Fiscale */}
              <Route path="/optimisation-fiscale" element={<TaxOptimizationDashboard />} />
              <Route path="/tax-optimization" element={<TaxOptimizationDashboard />} />
              
                      {/* Planification Expert */}
        <Route path="/planification-expert" element={<UltimatePlanningDashboard />} />
        <Route path="/expert-planning" element={<UltimatePlanningDashboard />} />
        
        {/* Module de Dépenses */}
        <Route path="/depenses" element={<ExpensesPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
              
              {/* 🧪 ROUTES DE TEST ET VALIDATION */}
              
              {/* Test des contrôles de démonstration avancés */}
              <Route path="/advanced-demo-controls" element={<AdvancedDemoControls />} />
              
              
              {/* Validation finale - Dernière étape avant déploiement */}
              <Route path="/validation-finale" element={<FinalValidation />} />
              
              {/* 🌐 ROUTES BILINGUES EXISTANTES (pour compatibilité) */}
              
              {/* Routes d'entrée - Module Retirement */}
              <Route path="/fr/retraite-entree" element={<RetraiteEntreeFr />} />
              <Route path="/en/retirement-entry" element={<RetraiteEntreeEn />} />
              
              {/* Routes du module complet - Module Retirement UNIFIÉES */}
              <Route path="/fr/retraite" element={<UnifiedRetirementPage />} />
              <Route path="/en/retirement" element={<UnifiedRetirementPage />} />
              
              <Route path="/fr/retraite-module" element={<RetraiteModuleFr />} />
              <Route path="/en/retirement-module" element={<RetraiteModuleEn />} />
              
              {/* Routes pour le module retraite Phase 1 */}
              <Route path="/fr/retraite-module-phase1" element={<RetraiteModulePhase1Fr />} />
              <Route path="/en/retirement-module-phase1" element={<RetraiteModulePhase1En />} />
              
              {/* Routes Rapports de Retraite */}
              <Route path="/fr/rapports-retraite" element={<RapportsRetraiteFr />} />
              <Route path="/en/retirement-reports" element={<RetirementReportsEn />} />
              
              {/* Route Phase 2 Demo */}
              <Route path="/phase2-demo" element={<Phase2DemoPage />} />
              
              {/* Routes Sauvegarder/Charger */}
              <Route path="/fr/sauvegarder-charger" element={<SauvegarderCharger />} />
              <Route path="/en/save-load" element={<SauvegarderCharger />} />
              
              {/* Route Admin */}
              <Route path="/admin" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1><p className="text-gray-600 mt-4">Administration panel - Coming soon</p></div>} />
              
              {/* 🔄 REDIRECTIONS INTELLIGENTES */}
              
              {/* Redirection des anciennes routes vers la nouvelle structure */}
              <Route path="/fr" element={<Accueil />} />
              <Route path="/en" element={<Accueil />} />
              
              {/* Redirection par défaut vers la nouvelle page d'accueil */}
              <Route path="*" element={<Accueil />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
