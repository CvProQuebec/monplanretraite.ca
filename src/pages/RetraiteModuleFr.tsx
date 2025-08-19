// src/pages/RetraiteModuleFr.tsx
import React, { useEffect, useState } from 'react';
import { RetirementApp, IntegratedNavigationBar } from '@/features/retirement';
import { useSearchParams } from 'react-router-dom';
import '@/styles/retirement-module.css';

const RetraiteModuleFr: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    console.log('🔍 RetraiteModuleFr - Composant chargé');
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
    const url = new URL(window.location.href);
    url.searchParams.set('section', newSection);
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Menu de navigation principal */}
      <IntegratedNavigationBar 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      
      {/* Contenu de la section active directement sous le menu */}
      <div className="container mx-auto px-6 py-8">
        <RetirementApp activeSection={activeSection} onSectionChange={handleSectionChange} />
      </div>
    </div>
  );
};

export default RetraiteModuleFr;
