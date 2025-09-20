import React, { Suspense, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import WizardLayout from '@/components/wizard/WizardLayout';
import SeniorsLoadingSpinner from '@/components/SeniorsLoadingSpinner';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import FeatureGate from '@/components/wizard/FeatureGate';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import { PDFExportService } from '@/services/PDFExportService';
import { TaxOptimizationPDFService } from '@/services/tax/TaxOptimizationPDFService';

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
const WizardOptimizationsStep = React.lazy(() => import('@/pages/WizardOptimizationsStep'));
const RREGOPAnalysisSection = React.lazy(() => import('@/features/retirement/components/RREGOPAnalysisSection'));
const SRGAnalysisSection = React.lazy(() =>
  import('@/features/retirement/components/SRGAnalysisSection').then(m => ({ default: m.SRGAnalysisSection }))
);

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
  const isFrench = language === 'fr';
  const scenarioId = 'default';
  const { userData, updateUserData } = useRetirementData();
  const { currentPlan } = useSubscriptionLimits();
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

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
            <FeatureGate feature="hasOASGISAnalysis">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {isEnglish ? 'OAS/GIS analysis' : 'Analyse SV/SRG'}
                </h2>
                <OASGISAnalysis />
              </div>
            </FeatureGate>

            <FeatureGate feature="hasSRGModule">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {isEnglish ? 'GIS optimization' : 'Optimisation SRG'}
                </h2>
                <Suspense fallback={<SeniorsLoadingSpinner />}>
                  <SRGAnalysisSection
                    data={userData as any}
                    onUpdate={updateUserData as any}
                    isFrench={language !== 'en'}
                  />
                </Suspense>
              </div>
            </FeatureGate>

            <FeatureGate feature="hasRREGOPModule">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {isEnglish ? 'RREGOP analysis' : 'Analyse RREGOP'}
                </h2>
                <Suspense fallback={<SeniorsLoadingSpinner />}>
                  <RREGOPAnalysisSection userPlan={currentPlan as any} />
                </Suspense>
              </div>
            </FeatureGate>
          </div>
        );

      case 'depenses':
        return <ExpensesPage />;

      case 'budget':
        return <Budget />;

      case 'optimisations':
        return <WizardOptimizationsStep />;

      case 'plan':
        return <ResultsWizardStep />;

      case 'rapports': {
        const handleExportSummary = async () => {
          setExporting(true);
          try {
            const blob = await PDFExportService.generateQuickSummary(userData as any, 85, isFrench ? 'fr' : 'en');
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = isFrench ? 'Resume_Retraite.pdf' : 'Retirement_Summary.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } finally {
            setExporting(false);
          }
        };
        const handleExportBanker = async () => {
          setExporting(true);
          try {
            const clientName = `${userData?.personal?.prenom1 || ''} ${userData?.personal?.nom1 || ''}`.trim() || (isFrench ? 'Client' : 'Client');
            const blob = await PDFExportService.generateBankerReport(isFrench ? 'fr' : 'en', {
              clientName,
              scenarioName: isFrench ? 'Scénario personnel' : 'Personal scenario',
              netMonthlyNeed: 0,
              withdrawalOrder: [],
              monthsCoveredOp: undefined,
              yearsCoveredShort: undefined,
              assumptions: [
                isFrench ? 'Calculs locaux approximatifs (aucun conseil)' : 'Local approximate calculations (no advice)',
                isFrench ? 'Aucune transmission réseau; données 100% locales' : 'No network transmission; 100% local data'
              ],
              notes: [],
              authorName: 'MonPlanRetraite.ca'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = isFrench ? 'Banquier_Synthese.pdf' : 'Banker_Summary.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } finally {
            setExporting(false);
          }
        };
        const handleExportPlanner = async () => {
          setExporting(true);
          try {
            const clientName = `${userData?.personal?.prenom1 || ''} ${userData?.personal?.nom1 || ''}`.trim() || (isFrench ? 'Client' : 'Client');
            const blob = await PDFExportService.generatePlannerReport(isFrench ? 'fr' : 'en', {
              clientName,
              scenarioName: isFrench ? 'Synthèse planificateur' : 'Planner summary',
              recommendations: [],
              comparisons: [],
              actionPlan: [],
              authorName: 'MonPlanRetraite.ca'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = isFrench ? 'Planificateur_Synthese.pdf' : 'Planner_Summary.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } finally {
            setExporting(false);
          }
        };
        const handleExportNotary = async () => {
          setExporting(true);
          try {
            const clientName = `${userData?.personal?.prenom1 || ''} ${userData?.personal?.nom1 || ''}`.trim() || (isFrench ? 'Client' : 'Client');
            const blob = await PDFExportService.generateNotaryReport(isFrench ? 'fr' : 'en', {
              clientName,
              scenarioName: isFrench ? 'Dossier notaire' : 'Notary dossier',
              estateNotes: [],
              beneficiaries: [],
              documentChecklist: [],
              authorName: 'MonPlanRetraite.ca'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = isFrench ? 'Notaire_Dossier.pdf' : 'Notary_Dossier.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } finally {
            setExporting(false);
          }
        };
        const handleExportOptimization = async () => {
          setExporting(true);
          try {
            const raw = localStorage.getItem('mpr-last-optimization');
            if (!raw) {
              navigate('/wizard/optimisations');
              return;
            }
            const cache = JSON.parse(raw);
            const lang = isFrench ? 'fr' : 'en';
            let clientName: string | undefined = undefined;
            try {
              const p: any = (userData as any)?.personal || {};
              const name = [p?.prenom1, p?.nom1].filter(Boolean).join(' ');
              clientName = name || undefined;
            } catch {}
            const payload = { language: lang, clientName, ...cache };
            const blob = await TaxOptimizationPDFService.generateSummary(payload);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = isFrench ? 'Optimisation_fiscale_resume.pdf' : 'Tax_Optimization_Summary.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } finally {
            setExporting(false);
          }
        };

        const optAvailable = !!localStorage.getItem('mpr-last-optimization');

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Résumé simple — disponible pour tous */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {isEnglish ? 'Summary' : 'Résumé'}
              </h2>
              <p className="text-gray-700 text-sm mb-3">
                {isEnglish ? 'Quick retirement summary (local).' : 'Résumé retraite rapide (local).'}
              </p>
              <button className="button-primary px-4 py-3" onClick={handleExportSummary} disabled={exporting}>
                {isEnglish ? 'Export' : 'Exporter'}
              </button>
            </div>

            {/* Rapports pro — banquier/planificateur/notaire */}
            <FeatureGate feature="hasProfessionalReports">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {isEnglish ? 'Professional Reports' : 'Rapports professionnels'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button className="button-secondary px-4 py-3" onClick={handleExportBanker} disabled={exporting}>
                    {isEnglish ? 'Banker' : 'Banquier'}
                  </button>
                  <button className="button-secondary px-4 py-3" onClick={handleExportPlanner} disabled={exporting}>
                    {isEnglish ? 'Planner' : 'Planificateur'}
                  </button>
                  <button className="button-secondary px-4 py-3" onClick={handleExportNotary} disabled={exporting}>
                    {isEnglish ? 'Notary' : 'Notaire'}
                  </button>
                </div>
              </div>
            </FeatureGate>

            {/* Optimisation fiscale — résumé robuste (Pro/Expert) */}
            <FeatureGate feature="hasTaxOptimization">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {isEnglish ? 'Optimization (robust summary)' : 'Optimisation (résumé robuste)'}
                </h2>
                <p className="text-gray-700 text-sm mb-3">
                  {isEnglish
                    ? 'Exports the best available DP/Beam or Greedy plan with robustness notes.'
                    : 'Exporte le meilleur plan DP/Beam ou Greedy disponible avec notes de robustesse.'}
                </p>
                <div className="flex items-center gap-2">
                  <button className="button-secondary px-4 py-3" onClick={handleExportOptimization} disabled={exporting || !optAvailable}>
                    {isEnglish ? 'Export (optimization)' : 'Exporter (optimisation)'}
                  </button>
                  {!optAvailable && (
                    <button className="button-outline px-4 py-3" onClick={() => navigate('/wizard/optimisations')}>
                      {isEnglish ? 'Go to Optimizations' : 'Aller à Optimisations'}
                    </button>
                  )}
                </div>
              </div>
            </FeatureGate>
          </div>
        );
      }

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
