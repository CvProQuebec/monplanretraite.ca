// Onglet des informations financières
// Plan Professional - Gestion avancée des finances
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Plus, Trash2, Edit, Building, DollarSign, TrendingUp, AlertTriangle, Info, Shield, Calendar, User, Lock } from 'lucide-react';
import { FinancialInfo, CreditCard as CreditCardType, BankAccount, PersonalLoan, OtherDebt, Investment } from '../../types/emergency-info';

interface FinancialTabProps {
  data: FinancialInfo;
  onUpdate: (data: FinancialInfo) => void;
}

export const FinancialTab: React.FC<FinancialTabProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('accounts');
  const [showCreditCardForm, setShowCreditCardForm] = useState(false);
  const [showBankAccountForm, setShowBankAccountForm] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [editingCreditCardIndex, setEditingCreditCardIndex] = useState<number | null>(null);
  const [editingBankAccountIndex, setEditingBankAccountIndex] = useState<number | null>(null);
  const [editingLoanIndex, setEditingLoanIndex] = useState<number | null>(null);
  const [editingInvestmentIndex, setEditingInvestmentIndex] = useState<number | null>(null);

  const [newCreditCard, setNewCreditCard] = useState<Partial<CreditCardType>>({
    bankName: '',
    cardType: 'credit',
    cardNumber: '',
    expiryDate: '',
    creditLimit: '',
    currentBalance: '',
    monthlyPayment: '',
    interestRate: '',
    notes: ''
  });

  const [newBankAccount, setNewBankAccount] = useState<Partial<BankAccount>>({
    bankName: '',
    accountType: 'checking',
    accountNumber: '',
    routingNumber: '',
    currentBalance: '',
    monthlyFee: '',
    notes: ''
  });

  const [newLoan, setNewLoan] = useState<Partial<PersonalLoan>>({
    lenderName: '',
    loanType: 'personal',
    loanAmount: '',
    currentBalance: '',
    monthlyPayment: '',
    interestRate: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const [newInvestment, setNewInvestment] = useState<Partial<Investment>>({
    institutionName: '',
    investmentType: 'stocks',
    accountNumber: '',
    currentValue: '',
    monthlyContribution: '',
    notes: ''
  });

  const cardTypes = [
    { value: 'credit', label: 'Carte de crédit' },
    { value: 'debit', label: 'Carte de débit' },
    { value: 'prepaid', label: 'Carte prépayée' },
    { value: 'business', label: 'Carte d\'entreprise' }
  ];

  const accountTypes = [
    { value: 'checking', label: 'Compte chèques' },
    { value: 'savings', label: 'Compte épargne' },
    { value: 'investment', label: 'Compte d\'investissement' },
    { value: 'business', label: 'Compte d\'entreprise' },
    { value: 'joint', label: 'Compte conjoint' }
  ];

  const loanTypes = [
    { value: 'personal', label: 'Prêt personnel' },
    { value: 'auto', label: 'Prêt automobile' },
    { value: 'mortgage', label: 'Hypothèque' },
    { value: 'student', label: 'Prêt étudiant' },
    { value: 'business', label: 'Prêt d\'entreprise' },
    { value: 'other', label: 'Autre' }
  ];

  const investmentTypes = [
    { value: 'stocks', label: 'Actions' },
    { value: 'bonds', label: 'Obligations' },
    { value: 'mutual-funds', label: 'Fonds mutuels' },
    { value: 'etfs', label: 'FNB' },
    { value: 'real-estate', label: 'Immobilier' },
    { value: 'crypto', label: 'Cryptomonnaie' },
    { value: 'other', label: 'Autre' }
  ];

  // Gestion des cartes de crédit
  const handleAddCreditCard = () => {
    if (!newCreditCard.bankName || !newCreditCard.cardType) return;

    const creditCard: CreditCardType = {
      id: Date.now().toString(),
      bankName: newCreditCard.bankName!,
      cardType: newCreditCard.cardType!,
      cardNumber: newCreditCard.cardNumber || '',
      expiryDate: newCreditCard.expiryDate || '',
      creditLimit: newCreditCard.creditLimit || '',
      currentBalance: newCreditCard.currentBalance || '',
      monthlyPayment: newCreditCard.monthlyPayment || '',
      interestRate: newCreditCard.interestRate || '',
      notes: newCreditCard.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedCreditCards = [...data.creditCards, creditCard];
    onUpdate({ ...data, creditCards: updatedCreditCards });
    
    setNewCreditCard({
      bankName: '',
      cardType: 'credit',
      cardNumber: '',
      expiryDate: '',
      creditLimit: '',
      currentBalance: '',
      monthlyPayment: '',
      interestRate: '',
      notes: ''
    });
    setShowCreditCardForm(false);
  };

  const handleAddBankAccount = () => {
    if (!newBankAccount.bankName || !newBankAccount.accountType) return;

    const bankAccount: BankAccount = {
      id: Date.now().toString(),
      bankName: newBankAccount.bankName!,
      accountType: newBankAccount.accountType!,
      accountNumber: newBankAccount.accountNumber || '',
      routingNumber: newBankAccount.routingNumber || '',
      currentBalance: newBankAccount.currentBalance || '',
      monthlyFee: newBankAccount.monthlyFee || '',
      notes: newBankAccount.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedBankAccounts = [...data.bankAccounts, bankAccount];
    onUpdate({ ...data, bankAccounts: updatedBankAccounts });
    
    setNewBankAccount({
      bankName: '',
      accountType: 'checking',
      accountNumber: '',
      routingNumber: '',
      currentBalance: '',
      monthlyFee: '',
      notes: ''
    });
    setShowBankAccountForm(false);
  };

  const handleAddLoan = () => {
    if (!newLoan.lenderName || !newLoan.loanType) return;

    const loan: PersonalLoan = {
      id: Date.now().toString(),
      lenderName: newLoan.lenderName!,
      loanType: newLoan.loanType!,
      loanAmount: newLoan.loanAmount || '',
      currentBalance: newLoan.currentBalance || '',
      monthlyPayment: newLoan.monthlyPayment || '',
      interestRate: newLoan.interestRate || '',
      startDate: newLoan.startDate || '',
      endDate: newLoan.endDate || '',
      notes: newLoan.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedLoans = [...data.personalLoans, loan];
    onUpdate({ ...data, personalLoans: updatedLoans });
    
    setNewLoan({
      lenderName: '',
      loanType: 'personal',
      loanAmount: '',
      currentBalance: '',
      monthlyPayment: '',
      interestRate: '',
      startDate: '',
      endDate: '',
      notes: ''
    });
    setShowLoanForm(false);
  };

  const handleAddInvestment = () => {
    if (!newInvestment.institutionName || !newInvestment.investmentType) return;

    const investment: Investment = {
      id: Date.now().toString(),
      institutionName: newInvestment.institutionName!,
      investmentType: newInvestment.investmentType!,
      accountNumber: newInvestment.accountNumber || '',
      currentValue: newInvestment.currentValue || '',
      monthlyContribution: newInvestment.monthlyContribution || '',
      notes: newInvestment.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedInvestments = [...data.investments, investment];
    onUpdate({ ...data, investments: updatedInvestments });
    
    setNewInvestment({
      institutionName: '',
      investmentType: 'stocks',
      accountNumber: '',
      currentValue: '',
      monthlyContribution: '',
      notes: ''
    });
    setShowInvestmentForm(false);
  };

  // Fonctions d'édition et suppression
  const handleEditCreditCard = (index: number) => {
    const card = data.creditCards[index];
    setNewCreditCard({
      bankName: card.bankName,
      cardType: card.cardType,
      cardNumber: card.cardNumber,
      expiryDate: card.expiryDate,
      creditLimit: card.creditLimit,
      currentBalance: card.currentBalance,
      monthlyPayment: card.monthlyPayment,
      interestRate: card.interestRate,
      notes: card.notes
    });
    setEditingCreditCardIndex(index);
    setShowCreditCardForm(true);
  };

  const handleUpdateCreditCard = () => {
    if (editingCreditCardIndex === null || !newCreditCard.bankName || !newCreditCard.cardType) return;

    const updatedCreditCards = [...data.creditCards];
    updatedCreditCards[editingCreditCardIndex] = {
      ...updatedCreditCards[editingCreditCardIndex],
      ...newCreditCard,
      updatedAt: new Date()
    };

    onUpdate({ ...data, creditCards: updatedCreditCards });
    setEditingCreditCardIndex(null);
    setShowCreditCardForm(false);
    setNewCreditCard({
      bankName: '',
      cardType: 'credit',
      cardNumber: '',
      expiryDate: '',
      creditLimit: '',
      currentBalance: '',
      monthlyPayment: '',
      interestRate: '',
      notes: ''
    });
  };

  const handleDeleteCreditCard = (index: number) => {
    const updatedCreditCards = data.creditCards.filter((_, i) => i !== index);
    onUpdate({ ...data, creditCards: updatedCreditCards });
  };

  // Calculs des totaux
  const totalCreditLimit = data.creditCards.reduce((sum, card) => {
    const limit = parseFloat(card.creditLimit.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    return sum + limit;
  }, 0);

  const totalCreditBalance = data.creditCards.reduce((sum, card) => {
    const balance = parseFloat(card.currentBalance.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    return sum + balance;
  }, 0);

  const totalBankBalance = data.bankAccounts.reduce((sum, account) => {
    const balance = parseFloat(account.currentBalance.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    return sum + balance;
  }, 0);

  const totalLoanBalance = data.personalLoans.reduce((sum, loan) => {
    const balance = parseFloat(loan.currentBalance.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    return sum + balance;
  }, 0);

  const totalInvestmentValue = data.investments.reduce((sum, investment) => {
    const value = parseFloat(investment.currentValue.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    return sum + value;
  }, 0);

  const creditUtilization = totalCreditLimit > 0 ? (totalCreditBalance / totalCreditLimit) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques financières */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Limite de crédit</p>
                <p className="text-lg font-bold">{totalCreditLimit.toLocaleString('fr-CA')} $</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Solde crédit</p>
                <p className="text-lg font-bold">{totalCreditBalance.toLocaleString('fr-CA')} $</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Comptes bancaires</p>
                <p className="text-lg font-bold">{totalBankBalance.toLocaleString('fr-CA')} $</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Investissements</p>
                <p className="text-lg font-bold">{totalInvestmentValue.toLocaleString('fr-CA')} $</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Utilisation crédit</p>
                <p className="text-lg font-bold">{creditUtilization.toFixed(1)} %</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes financières */}
      {creditUtilization > 80 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <strong>Attention :</strong> Votre utilisation de crédit est élevée ({creditUtilization.toFixed(1)} %). 
            Considérez réduire vos dépenses ou augmenter vos paiements.
          </AlertDescription>
        </Alert>
      )}

      {totalLoanBalance > totalBankBalance && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <strong>Attention :</strong> Vos dettes ({totalLoanBalance.toLocaleString('fr-CA')} $) 
            dépassent vos liquidités ({totalBankBalance.toLocaleString('fr-CA')} $).
          </AlertDescription>
        </Alert>
      )}

      {/* Interface à onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="accounts">Comptes bancaires</TabsTrigger>
          <TabsTrigger value="credit">Cartes de crédit</TabsTrigger>
          <TabsTrigger value="loans">Prêts</TabsTrigger>
          <TabsTrigger value="investments">Investissements</TabsTrigger>
        </TabsList>

        {/* Onglet Comptes bancaires */}
        <TabsContent value="accounts" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Comptes bancaires</h3>
              <p className="text-sm text-muted-foreground">
                Gérez vos comptes bancaires et leurs informations
              </p>
            </div>
            <Button onClick={() => setShowBankAccountForm(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Ajouter un compte</span>
            </Button>
          </div>

          {/* Formulaire d'ajout/édition de compte bancaire */}
          {showBankAccountForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingBankAccountIndex !== null ? 'Modifier le compte' : 'Ajouter un compte bancaire'}
                </CardTitle>
                <CardDescription>
                  Renseignez les informations sur votre compte bancaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank-name">Nom de la banque *</Label>
                    <Input
                      id="bank-name"
                      value={newBankAccount.bankName}
                      onChange={(e) => setNewBankAccount({ ...newBankAccount, bankName: e.target.value })}
                      placeholder="Ex : Banque Royale du Canada"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="account-type">Type de compte *</Label>
                    <Select
                      value={newBankAccount.accountType}
                      onValueChange={(value) => setNewBankAccount({ ...newBankAccount, accountType: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {accountTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Numéro de compte</Label>
                    <Input
                      id="account-number"
                      value={newBankAccount.accountNumber}
                      onChange={(e) => setNewBankAccount({ ...newBankAccount, accountNumber: e.target.value })}
                      placeholder="Numéro de compte"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="routing-number">Numéro de transit</Label>
                    <Input
                      id="routing-number"
                      value={newBankAccount.routingNumber}
                      onChange={(e) => setNewBankAccount({ ...newBankAccount, routingNumber: e.target.value })}
                      placeholder="Numéro de transit"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-balance">Solde actuel</Label>
                    <Input
                      id="current-balance"
                      value={newBankAccount.currentBalance}
                      onChange={(e) => setNewBankAccount({ ...newBankAccount, currentBalance: e.target.value })}
                      placeholder="1 500,00 $"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="monthly-fee">Frais mensuels</Label>
                    <Input
                      id="monthly-fee"
                      value={newBankAccount.monthlyFee}
                      onChange={(e) => setNewBankAccount({ ...newBankAccount, monthlyFee: e.target.value })}
                      placeholder="12,95 $"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-notes">Notes</Label>
                  <Textarea
                    id="account-notes"
                    value={newBankAccount.notes}
                    onChange={(e) => setNewBankAccount({ ...newBankAccount, notes: e.target.value })}
                    placeholder="Informations supplémentaires sur le compte"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowBankAccountForm(false);
                      setEditingBankAccountIndex(null);
                      setNewBankAccount({
                        bankName: '',
                        accountType: 'checking',
                        accountNumber: '',
                        routingNumber: '',
                        currentBalance: '',
                        monthlyFee: '',
                        notes: ''
                      });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleAddBankAccount}
                    disabled={!newBankAccount.bankName || !newBankAccount.accountType}
                  >
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des comptes bancaires */}
          <div className="space-y-4">
            {data.bankAccounts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun compte bancaire enregistré</h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez par ajouter vos comptes bancaires
                  </p>
                  <Button onClick={() => setShowBankAccountForm(true)}>
                    Ajouter votre premier compte
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {data.bankAccounts.map((account, index) => (
                  <Card key={account.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-lg">{account.bankName}</h4>
                            <Badge variant="outline">
                              {accountTypes.find(t => t.value === account.accountType)?.label}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {account.accountNumber && (
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Compte :</strong> {account.accountNumber}</span>
                              </div>
                            )}
                            
                            {account.currentBalance && (
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Solde :</strong> {account.currentBalance}</span>
                              </div>
                            )}
                            
                            {account.monthlyFee && (
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Frais :</strong> {account.monthlyFee}</span>
                              </div>
                            )}
                          </div>
                          
                          {account.notes && (
                            <div className="mt-2 p-2 bg-muted rounded-md">
                              <p className="text-sm text-muted-foreground">{account.notes}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCreditCard(index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCreditCard(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Onglet Cartes de crédit */}
        <TabsContent value="credit" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Cartes de crédit</h3>
              <p className="text-sm text-muted-foreground">
                Gérez vos cartes de crédit et leurs informations
              </p>
            </div>
            <Button onClick={() => setShowCreditCardForm(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Ajouter une carte</span>
            </Button>
          </div>

          {/* Formulaire d'ajout/édition de carte de crédit */}
          {showCreditCardForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingCreditCardIndex !== null ? 'Modifier la carte' : 'Ajouter une carte de crédit'}
                </CardTitle>
                <CardDescription>
                  Renseignez les informations sur votre carte de crédit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-bank">Banque émettrice *</Label>
                    <Input
                      id="card-bank"
                      value={newCreditCard.bankName}
                      onChange={(e) => setNewCreditCard({ ...newCreditCard, bankName: e.target.value })}
                      placeholder="Ex : Banque Royale du Canada"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card-type">Type de carte *</Label>
                    <Select
                      value={newCreditCard.cardType}
                      onValueChange={(value) => setNewCreditCard({ ...newCreditCard, cardType: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {cardTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Numéro de carte</Label>
                    <Input
                      id="card-number"
                      value={newCreditCard.cardNumber}
                      onChange={(e) => setNewCreditCard({ ...newCreditCard, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card-expiry">Date d'expiration</Label>
                    <Input
                      id="card-expiry"
                      value={newCreditCard.expiryDate}
                      onChange={(e) => setNewCreditCard({ ...newCreditCard, expiryDate: e.target.value })}
                      placeholder="MM/AA"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="credit-limit">Limite de crédit</Label>
                    <Input
                      id="credit-limit"
                      value={newCreditCard.creditLimit}
                      onChange={(e) => setNewCreditCard({ ...newCreditCard, creditLimit: e.target.value })}
                      placeholder="5 000,00 $"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-balance">Solde actuel</Label>
                    <Input
                      id="current-balance"
                      value={newCreditCard.currentBalance}
                      onChange={(e) => setNewCreditCard({ ...newCreditCard, currentBalance: e.target.value })}
                      placeholder="1 250,00 $"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="monthly-payment">Paiement mensuel</Label>
                    <Input
                      id="monthly-payment"
                      value={newCreditCard.monthlyPayment}
                      onChange={(e) => setNewCreditCard({ ...newCreditCard, monthlyPayment: e.target.value })}
                      placeholder="50,00 $"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="interest-rate">Taux d'intérêt</Label>
                    <Input
                      id="interest-rate"
                      value={newCreditCard.interestRate}
                      onChange={(e) => setNewCreditCard({ ...newCreditCard, interestRate: e.target.value })}
                      placeholder="19,99 %"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card-notes">Notes</Label>
                    <Input
                      id="card-notes"
                      value={newCreditCard.notes}
                      onChange={(e) => setNewCreditCard({ ...newCreditCard, notes: e.target.value })}
                      placeholder="Informations supplémentaires"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreditCardForm(false);
                      setEditingCreditCardIndex(null);
                      setNewCreditCard({
                        bankName: '',
                        cardType: 'credit',
                        cardNumber: '',
                        expiryDate: '',
                        creditLimit: '',
                        currentBalance: '',
                        monthlyPayment: '',
                        interestRate: '',
                        notes: ''
                      });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={editingCreditCardIndex !== null ? handleUpdateCreditCard : handleAddCreditCard}
                    disabled={!newCreditCard.bankName || !newCreditCard.cardType}
                  >
                    {editingCreditCardIndex !== null ? 'Mettre à jour' : 'Ajouter'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des cartes de crédit */}
          <div className="space-y-4">
            {data.creditCards.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune carte de crédit enregistrée</h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez par ajouter vos cartes de crédit
                  </p>
                  <Button onClick={() => setShowCreditCardForm(true)}>
                    Ajouter votre première carte
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {data.creditCards.map((card, index) => (
                  <Card key={card.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-lg">{card.bankName}</h4>
                            <Badge variant="outline">
                              {cardTypes.find(t => t.value === card.cardType)?.label}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {card.creditLimit && (
                              <div className="flex items-center space-x-2">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Limite :</strong> {card.creditLimit}</span>
                              </div>
                            )}
                            
                            {card.currentBalance && (
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Solde :</strong> {card.currentBalance}</span>
                              </div>
                            )}
                            
                            {card.monthlyPayment && (
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Paiement :</strong> {card.monthlyPayment}</span>
                              </div>
                            )}
                          </div>
                          
                          {card.notes && (
                            <div className="mt-2 p-2 bg-muted rounded-md">
                              <p className="text-sm text-muted-foreground">{card.notes}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCreditCard(index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCreditCard(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Onglets Prêts et Investissements (placeholders pour l'instant) */}
        <TabsContent value="loans" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Gestion des prêts</h3>
              <p className="text-muted-foreground mb-4">
                Cette fonctionnalité sera bientôt disponible
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Gestion des investissements</h3>
              <p className="text-muted-foreground mb-4">
                Cette fonctionnalité sera bientôt disponible
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
