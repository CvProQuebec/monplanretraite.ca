// src/features/retirement/types/couple.ts
// Types pour la gestion des pensions de couple (RRQ + CPP)

export interface PersonData {
  id: 'person1' | 'person2';
  prenom: string;
  dateNaissance: Date;
  sexe: 'M' | 'F';
  ageRetraiteSouhaite: number;
  
  // Données CPP
  cpp: {
    gainsAnnuels: number[];
    anneesCotisation: number;
    paysResidence: 'CA' | 'QC' | 'OTHER';
    pensionEstimee?: number;
  };
  
  // Données RRQ (pour les résidents du Québec)
  rrq?: {
    gainsAnnuels: number[];
    anneesCotisation: number;
    pensionEstimee?: number;
  };
  
  // Autres revenus de retraite
  autresRevenus: {
    reer: number;
    celi: number;
    regimeEmployeur: number;
    autres: number;
  };
}

export interface CoupleData {
  person1: PersonData;
  person2?: PersonData; // Optionnel pour les célibataires
  
  // Informations du couple
  couple: {
    statutConjugal: 'single' | 'married' | 'common-law' | 'divorced' | 'widowed';
    dateUnion?: Date;
    residenceQuebec: boolean;
    strategieOptimisation: 'INDIVIDUELLE' | 'COUPLE' | 'SURVIVANT';
  };
  
  // Objectifs communs
  objectifs: {
    revenuCibleMensuel: number;
    ageRetraiteCouple: number;
    esperanceVieCouple: number;
    prioriteSecurite: 'HAUTE' | 'MOYENNE' | 'FAIBLE';
  };
}

export interface CoupleCalculationResult {
  person1: {
    cpp: CPPCalculationResult;
    rrq?: RRQCalculationResult;
    total: number;
  };
  
  person2?: {
    cpp: CPPCalculationResult;
    rrq?: RRQCalculationResult;
    total: number;
  };
  
  // Résultats combinés
  couple: {
    totalMensuel: number;
    totalAnnuel: number;
    repartitionCPP: number;
    repartitionRRQ: number;
    
    // Stratégies d'optimisation
    optimisations: CoupleOptimization[];
    
    // Scénarios de survivant
    scenariosSurvivant: SurvivorScenario[];
  };
  
  // Recommandations personnalisées
  recommandations: CoupleRecommendation[];
}

export interface CoupleOptimization {
  type: 'ECHELONNEMENT' | 'PARTAGE_PENSION' | 'FRACTIONNEMENT_REVENU';
  description: string;
  economieAnnuelle: number;
  complexite: 'FACILE' | 'MOYENNE' | 'COMPLEXE';
  applicabilite: number; // 0-100%
  etapes: string[];
}

export interface SurvivorScenario {
  scenarioType: 'PERSON1_SURVIT' | 'PERSON2_SURVIT';
  ageDeces: number;
  pensionSurvivant: number;
  pensionConjoint: number;
  totalMensuel: number;
  dureeProjection: number;
  impactFinancier: 'FAIBLE' | 'MOYEN' | 'ELEVE';
}

export interface CoupleRecommendation {
  priorite: 'HAUTE' | 'MOYENNE' | 'FAIBLE';
  categorie: 'TIMING' | 'OPTIMISATION' | 'PROTECTION' | 'FISCALITE';
  titre: string;
  description: string;
  actionsConcrete: string[];
  impactFinancier: number;
  delaiImplementation: string;
  difficulte: 'FACILE' | 'MOYENNE' | 'DIFFICILE';
}

// Types pour les résultats RRQ (à définir selon la structure existante)
export interface RRQCalculationResult {
  pensionBase: number;
  pensionAjustee: number;
  montantMensuel: number;
  montantAnnuel: number;
  details: {
    anneesCotisation: number;
    gainsMoyens: number;
    facteurAjustement: number;
  };
  projections: {
    age60: number;
    age65: number;
    age70: number;
    age72: number; // Nouveau maximum RRQ
  };
}

// Import des types CPP existants
import { CPPCalculationResult } from './cpp';
