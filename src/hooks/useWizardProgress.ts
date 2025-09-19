import { useCallback, useEffect, useMemo, useState } from 'react';
import { wizardService } from '@/services/WizardService';
import type { WizardProgress, WizardStepId } from '@/types/wizard';

/**
 * Mappe une étape du wizard vers une route applicative existante.
 * Remarque: la route "actifs" est mappée au tableau de bord retraite.
 */
export function mapStepToPath(step: WizardStepId, isEnglish: boolean): string {
  switch (step) {
    case 'profil':
      return isEnglish ? '/profile' : '/profil';
    case 'revenus':
      return isEnglish ? '/my-income' : '/mes-revenus';
    case 'actifs':
      return isEnglish ? '/my-retirement' : '/ma-retraite';
    case 'prestations':
      // Point d'entrée principal pour les prestations (RRQ/CPP)
      return '/rrq-quick-compare';
    case 'depenses':
      return isEnglish ? '/expenses' : '/depenses';
    case 'budget':
      return isEnglish ? '/my-budget' : '/mon-budget';
    case 'optimisations':
      return isEnglish ? '/tax-optimization' : '/optimisation-fiscale';
    case 'plan':
      return isEnglish ? '/expert-planning' : '/planification-expert';
    case 'rapports':
      return isEnglish ? '/en/retirement-reports' : '/fr/rapports-retraite';
  }
}

/**
 * Hook de progression du Wizard unifié.
 * - Récupère la progression et la prochaine étape incomplète
 * - Expose un chemin "nextPath" prêt à être utilisé pour le bouton "Continuer"
 * - Fournit un rafraîchissement manuel
 */
export function useWizardProgress(scenarioId: string, isEnglish: boolean) {
  const [progress, setProgress] = useState<WizardProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    if (!scenarioId) return;
    setLoading(true);
    try {
      const p = await wizardService.getProgress(scenarioId);
      setProgress(p);
    } finally {
      setLoading(false);
    }
  }, [scenarioId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const nextPath = useMemo(() => {
    if (!progress?.nextIncomplete) return null;
    return mapStepToPath(progress.nextIncomplete, isEnglish);
  }, [progress?.nextIncomplete, isEnglish]);

  const currentPath = useMemo(() => {
    if (!progress?.current) return null;
    return mapStepToPath(progress.current, isEnglish);
  }, [progress?.current, isEnglish]);

  const badges = useMemo(() => {
    if (!progress) return {};
    // Retourne un dictionnaire stepId -> { complete, missingCount }
    return Object.fromEntries(
      progress.steps.map((s) => [s.step, { complete: s.complete, missingCount: s.missing.length }])
    ) as Record<WizardStepId, { complete: boolean; missingCount: number }>;
  }, [progress]);

  return {
    loading,
    progress,
    badges,
    nextPath,
    currentPath,
    refresh,
  };
}

export default useWizardProgress;
