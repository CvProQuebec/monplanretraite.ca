import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TaxOptimizationService2025 } from '../services/TaxParametersService2025';
import { RetirementBudgetService } from '../services/RetirementBudgetService';
import { 
  Calculator, TrendingUp, AlertTriangle, CheckCircle, 
  Info, Target, DollarSign, PieChart 
} from 'lucide-react';

export const TaxOptimizationTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données de test
  const testUserData = {
    revenuActuel: 75000,
    revenuProjetteRetraite: 45000,
    ageActuel: 58,
    ageRetraite: 65,
    montantDisponible: 15000,
    situationConjoint: 'COUPLE' as const,
    depensesActuelles: {
      logement: 1200,
      alimentation: 800,
      transport: 400,
      sante: 300,
      loisirs: 500,
      vetements: 200,
      vehicule: 150,
      rrqCotisations: 3500,
      reerEmployeur: 2000,
      cotisationsPro: 500,
      assuranceEmploi: 100,
      voyages: 300
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🧪 Démarrage des tests d\'optimisation fiscale 2025...');
      
      // Test 1: Optimisation REER vs CELI
      console.log('📊 Test 1: Optimisation REER vs CELI...');
      const reerCeliResult = TaxOptimizationService2025.analyzeREERvsCELI({
        revenuActuel: testUserData.revenuActuel,
        revenuProjetteRetraite: testUserData.revenuProjetteRetraite,
        ageActuel: testUserData.ageActuel,
        ageRetraite: testUserData.ageRetraite,
        montantDisponible: testUserData.montantDisponible,
        situationConjoint: testUserData.situationConjoint
      });
      
      // Test 2: Stratégie de décaissement
      console.log('📈 Test 2: Stratégie de décaissement...');
      const withdrawalResult = TaxOptimizationService2025.optimizeWithdrawalSequence({
        ageDebut: testUserData.ageRetraite,
        reerValue: 300000,
        celiValue: 100000,
        placementsValue: 50000,
        revenuGaranti: 35000,
        depensesAnnuelles: 45000,
        esperanceVie: 85
      });
      
      // Test 3: Analyse fonds de solidarité
      console.log('🏦 Test 3: Analyse fonds de solidarité...');
      const fondsResult = TaxOptimizationService2025.analyzeFondsSolidarite({
        revenuAnnuel: testUserData.revenuActuel,
        ageActuel: testUserData.ageActuel,
        ageRetraite: testUserData.ageRetraite,
        capaciteEpargne: testUserData.montantDisponible
      });
      
      // Test 4: Analyse budgétaire retraite
      console.log('💰 Test 4: Analyse budgétaire retraite...');
      const budgetResult = RetirementBudgetService.analyzeRetirementExpenseChanges(
        testUserData.depensesActuelles
      );
      
      // Test 5: Considérations successorales
      console.log('📋 Test 5: Considérations successorales...');
      const estateResult = RetirementBudgetService.analyzeEstateConsiderations({
        ageActuel: testUserData.ageActuel,
        situationFamiliale: testUserData.situationConjoint,
        enfants: true,
        valeursPatrimoine: {
          reer: 300000,
          celi: 100000,
          residence: 400000,
          placements: 50000
        }
      });
      
      setTestResults({
        reerCeli: reerCeliResult,
        withdrawal: withdrawalResult,
        fondsSolidarite: fondsResult,
        budget: budgetResult,
        estate: estateResult
      });
      
      console.log('✅ Tous les tests terminés avec succès !');
      
    } catch (err) {
      console.error('❌ Erreur lors des tests:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Test des Services d'Optimisation Fiscale 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Ce composant teste tous les nouveaux services d'optimisation fiscale basés sur les documents 
              "Finances - *.txt" d'Anthropic Claude.
            </p>
            
            <Button 
              onClick={runAllTests} 
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? 'Tests en cours...' : 'Lancer tous les tests'}
            </Button>
            
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Résultats des tests */}
      {Object.keys(testResults).length > 0 && (
        <div className="space-y-6">
          {/* Test REER vs CELI */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Test 1: Optimisation REER vs CELI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Recommandation</h3>
                  <Badge variant="default" className="text-lg">
                    {testResults.reerCeli?.recommandation || 'N/A'}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Économie fiscale REER</h3>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(testResults.reerCeli?.impactFiscal?.economieImmediateREER || 0)}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Raisonnement</h3>
                <div className="space-y-1">
                  {testResults.reerCeli?.raisonnement?.map((raison: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{raison}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Stratégie de décaissement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Test 2: Stratégie de décaissement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-mpr-interactive-lt rounded">
                    <div className="text-lg font-bold text-mpr-navy">
                      {testResults.withdrawal?.sequencePhases?.length || 0}
                    </div>
                    <div className="text-sm text-mpr-interactive">Phases de décaissement</div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-700">
                      {testResults.withdrawal?.flexibiliteScore || 0}/100
                    </div>
                    <div className="text-sm text-green-600">Score de flexibilité</div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="text-lg font-bold text-purple-700">
                      {formatCurrency(testResults.withdrawal?.impactFiscalTotal || 0)}
                    </div>
                    <div className="text-sm text-purple-600">Impact fiscal total</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Phases de décaissement</h3>
                  <div className="space-y-2">
                    {testResults.withdrawal?.sequencePhases?.map((phase: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">Phase {index + 1}</Badge>
                        <span>{phase.ageDebut}-{phase.ageFin} ans</span>
                        <span className="text-gray-500">({(phase.tauxRetrait * 100).toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Fonds de solidarité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Test 3: Analyse fonds de solidarité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Recommandation</h3>
                  <Badge 
                    variant={testResults.fondsSolidarite?.recommandation === 'RECOMMANDE' ? 'default' : 'secondary'}
                    className="text-lg"
                  >
                    {testResults.fondsSolidarite?.recommandation || 'N/A'}
                  </Badge>
                  
                  <div className="mt-3">
                    <h4 className="font-medium mb-2">Projections Fondaction</h4>
                    <div className="text-sm space-y-1">
                      <div>Rendement: {(testResults.fondsSolidarite?.projections?.fondaction?.rendementEffectif * 100).toFixed(1)}%</div>
                      <div>Valeur finale: {formatCurrency(testResults.fondsSolidarite?.projections?.fondaction?.valeurFinale || 0)}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Contraintes</h3>
                  <div className="space-y-2">
                    {testResults.fondsSolidarite?.contraintes?.map((contrainte: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{contrainte}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Budget retraite */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Test 4: Analyse budgétaire retraite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Fond d'urgence recommandé</h3>
                  <div className="text-2xl font-bold text-mpr-interactive">
                    {formatCurrency(testResults.budget?.fondUrgenceRequis || 0)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Équivaut à 4 mois de dépenses de retraite
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Répartition des comptes</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Compte dépenses fixes:</span>
                      <span className="font-medium">
                        {formatCurrency(testResults.budget?.repartitionComptes?.compteDependesFixes || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compte gestion courante:</span>
                      <span className="font-medium">
                        {formatCurrency(testResults.budget?.repartitionComptes?.compteGestionCourante || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Considérations successorales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Test 5: Considérations successorales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Priorités</h3>
                    <div className="space-y-2">
                      {testResults.estate?.prioritesSuccessorales?.slice(0, 3).map((priorite: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Badge variant={priorite.urgence === 'CRITIQUE' ? 'destructive' : 'secondary'}>
                            #{priorite.ordre}
                          </Badge>
                          <span>{priorite.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Impact fiscal succession</h3>
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(testResults.estate?.impactFiscalSuccession || 0)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Estimation des impôts sur la succession
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Fonction utilitaire
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
