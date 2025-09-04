// src/services/CalculationDiagnosticService.ts
// Service pour diagnostiquer les problèmes de calcul

export class CalculationDiagnosticService {
  /**
   * Diagnostique les calculs de revenus
   */
  static diagnoseCalculations(userData: any, incomeEntries: any[], personNumber: 1 | 2): void {
    console.log(`🔍 Diagnostic des calculs pour Personne ${personNumber}`);
    console.log('=====================================');
    
    // 1. Vérifier les données utilisateur
    this.checkUserData(userData, personNumber);
    
    // 2. Vérifier les entrées de revenus
    this.checkIncomeEntries(incomeEntries);
    
    // 3. Calculer les montants attendus
    this.calculateExpectedAmounts(userData, personNumber);
    
    // 4. Vérifier les calculs actuels
    this.checkCurrentCalculations(userData, incomeEntries, personNumber);
  }

  /**
   * Vérifie les données utilisateur
   */
  private static checkUserData(userData: any, personNumber: 1 | 2): void {
    console.log('\n📊 Données utilisateur:');
    
    if (!userData) {
      console.log('❌ userData est null ou undefined');
      return;
    }
    
    if (!userData.retirement) {
      console.log('❌ userData.retirement est null ou undefined');
      return;
    }
    
    const rrqMontant = personNumber === 1 ? 
      userData.retirement.rrqMontantActuel1 : 
      userData.retirement.rrqMontantActuel2;
    
    const svBiannual = personNumber === 1 ? 
      userData.retirement.svBiannual1 : 
      userData.retirement.svBiannual2;
    
    console.log(`  - RRQ Montant Actuel: ${rrqMontant || 'N/A'}$`);
    console.log(`  - SV Biannual: ${svBiannual ? 'Présent' : 'N/A'}`);
    
    if (svBiannual) {
      console.log(`    * Période 1 (Jan-Juin): ${svBiannual.periode1?.montant || 'N/A'}$/mois`);
      console.log(`    * Période 2 (Juil-Déc): ${svBiannual.periode2?.montant || 'N/A'}$/mois`);
    }
    
    if (!rrqMontant || rrqMontant === 0) {
      console.log('⚠️  RRQ Montant Actuel est 0 ou manquant');
    }
    
    if (!svBiannual || !svBiannual.periode1 || !svBiannual.periode2) {
      console.log('⚠️  SV Biannual est manquant ou incomplet');
    }
  }

  /**
   * Vérifie les entrées de revenus
   */
  private static checkIncomeEntries(incomeEntries: any[]): void {
    console.log('\n💰 Entrées de revenus:');
    console.log(`  - Nombre d'entrées: ${incomeEntries.length}`);
    console.log(`  - Entrées actives: ${incomeEntries.filter(e => e.isActive).length}`);
    
    incomeEntries.forEach((entry, index) => {
      console.log(`  - Entrée ${index + 1}: ${entry.type} - ${entry.description || 'Sans nom'} - Actif: ${entry.isActive}`);
      
      if (entry.type === 'salaire') {
        console.log(`    * Montant: ${entry.salaryNetAmount || 'N/A'}$ ${entry.salaryFrequency || 'N/A'}`);
        console.log(`    * Période: ${entry.salaryStartDate || 'N/A'} à ${entry.salaryEndDate || 'N/A'}`);
      }
      
      if (entry.type === 'assurance-emploi') {
        console.log(`    * Montant: ${entry.weeklyNet || 'N/A'}$/semaine`);
        console.log(`    * Période: ${entry.eiStartDate || 'N/A'} (${entry.eiEligibleWeeks || 'N/A'} semaines)`);
      }
    });
  }

  /**
   * Calcule les montants attendus
   */
  private static calculateExpectedAmounts(userData: any, personNumber: 1 | 2): void {
    console.log('\n🎯 Montants attendus:');
    
    const currentDate = new Date();
    const monthsElapsed = currentDate.getMonth() + 1;
    const currentMonth = currentDate.getMonth() + 1;
    
    // RRQ
    const rrqMontant = personNumber === 1 ? 
      userData?.retirement?.rrqMontantActuel1 : 
      userData?.retirement?.rrqMontantActuel2;
    
    if (rrqMontant && rrqMontant > 0) {
      // RRQ est versé le dernier jour ouvrable du mois - ne pas inclure le mois courant
      const monthsCompleted = Math.max(0, monthsElapsed - 1);
      const expectedRRQ = rrqMontant * monthsCompleted;
      console.log(`  - RRQ à ce jour: ${rrqMontant}$ × ${monthsCompleted} mois = ${expectedRRQ.toFixed(2)}$ (mois courant exclu)`);
    } else {
      console.log('  - RRQ à ce jour: 0$ (pas de montant RRQ)');
    }
    
    // Sécurité vieillesse
    const svBiannual = personNumber === 1 ? 
      userData?.retirement?.svBiannual1 : 
      userData?.retirement?.svBiannual2;
    
    if (svBiannual && svBiannual.periode1 && svBiannual.periode2) {
      // SV est versé entre le 26 et 29 du mois - ne pas inclure le mois courant
      const monthsCompleted = Math.max(0, currentMonth - 1);
      
      let totalToDate = 0;
      
      // Période Jan-Juin (6 mois)
      const monthsJanJuin = Math.min(6, monthsCompleted);
      if (monthsJanJuin > 0) {
        totalToDate += monthsJanJuin * svBiannual.periode1.montant;
      }
      
      // Période Juil-Déc (6 mois)
      if (monthsCompleted > 6) {
        const monthsJuilDec = Math.min(6, monthsCompleted - 6);
        totalToDate += monthsJuilDec * svBiannual.periode2.montant;
      }
      
      console.log(`  - SV à ce jour: ${totalToDate.toFixed(2)}$ (Jan-Juin: ${monthsJanJuin} mois × ${svBiannual.periode1.montant}$, Juil-Déc: ${monthsCompleted > 6 ? Math.min(6, monthsCompleted - 6) : 0} mois × ${svBiannual.periode2.montant}$) (mois courant exclu)`);
    } else {
      console.log('  - SV à ce jour: 0$ (pas de données SV biannuelle)');
    }
  }

