# 🤖 AGENTS.md - MonPlanRetraite.ca

## 📋 Vue d'ensemble du projet

**MonPlanRetraite.ca** est une plateforme professionnelle de planification financière et de retraite, positionnée comme **l'alternative premium accessible** aux services de conseillers financiers traditionnels coûtant 5 000$ à 10 000$+. L'application est **100% sécurisée** avec des calculs locaux uniquement - aucune transmission réseau des données confidentielles.

### 🎯 Objectifs principaux
- **Démocratiser l'expertise financière** : Rendre accessible à tous une planification de niveau professionnel
- **Éviter les erreurs coûteuses** : Prévenir les erreurs de 10 000$+ communes en planification financière
- **Calculs précis** des prestations gouvernementales canadiennes (RRQ, SV, SRG, RREGOP)
- **Optimisation fiscale avancée** et stratégies de retraite personnalisées
- **Interface moderne et accessible** pour tous les âges et niveaux d'expertise
- **Sécurité maximale** des données personnelles avec chiffrement AES-256-GCM
- **Support bilingue** français/anglais avec normes OQLF strictes

### 💎 **PHILOSOPHIE DE POSITIONNEMENT PREMIUM**

#### **Vision Stratégique**
> **"Pourquoi payer 5 000$ à 10 000$ pour un conseiller financier quand vous pouvez avoir les mêmes outils professionnels pour une fraction du coût ?"**

MonPlanRetraite.ca n'est **PAS un outil "bon marché"** - c'est une **solution professionnelle accessible** qui offre :
- ✅ **75+ fonctionnalités documentées** équivalentes aux outils de conseillers professionnels
- ✅ **Valeur marchande de 5 000$ à 10 000$** pour une fraction du prix
- ✅ **ROI de 94-95%** par rapport aux services traditionnels
- ✅ **Expertise Retraite101** intégrée et validée
- ✅ **Sécurité bancaire** avec données 100% locales

#### **Anti-"Cheap" Messaging**
```typescript
// Messages de positionnement premium
❌ ÉVITER : "Outil gratuit", "Solution économique", "Pas cher"
✅ UTILISER : "Solution professionnelle accessible", "Alternative premium", "Valeur exceptionnelle"

// Justification de valeur
"Une seule erreur de planification peut vous coûter 10 000$+. 
Notre plateforme vous évite ces erreurs pour une fraction de ce coût."
```

#### **Structure Tarifaire Professionnelle**
```typescript
// Tarification basée sur la valeur, pas sur le coût
🆓 GRATUIT : "Découvrez la puissance de nos outils" (3 modules essentiels)
💼 PROFESSIONNEL 297$ : "Planification complète" (9 modules + optimisations)
👑 EXPERT 597$ : "Maîtrise totale" (15 modules + stratégies avancées)

// Comparaison de valeur
Conseiller traditionnel : 5 000$ - 10 000$+
MonPlanRetraite.ca Expert : 597$ (économie de 94-95%)
```

### 📊 **DOCUMENTATION COMPLÈTE DES FONCTIONNALITÉS**

#### **75+ Fonctionnalités Professionnelles Documentées**
MonPlanRetraite.ca offre une suite complète d'outils équivalente aux services de conseillers financiers professionnels :

```typescript
// 15 MODULES COMPLETS DISPONIBLES
🏠 Module Immobilier (5 fonctionnalités)
💰 Module Revenus (8 fonctionnalités)  
📊 Module Budget (12 fonctionnalités)
🏛️ Module RREGOP (6 fonctionnalités)
💼 Module SRG (4 fonctionnalités)
📈 Module Investissements (7 fonctionnalités)
🎯 Module Objectifs (5 fonctionnalités)
📋 Module Rapports (13 fonctionnalités)
🚨 Module Urgence (9 fonctionnalités)
⚖️ Module Fiscal (6 fonctionnalités)
// ... et 5 modules additionnels
```

#### **Valeur Marchande Équivalente : 5 000$ - 10 000$+**
```typescript
// COMPARAISON AVEC SERVICES TRADITIONNELS
Conseiller financier traditionnel:
- Consultation initiale : 1 500$ - 3 000$
- Plan de retraite complet : 2 000$ - 4 000$
- Optimisation fiscale : 1 000$ - 2 000$
- Suivi annuel : 500$ - 1 500$
- TOTAL : 5 000$ - 10 500$

MonPlanRetraite.ca Plan Expert:
- Accès complet à tous les outils : 597$
- ÉCONOMIE : 4 403$ - 9 903$ (88% - 94%)
```

