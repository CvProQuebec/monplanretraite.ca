// src/features/retirement/services/TaxOptimizationService.ts
import { UserData, Calculations } from '../types';

export interface TaxOptimizationStrategy {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  potentialSavings: number;
  implementation: string;
  requirements?: string[];
  category: 'reer' | 'celi' | 'pension' | 'income_splitting' | 'other';
}

export interface TaxOptimizationResult {
  currentTaxBurden: number;
  optimizedTaxBurden: number;
  totalSavings: number;
  strategies: TaxOptimizationStrategy[];
  reerContributionRoom: number;
  celiContributionRoom: number;
  incomesSplittingOpportunities: number;
  pensionIncomeOptimization: number;
}

export class TaxOptimizationService {
  // Constantes fiscales 2024
  private static readonly FEDERAL_TAX_BRACKETS = [
    { min: 0, max: 55867, rate: 0.15 },
    { min: 55867, max: 111733, rate: 0.205 },
    { min: 111733, max: 173205, rate: 0.26 },
    { min: 173205, max: 246752, rate: 0.29 },
    { min: 246752, max: Infinity, rate: 0.33 }
  ];

  private static readonly QUEBEC_TAX_BRACKETS = [
    { min: 0, max: 51780, rate: 0.14 },
    { min: 51780, max: 103545, rate: 0.19 },
    { min: 103545, max: 126000, rate: 0.24 },
    { min: 126000, max: Infinity, rate: 0.2575 }
  ];

  private static readonly REER_LIMIT_2024 = 31560;
  private static readonly CELI_LIMIT_2024 = 7000;
  private static readonly PENSION_INCOME_AMOUNT = 2000;

  static analyzeOptimization(userData: UserData, calculations: Calculations): TaxOptimizationResult {
    const currentTaxBurden = this.calculateCurrentTaxBurden(userData);
    const strategies = this.generateOptimizationStrategies(userData, calculations);
    const optimizedTaxBurden = this.calculateOptimizedTaxBurden(userData, strategies);
    
    return {
      currentTaxBurden,
      optimizedTaxBurden,
      totalSavings: currentTaxBurden - optimizedTaxBurden,
      strategies: strategies.sort((a, b) => b.potentialSavings - a.potentialSavings),
      reerContributionRoom: this.calculateReerContributionRoom(userData),
      celiContributionRoom: this.calculateCeliContributionRoom(userData),
      incomesSplittingOpportunities: this.calculateIncomeSplittingOpportunities(userData),
      pensionIncomeOptimization: this.calculatePensionIncomeOptimization(userData)
    };
  }

  private static calculateCurrentTaxBurden(userData: UserData): number {
    const totalIncome = userData.personal.salaire1 + userData.personal.salaire2;
    const federalTax = this.calculateFederalTax(totalIncome);
    const provincialTax = this.calculateProvincialTax(totalIncome);
    
    return federalTax + provincialTax;
  }

  private static calculateOptimizedTaxBurden(userData: UserData, strategies: TaxOptimizationStrategy[]): number {
    const totalSavings = strategies.reduce((sum, strategy) => sum + strategy.potentialSavings, 0);
    return this.calculateCurrentTaxBurden(userData) - totalSavings;
  }

  private static generateOptimizationStrategies(userData: UserData, calculations: Calculations): TaxOptimizationStrategy[] {
    const strategies: TaxOptimizationStrategy[] = [];

    // Stratégie REER
    const reerStrategy = this.createReerStrategy(userData);
    if (reerStrategy) strategies.push(reerStrategy);

    // Stratégie CELI
    const celiStrategy = this.createCeliStrategy(userData);
    if (celiStrategy) strategies.push(celiStrategy);

    // Fractionnement de revenu
    const incomeSplittingStrategy = this.createIncomeSplittingStrategy(userData);
    if (incomeSplittingStrategy) strategies.push(incomeSplittingStrategy);

    // Optimisation du revenu de pension
    const pensionStrategy = this.createPensionOptimizationStrategy(userData);
    if (pensionStrategy) strategies.push(pensionStrategy);

    // Stratégies de retrait optimisées
    const withdrawalStrategy = this.createWithdrawalOptimizationStrategy(userData);
    if (withdrawalStrategy) strategies.push(withdrawalStrategy);

    return strategies;
  }

