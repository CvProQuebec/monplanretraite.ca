import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './features/retirement/hooks/useLanguage';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/layout/Layout';

// Pages de retraite
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

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Page d'accueil */}
              <Route path="/" element={<RetraiteEntreeFr />} />
              <Route path="/en" element={<RetraiteEntreeEn />} />
              
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
              
              {/* Redirection par défaut */}
              <Route path="*" element={<RetraiteEntreeFr />} />
            </Routes>
          </Layout>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;