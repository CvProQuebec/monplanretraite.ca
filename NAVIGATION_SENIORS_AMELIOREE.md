# Navigation Seniors Améliorée - Regroupement par Thématiques

## 🎯 CONCEPT AMÉLIORÉ : PAGES UNIFIÉES AVEC SECTIONS

Excellente suggestion ! Regrouper les éléments similaires sur des pages unifiées avec des sections distinctes simplifie énormément l'expérience utilisateur pour les seniors.

## 📋 NOUVELLE STRUCTURE PROPOSÉE

### 1. **🏠 ACCUEIL**
- Vue d'ensemble générale
- Progression globale
- Prochaines étapes recommandées
- Aide et support rapide

### 2. **👤 MON PROFIL**
- **Section A : Informations personnelles**
  - Âge, situation familiale
  - État de santé général
  - Lieu de résidence
  
- **Section B : Objectifs de retraite**
  - Âge souhaité de retraite
  - Style de vie désiré
  - Projets spéciaux
  
- **Section C : Contacts d'urgence**
  - Famille proche
  - Professionnels (médecin, notaire)
  - Directives médicales

### 3. **💰 MA RETRAITE** *(Page unifiée avec 3 sections)*

#### **Section A : MES ACTIFS ET REVENUS** 🏦
*Tout regroupé sur une même page avec onglets/sections*
- **Revenus d'emploi actuels**
  - Salaire, bonus, avantages
  - Régimes de pension d'employeur
  
- **Épargne et investissements**
  - REER, CELI, comptes épargne
  - Portefeuille d'investissement
  - Autres placements
  
- **Immobilier et biens**
  - Résidence principale
  - Propriétés locatives
  - Autres biens de valeur
  
- **Revenus gouvernementaux**
  - CPP/RRQ (calculé automatiquement)
  - Pension de la Sécurité de la vieillesse
  - Autres prestations

#### **Section B : MES DÉPENSES ET BUDGET** 💳
*Tout regroupé sur une même page avec sous-sections*
- **Budget mensuel de base**
  - Logement (hypothèque/loyer, taxes, assurances)
  - Alimentation et produits essentiels
  - Transport et carburant
  - Services publics (électricité, téléphone, internet)
  
- **Dépenses annuelles**
  - Assurances (vie, santé, auto)
  - Entretien maison/auto
  - Vacances et loisirs
  - Vêtements et équipement
  
- **Dépenses saisonnières/occasionnelles**
  - Chauffage hivernal
  - Entretien piscine/jardin
  - Cadeaux et fêtes
  - Réparations imprévues
  
- **Dépenses spéciales retraite**
  - Soins de santé supplémentaires
  - Aide à domicile
  - Modifications du logement
  - Loisirs et voyages

#### **Section C : MES CALCULS DE RETRAITE** 📊
- **Quand prendre ma retraite ?**
  - Simulateur d'âge optimal
  - Impact sur les revenus
  
- **Combien j'aurai par mois ?**
  - Revenus totaux projetés
  - Comparaison avec dépenses
  
- **Mon plan personnalisé**
  - Recommandations adaptées
  - Ajustements suggérés

### 4. **📊 MES RÉSULTATS**
- **Section A : Mon plan de retraite**
  - Résumé visuel simple
  - Graphiques faciles à comprendre
  
- **Section B : Mes rapports**
  - Version imprimable
  - Partage avec conseillers
  
- **Section C : Sauvegarde**
  - Sauvegarder mes données
  - Charger une session précédente

## 🎨 AVANTAGES DE CETTE APPROCHE

### ✅ **Pour les seniors :**
1. **Moins de navigation** - 4 pages principales au lieu de 9+
2. **Logique intuitive** - Tout ce qui concerne les revenus ensemble
3. **Moins de confusion** - Pas besoin de chercher où est quoi
4. **Progression naturelle** - Profil → Retraite → Résultats

