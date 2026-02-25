import React, { useMemo, useState, useEffect } from 'react';
import type { UserProfile as ComparisonUserProfile, ComparisonAdvantage } from '../../services/CompetitiveComparisonService';
import { CompetitiveComparisonService } from '../../services/CompetitiveComparisonService';
import { formatMontantOQLF, formatPourcentageOQLF } from '../../utils/formatters';
import { ComparisonAnalytics } from '../../services/ComparisonAnalytics';
import '../../styles/seniors-comparison.css';

interface ComparisonProps {
  userProfile: ComparisonUserProfile;
  showDetails?: boolean;
}

export function SeniorsCompetitiveComparison({ userProfile, showDetails = false }: ComparisonProps) {
  const [selectedComparison, setSelectedComparison] = useState<'generic' | 'conservative'>('generic');

  const comparison = useMemo(() => CompetitiveComparisonService.generateComparison(userProfile), [userProfile]);

  const competitor = selectedComparison === 'generic' ? comparison.generic : comparison.conservative;
  const advantages: ComparisonAdvantage[] = comparison.advantages;

  useEffect(() => {
    // Tracking simple à l'affichage
    ComparisonAnalytics.trackComparison(userProfile, advantages);
  }, [userProfile, advantages]);

  const isYearsAdvantage = (a: ComparisonAdvantage) => a.category.toLowerCase().includes('planification');

  return (
    <div className="seniors-comparison-widget bg-white border-2 border-gray-300 rounded-lg p-8 shadow-lg">
      {/* En-tête explicatif */}
      <div className="comparison-header mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi nos calculs sont plus précis</h2>
        <p className="text-xl text-gray-700 leading-relaxed">
          Comparaison avec d'autres calculateurs de retraite utilisant des hypothèses approximatives
        </p>
      </div>

      {/* Sélecteur de comparaison */}
      <div className="comparison-selector mb-8">
        <p className="text-lg font-semibold mb-4">Comparer avec :</p>
        <div className="selector-buttons">
          <button
            className={`selector-btn ${selectedComparison === 'generic' ? 'active' : ''}`}
            onClick={() => setSelectedComparison('generic')}
          >
            Calculateur moyen du marché
          </button>
          <button
            className={`selector-btn ${selectedComparison === 'conservative' ? 'active' : ''}`}
            onClick={() => setSelectedComparison('conservative')}
          >
            Calculateur très conservateur
          </button>
        </div>
      </div>

      {/* Comparaison visuelle */}
      <div className="comparison-grid grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* MonPlanRetraite.ca */}
        <div className="scenario-card our-platform">
          <div className="card-header bg-green-50 border-2 border-green-200 rounded-t-lg p-6">
            <h3 className="text-2xl font-bold text-green-800">MonPlanRetraite.ca</h3>
            <p className="text-lg text-green-700">Normes IPF 2025 + Table CPM2014</p>
          </div>
          <div className="card-content p-6 border-2 border-green-200 border-t-0 rounded-b-lg">
            <div className="financial-result mb-4">
              <span className="result-label">Capital projeté à {userProfile.retirementAge} ans</span>
              <div className="result-amount text-4xl font-bold text-green-600" aria-live="polite">
                {formatMontantOQLF(comparison.monplanretraite.projectedCapital)}
              </div>
            </div>
            <div className="financial-result">
              <span className="result-label">Revenus mensuels possibles</span>
              <div className="result-amount text-3xl font-bold text-green-600" aria-live="polite">
                {formatMontantOQLF(comparison.monplanretraite.monthlyRetirementIncome)}/mois
              </div>
            </div>
          </div>
        </div>

        {/* Concurrent */}
        <div className="scenario-card competitor">
          <div className="card-header bg-gray-50 border-2 border-gray-300 rounded-t-lg p-6">
            <h3 className="text-2xl font-bold text-gray-700">{competitor.scenario.name}</h3>
            <p className="text-lg text-gray-600">{competitor.scenario.description}</p>
          </div>
          <div className="card-content p-6 border-2 border-gray-300 border-t-0 rounded-b-lg">
            <div className="financial-result mb-4">
              <span className="result-label">Capital projeté à {userProfile.retirementAge} ans</span>
              <div className="result-amount text-4xl font-bold text-gray-600" aria-live="polite">
                {formatMontantOQLF(competitor.projectedCapital)}
              </div>
            </div>
            <div className="financial-result">
              <span className="result-label">Revenus mensuels possibles</span>
              <div className="result-amount text-3xl font-bold text-gray-600" aria-live="polite">
                {formatMontantOQLF(competitor.monthlyRetirementIncome)}/mois
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avantages quantifiés */}
      <div className="advantages-section">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Votre avantage avec nos calculs précis</h3>

        {advantages.map((advantage, index) => (
          <div key={index} className="advantage-card bg-mpr-interactive-lt border-2 border-mpr-border rounded-lg p-6 mb-4">
            <div className="advantage-header mb-3">
              <h4 className="text-xl font-bold text-mpr-navy">{advantage.category}</h4>
              <div className="advantage-amount text-3xl font-bold text-mpr-interactive">
                {!isYearsAdvantage(advantage)
                  ? formatMontantOQLF(advantage.advantage)
                  : `${advantage.advantage.toFixed(1)} années`}
                {advantage.percentage > 0 && (
                  <span className="advantage-percentage text-xl ml-2">
                    (+{formatPourcentageOQLF(advantage.percentage)})
                  </span>
                )}
              </div>
            </div>

            <p className="advantage-message text-lg text-mpr-navy mb-3">{advantage.message}</p>

            {showDetails && (
              <p className="advantage-explanation text-base text-mpr-interactive">{advantage.explanation}</p>
            )}
          </div>
        ))}
      </div>

      {/* Crédibilité et sources */}
      <div className="credibility-section mt-8 p-6 bg-gray-50 rounded-lg">
        <h4 className="text-xl font-bold text-gray-900 mb-4">Nos sources officielles</h4>
        <div className="sources-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="source-item">
            <div className="source-name font-semibold">Institut de planification financière</div>
            <div className="source-detail text-gray-700">Normes d'hypothèses de projection 2025</div>
          </div>
          <div className="source-item">
            <div className="source-name font-semibold">Institut canadien des actuaires</div>
            <div className="source-detail text-gray-700">Table de mortalité CPM2014 officielle</div>
          </div>
        </div>
      </div>

      {/* Call-to-action pour seniors */}
      <div className="cta-section mt-8 text-center">
        <button className="cta-button bg-mpr-interactive text-white text-xl font-bold py-4 px-8 rounded-lg hover:bg-mpr-interactive-dk transition-colors">
          Voir ma projection précise maintenant
        </button>
        <p className="cta-subtext text-lg text-gray-600 mt-3">
          Gratuit • Conforme IPF 2025 • Spécialement conçu pour les Québécois
        </p>
      </div>
    </div>
  );
}

export default SeniorsCompetitiveComparison;
