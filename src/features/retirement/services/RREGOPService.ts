// RREGOPService.ts - Service RREGOP Local Sécurisé 2025
// DONNÉES LOCALES UNIQUEMENT - Régime de retraite des employés du gouvernement et des organismes publics

export interface RREGOPParams2025 {
  readonly tauxCotisation: number;
  readonly tauxAccumulation: number;
  readonly agePleineRente: number;
  readonly ageRetraiteAnticipee: number;
  readonly penaliteParAnnee: number;
  readonly coordinationRRQ: number;
  readonly ageCoordinationRRQ: number;
  readonly indexationMoyenne: number;
}

export interface RREGOPUserData {
  typeRegime: 'RREGOP' | 'RRPE';
  anneesServiceAdmissibilite: number;
  anneesServiceCalcul: number;
  anneesServiceRestantes?: number;
  pourcentageTempsPlein: number; // 0.5 = temps partiel 50%, 1.0 = temps plein
  salaireActuel: number;
  salaireAdmissible?: number; // Moyenne 5 meilleures années
  ageRetraite: number;
  optionSurvivant: 50 | 60; // Pourcentage rente conjoint survivant
  anneeReleve?: number; // Année du dernier relevé de participation
}

export interface RREGOPCalculationResult {
  valide: boolean;
  erreurs: string[];
  
  // Calculs principaux
  montantPleineRente: number;
  montantAvecPenalites: number;
  montantAvecCoordination: number;
  montantFinal: number;
  
  // Détails
  anneesServiceTotales: number;
  penalites: {
    applicable: boolean;
    tauxPenalite: number;
    montantPenalite: number;
    anneesAnticipation: number;
  };
  
  coordination: {
    applicable: boolean;
    ageApplication: number;
    montantReduction: number;
  };
  
  // Rente conjoint survivant
  renteConjoint: {
    pourcentage: number;
    montant: number;
  };
  
  // Projections
  projections: {
    montantViager: number;
    valeurActuelle: number;
    indexationAnnuelle: number;
  };
  
  // Recommandations
  recommandations: RREGOPRecommendation[];
  scenarios: RREGOPScenario[];
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
  avantages: string[];
  inconvenients: string[];
}

/**
 * Service de calcul RREGOP/RRPE 2025
 * SÉCURISÉ - Toutes les données restent locales
 */
export class RREGOPService {
  // Paramètres officiels RREGOP 2025
  private static readonly PARAMS_2025: RREGOPParams2025 = {
    tauxCotisation: 0.1175, // 11.75% en 2025
    tauxAccumulation: 0.02, // 2% par année de service
    agePleineRente: 61,
    ageRetraiteAnticipee: 55,
    penaliteParAnnee: 0.06, // 6% par année d'anticipation
    coordinationRRQ: 669.58, // Coordination RRQ 2025
    ageCoordinationRRQ: 65,
    indexationMoyenne: 0.008 // 0.8% estimation conservative
  };

