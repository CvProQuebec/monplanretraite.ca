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
  savings: SavingsData       // Épargne et investissements
  cashflow: CashflowData     // Dépenses et budget
}
```

#### PersonalData
- **Personnes**: Informations pour 2 personnes (couples)
- **Revenus unifiés**: `unifiedIncome1[]` et `unifiedIncome2[]`
- **Investissements**: REER, CELI, CRI avec dates
- **Statuts**: Actif, retraité, sans emploi

#### RetirementData
- **RRQ/CPP**: Montants actuels et projections à 70 ans
- **Sécurité de la vieillesse**: Gestion biannuelle (`svBiannual1/2`)
- **Pensions privées**: Rentes d'employeurs et viagères
- **Régimes spécialisés**: RREGOP, CCQ, etc.

## 💰 Architecture des revenus (Système unifié)

### Types de revenus supportés

```typescript
type IncomeType = 
  | 'salaire'           // Emploi régulier
  | 'emploi-saisonnier' // Travail saisonnier avec dates
  | 'rentes'            // Pensions privées/gouvernementales
  | 'assurance-emploi'  // Prestations AE
  | 'dividendes'        // Revenus d'investissement
  | 'revenus-location'  // Propriétés locatives (NEW: weekend/semaine/mois)
  | 'travail-autonome'  // Revenus d'entreprise
  | 'autres'            // Autres sources
```

### Interface IncomeEntry
Chaque revenu contient des propriétés spécialisées :

**Commune à tous :**
- `id`, `type`, `description`, `isActive`
- `annualAmount`, `monthlyAmount`, `toDateAmount`

**Spécifiques par type :**
- **Salaire**: `salaryNetAmount`, `salaryFrequency`, dates début/fin
- **Revenus location**: `rentalAmount`, `rentalFrequency` (weekend/weekly/monthly)
- **Assurance emploi**: `weeklyNet`, `eiEligibleWeeks`
- **Rentes**: `pensionAmount`, `pensionFrequency`, `survivorBenefit`

## 🧮 Composants de calcul principaux

### 1. GlobalSummary.tsx
**Rôle**: Agrégation de tous les revenus et calcul des totaux familiaux
**Logique**:
```typescript
function calculateToDateAmount(entry: IncomeEntry) {
  switch (entry.type) {
    case 'salaire':
    case 'emploi-saisonnier':
      // Calculs basés sur fréquence et dates d'emploi
      // Gestion spéciale pour emplois saisonniers
    case 'revenus-location':
      // NEW: Calculs weekend (4.33/mois), weekly, monthly
    case 'rentes':
      // Projections depuis date de début
  }
}
```

### 2. SeniorsFriendlyIncomeTable.tsx
**Rôle**: Interface de saisie adaptée aux seniors
**Caractéristiques**:
- Grandes polices (text-xl, text-2xl)
- Contrastes élevés (border-4)
- Gestion en ligne avec mode édition
- Validation en temps réel

### 3. Services de calcul
- **CalculationService**: Calculs de base (capital, suffisance)
- **EnhancedRRQService**: Optimisations RRQ/CPP
- **MonteCarloService**: Simulations probabilistes
- **TaxOptimizationService**: Stratégies fiscales 2025

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
1. **Saisie**: `SeniorsFriendlyIncomeTable` capture les données
2. **Stockage**: Mise à jour via `updateUserData`
3. **Calculs**: `GlobalSummary` agrège et calcule
4. **Affichage**: Résultats temps réel dans "Résumé familial"

## 🎯 Patterns architecturaux

### 1. Composants seniors-friendly
```typescript
// Interface adaptée
className="text-xl border-4 border-gray-300 p-4"
// Grandes polices + contrastes élevés

// Navigation simplifiée
<AdaptiveHeader /> // 4 blocs principaux
<SeniorsNavigation /> // Menu visuel avec icônes
```

### 2. Calculs "à ce jour"
Logique sophistiquée pour montants accumulés :
- **Emplois saisonniers**: Calcul exact des mois travaillés
- **Salaires**: Basé sur fréquence de paie et dates
- **Prestations**: Projections mensuelles depuis début
- **Gestion fuseau horaire**: `new Date(year, month-1, day)` pour dates locales

### 3. Persistance robuste
- **Triple sauvegarde**: Session + Local + Fichiers
- **Migration automatique**: Mise à jour des formats
- **Récupération**: Fallbacks multiples

## 🌐 Spécificités canadiennes

### Standards IPF 2025
- **Inflation**: 2,1%
- **Rendements**: Variables par classe (3,4% à 8,0%)
- **Mortalité**: Tables CPM2014

### Prestations gouvernementales
- **RRQ/CPP**: Calculs selon tables officielles
- **SV/SRG**: Gestion biannuelle et récupération fiscale
- **AE**: Calculs hebdomadaires avec limites provinciales

## 🔧 Points techniques importants

### Gestion des menus déroulants
**Problème**: Positionnement incorrect avec `position="popper"`
**Solution**: 
```typescript
<SelectContent 
  position="item-aligned" 
  side="bottom" 
  avoidCollisions={false}
  style={{zIndex: 9999}}
>
```

### Dates et fuseaux horaires
**Problème**: `new Date('2025-05-01')` → UTC, décalage fuseau
**Solution**: Parsing manuel des dates
```typescript
const [year, month, day] = dateString.split('-').map(Number);
const localDate = new Date(year, month - 1, day);
```

### Types de revenus extensibles
Nouvelle fréquence de location :
```typescript
rentalFrequency: 'weekend' | 'weekly' | 'monthly'
// weekend = 4.33 week-ends par mois
// weekly = 4.33 semaines par mois
```

## 📊 Interconnexions clés

### Calculs automatiques
```
Modification dans Table → useRetirementData → GlobalSummary
                                          → CalculationService  
                                          → Sauvegarde auto
```

### Services interdépendants
```
RRQ Service ←→ Tax Optimization ←→ Monte Carlo
     ↓              ↓                   ↓
Retirement Budget Service ←→ Cashflow Analysis
```

## ⚠️ Considérations de maintenance

### Fichiers critiques
- **`src/types/index.ts`**: Définitions TypeScript centrales
- **`useRetirementData.ts`**: Gestion d'état principale
- **`GlobalSummary.tsx`**: Logique de calcul des totaux
- **`CalculationService.ts`**: Moteur de calcul principal

### Tests recommandés
- **Calculs**: Vérifier précision des montants "à ce jour"
- **Dates**: Tester avec différents fuseaux horaires
- **UI**: Validation des menus déroulants et responsive
- **Persistance**: Tests de sauvegarde/récupération

---

*Cette architecture évolue pour répondre aux besoins spécifiques de planification de retraite au Canada, avec un focus sur l'accessibilité seniors.*