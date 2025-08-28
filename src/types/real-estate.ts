// ===== TYPES POUR LE MODULE D'OPTIMISATION IMMOBILIÈRE DE RETRAITE =====
// Intégration complète avec RREGOP et système de retraite existant

export interface RealEstateProperty {
  // Données de base
  valeurMarchande: number;
  coutBaseAjuste: number; // CBA pour calcul fiscal
  amortissementCumule: number;
  anneeAcquisition: number;
  typeProprieteDuplex: 'DUPLEX' | 'TRIPLEX' | 'IMMEUBLE' | 'LOGEMENT_SOUS_SOL';
  
  // Revenus et dépenses
  revenusLocatifsAnnuels: number;
  depensesAnnuelles: {
    entretien: number;
    taxes: number;
    assurances: number;
    hypotheque: number;
    gestion: number;
    autres: number;
  };
  
  // Projections
  appreciationAnnuelle: number; // % estimation
  augmentationLoyersAnnuelle: number; // % estimation
}

export interface RREGOPContext {
  // Info employé gouvernement
  anneesCotisees: number;
  salaireAnnuelMoyen: number;
  ageActuel: number;
  ageRetraitePrevu: number;
  
  // Capacité de rachat
  anneesManquantes: number;
  coutRachatParAnnee: number;
  impactPensionViagere: number; // $ mensuel ajouté par année rachetée
}

export interface PropertyAnalysis {
  rendements: {
    brut: number;
    net: number;
    apresImpot: number;
  };
  fiscalite: {
    plusValueBrute: number;
    recupAmortissement: number;
    gainEnCapitalNet: number;
    gainEnCapitalImposable: number;
    impotEstime: number;
  };
  projections: {
    valeur10ans: number;
    revenus10ans: number;
    rendement10ans: number;
  };
  fluxTresorerie: {
    annuel: number;
    apresImpot: number;
    mensuel: number;
  };
}

export interface SaleScenario {
  nom: string;
  type: 'COMPTANT' | 'RESERVE_ETALEE' | 'ECHANGE_44';
  
  // Calculs fiscaux
  gainEnCapital: number;
  recupAmortissement: number;
  impotTotalDu: number;
  liquiditeNette: number;
  
  // Étalement si applicable
  nombreAnneesEtalement?: number;
  economieImpotEtalement?: number;
  
  // Réinvestissement
  strategies: ReinvestmentStrategy[];
}

export interface ReinvestmentStrategy {
  nom: string;
  type: 'RREGOP_RACHAT' | 'REER_CELI' | 'PORTEFEUILLE' | 'MIXTE';
  montantAlloue: number;
  rendementEscompte: number;
  avantagesFiscaux: string[];
  risques: string[];
  impactRetraite: {
    pensionAnnuelle: number;
    ageRetraite: number;
    securiteFinanciere: number; // Score 1-10
  };
}

export interface ScenarioComparison {
  scenarios: SaleScenario[];
  meilleurScenario: SaleScenario;
  analyseRisque: {
    liquidite: number; // Score 1-10
    fiscalite: number; // Score 1-10
    rendement: number; // Score 1-10
    securite: number; // Score 1-10
  };
  recommandation: string;
}

export interface ExecutionPlan {
  etapes: ExecutionStep[];
  timeline: {
    debut: string;
    fin: string;
    duree: string;
  };
  contacts: Contact[];
  documents: Document[];
  checklist: string[];
}

export interface ExecutionStep {
  ordre: number;
  titre: string;
  description: string;
  duree: string;
  responsable: string;
  statut: 'A_FAIRE' | 'EN_COURS' | 'TERMINE';
  notes: string;
}

export interface Contact {
  nom: string;
  role: string;
  telephone: string;
  email: string;
  specialite: string;
}

export interface Document {
  nom: string;
  type: 'CONTRAT' | 'EVALUATION' | 'FISCAL' | 'LEGAL' | 'AUTRE';
  statut: 'REQUIS' | 'EN_COURS' | 'OBTENU';
  dateLimite?: string;
}

export interface RealEstateResults {
  hasProperty: boolean;
  currentValue?: number;
  currentReturn?: number;
  saleImpact?: number;
  netLiquidity?: number;
  rregopOpportunity?: {
    maxYears: number;
    totalCost: number;
    monthlyBoost: number;
  };
  recommendation?: string;
  error?: string;
  message?: string;
}

export interface RealEstateFormData {
  property: RealEstateProperty;
  rregop: RREGOPContext;
  preferences: {
    objectifPrincipal: 'RETRAITE' | 'LIQUIDITE' | 'OPTIMISATION_FISCALE' | 'SECURITE';
    toleranceRisque: 'FAIBLE' | 'MOYENNE' | 'ELEVEE';
    horizonTemps: number; // années
  };
}

export interface RealEstateTestData {
  testCases: {
    nom: string;
    description: string;
    input: RealEstateFormData;
    expectedOutput: RealEstateResults;
  }[];
}

export interface RealEstateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface RealEstateAnalysisSectionProps {
  className?: string;
  userPlan: 'free' | 'professional' | 'expert';
  onDataUpdate?: (data: RealEstateFormData) => void;
  onResultsUpdate?: (results: RealEstateResults) => void;
}
