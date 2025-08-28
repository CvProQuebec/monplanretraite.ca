// src/services/stripeUpgradeService.ts
import { SubscriptionPlan } from '@/types/subscription';
import { getUpgradePriceWithTimeAdjustment } from '@/config/plans';

// Types pour Stripe
interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
}

interface StripeSubscription {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  items: Array<{
    id: string;
    price: {
      id: string;
      product: string;
    };
  }>;
}

interface UpgradeResult {
  success: boolean;
  newSubscriptionId?: string;
  error?: string;
  message?: string;
}

// Configuration Stripe (à remplacer par vos vraies clés)
const STRIPE_CONFIG = {
  publishableKey: (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY,
  secretKey: (import.meta as any).env?.VITE_STRIPE_SECRET_KEY, // Utilisé côté serveur uniquement
  webhookSecret: (import.meta as any).env?.VITE_STRIPE_WEBHOOK_SECRET
};

// Plan IDs Stripe (à remplacer par vos vrais IDs)
const STRIPE_PLAN_IDS = {
  professional: 'price_professional_annual', // À remplacer
  expert: 'price_expert_annual', // À remplacer
  upgrade_pro_to_expert: 'price_upgrade_pro_to_expert' // À remplacer
};

export class StripeUpgradeService {
  private stripe: any;

  constructor() {
    // Initialisation de Stripe côté client
    this.initializeStripe();
  }

  private initializeStripe() {
    if (typeof window !== 'undefined' && (window as any).Stripe) {
      try {
        this.stripe = (window as any).Stripe(STRIPE_CONFIG.publishableKey);
      } catch (error) {
        console.warn('Stripe initialization failed:', error);
        this.stripe = null;
      }
    }
  }

  private ensureStripeInitialized() {
    if (!this.stripe) {
      this.initializeStripe();
    }
    return this.stripe;
  }

  /**
   * Calculer le prix d'upgrade intelligent
   */
  calculateUpgradePrice(
    fromPlan: SubscriptionPlan,
    toPlan: SubscriptionPlan,
    subscriptionStartDate: Date
  ) {
    return getUpgradePriceWithTimeAdjustment(fromPlan, toPlan, subscriptionStartDate);
  }

  /**
   * Vérifier si l'upgrade est possible
   */
  canUpgrade(fromPlan: SubscriptionPlan, toPlan: SubscriptionPlan): boolean {
    if (fromPlan === 'free' && toPlan === 'professional') return true;
    if (fromPlan === 'free' && toPlan === 'expert') return true;
    if (fromPlan === 'professional' && toPlan === 'expert') return true;
    return false;
  }

  /**
   * Obtenir le plan Stripe requis
   */
  getStripePlanId(plan: SubscriptionPlan): string {
    switch (plan) {
      case 'professional':
        return STRIPE_PLAN_IDS.professional;
      case 'expert':
        return STRIPE_PLAN_IDS.expert;
      default:
        throw new Error(`Plan non supporté: ${plan}`);
    }
  }

  /**
   * Créer une session de paiement pour l'upgrade
   */
  async createUpgradeCheckoutSession(
    fromPlan: SubscriptionPlan,
    toPlan: SubscriptionPlan,
    customerId: string,
    subscriptionStartDate: Date,
    currentSubscriptionId?: string
  ): Promise<{ sessionId: string; url: string }> {
    try {
      // 1. Calculer le prix d'upgrade
      const upgradePrice = this.calculateUpgradePrice(fromPlan, toPlan, subscriptionStartDate);
      
      // 2. Créer la session de paiement
      const response = await fetch('/api/stripe/create-upgrade-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromPlan,
          toPlan,
          customerId,
          upgradePrice: upgradePrice.price,
          monthsRemaining: upgradePrice.monthsRemaining,
          totalPaid: upgradePrice.totalPaid,
          currentSubscriptionId,
          metadata: {
            upgradeType: 'time_adjusted',
            fromPlan,
            toPlan,
            monthsRemaining: upgradePrice.monthsRemaining.toString()
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement');
      }

      const { sessionId, url } = await response.json();
      return { sessionId, url };
    } catch (error) {
      console.error('Erreur création session upgrade:', error);
      throw new Error('Impossible de créer la session de paiement');
    }
  }

  /**
   * Traiter l'upgrade après paiement réussi
   */
  async processUpgradeAfterPayment(
    sessionId: string,
    currentSubscriptionId?: string
  ): Promise<UpgradeResult> {
    try {
      // 1. Récupérer les détails de la session
      const response = await fetch(`/api/stripe/retrieve-session?sessionId=${sessionId}`);
      if (!response.ok) {
        throw new Error('Impossible de récupérer la session de paiement');
      }

      const session = await response.json();
      
      // 2. Traiter l'upgrade côté serveur
      const upgradeResponse = await fetch('/api/stripe/process-upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          currentSubscriptionId,
          customerId: session.customer,
          newPlan: session.metadata.toPlan
        }),
      });

      if (!upgradeResponse.ok) {
        throw new Error('Erreur lors du traitement de l\'upgrade');
      }

      const result = await upgradeResponse.json();
      
      return {
        success: true,
        newSubscriptionId: result.newSubscriptionId,
        message: 'Upgrade réussi !'
      };
    } catch (error) {
      console.error('Erreur traitement upgrade:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Rediriger vers Stripe Checkout
   */
  async redirectToCheckout(sessionId: string): Promise<void> {
    if (!this.stripe) {
      throw new Error('Stripe non initialisé');
    }

    const { error } = await this.stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw new Error(`Erreur redirection Stripe: ${error.message}`);
    }
  }

  /**
   * Vérifier le statut du paiement
   */
  async checkPaymentStatus(sessionId: string): Promise<'pending' | 'complete' | 'failed'> {
    try {
      const response = await fetch(`/api/stripe/check-payment-status?sessionId=${sessionId}`);
      if (!response.ok) {
        throw new Error('Impossible de vérifier le statut du paiement');
      }

      const { status } = await response.json();
      return status;
    } catch (error) {
      console.error('Erreur vérification statut:', error);
      return 'failed';
    }
  }

  /**
   * Annuler l'upgrade en cours
   */
  async cancelUpgrade(sessionId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/stripe/cancel-upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur annulation upgrade:', error);
      return false;
    }
  }
}

// Instance singleton
export const stripeUpgradeService = new StripeUpgradeService();
