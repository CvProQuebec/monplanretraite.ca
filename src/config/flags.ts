function getViteEnv(): Record<string, any> {
  try {
    // Avoid TypeScript parsing of 'import.meta' by evaluating at runtime
    // eslint-disable-next-line no-new-func
    const fn = new Function('try { return import.meta && import.meta.env || {}; } catch (_) { return {}; }');
    return fn() as any;
  } catch {
    return {};
  }
}

export function readEnvBool(key: string, defaultFalse = false): boolean {
  // Prefer Vite env at runtime (browser)
  const viteEnv = getViteEnv();
  if (typeof viteEnv[key] !== 'undefined') {
    return String(viteEnv[key]) === 'true';
  }
  // Fallback: Node/Jest (process.env)
  try {
    const v = (globalThis as any)?.process?.env?.[key];
    if (typeof v !== 'undefined') return String(v) === 'true';
  } catch {
    // ignore
  }
  // Test hook (optional): global __TEST_FLAGS__
  try {
    const v = (globalThis as any)?.__TEST_FLAGS__?.[key];
    if (typeof v !== 'undefined') return !!v;
  } catch {
    // ignore
  }
  return defaultFalse;
}

export const FLAGS = {
  SHOW_PLACEHOLDERS: readEnvBool('VITE_SHOW_PLACEHOLDERS', false),
  ENABLE_LABS: readEnvBool('VITE_ENABLE_LABS', false),
  ENABLE_ALL_TOOLS: readEnvBool('VITE_ENABLE_ALL_TOOLS', false)
} as const;

export type Flags = typeof FLAGS;
