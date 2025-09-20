/* Section wrapper pour les fonctionnalités premium du module CPP
   Phase 3: Modélisation Monte Carlo, Optimisation fiscale, Planification successorale
   Note: Aucune intégration externe ni lien sortant — 100 % local */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Crown, BarChart3, Calculator, Shield,
  TrendingUp, Target, Award
} from 'lucide-react';

import { PremiumFeatures } from '../components/PremiumFeatures';
import { useLanguage } from '../hooks/useLanguage';
import { PlanRestrictedSection } from '../components/PlanRestrictedSection';
import { CPPData } from '../types/cpp';

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
      subtitle: 'Advanced tools exclusive to Expert plan',
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
      },
      upgradeCTA: {
        title: 'Unlock all premium features',
        description: 'Upgrade to Expert plan to access these advanced tools',
        button: 'Upgrade to Expert',
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

  // Données CPP minimales factices (100% local, sans intégrations externes)
  const demoCppData: CPPData = {
    personal: {
      dateNaissance: new Date(1960, 0, 1),
      dateRetraite: new Date(new Date().getFullYear(), 0, 1),
      gainsAnnuels: [],
      anneesCotisation: 0,
      paysResidence: 'QC',
      statutConjugal: 'single'
    },
    parameters: {
      ageRetraiteStandard: 65,
      ageRetraiteMin: 60,
      ageRetraiteMax: 70,
      facteurReduction: 0.006,   // -0.6 %/mois avant 65
      facteurAugmentation: 0.007, // +0.7 %/mois après 65
      montantMaximum2025: 1433.00,
      montantMoyen2024: 899.67
    },
    calculations: {
      pensionBase: 0,
      pensionAjustee: 0,
      montantMensuel: 0,
      montantAnnuel: 0,
      reductionRetraiteAnticipee: 0,
      augmentationRetraiteReportee: 0
    },
    contributions: {
      annees: [],
      montants: [],
      gains: [],
      totalCotisations: 0
    },
    metadata: {
      dateCalcul: new Date(),
      version: 'demo',
      source: 'USER_INPUT'
    }
  };

  return (
    <PlanRestrictedSection sectionId="premium-features" requiredPlan="expert">
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


        {/* Composant principal des fonctionnalités premium */}
        <div className="mt-12">
          <PremiumFeatures cppData={demoCppData} />
        </div>
      </div>
    </PlanRestrictedSection>
  );
};
