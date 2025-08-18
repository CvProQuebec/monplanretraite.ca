import React from 'react';
import Header from '@/components/layout/header';
import { RetirementNavigation } from '@/features/retirement';

const RetraiteModulePhase1Fr: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      {/* Navigation Phase 1 Intégrée */}
      <div className="pt-24">
        <RetirementNavigation />
      </div>
    </div>
  );
};

export default RetraiteModulePhase1Fr;
