// src/features/retirement/examples/SRGUsageExamples.tsx
// Exemples d'utilisation du module SRG - Guide d'implémentation
// 100 % SÉCURISÉ - AUCUNE TRANSMISSION RÉSEAU

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserData, CalculationsWithSRG } from '../types';
import { CalculationService } from '../services/CalculationService';
import { SRGService } from '../services/SRGService';
import SRGAnalysisSection from '../components/SRGAnalysisSection';

// ===== EXEMPLE 1: UTILISATION DANS UN COMPOSANT EXISTANT =====

export const RetirementAnalysisWithSRG: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    personal: {
      prenom1: 'Marie',
      prenom2: 'Pierre',
      naissance1: '1960-05-15', // 64 ans
      naissance2: '1958-08-22', // 66 ans
      sexe1: 'F',
      sexe2: 'M',
      salaire1: 18000, // Revenus faibles - éligible SRG
      salaire2: 22000,
      anneesResidenceCanada1: 40,
      anneesResidenceCanada2: 45
    },
    retirement: {
      rrqAgeActuel1: 64,
      rrqMontantActuel1: 600,
      rrqMontant70_1: 850,
      esperanceVie1: 85,
      rrqAgeActuel2: 66,
      rrqMontantActuel2: 800,
      rrqMontant70_2: 1100,
      esperanceVie2: 82,
      svMontant1: 717, // SV de base
      svMontant2: 717,
      svAgeDebut1: 65,
      svAgeDebut2: 65
    },
    savings: {
      reer1: 25000,
      reer2: 30000,
      celi1: 15000,
      celi2: 20000,
      placements1: 5000,
      placements2: 8000,
      epargne1: 3000,
      epargne2: 4000,
      cri1: 0,
      cri2: 0,
      residenceValeur: 300000,
      residenceHypotheque: 0
    },
    cashflow: {
      logement: 1200,
      servicesPublics: 200,
      assurances: 150,
      telecom: 100,
      alimentation: 600,
      transport: 300,
      sante: 100,
      loisirs: 200
    }
  });

  const [calculations, setCalculations] = useState<CalculationsWithSRG | null>(null);
  const [loading, setLoading] = useState(false);

  // Calcul automatique avec SRG
  const calculateWithSRG = async () => {
    setLoading(true);
    try {
      console.log('🔄 Calcul avec module SRG...');
      const results = CalculationService.calculateAllWithSRG(userData);
      setCalculations(results);
      console.log('✅ Calculs SRG terminés:', results);
    } catch (error) {
      console.error('❌ Erreur calculs SRG:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    calculateWithSRG();
  }, [userData]);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Exemple d'Intégration - Module SRG</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <Alert>
              <AlertDescription>Calcul en cours...</AlertDescription>
            </Alert>
          )}
          
          {calculations?.srgAnalysis && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Résultats SRG</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mpr-interactive-lt p-4 rounded">
                  <div className="text-sm font-medium text-mpr-interactive">
                    {userData.personal.prenom1}
                  </div>
                  <div className="text-xl font-bold">
                    {calculations.srgAnalysis.person1.eligible 
                      ? `${calculations.srgAnalysis.person1.montantMensuel}$/mois`
                      : 'Non éligible'
                    }
                  </div>
                </div>
                
                {calculations.srgAnalysis.person2 && (
                  <div className="bg-green-50 p-4 rounded">
                    <div className="text-sm font-medium text-green-600">
                      {userData.personal.prenom2}
                    </div>
                    <div className="text-xl font-bold">
                      {calculations.srgAnalysis.person2.eligible 
                        ? `${calculations.srgAnalysis.person2.montantMensuel}$/mois`
                        : 'Non éligible'
                      }
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-purple-50 p-4 rounded">
                <div className="text-sm font-medium text-purple-600">Total Ménage</div>
                <div className="text-2xl font-bold">
                  {calculations.srgAnalysis.combined.totalMensuel}$/mois
                </div>
                <div className="text-sm text-gray-600">
                  {calculations.srgAnalysis.combined.totalAnnuel}$ par année
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Intégration du composant SRG complet */}
      <SRGAnalysisSection 
        userData={userData} 
        onDataChange={(updates) => setUserData({...userData, ...updates})}
      />
    </div>
  );
};

// ===== EXEMPLE 2: ÉVALUATION RAPIDE SRG =====

