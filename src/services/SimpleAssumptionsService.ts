/**
 * Service MVP pour les hypothèses de calcul simplifiées
 * Conçu pour la clientèle 55-90 ans avec interface seniors-friendly
 * 
 * @version 2025.1.0
 * @date 2025-01-09
 */

import { FINANCIAL_ASSUMPTIONS } from '../config/financial-assumptions';
import type { SimpleAssumptions, SimpleTooltip, TransparencyContext, TransparencyNotification } from '../types/assumptions-simple';

export class SimpleAssumptionsService {
  /**
   * Récupère les hypothèses principales IPF 2025
   */
  static getAssumptions(): SimpleAssumptions {
    return {
      inflation: FINANCIAL_ASSUMPTIONS.INFLATION,
      stockReturns: FINANCIAL_ASSUMPTIONS.ACTIONS_CANADIENNES,
      bondReturns: FINANCIAL_ASSUMPTIONS.REVENU_FIXE,
      salaryGrowth: FINANCIAL_ASSUMPTIONS.CROISSANCE_SALAIRE,
      source: FINANCIAL_ASSUMPTIONS.SOURCE,
      lastUpdated: "Janvier 2025"
    };
  }
  
  /**
   * Récupère les tooltips éducatifs simplifiés
   */
  static getTooltips(): Record<string, SimpleTooltip> {
    return {
      inflation: {
        title: "Inflation",
        description: "Hausse générale des prix chaque année",
        example: "100 $ aujourd'hui = 102,10 $ l'an prochain",
        icon: "📈"
      },
      stockReturns: {
        title: "Actions canadiennes",
        description: "Rendement moyen attendu des actions",
        example: "10 000 $ pourrait valoir 66 200 $ après 30 ans",
        icon: "📊"
      },
      bondReturns: {
        title: "Obligations",
        description: "Rendement des prêts gouvernementaux",
        example: "Plus stable que les actions, croissance plus lente",
        icon: "🏛️"
      },
      salaryGrowth: {
        title: "Croissance des salaires",
        description: "Augmentation moyenne des salaires",
        example: "50 000 $ aujourd'hui = 126 000 $ dans 30 ans",
        icon: "💰"
      }
    };
  }
  
