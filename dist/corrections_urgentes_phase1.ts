// ===== CORRECTIONS URGENTES PHASE 1 =====
// À implémenter immédiatement pour corriger les calculs critiques

// 1. NOUVEAU: Enhanced RRQ Service avec paramètres 2025
// src/features/retirement/services/EnhancedRRQService.ts

export interface RRQParameters2025 {
  // Paramètres officiels 2025
  MGA: 68500; // Maximum des Gains Admissibles 2025
  EXEMPTION_BASE: 3500;
  TAUX_COTISATION_EMPLOYE: 0.0652; // 6.52%
  TAUX_COTISATION_EMPLOYEUR: 0.0652;
  
  // Facteurs d'ajustement 2025 (CORRIGÉS)
  FACTEUR_REDUCTION_MENSUEL: 0.006; // 0.6% par mois avant 65 ans
  FACTEUR_BONIFICATION_MENSUEL: 0.007; // 0.7% par mois après 65 ans (NOUVEAU)
  
  // Âges critiques
  AGE_NORMAL: 65;
  AGE_MINIMUM: 60;
  AGE_MAXIMUM: 72; // NOUVEAU: extension à 72 ans
  
  // Montants maximaux 2025
  PENSION_MAXIMALE_65_ANS: 1364.60; // mensuel
  PENSION_MAXIMALE_72_ANS: 2166.98; // mensuel à 72 ans (NOUVEAU)
}

export interface AdvancedRRQAnalysis extends RRQAnalysis {
  // Nouveaux champs pour analyse avancée
  impactInflation: InflationImpactAnalysis;
  analyseSensibilite: SensitivityAnalysis;
  scenariosAlternatifs: AlternativeScenario[];
  recommandationPersonnalisee: PersonalizedRecommendation;
  riskAnalysis: RRQRiskAnalysis;
}

export interface InflationImpactAnalysis {
  tauxInflationReel: number; // 2.5% réel vs 3% utilisé actuellement
  valeurActuelleAjustee: number;
  impactSur30Ans: number;
  pouvoirAchatProjetete: number;
}

export interface SensitivityAnalysis {
  impactEsperanceVie: { [annees: number]: number };
  impactTauxInflation: { [taux: number]: number };
  seuilRentabilite: number;
  facteursCritiques: CriticalFactor[];
}

export interface AlternativeScenario {
  nom: string;
  ageDebut: number;
  montantMensuel: number;
  valeurActuelleNette: number;
  avantages: string[];
  inconvenients: string[];
}

export interface PersonalizedRecommendation {
  decision: 'COMMENCER_MAINTENANT' | 'ATTENDRE_JUSQU_72' | 'STRATEGIE_FLEXIBLE';
  raisonnement: string[];
  actionsConcretes: ActionItem[];
  timelineOptimal: TimelineStep[];
  niveauConfiance: number; // 0-100%
}

export interface RRQRiskAnalysis {
  risqueLongevite: number; // probabilité de vivre plus longtemps que prévu
  risqueInflation: number; // impact inflation supérieure à 2.5%
  risquePolitique: number; // changements futurs du régime
  strategiesMitigation: RiskMitigationStrategy[];
}

export class EnhancedRRQService extends RRQService {
  
  // Paramètres 2025 mis à jour
  private static readonly PARAMS_2025: RRQParameters2025 = {
    MGA: 68500,
    EXEMPTION_BASE: 3500,
    TAUX_COTISATION_EMPLOYE: 0.0652,
    TAUX_COTISATION_EMPLOYEUR: 0.0652,
    FACTEUR_REDUCTION_MENSUEL: 0.006,
    FACTEUR_BONIFICATION_MENSUEL: 0.007, // CORRIGÉ: était 0.006
    AGE_NORMAL: 65,
    AGE_MINIMUM: 60,
    AGE_MAXIMUM: 72, // NOUVEAU: était 70
    PENSION_MAXIMALE_65_ANS: 1364.60,
    PENSION_MAXIMALE_72_ANS: 2166.98
  };

  // Taux d'inflation réaliste basé sur les transcriptions
  private static readonly TAUX_INFLATION_REEL = 0.025; // 2.5% au lieu de 3%
  
