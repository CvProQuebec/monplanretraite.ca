/**
 * FourPercentRuleService - Service de Calcul Règle du 4%
 * Implémentation complète de la règle Trinity Study mise à jour
 * CALCULS PRÉCIS | RECOMMANDATIONS PERSONNALISÉES | INTÉGRATION SENIORS
 */

import { UserData } from '@/types';
import type { SavingsData, CashflowData } from '@/features/retirement/types';

export interface FourPercentCalculation {
  // Calculs de base
  totalPortfolio: number;
  annualWithdrawal: number;
  monthlyWithdrawal: number;
  withdrawalRate: number; // Taux réel calculé
  
  // Analyses de sécurité
  safetyLevel: 'excellent' | 'good' | 'moderate' | 'risky' | 'dangerous';
  probabilityOfSuccess: number; // Probabilité sur 30 ans
  yearsOfSafety: number; // Nombre d'années estimées
  
  // Comparaisons
  currentExpenses: number;
  expensesCoverage: number; // Pourcentage couvert
  monthlyShortfall: number; // Manque mensuel si négatif
  
  // Recommandations
  recommendedPortfolioSize: number; // Pour couvrir les dépenses actuelles
  additionalSavingsNeeded: number;
  timeToReachTarget: number; // En années avec épargne actuelle
  
  // Optimisations
  optimizedWithdrawalRate: number;
  inflationAdjustment: number;
  sequenceRiskMitigation: string[];
}

export interface PortfolioComposition {
  stocks: number; // Pourcentage
  bonds: number; // Pourcentage
  cash: number; // Pourcentage
  reer: number; // Montant
  celi: number; // Montant
  nonRegistered: number; // Montant
  riskProfile: 'conservative' | 'moderate' | 'balanced' | 'growth' | 'aggressive';
}

export interface WithdrawalStrategy {
  name: string;
  description: string;
  rateYear1: number;
  rateYear5: number;
  rateYear10: number;
  rateYear20: number;
  rateYear30: number;
  advantages: string[];
  disadvantages: string[];
  suitability: 'low' | 'medium' | 'high';
}

export interface FourPercentRecommendations {
  primaryStrategy: WithdrawalStrategy;
  alternativeStrategies: WithdrawalStrategy[];
  portfolioAdjustments: string[];
  taxOptimizations: string[];
  riskMitigations: string[];
  actionItems: ActionItem[];
}

export interface ActionItem {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'savings' | 'portfolio' | 'tax' | 'risk' | 'expenses';
  action: string;
  impact: string;
  timeframe: string;
  difficulty: 'easy' | 'moderate' | 'complex';
}

export class FourPercentRuleService {
  
  // ===== PARAMÈTRES DE LA RÈGLE DU 4% MODERNE =====
  
  private static readonly FOUR_PERCENT_PARAMS = {
    // Trinity Study original (1998) et mises à jour modernes
    SAFE_WITHDRAWAL_RATE: 0.04, // 4% classique
    CONSERVATIVE_RATE: 0.035, // 3.5% pour plus de sécurité
    AGGRESSIVE_RATE: 0.045, // 4.5% pour portefeuilles dynamiques
    
    // Probabilités de succès sur 30 ans selon Bengen/Trinity
    SUCCESS_PROBABILITY_4_PERCENT: 0.95, // 95% de succès historique
    SUCCESS_PROBABILITY_3_5_PERCENT: 0.98, // 98% de succès
    SUCCESS_PROBABILITY_5_PERCENT: 0.85, // 85% de succès
    
    // Ajustements modernes (Morningstar, Vanguard 2020+)
    INFLATION_ADJUSTMENT: 0.025, // 2.5% inflation moyenne
    SEQUENCE_RISK_BUFFER: 0.1, // 10% de liquidités pour les mauvaises années
    LONGEVITY_ADJUSTMENT: 1.15, // +15% pour longévité croissante
    
    // Allocation recommandée selon l'âge
    STOCK_ALLOCATION_FORMULA: 110, // 110 - âge = % actions
    MIN_STOCK_ALLOCATION: 0.30, // Minimum 30% actions
    MAX_STOCK_ALLOCATION: 0.80, // Maximum 80% actions
    
    // Limites de sécurité
    MIN_PORTFOLIO_SIZE: 100000, // Portfolio minimum pour la règle
    MAX_WITHDRAWAL_RATE: 0.06, // 6% maximum raisonnable
    MIN_CASH_BUFFER: 12 // 12 mois de dépenses en liquidités
  };

