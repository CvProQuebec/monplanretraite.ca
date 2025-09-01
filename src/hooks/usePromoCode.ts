// src/hooks/usePromoCode.ts
import { useState, useEffect } from 'react';

interface PromoCodeValidation {
  success: boolean;
  message: string;
  code?: string;
}

export const usePromoCode = () => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  // Charger le code promo sauvegardé au montage du composant
  useEffect(() => {
    const savedCode = localStorage.getItem('promo-code');
    if (savedCode) {
      setAppliedCode(savedCode);
    }
  }, []);

  const applyPromoCode = async (code: string): Promise<PromoCodeValidation> => {
    // Codes valides avec leurs propriétés
    const validCodes = ['TESTER100', 'Calvin2025', 'EARLYBIRD30', 'SAVINGS40'];
    
    if (validCodes.includes(code.toUpperCase())) {
      const upperCode = code.toUpperCase();
      setAppliedCode(upperCode);
      
      // Sauvegarder dans localStorage pour persistance
      localStorage.setItem('promo-code', upperCode);
      
      return {
        success: true,
        message: `Code promo "${upperCode}" appliqué avec succès !`,
        code: upperCode
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
    localStorage.removeItem('promo-code');
  };

  return {
    promoCode,
    setPromoCode,
    appliedCode,
    applyPromoCode,
    clearPromoCode
  };
};
