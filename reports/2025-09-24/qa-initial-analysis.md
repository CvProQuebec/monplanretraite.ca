# Analyse initiale QA - 2025-09-24

## Contexte projet
- Application web React 18 + TypeScript 5 construite avec Vite 7 (SPA orientee seniors, mode acces simplifie).
- Modules principaux: pages marketing, parcours retraite (wizard, diagnostics, simulateurs Monte Carlo), planification urgence (.mpru), budget et notifications.
- Routage modularise via fragments (`src/routes/*`) et `LocalizedRoute` pour la paire FR/EN.
- Couches explicites UI -> domaine (`RetirementDomainAdapter`) -> services (barrels core/budget/retirement/security) avec lint de frontieres.
- Donnees locales: secureStorage AES-256-GCM, workers dedicaces (Monte Carlo, DPBeam optimizer) sans reseau externe.

## Flux critiques identifiés
- Wizard retraite (`/wizard/*`) : collecte donnees, calculs RRQ/CPP, OAS/SRG, ordonnancement retraits, rapports PDF experts.
- Module urgence (`/planification-urgence`) : chiffrement donnees, export/import .mpru, generation PDF selon audience (trusted/notary/planner/liquidator).
- Budget/net worth : snapshots mensuels, reminders (NotificationSchedulerService), gamification seniors.
- Sauvegarde locale chiffrée : `BackgroundBackupService` + `EnhancedSaveManager` (liaison File System Access, restore prompt).
- Pages marketing bilingues + placeholders (flags `SHOW_PLACEHOLDERS`, `ENABLE_LABS`).
- Monitoring performance seniors (SeniorsOptimizationService) : preloading modules, performance watchers injectes.

## Couverture de test existante
- Tests Jest (`npm run test`) :
  - `src/routes/__tests__/routes-smoke.test.tsx` (SSR smoke fragments FR/EN).
  - `src/services/__tests__/BackgroundBackupService.test.ts` (backup chiffré, restore, timers).
  - `src/tests/*.test.ts` : calculs fiscaux (RRQ/CPP, SRG), perf seniors, synchronisation revenus.
- Lint/qualite : `npm run lint`, `lint:boundaries`, `lint:mpr`, `deps:check` (dependency-cruiser), `deps:graph`.
- Aucune suite E2E ni tests accessibilite automatiques; pas de coverage API/perf/securite automatisee hors Jest logique.

## Dependances et environnements
- Secrets potentiels: Firebase (API key, auth domain, etc.) optionnel (`env.local.example`), flags Vite (`VITE_SHOW_PLACEHOLDERS`, `VITE_ENABLE_LABS`).
- Aucun acces reseau en production (contraintes securite); modules exterieurs desactives par defaut (`VITE_DISABLE_FIREBASE=true`).
- Stack : React Router 6, Tailwind, Radix UI, Chart.js/D3, jsPDF, workers.
- Build & scripts : Vite build, typecheck TS, jest, Lighthouse (`lhci`), tests performance seniors (`test:performance`).

## Risques & contraintes
- Accessibilite seniors stricte (police >=18 px, focus visible, contraste). Toute suite UI doit valider mode seniors.
- Frontieres UI/services surveillees par lint : nouveaux tests doivent respecter barrels (`@/services/core`, etc.).
- Donnees sensibles (urgence, sauvegarde) doivent rester locales : interdiction d'appels reseau dans tests.
- Performance : chunk <= 500 kB, lazy loading. Les tests perf doivent surveiller temps de chargement et budgets.
- Internationalisation : FR par defaut, EN complet; titrage OQLF (espace avant : % $; eviter anglicismes).
- Pas de secrets commits, necessite .env/.env.local fictifs pour CI.

## Informations manquantes / hypotheses
- Aucun endpoint backend accessible (app 100 % front local) -> modules services simulent logique locale. Hypothese : tests API cibleront adaptateurs locaux / mocks.
- Credentials tests (Firebase, scenario demo) non fournis : presumer qu'on opere en mode `VITE_DISABLE_FIREBASE=true`.
- URLs staging/prod pour E2E non definies : prevoir parametrage via variables (`TEST_BASE_URL`).
- Budget sur compatibilite navigateurs : cibler Chrome (CI) + validation manuelle Firefox/Safari (a planifier).

## Prochaines actions recommandees
- Elaborer plan de test exhaustif FR/EN couvrant Fonctionnel, UI/UX, API locales, securite, performance, accessibilite, compatibilite, resilience, smoke.
- Mettre en place infrastructure tests automatisee (Playwright + axe-core, Vitest ciblant helpers, k6/Artillery pour perf worker, npm audit/ZAP baseline).
- Organiser gestion secrets/tests via `.env.example`, `tests/.env.test`, script d'initialisation.
- Planifier archivage artefacts (`reports/YYYY-MM-DD`, `test-history/`).
- Definir pipeline CI multi-jobs (lint + unit + e2e + perf + securite) avec strateges d'escalade.
