import React from 'react';
import { Route } from 'react-router-dom';
import { LocalizedRoute } from './LocalizedRoute';

const AllToolsPage = React.lazy(() => import('../pages/AllToolsPage'));
const ComparisonPage = React.lazy(() => import('../pages/ComparisonPage'));

/**
 * MarketingRoutes
 * - Regroupe les routes marketing simples (Outils, Comparaison).
 * - Extraction depuis App.tsx sans modifier le comportement.
 */
export function MarketingRoutes() {
  return (
    <>
      {/* Page Outils (FR/EN) */}
      {LocalizedRoute({ fr: "/outils", en: "/tools", component: AllToolsPage })}

      {/* Comparaison (FR/EN) + alias FR */}
      {LocalizedRoute({ fr: "/comparaison", en: "/comparison", component: ComparisonPage })}
      <Route path="/pourquoi-nous-choisir" element={<ComparisonPage />} />
    </>
  );
}
