// Service avancé pour les fonctionnalités premium du module CPP
// Phase 3: Modélisation Monte Carlo, Optimisation fiscale, Planification successorale, API

import {
  MarketSimulation,
  MarketParameters,
  MarketSimulationResult,
  TaxOptimizationData,
  SurvivorBenefits,
  GovernmentAPI,
  AdvancedReport
} from '../types/advanced-cpp';
import { CPPData } from '../types/cpp';

export class AdvancedCPPService {
  
  // === MODÉLISATION MONTE CARLO AVANCÉE ===
  
  static async runAdvancedMonteCarlo(
    cppData: CPPData,
    parameters: MarketParameters
  ): Promise<MarketSimulationResult> {
    const startTime = Date.now();
    
    try {
      // Génération des scénarios avec paramètres de marché
      const scenarios = await this.generateMarketScenarios(cppData, parameters);
      
      // Calcul des métriques de risque avancées
      const riskMetrics = this.calculateAdvancedRiskMetrics(scenarios);
      
      // Génération des recommandations
      const recommendations = this.generateMarketRecommendations(scenarios, riskMetrics);
      
      // Création des graphiques
      const charts = this.generateAdvancedCharts(scenarios, riskMetrics);
      
      const summary = {
        totalScenarios: scenarios.length,
        successfulScenarios: scenarios.filter(s => s.sustainability > 0.7).length,
        successRate: scenarios.filter(s => s.sustainability > 0.7).length / scenarios.length,
        averageIncome: scenarios.reduce((sum, s) => sum + s.netIncome, 0) / scenarios.length,
        medianIncome: this.calculateMedian(scenarios.map(s => s.netIncome)),
        worstCaseIncome: Math.min(...scenarios.map(s => s.netIncome)),
        bestCaseIncome: Math.max(...scenarios.map(s => s.netIncome)),
        volatility: this.calculateVolatility(scenarios.map(s => s.netIncome))
      };

      return {
        summary,
        scenarios,
        riskMetrics,
        recommendations,
        charts
      };
      
    } catch (error) {
      console.error('Erreur lors de la simulation Monte Carlo avancée:', error);
      throw new Error('Échec de la simulation Monte Carlo avancée');
    }
  }