  /**
   * Analyse RRQ avancée avec tous les scénarios 2025
   */
  static analyzeRRQAdvanced(params: {
    ageActuel: number;
    montantActuel: number;
    montant70: number;
    montant72: number; // NOUVEAU
    esperanceVie: number;
    sexe: 'M' | 'F';
    situationFinanciere: 'URGENTE' | 'STABLE' | 'CONFORTABLE';
    autrePension?: number;
    conjointRRQ?: number;
  }): AdvancedRRQAnalysis {
    
    const { ageActuel, montantActuel, montant70, montant72, esperanceVie } = params;
    
    // Analyse de base existante
    const baseAnalysis = this.analyzeRRQ(params);
    
    // Calculs avancés pour 72 ans
    const total72 = this.calculatePresentValue(
      montant72,
      ageActuel,
      esperanceVie,
      72
    );
    
    // Impact de l'inflation réaliste
    const impactInflation = this.analyzeInflationImpact(
      montantActuel,
      ageActuel,
      esperanceVie
    );
    
    // Analyse de sensibilité
    const analyseSensibilite = this.performSensitivityAnalysis(params);
    
    // Scénarios alternatifs (60, 65, 67, 70, 72 ans)
    const scenariosAlternatifs = this.generateAlternativeScenarios(params);
    
    // Recommandation personnalisée basée sur situation
    const recommandationPersonnalisee = this.generatePersonalizedRecommendation(
      params,
      baseAnalysis,
      scenariosAlternatifs
    );
    
    // Analyse des risques
    const riskAnalysis = this.analyzeRRQRisks(params, esperanceVie);
    
    return {
      ...baseAnalysis,
      impactInflation,
      analyseSensibilite,
      scenariosAlternatifs,
      recommandationPersonnalisee,
      riskAnalysis
    };
  }
  
  /**
   * Calcule l'impact réel de l'inflation (2.5% vs 3%)
   */
  private static analyzeInflationImpact(
    montantActuel: number,
    ageActuel: number,
    esperanceVie: number
  ): InflationImpactAnalysis {
    
    const anneesRetraite = esperanceVie - ageActuel;
    
    // Comparaison 2.5% vs 3% d'inflation
    const valeurActuelle25 = this.calculatePresentValue(
      montantActuel,
      ageActuel,
      esperanceVie,
      ageActuel,
      0.025
    );
    
    const valeurActuelle30 = this.calculatePresentValue(
      montantActuel,
      ageActuel,
      esperanceVie,
      ageActuel,
      0.03
    );
    
    const difference = valeurActuelle25 - valeurActuelle30;
    
    // Pouvoir d'achat dans 30 ans
    const pouvoirAchat30Ans = montantActuel / Math.pow(1.025, 30);
    
    return {
      tauxInflationReel: 2.5,
      valeurActuelleAjustee: valeurActuelle25,
      impactSur30Ans: difference,
      pouvoirAchatProjetete: pouvoirAchat30Ans
    };
  }
  
  /**
   * Analyse de sensibilité multi-facteurs
   */
  private static performSensitivityAnalysis(params: any): SensitivityAnalysis {
    const { ageActuel, montantActuel, esperanceVie } = params;
    
    // Impact espérance de vie (+/- 5 ans)
    const impactEsperanceVie: { [annees: number]: number } = {};
    for (let delta = -5; delta <= 5; delta++) {
      const nouvelleEsperance = esperanceVie + delta;
      impactEsperanceVie[nouvelleEsperance] = this.calculatePresentValue(
        montantActuel,
        ageActuel,
        nouvelleEsperance,
        ageActuel
      );
    }
    
    // Impact taux d'inflation (1.5% à 4%)
    const impactTauxInflation: { [taux: number]: number } = {};
    const tauxTests = [0.015, 0.02, 0.025, 0.03, 0.035, 0.04];
    tauxTests.forEach(taux => {
      impactTauxInflation[taux * 100] = this.calculatePresentValue(
        montantActuel,
        ageActuel,
        esperanceVie,
        ageActuel,
        taux
      );
    });
    
    // Seuil de rentabilité précis
    const seuilRentabilite = this.calculateBreakEvenAge(params);
    
    return {
      impactEsperanceVie,
      impactTauxInflation,
      seuilRentabilite,
      facteursCritiques: [
        {
          nom: 'Espérance de vie',
          impactParAnnee: (impactEsperanceVie[esperanceVie + 1] - impactEsperanceVie[esperanceVie - 1]) / 2,
          sensibilite: 'HAUTE'
        },
        {
          nom: 'Taux d\'inflation',
          impactParPourcent: (impactTauxInflation[3.5] - impactTauxInflation[2.5]) / 1,
          sensibilite: 'MOYENNE'
        }
      ]
    };
  }
  
