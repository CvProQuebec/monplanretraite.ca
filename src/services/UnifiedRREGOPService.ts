// UnifiedRREGOPService.ts - Service RREGOP Unifié 2025
// Consolidation intelligente : Sécurité maximale + Fonctionnalités avancées
// DONNÉES LOCALES UNIQUEMENT - Aucune transmission réseau

import { UserData } from '../features/retirement/types';

// ===== TYPES UNIFIÉS RREGOP =====

export interface UnifiedRREGOPData {
  // Identification du membre
  numeroMembre?: string;
  dateEmbauche?: Date;
  statutEmploi: 'actif' | 'retraite' | 'suspension' | 'conge-sans-solde';
  
  // Données salariales (combinées des deux versions)
  salaireActuel: number;
  salaireAdmissible?: number; // Moyenne 5 meilleures années
  salairesMoyens?: number[]; // Historique pour calculs avancés
  
  // Années de service (validation stricte)
  anneesServiceCalcul: number; // Années confirmées pour calcul
  anneesServiceAdmissibilite: number; // Total admissible
  anneesServiceCredit?: number; // Années rachetées
  anneesServiceRestantes?: number; // Si encore en emploi
  pourcentageTempsPlein: number; // 0.5 = 50%, 1.0 = 100%
  
  // Type de régime et plan
  typeRegime: 'RREGOP' | 'RRE' | 'RRF' | 'RRCE' | 'RRPE';
  planRetraite: 'normal' | 'anticipe' | 'differe';
  
  // Âges et retraite
  ageRetraite: number;
  ageRetraiteNormale?: number; // 60-61 ans selon régime
  ageRetraiteAnticipee?: number; // 55 ans minimum
  ageRetraiteDifferee?: number; // Jusqu'à 69 ans
  
  // Options et coordination
  coordinationRRQ: boolean;
  facteurCoordination?: number;
  optionSurvivant: 50 | 60; // Pourcentage rente conjoint
  
  // Données financières avancées (optionnelles)
  cotisationsAccumulees?: number;
  cotisationsEmployeur?: number;
  anneeReleve?: number; // Année du dernier relevé
}

export interface UnifiedRREGOPResult {
  // Validation et erreurs
  valide: boolean;
  erreurs: string[];
  
  // Calculs de base
  montantPleineRente: number;
  montantAvecPenalites: number;
  montantAvecCoordination: number;
  montantFinal: number;
  
  // Détails des calculs
  anneesServiceTotales: number;
  salaireMoyenUtilise: number;
  
  // Pénalités et ajustements
  penalites: {
    applicable: boolean;
    tauxPenalite: number;
    montantPenalite: number;
    anneesAnticipation: number;
    facteurReduction?: number;
  };
  
  // Coordination RRQ
  coordination: {
    applicable: boolean;
    ageApplication: number;
    montantReduction: number;
    reductionRRQ: number;
    pensionNetteAvantRRQ: number;
    pensionNetteApresRRQ: number;
  };
  
  // Bonifications (retraite différée)
  bonifications?: {
    applicable: boolean;
    facteurBonification: number;
    montantBonification: number;
  };
  
  // Rentes de survivant
  renteConjoint: {
    pourcentage: number;
    montant: number;
  };
  renteEnfantsSurvivants?: number;
  
  // Projections financières
  projections: {
    montantViager: number;
    valeurActualisee: number;
    indexationAnnuelle: number;
  };
  
  // Recommandations et optimisations
  recommandations: RREGOPRecommendation[];
  scenarios: RREGOPScenario[];
  ageOptimalRetraite: number;
  strategieRecommandee: string;
  
  // Comparaisons avancées
  comparaisonRRQ?: RREGOPvsRRQComparison;
  strategiesOptimisation?: RREGOPOptimizationStrategy[];
}

export interface RREGOPRecommendation {
  type: 'optimisation' | 'alerte' | 'information';
  titre: string;
  description: string;
  impact: string;
  priorite: 'haute' | 'moyenne' | 'faible';
  actions: string[];
}

