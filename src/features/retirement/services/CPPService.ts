// src/features/retirement/services/CPPService.ts

import { 
  CPPData, 
  CPPCalculationResult, 
  CPPParameters, 
  CPPContributionYear,
  CPPProjection 
} from '../types/cpp';

export class CPPService {
  // Paramètres officiels CPP 2025
  private static readonly CPP_PARAMS: CPPParameters = {
    montantMaximum2025: 1433.00,    // $/mois selon le site officiel
    montantMoyen2024: 899.67,       // $/mois selon le site officiel
    ageRetraiteStandard: 65,
    ageRetraiteMin: 60,
    ageRetraiteMax: 70,
    facteurReduction: 0.006,         // -0.6% par mois avant 65 ans
    facteurAugmentation: 0.007,      // +0.7% par mois après 65 ans
    gainsMaximum2025: 66600,         // $/an
    gainsExemptes: 3500              // $/an
  };

  /**
   * Calcule la pension CPP complète
   */
  static calculateCPPPension(cppData: CPPData): CPPCalculationResult {
    try {
      // 1. Calculer les gains moyens cotisables
      const gainsMoyens = this.calculateAverageContributableEarnings(cppData);
      
      // 2. Calculer la pension de base à 65 ans
      const pensionBase = this.calculateBasePension(gainsMoyens, cppData);
      
      // 3. Calculer la pension ajustée selon l'âge de retraite
      const pensionAjustee = this.calculateAdjustedPension(
        pensionBase, 
        cppData.personal.dateRetraite,
        cppData.personal.dateNaissance
      );
      
      // 4. Calculer les montants mensuels et annuels
      const montantMensuel = Math.round(pensionAjustee * 100) / 100;
      const montantAnnuel = Math.round(montantMensuel * 12 * 100) / 100;
      
      // 5. Calculer les projections à différents âges
      const projections = this.calculateProjections(pensionBase, cppData);
      
      // 6. Calculer les détails
      const details = {
        anneesCotisation: cppData.personal.anneesCotisation,
        gainsMoyens: Math.round(gainsMoyens * 100) / 100,
        facteurAjustement: this.calculateAdjustmentFactor(
          cppData.personal.dateRetraite,
          cppData.personal.dateNaissance
        ),
        reductionAnticipee: projections.age60,
        augmentationReportee: projections.age70
      };

      return {
        pensionBase: Math.round(pensionBase * 100) / 100,
        pensionAjustee: Math.round(pensionAjustee * 100) / 100,
        montantMensuel,
        montantAnnuel,
        details,
        projections
      };
    } catch (error) {
      console.error('Erreur lors du calcul CPP:', error);
      throw new Error('Erreur dans le calcul de la pension CPP');
    }
  }

  /**
   * Calcule les gains moyens cotisables (excluant les 8 années les plus faibles)
   */
  private static calculateAverageContributableEarnings(cppData: CPPData): number {
    const gains = cppData.personal.gainsAnnuels
      .map(gain => Math.min(gain, this.CPP_PARAMS.gainsMaximum2025))
      .map(gain => Math.max(gain - this.CPP_PARAMS.gainsExemptes, 0))
      .sort((a, b) => b - a); // Tri décroissant
    
    // Exclure les 8 années les plus faibles (ou moins si moins de 39 ans de cotisation)
    const anneesExclues = Math.min(8, Math.max(0, gains.length - 39));
    const gainsCotisables = gains.slice(anneesExclues);
    
    if (gainsCotisables.length === 0) return 0;
    
    const total = gainsCotisables.reduce((sum, gain) => sum + gain, 0);
    return total / gainsCotisables.length;
  }

  /**
   * Calcule la pension de base à 65 ans
   */
  private static calculateBasePension(gainsMoyens: number, cppData: CPPData): number {
    // Formule officielle CPP : 25% des gains moyens cotisables
    const pensionBase = gainsMoyens * 0.25;
    
    // Limiter au maximum CPP 2025
    return Math.min(pensionBase, this.CPP_PARAMS.montantMaximum2025);
  }

  /**
   * Calcule la pension ajustée selon l'âge de retraite
   */
  private static calculateAdjustedPension(
    pensionBase: number, 
    dateRetraite: Date, 
    dateNaissance: Date
  ): number {
    const ageRetraite = this.calculateAge(dateNaissance, dateRetraite);
    const facteurAjustement = this.calculateAdjustmentFactor(dateRetraite, dateNaissance);
    
    return pensionBase * facteurAjustement;
  }

  /**
   * Calcule le facteur d'ajustement selon l'âge de retraite
   */
  private static calculateAdjustmentFactor(dateRetraite: Date, dateNaissance: Date): number {
    const ageRetraite = this.calculateAge(dateNaissance, dateRetraite);
    
    if (ageRetraite === 65) return 1.0;
    
    if (ageRetraite < 65) {
      // Retraite anticipée : réduction de 0.6% par mois
      const moisAvant65 = (65 - ageRetraite) * 12;
      const reduction = moisAvant65 * this.CPP_PARAMS.facteurReduction;
      return Math.max(0.36, 1.0 - reduction); // Minimum 36% à 60 ans
    } else {
      // Retraite reportée : augmentation de 0.7% par mois
      const moisApres65 = (ageRetraite - 65) * 12;
      const augmentation = moisApres65 * this.CPP_PARAMS.facteurAugmentation;
      return Math.min(1.42, 1.0 + augmentation); // Maximum 142% à 70 ans
    }
  }

