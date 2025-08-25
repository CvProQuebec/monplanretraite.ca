// ===== CALCULATIONSERVICE AMÉLIORÉ 2025 - AVEC FALLBACKS =====
// Service de calculs financiers intégrant EnhancedRRQService et OASGISService

import { UserData, Calculations, RRQOptimizationResult } from '../types';
import { EnhancedRRQService } from './EnhancedRRQService';
import { OASGISService } from './OASGISService';
import { EmploymentStatusService } from './EmploymentStatusService';
import { EmploymentStatusData, EmploymentImpactAnalysis } from '../types/employment-status';
import { AdvancedMonteCarloService, MonteCarloResult } from './AdvancedMonteCarloService';
import { TaxOptimizationService2025 } from './TaxParametersService2025';
import { RetirementBudgetService } from './RetirementBudgetService';

export class CalculationService {
  // CONSTANTES MISES À JOUR SELON LES TRANSCRIPTIONS D'EXPERTS
  private static readonly INFLATION_RATE = 0.025; // 2.5% au lieu de 2% (plus réaliste)
  private static readonly INVESTMENT_RETURN = 0.06; // 6% conservé mais avec variations Monte Carlo
  private static readonly TAX_RATE = 0.30; // 30% taux marginal moyen
  private static readonly RETIREMENT_EXPENSE_RATIO = 0.75; // 75% des dépenses actuelles
  private static readonly WITHDRAWAL_RATE = 0.04; // 4% règle de retrait
  
  // NOUVEAUX: Paramètres avancés basés sur les transcriptions
  private static readonly VOLATILITY_STOCKS = 0.15; // 15% volatilité actions
  private static readonly VOLATILITY_BONDS = 0.05; // 5% volatilité obligations
  private static readonly CORRELATION_INFLATION_STOCKS = -0.3; // Corrélation négative
  
  /**
   * NOUVEAU: Calculs avancés avec simulations Monte Carlo
   */
  static async calculateAllAdvanced(userData: UserData): Promise<Calculations & { monteCarloResults?: MonteCarloResult }> {
    try {
      // 1. Calculs de base
      const baseCalculations = await this.calculateAll(userData);
      
      // 2. Simulations Monte Carlo avancées
      let monteCarloResults;
      try {
        console.log('🎲 Lancement des simulations Monte Carlo avancées...');
        monteCarloResults = await AdvancedMonteCarloService.runAdvancedSimulation(
          userData,
          baseCalculations
        );
        console.log('✅ Simulations Monte Carlo terminées avec succès');
      } catch (error) {
        console.warn('Erreur simulations Monte Carlo, ignoré:', error);
        monteCarloResults = undefined;
      }
      
      return {
        ...baseCalculations,
        monteCarloResults
      };
    } catch (error) {
      console.error('Erreur dans calculateAllAdvanced:', error);
      // Fallback vers calculs de base
      return this.calculateAll(userData);
    }
  }

