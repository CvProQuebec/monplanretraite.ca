// ===== SERVICE PARAMÈTRES FISCAUX 2025 =====
// Basé sur les nouveaux documents "Finances - *.txt"

export interface TaxParameters2025 {
  // Plafonds de cotisation mis à jour
  reerPlafond: number; // Augmentation vs 2024
  celiPlafond: number;  // Maintenu
  
  // Seuils PSV critiques
  psvSeuilRecuperationPartielle: number;   // Début récupération
  psvSeuilRecuperationComplete: number;   // Perte totale 65-74 ans
  psvSeuilRecuperationComplete75Plus: number; // Perte totale 75+ ans
  
  // Crédit en raison de l'âge
  creditAgeSeuilRevenu: number;
  creditAgeReductionTaux: number; // 15% de réduction
  
  // Taux marginaux Québec 2025
  tauxMarginauxCombines: {
    tranche1: { min: number; max: number; taux: number };
    tranche2: { min: number; max: number; taux: number };
    tranche3: { min: number; max: number; taux: number };
    tranche4: { min: number; max: number; taux: number };
  };
}

export interface REERCELIRecommendation {
  recommandation: 'REER_PRIORITE' | 'CELI_PRIORITE' | 'EQUILIBRE' | 'REER_CONJOINT';
  raisonnement: string[];
  repartitionSuggeree: {
    reerPart: number;
    celiPart: number;
    justification: string;
  };
  impactFiscal: {
    economieImmediateREER: number;
    impactFuturREER: number;
    avantageNetREER: number;
    impactPSV: number;
  };
  strategiesComplementaires: string[];
}

export interface WithdrawalStrategy {
  sequencePhases: WithdrawalPhase[];
  impactFiscalTotal: number;
  flexibiliteScore: number;
  recommendationsSpeciales: string[];
}

export interface WithdrawalPhase {
  ageDebut: number;
  ageFin: number;
  sourcesPrioritaires: string[];
  rationale: string;
  tauxRetrait: number;
  impactFiscal: 'MINIMAL' | 'OPTIMISE' | 'CONTRAINT';
}

export interface FondsSolidariteAnalysis {
  recommandation: 'RECOMMANDE' | 'ACCEPTABLE' | 'NON_RECOMMANDE';
  projections: {
    fondaction: FondsProjection;
    ftq: FondsProjection;
  };
  contraintes: string[];
  eligibilite: boolean;
}

export interface FondsProjection {
  investissementNet: number;
  valeurFinale: number;
  rendementEffectif: number;
  avantageVsREER: number;
}

export class TaxOptimizationService2025 {
  
  private static readonly PARAMS: TaxParameters2025 = {
    reerPlafond: 32490,
    celiPlafond: 7000,
    psvSeuilRecuperationPartielle: 90997,
    psvSeuilRecuperationComplete: 148451,
    psvSeuilRecuperationComplete75Plus: 153771,
    creditAgeSeuilRevenu: 42335,
    creditAgeReductionTaux: 0.15,
    tauxMarginauxCombines: {
      tranche1: { min: 0, max: 51780, taux: 0.2779 },
      tranche2: { min: 51780, max: 103545, taux: 0.3612 },
      tranche3: { min: 103545, max: 126000, taux: 0.4612 },
      tranche4: { min: 126000, max: Infinity, taux: 0.5312 }
    }
  };
  
  /**
   * NOUVEAU: Analyse optimisation REER vs CELI personnalisée
   */
  static analyzeREERvsCELI(params: {
    revenuActuel: number;
    revenuProjetteRetraite: number;
    ageActuel: number;
    ageRetraite: number;
    montantDisponible: number;
    situationConjoint: 'SEUL' | 'COUPLE';
  }): REERCELIRecommendation {
    
    const { revenuActuel, revenuProjetteRetraite, ageActuel, montantDisponible } = params;
    
    // Calcul taux marginal actuel vs futur
    const tauxMarginalActuel = this.calculateTauxMarginal(revenuActuel);
    const tauxMarginalRetraite = this.calculateTauxMarginal(revenuProjetteRetraite);
    
    // Économie fiscale REER immédiate
    const economieREER = montantDisponible * tauxMarginalActuel;
    
    // Impact futur REER (imposition au retrait)
    const impactFiscalFutur = montantDisponible * tauxMarginalRetraite;
    
    // Avantage net REER vs CELI
    const avantageNetREER = economieREER - impactFiscalFutur;
    
    // Calcul seuils PSV
    const impactPSV = this.calculatePSVImpact(revenuProjetteRetraite, montantDisponible);
    
    // Analyse selon la situation
    let recommandation: 'REER_PRIORITE' | 'CELI_PRIORITE' | 'EQUILIBRE' | 'REER_CONJOINT';
    let raisonnement: string[] = [];
    
    if (tauxMarginalActuel > tauxMarginalRetraite + 0.05) {
      recommandation = 'REER_PRIORITE';
      raisonnement = [
        `Taux marginal actuel (${(tauxMarginalActuel*100).toFixed(1)}%) > taux futur (${(tauxMarginalRetraite*100).toFixed(1)}%)`,
        `Économie fiscale immédiate : ${this.formatCurrency(economieREER)}`,
        "Optimisation via déduction fiscale"
      ];
    } else if (revenuProjetteRetraite > this.PARAMS.psvSeuilRecuperationPartielle) {
      recommandation = 'CELI_PRIORITE';
      raisonnement = [
        "Revenu de retraite élevé → risque récupération PSV",
        "CELI ne compte pas comme revenu imposable",
        `Évite la récupération PSV (seuil: ${this.formatCurrency(this.PARAMS.psvSeuilRecuperationPartielle)})`
      ];
    } else {
      recommandation = 'EQUILIBRE';
      raisonnement = [
        "Taux marginaux similaires présent vs futur",
        "Diversification fiscale recommandée",
        "Flexibilité CELI + déduction REER"
      ];
    }
    
    return {
      recommandation,
      raisonnement,
      repartitionSuggeree: this.calculateOptimalSplit(montantDisponible, recommandation),
      impactFiscal: {
        economieImmediateREER: economieREER,
        impactFuturREER: impactFiscalFutur,
        avantageNetREER: avantageNetREER,
        impactPSV: impactPSV
      },
      strategiesComplementaires: this.generateComplementaryStrategies(params)
    };
  }
  
