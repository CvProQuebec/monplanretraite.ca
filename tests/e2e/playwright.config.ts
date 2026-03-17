import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = dirname(fileURLToPath(new URL("./playwright.config.ts", import.meta.url)));
const TEST_BASE_URL = process.env.TEST_BASE_URL ?? "http://127.0.0.1:5173";

export default defineConfig({
  testDir: rootDir,
  timeout: 90_000,
  retries: process.env.CI ? 1 : 0,
  expect: {
    timeout: 20_000
  },
  reporter: [
    ["list"],
    ["html", { outputFolder: resolve(rootDir, "../../reports/e2e/html"), open: "never" }],
    ["junit", { outputFile: resolve(rootDir, "../../reports/e2e/junit/results.xml") }]
  ],
  use: {
    baseURL: TEST_BASE_URL,
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    viewport: { width: 1440, height: 900 }
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "msedge",
      use: { ...devices["Desktop Edge"] }
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] }
    },
    {
      name: "iphone-12",
      use: { ...devices["iPhone 12"] }
    },
    {
      name: "pixel-5",
      use: { ...devices["Pixel 5"] }
    }
  ],
  webServer: {
    // Vite dev server handles SPA routing correctly; preview server requires explicit
    // historyApiFallback and was causing consistent failures in CI.
    // Port 5173 matches TEST_BASE_URL default; overrides vite.config.ts server.port (3001).
    command: "npm run dev -- --host --port 5173",
    url: TEST_BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI
  }
});
