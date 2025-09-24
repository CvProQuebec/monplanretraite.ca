import React from 'react';
import { Route } from 'react-router-dom';

/**
 * ReportsRoutes
 * Regroupe les routes de rapports / wizard / scénarios pour alléger App.tsx.
 * - Rapports retraite FR/EN
 * - Wizard (toutes étapes)
 * - Scénarios (gestion + comparaison)
 */

// Lazy-loaded pages to keep bundle sizes optimal
const RapportsRetraiteFr = React.lazy(() => import('@/pages/RapportsRetraiteFr'));
const RetirementReportsEn = React.lazy(() => import('@/pages/RetirementReportsEn'));
const WizardPage = React.lazy(() => import('@/pages/WizardPage'));
const ScenariosPage = React.lazy(() => import('@/pages/ScenariosPage'));
const ScenarioComparisonPage = React.lazy(() => import('@/pages/ScenarioComparisonPage'));

export function ReportsRoutes() {
  return (
    <>
      {/* Rapports Retraite */}
      <Route path="/fr/rapports-retraite" element={<RapportsRetraiteFr />} />
      <Route path="/en/retirement-reports" element={<RetirementReportsEn />} />

      {/* Wizard (multi-étapes) */}
      <Route path="/wizard" element={<WizardPage />} />
      <Route path="/wizard/:stepId" element={<WizardPage />} />

      {/* Scénarios — gestion et comparaison */}
      <Route path="/scenarios" element={<ScenariosPage />} />
      <Route path="/scenario-comparison" element={<ScenarioComparisonPage />} />
      <Route path="/scenarios-compare" element={<ScenarioComparisonPage />} />
    </>
  );
}

export default ReportsRoutes;
