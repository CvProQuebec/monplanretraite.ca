// ===== TYPES POUR SITUATIONS D'EMPLOI PRÉCAIRE =====
// Extension pour gérer chômage, contrats temporaires, etc.

export interface EmploymentStatusData {
  // Statut d'emploi détaillé
  statutEmploi1?: EmploymentStatus;
  statutEmploi2?: EmploymentStatus;
  
  // Données d'assurance-chômage
  assuranceChomage1?: UnemploymentInsuranceData;
  assuranceChomage2?: UnemploymentInsuranceData;
  
  // Contrats de travail temporaires
  contratTravail1?: TemporaryContractData;
  contratTravail2?: TemporaryContractData;
  
  // Historique d'emploi récent
  historiqueEmploi1?: EmploymentHistory[];
  historiqueEmploi2?: EmploymentHistory[];
}

export type EmploymentStatus = 
  | 'emploi_permanent'
  | 'emploi_temporaire'
  | 'contrat_determine'
  | 'travailleur_autonome'
  | 'chomage_assurance'
  | 'chomage_sans_assurance'
  | 'conge_maladie'
  | 'conge_maternite'
  | 'retraite_anticipee'
  | 'invalide_temporaire'
  | 'invalide_permanent';

export interface UnemploymentInsuranceData {
  // Statut actuel
  enCours: boolean;
  
  // Dates de la période de chômage
  dateDebut: string; // Format: YYYY-MM-DD
  dateFinPrevue?: string; // Peut être indéterminée
  
  // Détails des prestations
  montantHebdomadaire: number;
  nombreSemainesEligibles: number; // 16 à 40 semaines selon l'historique
  nombreSemainesUtilisees: number;
  
  // Calculs automatiques
  montantMensuel: number; // montantHebdomadaire * 4.33
  montantAnnuelProrate: number; // Basé sur la durée restante
  
  // Conditions spéciales
  typePrestation: 'reguliere' | 'maladie' | 'maternite' | 'compassion' | 'peche';
  regionEconomique: string; // Affecte la durée des prestations
  tauxChomageRegional: number; // Affecte l'éligibilité
  
  // Impact sur les cotisations
  cotisationsRRQSuspendues: boolean;
  cotisationsRPCSuspendues: boolean; // Régime de pensions du Canada
  
  // Recherche d'emploi
  rechercheEmploiActive: boolean;
  formationEnCours?: boolean;
  programmeRetourEmploi?: string;
}

export interface TemporaryContractData {
  // Type de contrat
  typeContrat: 'determine' | 'projet' | 'saisonnier' | 'remplacement' | 'stage';
  
  // Dates du contrat
  dateDebut: string;
  dateFin: string;
  
  // Possibilité de renouvellement
  renouvelementPossible: boolean;
  probabiliteRenouvellement: number; // 0-100%
  
  // Conditions salariales
  salaireContrat: number; // Annuel ou total selon la durée
  avantagesSociaux: boolean;
  assuranceEmploi: boolean;
  cotisationsRetraite: boolean;
  
  // Impact sur la planification
  revenuApresContrat: 'chomage' | 'nouveau_contrat' | 'emploi_permanent' | 'retraite';
  probabiliteNouvelEmploi: number; // 0-100%
  
  // Secteur et compétences
  secteurActivite: string;
  niveauCompetences: 'debutant' | 'intermediaire' | 'expert' | 'specialise';
  demandeSecteur: 'faible' | 'moyenne' | 'forte'; // Affecte les chances de réemploi
}

export interface EmploymentHistory {
  // Période d'emploi
  dateDebut: string;
  dateFin: string;
  
  // Détails de l'emploi
  employeur: string;
  poste: string;
  salaire: number;
  typeEmploi: 'permanent' | 'temporaire' | 'contrat' | 'autonome';
  
  // Raison de fin d'emploi
  raisonFin: 'demission' | 'licenciement' | 'fin_contrat' | 'fermeture' | 'retraite' | 'maladie';
  
  // Impact sur les prestations
  admissibleAssuranceEmploi: boolean;
  cotisationsAccumulees: {
    rrq: number;
    rpc: number;
    assuranceEmploi: number;
  };
}

