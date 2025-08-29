// ===== COMPOSANT DE TEST - CALCULATIONSERVICE AMÉLIORÉ =====
// Composant pour tester et valider les nouvelles fonctionnalités

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';
import { CalculationService } from '../services/CalculationService';

// Données de test minimales
const testUserData = {
  personal: {
    prenom1: 'Test',
    prenom2: 'Test2',
    naissance1: '1980-01-01',
    naissance2: '1985-01-01',
    sexe1: 'M' as const,
    sexe2: 'F' as const,
    salaire1: 80000,
    salaire2: 60000,
    ageRetraiteSouhaite1: 65
  },
  retirement: {
    rrqAgeActuel1: 44,
    rrqMontantActuel1: 1200,
    rrqMontant70_1: 1680,
    esperanceVie1: 85,
    rrqAgeActuel2: 39,
    rrqMontantActuel2: 1000,
    rrqMontant70_2: 1400,
    esperanceVie2: 88,
    rregopMembre1: 'Non',
    rregopAnnees1: 0,
    pensionPrivee1: 500,
    pensionPrivee2: 400
  },
  savings: {
    reer1: 150000,
    reer2: 120000,
    celi1: 50000,
    celi2: 40000,
    placements1: 80000,
    placements2: 60000,
    epargne1: 25000,
    epargne2: 20000,
    cri1: 10000,
    cri2: 8000,
    residenceValeur: 500000,
    residenceHypotheque: 300000
  },
  cashflow: {
    logement: 2000,
    servicesPublics: 300,
    assurances: 400,
    telecom: 200,
    alimentation: 800,
    transport: 500,
    sante: 300,
    loisirs: 400
  }
};

