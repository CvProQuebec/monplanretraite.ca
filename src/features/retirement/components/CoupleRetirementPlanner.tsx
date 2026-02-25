// src/features/retirement/components/CoupleRetirementPlanner.tsx
// Composant principal pour la planification de retraite de couple (CPP + RRQ)

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Users, 
  Calculator, 
  TrendingUp, 
  Shield, 
  Target, 
  Heart,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  ArrowRight,
  PieChart,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { CoupleCalculationService } from '../services/CoupleCalculationService';
import { CoupleData, CoupleCalculationResult } from '../types/couple';
import { useLanguage } from '../hooks/useLanguage';
import { useRetirementData } from '../hooks/useRetirementData';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface CoupleRetirementPlannerProps {
  className?: string;
}

export const CoupleRetirementPlanner: React.FC<CoupleRetirementPlannerProps> = ({ className }) => {
  const { language } = useLanguage();
  const { userData } = useRetirementData();
  const [coupleData, setCoupleData] = useState<CoupleData | null>(null);
  const [results, setResults] = useState<CoupleCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Textes selon la langue
  const texts = {
    fr: {
      title: 'Planificateur de Retraite pour Couple',
      subtitle: 'Optimisez vos pensions CPP et RRQ ensemble',
      calculate: 'Calculer pour le couple',
      calculating: 'Calcul en cours...',
      overview: 'Vue d\'ensemble',
      individual: 'Détails individuels',
      optimizations: 'Optimisations',
      scenarios: 'Scénarios survivant',
      recommendations: 'Recommandations',
      person1: 'Personne 1',
      person2: 'Personne 2',
      couple: 'Couple',
      totalMonthly: 'Total mensuel',
      totalAnnual: 'Total annuel',
      cppPortion: 'Portion CPP',
      rrqPortion: 'Portion RRQ',
      monthlyPension: 'Pension mensuelle',
      annualPension: 'Pension annuelle',
      optimizationTitle: 'Stratégies d\'optimisation',
      potentialSavings: 'Économies potentielles',
      complexity: 'Complexité',
      applicability: 'Applicabilité',
      easy: 'Facile',
      medium: 'Moyenne',
      complex: 'Complexe',
      steps: 'Étapes',
      survivorScenarios: 'Scénarios de survivant',
      survives: 'survit',
      survivorPension: 'Pension de survivant',
      totalAfterDeath: 'Total après décès',
      recommendationsTitle: 'Recommandations personnalisées',
      priority: 'Priorité',
      category: 'Catégorie',
      financialImpact: 'Impact financier',
      implementation: 'Délai d\'implémentation',
      difficulty: 'Difficulté',
      actions: 'Actions concrètes',
      high: 'Haute',
      low: 'Faible',
      timing: 'Timing',
      optimization: 'Optimisation',
      protection: 'Protection',
      taxation: 'Fiscalité',
      noSecondPerson: 'Aucune deuxième personne configurée',
      configureCouple: 'Configurez les informations de la deuxième personne dans votre profil pour utiliser cette fonctionnalité.',
      goToProfile: 'Aller au profil'
    },
    en: {
      title: 'Couple Retirement Planner',
      subtitle: 'Optimize your CPP and RRQ pensions together',
      calculate: 'Calculate for couple',
      calculating: 'Calculating...',
      overview: 'Overview',
      individual: 'Individual Details',
      optimizations: 'Optimizations',
      scenarios: 'Survivor Scenarios',
      recommendations: 'Recommendations',
      person1: 'Person 1',
      person2: 'Person 2',
      couple: 'Couple',
      totalMonthly: 'Total monthly',
      totalAnnual: 'Total annual',
      cppPortion: 'CPP portion',
      rrqPortion: 'RRQ portion',
      monthlyPension: 'Monthly pension',
      annualPension: 'Annual pension',
      optimizationTitle: 'Optimization strategies',
      potentialSavings: 'Potential savings',
      complexity: 'Complexity',
      applicability: 'Applicability',
      easy: 'Easy',
      medium: 'Medium',
      complex: 'Complex',
      steps: 'Steps',
      survivorScenarios: 'Survivor scenarios',
      survives: 'survives',
      survivorPension: 'Survivor pension',
      totalAfterDeath: 'Total after death',
      recommendationsTitle: 'Personalized recommendations',
      priority: 'Priority',
      category: 'Category',
      financialImpact: 'Financial impact',
      implementation: 'Implementation timeline',
      difficulty: 'Difficulty',
      actions: 'Concrete actions',
      high: 'High',
      low: 'Low',
      timing: 'Timing',
      optimization: 'Optimization',
      protection: 'Protection',
      taxation: 'Taxation',
      noSecondPerson: 'No second person configured',
      configureCouple: 'Configure the second person\'s information in your profile to use this feature.',
      goToProfile: 'Go to profile'
    }
  };

  const t = texts[language];

  // Initialiser les données du couple à partir du profil utilisateur
  useEffect(() => {
    if (userData.personal) {
      const convertedData = CoupleCalculationService.convertProfileToCouple(userData);
      setCoupleData(convertedData);
    }
  }, [userData]);

  // Calculer les pensions du couple
  const calculateCouplePensions = async () => {
    if (!coupleData) return;

    setIsCalculating(true);
    try {
      // Simulation d'un délai pour le calcul
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const calculationResults = CoupleCalculationService.calculateCouplePensions(coupleData);
      setResults(calculationResults);
      setActiveTab('overview');
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Obtenir la couleur selon la priorité
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HAUTE': return 'bg-red-100 text-red-800 border-red-200';
      case 'MOYENNE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAIBLE': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Obtenir la couleur selon la complexité
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'FACILE': return 'text-green-600';
      case 'MOYENNE': return 'text-yellow-600';
      case 'COMPLEXE': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Vérifier si on a une deuxième personne
  const hasSecondPerson = coupleData?.person2 !== undefined;

  if (!hasSecondPerson) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="bg-gradient-to-br from-mpr-interactive-lt to-mpr-interactive-lt border-mpr-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-mpr-interactive-lt rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-mpr-interactive" />
              </div>
            </div>
            <CardTitle className="text-3xl text-mpr-navy mb-3">
              {t.title}
            </CardTitle>
            <CardDescription className="text-lg text-mpr-navy">
              {t.subtitle}
            </CardDescription>
          </CardHeader>
        </Card>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>{t.noSecondPerson}</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">{t.configureCouple}</p>
            <Button variant="outline" onClick={() => window.location.href = '/mon-profil'}>
              <Users className="w-4 h-4 mr-2" />
              {t.goToProfile}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <Card className="bg-gradient-to-br from-mpr-interactive-lt to-mpr-interactive-lt border-mpr-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-mpr-interactive-lt rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-mpr-interactive" />
            </div>
          </div>
          <CardTitle className="text-3xl text-mpr-navy mb-3">
            {t.title}
          </CardTitle>
          <CardDescription className="text-lg text-mpr-navy">
            {t.subtitle}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Résumé du couple */}
      {coupleData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Informations du couple
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personne 1 */}
              <div className="p-4 bg-mpr-interactive-lt rounded-lg">
                <h4 className="font-semibold text-mpr-navy mb-2">
                  {coupleData.person1.prenom || t.person1}
                </h4>
                <div className="space-y-1 text-sm">
                  <div>Âge de retraite: {coupleData.person1.ageRetraiteSouhaite} ans</div>
                  <div>Sexe: {coupleData.person1.sexe === 'M' ? 'Homme' : 'Femme'}</div>
                  <div>Années de cotisation: {coupleData.person1.cpp.anneesCotisation}</div>
                </div>
              </div>

              {/* Personne 2 */}
              {coupleData.person2 && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    {coupleData.person2.prenom || t.person2}
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div>Âge de retraite: {coupleData.person2.ageRetraiteSouhaite} ans</div>
                    <div>Sexe: {coupleData.person2.sexe === 'M' ? 'Homme' : 'Femme'}</div>
                    <div>Années de cotisation: {coupleData.person2.cpp.anneesCotisation}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Bouton de calcul */}
            <div className="mt-6 text-center">
              <Button
                onClick={calculateCouplePensions}
                disabled={isCalculating}
                size="lg"
                className="bg-mpr-interactive hover:bg-mpr-interactive-dk text-white px-8 py-3"
              >
                {isCalculating ? (
                  <>
                    <Calculator className="w-5 h-5 mr-2 animate-spin" />
                    {t.calculating}
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 mr-2" />
                    {t.calculate}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      {results && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="individual">{t.individual}</TabsTrigger>
            <TabsTrigger value="optimizations">{t.optimizations}</TabsTrigger>
            <TabsTrigger value="scenarios">{t.scenarios}</TabsTrigger>
            <TabsTrigger value="recommendations">{t.recommendations}</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-green-900">
                      Résultats pour le couple
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-3xl font-bold text-green-600">
                          {formatCurrency(results.couple.totalMensuel)}
                        </div>
                        <div className="text-sm text-gray-600">{t.totalMonthly}</div>
                      </div>
                      
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-3xl font-bold text-mpr-interactive">
                          {formatCurrency(results.couple.totalAnnuel)}
                        </div>
                        <div className="text-sm text-gray-600">{t.totalAnnual}</div>
                      </div>
                      
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-red-600">
                          {formatPercentage(results.couple.repartitionCPP / 100)}
                        </div>
                        <div className="text-sm text-gray-600">{t.cppPortion}</div>
                      </div>
                      
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatPercentage(results.couple.repartitionRRQ / 100)}
                        </div>
                        <div className="text-sm text-gray-600">{t.rrqPortion}</div>
                      </div>
                    </div>

                    {/* Graphique de répartition */}
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Répartition des revenus
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>CPP</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full"
                                style={{ width: `${results.couple.repartitionCPP}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {formatPercentage(results.couple.repartitionCPP / 100)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span>RRQ</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${results.couple.repartitionRRQ}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {formatPercentage(results.couple.repartitionRRQ / 100)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* Détails individuels */}
          <TabsContent value="individual" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personne 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-mpr-navy">
                    {coupleData?.person1.prenom || t.person1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>CPP mensuel:</span>
                      <span className="font-semibold">
                        {formatCurrency(results.person1.cpp.montantMensuel)}
                      </span>
                    </div>
                    
                    {results.person1.rrq && (
                      <div className="flex justify-between items-center">
                        <span>RRQ mensuel:</span>
                        <span className="font-semibold">
                          {formatCurrency(results.person1.rrq.montantMensuel)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-semibold">Total mensuel:</span>
                      <span className="font-bold text-lg text-mpr-interactive">
                        {formatCurrency(results.person1.total)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personne 2 */}
              {results.person2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-purple-900">
                      {coupleData?.person2?.prenom || t.person2}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>CPP mensuel:</span>
                        <span className="font-semibold">
                          {formatCurrency(results.person2.cpp.montantMensuel)}
                        </span>
                      </div>
                      
                      {results.person2.rrq && (
                        <div className="flex justify-between items-center">
                          <span>RRQ mensuel:</span>
                          <span className="font-semibold">
                            {formatCurrency(results.person2.rrq.montantMensuel)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-semibold">Total mensuel:</span>
                        <span className="font-bold text-lg text-purple-600">
                          {formatCurrency(results.person2.total)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Optimisations */}
          <TabsContent value="optimizations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  {t.optimizationTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.couple.optimisations.map((optimization, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{optimization.description}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="secondary">
                              {t.potentialSavings}: {formatCurrency(optimization.economieAnnuelle)}/an
                            </Badge>
                            <span className={`text-sm ${getComplexityColor(optimization.complexite)}`}>
                              {t.complexity}: {optimization.complexite}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{t.applicability}</div>
                          <div className="text-lg font-semibold text-green-600">
                            {optimization.applicabilite}%
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">{t.steps}:</h5>
                        <ul className="space-y-1">
                          {optimization.etapes.map((etape, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <ArrowRight className="w-4 h-4 text-mpr-interactive" />
                              {etape}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scénarios de survivant */}
          <TabsContent value="scenarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-mpr-interactive" />
                  {t.survivorScenarios}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.couple.scenariosSurvivant.map((scenario, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">
                        {scenario.scenarioType === 'PERSON1_SURVIT' 
                          ? `${coupleData?.person1.prenom || t.person1} ${t.survives}`
                          : `${coupleData?.person2?.prenom || t.person2} ${t.survives}`
                        }
                      </h4>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{t.survivorPension}:</span>
                          <span className="font-semibold">
                            {formatCurrency(scenario.pensionSurvivant)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Pension du conjoint:</span>
                          <span className="font-semibold">
                            {formatCurrency(scenario.pensionConjoint)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between pt-2 border-t">
                          <span className="font-semibold">{t.totalAfterDeath}:</span>
                          <span className="font-bold text-lg">
                            {formatCurrency(scenario.totalMensuel)}
                          </span>
                        </div>
                        
                        <div className="mt-3">
                          <Badge 
                            variant={scenario.impactFinancier === 'FAIBLE' ? 'secondary' : 'destructive'}
                          >
                            Impact: {scenario.impactFinancier}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommandations */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  {t.recommendationsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.recommandations.map((recommendation, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getPriorityColor(recommendation.priorite)}>
                              {t.priority}: {recommendation.priorite}
                            </Badge>
                            <Badge variant="outline">
                              {recommendation.categorie}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-lg">{recommendation.titre}</h4>
                          <p className="text-gray-600 mt-1">{recommendation.description}</p>
                        </div>
                        
                        {recommendation.impactFinancier > 0 && (
                          <div className="text-right">
                            <div className="text-sm text-gray-600">{t.financialImpact}</div>
                            <div className="text-lg font-semibold text-green-600">
                              {formatCurrency(recommendation.impactFinancier)}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">{t.implementation}: </span>
                          <span className="font-medium">{recommendation.delaiImplementation}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">{t.difficulty}: </span>
                          <span className={`font-medium ${getComplexityColor(recommendation.difficulte)}`}>
                            {recommendation.difficulte}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">{t.actions}:</h5>
                        <ul className="space-y-1">
                          {recommendation.actionsConcrete.map((action, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
