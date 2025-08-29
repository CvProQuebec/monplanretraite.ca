// SRGService.ts - Service Supplément de Revenu Garanti 2025
// DONNÉES LOCALES UNIQUEMENT - AUCUNE TRANSMISSION EXTERNE

export interface SRGParams2025 {
  readonly montantMaximalCelibataire: number;
  readonly montantMaximalCouple: number; // par personne
  readonly seuilReduction: number;
  readonly tauxReduction: number;
  readonly ageMinimum: number;
  readonly requiresSV: boolean;
}

export interface SRGCalculationResult {
  eligible: boolean;
  raison?: string;
  statutConjugal: 'celibataire' | 'conjoint-avec-sv' | 'conjoint-sans-sv';
  revenuFamilial: number;
  montantSRG1: number;
  montantSRG2: number;
  montantTotal: number;
  reductionAppliquee: number;
  strategiesOptimisation: SRGStrategy[];
  alertes: SRGAlert[];
  impactFinancier: {
    annuel: number;
    decennal: number;
    optimise: number;
    gainPotentiel: number;
  };
}

export interface SRGStrategy {
  titre: string;
  description: string;
  actions: string[];
  impact: string;
  priorite: 'haute' | 'moyenne' | 'faible';
  delaiMiseEnOeuvre: string;
}

export interface SRGAlert {
  type: 'critique' | 'attention' | 'info';
  message: string;
  action: string;
  impact?: string;
}

/**
 * Service de calcul du Supplément de Revenu Garanti (SRG) 2025
 * SÉCURISÉ - Toutes les données restent locales
 */
export class SRGService {
  // Paramètres officiels 2025 - données publiques
  private static readonly PARAMS_2025: SRGParams2025 = {
    montantMaximalCelibataire: 11928, // 994 $/mois × 12
    montantMaximalCouple: 7176, // 598 $/mois × 12 par personne  
    seuilReduction: 23712, // Seuil où débute la réduction
    tauxReduction: 0.50, // 50¢ de réduction par dollar de revenu
    ageMinimum: 65,
    requiresSV: true
  };

  /**
   * Calcul principal du SRG
   * SÉCURISÉ - Aucune donnée ne quitte le navigateur
   */
  public static calculerSRG(userData: any): SRGCalculationResult {
    try {
      // Validation des données minimales
      if (!userData.personal?.naissance1) {
        return this.createErrorResult('Données personnelles incomplètes');
      }

      const age1 = this.calculerAge(userData.personal.naissance1);
      const age2 = userData.personal.naissance2 ? this.calculerAge(userData.personal.naissance2) : null;

      // Vérification éligibilité âge
      if (age1 < this.PARAMS_2025.ageMinimum && (!age2 || age2 < this.PARAMS_2025.ageMinimum)) {
        return this.createErrorResult(`Âge minimum requis: ${this.PARAMS_2025.ageMinimum} ans`);
      }

      // Calcul sécurisé des revenus
      const revenuFamilial = this.calculerRevenuFamilialSRG(userData);
      const statutConjugal = this.determinerStatutConjugal(age1, age2);

      // Calcul des montants SRG
      const montantSRG1 = age1 >= this.PARAMS_2025.ageMinimum ? 
        this.calculerMontantIndividuel(revenuFamilial, statutConjugal) : 0;
      
      const montantSRG2 = (age2 && age2 >= this.PARAMS_2025.ageMinimum) ? 
        this.calculerMontantIndividuel(revenuFamilial, statutConjugal) : 0;

      const montantTotal = montantSRG1 + montantSRG2;
      const reductionAppliquee = this.calculerReduction(revenuFamilial, statutConjugal);

      // Génération des stratégies d'optimisation
      const strategiesOptimisation = this.genererStrategies(
        revenuFamilial, 
        statutConjugal, 
        montantTotal,
        userData
      );

      // Génération des alertes
      const alertes = this.genererAlertes(revenuFamilial, montantTotal, statutConjugal);

      // Calcul de l'impact financier
      const impactFinancier = this.calculerImpactFinancier(montantTotal);

      return {
        eligible: montantTotal > 0,
        statutConjugal,
        revenuFamilial,
        montantSRG1,
        montantSRG2,
        montantTotal,
        reductionAppliquee,
        strategiesOptimisation,
        alertes,
        impactFinancier
      };

    } catch (error) {
      console.error('Erreur calcul SRG:', error);
      return this.createErrorResult('Erreur lors du calcul SRG');
    }
  }

