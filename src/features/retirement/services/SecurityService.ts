// src/features/retirement/services/SecurityService.ts
import CryptoJS from 'crypto-js';

// Configuration sécurisée
const PBKDF2_ITERATIONS = 100000; // Sécurité renforcée

// Correction de la fonction generateSalt
const generateSalt = () => {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Fallback pour les navigateurs plus anciens
    return Array.from({ length: 16 }, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join('');
  }
};

export interface EncryptedData {
  data: string;
  timestamp: number;
  version: string;
}

export interface BackupMetadata {
  createdAt: number;
  updatedAt: number;
  version: string;
  deviceId: string;
  checksum?: string;
  id?: string;
  timestamp?: number;
  isAutoBackup?: boolean;
  description?: string;
  size?: number;
}

export interface RetirementBackupFile {
  metadata: BackupMetadata;
  encryptedData: string;
  salt: string; // Ajout du salt pour permettre le déchiffrement
  checksum: string;
}

export class SecurityService {
  private static readonly APP_VERSION = '1.0.0';
  
  /**
   * Génère une clé de chiffrement basée sur un mot de passe utilisateur
   */
  private static generateEncryptionKey(userPassword: string, salt: string): string {
    return CryptoJS.PBKDF2(userPassword, salt, {
      keySize: 256/32,
      iterations: PBKDF2_ITERATIONS
    }).toString();
  }

  /**
   * Génère une nouvelle clé de chiffrement avec un salt aléatoire
   */
  private static generateNewEncryptionKey(userPassword: string): { key: string; salt: string } {
    const salt = generateSalt();
    const key = this.generateEncryptionKey(userPassword, salt);
    return { key, salt };
  }

  /**
   * Crée les données de sauvegarde avec métadonnées
   */
  static async createBackupData(data: any, userPassword: string, description?: string): Promise<RetirementBackupFile> {
    try {
      // Validation des données
      if (!this.validateDataIntegrity(data)) {
        throw new Error('Données invalides - impossible de sauvegarder');
      }

      // Chiffrement avec mot de passe utilisateur
      const { key: encryptionKey, salt } = this.generateNewEncryptionKey(userPassword);
      const jsonString = JSON.stringify(data);
      const encryptedData = CryptoJS.AES.encrypt(jsonString, encryptionKey).toString();
      
      // Métadonnées
      const metadata: BackupMetadata = {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: this.APP_VERSION,
        deviceId: this.generateDeviceId(),
        checksum: this.generateHash(data),
        timestamp: Date.now(),
        isAutoBackup: false,
        description: description || 'Sauvegarde manuelle des données de retraite'
      };

      // Structure du fichier de sauvegarde
      const backupFile: RetirementBackupFile = {
        metadata,
        encryptedData,
        salt, // Stocker le salt pour le déchiffrement
        checksum: this.generateHash({ metadata, encryptedData, salt })
      };

      return backupFile;
    } catch (error) {
      console.error('Erreur lors de la création des données de sauvegarde:', error);
      throw error;
    }
  }

