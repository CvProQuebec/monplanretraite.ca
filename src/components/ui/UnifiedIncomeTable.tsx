import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DateInput from '@/components/ui/DateInput';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MoneyInput from '@/components/ui/MoneyInput';
import { 
  DollarSign, 
  Info, 
  Calendar, 
  TrendingUp, 
  Plus,
  Trash2,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Edit3
} from 'lucide-react';

export interface IncomeEntry {
  id: string;
  type: 'salaire' | 'rentes' | 'assurance-emploi' | 'dividendes' | 'revenus-location' | 'travail-autonome' | 'autres';
  description: string;
  
  // Montants selon la fréquence
  annualAmount?: number;
  monthlyAmount?: number;
  weeklyAmount?: number;
  
  // Spécifique à l'assurance emploi
  weeklyGross?: number;
  weeklyNet?: number;
  startDate?: string;
  endDate?: string;
  weeksUsed?: number;
  maxWeeks?: number;
  
  // Calculs "à ce jour"
  toDateAmount?: number;
  projectedAnnual?: number;
  
  // Métadonnées
  isActive: boolean;
  notes?: string;
}

interface UnifiedIncomeTableProps {
  personNumber: 1 | 2;
  personName: string;
  data?: IncomeEntry[];
  onDataChange: (data: IncomeEntry[]) => void;
  isFrench: boolean;
}

