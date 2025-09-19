# CLAUDE.md - Guide de référence pour les modifications

## 📋 RÉFÉRENCE OBLIGATOIRE

Avant toute modification du site web, consulter:
- H:\monplanretraite.ca\private-docs\architecture\AGENTS.md (instructions générales, architecture consolidée)
- architecture.md (vue d’ensemble + modules, y compris Budget, Notifications, Gamification/SMART)
- Cette présente page (règles d’implémentation et checklists)

## 🚨 RÈGLE CRITIQUE - FORMATAGE OQLF

ATTENTION ABSOLUE: Lors de l'application des règles OQLF, NE JAMAIS remplacer les guillemets droits " par des chevrons « » dans le code JavaScript/TypeScript. Les guillemets droits sont ESSENTIELS pour le fonctionnement du code.

HISTORIQUE CRITIQUE: Cette erreur a causé un crash complet du site par le passé.

EXEMPLE CORRECT:
```typescript
// ✅ GARDER LES GUILLEMETS DROITS DANS LE CODE
const message = "Prix : 119,99 $";
const className = "senior-btn senior-btn-primary";
const selectQuery = "SELECT * FROM users WHERE name = \"John\"";
```

EXEMPLE INTERDIT:
```typescript
// ❌ NE JAMAIS FAIRE CECI - CASSE LE CODE
const message = « Prix : 119,99 $ »;
const className = « senior-btn senior-btn-primary »;
const selectQuery = « SELECT * FROM users WHERE name = « John » »;
```

## ✅ Checklists obligatoires

Avant de considérer une tâche comme terminée:
- [ ] Champs nouvellement créés ou renommés intégrés sans perte de données
- [ ] Mécanisme de sauvegarde/récupération testé (local/session + sauvegarde fichers)
- [ ] Initialisation des sessions vérifiée (valeurs par défaut, migration si applicable)
- [ ] Documentation mise à jour: 
  - [ ] H:\monplanretraite.ca\private-docs\architecture\AGENTS.md
  - [ ] architecture.md (si architecture impactée)
  - [ ] CLAUDE.md (si instructions/process changent)
- [ ] Procédures sauvegardées dans private-docs\roadmap si applicable
- [ ] Build et type-check OK (npm run build, npm run typecheck)
- [ ] Normes OQLF (affichage) et Accessibilité seniors (18px/48px) respectées

## 📚 WORKFLOW DE DOCUMENTATION OBLIGATOIRE

Avant implémentation — Créer: app_info/YYYY-MM-DD_desired_app_functionality.md
- Exigences, restrictions, critères de succès

Après implémentation — Créer: app_info/YYYY-MM-DD_implementation_update.md
- Fichiers créés/modifiés
- Détails techniques
- Résultats build/tests + problèmes restants

État actuel — Maintenir: app_info/YYYY-MM-DD_app_functionality.md
- Instantané des fonctionnalités actuelles et planifiées
- Marquer ✅ Complété ou ⏳ En attente

---

## 🏗️ Architecture du Projet (rappel)

Principaux artefacts:
- `src/components/ui/GlobalSummary.tsx` — Résumé familial et calculs globaux
- `src/components/ui/SeniorsFriendlyIncomeTable.tsx` — Table des revenus P1/P2
- `src/pages/Revenus.tsx` — Page revenus
- `src/types/index.ts` — Types centraux

Calculs:
- `src/utils/incomeCalculationUtils.ts`
- `src/services/` (moteurs, persistance, notifications, etc.)

Consulter architecture.md et private-docs/architecture/AGENTS.md pour les détails étendus par module (Retraite, Budget, Notifications, etc.)

---

## 🔧 Bonnes pratiques pour les modifications

### Ajout de nouveaux champs (données)
1) Définir/étendre les interfaces TypeScript (dans `src/types` appropriés)
2) Gérer les valeurs par défaut (initialisation de session)
3) Mettre à jour la persistance (updateUserData + migrations si besoin)
4) Réaliser la migration de données (mapping anciens noms → nouveaux)
5) Mettre à jour les composants/services consommateurs
6) Couvrir la documentation (architecture.md + AGENTS.md)

