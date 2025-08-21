import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Home,
  User,
  DollarSign,
  BarChart3,
  FileText,
  Globe
} from 'lucide-react';
import OQLFValidator, { OQLFValidationResult } from '@/utils/oqlfValidator';

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

const TestNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [oqlfResults, setOqlfResults] = useState<OQLFValidationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runNavigationTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // Test 1: Vérification des routes principales
    try {
      const routes = ['/', '/mon-profil', '/ma-retraite', '/mes-resultats'];
      const routeNames = ['Accueil', 'Mon Profil', 'Ma Retraite', 'Mes Résultats'];
      
      for (let i = 0; i < routes.length; i++) {
        navigate(routes[i]);
        await new Promise(resolve => setTimeout(resolve, 100)); // Attendre la navigation
        
        if (window.location.pathname === routes[i]) {
          results.push({
            test: `Navigation vers ${routeNames[i]}`,
            status: 'success',
            message: `Route ${routes[i]} accessible`,
            details: `Navigation réussie vers ${routeNames[i]}`
          });
        } else {
          results.push({
            test: `Navigation vers ${routeNames[i]}`,
            status: 'error',
            message: `Route ${routes[i]} non accessible`,
            details: `Attendu: ${routes[i]}, Obtenu: ${window.location.pathname}`
          });
        }
      }
    } catch (error) {
      results.push({
        test: 'Test des routes principales',
        status: 'error',
        message: 'Erreur lors du test des routes',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Test 2: Vérification des composants de navigation
    try {
      // Vérifier que SeniorsNavigationHeader est présent
      const navHeader = document.querySelector('[data-testid="seniors-nav"]') || 
                       document.querySelector('.seniors-navigation') ||
                       document.querySelector('nav');
      
      if (navHeader) {
        results.push({
          test: 'Composant SeniorsNavigationHeader',
          status: 'success',
          message: 'Navigation seniors présente',
          details: 'Le composant de navigation est bien rendu'
        });
      } else {
        results.push({
          test: 'Composant SeniorsNavigationHeader',
          status: 'warning',
          message: 'Navigation seniors non détectée',
          details: 'Vérifier que le composant est bien importé et rendu'
        });
      }
    } catch (error) {
      results.push({
        test: 'Composant SeniorsNavigationHeader',
        status: 'error',
        message: 'Erreur lors de la vérification de la navigation',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Test 3: Vérification des composants UI
    try {
      const uiComponents = [
        { name: 'Card', selector: '.card, [class*="card"]' },
        { name: 'Button', selector: 'button' },
        { name: 'Badge', selector: '[class*="badge"]' }
      ];

      uiComponents.forEach(component => {
        const elements = document.querySelectorAll(component.selector);
        if (elements.length > 0) {
          results.push({
            test: `Composant UI ${component.name}`,
            status: 'success',
            message: `${component.name} présent`,
            details: `${elements.length} élément(s) trouvé(s)`
          });
        } else {
          results.push({
            test: `Composant UI ${component.name}`,
            status: 'warning',
            message: `${component.name} non détecté`,
            details: 'Vérifier l\'import et l\'utilisation'
          });
        }
      });
    } catch (error) {
      results.push({
        test: 'Composants UI',
        status: 'error',
        message: 'Erreur lors de la vérification des composants UI',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Test 4: Vérification de la langue
    try {
      const languageElements = document.querySelectorAll('[lang], [data-lang]');
      if (languageElements.length > 0) {
        results.push({
          test: 'Support multilingue',
          status: 'success',
          message: 'Attributs de langue présents',
          details: `${languageElements.length} élément(s) avec attribut de langue`
        });
      } else {
        results.push({
          test: 'Support multilingue',
          status: 'warning',
          message: 'Attributs de langue non détectés',
          details: 'Vérifier l\'implémentation du support multilingue'
        });
      }
    } catch (error) {
      results.push({
        test: 'Support multilingue',
        status: 'error',
        message: 'Erreur lors de la vérification du support multilingue',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const runOQLFValidation = () => {
    const results = OQLFValidator.validateApplicationTexts();
    setOqlfResults(results);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getOQLFStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'border-green-200 bg-green-50';
      case 'invalid':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const warningCount = testResults.filter(r => r.status === 'warning').length;

  const oqlfInvalidCount = oqlfResults.filter(r => r.status === 'invalid').length;
  const oqlfWarningCount = oqlfResults.filter(r => r.status === 'warning').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête du test */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              🧪 Test de Navigation - Nouvelle Structure
            </CardTitle>
            <p className="text-gray-600">
              Validation complète de la navigation entre les 4 pages principales et conformité OQLF
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Home className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-blue-800">Accueil</div>
                <div className="text-sm text-blue-600">/</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <User className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-green-800">Mon Profil</div>
                <div className="text-sm text-green-600">/mon-profil</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-purple-800">Ma Retraite</div>
                <div className="text-sm text-purple-600">/ma-retraite</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="font-semibold text-orange-800">Mes Résultats</div>
                <div className="text-sm text-orange-600">/mes-resultats</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={runNavigationTests}
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? 'Tests en cours...' : '🧭 Lancer les tests de navigation'}
              </Button>
              
              <Button 
                onClick={runOQLFValidation}
                variant="outline"
                className="w-full"
              >
                <Globe className="w-4 h-4 mr-2" />
                📋 Valider la conformité OQLF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Résultats des tests de navigation */}
        {testResults.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                📊 Résultats des Tests de Navigation
              </CardTitle>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-700">{successCount} succès</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-700">{warningCount} avertissements</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700">{errorCount} erreurs</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-1">
                          {result.test}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {result.message}
                        </div>
                        {result.details && (
                          <div className="text-xs text-gray-500 bg-white/50 p-2 rounded">
                            {result.details}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Résultats de la validation OQLF */}
        {oqlfResults.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                📋 Validation Conformité OQLF
              </CardTitle>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700">{oqlfInvalidCount} erreurs</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-700">{oqlfWarningCount} avertissements</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {oqlfResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${getOQLFStatusColor(result.status)}`}
                  >
                    <div className="flex items-start gap-3">
                      {result.status === 'invalid' ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-1">
                          {result.rule}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {result.message}
                        </div>
                        <div className="text-xs text-gray-500 bg-white/50 p-2 rounded mb-2">
                          <strong>Texte concerné :</strong> {result.text}
                        </div>
                        {result.suggestion && (
                          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                            💡 {result.suggestion}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Rapport OQLF complet */}
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">📋 Rapport OQLF Complet :</h4>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {OQLFValidator.generateReport(oqlfResults)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation manuelle de test */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>🧭 Navigation Manuelle de Test</CardTitle>
            <p className="text-gray-600">
              Testez manuellement la navigation entre les pages
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="h-20 flex flex-col gap-2"
              >
                <Home className="w-6 h-6" />
                <span className="text-sm">Accueil</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/mon-profil')}
                className="h-20 flex flex-col gap-2"
              >
                <User className="w-6 h-6" />
                <span className="text-sm">Mon Profil</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/ma-retraite')}
                className="h-20 flex flex-col gap-2"
              >
                <DollarSign className="w-6 h-6" />
                <span className="text-sm">Ma Retraite</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/mes-resultats')}
                className="h-20 flex flex-col gap-2"
              >
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm">Mes Résultats</span>
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <div className="text-sm text-gray-600">
                <strong>Page actuelle :</strong> {location.pathname}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestNavigation;
