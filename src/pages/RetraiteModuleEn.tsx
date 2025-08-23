// src/pages/RetraiteModuleEn.tsx
import React, { useEffect, useState } from 'react';
import { RetirementApp } from '@/features/retirement';
import { Phase2Wrapper } from '../features/retirement/components/Phase2Wrapper';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
// Imports removed - no more internal navigation
import '@/styles/retirement-module.css';

const RetraiteModuleEn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth();

  useEffect(() => {
    console.log('🔍 RetraiteModuleEn - Component loaded');
  }, []);

  // Handle URL parameters for active section
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      console.log('🔍 Section detected in URL:', section);
      setActiveSection(section);
    }
  }, [searchParams]);

  const handleSectionChange = (newSection: string) => {
    setActiveSection(newSection);
    // Update URL without reloading the page
    const url = new URL(window.location.href);
    url.searchParams.set('section', newSection);
    window.history.replaceState({}, '', url.toString());
  };

  // Different themes per section for immersive experience
  const getSectionTheme = (section: string) => {
    switch (section) {
      case 'dashboard': return 'auto';
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
      case 'premium-features': return 'premium';
      case 'demos': return 'auto';
      default: return 'auto';
    }
  };

  // Function removed - no more internal access verification

  // Old tabs system removed - navigation handled by UniformHeader

  // Get plan name in English
  const getPlanName = (plan: string): string => {
    const planNames = {
      'free': 'Free',
      'professional': 'Professional',
      'ultimate': 'Ultimate'
    };
    return planNames[plan as keyof typeof planNames] || 'Free';
  };

  // Get plan color
  const getPlanColor = (plan: string): string => {
    const planColors = {
      'free': 'bg-gray-600',
      'professional': 'bg-blue-600',
      'ultimate': 'bg-purple-600'
    };
    return planColors[plan as keyof typeof planColors] || 'bg-gray-600';
  };

  return (
    <Phase2Wrapper 
      theme={getSectionTheme(activeSection)}
      showParticles={true} 
      showPhysics={true}
      enableThemeRotation={false}
      enableAdaptiveLayout={true}
    >

      
      {/* Active section content directly under the menu */}
      <div className="container mx-auto px-6 py-8">
        <RetirementApp 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          onDataLoad={(data) => console.log('Data loaded:', data)}
        />
      </div>
    </Phase2Wrapper>
  );
};

export default RetraiteModuleEn;
