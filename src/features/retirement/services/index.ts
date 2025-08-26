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

// NOUVEAUX SERVICES GOUVERNEMENTAUX ET SÉCURITÉ
export { SRGService } from './SRGService';
export { RREGOPService } from './RREGOPService';
export { SecureDataManager } from './SecureDataManager';

// NOUVEAU SERVICE D'ONBOARDING 2025
export { OnboardingService } from './OnboardingService';

// NOUVEAU SERVICE DE RAPPORT INTELLIGENT 2025
export { IntelligentReportService } from './intelligent_report_service';

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

// Types des nouveaux services
export type {
  SRGParams2025,
  SRGCalculationResult,
  SRGStrategy,
  SRGAlert
} from './SRGService';

export type {
  RREGOPParams2025,
  RREGOPUserData,
  RREGOPCalculationResult,
  RREGOPRecommendation,
  RREGOPScenario
} from './RREGOPService';

// Types du service de rapport intelligent
export type { 
  IntelligentReport, 
  ReportMetadata, 
  ExecutiveSummary, 
  CriticalAlert, 
  PriorityAction,
  ImplementationTimeline,
  ComparativeScenario,
  PersonalizedRecommendation,
  FinancialSummary
} from './intelligent_report_service';
