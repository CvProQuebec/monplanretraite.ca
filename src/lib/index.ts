// ===== INDEX DES LIBRAIRIES DE BASE DE BASE DE BASE =====
// Export centralisé de toutes les librairies de base de base de base

// Utilitaires de base
export { cn, type ClassValue } from './utils';

// Stockage sécurisé
export { secureStorage, type SecureStorageConfig, type EncryptedData } from './secureStorage';

// Sécurité et validation
export { securityLogger, defaultSecurityLoggerConfig, type SecurityEvent, type SecurityLoggerConfig } from './securityLogger';
export { securityAlerts, type SecurityAlert, type AlertConfig } from './securityAlerts';
export { createRateLimiter, authRateLimiter, apiRateLimiter, formSubmissionRateLimiter, csrfProtection, handleCSRFError, addCSRFToken, securityHeaders, validateSessionToken, securityLogger as securityLoggerMiddleware, validationLogger, authSuccessLogger, authFailureLogger, netlifySecurityConfig } from './securityMiddleware';
export { validateInput, commonSchemas, createValidationErrorResponse, createSuccessResponse, type ValidationSchema, type ValidationError } from './validationMiddleware';

// Migration et initialisation
export { StorageMigration, initializeSecureStorage, type MigrationConfig } from './storageMigration';

// Firebase
export { auth, db, googleProvider } from './firebase';

// Tests
export { testSecureStorage, testPerformance, testSecurity, runAllTests } from './secureStorage.test';
