export interface ExpenseScenario {
  id: string;
  name: string;
  description: string;
  category: ExpenseCategory;
  scenarios: ScenarioOption[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScenarioOption {
  id: string;
  name: string;
  amount: number;
  description?: string;
  pros: string[];
  cons: string[];
  paymentOptions: PaymentOption[];
  impact: CashFlowImpact;
}

export interface PaymentOption {
  id: string;
  type: 'immediate' | 'monthly' | 'quarterly' | 'custom';
  amount: number;
  duration?: number; // months for installments
  interestRate?: number;
  startDate: Date;
  description: string;
}

export interface CashFlowImpact {
  immediateImpact: number;
  monthlyImpact: number;
  totalCost: number;
  payoffDate?: Date;
  worstCaseBalance: number;
  worstCaseDate: Date;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface WeeklyFinancialSnapshot {
  weekStartDate: Date;
  weekEndDate: Date;
  plannedIncome: number;
  actualIncome: number;
  plannedExpenses: number;
  actualExpenses: number;
  netCashFlow: number;
  accountBalance: number;
  upcomingExpenses: UpcomingExpense[];
  alerts: FinancialAlert[];
}

export interface UpcomingExpense {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  category: ExpenseCategory;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isSeasonal: boolean;
  seasonalInfo?: SeasonalExpenseInfo;
}

export interface RecurrencePattern {
  type: 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'seasonal';
  interval: number; // every X months/quarters/years
  endDate?: Date;
  skipMonths?: number[]; // months to skip (1-12)
}

export interface SeasonalExpenseInfo {
  season: 'winter' | 'spring' | 'summer' | 'fall';
  typicalMonths: number[]; // months when this expense typically occurs
  isVariable: boolean; // if amount varies year to year
  historicalAmounts?: { year: number; amount: number }[];
  description: string;
}

export interface FinancialAlert {
  id: string;
  type: 'low_balance' | 'overspending' | 'upcoming_expense' | 'scenario_impact';
  severity: 'info' | 'warning' | 'error';
  message: string;
  actionRequired: boolean;
  suggestedActions: string[];
  createdAt: Date;
}

export type ExpenseCategory = 
  | 'housing'
  | 'transportation'
  | 'food'
  | 'utilities'
  | 'healthcare'
  | 'entertainment'
  | 'travel'
  | 'appliances'
  | 'clothing'
  | 'education'
  | 'savings'
  | 'debt'
  | 'insurance'
  | 'taxes'
  | 'seasonal_maintenance'
  | 'municipal_taxes'
  | 'property_taxes'
  | 'heating'
  | 'other';

export interface ExpenseScenarioState {
  scenarios: ExpenseScenario[];
  weeklySnapshots: WeeklyFinancialSnapshot[];
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  emergencyFund: number;
  settings: ScenarioSettings;
}

export interface ScenarioSettings {
  alertThresholds: {
    lowBalance: number;
    overspendingPercentage: number;
    upcomingExpenseDays: number;
  };
  defaultCategories: ExpenseCategory[];
  autoSaveEnabled: boolean;
  weeklyReminderEnabled: boolean;
}

// Predefined seasonal expenses for Quebec/Canada
export const SEASONAL_EXPENSES_TEMPLATES: UpcomingExpense[] = [
  {
    id: 'snow-removal',
    name: 'Déneigement annuel',
    amount: 800,
    dueDate: new Date(new Date().getFullYear(), 10, 1), // November 1st
    category: 'seasonal_maintenance',
    isRecurring: true,
    recurrencePattern: {
      type: 'annual',
      interval: 1
    },
    priority: 'medium',
    isSeasonal: true,
    seasonalInfo: {
      season: 'winter',
      typicalMonths: [11, 12, 1, 2, 3], // Nov-Mar
      isVariable: true,
      historicalAmounts: [
        { year: 2023, amount: 750 },
        { year: 2022, amount: 850 },
        { year: 2021, amount: 800 }
      ],
      description: 'Service de déneigement pour la saison hivernale'
    }
  },
  {
    id: 'municipal-taxes',
    name: 'Taxes municipales',
    amount: 2400,
    dueDate: new Date(new Date().getFullYear(), 5, 1), // June 1st
    category: 'municipal_taxes',
    isRecurring: true,
    recurrencePattern: {
      type: 'annual',
      interval: 1
    },
    priority: 'high',
    isSeasonal: false,
    seasonalInfo: {
      season: 'summer',
      typicalMonths: [6], // June
      isVariable: false,
      description: 'Paiement annuel des taxes municipales'
    }
  },
  {
    id: 'property-taxes',
    name: 'Taxes scolaires',
    amount: 1800,
    dueDate: new Date(new Date().getFullYear(), 8, 1), // September 1st
    category: 'property_taxes',
    isRecurring: true,
    recurrencePattern: {
      type: 'annual',
      interval: 1
    },
    priority: 'high',
    isSeasonal: false,
    seasonalInfo: {
      season: 'fall',
      typicalMonths: [9], // September
      isVariable: false,
      description: 'Paiement annuel des taxes scolaires'
    }
  },
  {
    id: 'heating-oil',
    name: 'Mazout de chauffage',
    amount: 1200,
    dueDate: new Date(new Date().getFullYear(), 9, 15), // September 15th
    category: 'heating',
    isRecurring: true,
    recurrencePattern: {
      type: 'annual',
      interval: 1
    },
    priority: 'high',
    isSeasonal: true,
    seasonalInfo: {
      season: 'fall',
      typicalMonths: [9, 10], // Sept-Oct preparation
      isVariable: true,
      historicalAmounts: [
        { year: 2023, amount: 1150 },
        { year: 2022, amount: 1300 },
        { year: 2021, amount: 1100 }
      ],
      description: 'Approvisionnement en mazout pour la saison de chauffage'
    }
  },
  {
    id: 'lawn-care',
    name: 'Entretien pelouse/jardin',
    amount: 600,
    dueDate: new Date(new Date().getFullYear(), 4, 1), // May 1st
    category: 'seasonal_maintenance',
    isRecurring: true,
    recurrencePattern: {
      type: 'annual',
      interval: 1
    },
    priority: 'low',
    isSeasonal: true,
    seasonalInfo: {
      season: 'spring',
      typicalMonths: [5, 6, 7, 8, 9], // May-Sept
      isVariable: true,
      description: 'Services d\'entretien paysager pour la saison estivale'
    }
  },
  {
    id: 'pool-opening',
    name: 'Ouverture/fermeture piscine',
    amount: 400,
    dueDate: new Date(new Date().getFullYear(), 4, 15), // May 15th
    category: 'seasonal_maintenance',
    isRecurring: true,
    recurrencePattern: {
      type: 'semi-annual',
      interval: 6
    },
    priority: 'medium',
    isSeasonal: true,
    seasonalInfo: {
      season: 'spring',
      typicalMonths: [5, 10], // May opening, October closing
      isVariable: false,
      description: 'Service professionnel d\'ouverture et fermeture de piscine'
    }
  }
];

// Predefined scenario templates
export const SCENARIO_TEMPLATES: Partial<ExpenseScenario>[] = [
  {
    name: "Remplacement d'électroménager",
    description: "Comparer les options pour remplacer un électroménager",
    category: 'appliances',
    scenarios: [
      {
        id: 'appliance-high',
        name: 'Modèle haut de gamme',
        amount: 2000,
        description: 'Appareil neuf avec garantie étendue',
        pros: ['Garantie complète', 'Efficacité énergétique', 'Durabilité'],
        cons: ['Coût élevé', 'Impact immédiat sur le budget'],
        paymentOptions: [],
        impact: {} as CashFlowImpact
      },
      {
        id: 'appliance-mid',
        name: 'Modèle bas de gamme',
        amount: 800,
        description: 'Appareil neuf entrée de gamme',
        pros: ['Prix abordable', 'Garantie de base'],
        cons: ['Moins durable', 'Consommation énergétique plus élevée'],
        paymentOptions: [],
        impact: {} as CashFlowImpact
      },
      {
        id: 'appliance-used',
        name: 'Appareil usagé',
        amount: 400,
        description: 'Appareil d\'occasion en bon état',
        pros: ['Prix très abordable', 'Impact minimal sur le budget'],
        cons: ['Pas de garantie', 'Durée de vie incertaine', 'Risque de réparations'],
        paymentOptions: [],
        impact: {} as CashFlowImpact
      }
    ]
  },
  {
    name: "Planification de vacances",
    description: "Comparer les options de voyage pour les vacances",
    category: 'travel',
    scenarios: [
      {
        id: 'vacation-cruise',
        name: 'Croisière',
        amount: 8000,
        description: 'Croisière de luxe tout inclus',
        pros: ['Expérience complète', 'Tout inclus', 'Détente maximale'],
        cons: ['Coût très élevé', 'Impact majeur sur le budget'],
        paymentOptions: [],
        impact: {} as CashFlowImpact
      },
      {
        id: 'vacation-mexico',
        name: 'Voyage au Mexique',
        amount: 4000,
        description: 'Séjour tout inclus au Mexique',
        pros: ['Bon rapport qualité-prix', 'Climat tropical', 'Activités variées'],
        cons: ['Coût modéré à élevé'],
        paymentOptions: [],
        impact: {} as CashFlowImpact
      },
      {
        id: 'vacation-cuba',
        name: 'Voyage à Cuba',
        amount: 2000,
        description: 'Séjour économique à Cuba',
        pros: ['Prix abordable', 'Culture unique', 'Impact modéré sur le budget'],
        cons: ['Moins de luxe', 'Options limitées'],
        paymentOptions: [],
        impact: {} as CashFlowImpact
      }
    ]
  }
];