  /**
   * FONCTION PRINCIPALE: Calcul complet de la règle du 4%
   */
  static calculateFourPercentRule(userData: UserData): FourPercentCalculation {
    console.log('🔍 Début calcul règle du 4%...');
    
    // Extraire les données pertinentes
    const portfolioData = this.extractPortfolioData(userData);
    const expenseData = this.extractExpenseData(userData);
    const ageData = this.extractAgeData(userData);
    
    // Calculs de base
    const totalPortfolio = portfolioData.total;
    const annualWithdrawal = totalPortfolio * this.FOUR_PERCENT_PARAMS.SAFE_WITHDRAWAL_RATE;
    const monthlyWithdrawal = annualWithdrawal / 12;
    
    // Analyses de sécurité
    const safetyAnalysis = this.analyzeSafetyLevel(totalPortfolio, expenseData.monthlyTotal, ageData.age);
    
    // Taux de retrait actuel (ratio 0..1) et allocation par défaut (règle 110 - âge, bornée 30-80%)
    const withdrawalRateActual = totalPortfolio > 0 ? (expenseData.monthlyTotal * 12) / totalPortfolio : 0;
    const defaultStockAllocation = Math.max(
      this.FOUR_PERCENT_PARAMS.MIN_STOCK_ALLOCATION,
      Math.min(
        this.FOUR_PERCENT_PARAMS.MAX_STOCK_ALLOCATION,
        (this.FOUR_PERCENT_PARAMS.STOCK_ALLOCATION_FORMULA - ageData.age) / 100
      )
    );
    // Probabilité de succès selon la matrice Trinity (retourne un ratio 0..1)
    const trinityProbability = this.calculateTrinityProbability(withdrawalRateActual * 100, defaultStockAllocation, 30);
    
    // Comparaisons avec dépenses
    const expensesCoverage = expenseData.monthlyTotal > 0 
      ? (monthlyWithdrawal / expenseData.monthlyTotal) * 100 
      : 0;
    const monthlyShortfall = monthlyWithdrawal - expenseData.monthlyTotal;
    
    // Recommandations
    const recommendedPortfolioSize = expenseData.monthlyTotal * 12 / this.FOUR_PERCENT_PARAMS.SAFE_WITHDRAWAL_RATE;
    const additionalSavingsNeeded = Math.max(0, recommendedPortfolioSize - totalPortfolio);
    
    // Calcul du temps pour atteindre l'objectif
    const currentSavingsRate = this.estimateSavingsRate(userData);
    const timeToReachTarget = additionalSavingsNeeded > 0 && currentSavingsRate > 0
      ? Math.ceil(additionalSavingsNeeded / (currentSavingsRate * 12))
      : 0;

    // Optimisations
    const optimizedWithdrawalRate = this.calculateOptimizedRate(totalPortfolio, expenseData.monthlyTotal, ageData.age);
    const inflationAdjustment = expenseData.monthlyTotal * this.FOUR_PERCENT_PARAMS.INFLATION_ADJUSTMENT;

    const result: FourPercentCalculation = {
      totalPortfolio,
      annualWithdrawal,
      monthlyWithdrawal,
      withdrawalRate: withdrawalRateActual,
      
      safetyLevel: safetyAnalysis.level,
      probabilityOfSuccess: trinityProbability,
      yearsOfSafety: safetyAnalysis.years,
      
      currentExpenses: expenseData.monthlyTotal,
      expensesCoverage,
      monthlyShortfall,
      
      recommendedPortfolioSize,
      additionalSavingsNeeded,
      timeToReachTarget,
      
      optimizedWithdrawalRate,
      inflationAdjustment,
      sequenceRiskMitigation: this.getSequenceRiskStrategies(totalPortfolio, ageData.age)
    };

    console.log('✅ Calcul règle du 4% terminé:', result);
    return result;
  }

