import "@testing-library/jest-dom/vitest";
import { TextDecoder, TextEncoder } from "node:util";

process.env.VITE_DISABLE_FIREBASE = process.env.VITE_DISABLE_FIREBASE ?? "true";
process.env.VITE_SHOW_PLACEHOLDERS = process.env.VITE_SHOW_PLACEHOLDERS ?? "false";
process.env.VITE_ENABLE_LABS = process.env.VITE_ENABLE_LABS ?? "false";

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
}

if (!globalThis.localStorage || typeof globalThis.localStorage.clear !== "function") {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    }
  } as Storage;
}