### Menus déroulants (positionnement)
Problème récurrent: menus mal ancrés
Solution standardisée:
```tsx
<SelectContent 
  position="item-aligned"    // Ancrage au parent direct
  side="bottom" 
  avoidCollisions={true}
  sideOffset={4}
  style={{ zIndex: 9999 }}
  className="min-w-full"
/>
```

### Gestion des dates (Québec, fuseau local)
Éviter `new Date('YYYY-MM-DD')` (UTC). Utiliser:
```ts
const [y, m, d] = dateString.split('-').map(Number);
const localDate = new Date(y, m - 1, d); // Fuseau local
```

---

## 🌐 Normes OQLF Québécoises — Affichage

Montants (affichage):
- ❌ `$1,234.56` — Dollar avant, point décimal
- ✅ `1 234,56 $` — Espace milliers, virgule décimale, espace avant $

Horaire (affichage):
- ❌ `13:05` / `1:05 PM` / `13h05`
- ✅ `13 h 5`, `9 h 30`, `0 h 15`

Ponctuation:
- ❌ `"Prix:119,99$"`
- ✅ `"Prix : 119,99 $"`

Terminologie en interface:
- email → courriel, password → mot de passe, login → connexion, logout → déconnexion, etc.

IMPORTANT: Ces normes s’appliquent au TEXTE AFFICHÉ, pas à la syntaxe de code.

---

## 👵 Accessibilité Seniors (55-90 ans)

Règles absolues:
- Police min 18px pour tout texte
- Zones cliquables min 48px (56px recommandé)
- Contraste élevé (fond blanc pur dans modals/formulaires et zones de saisie)
- Espacements généreux
- Messages bienveillants (niveau 6e année)
- Navigation claire et linéaire (CTA contextuels)

CSS standard:
```css
.senior-layout { background: #fff; font-size: 18px; line-height: 1.6; color: #1a365d; }
.senior-btn { min-height: 48px; min-width: 140px; font-size: 18px; font-weight: 600; padding: 12px 24px; border: 2px solid; }
.senior-form-input { font-size: 18px; min-height: 48px; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 8px; }
```

---

## 🧭 Navigation inter-modules (recommandée)

Séquence conseillée:
1) Profil (âge, statut marital, province, statut : actif/sans emploi/retraité)
2) Revenus (unifiés) → agrégation du ménage
3) Investissements/biens (REER, CELI, CRI, rentes, propriétés)
4) Prestations (RRQ/SV) + âge souhaité
5) Dépenses (cashflow)
6) Budget (Vue d’ensemble, 50/30/20, Fonds d’urgence, Objectifs planifiés, Dettes, Calendrier, Valeur nette)
7) Scénarios (comparaisons, ordres de retrait optimaux)
8) Notifications (planification 90/60/30, fin de mois, FERR)

CTA contextuels:
- Après Revenus/Prestations → “Aller au Budget”
- Flux net négatif → “Revoir Dépenses” + “Créer un objectif SMART”
- Avant dates clés (RRQ/SV/FERR) → “Planifier un rappel”

---

## 💰 Module Budget — Lignes directrices (2025-09)

Références: architecture.md (section Budget) et private-docs/architecture/AGENTS.md

Composants principaux:
- Page: `src/pages/Budget.tsx`
- Lazy: `IncomeDeductionsForm`, `BudgetTargetsGauges`, `EmergencyFundCard`, `SinkingFundsManager`, `DebtSnowballWizard`, `ContextualTipsPanel`

Fonctionnalités livrées:
- Vue annuelle + export CSV (agrégats par catégorie)
- Valeur nette: actifs/passifs, instantanés (snapshots) datés
- Rappels: 90/60/30 (objectifs planifiés) + fin de mois (J-7, J-1)
- Objectifs SMART + Gamification (points, succès)
- Import Dépenses (cashflow) → Budget (liens & synchronisation basique)

Persistance (personal):
- `netWorth`, `netWorthSnapshots`, `smartGoals`, `budgetIncomeHistory`
- `budgetData`, `budgetSettings`, `budgetLinks` (existants)

Allocations 50/30/20:
- `BudgetComputationService.computeAllocations`
- Presets: 55/25/20, 50/30/20, 45/25/30

Accessibilité & OQLF:
- Utiliser les formateurs: `formatCurrencyOQLF`, `formatCurrencyLocale`, pourcentages conformes FR/EN

