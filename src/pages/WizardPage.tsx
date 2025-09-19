import React, { Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import WizardLayout from '@/components/wizard/WizardLayout';
import SeniorsLoadingSpinner from '@/components/SeniorsLoadingSpinner';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';

// Charger paresseusement les pages/modules existants
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const Revenus = React.lazy(() => import('@/pages/Revenus'));
const ExpensesPage = React.lazy(() => import('@/pages/ExpensesPage'));
const Budget = React.lazy(() => import('@/pages/Budget'));
const MaRetraiteWithDashboard = React.lazy(() => import('@/pages/MaRetraiteWithDashboard'));
const RRQQuickCompare = React.lazy(() =>
  import('@/features/retirement/components/RRQQuickCompare').then(m => ({ default: m.default }))
);
const RRQDelaySimulator = React.lazy(() =>
  import('@/features/retirement/components/RRQDelaySimulator').then(m => ({ default: m.default }))
);
const OASGISAnalysis = React.lazy(() =>
  import('@/features/retirement/components/OASGISAnalysis').then(m => ({ default: m.OASGISAnalysisComponent }))
);
const ResultsWizardStep = React.lazy(() => import('@/pages/ResultsWizardStep'));

const Placeholder: React.FC<{ title: string; note?: string }> = ({ title, note }) => (
  <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-xl">
    <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-700">{note || 'Section à venir.'}</p>
  </div>
);

const WizardPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const scenarioId = 'default';

  // Si aucune étape n'est fournie, rediriger vers la première (profil)
  if (!stepId) {
    return <Navigate to="/wizard/profil" replace />;
  }

  const step = stepId as
    | 'profil'
    | 'revenus'
    | 'actifs'
    | 'prestations'
    | 'depenses'
    | 'budget'
    | 'optimisations'
    | 'plan'
    | 'rapports';

  const renderContent = () => {
    switch (step) {
      case 'profil':
        return <ProfilePage />;

      case 'revenus':
        return <Revenus />;

      case 'actifs':
        // Tableau de bord retraite comme point d'entrée "épargne & dettes"
        return <MaRetraiteWithDashboard />;

      case 'prestations':
        // Empile un comparateur RRQ et l'analyse OAS/SV dans le flux du wizard
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {isEnglish ? 'QPP/CPP decision helper' : 'Assistant décision RRQ/CPP'}
              </h2>
              <RRQQuickCompare />
              <div className="mt-4">
                <RRQDelaySimulator />
              </div>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {isEnglish ? 'OAS/GIS analysis' : 'Analyse SV/SRG'}
              </h2>
              <OASGISAnalysis />
            </div>
          </div>
        );

      case 'depenses':
        return <ExpensesPage />;

      case 'budget':
        return <Budget />;

      case 'optimisations':
        return (
          <Placeholder
            title={isEnglish ? 'Optimizations' : 'Optimisations'}
            note={isEnglish ? 'Coming in Phase 2 Sprint 2.' : 'À venir au Sprint 2 de la Phase 2.'}
          />
        );

      case 'plan':
        return <ResultsWizardStep />;

      case 'rapports':
        return (
          <Placeholder
            title={isEnglish ? 'Reports' : 'Rapports'}
            note={isEnglish ? 'Banker/Planner/Notary presets for PDF export.' : 'Préréglages banquier/planificateur/notaire pour export PDF.'}
          />
        );

      default:
        return <Placeholder title={isEnglish ? 'Unknown step' : 'Étape inconnue'} />;
    }
  };

  return (
    <WizardLayout scenarioId={scenarioId} stepId={step}>
      <Suspense fallback={<SeniorsLoadingSpinner />}>
        {renderContent()}
      </Suspense>
    </WizardLayout>
  );
};

export default WizardPage;
