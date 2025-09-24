import React from 'react';
import { Route } from 'react-router-dom';

/**
 * LabsRoutes
 * - Rassemble les écrans de test/demo sous /labs/*
 * - Lazy-loaded + guard via VITE_ENABLE_LABS pour éviter l'inclusion dans le bundle principal
 * - Aucun impact sur les fonctionnalités métier ni sur les calculs
 */

const ENABLED = import.meta.env.VITE_ENABLE_LABS === 'true';

// Lazy imports (séparés en chunks)
const FinalValidation = React.lazy(() => import('@/components/FinalValidation'));
const AdvancedDemoControls = React.lazy(() =>
  import('@/features/retirement/components/AdvancedDemoControls').then(m => ({ default: m.AdvancedDemoControls }))
);
const Phase2DemoPage = React.lazy(() => import('@/pages/Phase2DemoPage'));

// Optionnel: exemples divers (si présents)
const LocalStorageTransferExample = React.lazy(() => import('@/examples/LocalStorageTransferExample').catch(() => ({ default: () => null })));

export function LabsRoutes() {
  if (!ENABLED) return null;
  return (
    <>
      {/* Validation et démos avancées */}
      <Route path="/labs/validation-finale" element={<FinalValidation />} />
      <Route path="/labs/advanced-demo-controls" element={<AdvancedDemoControls />} />
      <Route path="/labs/phase2-demo" element={<Phase2DemoPage />} />

      {/* Exemples (tolérant à l'absence) */}
      <Route path="/labs/localstorage-transfer" element={<LocalStorageTransferExample />} />
    </>
  );
}

export default LabsRoutes;
