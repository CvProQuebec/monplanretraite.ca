# Architecture - MonPlanRetraite.ca

## 🏗️ Vue d'ensemble

MonPlanRetraite.ca est une application web React/TypeScript de planification de retraite optimisée pour les seniors canadiens. L'architecture est conçue pour être robuste, extensible et accessible.

## 🔄 Mises à jour architecture (2025‑09 — Itérations A→G)

Résumé des travaux structurels livrés sans modification des calculs ni des résultats.

- Itération A — Routage modulairisé + LocalizedRoute
  - Extraction des routes de `App.tsx` vers des modules dédiés: `blogRoutes`, `mainRoutes`, `mainRoutesCore`, `governmentRoutes`, `reportsRoutes`, `marketingRoutes`, `retirementRoutes`, `marketingExtrasRoutes`.
  - Introduction de `src/routes/LocalizedRoute.tsx` pour déclarer simplement des routes FR/EN:
    - Modes supportés: `component`, `componentFr/componentEn`, `element`, `elementFr/elementEn`.
  - Tests “smoke” SSR pour valider l’insertion des fragments de routes dans `<Routes />`: `src/routes/__tests__/routes-smoke.test.tsx`.

- Itération B — Frontières UI ↔ Services + Façade domaine
  - Nouveau `src/domain/retirement/RetirementDomainAdapter.ts` (contrat `IRetirementDomain` + `RetirementHelpers`).
  - Migration de 2 écrans clés pour consommer la façade:
    - `src/pages/ResultsWizardStep.tsx` → `RetirementHelpers.suggestWithdrawalOrder/buildMonthlySchedule/generateTaxOptimizationSummary`.
    - `src/components/ui/TaxOptimizationLab.tsx` → `RetirementHelpers.greedyOptimize/simulateYears/computeTaxYear/evaluateRobustness/...`.
  - Lint “frontières” UI → services/tax/* (ESLint `no-restricted-imports`) dans `.eslint-boundaries.cjs` (+ ignore `dist/`, `node_modules/`, `public/`).
  - Compat tests: `src/config/flags.ts` rendu compatible Vite/Jest/Node (sans accès direct à `import.meta` dans Jest).

- Itération C — Structuration des services (barrels thématiques)
  - Ajout de points d’entrée non-intrusifs:
    - Core: `src/services/core/persistence.ts` (persistance/sauvegarde) et `src/services/core/engagement.ts` (engagement, prévention, promo/upgrade).
    - Budget: `src/services/budget/index.ts` (Budget, Income, Payroll).
    - Notifications: `src/services/notifications/index.ts` (planification locale).
    - Security: `src/services/security/index.ts` (PDF urgence, stockage sécurisé).
  - Objectif: imports plus clairs par thème/domaine, sans déplacer le code existant.

- Itération D — Routes marketing & placeholders (activation via flags)
  - Remplacement des `<Route element={<div…} />` ad hoc par `src/pages/placeholder/PlaceholderInfoPage.tsx` (gabarit compact senior-friendly).
  - `src/routes/marketingExtrasRoutes.tsx` lit `SHOW_PLACEHOLDERS` via `useFlags()` pour activer/masquer les routes “à venir”.
  - Nouveau hook `src/hooks/useFlags.ts`, basé sur `src/config/flags.ts` (résolution Vite/Node/Jest).

- Itération F — Services seniors découplés & types partagés
  - Extraction des types UI → services dans `src/types/services.ts` (notifiers, navigation predictions, performance handlers, logging des tests modules).
  - `SeniorsOptimizationService` expose uniquement des fonctions pures (préload configurable, monitoring injectable, options reporter) sans logique d’affichage; configuration via `SeniorsOptimizationInitializeConfig`.
  - `ModuleTestService` renvoie désormais `ModuleTestResult`/`PageTestResult` (logs structurés, callbacks optionnels) pour que les hooks/pages gèrent les toasts ou UI.
  - Mise à jour `src/types/index.ts` pour ré-exporter les nouveaux types (consommation uniforme dans UI/hooks).

- Itération G — Sous-modules retraite (optimization/analysis/dashboards)
  - Création des dossiers `features/retirement/components/optimization`, `analysis`, `dashboards` + premiers déplacements (`MonteCarloSimulator` déplacé vers `optimization`).
  - Objectif: réduire la densité du répertoire racine en regroupant les composants par usage (laboratoire d’optimisation, analyses ciblées, tableaux de bord).
  - TODO suiveurs: mettre à jour le barrel `features/retirement/components/index.ts` au fur et à mesure des déplacements, adapter les imports (alias `@/features/retirement/components/...`).

Recommandations d’usage (imports conseillés)
- UI → Domaine (façade): `import { RetirementHelpers } from '@/domain/retirement/RetirementDomainAdapter'`
- UI → Services par thème:
  - Persistance: `import { EnhancedSaveManager } from '@/services/core/persistence'`
  - Engagement: `import { GamificationService } from '@/services/core/engagement'`
  - Budget: `import { BudgetComputationService } from '@/services/budget'`
  - Notifications: `import { NotificationSchedulerService } from '@/services/notifications'`
  - Sécurité: `import { PDFEmergencyService } from '@/services/security'`
- Flags: `import { useFlags } from '@/hooks/useFlags'` puis `const { SHOW_PLACEHOLDERS } = useFlags()`.

Definition of Done (architecture — continu)
- [ ] Nouvelles routes: FR/EN via `LocalizedRoute` si possible; fichiers dédiés sous `src/routes/*`; `App.tsx` ne contient que l’assemblage des fragments.
- [ ] UI n’importe pas directement `@/services/tax/*` (lint “frontières”).
- [ ] Préférer les barrels thématiques pour clarifier la couche Services.
- [ ] Placeholders marketing: composants sous `src/pages/placeholder/*`, activation via flags centralisés (aucun JSX inline dans `App.tsx`).

### CI — Matérialisation des frontières (script unifié)
- Script: `npm run ci:verify`
  - Étapes: `typecheck` → `lint:boundaries` (UI↔services/tax) → `lint:mpr` (FormGrid/.mpr-field) → `deps:check` (cycles/imports transverses) → `test:routes` (smoke)
- Adoption: exécuter en PR et en main avant déploiement.
- Cible: prévenir le couplage transversal, garantir l’uniformisation des formulaires et la stabilité du routage.

### Façade Retraite — Usage recommandé (UI → Domaine)
- Point d’entrée UI: `import { RetirementHelpers } from '@/domain/retirement/RetirementDomainAdapter'`
- API UI typiques:
  - `suggestWithdrawalOrder(userData, options?)`
  - `buildMonthlySchedule(scenarioId, monthlyNetNeed, order)`
  - `generateTaxOptimizationSummary(payload)`
  - `greedyOptimize(params)`, `simulateYears(opening, assumptions, decisions, horizonYears)`
  - `computeTaxYear(input)`, `evaluateRobustness(plan, 'fr'|'en')`
- Règle: la UI n’importe pas `@/services/tax/*` directement (voir lint frontières).

### Préparation sous-modules features/retirement/components (si croissance)
- Critères de scission (indicateurs):
  - Fichiers >200–300 lignes ou responsabilités multiples dans un même dossier.
  - Mélange “optimisation” / “analyse” / “tableaux de bord” dans le même répertoire.
- Plan de découpage:
  - `features/retirement/components/optimization/` (lab, contrôles d’optimisation, heatmaps)
  - `features/retirement/components/analysis/` (analyses SRG, RRQ/CPP, OAS/SV)
  - `features/retirement/components/dashboards/` (synthèses, KPI, cartes résumé)
- Definition of Done (refactor composants):
  - [ ] Aucune logique de calcul modifiée; import Helpers/Services inchangé
  - [ ] Regroupement cohérent par domaine; chemins d’import mis à jour
  - [ ] Tests smoke/routes/TS passent

### DoD transversal (OQLF & Accessibilité)
- OQLF:
  - FR: seule la première majuscule dans les titres; espace avant : % $ ; aucune espace avant ; ! ? ; éviter les anglicismes
  - Formats: nombres FR (1 234,56 $), heures “13 h 05”
- Accessibilité seniors:
  - Police ≥18 px; zones cliquables ≥48–56 px; focus visible; contraste élevé
  - FormGrid: 1 ligne = 1 label + 1 champ; label nowrap + ellipsis; mobile = `minmax(120px,45%) 1fr`

## 💼 Offre et paliers (2025‑09)

Mise à jour de l’offre de service et des “caps” techniques, alignée avec une audience 50–90 ans (support minimal, plans annuels, promos saisonnières).

- Gratuit
  - 5 simulations/mois, 1 rapport, 1 scénario sauvegardé
  - Monte Carlo désactivé, aucun export
  - Module d’urgence (8 sections), Budget/Dépenses basiques, IA prévention
- Professionnel (Pro)
  - 50 simulations/mois, 30 rapports PDF “résumé” (filigrane), 20 scénarios
  - Monte Carlo 100 itérations (aperçu), comparaisons 3 scénarios
  - CSV désactivé (exports avancés réservés à Expert)
  - RRQ/CPP/OAS/GIS complets, modules consolidation/cash wedge/tax‑edu, etc.
- Expert
  - Simulations, scénarios, rapports illimités
  - Monte Carlo 2000 itérations, comparaisons 10 scénarios
  - Exports PDF niveau consultant (sans filigrane) + CSV
  - Analyses de sensibilité/stress tests, IA prédictive, optimisation avancée

Implémentation technique
- Types étendus: src/types/subscription.ts
  - maxMonteCarloIterations, maxCompareScenarios, allowCSVExport, exportWatermark
- Plans: src/config/plans.ts
  - PLAN_CONFIG et FEATURE_CATALOG (tableau comparatif)
  - UPGRADE_PATHS (annuel uniquement), PROMO_CODES (gabarits)

## 🛡️ Disclaimers et conformité

- Outil éducatif seulement — aucun conseil financier, fiscal, juridique ou d’investissement personnalisé
- Aucune affiliation avec des institutions financières; aucun permis AMF
- Données 100 % locales (AES‑256), aucune transmission réseau
- Support auto‑assisté (FAQ, bulles d’aide); pas de support téléphonique
- Plans annuels uniquement; promotions ponctuelles (‑25 % à ‑40 %)

Ces mentions sont affichées sur l’accueil, et intégrées à la stratégie de copie produit (langage simple, seniors‑friendly).

## 🛣️ Modularisation des routes (2025‑09)

Objectif
- Réduire le “fichier Dieu” `App.tsx` en extrayant des groupes de routes thématiques.
- Clarifier les domaines et simplifier les revues de code.

Modules de routes introduits
- `src/routes/blogRoutes.tsx` → Routes Blog (accueil, article, catégories, compat).
- `src/routes/mainRoutes.tsx` → Routes d’accueil FR/EN (`/`, `/fr`, `/en`, `/accueil`, `/home`).
- `src/routes/mainRoutesCore.tsx` → Routes cœur d’app (profil, retraite, revenus, budget).
- `src/routes/governmentRoutes.tsx` → Prestations (SRG, RREGOP, RRQ/CPP, CCQ, OAS/GIS, ApplyBenefitsAge).
- `src/routes/reportsRoutes.tsx` → Rapports, Wizard, Scénarios (gestion/comparaison).

Intégration dans App.tsx
- Importer et utiliser comme fragments:
  ```tsx
  import { BlogRoutes } from '@/routes/blogRoutes';
  import { MainRoutesHome } from '@/routes/mainRoutes';
  import { MainRoutesCore } from '@/routes/mainRoutesCore';

  <Routes>
    <MainRoutesHome />
    <MainRoutesCore />
    <BlogRoutes />
    {/* autres routes spécialisées */}
  </Routes>
  ```

Placeholders marketing (flag build)
- Variable: `VITE_SHOW_PLACEHOLDERS` (string "true"/"false").
- App.tsx:
  ```ts
  const SHOW_PLACEHOLDERS = import.meta.env.VITE_SHOW_PLACEHOLDERS === 'true';
  {SHOW_PLACEHOLDERS && (<>/* routes placeholders */</>)}
  ```
- Production: définir `VITE_SHOW_PLACEHOLDERS=false` (voir `env.local.example`).

Bonnes pratiques
- Un groupe de routes ≤ 150–200 lignes (scinder au besoin: governmentRoutes, reportsRoutes, etc.).
- Rester lazily chargé pour les pages lourdes, conserver `App.tsx` comme shell (providers, layout, lazy fallback).

## 🧩 Couches & Domaines (2025‑09)

Objectif
- Rendre explicites les frontières UI ↔ Domaine ↔ Services (core/retirement) sans modifier les calculs ni la logique métier.
- Permettre une adoption progressive (façades et barrels non intrusifs).

Couches
- UI (pages, composants)
  - Conventions UI seniors (.mpr-form via FormGrid/Field): `src/components/forms/FormGrid.tsx`
  - Routes modulaires: `src/routes/*`
- Domaine (contrats/interfaces — aucune implémentation)
  - Retraite: `src/domain/retirement` (ITaxEngine, ITaxPolicy, IProjectionEngine, IRetirementCalculationService, etc.)
  - Budget: `src/domain/budget` (IBudgetService, INetWorthService, INotificationService, etc.)
- Services (implémentations existantes, non déplacées)
  - Core (barrel): `src/services/core` (persistance, sauvegarde, notifications, PDF, cache…)
  - Retirement (barrel namespaced): `src/services/retirement` (TaxEngine/Policy/Projection, SRG/RREGOP, Robustness, Optimizers, Reports…)

Guides d’import
- UI → Domaine (contrat): importer les interfaces depuis `src/domain/*` pour typer les props/facades.
- UI → Services (impl existantes): privilégier les barrels
  - `import { … } from '@/services/core'`
  - `import { Tax, SRG, RREGOP } from '@/services/retirement'` (namespaces pour éviter collisions).
- Interdits (lint “frontières”):
  - Pages/Composants n’importent pas `src/workers/*` directement.
  - Services n’importent pas `src/pages/*` ou `src/components/*`.

Adoption progressive
- Aucune migration forcée. Les imports actuels via `@/services/…` restent valides.
- Nouvelle UI des formulaires: utiliser FormGrid/FormRow/Field pour l’uniformisation “1 ligne = 1 label + 1 champ” sans changer la logique.

Lint de frontières (recommandé)
- Ajouter une règle ESLint `import/no-restricted-paths` (voir AGENTS.md) pour empêcher les dépendances inverses.

## 🧪 Labs & Scripts QA (consolidation démos)

- Routes Labs: `src/routes/labsRoutes.tsx` guardées par `VITE_ENABLE_LABS` (false en prod), chemins `/labs/*` (lazy, exclus du bundle principal).
- Scripts de vérification (advisory):
  - `npm run lint:mpr` → vérifie l’usage `.mpr-form`/`.mpr-form-row`/`.mpr-field` (ou `FormGrid`/`FormRow`/`Field`) pour prévenir les régressions UI/accessibilité seniors.
  - `npm run deps:check` → cycles (si dependency-cruiser/madge présents) + imports transverses interdits (UI→workers, services→UI, routes→services/workers).
- Environnement:
  - `VITE_ENABLE_LABS=false` en production; à activer en local si nécessaire.

## 🧰 Page Outils — Catalogue par plan (2025‑09)

- Objectif: remplace le sous‑menu “Outils” par une page dédiée affichant 27 outils sous forme de cartes, regroupés par plan (Gratuit, Pro, Expert) avec codes couleur.
- Fichiers:
  - Page: `src/pages/AllToolsPage.tsx` (grilles par plan, acces FR/EN via `/outils` et `/tools`)
  - Carte: `src/components/ui/ToolCard.tsx` (CTA “Ouvrir l’outil” / “Mettre à niveau” selon plan)
  - Source unique: `src/config/tools-catalog.ts` (27 entrées — id, routes FR/EN, plan, titres FR/EN, descriptions FR/EN)
  - Styles: `senior-unified-styles.css` (classes `.plan-free`, `.plan-pro`, `.plan-expert`, `.badge`)
- Navigation:
  - `src/components/layout/header/UniformHeader.tsx` → remplace le sous‑menu “Outils” par un lien direct vers `/outils` (FR) et `/tools` (EN).
- Règles UI/OQLF:
  - Seniors: zones cliquables ≥ 48–56 px, police ≥ 18 px, focus visible, contrastes élevés.
  - OQLF: titres FR avec seule la première majuscule; aucune espace avant ; ! ? ; espace avant : % $; aucun anglicisme.
  - i18n: libellés FR/EN via `useLanguage`, champs `titleFr/titleEn/descFr/descEn`.
- DoD:
  - [ ] Accessibilité clavier/ARIA
  - [ ] Performances (lazy, chunk Tools ≤ 500 kB)
  - [ ] Conformité OQLF (voir “2025‑09‑23 Guide Architecture et uniformisation.md”)

## 📰 Blog — Navigation bilingue

- Chaque article dispose de `relatedSlugFr`/`relatedSlugEn` pour assurer la navigation FR↔EN
- Le parseur de billets (src/pages/blog/utils/content.ts) est robuste aux front‑matters variés:
  - Coercition des types (tags string/array, keyPoints string/array)
  - Normalisation de catégories (labels FR canoniques)
  - Protection contre les erreurs (ex.: `fixPunctuation` tolérant)
- L’accueil et la page d’article utilisent ces slugs reliés pour proposer la version dans l’autre langue

## 📁 Structure du projet

```
src/
├── components/             # Composants UI réutilisables
│   ├── layout/            # Navigation et mise en page
│   └── ui/                # Composants spécialisés
├── pages/                 # Pages principales
├── features/              # Modules métier par domaine
│   └── retirement/        # Module principal de planification
├── services/              # Logique métier et calculs
├── hooks/                 # Hooks React personnalisés
├── utils/                 # Fonctions utilitaires
├── types/                 # Définitions TypeScript
└── styles/                # Styles globaux et thèmes
```

## 🗂️ Architecture des données

### Interface UserData (Structure principale)

```typescript
interface UserData {
  personal: PersonalData      // Infos personnelles + revenus
  retirement: RetirementData  // Prestations gouvernementales
  savings: SavingsData        // Épargne et investissements
  cashflow: CashflowData      // Dépenses et budget
}
```

#### PersonalData
- Personnes : Informations pour 2 personnes (couples)
- Revenus unifiés : `unifiedIncome1[]` et `unifiedIncome2[]`
- Investissements : REER, CELI, CRI avec dates
- Statuts : Actif, retraité, sans emploi

#### RetirementData
- RRQ/CPP : Montants actuels et projections à 70 ans
- Sécurité de la vieillesse : Gestion biannuelle (`svBiannual1/2`)
- Pensions privées : Rentes d'employeurs et viagères
- Régimes spécialisés : RREGOP, CCQ, etc.

## 🎛️ Interface Utilisateur - Sommaires

### Structure des Sommaires
- Sommaire individuel : Calculs par personne (Personne 1, Personne 2)
- Sommaire familial : Agrégation temps réel des deux personnes

### Logique d'agrégation
- Addition automatique des revenus des deux conjoints
- Synchronisation immédiate lors des modifications
- Affichage dans `GlobalSummary.tsx`

## 💰 Architecture des revenus (Système unifié)

### Types de revenus supportés

```typescript
type IncomeType = 
  | 'salaire'
  | 'emploi-saisonnier'
  | 'rentes'
  | 'assurance-emploi'
  | 'dividendes'
  | 'revenus-location'
  | 'travail-autonome'
  | 'autres';
```

### Interface IncomeEntry
Chaque revenu contient des propriétés spécialisées :

Commune à tous :
- `id`, `type`, `description`, `isActive`
- `annualAmount`, `monthlyAmount`, `toDateAmount`

Spécifiques par type :
- Salaire : `salaryNetAmount`, `salaryFrequency`, dates début/fin
- Revenus location : `rentalAmount`, `rentalFrequency` (weekend/weekly/monthly)
- Assurance emploi : `weeklyNet`, `eiEligibleWeeks`
- Rentes : `pensionAmount`, `pensionFrequency`, `survivorBenefit`

## 🧮 Composants de calcul principaux

### 1. GlobalSummary.tsx
Rôle : Agrégation de tous les revenus et calcul des totaux familiaux

```typescript
function calculateToDateAmount(entry: IncomeEntry) {
  switch (entry.type) {
    case 'salaire':
    case 'emploi-saisonnier':
      // Basé sur la fréquence et les dates
      break;
    case 'revenus-location':
      // weekend (~4.33/mois), weekly, monthly
      break;
    case 'rentes':
      // Projections mensuelles depuis la date de début
      break;
  }
}
```

### 2. SeniorsFriendlyIncomeTable.tsx
Rôle : Interface de saisie adaptée aux seniors
- Grandes polices (text-xl, text-2xl)
- Contrastes élevés (border-4)
- Édition en ligne
- Validation en temps réel

### 3. Services de calcul
- CalculationService : Calculs de base (capital, suffisance)
- EnhancedRRQService : Optimisations RRQ/CPP
- MonteCarloService : Simulations probabilistes
- TaxOptimizationService : Stratégies fiscales 2025

## 🔄 Flux de données

### Pattern de gestion d'état
```
useRetirementData (Hook central)
├── localStorage/sessionStorage (Persistance)
├── ValidationService (Nettoyage)
├── CalculationService (Calculs automatiques)
└── Components (Affichage et édition)
```

### Flux des revenus
1. Saisie : `SeniorsFriendlyIncomeTable`
2. Stockage : `updateUserData`
3. Calculs : `GlobalSummary` agrège
4. Affichage : Résultats temps réel dans "Résumé familial"

## 🎯 Patterns architecturaux

### 1. Composants seniors-friendly
```typescript
// Interface adaptée
className="text-xl border-4 border-gray-300 p-4"

// Navigation simplifiée
<AdaptiveHeader />   // 4 blocs principaux
<SeniorsNavigation />
```

### 2. Calculs "à ce jour"
- Emplois saisonniers : mois travaillés réels
- Salaires : fréquence de paie + dates
- Prestations : projections depuis début
- Fuseaux horaires : `new Date(year, month - 1, day)` (local)

### 3. Persistance robuste
- Triple sauvegarde : Session + Local + Fichiers
- Migration automatique
- Fallbacks multiples

## 🌐 Spécificités canadiennes

- Standards IPF 2025 (Inflation ~2,1%)
- Rendements (3,4% à 8,0% selon classes)
- Mortalité : tables CPM2014
- RRQ/CPP, SV/SRG : tables officielles
- AE : hebdomadaire, limites provinciales

## 🔧 Points techniques importants

### 🚨 RÈGLE CRITIQUE - FORMATAGE OQLF
NE JAMAIS remplacer les guillemets droits " par des chevrons « » dans le code.

Exemple correct :
```typescript
const message = "Prix : 119,99 $";
const className = "senior-btn senior-btn-primary";
```

### Menus déroulants (positionnement)
Problème : `position="popper"` incorrect
Solution standardisée :
```typescript
<SelectContent 
  position="item-aligned"
  side="bottom"
  avoidCollisions={true}
  sideOffset={4}
  style={{ zIndex: 9999 }}
  className="min-w-full"
/>
```

### Dates et fuseaux horaires
Éviter `new Date('YYYY-MM-DD')` (UTC). Préférer parsing manuel :
```typescript
const [y, m, d] = dateString.split('-').map(Number);
const localDate = new Date(y, m - 1, d);
```

### Types de revenus extensibles
`rentalFrequency: 'weekend' | 'weekly' | 'monthly'`  
weekend ≈ 4.33 / mois ; weekly ≈ 4.33 / mois

## 📊 Interconnexions clés

```
Modification dans Table → useRetirementData → GlobalSummary
                                          → CalculationService
                                          → Sauvegarde auto
```

```
RRQ Service ←→ Tax Optimization ←→ Monte Carlo
     ↓              ↓                    ↓
Retirement Budget Service ←→ Cashflow Analysis
```

## 💡 Accessibilité Seniors (55-90 ans)

- Police min 18 px
- Zones cliquables min 48 px (56 px recommandé)
- Contraste élevé (modals/formulaires fond blanc)
- Espacements généreux
- Langage bienveillant (6e année)

Palette seniors (variables CSS)
```css
--senior-primary: #4c6ef5;
--senior-success: #51cf66;
--senior-warning: #ffd43b;
--senior-error: #ff6b6b;
--senior-text-primary: #1a365d;
--senior-bg-primary: #ffffff;
```

Composants seniors obligatoires
```css
.senior-layout { background: var(--senior-bg-primary); font-size: 18px; line-height: 1.6; }
.senior-btn { min-height: 48px; min-width: 140px; font-size: 18px; font-weight: 600; padding: 12px 24px; }
.senior-form-input { font-size: 18px; min-height: 48px; border: 2px solid var(--senior-border); }
```

## 📱 Optimisations Performance

- Code splitting avancé (chunks: financial-core, analytics, reports, charts)
- Alerte > 500 kB par chunk
- Lazy loading des composants lourds
- Cache intelligent

Exemple manualChunks (Vite) :
```typescript
manualChunks(id: string) {
  if (id.includes('./src/config/financial-assumptions') ||
      id.includes('./src/config/cpm2014-mortality-table')) return 'financial-core';
  if (id.includes('./src/features/retirement/services/AnalyticsService') ||
      id.includes('./src/features/retirement/services/AdvancedMonteCarloService')) return 'analytics';
  if (id.includes('date-fns')) return 'date-lib';
}
```

Services d'optimisation
- CacheService : cache par type de calcul
- SeniorsOptimizationService : préchargement intelligent
- AssetOptimization : images WebP + fallback

## ⚠️ Considérations de maintenance

Fichiers critiques
- `src/types/index.ts` : types centraux
- `useRetirementData.ts` : état principal
- `GlobalSummary.tsx` : totaux
- `CalculationService.ts` : moteur de calcul

Tests recommandés
- Calculs : précision "à ce jour"
- Dates : fuseaux horaires
- UI : menus, responsive
- Persistance : sauvegarde/récupération
- Performance : build <3s, chunks <500kB

## 🔐 Sécurité et Confidentialité

- Aucune transmission réseau des données sensibles
- Aucun workflow n8n / service externe
- Calculs 100% locaux
- Chiffrement AES-256-GCM (local)
- Validation stricte des entrées
- Dignité utilisateur (pas de stigmatisation)

### Persistance ultra‑confidentielle — Planification d’Urgence

- Export/Import chiffrés (.mpru) 100 % local via WebCrypto (AES‑256‑GCM + PBKDF2‑SHA‑256 ≥ 200 000 itérations)
- Stockage local chiffré via secureStorage (AES‑GCM), aucune donnée en clair
- Écran de déverrouillage avec phrase secrète, verrouillage manuel et automatique après inactivité (5 min)
- CSP stricte appliquée aux routes d’urgence (voir public/_headers)
- Prévisualisation à l’import (.mpru) avec métadonnées; avertissement si JSON non chiffré (legacy) puis chiffrement local après import
- Aucune transmission réseau, aucune intégration externe

## 🌍 Internationalisation

- Français par défaut (OQLF)
- Anglais complet
- Hook `useLanguage`
- Routes `/fr/` et `/en/`
- Props `language`/`isEnglish`

---

# 🧭 Module Budget — Architecture (2025-09)

Cette section documente les fonctionnalités livrées du module Budget et leurs impacts d’architecture.

## Composants principaux (Budget)
- Page : `src/pages/Budget.tsx`
- UI complémentaires (lazy) : `IncomeDeductionsForm`, `BudgetTargetsGauges`, `EmergencyFundCard`, `SinkingFundsManager`, `DebtSnowballWizard`, `ContextualTipsPanel`

## Fonctionnalités clés
- Vue annuelle + export CSV (agrégats par catégorie)
- Valeur nette : actifs/passifs, instantanés (snapshots) datés
- Rappels (90/60/30 et fin de mois) via NotificationSchedulerService
- Objectifs SMART + Gamification (points, succès)
- Synchronisation Dépenses (cashflow) → Budget (import et liens)

## Données persistées (personal)
- `personal.netWorth: { assets, liabilities }`
- `personal.netWorthSnapshots: Array<{ date, assets, liabilities, net }>`
- `personal.smartGoals: Array<{ id, title, measure, target, deadline, relevance }>`
- `personal.budgetIncomeHistory: Record<'YYYY-MM', number>` (revenu net mensuel historisé)
- `personal.budgetData`, `personal.budgetSettings`, `personal.budgetLinks` (existants)

Persistance effectuée via `updateUserData` + `EnhancedSaveManager.saveDirectly(userData)`.

## Calculs & allocations (50/30/20)
- `BudgetComputationService.computeAllocations(budgetData, netMonthlyIncome)`
- Cibles modifiables (presets 55/25/20, 50/30/20, 45/25/30)

## Notifications (Budget)
- Service : `src/services/NotificationSchedulerService.ts`
  - `scheduleSeries({ type, scenarioId, targetDate, options })`
  - `scheduleRRQ`, `scheduleSV`, `scheduleFERRConversion(userData, scenarioId)`
  - `scheduleWithdrawalNotice(scenarioId, dateISO)`
- Intégrations Budget :
  - Sinking Funds : bouton "Planifier rappels 90/60/30" (leads [90,60,30])
  - Fin de mois : bouton "Rappels fin de mois" (leads [7,1])
- Stockage : notifications planifiées en `secureStorage` par `scenarioId` (clé `scenario:${scenarioId}:notifications`)

## Gamification & SMART
- Service : `src/services/GamificationService.ts`
  - Points et activités :
    - Sauvegarde budget → `budget_created` (+20 pts)
    - Snapshot valeur nette → `savings_updated` (+10 pts)
    - Objectif SMART créé → `goal_created` (+30 pts)
  - Succès : `emergency-fund-complete` si mois d’urgence atteints
- SMART (Paramètres) :
  - Formulaire S.M.A.R.T (Specific, Measurable, Target (montant), Relevant, Time-bound)
  - Liste persistée `personal.smartGoals`

## Accessibilité & OQLF (Budget)
- Form inputs et boutons adaptés (min 18 px / 48 px)
- Formats monétaires FR : `formatCurrencyOQLF`, EN : `formatCurrencyLocale`
- Pourcentages FR : espace insécable avant `%` dans le texte affiché (via utilitaires)

## Sécurité & confidentialité
- Aucune API externe
- Données chiffrées localement (bibliothèque locale AES/GCM)
- Notifications stockées en `secureStorage`
- Journalisation gamification en localStorage (aucune donnée sensible)

---

# 🔔 Notifications — Architecture

- Planification d’échéances clefs : RRQ, SV, FERR (71 ans), préavis retraits (WITHDRAWAL_NOTICE)
- Stratégie : séries relatives à une date cible (lead days 90/60/30 par défaut)
- Canaux : `inapp` (email/SMS réservés futures évolutions)
- Clés de stockage : `scenario:${scenarioId}:notifications` (secureStorage)
- UI : boutons d’amorçage dans Budget (Sinking Funds, Paramètres/SMART), panneaux dédiés dans pages Notifications si applicable

---

# 🧩 Navigation conseillée (senior-friendly)

1) Profil (âge, statut marital, province, statut : actif/sans emploi/retraité)
2) Revenus (unifiés) → agrégation automatique du ménage
3) Investissements/biens (REER, CELI, CRI, rentes, propriétés)
4) Prestations (RRQ/SV) + âge souhaité
5) Dépenses (cashflow)
6) Budget (Vue d’ensemble, 50/30/20, Fonds d’urgence, Objectifs planifiés, Dettes, Calendrier, Valeur nette)
7) Scénarios (comparaisons et stratégies de retrait)
8) Notifications (planification 90/60/30, fin de mois, FERR)

CTA contextuels recommandés :
- Après Revenus/Prestations → "Aller au Budget"
- Flux net négatif → "Revoir Dépenses" + "Créer un objectif SMART"
- Avant dates clés (RRQ/SV/FERR) → "Planifier un rappel"

---

# 🔧 Maintenance récente (Septembre 2025)

- Budget : Vue annuelle + CSV, Net Worth (snapshots), Rappels 90/60/30 & fin de mois, SMART + Gamification
- Données ajoutées (`personal`): `netWorth`, `netWorthSnapshots`, `smartGoals`, `budgetIncomeHistory`
- Documentation fusionnée : `private-docs/architecture/AGENTS.md` (référence unique, contenu module retraite consolidé)

---

## 🔗 Phase 1 (2025‑09‑19) — Source de vérité Immobilier → Dépenses/Budget

Objectif
- Éliminer la double saisie des postes logement suivants en imposant une source unique (Immobilier) et des vues liées (Dépenses/Budget):
  - Hypothèque (mensuel)
  - Taxes municipales (annuel → mensualisé côté Cashflow)
  - Assurance habitation (annuel → mensualisé côté Cashflow)

Implémentation
- Types:
  - `SavingsData` étendu:
    - `residencePaiementHypothecaireMensuel?: number`
    - `residenceTaxesMunicipalesAnnuelles?: number`
    - `residenceAssuranceHabitationAnnuelle?: number`
    - Champs optionnels pour propriétés locatives: `locative{1..3}Valeur?`, `locative{1..3}Hypotheque?`
- Registre de champs:
  - Nouveau `src/types/fields-registry.ts`
    - `FIELDS_SOURCE` (résidence*)
    - `computeLockedHousingMonthly()` pour mensualiser taxes/assurance
    - `LOCKED_LOGEMENT_KEYS = ['hypotheque','taxesMunicipales','assuranceHabitation']`
- UI
  - `RealEstateSection.tsx`: ajout des 3 champs sources avec layout `.mpr-form` (uniformisation “1 ligne = 1 label + 1 champ”) et tooltips conformes.
  - `CashflowSection.tsx`:
    - Ventilation “Logement” verrouille les clés `hypotheque`, `taxesMunicipales`, `assuranceHabitation` (lecture seule).
    - Le total de la ventilation inclut obligatoirement ces valeurs verrouillées.
    - Le nouveau total renvoyé au parent remplace la valeur de la catégorie `logement`.
  - `SeniorsFriendlyInput.tsx`: support `disabled`/`readOnly` + correction ARIA (`aria-disabled="true"`).
- Migration de données:
  - `DataMigrationService` v1.2.0
    - Si présent: `cashflow.logementBreakdown.hypotheque` → `savings.residencePaiementHypothecaireMensuel`
    - `taxesMunicipales` (mensuel) × 12 → `savings.residenceTaxesMunicipalesAnnuelles`
    - `assuranceHabitation` (mensuel) × 12 → `savings.residenceAssuranceHabitationAnnuelle`
  - `ExpensesPage.tsx` déclenche la migration au chargement si nécessaire.
- Accessibilité & OQLF
  - Aucune modification du formatage d’affichage monétaire (utilitaires existants).
  - Layout normalisé `.mpr-*` appliqué à la section immobilisée.

Impacts sur Budget
- Phase 1: aucun changement de contrat côté `BudgetComputationService`; la valeur “Logement” est fiable car recalculée à partir de la ventilation verrouillée.
- Phase 2 (planifié): brancher directement le calcul Budget sur les champs sources (Immobilier) si nécessaire.

Definition of Done (Phase 1)
- Aucune double saisie visible pour hypothèque, taxes et assurance habitation.
- Les champs listés ci‑dessus sont éditables uniquement dans Immobilier, et reflétés automatiquement dans Dépenses.
- Migration automatique des anciennes clés si présentes (log).
- Respect des normes UI `.mpr-*` pour les champs ajoutés.

## 🚀 Phases 3 et 4 — Résumé d’implémentation (2025‑09)

### Phase 3 — Wizard Résultats, Rapports PDF Pro, Rappels
- Étape “Résultats & Plan d’action” du Wizard:
  - Ordre de retraits recommandé (heuristiques locales) + application via WizardService
  - Aperçu horaire simplifié (12 mois)
  - Rappels 90/60/30 jours + fin de mois (NotificationSchedulerService), stockage local chiffré
  - Export PDF: Résumé + Rapports professionnels (Banquier, Planificateur, Notaire)
- Services:
  - TaxOptimizationService: ordre de retraits et horaire simplifié
  - NotificationSchedulerService: séries de rappels (RRQ/SV/FERR/Retrait/Fin de mois)
  - PDFExportService: nouveaux presets generateBankerReport/PlannerReport/NotaryReport + gabarits urgence (personnes de confiance et professionnels, avec redaction par défaut)
- Routage:
  - `/wizard/plan` → ResultsWizardStep
- Données:
  - 100 % local (secureStorage AES‑GCM + fallback localStorage), aucune transmission réseau

### Phase 4 — Buckets & Résilience
- Calculs et affichage dans l’étape Résultats:
  - Coussin opérationnel: mois de besoins essentiels couverts (à partir de l’épargne liquide)
  - Horizon court terme: années couvertes par les fonds court terme (placements non enregistrés + CELI) sur base dépenses annuelles
- Rapports:
  - Rapport Banquier enrichi: intègre monthsCoveredOp et yearsCoveredShort
  - Wizard/Rapports: bouton “Exporter (optimisation)” (export résumé robuste)
- Accessibilité/OQLF:
  - Libellés FR/EN, formats conformes (1 234,56 $, 4,5 %, “13 h 5”), tailles et contrastes seniors

### Fichiers principaux impactés
- `src/pages/ResultsWizardStep.tsx` (nouvelle étape, UI et CTAs)
- `src/services/TaxOptimizationService.ts` (ordre de retraits + horaire)
- `src/services/NotificationSchedulerService.ts` (rappels locaux)
- `src/services/PDFExportService.ts` (rapports pro PDF)
- `src/pages/WizardPage.tsx` (routage ‘plan’)

### Definition of Done (Phases 3‑4)
- Ordre de retraits appliquable + aperçu horaire
- Rappels 90/60/30 + fin de mois visibles dans Notifications
- Exports PDF: Résumé + Banquier/Planificateur/Notaire
- Buckets affichés (mois/an) et utilisés par le rapport Banquier
- OQLF/Accessibilité respectés; build/type‑check OK

---

## 🧠 Optimisation fiscale — v1 → v3 (2025‑09)

Objectif
- Passer d’heuristiques robustes à un moteur d’optimisation multi‑années explicable, 100% local.

Composants techniques
- TaxPolicy2025 (QC+Fed) + TaxEngine (calcul annuel précis)
  - Barèmes 2025 (approx), crédits non remboursables (base, âge, pension), dividendes (gross‑up + crédits), inclusion CG 50 %, récupération SV, proxy SRG.
- ProjectionEngine (multi‑années)
  - Soldes (CELI/Non‑enreg./REER/FERR), retraits, CPP/SV, MTR approx, horizon configurable.
- Optimiseurs
  - v1 GreedyBaselineOptimizer: Non‑enregistré → REER (bisection net) → CELI, démarrage CPP/SV paramétrable.
  - v2 DP/Beam Optimizer (+ LocalSearch v2.1): recherche par faisceau (grilles de retraits), score = impôt + pénalités; raffinement local; Web Worker (PROGRESS/CANCEL).
- v3 RobustnessService (robustification)
  - Chocs: séquence (‑30 %/‑15 % années 1–2), inflation haute, longévité +5 ans.
  - Indicateurs: années sous objectif, années avec clawback SV, pics MTR (≥45 %); score robuste + explications “why”.
- UI — TaxOptimizationLab
  - Onglet Premium “Lab optimisation fiscale”: Greedy vs RRSP‑only vs DP/Beam, heatmaps (MTR/SV/SRG), réglages avancés (beamWidth, stepSize, poids objectif, ratio CG), progression Worker, arrêt, Mode robuste (scores + explications), Export PDF.
- Exports PDF
  - TaxOptimizationPDFService: résumé robuste (impôts totaux, scores robustes, explications).
  - Monte Carlo (worker): src/workers/mcWorker.ts (aperçu 1000+ itérations)

Garanties
- 100 % local, aucune transmission réseau, exécutions non bloquantes (Worker), accessibilité seniors, FR/EN.

---

## 🛡️ Sauvegarde locale chiffrée (BackgroundBackupService)

But
- Assurer que les données restent chez le client, sous son contrôle (USB/disque), avec sauvegardes automatiques sans conserver les données en clair côté site.

Implémentation
- Service: `src/services/BackgroundBackupService.ts`
  - File System Access API (Edge/Chrome): liaison fichiers Primary/Secondary (pointeurs conservés en IndexedDB).
  - Chiffrement AES‑256‑GCM (WebCrypto) via `fileCrypto` (enveloppe JSON).
  - Auto‑backup périodique (frequencyMin), “vider local après sauvegarde” (retirement_data supprimé; pointeurs/métadonnées conservés).
  - Propose une restauration au démarrage si aucune donnée locale.
  - Avertissement “sauvegarde secondaire” recommandé (robustesse seniors).
- UI
  - `BackupManagerPanel`: mot de passe de session, lier/délier fichiers, fréquence, clear‑after‑backup, sauvegarde immédiate, restauration, alertes.
  - `BackupBootstrap`: init + proposition de restauration.
  - Routes: `/sauvegardes`, `/backups`.

Sécurité & confidentialité
- 0 upload, 0 cloud; clés en session seulement; données chiffrées à la source; conformité seniors/OQLF.

---

## 🏠 Immobilier — Politique de portée (hors périmètre)

Décisions de périmètre (documentées)
- Comparaison de propriétés: non poursuivi (trop d’acteurs spécialisés; éviter la redondance).  
- Calculateur hypothécaire avancé: non poursuivi (écosystème bancaire déjà pourvu; choix de déléguer aux spécialistes).  
- Analyse de rentabilité immobilière: non poursuivie (champ d’expertise des évaluateurs/analystes dédiés).

Raison d’être
- Concentrer l’innovation sur la planification de retraite, l’optimisation fiscale, la robustesse et la sécurité/persistance locale.
- Éviter la duplication des fonctions où le marché est déjà bien servi et préserver de bonnes relations écosystémiques.

Impacts techniques
- Les modules/rapports existants restent en lecture/optimisation génériques (cashflow, buckets, ordres de retraits), sans comparateur immobilier dédié, ni calculateur hypothèque propriétaire, ni moteur détaillé de rentabilité.
- La Phase 1 “Source de vérité Immobilier → Dépenses/Budget” reste en vigueur (verrouillage hypothèque/taxes/assurance habitation via Immobilier).
- 2025-09-24 : pipeline QA (docs/tests.md, tests/unit, tests/e2e, tests/perf, tests/security, workflow qa-suite) active pour Vitest/Playwright/k6/ZAP.
