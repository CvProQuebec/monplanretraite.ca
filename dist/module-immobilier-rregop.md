// ===== SERVICE PRINCIPAL : RealEstateOptimizationService.ts =====

export interface RealEstateProperty {
  // Données de base
  valeurMarchande: number;
  coutBaseAjuste: number; // CBA pour calcul fiscal
  amortissementCumule: number;
  anneeAcquisition: number;
  typeProprieteDuplex: 'DUPLEX' | 'TRIPLEX' | 'IMMEUBLE' | 'LOGEMENT_SOUS_SOL';
  
  // Revenus et dépenses
  revenusLocatifsAnnuels: number;
  depensesAnnuelles: {
    entretien: number;
    taxes: number;
    assurances: number;
    hypotheque: number;
    gestion: number;
    autres: number;
  };
  
  // Projections
  appreciationAnnuelle: number; // % estimation
  augmentationLoyersAnnuelle: number; // % estimation
}

export interface RREGOPContext {
  // Info employé gouvernement
  anneesCotisees: number;
  salaireAnnuelMoyen: number;
  ageActuel: number;
  ageRetraitePrevu: number;
  
  // Capacité de rachat
  anneesManquantes: number;
  coutRachatParAnnee: number;
  impactPensionViagere: number; // $ mensuel ajouté par année rachetée
}

export interface SaleScenario {
  nom: string;
  type: 'COMPTANT' | 'RESERVE_ETALEE' | 'ECHANGE_44';
  
  // Calculs fiscaux
  gainEnCapital: number;
  recupAmortissement: number;
  impotTotalDu: number;
  liquiditeNette: number;
  
  // Étalement si applicable
  nombreAnneesEtalement?: number;
  economieImpotEtalement?: number;
  
  // Réinvestissement
  strategies: ReinvestmentStrategy[];
}

export interface ReinvestmentStrategy {
  nom: string;
  type: 'RREGOP_RACHAT' | 'REER_CELI' | 'PORTEFEUILLE' | 'MIXTE';
  montantAlloue: number;
  rendementEscompte: number;
  avantagesFiscaux: string[];
  risques: string[];
}

export class RealEstateOptimizationService {
  
  /**
   * ÉTAPE 1 : Analyse complète de la propriété à revenus
   */
  static analyzeProperty(property: RealEstateProperty): PropertyAnalysis {
    // Calculs de rendement actuels
    const revenusNets = property.revenusLocatifsAnnuels - this.calculateTotalExpenses(property.depensesAnnuelles);
    const rendementBrut = (property.revenusLocatifsAnnuels / property.valeurMarchande) * 100;
    const rendementNet = (revenusNets / property.valeurMarchande) * 100;
    
    // Flux de trésorerie après impôts (approximatif)
    const impotEstimeSurRevenus = revenusNets * 0.35; // Taux marginal moyen employé govt
    const fluxTresorerieApresImpot = revenusNets - impotEstimeSurRevenus;
    
    // Calcul plus-value potentielle
    const plusValueBrute = property.valeurMarchande - property.coutBaseAjuste;
    const recupAmortissement = Math.min(property.amortissementCumule, plusValueBrute);
    const gainEnCapitalNet = Math.max(0, plusValueBrute - property.amortissementCumule);
    
    // Projections 10 ans
    const projections = this.calculatePropertyProjections(property, 10);
    
    return {
      rendements: {
        brut: rendementBrut,
        net: rendementNet,
        apresImpot: (fluxTresorerieApresImpot / property.valeurMarchande) * 100
      },
      fiscalite: {
        plusValueBrute,
        recupAmortissement,
        gainEnCapitalNet,
        gainEnCapitalImposable: gainEnCapitalNet * 0.5, // 50% imposable
        impotEstimVente: this.calculateSaleTaxes(property)
      },
      projections,
      recommandations: this.generatePropertyRecommendations(property, projections)
    };
  }
  
  /**
   * ÉTAPE 2 : Génération des scénarios de vente optimisée
   */
  static generateSaleScenarios(
    property: RealEstateProperty, 
    rregopContext: RREGOPContext,
    utilisateur: { ageActuel: number; tauxMarginal: number }
  ): SaleScenario[] {
    
    const scenarios: SaleScenario[] = [];
    
    // SCÉNARIO 1 : Vente comptant immédiate
    const comptant = this.calculateComptantSale(property, utilisateur.tauxMarginal);
    scenarios.push(comptant);
    
    // SCÉNARIO 2 : Vente avec réserve étalée (si avantageux)
    if (this.isReserveWorthwhile(property, utilisateur.tauxMarginal)) {
      scenarios.push(...this.calculateReserveSales(property, utilisateur.tauxMarginal));
    }
    
    // SCÉNARIO 3 : Échange d'article 44 (si applicable)
    if (this.isArticle44Applicable(property)) {
      scenarios.push(this.calculateArticle44Exchange(property));
    }
    
    return scenarios.sort((a, b) => b.liquiditeNette - a.liquiditeNette);
  }
  
