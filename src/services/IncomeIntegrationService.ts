import { IncomeEntry } from '@/components/ui/UnifiedIncomeTable';

/**
 * Service d'intégration des revenus unifié
 * Assure que les données du tableau unifié des revenus sont correctement
 * intégrées avec l'assistant financier, l'optimisation fiscale et les rapports
 */
export class IncomeIntegrationService {
  
  /**
   * Convertit les données du tableau unifié en format compatible avec l'assistant financier
   */
  static convertToFinancialAssistantFormat(
    unifiedIncome1: IncomeEntry[] = [],
    unifiedIncome2: IncomeEntry[] = []
  ) {
    const person1Income = this.calculateTotalMonthlyIncome(unifiedIncome1);
    const person2Income = this.calculateTotalMonthlyIncome(unifiedIncome2);
    
    return {
      monthlyIncome: person1Income + person2Income,
      person1MonthlyIncome: person1Income,
      person2MonthlyIncome: person2Income,
      incomeBreakdown: {
        person1: this.getIncomeBreakdown(unifiedIncome1),
        person2: this.getIncomeBreakdown(unifiedIncome2)
      },
      temporaryIncome: this.getTemporaryIncomeInfo(unifiedIncome1, unifiedIncome2),
      eiToDateAmounts: this.getEIToDateAmounts(unifiedIncome1, unifiedIncome2)
    };
  }

  /**
   * Convertit les données pour l'optimisation fiscale
   */
  static convertToTaxOptimizationFormat(
    unifiedIncome1: IncomeEntry[] = [],
    unifiedIncome2: IncomeEntry[] = []
  ) {
    return {
      person1: {
        salaryIncome: this.getIncomeByType(unifiedIncome1, 'salaire'),
        pensionIncome: this.getIncomeByType(unifiedIncome1, 'rentes'),
        eiIncome: this.getIncomeByType(unifiedIncome1, 'assurance-emploi'),
        dividendIncome: this.getIncomeByType(unifiedIncome1, 'dividendes'),
        rentalIncome: this.getIncomeByType(unifiedIncome1, 'revenus-location'),
        selfEmploymentIncome: this.getIncomeByType(unifiedIncome1, 'travail-autonome'),
        otherIncome: this.getIncomeByType(unifiedIncome1, 'autres'),
        totalAnnualIncome: this.calculateTotalAnnualIncome(unifiedIncome1)
      },
      person2: {
        salaryIncome: this.getIncomeByType(unifiedIncome2, 'salaire'),
        pensionIncome: this.getIncomeByType(unifiedIncome2, 'rentes'),
        eiIncome: this.getIncomeByType(unifiedIncome2, 'assurance-emploi'),
        dividendIncome: this.getIncomeByType(unifiedIncome2, 'dividendes'),
        rentalIncome: this.getIncomeByType(unifiedIncome2, 'revenus-location'),
        selfEmploymentIncome: this.getIncomeByType(unifiedIncome2, 'travail-autonome'),
        otherIncome: this.getIncomeByType(unifiedIncome2, 'autres'),
        totalAnnualIncome: this.calculateTotalAnnualIncome(unifiedIncome2)
      },
      combinedAnnualIncome: this.calculateTotalAnnualIncome([...unifiedIncome1, ...unifiedIncome2])
    };
  }

