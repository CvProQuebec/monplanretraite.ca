import FINANCIAL_ASSUMPTIONS, { FINANCIAL_UTILS, MORTALITY_CPM2014 } from '../config/financial-assumptions';
import { formatMontantOQLF } from '../utils/formatters';

export interface ComparisonScenario {
  name: string;
  description: string;
  assumptions: {
    inflation: number;
    stockReturns: number;
    bondReturns: number;
    lifeExpectancy: number; // in years from current age
  };
  source: string;
}

export interface UserProfile {
  currentAge: number;
  gender: 'male' | 'female';
  currentSavings: number;
  monthlyContribution: number;
  retirementAge: number;
  desiredIncome: number; // monthly desired income at retirement, in nominal CAD
}

export interface ComparisonResult {
  scenario: ComparisonScenario;
  projectedCapital: number;
  monthlyRetirementIncome: number;
  capitalShortfall: number;
  planningAge: number;
  confidence: number; // 0..1
}

export interface ComparisonAdvantage {
  category: string;
  advantage: number;
  percentage: number;
  message: string;
  explanation: string;
}

export class CompetitiveComparisonService {
  /**
   * Génère comparaison complète pour démonstration
   */
  static generateComparison(profile: UserProfile): {
    monplanretraite: ComparisonResult;
    generic: ComparisonResult;
    conservative: ComparisonResult;
    advantages: ComparisonAdvantage[];
  } {
    // Scénario 1: MonPlanRetraite.ca (IPF 2025 + CPM2014)
    const ipfScenario: ComparisonScenario = {
      name: 'MonPlanRetraite.ca',
      description: 'Normes IPF 2025 + Table CPM2014',
      assumptions: {
        inflation: FINANCIAL_ASSUMPTIONS.INFLATION,
        stockReturns: FINANCIAL_ASSUMPTIONS.ACTIONS_CANADIENNES,
        bondReturns: FINANCIAL_ASSUMPTIONS.REVENU_FIXE,
        lifeExpectancy: this.getLifeExpectancyCPM2014(profile.currentAge, profile.gender),
      },
      source: 'Institut de planification financière + Institut canadien des actuaires',
    };

    // Scénario 2: Calculateur générique (hypothèses approximatives)
    const genericScenario: ComparisonScenario = {
      name: 'Calculateur générique',
      description: 'Hypothèses approximatives moyennes',
      assumptions: {
        inflation: 0.02, // 2% vs 2.1% IPF
        stockReturns: 0.06, // 6% vs 6.6% IPF
        bondReturns: 0.03, // 3% vs 3.4% IPF
        lifeExpectancy: this.getGenericLifeExpectancy(profile.currentAge, profile.gender),
      },
      source: 'Estimations approximatives',
    };

    // Scénario 3: Calculateur conservateur
    const conservativeScenario: ComparisonScenario = {
      name: 'Calculateur conservateur',
      description: 'Hypothèses pessimistes',
      assumptions: {
        inflation: 0.025, // 2.5% inflation élevée
        stockReturns: 0.055, // 5.5% rendement prudent
        bondReturns: 0.025, // 2.5% obligations
        lifeExpectancy: this.getLifeExpectancyCPM2014(profile.currentAge, profile.gender) + 3, // +3 ans sécurité
      },
      source: 'Approche très prudente',
    };

    // Calculer projections pour chaque scénario
    const monplanResult = this.calculateProjection(profile, ipfScenario, 'ipf');
    const genericResult = this.calculateProjection(profile, genericScenario, 'generic');
    const conservativeResult = this.calculateProjection(profile, conservativeScenario, 'conservative');

    // Calculer avantages
    const advantages = this.calculateAdvantages(monplanResult, genericResult, conservativeResult);

    return {
      monplanretraite: monplanResult,
      generic: genericResult,
      conservative: conservativeResult,
      advantages,
    };
  }

