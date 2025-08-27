// ===== INDEX DES SERVICES DE BASE DE BASE DE BASE DE BASE =====
// Export centralisé de tous les services de base de base de base de base

// Services de retraite
export { CalculationService } from '../features/retirement/services/CalculationService';
export { EnhancedRRQService } from '../features/retirement/services/EnhancedRRQService';
export { OASGISService } from '../features/retirement/services/OASGISService';
export { RRQService } from '../features/retirement/services/RRQService';
export { CPPService } from '../features/retirement/services/CPPService';
export { CombinedPensionService } from '../features/retirement/services/CombinedPensionService';
export { MonteCarloService } from '../features/retirement/services/MonteCarloService';
export { TaxOptimizationService } from '../features/retirement/services/TaxOptimizationService';
export { RecommendationEngine } from '../features/retirement/services/RecommendationEngine';
export { ScenarioService } from '../features/retirement/services/ScenarioService';
export { AnalyticsService } from '../features/retirement/services/AnalyticsService';
export { BackupService } from '../features/retirement/services/BackupService';
export { SecurityService } from '../features/retirement/services/SecurityService';
export { EmergencyInfoService } from '../features/retirement/services/EmergencyInfoService';
export { UltimatePlanningService } from '../features/retirement/services/UltimatePlanningService';
export { PDFReportService } from '../features/retirement/services/PDFReportService';

// Services SRG (Supplément de Revenu Garanti)
export { SRGService } from './SRGService';

// Services RREGOP (Régime de Retraite des Employés du Gouvernement et des Organismes Publics)
export { UnifiedRREGOPService } from './UnifiedRREGOPService';

// Services SRG Unifiés (Supplément de Revenu Garanti)
export { UnifiedSRGService } from './UnifiedSRGService';

// Services RREGOP Legacy (pour compatibilité temporaire)
export { RREGOPService } from './RREGOPService';

// Services Immobiliers (Optimisation Immobilière de Retraite)
export { RealEstateOptimizationService } from './RealEstateOptimizationService';

// Services de base
export { promoCodeService } from './promoCodeService';
export { stripeUpgradeService } from './stripeUpgradeService';
export { getDemoMetrics, fetchAirtableMetrics, setupAutoRefresh } from './airtableService';

// Services de sécurité
export { secureStorage } from '../lib/secureStorage';
export { securityLogger, defaultSecurityLoggerConfig } from '../lib/securityLogger';
export { securityAlerts } from '../lib/securityAlerts';
export { createRateLimiter, authRateLimiter, apiRateLimiter, formSubmissionRateLimiter, csrfProtection, handleCSRFError, addCSRFToken, securityHeaders, validateSessionToken, securityLogger as securityLoggerMiddleware, validationLogger, authSuccessLogger, authFailureLogger, netlifySecurityConfig } from '../lib/securityMiddleware';
export { validateInput, commonSchemas, createValidationErrorResponse, createSuccessResponse } from '../lib/validationMiddleware';
export { StorageMigration, initializeSecureStorage } from '../lib/storageMigration';

// Services d'utilitaires
export { sanitizeHtml, validateUrl, sanitizeUserInput, validateEmail, validatePhone, generateCSRFToken, validateCSRFToken, hashPassword, verifyPassword, detectSQLInjection, detectXSS, sanitizeData, SECURITY_CONFIG } from '../utils/securityUtils';
export { InputSanitizer } from '../utils/inputSanitizer';
