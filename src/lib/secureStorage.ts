import CryptoJS from 'crypto-js';

export interface SecureStorageConfig {
  key?: string;
  prefix?: string;
  version?: string;
}

export interface EncryptedData {
  data: string;
  iv: string;
  salt: string;
  version: string;
  timestamp: number;
}

export class SecureStorage {
  private static readonly DEFAULT_PREFIX = 'secure_';
  private static readonly VERSION = '1.0.0';
  private static readonly PBKDF2_ITERATIONS = 100000;
  private static readonly KEY_SIZE = 256;
  
  private key: string;
  private prefix: string;
  private version: string;

  constructor(config: SecureStorageConfig = {}) {
    this.key = config.key || this.generateSecureKey();
    this.prefix = config.prefix || SecureStorage.DEFAULT_PREFIX;
    this.version = config.version || SecureStorage.VERSION;
  }

  /**
   * Génère une clé sécurisée basée sur des entropies multiples
   */
  private generateSecureKey(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString();
    const userAgent = navigator.userAgent;
    const screenInfo = `${screen.width}x${screen.height}`;
    
    // Combinaison de plusieurs sources d'entropie
    const entropy = `${timestamp}-${random}-${userAgent}-${screenInfo}`;
    return CryptoJS.SHA256(entropy).toString();
  }

  /**
   * Génère un salt cryptographiquement sécurisé
   */
  private generateSalt(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Génère un vecteur d'initialisation sécurisé
   */
  private generateIV(): string {
    const array = new Uint8Array(12); // 96 bits pour GCM
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Dérive une clé à partir du mot de passe et du salt
   */
  private deriveKey(password: string, salt: string): string {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: SecureStorage.KEY_SIZE / 32,
      iterations: SecureStorage.PBKDF2_ITERATIONS
    }).toString();
  }

  /**
   * Chiffre les données avec AES-256-GCM
   */
  private encrypt(data: string, key: string): EncryptedData {
    const salt = this.generateSalt();
    const iv = this.generateIV();
    const derivedKey = this.deriveKey(key, salt);

    // Utilisation d'AES-256-GCM pour une sécurité maximale
    const encrypted = CryptoJS.AES.encrypt(data, derivedKey, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.GCM,
      padding: CryptoJS.pad.NoPadding
    });

    return {
      data: encrypted.toString(),
      iv,
      salt,
      version: this.version,
      timestamp: Date.now()
    };
  }

  /**
   * Déchiffre les données
   */
  private decrypt(encryptedData: EncryptedData, key: string): string {
    try {
      const derivedKey = this.deriveKey(key, encryptedData.salt);
      
      const decrypted = CryptoJS.AES.decrypt(encryptedData.data, derivedKey, {
        iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
        mode: CryptoJS.mode.GCM,
        padding: CryptoJS.pad.NoPadding
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error('Échec du déchiffrement: données corrompues ou clé incorrecte');
    }
  }

  /**
   * Stocke une valeur de manière sécurisée
   */
  setItem(key: string, value: any): void {
    try {
      const jsonValue = JSON.stringify(value);
      const encrypted = this.encrypt(jsonValue, this.key);
      const storageKey = this.prefix + key;
      
      localStorage.setItem(storageKey, JSON.stringify(encrypted));
    } catch (error) {
      console.error('Erreur lors du chiffrement:', error);
      throw new Error('Impossible de chiffrer les données');
    }
  }

  /**
   * Récupère une valeur de manière sécurisée
   */
  getItem<T = any>(key: string): T | null {
    try {
      const storageKey = this.prefix + key;
      const encryptedString = localStorage.getItem(storageKey);
      
      if (!encryptedString) {
        return null;
      }

      const encrypted: EncryptedData = JSON.parse(encryptedString);
      
      // Vérification de la version pour compatibilité
      if (encrypted.version !== this.version) {
        console.warn(`Version de chiffrement différente: ${encrypted.version} vs ${this.version}`);
      }

      const decrypted = this.decrypt(encrypted, this.key);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Erreur lors du déchiffrement:', error);
      return null;
    }
  }

  /**
   * Supprime une valeur
   */
  removeItem(key: string): void {
    const storageKey = this.prefix + key;
    localStorage.removeItem(storageKey);
  }

  /**
   * Vérifie si une clé existe
   */
  hasItem(key: string): boolean {
    const storageKey = this.prefix + key;
    return localStorage.getItem(storageKey) !== null;
  }

  /**
   * Nettoie toutes les données sécurisées
   */
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Liste toutes les clés sécurisées
   */
  keys(): string[] {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.substring(this.prefix.length));
  }

  /**
   * Migre les données non sécurisées vers le format sécurisé
   */
  migrateUnsecureData(key: string): boolean {
    const unsecureKey = key;
    const secureKey = this.prefix + key;
    
    const unsecureData = localStorage.getItem(unsecureKey);
    if (!unsecureData) {
      return false;
    }

    try {
      // Tente de parser les données non sécurisées
      const parsedData = JSON.parse(unsecureData);
      
      // Stocke en version sécurisée
      this.setItem(key, parsedData);
      
      // Supprime l'ancienne version
      localStorage.removeItem(unsecureKey);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
      return false;
    }
  }

  /**
   * Obtient la clé de chiffrement (pour sauvegarde)
   */
  getKey(): string {
    return this.key;
  }

  /**
   * Définit une nouvelle clé de chiffrement
   */
  setKey(newKey: string): void {
    this.key = newKey;
  }
}

// Instance par défaut pour une utilisation simple
export const secureStorage = new SecureStorage();

// Export des types pour utilisation externe
export type { SecureStorageConfig, EncryptedData }; 