// src/pages/RetraiteModuleFr.tsx
import React, { useEffect, useState } from 'react';
import { RetirementApp, IntegratedNavigationBar } from '@/features/retirement';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '@/styles/retirement-module.css';

const RetraiteModuleFr: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔍 RetraiteModuleFr - Composant chargé');
    console.log('🔍 RetraiteModuleFr - Variables Firebase dans RetraiteModuleFr:', {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '***MASKED***' : 'undefined',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '***MASKED***' : 'undefined',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '***MASKED***' : 'undefined'
    });
  }, []);

  // Gérer les paramètres d'URL pour la section active
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      console.log('🔍 Section détectée dans l\'URL:', section);
      setActiveSection(section);
    }
  }, [searchParams]);

  const handleSectionChange = (newSection: string) => {
    setActiveSection(newSection);
    // Mettre à jour l'URL sans recharger la page
    navigate(`/fr/retraite-module?section=${newSection}`, { replace: true });
  };

  return (
    <div className="min-h-screen">
      {/* Bouton de retour vers Phase 1 */}
      <div className="pt-8 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <button
            onClick={() => navigate('/fr/retraite-module-phase1')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la Navigation Phase 1
          </button>
        </div>
      </div>
      
      {/* Navigation intégrée directement sous le header */}
      <IntegratedNavigationBar 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      
      {/* Wrapper pour masquer les footers du RetirementApp */}
      <div className="retirement-module-wrapper">
        <RetirementApp activeSection={activeSection} onSectionChange={handleSectionChange} />
      </div>
    </div>
  );
};

export default RetraiteModuleFr;
