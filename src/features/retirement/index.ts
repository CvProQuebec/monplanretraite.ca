// src/features/retirement/index.ts

// ===== INDEX DES EXPORTS - MODULE RETRAITE =====
// Point d'entrée central pour tous les composants et services

// Composants principaux
export { RetirementApp } from './components/RetirementApp';
export { BackupSecurityTips } from './components/BackupSecurityTips';

// Composants Phase 1 - Navigation fluide
export { TabbedNavigation } from './components/TabbedNavigation';
export { InteractiveCard, CardGrid } from './components/InteractiveCard';
export { StepNavigation } from './components/StepNavigation';
export { MobileStepNavigation } from './components/StepNavigation';
export { NavigationDemo } from './components/NavigationDemo';
export { RetirementNavigation } from './components/RetirementNavigation';

// Composants Phase 2 - Expérience immersive
export { useDynamicTheme } from './hooks/useDynamicTheme';
export { useAdaptiveLayout } from './hooks/useAdaptiveLayout';
export { IntelligentSkeleton } from './components/IntelligentSkeleton';
export { PhysicsCard } from './components/PhysicsCard';
export { InteractiveParticles } from './components/InteractiveParticles';
export { Phase2Demo } from './components/Phase2Demo';

// Composants temporaires
export { UltimatePlanningDashboard } from './components/UltimatePlanningDashboard';

// Composants de test pour le CalculationService
export { CalculationServiceTest } from './components/CalculationServiceTest';
export { ClaudeValidationTest } from './components/ClaudeValidationTest';

// Services existants
export { RRQService } from './services/RRQService';
export { CPPService } from './services/CPPService';
export { CombinedPensionService } from './services/CombinedPensionService';
export { AdvancedCPPService } from './services/AdvancedCPPService';
export { MonteCarloService } from './services/MonteCarloService';
export { TaxOptimizationService } from './services/TaxOptimizationService';
export { RecommendationEngine } from './services/RecommendationEngine';
export { ScenarioService } from './services/ScenarioService';
export { AnalyticsService } from './services/AnalyticsService';
export { BackupService } from './services/BackupService';
export { SecurityService } from './services/SecurityService';
export { EmergencyInfoService } from './services/EmergencyInfoService';
export { UltimatePlanningService } from './services/UltimatePlanningService';
export { PDFReportService } from './services/PDFReportService';

// NOUVEAUX SERVICES 2025
export { EnhancedRRQService } from './services/EnhancedRRQService';
export type { AdvancedRRQAnalysis } from './services/EnhancedRRQService';
export { OASGISService } from './services/OASGISService';
export type { OASGISCalculation } from './services/OASGISService';

// NOUVEAU: CalculationService amélioré
export { CalculationService } from './services/CalculationService';

// Nouveaux composants d'interface
export { AdvancedRRQAnalysisComponent as AdvancedRRQAnalysis } from './components/AdvancedRRQAnalysis';
export { OASGISAnalysisComponent } from './components/OASGISAnalysis';

// Types et interfaces
export type { EmergencyInfo } from './types/emergency-info';
export type { ThemeConfig, UserContext } from './hooks/useDynamicTheme';
export type { AdaptiveLayoutConfig, ScreenContext, UserBehavior } from './hooks/useAdaptiveLayout';

// NOUVEAUX TYPES pour les calculs avancés
export type {
  UserData,
  Calculations,
  RRQOptimizationResult,
  InflationImpactAnalysis,
  SensitivityAnalysis,
  AlternativeScenario,
  PersonalizedRecommendation,
  RRQRiskAnalysis,
  CriticalFactor,
  ActionItem,
  TimelineStep,
  RiskMitigationStrategy,
  CombinedRRQStrategy,
  HouseholdImpact,
  OASGISProjection,
  RetirementRiskAnalysis,
  LongevityRisk,
  InflationRisk,
  SequenceRisk,
  LiquidityRisk,
  HealthCareRisk,
  RecommendedActions,
  RecommendedAction
} from './types';

// Hooks et utilitaires
export { useLanguage } from './hooks/useLanguage';
export { useRetirementData } from './hooks/useRetirementData';