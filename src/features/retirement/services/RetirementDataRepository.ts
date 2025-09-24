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
      const localParsed = safeParse(localStorage.getItem(IMPORT_EXPORT_KEY));

      let chosen: AnyUserData = null;

      if (hasMeaningfulData(localParsed) && !hasMeaningfulData(sessionParsed)) {
        chosen = localParsed;
        try {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(localParsed));
        } catch {}
      } else if (hasMeaningfulData(sessionParsed)) {
        chosen = sessionParsed;
      } else if (localParsed) {
        chosen = localParsed;
      } else {
        chosen = defaults;
      }

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
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    } catch {}
    try {
      localStorage.setItem(IMPORT_EXPORT_KEY, JSON.stringify(data));
    } catch {}
  },

  /**
   * Sauvegarde de sauvegarde lors de beforeunload/visibility hidden.
   */
  saveBackupBeforeUnload(sessionId: string, data: AnyUserData) {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          data,
          timestamp: new Date().toISOString(),
          sessionId,
        })
      );
    } catch {}
  },

  /**
   * Restauration depuis la sauvegarde locale.
   */
  restoreBackup(defaults: AnyUserData): AnyUserData | null {
    try {
      const backup = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!backup) return null;
      const parsed = safeParse(backup);
      if (!parsed?.data) return null;
      return mergeAndValidate(defaults, parsed.data);
    } catch {
      return null;
    }
  },

  /**
   * Nettoyage de la sauvegarde locale.
   */
  clearBackup() {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
  },
};
