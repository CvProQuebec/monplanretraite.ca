// ===== INDEX DES SERVICES DE RETRAITE =====
// Export centralisé de tous les services de planification de retraite

// Services existants
export { CalculationService } from './CalculationService';
export { EnhancedRRQService } from './EnhancedRRQService';
export { OASGISService } from './OASGISService';
export { EmploymentStatusService } from './EmploymentStatusService';
export { AdvancedMonteCarloService } from './AdvancedMonteCarloService';
export { SecureCalculationService } from './SecureCalculationService';
export { CoupleCalculationService } from './CoupleCalculationService';

// NOUVEAUX SERVICES 2025
export { TaxOptimizationService2025 } from './TaxParametersService2025';
export { RetirementBudgetService } from './RetirementBudgetService';

// Types et interfaces
export type {
  TaxParameters2025,
  REERCELIRecommendation,
  WithdrawalStrategy,
  WithdrawalPhase,
  FondsSolidariteAnalysis,
  FondsProjection,
  ExpenseCategory,
  MonthlyExpenses,
  AccountSeparationStrategy,
  TaxOptimizationSuggestions,
  Priority,
  EstateStrategy,
  EstateAnalysis,
  RetirementBudgetAnalysis
} from './TaxParametersService2025';
