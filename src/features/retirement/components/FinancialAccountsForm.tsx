// src/features/retirement/components/FinancialAccountsForm.tsx
// Formulaire pour les comptes financiers

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Building,
  DollarSign,
  User,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { FinancialAccount } from '../types/emergency-planning';
import { EmergencyPlanningService } from '../services/EmergencyPlanningService';
import { formatMontantOQLF } from '@/utils/formatters';

interface FinancialAccountsFormProps {
  accounts: FinancialAccount[];
  onChange: (accounts: FinancialAccount[]) => void;
  className?: string;
}

const accountTypeOptions = [
  { value: 'cheque', label: 'Compte chèque', icon: '💳', color: 'bg-mpr-interactive-lt text-mpr-navy' },
  { value: 'epargne', label: 'Compte épargne', icon: '💰', color: 'bg-green-100 text-green-800' },
  { value: 'placement', label: 'Compte placement', icon: '📈', color: 'bg-purple-100 text-purple-800' },
  { value: 'reer', label: 'REER', icon: '🏦', color: 'bg-orange-100 text-orange-800' },
  { value: 'celi', label: 'CELI', icon: '🎯', color: 'bg-teal-100 text-teal-800' },
  { value: 'ferr', label: 'FERR', icon: '📊', color: 'bg-red-100 text-red-800' },
  { value: 'autre', label: 'Autre', icon: '📋', color: 'bg-gray-100 text-gray-800' }
];

const commonInstitutions = [
  'Institution financière', 'Caisse populaire', 'Banque',
  'Tangerine', 'Simplii', 'HSBC Canada', 'Autre'
];

