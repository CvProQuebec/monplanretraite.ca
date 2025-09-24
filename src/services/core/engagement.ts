/**
 * Themed barrel — Core/Engagement
 * Non-breaking: re-exports existing services to enable clearer imports.
 * Usage (recommended):
 *   import { GamificationService, OnboardingService } from '@/services/core/engagement';
 */

// Engagement / Adoption / Coaching
export * from '../GamificationService';
export * from '../LearningService';
export * from '../OnboardingService';
export * from '../SeniorsNavigationService';

// Prévention et UX sécurisée
export * from '../ErrorPreventionService';
export * from '../OverdraftPreventionService';

// Promotions et mise à niveau
export * from '../promoCodeService';
export * from '../stripeUpgradeService';
