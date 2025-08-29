// ===== INDEX DES HOOKS DE BASE DE BASE DE BASE DE BASE DE BASE =====
// Export centralisé de tous les hooks de base de base de base de base de base

// Hooks d'authentification et de sécurité
export { useAuth, AuthProvider } from './useAuth';
export { useSecureStorage, useSecureFormStorage, useSecureConfig } from './useSecureStorage';

// Hooks de formulaire et de contact
export { useContactForm } from './use-contact-form';
export { useFormScoring } from './useFormScoring';

// Hooks de métriques et d'analytics
export { useMetrics } from './useMetrics';
export { useAnimatedMetrics } from './useAnimatedMetrics';
export { useAirtableConfig } from './useAirtableConfig';

// Hooks de navigation et de mise en page
export { useIsMobile } from './use-mobile';
export { useAdaptiveLayout } from './features/retirement/hooks/useAdaptiveLayout';
export { useDynamicTheme } from './features/retirement/hooks/useDynamicTheme';

// Hooks de retraite et de langue
export { useLanguage } from './useLanguage';
export { LanguageProvider, useCurrentLanguage, useLanguageSwitcher } from './features/retirement/hooks/useLanguage';
export { useRetirementData } from './features/retirement/hooks/useRetirementData';

// Hooks de souscription et de promotion
export { useSubscriptionLimits } from './useSubscriptionLimits';
export { usePromoCode } from './usePromoCode';

// Hooks de notification
export { useToast, useToaster } from './use-toast';

// Hooks de sécurité et de validation
export { useErrorHandler } from './features/retirement/components/ErrorBoundary';
