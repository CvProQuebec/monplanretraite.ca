// Onglet de planification successorale - Plan Ultimate
// Stratégies de protection, optimisation fiscale et planification d'assurance
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Target,
  AlertTriangle,
  Info,
  Calculator,
  Clock,
  DollarSign,
  Percent,
  Calendar,
  TrendingUp,
  Activity,
  Heart,
  Building,
  CreditCard,
  Home,
  Car,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UltimatePlanningService } from '../../services/UltimatePlanningService';
import { UltimatePlanningData, AssetProtectionStrategy, TaxOptimizationStrategy, InsurancePlanningStrategy } from '../../types/ultimate-planning';
import { useToast } from '@/hooks/use-toast';

interface EstatePlanningTabProps {
  data: UltimatePlanningData;
  onUpdate: (data: UltimatePlanningData) => void;
}

export const EstatePlanningTab: React.FC<EstatePlanningTabProps> = ({ 
  data, 
  onUpdate 
}) => {
  const { toast } = useToast();
  const [showStrategyDialog, setShowStrategyDialog] = useState(false);
  const [strategyType, setStrategyType] = useState<'protection' | 'tax' | 'insurance'>('protection');
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    description: '',
    type: 'assurance' as const,
    implementation: '',
    benefits: [''],
    risks: [''],
    cost: 0,
    timeline: '',
    priority: 'moyenne' as const,
    coverageType: '',
    taxBenefit: '',
    requirements: [''],
    limitations: [''],
    estimatedSavings: 0,
    complexity: 'modérée' as const,
    recommendations: ['']
  });

  const handleCreateStrategy = () => {
    if (!newStrategy.name.trim() || !newStrategy.description.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive'
      });
      return;
    }

    try {
      const updatedData = { ...data };
      
      switch (strategyType) {
        case 'protection':
          const protectionStrategy: AssetProtectionStrategy = {
            id: `strategy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: newStrategy.name,
            description: newStrategy.description,
            type: newStrategy.type,
            implementation: newStrategy.implementation,
            benefits: newStrategy.benefits.filter(b => b.trim()),
            risks: newStrategy.risks.filter(r => r.trim()),
            cost: newStrategy.cost,
            timeline: newStrategy.timeline,
            priority: newStrategy.priority
          };
          updatedData.estatePlanning.assetProtection.push(protectionStrategy);
          break;
          
        case 'tax':
          const taxStrategy: TaxOptimizationStrategy = {
            id: `strategy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: newStrategy.name,
            description: newStrategy.description,
            taxBenefit: newStrategy.taxBenefit,
            implementation: newStrategy.implementation,
            requirements: newStrategy.requirements.filter(r => r.trim()),
            limitations: newStrategy.limitations.filter(l => l.trim()),
            estimatedSavings: newStrategy.estimatedSavings,
            complexity: newStrategy.complexity
          };
          updatedData.estatePlanning.taxOptimization.push(taxStrategy);
          break;
          
        case 'insurance':
          const insuranceStrategy: InsurancePlanningStrategy = {
            id: `strategy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: newStrategy.name,
            description: newStrategy.description,
            coverageType: newStrategy.coverageType,
            benefits: newStrategy.benefits.filter(b => b.trim()),
            costs: newStrategy.cost,
            recommendations: newStrategy.recommendations.filter(r => r.trim()),
            priority: newStrategy.priority
          };
          updatedData.estatePlanning.insurancePlanning.push(insuranceStrategy);
          break;
      }
      
      onUpdate(updatedData);
      
      setShowStrategyDialog(false);
      resetNewStrategy();
      
      toast({
        title: 'Succès',
        description: 'Stratégie créée avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création de la stratégie',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteStrategy = (strategyId: string, type: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette stratégie ? Cette action est irréversible.')) {
      try {
        const updatedData = { ...data };
        
        switch (type) {
          case 'protection':
            updatedData.estatePlanning.assetProtection = updatedData.estatePlanning.assetProtection.filter(s => s.id !== strategyId);
            break;
          case 'tax':
            updatedData.estatePlanning.taxOptimization = updatedData.estatePlanning.taxOptimization.filter(s => s.id !== strategyId);
            break;
          case 'insurance':
            updatedData.estatePlanning.insurancePlanning = updatedData.estatePlanning.insurancePlanning.filter(s => s.id !== strategyId);
            break;
        }
        
        onUpdate(updatedData);
        
        toast({
          title: 'Succès',
          description: 'Stratégie supprimée avec succès',
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

  const resetNewStrategy = () => {
    setNewStrategy({
      name: '',
      description: '',
      type: 'assurance',
      implementation: '',
      benefits: [''],
      risks: [''],
      cost: 0,
      timeline: '',
      priority: 'moyenne',
      coverageType: '',
      taxBenefit: '',
      requirements: [''],
      limitations: [''],
      estimatedSavings: 0,
      complexity: 'modérée',
      recommendations: ['']
    });
  };

  const addBenefit = () => {
    setNewStrategy(prev => ({ ...prev, benefits: [...prev.benefits, ''] }));
  };

  const removeBenefit = (index: number) => {
    setNewStrategy(prev => ({ 
      ...prev, 
      benefits: prev.benefits.filter((_, i) => i !== index) 
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setNewStrategy(prev => ({
      ...prev,
      benefits: prev.benefits.map((b, i) => i === index ? value : b)
    }));
  };

  const addRisk = () => {
    setNewStrategy(prev => ({ ...prev, risks: [...prev.risks, ''] }));
  };

  const removeRisk = (index: number) => {
    setNewStrategy(prev => ({ 
      ...prev, 
      risks: prev.risks.filter((_, i) => i !== index) 
    }));
  };

  const updateRisk = (index: number, value: string) => {
    setNewStrategy(prev => ({
      ...prev,
      risks: prev.risks.map((r, i) => i === index ? value : r)
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'élevée':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moyenne':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'faible':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'légal':
        return <Building className="h-4 w-4" />;
      case 'financier':
        return <CreditCard className="h-4 w-4" />;
      case 'assurance':
        return <Heart className="h-4 w-4" />;
      case 'structurel':
        return <Home className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => `${value.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}`;

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Planification successorale
              </CardTitle>
              <CardDescription>
                Stratégies avancées pour protéger et optimiser votre patrimoine
              </CardDescription>
            </div>
            <Button onClick={() => setShowStrategyDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle stratégie
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{data.estatePlanning.assetProtection.length}</div>
              <div className="text-sm text-blue-700">Stratégies de protection</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">{data.estatePlanning.taxOptimization.length}</div>
              <div className="text-sm text-green-700">Optimisations fiscales</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">{data.estatePlanning.insurancePlanning.length}</div>
              <div className="text-sm text-purple-700">Planifications d'assurance</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">
                {data.estatePlanning.assetProtection.length + data.estatePlanning.taxOptimization.length + data.estatePlanning.insurancePlanning.length}
              </div>
              <div className="text-sm text-orange-700">Total des stratégies</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stratégies de protection des actifs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Stratégies de protection des actifs
          </CardTitle>
          <CardDescription>
            Stratégies pour protéger votre patrimoine contre les risques
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.estatePlanning.assetProtection.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4" />
              <p>Aucune stratégie de protection configurée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.estatePlanning.assetProtection.map((strategy) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(strategy.type)}
                            <h3 className="font-semibold">{strategy.name}</h3>
                            <Badge className={getPriorityColor(strategy.priority)}>
                              {strategy.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="text-sm">
                              <span className="font-medium">Coût :</span> {formatCurrency(strategy.cost)}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Délai :</span> {strategy.timeline}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Type :</span> {strategy.type}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Bénéfices :</span> {strategy.benefits.length}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-green-600">Bénéfices :</span>
                              <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                                {strategy.benefits.map((benefit, index) => (
                                  <li key={index}>{benefit}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-red-600">Risques :</span>
                              <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                                {strategy.risks.map((risk, index) => (
                                  <li key={index}>{risk}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteStrategy(strategy.id, 'protection')}
                            title="Supprimer la stratégie"
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
        </CardContent>
      </Card>

      {/* Optimisations fiscales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Optimisations fiscales
          </CardTitle>
          <CardDescription>
            Stratégies pour minimiser les impôts successoraux
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.estatePlanning.taxOptimization.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-4" />
              <p>Aucune stratégie d'optimisation fiscale configurée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.estatePlanning.taxOptimization.map((strategy) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{strategy.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="text-sm">
                              <span className="font-medium">Bénéfice fiscal :</span> {strategy.taxBenefit}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Économies estimées :</span> {formatCurrency(strategy.estimatedSavings)}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Complexité :</span> {strategy.complexity}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Exigences :</span> {strategy.requirements.length}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-blue-600">Exigences :</span>
                              <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                                {strategy.requirements.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-orange-600">Limitations :</span>
                              <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                                {strategy.limitations.map((lim, index) => (
                                  <li key={index}>{lim}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteStrategy(strategy.id, 'tax')}
                            title="Supprimer la stratégie"
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
        </CardContent>
      </Card>

      {/* Planification d'assurance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Planification d'assurance
          </CardTitle>
          <CardDescription>
            Stratégies d'assurance pour protéger votre famille et vos actifs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.estatePlanning.insurancePlanning.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <p>Aucune stratégie d'assurance configurée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.estatePlanning.insurancePlanning.map((strategy) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{strategy.name}</h3>
                            <Badge className={getPriorityColor(strategy.priority)}>
                              {strategy.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="text-sm">
                              <span className="font-medium">Type de couverture :</span> {strategy.coverageType}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Coût :</span> {formatCurrency(strategy.costs)}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Bénéfices :</span> {strategy.benefits.length}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Recommandations :</span> {strategy.recommendations.length}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-green-600">Bénéfices :</span>
                              <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                                {strategy.benefits.map((benefit, index) => (
                                  <li key={index}>{benefit}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-blue-600">Recommandations :</span>
                              <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                                {strategy.recommendations.map((rec, index) => (
                                  <li key={index}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteStrategy(strategy.id, 'insurance')}
                            title="Supprimer la stratégie"
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
        </CardContent>
      </Card>

      {/* Dialog de création de stratégie */}
      <Dialog open={showStrategyDialog} onOpenChange={setShowStrategyDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle stratégie</DialogTitle>
            <DialogDescription>
              Configurez les paramètres de votre stratégie de planification successorale
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Type de stratégie</Label>
              <Select value={strategyType} onValueChange={(value: any) => setStrategyType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="protection">Protection des actifs</SelectItem>
                  <SelectItem value="tax">Optimisation fiscale</SelectItem>
                  <SelectItem value="insurance">Planification d'assurance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="strategy-name">Nom de la stratégie</Label>
              <Input
                id="strategy-name"
                value={newStrategy.name}
                onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })}
                placeholder="Ex: Assurance-vie adéquate"
              />
            </div>

            <div>
              <Label htmlFor="strategy-description">Description</Label>
              <Textarea
                id="strategy-description"
                value={newStrategy.description}
                onChange={(e) => setNewStrategy({ ...newStrategy, description: e.target.value })}
                placeholder="Décrivez l'objectif de cette stratégie"
                rows={3}
              />
            </div>

            {strategyType === 'protection' && (
              <>
                <div>
                  <Label htmlFor="strategy-type">Type de protection</Label>
                  <Select value={newStrategy.type} onValueChange={(value: any) => setNewStrategy({ ...newStrategy, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="légal">Légal</SelectItem>
                      <SelectItem value="financier">Financier</SelectItem>
                      <SelectItem value="assurance">Assurance</SelectItem>
                      <SelectItem value="structurel">Structurel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="strategy-implementation">Mise en œuvre</Label>
                  <Textarea
                    id="strategy-implementation"
                    value={newStrategy.implementation}
                    onChange={(e) => setNewStrategy({ ...newStrategy, implementation: e.target.value })}
                    placeholder="Décrivez comment mettre en œuvre cette stratégie"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="strategy-cost">Coût estimé</Label>
                    <Input
                      id="strategy-cost"
                      type="number"
                      value={newStrategy.cost}
                      onChange={(e) => setNewStrategy({ ...newStrategy, cost: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="strategy-timeline">Délai de mise en œuvre</Label>
                    <Input
                      id="strategy-timeline"
                      value={newStrategy.timeline}
                      onChange={(e) => setNewStrategy({ ...newStrategy, timeline: e.target.value })}
                      placeholder="Ex: 6 mois"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="strategy-priority">Priorité</Label>
                  <Select value={newStrategy.priority} onValueChange={(value: any) => setNewStrategy({ ...newStrategy, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="élevée">Élevée</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="faible">Faible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {strategyType === 'tax' && (
              <>
                <div>
                  <Label htmlFor="strategy-tax-benefit">Bénéfice fiscal</Label>
                  <Input
                    id="strategy-tax-benefit"
                    value={newStrategy.taxBenefit}
                    onChange={(e) => setNewStrategy({ ...newStrategy, taxBenefit: e.target.value })}
                    placeholder="Ex: Réduction des impôts successoraux"
                  />
                </div>

                <div>
                  <Label htmlFor="strategy-implementation">Mise en œuvre</Label>
                  <Textarea
                    id="strategy-implementation"
                    value={newStrategy.implementation}
                    onChange={(e) => setNewStrategy({ ...newStrategy, implementation: e.target.value })}
                    placeholder="Décrivez comment mettre en œuvre cette stratégie"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="strategy-estimated-savings">Économies estimées</Label>
                    <Input
                      id="strategy-estimated-savings"
                      type="number"
                      value={newStrategy.estimatedSavings}
                      onChange={(e) => setNewStrategy({ ...newStrategy, estimatedSavings: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="strategy-complexity">Complexité</Label>
                    <Select value={newStrategy.complexity} onValueChange={(value: any) => setNewStrategy({ ...newStrategy, complexity: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la complexité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="modérée">Modérée</SelectItem>
                        <SelectItem value="complexe">Complexe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {strategyType === 'insurance' && (
              <>
                <div>
                  <Label htmlFor="strategy-coverage-type">Type de couverture</Label>
                  <Input
                    id="strategy-coverage-type"
                    value={newStrategy.coverageType}
                    onChange={(e) => setNewStrategy({ ...newStrategy, coverageType: e.target.value })}
                    placeholder="Ex: Assurance-vie, assurance-invalidité"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="strategy-cost">Coût estimé</Label>
                    <Input
                      id="strategy-cost"
                      type="number"
                      value={newStrategy.cost}
                      onChange={(e) => setNewStrategy({ ...newStrategy, cost: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="strategy-priority">Priorité</Label>
                    <Select value={newStrategy.priority} onValueChange={(value: any) => setNewStrategy({ ...newStrategy, priority: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="élevée">Élevée</SelectItem>
                        <SelectItem value="moyenne">Moyenne</SelectItem>
                        <SelectItem value="faible">Faible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Bénéfices */}
            <div>
              <Label>Bénéfices</Label>
              <div className="space-y-2">
                {newStrategy.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      placeholder={`Bénéfice ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeBenefit(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addBenefit} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un bénéfice
                </Button>
              </div>
            </div>

            {/* Risques (pour protection) */}
            {strategyType === 'protection' && (
              <div>
                <Label>Risques</Label>
                <div className="space-y-2">
                  {newStrategy.risks.map((risk, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={risk}
                        onChange={(e) => updateRisk(index, e.target.value)}
                        placeholder={`Risque ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeRisk(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addRisk} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un risque
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowStrategyDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateStrategy}>
                Créer la stratégie
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Informations et aide */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Info className="h-5 w-5" />
            À propos de la planification successorale
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <p className="mb-3">
            La planification successorale avancée vous permet de créer des stratégies personnalisées 
            pour protéger votre patrimoine, optimiser vos impôts et planifier vos assurances.
          </p>
          <p>
            <strong>Note importante :</strong> Ces stratégies sont des recommandations générales. 
            Consultez toujours un professionnel qualifié (notaire, avocat, conseiller financier) 
            pour valider leur applicabilité à votre situation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
