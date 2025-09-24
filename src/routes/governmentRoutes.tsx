import React from 'react';
import { Route } from 'react-router-dom';

/**
 * GovernmentRoutes
 * Regroupe les routes liées aux prestations et modules gouvernementaux.
 * Extrait depuis App.tsx pour alléger le shell et clarifier le domaine.
 */

// Components (lazy to preserve code splitting)
const SRGAnalysisSection = React.lazy(() =>
  import('@/features/retirement/components/SRGAnalysisSection').then((m) => ({
    default: m.SRGAnalysisSection,
  }))
);
const RREGOPAnalysisSection = React.lazy(() =>
  import('@/features/retirement/components/RREGOPAnalysisSection')
);
const RRQCPPAnalysis = React.lazy(() => import('@/pages/RRQCPPAnalysis'));
const CCQPage = React.lazy(() => import('@/pages/CCQPage'));
const OASGISAnalysis = React.lazy(() =>
  import('@/features/retirement/components/OASGISAnalysis').then((m) => ({
    default: m.OASGISAnalysisComponent,
  }))
);
const ApplyBenefitsAge = React.lazy(() => import('@/pages/ApplyBenefitsAge'));

export function GovernmentRoutes() {
  return (
    <>
      {/* Module SRG (Supplément de Revenu Garanti) */}
      <Route
        path="/module-srg"
        element={<div className="p-8"><SRGAnalysisSection data={{} as any} onUpdate={() => {}} /></div>}
      />
      <Route
        path="/srg-module"
        element={<div className="p-8"><SRGAnalysisSection data={{} as any} onUpdate={() => {}} /></div>}
      />

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

      {/* Démarches / Âge des prestations */}
      <Route path="/prestations/apply" element={<ApplyBenefitsAge />} />
      <Route path="/benefits/apply" element={<ApplyBenefitsAge />} />
    </>
  );
}

export default GovernmentRoutes;
