import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle,
  Calculator,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  DollarSign,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { MonteCarloResult } from '../services/AdvancedMonteCarloService';
import { UserData, Calculations } from '../types';

interface AdvancedResultsDashboardProps {
  calculations: Calculations & { monteCarloResults?: MonteCarloResult };
  userData: UserData;
}

// Fonction utilitaire pour formater les devises
const formatCurrency = (amount: number, abbreviated = false): string => {
  if (abbreviated && amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M$`;
  } else if (abbreviated && amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}k$`;
  }
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const AdvancedResultsDashboard: React.FC<AdvancedResultsDashboardProps> = ({
  calculations,
  userData
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedScenario, setSelectedScenario] = useState('moderate');
  
  const { monteCarloResults } = calculations;
  
  // Métriques clés calculées
  const keyMetrics = useMemo(() => {
    if (!monteCarloResults) return null;
    
    const { statistics, riskAnalysis } = monteCarloResults;
    
    const calculateOverallRiskLevel = (risks: any): string => {
      const riskValues = Object.values(risks).filter(v => typeof v === 'number') as number[];
      const avgRisk = riskValues.reduce((sum, val) => sum + val, 0) / riskValues.length;
      
      if (avgRisk < 0.3) return 'FAIBLE';
      if (avgRisk < 0.6) return 'MODÉRÉ';
      return 'ÉLEVÉ';
    };
    
    const calculateConfidenceLevel = (successRate: number): string => {
      if (successRate >= 0.85) return 'ÉLEVÉ';
      if (successRate >= 0.7) return 'MODÉRÉ';
      return 'FAIBLE';
    };
    
    return {
      successRate: statistics.successRate * 100,
      medianValue: statistics.medianFinalValue,
      worstCase: statistics.worstCase5th,
      bestCase: statistics.bestCase95th,
      riskLevel: calculateOverallRiskLevel(riskAnalysis),
      confidenceLevel: calculateConfidenceLevel(statistics.successRate)
    };
  }, [monteCarloResults]);
  
  // Données pour les graphiques
  const chartData = useMemo(() => {
    if (!monteCarloResults?.chartData) return null;
    
    return {
      projections: monteCarloResults.chartData.yearlyProjections,
      distribution: monteCarloResults.chartData.distributionData,
      sensitivity: monteCarloResults.chartData.sensitivityData
    };
  }, [monteCarloResults]);
  
  if (!monteCarloResults) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Simulations avancées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              Les simulations Monte Carlo avancées sont en cours de calcul ou non disponibles.
              Utilisez la méthode calculateAllAdvanced() pour obtenir les résultats complets.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="w-full space-y-6">
      {/* En-tête avec métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Taux de succès"
          value={`${keyMetrics.successRate.toFixed(1)}%`}
          icon={<Target className="w-5 h-5" />}
          trend={keyMetrics.successRate >= 80 ? 'positive' : keyMetrics.successRate >= 60 ? 'neutral' : 'negative'}
          description="Probabilité que votre capital dure toute votre vie"
        />
        
        <MetricCard
          title="Valeur médiane projetée"
          value={formatCurrency(keyMetrics.medianValue, true)}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="positive"
          description="Valeur la plus probable de votre portfolio"
        />
        
        <MetricCard
          title="Niveau de risque"
          value={keyMetrics.riskLevel}
          icon={<Shield className="w-5 h-5" />}
          trend={keyMetrics.riskLevel === 'FAIBLE' ? 'positive' : keyMetrics.riskLevel === 'MODÉRÉ' ? 'neutral' : 'negative'}
          description="Évaluation globale des risques identifiés"
        />
        
        <MetricCard
          title="Niveau de confiance"
          value={keyMetrics.confidenceLevel}
          icon={<CheckCircle className="w-5 h-5" />}
          trend={keyMetrics.confidenceLevel === 'ÉLEVÉ' ? 'positive' : 'neutral'}
          description="Fiabilité de votre stratégie actuelle"
        />
      </div>
      
      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="scenarios">Scénarios</TabsTrigger>
          <TabsTrigger value="risks">Analyse des risques</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
        </TabsList>
        
        {/* Onglet Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab 
            calculations={calculations}
            monteCarloResults={monteCarloResults}
            userData={userData}
          />
        </TabsContent>
        
        {/* Onglet Projections */}
        <TabsContent value="projections" className="space-y-6">
          <ProjectionsTab 
            chartData={chartData}
            monteCarloResults={monteCarloResults}
          />
        </TabsContent>
        
        {/* Onglet Scénarios */}
        <TabsContent value="scenarios" className="space-y-6">
          <ScenariosTab 
            scenarios={monteCarloResults.scenarios}
            selectedScenario={selectedScenario}
            onScenarioChange={setSelectedScenario}
          />
        </TabsContent>
        
        {/* Onglet Analyse des risques */}
        <TabsContent value="risks" className="space-y-6">
          <RiskAnalysisTab 
            riskAnalysis={monteCarloResults.riskAnalysis}
            statistics={monteCarloResults.statistics}
          />
        </TabsContent>
        
        {/* Onglet Recommandations */}
        <TabsContent value="recommendations" className="space-y-6">
          <RecommendationsTab 
            recommendations={monteCarloResults.recommendations}
            calculations={calculations}
            userData={userData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ===== COMPOSANTS ONGLETS =====

const OverviewTab: React.FC<any> = ({ calculations, monteCarloResults, userData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Graphique principal - Projection du capital */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Projection de votre capital
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monteCarloResults.chartData.yearlyProjections}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis tickFormatter={(value) => formatCurrency(value, true)} />
              <Tooltip 
                labelFormatter={(age) => `Âge: ${age} ans`}
                formatter={(value, name) => [formatCurrency(Number(value)), name]}
              />
              <Area 
                type="monotone" 
                dataKey="percentile95" 
                stackId="1" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.1}
                name="Scénario optimiste (95e percentile)"
              />
              <Area 
                type="monotone" 
                dataKey="percentile5" 
                stackId="1" 
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.1}
                name="Scénario pessimiste (5e percentile)"
              />
              <Line 
                type="monotone" 
                dataKey="medianValue" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Scénario médian"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Répartition des résultats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Distribution des résultats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Succès complet</span>
              <div className="flex items-center gap-2">
                <Progress 
                  value={monteCarloResults.statistics.successRate * 100} 
                  className="w-24"
                />
                <span className="text-sm font-medium">
                  {(monteCarloResults.statistics.successRate * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(monteCarloResults.statistics.bestCase95th, true)}
                </div>
                <div className="text-sm text-green-600">Scénario optimiste</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">
                  {formatCurrency(monteCarloResults.statistics.worstCase5th, true)}
                </div>
                <div className="text-sm text-red-600">Scénario pessimiste</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Revenus de retraite projetés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Vos revenus de retraite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>RRQ/CPP</span>
              <span className="font-medium">
                {formatCurrency((calculations.rrqOptimization?.person1?.montantMensuelActuel || 0) * 12)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Sécurité de la vieillesse + SRG</span>
              <span className="font-medium">
                {formatCurrency((calculations.oasGisProjection?.householdTotal?.monthlyOAS || 0) * 12)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Retraits REER/Placements</span>
              <span className="font-medium">
                {formatCurrency(calculations.retirementCapital * 0.04)}
              </span>
            </div>
            
            <hr />
            
            <div className="flex justify-between items-center font-bold">
              <span>Total annuel estimé</span>
              <span>
                {formatCurrency(
                  ((calculations.rrqOptimization?.person1?.montantMensuelActuel || 0) * 12) +
                  ((calculations.oasGisProjection?.householdTotal?.monthlyOAS || 0) * 12) +
                  (calculations.retirementCapital * 0.04)
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Indicateurs de santé financière */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Santé financière
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <HealthIndicator
              label="Suffisance du capital"
              value={calculations.sufficiency}
              type="percentage"
              threshold={80}
            />
            
            <HealthIndicator
              label="Taux de remplacement"
              value={75} // Calculer le vrai taux
              type="percentage"
              threshold={70}
            />
            
            <HealthIndicator
              label="Protection inflation"
              value={65} // Calculer selon allocation
              type="percentage"
              threshold={60}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProjectionsTab: React.FC<any> = ({ chartData, monteCarloResults }) => {
  if (!chartData) return <div>Données de projection non disponibles</div>;
  
  return (
    <div className="space-y-6">
      {/* Graphique détaillé des projections */}
      <Card>
        <CardHeader>
          <CardTitle>Projections détaillées sur 30 ans</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData.projections}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="age" 
                label={{ value: 'Âge', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'Valeur du portfolio ($)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => formatCurrency(value, true)}
              />
              <Tooltip 
                labelFormatter={(age) => `Âge: ${age} ans`}
                formatter={(value, name) => [formatCurrency(value), name]}
              />
              <Line 
                type="monotone" 
                dataKey="percentile95" 
                stroke="#10B981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="95e percentile (optimiste)"
              />
              <Line 
                type="monotone" 
                dataKey="medianValue" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Médiane (probable)"
              />
              <Line 
                type="monotone" 
                dataKey="percentile5" 
                stroke="#EF4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="5e percentile (pessimiste)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Graphique des retraits annuels */}
      <Card>
        <CardHeader>
          <CardTitle>Retraits annuels projetés</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.projections}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis tickFormatter={(value) => formatCurrency(value, true)} />
              <Tooltip 
                labelFormatter={(age) => `Âge: ${age} ans`}
                formatter={(value) => [formatCurrency(value), 'Retrait annuel']}
              />
              <Bar dataKey="withdrawal" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const ScenariosTab: React.FC<any> = ({ scenarios, selectedScenario, onScenarioChange }) => {
  const scenarioData = [
    { 
      key: 'conservative', 
      name: 'Conservateur', 
      description: '25e percentile - Prudent',
      color: 'bg-red-100 text-red-800'
    },
    { 
      key: 'moderate', 
      name: 'Modéré', 
      description: '50e percentile - Équilibré',
      color: 'bg-blue-100 text-blue-800'
    },
    { 
      key: 'optimistic', 
      name: 'Optimiste', 
      description: '75e percentile - Croissance',
      color: 'bg-green-100 text-green-800'
    },
    { 
      key: 'stressTest', 
      name: 'Test de stress', 
      description: '5e percentile - Pire cas',
      color: 'bg-red-200 text-red-900'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Sélecteur de scénarios */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {scenarioData.map((scenario) => (
          <Card 
            key={scenario.key}
            className={`cursor-pointer transition-all ${
              selectedScenario === scenario.key ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onScenarioChange(scenario.key)}
          >
            <CardContent className="p-4">
              <div className="text-center">
                <Badge className={scenario.color}>
                  {scenario.name}
                </Badge>
                <div className="mt-2 text-sm text-gray-600">
                  {scenario.description}
                </div>
                <div className="mt-3 text-2xl font-bold">
                  {formatCurrency(scenarios[scenario.key]?.finalValue || 0, true)}
                </div>
                <div className="text-sm text-gray-500">
                  Valeur finale
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Détails du scénario sélectionné */}
      <Card>
        <CardHeader>
          <CardTitle>
            Détails du scénario {scenarioData.find(s => s.key === selectedScenario)?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Valeur finale</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(scenarios[selectedScenario]?.finalValue || 0)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Rendement annuel moyen</div>
                <div className="text-xl font-semibold">
                  {((scenarios[selectedScenario]?.averageAnnualReturn || 0) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Âge d'épuisement</div>
                <div className="text-xl font-semibold">
                  {scenarios[selectedScenario]?.depletionAge || 'Aucun'}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Perte maximale</div>
                <div className="text-xl font-semibold text-red-600">
                  {((scenarios[selectedScenario]?.maxDrawdown || 0) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Score de durabilité</div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={scenarios[selectedScenario]?.sustainabilityScore || 0} 
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">
                    {scenarios[selectedScenario]?.sustainabilityScore || 0}/100
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Valeur ajustée inflation</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(scenarios[selectedScenario]?.inflationAdjustedValue || 0, true)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RiskAnalysisTab: React.FC<any> = ({ riskAnalysis, statistics }) => {
  const risks = [
    {
      name: 'Risque de longévité',
      value: riskAnalysis.longevityRisk,
      description: 'Risque de vivre plus longtemps que prévu',
      mitigation: 'Maximiser les revenus viagers (RRQ, SV)'
    },
    {
      name: 'Risque d\'inflation',
      value: riskAnalysis.inflationRisk,
      description: 'Risque d\'érosion du pouvoir d\'achat',
      mitigation: 'Augmenter l\'allocation en actions et actifs réels'
    },
    {
      name: 'Risque de séquence des rendements',
      value: riskAnalysis.sequenceOfReturnsRisk,
      description: 'Risque de mauvais rendements en début de retraite',
      mitigation: 'Constituer une réserve de liquidités de 3-5 ans'
    },
    {
      name: 'Risque de crash de marché',
      value: riskAnalysis.marketCrashRisk,
      description: 'Risque de correction majeure des marchés',
      mitigation: 'Diversification et stratégie de retrait flexible'
    },
    {
      name: 'Risque de retrait non-soutenable',
      value: riskAnalysis.withdrawalUnsustainability,
      description: 'Risque que le taux de retrait soit trop élevé',
      mitigation: 'Utiliser des "guardrails" pour ajuster les retraits'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Vue d'ensemble des risques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Analyse des risques de votre stratégie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {risks.map((risk, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{risk.name}</h3>
                  <RiskBadge level={risk.value} />
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={risk.value * 100} className="flex-1" />
                  <span className="text-sm text-gray-600">
                    {(risk.value * 100).toFixed(0)}%
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                
                <div className="text-sm">
                  <span className="font-medium text-blue-600">Stratégie d'atténuation: </span>
                  {risk.mitigation}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Matrice de risques */}
      <Card>
        <CardHeader>
          <CardTitle>Matrice de probabilité vs impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 h-64">
            {/* Matrice 3x3 des risques */}
            <div className="bg-green-100 border rounded flex items-center justify-center text-sm">
              <div className="text-center">
                <div className="font-medium">Faible/Faible</div>
                <div className="text-xs text-gray-600">Risques mineurs</div>
              </div>
            </div>
            <div className="bg-yellow-100 border rounded flex items-center justify-center text-sm">
              <div className="text-center">
                <div className="font-medium">Faible/Moyen</div>
                <div className="text-xs text-gray-600">Surveillance</div>
              </div>
            </div>
            <div className="bg-orange-100 border rounded flex items-center justify-center text-sm">
              <div className="text-center">
                <div className="font-medium">Faible/Élevé</div>
                <div className="text-xs text-gray-600">À surveiller</div>
              </div>
            </div>
            <div className="bg-yellow-100 border rounded flex items-center justify-center text-sm">
              <div className="text-center">
                <div className="font-medium">Moyen/Faible</div>
                <div className="text-xs text-gray-600">Acceptable</div>
              </div>
            </div>
            <div className="bg-orange-100 border rounded flex items-center justify-center text-sm">
              <div className="text-center">
                <div className="font-medium">Moyen/Moyen</div>
                <div className="text-xs text-gray-600">
                  {risks.filter(r => r.value >= 0.3 && r.value < 0.7).length} risques
                </div>
              </div>
            </div>
            <div className="bg-red-100 border rounded flex items-center justify-center text-sm">
              <div className="text-center">
                <div className="font-medium">Moyen/Élevé</div>
                <div className="text-xs text-gray-600">Action requise</div>
              </div>
            </div>
            <div className="bg-orange-100 border rounded flex items-center justify-center text-sm">
              <div className="text-center">
                <div className="font-medium">Élevé/Faible</div>
                <div className="text-xs text-gray-600">Mitigation</div>
              </div>
            </div>
            <div className="bg-red-100 border rounded flex items-center justify-center text-sm">
              <div className="text-center">
                <div className="font-medium">Élevé/Moyen</div>
                <div className="text-xs text-gray-600">Priorité haute</div>
              </div>
            </div>
            <div className="bg-red-200 border rounded flex items-center justify-center text-sm">
              <div className="text-center">
                <div className="font-medium">Élevé/Élevé</div>
                <div className="text-xs text-gray-600">
                  {risks.filter(r => r.value >= 0.7).length} risques critiques
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RecommendationsTab: React.FC<any> = ({ recommendations, calculations, userData }) => {
  return (
    <div className="space-y-6">
      {/* Recommandations prioritaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Actions prioritaires recommandées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ActionCard
              priority="HAUTE"
              title="Ajuster le taux de retrait"
              description={`Optimiser à ${(recommendations.optimalWithdrawalRate * 100).toFixed(1)}% pour améliorer la durabilité`}
              timeline="Immédiat"
              impact="Élevé"
            />
            
            {recommendations.portfolioAdjustments.map((adjustment: string, index: number) => (
              <ActionCard
                key={index}
                priority="MOYENNE"
                title="Ajustement de portfolio"
                description={adjustment}
                timeline="3-6 mois"
                impact="Moyen"
              />
            ))}
            
            {recommendations.contingencyPlans.map((plan: string, index: number) => (
              <ActionCard
                key={index}
                priority="MOYENNE"
                title="Plan de contingence"
                description={plan}
                timeline="6-12 mois"
                impact="Élevé si activé"
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Déclencheurs de révision */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Déclencheurs de révision stratégique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.reviewTriggers.map((trigger: string, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-sm">{trigger}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Plan d'action sur 12 mois */}
      <Card>
        <CardHeader>
          <CardTitle>Plan d'action sur 12 mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TimelineItem
              month="Mois 1-2"
              tasks={[
                "Réviser l'allocation d'actifs",
                "Mettre en place les 'guardrails' de retrait",
                "Optimiser la stratégie RRQ si applicable"
              ]}
            />
            
            <TimelineItem
              month="Mois 3-6"
              tasks={[
                "Rééquilibrer le portfolio selon les nouvelles allocations",
                "Constituer la réserve de liquidités",
                "Réviser les projections fiscales"
              ]}
            />
            
            <TimelineItem
              month="Mois 6-12"
              tasks={[
                "Évaluer la performance vs projections",
                "Ajuster si nécessaire les taux de retrait",
                "Préparer la révision annuelle complète"
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== COMPOSANTS UTILITAIRES =====

const MetricCard: React.FC<any> = ({ title, value, icon, trend, description }) => {
  const trendColors = {
    positive: 'text-green-600 bg-green-50',
    neutral: 'text-yellow-600 bg-yellow-50',
    negative: 'text-red-600 bg-red-50'
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${trendColors[trend]}`}>
            {icon}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-gray-600">{title}</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {description}
        </div>
      </CardContent>
    </Card>
  );
};

const HealthIndicator: React.FC<any> = ({ label, value, type, threshold }) => {
  const getColor = () => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <Progress value={Math.min(value, 100)} className="w-16" />
        <span className={`text-sm font-medium ${getColor()}`}>
          {type === 'percentage' ? `${value}%` : value}
        </span>
      </div>
    </div>
  );
};

const RiskBadge: React.FC<{ level: number }> = ({ level }) => {
  if (level < 0.3) {
    return <Badge className="bg-green-100 text-green-800">Faible</Badge>;
  } else if (level < 0.7) {
    return <Badge className="bg-yellow-100 text-yellow-800">Modéré</Badge>;
  } else {
    return <Badge className="bg-red-100 text-red-800">Élevé</Badge>;
  }
};

const ActionCard: React.FC<any> = ({ priority, title, description, timeline, impact }) => {
  const priorityColors = {
    HAUTE: 'border-red-200 bg-red-50',
    MOYENNE: 'border-yellow-200 bg-yellow-50',
    FAIBLE: 'border-green-200 bg-green-50'
  };
  
  return (
    <div className={`border rounded-lg p-4 ${priorityColors[priority]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={priority === 'HAUTE' ? 'destructive' : 'secondary'}>
              {priority}
            </Badge>
            <h3 className="font-medium">{title}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>📅 {timeline}</span>
            <span>📊 Impact: {impact}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineItem: React.FC<any> = ({ month, tasks }) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-20 text-sm font-medium text-gray-600">
        {month}
      </div>
      <div className="flex-1">
        <ul className="space-y-1">
          {tasks.map((task: string, index: number) => (
            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              {task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
