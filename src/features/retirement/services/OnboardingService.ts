import { UserData } from '../types';
import { SRGService } from './SRGService';
import { RREGOPService } from './RREGOPService';

export interface OnboardingData {
  // Informations de base
  age: number;
  conjoint: boolean;
  ageConjoint?: number;
  salaire: number;
  
  // Situation professionnelle
  secteur: 'prive' | 'gouvernement' | 'autonome';
  employeurActuel: string;
  anneesService: number;
  
  // Prestations gouvernementales
  rregopMembre: boolean;
  anneesREEROPEstimees?: number;
  rrqDemandee: boolean;
  
  // Objectifs retraite
  ageRetraiteVoulu: number;
  revenuRetraiteVoulu: number;
  depensesActuelles: number;
  
  // Sécurité
  comprendSecurite: boolean;
}

export interface OnboardingResult {
  userData: UserData;
  recommendations: string[];
  detectedBenefits: {
    srg: boolean;
    rregop: boolean;
    rrq: boolean;
  };
  estimatedIncome: {
    rregop: number;
    rrq: number;
    sv: number;
    srg: number;
    total: number;
  };
}

export class OnboardingService {
  
  /**
   * Transforme les données d'onboarding vers le format UserData
   */
  static transformToUserData(onboardingData: OnboardingData): UserData {
    const currentYear = new Date().getFullYear();
    
    return {
      personal: {
        prenom1: 'Utilisateur',
        prenom2: onboardingData.conjoint ? 'Conjoint' : '',
        naissance1: `${currentYear - onboardingData.age}-01-01`,
        naissance2: onboardingData.conjoint && onboardingData.ageConjoint 
          ? `${currentYear - onboardingData.ageConjoint}-01-01` 
          : '',
        sexe1: 'M', // Par défaut, l'utilisateur pourra modifier
        sexe2: 'F',
        salaire1: onboardingData.salaire,
        salaire2: 0,
        ageRetraiteSouhaite1: onboardingData.ageRetraiteVoulu,
        ageRetraiteSouhaite2: onboardingData.conjoint ? onboardingData.ageRetraiteVoulu : undefined,
        depensesRetraite: onboardingData.depensesActuelles,
        depensesMensuelles: onboardingData.depensesActuelles / 12,
        depensesAnnuelles: onboardingData.depensesActuelles,
        
        // Détection automatique des revenus
        typeRevenu1: 'salaire',
        typeEmploi1: 'permanent',
        secteurActivite1: this.mapSecteurToSecteurActivite(onboardingData.secteur),
        niveauCompetences1: 'intermediaire'
      },
      
      retirement: {
        rrqAgeActuel1: onboardingData.age,
        rrqMontantActuel1: this.estimateRRQAmount(onboardingData.salaire, onboardingData.age),
        rrqMontant70_1: this.estimateRRQAmount(onboardingData.salaire, 70),
        esperanceVie1: this.estimateLifeExpectancy(onboardingData.age),
        rrqAgeActuel2: onboardingData.conjoint ? onboardingData.ageConjoint || onboardingData.age : 0,
        rrqMontantActuel2: onboardingData.conjoint ? this.estimateRRQAmount(onboardingData.salaire * 0.8, onboardingData.ageConjoint || onboardingData.age) : 0,
        rrqMontant70_2: onboardingData.conjoint ? this.estimateRRQAmount(onboardingData.salaire * 0.8, 70) : 0,
        esperanceVie2: onboardingData.conjoint ? this.estimateLifeExpectancy(onboardingData.ageConjoint || onboardingData.age) : 0,
        
        // RREGOP détecté automatiquement
        rregopMembre1: onboardingData.secteur === 'gouvernement' ? 'oui' : 'non',
        rregopAnnees1: onboardingData.anneesREEROPEstimees || onboardingData.anneesService,
        rregopTypeRegime1: onboardingData.secteur === 'gouvernement' ? 'RREGOP' : undefined,
        rregopAnneesServiceCalcul1: onboardingData.anneesREEROPEstimees || onboardingData.anneesService,
        rregopSalaireActuel1: onboardingData.salaire,
        rregopAgePleineRente1: 61,
        rregopMontantPleineRente1: this.estimateRREGOPAmount(onboardingData.salaire, onboardingData.anneesREEROPEstimees || onboardingData.anneesService),
        rregopCoordinationRRQ1: 0.4, // 40% de coordination par défaut
        rregopIndexation1: 0.02, // 2% d'indexation par défaut
        rregopRenteConjointSurvivant1: 50,
        
        // RREGOP conjoint si applicable
        rregopMembre2: onboardingData.conjoint && onboardingData.secteur === 'gouvernement' ? 'oui' : 'non',
        rregopAnnees2: onboardingData.conjoint ? (onboardingData.anneesREEROPEstimees || onboardingData.anneesService) : 0,
        rregopTypeRegime2: onboardingData.conjoint && onboardingData.secteur === 'gouvernement' ? 'RREGOP' : undefined,
        rregopAnneesServiceCalcul2: onboardingData.conjoint ? (onboardingData.anneesREEROPEstimees || onboardingData.anneesService) : 0,
        rregopSalaireActuel2: onboardingData.conjoint ? onboardingData.salaire * 0.8 : 0,
        rregopAgePleineRente2: 61,
        rregopMontantPleineRente2: onboardingData.conjoint ? this.estimateRREGOPAmount(onboardingData.salaire * 0.8, onboardingData.anneesREEROPEstimees || onboardingData.anneesService) : 0,
        rregopCoordinationRRQ2: 0.4,
        rregopIndexation2: 0.02,
        rregopRenteConjointSurvivant2: 50,
        
        // Sécurité de la vieillesse
        svMontant1: 717.15, // Montant mensuel 2025
        svMontant2: onboardingData.conjoint ? 717.15 : 0,
        svRevenus1: onboardingData.salaire,
        svRevenus2: onboardingData.conjoint ? onboardingData.salaire * 0.8 : 0,
        svAgeDebut1: 65,
        svAgeDebut2: 65
      },
      
      savings: {
        reer1: this.estimateREERBalance(onboardingData.salaire, onboardingData.age),
        reer2: onboardingData.conjoint ? this.estimateREERBalance(onboardingData.salaire * 0.8, onboardingData.ageConjoint || onboardingData.age) : 0,
        celi1: this.estimateCELIBalance(onboardingData.salaire, onboardingData.age),
        celi2: onboardingData.conjoint ? this.estimateCELIBalance(onboardingData.salaire * 0.8, onboardingData.ageConjoint || onboardingData.age) : 0,
        placements1: this.estimateNonRegisteredBalance(onboardingData.salaire, onboardingData.age),
        placements2: onboardingData.conjoint ? this.estimateNonRegisteredBalance(onboardingData.salaire * 0.8, onboardingData.ageConjoint || onboardingData.age) : 0,
        epargne1: 10000, // Épargne de précaution
        epargne2: onboardingData.conjoint ? 10000 : 0,
        cri1: 0,
        cri2: 0,
        residenceValeur: 0, // L'utilisateur pourra préciser
        residenceHypotheque: 0
      },
      
      cashflow: {
        logement: onboardingData.depensesActuelles * 0.35, // 35% pour le logement
        servicesPublics: onboardingData.depensesActuelles * 0.10,
        assurances: onboardingData.depensesActuelles * 0.08,
        telecom: onboardingData.depensesActuelles * 0.05,
        alimentation: onboardingData.depensesActuelles * 0.15,
        transport: onboardingData.depensesActuelles * 0.12,
        sante: onboardingData.depensesActuelles * 0.08,
        loisirs: onboardingData.depensesActuelles * 0.07,
        epargne: onboardingData.depensesActuelles * 0.20,
        placements: onboardingData.depensesActuelles * 0.15
      }
    };
  }
  