  /**
   * Convertit les données pour la génération de rapports
   */
  static convertToReportFormat(
    unifiedIncome1: IncomeEntry[] = [],
    unifiedIncome2: IncomeEntry[] = []
  ) {
    return {
      incomeAnalysis: {
        person1: {
          name: 'Person 1', // À remplacer par le vrai nom
          totalAnnual: this.calculateTotalAnnualIncome(unifiedIncome1),
          totalMonthly: this.calculateTotalMonthlyIncome(unifiedIncome1),
          sources: unifiedIncome1.filter(entry => entry.isActive).map(entry => ({
            type: entry.type,
            description: entry.description,
            annualAmount: entry.projectedAnnual || 0,
            monthlyAmount: this.getMonthlyAmount(entry),
            frequency: this.getFrequency(entry.type),
            isTemporary: entry.type === 'assurance-emploi',
            toDateAmount: entry.toDateAmount
          }))
        },
        person2: {
          name: 'Person 2', // À remplacer par le vrai nom
          totalAnnual: this.calculateTotalAnnualIncome(unifiedIncome2),
          totalMonthly: this.calculateTotalMonthlyIncome(unifiedIncome2),
          sources: unifiedIncome2.filter(entry => entry.isActive).map(entry => ({
            type: entry.type,
            description: entry.description,
            annualAmount: entry.projectedAnnual || 0,
            monthlyAmount: this.getMonthlyAmount(entry),
            frequency: this.getFrequency(entry.type),
            isTemporary: entry.type === 'assurance-emploi',
            toDateAmount: entry.toDateAmount
          }))
        }
      },
      riskAnalysis: {
        temporaryIncomeRisk: this.assessTemporaryIncomeRisk(unifiedIncome1, unifiedIncome2),
        incomeConcentrationRisk: this.assessIncomeConcentration(unifiedIncome1, unifiedIncome2),
        eiDependencyRisk: this.assessEIDependency(unifiedIncome1, unifiedIncome2)
      },
      recommendations: this.generateIncomeRecommendations(unifiedIncome1, unifiedIncome2)
    };
  }

  /**
   * Calcule le revenu mensuel total pour une personne
   */
  private static calculateTotalMonthlyIncome(incomeEntries: IncomeEntry[]): number {
    return incomeEntries
      .filter(entry => entry.isActive)
      .reduce((total, entry) => {
        return total + this.getMonthlyAmount(entry);
      }, 0);
  }

  /**
   * Calcule le revenu annuel total pour une personne
   */
  private static calculateTotalAnnualIncome(incomeEntries: IncomeEntry[]): number {
    return incomeEntries
      .filter(entry => entry.isActive)
      .reduce((total, entry) => {
        return total + (entry.projectedAnnual || 0);
      }, 0);
  }

  /**
   * Obtient le montant mensuel d'une entrée de revenu
   */
  private static getMonthlyAmount(entry: IncomeEntry): number {
    switch (entry.type) {
      case 'salaire':
      case 'dividendes':
      case 'travail-autonome':
      case 'autres':
        return (entry.projectedAnnual || 0) / 12;
      
      case 'rentes':
      case 'revenus-location':
        return entry.monthlyAmount || 0;
      
      case 'assurance-emploi':
        return (entry.weeklyNet || 0) * 4.33; // Moyenne de semaines par mois
      
      default:
        return 0;
    }
  }

  /**
   * Obtient la fréquence d'un type de revenu
   */
  private static getFrequency(type: string): string {
    const frequencies = {
      'salaire': 'annual',
      'rentes': 'monthly',
      'assurance-emploi': 'weekly',
      'dividendes': 'annual',
      'revenus-location': 'monthly',
      'travail-autonome': 'annual',
      'autres': 'annual'
    };
    return frequencies[type as keyof typeof frequencies] || 'annual';
  }

  /**
   * Obtient les revenus par type pour une personne
   */
  private static getIncomeByType(incomeEntries: IncomeEntry[], type: string): number {
    const entry = incomeEntries.find(e => e.type === type && e.isActive);
    return entry ? (entry.projectedAnnual || 0) : 0;
  }

  /**
   * Obtient la répartition des revenus par type
   */
  private static getIncomeBreakdown(incomeEntries: IncomeEntry[]) {
    const breakdown: Record<string, number> = {};
    
    incomeEntries
      .filter(entry => entry.isActive)
      .forEach(entry => {
        breakdown[entry.type] = (breakdown[entry.type] || 0) + (entry.projectedAnnual || 0);
      });
    
    return breakdown;
  }

