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
  BarChart3,
  Rocket,
  Sparkles,
  Brain,
  Star,
  Crown,
  Lock,
  Users,
  Building
} from 'lucide-react';
import { UserData } from '../types';
import { formatCurrency } from '../utils/formatters';
import { formatMontantOQLF, formatPourcentageOQLF } from '@/utils/formatters';

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
  const totalEpargne = (data.savings?.reer1 || 0) + (data.savings?.reer2 || 0) + 
                      (data.savings?.celi1 || 0) + (data.savings?.celi2 || 0) + 
                      (data.savings?.placements1 || 0) + (data.savings?.placements2 || 0) + 
                      (data.savings?.epargne1 || 0) + (data.savings?.epargne2 || 0) + 
                      (data.savings?.cri1 || 0) + (data.savings?.cri2 || 0);

  const valeurNetResidence = (data.savings?.residenceValeur || 0) - (data.savings?.residenceHypotheque || 0);
  const patrimoineTotal = totalEpargne + valeurNetResidence;

  // Objectifs d'épargne (exemples)
  const objectifRetraite = 1000000; // 1M$
  const progressionEpargne = Math.min(100, (totalEpargne / objectifRetraite) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      {/* Particules de fond visibles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
        <div className="absolute top-96 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute top-72 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute top-48 left-1/5 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-88 right-1/5 w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* En-tête spectaculaire */}
        <div className="text-center mb-12">

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
            {isFrench ? '🚀 Épargne et placements intelligents' : '🚀 Intelligent Savings and Investments'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            {isFrench 
              ? 'Transformez votre épargne en patrimoine spectaculaire avec notre IA avancée'
              : 'Transform your savings into spectacular wealth with our advanced AI'
            }
          </p>
        </div>

        {/* Message d'aide */}
        {showHelp && (
          <Alert className="border-yellow-400 bg-yellow-900/20 text-yellow-200 mb-8">
            <Info className="h-5 w-5 text-yellow-400" />
            <AlertDescription className="text-lg">
              <strong>{isFrench ? 'Conseils d\'épargne :' : 'Savings Tips:'}</strong> {isFrench 
                ? 'Remplissez vos comptes d\'épargne et placements. Les REER offrent des avantages fiscaux immédiats, les CELI permettent des retraits libres d\'impôt, et les placements non enregistrés offrent de la flexibilité.'
                : 'Fill in your savings and investment accounts. RRSPs offer immediate tax benefits, TFSAs allow tax-free withdrawals, and non-registered investments offer flexibility.'
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Métriques principales - Design moderne */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-green-600/20 to-green-500/20 border border-green-500/30 shadow-2xl backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {isFrench ? formatMontantOQLF(totalEpargne) : `$${totalEpargne.toLocaleString()}`}
                </div>
                <div className="text-green-200 text-sm">
                  {isFrench ? 'Total épargne' : 'Total Savings'}
                </div>
                <div className="text-green-300 text-xs">
                  {isFrench ? 'Comptes enregistrés et non enregistrés' : 'Registered and unregistered accounts'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-500/20 border border-blue-500/30 shadow-2xl backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {isFrench ? formatMontantOQLF(valeurNetResidence) : `$${valeurNetResidence.toLocaleString()}`}
                </div>
                <div className="text-blue-200 text-sm">
                  {isFrench ? 'Valeur nette résidence' : 'Net Residence Value'}
                </div>
                <div className="text-blue-300 text-xs">
                  {isFrench ? 'Valeur - Hypothèque' : 'Value - Mortgage'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-500/20 border border-purple-500/30 shadow-2xl backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {isFrench ? formatMontantOQLF(patrimoineTotal) : `$${patrimoineTotal.toLocaleString()}`}
                </div>
                <div className="text-purple-200 text-sm">
                  {isFrench ? 'Patrimoine total' : 'Total Net Worth'}
                </div>
                <div className="text-purple-300 text-xs">
                  {isFrench ? 'Épargne + Résidence nette' : 'Savings + Net Residence'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600/20 to-orange-500/20 border border-orange-500/30 shadow-2xl backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-orange-400">
                  {isFrench ? formatPourcentageOQLF(progressionEpargne) : `${progressionEpargne.toFixed(1)}%`}
                </div>
                <div className="text-orange-200 text-sm">
                  {isFrench ? 'Progression objectif' : 'Objective Progress'}
                </div>
                <div className="text-orange-300 text-xs">
                  {isFrench ? 'Vers la liberté financière' : 'Towards financial freedom'}
                </div>
                <Progress value={progressionEpargne} className="w-full h-2 bg-orange-900/30">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-500" style={{ width: `${progressionEpargne}%` }}></div>
                </Progress>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation par onglets - Design moderne */}
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700/50 p-1 rounded-lg h-12">
                <TabsTrigger 
                  value="comptes" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-0 px-4 py-2 text-sm font-medium transition-all duration-300"
                >
                  <PiggyBank className="w-4 h-4 mr-2" />
                  {isFrench ? 'Comptes d\'épargne' : 'Savings Accounts'}
                </TabsTrigger>
                <TabsTrigger 
                  value="residence"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-0 px-4 py-2 text-sm font-medium transition-all duration-300"
                >
                  <Home className="w-4 h-4 mr-2" />
                  {isFrench ? 'Résidence principale' : 'Primary Residence'}
                </TabsTrigger>
                <TabsTrigger 
                  value="analyse"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg focus:outline-none focus:ring-0 px-4 py-2 text-sm font-medium transition-all duration-300"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {isFrench ? 'Analyse et conseils' : 'Analysis and Advice'}
                </TabsTrigger>
              </TabsList>

              {/* Onglet Comptes d'épargne */}
              <TabsContent value="comptes" className="mt-6">
                <div className="space-y-6">
                  {/* Personne 1 */}
                  <Card className="bg-gradient-to-br from-blue-800/90 to-blue-700/90 border-0 shadow-xl backdrop-blur-sm">
                    <CardHeader className="border-b border-blue-600 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                      <CardTitle className="text-xl font-bold text-blue-300 flex items-center gap-3">
                        <Users className="w-6 h-6" />
                        {isFrench ? 'Personne 1 - Comptes d\'épargne' : 'Person 1 - Savings Accounts'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* REER */}
                        <div className="space-y-3">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            REER
                          </Label>
                          <Input
                            type="number"
                            value={data.savings?.reer1 || 0}
                            onChange={(e) => handleChange('reer1', Number(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400"
                            placeholder="0"
                          />
                          <p className="text-green-300 text-sm">
                            {isFrench ? 'Avantages fiscaux immédiats' : 'Immediate tax benefits'}
                          </p>
                        </div>

                        {/* CELI */}
                        <div className="space-y-3">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-400" />
                            CELI
                          </Label>
                          <Input
                            type="number"
                            value={data.savings?.celi1 || 0}
                            onChange={(e) => handleChange('celi1', Number(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                            placeholder="0"
                          />
                          <p className="text-blue-300 text-sm">
                            {isFrench ? 'Retraits libres d\'impôt' : 'Tax-free withdrawals'}
                          </p>
                        </div>

                        {/* Placements non enregistrés */}
                        <div className="space-y-3">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                            {isFrench ? 'Placements non enregistrés' : 'Unregistered Investments'}
                          </Label>
                          <Input
                            type="number"
                            value={data.savings?.placements1 || 0}
                            onChange={(e) => handleChange('placements1', Number(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                            placeholder="0"
                          />
                          <p className="text-purple-300 text-sm">
                            {isFrench ? 'Flexibilité maximale' : 'Maximum flexibility'}
                          </p>
                        </div>

                        {/* Épargne régulière */}
                        <div className="space-y-3">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <PiggyBank className="w-4 h-4 text-yellow-400" />
                            {isFrench ? 'Épargne régulière' : 'Regular Savings'}
                          </Label>
                          <Input
                            type="number"
                            value={data.savings?.epargne1 || 0}
                            onChange={(e) => handleChange('epargne1', Number(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                            placeholder="0"
                          />
                          <p className="text-yellow-300 text-sm">
                            {isFrench ? 'Comptes bancaires, etc.' : 'Bank accounts, etc.'}
                          </p>
                        </div>

                        {/* CRI */}
                        <div className="space-y-3">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <Lock className="w-4 h-4 text-red-400" />
                            CRI (si applicable)
                          </Label>
                          <Input
                            type="number"
                            value={data.savings?.cri1 || 0}
                            onChange={(e) => handleChange('cri1', Number(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-red-400"
                            placeholder="0"
                          />
                          <p className="text-red-300 text-sm">
                            {isFrench ? 'Compte de retraite immobilisé' : 'Locked-in retirement account'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Personne 2 */}
                  <Card className="bg-gradient-to-br from-purple-800/90 to-purple-700/90 border-0 shadow-xl backdrop-blur-sm">
                    <CardHeader className="border-b border-purple-600 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
                      <CardTitle className="text-xl font-bold text-purple-300 flex items-center gap-3">
                        <Users className="w-6 h-6" />
                        {isFrench ? 'Personne 2 - Comptes d\'épargne' : 'Person 2 - Savings Accounts'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* REER */}
                        <div className="space-y-3">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            REER
                          </Label>
                          <Input
                            type="number"
                            value={data.savings?.reer2 || 0}
                            onChange={(e) => handleChange('reer2', Number(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400"
                            placeholder="0"
                          />
                          <p className="text-green-300 text-sm">
                            {isFrench ? 'Avantages fiscaux immédiats' : 'Immediate tax benefits'}
                          </p>
                        </div>

                        {/* CELI */}
                        <div className="space-y-3">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-400" />
                            CELI
                          </Label>
                          <Input
                            type="number"
                            value={data.savings?.celi2 || 0}
                            onChange={(e) => handleChange('celi2', Number(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                            placeholder="0"
                          />
                          <p className="text-blue-300 text-sm">
                            {isFrench ? 'Retraits libres d\'impôt' : 'Tax-free withdrawals'}
                          </p>
                        </div>

                        {/* Placements non enregistrés */}
                        <div className="space-y-3">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                            {isFrench ? 'Placements non enregistrés' : 'Unregistered Investments'}
                          </Label>
                          <Input
                            type="number"
                            value={data.savings?.placements2 || 0}
                            onChange={(e) => handleChange('placements2', Number(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                            placeholder="0"
                          />
                          <p className="text-purple-300 text-sm">
                            {isFrench ? 'Flexibilité maximale' : 'Maximum flexibility'}
                          </p>
                        </div>

                        {/* Épargne régulière */}
                        <div className="space-y-3">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <PiggyBank className="w-4 h-4 text-yellow-400" />
                            {isFrench ? 'Épargne régulière' : 'Regular Savings'}
                          </Label>
                          <Input
                            type="number"
                            value={data.savings?.epargne2 || 0}
                            onChange={(e) => handleChange('epargne2', Number(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                            placeholder="0"
                          />
                          <p className="text-yellow-300 text-sm">
                            {isFrench ? 'Comptes bancaires, etc.' : 'Bank accounts, etc.'}
                          </p>
                        </div>

                        {/* CRI */}
                        <div className="space-y-3">
                          <Label className="text-gray-200 font-semibold flex items-center gap-2">
                            <Lock className="w-4 h-4 text-red-400" />
                            CRI (si applicable)
                          </Label>
                          <Input
                            type="number"
                            value={data.savings?.cri2 || 0}
                            onChange={(e) => handleChange('cri2', Number(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-red-400"
                            placeholder="0"
                          />
                          <p className="text-red-300 text-sm">
                            {isFrench ? 'Compte de retraite immobilisé' : 'Locked-in retirement account'}
                          </p>
                        </div>
                      </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Résidence principale */}
          <TabsContent value="residence" className="mt-6">
            <Card className="bg-gradient-to-br from-indigo-800/90 to-indigo-700/90 border-0 shadow-xl backdrop-blur-sm">
              <CardHeader className="border-b border-indigo-600 bg-gradient-to-r from-indigo-600/20 to-blue-600/20">
                <CardTitle className="text-xl font-bold text-indigo-300 flex items-center gap-3">
                  <Home className="w-6 h-6" />
                  {isFrench ? 'Résidence principale' : 'Primary Residence'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-gray-200 font-semibold">
                      {isFrench ? 'Valeur estimée de la résidence' : 'Estimated Residence Value'}
                    </Label>
                    <Input
                      type="number"
                      value={data.savings?.residenceValeur || 0}
                      onChange={(e) => handleChange('residenceValeur', Number(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-gray-200 font-semibold">
                      {isFrench ? 'Solde de l\'hypothèque' : 'Mortgage Balance'}
                    </Label>
                    <Input
                      type="number"
                      value={data.savings?.residenceHypotheque || 0}
                      onChange={(e) => handleChange('residenceHypotheque', Number(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400"
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Analyse et conseils */}
          <TabsContent value="analyse" className="mt-6">
            <Card className="bg-gradient-to-br from-emerald-800/90 to-emerald-700/90 border-0 shadow-xl backdrop-blur-sm">
              <CardHeader className="border-b border-emerald-600 bg-gradient-to-r from-emerald-600/20 to-green-600/20">
                <CardTitle className="text-xl font-bold text-emerald-300 flex items-center gap-3">
                  <Brain className="w-6 h-6" />
                  {isFrench ? 'Analyse et conseils IA' : 'AI Analysis and Advice'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center text-emerald-200">
                  <Calculator className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                  <h3 className="text-xl font-semibold mb-2">
                    {isFrench ? 'Analyse en cours...' : 'Analysis in progress...'}
                  </h3>
                  <p>
                    {isFrench 
                      ? 'Nos algorithmes IA analysent vos données pour vous fournir des conseils personnalisés'
                      : 'Our AI algorithms are analyzing your data to provide personalized advice'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</div>
  );
};