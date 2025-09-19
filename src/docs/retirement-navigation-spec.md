# Spécification fonctionnelle et technique — Navigation unifiée, outils d’analyse et séquence d’utilisation

Version: 1.0  
Auteur: Cline  
Portée: Définir la logique de navigation inter-modulaire, les contrats d’API internes (types/interfaces/événements), la séquence d’utilisation et un backlog d’implémentation pour un parcours retraité 50–90 ans.

## 1) Objectifs produit

- Guider un utilisateur (50–90 ans) à:
  - Créer un profil pertinent (âge, province, statut, conjoint).
  - Entrer revenus, actifs, prestations publiques, dépenses.
  - Voir un budget consolidé et la pérennité financière.
  - Recevoir recommandations: âge retraite, âge RRQ/SV, stratégie de retraits optimale.
  - Programmer des rappels à 90 jours (retraits, conversion FERR, âges clés).
  - Comparer des scénarios et générer un rapport.

- Exigences d’ergonomie:
  - Wizard simple, progression visible, sauvegarde auto.
  - Raccourcis par objectifs et liens profonds entre modules.
  - Accessibilité renforcée (taille police, contraste, libellés clairs).

## 2) Carte des routes et étapes du Wizard

Étapes (routes recommandées, compatibles avec vos pages actuelles):
1. Profil → /profil (ProfilePage)
2. Revenus → /revenus (Revenus.tsx)
3. Actifs/Investissements → /actifs (agrégation via services)
4. Prestations publiques → /prestations (RRQ + SV)
5. Dépenses → /depenses (ExpensesPage, PlanificationDepenses)
6. Budget & Résultats → /budget (SeniorsDashboard, MonteCarloSimulator, FourPercentRuleModule)
7. Optimisations → /optimisations (UnifiedRetirementPage, rapports d’optimisation)
8. Plan & Rapports → /plan et /rapports (PDFExportService, RapportsRetraiteFr)

Composants transversaux:
- Barre de progression et footer collant “Précédent / Suivant / Enregistrer”
- Breadcrumbs
- Badges d’état par section (Complet / À vérifier) dans SeniorsFixedNavigation / MobileNav

Garde-fous de complétude:
- Validation minimale par étape via validationMiddleware; blocage de “Suivant” si incomplet et affichage d’une checklist.
- Bouton “Continuer” sur le tableau de bord → prochaine étape incomplète (via CalculationDiagnosticService).

Liens profonds (deep-links) et CTA:
- Depuis RRQQuickCompare / RRQDelaySimulator: “Appliquer cet âge RRQ” → met à jour le profil et renvoie au Budget.
- Depuis Budget/Simulateurs: “Ajuster mes dépenses” → /depenses, “Ajuster mes retraits” → /optimisations.
- Schéma de lien: web `/prestations/apply?rrqAge=68&redirect=/budget` (voir section 6).

## 3) Modèle de données — Types/Interfaces (TypeScript)

Note: Les types ci-dessous sont conçus pour `src/types/` (référence). Ils peuvent être déplacés en modules dédiés si requis.

```ts
// src/types/wizard.ts
export type WizardStepId =
  | 'profil'
  | 'revenus'
  | 'actifs'
  | 'prestations'
  | 'depenses'
  | 'budget'
  | 'optimisations'
  | 'plan'
  | 'rapports';

export interface MissingField {
  path: string;           // ex: 'profil.birthDate'
  label: string;          // ex: 'Date de naissance'
  severity?: 'info' | 'warning' | 'error';
  help?: string;          // hint contextuel
}

export interface CompletenessStatus {
  step: WizardStepId;
  complete: boolean;
  missing: MissingField[];
}

export interface WizardProgress {
  steps: CompletenessStatus[];
  current: WizardStepId;
  nextIncomplete?: WizardStepId;
  percent: number; // 0..100
}

export interface WizardState {
  currentStep: WizardStepId;
  scenarioId: string;
  lastSavedAt?: number;
  mode: 'guide' | 'libre';
}
```

