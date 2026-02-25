// ===== COMPOSANT ANALYSE OAS/GIS =====
// Interface utilisateur pour l'analyse Sécurité de la vieillesse et Supplément de revenu garanti

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  DollarSign, 
  Shield, 
  TrendingUp, 
  Clock, 
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { OASGISService, OASGISCalculation } from '../services/OASGISService';
import { useLanguage } from '../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { HelpTooltip } from './HelpTooltip';

interface OASGISAnalysisProps {
  initialData?: {
    age: number;
    revenuAnnuel: number;
    statutConjoint: 'SEUL' | 'MARIE' | 'CONJOINT_FAIT';
    revenuConjoint?: number;
    anneesResidence: number;
  };
}

export const OASGISAnalysisComponent: React.FC<OASGISAnalysisProps> = ({ 
  initialData 
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<OASGISCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [formData, setFormData] = useState({
    age: initialData?.age || 65,
    revenuAnnuel: initialData?.revenuAnnuel || 50000,
    statutConjoint: initialData?.statutConjoint || 'SEUL' as 'SEUL' | 'MARIE' | 'CONJOINT_FAIT',
    revenuConjoint: initialData?.revenuConjoint || 0,
    anneesResidence: initialData?.anneesResidence || 40
  });

  const t = {
    fr: {
      title: 'Analyse OAS/GIS 2025',
      subtitle: 'Calculs Sécurité de la vieillesse et Supplément de revenu garanti avec paramètres 2025',
      calculate: 'Calculer l\'analyse',
      calculating: 'Calcul en cours...',
      overview: 'Vue d\'ensemble',
      oas: 'Sécurité de la vieillesse',
      gis: 'Supplément de revenu garanti',
      optimization: 'Optimisation',
      age: 'Âge',
      annualIncome: 'Revenu annuel',
      maritalStatus: 'Statut marital',
      single: 'Seul(e)',
      married: 'Marié(e)',
      commonLaw: 'Union de fait',
      spouseIncome: 'Revenu du conjoint',
      yearsResidence: 'Années de résidence au Canada',
      monthlyAmount: 'Montant mensuel',
      startAge: 'Âge de début',
      recoveryThreshold: 'Seuil de récupération',
      partialRecovery: 'Récupération partielle',
      completeRecovery: 'Récupération complète',
      eligible: 'Éligible',
      notEligible: 'Non éligible',
      optimalCombination: 'Combinaison optimale',
      recommendedStrategy: 'Stratégie recommandée',
      taxImpact: 'Impact fiscal',
      projectedNetIncome: 'Revenu net projeté',
      clawback: 'Récupération (clawback)',
      clawbackInfo: 'La SV est récupérée à 15% pour chaque dollar au-dessus du seuil',
      gisInfo: 'Le SRG est réduit de 50 cents pour chaque dollar de revenu',
      optimizationNote: 'Note: Si éligible au SRG, ne pas reporter la SV pour bonification'
    },
    en: {
      title: 'OAS/GIS Analysis 2025',
      subtitle: 'Old Age Security and Guaranteed Income Supplement calculations with 2025 parameters',
      calculate: 'Calculate Analysis',
      calculating: 'Calculating...',
      overview: 'Overview',
      oas: 'Old Age Security',
      gis: 'Guaranteed Income Supplement',
      optimization: 'Optimization',
      age: 'Age',
      annualIncome: 'Annual Income',
      maritalStatus: 'Marital Status',
      single: 'Single',
      married: 'Married',
      commonLaw: 'Common Law',
      spouseIncome: 'Spouse Income',
      yearsResidence: 'Years of Residence in Canada',
      monthlyAmount: 'Monthly Amount',
      startAge: 'Start Age',
      recoveryThreshold: 'Recovery Threshold',
      partialRecovery: 'Partial Recovery',
      completeRecovery: 'Complete Recovery',
      eligible: 'Eligible',
      notEligible: 'Not Eligible',
      optimalCombination: 'Optimal Combination',
      recommendedStrategy: 'Recommended Strategy',
      taxImpact: 'Tax Impact',
      projectedNetIncome: 'Projected Net Income',
      clawback: 'Recovery (clawback)',
      clawbackInfo: 'OAS is recovered at 15% for each dollar above the threshold',
      gisInfo: 'GIS is reduced by 50 cents for each dollar of income',
      optimizationNote: 'Note: If eligible for GIS, do not defer OAS for bonus'
    }
  }[language];

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      // Simulation d'un délai pour l'analyse
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = OASGISService.calculateOASGIS(formData);
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

  const getEligibilityColor = (eligible: boolean) => {
    return eligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getEligibilityText = (eligible: boolean) => {
    return eligible ? t.eligible : t.notEligible;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🛡️ {t.title}
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
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                {t.age}
                <HelpTooltip
                  title={language === 'fr' ? 'Âge pour SV/SRG' : 'Age for OAS/GIS'}
                  content={language === 'fr'
                    ? 'Utilisé pour déterminer l’admissibilité et les montants. Reporter ou avancer l’âge peut modifier vos prestations.'
                    : 'Used to determine eligibility and amounts. Deferring or advancing start age may change your benefits.'
                  }
                ><span></span></HelpTooltip>
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mpr-interactive"
                title={t.age}
                aria-label={t.age}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                {t.annualIncome} ($)
                <HelpTooltip
                  title={language === 'fr' ? 'CELI et SV/SRG' : 'TFSA and OAS/GIS'}
                  content={language === 'fr'
                    ? 'Les retraits du CELI ne sont pas imposables et n’affectent pas la SV/SRG. Privilégiez le CELI pour préserver ces prestations.'
                    : 'TFSA withdrawals are tax-free and do not affect OAS/GIS. Prefer TFSA withdrawals to preserve these benefits.'
                  }
                ><span></span></HelpTooltip>
              </label>
              <input
                type="number"
                value={formData.revenuAnnuel}
                onChange={(e) => handleInputChange('revenuAnnuel', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mpr-interactive"
                title={t.annualIncome}
                aria-label={t.annualIncome}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                {t.maritalStatus}
                <HelpTooltip
                  title={language === 'fr' ? 'Statut marital et SRG' : 'Marital status and GIS'}
                  content={language === 'fr'
                    ? 'Le SRG est calculé selon le revenu du ménage. Votre statut influence les seuils d’admissibilité et les montants.'
                    : 'GIS is based on household income. Your marital status affects eligibility thresholds and amounts.'
                  }
                ><span></span></HelpTooltip>
              </label>
              <select
                value={formData.statutConjoint}
                onChange={(e) => handleInputChange('statutConjoint', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mpr-interactive"
                title={t.maritalStatus}
                aria-label={t.maritalStatus}
              >
                <option value="SEUL">{t.single}</option>
                <option value="MARIE">{t.married}</option>
                <option value="CONJOINT_FAIT">{t.commonLaw}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                {t.spouseIncome} ($)
                <HelpTooltip
                  title={language === 'fr' ? 'Revenu familial et SRG' : 'Family income and GIS'}
                  content={language === 'fr'
                    ? 'Le SRG est réduit en fonction du revenu familial. Indiquez le revenu du conjoint pour une estimation réaliste.'
                    : 'GIS is reduced based on family income. Provide spouse income for realistic estimates.'
                  }
                ><span></span></HelpTooltip>
              </label>
              <input
                type="number"
                value={formData.revenuConjoint}
                onChange={(e) => handleInputChange('revenuConjoint', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mpr-interactive"
                title={t.spouseIncome}
                aria-label={t.spouseIncome}
                disabled={formData.statutConjoint === 'SEUL'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                {t.yearsResidence}
                <HelpTooltip
                  title={language === 'fr' ? 'Admissibilité SV' : 'OAS eligibility'}
                  content={language === 'fr'
                    ? 'Vous devez avoir résidé au moins 10 ans au Canada après 18 ans pour être admissible à la SV. Le montant est proportionnel jusqu’à 40 ans de résidence.'
                    : 'You must have lived in Canada at least 10 years after age 18 for OAS eligibility. Amount is proportional up to 40 years of residence.'
                  }
                ><span></span></HelpTooltip>
              </label>
              <input
                type="number"
                value={formData.anneesResidence}
                onChange={(e) => handleInputChange('anneesResidence', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mpr-interactive"
                title={t.yearsResidence}
                aria-label={t.yearsResidence}
                min="0"
                max="50"
              />
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="oas">{t.oas}</TabsTrigger>
            <TabsTrigger value="gis">{t.gis}</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Résumé de l'analyse OAS/GIS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* OAS */}
                  <div className="p-4 bg-mpr-interactive-lt rounded-lg">
                    <h4 className="font-semibold text-mpr-navy mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      {t.oas}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-mpr-navy">{t.monthlyAmount}:</span>
                        <span className="font-semibold text-mpr-navy">
                          ${analysis.securiteVieillesse.montantMensuel.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-mpr-navy">{t.startAge}:</span>
                        <span className="font-semibold text-mpr-navy">
                          {analysis.securiteVieillesse.ageDebut} ans
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-mpr-navy">{t.recoveryThreshold}:</span>
                        <span className="font-semibold text-mpr-navy">
                          ${analysis.securiteVieillesse.seuil_recuperation.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* GIS */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      {t.gis}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">{t.monthlyAmount}:</span>
                        <span className="font-semibold text-green-900">
                          ${analysis.supplementRevenuGaranti.montantMensuel.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">{t.eligible}:</span>
                        <Badge className={getEligibilityColor(analysis.supplementRevenuGaranti.eligible)}>
                          {getEligibilityText(analysis.supplementRevenuGaranti.eligible)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">{t.optimalCombination}:</span>
                        <Badge variant={analysis.supplementRevenuGaranti.combinaisonOptimale ? 'default' : 'secondary'}>
                          {analysis.supplementRevenuGaranti.combinaisonOptimale ? 'Oui' : 'Non'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenu total projeté */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-mpr-interactive-lt rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Revenu total mensuel projeté
                  </h4>
                  <div className="text-2xl font-bold text-purple-900">
                    ${analysis.optimisationCombinaison.revenuNetProjecte.toFixed(2)}
                  </div>
                  <p className="text-sm text-purple-700 mt-1">
                    OAS + GIS combinés
                  </p>
                  <div className="mt-4">
                    <Button
                      onClick={() =>
                        navigate(`/prestations/apply?oasAge=${formData.age}&redirect=/budget&scenarioId=default`)
                      }
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      {language === 'fr' ? 'Appliquer cet âge SV' : 'Apply this OAS age'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Détails OAS */}
          <TabsContent value="oas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t.oas} - Détails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-mpr-interactive-lt rounded-lg">
                      <h5 className="font-semibold text-mpr-navy mb-2">{t.monthlyAmount}</h5>
                      <div className="text-2xl font-bold text-mpr-interactive">
                        ${analysis.securiteVieillesse.montantMensuel.toFixed(2)}
                      </div>
                      <p className="text-sm text-mpr-interactive">
                        Montant mensuel de la pension OAS
                      </p>
                    </div>
                    
                    <div className="p-4 bg-mpr-interactive-lt rounded-lg">
                      <h5 className="font-semibold text-mpr-navy mb-2">{t.startAge}</h5>
                      <div className="text-2xl font-bold text-mpr-interactive">
                        {analysis.securiteVieillesse.ageDebut} ans
                      </div>
                      <p className="text-sm text-mpr-interactive">
                        Âge de début de la pension
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h5 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      {t.clawback}
                    </h5>
                    <p className="text-sm text-yellow-700 mb-3">
                      {t.clawbackInfo}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-yellow-700">{t.recoveryThreshold}:</span>
                        <span className="font-semibold text-yellow-900">
                          ${analysis.securiteVieillesse.seuil_recuperation.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-yellow-700">{t.partialRecovery}:</span>
                        <span className="font-semibold text-yellow-900">
                          ${analysis.securiteVieillesse.recuperationPartielle.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-yellow-700">{t.completeRecovery}:</span>
                        <span className="font-semibold text-yellow-900">
                          ${analysis.securiteVieillesse.recuperationComplete.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Détails GIS */}
          <TabsContent value="gis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  {t.gis} - Détails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Éligibilité et montant
                    </h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700">{t.eligible}:</span>
                        <Badge className={getEligibilityColor(analysis.supplementRevenuGaranti.eligible)}>
                          {getEligibilityText(analysis.supplementRevenuGaranti.eligible)}
                        </Badge>
                      </div>
                      
                      {analysis.supplementRevenuGaranti.eligible && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-green-700">{t.monthlyAmount}:</span>
                            <span className="font-semibold text-green-900">
                              ${analysis.supplementRevenuGaranti.montantMensuel.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-green-700">Seuil de revenu:</span>
                            <span className="font-semibold text-green-900">
                              ${analysis.supplementRevenuGaranti.seuilRevenu.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h5 className="font-semibold text-purple-900 mb-2">
                      {t.optimization}
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <h6 className="font-medium text-purple-800 mb-1">{t.recommendedStrategy}:</h6>
                        <p className="text-sm text-purple-700">
                          {analysis.optimisationCombinaison.strategieRecommandee}
                        </p>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-700">{t.taxImpact}:</span>
                        <span className="font-semibold text-purple-900">
                          ${analysis.optimisationCombinaison.impactFiscal.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-700">{t.projectedNetIncome}:</span>
                        <span className="font-semibold text-purple-900">
                          ${analysis.optimisationCombinaison.revenuNetProjecte.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-mpr-interactive-lt rounded-lg">
                    <h5 className="font-semibold text-mpr-navy mb-2">
                      Information importante
                    </h5>
                    <p className="text-sm text-mpr-navy">
                      {t.optimizationNote}
                    </p>
                    <p className="text-sm text-mpr-navy mt-2">
                      {t.gisInfo}
                    </p>
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