  /**
   * Détecte automatiquement l'éligibilité aux prestations
   */
  static detectBenefitsEligibility(onboardingData: OnboardingData): {
    srg: boolean;
    rregop: boolean;
    rrq: boolean;
  } {
    return {
      srg: this.detectSRGEligibility(onboardingData),
      rregop: onboardingData.secteur === 'gouvernement',
      rrq: true // Tout le monde est admissible au RRQ
    };
  }
  
  /**
   * Détecte l'éligibilité au SRG
   */
  private static detectSRGEligibility(onboardingData: OnboardingData): boolean {
    // SRG éligible si revenu de retraite < 25 000$ et âge >= 65
    return onboardingData.revenuRetraiteVoulu < 25000 && onboardingData.age >= 65;
  }
  
  /**
   * Estime le montant RRQ
   */
  private static estimateRRQAmount(salary: number, age: number): number {
    const maxRRQ = 1364.60; // Montant maximum 2025
    const salaryRatio = Math.min(salary / 68500, 1); // Ratio par rapport au MGA 2025
    
    if (age >= 65) {
      return maxRRQ * salaryRatio;
    } else if (age >= 60) {
      const reduction = (65 - age) * 0.006; // 0.6% par mois d'anticipation
      return maxRRQ * salaryRatio * (1 - reduction);
    } else {
      return 0; // Pas encore admissible
    }
  }
  
