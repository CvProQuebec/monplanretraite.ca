# ðŸ¤– AGENTS.md - MonPlanRetraite.ca

## ðŸ“£ Mises Ã  jour 2025â€‘09 â€” ItÃ©rations Aâ†’D (procÃ©dures & DoD)

But: documenter les procÃ©dures opÃ©rationnelles suite aux refactors structurels livrÃ©s (aucun changement de calcul). Ã€ appliquer pour toutes nouvelles tÃ¢ches similaires.

1) Routage modulairisÃ© + LocalizedRoute (ItÃ©ration A)
- Principe:
  - Ã‰viter le JSX inline `<Route element={<divâ€¦} />` dans `App.tsx`.
  - DÃ©clarer des groupes de routes dans `src/routes/*` et les consommer dans `App.tsx` comme fragments.
- Outil:
  - `src/routes/LocalizedRoute.tsx` â€” supporte:
    - mÃªme composant FR/EN: `component={MyPage}`
    - composants distincts FR vs EN: `componentFr`/`componentEn`
    - mÃªme Ã©lÃ©ment FR/EN: `element={<JSX />}`
    - Ã©lÃ©ments distincts: `elementFr`/`elementEn`
- DoD (routes):
  - [ ] Nouveau groupe dans `src/routes/*.tsx` (< 200 lignes; scinder si nÃ©cessaire).
  - [ ] Utilisation de LocalizedRoute pour les paires FR/EN.
  - [ ] `App.tsx` ne contient que lâ€™assemblage des fragments (`<MainRoutesHome />`, etc.).
  - [ ] Test smoke SSR mis Ã  jour si nouveau fragment de routes (fichier `src/routes/__tests__/routes-smoke.test.tsx`).

2) Routes marketing & placeholders (ItÃ©ration D)
- Principe:
  - Remplacer tout JSX inline par des composants dÃ©diÃ©s sous `src/pages/placeholder/*`.
  - Activer les routes â€œÃ  venirâ€ via un flag centralisÃ©.
- Fichiers:
  - `src/pages/placeholder/PlaceholderInfoPage.tsx` (gabarit rÃ©utilisable).
  - `src/routes/marketingExtrasRoutes.tsx` (placeholders + â€œRÃ¨gle du 4 %â€).
  - `src/config/flags.ts` (rÃ©solution Vite/Node/Jest sans import.meta direct).
  - `src/hooks/useFlags.ts` (hook mÃ©moÃ¯sÃ© qui expose `FLAGS` â†’ `const { SHOW_PLACEHOLDERS } = useFlags()`).
- DoD (placeholders):
  - [ ] Le texte marketing statique est rendu via `PlaceholderInfoPage` (pas de JSX inline dans `App.tsx`).
  - [ ] Lâ€™activation des placeholders est branchÃ©e sur `SHOW_PLACEHOLDERS`.
  - [ ] AccessibilitÃ© seniors respectÃ©e (tailles et contraste).

3) FrontiÃ¨res UI â†” Services & FaÃ§ade domaine (ItÃ©ration B)
- Principe:
  - La couche UI ne doit plus importer `@/services/tax/*` directement.
  - Utiliser la faÃ§ade de domaine: `src/domain/retirement/RetirementDomainAdapter.ts`
  - Helpers mis Ã  disposition de lâ€™UI:
    - `RetirementHelpers.suggestWithdrawalOrder`, `buildMonthlySchedule`, `generateTaxOptimizationSummary`
    - `RetirementHelpers.greedyOptimize`, `simulateYears`, `computeTaxYear`, `evaluateRobustness`
- Lint (frontiÃ¨res):
  - RÃ¨gles dans `.eslint-boundaries.cjs` (ignore `dist/`, `node_modules/`, `public/`).
  - Commande: `npm run lint:boundaries`
- DoD (UI/services):
  - [ ] Aucun import direct `@/services/tax/*` en UI (lint passe).
  - [ ] Ã‰crans critiques utilisent `RetirementHelpers` (prÃ©server les signatures UI, zÃ©ro changement de calcul).

4) Structuration des services (ItÃ©ration C)
- Principe:
  - Ajouter des points dâ€™entrÃ©e thÃ©matiques â€œbarrelsâ€ non intrusifs pour clarifier les imports sans dÃ©placer les sources.
- Nouveaux points dâ€™entrÃ©e:
  - Core/Persistence: `src/services/core/persistence.ts`
  - Core/Engagement: `src/services/core/engagement.ts`
  - Budget: `src/services/budget/index.ts`
  - Notifications: `src/services/notifications/index.ts`
  - Security: `src/services/security/index.ts`
- DoD (imports):
  - [ ] Nouveaux imports privilÃ©gient les barrels thÃ©matiques.
  - [ ] Aucun breaking sur les imports historiques (adoption progressive).

5) QA & CI (rappel)
- Typecheck: `npm run typecheck`
- Smoke routes: `npm run test:routes`
- Lint frontiÃ¨res: `npm run lint:boundaries`
- DoD global (Aâ†’D):
  - [ ] Typecheck OK
  - [ ] Tests smoke routes PASS
  - [ ] Lint frontiÃ¨res PASS
  - [x] Pipeline QA automatisee 2025-09-24 (Vitest, Playwright, k6, ZAP) — docs/tests.md, reports/2025-09-24/, .github/workflows/qa-suite.yml.

