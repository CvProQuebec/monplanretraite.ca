// UnifiedSRGService.ts - Service Unifié Supplément de Revenu Garanti 2025
// CONSOLIDATION INTELLIGENTE - SÉCURITÉ MAXIMALE + FONCTIONNALITÉS AVANCÉES
// 100% LOCAL - AUCUNE TRANSMISSION EXTERNE

import { UserData } from '../features/retirement/types';

// ===== TYPES UNIFIÉS SRG =====

export interface UnifiedSRGData {
  age1: number;
  age2?: number;
  revenuAnnuel1: number;
  revenuAnnuel2?: number;
  anneesResidenceCanada1?: number;
  anneesResidenceCanada2?: number;
  hasSpouse: boolean;
  userData?: UserData; // Pour calculs avancés
}

export interface UnifiedSRGResult {
  // Résultats de base
  eligible: boolean;
  raison?: string;
  
  // Statut et revenus
  statutConjugal: 'celibataire' | 'conjoint-avec-sv' | 'conjoint-sans-sv';
  revenuFamilial: number;
  
  // Montants SRG
  montantSRG1: number;
  montantSRG2: number;
  montantTotal: number;
  montantMensuel1: number;
  montantMensuel2: number;
  montantMensuelTotal: number;
  
  // Calculs détaillés
  reductionAppliquee: number;
  revenuMaximal: number;
  detailsCalcul: {
    montantMaximal1: number;
    montantMaximal2: number;
    revenuCombiné: number;
    tauxReduction: number;
    exemptionBase: number;
    exemptionEmploi: number;
  };
  
  // Optimisations avancées
  optimisations: UnifiedSRGOptimization[];
  scenarios: UnifiedSRGScenario[];
  strategiesOptimisation: UnifiedSRGStrategy[];
  
  // Alertes et impact
  alertes: UnifiedSRGAlert[];
  impactFinancier: {
    annuel: number;
    decennal: number;
    optimise: number;
    gainPotentiel: number;
  };
  
  // Analyse couple (si applicable)
  analyseCouple?: {
    srgTotal: number;
    optimisationCombinee: number;
    strategiesCouple: string[];
  };
}

export interface UnifiedSRGOptimization {
  type: 'REDUCTION_REVENU' | 'CHANGEMENT_STATUT' | 'TIMING_DEMANDE' | 'FRACTIONNEMENT_REVENU' | 'OPTIMISATION_RETRAITS';
  description: string;
  impactPotentiel: number;
  difficulte: 'FACILE' | 'MOYENNE' | 'DIFFICILE';
  actions: string[];
  priorite: 'haute' | 'moyenne' | 'faible';
  delaiMiseEnOeuvre: string;
}

export interface UnifiedSRGScenario {
  nom: string;
  revenuCible: number;
  srgEstime: number;
  gainPotentiel: number;
  faisabilite: 'HAUTE' | 'MOYENNE' | 'FAIBLE';
}

export interface UnifiedSRGStrategy {
  titre: string;
  description: string;
  actions: string[];
  impact: string;
  priorite: 'haute' | 'moyenne' | 'faible';
  delaiMiseEnOeuvre: string;
}

export interface UnifiedSRGAlert {
  type: 'critique' | 'attention' | 'info';
  message: string;
  action: string;
  impact?: string;
}

/**
 * SERVICE UNIFIÉ SRG - CONSOLIDATION INTELLIGENTE
 * Combine la sécurité maximale avec les fonctionnalités avancées
 * Interface adaptative: mode simple et mode avancé
 */
export class UnifiedSRGService {
  
  // ===== PARAMÈTRES SRG 2025 OFFICIELS =====
  
