import { secureStorage } from '@/lib/secureStorage';
import type { CompletenessStatus, MissingField, WizardStepId, WIZARD_STEP_ORDER } from '@/types/wizard';

/**
 * Fournit les données nécessaires à la validation par étape du wizard.
 * Cette interface permet de découpler la validation des sources de données (SecureStorage, API, etc.).
 */
export interface WizardDataProvider {
  getProfile(scenarioId: string): any | null;
  getRevenus(scenarioId: string): any[] | null;
  getActifs(scenarioId: string): any[] | null;
  getPrestations(scenarioId: string): any | null;
  getDepenses(scenarioId: string): any[] | null;
}

/**
 * Implémentation par défaut: lit depuis SecureStorage avec des clés nommées.
 * Clés utilisées:
 *  - scenario:{id}:profile
 *  - scenario:{id}:revenus
 *  - scenario:{id}:actifs
 *  - scenario:{id}:prestations
 *  - scenario:{id}:depenses
 */
export class SecureStorageWizardProvider implements WizardDataProvider {
  private keyFor(scenarioId: string, section: string) {
    return `scenario:${scenarioId}:${section}`;
  }

  getProfile(scenarioId: string) {
    const key = this.keyFor(scenarioId, 'profile');
    return secureStorage.getItem<any>(key) ?? this.readLocalStorageFallback(key);
  }

  getRevenus(scenarioId: string) {
    const key = this.keyFor(scenarioId, 'revenus');
    return (secureStorage.getItem<any[]>(key) ?? this.readLocalStorageFallback(key)) || [];
  }

  getActifs(scenarioId: string) {
    const key = this.keyFor(scenarioId, 'actifs');
    return (secureStorage.getItem<any[]>(key) ?? this.readLocalStorageFallback(key)) || [];
  }

  getPrestations(scenarioId: string) {
    const key = this.keyFor(scenarioId, 'prestations');
    return secureStorage.getItem<any>(key) ?? this.readLocalStorageFallback(key);
  }

  getDepenses(scenarioId: string) {
    const key = this.keyFor(scenarioId, 'depenses');
    return (secureStorage.getItem<any[]>(key) ?? this.readLocalStorageFallback(key)) || [];
  }

  private readLocalStorageFallback(key: string) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

/**
 * Validation des étapes du Wizard: retourne la liste des champs manquants par étape.
 * Les règles ci-dessous sont minimalistes et robustes (tolérantes à la structure),
 * et s'alignent sur la spécification (src/docs/retirement-navigation-spec.md).
 */
export class WizardValidation {
  constructor(private provider: WizardDataProvider = new SecureStorageWizardProvider()) {}

  /**
   * Valide une étape et retourne la liste des champs manquants/erreurs bloquantes.
   */
  validateStep(step: WizardStepId, scenarioId: string): MissingField[] {
    switch (step) {
      case 'profil':
        return this.validateProfil(scenarioId);
      case 'revenus':
        return this.validateRevenus(scenarioId);
      case 'actifs':
        return this.validateActifs(scenarioId);
      case 'prestations':
        return this.validatePrestations(scenarioId);
      case 'depenses':
        return this.validateDepenses(scenarioId);
      case 'budget':
        // Budget dépend des étapes amont. Si elles sont complètes, budget est accessible.
        return [
          ...this.validateProfil(scenarioId),
          ...this.validateRevenus(scenarioId),
          ...this.validateActifs(scenarioId),
          ...this.validatePrestations(scenarioId),
          ...this.validateDepenses(scenarioId)
        ];
      case 'optimisations':
      case 'plan':
      case 'rapports':
        // Ces étapes requièrent au minimum un budget calculable.
        return this.validateStep('budget', scenarioId);
    }
  }

  /**
   * Construit le statut de complétude pour l'ensemble des étapes.
   */
  computeCompleteness(orderedSteps: WizardStepId[], scenarioId: string): CompletenessStatus[] {
    return orderedSteps.map((step) => {
      const missing = this.validateStep(step, scenarioId);
      return {
        step,
        complete: missing.length === 0,
        missing
      };
    });
  }

