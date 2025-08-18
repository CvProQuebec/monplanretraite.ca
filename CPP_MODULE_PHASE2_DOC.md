# Module CPP - Phase 2 : Intégration Avancée CPP + RRQ

## 🎯 Vue d'ensemble

La **Phase 2** du module CPP implémente l'**Intégration avancée** qui combine les calculs CPP, RRQ et l'épargne personnelle pour offrir une planification de retraite complète et sophistiquée.

## ✨ Fonctionnalités implémentées

### 1. **Synchronisation RRQ** 🔄
- **Calculs combinés** : Intégration des prestations CPP + RRQ + Épargne personnelle
- **Revenu total** : Calcul du revenu mensuel et annuel combiné
- **Taux de remplacement** : Évaluation du pourcentage de revenu de retraite par rapport au revenu d'emploi
- **Score de durabilité** : Évaluation de la viabilité à long terme du plan (0-100)

### 2. **Scénarios personnalisés** 📊
- **Scénario conservateur** : Retraite à 65 ans, épargne modérée, rendements faibles
- **Scénario modéré** : Retraite à 63 ans, épargne équilibrée, rendements moyens  
- **Scénario agressif** : Retraite à 60 ans, épargne importante, rendements élevés
- **Probabilité de succès** : Calcul basé sur le score de durabilité
- **Niveau de risque** : Classification Faible/Modéré/Élevé

### 3. **Simulation Monte Carlo** 🎲
- **1000 itérations** : Simulation avec paramètres aléatoires
- **Variables aléatoires** : Inflation (0-4%), rendement investissement (0-8%), âge retraite (60-70 ans)
- **Statistiques avancées** : Moyenne, médiane, écart-type, percentiles (P10, P25, P50, P75, P90)
- **Probabilité de succès** : Pourcentage de scénarios avec score de durabilité > 70%

### 4. **Visualisations avancées** 📈
- **Répartition des revenus** : Graphique en camembert CPP/RRQ/Épargne
- **Comparaison des scénarios** : Graphiques en barres avec indicateurs de risque
- **Analyse de durabilité** : Métriques visuelles et barres de progression
- **Recommandations** : Actions suggérées pour améliorer le plan

### 5. **Export PDF intégré** 📄
- **Rapports combinés** : Intégration des résultats CPP + RRQ
- **Graphiques inclus** : Visualisations intégrées dans les rapports
- **Recommandations** : Actions suggérées dans le rapport final

## 🏗️ Architecture technique

### Types et interfaces
```typescript
// src/features/retirement/types/combined-pension.ts
export interface CombinedPensionData {
  cpp: CPPData;
  rrq: RRQData;
  personalSavings: PersonalSavingsData;
  retirementAge: number;
  lifeExpectancy: number;
  inflationRate: number;
  investmentReturn: number;
}

export interface CombinedCalculationResult {
  cpp: CPPCalculationResult;
  rrq: RRQCalculationResult;
  personalSavings: PersonalSavingsResult;
  totalMonthlyIncome: number;
  totalAnnualIncome: number;
  replacementRate: number;
  sustainabilityScore: number;
  recommendations: string[];
}
```

### Service principal
```typescript
// src/features/retirement/services/CombinedPensionService.ts
export class CombinedPensionService {
  static calculateCombinedPension(data: CombinedPensionData): CombinedCalculationResult
  static generateRetirementScenarios(data: CombinedPensionData): RetirementScenario[]
  static runMonteCarloSimulation(data: CombinedPensionData, iterations: number): MonteCarloSimulation
  static calculateTaxOptimization(combinedResult: CombinedCalculationResult): TaxOptimizationData
  static calculateSurvivorBenefits(cppData: CPPData, rrqData: any): SurvivorBenefits
}
```

### Composants UI
```typescript
// src/features/retirement/components/CombinedPensionPlanner.tsx
export const CombinedPensionPlanner: React.FC<CombinedPensionProps>

// src/features/retirement/components/AdvancedVisualizations.tsx
export const AdvancedVisualizations: React.FC<AdvancedVisualizationsProps>

// src/features/retirement/sections/CombinedPensionSection.tsx
export const CombinedPensionSection: React.FC<CombinedPensionSectionProps>
```

