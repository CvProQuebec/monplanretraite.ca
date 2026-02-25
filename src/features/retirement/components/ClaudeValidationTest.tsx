// ===== COMPOSANT DE VALIDATION CLAUDE - SUITE DE TESTS COMPLÈTE =====
// Interface utilisateur pour exécuter et visualiser tous les tests de validation

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  TrendingUp,
  Shield,
  Calculator,
  Target,
  Zap,
  FileText,
  Eye
} from 'lucide-react';

// Import de la suite de tests de Claude
import { ValidationTestSuite } from '../services/ValidationTestSuite';

interface TestResult {
  testName: string;
  status: 'pending' | 'running' | 'success' | 'error';
  duration?: number;
  error?: string;
  details?: any;
}

export const ClaudeValidationTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Capture de la console pour afficher les logs
  const captureConsole = () => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    const logs: string[] = [];

    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logs.push(`✅ ${message}`);
      originalLog(...args);
    };

    console.error = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logs.push(`❌ ${message}`);
      originalError(...args);
    };

    console.warn = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logs.push(`⚠️ ${message}`);
      originalWarn(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      setConsoleOutput(logs);
    };
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setConsoleOutput([]);

    const restoreConsole = captureConsole();

    const tests = [
      { name: 'Paramètres RRQ 2025', method: ValidationTestSuite.testParametresRRQ2025 },
      { name: 'Intégration SV/SRG', method: ValidationTestSuite.testIntegrationSVSRG },
      { name: 'CalculationService Complet', method: ValidationTestSuite.testCalculationServiceComplet },
      { name: 'Comparaison Officiels', method: ValidationTestSuite.testComparaisonOfficiels },
      { name: 'Performance et Limites', method: ValidationTestSuite.testPerformanceEtLimites }
    ];

    const results: TestResult[] = tests.map(test => ({
      testName: test.name,
      status: 'pending'
    }));

    setTestResults(results);

    try {
      for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const startTime = Date.now();

        // Mettre à jour le statut
        setTestResults(prev => prev.map((result, index) => 
          index === i ? { ...result, status: 'running' } : result
        ));

        try {
          await test.method();
          const duration = Date.now() - startTime;

          setTestResults(prev => prev.map((result, index) => 
            index === i ? { ...result, status: 'success', duration } : result
          ));

        } catch (error) {
          const duration = Date.now() - startTime;
          setTestResults(prev => prev.map((result, index) => 
            index === i ? { 
              ...result, 
              status: 'error', 
              duration, 
              error: error instanceof Error ? error.message : 'Erreur inconnue' 
            } : result
          ));
        }
      }

      console.log('\n🎉 TOUS LES TESTS TERMINÉS !');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'exécution des tests:', error);
    } finally {
      setIsRunning(false);
      restoreConsole();
    }
  };

  const runIndividualTest = async (testIndex: number) => {
    if (isRunning) return;

    const test = [
      { name: 'Paramètres RRQ 2025', method: ValidationTestSuite.testParametresRRQ2025 },
      { name: 'Intégration SV/SRG', method: ValidationTestSuite.testIntegrationSVSRG },
      { name: 'CalculationService Complet', method: ValidationTestSuite.testCalculationServiceComplet },
      { name: 'Comparaison Officiels', method: ValidationTestSuite.testComparaisonOfficiels },
      { name: 'Performance et Limites', method: ValidationTestSuite.testPerformanceEtLimites }
    ][testIndex];

    setIsRunning(true);
    setConsoleOutput([]);

    const restoreConsole = captureConsole();

    const startTime = Date.now();

    setTestResults(prev => prev.map((result, index) => 
      index === testIndex ? { ...result, status: 'running' } : result
    ));

    try {
      await test.method();
      const duration = Date.now() - startTime;

      setTestResults(prev => prev.map((result, index) => 
        index === testIndex ? { ...result, status: 'success', duration } : result
      ));

      console.log(`✅ Test "${test.name}" réussi en ${duration}ms`);

    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResults(prev => prev.map((result, index) => 
        index === testIndex ? { 
          ...result, 
          status: 'error', 
          duration, 
          error: error instanceof Error ? error.message : 'Erreur inconnue' 
        } : result
      ));

      console.error(`❌ Test "${test.name}" échoué:`, error);
    } finally {
      setIsRunning(false);
      restoreConsole();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'running': return <Clock className="w-4 h-4 text-mpr-interactive animate-spin" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline">En attente</Badge>;
      case 'running': return <Badge className="bg-mpr-interactive-lt text-mpr-navy">En cours</Badge>;
      case 'success': return <Badge className="bg-green-100 text-green-800">Réussi</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">Échoué</Badge>;
      default: return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getSuccessRate = () => {
    if (testResults.length === 0) return 0;
    const successCount = testResults.filter(r => r.status === 'success').length;
    return Math.round((successCount / testResults.length) * 100);
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧪 Suite de Tests de Validation Claude
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Validation complète de votre implémentation du CalculationService amélioré 2025
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Badge variant="outline" className="text-sm">
            <FileText className="w-3 h-3 mr-1" />
            Tests de Validation Post-Implémentation
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Target className="w-3 h-3 mr-1" />
            Conformité 2025
          </Badge>
        </div>
      </div>

      {/* Boutons de contrôle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Contrôle des Tests
          </CardTitle>
          <CardDescription>
            Exécutez tous les tests ou des tests individuels pour valider votre implémentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={runAllTests}
              disabled={isRunning}
              className="flex-1"
              size="lg"
            >
              {isRunning ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Tests en cours...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Lancer Tous les Tests
                </>
              )}
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Taux de réussite:</span>
                <Badge variant="outline" className="text-lg">
                  {getSuccessRate()}%
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Tests réussis:</span>
                <Badge className="bg-green-100 text-green-800">
                  {testResults.filter(r => r.status === 'success').length}/{testResults.length}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats des tests */}
      {testResults.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="details">Détails des Tests</TabsTrigger>
            <TabsTrigger value="console">Console de Sortie</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Résumé des Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testResults.map((result, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        {getStatusIcon(result.status)}
                        {getStatusBadge(result.status)}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{result.testName}</h4>
                      {result.duration && (
                        <p className="text-sm text-gray-600">
                          Durée: {result.duration}ms
                        </p>
                      )}
                      {result.error && (
                        <p className="text-sm text-red-600 mt-1">
                          Erreur: {result.error}
                        </p>
                      )}
                      {result.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => runIndividualTest(index)}
                          disabled={isRunning}
                          className="mt-2 w-full"
                        >
                          Lancer ce Test
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Détails des tests */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Détails de Chaque Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold">{result.testName}</h4>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          {getStatusBadge(result.status)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Statut:</p>
                          <p className="font-medium">
                            {result.status === 'pending' && 'En attente d\'exécution'}
                            {result.status === 'running' && 'Exécution en cours...'}
                            {result.status === 'success' && 'Test réussi ✅'}
                            {result.status === 'error' && 'Test échoué ❌'}
                          </p>
                        </div>
                        
                        {result.duration && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Durée d\'exécution:</p>
                            <p className="font-medium">{result.duration}ms</p>
                          </div>
                        )}
                      </div>

                      {result.error && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm font-medium text-red-800 mb-1">Erreur détectée:</p>
                          <p className="text-sm text-red-700">{result.error}</p>
                        </div>
                      )}

                      {result.status === 'pending' && (
                        <Button
                          onClick={() => runIndividualTest(index)}
                          disabled={isRunning}
                          className="mt-3"
                        >
                          Lancer ce Test Individuellement
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Console de sortie */}
          <TabsContent value="console" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Console de Sortie des Tests
                </CardTitle>
                <CardDescription>
                  Logs détaillés de l'exécution des tests pour le debugging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-auto">
                  {consoleOutput.length === 0 ? (
                    <div className="text-gray-500">
                      Aucune sortie console disponible. Lancez un test pour voir les logs.
                    </div>
                  ) : (
                    consoleOutput.map((log, index) => (
                      <div key={index} className="mb-1">
                        {log}
                      </div>
                    ))
                  )}
                </div>
                
                {consoleOutput.length > 0 && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {consoleOutput.length} lignes de log
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConsoleOutput([])}
                    >
                      Effacer les Logs
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Instructions d'utilisation */}
      <Card className="bg-mpr-interactive-lt border-mpr-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-mpr-navy">
            <FileText className="w-5 h-5" />
            Instructions d'Utilisation
          </CardTitle>
        </CardHeader>
        <CardContent className="text-mpr-navy">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-2">🎯 Objectif des Tests:</h4>
              <p className="text-sm">
                Cette suite de tests valide que votre implémentation du CalculationService amélioré 
                respecte tous les paramètres 2025 et fonctionne correctement.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">📋 Tests Inclus:</h4>
              <ul className="text-sm space-y-1 ml-4">
                <li>• <strong>Paramètres RRQ 2025:</strong> Facteurs 0.6% et 0.7%, extension à 72 ans</li>
                <li>• <strong>Intégration SV/SRG:</strong> Sécurité de la vieillesse et Supplément de revenu garanti</li>
                <li>• <strong>CalculationService Complet:</strong> Toutes les nouvelles fonctionnalités</li>
                <li>• <strong>Comparaison Officiels:</strong> Validation des constantes 2025</li>
                <li>• <strong>Performance:</strong> Tests de charge et limites</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">🚀 Comment Procéder:</h4>
              <ol className="text-sm space-y-1 ml-4">
                <li>1. Cliquez sur "Lancer Tous les Tests" pour une validation complète</li>
                <li>2. Surveillez les résultats dans l'onglet "Vue d'ensemble"</li>
                <li>3. Consultez les détails dans l'onglet "Détails des Tests"</li>
                <li>4. Analysez les logs dans l'onglet "Console de Sortie"</li>
                <li>5. Corrigez les erreurs si nécessaire et relancez les tests</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">✅ Critères de Réussite:</h4>
              <p className="text-sm">
                Tous les tests doivent passer avec succès. Un taux de réussite de 100 % 
                indique que votre implémentation est conforme aux spécifications de Claude.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
