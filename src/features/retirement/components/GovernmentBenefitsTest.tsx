import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Crown,
  Shield,
  Building2,
  MapPin
} from 'lucide-react';

// Import des services
import { SRGService } from '../services/SRGService';
import { RREGOPService } from '../services/RREGOPService';
import { CalculationService } from '../services/CalculationService';

export default function GovernmentBenefitsTest() {
  const [testResults, setTestResults] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = async () => {
    setIsRunning(true);
    const results: any = {};

    try {
      // Test 1: SRG Service
      console.log('🧪 Test 1: SRG Service');
      try {
        const testData = {
          personal: {
            naissance1: '1955-01-01',
            naissance2: '1957-01-01',
            salaire1: 20000,
            salaire2: 15000
          }
        };
        
        const srgResult = SRGService.calculerSRG(testData);
        results.srg = {
          success: true,
          eligible: srgResult.eligible,
          montant: srgResult.montantTotal,
          message: `SRG: ${srgResult.eligible ? 'Éligible' : 'Non éligible'} - ${srgResult.montantTotal?.toLocaleString('fr-CA') || 0}$/an`
        };
        console.log('✅ SRG Service test réussi');
      } catch (error) {
        results.srg = {
          success: false,
          error: error.message,
          message: `SRG Service: Erreur - ${error.message}`
        };
        console.error('❌ SRG Service test échoué:', error);
      }

      // Test 2: RREGOP Service
      console.log('🧪 Test 2: RREGOP Service');
      try {
        const rregopData = {
          typeRegime: 'RREGOP' as const,
          anneesServiceAdmissibilite: 25,
          anneesServiceCalcul: 25,
          pourcentageTempsPlein: 1.0,
          salaireActuel: 75000,
          ageRetraite: 65,
          optionSurvivant: 50 as const
        };
        
        const rregopResult = RREGOPService.calculerRREGOP(rregopData);
        results.rregop = {
          success: rregopResult.valide,
          montant: rregopResult.montantFinal,
          message: `RREGOP: ${rregopResult.valide ? 'Valide' : 'Erreurs'} - ${rregopResult.montantFinal?.toLocaleString('fr-CA') || 0}$/an`
        };
        console.log('✅ RREGOP Service test réussi');
      } catch (error) {
        results.rregop = {
          success: false,
          error: error.message,
          message: `RREGOP Service: Erreur - ${error.message}`
        };
        console.error('❌ RREGOP Service test échoué:', error);
      }

      // Test 3: Calculation Service intégré
      console.log('🧪 Test 3: Calculation Service intégré');
      try {
        const testUserData = {
          personal: {
            naissance1: '1955-01-01',
            naissance2: '1957-01-01',
            salaire1: 20000,
            salaire2: 15000
          },
          retirement: {
            rrqAgeActuel1: 65,
            rrqMontantActuel1: 1200,
            rrqMontant70_1: 1200,
            esperanceVie1: 85,
            rrqAgeActuel2: 63,
            rrqMontantActuel2: 1000,
            rrqMontant70_2: 1000,
            esperanceVie2: 87
          }
        };
        
        const governmentResults = CalculationService.calculateGovernmentBenefits(testUserData);
        results.integration = {
          success: true,
          revenuTotal: governmentResults.revenuTotalGaranti,
          recommandations: governmentResults.recommandations?.length || 0,
          message: `Intégration: Réussi - Revenu total: ${governmentResults.revenuTotalGaranti?.toLocaleString('fr-CA') || 0}$/an, ${governmentResults.recommandations?.length || 0} recommandations`
        };
        console.log('✅ Calculation Service intégré test réussi');
      } catch (error) {
        results.integration = {
          success: false,
          error: error.message,
          message: `Calculation Service intégré: Erreur - ${error.message}`
        };
        console.error('❌ Calculation Service intégré test échoué:', error);
      }

    } catch (error) {
      console.error('Erreur générale dans les tests:', error);
    } finally {
      setIsRunning(false);
      setTestResults(results);
    }
  };

  const getTestStatus = (testName: string) => {
    const test = testResults[testName];
    if (!test) return 'pending';
    return test.success ? 'success' : 'error';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Réussi</Badge>;
      case 'error':
        return <Badge variant="destructive">Échec</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-6 w-6 text-blue-600" />
            Tests d'Intégration des Services Gouvernementaux
          </CardTitle>
          <CardDescription>
            Validation complète de l'intégration SRG, RREGOP et des calculs combinés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="w-full"
            size="lg"
          >
            <TestTube className="h-4 w-4 mr-2" />
            {isRunning ? 'Tests en cours...' : 'Lancer tous les tests'}
          </Button>

          {/* Résultats des tests */}
          {Object.keys(testResults).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Résultats des Tests</h3>
              
              {/* Test SRG */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(getTestStatus('srg'))}
                    <span className="font-medium">Service SRG</span>
                  </div>
                  {getStatusBadge(getTestStatus('srg'))}
                </div>
                <p className="text-sm text-gray-600">
                  {testResults.srg?.message || 'Test non exécuté'}
                </p>
                {testResults.srg?.error && (
                  <p className="text-sm text-red-600 mt-1">
                    Erreur: {testResults.srg.error}
                  </p>
                )}
              </div>

              {/* Test RREGOP */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(getTestStatus('rregop'))}
                    <span className="font-medium">Service RREGOP</span>
                  </div>
                  {getStatusBadge(getTestStatus('rregop'))}
                </div>
                <p className="text-sm text-gray-600">
                  {testResults.rregop?.message || 'Test non exécuté'}
                </p>
                {testResults.rregop?.error && (
                  <p className="text-sm text-red-600 mt-1">
                    Erreur: {testResults.rregop.error}
                  </p>
                )}
              </div>

              {/* Test Intégration */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(getTestStatus('integration'))}
                    <span className="font-medium">Service d'Intégration</span>
                  </div>
                  {getStatusBadge(getTestStatus('integration'))}
                </div>
                <p className="text-sm text-gray-600">
                  {testResults.integration?.message || 'Test non exécuté'}
                </p>
                {testResults.integration?.error && (
                  <p className="text-sm text-red-600 mt-1">
                    Erreur: {testResults.integration.error}
                  </p>
                )}
              </div>

              {/* Résumé global */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Résumé Global</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.values(testResults).filter((r: any) => r.success).length}
                    </div>
                    <div className="text-gray-600">Tests réussis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {Object.values(testResults).filter((r: any) => !r.success).length}
                    </div>
                    <div className="text-gray-600">Tests échoués</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Object.keys(testResults).length}
                    </div>
                    <div className="text-gray-600">Total tests</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
