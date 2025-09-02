/**
 * Gestionnaire de rapports professionnels
 * Interface pour générer des rapports adaptés aux différents professionnels
 */

import React, { useState } from 'react';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { ProfessionalReportGenerator, ReportData, ReportOptions } from '@/services/ProfessionalReportGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { Alert, AlertDescription } from './alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { 
  FileText,
  Download,
  Calculator,
  Building,
  Scale,
  Home,
  AlertTriangle,
  CheckCircle,
  Users,
  DollarSign,
  TrendingUp,
  Shield,
  Briefcase
} from 'lucide-react';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  recipients: string[];
  color: string;
  isPremium: boolean;
}

const reportTypes: ReportType[] = [
  {
    id: 'fiscal',
    name: 'Rapport Fiscal',
    description: 'Analyse fiscale complète pour votre comptable avec optimisations et projections',
    icon: <Calculator className="w-5 h-5" />,
    recipients: ['comptable'],
    color: 'bg-blue-500',
    isPremium: true
  },
  {
    id: 'financial_planning',
    name: 'Analyse Patrimoniale',
    description: 'Rapport complet pour planificateur financier avec stratégies de placement',
    icon: <TrendingUp className="w-5 h-5" />,
    recipients: ['planificateur'],
    color: 'bg-green-500',
    isPremium: true
  },
  {
    id: 'banking',
    name: 'Dossier de Financement',
    description: 'Documentation complète pour demande de prêt ou financement bancaire',
    icon: <Building className="w-5 h-5" />,
    recipients: ['banquier'],
    color: 'bg-purple-500',
    isPremium: true
  },
  {
    id: 'real_estate',
    name: 'Analyse Immobilière',
    description: 'Rapport de vente de 2e propriété avec implications fiscales et scénarios',
    icon: <Home className="w-5 h-5" />,
    recipients: ['comptable', 'planificateur', 'notaire'],
    color: 'bg-orange-500',
    isPremium: true
  },
  {
    id: 'legal',
    name: 'Dossier Juridique',
    description: 'Documentation successorale et juridique pour avocat ou notaire',
    icon: <Scale className="w-5 h-5" />,
    recipients: ['avocat', 'notaire'],
    color: 'bg-red-500',
    isPremium: true
  },
  {
    id: 'emergency',
    name: 'Plan d\'Urgence',
    description: 'Plan de planification d\'urgence complet (gratuit)',
    icon: <Shield className="w-5 h-5" />,
    recipients: ['general'],
    color: 'bg-gray-500',
    isPremium: false
  }
];

const recipients = [
  { id: 'comptable', name: 'Comptable', icon: <Calculator className="w-4 h-4" /> },
  { id: 'planificateur', name: 'Planificateur Financier', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'banquier', name: 'Banquier', icon: <Building className="w-4 h-4" /> },
  { id: 'avocat', name: 'Avocat', icon: <Scale className="w-4 h-4" /> },
  { id: 'notaire', name: 'Notaire', icon: <FileText className="w-4 h-4" /> },
  { id: 'general', name: 'Usage Général', icon: <Users className="w-4 h-4" /> }
];