  /**
   * Calcul sécurisé des revenus familiaux pour SRG
   * Exclut SV et SRG selon règles officielles
   */
  private static calculerRevenuFamilialSRG(userData: any): number {
    let revenuTotal = 0;

    try {
      const personal = userData.personal || {};
      const savings = userData.savings || {};
      const retirement = userData.retirement || {};

      // Revenus d'emploi (avec exemption partielle de 5000$ selon règles)
      const salaire1 = personal.salaire1 || 0;
      const salaire2 = personal.salaire2 || 0;
      const revenuEmploi = salaire1 + salaire2;
      
      // Application exemption revenu emploi (5000$ + 50% jusqu'à 10000$)
      const revenuEmploiAjuste = this.appliquerExemptionEmploi(revenuEmploi);
      revenuTotal += revenuEmploiAjuste;

      // Revenus de pension privée (100% imposables)
      revenuTotal += retirement.pensionPrivee1 || 0;
      revenuTotal += retirement.pensionPrivee2 || 0;

      // Retraits REER/FERR (100% imposables)
      revenuTotal += retirement.retraitREER1 || 0;
      revenuTotal += retirement.retraitREER2 || 0;

      // Revenus de placements non-enregistrés
      if (savings.nonEnregistre && savings.nonEnregistre > 0) {
        // Estimation rendement 4% annuel imposable
        revenuTotal += (savings.nonEnregistre * 0.04);
      }

      // NOTE: Exclusions importantes pour SRG
      // - Retraits CELI (0% imposables)
      // - Sécurité de vieillesse (exclue du calcul SRG)
      // - SRG précédent (exclu)

    } catch (error) {
      console.error('Erreur calcul revenus SRG:', error);
    }

    return Math.max(0, revenuTotal);
  }

  /**
   * Application de l'exemption revenu d'emploi pour SRG
   * Règle: Premier 5000$ + 50% du suivant jusqu'à 5000$ additionnels
   */
  private static appliquerExemptionEmploi(revenuEmploi: number): number {
    if (revenuEmploi <= 5000) {
      return 0; // Premier 5000$ complètement exempté
    }
    
    if (revenuEmploi <= 10000) {
      // 50% du montant entre 5000$ et 10000$ est exempté
      const montantExemptable = revenuEmploi - 5000;
      const exemption = montantExemptable * 0.5;
      return revenuEmploi - exemption;
    }
    
    // Au-delà de 10000$: exemption maximale de 7500$ (5000$ + 2500$)
    return revenuEmploi - 7500;
  }

  /**
   * Détermination du statut conjugal pour calcul SRG
   */
  private static determinerStatutConjugal(age1: number, age2: number | null): 
    'celibataire' | 'conjoint-avec-sv' | 'conjoint-sans-sv' {
    
    if (!age2) {
      return 'celibataire';
    }

    // Les deux reçoivent la SV (65+)
    if (age1 >= 65 && age2 >= 65) {
      return 'conjoint-avec-sv';
    }

    // Un seul reçoit la SV
    return 'conjoint-sans-sv';
  }

  /**
   * Calcul du montant SRG individuel
   */
  private static calculerMontantIndividuel(
    revenuFamilial: number, 
    statutConjugal: string
  ): number {
    
    let montantMaximal: number;
    
    switch (statutConjugal) {
      case 'celibataire':
        montantMaximal = this.PARAMS_2025.montantMaximalCelibataire;
        break;
      case 'conjoint-avec-sv':
      case 'conjoint-sans-sv':
        montantMaximal = this.PARAMS_2025.montantMaximalCouple;
        break;
      default:
        return 0;
    }

    // Calcul de la réduction
    const reduction = this.calculerReduction(revenuFamilial, statutConjugal);
    
    // Pour les couples, réduction divisée par 2
    const reductionIndividuelle = statutConjugal.includes('conjoint') ? 
      reduction / 2 : reduction;
    
    return Math.max(0, Math.round(montantMaximal - reductionIndividuelle));
  }

  /**
   * Calcul de la réduction appliquée
   */
  private static calculerReduction(revenuFamilial: number, statutConjugal: string): number {
    if (revenuFamilial <= this.PARAMS_2025.seuilReduction) {
      return 0;
    }

    const revenus_excedentaires = revenuFamilial - this.PARAMS_2025.seuilReduction;
    return revenus_excedentaires * this.PARAMS_2025.tauxReduction;
  }

