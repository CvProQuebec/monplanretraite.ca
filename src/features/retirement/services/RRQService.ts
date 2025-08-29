// src/features/retirement/services/RRQService.ts
export interface RRQAnalysis {
  personneId: 1 | 2;
  ageActuel: number;
  montantMensuelActuel: number;
  montantMensuel70: number;
  esperanceVie: number;
  
  // Résultats de l'analyse
  totalSiCommenceMaintenant: number;
  totalSiAttend70: number;
  montantPerduEnAttendant: number;
  ageRentabilite: number;
  valeurActualiseeMaintenant: number;
  valeurActualisee70: number;
  recommandation: 'COMMENCER_MAINTENANT' | 'ATTENDRE_70' | 'NEUTRE';
  differenceValeurActualisee: number;
  pourcentageGainPerte: number;
}

export class RRQService {
  private static readonly TAUX_ACTUALISATION = 0.03; // 3% d'inflation
  private static readonly ESPERANCE_VIE_DEFAUT_HOMME = 82;
  private static readonly ESPERANCE_VIE_DEFAUT_FEMME = 86;
  
  /**
   * Calcule l'optimisation RRQ pour une personne
   */
  static analyzeRRQ(params: {
    ageActuel: number;
    montantActuel: number;
    montant70: number;
    esperanceVie: number;
    sexe: 'M' | 'F';
  }): RRQAnalysis {
    const { ageActuel, montantActuel, montant70, esperanceVie } = params;
    
    // Si la personne a déjà 70 ans ou plus
    if (ageActuel >= 70) {
      return this.createAnalysisForAge70Plus(params);
    }
    
    // Calculs principaux
    const anneesRestantesMaintenant = esperanceVie - ageActuel;
    const anneesRestantes70 = esperanceVie - 70;
    const anneesAttente = 70 - ageActuel;
    
    // Total brut
    const totalMaintenant = montantActuel * 12 * anneesRestantesMaintenant;
    const total70 = montant70 * 12 * anneesRestantes70;
    const montantPerdu = montantActuel * 12 * anneesAttente;
    
    // Calcul du point de rentabilité
    const gainMensuel = montant70 - montantActuel;
    const moisPourRecuperer = gainMensuel > 0 ? montantPerdu / gainMensuel : Infinity;
    const ageRentabilite = 70 + (moisPourRecuperer / 12);
    
    // Valeurs actualisées
    const valeurActualiseeMaintenant = this.calculatePresentValue(
      montantActuel,
      ageActuel,
      esperanceVie,
      ageActuel
    );
    
    const valeurActualisee70 = this.calculatePresentValue(
      montant70,
      ageActuel,
      esperanceVie,
      70
    );
    
    // Déterminer la recommandation
    const difference = valeurActualiseeMaintenant - valeurActualisee70;
    const pourcentageDiff = (Math.abs(difference) / valeurActualiseeMaintenant) * 100;
    
    let recommandation: RRQAnalysis['recommandation'];
    if (pourcentageDiff < 5) {
      recommandation = 'NEUTRE';
    } else if (difference > 0) {
      recommandation = 'COMMENCER_MAINTENANT';
    } else {
      recommandation = 'ATTENDRE_70';
    }
    
    return {
      personneId: 1,
      ageActuel,
      montantMensuelActuel: montantActuel,
      montantMensuel70: montant70,
      esperanceVie,
      totalSiCommenceMaintenant: totalMaintenant,
      totalSiAttend70: total70,
      montantPerduEnAttendant: montantPerdu,
      ageRentabilite,
      valeurActualiseeMaintenant,
      valeurActualisee70,
      recommandation,
      differenceValeurActualisee: Math.abs(difference),
      pourcentageGainPerte: pourcentageDiff
    };
  }
  
  /**
   * Calcule la valeur actualisée des prestations RRQ
   */
  private static calculatePresentValue(
    montantMensuel: number,
    ageActuel: number,
    esperanceVie: number,
    ageDebut: number
  ): number {
    let valeurActualisee = 0;
    const anneesTotal = esperanceVie - ageActuel;
    
    for (let annee = 0; annee < anneesTotal; annee++) {
      const ageAnnee = ageActuel + annee;
      
      if (ageAnnee >= ageDebut) {
        const montantAnnuel = montantMensuel * 12;
        const facteurActualisation = Math.pow(1 + this.TAUX_ACTUALISATION, annee);
        valeurActualisee += montantAnnuel / facteurActualisation;
      }
    }
    
    return valeurActualisee;
  }
  
  /**
   * Cas spécial : personne déjà 70 ans ou plus
   */
  private static createAnalysisForAge70Plus(params: any): RRQAnalysis {
    const { ageActuel, montantActuel, esperanceVie } = params;
    const anneesRestantes = esperanceVie - ageActuel;
    const totalRestant = montantActuel * 12 * anneesRestantes;
    
    return {
      personneId: 1,
      ageActuel,
      montantMensuelActuel: montantActuel,
      montantMensuel70: montantActuel,
      esperanceVie,
      totalSiCommenceMaintenant: totalRestant,
      totalSiAttend70: totalRestant,
      montantPerduEnAttendant: 0,
      ageRentabilite: ageActuel,
      valeurActualiseeMaintenant: totalRestant,
      valeurActualisee70: totalRestant,
      recommandation: 'COMMENCER_MAINTENANT',
      differenceValeurActualisee: 0,
      pourcentageGainPerte: 0
    };
  }
  
  /**
   * Génère des recommandations textuelles personnalisées
   */
  static generateRecommendations(analysis: RRQAnalysis): string[] {
    const recommendations: string[] = [];
    
    if (analysis.recommandation === 'COMMENCER_MAINTENANT') {
      recommendations.push(
        `✅ Commencer vos prestations RRQ maintenant est la meilleure option`,
        `💰 Vous gagnerez ${this.formatCurrency(analysis.differenceValeurActualisee)} en valeur actualisée`,
        `📊 C'est ${analysis.pourcentageGainPerte.toFixed(1)}% plus avantageux que d'attendre`
      );
      
      if (analysis.ageRentabilite > analysis.esperanceVie) {
        recommendations.push(
          `⚠️ Le point de rentabilité (${Math.round(analysis.ageRentabilite)} ans) dépasse votre espérance de vie`
        );
      }
    } else if (analysis.recommandation === 'ATTENDRE_70') {
      recommendations.push(
        `⏸️ Attendre jusqu'à 70 ans pourrait être plus avantageux`,
        `💰 Vous pourriez gagner ${this.formatCurrency(analysis.differenceValeurActualisee)} en valeur actualisée`,
        `📈 Vos prestations mensuelles augmenteront de ${((analysis.montantMensuel70 / analysis.montantMensuelActuel - 1) * 100).toFixed(1)}%`
      );
      
      if (analysis.ageRentabilite < 80) {
        recommendations.push(
          `✅ Vous atteindrez le point de rentabilité à ${Math.round(analysis.ageRentabilite)} ans`
        );
      }
    } else {
      recommendations.push(
        `⚖️ Les deux options sont pratiquement équivalentes`,
        `💡 La différence est inférieure à 5% en valeur actualisée`,
        `🎯 Considérez vos besoins de liquidités immédiats`
      );
    }
    
    return recommendations;
  }
  
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0
    }).format(amount);
  }
}