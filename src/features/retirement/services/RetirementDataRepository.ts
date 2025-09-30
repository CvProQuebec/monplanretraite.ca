/* RetirementDataRepository
 * Cloisonne la persistance et la migration pour useRetirementData.
 * - Zéro logique UI ici.
 * - 100 % local: sessionStorage/localStorage + migrations.
 */
import { DataMigrationService } from '@/services/DataMigrationService';

const SESSION_STORAGE_KEY = 'retirement-session-data';
const LOCAL_STORAGE_KEY = 'retirement-backup-data';
const IMPORT_EXPORT_KEY = 'retirement_data';

type AnyUserData = any;

function safeParse(raw: string | null) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function hasMeaningfulData(d: AnyUserData) {
  if (!d || typeof d !== 'object') return false;
  const p = d.personal || {};
  const r = d.retirement || {};
  const hasIncome =
    (Array.isArray(p.unifiedIncome1) && p.unifiedIncome1.length > 0) ||
    (Array.isArray(p.unifiedIncome2) && p.unifiedIncome2.length > 0);
  const hasInvest =
    (p.soldeREER1 || 0) > 0 || (p.soldeCELI1 || 0) > 0 || (p.soldeCRI1 || 0) > 0 ||
    (p.soldeREER2 || 0) > 0 || (p.soldeCELI2 || 0) > 0 || (p.soldeCRI2 || 0) > 0;
  const hasBenefits =
    (r.rrqMontantActuel1 || 0) > 0 || (r.rrqMontantActuel2 || 0) > 0 ||
    !!r.svBiannual1 || !!r.svBiannual2;
  return hasIncome || hasInvest || hasBenefits;
}

/**
 * Fusionne data ← defaults, et applique quelques validations simples.
 */
function mergeAndValidate(defaults: AnyUserData, data: AnyUserData): AnyUserData {
  try {
    const merged = {
      ...defaults,
      ...data,
      personal: {
        ...defaults.personal,
        ...data?.personal,
        unifiedIncome1: Array.isArray(data?.personal?.unifiedIncome1) ? data.personal.unifiedIncome1 : [],
        unifiedIncome2: Array.isArray(data?.personal?.unifiedIncome2) ? data.personal.unifiedIncome2 : [],
      },
      retirement: {
        ...defaults.retirement,
        ...data?.retirement,
      },
      savings: {
        ...defaults.savings,
        ...data?.savings,
      },
      cashflow: {
        ...defaults.cashflow,
        ...data?.cashflow,
      },
    };

    // Corriger salaires négatifs
    if (merged.personal.salaire1 < 0 || merged.personal.salaire2 < 0) {
      merged.personal.salaire1 = Math.max(0, merged.personal.salaire1);
      merged.personal.salaire2 = Math.max(0, merged.personal.salaire2);
    }

    // Synchroniser dépenses de retraite (mensuelles) avec depensesMensuelles
    try {
      if ((merged.personal?.depensesMensuelles || 0) > 0) {
        merged.personal.depensesRetraite = merged.personal.depensesMensuelles;
      } else if ((merged.personal?.depensesRetraite || 0) > 0 && (!merged.personal?.depensesMensuelles || merged.personal.depensesMensuelles === 0)) {
        merged.personal.depensesMensuelles = merged.personal.depensesRetraite;
      }
    } catch {}

    // Harmoniser investissements: préférer section savings.*, refléter dans personal.solde*
    try {
      const mapPairs: Array<[keyof AnyUserData['savings'], keyof AnyUserData['personal']]> = [
        ['reer1', 'soldeREER1'],
        ['reer2', 'soldeREER2'],
        ['celi1', 'soldeCELI1'],
        ['celi2', 'soldeCELI2'],
        ['cri1',  'soldeCRI1'],
        ['cri2',  'soldeCRI2'],
      ] as any;

      for (const [sKey, pKey] of mapPairs) {
        const sVal = Number(merged.savings?.[sKey] ?? 0);
        const pVal = Number(merged.personal?.[pKey] ?? 0);
        // Si savings est vide mais personal a une valeur: copier vers savings
        if ((sVal || 0) <= 0 && (pVal || 0) > 0) {
          merged.savings[sKey] = pVal;
        }
        // Si savings a une valeur et personal est vide: refléter vers personal.solde*
        if ((sVal || 0) > 0 && (pVal || 0) <= 0) {
          merged.personal[pKey] = sVal;
        }
      }
    } catch {}

    // Normalisation Personne 2 absente OU célibataire: remettre à zéro pour éviter des incohérences
    const maritalSingle = (merged.personal?.statutMatrimonial || '').toLowerCase() === 'celibataire' || (merged.personal?.statutMatrimonial || '').toLowerCase() === 'single';
    const p2HasAny =
      !!(merged.personal?.prenom2 || merged.personal?.nom2 || merged.personal?.naissance2 || merged.personal?.sexe2 || merged.personal?.salaire2);
    if (maritalSingle || !p2HasAny) {
      try { merged.personal.prenom2 = ''; } catch {}
      try { merged.personal.nom2 = ''; } catch {}
      try { merged.personal.naissance2 = ''; } catch {}
      try { merged.personal.sexe2 = '' as any; } catch {}
      try { merged.personal.salaire2 = 0; } catch {}
      try { merged.personal.unifiedIncome2 = []; } catch {}
      try {
        merged.savings.reer2 = 0;
        merged.savings.celi2 = 0;
        merged.savings.placements2 = 0;
        merged.savings.epargne2 = 0;
        merged.savings.cri2 = 0;
      } catch {}
    }

    return merged;
  } catch {
    return defaults;
  }
}

export const RetirementDataRepository = {
  /**
   * Charge les données initiales avec préférence aux données importées complètes.
   * - defaults: objet UserData par défaut (vide).
   * - Retourne un objet UserData valide.
   */
  loadInitialData(defaults: AnyUserData): AnyUserData {
    try {
      const sessionParsed = safeParse(sessionStorage.getItem(SESSION_STORAGE_KEY));
      // Politique « aucune donnée conservée »: ne jamais recharger automatiquement
      // depuis localStorage; n'utiliser que la session courante ou des valeurs par défaut.
      let chosen: AnyUserData = hasMeaningfulData(sessionParsed) ? sessionParsed : defaults;

      // Migration si nécessaire
      try {
        if (chosen && DataMigrationService.needsMigration()) {
          const migrationResult = DataMigrationService.migrateUserData(chosen);
          if (migrationResult?.success) {
            DataMigrationService.saveMigratedData(chosen);
          }
        }
      } catch {}

      return mergeAndValidate(defaults, chosen);
    } catch {
      return defaults;
    }
  },

  /**
   * Sauvegarde courante (session + local) non bloquante.
   */
  save(data: AnyUserData) {
    // Sauvegarde éphémère uniquement dans la session en cours
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    } catch {}
  },

  /**
   * Sauvegarde de sauvegarde lors de beforeunload/visibility hidden.
   */
  saveBackupBeforeUnload(sessionId: string, data: AnyUserData) {
    // Désactivé pour respecter la politique: aucune persistance automatique locale
    return;
  },

  /**
   * Restauration depuis la sauvegarde locale.
   */
  restoreBackup(defaults: AnyUserData): AnyUserData | null {
    // Désactivé: l'utilisateur doit importer manuellement son fichier
    return null;
  },

  /**
   * Nettoyage de la sauvegarde locale.
   */
  clearBackup() {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(IMPORT_EXPORT_KEY);
    } catch {}
  },
};
