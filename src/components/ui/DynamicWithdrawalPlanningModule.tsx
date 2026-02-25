import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { TrendingUp, Calculator, BarChart3, Calendar, Target, AlertTriangle, CheckCircle, Info, DollarSign, Activity } from 'lucide-react';

interface WithdrawalStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'Conservateur' | 'Modéré' | 'Agressif';
  complexity: 'Simple' | 'Intermédiaire' | 'Avancé';
  marketDependency: 'Faible' | 'Modérée' | 'Élevée';
  pros: string[];
  cons: string[];
  bestFor: string[];
  implementation: string[];
}

interface CashFlowBuffer {
  id: string;
  name: string;
  duration: string;
  amount: number;
  purpose: string;
  replenishment: string;
  advantages: string[];
}

const DynamicWithdrawalPlanningModule: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('bucket-strategy');
  const [selectedBuffer, setSelectedBuffer] = useState<string>('emergency-buffer');
  const [calculationInputs, setCalculationInputs] = useState({
    portfolioValue: 1000000,
    annualExpenses: 60000,
    safeWithdrawalRate: 4.0,
    inflationRate: 2.5,
    expectedReturn: 6.0,
    cashBufferMonths: 24
  });

  const withdrawalStrategies: WithdrawalStrategy[] = [
    {
      id: 'bucket-strategy',
      name: 'Stratégie des "Buckets" (Seaux)',
      description: 'Division du portefeuille en plusieurs "seaux" selon l\'horizon temporel des besoins',
      riskLevel: 'Modéré',
      complexity: 'Intermédiaire',
      marketDependency: 'Modérée',
      pros: [
        'Sécurité psychologique avec liquidités visibles',
        'Protection contre la volatilité à court terme',
        'Flexibilité d\'ajustement selon les marchés',
        'Approche intuitive et facile à comprendre'
      ],
      cons: [
        'Peut être sous-optimal fiscalement',
        'Nécessite rééquilibrage régulier',
        'Complexité de gestion de multiples comptes',
        'Risque de sur-allocation en liquidités'
      ],
      bestFor: [
        'Retraités récents (65-70 ans)',
        'Personnes anxieuses face à la volatilité',
        'Portefeuilles de taille moyenne à élevée',
        'Ceux qui préfèrent une approche structurée'
      ],
      implementation: [
        'Seau 1: 1-2 ans de dépenses en liquidités',
        'Seau 2: 3-10 ans en obligations et revenus fixes',
        'Seau 3: 10+ ans en actions pour croissance',
        'Révision annuelle et rééquilibrage'
      ]
    },
    {
      id: 'dynamic-withdrawal',
      name: 'Retrait dynamique basé sur les marchés',
      description: 'Ajustement des retraits selon la performance des marchés et la valorisation',
      riskLevel: 'Agressif',
      complexity: 'Avancé',
      marketDependency: 'Élevée',
      pros: [
        'Optimisation selon les conditions de marché',
        'Potentiel de préservation du capital',
        'Adaptation aux cycles économiques',
        'Maximisation des rendements à long terme'
      ],
      cons: [
        'Revenus imprévisibles et variables',
        'Complexité de calcul et de suivi',
        'Stress psychologique des ajustements',
        'Nécessite expertise financière'
      ],
      bestFor: [
        'Investisseurs expérimentés',
        'Portefeuilles importants avec marge',
        'Personnes flexibles sur les dépenses',
        'Ceux qui comprennent les cycles de marché'
      ],
      implementation: [
        'Établir taux de base (ex: 4%)',
        'Ajuster selon valorisation (P/E, CAPE)',
        'Réduire en marchés surévalués',
        'Augmenter en marchés sous-évalués'
      ]
    },
    {
      id: 'floor-ceiling',
      name: 'Stratégie plancher-plafond',
      description: 'Définition d\'un revenu minimum garanti avec potentiel de hausse',
      riskLevel: 'Conservateur',
      complexity: 'Intermédiaire',
      marketDependency: 'Faible',
      pros: [
        'Sécurité du revenu minimum garanti',
        'Potentiel d\'amélioration en bons marchés',
        'Réduction de l\'anxiété financière',
        'Planification budgétaire facilitée'
      ],
      cons: [
        'Coût des garanties (assurances, rentes)',
        'Rendements potentiellement limités',
        'Complexité des produits d\'assurance',
        'Moins de flexibilité'
      ],
      bestFor: [
        'Retraités conservateurs',
        'Ceux avec peu d\'autres revenus garantis',
        'Personnes âgées (75+ ans)',
        'Situations de santé précaire'
      ],
      implementation: [
        'Plancher: Rentes ou obligations garanties',
        'Plafond: Portion en actions pour croissance',
        'Révision périodique des allocations',
        'Ajustement selon l\'âge et les besoins'
      ]
    },
    {
      id: 'total-return',
      name: 'Approche rendement total',
      description: 'Focus sur le rendement total du portefeuille plutôt que sur les dividendes',
      riskLevel: 'Modéré',
      complexity: 'Simple',
      marketDependency: 'Modérée',
      pros: [
        'Optimisation fiscale des gains en capital',
        'Flexibilité dans le choix des ventes',
        'Diversification maximale possible',
        'Simplicité de mise en œuvre'
      ],
      cons: [
        'Nécessite discipline pour les ventes',
        'Peut créer de l\'anxiété (vendre du capital)',
        'Timing des ventes peut être sous-optimal',
        'Moins prévisible que les dividendes'
      ],
      bestFor: [
        'Investisseurs disciplinés',
        'Ceux qui comprennent l\'efficacité fiscale',
        'Portefeuilles diversifiés',
        'Personnes à l\'aise avec la volatilité'
      ],
      implementation: [
        'Construire portefeuille diversifié',
        'Vendre périodiquement pour besoins',
        'Prioriser gains en capital vs dividendes',
        'Rééquilibrer lors des ventes'
      ]
    }
  ];

  const cashFlowBuffers: CashFlowBuffer[] = [
    {
      id: 'emergency-buffer',
      name: 'Tampon d\'urgence (12 mois)',
      duration: '12 mois',
      amount: calculationInputs.annualExpenses,
      purpose: 'Couvrir les dépenses essentielles en cas de crise majeure',
      replenishment: 'Reconstituer dès que possible après utilisation',
      advantages: [
        'Sécurité psychologique maximale',
        'Protection contre tous types de crises',
        'Évite les ventes forcées en mauvais marchés'
      ]
    },
    {
      id: 'market-buffer',
      name: 'Tampon de marché (24 mois)',
      duration: '24 mois',
      amount: calculationInputs.annualExpenses * 2,
      purpose: 'Éviter les retraits pendant les corrections de marché',
      replenishment: 'Reconstituer pendant les marchés haussiers',
      advantages: [
        'Protection contre la séquence des rendements',
        'Permet d\'attendre la récupération des marchés',
        'Réduit l\'impact des corrections sur le portefeuille'
      ]
    },
    {
      id: 'opportunity-buffer',
      name: 'Tampon d\'opportunité (6 mois)',
      duration: '6 mois',
      amount: calculationInputs.annualExpenses * 0.5,
      purpose: 'Financer les opportunités spéciales sans affecter les investissements',
      replenishment: 'Reconstituer selon les priorités',
      advantages: [
        'Flexibilité pour les dépenses imprévues positives',
        'Évite de perturber la stratégie d\'investissement',
        'Permet de saisir les opportunités de vie'
      ]
    }
  ];

  const calculateWithdrawal = () => {
    const { portfolioValue, safeWithdrawalRate, cashBufferMonths, annualExpenses } = calculationInputs;
    const annualWithdrawal = (portfolioValue * safeWithdrawalRate) / 100;
    const monthlyWithdrawal = annualWithdrawal / 12;
    const cashBuffer = (annualExpenses * cashBufferMonths) / 12;
    const investedAmount = portfolioValue - cashBuffer;
    const withdrawalRate = (annualWithdrawal / portfolioValue) * 100;

    return {
      annualWithdrawal,
      monthlyWithdrawal,
      cashBuffer,
      investedAmount,
      withdrawalRate
    };
  };

  const calculation = calculateWithdrawal();

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'Conservateur': return 'bg-green-100 text-green-800';
      case 'Modéré': return 'bg-yellow-100 text-yellow-800';
      case 'Agressif': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string): string => {
    switch (complexity) {
      case 'Simple': return 'bg-mpr-interactive-lt text-mpr-navy';
      case 'Intermédiaire': return 'bg-purple-100 text-purple-800';
      case 'Avancé': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Planification dynamique des retraits
          </CardTitle>
          <CardDescription>
            Stratégies avancées pour optimiser les retraits de retraite selon les conditions de marché et les besoins personnels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Approche moderne :</strong> La planification dynamique des retraits va au-delà de la règle 
              des 4% traditionnelle en s'adaptant aux conditions de marché, à l'inflation et aux besoins changeants 
              pour optimiser la durabilité du portefeuille.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="strategies" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="strategies">Stratégies</TabsTrigger>
              <TabsTrigger value="buffers">Tampons de liquidité</TabsTrigger>
              <TabsTrigger value="calculator">Calculateur</TabsTrigger>
              <TabsTrigger value="implementation">Mise en œuvre</TabsTrigger>
            </TabsList>

            <TabsContent value="strategies" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {withdrawalStrategies.map((strategy) => (
                  <Card 
                    key={strategy.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${selectedStrategy === strategy.id ? 'ring-2 ring-mpr-interactive' : ''}`}
                    onClick={() => setSelectedStrategy(strategy.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <CardDescription>{strategy.description}</CardDescription>
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={getRiskColor(strategy.riskLevel)}>
                          {strategy.riskLevel}
                        </Badge>
                        <Badge className={getComplexityColor(strategy.complexity)}>
                          {strategy.complexity}
                        </Badge>
                        <Badge variant="outline">
                          Marché: {strategy.marketDependency}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-green-700">Avantages :</h4>
                        <ul className="text-sm space-y-1">
                          {strategy.pros.slice(0, 2).map((pro, i) => (
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
                          {strategy.cons.slice(0, 2).map((con, i) => (
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
                          {strategy.bestFor.slice(0, 2).map((best, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {best}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Mise en œuvre :</h4>
                        <ul className="text-sm space-y-1">
                          {strategy.implementation.slice(0, 2).map((step, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Target className="h-3 w-3 text-mpr-interactive mt-0.5 flex-shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-green-50 to-mpr-interactive-lt">
                <CardHeader>
                  <CardTitle className="text-lg">Comparaison des approches de retrait</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Stratégie</th>
                          <th className="text-left p-2">Prévisibilité</th>
                          <th className="text-left p-2">Potentiel rendement</th>
                          <th className="text-left p-2">Complexité</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2">Buckets</td>
                          <td className="p-2">Élevée</td>
                          <td className="p-2">Modéré</td>
                          <td className="p-2">Moyenne</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Dynamique</td>
                          <td className="p-2">Variable</td>
                          <td className="p-2">Élevé</td>
                          <td className="p-2">Élevée</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Plancher-Plafond</td>
                          <td className="p-2">Très élevée</td>
                          <td className="p-2">Limité</td>
                          <td className="p-2">Moyenne</td>
                        </tr>
                        <tr>
                          <td className="p-2">Rendement total</td>
                          <td className="p-2">Modérée</td>
                          <td className="p-2">Élevé</td>
                          <td className="p-2">Faible</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="buffers" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {cashFlowBuffers.map((buffer) => (
                  <Card 
                    key={buffer.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${selectedBuffer === buffer.id ? 'ring-2 ring-mpr-interactive' : ''}`}
                    onClick={() => setSelectedBuffer(buffer.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{buffer.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{buffer.duration}</Badge>
                        <Badge className="bg-mpr-interactive-lt text-mpr-navy">
                          {buffer.amount.toLocaleString('fr-CA', {
                            style: 'currency',
                            currency: 'CAD',
                            maximumFractionDigits: 0
                          })}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Objectif :</h4>
                        <p className="text-sm text-gray-600">{buffer.purpose}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Reconstitution :</h4>
                        <p className="text-sm text-gray-600">{buffer.replenishment}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Avantages :</h4>
                        <ul className="text-sm space-y-1">
                          {buffer.advantages.map((advantage, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{advantage}</span>
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
                  <CardTitle className="text-lg text-yellow-800">Stratégie de tampon recommandée</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded">
                        <div className="text-2xl font-bold text-mpr-interactive">12-24</div>
                        <div className="text-sm text-gray-600">Mois de dépenses</div>
                        <div className="text-xs">en liquidités</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded">
                        <div className="text-2xl font-bold text-green-600">2-3%</div>
                        <div className="text-sm text-gray-600">Du portefeuille</div>
                        <div className="text-xs">en compte épargne</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded">
                        <div className="text-2xl font-bold text-purple-600">Flexible</div>
                        <div className="text-sm text-gray-600">Reconstitution</div>
                        <div className="text-xs">selon les marchés</div>
                      </div>
                    </div>

                    <Alert>
                      <DollarSign className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Règle d'or :</strong> Maintenez toujours 12-24 mois de dépenses en liquidités. 
                        Cela vous permet d'éviter de vendre des investissements pendant les corrections de marché 
                        et réduit significativement le risque de séquence des rendements.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calculator" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Calculateur de retrait dynamique
                  </CardTitle>
                  <CardDescription>
                    Personnalisez vos paramètres pour optimiser votre stratégie de retrait
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Valeur du portefeuille ($)
                      </label>
                      <input
                        type="number"
                        value={calculationInputs.portfolioValue}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          portfolioValue: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="0"
                        step="50000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Dépenses annuelles ($)
                      </label>
                      <input
                        type="number"
                        value={calculationInputs.annualExpenses}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          annualExpenses: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="0"
                        step="5000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Taux de retrait sécuritaire (%)
                      </label>
                      <input
                        type="number"
                        value={calculationInputs.safeWithdrawalRate}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          safeWithdrawalRate: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="0"
                        max="10"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tampon de liquidité (mois)
                      </label>
                      <input
                        type="number"
                        value={calculationInputs.cashBufferMonths}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          cashBufferMonths: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="6"
                        max="36"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Rendement attendu (%)
                      </label>
                      <input
                        type="number"
                        value={calculationInputs.expectedReturn}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          expectedReturn: Number(e.target.value)
                        })}
                        className="w-full p-2 border rounded-md"
                        min="0"
                        max="15"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Taux d'inflation (%)
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
                        <div className="text-2xl font-bold text-mpr-interactive">
                          {calculation.annualWithdrawal.toLocaleString('fr-CA', {
                            style: 'currency',
                            currency: 'CAD',
                            maximumFractionDigits: 0
                          })}
                        </div>
                        <div className="text-sm text-gray-600">Retrait annuel</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                          {calculation.monthlyWithdrawal.toLocaleString('fr-CA', {
                            style: 'currency',
                            currency: 'CAD',
                            maximumFractionDigits: 0
                          })}
                        </div>
                        <div className="text-sm text-gray-600">Retrait mensuel</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-purple-600">
                          {calculation.cashBuffer.toLocaleString('fr-CA', {
                            style: 'currency',
                            currency: 'CAD',
                            maximumFractionDigits: 0
                          })}
                        </div>
                        <div className="text-sm text-gray-600">Tampon de liquidité</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-orange-600">
                          {calculation.withdrawalRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Taux de retrait effectif</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <BarChart3 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Analyse :</strong> Votre stratégie génère{' '}
                      <strong>{calculation.monthlyWithdrawal.toLocaleString('fr-CA', {
                        style: 'currency',
                        currency: 'CAD',
                        maximumFractionDigits: 0
                      })}</strong> par mois avec un tampon de sécurité de{' '}
                      <strong>{calculation.cashBuffer.toLocaleString('fr-CA', {
                        style: 'currency',
                        currency: 'CAD',
                        maximumFractionDigits: 0
                      })}</strong>. Le taux de retrait effectif est de{' '}
                      <strong>{calculation.withdrawalRate.toFixed(1)}%</strong>.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="implementation" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-mpr-interactive-lt">
                  <CardHeader>
                    <CardTitle className="text-lg text-mpr-navy">Phase 1 : Préparation (6 mois avant)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-mpr-interactive mt-0.5 flex-shrink-0" />
                        <span>Analyser le portefeuille actuel et les besoins</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-mpr-interactive mt-0.5 flex-shrink-0" />
                        <span>Choisir la stratégie de retrait appropriée</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-mpr-interactive mt-0.5 flex-shrink-0" />
                        <span>Établir les tampons de liquidité nécessaires</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-mpr-interactive mt-0.5 flex-shrink-0" />
                        <span>Consulter un conseiller financier si nécessaire</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">Phase 2 : Mise en place (3 mois)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Restructurer le portefeuille selon la stratégie</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Mettre en place les comptes et allocations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Automatiser les transferts et rééquilibrages</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Tester le système avec de petits montants</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-800">Phase 3 : Suivi continu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Révision trimestrielle des performances</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Ajustement selon les conditions de marché</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Rééquilibrage annuel des allocations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Adaptation aux changements de besoins</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-800">Outils de suivi recommandés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Tableau de bord de performance mensuel</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Alertes de rééquilibrage automatiques</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Calculateur de taux de retrait dynamique</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>Projections de durabilité du portefeuille</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  <strong>Conseil de mise en œuvre :</strong> Commencez par une approche simple comme la stratégie 
                  des buckets, puis évoluez vers des méthodes plus sophistiquées à mesure que vous gagnez en 
                  expérience et en confiance avec votre système de retrait.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicWithdrawalPlanningModule;
