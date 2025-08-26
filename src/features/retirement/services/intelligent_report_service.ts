// IntelligentReportService.ts - Service de génération de rapports personnalisés
// Synthétise SRG + RREGOP + optimisations en actions concrètes

import { UserData } from '../types';
import { SRGService, SRGCalculationResult } from './SRGService';
import { RREGOPService, RREGOPCalculationResult } from './RREGOPService';
import { CalculationService } from './CalculationService';

export interface IntelligentReport {
  // Métadonnées
  metadata: ReportMetadata;
  
  // Synthèse exécutive
  executiveSummary: ExecutiveSummary;
  
  // Alertes critiques
  criticalAlerts: CriticalAlert[];
  
  // Actions prioritaires
  priorityActions: PriorityAction[];
  
  // Calendrier de mise en œuvre
  implementationCalendar: ImplementationTimeline;
  
  // Scénarios comparatifs
  comparativeScenarios: ComparativeScenario[];
  
  // Recommandations personnalisées
  personalizedRecommendations: PersonalizedRecommendation[];
  
  // Résumé financier
  financialSummary: FinancialSummary;
}

export interface ReportMetadata {
  generatedAt: Date;
  userId?: string;
  version: string;
  dataIntegrity: 'complete' | 'partial' | 'estimated';
  confidentialityLevel: 'personal' | 'advisor-shareable';
  validUntil: Date; // 6 mois
}

export interface ExecutiveSummary {
  situationFinanciere: 'critique' | 'attention' | 'stable' | 'favorable';
  revenus: {
    actuels: number;
    projetes: number;
    tauxRemplacement: number;
  };
  opportunites: {
    srgMontant: number;
    rregopOptimisation: number;
    fiscaleEconomies: number;
    total: number;
  };
  risques: string[];
  messagePersonnalise: string;
}

export interface CriticalAlert {
  type: 'manque-a-gagner' | 'risque-fiscal' | 'optimisation-ratee' | 'deadline-critique';
  severity: 'urgent' | 'important' | 'attention';
  title: string;
  description: string;
  impact: number; // Impact financier en $
  deadline?: Date;
  actionRequired: string;
  consequences: string;
}

export interface PriorityAction {
  id: string;
  category: 'gouvernemental' | 'fiscal' | 'epargne' | 'planification';
  title: string;
  description: string;
  impact: number; // Impact financier
  effort: 'faible' | 'moyen' | 'eleve';
  timeframe: 'immediat' | '3-mois' | '6-mois' | '1-an' | 'long-terme';
  steps: string[];
  resources: ActionResource[];
  priority: number; // 1-10, 10 = le plus prioritaire
}

export interface ActionResource {
  type: 'document' | 'site-web' | 'contact' | 'formulaire';
  title: string;
  url?: string;
  description: string;
}

export interface ImplementationTimeline {
  phases: ImplementationPhase[];
  milestones: Milestone[];
  reviewDates: Date[];
}

export interface ImplementationPhase {
  name: string;
  startDate: Date;
  duration: string; // "3 mois"
  objectives: string[];
  actions: string[];
  expectedOutcome: string;
  successMetrics: string[];
}

export interface Milestone {
  date: Date;
  title: string;
  description: string;
  impact: number;
  verification: string;
}

export interface ComparativeScenario {
  name: string;
  description: string;
  assumptions: string[];
  results: {
    annuel: number;
    viager: number;
    risque: 'faible' | 'moyen' | 'eleve';
  };
  advantages: string[];
  disadvantages: string[];
  recommendation: 'recommande' | 'acceptable' | 'deconseille';
}

export interface PersonalizedRecommendation {
  category: string;
  title: string;
  content: string;
  reasoning: string[];
  adaptedFor: string; // "Travailleur ordinaire" | "Employé gouvernemental"
  complexity: 'simple' | 'intermediate' | 'advanced';
}

export interface FinancialSummary {
  currentSituation: {
    age: number;
    salaire: number;
    epargne: number;
    dettes: number;
  };
  retirementProjection: {
    ageRetraite: number;
    revenuMensuel: number;
    sources: RevenueSource[];
  };
  gaps: {
    shortfall: number;
    recommendations: string[];
  };
}

