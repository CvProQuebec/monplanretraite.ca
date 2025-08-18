// src/features/retirement/services/SecurityService.ts
import CryptoJS from 'crypto-js';

// Configuration sécurisée
const PBKDF2_ITERATIONS = 100000; // Sécurité renforcée
const generateSalt = () => crypto.getRandomValues(new Uint8Array(16));

export interface EncryptedData {
  encryptedContent: string;
  iv: string;
  salt: string;
  timestamp: number;
  version: string;
}

export interface BackupMetadata {
  id: string;
  timestamp: number;
  description: string;
  size: number;
  isAutoBackup: boolean;
}

export class SecurityService {
  private static readonly VERSION = '1.0.0';
  
  /**
   * Dérive une clé à partir du mot de passe
   */
  private static deriveKey(password: string, salt: string): string {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: PBKDF2_ITERATIONS
    }).toString();
  }
  
  /**
   * Chiffre les données avec AES-256
   */
  static encrypt(data: any, password: string): EncryptedData {
    const jsonString = JSON.stringify(data);
    const salt = Array.from(generateSalt()).map(b => b.toString(16).padStart(2, '0')).join('');
    const iv = Array.from(generateSalt()).map(b => b.toString(16).padStart(2, '0')).join('');
    const key = this.deriveKey(password, salt);
    
    const encrypted = CryptoJS.AES.encrypt(jsonString, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return {
      encryptedContent: encrypted.toString(),
      iv,
      salt,
      timestamp: Date.now(),
      version: this.VERSION
    };
  }
  
  /**
   * Déchiffre les données
   */
  static decrypt(encryptedData: EncryptedData, password: string): any {
    try {
      const key = this.deriveKey(password, encryptedData.salt);
      
      const decrypted = CryptoJS.AES.decrypt(encryptedData.encryptedContent, key, {
        iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error('Mot de passe incorrect ou données corrompues');
    }
  }
  
  /**
   * Génère un hash sécurisé du mot de passe pour validation
   */
  static hashPassword(password: string): string {
    const salt = Array.from(generateSalt()).map(b => b.toString(16).padStart(2, '0')).join('');
    const hash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: PBKDF2_ITERATIONS
    }).toString();
    
    return `${salt}:${hash}`;
  }
  
  /**
   * Vérifie un mot de passe contre son hash
   */
  static verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    const computedHash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: PBKDF2_ITERATIONS
    }).toString();
    
    return hash === computedHash;
  }
  
  /**
   * Génère un nom de fichier sécurisé pour l'export
   */
  static generateSecureFilename(): string {
    const date = new Date().toISOString().split('T')[0];
    const random = Array.from(generateSalt()).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 8);
    return `planif-retraite-${date}-${random}.enc`;
  }
}