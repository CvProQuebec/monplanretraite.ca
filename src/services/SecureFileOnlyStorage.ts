// src/services/SecureFileOnlyStorage.ts
// Service de sauvegarde sécurisé qui évite le stockage local permanent
// et force les utilisateurs à gérer leurs propres fichiers

export interface TemporaryData {
  data: any;
  timestamp: number;
  sessionId: string;
  warningShown: boolean;
}

export interface SaveFileMetadata {
  version: string;
  timestamp: number;
  sessionId: string;
  dataType: string;
  checksum: string;
}

export interface SecureSaveFile {
  metadata: SaveFileMetadata;
  data: any;
}

export class SecureFileOnlyStorage {
  private static readonly VERSION = '1.0.0';
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly SAVE_REMINDER_INTERVAL = 5 * 60 * 1000; // 5 minutes - rappels plus fréquents
  private static readonly TEMP_KEY_PREFIX = 'temp_session_';
  private static readonly EMERGENCY_KEY_PREFIX = 'emergency_';
  
  private sessionId: string;
  private saveReminderTimer: NodeJS.Timeout | null = null;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private hasLoadedData: boolean = false;
  private isDataModified: boolean = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeSession();
    this.setupSaveReminderSystem();
    this.setupCleanupSystem();
  }

  /**
   * Génère un ID de session unique
   */
  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}_${random}`;
  }

  /**
   * Génère un checksum pour vérifier l'intégrité des données
   */
  private generateChecksum(data: any): string {
    const jsonString = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Initialise la session et nettoie les anciennes données
   */
  private initializeSession(): void {
    // Nettoyer toutes les anciennes sessions temporaires
    this.clearAllTemporaryData();
    
    // Vérifier si le cache a été nettoyé (pas de données de session)
    const hasSessionData = sessionStorage.getItem('session_active');
    if (!hasSessionData) {
      // Le cache a été nettoyé, forcer le vidage de tous les champs
      this.clearAllApplicationData();
      this.showCacheClearedWarning();
    }
    
    // Marquer la session comme active
    sessionStorage.setItem('session_active', this.sessionId);
  }

  /**
   * Configure le système de rappels de sauvegarde
   */
  private setupSaveReminderSystem(): void {
    // Rappel de sauvegarde toutes les 5 minutes
    this.saveReminderTimer = setInterval(() => {
      if (this.isDataModified && this.hasLoadedData) {
        this.showSaveReminder();
      }
    }, SecureFileOnlyStorage.SAVE_REMINDER_INTERVAL);

    // Avertissement obligatoire avant fermeture de page
    window.addEventListener('beforeunload', (e) => {
      if (this.isDataModified && this.hasLoadedData) {
        e.preventDefault();
        e.returnValue = 'ATTENTION: Vous devez sauvegarder vos données avant de quitter. Toutes les modifications seront perdues!';
        return e.returnValue;
      }
    });

    // Rappel lors de la perte de focus (changement d'onglet)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isDataModified && this.hasLoadedData) {
        this.showSaveReminder();
      }
    });
  }

  /**
   * Configure le système de nettoyage automatique
   */
  private setupCleanupSystem(): void {
    // Nettoyage automatique après 30 minutes
    this.cleanupTimer = setTimeout(() => {
      this.showSessionExpiredWarning();
      this.clearAllTemporaryData();
      this.clearAllApplicationData();
    }, SecureFileOnlyStorage.SESSION_TIMEOUT);
  }

  /**
   * Stocke des données temporairement (en mémoire uniquement)
   */
  storeTemporary(key: string, data: any): void {
    const tempData: TemporaryData = {
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      warningShown: false
    };

    // Utiliser sessionStorage pour stockage temporaire uniquement
    // (sera supprimé à la fermeture de l'onglet)
    sessionStorage.setItem(
      SecureFileOnlyStorage.TEMP_KEY_PREFIX + key, 
      JSON.stringify(tempData)
    );

    // Redémarrer le timer de nettoyage
    this.resetCleanupTimer();
  }

  /**
   * Récupère des données temporaires
   */
  getTemporary(key: string): any | null {
    const tempDataString = sessionStorage.getItem(
      SecureFileOnlyStorage.TEMP_KEY_PREFIX + key
    );
    
    if (!tempDataString) {
      return null;
    }

    try {
      const tempData: TemporaryData = JSON.parse(tempDataString);
      
      // Vérifier si les données ne sont pas expirées
      const age = Date.now() - tempData.timestamp;
      if (age > SecureFileOnlyStorage.SESSION_TIMEOUT) {
        this.removeTemporary(key);
        return null;
      }

      // Vérifier si c'est la même session
      if (tempData.sessionId !== this.sessionId) {
        this.removeTemporary(key);
        return null;
      }

      return tempData.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données temporaires:', error);
      return null;
    }
  }

  /**
   * Supprime des données temporaires
   */
  removeTemporary(key: string): void {
    sessionStorage.removeItem(SecureFileOnlyStorage.TEMP_KEY_PREFIX + key);
  }

  /**
   * Vérifie s'il y a des données temporaires
   */
  hasTemporaryData(): boolean {
    const keys = Object.keys(sessionStorage);
    return keys.some(key => key.startsWith(SecureFileOnlyStorage.TEMP_KEY_PREFIX));
  }

  /**
   * Exporte les données vers un fichier que l'utilisateur doit sauvegarder
   */
  exportToFile(data: any, filename: string, dataType: string = 'retirement_data'): void {
    const saveFile: SecureSaveFile = {
      metadata: {
        version: SecureFileOnlyStorage.VERSION,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        dataType,
        checksum: this.generateChecksum(data)
      },
      data
    };

    const blob = new Blob([JSON.stringify(saveFile, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Afficher un message de confirmation
    this.showExportSuccessMessage(filename);
  }

  /**
   * Importe des données depuis un fichier
   */
  async importFromFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const saveFile: SecureSaveFile = JSON.parse(content);
          
          // Vérifier la structure du fichier
          if (!saveFile.metadata || !saveFile.data) {
            throw new Error('Format de fichier invalide');
          }

          // Vérifier la version
          if (saveFile.metadata.version !== SecureFileOnlyStorage.VERSION) {
            console.warn(`Version différente: ${saveFile.metadata.version} vs ${SecureFileOnlyStorage.VERSION}`);
          }

          // Vérifier l'intégrité des données
          const expectedChecksum = this.generateChecksum(saveFile.data);
          if (saveFile.metadata.checksum !== expectedChecksum) {
            throw new Error('Données corrompues: checksum invalide');
          }

          resolve(saveFile.data);
        } catch (error) {
          reject(new Error(`Erreur lors de l'importation: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Force le vidage de toutes les données de l'application
   */
  private clearAllApplicationData(): void {
    // Émettre un événement pour que l'application vide tous ses champs
    const event = new CustomEvent('forceDataClear', {
      detail: { reason: 'cache_cleared_or_session_expired' }
    });
    window.dispatchEvent(event);
  }

  /**
   * Nettoie toutes les données temporaires
   */
  clearAllTemporaryData(): void {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(SecureFileOnlyStorage.TEMP_KEY_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  }

  /**
   * Redémarre le timer de nettoyage
   */
  private resetCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
    }
    
    this.cleanupTimer = setTimeout(() => {
      this.showSessionExpiredWarning();
      this.clearAllTemporaryData();
      this.clearAllApplicationData();
    }, SecureFileOnlyStorage.SESSION_TIMEOUT);
  }

  /**
   * Affiche un rappel urgent de sauvegarde
   */
  private showSaveReminder(): void {
    const event = new CustomEvent('showSaveReminder', {
      detail: { 
        message: 'RAPPEL IMPORTANT: Vous devez sauvegarder vos données maintenant pour éviter de les perdre!',
        type: 'warning'
      }
    });
    window.dispatchEvent(event);
  }

  /**
   * Affiche un avertissement pour sauvegarder
   */
  private showSaveWarning(): void {
    const event = new CustomEvent('showSaveWarning', {
      detail: { 
        message: 'Pensez à sauvegarder vos données dans un fichier pour éviter de les perdre.',
        type: 'warning'
      }
    });
    window.dispatchEvent(event);
  }

  /**
   * Affiche un avertissement de session expirée
   */
  private showSessionExpiredWarning(): void {
    const event = new CustomEvent('showSessionExpired', {
      detail: { 
        message: 'Votre session a expiré. Toutes les données ont été supprimées pour votre sécurité. Veuillez charger vos données depuis votre dernière sauvegarde.',
        type: 'error'
      }
    });
    window.dispatchEvent(event);
  }

  /**
   * Affiche un avertissement que le cache a été nettoyé
   */
  private showCacheClearedWarning(): void {
    const event = new CustomEvent('showCacheCleared', {
      detail: { 
        message: 'Le cache du navigateur a été nettoyé. Tous les champs ont été vidés pour votre sécurité. Veuillez charger vos données depuis votre dernière sauvegarde.',
        type: 'info'
      }
    });
    window.dispatchEvent(event);
  }

  /**
   * Affiche un message de succès d'exportation
   */
  private showExportSuccessMessage(filename: string): void {
    const event = new CustomEvent('showExportSuccess', {
      detail: { 
        message: `Fichier "${filename}" sauvegardé avec succès. Conservez-le en lieu sûr!`,
        type: 'success'
      }
    });
    window.dispatchEvent(event);
  }

  /**
   * Nettoie les timers lors de la destruction
   */
  destroy(): void {
    if (this.saveReminderTimer) {
      clearInterval(this.saveReminderTimer);
    }
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
    }
  }

  /**
   * Marque que des données ont été chargées depuis un fichier
   */
  markDataAsLoaded(): void {
    this.hasLoadedData = true;
    this.isDataModified = false;
  }

  /**
   * Marque que les données ont été modifiées
   */
  markDataAsModified(): void {
    this.isDataModified = true;
  }

  /**
   * Marque que les données ont été sauvegardées
   */
  markDataAsSaved(): void {
    this.isDataModified = false;
  }

  /**
   * Vérifie si l'utilisateur a chargé des données
   */
  hasUserLoadedData(): boolean {
    return this.hasLoadedData;
  }

  /**
   * Vérifie si les données ont été modifiées
   */
  isDataDirty(): boolean {
    return this.isDataModified;
  }

  /**
   * Force l'affichage du message de chargement obligatoire
   */
  showMustLoadDataWarning(): void {
    const event = new CustomEvent('showMustLoadData', {
      detail: { 
        message: 'ATTENTION: Vous devez charger vos données depuis votre dernière sauvegarde avant de commencer à utiliser l\'application.',
        type: 'error'
      }
    });
    window.dispatchEvent(event);
  }

  /**
   * Stocke des données d'urgence (seulement en cas de panne)
   */
  storeEmergencyData(key: string, data: any): void {
    const emergencyData = {
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      reason: 'emergency_crash_recovery'
    };

    sessionStorage.setItem(
      SecureFileOnlyStorage.EMERGENCY_KEY_PREFIX + key, 
      JSON.stringify(emergencyData)
    );

    // Afficher un message d'urgence
    const event = new CustomEvent('showEmergencyDataStored', {
      detail: { 
        message: 'Données d\'urgence sauvegardées suite à un problème. Rechargez la page et importez vos données.',
        type: 'warning'
      }
    });
    window.dispatchEvent(event);
  }

  /**
   * Récupère des données d'urgence
   */
  getEmergencyData(key: string): any | null {
    const emergencyDataString = sessionStorage.getItem(
      SecureFileOnlyStorage.EMERGENCY_KEY_PREFIX + key
    );
    
    if (!emergencyDataString) {
      return null;
    }

    try {
      const emergencyData = JSON.parse(emergencyDataString);
      return emergencyData.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données d\'urgence:', error);
      return null;
    }
  }

  /**
   * Nettoie les données d'urgence
   */
  clearEmergencyData(): void {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(SecureFileOnlyStorage.EMERGENCY_KEY_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  }

  /**
   * Obtient des informations sur la session actuelle
   */
  getSessionInfo(): {
    sessionId: string;
    startTime: number;
    hasTemporaryData: boolean;
    timeRemaining: number;
    hasLoadedData: boolean;
    isDataModified: boolean;
  } {
    const sessionStart = parseInt(this.sessionId.split('_')[0]);
    const timeRemaining = Math.max(0, SecureFileOnlyStorage.SESSION_TIMEOUT - (Date.now() - sessionStart));
    
    return {
      sessionId: this.sessionId,
      startTime: sessionStart,
      hasTemporaryData: this.hasTemporaryData(),
      timeRemaining,
      hasLoadedData: this.hasLoadedData,
      isDataModified: this.isDataModified
    };
  }
}

// Instance singleton pour utilisation globale
export const secureFileStorage = new SecureFileOnlyStorage();
