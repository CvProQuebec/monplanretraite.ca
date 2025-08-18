// src/hooks/usePromoCode.ts
import { useState } from 'react';

interface PromoCodeValidation {
  success: boolean;
  message: string;
  code?: string;
}

export const usePromoCode = () => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const applyPromoCode = async (code: string): Promise<PromoCodeValidation> => {
    // Simulation de validation - à remplacer par votre logique réelle
    const validCodes = ['TESTER100', 'Calvin2025', 'EARLYBIRD30', 'SAVINGS40'];
    
    if (validCodes.includes(code.toUpperCase())) {
      setAppliedCode(code.toUpperCase());
      return {
        success: true,
        message: `Code promo "${code.toUpperCase()}" appliqué avec succès !`,
        code: code.toUpperCase()
      };
    } else {
      return {
        success: false,
        message: 'Code promo invalide. Veuillez vérifier et réessayer.'
      };
    }
  };

  const clearPromoCode = () => {
    setPromoCode('');
    setAppliedCode(null);
  };

  return {
    promoCode,
    setPromoCode,
    appliedCode,
    applyPromoCode,
    clearPromoCode
  };
};
