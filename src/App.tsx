import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './features/retirement/hooks/useLanguage';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/layout/Layout';

// Nouvelles pages principales
import Accueil from './pages/Accueil';
import MonProfil from './pages/MonProfil';
import MaRetraite from './pages/MaRetraite';
import MesResultats from './pages/MesResultats';

// Composants de test et validation
import TestNavigation from './components/TestNavigation';
import FinalValidation from './components/FinalValidation';

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
              <Route path="/home" element={<Accueil />} />
              
              {/* Page profil - "VOTRE SITUATION, NOS RESSOURCES" */}
              <Route path="/mon-profil" element={<MonProfil />} />
              <Route path="/my-profile" element={<MonProfil />} />
              
              {/* Page retraite - "TRAVAILLER AVEC CE QU'ON A" */}
              <Route path="/ma-retraite" element={<MaRetraite />} />
              <Route path="/my-retirement" element={<MaRetraite />} />
              
              {/* Page résultats - "VOTRE PROGRÈS, NOS FÉLICITATIONS" */}
              <Route path="/mes-resultats" element={<MesResultats />} />
              <Route path="/my-results" element={<MesResultats />} />
              
              {/* 🧪 ROUTES DE TEST ET VALIDATION */}
              
              {/* Tests de navigation */}
              <Route path="/test-navigation" element={<TestNavigation />} />
              
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
