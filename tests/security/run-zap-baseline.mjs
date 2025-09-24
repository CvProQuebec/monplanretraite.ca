import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const target = process.env.ZAP_TARGET || "http://127.0.0.1:4173";
const reportDir = resolve("reports/security");
mkdirSync(reportDir, { recursive: true });

const htmlReport = "zap-baseline-report.html";
const jsonReport = "zap-baseline-report.json";

const dockerArgs = [
  "run",
  "--rm",
  "-u",
  "zap",
  "-v",
  `${reportDir}:/zap/wrk:rw`,
  "owasp/zap2docker-stable",
  "zap-baseline.py",
  "-t",
  target,
  "-r",
  htmlReport,
  "-J",
  jsonReport,
  "-m",
  "5"
];

const child = spawn("docker", dockerArgs, { stdio: "inherit" });

child.on("error", (error) => {
  console.error("Docker or ZAP baseline is not available. Install Docker or provide ZAP CLI.");
  console.error(error.message);
  process.exit(1);
});

child.on("exit", (code) => {
  if (code && code !== 0) {
    console.error(`ZAP baseline exited with code ${code}`);
  }
  process.exit(code ?? 1);
});
