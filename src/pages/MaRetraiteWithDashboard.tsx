import React, { Suspense } from 'react';
const OriginalMaRetraite = React.lazy(() =>
  import('./MaRetraite').then((m: any) => ({ default: m.default ?? m.MaRetraite ?? (() => null) }))
);
import SeniorsDashboardTeaserSection from '@/components/retirement/SeniorsDashboardTeaserSection';

/**
 * Wrapper qui rend la page "Ma retraite" originale suivie d'une
 * section ancrée (#dashboard) avec un teaser et un panneau repliable
 * pour afficher le SeniorsDashboard complet.
 *
 * - Respecte OQLF via les utilitaires utilisés dans la section teaser
 * - L'ancre #dashboard ou #tableau-de-bord ouvre automatiquement le panneau
 */
const MaRetraiteWithDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="container mx-auto px-4 sm:px-6 py-6 text-slate-700">Chargement…</div>}>
        <OriginalMaRetraite />
      </Suspense>
      <div className="container mx-auto px-4 sm:px-6">
        <SeniorsDashboardTeaserSection />
      </div>
    </div>
  );
};

export default MaRetraiteWithDashboard;
