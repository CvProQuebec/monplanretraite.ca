// Types pour le module SRG (Supplément de Revenu Garanti)
// 100% SÉCURISÉ - AUCUNE TRANSMISSION RÉSEAU

// ===== TYPES SRG PRINCIPAUX =====

export interface SRGEligibilityData {
  age: number;
  revenuAnnuel: number;
  statutConjoint: 'SEUL' | 'CONJOINT_SANS_SV' | 'CONJOINT_AVEC_SV';
  revenuConjoint?: number;
  anneesResidenceCanada: number;
}

export interface SRGCalculationResult {
  eligible: boolean;
  montantMensuel: number;
  montantAnnuel: number;
  revenuMaximal: number;
  reductionAppliquee: number;
  raisonIneligibilite?: string;
  
  // Détails du calcul
  detailsCalcul: {
    montantMaximal: number;
    revenuCombiné: number;
    tauxReduction: number;
    exemptionBase: number;
  };
  
  // Optimisations possibles
  optimisations: SRGOptimization[];
  
  // Scénarios d'amélioration
  scenarios: SRGScenario[];
}

export interface SRGOptimization {
  type: 'REDUCTION_REVENU' | 'CHANGEMENT_STATUT' | 'TIMING_DEMANDE' | 'FRACTIONNEMENT_REVENU';
  description: string;
  impactPotentiel: number;
  difficulte: 'FACILE' | 'MOYENNE' | 'DIFFICILE';
  actions: string[];
}

export interface SRGScenario {
  nom: string;
  revenuCible: number;
  srgEstime: number;
  gainPotentiel: number;
  faisabilite: 'HAUTE' | 'MOYENNE' | 'FAIBLE';
}

export interface CombinedSRGAnalysis {
  person1: SRGCalculationResult;
  person2?: SRGCalculationResult;
  totalHousehold: {
    srgTotal: number;
    optimisationCombinee: number;
    strategiesCouple: string[];
  };
}

// ===== EXTENSIONS POUR VOS TYPES EXISTANTS =====

export interface PersonalDataSRGExtension {
  // Champs spécifiques au SRG
  anneesResidenceCanada1?: number;
  anneesResidenceCanada2?: number;
  
  // Revenus détaillés pour calcul SRG précis
  revenusAutres1?: number;
  revenusAutres2?: number;
  
  // Statut SRG actuel (si déjà en demande)
  srgActuel1?: {
    recoit: boolean;
    montantMensuel?: number;
    dateDebut?: string;
  };
  srgActuel2?: {
    recoit: boolean;
    montantMensuel?: number;
    dateDebut?: string;
  };
}

export interface RetirementDataSRGExtension {
  // Données SRG spécifiques
  srgData?: {
    person1: {
      eligible: boolean;
      montantEstime: number;
      statutDemande: 'non-demande' | 'en-cours' | 'approuve' | 'refuse';
      dateDemande?: string;
      prochainReexamen?: string;
    };
    person2?: {
      eligible: boolean;
      montantEstime: number;
      statutDemande: 'non-demande' | 'en-cours' | 'approuve' | 'refuse';
      dateDemande?: string;
      prochainReexamen?: string;
    };
    optimisations: {
      strategiesIdentifiees: string[];
      impactPotentiel: number;
      priorite: 'HAUTE' | 'MOYENNE' | 'FAIBLE';
    };
  };
}

// ===== TYPES POUR L'INTÉGRATION AVEC CALCULATIONSERVICE =====

export interface CalculationsWithSRG {
  // Tous les calculs existants
  rrq?: number;
  oasAmount?: number;
  totalMonthlyIncome?: number;
  totalAnnualIncome?: number;
  
  // NOUVEAU: Analyse SRG
  srgAnalysis?: SRGCalculations;
  totalGovernmentBenefitsWithSRG?: {
    monthly: number;
    annual: number;
    breakdown: {
      oasCpp: number;
      srg: number;
      other: number;
    };
  };
  srgImpact?: {
    onTotalRetirementIncome: number;
    onTaxOptimization: string[];
    onWithdrawalStrategy: string[];
  };
}

export interface SRGCalculations {
  person1: SRGPersonResult;
  person2?: SRGPersonResult;
  combined: SRGCombinedResult;
  optimizations: SRGOptimizationResult[];
  scenarios: SRGScenarioResult[];
}

export interface SRGPersonResult {
  eligible: boolean;
  montantMensuel: number;
  montantAnnuel: number;
  revenuConsidere: number;
  seuilRevenu: number;
  reductionAppliquee: number;
  raisonIneligibilite?: string;
  
  // Détails du calcul
  calculDetails: {
    montantMaximum: number;
    statutConjoint: 'SEUL' | 'CONJOINT_SANS_SV' | 'CONJOINT_AVEC_SV';
    tauxReduction: number;
    exemptionBase: number;
  };
}

export interface SRGCombinedResult {
  totalMensuel: number;
  totalAnnuel: number;
  optimisationPotentielle: number;
  strategiesCouple: string[];
  impactFiscal: {
    economieImpot: number;
    impactAutresPrestations: string[];
  };
}

export interface SRGOptimizationResult {
  type: 'REDUCTION_REVENU' | 'FRACTIONNEMENT' | 'TIMING' | 'INVESTISSEMENT';
  titre: string;
  description: string;
  impactEstime: number;
  difficulte: 'FACILE' | 'MOYENNE' | 'DIFFICILE';
  actions: string[];
  priorite: 'HAUTE' | 'MOYENNE' | 'FAIBLE';
}

export interface SRGScenarioResult {
  nom: string;
  revenuCible: number;
  srgEstime: number;
  gainPotentiel: number;
  faisabilite: 'HAUTE' | 'MOYENNE' | 'FAIBLE';
  actionsRecommandees: string[];
  impactSurAutresPrestations: string[];
}

// ===== TYPES POUR L'INTERFACE UTILISATEUR =====

export interface SRGAnalysisSectionProps {
  userData: any; // Sera typé avec vos types existants
  onDataChange?: (updates: any) => void;
  isEnglish?: boolean;
}

export interface SRGFormData {
  anneesResidenceCanada1: number;
  anneesResidenceCanada2?: number;
  revenusAutres1: number;
  revenusAutres2?: number;
  srgActuel1: {
    recoit: boolean;
    montantMensuel?: number;
    dateDebut?: string;
  };
  srgActuel2?: {
    recoit: boolean;
    montantMensuel?: number;
    dateDebut?: string;
  };
}

// ===== TYPES POUR LES TESTS ET VALIDATION =====

export interface SRGTestData {
  testCase: string;
  input: {
    age1: number;
    age2?: number;
    revenu1: number;
    revenu2?: number;
    statutConjoint: 'SEUL' | 'CONJOINT_SANS_SV' | 'CONJOINT_AVEC_SV';
  };
  expected: {
    eligible: boolean;
    montantMensuel: number;
    montantAnnuel: number;
  };
}

export interface SRGValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}
