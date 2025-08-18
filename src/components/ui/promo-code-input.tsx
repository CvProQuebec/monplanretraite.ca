// src/components/ui/promo-code-input.tsx
import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { X, Check, Gift } from 'lucide-react';

interface PromoCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  appliedCode?: string | null;
  placeholder?: string;
  className?: string;
}

export const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
  value,
  onChange,
  onSubmit,
  onClear,
  appliedCode,
  placeholder = "Entrez votre code promo...",
  className = ""
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!value.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (appliedCode) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-center gap-2 p-3 bg-green-100 rounded-lg border border-green-200">
          <Check className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">
            Code promo appliqué : {appliedCode}
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
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="pl-10 pr-20"
            disabled={isSubmitting}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!value.trim() || isSubmitting}
          className="px-6"
        >
          {isSubmitting ? '...' : 'Appliquer'}
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
