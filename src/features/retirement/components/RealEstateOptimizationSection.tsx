// src/features/retirement/components/RealEstateOptimizationSection.tsx

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Home, DollarSign, TrendingUp, Calculator, 
  FileText, CheckCircle, AlertTriangle, Info,
  PieChart, BarChart3, Target, Clock
} from 'lucide-react';

import { RealEstateOptimizationService, RealEstateProperty, RREGOPContext, SaleScenario } from '@/services/RealEstateOptimizationService';
interface RealEstateOptimizationSectionProps {
  className?: string;
  userPlan: 'free' | 'professional' | 'ultimate';
}

export const RealEstateOptimizationSection: React.FC<RealEstateOptimizationSectionProps> = ({ 
  className, 
  userPlan 
}) => {
  // Données utilisateur simulées
  const userData = {
    personal: {
      age: 55,
      situationFamiliale: 'couple',
      revenuAnnuel: 80000
    },
    retirement: {
      ageRetraiteSouhaite: 62,
      epargneActuelle: 150000
    }
  };
  
  const updateUserData = (data: any) => {
    console.log('Mise à jour des données utilisateur:', data);
  };
  const [activeTab, setActiveTab] = useState('analyse');
  const [isCalculating, setIsCalculating] = useState(false);
  
  // État pour les données immobilières
  const [propertyData, setPropertyData] = useState<RealEstateProperty>({
    valeurMarchande: 450000,
    coutBaseAjuste: 280000,
    amortissementCumule: 85000,
    anneeAcquisition: 2010,
    typeProprieteDuplex: 'DUPLEX',
    revenusLocatifsAnnuels: 28800,
    depensesAnnuelles: {
      entretien: 3200,
      taxes: 4800,
      assurances: 1200,
      hypotheque: 8400,
      gestion: 0,
      autres: 1500
    },
    appreciationAnnuelle: 3.5,
    augmentationLoyersAnnuelle: 2.5
  });
  
  // État pour le contexte RREGOP
  const [rregopContext, setRregopContext] = useState<RREGOPContext>({
    anneesCotisees: 15,
    salaireAnnuelMoyen: 65000,
    ageActuel: 55,
    ageRetraitePrevu: 62,
    anneesManquantes: 8,
    coutRachatParAnnee: 12500,
    impactPensionViagere: 125
  });
  
  // Résultats des calculs
  const [results, setResults] = useState<{
    propertyAnalysis?: any;
    saleScenarios?: SaleScenario[];
    reinvestmentStrategies?: any[];
    scenarioComparison?: any;
    executionPlan?: any;
  }>({});
  
  // Vérification des accès selon le plan (simplifiée)
  const hasRealEstateAccess = userPlan !== 'free';
  const hasAdvancedAnalytics = userPlan === 'ultimate';
  const hasMonteCarloAccess = userPlan !== 'free';
  
  // Calculs en temps réel
  const liveCalculations = useMemo(() => {
    if (!hasRealEstateAccess) return null;
    
    const revenusNets = propertyData.revenusLocatifsAnnuels - 
      Object.values(propertyData.depensesAnnuelles).reduce((sum, val) => sum + val, 0);
    
    const rendementBrut = (propertyData.revenusLocatifsAnnuels / propertyData.valeurMarchande) * 100;
    const rendementNet = (revenusNets / propertyData.valeurMarchande) * 100;
    
    const plusValue = propertyData.valeurMarchande - propertyData.coutBaseAjuste;
    const impotEstime = plusValue * 0.175; // Estimation conservative
    
    return {
      revenusNets,
      rendementBrut,
      rendementNet,
      plusValue,
      impotEstime,
      liquiditeNette: propertyData.valeurMarchande - impotEstime
    };
  }, [propertyData, hasRealEstateAccess]);
  
  // Fonction de calcul complet
  const calculateAll = async () => {
    if (!hasRealEstateAccess) return;
    
    setIsCalculating(true);
    try {
      // Analyse de la propriété
      const analysis = RealEstateOptimizationService.analyzeProperty(propertyData);
      
      // Génération des scénarios
      const scenarios = RealEstateOptimizationService.generateSaleScenarios(
        propertyData, 
        rregopContext, 
        { hasReplacementProperty: false }
      );
      
      // Comparaison des scénarios
      const comparison = RealEstateOptimizationService.compareScenarios(scenarios);
      
      // Plan d'exécution
      const executionPlan = RealEstateOptimizationService.generateExecutionPlan(
        comparison.meilleurScenario,
        propertyData
      );
      
      setResults({
        propertyAnalysis: analysis,
        saleScenarios: scenarios,
        scenarioComparison: comparison,
        executionPlan
      });
      
    } catch (error) {
      console.error('Erreur lors des calculs:', error);
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Si l'utilisateur n'a pas accès, afficher le message d'upgrade
  if (!hasRealEstateAccess) {
    return (
      <PlanRestrictedSection
        featureName="Module d'optimisation immobilière de retraite"
        requiredPlan="professional"
        userPlan={userPlan}
        description="Analysez vos propriétés à revenus et optimisez votre retraite avec des stratégies RREGOP avancées."
        icon={Home}
      />
    );
  }
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-mpr-interactive to-purple-600 p-4 rounded-full shadow-lg">
            <Home className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Optimisation immobilière de retraite
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Analysez vos propriétés à revenus et optimisez votre retraite avec des stratégies RREGOP avancées
        </p>
      </div>
      
      {/* Navigation par onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analyse" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Analyse propriété
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Scénarios de vente
          </TabsTrigger>
          <TabsTrigger value="reinvestissement" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Réinvestissement
          </TabsTrigger>
          <TabsTrigger value="comparaison" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Comparaison
          </TabsTrigger>
          <TabsTrigger value="execution" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Plan d'exécution
          </TabsTrigger>
        </TabsList>
        
        {/* Onglet 1: Analyse Propriété */}
        <TabsContent value="analyse" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Analyse de la propriété
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Données de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Données de base</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="valeurMarchande">Valeur marchande</Label>
                      <Input
                        id="valeurMarchande"
                        type="number"
                        value={propertyData.valeurMarchande}
                        onChange={(e) => setPropertyData(prev => ({
                          ...prev,
                          valeurMarchande: Number(e.target.value)
                        }))}
                        placeholder="450 000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="coutBaseAjuste">Coût de base ajusté</Label>
                      <Input
                        id="coutBaseAjuste"
                        type="number"
                        value={propertyData.coutBaseAjuste}
                        onChange={(e) => setPropertyData(prev => ({
                          ...prev,
                          coutBaseAjuste: Number(e.target.value)
                        }))}
                        placeholder="280 000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="revenusLocatifs">Revenus locatifs annuels</Label>
                      <Input
                        id="revenusLocatifs"
                        type="number"
                        value={propertyData.revenusLocatifsAnnuels}
                        onChange={(e) => setPropertyData(prev => ({
                          ...prev,
                          revenusLocatifsAnnuels: Number(e.target.value)
                        }))}
                        placeholder="28 800"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Calculs en temps réel</h3>
                  {liveCalculations && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Rendement brut:</span>
                        <Badge variant="secondary">{liveCalculations.rendementBrut.toFixed(2)}%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Rendement net:</span>
                        <Badge variant="secondary">{liveCalculations.rendementNet.toFixed(2)}%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Plus-value:</span>
                        <Badge variant="outline">{liveCalculations.plusValue.toLocaleString()} $</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Impôt estimé:</span>
                        <Badge variant="destructive">{liveCalculations.impotEstime.toLocaleString()} $</Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bouton de calcul */}
              <div className="text-center">
                <Button 
                  onClick={calculateAll}
                  disabled={isCalculating}
                  className="bg-mpr-interactive hover:bg-mpr-interactive-dk"
                >
                  {isCalculating ? 'Calcul en cours...' : 'Lancer l\'Analyse Complète'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet 2: Scénarios de Vente */}
        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Scénarios de Vente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.saleScenarios ? (
                <div className="space-y-4">
                  {results.saleScenarios.map((scenario, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">{scenario.nom}</h4>
                        <Badge variant={scenario.type === 'COMPTANT' ? 'default' : 'secondary'}>
                          {scenario.type}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Gain en capital:</span>
                          <div className="font-semibold">{scenario.gainEnCapital.toLocaleString()} $</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Impôt total:</span>
                          <div className="font-semibold text-red-600">{scenario.impotTotalDu.toLocaleString()} $</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Liquidité nette:</span>
                          <div className="font-semibold text-green-600">{scenario.liquiditeNette.toLocaleString()} $</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Stratégies:</span>
                          <div className="font-semibold">{scenario.strategies.length}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Lancez l'analyse pour voir les scénarios de vente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet 3: Réinvestissement */}
        <TabsContent value="reinvestissement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Stratégies de réinvestissement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.saleScenarios?.[0]?.strategies ? (
                <div className="space-y-4">
                  {results.saleScenarios[0].strategies.map((strategy, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">{strategy.nom}</h4>
                        <Badge variant="outline">{strategy.type}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-gray-600">Montant alloué:</span>
                          <div className="font-semibold">{strategy.montantAlloue.toLocaleString()} $</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Rendement escompté:</span>
                          <div className="font-semibold">{strategy.rendementEscompte}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Sécurité financière:</span>
                          <div className="flex items-center gap-2">
                            <Progress value={strategy.impactRetraite.securiteFinanciere * 10} className="w-20" />
                            <span className="text-sm">{strategy.impactRetraite.securiteFinanciere}/10</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="font-semibold mb-1">Avantages fiscaux:</div>
                        <ul className="list-disc list-inside space-y-1">
                          {strategy.avantagesFiscaux.map((avantage, idx) => (
                            <li key={idx}>{avantage}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Lancez l'analyse pour voir les stratégies de réinvestissement</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet 4: Comparaison */}
        <TabsContent value="comparaison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Comparaison des scénarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.scenarioComparison ? (
                <div className="space-y-6">
                  {/* Meilleur scénario */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">
                      🏆 Meilleur scénario: {results.scenarioComparison.meilleurScenario.nom}
                    </h4>
                    <p className="text-green-700">{results.scenarioComparison.recommandation}</p>
                  </div>
                  
                  {/* Analyse des risques */}
                  <div>
                    <h4 className="font-semibold mb-3">Analyse des risques</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-mpr-interactive">
                          {results.scenarioComparison.analyseRisque.liquidite}/10
                        </div>
                        <div className="text-sm text-gray-600">Liquidité</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {results.scenarioComparison.analyseRisque.fiscalite}/10
                        </div>
                        <div className="text-sm text-gray-600">Fiscalité</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {results.scenarioComparison.analyseRisque.rendement}/10
                        </div>
                        <div className="text-sm text-gray-600">Rendement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {results.scenarioComparison.analyseRisque.securite}/10
                        </div>
                        <div className="text-sm text-gray-600">Sécurité</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Lancez l'analyse pour voir la comparaison des scénarios</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet 5: Plan d'Exécution */}
        <TabsContent value="execution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Plan d'exécution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.executionPlan ? (
                <div className="space-y-6">
                  {/* Timeline */}
                  <div className="bg-mpr-interactive-lt border border-mpr-border rounded-lg p-4">
                    <h4 className="font-semibold text-mpr-navy mb-2">⏰ Timeline</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm text-gray-600">Début</div>
                        <div className="font-semibold">{results.executionPlan.timeline.debut}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Fin</div>
                        <div className="font-semibold">{results.executionPlan.timeline.fin}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Durée</div>
                        <div className="font-semibold">{results.executionPlan.timeline.duree}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Étapes */}
                  <div>
                    <h4 className="font-semibold mb-3">Étapes d'exécution</h4>
                    <div className="space-y-3">
                      {results.executionPlan.etapes.map((etape, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-mpr-interactive text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                              {etape.ordre}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{etape.titre}</div>
                              <div className="text-sm text-gray-600">{etape.description}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {etape.duree} • {etape.responsable}
                              </div>
                            </div>
                            <Badge variant={etape.statut === 'TERMINE' ? 'default' : 'secondary'}>
                              {etape.statut}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Checklist */}
                  <div>
                    <h4 className="font-semibold mb-3">Checklist</h4>
                    <div className="space-y-2">
                      {results.executionPlan.checklist.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Lancez l'analyse pour voir le plan d'exécution</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealEstateOptimizationSection;
