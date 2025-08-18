// ===== OAS/GIS SERVICE 2025 =====
// Service pour Sécurité de la vieillesse et Supplément de revenu garanti

export interface OASGISCalculation {
  securiteVieillesse: {
    montantMensuel: number;
    ageDebut: number;
    seuil_recuperation: number;
    recuperationPartielle: number;
    recuperationComplete: number;
  };
  supplementRevenuGaranti: {
    montantMensuel: number;
    seuilRevenu: number;
    eligible: boolean;
    combinaisonOptimale: boolean;
  };
  optimisationCombinaison: {
    strategieRecommandee: string;
    impactFiscal: number;
    revenuNetProjecte: number;
  };
}

export class OASGISService {
  // Paramètres SV 2025
  private static readonly SV_MONTANT_MAX_2025 = 717.15; // mensuel
  private static readonly SV_SEUIL_RECUPERATION_2025 = 90997; // annuel
  private static readonly SV_SEUIL_RECUPERATION_COMPLETE_2025 = 148451;
  
  // Paramètres SRG 2025
  private static readonly SRG_MONTANT_MAX_2025 = 1065.47; // mensuel pour personne seule
  private static readonly SRG_SEUIL_REVENUE_MAX_2025 = 21456; // annuel
  
  /**
   * Calcule SV + SRG optimisé selon la situation
   */
  static calculateOASGIS(params: {
    age: number;
    revenuAnnuel: number;
    statutConjoint: 'SEUL' | 'MARIE' | 'CONJOINT_FAIT';
    revenuConjoint?: number;
    anneesResidence: number;
  }): OASGISCalculation {
    
    // Calcul Sécurité de la vieillesse
    const montantSVBase = this.calculateOASAmount(params.anneesResidence);
    const recuperationSV = this.calculateOASClawback(params.revenuAnnuel, params.age);
    const montantSVNet = Math.max(0, montantSVBase - recuperationSV);
    
    // Calcul Supplément de revenu garanti
    const srgCalculation = this.calculateGISAmount(
      params.revenuAnnuel,
      params.statutConjoint,
      params.revenuConjoint
    );
    
    return {
      securiteVieillesse: {
        montantMensuel: montantSVNet,
        ageDebut: params.age >= 65 ? params.age : 65,
        seuil_recuperation: this.SV_SEUIL_RECUPERATION_2025,
        recuperationPartielle: recuperationSV,
        recuperationComplete: this.SV_SEUIL_RECUPERATION_COMPLETE_2025
      },
      supplementRevenuGaranti: srgCalculation,
      optimisationCombinaison: this.optimizeOASGISCombination(
        montantSVNet,
        srgCalculation,
        params.revenuAnnuel
      )
    };
  }
  
  private static calculateOASAmount(anneesResidence: number): number {
    // Pension complète après 40 ans de résidence
    const proportionResidence = Math.min(anneesResidence / 40, 1);
    return this.SV_MONTANT_MAX_2025 * proportionResidence;
  }
  
  private static calculateOASClawback(revenuAnnuel: number, age: number): number {
    const seuil = age >= 75 
      ? 153771  // Seuil plus élevé pour 75+
      : this.SV_SEUIL_RECUPERATION_2025;
      
    if (revenuAnnuel <= seuil) return 0;
    
    const tauxRecuperation = 0.15; // 15%
    const revenuDepasse = revenuAnnuel - seuil;
    return Math.min(
      revenuDepasse * tauxRecuperation / 12, // mensuel
      this.SV_MONTANT_MAX_2025
    );
  }
  
  private static calculateGISAmount(
    revenuAnnuel: number,
    statutConjoint: string,
    revenuConjoint?: number
  ): any {
    const revenuTotal = revenuAnnuel + (revenuConjoint || 0);
    const seuilSRG = statutConjoint === 'SEUL' 
      ? this.SRG_SEUIL_REVENUE_MAX_2025 
      : this.SRG_SEUIL_REVENUE_MAX_2025 * 1.32; // Ajustement couples
    
    const eligible = revenuTotal <= seuilSRG;
    
    if (!eligible) {
      return {
        montantMensuel: 0,
        seuilRevenu: seuilSRG,
        eligible: false,
        combinaisonOptimale: false
      };
    }
    
    // Calcul du montant SRG selon le revenu
    const montantMax = statutConjoint === 'SEUL' 
      ? this.SRG_MONTANT_MAX_2025 
      : this.SRG_MONTANT_MAX_2025 * 0.6;
      
    const tauxReduction = 0.5; // 50 cents par dollar de revenu
    const reduction = revenuTotal * tauxReduction / 12;
    const montantMensuel = Math.max(0, montantMax - reduction);
    
    return {
      montantMensuel,
      seuilRevenu: seuilSRG,
      eligible: true,
      combinaisonOptimale: montantMensuel > 0
    };
  }
  
  private static optimizeOASGISCombination(
    montantSV: number,
    srgCalculation: any,
    revenuAnnuel: number
  ): any {
    const revenuNetMensuel = montantSV + srgCalculation.montantMensuel;
    
    // Si éligible au SRG, ne pas reporter la SV
    const strategieRecommandee = srgCalculation.eligible 
      ? 'Commencer SV immédiatement à 65 ans - pas de bonification avec SRG'
      : 'Considérer reporter SV pour bonification si revenus élevés';
      
    return {
      strategieRecommandee,
      impactFiscal: montantSV * 12 * 0.15, // SV imposable, SRG non-imposable
      revenuNetProjecte: revenuNetMensuel
    };
  }
}
