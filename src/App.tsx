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

// NOUVEAUX MODULES PHASE 3
import { FourPercentRuleModule } from './components/ui/FourPercentRuleModule';
import { OptimalAllocationModule } from './components/ui/OptimalAllocationModule';
import { ExcessLiquidityDetector } from './components/ui/ExcessLiquidityDetector';
import { InflationProtectionCenter } from './components/ui/InflationProtectionCenter';
import { BehavioralBiasEducator } from './components/ui/BehavioralBiasEducator';

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
        
        {/* 🚀 NOUVEAUX MODULES PHASE 1, 2 ET 3 */}
        
        {/* Phase 1 - Modules Essentiels */}
        <Route path="/module-celi-succession" element={
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Module Succession CÉLI</h1>
              <p className="text-gray-600 mb-8">Optimisez la transmission de votre CÉLI selon les conseils d'experts.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Points Clés:</h2>
                <ul className="space-y-2 text-blue-800">
                  <li>• Nommez un titulaire successeur pour éviter les taxes</li>
                  <li>• Évitez les erreurs coûteuses de désignation</li>
                  <li>• Maximisez la transmission tax-free</li>
                  <li>• Protégez contre les frais d'homologation</li>
                </ul>
              </div>
            </div>
          </div>
        } />
        
        <Route path="/calculateur-impact-fiscal-65" element={
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Calculateur Impact Fiscal à 65 ans</h1>
              <p className="text-gray-600 mb-8">Découvrez les économies fiscales automatiques à 65 ans.</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-900 mb-4">Économies Potentielles:</h2>
                <ul className="space-y-2 text-green-800">
                  <li>• Crédit d'âge fédéral et provincial</li>
                  <li>• Crédit pour revenu de pension (2000$ premiers)</li>
                  <li>• Fractionnement du revenu de pension</li>
                  <li>• Réduction d'impôt de 1600$+ par année</li>
                </ul>
              </div>
            </div>
          </div>
        } />
        
        <Route path="/tableau-bord-10-conseils" element={
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Tableau de Bord - 10 Conseils Essentiels</h1>
              <p className="text-gray-600 mb-8">Suivez votre progression sur les 10 conseils cruciaux pour la retraite.</p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-orange-900 mb-4">Conseils Intégrés:</h2>
                <ul className="space-y-2 text-orange-800">
                  <li>• Connaître ses dépenses mensuelles</li>
                  <li>• Être libre de dettes</li>
                  <li>• Consolider ses actifs</li>
                  <li>• Automatiser les retraits</li>
                  <li>• Et 6 autres conseils essentiels</li>
                </ul>
              </div>
            </div>
          </div>
        } />
        
        {/* Phase 2 - Optimisation Avancée */}
        <Route path="/module-consolidation-actifs" element={
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Module Consolidation d'Actifs</h1>
              <p className="text-gray-600 mb-8">Simplifiez et optimisez la gestion de vos placements.</p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-purple-900 mb-4">Avantages:</h2>
                <ul className="space-y-2 text-purple-800">
                  <li>• Réduction des frais de gestion</li>
                  <li>• Simplification administrative</li>
                  <li>• Meilleur suivi de performance</li>
                  <li>• Économies de 0.5-2% par année</li>
                </ul>
              </div>
            </div>
          </div>
        } />
        
        <Route path="/module-coussin-liquidites" element={
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Module Coussin de Liquidités</h1>
              <p className="text-gray-600 mb-8">Protégez-vous contre la volatilité avec la stratégie bucket.</p>
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-cyan-900 mb-4">Stratégie Bucket:</h2>
                <ul className="space-y-2 text-cyan-800">
                  <li>• 3-5 ans de liquidités protégées</li>
                  <li>• Éviter de vendre en baisse de marché</li>
                  <li>• Maintenir le style de vie désiré</li>
                  <li>• Réduire le stress financier</li>
                </ul>
              </div>
            </div>
          </div>
        } />
        
        <Route path="/centre-education-fiscale" element={
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Centre d'Éducation Fiscale</h1>
              <p className="text-gray-600 mb-8">Maîtrisez les stratégies fiscales pour la retraite.</p>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-indigo-900 mb-4">Sujets Couverts:</h2>
                <ul className="space-y-2 text-indigo-800">
                  <li>• Fractionnement du revenu</li>
                  <li>• Optimisation des retraits</li>
                  <li>• Crédits d'impôt disponibles</li>
                  <li>• Planification successorale fiscale</li>
                </ul>
              </div>
            </div>
          </div>
        } />
        
        {/* Phase 3 - Optimisation Experte */}
        <Route path="/module-regle-4-pourcent" element={
          <div className="p-8">
            <FourPercentRuleModule />
          </div>
        } />
        
        <Route path="/module-allocation-optimale" element={
          <div className="p-8">
            <OptimalAllocationModule userPlan="professional" />
          </div>
        } />
        
        <Route path="/detecteur-liquidites-excessives" element={
          <div className="p-8">
            <ExcessLiquidityDetector userPlan="professional" />
          </div>
        } />
        
        <Route path="/centre-protection-inflation" element={
          <div className="p-8">
            <InflationProtectionCenter userPlan="professional" />
          </div>
        } />
        
        <Route path="/educateur-biais-comportementaux" element={
          <div className="p-8">
            <BehavioralBiasEducator userPlan="professional" />
          </div>
        } />
              
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