  static calculateAll(userData: UserData): Calculations {
    try {
      // 1. Calculs de base (CONSERVER L'ANCIENNE LOGIQUE)
      const baseCalculations = {
        netWorth: this.calculateNetWorth(userData),
        retirementCapital: this.calculateRetirementCapital(userData),
        sufficiency: this.calculateSufficiency(userData),
        taxSavings: this.calculateTaxSavings(userData),
        monthlyIncome: this.calculateMonthlyIncome(userData),
        monthlyExpenses: this.calculateMonthlyExpenses(userData)
      };
      
      // 2. Calculs avancés (NOUVEAUX) avec fallbacks
      let rrqOptimization;
      try {
        rrqOptimization = this.calculateRRQOptimizationEnhanced(userData);
      } catch (error) {
        console.warn('Utilisation ancienne méthode RRQ:', error);
        rrqOptimization = this.calculateRRQOptimization(userData); // Ancienne méthode
      }
      
      let oasGisProjection;
      try {
        oasGisProjection = this.calculateOASGISProjection(userData);
      } catch (error) {
        console.warn('Erreur OAS/GIS, ignoré:', error);
        oasGisProjection = undefined;
      }
      
      let riskAnalysis;
      try {
        riskAnalysis = this.calculateRetirementRisks(userData);
      } catch (error) {
        console.warn('Erreur analyse risques, ignoré:', error);
        riskAnalysis = undefined;
      }
      
      let recommendedActions;
      try {
        recommendedActions = this.generateRecommendedActions(userData);
      } catch (error) {
        console.warn('Erreur recommandations, ignoré:', error);
        recommendedActions = undefined;
      }
      
      // NOUVEAU: Analyse d'impact de l'emploi précaire
      let employmentImpactAnalysis;
      try {
        employmentImpactAnalysis = this.calculateEmploymentImpact(userData);
      } catch (error) {
        console.warn('Erreur analyse emploi, ignoré:', error);
        employmentImpactAnalysis = undefined;
      }
      
      // NOUVEAUX CALCULS 2025
      let reerCeliOptimization;
      try {
        reerCeliOptimization = this.calculateREERCELIOptimization(userData);
      } catch (error) {
        console.warn('Erreur optimisation REER/CELI, ignoré:', error);
        reerCeliOptimization = undefined;
      }
      
      let withdrawalStrategy;
      try {
        withdrawalStrategy = this.calculateWithdrawalStrategy(userData);
      } catch (error) {
        console.warn('Erreur stratégie décaissement, ignoré:', error);
        withdrawalStrategy = undefined;
      }
      
      let budgetAnalysis;
      try {
        budgetAnalysis = this.calculateRetirementBudgetAnalysis(userData);
      } catch (error) {
        console.warn('Erreur analyse budgétaire, ignoré:', error);
        budgetAnalysis = undefined;
      }
      
      let fondsSolidariteAnalysis;
      try {
        fondsSolidariteAnalysis = this.calculateFondsSolidariteAnalysis(userData);
      } catch (error) {
        console.warn('Erreur analyse fonds solidarité, ignoré:', error);
        fondsSolidariteAnalysis = undefined;
      }
      
      let estateConsiderations;
      try {
        estateConsiderations = this.calculateEstateConsiderations(userData);
      } catch (error) {
        console.warn('Erreur considérations successorales, ignoré:', error);
        estateConsiderations = undefined;
      }
      
      return {
        ...baseCalculations,
        rrqOptimization,
        oasGisProjection,
        riskAnalysis,
        recommendedActions,
        employmentImpactAnalysis,
        // NOUVEAUX CALCULS 2025
        reerCeliOptimization,
        withdrawalStrategy,
        budgetAnalysis,
        fondsSolidariteAnalysis,
        estateConsiderations
      };
      
    } catch (error) {
      console.error('Erreur dans calculateAll:', error);
      
      // FALLBACK : Utiliser uniquement les calculs de base
      return {
        netWorth: this.calculateNetWorth(userData),
        retirementCapital: this.calculateRetirementCapital(userData),
        sufficiency: this.calculateSufficiency(userData),
        taxSavings: this.calculateTaxSavings(userData),
        monthlyIncome: this.calculateMonthlyIncome(userData),
        monthlyExpenses: this.calculateMonthlyExpenses(userData),
        rrqOptimization: undefined,
        oasGisProjection: undefined,
        riskAnalysis: undefined,
        recommendedActions: undefined,
        // NOUVEAUX CALCULS 2025 (undefined en cas d'erreur)
        reerCeliOptimization: undefined,
        withdrawalStrategy: undefined,
        budgetAnalysis: undefined,
        fondsSolidariteAnalysis: undefined,
        estateConsiderations: undefined
      };
    }
  }

  /**
   * AMÉLIORÉ: Optimisation RRQ avec les nouveaux paramètres 2025
   */
  static calculateRRQOptimizationEnhanced(userData: UserData): RRQOptimizationResult {
    try {
      const person1Analysis = this.analyzePersonRRQ(userData, 1);
      const person2Analysis = this.analyzePersonRRQ(userData, 2);
      
      return {
        person1: person1Analysis,
        person2: person2Analysis,
        combinedStrategy: this.optimizeCombinedRRQStrategy(person1Analysis, person2Analysis),
        householdImpact: this.calculateHouseholdImpact(person1Analysis, person2Analysis)
      };
    } catch (error) {
      console.error('Erreur calcul optimisation RRQ:', error);
      throw error; // Re-throw pour utiliser fallback
    }
  }

  /**
   * NOUVEAU: Analyse RRQ individuelle avec EnhancedRRQService
   */
  private static analyzePersonRRQ(userData: UserData, personId: 1 | 2): any {
    const isFirstPerson = personId === 1;
    
    const ageActuel = isFirstPerson 
      ? this.calculateAge(userData.personal.naissance1)
      : this.calculateAge(userData.personal.naissance2);
    
    const montantActuel = isFirstPerson 
      ? userData.retirement.rrqMontantActuel1 
      : userData.retirement.rrqMontantActuel2;
    
    const montant70 = isFirstPerson 
      ? userData.retirement.rrqMontant70_1 
      : userData.retirement.rrqMontant70_2;
    
    // NOUVEAU: Calcul du montant à 72 ans avec nouveau facteur 0.7%
    const montant72 = this.calculateRRQAt72(montantActuel, ageActuel);
    
    const esperanceVie = isFirstPerson 
      ? userData.retirement.esperanceVie1 
      : userData.retirement.esperanceVie2;
    
    const sexe = isFirstPerson 
      ? userData.personal.sexe1 
      : userData.personal.sexe2;

    // Évaluation de la situation financière
    const situationFinanciere = this.evaluateFinancialSituation(userData);

    if (!montantActuel || !sexe) return null;

    return EnhancedRRQService.analyzeRRQAdvanced({
      ageActuel,
      montantActuel,
      montant70,
      montant72, // NOUVEAU
      esperanceVie,
      sexe,
      situationFinanciere,
      autrePension: isFirstPerson ? userData.retirement.pensionPrivee1 : userData.retirement.pensionPrivee2,
      conjointRRQ: isFirstPerson ? userData.retirement.rrqMontantActuel2 : userData.retirement.rrqMontantActuel1
    });
  }

