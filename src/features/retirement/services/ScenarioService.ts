// src/features/retirement/services/ScenarioService.ts
import { UserData, Calculations } from '../types';
import { CalculationService } from './CalculationService';
import { MonteCarloService, MonteCarloResult } from './MonteCarloService';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  userData: UserData;
  calculations: Calculations;
  monteCarloResults?: MonteCarloResult;
  changes: ScenarioChange[];
  createdAt: Date;
  isBase?: boolean;
}

export interface ScenarioChange {
  field: string;
  label: string;
  oldValue: any;
  newValue: any;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface ScenarioComparison {
  scenarios: Scenario[];
  metrics: ComparisonMetric[];
  projections: ComparisonProjection[];
  recommendations: string[];
}

export interface ComparisonMetric {
  label: string;
  key: string;
  type: 'currency' | 'percentage' | 'years' | 'number';
  values: { scenarioId: string; value: number }[];
  bestScenarioId: string;
  worstScenarioId: string;
}

export interface ComparisonProjection {
  age: number;
  year: number;
  data: { scenarioId: string; capital: number }[];
}

export class ScenarioService {
  private static scenarios: Map<string, Scenario> = new Map();

  /**
   * Crée le scénario de base
   */
  static createBaseScenario(userData: UserData, calculations: Calculations): Scenario {
    const baseScenario: Scenario = {
      id: 'base',
      name: 'Situation actuelle',
      description: 'Votre situation financière actuelle sans modifications',
      icon: '📊',
      color: '#8B5CF6',
      userData: JSON.parse(JSON.stringify(userData)), // Deep clone
      calculations,
      changes: [],
      createdAt: new Date(),
      isBase: true
    };
    
    this.scenarios.set(baseScenario.id, baseScenario);
    return baseScenario;
  }

  /**
   * Crée un nouveau scénario modifié
   */
  static createScenario(
    baseUserData: UserData,
    modifications: Partial<UserData>,
    name: string,
    description: string,
    icon: string = '🔄',
    color: string = '#3B82F6'
  ): Scenario {
    // Appliquer les modifications
    const modifiedData = this.applyModifications(baseUserData, modifications);
    
    // Recalculer avec les nouvelles données
    const newCalculations = CalculationService.calculateAll(modifiedData);
    
    // Identifier les changements
    const changes = this.identifyChanges(baseUserData, modifiedData);
    
    const scenario: Scenario = {
      id: `scenario-${Date.now()}`,
      name,
      description,
      icon,
      color,
      userData: modifiedData,
      calculations: newCalculations,
      changes,
      createdAt: new Date()
    };
    
    this.scenarios.set(scenario.id, scenario);
    return scenario;
  }

  /**
   * Scénarios prédéfinis populaires
   */
  static generatePredefinedScenarios(baseData: UserData): Scenario[] {
    const scenarios: Scenario[] = [];
    
    // Scénario 1: Retraite anticipée
    const earlyRetirement = this.createScenario(
      baseData,
      {
        retirement: {
          ...baseData.retirement,
          rrqAgeActuel1: 60,
          rrqAgeActuel2: 60
        }
      },
      'Retraite à 60 ans',
      'Prendre sa retraite 5 ans plus tôt',
      '🏖️',
      '#10B981'
    );
    scenarios.push(earlyRetirement);
    
    // Scénario 2: Augmentation de l'épargne
    const increasedSavings = this.createScenario(
      baseData,
      {
        cashflow: {
          ...baseData.cashflow,
          epargne: baseData.cashflow.epargne * 1.5,
          placements: baseData.cashflow.placements * 1.5
        }
      },
      'Épargne augmentée 50%',
      'Augmenter votre épargne mensuelle de 50%',
      '💰',
      '#F59E0B'
    );
    scenarios.push(increasedSavings);
    
    // Scénario 3: Réduction des dépenses
    const reducedExpenses = this.createScenario(
      baseData,
      {
        cashflow: {
          ...baseData.cashflow,
          logement: baseData.cashflow.logement * 0.8,
          transport: baseData.cashflow.transport * 0.8,
          loisirs: baseData.cashflow.loisirs * 0.7
        }
      },
      'Dépenses réduites 20%',
      'Optimiser vos dépenses pour épargner plus',
      '📉',
      '#EF4444'
    );
    scenarios.push(reducedExpenses);
    
    // Scénario 4: Downsizing immobilier
    if (baseData.savings.residenceValeur > 0) {
      const downsizing = this.createScenario(
        baseData,
        {
          savings: {
            ...baseData.savings,
            residenceValeur: baseData.savings.residenceValeur * 0.7,
            residenceHypotheque: 0,
            placements1: baseData.savings.placements1 + (baseData.savings.residenceValeur * 0.3)
          }
        },
        'Downsizing immobilier',
        'Vendre et acheter plus petit, investir la différence',
        '🏡',
        '#EC4899'
      );
      scenarios.push(downsizing);
    }
    
    // Scénario 5: Travail à temps partiel à la retraite
    const partTimeWork = this.createScenario(
      baseData,
      {
        retirement: {
          ...baseData.retirement,
          revenusTempsPartiel1: 20000,
          revenusTempsPartiel2: baseData.personal.prenom2 ? 15000 : 0
        }
      },
      'Retraite semi-active',
      'Travailler à temps partiel les premières années',
      '💼',
      '#6366F1'
    );
    scenarios.push(partTimeWork);
    
    return scenarios;
  }

