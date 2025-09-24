# Plan de tests QA - MonPlanRetraite.ca (2025-09-24)

## Vue d'ensemble
- Objectif : couvrir l'ensemble du cycle QA (fonctionnel, UI/UX, API, securite, performance, accessibilite, compatibilite, resilience, smoke) pour une application React/TypeScript orientee seniors.
- Portee : environnement local sans reseau, flags `VITE_DISABLE_FIREBASE=true`, placeholders controles par `SHOW_PLACEHOLDERS`, mode seniors actif.
- Cadre : execution en CI GitHub Actions + workflows locaux (`npm`, Playwright, Vitest, k6, ZAP, npm audit). Gestion des artefacts via `reports/YYYY-MM-DD` et `test-history/`.

## Fonctionnel

### FUNC-001 â€” Parcours wizard retraite complet
- **Nom** : Wizard retraite - scenario standard
- **Description FR** : Valider qu'un utilisateur seniors complete le wizard retraite (profils, revenus, retraits) et que les calculs RRQ/CPP/OAS/SRG sont generes sans erreurs.
- **Description EN** : Validate that a senior user can finish the retirement wizard (profiles, incomes, withdrawals) and obtain RRQ/CPP/OAS/GIS outputs without errors.
- **Preconditions** : Donnees demo chargees, `VITE_DISABLE_FIREBASE=true`.
- **Etapes** : (1) Ouvrir `/wizard/intro`, (2) Remplir profils revenus pour 2 personnes, (3) Configurer objectifs retraits, (4) Finaliser et generer resultats.
- **Resultat attendu** : Resume affichant montants mensuels/annuels et suggestions d'optimisation, aucun toast d'erreur.
- **Type** : automated (Playwright E2E + fixtures demo).
- **Priorite** : High.
- **Environnements** : dev, staging, prod-like.
- **Module** : retirement-wizard.
- **Tags** : ["retirement", "wizard", "calculation"].
- **Dependencies** : [].

### FUNC-002 â€” Export PDF expert retraite
- **Nom** : Rapport consultant PDF
- **Description FR** : Verifier la generation locale du rapport PDF Expert (sans filigrane) avec donnees wizard et caviardage optionnel.
- **Description EN** : Verify generation of the Expert PDF report (no watermark) using wizard data with optional redaction toggle.
- **Preconditions** : Wizard termine, `showFullSensitive=false` par defaut.
- **Etapes** : (1) Acceder `/wizard/results`, (2) Cliquer "Exporter PDF Expert", (3) Confirmer redaction, (4) Sauvegarder fichier local.
- **Resultat attendu** : Fichier PDF cree localement, identifiants sensibles masques par defaut, aucune requete reseau.
- **Type** : automated (Playwright + verif PDF via parse binaire minimal).
- **Priorite** : High.
- **Environnements** : dev, staging.
- **Module** : reports-retirement.
- **Tags** : ["pdf", "retirement", "security"].
- **Dependencies** : ["FUNC-001"].

### FUNC-003 â€” Simulation Monte Carlo robuste
- **Nom** : Monte Carlo 2000 iterations
- **Description FR** : Assurer que la simulation Monte Carlo execute 2000 iterations et renvoie les statistiques attendues.
- **Description EN** : Ensure Monte Carlo simulation runs 2000 iterations and returns the expected statistics.
- **Preconditions** : Wizard termine ou profil charge.
- **Etapes** : (1) Ouvrir laboratoire optimisation fiscale, (2) Activer Monte Carlo 2000, (3) Lancer simulation, (4) Observer moyennes et percentiles.
- **Resultat attendu** : Temps d'execution < 40 s sur machine CI baseline, graphiques et resume robustesse affiches.
- **Type** : automated (Vitest direct sur worker + test e2e Playwright pour UI).
- **Priorite** : High.
- **Environnements** : dev, perf.
- **Module** : retirement-optimization.
- **Tags** : ["montecarlo", "worker", "performance"].
- **Dependencies** : [].