  /**
   * NOUVEAU: Calcul du montant RRQ à 72 ans (extension 2025)
   */
  private static calculateRRQAt72(montantBase: number, ageActuel: number): number {
    if (ageActuel >= 72) return montantBase;
    
    // Facteur de bonification: 0.7% par mois après 65 ans
    const moisBonification = (72 - 65) * 12; // 84 mois
    const facteurBonification = moisBonification * 0.007; // 58.8%
    
    // Estimation du montant à 65 ans si pas déjà calculé
    let montantA65 = montantBase;
    if (ageActuel < 65) {
      const moisReduction = (65 - ageActuel) * 12;
      const facteurReduction = moisReduction * 0.006;
      montantA65 = montantBase / (1 - facteurReduction);
    } else if (ageActuel > 65) {
      const moisBonificationActuelle = (ageActuel - 65) * 12;
      const facteurBonificationActuelle = moisBonificationActuelle * 0.007;
      montantA65 = montantBase / (1 + facteurBonificationActuelle);
    }
    
    return montantA65 * (1 + facteurBonification);
  }

  /**
   * NOUVEAU: Évaluation de la situation financière
   */
  private static evaluateFinancialSituation(userData: UserData): 'URGENTE' | 'STABLE' | 'CONFORTABLE' {
    const monthlyIncome = this.calculateMonthlyIncome(userData);
    const monthlyExpenses = this.calculateMonthlyExpenses(userData);
    const netWorth = this.calculateNetWorth(userData);
    const liquidAssets = userData.savings.epargne1 + userData.savings.epargne2 + 
                        userData.savings.celi1 + userData.savings.celi2;

    // Critères basés sur les transcriptions d'experts
    const cashReserve = liquidAssets / monthlyExpenses; // Mois de réserve
    const savingsRate = (monthlyIncome - monthlyExpenses) / monthlyIncome;
    
    if (cashReserve < 6 || savingsRate < 0 || netWorth < monthlyExpenses * 60) {
      return 'URGENTE';
    } else if (cashReserve >= 12 && savingsRate >= 0.15 && netWorth >= monthlyExpenses * 240) {
      return 'CONFORTABLE';
    } else {
      return 'STABLE';
    }
  }

  /**
   * NOUVEAU: Optimisation de stratégie combinée pour couples
   */
  private static optimizeCombinedRRQStrategy(person1: any, person2: any): any {
    if (!person1 || !person2) return null;

    // Stratégies coordonnées basées sur les transcriptions
    const strategies = [
      {
        nom: 'Échelonnement optimal',
        description: 'Une personne commence tôt, l\'autre reporte',
        person1Action: person1.ageActuel < person2.ageActuel ? 'COMMENCER_MAINTENANT' : 'ATTENDRE',
        person2Action: person1.ageActuel < person2.ageActuel ? 'ATTENDRE' : 'COMMENCER_MAINTENANT',
        avantages: ['Flux de revenus étalé', 'Réduction des risques', 'Optimisation fiscale']
      },
      {
        nom: 'Report coordonné',
        description: 'Les deux reportent pour maximiser les prestations',
        person1Action: 'ATTENDRE_JUSQU_72',
        person2Action: 'ATTENDRE_JUSQU_72',
        avantages: ['Prestations maximales', 'Protection contre l\'inflation']
      },
      {
        nom: 'Début coordonné',
        description: 'Les deux commencent immédiatement',
        person1Action: 'COMMENCER_MAINTENANT',
        person2Action: 'COMMENCER_MAINTENANT',
        avantages: ['Sécurité immédiate', 'Liquidités disponibles']
      }
    ];

    // Évaluation de chaque stratégie
    const evaluatedStrategies = strategies.map(strategy => ({
      ...strategy,
      valeurActuelleNette: this.calculateStrategyValue(person1, person2, strategy),
      niveauRisque: this.assessStrategyRisk(strategy),
      scoreTotal: 0 // À calculer
    }));

    // Sélection de la meilleure stratégie
    const bestStrategy = evaluatedStrategies.reduce((best, current) => 
      current.valeurActuelleNette > best.valeurActuelleNette ? current : best
    );

    return {
      strategieRecommandee: bestStrategy,
      alternativeStrategies: evaluatedStrategies.filter(s => s !== bestStrategy),
      raisonnement: this.generateCouplesReasoning(person1, person2, bestStrategy)
    };
  }

  /**
   * NOUVEAU: Projection SV/SRG intégrée
   */
  private static calculateOASGISProjection(userData: UserData): any {
    const person1OAS = this.calculatePersonOASGIS(userData, 1);
    const person2OAS = this.calculatePersonOASGIS(userData, 2);

    return {
      person1: person1OAS,
      person2: person2OAS,
      householdTotal: {
        monthlyOAS: (person1OAS?.securiteVieillesse.montantMensuel || 0) + 
                   (person2OAS?.securiteVieillesse.montantMensuel || 0),
        monthlyGIS: (person1OAS?.supplementRevenuGaranti.montantMensuel || 0) + 
                   (person2OAS?.supplementRevenuGaranti.montantMensuel || 0),
        optimizationOpportunities: this.identifyOASGISOptimizations(person1OAS, person2OAS)
      }
    };
  }

