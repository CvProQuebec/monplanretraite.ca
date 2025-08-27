// Extension à ajouter dans src/features/retirement/services/CalculationService.ts
// Intégration du module SRG dans le CalculationService existant

import { SRGService, CombinedSRGAnalysis } from './SRGService';

// ===== AJOUTS À LA CLASSE CALCULATIONSERVICE =====

export class CalculationService {
  // ... méthodes existantes conservées ...

  /**
   * NOUVEAU: Méthode principale avec intégration SRG
   * À utiliser à la place de calculateAll() pour avoir le SRG
   */
  static calculateAllWithSRG(userData: UserData): CalculationsWithSRG {
    try {
      console.log('🔄 Calculs complets avec analyse SRG...');
      
      // 1. Calculs de base existants
      const baseCalculations = this.calculateAll(userData);
      
      // 2. NOUVEAU: Calculs SRG
      let srgAnalysis: CombinedSRGAnalysis | undefined;
      try {
        srgAnalysis = SRGService.calculateSRGAnalysis(userData);
        console.log('✅ Analyse SRG intégrée avec succès');
      } catch (error) {
        console.warn('⚠️ Erreur analyse SRG, continuons sans:', error);
        srgAnalysis = undefined;
      }
      
      // 3. Mise à jour des totaux avec SRG
      const totalGovernmentBenefitsWithSRG = srgAnalysis ? {
        monthly: (baseCalculations.rrq || 0) + 
                 (baseCalculations.oasAmount || 0) + 
                 srgAnalysis.totalHousehold.srgTotal,
        annual: ((baseCalculations.rrq || 0) + 
                 (baseCalculations.oasAmount || 0) + 
                 srgAnalysis.totalHousehold.srgTotal) * 12,
        breakdown: {
          oasCpp: ((baseCalculations.rrq || 0) + (baseCalculations.oasAmount || 0)) * 12,
          srg: srgAnalysis.totalHousehold.srgTotal * 12,
          other: 0
        }
      } : undefined;
      
      // 4. Impact du SRG sur autres optimisations
      const srgImpact = srgAnalysis ? {
        onTotalRetirementIncome: srgAnalysis.totalHousehold.srgTotal * 12,
        onTaxOptimization: [
          'SRG non imposable - avantage fiscal significatif',
          'Optimiser revenus pour maximiser SRG',
          ...(srgAnalysis.totalHousehold.strategiesCouple || [])
        ],
        onWithdrawalStrategy: [
          'Considérer impact SRG sur décaissements REER/FERR',
          'Timing optimal des retraits pour préserver SRG'
        ]
      } : undefined;
      
      return {
        ...baseCalculations,
        srgAnalysis: this.convertToSRGCalculations(srgAnalysis),
        totalGovernmentBenefitsWithSRG,
        srgImpact
      };
      
    } catch (error) {
      console.error('❌ Erreur dans calculateAllWithSRG:', error);
      // Fallback vers calculs de base
      return {
        ...this.calculateAll(userData),
        srgAnalysis: undefined,
        totalGovernmentBenefitsWithSRG: undefined,
        srgImpact: undefined
      };
    }
  }

