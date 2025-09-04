// src/services/PayrollTestService.ts
// Service pour tester les calculs de calendrier de paie

import { PayrollCalendarService } from './PayrollCalendarService';

export class PayrollTestService {
  /**
   * Teste les calculs de calendrier de paie avec différents scénarios
   */
  static runAllTests(): void {
    console.log('🧪 Tests du calendrier de paie...\n');
    
    this.testBiweeklyScenario();
    this.testWeeklyScenario();
    this.testMonthlyScenario();
    this.testSalaryRevision();
    this.testYearBoundary();
  }

  /**
   * Teste le scénario bi-hebdomadaire (votre exemple)
   */
  private static testBiweeklyScenario(): void {
    console.log('📅 Test: Paie bi-hebdomadaire');
    
    const config = {
      firstPayDateOfYear: '2025-01-02',
      frequency: 'biweekly' as const
    };
    
    const salaryAmount = 2720.73;
    const testDate = new Date('2025-04-07'); // Date de fin d'emploi
    
    const totalEarnings = PayrollCalendarService.calculateTotalEarnings(config, salaryAmount, testDate);
    const completedPeriods = PayrollCalendarService.calculateCompletedPeriods(config, testDate);
    
    console.log(`  - Configuration: Premier versement ${config.firstPayDateOfYear}, ${config.frequency}`);
    console.log(`  - Montant par période: ${salaryAmount}$`);
    console.log(`  - Date de test: ${testDate.toISOString().split('T')[0]}`);
    console.log(`  - Périodes complétées: ${completedPeriods.length}`);
    console.log(`  - Gains totaux: ${totalEarnings.toFixed(2)}$`);
    console.log(`  - Attendu: ~${2720.73 * 7} = 19,045.11$ (7 versements)\n`);
  }

  /**
   * Teste le scénario hebdomadaire
   */
  private static testWeeklyScenario(): void {
    console.log('📅 Test: Paie hebdomadaire');
    
    const config = {
      firstPayDateOfYear: '2025-01-03',
      frequency: 'weekly' as const
    };
    
    const salaryAmount = 1000;
    const testDate = new Date('2025-03-15');
    
    const totalEarnings = PayrollCalendarService.calculateTotalEarnings(config, salaryAmount, testDate);
    const completedPeriods = PayrollCalendarService.calculateCompletedPeriods(config, testDate);
    
    console.log(`  - Configuration: Premier versement ${config.firstPayDateOfYear}, ${config.frequency}`);
    console.log(`  - Montant par période: ${salaryAmount}$`);
    console.log(`  - Date de test: ${testDate.toISOString().split('T')[0]}`);
    console.log(`  - Périodes complétées: ${completedPeriods.length}`);
    console.log(`  - Gains totaux: ${totalEarnings.toFixed(2)}$\n`);
  }

  /**
   * Teste le scénario mensuel
   */
  private static testMonthlyScenario(): void {
    console.log('📅 Test: Paie mensuelle');
    
    const config = {
      firstPayDateOfYear: '2025-01-31',
      frequency: 'monthly' as const
    };
    
    const salaryAmount = 5000;
    const testDate = new Date('2025-06-30');
    
    const totalEarnings = PayrollCalendarService.calculateTotalEarnings(config, salaryAmount, testDate);
    const completedPeriods = PayrollCalendarService.calculateCompletedPeriods(config, testDate);
    
    console.log(`  - Configuration: Premier versement ${config.firstPayDateOfYear}, ${config.frequency}`);
    console.log(`  - Montant par période: ${salaryAmount}$`);
    console.log(`  - Date de test: ${testDate.toISOString().split('T')[0]}`);
    console.log(`  - Périodes complétées: ${completedPeriods.length}`);
    console.log(`  - Gains totaux: ${totalEarnings.toFixed(2)}$\n`);
  }

  /**
   * Teste la révision salariale
   */
  private static testSalaryRevision(): void {
    console.log('📅 Test: Révision salariale');
    
    const config = {
      firstPayDateOfYear: '2025-01-02',
      frequency: 'biweekly' as const
    };
    
    const originalSalary = 2720.73;
    const revisedSalary = 2800.00;
    const revisionDate = new Date('2025-06-01');
    const testDate = new Date('2025-09-01');
    
    // Calculer les gains avant révision
    const earningsBeforeRevision = PayrollCalendarService.calculateTotalEarnings(
      config, 
      originalSalary, 
      revisionDate
    );
    
    // Calculer les gains après révision
    const earningsAfterRevision = PayrollCalendarService.calculateTotalEarnings(
      config, 
      revisedSalary, 
      testDate
    ) - PayrollCalendarService.calculateTotalEarnings(
      config, 
      revisedSalary, 
      revisionDate
    );
    
    const totalEarnings = earningsBeforeRevision + earningsAfterRevision;
    
    console.log(`  - Salaire original: ${originalSalary}$`);
    console.log(`  - Salaire révisé: ${revisedSalary}$`);
    console.log(`  - Date de révision: ${revisionDate.toISOString().split('T')[0]}`);
    console.log(`  - Date de test: ${testDate.toISOString().split('T')[0]}`);
    console.log(`  - Gains avant révision: ${earningsBeforeRevision.toFixed(2)}$`);
    console.log(`  - Gains après révision: ${earningsAfterRevision.toFixed(2)}$`);
    console.log(`  - Total: ${totalEarnings.toFixed(2)}$\n`);
  }