### FUNC-004 â€” Export/import .mpru plan urgence
- **Nom** : Cycle sauvegarde urgence
- **Description FR** : Tester l'export chiffrÃ© .mpru puis l'import avec previsualisation et demande de phrase secrete.
- **Description EN** : Test emergency .mpru encrypted export followed by import with preview and passphrase prompt.
- **Preconditions** : Session deverrouillee, phrase secrete test definie.
- **Etapes** : (1) Aller `/planification-urgence`, (2) Remplir formulaire minimal, (3) Exporter .mpru, (4) Effacer donnees, (5) Importer fichier, (6) Valider previsualisation, (7) Entrer phrase secrete.
- **Resultat attendu** : Donnees restaurees sans fuite claire, logs redaction OK.
- **Type** : automated (Playwright + verif contenu binaire, fallback test manuel pour bulletin).
- **Priorite** : High.
- **Environnements** : dev, prod-like.
- **Module** : emergency-planning.
- **Tags** : ["mpru", "encryption", "emergency"].
- **Dependencies** : [].

### FUNC-005 â€” Net worth snapshots mensuels
- **Nom** : Budget snapshot
- **Description FR** : Confirmer que la creation d'un snapshot valeur nette met a jour l'historique et les rappels.
- **Description EN** : Confirm that creating a net worth snapshot updates history and reminders.
- **Preconditions** : Mode budget actif, donnees demo.
- **Etapes** : (1) Aller `/budget/net-worth`, (2) Ajouter snapshot, (3) Verifier liste historique, (4) Controler notification planifiee.
- **Resultat attendu** : Snapshot stocke localement, planification rappels mise a jour.
- **Type** : automated (Vitest pour service + Playwright verification UI).
- **Priorite** : Medium.
- **Environnements** : dev, staging.
- **Module** : budget.
- **Tags** : ["budget", "notifications"].
- **Dependencies** : [].

## UI/UX

### UIUX-001 â€” Mode seniors typographie et contrastes
- **Nom** : Audit UI seniors
- **Description FR** : Verifier que les pages principales respectent la taille police >=18 px, contraste eleve, focus visible.
- **Description EN** : Check that primary pages respect font size >=18 px, high contrast, and visible focus for seniors.
- **Preconditions** : Mode seniors actif (valeur par defaut), theme clair.
- **Etapes** : (1) Scanner `/`, `/wizard/intro`, `/planification-urgence`, `/outils` avec axe-core, (2) Capturer rapport.
- **Resultat attendu** : Aucun echec axe-core critique, captures conformes.
- **Type** : automated (Playwright + axe-core).
- **Priorite** : High.
- **Environnements** : dev, staging.
- **Module** : ui-global.
- **Tags** : ["accessibility", "seniors", "axe"].
- **Dependencies** : [].

### UIUX-002 â€” Navigation bilingue FR/EN
- **Nom** : Bascule langue
- **Description FR** : Assurer que les boutons FR/EN sur accueil et blog conservent le contexte (slug lie, LocalizedRoute).
- **Description EN** : Ensure FR/EN toggles on home and blog keep context (paired slug via LocalizedRoute).
- **Preconditions** : Contenu blog demarrage disponible.
- **Etapes** : (1) Visiter `/articles/retraite-101`, (2) Cliquer bascule EN, (3) Verifier slug anglais, (4) Retour FR.
- **Resultat attendu** : Aucune 404, slugs traduits corrects, navigation accessible clavier.
- **Type** : automated (Playwright).
- **Priorite** : Medium.
- **Environnements** : dev, staging.
- **Module** : marketing-blog.
- **Tags** : ["i18n", "routing"].
- **Dependencies** : [].

### UIUX-003 â€” Gating placeholders marketing
- **Nom** : Flag placeholders
- **Description FR** : Valider que les pages placeholders ne s'affichent que lorsque `SHOW_PLACEHOLDERS=true`.
- **Description EN** : Confirm placeholder pages render only when `SHOW_PLACEHOLDERS=true`.
- **Preconditions** : Construire app deux fois (flag true/false).
- **Etapes** : (1) Lancer dev avec flag false, verifier absence routes, (2) Relancer avec true, confirmer presence.
- **Resultat attendu** : Comportement conforme, message upgrade affiche.
- **Type** : automated (Vitest config + Playwright scenario).
- **Priorite** : Medium.
- **Environnements** : dev, staging.
- **Module** : marketing-placeholders.
- **Tags** : ["flags", "routing"].
- **Dependencies** : [].

