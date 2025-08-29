// src/features/retirement/services/BackupService.ts
import { SecurityService, EncryptedData, BackupMetadata } from './SecurityService';
import { UserData } from '../types';

export interface BackupData {
  userData: UserData;
  metadata: {
    createdAt: number;
    updatedAt: number;
    version: string;
    deviceId: string;
  };
}

export class BackupService {
  private static readonly BACKUP_PREFIX = 'retirement_backup_';
  private static readonly METADATA_KEY = 'retirement_backups_metadata';
  private static readonly MAX_AUTO_BACKUPS = 10;
  private static readonly AUTO_BACKUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  
  /**
   * Crée une sauvegarde chiffrée
   */
  static async createBackup(
    data: UserData,
    password: string,
    description: string = '',
    isAutoBackup: boolean = false
  ): Promise<string> {
    const backupData: BackupData = {
      userData: data,
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: '1.0.0',
        deviceId: this.getDeviceId()
      }
    };
    
    const encrypted = SecurityService.encrypt(backupData);
    const backupId = this.generateBackupId();
    
    // Sauvegarder dans localStorage
    localStorage.setItem(this.BACKUP_PREFIX + backupId, JSON.stringify(encrypted));
    
    // Mettre à jour les métadonnées
    const metadata: BackupMetadata = {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0.0',
      deviceId: this.getDeviceId(),
      id: backupId,
      timestamp: Date.now(),
      description: description || (isAutoBackup ? 'Sauvegarde automatique' : 'Sauvegarde manuelle'),
      size: JSON.stringify(encrypted).length,
      isAutoBackup
    };
    
    this.updateMetadata(metadata);
    
    // Nettoyer les vieilles sauvegardes automatiques
    if (isAutoBackup) {
      this.cleanupOldAutoBackups();
    }
    
    return backupId;
  }
  
  /**
   * Restaure une sauvegarde
   */
  static async restoreBackup(backupId: string, password: string): Promise<BackupData> {
    const encryptedString = localStorage.getItem(this.BACKUP_PREFIX + backupId);
    
    if (!encryptedString) {
      throw new Error('Sauvegarde introuvable');
    }
    
    const encrypted: EncryptedData = JSON.parse(encryptedString);
    return SecurityService.decrypt(encrypted.data);
  }
  
  /**
   * Liste toutes les sauvegardes disponibles
   */
  static listBackups(): BackupMetadata[] {
    const metadataString = localStorage.getItem(this.METADATA_KEY);
    if (!metadataString) return [];
    
    const metadata: BackupMetadata[] = JSON.parse(metadataString);
    return metadata.sort((a, b) => b.timestamp - a.timestamp);
  }
  
  /**
   * Supprime une sauvegarde
   */
  static deleteBackup(backupId: string): void {
    localStorage.removeItem(this.BACKUP_PREFIX + backupId);
    
    const metadata = this.listBackups();
    const filtered = metadata.filter(m => m.id !== backupId);
    localStorage.setItem(this.METADATA_KEY, JSON.stringify(filtered));
  }
  
  /**
   * Exporte une sauvegarde chiffrée
   */
  static async exportBackup(data: UserData, password: string): Promise<Blob> {
    const backupData: BackupData = {
      userData: data,
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: '1.0.0',
        deviceId: this.getDeviceId()
      }
    };
    
    const encrypted = SecurityService.encrypt(backupData);
    const jsonString = JSON.stringify(encrypted, null, 2);
    
    return new Blob([jsonString], { type: 'application/json' });
  }
  
  /**
   * Importe une sauvegarde depuis un fichier
   */
  static async importBackup(file: File, password: string): Promise<BackupData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const encrypted: EncryptedData = JSON.parse(content);
          const decrypted = SecurityService.decrypt(encrypted.data);
          resolve(decrypted);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
      reader.readAsText(file);
    });
  }
  
  /**
   * Génère un ID unique pour la sauvegarde
   */
  private static generateBackupId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  
  /**
   * Obtient un ID unique pour l'appareil
   */
  private static getDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substring(2);
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }
  
  /**
   * Met à jour les métadonnées
   */
  private static updateMetadata(newMetadata: BackupMetadata): void {
    const existing = this.listBackups();
    existing.push(newMetadata);
    localStorage.setItem(this.METADATA_KEY, JSON.stringify(existing));
  }
  
  /**
   * Nettoie les vieilles sauvegardes automatiques
   */
  private static cleanupOldAutoBackups(): void {
    const backups = this.listBackups();
    const autoBackups = backups.filter(b => b.isAutoBackup);
    
    if (autoBackups.length > this.MAX_AUTO_BACKUPS) {
      const toDelete = autoBackups
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, autoBackups.length - this.MAX_AUTO_BACKUPS);
      
      toDelete.forEach(backup => this.deleteBackup(backup.id));
    }
  }
}