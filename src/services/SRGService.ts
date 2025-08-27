// src/features/retirement/services/SRGService.ts
// Service pour le Supplément de Revenu Garanti (SRG)
// 100% SÉCURISÉ - AUCUNE TRANSMISSION RÉSEAU

import { UserData } from '../types';

// ===== TYPES SPÉCIFIQUES AU SRG =====

export interface SRGEligibilityData {
  age: number;
  revenuAnnuel: number;
  statutConjoint: 'SEUL' | 'CONJOINT_SANS_SV' | 'CONJOINT_AVEC_SV';
  revenuConjoint?: number;
  anneesResidenceCanada: number;
}

export interface SRGCalculationResult {
  eligible: boolean;
  montantMensuel: number;
  montantAnnuel: number;
  revenuMaximal: number;
  reductionAppliquee: number;
  raisonIneligibilite?: string;
  
  // Détails du calcul
  detailsCalcul: {
    montantMaximal: number;
    revenuCombiné: number;
    tauxReduction: number;
    exemptionBase: number;
  };
  
  // Optimisations possibles
  optimisations: SRGOptimization[];
  
  // Scénarios d'amélioration
  scenarios: SRGScenario[];
}

export interface SRGOptimization {
  type: 'REDUCTION_REVENU' | 'CHANGEMENT_STATUT' | 'TIMING_DEMANDE' | 'FRACTIONNEMENT_REVENU';
  description: string;
  impactPotentiel: number;
  difficulte: 'FACILE' | 'MOYENNE' | 'DIFFICILE';
  actions: string[];
}

export interface SRGScenario {
  nom: string;
  revenuCible: number;
  srgEstime: number;
  gainPotentiel: number;
  faisabilite: 'HAUTE' | 'MOYENNE' | 'FAIBLE';
}

export interface CombinedSRGAnalysis {
  person1: SRGCalculationResult;
  person2?: SRGCalculationResult;
  totalHousehold: {
    srgTotal: number;
    optimisationCombinee: number;
    strategiesCouple: string[];
  };
}

export class SRGService {
  
  // ===== PARAMÈTRES SRG 2025 (GOUVERNEMENT DU CANADA) =====
  
  private static readonly SRG_PARAMETERS_2025 = {
    // Montants maximaux mensuels (octobre 2024 - septembre 2025)
    MAX_MONTHLY_SINGLE: 1065.47,           // Personne seule
    MAX_MONTHLY_SPOUSE_BOTH_SV: 639.94,    // Conjoint avec SV tous les deux
    MAX_MONTHLY_SPOUSE_ONE_SV: 1065.47,    // Un seul conjoint avec SV
    
    // Seuils de revenus annuels (exemptions)
    INCOME_THRESHOLD_SINGLE: 21456,        // Personne seule
    INCOME_THRESHOLD_COUPLE: 28324,        // Couple (combiné)
    
    // Taux de réduction
    REDUCTION_RATE_SINGLE: 0.50,           // 50 cents par dollar
    REDUCTION_RATE_COUPLE: 0.25,           // 25 cents par dollar (par personne)
    
    // Âge d'éligibilité
    ELIGIBILITY_AGE: 65,
    MIN_RESIDENCE_YEARS: 10
  };

  /**
   * FONCTION PRINCIPALE: Analyse SRG complète pour un ménage
   */
  static calculateSRGAnalysis(userData: UserData): CombinedSRGAnalysis {
    try {
      console.log('🔍 Début analyse SRG...');
      
      // Calcul pour la personne 1
      const person1Data = this.extractPersonData(userData, 1);
      const person1Result = this.calculatePersonSRG(person1Data);
      
      // Calcul pour la personne 2 si applicable
      let person2Result: SRGCalculationResult | undefined;
      if (userData.personal.prenom2 && userData.personal.naissance2) {
        const person2Data = this.extractPersonData(userData, 2);
        person2Result = this.calculatePersonSRG(person2Data);
      }
      
      // Analyse combinée pour couples
      const totalHousehold = this.calculateHouseholdSRG(person1Result, person2Result);
      
      console.log('✅ Analyse SRG terminée avec succès');
      
      return {
        person1: person1Result,
        person2: person2Result,
        totalHousehold
      };
      
    } catch (error) {
      console.error('❌ Erreur dans calculateSRGAnalysis:', error);
      throw new Error('Impossible de calculer l\'analyse SRG');
    }
  }