  /**
   * NOUVEAU: Évaluation rapide SRG pour recommandations
   */
  static evaluateSRGPriority(userData: UserData): {
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
    reason: string;
    potentialMonthly: number;
    recommendedActions: string[];
  } {
    if (!userData.personal?.naissance1) {
      return {
        priority: 'NONE',
        reason: 'Données insuffisantes',
        potentialMonthly: 0,
        recommendedActions: []
      };
    }

    const age1 = this.calculateAge(userData.personal.naissance1);
    const income1 = userData.personal?.salaire1 || 0;
    const hasSpouse = !!(userData.personal?.prenom2 && userData.personal?.naissance2);
    
    // Évaluation rapide avec SRGService
    const quickEval = SRGService.quickSRGEvaluation(age1, income1, hasSpouse);
    
    if (!quickEval.eligible) {
      if (age1 < 60) {
        return {
          priority: 'LOW',
          reason: 'Trop jeune pour le SRG (moins de 65 ans)',
          potentialMonthly: 0,
          recommendedActions: ['Planifier pour l\'éligibilité à 65 ans']
        };
      } else if (income1 > 50000) {
        return {
          priority: 'MEDIUM',
          reason: 'Revenus trop élevés actuellement',
          potentialMonthly: 0,
          recommendedActions: [
            'Considérer stratégies de réduction de revenus',
            'Analyser fractionnement de pension'
          ]
        };
      } else {
        return {
          priority: 'LOW',
          reason: 'Non éligible selon critères actuels',
          potentialMonthly: 0,
          recommendedActions: ['Vérifier critères de résidence']
        };
      }
    }

    // Éligible - déterminer priorité selon montant
    let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    let reason = '';
    const recommendedActions: string[] = [];

    if (quickEval.estimatedMonthly >= 800) {
      priority = 'CRITICAL';
      reason = `Éligible à ${quickEval.estimatedMonthly}$/mois - impact majeur sur budget`;
      recommendedActions.push(
        'Faire demande SRG immédiatement',
        'Optimiser stratégie de décaissement',
        'Consulter pour optimisations avancées'
      );
    } else if (quickEval.estimatedMonthly >= 400) {
      priority = 'HIGH';
      reason = `Éligible à ${quickEval.estimatedMonthly}$/mois - complément significatif`;
      recommendedActions.push(
        'Analyser éligibilité détaillée',
        'Considérer optimisations revenus'
      );
    } else if (quickEval.estimatedMonthly >= 100) {
      priority = 'MEDIUM';
      reason = `Éligible à ${quickEval.estimatedMonthly}$/mois - complément utile`;
      recommendedActions.push(
        'Vérifier calculs détaillés',
        'Évaluer stratégies d\'amélioration'
      );
    } else {
      priority = 'LOW';
      reason = `Faible éligibilité (${quickEval.estimatedMonthly}$/mois)`;
      recommendedActions.push(
        'Surveiller changements de situation',
        'Planifier optimisations futures'
      );
    }

    return {
      priority,
      reason,
      potentialMonthly: quickEval.estimatedMonthly,
      recommendedActions
    };
  }

