import { useMemo } from 'react';
import { FLAGS } from '@/config/flags';

/**
 * useFlags
 * Hook d'accès aux drapeaux de configuration centralisés.
 * Lis les valeurs depuis src/config/flags.ts (compat Vite/Node/Jest).
 */
export function useFlags() {
  // FLAGS est évalué de manière sûre (Vite/Node) dans config/flags.ts
  return useMemo(() => FLAGS, []);
}

export type UseFlagsReturn = ReturnType<typeof useFlags>;
