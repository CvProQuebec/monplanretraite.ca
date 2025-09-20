import { isExportEnvelope } from './fileCrypto';

describe('fileCrypto isExportEnvelope', () => {
  it('detects a valid envelope shape', () => {
    const env = {
      version: 'EPU-1.0',
      app: 'MonPlanRetraite.ca',
      module: 'PlanificationUrgence',
      alg: 'AES-256-GCM',
      kdf: { name: 'PBKDF2', hash: 'SHA-256', iterations: 200000, salt: 'c2FsdA==' },
      iv: 'aXY=',
      ciphertext: 'Y2lwaGVydGV4dA==',
      createdAt: new Date().toISOString(),
      schemaVersion: '1.0',
    };
    expect(isExportEnvelope(env)).toBe(true);
  });

  it('rejects non-envelope objects', () => {
    expect(isExportEnvelope(null as any)).toBe(false);
    expect(isExportEnvelope({} as any)).toBe(false);
    expect(isExportEnvelope({ version: 'EPU-1.0', alg: 'AES-256-GCM' } as any)).toBe(false);
    expect(isExportEnvelope({ kdf: { iterations: 200000 } } as any)).toBe(false);
  });
});