  /**
   * CALCUL SRG POUR UNE PERSONNE INDIVIDUELLE
   */
  private static calculatePersonSRG(personData: SRGEligibilityData): SRGCalculationResult {
    
    // 1. Vérification de l'éligibilité de base
    if (personData.age < this.SRG_PARAMETERS_2025.ELIGIBILITY_AGE) {
      return this.createIneligibleResult(
        'Âge insuffisant',
        `Doit avoir au moins ${this.SRG_PARAMETERS_2025.ELIGIBILITY_AGE} ans`
      );
    }
    
    if (personData.anneesResidenceCanada < this.SRG_PARAMETERS_2025.MIN_RESIDENCE_YEARS) {
      return this.createIneligibleResult(
        'Résidence insuffisante',
        `Doit avoir résidé au Canada pendant au moins ${this.SRG_PARAMETERS_2025.MIN_RESIDENCE_YEARS} ans`
      );
    }
    
    // 2. Détermination du montant maximal selon le statut
    const montantMaximal = this.getMaximumAmount(personData.statutConjoint);
    const seuilRevenu = this.getIncomeThreshold(personData.statutConjoint);
    const tauxReduction = this.getReductionRate(personData.statutConjoint);
    
    // 3. Calcul du revenu combiné
    const revenuCombiné = personData.statutConjoint === 'SEUL' 
      ? personData.revenuAnnuel
      : personData.revenuAnnuel + (personData.revenuConjoint || 0);
    
    // 4. Calcul de la réduction
    const revenuExcedentaire = Math.max(0, revenuCombiné - seuilRevenu);
    const reductionAppliquee = revenuExcedentaire * tauxReduction;
    
    // 5. Calcul du montant final
    const montantAnnuel = Math.max(0, montantMaximal * 12 - reductionAppliquee);
    const montantMensuel = montantAnnuel / 12;
    
    // 6. Détermination de l'éligibilité
    const eligible = montantMensuel > 0;
    
    // 7. Génération des optimisations
    const optimisations = this.generateOptimizations(personData, montantMensuel);
    const scenarios = this.generateScenarios(personData, montantMaximal, seuilRevenu, tauxReduction);
    
    return {
      eligible,
      montantMensuel: Math.round(montantMensuel * 100) / 100,
      montantAnnuel: Math.round(montantAnnuel * 100) / 100,
      revenuMaximal: seuilRevenu,
      reductionAppliquee: Math.round(reductionAppliquee * 100) / 100,
      detailsCalcul: {
        montantMaximal,
        revenuCombiné,
        tauxReduction,
        exemptionBase: seuilRevenu
      },
      optimisations,
      scenarios
    };
  }

  /**
   * CALCUL COMBINÉ POUR COUPLES
   */
  private static calculateHouseholdSRG(
    person1: SRGCalculationResult, 
    person2?: SRGCalculationResult
  ): { srgTotal: number; optimisationCombinee: number; strategiesCouple: string[] } {
    
    const srgTotal = person1.montantMensuel + (person2?.montantMensuel || 0);
    
    if (!person2) {
      return {
        srgTotal,
        optimisationCombinee: 0,
        strategiesCouple: []
      };
    }
    
    // Stratégies d'optimisation pour couples
    const strategiesCouple = [];
    let optimisationCombinee = 0;
    
    // Fractionnement de revenus
    if (person1.detailsCalcul.revenuCombiné > person1.revenuMaximal) {
      strategiesCouple.push('Considérer le fractionnement de revenus entre conjoints');
      optimisationCombinee += this.calculateSplittingBenefit(person1, person2);
    }
    
    // Report de prestations
    if (person1.eligible && person2.eligible) {
      strategiesCouple.push('Optimiser le timing des demandes de SV/SRG');
      optimisationCombinee += 50; // Estimation conservative
    }
    
    // Gestion des retraits REER/FERR
    if (person1.detailsCalcul.revenuCombiné > 25000) {
      strategiesCouple.push('Réviser la stratégie de décaissement REER/FERR');
      optimisationCombinee += 75;
    }
    
    return {
      srgTotal,
      optimisationCombinee,
      strategiesCouple
    };
  }