  /**
   * NOUVEAU: Conversion pour compatibilité avec types existants
   */
  private static convertToSRGCalculations(analysis: CombinedSRGAnalysis | undefined): SRGCalculations | undefined {
    if (!analysis) return undefined;

    const person1: SRGPersonResult = {
      eligible: analysis.person1.eligible,
      montantMensuel: analysis.person1.montantMensuel,
      montantAnnuel: analysis.person1.montantAnnuel,
      revenuConsidere: analysis.person1.detailsCalcul.revenuCombiné,
      seuilRevenu: analysis.person1.revenuMaximal,
      reductionAppliquee: analysis.person1.reductionAppliquee,
      raisonIneligibilite: analysis.person1.raisonIneligibilite,
      calculDetails: {
        montantMaximum: analysis.person1.detailsCalcul.montantMaximal,
        statutConjoint: this.determineConjointStatus(analysis.person1.detailsCalcul),
        tauxReduction: analysis.person1.detailsCalcul.tauxReduction,
        exemptionBase: analysis.person1.detailsCalcul.exemptionBase
      }
    };

    const person2: SRGPersonResult | undefined = analysis.person2 ? {
      eligible: analysis.person2.eligible,
      montantMensuel: analysis.person2.montantMensuel,
      montantAnnuel: analysis.person2.montantAnnuel,
      revenuConsidere: analysis.person2.detailsCalcul.revenuCombiné,
      seuilRevenu: analysis.person2.revenuMaximal,
      reductionAppliquee: analysis.person2.reductionAppliquee,
      raisonIneligibilite: analysis.person2.raisonIneligibilite,
      calculDetails: {
        montantMaximum: analysis.person2.detailsCalcul.montantMaximal,
        statutConjoint: this.determineConjointStatus(analysis.person2.detailsCalcul),
        tauxReduction: analysis.person2.detailsCalcul.tauxReduction,
        exemptionBase: analysis.person2.detailsCalcul.exemptionBase
      }
    } : undefined;

    const combined: SRGCombinedResult = {
      totalMensuel: analysis.totalHousehold.srgTotal,
      totalAnnuel: analysis.totalHousehold.srgTotal * 12,
      optimisationPotentielle: analysis.totalHousehold.optimisationCombinee,
      strategiesCouple: analysis.totalHousehold.strategiesCouple,
      impactFiscal: {
        economieImpot: analysis.totalHousehold.srgTotal * 12 * 0.25, // Estimation 25% économie
        impactAutresPrestations: [
          'SRG non imposable',
          'N\'affecte pas autres crédits',
          'Peut optimiser taux marginal'
        ]
      }
    };

    const optimizations: SRGOptimizationResult[] = [
      ...this.convertOptimizations(analysis.person1.optimisations, 'Personne 1'),
      ...(analysis.person2 ? this.convertOptimizations(analysis.person2.optimisations, 'Personne 2') : [])
    ];

    const scenarios: SRGScenarioResult[] = [
      ...this.convertScenarios(analysis.person1.scenarios, 'Personne 1'),
      ...(analysis.person2 ? this.convertScenarios(analysis.person2.scenarios, 'Personne 2') : [])
    ];

    return {
      person1,
      person2,
      combined,
      optimizations,
      scenarios
    };
  }

  /**
   * NOUVEAU: Helpers pour conversion
   */
  private static determineConjointStatus(details: any): 'SEUL' | 'CONJOINT_SANS_SV' | 'CONJOINT_AVEC_SV' {
    // Logique pour déterminer le statut basé sur les détails du calcul
    if (details.tauxReduction === 0.50) return 'SEUL';
    return 'CONJOINT_AVEC_SV'; // Simplification pour l'exemple
  }

  private static convertOptimizations(optimizations: any[], personName: string): SRGOptimizationResult[] {
    return optimizations.map(opt => ({
      type: opt.type,
      titre: `${personName}: ${opt.description}`,
      description: opt.description,
      impactEstime: opt.impactPotentiel,
      difficulte: opt.difficulte,
      delaiImplementation: this.getDifficultyDelay(opt.difficulte),
      etapes: opt.actions,
      risques: []
    }));
  }

  private static convertScenarios(scenarios: any[], personName: string): SRGScenarioResult[] {
    return scenarios.map(scenario => ({
      nom: `${personName}: ${scenario.nom}`,
      description: `Scénario d'optimisation pour ${personName}`,
      revenuCible: scenario.revenuCible,
      srgEstime: scenario.srgEstime,
      gainNet: scenario.gainPotentiel,
      faisabilite: scenario.faisabilite,
      actionsRequises: [`Ajuster revenus à ${scenario.revenuCible}$`],
      timeline: this.getFeasibilityTimeline(scenario.faisabilite)
    }));
  }

  private static getDifficultyDelay(difficulte: string): string {
    switch (difficulte) {
      case 'FACILE': return '1-3 mois';
      case 'MOYENNE': return '3-6 mois';
      case 'DIFFICILE': return '6-12 mois';
      default: return 'Variable';
    }
  }

  private static getFeasibilityTimeline(faisabilite: string): string {
    switch (faisabilite) {
      case 'HAUTE': return 'Réalisable dans l\'année';
      case 'MOYENNE': return 'Réalisable en 1-2 ans';
      case 'FAIBLE': return 'Réalisable à long terme';
      default: return 'Timeline à déterminer';
    }
  }

