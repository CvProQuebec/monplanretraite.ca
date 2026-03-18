import React from 'react';
import { Route } from 'react-router-dom';
import { LocalizedRoute } from './LocalizedRoute';

const AllToolsPage = React.lazy(() => import('../pages/AllToolsPage'));
const ComparisonPage = React.lazy(() => import('../pages/ComparisonPage'));
const StartHerePage = React.lazy(() => import('../pages/StartHerePage'));
const SituationsPage = React.lazy(() => import('../pages/SituationsPage'));
const PlannerDossierPage = React.lazy(() => import('../pages/PlannerDossierPage'));

export function MarketingRoutes() {
  return (
    <>
      {LocalizedRoute({ fr: '/commencer', en: '/start-here', component: StartHerePage })}
      {LocalizedRoute({ fr: '/par-situation', en: '/situations', component: SituationsPage })}
      {LocalizedRoute({ fr: '/mon-dossier', en: '/my-dossier', component: PlannerDossierPage })}

      {LocalizedRoute({ fr: '/outils', en: '/tools', component: AllToolsPage })}

      {LocalizedRoute({ fr: '/comparaison', en: '/comparison', component: ComparisonPage })}
      <Route path="/pourquoi-nous-choisir" element={<ComparisonPage />} />
    </>
  );
}

export default MarketingRoutes;