  /**
   * ÉTAPE 3 : Stratégies de réinvestissement optimisées
   */
  static generateReinvestmentStrategies(
    liquiditeDisponible: number,
    rregopContext: RREGOPContext,
    utilisateur: {
      ageActuel: number;
      capaciteREER: number;
      capaciteCELI: number;
      tauxMarginal: number;
      toleranceRisque: 'CONSERVATEUR' | 'MODERE' | 'AGRESSIF';
    }
  ): ReinvestmentStrategy[] {
    
    const strategies: ReinvestmentStrategy[] = [];
    
    // STRATÉGIE 1 : Maximisation RREGOP (priorité #1)
    if (rregopContext.anneesManquantes > 0) {
      const montantRachatMax = Math.min(
        liquiditeDisponible,
        rregopContext.anneesManquantes * rregopContext.coutRachatParAnnee
      );
      
      strategies.push({
        nom: 'Rachat d\'années RREGOP',
        type: 'RREGOP_RACHAT',
        montantAlloue: montantRachatMax,
        rendementEscompte: this.calculateRREGOPReturn(rregopContext),
        avantagesFiscaux: [
          'Déduction fiscale immédiate',
          'Pension viagère garantie à vie',
          'Indexation selon IPC',
          'Prestations aux survivants'
        ],
        risques: ['Aucun - garanti par le gouvernement']
      });
    }
    
    // STRATÉGIE 2 : Optimisation REER/CELI
    const soldeApresRREGOP = liquiditeDisponible - (strategies[0]?.montantAlloue || 0);
    if (soldeApresRREGOP > 0) {
      strategies.push(...this.optimizeREERCELI(soldeApresRREGOP, utilisateur));
    }
    
    // STRATÉGIE 3 : Portefeuille diversifié pour le reste
    const soldeRestant = soldeApresRREGOP - this.getTotalREERCELI(strategies);
    if (soldeRestant > 0) {
      strategies.push(this.createPortfolioStrategy(soldeRestant, utilisateur));
    }
    
    return strategies;
  }
  
  /**
   * ÉTAPE 4 : Simulation et comparaison de scénarios
   */
  static runScenarioComparison(
    property: RealEstateProperty,
    scenarios: SaleScenario[],
    rregopContext: RREGOPContext,
    utilisateur: any,
    horizonAnnees: number = 20
  ): ScenarioComparison {
    
    // Scénario A : Conservation immobilier
    const conservationScenario = this.simulatePropertyConservation(property, horizonAnnees);
    
    // Scénarios B, C, D : Vente et réinvestissement
    const reinvestmentScenarios = scenarios.map(scenario => 
      this.simulateReinvestmentScenario(scenario, rregopContext, utilisateur, horizonAnnees)
    );
    
    // Calcul VAN (Valeur Actualisée Nette)
    const tauxActualisation = 0.04; // 4% conservateur
    const allScenarios = [conservationScenario, ...reinvestmentScenarios].map(scenario => ({
      ...scenario,
      vanTotale: this.calculateNPV(scenario.fluxFinanciers, tauxActualisation),
      scoreSecurite: this.calculateSecurityScore(scenario),
      scoreLiquidite: this.calculateLiquidityScore(scenario)
    }));
    
    // Recommandation basée sur profil utilisateur
    const recommandation = this.selectBestScenario(allScenarios, utilisateur);
    
    return {
      scenarios: allScenarios,
      recommandation,
      metriques: {
        meilleureVAN: Math.max(...allScenarios.map(s => s.vanTotale)),
        plusSecure: allScenarios.find(s => s.scoreSecurite === Math.max(...allScenarios.map(x => x.scoreSecurite))),
        plusLiquide: allScenarios.find(s => s.scoreLiquidite === Math.max(...allScenarios.map(x => x.scoreLiquidite)))
      },
      analyse: this.generateComparativeAnalysis(allScenarios)
    };
  }
  
  /**
   * ÉTAPE 5 : Plan d'exécution concret
   */
  static generateExecutionPlan(
    scenario: SaleScenario,
    strategies: ReinvestmentStrategy[],
    utilisateur: any
  ): ExecutionPlan {
    
    const plan: ExecutionPlan = {
      phases: [],
      checklist: [],
      timeline: [],
      contacts: []
    };
    
    // PHASE 1 : Préparation (0-3 mois)
    plan.phases.push({
      nom: 'Phase Préparatoire',
      duree: '0-3 mois',
      actions: [
        'Obtenir évaluation immobilière certifiée',
        'Calculer coût de base ajusté précis avec comptable',
        'Consulter fiscaliste spécialisé immobilier',
        'Contacter RREGOP pour estimation rachat d\'années',
        'Préparer documents juridiques de vente'
      ],
      couts: 2500, // Évaluation + conseils
      critiques: ['Évaluation', 'Calcul CBA', 'Conseils fiscaux']
    });
    
    // PHASE 2 : Exécution (3-6 mois)  
    plan.phases.push({
      nom: 'Phase d\'Exécution',
      duree: '3-6 mois',
      actions: [
        'Mise en marché ou négociation directe',
        'Finaliser stratégie fiscale (réserve vs comptant)',
        'Préparer demande de rachat RREGOP',
        'Coordonner fermeture et transferts'
      ],
      couts: 15000, // Commissions, frais légaux
      critiques: ['Timing fiscal', 'Coordination RREGOP']
    });
    
    // PHASE 3 : Réinvestissement (6-12 mois)
    plan.phases.push({
      nom: 'Phase de Réinvestissement',
      duree: '6-12 mois',
      actions: [
        'Exécuter rachat d\'années RREGOP',
        'Déployer capitaux dans REER/CELI selon plan',
        'Mettre en place portefeuille diversifié',
        'Réviser planification fiscale annuelle'
      ],
      couts: 1000, // Frais de gestion, conseils
      critiques: ['Respect des échéances RREGOP', 'Optimisation fiscale continue']
    });
    
    // Checklist détaillée
    plan.checklist = this.generateDetailedChecklist(scenario, strategies);
    
    return plan;
  }
  