export const FinancialAccountsForm: React.FC<FinancialAccountsFormProps> = ({
  accounts,
  onChange,
  className
}) => {
  const [editingAccount, setEditingAccount] = useState<FinancialAccount | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<FinancialAccount>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showBalances, setShowBalances] = useState(false);
  const [showAccountNumbers, setShowAccountNumbers] = useState(false);

  const createEmptyAccount = (): Partial<FinancialAccount> => ({
    type: 'cheque',
    institution: '',
    numeroCompte: '',
    soldeApprox: 0,
    beneficiaire: '',
    notes: '',
    accesProcuration: undefined
  });

  const validateAccount = (account: Partial<FinancialAccount>): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!account.institution?.trim()) newErrors.institution = 'L\'institution est requise';
    if (!account.numeroCompte?.trim()) newErrors.numeroCompte = 'Le numéro de compte est requis';
    if (account.soldeApprox === undefined || account.soldeApprox < 0) {
      newErrors.soldeApprox = 'Le solde doit être un montant positif';
    }

    // Validation du numéro de compte (format basique)
    if (account.numeroCompte && account.numeroCompte.length < 5) {
      newErrors.numeroCompte = 'Le numéro de compte semble trop court';
    }

    return newErrors;
  };

  const handleStartAdd = () => {
    setFormData(createEmptyAccount());
    setIsAdding(true);
    setEditingAccount(null);
    setErrors({});
  };

  const handleStartEdit = (account: FinancialAccount) => {
    setFormData({ ...account });
    setEditingAccount(account);
    setIsAdding(false);
    setErrors({});
  };

  const handleSave = () => {
    const validationErrors = validateAccount(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const accountToSave: FinancialAccount = {
      id: editingAccount?.id || EmergencyPlanningService.generateId(),
      type: formData.type as FinancialAccount['type'],
      institution: formData.institution!,
      numeroCompte: formData.numeroCompte!,
      soldeApprox: formData.soldeApprox || 0,
      beneficiaire: formData.beneficiaire || undefined,
      notes: formData.notes || undefined,
      accesProcuration: formData.accesProcuration?.nom ? formData.accesProcuration : undefined
    };

    let updatedAccounts;
    if (editingAccount) {
      updatedAccounts = accounts.map(a => a.id === editingAccount.id ? accountToSave : a);
    } else {
      updatedAccounts = [...accounts, accountToSave];
    }

    onChange(updatedAccounts);
    handleCancel();
  };

  const handleCancel = () => {
    setFormData({});
    setEditingAccount(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleDelete = (accountId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      onChange(accounts.filter(a => a.id !== accountId));
    }
  };

  const updateFormData = (field: string, value: any) => {
    if (field.startsWith('accesProcuration.')) {
      const procurationField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        accesProcuration: {
          ...prev.accesProcuration,
          [procurationField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const getAccountTypeInfo = (type: string) => {
    return accountTypeOptions.find(option => option.value === type) || accountTypeOptions[0];
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return '****' + accountNumber.slice(-4);
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.soldeApprox, 0);
  };

  const sortedAccounts = [...accounts].sort((a, b) => {
    // Trier par type puis par institution
    if (a.type !== b.type) {
      return accountTypeOptions.findIndex(t => t.value === a.type) - 
             accountTypeOptions.findIndex(t => t.value === b.type);
    }
    return a.institution.localeCompare(b.institution);
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Comptes financiers
          </CardTitle>
          <CardDescription>
            Tous vos comptes bancaires, placements et épargnes. Ces informations aideront 
            vos proches à gérer vos finances en cas d'urgence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {accounts.length} compte{accounts.length !== 1 ? 's' : ''} défini{accounts.length !== 1 ? 's' : ''}
              {accounts.length > 0 && (
                <span className="ml-2 text-green-600">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Total: {showBalances ? formatMontantOQLF(getTotalBalance()) : '****'}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBalances(!showBalances)}
              >
                {showBalances ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {showBalances ? 'Masquer' : 'Afficher'} soldes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAccountNumbers(!showAccountNumbers)}
              >
                {showAccountNumbers ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {showAccountNumbers ? 'Masquer' : 'Afficher'} numéros
              </Button>
              <Button onClick={handleStartAdd} disabled={isAdding || editingAccount !== null}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un compte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerte de sécurité */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Sécurité :</strong> Ces informations sont sensibles. Assurez-vous de les protéger 
          et de ne les partager qu'avec des personnes de confiance. Utilisez les boutons d'affichage 
          pour masquer les détails sensibles lors de l'impression.
        </AlertDescription>
      </Alert>

      {/* Formulaire d'ajout/édition */}
      <AnimatePresence>
        {(isAdding || editingAccount) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingAccount ? 'Modifier le compte' : 'Nouveau compte financier'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type et institution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type de compte</Label>
                    <Select
                      value={formData.type || 'cheque'}
                      onValueChange={(value) => updateFormData('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {accountTypeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <span>{option.icon}</span>
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="institution">Institution financière *</Label>
                    <Select
                      value={formData.institution || ''}
                      onValueChange={(value) => updateFormData('institution', value)}
                    >
                      <SelectTrigger className={errors.institution ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {commonInstitutions.map(institution => (
                          <SelectItem key={institution} value={institution}>
                            {institution}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Ou saisir le nom..."
                      value={formData.institution || ''}
                      onChange={(e) => updateFormData('institution', e.target.value)}
                      className={`mt-1 ${errors.institution ? 'border-red-500' : ''}`}
                    />
                    {errors.institution && <p className="text-sm text-red-500 mt-1">{errors.institution}</p>}
                  </div>
                </div>

                {/* Numéro de compte et solde */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numeroCompte">Numéro de compte *</Label>
                    <Input
                      id="numeroCompte"
                      placeholder="123456789"
                      value={formData.numeroCompte || ''}
                      onChange={(e) => updateFormData('numeroCompte', e.target.value)}
                      className={errors.numeroCompte ? 'border-red-500' : ''}
                    />
                    {errors.numeroCompte && <p className="text-sm text-red-500 mt-1">{errors.numeroCompte}</p>}
                  </div>

                  <div>
                    <Label htmlFor="soldeApprox">Solde approximatif</Label>
                    <Input
                      id="soldeApprox"
                      type="number"
                      placeholder="0"
                      value={formData.soldeApprox || ''}
                      onChange={(e) => updateFormData('soldeApprox', parseFloat(e.target.value) || 0)}
                      className={errors.soldeApprox ? 'border-red-500' : ''}
                      min="0"
                      step="0.01"
                    />
                    {errors.soldeApprox && <p className="text-sm text-red-500 mt-1">{errors.soldeApprox}</p>}
                  </div>
                </div>

                {/* Bénéficiaire */}
                <div>
                  <Label htmlFor="beneficiaire">Bénéficiaire désigné</Label>
                  <Input
                    id="beneficiaire"
                    placeholder="Nom du bénéficiaire en cas de décès"
                    value={formData.beneficiaire || ''}
                    onChange={(e) => updateFormData('beneficiaire', e.target.value)}
                  />
                </div>

                {/* Procuration */}
                <Card className="bg-mpr-interactive-lt border-mpr-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Accès procuration (optionnel)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Nom de la personne</Label>
                        <Input
                          placeholder="Prénom Nom"
                          value={formData.accesProcuration?.nom || ''}
                          onChange={(e) => updateFormData('accesProcuration.nom', e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Relation</Label>
                        <Input
                          placeholder="Conjoint, enfant, etc."
                          value={formData.accesProcuration?.relation || ''}
                          onChange={(e) => updateFormData('accesProcuration.relation', e.target.value)}
                          className="h-8"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Téléphone</Label>
                      <Input
                        placeholder="514-123-4567"
                        value={formData.accesProcuration?.telephone || ''}
                        onChange={(e) => updateFormData('accesProcuration.telephone', e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Informations supplémentaires, instructions spéciales..."
                    value={formData.notes || ''}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {editingAccount ? 'Modifier' : 'Ajouter'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des comptes */}
      <div className="space-y-3">
        <AnimatePresence>
          {sortedAccounts.map((account) => {
            const typeInfo = getAccountTypeInfo(account.type);
            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{typeInfo.icon}</span>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {account.institution}
                            </h3>
                            <Badge className={typeInfo.color}>
                              {typeInfo.label}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <span>
                              Compte: {showAccountNumbers ? account.numeroCompte : maskAccountNumber(account.numeroCompte)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              Solde: {showBalances ? formatMontantOQLF(account.soldeApprox) : '****'}
                            </span>
                          </div>
                          
                          {account.beneficiaire && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>Bénéficiaire: {account.beneficiaire}</span>
                            </div>
                          )}
                          
                          {account.accesProcuration && (
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              <span>
                                Procuration: {account.accesProcuration.nom} ({account.accesProcuration.relation})
                                {account.accesProcuration.telephone && ` - ${account.accesProcuration.telephone}`}
                              </span>
                            </div>
                          )}
                          
                          {account.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                              {account.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartEdit(account)}
                          disabled={isAdding || editingAccount !== null}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(account.id)}
                          disabled={isAdding || editingAccount !== null}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Message si aucun compte */}
      {accounts.length === 0 && !isAdding && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucun compte financier
            </h3>
            <p className="text-gray-500 mb-4">
              Ajoutez vos comptes bancaires et placements pour aider vos proches à gérer vos finances.
            </p>
            <Button onClick={handleStartAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter votre premier compte
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Résumé par type */}
      {accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Résumé par type de compte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {accountTypeOptions.map(type => {
                const accountsOfType = accounts.filter(a => a.type === type.value);
                const totalBalance = accountsOfType.reduce((sum, a) => sum + a.soldeApprox, 0);
                
                if (accountsOfType.length === 0) return null;
                
                return (
                  <div key={type.value} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                    <div className="text-xs text-gray-600">{accountsOfType.length} compte{accountsOfType.length !== 1 ? 's' : ''}</div>
                    <div className="text-sm font-semibold text-green-600">
                      {showBalances ? formatMontantOQLF(totalBalance) : '****'}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
