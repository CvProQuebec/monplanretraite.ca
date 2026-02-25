// src/features/retirement/sections/RetirementSection.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Target, 
  Zap, 
  Star, 
  Crown,
  Info,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Rocket,
  Brain,
  Shield
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export const RetirementSection: React.FC = () => {
  const { language } = useLanguage();
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentAge, setCurrentAge] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [inflationRate, setExpectedInflation] = useState(3);

  const isFrench = language === 'fr';

  const translations = {
    fr: {
      title: "🚀 Planification de retraite avancée",
      subtitle: "Transformez vos rêves de retraite en réalité avec notre calculateur intelligent",
      currentAge: "Âge actuel",
      retirementAge: "Âge de retraite souhaité",
      currentSavings: "Épargne actuelle",
      monthlyContribution: "Contribution mensuelle",
      expectedReturn: "Rendement annuel attendu (%)",
      inflationRate: "Taux d'inflation annuel (%)",
      calculate: "🚀 Calculer ma retraite",
      results: "Résultats de votre planification",
      projectedSavings: "Épargne projetée à la retraite",
      monthlyIncome: "Revenu mensuel en retraite",
      yearsToRetirement: "Années jusqu'à la retraite",
      totalContributions: "Total des contributions",
      investmentGrowth: "Croissance des investissements",
      inflationAdjusted: "Ajusté pour l'inflation",
      riskLevel: "Niveau de risque",
      conservative: "Conservateur",
      moderate: "Modéré",
      aggressive: "Agressif",
      tips: "💡 Conseils d'optimisation",
      tip1: "Commencez tôt - le temps est votre meilleur allié",
      tip2: "Augmentez progressivement vos contributions",
      tip3: "Diversifiez vos investissements",
      tip4: "Réévaluez votre plan annuellement"
    },
    en: {
      title: "🚀 Advanced Retirement Planning",
      subtitle: "Transform your retirement dreams into reality with our intelligent calculator",
      currentAge: "Current age",
      retirementAge: "Desired retirement age",
      currentSavings: "Current savings",
      monthlyContribution: "Monthly contribution",
      expectedReturn: "Expected annual return (%)",
      inflationRate: "Annual inflation rate (%)",
      calculate: "🚀 Calculate my retirement",
      results: "Your planning results",
      projectedSavings: "Projected savings at retirement",
      monthlyIncome: "Monthly income in retirement",
      yearsToRetirement: "Years until retirement",
      totalContributions: "Total contributions",
      investmentGrowth: "Investment growth",
      inflationAdjusted: "Inflation adjusted",
      riskLevel: "Risk level",
      conservative: "Conservative",
      moderate: "Moderate",
      aggressive: "Aggressive",
      tips: "💡 Optimization tips",
      tip1: "Start early - time is your best ally",
      tip2: "Gradually increase your contributions",
      tip3: "Diversify your investments",
      tip4: "Reassess your plan annually"
    }
  };

  const t = translations[isFrench ? 'fr' : 'en'];

  // Calculs de base
  const yearsToRetirement = retirementAge - currentAge;
  const totalContributions = yearsToRetirement * 12 * monthlyContribution;
  const projectedSavings = currentSavings * Math.pow(1 + expectedReturn/100, yearsToRetirement) + 
                          monthlyContribution * ((Math.pow(1 + expectedReturn/100, yearsToRetirement) - 1) / (expectedReturn/100));
  const inflationAdjustedSavings = projectedSavings / Math.pow(1 + inflationRate/100, yearsToRetirement);
  const monthlyIncome = (inflationAdjustedSavings * (expectedReturn/100)) / 12;

  const getRiskLevel = () => {
    if (expectedReturn <= 5) return 'conservative';
    if (expectedReturn <= 8) return 'moderate';
    return 'aggressive';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'conservative': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'aggressive': return 'bg-red-500';
      default: return 'bg-mpr-interactive';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-mpr-navy text-white">
      {/* Particules de fond visibles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-mpr-interactive rounded-full animate-bounce"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
        <div className="absolute top-96 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* En-tête spectaculaire */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
            {t.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Formulaire de saisie - Design moderne */}
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl backdrop-blur-sm">
            <CardHeader className="border-b border-slate-600">
              <CardTitle className="flex items-center gap-3 text-2xl text-yellow-400">
                <Calculator className="w-8 h-8" />
                Paramètres de planification
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">{t.currentAge}</Label>
                  <Input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                    min="18"
                    max="100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">{t.retirementAge}</Label>
                  <Input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                    min="50"
                    max="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200 font-semibold">{t.currentSavings}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 pl-8 focus:border-yellow-400 focus:ring-yellow-400"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200 font-semibold">{t.monthlyContribution}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 pl-8 focus:border-yellow-400 focus:ring-yellow-400"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">{t.expectedReturn}</Label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                    min="1"
                    max="20"
                    step="0.1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-200 font-semibold">{t.inflationRate}</Label>
                  <Input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setExpectedInflation(Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-slate-900 font-bold text-lg py-4 shadow-2xl transform hover:scale-105 transition-all duration-300"
                size="lg"
              >
                <Calculator className="w-6 h-6 mr-3" />
                {t.calculate}
              </Button>
            </CardContent>
          </Card>

          {/* Résultats - Design spectaculaire */}
          <Card className="bg-gradient-to-br from-mpr-navy/90 to-purple-800/90 border-0 shadow-2xl backdrop-blur-sm">
            <CardHeader className="border-b border-mpr-interactive">
              <CardTitle className="flex items-center gap-3 text-2xl text-mpr-interactive">
                <TrendingUp className="w-8 h-8" />
                {t.results}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Indicateur de risque */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg">
                <span className="text-gray-200 font-semibold">{t.riskLevel}:</span>
                <Badge className={`${getRiskColor(getRiskLevel())} text-white px-3 py-1`}>
                  {t[getRiskLevel() as keyof typeof t]}
                </Badge>
              </div>

              {/* Métriques principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-600/20 to-green-500/20 p-4 rounded-lg border border-green-500/30">
                  <div className="text-2xl font-bold text-green-400">
                    ${Math.round(projectedSavings).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-300">{t.projectedSavings}</div>
                </div>
                
                <div className="bg-gradient-to-br from-mpr-interactive/20 to-mpr-interactive/20 p-4 rounded-lg border border-mpr-interactive/30">
                  <div className="text-2xl font-bold text-mpr-interactive">
                    ${Math.round(monthlyIncome).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-300">{t.monthlyIncome}</div>
                </div>
              </div>

              {/* Détails */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">{t.yearsToRetirement}</span>
                  <span className="text-yellow-400 font-bold">{yearsToRetirement} ans</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">{t.totalContributions}</span>
                  <span className="text-green-400 font-bold">${totalContributions.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">{t.investmentGrowth}</span>
                  <span className="text-mpr-interactive font-bold">${Math.round(projectedSavings - currentSavings - totalContributions).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conseils d'optimisation - Design moderne */}
        <Card className="bg-gradient-to-br from-yellow-800/90 to-orange-800/90 border-0 shadow-2xl backdrop-blur-sm">
          <CardHeader className="border-b border-yellow-600">
            <CardTitle className="flex items-center gap-3 text-2xl text-yellow-300">
              <Brain className="w-8 h-8" />
              {t.tips}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-300 mb-1">{t.tip1}</h4>
                  <p className="text-gray-300 text-sm">Commencez dès aujourd'hui pour maximiser l'effet des intérêts composés.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-mpr-interactive rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-mpr-interactive mb-1">{t.tip2}</h4>
                  <p className="text-gray-300 text-sm">Augmentez vos contributions de 1% chaque année ou lors des augmentations.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-300 mb-1">{t.tip3}</h4>
                  <p className="text-gray-300 text-sm">Répartissez vos investissements entre actions, obligations et autres actifs.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-orange-300 mb-1">{t.tip4}</h4>
                  <p className="text-gray-300 text-sm">Adaptez votre stratégie selon les changements de vie et de marché.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};