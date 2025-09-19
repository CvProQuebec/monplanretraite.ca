/**
 * Types de base pour le Wizard unifié (navigation et complétude)
 * Aligné avec: src/docs/retirement-navigation-spec.md
 */

export type WizardStepId =
  | 'profil'
  | 'revenus'
  | 'actifs'
  | 'prestations'
  | 'depenses'
  | 'budget'
  | 'optimisations'
  | 'plan'
  | 'rapports';

export const WIZARD_STEP_ORDER: WizardStepId[] = [
  'profil',
  'revenus',
  'actifs',
  'prestations',
  'depenses',
  'budget',
  'optimisations',
  'plan',
  'rapports',
];

export interface MissingField {
  path: string; // ex: 'profile.birthDate'
  label: string; // ex: 'Date de naissance'
  severity?: 'info' | 'warning' | 'error';
  help?: string; // message d'aide contextuel
}

export interface CompletenessStatus {
  step: WizardStepId;
  complete: boolean;
  missing: MissingField[];
}

export interface WizardProgress {
  steps: CompletenessStatus[];
  current: WizardStepId;
  nextIncomplete?: WizardStepId;
  percent: number; // 0..100
}

export interface WizardState {
  currentStep: WizardStepId;
  scenarioId: string;
  lastSavedAt?: number;
  mode: 'guide' | 'libre';
}
