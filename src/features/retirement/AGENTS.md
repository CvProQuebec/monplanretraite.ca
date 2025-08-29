# 🤖 AGENTS.md - Module de Retraite

## 📋 Vue d'ensemble du module

Le **Module de Retraite** est le cœur de MonPlanRetraite.ca, gérant tous les calculs de prestations gouvernementales canadiennes, l'optimisation fiscale et la planification de retraite avancée.

### 🎯 Fonctionnalités principales
- Calculs RRQ/CPP avec optimisations avancées
- Analyse OAS/GIS et Supplément de Revenu Garanti (SRG)
- Planification RREGOP et pensions privées
- Optimisation fiscale et stratégies de retrait
- Simulation Monte Carlo et analyses de sensibilité
- Rapports intelligents et recommandations personnalisées

## 🏗️ Architecture du module

### 📁 Structure des dossiers
```
src/features/retirement/
├── components/          # Composants React du module
│   ├── ultimate/       # Composants de planification avancée
│   ├── emergency/      # Composants de planification d'urgence
│   └── reports/        # Composants de génération de rapports
├── hooks/              # Hooks personnalisés du module
├── services/           # Services métier et calculs
├── types/              # Types TypeScript spécifiques
└── utils/              # Utilitaires et formateurs
```

### 🔑 Composants principaux
- **`RetirementApp.tsx`** - Composant principal du module
- **`Phase2Wrapper.tsx`** - Wrapper avec thèmes et particules
- **`SRGAnalysisSection.tsx`** - Analyse du Supplément de Revenu Garanti
- **`AdvancedRRQAnalysis.tsx`** - Analyse avancée RRQ/CPP
- **`OASGISAnalysis.tsx`** - Analyse OAS/GIS
- **`MonteCarloSimulator.tsx`** - Simulation Monte Carlo

## 🔧 Services métier

### CalculationService
- **Fichier :** `src/features/retirement/services/CalculationService.ts`
- **Responsabilité :** Calculs principaux de retraite
- **Méthodes clés :**
  - `calculateAll()` - Calculs complets
  - `calculateRRQ()` - Calculs RRQ/CPP
  - `calculateOAS()` - Calculs OAS/GIS

### SRGService
- **Fichier :** `src/services/SRGService.ts`
- **Responsabilité :** Calculs du Supplément de Revenu Garanti
- **Méthodes clés :**
  - `calculateSRGAnalysis()` - Analyse SRG complète
  - `evaluateSRGPriority()` - Évaluation de priorité
  - `generateOptimizations()` - Optimisations possibles

### EnhancedRRQService
- **Fichier :** `src/features/retirement/services/EnhancedRRQService.ts`
- **Responsabilité :** Calculs RRQ avancés avec optimisations
- **Fonctionnalités :**
  - Optimisation des contributions
  - Analyse d'impact de l'inflation
  - Scénarios alternatifs

## 📊 Types et interfaces

### Types principaux
```typescript
// Données personnelles
interface PersonalData {
  naissance1: string;
  naissance2?: string;
  salaire1: number;
  salaire2?: number;
  // ... autres champs
}

// Données de retraite
interface RetirementData {
  rrq: RRQData;
  oas: OASData;
  srg?: SRGData;
  // ... autres modules
}

// Résultats de calculs
interface CalculationResult {
  monthly: number;
  annual: number;
  breakdown: Record<string, number>;
}
```

### Extensions SRG
```typescript
// Types SRG spécifiques
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

## 🧮 Algorithmes de calcul

### Calculs RRQ/CPP
```typescript
// Formule de base RRQ
const rrqAmount = (averageEarnings * 0.25) * (contributionYears / 40);

// Optimisation des contributions
const optimalContribution = Math.min(
  maxContribution,
  targetEarnings * 0.0595
);
```

### Calculs SRG
```typescript
// Éligibilité de base
const isEligible = age >= 65 && residenceYears >= 10;

// Calcul du montant
const srgAmount = Math.max(
  0,
  maxAmount - (income * reductionRate)
);
```

### Simulation Monte Carlo
```typescript
// Paramètres de simulation
interface SimulationParams {
  iterations: number;
  timeHorizon: number;
  volatility: number;
  returnRate: number;
}

