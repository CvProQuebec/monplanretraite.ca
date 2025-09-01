// ===== SERVICE CCQ - COMMISSION DE LA CONSTRUCTION DU QUÉBEC =====
// Service principal pour les calculs du régime de retraite CCQ

import { 
  CCQData, 
  CCQCalculationResult, 
  CCQGeneralAccountResult, 
  CCQComplementaryAccountResult,
  CCQEligibilityResult,
  CCQEligibilityCheck,
  CCQRenteCalculation,
  CCQOptimizationSuggestion,
  CCQProjectionScenario,
  CCQValidationResult,
  CCQ_PARAMS_2025,
  CCQRetirementType,
  CCQRenteOption
} from '../types/ccq';

export class CCQService {
  
  /**
   * Calcule la pension CCQ complète avec les deux comptes
   */
  static calculateCCQPension(data: CCQData): CCQCalculationResult {
    try {
      console.log('🏗️ Début calcul pension CCQ:', data);
      
      // 1. Validation des données
      const validation = this.validateCCQData(data);
      if (!validation.isValid) {
        throw new Error(`Données CCQ invalides: ${validation.errors.join(', ')}`);
      }
      
      // 2. Calcul du Compte Général (pré-2005)
      const compteGeneral = this.calculateGeneralAccount(data);
      
      // 3. Calcul du Compte Complémentaire (post-2005)
      const compteComplementaire = this.calculateComplementaryAccount(data);
      
      // 4. Totaux
      const renteAnnuelleTotale = compteGeneral.renteAnnuelle + compteComplementaire.renteAnnuelle;
      const renteMensuelleTotale = renteAnnuelleTotale / 12;
      
      // 5. Réductions pour retraite anticipée
      const { facteurReduction, montantReduction } = this.calculateEarlyRetirementReduction(
        data.ageRetraiteSouhaite, 
        renteMensuelleTotale
      );
      
      // 6. Options de rente
      const renteNivelee = this.calculateRenteNivelee(renteMensuelleTotale, facteurReduction);
      const renteMajoreeReduite = this.calculateRenteMajoreeReduite(renteMensuelleTotale, facteurReduction);
      
      // 7. Vérification d'admissibilité
      const admissibilite = this.checkEligibility(data);
      
      // 8. Projections viagères
      const projectionViagere = this.calculateLifetimeProjection(
        renteMensuelleTotale, 
        data.ageRetraiteSouhaite,
        'M' // Sexe par défaut, sera ajouté aux données CCQ si nécessaire
      );
      const valeurActualisee = this.calculatePresentValue(projectionViagere, data.ageRetraiteSouhaite);
      
      // 9. Coordination avec régimes publics
      const coordinationRRQ = this.calculateRRQCoordination(data);
      const coordinationPSV = this.calculatePSVCoordination(data);
      const coordinationSRG = this.calculateSRGCoordination(data);
      
      // 10. Recommandations d'optimisation
      const ageOptimalRetraite = this.calculateOptimalRetirementAge(data);
      const strategieRecommandee = this.generateRecommendedStrategy(data, ageOptimalRetraite);
      const optimisationSuggestions = this.generateOptimizationSuggestions(data);
      
      const result: CCQCalculationResult = {
        compteGeneral,
        compteComplementaire,
        renteAnnuelleTotale,
        renteMensuelleTotale,
        facteurReduction,
        montantReduction,
        renteNivelee,
        renteMajoreeReduite,
        admissibilite,
        projectionViagere,
        valeurActualisee,
        coordinationRRQ,
        coordinationPSV,
        coordinationSRG,
        ageOptimalRetraite,
        strategieRecommandee,
        optimisationSuggestions
      };
      
      console.log('✅ Calcul CCQ terminé:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Erreur calcul CCQ:', error);
      throw new Error(`Impossible de calculer la pension CCQ: ${error.message}`);
    }
  }
  
