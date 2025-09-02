/**
 * Tests de validation CPM2014
 * Vérification de l'implémentation et conformité IPF 2025
 */

import {
  calculateLifeExpectancyCPM2014,
  getRecommendedPlanningAge,
  validateIPFCompliance,
  CPM2014_LIFE_EXPECTANCY_2025,
  CPM2014_METADATA
} from '../config/cpm2014-mortality-table';

import { MORTALITY_CPM2014 } from '../config/financial-assumptions';

describe('CPM2014 Implementation', () => {
  describe('Data Validation', () => {
    test('validates all life expectancy data is present and valid', () => {
      expect(CPM2014_LIFE_EXPECTANCY_2025).toBeDefined();
      expect(CPM2014_LIFE_EXPECTANCY_2025.length).toBe(7); // Ages 60, 65, 70, 75, 80, 90, 100

      CPM2014_LIFE_EXPECTANCY_2025.forEach(data => {
        expect(data.age).toBeGreaterThanOrEqual(60);
        expect(data.male_2025).toBeGreaterThan(0);
        expect(data.female_2025).toBeGreaterThan(0);
        expect(data.source).toContain('CPM2014');
      });
    });

    test('validates age progression is correct', () => {
      const ages = CPM2014_LIFE_EXPECTANCY_2025.map(d => d.age);
      expect(ages).toEqual([60, 65, 70, 75, 80, 90, 100]);
    });

    test('validates metadata is complete', () => {
      expect(CPM2014_METADATA.source).toBe('Institut canadien des actuaires');
      expect(CPM2014_METADATA.table).toContain('CPM2014');
      expect(CPM2014_METADATA.projection).toContain('2025');
      expect(CPM2014_METADATA.compliance).toContain('IPF 2025');
      expect(CPM2014_METADATA.implementationDate).toBeDefined();
      expect(CPM2014_METADATA.dataFile).toBe('214013T4f.xlsx');
    });
  });

  describe('Life Expectancy Calculations', () => {
    test('calculates life expectancy for age 65 male', () => {
      const result = calculateLifeExpectancyCPM2014({ age: 65, gender: 'male' });

      expect(result.lifeExpectancy).toBeGreaterThan(20);
      expect(result.lifeExpectancy).toBeLessThan(25);
      expect(result.recommendedPlanningAge).toBeGreaterThan(85);
      expect(result.recommendedPlanningAge).toBeLessThan(100);
      expect(result.source).toContain('CPM2014');
      expect(result.compliance).toContain('IPF 2025');
    });

    test('calculates life expectancy for age 65 female', () => {
      const result = calculateLifeExpectancyCPM2014({ age: 65, gender: 'female' });

      expect(result.lifeExpectancy).toBeGreaterThan(23);
      expect(result.lifeExpectancy).toBeLessThan(27);
      expect(result.recommendedPlanningAge).toBeGreaterThan(88);
      expect(result.recommendedPlanningAge).toBeLessThan(100);
    });

    test('calculates life expectancy for age 70 male', () => {
      const result = calculateLifeExpectancyCPM2014({ age: 70, gender: 'male' });

      expect(result.lifeExpectancy).toBeGreaterThan(16);
      expect(result.lifeExpectancy).toBeLessThan(20);
      expect(result.recommendedPlanningAge).toBeGreaterThan(85);
    });

    test('calculates life expectancy for age 70 female', () => {
      const result = calculateLifeExpectancyCPM2014({ age: 70, gender: 'female' });

      expect(result.lifeExpectancy).toBeGreaterThan(18);
      expect(result.lifeExpectancy).toBeLessThan(22);
      expect(result.recommendedPlanningAge).toBeGreaterThan(88);
    });

    test('handles edge cases correctly', () => {
      // Age below minimum (60)
      const youngResult = calculateLifeExpectancyCPM2014({ age: 50, gender: 'male' });
      expect(youngResult.lifeExpectancy).toBeGreaterThan(25); // Should extrapolate

      // Age above maximum (100)
      const oldResult = calculateLifeExpectancyCPM2014({ age: 105, gender: 'male' });
      expect(oldResult.lifeExpectancy).toBeLessThanOrEqual(2); // Should cap
    });

    test('interpolates correctly between data points', () => {
      const result62 = calculateLifeExpectancyCPM2014({ age: 62, gender: 'male' });
      const result60 = calculateLifeExpectancyCPM2014({ age: 60, gender: 'male' });
      const result65 = calculateLifeExpectancyCPM2014({ age: 65, gender: 'male' });

      // Age 62 should be between age 60 and 65
      expect(result62.lifeExpectancy).toBeGreaterThan(result60.lifeExpectancy - 1);
      expect(result62.lifeExpectancy).toBeLessThan(result65.lifeExpectancy + 1);
    });
  });

  describe('Planning Age Recommendations', () => {
    test('provides appropriate planning ages', () => {
      const testCases = [
        { age: 60, gender: 'male', expectedMin: 85, expectedMax: 95 },
        { age: 65, gender: 'male', expectedMin: 85, expectedMax: 95 },
        { age: 70, gender: 'male', expectedMin: 85, expectedMax: 95 },
        { age: 60, gender: 'female', expectedMin: 88, expectedMax: 98 },
        { age: 65, gender: 'female', expectedMin: 88, expectedMax: 98 },
        { age: 70, gender: 'female', expectedMin: 88, expectedMax: 98 }
      ];

      testCases.forEach(({ age, gender, expectedMin, expectedMax }) => {
        const planningAge = getRecommendedPlanningAge(age, gender as 'male' | 'female');
        expect(planningAge).toBeGreaterThanOrEqual(expectedMin);
        expect(planningAge).toBeLessThanOrEqual(expectedMax);
      });
    });

    test('planning age meets IPF 2025 standards', () => {
      const planningAge = getRecommendedPlanningAge(65, 'female');
      expect(planningAge).toBeGreaterThan(85);
      expect(planningAge).toBeLessThan(100);
    });
  });

  describe('IPF Compliance Validation', () => {
    test('validates IPF compliance function returns true', () => {
      expect(validateIPFCompliance()).toBe(true);
    });

    test('validates all data points have positive values', () => {
      const allValid = CPM2014_LIFE_EXPECTANCY_2025.every(
        d => d.male_2025 > 0 && d.female_2025 > 0
      );
      expect(allValid).toBe(true);
    });

    test('validates data integrity', () => {
      expect(CPM2014_LIFE_EXPECTANCY_2025.length).toBeGreaterThan(0);
      expect(CPM2014_LIFE_EXPECTANCY_2025.every(d => d.age >= 60)).toBe(true);
    });
  });

  describe('Integration with Financial Assumptions', () => {
    test('MORTALITY_CPM2014 module is properly integrated', () => {
      expect(MORTALITY_CPM2014).toBeDefined();
      expect(MORTALITY_CPM2014.calculateLifeExpectancy).toBeDefined();
      expect(MORTALITY_CPM2014.getRecommendedPlanningAge).toBeDefined();
      expect(MORTALITY_CPM2014.validateCompliance).toBeDefined();
      expect(MORTALITY_CPM2014.metadata).toBeDefined();
      expect(MORTALITY_CPM2014.getLifeExpectancyDisplay).toBeDefined();
    });

    test('getLifeExpectancyDisplay returns correct format', () => {
      const display = MORTALITY_CPM2014.getLifeExpectancyDisplay(65, 'male');

      expect(display).toHaveProperty('lifeExpectancy');
      expect(display).toHaveProperty('finalAge');
      expect(display).toHaveProperty('planningAge');
      expect(display).toHaveProperty('source');

      expect(display.lifeExpectancy).toBeGreaterThan(20);
      expect(display.finalAge).toBeGreaterThan(85);
      expect(display.planningAge).toBeGreaterThan(85);
      expect(display.source).toContain('CPM2014');
    });
  });

  describe('Data Consistency', () => {
    test('male life expectancy is less than female at same age', () => {
      [60, 65, 70, 75, 80, 90, 100].forEach(age => {
        const maleResult = calculateLifeExpectancyCPM2014({ age, gender: 'male' });
        const femaleResult = calculateLifeExpectancyCPM2014({ age, gender: 'female' });

        expect(maleResult.lifeExpectancy).toBeLessThan(femaleResult.lifeExpectancy);
      });
    });

    test('life expectancy decreases with age', () => {
      const ages = [60, 65, 70, 75, 80, 90, 100];

      for (let i = 1; i < ages.length; i++) {
        const younger = calculateLifeExpectancyCPM2014({ age: ages[i-1], gender: 'male' });
        const older = calculateLifeExpectancyCPM2014({ age: ages[i], gender: 'male' });

        expect(younger.lifeExpectancy).toBeGreaterThan(older.lifeExpectancy);
      }
    });

    test('planning age increases appropriately with current age', () => {
      const ages = [60, 65, 70, 75];

      for (let i = 1; i < ages.length; i++) {
        const younger = getRecommendedPlanningAge(ages[i-1], 'male');
        const older = getRecommendedPlanningAge(ages[i], 'male');

        expect(older).toBeGreaterThanOrEqual(younger);
      }
    });
  });

  describe('Performance and Edge Cases', () => {
    test('handles very young ages gracefully', () => {
      const result = calculateLifeExpectancyCPM2014({ age: 30, gender: 'male' });
      expect(result.lifeExpectancy).toBeGreaterThan(30);
      expect(result.recommendedPlanningAge).toBeGreaterThan(60);
    });

    test('handles very old ages gracefully', () => {
      const result = calculateLifeExpectancyCPM2014({ age: 110, gender: 'male' });
      expect(result.lifeExpectancy).toBeLessThanOrEqual(2);
      expect(result.recommendedPlanningAge).toBeLessThanOrEqual(100);
    });

    test('calculations are deterministic', () => {
      const result1 = calculateLifeExpectancyCPM2014({ age: 65, gender: 'male' });
      const result2 = calculateLifeExpectancyCPM2014({ age: 65, gender: 'male' });

      expect(result1.lifeExpectancy).toBe(result2.lifeExpectancy);
      expect(result1.recommendedPlanningAge).toBe(result2.recommendedPlanningAge);
    });
  });
});