  private static readonly SRG_PARAMETERS_2025 = {
    // Montants maximaux mensuels (octobre 2024 - septembre 2025)
    MAX_MONTHLY_SINGLE: 1065.47,           // Personne seule
    MAX_MONTHLY_SPOUSE_BOTH_SV: 639.94,    // Conjoint avec SV tous les deux
    MAX_MONTHLY_SPOUSE_ONE_SV: 1065.47,    // Un seul conjoint avec SV
    
    // Montants annuels (pour compatibilité)
    MAX_ANNUAL_SINGLE: 12785.64,           // 1065.47 × 12
    MAX_ANNUAL_COUPLE: 7679.28,            // 639.94 × 12
    
    // Seuils de revenus annuels
    INCOME_THRESHOLD_SINGLE: 21456,        // Personne seule
    INCOME_THRESHOLD_COUPLE: 28324,        // Couple (combiné)
    
    // Taux de réduction
    REDUCTION_RATE_SINGLE: 0.50,           // 50 cents par dollar
    REDUCTION_RATE_COUPLE: 0.25,           // 25 cents par dollar (par personne)
    
    // Paramètres d'éligibilité
    ELIGIBILITY_AGE: 65,
    MIN_RESIDENCE_YEARS: 10,
    
    // Exemptions revenu d'emploi
    EMPLOYMENT_EXEMPTION_BASE: 5000,       // Premier 5000$ exempté
    EMPLOYMENT_EXEMPTION_ADDITIONAL: 5000, // 50% du suivant jusqu'à 5000$
    EMPLOYMENT_EXEMPTION_RATE: 0.50        // 50% d'exemption sur la tranche additionnelle
  };

  /**
   * FONCTION PRINCIPALE UNIFIÉE
   * Interface adaptative selon le mode d'utilisation
   */
  public static calculateUnifiedSRG(
    data: UnifiedSRGData, 
    modeAvance: boolean = false
  ): UnifiedSRGResult {
    try {
      console.log('🔍 Début calcul SRG unifié...');
      
      // Validation des données de base
      if (data.age1 < this.SRG_PARAMETERS_2025.ELIGIBILITY_AGE && 
          (!data.age2 || data.age2 < this.SRG_PARAMETERS_2025.ELIGIBILITY_AGE)) {
        return this.createIneligibleResult(
          'Âge insuffisant',
          `Doit avoir au moins ${this.SRG_PARAMETERS_2025.ELIGIBILITY_AGE} ans`
        );
      }

      // Détermination du statut conjugal
      const statutConjugal = this.determinerStatutConjugal(data.age1, data.age2);
      
      // Calcul sécurisé des revenus
      const revenuFamilial = modeAvance && data.userData 
        ? this.calculerRevenuFamilialAvance(data.userData)
        : this.calculerRevenuFamilialSimple(data);
      
      // Calculs des montants SRG
      const resultatsCalcul = this.calculerMontantsSRG(
        data, 
        statutConjugal, 
        revenuFamilial
      );
      
      // Génération des optimisations (mode adaptatif)
      const optimisations = modeAvance 
        ? this.genererOptimisationsAvancees(data, resultatsCalcul, revenuFamilial)
        : this.genererOptimisationsSimples(data, resultatsCalcul);
      
      // Génération des scénarios
      const scenarios = this.genererScenarios(data, statutConjugal, revenuFamilial);
      
      // Stratégies personnalisées
      const strategiesOptimisation = this.genererStrategiesPersonnalisees(
        data, 
        resultatsCalcul, 
        revenuFamilial, 
        statutConjugal
      );
      
      // Alertes intelligentes
      const alertes = this.genererAlertesIntelligentes(
        revenuFamilial, 
        resultatsCalcul.montantTotal, 
        statutConjugal
      );
      
      // Impact financier
      const impactFinancier = this.calculerImpactFinancier(resultatsCalcul.montantTotal);
      
      // Analyse couple si applicable
      const analyseCouple = data.hasSpouse 
        ? this.calculerAnalyseCouple(resultatsCalcul, data)
        : undefined;
      
      console.log('✅ Calcul SRG unifié terminé avec succès');
      
      return {
        eligible: resultatsCalcul.montantTotal > 0,
        statutConjugal,
        revenuFamilial,
        ...resultatsCalcul,
        optimisations,
        scenarios,
        strategiesOptimisation,
        alertes,
        impactFinancier,
        analyseCouple
      };
      
    } catch (error) {
      console.error('❌ Erreur dans calculateUnifiedSRG:', error);
      return this.createErrorResult('Erreur lors du calcul SRG unifié');
    }
  }