  private static async generateMarketScenarios(
    cppData: CPPData,
    parameters: MarketParameters
  ): Promise<any[]> {
    const scenarios = [];
    
    for (let i = 0; i < parameters.iterations; i++) {
      // Génération de paramètres aléatoires basés sur les distributions
      const inflation = this.generateRandomFromDistribution(
        parameters.inflationRange.mean,
        parameters.inflationRange.stdDev,
        parameters.inflationRange.min,
        parameters.inflationRange.max
      );
      
      const investmentReturn = this.generateRandomFromDistribution(
        parameters.investmentReturnRange.mean,
        parameters.investmentReturnRange.stdDev,
        parameters.investmentReturnRange.min,
        parameters.investmentReturnRange.max
      );
      
      const gdpGrowth = this.generateRandomFromDistribution(
        parameters.gdpGrowthRange.mean,
        parameters.gdpGrowthRange.stdDev,
        parameters.gdpGrowthRange.min,
        parameters.gdpGrowthRange.max
      );
      
      // Calcul du scénario
      const scenario = this.calculateMarketScenario(cppData, {
        inflation,
        investmentReturn,
        gdpGrowth,
        iteration: i
      });
      
      scenarios.push(scenario);
      
      // Pause pour éviter de bloquer l'UI
      if (i % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    return scenarios;
  }

  private static generateRandomFromDistribution(
    mean: number,
    stdDev: number,
    min: number,
    max: number
  ): number {
    // Box-Muller transform pour distribution normale
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    let value = mean + z * stdDev;
    
    // Limitation aux bornes
    return Math.max(min, Math.min(max, value));
  }

  private static calculateMarketScenario(cppData: CPPData, params: any): any {
    // Simulation d'un scénario de marché
    const basePension = 15000; // Pension de base CPP
    const marketAdjustment = 1 + (params.investmentReturn - params.inflation) * 0.1;
    const economicAdjustment = 1 + params.gdpGrowth * 0.05;
    
    const adjustedPension = basePension * marketAdjustment * economicAdjustment;
    const expenses = adjustedPension * (0.3 + params.inflation * 0.5);
    const netIncome = adjustedPension - expenses;
    const sustainability = Math.max(0, Math.min(1, netIncome / adjustedPension));
    
    return {
      id: `scenario_${params.iteration}`,
      name: `Scénario ${params.iteration + 1}`,
      probability: 1 / 1000, // Probabilité uniforme
      income: adjustedPension,
      expenses,
      netIncome,
      sustainability,
      riskLevel: this.calculateRiskLevel(sustainability),
      parameters: {
        inflation: params.inflation,
        investmentReturn: params.investmentReturn,
        interestRate: params.investmentReturn * 0.8,
        gdpGrowth: params.gdpGrowth,
        unemploymentRate: 0.05 + params.gdpGrowth * -0.1,
        lifeExpectancy: 85 + params.gdpGrowth * 2
      }
    };
  }

  private static calculateRiskLevel(sustainability: number): 'low' | 'medium' | 'high' {
    if (sustainability >= 0.7) return 'low';
    if (sustainability >= 0.4) return 'medium';
    return 'high';
  }

  private static calculateAdvancedRiskMetrics(scenarios: any[]): any {
    const incomes = scenarios.map(s => s.netIncome);
    
    return {
      valueAtRisk: {
        p95: this.calculatePercentile(incomes, 0.05),
        p99: this.calculatePercentile(incomes, 0.01)
      },
      conditionalValueAtRisk: {
        p95: this.calculateConditionalVaR(incomes, 0.05),
        p99: this.calculateConditionalVaR(incomes, 0.01)
      },
      sharpeRatio: this.calculateSharpeRatio(incomes),
      sortinoRatio: this.calculateSortinoRatio(incomes),
      maximumDrawdown: this.calculateMaximumDrawdown(incomes),
      calmarRatio: this.calculateCalmarRatio(incomes),
      ulcerIndex: this.calculateUlcerIndex(incomes)
    };
  }

  // === OPTIMISATION FISCALE ===
  
  static calculateTaxOptimization(cppData: CPPData): TaxOptimizationData {
    const currentTax = this.calculateCurrentTax(cppData);
    const optimizedTax = this.calculateOptimizedTax(cppData);
    const strategies = this.generateTaxStrategies(cppData);
    const savings = this.calculateTaxSavings(currentTax, optimizedTax);
    const recommendations = this.generateTaxRecommendations(strategies, savings);
    
    return {
      currentTax,
      optimizedTax,
      strategies,
      savings,
      recommendations
    };
  }

  private static calculateCurrentTax(cppData: CPPData): any {
    const grossIncome = 80000; // Revenu brut exemple
    const cppDeduction = 3754; // Déduction CPP 2025
    const rrqDeduction = 4100; // Déduction RRQ 2025
    const otherDeductions = 5000;
    
    const taxableIncome = grossIncome - cppDeduction - rrqDeduction - otherDeductions;
    const federalTax = this.calculateFederalTax(taxableIncome);
    const provincialTax = this.calculateProvincialTax(taxableIncome);
    
    return {
      grossIncome,
      cppDeduction,
      rrqDeduction,
      otherDeductions,
      taxableIncome,
      federalTax,
      provincialTax,
      totalTax: federalTax + provincialTax,
      effectiveTaxRate: (federalTax + provincialTax) / grossIncome,
      marginalTaxRate: this.getMarginalTaxRate(taxableIncome)
    };
  }

  private static calculateOptimizedTax(cppData: CPPData): any {
    // Logique d'optimisation fiscale
    const optimized = this.calculateCurrentTax(cppData);
    
    // Optimisations possibles
    optimized.cppDeduction = Math.min(optimized.cppDeduction, 3754);
    optimized.rrqDeduction = Math.min(optimized.rrqDeduction, 4100);
    optimized.otherDeductions = Math.max(optimized.otherDeductions, 8000);
    
    // Recalcul des taxes
    optimized.taxableIncome = optimized.grossIncome - optimized.cppDeduction - 
                              optimized.rrqDeduction - optimized.otherDeductions;
    optimized.federalTax = this.calculateFederalTax(optimized.taxableIncome);
    optimized.provincialTax = this.calculateProvincialTax(optimized.taxableIncome);
    optimized.totalTax = optimized.federalTax + optimized.provincialTax;
    optimized.effectiveTaxRate = optimized.totalTax / optimized.grossIncome;
    
    return optimized;
  }

  // === PLANIFICATION SUCCESSORALE ===
  
  static calculateSurvivorBenefits(cppData: CPPData): SurvivorBenefits {
    const cppSurvivor = this.calculateCPPSurvivorBenefits(cppData);
    const rrqSurvivor = this.calculateRRQSurvivorBenefits(cppData);
    const combined = this.calculateCombinedSurvivorBenefits(cppSurvivor, rrqSurvivor);
    const planning = this.generateSurvivorPlanning(cppSurvivor, rrqSurvivor);
    
    return {
      cpp: cppSurvivor,
      rrq: rrqSurvivor,
      combined,
      planning
    };
  }

  private static calculateCPPSurvivorBenefits(cppData: CPPData): any {
    const basePension = 15000;
    const deathBenefit = 2500;
    const survivorPension = basePension * 0.6;
    const childrenBenefit = basePension * 0.25;
    
    return {
      deathBenefit,
      survivorPension,
      childrenBenefit,
      eligibility: {
        age: 65,
        maritalStatus: 'married',
        dependentChildren: true,
        contributionYears: 40,
        minimumContributions: true
      },
      calculation: {
        baseAmount: basePension,
        ageAdjustment: 1.0,
        contributionAdjustment: 1.0,
        finalAmount: survivorPension,
        paymentFrequency: 'monthly'
      }
    };
  }

  // === UTILITAIRES ===
  
  private static calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  private static calculateVolatility(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private static calculatePercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.floor(percentile * sorted.length);
    return sorted[index];
  }

  private static calculateConditionalVaR(values: number[], percentile: number): number {
    const threshold = this.calculatePercentile(values, percentile);
    const tailValues = values.filter(v => v <= threshold);
    return tailValues.reduce((sum, val) => sum + val, 0) / tailValues.length;
  }

  private static calculateSharpeRatio(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = this.calculateVolatility(values);
    return mean / stdDev;
  }

  private static calculateSortinoRatio(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const downsideValues = values.filter(v => v < mean);
    const downsideDeviation = Math.sqrt(
      downsideValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / downsideValues.length
    );
    return mean / downsideDeviation;
  }

  private static calculateMaximumDrawdown(values: number[]): number {
    let maxDrawdown = 0;
    let peak = values[0];
    
    for (const value of values) {
      if (value > peak) {
        peak = value;
      }
      const drawdown = (peak - value) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
    
    return maxDrawdown;
  }

  private static calculateCalmarRatio(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const maxDrawdown = this.calculateMaximumDrawdown(values);
    return mean / maxDrawdown;
  }

  private static calculateUlcerIndex(values: number[]): number {
    let peak = values[0];
    let sumSquaredDrawdowns = 0;
    
    for (const value of values) {
      if (value > peak) {
        peak = value;
      }
      const drawdown = (peak - value) / peak;
      sumSquaredDrawdowns += drawdown * drawdown;
    }
    
    return Math.sqrt(sumSquaredDrawdowns / values.length);
  }

  // Méthodes de calcul des taxes (simplifiées)
  private static calculateFederalTax(taxableIncome: number): number {
    // Brackets fédéraux 2025 (simplifiés)
    if (taxableIncome <= 53359) return taxableIncome * 0.15;
    if (taxableIncome <= 106717) return 8004 + (taxableIncome - 53359) * 0.205;
    if (taxableIncome <= 165430) return 18942 + (taxableIncome - 106717) * 0.26;
    if (taxableIncome <= 235675) return 34226 + (taxableIncome - 165430) * 0.29;
    return 54608 + (taxableIncome - 235675) * 0.33;
  }

  private static calculateProvincialTax(taxableIncome: number): number {
    // Taxe provinciale Québec 2025 (simplifiée)
    if (taxableIncome <= 49275) return taxableIncome * 0.14;
    if (taxableIncome <= 98540) return 6899 + (taxableIncome - 49275) * 0.19;
    if (taxableIncome <= 119910) return 16266 + (taxableIncome - 98540) * 0.24;
    return 21366 + (taxableIncome - 119910) * 0.2575;
  }

  private static getMarginalTaxRate(taxableIncome: number): number {
    // Taux marginal combiné fédéral + provincial
    const federalRate = this.getFederalMarginalRate(taxableIncome);
    const provincialRate = this.getProvincialMarginalRate(taxableIncome);
    return federalRate + provincialRate;
  }

  private static getFederalMarginalRate(taxableIncome: number): number {
    if (taxableIncome <= 53359) return 0.15;
    if (taxableIncome <= 106717) return 0.205;
    if (taxableIncome <= 165430) return 0.26;
    if (taxableIncome <= 235675) return 0.29;
    return 0.33;
  }

  private static getProvincialMarginalRate(taxableIncome: number): number {
    if (taxableIncome <= 49275) return 0.14;
    if (taxableIncome <= 98540) return 0.19;
    if (taxableIncome <= 119910) return 0.24;
    return 0.2575;
  }

  // Méthodes de génération des stratégies et recommandations
  private static generateTaxStrategies(cppData: CPPData): any[] {
    return [
      {
        id: 'income_splitting',
        name: 'Fractionnement du revenu',
        description: 'Répartir le revenu entre conjoints pour réduire l\'impôt',
        type: 'income_splitting',
        impact: {
          taxSavings: 2000,
          complexity: 'medium',
          risk: 'low',
          implementation: ['Vérifier l\'éligibilité', 'Calculer les économies', 'Soumettre les formulaires']
        },
        requirements: ['Conjoint admissible', 'Formulaires T1032'],
        limitations: ['Limites annuelles', 'Restrictions d\'âge']
      }
    ];
  }

  private static calculateTaxSavings(currentTax: any, optimizedTax: any): any {
    const annual = currentTax.totalTax - optimizedTax.totalTax;
    const lifetime = annual * 25; // 25 ans de retraite
    const percentage = (annual / currentTax.totalTax) * 100;
    
    return {
      annual,
      lifetime,
      percentage,
      byStrategy: { 'income_splitting': annual * 0.6 }
    };
  }

  private static generateTaxRecommendations(strategies: any[], savings: any): any[] {
    return strategies.map(strategy => ({
      priority: savings.annual > 3000 ? 'high' : 'medium',
      strategy,
      reason: `Économies potentielles de ${savings.annual.toFixed(0)}$ par année`,
      actionItems: strategy.impact.implementation,
      timeline: 'Prochain exercice fiscal'
    }));
  }

  private static calculateRRQSurvivorBenefits(cppData: CPPData): any {
    // Logique similaire au CPP
    return this.calculateCPPSurvivorBenefits(cppData);
  }

  private static calculateCombinedSurvivorBenefits(cppSurvivor: any, rrqSurvivor: any): any {
    return {
      totalDeathBenefit: cppSurvivor.deathBenefit + rrqSurvivor.deathBenefit,
      totalSurvivorPension: cppSurvivor.survivorPension + rrqSurvivor.survivorPension,
      totalChildrenBenefit: cppSurvivor.childrenBenefit + rrqSurvivor.childrenBenefit,
      coordination: {
        cppReduction: 0,
        rrqReduction: 0,
        netBenefit: cppSurvivor.survivorPension + rrqSurvivor.survivorPension,
        explanation: 'Aucune réduction de coordination applicable'
      },
      optimization: {
        strategies: [],
        recommendations: ['Consulter un conseiller en planification successorale'],
        documents: []
      }
    };
  }

  private static generateSurvivorPlanning(cppSurvivor: any, rrqSurvivor: any): any {
    return {
      currentDocuments: [],
      missingDocuments: [],
      nextSteps: ['Vérifier l\'éligibilité', 'Préparer la documentation'],
      timeline: '3-6 mois',
      estimatedBenefits: cppSurvivor.survivorPension + rrqSurvivor.survivorPension
    };
  }

  private static generateMarketRecommendations(scenarios: any[], riskMetrics: any): string[] {
    const recommendations = [];
    
    if (riskMetrics.valueAtRisk.p95 < 0) {
      recommendations.push('Considérer des stratégies de réduction des risques');
    }
    
    if (riskMetrics.sharpeRatio < 1) {
      recommendations.push('Optimiser le ratio risque/rendement');
    }
    
    if (riskMetrics.maximumDrawdown > 0.2) {
      recommendations.push('Limiter l\'exposition aux marchés volatils');
    }
    
    return recommendations;
  }

  private static generateAdvancedCharts(scenarios: any[], riskMetrics: any): any[] {
    return [
      {
        type: 'line',
        title: 'Distribution des revenus',
        data: scenarios.map(s => ({ x: s.netIncome, y: s.probability })),
        options: {}
      },
      {
        type: 'bar',
        title: 'Métriques de risque',
        data: [
          { metric: 'VaR 95%', value: riskMetrics.valueAtRisk.p95 },
          { metric: 'Sharpe Ratio', value: riskMetrics.sharpeRatio },
          { metric: 'Max Drawdown', value: riskMetrics.maximumDrawdown }
        ],
        options: {}
      }
    ];
  }
}