  /**
   * Calcule le Compte Général (heures travaillées AVANT 2005)
   */
  private static calculateGeneralAccount(data: CCQData): CCQGeneralAccountResult {
    const heuresAjustees = data.heuresAjusteesAvant2005 || 0;
    const tauxRenteAnnuel = CCQ_PARAMS_2025.TAUX_RENTE_ANNUEL_2025;
    
    // Formule: Heures ajustées × Taux de rente annuel
    const renteAnnuelle = heuresAjustees * tauxRenteAnnuel;
    const renteMensuelle = renteAnnuelle / 12;
    
    return {
      heuresAjustees,
      tauxRenteAnnuel,
      renteAnnuelle,
      renteMensuelle,
      description: `Compte Général basé sur ${heuresAjustees.toLocaleString()} heures ajustées à ${tauxRenteAnnuel} $/heure`
    };
  }
  
  /**
   * Calcule le Compte Complémentaire (heures travaillées DEPUIS 2005)
   */
  private static calculateComplementaryAccount(data: CCQData): CCQComplementaryAccountResult {
    const valeurAccumulee = data.valeurCompteComplementaire || 0;
    const ageRetraite = data.ageRetraiteSouhaite || CCQ_PARAMS_2025.AGE_RETRAITE_NORMALE;
    
    // Facteur actuariel selon l'âge
    const facteurActuariel = CCQ_PARAMS_2025.FACTEURS_ACTUARIELS[ageRetraite] || 
                            CCQ_PARAMS_2025.FACTEURS_ACTUARIELS[65];
    
    // Formule: Valeur accumulée × Facteur actuariel
    const renteAnnuelle = valeurAccumulee * facteurActuariel;
    const renteMensuelle = renteAnnuelle / 12;
    
    return {
      valeurAccumulee,
      facteurActuariel,
      renteAnnuelle,
      renteMensuelle,
      description: `Compte Complémentaire: ${valeurAccumulee.toLocaleString()} $ × facteur ${facteurActuariel}`
    };
  }
  
  /**
   * Calcule les réductions pour retraite anticipée
   */
  private static calculateEarlyRetirementReduction(ageRetraite: number, renteMensuelle: number): {
    facteurReduction?: number;
    montantReduction?: number;
  } {
    if (ageRetraite >= CCQ_PARAMS_2025.AGE_RETRAITE_NORMALE) {
      return {}; // Pas de réduction
    }
    
    const anneesAnticipation = CCQ_PARAMS_2025.AGE_RETRAITE_NORMALE - ageRetraite;
    const facteurReduction = anneesAnticipation * CCQ_PARAMS_2025.REDUCTION_ANNUELLE;
    const montantReduction = renteMensuelle * facteurReduction;
    
    return { facteurReduction, montantReduction };
  }
  
  /**
   * Calcule l'option rente nivelée
   */
  private static calculateRenteNivelee(renteMensuelle: number, facteurReduction?: number): CCQRenteCalculation {
    const montantAjuste = facteurReduction ? 
      renteMensuelle * (1 - facteurReduction) : 
      renteMensuelle;
    
    return {
      type: 'nivelee',
      montantAvant65: montantAjuste,
      montantApres65: montantAjuste,
      avantages: [
        'Montant constant tout au long de la retraite',
        'Simplicité de planification budgétaire',
        'Aucune surprise à 65 ans'
      ],
      inconvenients: [
        'Montant plus faible avant 65 ans',
        'Ne profite pas des prestations RRQ/PSV'
      ],
      valeurViagere: this.calculateLifetimeValue(montantAjuste, 65),
      recommande: false // Sera déterminé par l'analyse comparative
    };
  }
  
  /**
   * Calcule l'option rente majorée-réduite
   */
  private static calculateRenteMajoreeReduite(renteMensuelle: number, facteurReduction?: number): CCQRenteCalculation {
    const renteBase = facteurReduction ? 
      renteMensuelle * (1 - facteurReduction) : 
      renteMensuelle;
    
    // Majoration avant 65 ans (compensation pour RRQ/PSV)
    const montantAvant65 = renteBase * 1.3; // 30% de plus
    const montantApres65 = renteBase * 0.7;  // 30% de moins
    
    return {
      type: 'majoree-reduite',
      montantAvant65,
      montantApres65,
      avantages: [
        'Montant plus élevé avant 65 ans',
        'Compensation pour absence RRQ/PSV',
        'Meilleur flux de trésorerie initial'
      ],
      inconvenients: [
        'Réduction permanente après 65 ans',
        'Planification plus complexe',
        'Risque si RRQ/PSV changent'
      ],
      valeurViagere: this.calculateLifetimeValue(montantAvant65, 65, montantApres65),
      recommande: true // Généralement recommandée
    };
  }
  
