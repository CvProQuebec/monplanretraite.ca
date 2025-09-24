/**
 * Barrel des services "core" (techniques/transverses) — non intrusif.
 * Objectif: clarifier les frontières de couches sans déplacer de fichiers ni modifier le comportement.
 * Usage futur (progressif): import { BackgroundBackupService } from '@/services/core'
 * Les imports existants depuis '@/services/...' restent valides (aucun changement breaking).
 */

// Persistance / Sauvegarde / Stockage
export * from '../BackgroundBackupService';
export * from '../EnhancedSaveManager';
export * from '../IndividualSaveManager';
export * from '../SecureFileOnlyStorage';
export * from '../LocalStorageTransferService';

// Notifications / Onboarding / Navigation
export * from '../NotificationSchedulerService';
export * from '../OnboardingService';
export * from '../SeniorsNavigationService';

// Budget & Liens
export * from '../BudgetComputationService';
export * from '../BudgetLinkService';

// PDF & Rapports (génériques)
export * from '../PDFEmergencyService';
export * from '../PDFExportService';
export * from '../reports/ReportExportService';
export * from '../reports/ReportMetadataService';
export * from '../reports/UnifiedReportManager';

// Optimisations transverses / Cache / Perf
export * from '../CacheService';
export * from '../SeniorsOptimizationService';
export * from '../PerformanceCalculationService';
export * from '../ComparisonAnalytics';

// Gamification, Apprentissage, Prévention
export * from '../GamificationService';
export * from '../LearningService';
export * from '../ErrorPreventionService';
export * from '../OverdraftPreventionService';

// Intégrations & Paiements
export * from '../airtableService';
export * from '../stripeUpgradeService';

// Outils & utilitaires divers
export * from '../CalculationDiagnosticService';
export * from '../CalculationDiagnosticServiceApi';
export * from '../CalculationTestService';
export * from '../ModuleTestService';
export * from '../PersistenceTestService';
export * from '../PayrollCalendarService';
export * from '../PayrollTestService';
export * from '../promoCodeService';
export * from '../CriticalDataFix';