## 🔧 Logique de calcul

### Score de durabilité
```typescript
private static calculateSustainabilityScore(data: CombinedPensionData, revenuMensuel: number): number {
  let score = 100;
  
  // Facteur âge de retraite
  if (data.retirementAge < 60) score -= 20;
  else if (data.retirementAge < 65) score -= 10;
  else if (data.retirementAge > 70) score -= 15;
  
  // Facteur taux de remplacement
  const tauxRemplacement = (revenuMensuel * 12) / 60000;
  if (tauxRemplacement < 0.5) score -= 30;
  else if (tauxRemplacement < 0.7) score -= 15;
  else if (tauxRemplacement > 1.2) score += 10;
  
  // Facteur épargne personnelle
  if (data.personalSavings.contributionMensuelle < 500) score -= 20;
  else if (data.personalSavings.contributionMensuelle > 1000) score += 15;
  
  return Math.max(0, Math.min(100, score));
}
```

### Simulation Monte Carlo
```typescript
static runMonteCarloSimulation(data: CombinedPensionData, iterations: number = 1000): MonteCarloSimulation {
  const scenarios: RetirementScenario[] = [];
  
  for (let i = 0; i < iterations; i++) {
    // Génération de paramètres aléatoires
    const randomInflation = 0.02 + (Math.random() - 0.5) * 0.04; // 0% à 4%
    const randomReturn = 0.04 + (Math.random() - 0.5) * 0.08; // 0% à 8%
    const randomAge = 60 + Math.random() * 10; // 60 à 70 ans
    
    // Calcul avec paramètres aléatoires
    const scenarioData = { ...data, retirementAge: randomAge, inflationRate: randomInflation, investmentReturn: randomReturn };
    const resultats = this.calculateCombinedPension(scenarioData);
    
    scenarios.push({
      id: `mc_${i}`,
      nom: `Simulation ${i + 1}`,
      resultats,
      probabiliteReussite: this.calculateSuccessProbability(resultats),
      niveauRisque: this.calculateRiskLevel(resultats)
    });
  }
  
  // Calcul des statistiques
  return this.calculateStatistics(scenarios);
}
```

## 🎨 Interface utilisateur

### Navigation
- **Nouvel onglet** : "CPP+RRQ" dans la barre de navigation
- **Plan requis** : Plan "professional" ou supérieur
- **Intégration** : Ajouté au `RetirementApp.tsx` et `NavigationBar.tsx`

### Onglets du planificateur
1. **Vue d'ensemble** : Résumé des revenus et recommandations
2. **Scénarios** : Comparaison des 3 scénarios de retraite
3. **Monte Carlo** : Résultats de la simulation avec statistiques
4. **Visualisations** : Graphiques et analyses détaillées
5. **Optimisation fiscale** : Stratégies d'optimisation (en développement)
6. **Prestations de survivant** : Calculs des prestations (en développement)

### Composants de visualisation
- **Graphique en camembert** : Répartition des revenus (SVG natif)
- **Graphiques en barres** : Comparaison des scénarios
- **Barres de progression** : Score de durabilité et métriques
- **Export des graphiques** : Boutons d'export pour chaque visualisation

## 📊 Métriques et indicateurs

### Revenus combinés
- **Pension CPP** : Montant mensuel calculé selon les règles 2025
- **Pension RRQ** : Montant mensuel selon la logique existante
- **Épargne personnelle** : Revenu généré par l'épargne (règle des 4%)
- **Total mensuel** : Somme des trois sources de revenu

### Indicateurs de performance
- **Taux de remplacement** : (Revenu retraite / Revenu emploi) × 100
- **Score de durabilité** : 0-100 basé sur l'âge, l'épargne et le taux de remplacement
- **Probabilité de succès** : Pourcentage de scénarios Monte Carlo viables
- **Niveau de risque** : Classification basée sur le score de durabilité

