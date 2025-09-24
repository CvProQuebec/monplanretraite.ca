# Guide d'execution des tests QA

## Prelude
- Node 20 requis (`.github/workflows/qa-suite.yml`).
- `npm ci` installe toutes les dependances (Jest, Vitest, Playwright, k6 wrapper, ZAP helper).
- Variables de test par defaut : voir `tests/.env.test.example` (flags Vite, URLs base, K6).

## Suites disponibles
- `npm run test:unit` : Jest (legacy) + `src/routes` smoke.
- `npm run test:vitest` : nouvelles specs domaine/hooks/services (`tests/unit/**`).
- `npm run test:e2e` : Playwright + axe-core (config `tests/e2e/playwright.config.ts`).
- `npm run test:a11y` : sous-ensemble axe uniquement.
- `npm run test:perf` : k6 (necessite serveur `npm run preview -- --host --port 4173`).
- `npm run test:security:audit` : `npm audit` JSON + console.
- `npm run test:security:zap` : ZAP baseline via Docker (serveur preview requis).
- `npm run qa:smoke` : alias routes smoke Jest.
- `npm run qa:all` : typecheck + lint + deps + Jest + Vitest + Playwright (connecte a dev server auto).

## Execution locale (exemples)
```bash
# Unitaires + domaine
npm run test:vitest

# E2E + axe (dev server auto sur 5173)
TEST_BASE_URL=http://127.0.0.1:5173 npm run test:e2e

# Perf (build + preview 4173 + k6)
npm run build
npm run preview -- --host --port 4173 &
K6_BASE_URL=http://127.0.0.1:4173 npm run test:perf
kill %1

# ZAP baseline (Docker requis)
npm run build
npm run preview -- --host --port 4173 &
ZAP_TARGET=http://127.0.0.1:4173 npm run test:security:zap
kill %1
```

## Artefacts & rapports
- `reports/YYYY-MM-DD/` : analyses, plan de tests, futures campagnes.
- `reports/e2e/html` : rapport Playwright (workflow charge en cas d'echec).
- `reports/e2e/junit/results.xml` : sortie JUnit pour CI.
- `reports/perf/` : resultats k6 (stdout + futurs exports).
- `reports/security/` : rapports ZAP HTML/JSON.
- `reports/latest-npm-audit.json` : audit npm conserve par CI.
- `test-history/` : dossier vide avec `.gitkeep` pour archiver les runs futurs.

## Workflow CI `qa-suite`
- `lint_unit` : typecheck + lint + deps + Jest + Vitest.
- `playwright` : installe navigateurs et lance E2E (trace on-first-retry, artefacts HTML/JUnit).
- `security_audit` : npm audit + upload JSON.
- `perf_smoke` : build + preview 4173 + `apt-get install k6` + script k6.
- `zap_baseline` : declenche uniquement via `workflow_dispatch` (Docker OWASP ZAP, preview 4173).

## Maintenance
- Ajouter de nouvelles specs Vitest sous `tests/unit` (mirroir du plan JSON `test-plan.json`).
- E2E : reutiliser `tests/e2e/utils/axe-helper.ts` et baseURL Playwright.
- Mettre a jour `reports/YYYY-MM-DD/*.md` pour chaque campagne QA.
- Conserver `docs/tests.md` synchronise avec scripts `package.json` et workflows CI.
