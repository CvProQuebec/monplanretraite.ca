// src/features/retirement/sections/SimulatorSection.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Calculator, 
  Dices, 
  TrendingUp, 
  Settings, 
  LineChart,
  Info,
  Lightbulb,
  Target,
  AlertTriangle,
  Zap,
  Shield,
  BarChart3,
  Rocket,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UserData, Calculations } from '../types';
import { MonteCarloSimulator } from '../components/optimization/MonteCarloSimulator';
import { useLanguage } from '../hooks/useLanguage';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface SimulatorSectionProps {
  data: UserData;
  calculations: Calculations;
}

interface ScenarioOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export const SimulatorSection: React.FC<SimulatorSectionProps> = ({ data, calculations }) => {
  const { language } = useLanguage();
  const [activeScenario, setActiveScenario] = useState<string>('monte-carlo');

  // Textes selon la langue
  const texts = {
    fr: {
      title: 'Simulateur de Retraite Avancé',
      subtitle: 'Explorez différents scénarios de retraite avec nos outils de simulation sophistiqués. Testez vos hypothèses, analysez les risques et optimisez votre plan de retraite pour maximiser vos chances de succès financier.',
      overview: 'Vue d\'ensemble de votre retraite',
      overviewSubtitle: 'Résumé de votre situation actuelle et projections',
      simulationTypes: 'Types de simulation disponibles',
      monteCarlo: 'Simulation Monte Carlo',
      monteCarloDesc: 'Analysez des milliers de scénarios possibles pour votre retraite',
      scenarioComparison: 'Comparaison de scénarios',
      scenarioComparisonDesc: 'Analysez l\'impact de différents paramètres',
      sensitivityAnalysis: 'Analyse de sensibilité',
      sensitivityAnalysisDesc: 'Testez l\'impact de changements sur vos paramètres clés',
      monteCarloPillar: 'Simulations Monte Carlo',
      monteCarloPillarDesc: 'Analysez des milliers de scénarios possibles pour évaluer les risques et opportunités',
      riskManagement: 'Gestion des Risques',
      riskManagementDesc: 'Identifiez les vulnérabilités et renforcez votre plan de retraite',
      detailedAnalysis: 'Analyses Détaillées',
      detailedAnalysisDesc: 'Visualisez vos projections et prenez des décisions éclairées',
      capitalProjected: 'Capital projeté',
      sufficiency: 'Suffisance',
      timeRemaining: 'Temps restant',
      importantInfo: 'Information importante',
      disclaimer: 'Les simulations sont basées sur des modèles mathématiques et des hypothèses. Les résultats ne garantissent pas les performances futures et doivent être utilisés comme guide de planification uniquement.',
      usageTips: 'Conseils d\'utilisation',
      tip1: 'Testez différents paramètres pour comprendre leur impact',
      tip2: 'Un taux de succès de 90% ou plus est généralement recommandé',
      tip3: 'Considérez plusieurs scénarios (optimiste, pessimiste, réaliste)',
      tip4: 'Revisitez vos simulations régulièrement',
      tip5: 'Consultez un professionnel pour des conseils personnalisés',
      active: 'Actif',
      developmentFeature: 'Fonctionnalité en développement',
      scenarioComparisonComingSoon: 'Comparaison de scénarios multiples bientôt disponible',
      sensitivityAnalysisComingSoon: 'Analyse de sensibilité bientôt disponible'
    },
    en: {
      title: 'Advanced Retirement Simulator',
      subtitle: 'Explore different retirement scenarios with our sophisticated simulation tools. Test your assumptions, analyze risks and optimize your retirement plan to maximize your chances of financial success.',
      overview: 'Retirement Overview',
      overviewSubtitle: 'Summary of your current situation and projections',
      simulationTypes: 'Available Simulation Types',
      monteCarlo: 'Monte Carlo Simulation',
      monteCarloDesc: 'Analyze thousands of possible scenarios for your retirement',
      scenarioComparison: 'Scenario Comparison',
      scenarioComparisonDesc: 'Analyze the impact of different parameters',
      sensitivityAnalysis: 'Sensitivity Analysis',
      sensitivityAnalysisDesc: 'Test the impact of changes on your key parameters',
      monteCarloPillar: 'Monte Carlo Simulations',
      monteCarloPillarDesc: 'Analyze thousands of possible scenarios to assess risks and opportunities',
      riskManagement: 'Risk Management',
      riskManagementDesc: 'Identify vulnerabilities and strengthen your retirement plan',
      detailedAnalysis: 'Detailed Analysis',
      detailedAnalysisDesc: 'Visualize your projections and make informed decisions',
      capitalProjected: 'Projected Capital',
      sufficiency: 'Sufficiency',
      timeRemaining: 'Time remaining',
      importantInfo: 'Important Information',
      disclaimer: 'Simulations are based on mathematical models and assumptions. Results do not guarantee future performance and should be used as planning guidance only.',
      usageTips: 'Usage Tips',
      tip1: 'Test different parameters to understand their impact',
      tip2: 'A success rate of 90% or higher is generally recommended',
      tip3: 'Consider multiple scenarios (optimistic, pessimistic, realistic)',
      tip4: 'Revisit your simulations regularly',
      tip5: 'Consult a professional for personalized advice',
      active: 'Active',
      developmentFeature: 'Feature in development',
      scenarioComparisonComingSoon: 'Multiple scenario comparison coming soon',
      sensitivityAnalysisComingSoon: 'Sensitivity analysis coming soon'
    }
  };

