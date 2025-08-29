// src/features/retirement/services/CalculationService.ts
import { UserData, Calculations, RRQOptimizationResult } from '../types';

export class CalculationService {
  // Constantes pour les calculs
  private static readonly INFLATION_RATE = 0.02; // 2% par année
  private static readonly INVESTMENT_RETURN = 0.06; // 6% par année
  private static readonly TAX_RATE = 0.30; // 30% taux marginal moyen
  private static readonly RETIREMENT_EXPENSE_RATIO = 0.75; // 75% des dépenses actuelles
  private static readonly WITHDRAWAL_RATE = 0.04; // 4% règle de retrait

  static calculateAll(userData: UserData): Calculations {
    try {
      return {
        netWorth: this.calculateNetWorth(userData),
        retirementCapital: this.calculateRetirementCapital(userData),
        sufficiency: this.calculateSufficiency(userData),
        taxSavings: this.calculateTaxSavings(userData),
        monthlyIncome: this.calculateMonthlyIncome(userData),
        monthlyExpenses: this.calculateMonthlyExpenses(userData),
        rrqOptimization: this.calculateRRQOptimization(userData.retirement)
      };
    } catch (error) {
      console.error('Erreur dans les calculs:', error);
      throw new Error('Erreur lors des calculs financiers');
    }
  }

  static calculateNetWorth(userData: UserData): number {
    try {
      const { savings } = userData;
      
      // Validation des données
      if (!savings) {
        throw new Error('Données d\'épargne manquantes');
      }

      const totalSavings = 
        this.safeAdd(savings.reer1, savings.reer2) +
        this.safeAdd(savings.celi1, savings.celi2) +
        this.safeAdd(savings.placements1, savings.placements2) +
        this.safeAdd(savings.epargne1, savings.epargne2) +
        this.safeAdd(savings.cri1, savings.cri2);
      
      const realEstate = this.safeSubtract(savings.residenceValeur, savings.residenceHypotheque);
      
      return Math.max(0, totalSavings + realEstate);
    } catch (error) {
      console.error('Erreur calcul valeur nette:', error);
      return 0;
    }
  }

  static calculateRetirementCapital(userData: UserData): number {
    try {
      const { savings } = userData;
      
      if (!savings) {
        throw new Error('Données d\'épargne manquantes');
      }

      const capital = 
        this.safeAdd(savings.reer1, savings.reer2) +
        this.safeAdd(savings.celi1, savings.celi2) +
        this.safeAdd(savings.placements1, savings.placements2) +
        this.safeAdd(savings.cri1, savings.cri2);
      
      // Projection avec croissance et épargne future
      const yearsToRetirement = this.calculateYearsToRetirement(userData);
      const futureSavings = this.calculateFutureSavings(userData, yearsToRetirement);
      
      return capital * Math.pow(1 + this.INVESTMENT_RETURN, yearsToRetirement) + futureSavings;
    } catch (error) {
      console.error('Erreur calcul capital retraite:', error);
      return 0;
    }
  }

  static calculateSufficiency(userData: UserData): number {
    try {
      const capital = this.calculateRetirementCapital(userData);
      const target = this.calculateRetirementTarget(userData);
      
      if (target <= 0) return 0;
      
      return Math.min(100, Math.round((capital / target) * 100));
    } catch (error) {
      console.error('Erreur calcul suffisance:', error);
      return 0;
    }
  }

  static calculateTaxSavings(userData: UserData): number {
    try {
      const { savings } = userData;
      
      if (!savings) return 0;

      // Économies REER (contribution annuelle * taux marginal)
      const reerContribution = this.safeAdd(savings.reer1, savings.reer2);
      const annualContribution = Math.min(reerContribution * 0.18, 29290); // Limite REER 2024
      
      return annualContribution * this.TAX_RATE;
    } catch (error) {
      console.error('Erreur calcul économies fiscales:', error);
      return 0;
    }
  }

  static calculateMonthlyIncome(userData: UserData): number {
    try {
      const { personal } = userData;
      
      if (!personal) return 0;

      return this.safeAdd(personal.salaire1, personal.salaire2) / 12;
    } catch (error) {
      console.error('Erreur calcul revenus mensuels:', error);
      return 0;
    }
  }

  static calculateMonthlyExpenses(userData: UserData): number {
    try {
      const { cashflow } = userData;
      
      if (!cashflow) return 0;

      return Object.values(cashflow).reduce((sum, expense) => 
        this.safeAdd(sum, expense || 0), 0
      );
    } catch (error) {
      console.error('Erreur calcul dépenses mensuelles:', error);
      return 0;
    }
  }