### UIUX-004 â€” Carte outil plan Pro/Expert
- **Nom** : CTA mise a niveau
- **Description FR** : Verifier que la page `/outils` affiche les cartes `ToolCard` avec CTA "Mettre a niveau" selon plan.
- **Description EN** : Check `/tools` renders `ToolCard` with "Upgrade" CTA depending on plan.
- **Preconditions** : Donnees plan utilisateur (free default) dans storage demo.
- **Etapes** : (1) Charger `/outils`, (2) Inspecter carte plan Expert requise, (3) Passer plan a Pro par fixture, (4) Recharger.
- **Resultat attendu** : CTA correct, accessibilite ARIA intacte.
- **Type** : automated (Playwright + mock store).
- **Priorite** : Medium.
- **Environnements** : dev, staging.
- **Module** : tools-page.
- **Tags** : ["tools", "plans", "ui"].
- **Dependencies** : [].

### UIUX-005 â€” Formulaires FormGrid cohÃ©rence
- **Nom** : FormGrid alignement
- **Description FR** : Controler que les nouveaux formulaires utilisent `FormGrid/FormRow/Field` et labels associes.
- **Description EN** : Ensure new forms leverage `FormGrid/FormRow/Field` components with proper labels.
- **Preconditions** : Section budgets/urgence accessible.
- **Etapes** : (1) Inspecter DOM pour `.mpr-form-row`, (2) Confirmer label `for`/`id`, (3) Valider aides contextuelles.
- **Resultat attendu** : Alignement correct, instructions seniors visibles.
- **Type** : automated (Playwright DOM assertions).
- **Priorite** : Low.
- **Environnements** : dev.
- **Module** : forms.
- **Tags** : ["forms", "ux"].
- **Dependencies** : [].

## API / Domaine

### API-001 â€” RetirementDomainAdapter projections
- **Nom** : Projection multi-annees
- **Description FR** : Tester que `RetirementDomainAdapter.buildMonthlySchedule` renvoie calendrier coherent pour 25 ans.
- **Description EN** : Test `RetirementDomainAdapter.buildMonthlySchedule` returns coherent schedule for 25 years.
- **Preconditions** : Dataset demo.
- **Etapes** : (1) Appeler helper avec scenario, (2) Valider taille tableau, (3) Controler totaux.
- **Resultat attendu** : Sommes positives, totaux concordants avec Annual.
- **Type** : automated (Vitest).
- **Priorite** : High.
- **Environnements** : dev, CI.
- **Module** : domain-retirement.
- **Tags** : ["domain", "calculation"].
- **Dependencies** : [].

### API-002 - Suggestion ordre retraits
- **Nom** : Withdrawal order heuristics
- **Description FR** : Confirmer que `RetirementHelpers.suggestWithdrawalOrder` retourne l'ordre NON_ENREGISTRE -> REER -> CELI et ajoute RRIF si detecte.
- **Description EN** : Ensure `RetirementHelpers.suggestWithdrawalOrder` returns NON_ENREGISTRE -> REER -> CELI and appends RRIF when detected.
- **Preconditions** : Profil demo avec comptes non enregistres et REER.
- **Etapes** : (1) Charger donnees demo, (2) Appeler helper, (3) Verifier que l'ordre commence par NON_ENREGISTRE puis REER puis CELI, (4) Ajouter un compte FERR et confirmer la presence de RRIF.
- **Resultat attendu** : Ordre par defaut = NON_ENREGISTRE, REER, CELI avec ajout RRIF detecte, aucune exception.
- **Type** : automated (Vitest).
- **Priorite** : High.
- **Environnements** : dev, CI.
- **Module** : domain-retirement.
- **Tags** : ["heuristics", "withdrawals"].
- **Dependencies** : [].
### API-003 â€” Flags hook memoization
- **Nom** : useFlags memo
- **Description FR** : Confirmer que `useFlags` memoire la resolution et permet override test.
- **Description EN** : Confirm `useFlags` memoizes resolution and supports test override.
- **Preconditions** : Flags definis.
- **Etapes** : (1) Rendre composant test, (2) Mesurer re-renders, (3) Override via provider.
- **Resultat attendu** : Un seul appel resolution, override efficace.
- **Type** : automated (React Testing Library + Vitest).
- **Priorite** : Medium.
- **Environnements** : dev.
- **Module** : config-flags.
- **Tags** : ["flags", "hooks"].
- **Dependencies** : [].

### API-004 â€” BackgroundBackupService planification
- **Nom** : Backup auto scheduler
- **Description FR** : Verifier que `BackgroundBackupService` planifie backup et clear option.
- **Description EN** : Verify `BackgroundBackupService` schedules backup and clear option.
- **Preconditions** : Timer mock.
- **Etapes** : (1) Initialiser service, (2) Simuler temps, (3) Verifier appel `saveDirectly`, (4) Tester option clear after backup.
- **Resultat attendu** : Appels effectues selon configuration.
- **Type** : automated (Vitest ou Jest).
- **Priorite** : Medium.
- **Environnements** : dev, CI.
- **Module** : services-core.
- **Tags** : ["backup", "scheduler"].
- **Dependencies** : [].

