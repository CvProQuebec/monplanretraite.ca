import { IncomeEntry } from '@/types';

/**
 * Calcule le nombre de versements entre deux dates selon la fréquence
 */
export function calculatePaymentCount(
  startDate: string,
  endDate: string,
  frequency: 'weekly' | 'biweekly' | 'bimonthly' | 'monthly'
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start >= end) return 0;
  
  const timeDiff = end.getTime() - start.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  switch (frequency) {
    case 'weekly':
      return Math.floor(daysDiff / 7);
    case 'biweekly':
      return Math.floor(daysDiff / 14);
    case 'bimonthly':
      return Math.floor(daysDiff / 15); // Approximation pour bimestriel
    case 'monthly':
      return Math.floor(daysDiff / 30); // Approximation pour mensuel
    default:
      return 0;
  }
}

/**
 * Calcule le revenu total basé sur les périodes réelles de versement
 */
export function calculateIncomeFromPeriods(incomeEntries: IncomeEntry[]): {
  totalSalary: number;
  totalPensions: number;
  totalOtherIncome: number;
  totalIncome: number;
  details: {
    salary: Array<{description: string, amount: number, period: string}>;
    pensions: Array<{description: string, amount: number, period: string}>;
    other: Array<{description: string, amount: number, period: string}>;
  };
} {
  let totalSalary = 0;
  let totalPensions = 0;
  let totalOtherIncome = 0;
  
  const details = {
    salary: [] as Array<{description: string, amount: number, period: string}>,
    pensions: [] as Array<{description: string, amount: number, period: string}>,
    other: [] as Array<{description: string, amount: number, period: string}>
  };

  incomeEntries.forEach(entry => {
    if (!entry.isActive) return;

    let calculatedAmount = 0;
    let periodDescription = '';

    switch (entry.type) {
      case 'salaire':
        if (entry.salaryStartDate && entry.salaryEndDate && entry.salaryNetAmount && entry.salaryFrequency) {
          const paymentCount = calculatePaymentCount(
            entry.salaryStartDate,
            entry.salaryEndDate,
            entry.salaryFrequency
          );
          calculatedAmount = entry.salaryNetAmount * paymentCount;
          periodDescription = `${entry.salaryStartDate} au ${entry.salaryEndDate} (${paymentCount} versements)`;
        } else if (entry.annualAmount) {
          // Fallback sur le montant annuel si pas de dates
          calculatedAmount = entry.annualAmount;
          periodDescription = 'Montant annuel';
        }
        totalSalary += calculatedAmount;
        details.salary.push({
          description: entry.description,
          amount: calculatedAmount,
          period: periodDescription
        });
        break;

      case 'assurance-emploi':
        if (entry.eiStartDate && entry.weeklyNet && entry.eiEligibleWeeks) {
          // Calculer le nombre de semaines entre la date de début et maintenant
          const startDate = new Date(entry.eiStartDate);
          const currentDate = new Date();
          const weeksElapsed = Math.min(
            Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)),
            entry.eiEligibleWeeks
          );
          calculatedAmount = entry.weeklyNet * weeksElapsed;
          periodDescription = `${entry.eiStartDate} (${weeksElapsed}/${entry.eiEligibleWeeks} semaines)`;
        } else if (entry.weeklyNet) {
          // Fallback sur le montant hebdomadaire * 52
          calculatedAmount = entry.weeklyNet * 52;
          periodDescription = 'Estimation annuelle';
        }
        totalOtherIncome += calculatedAmount;
        details.other.push({
          description: entry.description,
          amount: calculatedAmount,
          period: periodDescription
        });
        break;

      case 'rentes':
        if (entry.pensionStartDate && entry.pensionAmount && entry.pensionFrequency) {
          // Calculer le nombre de versements depuis le début
          const startDate = new Date(entry.pensionStartDate);
          const currentDate = new Date();
          const monthsElapsed = Math.max(0, 
            (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
            (currentDate.getMonth() - startDate.getMonth())
          );
          
          let paymentCount = 0;
          switch (entry.pensionFrequency) {
            case 'monthly':
              paymentCount = monthsElapsed;
              break;
            case 'quarterly':
              paymentCount = Math.floor(monthsElapsed / 3);
              break;
            case 'semi-annual':
              paymentCount = Math.floor(monthsElapsed / 6);
              break;
            case 'annual':
              paymentCount = Math.floor(monthsElapsed / 12);
              break;
          }
          
          calculatedAmount = entry.pensionAmount * paymentCount;
          periodDescription = `${entry.pensionStartDate} (${paymentCount} versements)`;
        } else if (entry.annualAmount) {
          calculatedAmount = entry.annualAmount;
          periodDescription = 'Montant annuel';
        } else if (entry.monthlyAmount) {
          calculatedAmount = entry.monthlyAmount * 12;
          periodDescription = 'Montant mensuel × 12';
        }
        totalPensions += calculatedAmount;
        details.pensions.push({
          description: entry.description,
          amount: calculatedAmount,
          period: periodDescription
        });
        break;

      default:
        // Autres types de revenus
        if (entry.annualAmount) {
          calculatedAmount = entry.annualAmount;
          periodDescription = 'Montant annuel';
        } else if (entry.monthlyAmount) {
          calculatedAmount = entry.monthlyAmount * 12;
          periodDescription = 'Montant mensuel × 12';
        } else if (entry.weeklyAmount) {
          calculatedAmount = entry.weeklyAmount * 52;
          periodDescription = 'Montant hebdomadaire × 52';
        }
        totalOtherIncome += calculatedAmount;
        details.other.push({
          description: entry.description,
          amount: calculatedAmount,
          period: periodDescription
        });
        break;
    }
  });

  return {
    totalSalary,
    totalPensions,
    totalOtherIncome,
    totalIncome: totalSalary + totalPensions + totalOtherIncome,
    details
  };
}

