import { secureStorage } from '@/lib/secureStorage';
import {
  type WizardStepId,
  type WizardProgress,
  type MissingField,
  type WizardState,
  WIZARD_STEP_ORDER,
} from '@/types/wizard';
import { WizardValidation, SecureStorageWizardProvider } from '@/services/WizardValidation';

/**
 * Service de navigation/complétude du Wizard unifié
 * - Calcule la complétude par étape
 * - Contrôle la progression (peut-on avancer ?)
 * - Persiste l'état courant (étape actuelle, mode, timestamps)
 * - Applique des actions transversales (ex.: âges RRQ/SV via CTA)
 *
 * Clés de stockage:
 *  - wizard:{scenarioId}:state         -> WizardState
 *  - scenario:{id}:{section}           -> données (profile, revenus, actifs, prestations, depenses)
 */
export class WizardService {
  private static instance: WizardService;
  private readonly validator: WizardValidation;

  private constructor() {
    const provider = new SecureStorageWizardProvider();
    this.validator = new WizardValidation(provider);
  }

  public static getInstance(): WizardService {
    if (!WizardService.instance) {
      WizardService.instance = new WizardService();
    }
    return WizardService.instance;
  }

  // ------------------------------------
  // Lecture/écriture de l'état du wizard
  // ------------------------------------

  private stateKey(scenarioId: string) {
    return `wizard:${scenarioId}:state`;
  }

  getState(scenarioId: string): WizardState {
    const key = this.stateKey(scenarioId);
    const state = secureStorage.getItem<WizardState>(key);
    return (
      state || {
        currentStep: 'profil',
        scenarioId,
        lastSavedAt: Date.now(),
        mode: 'guide',
      }
    );
  }

  private saveState(next: WizardState) {
    const key = this.stateKey(next.scenarioId);
    secureStorage.setItem(key, { ...next, lastSavedAt: Date.now() });
  }

  // ---------------------
  // API de progression UX
  // ---------------------

  async getProgress(scenarioId: string): Promise<WizardProgress> {
    const steps = WIZARD_STEP_ORDER;
    const completeness = this.validator.computeCompleteness(steps, scenarioId);

    const completedCount = completeness.filter((c) => c.complete).length;
    const percent = Math.round((completedCount / steps.length) * 100);
    const nextIncomplete = completeness.find((c) => !c.complete)?.step;

    const state = this.getState(scenarioId);
    const current: WizardStepId = state.currentStep || steps[0];

    return {
      steps: completeness,
      current,
      nextIncomplete,
      percent,
    };
  }

  async getNextIncompleteStep(scenarioId: string): Promise<WizardStepId | null> {
    const steps = WIZARD_STEP_ORDER;
    const completeness = this.validator.computeCompleteness(steps, scenarioId);
    return completeness.find((c) => !c.complete)?.step || null;
  }

  async canProceed(step: WizardStepId, scenarioId: string): Promise<{ ok: boolean; missing: MissingField[] }> {
    const missing = this.validator.validateStep(step, scenarioId);
    return { ok: missing.length === 0, missing };
  }

  async markStepComplete(step: WizardStepId, scenarioId: string): Promise<void> {
    // Dans cette implémentation, la complétude est dérivée des données (validation).
    // On se contente d'actualiser l'état (timestamp) pour permettre des hooks/analytics.
    const state = this.getState(scenarioId);
    this.saveState({ ...state, currentStep: step });
  }

  async goTo(step: WizardStepId, scenarioId: string): Promise<void> {
    const state = this.getState(scenarioId);
    this.saveState({ ...state, currentStep: step });
  }

  /**
   * Définit le mode du wizard ('guide' | 'libre') et persiste l'état
   */
  async setMode(mode: 'guide' | 'libre', scenarioId: string): Promise<void> {
    const state = this.getState(scenarioId);
    this.saveState({ ...state, mode });
  }

  // ---------------------------------
  // Actions transversales (CTA Apply)
  // ---------------------------------

  private prestationsKey(scenarioId: string) {
    return `scenario:${scenarioId}:prestations`;
  }

  async applyRRQAge(age: number, scenarioId: string): Promise<void> {
    if (typeof age !== 'number' || age < 60 || age > 72) {
      throw new Error('Âge RRQ invalide (doit être 60–72)');
    }
    const key = this.prestationsKey(scenarioId);
    const current = secureStorage.getItem<any>(key) || {};
    const updated = { ...current, rrqTargetAge: age };
    secureStorage.setItem(key, updated);

    // Optionnel: déplacer l'étape courante vers /budget après application (comportement UI)
    const state = this.getState(scenarioId);
    this.saveState({ ...state, currentStep: 'budget' });
    // Tracking éventuel: à brancher sur un client analytics si disponible
    // analytics.track({ type: 'RRQAgeApplied', age, scenarioId })
  }

  async applyOASAge(age: number, scenarioId: string): Promise<void> {
    if (typeof age !== 'number' || age < 65 || age > 70) {
      throw new Error('Âge SV invalide (doit être 65–70)');
    }
    const key = this.prestationsKey(scenarioId);
    const current = secureStorage.getItem<any>(key) || {};
    const updated = { ...current, oasTargetAge: age };
    secureStorage.setItem(key, updated);

    const state = this.getState(scenarioId);
    this.saveState({ ...state, currentStep: 'budget' });
    // analytics.track({ type: 'OASAgeApplied', age, scenarioId })
  }

  // ---------------------------------
  // Ordre de retraits (ordre fiscal)
  // ---------------------------------
  private withdrawalKey(scenarioId: string) {
    return `scenario:${scenarioId}:withdrawal`;
  }

  /**
   * Applique l'ordre de retraits fiscal (ex.: ['CELI','PLACEMENTS_NON_ENREGISTRES','REER_OPTIMISE'])
   * et positionne l'étape courante sur "optimisations".
   */
  async applyWithdrawalOrder(order: string[], scenarioId: string): Promise<void> {
    if (!Array.isArray(order) || order.length === 0) {
      throw new Error('Ordre de retrait invalide');
    }
    const key = this.withdrawalKey(scenarioId);
    const current = secureStorage.getItem<any>(key) || {};
    const updated = { ...current, order, appliedAt: Date.now() };
    secureStorage.setItem(key, updated);

    const state = this.getState(scenarioId);
    this.saveState({ ...state, currentStep: 'optimisations' });
    // analytics.track({ type: 'WithdrawalOrderApplied', order, scenarioId })
  }
}

// Export singleton
export const wizardService = WizardService.getInstance();

// Types exportés si besoin externe
export type { WizardProgress };
