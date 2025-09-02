// src/features/retirement/services/AnalyticsService.ts
import { UserData, Calculations } from '../types';
import { FINANCIAL_ASSUMPTIONS, MORTALITY_CPM2014 } from '../../../config/financial-assumptions';

export interface ChartDataPoint {
  age: number;
  year: number;
  capital: number;
  revenus: number;
  depenses: number;
  valeurNette: number;
}

export interface FinancialProjection {
  chartData: ChartDataPoint[];
  milestones: Milestone[];
  metrics: DashboardMetrics;
}

export interface Milestone {
  age: number;
  year: number;
  title: string;
  description: string;
  type: 'retirement' | 'goal' | 'warning' | 'success';
  value?: number;
}

export interface DashboardMetrics {
  currentNetWorth: number;
  projectedNetWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  retirementReadiness: number;
  yearsToRetirement: number;
  estimatedRetirementIncome: number;
}

export class AnalyticsService {
  /**
   * Calcule la stratégie de retraite optimale utilisant CPM2014
   */
  private static calculateOptimalRetirementStrategy(
    userData: UserData,
    currentAge: number
  ): { recommendedAge: number; lifeExpectancy: number; planningHorizon: number } {

    const gender = userData.personal?.sexe1 === 'F' ? 'female' : 'male';

    const mortalityAnalysis = MORTALITY_CPM2014.calculateLifeExpectancy({
      age: currentAge,
      gender: gender
    });

    return {
      recommendedAge: Math.min(mortalityAnalysis.recommendedPlanningAge, 95),
      lifeExpectancy: mortalityAnalysis.lifeExpectancy,
      planningHorizon: mortalityAnalysis.recommendedPlanningAge - currentAge
    };
  }

  static generateProjections(userData: UserData, calculations: Calculations): FinancialProjection {
    // Vérifier que les calculs sont disponibles
    if (!calculations) {
      console.warn('Calculations is undefined, using default values');
      calculations = {
        netWorth: 0,
        retirementCapital: 0,
        sufficiency: 0,
        taxSavings: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0
      };
    }

    const currentAge = this.calculateAge(userData.personal.naissance1);
    const retirementAge = userData.retirement.rrqAgeActuel1 || 65;

    // Utiliser CPM2014 pour déterminer l'espérance de vie et l'horizon de planification
    const mortalityStrategy = this.calculateOptimalRetirementStrategy(userData, currentAge);
    const planningHorizon = Math.min(mortalityStrategy.recommendedAge, 100);

    const chartData = this.generateChartData(
      userData,
      calculations,
      currentAge,
      planningHorizon
    );

    const milestones = this.identifyMilestones(
      userData,
      calculations,
      currentAge,
      retirementAge
    );

    const metrics = this.calculateMetrics(
      userData,
      calculations,
      currentAge,
      retirementAge
    );

    return { chartData, milestones, metrics };
  }
  
  private static generateChartData(
    userData: UserData,
    calculations: Calculations,
    currentAge: number,
    maxAge: number
  ): ChartDataPoint[] {
    const data: ChartDataPoint[] = [];
    const currentYear = new Date().getFullYear();
    
    // Paramètres de projection IPF 2025
    const inflationRate = FINANCIAL_ASSUMPTIONS.INFLATION; // 2.1%
    const returnRate = FINANCIAL_ASSUMPTIONS.ACTIONS_CANADIENNES; // 6.6%
    const retirementAge = userData.retirement.rrqAgeActuel1 || 65;
    
    // Utiliser des valeurs sécurisées avec des fallbacks
    let capital = calculations?.netWorth || 0;
    let annualIncome = (userData.personal.salaire1 || 0) + (userData.personal.salaire2 || 0);
    let annualExpenses = (calculations?.monthlyExpenses || 0) * 12;
    
    for (let age = currentAge; age <= maxAge; age++) {
      const yearsFromNow = age - currentAge;
      const year = currentYear + yearsFromNow;
      const isRetired = age >= retirementAge;
      
      // Ajuster les revenus
      if (isRetired) {
        // Revenus de retraite
        annualIncome = this.calculateRetirementIncome(userData, age);
      } else {
      // Croissance des salaires avec l'inflation + productivité (IPF 2025)
      annualIncome = ((userData.personal.salaire1 || 0) + (userData.personal.salaire2 || 0)) * 
                    Math.pow(1 + FINANCIAL_ASSUMPTIONS.CROISSANCE_SALAIRE, yearsFromNow);
      }
      
      // Ajuster les dépenses avec l'inflation
      annualExpenses = (calculations?.monthlyExpenses || 0) * 12 * 
                      Math.pow(1 + inflationRate, yearsFromNow);
      
      // Réduire les dépenses à la retraite (généralement 70-80%)
      if (isRetired) {
        annualExpenses *= 0.75;
      }
      
      // Épargne annuelle
      const annualSavings = Math.max(0, annualIncome - annualExpenses);
      
      // Croissance du capital
      capital = capital * (1 + returnRate) + annualSavings;
      
      // Si capital négatif, on arrête
      if (capital < 0) capital = 0;
      
      data.push({
        age,
        year,
        capital: Math.round(capital),
        revenus: Math.round(annualIncome),
        depenses: Math.round(annualExpenses),
        valeurNette: Math.round(capital)
      });
    }
    
    return data;
  }
  
