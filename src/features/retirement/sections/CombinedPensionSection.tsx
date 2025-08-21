import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Target,
  Shield,
  Zap,
  Info,
  ExternalLink,
  Rocket,
  Sparkles
} from 'lucide-react';
import { CombinedPensionPlanner } from '../components/CombinedPensionPlanner';
import { CPPRRQComparison } from '../components/CPPRRQComparison';
import { useLanguage } from '../hooks/useLanguage';
import { PlanRestrictedSection } from '../components/PlanRestrictedSection';

interface CombinedPensionSectionProps {
  className?: string;
}

export const CombinedPensionSection: React.FC<CombinedPensionSectionProps> = ({ className }) => {
  const { language } = useLanguage();
  
  const texts = {
    fr: {
      title: 'Planification Combinée CPP + RRQ',
      subtitle: 'Optimisez votre retraite en combinant les prestations gouvernementales et l\'épargne personnelle',
      features: 'Fonctionnalités',
      overview: 'Vue d\'ensemble',
      planner: 'Planificateur',
      comparison: 'Comparaison CPP vs RRQ',
      description: 'Cette section vous permet de planifier votre retraite en tenant compte de tous vos revenus : la pension du Régime de pensions du Canada (CPP), la rente du Régime des rentes du Québec (RRQ) et votre épargne personnelle.',
      keyFeatures: [
        'Calcul combiné CPP + RRQ + Épargne personnelle',
        'Scénarios de retraite personnalisés',
        'Simulation Monte Carlo pour l\'évaluation des risques',
        'Optimisation fiscale et planification successorale',
        'Recommandations personnalisées basées sur votre situation'
      ],
      benefits: 'Avantages de la planification combinée',
      benefitsList: [
        'Vision complète de vos revenus de retraite',
        'Identification des lacunes dans votre planification',
        'Optimisation de l\'âge de retraite',
        'Réduction des risques financiers',
        'Maximisation des prestations gouvernementales'
      ],
      startPlanning: 'Commencer la planification',
      learnMore: 'En savoir plus sur CPP vs RRQ',
      officialCPP: 'Site officiel du CPP',
      officialRRQ: 'Site officiel du RRQ'
    },
    en: {
      title: 'Combined CPP + RRQ Planning',
      subtitle: 'Optimize your retirement by combining government benefits and personal savings',
      features: 'Features',
      overview: 'Overview',
      planner: 'Planner',
      comparison: 'CPP vs RRQ Comparison',
      description: 'This section allows you to plan your retirement by considering all your income sources: Canada Pension Plan (CPP) benefits, Quebec Pension Plan (RRQ) benefits, and your personal savings.',
      keyFeatures: [
        'Combined CPP + RRQ + Personal savings calculation',
        'Personalized retirement scenarios',
        'Monte Carlo simulation for risk assessment',
        'Tax optimization and estate planning',
        'Personalized recommendations based on your situation'
      ],
      benefits: 'Benefits of combined planning',
      benefitsList: [
        'Complete view of your retirement income',
        'Identify gaps in your planning',
        'Optimize retirement age',
        'Reduce financial risks',
        'Maximize government benefits'
      ],
      startPlanning: 'Start planning',
      learnMore: 'Learn more about CPP vs RRQ',
      officialCPP: 'Official CPP website',
      officialRRQ: 'Official RRQ website'
    }
  };
  
  const t = texts[language];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      {/* Particules de fond visibles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
        <div className="absolute top-96 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute top-72 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="space-y-8">
        {/* En-tête avec nouveau look Phase 2 */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-bold">
            <Rocket className="w-4 h-4" />
            PHASE 2 ACTIVE
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
            {t.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>
        
        {/* Description et fonctionnalités */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                {t.overview}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {t.description}
              </p>
              
              <div>
                <h3 className="font-semibold mb-2">{t.features}:</h3>
                <ul className="space-y-2">
                  {t.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t.benefits}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {t.benefitsList.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Liens officiels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Ressources officielles
            </CardTitle>
            <CardDescription>
              Consultez les sites officiels pour des informations détaillées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.open('https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc.html', '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {t.officialCPP}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open('https://www.rrq.gouv.qc.ca/', '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {t.officialRRQ}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Onglets principaux */}
        <Tabs defaultValue="planner" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              {t.planner}
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t.comparison}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="planner" className="space-y-6">
            <CombinedPensionPlanner />
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-6">
            <CPPRRQComparison />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
};
