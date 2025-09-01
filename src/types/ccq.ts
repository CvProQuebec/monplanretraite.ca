// ===== TYPES CCQ - COMMISSION DE LA CONSTRUCTION DU QUÉBEC =====
// Types pour le régime de retraite des travailleurs de la construction

export interface CCQData {
  // Identification du travailleur
  certificatCompetence: string;
  dateEntreeIndustrie: Date;
  statutTravailleur: 'actif' | 'retraite' | 'inactif' | 'suspendu';
  
  // Secteurs d'activité (choix multiples possibles)
  secteursActivite: CCQSecteur[];
  secteurPrincipal: CCQSecteur;
  
  // Données historiques de travail
  heuresTravaileesAvant2005: number; // Heures travaillées avant 2005
  heuresAjusteesAvant2005: number; // Heures ajustées (programmes gouvernementaux)
  heuresTravaileesDepuis2005: number; // Heures travaillées depuis 2005
  heuresTotales: number; // Total des heures travaillées
  
  // Valeurs des comptes (du Relevé annuel CCQ)
  valeurCompteGeneral: number; // Compte Général (pré-2005)
  valeurCompteComplementaire: number; // Compte Complémentaire (post-2005)
  
  // Cotisations et rendements
  cotisationsPatronales: number;
  cotisationsSalariales: number;
  rendements: number;
  
  // Projections futures
  heuresAnnuellesEstimees: number;
  ageRetraiteSouhaite: number;
  continuerTravaillerConstruction: boolean;
  
  // Options de retraite
  typeRetraite: CCQRetirementType;
  optionRente: CCQRenteOption;
  
  // Prestations de décès
  prestationsDecesActuelles: number;
  beneficiaireDeces?: string;
}

export type CCQSecteur = 
  | 'residentiel' 
  | 'institutionnel-commercial' 
  | 'industriel' 
  | 'genie-civil-voirie';

export type CCQRetirementType = 
  | 'normale' // 65 ans
  | 'anticipee-sans-reduction' // 55 ans avec conditions
  | 'anticipee-avec-reduction' // 55 ans avec pénalités
  | 'invalidite' // 50 ans avec conditions
  | 'partielle'; // Depuis juillet 2014

export type CCQRenteOption = 
  | 'nivelee' // Montant constant
  | 'majoree-reduite'; // Plus élevé avant 65 ans, réduit après

export interface CCQCalculationResult {
  // Calculs des comptes
  compteGeneral: CCQGeneralAccountResult;
  compteComplementaire: CCQComplementaryAccountResult;
  
  // Totaux
  renteAnnuelleTotale: number;
  renteMensuelleTotale: number;
  
  // Réductions pour retraite anticipée
  facteurReduction?: number;
  montantReduction?: number;
  
  // Options de rente
  renteNivelee: CCQRenteCalculation;
  renteMajoreeReduite: CCQRenteCalculation;
  
  // Admissibilité
  admissibilite: CCQEligibilityResult;
  
  // Projections
  projectionViagere: number;
  valeurActualisee: number;
  
  // Coordination avec régimes publics
  coordinationRRQ: number;
  coordinationPSV: number;
  coordinationSRG: number;
  
  // Recommandations
  ageOptimalRetraite: number;
  strategieRecommandee: string;
  optimisationSuggestions: CCQOptimizationSuggestion[];
}

export interface CCQGeneralAccountResult {
  // Compte Général (pré-2005)
  heuresAjustees: number;
  tauxRenteAnnuel: number; // Taux de l'année
  renteAnnuelle: number;
  renteMensuelle: number;
  description: string;
}

export interface CCQComplementaryAccountResult {
  // Compte Complémentaire (post-2005)
  valeurAccumulee: number;
  facteurActuariel: number;
  renteAnnuelle: number;
  renteMensuelle: number;
  description: string;
}

export interface CCQRenteCalculation {
  type: CCQRenteOption;
  montantAvant65: number;
  montantApres65: number;
  avantages: string[];
  inconvenients: string[];
  valeurViagere: number;
  recommande: boolean;
}

export interface CCQEligibilityResult {
  // Admissibilité selon l'âge et les heures
  retraiteNormale: CCQEligibilityCheck;
  retraiteAnticipeeSansReduction: CCQEligibilityCheck;
  retraiteAnticipeeAvecReduction: CCQEligibilityCheck;
  retraiteInvalidite: CCQEligibilityCheck;
  retraitePartielle: CCQEligibilityCheck;
  
  // Dates d'admissibilité
  dateAdmissibiliteNormale: Date;
  dateAdmissibiliteAnticipee: Date;
  
  // Statut actuel
  statutActuel: string;
  prochaineMilestone: string;
}

export interface CCQEligibilityCheck {
  eligible: boolean;
  ageRequis: number;
  heuresRequises?: number;
  conditionsSpeciales?: string[];
  dateAdmissibilite?: Date;
  description: string;
}