  private static calculatePersonOASGIS(userData: UserData, personId: 1 | 2): any {
    const isFirstPerson = personId === 1;
    
    const age = isFirstPerson 
      ? this.calculateAge(userData.personal.naissance1)
      : this.calculateAge(userData.personal.naissance2);
    
    if (age < 60) return null; // Pas encore pertinent

    const salaire = isFirstPerson 
      ? userData.personal.salaire1 
      : userData.personal.salaire2;
    
    const rrqMontant = isFirstPerson 
      ? userData.retirement.rrqMontantActuel1 
      : userData.retirement.rrqMontantActuel2;

    const pensionPrivee = isFirstPerson 
      ? userData.retirement.pensionPrivee1 
      : userData.retirement.pensionPrivee2;

    // Estimation du revenu de retraite
    const revenuRetraiteAnnuel = (rrqMontant * 12) + (pensionPrivee * 12);
    
    const conjointSalaire = isFirstPerson 
      ? userData.personal.salaire2 
      : userData.personal.salaire1;

    return OASGISService.calculateOASGIS({
      age,
      revenuAnnuel: revenuRetraiteAnnuel,
      statutConjoint: conjointSalaire > 0 ? 'MARIE' : 'SEUL',
      revenuConjoint: conjointSalaire,
      anneesResidence: Math.min(age - 18, 40) // Estimation conservatrice
    });
  }

  /**
   * NOUVEAU: Analyse des risques de retraite basée sur les transcriptions
   */
  private static calculateRetirementRisks(userData: UserData): any {
    const currentAge = this.calculateAge(userData.personal.naissance1);
    const retirementAge = userData.personal.ageRetraiteSouhaite1 || 65;
    const lifeExpectancy = userData.retirement.esperanceVie1 || 85;
    
    const risks = {
      longevityRisk: this.assessLongevityRisk(lifeExpectancy, currentAge),
      inflationRisk: this.assessInflationRisk(userData),
      sequenceRisk: this.assessSequenceOfReturnsRisk(userData, retirementAge),
      liquidityRisk: this.assessLiquidityRisk(userData),
      healthCareRisk: this.assessHealthCareRisk(currentAge),
      overallRiskScore: 0
    };

    risks.overallRiskScore = this.calculateOverallRiskScore(risks);

    return {
      ...risks,
      mitigationStrategies: this.generateRiskMitigationStrategies(risks, userData),
      priorityActions: this.identifyPriorityRiskActions(risks)
    };
  }

  private static assessLongevityRisk(lifeExpectancy: number, currentAge: number): any {
    // Basé sur les statistiques des transcriptions: "on vit deux fois plus longtemps qu'il y a 50 ans"
    const averageLifeExpectancy = 83; // Moyenne canadienne
    const riskLevel = lifeExpectancy > averageLifeExpectancy + 5 ? 'ÉLEVÉ' : 
                     lifeExpectancy < averageLifeExpectancy - 5 ? 'FAIBLE' : 'MODÉRÉ';
    
    const yearsAtRisk = Math.max(0, lifeExpectancy - averageLifeExpectancy);
    const additionalCapitalNeeded = yearsAtRisk * 50000; // 50k par année supplémentaire

    return {
      niveau: riskLevel,
      anneesSupplementaires: yearsAtRisk,
      capitalAdditionnelRequis: additionalCapitalNeeded,
      probabiliteDepasser: this.calculateExceedanceProbability(lifeExpectancy),
      strategies: [
        'Maximiser les revenus viagers (RRQ, SV)',
        'Constituer un fonds de longévité',
        'Considérer une rente viagère'
      ]
    };
  }

  private static assessInflationRisk(userData: UserData): any {
    const monthlyExpenses = this.calculateMonthlyExpenses(userData);
    const liquidAssets = userData.savings.epargne1 + userData.savings.epargne2;
    const realAssets = userData.savings.placements1 + userData.savings.placements2;
    
    // Protection contre l'inflation
    const inflationProtection = realAssets / (liquidAssets + realAssets);
    
    const riskLevel = inflationProtection < 0.4 ? 'ÉLEVÉ' : 
                     inflationProtection > 0.7 ? 'FAIBLE' : 'MODÉRÉ';

    return {
      niveau: riskLevel,
      protectionActuelle: inflationProtection * 100,
      impactSur20Ans: this.calculateInflationImpact(monthlyExpenses, 20),
      strategies: [
        'Augmenter les investissements en actions',
        'Considérer les obligations à rendement réel',
        'Maintenir des revenus indexés (RRQ, SV)'
      ]
    };
  }

  private static assessSequenceOfReturnsRisk(userData: UserData, retirementAge: number): any {
    const currentAge = this.calculateAge(userData.personal.naissance1);
    const yearsToRetirement = retirementAge - currentAge;
    const retirementCapital = this.calculateRetirementCapital(userData);
    
    // Risque critique dans les 5 premières années de retraite
    const riskWindow = 5;
    const annualWithdrawal = retirementCapital * this.WITHDRAWAL_RATE;
    
    const riskLevel = yearsToRetirement <= riskWindow ? 'ÉLEVÉ' : 
                     yearsToRetirement <= 10 ? 'MODÉRÉ' : 'FAIBLE';

    return {
      niveau: riskLevel,
      anneesAvantRetraite: yearsToRetirement,
      retraitAnnuel: annualWithdrawal,
      strategies: [
        'Constituer une réserve de liquidités (3-5 ans)',
        'Adopter une stratégie de retrait flexible',
        'Échelonner les investissements par échéance'
      ]
    };
  }

