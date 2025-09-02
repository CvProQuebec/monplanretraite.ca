// src/services/promoCodeService.ts
import { PromoCode, PromoCodeValidation, SubscriptionPlan } from '@/types/subscription';
import { PROMO_CODES } from '@/config/plans';

export class PromoCodeService {
  /**
   * Valider un code promo
   */
  static validatePromoCode(code: string): PromoCodeValidation {
    const promoCode = PROMO_CODES[code.toUpperCase()];
    
    if (!promoCode) {
      return {
        isValid: false,
        discount: 0,
        message: 'Code promo invalide'
      };
    }

    // Vérifier la date de validité
    const now = new Date();
    const validUntil = new Date(promoCode.validUntil);
    
    if (now > validUntil) {
      return {
        isValid: false,
        discount: 0,
        message: 'Code promo expiré'
      };
    }

    // Vérifier le nombre d'utilisations
    if (promoCode.currentUses && promoCode.currentUses >= promoCode.maxUses) {
      return {
        isValid: false,
        discount: 0,
        message: 'Code promo épuisé'
      };
    }

    return {
      isValid: true,
      discount: promoCode.discount,
      message: promoCode.description,
      code: promoCode
    };
  }

  /**
   * Appliquer un code promo à un prix
   */
  static applyPromoCode(originalPrice: number, promoCode: string): { 
    finalPrice: number; 
    discount: number; 
    savings: string;
    validation: PromoCodeValidation;
  } {
    const validation = this.validatePromoCode(promoCode);
    
    if (!validation.isValid) {
      return {
        finalPrice: originalPrice,
        discount: 0,
        savings: '0,00 $',
        validation
      };
    }

    const discount = (originalPrice * validation.discount) / 100;
    const finalPrice = originalPrice - discount;

    return {
      finalPrice: Math.round(finalPrice * 100) / 100, // Arrondir à 2 décimales
      discount: validation.discount,
      savings: `${discount.toFixed(2)} $`,
      validation
    };
  }

  /**
   * Vérifier si un code promo déverrouille des fonctionnalités
   */
  static checkFeatureUnlock(promoCode: string, feature: string): boolean {
    const validation = this.validatePromoCode(promoCode);
    
    if (!validation.isValid || !validation.code) {
      return false;
    }

    // Codes 100 % gratuits déverrouillent tout
    if (validation.code.unlimitedFeatures) {
      return true;
    }

    // Codes de test déverrouillent tout
    if (validation.code.testMode) {
      return true;
    }

    return false;
  }

  /**
   * Obtenir le plan effectif avec un code promo
   */
  static getEffectivePlan(currentPlan: SubscriptionPlan, promoCode: string): SubscriptionPlan {
    const validation = this.validatePromoCode(promoCode);
    
    if (!validation.isValid || !validation.code) {
      return currentPlan;
    }

    // Codes 100 % gratuits donnent accès Expert
    if (validation.code.unlimitedFeatures) {
      return 'expert';
    }

    // Codes de test donnent accès Expert
    if (validation.code.testMode) {
      return 'expert';
    }

    return currentPlan;
  }

  /**
   * Vérifier si un code promo est pour les tests
   */
  static isTestCode(promoCode: string): boolean {
    const validation = this.validatePromoCode(promoCode);
    return validation.isValid && validation.code?.testMode === true;
  }

  /**
   * Obtenir tous les codes promo valides
   */
  static getValidPromoCodes(): PromoCode[] {
    const now = new Date();
    return Object.values(PROMO_CODES).filter(code => {
      const validUntil = new Date(code.validUntil);
      return now <= validUntil && (!code.currentUses || code.currentUses < code.maxUses);
    });
  }
}

// Instance singleton
export const promoCodeService = new PromoCodeService();
