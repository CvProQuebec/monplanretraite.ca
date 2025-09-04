// src/services/CalculationTestService.ts
// Service pour tester les calculs de revenus avec des données réelles

export interface CalculationTestData {
  salary: {
    netAmount: number;
    frequency: 'weekly' | 'biweekly' | 'bimonthly' | 'monthly';
    startDate: string;
    endDate?: string;
    revisionDate?: string;
    revisionAmount?: number;
  };
  ei: {
    weeklyNet: number;
    startDate: string;
    eligibleWeeks: number;
    revisionDate?: string;
    revisionAmount?: number;
  };
  sv: {
    monthlyAmount: number;
  };
  rrq: {
    monthlyAmount: number;
  };
}

export class CalculationTestService {
  /**
   * Teste les calculs avec des données réelles basées sur vos exemples
   */
  static testCalculations(): void {
    console.log('🧪 Test des calculs de revenus...');
    
    // Données de test basées sur vos exemples
    const testData: CalculationTestData = {
      salary: {
        netAmount: 2720.73, // Montant aux 2 semaines
        frequency: 'biweekly',
        startDate: '2025-01-01',
        endDate: '2025-04-07',
        revisionDate: '2025-06-01',
        revisionAmount: 2800.00
      },
      ei: {
        weeklyNet: 1270, // Montant par semaine (pas aux 2 semaines)
        startDate: '2025-04-06',
        eligibleWeeks: 35,
        revisionDate: '2025-08-01',
        revisionAmount: 1300
      },
      sv: {
        monthlyAmount: 692.89 // Montant normal (Jan-Juin)
      },
      rrq: {
        monthlyAmount: 1200
      }
    };

    // Test 1: Calcul du salaire à ce jour
    this.testSalaryCalculation(testData.salary);
    
    // Test 2: Calcul de l'assurance emploi
    this.testEICalculation(testData.ei);
    
    // Test 3: Calcul de la Sécurité de la vieillesse
    this.testSVCalculation(testData.sv);
    
    // Test 4: Calcul de la RRQ
    this.testRRQCalculation(testData.rrq);
  }

  /**
   * Teste le calcul du salaire à ce jour
   */
  private static testSalaryCalculation(salary: CalculationTestData['salary']): void {
    console.log('💰 Test calcul salaire:');
    console.log(`  - Montant: ${salary.netAmount}$ ${salary.frequency}`);
    console.log(`  - Période: ${salary.startDate} à ${salary.endDate || 'aujourd\'hui'}`);
    
    const startDate = new Date(salary.startDate);
    const endDate = salary.endDate ? new Date(salary.endDate) : new Date();
    const currentDate = new Date();
    
    // Déterminer la période effective
    const yearStart = new Date(currentDate.getFullYear(), 0, 1);
    const effectiveStart = startDate > yearStart ? startDate : yearStart;
    const effectiveEnd = endDate < currentDate ? endDate : currentDate;
    
    if (effectiveEnd >= effectiveStart) {
      const daysDiff = Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24));
      
      let paymentsCount = 0;
      switch (salary.frequency) {
        case 'weekly':
          paymentsCount = Math.floor(daysDiff / 7);
          break;
        case 'biweekly':
          paymentsCount = Math.floor(daysDiff / 14);
          break;
        case 'bimonthly':
          paymentsCount = Math.floor(daysDiff / 15);
          break;
        case 'monthly':
          paymentsCount = Math.floor(daysDiff / 30);
          break;
      }
      
