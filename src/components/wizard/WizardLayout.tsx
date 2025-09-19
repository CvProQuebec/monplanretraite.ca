import React, { useCallback, useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTimeOQLF } from '@/utils/localeFormat';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { wizardService } from '@/services/WizardService';
import useWizardProgress from '@/hooks/useWizardProgress';
import SeniorsLoadingSpinner from '@/components/SeniorsLoadingSpinner';
import type { CompletenessStatus, WizardStepId } from '@/types/wizard';

type Mode = 'guide' | 'libre';

export interface WizardLayoutProps {
  scenarioId?: string;
  stepId?: string;
  children?: React.ReactNode;
}

const STEP_LABELS_FR: Record<string, string> = {
  profil: 'Profil',
  revenus: 'Revenus',
  actifs: 'Épargne & dettes',
  prestations: 'Prestations',
  depenses: 'Dépenses',
  budget: 'Budget',
  optimisations: 'Optimisations',
  plan: 'Plan',
  rapports: 'Rapports',
};

const STEP_LABELS_EN: Record<string, string> = {
  profil: 'Profile',
  revenus: 'Income',
  actifs: 'Savings & Debts',
  prestations: 'Benefits',
  depenses: 'Expenses',
  budget: 'Budget',
  optimisations: 'Optimizations',
  plan: 'Plan',
  rapports: 'Reports',
};

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  scenarioId = 'default',
  stepId,
  children
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const { progress, badges, nextPath, currentPath, refresh, loading } = useWizardProgress(scenarioId, isEnglish);
  const typedBadges = badges as Record<WizardStepId, { complete: boolean; missingCount: number }>;

  const [mode, setMode] = useState<Mode>(() => {
    try {
      const raw = localStorage.getItem('wizard:mode') as Mode | null;
      return (raw === 'guide' || raw === 'libre') ? raw : 'guide';
    } catch { return 'guide'; }
  });
  const [lastSavedAt, setLastSavedAt] = useState<Date>(() => new Date());
  const saveTimer = useRef<number | null>(null);

  const steps = useMemo<CompletenessStatus[]>(() => progress?.steps ?? [], [progress?.steps]);

  const onToggleMode = async (m: Mode) => {
    setMode(m);
    try { localStorage.setItem('wizard:mode', m); } catch {}
    try { await wizardService.setMode(m, scenarioId); refresh(); } catch {}
  };

  const onSaveNow = useCallback(async () => {
    // Utilise markStepComplete pour rafraîchir le timestamp de sauvegarde
    const current = progress?.current;
    if (!current) return;
    await wizardService.markStepComplete(current, scenarioId);
    const now = new Date();
    setLastSavedAt(now);
    // Laisser un petit toast discret (accessibilité visuelle forte via texte)
    console.log(`[Wizard] Sauvegarde locale effectuée à ${formatTimeOQLF(now)}`);
  }, [progress?.current, scenarioId]);

  // Auto-save debouncée simple: expose une API globale et ajout d'un timer
  useEffect(() => {
    // API globale facultative: window.mprNotifyDataChanged() pour déclencher un auto-save
    (window as any).mprNotifyDataChanged = () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
      }
      saveTimer.current = window.setTimeout(() => {
        onSaveNow();
      }, 600);
    };
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      delete (window as any).mprNotifyDataChanged;
    };
  }, [onSaveNow]);

  // Synchronise la route wizard avec l'état courant si besoin
  useEffect(() => {
    if (!stepId && progress?.current) {
      navigate(`/wizard/${progress.current}`, { replace: true });
    }
  }, [stepId, progress?.current, navigate]);

  const onContinue = async () => {
    if (!progress) return;
    // Aller à la prochaine étape incomplète dans le wizard (pas vers les routes pages)
    const next = progress.nextIncomplete;
    if (!next) {
      // Si tout est complet, aller au budget par défaut
      navigate('/wizard/budget');
      return;
    }
    navigate(`/wizard/${next}`);
  };

  const onBack = () => window.history.back();

  const currentPercent = progress?.percent ?? 0;
  const labels = isEnglish ? STEP_LABELS_EN : STEP_LABELS_FR;

  return (
    <div className="min-h-screen bg-white seniors-mode">
      <div className="container mx-auto px-4 md:px-6 py-6" role="main" aria-label={isEnglish ? 'Guided wizard' : 'Assistant guidé'}>
        {/* En-tête Wizard: titre + mode + progression */}
        <div className="bg-white border-2 border-gray-300 rounded-xl p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center">
                <span className="text-blue-700 font-bold">W</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {isEnglish ? 'Retirement planning wizard' : 'Assistant de planification retraite'}
                </h1>
                <p className="text-gray-700">
                  {isEnglish ? 'Complete the essential information, then refine details as needed.' : 'Complétez l’essentiel, puis affinez les détails au besoin.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Mode */}
              <div className="flex items-center gap-2 bg-gray-50 border rounded-lg p-2">
                <button
                  className={`px-3 py-2 rounded ${mode === 'guide' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                  onClick={() => onToggleMode('guide')}
                >
                  {isEnglish ? 'Simple' : 'Simple'}
                </button>
                <button
                  className={`px-3 py-2 rounded ${mode === 'libre' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                  onClick={() => onToggleMode('libre')}
                >
                  {isEnglish ? 'Advanced' : 'Avancé'}
                </button>
              </div>
              {/* Sauvegarde */}
              <div className="bg-gray-50 border rounded-lg px-3 py-2 text-gray-800 text-sm">
                {isEnglish ? 'Last saved at' : 'Dernière sauvegarde à'} : <strong>{formatTimeOQLF(lastSavedAt)}</strong>
              </div>
              <button
                className="button-primary px-4 py-2"
                onClick={onSaveNow}
                aria-label={isEnglish ? 'Save now' : 'Enregistrer maintenant'}
              >
                {isEnglish ? 'Save' : 'Enregistrer'}
              </button>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded h-3">
              <div className="bg-blue-600 h-3 rounded" style={{ width: `${currentPercent}%` }} />
            </div>
            <div className="mt-2 text-sm text-gray-700">
              {isEnglish ? 'Completion' : 'Achèvement'} : <strong>{currentPercent}%</strong>
            </div>
          </div>

          {/* Liste des étapes avec badges */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {steps.map((s) => {
              const b = typedBadges[s.step as WizardStepId];
              const complete = b?.complete;
              const missing = b?.missingCount ?? 0;
              return (
                <button
                  key={s.step}
                  onClick={() => navigate(`/wizard/${s.step}`)}
                  className={`flex items-center justify-between border rounded-lg px-3 py-2 ${complete ? 'bg-green-50 border-green-300' : 'bg-white border-gray-300'} hover:bg-gray-50`}
                >
                  <span className="text-sm font-semibold text-gray-800 truncate">{labels[s.step] || s.step}</span>
                  <span className={`text-xs ${complete ? 'text-green-700' : 'text-gray-700'}`}>
                    {complete ? (isEnglish ? 'Done' : 'Complet') : (isEnglish ? `${missing} missing` : `${missing} manquant(s)`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu d'étape (Essentiel / Détails) */}
        <div className="bg-white border-2 border-gray-300 rounded-xl p-4 md:p-6">
          <Suspense fallback={<SeniorsLoadingSpinner />}>
            {children}
          </Suspense>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <button onClick={onBack} className="button-secondary px-6 py-3" aria-label={isEnglish ? 'Back' : 'Retour'}>
            {isEnglish ? 'Back' : 'Retour'}
          </button>
          <button onClick={onContinue} className="button-primary px-8 py-3" aria-label={isEnglish ? 'Continue' : 'Continuer'}>
            {isEnglish ? 'Continue' : 'Continuer'}
          </button>
        </div>

        {/* Note mode simple/avancé */}
        <div className="mt-4 text-gray-700 text-sm">
          {mode === 'guide' ? (
            <p>
              {isEnglish
                ? 'Essential group is open; details are folded. You can complete them later.'
                : 'Le groupe “Essentiel” est ouvert; les “Détails (optionnel)” sont repliés. Vous pourrez les compléter plus tard.'}
            </p>
          ) : (
            <p>
              {isEnglish
                ? 'Advanced mode: all sections expanded for full control.'
                : 'Mode avancé : toutes les sections sont dépliées pour un contrôle complet.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