  private static createReerStrategy(userData: UserData): TaxOptimizationStrategy | null {
    const contributionRoom = this.calculateReerContributionRoom(userData);
    if (contributionRoom <= 0) return null;

    const marginalRate = this.calculateMarginalTaxRate(userData.personal.salaire1 + userData.personal.salaire2);
    const potentialSavings = contributionRoom * marginalRate;

    return {
      id: 'reer_optimization',
      title: 'Maximiser les contributions REER',
      description: `Vous pouvez contribuer ${contributionRoom.toLocaleString('fr-CA')} $ de plus à votre REER pour réduire vos impôts.`,
      priority: potentialSavings > 3000 ? 'high' : 'medium',
      potentialSavings,
      implementation: 'Augmentez vos contributions REER mensuelles ou effectuez une contribution forfaitaire avant la date limite.',
      requirements: ['Revenus d\'emploi ou de travail autonome', 'Droits de cotisation REER disponibles'],
      category: 'reer'
    };
  }

  private static createCeliStrategy(userData: UserData): TaxOptimizationStrategy | null {
    const contributionRoom = this.calculateCeliContributionRoom(userData);
    if (contributionRoom <= 0) return null;

    // Le CELI n'offre pas de déduction fiscale immédiate, mais évite l'imposition future
    const futureValue = contributionRoom * Math.pow(1.06, 20); // 6% sur 20 ans
    const futureTaxSavings = futureValue * 0.25; // Estimation 25% d'impôt évité

    return {
      id: 'celi_optimization',
      title: 'Maximiser les contributions CELI',
      description: `Contribuez ${contributionRoom.toLocaleString('fr-CA')} $ à votre CELI pour une croissance libre d'impôt.`,
      priority: 'medium',
      potentialSavings: futureTaxSavings,
      implementation: 'Maximisez vos contributions CELI annuelles pour bénéficier d\'une croissance libre d\'impôt.',
      requirements: ['Être résident canadien', 'Âgé de 18 ans ou plus'],
      category: 'celi'
    };
  }

  private static createIncomeSplittingStrategy(userData: UserData): TaxOptimizationStrategy | null {
    const income1 = userData.personal.salaire1;
    const income2 = userData.personal.salaire2;
    
    if (Math.abs(income1 - income2) < 20000) return null; // Pas assez de différence pour justifier

    const totalIncome = income1 + income2;
    const currentTax = this.calculateFederalTax(income1) + this.calculateProvincialTax(income1) +
                      this.calculateFederalTax(income2) + this.calculateProvincialTax(income2);
    
    const splitIncome = totalIncome / 2;
    const optimizedTax = (this.calculateFederalTax(splitIncome) + this.calculateProvincialTax(splitIncome)) * 2;
    
    const potentialSavings = Math.max(0, currentTax - optimizedTax) * 0.5; // Conservative estimate

    if (potentialSavings < 500) return null;

    return {
      id: 'income_splitting',
      title: 'Fractionnement de revenu',
      description: `Optimisez la répartition des revenus entre conjoints pour réduire l'impôt total.`,
      priority: potentialSavings > 2000 ? 'high' : 'medium',
      potentialSavings,
      implementation: 'Utilisez des stratégies comme le prêt au conjoint, la répartition des dividendes ou les contributions au REER du conjoint.',
      requirements: ['Être marié ou en union de fait', 'Écart de revenus significatif'],
      category: 'income_splitting'
    };
  }

  private static createPensionOptimizationStrategy(userData: UserData): TaxOptimizationStrategy | null {
    const hasPrivatePension = userData.retirement.pensionPrivee1 > 0 || userData.retirement.pensionPrivee2 > 0;
    if (!hasPrivatePension) return null;

    const potentialSavings = this.PENSION_INCOME_AMOUNT * 0.25; // 25% tax rate assumption

    return {
      id: 'pension_optimization',
      title: 'Optimisation du revenu de pension',
      description: 'Profitez du crédit pour revenu de pension et des stratégies de fractionnement.',
      priority: 'medium',
      potentialSavings,
      implementation: 'Divisez les revenus de pension admissibles avec votre conjoint et réclamez le crédit pour revenu de pension.',
      requirements: ['Revenu de pension admissible', 'Âgé de 65 ans ou plus (ou 55+ pour certains types)'],
      category: 'pension'
    };
  }