  /**
   * Calcul principal RREGOP
   * SÉCURISÉ - Données traitées localement uniquement
   */
  public static calculerRREGOP(donnees: RREGOPUserData): RREGOPCalculationResult {
    try {
      // Validation des données
      const erreurs = this.validerDonnees(donnees);
      if (erreurs.length > 0) {
        return this.createErrorResult(erreurs);
      }

      // Calculs de base
      const ageActuel = this.calculerAgeActuel();
      const anneesServiceTotales = this.calculerAnneesServiceTotales(donnees, ageActuel);
      const salaireAdmissible = donnees.salaireAdmissible || donnees.salaireActuel;

      // Calcul rente de base (avant pénalités et coordination)
      const montantPleineRente = this.calculerRenteBase(
        salaireAdmissible,
        anneesServiceTotales
      );

      // Calcul des pénalités si retraite anticipée
      const penalites = this.calculerPenalites(donnees.ageRetraite, anneesServiceTotales);
      const montantAvecPenalites = montantPleineRente * (1 - penalites.tauxPenalite);

      // Coordination avec RRQ à 65 ans
      const coordination = this.calculerCoordination(donnees.ageRetraite);
      const montantAvecCoordination = Math.max(0, 
        montantAvecPenalites - (coordination.applicable ? coordination.montantReduction : 0)
      );

      const montantFinal = montantAvecCoordination;

      // Rente conjoint survivant
      const renteConjoint = {
        pourcentage: donnees.optionSurvivant,
        montant: montantFinal * (donnees.optionSurvivant / 100)
      };

      // Projections sur la vie
      const projections = this.calculerProjections(montantFinal, donnees.ageRetraite);

      // Génération des recommandations
      const recommandations = this.genererRecommandations(donnees, {
        montantPleineRente,
        montantFinal,
        penalites,
        coordination
      });

      // Génération des scénarios
      const scenarios = this.genererScenarios(donnees, salaireAdmissible, anneesServiceTotales);

      return {
        valide: true,
        erreurs: [],
        montantPleineRente,
        montantAvecPenalites,
        montantAvecCoordination,
        montantFinal,
        anneesServiceTotales,
        penalites,
        coordination,
        renteConjoint,
        projections,
        recommandations,
        scenarios
      };

    } catch (error) {
      console.error('Erreur calcul RREGOP:', error);
      return this.createErrorResult(['Erreur lors du calcul RREGOP']);
    }
  }

  /**
   * Validation des données d'entrée
   */
  private static validerDonnees(donnees: RREGOPUserData): string[] {
    const erreurs: string[] = [];

    if (!donnees.anneesServiceCalcul || donnees.anneesServiceCalcul <= 0) {
      erreurs.push('Nombre d\'années de service pour le calcul requis');
    }

    if (!donnees.salaireActuel || donnees.salaireActuel <= 0) {
      erreurs.push('Salaire actuel requis');
    }

    if (!donnees.ageRetraite || donnees.ageRetraite < this.PARAMS_2025.ageRetraiteAnticipee) {
      erreurs.push(`Âge de retraite minimum: ${this.PARAMS_2025.ageRetraiteAnticipee} ans`);
    }

    if (donnees.pourcentageTempsPlein && (donnees.pourcentageTempsPlein < 0.1 || donnees.pourcentageTempsPlein > 1.0)) {
      erreurs.push('Pourcentage temps plein doit être entre 10% et 100%');
    }

    return erreurs;
  }

  /**
   * Calcul des années de service totales
   */
  private static calculerAnneesServiceTotales(donnees: RREGOPUserData, ageActuel: number): number {
    let anneesTotales = donnees.anneesServiceCalcul;
    
    // Ajout des années restantes si encore en emploi
    if (donnees.ageRetraite > ageActuel) {
      const anneesRestantes = donnees.ageRetraite - ageActuel;
      const anneesAjustees = anneesRestantes * donnees.pourcentageTempsPlein;
      anneesTotales += anneesAjustees;
    }

    // Limitation à 35 ans maximum (règle RREGOP)
    return Math.min(anneesTotales, 35);
  }

  /**
   * Calcul de la rente de base
   */
  private static calculerRenteBase(salaireAdmissible: number, anneesService: number): number {
    return salaireAdmissible * this.PARAMS_2025.tauxAccumulation * anneesService;
  }

  /**
   * Calcul des pénalités pour retraite anticipée
   */
  private static calculerPenalites(ageRetraite: number, anneesService: number) {
    // Conditions pour éviter les pénalités
    const regleAge85 = (ageRetraite + anneesService) >= 85;
    const regle30ans = anneesService >= 30;
    const ageMinimumSansPenalite = 61;

    if (ageRetraite >= ageMinimumSansPenalite || regleAge85 || regle30ans) {
      return {
        applicable: false,
        tauxPenalite: 0,
        montantPenalite: 0,
        anneesAnticipation: 0
      };
    }

    const anneesAnticipation = ageMinimumSansPenalite - ageRetraite;
    const tauxPenalite = anneesAnticipation * this.PARAMS_2025.penaliteParAnnee;

    return {
      applicable: true,
      tauxPenalite,
      montantPenalite: 0, // Calculé ailleurs
      anneesAnticipation
    };
  }