export const SRGQuickEvaluation: React.FC<{ userData: UserData }> = ({ userData }) => {
  const [evaluation, setEvaluation] = useState<any>(null);

  useEffect(() => {
    const eval = CalculationService.evaluateSRGPriority(userData);
    setEvaluation(eval);
  }, [userData]);

  if (!evaluation) return <div>Chargement...</div>;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évaluation SRG Express</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className={`p-3 rounded ${getPriorityColor(evaluation.priority)}`}>
            <div className="font-medium">Priorité: {evaluation.priority}</div>
            <div className="text-sm mt-1">{evaluation.reason}</div>
          </div>
          
          {evaluation.potentialMonthly > 0 && (
            <div className="bg-green-50 p-3 rounded">
              <div className="text-green-700 font-medium">
                Potentiel estimé: {evaluation.potentialMonthly}$/mois
              </div>
              <div className="text-green-600 text-sm">
                Soit {evaluation.potentialMonthly * 12}$ par année
              </div>
            </div>
          )}

          {evaluation.recommendedActions.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Actions recommandées:</h4>
              <ul className="space-y-1">
                {evaluation.recommendedActions.map((action, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-2 h-2 bg-mpr-interactive rounded-full mt-2 flex-shrink-0"></div>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// ===== EXEMPLE 3: CAS D'USAGE TYPIQUES =====

export const SRGTestCases: React.FC = () => {
  const testCases = [
    {
      name: "Couple retraité - revenus faibles",
      description: "Marie et Pierre, 65 et 67 ans, revenus combinés 35,000$",
      userData: {
        personal: {
          prenom1: 'Marie', prenom2: 'Pierre',
          naissance1: '1959-01-01', naissance2: '1957-01-01',
          sexe1: 'F' as const, sexe2: 'M' as const,
          salaire1: 15000, salaire2: 20000,
          anneesResidenceCanada1: 40, anneesResidenceCanada2: 45
        }
      },
      expectedResult: "Éligible SRG significatif pour les deux"
    },
    {
      name: "Personne seule - faible revenu",
      description: "Jeanne, 68 ans, revenus 16,000$",
      userData: {
        personal: {
          prenom1: 'Jeanne', prenom2: '',
          naissance1: '1956-01-01', naissance2: '',
          sexe1: 'F' as const, sexe2: 'F' as const,
          salaire1: 16000, salaire2: 0,
          anneesResidenceCanada1: 50, anneesResidenceCanada2: 0
        }
      },
      expectedResult: "Montant SRG maximal ou proche"
    },
    {
      name: "Couple - revenus trop élevés",
      description: "Robert et Louise, 66 ans, revenus combinés 65,000$",
      userData: {
        personal: {
          prenom1: 'Robert', prenom2: 'Louise',
          naissance1: '1958-01-01', naissance2: '1958-01-01',
          sexe1: 'M' as const, sexe2: 'F' as const,
          salaire1: 35000, salaire2: 30000,
          anneesResidenceCanada1: 40, anneesResidenceCanada2: 40
        }
      },
      expectedResult: "Non éligible - revenus trop élevés"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Cas d'Usage SRG - Tests</h2>
      
      {testCases.map((testCase, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg">{testCase.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{testCase.description}</p>
            
            <TestCaseResults userData={testCase.userData as UserData} />
            
            <div className="mt-4 p-3 bg-mpr-interactive-lt rounded">
              <div className="text-sm font-medium text-mpr-navy">Résultat attendu:</div>
              <div className="text-sm text-mpr-interactive">{testCase.expectedResult}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Composant helper pour afficher les résultats de test
const TestCaseResults: React.FC<{ userData: UserData }> = ({ userData }) => {
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    try {
      const srgAnalysis = SRGService.calculateSRGAnalysis(userData);
      const evaluation = CalculationService.evaluateSRGPriority(userData);
      setResults({ srgAnalysis, evaluation });
    } catch (error) {
      console.error('Erreur test case:', error);
      setResults({ error: error.message });
    }
  }, [userData]);

  if (!results) return <div className="text-sm">Calcul en cours...</div>;
  
  if (results.error) {
    return <div className="text-sm text-red-600">Erreur: {results.error}</div>;
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-medium text-gray-500">Personne 1</div>
          <div className="text-sm">
            {results.srgAnalysis.person1.eligible 
              ? `${results.srgAnalysis.person1.montantMensuel}$/mois`
              : 'Non éligible'
            }
          </div>
        </div>
        
        {results.srgAnalysis.person2 && (
          <div>
            <div className="text-xs font-medium text-gray-500">Personne 2</div>
            <div className="text-sm">
              {results.srgAnalysis.person2.eligible 
                ? `${results.srgAnalysis.person2.montantMensuel}$/mois`
                : 'Non éligible'
              }
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 p-2 rounded">
        <div className="text-xs font-medium text-gray-600">
          Priorité: {results.evaluation.priority}
        </div>
        <div className="text-xs text-gray-500">
          Total ménage: {results.srgAnalysis.totalHousehold.srgTotal}$/mois
        </div>
      </div>
    </div>
  );
};

// ===== EXEMPLE 4: INTÉGRATION DANS PAGE PRINCIPALE =====

export const MainRetirementPageWithSRG: React.FC = () => {
  const [userData, setUserData] = useState<UserData>(/* données utilisateur */);
  const [showSRGSection, setShowSRGSection] = useState(false);

  // Vérification automatique de l'importance du SRG
  useEffect(() => {
    const evaluation = CalculationService.evaluateSRGPriority(userData);
    if (evaluation.priority === 'CRITICAL' || evaluation.priority === 'HIGH') {
      setShowSRGSection(true);
    }
  }, [userData]);

  return (
    <div className="space-y-6">
      {/* Sections existantes */}
      {/* ... PersonalDataSection, RetirementDataSection, etc. */}
      
      {/* Section SRG - affichée automatiquement si prioritaire */}
      {showSRGSection && (
        <>
          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold mb-4">
              Supplément de Revenu Garanti (SRG)
            </h2>
          </div>
          <SRGAnalysisSection 
            userData={userData}
            onDataChange={(updates) => setUserData({...userData, ...updates})}
          />
        </>
      )}

      {/* Bouton pour afficher SRG manuellement */}
      {!showSRGSection && (
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={() => setShowSRGSection(true)}
              variant="outline"
              className="w-full"
            >
              Analyser l'éligibilité au Supplément de Revenu Garanti (SRG)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ===== EXEMPLE 5: HOOKS PERSONNALISÉS =====

export const useSRGAnalysis = (userData: UserData) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateSRG = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = SRGService.calculateSRGAnalysis(userData);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.personal?.naissance1) {
      calculateSRG();
    }
  }, [userData]);

  return {
    analysis,
    loading,
    error,
    recalculate: calculateSRG
  };
};

// ===== EXEMPLE 6: VALIDATION ET TESTS =====

export const SRGValidationTests: React.FC = () => {
  const runValidationTests = () => {
    const testResults = [];
    
    // Test 1: Personne seule éligible
    try {
      const result1 = SRGService.calculateSRGAnalysis({
        personal: {
          prenom1: 'Test', naissance1: '1955-01-01',
          sexe1: 'F', salaire1: 10000,
          anneesResidenceCanada1: 40,
          prenom2: '', naissance2: '', sexe2: 'M', salaire2: 0
        }
      });
      
      testResults.push({
        test: 'Personne seule éligible',
        passed: result1.person1.eligible && result1.person1.montantMensuel > 0,
        result: `${result1.person1.montantMensuel}$/mois`
      });
    } catch (error) {
      testResults.push({
        test: 'Personne seule éligible',
        passed: false,
        result: `Erreur: ${error.message}`
      });
    }

    // Test 2: Couple avec revenus moyens
    try {
      const result2 = SRGService.calculateSRGAnalysis({
        personal: {
          prenom1: 'Test1', naissance1: '1955-01-01',
          prenom2: 'Test2', naissance2: '1957-01-01',
          sexe1: 'F', sexe2: 'M',
          salaire1: 20000, salaire2: 15000,
          anneesResidenceCanada1: 40, anneesResidenceCanada2: 35
        }
      });
      
      testResults.push({
        test: 'Couple revenus moyens',
        passed: result2.person1.eligible || result2.person2?.eligible,
        result: `P1: ${result2.person1.montantMensuel}$, P2: ${result2.person2?.montantMensuel || 0}
      });
    } catch (error) {
      testResults.push({
        test: 'Couple revenus moyens',
        passed: false,
        result: `Erreur: ${error.message}`
      });
    }

    console.table(testResults);
    return testResults;
  };

  const [testResults, setTestResults] = useState([]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tests de Validation SRG</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setTestResults(runValidationTests())}>
          Exécuter les tests
        </Button>
        
        {testResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {testResults.map((test, index) => (
              <div key={index} className={`p-3 rounded ${test.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="font-medium">
                  {test.passed ? '✅' : '❌'} {test.test}
                </div>
                <div className="text-sm text-gray-600">{test.result}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ===== EXPORTS =====

export default {
  RetirementAnalysisWithSRG,
  SRGQuickEvaluation,
  SRGTestCases,
  MainRetirementPageWithSRG,
  useSRGAnalysis,
  SRGValidationTests
};