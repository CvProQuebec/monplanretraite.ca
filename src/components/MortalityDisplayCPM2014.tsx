import * as React from 'react';
import { MORTALITY_CPM2014 } from '../config/financial-assumptions';

interface MortalityDisplayProps {
  age: number;
  gender: 'male' | 'female';
  showDetails?: boolean;
  // Optionnel: permettre au parent d'injecter un résultat calculé (avec ajustements)
  resultOverride?: {
    lifeExpectancy: number;
    finalAge: number;
    planningAge: number;
    source?: string;
  };
}

export function MortalityDisplayCPM2014({ age, gender, showDetails = false, resultOverride }: MortalityDisplayProps) {
  const base = MORTALITY_CPM2014.getLifeExpectancyDisplay(age, gender);
  const analysis = resultOverride ? { ...base, ...resultOverride } : base;

  return (
    <div className="cpm2014-display bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Analyse de Longévité Personnalisée
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="stat-card">
          <div className="text-sm text-gray-600">Espérance de vie</div>
          <div className="text-2xl font-bold text-mpr-interactive">
            {analysis.lifeExpectancy} ans
          </div>
        </div>

        <div className="stat-card">
          <div className="text-sm text-gray-600">Âge final estimé</div>
          <div className="text-2xl font-bold text-green-600">
            {analysis.finalAge} ans
          </div>
        </div>

        <div className="stat-card">
          <div className="text-sm text-gray-600">Planification jusqu'à</div>
          <div className="text-2xl font-bold text-purple-600">
            {analysis.planningAge} ans
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h4 className="font-semibold mb-2">Méthodologie CPM2014</h4>
          <p className="text-sm text-gray-700 mb-2">
            Calculs basés sur la table CPM2014 (retraités canadiens) de l'Institut
            canadien des actuaires, avec projections d'amélioration jusqu'en 2025.
          </p>
          <p className="text-xs text-gray-600">
            Source : {analysis.source}
          </p>
        </div>
      )}
    </div>
  );
}