  /**
   * Teste le chevauchement entre années
   */
  private static testYearBoundary(): void {
    console.log('📅 Test: Chevauchement entre années');
    
    const config = {
      firstPayDateOfYear: '2025-01-02',
      frequency: 'biweekly' as const
    };
    
    // Générer le calendrier pour voir les périodes qui chevauchent
    const calendar = PayrollCalendarService.generatePayrollCalendar(config, 2025);
    const firstPeriod = calendar[0];
    
    console.log(`  - Premier versement de 2025: ${firstPeriod.payDate.toISOString().split('T')[0]}`);
    console.log(`  - Période de travail: ${firstPeriod.startDate.toISOString().split('T')[0]} à ${firstPeriod.endDate.toISOString().split('T')[0]}`);
    console.log(`  - Cette période couvre des jours de 2024 mais est payée en 2025`);
    console.log(`  - C'est exactement ce que vous vouliez !\n`);
  }

  /**
   * Teste un scénario spécifique avec des paramètres personnalisés
   */
  static testCustomScenario(
    firstPayDate: string,
    frequency: 'weekly' | 'biweekly' | 'bimonthly' | 'monthly',
    salaryAmount: number,
    testDate: Date = new Date()
  ): void {
    console.log(`🧪 Test personnalisé: ${frequency} à partir de ${firstPayDate}`);
    
    const config = {
      firstPayDateOfYear: firstPayDate,
      frequency
    };
    
    const validation = PayrollCalendarService.validateConfig(config);
    if (!validation.isValid) {
      console.log(`  ❌ Configuration invalide: ${validation.errors.join(', ')}`);
      return;
    }
    
    const totalEarnings = PayrollCalendarService.calculateTotalEarnings(config, salaryAmount, testDate);
    const completedPeriods = PayrollCalendarService.calculateCompletedPeriods(config, testDate);
    const summary = PayrollCalendarService.generatePayrollSummary(config, testDate.getFullYear());
    
    console.log(`  - Montant par période: ${salaryAmount}$`);
    console.log(`  - Date de test: ${testDate.toISOString().split('T')[0]}`);
    console.log(`  - Périodes complétées: ${completedPeriods.length}/${summary.totalPeriods}`);
    console.log(`  - Gains totaux: ${totalEarnings.toFixed(2)}$`);
    console.log(`  - Premier versement: ${summary.firstPayDate.toISOString().split('T')[0]}`);
    console.log(`  - Dernier versement: ${summary.lastPayDate.toISOString().split('T')[0]}\n`);
  }

  /**
   * Compare les méthodes de calcul (ancienne vs nouvelle)
   */
  static compareCalculationMethods(): void {
    console.log('🔄 Comparaison des méthodes de calcul');
    
    const config = {
      firstPayDateOfYear: '2025-01-02',
      frequency: 'biweekly' as const
    };
    
    const salaryAmount = 2720.73;
    const testDate = new Date('2025-04-07');
    
    // Nouvelle méthode (calendrier de paie)
    const newMethod = PayrollCalendarService.calculateTotalEarnings(config, salaryAmount, testDate);
    
    // Ancienne méthode (calcul simple)
    const daysDiff = Math.floor((testDate.getTime() - new Date('2025-01-01').getTime()) / (1000 * 60 * 60 * 24));
    const oldMethod = Math.floor(daysDiff / 14) * salaryAmount;
    
    console.log(`  - Nouvelle méthode (calendrier): ${newMethod.toFixed(2)}$`);
    console.log(`  - Ancienne méthode (simple): ${oldMethod.toFixed(2)}$`);
    console.log(`  - Différence: ${(newMethod - oldMethod).toFixed(2)}$`);
    console.log(`  - Amélioration: ${(((newMethod - oldMethod) / oldMethod) * 100).toFixed(1)}%\n`);
  }
}