  /**
   * Génère des scénarios alternatifs pour tous les âges possibles
   */
  private static generateAlternativeScenarios(params: any): AlternativeScenario[] {
    const { ageActuel, montantActuel, montant70, montant72, esperanceVie } = params;
    
    const scenarios: AlternativeScenario[] = [];
    
    // Scénario: Commencer maintenant
    if (ageActuel >= 60) {
      scenarios.push({
        nom: 'Commencer immédiatement',
        ageDebut: ageActuel,
        montantMensuel: montantActuel,
        valeurActuelleNette: this.calculatePresentValue(montantActuel, ageActuel, esperanceVie, ageActuel),
        avantages: [
          'Revenus immédiats',
          'Sécurité garantie',
          'Pas de risque politique'
        ],
        inconvenients: [
          'Montant réduit à vie',
          'Moins d\'optimisation fiscale'
        ]
      });
    }
    
    // Scénario: Attendre 65 ans (âge normal)
    if (ageActuel < 65) {
      const montant65 = this.calculateMontantSelonAge(montantActuel, 65);
      scenarios.push({
        nom: 'Attendre l\'âge normal (65 ans)',
        ageDebut: 65,
        montantMensuel: montant65,
        valeurActuelleNette: this.calculatePresentValue(montant65, ageActuel, esperanceVie, 65),
        avantages: [
          'Pension pleine sans réduction',
          'Équilibre risque/rendement'
        ],
        inconvenients: [
          'Années sans revenu RRQ',
          'Risque de changements futurs'
        ]
      });
    }
    
    // Scénario: Reporter à 70 ans
    if (ageActuel < 70) {
      scenarios.push({
        nom: 'Reporter à 70 ans',
        ageDebut: 70,
        montantMensuel: montant70,
        valeurActuelleNette: this.calculatePresentValue(montant70, ageActuel, esperanceVie, 70),
        avantages: [
          'Pension maximisée',
          'Bonification de 42%'
        ],
        inconvenients: [
          'Risque de longévité',
          'Perte si décès prématuré'
        ]
      });
    }
    
    // NOUVEAU: Scénario 72 ans
    if (ageActuel < 72) {
      scenarios.push({
        nom: 'Reporter à 72 ans (NOUVEAU)',
        ageDebut: 72,
        montantMensuel: montant72,
        valeurActuelleNette: this.calculatePresentValue(montant72, ageActuel, esperanceVie, 72),
        avantages: [
          'Pension maximale absolue',
          'Bonification de 58.8%'
        ],
        inconvenients: [
          'Risque de longévité élevé',
          'Nombreuses années sans RRQ'
        ]
      });
    }
    
    return scenarios.sort((a, b) => b.valeurActuelleNette - a.valeurActuelleNette);
  }
  