### ✅ **Organisation thématique :**
- **Actifs/Revenus** : Tout l'argent qui rentre
- **Dépenses/Budget** : Tout l'argent qui sort
- **Calculs** : Les résultats et projections

### ✅ **Navigation simplifiée :**
```
Page "MA RETRAITE" avec 3 onglets visibles :
┌─────────────────────────────────────────────────────┐
│  💰 MA RETRAITE                                     │
├─────────────────────────────────────────────────────┤
│  [🏦 MES REVENUS]  [💳 MES DÉPENSES]  [📊 CALCULS]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Contenu de la section active                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 📱 MISE EN ŒUVRE TECHNIQUE

### **Structure des pages unifiées :**

#### **Page "MA RETRAITE" avec sections :**
```typescript
const retirementSections = [
  {
    id: 'revenus',
    title: 'MES REVENUS ET ACTIFS',
    icon: '🏦',
    subsections: [
      'Emploi actuel',
      'Épargne et REER',
      'Immobilier',
      'Pensions gouvernementales'
    ]
  },
  {
    id: 'depenses',
    title: 'MES DÉPENSES ET BUDGET',
    icon: '💳',
    subsections: [
      'Budget mensuel',
      'Dépenses annuelles',
      'Dépenses saisonnières',
      'Soins de santé'
    ]
  },
  {
    id: 'calculs',
    title: 'MES CALCULS',
    icon: '📊',
    subsections: [
      'Âge de retraite',
      'Revenus mensuels',
      'Plan personnalisé'
    ]
  }
];
```

### **Navigation interne avec ancres :**
- Boutons pour passer d'une section à l'autre
- Barre de progression pour montrer où on est
- Bouton "Retour au sommaire" toujours visible

## 🔄 PARCOURS UTILISATEUR OPTIMISÉ

### **Flux naturel :**
1. **ACCUEIL** → "Commencer ma planification"
2. **MON PROFIL** → Remplir mes informations de base
3. **MA RETRAITE** → 
   - Étape 1 : Saisir mes revenus et actifs
   - Étape 2 : Définir mes dépenses et budget
   - Étape 3 : Voir mes calculs et recommandations
4. **MES RÉSULTATS** → Consulter et sauvegarder mon plan

### **Navigation intuitive :**
- Chaque page a un objectif clair
- Les sections sont logiquement organisées
- Progression visible à tout moment
- Possibilité de revenir en arrière facilement

## 💡 EXEMPLE CONCRET : PAGE "MA RETRAITE"

```
┌─────────────────────────────────────────────────────────────┐
│                    💰 MA RETRAITE                           │
│              Planifions ensemble votre avenir               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Progression: [████████░░] 80% complété                     │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │🏦 MES REVENUS│ │💳 MES DÉPENSES│ │📊 CALCULS   │           │
│  │   ET ACTIFS  │ │  ET BUDGET   │ │             │           │
│  │              │ │              │ │             │           │
│  │ ✅ Complété  │ │ ⏳ En cours   │ │ ⏸️ En attente│           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
│  [Section active affichée ici avec sous-sections]          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 💳 MES DÉPENSES ET BUDGET                           │   │
│  │                                                     │   │
│  │ ▼ Budget mensuel de base                            │   │
│  │   • Logement: _____ $/mois                          │   │
│  │   • Alimentation: _____ $/mois                      │   │
│  │   • Transport: _____ $/mois                         │   │
│  │                                                     │   │
│  │ ▼ Dépenses annuelles                                │   │
│  │   • Assurances: _____ $/an                          │   │
│  │   • Vacances: _____ $/an                            │   │
│  │                                                     │   │
│  │ [Continuer] [Retour] [Sauvegarder]                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

Cette approche est parfaite pour les seniors car elle :
- **Réduit la complexité** de navigation
- **Groupe logiquement** les informations similaires
- **Maintient le contexte** sur chaque page
- **Facilite la compréhension** du processus global
- **Évite la dispersion** d'attention

Qu'en pensez-vous de cette structure améliorée ?
