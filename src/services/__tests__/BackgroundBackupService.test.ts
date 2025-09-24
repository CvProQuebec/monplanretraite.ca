/**
 * Tests de confidentialité pour BackgroundBackupService
 * - Vérifie qu'aucune donnée en clair n'est écrite dans le fichier de sauvegarde
 * - Vérifie le clearLocalAfterBackup
 * - Vérifie la restauration via proposeRestoreIfNeeded avec mot de passe valide
 *
 * Ces tests se basent sur des mocks JSDOM (indexedDB, File System Access API).
 */

import BackgroundBackupService from '@/services/BackgroundBackupService';

// Mock fileCrypto (enveloppe chiffrée déterministe)
jest.mock('@/lib/fileCrypto', () => ({
  encryptToEnvelope: jest.fn(async (_data: any, _pwd: string) => ({
    version: 1,
    alg: 'AES-256-GCM',
    kdf: 'PBKDF2-SHA256',
    iterations: 250000,
    iv: 'IV',
    salt: 'SALT',
    ciphertext: 'CIPHERTEXT_BASE64',
    createdAt: '2025-09-23T00:00:00.000Z',
    schemaVersion: '1',
  })),
  decryptFromEnvelope: jest.fn(async (_env: any, _pwd: string) => ({
    restored: true,
    personal: { prenom1: 'Jean' },
  })),
  isExportEnvelope: jest.fn((env: any) => !!env && typeof env === 'object' && 'ciphertext' in env),
}));

// Utilitaires
const LS_DATA_KEY = 'retirement_data';
const LS_CONFIG_KEY = 'mpr-backup-config';

// Mémoire simulant le fichier écrit via File System Access API
let lastWrittenFileContent = '';

function makeWritable() {
  return {
    async write(blob: Blob) {
      lastWrittenFileContent = await (blob as any).text?.() ?? String(blob);
    },
    async close() {
      // no-op
    },
  };
}

// Handle de fichier simulé (FileSystemFileHandle)
function makeFileHandle(envelopeProvider?: () => any) {
  return {
    async requestPermission(_opts?: any) {
      return 'granted';
    },
    async createWritable() {
      return makeWritable();
    },
    async getFile() {
      const txt = JSON.stringify(envelopeProvider ? envelopeProvider() : {}, null, 2);
      return {
        async text() {
          return txt;
        },
      };
    },
  };
}

// Mock très léger d'indexedDB pour idbGet/put utilisé par le service
type StoreData = Record<string, any>;
const idbStores: Record<string, StoreData> = {
  handles: {},
  config: {},
};

function mockIndexedDB() {
  const db = {
    transaction(storeName: string, _mode: 'readonly' | 'readwrite') {
      const store = {
        get(key: string) {
          const req: any = {};
          setTimeout(() => {
            req.result = idbStores[storeName]?.[key];
            req.onsuccess && req.onsuccess({ target: { result: req.result } });
          }, 0);
          return req;
        },
        put(value: any, key: string) {
          const req: any = {};
          setTimeout(() => {
            if (!idbStores[storeName]) idbStores[storeName] = {};
            idbStores[storeName][key] = value;
            req.onsuccess && req.onsuccess({ target: { result: true } });
          }, 0);
          return req;
        },
      };
      return {
        objectStore() {
          return store;
        },
        oncomplete: null as any,
        onerror: null as any,
      };
    },
    objectStoreNames: {
      contains(_name: string) {
        return true;
      },
    },
  };

  (global as any).indexedDB = {
    open(_name: string, _version: number) {
      const req: any = {};
      setTimeout(() => {
        req.result = db;
        req.onsuccess && req.onsuccess({ target: { result: db } });
      }, 0);
      return req;
    },
  };
}

describe('BackgroundBackupService - confidentialité et restauration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    lastWrittenFileContent = '';
    // Reset IDB stores
    idbStores.handles = {};
    idbStores.config = {};

    // Mock indexedDB
    mockIndexedDB();

    // Local/session storage
    localStorage.clear();
    sessionStorage.clear();

    // Config par défaut avec clearLocalAfterBackup = true
    localStorage.setItem(
      LS_CONFIG_KEY,
      JSON.stringify({
        frequencyMin: 15,
        clearLocalAfterBackup: true,
        enableAutoBackup: false,
        requireSecondBackupReminder: true,
      }),
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    (console.warn as any).mockRestore?.();
    (console.error as any).mockRestore?.();
  });

  test('backupNow écrit une enveloppe chiffrée et ne contient pas de données en clair', async () => {
    // Données utilisateur en clair (ne doivent PAS apparaître dans le fichier)
    const userData = {
      personal: { prenom1: 'Jean', naissance1: '1980-01-01' },
      retirement: { rrqMontantActuel1: 500 },
    };
    localStorage.setItem(LS_DATA_KEY, JSON.stringify(userData));

    // Injecter un handle primaire dans "indexedDB"
    const primaryHandle = makeFileHandle();
    idbStores.handles['primary'] = primaryHandle;

    // Appel
    const ok = await BackgroundBackupService.backupNow('secret');
    expect(ok).toBe(true);

    // Vérifier contenu écrit
    expect(lastWrittenFileContent).toContain('"ciphertext"');
    expect(lastWrittenFileContent).not.toContain('prenom1');
    expect(lastWrittenFileContent).not.toContain('naissance1');

    // Vérifier suppression retirement_data (clearLocalAfterBackup=true)
    expect(localStorage.getItem(LS_DATA_KEY)).toBeNull();
  });

  test('proposeRestoreIfNeeded restaure depuis une enveloppe chiffrée avec mot de passe valide', async () => {
    // Pas de données locales
    localStorage.removeItem(LS_DATA_KEY);

    // Handle primaire avec enveloppe JSON
    const envelope = {
      version: 1,
      alg: 'AES-256-GCM',
      kdf: 'PBKDF2-SHA256',
      iterations: 250000,
      iv: 'IV',
      salt: 'SALT',
      ciphertext: 'CIPHERTEXT_BASE64',
      createdAt: '2025-09-23T00:00:00.000Z',
      schemaVersion: '1',
    };
    const primaryHandle = makeFileHandle(() => envelope);
    idbStores.handles['primary'] = primaryHandle;

    // Mock confirm/prompt
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue('secret');

    const restored = await BackgroundBackupService.proposeRestoreIfNeeded();
    expect(restored).toBe(true);

    // retirement_data doit être présent après restauration
    const restoredStr = localStorage.getItem(LS_DATA_KEY);
    expect(restoredStr).toBeTruthy();

    // Nettoyage mocks
    confirmSpy.mockRestore();
    promptSpy.mockRestore();
  });
});
