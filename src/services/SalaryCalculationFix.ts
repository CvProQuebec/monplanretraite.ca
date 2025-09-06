// Service de calcul de salaire simplifié et robuste
export class SalaryCalculationFix {
  
  // Calcul simple et fiable du salaire "à ce jour"
  static calculateSalaryToDate(entry: any): number {
    console.log('🔧 SALARY CALC - Entry:', entry);
    
    if (!entry || !entry.isActive) {
      console.log('🔧 SALARY CALC - Entry not active or missing');
      return 0;
    }

    // Priorité 1: Montant mensuel direct
    if (entry.monthlyAmount && entry.monthlyAmount > 0) {
      const monthsElapsed = new Date().getMonth() + 1;
      const result = entry.monthlyAmount * monthsElapsed;
      console.log('🔧 SALARY CALC - Monthly calculation:', {
        monthlyAmount: entry.monthlyAmount,
        monthsElapsed,
        result
      });
      return result;
    }

    // Priorité 2: Données détaillées de salaire
    if (entry.salaryNetAmount && entry.salaryFrequency) {
      const netAmount = entry.salaryNetAmount;
      const frequency = entry.salaryFrequency;
      
      console.log('🔧 SALARY CALC - Detailed calculation:', {
        netAmount,
        frequency
      });

      if (frequency === 'monthly') {
        const monthsElapsed = new Date().getMonth() + 1;
        const result = netAmount * monthsElapsed;
        console.log('🔧 SALARY CALC - Monthly detailed:', result);
        return result;
      }
      
      if (frequency === 'biweekly') {
        // Dates spécifiques pour Postes Canada
        const paymentDates = [
          new Date('2025-01-02'),
          new Date('2025-01-16'),
          new Date('2025-01-30'),
          new Date('2025-02-13'),
          new Date('2025-02-27'),
          new Date('2025-03-13'),
          new Date('2025-03-27'),
          new Date('2025-04-10')
        ];
        
        const today = new Date();
        let paymentsCount = 0;
        for (const payDate of paymentDates) {
          if (payDate <= today) {
            paymentsCount++;
          }
        }
        
        const result = paymentsCount * netAmount;
        console.log('🔧 SALARY CALC - Biweekly detailed:', {
          paymentsCount,
          netAmount,
          result
        });
        return result;
      }
    }

    // Priorité 3: Montant annuel projeté
    if (entry.projectedAnnual && entry.projectedAnnual > 0) {
      const monthsElapsed = new Date().getMonth() + 1;
      const result = (entry.projectedAnnual / 12) * monthsElapsed;
      console.log('🔧 SALARY CALC - Annual calculation:', {
        projectedAnnual: entry.projectedAnnual,
        monthsElapsed,
        result
      });
      return result;
    }

    console.log('🔧 SALARY CALC - No valid data found, returning 0');
    return 0;
  }

