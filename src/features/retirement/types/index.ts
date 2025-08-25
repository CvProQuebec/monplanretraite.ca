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
  statutProfessionnel1?: 'actif' | 'retraite' | 'sans-emploi' | 'conge-maladie' | 'conge-parental';
  statutProfessionnel2?: 'actif' | 'retraite' | 'sans-emploi' | 'conge-maladie' | 'conge-parental';
  ageRetraiteSouhaite1?: number;
  ageRetraiteSouhaite2?: number;
  depensesRetraite?: number;
  
  // NOUVEAUX: Champs pour les revenus détaillés
  typeRevenu1?: 'salaire' | 'assurance-emploi' | 'rentes' | 'dividendes' | 'revenus-location' | 'travail-autonome' | 'autres';
  typeRevenu2?: 'salaire' | 'assurance-emploi' | 'rentes' | 'dividendes' | 'revenus-location' | 'travail-autonome' | 'autres';
  typeEmploi1?: 'permanent' | 'partiel' | 'contrat' | 'saisonnier' | 'autonome';
  typeEmploi2?: 'permanent' | 'partiel' | 'contrat' | 'saisonnier' | 'autonome';
  dureeContrat1?: number;
  dureeContrat2?: number;
  dateFinContrat1?: string;
  dateFinContrat2?: string;
  notesSupplementaires1?: string;
  notesSupplementaires2?: string;
  
  // NOUVEAUX: Champs pour la Sécurité de la vieillesse
  ageSV1?: number;
  ageSV2?: number;
  statutSV1?: 'admissible' | 'partiel' | 'incertain' | 'non-admissible';
  statutSV2?: 'admissible' | 'partiel' | 'incertain' | 'non-admissible';
  anneesResidenceCanada1?: number;
  anneesResidenceCanada2?: number;
  
  // Champs manquants pour compatibilité
  nom1?: string;
  nom2?: string;
  situationFamiliale?: string;
  nombreEnfants?: number;
  province?: string;
  
  // Champs pour les dépenses de retraite
  depensesMensuelles?: number;
  depensesAnnuelles?: number;
  
  // NOUVEAUX: Informations d'emploi détaillées
  secteurActivite1?: string;
  secteurActivite2?: string;
  niveauCompetences1?: 'debutant' | 'intermediaire' | 'expert' | 'specialise';
  niveauCompetences2?: 'debutant' | 'intermediaire' | 'expert' | 'specialise';
  regionEconomique?: string;
  tauxChomageRegional?: number;
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
  
  // NOUVEAUX: Ajustements de la Sécurité de la vieillesse par période
  svAjustements1?: SVAdjustment[];
  svAjustements2?: SVAdjustment[];
  
  // Propriétés existantes
  revenusTempsPartiel1?: number;
  revenusTempsPartiel2?: number;
}

// Interface pour les ajustements de la Sécurité de la vieillesse
export interface SVAdjustment {
  id: string;
  dateDebut: string; // Format YYYY-MM-DD
  dateFin: string; // Format YYYY-MM-DD
  montantMensuel: number;
  raison: string; // Ex: "Ajustement basé sur les revenus de l'année précédente"
  typeAjustement: 'reduction' | 'augmentation' | 'suspension' | 'retablissement';
  montantOriginal?: number; // Pour référence
  pourcentageAjustement?: number; // Pourcentage de réduction/augmentation
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
