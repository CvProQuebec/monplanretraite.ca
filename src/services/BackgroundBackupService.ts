/**
 * BackgroundBackupService
 * - 100% local backups under user control (File System Access API)
 * - Encrypted with AES-256-GCM (via encryptToEnvelope from src/lib/fileCrypto.ts)
 * - App stores ONLY pointers/metadata to backup files (no personal data)
 * - Optional auto-clear of localStorage 'retirement_data' after successful backup (keeps in-memory state for the session)
 * - Dual-backup recommendation (primary + secondary) for redundancy
 * - Reconnect flow: if no local data at startup but backup file is linked, prompt to restore from user's device
 *
 * Privacy: No upload. Everything happens in the browser. User chooses exact storage location (USB/local drive).
 */

import { encryptToEnvelope, decryptFromEnvelope, isExportEnvelope } from '@/lib/fileCrypto';

export type BackupHandleKey = 'primary' | 'secondary';

export interface BackupConfig {
  frequencyMin: number; // how often to attempt auto-backup
  clearLocalAfterBackup: boolean; // removes 'retirement_data' from localStorage after successful backup
  enableAutoBackup: boolean; // if true, background loop runs
  requireSecondBackupReminder: boolean; // show extra warnings if secondary not configured
}

export interface BackupMeta {
  lastBackupISO?: string;
  lastHash?: string;
  primaryLinked?: boolean;
  secondaryLinked?: boolean;
}

type FSFileHandle = any; // FileSystemFileHandle (browser)

const DB_NAME = 'mpr-backups';
const DB_VERSION = 1;
const STORE_HANDLES = 'handles';
const STORE_CONFIG = 'config';

const LS_META_KEY = 'mpr-backup-meta';
const LS_CONFIG_KEY = 'mpr-backup-config';
const SS_PASSWORD_KEY = 'mpr-backup-pwd';
const LS_LAST_HASH_KEY = 'mpr-last-hash';
const LS_DATA_KEY = 'retirement_data';

function isFSASupported(): boolean {
  return typeof (window as any).showSaveFilePicker === 'function';
}

// Simple JSON hash (non-cryptographic) to detect changes
function jsonHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

// IndexedDB helpers
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_HANDLES)) db.createObjectStore(STORE_HANDLES);
      if (!db.objectStoreNames.contains(STORE_CONFIG)) db.createObjectStore(STORE_CONFIG);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(store: string, key: string, value: any): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet<T = any>(store: string, key: string): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