```ts
// src/types/profile.ts
export type MaritalStatus = 'single' | 'married' | 'commonLaw' | 'separated' | 'divorced' | 'widowed';
export type ProvinceCode =
  | 'QC' | 'ON' | 'BC' | 'AB' | 'MB' | 'SK' | 'NS' | 'NB' | 'NL' | 'PE' | 'NT' | 'YT' | 'NU';
export type PersonStatus = 'actif' | 'sans_emploi' | 'retraite';

export interface Profile {
  birthDate: string; // ISO date
  maritalStatus: MaritalStatus;
  province: ProvinceCode;
  status: PersonStatus;
  hasSpouse: boolean;
  spouse?: {
    birthDate?: string;
    status?: PersonStatus;
  };
  healthSubjective?: 'fragile' | 'moyenne' | 'bonne'; // pondère espérance de vie (optionnel)
}
```

```ts
// src/types/assets.ts
export type RegisteredType = 'REER' | 'FERR' | 'CRI' | 'FRV';
export type AssetClass =
  | 'TFSA'     // CELI
  | 'Registered'  // REER/FERR/CRI/FRV
  | 'NonRegistered'
  | 'Annuity'
  | 'PrivatePension'
  | 'RealEstate'
  | 'Cash'
  | 'Crypto'
  | 'Other';

export interface LiquidityInfo {
  noticeDays?: number;     // ex: 90 (préavis)
  redemptionFeePct?: number;
  earlyPenaltyPct?: number;
}

export interface WithdrawalRule {
  minPct?: number;         // ex: FERR minimum légal
  schedule?: Array<{ age: number; minPct: number }>;
}

export interface Asset {
  id: string;
  class: AssetClass;
  registeredType?: RegisteredType;
  name?: string;
  balance: number;
  currency?: 'CAD' | 'USD';
  costBasis?: number;     // utile NonRegistered
  expectedReturnPct?: number; // hypothèse
  volatilityPct?: number;     // pour Monte Carlo
  liquidity?: LiquidityInfo;
  withdrawalRule?: WithdrawalRule;
}
```

```ts
// src/types/benefits.ts
export interface RRQEstimates {
  at60?: number;
  at65?: number;
  at70?: number;
  at72?: number;
  // série échantillonnée si disponible
}

export interface OASEstimates {
  baseAt65?: number;
  deferralIncreasePctPerMonth?: number; // p.ex. +0.6%/mois si applicable
}

export interface ClawbackModel {
  thresholdIncome: number;      // seuil récupération OAS
  clawbackRate: number;         // p.ex. 0.15
}

export interface GovernmentBenefits {
  rrqTargetAge?: number;        // 60..72
  rrqEstimates?: RRQEstimates;
  oasTargetAge?: number;        // 65..70
  oasEstimates?: OASEstimates;
  oasClawback?: ClawbackModel;
  eligibility?: {
    rrqEligibleAt?: number;     // âge
    oasEligibleAt?: number;     // âge
  };
}
```

```ts
// src/types/expenses.ts
export type ExpenseFrequency = 'monthly' | 'quarterly' | 'annual' | 'weekly' | 'biweekly';
export type ExpenseCategory =
  | 'housing'
  | 'insurance'
  | 'groceries'
  | 'utilities'
  | 'taxes'
  | 'transportation'
  | 'health'
  | 'irregular'
  | 'seasonal'
  | 'discretionary'
  | 'other';

export interface Seasonality {
  months: number[]; // ex: [1,2,12] pour pics
  upliftPct?: number;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  label: string;
  amount: number;
  frequency: ExpenseFrequency;
  essential?: boolean;  // vs discrétionnaire
  seasonality?: Seasonality;
}
```

```ts
// src/types/notifications.ts
export type NotificationChannel = 'local' | 'email';
export type NotificationType =
  | 'investment-withdrawal'
  | 'rrif-conversion'         // REER→FERR
  | 'rrq-application'
  | 'oas-application'
  | 'tax-installment'
  | 'insurance-renewal'
  | 'custom';

export interface Notification {
  id: string;
  scenarioId: string;
  type: NotificationType;
  title: string;
  date: string;           // ISO date (cible)
  remindDaysBefore?: number[]; // ex: [90, 60, 30]
  channel: NotificationChannel;
  metadata?: Record<string, string | number>;
}
```

