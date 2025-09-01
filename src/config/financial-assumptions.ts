/**
 * Hypothèses financières centralisées - Normes IPF 2025
 * 
 * Source: Institut de planification financière et Conseil des normes de FP Canada
 * Version: Normes d'hypothèses de projection 2025 (Avril 2025)
 * 
 * Ces hypothèses sont utilisées pour tous les calculs de projections financières
 * et garantissent la cohérence avec les standards professionnels.
 */

export const FINANCIAL_ASSUMPTIONS = {
  // === HYPOTHÈSES IPF 2025 (avant frais) ===
  
  /** Taux d'inflation annuel - 2,1% */
  INFLATION: 0.021,
  
  /** Rendement placements court terme - 2,4% */
  COURT_TERME: 0.024,
  
  /** Rendement titres à revenu fixe - 3,4% */
  REVENU_FIXE: 0.034,
  
  /** Rendement actions canadiennes - 6,6% */
  ACTIONS_CANADIENNES: 0.066,
  
  /** Rendement actions américaines - 6,6% */
  ACTIONS_AMERICAINES: 0.066,
  
  /** Rendement actions internationales - 6,9% */
  ACTIONS_INTERNATIONALES: 0.069,
  
  /** Rendement actions marchés émergents - 8,0% */
  ACTIONS_EMERGENTS: 0.080,
  
  /** Taux d'emprunt de référence - 4,4% */
  TAUX_EMPRUNT: 0.044,
  
  /** Croissance salaires/MGAP/MGA (inflation + 1%) - 3,1% */
  CROISSANCE_SALAIRE: 0.031,
  
  // === PARAMÈTRES MONTE CARLO IPF ===
  
  /** Paramètres pour simulations Monte Carlo conformes IPF */
  MONTE_CARLO: {
    /** Inflation moyenne pour simulations */
    INFLATION_MEAN: 0.021,
    /** Écart-type inflation (basé sur historique canadien) */
    INFLATION_STD: 0.008,
    /** Inflation minimum */
    INFLATION_MIN: 0.005,
    /** Inflation maximum */
    INFLATION_MAX: 0.060,
    
    /** Actions canadiennes - moyenne géométrique IPF */
    STOCKS_CAN_MEAN: 0.066,
    /** Actions canadiennes - écart-type */
    STOCKS_CAN_STD: 0.16,
    /** Actions canadiennes - minimum */
    STOCKS_CAN_MIN: -0.45,
    /** Actions canadiennes - maximum */
    STOCKS_CAN_MAX: 0.35,
    
    /** Obligations - moyenne géométrique IPF */
    BONDS_MEAN: 0.034,
    /** Obligations - écart-type */
    BONDS_STD: 0.045,
    /** Obligations - minimum */
    BONDS_MIN: -0.15,
    /** Obligations - maximum */
    BONDS_MAX: 0.25,
    
    /** Marge de sécurité actions (pour conversion géométrique->arithmétique) */
    EQUITY_SAFETY_MARGIN: 0.005 // 0.5%
  },
  
  // === ALLOCATIONS DE RÉFÉRENCE ===
  
  /** Allocations suggérées par âge (pour calculs par défaut) */
  ALLOCATIONS_PAR_AGE: {
    /** Moins de 40 ans - allocation agressive */
    JEUNE: {
      actions: 0.80,
      obligations: 0.15,
      liquidites: 0.05
    },
    /** 40-55 ans - allocation modérée */
    MOYEN: {
      actions: 0.65,
      obligations: 0.30,
      liquidites: 0.05
    },
    /** Plus de 55 ans - allocation conservatrice */
    SENIOR: {
      actions: 0.45,
      obligations: 0.45,
      liquidites: 0.10
    }
  },
  
  // === MÉTADONNÉES ===
  
  /** Source officielle des hypothèses */
  SOURCE: "Normes d'hypothèses de projection IPF 2025",
  
  /** Version du document source */
  VERSION_SOURCE: "Avril 2025",
  
  /** Version de ce module */
  VERSION_MODULE: "2025.1.0",
  
  /** Date de dernière mise à jour */
  DATE_MAJ: "2025-01-09",
  
  /** Mention pour rapports et documentation */
  MENTION_CONFORMITE: "Calculs basés sur les Normes d'hypothèses de projection IPF 2025",
  
  /** Mention complète pour rapports professionnels */
  MENTION_COMPLETE: "Projections préparées en utilisant les Normes d'hypothèses de projection de l'Institut de planification financière et du Conseil des normes de FP Canada (2025)"
};

/**
 * Utilitaires pour conversion et validation
 */
