import React from 'react';
import { RetirementNavigation } from '@/features/retirement';

const RetraiteModulePhase1En: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Integrated Phase 1 Navigation */}
      <RetirementNavigation />
    </div>
  );
};

export default RetraiteModulePhase1En;
