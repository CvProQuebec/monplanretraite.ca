# 🤖 AGENTS.md - MonPlanRetraite.ca

## 📋 Vue d'ensemble du projet

**MonPlanRetraite.ca** est une application web de planification de retraite avancée, spécialisée dans les prestations gouvernementales canadiennes (RRQ, SV, SRG, RREGOP). L'application est **100% sécurisée** avec des calculs locaux uniquement - aucune transmission réseau des données confidentielles.

### 🎯 Objectifs principaux
- Calculs précis des prestations gouvernementales canadiennes
- Optimisation fiscale et stratégies de retraite
- Interface moderne et accessible pour tous les âges
- Sécurité maximale des données personnelles
- Support bilingue français/anglais

### 🏗️ Architecture technique
- **Frontend :** React 18 + TypeScript + Vite
- **Styling :** Tailwind CSS + composants UI personnalisés
- **État :** React Hooks + Context API
- **Routing :** React Router v6
- **Build :** Vite + TypeScript
- **Déploiement :** Netlify

## 🚀 Commandes de développement

### Installation et démarrage
```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Build de production
npm run build

# Vérification des types TypeScript
npm run type-check

# Linting et formatage
npm run lint
npm run format
```

### Scripts disponibles
```bash
npm run dev          # Démarrage serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
npm run lint         # Vérification ESLint
npm run type-check   # Vérification TypeScript
```

## 🏗️ Structure du projet

### 📁 Organisation des dossiers
```
src/
├── components/          # Composants UI réutilisables
│   ├── layout/         # Composants de mise en page
│   ├── ui/            # Composants UI de base (shadcn/ui)
│   └── ...
├── features/           # Fonctionnalités métier
│   └── retirement/    # Module de planification de retraite
│       ├── components/ # Composants spécifiques à la retraite
│       ├── hooks/     # Hooks personnalisés
│       ├── services/  # Services métier
│       └── types/     # Types TypeScript
├── pages/             # Pages principales de l'application
├── services/          # Services globaux
├── hooks/             # Hooks globaux
├── lib/               # Utilitaires et configurations
├── types/             # Types TypeScript globaux
└── utils/             # Fonctions utilitaires
```

### 🔑 Fichiers de configuration importants
- `package.json` - Dépendances et scripts
- `tsconfig.json` - Configuration TypeScript
- `tailwind.config.ts` - Configuration Tailwind CSS
- `vite.config.ts` - Configuration Vite
- `src/config/` - Configurations métier

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
- Vérifier que tous les composants s'exportent correctement
- Tester les imports entre modules
- Valider la cohérence des types
- Vérifier la compilation sans erreurs

### Tests de sécurité
- Confirmer qu'aucune donnée n'est transmise en réseau
- Vérifier que tous les calculs sont locaux
- Tester l'encryption des données sensibles

## 📝 Conventions de code

### TypeScript
- **Interfaces :** Préfixées par leur domaine (ex: `SRGCalculationResult`)
- **Types :** Utiliser des unions discriminées pour les états
- **Génériques :** Préférer les interfaces aux types pour l'extensibilité
- **Exports :** Centraliser dans des fichiers `index.ts`

### React
- **Composants :** Fonctionnels avec hooks, PascalCase
- **Props :** Interfaces TypeScript strictes
- **État :** useState pour local, useContext pour global
- **Hooks :** Préfixés par `use` (ex: `useRetirementData`)

### CSS/Styling
- **Tailwind :** Classes utilitaires, composants personnalisés si nécessaire
- **Responsive :** Mobile-first, breakpoints Tailwind
- **Thèmes :** Système de thèmes dynamiques avec CSS variables

## 🔒 Considérations de sécurité

### Règles strictes
- ❌ **AUCUNE transmission réseau** des données confidentielles
- ❌ **AUCUN workflow n8n** ou service externe
- ✅ **Calculs 100% locaux** dans le navigateur
- ✅ **Chiffrement** des données sensibles
- ✅ **Validation** stricte des entrées utilisateur

### Données protégées
- Revenus personnels et familiaux
- Solde bancaire et investissements
- Plan de retraite détaillé
- Informations médicales et d'urgence
- Calculs de prestations gouvernementales

### 🛡️ Protection de la Dignité Utilisateur
- **Aucune stigmatisation** basée sur le niveau de revenu
- **Respect total** de la situation financière personnelle
- **Confidentialité absolue** des données sensibles
- **Validation inclusive** des entrées utilisateur
- **Messages d'erreur bienveillants** et encourageants

## 🌐 Internationalisation et Normes OQLF