  /**
   * Extraire les données de portefeuille
   */
  private static extractPortfolioData(userData: UserData): { total: number; breakdown: any } {
    const savings = (userData.savings ?? ({} as Partial<SavingsData>));
    
    const reer = savings.reer1 || 0;
    const celi = savings.celi1 || 0;
    const placements = savings.placements1 || 0;
    const epargne = savings.epargne1 || 0;
    const cri = savings.cri1 || 0;
    
    const total = reer + celi + placements + epargne + cri;
    
    return {
      total,
      breakdown: { reer, celi, placements, epargne, cri }
    };
  }

  /**
   * Extraire les données de dépenses
   */
  private static extractExpenseData(userData: UserData): { monthlyTotal: number; breakdown: any } {
    const cashflow = (userData.cashflow ?? ({} as Partial<CashflowData>));
    
    const logement = cashflow.logement || 0;
    const servicesPublics = cashflow.servicesPublics || 0;
    const assurances = cashflow.assurances || 0;
    const telecom = cashflow.telecom || 0;
    const alimentation = cashflow.alimentation || 0;
    const transport = cashflow.transport || 0;
    const sante = cashflow.sante || 0;
    const loisirs = cashflow.loisirs || 0;
    
    const monthlyTotal = logement + servicesPublics + assurances + telecom + 
                        alimentation + transport + sante + loisirs;
    
    return {
      monthlyTotal,
      breakdown: { logement, servicesPublics, assurances, telecom, alimentation, transport, sante, loisirs }
    };
  }

  /**
   * Extraire l'âge de l'utilisateur
   */
  private static extractAgeData(userData: UserData): { age: number; yearsToRetirement: number } {
    const naissance1 = userData.personal?.naissance1;
    
    let age = 65; // Âge par défaut
    if (naissance1) {
      const birthDate = new Date(naissance1);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }
    
    const ageRetraite = userData.personal?.ageRetraiteSouhaite1 || 65;
    const yearsToRetirement = Math.max(0, ageRetraite - age);
    
    return { age, yearsToRetirement };
  }

  /**
   * Analyser le niveau de sécurité
   */
  private static analyzeSafetyLevel(portfolio: number, monthlyExpenses: number, age: number): {
    level: 'excellent' | 'good' | 'moderate' | 'risky' | 'dangerous';
    probability: number;
    years: number;
  } {
    if (portfolio === 0 || monthlyExpenses === 0) {
      return { level: 'dangerous', probability: 0, years: 0 };
    }

    const withdrawalRate = (monthlyExpenses * 12) / portfolio;
    let level: 'excellent' | 'good' | 'moderate' | 'risky' | 'dangerous';
    let probability: number;
    let years: number;

    if (withdrawalRate <= 0.03) {
      level = 'excellent';
      probability = 0.99;
      years = 40;
    } else if (withdrawalRate <= 0.04) {
      level = 'good';
      probability = 0.95;
      years = 30;
    } else if (withdrawalRate <= 0.05) {
      level = 'moderate';
      probability = 0.85;
      years = 25;
    } else if (withdrawalRate <= 0.07) {
      level = 'risky';
      probability = 0.70;
      years = 20;
    } else {
      level = 'dangerous';
      probability = 0.50;
      years = 15;
    }

    // Ajustement selon l'âge (plus jeune = plus risqué)
    if (age < 50) {
      years = Math.max(years - 5, 10);
      probability = Math.max(probability - 0.1, 0.3);
    } else if (age > 70) {
      years = Math.min(years + 5, 35);
      probability = Math.min(probability + 0.05, 0.99);
    }

    return { level, probability, years };
  }

  /**
   * Calculer le taux optimisé selon la situation
   */
  private static calculateOptimizedRate(portfolio: number, monthlyExpenses: number, age: number): number {
    // Règle de base selon l'âge
    let baseRate = this.FOUR_PERCENT_PARAMS.SAFE_WITHDRAWAL_RATE;
    
    // Ajustement selon l'âge
    if (age < 55) {
      baseRate = 0.035; // Plus conservateur pour les jeunes
    } else if (age > 75) {
      baseRate = 0.045; // Légèrement plus agressif pour les plus âgés
    }
    
    // Ajustement selon la taille du portefeuille
    if (portfolio < 250000) {
      baseRate = Math.max(baseRate - 0.005, 0.025); // Plus conservateur
    } else if (portfolio > 1000000) {
      baseRate = Math.min(baseRate + 0.005, 0.05); // Légèrement plus agressif
    }
    
    return baseRate;
  }