  /**
   * CALCUL DES MONTANTS SRG PRINCIPAL
   */
  private static calculerMontantsSRG(
    data: UnifiedSRGData,
    statutConjugal: string,
    revenuFamilial: number
  ) {
    // Détermination des montants maximaux
    const montantMaximal1 = data.age1 >= this.SRG_PARAMETERS_2025.ELIGIBILITY_AGE
      ? this.getMontantMaximal(statutConjugal)
      : 0;
    
    const montantMaximal2 = (data.age2 && data.age2 >= this.SRG_PARAMETERS_2025.ELIGIBILITY_AGE)
      ? this.getMontantMaximal(statutConjugal)
      : 0;
    
    // Calcul des seuils et taux
    const seuilRevenu = this.getSeuilRevenu(statutConjugal);
    const tauxReduction = this.getTauxReduction(statutConjugal);
    
    // Calcul de la réduction totale
    const revenuExcedentaire = Math.max(0, revenuFamilial - seuilRevenu);
    const reductionTotale = revenuExcedentaire * tauxReduction;
    
    // Répartition de la réduction
    let reductionIndividuelle1 = 0;
    let reductionIndividuelle2 = 0;
    
    if (statutConjugal.includes('conjoint')) {
      // Pour couples: réduction divisée équitablement
      reductionIndividuelle1 = montantMaximal1 > 0 ? reductionTotale / 2 : 0;
      reductionIndividuelle2 = montantMaximal2 > 0 ? reductionTotale / 2 : 0;
    } else {
      // Pour célibataire: réduction complète sur la personne éligible
      reductionIndividuelle1 = montantMaximal1 > 0 ? reductionTotale : 0;
    }
    
    // Calcul des montants finaux
    const montantAnnuel1 = Math.max(0, montantMaximal1 - reductionIndividuelle1);
    const montantAnnuel2 = Math.max(0, montantMaximal2 - reductionIndividuelle2);
    const montantTotal = montantAnnuel1 + montantAnnuel2;
    
    return {
      montantSRG1: Math.round(montantAnnuel1 * 100) / 100,
      montantSRG2: Math.round(montantAnnuel2 * 100) / 100,
      montantTotal: Math.round(montantTotal * 100) / 100,
      montantMensuel1: Math.round((montantAnnuel1 / 12) * 100) / 100,
      montantMensuel2: Math.round((montantAnnuel2 / 12) * 100) / 100,
      montantMensuelTotal: Math.round((montantTotal / 12) * 100) / 100,
      reductionAppliquee: Math.round(reductionTotale * 100) / 100,
      revenuMaximal: seuilRevenu,
      detailsCalcul: {
        montantMaximal1,
        montantMaximal2,
        revenuCombiné: revenuFamilial,
        tauxReduction,
        exemptionBase: seuilRevenu,
        exemptionEmploi: this.calculerExemptionEmploi(data)
      }
    };
  }

  /**
   * CALCUL REVENU FAMILIAL SIMPLE (mode sécurisé de base)
   */
  private static calculerRevenuFamilialSimple(data: UnifiedSRGData): number {
    let revenuTotal = data.revenuAnnuel1 || 0;
    if (data.hasSpouse && data.revenuAnnuel2) {
      revenuTotal += data.revenuAnnuel2;
    }
    return Math.max(0, revenuTotal);
  }

  /**
   * CALCUL REVENU FAMILIAL AVANCÉ (avec exemptions et optimisations)
   */
  private static calculerRevenuFamilialAvance(userData: UserData): number {
    let revenuTotal = 0;

    try {
      const personal = userData.personal;
      const savings = userData.savings;
      const retirement = userData.retirement;

      // Revenus d'emploi avec exemption SRG
      const salaire1 = personal?.salaire1 || 0;
      const salaire2 = personal?.salaire2 || 0;
      const revenuEmploi = salaire1 + salaire2;
      const revenuEmploiAjuste = this.appliquerExemptionEmploi(revenuEmploi);
      revenuTotal += revenuEmploiAjuste;

      // Revenus de pension privée (100% imposables)
      revenuTotal += retirement?.pensionPrivee1 || 0;
      revenuTotal += retirement?.pensionPrivee2 || 0;

      // Retraits REER/FERR (100% imposables) - utilisation des champs existants
      revenuTotal += retirement?.revenusTempsPartiel1 || 0;
      revenuTotal += retirement?.revenusTempsPartiel2 || 0;

      // Revenus de placements non-enregistrés - utilisation des champs existants
      const placements1 = savings?.placements1 || 0;
      const placements2 = savings?.placements2 || 0;
      const totalPlacements = placements1 + placements2;
      if (totalPlacements > 0) {
        revenuTotal += (totalPlacements * 0.04); // 4% rendement estimé
      }

      // EXCLUSIONS IMPORTANTES:
      // - Retraits CELI (0% imposables)
      // - Sécurité de vieillesse (exclue du calcul SRG)
      // - SRG précédent (exclu)

    } catch (error) {
      console.error('Erreur calcul revenus SRG avancé:', error);
    }

    return Math.max(0, revenuTotal);
  }