export interface RevenueSource {
  name: string;
  amount: number;
  percentage: number;
  reliability: 'garantie' | 'probable' | 'incertaine';
}

/**
 * Service de génération de rapports intelligents
 * Analyse tous les modules pour créer des recommandations actionnables
 */
export class IntelligentReportService {
  
  /**
   * Génération du rapport principal
   */
  public static async generateComprehensiveReport(userData: UserData): Promise<IntelligentReport> {
    try {
      // Calculs de base de tous les modules
      const srgAnalysis = SRGService.calculerSRG(userData);
      const rregopAnalysis = userData.retirement?.rregopMembre1 === 'oui' ? 
        this.calculateRREGOPData(userData) : null;
      const basicCalculations = CalculationService.calculateAll(userData);

      // Génération des sections du rapport
      const metadata = this.generateMetadata(userData);
      const executiveSummary = this.generateExecutiveSummary(userData, srgAnalysis, rregopAnalysis, basicCalculations);
      const criticalAlerts = this.identifyCriticalAlerts(userData, srgAnalysis, rregopAnalysis);
      const priorityActions = this.generatePriorityActions(userData, srgAnalysis, rregopAnalysis);
      const implementationCalendar = this.createImplementationCalendar(priorityActions);
      const comparativeScenarios = this.generateComparativeScenarios(userData, srgAnalysis, rregopAnalysis);
      const personalizedRecommendations = this.generatePersonalizedRecommendations(userData, srgAnalysis, rregopAnalysis);
      const financialSummary = this.generateFinancialSummary(userData, basicCalculations);

      return {
        metadata,
        executiveSummary,
        criticalAlerts,
        priorityActions,
        implementationCalendar,
        comparativeScenarios,
        personalizedRecommendations,
        financialSummary
      };

    } catch (error) {
      console.error('Erreur génération rapport:', error);
      throw new Error('Impossible de générer le rapport intelligent');
    }
  }

  /**
   * Synthèse exécutive personnalisée
   */
  private static generateExecutiveSummary(
    userData: UserData,
    srgAnalysis: SRGCalculationResult,
    rregopAnalysis: any,
    calculations: any
  ): ExecutiveSummary {
    
    const age = this.calculateAge(userData.personal?.naissance1 || '1970-01-01');
    const salaire = userData.personal?.salaire1 || 50000;
    const revenus = {
      actuels: salaire,
      projetes: calculations.totalRetirementIncome || 30000,
      tauxRemplacement: Math.round((calculations.totalRetirementIncome / salaire) * 100)
    };

    // Calcul des opportunités
    const srgMontant = srgAnalysis.eligible ? srgAnalysis.montantTotal : 0;
    const rregopOptimisation = rregopAnalysis ? this.estimateRREGOPOptimization(rregopAnalysis) : 0;
    const fiscaleEconomies = this.estimateTaxOptimizations(userData);
    
    const opportunites = {
      srgMontant,
      rregopOptimisation,
      fiscaleEconomies,
      total: srgMontant + rregopOptimisation + fiscaleEconomies
    };

    // Évaluation situation
    const situationFinanciere = this.evaluateFinancialSituation(
      revenus.tauxRemplacement,
      opportunites.total,
      age
    );

    // Identification des risques
    const risques = this.identifyMainRisks(userData, srgAnalysis, rregopAnalysis);

    // Message personnalisé selon la clientèle cible
    const messagePersonnalise = this.generatePersonalizedMessage(
      situationFinanciere,
      opportunites.total,
      age,
      userData
    );

    return {
      situationFinanciere,
      revenus,
      opportunites,
      risques,
      messagePersonnalise
    };
  }

