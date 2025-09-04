// src/services/ModuleTestService.ts
// Service pour tester que tous les modules se chargent correctement

export class ModuleTestService {
  /**
   * Teste que tous les modules critiques se chargent sans erreur
   */
  static async testModuleLoading(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      // Test 1: PayrollCalendarService
      console.log('🧪 Test chargement PayrollCalendarService...');
      const { PayrollCalendarService } = await import('./PayrollCalendarService');
      console.log('✅ PayrollCalendarService chargé avec succès');
      
      // Test 2: CalculationTestService
      console.log('🧪 Test chargement CalculationTestService...');
      const { CalculationTestService } = await import('./CalculationTestService');
      console.log('✅ CalculationTestService chargé avec succès');
      
      // Test 3: PayrollTestService
      console.log('🧪 Test chargement PayrollTestService...');
      const { PayrollTestService } = await import('./PayrollTestService');
      console.log('✅ PayrollTestService chargé avec succès');
      
      // Test 4: Test d'une fonction du PayrollCalendarService
      console.log('🧪 Test fonction PayrollCalendarService...');
      const testConfig = {
        firstPayDateOfYear: '2025-01-02',
        frequency: 'biweekly' as const
      };
      
      const validation = PayrollCalendarService.validateConfig(testConfig);
      if (!validation.isValid) {
        errors.push('PayrollCalendarService validation failed');
      } else {
        console.log('✅ PayrollCalendarService fonctionne correctement');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des modules:', error);
      errors.push(`Erreur de chargement: ${error}`);
    }
    
    return {
      success: errors.length === 0,
      errors
    };
  }
  
  /**
   * Teste spécifiquement le chargement de la page Revenus
   */
  static async testRevenusPageLoading(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🧪 Test chargement page Revenus...');
      const { default: Revenus } = await import('../pages/Revenus');
      console.log('✅ Page Revenus chargée avec succès');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la page Revenus:', error);
      return { 
        success: false, 
        error: `Erreur de chargement page Revenus: ${error}` 
      };
    }
  }
}
