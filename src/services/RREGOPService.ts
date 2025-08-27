// src/features/retirement/services/RREGOPService.ts
import { UserData } from '../types';

// ===== TYPES SPÉCIFIQUES RREGOP =====

export interface RREGOPData {
  // Identification du membre
  numeroMembre: string;
  dateEmbauche: Date;
  statutEmploi: 'actif' | 'retraite' | 'suspension' | 'conge-sans-solde';
  
  // Données salariales
  salaireAdmissible: number; // Salaire admissible actuel
  salairesMoyens: number[]; // Historique des 5 meilleures années
  anneesService: number;
  anneesServiceCredit: number; // Années rachetées
  
  // Type de régime
  typeRegime: 'RREGOP' | 'RRE' | 'RRF' | 'RRCE';
  planRetraite: 'normal' | 'anticipe' | 'differe';
  
  // Coordination RRQ
  coordinationRRQ: boolean;
  facteurCoordination: number;
  
  // Cotisations
  cotisationsAccumulees: number;
  cotisationsEmployeur: number;
  
  // Options de retraite
  ageRetraiteNormale: number; // 60 ans généralement
  ageRetraiteAnticipee?: number; // 55 ans avec pénalités
  ageRetraiteDifferee?: number; // Jusqu'à 69 ans avec bonification
}

export interface RREGOPCalculationResult {
  // Pension de base
  pensionAnnuelleBase: number;
  pensionMensuelleBase: number;
  
  // Coordination avec RRQ
  reductionRRQ: number;
  pensionNetteAvantRRQ: number; // Avant 65 ans
  pensionNetteApresRRQ: number; // Après 65 ans
  
  // Ajustements selon l'âge
  facteurReduction?: number; // Si retraite anticipée
  facteurBonification?: number; // Si retraite différée
  pensionAjustee: number;
  
  // Rentes de survivant
  renteConjointSurvivre: number;
  renteEnfantsSurvivants: number;
  
  // Projections
  projectionViagere: number;
  valeurActualisee: number;
  
  // Recommandations
  ageOptimalRetraite: number;
  strategieRecommandee: string;
  
  // Comparaisons
  comparaisonRRQ: RREGOPvsRRQComparison;
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
}

// ===== SERVICE RREGOP =====

export class RREGOPService {
  
  // Paramètres RREGOP 2025
  private static readonly PARAMS_2025 = {
    // Taux de cotisation
    TAUX_COTISATION_EMPLOYE: 0.1015, // 10.15% (sous 64 550$) + 12.25% (au-dessus)
    TAUX_COTISATION_EMPLOYEUR: 0.1860, // 18.60%
    
    // Seuils 2025
    SEUIL_COTISATION_1: 64550, // Premier seuil de cotisation
    SEUIL_COTISATION_2: 0.1225, // Taux au-dessus du seuil
    
    // Maximum des gains admissibles
    MAXIMUM_GAINS_ADMISSIBLES: 68500, // Même que RRQ en 2025
    
    // Facteur de rente (2% par année de service)
    FACTEUR_RENTE: 0.02,
    
    // Âges de retraite
    AGE_NORMAL: 60, // Sans pénalité
    AGE_ANTICIPE_MIN: 55, // Avec pénalités
    AGE_DIFFERE_MAX: 69, // Avec bonifications
    
    // Facteurs d'ajustement
    FACTEUR_REDUCTION_MENSUEL: 0.005, // 0.5% par mois d'anticipation (6% par année)
    FACTEUR_BONIFICATION_MENSUEL: 0.0075, // 0.75% par mois de report (9% par année)
    
    // Coordination RRQ
    FACTEUR_COORDINATION: 0.7, // 70% de la pension RRQ maximale
    PENSION_RRQ_MAX_65: 1364.60, // RRQ maximale à 65 ans en 2025
    
    // Indexation
    TAUX_INDEXATION: 0.025 // 2.5% annuel
  };