6) Services seniors dÃ©couplÃ©s & types partagÃ©s (ItÃ©ration F)
- Principe:
  - Extraire les types UI spÃ©cifiques aux services dans `src/types/services.ts` pour centraliser notifiers, prÃ©dictions de navigation, handlers de performance et logs de test.
  - `SeniorsOptimizationService` devient configurable: uniquement des fonctions pures (`preloadModules`, `preloadPredictedModules`, `monitorPerformance`) avec options injectÃ©es via `SeniorsOptimizationInitializeConfig`. Aucun toast/console forcÃ© cÃ´tÃ© service (passer un `ModuleWarningReporter` facultatif).
  - `ModuleTestService` renvoie `ModuleTestResult` et `PageTestResult` (logs structurÃ©s) et accepte un callback `log` pour que lâ€™UI gÃ¨re lâ€™affichage (ex: toasts).
  - `src/types/index.ts` rÃ©-exporte les nouveaux types pour consommation simple (`import { ModuleTestResult } from '@/types'`).
- DoD (services seniors):
  - [ ] Aucun appel direct aux hooks/UI dans les services (`toast`, `useToast`, etc.) â€” la logique dâ€™affichage vit dans les pages/hooks.
  - [ ] Les reporters/notifiers sont injectÃ©s depuis la couche UI (hooks/pages) en utilisant les types partagÃ©s.
  - [ ] Les tests/unitaires continuent de fonctionner (contrats inchangÃ©s cÃ´tÃ© calcul).

7) Sous-modules Retraite (optimization / analysis / dashboards) â€” ItÃ©ration G
- Principe:
  - Scinder progressivement `src/features/retirement/components` en trois sous-dossiers:
    - `optimization/` (lab optimisations, simulateurs, contrÃ´les avancÃ©s)
    - `analysis/` (sections RRQ/CPP, SRG, OAS, comparaisons analytiques)
    - `dashboards/` (tableaux de bord, cartes synthÃ¨se, UI rÃ©capitulatives)
  - DÃ©placer les composants existants sans modifier leur logique mÃ©tier; mettre Ã  jour les imports progressivement.
- ProcÃ©dure:
  - CrÃ©er les dossiers cibles (dÃ©jÃ  initialisÃ©s).
  - DÃ©placer un composant Ã  la fois (ex: `MonteCarloSimulator` â†’ `optimization/MonteCarloSimulator.tsx`).
  - Mettre Ã  jour le barrel `features/retirement/components/index.ts` aprÃ¨s chaque dÃ©placement (export vers le nouveau chemin).
  - Ajuster les imports consommateurs (`@/features/retirement/components/...`).
- DoD (pour chaque lot de composants dÃ©placÃ©s):
  - [ ] Aucun changement de calcul (seulement des chemins).
  - [ ] Barrel `index.ts` mis Ã  jour.
  - [ ] Typecheck / lint OK (surtout `lint:boundaries`).
  - [ ] Documentation `architecture.md` reflÃ¨te lâ€™Ã©tat du dÃ©coupage (cf. section ItÃ©ration G).

## ðŸ“‹ INSTRUCTIONS POUR LES MODIFICATIONS DU SITE WEB

### Contexte
Ces instructions s'appliquent aux demandes de modification transmises Ã  ChatGPT-5, Grok-code-fast-1 ou Claude Sonnet 4 dans l'interface Visual Studio Code ou Cursor.

### ðŸš¨ RÃˆGLE CRITIQUE - FORMATAGE OQLF
ATTENTION ABSOLUE : Lors de l'application des rÃ¨gles OQLF, NE JAMAIS remplacer les guillemets droits " par des chevrons Â« Â» dans le code JavaScript/TypeScript. Les guillemets droits sont ESSENTIELS pour le fonctionnement du code.

EXEMPLE CORRECT :
```typescript
// âœ… GARDER LES GUILLEMETS DROITS DANS LE CODE
const message = "Prix : 119,99 $";
const className = "senior-btn senior-btn-primary";
```

EXEMPLE INTERDIT :
```typescript
// âŒ NE JAMAIS FAIRE CECI - CASSE LE CODE
const message = Â« Prix : 119,99 $ Â»;
const className = Â« senior-btn senior-btn-primary Â»;
```

### Gestion des champs de donnÃ©es

#### Nouveaux champs ou modifications de noms
Lorsque de nouveaux champs sont crÃ©Ã©s ou que des noms de champs existants sont modifiÃ©s :

RÃ©cupÃ©ration des donnÃ©es existantes
- Assurer la rÃ©cupÃ©ration des donnÃ©es/valeurs depuis le fichier de sauvegarde manuel de l'utilisateur
- Mapper les anciens noms de champs vers les nouveaux si applicable
- PrÃ©server l'intÃ©gritÃ© des donnÃ©es lors des changements

Initialisation des sessions
- Ã€ l'ouverture d'une nouvelle session, tous les champs doivent avoir une valeur Â« vide Â» par dÃ©faut
- Ces valeurs vides seront ensuite alimentÃ©es par la rÃ©cupÃ©ration automatique du fichier de sauvegarde
- VÃ©rifier que le mÃ©canisme de chargement fonctionne correctement

### Documentation et rÃ©fÃ©rences

Fichiers de rÃ©fÃ©rence
- Architecture : Consulter H:\monplanretraite.ca\private-docs\architecture\AGENTS.md pour toute information nÃ©cessaire
- ProcÃ©dures : Toutes les procÃ©dures sont sauvegardÃ©es sous H:\monplanretraite.ca\private-docs\roadmap

