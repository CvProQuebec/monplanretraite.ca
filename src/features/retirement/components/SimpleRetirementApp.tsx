// src/features/retirement/components/SimpleRetirementApp.tsx
import React, { useState } from 'react';
import { useRetirementData } from '../hooks/useRetirementData';
import { LanguageProvider } from '../hooks/useLanguage';
import { NavigationBar } from '../sections/NavigationBar';
import { HeroSection } from '../sections/HeroSection';
import { PersonalDataSection } from '../sections/PersonalDataSection';
import DashboardSection from '../sections/DashboardSection';
import { TaxOptimizationSection } from '../sections/TaxOptimizationSection';

export const SimpleRetirementApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { userData, updateUserData, calculations, isLoading, error } = useRetirementData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Erreur: {error}</div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalDataSection data={userData} onUpdate={updateUserData} />;
      case 'tax':
        return <TaxOptimizationSection data={userData} calculations={calculations} />;
      case 'dashboard':
      default:
        return <DashboardSection data={userData} calculations={calculations} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-charcoal-700">
        <div className="pt-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <HeroSection />
          <div className="container mx-auto px-4 py-8">
            <NavigationBar 
              activeSection={activeSection} 
              onSectionChange={setActiveSection}
            />
            <div className="mt-8">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
};