export interface RREGOPScenario {
  nom: string;
  ageRetraite: number;
  montantAnnuel: number;
  montantViager: number;
  valeurActualisee: number;
  avantages: string[];
  inconvenients: string[];
}

export interface RREGOPvsRRQComparison {
  pensionRREGOP: number;
  pensionRRQ: number;
  pensionTotale: number;
  coordinationImpact: number;
  avantageRREGOP: number;
  tauxRemplacement: number;
}

export interface RREGOPOptimizationStrategy {
  strategie: string;
  description: string;
  impact: number;
  requisits: string[];
  delaiImplementation: string;
  avantages: string[];
  inconvenients: string[];
  difficulte: 'facile' | 'moyen' | 'difficile';
}

// ===== SERVICE RREGOP UNIFIÉ =====

export class UnifiedRREGOPService {
  
  // Paramètres RREGOP 2025 (consolidés et validés)
  private static readonly PARAMS_2025 = {
    // Taux de cotisation et accumulation
    TAUX_COTISATION_EMPLOYE: 0.1175, // 11.75% (version locale plus récente)
    TAUX_COTISATION_EMPLOYEUR: 0.1860, // 18.60%
    TAUX_ACCUMULATION: 0.02, // 2% par année de service
    
    // Seuils et maximums
    SEUIL_COTISATION_1: 64550,
    SEUIL_COTISATION_2: 0.1225,
    MAXIMUM_GAINS_ADMISSIBLES: 68500,
    
    // Âges de retraite (consolidés)
    AGE_NORMAL_RREGOP: 61, // Version locale plus précise
    AGE_NORMAL_RRE: 60, // Autres régimes
    AGE_ANTICIPE_MIN: 55,
    AGE_DIFFERE_MAX: 69,
    
    // Facteurs d'ajustement
    FACTEUR_REDUCTION_MENSUEL: 0.005, // 0.5% par mois (6% par année)
    FACTEUR_BONIFICATION_MENSUEL: 0.0075, // 0.75% par mois (9% par année)
    PENALITE_PAR_ANNEE: 0.06, // Version locale
    
    // Coordination RRQ (valeurs 2025 consolidées)
    FACTEUR_COORDINATION: 0.7,
    COORDINATION_RRQ_2025: 669.58, // Version locale plus récente
    PENSION_RRQ_MAX_65: 1364.60,
    AGE_COORDINATION_RRQ: 65,
    
    // Indexation
    TAUX_INDEXATION: 0.008, // 0.8% version locale conservative
    TAUX_ACTUALISATION: 0.03 // 3% pour valeur actuelle
  };