### API-005 â€” ModuleTestService log callback
- **Nom** : Logs UI injection
- **Description FR** : S'assurer que `ModuleTestService` renvoie `ModuleTestResult` avec callback `log` optionnel.
- **Description EN** : Ensure `ModuleTestService` returns `ModuleTestResult` with optional `log` callback.
- **Preconditions** : Mock log fourni.
- **Etapes** : (1) Appeler service avec callback, (2) Verifier structure result, (3) Controler absence toasts internes.
- **Resultat attendu** : Logs passes via callback, aucun side-effect UI.
- **Type** : automated (Vitest).
- **Priorite** : Medium.
- **Environnements** : dev.
- **Module** : services-seniors.
- **Tags** : ["logs", "seniors"].
- **Dependencies** : [].

## Securite

### SEC-001 â€” Audit npm audit haute severite
- **Nom** : npm audit baseline
- **Description FR** : Executer `npm audit --production` et echouer si vuln hautes restant.
- **Description EN** : Run `npm audit --production` and fail on remaining high vulnerabilities.
- **Preconditions** : node 20, lock a jour.
- **Etapes** : (1) Executer audit, (2) Archiver JSON.
- **Resultat attendu** : 0 vuln high/critical ou exceptions documentees.
- **Type** : automated (CI script).
- **Priorite** : High.
- **Environnements** : CI.
- **Module** : security.
- **Tags** : ["npm", "audit"].
- **Dependencies** : [].

### SEC-002 â€” Scan OWASP ZAP baseline
- **Nom** : ZAP baseline local
- **Description FR** : Lancer ZAP baseline sur build statique `dist/` via proxy local.
- **Description EN** : Run ZAP baseline against static build `dist/` through local proxy.
- **Preconditions** : Build Vite.
- **Etapes** : (1) Servir `dist`, (2) Lancer `zap-baseline.py`, (3) Export HTML.
- **Resultat attendu** : Alertes high/medium justifiees ou resolues.
- **Type** : automated (CI optional, manual review alerts).
- **Priorite** : Medium.
- **Environnements** : staging.
- **Module** : security.
- **Tags** : ["zap", "owasp"].
- **Dependencies** : [].

### SEC-003 â€” Verif chiffrement .mpru
- **Nom** : Inspecteur .mpru
- **Description FR** : Controler que le fichier export .mpru ne contient aucune donnee en clair (regex email, montants).
- **Description EN** : Ensure exported .mpru file contains no plaintext data (regex email, amounts).
- **Preconditions** : Export realise.
- **Etapes** : (1) Exporter .mpru, (2) Scanner base64 decode, (3) Verifier absence patterns.
- **Resultat attendu** : Donnees chiffrÃ©es uniquement.
- **Type** : automated (Node script).
- **Priorite** : High.
- **Environnements** : dev, prod-like.
- **Module** : emergency-security.
- **Tags** : ["encryption", "mpru"].
- **Dependencies** : ["FUNC-004"].

### SEC-004 â€” Lint frontieres UI/services
- **Nom** : Lint frontieres
- **Description FR** : Confirmer `npm run lint:boundaries` passe et bloque import interdits (`@/services/tax/*`).
- **Description EN** : Ensure `npm run lint:boundaries` passes and blocks direct `@/services/tax/*` imports.
- **Preconditions** : Dependencies installees.
- **Etapes** : (1) Executer lint, (2) Verifier sortie.
- **Resultat attendu** : 0 erreur.
- **Type** : automated.
- **Priorite** : High.
- **Environnements** : dev, CI.
- **Module** : lint.
- **Tags** : ["lint", "boundaries"].
- **Dependencies** : [].

### SEC-005 â€” Audit CSP routes urgence
- **Nom** : CSP urgence
- **Description FR** : Verifier entetes CSP actifs sur `/planification-urgence*` dans build Netlify.
- **Description EN** : Verify CSP headers active on `/planification-urgence*` in Netlify build.
- **Preconditions** : Build + fichier `public/_headers`.
- **Etapes** : (1) Inspecter `_headers`, (2) Lancer test via `serve` local, (3) Verifier entete.
- **Resultat attendu** : CSP stricte presente.
- **Type** : automated (integration test + curl) + revue manuelle.
- **Priorite** : Medium.
- **Environnements** : staging, prod-like.
- **Module** : security.
- **Tags** : ["csp", "headers"].
- **Dependencies** : [].