  /**
   * Obtient les informations sur les revenus temporaires
   */
  private static getTemporaryIncomeInfo(
    unifiedIncome1: IncomeEntry[],
    unifiedIncome2: IncomeEntry[]
  ) {
    const allEntries = [...unifiedIncome1, ...unifiedIncome2];
    const temporaryEntries = allEntries.filter(entry => 
      entry.isActive && entry.type === 'assurance-emploi'
    );

    return {
      hasTemporaryIncome: temporaryEntries.length > 0,
      totalTemporaryAnnual: temporaryEntries.reduce((sum, entry) => 
        sum + (entry.projectedAnnual || 0), 0
      ),
      temporaryEntries: temporaryEntries.map(entry => ({
        description: entry.description,
        weeklyAmount: entry.weeklyNet || 0,
        startDate: entry.startDate,
        endDate: entry.endDate,
        weeksUsed: entry.weeksUsed,
        maxWeeks: entry.maxWeeks,
        toDateAmount: entry.toDateAmount || 0
      }))
    };
  }

  /**
   * Obtient les montants d'assurance emploi "à ce jour"
   */
  private static getEIToDateAmounts(
    unifiedIncome1: IncomeEntry[],
    unifiedIncome2: IncomeEntry[]
  ) {
    const allEntries = [...unifiedIncome1, ...unifiedIncome2];
    const eiEntries = allEntries.filter(entry => 
      entry.isActive && entry.type === 'assurance-emploi' && entry.toDateAmount
    );

    return {
      person1ToDate: unifiedIncome1
        .filter(entry => entry.isActive && entry.type === 'assurance-emploi')
        .reduce((sum, entry) => sum + (entry.toDateAmount || 0), 0),
      
      person2ToDate: unifiedIncome2
        .filter(entry => entry.isActive && entry.type === 'assurance-emploi')
        .reduce((sum, entry) => sum + (entry.toDateAmount || 0), 0),
      
      totalToDate: eiEntries.reduce((sum, entry) => sum + (entry.toDateAmount || 0), 0),
      
      details: eiEntries.map(entry => ({
        description: entry.description,
        toDateAmount: entry.toDateAmount || 0,
        weeklyNet: entry.weeklyNet || 0,
        weeksUsed: entry.weeksUsed || 0
      }))
    };
  }

  /**
   * Évalue le risque lié aux revenus temporaires
   */
  private static assessTemporaryIncomeRisk(
    unifiedIncome1: IncomeEntry[],
    unifiedIncome2: IncomeEntry[]
  ): 'low' | 'medium' | 'high' {
    const totalAnnual = this.calculateTotalAnnualIncome([...unifiedIncome1, ...unifiedIncome2]);
    const temporaryAnnual = [...unifiedIncome1, ...unifiedIncome2]
      .filter(entry => entry.isActive && entry.type === 'assurance-emploi')
      .reduce((sum, entry) => sum + (entry.projectedAnnual || 0), 0);

    if (totalAnnual === 0) return 'low';
    
    const temporaryRatio = temporaryAnnual / totalAnnual;
    
    if (temporaryRatio > 0.5) return 'high';
    if (temporaryRatio > 0.25) return 'medium';
    return 'low';
  }

  /**
   * Évalue la concentration des revenus
   */
  private static assessIncomeConcentration(
    unifiedIncome1: IncomeEntry[],
    unifiedIncome2: IncomeEntry[]
  ): 'low' | 'medium' | 'high' {
    const allEntries = [...unifiedIncome1, ...unifiedIncome2].filter(entry => entry.isActive);
    const totalIncome = this.calculateTotalAnnualIncome(allEntries);
    
    if (totalIncome === 0 || allEntries.length === 0) return 'low';
    
    // Trouver la source de revenu la plus importante
    const maxIncome = Math.max(...allEntries.map(entry => entry.projectedAnnual || 0));
    const concentrationRatio = maxIncome / totalIncome;
    
    if (concentrationRatio > 0.8) return 'high';
    if (concentrationRatio > 0.6) return 'medium';
    return 'low';
  }

