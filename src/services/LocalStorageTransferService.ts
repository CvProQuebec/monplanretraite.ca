/**
 * Service de transfert des données localStorage vers fichier local
 * Récupère toutes les données, propose une nomenclature, puis vide le localStorage
 */

import { secureStorage } from '@/lib/secureStorage';

interface TransferOptions {
  suggestedFilename?: string;
  description?: string;
  preserveLastSaveInfo?: boolean;
}

interface TransferResult {
  success: boolean;
  filename?: string;
  dataSize?: string;
  error?: string;
  cancelled?: boolean;
}

interface LastSaveInfo {
  filename: string;
  location: string;
  timestamp: string;
}

export class LocalStorageTransferService {
  private static readonly LAST_SAVE_KEY = 'last_save_info';
  private static readonly DEFAULT_PREFIX = 'plan-retraite';

  /**
   * Génère un nom de fichier suggéré basé sur la date actuelle
   */
  private static generateSuggestedFilename(): string {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].replace(/:/g, 'h').substring(0, 5);
    return `${this.DEFAULT_PREFIX}-${date}-${time}.json`;
  }

  /**
   * Récupère toutes les données du localStorage/secureStorage
   */
  private static getAllStorageData(): any {
    const data: any = {};
    
    // Récupérer les données sécurisées
    const secureKeys = secureStorage.keys();
    const secureData: any = {};
    
    secureKeys.forEach(key => {
      try {
        const value = secureStorage.getItem(key);
        if (value !== null) {
          secureData[key] = value;
        }
      } catch (error) {
        console.warn(`Erreur lors de la lecture de la clé sécurisée ${key}:`, error);
      }
    });

    // Récupérer les données non sécurisées pertinentes
    const relevantKeys = [
      'user_profile',
      'retirement_data', 
      'savings_data',
      'income_data',
      'expenses_data',
      'assumptions_data',
      'onboarding_completed',
      'language_preference'
    ];

    const regularData: any = {};
    relevantKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          regularData[key] = JSON.parse(value);
        }
      } catch (error) {
        console.warn(`Erreur lors de la lecture de la clé ${key}:`, error);
      }
    });

    return {
      secureData,
      regularData,
      exportTimestamp: new Date().toISOString(),
      version: '1.0',
      appName: 'Mon Plan Retraite'
    };
  }

  /**
   * Calcule la taille estimée des données
   */
  private static calculateDataSize(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      const sizeInBytes = new Blob([jsonString]).size;
      
      if (sizeInBytes < 1024) {
        return `${sizeInBytes} octets`;
      } else if (sizeInBytes < 1024 * 1024) {
        return `${Math.round(sizeInBytes / 1024)} KB`;
      } else {
        return `${Math.round(sizeInBytes / (1024 * 1024))} MB`;
      }
    } catch {
      return '0 octets';
    }
  }

  /**
   * Sauvegarde les informations de la dernière sauvegarde
   */
  private static saveLastSaveInfo(filename: string, location: string): void {
    const saveInfo: LastSaveInfo = {
      filename,
      location,
      timestamp: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(this.LAST_SAVE_KEY, JSON.stringify(saveInfo));
    } catch (error) {
      console.warn('Impossible de sauvegarder les informations de la dernière sauvegarde:', error);
    }
  }

  /**
   * Récupère les informations de la dernière sauvegarde
   */
  static getLastSaveInfo(): LastSaveInfo | null {
    try {
      const info = localStorage.getItem(this.LAST_SAVE_KEY);
      return info ? JSON.parse(info) : null;
    } catch {
      return null;
    }
  }

  /**
   * Vide toutes les données du localStorage (sauf les infos de dernière sauvegarde)
   */
  private static clearAllStorageData(preserveLastSaveInfo = true): void {
    const lastSaveInfo = preserveLastSaveInfo ? this.getLastSaveInfo() : null;
    
    // Vider le secure storage
    secureStorage.clear();
    
    // Vider le localStorage tout en préservant certaines clés importantes
    const keysToPreserve = [
      'theme', 
      'locale',
      'debug_mode',
      ...(preserveLastSaveInfo ? [this.LAST_SAVE_KEY] : [])
    ];
    
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!keysToPreserve.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Restaurer les informations de dernière sauvegarde si nécessaire
    if (preserveLastSaveInfo && lastSaveInfo) {
      this.saveLastSaveInfo(lastSaveInfo.filename, lastSaveInfo.location);
    }
  }

  /**
   * Transfert principal : récupère données, sauvegarde en fichier, vide localStorage
   */
  static async transferToLocalFile(options: TransferOptions = {}): Promise<TransferResult> {
    try {
      // 1. Récupérer toutes les données
      const allData = this.getAllStorageData();
      const dataSize = this.calculateDataSize(allData);

      // Vérifier s'il y a des données à sauvegarder
      if (Object.keys(allData.secureData).length === 0 && 
          Object.keys(allData.regularData).length === 0) {
        return {
          success: false,
          error: 'Aucune donnée à sauvegarder dans le localStorage'
        };
      }

      // 2. Générer le nom de fichier suggéré ou utiliser celui fourni
      const suggestedFilename = options.suggestedFilename || this.generateSuggestedFilename();

      // 3. Préparer les données pour la sauvegarde
      const exportData = {
        ...allData,
        description: options.description || 'Sauvegarde complète des données de plan de retraite',
        exportInfo: {
          totalDataSize: dataSize,
          exportDate: new Date().toLocaleString('fr-CA'),
          secureDataKeys: Object.keys(allData.secureData),
          regularDataKeys: Object.keys(allData.regularData)
        }
      };

      // 4. Utiliser l'API File System Access si disponible
      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: suggestedFilename,
            types: [{
              description: 'Fichier de sauvegarde Mon Plan Retraite',
              accept: {
                'application/json': ['.json']
              }
            }]
          });

          const writable = await fileHandle.createWritable();
          const jsonData = JSON.stringify(exportData, null, 2);
          await writable.write(jsonData);
          await writable.close();

          // 5. Sauvegarder les infos de la dernière sauvegarde AVANT de vider
          this.saveLastSaveInfo(fileHandle.name, 'Emplacement choisi par l\'utilisateur');

          // 6. Vider le localStorage (en conservant les infos de dernière sauvegarde)
          this.clearAllStorageData(options.preserveLastSaveInfo !== false);

          return {
            success: true,
            filename: fileHandle.name,
            dataSize
          };
        } catch (error: any) {
          if (error.name === 'AbortError') {
            return {
              success: false,
              cancelled: true,
              error: 'Sauvegarde annulée par l\'utilisateur'
            };
          }
          throw error;
        }
      } else {
        // 5. Fallback pour navigateurs plus anciens - téléchargement direct
        const jsonData = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = suggestedFilename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // 6. Sauvegarder les infos de la dernière sauvegarde AVANT de vider
        this.saveLastSaveInfo(suggestedFilename, 'Dossier Téléchargements');

        // 7. Vider le localStorage (en conservant les infos de dernière sauvegarde)
        this.clearAllStorageData(options.preserveLastSaveInfo !== false);

        return {
          success: true,
          filename: suggestedFilename,
          dataSize
        };
      }
    } catch (error) {
      console.error('Erreur lors du transfert vers fichier local:', error);
      return {
        success: false,
        error: `Erreur lors du transfert : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }

  /**
   * Prévisualise les données qui seraient transférées (sans les sauvegarder)
   */
  static previewTransferData(): {
    totalKeys: number;
    secureKeys: string[];
    regularKeys: string[];
    estimatedSize: string;
    hasData: boolean;
  } {
    const allData = this.getAllStorageData();
    const secureKeys = Object.keys(allData.secureData);
    const regularKeys = Object.keys(allData.regularData);
    
    return {
      totalKeys: secureKeys.length + regularKeys.length,
      secureKeys,
      regularKeys,
      estimatedSize: this.calculateDataSize(allData),
      hasData: secureKeys.length > 0 || regularKeys.length > 0
    };
  }

  /**
   * Charge des données depuis un fichier et les restaure dans le localStorage
   */
  static async loadFromLocalFile(file: File): Promise<{
    success: boolean;
    loadedKeys?: string[];
    error?: string;
  }> {
    try {
      const content = await file.text();
      const data = JSON.parse(content);

      // Valider le format des données
      if (!data.version || !data.appName || data.appName !== 'Mon Plan Retraite') {
        throw new Error('Format de fichier non reconnu ou invalide');
      }

      const loadedKeys: string[] = [];

      // Restaurer les données sécurisées
      if (data.secureData && typeof data.secureData === 'object') {
        Object.entries(data.secureData).forEach(([key, value]) => {
          try {
            secureStorage.setItem(key, value);
            loadedKeys.push(`secure:${key}`);
          } catch (error) {
            console.warn(`Erreur lors de la restauration de la clé sécurisée ${key}:`, error);
          }
        });
      }

      // Restaurer les données régulières
      if (data.regularData && typeof data.regularData === 'object') {
        Object.entries(data.regularData).forEach(([key, value]) => {
          try {
            localStorage.setItem(key, JSON.stringify(value));
            loadedKeys.push(`regular:${key}`);
          } catch (error) {
            console.warn(`Erreur lors de la restauration de la clé ${key}:`, error);
          }
        });
      }

      return {
        success: true,
        loadedKeys
      };
    } catch (error) {
      return {
        success: false,
        error: `Erreur lors du chargement : ${error instanceof Error ? error.message : 'Fichier invalide'}`
      };
    }
  }

  /**
   * Utilitaire pour forcer la suppression de toutes les données (pour les tests)
   */
  static clearAllData(includingLastSaveInfo = false): void {
    this.clearAllStorageData(!includingLastSaveInfo);
  }
}