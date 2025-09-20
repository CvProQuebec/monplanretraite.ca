# Changelog - MonPlanRetraite.ca

Toutes les modifications importantes de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Non publié] - 2025-09-06

### ✅ Ajouté
- **Nouvelles fréquences pour revenus de location**
  - Support pour chalet et AirBnb avec options `weekend`, `weekly`, `monthly`
  - Calculs spécialisés : weekend (~4.33/mois), semaine (~4.33/mois), mensuel (direct)
  - Interface adaptée avec sélecteur de fréquence pour Personne 1 et 2

- **Documentation complète du projet**
  - `CLAUDE.md` : Guide de référence pour modifications futures
  - `architecture.md` : Documentation technique complète de l'architecture
  - `app_info/` : Dossier de suivi des implémentations avec workflow obligatoire

- **Workflow de documentation obligatoire**
  - Processus avant/après implémentation avec fichiers datés
  - Suivi des fonctionnalités implémentées vs en attente
  - Critères de succès et validation des changements

### 🔧 Corrigé
- **Bug critique calcul emplois saisonniers**
  - Problème : 600$/mois sur 2 mois affichait 1800$ au lieu de 1200$
  - Cause : Problème de fuseau horaire avec `new Date('YYYY-MM-DD')`
  - Solution : Parsing manuel des dates en local avec `new Date(year, month-1, day)`
  - Impact : Calculs précis pour tous les emplois saisonniers

- **Positionnement erroné des menus déroulants**
  - Problème : Menus s'affichaient en haut de page ou mal positionnés
  - Solution : Remplacement `position="popper"` par `position="item-aligned"`
  - Ajout : Propriétés `side="bottom"`, `avoidCollisions={false}`, z-index élevé
  - Statut : Partiellement résolu, surveillance continue nécessaire

### 🏗️ Modifié
- **Interface `IncomeEntry`** étendue avec champs revenus de location
  - `rentalAmount` : Montant par période de location
  - `rentalFrequency` : Fréquence weekend/weekly/monthly
  - `rentalStartDate`/`rentalEndDate` : Saisons (optionnel)
  - `rentalType` : Type de propriété (chalet/airbnb/appartement/autre)

- **Logique de calcul `GlobalSummary.tsx`**
  - Séparation des calculs travail autonome vs revenus de location
  - Ajout de calculs spécialisés par fréquence de location
  - Amélioration des logs de debug pour traçabilité

- **Composant `SeniorsFriendlyIncomeTable.tsx`**
  - Nouveau sélecteur `rentalFrequencies` avec labels explicites
  - Gestion des valeurs par défaut pour nouveaux types
  - Correction de tous les `SelectContent` pour positionnement stable

## [1.3.0] - 2025-09-20

### ✅ Ajouté
- Assistant Optimisations (Greedy v1 + DP/Beam v2) avec progression en temps réel (Web Worker)
- Monte Carlo (aperçu 1000+ itérations) avec probabilité de succès, P5/P50/P95 et drawdown max
- Stress Test (séquence -30%/-15%, choc inflation +8% x 2, longévité +5 ans) avec scores 0–100
- Export PDF “Optimisation (résumé robuste)” incluant Monte Carlo et Stress Test lorsque disponibles
- Gating par forfait (Free/Pro/Expert) dans l’assistant et Prestations (OAS/GIS, SRG, RREGOP)

### 🏗️ Modifié
- WizardPage: branchement de l’étape “optimisations” et finalisation de l’onglet “rapports” (bouton “Exporter (optimisation)”)
- ResultsWizardStep: ajout CTA “Aller à Optimisations” si aucun plan; export “Optimisation” si un plan est disponible

### 🔧 Qualité/Perf
- Calculs lourds déportés en Web Workers (DP/Beam, Monte Carlo)
- Mise en cache locale mpr-last-optimization (consommée par Plan/Rapports)
- Accessibilité seniors (labels/titles) et support bilingue FR/EN

### 🔒 Sécurité
- 100% local (aucune transmission réseau)

## [En cours de développement]

### 🚧 Problèmes connus
- **Menus déroulants** : Positionnement encore instable dans certains cas
  - Impact : Affichage incorrect pour 2e entrée Personne 1 et 1re entrée Personne 2
  - Solutions envisagées : Select HTML natif ou composant dropdown personnalisé

### ⏳ Fonctionnalités prévues
- Tests unitaires pour nouveaux calculs de revenus de location
- Tests end-to-end pour validation interface seniors
- Migration des données utilisateur vers nouvelle structure (si nécessaire)
- Optimisation performance pour calculs temps réel

## [Historique antérieur - 2024]

### Fonctionnalités principales implémentées
- **Interface seniors-friendly**
  - Grandes polices, contrastes élevés, navigation simplifiée
  - Composants adaptés avec `SeniorsFriendlyIncomeTable`
  - Système de tooltips et aide contextuelle

- **Calculs financiers avancés**
  - Intégration standards IPF 2025 (inflation 2.1%, rendements variables)
  - Service Monte Carlo pour simulations probabilistes
  - Optimisation RRQ/CPP avec projections à 70 ans

- **Gestion multi-personnes**
  - Support complet pour couples avec revenus séparés
  - Agrégation dans "Résumé familial" temps réel
  - Synchronisation des calculs Personne 1 et 2

- **Types de revenus complets**
  - Salaires réguliers et emplois saisonniers avec dates
  - Prestations gouvernementales (RRQ, SV, AE) 
  - Rentes privées et viagères
  - Investissements (REER, CELI, CRI)
  - Travail autonome et autres revenus

- **Persistance robuste**
  - Triple sauvegarde : Session + LocalStorage + Fichiers
  - Migration automatique des formats de données
  - Récupération avec fallbacks multiples

- **Spécificités canadiennes**
  - Calculs RRQ/CPP selon tables officielles
  - Sécurité de la vieillesse avec gestion biannuelle
  - Support RREGOP, CCQ et autres régimes gouvernementaux
  - Interface bilingue français/anglais

---

## Format des versions

- **[Non publié]** : Changements en développement
- **[X.Y.Z]** : Version publiée (Semantic Versioning)
- **Date** : Format YYYY-MM-DD

## Types de changements

- **✅ Ajouté** : Nouvelles fonctionnalités
- **🔧 Corrigé** : Corrections de bugs
- **🏗️ Modifié** : Changements aux fonctionnalités existantes
- **🗑️ Supprimé** : Fonctionnalités retirées
- **🚧 Déprécié** : Fonctionnalités qui seront supprimées
- **🔒 Sécurité** : Corrections de vulnérabilités

---

*Pour plus de détails sur chaque modification, consulter les fichiers dans `app_info/` et la documentation technique dans `architecture.md`.*