Mise Ã  jour obligatoire
- Post-implÃ©mentation : Mettre Ã  jour le fichier H:\monplanretraite.ca\private-docs\architecture\AGENTS.md une fois les travaux terminÃ©s
- Contenu de la documentation : Inclure les modifications apportÃ©es, les nouveaux champs crÃ©Ã©s, et les impacts sur l'architecture existante

### Checklist de validation (avant de considÃ©rer la tÃ¢che terminÃ©e)
- âœ… Nouveaux champs correctement intÃ©grÃ©s
- âœ… MÃ©canisme de sauvegarde/rÃ©cupÃ©ration testÃ©
- âœ… Initialisation des sessions vÃ©rifiÃ©e
- âœ… Documentation AGENTS.md mise Ã  jour
- âœ… ProcÃ©dures sauvegardÃ©es dans roadmap si applicable

---

## ðŸŽ¯ PHILOSOPHIE DE POSITIONNEMENT PREMIUM

Vision stratÃ©gique
Â« Pourquoi payer 5 000 $ Ã  10 000 $ pour un conseiller financier quand vous pouvez avoir les mÃªmes outils professionnels pour une fraction du coÃ»t? Â»

MonPlanRetraite.ca n'est PAS un outil Â« bon marchÃ© Â» â€” c'est une solution professionnelle accessible qui offre :
- âœ… 75+ fonctionnalitÃ©s documentÃ©es Ã©quivalentes aux outils de conseillers professionnels
- âœ… Valeur marchande de 5 000 $ Ã  10 000 $ pour une fraction du prix
- âœ… ROI de 94-95 % par rapport aux services traditionnels
- âœ… Expertise Retraite101 intÃ©grÃ©e et validÃ©e
- âœ… SÃ©curitÃ© bancaire avec donnÃ©es 100 % locales

---

## ðŸ†• OFFRE & CAPS (2025â€‘09)

Plans (annuels uniquement, audience 50â€“90 ans)
- Gratuit
  - 5 simulations/mois, 1 rapport, 1 scÃ©nario sauvegardÃ©
  - Monte Carlo dÃ©sactivÃ©, aucun export
  - Module dâ€™urgence (8 sections), Budget/DÃ©penses basiques, IA prÃ©vention
- Professionnel (Pro)
  - 50 simulations/mois, 30 rapports PDF â€œrÃ©sumÃ©â€ (filigrane), 20 scÃ©narios
  - Monte Carlo 100 itÃ©rations (aperÃ§u), comparaisons 3 scÃ©narios
  - CSV dÃ©sactivÃ© (exports avancÃ©s rÃ©servÃ©s Ã  Expert)
- Expert
  - Simulations/scÃ©narios/rapports illimitÃ©s
  - Monte Carlo 2000 itÃ©rations, comparaisons 10 scÃ©narios
  - Export PDF pro (sans filigrane) + CSV, rapports â€œniveau consultantâ€

Disclaimers & support (Ã  respecter dans la copie UI)
- Outil Ã©ducatif; aucun conseil financier/fiscal/juridique personnalisÃ©
- Aucune affiliation; aucun permis AMF
- DonnÃ©es 100 % locales (AESâ€‘256); zÃ©ro rÃ©seau
- Support autoâ€‘assistÃ© (FAQ/bulles dâ€™aide); pas de tÃ©lÃ©phone

Comparatif des plans (copie simple, sans jargon)
- Utiliser FEATURE_CATALOG (src/config/plans.ts) comme source unique pour les libellÃ©s + descriptions de la page dâ€™accueil.
- RÃ¨gle: verbes simples, bÃ©nÃ©fices concrets (â€œvoir vos montantsâ€, â€œÃ©viter les pertes SV/SRGâ€, â€œrapports prÃªts Ã  imprimerâ€).
- Ã‰viter les acronymes techniques non essentiels ou les dÃ©tailler dans la desc.

## ðŸ§° Page Outils â€” ProcÃ©dure dâ€™ajout et conformitÃ© (nouvelle page â€œOutilsâ€)

- Source unique (catalogue):
  - Ajouter une entrÃ©e dans `src/config/tools-catalog.ts` avec les champs:
    - `id`, `plan: 'free'|'professional'|'expert'`, `routeFr`, `routeEn`
    - `titleFr`, `titleEn` (FR: seule la premiÃ¨re majuscule; pas dâ€™anglicisme)
    - `descFr`, `descEn` (typographie OQLF: espace avant : % $, aucune espace avant ; ! ?)
    - `icon?` (nom symbolique lucide-react ou Ã©quivalent)
- UI:
  - Aucune carte ad hoc. Utiliser `src/components/ui/ToolCard.tsx` pour lâ€™affichage dâ€™une carte.
  - La page liste est `src/pages/AllToolsPage.tsx` (routes: `/outils` et `/tools`).
  - Respect seniors: police â‰¥ 18 px, boutons â‰¥ 56 px, focus visible, contraste Ã©levÃ©.
- Navigation:
  - Le menu â€œOutilsâ€ pointe vers `/outils` (FR) et `/tools` (EN). Ne pas rÃ©introduire de sousâ€‘menu dÃ©roulant.
- OQLF / i18n:
  - FR: seul le premier mot dâ€™un titre en majuscule; terminologie OQLF (aucun anglicisme).
  - Typographie: espace avant : % $ ; aucune espace avant ; ! ?
  - Fournir systÃ©matiquement `titleFr/titleEn` et `descFr/descEn`.