## Performance

### PERF-001 â€” Budget chunk build
- **Nom** : Audit bundle budget
- **Description FR** : S'assurer que le chunk budget reste < 500 kB (gzip) lors du build.
- **Description EN** : Ensure budget chunk stays < 500 kB (gzip) during build.
- **Preconditions** : `npm run build`.
- **Etapes** : (1) Construire, (2) Utiliser `vite-bundle-analyzer`, (3) VÃ©rifier taille.
- **Resultat attendu** : Taille < 500 kB, sinon issue.
- **Type** : automated (CI).
- **Priorite** : High.
- **Environnements** : CI.
- **Module** : performance.
- **Tags** : ["bundle", "budget"].
- **Dependencies** : [].

### PERF-002 â€” Temps chargement accueil
- **Nom** : TTI accueil
- **Description FR** : Mesurer TTI sur `/` en mode production via Lighthouse CI.
- **Description EN** : Measure TTI on `/` production build via Lighthouse CI.
- **Preconditions** : `npm run build` + `lhci` config.
- **Etapes** : (1) Servir build, (2) Lancer `lhci autorun`, (3) Export rapport.
- **Resultat attendu** : TTI <= 3.5 s sur machine CI, score Performance >= 90.
- **Type** : automated.
- **Priorite** : Medium.
- **Environnements** : CI.
- **Module** : performance.
- **Tags** : ["lighthouse", "tti"].
- **Dependencies** : [].

### PERF-003 â€” Worker DPBeam stabilite
- **Nom** : Worker DPBeam
- **Description FR** : Evaluer temps reponse worker DPBeam (beamWidth standard) et absence blocage UI.
- **Description EN** : Evaluate DPBeam worker response time (standard beamWidth) and no UI freeze.
- **Preconditions** : Profil demo.
- **Etapes** : (1) Lancer optimisation DP/Beam, (2) Mesurer progression, (3) Arreter via bouton stop.
- **Resultat attendu** : Temps < 25 s, progression updates, stop reussi.
- **Type** : automated (Playwright + instrumentation console).
- **Priorite** : Medium.
- **Environnements** : perf.
- **Module** : retirement-optimization.
- **Tags** : ["worker", "dpbeam"].
- **Dependencies** : [].

### PERF-004 â€” Rappels notifications scheduler
- **Nom** : Notifications perf
- **Description FR** : Verifier que la planification des notifications (90/60/30 jours) ne deraille pas le thread principal.
- **Description EN** : Make sure notification scheduling (90/60/30 days) does not block main thread.
- **Preconditions** : Mode simulateur.
- **Etapes** : (1) Simuler creation objectif, (2) Profiler event loop (Performance API), (3) Verifier tasks.
- **Resultat attendu** : Idle time >= 50 %, pas de blocage > 16 ms.
- **Type** : automated (Vitest + fake timers) + instrumentation.
- **Priorite** : Low.
- **Environnements** : dev.
- **Module** : notifications.
- **Tags** : ["scheduler", "performance"].
- **Dependencies** : [].

### PERF-005 â€” Simulateurs mobiles
- **Nom** : Perf mobile
- **Description FR** : Mesurer LCP/CLS sur viewport mobile (Pixel 5) pour `/wizard/intro`.
- **Description EN** : Measure LCP/CLS on mobile viewport (Pixel 5) for `/wizard/intro`.
- **Preconditions** : Lighthouse mobile config.
- **Etapes** : (1) `lhci` mobile, (2) Export JSON, (3) Evaluer budgets.
- **Resultat attendu** : LCP <= 4 s, CLS <= 0.1.
- **Type** : automated.
- **Priorite** : Medium.
- **Environnements** : CI.
- **Module** : performance.
- **Tags** : ["mobile", "lighthouse"].
- **Dependencies** : [].

## Accessibilite

### A11Y-001 â€” Audit axe core global
- **Nom** : axe-core global
- **Description FR** : Executer axe-core sur pages critiques (accueil, wizard, urgence, outils).
- **Description EN** : Run axe-core on critical pages (home, wizard, emergency, tools).
- **Preconditions** : Build ou dev server.
- **Etapes** : (1) Playwright + axe injection, (2) Collecter violations.
- **Resultat attendu** : 0 violation serious/critical.
- **Type** : automated.
- **Priorite** : High.
- **Environnements** : dev, CI.
- **Module** : accessibility.
- **Tags** : ["axe", "playwright"].
- **Dependencies** : [].