  /**
   * Calcule les projections à différents âges
   */
  private static calculateProjections(pensionBase: number, cppData: CPPData): any {
    const projections = {
      age60: this.calculatePensionAtAge(pensionBase, 60),
      age65: this.calculatePensionAtAge(pensionBase, 65),
      age70: this.calculatePensionAtAge(pensionBase, 70),
      age75: this.calculatePensionAtAge(pensionBase, 75)
    };
    
    return projections;
  }

  /**
   * Calcule la pension à un âge spécifique
   */
  private static calculatePensionAtAge(pensionBase: number, age: number): number {
    if (age === 65) return pensionBase;
    
    if (age < 65) {
      const moisAvant65 = (65 - age) * 12;
      const reduction = moisAvant65 * this.CPP_PARAMS.facteurReduction;
      const facteur = Math.max(0.36, 1.0 - reduction);
      return Math.round(pensionBase * facteur * 100) / 100;
    } else {
      const moisApres65 = (age - 65) * 12;
      const augmentation = moisApres65 * this.CPP_PARAMS.facteurAugmentation;
      const facteur = Math.min(1.42, 1.0 + augmentation);
      return Math.round(pensionBase * facteur * 100) / 100;
    }
  }

  /**
   * Calcule l'âge entre deux dates
   */
  private static calculateAge(dateNaissance: Date, dateReference: Date): number {
    const diffTime = dateReference.getTime() - dateNaissance.getTime();
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(diffYears);
  }

  /**
   * Valide les données CPP
   */
  static validateCPPData(cppData: CPPData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!cppData.personal.dateNaissance) {
      errors.push('Date de naissance requise');
    }
    
    if (!cppData.personal.dateRetraite) {
      errors.push('Date de retraite requise');
    }
    
    if (!cppData.personal.gainsAnnuels || cppData.personal.gainsAnnuels.length === 0) {
      errors.push('Gains annuels requis');
    }
    
    if (cppData.personal.anneesCotisation < 0) {
      errors.push('Années de cotisation invalides');
    }
    
    const ageRetraite = this.calculateAge(
      cppData.personal.dateNaissance, 
      cppData.personal.dateRetraite
    );
    
    if (ageRetraite < this.CPP_PARAMS.ageRetraiteMin || ageRetraite > this.CPP_PARAMS.ageRetraiteMax) {
      errors.push(`Âge de retraite doit être entre ${this.CPP_PARAMS.ageRetraiteMin} et ${this.CPP_PARAMS.ageRetraiteMax} ans`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Génère des données CPP par défaut
   */
  static generateDefaultCPPData(): CPPData {
    const dateNaissance = new Date(1980, 0, 1); // 1er janvier 1980
    const dateRetraite = new Date(2045, 0, 1); // 1er janvier 2045 (65 ans)
    
    return {
      personal: {
        dateNaissance,
        dateRetraite,
        gainsAnnuels: Array(40).fill(50000), // 50,000 $/an pendant 40 ans
        anneesCotisation: 40,
        paysResidence: 'CA',
        statutConjugal: 'single'
      },
      parameters: {
        ageRetraiteStandard: 65,
        ageRetraiteMin: 60,
        ageRetraiteMax: 70,
        facteurReduction: 0.006,
        facteurAugmentation: 0.007,
        montantMaximum2025: 1433.00,
        montantMoyen2024: 899.67
      },
      calculations: {
        pensionBase: 0,
        pensionAjustee: 0,
        montantMensuel: 0,
        montantAnnuel: 0,
        reductionRetraiteAnticipee: 0,
        augmentationRetraiteReportee: 0
      },
      contributions: {
        annees: [],
        montants: [],
        gains: [],
        totalCotisations: 0
      },
      metadata: {
        dateCalcul: new Date(),
        version: '1.0.0',
        source: 'ESTIMATED'
      }
    };
  }

  /**
   * Obtient les paramètres CPP officiels
   */
  static getCPPParameters(): CPPParameters {
    return { ...this.CPP_PARAMS };
  }

  /**
   * Calcule l'historique des cotisations
   */
  static calculateContributionHistory(cppData: CPPData): CPPContributionYear[] {
    const history: CPPContributionYear[] = [];
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < cppData.personal.gainsAnnuels.length; i++) {
      const annee = currentYear - cppData.personal.gainsAnnuels.length + i + 1;
      const gains = cppData.personal.gainsAnnuels[i];
      const gainsCotisables = Math.max(
        0, 
        Math.min(gains, this.CPP_PARAMS.gainsMaximum2025) - this.CPP_PARAMS.gainsExemptes
      );
      const cotisations = gainsCotisables * 0.0595; // Taux de cotisation CPP 2025
      
      history.push({
        annee,
        gains,
        cotisations: Math.round(cotisations * 100) / 100,
        gainsCotisables: Math.round(gainsCotisables * 100) / 100,
        facteurCotisation: gainsCotisables > 0 ? 1.0 : 0.0
      });
    }
    
    return history;
  }
}