  /**
   * Estime le montant RREGOP
   */
  private static estimateRREGOPAmount(salary: number, yearsOfService: number): number {
    const rate = 0.02; // 2% par année de service
    return salary * rate * yearsOfService;
  }
  
  /**
   * Estime l'espérance de vie
   */
  private static estimateLifeExpectancy(age: number): number {
    if (age < 50) return 85;
    if (age < 60) return 87;
    if (age < 70) return 89;
    return 90;
  }
  
  /**
   * Estime le solde REER
   */
  private static estimateREERBalance(salary: number, age: number): number {
    const contribution = Math.min(salary * 0.18, 32490); // 18% du salaire, max 32 490$
    const years = Math.max(age - 25, 0);
    const returnRate = 0.06; // 6% de rendement
    
    return contribution * ((Math.pow(1 + returnRate, years) - 1) / returnRate);
  }
  
  /**
   * Estime le solde CELI
   */
  private static estimateCELIBalance(salary: number, age: number): number {
    const annualContribution = 7000; // Contribution annuelle CELI
    const years = Math.max(age - 25, 0);
    const returnRate = 0.06;
    
    return annualContribution * ((Math.pow(1 + returnRate, years) - 1) / returnRate);
  }
  
  /**
   * Estime le solde non enregistré
   */
  private static estimateNonRegisteredBalance(salary: number, age: number): number {
    const savingsRate = 0.15; // 15% d'épargne
    const annualSavings = salary * savingsRate;
    const years = Math.max(age - 25, 0);
    const returnRate = 0.05; // 5% de rendement (plus conservateur)
    
    return annualSavings * ((Math.pow(1 + returnRate, years) - 1) / returnRate);
  }
  
  /**
   * Mappe le secteur vers le secteur d'activité
   */
  private static mapSecteurToSecteurActivite(secteur: string): string {
    switch (secteur) {
      case 'gouvernement': return 'Secteur public';
      case 'prive': return 'Secteur privé';
      case 'autonome': return 'Travailleur autonome';
      default: return 'Secteur privé';
    }
  }
  
  /**
   * Génère des recommandations personnalisées
   */
  static generateRecommendations(userData: UserData): string[] {
    const recommendations: string[] = [];
    
    // Recommandations RREGOP
    if (userData.retirement?.rregopMembre1 === 'oui') {
      recommendations.push('🏛️ Analysez votre RREGOP pour optimiser l\'âge de retraite et la coordination RRQ');
      recommendations.push('📊 Calculez les pénalités d\'anticipation vs bonifications de report');
    }
    
    // Recommandations SRG
    if (userData.retirement?.srgEligibilite1) {
      recommendations.push('🛡️ Optimisez vos revenus pour maximiser le Supplément de Revenu Garanti');
      recommendations.push('💡 Considérez des stratégies de décaissement REER pour rester sous le seuil SRG');
    }
    
    // Recommandations générales
    if (userData.personal?.ageRetraiteSouhaite1 && userData.personal.ageRetraiteSouhaite1 < 65) {
      recommendations.push('⏰ Analysez l\'impact financier de la retraite anticipée sur vos prestations');
    }
    
    if (userData.savings?.reer1 && userData.savings.reer1 > 100000) {
      recommendations.push('💰 Planifiez vos décaissements REER pour optimiser la fiscalité à la retraite');
    }
    
    return recommendations;
  }
  
  /**
   * Calcule les revenus estimés à la retraite
   */
  static calculateEstimatedIncome(userData: UserData): {
    rregop: number;
    rrq: number;
    sv: number;
    srg: number;
    total: number;
  } {
    const rregop = (userData.retirement?.rregopMontantPleineRente1 || 0) + 
                   (userData.retirement?.rregopMontantPleineRente2 || 0);
    
    const rrq = (userData.retirement?.rrqMontantActuel1 || 0) * 12 + 
                (userData.retirement?.rrqMontantActuel2 || 0) * 12;
    
    const sv = (userData.retirement?.svMontant1 || 0) * 12 + 
               (userData.retirement?.svMontant2 || 0) * 12;
    
    // Estimation SRG basée sur les revenus
    const totalOtherIncome = rregop + rrq + sv;
    const srg = totalOtherIncome < 23712 ? Math.max(0, 11928 - totalOtherIncome * 0.5) : 0;
    
    return {
      rregop,
      rrq,
      sv,
      srg,
      total: rregop + rrq + sv + srg
    };
  }
}