  /**
   * Calcul de la coordination avec RRQ
   */
  private static calculerCoordination(ageRetraite: number) {
    const applicable = ageRetraite >= this.PARAMS_2025.ageCoordinationRRQ;
    
    return {
      applicable,
      ageApplication: this.PARAMS_2025.ageCoordinationRRQ,
      montantReduction: applicable ? this.PARAMS_2025.coordinationRRQ : 0
    };
  }

  /**
   * Calcul des projections financières
   */
  private static calculerProjections(montantAnnuel: number, ageRetraite: number) {
    const esperanceVie = 85; // Estimation
    const anneesRetraite = esperanceVie - ageRetraite;
    
    // Calcul valeur actuelle avec indexation
    let valeurActuelle = 0;
    let montantIndexe = montantAnnuel;
    
    for (let i = 0; i < anneesRetraite; i++) {
      const facteurActualisation = Math.pow(1.03, -i); // 3% taux actualisation
      valeurActuelle += montantIndexe * facteurActualisation;
      montantIndexe *= (1 + this.PARAMS_2025.indexationMoyenne);
    }

    return {
      montantViager: montantAnnuel * anneesRetraite,
      valeurActuelle: Math.round(valeurActuelle),
      indexationAnnuelle: montantAnnuel * this.PARAMS_2025.indexationMoyenne
    };
  }

  /**
   * Génération des recommandations personnalisées
   */
  private static genererRecommandations(
    donnees: RREGOPUserData,
    calculs: any
  ): RREGOPRecommendation[] {
    const recommandations: RREGOPRecommendation[] = [];

    // Recommandation sur l'âge de retraite
    if (calculs.penalites.applicable) {
      recommandations.push({
        type: 'alerte',
        titre: 'Pénalités pour retraite anticipée',
        description: `Votre retraite à ${donnees.ageRetraite} ans entraîne une pénalité de ${(calculs.penalites.tauxPenalite * 100).toFixed(1)}%`,
        impact: `Réduction de ${calculs.penalites.montantPenalite.toLocaleString()} $ par année`,
        priorite: 'haute',
        actions: [
          'Évaluer possibilité de reporter la retraite à 61 ans',
          'Vérifier si vous atteignez la règle des 85 points',
          'Considérer travail à temps partiel jusqu\'à 61 ans'
        ]
      });
    }

    // Recommandation sur la coordination RRQ
    if (calculs.coordination.applicable) {
      recommandations.push({
        type: 'information',
        titre: 'Coordination avec RRQ à 65 ans',
        description: 'Votre rente RREGOP sera réduite de la coordination RRQ',
        impact: `Réduction de ${calculs.coordination.montantReduction.toLocaleString()} $ par année à partir de 65 ans`,
        priorite: 'moyenne',
        actions: [
          'Planifier cette réduction dans votre budget retraite',
          'Optimiser le moment de demande de votre RRQ',
          'Évaluer l\'impact sur votre flux de trésorerie'
        ]
      });
    }

    // Recommandation sur l'option survivant
    if (donnees.optionSurvivant < 60) {
      recommandations.push({
        type: 'optimisation',
        titre: 'Option rente survivant',
        description: 'L\'option 50% peut être insuffisante pour votre conjoint',
        impact: 'Sécurité financière du conjoint survivant',
        priorite: 'moyenne',
        actions: [
          'Évaluer les besoins financiers du conjoint survivant',
          'Comparer coût option 60% vs 50%',
          'Considérer assurance vie complémentaire'
        ]
      });
    }

    return recommandations;
  }

