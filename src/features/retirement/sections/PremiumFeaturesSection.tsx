// Section wrapper pour les fonctionnalités premium du module CPP
// Phase 3: Modélisation Monte Carlo, Optimisation fiscale, Planification successorale, API

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Crown, Zap, BarChart3, Calculator, Shield, Activity,
  TrendingUp, Target, Award, ExternalLink, Info
} from 'lucide-react';

import { PremiumFeatures } from '../components/PremiumFeatures';
import { useLanguage } from '../hooks/useLanguage';
import { PlanRestrictedSection } from '../components/PlanRestrictedSection';

interface PremiumFeaturesSectionProps {
  className?: string;
}

export const PremiumFeaturesSection: React.FC<PremiumFeaturesSectionProps> = ({ className }) => {
  const { language } = useLanguage();
  
  const texts = {
    fr: {
      title: 'Fonctionnalités Premium CPP',
      subtitle: 'Outils avancés exclusifs au plan Ultimate',
      description: 'Accédez aux fonctionnalités les plus avancées pour une planification de retraite de niveau professionnel',
      features: {
        monteCarlo: {
          title: 'Modélisation Monte Carlo Avancée',
          description: 'Simulations de marché avec paramètres économiques réalistes et métriques de risque sophistiquées',
          benefits: [
            '1000+ itérations de simulation',
            'Paramètres de marché configurables',
            'Métriques de risque avancées (VaR, Sharpe Ratio, Drawdown)',
            'Recommandations personnalisées'
          ]
        },
        taxOptimization: {
          title: 'Optimisation Fiscale CPP + RRQ',
          description: 'Stratégies avancées pour minimiser l\'impôt sur les prestations de retraite',
          benefits: [
            'Calcul des taxes actuelles vs optimisées',
            'Stratégies de fractionnement du revenu',
            'Optimisation des déductions',
            'Recommandations d\'action prioritaires'
          ]
        },
        survivorBenefits: {
          title: 'Planification Successorale Complète',
          description: 'Calcul détaillé des prestations de survivant et planification successorale',
          benefits: [
            'Prestations CPP et RRQ combinées',
            'Calcul des prestations enfants',
            'Planification documentaire',
            'Timeline d\'implémentation'
          ]
        },
        apiIntegration: {
          title: 'Intégration API Gouvernementale',
          description: 'Données en temps réel des services gouvernementaux canadiens',
          benefits: [
            'Statut en temps réel des APIs',
            'Données CPP, RRQ et CRA',
            'Mise à jour automatique des paramètres',
            'Surveillance de la santé des services'
          ]
        }
      },
      upgradeCTA: {
        title: 'Débloquez toutes les fonctionnalités premium',
        description: 'Passez au plan Ultimate pour accéder à ces outils avancés',
        button: 'Mettre à niveau vers Ultimate',
        currentPlan: 'Plan actuel:'
      },
      officialLinks: {
        title: 'Liens officiels',
        cpp: 'Canada Pension Plan',
        rrq: 'Régime des rentes du Québec',
        cra: 'Agence du revenu du Canada'
      }
    },
    en: {
      title: 'CPP Premium Features',
      subtitle: 'Advanced tools exclusive to Ultimate plan',
      description: 'Access the most advanced features for professional-level retirement planning',
      features: {
        monteCarlo: {
          title: 'Advanced Monte Carlo Modeling',
          description: 'Market simulations with realistic economic parameters and sophisticated risk metrics',
          benefits: [
            '1000+ simulation iterations',
            'Configurable market parameters',
            'Advanced risk metrics (VaR, Sharpe Ratio, Drawdown)',
            'Personalized recommendations'
          ]
        },
        taxOptimization: {
          title: 'CPP + RRQ Tax Optimization',
          description: 'Advanced strategies to minimize tax on retirement benefits',
          benefits: [
            'Current vs optimized tax calculation',
            'Income splitting strategies',
            'Deduction optimization',
            'Priority action recommendations'
          ]
        },
        survivorBenefits: {
          title: 'Complete Survivor Planning',
          description: 'Detailed calculation of survivor benefits and estate planning',
          benefits: [
            'Combined CPP and RRQ benefits',
            'Children benefit calculation',
            'Documentary planning',
            'Implementation timeline'
          ]
        },
        apiIntegration: {
          title: 'Government API Integration',
          description: 'Real-time data from Canadian government services',
          benefits: [
            'Real-time API status',
            'CPP, RRQ and CRA data',
            'Automatic parameter updates',
            'Service health monitoring'
          ]
        }
      },
      upgradeCTA: {
        title: 'Unlock all premium features',
        description: 'Upgrade to Ultimate plan to access these advanced tools',
        button: 'Upgrade to Ultimate',
        currentPlan: 'Current plan:'
      },
      officialLinks: {
        title: 'Official links',
        cpp: 'Canada Pension Plan',
        rrq: 'Quebec Pension Plan',
        cra: 'Canada Revenue Agency'
      }
    }
  };

  const t = texts[language];

  return (
    <PlanRestrictedSection sectionId="premium-features" requiredPlan="ultimate" className={className}>
      <div className="space-y-8">
        {/* En-tête */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Crown className="w-8 h-8 text-yellow-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {t.title}
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t.subtitle}
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500 max-w-3xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Aperçu des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <BarChart3 className="w-5 h-5" />
                {t.features.monteCarlo.title}
              </CardTitle>
              <CardDescription>
                {t.features.monteCarlo.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {t.features.monteCarlo.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Calculator className="w-5 h-5" />
                {t.features.taxOptimization.title}
              </CardTitle>
              <CardDescription>
                {t.features.taxOptimization.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {t.features.taxOptimization.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Shield className="w-5 h-5" />
                {t.features.survivorBenefits.title}
              </CardTitle>
              <CardDescription>
                {t.features.survivorBenefits.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {t.features.survivorBenefits.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 hover:border-orange-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Activity className="w-5 h-5" />
                {t.features.apiIntegration.title}
              </CardTitle>
              <CardDescription>
                {t.features.apiIntegration.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {t.features.apiIntegration.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Appel à l'action de mise à niveau */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-yellow-800">
              <Crown className="w-6 h-6" />
              {t.upgradeCTA.title}
            </CardTitle>
            <CardDescription className="text-yellow-700">
              {t.upgradeCTA.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white">
              <Crown className="w-4 h-4 mr-2" />
              {t.upgradeCTA.button}
            </Button>
          </CardContent>
        </Card>

        {/* Liens officiels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              {t.officialLinks.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span>{t.officialLinks.cpp}</span>
              </a>
              
              <a
                href="https://www.rrq.gouv.qc.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-green-600" />
                <span>{t.officialLinks.rrq}</span>
              </a>
              
              <a
                href="https://www.canada.ca/fr/agence-revenu.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-red-600" />
                <span>{t.officialLinks.cra}</span>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Composant principal des fonctionnalités premium */}
        <div className="mt-12">
          <PremiumFeatures cppData={{}} />
        </div>
      </div>
    </PlanRestrictedSection>
  );
};