### A11Y-002 â€” Lecteur ecran wizard
- **Nom** : AT wizard
- **Description FR** : Verifier annonces SR lorsqu'on navigue wizard (role, aria-describedby, `aria-live`).
- **Description EN** : Verify screen reader announcements while navigating wizard (role, aria-describedby, `aria-live`).
- **Preconditions** : NVDA/VoiceOver tests eventuellement manuels.
- **Etapes** : (1) Playwright + snapshots `aria`, (2) Tests manuels NVDA.
- **Resultat attendu** : Annonces completes.
- **Type** : hybrid (automated + manual assistive tech).
- **Priorite** : High.
- **Environnements** : dev, staging.
- **Module** : accessibility.
- **Tags** : ["wizard", "screenreader"].
- **Dependencies** : [].

### A11Y-003 â€” Dialogues Radix focus trap
- **Nom** : Focus dialogues
- **Description FR** : Tester focus trap et fermeture clavier des dialogues (PDF, confirmation export).
- **Description EN** : Test focus trap and keyboard closing on dialogs (PDF, export confirmation).
- **Preconditions** : Pages wizard, urgence.
- **Etapes** : (1) Ouvrir dialogue, (2) Utiliser Tab/Shift+Tab, (3) Fermer via Esc/Enter.
- **Resultat attendu** : Focus reste dans dialogue, fermetures accessibles.
- **Type** : automated (Playwright keyboard).
- **Priorite** : Medium.
- **Environnements** : dev.
- **Module** : accessibility.
- **Tags** : ["dialog", "focus"].
- **Dependencies** : [].

### A11Y-004 â€” Contraste placeholders marketing
- **Nom** : Contraste placeholder
- **Description FR** : Valider contraste texte/fond sur pages placeholders (couleurs seniors palette).
- **Description EN** : Validate text/background contrast on placeholder pages (senior palette).
- **Preconditions** : Flag placeholders vrai.
- **Etapes** : (1) Activer flag, (2) Utiliser axe color checker, (3) Verifier ratio >= 4.5:1.
- **Resultat attendu** : Contraste suffisant.
- **Type** : automated.
- **Priorite** : Medium.
- **Environnements** : dev.
- **Module** : marketing.
- **Tags** : ["contrast", "placeholder"].
- **Dependencies** : [].

### A11Y-005 â€” Taille zones clic bouton 56 px
- **Nom** : Zones clic seniors
- **Description FR** : Controler que boutons principaux respectent hauteur >=56 px et padding suffisant.
- **Description EN** : Check primary buttons height >=56 px and sufficient padding.
- **Preconditions** : Mode seniors actif.
- **Etapes** : (1) Mesurer via Playwright bounding boxes, (2) Capturer rapport.
- **Resultat attendu** : Tous boutons conformes ou correction planifiee.
- **Type** : automated.
- **Priorite** : Low.
- **Environnements** : dev.
- **Module** : ui-global.
- **Tags** : ["seniors", "buttons"].
- **Dependencies** : [].

## Compatibilite

### COMP-001 â€” Chrome/Edge latest
- **Nom** : Compat Chrome Edge
- **Description FR** : Executer tests E2E Chrome + Edge (chromium + msedge UA) via Playwright.
- **Description EN** : Run E2E tests on Chrome and Edge (chromium + msedge UA) with Playwright.
- **Preconditions** : Playwright browsers installes.
- **Etapes** : (1) `npx playwright test --browser=chromium`, (2) `--browser=msedge`.
- **Resultat attendu** : Suites vertes.
- **Type** : automated.
- **Priorite** : High.
- **Environnements** : dev, CI.
- **Module** : compatibility.
- **Tags** : ["browser", "chromium"].
- **Dependencies** : [].

### COMP-002 â€” Firefox check
- **Nom** : Compat Firefox
- **Description FR** : Lancer subset tests sur Firefox (navigation, wizard intro).
- **Description EN** : Run subset tests on Firefox (navigation, wizard intro).
- **Preconditions** : Playwright firefox installe.
- **Etapes** : (1) `npx playwright test --project=firefox smoke`, (2) Capturer video.
- **Resultat attendu** : Tests passes, anomalies en backlog.
- **Type** : automated.
- **Priorite** : Medium.
- **Environnements** : CI nightly.
- **Module** : compatibility.
- **Tags** : ["firefox"].
- **Dependencies** : [].

