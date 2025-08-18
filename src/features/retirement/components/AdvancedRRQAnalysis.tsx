// ===== COMPOSANT ANALYSE RRQ AVANCÉE =====
// Interface utilisateur pour l'analyse RRQ 2025 avec recommandations personnalisées

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';
import { EnhancedRRQService, AdvancedRRQAnalysis } from '../services/EnhancedRRQService';
import { useLanguage } from '../hooks/useLanguage';

interface AdvancedRRQAnalysisProps {
  initialData?: {
    ageActuel: number;
    montantActuel: number;
    montant70: number;
    montant72: number;
    esperanceVie: number;
    sexe: 'M' | 'F';
    situationFinanciere: 'URGENTE' | 'STABLE' | 'CONFORTABLE';
  };
}

export const AdvancedRRQAnalysisComponent: React.FC<AdvancedRRQAnalysisProps> = ({ 
  initialData 
}) => {
  const { language } = useLanguage();
  const [analysis, setAnalysis] = useState<AdvancedRRQAnalysis | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [formData, setFormData] = useState({
    ageActuel: initialData?.ageActuel || 60,
    montantActuel: initialData?.montantActuel || 1000,
    montant70: initialData?.montant70 || 1400,
    montant72: initialData?.montant72 || 1600,
    esperanceVie: initialData?.esperanceVie || 85,
    sexe: initialData?.sexe || 'M' as 'M' | 'F',
    situationFinanciere: initialData?.situationFinanciere || 'STABLE' as 'URGENTE' | 'STABLE' | 'CONFORTABLE'
  });

  const t = {
    fr: {
      title: 'Analyse RRQ Avancée 2025',
      subtitle: 'Calculs précis avec paramètres 2025 et recommandations personnalisées',
      calculate: 'Calculer l\'analyse',
      calculating: 'Calcul en cours...',
      overview: 'Vue d\'ensemble',
      scenarios: 'Scénarios alternatifs',
      sensitivity: 'Analyse de sensibilité',
      risks: 'Analyse des risques',
      recommendations: 'Recommandations',
      currentAmount: 'Montant actuel',
      age70: 'Montant à 70 ans',
      age72: 'Montant à 72 ans (NOUVEAU)',
      lifeExpectancy: 'Espérance de vie',
      gender: 'Genre',
      financialSituation: 'Situation financière',
      urgent: 'Urgente',
      stable: 'Stable',
      comfortable: 'Confortable',
      startNow: 'Commencer maintenant',
      waitUntil72: 'Attendre jusqu\'à 72 ans',
      flexibleStrategy: 'Stratégie flexible',
      confidence: 'Niveau de confiance',
      advantages: 'Avantages',
      disadvantages: 'Inconvénients',
      inflationImpact: 'Impact de l\'inflation',
      realInflation: 'Inflation réelle (2.5%)',
      projectedPurchasingPower: 'Pouvoir d\'achat projeté (30 ans)',
      criticalFactors: 'Facteurs critiques',
      sensitivityLevel: 'Sensibilité',
      high: 'Haute',
      medium: 'Moyenne',
      low: 'Faible',
      riskMitigation: 'Stratégies de mitigation',
      risk: 'Risque',
      strategy: 'Stratégie',
      impact: 'Impact',
      difficulty: 'Difficulté',
      easy: 'Facile',
      moderate: 'Modérée',
      difficult: 'Difficile'
    },
    en: {
      title: 'Advanced RRQ Analysis 2025',
      subtitle: 'Precise calculations with 2025 parameters and personalized recommendations',
      calculate: 'Calculate Analysis',
      calculating: 'Calculating...',
      overview: 'Overview',
      scenarios: 'Alternative Scenarios',
      sensitivity: 'Sensitivity Analysis',
      risks: 'Risk Analysis',
      recommendations: 'Recommendations',
      currentAmount: 'Current Amount',
      age70: 'Amount at 70',
      age72: 'Amount at 72 (NEW)',
      lifeExpectancy: 'Life Expectancy',
      gender: 'Gender',
      financialSituation: 'Financial Situation',
      urgent: 'Urgent',
      stable: 'Stable',
      comfortable: 'Comfortable',
      startNow: 'Start Now',
      waitUntil72: 'Wait Until 72',
      flexibleStrategy: 'Flexible Strategy',
      confidence: 'Confidence Level',
      advantages: 'Advantages',
      disadvantages: 'Disadvantages',
      inflationImpact: 'Inflation Impact',
      realInflation: 'Real Inflation (2.5%)',
      projectedPurchasingPower: 'Projected Purchasing Power (30 years)',
      criticalFactors: 'Critical Factors',
      sensitivityLevel: 'Sensitivity',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      riskMitigation: 'Risk Mitigation Strategies',
      risk: 'Risk',
      strategy: 'Strategy',
      impact: 'Impact',
      difficulty: 'Difficulty',
      easy: 'Easy',
      moderate: 'Moderate',
      difficult: 'Difficult'
    }
  }[language];

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      // Simulation d'un délai pour l'analyse
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = EnhancedRRQService.analyzeRRQAdvanced(formData);
      setAnalysis(result);
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSituationColor = (situation: string) => {
    switch (situation) {
      case 'URGENTE': return 'bg-red-100 text-red-800';
      case 'STABLE': return 'bg-yellow-100 text-yellow-800';
      case 'CONFORTABLE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'COMMENCER_MAINTENANT': return 'bg-blue-100 text-blue-800';
      case 'ATTENDRE_JUSQU_72': return 'bg-purple-100 text-purple-800';
      case 'STRATEGIE_FLEXIBLE': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 {t.title}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Formulaire de saisie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {t.overview}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.currentAmount} ($/mois)
              </label>
              <input
                type="number"
                value={formData.montantActuel}
                onChange={(e) => handleInputChange('montantActuel', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                title={t.currentAmount}
                aria-label={t.currentAmount}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.age70} ($/mois)
              </label>
              <input
                type="number"
                value={formData.montant70}
                onChange={(e) => handleInputChange('montant70', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                title={t.age70}
                aria-label={t.age70}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.age72} ($/mois)
              </label>
              <input
                type="number"
                value={formData.montant72}
                onChange={(e) => handleInputChange('montant72', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                title={t.age72}
                aria-label={t.age72}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.lifeExpectancy} (années)
              </label>
              <input
                type="number"
                value={formData.esperanceVie}
                onChange={(e) => handleInputChange('esperanceVie', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                title={t.lifeExpectancy}
                aria-label={t.lifeExpectancy}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.gender}
              </label>
              <select
                value={formData.sexe}
                onChange={(e) => handleInputChange('sexe', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                title={t.gender}
                aria-label={t.gender}
              >
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.financialSituation}
              </label>
              <select
                value={formData.situationFinanciere}
                onChange={(e) => handleInputChange('situationFinanciere', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                title={t.financialSituation}
                aria-label={t.financialSituation}
              >
                <option value="URGENTE">{t.urgent}</option>
                <option value="STABLE">{t.stable}</option>
                <option value="CONFORTABLE">{t.comfortable}</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={handleCalculate}
              disabled={isCalculating}
              className="px-8 py-3 text-lg"
            >
              {isCalculating ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
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

      {/* Résultats de l'analyse */}
      {analysis && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="scenarios">{t.scenarios}</TabsTrigger>
            <TabsTrigger value="sensitivity">{t.sensitivity}</TabsTrigger>
            <TabsTrigger value="risks">{t.risks}</TabsTrigger>
            <TabsTrigger value="recommendations">{t.recommendations}</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Résumé de l'analyse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ${analysis.montantMensuel.toFixed(2)}
                    </div>
                    <div className="text-sm text-blue-600">Montant mensuel actuel</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${(analysis.montantMensuel * 12).toFixed(2)}
                    </div>
                    <div className="text-sm text-green-600">Montant annuel</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      ${analysis.valeurActuelle.toFixed(2)}
                    </div>
                    <div className="text-sm text-purple-600">Valeur actuelle</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scénarios alternatifs */}
          <TabsContent value="scenarios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t.scenarios}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.scenariosAlternatifs.map((scenario, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">{scenario.nom}</h4>
                        <Badge variant="secondary">
                          ${scenario.montantMensuel.toFixed(2)}/mois
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-green-700 mb-2">{t.advantages}</h5>
                          <ul className="space-y-1">
                            {scenario.avantages.map((avantage, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {avantage}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-red-700 mb-2">{t.disadvantages}</h5>
                          <ul className="space-y-1">
                            {scenario.inconvenients.map((inconvenient, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                {inconvenient}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm text-gray-600">
                          Valeur actuelle nette: <span className="font-semibold">${scenario.valeurActuelleNette.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommandations */}
          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {t.recommendations}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Décision recommandée */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={getDecisionColor(analysis.recommandationPersonnalisee.decision)}>
                        {analysis.recommandationPersonnalisee.decision === 'COMMENCER_MAINTENANT' && t.startNow}
                        {analysis.recommandationPersonnalisee.decision === 'ATTENDRE_JUSQU_72' && t.waitUntil72}
                        {analysis.recommandationPersonnalisee.decision === 'STRATEGIE_FLEXIBLE' && t.flexibleStrategy}
                      </Badge>
                      <div className="text-sm text-gray-600">
                        {t.confidence}: {analysis.recommandationPersonnalisee.niveauConfiance}%
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {analysis.recommandationPersonnalisee.raisonnement.map((raison, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{raison}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Actions concrètes */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3">Actions concrètes recommandées</h4>
                    <div className="space-y-3">
                      {analysis.recommandationPersonnalisee.actionsConcretes.map((action, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Badge variant={action.priorite === 'HAUTE' ? 'destructive' : action.priorite === 'MOYENNE' ? 'secondary' : 'outline'}>
                            {action.priorite}
                          </Badge>
                          <div className="flex-1">
                            <div className="font-medium">{action.action}</div>
                            <div className="text-sm text-gray-600">
                              Délai: {action.delai} | Impact: {action.impact}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