#### **ROI Exceptionnel Documenté**
- ✅ **Plan Professionnel (297$)** : ROI de 94-95% vs conseiller traditionnel
- ✅ **Plan Expert (597$)** : ROI de 88-94% vs conseiller traditionnel
- ✅ **Une seule optimisation fiscale** peut économiser 2 000$+ annuellement
- ✅ **Éviter une erreur de planification** peut sauver 10 000$+

### 🏗️ Architecture technique
- **Frontend :** React 18 + TypeScript + Vite
- **Styling :** Tailwind CSS + composants UI personnalisés
- **État :** React Hooks + Context API
- **Routing :** React Router v6
- **Build :** Vite + TypeScript
- **Déploiement :** Netlify
- **Sécurité :** Chiffrement AES-256-GCM local uniquement

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

## 🎓 MODULES NÉOPHYTES - TRANSFORMATION RÉVOLUTIONNAIRE (Janvier 2025)

### 🌟 **VISION STRATÉGIQUE UNIQUE AU MONDE**

MonPlanRetraite.ca devient **le premier et seul outil au monde** qui combine :
- ✅ **Sécurité bancaire** (données 100% locales avec chiffrement AES-256-GCM)
- ✅ **Expertise Retraite101** (base de connaissances validée et éprouvée)
- ✅ **Pédagogie révolutionnaire** (accompagnement pas-à-pas des néophytes)
- ✅ **Prévention d'erreurs** (système d'alertes intelligent basé sur les 9 erreurs communes)
- ✅ **Intelligence contextuelle** (conseils personnalisés selon le profil utilisateur)
- ✅ **Motivation continue** (gamification douce et encouragements bienveillants)

### 🚀 **IMPLÉMENTATION COMPLÈTE EN COURS**

#### **Phase 1 : Système d'alertes préventives** ⚡ PRIORITÉ CRITIQUE
```typescript
// Services à créer
src/services/ErrorPreventionService.ts     // Détection 9 erreurs budgétaires
src/components/ui/SmartAlerts.tsx          // Composant d'alertes intelligentes

// Fonctionnalités
- Détection budget irréaliste (< 85% dépenses réelles)
- Alerte oubli du conjoint (optimisation fiscale 15-25%)
- Prévention trop d'objectifs simultanés (max 2)
- Validation cohérence globale automatique
```

#### **Phase 2 : Parcours d'onboarding intelligent** 🎯 EN COURS
```typescript
// Services à créer
src/services/OnboardingService.ts          // Progression pédagogique
src/components/ui/OnboardingWizard.tsx     // Assistant interactif

// Parcours en 3 étapes
1. "Comprendre ma situation" (1 semaine)
   - Calculer actif net de base
   - Identifier 3 plus grosses dépenses
   - Fixer UN seul objectif prioritaire

2. "Mon premier budget réaliste" (2-4 semaines)
   - Saisir vraies dépenses dans l'outil
   - Équilibrer revenus/dépenses
   - Identifier 50$ d'économies possibles

3. "Ma stratégie personnalisée" (1 mois)
   - Calculer objectif avec règle du 4%
   - Comparer avec règle du 70%
   - Fixer taux d'épargne cible
```

#### **Phase 3 : Assistant contextuel anti-erreurs** 🧠 PLANIFIÉ
```typescript
// Services à créer
src/services/SmartAdvisorService.ts        // Conseils intelligents

// Fonctionnalités
- Conseil REER vs CELI selon profil (âge, revenu)
- Validation règle 4% vs 70% avec alertes
- Détection profils à risque (retard planification, dettes)
- Recommandations personnalisées urgentes
```

#### **Phase 4 : Gamification et motivation** 🎮 PLANIFIÉ
```typescript
// Services à créer
src/services/GamificationService.ts        // Badges et célébrations

// Système de badges progressifs
🏆 "Premier budget équilibré" (common)
💰 "Épargnant discipliné 10%" (rare)
🛡️ "Matelas de sécurité établi" (epic)
🚀 "Coast FIRE atteint" (legendary)

// Célébrations avec impact réel
- Confettis verts pour premier mois équilibré
- Bouclier qui s'active pour fonds d'urgence
- Fusée qui décolle pour Coast FIRE
```

