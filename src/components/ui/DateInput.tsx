import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange, className, placeholder }) => {
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Convertir la valeur ISO (YYYY-MM-DD) en format d'affichage (YYYY-MM-DD)
  useEffect(() => {
    if (value) {
      setDisplayValue(value);
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const formatDateInput = (input: string) => {
    // Enlever tous les caractères non-numériques
    const numbers = input.replace(/\D/g, '');
    
    // Limiter à 8 chiffres maximum (YYYYMMDD)
    const truncated = numbers.slice(0, 8);
    
    let formatted = '';
    
    if (truncated.length > 0) {
      // Année (4 chiffres)
      formatted = truncated.slice(0, 4);
      
      if (truncated.length > 4) {
        // Ajouter le tiret et le mois
        formatted += '-' + truncated.slice(4, 6);
        
        if (truncated.length > 6) {
          // Ajouter le tiret et le jour
          formatted += '-' + truncated.slice(6, 8);
        }
      }
    }
    
    return formatted;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    // Si l'utilisateur efface, permettre l'effacement
    if (inputValue.length < displayValue.length) {
      setDisplayValue(inputValue);
      onChange(inputValue);
      return;
    }
    
    const formatted = formatDateInput(inputValue);
    setDisplayValue(formatted);
    onChange(formatted);
    
    // Gérer le déplacement automatique du curseur
    setTimeout(() => {
      if (inputRef.current) {
        const numbers = inputValue.replace(/\D/g, '');
        
        // Si on vient de taper le 4ème chiffre de l'année
        if (numbers.length === 4 && !inputValue.includes('-')) {
          inputRef.current.setSelectionRange(5, 5); // Position après "YYYY-"
        }
        // Si on vient de taper le 2ème chiffre du mois
        else if (numbers.length === 6 && inputValue.match(/^\d{4}-\d{2}$/)) {
          inputRef.current.setSelectionRange(8, 8); // Position après "YYYY-MM-"
        }
        // Sinon, maintenir la position naturelle
        else {
          const newPosition = Math.min(formatted.length, cursorPosition + (formatted.length - displayValue.length));
          inputRef.current.setSelectionRange(newPosition, newPosition);
        }
      }
    }, 0);
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
    
    // Permettre seulement les chiffres
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const validateDate = (dateString: string): boolean => {
    if (!dateString || dateString.length !== 10) return false;
    
    // Vérifier le format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Vérifications de base
    if (year < 1900 || year > new Date().getFullYear()) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // Créer la date et vérifier qu'elle est valide
    const date = new Date(year, month - 1, day);
    
    // Vérifier que la date créée correspond aux valeurs entrées
    // (évite les dates comme 31 février qui deviennent 3 mars)
    return date.getFullYear() === year &&
           date.getMonth() === month - 1 &&
           date.getDate() === day;
  };

  const isValidDate = validateDate(displayValue);
  const showError = displayValue.length === 10 && !isValidDate;

  return (
    <div className="space-y-1">
      <Input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={`${className} ${showError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
        placeholder={placeholder || 'YYYY-MM-DD'}
        maxLength={10}
      />
      {showError && (
        <p className="text-red-400 text-sm">
          Date invalide. Format attendu: YYYY-MM-DD
        </p>
      )}
      <p className="text-gray-400 text-xs">
        Tapez 8 chiffres (ex: 19650203 → 1965-02-03)
      </p>
    </div>
  );
};

export default DateInput;
