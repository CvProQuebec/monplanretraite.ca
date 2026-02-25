// Onglet des simulations financières - Plan Ultimate
// Simulations avancées avec scénarios multiples et analyses de sensibilité
// Respectant la typographie québécoise et les limites professionnelles

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  TrendingUp, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  BarChart3,
  Target,
  AlertTriangle,
  Info,
  Calculator,
  Clock,
  DollarSign,
  Percent,
  Calendar,
  TrendingDown,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UltimatePlanningService } from '../../services/UltimatePlanningService';
import { UltimatePlanningData, FinancialSimulation, SimulationParameters } from '../../types/ultimate-planning';
import { useToast } from '@/hooks/use-toast';

interface FinancialSimulationsTabProps {
  data: UltimatePlanningData;
  onUpdate: (data: UltimatePlanningData) => void;
}

export const FinancialSimulationsTab: React.FC<FinancialSimulationsTabProps> = ({ 
  data, 
  onUpdate 
}) => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<FinancialSimulation | null>(null);
  const [newSimulationName, setNewSimulationName] = useState('');
  const [newSimulationDescription, setNewSimulationDescription] = useState('');
  const [newSimulationParams, setNewSimulationParams] = useState<SimulationParameters>({
    timeHorizon: 20,
    inflationRate: 0.02,
    investmentReturn: 0.06,
    taxRate: 0.25,
    optimisticScenario: false,
    pessimisticScenario: false,
    realisticScenario: true,
    customParameters: {}
  });

  const handleCreateSimulation = () => {
    if (!newSimulationName.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez saisir un nom pour la simulation',
        variant: 'destructive'
      });
      return;
    }

    try {
      const newSimulation = UltimatePlanningService.createFinancialSimulation(
        newSimulationName,
        newSimulationDescription,
        newSimulationParams
      );
      
      const updatedData = { ...data };
      updatedData.financialSimulations.push(newSimulation);
      
      onUpdate(updatedData);
      
      setShowCreateDialog(false);
      setNewSimulationName('');
      setNewSimulationDescription('');
      setNewSimulationParams({
        timeHorizon: 20,
        inflationRate: 0.02,
        investmentReturn: 0.06,
        taxRate: 0.25,
        optimisticScenario: false,
        pessimisticScenario: false,
        realisticScenario: true,
        customParameters: {}
      });
      
      toast({
        title: 'Succès',
        description: 'Simulation financière créée avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création de la simulation',
        variant: 'destructive'
      });
    }
  };

  const handleViewSimulation = (simulation: FinancialSimulation) => {
    setSelectedSimulation(simulation);
    setShowViewDialog(true);
  };

  const handleDeleteSimulation = (simulationId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette simulation ? Cette action est irréversible.')) {
      try {
        const updatedData = { ...data };
        updatedData.financialSimulations = updatedData.financialSimulations.filter(s => s.id !== simulationId);
        onUpdate(updatedData);
        
        toast({
          title: 'Succès',
          description: 'Simulation supprimée avec succès',
        });
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Erreur lors de la suppression',
          variant: 'destructive'
        });
      }
    }
  };

  const handleExportSimulation = (simulation: FinancialSimulation) => {
    try {
      const simulationData = JSON.stringify(simulation, null, 2);
      const blob = new Blob([simulationData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${simulation.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export réussi',
        description: 'Simulation exportée avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'export',
        variant: 'destructive'
      });
    }
  };

  const formatPercentage = (value: number) => `${(value * 100).toFixed(2)} %`;
  const formatCurrency = (value: number) => `${value.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}`;

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Simulations financières
              </CardTitle>
              <CardDescription>
                Créez et analysez des scénarios financiers avancés pour votre planification
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle simulation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">{data.financialSimulations.length}</div>
              <div className="text-sm text-green-700">Total des simulations</div>
            </div>
            <div className="text-center p-4 bg-mpr-interactive-lt rounded-lg">
              <div className="text-2xl font-bold text-mpr-navy">
                {data.financialSimulations.filter(s => s.parameters.realisticScenario).length}
              </div>
              <div className="text-sm text-mpr-navy">Scénarios réalistes</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">
                {data.financialSimulations.filter(s => s.parameters.optimisticScenario).length}
              </div>
              <div className="text-sm text-orange-700">Scénarios optimistes</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-900">
                {data.financialSimulations.filter(s => s.parameters.pessimisticScenario).length}
              </div>
              <div className="text-sm text-red-700">Scénarios pessimistes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des simulations */}
      {data.financialSimulations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune simulation créée</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par créer votre première simulation financière pour analyser différents scénarios
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Créer une simulation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data.financialSimulations.map((simulation) => (
            <motion.div
              key={simulation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <div>
                          <h3 className="text-lg font-semibold">{simulation.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Créé le {new Date(simulation.createdAt).toLocaleDateString('fr-CA')}</span>
                            <span>•</span>
                            <span>Modifié le {new Date(simulation.lastModified).toLocaleDateString('fr-CA')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">
                        {simulation.description}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {simulation.parameters.timeHorizon} ans
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Percent className="h-3 w-3 mr-1" />
                          Inflation : {formatPercentage(simulation.parameters.inflationRate)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Rendement : {formatPercentage(simulation.parameters.investmentReturn)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <DollarSign className="h-3 w-3 mr-1" />
                          Taxes : {formatPercentage(simulation.parameters.taxRate)}
                        </Badge>
                      </div>

                      {/* Scénarios */}
                      <div className="flex items-center gap-2 mb-3">
                        {simulation.parameters.realisticScenario && (
                          <Badge variant="default" className="text-xs">Scénario réaliste</Badge>
                        )}
                        {simulation.parameters.optimisticScenario && (
                          <Badge variant="outline" className="text-xs text-green-600">Scénario optimiste</Badge>
                        )}
                        {simulation.parameters.pessimisticScenario && (
                          <Badge variant="outline" className="text-xs text-red-600">Scénario pessimiste</Badge>
                        )}
                      </div>

                      {/* Résultats clés */}
                      {simulation.results.keyMetrics && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600">Croissance</div>
                            <div className="text-lg font-bold text-green-600">
                              {formatPercentage(simulation.results.keyMetrics.netWorthGrowth)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600">Ratio dette</div>
                            <div className="text-lg font-bold text-mpr-interactive">
                              {simulation.results.keyMetrics.debtToAssetRatio.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600">Liquidité</div>
                            <div className="text-lg font-bold text-purple-600">
                              {simulation.results.keyMetrics.liquidityRatio.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600">Efficacité fiscale</div>
                            <div className="text-lg font-bold text-orange-600">
                              {formatPercentage(simulation.results.keyMetrics.taxEfficiency)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSimulation(simulation)}
                        title="Voir la simulation"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportSimulation(simulation)}
                        title="Exporter la simulation"
                      >
                        <Download className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSimulation(simulation.id)}
                        title="Supprimer la simulation"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dialog de création de simulation */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle simulation</DialogTitle>
            <DialogDescription>
              Configurez les paramètres de votre simulation financière
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="simulation-name">Nom de la simulation</Label>
              <Input
                id="simulation-name"
                value={newSimulationName}
                onChange={(e) => setNewSimulationName(e.target.value)}
                placeholder="Ex: Planification retraite - Scénario réaliste"
              />
            </div>

            <div>
              <Label htmlFor="simulation-description">Description</Label>
              <Textarea
                id="simulation-description"
                value={newSimulationDescription}
                onChange={(e) => setNewSimulationDescription(e.target.value)}
                placeholder="Décrivez l'objectif de cette simulation"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time-horizon">Horizon temporel (années)</Label>
                <Input
                  id="time-horizon"
                  type="number"
                  value={newSimulationParams.timeHorizon}
                  onChange={(e) => setNewSimulationParams({
                    ...newSimulationParams,
                    timeHorizon: parseInt(e.target.value) || 20
                  })}
                  min="5"
                  max="50"
                />
              </div>

              <div>
                <Label htmlFor="inflation-rate">Taux d'inflation</Label>
                <div className="relative">
                  <Input
                    id="inflation-rate"
                    type="number"
                    step="0.001"
                    value={newSimulationParams.inflationRate}
                    onChange={(e) => setNewSimulationParams({
                      ...newSimulationParams,
                      inflationRate: parseFloat(e.target.value) || 0.02
                    })}
                    min="0"
                    max="0.2"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="investment-return">Rendement des investissements</Label>
                <div className="relative">
                  <Input
                    id="investment-return"
                    type="number"
                    step="0.001"
                    value={newSimulationParams.investmentReturn}
                    onChange={(e) => setNewSimulationParams({
                      ...newSimulationParams,
                      investmentReturn: parseFloat(e.target.value) || 0.06
                    })}
                    min="0"
                    max="0.3"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="tax-rate">Taux d'imposition</Label>
                <div className="relative">
                  <Input
                    id="tax-rate"
                    type="number"
                    step="0.001"
                    value={newSimulationParams.taxRate}
                    onChange={(e) => setNewSimulationParams({
                      ...newSimulationParams,
                      taxRate: parseFloat(e.target.value) || 0.25
                    })}
                    min="0"
                    max="0.6"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Types de scénarios</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newSimulationParams.realisticScenario}
                    onChange={(e) => setNewSimulationParams({
                      ...newSimulationParams,
                      realisticScenario: e.target.checked
                    })}
                  />
                  <span className="text-sm">Scénario réaliste</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newSimulationParams.optimisticScenario}
                    onChange={(e) => setNewSimulationParams({
                      ...newSimulationParams,
                      optimisticScenario: e.target.checked
                    })}
                  />
                  <span className="text-sm">Scénario optimiste</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newSimulationParams.pessimisticScenario}
                    onChange={(e) => setNewSimulationParams({
                      ...newSimulationParams,
                      pessimisticScenario: e.target.checked
                    })}
                  />
                  <span className="text-sm">Scénario pessimiste</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateSimulation}>
                Créer la simulation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de visualisation de la simulation */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {selectedSimulation?.name}
            </DialogTitle>
            <DialogDescription>
              Détails complets de la simulation financière
            </DialogDescription>
          </DialogHeader>
          
          {selectedSimulation && (
            <div className="space-y-6">
              {/* Paramètres de la simulation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Paramètres de la simulation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-mpr-interactive-lt rounded-lg">
                      <div className="text-sm text-mpr-interactive">Horizon temporel</div>
                      <div className="text-xl font-bold text-mpr-navy">{selectedSimulation.parameters.timeHorizon} ans</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-600">Taux d'inflation</div>
                      <div className="text-xl font-bold text-green-900">{formatPercentage(selectedSimulation.parameters.inflationRate)}</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-600">Rendement invest.</div>
                      <div className="text-xl font-bold text-purple-900">{formatPercentage(selectedSimulation.parameters.investmentReturn)}</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-sm text-orange-600">Taux d'imposition</div>
                      <div className="text-xl font-bold text-orange-900">{formatPercentage(selectedSimulation.parameters.taxRate)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Projections financières */}
              {selectedSimulation.results.projections && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Projections financières</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Année</th>
                            <th className="text-right p-2">Valeur nette</th>
                            <th className="text-right p-2">Actifs liquides</th>
                            <th className="text-right p-2">Immobilier</th>
                            <th className="text-right p-2">Investissements</th>
                            <th className="text-right p-2">Dettes</th>
                            <th className="text-right p-2">Impôts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedSimulation.results.projections.slice(0, 10).map((projection) => (
                            <tr key={projection.year} className="border-b hover:bg-gray-50">
                              <td className="p-2 font-medium">{projection.year}</td>
                              <td className="p-2 text-right">{formatCurrency(projection.netWorth)}</td>
                              <td className="p-2 text-right">{formatCurrency(projection.liquidAssets)}</td>
                              <td className="p-2 text-right">{formatCurrency(projection.realEstate)}</td>
                              <td className="p-2 text-right">{formatCurrency(projection.investments)}</td>
                              <td className="p-2 text-right">{formatCurrency(projection.debts)}</td>
                              <td className="p-2 text-right">{formatCurrency(projection.taxes)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Analyse de sensibilité */}
              {selectedSimulation.sensitivityAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Analyse de sensibilité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Tests de résistance */}
                      <div>
                        <h4 className="font-medium mb-2">Tests de résistance</h4>
                        <div className="space-y-2">
                          {selectedSimulation.sensitivityAnalysis.stressTests.map((test, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{test.name}</span>
                                <Badge variant={test.impact === 'critique' ? 'destructive' : 'outline'}>
                                  {test.impact}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span>Probabilité : {formatPercentage(test.probability)}</span>
                                <span>Mitigation : {test.mitigation}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Variables critiques */}
                      <div>
                        <h4 className="font-medium mb-2">Variables critiques</h4>
                        <div className="space-y-2">
                          {selectedSimulation.sensitivityAnalysis.criticalVariables.map((variable, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{variable.name}</span>
                                <span className="text-sm text-muted-foreground">Impact : {variable.impact}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                                <div>Actuel : {variable.currentValue}</div>
                                <div>Min : {variable.minValue}</div>
                                <div>Max : {variable.maxValue}</div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <strong>Recommandations :</strong> {variable.recommendations.join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommandations générales */}
                      <div>
                        <h4 className="font-medium mb-2">Recommandations générales</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {selectedSimulation.sensitivityAnalysis.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