  /**
   * NOUVEAU: Stratégie de décaissement optimisée
   */
  static optimizeWithdrawalSequence(params: {
    ageDebut: number;
    reerValue: number;
    celiValue: number;
    placementsValue: number;
    revenuGaranti: number; // RRQ + PSV
    depensesAnnuelles: number;
    esperanceVie: number;
  }): WithdrawalStrategy {
    
    const { ageDebut, reerValue, celiValue, placementsValue, revenuGaranti, depensesAnnuelles, esperanceVie } = params;
    
    const anneesRetraite = esperanceVie - ageDebut;
    const deficitAnnuel = Math.max(0, depensesAnnuelles - revenuGaranti);
    
    // Stratégie séquentielle basée sur les documents
    const sequence: WithdrawalPhase[] = [];
    
    // Phase 1 (60-65 ans) : Si retraite anticipée
    if (ageDebut < 65) {
      sequence.push({
        ageDebut: ageDebut,
        ageFin: 65,
        sourcesPrioritaires: ['CELI', 'PLACEMENTS_NON_ENREGISTRES'],
        rationale: 'Éviter pénalités REER et préserver revenus garantis futurs',
        tauxRetrait: 0.035,
        impactFiscal: 'MINIMAL'
      });
    }
    
    // Phase 2 (65-71 ans) : Optimisation fiscale
    sequence.push({
      ageDebut: Math.max(ageDebut, 65),
      ageFin: 71,
      sourcesPrioritaires: this.determinePrioriteSources(revenuGaranti + deficitAnnuel),
      rationale: 'Équilibrer sources pour rester sous seuils PSV',
      tauxRetrait: 0.04,
      impactFiscal: 'OPTIMISE'
    });
    
    // Phase 3 (72+ ans) : Décaissement obligatoire FERR
    sequence.push({
      ageDebut: 72,
      ageFin: esperanceVie,
      sourcesPrioritaires: ['FERR', 'CELI_COMPLEMENT'],
      rationale: 'Décaissement FERR obligatoire + CELI pour équilibrer',
      tauxRetrait: 0.0527, // Minimum FERR à 72 ans
      impactFiscal: 'CONTRAINT'
    });
    
    return {
      sequencePhases: sequence,
      impactFiscalTotal: this.calculateTotalTaxImpact(sequence, reerValue),
      flexibiliteScore: this.assessFlexibilityScore(celiValue, reerValue + placementsValue),
      recommendationsSpeciales: this.generateSpecialRecommendations(params)
    };
  }
  