  /**
   * Identification des alertes critiques
   */
  private static identifyCriticalAlerts(
    userData: UserData,
    srgAnalysis: SRGCalculationResult,
    rregopAnalysis: any
  ): CriticalAlert[] {
    
    const alerts: CriticalAlert[] = [];

    // Alerte SRG manquée
    if (srgAnalysis.eligible && srgAnalysis.montantTotal > 5000) {
      alerts.push({
        type: 'manque-a-gagner',
        severity: 'urgent',
        title: 'Supplément de Revenu Garanti non réclamé',
        description: `Vous êtes éligible au SRG mais ne le recevez pas encore. Montant potentiel: ${srgAnalysis.montantTotal.toLocaleString()} $/an`,
        impact: srgAnalysis.montantTotal,
        actionRequired: 'Faire la demande dès 65 ans ou optimiser revenus pour admissibilité',
        consequences: `Perte de ${(srgAnalysis.montantTotal * 15).toLocaleString()} $ sur 15 ans de retraite`
      });
    }

    // Alerte RREGOP timing
    if (rregopAnalysis && rregopAnalysis.penalites?.applicable) {
      alerts.push({
        type: 'optimisation-ratee',
        severity: 'important',
        title: 'Pénalités RREGOP évitables',
        description: `Retraite anticipée entraîne ${(rregopAnalysis.penalites.tauxPenalite * 100).toFixed(1)}% de réduction permanente`,
        impact: rregopAnalysis.penalites.montantPenalite || 5000,
        actionRequired: 'Évaluer possibilité de reporter à 61 ans',
        consequences: 'Réduction permanente de la pension'
      });
    }

    // Alerte optimisations fiscales
    const fiscalSavings = this.estimateTaxOptimizations(userData);
    if (fiscalSavings > 2000) {
      alerts.push({
        type: 'optimisation-ratee',
        severity: 'attention',
        title: 'Économies fiscales disponibles',
        description: `Optimisations REER/CELI et stratégies de décaissement peuvent économiser ${fiscalSavings.toLocaleString()} $/an`,
        impact: fiscalSavings,
        actionRequired: 'Réviser stratégie de placement et décaissement',
        consequences: 'Perte cumulée significative sur la durée'
      });
    }

    return alerts.sort((a, b) => b.impact - a.impact);
  }