export const FINANCIAL_UTILS = {
  /**
   * Convertit un taux géométrique en taux arithmétique pour Monte Carlo
   * Formule IPF: MA = MG + σ²/2 (+ 0.5% pour actions)
   */
  convertGeometricToArithmetic(geometricRate: number, volatility: number, isEquity: boolean = false): number {
    const varianceAdjustment = Math.pow(volatility, 2) / 2;
    const equityMargin = isEquity ? FINANCIAL_ASSUMPTIONS.MONTE_CARLO.EQUITY_SAFETY_MARGIN : 0;
    return geometricRate + varianceAdjustment + equityMargin;
  },
  
  /**
   * Calcule l'allocation d'actifs recommandée selon l'âge
   */
  getAllocationByAge(age: number) {
    if (age < 40) return FINANCIAL_ASSUMPTIONS.ALLOCATIONS_PAR_AGE.JEUNE;
    if (age < 55) return FINANCIAL_ASSUMPTIONS.ALLOCATIONS_PAR_AGE.MOYEN;
    return FINANCIAL_ASSUMPTIONS.ALLOCATIONS_PAR_AGE.SENIOR;
  },
  
  /**
   * Calcule le rendement pondéré d'un portefeuille
   */
  calculatePortfolioReturn(allocation: { actions: number; obligations: number; liquidites: number }): number {
    return (
      allocation.actions * FINANCIAL_ASSUMPTIONS.ACTIONS_CANADIENNES +
      allocation.obligations * FINANCIAL_ASSUMPTIONS.REVENU_FIXE +
      allocation.liquidites * FINANCIAL_ASSUMPTIONS.COURT_TERME
    );
  },
  
  /**
   * Ajuste un taux pour l'inflation
   */
  adjustForInflation(nominalRate: number): number {
    return nominalRate - FINANCIAL_ASSUMPTIONS.INFLATION;
  },
  
  /**
   * Calcule la croissance réelle (au-dessus de l'inflation)
   */
  getRealGrowthRate(nominalRate: number): number {
    return (1 + nominalRate) / (1 + FINANCIAL_ASSUMPTIONS.INFLATION) - 1;
  }
};

/**
 * Validation des hypothèses (pour debugging et tests)
 */
export const VALIDATION = {
  /**
   * Vérifie que toutes les hypothèses sont dans des plages raisonnables
   */
  validateAssumptions(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const assumptions = FINANCIAL_ASSUMPTIONS;
    
    // Vérifications de base
    if (assumptions.INFLATION < 0 || assumptions.INFLATION > 0.1) {
      errors.push(`Inflation hors plage: ${assumptions.INFLATION}`);
    }
    
    if (assumptions.ACTIONS_CANADIENNES < assumptions.REVENU_FIXE) {
      errors.push('Actions canadiennes devraient avoir un rendement supérieur aux obligations');
    }
    
    if (assumptions.ACTIONS_EMERGENTS < assumptions.ACTIONS_CANADIENNES) {
      errors.push('Actions émergentes devraient avoir un rendement supérieur aux actions canadiennes');
    }
    
    if (assumptions.TAUX_EMPRUNT < assumptions.COURT_TERME) {
      errors.push('Taux d\'emprunt devrait être supérieur au taux court terme');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  /**
   * Compare avec les anciennes hypothèses (pour migration)
   */
  compareWithLegacy(oldAssumptions: any): { changes: Array<{ field: string; old: number; new: number; impact: string }> } {
    const changes = [];
    
    // Comparaisons communes
    const comparisons = [
      { field: 'INFLATION', old: oldAssumptions.inflation || 0.02, new: FINANCIAL_ASSUMPTIONS.INFLATION },
      { field: 'ACTIONS_CANADIENNES', old: oldAssumptions.stockReturn || 0.06, new: FINANCIAL_ASSUMPTIONS.ACTIONS_CANADIENNES },
      { field: 'REVENU_FIXE', old: oldAssumptions.bondReturn || 0.04, new: FINANCIAL_ASSUMPTIONS.REVENU_FIXE }
    ];
    
    for (const comp of comparisons) {
      if (Math.abs(comp.old - comp.new) > 0.001) { // Différence > 0.1%
        const impact = comp.new > comp.old ? 'Projections plus optimistes' : 'Projections plus conservatrices';
        changes.push({
          field: comp.field,
          old: comp.old,
          new: comp.new,
          impact
        });
      }
    }
    
    return { changes };
  }
};

// Export par défaut pour faciliter l'import
export default FINANCIAL_ASSUMPTIONS;