  /**
   * Compare plusieurs scénarios
   */
  static compareScenarios(scenarioIds: string[]): ScenarioComparison {
    const scenarios = scenarioIds
      .map(id => this.scenarios.get(id))
      .filter((s): s is Scenario => s !== undefined);
    
    if (scenarios.length < 2) {
      throw new Error('Au moins 2 scénarios requis pour la comparaison');
    }
    
    const metrics = this.calculateComparisonMetrics(scenarios);
    const projections = this.calculateComparisonProjections(scenarios);
    const recommendations = this.generateComparisonRecommendations(scenarios, metrics);
    
    return {
      scenarios,
      metrics,
      projections,
      recommendations
    };
  }

  /**
   * Calcule les métriques de comparaison
   */
  private static calculateComparisonMetrics(scenarios: Scenario[]): ComparisonMetric[] {
    const metrics: ComparisonMetric[] = [
      {
        label: 'Valeur nette actuelle',
        key: 'netWorth',
        type: 'currency',
        values: [],
        bestScenarioId: '',
        worstScenarioId: ''
      },
      {
        label: 'Capital à la retraite',
        key: 'retirementCapital',
        type: 'currency',
        values: [],
        bestScenarioId: '',
        worstScenarioId: ''
      },
      {
        label: 'Revenus mensuels retraite',
        key: 'retirementIncome',
        type: 'currency',
        values: [],
        bestScenarioId: '',
        worstScenarioId: ''
      },
      {
        label: 'Taux d\'épargne',
        key: 'savingsRate',
        type: 'percentage',
        values: [],
        bestScenarioId: '',
        worstScenarioId: ''
      },
      {
        label: 'Âge de retraite',
        key: 'retirementAge',
        type: 'years',
        values: [],
        bestScenarioId: '',
        worstScenarioId: ''
      },
      {
        label: 'Espérance capital épuisé',
        key: 'capitalDepletion',
        type: 'years',
        values: [],
        bestScenarioId: '',
        worstScenarioId: ''
      }
    ];
    
    // Remplir les valeurs pour chaque scénario
    scenarios.forEach(scenario => {
      metrics[0].values.push({
        scenarioId: scenario.id,
        value: scenario.calculations.netWorth
      });
      
      metrics[1].values.push({
        scenarioId: scenario.id,
        value: scenario.calculations.retirementCapital || scenario.calculations.netWorth * 2
      });
      
      metrics[2].values.push({
        scenarioId: scenario.id,
        value: this.calculateRetirementIncome(scenario.userData)
      });
      
      metrics[3].values.push({
        scenarioId: scenario.id,
        value: scenario.calculations.savingsRate || 0
      });
      
      metrics[4].values.push({
        scenarioId: scenario.id,
        value: scenario.userData.retirement.rrqAgeActuel1 || 65
      });
      
      metrics[5].values.push({
        scenarioId: scenario.id,
        value: this.estimateCapitalDepletion(scenario)
      });
    });
    
    // Identifier les meilleurs et pires scénarios pour chaque métrique
    metrics.forEach(metric => {
      if (metric.values.length > 0) {
        const sorted = [...metric.values].sort((a, b) => {
          // Pour l'âge de retraite, plus tôt est mieux
          if (metric.key === 'retirementAge') {
            return a.value - b.value;
          }
          // Pour le reste, plus élevé est mieux
          return b.value - a.value;
        });
        
        metric.bestScenarioId = sorted[0].scenarioId;
        metric.worstScenarioId = sorted[sorted.length - 1].scenarioId;
      }
    });
    
    return metrics;
  }

