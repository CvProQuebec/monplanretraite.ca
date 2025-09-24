// ===== INDEX DES TYPES RETIREMENT =====
// Export centralisé de tous les types

// Nouveaux types CCQ
export type * from './ccq';
export type * from './services';

// Types principaux étendus pour inclure l'emploi précaire
export interface UserData {
  personal: PersonalData;
  retirement: RetirementData;
  savings: SavingsData;
  cashflow: CashflowData;
  emergency?: EmergencyData;
  session?: SessionData;
  advancedExpenses?: AdvancedExpensesData;
  employmentStatus?: any; // NOUVEAU
  ccqData?: any; // NOUVEAU - Données CCQ
  ccqResult?: any; // NOUVEAU - Résultats CCQ
  ccqScenarios?: any; // NOUVEAU - Scénarios CCQ
  seasonalExpenses?: {
    expenses: SeasonalExpense[];
    lastUpdated?: string;
  };
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

  // Champs pour les deux personnes (province, santé, mode de vie)
  province1?: string;
  province2?: string;
  etatSante1?: 'excellent' | 'tresbon' | 'bon' | 'moyen' | 'fragile';
  etatSante2?: 'excellent' | 'tresbon' | 'bon' | 'moyen' | 'fragile';
  modeVieActif1?: 'sedentaire' | 'legerementActif' | 'modere' | 'actif' | 'tresActif';
  modeVieActif2?: 'sedentaire' | 'legerementActif' | 'modere' | 'actif' | 'tresActif';

  // Champs de revenus supplémentaires
  pensions1?: number;
  pensions2?: number;
  autresRevenus1?: number;
  autresRevenus2?: number;
  
  // Champs de revenus détaillés
  assuranceEmploi1?: number;
  assuranceEmploi2?: number;
  rentesViageres1?: number;
  rentesViageres2?: number;

  // Champs de dépenses
  logement1?: number;
  transport1?: number;
  autresDepenses1?: number;
  epicerie2?: number;
  servicesPublics2?: number;
  autresDepenses2?: number;

  // Champs de calculs de retraite
  epargneActuelle1?: number;
  epargneActuelle2?: number;
  cotisationsAnnuelles1?: number;
  cotisationsAnnuelles2?: number;

  // NOUVEAUX: Informations d'emploi détaillées
  secteurActivite1?: string;
  secteurActivite2?: string;
  niveauCompetences1?: string;
  niveauCompetences2?: string;
  regionEconomique?: string;
  tauxChomageRegional?: number;

  // NOUVEAUX: Emplois saisonniers
  seasonalJobs1?: SeasonalJob[];
  seasonalJobs2?: SeasonalJob[];

  // NOUVEAUX: Revenus unifiés
  unifiedIncome1?: IncomeEntry[];
  unifiedIncome2?: IncomeEntry[];
  
  // Champs d'investissements
  soldeREER1?: number;
  dateREER1?: string;
  soldeCELI1?: number;
  dateCELI1?: string;
  soldeCRI1?: number;
  dateCRI1?: string;
  soldeREER2?: number;
  dateREER2?: string;
  soldeCELI2?: number;
  dateCELI2?: string;
  soldeCRI2?: number;
  dateCRI2?: string;

  // NOUVEAU: Travailleur de la construction
  travailleurConstruction1?: boolean;
  travailleurConstruction2?: boolean;
  certificatCCQ1?: string;
  certificatCCQ2?: string;

  // NOUVEAU: Informations optionnelles pour CPM2014 et projections
  etatSante?: 'excellent' | 'tresbon' | 'bon' | 'moyen' | 'fragile';
  modeVieActif?: 'sedentaire' | 'legerementActif' | 'modere' | 'actif' | 'tresActif';
  toleranceRisque?: 'conservateur' | 'modere' | 'equilibre' | 'dynamique' | 'agressif';
  horizonInvestissement?: 'court' | 'moyen' | 'long' | 'retraite';
  inflationPersonnalisee?: number;
  rendementPersonnalise?: number;

  // NOUVEAU: Informations pour le conseiller intelligent
  experienceFinanciere?: 'debutant' | 'intermediaire' | 'experimente' | 'expert';
  objectifPrincipal?: 'epargne' | 'retraite' | 'investissement' | 'dettes' | 'urgence' | 'fiscalite';
  tempsDisponible?: 'tres-limite' | 'limite' | 'modere' | 'disponible';
  toleranceRisqueInvestissement?: 'tres-conservateur' | 'conservateur' | 'equilibre' | 'dynamique' | 'agressif';
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
  
  // Champs pour la gestion biannuelle SV
  svBiannual1?: {
    annee: number;
    periode1: {
      dateDebut: string;
      dateFin: string;
      montant: number;
    };
    periode2: {
      dateDebut: string;
      dateFin: string;
      montant: number;
    };
    raisonAjustement?: string;
    revenus_annee_precedente?: number;
  };
  svBiannual2?: {
    annee: number;
    periode1: {
      dateDebut: string;
      dateFin: string;
      montant: number;
    };
    periode2: {
      dateDebut: string;
      dateFin: string;
      montant: number;
    };
    raisonAjustement?: string;
    revenus_annee_precedente?: number;
  };
  
  // Propriétés existantes
  revenusTempsPartiel1?: number;
  revenusTempsPartiel2?: number;
  
  // NOUVEAU: Données CCQ
  ccqPension1?: number;
  ccqPension2?: number;
  ccqAgeRetraite1?: number;
  ccqAgeRetraite2?: number;
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

  // NOUVEAU: Champs pour le conseiller intelligent
  fondsUrgence?: number;
  dettesTotales?: number;
  epargneRetraite?: number;
  tauxEpargne?: number;
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
  employmentImpactAnalysis?: any; // NOUVEAU
  ccqProjection?: any; // NOUVEAU - Projections CCQ
  
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

// Types pour emplois saisonniers et revenus unifiés
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

// NOUVEAU: Interface pour les données d'urgence
export interface EmergencyData {
  contactsUrgence?: string;
  directivesMedicales?: string;
  assuranceVie?: number;
  testament?: string;
}

// NOUVEAU: Interface pour les données de session
export interface SessionData {
  sauvegardeLocale?: boolean;
  sauvegardeCloud?: boolean;
  exportDonnees?: boolean;
  importDonnees?: boolean;
}

// NOUVEAU: Interface pour les dépenses saisonnières
export interface SeasonalExpense {
  id: string;
  category: 'automobile' | 'maison' | 'sante' | 'taxes' | 'personnel';
  name: string;
  description: string;
  isActive: boolean;
  estimatedAmount: number;
  frequency: 'annually' | 'biannually' | 'every2years' | 'every3years' | 'every5years' | 'asNeeded';
  isPlanned: boolean;
  plannedDate?: string;
  notes?: string;
}