- Documentation (obligatoire):
  - Mettre Ã  jour `architecture.md` (section Page Outils) si nouveaux outils ajoutÃ©s.
  - VÃ©rifier la cohÃ©rence plan (Gratuit/Pro/Expert) avec `FEATURE_CATALOG` si texte marketing associÃ©.
- Definition of Done (ajout dâ€™un outil):
  - [ ] EntrÃ©e ajoutÃ©e au `tools-catalog.ts` (FR/EN complets, plan correct)
  - [ ] Carte rendue dans `/outils` (gating et CTA â€œMettre Ã  niveauâ€ si nÃ©cessaire)
  - [ ] ConformitÃ© OQLF (titres/typographie), accessibilitÃ© (focus/ARIA), i18n
  - [ ] Build/typecheck/lint OK

## ðŸ›£ï¸ Modularisation des routes â€” ProcÃ©dure (rÃ©duction â€œfichier Dieuâ€)

Objectif
- DÃ©placer les groupes de routes hors de `src/App.tsx` pour clarifier les domaines et rÃ©duire les risques de rÃ©gression.

Conventions
- Un fichier = un groupe logique cohÃ©rent (ex.: `blogRoutes.tsx`, `mainRoutes.tsx`, `mainRoutesCore.tsx`, `governmentRoutes.tsx`, `reportsRoutes.tsx`).
- Exporter un fragment de `<Route />`:
  ```tsx
  export function GovernmentRoutes() {
    return (
      <>
        <Route path="/oas-gis-analysis" element={<OASGISAnalysis />} />
        <Route path="/analyse-oas-gis" element={<OASGISAnalysis />} />
      </>
    );
  }
  ```
- Laisser `App.tsx` comme â€œshellâ€: Providers, Layout, fallback lazy, et import/usage des modules de routes.

ImplÃ©mentation actuelle (2025â€‘09)
- `src/routes/blogRoutes.tsx` (blog: accueil, article, catÃ©gories, compat).
- `src/routes/mainRoutes.tsx` (accueil FR/EN: `/`, `/fr`, `/en`, `/accueil`, `/home`).
- `src/routes/mainRoutesCore.tsx` (profil, retraite, revenus, budget).
- App.tsx consomme ces modules via:
  ```tsx
  <MainRoutesHome />
  <MainRoutesCore />
  <BlogRoutes />
  ```

Placeholders marketing (flag build)
- `VITE_SHOW_PLACEHOLDERS` (string "true"/"false") contrÃ´le lâ€™affichage de routes â€œÃ  venirâ€.
- Production: dÃ©finir `VITE_SHOW_PLACEHOLDERS=false` (voir `routes/README.md`).

Definition of Done (ajout de routes)
- [ ] Groupe de routes < 200 lignes; scinder si nÃ©cessaire.
- [ ] Pages lourdes en lazy; chunk â‰¤ 500 kB.
- [ ] i18n + OQLF respectÃ©s (titres FR: premier mot seulement, espaces avant : % $, pas avant ; ! ?).
- [ ] `App.tsx` garde uniquement les imports et balises des modules.

Blog bilingue â€” navigation FRâ†”EN
- Chaque article doit dÃ©finir relatedSlugFr/relatedSlugEn
- Le parseur (content.ts) est tolÃ©rant aux frontâ€‘matters (tags/keyPoints string/array)
- Les pages de blog et lâ€™accueil utilisent ces slugs pour le bouton de bascule de langue

## ðŸ§© COUCHES & DOMAINES (2025â€‘09)

Objectif
- Rendre explicites les frontiÃ¨res UI â†” Domaine â†” Services (core/retirement) sans modifier la logique mÃ©tier ni les calculs.

Couches
- UI (pages, composants)
  - Formulaires: utiliser FormGrid/FormRow/Field (`src/components/forms/FormGrid.tsx`) pour le patron â€œ1 ligne = 1 label + 1 champâ€.
  - Routes: modules sous `src/routes/*` (Blog, Home, Core, Government, Reports).
- Domaine (contrats/interfaces â€” aucune implÃ©mentation)
  - Retraite: `src/domain/retirement` (ITaxEngine, ITaxPolicy, IProjectionEngine, IRobustnessService, ITaxOptimizationService, IGovernmentBenefitService, IRetirementCalculationService, IProfessionalReportService, IRetirementDomain).
  - Budget: `src/domain/budget` (IBudgetService, INetWorthService, INotificationService, IGamificationService, IBudgetDomain).
- Services (implÃ©mentations existantes, non dÃ©placÃ©es)
  - Core (barrel): `src/services/core` (persistance, sauvegarde, notifications, PDF, cache, etc.) â€” rÃ©export non intrusif.
  - Retraite (barrel namespaced): `src/services/retirement` (TaxEngine/Policy/Projection, SRG/RREGOP, Robustesse, Optimizers, Reportsâ€¦).

Guides dâ€™import (recommandÃ©s)
- UI â†’ Domaine (contrat/type): `import type { IRetirementDomain } from '@/domain/retirement'`
- UI â†’ Services (impl existantes): privilÃ©gier les barrels pour clarifier la couche
  - `import { â€¦ } from '@/services/core'`
  - `import { Tax, SRG, RREGOP } from '@/services/retirement'` (namespaces pour Ã©viter les collisions).
