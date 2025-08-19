// src/pages/RetraiteModuleEn.tsx
import React, { useEffect, useState } from 'react';
import { RetirementApp } from '@/features/retirement';
import { Phase2Wrapper } from '../features/retirement/components/Phase2Wrapper';
import { useSearchParams } from 'react-router-dom';
import { 
  Home, User, Calculator, TrendingUp, BarChart3, FileText, 
  AlertTriangle, Database, Lock, Crown, Zap, Settings 
} from 'lucide-react';
import '@/styles/retirement-module.css';

const RetraiteModuleEn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('dashboard');

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
    // Update URL without reloading page
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

  // Navigation tabs configuration
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'personal', label: 'Profile', icon: User },
    { id: 'retirement', label: 'Retirement', icon: Calculator },
    { id: 'savings', label: '$ Savings', icon: TrendingUp },
    { id: 'cashflow', label: 'Cash Flow', icon: BarChart3, badge: 'Pro' },
    { id: 'cpp', label: 'CPP', icon: FileText, badge: 'Pro' },
    { id: 'combined-pension', label: 'CPP+RRQ', icon: FileText, badge: 'Pro' },
    { id: 'advanced-expenses', label: 'Advanced Expenses', icon: Calculator, badge: 'Pro' },
    { id: 'tax', label: 'Tax Optimization', icon: Settings, badge: 'Pro' },
    { id: 'simulator', label: 'Simulator', icon: Zap, badge: 'Pro' },
    { id: 'session', label: 'Save/Load', icon: Database },
    { id: 'backup-security', label: 'Security Tips', icon: Lock },
    { id: 'reports', label: 'Reports', icon: FileText, badge: 'Pro' },
    { id: 'emergency-info', label: 'Emergency Info', icon: AlertTriangle },
    { id: 'premium-features', label: 'Premium', icon: Crown, badge: 'Pro' },
    { id: 'demos', label: 'View Demos', icon: Zap }
  ];

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
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSectionChange(tab.id)}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                  whitespace-nowrap flex items-center gap-2 backdrop-blur-sm
                  ${activeSection === tab.id
                    ? 'bg-blue-600/90 text-white shadow-lg transform scale-105'
                    : 'bg-white/70 text-gray-700 hover:bg-blue-50/80 hover:text-blue-600'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Plan indicator and progress */}
          <div className="flex items-center justify-between py-3 border-t border-gray-200/50">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/90 text-white rounded-full text-sm font-bold backdrop-blur-sm">
              Current plan: Free
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
      
      {/* Content of active section directly under menu */}
      <div className="container mx-auto px-6 py-8">
        <RetirementApp activeSection={activeSection} onSectionChange={handleSectionChange} />
      </div>
    </Phase2Wrapper>
  );
};

export default RetraiteModuleEn;
