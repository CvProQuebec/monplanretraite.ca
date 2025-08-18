// src/features/retirement/services/MonteCarloService.ts
import { UserData, Calculations } from '../types';

export interface MonteCarloResult {
  simulations: SimulationResult[];
  statistics: MonteCarloStatistics;
  percentiles: PercentileData;
  successRate: number;
  confidenceIntervals: ConfidenceInterval[];
}

export interface SimulationResult {
  id: number;
  finalCapital: number;
  depletionAge?: number;
  success: boolean;
  trajectory: YearlyData[];
  returnSequence: number[];
}

export interface YearlyData {
  year: number;
  age: number;
  capital: number;
  returns: number;
  income: number;
  expenses: number;
  netCashFlow: number;
}

export interface MonteCarloStatistics {
  mean: number;
  median: number;
  standardDeviation: number;
  min: number;
  max: number;
  successfulRuns: number;
  failedRuns: number;
  averageDepletionAge: number;
}

export interface PercentileData {
  p5: number;   // 5e percentile (scénario pessimiste)
  p10: number;
  p25: number;
  p50: number;  // Médiane
  p75: number;
  p90: number;
  p95: number;  // 95e percentile (scénario optimiste)
}

export interface ConfidenceInterval {
  age: number;
  year: number;
  lower95: number;
  lower50: number;
  median: number;
  upper50: number;
  upper95: number;
}

export interface MonteCarloParameters {
  numberOfSimulations: number;
  expectedReturn: number;
  returnVolatility: number;
  inflationMean: number;
  inflationVolatility: number;
  sequenceRisk: boolean;
  marketCrashProbability: number;
  crashMagnitude: number;
}

export class MonteCarloService {
  private static readonly DEFAULT_PARAMS: MonteCarloParameters = {
    numberOfSimulations: 1000,
    expectedReturn: 0.06,        // 6% rendement moyen
    returnVolatility: 0.15,      // 15% écart-type
    inflationMean: 0.02,         // 2% inflation moyenne
    inflationVolatility: 0.01,   // 1% écart-type inflation
    sequenceRisk: true,          // Inclure le risque de séquence
    marketCrashProbability: 0.02, // 2% chance de krach par année
    crashMagnitude: -0.35        // -35% en cas de krach
  };

  /**
   * Lance une simulation Monte Carlo complète
   */
  static runSimulation(
    userData: UserData,
    calculations: Calculations,
    params: Partial<MonteCarloParameters> = {}
  ): MonteCarloResult {
    const parameters = { ...this.DEFAULT_PARAMS, ...params };
    const simulations: SimulationResult[] = [];
    
    // Effectuer toutes les simulations
    for (let i = 0; i < parameters.numberOfSimulations; i++) {
      const simulation = this.runSingleSimulation(
        userData,
        calculations,
        parameters,
        i
      );
      simulations.push(simulation);
    }
    
    // Calculer les statistiques
    const statistics = this.calculateStatistics(simulations);
    const percentiles = this.calculatePercentiles(simulations);
    const successRate = (statistics.successfulRuns / parameters.numberOfSimulations) * 100;
    const confidenceIntervals = this.calculateConfidenceIntervals(simulations, userData);
    
    return {
      simulations: simulations.slice(0, 100), // Garder seulement 100 pour la performance
      statistics,
      percentiles,
      successRate,
      confidenceIntervals
    };
  }

