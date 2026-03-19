import { IncomeSynchronizationService } from '@/services/IncomeSynchronizationService';
import { UserData } from '@/types';

describe('IncomeSynchronizationService', () => {
  const mockUserData: UserData = {
    personal: {
      prenom1: 'Jean',
      prenom2: 'Marie',
      naissance1: '1980-01-01',
      naissance2: '1985-01-01',
      sexe1: 'M',
      sexe2: 'F',
      salaire1: 75000,
      salaire2: 65000,
      secteurActivite1: 'technologie',
      secteurActivite2: 'sante'
    },
    retirement: {
      rrqAgeActuel1: 65,
      rrqMontantActuel1: 0,
      rrqMontant70_1: 0,
      esperanceVie1: 85,
      rrqAgeActuel2: 65,
      rrqMontantActuel2: 0,
      rrqMontant70_2: 0,
      esperanceVie2: 87,
      rregopMembre1: 'non',
      rregopAnnees1: 0,
      pensionPrivee1: 0,
      pensionPrivee2: 0
    },
    savings: {
      reer1: 0,
      reer2: 0,
      celi1: 0,
      celi2: 0,
      placements1: 0,
      placements2: 0,
      epargne1: 0,
      epargne2: 0,
      cri1: 0,
      cri2: 0,
      residenceValeur: 0,
      residenceHypotheque: 0
    },
    cashflow: {
      logement: 0,
      servicesPublics: 0,
      assurances: 0,
      telecom: 0,
      alimentation: 0,
      transport: 0,
      sante: 0,
      loisirs: 0
    }
  };

  describe('synchronizeHouseholdIncome', () => {
    it('should calculate total household income correctly', () => {
      const result = IncomeSynchronizationService.synchronizeHouseholdIncome(mockUserData);
      
      expect(result.totalHouseholdIncome).toBe(140000);
      expect(result.person1Income).toBe(75000);
      expect(result.person2Income).toBe(65000);
      expect(result.monthlyHouseholdIncome).toBeCloseTo(11666.67, 2);
      expect(result.annualHouseholdIncome).toBe(140000);
    });

    it('should calculate income multiplier correctly', () => {
      const result = IncomeSynchronizationService.synchronizeHouseholdIncome(mockUserData);
      
      // 140000 / 100000 * 0.05 = 0.07, so 1 + 0.07 = 1.07
      expect(result.incomeMultiplier).toBeCloseTo(1.07, 2);
    });

    it('should calculate sector impact correctly', () => {
      const result = IncomeSynchronizationService.synchronizeHouseholdIncome(mockUserData);
      
      // technologie (0.2) + sante (0.5) / 2 = 0.35
      expect(result.sectorImpact).toBeCloseTo(0.35, 2);
    });
  });

  describe('calculateIncomeLongevityImpact', () => {
    it('should calculate longevity impact for high income', () => {
      const incomeData = IncomeSynchronizationService.synchronizeHouseholdIncome(mockUserData);
      const impact = IncomeSynchronizationService.calculateIncomeLongevityImpact(incomeData);
      
      expect(impact.lifeExpectancyAdjustment).toBeGreaterThan(0);
      expect(impact.healthMultiplier).toBeGreaterThan(1);
      expect(impact.stressReduction).toBeGreaterThan(0);
    });

    it('should handle zero income', () => {
      const zeroIncomeData = {
        totalHouseholdIncome: 0,
        person1Income: 0,
        person2Income: 0,
        monthlyHouseholdIncome: 0,
        annualHouseholdIncome: 0,
        incomeMultiplier: 1.0,
        sectorImpact: 0
      };
      
      const impact = IncomeSynchronizationService.calculateIncomeLongevityImpact(zeroIncomeData);
      
      expect(impact.lifeExpectancyAdjustment).toBe(-0.5); // Low income penalty
      expect(impact.healthMultiplier).toBe(1.0);
      expect(impact.stressReduction).toBe(0);
    });
  });

  describe('updateUserDataWithSynchronizedIncome', () => {
    it('should update user data with synchronized income', () => {
      const updateUserData = jest.fn();
      IncomeSynchronizationService.updateUserDataWithSynchronizedIncome(mockUserData, updateUserData);
      
      expect(updateUserData).toHaveBeenCalledWith('personal', expect.objectContaining({
        totalHouseholdIncome: 140000,
        monthlyHouseholdIncome: expect.closeTo(11666.67, 2),
        incomeMultiplier: expect.any(Number),
        sectorLongevityImpact: expect.any(Number)
      }));
    });
  });
});