### COMP-003 â€” Safari manuel
- **Nom** : Compat Safari
- **Description FR** : Check manuel sur Safari (Mac) pour wizard + urgence (checklist, video capture).
- **Description EN** : Manual check on Safari (Mac) for wizard + emergency (checklist, video capture).
- **Preconditions** : Acces Mac test.
- **Etapes** : (1) Suivre checklist, (2) Joindre capture.
- **Resultat attendu** : Aucun bloquant critique.
- **Type** : manual.
- **Priorite** : Medium.
- **Environnements** : staging.
- **Module** : compatibility.
- **Tags** : ["safari", "manual"].
- **Dependencies** : [].

### COMP-004 â€” Viewport mobile responsive
- **Nom** : Compat mobile
- **Description FR** : Tester responsive sur viewports iPhone 12/Pixel 5 (navigation, formulaires).
- **Description EN** : Test responsive on iPhone 12/Pixel 5 viewports (navigation, forms).
- **Preconditions** : Playwright device profiles.
- **Etapes** : (1) `npx playwright test --project=iphone-12`, (2) `--project=pixel-5`.
- **Resultat attendu** : Layout stable, aucun overflow.
- **Type** : automated.
- **Priorite** : Medium.
- **Environnements** : dev, CI.
- **Module** : compatibility.
- **Tags** : ["mobile", "responsive"].
- **Dependencies** : [].

### COMP-005 â€” Zoom 200 pour seniors malvoyants
- **Nom** : Compat zoom 200
- **Description FR** : Verifier que l'interface reste utilisable avec zoom navigateur 200 %.
- **Description EN** : Ensure interface remains usable at 200 % browser zoom.
- **Preconditions** : Scenario wizard.
- **Etapes** : (1) Playwright set viewport scale, (2) Verifier absence overlap, (3) Capturer screenshot.
- **Resultat attendu** : Composants reflow correct.
- **Type** : automated (Playwright + screenshot diff).
- **Priorite** : Low.
- **Environnements** : dev.
- **Module** : accessibility/compat.
- **Tags** : ["zoom", "seniors"].
- **Dependencies** : [].

## Resilience

### RES-001 â€” Worker Monte Carlo interruption
- **Nom** : Interruption Monte Carlo
- **Description FR** : Tester annulation simulation Monte Carlo via bouton stop.
- **Description EN** : Test Monte Carlo simulation cancellation via stop button.
- **Preconditions** : Simulation en cours.
- **Etapes** : (1) Lancer simulation, (2) Cliquer stop, (3) Verifier message resume.
- **Resultat attendu** : Worker termine proprement, UI responsive.
- **Type** : automated.
- **Priorite** : Medium.
- **Environnements** : dev.
- **Module** : resilience.
- **Tags** : ["worker", "cancel"].
- **Dependencies** : ["FUNC-003"].

### RES-002 â€” BackgroundBackup panne stockage
- **Nom** : Echec stockage
- **Description FR** : Simuler echec File System Access et verifier fallback (alerte UI, logs).
- **Description EN** : Simulate File System Access failure and verify fallback (UI alert, logs).
- **Preconditions** : Mock storage rejette promesse.
- **Etapes** : (1) Injecter mock rejection, (2) Observer message.
- **Resultat attendu** : Message bienveillant, aucune exception non capturee.
- **Type** : automated (Vitest + react testing library).
- **Priorite** : Medium.
- **Environnements** : dev.
- **Module** : resilience.
- **Tags** : ["backup", "error"].
- **Dependencies** : [].

### RES-003 â€” Flags degrade graceful
- **Nom** : Flags degrade
- **Description FR** : Verifier que l'absence de configuration flags applique valeurs par defaut sans crash.
- **Description EN** : Verify missing flags fallback to defaults without crash.
- **Preconditions** : Variables non definies.
- **Etapes** : (1) Lancer app sans `.env`, (2) Observer comportement.
- **Resultat attendu** : Flags false par defaut, UI stable.
- **Type** : automated (Vitest + env override).
- **Priorite** : Low.
- **Environnements** : dev.
- **Module** : resilience.
- **Tags** : ["flags", "defaults"].
- **Dependencies** : [].