  /**
   * Recommandation personnalisée basée sur la situation
   */
  private static generatePersonalizedRecommendation(
    params: any,
    baseAnalysis: RRQAnalysis,
    scenarios: AlternativeScenario[]
  ): PersonalizedRecommendation {
    
    const { ageActuel, situationFinanciere, esperanceVie, sexe } = params;
    const esperanceVieMoyenne = sexe === 'M' ? 82 : 86;
    
    let decision: PersonalizedRecommendation['decision'];
    let raisonnement: string[] = [];
    let niveauConfiance = 75;
    
    // Logique de décision basée sur les transcriptions d'experts
    if (situationFinanciere === 'URGENTE') {
      decision = 'COMMENCER_MAINTENANT';
      raisonnement = [
        'Votre situation financière nécessite des revenus immédiats',
        'La sécurité prime sur l\'optimisation',
        'Risque réduit vs gains potentiels futurs'
      ];
      niveauConfiance = 90;
    } else if (esperanceVie > esperanceVieMoyenne + 3) {
      decision = 'ATTENDRE_JUSQU_72';
      raisonnement = [
        'Votre espérance de vie élevée favorise le report',
        'Gain substantiel en valeur actualisée',
        'Bonification maximale justifiée'
      ];
      niveauConfiance = 85;
    } else if (esperanceVie < esperanceVieMoyenne - 3) {
      decision = 'COMMENCER_MAINTENANT';
      raisonnement = [
        'Espérance de vie plus courte favorise le début immédiat',
        'Réduction du risque de longévité',
        'Maximisation des années de perception'
      ];
      niveauConfiance = 80;
    } else {
      decision = 'STRATEGIE_FLEXIBLE';
      raisonnement = [
        'Situation équilibrée - plusieurs options viables',
        'Considérer une approche graduelle',
        'Réévaluer annuellement selon la situation'
      ];
      niveauConfiance = 70;
    }
    
    const actionsConcretes: ActionItem[] = [
      {
        priorite: 'HAUTE',
        action: 'Vérifier votre relevé de participation RRQ',
        delai: '1 semaine',
        impact: 'Validation des montants estimés'
      },
      {
        priorite: 'MOYENNE',
        action: 'Calculer vos besoins de revenus de retraite',
        delai: '2 semaines',
        impact: 'Déterminer l\'urgence des revenus RRQ'
      },
      {
        priorite: 'MOYENNE',
        action: 'Évaluer vos autres sources de revenus',
        delai: '1 mois',
        impact: 'Optimiser la stratégie globale'
      }
    ];
    
    return {
      decision,
      raisonnement,
      actionsConcretes,
      timelineOptimal: [],
      niveauConfiance
    };
  }
  
  /**
   * Calcule le montant RRQ selon l'âge avec les nouveaux facteurs 2025
   */
  private static calculateMontantSelonAge(montantBase65: number, age: number): number {
    if (age === 65) return montantBase65;
    
    if (age < 65) {
      const moisReduction = (65 - age) * 12;
      const facteurReduction = moisReduction * this.PARAMS_2025.FACTEUR_REDUCTION_MENSUEL;
      return montantBase65 * (1 - facteurReduction);
    } else {
      const moisBonification = (age - 65) * 12;
      const facteurBonification = moisBonification * this.PARAMS_2025.FACTEUR_BONIFICATION_MENSUEL;
      return montantBase65 * (1 + facteurBonification);
    }
  }
  
  /**
   * Version améliorée du calcul de valeur présente avec inflation ajustable
   */
  private static calculatePresentValue(
    montantMensuel: number,
    ageActuel: number,
    esperanceVie: number,
    ageDebut: number,
    tauxInflation: number = this.TAUX_INFLATION_REEL
  ): number {
    let valeurActualisee = 0;
    const anneesTotal = esperanceVie - ageActuel;
    
    for (let annee = 0; annee < anneesTotal; annee++) {
      const ageAnnee = ageActuel + annee;
      
      if (ageAnnee >= ageDebut) {
        const montantAnnuel = montantMensuel * 12;
        const facteurActualisation = Math.pow(1 + tauxInflation, annee);
        valeurActualisee += montantAnnuel / facteurActualisation;
      }
    }
    
    return valeurActualisee;
  }
}

// 2. NOUVEAU: Calculateur SV/SRG intégré
// src/features/retirement/services/OASGISService.ts

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

// Types utilitaires
interface CriticalFactor {
  nom: string;
  impactParAnnee?: number;
  impactParPourcent?: number;
  sensibilite: 'FAIBLE' | 'MOYENNE' | 'HAUTE';
}

interface ActionItem {
  priorite: 'HAUTE' | 'MOYENNE' | 'FAIBLE';
  action: string;
  delai: string;
  impact: string;
}

interface TimelineStep {
  age: number;
  action: string;
  rationale: string;
}

interface RiskMitigationStrategy {
  risque: string;
  strategie: string;
  impact: string;
  facilite: 'FACILE' | 'MODERE' | 'DIFFICILE';
}