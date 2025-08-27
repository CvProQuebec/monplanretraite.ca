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

### 👁️ **Règles d'Accessibilité pour Utilisateurs Seniors**
- **Contraste élevé** : Fond blanc pur pour les modals et formulaires
- **Taille de police** : Minimum 16px pour tous les textes
- **Espacement généreux** : Marges et padding suffisants entre les éléments
- **Isolation visuelle** : Modals avec fond blanc opaque, pas de transparence
- **Icônes claires** : Icônes suffisamment grandes et contrastées
- **Navigation intuitive** : Boutons d'action bien visibles et espacés
- **Feedback visuel** : États actifs et erreurs clairement identifiables
- **Responsive design** : Adaptation optimale pour tous les écrans

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

## 🔄 AUDIT DE CONSOLIDATION EN COURS (Août 2025)

### 📊 État d'avancement de l'optimisation

#### ✅ **PHASE 1 COMPLÉTÉE** - Actions immédiates (Gain rapide, faible risque)
- **1A: Suppression fichiers de test** ✅ TERMINÉ
  - 20+ fichiers `test-*.html` supprimés de la racine
  - Gain d'espace et clarté du projet
  
- **1B: Consolidation documentation** ✅ TERMINÉ  
  - Réduction de 47 → 40 fichiers markdown (-15%)
  - Suppression des doublons de déploiement et navigation
  
- **1C: Optimisation dépendances** ✅ TERMINÉ
  - Suppression de `moment.js` et `@types/moment`
  - Conservation de `date-fns` comme bibliothèque unique

#### 🚧 **PHASE 2 EN COURS** - Consolidation des composants
- **Composants unifiés créés** ✅ TERMINÉ
  - `UnifiedRetirementPhase1.tsx` - Remplace les pages Phase1 Fr/En
  - `UnifiedRetirementEntry.tsx` - Remplace les pages d'entrée Fr/En  
  - `UnifiedRetirementModule.tsx` - ⚠️ EN COURS (problème useLanguage)

- **Pages consolidées** ✅ PARTIELLEMENT TERMINÉ
  - `RetraiteModulePhase1Fr.tsx`: 15 lignes → 3 lignes ✅
  - `RetraiteModulePhase1En.tsx`: 15 lignes → 3 lignes ✅
  - `RetraiteEntreeFr.tsx`: 500+ lignes → 7 lignes ✅
  - `RetraiteEntreeEn.tsx`: 500+ lignes → 7 lignes ✅
  - `RetraiteModuleFr.tsx`: ⏳ À FAIRE
  - `RetraiteModuleEn.tsx`: ⏳ À FAIRE

### 🎯 **PROCHAINES ÉTAPES PRIORITAIRES**

#### 1. **CORRECTION IMMÉDIATE** - useLanguage Hook
```typescript
// PROBLÈME DÉTECTÉ
src/components/retirement/UnifiedRetirementModule.tsx
- [ts Error] Line 5: Cannot find module '@/hooks/useLanguage'

// SOLUTIONS POSSIBLES
Option A: Créer le hook useLanguage manquant
Option B: Utiliser une détection de langue alternative
Option C: Passer la langue en props depuis le parent
```

#### 2. **FINALISER PHASE 2** - Consolidation des modules
```bash
# FICHIERS À TRAITER
src/pages/RetraiteModuleFr.tsx    # 80+ lignes → ~7 lignes
src/pages/RetraiteModuleEn.tsx    # 80+ lignes → ~7 lignes

# APPROCHE RECOMMANDÉE
1. Corriger le problème useLanguage dans UnifiedRetirementModule
2. Remplacer RetraiteModuleFr.tsx par import du composant unifié
3. Remplacer RetraiteModuleEn.tsx par import du composant unifié
4. Tester la compilation et fonctionnalité
```

#### 3. **PHASE 3 PLANIFIÉE** - Optimisations avancées
- **Services consolidation**: Identifier les services dupliqués
- **Routing optimization**: Simplifier les routes redondantes  
- **CSS cleanup**: Supprimer les styles inutilisés
- **Component analysis**: Analyser les composants dans `/features/retirement/`

### 🛠️ **DIRECTIVES TECHNIQUES POUR LA SUITE**