// Exécution de simulation
const results = MonteCarloService.runSimulation(params, userData);
```

## 🌐 Internationalisation

### Support bilingue
- **Hook :** `useLanguage` pour la détection de langue
- **Props :** `isEnglish` dans tous les composants
- **Traductions :** Objets `t` pour chaque composant

### Exemple d'utilisation
```typescript
const { language } = useLanguage();
const isEnglish = language === 'en';

const t = {
  title: isEnglish ? 'Retirement Planning' : 'Planification de Retraite',
  calculate: isEnglish ? 'Calculate' : 'Calculer',
  // ... autres traductions
};
```

## 📱 Optimisations mobiles

### Hooks spécialisés
- **`useMobileDetection`** - Détection d'appareil mobile
- **`useMobileReflowFix`** - Correction des reflows mobiles
- **`useMobileAware`** - Composants adaptés au mobile

### Responsive design
- **Mobile-first :** Commencer par mobile, étendre vers desktop
- **Breakpoints :** Utiliser les breakpoints Tailwind standard
- **Navigation :** Menu hamburger pour mobile

## 🔒 Sécurité et confidentialité

### Règles strictes
- ❌ **AUCUNE transmission réseau** des données confidentielles
- ✅ **Calculs 100% locaux** dans le navigateur
- ✅ **Chiffrement** des données sensibles
- ✅ **Validation** stricte des entrées

### Données protégées
- Revenus personnels et familiaux
- Informations de retraite détaillées
- Calculs de prestations gouvernementales
- Stratégies d'optimisation fiscale

## 🧪 Tests et validation

### Tests de compilation
```bash
# Vérification TypeScript
npm run type-check

# Build complet
npm run build

# Vérification des exports
npm run lint
```

### Tests d'intégration
- Vérifier que tous les composants s'exportent
- Tester les imports entre modules
- Valider la cohérence des types
- Vérifier la compilation sans erreurs

### Tests de sécurité
- Confirmer qu'aucune donnée n'est transmise
- Vérifier que tous les calculs sont locaux
- Tester l'encryption des données sensibles

## 🔄 Workflow de développement

### 1. Analyse des besoins
- Comprendre le contexte des prestations gouvernementales
- Identifier les composants à créer/modifier
- Vérifier la cohérence avec l'architecture existante

### 2. Implémentation
- Créer/modifier les types TypeScript
- Implémenter les services métier
- Créer les composants React
- Ajouter les tests et validations

### 3. Intégration
- Mettre à jour les fichiers d'index
- Vérifier les exports et imports
- Tester la compilation
- Valider l'intégration

### 4. Tests et validation
- Test de compilation TypeScript
- Test de build Vite
- Vérification des exports
- Test d'intégration

## 🎯 Bonnes pratiques

### Code
- **Lisibilité :** Code clair et bien documenté
- **Réutilisabilité :** Composants modulaires et réutilisables
- **Performance :** Optimisations React (memo, useCallback, useMemo)
- **Accessibilité :** Support des lecteurs d'écran

### Architecture
- **Séparation des responsabilités :** Services, composants, types séparés
- **Injection de dépendances :** Hooks et context pour l'état global
- **Gestion d'état :** Local pour composant, global pour application

### Sécurité
- **Validation :** Toutes les entrées utilisateur validées
- **Chiffrement :** Données sensibles chiffrées localement
- **Isolation :** Aucune fuite de données vers l'extérieur

## 📚 Ressources et références

### Documentation gouvernementale
- [SRG (GIS)](https://www.canada.ca/fr/services/prestations/pensionspubliques/prestations-vieillesse/supplement-revenu-garanti.html)
- [RRQ/CPP](https://www.rrq.gouv.qc.ca/)
- [SV (OAS)](https://www.canada.ca/fr/services/prestations/pensionspubliques/prestations-vieillesse.html)

### Documentation technique
- [React Hooks](https://react.dev/reference/react/hooks)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

*AGENTS.md créé pour le Module de Retraite - Dernière mise à jour : 27 août 2025*
