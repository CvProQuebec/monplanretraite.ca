// ===== INDEX DES TYPES RETIREMENT =====
// Export centralisé de tous les types

// Types de base (existants) - exports sélectifs pour éviter les conflits
export type { CPPData, CPPCalculationResult, CPPParameters } from './cpp';

// Nouveaux types pour l'emploi précaire
export type * from './employment-status';

// Types principaux étendus pour inclure l'emploi précaire
export interface UserData {
  personal: PersonalData;
  retirement: RetirementData;
  savings: SavingsData;
  cashflow: CashflowData;
  advancedExpenses?: AdvancedExpensesData;
  employmentStatus?: EmploymentStatusData; // NOUVEAU
}

export interface PersonalData {
  prenom1: string;
  prenom2: string;
  naissance1: string;
  naissance2: string;
  sexe1: 'M' | 'F';
  sexe2: 'M' | 'F';
  salaire1: number;
  salaire2: number;
  
  // Champs existants étendus
  statutProfessionnel1?: 'actif' | 'retraite';
  statutProfessionnel2?: 'actif' | 'retraite';
  ageRetraiteSouhaite1?: number;
  ageRetraiteSouhaite2?: number;
  depensesRetraite?: number;
  
  // Champs manquants pour compatibilité
  nom1?: string;
  nom2?: string;
  situationFamiliale?: string;
  nombreEnfants?: number;
  province?: string;
  
  // NOUVEAUX: Informations d'emploi détaillées
  secteurActivite1?: string;
  secteurActivite2?: string;
  niveauCompetences1?: 'debutant' | 'intermediaire' | 'expert' | 'specialise';
  niveauCompetences2?: 'debutant' | 'intermediaire' | 'expert' | 'specialise';
  regionEconomique?: string;
  tauxChomageRegional?: number;
  
  // NOUVEAUX: Emplois saisonniers
  seasonalJobs1?: SeasonalJob[];
  seasonalJobs2?: SeasonalJob[];
  
  // NOUVEAUX: Revenus unifiés
  unifiedIncome1?: IncomeEntry[];
  unifiedIncome2?: IncomeEntry[];
}

export interface RetirementData {
  rrqAgeActuel1: number;
  rrqMontantActuel1: number;
  rrqMontant70_1: number;
  esperanceVie1: number;
  rrqAgeActuel2: number;
  rrqMontantActuel2: number;
  rrqMontant70_2: number;
  esperanceVie2: number;
  rregopMembre1: string;
  rregopAnnees1: number;
  pensionPrivee1: number;
  pensionPrivee2: number;
  
  // Champs pour la Sécurité de la vieillesse
  svMontant1?: number;
  svMontant2?: number;
  svRevenus1?: number;
  svRevenus2?: number;
  svAgeDebut1?: number;
  svAgeDebut2?: number;
  
  // Propriétés existantes
  revenusTempsPartiel1?: number;
  revenusTempsPartiel2?: number;
}

export interface SavingsData {
  reer1: number;
  reer2: number;
  celi1: number;
  celi2: number;
  placements1: number;
  placements2: number;
  epargne1: number;
  epargne2: number;
  cri1: number;
  cri2: number;
  residenceValeur: number;
  residenceHypotheque: number;
}

export interface CashflowData {
  logement: number;
  servicesPublics: number;
  assurances: number;
  telecom: number;
  alimentation: number;
  transport: number;
  sante: number;
  loisirs: number;
  depensesSaisonnieres?: number;
  
  // Propriétés de ventilation des dépenses
  logementBreakdown?: Record<string, number>;
  servicesPublicsBreakdown?: Record<string, number>;
  assurancesBreakdown?: Record<string, number>;
  transportBreakdown?: Record<string, number>;
  santeBreakdown?: Record<string, number>;
  telecomBreakdown?: Record<string, number>;
  
  // Propriétés manquantes ajoutées
  epargne?: number;
  placements?: number;
  
  // NOUVEAU: Dates d'échéance pour les dépenses régulières
  dueDates?: ExpenseDueDates;
}

// NOUVEAU: Interface pour les dates d'échéance des dépenses
export interface ExpenseDueDates {
  logement?: ExpenseDueDate[];
  servicesPublics?: ExpenseDueDate[];
  assurances?: ExpenseDueDate[];
  telecom?: ExpenseDueDate[];
  alimentation?: ExpenseDueDate[];
  transport?: ExpenseDueDate[];
  sante?: ExpenseDueDate[];
  loisirs?: ExpenseDueDate[];
}