  /**
   * APPLICATION EXEMPTION REVENU D'EMPLOI
   */
  private static appliquerExemptionEmploi(revenuEmploi: number): number {
    if (revenuEmploi <= this.SRG_PARAMETERS_2025.EMPLOYMENT_EXEMPTION_BASE) {
      return 0; // Premier 5000$ complètement exempté
    }
    
    if (revenuEmploi <= this.SRG_PARAMETERS_2025.EMPLOYMENT_EXEMPTION_BASE + 
                        this.SRG_PARAMETERS_2025.EMPLOYMENT_EXEMPTION_ADDITIONAL) {
      // 50% du montant entre 5000$ et 10000$ est exempté
      const montantExemptable = revenuEmploi - this.SRG_PARAMETERS_2025.EMPLOYMENT_EXEMPTION_BASE;
      const exemption = montantExemptable * this.SRG_PARAMETERS_2025.EMPLOYMENT_EXEMPTION_RATE;
      return revenuEmploi - this.SRG_PARAMETERS_2025.EMPLOYMENT_EXEMPTION_BASE - exemption;
    }
    
    // Au-delà de 10000$: exemption maximale de 7500$ (5000$ + 2500$)
    const exemptionMaximale = this.SRG_PARAMETERS_2025.EMPLOYMENT_EXEMPTION_BASE + 
                             (this.SRG_PARAMETERS_2025.EMPLOYMENT_EXEMPTION_ADDITIONAL * 
                              this.SRG_PARAMETERS_2025.EMPLOYMENT_EXEMPTION_RATE);
    return revenuEmploi - exemptionMaximale;
  }

  /**
   * GÉNÉRATION OPTIMISATIONS AVANCÉES
   */
  private static genererOptimisationsAvancees(
    data: UnifiedSRGData,
    resultats: any,
    revenuFamilial: number
  ): UnifiedSRGOptimization[] {
    const optimisations: UnifiedSRGOptimization[] = [];

    // Optimisation retraits si éligible
    if (resultats.montantTotal > 0) {
      optimisations.push({
        type: 'OPTIMISATION_RETRAITS',
        description: 'Maximiser le SRG en privilégiant les sources non-imposables',
        impactPotentiel: Math.round(resultats.montantTotal * 0.2),
        difficulte: 'MOYENNE',
        actions: [
          'Privilégier les retraits CELI (0% imposable)',
          'Reporter les retraits REER si possible',
          'Étaler les gains en capital sur plusieurs années',
          `Maintenir revenu familial sous ${this.SRG_PARAMETERS_2025.INCOME_THRESHOLD_COUPLE.toLocaleString()} $`
        ],
        priorite: 'haute',
        delaiMiseEnOeuvre: 'Avant prochain retrait important'
      });
    }

    // Fractionnement pour couples
    if (data.hasSpouse && resultats.montantTotal > 0) {
      optimisations.push({
        type: 'FRACTIONNEMENT_REVENU',
        description: 'Optimiser la répartition des revenus entre conjoints',
        impactPotentiel: 150,
        difficulte: 'FACILE',
        actions: [
          'Utiliser le fractionnement de pension à 65 ans',
          'Optimiser les retraits REER entre conjoints',
          'Considérer les prêts entre conjoints',
          'Égaliser les revenus pour maximiser le SRG'
        ],
        priorite: 'haute',
        delaiMiseEnOeuvre: 'Planifier 2-3 ans avant 65 ans'
      });
    }

    // Réduction revenus si non éligible
    if (resultats.montantTotal === 0 && revenuFamilial > this.getSeuilRevenu('celibataire')) {
      optimisations.push({
        type: 'REDUCTION_REVENU',
        description: 'Réduire les revenus pour devenir éligible au SRG',
        impactPotentiel: this.calculerPotentielReduction(data, revenuFamilial),
        difficulte: 'MOYENNE',
        actions: [
          'Différer les retraits REER/FERR si possible',
          'Réduire les revenus de placements imposables',
          'Considérer des investissements générant des gains en capital',
          'Reporter certains revenus à des années ultérieures'
        ],
        priorite: 'moyenne',
        delaiMiseEnOeuvre: 'Révision annuelle'
      });
    }

    return optimisations;
  }

