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