  /**
   * NOUVEAU: Analyse d'impact de l'emploi précaire
   */
  private static calculateEmploymentImpact(userData: UserData): EmploymentImpactAnalysis | undefined {
    // Vérifier si des données d'emploi précaire sont disponibles
    if (!userData.employmentStatus) {
      return undefined;
    }

    const currentAge = this.calculateAge(userData.personal.naissance1);
    const retirementAge = userData.personal.ageRetraiteSouhaite1 || 65;
    const baseIncome = userData.personal.salaire1 || 0;

    // Utiliser le service spécialisé pour l'analyse
    return EmploymentStatusService.analyzeEmploymentImpact(
      userData.employmentStatus,
      currentAge,
      baseIncome,
      retirementAge
    );
  }

  /**
   * NOUVEAU: Actions recommandées personnalisées
   */
  private static generateRecommendedActions(userData: UserData): any {
    const actions = [];
    const currentAge = this.calculateAge(userData.personal.naissance1);
    
    // Actions basées sur l'âge et la situation
    if (currentAge >= 55 && currentAge < 60) {
      actions.push({
        priorite: 'HAUTE',
        categorie: 'PLANIFICATION',
        action: 'Obtenir votre relevé de participation RRQ',
        description: 'Vérifiez vos droits accumulés et projetez vos prestations',
        delai: '2 semaines',
        impact: 'ÉLEVÉ',
        lienUtile: 'https://www.rrq.gouv.qc.ca/en/mes-renseignements/releve-participation/'
      });
    }

    if (currentAge >= 60) {
      actions.push({
        priorite: 'MOYENNE',
        categorie: 'OPTIMISATION',
        action: 'Analyser le moment optimal pour commencer le RRQ',
        description: 'Comparez les scénarios de début à différents âges',
        delai: '1 mois',
        impact: 'ÉLEVÉ'
      });
    }

    if (currentAge >= 64) {
      actions.push({
        priorite: 'HAUTE',
        categorie: 'PRESTATIONS',
        action: 'Préparer votre demande de Sécurité de la vieillesse',
        description: 'Inscription automatique ou demande manuelle',
        delai: '3 mois avant 65 ans',
        impact: 'ÉLEVÉ'
      });
    }

    // Actions basées sur la situation financière
    const netWorth = this.calculateNetWorth(userData);
    const monthlyExpenses = this.calculateMonthlyExpenses(userData);
    
    if (netWorth < monthlyExpenses * 240) { // Moins de 20 ans de dépenses
      actions.push({
        priorite: 'HAUTE',
        categorie: 'ÉPARGNE',
        action: 'Accélérer l\'épargne retraite',
        description: 'Maximiser REER/CELI et réduire les dépenses non essentielles',
        delai: 'Immédiat',
        impact: 'TRÈS_ÉLEVÉ'
      });
    }

    return {
      actionsImmédiates: actions.filter(a => a.priorite === 'HAUTE'),
      actionsMoyenTerme: actions.filter(a => a.priorite === 'MOYENNE'),
      actionsLongTerme: actions.filter(a => a.priorite === 'FAIBLE'),
      scoreUrgence: this.calculateUrgencyScore(userData, actions)
    };
  }

  // ===== MÉTHODES EXISTANTES À CONSERVER (avec compatibilité) =====
  
  /**
   * MÉTHODE EXISTANTE: Calcul RRQ avec fallback vers ancienne logique
   */
  private static calculateRRQOptimization(userData: UserData): RRQOptimizationResult {
    // Logique existante pour compatibilité
    try {
      const person1 = {
        ageActuel: this.calculateAge(userData.personal.naissance1),
        montantActuel: userData.retirement.rrqMontantActuel1 || 0,
        montant70: userData.retirement.rrqMontant70_1 || 0
      };
      
      const person2 = {
        ageActuel: this.calculateAge(userData.personal.naissance2),
        montantActuel: userData.retirement.rrqMontantActuel2 || 0,
        montant70: userData.retirement.rrqMontant70_2 || 0
      };

      return {
        totalMaintenant: person1.montantActuel + person2.montantActuel,
        total70: person1.montant70 + person2.montant70,
        montantPerdu: (person1.montant70 + person2.montant70) - (person1.montantActuel + person2.montantActuel),
        ageRentabilite: 67,
        valeurActualiseeMaintenant: person1.montantActuel + person2.montantActuel,
        valeurActualisee70: person1.montant70 + person2.montant70,
        recommandation: 'Considérer reporter jusqu\'à 70 ans pour maximiser les prestations',
        difference: (person1.montant70 + person2.montant70) - (person1.montantActuel + person2.montantActuel)
      };
    } catch (error) {
      console.error('Erreur calcul RRQ fallback:', error);
      return undefined;
    }
  }

  // Méthodes utilitaires privées existantes
  private static safeAdd(a: number, b: number): number {
    return (a || 0) + (b || 0);
  }

  private static safeSubtract(a: number, b: number): number {
    return (a || 0) - (b || 0);
  }