  /**
   * Projection capital et revenus à la retraite selon les hypothèses du scénario
   */
  private static calculateProjection(
    profile: UserProfile,
    scenario: ComparisonScenario,
    kind: 'ipf' | 'generic' | 'conservative'
  ): ComparisonResult {
    const currentAge = Math.max(0, profile.currentAge);
    const retirementAge = Math.max(currentAge, profile.retirementAge);
    const months = Math.max(0, Math.round((retirementAge - currentAge) * 12));

    // Allocation par âge, puis rendement pondéré selon hypothèses du scénario
    const allocation = FINANCIAL_UTILS.getAllocationByAge(currentAge);
    const nominalReturn =
      allocation.actions * scenario.assumptions.stockReturns +
      allocation.obligations * scenario.assumptions.bondReturns +
      allocation.liquidites * FINANCIAL_ASSUMPTIONS.COURT_TERME;

    // Projection mensuelle (nominale) avec cotisations constantes
    let capital = Math.max(0, profile.currentSavings || 0);
    const contrib = Math.max(0, profile.monthlyContribution || 0);
    const monthlyRate = nominalReturn / 12;

    if (months > 0) {
      for (let i = 0; i < months; i++) {
        capital = capital * (1 + monthlyRate) + contrib;
      }
    }

    // Calcul d'un revenu mensuel soutenable à la retraite via annuité réelle
    const yearsLE = Math.max(1, scenario.assumptions.lifeExpectancy);
    const n = Math.round(yearsLE * 12);
    const realMonthlyRate = Math.max(0, (nominalReturn - scenario.assumptions.inflation) / 12);

    const monthlyIncome =
      n > 0
        ? realMonthlyRate > 0.000001
          ? capital * (realMonthlyRate / (1 - Math.pow(1 + realMonthlyRate, -n)))
          : capital / n
        : 0;

    // Capital requis pour atteindre le revenu désiré
    const desiredMonthly = Math.max(0, profile.desiredIncome || 0);
    const requiredCapital =
      n > 0
        ? realMonthlyRate > 0.000001
          ? desiredMonthly * ((1 - Math.pow(1 + realMonthlyRate, -n)) / realMonthlyRate)
          : desiredMonthly * n
        : 0;

    const capitalShortfall = Math.max(0, requiredCapital - capital);

    // Âge de planification recommandé
    let planningAge: number;
    if (kind === 'generic') {
      // Approche générique simpliste: âge final ~ âge + espérance + 2 ans
      planningAge = Math.min(100, Math.round(profile.currentAge + scenario.assumptions.lifeExpectancy + 2));
    } else {
      planningAge = MORTALITY_CPM2014.getRecommendedPlanningAge(profile.currentAge, profile.gender);
    }

    // Confiance indicative
    const confidence = kind === 'ipf' ? 0.85 : kind === 'conservative' ? 0.7 : 0.6;

    return {
      scenario,
      projectedCapital: Math.max(0, Math.round(capital)),
      monthlyRetirementIncome: Math.max(0, Math.round(monthlyIncome)),
      capitalShortfall: Math.max(0, Math.round(capitalShortfall)),
      planningAge,
      confidence,
    };
  }

  /**
   * Calcule les avantages concrets en dollars
   */
  private static calculateAdvantages(
    ipf: ComparisonResult,
    generic: ComparisonResult,
    conservative: ComparisonResult
  ): ComparisonAdvantage[] {
    const advantages: ComparisonAdvantage[] = [];

    // Avantage capital vs générique
    const capitalAdvantage = ipf.projectedCapital - generic.projectedCapital;
    if (capitalAdvantage > 0 && generic.projectedCapital > 0) {
      advantages.push({
        category: 'Capital de retraite',
        advantage: capitalAdvantage,
        percentage: (capitalAdvantage / generic.projectedCapital) * 100,
        message: `Nos calculs IPF 2025 projettent ${formatMontantOQLF(capitalAdvantage)} de plus pour votre retraite`,
        explanation:
          'Grâce aux hypothèses IPF 2025 plus précises (6,6 % vs 6 % actions, 2,1 % vs 2 % inflation)',
      });
    }

    // Avantage planning age vs générique
    const planningAdvantage = generic.planningAge - ipf.planningAge;
    if (planningAdvantage > 0) {
      advantages.push({
        category: 'Planification plus précise',
        advantage: planningAdvantage,
        percentage: 0,
        message: `Notre table CPM2014 permet une planification ${planningAdvantage.toFixed(1)} années plus précise`,
        explanation: 'Table officielle Institut canadien des actuaires vs estimations génériques',
      });
    }

    // Avantage revenus vs conservateur
    const incomeAdvantage = ipf.monthlyRetirementIncome - conservative.monthlyRetirementIncome;
    if (incomeAdvantage > 0 && conservative.monthlyRetirementIncome > 0) {
      advantages.push({
        category: 'Revenus de retraite',
        advantage: incomeAdvantage * 12, // Annuel
        percentage: (incomeAdvantage / conservative.monthlyRetirementIncome) * 100,
        message: `${formatMontantOQLF(incomeAdvantage * 12)} de revenus supplémentaires par année vs approche conservatrice`,
        explanation: 'Optimisation équilibrée basée sur données officielles plutôt que pessimisme excessif',
      });
    }

    return advantages;
  }

  // Méthodes utilitaires
  static getLifeExpectancyCPM2014(age: number, gender: 'male' | 'female'): number {
    const result = MORTALITY_CPM2014.calculateLifeExpectancy({ age, gender });
    // calculateLifeExpectancyCPM2014 renvoie { lifeExpectancy, ... } — déjà en années
    return Math.max(1, result.lifeExpectancy);
  }

  static getGenericLifeExpectancy(age: number, gender: 'male' | 'female'): number {
    // Approximation simpliste utilisée par calculateurs génériques
    const baseExpectancy = gender === 'male' ? 79 : 83; // Moyennes Canada approximatives
    return Math.max(1, baseExpectancy - age);
  }
}

export default CompetitiveComparisonService;