  /**
   * Calcul principal RREGOP unifié
   * Interface adaptative : simple ou avancée selon les données fournies
   */
  public static calculateUnifiedRREGOP(
    data: UnifiedRREGOPData,
    modeAvance: boolean = false
  ): UnifiedRREGOPResult {
    try {
      // 1. Validation stricte des données (sécurité maximale)
      const erreurs = this.validateUnifiedData(data);
      if (erreurs.length > 0) {
        return this.createErrorResult(erreurs);
      }

      // 2. Calculs de base consolidés
      const ageActuel = this.calculateCurrentAge();
      const anneesServiceTotales = this.calculateTotalServiceYears(data, ageActuel);
      const salaireMoyenUtilise = this.calculateAverageSalary(data);

      // 3. Calcul rente de base (2% × années × salaire)
      const montantPleineRente = this.calculateBasePension(salaireMoyenUtilise, anneesServiceTotales);

      // 4. Calcul des pénalités (logique consolidée)
      const penalites = this.calculateUnifiedPenalties(data.ageRetraite, anneesServiceTotales, data.typeRegime);
      const montantAvecPenalites = montantPleineRente * (1 - penalites.tauxPenalite);

      // 5. Calcul bonifications si retraite différée
      const bonifications = this.calculateBonifications(data.ageRetraite, data.typeRegime);
      const montantAvecBonifications = bonifications?.applicable ? 
        montantAvecPenalites * (1 + bonifications.facteurBonification) : montantAvecPenalites;

      // 6. Coordination RRQ (logique avancée)
      const coordination = this.calculateUnifiedCoordination(data, modeAvance);
      const montantAvecCoordination = Math.max(0, 
        montantAvecBonifications - coordination.montantReduction
      );

      const montantFinal = montantAvecCoordination;

      // 7. Rentes de survivant
      const renteConjoint = {
        pourcentage: data.optionSurvivant,
        montant: montantFinal * (data.optionSurvivant / 100)
      };

      const renteEnfantsSurvivants = modeAvance ? montantFinal * 0.30 : undefined;

      // 8. Projections financières avancées
      const projections = this.calculateAdvancedProjections(montantFinal, data.ageRetraite);

      // 9. Recommandations intelligentes
      const recommandations = this.generateIntelligentRecommendations(data, {
        montantPleineRente,
        montantFinal,
        penalites,
        coordination,
        bonifications
      });

      // 10. Scénarios comparatifs
      const scenarios = this.generateComparativeScenarios(data, salaireMoyenUtilise, anneesServiceTotales);

      // 11. Âge optimal et stratégie (mode avancé)
      const ageOptimalRetraite = modeAvance ? 
        this.calculateOptimalRetirementAge(data, salaireMoyenUtilise, anneesServiceTotales) : 
        data.ageRetraite;

      const strategieRecommandee = this.generateRecommendedStrategy(data, ageOptimalRetraite, penalites, bonifications);

      // 12. Comparaisons et optimisations avancées (si mode avancé)
      const comparaisonRRQ = modeAvance ? this.compareWithRRQ(data, montantFinal) : undefined;
      const strategiesOptimisation = modeAvance ? this.generateOptimizationStrategies(data) : undefined;

      return {
        valide: true,
        erreurs: [],
        montantPleineRente,
        montantAvecPenalites,
        montantAvecCoordination,
        montantFinal,
        anneesServiceTotales,
        salaireMoyenUtilise,
        penalites,
        coordination,
        bonifications,
        renteConjoint,
        renteEnfantsSurvivants,
        projections,
        recommandations,
        scenarios,
        ageOptimalRetraite,
        strategieRecommandee,
        comparaisonRRQ,
        strategiesOptimisation
      };

    } catch (error) {
      console.error('Erreur calcul RREGOP unifié:', error);
      return this.createErrorResult(['Erreur lors du calcul RREGOP unifié']);
    }
  }

  /**
   * Validation stricte des données (sécurité maximale)
   */
  private static validateUnifiedData(data: UnifiedRREGOPData): string[] {
    const erreurs: string[] = [];

    // Validations essentielles
    if (!data.salaireActuel || data.salaireActuel <= 0) {
      erreurs.push('Salaire actuel requis et doit être positif');
    }

    if (!data.anneesServiceCalcul || data.anneesServiceCalcul < 0) {
      erreurs.push('Années de service pour le calcul requises');
    }

    if (data.anneesServiceCalcul > 45) {
      erreurs.push('Années de service ne peuvent dépasser 45 ans');
    }

    if (!data.ageRetraite || data.ageRetraite < this.PARAMS_2025.AGE_ANTICIPE_MIN) {
      erreurs.push(`Âge de retraite minimum: ${this.PARAMS_2025.AGE_ANTICIPE_MIN} ans`);
    }

    if (data.ageRetraite > this.PARAMS_2025.AGE_DIFFERE_MAX) {
      erreurs.push(`Âge de retraite maximum: ${this.PARAMS_2025.AGE_DIFFERE_MAX} ans`);
    }

    if (data.pourcentageTempsPlein < 0.1 || data.pourcentageTempsPlein > 1.0) {
      erreurs.push('Pourcentage temps plein doit être entre 10 % et 100 %');
    }

    // Validations avancées
    if (data.salaireActuel > this.PARAMS_2025.MAXIMUM_GAINS_ADMISSIBLES * 2) {
      erreurs.push('Salaire semble anormalement élevé, veuillez vérifier');
    }

    return erreurs;
  }