// NOUVEAU: Interface pour une date d'échéance spécifique
export interface ExpenseDueDate {
  id: string;
  name: string; // ex: "Hydro-Québec", "Téléphone cellulaire"
  amount: number;
  frequency: 'monthly' | 'bimonthly' | 'quarterly' | 'biannual' | 'annual' | 'irregular';
  dueDay?: number; // Jour du mois (1-31) pour les paiements mensuels
  dueDates?: string[]; // Dates spécifiques pour les paiements irréguliers (format: "MM-DD")
  nextDueDate?: string; // Prochaine date d'échéance calculée (format: "YYYY-MM-DD")
  isActive: boolean;
  notes?: string;
}

// NOUVEAU: Interface pour le plan budgétaire mensuel
export interface MonthlyBudgetPlan {
  month: string; // Format: "YYYY-MM"
  totalIncome: number;
  plannedExpenses: PlannedExpense[];
  totalPlannedExpenses: number;
  remainingBudget: number;
  savingsTarget: number;
  actualSavings: number;
}

// NOUVEAU: Interface pour une dépense planifiée
export interface PlannedExpense {
  id: string;
  name: string;
  category: string;
  amount: number;
  dueDate: string; // Format: "YYYY-MM-DD"
  isPaid: boolean;
  isRecurring: boolean;
  frequency?: string;
  notes?: string;
}

export interface AdvancedExpensesData {
  // Dépenses saisonnières
  winterExpenses?: Record<string, number>;
  summerExpenses?: Record<string, number>;
  
  // Versements avec dates
  winterExpensePayments?: {
    [expenseKey: string]: {
      [paymentKey: string]: {
        amount: number;
        date: string;
      };
    };
  };
  summerExpensePayments?: {
    [expenseKey: string]: {
      [paymentKey: string]: {
        amount: number;
        date: string;
      };
    };
  };
  
  // Factures complexes
  complexBills?: {
    taxesMunicipales?: number;
    taxesScolaires?: number;
    electriciteHiver?: number;
    electriciteEte?: number;
    electriciteIntersaisons?: number;
    assuranceHabitation?: number;
    assuranceAuto?: number;
    
    // Versements avec dates
    taxesPayments?: {
      [paymentKey: string]: {
        amount: number;
        date: string;
      };
    };
    electricitePayments?: {
      [paymentKey: string]: {
        amount: number;
        date: string;
      };
    };
  };
  
  // Vues temporelles
  monthlyView?: Record<string, number>;
  weeklyView?: Record<string, number>;
  plannedExpenses?: Record<string, number>;
  withdrawalPlanning?: Record<string, number>;
  budgetTracking?: Record<string, number>;
  expenseAnalysis?: Record<string, number>;
}

export interface Calculations {
  netWorth: number;
  retirementCapital: number;
  sufficiency: number;
  taxSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  rrqOptimization?: RRQOptimizationResult;
  
  // NOUVEAUX: Calculs étendus
  oasGisProjection?: any;
  riskAnalysis?: any;
  recommendedActions?: any;
  employmentImpactAnalysis?: EmploymentImpactAnalysis; // NOUVEAU
  
  // Champs manquants pour compatibilité
  savingsRate?: number;
  projectedNetWorth?: number;
  liquidAssets?: number;
  retirementSavings?: number;
  realEstateEquity?: number;
}

export interface RRQOptimizationResult {
  totalMaintenant: number;
  total70: number;
  montantPerdu: number;
  ageRentabilite: number;
  valeurActualiseeMaintenant: number;
  valeurActualisee70: number;
  recommandation: string;
  difference: number;
  
  // NOUVEAUX: Champs étendus
  person1?: any;
  person2?: any;
  combinedStrategy?: any;
  householdImpact?: any;
}

// Import des types d'emploi précaire
import { EmploymentStatusData, EmploymentImpactAnalysis } from './employment-status';

// Import des types pour emplois saisonniers et revenus unifiés
export interface SeasonalJob {
  id: string;
  jobTitle: string;
  employer: string;
  startDate: string;
  endDate: string;
  estimatedEarnings: number;
  actualEarnings?: number;
  isCompleted: boolean;
  jobType: 'summer' | 'winter' | 'spring' | 'fall' | 'custom';
  notes?: string;
}

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
