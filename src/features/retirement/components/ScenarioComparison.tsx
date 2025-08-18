// src/features/retirement/components/ScenarioComparison.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitCompare,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  Download,
  Copy,
  Settings
} from 'lucide-react';
import { UserData, Calculations } from '../types';
import { ScenarioService, Scenario, type ScenarioComparison as ScenarioComparisonType } from '../services/ScenarioService';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface ScenarioComparisonProps {
  userData: UserData;
  calculations: Calculations;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  userData,
  calculations
}) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [comparison, setComparison] = useState<ScenarioComparisonType | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Initialiser avec le scénario de base
    const baseScenario = ScenarioService.createBaseScenario(userData, calculations);
    const predefinedScenarios = ScenarioService.generatePredefinedScenarios(userData);
    setScenarios([baseScenario, ...predefinedScenarios]);
    setSelectedScenarios([baseScenario.id, predefinedScenarios[0]?.id].filter(Boolean));
  }, [userData, calculations]);

  useEffect(() => {
    if (selectedScenarios.length >= 2) {
      const comp = ScenarioService.compareScenarios(selectedScenarios);
      setComparison(comp);
    } else {
      setComparison(null);
    }
  }, [selectedScenarios]);

  const toggleScenarioSelection = (scenarioId: string) => {
    setSelectedScenarios(prev => {
      if (prev.includes(scenarioId)) {
        return prev.filter(id => id !== scenarioId);
      } else if (prev.length < 4) { // Limite à 4 scénarios
        return [...prev, scenarioId];
      }
      return prev;
    });
  };

  const deleteScenario = (scenarioId: string) => {
    if (scenarioId === 'base') return;
    
    ScenarioService.deleteScenario(scenarioId);
    setScenarios(prev => prev.filter(s => s.id !== scenarioId));
    setSelectedScenarios(prev => prev.filter(id => id !== scenarioId));
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="w-6 h-6 text-indigo-600" />
                Comparaison de scénarios
              </CardTitle>
              <CardDescription>
                Comparez différents scénarios pour prendre les meilleures décisions
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer un scénario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Liste des scénarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map(scenario => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                isSelected={selectedScenarios.includes(scenario.id)}
                onToggle={() => toggleScenarioSelection(scenario.id)}
                onDelete={() => deleteScenario(scenario.id)}
                canDelete={!scenario.isBase}
              />
            ))}
          </div>
          
          {selectedScenarios.length < 2 && (
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Sélectionnez au moins 2 scénarios pour les comparer (maximum 4)
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Comparaison détaillée */}
      {comparison && (
        <Card>
          <CardHeader>
            <CardTitle>Analyse comparative</CardTitle>
            <CardDescription>
              Comparaison de {comparison.scenarios.length} scénarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full lg:w-auto">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="projections">Projections</TabsTrigger>
                <TabsTrigger value="metrics">Métriques</TabsTrigger>
                <TabsTrigger value="radar">Analyse radar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <ComparisonOverview comparison={comparison} />
              </TabsContent>
              
              <TabsContent value="projections">
                <ProjectionsChart comparison={comparison} />
              </TabsContent>
              
              <TabsContent value="metrics">
                <MetricsComparison comparison={comparison} />
              </TabsContent>
              
              <TabsContent value="radar">
                <RadarAnalysis comparison={comparison} />
              </TabsContent>
            </Tabs>
            
            {/* Recommandations */}
            {comparison.recommendations.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-sm">Recommandations basées sur la comparaison</h4>
                {comparison.recommendations.map((rec, index) => (
                  <Alert key={index}>
                    <AlertDescription>{rec}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog de création de scénario */}
      <CreateScenarioDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        baseData={userData}
        onCreate={(scenario) => {
          setScenarios(prev => [...prev, scenario]);
          setShowCreateDialog(false);
        }}
      />
    </div>
  );
};

// Carte de scénario
const ScenarioCard: React.FC<{
  scenario: Scenario;
  isSelected: boolean;
  onToggle: () => void;
  onDelete: () => void;
  canDelete: boolean;
}> = ({ scenario, isSelected, onToggle, onDelete, canDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-indigo-500 shadow-lg' : ''
      }`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="text-2xl p-2 rounded-lg"
                style={{ backgroundColor: `${scenario.color}20` }}
              >
                {scenario.icon}
              </div>
              <div>
                <h3 className="font-semibold">{scenario.name}</h3>
                {scenario.isBase && (
                  <Badge variant="secondary" className="text-xs">Base</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={onToggle}
                className="data-[state=checked]:bg-indigo-600"
              />
              {canDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>
          
          {/* Métriques clés */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Capital retraite</span>
              <span className="font-medium">
                {formatCurrency(scenario.calculations.retirementCapital || scenario.calculations.netWorth * 2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taux d'épargne</span>
              <span className="font-medium">
                {formatPercentage((scenario.calculations.savingsRate || 0) * 100)}
              </span>
            </div>
          </div>
          
          {/* Changements */}
          {scenario.changes.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {showDetails ? 'Masquer' : 'Voir'} les changements ({scenario.changes.length})
              </button>
              
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 space-y-1"
                  >
                    {scenario.changes.slice(0, 3).map((change, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        <span className="font-medium">{change.label}:</span>{' '}
                        {typeof change.newValue === 'number' 
                          ? formatCurrency(change.newValue) 
                          : change.newValue}
                        {change.impact === 'positive' && ' ↑'}
                        {change.impact === 'negative' && ' ↓'}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Vue d'ensemble de la comparaison
const ComparisonOverview: React.FC<{ comparison: ScenarioComparisonType }> = ({ comparison }) => {
  return (
    <div className="space-y-6">
      {/* Tableau de comparaison rapide */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Métrique</th>
              {comparison.scenarios.map(scenario => (
                <th key={scenario.id} className="text-center py-2 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <span>{scenario.icon}</span>
                    <span className="font-medium">{scenario.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.metrics.map((metric, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{metric.label}</td>
                {metric.values.map(value => {
                  const isBest = value.scenarioId === metric.bestScenarioId;
                  const isWorst = value.scenarioId === metric.worstScenarioId;
                  
                  return (
                    <td key={value.scenarioId} className="text-center py-3 px-4">
                      <div className={`inline-flex items-center gap-1 ${
                        isBest ? 'text-green-600 font-semibold' :
                        isWorst ? 'text-red-600' : ''
                      }`}>
                        {metric.type === 'currency' && formatCurrency(value.value)}
                        {metric.type === 'percentage' && formatPercentage(value.value * 100)}
                        {metric.type === 'years' && `${value.value} ans`}
                        {metric.type === 'number' && value.value.toLocaleString('fr-CA')}
                        {isBest && <TrendingUp className="w-4 h-4" />}
                        {isWorst && <TrendingDown className="w-4 h-4" />}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Graphique en barres pour comparaison visuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comparaison visuelle des métriques clés</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={comparison.metrics.slice(0, 4).map(metric => ({
                name: metric.label,
                ...Object.fromEntries(
                  metric.values.map(v => {
                    const scenario = comparison.scenarios.find(s => s.id === v.scenarioId);
                    return [scenario?.name || v.scenarioId, v.value];
                  })
                )
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis tickFormatter={(value) => 
                value > 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString()
              } />
              <Tooltip formatter={(value: number, name) => [
                typeof value === 'number' && value > 1000 
                  ? formatCurrency(value) 
                  : value,
                name
              ]} />
              <Legend />
              {comparison.scenarios.map((scenario, index) => (
                <Bar 
                  key={scenario.id} 
                  dataKey={scenario.name} 
                  fill={scenario.color}
                  radius={[8, 8, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// Graphique des projections
const ProjectionsChart: React.FC<{ comparison: ScenarioComparisonType }> = ({ comparison }) => {
  const chartData = comparison.projections.map(proj => ({
    age: proj.age,
    ...Object.fromEntries(
      proj.data.map(d => {
        const scenario = comparison.scenarios.find(s => s.id === d.scenarioId);
        return [scenario?.name || d.scenarioId, d.capital];
      })
    )
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Projection du capital jusqu'à la retraite</CardTitle>
        <CardDescription>
          Évolution comparative du patrimoine selon chaque scénario
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="age" 
              label={{ value: 'Âge', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M$`}
              label={{ value: 'Capital ($)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Âge: ${label} ans`}
            />
            <Legend />
            {comparison.scenarios.map(scenario => (
              <Line
                key={scenario.id}
                type="monotone"
                dataKey={scenario.name}
                stroke={scenario.color}
                strokeWidth={2.5}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Comparaison détaillée des métriques
const MetricsComparison: React.FC<{ comparison: ScenarioComparisonType }> = ({ comparison }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {comparison.metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-base">{metric.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metric.values
                .sort((a, b) => b.value - a.value)
                .map((value, idx) => {
                  const scenario = comparison.scenarios.find(s => s.id === value.scenarioId);
                  const maxValue = Math.max(...metric.values.map(v => v.value));
                  const percentage = maxValue > 0 ? (value.value / maxValue) * 100 : 0;
                  
                  return (
                    <div key={value.scenarioId} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span>{scenario?.icon}</span>
                          <span className="font-medium">{scenario?.name}</span>
                          {idx === 0 && <Badge variant="default" className="text-xs">Meilleur</Badge>}
                        </div>
                        <span className="font-semibold">
                          {metric.type === 'currency' && formatCurrency(value.value)}
                          {metric.type === 'percentage' && formatPercentage(value.value * 100)}
                          {metric.type === 'years' && `${value.value} ans`}
                          {metric.type === 'number' && value.value.toLocaleString('fr-CA')}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: scenario?.color || '#8B5CF6'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Analyse radar
const RadarAnalysis: React.FC<{ comparison: ScenarioComparisonType }> = ({ comparison }) => {
  // Normaliser les données pour le radar (0-100)
  const normalizeValue = (value: number, min: number, max: number): number => {
    if (max === min) return 50;
    return ((value - min) / (max - min)) * 100;
  };

  const radarData = comparison.metrics.map(metric => {
    const values = metric.values.map(v => v.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    const dataPoint: any = {
      metric: metric.label,
      fullMark: 100
    };
    
    metric.values.forEach(value => {
      const scenario = comparison.scenarios.find(s => s.id === value.scenarioId);
      if (scenario) {
        // Inverser pour l'âge de retraite (plus bas est mieux)
        const normalizedValue = metric.key === 'retirementAge' 
          ? normalizeValue(max - value.value + min, min, max)
          : normalizeValue(value.value, min, max);
        dataPoint[scenario.name] = normalizedValue;
      }
    });
    
    return dataPoint;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Analyse comparative multidimensionnelle</CardTitle>
        <CardDescription>
          Vue d'ensemble des performances relatives de chaque scénario
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
            {comparison.scenarios.map(scenario => (
              <Radar
                key={scenario.id}
                name={scenario.name}
                dataKey={scenario.name}
                stroke={scenario.color}
                fill={scenario.color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
        
        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Plus la surface couverte est grande, meilleur est le scénario sur l'ensemble des critères.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

// Dialog de création de scénario personnalisé
const CreateScenarioDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  baseData: UserData;
  onCreate: (scenario: Scenario) => void;
}> = ({ open, onOpenChange, baseData, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modifications, setModifications] = useState<any>({});
  
  const handleCreate = () => {
    if (!name) return;
    
    const scenario = ScenarioService.createScenario(
      baseData,
      modifications,
      name,
      description || 'Scénario personnalisé',
      '🎯',
      '#6366F1'
    );
    
    onCreate(scenario);
    setName('');
    setDescription('');
    setModifications({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un nouveau scénario</DialogTitle>
          <DialogDescription>
            Personnalisez les paramètres pour explorer différentes possibilités
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du scénario</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Retraite à 60 ans avec épargne maximale"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez les changements principaux de ce scénario"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Modifications rapides</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Âge de retraite</Label>
                <Input
                  type="number"
                  placeholder={baseData.retirement.rrqAgeActuel1?.toString() || '65'}
                  onChange={(e) => setModifications({
                    ...modifications,
                    retirement: {
                      ...modifications.retirement,
                      rrqAgeActuel1: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
              <div>
                <Label className="text-xs">Épargne mensuelle additionnelle</Label>
                <Input
                  type="number"
                  placeholder="0"
                  onChange={(e) => setModifications({
                    ...modifications,
                    cashflow: {
                      ...modifications.cashflow,
                      epargne: (baseData.cashflow.epargne || 0) + parseInt(e.target.value || '0')
                    }
                  })}
                />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleCreate} disabled={!name}>
            Créer le scénario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};