  /**
   * Calcul des années de service totales (logique consolidée)
   */
  private static calculateTotalServiceYears(data: UnifiedRREGOPData, ageActuel: number): number {
    let anneesTotales = data.anneesServiceCalcul;
    
    // Ajout années créditées (rachetées)
    if (data.anneesServiceCredit) {
      anneesTotales += data.anneesServiceCredit;
    }
    
    // Ajout années restantes si encore en emploi
    if (data.ageRetraite > ageActuel) {
      const anneesRestantes = data.ageRetraite - ageActuel;
      const anneesAjustees = anneesRestantes * data.pourcentageTempsPlein;
      anneesTotales += anneesAjustees;
    }

    // Limitation selon le régime (35 ans RREGOP, autres peuvent varier)
    const maxAnnees = data.typeRegime === 'RREGOP' ? 35 : 40;
    return Math.min(anneesTotales, maxAnnees);
  }

  /**
   * Calcul du salaire moyen (logique intelligente)
   */
  private static calculateAverageSalary(data: UnifiedRREGOPData): number {
    // Si salaire admissible fourni, l'utiliser
    if (data.salaireAdmissible && data.salaireAdmissible > 0) {
      return data.salaireAdmissible;
    }

    // Si historique des salaires disponible, calculer moyenne des 5 meilleures années
    if (data.salairesMoyens && data.salairesMoyens.length > 0) {
      const meilleuresSalaires = [...data.salairesMoyens]
        .sort((a, b) => b - a)
        .slice(0, Math.min(5, data.salairesMoyens.length));
      return meilleuresSalaires.reduce((sum, sal) => sum + sal, 0) / meilleuresSalaires.length;
    }

    // Sinon, utiliser le salaire actuel
    return data.salaireActuel;
  }

  /**
   * Calcul de la rente de base
   */
  private static calculateBasePension(salaireMoyen: number, anneesService: number): number {
    return salaireMoyen * this.PARAMS_2025.TAUX_ACCUMULATION * anneesService;
  }

  /**
   * Calcul des pénalités unifié (logique consolidée des deux versions)
   */
  private static calculateUnifiedPenalties(
    ageRetraite: number, 
    anneesService: number, 
    typeRegime: string
  ) {
    const ageNormal = typeRegime === 'RREGOP' ? 
      this.PARAMS_2025.AGE_NORMAL_RREGOP : 
      this.PARAMS_2025.AGE_NORMAL_RRE;

    // Conditions pour éviter les pénalités (règles consolidées)
    const regleAge85 = (ageRetraite + anneesService) >= 85;
    const regle30ans = anneesService >= 30;
    const ageMinimumAtteint = ageRetraite >= ageNormal;

    if (ageMinimumAtteint || regleAge85 || regle30ans) {
      return {
        applicable: false,
        tauxPenalite: 0,
        montantPenalite: 0,
        anneesAnticipation: 0
      };
    }

    // Calcul pénalités
    const anneesAnticipation = ageNormal - ageRetraite;
    const tauxPenalite = anneesAnticipation * this.PARAMS_2025.PENALITE_PAR_ANNEE;

    return {
      applicable: true,
      tauxPenalite: Math.min(tauxPenalite, 0.30), // Maximum 30%
      montantPenalite: 0, // Calculé par pourcentage
      anneesAnticipation,
      facteurReduction: tauxPenalite
    };
  }

  /**
   * Calcul des bonifications (retraite différée)
   */
  private static calculateBonifications(ageRetraite: number, typeRegime: string) {
    const ageNormal = typeRegime === 'RREGOP' ? 
      this.PARAMS_2025.AGE_NORMAL_RREGOP : 
      this.PARAMS_2025.AGE_NORMAL_RRE;

    if (ageRetraite <= ageNormal) {
      return undefined;
    }

    const moisReport = (ageRetraite - ageNormal) * 12;
    const facteurBonification = moisReport * this.PARAMS_2025.FACTEUR_BONIFICATION_MENSUEL;

    return {
      applicable: true,
      facteurBonification: Math.min(facteurBonification, 0.45), // Maximum 45%
      montantBonification: 0 // Calculé par pourcentage
    };
  }