  /**
   * Vérifie l'admissibilité selon les différents types de retraite
   */
  private static checkEligibility(data: CCQData): CCQEligibilityResult {
    const ageActuel = this.calculateCurrentAge(data.dateEntreeIndustrie);
    const dateNaissance = new Date(Date.now() - (ageActuel * 365.25 * 24 * 60 * 60 * 1000));
    
    // Retraite normale (65 ans)
    const retraiteNormale: CCQEligibilityCheck = {
      eligible: ageActuel >= CCQ_PARAMS_2025.AGE_RETRAITE_NORMALE,
      ageRequis: CCQ_PARAMS_2025.AGE_RETRAITE_NORMALE,
      dateAdmissibilite: new Date(dateNaissance.getTime() + (CCQ_PARAMS_2025.AGE_RETRAITE_NORMALE * 365.25 * 24 * 60 * 60 * 1000)),
      description: 'Retraite normale sans conditions particulières'
    };
    
    // Retraite anticipée sans réduction (55 ans avec conditions)
    const retraiteAnticipeeSansReduction: CCQEligibilityCheck = {
      eligible: ageActuel >= CCQ_PARAMS_2025.AGE_RETRAITE_ANTICIPEE_MIN && this.meetsEarlyRetirementConditions(data),
      ageRequis: CCQ_PARAMS_2025.AGE_RETRAITE_ANTICIPEE_MIN,
      conditionsSpeciales: ['Conditions d\'heures spécifiques selon l\'année d\'entrée'],
      dateAdmissibilite: new Date(dateNaissance.getTime() + (CCQ_PARAMS_2025.AGE_RETRAITE_ANTICIPEE_MIN * 365.25 * 24 * 60 * 60 * 1000)),
      description: 'Retraite anticipée sans pénalité si conditions remplies'
    };
    
    // Retraite anticipée avec réduction (55 ans)
    const retraiteAnticipeeAvecReduction: CCQEligibilityCheck = {
      eligible: ageActuel >= CCQ_PARAMS_2025.AGE_RETRAITE_ANTICIPEE_MIN,
      ageRequis: CCQ_PARAMS_2025.AGE_RETRAITE_ANTICIPEE_MIN,
      dateAdmissibilite: new Date(dateNaissance.getTime() + (CCQ_PARAMS_2025.AGE_RETRAITE_ANTICIPEE_MIN * 365.25 * 24 * 60 * 60 * 1000)),
      description: 'Retraite anticipée avec réduction de 3% par année d\'anticipation'
    };
    
    // Retraite pour invalidité (50 ans)
    const retraiteInvalidite: CCQEligibilityCheck = {
      eligible: ageActuel >= CCQ_PARAMS_2025.AGE_RETRAITE_INVALIDITE_MIN && 
                data.heuresTotales >= CCQ_PARAMS_2025.HEURES_INVALIDITE_MIN,
      ageRequis: CCQ_PARAMS_2025.AGE_RETRAITE_INVALIDITE_MIN,
      heuresRequises: CCQ_PARAMS_2025.HEURES_INVALIDITE_MIN,
      conditionsSpeciales: ['Invalidité totale reconnue', 'Payable à partir de la 53e semaine'],
      dateAdmissibilite: new Date(dateNaissance.getTime() + (CCQ_PARAMS_2025.AGE_RETRAITE_INVALIDITE_MIN * 365.25 * 24 * 60 * 60 * 1000)),
      description: 'Retraite pour invalidité avec conditions strictes'
    };
    
    // Retraite partielle (55 ans, depuis juillet 2014)
    const retraitePartielle: CCQEligibilityCheck = {
      eligible: ageActuel >= CCQ_PARAMS_2025.AGE_RETRAITE_ANTICIPEE_MIN && 
                data.dateEntreeIndustrie < new Date('2005-01-01'),
      ageRequis: CCQ_PARAMS_2025.AGE_RETRAITE_ANTICIPEE_MIN,
      conditionsSpeciales: ['Disponible depuis juillet 2014', 'Permet de continuer à travailler'],
      dateAdmissibilite: new Date(dateNaissance.getTime() + (CCQ_PARAMS_2025.AGE_RETRAITE_ANTICIPEE_MIN * 365.25 * 24 * 60 * 60 * 1000)),
      description: 'Retraite partielle tout en continuant à travailler'
    };
    
    // Déterminer le statut actuel
    let statutActuel = 'Non admissible actuellement';
    let prochaineMilestone = 'Retraite anticipée à 55 ans';
    
    if (retraiteNormale.eligible) {
      statutActuel = 'Admissible à la retraite normale';
      prochaineMilestone = 'Retraite obligatoire à 71 ans';
    } else if (retraiteAnticipeeSansReduction.eligible) {
      statutActuel = 'Admissible à la retraite anticipée sans réduction';
      prochaineMilestone = 'Retraite normale à 65 ans';
    } else if (retraiteAnticipeeAvecReduction.eligible) {
      statutActuel = 'Admissible à la retraite anticipée avec réduction';
      prochaineMilestone = 'Retraite normale à 65 ans';
    }
    
    return {
      retraiteNormale,
      retraiteAnticipeeSansReduction,
      retraiteAnticipeeAvecReduction,
      retraiteInvalidite,
      retraitePartielle,
      dateAdmissibiliteNormale: retraiteNormale.dateAdmissibilite!,
      dateAdmissibiliteAnticipee: retraiteAnticipeeSansReduction.dateAdmissibilite!,
      statutActuel,
      prochaineMilestone
    };
  }
  
