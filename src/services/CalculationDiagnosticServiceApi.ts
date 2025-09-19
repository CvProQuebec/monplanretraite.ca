import { WIZARD_STEP_ORDER, type WizardStepId, type MissingField } from '@/types/wizard';
import { WizardValidation, SecureStorageWizardProvider } from '@/services/WizardValidation';

/**
 * API légère conforme à la spécification pour diagnostiquer la complétude et les anomalies.
 * - nextIncompleteStep: retourne la prochaine étape incomplète
 * - anomalies: retourne l'ensemble des MissingField bloquants/avertissements agrégés
 */
export class CalculationDiagnosticServiceApiImpl {
  private readonly validator: WizardValidation;

  constructor() {
    const provider = new SecureStorageWizardProvider();
    this.validator = new WizardValidation(provider);
  }

  async nextIncompleteStep(scenarioId: string): Promise<WizardStepId | null> {
    const completeness = this.validator.computeCompleteness(WIZARD_STEP_ORDER, scenarioId);
    const next = completeness.find((c) => !c.complete)?.step || null;
    return next ?? null;
  }

  async anomalies(scenarioId: string): Promise<MissingField[]> {
    // Agrège les MissingField de toutes les étapes
    const results: MissingField[] = [];
    for (const step of WIZARD_STEP_ORDER) {
      const missing = this.validator.validateStep(step, scenarioId);
      // Ne pas dupliquer les mêmes chemins
      missing.forEach((m) => {
        if (!results.find((r) => r.path === m.path)) {
          results.push(m);
        }
      });
    }
    return results;
  }
}

export const calculationDiagnosticServiceApi = new CalculationDiagnosticServiceApiImpl();
