// src/components/ui/CELIAPPModule.tsx
/**
 * MODULE CELIAPP - Compte d'Épargne Libre d'Impôt pour l'Achat d'une Première Propriété
 * 
 * Module critique identifié dans l'analyse gouvernementale
 * Implémente les règles officielles du Gouvernement du Canada (2023+)
 * 
 * Fonctionnalités:
 * - Calcul des limites de cotisation (8 000$ annuel, 40 000$ à vie)
 * - Comparaison avec RAP traditionnel
 * - Optimisation fiscale pour premiers acheteurs
 * - Planification des délais d'achat
 * - Intégration avec stratégies immobilières
 * 
 * @author MonPlanRetraite.ca
 * @version 1.0.0 - Implémentation Gouvernementale
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
import { Calculator, Home, TrendingUp, Info, AlertTriangle, CheckCircle, Calendar, BookOpen, DollarSign } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';

interface CELIAPPAccount {
  id: string;
  name: string;
  currentBalance: number;
  contributionsThisYear: number;
  totalContributions: number;
  openingYear: number;
}

interface CELIAPPCalculation {
  availableContributionRoom: number;
  maxAnnualContribution: number;
  lifetimeLimit: number;
  yearsRemaining: number;
  projectedBalance: number;
  taxSavings: number;
}

interface CELIAPPComparison {
  celiapp: {
    totalSavings: number;
    taxDeduction: number;
    withdrawalFlexibility: string;
    repaymentRequired: boolean;
  };
  rap: {
    totalSavings: number;
    taxDeduction: number;
    withdrawalFlexibility: string;
    repaymentRequired: boolean;
    repaymentPeriod: number;
  };
  recommendation: string;
  advantageCELIAPP: number;
}

interface CELIAPPModuleProps {
  userPlan: SubscriptionPlan;
  onUpgrade?: () => void;
}

export const CELIAPPModule: React.FC<CELIAPPModuleProps> = ({ userPlan, onUpgrade }) => {
  const [celiappAccounts, setCeliappAccounts] = useState<CELIAPPAccount[]>([]);
  const [userAge, setUserAge] = useState(25);
  const [annualIncome, setAnnualIncome] = useState(60000);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(true);
  const [targetPurchaseYear, setTargetPurchaseYear] = useState(2027);
  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [currentRRSP, setCurrentRRSP] = useState(25000);
  const [calculations, setCalculations] = useState<CELIAPPCalculation | null>(null);
  const [comparison, setComparison] = useState<CELIAPPComparison | null>(null);
  const [activeTab, setActiveTab] = useState('calculator');

  // Constantes officielles CELIAPP
  const CELIAPP_ANNUAL_LIMIT = 8000; // 2025
  const CELIAPP_LIFETIME_LIMIT = 40000;
  const CELIAPP_MAX_PARTICIPATION_YEARS = 15;
  const CELIAPP_MAX_AGE = 71;
  const RAP_LIMIT = 60000; // Par conjoint

  // Accès selon le plan
  const hasFullAccess = userPlan === 'professional' || userPlan === 'expert';
  const hasAdvancedFeatures = userPlan === 'expert';

  useEffect(() => {
    // Initialiser avec un compte CELIAPP par défaut si premier acheteur
    if (isFirstTimeBuyer) {
      setCeliappAccounts([
        { 
          id: '1', 
          name: 'CELIAPP Principal', 
          currentBalance: 5000, 
          contributionsThisYear: 5000,
          totalContributions: 5000,
          openingYear: 2024 
        }
      ]);
    }
  }, [isFirstTimeBuyer]);

  const addCELIAPPAccount = () => {
    const newAccount: CELIAPPAccount = {
      id: Date.now().toString(),
      name: `CELIAPP ${celiappAccounts.length + 1}`,
      currentBalance: 0,
      contributionsThisYear: 0,
      totalContributions: 0,
      openingYear: 2025
    };
    setCeliappAccounts([...celiappAccounts, newAccount]);
  };

  const updateCELIAPPAccount = (id: string, field: keyof CELIAPPAccount, value: any) => {
    setCeliappAccounts(celiappAccounts.map(account => 
      account.id === id ? { ...account, [field]: value } : account
    ));
  };

  const removeCELIAPPAccount = (id: string) => {
    setCeliappAccounts(celiappAccounts.filter(account => account.id !== id));
  };

  const calculateCELIAPP = () => {
    const currentYear = 2025;
    const totalContributions = celiappAccounts.reduce((sum, account) => sum + account.totalContributions, 0);
    const totalBalance = celiappAccounts.reduce((sum, account) => sum + account.currentBalance, 0);
    
    const availableContributionRoom = Math.max(0, CELIAPP_LIFETIME_LIMIT - totalContributions);
    const yearsToTarget = Math.max(0, targetPurchaseYear - currentYear);
    const maxPossibleContributions = Math.min(
      availableContributionRoom,
      yearsToTarget * CELIAPP_ANNUAL_LIMIT
    );
    
    // Projection avec croissance de 5% annuelle
    const projectedBalance = totalBalance * Math.pow(1.05, yearsToTarget) + 
      (maxPossibleContributions * ((Math.pow(1.05, yearsToTarget) - 1) / 0.05));
    
    const taxRate = annualIncome > 50000 ? 0.35 : 0.25;
    const taxSavings = maxPossibleContributions * taxRate;

    const newCalculations: CELIAPPCalculation = {
      availableContributionRoom,
      maxAnnualContribution: CELIAPP_ANNUAL_LIMIT,
      lifetimeLimit: CELIAPP_LIFETIME_LIMIT,
      yearsRemaining: Math.max(0, CELIAPP_MAX_PARTICIPATION_YEARS - (currentYear - Math.min(...celiappAccounts.map(a => a.openingYear)))),
      projectedBalance,
      taxSavings
    };

    setCalculations(newCalculations);
    calculateComparison(newCalculations, totalBalance);
  };

  const calculateComparison = (celiappCalc: CELIAPPCalculation, currentCELIAPPBalance: number) => {
    const downPaymentNeeded = homePrice * (downPaymentPercent / 100);
    const taxRate = annualIncome > 50000 ? 0.35 : 0.25;
    
    // Stratégie CELIAPP
    const celiappWithdrawal = Math.min(celiappCalc.projectedBalance, downPaymentNeeded);
    const celiappTaxDeduction = Math.min(celiappCalc.availableContributionRoom, downPaymentNeeded) * taxRate;
    
    // Stratégie RAP
    const rapWithdrawal = Math.min(currentRRSP, RAP_LIMIT, downPaymentNeeded);
    const rapTaxDeduction = 0; // Pas de déduction supplémentaire pour RAP
    const rapRepaymentPeriod = 15; // 15 ans pour rembourser
    const rapAnnualRepayment = rapWithdrawal / rapRepaymentPeriod;
    
    const advantageCELIAPP = celiappTaxDeduction + (rapAnnualRepayment * 10); // Valeur du non-remboursement sur 10 ans
    
    let recommendation = '';
    if (celiappWithdrawal >= downPaymentNeeded * 0.8) {
      recommendation = 'CELIAPP RECOMMANDÉ: Couvre la majorité de votre mise de fonds avec avantages fiscaux supérieurs';
    } else if (rapWithdrawal >= downPaymentNeeded * 0.8) {
      recommendation = 'STRATÉGIE MIXTE: Utilisez CELIAPP + RAP pour maximiser votre mise de fonds';
    } else {
      recommendation = 'PLANIFICATION REQUISE: Augmentez votre épargne ou reportez l\'achat pour optimiser les avantages';
    }

    const newComparison: CELIAPPComparison = {
      celiapp: {
        totalSavings: celiappWithdrawal,
        taxDeduction: celiappTaxDeduction,
        withdrawalFlexibility: 'Retrait libre sans remboursement',
        repaymentRequired: false
      },
      rap: {
        totalSavings: rapWithdrawal,
        taxDeduction: rapTaxDeduction,
        withdrawalFlexibility: 'Retrait temporaire avec remboursement obligatoire',
        repaymentRequired: true,
        repaymentPeriod: rapRepaymentPeriod
      },
      recommendation,
      advantageCELIAPP
    };

    setComparison(newComparison);
  };

  if (!hasFullAccess) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            CELIAPP - Première Propriété
            <Badge variant="secondary">NOUVEAU 2023</Badge>
          </CardTitle>
          <CardDescription>
            Module gouvernemental pour optimiser votre stratégie d'achat de première propriété
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Ce module avancé nécessite un plan Professionnel ou Expert pour accéder aux calculs CELIAPP complets, comparaisons avec RAP et stratégies d'optimisation immobilière.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={onUpgrade} className="w-full">
              Mettre à niveau pour accéder au module CELIAPP
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
            <Home className="h-5 w-5" />
            CELIAPP - Première Propriété
            <Badge variant="secondary">GOUVERNEMENT DU CANADA 2023+</Badge>
          </CardTitle>
          <CardDescription>
            Optimisez votre stratégie d'achat de première propriété avec le nouveau CELIAPP
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Calculateur</TabsTrigger>
          <TabsTrigger value="comparison">CELIAPP vs RAP</TabsTrigger>
          <TabsTrigger value="strategy">Stratégie</TabsTrigger>
          <TabsTrigger value="education">Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Votre Profil d'Acheteur</CardTitle>
              <CardDescription>
                Configurez votre situation pour calculer les avantages CELIAPP
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
                    min={18}
                    max={71}
                  />
                </div>
                <div>
                  <Label htmlFor="annualIncome">Revenu annuel</Label>
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
                    id="isFirstTimeBuyer"
                    checked={isFirstTimeBuyer}
                    onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
                    aria-label="Premier acheteur"
                  />
                  <Label htmlFor="isFirstTimeBuyer">Premier acheteur</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="homePrice">Prix de la propriété visée</Label>
                  <Input
                    id="homePrice"
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="downPaymentPercent">Mise de fonds (%)</Label>
                  <Input
                    id="downPaymentPercent"
                    type="number"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    min={5}
                    max={25}
                  />
                </div>
                <div>
                  <Label htmlFor="targetPurchaseYear">Année d'achat prévue</Label>
                  <Input
                    id="targetPurchaseYear"
                    type="number"
                    value={targetPurchaseYear}
                    onChange={(e) => setTargetPurchaseYear(Number(e.target.value))}
                    min={2025}
                    max={2035}
                  />
                </div>
              </div>

              <div className="p-4 bg-mpr-interactive-lt border border-mpr-border rounded-lg">
                <h3 className="font-semibold mb-2">Mise de fonds requise</h3>
                <p className="text-2xl font-bold text-mpr-interactive">
                  {(homePrice * (downPaymentPercent / 100)).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                </p>
              </div>
            </CardContent>
          </Card>

          {isFirstTimeBuyer && (
            <Card>
              <CardHeader>
                <CardTitle>Vos Comptes CELIAPP</CardTitle>
                <CardDescription>
                  Gérez vos comptes CELIAPP pour optimiser votre épargne
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {celiappAccounts.map((account) => (
                  <div key={account.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Nom du compte</Label>
                      <Input
                        value={account.name}
                        onChange={(e) => updateCELIAPPAccount(account.id, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Solde actuel</Label>
                      <Input
                        type="number"
                        value={account.currentBalance}
                        onChange={(e) => updateCELIAPPAccount(account.id, 'currentBalance', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Cotisations 2025</Label>
                      <Input
                        type="number"
                        value={account.contributionsThisYear}
                        onChange={(e) => updateCELIAPPAccount(account.id, 'contributionsThisYear', Number(e.target.value))}
                        max={CELIAPP_ANNUAL_LIMIT}
                      />
                    </div>
                    <div>
                      <Label>Année d'ouverture</Label>
                      <Input
                        type="number"
                        value={account.openingYear}
                        onChange={(e) => updateCELIAPPAccount(account.id, 'openingYear', Number(e.target.value))}
                        min={2023}
                        max={2025}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeCELIAPPAccount(account.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-2">
                  <Button onClick={addCELIAPPAccount} variant="outline">
                    Ajouter un CELIAPP
                  </Button>
                  <Button onClick={calculateCELIAPP} className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Calculer Stratégie CELIAPP
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {calculations && (
            <Card>
              <CardHeader>
                <CardTitle>Résultats CELIAPP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <Label>Droits de cotisation disponibles</Label>
                    <p className="text-2xl font-bold text-green-600">
                      {calculations.availableContributionRoom.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Label>Solde projeté à l'achat</Label>
                    <p className="text-2xl font-bold text-mpr-interactive">
                      {calculations.projectedBalance.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Label>Économies d'impôt estimées</Label>
                    <p className="text-2xl font-bold text-purple-600">
                      {calculations.taxSavings.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label>Utilisation du plafond à vie</Label>
                  <Progress 
                    value={(celiappAccounts.reduce((sum, acc) => sum + acc.totalContributions, 0) / CELIAPP_LIFETIME_LIMIT) * 100} 
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    {celiappAccounts.reduce((sum, acc) => sum + acc.totalContributions, 0).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} / {CELIAPP_LIFETIME_LIMIT.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {comparison ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    CELIAPP vs RAP - Comparaison Détaillée
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg bg-green-50">
                      <h3 className="font-semibold text-lg mb-3 text-green-800">CELIAPP (Nouveau)</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Montant disponible:</span>
                          <span className="font-semibold">
                            {comparison.celiapp.totalSavings.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Déduction fiscale:</span>
                          <span className="text-green-600">
                            +{comparison.celiapp.taxDeduction.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><strong>Flexibilité:</strong> {comparison.celiapp.withdrawalFlexibility}</p>
                          <p><strong>Remboursement:</strong> {comparison.celiapp.repaymentRequired ? 'Requis' : 'Aucun'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">RAP (Traditionnel)</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Montant disponible:</span>
                          <span className="font-semibold">
                            {comparison.rap.totalSavings.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Déduction fiscale:</span>
                          <span className="text-gray-600">
                            {comparison.rap.taxDeduction.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><strong>Flexibilité:</strong> {comparison.rap.withdrawalFlexibility}</p>
                          <p><strong>Remboursement:</strong> {comparison.rap.repaymentPeriod} ans</p>
                          <p><strong>Paiement annuel:</strong> {(comparison.rap.totalSavings / comparison.rap.repaymentPeriod).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert className="mt-6">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recommandation:</strong> {comparison.recommendation}
                    </AlertDescription>
                  </Alert>

                  <div className="mt-4 p-4 bg-mpr-interactive-lt border border-mpr-border rounded-lg">
                    <h3 className="font-semibold text-lg text-mpr-navy mb-2">Avantage CELIAPP</h3>
                    <p className="text-3xl font-bold text-mpr-interactive">
                      {comparison.advantageCELIAPP.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Économies totales vs RAP traditionnel
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tableau Comparatif Détaillé</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-3 text-left">Critère</th>
                          <th className="border border-gray-300 p-3 text-center">CELIAPP</th>
                          <th className="border border-gray-300 p-3 text-center">RAP</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-3 font-semibold">Limite de retrait</td>
                          <td className="border border-gray-300 p-3 text-center">40 000$ (à vie)</td>
                          <td className="border border-gray-300 p-3 text-center">60 000$ (par conjoint)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-semibold">Déduction fiscale</td>
                          <td className="border border-gray-300 p-3 text-center text-green-600">✓ Oui</td>
                          <td className="border border-gray-300 p-3 text-center text-red-600">✗ Non</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-semibold">Remboursement obligatoire</td>
                          <td className="border border-gray-300 p-3 text-center text-green-600">✗ Non</td>
                          <td className="border border-gray-300 p-3 text-center text-red-600">✓ 15 ans</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-semibold">Croissance libre d'impôt</td>
                          <td className="border border-gray-300 p-3 text-center text-green-600">✓ Oui</td>
                          <td className="border border-gray-300 p-3 text-center text-green-600">✓ Oui</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-semibold">Pénalité si non-remboursé</td>
                          <td className="border border-gray-300 p-3 text-center text-green-600">✗ Aucune</td>
                          <td className="border border-gray-300 p-3 text-center text-red-600">✓ Imposable</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Calculez d'abord votre stratégie CELIAPP dans l'onglet Calculateur pour voir la comparaison détaillée.</p>
                <Button onClick={() => setActiveTab('calculator')} className="mt-4">
                  Aller au Calculateur
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Stratégie d'Épargne Optimisée
              </CardTitle>
              <CardDescription>
                Plan personnalisé pour maximiser vos avantages CELIAPP
              </CardDescription>
            </CardHeader>
            <CardContent>
              {calculations ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <h3 className="font-semibold mb-2">Plan d'Épargne Recommandé</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Cotisation annuelle optimale:</p>
                        <p className="text-xl font-bold">
                          {Math.min(CELIAPP_ANNUAL_LIMIT, calculations.availableContributionRoom / Math.max(1, targetPurchaseYear - 2025)).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Économie fiscale annuelle:</p>
                        <p className="text-xl font-bold text-green-600">
                          {(Math.min(CELIAPP_ANNUAL_LIMIT, calculations.availableContributionRoom / Math.max(1, targetPurchaseYear - 2025)) * (annualIncome > 50000 ? 0.35 : 0.25)).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Conseil:</strong> Maximisez vos cotisations CELIAPP avant de considérer d'autres véhicules d'épargne pour l'achat immobilier.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Stratégie Court Terme (1-3 ans)</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Maximiser cotisations annuelles CELIAPP</li>
                        <li>• Placements conservateurs (CPG, obligations)</li>
                        <li>• Éviter volatilité avant achat</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Stratégie Long Terme (4+ ans)</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Diversification avec fonds équilibrés</li>
                        <li>• Croissance potentielle plus élevée</li>
                        <li>• Réajustement progressif vers conservateur</li>
                      </ul>
                    </div>
                  </div>

                  {hasAdvancedFeatures && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">Stratégie Expert</h3>
                      <div className="space-y-2 text-sm">
                        <p>• <strong>Fractionnement familial:</strong> Considérez ouvrir CELIAPP pour conjoint éligible</p>
                        <p>• <strong>Optimisation fiscale:</strong> Coordonnez avec REER pour maximiser déductions</p>
                        <p>• <strong>Planification succession:</strong> CELIAPP non imposable au décès</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600">Calculez d'abord votre stratégie CELIAPP dans l'onglet Calculateur pour voir le plan d'épargne personnalisé.</p>
                    <Button onClick={() => setActiveTab('calculator')} className="mt-4">
                      Aller au Calculateur
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Guide CELIAPP - Gouvernement du Canada
              </CardTitle>
              <CardDescription>
                Tout ce que vous devez savoir sur le nouveau compte d'épargne pour première propriété
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Qu'est-ce que le CELIAPP?</h3>
                  <div className="space-y-2 text-sm">
                    <p>Le Compte d'épargne libre d'impôt pour l'achat d'une première propriété (CELIAPP) est un nouveau véhicule d'épargne enregistré introduit par le gouvernement du Canada en 2023.</p>
                    <p><strong>Avantages uniques:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Déduction fiscale sur les cotisations (comme REER)</li>
                      <li>Croissance libre d'impôt (comme CELI)</li>
                      <li>Retraits libres d'impôt pour achat de première propriété</li>
                      <li>Aucun remboursement requis</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Limites et Règles</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Limites de cotisation:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>8 000$ par année (2025)</li>
                      <li>40 000$ maximum à vie</li>
                      <li>Période de participation: 15 ans maximum</li>
                      <li>Âge limite: 71 ans</li>
                    </ul>
                    <p><strong>Conditions d'admissibilité:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Résident canadien âgé de 18 ans ou plus</li>
                      <li>Premier acheteur (aucune propriété dans les 4 dernières années)</li>
                      <li>Achat au Canada seulement</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-mpr-interactive-lt border border-mpr-border rounded-lg">
                <h3 className="font-semibold text-mpr-navy mb-2">Comparaison avec autres programmes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Programme</th>
                        <th className="text-left p-2">Limite</th>
                        <th className="text-left p-2">Déduction</th>
                        <th className="text-left p-2">Remboursement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-semibold">CELIAPP</td>
                        <td className="p-2">40 000$</td>
                        <td className="p-2 text-green-600">✓ Oui</td>
                        <td className="p-2 text-green-600">✗ Non</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">RAP</td>
                        <td className="p-2">60 000$</td>
                        <td className="p-2 text-red-600">✗ Non</td>
                        <td className="p-2 text-red-600">✓ 15 ans</td>
                      </tr>
                      <tr>
                        <td className="p-2">CELI</td>
                        <td className="p-2">Selon droits</td>
                        <td className="p-2 text-red-600">✗ Non</td>
                        <td className="p-2 text-green-600">✗ Non</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Questions Fréquentes</h3>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Puis-je utiliser CELIAPP et RAP ensemble?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Oui! Vous pouvez combiner les deux programmes pour maximiser votre mise de fonds. C'est souvent la stratégie optimale.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Que se passe-t-il si je n'achète pas de propriété?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Vous avez 15 ans pour utiliser les fonds. Sinon, le CELIAPP doit être fermé et les fonds transférés vers REER/FERR ou retirés (imposables).
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm">Puis-je cotiser après avoir acheté une propriété?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Non, le CELIAPP doit être fermé l'année suivant votre premier retrait admissible pour l'achat d'une propriété.
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <DollarSign className="h-4 w-4" />
                <AlertDescription>
                  <strong>Conseil d'expert:</strong> Le CELIAPP représente une opportunité unique combinant les avantages du REER et du CELI. Pour la plupart des premiers acheteurs, il devrait être priorisé avant les autres véhicules d'épargne immobilière.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
