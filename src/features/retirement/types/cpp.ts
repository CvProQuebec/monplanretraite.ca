// src/features/retirement/types/cpp.ts

export interface CPPData {
  // Informations personnelles
  personal: {
    dateNaissance: Date;
    dateRetraite: Date;
    gainsAnnuels: number[];
    anneesCotisation: number;
    paysResidence: 'CA' | 'QC' | 'OTHER';
    statutConjugal: 'single' | 'married' | 'common-law' | 'divorced' | 'widowed';
    conjointDateNaissance?: Date;
    conjointGainsAnnuels?: number[];
  };
  
  // Paramètres de calcul
  parameters: {
    ageRetraiteStandard: number;
    ageRetraiteMin: number;
    ageRetraiteMax: number;
    facteurReduction: number;
    facteurAugmentation: number;
    montantMaximum2025: number;
    montantMoyen2024: number;
  };
  
  // Calculs CPP
  calculations: {
    pensionBase: number;
    pensionAjustee: number;
    montantMensuel: number;
    montantAnnuel: number;
    reductionRetraiteAnticipee: number;
    augmentationRetraiteReportee: number;
    pensionConjointe?: number;
    pensionSurvivant?: number;
  };
  
  // Historique des cotisations
  contributions: {
    annees: number[];
    montants: number[];
    gains: number[];
    totalCotisations: number;
  };
  
  // Métadonnées
  metadata: {
    dateCalcul: Date;
    version: string;
    source: 'CPP_OFFICIAL' | 'USER_INPUT' | 'ESTIMATED';
  };
}

export interface CPPCalculationResult {
  pensionBase: number;
  pensionAjustee: number;
  montantMensuel: number;
  montantAnnuel: number;
  details: {
    anneesCotisation: number;
    gainsMoyens: number;
    facteurAjustement: number;
    reductionAnticipee: number;
    augmentationReportee: number;
  };
  projections: {
    age65: number;
    age60: number;
    age70: number;
    age75: number;
  };
}

export interface CPPParameters {
  // Paramètres officiels 2025
  montantMaximum2025: number; // 1,433.00 $/mois
  montantMoyen2024: number;   // 899.67 $/mois
  
  // Âges et facteurs
  ageRetraiteStandard: number; // 65 ans
  ageRetraiteMin: number;      // 60 ans
  ageRetraiteMax: number;      // 70 ans
  
  // Facteurs d'ajustement
  facteurReduction: number;    // -0.6% par mois avant 65 ans
  facteurAugmentation: number; // +0.7% par mois après 65 ans
  
  // Limites de gains
  gainsMaximum2025: number;    // 66,600 $/an
  gainsExemptes: number;       // 3,500 $/an
}

export interface CPPContributionYear {
  annee: number;
  gains: number;
  cotisations: number;
  gainsCotisables: number;
  facteurCotisation: number;
}

export interface CPPProjection {
  age: number;
  pension: number;
  montantMensuel: number;
  montantAnnuel: number;
  facteurAjustement: number;
  type: 'standard' | 'early' | 'delayed';
}

export interface CPPComparisonData {
  cpp: CPPCalculationResult;
  rrq?: any; // Sera défini plus tard
  combine: {
    totalMensuel: number;
    totalAnnuel: number;
    pourcentageCPP: number;
    pourcentageRRQ: number;
  };
}
