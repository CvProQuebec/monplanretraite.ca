// src/pages/RetraiteModuleEn.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const RetraiteModuleEn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth();

  useEffect(() => {
    console.log('🔍 RetraiteModuleEn - Component loaded');
    console.log('🔍 RetraiteModuleEn - User:', user);
    console.log('🔍 RetraiteModuleEn - Active section:', activeSection);
  }, [user, activeSection]);

  // Handle URL parameters for active section
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      console.log('🔍 Section detected in URL:', section);
      setActiveSection(section);
    }
  }, [searchParams]);

  const handleSectionChange = (newSection: string) => {
    console.log('🔍 Section change requested:', newSection);
    setActiveSection(newSection);
    // Update URL without reloading the page
    const url = new URL(window.location.href);
    url.searchParams.set('section', newSection);
    window.history.replaceState({}, '', url.toString());
  };

  console.log('🔍 RetraiteModuleEn - About to render simple version');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Retirement Module - English Version
          </h1>
          <p className="text-xl text-gray-600">
            Welcome to your retirement planning dashboard
          </p>
        </div>

        {/* Section Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['dashboard', 'savings', 'cashflow', 'cpp', 'tax', 'simulator'].map((section) => (
              <button
                key={section}
                onClick={() => handleSectionChange(section)}
                className={`p-3 rounded-lg transition-colors ${
                  activeSection === section
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Active Section Display */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Active Section: {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Current Status</h3>
              <p className="text-gray-600">
                You are currently viewing the <strong>{activeSection}</strong> section.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">User Information</h3>
              <p className="text-blue-600">
                {user ? `Logged in as: ${user.email || 'User'}` : 'Not logged in'}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Debug Information</h3>
              <p className="text-green-600 text-sm">
                Component loaded successfully. Check console for detailed logs.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Retirement Module Test Version - Debug Mode</p>
        </div>
      </div>
    </div>
  );
};

export default RetraiteModuleEn;