  /**
   * NOUVEAU: Optimisation fonds de solidarité
   */
  static analyzeFondsSolidarite(params: {
    revenuAnnuel: number;
    ageActuel: number;
    ageRetraite: number;
    capaciteEpargne: number;
  }): FondsSolidariteAnalysis {
    
    const { revenuAnnuel, ageActuel, ageRetraite, capaciteEpargne } = params;
    const anneesInvestissement = ageRetraite - ageActuel;
    
    // Données des documents : Fondaction 13.3%, FTQ 13.4% (10 ans)
    const rendementFondaction = 0.133;
    const rendementFTQ = 0.134;
    const creditImpot = 0.30; // 30% crédit d'impôt
    
    // Calcul avec crédit d'impôt intégré
    const investissementNet = capaciteEpargne * (1 - creditImpot); // Coût réel après crédit
    
    // Projection Fondaction
    const valeurFinaleFondaction = investissementNet * Math.pow(1 + rendementFondaction, Math.min(anneesInvestissement, 10));
    
    // Projection FTQ
    const valeurFinaleFTQ = investissementNet * Math.pow(1 + rendementFTQ, Math.min(anneesInvestissement, 10));
    
    // Comparaison avec REER traditionnel (6% rendement)
    const valeurFinaleREERTraditionnel = capaciteEpargne * Math.pow(1.06, anneesInvestissement);
    
    return {
      recommandation: this.evaluateFondsSolidariteViability(revenuAnnuel, anneesInvestissement),
      projections: {
        fondaction: {
          investissementNet,
          valeurFinale: valeurFinaleFondaction,
          rendementEffectif: rendementFondaction,
          avantageVsREER: valeurFinaleFondaction - valeurFinaleREERTraditionnel
        },
        ftq: {
          investissementNet,
          valeurFinale: valeurFinaleFTQ,
          rendementEffectif: rendementFTQ,
          avantageVsREER: valeurFinaleFTQ - valeurFinaleREERTraditionnel
        }
      },
      contraintes: [
        'Immobilisation jusqu\'à la retraite ou 65 ans',
        'Risque de liquidité en cas d\'urgence',
        'Performance liée à l\'économie québécoise'
      ],
      eligibilite: this.checkFondsSolidariteEligibility(revenuAnnuel)
    };
  }
  
  // Méthodes utilitaires
  private static calculateTauxMarginal(revenu: number): number {
    for (const tranche of Object.values(this.PARAMS.tauxMarginauxCombines)) {
      if (revenu >= tranche.min && revenu < tranche.max) {
        return tranche.taux;
      }
    }
    return this.PARAMS.tauxMarginauxCombines.tranche4.taux;
  }
  
  private static calculatePSVImpact(revenuRetraite: number, montantRetrait: number): number {
    const nouveauRevenu = revenuRetraite + montantRetrait;
    
    if (nouveauRevenu <= this.PARAMS.psvSeuilRecuperationPartielle) return 0;
    
    const tauxRecuperation = 0.15;
    const revenuExcedentaire = nouveauRevenu - this.PARAMS.psvSeuilRecuperationPartielle;
    
    return Math.min(
      revenuExcedentaire * tauxRecuperation,
      717.15 * 12 // PSV maximale annuelle
    );
  }
  
  private static calculateOptimalSplit(montantDisponible: number, recommandation: string): any {
    switch (recommandation) {
      case 'REER_PRIORITE':
        return { reerPart: 70, celiPart: 30, justification: 'Priorité aux économies fiscales immédiates' };
      case 'CELI_PRIORITE':
        return { reerPart: 30, celiPart: 70, justification: 'Préservation des prestations gouvernementales' };
      default:
        return { reerPart: 50, celiPart: 50, justification: 'Équilibre entre flexibilité et optimisation fiscale' };
    }
  }
  
  private static generateComplementaryStrategies(params: any): string[] {
    return [
      'Considérer les fonds de solidarité pour crédits d\'impôt',
      'Optimiser la répartition selon l\'âge et la situation familiale',
      'Planifier la conversion REER en FERR à 71 ans'
    ];
  }
  
  private static determinePrioriteSources(revenuTotal: number): string[] {
    if (revenuTotal > 90997) {
      return ['CELI', 'PLACEMENTS_NON_ENREGISTRES', 'REER_MINIMAL'];
    }
    return ['REER_OPTIMISE', 'CELI', 'PLACEMENTS_NON_ENREGISTRES'];
  }
  
  private static calculateTotalTaxImpact(sequence: WithdrawalPhase[], reerValue: number): number {
    return sequence.reduce((total, phase) => {
      if (phase.impactFiscal === 'OPTIMISE') return total + (reerValue * 0.04);
      if (phase.impactFiscal === 'CONTRAINT') return total + (reerValue * 0.0527);
      return total;
    }, 0);
  }
  
  private static assessFlexibilityScore(celiValue: number, totalValue: number): number {
    const ratio = celiValue / totalValue;
    return Math.min(100, Math.round(ratio * 100));
  }
  
  private static generateSpecialRecommendations(params: any): string[] {
    return [
      'Surveiller les seuils PSV annuellement',
      'Ajuster la stratégie selon les changements fiscaux',
      'Consulter un conseiller fiscal pour optimisations complexes'
    ];
  }
  
  private static evaluateFondsSolidariteViability(revenuAnnuel: number, anneesInvestissement: number): 'RECOMMANDE' | 'ACCEPTABLE' | 'NON_RECOMMANDE' {
    if (anneesInvestissement >= 8 && revenuAnnuel > 60000) return 'RECOMMANDE';
    if (anneesInvestissement >= 5 && revenuAnnuel > 40000) return 'ACCEPTABLE';
    return 'NON_RECOMMANDE';
  }
  
  private static checkFondsSolidariteEligibility(revenuAnnuel: number): boolean {
    return revenuAnnuel > 30000; // Seuil minimum pour éligibilité
  }
  
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}