// Local config/meta helpers
function loadConfig(): BackupConfig {
  try {
    const raw = localStorage.getItem(LS_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    frequencyMin: 15,
    clearLocalAfterBackup: true,
    enableAutoBackup: true,
    requireSecondBackupReminder: true
  };
}

function saveConfig(cfg: BackupConfig) {
  try {
    localStorage.setItem(LS_CONFIG_KEY, JSON.stringify(cfg));
  } catch {}
}

function loadMeta(): BackupMeta {
  try {
    const raw = localStorage.getItem(LS_META_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveMeta(meta: BackupMeta) {
  try {
    localStorage.setItem(LS_META_KEY, JSON.stringify(meta));
  } catch {}
}

async function writeEnvelopeToHandle(handle: FSFileHandle, envelope: object) {
  // Ensure permission
  if (handle && (await (handle as any).requestPermission?.({ mode: 'readwrite' })) === 'denied') {
    throw new Error('Permission denied for backup file.');
  }
  const writable = await (handle as any).createWritable();
  const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' });
  await writable.write(blob);
  await writable.close();
}

async function readEnvelopeFromHandle(handle: FSFileHandle): Promise<any> {
  if (handle && (await (handle as any).requestPermission?.({ mode: 'read' })) === 'denied') {
    throw new Error('Permission denied for backup file.');
  }
  const file = await (handle as any).getFile();
  const txt = await file.text();
  return JSON.parse(txt);
}

export class BackgroundBackupService {
  private static intervalId: number | undefined;

  static async init(): Promise<void> {
    // Persist storage to allow handle persistence
    try {
      // @ts-ignore
      if (navigator?.storage?.persist) await navigator.storage.persist();
    } catch {}
    // Optionally start background loop
    const cfg = loadConfig();
    if (cfg.enableAutoBackup) {
      this.startLoop(cfg.frequencyMin);
    }
  }

  static async linkFile(which: BackupHandleKey): Promise<void> {
    if (!isFSASupported()) {
      alert('Votre navigateur ne supporte pas la sauvegarde directe sur un fichier. Utilisez Edge/Chrome pour activer la sauvegarde automatique.');
      return;
    }
    const picker: any = (window as any).showSaveFilePicker;
    const handle = await picker({
      suggestedName: 'MonPlanRetraite_backup.json',
      types: [{ description: 'Encrypted JSON', accept: { 'application/json': ['.json'] } }]
    });
    await idbPut(STORE_HANDLES, which, handle);
    const meta = loadMeta();
    if (which === 'primary') meta.primaryLinked = true;
    if (which === 'secondary') meta.secondaryLinked = true;
    saveMeta(meta);
  }

  static async unlinkFile(which: BackupHandleKey): Promise<void> {
    await idbPut(STORE_HANDLES, which, undefined);
    const meta = loadMeta();
    if (which === 'primary') meta.primaryLinked = false;
    if (which === 'secondary') meta.secondaryLinked = false;
    saveMeta(meta);
  }

  static setSessionPassword(pwd: string) {
    try {
      sessionStorage.setItem(SS_PASSWORD_KEY, pwd || '');
    } catch {}
  }

  static getSessionPassword(): string | undefined {
    try {
      const v = sessionStorage.getItem(SS_PASSWORD_KEY);
      return v || undefined;
    } catch {
      return undefined;
    }
  }

  static updateConfig(partial: Partial<BackupConfig>) {
    const cfg = { ...loadConfig(), ...partial };
    saveConfig(cfg);
    if (cfg.enableAutoBackup) this.startLoop(cfg.frequencyMin);
    else this.stopLoop();
  }

  static getConfig(): BackupConfig {
    return loadConfig();
  }

  static getMeta(): BackupMeta {
    return loadMeta();
  }

  static startLoop(frequencyMin?: number) {
    this.stopLoop();
    const ms = Math.max(1, (frequencyMin ?? loadConfig().frequencyMin)) * 60_000;
    // @ts-ignore
    this.intervalId = window.setInterval(() => {
      this.tryAutoBackup().catch((e) => console.warn('Auto-backup failed:', e));
    }, ms);
  }

  static stopLoop() {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  static async tryAutoBackup(): Promise<void> {
    const cfg = loadConfig();
    if (!cfg.enableAutoBackup) return;

    const dataStr = localStorage.getItem(LS_DATA_KEY);
    if (!dataStr) return; // nothing to backup

    const hash = jsonHash(dataStr);
    const lastHash = localStorage.getItem(LS_LAST_HASH_KEY);
    if (lastHash === hash) return; // unchanged

    const pwd = this.getSessionPassword();
    if (!pwd) {
      // No password in session -> skip background backup; UI may prompt user to set a session password
      return;
    }

    const ok = await this.backupNow(pwd);
    if (ok) {
      localStorage.setItem(LS_LAST_HASH_KEY, hash);
    }
  }

  /**
   * Perform backup now using the session password:
   * - Writes encrypted envelope to primary (and secondary if configured)
   * - Updates meta
   * - Optionally clears localStorage 'retirement_data'
   */
  static async backupNow(password: string): Promise<boolean> {
    const dataStr = localStorage.getItem(LS_DATA_KEY);
    if (!dataStr) {
      console.warn('No retirement_data found to backup.');
      return false;
    }
    const userData = JSON.parse(dataStr);

    // Create encrypted envelope
    const envelope = await encryptToEnvelope(userData, password);

    // Retrieve handles
    const primary = await idbGet<FSFileHandle>(STORE_HANDLES, 'primary');
    const secondary = await idbGet<FSFileHandle>(STORE_HANDLES, 'secondary');

    let wrote = false;
    if (primary) {
      await writeEnvelopeToHandle(primary, envelope);
      wrote = true;
    }

    if (secondary) {
      try {
        await writeEnvelopeToHandle(secondary, envelope);
      } catch (e) {
        console.warn('Secondary backup failed:', e);
      }
    }

    if (wrote) {
      // Update metadata
      const meta = loadMeta();
      meta.lastBackupISO = new Date().toISOString();
      meta.primaryLinked = !!primary;
      meta.secondaryLinked = !!secondary;
      saveMeta(meta);

      const cfg = loadConfig();
      if (cfg.clearLocalAfterBackup) {
        try {
          localStorage.removeItem(LS_DATA_KEY);
          // Keep only pointers/meta and last hash (for diff when data is reloaded)
        } catch {}
      }
      return true;
    }
    return false;
  }

  /**
   * On startup: if no local data but primary backup is linked, propose restore.
   * Returns true if restored.
   */
  static async proposeRestoreIfNeeded(): Promise<boolean> {
    const dataStr = localStorage.getItem(LS_DATA_KEY);
    if (dataStr) return false;

    const primary = await idbGet<FSFileHandle>(STORE_HANDLES, 'primary');
    if (!primary) return false;

    const confirm = window.confirm(
      (navigator.language?.startsWith('fr') ? 
        'Aucune donnée locale trouvée. Voulez-vous recharger vos données chiffrées depuis votre fichier de sauvegarde local ?' :
        'No local data found. Would you like to reload your encrypted data from your local backup file?')
    );
    if (!confirm) return false;

    const pwd = prompt(navigator.language?.startsWith('fr') ?
      'Entrez votre mot de passe de sauvegarde:' :
      'Enter your backup password:')
      || '';
    if (!pwd) return false;

    try {
      const env = await readEnvelopeFromHandle(primary);
      if (!isExportEnvelope(env)) throw new Error('Invalid envelope file');
      const obj = await decryptFromEnvelope(env, pwd);
      localStorage.setItem(LS_DATA_KEY, JSON.stringify(obj));
      try { (window as any).mprNotifyDataChanged?.(); } catch {}
      return true;
    } catch (e) {
      alert((navigator.language?.startsWith('fr') ? 
        'Échec du chargement de la sauvegarde. Mot de passe invalide ou fichier corrompu.' :
        'Failed to load backup. Invalid password or corrupted file.'));
      console.error(e);
      return false;
    }
  }

  /**
   * Strongly suggest a secondary backup for redundancy.
   */
  static shouldWarnSecondBackup(): boolean {
    const cfg = loadConfig();
    if (!cfg.requireSecondBackupReminder) return false;
    const meta = loadMeta();
    return !meta.secondaryLinked;
  }
}

export default BackgroundBackupService;
