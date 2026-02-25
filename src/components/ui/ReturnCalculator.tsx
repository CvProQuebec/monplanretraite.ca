import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DateInput from '@/components/ui/DateInput';
import MoneyInput from '@/components/ui/MoneyInput';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  TrendingUp, 
  BarChart3, 
  Calendar,
  DollarSign,
  Target,
  Shield,
  Briefcase,
  Info,
  Download,
  RefreshCw
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import ConsentDialog from '@/components/ui/ConsentDialog';
import { PerformanceCalculationService, Cashflow } from '@/services/PerformanceCalculationService';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import { PDFExportService } from '@/services/PDFExportService';

interface Contribution {
  id: string;
  date: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  description?: string;
}

interface AccountData {
  accountType: 'REER' | 'CELI' | 'CRI';
  startDate: string;
  endDate: string;
  startBalance: number;
  endBalance: number;
  contributions: Contribution[];
}

interface ReturnResult {
  accountType: 'REER' | 'CELI' | 'CRI';
  totalReturn: number;
  annualizedReturn: number;
  totalContributions: number;
  totalWithdrawals: number;
  netContributions: number;
  capitalGain: number;
  timeWeightedReturn: number;
  moneyWeightedReturn: number;
}

interface ReturnCalculatorProps {
  isFrench?: boolean;
}

