import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import GuidedPageIntro from './GuidedPageIntro';
import NextStepPanel from './NextStepPanel';
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
      name: 'DÃ©but prÃ©coce (60 ans)',
      description: 'Commencer les prestations RRQ/CPP dÃ¨s 60 ans avec rÃ©duction permanente',
      startAge: 60,
      adjustmentRate: -36,
      monthlyBenefit: 768, // 64% of full benefit
      lifetimeValue: 230400, // Assuming 25 years
      breakEvenAge: 74,
      pros: [
        'LiquiditÃ©s immÃ©diates disponibles',
        'SÃ©curitÃ© de recevoir des prestations',
        'Utile si santÃ© prÃ©caire ou besoins financiers urgents',
        'Permet de diffÃ©rer autres sources de revenus'
      ],
      cons: [
        'RÃ©duction permanente de 36% des prestations',
        'Perte significative de revenus Ã  long terme',
        'Impact nÃ©gatif si longÃ©vitÃ© Ã©levÃ©e',
        'Moins avantageux fiscalement'
      ],
      bestFor: [
        'Personnes avec espÃ©rance de vie rÃ©duite',
        'Besoins financiers immÃ©diats critiques',
        'StratÃ©gie de pont vers autres revenus',
        'Risque de changements futurs des programmes'
      ]
    },
    {
      id: 'standard',
      name: 'Ã‚ge standard (65 ans)',
      description: 'Commencer les prestations Ã  l\'Ã¢ge normal de retraite sans ajustement',
      startAge: 65,
      adjustmentRate: 0,
      monthlyBenefit: 1200, // 100% of full benefit
      lifetimeValue: 240000, // Assuming 20 years
      breakEvenAge: 65,
      pros: [
        'Prestations complÃ¨tes sans rÃ©duction',
        'Ã‚ge traditionnel de retraite',
        'Ã‰quilibre entre sÃ©curitÃ© et optimisation',
        'Coordination naturelle avec autres programmes'
      ],
      cons: [
        'Pas d\'optimisation pour longÃ©vitÃ© Ã©levÃ©e',
        'OpportunitÃ© manquÃ©e d\'augmentation',
        'Peut ne pas Ãªtre optimal selon la situation'
      ],
      bestFor: [
        'EspÃ©rance de vie moyenne (80-85 ans)',
        'Besoins de revenus immÃ©diats modÃ©rÃ©s',
        'Approche conservatrice et traditionnelle',
        'Coordination avec cessation d\'emploi'
      ]
    },
    {
      id: 'delayed',
      name: 'Report stratÃ©gique (70 ans)',
      description: 'Reporter les prestations jusqu\'Ã  70 ans pour maximiser les montants',
      startAge: 70,
      adjustmentRate: 42,
      monthlyBenefit: 1704, // 142% of full benefit
      lifetimeValue: 255600, // Assuming 15 years
      breakEvenAge: 82,
      pros: [
        'Augmentation permanente de 42% des prestations',
        'Optimisation pour longÃ©vitÃ© Ã©levÃ©e',
        'Revenus de retraite maximisÃ©s',
        'Avantage fiscal potentiel'
      ],
      cons: [
        'Aucune prestation pendant 5 annÃ©es critiques',
        'Risque si dÃ©cÃ¨s prÃ©maturÃ©',
        'NÃ©cessite autres sources de revenus',
        'ComplexitÃ© de planification'
      ],
      bestFor: [
        'EspÃ©rance de vie Ã©levÃ©e (85+ ans)',
        'Autres sources de revenus suffisantes',
        'Optimisation fiscale avancÃ©e',
        'Maximisation du patrimoine familial'
      ]
    },
    {
      id: 'hybrid',
      name: 'StratÃ©gie hybride (67-68 ans)',
      description: 'Compromis entre sÃ©curitÃ© et optimisation avec dÃ©but modÃ©rÃ©ment diffÃ©rÃ©',
      startAge: 67,
      adjustmentRate: 16.8,
      monthlyBenefit: 1402, // 116.8% of full benefit
      lifetimeValue: 252360, // Assuming 18 years
      breakEvenAge: 78,
      pros: [
        'Augmentation significative des prestations',
        'Ã‰quilibre risque/rendement optimal',
        'PÃ©riode d\'attente raisonnable',
        'FlexibilitÃ© de planification'
      ],
      cons: [
        'Pas d\'optimisation maximale',
        'Toujours un risque de longÃ©vitÃ©',
        'ComplexitÃ© de timing'
      ],
      bestFor: [
        'Approche Ã©quilibrÃ©e et pragmatique',
        'EspÃ©rance de vie lÃ©gÃ¨rement supÃ©rieure Ã  la moyenne',
        'Revenus de transition disponibles',
        'Optimisation modÃ©rÃ©e souhaitÃ©e'
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
      <GuidedPageIntro
        eyebrow="RRQ et CPP"
        title="RRQ ou CPP : faut-il commencer à 60, 65 ou 70 ans ?"
        description="Cette page vous aide à comparer un début à 60, 65 ou 70 ans. Commencez par une estimation réaliste de votre rente à 65 ans, puis comparez l’effet sur vos revenus mensuels et sur votre revenu à vie."
        bullets={[
          'Commencez par votre montant estimÃ© Ã  65 ans.',
          'Comparez ensuite les scÃ©narios 60, 65 et 70 ans.',
          'Terminez en ajoutant cette dÃ©cision Ã  votre dossier retraite.',
        ]}
        primaryLink={{ label: 'PrÃ©parer mon dossier', href: '/mon-dossier' }}
        secondaryLink={{ label: 'Voir tous les outils', href: '/outils#revenus' }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Simulateur RRQ et CPP : comparer 60, 65 ou 70 ans
          </CardTitle>
          <CardDescription>
            Comparez simplement un début à 60, 65 ou 70 ans pour voir l'effet sur votre revenu mensuel et sur votre revenu à vie.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>DÃ©cision cruciale :</strong> Le timing de vos prestations RRQ/CPP peut reprÃ©senter une diffÃ©rence 
              de plus de 100 000$ sur votre vie. Cette dÃ©cision est permanente et irrÃ©versible dans la plupart des cas.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="scenarios" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="scenarios">Comparer les âges</TabsTrigger>
              <TabsTrigger value="calculator">Mes chiffres</TabsTrigger>
              <TabsTrigger value="decision">M'aider à choisir</TabsTrigger>
              <TabsTrigger value="strategies">Cas fréquents</TabsTrigger>
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
                          Seuil de rentabilitÃ© : <span className="font-bold">{scenario.breakEvenAge} ans</span>
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
                        <h4 className="font-semibold text-sm mb-2 text-red-700">InconvÃ©nients :</h4>
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
                        <h4 className="font-semibold text-sm mb-2">IdÃ©al pour :</h4>
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
                  <CardTitle className="text-lg text-yellow-800">Facteurs de dÃ©cision clÃ©s</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">EspÃ©rance de vie :</h4>
                      <ul className="text-sm space-y-1">
                        <li>â€¢ <strong>Moins de 78 ans :</strong> DÃ©but prÃ©coce</li>
                        <li>â€¢ <strong>78-82 ans :</strong> Ã‚ge standard</li>
                        <li>â€¢ <strong>Plus de 82 ans :</strong> Report stratÃ©gique</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Situation financiÃ¨re :</h4>
                      <ul className="text-sm space-y-1">
                        <li>â€¢ <strong>Besoins immÃ©diats :</strong> DÃ©but prÃ©coce</li>
                        <li>â€¢ <strong>Revenus suffisants :</strong> Report possible</li>
                        <li>â€¢ <strong>Optimisation fiscale :</strong> Timing stratÃ©gique</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Autres considÃ©rations :</h4>
                      <ul className="text-sm space-y-1">
                        <li>â€¢ Ã‰tat de santÃ© actuel</li>
                        <li>â€¢ Historique familial de longÃ©vitÃ©</li>
                        <li>â€¢ Autres sources de revenus</li>
                        <li>â€¢ Objectifs de planification successorale</li>
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
                    Mes chiffres de timing RRQ/CPP
                  </CardTitle>
                  <CardDescription>
                    Entrez votre montant estimé et voyez ce que change un début plus tôt ou plus tard.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Prestation mensuelle de base Ã  65 ans ($)
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
                        Ã‚ge de dÃ©but souhaitÃ©
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
                        EspÃ©rance de vie estimÃ©e
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
                        <div className="text-sm text-gray-600">Prestation mensuelle ajustÃ©e</div>
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
                        <div className="text-sm text-gray-600">Valeur totale Ã  vie</div>
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
                        <div className="text-sm text-gray-600">Ã‚ge de rentabilitÃ©</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Analyse :</strong> Avec vos paramÃ¨tres, commencer Ã  {calculation.startAge} ans vous donnerait{' '}
                      <strong>{calculation.adjustedMonthlyBenefit.toLocaleString('fr-CA', {
                        style: 'currency',
                        currency: 'CAD',
                        maximumFractionDigits: 0
                      })}</strong> par mois. Le seuil de rentabilitÃ© par rapport au dÃ©but Ã  65 ans serait Ã {' '}
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
                    M'aider à choisir
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
                            <span><strong>LongÃ©vitÃ© familiale :</strong> Parents/grands-parents ont vÃ©cu 85+ ans</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Excellente santÃ© :</strong> Mode de vie sain, pas de problÃ¨mes majeurs</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Autres revenus :</strong> REER/FERR, pensions, revenus suffisants</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Optimisation fiscale :</strong> StratÃ©gie de minimisation d'impÃ´t</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>HÃ©ritage :</strong> Maximiser les prestations pour le conjoint survivant</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-red-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-red-800">Arguments pour le dÃ©but prÃ©coce (60 ans)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span><strong>SantÃ© prÃ©caire :</strong> ProblÃ¨mes de santÃ© ou espÃ©rance de vie rÃ©duite</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Besoins financiers :</strong> Revenus insuffisants, dettes importantes</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Cessation d'emploi :</strong> Perte d'emploi involontaire ou Ã©puisement</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span><strong>SÃ©curitÃ© :</strong> PrÃ©fÃ©rence pour la certitude vs optimisation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span><strong>StratÃ©gie de pont :</strong> Utiliser RRQ/CPP pour prÃ©server autres actifs</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-800">Petit repère pour vous orienter</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Ã‰valuez votre situation :</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="health" className="rounded" />
                                <label htmlFor="health">Excellente santÃ© et longÃ©vitÃ© familiale</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="income" className="rounded" />
                                <label htmlFor="income">Autres revenus suffisants jusqu'Ã  70 ans</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="optimize" className="rounded" />
                                <label htmlFor="optimize">Objectif d'optimisation Ã  long terme</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="spouse" className="rounded" />
                                <label htmlFor="spouse">Conjoint bÃ©nÃ©ficierait des prestations maximisÃ©es</label>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Facteurs de risque :</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="health-risk" className="rounded" />
                                <label htmlFor="health-risk">ProblÃ¨mes de santÃ© significatifs</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="financial-need" className="rounded" />
                                <label htmlFor="financial-need">Besoins financiers immÃ©diats</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="job-loss" className="rounded" />
                                <label htmlFor="job-loss">Perte d'emploi ou incapacitÃ© de travailler</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="security" className="rounded" />
                                <label htmlFor="security">PrÃ©fÃ©rence pour la sÃ©curitÃ© immÃ©diate</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Repère simple :</strong> Si vous vous reconnaissez surtout dans les éléments en faveur du report, attendre peut être logique. Si les besoins immédiats et les risques dominent, un début plus tôt peut mieux convenir.
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
                    Cas fréquents de timing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-800">StratÃ©gie du "Bridge"</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Utiliser les prestations RRQ/CPP prÃ©coces comme pont financier tout en prÃ©servant d'autres actifs.
                        </p>
                        <ul className="text-sm space-y-1">
                          <li>â€¢ Commencer RRQ/CPP Ã  60-62 ans</li>
                          <li>â€¢ PrÃ©server REER/FERR pour plus tard</li>
                          <li>â€¢ Permettre croissance continue des investissements</li>
                          <li>â€¢ RÃ©duire le stress financier de transition</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-green-800">Optimisation fiscale coordonnÃ©e</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Coordonner le timing RRQ/CPP avec d'autres stratÃ©gies fiscales pour minimiser l'impÃ´t total.
                        </p>
                        <ul className="text-sm space-y-1">
                          <li>â€¢ Synchroniser avec fonte REER</li>
                          <li>â€¢ Utiliser fractionnement de pension Ã  65+</li>
                          <li>â€¢ Optimiser les tranches d'imposition</li>
                          <li>â€¢ Maximiser les crÃ©dits d'impÃ´t disponibles</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-purple-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-purple-800">StratÃ©gie de couple</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Optimiser le timing des deux conjoints pour maximiser les prestations familiales totales.
                        </p>
                        <ul className="text-sm space-y-1">
                          <li>â€¢ Ã‰chelonner les dates de dÃ©but</li>
                          <li>â€¢ ConsidÃ©rer les diffÃ©rences d'Ã¢ge</li>
                          <li>â€¢ Optimiser les prestations de survivant</li>
                          <li>â€¢ Coordonner avec autres revenus du couple</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-orange-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-orange-800">StratÃ©gie de longÃ©vitÃ©</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Maximiser les prestations pour une retraite de 30+ ans en reportant au maximum.
                        </p>
                        <ul className="text-sm space-y-1">
                          <li>â€¢ Reporter jusqu'Ã  70 ans si possible</li>
                          <li>â€¢ Utiliser autres sources de revenus temporaires</li>
                          <li>â€¢ Maximiser les prestations indexÃ©es Ã  vie</li>
                          <li>â€¢ ProtÃ©ger contre l'inflation Ã  long terme</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <DollarSign className="h-4 w-4" />
                    <AlertDescription>
                      <strong>À retenir :</strong> Le bon âge dépend rarement d'un seul chiffre. L'idéal est de relier cette décision à vos autres revenus, à vos retraits et à votre situation de couple.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <NextStepPanel
            title="Prochaine Ã©tape"
            text="Quand vous avez une idÃ©e du meilleur Ã¢ge pour demander votre RRQ, ajoutez cette dÃ©cision Ã  votre dossier et vÃ©rifiez ensuite son impact sur vos retraits et votre impÃ´t."
            primaryLabel="PrÃ©parer mon dossier"
            primaryHref="/mon-dossier"
            secondaryLabel="Voir les outils fiscaux"
            secondaryHref="/outils#impots"
          />
          <p className="mt-6 text-sm leading-6" style={{ color: '#64748b' }}>
            Ces outils sont fournis Ã  titre Ã©ducatif uniquement et ne constituent pas des conseils financiers, fiscaux ou juridiques. Les projections sont basÃ©es sur des hypothÃ¨ses et ne garantissent pas les rÃ©sultats futurs. Consultez un planificateur financier agrÃ©Ã© pour des conseils adaptÃ©s Ã  votre situation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CPPTimingOptimizationModule;


