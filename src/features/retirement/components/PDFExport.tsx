// src/features/retirement/components/PDFExport.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  FileDown,
  Loader2,
  CheckCircle,
  Info,
  Settings,
  Palette,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserData, Calculations } from '../types';
import { PDFReportService, ReportData } from '../services/PDFReportService';
import { MonteCarloResult } from '../services/MonteCarloService';
import { Recommendation } from '../services/RecommendationEngine';
import { useLanguage } from '../hooks/useLanguage';

interface PDFExportProps {
  userData: UserData;
  calculations: Calculations;
  monteCarloResults?: MonteCarloResult;
  recommendations?: Recommendation[];
}

export const PDFExport: React.FC<PDFExportProps> = ({
  userData,
  calculations,
  monteCarloResults,
  recommendations
}) => {
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedPDF, setGeneratedPDF] = useState<Blob | null>(null);

  const generatePDF = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      // Simuler la progression
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const reportData: ReportData = {
        userData,
        calculations,
        monteCarloResults,
        recommendations,
        generatedAt: new Date()
      };

      const pdfService = new PDFReportService();
      const pdfBlob = await pdfService.generateReport(reportData);
      
      clearInterval(progressInterval);
      setProgress(100);
      setGeneratedPDF(pdfBlob);

      // Télécharger automatiquement
      downloadPDF(pdfBlob);

      // Reset après un délai
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const downloadPDF = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Plan-Retraite-${userData.personal.nom1}-${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-mpr-interactive" />
            {t('reports.professionalExport')}
          </CardTitle>
          <CardDescription>
            {t('reports.reportDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Aperçu des sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              icon={<FileText className="w-4 h-4" />}
              title={t('reports.reportContent')}
              items={[
                t('reports.coverPage'),
                t('reports.executiveSummary'),
                t('reports.detailedAnalysis'),
                t('reports.retirementProjections'),
                monteCarloResults ? t('reports.monteCarloAnalysis') : null,
                t('reports.priorityRecommendations'),
                t('reports.structuredActionPlan')
              ].filter(Boolean) as string[]}
            />
            
            <InfoCard
              icon={<Palette className="w-4 h-4" />}
              title={t('reports.reportFeatures')}
              items={[
                t('reports.modernDesign'),
                t('reports.chartsAndVisualizations'),
                t('reports.colorCodedPriorities'),
                t('reports.a4Optimized'),
                t('reports.customFooter')
              ]}
            />
          </div>

          {/* Bouton de génération */}
          <div className="flex flex-col items-center space-y-4">
            <AnimatePresence mode="wait">
              {!isGenerating ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Button
                    size="lg"
                    onClick={generatePDF}
                    className="bg-mpr-interactive hover:bg-mpr-interactive-dk"
                  >
                    <FileDown className="w-5 h-5 mr-2" />
                    {t('reports.generateReport')}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-md space-y-4"
                >
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-mpr-interactive" />
                    <p className="text-sm font-medium">{t('reports.generatingReport')}</p>
                  </div>
                  
                  <Progress value={progress} className="h-2" />
                  
                  <div className="text-center text-xs text-gray-600">
                    {progress < 20 && t('reports.generatingReport')}
                    {progress >= 20 && progress < 40 && t('reports.generatingReport')}
                    {progress >= 40 && progress < 60 && t('reports.generatingReport')}
                    {progress >= 60 && progress < 80 && t('reports.generatingReport')}
                    {progress >= 80 && progress < 100 && t('reports.generatingReport')}
                    {progress === 100 && t('reports.reportGenerated')}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {progress === 100 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-green-600"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{t('reports.downloadSuccess')}</span>
              </motion.div>
            )}
          </div>

          {/* Information supplémentaire */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {t('reports.reportIncludes')} {t('reports.reviewRegularly')} {t('reports.keepSafe')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant pour les cartes d'information
const InfoCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  items: string[];
}> = ({ icon, title, items }) => {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-mpr-interactive-lt rounded-lg text-mpr-interactive">
            {icon}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-2">{title}</h4>
            <ul className="space-y-1">
              {items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-xs text-gray-600 flex items-start gap-2"
                >
                  <span className="text-mpr-interactive mt-0.5">•</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};