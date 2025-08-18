# Améliorations du Module Retraite

## Vue d'ensemble

Le module Retraite a été restructuré pour offrir une meilleure expérience utilisateur avec une séparation claire entre la page d'entrée et le module complet.

## Structure des pages

### 1. Page d'entrée (`/fr/retraite` et `/en/retirement`)
- **Connexion avec Google** : Section principale pour l'authentification
- **Tableau comparatif des plans** : Comparaison détaillée des fonctionnalités par forfait
  - Plan Gratuit (Free)
  - Plan Professionnel (Professional) 
  - Plan Ultime (Ultimate)
- **Call to Action** : Bouton pour accéder au module complet après connexion

### 2. Module complet (`/fr/retraite-module` et `/en/retirement-module`)
- **Sous-menu intégré** : Navigation entre toutes les sections du module
- **Fonctionnalités complètes** : Accès à tous les outils de planification
- **Gestion des plans** : Restrictions basées sur le forfait de l'utilisateur

### 3. Page Sauvegarde et Sécurité (`/fr/sauvegarde-securite` et `/en/backup-security`)
- **Page dédiée** : Contenu spécialisé sur la sécurité des données
- **Conseils détaillés** : Bonnes pratiques et recommandations
- **Checklist de sécurité** : Vérification des bonnes pratiques
- **Navigation retour** : Lien vers le module principal

## Fonctionnalités par plan

### Plan Gratuit ✅
- Profil personnel et données de base
- Calculs de retraite de base
- Gestion des économies
- Module d'urgence
- Gestion des sessions

### Plan Professionnel ✅
- Toutes les fonctionnalités du plan gratuit
- Analyse du flux de trésorerie (Cashflow)
- Calculs CPP et RRQ
- Optimisation fiscale
- Simulateur Monte Carlo
- Génération de rapports

### Plan Ultime ✅
- Toutes les fonctionnalités du plan professionnel
- Planification successorale avancée
- Collaboration et partage
- Simulations financières avancées

## Navigation et UX

### Barre de navigation
- **Sections internes** : Navigation directe dans le module
- **Liens externes** : Accès aux pages dédiées (ex: Sauvegarde & Sécurité)
- **Indicateurs visuels** : Icônes et badges pour identifier les types de contenu

### Flux utilisateur
1. **Arrivée** : Page d'entrée avec présentation et connexion
2. **Connexion** : Authentification Google obligatoire
3. **Accès** : Redirection vers le module complet
4. **Navigation** : Sous-menu intégré pour toutes les sections
5. **Pages spécialisées** : Accès aux contenus dédiés

## Composants créés/modifiés

### Nouvelles pages
- `RetraiteFr.tsx` - Page d'entrée française
- `RetraiteEn.tsx` - Page d'entrée anglaise
- `RetraiteModuleFr.tsx` - Module complet français
- `RetraiteModuleEn.tsx` - Module complet anglais
- `SauvegardeSecuriteFr.tsx` - Page sécurité française
- `BackupSecurityEn.tsx` - Page sécurité anglaise

### Composants modifiés
- `NavigationBar.tsx` - Ajout des liens externes
- `RetirementApp.tsx` - Suppression de la section backup-security
- `App.tsx` - Ajout des nouvelles routes

## Routes configurées

```typescript
// Pages d'entrée
/fr/retraite → RetraiteFr
/en/retirement → RetraiteEn

// Modules complets
/fr/retraite-module → RetraiteModuleFr
/en/retirement-module → RetraiteModuleEn

// Pages spécialisées
/fr/sauvegarde-securite → SauvegardeSecuriteFr
/en/backup-security → BackupSecurityEn
```

## Avantages de cette restructuration

1. **Séparation des responsabilités** : Page d'entrée vs module fonctionnel
2. **Meilleure conversion** : Présentation claire des avantages avant connexion
3. **Navigation intuitive** : Sous-menu intégré dans le module
4. **Contenu spécialisé** : Pages dédiées pour des sujets spécifiques
5. **Expérience utilisateur** : Flux logique et progression naturelle
6. **Maintenance** : Structure modulaire et composants réutilisables

## Utilisation

### Pour les utilisateurs
1. Visiter la page d'entrée pour découvrir les fonctionnalités
2. Se connecter avec Google pour accéder au module
3. Utiliser le sous-menu pour naviguer dans le module
4. Accéder aux pages spécialisées via les liens externes

### Pour les développeurs
1. Modifier les pages d'entrée dans `src/pages/`
2. Ajuster le module dans `src/features/retirement/`
3. Ajouter de nouvelles sections dans `NavigationBar.tsx`
4. Créer des pages dédiées pour du contenu spécialisé

## Maintenance et évolutions

### Ajout de nouvelles fonctionnalités
1. Créer la page dédiée si nécessaire
2. Ajouter la route dans `App.tsx`
3. Mettre à jour la navigation si intégrée au module
4. Documenter les changements

### Modifications du tableau comparatif
1. Éditer les pages d'entrée (`RetraiteFr.tsx` et `RetraiteEn.tsx`)
2. Maintenir la cohérence entre les versions FR/EN
3. Vérifier l'alignement avec les restrictions de plan

### Ajout de nouvelles sections
1. Créer le composant de section
2. L'ajouter à `NavigationBar.tsx`
3. L'intégrer dans `RetirementApp.tsx`
4. Mettre à jour les types et traductions