  // ===== MÉTHODES UTILITAIRES PRIVÉES =====
  
  private static calculateTotalExpenses(depenses: any): number {
    return Object.values(depenses).reduce((sum: number, val: any) => sum + (val || 0), 0);
  }
  
  private static calculateSaleTaxes(property: RealEstateProperty): number {
    const plusValue = property.valeurMarchande - property.coutBaseAjuste;
    const recupAmortissement = Math.min(property.amortissementCumule, plusValue);
    const gainCapital = Math.max(0, plusValue - property.amortissementCumule);
    
    // Récupération amortissement = 100% imposable
    // Gain capital = 50% imposable
    // Taux marginal moyen employé gouvernement = 35%
    const impotRecup = recupAmortissement * 0.35;
    const impotGainCapital = (gainCapital * 0.5) * 0.35;
    
    return impotRecup + impotGainCapital;
  }
  
  private static calculateRREGOPReturn(rregopContext: RREGOPContext): number {
    // Calcul du rendement actuariel d'un rachat d'année RREGOP
    const coutTotal = rregopContext.coutRachatParAnnee;
    const bonificationMensuelle = rregopContext.impactPensionViagere;
    const bonificationAnnuelle = bonificationMensuelle * 12;
    
    // Rendement = (Bonification annuelle / Coût) * 100
    // Typiquement entre 8-12% selon l'âge
    return (bonificationAnnuelle / coutTotal) * 100;
  }
  
  private static isReserveWorthwhile(property: RealEstateProperty, tauxMarginal: number): boolean {
    // La réserve est avantageuse si elle réduit significativement le taux d'imposition
    const impotComptant = this.calculateSaleTaxes(property);
    const impotEtaleSur10Ans = this.calculateReserveTaxes(property, 10, tauxMarginal);
    
    return impotEtaleSur10Ans < (impotComptant * 0.85); // 15% d'économie minimum
  }
  
  private static calculateReserveTaxes(property: RealEstateProperty, nbAnnees: number, tauxMarginal: number): number {
    const plusValue = property.valeurMarchande - property.coutBaseAjuste;
    const gainAnnuel = plusValue / nbAnnees;
    
    // Taux réduit possible si étalement diminue le taux marginal
    const tauxReduit = tauxMarginal > 0.40 ? tauxMarginal * 0.85 : tauxMarginal;
    
    return gainAnnuel * tauxReduit * nbAnnees;
  }
}

// ===== TYPES D'INTERFACE =====

interface PropertyAnalysis {
  rendements: {
    brut: number;
    net: number;
    apresImpot: number;
  };
  fiscalite: {
    plusValueBrute: number;
    recupAmortissement: number;
    gainEnCapitalNet: number;
    gainEnCapitalImposable: number;
    impotEstimVente: number;
  };
  projections: any;
  recommandations: string[];
}

interface ScenarioComparison {
  scenarios: any[];
  recommandation: any;
  metriques: any;
  analyse: string[];
}

interface ExecutionPlan {
  phases: ExecutionPhase[];
  checklist: ChecklistItem[];
  timeline: TimelineItem[];
  contacts: Contact[];
}

interface ExecutionPhase {
  nom: string;
  duree: string;
  actions: string[];
  couts: number;
  critiques: string[];
}

interface ChecklistItem {
  tache: string;
  responsable: string;
  echeance: string;
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'COMPLETE';
  priorite: 'CRITIQUE' | 'IMPORTANTE' | 'NORMALE';
}

interface TimelineItem {
  date: string;
  evenement: string;
  type: 'MILESTONE' | 'ACTION' | 'DEADLINE';
}

interface Contact {
  type: 'EVALUATEUR' | 'COMPTABLE' | 'NOTAIRE' | 'COURTIER' | 'RREGOP';
  nom: string;
  specialite: string;
  telephone?: string;
  importance: 'ESSENTIEL' | 'RECOMMANDE' | 'OPTIONNEL';
}