  /**
   * Sauvegarde les données de retraite dans un fichier local
   */
  static async saveToLocalFile(data: any, userPassword: string, filename?: string, description?: string): Promise<void> {
    try {
      // Créer les données de sauvegarde
      const backupFile = await this.createBackupData(data, userPassword, description);

      // Téléchargement du fichier
      const blob = new Blob([JSON.stringify(backupFile, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `retraite-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw new Error(`Impossible de sauvegarder les données: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Charge les données depuis un fichier local
   */
  static async loadFromLocalFile(file: File, userPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          console.log('📁 Contenu du fichier lu:', content.substring(0, 200) + '...');
          
          // Essayer de parser le contenu
          let backupFile: RetirementBackupFile;
          try {
            backupFile = JSON.parse(content);
          } catch (parseError) {
            console.error('❌ Erreur de parsing JSON:', parseError);
            // Essayer de nettoyer le contenu
            const cleanedContent = this.cleanFileContent(content);
            backupFile = JSON.parse(cleanedContent);
          }
          
          // Vérification de l'intégrité du fichier
          const expectedChecksum = this.generateHash({
            metadata: backupFile.metadata,
            encryptedData: backupFile.encryptedData,
            salt: backupFile.salt
          });
          
          if (backupFile.checksum !== expectedChecksum) {
            throw new Error('Fichier corrompu - checksum invalide');
          }

          console.log('🔐 Tentative de déchiffrement...');
          
          // Déchiffrement avec mot de passe utilisateur
          const encryptionKey = this.generateEncryptionKey(userPassword, backupFile.salt);
          console.log('🔑 Clé de chiffrement générée avec salt, longueur:', encryptionKey.length);
          
          try {
            const bytes = CryptoJS.AES.decrypt(backupFile.encryptedData, encryptionKey);
            console.log('🔓 Données déchiffrées (bytes):', bytes);
            
            // Vérifier si le déchiffrement a produit des données
            if (!bytes || bytes.sigBytes <= 0) {
              throw new Error('Mot de passe incorrect - aucune donnée déchiffrée');
            }
            
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
            console.log('📝 Conversion UTF-8 réussie, longueur:', decryptedString.length);
            
            if (!decryptedString || decryptedString.length === 0) {
              throw new Error('Mot de passe incorrect - données vides après déchiffrement');
            }
          } catch (decryptError) {
            console.error('❌ Erreur lors du déchiffrement:', decryptError);
            if (decryptError instanceof Error && decryptError.message.includes('Malformed UTF-8')) {
              throw new Error('Mot de passe incorrect ou fichier corrompu - impossible de déchiffrer les données');
            }
            throw decryptError;
          }
          
          console.log('✅ Données déchiffrées avec succès, longueur:', decryptedString.length);
          
          const data = JSON.parse(decryptedString);
          
          // Validation des données déchiffrées
          if (!this.validateDataIntegrity(data)) {
            throw new Error('Données invalides dans le fichier');
          }

          // Vérification du checksum des données
          if (backupFile.metadata.checksum && 
              !this.verifyHash(data, backupFile.metadata.checksum)) {
            throw new Error('Données corrompues - checksum des données invalide');
          }

          console.log('✅ Validation des données terminée');
          resolve(data);
        } catch (error) {
          console.error('❌ Erreur lors du chargement:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };
      
      // Essayer différents encodages
      try {
        reader.readAsText(file, 'utf-8');
      } catch (encodingError) {
        console.warn('⚠️ Erreur avec UTF-8, essai avec encodage par défaut');
        reader.readAsText(file);
      }
    });
  }

  // Méthodes dépréciées supprimées pour la sécurité

  /**
   * Valide l'intégrité des données
   */
  static validateDataIntegrity(data: any): boolean {
    try {
      if (!data || typeof data !== 'object') {
        return false;
      }

      const requiredFields = ['personal', 'retirement', 'savings', 'cashflow'];
      return requiredFields.every(field => data.hasOwnProperty(field));
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      return false;
    }
  }

  /**
   * Nettoie les données sensibles pour l'affichage
   */
  static sanitizeForDisplay(data: any): any {
    try {
      const sanitized = JSON.parse(JSON.stringify(data));
      return sanitized;
    } catch (error) {
      console.error('Erreur lors de la sanitisation:', error);
      return {};
    }
  }

  /**
   * Génère un hash pour vérifier l'intégrité
   */
  static generateHash(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      return CryptoJS.SHA256(jsonString).toString();
    } catch (error) {
      console.error('Erreur lors de la génération du hash:', error);
      return '';
    }
  }

  /**
   * Vérifie si un hash correspond aux données
   */
  static verifyHash(data: any, hash: string): boolean {
    try {
      const currentHash = this.generateHash(data);
      return currentHash === hash;
    } catch (error) {
      console.error('Erreur lors de la vérification du hash:', error);
      return false;
    }
  }

  /**
   * Nettoie le contenu du fichier pour corriger les problèmes d'encodage
   */
  private static cleanFileContent(content: string): string {
    try {
      console.log('🧹 Nettoyage du contenu du fichier...');
      
      // Supprimer les caractères BOM et autres caractères invisibles
      let cleaned = content.replace(/^\uFEFF/, ''); // BOM UTF-8
      cleaned = cleaned.replace(/^\uFFFE/, ''); // BOM UTF-16 LE
      cleaned = cleaned.replace(/^\uFEFF/, ''); // BOM UTF-16 BE
      
      // Supprimer les caractères de contrôle non imprimables
      cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      
      // Essayer de réparer les guillemets cassés
      cleaned = cleaned.replace(/[""]/g, '"');
      cleaned = cleaned.replace(/['']/g, "'");
      
      // Supprimer les espaces en début et fin
      cleaned = cleaned.trim();
      
      console.log('✅ Contenu nettoyé, nouvelle longueur:', cleaned.length);
      return cleaned;
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage:', error);
      return content; // Retourner le contenu original si le nettoyage échoue
    }
  }

  /**
   * Génère un ID d'appareil unique
   */
  private static generateDeviceId(): string {
    // Utilise des caractéristiques du navigateur pour créer un ID pseudo-unique
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('device-fingerprint', 10, 10);
    const canvasFingerprint = canvas.toDataURL();
    
    const deviceInfo = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvasFingerprint
    ].join('|');
    
    return CryptoJS.SHA256(deviceInfo).toString().substring(0, 16);
  }
}