  /**
   * Estimer le taux d'épargne actuel
   */
  private static estimateSavingsRate(userData: UserData): number {
    const salaire = userData.personal?.salaire1 || 0;
    const expenses = this.extractExpenseData(userData).monthlyTotal * 12;
    
    if (salaire === 0) return 0;
    
    // Estimation: 10-15% du revenu net en épargne
    const netIncome = salaire * 0.75; // Approximation après impôts
    const estimatedSavings = Math.max(0, netIncome - expenses) * 0.5; // 50% du surplus
    
    return Math.max(estimatedSavings / 12, salaire * 0.05 / 12); // Minimum 5% du salaire
  }

  /**
   * Stratégies de mitigation du risque de séquence
   */
  private static getSequenceRiskStrategies(portfolio: number, age: number): string[] {
    const strategies: string[] = [];
    
    // Stratégies de base
    strategies.push('Garder 12-24 mois de dépenses en liquidités');
    strategies.push('Diversifier géographiquement (Canada, É-U, International)');
    
    // Selon la taille du portefeuille
    if (portfolio < 500000) {
      strategies.push('Privilégier les FNB à faible coût');
      strategies.push('Reporter la retraite de 2-3 ans si possible');
    } else {
      strategies.push('Considérer une stratégie bucket (compartiments)');
      strategies.push('Utiliser des produits à revenu fixe de qualité');
    }
    
    // Selon l'âge
    if (age < 60) {
      strategies.push('Maintenir 60-70% en actions pour la croissance');
      strategies.push('Réinvestir les dividendes pendant l\'accumulation');
    } else {
      strategies.push('Réduire graduellement l\'exposition aux actions');
      strategies.push('Privilégier les dividendes et distributions stables');
    }
    
    return strategies;
  }

  /**
   * Obtenir les stratégies de retrait disponibles
   */
  /**
   * Probabilité de succès Trinity Study modernisée (sur 30 ans)
   * - withdrawalRate: en pourcentage (ex: 4.0 pour 4 %)
   * - stockAllocation: ratio 0..1 (ex: 0.60 pour 60 % actions)
   * - timeHorizon: années (par défaut 30)
   * Retourne un ratio 0..1 (ex: 0.95 = 95 %)
   */
  static calculateTrinityProbability(
    withdrawalRate: number,
    stockAllocation: number,
    timeHorizon: number = 30
  ): number {
    // Pour l'instant, la matrice cible un horizon de 30 ans; on pourra ajuster par pénalité si != 30
    const trinityMatrix: Record<'low' | 'medium' | 'high', Record<number, number>> = {
      // Allocation 0-25% actions
      low: {
        3.0: 0.98, 3.5: 0.96, 4.0: 0.92, 4.5: 0.86, 5.0: 0.78,
        5.5: 0.70, 6.0: 0.62, 7.0: 0.45
      },
      // Allocation 25-75% actions
      medium: {
        3.0: 0.99, 3.5: 0.98, 4.0: 0.95, 4.5: 0.90, 5.0: 0.83,
        5.5: 0.76, 6.0: 0.68, 7.0: 0.55
      },
      // Allocation 75-100% actions
      high: {
        3.0: 0.99, 3.5: 0.98, 4.0: 0.96, 4.5: 0.92, 5.0: 0.87,
        5.5: 0.81, 6.0: 0.74, 7.0: 0.63
      }
    };

    const category: 'low' | 'medium' | 'high' =
      stockAllocation < 0.25 ? 'low' : stockAllocation < 0.75 ? 'medium' : 'high';

    // Arrondi au 0,1 le plus proche entre 3.0 et 7.0
    const rounded = Math.round(withdrawalRate * 10) / 10;

    // Clamp aux bornes de la matrice
    const clamped = Math.min(7.0, Math.max(3.0, rounded));

    // Retour de la matrice ou valeur par défaut prudente
    const probability = trinityMatrix[category][clamped as keyof typeof trinityMatrix['low']] ?? 0.5;

    // Ajustement simple si l'horizon diffère de 30 ans (pénalité/bonus léger de 1% par 5 ans d'écart)
    if (timeHorizon !== 30) {
      const diff = timeHorizon - 30;
      const adjustment = Math.max(-0.05, Math.min(0.05, (diff / 5) * 0.01));
      return Math.max(0, Math.min(1, probability + adjustment));
    }

    return probability;
  }

