import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Calculator, TrendingDown, DollarSign, Calendar, Target, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface MeltdownScenario {
  id: string;
  name: string;
  description: string;
  ageRange: string;
  taxBracket: string;
  strategy: string;
  pros: string[];
  cons: string[];
  considerations: string[];
}

interface MeltdownCalculation {
  currentRRSPValue: number;
  currentAge: number;
  targetAge: number;
  currentTaxRate: number;
  projectedTaxRate: number;
  annualWithdrawal: number;
  totalTaxSavings: number;
  riskLevel: 'Faible' | 'Modéré' | 'Élevé';
}

const RRSPMeltdownStrategiesModule: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('gradual');
  const [calculationInputs, setCalculationInputs] = useState({
    rrspValue: 500000,
    currentAge: 55,
    targetAge: 71,
    currentTaxRate: 35,
    projectedTaxRate: 45
  });

  const meltdownScenarios: MeltdownScenario[] = [
    {
      id: 'gradual',
      name: 'Fonte graduelle (55-71 ans)',
      description: 'Réduction progressive du REER avant la conversion obligatoire en FERR',
      ageRange: '55-71 ans',
      taxBracket: '30-40%',
      strategy: 'Retraits annuels constants pour éviter les tranches d\'imposition élevées',
      pros: [
        'Lissage de l\'impact fiscal sur plusieurs années',
        'Évite les pics d\'imposition à 71 ans',
        'Permet de rester dans des tranches d\'imposition plus basses',
        'Flexibilité pour ajuster selon les revenus annuels'
      ],
      cons: [
        'Perte de croissance à l\'abri de l\'impôt',
        'Complexité de planification sur 15+ années',
        'Risque de changements fiscaux futurs'
      ],
      considerations: [
        'Coordonner avec les autres sources de revenus',
        'Considérer l\'impact sur les prestations gouvernementales',
        'Évaluer les opportunités de fractionnement de revenu'
      ]
    },
    {
      id: 'accelerated',
      name: 'Fonte accélérée (60-65 ans)',
      description: 'Vidange rapide du REER pendant les années de faible revenu',
      ageRange: '60-65 ans',
      taxBracket: '25-35%',
      strategy: 'Retraits importants pendant la période de transition vers la retraite',
      pros: [
        'Profite des années de faible revenu',
        'Maximise l\'efficacité fiscale',
        'Réduit drastiquement les retraits FERR futurs',
        'Libère de l\'espace pour d\'autres stratégies'
      ],
      cons: [
        'Retraits importants concentrés sur peu d\'années',
        'Risque de dépasser les tranches d\'imposition optimales',
        'Perte de croissance composée'
      ],
      considerations: [
        'Timing critique avec la cessation d\'emploi',
        'Impact sur l\'admissibilité aux crédits d\'impôt',
        'Coordination avec le début des prestations RRQ/SV'
      ]
    },
    {
      id: 'strategic',
      name: 'Fonte stratégique par tranches',
      description: 'Optimisation par tranches d\'imposition avec timing précis',
      ageRange: '55-71 ans',
      taxBracket: 'Variable',
      strategy: 'Retraits calculés pour maximiser chaque tranche d\'imposition disponible',
      pros: [
        'Optimisation fiscale maximale',
        'Utilisation complète des tranches d\'imposition basses',
        'Flexibilité selon les changements de situation',
        'Coordination optimale avec autres revenus'
      ],
      cons: [
        'Complexité de calcul et de suivi',
        'Nécessite une planification fiscale experte',
        'Sensible aux changements de législation'
      ],
      considerations: [
        'Révision annuelle des tranches d\'imposition',
        'Impact des revenus du conjoint',
        'Planification des dépenses importantes'
      ]
    },
    {
      id: 'income-splitting',
      name: 'Fonte avec fractionnement',
      description: 'Combinaison de la fonte REER avec les stratégies de fractionnement de revenu',
      ageRange: '65+ ans',
      taxBracket: '25-40%',
      strategy: 'Utilisation du fractionnement de pension pour optimiser l\'impact fiscal',
      pros: [
        'Réduction significative de l\'impôt total du couple',
        'Optimisation des prestations gouvernementales',
        'Flexibilité dans la répartition des revenus',
        'Maximisation des crédits d\'impôt disponibles'
      ],
      cons: [
        'Disponible seulement à 65 ans et plus',
        'Limité à 50% du revenu de pension admissible',
        'Complexité administrative'
      ],
      considerations: [
        'Revenus et situation fiscale du conjoint',
        'Impact sur les prestations basées sur le revenu',
        'Planification coordonnée des deux conjoints'
      ]
    }
  ];

  const calculateMeltdown = (): MeltdownCalculation => {
    const { rrspValue, currentAge, targetAge, currentTaxRate, projectedTaxRate } = calculationInputs;
    const years = targetAge - currentAge;
    const annualWithdrawal = rrspValue / years;
    const currentTax = (rrspValue * currentTaxRate) / 100;
    const projectedTax = (rrspValue * projectedTaxRate) / 100;
    const totalTaxSavings = projectedTax - currentTax;
    
    let riskLevel: 'Faible' | 'Modéré' | 'Élevé' = 'Faible';
    if (annualWithdrawal > 50000) riskLevel = 'Modéré';
    if (annualWithdrawal > 100000) riskLevel = 'Élevé';

    return {
      currentRRSPValue: rrspValue,
      currentAge,
      targetAge,
      currentTaxRate,
      projectedTaxRate,
      annualWithdrawal,
      totalTaxSavings,
      riskLevel
    };
  };

  const calculation = calculateMeltdown();

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'Faible': return 'bg-green-100 text-green-800';
      case 'Modéré': return 'bg-yellow-100 text-yellow-800';
      case 'Élevé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-6 w-6" />
            Stratégies de fonte du REER (RRSP Meltdown)
          </CardTitle>
          <CardDescription>
            Techniques avancées pour optimiser fiscalement la réduction de vos REER avant 71 ans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Stratégie canadienne :</strong> La fonte du REER est une technique d'optimisation fiscale 
              qui consiste à réduire progressivement vos REER avant l'âge de 71 ans pour éviter les retraits 
              FERR obligatoires dans des tranches d'imposition plus élevées.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="strategies" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="strategies">Stratégies</TabsTrigger>
              <TabsTrigger value="calculator">Calculateur</TabsTrigger>
              <TabsTrigger value="timing">Timing optimal</TabsTrigger>
              <TabsTrigger value="risks">Risques & considérations</TabsTrigger>
            </TabsList>

            <TabsContent value="strategies" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {meltdownScenarios.map((scenario) => (
                  <Card 
                    key={scenario.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${selectedScenario === scenario.id ? 'ring-2 ring-mpr-interactive' : ''}`}
                    onClick={() => setSelectedScenario(scenario.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <CardDescription>{scenario.description}</CardDescription>
                      <div className="flex gap-2">
                        <Badge variant="outline">{scenario.ageRange}</Badge>
                        <Badge variant="secondary">{scenario.taxBracket}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Stratégie :</h4>
                        <p className="text-sm text-gray-600">{scenario.strategy}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-green-700">Avantages :</h4>
                        <ul className="text-sm space-y-1">
                          {scenario.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-red-700">Inconvénients :</h4>
                        <ul className="text-sm space-y-1">
                          {scenario.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <AlertTriangle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Considérations importantes :</h4>
                        <ul className="text-sm space-y-1">
                          {scenario.considerations.map((consideration, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Info className="h-3 w-3 text-mpr-interactive mt-0.5 flex-shrink-0" />
                              <span>{consideration}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="calculator" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Calculateur de fonte REER
                  </CardTitle>
                  <CardDescription>
                    Estimez les économies fiscales potentielles de votre stratégie de fonte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Valeur actuelle du REER ($)
                      </label>
                      <input
                        type="number"
                        value={calculationInputs.rrspValue}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          rrspValue: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="0"
                        step="10000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Âge actuel
                      </label>
                      <input
                        type="number"
                        value={calculationInputs.currentAge}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          currentAge: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="50"
                        max="70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Âge cible de fin de fonte
                      </label>
                      <input
                        type="number"
                        value={calculationInputs.targetAge}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          targetAge: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="60"
                        max="71"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Taux d'imposition actuel (%)
                      </label>
                      <input
                        type="number"
                        value={calculationInputs.currentTaxRate}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          currentTaxRate: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="0"
                        max="60"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Taux d'imposition projeté à 71+ ans (%)
                      </label>
                      <input
                        type="number"
                        value={calculationInputs.projectedTaxRate}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          projectedTaxRate: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="0"
                        max="60"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-mpr-interactive">
                          {calculation.annualWithdrawal.toLocaleString('fr-CA', {
                            style: 'currency',
                            currency: 'CAD',
                            maximumFractionDigits: 0
                          })}
                        </div>
                        <div className="text-sm text-gray-600">Retrait annuel requis</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                          {calculation.totalTaxSavings.toLocaleString('fr-CA', {
                            style: 'currency',
                            currency: 'CAD',
                            maximumFractionDigits: 0
                          })}
                        </div>
                        <div className="text-sm text-gray-600">Économies fiscales totales</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-purple-600">
                          {calculation.targetAge - calculation.currentAge}
                        </div>
                        <div className="text-sm text-gray-600">Années de fonte</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskColor(calculation.riskLevel)}>
                            {calculation.riskLevel}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">Niveau de risque</div>
                      </CardContent>
                    </Card>
                  </div>

                  {calculation.totalTaxSavings > 0 ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Stratégie recommandée :</strong> Votre fonte REER pourrait vous faire économiser{' '}
                        <strong>{calculation.totalTaxSavings.toLocaleString('fr-CA', {
                          style: 'currency',
                          currency: 'CAD',
                          maximumFractionDigits: 0
                        })}</strong> en impôts. Consultez un conseiller fiscal pour optimiser la mise en œuvre.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Attention :</strong> Selon vos paramètres actuels, la fonte REER pourrait ne pas être 
                        avantageuse. Révisez vos projections de taux d'imposition ou considérez d'autres stratégies.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timing optimal pour la fonte REER
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-mpr-interactive-lt">
                      <CardHeader>
                        <CardTitle className="text-lg text-mpr-navy">Phase 1 : Préparation (50-55 ans)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• Évaluation de la situation fiscale actuelle</li>
                          <li>• Projection des revenus de retraite</li>
                          <li>• Analyse des tranches d'imposition futures</li>
                          <li>• Planification de la stratégie de fonte</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-green-800">Phase 2 : Exécution (55-65 ans)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• Début des retraits stratégiques</li>
                          <li>• Coordination avec la cessation d'emploi</li>
                          <li>• Optimisation avec les revenus réduits</li>
                          <li>• Ajustements selon les changements fiscaux</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-orange-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-orange-800">Phase 3 : Finalisation (65-71 ans)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• Accélération si nécessaire</li>
                          <li>• Coordination avec RRQ/SV</li>
                          <li>• Utilisation du fractionnement de pension</li>
                          <li>• Préparation à la conversion FERR</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <Target className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Moment optimal :</strong> La fonte REER est généralement plus efficace pendant les années 
                      de faible revenu (55-65 ans), avant le début des prestations gouvernementales et des retraits FERR obligatoires.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Facteurs de timing critiques :</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-700 mb-2">Moments favorables :</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Années de faible revenu d'emploi</li>
                          <li>• Avant le début des prestations RRQ (60-65 ans)</li>
                          <li>• Pendant les années de transition à la retraite</li>
                          <li>• Quand les taux d'imposition sont temporairement bas</li>
                          <li>• Avant les changements fiscaux défavorables</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-700 mb-2">Moments à éviter :</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Années de revenu d'emploi élevé</li>
                          <li>• Quand déjà dans les tranches d'imposition élevées</li>
                          <li>• Pendant les années de gains en capital importants</li>
                          <li>• Si les taux d'imposition futurs seront plus bas</li>
                          <li>• Sans planification fiscale appropriée</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risques et considérations importantes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Avertissement :</strong> La fonte REER est une stratégie complexe qui nécessite une 
                      planification fiscale experte. Consultez toujours un conseiller fiscal qualifié avant de procéder.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-red-700 mb-3">Risques principaux :</h3>
                      <div className="space-y-3">
                        <div className="p-3 border-l-4 border-red-500 bg-red-50">
                          <h4 className="font-medium">Perte de croissance composée</h4>
                          <p className="text-sm text-gray-600">
                            Les fonds retirés ne bénéficient plus de la croissance à l'abri de l'impôt
                          </p>
                        </div>
                        <div className="p-3 border-l-4 border-red-500 bg-red-50">
                          <h4 className="font-medium">Changements fiscaux futurs</h4>
                          <p className="text-sm text-gray-600">
                            Les taux d'imposition peuvent changer, rendant la stratégie moins efficace
                          </p>
                        </div>
                        <div className="p-3 border-l-4 border-red-500 bg-red-50">
                          <h4 className="font-medium">Impact sur les prestations</h4>
                          <p className="text-sm text-gray-600">
                            Les retraits peuvent affecter l'admissibilité aux prestations basées sur le revenu
                          </p>
                        </div>
                        <div className="p-3 border-l-4 border-red-500 bg-red-50">
                          <h4 className="font-medium">Complexité de gestion</h4>
                          <p className="text-sm text-gray-600">
                            Nécessite un suivi constant et des ajustements réguliers
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-mpr-navy mb-3">Considérations importantes :</h3>
                      <div className="space-y-3">
                        <div className="p-3 border-l-4 border-mpr-interactive bg-mpr-interactive-lt">
                          <h4 className="font-medium">Situation du conjoint</h4>
                          <p className="text-sm text-gray-600">
                            Coordonner avec les revenus et la situation fiscale du conjoint
                          </p>
                        </div>
                        <div className="p-3 border-l-4 border-mpr-interactive bg-mpr-interactive-lt">
                          <h4 className="font-medium">Autres sources de revenus</h4>
                          <p className="text-sm text-gray-600">
                            Considérer l'impact des pensions, rentes et autres revenus
                          </p>
                        </div>
                        <div className="p-3 border-l-4 border-mpr-interactive bg-mpr-interactive-lt">
                          <h4 className="font-medium">Besoins de liquidités</h4>
                          <p className="text-sm text-gray-600">
                            S'assurer que les retraits correspondent aux besoins réels
                          </p>
                        </div>
                        <div className="p-3 border-l-4 border-mpr-interactive bg-mpr-interactive-lt">
                          <h4 className="font-medium">Planification successorale</h4>
                          <p className="text-sm text-gray-600">
                            Impact sur la transmission du patrimoine aux héritiers
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Card className="bg-yellow-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-yellow-800">Liste de vérification avant de procéder</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Analyse préalable :</h4>
                          <ul className="text-sm space-y-1">
                            <li>☐ Projection complète des revenus de retraite</li>
                            <li>☐ Analyse des tranches d'imposition actuelles et futures</li>
                            <li>☐ Évaluation de l'impact sur les prestations gouvernementales</li>
                            <li>☐ Considération de la situation du conjoint</li>
                            <li>☐ Analyse des besoins de liquidités</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Mise en œuvre :</h4>
                          <ul className="text-sm space-y-1">
                            <li>☐ Consultation avec un conseiller fiscal qualifié</li>
                            <li>☐ Plan de retrait détaillé par année</li>
                            <li>☐ Stratégie de réinvestissement des fonds retirés</li>
                            <li>☐ Mécanisme de révision et d'ajustement annuel</li>
                            <li>☐ Documentation complète pour fins fiscales</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RRSPMeltdownStrategiesModule;