export const CalculationServiceTest: React.FC = () => {
  const [calculations, setCalculations] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestCalculation = async () => {
    setIsCalculating(true);
    setError(null);
    
    try {
      console.log('🧮 Test du CalculationService amélioré...');
      console.log('📊 Données de test:', testUserData);
      
      const result = CalculationService.calculateAll(testUserData);
      console.log('✅ Résultats des calculs:', result);
      
      setCalculations(result);
    } catch (err) {
      console.error('❌ Erreur lors des calculs:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsCalculating(false);
    }
  };

  const getRiskColor = (niveau: string) => {
    switch (niveau) {
      case 'FAIBLE': return 'bg-green-100 text-green-800';
      case 'MODÉRÉ': return 'bg-yellow-100 text-yellow-800';
      case 'ÉLEVÉ': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'HAUTE': return 'bg-red-100 text-red-800';
      case 'MOYENNE': return 'bg-yellow-100 text-yellow-800';
      case 'FAIBLE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧮 Test du CalculationService Amélioré 2025
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Composant de test pour valider les nouvelles fonctionnalités du service de calculs
        </p>
      </div>

      {/* Bouton de test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Test des Calculs
          </CardTitle>
          <CardDescription>
            Cliquez pour exécuter tous les calculs avec les données de test
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleTestCalculation}
            disabled={isCalculating}
            className="w-full"
          >
            {isCalculating ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Calculs en cours...
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5 mr-2" />
                Lancer les Tests
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Affichage des erreurs */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Erreur de Calcul
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Résultats des calculs */}
      {calculations && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="rrq">RRQ Avancé</TabsTrigger>
            <TabsTrigger value="oasgis">OAS/GIS</TabsTrigger>
            <TabsTrigger value="risks">Risques</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Calculs de Base
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Valeur Nette</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      ${calculations.netWorth?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Capital Retraite</h4>
                    <div className="text-2xl font-bold text-green-600">
                      ${calculations.retirementCapital?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Suffisance</h4>
                    <div className="text-2xl font-bold text-purple-600">
                      {calculations.sufficiency || 'N/A'}%
                    </div>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">Revenus Mensuels</h4>
                    <div className="text-2xl font-bold text-orange-600">
                      ${calculations.monthlyIncome?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Dépenses Mensuelles</h4>
                    <div className="text-2xl font-bold text-red-600">
                      ${calculations.monthlyExpenses?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h4 className="font-semibold text-indigo-900 mb-2">Économies Fiscales</h4>
                    <div className="text-2xl font-bold text-indigo-600">
                      ${calculations.taxSavings?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RRQ Avancé */}
          <TabsContent value="rrq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Analyse RRQ Avancée
                </CardTitle>
              </CardHeader>
              <CardContent>
                {calculations.rrqOptimization?.person1 ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Personne 1</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-blue-700">Décision recommandée:</span>
                        <div className="font-semibold text-blue-900">
                          {calculations.rrqOptimization.person1.recommandationPersonnalisee?.decision || 'N/A'}
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <span className="text-sm text-green-700">Niveau de confiance:</span>
                        <div className="font-semibold text-green-900">
                          {calculations.rrqOptimization.person1.recommandationPersonnalisee?.niveauConfiance || 'N/A'}%
                        </div>
                      </div>
                    </div>
                    
                    {calculations.rrqOptimization.combinedStrategy && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                        <h5 className="font-semibold text-purple-900 mb-2">Stratégie Combinée</h5>
                        <p className="text-purple-700">
                          {calculations.rrqOptimization.combinedStrategy.strategieRecommandee?.nom || 'N/A'}
                        </p>
                        <p className="text-sm text-purple-600 mt-1">
                          {calculations.rrqOptimization.combinedStrategy.strategieRecommandee?.description || 'N/A'}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Utilisation de la méthode RRQ de fallback</p>
                    {calculations.rrqOptimization?.recommandation && (
                      <p className="mt-2 text-sm">
                        {calculations.rrqOptimization.recommandation}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* OAS/GIS */}
          <TabsContent value="oasgis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Projections OAS/GIS
                </CardTitle>
              </CardHeader>
              <CardContent>
                {calculations.oasGisProjection ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Total Mensuel OAS</h4>
                        <div className="text-2xl font-bold text-blue-600">
                          ${calculations.oasGisProjection.householdTotal.monthlyOAS?.toFixed(2) || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">Total Mensuel GIS</h4>
                        <div className="text-2xl font-bold text-green-600">
                          ${calculations.oasGisProjection.householdTotal.monthlyGIS?.toFixed(2) || 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    {calculations.oasGisProjection.householdTotal.optimizationOpportunities?.length > 0 && (
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h5 className="font-semibold text-yellow-900 mb-2">Opportunités d'Optimisation</h5>
                        <ul className="list-disc list-inside text-yellow-700">
                          {calculations.oasGisProjection.householdTotal.optimizationOpportunities.map((opp, index) => (
                            <li key={index}>{opp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Aucune projection OAS/GIS disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analyse des Risques */}
          <TabsContent value="risks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Analyse des Risques
                </CardTitle>
              </CardHeader>
              <CardContent>
                {calculations.riskAnalysis ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <span className="text-sm text-red-700">Risque de longévité:</span>
                        <Badge className={`ml-2 ${getRiskColor(calculations.riskAnalysis.longevityRisk?.niveau)}`}>
                          {calculations.riskAnalysis.longevityRisk?.niveau || 'N/A'}
                        </Badge>
                      </div>
                      
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm text-orange-700">Risque d'inflation:</span>
                        <Badge className={`ml-2 ${getRiskColor(calculations.riskAnalysis.inflationRisk?.niveau)}`}>
                          {calculations.riskAnalysis.inflationRisk?.niveau || 'N/A'}
                        </Badge>
                      </div>
                      
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm text-yellow-700">Risque de séquence:</span>
                        <Badge className={`ml-2 ${getRiskColor(calculations.riskAnalysis.sequenceRisk?.niveau)}`}>
                          {calculations.riskAnalysis.sequenceRisk?.niveau || 'N/A'}
                        </Badge>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-blue-700">Score global:</span>
                        <div className="font-semibold text-blue-900">
                          {calculations.riskAnalysis.overallRiskScore || 'N/A'}/100
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Aucune analyse des risques disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions Recommandées */}
          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Actions Recommandées
                </CardTitle>
              </CardHeader>
              <CardContent>
                {calculations.recommendedActions ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-gray-600">Score d'urgence:</span>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {calculations.recommendedActions.scoreUrgence || 'N/A'}/100
                      </Badge>
                    </div>
                    
                    {calculations.recommendedActions.actionsImmédiates?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-red-900 mb-2">Actions Immédiates</h4>
                        <div className="space-y-2">
                          {calculations.recommendedActions.actionsImmédiates.map((action, index) => (
                            <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-red-900">{action.action}</span>
                                <Badge className={getPriorityColor(action.priorite)}>
                                  {action.priorite}
                                </Badge>
                              </div>
                              <p className="text-sm text-red-700">{action.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-red-600">
                                <span>⏰ {action.delai}</span>
                                <span>🎯 {action.impact}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {calculations.recommendedActions.actionsMoyenTerme?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-yellow-900 mb-2">Actions Moyen Terme</h4>
                        <div className="space-y-2">
                          {calculations.recommendedActions.actionsMoyenTerme.map((action, index) => (
                            <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-yellow-900">{action.action}</span>
                                <Badge className={getPriorityColor(action.priorite)}>
                                  {action.priorite}
                                </Badge>
                              </div>
                              <p className="text-sm text-yellow-700">{action.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Aucune action recommandée disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Informations de debug */}
      {calculations && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <details className="text-xs text-gray-500">
              <summary>Voir les données complètes</summary>
              <pre className="mt-2 p-2 bg-white rounded border overflow-auto max-h-96">
                {JSON.stringify(calculations, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