  /**
   * Exécute une seule simulation
   */
  private static runSingleSimulation(
    userData: UserData,
    calculations: Calculations,
    params: MonteCarloParameters,
    simulationId: number
  ): SimulationResult {
    const currentAge = this.calculateAge(userData.personal.naissance1);
    const retirementAge = userData.retirement.rrqAgeActuel1 || 65;
    const lifeExpectancy = userData.retirement.esperanceVie1 || 85;
    const currentYear = new Date().getFullYear();
    
    let capital = calculations.netWorth;
    const trajectory: YearlyData[] = [];
    const returnSequence: number[] = [];
    let depletionAge: number | undefined;
    
    // Générer la séquence de rendements pour cette simulation
    const returns = this.generateReturnSequence(
      lifeExpectancy - currentAge,
      params
    );
    
    // Simuler chaque année
    for (let yearIndex = 0; yearIndex <= lifeExpectancy - currentAge; yearIndex++) {
      const age = currentAge + yearIndex;
      const year = currentYear + yearIndex;
      const isRetired = age >= retirementAge;
      
      // Inflation pour cette année
      const cumulativeInflation = Math.pow(1 + params.inflationMean, yearIndex);
      
      // Revenus
      let income = 0;
      if (isRetired) {
        income = this.calculateRetirementIncome(userData, age, cumulativeInflation);
      } else {
        income = (userData.personal.salaire1 + userData.personal.salaire2) * cumulativeInflation;
      }
      
      // Dépenses
      let expenses = calculations.monthlyExpenses * 12 * cumulativeInflation;
      if (isRetired) {
        expenses *= 0.75; // Réduction des dépenses à la retraite
      }
      
      // Rendement des investissements
      const investmentReturn = capital * returns[yearIndex];
      returnSequence.push(returns[yearIndex]);
      
      // Flux net
      const netCashFlow = income - expenses;
      
      // Mise à jour du capital
      capital = Math.max(0, capital + investmentReturn + netCashFlow);
      
      // Vérifier l'épuisement du capital
      if (capital === 0 && !depletionAge) {
        depletionAge = age;
      }
      
      trajectory.push({
        year,
        age,
        capital: Math.round(capital),
        returns: investmentReturn,
        income: Math.round(income),
        expenses: Math.round(expenses),
        netCashFlow: Math.round(netCashFlow)
      });
    }
    
    return {
      id: simulationId,
      finalCapital: Math.round(capital),
      depletionAge,
      success: capital > 0,
      trajectory,
      returnSequence
    };
  }

  /**
   * Génère une séquence de rendements avec corrélation série
   */
  private static generateReturnSequence(
    years: number,
    params: MonteCarloParameters
  ): number[] {
    const returns: number[] = [];
    let momentum = 0; // Pour le risque de séquence
    
    for (let i = 0; i < years; i++) {
      // Rendement de base (distribution normale)
      let annualReturn = this.generateNormalReturn(
        params.expectedReturn,
        params.returnVolatility
      );
      
      // Ajouter le risque de séquence (corrélation série)
      if (params.sequenceRisk && i > 0) {
        momentum = 0.3 * momentum + 0.7 * (returns[i - 1] - params.expectedReturn);
        annualReturn += momentum * 0.5;
      }
      
      // Risque de krach
      if (Math.random() < params.marketCrashProbability) {
        annualReturn = params.crashMagnitude;
      }
      
      // Limiter les valeurs extrêmes
      annualReturn = Math.max(-0.5, Math.min(0.5, annualReturn));
      
      returns.push(annualReturn);
    }
    
    return returns;
  }

  /**
   * Génère un rendement avec distribution normale
   */
  private static generateNormalReturn(mean: number, stdDev: number): number {
    // Box-Muller transform pour générer une distribution normale
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z0;
  }

  /**
   * Calcule les revenus de retraite ajustés pour l'inflation
   */
  private static calculateRetirementIncome(
    userData: UserData,
    age: number,
    inflationFactor: number
  ): number {
    let income = 0;
    
    // RRQ personne 1
    if (age >= userData.retirement.rrqAgeActuel1 && userData.retirement.rrqMontantActuel1) {
      income += userData.retirement.rrqMontantActuel1 * 12 * inflationFactor;
    }
    
    // RRQ personne 2
    if (userData.personal.prenom2 && age >= userData.retirement.rrqAgeActuel2 && userData.retirement.rrqMontantActuel2) {
      income += userData.retirement.rrqMontantActuel2 * 12 * inflationFactor;
    }
    
    // PSV (à 65 ans) - indexé à l'inflation
    if (age >= 65) {
      income += 8000 * inflationFactor;
      if (userData.personal.prenom2) {
        income += 8000 * inflationFactor;
      }
    }
    
    // Pensions privées (partiellement indexées)
    const pensionIndexation = 0.5; // 50% d'indexation
    income += (userData.retirement.pensionPrivee1 + userData.retirement.pensionPrivee2) * 
              (1 + (inflationFactor - 1) * pensionIndexation);
    
    // Retrait REER/FERR (4% ajusté)
    const reerTotal = userData.savings.reer1 + userData.savings.reer2;
    const withdrawalRate = age < 71 ? 0.04 : this.getMandatoryWithdrawalRate(age);
    income += reerTotal * withdrawalRate;
    
    return income;
  }

  /**
   * Taux de retrait obligatoire FERR
   */
  private static getMandatoryWithdrawalRate(age: number): number {
    if (age < 71) return 0.04;
    if (age >= 95) return 0.2;
    
    // Taux approximatifs selon l'âge
    const rates: Record<number, number> = {
      71: 0.0528, 72: 0.0540, 73: 0.0553, 74: 0.0567,
      75: 0.0582, 76: 0.0598, 77: 0.0617, 78: 0.0636,
      79: 0.0658, 80: 0.0682, 85: 0.0853, 90: 0.1196
    };
    
    return rates[age] || 0.1;
  }

  /**
   * Calcule les statistiques globales
   */
  private static calculateStatistics(simulations: SimulationResult[]): MonteCarloStatistics {
    const finalCapitals = simulations.map(s => s.finalCapital);
    const successfulRuns = simulations.filter(s => s.success).length;
    const failedRuns = simulations.length - successfulRuns;
    
    const depletionAges = simulations
      .filter(s => s.depletionAge)
      .map(s => s.depletionAge!);
    
    return {
      mean: this.average(finalCapitals),
      median: this.percentile(finalCapitals, 50),
      standardDeviation: this.standardDeviation(finalCapitals),
      min: Math.min(...finalCapitals),
      max: Math.max(...finalCapitals),
      successfulRuns,
      failedRuns,
      averageDepletionAge: depletionAges.length > 0 ? this.average(depletionAges) : 0
    };
  }

  /**
   * Calcule les percentiles
   */
  private static calculatePercentiles(simulations: SimulationResult[]): PercentileData {
    const finalCapitals = simulations.map(s => s.finalCapital).sort((a, b) => a - b);
    
    return {
      p5: this.percentile(finalCapitals, 5),
      p10: this.percentile(finalCapitals, 10),
      p25: this.percentile(finalCapitals, 25),
      p50: this.percentile(finalCapitals, 50),
      p75: this.percentile(finalCapitals, 75),
      p90: this.percentile(finalCapitals, 90),
      p95: this.percentile(finalCapitals, 95)
    };
  }

  /**
   * Calcule les intervalles de confiance par année
   */
  private static calculateConfidenceIntervals(
    simulations: SimulationResult[],
    userData: UserData
  ): ConfidenceInterval[] {
    const currentAge = this.calculateAge(userData.personal.naissance1);
    const lifeExpectancy = userData.retirement.esperanceVie1 || 85;
    const intervals: ConfidenceInterval[] = [];
    
    // Pour chaque année
    for (let age = currentAge; age <= lifeExpectancy; age += 5) { // Tous les 5 ans
      const yearIndex = age - currentAge;
      const year = new Date().getFullYear() + yearIndex;
      
      // Collecter les capitaux à cet âge
      const capitalsAtAge = simulations
        .map(s => s.trajectory[yearIndex]?.capital || 0)
        .filter(c => c !== undefined)
        .sort((a, b) => a - b);
      
      if (capitalsAtAge.length > 0) {
        intervals.push({
          age,
          year,
          lower95: this.percentile(capitalsAtAge, 2.5),
          lower50: this.percentile(capitalsAtAge, 25),
          median: this.percentile(capitalsAtAge, 50),
          upper50: this.percentile(capitalsAtAge, 75),
          upper95: this.percentile(capitalsAtAge, 97.5)
        });
      }
    }
    
    return intervals;
  }

  // Fonctions utilitaires
  private static average(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  private static standardDeviation(numbers: number[]): number {
    const avg = this.average(numbers);
    const squareDiffs = numbers.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(this.average(squareDiffs));
  }

  private static percentile(sortedArray: number[], percentile: number): number {
    const index = (percentile / 100) * (sortedArray.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    if (lower === upper) {
      return sortedArray[lower];
    }
    
    return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
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
}