#### **Phase 5 : Modules d'apprentissage progressif** 📚 PLANIFIÉ
```typescript
// Services à créer
src/services/LearningService.ts            // Formation intégrée
src/components/ui/LearningModule.tsx       // Formation interactive

// Modules disponibles
1. "Finance 101 - Les bases absolues" (30 min)
   - Comprendre l'intérêt composé
   - Différencier épargne et investissement
   - Connaître l'impact de l'inflation

2. "Mon premier budget réaliste" (45 min)
   - Méthode 50-20-30 expliquée
   - Calculateur interactif
   - Quiz de validation
```

#### **Phase 6 : Intégration complète** 🎯 DÉPLOIEMENT
```typescript
// Modifications des pages existantes
src/pages/Budget.tsx                       // + SmartAlerts + OnboardingWizard
src/pages/Revenus.tsx                      // + SmartAdvisor + LearningModule

// Intégration transparente
- Alertes contextuelles selon les données
- Onboarding pour nouveaux utilisateurs
- Conseils personnalisés en temps réel
- Formation accessible depuis toutes les pages
```

### 📅 **CALENDRIER DE DÉPLOIEMENT ACCÉLÉRÉ**

#### **Semaines 1-2 : Fondations critiques** ⚡
- [x] Analyse documents Claude terminée
- [x] Plan d'implémentation créé
- [ ] ErrorPreventionService.ts
- [ ] SmartAlerts.tsx
- [ ] Intégration page Budget
- [ ] Tests validation alertes

#### **Semaines 3-4 : Onboarding intelligent** 🎓
- [ ] OnboardingService.ts
- [ ] OnboardingWizard.tsx
- [ ] Intégration toutes pages principales
- [ ] Tests parcours utilisateur complet

#### **Semaines 5-6 : Intelligence contextuelle** 🧠
- [ ] SmartAdvisorService.ts
- [ ] Intégration conseils dans Revenus
- [ ] Tests recommandations personnalisées
- [ ] Validation calculs REER/CELI

#### **Semaines 7-8 : Gamification motivante** 🎮
- [ ] GamificationService.ts
- [ ] Système badges et célébrations
- [ ] Tests motivation utilisateur
- [ ] Validation progression

#### **Semaines 9-10 : Formation intégrée** 📚
- [ ] LearningService.ts
- [ ] LearningModule.tsx
- [ ] Contenu pédagogique complet
- [ ] Tests apprentissage interactif

#### **Semaines 11-12 : Finalisation et lancement** 🚀
- [ ] Intégration complète testée
- [ ] Tests utilisateurs finaux
- [ ] Optimisations performance
- [ ] Documentation complète
- [ ] **LANCEMENT PUBLIC**

### 🎯 **AVANTAGES CONCURRENTIELS UNIQUES**

#### **Positionnement mondial unique**
> **"Le seul outil au monde qui transforme n'importe qui en expert de sa propre retraite"**

#### **Différenciation absolue**
1. **Sécurité absolue** : Aucune transmission de données financières
2. **Expertise québécoise** : Base de connaissances Retraite101 intégrée
3. **Pédagogie révolutionnaire** : Du néophyte complet à l'expert
4. **Prévention intelligente** : Évite les 9 erreurs communes automatiquement
5. **Accompagnement bienveillant** : Motivation et encouragements constants

#### **Impact transformationnel**
- **Avant :** Site technique excellent mais intimidant pour néophytes
- **Après :** Outil accessible à tous, du débutant complet à l'expert financier
- **Résultat :** N'importe qui peut prendre le contrôle total de sa retraite

### 🛠️ **DIRECTIVES TECHNIQUES SPÉCIFIQUES**

#### **Architecture des nouveaux modules**
```typescript
// Structure standardisée
src/services/
├── ErrorPreventionService.ts      // Détection erreurs communes
├── OnboardingService.ts           // Progression pédagogique
├── SmartAdvisorService.ts         // Conseils intelligents
├── GamificationService.ts         // Badges et motivation
└── LearningService.ts             // Formation intégrée

src/components/ui/
├── SmartAlerts.tsx                // Alertes contextuelles
├── OnboardingWizard.tsx           // Assistant progression
└── LearningModule.tsx             // Formation interactive
```

