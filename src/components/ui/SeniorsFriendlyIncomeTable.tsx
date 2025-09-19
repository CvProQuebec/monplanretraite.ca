import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DateInput from '@/components/ui/DateInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  Edit,
  Edit3,
  HelpCircle,
  Save,
  X
} from 'lucide-react';
import { CalculationDebugger } from './CalculationDebugger';
import { PayrollCalendarService } from '@/services/PayrollCalendarService';
import { CriticalDataFix } from '@/services/CriticalDataFix';
import { SalaryCalculationFix } from '@/services/SalaryCalculationFix';

export interface IncomeEntry {
  id: string;
  type: 'salaire' | 'emploi-saisonnier' | 'rentes' | 'assurance-emploi' | 'dividendes' | 'revenus-location' | 'travail-autonome' | 'autres';
  description: string;
  
  // Montants selon la fréquence
  annualAmount?: number;
  monthlyAmount?: number;
  weeklyAmount?: number;
  
  // Spécifique au salaire
  salaryStartDate?: string; // Date de début d'emploi
  salaryEndDate?: string; // Date de fin d'emploi
  salaryFirstPaymentDate?: string; // Date du premier versement
  salaryFirstPayDateOfYear?: string; // Date du premier versement de l'année courante (ex: "2025-01-02")
  salaryFrequency?: 'weekly' | 'biweekly' | 'bimonthly' | 'monthly'; // Fréquence de paiement
  salaryNetAmount?: number; // Montant net par période
  
  // Révision salariale
  salaryRevisionDate?: string; // Date effective de la révision salariale
  salaryRevisionAmount?: number; // Nouveau montant après révision
  salaryRevisionFrequency?: 'weekly' | 'biweekly' | 'bimonthly' | 'monthly'; // Nouvelle fréquence (si différente)
  salaryRevisionDescription?: string; // Description de la révision (promotion, nouveau rôle, etc.)
  
  // Spécifique à l'assurance emploi
  weeklyGross?: number;
  weeklyNet?: number;
  eiStartDate?: string; // Date de début des prestations
  eiFirstPaymentDate?: string; // Date du premier versement
  eiPaymentFrequency?: 'weekly' | 'biweekly'; // Fréquence de versement
  eiEligibleWeeks?: number; // Nombre de semaines éligibles (15-45)
  weeksUsed?: number;
  maxWeeks?: number;
  
  // Révision assurance-emploi
  eiRevisionDate?: string; // Date effective de la révision
  eiRevisionAmount?: number; // Nouveau montant après révision
  eiRevisionDescription?: string; // Description de la révision
  
  // Spécifique aux rentes privées (pensions/viagères)
  pensionAmount?: number; // Montant de la rente
  pensionFrequency?: 'monthly' | 'quarterly' | 'semi-annual' | 'annual'; // Fréquence de versement
  pensionStartDate?: string; // Date de début de la rente
  pensionFirstPaymentDate?: string; // Date du premier versement
  pensionType?: 'viagere' | 'temporaire' | 'mixte'; // Type de rente
  survivorBenefit?: 'none' | '50%' | '75%' | '100%'; // Pourcentage versé au survivant
  isEstatePlanning?: boolean; // Inclure dans la planification successorale
  
  // Spécifique aux revenus de location
  rentalAmount?: number; // Montant par période
  rentalFrequency?: 'daily' | 'weekend' | 'weekly' | 'monthly'; // Fréquence de location
  rentalStartDate?: string; // Date de début de la saison (optionnel)
  rentalEndDate?: string; // Date de fin de la saison (optionnel)
  rentalType?: 'chalet' | 'airbnb' | 'appartement' | 'autre'; // Type de propriété
  
  // Calculs "à ce jour"
  toDateAmount?: number;
  projectedAnnual?: number;
  
  // Métadonnées
  isActive: boolean;
  notes?: string;
}

interface SeniorsFriendlyIncomeTableProps {
  personNumber: 1 | 2;
  personName: string;
  data?: IncomeEntry[];
  onDataChange: (data: IncomeEntry[]) => void;
  isFrench: boolean;
  userData?: any; // Ajouter les données utilisateur pour accéder aux montants RRQ réels
}

