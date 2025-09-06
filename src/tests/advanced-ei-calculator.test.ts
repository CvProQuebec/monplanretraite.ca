/* @ts-nocheck */
import { AdvancedIncomeCalculator, EmploymentPeriod } from '@/services/AdvancedIncomeCalculator';

describe('AdvancedIncomeCalculator.calculateEIDetails', () => {
  // Helpers to mirror internal logic precisely
  const calculateWeeksBetweenDates = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
  };

  const addWeeksToDate = (date: string, weeks: number): string => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + weeks * 7);
    return dateObj.toISOString().split('T')[0];
  };

  it('computes net weekly amount, weeks remaining, and estimated end date deterministically', () => {
    const currentDate = '2024-08-25';
    const startDate = '2024-04-06';

    const periods: EmploymentPeriod[] = [
      {
        id: 'ei-1',
        type: 'ei',
        startDate,
        endDate: currentDate,
        grossAmount: 693,
        deductions: {
          federalTax: 21,
          provincialTax: 37,
        },
        details: {
          weeklyRate: 693,
          maxWeeks: 35,
          weeksUsed: 0,
        },
      },
    ];

    const birthDate = '1964-01-01'; // 60 years old in 2024

    const result = AdvancedIncomeCalculator.calculateEIDetails(periods, birthDate, currentDate);

    // Net weekly = 693 - (21 + 37) = 635
    expect(result.netWeeklyAmount).toBe(693 - (21 + 37));

    const computedWeeksUsed = calculateWeeksBetweenDates(startDate, currentDate);
    const expectedWeeksRemaining = Math.max(0, 35 - computedWeeksUsed);
    expect(result.weeksRemaining).toBe(expectedWeeksRemaining);

    const expectedEndDate = addWeeksToDate(currentDate, expectedWeeksRemaining);
    expect(result.estimatedEndDate).toBe(expectedEndDate);

    // Sanity checks
    expect(result.totalDeductions).toBe(21 + 37);
    expect(result.grossWeeklyAmount).toBe(693);
    expect(result.eligibleForTransition).toBe(true); // age >= 60
  });
});
