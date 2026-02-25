// src/features/retirement/sections/ReportsSection.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, Download, Info, CheckCircle, Star, Sparkles, 
  BarChart3, PieChart, TrendingUp, Calendar, Clock, Shield,
  Eye, Printer, Share, Settings, Zap, Crown, Target, Award
} from 'lucide-react';
import { UserData, Calculations } from '../types';
import { PDFExport } from '../components/PDFExport';
import { useLanguage } from '../hooks/useLanguage';

interface ReportsSectionProps {
  data: UserData;
  calculations: Calculations;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({ data, calculations }) => {
  const { language } = useLanguage();
  const isFrench = language === 'fr';
  const [selectedReportType, setSelectedReportType] = useState('comprehensive');

  const reportTypes = [
    {
      id: 'comprehensive',
      title: isFrench ? 'Rapport complet' : 'Comprehensive Report',
      description: isFrench ? 'Analyse détaillée de votre plan de retraite' : 'Detailed analysis of your retirement plan',
      icon: FileText,
      color: 'from-mpr-interactive to-mpr-interactive',
      features: [
        isFrench ? 'Page de couverture personnalisée' : 'Custom cover page',
        isFrench ? 'Résumé exécutif' : 'Executive summary',
        isFrench ? 'Analyse détaillée' : 'Detailed analysis',
        isFrench ? 'Projections de retraite' : 'Retirement projections',
        isFrench ? 'Recommandations prioritaires' : 'Priority recommendations',
        isFrench ? 'Plan d\'action structuré' : 'Structured action plan'
      ]
    },
    {
      id: 'summary',
      title: isFrench ? 'Résumé exécutif' : 'Executive Summary',
      description: isFrench ? 'Vue d\'ensemble concise de votre situation' : 'Concise overview of your situation',
      icon: BarChart3,
      color: 'from-green-600 to-emerald-600',
      features: [
        isFrench ? 'Métriques clés' : 'Key metrics',
        isFrench ? 'Graphiques visuels' : 'Visual charts',
        isFrench ? 'Recommandations principales' : 'Main recommendations',
        isFrench ? 'Prochaines étapes' : 'Next steps'
      ]
    },
    {
      id: 'projections',
      title: isFrench ? 'Projections financières' : 'Financial Projections',
      description: isFrench ? 'Scénarios détaillés et projections' : 'Detailed scenarios and projections',
      icon: TrendingUp,
      color: 'from-purple-600 to-pink-600',
      features: [
        isFrench ? 'Projections de revenus' : 'Income projections',
        isFrench ? 'Analyse de flux de trésorerie' : 'Cashflow analysis',
        isFrench ? 'Scénarios optimistes/pessimistes' : 'Optimistic/pessimistic scenarios',
        isFrench ? 'Analyse de sensibilité' : 'Sensitivity analysis'
      ]
    }
  ];

  const reportFeatures = [
    {
      icon: Star,
      title: isFrench ? 'Design moderne' : 'Modern Design',
      description: isFrench ? 'Interface professionnelle et élégante' : 'Professional and elegant interface'
    },
    {
      icon: BarChart3,
      title: isFrench ? 'Graphiques et visualisations' : 'Charts & Visualizations',
      description: isFrench ? 'Données présentées visuellement' : 'Data presented visually'
    },
    {
      icon: Target,
      title: isFrench ? 'Priorités codées par couleur' : 'Color-coded Priorities',
      description: isFrench ? 'Identification rapide des actions importantes' : 'Quick identification of important actions'
    },
    {
      icon: Printer,
      title: isFrench ? 'Optimisé pour l\'impression' : 'Print Optimized',
      description: isFrench ? 'Format Lettre parfaitement adapté' : 'Perfectly adapted Letter format'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-mpr-navy to-mpr-navy text-white">
      {/* Arrière-plan animé */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-mpr-interactive rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* En-tête spectaculaire */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-mpr-interactive to-purple-600 text-white rounded-full text-sm font-bold shadow-2xl">
            <FileText className="w-5 h-5" />
            {isFrench ? 'RAPPORTS PROFESSIONNELS' : 'PROFESSIONAL REPORTS'}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-mpr-interactive via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
            {isFrench ? '📊 Rapports de retraite' : '📊 Retirement Reports'}
          </h1>
          <p className="text-xl text-mpr-interactive-lt max-w-4xl mx-auto leading-relaxed">
            {isFrench 
              ? 'Transformez vos données financières en rapports professionnels et insights stratégiques'
              : 'Transform your financial data into professional reports and strategic insights'
            }
          </p>
        </div>

        {/* Types de rapports */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-mpr-interactive-lt">
            {isFrench ? 'Choisissez votre type de rapport' : 'Choose Your Report Type'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportTypes.map((report) => (
              <Card 
                key={report.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  selectedReportType === report.id 
                    ? 'ring-4 ring-mpr-interactive bg-gradient-to-br from-white/20 to-white/10' 
                    : 'bg-white/10'
                } backdrop-blur-sm border-white/20`}
                onClick={() => setSelectedReportType(report.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${report.color} flex items-center justify-center shadow-xl`}>
                    <report.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{report.title}</CardTitle>
                  <CardDescription className="text-mpr-interactive-lt">{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-mpr-interactive-lt">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {selectedReportType === report.id && (
                    <Badge className="mt-4 bg-mpr-interactive text-white">
                      {isFrench ? 'Sélectionné' : 'Selected'}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fonctionnalités des rapports */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-3">
              <Sparkles className="w-7 h-7 text-yellow-400" />
              {isFrench ? 'Fonctionnalités avancées' : 'Advanced Features'}
            </CardTitle>
            <CardDescription className="text-mpr-interactive-lt">
              {isFrench 
                ? 'Tous nos rapports incluent ces fonctionnalités professionnelles'
                : 'All our reports include these professional features'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reportFeatures.map((feature, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-mpr-interactive to-purple-500 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-mpr-interactive-lt">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Générateur de rapport */}
        <Card className="bg-gradient-to-br from-mpr-navy/50 to-purple-800/50 backdrop-blur-sm border-purple-300/30 mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-purple-200 flex items-center justify-center gap-3">
              <Zap className="w-7 h-7 text-yellow-400" />
              {isFrench ? 'Générateur de rapport' : 'Report Generator'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Statut de préparation */}
            <div className="text-center p-6 bg-white/10 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">
                {isFrench ? 'État de préparation du rapport' : 'Report Preparation Status'}
              </h3>
              <Progress value={85} className="h-3 mb-4" />
              <p className="text-mpr-interactive-lt">
                {isFrench ? '85% des données collectées' : '85% of data collected'}
              </p>
            </div>

            {/* Composant d'export PDF intégré */}
            <div className="bg-white/5 rounded-lg p-6">
              <PDFExport 
                userData={data} 
                calculations={calculations}
              />
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="bg-gradient-to-r from-mpr-interactive to-mpr-interactive-dk hover:from-mpr-navy-mid hover:to-mpr-navy-mid text-white">
                <Eye className="w-4 h-4 mr-2" />
                {isFrench ? 'Aperçu' : 'Preview'}
              </Button>
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
                <Download className="w-4 h-4 mr-2" />
                {isFrench ? 'Télécharger PDF' : 'Download PDF'}
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                <Share className="w-4 h-4 mr-2" />
                {isFrench ? 'Partager' : 'Share'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informations importantes */}
        <Card className="bg-gradient-to-br from-amber-800/30 to-orange-800/30 backdrop-blur-sm border-amber-300/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-amber-200">
              <Info className="w-6 h-6" />
              {isFrench ? 'Informations importantes' : 'Important Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  {isFrench ? 'Confidentialité' : 'Privacy'}
                </h4>
                <p className="text-sm">
                  {isFrench 
                    ? 'Vos rapports sont générés localement et ne sont jamais transmis à nos serveurs.'
                    : 'Your reports are generated locally and never transmitted to our servers.'
                  }
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-mpr-interactive" />
                  {isFrench ? 'Mise à jour' : 'Updates'}
                </h4>
                <p className="text-sm">
                  {isFrench 
                    ? 'Régénérez vos rapports après chaque mise à jour de vos données pour des analyses actualisées.'
                    : 'Regenerate your reports after each data update for current analyses.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
