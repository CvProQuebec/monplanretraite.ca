// src/features/retirement/sections/TaxOptimizationSection.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, DollarSign, Target, AlertCircle, CheckCircle, Clock, Rocket, Sparkles } from 'lucide-react';
import { UserData, Calculations } from '../types';
import { TaxOptimizationService, TaxOptimizationResult } from '../services/TaxOptimizationService';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { useTranslation } from '../translations/index';
import { useCurrentLanguage } from '../hooks/useLanguage';

interface TaxOptimizationSectionProps {
  data: UserData;
  calculations: Calculations;
}

export const TaxOptimizationSection: React.FC<TaxOptimizationSectionProps> = ({ data, calculations }) => {
  const language = useCurrentLanguage();
  const t = useTranslation(language);
  
  const optimizationResult: TaxOptimizationResult = useMemo(() => {
    return TaxOptimizationService.analyzeOptimization(data, calculations);
  }, [data, calculations]);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Calculator className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reer': return '🏛️';
      case 'celi': return '💰';
      case 'pension': return '👴';
      case 'income_splitting': return '👫';
      default: return '📊';
    }
  };

  const savingsPercentage = optimizationResult.currentTaxBurden > 0 
    ? (optimizationResult.totalSavings / optimizationResult.currentTaxBurden) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-mpr-navy text-white">
      {/* Particules animées en arrière-plan */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-mpr-interactive rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-60 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-6 relative z-10 p-6">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl mb-4">
            {t.taxOptimization.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t.taxOptimization.subtitle}
          </p>
        </div>

        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calculator className="w-5 h-5 text-mpr-interactive" />
              {t.taxOptimization.title}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {t.taxOptimization.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">{t.taxOptimization.currentTaxBurden}</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(optimizationResult.currentTaxBurden)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">{t.taxOptimization.potentialSavings}</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(optimizationResult.totalSavings)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-mpr-interactive" />
                    <span className="text-sm font-medium">{t.taxOptimization.optimizedBurden}</span>
                  </div>
                  <div className="text-2xl font-bold text-mpr-interactive">
                    {formatCurrency(optimizationResult.optimizedTaxBurden)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">{t.taxOptimization.reduction}</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatPercentage(savingsPercentage)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{t.taxOptimization.progressToOptimization}</span>
                <span className="text-sm text-muted-foreground">
                  {formatPercentage(savingsPercentage)} {t.taxOptimization.possibleSavings}
                </span>
              </div>
              <Progress value={Math.min(savingsPercentage, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="strategies" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="strategies">{t.taxOptimization.strategies}</TabsTrigger>
            <TabsTrigger value="contribution-room">{t.taxOptimization.contributionRights}</TabsTrigger>
            <TabsTrigger value="income-splitting">{t.taxOptimization.incomeSplitting}</TabsTrigger>
            <TabsTrigger value="pension-optimization">{t.taxOptimization.pensionOptimization}</TabsTrigger>
          </TabsList>

          <TabsContent value="strategies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.taxOptimization.recommendedStrategies}</CardTitle>
                <CardDescription>
                  {t.taxOptimization.personalizedStrategies}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizationResult.strategies.map((strategy, index) => (
                    <Card key={strategy.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">{getCategoryIcon(strategy.category)}</span>
                              <h3 className="font-semibold">{strategy.title}</h3>
                              <Badge variant={getPriorityColor(strategy.priority) as any}>
                                {getPriorityIcon(strategy.priority)}
                                <span className="ml-1 capitalize">{strategy.priority}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {strategy.description}
                            </p>
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm font-medium">{t.taxOptimization.howToProceed}</span>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {strategy.implementation}
                                </p>
                              </div>
                              {strategy.requirements && (
                                <div>
                                  <span className="text-sm font-medium">{t.taxOptimization.requiredConditions}</span>
                                  <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
                                    {strategy.requirements.map((req, idx) => (
                                      <li key={idx}>{req}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {formatCurrency(strategy.potentialSavings)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {t.taxOptimization.potentialSavingsLabel}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contribution-room" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🏛️ {t.taxOptimization.contributionRoomContent ? 'RRSP Contribution Room' : 'Droits de cotisation REER'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-mpr-interactive mb-2">
                    {formatCurrency(optimizationResult.reerContributionRoom)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'en' ? 'Available RRSP contribution room' : 'Espace de cotisation REER disponible'}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{language === 'en' ? '2024 Annual Limit' : 'Limite annuelle 2024'}</span>
                      <span className="font-medium">{formatCurrency(31560)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{language === 'en' ? 'Estimated tax deduction' : 'Déduction fiscale estimée'}</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(optimizationResult.reerContributionRoom * 0.35)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    💰 {language === 'en' ? 'TFSA Contribution Room' : 'Droits de cotisation CELI'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(optimizationResult.celiContributionRoom)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'en' ? 'Available TFSA contribution room' : 'Espace de cotisation CELI disponible'}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{language === 'en' ? '2024 Annual Limit' : 'Limite annuelle 2024'}</span>
                      <span className="font-medium">{formatCurrency(7000)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{language === 'en' ? 'Tax-free growth' : 'Croissance libre d\'impôt'}</span>
                      <span className="font-medium text-green-600">✓</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="income-splitting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👫 {language === 'en' ? 'Income splitting opportunities' : 'Opportunités de fractionnement de revenu'}
                </CardTitle>
                <CardDescription>
                  {language === 'en' ? 'Optimize income distribution between spouses' : 'Optimisez la répartition des revenus entre conjoints'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {optimizationResult.incomesSplittingOpportunities > 0 ? (
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {formatCurrency(optimizationResult.incomesSplittingOpportunities)}
                      </div>
                      <p className="text-sm text-green-700">
                        {language === 'en' ? 'Potential annual savings through income splitting' : 'Économies potentielles annuelles par le fractionnement'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">{language === 'en' ? 'Current incomes' : 'Revenus actuels'}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>{language === 'en' ? 'Spouse 1:' : 'Conjoint 1:'}</span>
                            <span>{formatCurrency(data.personal.salaire1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{language === 'en' ? 'Spouse 2:' : 'Conjoint 2:'}</span>
                            <span>{formatCurrency(data.personal.salaire2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">{language === 'en' ? 'Recommended strategies' : 'Stratégies recommandées'}</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>{language === 'en' ? '• Spousal loan' : '• Prêt au conjoint'}</li>
                          <li>{language === 'en' ? '• Spousal RRSP' : '• REER de conjoint'}</li>
                          <li>{language === 'en' ? '• Dividend splitting' : '• Répartition des dividendes'}</li>
                          <li>{language === 'en' ? '• Pension income splitting' : '• Fractionnement des revenus de pension'}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 mb-2">
                      {language === 'en' ? 'No significant income splitting opportunities detected' : 'Aucune opportunité significative de fractionnement détectée'}
                    </div>
                    <p className="text-sm text-gray-400">
                      {language === 'en' ? 'Income is already well distributed between spouses' : 'Les revenus sont déjà bien répartis entre les conjoints'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pension-optimization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👴 {language === 'en' ? 'Pension income optimization' : 'Optimisation du revenu de pension'}
                </CardTitle>
                <CardDescription>
                  {language === 'en' ? 'Maximize pension income tax benefits' : 'Maximisez les avantages fiscaux des revenus de pension'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {optimizationResult.pensionIncomeOptimization > 0 ? (
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-mpr-interactive-lt rounded-lg">
                      <div className="text-3xl font-bold text-mpr-interactive mb-2">
                        {formatCurrency(optimizationResult.pensionIncomeOptimization)}
                      </div>
                      <p className="text-sm text-mpr-navy">
                        {language === 'en' ? 'Annual savings through pension income optimization' : 'Économies annuelles par l\'optimisation des revenus de pension'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">{language === 'en' ? 'Available credits' : 'Crédits disponibles'}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>{language === 'en' ? 'Pension income credit:' : 'Crédit pour revenu de pension:'}</span>
                            <span className="text-green-600">{language === 'en' ? 'Yes' : 'Oui'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{language === 'en' ? 'Splitting possible:' : 'Fractionnement possible:'}</span>
                            <span className="text-green-600">{language === 'en' ? 'Yes' : 'Oui'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">{language === 'en' ? 'Pension incomes' : 'Revenus de pension'}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>{language === 'en' ? 'Private pension 1:' : 'Pension privée 1:'}</span>
                            <span>{formatCurrency(data.retirement.pensionPrivee1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{language === 'en' ? 'Private pension 2:' : 'Pension privée 2:'}</span>
                            <span>{formatCurrency(data.retirement.pensionPrivee2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 mb-2">
                      {language === 'en' ? 'No pension income detected' : 'Aucun revenu de pension détecté'}
                    </div>
                    <p className="text-sm text-gray-400">
                      {language === 'en' ? 'Pension income optimization strategies will be available once you have pension income' : 'Les stratégies d\'optimisation des revenus de pension seront disponibles une fois que vous aurez des revenus de pension'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TaxOptimizationSection;