const UnifiedIncomeTable: React.FC<UnifiedIncomeTableProps> = ({
  personNumber,
  personName,
  data = [],
  onDataChange,
  isFrench
}) => {
  
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>(data);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Types de revenus avec leurs caractéristiques
  const incomeTypes = [
    { 
      value: 'salaire', 
      label: isFrench ? 'Salaire' : 'Salary',
      frequency: 'annual',
      showToDate: false,
      color: 'bg-blue-500'
    },
    { 
      value: 'rentes', 
      label: isFrench ? 'Rentes' : 'Pensions',
      frequency: 'monthly',
      showToDate: false,
      color: 'bg-purple-500'
    },
    { 
      value: 'assurance-emploi', 
      label: isFrench ? 'Assurance emploi' : 'Employment Insurance',
      frequency: 'weekly',
      showToDate: true,
      color: 'bg-orange-500'
    },
    { 
      value: 'dividendes', 
      label: isFrench ? 'Dividendes' : 'Dividends',
      frequency: 'annual',
      showToDate: false,
      color: 'bg-green-500'
    },
    { 
      value: 'revenus-location', 
      label: isFrench ? 'Revenus de location' : 'Rental Income',
      frequency: 'monthly',
      showToDate: false,
      color: 'bg-yellow-500'
    },
    { 
      value: 'travail-autonome', 
      label: isFrench ? 'Travail autonome' : 'Self-Employment',
      frequency: 'annual',
      showToDate: false,
      color: 'bg-indigo-500'
    },
    { 
      value: 'autres', 
      label: isFrench ? 'Autres revenus' : 'Other Income',
      frequency: 'annual',
      showToDate: false,
      color: 'bg-gray-500'
    }
  ];
  
  // Calcul du montant "à ce jour" pour l'assurance emploi
  const calculateEIToDate = (entry: IncomeEntry): number => {
    if (entry.type !== 'assurance-emploi' || !entry.startDate || !entry.weeklyNet) {
      return 0;
    }
    
    const startDate = new Date(entry.startDate);
    const currentDate = new Date();
    const endDate = entry.endDate ? new Date(entry.endDate) : currentDate;
    
    // Calculer le nombre de semaines écoulées
    const actualEndDate = endDate < currentDate ? endDate : currentDate;
    const diffTime = actualEndDate.getTime() - startDate.getTime();
    const weeksElapsed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)));
    
    // Limiter par les semaines utilisées si spécifié
    const effectiveWeeks = entry.weeksUsed ? Math.min(weeksElapsed, entry.weeksUsed) : weeksElapsed;
    
    return effectiveWeeks * entry.weeklyNet;
  };
  
  // Calcul du montant annuel projeté
  const calculateProjectedAnnual = (entry: IncomeEntry): number => {
    switch (entry.type) {
      case 'salaire':
        return entry.annualAmount || 0;
      
      case 'rentes':
        return (entry.monthlyAmount || 0) * 12;
      
      case 'assurance-emploi':
        if (!entry.weeklyNet || !entry.startDate) return 0;
        
        const startDate = new Date(entry.startDate);
        const currentYear = new Date().getFullYear();
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31);
        
        // Calculer les semaines dans l'année
        const effectiveStart = startDate > yearStart ? startDate : yearStart;
        const effectiveEnd = entry.endDate ? 
          (new Date(entry.endDate) < yearEnd ? new Date(entry.endDate) : yearEnd) : 
          yearEnd;
        
        const weeksInYear = Math.max(0, Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24 * 7)));
        const maxWeeksInYear = entry.maxWeeks ? Math.min(weeksInYear, entry.maxWeeks) : weeksInYear;
        
        return maxWeeksInYear * entry.weeklyNet;
      
      case 'dividendes':
      case 'travail-autonome':
      case 'autres':
        return entry.annualAmount || 0;
      
      case 'revenus-location':
        return (entry.monthlyAmount || 0) * 12;
      
      default:
        return 0;
    }
  };
  
  // Mise à jour des calculs automatiques
  useEffect(() => {
    const updatedEntries = incomeEntries.map(entry => ({
      ...entry,
      toDateAmount: entry.type === 'assurance-emploi' ? calculateEIToDate(entry) : undefined,
      projectedAnnual: calculateProjectedAnnual(entry)
    }));
    
    setIncomeEntries(updatedEntries);
    onDataChange(updatedEntries);
  }, [incomeEntries.length]); // Recalculer quand les entrées changent
  
  const addIncomeEntry = () => {
    const newEntry: IncomeEntry = {
      id: `income-${Date.now()}`,
      type: 'salaire',
      description: '',
      isActive: true,
      annualAmount: 0
    };
    
    const updated = [...incomeEntries, newEntry];
    setIncomeEntries(updated);
    setEditingId(newEntry.id);
  };
  
  const updateIncomeEntry = (id: string, updates: Partial<IncomeEntry>) => {
    const updated = incomeEntries.map(entry => 
      entry.id === id ? { 
        ...entry, 
        ...updates,
        toDateAmount: entry.type === 'assurance-emploi' ? calculateEIToDate({ ...entry, ...updates }) : undefined,
        projectedAnnual: calculateProjectedAnnual({ ...entry, ...updates })
      } : entry
    );
    
    setIncomeEntries(updated);
    onDataChange(updated);
  };
  
  const removeIncomeEntry = (id: string) => {
    const updated = incomeEntries.filter(entry => entry.id !== id);
    setIncomeEntries(updated);
    onDataChange(updated);
  };
  
  const getIncomeTypeInfo = (type: string) => {
    return incomeTypes.find(t => t.value === type) || incomeTypes[0];
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getTotalsByFrequency = () => {
    const totals = {
      annual: 0,
      monthly: 0,
      weekly: 0,
      toDate: 0,
      projected: 0
    };
    
    incomeEntries.forEach(entry => {
      if (!entry.isActive) return;
      
      const typeInfo = getIncomeTypeInfo(entry.type);
      
      switch (typeInfo.frequency) {
        case 'annual':
          totals.annual += entry.annualAmount || 0;
          break;
        case 'monthly':
          totals.monthly += entry.monthlyAmount || 0;
          break;
        case 'weekly':
          totals.weekly += entry.weeklyNet || entry.weeklyAmount || 0;
          break;
      }
      
      if (entry.toDateAmount) {
        totals.toDate += entry.toDateAmount;
      }
      
      totals.projected += entry.projectedAnnual || 0;
    });
    
    return totals;
  };
  
  const totals = getTotalsByFrequency();
  
  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-0 shadow-2xl backdrop-blur-sm">
      <CardHeader className="border-b border-slate-600 bg-gradient-to-r from-green-600/20 to-emerald-600/20">
        <CardTitle className="text-2xl font-bold text-green-300 flex items-center gap-3">
          <div className={`w-8 h-8 bg-gradient-to-r ${personNumber === 1 ? 'from-green-500 to-emerald-500' : 'from-emerald-500 to-teal-500'} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
            {personNumber}
          </div>
          {isFrench ? 'Tableau des revenus' : 'Income Table'} - {personName}
        </CardTitle>
        <CardDescription className="text-green-200">
          {isFrench 
            ? 'Gestion unifiée de tous vos types de revenus avec calculs automatiques'
            : 'Unified management of all your income types with automatic calculations'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* En-tête du tableau */}
        <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-gray-300 border-b border-gray-600 pb-2">
          <div className="col-span-2">{isFrench ? 'Type' : 'Type'}</div>
          <div className="col-span-2">{isFrench ? 'Description' : 'Description'}</div>
          <div className="col-span-2">{isFrench ? 'Annuel' : 'Annual'}</div>
          <div className="col-span-2">{isFrench ? 'Mensuel' : 'Monthly'}</div>
          <div className="col-span-2">{isFrench ? 'Hebdo/À ce jour' : 'Weekly/To Date'}</div>
          <div className="col-span-1">{isFrench ? 'Statut' : 'Status'}</div>
          <div className="col-span-1">{isFrench ? 'Actions' : 'Actions'}</div>
        </div>
        
        {/* Lignes de revenus */}
        <div className="space-y-3">
          {incomeEntries.map((entry) => {
            const typeInfo = getIncomeTypeInfo(entry.type);
            const isEditing = editingId === entry.id;
            
            return (
              <div key={entry.id} className={`grid grid-cols-12 gap-2 p-3 rounded-lg border ${entry.isActive ? 'border-gray-600 bg-slate-700/50' : 'border-gray-700 bg-slate-800/30 opacity-60'}`}>
                
                {/* Type de revenu */}
                <div className="col-span-2">
                  {isEditing ? (
                    <Select
                      value={entry.type}
                      onValueChange={(value) => updateIncomeEntry(entry.id, { type: value as any })}
                    >
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-white text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {incomeTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${typeInfo.color}`}></div>
                      <span className="text-sm text-white">{typeInfo.label}</span>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                <div className="col-span-2">
                  {isEditing ? (
                    <Input
                      value={entry.description}
                      onChange={(e) => updateIncomeEntry(entry.id, { description: e.target.value })}
                      className="bg-slate-600 border-slate-500 text-white text-xs"
                      placeholder={isFrench ? 'Description...' : 'Description...'}
                    />
                  ) : (
                    <span className="text-sm text-gray-300">{entry.description || (isFrench ? 'Sans nom' : 'Unnamed')}</span>
                  )}
                </div>
                
                {/* Montant annuel */}
                <div className="col-span-2">
                  {typeInfo.frequency === 'annual' && isEditing ? (
                    <MoneyInput
                      value={entry.annualAmount || 0}
                      onChange={(value) => updateIncomeEntry(entry.id, { annualAmount: value })}
                      className="bg-slate-600 border-slate-500 text-white text-xs"
                      placeholder="0"
                      allowDecimals={true}
                    />
                  ) : (
                    <span className="text-sm text-white font-medium">
                      {entry.projectedAnnual ? formatCurrency(entry.projectedAnnual) : '-'}
                    </span>
                  )}
                </div>
                
                {/* Montant mensuel */}
                <div className="col-span-2">
                  {typeInfo.frequency === 'monthly' && isEditing ? (
                    <MoneyInput
                      value={entry.monthlyAmount || 0}
                      onChange={(value) => updateIncomeEntry(entry.id, { monthlyAmount: value })}
                      className="bg-slate-600 border-slate-500 text-white text-xs"
                      placeholder="0"
                      allowDecimals={true}
                    />
                  ) : (
                    <span className="text-sm text-white font-medium">
                      {entry.monthlyAmount ? formatCurrency(entry.monthlyAmount) : 
                       entry.projectedAnnual ? formatCurrency(entry.projectedAnnual / 12) : '-'}
                    </span>
                  )}
                </div>
                
                {/* Montant hebdomadaire / À ce jour */}
                <div className="col-span-2">
                  {entry.type === 'assurance-emploi' ? (
                    <div className="space-y-1">
                      {isEditing ? (
                        <div className="space-y-1">
                          <MoneyInput
                            value={entry.weeklyNet || 0}
                            onChange={(value) => updateIncomeEntry(entry.id, { weeklyNet: value })}
                            className="bg-slate-600 border-slate-500 text-white text-xs"
                            placeholder={isFrench ? 'Net hebdo' : 'Weekly net'}
                            allowDecimals={true}
                          />
                          <div className="flex gap-1">
                            <DateInput
                              value={entry.startDate || ''}
                              onChange={(value) => updateIncomeEntry(entry.id, { startDate: value })}
                              className="bg-slate-600 border-slate-500 text-white text-xs"
                              placeholder={isFrench ? 'Début' : 'Start'}
                            />
                            <Input
                              type="number"
                              value={entry.weeksUsed || ''}
                              onChange={(e) => updateIncomeEntry(entry.id, { weeksUsed: Number(e.target.value) })}
                              className="bg-slate-600 border-slate-500 text-white text-xs"
                              placeholder={isFrench ? 'Sem.' : 'Wks'}
                              min="0"
                              max="50"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs text-gray-400">
                            {isFrench ? 'Hebdo:' : 'Weekly:'} {entry.weeklyNet ? formatCurrency(entry.weeklyNet) : '-'}
                          </div>
                          <div className="text-sm text-orange-400 font-medium">
                            {isFrench ? 'À ce jour:' : 'To date:'} {entry.toDateAmount ? formatCurrency(entry.toDateAmount) : '-'}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : typeInfo.frequency === 'weekly' && isEditing ? (
                    <MoneyInput
                      value={entry.weeklyAmount || 0}
                      onChange={(value) => updateIncomeEntry(entry.id, { weeklyAmount: value })}
                      className="bg-slate-600 border-slate-500 text-white text-xs"
                      placeholder="0"
                      allowDecimals={true}
                    />
                  ) : (
                    <span className="text-sm text-white font-medium">
                      {entry.weeklyAmount ? formatCurrency(entry.weeklyAmount) : '-'}
                    </span>
                  )}
                </div>
                
                {/* Statut */}
                <div className="col-span-1 flex items-center justify-center">
                  <button
                    onClick={() => updateIncomeEntry(entry.id, { isActive: !entry.isActive })}
                    title={entry.isActive ? (isFrench ? 'Désactiver ce revenu' : 'Deactivate this income') : (isFrench ? 'Activer ce revenu' : 'Activate this income')}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      entry.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-300'
                    }`}
                  >
                    {entry.isActive ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Actions */}
                <div className="col-span-1 flex items-center justify-center gap-1">
                  <button
                    onClick={() => setEditingId(isEditing ? null : entry.id)}
                    title={isEditing ? (isFrench ? 'Arrêter l\'édition' : 'Stop editing') : (isFrench ? 'Modifier ce revenu' : 'Edit this income')}
                    className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeIncomeEntry(entry.id)}
                    title={isFrench ? 'Supprimer ce revenu' : 'Delete this income'}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Bouton d'ajout */}
        <div className="text-center">
          <Button
            onClick={addIncomeEntry}
            variant="outline"
            className="border-green-400 text-green-400 hover:bg-green-400 hover:text-slate-900"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isFrench ? 'Ajouter un revenu' : 'Add Income'}
          </Button>
        </div>
        
        {/* Résumé des totaux */}
        <Card className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/30">
          <CardContent className="p-4">
            <h4 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              {isFrench ? 'Résumé des revenus' : 'Income Summary'}
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(totals.projected)}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Total annuel projeté' : 'Projected Annual Total'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {formatCurrency(totals.projected / 12)}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Mensuel moyen' : 'Average Monthly'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-orange-400">
                  {formatCurrency(totals.toDate)}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'AE à ce jour' : 'EI To Date'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {incomeEntries.filter(e => e.isActive).length}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Sources actives' : 'Active Sources'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Alertes et conseils */}
        {totals.toDate > 0 && (
          <Alert className="border-orange-400 bg-orange-900/20 text-orange-200">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>{isFrench ? 'Assurance emploi :' : 'Employment Insurance:'}</strong>
              <br />
              {isFrench 
                ? `Vous avez reçu ${formatCurrency(totals.toDate)} à ce jour. Ce montant est calculé automatiquement selon vos semaines utilisées et votre taux hebdomadaire net.`
                : `You have received ${formatCurrency(totals.toDate)} to date. This amount is calculated automatically based on your weeks used and weekly net rate.`
              }
            </AlertDescription>
          </Alert>
        )}
        
        {incomeEntries.some(e => e.type === 'assurance-emploi' && e.isActive && !e.startDate) && (
          <Alert className="border-yellow-400 bg-yellow-900/20 text-yellow-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{isFrench ? 'Information manquante :' : 'Missing Information:'}</strong>
              <br />
              {isFrench 
                ? 'Veuillez renseigner la date de début et le nombre de semaines utilisées pour l\'assurance emploi afin de calculer le montant "à ce jour".'
                : 'Please provide the start date and weeks used for employment insurance to calculate the "to date" amount.'
              }
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedIncomeTable;
