import { secureStorage } from './secureStorage';

export interface MigrationConfig {
  keys: string[];
  onProgress?: (key: string, success: boolean) => void;
  onComplete?: (migrated: number, total: number) => void;
}

export class StorageMigration {
  /**
   * Migre automatiquement toutes les données non sécurisées
   */
  static async migrateAll(config: MigrationConfig): Promise<number> {
    let migratedCount = 0;
    const totalKeys = config.keys.length;

    for (const key of config.keys) {
      try {
        const success = secureStorage.migrateUnsecureData(key);
        if (success) {
          migratedCount++;
        }
        
        config.onProgress?.(key, success);
      } catch (error) {
        console.error(`Erreur lors de la migration de ${key}:`, error);
        config.onProgress?.(key, false);
      }
    }

    config.onComplete?.(migratedCount, totalKeys);
    return migratedCount;
  }

  /**
   * Détecte automatiquement les clés non sécurisées
   */
  static detectUnsecureKeys(): string[] {
    const allKeys = Object.keys(localStorage);
    const securePrefix = 'secure_';
    
    return allKeys.filter(key => !key.startsWith(securePrefix));
  }

  /**
   * Vérifie la sécurité des données existantes
   */
  static auditSecurity(): {
    secure: string[];
    unsecure: string[];
    total: number;
  } {
    const allKeys = Object.keys(localStorage);
    const securePrefix = 'secure_';
    
    const secure = allKeys.filter(key => key.startsWith(securePrefix));
    const unsecure = allKeys.filter(key => !key.startsWith(securePrefix));
    
    return {
      secure,
      unsecure,
      total: allKeys.length
    };
  }

  /**
   * Nettoie les données obsolètes ou corrompues
   */
  static cleanup(): {
    cleaned: number;
    errors: string[];
  } {
    const allKeys = Object.keys(localStorage);
    let cleaned = 0;
    const errors: string[] = [];

    for (const key of allKeys) {
      try {
        const value = localStorage.getItem(key);
        if (!value) {
          localStorage.removeItem(key);
          cleaned++;
          continue;
        }

        // Vérifie si c'est du JSON valide
        try {
          JSON.parse(value);
        } catch {
          // Données corrompues, on les supprime
          localStorage.removeItem(key);
          cleaned++;
          errors.push(`Données corrompues supprimées: ${key}`);
        }
      } catch (error) {
        errors.push(`Erreur lors du nettoyage de ${key}: ${error}`);
      }
    }

    return { cleaned, errors };
  }
}

// Migration automatique au démarrage de l'application
export const initializeSecureStorage = () => {
  // Audit de sécurité
  const audit = StorageMigration.auditSecurity();
  
  if (audit.unsecure.length > 0) {
    console.warn(`${audit.unsecure.length} clés non sécurisées détectées`);
    
    // Migration automatique des données sensibles
    const sensitiveKeys = audit.unsecure.filter(key => 
      key.includes('config') || 
      key.includes('auth') || 
      key.includes('token') ||
      key.includes('password') ||
      key.includes('api') ||
      key.includes('key')
    );

    if (sensitiveKeys.length > 0) {
      StorageMigration.migrateAll({
        keys: sensitiveKeys,
        onProgress: (key, success) => {
          console.log(`Migration ${key}: ${success ? '✅' : '❌'}`);
        },
        onComplete: (migrated, total) => {
          console.log(`Migration terminée: ${migrated}/${total} clés migrées`);
        }
      });
    }
  }

  // Nettoyage des données corrompues
  const cleanup = StorageMigration.cleanup();
  if (cleanup.cleaned > 0) {
    console.log(`Nettoyage: ${cleanup.cleaned} entrées supprimées`);
  }
  if (cleanup.errors.length > 0) {
    console.warn('Erreurs de nettoyage:', cleanup.errors);
  }
}; 