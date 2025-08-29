import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  allowDecimals?: boolean;
  currency?: string;
}

const MoneyInput: React.FC<MoneyInputProps> = ({
  value,
  onChange,
  placeholder = "0",
  className,
  disabled = false,
  allowDecimals = true,
  currency = "$"
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  // Formate un nombre selon les règles françaises (123 456,78)
  const formatFrenchNumber = (num: number): string => {
    if (num === 0) return '';
    
    const parts = num.toFixed(allowDecimals ? 2 : 0).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    
    if (allowDecimals && parts[1] && parts[1] !== '00') {
      return `${integerPart},${parts[1]}`;
    }
    
    return integerPart;
  };

  // Parse une chaîne française vers un nombre
  const parseFrenchNumber = (str: string): number => {
    if (!str || str.trim() === '') return 0;
    
    // Remplacer les espaces (séparateurs de milliers) et virgules (décimales)
    const cleaned = str
      .replace(/\s/g, '') // Supprimer les espaces
      .replace(',', '.'); // Remplacer virgule par point pour parseFloat
    
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Mettre à jour l'affichage quand la valeur change de l'extérieur
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatFrenchNumber(value));
    }
  }, [value, isFocused, allowDecimals]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Permettre seulement les chiffres, espaces, virgules et points
    const validChars = /^[\d\s,.]*$/;
    if (!validChars.test(inputValue)) {
      return;
    }

    setDisplayValue(inputValue);
    
    // Convertir et notifier le changement
    const numericValue = parseFrenchNumber(inputValue);
    onChange(numericValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // En mode focus, afficher la valeur brute pour faciliter l'édition
    if (value === 0) {
      setDisplayValue('');
    } else {
      // Afficher avec la virgule française mais sans les espaces pour faciliter l'édition
      const rawValue = value.toFixed(allowDecimals ? 2 : 0).replace('.', ',');
      setDisplayValue(rawValue.endsWith(',00') ? rawValue.slice(0, -3) : rawValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // En sortie de focus, reformater avec les espaces
    setDisplayValue(formatFrenchNumber(value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permettre les touches de navigation et de suppression
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];

    if (allowedKeys.includes(e.key)) {
      return;
    }

    // Permettre Ctrl+A, Ctrl+C, Ctrl+V, etc.
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    // Permettre les chiffres
    if (/^\d$/.test(e.key)) {
      return;
    }

    // Permettre la virgule pour les décimales (seulement une)
    if (allowDecimals && e.key === ',' && !displayValue.includes(',')) {
      return;
    }

    // Permettre l'espace pour les séparateurs de milliers
    if (e.key === ' ') {
      return;
    }

    // Bloquer tout le reste
    e.preventDefault();
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        {currency}
      </span>
      <Input
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn("pl-8", className)}
      />
      {!isFocused && value > 0 && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
          {allowDecimals ? 'Format: 123 456,78' : 'Format: 123 456'}
        </div>
      )}
    </div>
  );
};

export default MoneyInput;