  private validateProfil(scenarioId: string): MissingField[] {
    const missing: MissingField[] = [];
    const profile = this.provider.getProfile(scenarioId);

    if (!profile) {
      missing.push({ path: 'profil', label: 'Profil', severity: 'error', help: 'Renseignez votre profil de base' });
      return missing;
    }

    if (!profile.birthDate) {
      missing.push({ path: 'profil.birthDate', label: 'Date de naissance', severity: 'error', help: 'Entrez votre date de naissance (AAAA-MM-JJ)' });
    }
    if (!profile.province) {
      missing.push({ path: 'profil.province', label: 'Province de résidence', severity: 'error', help: 'Sélectionnez votre province' });
    }
    if (!profile.status) {
      missing.push({ path: 'profil.status', label: 'Statut (actif/sans emploi/retraité)', severity: 'error', help: 'Choisissez votre statut actuel' });
    }
    if (profile.hasSpouse && !profile.spouse?.birthDate) {
      missing.push({ path: 'profil.spouse.birthDate', label: 'Date de naissance du conjoint', severity: 'warning', help: 'Recommandé pour des calculs conjoints' });
    }

    return missing;
  }

  private validateRevenus(scenarioId: string): MissingField[] {
    const missing: MissingField[] = [];
    const revenus = this.provider.getRevenus(scenarioId);

    if (!revenus || revenus.length === 0) {
      missing.push({ path: 'revenus', label: 'Revenus', severity: 'error', help: 'Ajoutez au moins une source de revenu (salaire, autonome, AE, pensions, etc.)' });
    }

    return missing;
  }

  private validateActifs(scenarioId: string): MissingField[] {
    const missing: MissingField[] = [];
    const actifs = this.provider.getActifs(scenarioId);

    if (!actifs) {
      // Non initialisé
      missing.push({ path: 'actifs', label: 'Actifs/Investissements', severity: 'error', help: 'Initialisez vos comptes (REER, CELI, non-enregistré, etc.)' });
      return missing;
    }

    // On tolère une liste vide (l’utilisateur peut n’avoir aucun actif), mais on signale en info
    if (Array.isArray(actifs) && actifs.length === 0) {
      missing.push({ path: 'actifs', label: 'Actifs/Investissements (optionnel)', severity: 'info', help: 'Aucun actif déclaré. Vous pouvez passer à la suite si cela reflète votre situation.' });
    }

    return missing;
  }

  private validatePrestations(scenarioId: string): MissingField[] {
    const missing: MissingField[] = [];
    const prestations = this.provider.getPrestations(scenarioId);

    if (!prestations) {
      missing.push({ path: 'prestations', label: 'Prestations gouvernementales', severity: 'error', help: 'Renseignez la RRQ/CPP et SV/OAS (âge souhaité et/ou estimations)' });
      return missing;
    }

    // RRQ — âge ciblé entre 60 et 72 OU estimations disponibles
    const rrqAge = prestations.rrqTargetAge;
    const hasRRQEst = prestations.rrqEstimates && (prestations.rrqEstimates.at60 || prestations.rrqEstimates.at65 || prestations.rrqEstimates.at70 || prestations.rrqEstimates.at72);
    if (!(typeof rrqAge === 'number' && rrqAge >= 60 && rrqAge <= 72) && !hasRRQEst) {
      missing.push({ path: 'prestations.rrqTargetAge', label: 'Âge cible RRQ (60–72) ou estimation RRQ', severity: 'error', help: 'Sélectionnez un âge RRQ ou fournissez des estimations' });
    }

    // SV — âge ciblé entre 65 et 70 OU estimations SV disponibles
    const oasAge = prestations.oasTargetAge;
    const hasOASEst = prestations.oasEstimates && (prestations.oasEstimates.baseAt65 || prestations.oasEstimates.deferralIncreasePctPerMonth);
    if (!(typeof oasAge === 'number' && oasAge >= 65 && oasAge <= 70) && !hasOASEst) {
      missing.push({ path: 'prestations.oasTargetAge', label: 'Âge cible SV (65–70) ou estimation SV', severity: 'error', help: 'Sélectionnez un âge SV ou fournissez des estimations' });
    }

    return missing;
  }

  private validateDepenses(scenarioId: string): MissingField[] {
    const missing: MissingField[] = [];
    const depenses = this.provider.getDepenses(scenarioId);

    if (!depenses || depenses.length === 0) {
      missing.push({ path: 'depenses', label: 'Dépenses', severity: 'error', help: 'Ajoutez au moins une dépense (logement, nourriture, assurances, etc.)' });
    } else {
      // Petit garde-fou: si aucune catégorie essentielle détectée
      const hasEssentials = depenses.some((d: any) => ['housing', 'groceries', 'utilities'].includes(d?.category));
      if (!hasEssentials) {
        missing.push({ path: 'depenses', label: 'Dépenses essentielles', severity: 'warning', help: 'Aucune dépense essentielle détectée (logement, épicerie, électricité). Vérifiez vos entrées.' });
      }
    }

    return missing;
  }
}
