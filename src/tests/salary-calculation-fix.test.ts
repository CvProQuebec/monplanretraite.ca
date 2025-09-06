/* @ts-nocheck */
import { SalaryCalculationFix } from '@/services/SalaryCalculationFix';

describe('SalaryCalculationFix - seasonal employment integration', () => {
  it('treats emploi-saisonnier like salaire in totals', () => {
    const monthsElapsed = new Date().getMonth() + 1;

    const entries = [
      // Regular salary using monthlyAmount path
      {
        id: 'salary-1',
        type: 'salaire',
        description: 'Salaire principal',
        isActive: true,
        monthlyAmount: 3000
      },
      // Seasonal employment using detailed salary path (net + frequency)
      {
        id: 'seasonal-1',
        type: 'emploi-saisonnier',
        description: 'Contrat saisonnier',
        isActive: true,
        salaryNetAmount: 1000,
        salaryFrequency: 'monthly'
      },
      // Inactive entries should be ignored
      {
        id: 'inactive-ignored',
        type: 'emploi-saisonnier',
        description: 'Inactif',
        isActive: false,
        monthlyAmount: 9999
      }
    ] as any[];

    const totals = SalaryCalculationFix.calculateIncomeTotals(entries);

    const expectedSalaryToDate =
      // monthlyAmount path
      3000 * monthsElapsed +
      // detailed monthly frequency path
      1000 * monthsElapsed;

    expect(totals.salaire).toBe(expectedSalaryToDate);
    expect(totals.assuranceEmploi).toBe(0);
  });
});