---

## 🔔 Notifications — Lignes directrices

Service: `src/services/NotificationSchedulerService.ts`

API:
- `scheduleSeries({ type, scenarioId, targetDate, options })` — planifie une série (leads par défaut [90,60,30])
- `scheduleRRQ(scenarioId, rrqApplicationDateISO)`
- `scheduleSV(scenarioId, oasApplicationDateISO)`
- `scheduleFERRConversion(userData, scenarioId)` — date limite 31 déc de l’année des 71 ans
- `scheduleWithdrawalNotice(scenarioId, withdrawalDateISO)`

Stockage:
- `secureStorage` avec clé `scenario:${scenarioId}:notifications`

Bonnes pratiques:
- Utiliser `scenarioId` provenant de `userData.personal.activeScenarioId` (ou fallback)
- Toujours valider les dates ISO `YYYY-MM-DD`
- Canaux: `inapp` (email/sms réservés futures évolutions)

Intégrations Budget:
- Sinking Funds: bouton “Planifier rappels 90/60/30”
- Paramètres/SMART: bouton “Rappels fin de mois” (J-7, J-1)

---

## 🏅 Gamification & SMART — Lignes directrices

Service: `src/services/GamificationService.ts`

Points/activités standard:
- Sauvegarde Budget → `budget_created` (+20 pts)
- Snapshot Valeur nette → `savings_updated` (+10 pts)
- Objectif SMART créé → `goal_created` (+30 pts)

Succès:
- `emergency-fund-complete` si `emergencyFund / totalNeeds >= monthsTarget`

SMART:
- Champs: `title`, `measure`, `target` (monétaire), `deadline` (date), `relevance`
- Persistance: `personal.smartGoals`

---

## 🧮 Calculs et logique métier (rappels)

Emplois saisonniers:
- Calculer le nombre de mois réels entre `startDate` et `endDate`
- Formule: `(endYear - startYear) * 12 + (endMonth - startMonth) + 1`

Revenus de location:
- weekend ≈ 4.33 / mois
- weekly ≈ 4.33 / mois
- monthly: montant × mois écoulés

---

## 🚀 Commandes utiles

Développement:
- `npm run dev` — serveur de développement
- `npm run build` — build production
- `npm run lint` — lint
- `npm run typecheck` — types TS

Git:
- `git status`, `git diff`, `git add .`, `git commit -m "message"`

---

## 📝 Historique des modifications importantes

Décembre 2025 — Consolidation Documentation
- Règle guillemets droits (OQLF dans code) re-affirmée
- Standards accessibilité consolidés
- Normes OQLF d’affichage précisées

Septembre 2025 — Budget & Notifications
- Vue annuelle + CSV, Valeur nette (snapshots)
- Rappels 90/60/30 (objectifs planifiés) + fin de mois
- SMART + Gamification (points & succès)
- Docs architecture mises à jour

Septembre 2025 — Optimisations Performance
- Code splitting avancé, cache intelligent
- Temps de chargement réduits

Septembre 2025 — Phases 3–4 (Wizard Résultats, Rapports PDF pro, Rappels, Buckets)
- Étape Résultats du Wizard (/wizard/plan), TaxOptimizationService (ordre retraits + horaire), NotificationSchedulerService (90/60/30, fin de mois, FERR), PDFExportService (Banquier/Planificateur/Notaire), Buckets (coussin opérationnel en mois, horizon court terme en années)

Septembre 2025 — Consolidation "Ma Retraite" + CPM2014
- Bug fuseau horaires corrigé pour emplois saisonniers
- Analyse CPM2014 intégrée

Janvier 2025 — Module Hypothèses de Calcul
- Normes IPF 2025 (inflation/rendements)
- Interface éducative avec tooltips

---

## ⚠️ Points d'attention finaux

- NE JAMAIS modifier la syntaxe de code pour “franciser” les guillemets — l’OQLF s’applique à l’affichage.
- Respecter systématiquement les standards seniors (18px/48px).
- Mettre à jour toutes les références documentaires pertinentes (AGENTS.md, architecture.md, cette page).
- Tester la persistance et la migration de données pour tout nouveau champ ou renommage.
