/**
 * Calculateur CoastFIRE - Indépendance Financière Anticipée
 * Calcule l'âge auquel vous pouvez arrêter d'épargner pour la retraite
 * Basé sur l'expertise Retraite101 et la règle du 4%
 */

import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Target, Clock, DollarSign, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Alert, AlertDescription } from './alert';

/* CSS pour disposition horizontale des formulaires */
const inlineFormStyles = `
.senior-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  min-height: 48px;
}

.senior-form-label {
  font-size: 18px;
  font-weight: 600;
  color: #1a365d;
  text-align: left;
}

.senior-form-input {
  font-size: 18px;
  min-height: 48px;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.senior-form-input:focus {
  border-color: #2B5BA8;
  box-shadow: 0 0 0 3px rgba(43, 91, 168, 0.1);
  outline: none;
}

@media (max-width: 768px) {
  .senior-form-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .senior-form-label {
    text-align: left;
  }
}
`;

interface CoastFIREInputs {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  annualExpenses: number;
  expectedReturn: number;
}

interface CoastFIREResults {
  targetAmount: number;
  coastFIREAge: number;
  yearsToCoastFIRE: number;
  monthlyContributionNeeded: number;
  canCoastFIRE: boolean;
  projectedValue: number;
}

export const CoastFIRECalculator: React.FC = () => {
  // Injecter les styles CSS pour les formulaires horizontaux
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = inlineFormStyles;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const [inputs, setInputs] = useState<CoastFIREInputs>({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    annualExpenses: 48000,
    expectedReturn: 7
  });

  const [results, setResults] = useState<CoastFIREResults | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    calculateCoastFIRE();
  }, [inputs]);

  const calculateCoastFIRE = () => {
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const targetAmount = inputs.annualExpenses / 0.04; // Règle du 4%
    const annualReturn = inputs.expectedReturn / 100;
    
    // Calculer la valeur projetée des épargnes actuelles
    const projectedValue = inputs.currentSavings * Math.pow(1 + annualReturn, yearsToRetirement);
    
    // Vérifier si on peut déjà faire du CoastFIRE
    const canCoastFIRE = projectedValue >= targetAmount;
    
    let coastFIREAge = inputs.currentAge;
    let monthlyContributionNeeded = 0;
    
    if (!canCoastFIRE) {
      // Calculer combien il faut épargner pour atteindre CoastFIRE
      const amountNeeded = targetAmount / Math.pow(1 + annualReturn, yearsToRetirement);
      const shortfall = amountNeeded - inputs.currentSavings;
      
      if (shortfall > 0) {
        // Calculer la contribution mensuelle nécessaire pour atteindre CoastFIRE en 1 an
        const monthlyRate = annualReturn / 12;
        const months = 12; // 1 an pour atteindre CoastFIRE
        
        if (monthlyRate === 0) {
          monthlyContributionNeeded = shortfall / months;
        } else {
          monthlyContributionNeeded = shortfall * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
        }
        
        coastFIREAge = inputs.currentAge + 1;
      }
    }

    setResults({
      targetAmount,
      coastFIREAge,
      yearsToCoastFIRE: coastFIREAge - inputs.currentAge,
      monthlyContributionNeeded,
      canCoastFIRE,
      projectedValue
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-mpr-border bg-gradient-to-r from-mpr-interactive-lt to-mpr-interactive-lt">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-mpr-navy">
            <TrendingUp className="h-6 w-6 mr-2" />
            Calculateur de liberté financière
          </CardTitle>
          <p className="text-mpr-navy">
            Découvrez à quel âge vous pourrez arrêter d'épargner et laisser vos placements croître jusqu'à la retraite.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire d'entrée */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Vos informations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="senior-form-row">
                <label htmlFor="current-savings" className="senior-form-label">
                  Épargne actuelle ($)
                </label>
                <input
                  id="current-savings"
                  type="number"
                  value={inputs.currentSavings}
                  onChange={(e) => setInputs({...inputs, currentSavings: parseFloat(e.target.value) || 0})}
                  className="senior-form-input"
                  placeholder="Ex: 50000"
                  title="Montant total de votre épargne actuelle"
                />
              </div>

              <div className="senior-form-row">
                <label htmlFor="annual-expenses" className="senior-form-label">
                  Dépenses annuelles à la retraite ($)
                </label>
                <input
                  id="annual-expenses"
                  type="number"
                  value={inputs.annualExpenses}
                  onChange={(e) => setInputs({...inputs, annualExpenses: parseFloat(e.target.value) || 0})}
                  className="senior-form-input"
                  placeholder="Ex: 40000"
                  title="Montant annuel nécessaire pour vos dépenses à la retraite"
                />
              </div>

              <div className="senior-form-row">
                <label htmlFor="current-age" className="senior-form-label">
                  Âge actuel
                </label>
                <input
                  id="current-age"
                  type="number"
                  value={inputs.currentAge}
                  onChange={(e) => setInputs({...inputs, currentAge: parseInt(e.target.value) || 0})}
                  className="senior-form-input"
                  placeholder="Ex: 30"
                  title="Votre âge actuel en années"
                />
              </div>

              <div className="senior-form-row">
                <label htmlFor="retirement-age" className="senior-form-label">
                  Âge de retraite souhaité
                </label>
                <input
                  id="retirement-age"
                  type="number"
                  value={inputs.retirementAge}
                  onChange={(e) => setInputs({...inputs, retirementAge: parseInt(e.target.value) || 0})}
                  className="senior-form-input"
                  placeholder="Ex: 65"
                  title="L'âge auquel vous souhaitez prendre votre retraite"
                />
              </div>

              <div className="senior-form-row">
                <label htmlFor="expected-return" className="senior-form-label">
                  Rendement annuel attendu (%)
                </label>
                <input
                  id="expected-return"
                  type="number"
                  step="0.1"
                  value={inputs.expectedReturn}
                  onChange={(e) => setInputs({...inputs, expectedReturn: parseFloat(e.target.value) || 0})}
                  className="senior-form-input"
                  placeholder="Ex: 7.0"
                  title="Rendement annuel moyen attendu de vos investissements"
                />
              </div>

              <Button
                onClick={() => setShowExplanation(!showExplanation)}
                variant="outline"
                className="w-full"
              >
                <Info className="h-4 w-4 mr-2" />
                {showExplanation ? 'Masquer' : 'Afficher'} l'explication
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Vos résultats de liberté financière
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results && (
              <div className="space-y-4">
                <div className="p-4 bg-mpr-interactive-lt rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Capital cible nécessaire :</span>
                    <span className="font-bold text-mpr-interactive">
                      {formatCurrency(results.targetAmount)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Basé sur la règle du 4% pour {formatCurrency(inputs.annualExpenses)} de dépenses annuelles
                  </p>
                </div>

                {results.canCoastFIRE ? (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <Badge className="bg-green-100 text-green-800">
                        🎉 Félicitations !
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-green-800 mb-2">
                      Vous avez atteint la liberté financière !
                    </p>
                    <p className="text-xs text-green-700">
                      Vos épargnes actuelles croîtront naturellement pour atteindre votre objectif de retraite.
                      Vous pouvez arrêter d'épargner dès maintenant !
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Âge de liberté financière estimé :</span>
                      <span className="font-bold text-orange-600">
                        {results.coastFIREAge} ans
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Contribution mensuelle nécessaire :</span>
                      <span className="font-bold text-orange-600">
                        {formatCurrency(results.monthlyContributionNeeded)}
                      </span>
                    </div>
                    <p className="text-xs text-orange-700">
                      En épargnant ce montant pendant 1 an, vous atteindrez la liberté financière.
                    </p>
                  </div>
                )}

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Valeur projetée à la retraite :</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(results.projectedValue)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Explication détaillée */}
      {showExplanation && (
        <Alert className="border-mpr-border bg-mpr-interactive-lt">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <h4 className="font-semibold">Qu'est-ce que la liberté financière précoce ?</h4>
              <p className="text-sm">
                La liberté financière précoce est le point où vous avez suffisamment d'épargnes 
                pour que, même sans contributions supplémentaires, vos placements croissent naturellement jusqu'à 
                atteindre votre objectif de retraite.
              </p>
              
              <h4 className="font-semibold">Comment ça fonctionne ?</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Basé sur la règle du 4% : vous pouvez retirer 4% de votre capital annuellement</li>
                <li>Utilise la croissance composée de vos placements existants</li>
                <li>Vous permet d'arrêter d'épargner tout en atteignant vos objectifs de retraite</li>
                <li>Offre plus de flexibilité dans vos choix de carrière</li>
              </ul>
              
              <h4 className="font-semibold">Avantages de la liberté financière précoce :</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Réduction du stress financier</li>
                <li>Liberté de changer de carrière ou réduire ses heures</li>
                <li>Possibilité de prendre des risques calculés</li>
                <li>Équilibre travail-vie personnelle amélioré</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CoastFIRECalculator;