  /**
   * Calcule la pension RREGOP complète avec coordination RRQ
   */
  static calculateRREGOPPension(data: RREGOPData): RREGOPCalculationResult {
    try {
      // 1. Calcul de la pension de base (2% × années service × salaire moyen 5 meilleures années)
      const salaireMoyen5 = this.calculateSalaireMoyen5(data.salairesMoyens);
      const pensionAnnuelleBase = salaireMoyen5 * this.PARAMS_2025.FACTEUR_RENTE * data.anneesService;
      const pensionMensuelleBase = pensionAnnuelleBase / 12;
      
      // 2. Coordination avec RRQ (réduction)
      const reductionRRQ = this.calculateCoordinationRRQ(data);
      
      // 3. Pension nette selon l'âge
      const pensionNetteAvantRRQ = pensionMensuelleBase - reductionRRQ;
      const pensionNetteApresRRQ = pensionMensuelleBase; // Plus de coordination après 65 ans
      
      // 4. Ajustements selon l'âge de retraite
      const ageRetraite = this.determineAgeRetraite(data);
      const { facteurAjustement, pensionAjustee } = this.calculateAgeAdjustments(
        pensionNetteAvantRRQ, 
        ageRetraite
      );
      
      // 5. Prestations aux survivants
      const { renteConjoint, renteEnfants } = this.calculateSurvivorBenefits(pensionAjustee);
      
      // 6. Projections et valeur actualisée
      const projectionViagere = this.calculateLifetimeProjection(pensionAjustee, ageRetraite);
      const valeurActualisee = this.calculatePresentValue(projectionViagere, ageRetraite);
      
      // 7. Recommandations d'optimisation
      const ageOptimal = this.calculateOptimalRetirementAge(data);
      const strategie = this.generateRecommendedStrategy(data, ageOptimal);
      
      // 8. Comparaison avec RRQ
      const comparaisonRRQ = this.compareWithRRQ(data, pensionAjustee);
      
      return {
        pensionAnnuelleBase,
        pensionMensuelleBase,
        reductionRRQ,
        pensionNetteAvantRRQ,
        pensionNetteApresRRQ,
        facteurReduction: ageRetraite < this.PARAMS_2025.AGE_NORMAL ? Math.abs(facteurAjustement) : undefined,
        facteurBonification: ageRetraite > this.PARAMS_2025.AGE_NORMAL ? facteurAjustement : undefined,
        pensionAjustee,
        renteConjointSurvivre: renteConjoint,
        renteEnfantsSurvivants: renteEnfants,
        projectionViagere,
        valeurActualisee,
        ageOptimalRetraite: ageOptimal,
        strategieRecommandee: strategie,
        comparaisonRRQ
      };
      
    } catch (error) {
      console.error('Erreur calcul RREGOP:', error);
      throw new Error('Impossible de calculer la pension RREGOP');
    }
  }

  /**
   * Calcule le salaire moyen des 5 meilleures années
   */
  private static calculateSalaireMoyen5(salaires: number[]): number {
    if (!salaires || salaires.length === 0) return 0;
    
    // Trier en ordre décroissant et prendre les 5 meilleures années
    const meilleuresSalaires = [...salaires]
      .sort((a, b) => b - a)
      .slice(0, Math.min(5, salaires.length));
      
    return meilleuresSalaires.reduce((sum, sal) => sum + sal, 0) / meilleuresSalaires.length;
  }

  /**
   * Calcule la réduction due à la coordination RRQ
   */
  private static calculateCoordinationRRQ(data: RREGOPData): number {
    if (!data.coordinationRRQ) return 0;
    
    // Réduction = 0.7% × facteur coordination × pension RRQ maximale
    return this.PARAMS_2025.FACTEUR_COORDINATION * this.PARAMS_2025.PENSION_RRQ_MAX_65;
  }

