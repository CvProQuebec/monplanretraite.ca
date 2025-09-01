// ===== CALCULATEUR AVANCÉ DE REVENUS =====
// Gestion des scénarios complexes d'assurance emploi et transitions
// Intégration CCQ pour travailleurs de la construction

import { CCQService } from './CCQService';
import { CCQData, CCQCalculationResult } from '../types/ccq';

export interface EmploymentPeriod {
  id: string;
  type: 'employment' | 'ei' | 'vacation' | 'other-income';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  grossAmount: number;
  deductions?: {
    federalTax?: number;
    provincialTax?: number;
    cpp?: number;
    ei?: number;
  };
  details?: {
    weeksUsed?: number; // Pour assurance emploi
    weeksRemaining?: number;
    maxWeeks?: number;
    weeklyRate?: number;
    isVacationWeek?: boolean;
  };
}

export interface EICalculationResult {
  totalWeeksUsed: number;
  weeksRemaining: number;
  estimatedEndDate: string;
  canExtendWithIncome: boolean;
  vacationWeeksAvailable: number;
  netWeeklyAmount: number;
  grossWeeklyAmount: number;
  totalDeductions: number;
  projectedAnnualIncome: number;
  eligibleForTransition: boolean;
  transitionRecommendations: TransitionRecommendation[];
}

export interface TransitionRecommendation {
  type: 'rrq' | 'sv' | 'employment' | 'training';
  priority: 'high' | 'medium' | 'low';
  timing: string; // Date recommandée
  reason: string;
  impact: {
    monthlyIncome?: number;
    annualIncome?: number;
    taxImplications?: string;
  };
  requirements: string[];
  nextSteps: string[];
}

export class AdvancedIncomeCalculator {
  
  /**
   * Calcule les détails complexes d'assurance emploi
   */
  static calculateEIDetails(
    periods: EmploymentPeriod[],
    birthDate: string,
    currentDate: string = new Date().toISOString().split('T')[0]
  ): EICalculationResult {
    
    const eiPeriods = periods.filter(p => p.type === 'ei');
    const currentAge = this.calculateAge(birthDate, currentDate);
    
    // Calculs de base
    let totalWeeksUsed = 0;
    let grossWeeklyAmount = 0;
    let totalDeductions = 0;
    let maxWeeks = 35; // Par défaut, peut être ajusté selon l'historique d'emploi
    
    eiPeriods.forEach(period => {
      const weeks = this.calculateWeeksBetweenDates(period.startDate, period.endDate);
      totalWeeksUsed += weeks;
      
      if (period.details?.weeklyRate) {
        grossWeeklyAmount = period.details.weeklyRate;
      }
      
      if (period.deductions) {
        totalDeductions = (period.deductions.federalTax || 0) + 
                         (period.deductions.provincialTax || 0);
      }
    });
    
    const weeksRemaining = Math.max(0, maxWeeks - totalWeeksUsed);
    const netWeeklyAmount = grossWeeklyAmount - totalDeductions;
    
    // Calcul de la date de fin estimée
    const weeksToAdd = weeksRemaining;
    const estimatedEndDate = this.addWeeksToDate(currentDate, weeksToAdd);
    
    // Projection du revenu annuel
    const remainingWeeksInYear = this.calculateRemainingWeeksInYear(currentDate);
    const weeksToProject = Math.min(weeksRemaining, remainingWeeksInYear);
    const projectedEIIncome = weeksToProject * netWeeklyAmount;
    
    // Calcul du revenu d'emploi de l'année
    const employmentPeriods = periods.filter(p => p.type === 'employment');
    const employmentIncome = employmentPeriods.reduce((sum, p) => sum + p.grossAmount, 0);
    
    const projectedAnnualIncome = employmentIncome + projectedEIIncome;
    
    // Éligibilité pour transition
    const eligibleForTransition = currentAge >= 60;
    
    // Recommandations
    const recommendations = this.generateTransitionRecommendations(
      currentAge,
      weeksRemaining,
      estimatedEndDate,
      projectedAnnualIncome,
      netWeeklyAmount
    );
    
    return {
      totalWeeksUsed,
      weeksRemaining,
      estimatedEndDate,
      canExtendWithIncome: weeksRemaining > 0,
      vacationWeeksAvailable: Math.min(2, weeksRemaining), // Maximum 2 semaines de vacances
      netWeeklyAmount,
      grossWeeklyAmount,
      totalDeductions,
      projectedAnnualIncome,
      eligibleForTransition,
      transitionRecommendations: recommendations
    };
  }
  
