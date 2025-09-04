import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Users,
  Heart,
  FileText,
  Zap,
  Download,
  Share2,
  Settings,
  TrendingUp,
  Target,
  Activity,
  Calculator
} from 'lucide-react';
import { UserData } from '@/types';

// Import all the longevity components
import PersonalizedLongevityAnalysis from './PersonalizedLongevityAnalysis';
import LongevityImpactCharts from './LongevityImpactCharts';
import LongevityComparisons from './LongevityComparisons';
import CoupleAnalysis from './CoupleAnalysis';
import LongevitySimulator from './LongevitySimulator';
import { PDFExportService } from '@/services/PDFExportService';

interface LongevityDashboardProps {
  userData: UserData;
  isFrench: boolean;
  personNumber: 1 | 2;
}

interface DashboardMetrics {
  lifeExpectancy: number;
  percentileRank: number;
  yearsGained: number;
  costSavings: number;
  qualityOfLife: number;
}

const LongevityDashboard: React.FC<LongevityDashboardProps> = ({
  userData,
  isFrench,
  personNumber
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Calculate current life expectancy (simplified version)
  const currentLifeExpectancy = useMemo(() => {
    const personal = userData.personal || {};
    const fieldSuffix = personNumber === 1 ? '1' : '2';

    // Base life expectancy from CPM2014
    const baseLifeExpectancy = personal[`sexe${fieldSuffix}`] === 'F' ? 85.2 : 81.8;

    // Health adjustments
    const healthCoefficients: { [key: string]: number } = {
      'excellent': 2.8, 'tresbon': 1.9, 'bon': 0.7, 'moyen': -1.4, 'fragile': -3.2
    };

    const lifestyleCoefficients: { [key: string]: number } = {
      'tresActif': 2.1, 'actif': 1.4, 'modere': 0.6, 'legerementActif': -0.3, 'sedentaire': -1.8
    };

    const smokingCoefficients: { [key: string]: number } = {
      'never': 0, 'former': -1.2, 'current': -2.8
    };

    const healthAdjustment = healthCoefficients[personal[`etatSante${fieldSuffix}`] || 'bon'] || 0.7;
    const lifestyleAdjustment = lifestyleCoefficients[personal[`modeVieActif${fieldSuffix}`] || 'modere'] || 0.6;
    const smokingAdjustment = smokingCoefficients[personal[`statutTabagique${fieldSuffix}`] || 'never'] || 0;

    const totalAdjustment = Math.max(-4.0, Math.min(4.0, healthAdjustment + lifestyleAdjustment + smokingAdjustment));

    return Math.max(65, Math.min(105, baseLifeExpectancy + totalAdjustment));
  }, [userData, personNumber]);

  // Dashboard metrics
  const dashboardMetrics = useMemo((): DashboardMetrics => {
    return {
      lifeExpectancy: currentLifeExpectancy,
      percentileRank: 75, // Placeholder - would be calculated from benchmark service
      yearsGained: 2.3, // Placeholder - would be calculated from improvements
      costSavings: 1800, // Placeholder - annual savings
      qualityOfLife: 78 // Placeholder - quality of life score
    };
  }, [currentLifeExpectancy]);

  // Handle PDF export
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const pdfBlob = await PDFExportService.generateLongevityReport(
        userData,
        currentLifeExpectancy,
        {
          includeCharts: true,
          includeComparisons: true,
          includeCoupleAnalysis: true,
          includeRecommendations: true,
          language: isFrench ? 'fr' : 'en',
          reportTitle: isFrench ? 'Rapport de Longévité Personnalisé' : 'Personalized Longevity Report',
          authorName: 'Mon Plan Retraite'
        }
      );

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `longevity-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle quick summary export
  const handleExportSummary = async () => {
    try {
      const pdfBlob = await PDFExportService.generateQuickSummary(
        userData,
        currentLifeExpectancy,
        isFrench ? 'fr' : 'en'
      );

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `longevity-summary-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting summary:', error);
    }
  };

  const tabs = [
    {
      id: 'overview',
      label: isFrench ? 'Aperçu' : 'Overview',
      icon: <Activity className="w-4 h-4" />,
      component: (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    {isFrench ? 'Espérance de Vie' : 'Life Expectancy'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {dashboardMetrics.lifeExpectancy.toFixed(1)} {isFrench ? 'ans' : 'years'}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {isFrench ? 'Position Percentile' : 'Percentile Rank'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {dashboardMetrics.percentileRank}th
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    {isFrench ? 'Années Potentielles' : 'Potential Years'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  +{dashboardMetrics.yearsGained.toFixed(1)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    {isFrench ? 'Qualité de Vie' : 'Quality of Life'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-orange-700">
                  {dashboardMetrics.qualityOfLife}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personalized Analysis */}
          <PersonalizedLongevityAnalysis
            userData={userData}
            isFrench={isFrench}
            personNumber={personNumber}
          />
        </div>
      )
    },
    {
      id: 'charts',
      label: isFrench ? 'Graphiques' : 'Charts',
      icon: <BarChart3 className="w-4 h-4" />,
      component: (
        <LongevityImpactCharts
          userData={userData}
          isFrench={isFrench}
          personNumber={personNumber}
        />
      )
    },
    {
      id: 'comparisons',
      label: isFrench ? 'Comparaisons' : 'Comparisons',
      icon: <Users className="w-4 h-4" />,
      component: (
        <LongevityComparisons
          userData={userData}
          userLifeExpectancy={currentLifeExpectancy}
          isFrench={isFrench}
          personNumber={personNumber}
        />
      )
    },
    {
      id: 'couple',
      label: isFrench ? 'Couple' : 'Couple',
      icon: <Heart className="w-4 h-4" />,
      component: (
        <CoupleAnalysis
          userData={userData}
          isFrench={isFrench}
        />
      )
    },
    {
      id: 'simulator',
      label: isFrench ? 'Simulateur' : 'Simulator',
      icon: <Zap className="w-4 h-4" />,
      component: (
        <LongevitySimulator
          userData={userData}
          currentLifeExpectancy={currentLifeExpectancy}
          isFrench={isFrench}
          personNumber={personNumber}
        />
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            {isFrench ? 'Tableau de Bord Longévité' : 'Longevity Dashboard'}
          </h2>
          <p className="text-gray-600 mt-1">
            {isFrench
              ? 'Analysez et optimisez votre espérance de vie avec des outils avancés'
              : 'Analyze and optimize your life expectancy with advanced tools'
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportSummary}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {isFrench ? 'Résumé' : 'Summary'}
          </Button>

          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isExporting
              ? (isFrench ? 'Exportation...' : 'Exporting...')
              : (isFrench ? 'Exporter PDF' : 'Export PDF')
            }
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            {isFrench ? 'Partager' : 'Share'}
          </Button>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Target className="w-3 h-3" />
          {isFrench ? 'Analyse Avancée' : 'Advanced Analysis'}
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Calculator className="w-3 h-3" />
          {isFrench ? 'Données CPM2014' : 'CPM2014 Data'}
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {isFrench ? 'Références Provinciales' : 'Provincial Benchmarks'}
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Heart className="w-3 h-3" />
          {isFrench ? 'Analyse Personnalisée' : 'Personalized Analysis'}
        </Badge>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>

      {/* Footer Information */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-4">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              <strong>{isFrench ? 'Méthodologie:' : 'Methodology:'}</strong>{' '}
              {isFrench
                ? 'Cette analyse utilise les données démographiques canadiennes (CPM2014) et des coefficients scientifiques validés pour estimer l\'espérance de vie.'
                : 'This analysis uses Canadian demographic data (CPM2014) and validated scientific coefficients to estimate life expectancy.'
              }
            </p>
            <p>
              <strong>{isFrench ? 'Important:' : 'Important:'}</strong>{' '}
              {isFrench
                ? 'Ces résultats sont des estimations. Consultez un professionnel de la santé pour des conseils médicaux personnalisés.'
                : 'These results are estimates. Consult a healthcare professional for personalized medical advice.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LongevityDashboard;