  /**
   * Détermine l'âge de retraite optimal
   */
  private static determineAgeRetraite(data: RREGOPData): number {
    if (data.planRetraite === 'anticipe') {
      return Math.max(data.ageRetraiteAnticipee || this.PARAMS_2025.AGE_ANTICIPE_MIN, this.PARAMS_2025.AGE_ANTICIPE_MIN);
    }
    if (data.planRetraite === 'differe') {
      return Math.min(data.ageRetraiteDifferee || this.PARAMS_2025.AGE_DIFFERE_MAX, this.PARAMS_2025.AGE_DIFFERE_MAX);
    }
    return data.ageRetraiteNormale || this.PARAMS_2025.AGE_NORMAL;
  }

  /**
   * Calcule les ajustements selon l'âge de retraite
   */
  private static calculateAgeAdjustments(pensionBase: number, ageRetraite: number): {
    facteurAjustement: number;
    pensionAjustee: number;
  } {
    const ageNormal = this.PARAMS_2025.AGE_NORMAL;
    
    if (ageRetraite < ageNormal) {
      // Retraite anticipée - Pénalité
      const moisAnticipation = (ageNormal - ageRetraite) * 12;
      const facteurReduction = moisAnticipation * this.PARAMS_2025.FACTEUR_REDUCTION_MENSUEL;
      const facteurAjustement = -facteurReduction;
      const pensionAjustee = pensionBase * (1 - facteurReduction);
      
      return { facteurAjustement, pensionAjustee };
      
    } else if (ageRetraite > ageNormal) {
      // Retraite différée - Bonification
      const moisReport = (ageRetraite - ageNormal) * 12;
      const facteurBonification = moisReport * this.PARAMS_2025.FACTEUR_BONIFICATION_MENSUEL;
      const facteurAjustement = facteurBonification;
      const pensionAjustee = pensionBase * (1 + facteurBonification);
      
      return { facteurAjustement, pensionAjustee };
      
    } else {
      // Retraite normale - Aucun ajustement
      return { facteurAjustement: 0, pensionAjustee: pensionBase };
    }
  }

  /**
   * Calcule les prestations aux survivants
   */
  private static calculateSurvivorBenefits(pensionBase: number): {
    renteConjoint: number;
    renteEnfants: number;
  } {
    // Rente de conjoint survivant: 60% de la pension du membre
    const renteConjoint = pensionBase * 0.60;
    
    // Rente d'orphelin: 30% par enfant (maximum 2 enfants)
    const renteEnfants = pensionBase * 0.30;
    
    return { renteConjoint, renteEnfants };
  }

  /**
   * Calcule la projection viagère
   */
  private static calculateLifetimeProjection(pensionMensuelle: number, ageRetraite: number): number {
    const esperanceVie = 85; // Moyenne québécoise
    const anneesRetraite = esperanceVie - ageRetraite;
    const moisRetraite = anneesRetraite * 12;
    
    // Pension indexée à 2.5% annuel
    let totalPension = 0;
    let pensionCourante = pensionMensuelle;
    
    for (let mois = 0; mois < moisRetraite; mois++) {
      totalPension += pensionCourante;
      
      // Indexation annuelle
      if (mois % 12 === 0 && mois > 0) {
        pensionCourante *= (1 + this.PARAMS_2025.TAUX_INDEXATION);
      }
    }
    
    return totalPension;
  }

  /**
   * Calcule la valeur actualisée
   */
  private static calculatePresentValue(totalPension: number, ageRetraite: number): number {
    const tauxActualisation = 0.03; // 3% d'actualisation
    const anneesJusquRetraite = Math.max(0, ageRetraite - 55); // Âge actuel moyen
    
    return totalPension / Math.pow(1 + tauxActualisation, anneesJusquRetraite);
  }