- Interdits (Lint â€œfrontiÃ¨resâ€ Ã  activer):
  - Pages/Composants nâ€™importent PAS `src/workers/*` directement.
  - Services nâ€™importent PAS `src/pages/*` ou `src/components/*`.

Adoption progressive
- Aucun changement breaking: les imports `@/services/...` restent valides.
- Migration ciblÃ©e des formulaires vers FormGrid au fil des tÃ¢ches, sans touchers aux logiques.

## ðŸ—ï¸ ARCHITECTURE TECHNIQUE (RÃ‰SUMÃ‰)

Stack principal
- Frontend : React 18 + TypeScript + Vite
- Styling : Tailwind CSS + composants UI personnalisÃ©s
- Ã‰tat : React Hooks + Context API
- Routing : React Router v6
- Build : Vite + TypeScript
- DÃ©ploiement : Netlify
- SÃ©curitÃ© : Chiffrement AES-256-GCM local uniquement

Structure du projet
```
src/
â”œâ”€â”€ components/          # Composants UI rÃ©utilisables
â”‚   â”œâ”€â”€ layout/          # Navigation et mise en page
â”‚   â””â”€â”€ ui/              # Composants spÃ©cialisÃ©s
â”œâ”€â”€ pages/               # Pages principales
â”œâ”€â”€ features/            # Modules mÃ©tier par domaine
â”‚   â””â”€â”€ retirement/      # Module principal de planification
â”œâ”€â”€ services/            # Logique mÃ©tier et calculs
â”œâ”€â”€ hooks/               # Hooks React personnalisÃ©s
â”œâ”€â”€ utils/               # Fonctions utilitaires
â”œâ”€â”€ types/               # DÃ©finitions TypeScript
â””â”€â”€ styles/              # Styles globaux et thÃ¨mes
```

---

## ðŸ” CONSIDÃ‰RATIONS DE SÃ‰CURITÃ‰

RÃ¨gles strictes
- âŒ AUCUNE transmission rÃ©seau des donnÃ©es confidentielles
- âŒ AUCUN workflow n8n ou service externe
- âœ… Calculs 100 % locaux dans le navigateur
- âœ… Chiffrement des donnÃ©es sensibles
- âœ… Validation stricte des entrÃ©es utilisateur

DonnÃ©es protÃ©gÃ©es
- Revenus personnels et familiaux
- Solde bancaire et investissements
- Plan de retraite dÃ©taillÃ©
- Informations mÃ©dicales et d'urgence
- Calculs de prestations gouvernementales

### Module Planification dâ€™Urgence â€” Export/Import chiffrÃ©s (.mpru)
- 100 % local: AUCUNE transmission rÃ©seau des donnÃ©es du module; interdiction absolue dâ€™appels externes.
- Chiffrement local:
  - Stockage: secureStorage (AESâ€‘GCM) pour la persistance sur lâ€™appareil.
  - Fichiers: WebCrypto AESâ€‘256â€‘GCM + PBKDF2â€‘SHA256 (â‰¥200 000 itÃ©rations), IV 96 bits, salt 128 bits.
- Export (.mpru):
  - PrÃ©requis: session dÃ©verrouillÃ©e (phrase secrÃ¨te).
  - Lâ€™utilisateur choisit le nom et lâ€™emplacement via la boÃ®te de dialogue systÃ¨me (clÃ© USB, dossier chiffrÃ©, etc.).
  - Format: enveloppe JSON (version, alg, kdf, iv, ciphertext base64, createdAt, schemaVersion). Aucune donnÃ©e en clair.
- Import (.mpru / .json legacy):
  - PrÃ©requis: session dÃ©verrouillÃ©e pour .mpru (nÃ©cessite la phrase secrÃ¨te).
  - PrÃ©visualisation (mpru): date du fichier, version de schÃ©ma, taille; confirmation obligatoire avant chargement.
  - JSON non chiffrÃ© (legacy): affichage dâ€™un avertissement, import puis chiffrement local immÃ©diat.
- Migration automatique:
  - Si une clÃ© localStorage non chiffrÃ©e 'emergency-planning-data' existe, migrer vers secureStorage puis supprimer lâ€™ancienne valeur.
- CSP (production):
  - public/_headers: Content-Security-Policy stricte sur routes dâ€™urgence (/planification-urgence*, /fr/planification-urgence*, /en/emergency-planning*, /PlanificationUrgence*).
- Checklist QA (Ã  exÃ©cuter avant clÃ´ture):
  - [ ] Export .mpru fonctionne; le fichier ne contient aucune donnÃ©e en clair.
  - [ ] Import .mpru fonctionne avec prÃ©visualisation; phrase secrÃ¨te requise.
  - [ ] Import JSON legacy affiche un avertissement et chiffre localement aprÃ¨s import.
  - [ ] Verrouillage manuel + auto (5 min) opÃ©rationnels; pas dâ€™exposition prolongÃ©e de secrets.
  - [ ] Aucune requÃªte rÃ©seau avec donnÃ©es utilisateur (vÃ©rifiÃ© en DevTools).
  - [ ] Enâ€‘tÃªtes CSP actifs sur les routes dâ€™urgence en production.

### Rapports PDF Urgence â€” Consignes (Phase 3)
- Objectif: produire des rapports ciblÃ©s 100 % locaux (aucun rÃ©seau) avec caviardage par dÃ©faut des identifiants sensibles.
- Audiences:
  - trusted â†’ Personne de confiance (conjoint, enfant, ami)
  - notary â†’ Notaire
  - planner â†’ Planificateur/Conseiller
  - liquidator â†’ Liquidateur