export interface CCQOptimizationSuggestion {
  strategie: string;
  description: string;
  impact: number;
  requisits: string[];
  delaiImplementation: string;
  avantages: string[];
  inconvenients: string[];
  priorite: 'haute' | 'moyenne' | 'basse';
}

export interface CCQProjectionScenario {
  nom: string;
  ageRetraite: number;
  heuresSupplementaires: number;
  typeRetraite: CCQRetirementType;
  optionRente: CCQRenteOption;
  resultat: CCQCalculationResult;
  avantages: string[];
  risques: string[];
}

export interface CCQValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingData: string[];
}

// ===== PARAMÈTRES CCQ 2025 =====
export const CCQ_PARAMS_2025 = {
  // Âges de retraite
  AGE_RETRAITE_NORMALE: 65,
  AGE_RETRAITE_ANTICIPEE_MIN: 55,
  AGE_RETRAITE_INVALIDITE_MIN: 50,
  AGE_RETRAITE_OBLIGATOIRE: 71,
  
  // Conditions d'heures
  HEURES_INVALIDITE_MIN: 21000,
  
  // Facteurs de réduction
  REDUCTION_ANNUELLE: 0.03, // 3% par année d'anticipation
  REDUCTION_MENSUELLE: 0.0025, // 0.25% par mois d'anticipation
  
  // Taux de rente annuel (exemple 2025)
  TAUX_RENTE_ANNUEL_2025: 28.50, // $ par heure ajustée
  
  // Facteurs actuariels par âge (exemples)
  FACTEURS_ACTUARIELS: {
    55: 0.0045,
    56: 0.0048,
    57: 0.0051,
    58: 0.0054,
    59: 0.0057,
    60: 0.0060,
    61: 0.0063,
    62: 0.0066,
    63: 0.0069,
    64: 0.0072,
    65: 0.0075,
    66: 0.0078,
    67: 0.0081,
    68: 0.0084,
    69: 0.0087,
    70: 0.0090,
    71: 0.0093
  } as Record<number, number>,
  
  // Coordination avec régimes publics
  COORDINATION_RRQ_FACTEUR: 0.7,
  COORDINATION_PSV_FACTEUR: 1.0,
  
  // Indexation
  TAUX_INDEXATION: 0.025, // 2.5% annuel
  
  // Espérance de vie
  ESPERANCE_VIE_HOMME: 82,
  ESPERANCE_VIE_FEMME: 85,
  
  // Taux d'actualisation
  TAUX_ACTUALISATION: 0.03 // 3%
};

// ===== TYPES POUR L'INTERFACE UTILISATEUR =====
export interface CCQFormData {
  // Étape 1: Identification
  certificatCompetence: string;
  dateEntreeIndustrie: string;
  secteursActivite: CCQSecteur[];
  
  // Étape 2: Données historiques
  releveAnnuelCCQ?: File; // Upload du relevé
  saisieManuelle: boolean;
  heuresTravaileesAvant2005: string;
  heuresAjusteesAvant2005: string;
  heuresTravaileesDepuis2005: string;
  valeurCompteGeneral: string;
  valeurCompteComplementaire: string;
  
  // Étape 3: Projections
  continuerTravaillerConstruction: boolean;
  heuresAnnuellesEstimees: string;
  ageRetraiteSouhaite: string;
  typeRetraitePreferee: CCQRetirementType;
  optionRentePreferee: CCQRenteOption;
}

export interface CCQDashboardData {
  // Vue d'ensemble
  totalAccumule: number;
  heuresTravaileesTotales: number;
  anneesService: number;
  
  // Admissibilité
  admissibiliteActuelle: CCQEligibilityResult;
  prochaineEtape: string;
  tempsRestant: string;
  
  // Projections
  renteEstimee: number;
  dateRetraiteOptimale: Date;
  
  // Alertes et recommandations
  alertes: string[];
  recommandations: string[];
}

// ===== TYPES POUR LES RAPPORTS =====
export interface CCQReportData {
  // Informations personnelles
  travailleur: {
    nom: string;
    certificat: string;
    dateEntree: Date;
    secteurs: CCQSecteur[];
  };
  
  // Résumé des comptes
  comptes: {
    general: CCQGeneralAccountResult;
    complementaire: CCQComplementaryAccountResult;
    total: number;
  };
  
  // Scénarios analysés
  scenarios: CCQProjectionScenario[];
  
  // Recommandations
  recommandations: CCQOptimizationSuggestion[];
  
  // Coordination avec autres régimes
  coordination: {
    rrq: number;
    psv: number;
    srg: number;
    total: number;
  };
  
  // Métadonnées du rapport
  dateGeneration: Date;
  version: string;
  avertissements: string[];
}
