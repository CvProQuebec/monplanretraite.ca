// ===== SERVICE D'OPTIMISATION IMMOBILIÈRE DE RETRAITE =====
// Intégration complète avec RREGOP et système de retraite existant
// 100 % local - Aucune transmission réseau des données confidentielles

import {
  RealEstateProperty,
  RREGOPContext,
  PropertyAnalysis,
  SaleScenario,
  ReinvestmentStrategy,
  ScenarioComparison,
  ExecutionPlan,
  ExecutionStep,
  Contact,
  Document
} from '@/types/real-estate';

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
        impotEstime: gainEnCapitalNet * 0.5 * 0.35 // 50% imposable * taux marginal
      },
      projections: {
        valeur10ans: projections.valeurFuture,
        revenus10ans: projections.revenusFuturs,
        rendement10ans: projections.rendementFutur
      },
      fluxTresorerie: {
        annuel: revenusNets,
        apresImpot: fluxTresorerieApresImpot,
        mensuel: fluxTresorerieApresImpot / 12
      }
    };
  }
  
  /**
   * ÉTAPE 2 : Génération des scénarios de vente
   */
  static generateSaleScenarios(
    property: RealEstateProperty, 
    rregopContext: RREGOPContext,
    userContext: any
  ): SaleScenario[] {
    const analysis = this.analyzeProperty(property);
    const scenarios: SaleScenario[] = [];
    
    // Scénario 1 : Vente comptant
    const scenarioComptant: SaleScenario = {
      nom: 'Vente Comptant',
      type: 'COMPTANT',
      gainEnCapital: analysis.fiscalite.gainEnCapitalNet,
      recupAmortissement: analysis.fiscalite.recupAmortissement,
      impotTotalDu: analysis.fiscalite.impotEstime,
      liquiditeNette: property.valeurMarchande - analysis.fiscalite.impotEstime,
      strategies: this.generateReinvestmentStrategies(
        property.valeurMarchande - analysis.fiscalite.impotEstime,
        rregopContext,
        userContext
      )
    };
    scenarios.push(scenarioComptant);
    
    // Scénario 2 : Réserve d'épargne étalée (si gain > 100k)
    if (analysis.fiscalite.gainEnCapitalNet > 100000) {
      const scenarioEtale: SaleScenario = {
        nom: 'Réserve d\'Épargne Étalée',
        type: 'RESERVE_ETALEE',
        gainEnCapital: analysis.fiscalite.gainEnCapitalNet,
        recupAmortissement: analysis.fiscalite.recupAmortissement,
        impotTotalDu: analysis.fiscalite.impotEstime * 0.8, // 20% d'économie
        liquiditeNette: property.valeurMarchande - (analysis.fiscalite.impotEstime * 0.8),
        nombreAnneesEtalement: 5,
        economieImpotEtalement: analysis.fiscalite.impotEstime * 0.2,
        strategies: this.generateReinvestmentStrategies(
          property.valeurMarchande - (analysis.fiscalite.impotEstime * 0.8),
          rregopContext,
          userContext
        )
      };
      scenarios.push(scenarioEtale);
    }
    
    // Scénario 3 : Échange 44 (si applicable)
    if (this.isEchange44Eligible(property, userContext)) {
      const scenarioEchange44: SaleScenario = {
        nom: 'Échange 44',
        type: 'ECHANGE_44',
        gainEnCapital: 0, // Report d'impôt
        recupAmortissement: 0, // Report d'impôt
        impotTotalDu: 0, // Report d'impôt
        liquiditeNette: property.valeurMarchande, // Pas d'impôt immédiat
        strategies: this.generateReinvestmentStrategies(
          property.valeurMarchande,
          rregopContext,
          userContext
        )
      };
      scenarios.push(scenarioEchange44);
    }
    
    return scenarios;
  }
  
  /**
   * ÉTAPE 3 : Génération des stratégies de réinvestissement
   */
  static generateReinvestmentStrategies(
    liquiditeDisponible: number,
    rregopContext: RREGOPContext,
    userContext: any
  ): ReinvestmentStrategy[] {
    const strategies: ReinvestmentStrategy[] = [];
    
    // Stratégie 1 : Rachat d'années RREGOP (priorité)
    if (rregopContext.anneesManquantes > 0 && liquiditeDisponible >= rregopContext.coutRachatParAnnee) {
      const anneesAchetees = Math.min(
        rregopContext.anneesManquantes,
        Math.floor(liquiditeDisponible / rregopContext.coutRachatParAnnee)
      );
      
      const strategyRREGOP: ReinvestmentStrategy = {
        nom: `Rachat RREGOP (${anneesAchetees} années)`,
        type: 'RREGOP_RACHAT',
        montantAlloue: anneesAchetees * rregopContext.coutRachatParAnnee,
        rendementEscompte: 8.5, // Rendement RREGOP garanti
        avantagesFiscaux: [
          'Déduction d\'impôt immédiate',
          'Pension viagère garantie',
          'Indexation automatique',
          'Protection contre l\'inflation'
        ],
        risques: ['Aucun - Garantie gouvernementale'],
        impactRetraite: {
          pensionAnnuelle: anneesAchetees * rregopContext.impactPensionViagere * 12,
          ageRetraite: rregopContext.ageRetraitePrevu,
          securiteFinanciere: 10 // Maximum
        }
      };
      strategies.push(strategyRREGOP);
    }
    
    // Stratégie 2 : REER/CELI
    const montantRestant = liquiditeDisponible - (strategies[0]?.montantAlloue || 0);
    if (montantRestant > 0) {
      const strategyREER: ReinvestmentStrategy = {
        nom: 'REER/CELI Mixte',
        type: 'REER_CELI',
        montantAlloue: montantRestant * 0.6, // 60% REER
        rendementEscompte: 6.5,
        avantagesFiscaux: [
          'Déduction d\'impôt REER',
          'Croissance à l\'abri de l\'impôt CELI',
          'Flexibilité de retrait'
        ],
        risques: ['Volatilité des marchés', 'Taux de rendement variable'],
        impactRetraite: {
          pensionAnnuelle: montantRestant * 0.6 * 0.04, // 4% de retrait
          ageRetraite: rregopContext.ageRetraitePrevu,
          securiteFinanciere: 7
        }
      };
      strategies.push(strategyREER);
    }
    
    // Stratégie 3 : Portefeuille diversifié
    if (montantRestant > 0) {
      const strategyPortefeuille: ReinvestmentStrategy = {
        nom: 'Portefeuille Diversifié',
        type: 'PORTEFEUILLE',
        montantAlloue: montantRestant * 0.4, // 40% portefeuille
        rendementEscompte: 7.0,
        avantagesFiscaux: [
          'Diversification géographique',
          'Croissance à long terme',
          'Liquidité'
        ],
        risques: ['Volatilité', 'Risque de marché', 'Inflation'],
        impactRetraite: {
          pensionAnnuelle: montantRestant * 0.4 * 0.05, // 5% de retrait
          ageRetraite: rregopContext.ageRetraitePrevu + 2, // Retraite plus tard
          securiteFinanciere: 6
        }
      };
      strategies.push(strategyPortefeuille);
    }
    
    return strategies;
  }
  
  /**
   * ÉTAPE 4 : Comparaison des scénarios
   */
  static compareScenarios(scenarios: SaleScenario[]): ScenarioComparison {
    if (scenarios.length === 0) {
      return {
        scenarios: [],
        meilleurScenario: {} as SaleScenario,
        analyseRisque: { liquidite: 0, fiscalite: 0, rendement: 0, securite: 0 },
        recommandation: 'Aucun scénario disponible'
      };
    }
    
    // Calcul des scores pour chaque scénario
    const scoredScenarios = scenarios.map(scenario => {
      const liquiditeScore = Math.min(10, (scenario.liquiditeNette / 100000) * 10);
      const fiscaliteScore = Math.max(1, 10 - (scenario.impotTotalDu / 50000) * 10);
      const rendementScore = this.calculateRendementScore(scenario);
      const securiteScore = this.calculateSecuriteScore(scenario);
      
      const scoreTotal = (liquiditeScore + fiscaliteScore + rendementScore + securiteScore) / 4;
      
      return { ...scenario, scoreTotal };
    });
    
    // Tri par score total
    scoredScenarios.sort((a, b) => (b.scoreTotal || 0) - (a.scoreTotal || 0));
    const meilleurScenario = scoredScenarios[0];
    
    return {
      scenarios: scoredScenarios,
      meilleurScenario,
      analyseRisque: {
        liquidite: Math.min(10, (meilleurScenario.liquiditeNette / 100000) * 10),
        fiscalite: Math.max(1, 10 - (meilleurScenario.impotTotalDu / 50000) * 10),
        rendement: this.calculateRendementScore(meilleurScenario),
        securite: this.calculateSecuriteScore(meilleurScenario)
      },
      recommandation: this.generateRecommendation(meilleurScenario)
    };
  }
  
  /**
   * ÉTAPE 5 : Plan d'exécution détaillé
   */
  static generateExecutionPlan(
    scenarioChoisi: SaleScenario,
    property: RealEstateProperty
  ): ExecutionPlan {
    const etapes: ExecutionStep[] = [
      {
        ordre: 1,
        titre: 'Évaluation de la propriété',
        description: 'Obtenir une évaluation professionnelle à jour',
        duree: '2-3 semaines',
        responsable: 'Évaluateur immobilier',
        statut: 'A_FAIRE',
        notes: 'Important pour optimiser le prix de vente'
      },
      {
        ordre: 2,
        titre: 'Consultation fiscale',
        description: 'Analyser les implications fiscales avec un expert-comptable',
        duree: '1-2 semaines',
        responsable: 'Comptable/Conseiller fiscal',
        statut: 'A_FAIRE',
        notes: 'Optimiser la stratégie de vente'
      },
      {
        ordre: 3,
        titre: 'Préparation de la vente',
        description: 'Mise en marché et préparation des documents',
        duree: '4-8 semaines',
        responsable: 'Courtier immobilier',
        statut: 'A_FAIRE',
        notes: 'Inclure les améliorations mineures si rentables'
      },
      {
        ordre: 4,
        titre: 'Négociation et vente',
        description: 'Processus de vente et finalisation',
        duree: '2-4 semaines',
        responsable: 'Courtier immobilier',
        statut: 'A_FAIRE',
        notes: 'Négocier les conditions optimales'
      },
      {
        ordre: 5,
        titre: 'Réinvestissement RREGOP',
        description: 'Procéder au rachat d\'années RREGOP',
        duree: '2-4 semaines',
        responsable: 'Conseiller RREGOP',
        statut: 'A_FAIRE',
        notes: 'Priorité absolue - délais stricts'
      },
      {
        ordre: 6,
        titre: 'Placement des fonds restants',
        description: 'Exécuter la stratégie de réinvestissement',
        duree: '2-3 semaines',
        responsable: 'Conseiller financier',
        statut: 'A_FAIRE',
        notes: 'Diversifier selon le profil de risque'
      }
    ];
    
    const contacts: Contact[] = [
      {
        nom: 'Conseiller RREGOP',
        role: 'Spécialiste RREGOP',
        telephone: '514-555-0123',
        email: 'rregop@gouv.qc.ca',
        specialite: 'Rachat d\'années RREGOP'
      },
      {
        nom: 'Conseiller fiscal',
        role: 'Comptable/Conseiller fiscal',
        telephone: '514-555-0124',
        email: 'fiscal@expertise.ca',
        specialite: 'Optimisation fiscale immobilière'
      },
      {
        nom: 'Courtier immobilier',
        role: 'Vente immobilière',
        telephone: '514-555-0125',
        email: 'vente@immobilier.ca',
        specialite: 'Vente de propriétés à revenus'
      }
    ];
    
    const documents: Document[] = [
      {
        nom: 'Évaluation immobilière',
        type: 'EVALUATION',
        statut: 'REQUIS',
        dateLimite: '2 semaines'
      },
      {
        nom: 'Analyse fiscale détaillée',
        type: 'FISCAL',
        statut: 'REQUIS',
        dateLimite: '2 semaines'
      },
      {
        nom: 'Contrat de vente',
        type: 'CONTRAT',
        statut: 'REQUIS',
        dateLimite: '6 semaines'
      },
      {
        nom: 'Formulaire de rachat RREGOP',
        type: 'LEGAL',
        statut: 'REQUIS',
        dateLimite: '8 semaines'
      }
    ];
    
    return {
      etapes,
      timeline: {
        debut: 'Maintenant',
        fin: '8-12 semaines',
        duree: '2-3 mois'
      },
      contacts,
      documents,
      checklist: [
        'Évaluation immobilière obtenue',
        'Consultation fiscale effectuée',
        'Propriété mise en marché',
        'Vente finalisée',
        'Rachat RREGOP effectué',
        'Fonds restants placés'
      ]
    };
  }
  
  // ===== MÉTHODES UTILITAIRES =====
  
  private static calculateTotalExpenses(expenses: RealEstateProperty['depensesAnnuelles']): number {
    return Object.values(expenses).reduce((sum, val) => sum + val, 0);
  }
  
  private static calculatePropertyProjections(property: RealEstateProperty, years: number) {
    const valeurFuture = property.valeurMarchande * Math.pow(1 + property.appreciationAnnuelle / 100, years);
    const revenusFuturs = property.revenusLocatifsAnnuels * Math.pow(1 + property.augmentationLoyersAnnuelle / 100, years);
    const rendementFutur = (revenusFuturs / valeurFuture) * 100;
    
    return { valeurFuture, revenusFuturs, rendementFutur };
  }
  
  private static isEchange44Eligible(property: RealEstateProperty, userContext: any): boolean {
    // Logique simplifiée - à adapter selon les règles exactes
    return property.typeProprieteDuplex === 'DUPLEX' && userContext?.hasReplacementProperty;
  }
  
  private static calculateRendementScore(scenario: SaleScenario): number {
    // Score basé sur la liquidité et les stratégies de réinvestissement
    const liquiditeScore = Math.min(10, (scenario.liquiditeNette / 100000) * 10);
    const strategiesScore = scenario.strategies.reduce((sum, strategy) => sum + strategy.rendementEscompte, 0) / scenario.strategies.length;
    
    return Math.min(10, (liquiditeScore + strategiesScore) / 2);
  }
  
  private static calculateSecuriteScore(scenario: SaleScenario): number {
    // Score basé sur la stabilité des stratégies
    const rregopStrategy = scenario.strategies.find(s => s.type === 'RREGOP_RACHAT');
    if (rregopStrategy) return 10; // Maximum si RREGOP inclus
    
    const reerStrategy = scenario.strategies.find(s => s.type === 'REER_CELI');
    if (reerStrategy) return 7; // Bon si REER/CELI
    
    return 5; // Moyen si seulement portefeuille
  }
  
  private static generateRecommendation(scenario: SaleScenario): string {
    if (scenario.type === 'ECHANGE_44') {
      return 'Échange 44 recommandé pour éviter l\'impôt immédiat et maintenir l\'exposition immobilière.';
    }
    
    if (scenario.type === 'RESERVE_ETALEE') {
      return 'Réserve d\'épargne étalée recommandée pour optimiser la fiscalité et étaler l\'impôt sur 5 ans.';
    }
    
    return 'Vente comptant recommandée pour maximiser la liquidité et permettre le réinvestissement RREGOP immédiat.';
  }
}
