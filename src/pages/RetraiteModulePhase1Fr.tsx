import React from 'react';
import { RetirementNavigation } from '@/features/retirement';

const RetraiteModulePhase1Fr: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Phase 1 Intégrée */}
      <RetirementNavigation />
    </div>
  );
};

export default RetraiteModulePhase1Fr;