  static getWithdrawalStrategies(userData: UserData): WithdrawalStrategy[] {
    const age = this.extractAgeData(userData).age;
    const portfolio = this.extractPortfolioData(userData).total;
    
    const strategies: WithdrawalStrategy[] = [
      {
        name: 'Règle du 4% classique',
        description: 'Retrait initial de 4%, ajusté annuellement pour l\'inflation',
        rateYear1: 0.04,
        rateYear5: 0.042,
        rateYear10: 0.045,
        rateYear20: 0.050,
        rateYear30: 0.055,
        advantages: ['Simple à comprendre', 'Historiquement fiable', 'Prévisible'],
        disadvantages: ['Rigide', 'Ne s\'adapte pas aux conditions de marché'],
        suitability: portfolio > 500000 ? 'high' : 'medium'
      },
      {
        name: 'Stratégie dynamique',
        description: 'Taux ajusté selon les performances du marché',
        rateYear1: 0.04,
        rateYear5: 0.035,
        rateYear10: 0.045,
        rateYear20: 0.040,
        rateYear30: 0.042,
        advantages: ['S\'adapte aux conditions', 'Réduit le risque de séquence'],
        disadvantages: ['Plus complexe', 'Revenus variables'],
        suitability: 'high'
      },
      {
        name: 'Stratégie buckets (compartiments)',
        description: 'Division en compartiments court/moyen/long terme',
        rateYear1: 0.03,
        rateYear5: 0.04,
        rateYear10: 0.045,
        rateYear20: 0.04,
        rateYear30: 0.035,
        advantages: ['Sécurité élevée', 'Gestion du risque optimale'],
        disadvantages: ['Complexe à gérer', 'Nécessite un gros portefeuille'],
        suitability: portfolio > 750000 ? 'high' : 'low'
      }
    ];
    
    return strategies;
  }

  /**
   * Générer des recommandations personnalisées
   */
  static generateRecommendations(calculation: FourPercentCalculation, userData: UserData): FourPercentRecommendations {
    const strategies = this.getWithdrawalStrategies(userData);
    const primaryStrategy = strategies.find(s => s.suitability === 'high') || strategies[0];
    const alternativeStrategies = strategies.filter(s => s !== primaryStrategy);
    
    const actionItems: ActionItem[] = [];
    
    // Actions selon le niveau de sécurité
    if (calculation.safetyLevel === 'dangerous' || calculation.safetyLevel === 'risky') {
      actionItems.push({
        id: 'increase-savings',
        priority: 'high',
        category: 'savings',
        action: `Épargner ${Math.round(calculation.additionalSavingsNeeded / 1000)}k$ supplémentaires`,
        impact: 'Atteindre la sécurité financière pour la retraite',
        timeframe: `${calculation.timeToReachTarget} ans`,
        difficulty: 'moderate'
      });
    }
    
    if (calculation.monthlyShortfall < 0) {
      actionItems.push({
        id: 'reduce-expenses',
        priority: 'medium',
        category: 'expenses',
        action: `Réduire les dépenses de ${Math.round(Math.abs(calculation.monthlyShortfall))}$/mois`,
        impact: 'Équilibrer le budget retraite avec la règle du 4%',
        timeframe: '6 mois',
        difficulty: 'easy'
      });
    }
    
    return {
      primaryStrategy,
      alternativeStrategies,
      portfolioAdjustments: [
        'Diversifier entre REER, CELI et comptes non-enregistrés',
        'Maintenir une allocation équilibrée actions/obligations',
        'Privilégier les fonds à faible coût (FNB)'
      ],
      taxOptimizations: [
        'Utiliser le fractionnement de pension après 65 ans',
        'Optimiser la séquence de décaissement (CELI en dernier)',
        'Planifier les retraits REER/FERR avant 71 ans'
      ],
      riskMitigations: calculation.sequenceRiskMitigation,
      actionItems
    };
  }
}