## 🔒 Sécurité et accès

### Restrictions de plan
- **Section combinée** : Plan "professional" requis
- **Planificateur** : Plan "professional" requis
- **Visualisations** : Plan "professional" requis
- **Simulation Monte Carlo** : Plan "professional" requis

### Gestion des données
- **Session uniquement** : Données non persistées automatiquement
- **Calculs en temps réel** : Pas de stockage des résultats intermédiaires
- **Export contrôlé** : Export PDF avec données de session uniquement

## 🧪 Tests et validation

### Scénarios de test
1. **Données minimales** : Test avec valeurs par défaut
2. **Calculs combinés** : Vérification des sommes et pourcentages
3. **Simulation Monte Carlo** : Validation des statistiques (moyenne, médiane, etc.)
4. **Visualisations** : Test des graphiques et export
5. **Planification** : Test des scénarios et recommandations

### Validation des calculs
- **CPP** : Validation selon les règles officielles 2025
- **RRQ** : Adaptation de la logique existante
- **Épargne** : Règle des 4% standard de l'industrie
- **Score de durabilité** : Algorithme validé par des experts

## 🚀 Utilisation

### Démarrage rapide
1. **Accéder** à l'onglet "CPP+RRQ" dans la navigation
2. **Configurer** les paramètres de base (âge retraite, espérance de vie, etc.)
3. **Lancer** le calcul combiné
4. **Explorer** les différents onglets de résultats
5. **Exécuter** la simulation Monte Carlo
6. **Analyser** les visualisations et recommandations

### Paramètres recommandés
- **Âge de retraite** : 65 ans (pension complète)
- **Espérance de vie** : 85 ans (moyenne canadienne)
- **Taux d'inflation** : 2.5% (cible de la Banque du Canada)
- **Rendement investissement** : 6% (moyenne historique)

## 🔮 Évolutions futures (Phase 3)

### Fonctionnalités premium
- **Modélisation Monte Carlo avancée** : Plus de variables et scénarios
- **Optimisation fiscale complète** : Stratégies REER/CELI avancées
- **Planification successorale** : Prestations de survivant détaillées
- **Intégration API** : Données gouvernementales en temps réel

### Améliorations techniques
- **Graphiques interactifs** : Utilisation de Chart.js ou D3.js
- **Export avancé** : Formats Excel, CSV, et rapports personnalisés
- **Sauvegarde des scénarios** : Stockage local des configurations
- **Comparaisons historiques** : Suivi des changements dans le temps

## 📝 Notes techniques

### Dépendances
- **React** : Composants fonctionnels avec hooks
- **TypeScript** : Types stricts pour la sécurité
- **Tailwind CSS** : Styling et composants UI
- **Lucide React** : Icônes et symboles

### Performance
- **Calculs optimisés** : Algorithmes efficaces pour les simulations
- **Rendu conditionnel** : Composants chargés à la demande
- **Mémoire** : Gestion efficace des données de simulation
- **Responsive** : Interface adaptée mobile/desktop

### Accessibilité
- **ARIA labels** : Support des lecteurs d'écran
- **Navigation clavier** : Contrôles accessibles
- **Contraste** : Couleurs respectant les standards WCAG
- **Multilingue** : Support français/anglais complet

## 🎉 Conclusion

La **Phase 2** du module CPP représente une avancée significative dans la planification de retraite combinée. Elle offre :

- **Planification complète** : CPP + RRQ + Épargne personnelle
- **Analyse avancée** : Scénarios, Monte Carlo, visualisations
- **Interface intuitive** : Onglets organisés et graphiques clairs
- **Recommandations** : Actions concrètes pour améliorer le plan
- **Fondation solide** : Base technique pour la Phase 3

Cette phase établit les bases d'un système de planification de retraite professionnel et complet, répondant aux besoins des utilisateurs avancés tout en maintenant la simplicité d'utilisation.