  static calculateRRQOptimization(retirement: UserData['retirement']): RRQOptimizationResult | undefined {
    try {
      const {
        rrqAgeActuel1,
        rrqMontantActuel1,
        rrqMontant70_1,
        esperanceVie1
      } = retirement;

      if (!rrqAgeActuel1 || !rrqMontantActuel1 || !rrqMontant70_1) {
        return undefined;
      }

      // Validation des données
      if (rrqAgeActuel1 >= 70) {
        return {
          totalMaintenant: 0,
          total70: 0,
          montantPerdu: 0,
          ageRentabilite: rrqAgeActuel1,
          valeurActualiseeMaintenant: 0,
          valeurActualisee70: 0,
          recommandation: 'Vous avez déjà 70 ans ou plus. Commencez maintenant.',
          difference: 0
        };
      }

      // Calculs pour commencer maintenant
      const anneesRestantesMaintenant = Math.max(0, esperanceVie1 - rrqAgeActuel1);
      const totalMaintenant = rrqMontantActuel1 * 12 * anneesRestantesMaintenant;

      // Calculs pour attendre à 70 ans
      const moisPerdus = (70 - rrqAgeActuel1) * 12;
      const montantPerdu = rrqMontantActuel1 * moisPerdus;
      const anneesRestantes70 = Math.max(0, esperanceVie1 - 70);
      const total70 = rrqMontant70_1 * 12 * anneesRestantes70;

      // Point de rentabilité
      const gainMensuel = rrqMontant70_1 - rrqMontantActuel1;
      const moisPourRecuperer = gainMensuel > 0 ? montantPerdu / gainMensuel : 0;
      const ageRentabilite = 70 + (moisPourRecuperer / 12);

      // Calcul de la valeur actualisée
      const valeurActualiseeMaintenant = this.calculatePresentValue(
        rrqMontantActuel1 * 12,
        anneesRestantesMaintenant,
        this.INFLATION_RATE
      );

      const valeurActualisee70 = this.calculatePresentValue(
        rrqMontant70_1 * 12,
        anneesRestantes70,
        this.INFLATION_RATE
      );

      // Recommandation personnalisée
      let recommandation = '';
      let difference = 0;

      if (valeurActualiseeMaintenant > valeurActualisee70) {
        difference = valeurActualiseeMaintenant - valeurActualisee70;
        recommandation = `Commencer MAINTENANT est plus avantageux. Vous gagneriez ${Math.round(difference).toLocaleString('fr-CA')} $ en valeur actualisée.`;
      } else {
        difference = valeurActualisee70 - valeurActualiseeMaintenant;
        recommandation = `Attendre à 70 ans pourrait être avantageux. Vous gagneriez ${Math.round(difference).toLocaleString('fr-CA')} $ en valeur actualisée.`;
      }

      return {
        totalMaintenant,
        total70,
        montantPerdu,
        ageRentabilite,
        valeurActualiseeMaintenant,
        valeurActualisee70,
        recommandation,
        difference
      };
    } catch (error) {
      console.error('Erreur calcul optimisation RRQ:', error);
      return undefined;
    }
  }

  // Méthodes utilitaires privées
  private static safeAdd(a: number, b: number): number {
    return (a || 0) + (b || 0);
  }

  private static safeSubtract(a: number, b: number): number {
    return (a || 0) - (b || 0);
  }

  private static calculateYearsToRetirement(userData: UserData): number {
    const currentAge = this.calculateAge(userData.personal.naissance1);
    const retirementAge = userData.retirement.rrqAgeActuel1 || 65;
    return Math.max(0, retirementAge - currentAge);
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
      console.error('Erreur calcul âge:', error);
      return 0;
    }
  }

  private static calculateFutureSavings(userData: UserData, years: number): number {
    const monthlyIncome = this.calculateMonthlyIncome(userData);
    const monthlyExpenses = this.calculateMonthlyExpenses(userData);
    const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);
    
    // Calcul avec intérêts composés
    let totalSavings = 0;
    for (let i = 0; i < years; i++) {
      totalSavings = (totalSavings + monthlySavings * 12) * (1 + this.INVESTMENT_RETURN);
    }
    
    return totalSavings;
  }

  private static calculateRetirementTarget(userData: UserData): number {
    const monthlyExpenses = this.calculateMonthlyExpenses(userData);
    const retirementExpenses = monthlyExpenses * this.RETIREMENT_EXPENSE_RATIO * 12;
    
    // Règle du 4% : capital nécessaire = dépenses annuelles / 4%
    return retirementExpenses / this.WITHDRAWAL_RATE;
  }

  private static calculatePresentValue(annualPayment: number, years: number, rate: number): number {
    if (years <= 0 || rate <= 0) return 0;
    
    let presentValue = 0;
    for (let i = 0; i < years; i++) {
      presentValue += annualPayment / Math.pow(1 + rate, i);
    }
    
    return presentValue;
  }
}