  /**
   * EXTRACTION DES DONNÉES PERSONNELLES
   */
  private static extractPersonData(userData: UserData, personId: 1 | 2): SRGEligibilityData {
    const isFirstPerson = personId === 1;
    
    const birthDate = isFirstPerson ? userData.personal.naissance1 : userData.personal.naissance2;
    const age = this.calculateAge(birthDate);
    const revenuAnnuel = isFirstPerson ? userData.personal.salaire1 : userData.personal.salaire2;
    
    // Détermination du statut conjugal
    const hasSpouse = userData.personal.prenom2 && userData.personal.naissance2;
    const spouseAge = hasSpouse ? this.calculateAge(userData.personal.naissance2) : 0;
    const spouseSVEligible = spouseAge >= 65;
    
    let statutConjoint: 'SEUL' | 'CONJOINT_SANS_SV' | 'CONJOINT_AVEC_SV';
    if (!hasSpouse) {
      statutConjoint = 'SEUL';
    } else if (spouseSVEligible) {
      statutConjoint = 'CONJOINT_AVEC_SV';
    } else {
      statutConjoint = 'CONJOINT_SANS_SV';
    }
    
    const revenuConjoint = hasSpouse 
      ? (isFirstPerson ? userData.personal.salaire2 : userData.personal.salaire1)
      : 0;
    
    // Années de résidence (par défaut 40 ans si non spécifié)
    const anneesResidenceCanada = isFirstPerson 
      ? userData.personal.anneesResidenceCanada1 || 40
      : userData.personal.anneesResidenceCanada2 || 40;
    
    return {
      age,
      revenuAnnuel,
      statutConjoint,
      revenuConjoint,
      anneesResidenceCanada
    };
  }

  /**
   * FONCTIONS UTILITAIRES
   */
  
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
  
  private static getMaximumAmount(statut: string): number {
    switch (statut) {
      case 'SEUL':
      case 'CONJOINT_SANS_SV':
        return this.SRG_PARAMETERS_2025.MAX_MONTHLY_SINGLE;
      case 'CONJOINT_AVEC_SV':
        return this.SRG_PARAMETERS_2025.MAX_MONTHLY_SPOUSE_BOTH_SV;
      default:
        return 0;
    }
  }
  
  private static getIncomeThreshold(statut: string): number {
    return statut === 'SEUL' 
      ? this.SRG_PARAMETERS_2025.INCOME_THRESHOLD_SINGLE
      : this.SRG_PARAMETERS_2025.INCOME_THRESHOLD_COUPLE;
  }
  
  private static getReductionRate(statut: string): number {
    return statut === 'SEUL'
      ? this.SRG_PARAMETERS_2025.REDUCTION_RATE_SINGLE
      : this.SRG_PARAMETERS_2025.REDUCTION_RATE_COUPLE;
  }
  
  private static createIneligibleResult(raison: string, details: string): SRGCalculationResult {
    return {
      eligible: false,
      montantMensuel: 0,
      montantAnnuel: 0,
      revenuMaximal: 0,
      reductionAppliquee: 0,
      raisonIneligibilite: `${raison}: ${details}`,
      detailsCalcul: {
        montantMaximal: 0,
        revenuCombiné: 0,
        tauxReduction: 0,
        exemptionBase: 0
      },
      optimisations: [],
      scenarios: []
    };
  }

  /**
   * GÉNÉRATION DES OPTIMISATIONS PERSONNALISÉES
   */
  private static generateOptimizations(
    personData: SRGEligibilityData, 
    currentAmount: number
  ): SRGOptimization[] {
    const optimizations: SRGOptimization[] = [];
    
    if (currentAmount === 0 && personData.revenuAnnuel > this.getIncomeThreshold(personData.statutConjoint)) {
      optimizations.push({
        type: 'REDUCTION_REVENU',
        description: 'Réduire les revenus pour devenir éligible au SRG',
        impactPotentiel: this.calculateRevenuReductionBenefit(personData),
        difficulte: 'MOYENNE',
        actions: [
          'Différer les retraits REER/FERR si possible',
          'Réduire les revenus de placements imposables',
          'Considérer des investissements générant des gains en capital'
        ]
      });
    }
    
    if (personData.statutConjoint !== 'SEUL' && currentAmount > 0) {
      optimizations.push({
        type: 'FRACTIONNEMENT_REVENU',
        description: 'Optimiser la répartition des revenus entre conjoints',
        impactPotentiel: 100, // Estimation
        difficulte: 'FACILE',
        actions: [
          'Utiliser le fractionnement de pension à 65 ans',
          'Optimiser les retraits REER entre conjoints',
          'Considérer les prêts entre conjoints'
        ]
      });
    }
    
    if (personData.age >= 60 && personData.age < 65) {
      optimizations.push({
        type: 'TIMING_DEMANDE',
        description: 'Planifier la stratégie avant 65 ans',
        impactPotentiel: 200,
        difficulte: 'FACILE',
        actions: [
          'Prévoir l\'impact du SRG dans la planification',
          'Ajuster les revenus avant 65 ans',
          'Inscription automatique ou demande manuelle'
        ]
      });
    }
    
    return optimizations;
  }