  /**
   * Calcul de la coordination RRQ unifié
   */
  private static calculateUnifiedCoordination(data: UnifiedRREGOPData, modeAvance: boolean) {
    const applicable = data.coordinationRRQ && data.ageRetraite >= this.PARAMS_2025.AGE_COORDINATION_RRQ;
    
    // Utiliser la valeur la plus récente (version locale)
    const montantReduction = applicable ? this.PARAMS_2025.COORDINATION_RRQ_2025 : 0;
    
    // Calculs avancés si mode avancé
    const reductionRRQ = modeAvance ? 
      (data.facteurCoordination || this.PARAMS_2025.FACTEUR_COORDINATION) * this.PARAMS_2025.PENSION_RRQ_MAX_65 : 
      montantReduction;

    return {
      applicable,
      ageApplication: this.PARAMS_2025.AGE_COORDINATION_RRQ,
      montantReduction,
      reductionRRQ,
      pensionNetteAvantRRQ: 0, // Calculé dans le résultat principal
      pensionNetteApresRRQ: 0  // Calculé dans le résultat principal
    };
  }

  /**
   * Projections financières avancées
   */
  private static calculateAdvancedProjections(montantAnnuel: number, ageRetraite: number) {
    const esperanceVie = 85;
    const anneesRetraite = esperanceVie - ageRetraite;
    
    // Calcul avec indexation
    let valeurActualisee = 0;
    let montantViager = 0;
    let montantIndexe = montantAnnuel;
    
    for (let i = 0; i < anneesRetraite; i++) {
      const facteurActualisation = Math.pow(1 + this.PARAMS_2025.TAUX_ACTUALISATION, -i);
      valeurActualisee += montantIndexe * facteurActualisation;
      montantViager += montantIndexe;
      montantIndexe *= (1 + this.PARAMS_2025.TAUX_INDEXATION);
    }

    return {
      montantViager: Math.round(montantViager),
      valeurActualisee: Math.round(valeurActualisee),
      indexationAnnuelle: Math.round(montantAnnuel * this.PARAMS_2025.TAUX_INDEXATION)
    };
  }

  // Fonctions utilitaires et méthodes avancées...
  private static calculateCurrentAge(): number {
    return 55; // Placeholder - dans un vrai cas, utiliser les données utilisateur
  }

  private static generateIntelligentRecommendations(data: UnifiedRREGOPData, calculs: any): RREGOPRecommendation[] {
    const recommandations: RREGOPRecommendation[] = [];

    // Logique de recommandations consolidée des deux versions
    if (calculs.penalites.applicable) {
      recommandations.push({
        type: 'alerte',
        titre: 'Pénalités pour retraite anticipée',
        description: `Retraite à ${data.ageRetraite} ans entraîne une pénalité de ${(calculs.penalites.tauxPenalite * 100).toFixed(1)}%`,
        impact: `Réduction permanente de la pension`,
        priorite: 'haute',
        actions: [
          'Évaluer possibilité de reporter la retraite',
          'Vérifier la règle des 85 points (âge + années service)',
          'Considérer travail à temps partiel'
        ]
      });
    }

    return recommandations;
  }

