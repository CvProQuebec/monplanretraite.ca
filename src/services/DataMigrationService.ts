// src/services/DataMigrationService.ts
// Service pour migrer les données existantes vers la nouvelle structure

export interface MigrationResult {
  success: boolean;
  migratedFields: string[];
  errors: string[];
}

export class DataMigrationService {
  private static readonly VERSION = '1.1.0';
  private static readonly MIGRATION_KEY = 'data_migration_version';

  /**
   * Vérifie si une migration est nécessaire
   */
  static needsMigration(): boolean {
    const currentVersion = localStorage.getItem(this.MIGRATION_KEY);
    return currentVersion !== this.VERSION;
  }

  /**
   * Migre les données vers la nouvelle structure
   */
  static migrateUserData(userData: any): MigrationResult {
    const result: MigrationResult = {
      success: true,
      migratedFields: [],
      errors: []
    };

    try {
      // Migration 1: S'assurer que unifiedIncome1 et unifiedIncome2 existent
      if (!userData.personal) {
        userData.personal = {};
      }

      if (!Array.isArray(userData.personal.unifiedIncome1)) {
        userData.personal.unifiedIncome1 = [];
        result.migratedFields.push('unifiedIncome1');
      }

      if (!Array.isArray(userData.personal.unifiedIncome2)) {
        userData.personal.unifiedIncome2 = [];
        result.migratedFields.push('unifiedIncome2');
      }

      // Migration 2: Valider et nettoyer les entrées de revenus existantes
      this.migrateIncomeEntries(userData.personal.unifiedIncome1, result);
      this.migrateIncomeEntries(userData.personal.unifiedIncome2, result);

      // Migration 3: S'assurer que les champs de dates sont au bon format
      this.migrateDateFields(userData.personal.unifiedIncome1, result);
      this.migrateDateFields(userData.personal.unifiedIncome2, result);

      // Marquer la migration comme terminée
      localStorage.setItem(this.MIGRATION_KEY, this.VERSION);

    } catch (error) {
      result.success = false;
      result.errors.push(`Erreur lors de la migration: ${error}`);
    }

    return result;
  }

  /**
   * Migre les entrées de revenus individuelles
   */
  private static migrateIncomeEntries(incomeEntries: any[], result: MigrationResult): void {
    if (!Array.isArray(incomeEntries)) return;

    incomeEntries.forEach((entry, index) => {
      try {
        // S'assurer que l'ID existe
        if (!entry.id) {
          entry.id = `income-${Date.now()}-${index}`;
          result.migratedFields.push(`entry-${index}-id`);
        }

        // S'assurer que le type est valide
        const validTypes = ['salaire', 'rentes', 'assurance-emploi', 'dividendes', 'revenus-location', 'travail-autonome', 'autres'];
        if (!validTypes.includes(entry.type)) {
          entry.type = 'autres';
          result.migratedFields.push(`entry-${index}-type`);
        }

        // S'assurer que isActive est défini
        if (typeof entry.isActive !== 'boolean') {
          entry.isActive = true;
          result.migratedFields.push(`entry-${index}-isActive`);
        }

        // S'assurer que les champs de dates sont des chaînes
        const dateFields = [
          'salaryStartDate', 'salaryEndDate', 'salaryFirstPaymentDate', 'salaryRevisionDate',
          'eiStartDate', 'eiFirstPaymentDate', 'eiRevisionDate',
          'pensionStartDate', 'pensionFirstPaymentDate'
        ];

        dateFields.forEach(field => {
          if (entry[field] && typeof entry[field] !== 'string') {
            if (entry[field] instanceof Date) {
              entry[field] = entry[field].toISOString().split('T')[0];
            } else {
              entry[field] = '';
            }
            result.migratedFields.push(`entry-${index}-${field}`);
          }
        });

        // S'assurer que les montants sont des nombres
        const amountFields = [
          'annualAmount', 'monthlyAmount', 'weeklyAmount', 'salaryNetAmount', 'salaryRevisionAmount',
          'weeklyGross', 'weeklyNet', 'eiRevisionAmount', 'pensionAmount'
        ];

        amountFields.forEach(field => {
          if (entry[field] !== undefined && typeof entry[field] !== 'number') {
            entry[field] = parseFloat(entry[field]) || 0;
            result.migratedFields.push(`entry-${index}-${field}`);
          }
        });

      } catch (error) {
        result.errors.push(`Erreur migration entrée ${index}: ${error}`);
      }
    });
  }

  /**
   * Migre les champs de dates vers le format ISO
   */
  private static migrateDateFields(incomeEntries: any[], result: MigrationResult): void {
    if (!Array.isArray(incomeEntries)) return;

    incomeEntries.forEach((entry, index) => {
      const dateFields = [
        'salaryStartDate', 'salaryEndDate', 'salaryFirstPaymentDate', 'salaryRevisionDate',
        'eiStartDate', 'eiFirstPaymentDate', 'eiRevisionDate',
        'pensionStartDate', 'pensionFirstPaymentDate'
      ];

      dateFields.forEach(field => {
        if (entry[field] && typeof entry[field] === 'string') {
          try {
            // Vérifier si c'est déjà au format ISO
            const date = new Date(entry[field]);
            if (!isNaN(date.getTime())) {
              // Convertir en format YYYY-MM-DD si nécessaire
              const isoDate = date.toISOString().split('T')[0];
              if (entry[field] !== isoDate) {
                entry[field] = isoDate;
                result.migratedFields.push(`entry-${index}-${field}-format`);
              }
            }
          } catch (error) {
            // Si la date n'est pas valide, la supprimer
            entry[field] = '';
            result.migratedFields.push(`entry-${index}-${field}-invalid`);
          }
        }
      });
    });
  }

  /**
   * Sauvegarde les données migrées
   */
  static saveMigratedData(userData: any): void {
    try {
      localStorage.setItem('retirement_data', JSON.stringify(userData));
      console.log('✅ Données migrées sauvegardées');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des données migrées:', error);
    }
  }
}
