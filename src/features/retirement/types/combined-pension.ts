export interface CombinedPensionData {
  cpp: CPPData;
  rrq: RRQData;
  personalSavings: PersonalSavingsData;
  retirementAge: number;
  lifeExpectancy: number;
  inflationRate: number;
  investmentReturn: number;
}

export interface RRQData {
  // Données RRQ existantes - à adapter selon votre structure actuelle
  dateNaissance: Date;
  dateRetraite: Date;
  gainsAnnuels: number[];
  anneesContribution: number;
  pensionBase: number;
  pensionAjustee: number;
}

export interface PersonalSavingsData {
  montantInitial: number;
  contributionMensuelle: number;
  typeCompte: 'REER' | 'CELI' | 'Autre';
  tauxRendement: number;
}

export interface CombinedCalculationResult {
  cpp: CPPCalculationResult;
  rrq: RRQCalculationResult;
  personalSavings: PersonalSavingsResult;
  totalMonthlyIncome: number;
  totalAnnualIncome: number;
  replacementRate: number;
  sustainabilityScore: number;
  recommendations: string[];
}

export interface RRQCalculationResult {
  pensionMensuelle: number;
  pensionAnnuelle: number;
  facteurAjustement: number;
  pensionAjustee: number;
}

export interface PersonalSavingsResult {
  montantRetraite: number;
  revenuMensuel: number;
  revenuAnnuel: number;
  dureeSoutien: number;
}

export interface RetirementScenario {
  id: string;
  nom: string;
  description: string;
  parametres: {
    ageRetraite: number;
    tauxInflation: number;
    rendementInvestissement: number;
    contributionSupplementaire: number;
  };
  resultats: CombinedCalculationResult;
  probabiliteReussite: number;
  niveauRisque: 'Faible' | 'Modéré' | 'Élevé';
}

export interface MonteCarloSimulation {
  iterations: number;
  scenarios: RetirementScenario[];
  statistiques: {
    revenuMoyen: number;
    revenuMedian: number;
    ecartType: number;
    probabiliteReussite: number;
    percentiles: {
      p10: number;
      p25: number;
      p50: number;
      p75: number;
      p90: number;
    };
  };
}

export interface TaxOptimizationData {
  revenuImposable: number;
  creditsFiscaux: number;
  tauxImpositionEffectif: number;
  strategies: TaxStrategy[];
}

export interface TaxStrategy {
  nom: string;
  description: string;
  impactAnnuel: number;
  impactCumulatif: number;
  difficulte: 'Facile' | 'Modérée' | 'Complexe';
  recommandation: boolean;
}

export interface SurvivorBenefits {
  cpp: {
    montantMensuel: number;
    conditions: string[];
    duree: number;
  };
  rrq: {
    montantMensuel: number;
    conditions: string[];
    duree: number;
  };
  total: number;
  impactFiscal: number;
}
