import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './features/retirement/hooks/useLanguage';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import SeniorsLoadingSpinner from './components/SeniorsLoadingSpinner';
import BackupBootstrap from './components/backup/BackupBootstrap';
import BackupManagerPanel from './components/backup/BackupManagerPanel';

// Nouvelles pages principales
import Accueil from './pages/Accueil';
import Home from './pages/Home';
const MaRetraite = React.lazy(() => import('./pages/MaRetraite'));
const MaRetraiteWithDashboard = React.lazy(() => import('./pages/MaRetraiteWithDashboard'));
const Revenus = React.lazy(() => import('./pages/Revenus'));
const PlanificationUrgence = React.lazy(() => import('./pages/PlanificationUrgence'));
const PlanificationSuccessorale = React.lazy(() => import('./pages/PlanificationSuccessorale'));
const PlanificationDepenses = React.lazy(() => import('./pages/PlanificationDepenses'));
const AssistantFinancier = React.lazy(() => import('./pages/AssistantFinancier'));
const SeniorsGuidedExperience = React.lazy(() => import('./components/SeniorsGuidedExperience'));
const Budget = React.lazy(() => import('./pages/Budget'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const ApplyBenefitsAge = React.lazy(() => import('./pages/ApplyBenefitsAge'));
const AllToolsPage = React.lazy(() => import('./pages/AllToolsPage'));

// Module MVP Hypothèses de Calcul
const SimpleAssumptionsPage = React.lazy(() => import('./pages/SimpleAssumptionsPage'));

/* Blog pages */
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const OptimiserTransmissionCeli = React.lazy(() => import('./pages/blog/OptimiserTransmissionCeli'));
const BlogIndex = React.lazy(() => import('./pages/blog/BlogIndex'));
const BlogPost = React.lazy(() => import('./pages/blog/BlogPost'));
const BlogHome = React.lazy(() => import('./pages/blog/BlogHome'));
const CategoryPage = React.lazy(() => import('./pages/blog/CategoryPage'));
const EssentialsPage = React.lazy(() => import('./pages/blog/EssentialsPage'));
const ToolsPage = React.lazy(() => import('./pages/blog/ToolsPage'));
import { BlogRoutes } from './routes/blogRoutes';
import { MainRoutesHome } from './routes/mainRoutes';
import { MainRoutesCore } from './routes/mainRoutesCore';
import { GovernmentRoutes } from './routes/governmentRoutes';
import ReportsRoutes from './routes/reportsRoutes';
import { LabsRoutes } from './routes/labsRoutes';
import { RetirementRoutes } from './routes/retirementRoutes';
import { MarketingRoutes } from './routes/marketingRoutes';
import MarketingExtrasRoutes from './routes/marketingExtrasRoutes';

// NOUVEAUX MODULES INTÉGRÉS - Lazy loading pour performance seniors
const SRGAnalysisSection = React.lazy(() => import('./features/retirement/components/SRGAnalysisSection').then(module => ({ default: module.SRGAnalysisSection })));
const RREGOPAnalysisSection = React.lazy(() => import('./features/retirement/components/RREGOPAnalysisSection'));
const RealEstateOptimizationSection = React.lazy(() => import('./features/retirement/components/RealEstateOptimizationSection').then(module => ({ default: module.RealEstateOptimizationSection })));
const TaxOptimizationDashboard = React.lazy(() => import('./features/retirement/components/TaxOptimizationDashboard').then(module => ({ default: module.TaxOptimizationDashboard })));
const MonteCarloSimulator = React.lazy(() => import('./features/retirement/components/optimization/MonteCarloSimulator').then(module => ({ default: module.MonteCarloSimulator })));
const SensitivityAnalysis = React.lazy(() => import('./features/retirement/components/SensitivityAnalysis').then(module => ({ default: module.SensitivityAnalysis })));
const ScenarioComparison = React.lazy(() => import('./features/retirement/components/ScenarioComparison').then(module => ({ default: module.ScenarioComparison })));
const UltimatePlanningDashboard = React.lazy(() => import('./features/retirement/components/UltimatePlanningDashboard').then(module => ({ default: module.UltimatePlanningDashboard })));
const RRQQuickCompare = React.lazy(() => import('./features/retirement/components/RRQQuickCompare').then(module => ({ default: module.default })));
const RRQDelaySimulator = React.lazy(() => import('./features/retirement/components/RRQDelaySimulator').then(module => ({ default: module.default })));
const OASGISAnalysis = React.lazy(() => import('./features/retirement/components/OASGISAnalysis').then(module => ({ default: module.OASGISAnalysisComponent })));

// Pages lourdes avec lazy loading
const ExpensesPage = React.lazy(() => import('./pages/ExpensesPage'));
const RRQCPPAnalysis = React.lazy(() => import('./pages/RRQCPPAnalysis'));
const ImmobilierPage = React.lazy(() => import('./pages/ImmobilierPage'));
const CCQPage = React.lazy(() => import('./pages/CCQPage'));
const ComparisonPage = React.lazy(() => import('./pages/ComparisonPage'));
const EstatePlanning = React.lazy(() => import('./pages/EstatePlanning'));
const FinancialAssistantEn = React.lazy(() => import('./pages/FinancialAssistant'));
const RealEstatePageEn = React.lazy(() => import('./pages/RealEstatePage'));
const SpendingPlanningEn = React.lazy(() => import('./pages/SpendingPlanning'));
const IncomePageEn = React.lazy(() => import('./pages/IncomePage'));
const SaveLoadEn = React.lazy(() => import('./pages/SaveLoad'));
const HomeOptimized = React.lazy(() => import('./pages/HomeOptimized'));

// Composants de test et validation - Lazy loading
const FinalValidation = React.lazy(() => import('./components/FinalValidation'));
const AdvancedDemoControls = React.lazy(() => import('./features/retirement/components/AdvancedDemoControls').then(module => ({ default: module.AdvancedDemoControls })));

// Pages unifiées avec lazy loading
const UnifiedRetirementPage = React.lazy(() => import('./pages/UnifiedRetirementPage'));

// Pages existantes (pour compatibilité) - Lazy loaded
const RetraiteEntreeFr = React.lazy(() => import('./pages/RetraiteEntreeFr'));
const RetraiteEntreeEn = React.lazy(() => import('./pages/RetraiteEntreeEn'));
const RetraiteModuleFr = React.lazy(() => import('./pages/RetraiteModuleFr'));
const RetraiteModuleEn = React.lazy(() => import('./pages/RetraiteModuleEn'));
const RetraiteModulePhase1Fr = React.lazy(() => import('./pages/RetraiteModulePhase1Fr'));
const RetraiteModulePhase1En = React.lazy(() => import('./pages/RetraiteModulePhase1En'));
const RapportsRetraiteFr = React.lazy(() => import('./pages/RapportsRetraiteFr'));
const RetirementReportsEn = React.lazy(() => import('./pages/RetirementReportsEn'));
const Phase2DemoPage = React.lazy(() => import('./pages/Phase2DemoPage'));
const SauvegarderCharger = React.lazy(() => import('./pages/SauvegarderCharger'));
const WizardPage = React.lazy(() => import('./pages/WizardPage'));

// NOUVEAUX MODULES PHASE 3
import { FourPercentRuleModule } from './components/ui/FourPercentRuleModule';
import FourPercentRuleModuleEn from './components/ui/FourPercentRuleModuleEn';
import { OptimalAllocationModule } from './components/ui/OptimalAllocationModule';
import { ExcessLiquidityDetector } from './components/ui/ExcessLiquidityDetector';
import { InflationProtectionCenter } from './components/ui/InflationProtectionCenter';
import { BehavioralBiasEducator } from './components/ui/BehavioralBiasEducator';
const DynamicWithdrawalPlanningModule = React.lazy(() => import('./components/ui/DynamicWithdrawalPlanningModule'));
const ApplyWithdrawalOrder = React.lazy(() => import('./pages/ApplyWithdrawalOrder'));
const RetirementWithdrawalComparison = React.lazy(() => import('./features/retirement/components/RetirementWithdrawalComparison').then(module => ({ default: module.RetirementWithdrawalComparison })));
const ApplyNotification = React.lazy(() => import('./pages/ApplyNotification'));
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage'));
const ScenariosPage = React.lazy(() => import('./pages/ScenariosPage'));
const ScenarioComparisonPage = React.lazy(() => import('./pages/ScenarioComparisonPage'));


function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Layout>
            <BackupBootstrap />
            <Suspense fallback={<SeniorsLoadingSpinner />}>
              <Routes>
              {/* 🏠 NOUVELLES ROUTES PRINCIPALES - Navigation restructurée */}
              
              {/* Page d'accueil - "VOTRE RETRAITE, VOTRE HISTOIRE" (extraites) */}
              {MainRoutesHome()}
              
              {/* Page profil - désormais accessible directement (UX seniors) */}
              {MainRoutesCore()}
              
              {/* Modules gouvernementaux (extraits) */}
              {GovernmentRoutes()}

              {/* Rapports & Wizard (extraits) */}
              {ReportsRoutes()}

              {/* Zones de test/démonstration (guardées par VITE_ENABLE_LABS) */}
              {LabsRoutes()}
              {RetirementRoutes()}
              {MarketingRoutes()}
              {MarketingExtrasRoutes()}
              
              {/* Page retraite - "TRAVAILLER AVEC CE QU'ON A" + teaser du tableau de bord (repliable) */}
              
              {/* Page revenus - "GÉREZ VOS SOURCES DE REVENUS" */}
              
              {/* Page planification d'urgence - "PROTÉGEZ VOS PROCHES" */}
              
              {/* Page planification successorale - "ORGANISEZ VOTRE SUCCESSION" */}
              
              {/* Page planification de dépenses - "OPTIMISEZ VOS ACHATS" */}
              
              {/* Assistant financier personnel - "ÉVITEZ LES CATASTROPHES FINANCIÈRES" */}
              
              {/* Expérience guidée seniors - Navigation zéro scroll */}
              
              {/* Module Budget - "GÉREZ VOS FINANCES INTELLIGEMMENT" */}
              
              {/* 📊 MODULE MVP HYPOTHÈSES DE CALCUL - TRANSPARENCE TOTALE */}
              
              {/* Page Hypothèses de Calcul - Interface Seniors-Friendly */}
              
              {/* 📝 NOUVELLES ROUTES - BLOG (extraites) */}
              {BlogRoutes()}

              {/* Essentiels et Outils */}
              <Route path="/blog/essentiels" element={<EssentialsPage />} />
              <Route path="/blog/outils" element={<ToolsPage />} />
              <Route path="/en/blog/essentials" element={<EssentialsPage language="en" />} />
              <Route path="/en/blog/tools" element={<ToolsPage language="en" />} />
              
              {/* Articles spécifiques du blog */}
              <Route path="/blog/guides/optimiser-transmission-celi" element={<OptimiserTransmissionCeli />} />
              <Route path="/blog/guides/strategies-fiscales-retraite" element={<BlogPage />} />
              <Route path="/blog/conseils-experts/10-conseils-retraite-reussie" element={<BlogPage />} />
              <Route path="/blog/conseils-experts/eviter-biais-comportementaux" element={<BlogPage />} />
              <Route path="/blog/etudes-cas/retraite-anticipee-55-ans" element={<BlogPage />} />
              <Route path="/blog/etudes-cas/optimisation-successorale-4-enfants" element={<BlogPage />} />
              <Route path="/blog/actualites-fiscales/budget-2024-retraites" element={<BlogPage />} />
              <Route path="/blog/actualites-fiscales/nouvelles-regles-ferr-2024" element={<BlogPage />} />
              
              {/* Articles populaires */}
              <Route path="/blog/guides/reer-vs-celi-optimization" element={<BlogPage />} />
              <Route path="/blog/conseils-experts/5-erreurs-couteuses-retraite" element={<BlogPage />} />
              <Route path="/blog/actualites-fiscales/impact-inflation-retraite" element={<BlogPage />} />
              
              {/* 🏛️ NOUVELLES ROUTES - PRESTATIONS GOUVERNEMENTALES */}
              
              {/* Module SRG (Supplément de Revenu Garanti) */}
              
              {/* Module RREGOP (Régime de Retraite Gouvernemental) */}
              
              {/* Module RRQ/CPP */}
              
              {/* Module CCQ - Commission de la Construction du Québec */}
              
              {/* Module OAS/GIS */}
              
              
              {/* Retraits - Stratégies et application d'ordre */}

              {/* Notifications 90/60/30 */}

              
              {/* 🏠 NOUVELLES ROUTES - OPTIMISATION IMMOBILIÈRE */}
              
              {/* Module Immobilier */}
              
              {/* Page Immobilier - Gestion complète du patrimoine immobilier */}
              
              {/* 📊 NOUVELLES ROUTES - SIMULATIONS */}
              
              {/* Simulateur Monte Carlo */}
              {/* RRQ quick compare + defer-by-months simulator */}
              
              {/* Analyse de Sensibilité */}
              
              {/* Comparaison de Scénarios */}
              
              {/* 🎯 NOUVELLES ROUTES - OPTIMISATION FISCALE ET PLANIFICATION */}
              
              {/* Optimisation Fiscale */}
              
                      {/* Planification Expert */}
        
        {/* Module de Dépenses */}
        
        {/* 🚀 NOUVEAUX MODULES PHASE 1, 2 ET 3 */}
        
        {/* Phase 1 - Modules Essentiels */}
        
        
        
        {/* Phase 2 - Optimisation Avancée */}
        
        
        
        {/* Phase 3 - Optimisation Experte */}
        
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
              
              
              {/* Validation finale - Dernière étape avant déploiement */}
              
              {/* Page comparateur concurrentiel */}
              
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
              
              
              {/* Route Phase 2 Demo */}
              
              {/* Routes Sauvegarder/Charger */}
              <Route path="/fr/sauvegarder-charger" element={<SauvegarderCharger />} />
              <Route path="/en/save-load" element={<SaveLoadEn />} />

              {/* Sauvegardes locales (gestionnaire) */}
              <Route path="/sauvegardes" element={<div className="p-8"><BackupManagerPanel /></div>} />
              <Route path="/backups" element={<div className="p-8"><BackupManagerPanel /></div>} />
              
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
