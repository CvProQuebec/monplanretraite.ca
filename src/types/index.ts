// ===== INDEX DES TYPES DE BASE DE BASE DE BASE =====
// Export centralisé de tous les types de base de base de base

// Types d'agent et de souscription
export type { Agent } from './agent';
export type { 
  SubscriptionPlan, 
  PlanFeatures, 
  PlanLimits, 
  FeatureCheck, 
  UpgradeModalProps, 
  UpgradePath, 
  UserSubscription, 
  UpgradeOptions, 
  PromoCode, 
  PromoCodeValidation 
} from './subscription';

// Types SRG (Supplément de Revenu Garanti)
export type {
  SRGEligibilityData,
  SRGCalculationResult,
  SRGOptimization,
  SRGScenario,
  CombinedSRGAnalysis,
  PersonalDataSRGExtension,
  RetirementDataSRGExtension,
  CalculationsWithSRG,
  SRGCalculations,
  SRGPersonResult,
  SRGCombinedResult,
  SRGOptimizationResult,
  SRGScenarioResult,
  SRGAnalysisSectionProps,
  SRGFormData,
  SRGTestData,
  SRGValidationResult
} from './srg';

// Types RREGOP (Régime de Retraite des Employés du Gouvernement et des Organismes Publics)
export type {
  RREGOPData,
  RREGOPCalculationResult,
  RREGOPContributionYear,
  RREGOPAnalysis,
  RREGOPOptimization,
  RREGOPScenario,
  RREGOPFormData,
  RREGOPTestData,
  RREGOPValidationResult,
  RREGOPAnalysisSectionProps
} from './rregop';

// Types Immobiliers (Optimisation Immobilière de Retraite)
export type {
  RealEstateProperty,
  RREGOPContext,
  PropertyAnalysis,
  SaleScenario,
  ReinvestmentStrategy,
  ScenarioComparison,
  ExecutionPlan,
  ExecutionStep,
  Contact,
  Document,
  RealEstateResults,
  RealEstateFormData,
  RealEstateTestData,
  RealEstateValidationResult,
  RealEstateAnalysisSectionProps
} from './real-estate';

// Types de retraite
export type { EmergencyInfo } from '../features/retirement/types/emergency-info';
export type { CPPData, CPPCalculationResult, CPPContributionYear, RRQAnalysis } from '../features/retirement/types/cpp';
export type { CombinedPensionData, CombinedCalculationResult } from '../features/retirement/types/combined-pension';
export type { AdvancedRRQAnalysis, InflationImpactAnalysis, SensitivityAnalysis, AlternativeScenario, PersonalizedRecommendation, RRQRiskAnalysis } from '../features/retirement/types/advanced-cpp';
export type { UltimatePlanningData, SharedAccess, WorkflowStep, NotificationSetting, SecuritySettings, AssetProtectionStrategy, TaxOptimizationStrategy, InsurancePlanningStrategy, FinancialSimulation, SimulationParameters, PreparationReport } from '../features/retirement/types/ultimate-planning';

// Types de configuration
export type { AirtableConfig } from '../hooks/useAirtableConfig';
export type { FormData } from '../hooks/useFormScoring';
export type { SubscriptionLimits } from '../hooks/useSubscriptionLimits';

// Types de sécurité
export type { SecureStorageConfig, EncryptedData } from '../lib/secureStorage';
export type { SecurityAlert, AlertConfig } from '../lib/securityAlerts';
export type { SecurityEvent, SecurityLoggerConfig } from '../lib/securityLogger';
export type { MigrationConfig } from '../lib/storageMigration';
export type { ValidationSchema, ValidationError } from '../lib/validationMiddleware';

// Types de services
export type { AirtableMetrics } from '../services/airtableService';

// Types d'utilitaires
export type { ClassValue } from '../lib/utils';
