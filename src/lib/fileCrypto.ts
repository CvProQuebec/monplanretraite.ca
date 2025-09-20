/* WebCrypto utilities for encrypted file import/export (.mpru) - 100% local */

export interface KdfParams {
  name: 'PBKDF2';
  hash: 'SHA-256';
  iterations: number;
  salt: string; // base64
}

export interface ExportEnvelope {
  version: 'EPU-1.0';
  app: 'MonPlanRetraite.ca';
  module: 'PlanificationUrgence';
  alg: 'AES-256-GCM';
  kdf: KdfParams;
  iv: string; // base64 (12 bytes)
  ciphertext: string; // base64
  createdAt: string; // ISO
  schemaVersion?: string; // optional: EmergencyData.version
}

const ITERATIONS = 200_000;
const TEXT = new TextEncoder();
const TEXT_DECODER = new TextDecoder();

function getRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function toBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveAesGcmKey(password: string, salt: Uint8Array, iterations = ITERATIONS): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    TEXT.encode(password).buffer as ArrayBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt arbitrary JSON-serializable data into an envelope ready for file download.
 * Uses AES-256-GCM with PBKDF2-SHA256 (200k) key derivation.
 */
export async function encryptToEnvelope(data: any, password: string, schemaVersion?: string): Promise<ExportEnvelope> {
  const json = JSON.stringify(data);
  const plaintext = TEXT.encode(json);
  const salt = getRandomBytes(16);
  const iv = getRandomBytes(12);

  const key = await deriveAesGcmKey(password, salt, ITERATIONS);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv.buffer as ArrayBuffer }, key, plaintext.buffer as ArrayBuffer);

  const envelope: ExportEnvelope = {
    version: 'EPU-1.0',
    app: 'MonPlanRetraite.ca',
    module: 'PlanificationUrgence',
    alg: 'AES-256-GCM',
    kdf: {
      name: 'PBKDF2',
      hash: 'SHA-256',
      iterations: ITERATIONS,
      salt: toBase64(salt)
    },
    iv: toBase64(iv),
    ciphertext: toBase64(ct),
    createdAt: new Date().toISOString(),
    schemaVersion
  };

  return envelope;
}

/**
 * Decrypt an envelope produced by encryptToEnvelope back into the original object.
 */
export async function decryptFromEnvelope<T = any>(envelope: ExportEnvelope, password: string): Promise<T> {
  if (
    !envelope ||
    envelope.version !== 'EPU-1.0' ||
    envelope.alg !== 'AES-256-GCM' ||
    !envelope.kdf ||
    envelope.kdf.name !== 'PBKDF2' ||
    envelope.kdf.hash !== 'SHA-256'
  ) {
    throw new Error('Format de fichier invalide ou non supporté.');
  }

  const salt = fromBase64(envelope.kdf.salt);
  const iv = fromBase64(envelope.iv);
  const ciphertext = fromBase64(envelope.ciphertext);

  const key = await deriveAesGcmKey(password, salt, envelope.kdf.iterations);
  try {
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv.buffer as ArrayBuffer }, key, ciphertext.buffer as ArrayBuffer);
    const json = TEXT_DECODER.decode(pt);
    return JSON.parse(json) as T;
  } catch (e) {
    throw new Error('Impossible de déchiffrer le fichier (phrase secrète invalide ou fichier corrompu).');
  }
}

/**
 * Heuristic to detect if a parsed JSON looks like an encrypted envelope.
 */
export function isExportEnvelope(obj: any): obj is ExportEnvelope {
  return !!(obj &&
    typeof obj === 'object' &&
    typeof obj.version === 'string' &&
    typeof obj.alg === 'string' &&
    typeof obj.iv === 'string' &&
    typeof obj.ciphertext === 'string' &&
    obj.kdf &&
    typeof obj.kdf.iterations === 'number' &&
    typeof obj.kdf.salt === 'string');
}
