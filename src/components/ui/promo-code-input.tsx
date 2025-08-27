// src/components/ui/promo-code-input.tsx
import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { X, Check, Gift, Percent } from 'lucide-react';
import { usePromoCode } from '@/hooks/usePromoCode';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';

// Interface pour l'utilisation simple (existante)
interface SimplePromoCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  appliedCode?: string | null;
  placeholder?: string;
  className?: string;
}

// Interface pour l'utilisation avancée (modal d'upgrade)
interface AdvancedPromoCodeInputProps {
  originalPrice: number;
  onCodeApplied: (code: string, discount: number) => void;
  onCodeCleared: () => void;
  placeholder?: string;
  className?: string;
}

// Type union pour les props
type PromoCodeInputProps = SimplePromoCodeInputProps | AdvancedPromoCodeInputProps;

// Type guard pour différencier les interfaces
const isAdvancedProps = (props: PromoCodeInputProps): props is AdvancedPromoCodeInputProps => {
  return 'originalPrice' in props && 'onCodeApplied' in props;
};

export const PromoCodeInput: React.FC<PromoCodeInputProps> = (props) => {
  const [promoCode, setPromoCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  const { applyPromoCode } = usePromoCode();
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  // Textes bilingues
  const t = {
    fr: {
      placeholder: 'Entrez votre code promo...',
      havePromoCode: 'Avez-vous un code promo ?',
      enterCodeForDiscount: 'Entrez votre code pour bénéficier d\'une réduction',
      apply: 'Appliquer',
      pressEnter: 'Appuyez sur Entrée pour valider',
      invalidCode: 'Code promo invalide',
      validationError: 'Erreur lors de la validation du code',
      codeApplied: 'Code promo appliqué',
      discountApplied: 'Réduction appliquée',
      clear: 'Effacer',
      remove: 'Retirer'
    },
    en: {
      placeholder: 'Enter your promo code...',
      havePromoCode: 'Have a promo code?',
      enterCodeForDiscount: 'Enter your code to get a discount',
      apply: 'Apply',
      pressEnter: 'Press Enter to validate',
      invalidCode: 'Invalid promo code',
      validationError: 'Error validating code',
      codeApplied: 'Promo code applied',
      discountApplied: 'Discount applied',
      clear: 'Clear',
      remove: 'Remove'
    }
  };

  // Utilisation avancée (modal d'upgrade)
  if (isAdvancedProps(props)) {
    const { originalPrice, onCodeApplied, onCodeCleared, placeholder = t[isFrench ? 'fr' : 'en'].placeholder, className = "" } = props;

    const handleSubmit = async () => {
      if (!promoCode.trim()) return;
      
      setIsSubmitting(true);
      setError(null);
      
      try {
        const result = await applyPromoCode(promoCode.trim());
        
        if (result.success) {
          setAppliedCode(promoCode.trim());
          // Déterminer le pourcentage de réduction basé sur le code
          let discountPercent = 0;
          const code = promoCode.trim().toUpperCase();
          if (code === 'TESTER100') discountPercent = 100;
          else if (code === 'CALVIN2025') discountPercent = 50;
          else if (code === 'EARLYBIRD30') discountPercent = 30;
          else if (code === 'SAVINGS40') discountPercent = 40;
          
          setDiscount(discountPercent);
          onCodeApplied(promoCode.trim(), discountPercent);
        } else {
          setError(result.message || t[isFrench ? 'fr' : 'en'].invalidCode);
        }
      } catch (err) {
        setError(t[isFrench ? 'fr' : 'en'].validationError);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClear = () => {
      setPromoCode('');
      setAppliedCode(null);
      setDiscount(0);
      setError(null);
      onCodeCleared();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    const discountedPrice = originalPrice * (1 - discount / 100);

    if (appliedCode) {
      return (
        <div className={`space-y-4 ${className}`}>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center justify-center gap-2">
              <Gift className="h-5 w-5" />
              Code promo appliqué
            </h3>
          </div>
          
          <div className="flex items-center justify-center gap-2 p-4 bg-green-100 rounded-lg border border-green-200">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Code : {appliedCode}
            </span>
            <Badge className="bg-green-600 text-white">
              -{discount}%
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-green-200 ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {discount > 0 && (
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Prix original :</span>
                <span className="line-through text-gray-500">{originalPrice.toFixed(2)} $</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-600 font-medium">Réduction ({discount}%) :</span>
                <span className="text-green-600 font-medium">-{(originalPrice - discountedPrice).toFixed(2)} $</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="text-lg font-bold">Prix final :</span>
                <span className="text-lg font-bold text-green-600">
                  {discount === 100 ? 'GRATUIT' : `${discountedPrice.toFixed(2)} $`}
                </span>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleClear}
              className="text-green-700 border-green-300 hover:bg-green-50"
            >
              Changer de code
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center justify-center gap-2">
            <Percent className="h-5 w-5" />
            {t[isFrench ? 'fr' : 'en'].havePromoCode}
          </h3>
          <p className="text-sm text-purple-700">
            {t[isFrench ? 'fr' : 'en'].enterCodeForDiscount}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="pl-10 pr-4 text-center font-mono"
              disabled={isSubmitting}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!promoCode.trim() || isSubmitting}
            className="px-6 bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting ? '...' : t[isFrench ? 'fr' : 'en'].apply}
          </Button>
        </div>

        {error && (
          <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        {promoCode.trim() && !error && (
          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              {t[isFrench ? 'fr' : 'en'].pressEnter}
            </Badge>
          </div>
        )}
      </div>
    );
  }

  // Utilisation simple (existante)
  const {
    value,
    onChange,
    onSubmit,
    onClear,
    appliedCode: simpleAppliedCode,
    placeholder = "Entrez votre code promo...",
    className = ""
  } = props;

  const [isSubmittingSimple, setIsSubmittingSimple] = useState(false);

  const handleSubmitSimple = async () => {
    if (!value.trim()) return;
    
    setIsSubmittingSimple(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmittingSimple(false);
    }
  };

  const handleKeyPressSimple = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitSimple();
    }
  };

  if (simpleAppliedCode) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-center gap-2 p-3 bg-green-100 rounded-lg border border-green-200">
          <Check className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">
            Code promo appliqué : {simpleAppliedCode}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-6 w-6 p-0 hover:bg-green-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center">
          <Button
            variant="outline"
            onClick={onClear}
            className="text-green-700 border-green-300 hover:bg-green-50"
          >
            Changer de code
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPressSimple}
            placeholder={placeholder}
            className="pl-10 pr-20"
            disabled={isSubmittingSimple}
          />
        </div>
        <Button
          onClick={handleSubmitSimple}
          disabled={!value.trim() || isSubmittingSimple}
          className="px-6"
        >
          {isSubmittingSimple ? '...' : 'Appliquer'}
        </Button>
      </div>
      
      {value.trim() && (
        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            Appuyez sur Entrée pour valider
          </Badge>
        </div>
      )}
    </div>
  );
};