  /**
   * Calcule l'âge optimal de retraite
   */
  private static calculateOptimalRetirementAge(data: CCQData): number {
    const scenarios = [55, 60, 65, 70];
    let meilleurAge = CCQ_PARAMS_2025.AGE_RETRAITE_NORMALE;
    let meilleureValeur = 0;
    
    scenarios.forEach(age => {
      const tempData = { ...data, ageRetraiteSouhaite: age };
      const result = this.calculateCCQPension(tempData);
      
      if (result.valeurActualisee > meilleureValeur) {
        meilleureValeur = result.valeurActualisee;
        meilleurAge = age;
      }
    });
    
    return meilleurAge;
  }
  
  /**
   * Génère une stratégie recommandée
   */
  private static generateRecommendedStrategy(data: CCQData, ageOptimal: number): string {
    if (ageOptimal === CCQ_PARAMS_2025.AGE_RETRAITE_NORMALE) {
      return "Retraite normale à 65 ans recommandée - Équilibre optimal entre pension et durée de perception";
    } else if (ageOptimal < CCQ_PARAMS_2025.AGE_RETRAITE_NORMALE) {
      return "Retraite anticipée avantageuse - Situation permet l'anticipation malgré les réductions";
    } else {
      return "Report de retraite avantageux - Accumulation supplémentaire compense l'attente";
    }
  }
  