```ts
// src/types/scenario.ts
export interface Scenario {
  id: string;
  name: string;
  createdAt: number;
  clonedFromId?: string;
  profile: import('./profile').Profile;
  assets: import('./assets').Asset[];
  benefits: import('./benefits').GovernmentBenefits;
  expenses: import('./expenses').Expense[];
  assumptions?: {
    inflationPct?: number;
    realReturnPct?: number;
    // autres hypo
  };
}
```

```ts
// src/types/analytics.ts
export type AnalyticsEvent =
  | { type: 'WizardStepCompleted'; step: string; scenarioId: string }
  | { type: 'WizardContinueToNextIncomplete'; from: string; to: string; scenarioId: string }
  | { type: 'RRQAgeApplied'; age: number; scenarioId: string }
  | { type: 'OASAgeApplied'; age: number; scenarioId: string }
  | { type: 'NotificationScheduled'; notificationType: string; targetDate: string; scenarioId: string }
  | { type: 'SimulationRun'; method: 'MonteCarlo' | '4Percent' | 'VPW' | 'Guardrails'; trials?: number; scenarioId: string }
  | { type: 'ScenarioCreated'; scenarioId: string; source?: string }
  | { type: 'ScenarioCloned'; scenarioId: string; clonedFromId: string }
  | { type: 'ReportExported'; scenarioId: string; format: 'PDF' }
  | { type: 'DataAnomalyDetected'; path: string; severity: 'warning' | 'error'; scenarioId: string };

export interface AnalyticsClient {
  track(event: AnalyticsEvent): void;
}
```

## 4) Contrats de services — API internes

Wizard/Navigation (FinancialMasterWizard)
```ts
export interface WizardService {
  getProgress(scenarioId: string): Promise<WizardProgress>;
  getNextIncompleteStep(scenarioId: string): Promise<WizardStepId | null>;
  canProceed(step: WizardStepId, scenarioId: string): Promise<{ ok: boolean; missing: MissingField[] }>;
  markStepComplete(step: WizardStepId, scenarioId: string): Promise<void>;
  goTo(step: WizardStepId, scenarioId: string): Promise<void>;

  applyRRQAge(age: number, scenarioId: string): Promise<void>; // appelé par CTA
  applyOASAge(age: number, scenarioId: string): Promise<void>; // appelé par CTA
}
```

Validation & Diagnostics
```ts
export interface ValidationMiddleware {
  validateStep(step: WizardStepId, scenarioId: string): Promise<MissingField[]>;
}

export interface CalculationDiagnosticServiceApi {
  nextIncompleteStep(scenarioId: string): Promise<WizardStepId | null>;
  anomalies(scenarioId: string): Promise<MissingField[]>; // réutilise MissingField
}
```

Prestations (RRQ/SV)
```ts
export interface BenefitsService {
  estimateRRQ(profile: Profile): Promise<RRQEstimates>;
  estimateOAS(profile: Profile): Promise<OASEstimates>;
  computeOASClawback(income: number, model: ClawbackModel): number; // montant récupéré
}
```

Budget/Simulation
```ts
export interface BudgetService {
  computeMonthlyBudget(scenario: Scenario): Promise<{
    incomeNet: number;
    expenses: number;
    savingsOrShortfall: number;
  }>;
}

export type WithdrawalStrategy = 'FourPercent' | 'VPW' | 'Guardrails' | 'Bucket';

export interface SimulationService {
  runMonteCarlo(scenario: Scenario, options?: { trials?: number; stress?: 'none'|'shock'|'inflation' }): Promise<{
    successProbability: number;      // 0..1
    ruinAgeP5?: number;
    ruinAgeP50?: number;
    ruinAgeP95?: number;
  }>;
  evaluateWithdrawal(strategy: WithdrawalStrategy, scenario: Scenario): Promise<{
    sustainableSpending: number;
    notes?: string[];
  }>;
}
```