  /**
   * Génération des stratégies d'optimisation personnalisées
   */
  private static genererStrategies(
    revenuFamilial: number,
    statutConjugal: string,
    montantSRG: number,
    userData: any
  ): SRGStrategy[] {
    
    const strategies: SRGStrategy[] = [];

    // Stratégie 1: Optimisation des retraits si éligible
    if (montantSRG > 0) {
      strategies.push({
        titre: 'Optimisation des retraits',
        description: 'Maximiser le SRG en privilégiant les sources non-imposables',
        actions: [
          'Privilégier les retraits CELI (0% imposable)',
          'Reporter les retraits REER si possible',
          'Étaler les gains en capital sur plusieurs années',
          `Maintenir revenu familial sous ${this.PARAMS_2025.seuilReduction.toLocaleString()} $`
        ],
        impact: `Peut préserver jusqu'à ${Math.round(montantSRG * 0.2)} $ de SRG annuel`,
        priorite: 'haute',
        delaiMiseEnOeuvre: 'Avant prochain retrait important'
      });
    }

    // Stratégie 2: Fractionnement si couple
    if (statutConjugal.includes('conjoint') && montantSRG > 0) {
      strategies.push({
        titre: 'Fractionnement de revenus',
        description: 'Égaliser les revenus entre conjoints',
        actions: [
          'Fractionner revenus de pension à 65 ans',
          'Optimiser répartition des retraits REER',
          'Considérer cotisations REER du conjoint à revenu plus faible'
        ],
        impact: 'Peut réduire la perte de SRG de 25% à 50%',
        priorite: 'haute',
        delaiMiseEnOeuvre: 'Planifier 2-3 ans avant 65 ans'
      });
    }

    // Stratégie 3: Préparation si non éligible
    if (montantSRG === 0 && revenuFamilial > this.PARAMS_2025.seuilReduction) {
      strategies.push({
        titre: 'Préparation future au SRG',
        description: 'Planifier pour éligibilité future potentielle',
        actions: [
          'Surveiller évolution des seuils annuellement',
          'Planifier séquence de décaissement après 75 ans',
          'Considérer report de revenus importants'
        ],
        impact: 'Peut créer éligibilité SRG dans le futur',
        priorité: 'moyenne',
        delaiMiseEnOeuvre: 'Révision annuelle'
      });
    }

    return strategies;
  }

  /**
   * Génération des alertes personnalisées
   */
  private static genererAlertes(
    revenuFamilial: number,
    montantSRG: number,
    statutConjugal: string
  ): SRGAlert[] {
    
    const alertes: SRGAlert[] = [];

    // Alerte si proche du seuil
    if (montantSRG > 0 && revenuFamilial > this.PARAMS_2025.seuilReduction * 0.8) {
      alertes.push({
        type: 'attention',
        message: 'Revenus proches du seuil de réduction SRG',
        action: 'Réviser stratégie de décaissement avant prochains retraits',
        impact: 'Risque de perte partielle du SRG'
      });
    }

    // Alerte montant faible
    if (montantSRG > 0 && montantSRG < 1000) {
      alertes.push({
        type: 'info',
        message: 'Montant SRG faible - optimisation possible',
        action: 'Analyser sources de revenus imposables pour réductions possibles'
      });
    }

    // Alerte non-éligibilité avec revenus élevés
    if (montantSRG === 0 && revenuFamilial > this.PARAMS_2025.seuilReduction * 1.5) {
      alertes.push({
        type: 'info',
        message: 'Non éligible au SRG - revenus élevés',
        action: 'Considérer autres optimisations fiscales (PSV, fractionnement)'
      });
    }

    return alertes;
  }

  /**
   * Calcul de l'impact financier sur 10 ans
   */
  private static calculerImpactFinancier(montantAnnuel: number) {
    const decennal = montantAnnuel * 10;
    const optimise = decennal * 1.15; // Estimation avec optimisations
    
    return {
      annuel: montantAnnuel,
      decennal,
      optimise,
      gainPotentiel: optimise - decennal
    };
  }

  // Fonctions utilitaires
  private static calculerAge(dateNaissance: string): number {
    if (!dateNaissance) return 0;
    const naissance = new Date(dateNaissance);
    const aujourd = new Date();
    return aujourd.getFullYear() - naissance.getFullYear();
  }

  private static createErrorResult(raison: string): SRGCalculationResult {
    return {
      eligible: false,
      raison,
      statutConjugal: 'celibataire',
      revenuFamilial: 0,
      montantSRG1: 0,
      montantSRG2: 0,
      montantTotal: 0,
      reductionAppliquee: 0,
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
}

// Export pour intégration dans CalculationService
export default SRGService;