  private static calculateAge(birthDate: string): number {
    if (!birthDate) return 0;
    
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return Math.max(0, age);
    } catch (error) {
      console.error('Erreur calcul âge:', error);
      return 0;
    }
  }

  // Nouvelles méthodes utilitaires pour les calculs avancés
  private static calculateStrategyValue(person1: any, person2: any, strategy: any): number {
    // Simulation simplifiée - à développer
    return (person1?.valeurActuelle || 0) + (person2?.valeurActuelle || 0);
  }

  private static assessStrategyRisk(strategy: any): 'FAIBLE' | 'MODÉRÉ' | 'ÉLEVÉ' {
    // Évaluation simplifiée du risque
    return 'MODÉRÉ';
  }

  private static generateCouplesReasoning(person1: any, person2: any, strategy: any): string[] {
    return [
      'Stratégie optimisée pour votre situation de couple',
      'Prise en compte des différences d\'âge et de prestations',
      'Maximisation des avantages fiscaux combinés'
    ];
  }

  private static identifyOASGISOptimizations(person1OAS: any, person2OAS: any): string[] {
    const optimizations = [];
    
    if (person1OAS?.supplementRevenuGaranti.eligible || person2OAS?.supplementRevenuGaranti.eligible) {
      optimizations.push('Optimiser les revenus pour maximiser le SRG');
    }
    
    return optimizations;
  }

  private static calculateOverallRiskScore(risks: any): number {
    // Score composite basé sur tous les risques
    return 65; // Placeholder - à implémenter
  }

  private static generateRiskMitigationStrategies(risks: any, userData: UserData): any[] {
    return [
      {
        risque: 'Longévité',
        strategie: 'Maximiser les revenus viagers',
        priorite: 'HAUTE'
      }
    ];
  }

  private static identifyPriorityRiskActions(risks: any): any[] {
    return [];
  }

  private static calculateExceedanceProbability(lifeExpectancy: number): number {
    // Calcul actuariel simplifié
    return Math.max(0, Math.min(100, (lifeExpectancy - 80) * 2));
  }

  private static calculateInflationImpact(monthlyExpenses: number, years: number): number {
    const futureValue = monthlyExpenses * 12 * Math.pow(1 + this.INFLATION_RATE, years);
    const currentValue = monthlyExpenses * 12;
    return futureValue - currentValue;
  }

  private static calculateUrgencyScore(userData: UserData, actions: any[]): number {
    const highPriorityActions = actions.filter(a => a.priorite === 'HAUTE').length;
    const age = this.calculateAge(userData.personal.naissance1);
    
    let score = highPriorityActions * 20;
    if (age >= 60) score += 20;
    if (age >= 65) score += 30;
    
    return Math.min(100, score);
  }

  private static calculateHouseholdImpact(person1: any, person2: any): any {
    return {
      revenuTotal: (person1?.montantMensuel || 0) + (person2?.montantMensuel || 0),
      impactFiscal: 'À calculer selon la situation combinée',
      strategies: ['Optimisation fiscale couple', 'Coordination des prestations']
    };
  }

  // Méthodes existantes à conserver (calculateNetWorth, calculateRetirementCapital, etc.)
  static calculateNetWorth(userData: UserData): number {
    try {
      const { savings } = userData;
      
      if (!savings) {
        throw new Error('Données d\'épargne manquantes');
      }

      const totalSavings = 
        this.safeAdd(savings.reer1, savings.reer2) +
        this.safeAdd(savings.celi1, savings.celi2) +
        this.safeAdd(savings.placements1, savings.placements2) +
        this.safeAdd(savings.epargne1, savings.epargne2) +
        this.safeAdd(savings.cri1, savings.cri2);
      
      const realEstate = this.safeSubtract(savings.residenceValeur, savings.residenceHypotheque);
      
      return Math.max(0, totalSavings + realEstate);
    } catch (error) {
      console.error('Erreur calcul valeur nette:', error);
      return 0;
    }
  }

  static calculateRetirementCapital(userData: UserData): number {
    try {
      const { savings } = userData;
      
      if (!savings) {
        throw new Error('Données d\'épargne manquantes');
      }

      const capital = 
        this.safeAdd(savings.reer1, savings.reer2) +
        this.safeAdd(savings.celi1, savings.celi2) +
        this.safeAdd(savings.placements1, savings.placements2) +
        this.safeAdd(savings.cri1, savings.cri2);
      
      const yearsToRetirement = this.calculateYearsToRetirement(userData);
      const futureSavings = this.calculateFutureSavings(userData, yearsToRetirement);
      
      return capital * Math.pow(1 + this.INVESTMENT_RETURN, yearsToRetirement) + futureSavings;
    } catch (error) {
      console.error('Erreur calcul capital retraite:', error);
      return 0;
    }
  }

  static calculateSufficiency(userData: UserData): number {
    try {
      const capital = this.calculateRetirementCapital(userData);
      const target = this.calculateRetirementTarget(userData);
      
      if (target <= 0) return 0;
      
      return Math.min(100, Math.round((capital / target) * 100));
    } catch (error) {
      console.error('Erreur calcul suffisance:', error);
      return 0;
    }
  }

  static calculateTaxSavings(userData: UserData): number {
    try {
      const { savings } = userData;
      
      if (!savings) return 0;

      const reerContributions = this.safeAdd(savings.reer1, savings.reer2);
      const marginalTaxRate = this.calculateMarginalTaxRate(userData);
      
      return reerContributions * marginalTaxRate;
    } catch (error) {
      console.error('Erreur calcul économies fiscales:', error);
      return 0;
    }
  }

  static calculateMonthlyIncome(userData: UserData): number {
    try {
      const annualIncome = this.safeAdd(userData.personal.salaire1, userData.personal.salaire2);
      return annualIncome / 12;
    } catch (error) {
      console.error('Erreur calcul revenus mensuels:', error);
      return 0;
    }
  }

  static calculateMonthlyExpenses(userData: UserData): number {
    try {
      const { cashflow } = userData;
      
      if (!cashflow) return 0;

      return this.safeAdd(cashflow.logement, 0) +
             this.safeAdd(cashflow.servicesPublics, 0) +
             this.safeAdd(cashflow.assurances, 0) +
             this.safeAdd(cashflow.telecom, 0) +
             this.safeAdd(cashflow.alimentation, 0) +
             this.safeAdd(cashflow.transport, 0) +
             this.safeAdd(cashflow.sante, 0) +
             this.safeAdd(cashflow.loisirs, 0);
    } catch (error) {
      console.error('Erreur calcul dépenses mensuelles:', error);
      return 0;
    }
  }

  private static calculateYearsToRetirement(userData: UserData): number {
    const currentAge = this.calculateAge(userData.personal.naissance1);
    const retirementAge = userData.personal.ageRetraiteSouhaite1 || 65;
    return Math.max(0, retirementAge - currentAge);
  }

  private static calculateFutureSavings(userData: UserData, years: number): number {
    const monthlyIncome = this.calculateMonthlyIncome(userData);
    const monthlyExpenses = this.calculateMonthlyExpenses(userData);
    const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);
    
    let totalSavings = 0;
    for (let i = 0; i < years; i++) {
      totalSavings = (totalSavings + monthlySavings * 12) * (1 + this.INVESTMENT_RETURN);
    }
    
    return totalSavings;
  }

  private static calculateRetirementTarget(userData: UserData): number {
    const monthlyExpenses = this.calculateMonthlyExpenses(userData);
    const retirementExpenses = monthlyExpenses * this.RETIREMENT_EXPENSE_RATIO * 12;
    
    return retirementExpenses / this.WITHDRAWAL_RATE;
  }

  private static calculateMarginalTaxRate(userData: UserData): number {
    const income = this.safeAdd(userData.personal.salaire1, userData.personal.salaire2);
    
    // Taux marginaux approximatifs pour le Québec 2025
    if (income > 100000) return 0.45;
    if (income > 50000) return 0.35;
    if (income > 25000) return 0.25;
    return 0.15;
  }

  // Méthodes manquantes pour l'analyse des risques
  private static assessLiquidityRisk(userData: UserData): any {
    const liquidAssets = userData.savings.epargne1 + userData.savings.epargne2 + 
                        userData.savings.celi1 + userData.savings.celi2;
    const monthlyExpenses = this.calculateMonthlyExpenses(userData);
    const monthsOfLiquidity = liquidAssets / monthlyExpenses;
    
    return {
      niveau: monthsOfLiquidity < 6 ? 'ÉLEVÉ' : monthsOfLiquidity < 12 ? 'MODÉRÉ' : 'FAIBLE',
      moisDeLiquidite: monthsOfLiquidity,
      strategies: ['Maintenir 6-12 mois de dépenses en liquidités', 'Diversifier les sources de revenus']
    };
  }

  // ===== NOUVELLES MÉTHODES 2025 =====

  /**
   * NOUVEAU: Optimisation REER vs CELI personnalisée
   */
  private static calculateREERCELIOptimization(userData: UserData): any {
    try {
      const revenuActuel = (userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0);
      const ageActuel = this.calculateAge(userData.personal?.naissance1);
      const ageRetraite = userData.personal?.ageRetraiteSouhaite1 || 65;
      
      // Estimation revenu de retraite
      const revenuProjetteRetraite = this.estimateRetirementIncome(userData);
      
      // Capacité d'épargne disponible
      const capaciteEpargne = this.calculateAvailableSavingsCapacity(userData);
      
      return TaxOptimizationService2025.analyzeREERvsCELI({
        revenuActuel,
        revenuProjetteRetraite,
        ageActuel,
        ageRetraite,
        montantDisponible: capaciteEpargne,
        situationConjoint: userData.personal?.salaire2 > 0 ? 'COUPLE' : 'SEUL'
      });
    } catch (error) {
      console.error('Erreur calcul optimisation REER/CELI:', error);
      throw error;
    }
  }

  /**
   * NOUVEAU: Stratégie de décaissement optimisée
   */
  private static calculateWithdrawalStrategy(userData: UserData): any {
    try {
      const ageRetraite = userData.personal?.ageRetraiteSouhaite1 || 65;
      const esperanceVie = userData.retirement?.esperanceVie1 || 85;
      
      const reerTotal = (userData.savings?.reer1 || 0) + (userData.savings?.reer2 || 0);
      const celiTotal = (userData.savings?.celi1 || 0) + (userData.savings?.celi2 || 0);
      const placementsTotal = (userData.savings?.placements1 || 0) + (userData.savings?.placements2 || 0);
      
      // Revenus garantis estimés
      const revenuRRQ = (userData.retirement?.rrqMontantActuel1 || 0) + (userData.retirement?.rrqMontantActuel2 || 0);
      const revenuPSV = 717.15 * 2; // Estimation couple
      const revenuGaranti = (revenuRRQ + revenuPSV) * 12;
      
      const depensesAnnuelles = this.calculateMonthlyExpenses(userData) * 12 * 0.75; // 75% dépenses actuelles
      
      return TaxOptimizationService2025.optimizeWithdrawalSequence({
        ageDebut: ageRetraite,
        reerValue: reerTotal,
        celiValue: celiTotal,
        placementsValue: placementsTotal,
        revenuGaranti,
        depensesAnnuelles,
        esperanceVie
      });
    } catch (error) {
      console.error('Erreur calcul stratégie décaissement:', error);
      throw error;
    }
  }

  /**
   * NOUVEAU: Analyse budgétaire spécialisée retraite
   */
  private static calculateRetirementBudgetAnalysis(userData: UserData): any {
    try {
      const currentExpenses = {
        logement: userData.cashflow?.logement || 0,
        alimentation: userData.cashflow?.alimentation || 0,
        transport: userData.cashflow?.transport || 0,
        sante: userData.cashflow?.sante || 0,
        loisirs: userData.cashflow?.loisirs || 0,
        vetements: userData.cashflow?.vetements || 0,
        vehicule: userData.cashflow?.vehicule || 0,
        rrqCotisations: userData.cashflow?.rrqCotisations || 0,
        reerEmployeur: userData.cashflow?.reerEmployeur || 0,
        cotisationsPro: userData.cashflow?.cotisationsPro || 0,
        assuranceEmploi: userData.cashflow?.assuranceEmploi || 0,
        voyages: userData.cashflow?.voyages || 0
      };
      
      return RetirementBudgetService.analyzeRetirementExpenseChanges(currentExpenses);
    } catch (error) {
      console.error('Erreur calcul analyse budgétaire:', error);
      throw error;
    }
  }

  /**
   * NOUVEAU: Analyse fonds de solidarité
   */
  private static calculateFondsSolidariteAnalysis(userData: UserData): any {
    try {
      const revenuAnnuel = (userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0);
      const ageActuel = this.calculateAge(userData.personal?.naissance1);
      const ageRetraite = userData.personal?.ageRetraiteSouhaite1 || 65;
      const capaciteEpargne = this.calculateAvailableSavingsCapacity(userData);
      
      return TaxOptimizationService2025.analyzeFondsSolidarite({
        revenuAnnuel,
        ageActuel,
        ageRetraite,
        capaciteEpargne
      });
    } catch (error) {
      console.error('Erreur calcul analyse fonds solidarité:', error);
      throw error;
    }
  }

  /**
   * NOUVEAU: Considérations successorales
   */
  private static calculateEstateConsiderations(userData: UserData): any {
    try {
      const ageActuel = this.calculateAge(userData.personal?.naissance1);
      const situationFamiliale = userData.personal?.salaire2 > 0 ? 'COUPLE' : 'CELIBATAIRE';
      const enfants = userData.personal?.enfants || false;
      
      const valeursPatrimoine = {
        reer: (userData.savings?.reer1 || 0) + (userData.savings?.reer2 || 0),
        celi: (userData.savings?.celi1 || 0) + (userData.savings?.celi2 || 0),
        residence: userData.savings?.residence || 0,
        placements: (userData.savings?.placements1 || 0) + (userData.savings?.placements2 || 0)
      };
      
      return RetirementBudgetService.analyzeEstateConsiderations({
        ageActuel,
        situationFamiliale,
        enfants,
        valeursPatrimoine
      });
    } catch (error) {
      console.error('Erreur calcul considérations successorales:', error);
      throw error;
    }
  }

  // Méthodes utilitaires pour les nouveaux calculs
  private static estimateRetirementIncome(userData: UserData): number {
    const revenuActuel = (userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0);
    const revenuRRQ = (userData.retirement?.rrqMontantActuel1 || 0) + (userData.retirement?.rrqMontantActuel2 || 0);
    const revenuPSV = 717.15 * 2; // Estimation couple
    
    return (revenuRRQ + revenuPSV) * 12; // Revenus garantis uniquement
  }

  private static calculateAvailableSavingsCapacity(userData: UserData): number {
    const revenuMensuel = this.calculateMonthlyIncome(userData);
    const depensesMensuelles = this.calculateMonthlyExpenses(userData);
    const epargneMensuelle = Math.max(0, revenuMensuel - depensesMensuelles);
    
    return epargneMensuelle * 12; // Capacité annuelle
  }

  private static assessHealthCareRisk(currentAge: number): any {
    const riskLevel = currentAge < 50 ? 'FAIBLE' : currentAge < 65 ? 'MODÉRÉ' : 'ÉLEVÉ';
    
    return {
      niveau: riskLevel,
      strategies: [
        'Maintenir une assurance santé adéquate',
        'Constituer un fonds de santé',
        'Planifier les soins de longue durée'
      ]
    };
  }
}
