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
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-blue-900">
            <TrendingUp className="h-6 w-6 mr-2" />
            Calculateur CoastFIRE
          </CardTitle>
          <p className="text-blue-700">
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
              <div>
                <label htmlFor="current-savings" className="block text-sm font-medium text-gray-700 mb-1">
                  Épargne actuelle ($)
                </label>
                <input
                  id="current-savings"
                  type="number"
                  value={inputs.currentSavings}
                  onChange={(e) => setInputs({...inputs, currentSavings: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 50000"
                  title="Montant total de votre épargne actuelle"
                />
              </div>

              <div>
                <label htmlFor="annual-expenses" className="block text-sm font-medium text-gray-700 mb-1">
                  Dépenses annuelles à la retraite ($)
                </label>
                <input
                  id="annual-expenses"
                  type="number"
                  value={inputs.annualExpenses}
                  onChange={(e) => setInputs({...inputs, annualExpenses: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 40000"
                  title="Montant annuel nécessaire pour vos dépenses à la retraite"
                />
              </div>

              <div>
                <label htmlFor="current-age" className="block text-sm font-medium text-gray-700 mb-1">
                  Âge actuel
                </label>
                <input
                  id="current-age"
                  type="number"
                  value={inputs.currentAge}
                  onChange={(e) => setInputs({...inputs, currentAge: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 30"
                  title="Votre âge actuel en années"
                />
              </div>

              <div>
                <label htmlFor="retirement-age" className="block text-sm font-medium text-gray-700 mb-1">
                  Âge de retraite souhaité
                </label>
                <input
                  id="retirement-age"
                  type="number"
                  value={inputs.retirementAge}
                  onChange={(e) => setInputs({...inputs, retirementAge: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 65"
                  title="L'âge auquel vous souhaitez prendre votre retraite"
                />
              </div>

              <div>
                <label htmlFor="expected-return" className="block text-sm font-medium text-gray-700 mb-1">
                  Rendement annuel attendu (%)
                </label>
                <input
                  id="expected-return"
                  type="number"
                  step="0.1"
                  value={inputs.expectedReturn}
                  onChange={(e) => setInputs({...inputs, expectedReturn: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              Vos résultats CoastFIRE
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Capital cible nécessaire :</span>
                    <span className="font-bold text-blue-600">
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
                      Vous avez atteint CoastFIRE !
                    </p>
                    <p className="text-xs text-green-700">
                      Vos épargnes actuelles croîtront naturellement pour atteindre votre objectif de retraite.
                      Vous pouvez arrêter d'épargner dès maintenant !
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Âge CoastFIRE estimé :</span>
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
                      En épargnant ce montant pendant 1 an, vous atteindrez CoastFIRE.
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
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <h4 className="font-semibold">Qu'est-ce que CoastFIRE ?</h4>
              <p className="text-sm">
                CoastFIRE (Coast Financial Independence Retire Early) est le point où vous avez suffisamment d'épargnes 
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
              
              <h4 className="font-semibold">Avantages du CoastFIRE :</h4>
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