  /**
   * Formate un pourcentage selon les normes OQLF
   * @param value Valeur décimale (ex: 0.021)
   * @returns Pourcentage formaté (ex: "2,1 %")
   */
  static formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1).replace('.', ',')} %`;
  }
  
  /**
   * Génère les notifications de transparence selon le contexte
   */
  static getTransparencyNotification(context: TransparencyContext): TransparencyNotification {
    const messages = {
      retirement: "Cette projection utilise un taux d'inflation de 2,1 % selon les normes IPF 2025",
      investment: "Rendement des actions canadiennes : 6,6 % (norme IPF 2025)",
      budget: "Croissance des salaires : 3,1 % par année (norme IPF 2025)",
      general: "Calculs basés sur les standards professionnels IPF 2025"
    };
    
    return {
      context,
      message: messages[context],
      detailsLink: "/hypotheses"
    };
  }
  
  /**
   * Calcule l'impact d'un montant avec inflation sur X années
   * @param amount Montant initial
   * @param years Nombre d'années
   * @returns Montant ajusté pour l'inflation
   */
  static calculateInflationImpact(amount: number, years: number): number {
    const assumptions = this.getAssumptions();
    return amount * Math.pow(1 + assumptions.inflation, years);
  }
  
  /**
   * Calcule la croissance d'un investissement en actions sur X années
   * @param amount Montant initial
   * @param years Nombre d'années
   * @returns Montant projeté
   */
  static calculateStockGrowth(amount: number, years: number): number {
    const assumptions = this.getAssumptions();
    return amount * Math.pow(1 + assumptions.stockReturns, years);
  }
  
  /**
   * Calcule la croissance d'un investissement en obligations sur X années
   * @param amount Montant initial
   * @param years Nombre d'années
   * @returns Montant projeté
   */
  static calculateBondGrowth(amount: number, years: number): number {
    const assumptions = this.getAssumptions();
    return amount * Math.pow(1 + assumptions.bondReturns, years);
  }
  
  /**
   * Calcule la croissance d'un salaire sur X années
   * @param salary Salaire initial
   * @param years Nombre d'années
   * @returns Salaire projeté
   */
  static calculateSalaryGrowth(salary: number, years: number): number {
    const assumptions = this.getAssumptions();
    return salary * Math.pow(1 + assumptions.salaryGrowth, years);
  }
  
  /**
   * Génère des exemples concrets pour l'éducation
   */
  static getEducationalExamples() {
    return {
      inflation: {
        title: "Impact de l'inflation",
        examples: [
          {
            description: "Panier d'épicerie de 100 $ aujourd'hui",
            result: `${this.formatPercentage(0.021)} = 102,10 $ l'an prochain`
          },
          {
            description: "Coût de la vie dans 10 ans",
            result: `100 $ aujourd'hui = ${Math.round(this.calculateInflationImpact(100, 10))} $ dans 10 ans`
          }
        ]
      },
      stocks: {
        title: "Croissance des actions",
        examples: [
          {
            description: "Placement de 10 000 $ en actions",
            result: `Pourrait valoir ${Math.round(this.calculateStockGrowth(10000, 30)).toLocaleString('fr-CA')} $ après 30 ans`
          },
          {
            description: "REER de 1 000 $ par année",
            result: "Pourrait accumuler plus de 100 000 $ en 20 ans"
          }
        ]
      },
      bonds: {
        title: "Sécurité des obligations",
        examples: [
          {
            description: "Placement de 10 000 $ en obligations",
            result: `Pourrait valoir ${Math.round(this.calculateBondGrowth(10000, 30)).toLocaleString('fr-CA')} $ après 30 ans`
          },
          {
            description: "Moins de risque que les actions",
            result: "Croissance plus lente mais plus prévisible"
          }
        ]
      },
      salary: {
        title: "Évolution des salaires",
        examples: [
          {
            description: "Salaire de 50 000 $ aujourd'hui",
            result: `Pourrait être ${Math.round(this.calculateSalaryGrowth(50000, 30)).toLocaleString('fr-CA')} $ dans 30 ans`
          },
          {
            description: "Augmentation annuelle moyenne",
            result: `${this.formatPercentage(FINANCIAL_ASSUMPTIONS.CROISSANCE_SALAIRE)} par année`
          }
        ]
      }
    };
  }
  
  /**
   * Valide que les hypothèses sont cohérentes
   */
  static validateAssumptions(): { isValid: boolean; warnings: string[] } {
    const assumptions = this.getAssumptions();
    const warnings: string[] = [];
    
    // Vérifications de base
    if (assumptions.stockReturns <= assumptions.bondReturns) {
      warnings.push("Les actions devraient avoir un rendement supérieur aux obligations");
    }
    
    if (assumptions.salaryGrowth <= assumptions.inflation) {
      warnings.push("La croissance des salaires devrait dépasser l'inflation");
    }
    
    if (assumptions.inflation < 0.01 || assumptions.inflation > 0.05) {
      warnings.push("Le taux d'inflation semble inhabituel");
    }
    
    return {
      isValid: warnings.length === 0,
      warnings
    };
  }
  
  /**
   * Génère un résumé pour les rapports
   */
  static getAssumptionsSummary(): string {
    const assumptions = this.getAssumptions();
    
    return `Hypothèses utilisées (${assumptions.source}) :
• Inflation : ${this.formatPercentage(assumptions.inflation)}
• Actions canadiennes : ${this.formatPercentage(assumptions.stockReturns)}
• Obligations : ${this.formatPercentage(assumptions.bondReturns)}
• Croissance des salaires : ${this.formatPercentage(assumptions.salaryGrowth)}

Ces hypothèses sont conformes aux standards professionnels de l'Institut de planification financière.`;
  }
}

export default SimpleAssumptionsService;