Ordre de retraits fiscalement optimal
```ts
export interface TaxOptimizationService {
  // Retourne l’ordre d’épuisement/retraits (par source) et l’impact TMI/clawback
  optimalWithdrawalOrder(scenario: Scenario, horizonYears?: number): Promise<{
    order: string[]; // ex: ['NonRegistered','TFSA','Registered']
    estimatedTaxImpact: Array<{ year: number; marginalRate: number; oasClawback?: number }>;
    rationale: string[];
  }>;
}
```

Notifications
```ts
export interface NotificationScheduler {
  schedule(notification: Notification): Promise<void>;
  cancel(id: string): Promise<void>;
  list(scenarioId: string): Promise<Notification[]>;
}
```

## 5) Navigation: règles, garde-fous et UX

- Règle “Suivant”:
  - Avant de naviguer, `WizardService.canProceed(currentStep, scenarioId)` doit retourner `{ok:true}`.
  - Sinon, afficher un panneau “Champs requis” listant `MissingField[]` avec boutons “Aller au champ”.
- Règle “Continuer” (Dashboard):
  - Appelle `CalculationDiagnosticServiceApi.nextIncompleteStep` et redirige vers la route correspondante.
- Badges d’état:
  - Chaque item du menu (SeniorsFixedNavigation / MobileNav) récupère `CompletenessStatus` et affiche badge.
- Sauvegarde et reprise:
  - `EnhancedSaveManager` stocke le `WizardState` (dernier step, scenarioId; autosave).
- Mode guidé vs libre:
  - Toggle visible; en mode libre, accès direct à toutes les sections mais les badges guident l’utilisateur.

## 6) Liens profonds et CTA “Appliquer au profil”

URL pattern (web):
- Appliquer âge RRQ: `/prestations/apply?rrqAge=68&redirect=/budget&scenarioId=:sid`
- Appliquer âge OAS: `/prestations/apply?oasAge=66&redirect=/budget&scenarioId=:sid`

Comportement:
1) Page handler lit query, appelle `WizardService.applyRRQAge(age, scenarioId)` ou `applyOASAge(...)`.
2) Track event: `AnalyticsClient.track({ type: 'RRQAgeApplied', age, scenarioId })`.
3) Recalcul budget/simulations si nécessaire, puis redirect → `redirect` (par défaut: `/budget`).
4) Toast de confirmation: “Âge RRQ appliqué (68 ans). Budget mis à jour.”

CTA button (ex. dans RRQQuickCompare):
- Label: “Appliquer cet âge RRQ”
- Action: push vers `/prestations/apply?rrqAge={selectedAge}&redirect=/budget&scenarioId={sid}`

## 7) Anomalies et checklist de complétude

Définir quelques règles génériques (exemples):
- Profil:
  - birthDate absent → error
  - province absent → error
  - statut absent → error
- Revenus:
  - Somme < 0 → error
  - Net > Brut (si saisi) → warning
- Actifs:
  - balance < 0 → error
  - registeredType FERR avant 65 sans conversion documentée → warning
- Prestations:
  - rrqTargetAge hors [60..72] → error
  - oasTargetAge hors [65..70] → error
- Dépenses:
  - Aucune dépense enregistrée → warning
  - Catégorie essentielle = 0 (logement, nourriture) → warning

`CalculationDiagnosticServiceApi.anomalies()` retourne la liste et la GUI offre des liens “corriger”.

## 8) KPI et instrumentation

KPI principaux:
- Taux de complétion du wizard
- Temps médian par étape
- Probabilité de succès Monte Carlo médiane
- Nb scénarios créés / comparés
- Taux d’application d’un âge RRQ/SV via CTA
- Taux d’activation des rappels
- Taux d’export PDF

Instrumentation minimale:
- `WizardStepCompleted`, `WizardContinueToNextIncomplete`
- `RRQAgeApplied`, `OASAgeApplied`
- `NotificationScheduled`
- `SimulationRun`
- `ScenarioCreated`, `ScenarioCloned`
- `ReportExported`
- `DataAnomalyDetected`

## 9) Backlog détaillé (par priorité)