#### **Pattern de Consolidation Établi**
```typescript
// STRUCTURE STANDARD POUR COMPOSANTS UNIFIÉS
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage'; // À CORRIGER

const UnifiedComponent: React.FC = () => {
  const { language } = useLanguage();
  const isFrench = language === 'fr';
  
  // Objet de traductions
  const translations = {
    fr: { /* textes français */ },
    en: { /* textes anglais */ }
  };
  
  const t = translations[isFrench ? 'fr' : 'en'];
  
  // Logique conditionnelle si nécessaire
  if (isFrench) {
    return <FrenchSpecificLogic />;
  }
  
  return <SharedLogic translations={t} />;
};
```

#### **Remplacement des Pages**
```typescript
// AVANT (exemple RetraiteEntreeFr.tsx - 500+ lignes)
import React from 'react';
import { Phase2Wrapper } from '../features/retirement/components/Phase2Wrapper';
// ... 500+ lignes de code dupliqué

// APRÈS (7 lignes)
import React from 'react';
import UnifiedRetirementEntry from '@/components/retirement/UnifiedRetirementEntry';

const RetraiteEntreeFr: React.FC = () => {
  return <UnifiedRetirementEntry />;
};

export default RetraiteEntreeFr;
```

### 📈 **MÉTRIQUES DE SUCCÈS**

#### **Réductions Accomplies**
- **Fichiers test**: 20+ fichiers → 0 fichiers (-100%)
- **Documentation**: 47 → 40 fichiers (-15%)
- **Pages Phase1**: 30 lignes → 6 lignes (-80%)
- **Pages Entry**: 1000+ lignes → 14 lignes (-98.6%)

#### **Objectifs Restants**
- **Pages Module**: 160+ lignes → ~14 lignes (objectif -91%)
- **Composants features/**: Analyse et consolidation à déterminer
- **Services**: Identification des doublons à faire
- **CSS**: Nettoyage des styles inutilisés

### 🚨 **POINTS D'ATTENTION CRITIQUES**

#### **Sécurité et Fonctionnalité**
- ✅ **Préserver toute la logique métier** lors des consolidations
- ✅ **Maintenir la compatibilité** avec le système de sauvegarde/import
- ✅ **Conserver l'isolation des données** sensibles
- ✅ **Tester chaque consolidation** avant de passer à la suivante

#### **Qualité du Code**
- ✅ **Utiliser TypeScript strict** pour tous les nouveaux composants
- ✅ **Maintenir les conventions OQLF** pour les textes français
- ✅ **Respecter l'architecture existante** (hooks, services, types)
- ✅ **Documenter les changements** dans ce fichier AGENTS.md

#### **Performance et UX**
- ✅ **Préserver les optimisations mobiles** existantes
- ✅ **Maintenir l'accessibilité seniors** (contraste, taille police)
- ✅ **Conserver les thèmes dynamiques** et animations
- ✅ **Tester sur différentes résolutions** après chaque changement

### 🎯 **PLAN D'ACTION IMMÉDIAT**

#### **Étape 1: Correction useLanguage (URGENT)**
```bash
# Vérifier l'existence du hook
ls src/hooks/useLanguage*

# Si absent, créer ou utiliser alternative
# Exemple: détection via URL ou props
```

#### **Étape 2: Finaliser UnifiedRetirementModule**
```bash
# Corriger l'import useLanguage
# Tester la compilation
npm run type-check

# Tester le build
npm run build
```

#### **Étape 3: Remplacer les pages restantes**
```bash
# RetraiteModuleFr.tsx → import UnifiedRetirementModule
# RetraiteModuleEn.tsx → import UnifiedRetirementModule
# Tester fonctionnalité complète
```

#### **Étape 4: Validation et documentation**
```bash
# Mettre à jour ce fichier AGENTS.md
# Documenter les gains obtenus
# Planifier Phase 3
```

---

*AGENTS.md créé pour MonPlanRetraite.ca - Dernière mise à jour : 27 août 2025*
*Section Audit de Consolidation ajoutée - État au 27 août 2025 18h03*
---

*AGENTS.md créé pour MonPlanRetraite.ca - Dernière mise à jour : 27 août 2025*
*Section Audit de Consolidation ajoutée - État au 27 août 2025 18h03*