### Support linguistique
- **Français :** Langue par défaut (normes OQLF strictes)
- **Anglais :** Support complet
- **Hooks :** `useLanguage` pour la détection
- **Routes :** Préfixes `/fr/` et `/en/`
- **Composants :** Props `isEnglish` ou `language`

### Conventions de traduction
- Utiliser le hook `useLanguage` dans tous les composants
- Créer des objets de traduction `t` pour chaque composant
- Éviter le texte codé en dur
- Tester les deux langues

### 🏛️ Règles OQLF Strictes (Office Québécois de la Langue Française)

#### **Format des Montants d'Argent**
```typescript
// ❌ FORMATS INCORRECTS
"$1,234.56"     // Dollar avant, virgule décimale
"1234,56$"      // Pas d'espace, dollar après
"Prix:119,99$"  // Pas d'espace avant le dollar

// ✅ FORMATS CORRECTS OQLF
"1 234,56 $"    // Espace pour milliers, virgule décimale, espace avant $
"Prix : 119,99 $" // Espace avant les deux-points et avant $
```

#### **Format Horaire Québécois**
```typescript
// ❌ FORMATS INCORRECTS
"13:05"         // Format 24h avec deux-points
"1:05 PM"       // Format 12h anglais
"13h05"         // Pas d'espace

// ✅ FORMATS CORRECTS OQLF
"13 h 5"        // Espace avant et après h, pas de zéro
"9 h 30"        // Format simple et lisible
"0 h 15"        // Pour minuit et quart
```

#### **Règles de Ponctuation**
```typescript
// ❌ INCORRECT
"Erreur ! Veuillez réessayer ?"  // Espace avant ! et ?
"Prix:119,99$"                   // Pas d'espace avant :

// ✅ CORRECT OQLF
"Erreur! Veuillez réessayer?"    // Pas d'espace avant ! et ?
"Prix : 119,99 $"                // Espace avant : et avant $
```

#### **Majuscules OQLF**
```typescript
// ❌ INCORRECT
"Mon Plan de Retraite"           // Tous les mots en majuscule
"Module de Planification"        // Mots communs en majuscule

// ✅ CORRECT OQLF
"Mon plan de retraite"           // Seulement le premier mot
"Module de planification"        // Mots communs en minuscule
```

### 💝 Philosophie Inclusive et Réaliste

#### **Principe Central**
> **"Votre retraite, c'est votre histoire. On travaille avec vos moyens, pas avec des rêves inaccessibles."**

#### **Règles d'Interface Strictes**
- ❌ **AUCUNE promesse de millions** ou objectifs irréalistes
- ❌ **AUCUN élitisme** ou comparaison avec des standards élevés
- ✅ **Chaque épargne compte**, peu importe le montant
- ✅ **Amélioration progressive** : "Mieux qu'hier, pas parfait"
- ✅ **Respect de la dignité** de chaque utilisateur

#### **Messaging par Plan**
```typescript
// 🆓 PLAN GRATUIT
"Commencez votre planification dès aujourd'hui"
"Chaque petit pas compte vers votre retraite"

// 🆕 PLAN PROFESSIONNEL  
"Optimisez vos prestations gouvernementales"
"Maximisez vos revenus de retraite"

// 👑 PLAN EXPERT
"Planification avancée et personnalisée"
"Stratégies d'optimisation fiscale complètes"
```

#### **Composants à Respecter**
- **InclusiveMessaging** - Messages adaptés à chaque situation
- **RealisticGoalSetter** - Objectifs réalistes et personnalisés
- **ProgressCelebrator** - Célébration de chaque progrès
- **PlanRestrictedSection** - Approche inclusive pour tous les plans

#### **Logique de Calculs Réalistes**
```typescript
// ❌ ÉVITER
const arbitraryThreshold = 1000000; // 1 million $ arbitraire
const comparisonWithOthers = true;  // Comparaison avec d'autres

// ✅ UTILISER
const personalizedGoal = userData.currentSavings * 1.2; // +20% personnel
const selfComparison = true; // Comparaison avec soi-même uniquement
```

## 📱 Optimisations mobiles

### Responsive design
- **Mobile-first :** Commencer par mobile, étendre vers desktop
- **Breakpoints :** Utiliser les breakpoints Tailwind standard
- **Navigation :** Menu hamburger pour mobile, navigation complète pour desktop

### Performance mobile
- **Lazy loading :** Composants et images
- **Optimisations CSS :** Éviter les reflows, utiliser GPU
- **Hooks :** `useMobileDetection`, `useMobileReflowFix`

## 🔧 Modules métier