  /**
   * Génération des actions prioritaires
   */
  private static generatePriorityActions(
    userData: UserData,
    srgAnalysis: SRGCalculationResult,
    rregopAnalysis: any
  ): PriorityAction[] {
    
    const actions: PriorityAction[] = [];
    let actionId = 1;

    // Action SRG si applicable
    if (srgAnalysis.eligible) {
      actions.push({
        id: `action-${actionId++}`,
        category: 'gouvernemental',
        title: 'Optimiser éligibilité SRG',
        description: 'Mettre en place une stratégie pour maximiser le Supplément de Revenu Garanti',
        impact: srgAnalysis.montantTotal,
        effort: 'moyen',
        timeframe: '6-mois',
        steps: [
          'Calculer revenus imposables projetés à la retraite',
          'Optimiser séquence de décaissement REER vs CELI',
          'Considérer transferts CELI pour réduire revenus imposables',
          'Planifier demande SRG dès 65 ans'
        ],
        resources: [
          {
            type: 'site-web',
            title: 'Service Canada - SRG',
            url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti.html',
            description: 'Information officielle sur le SRG'
          }
        ],
        priority: 9
      });
    }

    // Action RREGOP si membre
    if (rregopAnalysis) {
      const priority = rregopAnalysis.penalites?.applicable ? 8 : 6;
      actions.push({
        id: `action-${actionId++}`,
        category: 'gouvernemental',
        title: 'Optimiser pension RREGOP',
        description: 'Analyser les options pour maximiser votre rente RREGOP',
        impact: rregopAnalysis.montantFinal * 0.1, // Estimation 10% d'optimisation
        effort: 'moyen',
        timeframe: '3-mois',
        steps: [
          'Obtenir relevé de participation récent',
          'Évaluer coût/bénéfice du rachat de service',
          'Calculer impact des pénalités de retraite anticipée',
          'Comparer options survivant 50% vs 60%'
        ],
        resources: [
          {
            type: 'site-web',
            title: 'CARRA - RREGOP',
            url: 'https://www.carra.gouv.qc.ca/',
            description: 'Gestionnaire des régimes de retraite'
          }
        ],
        priority
      });
    }

    // Action optimisations fiscales
    const fiscalImpact = this.estimateTaxOptimizations(userData);
    if (fiscalImpact > 1000) {
      actions.push({
        id: `action-${actionId++}`,
        category: 'fiscal',
        title: 'Implémenter stratégie fiscale',
        description: 'Optimiser allocation REER/CELI et stratégie de décaissement',
        impact: fiscalImpact,
        effort: 'faible',
        timeframe: 'immediat',
        steps: [
          'Maximiser contributions CELI disponibles',
          'Planifier séquence décaissement âge par âge',
          'Évaluer fractionnement de pension',
          'Optimiser timing PSV selon revenus'
        ],
        resources: [
          {
            type: 'document',
            title: 'Guide REER vs CELI',
            description: 'Stratégies d\'optimisation fiscale'
          }
        ],
        priority: 7
      });
    }

    // Action planification générale
    actions.push({
      id: `action-${actionId++}`,
      category: 'planification',
      title: 'Révision annuelle complète',
      description: 'Mettre à jour votre planification selon l\'évolution de votre situation',
      impact: 2000, // Impact estimé de la révision
      effort: 'faible',
      timeframe: '1-an',
      steps: [
        'Réviser tous les calculs annuellement',
        'Ajuster selon changements législatifs',
        'Mettre à jour espérance de vie et objectifs',
        'Revoir stratégies selon performance'
      ],
      resources: [],
      priority: 4
    });

    return actions.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Création du calendrier de mise en œuvre
   */
  private static createImplementationCalendar(actions: PriorityAction[]): ImplementationTimeline {
    const now = new Date();
    const phases: ImplementationPhase[] = [];
    const milestones: Milestone[] = [];
    const reviewDates: Date[] = [];

    // Phase immédiate (0-3 mois)
    const immediateActions = actions.filter(a => 
      a.timeframe === 'immediat' || a.timeframe === '3-mois'
    );
    
    if (immediateActions.length > 0) {
      phases.push({
        name: 'Actions immédiates',
        startDate: now,
        duration: '3 mois',
        objectives: ['Saisir opportunités urgentes', 'Éviter pertes immédiates'],
        actions: immediateActions.map(a => a.title),
        expectedOutcome: 'Optimisations de base mises en place',
        successMetrics: [`Économies de ${immediateActions.reduce((sum, a) => sum + a.impact, 0).toLocaleString()} $/an`]
      });

      // Milestone pour la phase immédiate
      const milestone3months = new Date(now);
      milestone3months.setMonth(milestone3months.getMonth() + 3);
      milestones.push({
        date: milestone3months,
        title: 'Première révision',
        description: 'Validation des actions immédiates',
        impact: immediateActions.reduce((sum, a) => sum + a.impact, 0),
        verification: 'Calculs mis à jour et bénéfices confirmés'
      });
    }

    // Phase moyen terme (3-12 mois)
    const mediumActions = actions.filter(a => 
      a.timeframe === '6-mois' || a.timeframe === '1-an'
    );
    
    if (mediumActions.length > 0) {
      const start6months = new Date(now);
      start6months.setMonth(start6months.getMonth() + 3);
      
      phases.push({
        name: 'Optimisations avancées',
        startDate: start6months,
        duration: '9 mois',
        objectives: ['Maximiser revenus gouvernementaux', 'Peaufiner stratégies'],
        actions: mediumActions.map(a => a.title),
        expectedOutcome: 'Stratégie de retraite optimisée',
        successMetrics: [`Revenus additionnels de ${mediumActions.reduce((sum, a) => sum + a.impact, 0).toLocaleString()} $/an`]
      });
    }

    // Dates de révision
    for (let i = 1; i <= 5; i++) {
      const reviewDate = new Date(now);
      reviewDate.setFullYear(reviewDate.getFullYear() + i);
      reviewDates.push(reviewDate);
    }

    return {
      phases,
      milestones,
      reviewDates
    };
  }

  /**
   * Génération des scénarios comparatifs
   */
  private static generateComparativeScenarios(
    userData: UserData,
    srgAnalysis: SRGCalculationResult,
    rregopAnalysis: any
  ): ComparativeScenario[] {
    
    const scenarios: ComparativeScenario[] = [];
    const baseIncome = this.estimateBaseRetirementIncome(userData);

    // Scénario 1: Statu quo (sans optimisations)
    scenarios.push({
      name: 'Statu Quo',
      description: 'Continuer sans changements ni optimisations',
      assumptions: [
        'Aucune optimisation fiscale',
        'Pas de demande SRG',
        'Stratégie REER/CELI de base'
      ],
      results: {
        annuel: baseIncome,
        viager: baseIncome * 20,
        risque: 'eleve'
      },
      advantages: ['Aucun effort requis', 'Simplicité'],
      disadvantages: ['Opportunités manquées', 'Revenus sous-optimaux'],
      recommendation: 'deconseille'
    });

    // Scénario 2: Optimisations SRG
    const srgOptimizedIncome = baseIncome + (srgAnalysis.eligible ? srgAnalysis.montantTotal : 0);
    scenarios.push({
      name: 'Optimisation SRG',
      description: 'Maximiser éligibilité au Supplément de Revenu Garanti',
      assumptions: [
        'Stratégie décaissement optimisée',
        'Demande SRG maximisée',
        'Revenus imposables contrôlés'
      ],
      results: {
        annuel: srgOptimizedIncome,
        viager: srgOptimizedIncome * 20,
        risque: 'faible'
      },
      advantages: [
        `Revenus additionnels de ${srgAnalysis.montantTotal?.toLocaleString() || 0} $/an`,
        'Sécurité financière accrue'
      ],
      disadvantages: ['Contraintes sur autres revenus'],
      recommendation: srgAnalysis.eligible ? 'recommande' : 'acceptable'
    });

    // Scénario 3: Optimisation complète
    const totalOptimizations = this.estimateAllOptimizations(userData, srgAnalysis, rregopAnalysis);
    const fullyOptimizedIncome = baseIncome + totalOptimizations;
    
    scenarios.push({
      name: 'Optimisation Complète',
      description: 'Mise en œuvre de toutes les stratégies recommandées',
      assumptions: [
        'SRG optimisé',
        'RREGOP optimisé',
        'Stratégies fiscales avancées',
        'Révisions annuelles'
      ],
      results: {
        annuel: fullyOptimizedIncome,
        viager: fullyOptimizedIncome * 20,
        risque: 'moyen'
      },
      advantages: [
        `Revenus optimisés: +${totalOptimizations.toLocaleString()} $/an`,
        'Stratégie complète et coordonnée'
      ],
      disadvantages: ['Effort de mise en œuvre', 'Suivi requis'],
      recommendation: 'recommande'
    });

    return scenarios;
  }

  /**
   * Recommandations personnalisées selon le profil utilisateur
   */
  private static generatePersonalizedRecommendations(
    userData: UserData,
    srgAnalysis: SRGCalculationResult,
    rregopAnalysis: any
  ): PersonalizedRecommendation[] {
    
    const recommendations: PersonalizedRecommendation[] = [];
    const age = this.calculateAge(userData.personal?.naissance1 || '1970-01-01');
    const isGovernmentEmployee = userData.retirement?.rregopMembre1 === 'oui';

    // Recommandation selon l'âge
    if (age < 55) {
      recommendations.push({
        category: 'Planification Long Terme',
        title: 'Vous avez le temps de votre côté',
        content: 'À votre âge, vous pouvez vous permettre une approche plus agressive pour maximiser vos revenus de retraite. Concentrez-vous sur l\'accumulation et les optimisations fiscales.',
        reasoning: [
          'Plus de 10 ans avant la retraite',
          'Capacité d\'ajustement élevée',
          'Composé du temps favorable'
        ],
        adaptedFor: 'Travailleur ordinaire',
        complexity: 'simple'
      });
    } else if (age >= 55 && age < 65) {
      recommendations.push({
        category: 'Préparation Retraite',
        title: 'Phase critique de préparation',
        content: 'Vous approchez de la retraite. Il est temps de finaliser vos stratégies et de vous assurer que tous vos droits sont bien établis.',
        reasoning: [
          'Moins de 10 ans avant la retraite',
          'Moment optimal pour optimisations',
          'Éviter les erreurs coûteuses'
        ],
        adaptedFor: 'Travailleur ordinaire',
        complexity: 'intermediate'
      });
    }

    // Recommandation selon le statut gouvernemental
    if (isGovernmentEmployee) {
      recommendations.push({
        category: 'RREGOP Spécialisé',
        title: 'Avantages d\'employé gouvernemental',
        content: 'Votre statut d\'employé gouvernemental vous donne accès à des avantages spéciaux. Assurez-vous de les maximiser avant de prendre des décisions de retraite.',
        reasoning: [
          'Pension garantie RREGOP',
          'Options de rachat de service',
          'Coordination avec RRQ optimisable'
        ],
        adaptedFor: 'Employé gouvernemental',
        complexity: 'intermediate'
      });
    }

    // Recommandation SRG si applicable
    if (srgAnalysis.eligible) {
      recommendations.push({
        category: 'Prestations Gouvernementales',
        title: 'Opportunité SRG importante',
        content: 'Vous êtes dans la situation parfaite pour bénéficier du Supplément de Revenu Garanti. Cette prestation peut considérablement améliorer votre sécurité financière à la retraite.',
        reasoning: [
          `Éligibilité confirmée pour ${srgAnalysis.montantTotal?.toLocaleString()} $/an`,
          'Prestation non imposable',
          'Sécurité garantie par le gouvernement'
        ],
        adaptedFor: 'Travailleur ordinaire',
        complexity: 'simple'
      });
    }

    return recommendations;
  }

  /**
   * Génération du résumé financier
   */
  private static generateFinancialSummary(userData: UserData, calculations: any): FinancialSummary {
    const currentSituation = {
      age: this.calculateAge(userData.personal?.naissance1 || '1970-01-01'),
      salaire: userData.personal?.salaire1 || 0,
      epargne: (userData.savings?.reer1 || 0) + (userData.savings?.celi1 || 0) + (userData.savings?.nonEnregistre || 0),
      dettes: 0 // À implémenter si nécessaire
    };

    const sources: RevenueSource[] = [
      {
        name: 'RRQ',
        amount: calculations.rrq || 12000,
        percentage: 30,
        reliability: 'garantie'
      },
      {
        name: 'Sécurité de la vieillesse',
        amount: calculations.oas || 8640,
        percentage: 20,
        reliability: 'garantie'
      },
      {
        name: 'Épargne personnelle',
        amount: calculations.personalSavings || 15000,
        percentage: 35,
        reliability: 'probable'
      }
    ];

    // Ajout SRG si applicable
    if (calculations.srg && calculations.srg > 0) {
      sources.push({
        name: 'SRG',
        amount: calculations.srg,
        percentage: 15,
        reliability: 'garantie'
      });
    }

    const totalRevenu = sources.reduce((sum, source) => sum + source.amount, 0);
    const shortfall = Math.max(0, (userData.personal?.depensesAnnuelles || 40000) - totalRevenu);

    return {
      currentSituation,
      retirementProjection: {
        ageRetraite: userData.personal?.ageRetraiteSouhaite1 || 65,
        revenuMensuel: Math.round(totalRevenu / 12),
        sources
      },
      gaps: {
        shortfall,
        recommendations: shortfall > 0 ? [
          'Augmenter épargne REER/CELI',
          'Considérer report de la retraite',
          'Réduire dépenses projetées',
          'Optimiser prestations gouvernementales'
        ] : []
      }
    };
  }

  // Méthodes utilitaires privées
  private static generateMetadata(userData: UserData): ReportMetadata {
    return {
      generatedAt: new Date(),
      version: '1.0.0',
      dataIntegrity: 'complete',
      confidentialityLevel: 'personal',
      validUntil: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000) // 6 mois
    };
  }