  /**
   * Vérifie les calculs actuels
   */
  private static checkCurrentCalculations(userData: any, incomeEntries: any[], personNumber: 1 | 2): void {
    console.log('\n🧮 Calculs actuels:');
    
    // Simuler le calcul comme dans le composant
    const totals = {
      salaire: 0,
      rrq: 0,
      securiteVieillesse: 0,
      rentesPrivees: 0,
      assuranceEmploi: 0,
      mensuelMoyen: 0,
      totalAnnuelProjete: 0
    };
    
    // Calculs automatiques
    if (userData?.retirement) {
      const currentDate = new Date();
      const monthsElapsed = currentDate.getMonth() + 1;
      
      // RRQ
      const rrqMontantActuel = personNumber === 1 ? 
        userData.retirement.rrqMontantActuel1 : 
        userData.retirement.rrqMontantActuel2;
      
      if (rrqMontantActuel && rrqMontantActuel > 0) {
        totals.rrq = rrqMontantActuel * monthsElapsed;
      }
      
      // SV
      const svBiannual = personNumber === 1 ? 
        userData.retirement.svBiannual1 : 
        userData.retirement.svBiannual2;
      
      if (svBiannual && svBiannual.periode1 && svBiannual.periode2) {
        const currentMonth = currentDate.getMonth() + 1;
        let totalToDate = 0;
        
        const monthsJanJuin = Math.min(6, currentMonth);
        if (monthsJanJuin > 0) {
          totalToDate += monthsJanJuin * svBiannual.periode1.montant;
        }
        
        if (currentMonth > 6) {
          const monthsJuilDec = Math.min(6, currentMonth - 6);
          totalToDate += monthsJuilDec * svBiannual.periode2.montant;
        }
        
        totals.securiteVieillesse = totalToDate;
      }
    }
    
    // Calculs des entrées
    incomeEntries.forEach(entry => {
      if (!entry.isActive) return;
      
      switch (entry.type) {
        case 'salaire':
          if (entry.salaryNetAmount && entry.salaryFrequency) {
            // Calcul simple pour le diagnostic
            const currentDate = new Date();
            const yearStart = new Date(currentDate.getFullYear(), 0, 1);
            const startDate = new Date(entry.salaryStartDate || yearStart);
            const endDate = entry.salaryEndDate ? new Date(entry.salaryEndDate) : currentDate;
            
            const effectiveStart = startDate > yearStart ? startDate : yearStart;
            const effectiveEnd = endDate < currentDate ? endDate : currentDate;
            
            if (effectiveEnd >= effectiveStart) {
              const daysDiff = Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24));
              
              let paymentsCount = 0;
              switch (entry.salaryFrequency) {
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
              
              totals.salaire += paymentsCount * entry.salaryNetAmount;
            }
          }
          break;
          
        case 'assurance-emploi':
          if (entry.weeklyNet && entry.eiStartDate) {
            const startDate = new Date(entry.eiStartDate);
            const currentDate = new Date();
            
            const weeksElapsed = Math.max(0, Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)));
            const maxWeeks = entry.eiEligibleWeeks || 45;
            const actualWeeksElapsed = Math.min(weeksElapsed, maxWeeks);
            
            totals.assuranceEmploi += actualWeeksElapsed * entry.weeklyNet;
          }
          break;
      }
    });
    
    console.log(`  - Salaire à ce jour: ${totals.salaire.toFixed(2)}$`);
    console.log(`  - RRQ à ce jour: ${totals.rrq.toFixed(2)}$`);
    console.log(`  - SV à ce jour: ${totals.securiteVieillesse.toFixed(2)}$`);
    console.log(`  - Assurance emploi à ce jour: ${totals.assuranceEmploi.toFixed(2)}$`);
  }

  /**
   * Teste les calculs avec des données de test
   */
  static testWithSampleData(): void {
    console.log('\n🧪 Test avec données d\'exemple:');
    
    const sampleUserData = {
      retirement: {
        rrqMontantActuel1: 1200,
        rrqMontantActuel2: 1100,
        svMontant1: 692.89,
        svMontant2: 692.89
      }
    };
    
    const sampleIncomeEntries = [
      {
        id: 'test-1',
        type: 'salaire',
        description: 'Salaire principal',
        isActive: true,
        salaryNetAmount: 2720.73,
        salaryFrequency: 'biweekly',
        salaryStartDate: '2025-01-01',
        salaryEndDate: '2025-04-07'
      },
      {
        id: 'test-2',
        type: 'assurance-emploi',
        description: 'Assurance emploi',
        isActive: true,
        weeklyNet: 1270,
        eiStartDate: '2025-04-06',
        eiEligibleWeeks: 35
      }
    ];
    
    this.diagnoseCalculations(sampleUserData, sampleIncomeEntries, 1);
  }
}
