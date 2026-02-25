import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Download, Eye, AlertTriangle, TrendingUp, Calculator, Target, BarChart3 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useRetirementData } from '../hooks/useRetirementData';
import { useSubscriptionLimits } from '../../../hooks/useSubscriptionLimits';
import ConsentDialog from '@/components/ui/ConsentDialog';

export type ReportType = 'comprehensive' | 'cashflow' | 'monte-carlo' | 'summary';
export type ReportFormat = 'pdf' | 'html' | 'csv';

interface ReportOptions {
  type: ReportType;
  format: ReportFormat;
  includeCharts: boolean;
  includeLegalWarnings: boolean;
  language: 'fr' | 'en';
}

const ReportGenerator: React.FC = () => {
  const { language } = useLanguage();
  const { userData: retirementData } = useRetirementData();
  const { checkAccess } = useSubscriptionLimits();
  
  const isEnglish = language === 'en';
  
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    type: 'summary',
    format: 'pdf',
    includeCharts: true,
    includeLegalWarnings: true,
    language: isEnglish ? 'en' : 'fr'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [pendingReportGeneration, setPendingReportGeneration] = useState(false);

  // Vérifier l'accès aux rapports selon le plan
  const canGenerateReport = (type: ReportType): boolean => {
    switch (type) {
      case 'summary':
        return true; // Tous les plans
      case 'cashflow':
        return checkAccess('hasCashflowManagement');
      case 'monte-carlo':
        return checkAccess('hasMonteCarloSimulations');
      case 'comprehensive':
        return checkAccess('hasAdvancedAnalytics');
      default:
        return false;
    }
  };

  const getReportInfo = (type: ReportType) => {
    const reports = {
      comprehensive: {
        title: isEnglish ? 'Comprehensive Financial Planning Report' : 'Rapport de planification financière complète',
        description: isEnglish 
          ? 'Complete report for financial planners and advisors'
          : 'Rapport complet pour planificateurs financiers et conseillers',
        icon: <FileText className="w-5 h-5" />,
        badge: isEnglish ? 'Professional' : 'Professionnel'
      },
      cashflow: {
        title: isEnglish ? 'Monthly Cashflow Report' : 'Rapport de flux de trésorerie mensuel',
        description: isEnglish
          ? 'Weekly breakdown of income and expenses'
          : 'Répartition hebdomadaire des revenus et dépenses',
        icon: <TrendingUp className="w-5 h-5" />,
        badge: isEnglish ? 'Professional' : 'Professionnel'
      },
      'monte-carlo': {
        title: isEnglish ? 'Monte Carlo Simulation Report' : 'Rapport de simulation Monte Carlo',
        description: isEnglish
          ? 'Risk analysis and probability scenarios'
          : 'Analyse des risques et scénarios de probabilité',
        icon: <Calculator className="w-5 h-5" />,
        badge: isEnglish ? 'Professional' : 'Professionnel'
      },
      summary: {
        title: isEnglish ? 'Executive Summary Report' : 'Rapport de résumé exécutif',
        description: isEnglish
          ? 'Key insights and recommendations overview'
          : 'Aperçu des points clés et recommandations',
        icon: <Target className="w-5 h-5" />,
        badge: isEnglish ? 'Free' : 'Gratuit'
      }
    };
    return reports[type];
  };

  const handleGenerateReport = async () => {
    if (!canGenerateReport(reportOptions.type)) {
      // Afficher modal d'upgrade
      return;
    }

    // Afficher le dialog de consentement avant de générer le rapport
    setShowConsentDialog(true);
    setPendingReportGeneration(true);
  };

  const handleConsentAccepted = async () => {
    setShowConsentDialog(false);
    setPendingReportGeneration(false);
    
    setIsGenerating(true);
    try {
      // Simulation de génération de rapport
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ici, vous intégrerez la vraie logique de génération
      console.log('Génération du rapport:', reportOptions);
      
    } catch (error) {
      console.error('Erreur de génération:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConsentDeclined = () => {
    setShowConsentDialog(false);
    setPendingReportGeneration(false);
  };

  const tr = {
    title: isEnglish ? 'Report Generator' : 'Générateur de rapports',
    subtitle: isEnglish ? 'Generate professional reports for your retirement planning' : 'Générez des rapports professionnels pour votre planification de retraite',
    generate: isEnglish ? 'Generate Report' : 'Générer le rapport',
    generating: isEnglish ? 'Generating...' : 'Génération...',
    legalWarning: isEnglish ? 'Legal Warnings' : 'Avertissements légaux',
    charts: isEnglish ? 'Include Charts' : 'Inclure les graphiques',
    format: isEnglish ? 'Format' : 'Format',
    type: isEnglish ? 'Report Type' : 'Type de rapport',
    upgradeRequired: isEnglish ? 'Upgrade Required' : 'Mise à niveau requise',
    upgradeMessage: isEnglish ? 'Upgrade to Professional or Expert plan to access this report' : 'Mettez à niveau vers le plan Professionnel ou Expert pour accéder à ce rapport'
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{tr.title}</h2>
        <p className="text-gray-600">{tr.subtitle}</p>
      </div>

      {/* Avertissement légal */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-lg text-amber-800">{tr.legalWarning}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-amber-700 space-y-2">
            <p>
              <strong>⚠️ AVERTISSEMENT IMPORTANT :</strong>
            </p>
            <p>
              Cette plateforme de planification financière est un outil éducatif et informatif 
              qui ne remplace en aucun cas une consultation avec un professionnel qualifié.
            </p>
            <p>
              <strong> VOS RESPONSABILITÉS :</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Consultez un planificateur financier agréé pour vos décisions importantes</li>
              <li>Vérifiez la validité fiscale de vos stratégies avec un fiscaliste</li>
              <li>Obtenez des conseils juridiques pour la planification successorale</li>
            </ul>
            <p>
              <strong> AVANTAGES DE NOTRE SOLUTION :</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Économisez du temps en préparant votre dossier à l'avance</li>
              <li>Réduisez le nombre de rencontres avec vos professionnels</li>
              <li>Prenez le contrôle de vos finances avec des outils professionnels</li>
              <li>Optimisez vos consultations grâce à une meilleure compréhension</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Options de rapport */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {isEnglish ? 'Report Options' : 'Options du rapport'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Type de rapport */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['comprehensive', 'cashflow', 'monte-carlo', 'summary'] as ReportType[]).map((type) => {
              const info = getReportInfo(type);
              const hasAccess = canGenerateReport(type);
              
              return (
                <Card 
                  key={type}
                  className={`cursor-pointer transition-all ${
                    reportOptions.type === type 
                      ? 'ring-2 ring-mpr-interactive bg-mpr-interactive-lt' 
                      : 'hover:bg-gray-50'
                  } ${!hasAccess ? 'opacity-60' : ''}`}
                  onClick={() => hasAccess && setReportOptions(prev => ({ ...prev, type }))}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="text-mpr-interactive">{info.icon}</div>
                      <Badge variant={hasAccess ? 'default' : 'secondary'}>
                        {info.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-600">{info.description}</p>
                    {!hasAccess && (
                      <p className="text-xs text-red-600 mt-2">{tr.upgradeMessage}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Options avancées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            {/* Format */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                {tr.format}
              </label>
              <Select 
                value={reportOptions.format} 
                onValueChange={(value: ReportFormat) => 
                  setReportOptions(prev => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Graphiques */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="charts"
                checked={reportOptions.includeCharts}
                onCheckedChange={(checked) => 
                  setReportOptions(prev => ({ ...prev, includeCharts: !!checked }))
                }
              />
              <label htmlFor="charts" className="text-sm font-medium text-gray-700">
                {tr.charts}
              </label>
            </div>

            {/* Avertissements légaux */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="legal"
                checked={reportOptions.includeLegalWarnings}
                onCheckedChange={(checked) => 
                  setReportOptions(prev => ({ ...prev, includeLegalWarnings: !!checked }))
                }
              />
              <label htmlFor="legal" className="text-sm font-medium text-gray-700">
                {tr.legalWarning}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bouton de génération */}
      <div className="text-center">
        <Button
          onClick={handleGenerateReport}
          disabled={isGenerating || !canGenerateReport(reportOptions.type)}
          size="lg"
          className="px-8 py-3"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {tr.generating}
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              {tr.generate}
            </>
          )}
        </Button>
      </div>

      {/* Dialog de consentement */}
      <ConsentDialog
        isOpen={showConsentDialog}
        onClose={handleConsentDeclined}
        onConsent={handleConsentAccepted}
        featureName={getReportInfo(reportOptions.type).title}
        isFrench={!isEnglish}
      />
    </div>
  );
};

export default ReportGenerator;