P1 — Wizard unifié + garde-fous
- Implémenter `WizardService`, `ValidationMiddleware`, `CalculationDiagnosticServiceApi`.
- Footer collant, barre de progression, badges d’état.
- “Continuer” vers prochaine étape incomplète.
- AC:
  - Blocage “Suivant” si champs requis manquants avec checklist cliquable.
  - Progression (%) et badge par section visibles et cohérents.
  - Autosauvegarde et reprise sur la dernière étape.

P2 — Prestations: SV/OAS + récupération
- Implémenter `BenefitsService.estimateOAS`, modèle de clawback.
- Intégrer OAS dans budget et simulateurs.
- CTA “Appliquer âge RRQ/SV” avec liens profonds.
- AC:
  - OAS estimé correctement selon âge cible.
  - Clawback calculé et visible (heatmap par âge optionnelle).
  - CTA applique l’âge et déclenche recalcul.

P3 — Stratégies de retraits + ordre fiscal
- `SimulationService.evaluateWithdrawal` pour VPW, Guardrails, Bucket.
- `TaxOptimizationService.optimalWithdrawalOrder`.
- AC:
  - Comparateur des stratégies avec KPIs (dépenses soutenables, proba succès, âge de ruine).
  - Ordre recommandé justifié (rationale).

P4 — Notifications 90 jours & événements réglementaires
- `NotificationScheduler` + UI paramétrage (canal, horizon).
- Préréglages: REER→FERR (71 ans), RRQ/SV (selon âge cible), retraits avec préavis.
- AC:
  - Création, liste, annulation notifications.
  - Rappels planifiés aux horizons 90/60/30 j.

P5 — Scénarios A/B/C, comparaison, PDF
- Scenario manager (clone, renomme, supprime).
- ComparisonPage améliorée (delta des KPIs).
- `PDFExportService` intégration bout-en-bout.
- AC:
  - Comparaison côte à côte A/B/C avec KPIs alignés.
  - Export PDF avec résumé, hypothèses, graphiques, plan d’action.

P6 — Dashboard senior-friendly + Aide
- SeniorsDashboard final avec 3 cartes KPI et CTA “Continuer”.
- SeniorsHelpSystem: info-bulles, définitions, mini-vidéos.
- AC:
  - Scores en sémaphore (Vert/Jaune/Rouge).
  - CTA vers prochaine étape incomplète.

## 10) Critères d’acceptation (résumé exécutif)

- Navigation:
  - L’utilisateur ne peut pas avancer sans minimum requis par étape (checklist explicite).
  - Le bouton “Continuer” mène systématiquement à la prochaine étape incomplète.
- Liens profonds:
  - Appliquer l’âge RRQ/SV depuis comparateurs met à jour le profil, retrigger budget/simulations, en un clic.
- Analyses:
  - OAS avec clawback intégré dans le budget.
  - Stratégies de retraits comparées avec rationales claires.
- Notifications:
  - Rappels 90 j fonctionnels et configurables par canal/horizon.
- Scénarios:
  - A/B/C gérés, comparés, exportables en PDF.
- UX:
  - Dashboard lisible (KPI clés), aide contextuelle, sauvegarde auto, reprise fluide.

## 11) Implémentation — Notes techniques

- Evénements: centraliser via `ComparisonAnalytics` (ou un client analytics dédié) avec un adaptateur no-op pour dev.
- Stockage: `EnhancedSaveManager` + `SecureStorage` pour préférences notifications.
- Redirections: wrapper de navigation qui applique `WizardService.canProceed` avant “Suivant”.
- Tests:
  - Tests unitaires pour `ValidationMiddleware` (chemins manquants).
  - Tests d’intégration de flux CTA → apply → budget recalculé.
  - Tests E2E min: parcours P1 complet (profil→...→budget).

## 12) Annexes — Messages UI (fr court)

- “Champs requis pour continuer”
- “Âge RRQ appliqué: {age} ans. Budget mis à jour.”
- “Notification programmée: {type} le {date} (rappels: 90/60/30 j).”
- “Ordre recommandé de retraits: {ordre}. Impôt marginal estimé: {x}%.”
- “Probabilité de succès: {p}%. Âge de ruine (médian): {age}.”

Fin du document.
