import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Alert, AlertDescription } from './alert';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { TrendingUp, Shield, Calculator, BookOpen, AlertTriangle, CheckCircle, DollarSign, Target } from 'lucide-react';

interface InflationScenario {
  rate: number;
  description: string;
  historicalPeriod: string;
  impact: string;
  strategies: string[];
}

interface InflationProtectionStrategy {
  name: string;
  description: string;
  effectiveness: 'Faible' | 'Modérée' | 'Élevée';
  governmentPrograms: string[];
  riskLevel: 'Faible' | 'Modéré' | 'Élevé';
  suitability: string[];
  implementation: string;
}

interface InflationImpactAnalysis {
  currentAge: number;
  retirementAge: number;
  currentExpenses: number;
  inflationRate: number;
  yearsToRetirement: number;
  yearsInRetirement: number;
  futureExpensesAtRetirement: number;
  futureExpensesAt85: number;
  totalInflationImpact: number;
  protectionNeeded: number;
}

const InflationProtectionModule: React.FC = () => {
  const [currentAge, setCurrentAge] = useState<number>(55);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentExpenses, setCurrentExpenses] = useState<number>(60000);
  const [inflationRate, setInflationRate] = useState<number>(3);
  const [analysis, setAnalysis] = useState<InflationImpactAnalysis | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>('moderate');

  const inflationScenarios: InflationScenario[] = [
    {
      rate: 2,
      description: "Inflation faible - Cible de la Banque du Canada",
      historicalPeriod: "1990-2020 (moyenne)",
      impact: "Doublement des prix en 35 ans",
      strategies: ["Obligations du Canada indexées", "CELI avec croissance", "Prestations gouvernementales indexées"]
    },
    {
      rate: 3,
      description: "Inflation modérée - Scénario de planification standard",
      historicalPeriod: "Moyenne historique long terme",
      impact: "Doublement des prix en 24 ans",
      strategies: ["Diversification des actifs", "Actions canadiennes", "Immobilier", "Prestations indexées"]
    },
    {
      rate: 5,
      description: "Inflation élevée - Période de stress économique",
      historicalPeriod: "Années 1970-1980",
      impact: "Doublement des prix en 14 ans",
      strategies: ["Actifs réels", "Actions de qualité", "Immobilier", "Matières premières"]
    },
    {
      rate: 8,
      description: "Hyperinflation - Crise économique majeure",
      historicalPeriod: "Début des années 1980 au Canada",
      impact: "Doublement des prix en 9 ans",
      strategies: ["Actifs tangibles", "Devises étrangères", "Actions de sociétés avec pouvoir de fixation des prix"]
    }
  ];

  const protectionStrategies: InflationProtectionStrategy[] = [
    {
      name: "Prestations gouvernementales indexées",
      description: "RRQ, SV et SRG sont automatiquement ajustés selon l'IPC",
      effectiveness: 'Élevée',
      governmentPrograms: ["RRQ", "Sécurité de la vieillesse", "Supplément de revenu garanti"],
      riskLevel: 'Faible',
      suitability: ["Tous les retraités", "Revenus faibles à modérés"],
      implementation: "Automatique - aucune action requise"
    },
    {
      name: "Obligations du Canada à rendement réel (ORR)",
      description: "Obligations gouvernementales indexées à l'inflation",
      effectiveness: 'Élevée',
      governmentPrograms: ["Obligations du Canada", "REER/FERR admissibles"],
      riskLevel: 'Faible',
      suitability: ["Investisseurs conservateurs", "Approche de la retraite"],
      implementation: "Achat direct ou via fonds spécialisés"
    },
    {
      name: "Actions de sociétés canadiennes de qualité",
      description: "Entreprises avec pouvoir de fixation des prix et dividendes croissants",
      effectiveness: 'Modérée',
      governmentPrograms: ["CELI", "REER", "Comptes non-enregistrés"],
      riskLevel: 'Modéré',
      suitability: ["Horizon long terme", "Tolérance au risque modérée"],
      implementation: "Fonds diversifiés ou actions individuelles"
    },
    {
      name: "Immobilier et FPI",
      description: "Propriétés et fonds de placement immobilier",
      effectiveness: 'Modérée',
      governmentPrograms: ["CELI", "REER", "Propriété principale"],
      riskLevel: 'Modéré',
      suitability: ["Diversification", "Protection contre l'inflation"],
      implementation: "FPI via courtier ou propriété directe"
    },
    {
      name: "Matières premières et ressources",
      description: "Or, pétrole, ressources naturelles canadiennes",
      effectiveness: 'Modérée',
      governmentPrograms: ["CELI", "Comptes non-enregistrés"],
      riskLevel: 'Élevé',
      suitability: ["Diversification", "Couverture inflation extrême"],
      implementation: "ETF spécialisés ou actions de ressources"
    }
  ];

  const calculateInflationImpact = (): InflationImpactAnalysis => {
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    const yearsInRetirement = Math.max(0, 85 - retirementAge); // Planification jusqu'à 85 ans
    const inflationMultiplier = Math.pow(1 + inflationRate / 100, yearsToRetirement);
    const futureExpensesAtRetirement = currentExpenses * inflationMultiplier;
    
    // Calcul des dépenses à 85 ans
    const additionalYears = yearsInRetirement;
    const futureExpensesAt85 = futureExpensesAtRetirement * Math.pow(1 + inflationRate / 100, additionalYears);
    
    // Impact total de l'inflation
    const totalInflationImpact = futureExpensesAt85 - currentExpenses;
    
    // Protection nécessaire (estimation)
    const protectionNeeded = totalInflationImpact * 0.7; // 70% de protection recommandée

    return {
      currentAge,
      retirementAge,
      currentExpenses,
      inflationRate,
      yearsToRetirement,
      yearsInRetirement,
      futureExpensesAtRetirement,
      futureExpensesAt85,
      totalInflationImpact,
      protectionNeeded
    };
  };

  useEffect(() => {
    setAnalysis(calculateInflationImpact());
  }, [currentAge, retirementAge, currentExpenses, inflationRate]);

  useEffect(() => {
    const scenario = inflationScenarios.find(s => 
      (selectedScenario === 'low' && s.rate === 2) ||
      (selectedScenario === 'moderate' && s.rate === 3) ||
      (selectedScenario === 'high' && s.rate === 5) ||
      (selectedScenario === 'extreme' && s.rate === 8)
    );
    if (scenario) {
      setInflationRate(scenario.rate);
    }
  }, [selectedScenario]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getEffectivenessColor = (effectiveness: string): string => {
    switch (effectiveness) {
      case 'Élevée': return 'text-green-600';
      case 'Modérée': return 'text-yellow-600';
      case 'Faible': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

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
            <Shield className="h-5 w-5" />
            Protection contre l'inflation à la retraite
          </CardTitle>
          <CardDescription>
            Évaluez l'impact de l'inflation et découvrez les stratégies de protection recommandées par le Gouvernement du Canada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <BookOpen className="h-4 w-4" />
            <AlertDescription>
              <strong>Expertise gouvernementale :</strong> Module basé sur les données de Statistique Canada et les 
              recommandations de la Banque du Canada pour protéger votre pouvoir d'achat à la retraite.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="calculator">Calculateur</TabsTrigger>
              <TabsTrigger value="scenarios">Scénarios</TabsTrigger>
              <TabsTrigger value="strategies">Stratégies</TabsTrigger>
              <TabsTrigger value="education">Éducation</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentAge">Âge actuel</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(Number(e.target.value))}
                      min="25"
                      max="70"
                    />
                  </div>

                  <div>
                    <Label htmlFor="retirementAge">Âge de retraite prévu</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(Number(e.target.value))}
                      min="55"
                      max="75"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentExpenses">Dépenses annuelles actuelles</Label>
                    <Input
                      id="currentExpenses"
                      type="number"
                      value={currentExpenses}
                      onChange={(e) => setCurrentExpenses(Number(e.target.value))}
                      min="0"
                      step="1000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="scenario">Scénario d'inflation</Label>
                    <select
                      id="scenario"
                      value={selectedScenario}
                      onChange={(e) => setSelectedScenario(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      title="Sélectionnez un scénario d'inflation"
                    >
                      <option value="low">Faible (2% - Cible Banque du Canada)</option>
                      <option value="moderate">Modérée (3% - Planification standard)</option>
                      <option value="high">Élevée (5% - Stress économique)</option>
                      <option value="extreme">Extrême (8% - Crise majeure)</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="inflationRate">Taux d'inflation personnalisé (%)</Label>
                    <Input
                      id="inflationRate"
                      type="number"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      min="0"
                      max="15"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {analysis && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Impact de l'inflation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span>Dépenses actuelles :</span>
                            <span className="font-semibold">{formatCurrency(analysis.currentExpenses)}/an</span>
                          </div>
                          <div className="flex justify-between">
                            <span>À la retraite ({analysis.retirementAge} ans) :</span>
                            <span className="font-semibold text-orange-600">
                              {formatCurrency(analysis.futureExpensesAtRetirement)}/an
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>À 85 ans :</span>
                            <span className="font-semibold text-red-600">
                              {formatCurrency(analysis.futureExpensesAt85)}/an
                            </span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between">
                              <span>Impact total inflation :</span>
                              <span className="font-semibold text-red-600">
                                +{formatCurrency(analysis.totalInflationImpact)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Protection recommandée :</span>
                              <span className="font-semibold text-blue-600">
                                {formatCurrency(analysis.protectionNeeded)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Alert>
                        <Target className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Objectif de protection :</strong> Avec {analysis.inflationRate}% d'inflation, 
                          vos dépenses augmenteront de {((analysis.futureExpensesAt85 / analysis.currentExpenses - 1) * 100).toFixed(0)}% 
                          d'ici vos 85 ans. Une protection de {formatCurrency(analysis.protectionNeeded)} est recommandée.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-4">
              <div className="space-y-4">
                {inflationScenarios.map((scenario, index) => (
                  <Card key={index} className={selectedScenario === 
                    (scenario.rate === 2 ? 'low' : 
                     scenario.rate === 3 ? 'moderate' : 
                     scenario.rate === 5 ? 'high' : 'extreme') 
                    ? 'ring-2 ring-blue-500' : ''}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant={scenario.rate <= 3 ? 'default' : scenario.rate <= 5 ? 'secondary' : 'destructive'}>
                          {scenario.rate}%
                        </Badge>
                        {scenario.description}
                      </CardTitle>
                      <CardDescription>
                        Période historique : {scenario.historicalPeriod}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Impact :</strong> {scenario.impact}
                        </AlertDescription>
                      </Alert>

                      <div>
                        <h4 className="font-semibold mb-2">Stratégies recommandées :</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {scenario.strategies.map((strategy, i) => (
                            <li key={i}>{strategy}</li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        variant={selectedScenario === 
                          (scenario.rate === 2 ? 'low' : 
                           scenario.rate === 3 ? 'moderate' : 
                           scenario.rate === 5 ? 'high' : 'extreme') 
                          ? 'default' : 'outline'}
                        onClick={() => setSelectedScenario(
                          scenario.rate === 2 ? 'low' : 
                          scenario.rate === 3 ? 'moderate' : 
                          scenario.rate === 5 ? 'high' : 'extreme'
                        )}
                        className="w-full"
                      >
                        {selectedScenario === 
                          (scenario.rate === 2 ? 'low' : 
                           scenario.rate === 3 ? 'moderate' : 
                           scenario.rate === 5 ? 'high' : 'extreme') 
                          ? 'Scénario sélectionné' : 'Sélectionner ce scénario'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="strategies" className="space-y-4">
              <div className="space-y-4">
                {protectionStrategies.map((strategy, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {strategy.name}
                      </CardTitle>
                      <CardDescription>{strategy.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getEffectivenessColor(strategy.effectiveness)}>
                          Efficacité : {strategy.effectiveness}
                        </Badge>
                        <Badge className={getRiskColor(strategy.riskLevel)}>
                          Risque : {strategy.riskLevel}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Programmes gouvernementaux :</h4>
                        <div className="flex flex-wrap gap-2">
                          {strategy.governmentPrograms.map((program, i) => (
                            <Badge key={i} variant="secondary">{program}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Convient pour :</h4>
                        <ul className="list-disc list-inside">
                          {strategy.suitability.map((suit, i) => (
                            <li key={i}>{suit}</li>
                          ))}
                        </ul>
                      </div>

                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Mise en œuvre :</strong> {strategy.implementation}
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comprendre l'inflation et son impact sur la retraite</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Qu'est-ce que l'inflation ?</h3>
                    <p className="text-gray-700 mb-4">
                      L'inflation est l'augmentation générale et soutenue des prix des biens et services. 
                      Au Canada, elle est mesurée par l'Indice des prix à la consommation (IPC) de Statistique Canada.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold">Cible de la Banque du Canada</h4>
                        <p>2% d'inflation annuelle (fourchette de 1% à 3%)</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold">Inflation historique moyenne</h4>
                        <p>3% par année depuis 1950</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Impact sur le pouvoir d'achat</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <strong>Exemple concret :</strong> Ce qui coûtait 1 000$ en 1990 coûte environ 1 600$ en 2024
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <strong>Règle du 72 :</strong> À 3% d'inflation, les prix doublent tous les 24 ans
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Protection automatique du gouvernement</h3>
                    <div className="space-y-3">
                      <div className="border-l-4 border-green-500 pl-4">
                        <strong>RRQ/RPC :</strong> Indexé annuellement selon l'IPC
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <strong>Sécurité de la vieillesse :</strong> Ajustée trimestriellement selon l'IPC
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <strong>SRG :</strong> Indexé automatiquement pour maintenir le pouvoir d'achat
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Stratégies de protection personnelle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-700">Protection faible risque :</h4>
                        <ul className="list-disc list-inside mt-2">
                          <li>Obligations à rendement réel</li>
                          <li>CPG indexés</li>
                          <li>Prestations gouvernementales</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700">Protection croissance :</h4>
                        <ul className="list-disc list-inside mt-2">
                          <li>Actions de qualité</li>
                          <li>Immobilier</li>
                          <li>Fonds diversifiés</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <BookOpen className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Conseil d'expert :</strong> Une stratégie équilibrée combinant les prestations 
                      gouvernementales indexées et des investissements de croissance offre la meilleure protection 
                      contre l'inflation à long terme.
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

export default InflationProtectionModule;
