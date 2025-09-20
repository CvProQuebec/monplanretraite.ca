/// <reference types="vite/client" />

/**
 * Extend ImportMeta to include Vite's glob typing, if needed by TS tooling.
 * The reference above usually suffices, but the interface here helps editors.
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
