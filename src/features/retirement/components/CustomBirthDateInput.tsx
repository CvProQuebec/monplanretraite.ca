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
      
              // Si 4 chiffres sont entrés, passer au mois (seulement si pas de Tab)
        if (newYear.length === 4 && document.activeElement === yearRef.current) {
          // Délai pour éviter les conflits avec Tab
          setTimeout(() => {
            monthRef.current?.focus();
            monthRef.current?.select();
          }, 50);
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
        
        // Si 2 chiffres sont entrés, passer au jour (seulement si pas de Tab)
        if (newMonth.length === 2 && document.activeElement === monthRef.current) {
          // Délai pour éviter les conflits avec Tab
          setTimeout(() => {
            dayRef.current?.focus();
            dayRef.current?.select();
          }, 50);
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
        // Utiliser la valeur actuelle du champ pour construire la nouvelle valeur
        const currentYear = yearRef.current?.value || '';
        const currentMonth = monthRef.current?.value || '';
        const newValue = currentYear + currentMonth + newDay;
        onChange(newValue);
      }
    }
  };

  // Gestion des événements Tab pour une navigation plus fluide
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextRef: React.RefObject<HTMLInputElement>) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      // Délai pour éviter les conflits avec onChange
      setTimeout(() => {
        nextRef.current?.focus();
        nextRef.current?.select();
      }, 10);
    }
  };

  // Prévention des conflits entre auto-focus et Tab
  const shouldAutoFocus = (currentValue: string, maxLength: number) => {
    return currentValue.length === maxLength && document.activeElement === e.target;
  };

  return (
    <div className={`space-y-3 ${className}`}>
             <Label htmlFor={id} className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
         <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
         </svg>
         {label}
         <span className="text-sm text-gray-500 font-normal ml-2">
           (Format: AAAA-MM-JJ)
         </span>
       </Label>
             <div className="relative">
         <div className="flex gap-2 items-center">
           {/* Indicateur de validation globale */}
           {year.length === 4 && month.length === 2 && day.length === 2 && (
             <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse z-10">
               <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
             </div>
           )}
                 <Input
           ref={yearRef}
           type="text"
           placeholder="AAAA"
           value={year}
           onChange={handleYearChange}
           onKeyDown={(e) => handleKeyDown(e, monthRef)}
           maxLength={4}
           className={`w-20 text-center text-lg p-4 h-14 border-2 transition-colors ${
             year.length === 4 
               ? 'border-green-500 bg-green-100 text-green-900 font-bold shadow-lg' 
               : 'border-gray-300 bg-white text-gray-900 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
           }`}
         />
         <span className="flex items-center text-gray-500 text-lg font-bold">-</span>
         <Input
           ref={monthRef}
           type="text"
           placeholder="MM"
           value={month}
           onChange={handleMonthChange}
           onKeyDown={(e) => handleKeyDown(e, dayRef)}
           maxLength={2}
           className={`w-16 text-center text-lg p-4 h-14 border-2 transition-colors ${
             month.length === 2 
               ? 'border-green-500 bg-green-100 text-green-900 font-bold shadow-lg' 
               : 'border-gray-300 bg-white text-gray-900 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
           }`}
         />
         <span className="flex items-center text-gray-500 text-lg font-bold">-</span>
         <Input
           ref={dayRef}
           type="text"
           placeholder="JJ"
           value={day}
           onChange={handleDayChange}
           maxLength={2}
           className={`w-16 text-center text-lg p-4 h-14 border-2 transition-colors ${
             day.length === 2 
               ? 'border-green-500 bg-green-100 text-green-900 font-bold shadow-lg' 
               : 'border-gray-300 bg-white text-gray-900 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
           }`}
                  />
         </div>
       </div>
     </div>
   );
 };
