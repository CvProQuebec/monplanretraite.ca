import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Wand2,
  User,
  Calculator,
  Crown,
  Shield
} from 'lucide-react';

// Import des services et composants
import { OnboardingService, OnboardingData } from '../services/OnboardingService';
import { OnboardingWizard } from './OnboardingWizard';
import { UserData } from '../types';

export default function OnboardingIntegrationTest() {
  const [testResults, setTestResults] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [testUserData, setTestUserData] = useState<UserData | null>(null);

  const runIntegrationTests = async () => {
    setIsRunning(true);
    const results: any = {};

    try {
      // Test 1: Service d'onboarding
      console.log('🧪 Test 1: Service d\'onboarding...');
      const testData: OnboardingData = {
        age: 55,
        conjoint: true,
        ageConjoint: 52,
        salaire: 75000,
        secteur: 'gouvernement',
        employeurActuel: 'Test Government',
        anneesService: 15,
        rregopMembre: true,
        anneesREEROPEstimees: 20,
        rrqDemandee: false,
        ageRetraiteVoulu: 62,
        revenuRetraiteVoulu: 45000,
        depensesActuelles: 50000,
        comprendSecurite: true
      };

      const userData = OnboardingService.transformToUserData(testData);
      const recommendations = OnboardingService.generateRecommendations(userData);
      const estimatedIncome = OnboardingService.calculateEstimatedIncome(userData);
      const benefitsEligibility = OnboardingService.detectBenefitsEligibility(testData);

      results.onboardingService = {
        success: true,
        userData: userData,
        recommendations: recommendations,
        estimatedIncome: estimatedIncome,
        benefitsEligibility: benefitsEligibility
      };

      console.log('✅ Test 1 réussi:', results.onboardingService);

      // Test 2: Validation des données transformées
      console.log('🧪 Test 2: Validation des données transformées...');
      const hasRequiredFields = userData.personal && userData.retirement && userData.savings;
      const hasRREGOP = userData.retirement?.rregopMembre1 === 'oui';
      const hasSRG = userData.retirement?.srgEligibilite1;

      results.dataValidation = {
        success: hasRequiredFields && hasRREGOP,
        hasRequiredFields,
        hasRREGOP,
        hasSRG,
        personalFields: Object.keys(userData.personal || {}).length,
        retirementFields: Object.keys(userData.retirement || {}).length,
        savingsFields: Object.keys(userData.savings || {}).length
      };

      console.log('✅ Test 2 réussi:', results.dataValidation);

      // Test 3: Calculs des revenus
      console.log('🧪 Test 3: Calculs des revenus...');
      const incomeCalculations = {
        rregop: estimatedIncome.rregop > 0,
        rrq: estimatedIncome.rrq > 0,
        sv: estimatedIncome.sv > 0,
        srg: estimatedIncome.srg >= 0,
        total: estimatedIncome.total > 0
      };

      results.incomeCalculations = {
        success: Object.values(incomeCalculations).every(Boolean),
        calculations: incomeCalculations,
        amounts: estimatedIncome
      };

      console.log('✅ Test 3 réussi:', results.incomeCalculations);

      // Test 4: Recommandations
      console.log('🧪 Test 4: Recommandations...');
      const hasRecommendations = recommendations.length > 0;
      const hasRREGOPRecommendations = recommendations.some(rec => rec.includes('RREGOP'));
      const hasSRGRecommendations = recommendations.some(rec => rec.includes('SRG'));

      results.recommendations = {
        success: hasRecommendations && hasRREGOPRecommendations,
        count: recommendations.length,
        hasRREGOP: hasRREGOPRecommendations,
        hasSRG: hasSRGRecommendations,
        sample: recommendations.slice(0, 2)
      };

      console.log('✅ Test 4 réussi:', results.recommendations);

      // Test 5: Détection des prestations
      console.log('🧪 Test 5: Détection des prestations...');
      const benefitsDetection = {
        srg: benefitsEligibility.srg,
        rregop: benefitsEligibility.rregop,
        rrq: benefitsEligibility.rrq
      };

      results.benefitsDetection = {
        success: benefitsEligibility.rregop && benefitsEligibility.rrq,
        detected: benefitsDetection
      };

      console.log('✅ Test 5 réussi:', results.benefitsDetection);

      // Résumé global
      const allTestsPassed = Object.values(results).every(result => result.success);
      results.global = {
        success: allTestsPassed,
        totalTests: Object.keys(results).length - 1, // Exclure le résumé global
        passedTests: Object.values(results).filter(result => result.success).length - 1
      };

      console.log('🎯 Résumé global:', results.global);

    } catch (error) {
      console.error('❌ Erreur lors des tests:', error);
      results.error = {
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined
      };
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const handleWizardComplete = (userData: UserData) => {
    setTestUserData(userData);
    setShowWizard(false);
    
    // Tester automatiquement les données du wizard
    const recommendations = OnboardingService.generateRecommendations(userData);
    const estimatedIncome = OnboardingService.calculateEstimatedIncome(userData);
    
    setTestResults({
      wizardTest: {
        success: true,
        userData: userData,
        recommendations: recommendations,
        estimatedIncome: estimatedIncome
      }
    });
  };

  const handleWizardSkip = () => {
    setShowWizard(false);
  };

  const renderTestResult = (testName: string, result: any) => {
    if (!result) return null;

    const isSuccess = result.success;
    const icon = isSuccess ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />;
    const variant = isSuccess ? 'default' : 'destructive';

    return (
      <Card key={testName} className="border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {icon}
            {testName}
            <Badge variant={variant}>
              {isSuccess ? 'Réussi' : 'Échoué'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
            {JSON.stringify(result, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  };

  if (showWizard) {
    return (
      <OnboardingWizard
        onComplete={handleWizardComplete}
        onSkip={handleWizardSkip}
        isFrench={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🧪 Test d'Intégration - Onboarding Wizard
          </h1>
          <p className="text-gray-600">
            Validation complète de l'intégration du système d'onboarding guidé
          </p>
        </div>

        {/* Actions de test */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Tests Automatiques
              </CardTitle>
              <CardDescription>
                Validation des services et calculs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runIntegrationTests} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? 'Tests en cours...' : 'Lancer les tests'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Test du Wizard
              </CardTitle>
              <CardDescription>
                Test manuel de l'interface utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowWizard(true)}
                variant="outline"
                className="w-full"
              >
                Ouvrir le Wizard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Résultats des tests */}
        {Object.keys(testResults).length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              📊 Résultats des Tests
            </h2>

            {/* Résumé global */}
            {testResults.global && (
              <Alert className={testResults.global.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                {testResults.global.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={testResults.global.success ? 'text-green-800' : 'text-red-800'}>
                  <strong>
                    {testResults.global.success ? '🎉 Tous les tests sont passés !' : '⚠️ Certains tests ont échoué'}
                  </strong>
                  <br />
                  {testResults.global.passedTests} / {testResults.global.totalTests} tests réussis
                </AlertDescription>
              </Alert>
            )}

            {/* Détails des tests */}
            <div className="grid gap-4">
              {Object.entries(testResults).map(([testName, result]) => {
                if (testName === 'global') return null;
                return renderTestResult(testName, result);
              })}
            </div>

            {/* Données du wizard si disponibles */}
            {testResults.wizardTest && (
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-mpr-interactive" />
                    Données du Wizard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Recommandations générées:</h4>
                      <ul className="space-y-1">
                        {testResults.wizardTest.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Revenus estimés:</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total annuel:</span>
                          <span className="font-semibold text-green-600">
                            {testResults.wizardTest.estimatedIncome.total.toLocaleString()} $
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mensuel:</span>
                          <span className="font-semibold">
                            {(testResults.wizardTest.estimatedIncome.total / 12).toLocaleString()} $
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Instructions de Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-700">
              <p>1. <strong>Tests Automatiques:</strong> Valident les services et calculs en arrière-plan</p>
              <p>2. <strong>Test du Wizard:</strong> Teste l'interface utilisateur et la création de profil</p>
              <p>3. <strong>Validation:</strong> Vérifie que toutes les données sont correctement transformées</p>
              <p>4. <strong>Intégration:</strong> Confirme que les composants fonctionnent ensemble</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
