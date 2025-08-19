// src/features/retirement/components/RetirementApp.tsx
import React, { useState } from 'react';
import { useRetirementData } from '../hooks/useRetirementData';
import { LanguageProvider } from '../hooks/useLanguage';
import { NavigationBar } from '../sections/NavigationBar';
import { HeroSection } from '../sections/HeroSection';
import { PersonalDataSection } from '../sections/PersonalDataSection';
import DashboardSection from '../sections/DashboardSection';
import { TaxOptimizationSection } from '../sections/TaxOptimizationSection';
import { RetirementSection } from '../sections/RetirementSection';
import { SavingsSection } from '../sections/SavingsSection';
import { CashflowSection } from '../sections/CashflowSection';
import { AdvancedExpensesSection } from '../sections/AdvancedExpensesSection';
import { SimulatorSection } from '../sections/SimulatorSection';
import { ReportsSection } from '../sections/ReportsSection';
import { CPPSection } from '../sections/CPPSection';
import { CombinedPensionSection } from '../sections/CombinedPensionSection';
import { PremiumFeaturesSection } from '../sections/PremiumFeaturesSection';
import { EmergencyInfoSection } from '../sections/EmergencyInfoSection';
import { SessionManager } from '../components/SessionManager';
// Import de PricingSection supprimé

export const RetirementApp: React.FC<{ 
  activeSection?: string; 
  onSectionChange?: (section: string) => void;
}> = ({ activeSection: externalActiveSection, onSectionChange: externalOnSectionChange }) => {
  const [internalActiveSection, setInternalActiveSection] = useState('dashboard');
  const { userData, updateUserData, calculations, isLoading, error } = useRetirementData();

  // Utiliser la section externe si fournie, sinon utiliser l'interne
  const activeSection = externalActiveSection || internalActiveSection;
  
  const handleSectionChange = (newSection: string) => {
    if (externalOnSectionChange) {
      externalOnSectionChange(newSection);
    } else {
      setInternalActiveSection(newSection);
    }
  };

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
      case 'retirement':
        return <RetirementSection data={userData} onUpdate={updateUserData} />;
      case 'savings':
        return <SavingsSection data={userData} onUpdate={updateUserData} />;
      case 'emergency-info':
        return <EmergencyInfoSection />;
      case 'cashflow':
        return <CashflowSection data={userData} onUpdate={updateUserData} />;
      case 'cpp':
        return <CPPSection />;
      case 'combined-pension':
        return <CombinedPensionSection />;
      case 'premium-features':
        return <PremiumFeaturesSection />;
      case 'advanced-expenses':
        return <AdvancedExpensesSection data={userData} onUpdate={updateUserData} />;
      case 'tax':
        return <TaxOptimizationSection data={userData} calculations={calculations} />;
      case 'simulator':
        return <SimulatorSection data={userData} calculations={calculations} />;
      case 'reports':
        return <ReportsSection data={userData} calculations={calculations} />;
      case 'session':
        return <SessionManager />;
      case 'dashboard':
      default:
        return <DashboardSection data={userData} calculations={calculations} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen">
        {/* Contenu de la section active uniquement */}
        <div className="mt-8">
          {renderSection()}
        </div>
      </div>
    </LanguageProvider>
  );
};