#### **Intégration avec l'existant**
```typescript
// Pages à modifier
src/pages/Budget.tsx               // + Alertes + Onboarding
src/pages/Revenus.tsx              // + Conseils + Formation
src/pages/MaRetraite.tsx           // + Gamification

// Hooks à utiliser
useRetirementData()                // Données utilisateur
useLanguage()                      // Support bilingue
useSecureStorage()                 // Stockage sécurisé
```

#### **Sécurité renforcée**
```typescript
// Règles strictes maintenues
- ❌ AUCUNE transmission réseau des données néophytes
- ❌ AUCUN tracking des erreurs utilisateur
- ✅ Calculs 100% locaux pour tous les conseils
- ✅ Chiffrement local des données d'apprentissage
- ✅ Validation stricte de toutes les entrées
```

### 🎓 **PHILOSOPHIE PÉDAGOGIQUE INTÉGRÉE**

#### **Principe central**
> **"Votre retraite, c'est votre histoire. On travaille avec vos moyens, pas avec des rêves inaccessibles."**

#### **Messages adaptatifs selon niveau**
```typescript
// Néophyte complet
"Félicitations ! Vous venez de faire le premier pas vers votre liberté financière."

// Utilisateur intermédiaire  
"Excellent progrès ! Vous maîtrisez maintenant les bases de la planification."

// Utilisateur avancé
"Votre stratégie est solide. Voici des optimisations avancées personnalisées."
```

#### **Validation inclusive**
```typescript
// Éviter les jugements
❌ "Votre épargne est insuffisante"
✅ "Chaque dollar épargné vous rapproche de votre objectif"

❌ "Vous êtes en retard dans votre planification"  
✅ "Il n'est jamais trop tard pour commencer. Voici votre plan personnalisé."
```

### 📊 **MÉTRIQUES DE SUCCÈS ATTENDUES**

#### **Engagement utilisateur**
- **Taux de complétion onboarding** : Objectif 85%+
- **Temps moyen sur site** : Augmentation 200%+
- **Retour utilisateurs** : Objectif 90%+ satisfaction
- **Réduction abandons** : Objectif -70% vs version actuelle

#### **Impact pédagogique**
- **Utilisateurs complétant formation** : Objectif 60%+
- **Badges obtenus par utilisateur** : Moyenne 3+ badges
- **Erreurs évitées** : Objectif 80%+ des erreurs communes
- **Conseils suivis** : Objectif 70%+ des recommandations

#### **Performance technique**
- **Temps de chargement** : < 2 secondes toutes pages
- **Compatibilité mobile** : 100% fonctionnalités
- **Sécurité** : 0 transmission de données sensibles
- **Stabilité** : 99.9% uptime

## 📊 SYSTÈME DE RAPPORTS UNIFIÉ - CONSOLIDATION COMPLÈTE (Août 2025)

### 🎯 **ARCHITECTURE UNIFIÉE DES RAPPORTS**

MonPlanRetraite.ca dispose désormais d'un **système de rapports consolidé et sécurisé** qui remplace 4 systèmes dupliqués par une architecture unifiée avec restrictions par plan d'abonnement.

#### **Services Centralisés**
```typescript
// Architecture consolidée
src/services/reports/
├── UnifiedReportManager.ts       // Interface unifiée pour tous les rapports
├── ReportMetadataService.ts      // Métadonnées, logos et disclaimers
└── ReportExportService.ts        // Exports multi-formats (MD, JSON, HTML, TXT)

// Service principal étendu
src/features/retirement/services/UltimatePlanningService.ts
// Support de 9 types de rapports professionnels
```

