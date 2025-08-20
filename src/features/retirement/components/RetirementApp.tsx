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
import { BackupSecuritySection } from '../sections/BackupSecuritySection';
import { Phase2Wrapper } from './Phase2Wrapper';
// Import de PricingSection supprimé

export const RetirementApp: React.FC<{ 
  activeSection?: string; 
  onSectionChange?: (section: string) => void;
  onDataLoad?: (data: any) => void;
}> = ({ activeSection: externalActiveSection, onSectionChange: externalOnSectionChange, onDataLoad }) => {
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

  // Fonction pour obtenir le thème approprié selon la section
  const getSectionTheme = (section: string) => {
    switch (section) {
      case 'dashboard': return 'auto';
      case 'personal': return 'afternoon';
      case 'retirement': return 'evening';
      case 'savings': return 'morning';
      case 'cashflow': return 'evening';
      case 'cpp': return 'afternoon';
      case 'combined-pension': return 'premium';
      case 'advanced-expenses': return 'creative';
      case 'tax': return 'night';
      case 'simulator': return 'premium';
      case 'session': return 'morning';
      case 'backup-security': return 'night';
      case 'reports': return 'evening';
      case 'emergency-info': return 'creative';
      case 'premium-features': return 'premium';
      case 'demos': return 'auto';
      default: return 'auto';
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
    const theme = getSectionTheme(activeSection);
    
    switch (activeSection) {
      case 'personal':
        return (
          <Phase2Wrapper theme={theme} showParticles={true} showPhysics={false} enableThemeRotation={false}>
            <PersonalDataSection data={userData} onUpdate={updateUserData} />
          </Phase2Wrapper>
        );
      case 'retirement':
        return (
          <Phase2Wrapper theme={theme} showParticles={true} showPhysics={true} enableThemeRotation={true}>
            <RetirementSection data={userData} onUpdate={updateUserData} />
          </Phase2Wrapper>
        );
      case 'savings':
        return (
          <Phase2Wrapper theme={theme} showParticles={true} showPhysics={true} enableThemeRotation={true}>
            <SavingsSection data={userData} onUpdate={updateUserData} />
          </Phase2Wrapper>
        );
      case 'emergency-info':
        return (
          <Phase2Wrapper theme={theme} showParticles={true} showPhysics={false} enableThemeRotation={true}>
            <EmergencyInfoSection />
          </Phase2Wrapper>
        );
      case 'cashflow':
        return (
          <Phase2Wrapper theme={theme} showParticles={true} showPhysics={true} enableAdaptiveLayout={true}>
            <CashflowSection data={userData} onUpdate={updateUserData} />
          </Phase2Wrapper>
        );
      case 'cpp':
        return (
          <Phase2Wrapper theme={theme} showParticles={true} showPhysics={true} enableThemeRotation={true}>
            <CPPSection />
          </Phase2Wrapper>
        );
      case 'combined-pension':
        return (
          <Phase2Wrapper theme={theme} showParticles={true} showPhysics={true} enableThemeRotation={true}>
            <CombinedPensionSection />
          </Phase2Wrapper>
        );
      case 'premium-features':
        return (
          <Phase2Wrapper theme={theme} showParticles={true} showPhysics={true} enableThemeRotation={true}>
            <PremiumFeaturesSection />
          </Phase2Wrapper>
        );
      case 'advanced-expenses':
        return (
          <Phase2Wrapper theme={theme} showParticles={true} showPhysics={true} enableAdaptiveLayout={true}>
            <AdvancedExpensesSection data={userData} onUpdate={updateUserData} />
          </Phase2Wrapper>
        );
      case 'tax':
        return (
          <Phase2Wrapper theme={theme} showParticles={true} showPhysics={true} enableAdaptiveLayout={true}>
            <TaxOptimizationSection data={userData} calculations={calculations} />
          </Phase2Wrapper>
        );
      case 'simulator':
        return (
          <Phase2Wrapper theme={theme} showParticles={true} showPhysics={true} enableAdaptiveLayout={true}>
            <SimulatorSection data={userData} calculations={calculations} />
          </Phase2Wrapper>
        );
      case 'reports':
        return (
          <Phase2Wrapper theme={theme} showParticles={true} showPhysics={true} enableAdaptiveLayout={true}>
            <ReportsSection data={userData} calculations={calculations} />
          </Phase2Wrapper>
        );
      case 'session':
        return (
          <Phase2Wrapper theme={theme} showParticles={true} showPhysics={false} enableThemeRotation={false}>
            <BackupSecuritySection data={userData} onDataLoad={onDataLoad} />
          </Phase2Wrapper>
        );
      case 'dashboard':
      default:
        return (
          <Phase2Wrapper theme={theme} showParticles={true} showPhysics={true} enableThemeRotation={true}>
            <DashboardSection data={userData} calculations={calculations} />
          </Phase2Wrapper>
        );
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