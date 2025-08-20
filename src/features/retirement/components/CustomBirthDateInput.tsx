import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomBirthDateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const CustomBirthDateInput: React.FC<CustomBirthDateInputProps> = ({
  id,
  label,
  value,
  onChange,
  className = ""
}) => {
  // État local pour gérer l'affichage
  const [displayValue, setDisplayValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Formater la valeur pour l'affichage (19870908 -> 1987-09-08)
  const formatDisplayValue = (rawValue: string): string => {
    if (!rawValue || rawValue.length !== 8) return '';
    
    const year = rawValue.substring(0, 4);
    const month = rawValue.substring(4, 6);
    const day = rawValue.substring(6, 8);
    
    return `${year}-${month}-${day}`;
  };

  // Convertir la valeur d'affichage en format brut (1987-09-08 -> 19870908)
  const parseDisplayValue = (displayValue: string): string => {
    return displayValue.replace(/-/g, '');
  };

  // Initialiser l'affichage
  useEffect(() => {
    if (value && value.length === 8) {
      setDisplayValue(formatDisplayValue(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  // Gérer le changement de valeur
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Permettre la saisie de chiffres et de tirets
    const cleanValue = inputValue.replace(/[^\d-]/g, '');
    
    // Si l'utilisateur tape une date complète sans tirets (ex: 19870908)
    if (cleanValue.length === 8 && !cleanValue.includes('-')) {
      const formattedValue = formatDisplayValue(cleanValue);
      setDisplayValue(formattedValue);
      onChange(cleanValue); // Sauvegarder en format brut
      setIsEditing(false);
      return;
    }
    
    // Si l'utilisateur tape avec des tirets (ex: 1987-09-08)
    if (cleanValue.length <= 10) {
      setDisplayValue(cleanValue);
      
      // Si la date est complète, la valider et la sauvegarder
      if (cleanValue.length === 10 && cleanValue.includes('-')) {
        const rawValue = parseDisplayValue(cleanValue);
        if (rawValue.length === 8) {
          onChange(rawValue);
          setIsEditing(false);
        }
      }
    }
  };

  // Gérer la validation et la sauvegarde lors de la perte de focus
  const handleBlur = () => {
    setIsEditing(false);
    
    // Valider et formater la date
    if (displayValue.length === 10 && displayValue.includes('-')) {
      const rawValue = parseDisplayValue(displayValue);
      if (rawValue.length === 8) {
        onChange(rawValue);
        setDisplayValue(formatDisplayValue(rawValue));
      }
    } else if (displayValue.length === 8 && !displayValue.includes('-')) {
      // Si l'utilisateur a tapé 19870908, le formater
      const formattedValue = formatDisplayValue(displayValue);
      setDisplayValue(formattedValue);
      onChange(displayValue);
    }
  };

  // Gérer l'édition
  const handleFocus = () => {
    setIsEditing(true);
  };

  // Validation de la date
  const isValidDate = (): boolean => {
    if (!displayValue || displayValue.length !== 10) return false;
    
    const rawValue = parseDisplayValue(displayValue);
    if (rawValue.length !== 8) return false;
    
    const year = parseInt(rawValue.substring(0, 4));
    const month = parseInt(rawValue.substring(4, 6));
    const day = parseInt(rawValue.substring(6, 8));
    
    // Validation basique
    if (year < 1900 || year > new Date().getFullYear()) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // Validation des mois avec 30 jours
    if ([4, 6, 9, 11].includes(month) && day > 30) return false;
    
    // Validation de février
    if (month === 2) {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      if (isLeapYear && day > 29) return false;
      if (!isLeapYear && day > 28) return false;
    }
    
    return true;
  };

  // Obtenir la classe de validation
  const getValidationClass = (): string => {
    if (!displayValue) return 'border-gray-300 bg-white';
    if (isValidDate()) return 'border-green-500 bg-green-50 text-green-900';
    return 'border-red-500 bg-red-50 text-red-900';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor={id} className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {label}
        <span className="text-sm text-gray-500 font-normal ml-2">
          (Format: AAAA-MM-JJ ou AAAA)
        </span>
      </Label>
      
      <div className="relative">
        <Input
          id={id}
          type="text"
          placeholder="1987-09-08 ou 19870908"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full text-center text-lg p-4 h-14 border-2 transition-all duration-200 font-mono ${
            getValidationClass()
          } hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
        />
        
        {/* Indicateur de validation */}
        {displayValue && (
          <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg z-10 ${
            isValidDate() 
              ? 'bg-green-500 animate-pulse' 
              : 'bg-red-500'
          }`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={
                isValidDate() ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"
              } />
            </svg>
          </div>
        )}
        
        {/* Message d'aide */}
        {isEditing && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 shadow-lg z-20">
            <div className="font-semibold mb-1">💡 Conseils de saisie :</div>
            <div>• Tapez directement : <span className="font-mono bg-blue-100 px-1 rounded">19870908</span></div>
            <div>• Ou utilisez le format : <span className="font-mono bg-blue-100 px-1 rounded">1987-09-08</span></div>
            <div>• La date sera automatiquement formatée et validée</div>
          </div>
        )}
      </div>
      
      {/* Message de validation */}
      {displayValue && !isValidDate() && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
          ⚠️ Date invalide. Vérifiez le format et la validité de la date.
        </div>
      )}
    </div>
  );
};