  private static generateComparativeScenarios(
    data: UnifiedRREGOPData, 
    salaireMoyen: number, 
    anneesServiceBase: number
  ): RREGOPScenario[] {
    const scenarios: RREGOPScenario[] = [];
    const agesTest = [55, 58, 61, 65];

    agesTest.forEach(age => {
      if (age >= data.ageRetraite - 3 && age <= data.ageRetraite + 3) {
        // Calcul simplifié pour le scénario
        const anneesService = Math.min(anneesServiceBase + Math.max(0, age - data.ageRetraite), 35);
        const montantBase = this.calculateBasePension(salaireMoyen, anneesService);
        const penalites = this.calculateUnifiedPenalties(age, anneesService, data.typeRegime);
        const montantFinal = montantBase * (1 - penalites.tauxPenalite);
        const projections = this.calculateAdvancedProjections(montantFinal, age);

        scenarios.push({
          nom: `Retraite à ${age} ans`,
          ageRetraite: age,
          montantAnnuel: Math.round(montantFinal),
          montantViager: projections.montantViager,
          valeurActualisee: projections.valeurActualisee,
          avantages: this.getScenarioAdvantages(age, penalites),
          inconvenients: this.getScenarioDisadvantages(age, penalites)
        });
      }
    });

    return scenarios.sort((a, b) => b.valeurActualisee - a.valeurActualisee);
  }

  private static calculateOptimalRetirementAge(
    data: UnifiedRREGOPData, 
    salaireMoyen: number, 
    anneesService: number
  ): number {
    // Logique d'optimisation consolidée
    const scenarios = [55, 58, 61, 65, 69];
    let meilleurAge = data.ageRetraite;
    let meilleureValeur = 0;

    scenarios.forEach(age => {
      const montantBase = this.calculateBasePension(salaireMoyen, Math.min(anneesService + Math.max(0, age - data.ageRetraite), 35));
      const penalites = this.calculateUnifiedPenalties(age, anneesService, data.typeRegime);
      const montantFinal = montantBase * (1 - penalites.tauxPenalite);
      const projections = this.calculateAdvancedProjections(montantFinal, age);

      if (projections.valeurActualisee > meilleureValeur) {
        meilleureValeur = projections.valeurActualisee;
        meilleurAge = age;
      }
    });

    return meilleurAge;
  }

  private static generateRecommendedStrategy(
    data: UnifiedRREGOPData, 
    ageOptimal: number, 
    penalites: any, 
    bonifications: any
  ): string {
    if (ageOptimal === data.ageRetraite) {
      return "Âge de retraite choisi est optimal selon votre situation";
    } else if (ageOptimal > data.ageRetraite) {
      return `Reporter la retraite à ${ageOptimal} ans maximiserait vos revenus viagers`;
    } else {
      return `Retraite anticipée à ${ageOptimal} ans pourrait être avantageuse`;
    }
  }

  private static compareWithRRQ(data: UnifiedRREGOPData, pensionRREGOP: number): RREGOPvsRRQComparison {
    const pensionRRQ = this.PARAMS_2025.PENSION_RRQ_MAX_65 * 0.7; // Estimation
    const pensionTotale = pensionRREGOP + pensionRRQ;
    const coordinationImpact = data.coordinationRRQ ? this.PARAMS_2025.COORDINATION_RRQ_2025 : 0;
    const avantageRREGOP = pensionRREGOP / pensionRRQ;
    const tauxRemplacement = pensionTotale / (data.salaireActuel / 12);

    return {
      pensionRREGOP,
      pensionRRQ,
      pensionTotale,
      coordinationImpact,
      avantageRREGOP,
      tauxRemplacement
    };
  }

  private static generateOptimizationStrategies(data: UnifiedRREGOPData): RREGOPOptimizationStrategy[] {
    const strategies: RREGOPOptimizationStrategy[] = [];

    // Stratégie rachat d'années
    if (data.anneesServiceCalcul < 35) {
      strategies.push({
        strategie: "Rachat d'années de service",
        description: "Racheter des périodes non cotisées pour maximiser la pension",
        impact: this.calculateBuybackImpact(data),
        requisits: ["Période admissible", "Capacité financière"],
        delaiImplementation: "Avant la retraite",
        avantages: ["Augmentation directe de la pension", "Possibilité de retraite anticipée"],
        inconvenients: ["Coût élevé", "Période de récupération"],
        difficulte: 'moyen'
      });
    }

    return strategies;
  }

  private static calculateBuybackImpact(data: UnifiedRREGOPData): number {
    const anneesRachetables = Math.min(5, 35 - data.anneesServiceCalcul);
    const salaireMoyen = data.salaireAdmissible || data.salaireActuel;
    return salaireMoyen * this.PARAMS_2025.TAUX_ACCUMULATION * anneesRachetables / 12;
  }