export const ProfessionalReportManager: React.FC = () => {
  const { userData } = useRetirementData();
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [reportOptions, setReportOptions] = useState<Partial<ReportOptions>>({
    includePersonalInfo: true,
    includeFinancialDetails: true,
    includeProjections: true,
    includeRecommendations: true,
    language: 'fr'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string>('');

  const selectedReport = reportTypes.find(r => r.id === selectedReportType);

  const generateReport = async () => {
    if (!selectedReportType || !selectedRecipient) return;

    setIsGenerating(true);
    try {
      // Préparer les données pour le rapport
      const reportData: ReportData = {
        personal: userData.personal || {},
        financial: {
          monthlyIncome: (userData.personal as any)?.monthlyIncome || 0,
          monthlyExpenses: (userData.personal as any)?.monthlyExpenses || 0,
          netWorth: (userData.personal as any)?.netWorth || 0,
          budgetData: (userData.personal as any)?.budgetData || {},
          ...(userData as any).financial
        },
        retirement: userData.retirement || {},
        realEstate: (userData as any).realEstate || {},
        seasonal: (userData.personal as any)?.seasonalBudgetData || {},
        emergency: (userData as any).emergency || {}
      };

      const options: ReportOptions = {
        type: selectedReportType as any,
        recipient: selectedRecipient as any,
        includePersonalInfo: reportOptions.includePersonalInfo || false,
        includeFinancialDetails: reportOptions.includeFinancialDetails || false,
        includeProjections: reportOptions.includeProjections || false,
        includeRecommendations: reportOptions.includeRecommendations || false,
        language: reportOptions.language || 'fr'
      };

      const report = ProfessionalReportGenerator.generateReport(reportData, options);
      setGeneratedReport(report);
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!generatedReport || !selectedReport) return;

    const filename = `${selectedReport.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
    ProfessionalReportGenerator.exportReport(generatedReport, filename);
  };

  const resetForm = () => {
    setSelectedReportType('');
    setSelectedRecipient('');
    setGeneratedReport('');
    setReportOptions({
      includePersonalInfo: true,
      includeFinancialDetails: true,
      includeProjections: true,
      includeRecommendations: true,
      language: 'fr'
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-blue-900">
            <Briefcase className="h-6 w-6 mr-2" />
            {isFrench ? 'Rapports professionnels' : 'Professional Reports'}
          </CardTitle>
          <CardDescription className="text-blue-700">
            {isFrench 
              ? 'Générez des rapports personnalisés pour vos professionnels : comptable, planificateur financier, banquier, avocat, notaire.'
              : 'Generate customized reports for your professionals: accountant, financial planner, banker, lawyer, notary.'
            }
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">
            {isFrench ? 'Générateur de rapports' : 'Report Generator'}
          </TabsTrigger>
          <TabsTrigger value="preview">
            {isFrench ? 'Aperçu du rapport' : 'Report Preview'}
          </TabsTrigger>
        </TabsList>

        {/* Générateur de rapports */}
        <TabsContent value="generator" className="space-y-6">
          {/* Sélection du type de rapport */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {isFrench ? 'Type de rapport' : 'Report Type'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTypes.map((report) => (
                  <div
                    key={report.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedReportType === report.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedReportType(report.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${report.color} text-white`}>
                        {report.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{report.name}</h3>
                          {report.isPremium && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Premium
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{report.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sélection du destinataire */}
          {selectedReportType && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {isFrench ? 'Destinataire' : 'Recipient'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                  <SelectTrigger>
                    <SelectValue placeholder={isFrench ? "Sélectionnez le destinataire" : "Select recipient"} />
                  </SelectTrigger>
                  <SelectContent>
                    {recipients
                      .filter(r => selectedReport?.recipients.includes(r.id) || r.id === 'general')
                      .map((recipient) => (
                        <SelectItem key={recipient.id} value={recipient.id}>
                          <div className="flex items-center gap-2">
                            {recipient.icon}
                            {recipient.name}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Options du rapport */}
          {selectedReportType && selectedRecipient && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {isFrench ? 'Options du rapport' : 'Report Options'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="personalInfo"
                      checked={reportOptions.includePersonalInfo}
                      onCheckedChange={(checked) => 
                        setReportOptions(prev => ({ ...prev, includePersonalInfo: checked as boolean }))
                      }
                    />
                    <Label htmlFor="personalInfo" className="text-sm">
                      {isFrench ? 'Inclure les informations personnelles' : 'Include personal information'}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="financialDetails"
                      checked={reportOptions.includeFinancialDetails}
                      onCheckedChange={(checked) => 
                        setReportOptions(prev => ({ ...prev, includeFinancialDetails: checked as boolean }))
                      }
                    />
                    <Label htmlFor="financialDetails" className="text-sm">
                      {isFrench ? 'Inclure les détails financiers' : 'Include financial details'}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="projections"
                      checked={reportOptions.includeProjections}
                      onCheckedChange={(checked) => 
                        setReportOptions(prev => ({ ...prev, includeProjections: checked as boolean }))
                      }
                    />
                    <Label htmlFor="projections" className="text-sm">
                      {isFrench ? 'Inclure les projections' : 'Include projections'}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recommendations"
                      checked={reportOptions.includeRecommendations}
                      onCheckedChange={(checked) => 
                        setReportOptions(prev => ({ ...prev, includeRecommendations: checked as boolean }))
                      }
                    />
                    <Label htmlFor="recommendations" className="text-sm">
                      {isFrench ? 'Inclure les recommandations' : 'Include recommendations'}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Boutons d'action */}
          {selectedReportType && selectedRecipient && (
            <div className="flex gap-4">
              <Button
                onClick={generateReport}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isFrench ? 'Génération...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    {isFrench ? 'Générer le rapport' : 'Generate Report'}
                  </>
                )}
              </Button>

              <Button
                onClick={resetForm}
                variant="outline"
                className="px-6"
              >
                {isFrench ? 'Réinitialiser' : 'Reset'}
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Aperçu du rapport */}
        <TabsContent value="preview" className="space-y-6">
          {generatedReport ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {isFrench ? 'Aperçu du rapport' : 'Report Preview'}
                  </CardTitle>
                  <Button onClick={downloadReport} className="bg-green-500 hover:bg-green-600">
                    <Download className="w-4 h-4 mr-2" />
                    {isFrench ? 'Télécharger' : 'Download'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {generatedReport}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {isFrench ? 'Aucun rapport généré' : 'No report generated'}
                </h3>
                <p className="text-gray-500">
                  {isFrench 
                    ? 'Utilisez l\'onglet "Générateur de Rapports" pour créer votre premier rapport.'
                    : 'Use the "Report Generator" tab to create your first report.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Informations de sécurité */}
      <Alert className="border-green-200 bg-green-50">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <strong className="text-green-800">
            {isFrench ? 'Sécurité et Confidentialité :' : 'Security and Privacy:'}
          </strong>
          <br />
          {isFrench 
            ? 'Tous les rapports sont générés localement dans votre navigateur. Vos données personnelles ne sont jamais transmises vers des serveurs externes. Les rapports incluent des footers professionnels adaptés selon le type et le destinataire.'
            : 'All reports are generated locally in your browser. Your personal data is never transmitted to external servers. Reports include professional footers adapted according to type and recipient.'
          }
        </AlertDescription>
      </Alert>

      {/* Guide d'utilisation */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">
            {isFrench ? 'Guide d\'utilisation' : 'Usage Guide'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">
                {isFrench ? '📊 Rapports fiscaux' : '📊 Tax Reports'}
              </h4>
              <ul className="space-y-1">
                <li>• {isFrench ? 'Optimisations fiscales REER/CELI' : 'RRSP/TFSA tax optimizations'}</li>
                <li>• {isFrench ? 'Projections et déductions' : 'Projections and deductions'}</li>
                <li>• {isFrench ? 'Stratégies de décaissement' : 'Withdrawal strategies'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                {isFrench ? '🏠 Rapports immobiliers' : '🏠 Real Estate Reports'}
              </h4>
              <ul className="space-y-1">
                <li>• {isFrench ? 'Analyse de vente 2e propriété' : '2nd property sale analysis'}</li>
                <li>• {isFrench ? 'Implications fiscales' : 'Tax implications'}</li>
                <li>• {isFrench ? 'Scénarios optimistes/conservateurs' : 'Optimistic/conservative scenarios'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                {isFrench ? '🏦 Dossiers bancaires' : '🏦 Banking Files'}
              </h4>
              <ul className="space-y-1">
                <li>• {isFrench ? 'Capacité d\'emprunt' : 'Borrowing capacity'}</li>
                <li>• {isFrench ? 'Actifs et garanties' : 'Assets and collateral'}</li>
                <li>• {isFrench ? 'Analyse de risque crédit' : 'Credit risk analysis'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                {isFrench ? '⚖️ Dossiers juridiques' : '⚖️ Legal Files'}
              </h4>
              <ul className="space-y-1">
                <li>• {isFrench ? 'Planification successorale' : 'Estate planning'}</li>
                <li>• {isFrench ? 'Documents juridiques' : 'Legal documents'}</li>
                <li>• {isFrench ? 'Recommandations notariales' : 'Notarial recommendations'}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalReportManager;