  const t = texts[language];

  // Scénarios de simulation disponibles
  const scenarios: ScenarioOption[] = [
    {
      id: 'monte-carlo',
      title: t.monteCarlo,
      description: t.monteCarloDesc,
      icon: <Dices className="w-5 h-5" />,
      component: <MonteCarloSimulator userData={data} calculations={calculations} />
    },
    {
      id: 'scenario-comparison',
      title: t.scenarioComparison,
      description: t.scenarioComparisonDesc,
      icon: <LineChart className="w-5 h-5" />,
      component: <ScenarioComparison userData={data} calculations={calculations} />
    },
    {
      id: 'sensitivity-analysis',
      title: t.sensitivityAnalysis,
      description: t.sensitivityAnalysisDesc,
      icon: <Target className="w-5 h-5" />,
      component: <SensitivityAnalysis userData={data} calculations={calculations} />
    }
  ];

  const currentScenario = scenarios.find(s => s.id === activeScenario);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      {/* Particules animées en arrière-plan */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-60 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-6 relative z-10 p-6">
        {/* En-tête principal avec nouveau look Phase 2 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Introduction au simulateur avec nouveau look */}
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-white mb-3">
              {t.title}
            </CardTitle>
            <CardDescription className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {t.subtitle}
            </CardDescription>
          </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Dices className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900 mb-2">{t.monteCarloPillar}</h3>
              <p className="text-sm text-blue-700">
                {t.monteCarloPillarDesc}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900 mb-2">{t.riskManagement}</h3>
              <p className="text-sm text-blue-700">
                {t.riskManagementDesc}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900 mb-2">{t.detailedAnalysis}</h3>
              <p className="text-sm text-blue-700">
                {t.detailedAnalysisDesc}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* En-tête principal avec métriques */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Calculator className="w-7 h-7 text-purple-600" />
            {t.overview}
          </CardTitle>
          <CardDescription className="text-lg">
            {t.overviewSubtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(calculations.retirementCapital)}</div>
              <div className="text-sm text-gray-600">{t.capitalProjected}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{formatPercentage(calculations.sufficiency)}</div>
              <div className="text-sm text-gray-600">{t.sufficiency}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {(data.personal.ageRetraiteSouhaite1 || 65) - Math.floor((new Date().getTime() - new Date(data.personal.naissance1).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} {language === 'fr' ? 'ans' : 'years'}
              </div>
              <div className="text-sm text-gray-600">{t.timeRemaining}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sélecteur de types de simulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t.simulationTypes}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <motion.div
                key={scenario.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={activeScenario === scenario.id ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-start gap-2 w-full ${
                    activeScenario === scenario.id 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'hover:bg-purple-50'
                  }`}
                  onClick={() => setActiveScenario(scenario.id)}
                >
                  <div className="flex items-center gap-2">
                    {scenario.icon}
                    <span className="font-semibold">{scenario.title}</span>
                  </div>
                  <p className="text-sm text-left opacity-80">
                    {scenario.description}
                  </p>
                  {activeScenario === scenario.id && (
                    <Badge variant="secondary" className="mt-2">
                      {t.active}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informations importantes */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>{t.importantInfo}</AlertTitle>
        <AlertDescription>
          {t.disclaimer}
        </AlertDescription>
      </Alert>

      {/* Simulateur actif */}
      <motion.div
        key={activeScenario}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentScenario?.component}
      </motion.div>

      {/* Conseils et recommandations */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Lightbulb className="w-5 h-5" />
            {t.usageTips}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-700">
          <ul className="space-y-2 text-sm">
            <li>• {t.tip1}</li>
            <li>• {t.tip2}</li>
            <li>• {t.tip3}</li>
            <li>• {t.tip4}</li>
            <li>• {t.tip5}</li>
          </ul>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default SimulatorSection;
