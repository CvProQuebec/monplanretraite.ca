// src/tests/performanceCalculations.test.ts
// Unit tests for PerformanceCalculationService (IRR/XIRR, TWR, Annualization)

import { PerformanceCalculationService, type Cashflow, type ValuationPeriod } from '@/services/PerformanceCalculationService';

const closeTo = (received: number, expected: number, precision = 4) => {
  const pass = Math.abs(received - expected) < Math.pow(10, -precision);
  if (!pass) {
    throw new Error(`Expected ${received} to be close to ${expected} (precision ${precision})`);
  }
};

describe('PerformanceCalculationService', () => {
  describe('IRR/XIRR (MWR)', () => {
    test('simple annual IRR: -1000 now, +1100 in 1 year ~ 10%', () => {
      const t0 = new Date('2024-01-01');
      const t1 = new Date('2025-01-01');
      const flows: Cashflow[] = [
        { date: t0, amount: -1000 },
        { date: t1, amount: 1100 }
      ];
      const irr = PerformanceCalculationService.xirr(flows, { guess: 0.1 });
      closeTo(irr, 0.10, 4);
    });

    test('irregular XIRR with multiple cashflows', () => {
      const t0 = new Date('2024-01-01');
      const t05 = new Date('2024-07-01'); // ~0.5 year
      const t1 = new Date('2025-01-01');
      const flows: Cashflow[] = [
        { date: t0, amount: -1000 },
        { date: t05, amount: -1000 },
        { date: t1, amount: 2200 }
      ];
      const xirr = PerformanceCalculationService.xirr(flows, { guess: 0.15 });
      // This configuration should yield a positive IRR around ~17-20%
      expect(xirr).toBeGreaterThan(0.15);
      expect(xirr).toBeLessThan(0.25);
    });

    test('no sign change should yield 0 safely', () => {
      const t0 = new Date('2024-01-01');
      const flows: Cashflow[] = [
        { date: t0, amount: -1000 },
        { date: new Date('2024-06-01'), amount: -200 },
      ];
      const irr = PerformanceCalculationService.xirr(flows);
      expect(irr).toBe(0);
    });
  });

  describe('TWR (Time-Weighted Return)', () => {
    test('two-period TWR with deposit at boundary ~ 16.47%', () => {
      // Example:
      // Period 1: start=100 -> end(before flow)=120, flow at boundary +50
      // r1 = 120/100 = 1.2
      // Period 2: start=170 -> end=165, no flow -> r2 = 165/170 ≈ 0.970588
      // Total TWR = 1.2 * 0.970588 - 1 ≈ 0.164706
      const p1: ValuationPeriod = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-01'),
        startValue: 100,
        endValue: 120,
        netFlow: 0
      };
      const p2: ValuationPeriod = {
        startDate: new Date('2024-06-01'),
        endDate: new Date('2025-01-01'),
        startValue: 170,
        endValue: 165,
        netFlow: 0
      };
      const res = PerformanceCalculationService.twr([p1, p2]);
      closeTo(res.totalReturn, 0.164706, 4);
      // Annualization will depend on actual date span; we assert presence and sanity
      expect(res.annualizedReturn).toBeDefined();
    });

    test('empty periods returns 0', () => {
      const res = PerformanceCalculationService.twr([]);
      expect(res.totalReturn).toBe(0);
      expect(res.annualizedReturn).toBeUndefined();
    });
  });

  describe('Annualization helper', () => {
    test('annualize 20% over 2 years ~ 9.54% annual', () => {
      const a = PerformanceCalculationService.annualize(0.20, 2);
      closeTo(a, Math.pow(1.2, 0.5) - 1, 6);
    });
  });
});
