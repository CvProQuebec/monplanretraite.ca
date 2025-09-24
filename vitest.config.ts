import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = dirname(fileURLToPath(new URL("./vitest.config.ts", import.meta.url)));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(rootDir, "src")
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [resolve(rootDir, "tests/vitest/setup.ts")],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: resolve(rootDir, "reports/coverage")
    },
    include: [
      "tests/unit/**/*.spec.ts",
      "tests/unit/**/*.test.ts"
    ]
  }
});