  /**
   * Génère des recommandations de transition intelligentes
   */
  private static generateTransitionRecommendations(
    age: number,
    weeksRemaining: number,
    eiEndDate: string,
    projectedIncome: number,
    weeklyEI: number
  ): TransitionRecommendation[] {
    
    const recommendations: TransitionRecommendation[] = [];
    const eiEndDateObj = new Date(eiEndDate);
    
    // Recommandation RRQ (si 60+)
    if (age >= 60) {
      const rrqStartDate = new Date(eiEndDateObj);
      rrqStartDate.setDate(rrqStartDate.getDate() + 1); // Jour suivant la fin de l'AE
      
      // Calcul approximatif du RRQ à 60 ans (environ 36% du maximum)
      const maxRRQ2024 = 1364.60; // Maximum mensuel 2024
      const rrqAt60 = maxRRQ2024 * 0.36; // Réduction pour prise à 60 ans
      const estimatedRRQ = Math.min(rrqAt60, projectedIncome * 0.25 / 12); // 25% du revenu moyen
      
      recommendations.push({
        type: 'rrq',
        priority: weeksRemaining <= 4 ? 'high' : 'medium',
        timing: rrqStartDate.toISOString().split('T')[0],
        reason: `Transition fluide après la fin de l'assurance emploi. Évite une période sans revenu.`,
        impact: {
          monthlyIncome: estimatedRRQ,
          annualIncome: estimatedRRQ * 12,
          taxImplications: 'Revenu imposable, mais généralement plus avantageux que l\'AE'
        },
        requirements: [
          'Avoir cotisé au RRQ pendant au moins 1 an',
          'Faire la demande 3 mois avant la date souhaitée',
          'Cesser ou réduire substantiellement le travail'
        ],
        nextSteps: [
          'Contacter Retraite Québec pour une estimation personnalisée',
          'Préparer les documents requis (relevés d\'emploi, T4)',
          'Planifier la transition financière'
        ]
      });
    }
    
    // Recommandation Sécurité de la vieillesse (si 65+)
    if (age >= 65) {
      const svAmount = 707.68; // Montant maximum mensuel 2024
      
      recommendations.push({
        type: 'sv',
        priority: 'high',
        timing: 'Immédiatement (si pas déjà fait)',
        reason: 'Prestation universelle disponible dès 65 ans',
        impact: {
          monthlyIncome: svAmount,
          annualIncome: svAmount * 12,
          taxImplications: 'Récupération possible si revenu total > 90 997$'
        },
        requirements: [
          'Résidence au Canada pendant 40 ans après 18 ans (pension complète)',
          'Minimum 10 ans de résidence (pension partielle)'
        ],
        nextSteps: [
          'Demande automatique à 64 ans, vérifier le statut',
          'Considérer le report si revenus élevés'
        ]
      });
    }
    
    // Recommandation recherche d'emploi
    if (age < 65 && weeksRemaining > 8) {
      recommendations.push({
        type: 'employment',
        priority: 'medium',
        timing: 'Dès maintenant',
        reason: 'Maximiser les revenus et prolonger la période d\'assurance emploi',
        impact: {
          taxImplications: 'Revenus d\'emploi peuvent prolonger l\'AE si < 90% du taux hebdomadaire'
        },
        requirements: [
          'Recherche active d\'emploi',
          'Déclaration des revenus à Service Canada'
        ],
        nextSteps: [
          'Utiliser les services d\'aide à l\'emploi',
          'Considérer l\'emploi à temps partiel pour prolonger l\'AE',
          'Calculer l\'impact sur les prestations'
        ]
      });
    }
    
    // Recommandation formation (si jeune et temps restant)
    if (age < 60 && weeksRemaining > 12) {
      recommendations.push({
        type: 'training',
        priority: 'low',
        timing: 'Pendant la période d\'AE',
        reason: 'Améliorer l\'employabilité pendant la période de prestations',
        impact: {
          taxImplications: 'Certaines formations permettent de maintenir l\'AE'
        },
        requirements: [
          'Approbation de Service Canada',
          'Formation approuvée'
        ],
        nextSteps: [
          'Explorer les programmes de formation subventionnés',
          'Vérifier l\'éligibilité avec Service Canada'
        ]
      });
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  /**
   * Simule l'impact des semaines de vacances
   */
  static simulateVacationImpact(
    currentEI: EICalculationResult,
    vacationWeeks: number
  ): { newEndDate: string; weeksExtended: number } {
    
    const currentEndDate = new Date(currentEI.estimatedEndDate);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setDate(newEndDate.getDate() + (vacationWeeks * 7));
    
    return {
      newEndDate: newEndDate.toISOString().split('T')[0],
      weeksExtended: vacationWeeks
    };
  }
  
  /**
   * Calcule l'impact de revenus supplémentaires sur l'AE
   */
  static calculateIncomeImpact(
    weeklyEIRate: number,
    additionalWeeklyIncome: number
  ): { 
    deduction: number; 
    netEI: number; 
    canExtend: boolean;
    explanation: string;
  } {
    
    // Règle Service Canada : déduction de 50 cents par dollar gagné au-dessus de 90$ par semaine
    const exemptionAmount = 90;
    const deductionRate = 0.5;
    
    let deduction = 0;
    let explanation = '';
    
    if (additionalWeeklyIncome <= exemptionAmount) {
      explanation = `Aucune déduction - revenu sous l'exemption de ${exemptionAmount}$`;
    } else {
      const excessIncome = additionalWeeklyIncome - exemptionAmount;
      deduction = excessIncome * deductionRate;
      explanation = `Déduction de ${deduction.toFixed(2)}$ (50% de ${excessIncome.toFixed(2)}$ excédentaire)`;
    }
    
    const netEI = Math.max(0, weeklyEIRate - deduction);
    const canExtend = netEI > 0; // Si il reste des prestations, peut prolonger
    
    return {
      deduction,
      netEI,
      canExtend,
      explanation
    };
  }

  /**
   * Intègre les calculs CCQ dans les projections de revenus
   * Spécialement conçu pour les travailleurs de la construction
   */
  static integrateConstructionWorkerIncome(
    periods: EmploymentPeriod[],
    ccqData: CCQData,
    birthDate: string,
    currentDate: string = new Date().toISOString().split('T')[0]
  ): {
    totalProjectedIncome: number;
    ccqPension: CCQCalculationResult;
    eiDetails: EICalculationResult;
    transitionStrategy: {
      optimalRetirementAge: number;
      monthlyIncomeAtRetirement: number;
      recommendations: string[];
    };
  } {
    
    // Calculs CCQ
    const ccqResult = CCQService.calculateCCQPension(ccqData);
    
    // Calculs AE standards
    const eiResult = this.calculateEIDetails(periods, birthDate, currentDate);
    
    const currentAge = this.calculateAge(birthDate, currentDate);
    
    // Stratégie de transition optimisée pour construction
    const transitionStrategy = this.generateConstructionTransitionStrategy(
      currentAge,
      ccqResult,
      eiResult,
      ccqData
    );
    
    // Projection totale des revenus
    const totalProjectedIncome = this.calculateTotalConstructionIncome(
      eiResult.projectedAnnualIncome,
      ccqResult,
      currentAge
    );
    
    return {
      totalProjectedIncome,
      ccqPension: ccqResult,
      eiDetails: eiResult,
      transitionStrategy
    };
  }

  /**
   * Génère une stratégie de transition spécialisée pour les travailleurs de la construction
   */
  private static generateConstructionTransitionStrategy(
    currentAge: number,
    ccqResult: CCQCalculationResult,
    eiResult: EICalculationResult,
    ccqData: CCQData
  ): {
    optimalRetirementAge: number;
    monthlyIncomeAtRetirement: number;
    recommendations: string[];
  } {
    
    const recommendations: string[] = [];
    let optimalRetirementAge = 65;
    let monthlyIncomeAtRetirement = 0;
    
    // Analyse de l'éligibilité CCQ
    if (ccqResult.admissibilite.retraiteNormale.eligible) {
      optimalRetirementAge = 65;
      monthlyIncomeAtRetirement = ccqResult.renteMensuelleTotale;
      recommendations.push("✅ Éligible à la retraite normale CCQ à 65 ans sans réduction");
    }
    
    if (ccqResult.admissibilite.retraiteAnticipeeSansReduction.eligible) {
      const ageEligible = ccqResult.admissibilite.retraiteAnticipeeSansReduction.ageRequis;
      if (ageEligible && ageEligible < optimalRetirementAge) {
        optimalRetirementAge = ageEligible;
        monthlyIncomeAtRetirement = ccqResult.renteMensuelleTotale;
        recommendations.push(`🎯 Retraite anticipée CCQ possible à ${ageEligible} ans sans réduction`);
      }
    }
    
    if (ccqResult.admissibilite.retraiteAnticipeeAvecReduction.eligible) {
      const ageMin = ccqResult.admissibilite.retraiteAnticipeeAvecReduction.ageRequis;
      const reduction = ccqResult.facteurReduction ? (ccqResult.facteurReduction * 100).toFixed(1) : '3.0';
      recommendations.push(`⚠️ Retraite anticipée possible dès ${ageMin} ans avec réduction de ${reduction}%`);
    }
    
    // Recommandations spécifiques construction
    if (currentAge >= 55) {
      recommendations.push("🏗️ Secteur construction: Considérer la retraite partielle si éligible");
      recommendations.push("📞 Contacter CCQ au 1-888-842-8282 pour validation des heures");
    }
    
    if (ccqData.heuresAjusteesAvant2005 > 0) {
      recommendations.push("📋 Vérifier les heures ajustées pré-2005 avec la CCQ");
    }
    
    // Coordination avec RRQ
    if (currentAge >= 60) {
      recommendations.push("🔄 Coordonner la prise du RRQ avec la rente CCQ pour optimiser les revenus");
    }
    
    // Optimisation fiscale
    if (ccqResult.renteMajoreeReduite.recommande) {
      recommendations.push("💰 Analyser l'option rente majorée-réduite pour maximiser les revenus avant 65 ans");
    }
    
    return {
      optimalRetirementAge,
      monthlyIncomeAtRetirement,
      recommendations
    };
  }

  /**
   * Calcule le revenu total projeté incluant CCQ
   */
  private static calculateTotalConstructionIncome(
    currentAnnualIncome: number,
    ccqResult: CCQCalculationResult,
    currentAge: number
  ): number {
    
    // Revenu actuel (AE + emploi)
    let totalIncome = currentAnnualIncome;
    
    // Ajouter la rente CCQ si éligible
    if (currentAge >= 55 && ccqResult.admissibilite.retraiteAnticipeeAvecReduction.eligible) {
      totalIncome += ccqResult.renteAnnuelleTotale;
    } else if (currentAge >= 65) {
      totalIncome += ccqResult.renteAnnuelleTotale;
    }
    
    return totalIncome;
  }
  
  // Méthodes utilitaires
  private static calculateAge(birthDate: string, currentDate: string): number {
    const birth = new Date(birthDate);
    const current = new Date(currentDate);
    let age = current.getFullYear() - birth.getFullYear();
    const monthDiff = current.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && current.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }
  
  private static calculateWeeksBetweenDates(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
  }
  
  private static addWeeksToDate(date: string, weeks: number): string {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + (weeks * 7));
    return dateObj.toISOString().split('T')[0];
  }
  
  private static calculateRemainingWeeksInYear(currentDate: string): number {
    const current = new Date(currentDate);
    const endOfYear = new Date(current.getFullYear(), 11, 31);
    return this.calculateWeeksBetweenDates(currentDate, endOfYear.toISOString().split('T')[0]);
  }
}

// Exemple d'utilisation pour votre scénario
export const exampleScenario = {
  periods: [
    {
      id: '1',
      type: 'employment' as const,
      startDate: '2024-01-01',
      endDate: '2024-03-30',
      grossAmount: 45000
    },
    {
      id: '2',
      type: 'ei' as const,
      startDate: '2024-04-06',
      endDate: '2024-12-31', // Date estimée
      grossAmount: 693,
      deductions: {
        federalTax: 21,
        provincialTax: 37
      },
      details: {
        weeklyRate: 693,
        maxWeeks: 35,
        weeksUsed: 20 // Exemple
      }
    }
  ],
  birthDate: '1964-01-01', // 60 ans
  currentDate: '2024-08-25'
};
