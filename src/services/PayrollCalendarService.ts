// src/services/PayrollCalendarService.ts
// Service pour gérer le calendrier de paie avec chevauchement entre années

export interface PayrollPeriod {
  periodNumber: number;
  startDate: Date;
  endDate: Date;
  payDate: Date;
  isFullPeriod: boolean;
  year: number;
}

export interface PayrollCalendarConfig {
  firstPayDateOfYear: string; // Date du premier versement de l'année (ex: "2025-01-02")
  frequency: 'weekly' | 'biweekly' | 'bimonthly' | 'monthly';
  workDaysPerPeriod?: number; // Jours de travail par période (optionnel)
}

export class PayrollCalendarService {
  /**
   * Génère le calendrier de paie pour une année donnée
   */
  static generatePayrollCalendar(config: PayrollCalendarConfig, year: number): PayrollPeriod[] {
    const periods: PayrollPeriod[] = [];
    const firstPayDate = new Date(config.firstPayDateOfYear);
    
    // S'assurer que la date est dans l'année courante
    if (firstPayDate.getFullYear() !== year) {
      firstPayDate.setFullYear(year);
    }
    
    let currentPayDate = new Date(firstPayDate);
    let periodNumber = 1;
    
    // Générer les périodes pour toute l'année
    while (currentPayDate.getFullYear() === year) {
      const period = this.calculatePeriod(currentPayDate, config.frequency, periodNumber);
      periods.push(period);
      
      // Passer à la période suivante
      currentPayDate = this.getNextPayDate(currentPayDate, config.frequency);
      periodNumber++;
    }
    
    return periods;
  }

  /**
   * Calcule une période de paie spécifique
   */
  private static calculatePeriod(payDate: Date, frequency: string, periodNumber: number): PayrollPeriod {
    const startDate = new Date(payDate);
    const endDate = new Date(payDate);
    
    // Calculer les dates de début et fin de la période de travail
    switch (frequency) {
      case 'weekly':
        startDate.setDate(payDate.getDate() - 6); // 7 jours avant le versement
        endDate.setDate(payDate.getDate() - 1);   // 1 jour avant le versement
        break;
        
      case 'biweekly':
        startDate.setDate(payDate.getDate() - 13); // 14 jours avant le versement
        endDate.setDate(payDate.getDate() - 1);    // 1 jour avant le versement
        break;
        
      case 'bimonthly':
        startDate.setDate(payDate.getDate() - 14); // 15 jours avant le versement
        endDate.setDate(payDate.getDate() - 1);    // 1 jour avant le versement
        break;
        
      case 'monthly':
        startDate.setMonth(payDate.getMonth() - 1); // 1 mois avant le versement
        startDate.setDate(1); // Premier jour du mois précédent
        endDate.setDate(payDate.getDate() - 1); // 1 jour avant le versement
        break;
    }
    
    // Déterminer si c'est une période complète
    const isFullPeriod = this.isFullPeriod(startDate, endDate, frequency);
    
    return {
      periodNumber,
      startDate,
      endDate,
      payDate: new Date(payDate),
      isFullPeriod,
      year: payDate.getFullYear()
    };
  }

  /**
   * Détermine si une période est complète
   */
  private static isFullPeriod(startDate: Date, endDate: Date, frequency: string): boolean {
    const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    switch (frequency) {
      case 'weekly':
        return daysDiff >= 7;
      case 'biweekly':
        return daysDiff >= 14;
      case 'bimonthly':
        return daysDiff >= 15;
      case 'monthly':
        return daysDiff >= 28; // Au moins 4 semaines
      default:
        return true;
    }
  }

  /**
   * Calcule la date du prochain versement
   */
  private static getNextPayDate(currentPayDate: Date, frequency: string): Date {
    const nextDate = new Date(currentPayDate);
    
    switch (frequency) {
      case 'weekly':
        nextDate.setDate(currentPayDate.getDate() + 7);
        break;
      case 'biweekly':
        nextDate.setDate(currentPayDate.getDate() + 14);
        break;
      case 'bimonthly':
        nextDate.setDate(currentPayDate.getDate() + 15);
        break;
      case 'monthly':
        nextDate.setMonth(currentPayDate.getMonth() + 1);
        break;
    }
    
    return nextDate;
  }

  /**
   * Calcule le nombre de périodes de paie complètes jusqu'à une date donnée
   */
  static calculateCompletedPeriods(
    config: PayrollCalendarConfig, 
    targetDate: Date = new Date()
  ): PayrollPeriod[] {
    const year = targetDate.getFullYear();
    const calendar = this.generatePayrollCalendar(config, year);
    
    // Filtrer les périodes complétées (date de versement <= date cible)
    return calendar.filter(period => period.payDate <= targetDate);
  }

  /**
   * Calcule le montant total gagné jusqu'à une date donnée
   */
  static calculateTotalEarnings(
    config: PayrollCalendarConfig,
    salaryAmount: number,
    targetDate: Date = new Date()
  ): number {
    const completedPeriods = this.calculateCompletedPeriods(config, targetDate);
    
    // Calculer le total basé sur les périodes complètes
    let totalEarnings = 0;
    
    completedPeriods.forEach(period => {
      if (period.isFullPeriod) {
        totalEarnings += salaryAmount;
      } else {
        // Pour les périodes partielles, calculer proportionnellement
        const daysInPeriod = Math.floor((period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const expectedDays = this.getExpectedDaysForFrequency(config.frequency);
        const ratio = Math.min(daysInPeriod / expectedDays, 1);
        totalEarnings += salaryAmount * ratio;
      }
    });
    
    return totalEarnings;
  }

  /**
   * Obtient le nombre de jours attendus pour une fréquence donnée
   */
  private static getExpectedDaysForFrequency(frequency: string): number {
    switch (frequency) {
      case 'weekly':
        return 7;
      case 'biweekly':
        return 14;
      case 'bimonthly':
        return 15;
      case 'monthly':
        return 30;
      default:
        return 14;
    }
  }

  /**
   * Génère un résumé du calendrier de paie
   */
  static generatePayrollSummary(config: PayrollCalendarConfig, year: number): {
    totalPeriods: number;
    completedPeriods: number;
    remainingPeriods: number;
    firstPayDate: Date;
    lastPayDate: Date;
  } {
    const calendar = this.generatePayrollCalendar(config, year);
    const currentDate = new Date();
    const completedPeriods = calendar.filter(period => period.payDate <= currentDate).length;
    
    return {
      totalPeriods: calendar.length,
      completedPeriods,
      remainingPeriods: calendar.length - completedPeriods,
      firstPayDate: calendar[0]?.payDate || new Date(),
      lastPayDate: calendar[calendar.length - 1]?.payDate || new Date()
    };
  }

  /**
   * Valide une configuration de calendrier de paie
   */
  static validateConfig(config: PayrollCalendarConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Valider la date du premier versement
    const firstPayDate = new Date(config.firstPayDateOfYear);
    if (isNaN(firstPayDate.getTime())) {
      errors.push('Date du premier versement invalide');
    }
    
    // Valider la fréquence
    const validFrequencies = ['weekly', 'biweekly', 'bimonthly', 'monthly'];
    if (!validFrequencies.includes(config.frequency)) {
      errors.push('Fréquence de paie invalide');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