  private static createWithdrawalOptimizationStrategy(userData: UserData): TaxOptimizationStrategy | null {
    const totalSavings = userData.savings.reer1 + userData.savings.reer2 + 
                        userData.savings.celi1 + userData.savings.celi2;
    
    if (totalSavings < 100000) return null;

    const potentialSavings = totalSavings * 0.02; // 2% improvement through optimization

    return {
      id: 'withdrawal_optimization',
      title: 'Stratégie de retrait optimisée',
      description: 'Planifiez vos retraits pour minimiser l\'impact fiscal à la retraite.',
      priority: 'medium',
      potentialSavings,
      implementation: 'Établissez une séquence de retrait optimale : CELI d\'abord, puis REER/FERR, puis comptes non enregistrés.',
      requirements: ['Épargne-retraite substantielle', 'Planification à long terme'],
      category: 'other'
    };
  }

  private static calculateReerContributionRoom(userData: UserData): number {
    const totalIncome = userData.personal.salaire1 + userData.personal.salaire2;
    const allowableContribution = Math.min(totalIncome * 0.18, this.REER_LIMIT_2024);
    const currentContributions = userData.savings.reer1 + userData.savings.reer2;
    
    return Math.max(0, allowableContribution - currentContributions * 0.1); // Rough estimate
  }

  private static calculateCeliContributionRoom(userData: UserData): number {
    const currentAge1 = this.calculateAge(userData.personal.naissance1);
    const currentAge2 = this.calculateAge(userData.personal.naissance2);
    
    const yearsEligible1 = Math.max(0, currentAge1 - 18);
    const yearsEligible2 = Math.max(0, currentAge2 - 18);
    
    const totalRoom = (yearsEligible1 + yearsEligible2) * this.CELI_LIMIT_2024;
    const currentContributions = userData.savings.celi1 + userData.savings.celi2;
    
    return Math.max(0, totalRoom - currentContributions);
  }

  private static calculateIncomeSplittingOpportunities(userData: UserData): number {
    const income1 = userData.personal.salaire1;
    const income2 = userData.personal.salaire2;
    
    if (Math.abs(income1 - income2) < 20000) return 0;

    const currentTax = this.calculateTotalTax(income1) + this.calculateTotalTax(income2);
    const splitTax = this.calculateTotalTax((income1 + income2) / 2) * 2;
    
    return Math.max(0, currentTax - splitTax) * 0.5;
  }

  private static calculatePensionIncomeOptimization(userData: UserData): number {
    const hasPrivatePension = userData.retirement.pensionPrivee1 > 0 || userData.retirement.pensionPrivee2 > 0;
    return hasPrivatePension ? this.PENSION_INCOME_AMOUNT * 0.25 : 0;
  }

  private static calculateFederalTax(income: number): number {
    let tax = 0;
    let remainingIncome = income;

    for (const bracket of this.FEDERAL_TAX_BRACKETS) {
      if (remainingIncome <= 0) break;
      
      const taxableInThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      tax += taxableInThisBracket * bracket.rate;
      remainingIncome -= taxableInThisBracket;
    }

    return tax;
  }

  private static calculateProvincialTax(income: number): number {
    let tax = 0;
    let remainingIncome = income;

    for (const bracket of this.QUEBEC_TAX_BRACKETS) {
      if (remainingIncome <= 0) break;
      
      const taxableInThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      tax += taxableInThisBracket * bracket.rate;
      remainingIncome -= taxableInThisBracket;
    }

    return tax;
  }

  private static calculateTotalTax(income: number): number {
    return this.calculateFederalTax(income) + this.calculateProvincialTax(income);
  }

  private static calculateMarginalTaxRate(income: number): number {
    // Find the marginal tax rate (federal + provincial)
    let federalRate = 0.15; // Default to lowest bracket
    let provincialRate = 0.14; // Default to lowest bracket

    for (const bracket of this.FEDERAL_TAX_BRACKETS) {
      if (income > bracket.min) {
        federalRate = bracket.rate;
      }
    }

    for (const bracket of this.QUEBEC_TAX_BRACKETS) {
      if (income > bracket.min) {
        provincialRate = bracket.rate;
      }
    }

    return federalRate + provincialRate;
  }

  private static calculateAge(birthDate: string): number {
    if (!birthDate) return 0;
    
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return Math.max(0, age);
    } catch (error) {
      return 0;
    }
  }
}