  private static calculateRetirementIncome(userData: UserData, age: number): number {
    let income = 0;
    
    // RRQ personne 1
    if (age >= userData.retirement.rrqAgeActuel1) {
      income += userData.retirement.rrqMontantActuel1 * 12;
    }
    
    // RRQ personne 2
    if (userData.personal.prenom2 && age >= userData.retirement.rrqAgeActuel2) {
      income += userData.retirement.rrqMontantActuel2 * 12;
    }
    
    // PSV (à 65 ans)
    if (age >= 65) {
      income += 8000; // Montant approximatif PSV par personne
      if (userData.personal.prenom2) income += 8000;
    }
    
    // Pensions privées
    income += userData.retirement.pensionPrivee1 + userData.retirement.pensionPrivee2;
    
    // Retrait REER/FERR (4% par année)
    const reerTotal = userData.savings.reer1 + userData.savings.reer2;
    income += reerTotal * 0.04;
    
    return income;
  }
  
  private static identifyMilestones(
    userData: UserData,
    calculations: Calculations,
    currentAge: number,
    retirementAge: number
  ): Milestone[] {
    const milestones: Milestone[] = [];
    const currentYear = new Date().getFullYear();
    
    // Vérifier que les calculs sont disponibles
    if (!calculations) {
      return milestones;
    }

    // Retraite principale
    milestones.push({
      age: retirementAge,
      year: currentYear + (retirementAge - currentAge),
      title: 'Retraite',
      description: `Début prévu de votre retraite à ${retirementAge} ans`,
      type: 'retirement',
      value: calculations.retirementCapital || 0
    });
    
    // RRQ personne 1
    if (userData.retirement.rrqAgeActuel1 && userData.retirement.rrqMontantActuel1) {
      milestones.push({
        age: userData.retirement.rrqAgeActuel1,
        year: currentYear + (userData.retirement.rrqAgeActuel1 - currentAge),
        title: `RRQ ${userData.personal.prenom1}`,
        description: `Début des prestations RRQ: ${userData.retirement.rrqMontantActuel1.toLocaleString('fr-CA')}$/mois`,
        type: 'goal',
        value: userData.retirement.rrqMontantActuel1 * 12
      });
    }
    
    // Objectif 1M$
    const projectionData = this.generateChartData(userData, calculations, currentAge, 85);
    const millionMilestone = projectionData.find(d => d.capital >= 1000000);
    if (millionMilestone) {
      milestones.push({
        age: millionMilestone.age,
        year: millionMilestone.year,
        title: 'Objectif 1M$',
        description: 'Votre capital atteindra 1 million de dollars',
        type: 'success',
        value: 1000000
      });
    }
    
    // Alerte si épuisement du capital
    const depletionPoint = projectionData.find((d, idx) => 
      idx > 0 && projectionData[idx - 1].capital > 0 && d.capital <= 0
    );
    if (depletionPoint) {
      milestones.push({
        age: depletionPoint.age,
        year: depletionPoint.year,
        title: 'Attention - Épuisement du capital',
        description: 'Risque d\'épuisement de votre capital selon les projections actuelles',
        type: 'warning'
      });
    }
    
    return milestones.sort((a, b) => a.age - b.age);
  }
  
  private static calculateMetrics(
    userData: UserData,
    calculations: Calculations,
    currentAge: number,
    retirementAge: number
  ): DashboardMetrics {
    // Vérifier que les calculs sont disponibles
    if (!calculations) {
      return {
        currentNetWorth: 0,
        projectedNetWorth: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        savingsRate: 0,
        retirementReadiness: 0,
        yearsToRetirement: Math.max(0, retirementAge - currentAge),
        estimatedRetirementIncome: 0
      };
    }

    const monthlyIncome = calculations.monthlyIncome || 0;
    const monthlyExpenses = calculations.monthlyExpenses || 0;
    const savingsRate = monthlyIncome > 0 
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 
      : 0;
    
    // Projection à la retraite
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    const projectedGrowthRate = 1.06; // 6% par année
    const projectedNetWorth = (calculations.netWorth || 0) * 
      Math.pow(projectedGrowthRate, yearsToRetirement);
    
    // Revenu de retraite estimé
    const estimatedRetirementIncome = this.calculateRetirementIncome(userData, retirementAge);
    
    // Score de préparation à la retraite (0-100)
    const targetRetirementCapital = estimatedRetirementIncome * 20; // Règle du 4%
    const retirementReadiness = targetRetirementCapital > 0 
      ? Math.min(100, (projectedNetWorth / targetRetirementCapital) * 100)
      : 0;
    
    return {
      currentNetWorth: calculations.netWorth || 0,
      projectedNetWorth,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      retirementReadiness,
      yearsToRetirement,
      estimatedRetirementIncome
    };
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