### Module SRG (Supplément de Revenu Garanti)
- **Service :** `src/services/SRGService.ts`
- **Types :** `src/types/srg.ts`
- **Composant :** `src/features/retirement/components/SRGAnalysisSection.tsx`
- **Intégration :** `src/services/SRGCalculationService.ts`

### Module RREGOP (Régime de Retraite des Employés du Gouvernement et des Organismes Publics)
- **Service :** `src/services/RREGOPService.ts`
- **Types :** `src/types/rregop.ts`
- **Composant :** `src/features/retirement/components/RREGOPAnalysisSection.tsx`
- **Intégration :** `src/services/RREGOPCalculationService.ts`

### Module Immobilier (Optimisation Immobilière de Retraite)
- **Service :** `src/services/RealEstateOptimizationService.ts`
- **Types :** `src/types/real-estate.ts`
- **Composant :** `src/features/retirement/components/RealEstateOptimizationSection.tsx`
- **Fonctionnalités :** 5 onglets (Analyse, Scénarios, Réinvestissement, Comparaison, Exécution)

### Module RRQ/CPP
- **Service :** `src/features/retirement/services/CalculationService.ts`
- **Types :** `src/features/retirement/types/cpp.ts`
- **Composants :** `CPPCalculator.tsx`, `AdvancedRRQAnalysis.tsx`

### Module OAS/GIS
- **Service :** `src/features/retirement/services/OASGISService.ts`
- **Composant :** `OASGISAnalysis.tsx`

## 🚨 Gestion des erreurs

### Error Boundaries
- **Composant :** `src/components/ui/ErrorBoundary.tsx`
- **Utilisation :** Wrapper autour des composants critiques
- **Logging :** Console + fallback UI

### Validation des données
- **Schémas :** Validation stricte des entrées utilisateur
- **Types :** TypeScript strict pour la cohérence
- **Middleware :** `src/lib/validationMiddleware.ts`

## 📊 Métriques et monitoring

### Services de métriques
- **Airtable :** `src/services/airtableService.ts`
- **Hooks :** `useMetrics`, `useAnimatedMetrics`
- **Configuration :** `src/hooks/useAirtableConfig.ts`

### Logging et debugging
- **Console :** Utiliser `console.log` avec des emojis pour la visibilité
- **Erreurs :** Logging détaillé des erreurs avec contexte
- **Performance :** Mesure des temps de calcul

## 🔄 Workflow de développement

### 1. Analyse des besoins
- Comprendre le contexte métier (prestations gouvernementales)
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
- **Accessibilité :** Support des lecteurs d'écran et navigation clavier

### 🌟 Approche Inclusive
- **Messaging bienveillant** : Toujours encourager et valoriser
- **Objectifs réalistes** : Basés sur la situation actuelle de l'utilisateur
- **Célébration des progrès** : Chaque amélioration est une victoire
- **Respect de la diversité** : Aucun jugement sur les choix financiers
- **Interface accessible** : Adaptée à tous les niveaux de compétence

### Architecture
- **Séparation des responsabilités :** Services, composants, types séparés
- **Injection de dépendances :** Hooks et context pour l'état global
- **Gestion d'état :** Local pour composant, global pour application
- **Routing :** Structure claire et navigation intuitive

### Sécurité
- **Validation :** Toutes les entrées utilisateur validées
- **Chiffrement :** Données sensibles chiffrées localement
- **Isolation :** Aucune fuite de données vers l'extérieur
- **Audit :** Logging des actions sensibles

## 🚀 Déploiement

### Netlify
- **Build command :** `npm run build`
- **Publish directory :** `dist`
- **Environment :** Variables d'environnement dans Netlify

### Pré-déploiement
- [ ] Tests de compilation passent
- [ ] Build de production réussi
- [ ] Vérification des exports
- [ ] Test des fonctionnalités critiques

## 📚 Ressources et références

### Documentation officielle
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

### Prestations gouvernementales canadiennes
- [SRG (GIS)](https://www.canada.ca/fr/services/prestations/pensionspubliques/prestations-vieillesse/supplement-revenu-garanti.html)
- [RRQ/CPP](https://www.rrq.gouv.qc.ca/)
- [SV (OAS)](https://www.canada.ca/fr/services/prestations/pensionspubliques/prestations-vieillesse.html)

### Architecture et patterns
- [React Patterns](https://reactpatterns.com/)
- [TypeScript Best Practices](https://github.com/typescript-eslint/typescript-eslint)
- [Tailwind Best Practices](https://tailwindcss.com/docs/guides/best-practices)

---

*AGENTS.md créé pour MonPlanRetraite.ca - Dernière mise à jour : 27 août 2025*
