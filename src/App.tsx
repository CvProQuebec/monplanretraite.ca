import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './features/retirement/hooks/useLanguage';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import SeniorsLoadingSpinner from './components/SeniorsLoadingSpinner';

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

// Module MVP Hypothèses de Calcul
const SimpleAssumptionsPage = React.lazy(() => import('./pages/SimpleAssumptionsPage'));

/* Blog pages */
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const OptimiserTransmissionCeli = React.lazy(() => import('./pages/blog/OptimiserTransmissionCeli'));
const BlogIndex = React.lazy(() => import('./pages/blog/BlogIndex'));
const BlogPost = React.lazy(() => import('./pages/blog/BlogPost'));

// NOUVEAUX MODULES INTÉGRÉS - Lazy loading pour performance seniors
const SRGAnalysisSection = React.lazy(() => import('./features/retirement/components/SRGAnalysisSection').then(module => ({ default: module.SRGAnalysisSection })));
const RREGOPAnalysisSection = React.lazy(() => import('./features/retirement/components/RREGOPAnalysisSection'));
const RealEstateOptimizationSection = React.lazy(() => import('./features/retirement/components/RealEstateOptimizationSection').then(module => ({ default: module.RealEstateOptimizationSection })));
const TaxOptimizationDashboard = React.lazy(() => import('./features/retirement/components/TaxOptimizationDashboard').then(module => ({ default: module.TaxOptimizationDashboard })));
const MonteCarloSimulator = React.lazy(() => import('./features/retirement/components/MonteCarloSimulator').then(module => ({ default: module.MonteCarloSimulator })));
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
            <Suspense fallback={<SeniorsLoadingSpinner />}>
              <Routes>
              {/* 🏠 NOUVELLES ROUTES PRINCIPALES - Navigation restructurée */}
              
              {/* Page d'accueil - "VOTRE RETRAITE, VOTRE HISTOIRE" */}
              <Route path="/" element={<Accueil />} />
              <Route path="/accueil" element={<Accueil />} />
              <Route path="/fr" element={<Accueil />} />
              <Route path="/home" element={<Home />} />
              <Route path="/en" element={<Home />} />
              
              {/* Page profil - désormais accessible directement (UX seniors) */}
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Page retraite - "TRAVAILLER AVEC CE QU'ON A" + teaser du tableau de bord (repliable) */}
              <Route path="/ma-retraite" element={<MaRetraiteWithDashboard />} />
              <Route path="/my-retirement" element={<MaRetraiteWithDashboard />} />
              
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
              
              {/* Expérience guidée seniors - Navigation zéro scroll */}
              <Route path="/guided-experience" element={<SeniorsGuidedExperience />} />
              <Route path="/experience-guidee" element={<SeniorsGuidedExperience />} />
              
              {/* Module Budget - "GÉREZ VOS FINANCES INTELLIGEMMENT" */}
              <Route path="/budget" element={<Budget />} />
              <Route path="/mon-budget" element={<Budget />} />
              <Route path="/my-budget" element={<Budget />} />
              
              {/* 📊 MODULE MVP HYPOTHÈSES DE CALCUL - TRANSPARENCE TOTALE */}
              
              {/* Page Hypothèses de Calcul - Interface Seniors-Friendly */}
              <Route path="/hypotheses" element={<SimpleAssumptionsPage />} />
              <Route path="/hypotheses-calcul" element={<SimpleAssumptionsPage />} />
              <Route path="/assumptions" element={<SimpleAssumptionsPage />} />
              <Route path="/calculation-assumptions" element={<SimpleAssumptionsPage />} />
              
              {/* 📝 NOUVELLES ROUTES - BLOG */}
              
              {/* Page principale du blog */}
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              {/* English blog */}
              <Route path="/en/blog" element={<BlogIndex language="en" />} />
              <Route path="/en/blog/:slug" element={<BlogPost language="en" />} />
              
              {/* Catégories du blog */}
              <Route path="/blog/guides" element={<BlogPage />} />
              <Route path="/blog/conseils-experts" element={<BlogPage />} />
              <Route path="/blog/expert-tips" element={<BlogPage />} />
              <Route path="/blog/etudes-cas" element={<BlogPage />} />
              <Route path="/blog/case-studies" element={<BlogPage />} />
              <Route path="/blog/actualites-fiscales" element={<BlogPage />} />
              <Route path="/blog/tax-news" element={<BlogPage />} />
              
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
              <Route path="/module-srg" element={<div className="p-8"><SRGAnalysisSection data={{} as any} onUpdate={() => {}} /></div>} />
              <Route path="/srg-module" element={<div className="p-8"><SRGAnalysisSection data={{} as any} onUpdate={() => {}} /></div>} />
              
              {/* Module RREGOP (Régime de Retraite Gouvernemental) */}
              <Route path="/module-rregop" element={<RREGOPAnalysisSection userPlan="professional" />} />
              <Route path="/rregop-module" element={<RREGOPAnalysisSection userPlan="professional" />} />
              
              {/* Module RRQ/CPP */}
              <Route path="/rrq-cpp-analysis" element={<RRQCPPAnalysis />} />
              <Route path="/analyse-rrq-cpp" element={<RRQCPPAnalysis />} />
              
              {/* Module CCQ - Commission de la Construction du Québec */}
              <Route path="/module-ccq" element={<CCQPage />} />
              <Route path="/ccq-module" element={<CCQPage />} />
              
              {/* Module OAS/GIS */}
              <Route path="/oas-gis-analysis" element={<OASGISAnalysis />} />
              <Route path="/analyse-oas-gis" element={<OASGISAnalysis />} />
              
              <Route path="/prestations/apply" element={<ApplyBenefitsAge />} />
              <Route path="/benefits/apply" element={<ApplyBenefitsAge />} />
              
              {/* Retraits - Stratégies et application d'ordre */}
              <Route path="/withdrawal-sequence" element={<DynamicWithdrawalPlanningModule />} />
              <Route path="/sequence-retrait" element={<DynamicWithdrawalPlanningModule />} />
              <Route path="/withdrawals/apply" element={<ApplyWithdrawalOrder />} />
              <Route path="/retraits/apply" element={<ApplyWithdrawalOrder />} />
              <Route path="/withdrawal-comparison" element={<RetirementWithdrawalComparison />} />
              <Route path="/comparateur-retraits" element={<RetirementWithdrawalComparison />} />

              {/* Notifications 90/60/30 */}
              <Route path="/notifications/apply" element={<ApplyNotification />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/rappels" element={<NotificationsPage />} />

              {/* Scénarios - gestion et comparaison */}
              <Route path="/scenarios" element={<ScenariosPage />} />
              <Route path="/scenario-comparison" element={<ScenarioComparisonPage />} />
              <Route path="/scenarios-compare" element={<ScenarioComparisonPage />} />
              
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
              {/* RRQ quick compare + defer-by-months simulator */}
              <Route path="/rrq-quick-compare" element={<RRQQuickCompare />} />
              <Route path="/rrq-delay-simulator" element={<RRQDelaySimulator />} />
              
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
                  <li>• Crédit pour revenu de pension (2 000 $ premiers)</li>
                  <li>• Fractionnement du revenu de pension</li>
                  <li>• Réduction d'impôt de 1 600 $+ par année</li>
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
                  <li>• Économies de 0,5-2 % par année</li>
                </ul>
              </div>
            </div>
          </div>
        } />
        
        <Route path="/module-coussin-liquidites" element={
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Module Coussin de Liquidités</h1>
              <p className="text-gray-600 mb-8">Gérez la volatilité avec la stratégie bucket.</p>
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
        {/* Routes publiques dédiées Règle du 4 % */}
        <Route path="/regle-4-pourcent" element={
          <div className="p-8">
            <FourPercentRuleModule />
          </div>
        } />
        <Route path="/4-percent-rule" element={
          <div className="p-8">
            <FourPercentRuleModuleEn />
          </div>
        } />
        <Route path="/four-percent-rule" element={
          <div className="p-8">
            <FourPercentRuleModuleEn />
          </div>
        } />
        {/* Placeholders Phase 2/3 */}
        <Route path="/education-4-pourcent" element={
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Centre d’éducation – Règle du 4 %</h1>
            <p className="text-gray-600 mt-4">Contenu éducatif à venir.</p>
          </div>
        } />
        <Route path="/simulateur-retraite" element={
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Simulateur de retraite</h1>
            <p className="text-gray-600 mt-4">Module avancé à venir.</p>
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
              
              {/* Page comparateur concurrentiel */}
              <Route path="/comparaison" element={<ComparisonPage />} />
              <Route path="/comparison" element={<ComparisonPage />} />
              <Route path="/pourquoi-nous-choisir" element={<ComparisonPage />} />
              
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

              {/* 🧭 Wizard Phase 2 */}
              <Route path="/wizard" element={<WizardPage />} />
              <Route path="/wizard/:stepId" element={<WizardPage />} />
              
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