#### **13 Types de Rapports Disponibles**
```typescript
// Distribution par plan d'abonnement
🆓 PLAN GRATUIT (3 rapports)
├── 'emergency'           // Plan d'urgence familial
├── 'financial_planning'  // Planification financière de base
└── 'banking'            // Préparation bancaire

💼 PLAN PROFESSIONNEL (9 rapports - inclut gratuit)
├── 'notaire'            // Préparation notariale
├── 'avocat'             // Préparation juridique
├── 'conseiller'         // Conseiller financier
├── 'assureur'           // Préparation assurance
├── 'fiscal'             // Optimisation fiscale
└── 'real_estate'        // Immobilier et succession

👑 PLAN EXPERT (13 rapports - inclut tous)
├── 'comprehensive_medical'    // Dossier médical complet
├── 'funeral_wishes'          // Volontés funéraires
├── 'evacuation_checklist'    // Plan d'évacuation
└── 'death_checklist'         // Liste de vérification décès
```

### 🔒 **SÉCURITÉ ET CONFORMITÉ CLAUDE AUDIT**

#### **Chiffrement et Protection des Données**
```typescript
// Sécurité renforcée pour tous les rapports
- ✅ Chiffrement AES-256-GCM pour données personnelles
- ✅ Clés dérivées PBKDF2 (100,000 itérations)
- ✅ Calculs 100% locaux (aucune transmission réseau)
- ✅ Stockage local sécurisé uniquement
- ✅ Validation stricte de toutes les entrées
```

#### **Disclaimers Légaux Intégrés**
```typescript
// Avertissements automatiques dans tous les rapports
static addLegalDisclaimers(reportType: string, userName?: string): string {
  return `
## ⚖️ Avertissements Légaux

**Clause de non-responsabilité :**
Ces outils ne constituent pas des conseils financiers, juridiques ou fiscaux. 
Consultez un professionnel qualifié pour des conseils personnalisés.

**Usage personnel uniquement :**
Les produits sont offerts pour usage personnel seulement; 
ils ne peuvent être revendus ou redistribués, en partie ou en totalité.

**Confidentialité des données :**
Toutes vos données restent sur votre appareil et ne sont jamais transmises.
  `;
}
```

### 🎛️ **INTERFACE UNIFIÉE ET RESTRICTIONS**

#### **Gestion des Permissions par Plan**
```typescript
// Contrôle d'accès automatique
static canGenerateReport(reportType: ReportType, userPlan: PlanType): boolean {
  const planRestrictions = {
    'gratuit': ['emergency', 'financial_planning', 'banking'],
    'professionnel': [
      'emergency', 'financial_planning', 'banking',
      'notaire', 'avocat', 'conseiller', 'assureur', 'fiscal', 'real_estate'
    ],
    'expert': [/* tous les 13 types */]
  };
  
  return planRestrictions[userPlan]?.includes(reportType) ?? false;
}
```

#### **Génération Unifiée avec Métadonnées**
```typescript
// Interface standardisée pour tous les rapports
static async generateReport(
  options: ReportGenerationOptions, 
  userPlan: PlanType
): Promise<ReportGenerationResult> {
  
  // 1. Vérification des permissions
  if (!this.canGenerateReport(options.reportType, userPlan)) {
    return { success: false, error: 'Plan insuffisant' };
  }
  
  // 2. Génération avec métadonnées sécurisées
  const metadata = ReportMetadataService.generateStandardMetadata(
    options.confidentialityLevel,
    options.userId
  );
  
  // 3. Export multi-format automatique
  const exportResult = ReportExportService.exportToMarkdown(
    reportContent, 
    options.title,
    options.reportType
  );
  
  return { success: true, data: exportResult };
}
```

### 📋 **TYPES DE RAPPORTS SPÉCIALISÉS**

#### **Rapports Professionnels (Plans Professionnel/Expert)**
```typescript
// Checklists spécialisées par type de professionnel
'notaire': {
  category: 'légal',
  checklist: [
    'Testament et codicilles à jour',
    'Procurations (personne et biens)',
    'Régime matrimonial documenté',
    'Biens immobiliers et hypothèques',
    'Planification successorale optimisée'
  ]
}

'fiscal': {
  category: 'fiscal', 
  checklist: [
    'Stratégie REER/CELI optimisée',
    'Fractionnement de revenus planifié',
    'Déductions et crédits maximisés',
    'Planification de décaissement',
    'Optimisation fiscale succession'
  ]
}
```

#### **Rapports d'Urgence (Tous Plans)**
```typescript
'emergency': {
  category: 'urgence',
  checklist: [
    'Contacts d\'urgence à jour',
    'Documents importants accessibles',
    'Comptes bancaires et mots de passe',
    'Assurances et bénéficiaires',
    'Plan de communication familial'
  ]
}
```

