// src/features/retirement/sections/ReportsSection.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Info, CheckCircle } from 'lucide-react';
import { UserData, Calculations } from '../types';
import { PDFExport } from '../components/PDFExport';
import { useLanguage } from '../hooks/useLanguage';

interface ReportsSectionProps {
  data: UserData;
  calculations: Calculations;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({ data, calculations }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* En-tête de la section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sapphire-500" />
            {t('reports.title')}
          </CardTitle>
          <CardDescription>
            {t('reports.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">{t('reports.reportContent')}</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {t('reports.coverPage')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {t('reports.executiveSummary')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {t('reports.detailedAnalysis')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {t('reports.retirementProjections')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {t('reports.priorityRecommendations')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {t('reports.structuredActionPlan')}
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">{t('reports.reportFeatures')}</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  {t('reports.modernDesign')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  {t('reports.chartsAndVisualizations')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  {t('reports.colorCodedPriorities')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  {t('reports.a4Optimized')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  {t('reports.customFooter')}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Composant d'export PDF */}
      <PDFExport 
        userData={data} 
        calculations={calculations}
      />

      {/* Informations supplémentaires */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="w-5 h-5" />
            {t('reports.reportIncludes')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-2">
                {t('reports.reportDescription')}
              </p>
              <p>
                {t('reports.reviewRegularly')}
              </p>
            </div>
            <div>
              <p>
                {t('reports.keepSafe')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};