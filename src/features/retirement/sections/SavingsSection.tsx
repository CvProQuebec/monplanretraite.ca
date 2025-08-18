// src/features/retirement/sections/SavingsSection.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  PiggyBank, 
  TrendingUp, 
  Home, 
  Info, 
  Calculator,
  Target,
  Shield,
  Zap,
  BarChart3
} from 'lucide-react';
import { UserData } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SavingsSectionProps {
  data: UserData;
  onUpdate: (section: keyof UserData, updates: any) => void;
}

export const SavingsSection: React.FC<SavingsSectionProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('comptes');
  const [showHelp, setShowHelp] = useState(false);

  // Détection simple de la langue depuis l'URL
  const isFrench = window.location.pathname.includes('/fr/') || !window.location.pathname.includes('/en/');

  const handleChange = (field: string, value: any) => {
    onUpdate('savings', { [field]: value });
  };

  // Calculs pour le sommaire
  const totalEpargne = (data.savings.reer1 || 0) + (data.savings.reer2 || 0) + 
                      (data.savings.celi1 || 0) + (data.savings.celi2 || 0) + 
                      (data.savings.placements1 || 0) + (data.savings.placements2 || 0) + 
                      (data.savings.epargne1 || 0) + (data.savings.epargne2 || 0) + 
                      (data.savings.cri1 || 0) + (data.savings.cri2 || 0);

  const valeurNetResidence = (data.savings.residenceValeur || 0) - (data.savings.residenceHypotheque || 0);
  const patrimoineTotal = totalEpargne + valeurNetResidence;

  // Objectifs d'épargne (exemples)
  const objectifRetraite = 1000000; // 1M$
  const progressionEpargne = Math.min(100, (totalEpargne / objectifRetraite) * 100);

  return (
    <div className="space-y-6">
      {/* En-tête avec aide */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
            <PiggyBank className="w-6 h-6 text-gold-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900">
              {isFrench ? 'Épargne et placements' : 'Savings and Investments'}
            </h1>
            <p className="text-lg text-charcoal-600 mt-1">
              {isFrench 
                ? 'Gérez votre épargne et optimisez vos investissements pour la retraite'
                : 'Manage your savings and optimize your investments for retirement'
              }
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Info className="w-4 h-4 inline mr-2" />
          {isFrench ? 'Aide' : 'Help'}
        </button>
      </div>

      {/* Message d'aide */}
      {showHelp && (
        <Alert className="border-gold-200 bg-gold-50">
          <Info className="h-5 w-5 text-gold-600" />
          <AlertDescription className="text-gold-800">
            <strong>{isFrench ? 'Conseils d\'épargne :' : 'Savings Tips:'}</strong> {isFrench 
              ? 'Remplissez vos comptes d\'épargne et placements. Les REER offrent des avantages fiscaux immédiats, les CELI permettent des retraits libres d\'impôt, et les placements non enregistrés offrent de la flexibilité.'
              : 'Fill in your savings and investment accounts. RRSPs offer immediate tax benefits, TFSAs allow tax-free withdrawals, and non-registered investments offer flexibility.'
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-gold-500">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{isFrench ? 'Total épargne' : 'Total Savings'}</p>
              <p className="text-2xl font-bold text-gold-600">{formatCurrency(totalEpargne)}</p>
              <p className="text-xs text-gray-500">{isFrench ? 'Comptes enregistrés et non enregistrés' : 'Registered and non-registered accounts'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-sapphire-500">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{isFrench ? 'Valeur nette résidence' : 'Net Home Value'}</p>
              <p className="text-2xl font-bold text-sapphire-600">{formatCurrency(valeurNetResidence)}</p>
              <p className="text-xs text-gray-500">{isFrench ? 'Valeur - Hypothèque' : 'Value - Mortgage'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{isFrench ? 'Patrimoine total' : 'Total Net Worth'}</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(patrimoineTotal)}</p>
              <p className="text-xs text-gray-500">{isFrench ? 'Épargne + Résidence nette' : 'Savings + Net Home'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-charcoal-500">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{isFrench ? 'Progression objectif' : 'Goal Progress'}</p>
              <div className="flex items-center gap-2">
                <Progress value={progressionEpargne} className="flex-1 h-2" />
                <span className="text-sm font-semibold">{progressionEpargne.toFixed(1)}%</span>
              </div>
              <p className="text-xs text-gray-500">{isFrench ? 'Vers 1M$ de retraite' : 'Towards $1M retirement'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation par onglets */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg h-10">
              <TabsTrigger 
                value="comptes" 
                className="data-[state=active]:bg-gold-500 data-[state=active]:text-charcoal-900 data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium"
              >
                {isFrench ? 'Comptes d\'épargne' : 'Savings Accounts'}
              </TabsTrigger>
              <TabsTrigger 
                value="residence"
                className="data-[state=active]:bg-sapphire-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium"
              >
                {isFrench ? 'Résidence principale' : 'Primary Residence'}
              </TabsTrigger>
              <TabsTrigger 
                value="analyse"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm focus:outline-none focus:ring-0 px-3 py-1 text-sm font-medium"
              >
                {isFrench ? 'Analyse et conseils' : 'Analysis & Advice'}
              </TabsTrigger>
            </TabsList>

            {/* Onglet Comptes d'épargne */}
            <TabsContent value="comptes" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personne 1 */}
                <Card className="border-l-4 border-l-gold-500">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {data.personal.prenom1 || (isFrench ? 'Personne 1' : 'Person 1')} - {isFrench ? 'Comptes d\'épargne' : 'Savings Accounts'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        {isFrench ? 'REER' : 'RRSP'}
                      </Label>
                      <Input
                        type="number"
                        value={data.savings.reer1 || ''}
                        onChange={(e) => handleChange('reer1', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                      <p className="text-xs text-gray-600">
                        {isFrench ? 'Avantages fiscaux immédiats' : 'Immediate tax benefits'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-green-500" />
                        {isFrench ? 'CELI' : 'TFSA'}
                      </Label>
                      <Input
                        type="number"
                        value={data.savings.celi1 || ''}
                        onChange={(e) => handleChange('celi1', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                      <p className="text-xs text-gray-600">
                        {isFrench ? 'Retraits libres d\'impôt' : 'Tax-free withdrawals'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-500" />
                        {isFrench ? 'Placements non enregistrés' : 'Non-registered Investments'}
                      </Label>
                      <Input
                        type="number"
                        value={data.savings.placements1 || ''}
                        onChange={(e) => handleChange('placements1', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                      <p className="text-xs text-gray-600">
                        {isFrench ? 'Flexibilité maximale' : 'Maximum flexibility'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <PiggyBank className="w-4 h-4 text-orange-500" />
                        {isFrench ? 'Épargne régulière' : 'Regular Savings'}
                      </Label>
                      <Input
                        type="number"
                        value={data.savings.epargne1 || ''}
                        onChange={(e) => handleChange('epargne1', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                      <p className="text-xs text-gray-600">
                        {isFrench ? 'Comptes bancaires, etc.' : 'Bank accounts, etc.'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-red-500" />
                        {isFrench ? 'CRI (si applicable)' : 'LIRA (if applicable)'}
                      </Label>
                      <Input
                        type="number"
                        value={data.savings.cri1 || ''}
                        onChange={(e) => handleChange('cri1', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                      <p className="text-xs text-gray-600">
                        {isFrench ? 'Compte de retraite immobilisé' : 'Locked-in retirement account'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Personne 2 */}
                {data.personal.prenom2 && (
                  <Card className="border-l-4 border-l-gold-500">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {data.personal.prenom2} - {isFrench ? 'Comptes d\'épargne' : 'Savings Accounts'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          {isFrench ? 'REER' : 'RRSP'}
                        </Label>
                        <Input
                          type="number"
                          value={data.savings.reer2 || ''}
                          onChange={(e) => handleChange('reer2', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="text-lg p-3"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-green-500" />
                          {isFrench ? 'CELI' : 'TFSA'}
                        </Label>
                        <Input
                          type="number"
                          value={data.savings.celi2 || ''}
                          onChange={(e) => handleChange('celi2', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="text-lg p-3"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-purple-500" />
                          {isFrench ? 'Placements non enregistrés' : 'Non-registered Investments'}
                        </Label>
                        <Input
                          type="number"
                          value={data.savings.placements2 || ''}
                          onChange={(e) => handleChange('placements2', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="text-lg p-3"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <PiggyBank className="w-4 h-4 text-orange-500" />
                          {isFrench ? 'Épargne régulière' : 'Regular Savings'}
                        </Label>
                        <Input
                          type="number"
                          value={data.savings.epargne2 || ''}
                          onChange={(e) => handleChange('epargne2', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="text-lg p-3"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-red-500" />
                          {isFrench ? 'CRI (si applicable)' : 'LIRA (if applicable)'}
                        </Label>
                        <Input
                          type="number"
                          value={data.savings.cri2 || ''}
                          onChange={(e) => handleChange('cri2', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="text-lg p-3"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Onglet Résidence principale */}
            <TabsContent value="residence" className="space-y-6 mt-6">
              <Card className="border-l-4 border-l-sapphire-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Home className="w-5 h-5 text-sapphire-500" />
                    {isFrench ? 'Résidence principale' : 'Primary Residence'}
                  </CardTitle>
                  <CardDescription>
                    {isFrench ? 'Votre résidence principale fait partie de votre patrimoine de retraite' : 'Your primary residence is part of your retirement net worth'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>{isFrench ? 'Valeur estimée de la résidence' : 'Estimated Home Value'}</Label>
                      <Input
                        type="number"
                        value={data.savings.residenceValeur || ''}
                        onChange={(e) => handleChange('residenceValeur', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                      <p className="text-xs text-gray-600">{isFrench ? 'Valeur marchande actuelle' : 'Current market value'}</p>
                    </div>

                    <div className="space-y-2">
                      <Label>{isFrench ? 'Solde hypothécaire restant' : 'Remaining Mortgage Balance'}</Label>
                      <Input
                        type="number"
                        value={data.savings.residenceHypotheque || ''}
                        onChange={(e) => handleChange('residenceHypotheque', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="text-lg p-3"
                      />
                      <p className="text-xs text-gray-600">{isFrench ? 'Montant restant à payer' : 'Amount remaining to pay'}</p>
                    </div>
                  </div>

                  {/* Résumé résidence */}
                  <Card className="bg-sapphire-50 border-sapphire-200">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-sapphire-700">{isFrench ? 'Valeur' : 'Value'}</p>
                          <p className="text-2xl font-bold text-sapphire-800">{formatCurrency(data.savings.residenceValeur || 0)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-sapphire-700">{isFrench ? 'Hypothèque' : 'Mortgage'}</p>
                          <p className="text-2xl font-bold text-sapphire-800">{formatCurrency(data.savings.residenceHypotheque || 0)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-sapphire-700">{isFrench ? 'Valeur nette' : 'Net Value'}</p>
                          <p className="text-2xl font-bold text-sapphire-800">{formatCurrency(valeurNetResidence)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Analyse et conseils */}
            <TabsContent value="analyse" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Répartition de l'épargne */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{isFrench ? 'Répartition de l\'épargne' : 'Savings Distribution'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {totalEpargne > 0 ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{isFrench ? 'REER' : 'RRSP'}</span>
                            <span className="font-semibold">{formatCurrency((data.savings.reer1 || 0) + (data.savings.reer2 || 0))}</span>
                          </div>
                          <Progress value={((data.savings.reer1 || 0) + (data.savings.reer2 || 0)) / totalEpargne * 100} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{isFrench ? 'CELI' : 'TFSA'}</span>
                            <span className="font-semibold">{formatCurrency((data.savings.celi1 || 0) + (data.savings.celi2 || 0))}</span>
                          </div>
                          <Progress value={((data.savings.celi1 || 0) + (data.savings.celi2 || 0)) / totalEpargne * 100} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{isFrench ? 'Placements' : 'Non-registered Investments'}</span>
                            <span className="font-semibold">{formatCurrency((data.savings.placements1 || 0) + (data.savings.placements2 || 0))}</span>
                          </div>
                          <Progress value={((data.savings.placements1 || 0) + (data.savings.placements2 || 0)) / totalEpargne * 100} className="h-2" />
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 text-center py-4">{isFrench ? 'Aucune épargne saisie' : 'No savings entered'}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Conseils d'optimisation */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">{isFrench ? 'Conseils d\'optimisation' : 'Optimization Tips'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-blue-700">
                    {totalEpargne < 100000 && (
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 text-blue-500" />
                        <p className="text-sm">
                          <strong>{isFrench ? 'Épargne modeste :' : 'Modest Savings:'}</strong> {isFrench 
                            ? 'Considérez maximiser vos REER pour les avantages fiscaux immédiats.'
                            : 'Consider maximizing your RRSPs for immediate tax benefits.'
                          }
                        </p>
                      </div>
                    )}
                    
                    {(data.savings.celi1 || 0) + (data.savings.celi2 || 0) < 50000 && (
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 text-blue-500" />
                        <p className="text-sm">
                          <strong>{isFrench ? 'CELI sous-utilisé :' : 'Underutilized CELI:'}</strong> {isFrench 
                            ? 'Maximisez vos CELI pour des retraits libres d\'impôt à la retraite.'
                            : 'Maximize your TFSAs for tax-free withdrawals at retirement.'
                          }
                        </p>
                      </div>
                    )}
                    
                    {valeurNetResidence > totalEpargne * 2 && (
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 text-blue-500" />
                        <p className="text-sm">
                          <strong>{isFrench ? 'Patrimoine immobilier élevé :' : 'High Real Estate Net Worth:'}</strong> {isFrench 
                            ? 'Considérez diversifier vers des placements liquides.'
                            : 'Consider diversifying into liquid investments.'
                          }
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-2">
                      <Calculator className="w-4 h-4 mt-0.5 text-green-500" />
                      <p className="text-sm">
                        <strong>{isFrench ? 'Objectif :' : 'Objective:'}</strong> {isFrench 
                          ? 'Atteindre 1M$ d\'épargne pour une retraite confortable.'
                          : 'Achieve $1M in savings for a comfortable retirement.'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};