  /**
   * Génère des suggestions d'optimisation
   */
  private static generateOptimizationSuggestions(data: CCQData): CCQOptimizationSuggestion[] {
    const suggestions: CCQOptimizationSuggestion[] = [];
    
    // Suggestion 1: Optimisation de l'âge de retraite
    suggestions.push({
      strategie: "Optimisation de l'âge de retraite",
      description: "Analyser l'impact de différents âges de retraite sur vos revenus totaux",
      impact: this.calculateAgeOptimizationImpact(data),
      requisits: ["Flexibilité d'emploi", "Analyse des besoins financiers"],
      delaiImplementation: "Planification 2-5 ans avant la retraite",
      avantages: ["Maximisation des revenus viagers", "Optimisation fiscale"],
      inconvenients: ["Incertitude sur l'espérance de vie", "Contraintes d'emploi"],
      priorite: 'haute'
    });
    
    // Suggestion 2: Choix de l'option de rente
    suggestions.push({
      strategie: "Optimisation de l'option de rente",
      description: "Choisir entre rente nivelée et majorée-réduite selon votre situation",
      impact: this.calculateRenteOptionImpact(data),
      requisits: ["Analyse des revenus RRQ/PSV", "Planification budgétaire"],
      delaiImplementation: "Au moment de la demande de retraite",
      avantages: ["Optimisation du flux de trésorerie", "Coordination avec régimes publics"],
      inconvenients: ["Complexité de planification", "Risques réglementaires"],
      priorite: 'haute'
    });
    
    // Suggestion 3: Coordination avec épargne privée
    suggestions.push({
      strategie: "Coordination avec REER/CELI",
      description: "Optimiser l'épargne privée en fonction de la pension CCQ",
      impact: this.calculatePrivateSavingsImpact(data),
      requisits: ["Capacité d'épargne", "Horizon de placement"],
      delaiImplementation: "Dès maintenant",
      avantages: ["Diversification des revenus", "Optimisation fiscale"],
      inconvenients: ["Gestion plus complexe", "Risques de placement"],
      priorite: 'moyenne'
    });
    
    return suggestions;
  }
  
  /**
   * Calcule la projection viagère
   */
  private static calculateLifetimeProjection(renteMensuelle: number, ageRetraite: number, sexe: string = 'M'): number {
    const esperanceVie = sexe === 'F' ? 
      CCQ_PARAMS_2025.ESPERANCE_VIE_FEMME : 
      CCQ_PARAMS_2025.ESPERANCE_VIE_HOMME;
    
    const anneesRetraite = esperanceVie - ageRetraite;
    const moisRetraite = anneesRetraite * 12;
    
    // Pension indexée
    let totalPension = 0;
    let pensionCourante = renteMensuelle;
    
    for (let mois = 0; mois < moisRetraite; mois++) {
      totalPension += pensionCourante;
      
      // Indexation annuelle
      if (mois % 12 === 0 && mois > 0) {
        pensionCourante *= (1 + CCQ_PARAMS_2025.TAUX_INDEXATION);
      }
    }
    
    return totalPension;
  }
  
  /**
   * Calcule la valeur actualisée
   */
  private static calculatePresentValue(totalPension: number, ageRetraite: number): number {
    const ageActuel = 55; // Âge moyen d'analyse
    const anneesJusquRetraite = Math.max(0, ageRetraite - ageActuel);
    
    return totalPension / Math.pow(1 + CCQ_PARAMS_2025.TAUX_ACTUALISATION, anneesJusquRetraite);
  }
  
  /**
   * Calcule la coordination avec RRQ
   */
  private static calculateRRQCoordination(data: CCQData): number {
    // Estimation basée sur les revenus et l'âge
    const rrqEstimee = 1200; // Estimation moyenne
    return rrqEstimee * CCQ_PARAMS_2025.COORDINATION_RRQ_FACTEUR;
  }
  
  /**
   * Calcule la coordination avec PSV
   */
  private static calculatePSVCoordination(data: CCQData): number {
    // PSV maximale 2025
    return 717.15 * CCQ_PARAMS_2025.COORDINATION_PSV_FACTEUR;
  }
  
  /**
   * Calcule la coordination avec SRG
   */
  private static calculateSRGCoordination(data: CCQData): number {
    // Généralement pas admissible au SRG avec pension CCQ
    return 0;
  }
  
