// src/components/ui/FERROptimizationModule.tsx
/**
 * MODULE FERR OPTIMISÉ - Fonds Enregistré de Revenu de Retraite
 * 
 * Module d'optimisation avancée basé sur l'expertise gouvernementale
 * Implémente les stratégies officielles du Gouvernement du Canada
 * 
 * Fonctionnalités avancées:
 * - Calculs avec formules gouvernementales officielles
 * - Stratégie âge du conjoint pour minimiser retraits
 * - Optimisation fiscale et coordination prestations
 * - Fractionnement de revenu de pension
 * - Impact sur SV/SRG et autres prestations
 * 
 * @author MonPlanRetraite.ca
 * @version 1.0.0 - Optimisation Gouvernementale
 * @date Août 2025
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calculator, TrendingUp, Users, DollarSign, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';

interface FERRAccount {
  id: string;
  name: string;
  currentValue: number;
  isSpouseFERR: boolean;
  conversionYear?: number;
}

interface FERRCalculation {
  age: number;
  minimumPercentage: number;
  minimumWithdrawal: number;
  spouseAgePercentage?: number;
  spouseMinimumWithdrawal?: number;
  potentialSavings: number;
  taxImpact: number;
}

interface FERROptimization {
  currentStrategy: {
    totalMinimumWithdrawal: number;
    estimatedTax: number;
    netIncome: number;
    svImpact: number;
    srgImpact: number;
  };
  optimizedStrategy: {
    totalMinimumWithdrawal: number;
    estimatedTax: number;
    netIncome: number;
    svImpact: number;
    srgImpact: number;
    pensionSplittingSavings: number;
  };
  recommendations: string[];
  annualSavings: number;
}

interface FERRModuleProps {
  userPlan: SubscriptionPlan;
  onUpgrade?: () => void;
}

export const FERROptimizationModule: React.FC<FERRModuleProps> = ({ userPlan, onUpgrade }) => {
  const [ferrAccounts, setFerrAccounts] = useState<FERRAccount[]>([]);
  const [userAge, setUserAge] = useState(71);
  const [spouseAge, setSpouseAge] = useState<number | undefined>(undefined);
  const [hasSpouse, setHasSpouse] = useState(false);
  const [annualIncome, setAnnualIncome] = useState(50000);
  const [spouseIncome, setSpouseIncome] = useState(30000);
  const [calculations, setCalculations] = useState<FERRCalculation[]>([]);
  const [optimization, setOptimization] = useState<FERROptimization | null>(null);
  const [activeTab, setActiveTab] = useState('calculator');

  // Accès selon le plan
  const hasFullAccess = userPlan === 'professional' || userPlan === 'expert';
  const hasAdvancedFeatures = userPlan === 'expert';

  // Tableau officiel des pourcentages minimums FERR (Gouvernement du Canada)
  const ferrMinimumPercentages: Record<number, number> = {
    71: 5.28, 72: 5.40, 73: 5.53, 74: 5.67, 75: 5.82, 76: 5.98, 77: 6.17, 78: 6.36,
    79: 6.58, 80: 6.82, 81: 7.08, 82: 7.38, 83: 7.71, 84: 8.08, 85: 8.51, 86: 8.99,
    87: 9.55, 88: 10.21, 89: 10.99, 90: 11.92, 91: 13.06, 92: 14.49, 93: 16.34,
    94: 18.79, 95: 20.00
  };

  useEffect(() => {
    // Initialiser avec un FERR par défaut
    setFerrAccounts([
      { id: '1', name: 'FERR Principal', currentValue: 300000, isSpouseFERR: false, conversionYear: 2024 }
    ]);
  }, []);

  const addFERRAccount = () => {
    const newAccount: FERRAccount = {
      id: Date.now().toString(),
      name: `FERR ${ferrAccounts.length + 1}`,
      currentValue: 0,
      isSpouseFERR: false
    };
    setFerrAccounts([...ferrAccounts, newAccount]);
  };

  const updateFERRAccount = (id: string, field: keyof FERRAccount, value: any) => {
    setFerrAccounts(ferrAccounts.map(account => 
      account.id === id ? { ...account, [field]: value } : account
    ));
  };

  const removeFERRAccount = (id: string) => {
    setFerrAccounts(ferrAccounts.filter(account => account.id !== id));
  };

  const getMinimumPercentage = (age: number): number => {
    if (age < 71) {
      // Formule pour avant 71 ans: 1 / (90 - âge)
      return (1 / (90 - age)) * 100;
    }
    return ferrMinimumPercentages[Math.min(age, 95)] || 20.00;
  };

  const calculateFERRWithdrawals = () => {
    const newCalculations: FERRCalculation[] = [];
    
    // Calculer pour les 10 prochaines années
    for (let yearOffset = 0; yearOffset < 10; yearOffset++) {
      const currentAge = userAge + yearOffset;
      const currentSpouseAge = spouseAge ? spouseAge + yearOffset : undefined;
      
      const minimumPercentage = getMinimumPercentage(currentAge);
      const spouseAgePercentage = currentSpouseAge ? getMinimumPercentage(currentSpouseAge) : undefined;
      
      const totalFERRValue = ferrAccounts.reduce((sum, account) => sum + account.currentValue, 0);
      const projectedValue = totalFERRValue * Math.pow(1.05, yearOffset); // 5% croissance assumée
      
      const minimumWithdrawal = (projectedValue * minimumPercentage) / 100;
      const spouseMinimumWithdrawal = spouseAgePercentage ? (projectedValue * spouseAgePercentage) / 100 : undefined;
      
      const potentialSavings = spouseMinimumWithdrawal ? minimumWithdrawal - spouseMinimumWithdrawal : 0;
      const taxImpact = potentialSavings * 0.35; // Taux marginal estimé
      
      newCalculations.push({
        age: currentAge,
        minimumPercentage,
        minimumWithdrawal,
        spouseAgePercentage,
        spouseMinimumWithdrawal,
        potentialSavings,
        taxImpact
      });
    }
    
    setCalculations(newCalculations);
    calculateOptimization(newCalculations);
  };

  const calculateOptimization = (calcs: FERRCalculation[]) => {
    const currentYearCalc = calcs[0];
    if (!currentYearCalc) return;

    // Stratégie actuelle (sans optimisation)
    const currentWithdrawal = currentYearCalc.minimumWithdrawal;
    const currentTax = currentWithdrawal * 0.35;
    const currentNetIncome = currentWithdrawal - currentTax;
    
    // Impact sur SV (récupération si revenu > 86,912$ en 2025)
    const totalIncome = annualIncome + currentWithdrawal;
    const svThreshold = 86912;
    const svImpact = totalIncome > svThreshold ? (totalIncome - svThreshold) * 0.15 : 0;
    
    // Impact sur SRG (perte si revenu > seuils)
    const srgThreshold = 22056;
    const srgImpact = totalIncome > srgThreshold ? Math.min(11000, (totalIncome - srgThreshold) * 0.5) : 0;

    // Stratégie optimisée (avec âge conjoint si applicable)
    const optimizedWithdrawal = hasSpouse && currentYearCalc.spouseMinimumWithdrawal 
      ? currentYearCalc.spouseMinimumWithdrawal 
      : currentWithdrawal;
    
    const optimizedTax = optimizedWithdrawal * 0.35;
    const optimizedNetIncome = optimizedWithdrawal - optimizedTax;
    
    const optimizedTotalIncome = annualIncome + optimizedWithdrawal;
    const optimizedSvImpact = optimizedTotalIncome > svThreshold ? (optimizedTotalIncome - svThreshold) * 0.15 : 0;
    const optimizedSrgImpact = optimizedTotalIncome > srgThreshold ? Math.min(11000, (optimizedTotalIncome - srgThreshold) * 0.5) : 0;
    
    // Fractionnement de pension (50% max à partir de 65 ans)
    const pensionSplittingSavings = hasSpouse ? calculatePensionSplittingSavings(optimizedWithdrawal, annualIncome, spouseIncome) : 0;

    const recommendations = generateRecommendations(currentYearCalc, hasSpouse, totalIncome);
    const annualSavings = (currentTax - optimizedTax) + (svImpact - optimizedSvImpact) + (srgImpact - optimizedSrgImpact) + pensionSplittingSavings;

    const newOptimization: FERROptimization = {
      currentStrategy: {
        totalMinimumWithdrawal: currentWithdrawal,
        estimatedTax: currentTax,
        netIncome: currentNetIncome,
        svImpact,
        srgImpact
      },
      optimizedStrategy: {
        totalMinimumWithdrawal: optimizedWithdrawal,
        estimatedTax: optimizedTax,
        netIncome: optimizedNetIncome,
        svImpact: optimizedSvImpact,
        srgImpact: optimizedSrgImpact,
        pensionSplittingSavings
      },
      recommendations,
      annualSavings
    };

    setOptimization(newOptimization);
  };

  const calculatePensionSplittingSavings = (pensionIncome: number, income1: number, income2: number): number => {
    if (userAge < 65) return 0; // Fractionnement seulement à partir de 65 ans
    
    const splittableAmount = pensionIncome * 0.5; // Maximum 50%
    const currentTax1 = income1 * 0.35;
    const currentTax2 = income2 * 0.25; // Taux plus bas assumé pour conjoint
    
    const optimizedIncome1 = income1 - splittableAmount;
    const optimizedIncome2 = income2 + splittableAmount;
    const optimizedTax1 = optimizedIncome1 * 0.30; // Taux réduit
    const optimizedTax2 = optimizedIncome2 * 0.30; // Taux équilibré
    
    return Math.max(0, (currentTax1 + currentTax2) - (optimizedTax1 + optimizedTax2));
  };

  const generateRecommendations = (calc: FERRCalculation, hasSpouse: boolean, totalIncome: number): string[] => {
    const recommendations: string[] = [];
    
    if (hasSpouse && calc.potentialSavings > 0) {
      recommendations.push(`Utilisez l'âge de votre conjoint pour réduire les retraits de ${calc.potentialSavings.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} annuellement`);
    }
    
    if (userAge >= 65) {
      recommendations.push('Activez le fractionnement de revenu de pension pour optimiser votre situation fiscale');
    }
    
    if (totalIncome > 86912) {
      recommendations.push('Attention: Votre revenu déclenche la récupération de la Sécurité de la vieillesse');
    }
    
    if (totalIncome > 22056) {
      recommendations.push('Votre revenu pourrait affecter votre admissibilité au Supplément de revenu garanti');
    }
    
    recommendations.push('Considérez reporter la conversion REER→FERR si vous n\'avez pas besoin des revenus immédiatement');
    
    return recommendations;
  };

  if (!hasFullAccess) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            FERR Optimisé - Stratégies Gouvernementales
            <Badge variant="secondary">AVANCÉ</Badge>
          </CardTitle>
          <CardDescription>
            Module d'optimisation FERR avec expertise gouvernementale complète
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Ce module avancé nécessite un plan Professionnel ou Expert pour accéder aux calculs FERR optimisés, stratégies d'âge conjoint et coordination des prestations gouvernementales.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={onUpgrade} className="w-full">
              Mettre à niveau pour l'optimisation FERR complète
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            FERR Optimisé - Stratégies Gouvernementales
            <Badge variant="secondary">GOUVERNEMENT DU CANADA</Badge>
          </CardTitle>
          <CardDescription>
            Optimisez vos retraits FERR avec les formules officielles et stratégies avancées
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Calculateur</TabsTrigger>
          <TabsTrigger value="optimization">Optimisation</TabsTrigger>
          <TabsTrigger value="spouse-strategy">Stratégie Conjoint</TabsTrigger>
          <TabsTrigger value="benefits-impact">Impact Prestations</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de Base</CardTitle>
              <CardDescription>
                Entrez vos informations pour calculer les retraits FERR optimaux
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="userAge">Votre âge</Label>
                  <Input
                    id="userAge"
                    type="number"
                    value={userAge}
                    onChange={(e) => setUserAge(Number(e.target.value))}
                    min={60}
                    max={95}
                  />
                </div>
                <div>
                  <Label htmlFor="annualIncome">Revenu annuel actuel</Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasSpouse"
                    checked={hasSpouse}
                    onChange={(e) => setHasSpouse(e.target.checked)}
                  />
                  <Label htmlFor="hasSpouse">J'ai un conjoint</Label>
                </div>
              </div>

              {hasSpouse && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-mpr-interactive-lt">
                  <div>
                    <Label htmlFor="spouseAge">Âge du conjoint</Label>
                    <Input
                      id="spouseAge"
                      type="number"
                      value={spouseAge || ''}
                      onChange={(e) => setSpouseAge(e.target.value ? Number(e.target.value) : undefined)}
                      min={60}
                      max={95}
                    />
                  </div>
                  <div>
                    <Label htmlFor="spouseIncome">Revenu annuel du conjoint</Label>
                    <Input
                      id="spouseIncome"
                      type="number"
                      value={spouseIncome}
                      onChange={(e) => setSpouseIncome(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vos Comptes FERR</CardTitle>
              <CardDescription>
                Ajoutez tous vos FERR pour une analyse complète
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ferrAccounts.map((account) => (
                <div key={account.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Nom du FERR</Label>
                    <Input
                      value={account.name}
                      onChange={(e) => updateFERRAccount(account.id, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Valeur actuelle</Label>
                    <Input
                      type="number"
                      value={account.currentValue}
                      onChange={(e) => updateFERRAccount(account.id, 'currentValue', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Année de conversion</Label>
                    <Input
                      type="number"
                      value={account.conversionYear || ''}
                      onChange={(e) => updateFERRAccount(account.id, 'conversionYear', e.target.value ? Number(e.target.value) : undefined)}
                      min={2020}
                      max={2030}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFERRAccount(account.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="flex gap-2">
                <Button onClick={addFERRAccount} variant="outline">
                  Ajouter un FERR
                </Button>
                <Button onClick={calculateFERRWithdrawals} className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Calculer Optimisation FERR
                </Button>
              </div>
            </CardContent>
          </Card>

          {calculations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Projections des Retraits Minimums</CardTitle>
                <CardDescription>
                  Basé sur les pourcentages officiels du Gouvernement du Canada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2">Âge</th>
                        <th className="border border-gray-300 p-2">% Minimum</th>
                        <th className="border border-gray-300 p-2">Retrait Minimum</th>
                        {hasSpouse && spouseAge && (
                          <>
                            <th className="border border-gray-300 p-2">% Conjoint</th>
                            <th className="border border-gray-300 p-2">Retrait avec Conjoint</th>
                            <th className="border border-gray-300 p-2">Économies</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {calculations.slice(0, 5).map((calc) => (
                        <tr key={calc.age}>
                          <td className="border border-gray-300 p-2 text-center">{calc.age}</td>
                          <td className="border border-gray-300 p-2 text-center">{calc.minimumPercentage.toFixed(2)}%</td>
                          <td className="border border-gray-300 p-2 text-right">
                            {calc.minimumWithdrawal.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </td>
                          {hasSpouse && spouseAge && (
                            <>
                              <td className="border border-gray-300 p-2 text-center">
                                {calc.spouseAgePercentage?.toFixed(2)}%
                              </td>
                              <td className="border border-gray-300 p-2 text-right">
                                {calc.spouseMinimumWithdrawal?.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                              </td>
                              <td className="border border-gray-300 p-2 text-right text-green-600 font-semibold">
                                {calc.potentialSavings.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          {optimization && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Comparaison des Stratégies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">Stratégie Actuelle</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Retrait minimum:</span>
                          <span className="font-semibold">
                            {optimization.currentStrategy.totalMinimumWithdrawal.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impôt estimé:</span>
                          <span className="text-red-600">
                            -{optimization.currentStrategy.estimatedTax.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenu net:</span>
                          <span className="font-semibold">
                            {optimization.currentStrategy.netIncome.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impact SV:</span>
                          <span className="text-red-600">
                            -{optimization.currentStrategy.svImpact.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-green-50">
                      <h3 className="font-semibold text-lg mb-3 text-green-800">Stratégie Optimisée</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Retrait minimum:</span>
                          <span className="font-semibold">
                            {optimization.optimizedStrategy.totalMinimumWithdrawal.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impôt estimé:</span>
                          <span className="text-red-600">
                            -{optimization.optimizedStrategy.estimatedTax.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenu net:</span>
                          <span className="font-semibold">
                            {optimization.optimizedStrategy.netIncome.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impact SV:</span>
                          <span className="text-red-600">
                            -{optimization.optimizedStrategy.svImpact.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fractionnement pension:</span>
                          <span className="text-green-600">
                            +{optimization.optimizedStrategy.pensionSplittingSavings.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-mpr-interactive-lt border border-mpr-border rounded-lg">
                    <h3 className="font-semibold text-lg text-mpr-navy mb-2">Économies Annuelles Totales</h3>
                    <p className="text-3xl font-bold text-mpr-interactive">
                      {optimization.annualSavings.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Économies combinées d'impôt, prestations et fractionnement
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommandations Personnalisées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {optimization.recommendations.map((recommendation, index) => (
                      <Alert key={index}>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{recommendation}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="spouse-strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Stratégie Âge du Conjoint
              </CardTitle>
              <CardDescription>
                Utilisez l'âge de votre conjoint pour minimiser les retraits FERR
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!hasSpouse ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Activez l'option "J'ai un conjoint" dans l'onglet Calculateur pour accéder à cette stratégie.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Comment ça fonctionne</h3>
                    <p className="text-gray-700 mb-4">
                      Vous pouvez baser le calcul de vos retraits FERR minimums sur l'âge de votre conjoint 
                      plutôt que sur le vôtre. Si votre conjoint est plus jeune, cela réduit le pourcentage 
                      de retrait minimum et vous permet de reporter l'impôt plus longtemps.
                    </p>
                    
                    {spouseAge && userAge && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-semibold">Votre âge: {userAge} ans</h4>
                          <p className="text-sm text-gray-600">
                            Pourcentage minimum: {getMinimumPercentage(userAge).toFixed(2)}%
                          </p>
                        </div>
                        <div className="p-3 border rounded-lg bg-green-50">
                          <h4 className="font-semibold">Âge conjoint: {spouseAge} ans</h4>
                          <p className="text-sm text-gray-600">
                            Pourcentage minimum: {getMinimumPercentage(spouseAge).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Important:</strong> Cette décision est permanente une fois prise. 
                        Consultez un professionnel avant de faire ce choix.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits-impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Impact sur les Prestations Gouvernementales
              </CardTitle>
              <CardDescription>
                Analysez l'impact de vos retraits FERR sur SV, SRG et autres prestations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Sécurité de la vieillesse (SV)</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Récupération si revenu net &gt; 86 912$ (2025)
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Revenu total estimé:</span>
                        <span>{(annualIncome + (calculations[0]?.minimumWithdrawal || 0)).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Récupération SV:</span>
                        <span className="text-red-600">
                          -{Math.max(0, (annualIncome + (calculations[0]?.minimumWithdrawal || 0) - 86912) * 0.15).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Supplément de revenu garanti (SRG)</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Réduction si revenu > 22 056$ (2025)
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Revenu admissible:</span>
                        <span>{(annualIncome + (calculations[0]?.minimumWithdrawal || 0)).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Réduction SRG:</span>
                        <span className="text-red-600">
                          -{Math.min(11000, Math.max(0, (annualIncome + (calculations[0]?.minimumWithdrawal || 0) - 22056) * 0.5)).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Stratégie recommandée:</strong> Si vous êtes proche des seuils de récupération, 
                    considérez étaler vos retraits sur plusieurs années ou utiliser l'âge de votre conjoint 
                    pour réduire les montants minimums.
                  </AlertDescription>
                </Alert>

                {hasAdvancedFeatures && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Simulation Avancée - Impact sur 10 ans</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 p-2">Année</th>
                              <th className="border border-gray-300 p-2">Retrait FERR</th>
                              <th className="border border-gray-300 p-2">Revenu Total</th>
                              <th className="border border-gray-300 p-2">Récupération SV</th>
                              <th className="border border-gray-300 p-2">Impact SRG</th>
                            </tr>
                          </thead>
                          <tbody>
                            {calculations.slice(0, 5).map((calc, index) => {
                              const totalIncome = annualIncome + calc.minimumWithdrawal;
                              const svRecovery = Math.max(0, (totalIncome - 86912) * 0.15);
                              const srgImpact = Math.min(11000, Math.max(0, (totalIncome - 22056) * 0.5));
                              
                              return (
                                <tr key={index}>
                                  <td className="border border-gray-300 p-2 text-center">{2025 + index}</td>
                                  <td className="border border-gray-300 p-2 text-right">
                                    {calc.minimumWithdrawal.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                                  </td>
                                  <td className="border border-gray-300 p-2 text-right">
                                    {totalIncome.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                                  </td>
                                  <td className="border border-gray-300 p-2 text-right text-red-600">
                                    -{svRecovery.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                                  </td>
                                  <td className="border border-gray-300 p-2 text-right text-red-600">
                                    -{srgImpact.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FERROptimizationModule;