  /**
   * GÉNÉRATION OPTIMISATIONS SIMPLES
   */
  private static genererOptimisationsSimples(
    data: UnifiedSRGData,
    resultats: any
  ): UnifiedSRGOptimization[] {
    const optimisations: UnifiedSRGOptimization[] = [];

    if (resultats.montantTotal > 0) {
      optimisations.push({
        type: 'TIMING_DEMANDE',
        description: 'Optimiser le timing de la demande SRG',
        impactPotentiel: 100,
        difficulte: 'FACILE',
        actions: [
          'Faire la demande dès l\'éligibilité à 65 ans',
          'Inscription automatique ou demande manuelle',
          'Réviser annuellement les revenus déclarés'
        ],
        priorite: 'haute',
        delaiMiseEnOeuvre: 'Immédiat'
      });
    }

    return optimisations;
  }

  /**
   * GÉNÉRATION DES SCÉNARIOS
   */
  private static genererScenarios(
    data: UnifiedSRGData,
    statutConjugal: string,
    revenuFamilial: number
  ): UnifiedSRGScenario[] {
    const scenarios: UnifiedSRGScenario[] = [];
    const maxAmount = this.getMontantMaximal(statutConjugal);
    const threshold = this.getSeuilRevenu(statutConjugal);
    const reductionRate = this.getTauxReduction(statutConjugal);

    // Scénario optimal
    scenarios.push({
      nom: 'Revenu optimal (au seuil)',
      revenuCible: threshold,
      srgEstime: maxAmount,
      gainPotentiel: maxAmount - Math.max(0, maxAmount - (revenuFamilial - threshold) * reductionRate),
      faisabilite: revenuFamilial > threshold ? 'MOYENNE' : 'HAUTE'
    });

    // Scénario SRG maximal
    scenarios.push({
      nom: 'SRG maximal possible',
      revenuCible: 0,
      srgEstime: maxAmount,
      gainPotentiel: maxAmount,
      faisabilite: 'FAIBLE'
    });

    return scenarios;
  }

  /**
   * GÉNÉRATION STRATÉGIES PERSONNALISÉES
   */
  private static genererStrategiesPersonnalisees(
    data: UnifiedSRGData,
    resultats: any,
    revenuFamilial: number,
    statutConjugal: string
  ): UnifiedSRGStrategy[] {
    const strategies: UnifiedSRGStrategy[] = [];

    if (resultats.montantTotal > 0) {
      strategies.push({
        titre: 'Préservation du SRG',
        description: 'Maintenir l\'éligibilité et maximiser les montants',
        actions: [
          'Surveiller les seuils de revenus annuellement',
          'Planifier les retraits pour minimiser l\'impact fiscal',
          'Utiliser les exemptions disponibles'
        ],
        impact: `Préserver ${resultats.montantTotal.toLocaleString()} $ annuellement`,
        priorite: 'haute',
        delaiMiseEnOeuvre: 'Révision continue'
      });
    }

    return strategies;
  }

  /**
   * GÉNÉRATION ALERTES INTELLIGENTES
   */
  private static genererAlertesIntelligentes(
    revenuFamilial: number,
    montantSRG: number,
    statutConjugal: string
  ): UnifiedSRGAlert[] {
    const alertes: UnifiedSRGAlert[] = [];
    const seuil = this.getSeuilRevenu(statutConjugal);

    if (montantSRG > 0 && revenuFamilial > seuil * 0.8) {
      alertes.push({
        type: 'attention',
        message: 'Revenus proches du seuil de réduction SRG',
        action: 'Réviser stratégie de décaissement avant prochains retraits',
        impact: 'Risque de perte partielle du SRG'
      });
    }

    return alertes;
  }

  /**
   * CALCUL IMPACT FINANCIER
   */
  private static calculerImpactFinancier(montantAnnuel: number) {
    const decennal = montantAnnuel * 10;
    const optimise = decennal * 1.15; // 15% d'amélioration avec optimisations
    
    return {
      annuel: montantAnnuel,
      decennal,
      optimise,
      gainPotentiel: optimise - decennal
    };
  }

