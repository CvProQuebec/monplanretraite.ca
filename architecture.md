# Architecture - MonPlanRetraite.ca

## 🏗️ Vue d'ensemble

MonPlanRetraite.ca est une application web React/TypeScript de planification de retraite optimisée pour les seniors canadiens. L'architecture est conçue pour être robuste, extensible et accessible.

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
