/**
 * Themed barrel — Core/Persistence
 * Non-breaking: re-exports existing services to enable clearer imports.
 * Usage (recommended):
 *   import { BackgroundBackupService, EnhancedSaveManager } from '@/services/core/persistence';
 */

// Persistence / Storage / Backup (100% local)
export * from '../BackgroundBackupService';
export * from '../EnhancedSaveManager';
export * from '../IndividualSaveManager';
export * from '../SecureFileOnlyStorage';
export * from '../LocalStorageTransferService';

// Diagnostics (persistence-related)
export * from '../PersistenceTestService';
