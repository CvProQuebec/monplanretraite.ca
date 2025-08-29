import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Clock, Calculator, TrendingUp, Calendar, Target, AlertTriangle, CheckCircle, Info, DollarSign } from 'lucide-react';

interface CPPTimingScenario {
  id: string;
  name: string;
  description: string;
  startAge: number;
  adjustmentRate: number;
  monthlyBenefit: number;
  lifetimeValue: number;
  breakEvenAge: number;
  pros: string[];
  cons: string[];
  bestFor: string[];
}

interface CPPCalculation {
  baseMonthlyBenefit: number;
  startAge: number;
  adjustedMonthlyBenefit: number;
  lifetimeValue: number;
  breakEvenAge: number;
  totalAdjustment: number;
}

const CPPTimingOptimizationModule: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('standard');
  const [calculationInputs, setCalculationInputs] = useState({
    baseMonthlyBenefit: 1200,
    startAge: 65,
    lifeExpectancy: 85,
    inflationRate: 2.5,
    discountRate: 3.0
  });

  const cppScenarios: CPPTimingScenario[] = [
    {
      id: 'early',
      name: 'Début précoce (60 ans)',
      description: 'Commencer les prestations RRQ/CPP dès 60 ans avec réduction permanente',
      startAge: 60,
      adjustmentRate: -36,
      monthlyBenefit: 768, // 64% of full benefit
      lifetimeValue: 230400, // Assuming 25 years
      breakEvenAge: 74,
      pros: [
        'Liquidités immédiates disponibles',
        'Sécurité de recevoir des prestations',
        'Utile si santé précaire ou besoins financiers urgents',
        'Permet de différer autres sources de revenus'
      ],
      cons: [
        'Réduction permanente de 36% des prestations',
        'Perte significative de revenus à long terme',
        'Impact négatif si longévité élevée',
        'Moins avantageux fiscalement'
      ],
      bestFor: [
        'Personnes avec espérance de vie réduite',
        'Besoins financiers immédiats critiques',
        'Stratégie de pont vers autres revenus',
        'Risque de changements futurs des programmes'
      ]
    },
    {
      id: 'standard',
      name: 'Âge standard (65 ans)',
      description: 'Commencer les prestations à l\'âge normal de retraite sans ajustement',
      startAge: 65,
      adjustmentRate: 0,
      monthlyBenefit: 1200, // 100% of full benefit
      lifetimeValue: 240000, // Assuming 20 years
      breakEvenAge: 65,
      pros: [
        'Prestations complètes sans réduction',
        'Âge traditionnel de retraite',
        'Équilibre entre sécurité et optimisation',
        'Coordination naturelle avec autres programmes'
      ],
      cons: [
        'Pas d\'optimisation pour longévité élevée',
        'Opportunité manquée d\'augmentation',
        'Peut ne pas être optimal selon la situation'
      ],
      bestFor: [
        'Espérance de vie moyenne (80-85 ans)',
        'Besoins de revenus immédiats modérés',
        'Approche conservatrice et traditionnelle',
        'Coordination avec cessation d\'emploi'
      ]
    },
    {
      id: 'delayed',
      name: 'Report stratégique (70 ans)',
      description: 'Reporter les prestations jusqu\'à 70 ans pour maximiser les montants',
      startAge: 70,
      adjustmentRate: 42,
      monthlyBenefit: 1704, // 142% of full benefit
      lifetimeValue: 255600, // Assuming 15 years
      breakEvenAge: 82,
      pros: [
        'Augmentation permanente de 42% des prestations',
        'Optimisation pour longévité élevée',
        'Revenus de retraite maximisés',
        'Avantage fiscal potentiel'
      ],
      cons: [
        'Aucune prestation pendant 5 années critiques',
        'Risque si décès prématuré',
        'Nécessite autres sources de revenus',
        'Complexité de planification'
      ],
      bestFor: [
        'Espérance de vie élevée (85+ ans)',
        'Autres sources de revenus suffisantes',
        'Optimisation fiscale avancée',
        'Maximisation du patrimoine familial'
      ]
    },
    {
      id: 'hybrid',
      name: 'Stratégie hybride (67-68 ans)',
      description: 'Compromis entre sécurité et optimisation avec début modérément différé',
      startAge: 67,
      adjustmentRate: 16.8,
      monthlyBenefit: 1402, // 116.8% of full benefit
      lifetimeValue: 252360, // Assuming 18 years
      breakEvenAge: 78,
      pros: [
        'Augmentation significative des prestations',
        'Équilibre risque/rendement optimal',
        'Période d\'attente raisonnable',
        'Flexibilité de planification'
      ],
      cons: [
        'Pas d\'optimisation maximale',
        'Toujours un risque de longévité',
        'Complexité de timing'
      ],
      bestFor: [
        'Approche équilibrée et pragmatique',
        'Espérance de vie légèrement supérieure à la moyenne',
        'Revenus de transition disponibles',
        'Optimisation modérée souhaitée'
      ]
    }
  ];

  const calculateCPP = (): CPPCalculation => {
    const { baseMonthlyBenefit, startAge, lifeExpectancy } = calculationInputs;
    
    // Calculate adjustment based on age
    let totalAdjustment = 0;
    if (startAge < 65) {
      totalAdjustment = (65 - startAge) * 12 * 0.6; // 0.6% per month before 65
    } else if (startAge > 65) {
      totalAdjustment = (startAge - 65) * 12 * 0.7; // 0.7% per month after 65
    }
    
    const adjustedMonthlyBenefit = baseMonthlyBenefit * (1 + totalAdjustment / 100);
    const yearsReceiving = lifeExpectancy - startAge;
    const lifetimeValue = adjustedMonthlyBenefit * 12 * yearsReceiving;
    
    // Calculate break-even age (simplified)
    const standardLifetimeValue = baseMonthlyBenefit * 12 * (lifeExpectancy - 65);
    const breakEvenAge = startAge + (standardLifetimeValue / (adjustedMonthlyBenefit * 12));
    
    return {
      baseMonthlyBenefit,
      startAge,
      adjustedMonthlyBenefit,
      lifetimeValue,
      breakEvenAge: Math.round(breakEvenAge * 10) / 10,
      totalAdjustment
    };
  };

  const calculation = calculateCPP();

  const getScenarioColor = (scenarioId: string): string => {
    switch (scenarioId) {
      case 'early': return 'bg-red-100 text-red-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-green-100 text-green-800';
      case 'hybrid': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Optimisation du timing RRQ/CPP (60-70 ans)
          </CardTitle>
          <CardDescription>
            Stratégies avancées pour maximiser vos prestations du Régime de rentes du Québec et du Régime de pensions du Canada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Décision cruciale :</strong> Le timing de vos prestations RRQ/CPP peut représenter une différence 
              de plus de 100 000$ sur votre vie. Cette décision est permanente et irréversible dans la plupart des cas.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="scenarios" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="scenarios">Scénarios</TabsTrigger>
              <TabsTrigger value="calculator">Calculateur</TabsTrigger>
              <TabsTrigger value="decision">Aide à la décision</TabsTrigger>
              <TabsTrigger value="strategies">Stratégies avancées</TabsTrigger>
            </TabsList>

            <TabsContent value="scenarios" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {cppScenarios.map((scenario) => (
                  <Card 
                    key={scenario.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${selectedScenario === scenario.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedScenario(scenario.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span>{scenario.name}</span>
                        <Badge className={getScenarioColor(scenario.id)}>
                          {scenario.adjustmentRate > 0 ? '+' : ''}{scenario.adjustmentRate}%
                        </Badge>
                      </CardTitle>
                      <CardDescription>{scenario.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-2xl font-bold text-blue-600">
                            {scenario.monthlyBenefit.toLocaleString('fr-CA', {
                              style: 'currency',
                              currency: 'CAD',
                              maximumFractionDigits: 0
                            })}
                          </div>
                          <div className="text-sm text-gray-600">Mensuel</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-2xl font-bold text-green-600">
                            {scenario.lifetimeValue.toLocaleString('fr-CA', {
                              style: 'currency',
                              currency: 'CAD',
                              maximumFractionDigits: 0
                            })}
                          </div>
                          <div className="text-sm text-gray-600">Valeur vie</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-1">
                          Seuil de rentabilité : <span className="font-bold">{scenario.breakEvenAge} ans</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((scenario.breakEvenAge - 60) / 30 * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-green-700">Avantages :</h4>
                        <ul className="text-sm space-y-1">
                          {scenario.pros.slice(0, 2).map((pro, i) => (
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
                          {scenario.cons.slice(0, 2).map((con, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <AlertTriangle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Idéal pour :</h4>
                        <div className="flex flex-wrap gap-1">
                          {scenario.bestFor.slice(0, 2).map((best, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {best}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-800">Facteurs de décision clés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Espérance de vie :</h4>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Moins de 78 ans :</strong> Début précoce</li>
                        <li>• <strong>78-82 ans :</strong> Âge standard</li>
                        <li>• <strong>Plus de 82 ans :</strong> Report stratégique</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Situation financière :</h4>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Besoins immédiats :</strong> Début précoce</li>
                        <li>• <strong>Revenus suffisants :</strong> Report possible</li>
                        <li>• <strong>Optimisation fiscale :</strong> Timing stratégique</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Autres considérations :</h4>
                      <ul className="text-sm space-y-1">
                        <li>• État de santé actuel</li>
                        <li>• Historique familial de longévité</li>
                        <li>• Autres sources de revenus</li>
                        <li>• Objectifs de planification successorale</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calculator" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Calculateur de timing RRQ/CPP
                  </CardTitle>
                  <CardDescription>
                    Personnalisez vos paramètres pour voir l'impact du timing sur vos prestations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Prestation mensuelle de base à 65 ans ($)
                      </label>
                      <input
                        type="number"
                        value={calculationInputs.baseMonthlyBenefit}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          baseMonthlyBenefit: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="0"
                        step="50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Âge de début souhaité
                      </label>
                      <input
                        type="number"
                        value={calculationInputs.startAge}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          startAge: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="60"
                        max="70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Espérance de vie estimée
                      </label>
                      <input
                        type="number"
                        value={calculationInputs.lifeExpectancy}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          lifeExpectancy: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="70"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Taux d'inflation annuel (%)
                      </label>
                      <input
                        type="number"
                        value={calculationInputs.inflationRate}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          inflationRate: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="0"
                        max="10"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {calculation.adjustedMonthlyBenefit.toLocaleString('fr-CA', {
                            style: 'currency',
                            currency: 'CAD',
                            maximumFractionDigits: 0
                          })}
                        </div>
                        <div className="text-sm text-gray-600">Prestation mensuelle ajustée</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                          {calculation.lifetimeValue.toLocaleString('fr-CA', {
                            style: 'currency',
                            currency: 'CAD',
                            maximumFractionDigits: 0
                          })}
                        </div>
                        <div className="text-sm text-gray-600">Valeur totale à vie</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-purple-600">
                          {calculation.totalAdjustment > 0 ? '+' : ''}{calculation.totalAdjustment.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Ajustement total</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-orange-600">
                          {calculation.breakEvenAge}
                        </div>
                        <div className="text-sm text-gray-600">Âge de rentabilité</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Analyse :</strong> Avec vos paramètres, commencer à {calculation.startAge} ans vous donnerait{' '}
                      <strong>{calculation.adjustedMonthlyBenefit.toLocaleString('fr-CA', {
                        style: 'currency',
                        currency: 'CAD',
                        maximumFractionDigits: 0
                      })}</strong> par mois. Le seuil de rentabilité par rapport au début à 65 ans serait à{' '}
                      <strong>{calculation.breakEvenAge} ans</strong>.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="decision" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Aide à la décision personnalisée
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-green-800">Arguments pour le report (70 ans)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Longévité familiale :</strong> Parents/grands-parents ont vécu 85+ ans</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Excellente santé :</strong> Mode de vie sain, pas de problèmes majeurs</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Autres revenus :</strong> REER/FERR, pensions, revenus suffisants</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Optimisation fiscale :</strong> Stratégie de minimisation d'impôt</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Héritage :</strong> Maximiser les prestations pour le conjoint survivant</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-red-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-red-800">Arguments pour le début précoce (60 ans)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Santé précaire :</strong> Problèmes de santé ou espérance de vie réduite</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Besoins financiers :</strong> Revenus insuffisants, dettes importantes</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Cessation d'emploi :</strong> Perte d'emploi involontaire ou épuisement</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Sécurité :</strong> Préférence pour la certitude vs optimisation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Stratégie de pont :</strong> Utiliser RRQ/CPP pour préserver autres actifs</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-800">Questionnaire d'aide à la décision</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Évaluez votre situation :</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="health" className="rounded" />
                                <label htmlFor="health">Excellente santé et longévité familiale</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="income" className="rounded" />
                                <label htmlFor="income">Autres revenus suffisants jusqu'à 70 ans</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="optimize" className="rounded" />
                                <label htmlFor="optimize">Objectif d'optimisation à long terme</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="spouse" className="rounded" />
                                <label htmlFor="spouse">Conjoint bénéficierait des prestations maximisées</label>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Facteurs de risque :</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="health-risk" className="rounded" />
                                <label htmlFor="health-risk">Problèmes de santé significatifs</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="financial-need" className="rounded" />
                                <label htmlFor="financial-need">Besoins financiers immédiats</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="job-loss" className="rounded" />
                                <label htmlFor="job-loss">Perte d'emploi ou incapacité de travailler</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="security" className="rounded" />
                                <label htmlFor="security">Préférence pour la sécurité immédiate</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Recommandation générale :</strong> Si vous avez coché plus d'éléments dans la section 
                            "Évaluez votre situation", le report pourrait être avantageux. Si vous avez plus de "Facteurs de risque", 
                            un début plus précoce pourrait être approprié.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strategies" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Stratégies avancées de timing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-800">Stratégie du "Bridge"</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Utiliser les prestations RRQ/CPP précoces comme pont financier tout en préservant d'autres actifs.
                        </p>
                        <ul className="text-sm space-y-1">
                          <li>• Commencer RRQ/CPP à 60-62 ans</li>
                          <li>• Préserver REER/FERR pour plus tard</li>
                          <li>• Permettre croissance continue des investissements</li>
                          <li>• Réduire le stress financier de transition</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-green-800">Optimisation fiscale coordonnée</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Coordonner le timing RRQ/CPP avec d'autres stratégies fiscales pour minimiser l'impôt total.
                        </p>
                        <ul className="text-sm space-y-1">
                          <li>• Synchroniser avec fonte REER</li>
                          <li>• Utiliser fractionnement de pension à 65+</li>
                          <li>• Optimiser les tranches d'imposition</li>
                          <li>• Maximiser les crédits d'impôt disponibles</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-purple-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-purple-800">Stratégie de couple</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Optimiser le timing des deux conjoints pour maximiser les prestations familiales totales.
                        </p>
                        <ul className="text-sm space-y-1">
                          <li>• Échelonner les dates de début</li>
                          <li>• Considérer les différences d'âge</li>
                          <li>• Optimiser les prestations de survivant</li>
                          <li>• Coordonner avec autres revenus du couple</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-orange-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-orange-800">Stratégie de longévité</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Maximiser les prestations pour une retraite de 30+ ans en reportant au maximum.
                        </p>
                        <ul className="text-sm space-y-1">
                          <li>• Reporter jusqu'à 70 ans si possible</li>
                          <li>• Utiliser autres sources de revenus temporaires</li>
                          <li>• Maximiser les prestations indexées à vie</li>
                          <li>• Protéger contre l'inflation à long terme</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <DollarSign className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Conseil d'expert :</strong> La décision de timing RRQ/CPP devrait être intégrée dans une 
                      stratégie globale de retraite. Consultez un planificateur financier pour analyser votre situation 
                      complète et optimiser toutes vos sources de revenus ensemble.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CPPTimingOptimizationModule;
