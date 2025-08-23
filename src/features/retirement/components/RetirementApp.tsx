// src/features/retirement/components/RetirementApp.tsx
import React, { useState } from 'react';
import { useRetirementData } from '../hooks/useRetirementData';
import { LanguageProvider } from '../hooks/useLanguage';

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
import { RealEstateSection } from '../sections/RealEstateSection';
import { RRQSection } from '../sections/RRQSection';
import { MonteCarloSection } from '../sections/MonteCarloSection';
import { SuccessionSection } from '../sections/SuccessionSection';
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
      case 'real-estate': return 'afternoon';
      case 'cashflow': return 'evening';
      case 'cpp': return 'afternoon';
      case 'rrq': return 'morning';
      case 'cpp-rrq': return 'premium';
      case 'combined-pension': return 'premium';
      case 'monte-carlo': return 'premium';
      case 'optimization': return 'night';
      case 'succession': return 'creative';
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
    console.log('🔍 RetirementApp - Section active:', activeSection);
    console.log('🔍 RetirementApp - Type de section:', typeof activeSection);
    
    switch (activeSection) {
      case 'personal':
        console.log('🔍 Rendu: PersonalDataSection');
        return <PersonalDataSection data={userData} onUpdate={updateUserData} />;
      case 'retirement':
        console.log('🔍 Rendu: RetirementSection');
        return <RetirementSection data={userData} onUpdate={updateUserData} />;
      case 'savings':
        console.log('🔍 Rendu: SavingsSection');
        return <SavingsSection data={userData} onUpdate={updateUserData} />;
      case 'real-estate':
        console.log('🔍 Rendu: RealEstateSection');
        return <RealEstateSection data={userData} onUpdate={updateUserData} />;
      case 'emergency-info':
        console.log('🔍 Rendu: EmergencyInfoSection');
        return <EmergencyInfoSection />;
      case 'cashflow':
        console.log('🔍 Rendu: CashflowSection');
        return <CashflowSection data={userData} onUpdate={updateUserData} />;
      case 'cpp':
        console.log('🔍 Rendu: CPPSection');
        return <CPPSection />;
      case 'rrq':
        console.log('🔍 Rendu: RRQSection');
        return <RRQSection data={userData} onUpdate={updateUserData} />;
      case 'cpp-rrq':
        console.log('🔍 Rendu: CombinedPensionSection (cpp-rrq)');
        return <CombinedPensionSection />;
      case 'combined-pension':
        console.log('🔍 Rendu: CombinedPensionSection');
        return <CombinedPensionSection />;
      case 'monte-carlo':
        console.log('🔍 Rendu: MonteCarloSection');
        return <MonteCarloSection data={userData} onUpdate={updateUserData} />;
      case 'optimization':
        console.log('🔍 Rendu: TaxOptimizationSection (optimization)');
        return <TaxOptimizationSection data={userData} calculations={calculations} />;
      case 'succession':
        console.log('🔍 Rendu: SuccessionSection');
        return <SuccessionSection data={userData} onUpdate={updateUserData} />;
      case 'premium-features':
        console.log('🔍 Rendu: PremiumFeaturesSection');
        return <PremiumFeaturesSection />;
      case 'advanced-expenses':
        console.log('🔍 Rendu: AdvancedExpensesSection');
        return <AdvancedExpensesSection data={userData} onUpdate={updateUserData} />;
      case 'tax':
        console.log('🔍 Rendu: TaxOptimizationSection');
        return <TaxOptimizationSection data={userData} calculations={calculations} />;
      case 'simulator':
        console.log('🔍 Rendu: SimulatorSection');
        return <SimulatorSection data={userData} calculations={calculations} />;
      case 'reports':
        console.log('🔍 Rendu: ReportsSection');
        return <ReportsSection data={userData} calculations={calculations} />;
      case 'session':
        console.log('🔍 Rendu: BackupSecuritySection');
        return <BackupSecuritySection data={userData} onDataLoad={onDataLoad} />;
      case 'dashboard':
      default:
        console.log('🔍 Rendu: DashboardSection (par défaut)');
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