const SeniorsFriendlyIncomeTable: React.FC<SeniorsFriendlyIncomeTableProps> = ({
  personNumber,
  personName,
  data = [],
  onDataChange,
  isFrench,
  userData
}) => {
  
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>(data);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  
  // Log de débogage
  useEffect(() => {
    console.log(`🔍 SeniorsFriendlyIncomeTable Personne ${personNumber} - Données reçues:`, data);
    console.log(`🔍 SeniorsFriendlyIncomeTable Personne ${personNumber} - incomeEntries:`, incomeEntries);
    
    // Debug spécifique pour Personne 2
    if (personNumber === 2) {
      console.log(`🚨 DEBUG PERSONNE 2 - Données:`, data);
      console.log(`🚨 DEBUG PERSONNE 2 - incomeEntries:`, incomeEntries);
      console.log(`🚨 DEBUG PERSONNE 2 - onDataChange:`, onDataChange);
    }
  }, [data, personNumber, incomeEntries, onDataChange]);
  
  // Synchroniser les données quand elles changent
  useEffect(() => {
    if (data && data.length > 0) {
      console.log(`🔄 SeniorsFriendlyIncomeTable Personne ${personNumber} - Synchronisation des données:`, data);
      setIncomeEntries(data);
    }
  }, [data, personNumber]);
  
  // Options de fréquence de paiement pour le salaire
  const salaryFrequencies = [
    { value: 'weekly', label: isFrench ? 'Hebdomadaire (52x/an)' : 'Weekly (52x/year)' },
    { value: 'biweekly', label: isFrench ? 'Aux 2 semaines (26x/an)' : 'Bi-weekly (26x/year)' },
    { value: 'bimonthly', label: isFrench ? '2x par mois (24x/an)' : '2x per month (24x/year)' },
    { value: 'monthly', label: isFrench ? 'Mensuel (12x/an)' : 'Monthly (12x/year)' }
  ];
  
  // Options de fréquence de versement pour l'assurance emploi
  const eiPaymentFrequencies = [
    { value: 'weekly', label: isFrench ? 'Hebdomadaire (52x/an)' : 'Weekly (52x/year)' },
    { value: 'biweekly', label: isFrench ? 'Aux 2 semaines (26x/an)' : 'Bi-weekly (26x/year)' }
  ];
  
  // Options de fréquence de versement pour les rentes privées
  const pensionFrequencies = [
    { value: 'monthly', label: isFrench ? 'Mensuel' : 'Monthly' },
    { value: 'quarterly', label: isFrench ? 'Trimestriel' : 'Quarterly' },
    { value: 'semi-annual', label: isFrench ? 'Semi-annuel' : 'Semi-annual' },
    { value: 'annual', label: isFrench ? 'Annuel' : 'Annual' }
  ];
  
  // Options de fréquence pour les revenus de location
  const rentalFrequencies = [
    { value: 'daily', label: isFrench ? 'Jour' : 'Daily' },
    { value: 'weekend', label: isFrench ? 'Week-end (3 jours - ven, sam, dim)' : 'Weekend (3 days - Fri, Sat, Sun)' },
    { value: 'weekly', label: isFrench ? 'Semaine (7 jours)' : 'Weekly (7 days)' },
    { value: 'monthly', label: isFrench ? 'Mensuel' : 'Monthly' }
  ];
  
  // Options de type de rente
  const pensionTypes = [
    { value: 'viagere', label: isFrench ? 'Rente viagère' : 'Life annuity' },
    { value: 'temporaire', label: isFrench ? 'Rente temporaire' : 'Term annuity' },
    { value: 'mixte', label: isFrench ? 'Rente mixte' : 'Mixed annuity' }
  ];
  
  // Options de prestation au survivant
  const survivorBenefits = [
    { value: 'none', label: isFrench ? 'Aucune' : 'None' },
    { value: '50%', label: isFrench ? '50 % au survivant' : '50 % to survivor' },
    { value: '75%', label: isFrench ? '75 % au survivant' : '75 % to survivor' },
    { value: '100%', label: isFrench ? '100 % au survivant' : '100 % to survivor' }
  ];
  
  // Types de revenus avec leurs caractéristiques - version simplifiée pour seniors
  const incomeTypes = [
    { 
      value: 'salaire', 
      label: isFrench ? 'Salaire' : 'Salary',
      description: isFrench ? 'Votre salaire avec dates et fréquence de paiement' : 'Your salary with dates and payment frequency',
      frequency: 'annual',
      showToDate: false,
      color: 'bg-blue-600',
      icon: '💼'
    },
    { 
      value: 'emploi-saisonnier', 
      label: isFrench ? 'Emploi saisonnier' : 'Seasonal Employment',
      description: isFrench ? 'Salaire pour emploi saisonnier avec dates de début/fin' : 'Seasonal job salary with start/end dates',
      frequency: 'annual',
      showToDate: false,
      color: 'bg-amber-600',
      icon: '🌦️'
    },
    { 
      value: 'rentes', 
      label: isFrench ? 'Pensions/Rentes' : 'Pensions/Annuities',
      description: isFrench ? 'Vos pensions de retraite ou rentes mensuelles' : 'Your retirement pensions or monthly annuities',
      frequency: 'monthly',
      showToDate: false,
      color: 'bg-purple-600',
      icon: '🏦'
    },
    { 
      value: 'assurance-emploi', 
      label: isFrench ? 'Assurance emploi' : 'Employment Insurance',
      description: isFrench ? 'Prestations d\'assurance emploi (hebdomadaires)' : 'Employment insurance benefits (weekly)',
      frequency: 'weekly',
      showToDate: true,
      color: 'bg-orange-600',
      icon: '🛡️'
    },
    { 
      value: 'dividendes', 
      label: isFrench ? 'Dividendes' : 'Dividends',
      description: isFrench ? 'Revenus de dividendes d\'investissements' : 'Dividend income from investments',
      frequency: 'annual',
      showToDate: false,
      color: 'bg-green-600',
      icon: '📈'
    },
    { 
      value: 'revenus-location', 
      label: isFrench ? 'Revenus de location' : 'Rental Income',
      description: isFrench ? 'Revenus mensuels de propriétés locatives' : 'Monthly income from rental properties',
      frequency: 'monthly',
      showToDate: false,
      color: 'bg-yellow-600',
      icon: '🏠'
    },
    { 
      value: 'travail-autonome', 
      label: isFrench ? 'Travail autonome' : 'Self-Employment',
      description: isFrench ? 'Revenus annuels de votre travail autonome' : 'Annual income from your self-employment',
      frequency: 'annual',
      showToDate: false,
      color: 'bg-indigo-600',
      icon: '💻'
    },
    { 
      value: 'autres', 
      label: isFrench ? 'Autres revenus' : 'Other Income',
      description: isFrench ? 'Tous autres types de revenus' : 'All other types of income',
      frequency: 'annual',
      showToDate: false,
      color: 'bg-gray-600',
      icon: '💰'
    }
  ];
  
  const addIncomeEntry = () => {
    const newEntry: IncomeEntry = {
      id: `income-${Date.now()}`,
      type: 'salaire',
      description: '',
      isActive: true,
      annualAmount: 0,
      salaryFrequency: 'monthly', // Valeur par défaut pour la fréquence
      salaryNetAmount: 0 // Valeur par défaut pour le montant
    };
    
    const updated = [...incomeEntries, newEntry];
    setIncomeEntries(updated);
    setEditingId(newEntry.id);
  };
  
  const updateIncomeEntry = useCallback((id: string, updates: Partial<IncomeEntry>) => {
    const updated = incomeEntries.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, ...updates };
        
        // Si on change le type de revenu, s'assurer que les valeurs par défaut sont définies
        if (updates.type && updates.type !== entry.type) {
          if (updates.type === 'salaire' || updates.type === 'emploi-saisonnier') {
            // Pour salaire et emploi saisonnier, s'assurer que salaryFrequency est définie
            if (!updatedEntry.salaryFrequency) {
              updatedEntry.salaryFrequency = 'monthly';
            }
            if (!updatedEntry.salaryNetAmount) {
              updatedEntry.salaryNetAmount = 0;
            }
          } else if (updates.type === 'rentes') {
            // Pour les rentes, s'assurer que pensionFrequency est définie
            if (!updatedEntry.pensionFrequency) {
              updatedEntry.pensionFrequency = 'monthly';
            }
            if (!updatedEntry.pensionAmount) {
              updatedEntry.pensionAmount = 0;
            }
          } else if (updates.type === 'revenus-location') {
            // Pour les revenus de location, s'assurer que rentalFrequency est définie
            if (!updatedEntry.rentalFrequency) {
              updatedEntry.rentalFrequency = 'monthly';
            }
            if (!updatedEntry.rentalAmount) {
              updatedEntry.rentalAmount = 0;
            }
          }
        }
        
        return updatedEntry;
      }
      return entry;
    });

    setIncomeEntries(updated);
    onDataChange(updated);

    // Sauvegarde critique immédiate
    const updatedUserData = {
      ...userData,
      personal: {
        ...userData?.personal,
        [`unifiedIncome${personNumber}`]: updated
      }
    };
    CriticalDataFix.saveCriticalData(updatedUserData);
  }, [incomeEntries, onDataChange, personNumber, userData]);
  
  const removeIncomeEntry = (id: string) => {
    if (window.confirm(isFrench ? 'Êtes-vous sûr de vouloir supprimer ce revenu ?' : 'Are you sure you want to delete this income?')) {
      const updated = incomeEntries.filter(entry => entry.id !== id);
      setIncomeEntries(updated);
      onDataChange(updated);
    }
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
  
  return (
    <>
      <TooltipProvider>
      <Card className="bg-white border-4 border-blue-200 shadow-xl">
        <CardHeader className="border-b-4 border-blue-100 bg-blue-50">
          <CardTitle className="text-3xl font-bold text-blue-800 flex items-center gap-4">
            <div className={`w-12 h-12 ${personNumber === 1 ? 'bg-blue-600' : 'bg-green-600'} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
              {personNumber}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-blue-600" />
                <span>{isFrench ? 'Tableau des revenus' : 'Income Table'} - {personName}</span>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-6 h-6 text-blue-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md">
                    <p className="text-lg">
                      {isFrench 
                        ? 'Cette section vous permet de saisir tous vos types de revenus. Les calculs se font automatiquement.'
                        : 'This section allows you to enter all your income types. Calculations are done automatically.'
                      }
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardTitle>
          <CardDescription className="text-xl text-blue-700 mt-2">
            {isFrench 
              ? 'Gestion unifiée de tous vos types de revenus avec calculs automatiques'
              : 'Unified management of all your income types with automatic calculations'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6 relative overflow-visible">
          {/* En-tête du tableau - Version Senior */}
          <div className="grid grid-cols-8 gap-4 text-xl font-bold text-blue-800 border-b-4 border-blue-200 pb-4">
            <div className="col-span-2">{isFrench ? 'Type de revenu' : 'Income Type'}</div>
            <div className="col-span-2">{isFrench ? 'Description' : 'Description'}</div>
            <div className="col-span-2">{isFrench ? 'Montant' : 'Amount'}</div>
            <div className="col-span-2">{isFrench ? 'fréquence' : 'frequency'}</div>
          </div>
          
          {/* Lignes de revenus - Version Senior */}
          <div className="space-y-3">
            {incomeEntries.filter(e => e.type !== 'assurance-emploi').map((entry) => {
              const typeInfo = getIncomeTypeInfo(entry.type);
              const isEditing = editingId === entry.id;
              
              return (
                <div key={entry.id} className={`senior-compact-section ${entry.isActive ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 opacity-60'} relative overflow-visible`}>
                  
                  <h3>{typeInfo.icon} {typeInfo.label} - {entry.description || (isFrench ? 'Sans nom' : 'Unnamed')}</h3>
                  
                  {/* Ligne 1 : Type + Description */}
                  <div className="senior-inline-grid-2">
                    {/* Type de revenu condensé */}
                    <div className="senior-field-inline">
                      <label>{isFrench ? 'Type' : 'Type'}</label>
                      {isEditing ? (
                        <select
                          value={entry.type}
                          onChange={(e) => updateIncomeEntry(entry.id, { type: e.target.value as any })}
                        >
                          {(incomeTypes.filter(type => type.value !== 'assurance-emploi' && type.value !== 'rentes' && type.value !== 'autres')).map(type => (
                            <option key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input value={`${typeInfo.icon} ${typeInfo.label}`} readOnly />
                      )}
                    </div>
                    
                    {/* Description condensée */}
                    <div className="senior-field-inline">
                      <label>{isFrench ? 'Description' : 'Description'}</label>
                      {isEditing ? (
                        <input
                          value={entry.description}
                          onChange={(e) => updateIncomeEntry(entry.id, { description: e.target.value })}
                          placeholder={isFrench ? 'Description...' : 'Description...'}
                        />
                      ) : (
                        <input value={entry.description || (isFrench ? 'Sans nom' : 'Unnamed')} readOnly />
                      )}
                    </div>
                  </div>

                  {/* Ligne Montant et Fréquence - ligne par ligne */}
                  <div className="space-y-3 mb-6">
                    
                    {/* Montant - ligne par ligne */}
                    <div className="senior-field-inline">
                      <label>{isFrench ? 'Montant' : 'Amount'}</label>
                      {isEditing ? (
                        <MoneyInput
                          value={
                            (entry.type === 'salaire' || entry.type === 'emploi-saisonnier') ? (entry.salaryNetAmount || 0) :
                            entry.type === 'assurance-emploi' ? (entry.weeklyNet || 0) :
                            entry.type === 'rentes' ? (entry.pensionAmount || 0) :
                            entry.type === 'revenus-location' ? (entry.rentalAmount || 0) :
                            entry.annualAmount || 0
                          }
                          onChange={(value) => {
                            if (entry.type === 'salaire' || entry.type === 'emploi-saisonnier') {
                              updateIncomeEntry(entry.id, { salaryNetAmount: value });
                            } else if (entry.type === 'assurance-emploi') {
                              updateIncomeEntry(entry.id, { weeklyNet: value });
                            } else if (entry.type === 'rentes') {
                              updateIncomeEntry(entry.id, { pensionAmount: value });
                            } else if (entry.type === 'revenus-location') {
                              updateIncomeEntry(entry.id, { rentalAmount: value });
                            } else {
                              updateIncomeEntry(entry.id, { annualAmount: value });
                            }
                          }}
                          className="p-2 border-2 border-gray-300 rounded-lg text-[1.05rem] font-semibold w-32"
                          placeholder="0"
                          allowDecimals={true}
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 border border-gray-300 rounded-lg w-32 flex items-center">
                          <div className="text-sm text-gray-800 font-semibold">
                            {(entry.type === 'salaire' || entry.type === 'emploi-saisonnier') && entry.salaryNetAmount ? 
                              formatCurrency(entry.salaryNetAmount) :
                              entry.type === 'assurance-emploi' && entry.weeklyNet ?
                              formatCurrency(entry.weeklyNet) :
                              entry.type === 'rentes' && entry.pensionAmount ?
                              formatCurrency(entry.pensionAmount) :
                              entry.type === 'revenus-location' && entry.rentalAmount ?
                              formatCurrency(entry.rentalAmount) :
                              entry.annualAmount ? formatCurrency(entry.annualAmount) : '-'
                            }
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Fréquence - ligne par ligne */}
                    <div className="senior-field-inline">
                      <label>{isFrench ? 'Fréquence' : 'Frequency'}</label>
                      {isEditing ? (
                        <div className="flex gap-2">
                          {(entry.type === 'salaire' || entry.type === 'emploi-saisonnier') && (
                            <Select
                              value={entry.salaryFrequency || 'monthly'}
                              onValueChange={(value) => updateIncomeEntry(entry.id, { salaryFrequency: value as any })}
                            >
                              <SelectTrigger
                                className="p-2 border-2 border-gray-300 rounded-lg text-[1.05rem] font-semibold w-40"
                                aria-label={isFrench ? 'Fréquence de salaire' : 'Salary frequency'}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-4 border-gray-300" style={{zIndex: 9999}} position="item-aligned" side="bottom" align="start" avoidCollisions={false} sticky="always">
                                {salaryFrequencies.map(freq => (
                                  <SelectItem key={freq.value} value={freq.value} className="text-xl py-4">
                                    {freq.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {entry.type === 'rentes' && (
                            <Select
                              value={entry.pensionFrequency || 'monthly'}
                              onValueChange={(value) => updateIncomeEntry(entry.id, { pensionFrequency: value as any })}
                            >
                              <SelectTrigger
                                className="senior-form-input"
                                aria-label={isFrench ? 'Fréquence de rente' : 'Pension frequency'}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-4 border-gray-300" style={{zIndex: 9999}} position="item-aligned" side="bottom" align="start" avoidCollisions={false} sticky="always">
                                {pensionFrequencies.map(freq => (
                                  <SelectItem key={freq.value} value={freq.value} className="text-xl py-4">
                                    {freq.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {(entry.type === 'dividendes' || entry.type === 'travail-autonome' || entry.type === 'autres') && (
                            <div className="p-4 bg-gray-100 border-4 border-gray-200 rounded-lg">
                              <span className="text-lg text-gray-600">{isFrench ? 'Annuel' : 'Annual'}</span>
                            </div>
                          )}
                          {entry.type === 'revenus-location' && (
                            <div className="relative w-full">
                              <select
                                aria-label={isFrench ? 'Fréquence de location' : 'Rental frequency'}
                                value={entry.rentalFrequency || 'monthly'}
                                onChange={(e) => updateIncomeEntry(entry.id, { rentalFrequency: e.target.value as any })}
                                className="w-full p-4 text-xl border-4 border-gray-300 rounded-lg focus:border-blue-500 bg-white appearance-none cursor-pointer relative z-10"
                                style={{
                                  position: 'relative',
                                  zIndex: 10,
                                  top: 'auto',
                                  left: 'auto',
                                  right: 'auto',
                                  bottom: 'auto',
                                  transform: 'none',
                                  marginTop: 0,
                                  marginBottom: 0
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                              >
                                {rentalFrequencies.map(freq => (
                                  <option key={freq.value} value={freq.value} className="text-xl py-2 bg-white">
                                    {freq.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-white border-4 border-gray-200 rounded-lg">
                          <div className="text-lg text-gray-600">
                            {(entry.type === 'salaire' || entry.type === 'emploi-saisonnier') ? (
                              salaryFrequencies.find(f => f.value === entry.salaryFrequency)?.label || '-'
                            ) : entry.type === 'assurance-emploi' ? (
                              eiPaymentFrequencies.find(f => f.value === entry.eiPaymentFrequency)?.label || (isFrench ? 'Hebdomadaire' : 'Weekly')
                            ) : entry.type === 'rentes' ? (
                              pensionFrequencies.find(f => f.value === entry.pensionFrequency)?.label || '-'
                            ) : entry.type === 'revenus-location' ? (
                              rentalFrequencies.find(f => f.value === entry.rentalFrequency)?.label || (isFrench ? 'Mensuel' : 'Monthly')
                            ) : (
                              isFrench ? 'Annuel' : 'Annual'
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Troisième ligne - Dates - ligne par ligne multi-colonnes */}
                  <div className="mpr-form-row cols-2 mb-6">
                    {/* Date de début */}
                    <div className="senior-field-inline">
                      <label className="senior-form-label">
                        {isFrench ? 'Date de début' : 'Start Date'}
                      </label>
                      {isEditing ? (
                        <DateInput
                          value={
                            entry.type === 'salaire' || entry.type === 'emploi-saisonnier' ? (entry.salaryStartDate || '') :
                            entry.type === 'assurance-emploi' ? (entry.eiStartDate || '') :
                            entry.type === 'rentes' ? (entry.pensionStartDate || '') :
                            entry.type === 'revenus-location' ? (entry.rentalStartDate || '') :
                            ''
                          }
                          onChange={(value) => {
                            if (entry.type === 'salaire' || entry.type === 'emploi-saisonnier') {
                              updateIncomeEntry(entry.id, { salaryStartDate: value });
                            } else if (entry.type === 'assurance-emploi') {
                              updateIncomeEntry(entry.id, { eiStartDate: value });
                            } else if (entry.type === 'rentes') {
                              updateIncomeEntry(entry.id, { pensionStartDate: value });
                            } else if (entry.type === 'revenus-location') {
                              updateIncomeEntry(entry.id, { rentalStartDate: value });
                            }
                          }}
                          placeholder="AAAA-MM-JJ"
                          className="senior-form-input"
                        />
                      ) : (
                        <div className="text-lg text-blue-900 font-semibold">
                          {entry.type === 'salaire' || entry.type === 'emploi-saisonnier' ? (entry.salaryStartDate || '-') :
                           entry.type === 'assurance-emploi' ? (entry.eiStartDate || '-') :
                           entry.type === 'rentes' ? (entry.pensionStartDate || '-') :
                           entry.type === 'revenus-location' ? (entry.rentalStartDate || '-') :
                           '-'
                          }
                        </div>
                      )}
                    </div>
                    
                    {/* Date de fin */}
                    <div className="senior-field-inline">
                      <label className="senior-form-label">
                        {isFrench ? 'Date de fin' : 'End Date'}
                      </label>
                      {isEditing ? (
                        <DateInput
                          value={
                            entry.type === 'salaire' || entry.type === 'emploi-saisonnier' ? (entry.salaryEndDate || '') :
                            entry.type === 'revenus-location' ? (entry.rentalEndDate || '') :
                            ''
                          }
                          onChange={(value) => {
                            if (entry.type === 'salaire' || entry.type === 'emploi-saisonnier') {
                              updateIncomeEntry(entry.id, { salaryEndDate: value });
                            } else if (entry.type === 'revenus-location') {
                              updateIncomeEntry(entry.id, { rentalEndDate: value });
                            }
                          }}
                          placeholder="AAAA-MM-JJ"
                          className="senior-form-input"
                        />
                      ) : (
                        <div className="text-lg text-red-900 font-semibold">
                          {entry.type === 'salaire' || entry.type === 'emploi-saisonnier' ? (entry.salaryEndDate || '-') :
                           entry.type === 'revenus-location' ? (entry.rentalEndDate || '-') :
                           '-'
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions - DISPOSITION SENIOR */}
                  <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex gap-3 items-center">
                      {/* Statut / Validation */}
                      {isEditing ? (
                        <button
                          onClick={() => {
                            setEditingId(null);
                            // Afficher une confirmation visuelle
                            alert(isFrench ? '✅ Modifications sauvegardées !' : '✅ Changes saved!');
                          }}
                          title={isFrench ? 'Valider et sauvegarder les modifications' : 'Validate and save changes'}
                          className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-white hover:opacity-80 transition-opacity"
                          style={{backgroundColor: 'var(--senior-success)'}}
                        >
                          <CheckCircle className="w-6 h-6" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateIncomeEntry(entry.id, { isActive: !entry.isActive })}
                          title={entry.isActive ? (isFrench ? 'Désactiver ce revenu' : 'Deactivate this income') : (isFrench ? 'Activer ce revenu' : 'Activate this income')}
                          className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-white hover:opacity-80 transition-opacity"
                          style={{backgroundColor: entry.isActive ? 'var(--senior-success)' : 'var(--senior-text-muted)'}}
                        >
                          {entry.isActive ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </button>
                      )}
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingId(isEditing ? null : entry.id)}
                          title={isEditing ? (isFrench ? 'Arrêter l\'édition' : 'Stop editing') : (isFrench ? 'Modifier ce revenu' : 'Edit this income')}
                          className="w-12 h-12 text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                          style={{backgroundColor: 'var(--senior-primary)'}}
                        >
                          {isEditing ? <X className="w-6 h-6" /> : <Edit className="w-6 h-6" />}
                        </button>
                        <button
                          onClick={() => removeIncomeEntry(entry.id)}
                          title={isFrench ? 'Supprimer ce revenu' : 'Delete this income'}
                          className="w-12 h-12 text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                          style={{backgroundColor: 'var(--senior-danger)'}}
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center">
            <Button
              onClick={addIncomeEntry}
              size="lg"
              className="text-white text-xl px-8 py-4 h-16 shadow-lg hover:opacity-80 transition-opacity"
              style={{backgroundColor: 'var(--senior-success)'}}
            >
              <Plus className="w-6 h-6 mr-3" />
              {isFrench ? 'Ajouter un revenu' : 'Add Income'}
            </Button>
          </div>
        </CardContent>
      </Card>
      </TooltipProvider>
    </>
  );
};

export default SeniorsFriendlyIncomeTable;