// ===== INTERFACES POUR LES CALCULS =====

export interface EmploymentImpactAnalysis {
  // Revenus projetés
  revenuActuelAjuste: number;
  revenuAnnuelProjetee: number;
  revenuMoyenSur5Ans: number;
  
  // Impact sur les cotisations retraite
  cotisationsRRQPerdues: number;
  cotisationsRPCPerdues: number;
  impactPensionFinale: number;
  
  // Risques identifiés
  risqueChomageRecurrent: number; // 0-100%
  risqueRevenuInstable: number;
  risqueRetraiteRetardee: number;
  
  // Recommandations spécifiques
  strategiesRecommandees: EmploymentStrategy[];
  actionsUrgentes: EmploymentAction[];
  
  // Scénarios de planification
  scenarioOptimiste: EmploymentScenario;
  scenarioRealiste: EmploymentScenario;
  scenarioPessimiste: EmploymentScenario;
}

export interface EmploymentStrategy {
  nom: string;
  description: string;
  priorite: 'haute' | 'moyenne' | 'faible';
  delaiImplementation: string;
  impactFinancier: number;
  difficulte: 'facile' | 'modere' | 'difficile';
  
  // Actions concrètes
  etapes: string[];
  ressourcesNecessaires: string[];
  indicateursSucces: string[];
}

export interface EmploymentAction {
  action: string;
  delai: string;
  impact: 'critique' | 'important' | 'utile';
  cout: number;
  
  // Contexte spécifique
  situationApplicable: EmploymentStatus[];
  ageMinimum?: number;
  ageMaximum?: number;
  
  // Liens utiles
  ressourcesGouvernementales?: string[];
  organismesSoutien?: string[];
}

export interface EmploymentScenario {
  nom: string;
  probabilite: number; // 0-100%
  
  // Projections financières
  revenuAnnuelMoyen: number;
  dureeEmploiMoyenne: number; // en mois
  periodesChomage: number; // nombre par 5 ans
  
  // Impact retraite
  ageRetraiteRealiste: number;
  capitalRetraiteProjetee: number;
  pensionsGouvernementales: number;
  
  // Mesures d'atténuation
  epargneUrgenceRequise: number;
  assurancesRecommandees: string[];
  formationsUtiles: string[];
}

// ===== PARAMÈTRES GOUVERNEMENTAUX 2025 =====

export interface UnemploymentInsuranceParameters2025 {
  // Montants maximaux
  gainsMoyensMaximum: 668; // $/semaine
  tauxPrestation: 0.55; // 55% des gains moyens
  
  // Durées selon la région
  semainesMinimum: 16;
  semainesMaximum: 40;
  
  // Période de référence
  heuresRequises: {
    regionFaibleChomage: 700; // < 6% chômage
    regionMoyenChomage: 595;  // 6-8.9% chômage
    regionFortChomage: 490;   // > 9% chômage
  };
  
  // Délai de carence
  delaiCarence: 1; // semaine
  
  // Cotisations 2025
  tauxCotisationEmploye: 0.0229; // 2.29%
  tauxCotisationEmployeur: 0.0321; // 3.21%
  plafondCotisable: 68500; // Même que RRQ
}

// ===== UTILITAIRES DE CALCUL =====

export interface EmploymentCalculationUtils {
  // Calculs d'assurance-emploi
  calculateEIBenefits(
    weeklyEarnings: number,
    hoursWorked: number,
    regionalUnemploymentRate: number
  ): UnemploymentInsuranceData;
  
  // Projections de revenus
  projectIncomeWithGaps(
    baseIncome: number,
    employmentGaps: { start: string; end: string; type: EmploymentStatus }[]
  ): number;
  
  // Impact sur les cotisations retraite
  calculateRetirementContributionImpact(
    normalIncome: number,
    actualIncome: number,
    yearsAffected: number
  ): number;
  
  // Analyse de risque d'emploi
  assessEmploymentRisk(
    age: number,
    sector: string,
    skillLevel: string,
    employmentHistory: EmploymentHistory[]
  ): number;
}
