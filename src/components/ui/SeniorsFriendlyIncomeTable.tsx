import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  CheckCircle,
  Edit,
  HelpCircle,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DateInput from '@/components/ui/DateInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import MoneyInput from '@/components/ui/MoneyInput';
import { CriticalDataFix } from '@/services/CriticalDataFix';
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
  const entryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
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
  useEffect(() => {
    if (editingId && entryRefs.current[editingId]) {
      entryRefs.current[editingId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [editingId]);

  
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
      color: 'bg-mpr-interactive',
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
      color: 'bg-mpr-interactive',
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
  
  const filteredEntries = incomeEntries.filter(e => e.type !== 'assurance-emploi');

  const fieldLabelClasses = 'text-sm font-semibold text-mpr-navy';
  const fieldWrapperClasses = 'space-y-2';
  const inputClasses = 'w-full h-14 rounded-xl border-2 border-mpr-border bg-white px-4 text-lg font-medium text-mpr-navy transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mpr-border focus:border-mpr-interactive';
  const readOnlyClasses = 'w-full h-14 rounded-xl border-2 border-mpr-border bg-mpr-interactive-lt flex items-center px-4 text-lg font-semibold text-mpr-navy';
  const statusChipClasses = 'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold';
  
  return (
    <>
      <TooltipProvider>
      <Card className="bg-white border-4 border-mpr-border shadow-xl">
        <CardHeader className="border-b-4 border-mpr-border bg-mpr-interactive-lt">
          <CardTitle className="text-3xl font-bold text-mpr-navy flex items-center gap-4">
            <div className={`w-12 h-12 ${personNumber === 1 ? 'bg-mpr-interactive' : 'bg-green-600'} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
              {personNumber}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-mpr-interactive" />
                <span>{isFrench ? 'Tableau des revenus' : 'Income Table'} - {personName}</span>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-6 h-6 text-mpr-interactive cursor-help" />
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
          <CardDescription className="text-xl text-mpr-navy mt-2">
            {isFrench 
              ? 'Gestion unifiée de tous vos types de revenus avec calculs automatiques'
              : 'Unified management of all your income types with automatic calculations'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6 relative overflow-visible">
          {/* En-tête du tableau - Version Senior */}
          <div className="grid grid-cols-8 gap-4 text-xl font-bold text-mpr-navy border-b-4 border-mpr-border pb-4">
            <div className="col-span-2">{isFrench ? 'Type de revenu' : 'Income Type'}</div>
            <div className="col-span-2">{isFrench ? 'Description' : 'Description'}</div>
            <div className="col-span-2">{isFrench ? 'Montant' : 'Amount'}</div>
            <div className="col-span-2">{isFrench ? 'fréquence' : 'frequency'}</div>
          </div>
          
          {/* Lignes de revenus - Version Senior */}
          {filteredEntries.length === 0 ? (
            <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 rounded-xl border border-mpr-border">
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
          ) : (
            <div className="space-y-6">
              {filteredEntries.map((entry) => {
                const typeInfo = getIncomeTypeInfo(entry.type);
                const isEditing = editingId === entry.id;
                const isSalary = entry.type === 'salaire' || entry.type === 'emploi-saisonnier';
                const isEi = entry.type === 'assurance-emploi';
                const isPension = entry.type === 'rentes';
                const isRental = entry.type === 'revenus-location';
                const selectableIncomeTypes = incomeTypes.filter(type => type.value === entry.type || (type.value !== 'assurance-emploi' && type.value !== 'rentes' && type.value !== 'autres'));

                const cardClasses = isEditing
                  ? 'border-mpr-border bg-white shadow-xl ring-2 ring-mpr-border'
                  : entry.isActive
                    ? 'border-green-200 bg-white shadow-md'
                    : 'border-gray-200 bg-gray-100 opacity-70';

                const amountDisplay = (() => {
                  if (isSalary && entry.salaryNetAmount) return formatCurrency(entry.salaryNetAmount);
                  if (entry.type === 'assurance-emploi' && entry.weeklyNet) return formatCurrency(entry.weeklyNet);
                  if (isPension && entry.pensionAmount) return formatCurrency(entry.pensionAmount);
                  if (isRental && entry.rentalAmount) return formatCurrency(entry.rentalAmount);
                  if (entry.annualAmount) return formatCurrency(entry.annualAmount);
                  return '-';
                })();

                const frequencyLabel = (() => {
                  if (isSalary) {
                    const freq = salaryFrequencies.find(f => f.value === entry.salaryFrequency);
                    return freq ? freq.label : '-';
                  }
                  if (entry.type === 'assurance-emploi') {
                    const freq = eiPaymentFrequencies.find(f => f.value === entry.eiPaymentFrequency);
                    return freq ? freq.label : '-';
                  }
                  if (isPension) {
                    const freq = pensionFrequencies.find(f => f.value === entry.pensionFrequency);
                    return freq ? freq.label : '-';
                  }
                  if (isRental) {
                    const freq = rentalFrequencies.find(f => f.value === entry.rentalFrequency);
                    return freq ? freq.label : (isFrench ? 'Mensuel' : 'Monthly');
                  }
                  return isFrench ? 'Annuel' : 'Annual';
                })();

                const startDateValue = (() => {
                  if (isSalary) return entry.salaryStartDate || '';
                  if (entry.type === 'assurance-emploi') return entry.eiStartDate || '';
                  if (isPension) return entry.pensionStartDate || '';
                  if (isRental) return entry.rentalStartDate || '';
                  return '';
                })();

                const endDateValue = (() => {
                  if (isSalary) return entry.salaryEndDate || '';
                  if (isRental) return entry.rentalEndDate || '';
                  return '';
                })();

                const showStartDateField = isSalary || isEi || isPension || isRental;
                const showEndDateField = isSalary || isRental;

                const startLabel = isFrench
                  ? (isEi ? 'Début des prestations' : 'Date de début')
                  : (isEi ? 'Start of benefits' : 'Start date');
                const endLabel = isFrench ? 'Date de fin' : 'End date';

                return (
                  <div 
                    ref={(el) => { 
                      if (el) { 
                        entryRefs.current[entry.id] = el; 
                      } else { 
                        delete entryRefs.current[entry.id]; 
                      } 
                    }} 
                    key={entry.id} 
                    className={`rounded-3xl border-2 transition ${cardClasses}`}
                  >
                    <div className="p-6 space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-2xl font-semibold text-mpr-navy flex items-center gap-3">
                          <span className="text-3xl leading-none">{typeInfo.icon}</span>
                          <span>{typeInfo.label} — {entry.description || (isFrench ? 'Sans nom' : 'Unnamed')}</span>
                        </h3>
                        <span className={`${statusChipClasses} ${entry.isActive ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 bg-white text-gray-600'}`}>
                          {entry.isActive ? (isFrench ? 'Actif' : 'Active') : (isFrench ? 'Inactif' : 'Inactive')}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="space-y-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className={fieldWrapperClasses}>
                              <span className={fieldLabelClasses}>{isFrench ? 'Type de revenu' : 'Income type'}</span>
                              <Select
                                value={entry.type}
                                onValueChange={(value) => updateIncomeEntry(entry.id, { type: value as IncomeEntry['type'] })}
                              >
                                <SelectTrigger className={`${inputClasses} justify-between`}>
                                  <SelectValue placeholder={isFrench ? 'Choisir le type' : 'Select a type'} />
                                </SelectTrigger>
                                <SelectContent className="bg-white" align="start" position="popper" sideOffset={12} collisionPadding={16}>
                                  {selectableIncomeTypes.map(type => (
                                    <SelectItem key={type.value} value={type.value} className="text-lg">
                                      {type.icon} {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className={fieldWrapperClasses}>
                              <span className={fieldLabelClasses}>{isFrench ? 'Description' : 'Description'}</span>
                              <Input
                                value={entry.description}
                                onChange={(e) => updateIncomeEntry(entry.id, { description: e.target.value })}
                                placeholder={isFrench ? 'Description...' : 'Description...'}
                                className={inputClasses}
                              />
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className={fieldWrapperClasses}>
                              <span className={fieldLabelClasses}>{isFrench ? 'Montant' : 'Amount'}</span>
                              <MoneyInput
                                value={
                                  isSalary ? (entry.salaryNetAmount || 0) :
                                  entry.type === 'assurance-emploi' ? (entry.weeklyNet || 0) :
                                  isPension ? (entry.pensionAmount || 0) :
                                  isRental ? (entry.rentalAmount || 0) :
                                  entry.annualAmount || 0
                                }
                                onChange={(value) => {
                                  if (isSalary) {
                                    updateIncomeEntry(entry.id, { salaryNetAmount: value });
                                  } else if (entry.type === 'assurance-emploi') {
                                    updateIncomeEntry(entry.id, { weeklyNet: value });
                                  } else if (isPension) {
                                    updateIncomeEntry(entry.id, { pensionAmount: value });
                                  } else if (isRental) {
                                    updateIncomeEntry(entry.id, { rentalAmount: value });
                                  } else {
                                    updateIncomeEntry(entry.id, { annualAmount: value });
                                  }
                                }}
                                className={`${inputClasses} pl-10`}
                                placeholder="0"
                                allowDecimals={true}
                              />
                            </div>

                            <div className={fieldWrapperClasses}>
                              <span className={fieldLabelClasses}>{isFrench ? 'Fréquence' : 'Frequency'}</span>
                              {isSalary && (
                                <Select
                                  value={entry.salaryFrequency || 'monthly'}
                                  onValueChange={(value) => updateIncomeEntry(entry.id, { salaryFrequency: value as IncomeEntry['salaryFrequency'] })}
                                >
                                  <SelectTrigger className={`${inputClasses} justify-between`}>
                                    <SelectValue placeholder={isFrench ? 'Choisir une fréquence' : 'Select a frequency'} />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white" align="start" position="popper" sideOffset={12} collisionPadding={16}>
                                    {salaryFrequencies.map(freq => (
                                      <SelectItem key={freq.value} value={freq.value} className="text-lg py-3">
                                        {freq.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                              {isPension && (
                                <Select
                                  value={entry.pensionFrequency || 'monthly'}
                                  onValueChange={(value) => updateIncomeEntry(entry.id, { pensionFrequency: value as IncomeEntry['pensionFrequency'] })}
                                >
                                  <SelectTrigger className={`${inputClasses} justify-between`}>
                                    <SelectValue placeholder={isFrench ? 'Choisir une fréquence' : 'Select a frequency'} />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white" align="start" position="popper" sideOffset={12} collisionPadding={16}>
                                    {pensionFrequencies.map(freq => (
                                      <SelectItem key={freq.value} value={freq.value} className="text-lg py-3">
                                        {freq.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                              {isRental && (
                                <Select
                                  value={entry.rentalFrequency || 'monthly'}
                                  onValueChange={(value) => updateIncomeEntry(entry.id, { rentalFrequency: value as IncomeEntry['rentalFrequency'] })}
                                >
                                  <SelectTrigger className={`${inputClasses} justify-between`}>
                                    <SelectValue placeholder={isFrench ? 'Choisir une fréquence' : 'Select a frequency'} />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white" align="start" position="popper" sideOffset={12} collisionPadding={16}>
                                    {rentalFrequencies.map(freq => (
                                      <SelectItem key={freq.value} value={freq.value} className="text-lg py-3">
                                        {freq.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                              {!isSalary && !isPension && !isRental && (
                                <div className={readOnlyClasses}>{frequencyLabel}</div>
                              )}
                            </div>
                          </div>

                          {(showStartDateField || showEndDateField) && (
                            <div className="grid gap-4 md:grid-cols-2">
                              {showStartDateField && (
                                <div className={fieldWrapperClasses}>
                                  <span className={fieldLabelClasses}>{startLabel}</span>
                                  <DateInput
                                    value={startDateValue}
                                    onChange={(value) => {
                                      if (isSalary) {
                                        updateIncomeEntry(entry.id, { salaryStartDate: value });
                                      } else if (entry.type === 'assurance-emploi') {
                                        updateIncomeEntry(entry.id, { eiStartDate: value });
                                      } else if (isPension) {
                                        updateIncomeEntry(entry.id, { pensionStartDate: value });
                                      } else if (isRental) {
                                        updateIncomeEntry(entry.id, { rentalStartDate: value });
                                      }
                                    }}
                                    className={inputClasses}
                                    placeholder="AAAA-MM-JJ"
                                  />
                                </div>
                              )}
                              {showEndDateField && (
                                <div className={fieldWrapperClasses}>
                                  <span className={fieldLabelClasses}>{endLabel}</span>
                                  <DateInput
                                    value={endDateValue}
                                    onChange={(value) => {
                                      if (isSalary) {
                                        updateIncomeEntry(entry.id, { salaryEndDate: value });
                                      } else if (isRental) {
                                        updateIncomeEntry(entry.id, { rentalEndDate: value });
                                      }
                                    }}
                                    className={inputClasses}
                                    placeholder="AAAA-MM-JJ"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className={fieldWrapperClasses}>
                            <span className={fieldLabelClasses}>{isFrench ? 'Type de revenu' : 'Income type'}</span>
                            <div className={readOnlyClasses}>{typeInfo.icon} {typeInfo.label}</div>
                          </div>
                          <div className={fieldWrapperClasses}>
                            <span className={fieldLabelClasses}>{isFrench ? 'Description' : 'Description'}</span>
                            <div className={readOnlyClasses}>{entry.description || (isFrench ? 'Sans nom' : 'Unnamed')}</div>
                          </div>
                          <div className={fieldWrapperClasses}>
                            <span className={fieldLabelClasses}>{isFrench ? 'Montant' : 'Amount'}</span>
                            <div className={readOnlyClasses}>{amountDisplay}</div>
                          </div>
                          <div className={fieldWrapperClasses}>
                            <span className={fieldLabelClasses}>{isFrench ? 'Fréquence' : 'Frequency'}</span>
                            <div className={readOnlyClasses}>{frequencyLabel}</div>
                          </div>
                          {startDateValue && (
                            <div className={fieldWrapperClasses}>
                              <span className={fieldLabelClasses}>{startLabel}</span>
                              <div className={readOnlyClasses}>{startDateValue}</div>
                            </div>
                          )}
                          {endDateValue && (
                            <div className={fieldWrapperClasses}>
                              <span className={fieldLabelClasses}>{endLabel}</span>
                              <div className={readOnlyClasses}>{endDateValue}</div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-mpr-border pt-4">
                        <div>
                          <Button
                            onClick={() => updateIncomeEntry(entry.id, { isActive: !entry.isActive })}
                            className={`h-11 rounded-xl px-4 text-sm font-semibold shadow-sm ${entry.isActive ? 'bg-green-50 text-green-700 border border-green-400 hover:bg-green-100' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'}`}
                          >
                            {entry.isActive ? (isFrench ? 'Revenu actif' : 'Income active') : (isFrench ? 'Activer ce revenu' : 'Activate income')}
                          </Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          {isEditing ? (
                            <>
                              <Button
                                onClick={() => setEditingId(null)}
                                className="h-12 rounded-xl bg-green-500 px-6 text-white text-base font-semibold shadow hover:bg-green-600 focus-visible:ring-2 focus-visible:ring-green-300"
                              >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                {isFrench ? 'Sauvegarder' : 'Save'}
                              </Button>
                              <Button
                                onClick={() => setEditingId(null)}
                                className="h-12 rounded-xl bg-mpr-interactive px-6 text-white text-base font-semibold shadow hover:bg-mpr-interactive focus-visible:ring-2 focus-visible:ring-mpr-interactive"
                              >
                                <X className="w-5 h-5 mr-2" />
                                {isFrench ? 'Annuler' : 'Cancel'}
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={addIncomeEntry}
                                className="h-12 rounded-xl bg-green-500 px-6 text-white text-base font-semibold shadow hover:bg-green-600 focus-visible:ring-2 focus-visible:ring-green-300"
                              >
                                <Plus className="w-5 h-5 mr-2" />
                                {isFrench ? 'Ajouter' : 'Add'}
                              </Button>
                              <Button
                                onClick={() => setEditingId(entry.id)}
                                className="h-12 rounded-xl bg-mpr-interactive px-6 text-white text-base font-semibold shadow hover:bg-mpr-interactive focus-visible:ring-2 focus-visible:ring-mpr-interactive"
                              >
                                <Edit className="w-5 h-5 mr-2" />
                                {isFrench ? 'Modifier' : 'Edit'}
                              </Button>
                            </>
                          )}
                          <Button
                            onClick={() => removeIncomeEntry(entry.id)}
                            className="h-12 rounded-xl bg-red-500 px-6 text-white text-base font-semibold shadow hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-300"
                          >
                            <Trash2 className="w-5 h-5 mr-2" />
                            {isFrench ? 'Supprimer' : 'Delete'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      </TooltipProvider>
    </>
  );
};

export default SeniorsFriendlyIncomeTable;
