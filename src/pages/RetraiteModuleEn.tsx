// src/pages/RetraiteModuleEn.tsx
import React, { useEffect, useState } from 'react';
import { RetirementApp, IntegratedNavigationBar, RetirementNavigation } from '@/features/retirement';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '@/styles/retirement-module.css';

const RetraiteModuleEn: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔍 RetraiteModuleEn - Component loaded');
    console.log('🔍 RetraiteModuleEn - Firebase variables in RetraiteModuleEn:', {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '***MASKED***' : 'undefined',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '***MASKED***' : 'undefined',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '***MASKED***' : 'undefined'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Integrated Phase 1 Navigation (replaces Header) */}
      <RetirementNavigation />
      
      {/* Back to Phase 1 button */}
      <div className="pt-8 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <button
            onClick={() => navigate('/en/retirement-module-phase1')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Phase 1 Navigation
          </button>
        </div>
      </div>
      
      {/* Integrated navigation directly under header */}
      <IntegratedNavigationBar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Wrapper to hide RetirementApp footers */}
      <div className="retirement-module-wrapper">
        <RetirementApp />
      </div>
    </div>
  );
};

export default RetraiteModuleEn;
