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

export interface IncomeEntry {
  id: string;
  type: 'salaire' | 'rentes' | 'assurance-emploi' | 'dividendes' | 'revenus-location' | 'travail-autonome' | 'autres';
  description: string;
  
  // Montants selon la fréquence
  annualAmount?: number;
  monthlyAmount?: number;
  weeklyAmount?: number;
  
  // Spécifique au salaire
  salaryStartDate?: string; // Date de début d'emploi
  salaryEndDate?: string; // Date de fin d'emploi
  salaryFirstPaymentDate?: string; // Date du premier versement
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
}

const SeniorsFriendlyIncomeTable: React.FC<SeniorsFriendlyIncomeTableProps> = ({
  personNumber,
  personName,
  data = [],
  onDataChange,
  isFrench
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
  
  // Calcul du montant "à ce jour" pour l'assurance emploi
  const calculateEIToDate = (entry: IncomeEntry): number => {
    if (entry.type !== 'assurance-emploi' || !entry.eiStartDate || !entry.weeklyNet) {
      return 0;
    }
    
    const startDate = new Date(entry.eiStartDate);
    const currentDate = new Date();
    const endDate = entry.eiEligibleWeeks ? 
      new Date(startDate.getTime() + (entry.eiEligibleWeeks * 7 * 24 * 60 * 60 * 1000)) : 
      currentDate;
    
    // Calculer le nombre de semaines écoulées
    const actualEndDate = endDate < currentDate ? endDate : currentDate;
    const diffTime = actualEndDate.getTime() - startDate.getTime();
    const weeksElapsed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)));
    
    // Limiter par les semaines éligibles si spécifié
    const effectiveWeeks = entry.eiEligibleWeeks ? Math.min(weeksElapsed, entry.eiEligibleWeeks) : weeksElapsed;
    
    // Calculer le montant total en tenant compte de la révision (si applicable)
    let totalAmount = 0;
    
    if (entry.eiRevisionDate && entry.eiRevisionAmount) {
      const revisionDate = new Date(entry.eiRevisionDate);
      
      // Période avant révision
      const weeksBeforeRevision = Math.max(0, Math.floor((revisionDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)));
      const effectiveWeeksBeforeRevision = Math.min(weeksBeforeRevision, effectiveWeeks);
      totalAmount += effectiveWeeksBeforeRevision * entry.weeklyNet;
      
      // Période après révision
      const weeksAfterRevision = Math.max(0, effectiveWeeks - effectiveWeeksBeforeRevision);
      totalAmount += weeksAfterRevision * entry.eiRevisionAmount;
    } else {
      // Pas de révision - calcul normal
      totalAmount = effectiveWeeks * entry.weeklyNet;
    }
    
    return totalAmount;
  };
  
  // Calcul du montant annuel projeté
  const calculateProjectedAnnual = (entry: IncomeEntry): number => {
    switch (entry.type) {
      case 'salaire':
        if (entry.salaryNetAmount && entry.salaryFrequency) {
          // Calculer le nombre de paiements dans l'année en tenant compte des dates
          const currentYear = new Date().getFullYear();
          const yearStart = new Date(currentYear, 0, 1);
          const yearEnd = new Date(currentYear, 11, 31);
          
          // Déterminer la période effective
          let effectiveStart = yearStart;
          let effectiveEnd = yearEnd;
          
          if (entry.salaryStartDate) {
            const startDate = new Date(entry.salaryStartDate);
            if (startDate > yearStart) {
              effectiveStart = startDate;
            }
          }
          
          if (entry.salaryEndDate) {
            const endDate = new Date(entry.salaryEndDate);
            if (endDate < yearEnd) {
              effectiveEnd = endDate;
            }
          }
          
          // Calculer le montant total en tenant compte de la révision salariale
          let totalAmount = 0;
          
          // Période avant révision (si applicable)
          if (entry.salaryRevisionDate) {
            const revisionDate = new Date(entry.salaryRevisionDate);
            const preRevisionEnd = revisionDate > effectiveStart ? revisionDate : effectiveEnd;
            
            const daysBeforeRevision = Math.max(0, Math.floor((preRevisionEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)));
            let paymentsBeforeRevision = 0;
            
            switch (entry.salaryFrequency) {
              case 'weekly':
                paymentsBeforeRevision = Math.floor(daysBeforeRevision / 7);
                break;
              case 'biweekly':
                paymentsBeforeRevision = Math.floor(daysBeforeRevision / 14);
                break;
              case 'bimonthly':
                paymentsBeforeRevision = Math.floor(daysBeforeRevision / 15);
                break;
              case 'monthly':
                paymentsBeforeRevision = Math.floor(daysBeforeRevision / 30);
                break;
            }
            
            totalAmount += entry.salaryNetAmount * paymentsBeforeRevision;
            
            // Période après révision
            if (revisionDate < effectiveEnd && entry.salaryRevisionAmount) {
              const daysAfterRevision = Math.max(0, Math.floor((effectiveEnd.getTime() - revisionDate.getTime()) / (1000 * 60 * 60 * 24)));
              const revisionFrequency = entry.salaryRevisionFrequency || entry.salaryFrequency;
              let paymentsAfterRevision = 0;
              
              switch (revisionFrequency) {
                case 'weekly':
                  paymentsAfterRevision = Math.floor(daysAfterRevision / 7);
                  break;
                case 'biweekly':
                  paymentsAfterRevision = Math.floor(daysAfterRevision / 14);
                  break;
                case 'bimonthly':
                  paymentsAfterRevision = Math.floor(daysAfterRevision / 15);
                  break;
                case 'monthly':
                  paymentsAfterRevision = Math.floor(daysAfterRevision / 30);
                  break;
              }
              
              totalAmount += entry.salaryRevisionAmount * paymentsAfterRevision;
            }
          } else {
            // Pas de révision - calcul normal
            const daysInPeriod = Math.max(0, Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)));
            let paymentsInPeriod = 0;
            
            switch (entry.salaryFrequency) {
              case 'weekly':
                paymentsInPeriod = Math.floor(daysInPeriod / 7);
                break;
              case 'biweekly':
                paymentsInPeriod = Math.floor(daysInPeriod / 14);
                break;
              case 'bimonthly':
                paymentsInPeriod = Math.floor(daysInPeriod / 15);
                break;
              case 'monthly':
                paymentsInPeriod = Math.floor(daysInPeriod / 30);
                break;
            }
            
            totalAmount = entry.salaryNetAmount * paymentsInPeriod;
          }
          
          return Math.max(0, totalAmount);
        }
        return entry.annualAmount || 0;
      
      case 'rentes':
        if (entry.pensionAmount && entry.pensionFrequency) {
          switch (entry.pensionFrequency) {
            case 'monthly':
              return entry.pensionAmount * 12;
            case 'quarterly':
              return entry.pensionAmount * 4;
            case 'semi-annual':
              return entry.pensionAmount * 2;
            case 'annual':
              return entry.pensionAmount;
            default:
              return 0;
          }
        }
        return (entry.monthlyAmount || 0) * 12;
      
      case 'assurance-emploi':
        if (!entry.weeklyNet || !entry.eiStartDate) return 0;
        
        const startDate = new Date(entry.eiStartDate);
        const currentYear = new Date().getFullYear();
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31);
        
        // Calculer les semaines dans l'année
        const effectiveStart = startDate > yearStart ? startDate : yearStart;
        const effectiveEnd = entry.eiEligibleWeeks ? 
          (new Date(effectiveStart.getTime() + (entry.eiEligibleWeeks * 7 * 24 * 60 * 60 * 1000)) < yearEnd ? 
            new Date(effectiveStart.getTime() + (entry.eiEligibleWeeks * 7 * 24 * 60 * 60 * 1000)) : yearEnd) : 
          yearEnd;
        
        const weeksInYear = Math.max(0, Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24 * 7)));
        const maxWeeksInYear = entry.eiEligibleWeeks ? Math.min(weeksInYear, entry.eiEligibleWeeks) : weeksInYear;
        
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
  
  const updateIncomeEntry = useCallback((id: string, updates: Partial<IncomeEntry>) => {
    // Debug spécifique pour Personne 2
    if (personNumber === 2) {
      console.log(`🚨 UPDATE PERSONNE 2 - ID: ${id}, Updates:`, updates);
      console.log(`🚨 UPDATE PERSONNE 2 - Avant update:`, incomeEntries.find(e => e.id === id));
    }
    
    const updated = incomeEntries.map(entry => 
      entry.id === id ? { 
        ...entry, 
        ...updates,
        toDateAmount: entry.type === 'assurance-emploi' ? calculateEIToDate({ ...entry, ...updates }) : undefined,
        projectedAnnual: calculateProjectedAnnual({ ...entry, ...updates })
      } : entry
    );
    
    // Log de débogage pour vérifier que les nouveaux champs sont inclus
    if (updates.salaryRevisionDate || updates.salaryRevisionAmount || updates.salaryRevisionDescription) {
      console.log('🔄 Révision salariale mise à jour:', {
        id,
        updates,
        entry: updated.find(e => e.id === id)
      });
    }
    
    // Debug spécifique pour Personne 2
    if (personNumber === 2) {
      console.log(`🚨 UPDATE PERSONNE 2 - Après update:`, updated.find(e => e.id === id));
    }
    
    setIncomeEntries(updated);
    
    // Debug spécifique pour Personne 2
    if (personNumber === 2) {
      console.log(`🚨 ON DATA CHANGE PERSONNE 2 - Appel de onDataChange avec:`, updated);
    }
    
    onDataChange(updated);
  }, [incomeEntries, onDataChange, personNumber]);
  
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
  
  // Calcul du budget mensuel basé sur la fréquence de paiement
  const calculateMonthlyBudget = (entry: IncomeEntry): number => {
    if (entry.type === 'salaire' && entry.salaryNetAmount && entry.salaryFrequency) {
      // Vérifier si le salaire est encore actif selon les dates
      const currentDate = new Date();
      if (entry.salaryEndDate) {
        const endDate = new Date(entry.salaryEndDate);
        if (currentDate > endDate) {
          return 0; // Le salaire a pris fin
        }
      }
      
      if (entry.salaryStartDate) {
        const startDate = new Date(entry.salaryStartDate);
        if (currentDate < startDate) {
          return 0; // Le salaire n'a pas encore commencé
        }
      }
      
      // Le montant saisi est le montant total pour la période de fréquence
      switch (entry.salaryFrequency) {
        case 'weekly':
          return (entry.salaryNetAmount * 52) / 12; // Montant hebdomadaire × 52 semaines ÷ 12 mois
        case 'biweekly':
          return (entry.salaryNetAmount * 26) / 12; // Montant bi-hebdomadaire × 26 paiements ÷ 12 mois
        case 'bimonthly':
          return entry.salaryNetAmount * 2; // Montant bi-mensuel × 2 paiements par mois
        case 'monthly':
          return entry.salaryNetAmount; // Montant mensuel
        default:
          return 0;
      }
    }
    
    if (entry.type === 'assurance-emploi' && entry.weeklyNet && entry.eiPaymentFrequency) {
      // Le montant saisi est le montant total pour la période de fréquence
      switch (entry.eiPaymentFrequency) {
        case 'weekly':
          return (entry.weeklyNet * 52) / 12; // Montant hebdomadaire × 52 semaines ÷ 12 mois
        case 'biweekly':
          return (entry.weeklyNet * 26) / 12; // Montant bi-hebdomadaire × 26 paiements ÷ 12 mois
        default:
          return 0;
      }
    }
    
    if (entry.type === 'rentes' && entry.pensionAmount && entry.pensionFrequency) {
      switch (entry.pensionFrequency) {
        case 'monthly':
          return entry.pensionAmount;
        case 'quarterly':
          return entry.pensionAmount / 3; // Trimestriel = 1/3 du montant mensuel
        case 'semi-annual':
          return entry.pensionAmount / 6; // Semi-annuel = 1/6 du montant mensuel
        case 'annual':
          return entry.pensionAmount / 12; // Annuel = 1/12 du montant mensuel
        default:
          return 0;
      }
    }
    
    return 0;
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
      
      // Calculer le montant annuel basé sur le type et les champs spécifiques
      let annualAmount = 0;
      let monthlyAmount = 0;
      let weeklyAmount = 0;
      
      switch (entry.type) {
        case 'salaire':
          if (entry.salaryNetAmount && entry.salaryFrequency) {
            // Utiliser la même logique que calculateProjectedAnnual
            const currentYear = new Date().getFullYear();
            const yearStart = new Date(currentYear, 0, 1);
            const yearEnd = new Date(currentYear, 11, 31);
            
            let effectiveStart = yearStart;
            let effectiveEnd = yearEnd;
            
            if (entry.salaryStartDate) {
              const startDate = new Date(entry.salaryStartDate);
              if (startDate > yearStart) {
                effectiveStart = startDate;
              }
            }
            
            if (entry.salaryEndDate) {
              const endDate = new Date(entry.salaryEndDate);
              if (endDate < yearEnd) {
                effectiveEnd = endDate;
              }
            }
            
            const daysInPeriod = Math.max(0, Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)));
            
            // Le montant saisi est le montant total pour la période de fréquence
            let paymentsInPeriod = 0;
            switch (entry.salaryFrequency) {
              case 'weekly':
                paymentsInPeriod = Math.floor(daysInPeriod / 7);
                weeklyAmount = entry.salaryNetAmount; // Montant hebdomadaire
                break;
              case 'biweekly':
                paymentsInPeriod = Math.floor(daysInPeriod / 14);
                break;
              case 'bimonthly':
                paymentsInPeriod = Math.floor(daysInPeriod / 15);
                break;
              case 'monthly':
                paymentsInPeriod = Math.floor(daysInPeriod / 30);
                break;
            }
            
            annualAmount = Math.max(0, entry.salaryNetAmount * paymentsInPeriod);
            monthlyAmount = annualAmount / 12;
          } else {
            annualAmount = entry.annualAmount || 0;
            monthlyAmount = annualAmount / 12;
          }
          break;
          
        case 'rentes':
          if (entry.pensionAmount && entry.pensionFrequency) {
            switch (entry.pensionFrequency) {
              case 'monthly':
                annualAmount = entry.pensionAmount * 12;
                monthlyAmount = entry.pensionAmount;
                break;
              case 'quarterly':
                annualAmount = entry.pensionAmount * 4;
                monthlyAmount = entry.pensionAmount / 3;
                break;
              case 'semi-annual':
                annualAmount = entry.pensionAmount * 2;
                monthlyAmount = entry.pensionAmount / 6;
                break;
              case 'annual':
                annualAmount = entry.pensionAmount;
                monthlyAmount = entry.pensionAmount / 12;
                break;
            }
          } else {
            annualAmount = (entry.monthlyAmount || 0) * 12;
            monthlyAmount = entry.monthlyAmount || 0;
          }
          break;
          
        case 'assurance-emploi':
          if (entry.weeklyNet && entry.eiPaymentFrequency) {
            // Le montant saisi est le montant total pour la période de fréquence
            switch (entry.eiPaymentFrequency) {
              case 'weekly':
                annualAmount = entry.weeklyNet * 52; // Montant hebdomadaire × 52 semaines
                weeklyAmount = entry.weeklyNet; // Montant hebdomadaire
                monthlyAmount = annualAmount / 12;
                break;
              case 'biweekly':
                annualAmount = entry.weeklyNet * 26; // Montant bi-hebdomadaire × 26 paiements
                monthlyAmount = annualAmount / 12;
                break;
            }
          } else if (entry.weeklyNet) {
            // Fallback pour compatibilité
            annualAmount = entry.weeklyNet * 52;
            weeklyAmount = entry.weeklyNet;
            monthlyAmount = annualAmount / 12;
          }
          break;
          
        case 'dividendes':
        case 'travail-autonome':
        case 'autres':
          annualAmount = entry.annualAmount || 0;
          monthlyAmount = annualAmount / 12;
          break;
          
        case 'revenus-location':
          annualAmount = (entry.monthlyAmount || 0) * 12;
          monthlyAmount = entry.monthlyAmount || 0;
          break;
      }
      
      // Ajouter aux totaux
      totals.annual += annualAmount;
      totals.monthly += monthlyAmount;
      totals.weekly += weeklyAmount;
      
      if (entry.toDateAmount) {
        totals.toDate += entry.toDateAmount;
      }
      
      totals.projected += entry.projectedAnnual || 0;
    });
    
    return totals;
  };
  
  const totals = getTotalsByFrequency();
  
  // Log de débogage pour les totaux
  useEffect(() => {
    console.log(`🔍 SeniorsFriendlyIncomeTable Personne ${personNumber} - Totaux calculés:`, totals);
    console.log(`🔍 SeniorsFriendlyIncomeTable Personne ${personNumber} - Entrées actives:`, incomeEntries.filter(e => e.isActive));
  }, [totals, incomeEntries, personNumber]);
  
  return (
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
            <div className="col-span-2">{isFrench ? 'Montant et fréquence' : 'Amount & Frequency'}</div>
            <div className="col-span-2">{isFrench ? 'Statut et Actions' : 'Status & Actions'}</div>
          </div>
          
          {/* Lignes de revenus - Version Senior */}
          <div className="space-y-3">
            {incomeEntries.map((entry) => {
              const typeInfo = getIncomeTypeInfo(entry.type);
              const isEditing = editingId === entry.id;
              
              return (
                <div key={entry.id} className={`p-6 rounded-xl border-4 ${entry.isActive ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 opacity-60'} shadow-lg relative overflow-visible`}>
                  
                  {/* Ligne principale - Type et Description */}
                  <div className="grid grid-cols-8 gap-6 mb-6">
                    {/* Type de revenu */}
                    <div className="col-span-2">
                      <Label className="text-lg font-bold text-gray-700 mb-3 block">
                        {isFrench ? 'Type de revenu' : 'Income Type'}
                      </Label>
                      {isEditing ? (
                        <select
                          value={entry.type}
                          onChange={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateIncomeEntry(entry.id, { type: e.target.value as any });
                          }}
                          onFocus={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="bg-white border-4 border-gray-300 text-gray-900 h-16 text-xl w-full px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          title={isFrench ? 'Sélectionner le type de revenu' : 'Select income type'}
                        >
                          {incomeTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center gap-3 p-4 bg-white border-4 border-gray-200 rounded-lg">
                          <span className="text-3xl">{typeInfo.icon}</span>
                          <span className="text-xl text-gray-800 font-bold">{typeInfo.label}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Description */}
                    <div className="col-span-2">
                      <Label className="text-lg font-bold text-gray-700 mb-3 block">
                        {isFrench ? 'Description' : 'Description'}
                      </Label>
                      {isEditing ? (
                        <Input
                          value={entry.description}
                          onChange={(e) => updateIncomeEntry(entry.id, { description: e.target.value })}
                          className="bg-white border-4 border-gray-300 text-gray-900 h-16 text-xl"
                          placeholder={isFrench ? 'Description...' : 'Description...'}
                        />
                      ) : (
                        <div className="p-4 bg-white border-4 border-gray-200 rounded-lg">
                          <span className="text-xl text-gray-800 font-bold">
                            {entry.description || (isFrench ? 'Sans nom' : 'Unnamed')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Montant et fréquence */}
                    <div className="col-span-2">
                      <Label className="text-lg font-bold text-gray-700 mb-3 block">
                        {isFrench ? 'Montant et fréquence' : 'Amount & Frequency'}
                      </Label>
                      {isEditing ? (
                        <div className="space-y-3">
                          <MoneyInput
                            value={
                              entry.type === 'salaire' ? (entry.salaryNetAmount || 0) :
                              entry.type === 'assurance-emploi' ? (entry.weeklyNet || 0) :
                              entry.type === 'rentes' ? (entry.pensionAmount || 0) :
                              0
                            }
                            onChange={(value) => {
                              if (entry.type === 'salaire') {
                                updateIncomeEntry(entry.id, { salaryNetAmount: value });
                              } else if (entry.type === 'assurance-emploi') {
                                updateIncomeEntry(entry.id, { weeklyNet: value });
                              } else if (entry.type === 'rentes') {
                                updateIncomeEntry(entry.id, { pensionAmount: value });
                              }
                            }}
                            className="bg-white border-4 border-gray-300 text-gray-900 h-16 text-xl"
                            placeholder="0"
                            allowDecimals={true}
                          />
                          {entry.type === 'salaire' && (
                            <Select
                              value={entry.salaryFrequency || 'monthly'}
                              onValueChange={(value) => updateIncomeEntry(entry.id, { salaryFrequency: value as any })}
                            >
                              <SelectTrigger className="bg-white border-4 border-gray-300 text-gray-900 h-16 text-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-4 border-gray-300 z-[99999]" position="popper" sideOffset={5} align="start" avoidCollisions={true} onCloseAutoFocus={(e) => e.preventDefault()}>
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
                              <SelectTrigger className="bg-white border-4 border-gray-300 text-gray-900 h-16 text-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-4 border-gray-300 z-[99999]" position="popper" sideOffset={5} align="start" avoidCollisions={true} onCloseAutoFocus={(e) => e.preventDefault()}>
                                {pensionFrequencies.map(freq => (
                                  <SelectItem key={freq.value} value={freq.value} className="text-xl py-4">
                                    {freq.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-white border-4 border-gray-200 rounded-lg space-y-2">
                          <div className="text-xl text-gray-800 font-bold">
                            {entry.type === 'salaire' && entry.salaryNetAmount ? 
                              formatCurrency(entry.salaryNetAmount) :
                              entry.type === 'assurance-emploi' && entry.weeklyNet ?
                              formatCurrency(entry.weeklyNet) :
                              entry.type === 'rentes' && entry.pensionAmount ?
                              formatCurrency(entry.pensionAmount) : '-'
                            }
                          </div>
                          <div className="text-lg text-gray-600">
                            {entry.type === 'salaire' ? (
                              salaryFrequencies.find(f => f.value === entry.salaryFrequency)?.label || '-'
                            ) : entry.type === 'assurance-emploi' ? (
                              eiPaymentFrequencies.find(f => f.value === entry.eiPaymentFrequency)?.label || (isFrench ? 'Hebdomadaire' : 'Weekly')
                            ) : entry.type === 'rentes' ? (
                              pensionFrequencies.find(f => f.value === entry.pensionFrequency)?.label || '-'
                            ) : (
                              '-'
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Statut et Actions */}
                    <div className="col-span-2 flex flex-col items-center">
                      <Label className="text-lg font-bold text-gray-700 mb-3 block">
                        {isFrench ? 'Statut et Actions' : 'Status & Actions'}
                      </Label>
                      <div className="flex gap-3 items-center">
                        {/* Statut */}
                        <button
                          onClick={() => updateIncomeEntry(entry.id, { isActive: !entry.isActive })}
                          title={entry.isActive ? (isFrench ? 'Désactiver ce revenu' : 'Deactivate this income') : (isFrench ? 'Activer ce revenu' : 'Activate this income')}
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                            entry.isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-600'
                          }`}
                        >
                          {entry.isActive ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </button>
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingId(isEditing ? null : entry.id)}
                            title={isEditing ? (isFrench ? 'Arrêter l\'édition' : 'Stop editing') : (isFrench ? 'Modifier ce revenu' : 'Edit this income')}
                            className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                          >
                            {isEditing ? <X className="w-6 h-6" /> : <Edit className="w-6 h-6" />}
                          </button>
                          <button
                            onClick={() => removeIncomeEntry(entry.id)}
                            title={isFrench ? 'Supprimer ce revenu' : 'Delete this income'}
                            className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Détails des rentes (affichage condensé sur une ligne) */}
                    {!isEditing && entry.type === 'rentes' && (
                      <div className="col-span-8 border-t-4 border-gray-200 pt-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm font-bold text-blue-800 mb-1">
                              {isFrench ? 'Type de rente' : 'Pension Type'}
                            </div>
                            <div className="text-lg text-blue-900">
                              {pensionTypes.find(t => t.value === entry.pensionType)?.label || '-'}
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-sm font-bold text-green-800 mb-1">
                              {isFrench ? 'Prestation au survivant' : 'Survivor Benefit'}
                            </div>
                            <div className="text-lg text-green-900">
                              {survivorBenefits.find(b => b.value === entry.survivorBenefit)?.label || '-'}
                            </div>
                          </div>
                          {entry.pensionStartDate && (
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <div className="text-sm font-bold text-purple-800 mb-1">
                                {isFrench ? 'Date de début' : 'Start Date'}
                              </div>
                              <div className="text-lg text-purple-900">
                                {entry.pensionStartDate}
                              </div>
                            </div>
                          )}
                          {entry.isEstatePlanning && (
                            <div className="p-3 bg-orange-50 rounded-lg">
                              <div className="text-sm font-bold text-orange-800 mb-1">
                                {isFrench ? 'Planification successorale' : 'Estate Planning'}
                              </div>
                              <div className="text-lg text-orange-900">
                                {isFrench ? 'Incluse' : 'Included'}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Détails des salaires (affichage condensé sur une ligne) */}
                    {!isEditing && entry.type === 'salaire' && (
                      <div className="col-span-8 border-t-4 border-gray-200 pt-4">
                        <div className="grid grid-cols-4 gap-4">
                          {entry.salaryStartDate && (
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <div className="text-sm font-bold text-blue-800 mb-1">
                                {isFrench ? 'Date de début' : 'Start Date'}
                              </div>
                              <div className="text-lg text-blue-900">
                                {entry.salaryStartDate}
                              </div>
                            </div>
                          )}
                          {entry.salaryEndDate && (
                            <div className="p-3 bg-red-50 rounded-lg">
                              <div className="text-sm font-bold text-red-800 mb-1">
                                {isFrench ? 'Date de fin' : 'End Date'}
                              </div>
                              <div className="text-lg text-red-900">
                                {entry.salaryEndDate}
                              </div>
                            </div>
                          )}
                          {entry.salaryRevisionDate && entry.salaryRevisionAmount && (
                            <div className="p-3 bg-green-50 rounded-lg">
                              <div className="text-sm font-bold text-green-800 mb-1">
                                {isFrench ? 'Révision salariale' : 'Salary Revision'}
                              </div>
                              <div className="text-lg text-green-900">
                                {formatCurrency(entry.salaryRevisionAmount)} à partir du {entry.salaryRevisionDate}
                              </div>
                            </div>
                          )}
                          {entry.salaryRevisionDescription && (
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <div className="text-sm font-bold text-purple-800 mb-1">
                                {isFrench ? 'Description' : 'Description'}
                              </div>
                              <div className="text-lg text-purple-900">
                                {entry.salaryRevisionDescription}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Détails de l'assurance-emploi (affichage condensé sur une ligne) */}
                    {!isEditing && entry.type === 'assurance-emploi' && (
                      <div className="col-span-8 border-t-4 border-gray-200 pt-4">
                        <div className="grid grid-cols-4 gap-4">
                          {entry.eiStartDate && (
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <div className="text-sm font-bold text-blue-800 mb-1">
                                {isFrench ? 'Date de début' : 'Start Date'}
                              </div>
                              <div className="text-lg text-blue-900">
                                {entry.eiStartDate}
                              </div>
                            </div>
                          )}
                          {entry.eiEligibleWeeks && (
                            <div className="p-3 bg-orange-50 rounded-lg">
                              <div className="text-sm font-bold text-orange-800 mb-1">
                                {isFrench ? 'Semaines éligibles' : 'Eligible Weeks'}
                              </div>
                              <div className="text-lg text-orange-900">
                                {entry.eiEligibleWeeks} semaines
                              </div>
                            </div>
                          )}
                          {entry.eiRevisionDate && entry.eiRevisionAmount && (
                            <div className="p-3 bg-green-50 rounded-lg">
                              <div className="text-sm font-bold text-green-800 mb-1">
                                {isFrench ? 'Révision AE' : 'EI Revision'}
                              </div>
                              <div className="text-lg text-green-900">
                                {formatCurrency(entry.eiRevisionAmount)} à partir du {entry.eiRevisionDate}
                              </div>
                            </div>
                          )}
                          {entry.eiRevisionDescription && (
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <div className="text-sm font-bold text-purple-800 mb-1">
                                {isFrench ? 'Description' : 'Description'}
                              </div>
                              <div className="text-lg text-purple-900">
                                {entry.eiRevisionDescription}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                  
                  {/* Section spécifique aux rentes privées */}
                  {isEditing && entry.type === 'rentes' && (
                    <div className="border-t-4 border-gray-200 pt-6">
                      <Label className="text-xl font-bold text-gray-700 mb-4 block">
                        {isFrench ? 'Détails de la rente privée' : 'Private Pension Details'}
                      </Label>
                      <div className="grid grid-cols-2 gap-6">
                        {/* Type de rente */}
                        <div>
                          <Label className="text-lg font-bold text-gray-600 mb-2 block">
                            {isFrench ? 'Type de rente' : 'Pension Type'}
                          </Label>
                          <Select
                            value={entry.pensionType || 'viagere'}
                            onValueChange={(value) => updateIncomeEntry(entry.id, { pensionType: value as any })}
                          >
                            <SelectTrigger className="bg-white border-4 border-gray-300 text-gray-900 h-16 text-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-4 border-gray-300 z-[99999]" position="popper" sideOffset={5} align="start" avoidCollisions={true} onCloseAutoFocus={(e) => e.preventDefault()}>
                              {pensionTypes.map(type => (
                                <SelectItem key={type.value} value={type.value} className="text-xl py-4">
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Prestation au survivant */}
                        <div>
                          <Label className="text-lg font-bold text-gray-600 mb-2 block">
                            {isFrench ? 'Prestation au survivant' : 'Survivor Benefit'}
                          </Label>
                          <Select
                            value={entry.survivorBenefit || 'none'}
                            onValueChange={(value) => updateIncomeEntry(entry.id, { survivorBenefit: value as any })}
                          >
                            <SelectTrigger className="bg-white border-4 border-gray-300 text-gray-900 h-16 text-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-4 border-gray-300 z-[99999]" position="popper" sideOffset={5} align="start" avoidCollisions={true} onCloseAutoFocus={(e) => e.preventDefault()}>
                              {survivorBenefits.map(benefit => (
                                <SelectItem key={benefit.value} value={benefit.value} className="text-xl py-4">
                                  {benefit.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {/* Dates importantes pour les rentes */}
                      <div className="grid grid-cols-2 gap-6 mt-6">
                        <div>
                          <Label className="text-lg font-bold text-gray-600 mb-2 block">
                            {isFrench ? 'Date de début de la rente' : 'Pension start date'}
                          </Label>
                          <DateInput
                            value={entry.pensionStartDate || ''}
                            onChange={(value) => updateIncomeEntry(entry.id, { pensionStartDate: value })}
                            placeholder="AAAA-MM-JJ"
                            className="h-16 text-xl"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-lg font-bold text-gray-600 mb-2 block">
                            {isFrench ? 'Date du premier versement' : 'First payment date'}
                          </Label>
                          <DateInput
                            value={entry.pensionFirstPaymentDate || ''}
                            onChange={(value) => updateIncomeEntry(entry.id, { pensionFirstPaymentDate: value })}
                            placeholder="AAAA-MM-JJ"
                            className="h-16 text-xl"
                          />
                        </div>
                      </div>
                      
                      {/* Planification successorale */}
                      <div className="mt-6">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`estate-planning-${entry.id}`}
                            checked={entry.isEstatePlanning || false}
                            onChange={(e) => updateIncomeEntry(entry.id, { isEstatePlanning: e.target.checked })}
                            className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            title={isFrench ? 'Inclure dans la planification successorale' : 'Include in estate planning'}
                          />
                          <Label htmlFor={`estate-planning-${entry.id}`} className="text-lg font-bold text-gray-700">
                            {isFrench ? 'Inclure dans la planification successorale' : 'Include in estate planning'}
                          </Label>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {isFrench 
                            ? 'Cochez cette case si cette rente doit être considérée dans votre planification successorale'
                            : 'Check this box if this pension should be considered in your estate planning'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Section des dates - Plus d'espace */}
                  {isEditing && (entry.type === 'salaire' || entry.type === 'assurance-emploi') && (
                    <div className="border-t-4 border-gray-200 pt-6">
                      <Label className="text-xl font-bold text-gray-700 mb-4 block">
                        {isFrench ? 'Dates importantes' : 'Important Dates'}
                      </Label>
                      {entry.type === 'salaire' ? (
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <Label className="text-lg font-bold text-gray-600 mb-2 block">{isFrench ? 'Date de début d\'emploi' : 'Employment start date'}</Label>
                            <DateInput
                              value={entry.salaryStartDate || ''}
                              onChange={(value) => updateIncomeEntry(entry.id, { salaryStartDate: value })}
                              placeholder="AAAA-MM-JJ"
                              className="h-16 text-xl"
                            />
                          </div>
                          <div>
                            <Label className="text-lg font-bold text-gray-600 mb-2 block">{isFrench ? 'Date de fin d\'emploi' : 'Employment end date'}</Label>
                            <DateInput
                              value={entry.salaryEndDate || ''}
                              onChange={(value) => updateIncomeEntry(entry.id, { salaryEndDate: value })}
                              placeholder="AAAA-MM-JJ"
                              className="h-16 text-xl"
                            />
                          </div>
                          <div>
                            <Label className="text-lg font-bold text-gray-600 mb-2 block">{isFrench ? 'Date du premier versement' : 'First payment date'}</Label>
                            <DateInput
                              value={entry.salaryFirstPaymentDate || ''}
                              onChange={(value) => updateIncomeEntry(entry.id, { salaryFirstPaymentDate: value })}
                              placeholder="AAAA-MM-JJ"
                              className="h-16 text-xl"
                            />
                          </div>
                        </div>
                      ) : entry.type === 'assurance-emploi' ? (
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <Label className="text-lg font-bold text-gray-600 mb-2 block">{isFrench ? 'Date de début des prestations' : 'Benefits start date'}</Label>
                            <DateInput
                              value={entry.eiStartDate || ''}
                              onChange={(value) => updateIncomeEntry(entry.id, { eiStartDate: value })}
                              placeholder="AAAA-MM-JJ"
                              className="h-16 text-xl"
                            />
                          </div>
                          <div>
                            <Label className="text-lg font-bold text-gray-600 mb-2 block">{isFrench ? 'Date du premier versement' : 'First payment date'}</Label>
                            <DateInput
                              value={entry.eiFirstPaymentDate || ''}
                              onChange={(value) => updateIncomeEntry(entry.id, { eiFirstPaymentDate: value })}
                              placeholder="AAAA-MM-JJ"
                              className="h-16 text-xl"
                            />
                          </div>
                          <div>
                            <Label className="text-lg font-bold text-gray-600 mb-2 block">{isFrench ? 'Fréquence de versement' : 'Payment frequency'}</Label>
                            <Select
                              value={entry.eiPaymentFrequency || 'weekly'}
                              onValueChange={(value) => updateIncomeEntry(entry.id, { eiPaymentFrequency: value as any })}
                            >
                              <SelectTrigger className="bg-white border-4 border-gray-300 text-gray-900 h-16 text-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-4 border-gray-300 z-[99999]" position="popper" sideOffset={5} align="start" avoidCollisions={true} onCloseAutoFocus={(e) => e.preventDefault()}>
                                {eiPaymentFrequencies.map(freq => (
                                  <SelectItem key={freq.value} value={freq.value} className="text-xl py-4">
                                    {freq.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-lg font-bold text-gray-600 mb-2 block">{isFrench ? 'Nombre de semaines éligibles' : 'Number of eligible weeks'}</Label>
                            <Input
                              type="number"
                              value={entry.eiEligibleWeeks || ''}
                              onChange={(e) => updateIncomeEntry(entry.id, { eiEligibleWeeks: Number(e.target.value) })}
                              className="bg-white border-4 border-gray-300 text-gray-900 h-16 text-xl"
                              placeholder="15-45"
                              min="15"
                              max="45"
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                  
                  {/* Section révision assurance-emploi */}
                  {isEditing && entry.type === 'assurance-emploi' && (
                    <div className="border-t-4 border-gray-200 pt-6">
                      <Label className="text-xl font-bold text-gray-700 mb-4 block">
                        {isFrench ? 'Révision assurance-emploi (optionnel)' : 'EI Revision (optional)'}
                      </Label>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-lg font-bold text-gray-600 mb-2 block">
                            {isFrench ? 'Date effective de la révision' : 'Effective revision date'}
                          </Label>
                          <DateInput
                            value={entry.eiRevisionDate || ''}
                            onChange={(value) => updateIncomeEntry(entry.id, { eiRevisionDate: value })}
                            placeholder="AAAA-MM-JJ"
                            className="h-16 text-xl"
                          />
                        </div>
                        <div>
                          <Label className="text-lg font-bold text-gray-600 mb-2 block">
                            {isFrench ? 'Nouveau montant hebdomadaire' : 'New weekly amount'}
                          </Label>
                          <MoneyInput
                            value={entry.eiRevisionAmount || 0}
                            onChange={(value) => updateIncomeEntry(entry.id, { eiRevisionAmount: value })}
                            className="bg-white border-4 border-gray-300 text-gray-900 h-16 text-xl"
                            placeholder="0"
                            allowDecimals={true}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-lg font-bold text-gray-600 mb-2 block">
                            {isFrench ? 'Description de la révision' : 'Revision description'}
                          </Label>
                          <Input
                            value={entry.eiRevisionDescription || ''}
                            onChange={(e) => updateIncomeEntry(entry.id, { eiRevisionDescription: e.target.value })}
                            className="bg-white border-4 border-gray-300 text-gray-900 h-16 text-xl"
                            placeholder={isFrench ? 'Ex: Ajustement du taux, révision annuelle...' : 'Ex: Rate adjustment, annual review...'}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Section révision salariale */}
                  {isEditing && entry.type === 'salaire' && (
                    <div className="border-t-4 border-gray-200 pt-6">
                      <Label className="text-xl font-bold text-gray-700 mb-4 block">
                        {isFrench ? 'Révision salariale (optionnel)' : 'Salary Revision (optional)'}
                      </Label>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-lg font-bold text-gray-600 mb-2 block">
                            {isFrench ? 'Date effective de la révision' : 'Effective revision date'}
                          </Label>
                          <DateInput
                            value={entry.salaryRevisionDate || ''}
                            onChange={(value) => updateIncomeEntry(entry.id, { salaryRevisionDate: value })}
                            placeholder="AAAA-MM-JJ"
                            className="h-16 text-xl"
                          />
                        </div>
                        <div>
                          <Label className="text-lg font-bold text-gray-600 mb-2 block">
                            {isFrench ? 'Nouveau montant' : 'New amount'}
                          </Label>
                          <MoneyInput
                            value={entry.salaryRevisionAmount || 0}
                            onChange={(value) => updateIncomeEntry(entry.id, { salaryRevisionAmount: value })}
                            className="bg-white border-4 border-gray-300 text-gray-900 h-16 text-xl"
                            placeholder="0"
                            allowDecimals={true}
                          />
                        </div>
                        <div>
                          <Label className="text-lg font-bold text-gray-600 mb-2 block">
                            {isFrench ? 'Nouvelle fréquence (si différente)' : 'New frequency (if different)'}
                          </Label>
                          <Select
                            value={entry.salaryRevisionFrequency || entry.salaryFrequency || 'monthly'}
                            onValueChange={(value) => updateIncomeEntry(entry.id, { salaryRevisionFrequency: value as any })}
                          >
                            <SelectTrigger className="bg-white border-4 border-gray-300 text-gray-900 h-16 text-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-4 border-gray-300 z-[99999]" position="popper" sideOffset={5} align="start" avoidCollisions={true} onCloseAutoFocus={(e) => e.preventDefault()}>
                              {salaryFrequencies.map(freq => (
                                <SelectItem key={freq.value} value={freq.value} className="text-xl py-4">
                                  {freq.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-lg font-bold text-gray-600 mb-2 block">
                            {isFrench ? 'Description de la révision' : 'Revision description'}
                          </Label>
                          <Input
                            value={entry.salaryRevisionDescription || ''}
                            onChange={(e) => updateIncomeEntry(entry.id, { salaryRevisionDescription: e.target.value })}
                            className="bg-white border-4 border-gray-300 text-gray-900 h-16 text-xl"
                            placeholder={isFrench ? 'Ex: Promotion, nouveau rôle, augmentation...' : 'Ex: Promotion, new role, raise...'}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Budget mensuel calculé - Plus visible */}
                  <div className="border-t-4 border-gray-200 pt-6 mt-6">
                    <div className="bg-green-100 border-4 border-green-300 rounded-xl p-6">
                      <div className="text-center">
                        <Label className="text-xl font-bold text-green-800 mb-2 block">
                          {isFrench ? 'Budget mensuel calculé' : 'Calculated Monthly Budget'}
                        </Label>
                        <div className="text-3xl font-bold text-green-600">
                          {calculateMonthlyBudget(entry) > 0 ? 
                            formatCurrency(calculateMonthlyBudget(entry)) : 
                            isFrench ? 'Complétez les champs ci-dessus' : 'Complete the fields above'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Bouton d'ajout - Version Senior */}
          <div className="text-center">
            <Button
              onClick={addIncomeEntry}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white text-xl px-8 py-4 h-16 shadow-lg"
            >
              <Plus className="w-6 h-6 mr-3" />
              {isFrench ? 'Ajouter un revenu' : 'Add Income'}
            </Button>
          </div>
          
          {/* Résumé des totaux - Version Senior */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-4 border-blue-200 shadow-xl">
            <CardContent className="p-6">
              <h4 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-3">
                <Calculator className="w-6 h-6" />
                {isFrench ? 'Résumé des revenus' : 'Income Summary'}
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(totals.projected)}
                  </div>
                  <div className="text-lg text-gray-700">
                    {isFrench ? 'Total annuel projeté' : 'Projected Annual Total'}
                  </div>
                </div>
                
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(totals.projected / 12)}
                  </div>
                  <div className="text-lg text-gray-700">
                    {isFrench ? 'Mensuel moyen' : 'Average Monthly'}
                  </div>
                </div>
                
                <div>
                  <div className="text-3xl font-bold text-orange-600">
                    {formatCurrency(totals.toDate)}
                  </div>
                  <div className="text-lg text-gray-700">
                    {isFrench ? 'AE à ce jour' : 'EI To Date'}
                  </div>
                </div>
                
                <div>
                  <div className="text-3xl font-bold text-purple-600">
                    {incomeEntries.filter(e => e.isActive).length}
                  </div>
                  <div className="text-lg text-gray-700">
                    {isFrench ? 'Sources actives' : 'Active Sources'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default SeniorsFriendlyIncomeTable;