  /**
   * Évalue la dépendance à l'assurance emploi
   */
  private static assessEIDependency(
    unifiedIncome1: IncomeEntry[],
    unifiedIncome2: IncomeEntry[]
  ): 'none' | 'low' | 'medium' | 'high' {
    const totalAnnual = this.calculateTotalAnnualIncome([...unifiedIncome1, ...unifiedIncome2]);
    const eiAnnual = this.getIncomeByType([...unifiedIncome1, ...unifiedIncome2], 'assurance-emploi');
    
    if (eiAnnual === 0) return 'none';
    if (totalAnnual === 0) return 'high';
    
    const eiRatio = eiAnnual / totalAnnual;
    
    if (eiRatio > 0.7) return 'high';
    if (eiRatio > 0.4) return 'medium';
    return 'low';
  }

  /**
   * Génère des recommandations basées sur l'analyse des revenus
   */
  private static generateIncomeRecommendations(
    unifiedIncome1: IncomeEntry[],
    unifiedIncome2: IncomeEntry[]
  ): string[] {
    const recommendations: string[] = [];
    
    const temporaryRisk = this.assessTemporaryIncomeRisk(unifiedIncome1, unifiedIncome2);
    const concentrationRisk = this.assessIncomeConcentration(unifiedIncome1, unifiedIncome2);
    const eiDependency = this.assessEIDependency(unifiedIncome1, unifiedIncome2);
    
    // Recommandations pour les revenus temporaires
    if (temporaryRisk === 'high') {
      recommendations.push(
        'Risque élevé de revenus temporaires - Planifiez une transition vers des revenus permanents'
      );
    }
    
    // Recommandations pour la concentration des revenus
    if (concentrationRisk === 'high') {
      recommendations.push(
        'Concentration élevée des revenus - Diversifiez vos sources de revenus'
      );
    }
    
    // Recommandations pour la dépendance à l\'AE
    if (eiDependency === 'high') {
      recommendations.push(
        'Forte dépendance à l\'assurance emploi - Considérez demander votre RRQ dès l\'admissibilité'
      );
    } else if (eiDependency === 'medium') {
      recommendations.push(
        'Dépendance modérée à l\'assurance emploi - Planifiez la transition vers la retraite'
      );
    }
    
    // Recommandations générales
    const totalIncome = this.calculateTotalAnnualIncome([...unifiedIncome1, ...unifiedIncome2]);
    if (totalIncome < 30000) {
      recommendations.push(
        'Revenus faibles - Explorez les programmes d\'aide gouvernementaux disponibles'
      );
    }
    
    return recommendations;
  }

  /**
   * Valide l'intégrité des données de revenus
   */
  static validateIncomeData(
    unifiedIncome1: IncomeEntry[] = [],
    unifiedIncome2: IncomeEntry[] = []
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Vérifier les entrées d'assurance emploi
    const allEIEntries = [...unifiedIncome1, ...unifiedIncome2]
      .filter(entry => entry.isActive && entry.type === 'assurance-emploi');
    
    allEIEntries.forEach((entry, index) => {
      if (!entry.startDate) {
        errors.push(`Entrée AE ${index + 1}: Date de début manquante`);
      }
      if (!entry.weeklyNet || entry.weeklyNet <= 0) {
        errors.push(`Entrée AE ${index + 1}: Montant hebdomadaire net invalide`);
      }
      if (entry.weeksUsed && entry.weeksUsed > 50) {
        errors.push(`Entrée AE ${index + 1}: Nombre de semaines utilisées trop élevé`);
      }
    });
    
    // Vérifier les montants négatifs
    [...unifiedIncome1, ...unifiedIncome2].forEach((entry, index) => {
      if (entry.isActive) {
        if ((entry.annualAmount && entry.annualAmount < 0) ||
            (entry.monthlyAmount && entry.monthlyAmount < 0) ||
            (entry.weeklyAmount && entry.weeklyAmount < 0) ||
            (entry.weeklyNet && entry.weeklyNet < 0)) {
          errors.push(`Entrée ${index + 1}: Montants négatifs détectés`);
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
