import React from 'react';
import Header from '@/components/layout/header';
import { RetirementNavigation } from '@/features/retirement';

const RetraiteModulePhase1En: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      {/* Integrated Phase 1 Navigation */}
      <div className="pt-24">
        <RetirementNavigation />
      </div>
    </div>
  );
};

export default RetraiteModulePhase1En;