- Redaction (caviardage):
  - Par dÃ©faut, masquer les identifiants complets (ex: NAS, no. carte/compte â†’ â€¢â€¢â€¢â€¢ 1234).
  - Option â€œafficher intÃ©gralementâ€ soumise Ã  confirmation explicite (dÃ©conseillÃ©e pour partage non chiffrÃ©).
- ImplÃ©mentation:
  - Service: src/services/PDFEmergencyService.ts
    - API: generateEmergencyPDF(data, audience, { language: 'fr'|'en', showFullSensitive?: boolean })
  - UI: src/pages/PlanificationUrgence.tsx (boutons: PDF Conjoint/Enfant, PDF Notaire, PDF Planificateur, PDF Liquidateur)
- SÃ©curitÃ©:
  - GÃ©nÃ©ration locale via jsPDF; aucune requÃªte rÃ©seau.
  - Mention dâ€™avertissement: â€œDocument Ã  conserver en lieu sÃ»r. Ne pas transmettre par courriel non chiffrÃ©.â€
- Checklist QA (PDF):
  - [ ] PDF â€œtrustedâ€: identifiants caviardÃ©s par dÃ©faut (aucun numÃ©ro complet en clair).
  - [ ] Confirmation affichÃ©e avant toute gÃ©nÃ©ration avec showFullSensitive=true.
  - [ ] Aucun appel rÃ©seau durant la gÃ©nÃ©ration (contrÃ´lÃ© via DevTools â†’ Network).
  - [ ] Boutons prÃ©sents et fonctionnels; fichiers .pdf gÃ©nÃ©rÃ©s avec noms pertinents.
  - [ ] Build de production OK.

---

## ðŸŒ INTERNATIONALISATION ET NORMES OQLF

Support linguistique
- FranÃ§ais (par dÃ©faut, normes OQLF strictes)
- Anglais (support complet)
- Hooks : useLanguage pour la dÃ©tection
- Routes : prÃ©fixes /fr/ et /en/
- Composants : props language

RÃ¨gles OQLF strictes (exemples)
- Montants dâ€™argent (affichage) : Â« 1 234,56 $ Â» (espaces, virgule dÃ©cimale, espace avant $)
- Format horaire (QuÃ©bec) : Â« 13 h 5 Â», Â« 9 h 30 Â», Â« 0 h 15 Â»
- Majuscules : ne pas capitaliser les mots communs dans les titres en franÃ§ais

---

## ðŸ‘¥ ACCESSIBILITÃ‰ SENIORS (55-90 ANS)

Standards obligatoires
- Police min. 18 px
- Zones cliquables min. 48 px (56 px recommandÃ©)
- Contraste Ã©levÃ© (modals/formulaires fond blanc pur)
- Espacement gÃ©nÃ©reux
- Messages bienveillants (niveau 6e annÃ©e)

Palette seniors (variables CSS)
```
--senior-primary: #4c6ef5
--senior-success: #51cf66
--senior-warning: #ffd43b
--senior-error: #ff6b6b
--senior-text-primary: #1a365d
--senior-bg-primary: #ffffff
```

---

## ðŸ“Š OPTIMISATIONS PERFORMANCE

- Code splitting avancÃ© (chunks spÃ©cialisÃ©s par domaine)
- Seuil dâ€™avertissement : 500 kB par chunk
- Lazy loading des composants lourds
- Cache intelligent pour calculs frÃ©quents
- Monitoring (mÃ©triques, tests rÃ©gression performance)

---

## ðŸ§­ MODULE RETRAITE â€” ARCHITECTURE DÃ‰TAILLÃ‰E (fusionnÃ©e depuis src/features/retirement/AGENTS.md)

Vue dâ€™ensemble
Le Module de Retraite est le cÅ“ur de MonPlanRetraite.ca, gÃ©rant les calculs de prestations gouvernementales (RRQ/CPP, OAS/SV, SRG), lâ€™optimisation fiscale, les stratÃ©gies de retrait et les analyses avancÃ©es (simulation Monte Carlo, sensibilitÃ©), ainsi que la gÃ©nÃ©ration de rapports.

Structure des dossiers
```
src/features/retirement/
â”œâ”€â”€ components/          # Composants React du module
â”‚   â”œâ”€â”€ ultimate/        # Planification avancÃ©e
â”‚   â”œâ”€â”€ emergency/       # Planification d'urgence
â”‚   â””â”€â”€ reports/         # GÃ©nÃ©ration de rapports
â”œâ”€â”€ hooks/               # Hooks personnalisÃ©s du module
â”œâ”€â”€ services/            # Services mÃ©tier et calculs
â”œâ”€â”€ types/               # Types TypeScript spÃ©cifiques
â””â”€â”€ utils/               # Utilitaires et formateurs
```

Composants principaux (exemples)
- RetirementApp.tsx : conteneur principal
- Phase2Wrapper.tsx : wrapper thÃ¨me/particules
- OASGISAnalysis.tsx : analyse OAS/GIS
- AdvancedRRQAnalysis.tsx : RRQ/CPP avancÃ©
- MonteCarloSimulator.tsx : simulation Monte Carlo
- WizardPage.tsx : Rapports â€” bouton "Exporter (optimisation)" (export rÃ©sumÃ© robuste)

Services mÃ©tier (exemples)
- CalculationService (src/features/retirement/services/CalculationService.ts)
  - calculateAll(), calculateRRQ(), calculateOAS(), â€¦
