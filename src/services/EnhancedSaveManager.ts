/**
 * Service de sauvegarde amélioré avec choix du nom et emplacement
 */

import { LicenseManager } from './LicenseManager';

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
   * Sauvegarde les données avec choix du nom de fichier
   */
  static async saveWithDialog(userData: any, options: SaveOptions = {}): Promise<SaveResult> {
    try {
      // Vérifier la licence avant de sauvegarder
      const licenseCheck = LicenseManager.checkLicense(userData);
      
      if (!licenseCheck.isValid) {
        return {
          success: false,
          blocked: true,
          reason: licenseCheck.reason,
          error: 'Sauvegarde bloquée par la protection de licence'
        };
      }

      // Générer le nom de fichier
      const filename = this.generateFilename(userData, options);
      
      // Préparer les données à sauvegarder
      const saveData = this.prepareSaveData(userData);
      
      // Créer le blob avec les données
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
          
          // Sauvegarder le profil après succès
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
              error: 'Sauvegarde annulée par l\'utilisateur'
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
        
        // Déclencher le téléchargement
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Sauvegarder le profil après succès
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
   * Charge un fichier avec dialogue de sélection
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
          
          // Valider les données chargées
          const validatedData = this.validateLoadedData(data);
          
          // Vérifier la licence pour les nouvelles données
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
              error: 'Chargement annulé par l\'utilisateur'
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
                error: 'Aucun fichier sélectionné'
              });
              return;
            }
            
            try {
              const content = await file.text();
              const data = JSON.parse(content);
              const validatedData = this.validateLoadedData(data);
              
              // Vérifier la licence pour les nouvelles données
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
   * Génère un nom de fichier basé sur les données utilisateur
   */
  private static generateFilename(userData: any, options: SaveOptions): string {
    let filename = options.filename || this.DEFAULT_FILENAME;
    
    // Ajouter le nom du profil si disponible
    if (userData.personal?.prenom1) {
      const nom1 = userData.personal.prenom1.replace(/[^a-zA-Z0-9\-_]/g, '');
      const nom2 = userData.personal?.prenom2?.replace(/[^a-zA-Z0-9\-_]/g, '') || '';
      
      if (nom2) {
        filename = `${nom1}-et-${nom2}-retraite`;
      } else {
        filename = `${nom1}-retraite`;
      }
    }
    
    // Ajouter timestamp si demandé
    if (options.includeTimestamp !== false) {
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      filename += `-${timestamp}`;
    }
    
    return filename + this.FILE_EXTENSION;
  }

  /**
   * Prépare les données pour la sauvegarde
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
   * Valide les données chargées depuis un fichier
   */
  private static validateLoadedData(data: any): any {
    // Vérifier la structure de base
    if (!data || typeof data !== 'object') {
      throw new Error('Format de fichier invalide');
    }
    
    // Si c'est un ancien format (données directes)
    if (data.personal && !data.data) {
      return data;
    }
    
    // Si c'est le nouveau format (avec métadonnées)
    if (data.data && data.version) {
      return data.data;
    }
    
    throw new Error('Format de fichier non reconnu');
  }

  /**
   * Vérifie si l'utilisateur peut sauvegarder (protection licence)
   */
  static canSave(userData: any): { canSave: boolean; reason?: string } {
    const licenseCheck = LicenseManager.checkLicense(userData);
    
    return {
      canSave: licenseCheck.isValid,
      reason: licenseCheck.reason
    };
  }

  /**
   * Vérifie si l'utilisateur peut charger un nouveau profil
   */
  static canLoad(): { canLoad: boolean; reason?: string; currentProfile?: string } {
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
      reason: 'Un profil est déjà actif. Une licence ne peut être utilisée que pour un seul couple.',
      currentProfile: profileName
    };
  }

  /**
   * Active le code promo pour tests
   */
  static activateTestMode(code: string): boolean {
    return LicenseManager.activateMultiProfileCode(code);
  }

  /**
   * Réinitialise la licence (pour les tests)
   */
  static resetLicense(): void {
    LicenseManager.clearCurrentProfile();
    localStorage.removeItem('promo-code');
    console.log('🔄 Licence réinitialisée');
  }
}
