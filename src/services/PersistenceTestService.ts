// src/services/PersistenceTestService.ts
// Service pour tester la persistance des données de revenus

export interface PersistenceTestResult {
  success: boolean;
  tests: {
    unifiedIncome1: boolean;
    unifiedIncome2: boolean;
    salaryFields: boolean;
    eiFields: boolean;
    pensionFields: boolean;
    dateFields: boolean;
    amountFields: boolean;
  };
  errors: string[];
}

export class PersistenceTestService {
  /**
   * Teste la persistance complète des données de revenus
   */
  static async testPersistence(): Promise<PersistenceTestResult> {
    const result: PersistenceTestResult = {
      success: true,
      tests: {
        unifiedIncome1: false,
        unifiedIncome2: false,
        salaryFields: false,
        eiFields: false,
        pensionFields: false,
        dateFields: false,
        amountFields: false
      },
      errors: []
    };

    try {
      // Créer des données de test complètes
      const testData = this.createTestData();
      
      // Sauvegarder les données
      localStorage.setItem('retirement_data', JSON.stringify(testData));
      
      // Attendre un court délai pour simuler une session
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Recharger les données
      const loadedData = JSON.parse(localStorage.getItem('retirement_data') || '{}');
      
      // Tester chaque composant
      result.tests.unifiedIncome1 = this.testUnifiedIncome(loadedData.personal?.unifiedIncome1);
      result.tests.unifiedIncome2 = this.testUnifiedIncome(loadedData.personal?.unifiedIncome2);
      result.tests.salaryFields = this.testSalaryFields(loadedData.personal?.unifiedIncome1);
      result.tests.eiFields = this.testEIFields(loadedData.personal?.unifiedIncome1);
      result.tests.pensionFields = this.testPensionFields(loadedData.personal?.unifiedIncome1);
      result.tests.dateFields = this.testDateFields(loadedData.personal?.unifiedIncome1);
      result.tests.amountFields = this.testAmountFields(loadedData.personal?.unifiedIncome1);
      
      // Vérifier si tous les tests ont réussi
      result.success = Object.values(result.tests).every(test => test === true);
      
      if (!result.success) {
        result.errors.push('Certains tests de persistance ont échoué');
      }
      
    } catch (error) {
      result.success = false;
      result.errors.push(`Erreur lors du test de persistance: ${error}`);
    }

    return result;
  }

  /**
   * Crée des données de test complètes
   */
  private static createTestData() {
    return {
      personal: {
        prenom1: 'Test Person 1',
        prenom2: 'Test Person 2',
        unifiedIncome1: [
          {
            id: 'test-salary-1',
            type: 'salaire',
            description: 'Salaire principal',
            annualAmount: 50000,
            monthlyAmount: 4166.67,
            salaryStartDate: '2025-01-01',
            salaryEndDate: '2025-12-31',
            salaryFirstPaymentDate: '2025-01-15',
            salaryFrequency: 'biweekly',
            salaryNetAmount: 1923.08,
            salaryRevisionDate: '2025-06-01',
            salaryRevisionAmount: 2000,
            salaryRevisionFrequency: 'biweekly',
            salaryRevisionDescription: 'Augmentation de salaire',
            isActive: true,
            notes: 'Test salary entry'
          },
          {
            id: 'test-ei-1',
            type: 'assurance-emploi',
            description: 'Assurance emploi',
            weeklyGross: 650,
            weeklyNet: 520,
            eiStartDate: '2025-04-06',
            eiFirstPaymentDate: '2025-04-13',
            eiPaymentFrequency: 'weekly',
            eiEligibleWeeks: 45,
            weeksUsed: 20,
            maxWeeks: 45,
            eiRevisionDate: '2025-08-01',
            eiRevisionAmount: 540,
            eiRevisionDescription: 'Révision des prestations',
            isActive: true,
            notes: 'Test EI entry'
          },
          {
            id: 'test-pension-1',
            type: 'rentes',
            description: 'Pension privée',
            pensionAmount: 1200,
            pensionFrequency: 'monthly',
            pensionStartDate: '2025-01-01',
            pensionFirstPaymentDate: '2025-01-31',
            pensionType: 'viagere',
            survivorBenefit: '50%',
            isEstatePlanning: true,
            isActive: true,
            notes: 'Test pension entry'
          }
        ],
        unifiedIncome2: [
          {
            id: 'test-salary-2',
            type: 'salaire',
            description: 'Salaire Personne 2',
            annualAmount: 45000,
            monthlyAmount: 3750,
            salaryStartDate: '2025-01-01',
            salaryEndDate: '2025-12-31',
            salaryFirstPaymentDate: '2025-01-15',
            salaryFrequency: 'monthly',
            salaryNetAmount: 3000,
            isActive: true,
            notes: 'Test salary entry 2'
          }
        ]
      },
      retirement: {
        rrqMontantActuel1: 1200,
        rrqMontantActuel2: 1100,
        svMontant1: 692.89,
        svMontant2: 692.89
      }
    };
  }