- SRGService (src/services/SRGService.ts)
  - calculateSRGAnalysis(), evaluateSRGPriority(), generateOptimizations()
- EnhancedRRQService (src/features/retirement/services/EnhancedRRQService.ts)

Types et interfaces (extraits)
```typescript
interface PersonalData {
  naissance1: string;
  naissance2?: string;
  salaire1: number;
  salaire2?: number;
  // ...
}

interface RetirementData {
  rrq: RRQData;
  oas: OASData;
  srg?: SRGData;
  // ...
}

interface CalculationResult {
  monthly: number;
  annual: number;
  breakdown: Record<string, number>;
}
```

Extensions SRG (extraits)
```typescript
interface SRGCalculationResult {
  eligible: boolean;
  montantMensuel: number;
  montantAnnuel: number;
  optimisations: SRGOptimization[];
}

interface SRGOptimization {
  type: 'REDUCTION_REVENU' | 'CHANGEMENT_STATUT' | 'TIMING_DEMANDE';
  impactPotentiel: number;
  difficulte: 'FACILE' | 'MOYENNE' | 'DIFFICILE';
}
```

Algorithmes (exemples)
- RRQ/CPP (formule de base, optimisation contributions)
- SRG (Ã©ligibilitÃ©, calcul montant net aprÃ¨s rÃ©duction)
- Monte Carlo (worker mcWorker, params: iterations, horizon, volatilitÃ©, taux de rendement)

Internationalisation
- useLanguage, commutation FR/EN, objets de traduction de composants

Optimisations mobiles
- useMobileDetection, useMobileReflowFix, responsive mobile-first, breakpoints Tailwind, navigation simplifiÃ©e

SÃ©curitÃ© et confidentialitÃ©
- Calcul 100 % local, chiffrement, validation, isolation (aucune fuite de donnÃ©es), audit dâ€™actions sensibles

Tests et validation
- Type-check, build Vite, lint
- Tests dâ€™intÃ©gration (exports/imports, cohÃ©rence types)
- Tests sÃ©curitÃ© (aucune transmission de donnÃ©es)

Workflow de dÃ©veloppement
1) Analyse besoins (prestations et contexte)
2) ImplÃ©mentation (types, services, composants, tests)
3) IntÃ©gration (exports/imports, compilation)
4) Validation (TS, Vite, lint)

Bonnes pratiques
- LisibilitÃ©, rÃ©utilisabilitÃ©, performance (memo/useMemo/useCallback)
- AccessibilitÃ© (lecteurs dâ€™Ã©cran), sÃ©paration des responsabilitÃ©s
- Gestion dâ€™Ã©tat (local vs global), routing clair

Ressources
- RÃ©fÃ©rences officielles (React, TS, Tailwind, Vite)
- Prestations gouvernementales (SRG, RRQ/CPP, OAS)

---

## ðŸ’° MODULE BUDGET â€” NOTES Dâ€™ARCHITECTURE (ajout Septembre 2025)

Fonctions clÃ©s (nouveautÃ©s)
- Vue annuelle + export CSV des agrÃ©gats par catÃ©gorie
- Valeur nette : actifs/passifs, instantanÃ©s (snapshots) mensuels
- Rappels (NotificationSchedulerService)
  - Objectifs planifiÃ©s (Sinking Funds) : 90/60/30 jours
  - Fin de mois : J-7 et J-1 (rÃ©vision/sauvegarde du budget)
- Gamification + objectifs SMART (mini UI)
  - Points et activitÃ©s: budget_created, savings_updated, goal_created
  - SuccÃ¨s Â« emergency-fund-complete Â» si cible de mois dâ€™urgence atteinte
- Persistance
  - personal.netWorth, personal.netWorthSnapshots, personal.smartGoals
  - personal.budgetIncomeHistory (YYYY-MM â†’ montant)

Impacts techniques
- Sauvegarde: EnhancedSaveManager.saveDirectly(userData)
- Respect OQLF pour lâ€™affichage monÃ©taire (formatters dÃ©diÃ©s)
- AccessibilitÃ© seniors (min 18 px, zones 48 px, contrastes Ã©levÃ©s)

---

## ðŸ§­ GUIDES & QA (2025â€‘09)
- Style guide architecture: `src/docs/ARCHITECTURE_STYLE_GUIDE.md` (UI/OQLF, frontiÃ¨res, persistance)
- Scripts (advisory):
  - `npm run lint:boundaries` â€” frontiÃ¨res UI/services/routes/workers
  - `npm run lint:mpr` â€” conformitÃ© `.mpr-form/.mpr-form-row/.mpr-field` (ou `FormGrid`)
  - `npm run deps:check` â€” cycles + imports transverses interdits (si outils prÃ©sents)
  - `npm run deps:graph` â€” export JSON `.deps-graph.json` (dependency-cruiser si dispo)
- Labs: `src/routes/labsRoutes.tsx` (guardÃ©es par `VITE_ENABLE_LABS`; false en prod)
- Tests prioritaires: `BackgroundBackupService` (confidentialitÃ©), `secureStorage` (AESâ€‘GCM)

## ï¿½ RESSOURCES ET RÃ‰FÃ‰RENCES

Documentation officielle
- React 18, TypeScript, Tailwind CSS, Vite

Prestations gouvernementales canadiennes
- SRG (GIS), RRQ/CPP, OAS (SV)

---