  /**
   * ANALYSE COUPLE
   */
  private static calculerAnalyseCouple(resultats: any, data: UnifiedSRGData) {
    const srgTotal = resultats.montantMensuelTotal;
    const optimisationCombinee = srgTotal * 0.1; // 10% d'amélioration potentielle
    
    const strategiesCouple = [
      'Fractionnement de revenus de pension',
      'Optimisation des retraits REER/FERR',
      'Coordination des demandes SV/SRG'
    ];

    return {
      srgTotal,
      optimisationCombinee,
      strategiesCouple
    };
  }

  // ===== FONCTIONS UTILITAIRES =====

  private static determinerStatutConjugal(age1: number, age2?: number): 
    'celibataire' | 'conjoint-avec-sv' | 'conjoint-sans-sv' {
    
    if (!age2) return 'celibataire';
    
    if (age1 >= 65 && age2 >= 65) return 'conjoint-avec-sv';
    return 'conjoint-sans-sv';
  }

  private static getMontantMaximal(statutConjugal: string): number {
    switch (statutConjugal) {
      case 'celibataire':
      case 'conjoint-sans-sv':
        return this.SRG_PARAMETERS_2025.MAX_ANNUAL_SINGLE;
      case 'conjoint-avec-sv':
        return this.SRG_PARAMETERS_2025.MAX_ANNUAL_COUPLE;
      default:
        return 0;
    }
  }

  private static getSeuilRevenu(statutConjugal: string): number {
    return statutConjugal === 'celibataire' 
      ? this.SRG_PARAMETERS_2025.INCOME_THRESHOLD_SINGLE
      : this.SRG_PARAMETERS_2025.INCOME_THRESHOLD_COUPLE;
  }

  private static getTauxReduction(statutConjugal: string): number {
    return statutConjugal === 'celibataire'
      ? this.SRG_PARAMETERS_2025.REDUCTION_RATE_SINGLE
      : this.SRG_PARAMETERS_2025.REDUCTION_RATE_COUPLE;
  }

  private static calculerExemptionEmploi(data: UnifiedSRGData): number {
    // Calcul simplifié pour les détails
    const revenuEmploi = (data.revenuAnnuel1 || 0) + (data.revenuAnnuel2 || 0);
    if (revenuEmploi <= this.SRG_PARAMETERS_2025.EMPLOYMENT_EXEMPTION_BASE) {
      return revenuEmploi;
    }
    return Math.min(7500, this.SRG_PARAMETERS_2025.EMPLOYMENT_EXEMPTION_BASE + 
                          (Math.min(revenuEmploi - this.SRG_PARAMETERS_2025.EMPLOYMENT_EXEMPTION_BASE, 
                                   this.SRG_PARAMETERS_2025.EMPLOYMENT_EXEMPTION_ADDITIONAL) * 
                           this.SRG_PARAMETERS_2025.EMPLOYMENT_EXEMPTION_RATE));
  }

  private static calculerPotentielReduction(data: UnifiedSRGData, revenuFamilial: number): number {
    const seuil = this.getSeuilRevenu(this.determinerStatutConjugal(data.age1, data.age2));
    const maxAmount = this.getMontantMaximal(this.determinerStatutConjugal(data.age1, data.age2));
    
    if (revenuFamilial <= seuil) return 0;
    
    const potentialSRG = maxAmount;
    const revenueLoss = revenuFamilial - seuil;
    
    return Math.max(0, potentialSRG - revenueLoss * 0.5);
  }

  private static createIneligibleResult(raison: string, details: string): UnifiedSRGResult {
    return {
      eligible: false,
      raison: `${raison}: ${details}`,
      statutConjugal: 'celibataire',
      revenuFamilial: 0,
      montantSRG1: 0,
      montantSRG2: 0,
      montantTotal: 0,
      montantMensuel1: 0,
      montantMensuel2: 0,
      montantMensuelTotal: 0,
      reductionAppliquee: 0,
      revenuMaximal: 0,
      detailsCalcul: {
        montantMaximal1: 0,
        montantMaximal2: 0,
        revenuCombiné: 0,
        tauxReduction: 0,
        exemptionBase: 0,
        exemptionEmploi: 0
      },
      optimisations: [],
      scenarios: [],
      strategiesOptimisation: [],
      alertes: [{
        type: 'critique',
        message: raison,
        action: 'Vérifier les données saisies'
      }],
      impactFinancier: {
        annuel: 0,
        decennal: 0,
        optimise: 0,
        gainPotentiel: 0
      }
    };
  }

