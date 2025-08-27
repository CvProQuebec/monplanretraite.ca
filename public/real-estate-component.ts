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

import { RealEstateOptimizationService, RealEstateProperty, RREGOPContext, SaleScenario } from '@/features/retirement/services/RealEstateOptimizationService';
import { useRetirementData } from '@/hooks/useRetirementData';
import { hasFeatureAccess, getRequiredPlanForFeature } from '@/config/plans';
import { UpgradePrompt } from '@/components/UpgradePrompt';

interface RealEstateOptimizationSectionProps {
  className?: string;
  userPlan: 'free' | 'professional' | 'ultimate';
}

export const RealEstateOptimizationSection: React.FC<RealEstateOptimizationSectionProps> = ({ 
  className, 
  userPlan 
}) => {
  const { userData, updateUserData } = useRetirementData();
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
  
  // Vérification des accès selon le plan
  const hasRealEstateAccess = hasFeatureAccess('hasBudgetModule', userPlan); // Associé au module budget
  const hasAdvancedAnalytics = hasFeatureAccess('hasAdvancedAnalytics', userPlan);
  const hasMonteCarloAccess = hasFeatureAccess('hasMonteCarloSimulations', userPlan);
  
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
  
  // Fonction principale de calcul
  const runCompleteAnalysis = async () => {
    if (!hasRealEstateAccess) return;
    
    setIsCalculating(true);
    
    try {
      // ÉTAPE 1 : Analyse de la propriété
      const propertyAnalysis = RealEstateOptimizationService.analyzeProperty(propertyData);
      
      // ÉTAPE 2 : Scénarios de vente
      const utilisateur = {
        ageActuel: rregopContext.ageActuel,
        tauxMarginal: 0.35 // Estimation employé gouvernement
      };
      
      const saleScenarios = RealEstateOptimizationService.generateSaleScenarios(
        propertyData, 
        rregopContext, 
        utilisateur
      );
      
      // ÉTAPE 3 : Stratégies de réinvestissement
      const bestScenario = saleScenarios[0];
      const reinvestmentStrategies = RealEstateOptimizationService.generateReinvestmentStrategies(
        bestScenario.liquiditeNette,
        rregopContext,
        {
          ...utilisateur,
          capaciteREER: 30000,
          capaciteCELI: 7000,
          toleranceRisque: 'MODERE'
        }
      );
      
      // ÉTAPE 4 : Comparaison de scénarios (si plan Professional+)
      let scenarioComparison = null;
      if (hasAdvancedAnalytics) {
        scenarioComparison = RealEstateOptimizationService.runScenarioComparison(
          propertyData,
          saleScenarios,
          rregopContext,
          utilisateur,
          20
        );
      }
      
      // ÉTAPE 5 : Plan d'exécution
      const executionPlan = RealEstateOptimizationService.generateExecutionPlan(
        bestScenario,
        reinvestmentStrategies,
        utilisateur
      );
      
      setResults({
        propertyAnalysis,
        saleScenarios,
        reinvestmentStrategies,
        scenarioComparison,
        executionPlan
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'analyse immobilière:', error);
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Interface de restriction pour plan gratuit
  if (!hasRealEstateAccess) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              Module Optimisation Immobilier de Retraite
              <Badge variant="secondary">Plan Professional Requis</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UpgradePrompt
              feature="Module Immobilier"
              requiredPlan="professional"
              benefits={[
                "Analyse complète de votre propriété à revenus",
                "Calculs d'optimisation fiscale pour la vente",
                "Stratégies de réinvestissement RREGOP personnalisées",
                "Simulations de scénarios comparatifs",
                "Plan d'exécution détaillé avec timeline"
              ]}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className={className}>
      {/* En-tête avec résumé live */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              Optimisation Immobilier de Retraite
            </div>
            <Button 
              onClick={runCompleteAnalysis}
              disabled={isCalculating}
              className="flex items-center gap-2"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4" />
                  Lancer l'analyse complète
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {liveCalculations && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {liveCalculations.rendementNet.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Rendement net</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${liveCalculations.revenusNets.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Revenus nets annuels</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  ${liveCalculations.plusValue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Plus-value brute</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${liveCalculations.liquiditeNette.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Liquidité nette estimée</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analyse" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Analyse
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Scénarios
          </TabsTrigger>
          <TabsTrigger value="reinvestissement" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Réinvestissement
          </TabsTrigger>
          <TabsTrigger value="comparaison" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Comparaison
          </TabsTrigger>
          <TabsTrigger value="execution" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Exécution
          </TabsTrigger>
        </TabsList>

        {/* ONGLET 1: Analyse de la propriété */}
        <TabsContent value="analyse" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Formulaire de saisie */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Données de votre propriété
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Informations de base */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Type de propriété</Label>
                  <Select 
                    value={propertyData.typeProprieteDuplex} 
                    onValueChange={(value: any) => setPropertyData({...propertyData, typeProprieteDuplex: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DUPLEX">Duplex</SelectItem>
                      <SelectItem value="TRIPLEX">Triplex</SelectItem>
                      <SelectItem value="IMMEUBLE">Immeuble à logements</SelectItem>
                      <SelectItem value="LOGEMENT_SOUS_SOL">Logement sous-sol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="valeurMarchande">Valeur marchande ($)</Label>
                    <Input
                      id="valeurMarchande"
                      type="number"
                      value={propertyData.valeurMarchande}
                      onChange={(e) => setPropertyData({...propertyData, valeurMarchande: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="coutBase">Coût de base ajusté ($)</Label>
                    <Input
                      id="coutBase"
                      type="number"
                      value={propertyData.coutBaseAjuste}
                      onChange={(e) => setPropertyData({...propertyData, coutBaseAjuste: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="amortissement">Amortissement cumulé ($)</Label>
                    <Input
                      id="amortissement"
                      type="number"
                      value={propertyData.amortissementCumule}
                      onChange={(e) => setPropertyData({...propertyData, amortissementCumule: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="anneeAcquisition">Année d'acquisition</Label>
                    <Input
                      id="anneeAcquisition"
                      type="number"
                      value={propertyData.anneeAcquisition}
                      onChange={(e) => setPropertyData({...propertyData, anneeAcquisition: parseInt(e.target.value) || 2020})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="revenusLocatifs">Revenus locatifs annuels ($)</Label>
                  <Input
                    id="revenusLocatifs"
                    type="number"
                    value={propertyData.revenusLocatifsAnnuels}
                    onChange={(e) => setPropertyData({...propertyData, revenusLocatifsAnnuels: parseFloat(e.target.value) || 0})}
                  />
                </div>

                {/* Dépenses détaillées */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Dépenses annuelles</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(propertyData.depensesAnnuelles).map(([key, value]) => (
                      <div key={key}>
                        <Label htmlFor={key} className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                        <Input
                          id={key}
                          type="number"
                          value={value}
                          onChange={(e) => setPropertyData({
                            ...propertyData,
                            depensesAnnuelles: {
                              ...propertyData.depensesAnnuelles,
                              [key]: parseFloat(e.target.value) || 0
                            }
                          })}
                          className="h-8"
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Contexte RREGOP */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Contexte RREGOP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="anneesCotisees">Années cotisées</Label>
                    <Input
                      id="anneesCotisees"
                      type="number"
                      value={rregopContext.anneesCotisees}
                      onChange={(e) => setRregopContext({...rregopContext, anneesCotisees: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ageActuel">Âge actuel</Label>
                    <Input
                      id="ageActuel"
                      type="number"
                      value={rregopContext.ageActuel}
                      onChange={(e) => setRregopContext({...rregopContext, ageActuel: parseInt(e.target.value) || 55})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="salaireMoyen">Salaire annuel moyen ($)</Label>
                    <Input
                      id="salaireMoyen"
                      type="number"
                      value={rregopContext.salaireAnnuelMoyen}
                      onChange={(e) => setRregopContext({...rregopContext, salaireAnnuelMoyen: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ageRetraite">Âge de retraite prévu</Label>
                    <Input
                      id="ageRetraite"
                      type="number"
                      value={rregopContext.ageRetraitePrevu}
                      onChange={(e) => setRregopContext({...rregopContext, ageRetraitePrevu: parseInt(e.target.value) || 62})}
                    />
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                  <Label className="text-sm font-medium text-blue-900">Opportunité de rachat</Label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="anneesManquantes" className="text-xs text-blue-700">Années manquantes</Label>
                      <Input
                        id="anneesManquantes"
                        type="number"
                        value={rregopContext.anneesManquantes}
                        onChange={(e) => setRregopContext({...rregopContext, anneesManquantes: parseInt(e.target.value) || 0})}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="coutRachat" className="text-xs text-blue-700">Coût par année ($)</Label>
                      <Input
                        id="coutRachat"
                        type="number"
                        value={rregopContext.coutRachatParAnnee}
                        onChange={(e) => setRregopContext({...rregopContext, coutRachatParAnnee: parseFloat(e.target.value) || 0})}
                        className="h-8"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="impactPension" className="text-xs text-blue-700">Impact pension mensuelle ($)</Label>
                    <Input
                      id="impactPension"
                      type="number"
                      value={rregopContext.impactPensionViagere}
                      onChange={(e) => setRregopContext({...rregopContext, impactPensionViagere: parseFloat(e.target.value) || 0})}
                      className="h-8"
                    />
                  </div>

                  {rregopContext.anneesManquantes > 0 && (
                    <Alert className="mt-3">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Coût total du rachat: <strong>${(rregopContext.anneesManquantes * rregopContext.coutRachatParAnnee).toLocaleString()}</strong>
                        <br />
                        Bonification pension: <strong>+${(rregopContext.anneesManquantes * rregopContext.impactPensionViagere).toLocaleString()}/mois</strong>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Résultats de l'analyse */}
          {results.propertyAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle>Analyse de votre propriété</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Rendements */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      Rendements actuels
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Rendement brut:</span>
                        <span className="font-medium">{results.propertyAnalysis.rendements.brut.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rendement net:</span>
                        <span className="font-medium">{results.propertyAnalysis.rendements.net.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Après impôt:</span>
                        <span className="font-medium">{results.propertyAnalysis.rendements.apresImpot.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Impact fiscal */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-orange-600" />
                      Impact fiscal de la vente
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Plus-value brute:</span>
                        <span className="font-medium">${results.propertyAnalysis.fiscalite.plusValueBrute.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Récup. amortissement:</span>
                        <span className="font-medium">${results.propertyAnalysis.fiscalite.recupAmortissement.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gain capital imposable:</span>
                        <span className="font-medium">${results.propertyAnalysis.fiscalite.gainEnCapitalImposable.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span>Impôt estimé:</span>
                        <span className="font-bold text-red-600">${results.propertyAnalysis.fiscalite.impotEstimVente.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommandations */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      Recommandations
                    </h4>
                    <div className="space-y-2">
                      {results.propertyAnalysis.recommandations.map((rec: string, index: number) => (
                        <div key={index} className="text-sm p-2 bg-blue-50 rounded text-blue-800">
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ONGLET 2: Scénarios de vente */}
        <TabsContent value="scenarios" className="space-y-6">
          {results.saleScenarios && results.saleScenarios.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Scénarios de vente optimisés</h3>
              
              {results.saleScenarios.map((scenario: SaleScenario, index: number) => (
                <Card key={index} className={index === 0 ? "border-green-200 bg-green-50" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {scenario.nom}
                        {index === 0 && <Badge variant="secondary" className="bg-green-100 text-green-800">Recommandé</Badge>}
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ${scenario.liquiditeNette.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Liquidité nette</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      
                      <div className="text-center">
                        <div className="text-lg font-semibold">${scenario.gainEnCapital.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Gain en capital</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-semibold">${scenario.recupAmortissement.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Récup. amortissement</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-semibold text-red-600">${scenario.impotTotalDu.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Impôt total</div>
                      </div>
                      
                      <div className="text-center">
                        {scenario.economieImpotEtalement && (
                          <>
                            <div className="text-lg font-semibold text-green-600">
                              ${scenario.economieImpotEtalement.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Économie vs comptant</div>
                          </>
                        )}
                      </div>
                      
                    </div>

                    {scenario.type === 'RESERVE_ETALEE' && (
                      <Alert className="mt-4">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Étalement sur <strong>{scenario.nombreAnneesEtalement} ans</strong> - 
                          Réduction du taux d'imposition grâce à la répartition du gain.
                        </AlertDescription>
                      </Alert>
                    )}

                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Lancez l'analyse complète pour voir les scénarios de vente optimisés</p>
                <Button onClick={runCompleteAnalysis} disabled={isCalculating}>
                  Analyser les scénarios
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ONGLET 3: Stratégies de réinvestissement */}
        <TabsContent value="reinvestissement" className="space-y-6">
          {results.reinvestmentStrategies && results.reinvestmentStrategies.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stratégies de réinvestissement recommandées</h3>
              
              {results.reinvestmentStrategies.map((strategy: any, index: number) => (
                <Card key={index} className={strategy.type === 'RREGOP_RACHAT' ? "border-blue-200 bg-blue-50" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {strategy.nom}
                        {strategy.type === 'RREGOP_RACHAT' && <Badge className="bg-blue-100 text-blue-800">Priorité #1</Badge>}
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          ${strategy.montantAlloue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Montant alloué</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Rendement escompté</span>
                        <span className="text-lg font-bold text-green-600">
                          {strategy.rendementEscompte.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={Math.min(strategy.rendementEscompte, 15) / 15 * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Avantages */}
                      <div>
                        <h5 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Avantages
                        </h5>
                        <ul className="text-sm space-y-1">
                          {strategy.avantagesFiscaux.map((avantage: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              {avantage}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Risques */}
                      <div>
                        <h5 className="font-medium text-orange-700 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Considérations
                        </h5>
                        <ul className="text-sm space-y-1">
                          {strategy.risques.map((risque: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              {risque}
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Lancez l'analyse complète pour voir les stratégies de réinvestissement</p>
                <Button onClick={runCompleteAnalysis} disabled={isCalculating}>
                  Analyser le réinvestissement
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ONGLET 4: Comparaison avancée */}
        <TabsContent value="comparaison" className="space-y-6">
          {!hasAdvancedAnalytics ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Comparaison de Scénarios
                  <Badge variant="secondary">Plan Professional+ Requis</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UpgradePrompt
                  feature="Comparaison Avancée"
                  requiredPlan="professional"
                  benefits={[
                    "Comparaison VAN (Valeur Actualisée Nette) sur 20 ans",
                    "Analyse de risque et de liquidité",
                    "Simulations Monte Carlo (plan Ultimate)",
                    "Recommandations basées sur votre profil",
                    "Métriques de performance avancées"
                  ]}
                />
              </CardContent>
            </Card>
          ) : results.scenarioComparison ? (
            <div className="space-y-6">
              
              {/* Résumé des métriques */}
              <Card>
                <CardHeader>
                  <CardTitle>Comparaison sur 20 ans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ${results.scenarioComparison.metriques.meilleureVAN.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Meilleure VAN</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {results.scenarioComparison.metriques.plusSecure?.nom || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Plus sécurisé</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {results.scenarioComparison.metriques.plusLiquide?.nom || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Plus liquide</div>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>

              {/* Recommandation finale */}
              {results.scenarioComparison.recommandation && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Recommandation personnalisée:</div>
                    <div>{results.scenarioComparison.recommandation.description}</div>
                    <div className="mt-2 text-sm">
                      <strong>Justification:</strong> {results.scenarioComparison.recommandation.justification}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Liste des scénarios comparés */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {results.scenarioComparison.scenarios.map((scenario: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          {phase.nom}
                          <Badge variant="outline">{phase.duree}</Badge>
                        </div>
                        <div className="text-lg font-semibold">
                          ${phase.couts.toLocaleString()}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      
                      {/* Actions de la phase */}
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-700">Actions à réaliser:</h5>
                        <ul className="space-y-2">
                          {phase.actions.map((action: string, i: number) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Actions critiques */}
                      {phase.critiques.length > 0 && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg">
                          <h6 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Points critiques
                          </h6>
                          <div className="flex flex-wrap gap-2">
                            {phase.critiques.map((critique: string, i: number) => (
                              <Badge key={i} variant="destructive" className="text-xs">
                                {critique}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Checklist détaillée */}
              {results.executionPlan.checklist && results.executionPlan.checklist.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Checklist d'exécution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.executionPlan.checklist.map((item: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                          <input 
                            type="checkbox" 
                            className="mt-1 rounded"
                            onChange={(e) => {
                              // Ici on pourrait sauvegarder l'état localement
                              console.log(`Item ${index} ${e.target.checked ? 'checked' : 'unchecked'}`);
                            }}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.tache}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              Responsable: {item.responsable} • Échéance: {item.echeance}
                            </div>
                            <Badge 
                              variant={item.priorite === 'CRITIQUE' ? 'destructive' : 
                                     item.priorite === 'IMPORTANTE' ? 'default' : 'secondary'}
                              className="mt-2 text-xs"
                            >
                              {item.priorite}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contacts recommandés */}
              {results.executionPlan.contacts && results.executionPlan.contacts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Contacts recommandés
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.executionPlan.contacts.map((contact: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{contact.type.replace('_', ' ')}</h5>
                            <Badge 
                              variant={contact.importance === 'ESSENTIEL' ? 'destructive' : 
                                     contact.importance === 'RECOMMANDE' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {contact.importance}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">{contact.specialite}</div>
                          {contact.telephone && (
                            <div className="text-sm font-mono mt-2">{contact.telephone}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Résumé financier du plan */}
              <Card className="bg-gradient-to-r from-blue-50 to-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Résumé financier du plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        ${results.executionPlan.phases.reduce((sum: number, phase: any) => sum + phase.couts, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Coûts totaux</div>
                    </div>

                    {liveCalculations && (
                      <>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            ${liveCalculations.liquiditeNette.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Liquidité nette</div>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            ${(rregopContext.anneesManquantes * rregopContext.coutRachatParAnnee).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Rachat RREGOP</div>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            ${Math.max(0, liveCalculations.liquiditeNette - (rregopContext.anneesManquantes * rregopContext.coutRachatParAnnee)).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Solde à investir</div>
                        </div>
                      </>
                    )}

                  </div>
                  
                  <Alert className="mt-4">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Impact pension mensuelle:</strong> +${(rregopContext.anneesManquantes * rregopContext.impactPensionViagere).toLocaleString()}/mois à vie
                      <br />
                      <strong>Valeur actuarielle:</strong> Rendement équivalent de {rregopContext.impactPensionViagere > 0 ? ((rregopContext.anneesManquantes * rregopContext.impactPensionViagere * 12) / (rregopContext.anneesManquantes * rregopContext.coutRachatParAnnee) * 100).toFixed(1) : 0}% annuel garanti
                    </AlertDescription>
                  </Alert>

                </CardContent>
              </Card>

            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Lancez l'analyse complète pour obtenir votre plan d'exécution personnalisé</p>
                <Button onClick={runCompleteAnalysis} disabled={isCalculating}>
                  Générer le plan d'exécution
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

      </Tabs>

      {/* Actions de sauvegarde et export */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  // Sauvegarde locale des données
                  const dataToSave = {
                    propertyData,
                    rregopContext,
                    results,
                    timestamp: new Date().toISOString()
                  };
                  localStorage.setItem('realEstate_analysis', JSON.stringify(dataToSave));
                  alert('Analyse sauvegardée localement');
                }}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Sauvegarder l'analyse
              </Button>

              {hasFeatureAccess('hasExportPDF', userPlan) && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Export PDF (simulation)
                    console.log('Export PDF de l\'analyse immobilière');
                    alert('Export PDF généré (fonctionnalité à implémenter)');
                  }}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export PDF
                </Button>
              )}

              <Button 
                variant="outline"
                onClick={() => {
                  // Restaurer depuis localStorage
                  try {
                    const saved = localStorage.getItem('realEstate_analysis');
                    if (saved) {
                      const data = JSON.parse(saved);
                      setPropertyData(data.propertyData);
                      setRregopContext(data.rregopContext);
                      setResults(data.results || {});
                      alert('Analyse restaurée');
                    } else {
                      alert('Aucune sauvegarde trouvée');
                    }
                  } catch (error) {
                    alert('Erreur lors de la restauration');
                  }
                }}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Restaurer
              </Button>
            </div>

            {/* Indicateur de calcul */}
            {isCalculating && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-sm">Calculs en cours...</span>
              </div>
            )}

          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default RealEstateOptimizationSection; className="text-lg">{scenario.nom}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>VAN (20 ans):</span>
                          <span className="font-semibold">${scenario.vanTotale.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Score sécurité:</span>
                          <div className="flex items-center gap-2">
                            <Progress value={scenario.scoreSecurite} className="w-16 h-2" />
                            <span className="text-sm">{scenario.scoreSecurite}/100</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>Score liquidité:</span>
                          <div className="flex items-center gap-2">
                            <Progress value={scenario.scoreLiquidite} className="w-16 h-2" />
                            <span className="text-sm">{scenario.scoreLiquidite}/100</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Lancez l'analyse complète pour voir la comparaison des scénarios</p>
                <Button onClick={runCompleteAnalysis} disabled={isCalculating}>
                  Comparer les scénarios
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ONGLET 5: Plan d'exécution */}
        <TabsContent value="execution" className="space-y-6">
          {results.executionPlan ? (
            <div className="space-y-6">
              
              <h3 className="text-lg font-semibold">Plan d'exécution détaillé</h3>

              {/* Timeline des phases */}
              <div className="space-y-4">
                {results.executionPlan.phases.map((phase: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle