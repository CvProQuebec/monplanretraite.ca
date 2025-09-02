// src/features/retirement/sections/CPPSection.tsx

import React from 'react';

interface CPPSectionProps {
  className?: string;
}

export const CPPSection: React.FC<CPPSectionProps> = ({ className }) => {
  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');

  const texts = {
    fr: {
      title: 'Régime de pensions du Canada (CPP)',
      subtitle: 'Calculez votre pension fédérale canadienne avec précision',
      description: 'Le CPP est une prestation mensuelle imposable qui assure un remplacement partiel du revenu au moment de la retraite. Contrairement au RRQ québécois, le CPP couvre tous les Canadiens.',
      features: [
        'Calcul basé sur les règles officielles 2025',
        'Exclusion des 8 années les plus faibles',
        'Facteurs d\'ajustement selon l\'âge de retraite',
        'Projections à différents âges (60, 65, 70, 75 ans)',
        'Historique détaillé des cotisations',
        'Support multilingue français/anglais'
      ],
      differences: [
        'CPP : Pension fédérale canadienne',
        'RRQ : Pension provinciale québécoise',
        'Règles très similaires avec quelques différences',
        'Possibilité de recevoir les deux pensions'
      ],
      officialLink: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc.html',
      officialText: 'Site officiel du CPP',
      note: 'Note : Ce calculateur utilise les paramètres officiels 2025 du CPP. Les montants réels peuvent varier selon votre situation personnelle.'
    },
    en: {
      title: 'Canada Pension Plan (CPP)',
      subtitle: 'Calculate your federal Canadian pension with precision',
      description: 'The CPP is a taxable monthly benefit that provides partial income replacement at retirement. Unlike the Quebec RRQ, the CPP covers all Canadians.',
      features: [
        'Calculation based on official 2025 rules',
        'Exclusion of the 8 lowest years',
        'Adjustment factors based on retirement age',
        'Projections at different ages (60, 65, 70, 75 years)',
        'Detailed contribution history',
        'French/English multilingual support'
      ],
      differences: [
        'CPP: Federal Canadian pension',
        'RRQ: Provincial Quebec pension',
        'Very similar rules with some differences',
        'Possibility to receive both pensions'
      ],
      officialLink: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp.html',
      officialText: 'Official CPP website',
      note: 'Note: This calculator uses the official 2025 CPP parameters. Actual amounts may vary based on your personal situation.'
    }
  };

  const t = texts[isFrench ? 'fr' : 'en'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* En-tête de la section */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Description principale */}
          <div className="bg-white/10 backdrop-blur-sm border-purple-300/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">🏁</span>
              {isFrench ? 'À propos du CPP' : 'About CPP'}
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              {t.description}
            </p>
          </div>

          {/* Fonctionnalités principales */}
          <div className="bg-white/10 backdrop-blur-sm border-blue-300/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">✨</span>
              {isFrench ? 'Fonctionnalités principales' : 'Key Features'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span className="text-gray-200">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Différences CPP vs RRQ */}
          <div className="bg-white/10 backdrop-blur-sm border-green-300/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              {isFrench ? 'CPP vs RRQ : Les différences' : 'CPP vs RRQ: The Differences'}
            </h2>
            <div className="space-y-3">
              {t.differences.map((difference, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-blue-400 text-xl">ℹ️</span>
                  <span className="text-gray-200">{difference}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lien officiel */}
          <div className="bg-white/10 backdrop-blur-sm border-yellow-300/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-3">
              <span className="text-3xl">🔗</span>
              {isFrench ? 'Informations officielles' : 'Official Information'}
            </h2>
            <div className="space-y-4">
              <p className="text-gray-200">
                {isFrench 
                  ? 'Pour plus d\'informations officielles sur le CPP :'
                  : 'For more official information about CPP:'
                }
              </p>
              <a 
                href={t.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors bg-yellow-900/20 px-4 py-2 rounded-lg border border-yellow-400/30"
              >
                <span className="text-xl">🌐</span>
                {t.officialText}
              </a>
            </div>
          </div>

          {/* Note importante */}
          <div className="bg-yellow-900/50 border-yellow-400/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-xl">⚠️</span>
              <div className="text-yellow-200">
                <p className="font-semibold mb-2">
                  {isFrench ? 'Information importante' : 'Important information'}
                </p>
                <p>{t.note}</p>
              </div>
            </div>
          </div>

          {/* Badge de statut */}
          <div className="text-center">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-bold inline-block">
              ✅ {isFrench ? 'CPP disponible' : 'CPP Available'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