### RES-004 â€” Import JSON legacy
- **Nom** : Legacy import
- **Description FR** : Controler que l'import d'un JSON legacy affiche avertissement puis chiffre localement.
- **Description EN** : Ensure importing legacy JSON shows warning then encrypts locally.
- **Preconditions** : Fichier legacy sample.
- **Etapes** : (1) Importer JSON, (2) Confirmer avertissement, (3) Verifier migration storage.
- **Resultat attendu** : Donnees migrees, avertissement visible.
- **Type** : automated (Playwright + storage inspection).
- **Priorite** : Medium.
- **Environnements** : dev.
- **Module** : emergency.
- **Tags** : ["legacy", "migration"].
- **Dependencies** : [].

### RES-005 â€” Auto lock session 5 minutes
- **Nom** : Auto lock
- **Description FR** : Valider verrouillage automatique apres 5 min inactivite sur module urgence.
- **Description EN** : Validate auto lock after 5 minutes inactivity on emergency module.
- **Preconditions** : Session deverrouillee.
- **Etapes** : (1) Ouvrir module, (2) Avancer temps 5 min, (3) Verifier ecran lock.
- **Resultat attendu** : Session se verrouille, message bienveillant.
- **Type** : automated (Playwright + fake timers).
- **Priorite** : High.
- **Environnements** : dev, staging.
- **Module** : emergency.
- **Tags** : ["lock", "timeout"].
- **Dependencies** : [].

## Smoke

### SMOKE-001 â€” Chargement app + routes
- **Nom** : Smoke routes
- **Description FR** : Executer `npm run test:routes` pour valider fragments LocalizedRoute.
- **Description EN** : Run `npm run test:routes` to validate LocalizedRoute fragments.
- **Preconditions** : Dep install.
- **Etapes** : (1) Commande, (2) Observer resultat.
- **Resultat attendu** : Tests passes.
- **Type** : automated.
- **Priorite** : High.
- **Environnements** : dev, CI.
- **Module** : routing.
- **Tags** : ["smoke", "routes"].
- **Dependencies** : [].

### SMOKE-002 â€” Lancement dev server
- **Nom** : Smoke dev server
- **Description FR** : Confirmer que `npm run dev -- --host` demarre sans erreurs majeures.
- **Description EN** : Confirm `npm run dev -- --host` starts without major errors.
- **Preconditions** : Node 20.
- **Etapes** : (1) Demarrer, (2) Attendre build, (3) Ctrl+C.
- **Resultat attendu** : Aucun crash.
- **Type** : manual (rapide).
- **Priorite** : Medium.
- **Environnements** : dev.
- **Module** : smoke.
- **Tags** : ["devserver"].
- **Dependencies** : [].

### SMOKE-003 â€” Page outils accessible
- **Nom** : Smoke outils
- **Description FR** : Verifier que `/outils` se charge et liste cartes depuis `tools-catalog`.
- **Description EN** : Check `/tools` loads and lists cards from `tools-catalog`.
- **Preconditions** : Build data.
- **Etapes** : (1) Playwright open page, (2) Valider cards.
- **Resultat attendu** : Page rendue, aucun warning console.
- **Type** : automated.
- **Priorite** : Medium.
- **Environnements** : dev.
- **Module** : smoke.
- **Tags** : ["tools", "routing"].
- **Dependencies** : [].

### SMOKE-004 â€” Modules retirement chargement rapide
- **Nom** : Smoke retirement lazy
- **Description FR** : Tester chargement lazy modules `retirementRoutes` (simulateur, rapports) sans erreurs console.
- **Description EN** : Test lazy loading of `retirementRoutes` modules without console errors.
- **Preconditions** : Build.
- **Etapes** : (1) Aller `/retraite/outils-avances`, (2) Surveiller console.
- **Resultat attendu** : Aucun warning React Suspense.
- **Type** : automated.
- **Priorite** : Low.
- **Environnements** : dev.
- **Module** : smoke.
- **Tags** : ["lazy", "retirement"].
- **Dependencies** : [].

### SMOKE-005 â€” Sauvegarde locale baseline
- **Nom** : Smoke sauvegarde
- **Description FR** : Executer test rapide `BackgroundBackupService` (existing jest) post build.
- **Description EN** : Run quick `BackgroundBackupService` test (existing jest) after build.
- **Preconditions** : `npm run test`.
- **Etapes** : (1) Commande subset, (2) Observer succes.
- **Resultat attendu** : Tests passent.
- **Type** : automated.
- **Priorite** : Medium.
- **Environnements** : dev, CI.
- **Module** : smoke.
- **Tags** : ["backup", "jest"].
- **Dependencies** : [].

