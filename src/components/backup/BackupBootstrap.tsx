import React, { useEffect } from 'react';
import BackgroundBackupService from '@/services/BackgroundBackupService';

/**
 * BackupBootstrap
 * - Initializes BackgroundBackupService on app load (persistent storage + auto-backup loop if enabled)
 * - Proposes restore from linked local encrypted backup if no local data is present
 * - UI-less component: mount once high in the app tree
 *
 * Privacy & Control:
 * - 100% local, uses File System Access API (when available)
 * - No network upload; user chooses exact backup location
 */
const BackupBootstrap: React.FC = () => {
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await BackgroundBackupService.init();
        // If local data was cleared (e.g., clearLocalAfterBackup) or first visit, propose restore
        await BackgroundBackupService.proposeRestoreIfNeeded();
      } catch (e) {
        console.warn('BackupBootstrap init failed:', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return null;
};

export default BackupBootstrap;
