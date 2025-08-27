// src/features/retirement/types/rregop-types.ts
// Types étendus pour RREGOP à intégrer dans UserData existant

export interface RREGOPMemberData {
  // Statut de membre
  estMembreRREGOP: boolean;
  numeroMembre?: string;
  typeRegime?: 'RREGOP' | 'RRE' | 'RRF' | 'RRCE';
  
  // Emploi actuel
  employeurActuel?: string;
  dateEmbauche?: string;
  statutEmploi?: 'actif' | 'retraite' | 'suspension' | 'conge-sans-solde' | 'temps-partiel';
  
  // Données salariales RREGOP
  salaireAdmissibleActuel?: number;
  historiqueSalaires?: {
    annee: number;
    salaire: number;
    heuresTravaillees?: number;
  }[];
  
  // Service et cotisations
  anneesServiceTotal?: number;
  anneesServiceCreditees?: number; // Incluant rachats
  anneesRachetees?: number;
  
  // Cotisations accumulées
  cotisationsEmploye?: number;
  cotisationsEmployeur?: number;
  intérêtsAccumules?: number;
  
  // Plans de retraite RREGOP
  planRetraiteChoisi?: 'normal' | 'anticipe' | 'differe';
  ageRetraitePrevu?: number;
  
  // Coordination
  coordinationRRQActivée?: boolean;
  
  // Options de rente
  optionRente?: 'viagere' | 'garantie-5-ans' | 'garantie-10-ans' | 'conjoint-60' | 'conjoint-50';
  
  // Prestations estimées
  pensionEstimeeActuelle?: number;
  pensionEstimee60?: number;
  pensionEstimee65?: number;
  
  // Documents et statut
  dernierRelevéDate?: string;
  prochainRelevéDû?: string;
  demandePensionSoumise?: boolean;
  dateDemandePension?: string;
}

// Extension de l'interface UserData existante
export interface UserDataRREGOPExtended {
  personal: PersonalDataWithRREGOP;
  retirement: RetirementDataWithRREGOP;
  savings: SavingsData;
  cashflow: CashflowData;
  advancedExpenses?: AdvancedExpensesData;
  employmentStatus?: EmploymentStatusData;
  rregopData?: {
    person1?: RREGOPMemberData;
    person2?: RREGOPMemberData;
  };
}

export interface PersonalDataWithRREGOP {
  // Champs existants (tous optionnels pour compatibilité)
  prenom1?: string;
  prenom2?: string;
  naissance1?: string;
  naissance2?: string;
  sexe1?: 'M' | 'F';
  sexe2?: 'M' | 'F';
  salaire1?: number;
  salaire2?: number;
  
  // NOUVEAUX champs RREGOP
  secteurPublic1?: boolean; // Indique si employé du secteur public
  secteurPublic2?: boolean;
  organismeEmployeur1?: string; // Ministère, organisme, etc.
  organismeEmployeur2?: string;
  classificationEmploi1?: string; // Classification selon la convention
  classificationEmploi2?: string;
  
  // Statut syndical/professionnel (affecte RREGOP)
  statutSyndical1?: 'syndique' | 'cadre' | 'professionnel' | 'occasionnel';
  statutSyndical2?: 'syndique' | 'cadre' | 'professionnel' | 'occasionnel';
  
  // Type de nomination (affecte l'admissibilité RREGOP)
  typeNomination1?: 'permanente' | 'temporaire' | 'contractuelle' | 'occasionnelle';
  typeNomination2?: 'permanente' | 'temporaire' | 'contractuelle' | 'occasionnelle';
  
  // Tous les autres champs existants...
  [key: string]: any;
}

export interface RetirementDataWithRREGOP {
  // Champs RRQ existants
  rrqAgeActuel1?: number;
  rrqAgeActuel2?: number;
  rrqMontant65_1?: number;
  rrqMontant65_2?: number;
  esperanceVie1?: number;
  esperanceVie2?: number;
  
  // NOUVEAUX champs RREGOP
  rregopMembre1?: boolean; // Est membre du RREGOP
  rregopMembre2?: boolean;
  rregopNumero1?: string; // Numéro de membre CARRA
  rregopNumero2?: string;
  
  // Service et cotisations RREGOP
  rregopAnneesService1?: number;
  rregopAnneesService2?: number;
  rregopAnneesRachetees1?: number;
  rregopAnneesRachetees2?: number;
  rregopCotisationsAccumulees1?: number;
  rregopCotisationsAccumulees2?: number;
  
  // Pension RREGOP estimée
  rregopPension60_1?: number; // À 60 ans
  rregopPension60_2?: number;
  rregopPension65_1?: number; // À 65 ans
  rregopPension65_2?: number;
  rregopPensionActuelle1?: number; // Si déjà retraité
  rregopPensionActuelle2?: number;
  