  /**
   * Teste la persistance des revenus unifiés
   */
  private static testUnifiedIncome(unifiedIncome: any[]): boolean {
    return Array.isArray(unifiedIncome) && unifiedIncome.length > 0;
  }

  /**
   * Teste la persistance des champs de salaire
   */
  private static testSalaryFields(unifiedIncome: any[]): boolean {
    if (!Array.isArray(unifiedIncome)) return false;
    
    const salaryEntry = unifiedIncome.find(entry => entry.type === 'salaire');
    if (!salaryEntry) return false;
    
    return !!(
      salaryEntry.salaryStartDate &&
      salaryEntry.salaryEndDate &&
      salaryEntry.salaryFrequency &&
      salaryEntry.salaryNetAmount &&
      salaryEntry.salaryRevisionDate &&
      salaryEntry.salaryRevisionAmount
    );
  }

  /**
   * Teste la persistance des champs d'assurance emploi
   */
  private static testEIFields(unifiedIncome: any[]): boolean {
    if (!Array.isArray(unifiedIncome)) return false;
    
    const eiEntry = unifiedIncome.find(entry => entry.type === 'assurance-emploi');
    if (!eiEntry) return false;
    
    return !!(
      eiEntry.eiStartDate &&
      eiEntry.eiEligibleWeeks &&
      eiEntry.weeklyNet &&
      eiEntry.eiRevisionDate &&
      eiEntry.eiRevisionAmount
    );
  }

  /**
   * Teste la persistance des champs de pension
   */
  private static testPensionFields(unifiedIncome: any[]): boolean {
    if (!Array.isArray(unifiedIncome)) return false;
    
    const pensionEntry = unifiedIncome.find(entry => entry.type === 'rentes');
    if (!pensionEntry) return false;
    
    return !!(
      pensionEntry.pensionAmount &&
      pensionEntry.pensionFrequency &&
      pensionEntry.pensionStartDate &&
      pensionEntry.pensionType &&
      pensionEntry.survivorBenefit
    );
  }

  /**
   * Teste la persistance des champs de dates
   */
  private static testDateFields(unifiedIncome: any[]): boolean {
    if (!Array.isArray(unifiedIncome)) return false;
    
    return unifiedIncome.every(entry => {
      const dateFields = [
        'salaryStartDate', 'salaryEndDate', 'salaryFirstPaymentDate', 'salaryRevisionDate',
        'eiStartDate', 'eiFirstPaymentDate', 'eiRevisionDate',
        'pensionStartDate', 'pensionFirstPaymentDate'
      ];
      
      return dateFields.every(field => {
        if (entry[field]) {
          const date = new Date(entry[field]);
          return !isNaN(date.getTime());
        }
        return true; // Les champs optionnels peuvent être vides
      });
    });
  }

  /**
   * Teste la persistance des champs de montants
   */
  private static testAmountFields(unifiedIncome: any[]): boolean {
    if (!Array.isArray(unifiedIncome)) return false;
    
    return unifiedIncome.every(entry => {
      const amountFields = [
        'annualAmount', 'monthlyAmount', 'weeklyAmount', 'salaryNetAmount', 'salaryRevisionAmount',
        'weeklyGross', 'weeklyNet', 'eiRevisionAmount', 'pensionAmount'
      ];
      
      return amountFields.every(field => {
        if (entry[field] !== undefined) {
          return typeof entry[field] === 'number' && !isNaN(entry[field]);
        }
        return true; // Les champs optionnels peuvent être undefined
      });
    });
  }

  /**
   * Nettoie les données de test
   */
  static cleanupTestData(): void {
    localStorage.removeItem('retirement_data');
    console.log('🧹 Données de test nettoyées');
  }
}
