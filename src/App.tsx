import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './features/retirement/hooks/useLanguage';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/layout/Layout';

// Nouvelles pages principales
import Accueil from './pages/Accueil';
import Home from './pages/Home';
import MonProfil from './pages/MonProfil';
import MyProfile from './pages/MyProfile';
import MaRetraite from './pages/MaRetraite';
import Revenus from './pages/Revenus';
import PlanificationUrgence from './pages/PlanificationUrgence';
import PlanificationSuccessorale from './pages/PlanificationSuccessorale';
import PlanificationDepenses from './pages/PlanificationDepenses';
import AssistantFinancier from './pages/AssistantFinancier';
import Budget from './pages/Budget';

// Composants de test et validation
import FinalValidation from './components/FinalValidation';
import { AdvancedDemoControls } from './features/retirement/components/AdvancedDemoControls';
import TestPhase3IA from './components/TestPhase3IA';

// Pages existantes (pour compatibilité)
import RetraiteFr from './pages/RetraiteFr';
import RetraiteEn from './pages/RetraiteEn';
import RetraiteEntreeFr from './pages/RetraiteEntreeFr';
import RetraiteEntreeEn from './pages/RetraiteEntreeEn';
import RetraiteModuleFr from './pages/RetraiteModuleFr';
import RetraiteModuleEn from './pages/RetraiteModuleEn';
import RetraiteModulePhase1Fr from './pages/RetraiteModulePhase1Fr';
import RetraiteModulePhase1En from './pages/RetraiteModulePhase1En';
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
            <Routes>
              {/* 🏠 NOUVELLES ROUTES PRINCIPALES - Navigation restructurée */}
              
              {/* Page d'accueil - "VOTRE RETRAITE, VOTRE HISTOIRE" */}
              <Route path="/" element={<Accueil />} />
              <Route path="/accueil" element={<Accueil />} />
              <Route path="/fr" element={<Accueil />} />
              <Route path="/home" element={<Home />} />
              <Route path="/en" element={<Home />} />
              
              {/* Page profil - "VOTRE SITUATION, NOS RESSOURCES" */}
              <Route path="/mon-profil" element={<MonProfil />} />
              <Route path="/my-profile" element={<MyProfile />} />
              
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
              
              {/* 🧪 ROUTES DE TEST ET VALIDATION */}
              
              {/* Test des contrôles de démonstration avancés */}
              <Route path="/advanced-demo-controls" element={<AdvancedDemoControls />} />
              
              {/* Test Phase 3 IA */}
              <Route path="/test-phase3-ia" element={<TestPhase3IA />} />
              
              {/* Validation finale - Dernière étape avant déploiement */}
              <Route path="/validation-finale" element={<FinalValidation />} />
              
              {/* 🌐 ROUTES BILINGUES EXISTANTES (pour compatibilité) */}
              
              {/* Routes d'entrée - Module Retirement */}
              <Route path="/fr/retraite-entree" element={<RetraiteEntreeFr />} />
              <Route path="/en/retirement-entry" element={<RetraiteEntreeEn />} />
              
              {/* Routes du module complet - Module Retirement */}
              <Route path="/fr/retraite" element={<RetraiteFr />} />
              <Route path="/en/retirement" element={<RetraiteEn />} />
              
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
          </Layout>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