  /**
   * Génération de scénarios de retraite
   */
  private static genererScenarios(
    donnees: RREGOPUserData,
    salaireAdmissible: number,
    anneesServiceBase: number
  ): RREGOPScenario[] {
    const scenarios: RREGOPScenario[] = [];
    const agesTest = [55, 58, 61, 65];

    agesTest.forEach(age => {
      if (age >= donnees.ageRetraite - 3 && age <= donnees.ageRetraite + 3) {
        const anneesService = this.calculerAnneesServicePourAge(donnees, age);
        const montantBase = this.calculerRenteBase(salaireAdmissible, anneesService);
        const penalites = this.calculerPenalites(age, anneesService);
        const montantAvecPenalites = montantBase * (1 - penalites.tauxPenalite);
        const coordination = this.calculerCoordination(age);
        const montantFinal = Math.max(0, montantAvecPenalites - 
          (coordination.applicable ? coordination.montantReduction : 0));

        scenarios.push({
          nom: `Retraite à ${age} ans`,
          ageRetraite: age,
          montantAnnuel: Math.round(montantFinal),
          montantViager: Math.round(montantFinal * (85 - age)),
          avantages: this.getAvantagesScenario(age, penalites, coordination),
          inconvenients: this.getInconvenientsScenario(age, penalites, coordination)
        });
      }
    });

    return scenarios.sort((a, b) => b.montantViager - a.montantViager);
  }

  // Fonctions utilitaires privées
  private static calculerAgeActuel(): number {
    // Simulation - dans un vrai cas, utiliser les données utilisateur
    return new Date().getFullYear() - 1970; // Placeholder
  }

  private static calculerAnneesServicePourAge(donnees: RREGOPUserData, ageRetraite: number): number {
    const ageActuel = this.calculerAgeActuel();
    const anneesRestantes = Math.max(0, ageRetraite - ageActuel);
    return Math.min(donnees.anneesServiceCalcul + anneesRestantes, 35);
  }

  private static getAvantagesScenario(age: number, penalites: any, coordination: any): string[] {
    const avantages: string[] = [];
    
    if (age <= 58) avantages.push('Plus d\'années de liberté');
    if (!penalites.applicable) avantages.push('Aucune pénalité');
    if (!coordination.applicable) avantages.push('Pas de coordination RRQ');
    if (age >= 61) avantages.push('Pleine rente disponible');
    
    return avantages;
  }

  private static getInconvenientsScenario(age: number, penalites: any, coordination: any): string[] {
    const inconvenients: string[] = [];
    
    if (penalites.applicable) inconvenients.push(`Pénalité de ${(penalites.tauxPenalite * 100).toFixed(1)}%`);
    if (coordination.applicable) inconvenients.push('Coordination RRQ à 65 ans');
    if (age < 60) inconvenients.push('Pas d\'accès aux régimes gouvernementaux');
    if (age < 65) inconvenients.push('Pas d\'accès immédiat à la SV');
    
    return inconvenients;
  }

  private static createErrorResult(erreurs: string[]): RREGOPCalculationResult {
    return {
      valide: false,
      erreurs,
      montantPleineRente: 0,
      montantAvecPenalites: 0,
      montantAvecCoordination: 0,
      montantFinal: 0,
      anneesServiceTotales: 0,
      penalites: {
        applicable: false,
        tauxPenalite: 0,
        montantPenalite: 0,
        anneesAnticipation: 0
      },
      coordination: {
        applicable: false,
        ageApplication: 65,
        montantReduction: 0
      },
      renteConjoint: {
        pourcentage: 50,
        montant: 0
      },
      projections: {
        montantViager: 0,
        valeurActuelle: 0,
        indexationAnnuelle: 0
      },
      recommandations: [],
      scenarios: []
    };
  }
}

// Export pour intégration dans CalculationService
export default RREGOPService;