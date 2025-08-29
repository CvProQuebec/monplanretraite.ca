import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Brain, TrendingDown, TrendingUp, Calendar, Target, AlertTriangle, CheckCircle, Info, Heart, Users } from 'lucide-react';

interface SpendingPhase {
  id: string;
  name: string;
  ageRange: string;
  description: string;
  spendingPattern: string;
  keyCharacteristics: string[];
  commonExpenses: string[];
  psychologicalFactors: string[];
  planningTips: string[];
}

interface SpendingBehavior {
  id: string;
  name: string;
  description: string;
  impact: 'Positif' | 'Négatif' | 'Neutre';
  frequency: string;
  solutions: string[];
}

const RetirementSpendingPsychologyModule: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<string>('go-go');
  const [selectedBehavior, setSelectedBehavior] = useState<string>('lifestyle-inflation');

  const spendingPhases: SpendingPhase[] = [
    {
      id: 'go-go',
      name: 'Phase "Go-Go" (65-75 ans)',
      ageRange: '65-75 ans',
      description: 'Période active de la retraite avec dépenses élevées pour les loisirs et voyages',
      spendingPattern: 'Dépenses élevées (100-110% du revenu pré-retraite)',
      keyCharacteristics: [
        'Santé généralement bonne',
        'Énergie et mobilité élevées',
        'Désir de réaliser des rêves reportés',
        'Adaptation à la nouvelle liberté'
      ],
      commonExpenses: [
        'Voyages et vacances prolongées',
        'Loisirs et hobbies coûteux',
        'Rénovations domiciliaires',
        'Cadeaux généreux aux enfants/petits-enfants',
        'Activités sociales et sorties fréquentes'
      ],
      psychologicalFactors: [
        'Euphorie de la liberté retrouvée',
        'Compensation pour années de travail',
        'Peur de manquer des opportunités',
        'Besoin de validation sociale'
      ],
      planningTips: [
        'Budgétiser les "rêves de retraite"',
        'Établir des limites de dépenses claires',
        'Prioriser les expériences les plus importantes',
        'Considérer l\'impact sur les phases suivantes'
      ]
    },
    {
      id: 'slow-go',
      name: 'Phase "Slow-Go" (75-85 ans)',
      ageRange: '75-85 ans',
      description: 'Ralentissement des activités avec dépenses modérées mais coûts de santé croissants',
      spendingPattern: 'Dépenses modérées (80-90% du revenu pré-retraite)',
      keyCharacteristics: [
        'Réduction de la mobilité',
        'Préférences pour activités locales',
        'Augmentation des besoins de santé',
        'Recherche de confort et sécurité'
      ],
      commonExpenses: [
        'Soins de santé et médicaments',
        'Services d\'aide à domicile',
        'Adaptations du domicile',
        'Transport adapté ou taxi',
        'Activités de proximité'
      ],
      psychologicalFactors: [
        'Acceptation des limitations physiques',
        'Valorisation du confort et de la routine',
        'Préoccupations croissantes pour la santé',
        'Désir de maintenir l\'indépendance'
      ],
      planningTips: [
        'Prévoir l\'augmentation des coûts de santé',
        'Planifier les adaptations domiciliaires',
        'Considérer les services de soutien',
        'Maintenir un budget flexible pour les urgences'
      ]
    },
    {
      id: 'no-go',
      name: 'Phase "No-Go" (85+ ans)',
      ageRange: '85+ ans',
      description: 'Période de dépendance avec dépenses concentrées sur les soins et le confort',
      spendingPattern: 'Dépenses ciblées (60-80% du revenu pré-retraite)',
      keyCharacteristics: [
        'Mobilité très limitée',
        'Besoins de soins constants',
        'Simplification du mode de vie',
        'Focus sur les besoins essentiels'
      ],
      commonExpenses: [
        'Soins de longue durée',
        'Résidence assistée ou CHSLD',
        'Soins médicaux spécialisés',
        'Services personnels',
        'Besoins de base simplifiés'
      ],
      psychologicalFactors: [
        'Acceptation de la dépendance',
        'Valorisation des relations familiales',
        'Préoccupations pour l\'héritage',
        'Recherche de dignité et respect'
      ],
      planningTips: [
        'Prévoir les coûts de soins de longue durée',
        'Planifier les directives de soins',
        'Organiser la succession',
        'Assurer la qualité de vie malgré les limitations'
      ]
    }
  ];

  const spendingBehaviors: SpendingBehavior[] = [
    {
      id: 'lifestyle-inflation',
      name: 'Inflation du mode de vie',
      description: 'Tendance à augmenter les dépenses avec l\'augmentation des revenus ou la liberté de temps',
      impact: 'Négatif',
      frequency: 'Très fréquent',
      solutions: [
        'Établir un budget strict dès le début de la retraite',
        'Automatiser les épargnes et investissements',
        'Réviser régulièrement les dépenses',
        'Se fixer des objectifs financiers clairs'
      ]
    },
    {
      id: 'loss-aversion',
      name: 'Aversion aux pertes',
      description: 'Réticence excessive à dépenser le capital accumulé, même quand c\'est approprié',
      impact: 'Négatif',
      frequency: 'Fréquent',
      solutions: [
        'Créer un plan de décaissement structuré',
        'Séparer les fonds d\'urgence des fonds de dépenses',
        'Utiliser la règle des "buckets" temporels',
        'Consulter un conseiller pour validation'
      ]
    },
    {
      id: 'anchoring-bias',
      name: 'Biais d\'ancrage',
      description: 'Fixation sur le revenu pré-retraite comme référence pour toutes les dépenses',
      impact: 'Neutre',
      frequency: 'Très fréquent',
      solutions: [
        'Recalculer les besoins réels de retraite',
        'Considérer les changements de mode de vie',
        'Ajuster les attentes selon la nouvelle réalité',
        'Focus sur la qualité de vie plutôt que le montant'
      ]
    },
    {
      id: 'mental-accounting',
      name: 'Comptabilité mentale',
      description: 'Traitement différent de l\'argent selon sa source (pension vs épargne vs héritage)',
      impact: 'Neutre',
      frequency: 'Fréquent',
      solutions: [
        'Adopter une vision globale du patrimoine',
        'Optimiser fiscalement toutes les sources',
        'Éviter les silos de gestion',
        'Prioriser l\'efficacité globale'
      ]
    },
    {
      id: 'social-comparison',
      name: 'Comparaison sociale',
      description: 'Ajustement des dépenses basé sur le mode de vie des pairs plutôt que sur ses moyens',
      impact: 'Négatif',
      frequency: 'Fréquent',
      solutions: [
        'Se concentrer sur ses propres objectifs',
        'Éviter les discussions financières comparatives',
        'Valoriser ses propres priorités',
        'Chercher des groupes avec valeurs similaires'
      ]
    },
    {
      id: 'present-bias',
      name: 'Biais du présent',
      description: 'Survalorisation des plaisirs immédiats au détriment de la sécurité future',
      impact: 'Négatif',
      frequency: 'Modéré',
      solutions: [
        'Automatiser les épargnes futures',
        'Visualiser les conséquences à long terme',
        'Créer des récompenses pour la discipline',
        'Utiliser des outils de planification visuelle'
      ]
    }
  ];

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'Positif': return 'bg-green-100 text-green-800';
      case 'Négatif': return 'bg-red-100 text-red-800';
      case 'Neutre': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseColor = (phaseId: string): string => {
    switch (phaseId) {
      case 'go-go': return 'bg-green-100 text-green-800';
      case 'slow-go': return 'bg-yellow-100 text-yellow-800';
      case 'no-go': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Psychologie des dépenses de retraite
          </CardTitle>
          <CardDescription>
            Comprendre les comportements financiers et les phases de dépenses pour une retraite équilibrée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Insight comportemental :</strong> Les habitudes de dépenses évoluent significativement 
              durant la retraite. Comprendre ces changements psychologiques permet une meilleure planification 
              financière et une retraite plus épanouissante.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="phases" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="phases">Phases de dépenses</TabsTrigger>
              <TabsTrigger value="behaviors">Biais comportementaux</TabsTrigger>
              <TabsTrigger value="strategies">Stratégies d'adaptation</TabsTrigger>
              <TabsTrigger value="tools">Outils pratiques</TabsTrigger>
            </TabsList>

            <TabsContent value="phases" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {spendingPhases.map((phase) => (
                  <Card 
                    key={phase.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${selectedPhase === phase.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedPhase(phase.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span>{phase.name}</span>
                        <Badge className={getPhaseColor(phase.id)}>
                          {phase.ageRange}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{phase.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded">
                        <div className="font-medium text-blue-800 text-sm">Pattern de dépenses</div>
                        <div className="text-sm">{phase.spendingPattern}</div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Caractéristiques clés :</h4>
                        <ul className="text-sm space-y-1">
                          {phase.keyCharacteristics.slice(0, 2).map((char, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{char}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Dépenses typiques :</h4>
                        <div className="flex flex-wrap gap-1">
                          {phase.commonExpenses.slice(0, 3).map((expense, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {expense}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Facteurs psychologiques :</h4>
                        <ul className="text-sm space-y-1">
                          {phase.psychologicalFactors.slice(0, 2).map((factor, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Brain className="h-3 w-3 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="text-lg">Évolution des dépenses par phase</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">105%</div>
                        <div className="text-sm text-gray-600">Go-Go (65-75)</div>
                        <div className="text-xs">du revenu pré-retraite</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-600">85%</div>
                        <div className="text-sm text-gray-600">Slow-Go (75-85)</div>
                        <div className="text-xs">du revenu pré-retraite</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">70%</div>
                        <div className="text-sm text-gray-600">No-Go (85+)</div>
                        <div className="text-xs">du revenu pré-retraite</div>
                      </div>
                    </div>
                    
                    <Alert>
                      <TrendingDown className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Tendance générale :</strong> Les dépenses diminuent avec l'âge, mais la composition 
                        change drastiquement. Les coûts de santé augmentent tandis que les dépenses discrétionnaires diminuent.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behaviors" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {spendingBehaviors.map((behavior) => (
                  <Card 
                    key={behavior.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${selectedBehavior === behavior.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedBehavior(behavior.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span>{behavior.name}</span>
                        <div className="flex gap-2">
                          <Badge className={getImpactColor(behavior.impact)}>
                            {behavior.impact}
                          </Badge>
                          <Badge variant="outline">
                            {behavior.frequency}
                          </Badge>
                        </div>
                      </CardTitle>
                      <CardDescription>{behavior.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-green-700">Solutions recommandées :</h4>
                        <ul className="text-sm space-y-1">
                          {behavior.solutions.map((solution, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{solution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-800">Auto-évaluation comportementale</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      Identifiez vos propres biais pour mieux les gérer :
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Questions de réflexion :</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="spending-increase" className="rounded" />
                            <label htmlFor="spending-increase">Mes dépenses ont augmenté depuis la retraite</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="reluctant-spend" className="rounded" />
                            <label htmlFor="reluctant-spend">J'ai du mal à dépenser mon capital</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="compare-others" className="rounded" />
                            <label htmlFor="compare-others">Je compare mes dépenses à celles d'autres retraités</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="immediate-pleasure" className="rounded" />
                            <label htmlFor="immediate-pleasure">Je privilégie les plaisirs immédiats</label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Signaux d'alarme :</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Dépenses impulsives fréquentes</li>
                          <li>• Évitement des décisions financières</li>
                          <li>• Stress constant lié à l'argent</li>
                          <li>• Regrets fréquents sur les dépenses</li>
                          <li>• Difficultés à respecter le budget</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strategies" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">Stratégies pour la phase Go-Go</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Budget "rêves" :</strong> Allouer 10-15% pour les expériences spéciales</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Règle des 6 mois :</strong> Attendre 6 mois avant les gros achats</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Priorisation :</strong> Lister et classer les "rêves de retraite"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Révision trimestrielle :</strong> Ajuster selon les dépenses réelles</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-800">Stratégies pour la phase Slow-Go</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Fonds santé :</strong> Réserver 20-25% pour les coûts médicaux</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Adaptations préventives :</strong> Investir dans le confort domiciliaire</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Services graduels :</strong> Introduire l'aide progressivement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Réseau social :</strong> Maintenir les connexions locales</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-800">Stratégies pour la phase No-Go</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Soins de qualité :</strong> Prioriser le confort et la dignité</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Planification familiale :</strong> Impliquer les proches dans les décisions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Directives claires :</strong> Documenter les préférences de soins</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Héritage organisé :</strong> Finaliser la planification successorale</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Stratégies générales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Flexibilité budgétaire :</strong> Ajuster selon les phases de vie</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Communication ouverte :</strong> Discuter avec famille et conseillers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Révisions régulières :</strong> Adapter aux changements de situation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Équilibre vie-argent :</strong> Prioriser le bien-être global</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Outil de budgétisation par phases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium">Catégorie</div>
                        <div className="font-medium">Go-Go %</div>
                        <div className="font-medium">Slow-Go %</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>Logement</div>
                        <div>25%</div>
                        <div>30%</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>Santé</div>
                        <div>15%</div>
                        <div>25%</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>Loisirs/Voyages</div>
                        <div>25%</div>
                        <div>15%</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>Nourriture</div>
                        <div>15%</div>
                        <div>15%</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>Transport</div>
                        <div>10%</div>
                        <div>8%</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>Autres</div>
                        <div>10%</div>
                        <div>7%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Checklist de préparation psychologique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Avant la retraite :</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="budget-prep" className="rounded" />
                            <label htmlFor="budget-prep">Établir un budget de transition</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="dream-list" className="rounded" />
                            <label htmlFor="dream-list">Lister les "rêves de retraite"</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="health-plan" className="rounded" />
                            <label htmlFor="health-plan">Planifier les coûts de santé</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Pendant la retraite :</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="monthly-review" className="rounded" />
                            <label htmlFor="monthly-review">Révision mensuelle des dépenses</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="phase-adjust" className="rounded" />
                            <label htmlFor="phase-adjust">Ajuster selon la phase de vie</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="emergency-fund" className="rounded" />
                            <label htmlFor="emergency-fund">Maintenir un fonds d'urgence</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Heart className="h-4 w-4" />
                <AlertDescription>
                  <strong>Rappel important :</strong> La retraite est un voyage, pas une destination. 
                  Restez flexible, communiquez avec vos proches, et n'hésitez pas à ajuster votre 
                  approche selon l'évolution de vos besoins et désirs.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RetirementSpendingPsychologyModule;
