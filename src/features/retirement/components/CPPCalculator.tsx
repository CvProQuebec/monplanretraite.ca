// src/features/retirement/components/CPPCalculator.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Info, 
  AlertTriangle,
  Download,
  RefreshCw,
  Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CPPData, CPPCalculationResult, CPPContributionYear } from '../types/cpp';
import { CPPService } from '../services/CPPService';
import { useLanguage } from '../hooks/useLanguage';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface CPPCalculatorProps {
  className?: string;
}

export const CPPCalculator: React.FC<CPPCalculatorProps> = ({ className }) => {
  const { language } = useLanguage();
  const [cppData, setCppData] = useState<CPPData>(CPPService.generateDefaultCPPData());
  const [results, setResults] = useState<CPPCalculationResult | null>(null);
  const [contributionHistory, setContributionHistory] = useState<CPPContributionYear[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('calculator');

  // Textes selon la langue
  const texts = {
    fr: {
      title: 'Calculateur CPP',
      subtitle: 'Régime de pensions du Canada - Pension fédérale canadienne',
      calculator: 'Calculateur',
      results: 'Résultats',
      history: 'Historique',
      info: 'Informations',
      calculate: 'Calculer ma pension',
      recalculate: 'Recalculer',
      download: 'Télécharger',
      personalInfo: 'Informations personnelles',
      birthDate: 'Date de naissance',
      retirementDate: 'Date de retraite',
      yearsContribution: 'Années de cotisation',
      residence: 'Pays de résidence',
      maritalStatus: 'Statut conjugal',
      single: 'Célibataire',
      married: 'Marié(e)',
      commonLaw: 'Union de fait',
      divorced: 'Divorcé(e)',
      widowed: 'Veuf/Veuve',
      canada: 'Canada',
      quebec: 'Québec',
      other: 'Autre',
      earnings: 'Gains annuels',
      addYear: 'Ajouter une année',
      removeYear: 'Supprimer',
      resultsTitle: 'Votre pension CPP',
      basePension: 'Pension de base (65 ans)',
      adjustedPension: 'Pension ajustée',
      monthlyAmount: 'Montant mensuel',
      annualAmount: 'Montant annuel',
      projections: 'Projections par âge',
      age60: 'À 60 ans',
      age65: 'À 65 ans',
      age70: 'À 70 ans',
      age75: 'À 75 ans',
      details: 'Détails du calcul',
      contributableEarnings: 'Gains moyens cotisables',
      adjustmentFactor: 'Facteur d\'ajustement',
      earlyReduction: 'Réduction retraite anticipée',
      lateIncrease: 'Augmentation retraite reportée',
      historyTitle: 'Historique des cotisations',
      year: 'Année',
      annualEarnings: 'Gains',
      contributions: 'Cotisations',
      contributable: 'Cotisables',
      totalContributions: 'Total des cotisations',
      infoTitle: 'À propos du CPP',
      infoDescription: 'Le Régime de pensions du Canada (CPP) est une prestation mensuelle imposable qui assure un remplacement partiel du revenu au moment de la retraite.',
      maxAmount2025: 'Montant maximum 2025',
      avgAmount2024: 'Montant moyen 2024',
      eligibility: 'Admissibilité',
      eligibilityDescription: 'L\'admissibilité du CPP est établie par vos contributions au plan et selon votre âge.',
      calculationMethod: 'Méthode de calcul',
      calculationDescription: 'Votre pension est calculée sur 25% de vos gains moyens cotisables, en excluant vos 8 années les plus faibles.',
      adjustmentFactors: 'Facteurs d\'ajustement',
      adjustmentDescription: 'Retraite anticipée (60-64 ans) : réduction de 0.6% par mois. Retraite reportée (66-70 ans) : augmentation de 0.7% par mois.',
      validationErrors: 'Erreurs de validation',
      noErrors: 'Aucune erreur détectée'
    },
    en: {
      title: 'CPP Calculator',
      subtitle: 'Canada Pension Plan - Federal Canadian pension',
      calculator: 'Calculator',
      results: 'Results',
      history: 'History',
      info: 'Information',
      calculate: 'Calculate my pension',
      recalculate: 'Recalculate',
      download: 'Download',
      personalInfo: 'Personal Information',
      birthDate: 'Date of birth',
      retirementDate: 'Retirement date',
      yearsContribution: 'Years of contribution',
      residence: 'Country of residence',
      maritalStatus: 'Marital status',
      single: 'Single',
      married: 'Married',
      commonLaw: 'Common-law',
      divorced: 'Divorced',
      widowed: 'Widowed',
      canada: 'Canada',
      quebec: 'Quebec',
      other: 'Other',
      earnings: 'Annual earnings',
      addYear: 'Add year',
      removeYear: 'Remove',
      resultsTitle: 'Your CPP Pension',
      basePension: 'Base pension (age 65)',
      adjustedPension: 'Adjusted pension',
      monthlyAmount: 'Monthly amount',
      annualAmount: 'Annual amount',
      projections: 'Projections by age',
      age60: 'At age 60',
      age65: 'At age 65',
      age70: 'At age 70',
      age75: 'At age 75',
      details: 'Calculation details',
      contributableEarnings: 'Average contributable earnings',
      adjustmentFactor: 'Adjustment factor',
      earlyReduction: 'Early retirement reduction',
      lateIncrease: 'Late retirement increase',
      historyTitle: 'Contribution History',
      year: 'Year',
      annualEarnings: 'Earnings',
      contributions: 'Contributions',
      contributable: 'Contributable',
      totalContributions: 'Total contributions',
      infoTitle: 'About CPP',
      infoDescription: 'The Canada Pension Plan (CPP) is a taxable monthly benefit that provides partial income replacement at retirement.',
      maxAmount2025: 'Maximum amount 2025',
      avgAmount2024: 'Average amount 2024',
      eligibility: 'Eligibility',
      eligibilityDescription: 'CPP eligibility is established by your plan contributions and according to your age.',
      calculationMethod: 'Calculation method',
      calculationDescription: 'Your pension is calculated on 25% of your average contributable earnings, excluding your 8 lowest years.',
      adjustmentFactors: 'Adjustment factors',
      adjustmentDescription: 'Early retirement (60-64 years): 0.6% reduction per month. Late retirement (66-70 years): 0.7% increase per month.',
      validationErrors: 'Validation errors',
      noErrors: 'No errors detected'
    }
  };

  const t = texts[language];

  // Calculer la pension CPP
  const calculatePension = async () => {
    setIsCalculating(true);
    setErrors([]);
    
    try {
      // Valider les données
      const validation = CPPService.validateCPPData(cppData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsCalculating(false);
        return;
      }
      
      // Calculer la pension
      const calculationResults = CPPService.calculateCPPPension(cppData);
      setResults(calculationResults);
      
      // Calculer l'historique des cotisations
      const history = CPPService.calculateContributionHistory(cppData);
      setContributionHistory(history);
      
      // Passer à l'onglet résultats
      setActiveTab('results');
      
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      setErrors(['Erreur lors du calcul de la pension']);
    } finally {
      setIsCalculating(false);
    }
  };

  // Mettre à jour les données personnelles
  const updatePersonalData = (field: keyof CPPData['personal'], value: any) => {
    setCppData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  // Ajouter une année de gains
  const addEarningsYear = () => {
    setCppData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        gainsAnnuels: [...prev.personal.gainsAnnuels, 50000],
        anneesCotisation: prev.personal.anneesCotisation + 1
      }
    }));
  };

  // Supprimer une année de gains
  const removeEarningsYear = (index: number) => {
    setCppData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        gainsAnnuels: prev.personal.gainsAnnuels.filter((_, i) => i !== index),
        anneesCotisation: Math.max(0, prev.personal.anneesCotribution - 1)
      }
    }));
  };

  // Mettre à jour les gains annuels
  const updateEarnings = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCppData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        gainsAnnuels: prev.personal.gainsAnnuels.map((gain, i) => 
          i === index ? numValue : gain
        )
      }
    }));
  };

  // Générer des données par défaut
  const resetToDefaults = () => {
    setCppData(CPPService.generateDefaultCPPData());
    setResults(null);
    setErrors([]);
    setActiveTab('calculator');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Flag className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-red-900 mb-3">
            {t.title}
          </CardTitle>
          <CardDescription className="text-lg text-red-700">
            {t.subtitle}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">{t.calculator}</TabsTrigger>
          <TabsTrigger value="results">{t.results}</TabsTrigger>
          <TabsTrigger value="history">{t.history}</TabsTrigger>
          <TabsTrigger value="info">{t.info}</TabsTrigger>
        </TabsList>

        {/* Onglet Calculateur */}
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                {t.personalInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="birthDate">{t.birthDate}</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={cppData.personal.dateNaissance.toISOString().split('T')[0]}
                    onChange={(e) => updatePersonalData('dateNaissance', new Date(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="retirementDate">{t.retirementDate}</Label>
                  <Input
                    id="retirementDate"
                    type="date"
                    value={cppData.personal.dateRetraite.toISOString().split('T')[0]}
                    onChange={(e) => updatePersonalData('dateRetraite', new Date(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="residence">{t.residence}</Label>
                  <select
                    id="residence"
                    className="w-full p-2 border rounded-md"
                    value={cppData.personal.paysResidence}
                    onChange={(e) => updatePersonalData('paysResidence', e.target.value as any)}
                  >
                    <option value="CA">{t.canada}</option>
                    <option value="QC">{t.quebec}</option>
                    <option value="OTHER">{t.other}</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="maritalStatus">{t.maritalStatus}</Label>
                  <select
                    id="maritalStatus"
                    className="w-full p-2 border rounded-md"
                    value={cppData.personal.statutConjugal}
                    onChange={(e) => updatePersonalData('statutConjugal', e.target.value as any)}
                  >
                    <option value="single">{t.single}</option>
                    <option value="married">{t.married}</option>
                    <option value="common-law">{t.commonLaw}</option>
                    <option value="divorced">{t.divorced}</option>
                    <option value="widowed">{t.widowed}</option>
                  </select>
                </div>
              </div>

              {/* Gains annuels */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>{t.earnings}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEarningsYear}
                  >
                    {t.addYear}
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {cppData.personal.gainsAnnuels.map((gain, index) => (
                    <div key={index} className="space-y-1">
                      <Label className="text-xs">{index + 1}</Label>
                      <Input
                        type="number"
                        value={gain}
                        onChange={(e) => updateEarnings(index, e.target.value)}
                        className="text-sm"
                      />
                      {cppData.personal.gainsAnnuels.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEarningsYear(index)}
                          className="w-full text-xs text-red-600 hover:text-red-700"
                        >
                          {t.removeYear}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton de calcul */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={calculatePension}
                  disabled={isCalculating}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
                >
                  {isCalculating ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Calculator className="w-4 h-4 mr-2" />
                  )}
                  {isCalculating ? 'Calcul...' : t.calculate}
                </Button>
              </div>

              {/* Erreurs de validation */}
              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{t.validationErrors}</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Résultats */}
        <TabsContent value="results" className="space-y-6">
          {results ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Résumé principal */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-green-900">
                      {t.resultsTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(results.pensionBase)}
                        </div>
                        <div className="text-sm text-gray-600">{t.basePension}</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(results.pensionAjustee)}
                        </div>
                        <div className="text-sm text-gray-600">{t.adjustedPension}</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatCurrency(results.montantMensuel)}
                        </div>
                        <div className="text-sm text-gray-600">{t.monthlyAmount}</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-orange-600">
                          {formatCurrency(results.montantAnnuel)}
                        </div>
                        <div className="text-sm text-gray-600">{t.annualAmount}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Projections par âge */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      {t.projections}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-xl font-bold text-yellow-700">
                          {formatCurrency(results.projections.age60)}
                        </div>
                        <div className="text-sm text-yellow-600">{t.age60}</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-700">
                          {formatCurrency(results.projections.age65)}
                        </div>
                        <div className="text-sm text-green-600">{t.age65}</div>
                        </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-700">
                          {formatCurrency(results.projections.age70)}
                        </div>
                        <div className="text-sm text-blue-600">{t.age70}</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-xl font-bold text-purple-700">
                          {formatCurrency(results.projections.age75)}
                        </div>
                        <div className="text-sm text-purple-600">{t.age75}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Détails du calcul */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t.details}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t.contributableEarnings}:</span>
                          <span className="font-semibold">{formatCurrency(results.details.gainsMoyens)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t.adjustmentFactor}:</span>
                          <span className="font-semibold">{formatPercentage(results.details.facteurAjustement)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t.earlyReduction}:</span>
                          <span className="font-semibold">{formatCurrency(results.details.reductionAnticipee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t.lateIncrease}:</span>
                          <span className="font-semibold">{formatCurrency(results.details.augmentationReportee)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => setActiveTab('calculator')}
                    variant="outline"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    {t.recalculate}
                  </Button>
                  <Button
                    onClick={() => setActiveTab('history')}
                    variant="outline"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {t.history}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">
                  {language === 'fr' 
                    ? 'Calculez votre pension CPP pour voir les résultats ici'
                    : 'Calculate your CPP pension to see results here'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history" className="space-y-6">
          {contributionHistory.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t.historyTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">{t.year}</th>
                        <th className="text-right p-2">{t.earnings}</th>
                        <th className="text-right p-2">{t.contributable}</th>
                        <th className="text-right p-2">{t.contributions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contributionHistory.map((year) => (
                        <tr key={year.annee} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{year.annee}</td>
                          <td className="text-right p-2">{formatCurrency(year.gains)}</td>
                          <td className="text-right p-2">{formatCurrency(year.gainsCotisables)}</td>
                          <td className="text-right p-2">{formatCurrency(year.cotisations)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-semibold">
                        <td className="p-2">{t.totalContributions}</td>
                        <td className="text-right p-2">
                          {formatCurrency(contributionHistory.reduce((sum, y) => sum + y.gains, 0))}
                        </td>
                        <td className="text-right p-2">
                          {formatCurrency(contributionHistory.reduce((sum, y) => sum + y.gainsCotisables, 0))}
                        </td>
                        <td className="text-right p-2">
                          {formatCurrency(contributionHistory.reduce((sum, y) => sum + y.cotisations, 0))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">
                  {language === 'fr' 
                    ? 'Calculez votre pension CPP pour voir l\'historique des cotisations'
                    : 'Calculate your CPP pension to see contribution history'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Informations */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                {t.infoTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-gray-700 mb-4">{t.infoDescription}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">{t.maxAmount2025}</h4>
                    <p className="text-2xl font-bold text-blue-600">$1,433.00</p>
                    <p className="text-sm text-blue-700">par mois</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">{t.avgAmount2024}</h4>
                    <p className="text-2xl font-bold text-green-600">$899.67</p>
                    <p className="text-sm text-green-700">par mois</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.eligibility}</h4>
                    <p className="text-gray-700 text-sm">{t.eligibilityDescription}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.calculationMethod}</h4>
                    <p className="text-gray-700 text-sm">{t.calculationDescription}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.adjustmentFactors}</h4>
                    <p className="text-gray-700 text-sm">{t.adjustmentDescription}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bouton de réinitialisation */}
      <div className="flex justify-center">
        <Button
          onClick={resetToDefaults}
          variant="outline"
          className="text-gray-600"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {language === 'fr' ? 'Réinitialiser' : 'Reset'}
        </Button>
      </div>
    </div>
  );
};