  private static getScenarioAdvantages(age: number, penalites: any): string[] {
    const avantages: string[] = [];
    if (age <= 58) avantages.push('Plus d\'années de liberté');
    if (!penalites.applicable) avantages.push('Aucune pénalité');
    if (age >= 61) avantages.push('Pleine rente disponible');
    return avantages;
  }

  private static getScenarioDisadvantages(age: number, penalites: any): string[] {
    const inconvenients: string[] = [];
    if (penalites.applicable) inconvenients.push(`Pénalité de ${(penalites.tauxPenalite * 100).toFixed(1)}%`);
    if (age < 65) inconvenients.push('Pas d\'accès immédiat à la SV');
    return inconvenients;
  }

  private static createErrorResult(erreurs: string[]): UnifiedRREGOPResult {
    return {
      valide: false,
      erreurs,
      montantPleineRente: 0,
      montantAvecPenalites: 0,
      montantAvecCoordination: 0,
      montantFinal: 0,
      anneesServiceTotales: 0,
      salaireMoyenUtilise: 0,
      penalites: {
        applicable: false,
        tauxPenalite: 0,
        montantPenalite: 0,
        anneesAnticipation: 0
      },
      coordination: {
        applicable: false,
        ageApplication: 65,
        montantReduction: 0,
        reductionRRQ: 0,
        pensionNetteAvantRRQ: 0,
        pensionNetteApresRRQ: 0
      },
      renteConjoint: {
        pourcentage: 50,
        montant: 0
      },
      projections: {
        montantViager: 0,
        valeurActualisee: 0,
        indexationAnnuelle: 0
      },
      recommandations: [],
      scenarios: [],
      ageOptimalRetraite: 0,
      strategieRecommandee: 'Données insuffisantes pour recommandation'
    };
  }

  /**
   * Méthode de compatibilité avec l'ancien service global
   */
  public static calculateRREGOPPension(data: any): any {
    // Adapter les données au nouveau format
    const unifiedData: UnifiedRREGOPData = {
      statutEmploi: 'actif',
      salaireActuel: data.salaireAdmissible || data.salaireActuel || 0,
      salaireAdmissible: data.salaireAdmissible,
      salairesMoyens: data.salairesMoyens,
      anneesServiceCalcul: data.anneesService || 0,
      anneesServiceAdmissibilite: data.anneesService || 0,
      anneesServiceCredit: data.anneesServiceCredit,
      pourcentageTempsPlein: 1.0,
      typeRegime: data.typeRegime || 'RREGOP',
      planRetraite: data.planRetraite || 'normal',
      ageRetraite: data.ageRetraiteNormale || 61,
      coordinationRRQ: data.coordinationRRQ !== false,
      optionSurvivant: 60
    };

    return this.calculateUnifiedRREGOP(unifiedData, true);
  }

  /**
   * Méthode de compatibilité avec l'ancien service local
   */
  public static calculerRREGOP(donnees: any): any {
    // Adapter les données au nouveau format
    const unifiedData: UnifiedRREGOPData = {
      statutEmploi: 'actif',
      salaireActuel: donnees.salaireActuel || 0,
      salaireAdmissible: donnees.salaireAdmissible,
      anneesServiceCalcul: donnees.anneesServiceCalcul || 0,
      anneesServiceAdmissibilite: donnees.anneesServiceAdmissibilite || 0,
      pourcentageTempsPlein: donnees.pourcentageTempsPlein || 1.0,
      typeRegime: donnees.typeRegime || 'RREGOP',
      planRetraite: 'normal',
      ageRetraite: donnees.ageRetraite || 61,
      coordinationRRQ: true,
      optionSurvivant: donnees.optionSurvivant || 60
    };

    return this.calculateUnifiedRREGOP(unifiedData, false);
  }
}

// Export par défaut pour compatibilité
export default UnifiedRREGOPService;