const ReturnCalculator: React.FC<ReturnCalculatorProps> = ({ isFrench = true }) => {
  const { userData, updateUserData } = useRetirementData();
  const [isOpen, setIsOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [upgradeHint, setUpgradeHint] = useState(false);
  const { currentPlan } = useSubscriptionLimits();

  // Initialiser les comptes depuis les données utilisateur ou avec des valeurs par défaut
  const [accounts, setAccounts] = useState<AccountData[]>(() => {
    const p = (userData.personal as any);
    if (p?.returnCalculatorAccounts) {
      return p.returnCalculatorAccounts as AccountData[];
    }
    return [{
      accountType: 'REER',
      startDate: '',
      endDate: '',
      startBalance: 0,
      endBalance: 0,
      contributions: []
    }];
  });

  const [results, setResults] = useState<ReturnResult[]>(() => {
    const p = (userData.personal as any);
    return (p?.returnCalculatorResults as ReturnResult[]) || [];
  });

  // Sauvegarder les données dans le système de retraite quand elles changent
  useEffect(() => {
    updateUserData('personal', {
      returnCalculatorAccounts: accounts,
      returnCalculatorResults: results
    });
  }, [accounts, results]);

  // Charger les données depuis le système de retraite au montage uniquement
  useEffect(() => {
    const p = (userData.personal as any);
    if (p?.returnCalculatorAccounts && p.returnCalculatorAccounts.length > 0) {
      setAccounts(p.returnCalculatorAccounts as AccountData[]);
    }
    if (p?.returnCalculatorResults && p.returnCalculatorResults.length > 0) {
      setResults(p.returnCalculatorResults as ReturnResult[]);
    }
  }, []); // Seulement au montage

  // Fonction pour calculer l'IRR (Internal Rate of Return) via service robuste
  const calculateIRR = (cashFlows: { date: Date; amount: number }[]): number => {
    if (cashFlows.length < 2) return 0;
    const flows: Cashflow[] = [...cashFlows]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(cf => ({ date: cf.date, amount: cf.amount }));
    return PerformanceCalculationService.xirr(flows, { guess: 0.1 });
  };

  // Fonction pour calculer le rendement pondéré dans le temps (TWR)
  const calculateTWR = (account: AccountData): number => {
    if (account.startBalance === 0 && account.contributions.length === 0) return 0;

    const startDate = new Date(account.startDate);
    const endDate = new Date(account.endDate);
    const contributions = account.contributions.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Si pas de contributions, calcul simple
    if (contributions.length === 0) {
      if (account.startBalance === 0) return 0;
      const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const yearsDiff = daysDiff / 365.25;
      return Math.pow(account.endBalance / account.startBalance, 1 / yearsDiff) - 1;
    }

    // Calcul TWR avec contributions
    let cumulativeReturn = 1;
    let currentBalance = account.startBalance;
    let lastDate = startDate;

    for (const contribution of contributions) {
      const contribDate = new Date(contribution.date);
      const daysDiff = (contribDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 0 && currentBalance > 0) {
        // Calculer le rendement pour cette période
        const periodReturn = currentBalance / (currentBalance - (contribution.type === 'deposit' ? 0 : contribution.amount));
        cumulativeReturn *= periodReturn;
      }

      currentBalance += contribution.type === 'deposit' ? contribution.amount : -contribution.amount;
      lastDate = contribDate;
    }

    // Période finale
    const finalDaysDiff = (endDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    if (finalDaysDiff > 0 && currentBalance > 0) {
      const finalReturn = account.endBalance / currentBalance;
      cumulativeReturn *= finalReturn;
    }

    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const totalYears = totalDays / 365.25;
    
    return Math.pow(cumulativeReturn, 1 / totalYears) - 1;
  };

  // Fonction pour calculer le rendement pondéré par l'argent (MWR/IRR) via service
  const calculateMWR = (account: AccountData): number => {
    const cashFlows: Cashflow[] = [];
    // Solde initial (sortie de fonds)
    cashFlows.push({ date: new Date(account.startDate), amount: -account.startBalance });
    // Contributions/retraits
    for (const contrib of account.contributions) {
      cashFlows.push({
        date: new Date(contrib.date),
        amount: contrib.type === 'deposit' ? -contrib.amount : contrib.amount
      });
    }
    // Solde final (entrée de fonds)
    cashFlows.push({ date: new Date(account.endDate), amount: account.endBalance });
    return PerformanceCalculationService.mwr(cashFlows, { guess: 0.1 });
  };

  // Fonction principale de calcul
  const calculateReturns = () => {
    // Afficher le dialog de consentement avant de calculer
    setShowConsentDialog(true);
  };

  const handleConsentAccepted = () => {
    setShowConsentDialog(false);
    performCalculation();
  };

  const handleConsentDeclined = () => {
    setShowConsentDialog(false);
  };

  const performCalculation = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const newResults: ReturnResult[] = accounts.map(account => {
        const totalContributions = account.contributions
          .filter(c => c.type === 'deposit')
          .reduce((sum, c) => sum + c.amount, 0);
        
        const totalWithdrawals = account.contributions
          .filter(c => c.type === 'withdrawal')
          .reduce((sum, c) => sum + c.amount, 0);
        
        const netContributions = totalContributions - totalWithdrawals;
        const capitalGain = account.endBalance - account.startBalance - netContributions;
        
        const timeWeightedReturn = calculateTWR(account);
        const moneyWeightedReturn = calculateMWR(account);
        
        const totalInvested = account.startBalance + netContributions;
        const totalReturn = totalInvested > 0 ? (account.endBalance - totalInvested) / totalInvested : 0;
        
        const startDate = new Date(account.startDate);
        const endDate = new Date(account.endDate);
        const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        const yearsDiff = daysDiff / 365.25;
        const annualizedReturn = yearsDiff > 0 ? Math.pow(1 + totalReturn, 1 / yearsDiff) - 1 : 0;

        return {
          accountType: account.accountType,
          totalReturn,
          annualizedReturn,
          totalContributions,
          totalWithdrawals,
          netContributions,
          capitalGain,
          timeWeightedReturn,
          moneyWeightedReturn
        };
      });

      setResults(newResults);
      setIsCalculating(false);
    }, 500);
  };

  // Ajouter un compte
  const addAccount = () => {
    if (currentPlan === 'free' && accounts.length >= 1) {
      setUpgradeHint(true);
      return;
    }
    const newAccount: AccountData = {
      accountType: 'CELI',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      startBalance: 0,
      endBalance: 0,
      contributions: []
    };
    setAccounts([...accounts, newAccount]);
  };

  // Supprimer un compte
  const removeAccount = (index: number) => {
    setAccounts(accounts.filter((_, i) => i !== index));
  };

  // Mettre à jour un compte
  const updateAccount = (index: number, field: keyof AccountData, value: any) => {
    const newAccounts = [...accounts];
    newAccounts[index] = { ...newAccounts[index], [field]: value };
    setAccounts(newAccounts);
  };

  // Ajouter une contribution
  const addContribution = (accountIndex: number) => {
    const newContribution: Contribution = {
      id: Date.now().toString(),
      date: '2024-06-01',
      amount: 0,
      type: 'deposit',
      description: ''
    };
    
    const newAccounts = [...accounts];
    newAccounts[accountIndex].contributions.push(newContribution);
    setAccounts(newAccounts);
  };

  // Supprimer une contribution
  const removeContribution = (accountIndex: number, contributionId: string) => {
    const newAccounts = [...accounts];
    newAccounts[accountIndex].contributions = newAccounts[accountIndex].contributions
      .filter(c => c.id !== contributionId);
    setAccounts(newAccounts);
  };

  // Mettre à jour une contribution
  const updateContribution = (accountIndex: number, contributionId: string, field: keyof Contribution, value: any) => {
    const newAccounts = [...accounts];
    const contributionIndex = newAccounts[accountIndex].contributions
      .findIndex(c => c.id === contributionId);
    
    if (contributionIndex !== -1) {
      newAccounts[accountIndex].contributions[contributionIndex] = {
        ...newAccounts[accountIndex].contributions[contributionIndex],
        [field]: value
      };
      setAccounts(newAccounts);
    }
  };

  // Export PDF (portée composant – utilisé par le bouton Exporter)
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const blob = await PDFExportService.generatePerformanceReport(isFrench ? 'fr' : 'en', {
        accounts: results.map(r => ({
          accountType: r.accountType,
          totalReturn: r.totalReturn,
          annualizedReturn: r.annualizedReturn,
          timeWeightedReturn: r.timeWeightedReturn,
          moneyWeightedReturn: r.moneyWeightedReturn,
          netContributions: r.netContributions,
          capitalGain: r.capitalGain
        }))
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = isFrench ? 'rapport-performance.pdf' : 'performance-report.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  // Icônes pour les types de comptes
  const getAccountIcon = (type: 'REER' | 'CELI' | 'CRI') => {
    switch (type) {
      case 'REER': return Shield;
      case 'CELI': return Target;
      case 'CRI': return Briefcase;
    }
  };

  // Couleurs pour les types de comptes
  const getAccountColor = (type: 'REER' | 'CELI' | 'CRI') => {
    switch (type) {
      case 'REER': return 'text-mpr-interactive bg-mpr-interactive-lt border-mpr-border';
      case 'CELI': return 'text-green-600 bg-green-50 border-green-200';
      case 'CRI': return 'text-purple-600 bg-purple-50 border-purple-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="bg-gradient-to-r from-mpr-interactive via-purple-500 to-pink-600 hover:from-mpr-interactive hover:via-purple-600 hover:to-pink-700 text-white font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <Calculator className="w-6 h-6 mr-3" />
          {isFrench ? '📊 Calculette de rendement avancée' : '📊 Advanced Return Calculator'}
          <TrendingUp className="w-6 h-6 ml-3" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-mpr-navy flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            {isFrench ? 'Calculette de rendement professionnelle' : 'Professional Return Calculator'}
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600">
            {isFrench 
              ? 'Analysez et comparez les rendements de vos REER, CELI et CRI avec calculs IRR avancés'
              : 'Analyze and compare returns of your RRSP, TFSA and LIRA with advanced IRR calculations'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Section des comptes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                {isFrench ? 'Comptes à analyser' : 'Accounts to analyze'}
              </h3>
              <Button onClick={addAccount} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                {isFrench ? 'Ajouter un compte' : 'Add account'}
              </Button>
            </div>

            {currentPlan === 'free' && upgradeHint && (
              <div className="text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-sm mb-2">
                {isFrench
                  ? 'Le plan Gratuit permet un seul compte. Passez à Pro/Expert pour comparer plusieurs comptes et exporter en PDF.'
                  : 'Free plan allows a single account. Upgrade to Pro/Expert to compare multiple accounts and export to PDF.'}
              </div>
            )}
            {accounts.map((account, accountIndex) => {
              const AccountIcon = getAccountIcon(account.accountType);
              return (
                <Card key={accountIndex} className={`border-2 ${getAccountColor(account.accountType)}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <AccountIcon className="w-6 h-6" />
                        {account.accountType}
                        <span className="text-sm font-normal text-gray-500">
                          #{accountIndex + 1}
                        </span>
                      </CardTitle>
                      {accounts.length > 1 && (
                        <Button 
                          onClick={() => removeAccount(accountIndex)}
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Configuration du compte */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>{isFrench ? 'Type de compte' : 'Account type'}</Label>
                        <Select
                          value={account.accountType}
                          onValueChange={(value: 'REER' | 'CELI' | 'CRI') => 
                            updateAccount(accountIndex, 'accountType', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="REER">REER</SelectItem>
                            <SelectItem value="CELI">CELI</SelectItem>
                            <SelectItem value="CRI">CRI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {isFrench ? 'Date de début' : 'Start date'}
                        </Label>
                        <DateInput
                          value={account.startDate}
                          onChange={(value) => updateAccount(accountIndex, 'startDate', value)}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {isFrench ? 'Date de fin' : 'End date'}
                        </Label>
                        <DateInput
                          value={account.endDate}
                          onChange={(value) => updateAccount(accountIndex, 'endDate', value)}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Soldes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          {isFrench ? 'Solde initial' : 'Starting balance'}
                        </Label>
                        <MoneyInput
                          value={account.startBalance}
                          onChange={(value) => updateAccount(accountIndex, 'startBalance', value)}
                          className="w-full"
                          allowDecimals={true}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          {isFrench ? 'Solde final' : 'Ending balance'}
                        </Label>
                        <MoneyInput
                          value={account.endBalance}
                          onChange={(value) => updateAccount(accountIndex, 'endBalance', value)}
                          className="w-full"
                          allowDecimals={true}
                        />
                      </div>
                    </div>

                    {/* Contributions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">
                          {isFrench ? 'Contributions et retraits' : 'Contributions and withdrawals'}
                        </Label>
                        <Button 
                          onClick={() => addContribution(accountIndex)}
                          variant="outline" 
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {isFrench ? 'Ajouter' : 'Add'}
                        </Button>
                      </div>

                      {account.contributions.map((contribution) => (
                        <div key={contribution.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="space-y-1">
                            <Label className="text-xs">{isFrench ? 'Date' : 'Date'}</Label>
                            <DateInput
                              value={contribution.date}
                              onChange={(value) => updateContribution(accountIndex, contribution.id, 'date', value)}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">{isFrench ? 'Type' : 'Type'}</Label>
                            <Select
                              value={contribution.type}
                              onValueChange={(value: 'deposit' | 'withdrawal') => 
                                updateContribution(accountIndex, contribution.id, 'type', value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="deposit">
                                  {isFrench ? 'Dépôt' : 'Deposit'}
                                </SelectItem>
                                <SelectItem value="withdrawal">
                                  {isFrench ? 'Retrait' : 'Withdrawal'}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">{isFrench ? 'Montant' : 'Amount'}</Label>
                            <MoneyInput
                              value={contribution.amount}
                              onChange={(value) => updateContribution(accountIndex, contribution.id, 'amount', value)}
                              className="w-full"
                              allowDecimals={true}
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">{isFrench ? 'Description' : 'Description'}</Label>
                            <Input
                              value={contribution.description || ''}
                              onChange={(e) => updateContribution(accountIndex, contribution.id, 'description', e.target.value)}
                              placeholder={isFrench ? 'Optionnel' : 'Optional'}
                              className="w-full"
                            />
                          </div>

                          <div className="flex items-end">
                            <Button
                              onClick={() => removeContribution(accountIndex, contribution.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bouton de calcul */}
          <div className="text-center">
            <Button 
              onClick={calculateReturns}
              disabled={isCalculating}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-3"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                  {isFrench ? 'Calcul en cours...' : 'Calculating...'}
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5 mr-3" />
                  {isFrench ? 'Calculer les rendements' : 'Calculate returns'}
                </>
              )}
            </Button>
          </div>

          {/* Résultats */}
          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  {isFrench ? 'Résultats de l\'analyse' : 'Analysis results'}
                </h3>
                {currentPlan !== 'free' ? (
                  <Button onClick={handleExportPDF} variant="outline" size="sm" disabled={isExporting}>
                    {isExporting ? (isFrench ? 'Export en cours...' : 'Exporting...') : (isFrench ? 'Exporter en PDF' : 'Export PDF')}
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setUpgradeHint(true)} className="border-amber-300 text-amber-900">
                    {isFrench ? 'Pro/Expert: Export PDF' : 'Pro/Expert: Export PDF'}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((result, index) => {
                  const AccountIcon = getAccountIcon(result.accountType);
                  return (
                    <Card key={index} className={`border-2 ${getAccountColor(result.accountType)}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                          <AccountIcon className="w-5 h-5" />
                          {result.accountType}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="font-semibold text-gray-600">
                              {isFrench ? 'Rendement total' : 'Total return'}
                            </div>
                            <div className={`text-lg font-bold ${result.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {(result.totalReturn * 100).toFixed(2)}{' %'}
                            </div>
                          </div>
                          
                          <div>
                            <div className="font-semibold text-gray-600">
                              {isFrench ? 'Rendement annualisé' : 'Annualized return'}
                            </div>
                            <div className={`text-lg font-bold ${result.annualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {(result.annualizedReturn * 100).toFixed(2)}{' %'}
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold text-gray-600">
                              {isFrench ? 'TWR' : 'TWR'}
                            </div>
                            <div className={`font-bold ${result.timeWeightedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {(result.timeWeightedReturn * 100).toFixed(2)}{' %'}
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold text-gray-600">
                              {isFrench ? 'MWR (IRR)' : 'MWR (IRR)'}
                            </div>
                            <div className={`font-bold ${result.moneyWeightedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {(result.moneyWeightedReturn * 100).toFixed(2)}{' %'}
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold text-gray-600">
                              {isFrench ? 'Contributions nettes' : 'Net contributions'}
                            </div>
                            <div className="font-bold text-mpr-interactive">
                              ${result.netContributions.toLocaleString()}
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold text-gray-600">
                              {isFrench ? 'Gain en capital' : 'Capital gain'}
                            </div>
                            <div className={`font-bold ${result.capitalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${result.capitalGain.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Informations explicatives */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>{isFrench ? 'Légende :' : 'Legend:'}</strong><br />
                  <strong>TWR</strong> = {isFrench ? 'Rendement pondéré dans le temps (performance du gestionnaire)' : 'Time-Weighted Return (manager performance)'}<br />
                  <strong>MWR (IRR)</strong> = {isFrench ? 'Rendement pondéré par l\'argent (performance de l\'investisseur)' : 'Money-Weighted Return (investor performance)'}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Dialog de consentement */}
          <ConsentDialog
            isOpen={showConsentDialog}
            onClose={handleConsentDeclined}
            onConsent={handleConsentAccepted}
            featureName={isFrench ? 'Calculette de rendement avancée' : 'Advanced Return Calculator'}
            isFrench={isFrench}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnCalculator;
