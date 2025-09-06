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
import { PayrollCalendarService } from '@/services/PayrollCalendarService';

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
  userData?: any; // Ajouter les données utilisateur pour accéder aux montants RRQ réels
}

const UnifiedIncomeTable: React.FC<UnifiedIncomeTableProps> = ({
  personNumber,
  personName,
  data = [],
  onDataChange,
  isFrench,
  userData
}) => {

  // Fonction utilitaire pour normaliser les entrées de revenus
  const normalizeIncomeEntry = (entry: any): IncomeEntry => {
    const normalized: IncomeEntry = {
      ...entry,
      // Assurer que les champs obligatoires existent
      id: entry.id || `income-${Date.now()}`,
      type: entry.type || 'salaire',
      description: entry.description || '',
      isActive: entry.isActive !== undefined ? entry.isActive : true,
      annualAmount: entry.annualAmount || 0,
    };

    // Calculer projectedAnnual si manquant mais que les données de base existent
    if (!normalized.projectedAnnual && normalized.salaryNetAmount && normalized.salaryNetAmount > 0) {
      const frequency = normalized.salaryFrequency || 'monthly'; // Défaut mensuel
      const multiplier = {
        'weekly': 52,
        'biweekly': 26,
        'bimonthly': 24,
        'monthly': 12
      }[frequency] || 12;

      normalized.projectedAnnual = normalized.salaryNetAmount * multiplier;
    }

    // Pour autres types de revenus, assurer projectedAnnual
    if (!normalized.projectedAnnual) {
      switch (normalized.type) {
        case 'rentes':
          if (normalized.pensionAmount && normalized.pensionFrequency) {
            const multiplier = {
              'monthly': 12,
              'quarterly': 4,
              'semi-annual': 2,
              'annual': 1
            }[normalized.pensionFrequency] || 12;
            normalized.projectedAnnual = normalized.pensionAmount * multiplier;
          } else {
            normalized.projectedAnnual = (normalized.monthlyAmount || 0) * 12;
          }
          break;
        case 'revenus-location':
          normalized.projectedAnnual = (normalized.monthlyAmount || 0) * 12;
          break;
        case 'dividendes':
        case 'travail-autonome':
        case 'autres':
          normalized.projectedAnnual = normalized.annualAmount || 0;
          break;
        default:
          normalized.projectedAnnual = 0;
      }
    }

    return normalized;
  };

  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>(
    data ? data.map(normalizeIncomeEntry) : []
  );
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
    if (entry.type !== 'assurance-emploi' || !entry.eiStartDate || !entry.weeklyNet) {
      return 0;
    }

    const startDate = new Date(entry.eiStartDate);
    const currentDate = new Date();

    // Calculer le nombre de semaines écoulées
    const diffTime = currentDate.getTime() - startDate.getTime();
    const weeksElapsed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)));

    // Limiter par les semaines utilisées si spécifié
    const effectiveWeeks = entry.weeksUsed ? Math.min(weeksElapsed, entry.weeksUsed) : weeksElapsed;

    return effectiveWeeks * entry.weeklyNet;
  };
  
  // Calcul du montant annuel projeté
  const calculateProjectedAnnual = (entry: IncomeEntry): number => {
    switch (entry.type) {
      case 'salaire':
        // Priorité 1: Utiliser annualAmount si disponible
        if (entry.annualAmount && entry.annualAmount > 0) {
          return entry.annualAmount;
        }

        // Priorité 2: Calculer à partir du salaire net et de la fréquence
        if (entry.salaryNetAmount && entry.salaryNetAmount > 0) {
          const frequency = entry.salaryFrequency || 'monthly';
          const multiplier = {
            'weekly': 52,
            'biweekly': 26,
            'bimonthly': 24,
            'monthly': 12
          }[frequency] || 12;

          return entry.salaryNetAmount * multiplier;
        }
        return 0;

      case 'rentes':
        if (entry.pensionAmount && entry.pensionFrequency) {
          const multiplier = {
            'monthly': 12,
            'quarterly': 4,
            'semi-annual': 2,
            'annual': 1
          }[entry.pensionFrequency] || 12;
          return entry.pensionAmount * multiplier;
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
        const effectiveEnd = yearEnd; // Pas de endDate pour l'assurance emploi

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

  // Logs de débogage - à retirer après correction
  useEffect(() => {
    console.log('🔍 Données de revenus pour la personne', personNumber, ':', {
      entries: incomeEntries,
      totals: getTotalsByIncomeType(),
      rawData: data
    });
  }, [incomeEntries]);
  
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
    
    // Afficher une confirmation de sauvegarde
    console.log('✅ Modification sauvegardée:', updates);
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

  // Nouvelle fonction pour calculer les totaux par type de revenu
  const getTotalsByIncomeType = () => {
    const totals = {
      // Revenus de travail
      salaire: 0,
      assuranceEmploi: 0,
      travailAutonome: 0,
      // Prestations
      rrq: 0,
      securiteVieillesse: 0,
      rentesPrivees: 0,
      // Totaux
      mensuelMoyen: 0,
      totalAnnuelProjete: 0
    };
    
    // Calculer d'abord les montants automatiques (RRQ et SV) même sans entrées
    if (userData?.retirement) {
      const currentDate = new Date();
      const monthsElapsed = currentDate.getMonth() + 1;
      
      // RRQ - utiliser les montants réels depuis userData
      const rrqMontantActuel = personNumber === 1 ? 
        userData.retirement.rrqMontantActuel1 : 
        userData.retirement.rrqMontantActuel2;
      
      if (rrqMontantActuel && rrqMontantActuel > 0) {
        // RRQ est versé le dernier jour ouvrable du mois
        // Ne pas inclure le mois courant car le paiement n'a pas encore eu lieu
        const monthsCompleted = Math.max(0, monthsElapsed - 1);
        totals.rrq = rrqMontantActuel * monthsCompleted;
      }
      
      // Sécurité vieillesse - calculer selon les périodes
      const svBiannual = personNumber === 1 ? 
        userData.retirement.svBiannual1 : 
        userData.retirement.svBiannual2;
      
      if (svBiannual && svBiannual.periode1 && svBiannual.periode2) {
        const currentMonth = currentDate.getMonth() + 1; // 1-12
        
        // SV est versé entre le 26 et 29 du mois
        // Ne pas inclure le mois courant car le paiement n'a pas encore eu lieu
        const monthsCompleted = Math.max(0, currentMonth - 1);
        
        // Calculer le montant à ce jour selon les périodes
        let totalToDate = 0;
        
        // Période Jan-Juin (6 mois)
        const monthsJanJuin = Math.min(6, monthsCompleted);
        if (monthsJanJuin > 0) {
          totalToDate += monthsJanJuin * svBiannual.periode1.montant;
        }
        
        // Période Juil-Déc (6 mois)
        if (monthsCompleted > 6) {
          const monthsJuilDec = Math.min(6, monthsCompleted - 6);
          totalToDate += monthsJuilDec * svBiannual.periode2.montant;
        }
        
        totals.securiteVieillesse = totalToDate;
      }
    }
    
    incomeEntries.forEach(entry => {
      if (!entry.isActive) return;
      
      // Calculer le montant "à ce jour" pour chaque type
      let toDateAmount = 0;
      
      switch (entry.type) {
        case 'salaire':
          // Calculer le salaire à ce jour basé sur le calendrier de paie précis
          if (entry.salaryNetAmount && entry.salaryFrequency) {
            // Utiliser le calendrier de paie si disponible
            if (entry.salaryFirstPayDateOfYear) {
              
              const payrollConfig = {
                firstPayDateOfYear: entry.salaryFirstPayDateOfYear,
                frequency: entry.salaryFrequency
              };
              
              // Calculer les gains totaux jusqu'à aujourd'hui
              toDateAmount = PayrollCalendarService.calculateTotalEarnings(
                payrollConfig,
                entry.salaryNetAmount,
                new Date()
              );
              
              // Appliquer la révision salariale si applicable
              if (entry.salaryRevisionDate && entry.salaryRevisionAmount) {
                const revisionDate = new Date(entry.salaryRevisionDate);
                const currentDate = new Date();
                
                if (revisionDate <= currentDate) {
                  // Calculer les gains avant et après révision
                  const earningsBeforeRevision = PayrollCalendarService.calculateTotalEarnings(
                    payrollConfig,
                    entry.salaryNetAmount,
                    revisionDate
                  );
                  
                  const earningsAfterRevision = PayrollCalendarService.calculateTotalEarnings(
                    payrollConfig,
                    entry.salaryRevisionAmount,
                    currentDate
                  ) - PayrollCalendarService.calculateTotalEarnings(
                    payrollConfig,
                    entry.salaryRevisionAmount,
                    revisionDate
                  );
                  
                  toDateAmount = earningsBeforeRevision + earningsAfterRevision;
                }
              }
            } else {
              // Fallback: calcul basé sur les dates exactes (méthode précédente)
              const startDate = new Date(entry.salaryStartDate || new Date().getFullYear() + '-01-01');
              const currentDate = new Date();
              const endDate = entry.salaryEndDate ? new Date(entry.salaryEndDate) : currentDate;
              
              // Déterminer la période effective (depuis le 1er janvier de l'année courante)
              const yearStart = new Date(currentDate.getFullYear(), 0, 1);
              const effectiveStart = startDate > yearStart ? startDate : yearStart;
              const effectiveEnd = endDate < currentDate ? endDate : currentDate;
              
              if (effectiveEnd >= effectiveStart) {
                // Calculer le nombre de paiements selon la fréquence
                let paymentsCount = 0;
                const daysDiff = Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24));
                
                switch (entry.salaryFrequency) {
                  case 'weekly':
                    paymentsCount = Math.floor(daysDiff / 7);
                    break;
                  case 'biweekly':
                    paymentsCount = Math.floor(daysDiff / 14);
                    break;
                  case 'bimonthly':
                    paymentsCount = Math.floor(daysDiff / 15);
                    break;
                  case 'monthly':
                    paymentsCount = Math.floor(daysDiff / 30);
                    break;
                }
                
                // Utiliser le montant de révision si applicable
                const amountToUse = entry.salaryRevisionDate && 
                  new Date(entry.salaryRevisionDate) <= effectiveEnd && 
                  entry.salaryRevisionAmount ? 
                  entry.salaryRevisionAmount : entry.salaryNetAmount;
                
                toDateAmount = paymentsCount * amountToUse;
              }
            }
          } else if (entry.projectedAnnual) {
            // Fallback: utiliser le montant projeté annuel divisé par 12 * mois écoulés
            const currentDate = new Date();
            const monthsElapsed = currentDate.getMonth() + 1;
            toDateAmount = (entry.projectedAnnual / 12) * monthsElapsed;
          }
          totals.salaire += toDateAmount;
          break;
          
        case 'rentes':
          // Distinguer entre RRQ, SV et rentes privées selon la description
          const description = entry.description.toLowerCase();
          if (description.includes('rrq') || description.includes('cpp') || description.includes('régime de retraite du québec')) {
            // Si c'est une entrée RRQ explicite, l'ajouter aux calculs automatiques
            if (entry.projectedAnnual) {
              const currentDate = new Date();
              const monthsElapsed = currentDate.getMonth() + 1;
              toDateAmount = (entry.projectedAnnual / 12) * monthsElapsed;
            }
            totals.rrq += toDateAmount;
          } else if (description.includes('sv') || description.includes('sécurité vieillesse') || description.includes('oas') || description.includes('old age security')) {
            // Si c'est une entrée SV explicite, l'ajouter aux calculs automatiques
            if (entry.projectedAnnual) {
              const currentDate = new Date();
              const monthsElapsed = currentDate.getMonth() + 1;
              toDateAmount = (entry.projectedAnnual / 12) * monthsElapsed;
            }
            totals.securiteVieillesse += toDateAmount;
          } else {
            // Rentes privées normales
            if (entry.projectedAnnual) {
              const currentDate = new Date();
              const monthsElapsed = currentDate.getMonth() + 1;
              toDateAmount = (entry.projectedAnnual / 12) * monthsElapsed;
            }
            totals.rentesPrivees += toDateAmount;
          }
          break;
          
        case 'assurance-emploi':
          // Calculer l'assurance emploi à ce jour basé sur les dates exactes
          if (entry.weeklyNet && entry.eiStartDate) {
            const startDate = new Date(entry.eiStartDate);
            const currentDate = new Date();
            
            // Calculer le nombre de semaines écoulées depuis le début
            const weeksElapsed = Math.max(0, Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)));
            
            // Limiter aux semaines éligibles si spécifié
            const maxWeeks = entry.eiEligibleWeeks || 45;
            const actualWeeksElapsed = Math.min(weeksElapsed, maxWeeks);
            
            // AE: 1270$ par 2 semaines = 635$/semaine
            // Paiement le jeudi suivant la fin de la période
            const weeklyAmount = 635; // 1270 / 2
            
            // Calculer le montant total en tenant compte de la révision (si applicable)
            let totalAmount = 0;
            
            if (entry.eiRevisionDate && entry.eiRevisionAmount) {
              const revisionDate = new Date(entry.eiRevisionDate);
              
              // Période avant révision
              const weeksBeforeRevision = Math.max(0, Math.floor((revisionDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)));
              const effectiveWeeksBeforeRevision = Math.min(weeksBeforeRevision, actualWeeksElapsed);
              totalAmount += effectiveWeeksBeforeRevision * weeklyAmount;
              
              // Période après révision
              const weeksAfterRevision = Math.max(0, actualWeeksElapsed - effectiveWeeksBeforeRevision);
              totalAmount += weeksAfterRevision * entry.eiRevisionAmount;
            } else {
              // Pas de révision - calcul normal
              totalAmount = actualWeeksElapsed * weeklyAmount;
            }
            
            toDateAmount = totalAmount;
          } else if (entry.projectedAnnual) {
            // Fallback: utiliser le montant projeté
            const currentDate = new Date();
            const monthsElapsed = currentDate.getMonth() + 1;
            toDateAmount = (entry.projectedAnnual / 12) * monthsElapsed;
          }
          totals.assuranceEmploi += toDateAmount;
          break;
          
        case 'travail-autonome':
          // Travail autonome - revenu de travail
          if (entry.projectedAnnual) {
            const currentDate = new Date();
            const monthsElapsed = currentDate.getMonth() + 1;
            toDateAmount = (entry.projectedAnnual / 12) * monthsElapsed;
          }
          totals.travailAutonome += toDateAmount;
          break;
          
        case 'dividendes':
        case 'revenus-location':
        case 'autres':
          // Ces types sont considérés comme rentes privées (prestations)
          if (entry.projectedAnnual) {
            const currentDate = new Date();
            const monthsElapsed = currentDate.getMonth() + 1;
            toDateAmount = (entry.projectedAnnual / 12) * monthsElapsed;
          }
          totals.rentesPrivees += toDateAmount;
          break;
      }
      
      // Calculer le total annuel projeté
      totals.totalAnnuelProjete += entry.projectedAnnual || 0;
    });
    
    // Calculer le mensuel moyen
    totals.mensuelMoyen = totals.totalAnnuelProjete / 12;
    
    return totals;
  };
  
  const totals = getTotalsByFrequency();
  const incomeTypeTotals = getTotalsByIncomeType();
  
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
                              value={entry.eiStartDate || ''}
                              onChange={(value) => updateIncomeEntry(entry.id, { eiStartDate: value })}
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
                <div className="text-2xl font-bold text-blue-400">
                  {formatCurrency(incomeTypeTotals.salaire)}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Salaire à ce jour' : 'Salary to date'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {formatCurrency(incomeTypeTotals.rrq)}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'RRQ à ce jour' : 'CPP to date'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-cyan-400">
                  {formatCurrency(incomeTypeTotals.securiteVieillesse)}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Sécurité vieillesse à ce jour' : 'OAS to date'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {formatCurrency(incomeTypeTotals.rentesPrivees)}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Rentes privées à ce jour' : 'Private pensions to date'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-orange-400">
                  {formatCurrency(incomeTypeTotals.assuranceEmploi)}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Assurance emploi à ce jour' : 'EI to date'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(incomeTypeTotals.mensuelMoyen)}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Mensuel moyen' : 'Average Monthly'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(incomeTypeTotals.totalAnnuelProjete)}
                </div>
                <div className="text-sm text-gray-300">
                  {isFrench ? 'Total annuel projeté' : 'Projected Annual Total'}
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-pink-400">
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
        
        {incomeEntries.some(e => e.type === 'assurance-emploi' && e.isActive && !e.eiStartDate) && (
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
