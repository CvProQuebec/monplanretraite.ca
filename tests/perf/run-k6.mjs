import { spawn } from "node:child_process";
import { resolve } from "node:path";

const scriptPath = resolve("tests/perf/retirement-load.js");
const binary = process.env.K6_BIN || (process.platform === "win32" ? "k6.exe" : "k6");

const child = spawn(binary, ["run", scriptPath], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    K6_BASE_URL: process.env.K6_BASE_URL || "http://127.0.0.1:4173"
  }
});

child.on("error", (error) => {
  console.error("k6 execution failed. Install k6 or set K6_BIN to the binary path.");
  console.error(error.message);
  process.exit(1);
});

child.on("exit", (code) => {
  if (code && code !== 0) {
    console.error(`k6 exited with code ${code}`);
  }
  process.exit(code ?? 1);
});