## ï¿½ðŸ”„ HISTORIQUE DES MISES Ã€ JOUR MAJEURES

âœ… Septembre 2025 â€” Module Budget
- Vue annuelle + CSV, Valeur nette (snapshots), Rappels 90/60/30 et fin de mois, SMART + Gamification

âœ… Septembre 2025 â€” AccessibilitÃ© Seniors
- Activation globale du mode seniors
- Navigation simplifiÃ©e pour clientÃ¨le 55-90 ans
- Styles seniors (18 px, zones 48 px+)

âœ… Septembre 2025 â€” Optimisations performance
- Code splitting avancÃ©, lazy loading, cache intelligent
- AmÃ©lioration des temps de chargement

âœ… AoÃ»t 2025 â€” Module HypothÃ¨ses de Calcul
- Normes IPF 2025, CPM2014, interface Ã©ducative

âœ… Septembre 2025 â€” Phases 3â€“4 (Wizard RÃ©sultats, Rapports PDF pro, Rappels, Buckets)
- Ã‰tape RÃ©sultats du Wizard (/wizard/plan), TaxOptimizationService (ordre retraits + horaire), NotificationSchedulerService (90/60/30, fin de mois, FERR), PDFExportService (Banquier/Planificateur/Notaire), Buckets (coussin opÃ©rationnel en mois, horizon court terme en annÃ©es)

## âœ… Mises Ã  jour Septembre 2025 â€” Optimisation fiscale v1â†’v3, Sauvegarde locale, PortÃ©e Immobilier

Ce qui a Ã©tÃ© livrÃ© (100% local, aucun rÃ©seau)
- Optimisation fiscale (v1â†’v3)
  - v1: Politique + moteur fiscal (QC+Fed 2025) et projection multiâ€‘annÃ©es
    - src/services/tax/TaxPolicy2025.ts
    - src/services/tax/TaxEngine.ts
    - src/services/tax/ProjectionEngine.ts
  - v2: Optimiseur DP/Beam (+ LocalSearch v2.1), Web Worker, progression/annulation
    - src/services/tax/optimizers/DPBeamOptimizer.ts
    - src/workers/dpBeamWorker.ts
    - Score = impÃ´ts + pÃ©nalitÃ© dâ€™Ã©cart au revenu cible; faisceau configurable (beamWidth, stepSize).
  - v3: Robustification + PDF pro
    - src/services/tax/RobustnessService.ts (chocs: sÃ©quence â€‘30/â€‘15, inflation haute, longÃ©vitÃ© +5 ans; score robuste + explications)
    - src/services/tax/TaxOptimizationPDFService.ts (rÃ©sumÃ© PDF robuste)
  - UI (Lab optimisation fiscale):
    - src/components/ui/TaxOptimizationLab.tsx
    - Greedy vs RRSPâ€‘only vs DP/Beam, heatmaps (MTR/SV/SRG), rÃ©glages avancÃ©s (beamWidth/stepSize/poids/ratio CG), progression Worker + stop, Mode robuste (scores/explications), Export PDF.

- Sauvegarde locale chiffrÃ©e (sous contrÃ´le utilisateur)
  - src/services/BackgroundBackupService.ts
    - File System Access API (Edge/Chrome), liaison Primary/Secondary (pointeurs IDB), chiffrement AESâ€‘256â€‘GCM (enveloppe), autoâ€‘backup pÃ©riodique, option â€œvider local aprÃ¨s sauvegardeâ€, restauration proposÃ©e au dÃ©marrage.
  - UI
    - src/components/backup/BackupManagerPanel.tsx (mot de passe de session, liaison fichiers, frÃ©quence, clearâ€‘afterâ€‘backup, backup Now, restore, avertissement sauvegarde secondaire)
    - src/components/backup/BackupBootstrap.tsx (init + proposition de restauration)

- Politique de portÃ©e â€” Immobilier (hors pÃ©rimÃ¨tre)
  - Comparaison de propriÃ©tÃ©s: non poursuivie (Ã©cosystÃ¨me saturÃ©; Ã©viter la redondance)
  - Calculateur hypothÃ©caire avancÃ©: non poursuivi (spÃ©cialistes bancaires)
  - Analyse de rentabilitÃ© immobiliÃ¨re: non poursuivie (Ã©valuateurs/analystes dÃ©diÃ©s)
  - Impact: conserver la â€œSource de vÃ©ritÃ© Immobilier â†’ DÃ©penses/Budget (Phase 1)â€ (verrouillage hypothÃ¨que/taxes/assurance habitation), mais ne pas ajouter de comparateur/calculateur/moteur propriÃ©taire.

Checklists (Ã  appliquer pour futures Ã©volutions fiscales)
- [ ] Tests rapides Greedy/DP sur 3 profils (faibles revenus SRG, revenu moyen, haut revenu)
- [ ] Mode robuste activÃ© â†’ scores attendus cohÃ©rents (+ explications lisibles)
- [ ] Export PDF â€œrÃ©sumÃ© robusteâ€ fonctionnel (local, sans rÃ©seau)
- [ ] Worker DP: progression et cancel opÃ©rationnels; aucun blocage UI
- [ ] Sauvegarde locale: backup Now, autoâ€‘backup pÃ©riodique, clearâ€‘afterâ€‘backup, restore au dÃ©marrage

Documentation mise Ã  jour : Septembre 2025
Prochaine rÃ©vision : Mars 2026
Responsable : MonPlanRetraite.ca



