// src/features/retirement/sections/SuccessionSection.tsx
import React from 'react';
import { SuccessionTab } from '../components/emergency/SuccessionTab';
import { useRetirementData } from '../hooks/useRetirementData';
import { useLanguage } from '../hooks/useLanguage';

interface SuccessionSectionProps {
  data?: any;
  onUpdate?: (section: string, updates: any) => void;
}

export const SuccessionSection: React.FC<SuccessionSectionProps> = ({ data, onUpdate }) => {
  const { userData: localData } = useRetirementData();
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  // Utiliser les props ou les données locales
  const userData = data || localData;

  // Données par défaut pour la succession
  const defaultSuccessionData = {
    willAndSuccession: {
      hasWill: false,
      willLocation: '',
      executorName: '',
      executorContact: '',
      beneficiaries: [],
      specialInstructions: '',
      lastUpdated: new Date()
    },
    funeralPreferences: {
      funeralType: 'traditional',
      burialType: 'ground',
      funeralHomes: [],
      cemeteries: [],
      specialRequests: '',
      organDonation: false,
      lastUpdated: new Date()
    }
  };

  const successionData = userData?.emergency?.succession || defaultSuccessionData;

  const handleSuccessionUpdate = (newData: any) => {
    if (onUpdate) {
      onUpdate('emergency', {
        ...userData?.emergency,
        succession: newData
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {isEnglish ? '🏛️ Estate Planning & Succession' : '🏛️ Planification successorale'}
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            {isEnglish 
              ? 'Plan your legacy and ensure your wishes are respected'
              : 'Planifiez votre héritage et assurez-vous que vos souhaits soient respectés'
            }
          </p>
        </div>

        {/* Contenu principal */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/30 p-6">
          <SuccessionTab 
            data={successionData}
            onUpdate={handleSuccessionUpdate}
          />
        </div>
      </div>
    </div>
  );
};
