// src/pages/RetraiteModuleEn.tsx
import React, { useEffect, useState } from 'react';
import { RetirementApp } from '@/features/retirement';
import { Phase2Wrapper } from '../features/retirement/components/Phase2Wrapper';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, User, Calculator, TrendingUp, BarChart3, FileText, 
  AlertTriangle, Database, Lock, Crown, Zap, Settings 
} from 'lucide-react';
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

  // Function to check section access based on plan
  const hasSectionAccess = (sectionId: string): boolean => {
    if (!user) return false;
    
    const planHierarchy = { free: 0, professional: 1, ultimate: 2 };
    const currentPlan = user.plan;
    
    // Free sections
    const freeSections = ['dashboard', 'personal', 'retirement', 'savings', 'cashflow', 'cpp', 'combined-pension', 'session', 'emergency-info', 'demos'];
    if (freeSections.includes(sectionId)) return true;
    
    // Professional sections
    const professionalSections = ['advanced-expenses', 'tax', 'simulator', 'reports'];
    if (professionalSections.includes(sectionId)) {
      return planHierarchy[currentPlan] >= planHierarchy.professional;
    }
    
    // Premium sections
    const premiumSections = ['premium-features'];
    if (premiumSections.includes(sectionId)) {
      return planHierarchy[currentPlan] >= planHierarchy.ultimate;
    }
    
    return true; // Default accessible
  };

  // Navigation tabs configuration with access verification
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, requiredPlan: 'free' },
    { id: 'emergency-info', label: 'Emergency Info', icon: AlertTriangle, requiredPlan: 'free' },
    { id: 'personal', label: 'Profile', icon: User, requiredPlan: 'free' },
    { id: 'retirement', label: 'Retirement', icon: Calculator, requiredPlan: 'free' },
    { id: 'savings', label: '$ Savings', icon: TrendingUp, requiredPlan: 'free' },
    { id: 'cashflow', label: 'Cash Flow', icon: BarChart3, requiredPlan: 'free' },
    { id: 'cpp', label: 'CPP', icon: FileText, requiredPlan: 'free' },
    { id: 'combined-pension', label: 'CPP+RRQ', icon: FileText, requiredPlan: 'free' },
    { id: 'advanced-expenses', label: 'Advanced Expenses', icon: Calculator, requiredPlan: 'professional' },
    { id: 'tax', label: 'Tax Optimization', icon: Settings, requiredPlan: 'professional' },
    { id: 'simulator', label: 'Simulator', icon: Zap, requiredPlan: 'professional' },
    { id: 'session', label: 'Save/Load', icon: Database, requiredPlan: 'free' },
    { id: 'backup-security', label: 'Security Tips', icon: Lock, requiredPlan: 'free' },
    { id: 'reports', label: 'Reports', icon: FileText, requiredPlan: 'professional' },
    { id: 'premium-features', label: 'Premium', icon: Crown, requiredPlan: 'ultimate' }
  ];

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
      {/* Main navigation menu with transparent background for particles */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="container mx-auto px-6">
          {/* Navigation tabs bar */}
          <div className="flex space-x-1 overflow-x-auto py-4">
            {tabs.map((tab) => {
              const hasAccess = hasSectionAccess(tab.id);
              const isActive = activeSection === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => hasAccess && handleSectionChange(tab.id)}
                  disabled={!hasAccess}
                  className={`
                    relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                    whitespace-nowrap flex items-center gap-2 backdrop-blur-sm
                    ${!hasAccess 
                      ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                      : isActive
                        ? 'bg-blue-600/90 text-white shadow-lg transform scale-105'
                        : 'bg-white/70 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600'
                    }
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.requiredPlan !== 'free' && (
                    <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                      tab.requiredPlan === 'professional' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {tab.requiredPlan === 'professional' ? 'Pro' : 'Ultimate'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Plan indicator and progress */}
          <div className="flex items-center justify-between py-3 border-t border-gray-200/50">
            <div className={`inline-flex items-center gap-2 px-4 py-2 ${getPlanColor(user?.plan || 'free')} text-white rounded-full text-sm font-bold backdrop-blur-sm`}>
              Current Plan: {getPlanName(user?.plan || 'free')}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">Global Progress</div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200/70 rounded-full overflow-hidden backdrop-blur-sm">
                  <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">35%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