  /**
   * NOUVEAU: Intégration dans les actions recommandées existantes
   */
  private static generateRecommendedActionsWithSRG(userData: UserData): RecommendedActions {
    // Récupérer les actions existantes
    const baseActions = this.generateRecommendedActions(userData);
    
    // Évaluer priorité SRG
    const srgEvaluation = this.evaluateSRGPriority(userData);
    
    if (srgEvaluation.priority === 'CRITICAL' || srgEvaluation.priority === 'HIGH') {
      // Ajouter actions SRG en priorité
      const srgActions = srgEvaluation.recommendedActions.map(action => ({
        priorite: srgEvaluation.priority === 'CRITICAL' ? 'HAUTE' as const : 'MOYENNE' as const,
        categorie: 'SRG' as const,
        action,
        description: `${srgEvaluation.reason} - ${action}`,
        delai: srgEvaluation.priority === 'CRITICAL' ? 'Immédiat' : '1-3 mois',
        impact: srgEvaluation.priority === 'CRITICAL' ? 'TRÈS_ÉLEVÉ' as const : 'ÉLEVÉ' as const
      }));
      
      return {
        actionsImmédiates: [
          ...srgActions.filter(a => a.priorite === 'HAUTE'),
          ...baseActions.actionsImmédiates
        ],
        actionsMoyenTerme: [
          ...srgActions.filter(a => a.priorite === 'MOYENNE'),
          ...baseActions.actionsMoyenTerme
        ],
        actionsLongTerme: baseActions.actionsLongTerme,
        scoreUrgence: Math.max(baseActions.scoreUrgence, srgEvaluation.priority === 'CRITICAL' ? 90 : 70)
      };
    }
    
    return baseActions;
  }

  /**
   * NOUVEAU: Mise à jour de la méthode calculateAll pour inclure évaluation SRG
   */
  static calculateAll(userData: UserData): Calculations {
    try {
      // ... calculs existants conservés ...
      const existingCalculations = super.calculateAll ? super.calculateAll(userData) : this.calculateAllExisting(userData);
      
      // Ajouter évaluation SRG rapide dans les actions recommandées
      const srgEvaluation = this.evaluateSRGPriority(userData);
      
      // Si SRG est prioritaire, l'inclure dans les recommandations
      if (srgEvaluation.priority === 'CRITICAL' || srgEvaluation.priority === 'HIGH') {
        const updatedActions = this.generateRecommendedActionsWithSRG(userData);
        
        return {
          ...existingCalculations,
          recommendedActions: updatedActions,
          // Note sur SRG dans les calculs de base
          notes: [
            ...(existingCalculations.notes || []),
            `⚡ SRG: ${srgEvaluation.reason} - Utiliser calculateAllWithSRG() pour analyse complète`
          ]
        };
      }
      
      return existingCalculations;
      
    } catch (error) {
      console.error('Erreur dans calculateAll avec SRG:', error);
      // Fallback vers calculs de base sans SRG
      return this.calculateAllExisting(userData);
    }
  }

  /**
   * HELPER: Calculs existants (sauvegarde)
   */
  private static calculateAllExisting(userData: UserData): Calculations {
    // Implémentation des calculs de base existants
    // Cette méthode devrait contenir la logique actuelle de calculateAll
    return {
      netWorth: this.calculateNetWorth(userData),
      monthlyIncome: this.calculateMonthlyIncome(userData),
      // ... autres calculs existants
    };
  }
}

// ===== TYPES D'EXTENSION POUR L'INTÉGRATION =====

// Extension de l'interface Calculations existante
declare module '../types' {
  interface Calculations {
    // Ajout optionnel des données SRG
    srgQuickEval?: {
      priority: string;
      potentialMonthly: number;
      reason: string;
    };
    
    // Notes enrichies
    notes?: string[];
  }
}

// ===== EXPORT DES NOUVELLES MÉTHODES =====

export const SRGIntegrationMethods = {
  calculateAllWithSRG: CalculationService.calculateAllWithSRG,
  evaluateSRGPriority: CalculationService.evaluateSRGPriority
};