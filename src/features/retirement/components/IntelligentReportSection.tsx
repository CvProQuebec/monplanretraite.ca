import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Button } from '../../ui/button';
import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  FileText, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  TrendingUp,
  Shield,
  Target,
  Clock,
  DollarSign,
  Lightbulb,
  BarChart3,
  Users,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { UserData } from '../types';
import { IntelligentReportService, IntelligentReport, CriticalAlert, PriorityAction } from '../services/intelligent_report_service';

interface IntelligentReportSectionProps {
  userData: UserData;
  onUpdate?: (section: keyof UserData, updates: any) => void;
  isFrench?: boolean;
}

export const IntelligentReportSection: React.FC<IntelligentReportSectionProps> = ({
  userData,
  onUpdate,
  isFrench = true
}) => {
  const [report, setReport] = useState<IntelligentReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('synthesis');

  // Génération automatique du rapport au montage
  useEffect(() => {
    generateReport();
  }, [userData]);

  // Génération du rapport
  const generateReport = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const generatedReport = await IntelligentReportService.generateComprehensiveReport(userData);
      setReport(generatedReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération du rapport');
      console.error('Erreur génération rapport:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Export du rapport en JSON sécurisé
  const exportReport = () => {
    if (!report) return;
    
    try {
      const jsonData = IntelligentReportService.exportReportAsJSON(report);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport-retraite-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur export:', err);
    }
  };

  // Export du résumé exécutif
  const exportExecutiveBrief = () => {
    if (!report) return;
    
    try {
      const brief = IntelligentReportService.generateExecutiveBrief(report);
      const blob = new Blob([brief], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume-executif-retraite-${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur export résumé:', err);
    }
  };

  // Rendu de la synthèse exécutive
  const renderExecutiveSummary = () => {
    if (!report) return null;

    const { executiveSummary } = report;
    const situationColors = {
      critique: 'bg-red-100 text-red-800 border-red-300',
      attention: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      stable: 'bg-blue-100 text-blue-800 border-blue-300',
      favorable: 'bg-green-100 text-green-800 border-green-300'
    };

    return (
      <div className="space-y-6">
        {/* Statut global */}
        <Card className={`border-2 ${situationColors[executiveSummary.situationFinanciere]}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6" />
              {isFrench ? 'Synthèse de votre situation' : 'Your Situation Summary'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <Badge 
                  variant="outline" 
                  className={`text-lg px-4 py-2 ${situationColors[executiveSummary.situationFinanciere]}`}
                >
                  {executiveSummary.situationFinanciere.charAt(0).toUpperCase() + executiveSummary.situationFinanciere.slice(1)}
                </Badge>
              </div>
              
              <p className="text-gray-700 text-center leading-relaxed">
                {executiveSummary.messagePersonnalise}
              </p>

              {/* Métriques clés */}
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-gray-800">
                    {executiveSummary.revenus.tauxRemplacement}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Taux de remplacement' : 'Replacement Rate'}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">
                    {executiveSummary.opportunites.total.toLocaleString()} $
                  </div>
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Opportunités/an' : 'Opportunities/year'}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">
                    {executiveSummary.revenus.projetes.toLocaleString()} $
                  </div>
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Revenus projetés' : 'Projected Income'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détail des opportunités */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {isFrench ? 'Opportunités identifiées' : 'Identified Opportunities'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {executiveSummary.opportunites.srgMontant > 0 && (
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">
                    {isFrench ? 'Supplément de Revenu Garanti (SRG)' : 'Guaranteed Income Supplement (GIS)'}
                  </span>
                  <span className="font-bold text-green-600">
                    +{executiveSummary.opportunites.srgMontant.toLocaleString()} $ /an
                  </span>
                </div>
              )}
              
              {executiveSummary.opportunites.rregopOptimisation > 0 && (
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Optimisation RREGOP</span>
                  <span className="font-bold text-blue-600">
                    +{executiveSummary.opportunites.rregopOptimisation.toLocaleString()} $ /an
                  </span>
                </div>
              )}
              
              {executiveSummary.opportunites.fiscaleEconomies > 0 && (
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">
                    {isFrench ? 'Optimisations fiscales' : 'Tax Optimizations'}
                  </span>
                  <span className="font-bold text-purple-600">
                    +{executiveSummary.opportunites.fiscaleEconomies.toLocaleString()} $ /an
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-800">
                  {isFrench ? 'Impact sur 15 ans de retraite' : '15-year Retirement Impact'}
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600 mt-2">
                +{(executiveSummary.opportunites.total * 15).toLocaleString()} $
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Rendu des alertes critiques
  const renderCriticalAlerts = () => {
    if (!report?.criticalAlerts.length) return null;

    const severityIcons = {
      urgent: <AlertTriangle className="w-5 h-5 text-red-500" />,
      important: <Clock className="w-5 h-5 text-yellow-500" />,
      attention: <Lightbulb className="w-5 h-5 text-blue-500" />
    };

    const severityColors = {
      urgent: 'border-red-300 bg-red-50',
      important: 'border-yellow-300 bg-yellow-50',
      attention: 'border-blue-300 bg-blue-50'
    };

    return (
      <div className="space-y-4">
        {report.criticalAlerts.map((alert, index) => (
          <Card key={index} className={`border-2 ${severityColors[alert.severity]}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {severityIcons[alert.severity]}
                  <span>{alert.title}</span>
                </div>
                <Badge variant={alert.severity === 'urgent' ? 'destructive' : 'default'}>
                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">{alert.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {isFrench ? 'Action requise' : 'Required Action'}
                  </h4>
                  <p className="text-sm text-gray-600">{alert.actionRequired}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {isFrench ? 'Impact financier' : 'Financial Impact'}
                  </h4>
                  <p className="text-lg font-bold text-green-600">
                    {alert.impact.toLocaleString()} $ /an
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-gray-800 mb-1">
                  {isFrench ? 'Conséquences si ignoré' : 'Consequences if Ignored'}
                </h5>
                <p className="text-sm text-gray-600">{alert.consequences}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Rendu des actions prioritaires
  const renderPriorityActions = () => {
    if (!report?.priorityActions.length) return null;

    const timeframeColors = {
      'immediat': 'bg-red-100 text-red-800',
      '3-mois': 'bg-orange-100 text-orange-800',
      '6-mois': 'bg-yellow-100 text-yellow-800',
      '1-an': 'bg-blue-100 text-blue-800',
      'long-terme': 'bg-gray-100 text-gray-800'
    };

    const effortIcons = {
      'faible': <CheckCircle className="w-4 h-4 text-green-500" />,
      'moyen': <Clock className="w-4 h-4 text-yellow-500" />,
      'eleve': <AlertTriangle className="w-4 h-4 text-red-500" />
    };

    return (
      <div className="space-y-4">
        {report.priorityActions.map((action, index) => (
          <Card key={action.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center">
                    {index + 1}
                  </span>
                  {action.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={timeframeColors[action.timeframe] || 'bg-gray-100 text-gray-800'}>
                    {action.timeframe}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {effortIcons[action.effort]}
                    <span className="text-sm text-gray-600">{action.effort}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{action.description}</p>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-800">
                  {isFrench ? 'Impact financier estimé' : 'Estimated Financial Impact'}
                </span>
                <span className="text-xl font-bold text-green-600">
                  +{action.impact.toLocaleString()} $ /an
                </span>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  {isFrench ? 'Étapes à suivre' : 'Steps to Follow'}
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {action.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-sm text-gray-600">{step}</li>
                  ))}
                </ul>
              </div>
              
              {action.resources.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {isFrench ? 'Ressources utiles' : 'Useful Resources'}
                  </h4>
                  <div className="space-y-2">
                    {action.resources.map((resource, resIndex) => (
                      <div key={resIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="font-medium text-sm">{resource.title}</span>
                          {resource.url && (
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline block"
                            >
                              {resource.url}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Rendu du calendrier d'implémentation
  const renderImplementationCalendar = () => {
    if (!report?.implementationCalendar) return null;

    const { phases, milestones, reviewDates } = report.implementationCalendar;

    return (
      <div className="space-y-6">
        {/* Phases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {isFrench ? 'Phases de mise en œuvre' : 'Implementation Phases'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {phases.map((phase, index) => (
                <div key={index} className="border-l-4 border-l-blue-500 pl-4">
                  <h3 className="font-semibold text-lg text-gray-800">{phase.name}</h3>
                  <div className="text-sm text-gray-600 mb-2">
                    {phase.startDate.toLocaleDateString()} - {phase.duration}
                  </div>
                  <p className="text-gray-700 mb-2">{phase.expectedOutcome}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">
                        {isFrench ? 'Objectifs' : 'Objectives'}
                      </h4>
                      <ul className="list-disc pl-4 text-sm text-gray-600">
                        {phase.objectives.map((obj, objIndex) => (
                          <li key={objIndex}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">
                        {isFrench ? 'Critères de succès' : 'Success Metrics'}
                      </h4>
                      <ul className="list-disc pl-4 text-sm text-gray-600">
                        {phase.successMetrics.map((metric, metricIndex) => (
                          <li key={metricIndex}>{metric}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Jalons */}
        {milestones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {isFrench ? 'Jalons importants' : 'Important Milestones'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{milestone.title}</h4>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{milestone.date.toLocaleDateString()}</span>
                        <span>Impact: {milestone.impact.toLocaleString()} $</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dates de révision */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              {isFrench ? 'Révisions programmées' : 'Scheduled Reviews'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {reviewDates.slice(0, 6).map((date, index) => (
                <div key={index} className="p-3 border rounded-lg text-center">
                  <div className="font-semibold text-gray-800">
                    {date.toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Révision annuelle' : 'Annual Review'} #{index + 1}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {isFrench 
                ? 'Révisions recommandées pour ajuster votre stratégie selon l\'évolution de votre situation'
                : 'Recommended reviews to adjust your strategy based on changing circumstances'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Rendu des scénarios comparatifs
  const renderComparativeScenarios = () => {
    if (!report?.comparativeScenarios.length) return null;

    const recommendationColors = {
      'recommande': 'border-green-300 bg-green-50',
      'acceptable': 'border-yellow-300 bg-yellow-50',
      'deconseille': 'border-red-300 bg-red-50'
    };

    const recommendationIcons = {
      'recommande': <CheckCircle className="w-5 h-5 text-green-600" />,
      'acceptable': <Clock className="w-5 h-5 text-yellow-600" />,
      'deconseille': <AlertTriangle className="w-5 h-5 text-red-600" />
    };

    return (
      <div className="space-y-4">
        {report.comparativeScenarios.map((scenario, index) => (
          <Card key={index} className={`border-2 ${recommendationColors[scenario.recommendation]}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{scenario.name}</span>
                <div className="flex items-center gap-2">
                  {recommendationIcons[scenario.recommendation]}
                  <Badge 
                    variant="outline"
                    className={
                      scenario.recommendation === 'recommande' ? 'text-green-700 border-green-300' :
                      scenario.recommendation === 'acceptable' ? 'text-yellow-700 border-yellow-300' :
                      'text-red-700 border-red-300'
                    }
                  >
                    {scenario.recommendation.charAt(0).toUpperCase() + scenario.recommendation.slice(1)}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{scenario.description}</p>
              
              {/* Résultats financiers */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-lg font-bold text-gray-800">
                    {scenario.results.annuel.toLocaleString()} $
                  </div>
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Revenus annuels' : 'Annual Income'}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-lg font-bold text-blue-600">
                    {scenario.results.viager.toLocaleString()} $
                  </div>
                  <div className="text-sm text-gray-600">
                    {isFrench ? 'Total viager' : 'Lifetime Total'}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-white rounded border">
                  <Badge 
                    variant={
                      scenario.results.risque === 'faible' ? 'default' :
                      scenario.results.risque === 'moyen' ? 'secondary' : 'destructive'
                    }
                    className="text-sm"
                  >
                    {isFrench ? 'Risque' : 'Risk'}: {scenario.results.risque}
                  </Badge>
                </div>
              </div>
              
              {/* Avantages et inconvénients */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {isFrench ? 'Avantages' : 'Advantages'}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {scenario.advantages.map((advantage, advIndex) => (
                      <li key={advIndex} className="text-sm text-gray-600">{advantage}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {isFrench ? 'Inconvénients' : 'Disadvantages'}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {scenario.disadvantages.map((disadvantage, disIndex) => (
                      <li key={disIndex} className="text-sm text-gray-600">{disadvantage}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Hypothèses */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  {isFrench ? 'Hypothèses' : 'Assumptions'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {scenario.assumptions.map((assumption, assIndex) => (
                    <Badge key={assIndex} variant="outline" className="text-xs">
                      {assumption}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isGenerating) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isFrench ? 'Génération de votre rapport personnalisé...' : 'Generating your personalized report...'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {isFrench ? 'Analyse de vos données et calcul des optimisations' : 'Analyzing your data and calculating optimizations'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {isFrench ? 'Aucun rapport disponible' : 'No report available'}
          </p>
          <Button onClick={generateReport}>
            {isFrench ? 'Générer le rapport' : 'Generate Report'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                {isFrench ? 'Rapport de Planification Personnalisé' : 'Personalized Planning Report'}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {isFrench 
                  ? `Généré le ${report.metadata.generatedAt.toLocaleDateString()} - Valide jusqu'au ${report.metadata.validUntil.toLocaleDateString()}`
                  : `Generated on ${report.metadata.generatedAt.toLocaleDateString()} - Valid until ${report.metadata.validUntil.toLocaleDateString()}`
                }
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportExecutiveBrief}>
                <Download className="w-4 h-4 mr-2" />
                {isFrench ? 'Résumé' : 'Summary'}
              </Button>
              <Button variant="outline" size="sm" onClick={exportReport}>
                <Download className="w-4 h-4 mr-2" />
                {isFrench ? 'Rapport complet' : 'Full Report'}
              </Button>
              <Button size="sm" onClick={generateReport}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {isFrench ? 'Actualiser' : 'Refresh'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Alerte de sécurité */}
      <Alert className="border-green-300 bg-green-50">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>{isFrench ? 'Sécurité des données : ' : 'Data Security: '}</strong>
          {isFrench 
            ? 'Votre rapport est généré localement. Aucune donnée personnelle n\'est transmise à nos serveurs.'
            : 'Your report is generated locally. No personal data is transmitted to our servers.'
          }
        </AlertDescription>
      </Alert>

      {/* Onglets du rapport */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="synthesis">
            {isFrench ? 'Synthèse' : 'Summary'}
          </TabsTrigger>
          <TabsTrigger value="alerts">
            {isFrench ? 'Alertes' : 'Alerts'}
            {report.criticalAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {report.criticalAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="actions">
            {isFrench ? 'Actions' : 'Actions'}
          </TabsTrigger>
          <TabsTrigger value="calendar">
            {isFrench ? 'Calendrier' : 'Timeline'}
          </TabsTrigger>
          <TabsTrigger value="scenarios">
            {isFrench ? 'Scénarios' : 'Scenarios'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="synthesis">
          {renderExecutiveSummary()}
        </TabsContent>

        <TabsContent value="alerts">
          {renderCriticalAlerts()}
        </TabsContent>

        <TabsContent value="actions">
          {renderPriorityActions()}
        </TabsContent>

        <TabsContent value="calendar">
          {renderImplementationCalendar()}
        </TabsContent>

        <TabsContent value="scenarios">
          {renderComparativeScenarios()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligentReportSection;