      const totalAmount = paymentsCount * salary.netAmount;
      console.log(`  - Nombre de paiements: ${paymentsCount}`);
      console.log(`  - Total à ce jour: ${totalAmount.toFixed(2)}$`);
      console.log(`  - Attendu: ~${2720.73 * 7} = 19,045.11$ (7 versements)`);
    }
  }

  /**
   * Teste le calcul de l'assurance emploi
   */
  private static testEICalculation(ei: CalculationTestData['ei']): void {
    console.log('🏢 Test calcul assurance emploi:');
    console.log(`  - Montant hebdomadaire: ${ei.weeklyNet}$`);
    console.log(`  - Période: ${ei.startDate} à aujourd'hui`);
    console.log(`  - Semaines éligibles: ${ei.eligibleWeeks}`);
    
    const startDate = new Date(ei.startDate);
    const currentDate = new Date();
    
    const weeksElapsed = Math.max(0, Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)));
    const actualWeeksElapsed = Math.min(weeksElapsed, ei.eligibleWeeks);
    
    const totalAmount = actualWeeksElapsed * ei.weeklyNet;
    console.log(`  - Semaines écoulées: ${weeksElapsed}`);
    console.log(`  - Semaines effectives: ${actualWeeksElapsed}`);
    console.log(`  - Total à ce jour: ${totalAmount.toFixed(2)}$`);
    console.log(`  - Attendu: ~13,355$ (du 6 avril à aujourd'hui)`);
  }

  /**
   * Teste le calcul de la Sécurité de la vieillesse
   */
  private static testSVCalculation(sv: CalculationTestData['sv']): void {
    console.log('👴 Test calcul Sécurité de la vieillesse:');
    console.log(`  - Montant mensuel: ${sv.monthlyAmount}$`);
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    
    // Calculer selon les périodes
    let totalToDate = 0;
    
    // Période Jan-Juin (6 mois)
    const monthsJanJuin = Math.min(6, currentMonth);
    if (monthsJanJuin > 0) {
      const montantNormal = 692.89;
      totalToDate += monthsJanJuin * montantNormal;
    }
    
    // Période Juil-Déc (6 mois)
    if (currentMonth > 6) {
      const monthsJuilDec = Math.min(6, currentMonth - 6);
      const montantAvecRecuperation = 324.91;
      totalToDate += monthsJuilDec * montantAvecRecuperation;
    }
    
    console.log(`  - Mois Jan-Juin: ${monthsJanJuin} mois`);
    console.log(`  - Mois Juil-Déc: ${currentMonth > 6 ? Math.min(6, currentMonth - 6) : 0} mois`);
    console.log(`  - Total à ce jour: ${totalToDate.toFixed(2)}$`);
    console.log(`  - Attendu: 4,807.16$ (692.89 * 6 + 324.91 * 2)`);
  }

  /**
   * Teste le calcul de la RRQ
   */
  private static testRRQCalculation(rrq: CalculationTestData['rrq']): void {
    console.log('🏛️ Test calcul RRQ:');
    console.log(`  - Montant mensuel: ${rrq.monthlyAmount}$`);
    
    const currentDate = new Date();
    const monthsElapsed = currentDate.getMonth() + 1;
    const totalAmount = rrq.monthlyAmount * monthsElapsed;
    
    console.log(`  - Mois écoulés: ${monthsElapsed}`);
    console.log(`  - Total à ce jour: ${totalAmount.toFixed(2)}$`);
  }

  /**
   * Teste les calculs avec des données d'entrée spécifiques
   */
  static testWithSpecificData(entry: any): void {
    console.log('🔍 Test avec données spécifiques:');
    console.log('Données d\'entrée:', entry);
    
    // Simuler le calcul selon le type
    switch (entry.type) {
      case 'salaire':
        this.testSalaryCalculation({
          netAmount: entry.salaryNetAmount || 0,
          frequency: entry.salaryFrequency || 'monthly',
          startDate: entry.salaryStartDate || '2025-01-01',
          endDate: entry.salaryEndDate,
          revisionDate: entry.salaryRevisionDate,
          revisionAmount: entry.salaryRevisionAmount
        });
        break;
        
      case 'assurance-emploi':
        this.testEICalculation({
          weeklyNet: entry.weeklyNet || 0,
          startDate: entry.eiStartDate || '2025-01-01',
          eligibleWeeks: entry.eiEligibleWeeks || 45,
          revisionDate: entry.eiRevisionDate,
          revisionAmount: entry.eiRevisionAmount
        });
        break;
        
      case 'rentes':
        if (entry.description?.toLowerCase().includes('sv') || entry.description?.toLowerCase().includes('sécurité vieillesse')) {
          this.testSVCalculation({
            monthlyAmount: entry.monthlyAmount || 692.89
          });
        } else if (entry.description?.toLowerCase().includes('rrq')) {
          this.testRRQCalculation({
            monthlyAmount: entry.monthlyAmount || 1200
          });
        }
        break;
    }
  }
}
