// src/features/retirement/services/SecureCalculationService.test.ts
import { SecureCalculationService } from './SecureCalculationService';
import { UserData } from '../types';

// Mock des données de test
const mockUserData: UserData = {
  personal: {
    prenom1: 'Jean',
    prenom2: 'Marie',
    naissance1: '1980-01-01',
    naissance2: '1982-01-01',
    sexe1: 'M',
    sexe2: 'F',
    salaire1: 75000,
    salaire2: 65000,
    statutProfessionnel1: 'actif',
    statutProfessionnel2: 'actif',
    ageRetraiteSouhaite1: 65,
    ageRetraiteSouhaite2: 65,
    depensesRetraite: 0
  },
  retirement: {
    rrqAgeActuel1: 65,
    rrqMontantActuel1: 1200,
    rrqMontant70_1: 1500,
    esperanceVie1: 85,
    rrqAgeActuel2: 63,
    rrqMontantActuel2: 1100,
    rrqMontant70_2: 1400,
    esperanceVie2: 87,
    rregopMembre1: 'non',
    rregopAnnees1: 0,
    pensionPrivee1: 500,
    pensionPrivee2: 400,
    svMontant1: 800,
    svMontant2: 800,
    svRevenus1: 0,
    svRevenus2: 0,
    svAgeDebut1: 65,
    svAgeDebut2: 65
  },
  savings: {
    reer1: 150000,
    reer2: 120000,
    celi1: 50000,
    celi2: 40000,
    placements1: 75000,
    placements2: 60000,
    epargne1: 25000,
    epargne2: 20000,
    cri1: 30000,
    cri2: 25000,
    residenceValeur: 450000,
    residenceHypotheque: 200000
  },
  cashflow: {
    logement: 2000,
    servicesPublics: 300,
    assurances: 400,
    telecom: 150,
    alimentation: 800,
    transport: 500,
    sante: 300,
    loisirs: 600
  }
};

// Mock de fetch pour les tests
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('SecureCalculationService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('calculateAll', () => {
    it('should calculate retirement data successfully', async () => {
      // Mock d'une réponse réussie
      const mockResponse = {
        success: true,
        data: {
          netWorth: 850000,
          retirementCapital: 1200000,
          sufficiency: 85,
          monthlyIncome: 11667,
          monthlyExpenses: 5050,
          rrqOptimization: {
            totalMaintenant: 288000,
            total70: 270000,
            recommandation: 'Commencez maintenant.'
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await SecureCalculationService.calculateAll(mockUserData);

      expect(result.netWorth).toBe(850000);
      expect(result.retirementCapital).toBe(1200000);
      expect(result.sufficiency).toBe(85);
      expect(result.monthlyIncome).toBe(11667);
      expect(result.monthlyExpenses).toBe(5050);
      expect(result.rrqOptimization).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      // Mock d'une erreur API
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await SecureCalculationService.calculateAll(mockUserData);

      // Devrait retourner des calculs de fallback
      expect(result.netWorth).toBeGreaterThan(0);
      expect(result.retirementCapital).toBeGreaterThan(0);
      expect(result.sufficiency).toBe(50); // Valeur par défaut
    });

    it('should retry on network errors', async () => {
      // Premier appel échoue, deuxième réussit
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              netWorth: 850000,
              retirementCapital: 1200000,
              sufficiency: 85,
              monthlyIncome: 11667,
              monthlyExpenses: 5050,
              rrqOptimization: {}
            }
          })
        });

      const result = await SecureCalculationService.calculateAll(mockUserData);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result.netWorth).toBe(850000);
    });

    it('should handle timeout errors', async () => {
      // Mock d'un timeout
      mockFetch.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      const result = await SecureCalculationService.calculateAll(mockUserData);

      // Devrait utiliser les calculs de fallback
      expect(result.netWorth).toBeGreaterThan(0);
    });
  });

  describe('checkApiHealth', () => {
    it('should return true when API is healthy', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const isHealthy = await SecureCalculationService.checkApiHealth();

      expect(isHealthy).toBe(true);
    });

    it('should return false when API is down', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const isHealthy = await SecureCalculationService.checkApiHealth();

      expect(isHealthy).toBe(false);
    });
  });

  describe('fallback calculations', () => {
    it('should provide reasonable fallback values', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API down'));

      const result = await SecureCalculationService.calculateAll(mockUserData);

      // Vérifier que les calculs de fallback sont raisonnables
      expect(result.netWorth).toBeGreaterThan(0);
      expect(result.retirementCapital).toBeGreaterThan(result.netWorth);
      expect(result.monthlyIncome).toBe(11667); // 75000 + 65000 / 12
      expect(result.monthlyExpenses).toBe(5050); // Somme des dépenses
    });
  });

  describe('input validation', () => {
    it('should handle empty user data', async () => {
      const emptyData: UserData = {
        personal: { prenom1: '', prenom2: '', naissance1: '', naissance2: '', sexe1: 'M', sexe2: 'F', salaire1: 0, salaire2: 0, statutProfessionnel1: 'actif', statutProfessionnel2: 'actif', ageRetraiteSouhaite1: 65, ageRetraiteSouhaite2: 65, depensesRetraite: 0 },
        retirement: { rrqAgeActuel1: 0, rrqMontantActuel1: 0, rrqMontant70_1: 0, esperanceVie1: 0, rrqAgeActuel2: 0, rrqMontantActuel2: 0, rrqMontant70_2: 0, esperanceVie2: 0, rregopMembre1: 'non', rregopAnnees1: 0, pensionPrivee1: 0, pensionPrivee2: 0, svMontant1: 0, svMontant2: 0, svRevenus1: 0, svRevenus2: 0, svAgeDebut1: 65, svAgeDebut2: 65 },
        savings: { reer1: 0, reer2: 0, celi1: 0, celi2: 0, placements1: 0, placements2: 0, epargne1: 0, epargne2: 0, cri1: 0, cri2: 0, residenceValeur: 0, residenceHypotheque: 0 },
        cashflow: { logement: 0, servicesPublics: 0, assurances: 0, telecom: 0, alimentation: 0, transport: 0, sante: 0, loisirs: 0 }
      };

      mockFetch.mockRejectedValueOnce(new Error('API down'));

      const result = await SecureCalculationService.calculateAll(emptyData);

      expect(result.netWorth).toBe(0);
      expect(result.retirementCapital).toBe(0);
      expect(result.monthlyIncome).toBe(0);
      expect(result.monthlyExpenses).toBe(0);
    });
  });
});

// Tests d'intégration (optionnels)
describe('SecureCalculationService Integration', () => {
  it('should work with real API endpoint', async () => {
    // Ce test ne s'exécute que si l'API est disponible
    const isHealthy = await SecureCalculationService.checkApiHealth();
    
    if (isHealthy) {
      const result = await SecureCalculationService.calculateAll(mockUserData);
      expect(result).toBeDefined();
      expect(typeof result.netWorth).toBe('number');
    } else {
      console.log('API not available for integration test');
    }
  });
});