  /**
   * Calcule l'âge optimal de retraite
   */
  private static calculateOptimalRetirementAge(data: RREGOPData): number {
    // Analyse coûts-bénéfices pour déterminer l'âge optimal
    const scenarios = [55, 60, 65, 69];
    let meilleurAge = this.PARAMS_2025.AGE_NORMAL;
    let meilleureValeur = 0;
    
    scenarios.forEach(age => {
      const { pensionAjustee } = this.calculateAgeAdjustments(
        data.salaireAdmissible * this.PARAMS_2025.FACTEUR_RENTE * data.anneesService / 12,
        age
      );
      
      const projectionViagere = this.calculateLifetimeProjection(pensionAjustee, age);
      const valeurActualisee = this.calculatePresentValue(projectionViagere, age);
      
      if (valeurActualisee > meilleureValeur) {
        meilleureValeur = valeurActualisee;
        meilleurAge = age;
      }
    });
    
    return meilleurAge;
  }

  /**
   * Génère une stratégie recommandée
   */
  private static generateRecommendedStrategy(data: RREGOPData, ageOptimal: number): string {
    if (ageOptimal === this.PARAMS_2025.AGE_NORMAL) {
      return "Retraite normale à 60 ans recommandée - Équilibre optimal entre pension et durée de perception";
    } else if (ageOptimal < this.PARAMS_2025.AGE_NORMAL) {
      return "Retraite anticipée avantageuse malgré les pénalités - Situation financière permet l'anticipation";
    } else {
      return "Report de retraite avantageux - Bonifications compensent largement la période d'attente";
    }
  }

  /**
   * Compare avec le RRQ
   */
  private static compareWithRRQ(data: RREGOPData, pensionRREGOP: number): RREGOPvsRRQComparison {
    // Estimation pension RRQ (sera remplacée par le calcul RRQ réel)
    const pensionRRQ = this.PARAMS_2025.PENSION_RRQ_MAX_65 * 0.7; // Estimation 70% du maximum
    
    const pensionTotale = pensionRREGOP + pensionRRQ;
    const coordinationImpact = this.calculateCoordinationRRQ(data);
    const avantageRREGOP = pensionRREGOP / pensionRRQ;
    const tauxRemplacement = pensionTotale / (data.salaireAdmissible / 12);
    
    return {
      pensionRREGOP,
      pensionRRQ,
      pensionTotale,
      coordinationImpact,
      avantageRREGOP,
      tauxRemplacement
    };
  }

  /**
   * Génère des stratégies d'optimisation RREGOP
   */
  static generateOptimizationStrategies(data: RREGOPData): RREGOPOptimizationStrategy[] {
    const strategies: RREGOPOptimizationStrategy[] = [];
    
    // Stratégie 1: Rachat d'années de service
    if (data.anneesService < 35) {
      strategies.push({
        strategie: "Rachat d'années de service",
        description: "Racheter des périodes non cotisées pour maximiser la pension",
        impact: this.calculateBuybackImpact(data),
        requisits: ["Période admissible au rachat", "Capacité financière"],
        delaiImplementation: "Avant la retraite",
        avantages: ["Augmentation directe de la pension", "Retraite anticipée possible"],
        inconvenients: ["Coût élevé du rachat", "Période de récupération longue"]
      });
    }
    
    // Stratégie 2: Optimisation de l'âge de retraite
    strategies.push({
      strategie: "Optimisation de l'âge de retraite",
      description: "Choisir l'âge optimal selon votre situation financière",
      impact: this.calculateAgeOptimizationImpact(data),
      requisits: ["Analyse détaillée des besoins", "Flexibilité d'emploi"],
      delaiImplementation: "Planification 5 ans avant",
      avantages: ["Maximisation des revenus viagers", "Flexibilité personnelle"],
      inconvenients: ["Incertitude sur l'espérance de vie", "Contraintes d'emploi"]
    });
    
    // Stratégie 3: Coordination avec REER/CELI
    strategies.push({
      strategie: "Coordination épargne privée",
      description: "Optimiser REER/CELI en fonction de la pension RREGOP",
      impact: this.calculatePrivateSavingsCoordinationImpact(data),
      requisits: ["Capacité d'épargne", "Horizon de placement"],
      delaiImplementation: "Dès maintenant",
      avantages: ["Diversification des revenus", "Optimisation fiscale"],
      inconvenients: ["Gestion plus complexe", "Risques de placement"]
    });
    
    return strategies;
  }

