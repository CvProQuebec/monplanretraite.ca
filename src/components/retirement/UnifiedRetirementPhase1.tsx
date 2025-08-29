import React from 'react';
import { RetirementNavigation } from '@/features/retirement';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';

interface UnifiedRetirementPhase1Props {
  className?: string;
}

const UnifiedRetirementPhase1: React.FC<UnifiedRetirementPhase1Props> = ({ 
  className = "" 
}) => {
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${className}`}>
      {/* Navigation Phase 1 - Bilingual */}
      <RetirementNavigation />
      
      {/* Optional: Add language-specific content if needed */}
      {isFrench ? (
        <div className="sr-only">Navigation Phase 1 Intégrée</div>
      ) : (
        <div className="sr-only">Integrated Phase 1 Navigation</div>
      )}
    </div>
  );
};

export default UnifiedRetirementPhase1;
