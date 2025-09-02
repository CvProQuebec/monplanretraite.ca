import React, { useState } from 'react';
import { SeniorsCompetitiveComparison } from '../components/comparison/SeniorsCompetitiveComparison';
import type { UserProfile as ComparisonUserProfile } from '../services/CompetitiveComparisonService';

export function ComparisonPage() {
  const [demoProfile, setDemoProfile] = useState<ComparisonUserProfile>({
    currentAge: 55,
    gender: 'male',
    currentSavings: 150000,
    monthlyContribution: 1000,
    retirementAge: 65,
    desiredIncome: 4000,
  });

  return (
    <div className="comparison-page min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* En-tête de page */}
        <div className="page-header text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Pourquoi nos calculs sont plus précis</h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
            MonPlanRetraite.ca utilise les normes officielles de l'Institut de planification financière (IPF 2025)
            et la table de mortalité CPM2014 de l'Institut canadien des actuaires. Découvrez la différence pour votre
            retraite.
          </p>
        </div>

        {/* Profil de démonstration */}
        <div className="demo-profile bg-white rounded-lg p-8 mb-12 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exemple de comparaison</h2>
          <div className="profile-grid grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="profile-item">
              <label className="text-lg font-semibold text-gray-700">Âge actuel</label>
              <div className="text-2xl font-bold text-blue-600">{demoProfile.currentAge} ans</div>
            </div>
            <div className="profile-item">
              <label className="text-lg font-semibold text-gray-700">Épargnes actuelles</label>
              <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0 }).format(
                  demoProfile.currentSavings
                )}
              </div>
            </div>
            <div className="profile-item">
              <label className="text-lg font-semibold text-gray-700">Épargne mensuelle</label>
              <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0 }).format(
                  demoProfile.monthlyContribution
                )}
              </div>
            </div>
            <div className="profile-item">
              <label className="text-lg font-semibold text-gray-700">Retraite à</label>
              <div className="text-2xl font-bold text-blue-600">{demoProfile.retirementAge} ans</div>
            </div>
          </div>
        </div>

        {/* Comparateur principal */}
        <SeniorsCompetitiveComparison userProfile={demoProfile} showDetails={true} />

        {/* Section éducative */}
        <div className="education-section mt-12 bg-white rounded-lg p-8 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pourquoi cette différence ?</h2>

          <div className="education-grid grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="education-item">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Normes IPF 2025</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Nous utilisons les hypothèses officielles de l'Institut de planification financière, mises à jour en
                2025. Ces normes reflètent les conditions économiques actuelles et les prévisions les plus récentes.
              </p>
            </div>

            <div className="education-item">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Table CPM2014</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Notre calcul d'espérance de vie utilise la table officielle des retraités canadiens de l'Institut
                canadien des actuaires, plus précise que les estimations génériques.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparisonPage;
