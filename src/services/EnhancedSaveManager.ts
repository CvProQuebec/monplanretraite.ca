/**
 * Service de sauvegarde amÃ©liorÃ© avec choix du nom et emplacement
 */

import { LicenseManager } from './LicenseManager';
import { generateFilename } from '../utils/nameUtils';

interface SaveOptions {
  filename?: string;
  includeTimestamp?: boolean;
  format?: 'json' | 'encrypted';
}

interface SaveResult {
  success: boolean;
  filename?: string;
  error?: string;
  blocked?: boolean;
  reason?: string;
}

export class EnhancedSaveManager {
  private static readonly DEFAULT_FILENAME = 'mon-plan-retraite';
  private static readonly FILE_EXTENSION = '.json';

  /**
   * Sauvegarde les donnÃ©es avec choix du nom de fichier
   */
  static async saveWithDialog(userData: any, options: SaveOptions = {}): Promise<SaveResult> {
    try {
      // TEMPORAIRE: DÃ©sactivation du blocage de licence pour 1 mois
      // VÃ©rifier la licence avant de sauvegarder
      // const licenseCheck = LicenseManager.checkLicense(userData);
      
      // if (!licenseCheck.isValid) {
      //   return {
      //     success: false,
      //     blocked: true,
      //     reason: licenseCheck.reason,
      //     error: 'Sauvegarde bloquÃ©e par la protection de licence'
      //   };
      // }

      // GÃ©nÃ©rer le nom de fichier
      const filename = this.generateFilename(userData, options);
      
      // PrÃ©parer les donnÃ©es Ã  sauvegarder
      const saveData = this.prepareSaveData(userData);
      
      // CrÃ©er le blob avec les donnÃ©es
      const dataStr = JSON.stringify(saveData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Utiliser l'API File System Access si disponible (Chrome/Edge moderne)
      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: filename,
            types: [{
              description: 'Fichiers de plan de retraite',
              accept: { 'application/json': ['.json'] }
            }]
          });
          
          const writable = await fileHandle.createWritable();
          await writable.write(dataBlob);
          await writable.close();
          
          // Sauvegarder le profil aprÃ¨s succÃ¨s
          LicenseManager.saveCurrentProfile(userData);
          LicenseManager.updateLastSaved();
          
          return {
            success: true,
            filename: fileHandle.name
          };
        } catch (error: any) {
          if (error.name === 'AbortError') {
            return {
              success: false,
              error: 'Sauvegarde annulÃ©e par l\'utilisateur'
            };
          }
          throw error;
        }
      } else {
        // Fallback pour les navigateurs plus anciens
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        // DÃ©clencher le tÃ©lÃ©chargement
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Sauvegarder le profil aprÃ¨s succÃ¨s
        LicenseManager.saveCurrentProfile(userData);
        LicenseManager.updateLastSaved();
        
        return {
          success: true,
          filename: filename
        };
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return {
        success: false,
        error: `Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }

  /**
   * Charge un fichier avec dialogue de sÃ©lection
   */
  static async loadWithDialog(): Promise<{ success: boolean; data?: any; error?: string; blocked?: boolean; reason?: string }> {
    try {
      // Utiliser l'API File System Access si disponible
      if ('showOpenFilePicker' in window) {
        try {
          const [fileHandle] = await (window as any).showOpenFilePicker({
            types: [{
              description: 'Fichiers de plan de retraite',
              accept: { 'application/json': ['.json'] }
            }],
            multiple: false
          });
          
          const file = await fileHandle.getFile();
          const content = await file.text();
          const data = JSON.parse(content);
          
          // Valider les donnÃ©es chargÃ©es
          const validatedData = this.validateLoadedData(data);
          
          // VÃ©rifier la licence pour les nouvelles donnÃ©es
          const licenseCheck = LicenseManager.checkLicense(validatedData);
          
          if (!licenseCheck.isValid) {
            return {
              success: false,
              blocked: true,
              reason: licenseCheck.reason
            };
          }
          
          return {
            success: true,
            data: validatedData
          };
        } catch (error: any) {
          if (error.name === 'AbortError') {
            return {
              success: false,
              error: 'Chargement annulÃ© par l\'utilisateur'
            };
          }
          throw error;
        }
      } else {
        // Fallback pour les navigateurs plus anciens
        return new Promise((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.json';
          
          input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) {
              resolve({
                success: false,
                error: 'Aucun fichier sÃ©lectionnÃ©'
              });
              return;
            }
            
            try {
              const content = await file.text();
              const data = JSON.parse(content);
              const validatedData = this.validateLoadedData(data);
              
              // VÃ©rifier la licence pour les nouvelles donnÃ©es
              const licenseCheck = LicenseManager.checkLicense(validatedData);
              
              if (!licenseCheck.isValid) {
                resolve({
                  success: false,
                  blocked: true,
                  reason: licenseCheck.reason
                });
                return;
              }
              
              resolve({
                success: true,
                data: validatedData
              });
            } catch (error) {
              resolve({
                success: false,
                error: `Erreur lors du chargement: ${error instanceof Error ? error.message : 'Fichier invalide'}`
              });
            }
          };
          
          input.click();
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      return {
        success: false,
        error: `Erreur lors du chargement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }

  /**
   * Sauvegarde directe sans dialogue (utilise le nom de fichier gÃ©nÃ©rÃ© automatiquement)
   */
  static async saveDirectly(userData: any, options: SaveOptions = {}): Promise<SaveResult> {
    try {
      // VÃ©rifier la licence avant de sauvegarder
      const licenseCheck = LicenseManager.checkLicense(userData);
      
      if (!licenseCheck.isValid) {
        return {
          success: false,
          blocked: true,
          reason: licenseCheck.reason,
          error: 'Sauvegarde bloquÃ©e par la protection de licence'
        };
      }

      // GÃ©nÃ©rer le nom de fichier avec la nouvelle mÃ©thode
      const filename = options.filename || generateFilename(userData, options.includeTimestamp !== false);
      
      // PrÃ©parer les donnÃ©es Ã  sauvegarder
      const saveData = this.prepareSaveData(userData);
      
      // CrÃ©er le blob avec les donnÃ©es
      const dataStr = JSON.stringify(saveData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // TÃ©lÃ©chargement direct
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // DÃ©clencher le tÃ©lÃ©chargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Sauvegarder le profil aprÃ¨s succÃ¨s
      LicenseManager.saveCurrentProfile(userData);
      LicenseManager.updateLastSaved();
      
      return {
        success: true,
        filename: filename
      };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde directe:', error);
      return {
        success: false,
        error: `Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }

  /**
   * GÃ©nÃ¨re un nom de fichier basÃ© sur les donnÃ©es utilisateur (mÃ©thode dÃ©prÃ©ciÃ©e)
   */
  private static generateFilename(userData: any, options: SaveOptions): string {
    // Utiliser la nouvelle mÃ©thode
    return options.filename || generateFilename(userData, options.includeTimestamp !== false);
  }

  /**
   * PrÃ©pare les donnÃ©es pour la sauvegarde
   */
  private static prepareSaveData(userData: any): any {
    const saveData = {
      version: '2.0',
      createdAt: new Date().toISOString(),
      appName: 'Mon Plan Retraite',
      licenseInfo: LicenseManager.getProfileInfo(),
      data: userData
    };
    
    return saveData;
  }

  /**
   * Valide les donnÃ©es chargÃ©es depuis un fichier
   */
  private static validateLoadedData(data: any): any {
    // VÃ©rifier la structure de base
    if (!data || typeof data !== 'object') {
      throw new Error('Format de fichier invalide');
    }
    
    // Si c'est un ancien format (donnÃ©es directes)
    if (data.personal && !data.data) {
      return data;
    }
    
    // Si c'est le nouveau format (avec mÃ©tadonnÃ©es)
    if (data.data && data.version) {
      return data.data;
    }
    
    throw new Error('Format de fichier non reconnu');
  }

  /**
   * VÃ©rifie si l'utilisateur peut sauvegarder (protection licence)
   * TEMPORAIRE: DÃ©sactivation du blocage de licence pour 1 mois
   */
  static canSave(userData: any): { canSave: boolean; reason?: string } {
    // TEMPORAIRE: DÃ©sactivation du blocage de licence pour 1 mois
    // const licenseCheck = LicenseManager.checkLicense(userData);
    
    // return {
    //   canSave: licenseCheck.isValid,
    //   reason: licenseCheck.reason
    // };
    
    return {
      canSave: true,
      reason: 'Blocage de licence temporairement dÃ©sactivÃ©'
    };
  }

  /**
   * VÃ©rifie si l'utilisateur peut charger un nouveau profil
   * TEMPORAIRE: DÃ©sactivation du blocage de licence pour 1 mois
   */
  static canLoad(): { canLoad: boolean; reason?: string; currentProfile?: string } {
    // TEMPORAIRE: Toujours autoriser le chargement
    return {
      canLoad: true,
      reason: 'Blocage de licence temporairement dÃ©sactivÃ©'
    };

    // CODE ORIGINAL COMMENTÃ‰ POUR RÃ‰ACTIVATION DANS 1 MOIS:
    /*
    const currentProfile = LicenseManager.getCurrentProfile();
    const hasMultiCode = LicenseManager.hasMultiProfileCode();
    
    if (hasMultiCode) {
      return {
        canLoad: true,
        reason: 'Code promo MULTIPLE2025 actif'
      };
    }
    
    if (!currentProfile) {
      return {
        canLoad: true,
        reason: 'Aucun profil actuel'
      };
    }
    
    const profileName = currentProfile.nom2 
      ? `${currentProfile.nom1} et ${currentProfile.nom2}`
      : currentProfile.nom1;
    
    return {
      canLoad: false,
      reason: 'Un profil est dÃ©jÃ  actif. Une licence ne peut Ãªtre utilisÃ©e que pour un seul couple.',
      currentProfile: profileName
    };
    */
  }

  /**
   * Active le code promo pour tests
   */
  static activateTestMode(code: string): boolean {
    return LicenseManager.activateMultiProfileCode(code);
  }

  /**
   * RÃ©initialise la licence (pour les tests)
   */
  static resetLicense(): void {
    LicenseManager.clearCurrentProfile();
    localStorage.removeItem('promo-code');
    console.log('ðŸ”„ Licence rÃ©initialisÃ©e');
  }
}


