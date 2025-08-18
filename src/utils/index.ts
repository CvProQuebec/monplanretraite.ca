// ===== INDEX DES UTILITAIRES DE BASE DE BASE DE BASE DE BASE DE BASE DE BASE DE BASE =====
// Export centralisé de tous les utilitaires de base de base de base de base de base de base de base

// Utilitaires de base
export { cn } from '../lib/utils';
export { formatPhoneForDisplay, formatTextWithLineBreaks, enhanceContentLayout } from './formatters';
export { Image, getImageUrl } from './imageHandler';
export { sanitizeHtml, validateUrl, sanitizeUserInput, validateEmail, validatePhone, generateCSRFToken, validateCSRFToken, hashPassword, verifyPassword, detectSQLInjection, detectXSS, sanitizeData, SECURITY_CONFIG } from './securityUtils';

// Utilitaires de retraite
export { formatCurrency, formatPercentage, formatNumber, formatDate, formatAge, formatDuration, formatMonthlyAmount, formatAnnualAmount, formatChartValue } from '../features/retirement/utils/formatters';

// Utilitaires de sécurité
export { InputSanitizer } from './inputSanitizer';
