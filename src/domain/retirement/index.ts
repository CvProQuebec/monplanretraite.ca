/**
 * Domaine: Retraite — Interfaces de contrat (pas d'implémentation ici)
 * Objectif: clarifier la frontière UI ↔ Domaine sans modifier les calculs existants.
 * NOTE: ces interfaces n'imposent aucune migration immédiate; elles guident l'évolution.
 */

/** Données utilisateur retraite (schéma exact non imposé ici) */
export interface RetirementUserData {
  // Structure volontairement souple pour éviter les couplages — à préciser par itérations.
  [key: string]: any;
}

/** Résultats de calcul retraite de haut niveau */
export interface RetirementCalculationResult {
  netWorth?: number;
  retirementCapital?: number;
  sufficiency?: number;
  taxSavings?: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  [key: string]: any;
}

/** Moteur fiscal (contrat simplifié) */
export interface ITaxEngine {
  computeAnnualTax(input: any): { totalTax: number; breakdown: Record<string, number> };
  projectMultiYear(input: any): { years: number[]; totals: number[]; details?: any };
}

/** Politique fiscale (lecture seule, tables/barèmes) */
export interface ITaxPolicy {
  getBrackets(province: string, year: number): any;
  getCredits(year: number): any;
}

/** Projection (multi-années) */
export interface IProjectionEngine {
  runProjection(params: any): { timeline: any[]; aggregates: any };
}

/** Robustesse (stress tests) */
export interface IRobustnessService {
  evaluateShocks(plan: any, options?: { inflationHigh?: boolean; longevityPlus?: boolean; sequenceShock?: boolean }): {
    score: number;
    explanations: string[];
    metrics: Record<string, number>;
  };
}

/** Optimisation fiscale (DP/Beam/Greedy, interface unifiée) */
export interface ITaxOptimizationService {
  optimize(input: any, strategy?: 'DP_BEAM' | 'GREEDY' | 'RRSP_ONLY'): {
    policy: any;
    schedule: any[];
    totalTax: number;
    notes?: string[];
  };
}

/** Services RRQ/CPP/SV/SRG (contrats d'analyse) */
export interface IGovernmentBenefitService {
  analyzeRRQ(input: any): any;
  analyzeCPP?(input: any): any;
  analyzeOAS?(input: any): any;
  analyzeGIS?(input: any): any; // SRG
}

/** Contrat de calcul retraite global */
export interface IRetirementCalculationService {
  calculateAll(userData: RetirementUserData): RetirementCalculationResult;
}

/** Génération de rapports (niveau consultant) */
export interface IProfessionalReportService {
  generateSummaryPDF(data: any): Promise<Blob>;
  generatePlannerPDF?(data: any): Promise<Blob>;
  generateNotaryPDF?(data: any): Promise<Blob>;
}

/** Façade du domaine retraite (agrège les sous-domaines via interfaces) */
export interface IRetirementDomain {
  taxEngine: ITaxEngine;
  taxPolicy: ITaxPolicy;
  projection: IProjectionEngine;
  robustness: IRobustnessService;
  optimizer: ITaxOptimizationService;
  benefits: IGovernmentBenefitService;
  calculator: IRetirementCalculationService;
  reports: IProfessionalReportService;
}

/**
 * Exemple d'adaptateur (esquisse) — non implémenté ici:
 * export function createRetirementDomain(adapters: {...}): IRetirementDomain;
 * L'impl permettrait de brancher les services existants (TaxEngine, ProjectionEngine, etc.)
 * sans changer la couche UI. À faire dans une itération ultérieure.
 */