  /**
   * Calcule l'impact du rachat d'années
   */
  private static calculateBuybackImpact(data: RREGOPData): number {
    const anneesRachetables = Math.min(5, 35 - data.anneesService);
    const salaireMoyen = this.calculateSalaireMoyen5(data.salairesMoyens);
    const augmentationPension = salaireMoyen * this.PARAMS_2025.FACTEUR_RENTE * anneesRachetables / 12;
    
    return augmentationPension;
  }

  /**
   * Calcule l'impact de l'optimisation d'âge
   */
  private static calculateAgeOptimizationImpact(data: RREGOPData): number {
    const pensionNormale = this.calculateRREGOPPension(data).pensionAjustee;
    const pensionOptimale = this.calculateRREGOPPension({
      ...data,
      planRetraite: 'normal'
    }).pensionAjustee;
    
    return pensionOptimale - pensionNormale;
  }

  /**
   * Calcule l'impact de la coordination épargne privée
   */
  private static calculatePrivateSavingsCoordinationImpact(data: RREGOPData): number {
    // Impact estimé de l'optimisation fiscale
    return data.salaireAdmissible * 0.15; // 15% d'optimisation fiscale estimée
  }

  /**
   * Intègre RREGOP avec les autres services (RRQ, SV, etc.)
   */
  static integrateWithOtherPensions(
    rregopData: RREGOPData, 
    userData: UserData
  ): {
    pensionTotale: number;
    tauxRemplacement: number;
    lacunes: number;
    recommandations: string[];
  } {
    const rregopResult = this.calculateRREGOPPension(rregopData);
    
    // Estimation des autres pensions (à remplacer par les calculs réels)
    const pensionRRQ = this.PARAMS_2025.PENSION_RRQ_MAX_65 * 0.7;
    const pensionSV = 717.15; // SV maximale 2025
    const pensionSRG = 0; // Probablement pas admissible avec RREGOP
    
    const pensionTotale = rregopResult.pensionAjustee + pensionRRQ + pensionSV;
    const revenuActuel = userData.personal.salaire1 || 0;
    const tauxRemplacement = (pensionTotale * 12) / revenuActuel;
    
    const objectifRemplacement = 0.70; // 70% du revenu
    const lacunes = Math.max(0, (revenuActuel * objectifRemplacement) - (pensionTotale * 12));
    
    const recommandations: string[] = [];
    
    if (tauxRemplacement < 0.60) {
      recommandations.push("Augmenter l'épargne retraite privée (REER/CELI)");
    }
    
    if (tauxRemplacement < 0.70) {
      recommandations.push("Considérer une retraite progressive pour maintenir revenus");
    }
    
    if (lacunes > 0) {
      recommandations.push(`Épargne additionnelle requise: ${Math.round(lacunes).toLocaleString()}$ par année`);
    }
    
    return {
      pensionTotale: pensionTotale * 12, // Annuel
      tauxRemplacement,
      lacunes,
      recommandations
    };
  }

  /**
   * Valide les données RREGOP
   */
  static validateRREGOPData(data: Partial<RREGOPData>): { 
    isValid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];
    
    if (!data.numeroMembre) {
      errors.push("Numéro de membre RREGOP requis");
    }
    
    if (!data.dateEmbauche) {
      errors.push("Date d'embauche requise");
    }
    
    if (!data.salaireAdmissible || data.salaireAdmissible <= 0) {
      errors.push("Salaire admissible requis et doit être positif");
    }
    
    if (!data.anneesService || data.anneesService < 0) {
      errors.push("Années de service requises");
    }
    
    if (data.anneesService && data.anneesService > 45) {
      errors.push("Années de service ne peuvent dépasser 45 ans");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}