  /**
   * Calcule les projections comparatives
   */
  private static calculateComparisonProjections(scenarios: Scenario[]): ComparisonProjection[] {
    const projections: ComparisonProjection[] = [];
    const currentYear = new Date().getFullYear();
    
    // Trouver l'âge actuel et l'espérance de vie maximale
    const baseScenario = scenarios.find(s => s.isBase) || scenarios[0];
    const currentAge = this.calculateAge(baseScenario.userData.personal.naissance1);
    const maxAge = Math.max(...scenarios.map(s => s.userData.retirement.esperanceVie1 || 85));
    
    // Générer les projections pour chaque année
    for (let age = currentAge; age <= maxAge; age++) {
      const projection: ComparisonProjection = {
        age,
        year: currentYear + (age - currentAge),
        data: []
      };
      
      scenarios.forEach(scenario => {
        const capital = this.projectCapitalAtAge(scenario, age);
        projection.data.push({
          scenarioId: scenario.id,
          capital
        });
      });
      
      projections.push(projection);
    }
    
    return projections;
  }

  /**
   * Génère des recommandations basées sur la comparaison
   */
  private static generateComparisonRecommendations(
    scenarios: Scenario[],
    metrics: ComparisonMetric[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Trouver le meilleur scénario global
    const scenarioScores = new Map<string, number>();
    scenarios.forEach(s => scenarioScores.set(s.id, 0));
    
    metrics.forEach(metric => {
      const bestId = metric.bestScenarioId;
      if (bestId) {
        scenarioScores.set(bestId, (scenarioScores.get(bestId) || 0) + 1);
      }
    });
    
    const bestScenarioId = Array.from(scenarioScores.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0];
    
    const bestScenario = scenarios.find(s => s.id === bestScenarioId);
    if (bestScenario && !bestScenario.isBase) {
      recommendations.push(
        `📈 Le scénario "${bestScenario.name}" semble être le plus avantageux globalement.`
      );
    }
    
    // Analyser les différences significatives
    const capitalMetric = metrics.find(m => m.key === 'retirementCapital');
    if (capitalMetric) {
      const values = capitalMetric.values.map(v => v.value);
      const maxDiff = Math.max(...values) - Math.min(...values);
      if (maxDiff > 100000) {
        recommendations.push(
          `💰 La différence de capital à la retraite entre les scénarios peut atteindre ${this.formatCurrency(maxDiff)}.`
        );
      }
    }
    
    // Alerte si un scénario est risqué
    const depletionMetric = metrics.find(m => m.key === 'capitalDepletion');
    if (depletionMetric) {
      const riskyScenarios = depletionMetric.values.filter(v => v.value < 85);
      if (riskyScenarios.length > 0) {
        recommendations.push(
          `⚠️ Attention: Certains scénarios présentent un risque d'épuisement du capital avant 85 ans.`
        );
      }
    }
    
    return recommendations;
  }

  // Méthodes utilitaires
  private static applyModifications(
    baseData: UserData,
    modifications: Partial<UserData>
  ): UserData {
    const modified = JSON.parse(JSON.stringify(baseData)); // Deep clone
    
    // Appliquer les modifications récursivement
    Object.entries(modifications).forEach(([key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        modified[key] = { ...modified[key], ...value };
      } else {
        modified[key] = value;
      }
    });
    
    return modified;
  }
  
  private static identifyChanges(
    oldData: UserData,
    newData: UserData
  ): ScenarioChange[] {
    const changes: ScenarioChange[] = [];
    
    // Comparer les salaires
    if (oldData.personal.salaire1 !== newData.personal.salaire1) {
      changes.push({
        field: 'personal.salaire1',
        label: 'Salaire principal',
        oldValue: oldData.personal.salaire1,
        newValue: newData.personal.salaire1,
        impact: newData.personal.salaire1 > oldData.personal.salaire1 ? 'positive' : 'negative'
      });
    }
    
    // Comparer l'âge de retraite
    if (oldData.retirement.rrqAgeActuel1 !== newData.retirement.rrqAgeActuel1) {
      changes.push({
        field: 'retirement.rrqAgeActuel1',
        label: 'Âge de retraite',
        oldValue: oldData.retirement.rrqAgeActuel1,
        newValue: newData.retirement.rrqAgeActuel1,
        impact: newData.retirement.rrqAgeActuel1 < oldData.retirement.rrqAgeActuel1 ? 'positive' : 'neutral'
      });
    }
    
    // Comparer les dépenses
    const oldTotalExpenses = Object.values(oldData.cashflow).reduce((sum, val) => sum + val, 0);
    const newTotalExpenses = Object.values(newData.cashflow).reduce((sum, val) => sum + val, 0);
    if (Math.abs(oldTotalExpenses - newTotalExpenses) > 100) {
      changes.push({
        field: 'cashflow.total',
        label: 'Dépenses totales',
        oldValue: oldTotalExpenses,
        newValue: newTotalExpenses,
        impact: newTotalExpenses < oldTotalExpenses ? 'positive' : 'negative'
      });
    }
    
    // Ajouter d'autres comparaisons selon les besoins...
    
    return changes;
  }
  
  private static calculateRetirementIncome(userData: UserData): number {
    const monthlyIncome = 
      (userData.retirement.rrqMontantActuel1 || 0) +
      (userData.retirement.rrqMontantActuel2 || 0) +
      ((userData.retirement.pensionPrivee1 + userData.retirement.pensionPrivee2) / 12) +
      ((userData.retirement.revenusTempsPartiel1 + userData.retirement.revenusTempsPartiel2) / 12) +
      1333; // PSV estimé
    
    return monthlyIncome;
  }
  
  private static projectCapitalAtAge(scenario: Scenario, targetAge: number): number {
    const currentAge = this.calculateAge(scenario.userData.personal.naissance1);
    const yearsToProject = targetAge - currentAge;
    
    if (yearsToProject <= 0) {
      return scenario.calculations.netWorth;
    }
    
    // Projection simplifiée
    const annualGrowthRate = 0.06;
    const annualSavings = (scenario.calculations.monthlyIncome - scenario.calculations.monthlyExpenses) * 12;
    
    let capital = scenario.calculations.netWorth;
    for (let year = 0; year < yearsToProject; year++) {
      capital = capital * (1 + annualGrowthRate) + annualSavings;
    }
    
    return Math.round(capital);
  }
  
  private static estimateCapitalDepletion(scenario: Scenario): number {
    const retirementAge = scenario.userData.retirement.rrqAgeActuel1 || 65;
    const retirementCapital = scenario.calculations.retirementCapital || scenario.calculations.netWorth * 2;
    const annualExpenses = scenario.calculations.monthlyExpenses * 12 * 0.75; // 75% des dépenses à la retraite
    const retirementIncome = this.calculateRetirementIncome(scenario.userData) * 12;
    
    const annualShortfall = Math.max(0, annualExpenses - retirementIncome);
    
    if (annualShortfall === 0) {
      return 100; // Capital ne s'épuise jamais
    }
    
    const yearsOfCapital = retirementCapital / annualShortfall;
    return Math.min(100, retirementAge + Math.round(yearsOfCapital));
  }
  
  private static calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }
  
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  /**
   * Obtenir tous les scénarios
   */
  static getAllScenarios(): Scenario[] {
    return Array.from(this.scenarios.values());
  }
  
  /**
   * Supprimer un scénario
   */
  static deleteScenario(id: string): void {
    if (id !== 'base') {
      this.scenarios.delete(id);
    }
  }
  
  /**
   * Réinitialiser tous les scénarios
   */
  static reset(): void {
    this.scenarios.clear();
  }
}