  // Calcul des totaux par type de revenu
  static calculateIncomeTotals(incomeEntries: any[]): any {
    const totals = {
      salaire: 0,
      assuranceEmploi: 0,
      travailAutonome: 0,
      revenusLocation: 0,
      rrq: 0,
      securiteVieillesse: 0,
      rentesPrivees: 0,
      mensuelMoyen: 0,
      totalAnnuelProjete: 0
    };

    console.log('🔧 TOTALS CALC - Processing entries:', incomeEntries.length);

    incomeEntries.forEach((entry, index) => {
      console.log(`🔧 TOTALS CALC - Entry ${index}:`, {
        type: entry.type,
        description: entry.description,
        isActive: entry.isActive
      });

      if (!entry.isActive) {
        console.log(`🔧 TOTALS CALC - Entry ${index} not active, skipping`);
        return;
      }

      let toDateAmount = 0;

      switch (entry.type) {
        case 'salaire':
        case 'emploi-saisonnier':
          toDateAmount = this.calculateSalaryToDate(entry);
          totals.salaire += toDateAmount;
          console.log(`🔧 TOTALS CALC - Salary added: ${toDateAmount}, total: ${totals.salaire}`);
          break;
          
        case 'assurance-emploi':
          // Calcul simple pour l'assurance emploi
          if (entry.eiNetAmount && entry.eiPaymentFrequency) {
            const weeksElapsed = Math.floor((new Date().getTime() - new Date(entry.eiStartDate || '2025-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000));
            toDateAmount = Math.max(0, weeksElapsed) * entry.eiNetAmount;
          }
          totals.assuranceEmploi += toDateAmount;
          break;
          
        case 'travail-autonome':
          console.log(`🔧 TOTALS CALC - Processing travail-autonome entry:`, {
            description: entry.description,
            monthlyAmount: entry.monthlyAmount,
            projectedAnnual: entry.projectedAnnual
          });
          
          if (entry.monthlyAmount) {
            const monthsElapsed = new Date().getMonth() + 1;
            toDateAmount = entry.monthlyAmount * monthsElapsed;
          } else if (entry.projectedAnnual) {
            const monthsElapsed = new Date().getMonth() + 1;
            toDateAmount = (entry.projectedAnnual / 12) * monthsElapsed;
          }
          totals.travailAutonome += toDateAmount;
          console.log(`🔧 TOTALS CALC - Added to travailAutonome: ${toDateAmount}, total: ${totals.travailAutonome}`);
          break;
          
        case 'revenus-location':
          console.log(`🔧 TOTALS CALC - Processing revenus-location entry:`, {
            description: entry.description,
            monthlyAmount: entry.monthlyAmount,
            projectedAnnual: entry.projectedAnnual
          });
          
          if (entry.monthlyAmount) {
            const monthsElapsed = new Date().getMonth() + 1;
            toDateAmount = entry.monthlyAmount * monthsElapsed;
          } else if (entry.projectedAnnual) {
            const monthsElapsed = new Date().getMonth() + 1;
            toDateAmount = (entry.projectedAnnual / 12) * monthsElapsed;
          }
          totals.revenusLocation += toDateAmount;
          console.log(`🔧 TOTALS CALC - Added to revenusLocation: ${toDateAmount}, total: ${totals.revenusLocation}`);
          break;
          
        case 'rentes':
          console.log(`🔧 TOTALS CALC - Processing rentes entry:`, {
            description: entry.description,
            monthlyAmount: entry.monthlyAmount,
            projectedAnnual: entry.projectedAnnual,
            pensionAmount: entry.pensionAmount
          });
          
          const description = entry.description?.toLowerCase() || '';
          
          // Calculer le montant à ce jour avec plusieurs fallbacks
          if (entry.monthlyAmount) {
            const monthsElapsed = new Date().getMonth() + 1;
            toDateAmount = entry.monthlyAmount * monthsElapsed;
            console.log(`🔧 TOTALS CALC - Using monthlyAmount: ${entry.monthlyAmount} * ${monthsElapsed} = ${toDateAmount}`);
          } else if (entry.projectedAnnual) {
            const monthsElapsed = new Date().getMonth() + 1;
            toDateAmount = (entry.projectedAnnual / 12) * monthsElapsed;
            console.log(`🔧 TOTALS CALC - Using projectedAnnual: ${entry.projectedAnnual} / 12 * ${monthsElapsed} = ${toDateAmount}`);
          } else if (entry.pensionAmount) {
            const monthsElapsed = new Date().getMonth() + 1;
            toDateAmount = entry.pensionAmount * monthsElapsed;
            console.log(`🔧 TOTALS CALC - Using pensionAmount: ${entry.pensionAmount} * ${monthsElapsed} = ${toDateAmount}`);
          }
          
          // Catégoriser selon la description
          if (description.includes('rrq') || description.includes('cpp')) {
            totals.rrq += toDateAmount;
            console.log(`🔧 TOTALS CALC - Added to RRQ: ${toDateAmount}, total: ${totals.rrq}`);
          } else if (description.includes('sv') || description.includes('sécurité') || description.includes('vieillesse')) {
            totals.securiteVieillesse += toDateAmount;
            console.log(`🔧 TOTALS CALC - Added to SV: ${toDateAmount}, total: ${totals.securiteVieillesse}`);
          } else {
            totals.rentesPrivees += toDateAmount;
            console.log(`🔧 TOTALS CALC - Added to rentesPrivees: ${toDateAmount}, total: ${totals.rentesPrivees}`);
          }
          break;
      }

      console.log(`🔧 TOTALS CALC - Entry ${index} calculated: ${toDateAmount}`);
    });

    // Calculer les totaux
    totals.mensuelMoyen = (totals.salaire + totals.assuranceEmploi + totals.travailAutonome + totals.revenusLocation + totals.rrq + totals.securiteVieillesse + totals.rentesPrivees) / 12;
    totals.totalAnnuelProjete = totals.salaire + totals.assuranceEmploi + totals.travailAutonome + totals.revenusLocation + totals.rrq + totals.securiteVieillesse + totals.rentesPrivees;

    console.log('🔧 TOTALS CALC - Final totals:', totals);
    return totals;
  }
}