  /**
   * GÉNÉRATION DES SCÉNARIOS D'AMÉLIORATION
   */
  private static generateScenarios(
    personData: SRGEligibilityData,
    maxAmount: number,
    threshold: number,
    reductionRate: number
  ): SRGScenario[] {
    const scenarios: SRGScenario[] = [];
    
    // Scénario 1: Revenu au seuil maximal
    const targetRevenue1 = threshold;
    const srgEstime1 = maxAmount;
    scenarios.push({
      nom: 'Revenu optimal (au seuil)',
      revenuCible: targetRevenue1,
      srgEstime: srgEstime1,
      gainPotentiel: srgEstime1 * 12 - personData.revenuAnnuel,
      faisabilite: personData.revenuAnnuel > targetRevenue1 ? 'MOYENNE' : 'HAUTE'
    });
    
    // Scénario 2: Réduction de 25% du revenu
    if (personData.revenuAnnuel > threshold) {
      const targetRevenue2 = personData.revenuAnnuel * 0.75;
      const srgEstime2 = Math.max(0, maxAmount - (targetRevenue2 - threshold) * reductionRate / 12);
      scenarios.push({
        nom: 'Réduction modérée (25%)',
        revenuCible: targetRevenue2,
        srgEstime: srgEstime2,
        gainPotentiel: srgEstime2 * 12,
        faisabilite: 'MOYENNE'
      });
    }
    
    // Scénario 3: SRG maximal
    scenarios.push({
      nom: 'SRG maximal possible',
      revenuCible: 0,
      srgEstime: maxAmount,
      gainPotentiel: maxAmount * 12,
      faisabilite: 'FAIBLE'
    });
    
    return scenarios;
  }

  /**
   * CALCULS D'OPTIMISATION
   */
  private static calculateRevenuReductionBenefit(personData: SRGEligibilityData): number {
    const maxAmount = this.getMaximumAmount(personData.statutConjoint);
    const threshold = this.getIncomeThreshold(personData.statutConjoint);
    
    if (personData.revenuAnnuel <= threshold) return 0;
    
    const potentialSRG = maxAmount * 12;
    const revenueLoss = personData.revenuAnnuel - threshold;
    
    return Math.max(0, potentialSRG - revenueLoss * 0.5); // Estimation conservative
  }
  
  private static calculateSplittingBenefit(person1: SRGCalculationResult, person2: SRGCalculationResult): number {
    // Calcul simplifié de l'avantage du fractionnement
    const totalRevenu = person1.detailsCalcul.revenuCombiné;
    const optimalSplit = totalRevenu / 2;
    
    // Estimation de l'amélioration du SRG avec fractionnement optimal
    return Math.min(150, totalRevenu * 0.02); // Maximum 150$/mois, 2% du revenu total
  }
  
  /**
   * FONCTION D'ÉVALUATION RAPIDE (pour autres services)
   */
  static quickSRGEvaluation(age: number, annualIncome: number, hasSpouse: boolean): {
    eligible: boolean;
    estimatedMonthly: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  } {
    if (age < 65) {
      return { eligible: false, estimatedMonthly: 0, priority: 'LOW' };
    }
    
    const threshold = hasSpouse 
      ? this.SRG_PARAMETERS_2025.INCOME_THRESHOLD_COUPLE
      : this.SRG_PARAMETERS_2025.INCOME_THRESHOLD_SINGLE;
    
    const maxAmount = hasSpouse
      ? this.SRG_PARAMETERS_2025.MAX_MONTHLY_SPOUSE_BOTH_SV
      : this.SRG_PARAMETERS_2025.MAX_MONTHLY_SINGLE;
    
    if (annualIncome > threshold * 2) {
      return { eligible: false, estimatedMonthly: 0, priority: 'LOW' };
    }
    
    const reductionRate = hasSpouse 
      ? this.SRG_PARAMETERS_2025.REDUCTION_RATE_COUPLE
      : this.SRG_PARAMETERS_2025.REDUCTION_RATE_SINGLE;
    
    const excess = Math.max(0, annualIncome - threshold);
    const reduction = excess * reductionRate;
    const estimatedMonthly = Math.max(0, maxAmount - reduction / 12);
    
    const priority = estimatedMonthly > 500 ? 'HIGH' : estimatedMonthly > 100 ? 'MEDIUM' : 'LOW';
    
    return {
      eligible: estimatedMonthly > 0,
      estimatedMonthly: Math.round(estimatedMonthly),
      priority
    };
  }
}