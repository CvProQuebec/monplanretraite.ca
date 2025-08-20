import React, { useRef } from 'react';
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
  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  // Séparer la valeur en composants avec validation
  const year = value?.substring(0, 4) || '';
  const month = value?.substring(4, 6) || '';
  const day = value?.substring(6, 8) || '';

  // Validation des composants
  const isValidYear = year.length === 4 && /^\d{4}$/.test(year);
  const isValidMonth = month.length === 2 && /^\d{2}$/.test(month) && parseInt(month) >= 1 && parseInt(month) <= 12;
  const isValidDay = day.length === 2 && /^\d{2}$/.test(day) && parseInt(day) >= 1 && parseInt(day) <= 31;

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = e.target.value.replace(/\D/g, ''); // Seulement les chiffres
    
    // Limiter à 4 chiffres
    if (newYear.length <= 4) {
      const newValue = newYear + month + day;
      onChange(newValue);
      
      // Si 4 chiffres sont entrés, passer au mois
      if (newYear.length === 4) {
        monthRef.current?.focus();
        monthRef.current?.select();
      }
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = e.target.value.replace(/\D/g, ''); // Seulement les chiffres
    
    // Limiter à 2 chiffres et valider (1-12)
    if (newMonth.length <= 2) {
      const monthNum = parseInt(newMonth);
      if (newMonth === '' || (monthNum >= 1 && monthNum <= 12)) {
        const newValue = year + newMonth + day;
        onChange(newValue);
        
        // Si 2 chiffres sont entrés, passer au jour
        if (newMonth.length === 2) {
          dayRef.current?.focus();
          dayRef.current?.select();
        }
      }
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDay = e.target.value.replace(/\D/g, ''); // Seulement les chiffres
    
    // Limiter à 2 chiffres et valider (1-31)
    if (newDay.length <= 2) {
      const dayNum = parseInt(newDay);
      if (newDay === '' || (dayNum >= 1 && dayNum <= 31)) {
        const newValue = year + month + newDay;
        onChange(newValue);
      }
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor={id} className="text-lg font-semibold text-charcoal-700 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {label}
      </Label>
      <div className="flex gap-2">
                 <Input
           ref={yearRef}
           type="text"
           placeholder="AAAA"
           value={year}
           onChange={handleYearChange}
           maxLength={4}
           className={`w-20 text-center text-lg p-4 h-14 border-2 transition-colors ${
             year.length === 4 ? 'border-green-500 bg-green-50' : 'border-charcoal-200 focus:border-charcoal-600'
           }`}
         />
         <span className="flex items-center text-charcoal-400 text-lg">-</span>
         <Input
           ref={monthRef}
           type="text"
           placeholder="MM"
           value={month}
           onChange={handleMonthChange}
           maxLength={2}
           className={`w-16 text-center text-lg p-4 h-14 border-2 transition-colors ${
             month.length === 2 ? 'border-green-500 bg-green-50' : 'border-charcoal-200 focus:border-charcoal-600'
           }`}
         />
         <span className="flex items-center text-charcoal-400 text-lg">-</span>
         <Input
           ref={dayRef}
           type="text"
           placeholder="JJ"
           value={day}
           onChange={handleDayChange}
           maxLength={2}
           className={`w-16 text-center text-lg p-4 h-14 border-2 transition-colors ${
             day.length === 2 ? 'border-green-500 bg-green-50' : 'border-charcoal-200 focus:border-charcoal-600'
           }`}
         />
      </div>
    </div>
  );
};
