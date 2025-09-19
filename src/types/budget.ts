export type BudgetFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually' | 'seasonal';

export interface ExpenseEntry {
  id: string;
  category: 'logement' | 'services' | 'transport' | 'alimentation' | 'sante' | 'loisirs' | 'epargne' | 'divers';
  subcategory: string;
  description: string;
  amount: number;
  frequency: BudgetFrequency;
  /** Part de besoin (%) pour zones grises (0-100). Si non défini, dérivé de la catégorie par défaut. */
  needSharePct?: number;
  paymentDate?: number; // Jour du mois (1-31)
  seasonalMonths?: number[]; // Mois pour les dépenses saisonnières
  isActive: boolean;
  isFixed: boolean; // Fixe ou variable
  notes?: string;
}

export interface MortgageInfo {
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  paymentDate: number;
  startDate: string;
  isActive: boolean;
}

export interface BudgetData {
  currentBalance: number;
  balanceDate: string;
  expenses: ExpenseEntry[];
  mortgage?: MortgageInfo;
  savingsGoal: number;
  emergencyFund: number;
  // Champs futurs (compatibilité ascendante)
  // plannedSavings?: number;
  // debtPayments?: number;
}

export type NetIncomeMethod = 'regular' | 'avg12' | 'lowestMonth';

export interface DeductionItem {
  type:
    | 'federal_tax'
    | 'provincial_tax'
    | 'social_security'
    | 'health_insurance'
    | 'retirement'
    | 'union_dues'
    | 'other';
  label?: string;
  amount: number;
}

export interface BudgetTargets {
  needsPct: number; // ex: 50
  wantsPct: number; // ex: 30
  savingsDebtPct: number; // ex: 20
}

/** Sinking fund (projet planifié) */
export interface SinkingFund {
  id: string;
  name: string;
  goalAmount: number;      // Montant cible total
  dueDate: string;         // Date d'échéance (YYYY-MM ou YYYY-MM-DD)
  monthlyRequired: number; // Montant mensuel requis (calculé)
  saved?: number;          // Montant déjà épargné
  notes?: string;
}

/** Dettes (pour méthode Snowball) */
export interface DebtItem {
  id: string;
  name: string;
  balance: number;      // solde actuel
  ratePct: number;      // taux d'intérêt annuel en %
  minPayment: number;   // paiement minimum mensuel
  isActive: boolean;
  notes?: string;
}

/** État de la stratégie Snowball */
export interface DebtSnowballState {
  debts: DebtItem[];
  /** Montant supplémentaire mensuel alloué au snowball (au-delà des minimums) */
  extraPerMonth?: number;
  /** Méthode de priorisation: 'balance' (par défaut) ou 'rate' */
  method?: 'balance' | 'rate';
}

export interface BudgetSettings {
  netIncomeMethod: NetIncomeMethod;
  grossIncome?: number;
  /**
   * Fréquence du revenu brut et des déductions (les montants saisis sont par période sélectionnée)
   * weekly (52/an), biweekly (26/an), semimonthly (24/an), monthly (12/an)
   */
  grossFrequency?: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
  deductions?: DeductionItem[];
  netIncome?: number; // cache
  targets: BudgetTargets;

  /** Phase 2 — Fonds d'urgence: cible en mois (3 à 12) */
  emergencyMonthsTarget?: number;

  /** Phase 2 — Sinking funds (projets planifiés) */
  sinkingFunds?: SinkingFund[];

  /** Phase 2 — Stratégie dettes (snowball) */
  debtSnowball?: DebtSnowballState;

  // Personnalisation future
  // categoryOverrides?: Record<ExpenseEntry['category'], 'need' | 'want' | 'savings_debt'>;
  // greySplits?: Record<string, { needPct: number; wantPct: number }>; // par id de dépense
  lastUpdated?: string;
}