### 🚀 **EXPORTS MULTI-FORMATS AUTOMATIQUES**

#### **Formats Supportés**
```typescript
// Exports automatiques avec téléchargement
- 📝 Markdown (.md) - Format principal avec mise en forme
- 📊 JSON (.json) - Données structurées pour import/export
- 🌐 HTML (.html) - Version web avec styles MonPlanRetraite
- 📄 TXT (.txt) - Version texte simple pour impression
```

#### **Métadonnées Automatiques**
```typescript
// Ajout automatique dans tous les exports
- 🏢 Logo et branding MonPlanRetraite.ca
- 📅 Date et heure de génération
- 👤 Niveau de confidentialité (personnel/conseiller/professionnel)
- 🔒 Résumé de sécurité des données
- ⚖️ Disclaimers légaux complets
- 📋 Sommaire exécutif du rapport
```

### 🔄 **MIGRATION ET CONSOLIDATION**

#### **Systèmes Remplacés**
```typescript
// AVANT - 4 systèmes dupliqués
❌ src/services/ProfessionalReportGenerator.ts (redondant)
❌ Rapports dispersés dans différents composants
❌ Métadonnées et exports dupliqués
❌ Aucune restriction par plan

// APRÈS - Architecture unifiée
✅ UnifiedReportManager.ts - Interface unique
✅ ReportMetadataService.ts - Métadonnées centralisées  
✅ ReportExportService.ts - Exports standardisés
✅ UltimatePlanningService.ts - Étendu pour 9 types
✅ Restrictions par plan automatiques
```

#### **Composants à Migrer (Optionnel)**
```typescript
// Migration recommandée
src/components/ui/ProfessionalReportManager.tsx
// → Utiliser UnifiedReportManager au lieu de ProfessionalReportGenerator

// Nettoyage optionnel
src/services/ProfessionalReportGenerator.ts
// → Peut être supprimé (fonctionnalité migrée)
```

### 📈 **AVANTAGES DE LA CONSOLIDATION**

#### **Technique**
- ✅ **Réduction de 75%** du code dupliqué
- ✅ **Interface unifiée** pour tous les rapports
- ✅ **Sécurité renforcée** avec chiffrement AES-256-GCM
- ✅ **Exports standardisés** multi-formats
- ✅ **Métadonnées cohérentes** sur tous les rapports

#### **Business**
- ✅ **Monétisation claire** avec 3 tiers (3/9/13 rapports)
- ✅ **Évolutivité** facile pour nouveaux types
- ✅ **Conformité légale** automatique
- ✅ **Branding cohérent** MonPlanRetraite.ca
- ✅ **Expérience utilisateur** unifiée

#### **Sécurité**
- ✅ **Conformité Claude Audit** complète
- ✅ **Données 100% locales** sans transmission
- ✅ **Chiffrement bout-en-bout** des informations sensibles
- ✅ **Validation stricte** de toutes les entrées
- ✅ **Disclaimers légaux** automatiques

### 🎯 **UTILISATION POUR LES DÉVELOPPEURS**

#### **Génération Simple**
```typescript
import { UnifiedReportManager } from '@/services/reports/UnifiedReportManager';

// Générer un rapport avec vérification automatique des permissions
const result = await UnifiedReportManager.generateReport({
  reportType: 'notaire',
  title: 'Préparation Notariale - Succession',
  emergencyData: userData,
  confidentialityLevel: 'professional',
  userId: user.id
}, userPlan);

if (result.success) {
  // Téléchargement automatique du rapport
  ReportExportService.downloadReport(result.data);
}
```

#### **Vérification des Permissions**
```typescript
// Vérifier si l'utilisateur peut générer un type de rapport
const canGenerate = UnifiedReportManager.canGenerateReport('fiscal', 'professionnel');
if (!canGenerate) {
  // Afficher modal d'upgrade ou message d'erreur
}
```

---

*AGENTS.md mis à jour pour MonPlanRetraite.ca - Dernière mise à jour : 28 août 2025*
*Section Système de Rapports Unifié ajoutée - Consolidation complète déployée*
*Architecture sécurisée et conforme aux exigences Claude Audit*
