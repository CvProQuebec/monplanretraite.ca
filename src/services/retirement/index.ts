/**
 * Barrel des services "retirement" (spécialisés) — non intrusif.
 * Objectif: clarifier les frontières de couches sans déplacer de fichiers ni modifier le comportement.
 * IMPORTANT: utilisation de ré-exportations NAMESPACE pour éviter les collisions de noms.
 *
 * Usage:
 *  import { Tax, SRG, RREGOP } from '@/services/retirement';
 *  Tax.TaxEngine..., SRG.SRGService..., RREGOP.RREGOPService...
 */

// Prestations & calculs gouvernementaux (namespaced)
export * as SRG from '../SRGService';
export * as SRGCalc from '../SRGCalculationService';
export * as UnifiedSRG from '../UnifiedSRGService';
export * as RREGOP from '../RREGOPService';
export * as RREGOPCalc from '../RREGOPCalculationService';
export * as UnifiedRREGOP from '../UnifiedRREGOPService';
export * as CCQ from '../CCQService';

// Optimisation fiscale / robustesse / PDF (namespaced)
export * as Tax from '../TaxOptimizationService';
export * as TaxPolicy from '../tax/TaxPolicy2025';
export * as TaxEngine from '../tax/TaxEngine';
export * as TaxProjection from '../tax/ProjectionEngine';
export * as TaxRobustness from '../tax/RobustnessService';
export * as TaxPDF from '../tax/TaxOptimizationPDFService';
export * as DPBeam from '../tax/optimizers/DPBeamOptimizer';
export * as GreedyBaseline from '../tax/optimizers/GreedyBaselineOptimizer';

// Stratégies retraite / comparaisons / wizard pro (namespaced)
export * as FourPercent from '../FourPercentRuleService';
export * as Portfolio from '../PortfolioOptimizationService';
export * as StressTest from '../StressTestService';
export * as Predictive from '../PredictiveAnalyticsService';
export * as ProReports from '../ProfessionalReportGenerator';
export * as MasterWizard from '../FinancialMasterWizard';
export * as Wizard from '../WizardService';
export * as WizardValidation from '../WizardValidation';

// Analytique & comparaisons spécifiques retraite (namespaced)
export * as PerfCalc from '../PerformanceCalculationService';
export * as Comparison from '../ComparisonAnalytics';