  // Stratégie RREGOP
  rregopStrategie1?: 'normale' | 'anticipee' | 'differee';
  rregopStrategie2?: 'normale' | 'anticipee' | 'differee';
  rregopAgeOptimal1?: number;
  rregopAgeOptimal2?: number;
  
  // Intégration avec autres pensions
  rregopCoordinationRRQ1?: boolean;
  rregopCoordinationRRQ2?: boolean;
  rregopReductionRRQ1?: number;
  rregopReductionRRQ2?: number;
  
  // Pensions privées (existant - à conserver)
  pensionPrivee1?: number;
  pensionPrivee2?: number;
  ageDebutPensionPrivee1?: number;
  ageDebutPensionPrivee2?: number;
  
  // Tous les autres champs existants...
  [key: string]: any;
}

// Interface pour les calculs RREGOP intégrés
export interface RREGOPIntegratedCalculation {
  // Résultats RREGOP
  pensionRREGOP: number;
  pensionRRQ: number;
  pensionSV: number;
  pensionSRG: number;
  pensionPrivee: number;
  
  // Total et coordination
  pensionTotaleAvant65: number; // RREGOP + pension privée + SV éventuel
  pensionTotaleApres65: number; // + RRQ avec coordination
  coordinationImpact: number;
  
  // Analyse
  tauxRemplacementActuel: number;
  tauxRemplacementObjectif: number;
  lacuneRevenu: number;
  
  // Recommandations spécifiques RREGOP
  recommandationsRREGOP: string[];
  optimisationsDisponibles: RREGOPOptimization[];
}

export interface RREGOPOptimization {
  type: 'rachat_annees' | 'age_retraite' | 'option_rente' | 'coordination_epargne';
  titre: string;
  description: string;
  impact: number; // Impact sur la pension mensuelle
  cout: number; // Coût d'implémentation
  delai: string;
  avantages: string[];
  risques: string[];
  priorite: 'haute' | 'moyenne' | 'faible';
}

// Données de validation CARRA (pour tests)
export interface CARRAValidationData {
  numeroMembre: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  employeurActuel: string;
  statutValide: boolean;
  derniereMiseAJour: string;
  
  // Données validées CARRA
  anneesServiceValidees: number;
  salaireAdmissibleActuel: number;
  cotisationsAJour: boolean;
  pensionProjetee60: number;
  pensionProjetee65: number;
}

// Messages d'erreur et validation RREGOP
export interface RREGOPValidation {
  isValid: boolean;
  errors: RREGOPValidationError[];
  warnings: RREGOPValidationWarning[];
}

export interface RREGOPValidationError {
  field: string;
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface RREGOPValidationWarning {
  field: string;
  code: string;
  message: string;
  suggestion: string;
}

// Constantes RREGOP 2025
export const RREGOP_CONSTANTS_2025 = {
  // Âges critiques
  AGE_NORMAL: 60,
  AGE_ANTICIPE_MIN: 55,
  AGE_DIFFERE_MAX: 69,
  
  // Taux et facteurs
  FACTEUR_RENTE: 0.02, // 2% par année
  TAUX_COTISATION_BASE: 0.1015, // 10.15%
  TAUX_COTISATION_ELEVE: 0.1225, // 12.25%
  SEUIL_COTISATION: 64550,
  
  // Coordination RRQ
  FACTEUR_COORDINATION: 0.7,
  
  // Indexation
  TAUX_INDEXATION: 0.025, // 2.5%
  
  // Prestations survivants
  TAUX_CONJOINT_SURVIVANT: 0.60, // 60%
  TAUX_ENFANT_ORPHELIN: 0.30, // 30%
  
  // Validation
  ANNEES_SERVICE_MAX: 38,
  SALAIRE_MIN: 15000,
  SALAIRE_MAX: 200000
} as const;

// Types pour l'interface utilisateur RREGOP
export interface RREGOPFormData {
  // Étape 1: Identification
  estMembreRREGOP: boolean;
  numeroMembre: string;
  employeur: string;
  dateEmbauche: string;
  
  // Étape 2: Service et salaires
  anneesService: number;
  anneesRachetees: number;
  salaireActuel: number;
  historiquesSalaires: { annee: number; salaire: number }[];
  
  // Étape 3: Stratégie de retraite
  ageRetraitePrevu: number;
  typeRetraite: 'normale' | 'anticipee' | 'differee';
  optionRente: string;
  
  // Étape 4: Intégration
  autresPensions: boolean;
  pensionPrivee?: number;
  objectifRemplacement: number;
}

export interface RREGOPUIState {
  currentStep: number;
  formData: RREGOPFormData;
  calculationResult?: RREGOPIntegratedCalculation;
  validationState: RREGOPValidation;
  isLoading: boolean;
  errors: string[];
}