  /**
   * Fonctions utilitaires
   */
  private static calculateCurrentAge(dateEntree: Date): number {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - dateEntree.getTime());
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    return Math.min(diffYears + 25, 70); // Estimation âge actuel
  }
  
  private static meetsEarlyRetirementConditions(data: CCQData): boolean {
    // Conditions spécifiques selon l'année d'entrée (à implémenter selon règles CCQ)
    return data.heuresTotales >= 15000; // Exemple simplifié
  }
  
  private static calculateLifetimeValue(montantMensuel: number, ageDebut: number, montantApres65?: number): number {
    const esperanceVie = 83; // Moyenne
    let total = 0;
    
    for (let age = ageDebut; age < esperanceVie; age++) {
      const montant = (montantApres65 && age >= 65) ? montantApres65 : montantMensuel;
      total += montant * 12;
    }
    
    return total;
  }
  
  private static calculateAgeOptimizationImpact(data: CCQData): number {
    // Impact estimé de l'optimisation d'âge
    return 50000; // Exemple: 50k$ d'impact potentiel
  }
  
  private static calculateRenteOptionImpact(data: CCQData): number {
    // Impact du choix d'option de rente
    return 25000; // Exemple: 25k$ d'impact potentiel
  }
  
  private static calculatePrivateSavingsImpact(data: CCQData): number {
    // Impact de la coordination épargne privée
    return 75000; // Exemple: 75k$ d'impact potentiel
  }
  
  /**
   * Valide les données CCQ
   */
  static validateCCQData(data: Partial<CCQData>): CCQValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingData: string[] = [];
    
    // Validations obligatoires
    if (!data.certificatCompetence) {
      errors.push("Certificat de compétence CCQ requis");
    }
    
    if (!data.dateEntreeIndustrie) {
      errors.push("Date d'entrée dans l'industrie requise");
    }
    
    if (!data.heuresTotales || data.heuresTotales <= 0) {
      errors.push("Heures totales travaillées requises");
    }
    
    // Validations de cohérence
    if (data.heuresTravaileesAvant2005 && data.heuresTravaileesDepuis2005) {
      const totalCalcule = data.heuresTravaileesAvant2005 + data.heuresTravaileesDepuis2005;
      if (Math.abs(totalCalcule - (data.heuresTotales || 0)) > 100) {
        warnings.push("Incohérence dans le total des heures travaillées");
      }
    }
    
    // Données manquantes recommandées
    if (!data.valeurCompteGeneral) {
      missingData.push("Valeur du compte général (du Relevé annuel CCQ)");
    }
    
    if (!data.valeurCompteComplementaire) {
      missingData.push("Valeur du compte complémentaire (du Relevé annuel CCQ)");
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      missingData
    };
  }
  
  /**
   * Génère des scénarios de projection
   */
  static generateProjectionScenarios(data: CCQData): CCQProjectionScenario[] {
    const scenarios: CCQProjectionScenario[] = [];
    
    // Scénario 1: Retraite anticipée à 55 ans
    scenarios.push({
      nom: "Retraite anticipée (55 ans)",
      ageRetraite: 55,
      heuresSupplementaires: 0,
      typeRetraite: 'anticipee-avec-reduction',
      optionRente: 'majoree-reduite',
      resultat: this.calculateCCQPension({ ...data, ageRetraiteSouhaite: 55 }),
      avantages: ["Liberté plus tôt", "Profiter de la retraite en santé"],
      risques: ["Réduction de 30% de la pension", "Revenus insuffisants"]
    });
    
    // Scénario 2: Retraite normale à 65 ans
    scenarios.push({
      nom: "Retraite normale (65 ans)",
      ageRetraite: 65,
      heuresSupplementaires: 0,
      typeRetraite: 'normale',
      optionRente: 'nivelee',
      resultat: this.calculateCCQPension({ ...data, ageRetraiteSouhaite: 65 }),
      avantages: ["Pension complète", "Coordination optimale RRQ/PSV"],
      risques: ["Travailler plus longtemps", "Risques de santé"]
    });
    
    // Scénario 3: Retraite différée à 70 ans
    scenarios.push({
      nom: "Retraite différée (70 ans)",
      ageRetraite: 70,
      heuresSupplementaires: data.heuresAnnuellesEstimees * 5,
      typeRetraite: 'normale',
      optionRente: 'nivelee',
      resultat: this.calculateCCQPension({ 
        ...data, 
        ageRetraiteSouhaite: 70,
        heuresTravaileesDepuis2005: data.heuresTravaileesDepuis2005 + (data.heuresAnnuellesEstimees * 5)
      }),
      avantages: ["Pension maximale", "Accumulation supplémentaire"],
      risques: ["Incertitude santé", "Moins d'années de retraite"]
    });
    
    return scenarios;
  }
}