/**
 * Calcule le revenu pour une année spécifique
 */
export function calculateIncomeForYear(
  incomeEntries: IncomeEntry[],
  year: number = new Date().getFullYear()
): {
  totalSalary: number;
  totalPensions: number;
  totalOtherIncome: number;
  totalIncome: number;
} {
  let totalSalary = 0;
  let totalPensions = 0;
  let totalOtherIncome = 0;

  incomeEntries.forEach(entry => {
    if (!entry.isActive) return;

    let calculatedAmount = 0;

    switch (entry.type) {
      case 'salaire':
        if (entry.salaryStartDate && entry.salaryEndDate && entry.salaryNetAmount && entry.salaryFrequency) {
          const startDate = new Date(entry.salaryStartDate);
          const endDate = new Date(entry.salaryEndDate);
          const yearStart = new Date(year, 0, 1);
          const yearEnd = new Date(year, 11, 31);
          
          // Calculer la période d'intersection avec l'année
          const actualStart = startDate > yearStart ? startDate : yearStart;
          const actualEnd = endDate < yearEnd ? endDate : yearEnd;
          
          if (actualStart <= actualEnd) {
            const paymentCount = calculatePaymentCount(
              actualStart.toISOString().split('T')[0],
              actualEnd.toISOString().split('T')[0],
              entry.salaryFrequency
            );
            calculatedAmount = entry.salaryNetAmount * paymentCount;
          }
        } else if (entry.annualAmount) {
          calculatedAmount = entry.annualAmount;
        }
        totalSalary += calculatedAmount;
        break;

      case 'assurance-emploi':
        if (entry.eiStartDate && entry.weeklyNet) {
          const startDate = new Date(entry.eiStartDate);
          const yearStart = new Date(year, 0, 1);
          const yearEnd = new Date(year, 11, 31);
          
          // Calculer la période d'intersection avec l'année
          const actualStart = startDate > yearStart ? startDate : yearStart;
          const actualEnd = yearEnd;
          
          if (actualStart <= actualEnd) {
            const weeksInYear = Math.floor((actualEnd.getTime() - actualStart.getTime()) / (1000 * 60 * 60 * 24 * 7));
            calculatedAmount = entry.weeklyNet * weeksInYear;
          }
        } else if (entry.weeklyNet) {
          calculatedAmount = entry.weeklyNet * 52;
        }
        totalOtherIncome += calculatedAmount;
        break;

      case 'rentes':
        if (entry.pensionAmount && entry.pensionFrequency) {
          let paymentCount = 0;
          switch (entry.pensionFrequency) {
            case 'monthly':
              paymentCount = 12;
              break;
            case 'quarterly':
              paymentCount = 4;
              break;
            case 'semi-annual':
              paymentCount = 2;
              break;
            case 'annual':
              paymentCount = 1;
              break;
          }
          calculatedAmount = entry.pensionAmount * paymentCount;
        } else if (entry.annualAmount) {
          calculatedAmount = entry.annualAmount;
        } else if (entry.monthlyAmount) {
          calculatedAmount = entry.monthlyAmount * 12;
        }
        totalPensions += calculatedAmount;
        break;

      default:
        if (entry.annualAmount) {
          calculatedAmount = entry.annualAmount;
        } else if (entry.monthlyAmount) {
          calculatedAmount = entry.monthlyAmount * 12;
        } else if (entry.weeklyAmount) {
          calculatedAmount = entry.weeklyAmount * 52;
        }
        totalOtherIncome += calculatedAmount;
        break;
    }
  });

  return {
    totalSalary,
    totalPensions,
    totalOtherIncome,
    totalIncome: totalSalary + totalPensions + totalOtherIncome
  };
}