  private static createErrorResult(raison: string): UnifiedSRGResult {
    return this.createIneligibleResult('Erreur de calcul', raison);
  }

  // ===== MÉTHODES DE COMPATIBILITÉ =====

  /**
   * Méthode de compatibilité avec l'ancien SRGService global
   */
  public static calculateSRGAnalysis(userData: UserData) {
    const data: UnifiedSRGData = {
      age1: this.calculateAge(userData.personal?.naissance1 || ''),
      age2: userData.personal?.naissance2 ? this.calculateAge(userData.personal.naissance2) : undefined,
      revenuAnnuel1: userData.personal?.salaire1 || 0,
      revenuAnnuel2: userData.personal?.salaire2 || 0,
      hasSpouse: !!(userData.personal?.prenom2 && userData.personal?.naissance2),
      userData
    };

    const result = this.calculateUnifiedSRG(data, true);
    
    // Conversion vers le format attendu par l'ancien service
    return {
      person1: {
        eligible: result.eligible && result.montantSRG1 > 0,
        montantMensuel: result.montantMensuel1,
        montantAnnuel: result.montantSRG1,
        revenuMaximal: result.revenuMaximal,
        reductionAppliquee: result.reductionAppliquee / 2,
        detailsCalcul: result.detailsCalcul,
        optimisations: result.optimisations,
        scenarios: result.scenarios
      },
      person2: data.age2 ? {
        eligible: result.eligible && result.montantSRG2 > 0,
        montantMensuel: result.montantMensuel2,
        montantAnnuel: result.montantSRG2,
        revenuMaximal: result.revenuMaximal,
        reductionAppliquee: result.reductionAppliquee / 2,
        detailsCalcul: result.detailsCalcul,
        optimisations: result.optimisations,
        scenarios: result.scenarios
      } : undefined,
      totalHousehold: result.analyseCouple || {
        srgTotal: result.montantMensuelTotal,
        optimisationCombinee: 0,
        strategiesCouple: []
      }
    };
  }

  /**
   * Méthode de compatibilité avec l'ancien SRGService local
   */
  public static calculerSRG(userData: any) {
    const data: UnifiedSRGData = {
      age1: this.calculateAge(userData.personal?.naissance1 || ''),
      age2: userData.personal?.naissance2 ? this.calculateAge(userData.personal.naissance2) : undefined,
      revenuAnnuel1: userData.personal?.salaire1 || 0,
      revenuAnnuel2: userData.personal?.salaire2 || 0,
      hasSpouse: !!(userData.personal?.prenom2 && userData.personal?.naissance2),
      userData
    };

    const result = this.calculateUnifiedSRG(data, true);
    
    // Conversion vers le format attendu par l'ancien service local
    return {
      eligible: result.eligible,
      raison: result.raison,
      statutConjugal: result.statutConjugal,
      revenuFamilial: result.revenuFamilial,
      montantSRG1: result.montantSRG1,
      montantSRG2: result.montantSRG2,
      montantTotal: result.montantTotal,
      reductionAppliquee: result.reductionAppliquee,
      strategiesOptimisation: result.strategiesOptimisation,
      alertes: result.alertes,
      impactFinancier: result.impactFinancier
    };
  }

  /**
   * Fonction d'évaluation rapide (compatibilité avec l'ancien service global)
   */
  public static quickSRGEvaluation(age: number, annualIncome: number, hasSpouse: boolean) {
    const data: UnifiedSRGData = {
      age1: age,
      revenuAnnuel1: annualIncome,
      hasSpouse
    };

    const result = this.calculateUnifiedSRG(data, false);
    
    const priority = result.montantMensuelTotal > 500 ? 'HIGH' : 
                    result.montantMensuelTotal > 100 ? 'MEDIUM' : 'LOW';

    return {
      eligible: result.eligible,
      estimatedMonthly: Math.round(result.montantMensuelTotal),
      priority
    };
  }

  // ===== FONCTIONS UTILITAIRES PRIVÉES =====

  private static calculateAge(birthDate: string): number {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}

// Export par défaut pour compatibilité
export default UnifiedSRGService;
