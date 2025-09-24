# Architecture Style Guide — MonPlanRetraite.ca

Objectif
- Garantir une architecture cohérente, accessible et conforme OQLF, sans impacter les fonctionnalités ni la précision des calculs.
- Servir de référence pour toute nouvelle fonctionnalité (UI, domaine, données, infra).

Sommaire
- Couches & frontières
- UI Seniors & OQLF (grille .mpr-*)
- Routage modulaire
- Persistance & confidentialité
- Dépendances & qualité (lint/scripts)
- Tests prioritaires (confidentialité sauvegarde)

1) Couches & frontières
- UI (pages, composants)
  - Affichage, interactions, i18n. Interdit d’importer directement workers.
- Domaine (interfaces)
  - Contrats: src/domain/retirement, src/domain/budget (ITaxEngine, IProjectionEngine, IBudgetService, etc.)
- Services (implémentations)
  - Barrels:
    - src/services/core (transverse/technique: backup, pdf, notifications…)
    - src/services/retirement (namespaced: Tax, SRG, RREGOP, Robustness, Optimizers)
  - Interdit d’importer pages/components.
- Infra
  - Vite, Netlify, WebCrypto, Workers, routing.
- Règles (lint “frontières”)
  - UI → workers: interdit
  - Services → UI: interdit
  - Routes → services/workers: interdit
  - Script: npm run lint:boundaries

2) UI Seniors & OQLF
- Règle absolue formulaires: “1 ligne = 1 label + 1 champ”
  - Grille: .mpr-form, .mpr-form-row (cols-1/2/3), .mpr-field
  - Composants: FormGrid, FormRow, Field (src/components/forms/FormGrid.tsx)
  - Mobile: label à gauche, champ à droite (grid-template-columns: minmax(120px,45%) 1fr)
- Accessibilité seniors
  - Police ≥ 18 px; champs ≥ 48 px; boutons ≥ 56 px; focus visible; contrastes élevés
- OQLF (exemples)
  - Montants: 1 234,56 $; % avec espace insécable avant %
  - Heure: 13 h 05; majuscules: pas de Title Case en FR
  - Ne jamais remplacer " par « » dans le code
- Script UI (advisory)
  - npm run lint:mpr — alerte si labels hors .mpr-field ou formulaire sans .mpr-form/.mpr-form-row

3) Routage modulaire
- Fragments de routes (routes/*.tsx):
  - blogRoutes, mainRoutes, mainRoutesCore, governmentRoutes, reportsRoutes, labsRoutes
- App.tsx = shell (Providers, Layout, fallback), consomme les fragments de routes
- Labs (démos/tests)
  - routes/labsRoutes.tsx, guardées par VITE_ENABLE_LABS=false (prod)
  - chemins /labs/* uniquement en local/dev
- Placeholders marketing: VITE_SHOW_PLACEHOLDERS

4) Persistance & confidentialité
- 100 % local — aucune transmission réseau de données sensibles
- secureStorage (AES‑GCM), encryption fichiers (WebCrypto AES‑256‑GCM + PBKDF2‑SHA256)
- BackgroundBackupService (sauvegardes chiffrées)
  - Liens de fichiers (File System Access API)
  - Option clearLocalAfterBackup pour supprimer retirement_data du localStorage après sauvegarde
  - Tests prioritaires (voir section Tests)

5) Dépendances & qualité
- Scripts (advisory)
  - Lint frontières: npm run lint:boundaries
  - Vérif UI mpr-forms: npm run lint:mpr
  - Dépendances:
    - npm run deps:check — cycles (madge/depcruise si installés) + imports interdits
    - npm run deps:graph — export JSON (.deps-graph.json) via dependency-cruiser si dispo (fallback scan local)
- Bonnes pratiques
  - Lazy load pages lourdes; chunks < 500 kB (budget performance)
  - ManualChunks Vite si nécessaire (financial-core, analytics, date-lib…)

6) Tests prioritaires (confidentialité sauvegarde)
- secureStorage
  - Tests déjà présents (src/lib/secureStorage.test.ts)
  - Étendre: redéclenchements edge cases, corruption, compat navigateurs
- BackgroundBackupService
  - Vérifier que:
    - Aucune donnée en clair n’est écrite dans le fichier de sauvegarde (envelope JSON chiffrée)
    - clearLocalAfterBackup supprime retirement_data du localStorage
    - proposeRestoreIfNeeded ne restaure qu’avec mot de passe valide
  - Scénarios mockés (IndexedDB, showSaveFilePicker, FileSystemWritable)
- PDF/Reports
  - Aucune fuite réseau (local), contenu conforme (redaction par défaut pour identifiants sensibles)

Annexes: Commandes
- Dev: npm run dev
- Lint frontières: npm run lint:boundaries
- Lint UI mpr: npm run lint:mpr
- Dépendances (scan): npm run deps:check
- Dépendances (graph JSON): npm run deps:graph
- Typecheck: npm run typecheck
- Tests: npm test

Références
- architecture.md (structure globale, modules, UI seniors)
- AGENTS.md (procédures, OQLF, sécurité, modules retraite/budget)
- 2025-09-18 Instructions uniformisation web.md (spéc. UI formulaires)