  private static calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    return today.getFullYear() - birth.getFullYear();
  }

  private static calculateRREGOPData(userData: UserData): any {
    // Simulation RREGOP - à remplacer par le vrai service si disponible
    return {
      montantFinal: 25000,
      penalites: { applicable: false, tauxPenalite: 0 }
    };
  }

  private static evaluateFinancialSituation(tauxRemplacement: number, opportunites: number, age: number): 'critique' | 'attention' | 'stable' | 'favorable' {
    if (tauxRemplacement < 50 && opportunites < 5000) return 'critique';
    if (tauxRemplacement < 60 && age > 60) return 'attention';
    if (tauxRemplacement > 80 || opportunites > 15000) return 'favorable';
    return 'stable';
  }

  private static identifyMainRisks(userData: UserData, srgAnalysis: any, rregopAnalysis: any): string[] {
    const risks: string[] = [];
    const age = this.calculateAge(userData.personal?.naissance1 || '1970-01-01');

    if (age > 60 && !srgAnalysis.eligible) {
      risks.push('Revenus trop élevés pour SRG - risque de récupération PSV');
    }

    if (userData.savings && (userData.savings.reer1 || 0) > 300000) {
      risks.push('FERR obligatoire à 71 ans pourrait créer sur-imposition');
    }

    if (!userData.retirement?.pensionPrivee1 && !rregopAnalysis) {
      risks.push('Dépendance excessive aux régimes gouvernementaux');
    }

    return risks;
  }

  private static generatePersonalizedMessage(
    situation: string,
    opportunites: number,
    age: number,
    userData: UserData
  ): string {
    const isGovernmentEmployee = userData.retirement?.rregopMembre1 === 'oui';
    
    if (situation === 'critique') {
      return `Votre situation nécessite une attention immédiate. Avec ${opportunites.toLocaleString()} $ d'opportunités identifiées, des actions rapides peuvent considérablement améliorer votre sécurité financière à la retraite.`;
    }
    
    if (situation === 'favorable' && isGovernmentEmployee) {
      return `Félicitations ! Votre situation d'employé gouvernemental combinée à une bonne planification vous met dans une position favorable. Concentrez-vous sur l'optimisation fine de vos stratégies.`;
    }
    
    if (opportunites > 10000) {
      return `Excellente nouvelle ! Nous avons identifié ${opportunites.toLocaleString()} $ d'opportunités annuelles. Avec les bonnes actions, vous pouvez considérablement améliorer votre retraite.`;
    }
    
    return `Votre planification de retraite est sur la bonne voie. Quelques ajustements peuvent encore l'améliorer, notamment ${opportunites.toLocaleString()} $ d'optimisations possibles.`;
  }

  private static estimateRREGOPOptimization(rregopAnalysis: any): number {
    if (!rregopAnalysis) return 0;
    
    let optimization = 0;
    
    // Estimation optimisation rachat de service
    if (rregopAnalysis.rachatServicePossible) {
      optimization += 2000; // Estimation conservative
    }
    
    // Estimation éviter pénalités
    if (rregopAnalysis.penalites?.applicable) {
      optimization += rregopAnalysis.montantFinal * rregopAnalysis.penalites.tauxPenalite;
    }
    
    return Math.round(optimization);
  }

  private static estimateTaxOptimizations(userData: UserData): number {
    const salaire = userData.personal?.salaire1 || 50000;
    const reer = userData.savings?.reer1 || 0;
    const celi = userData.savings?.celi1 || 0;
    
    let optimizations = 0;
    
    // Estimation optimisation REER vs CELI
    if (salaire > 50000 && celi < 50000) {
      optimizations += salaire * 0.02; // 2% du salaire en économies fiscales
    }
    
    // Estimation stratégie décaissement
    if (reer > 100000) {
      optimizations += 1500; // Économies PSV et SRG
    }
    
    return Math.round(optimizations);
  }

  private static estimateBaseRetirementIncome(userData: UserData): number {
    const salaire = userData.personal?.salaire1 || 50000;
    
    // Estimation revenus de base (RRQ + SV + épargne)
    const rrqEstime = Math.min(salaire * 0.25, 15000); // 25% du salaire, max 15k
    const sv = 8640; // SV de base 2025
    const epargneRevenu = ((userData.savings?.reer1 || 0) + (userData.savings?.celi1 || 0)) * 0.04; // Règle 4%
    
    return Math.round(rrqEstime + sv + epargneRevenu);
  }

  private static estimateAllOptimizations(
    userData: UserData, 
    srgAnalysis: any, 
    rregopAnalysis: any
  ): number {
    const srgAmount = srgAnalysis.eligible ? srgAnalysis.montantTotal : 0;
    const rregopOptimization = this.estimateRREGOPOptimization(rregopAnalysis);
    const fiscalOptimization = this.estimateTaxOptimizations(userData);
    
    return srgAmount + rregopOptimization + fiscalOptimization;
  }

  /**
   * Export du rapport en format JSON sécurisé
   */
  public static exportReportAsJSON(report: IntelligentReport): string {
    const exportData = {
      ...report,
      metadata: {
        ...report.metadata,
        exportedAt: new Date(),
        confidentialityWarning: 'Document confidentiel - Ne pas partager sans autorisation',
        dataSourceWarning: 'Données personnelles - Responsabilité du propriétaire'
      }
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Génération d'un résumé exécutif court pour impression
   */
  public static generateExecutiveBrief(report: IntelligentReport): string {
    const { executiveSummary, criticalAlerts, priorityActions } = report;
    
    let brief = `=== RÉSUMÉ EXÉCUTIF - PLANIFICATION RETRAITE ===\n\n`;
    
    brief += `SITUATION: ${executiveSummary.situationFinanciere.toUpperCase()}\n`;
    brief += `Revenus actuels: ${executiveSummary.revenus.actuels.toLocaleString()} $\n`;
    brief += `Revenus projetés: ${executiveSummary.revenus.projetes.toLocaleString()} $\n`;
    brief += `Taux de remplacement: ${executiveSummary.revenus.tauxRemplacement}%\n\n`;
    
    brief += `OPPORTUNITÉS IDENTIFIÉES: ${executiveSummary.opportunites.total.toLocaleString()} $/an\n`;
    brief += `- SRG: ${executiveSummary.opportunites.srgMontant.toLocaleString()} $\n`;
    brief += `- RREGOP: ${executiveSummary.opportunites.rregopOptimisation.toLocaleString()} $\n`;
    brief += `- Fiscal: ${executiveSummary.opportunites.fiscaleEconomies.toLocaleString()} $\n\n`;
    
    brief += `ALERTES CRITIQUES (${criticalAlerts.length}):\n`;
    criticalAlerts.slice(0, 3).forEach((alert, i) => {
      brief += `${i + 1}. ${alert.title} - Impact: ${alert.impact.toLocaleString()} $\n`;
    });
    
    brief += `\nACTIONS PRIORITAIRES (${priorityActions.length}):\n`;
    priorityActions.slice(0, 5).forEach((action, i) => {
      brief += `${i + 1}. ${action.title} - Impact: ${action.impact.toLocaleString()} $ (${action.timeframe})\n`;
    });
    
    brief += `\nMESSAGE PERSONNALISÉ:\n${executiveSummary.messagePersonnalise}\n\n`;
    brief += `=== FIN DU RÉSUMÉ ===`;
    
    return brief;
  }

  /**
   * Validation de la complétude des données pour le rapport
   */
  public static validateDataCompleteness(userData: UserData): {
    isComplete: boolean;
    missingCritical: string[];
    missingSuggested: string[];
  } {
    const missingCritical: string[] = [];
    const missingSuggested: string[] = [];
    
    // Données critiques
    if (!userData.personal?.naissance1) missingCritical.push('Date de naissance');
    if (!userData.personal?.salaire1) missingCritical.push('Salaire actuel');
    if (!userData.personal?.ageRetraiteSouhaite1) missingCritical.push('Âge de retraite souhaité');
    
    // Données suggérées pour optimisation
    if (!userData.savings?.reer1) missingSuggested.push('Montant REER');
    if (!userData.savings?.celi1) missingSuggested.push('Montant CELI');
    if (!userData.retirement?.rregopMembre1) missingSuggested.push('Statut RREGOP');
    
    return {
      isComplete: missingCritical.length === 0,
      missingCritical,
      missingSuggested
    };
  }
}

export { IntelligentReportService };