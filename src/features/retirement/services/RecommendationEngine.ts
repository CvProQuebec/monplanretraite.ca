// src/features/retirement/services/RecommendationEngine.ts
import { UserData, Calculations } from '../types';

export interface Recommendation {
  id: string;
  category: 'urgent' | 'important' | 'suggestion' | 'optimization';
  priority: 1 | 2 | 3 | 4 | 5; // 1 = le plus urgent
  title: string;
  description: string;
  impact: string;
  savings?: number; // Économies potentielles
  timeframe: 'immediate' | 'short' | 'medium' | 'long';
  actions: Action[];
  tags: string[];
  confidence: number; // 0-100%
}

export interface Action {
  id: string;
  label: string;
  description: string;
  estimatedTime?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  impact: 'low' | 'medium' | 'high';
}

export interface RecommendationContext {
  age: number;
  yearsToRetirement: number;
  savingsRate: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  hasEmergencyFund: boolean;
  debtToIncomeRatio: number;
  assetAllocation: AssetAllocation;
}

interface AssetAllocation {
  stocks: number;
  bonds: number;
  cash: number;
  realEstate: number;
}

export class RecommendationEngine {
  private static rules: RecommendationRule[] = [
    // Règles d'urgence
    {
      id: 'emergency-fund',
      condition: (ctx) => !ctx.hasEmergencyFund && ctx.monthlyExpenses > 0,
      generate: (ctx, data) => ({
        id: 'emergency-fund',
        category: 'urgent',
        priority: 1,
        title: '🚨 Créez un fonds d\'urgence',
        description: 'Vous n\'avez pas de fonds d\'urgence suffisant. C\'est votre priorité #1.',
        impact: `Protégez-vous contre les imprévus avec ${formatCurrency(ctx.monthlyExpenses * 6)} (6 mois de dépenses)`,
        savings: 0,
        timeframe: 'immediate',
        actions: [
          {
            id: 'open-high-interest',
            label: 'Ouvrir un compte épargne haute rentabilité',
            description: 'Compte séparé pour votre fonds d\'urgence (ex: Tangerine, EQ Bank)',
            difficulty: 'easy',
            impact: 'high'
          },
          {
            id: 'automate-savings',
            label: 'Automatiser l\'épargne',
            description: `Virement automatique de ${formatCurrency(ctx.monthlyExpenses)} par mois`,
            difficulty: 'easy',
            impact: 'high'
          }
        ],
        tags: ['urgent', 'sécurité', 'fondamental'],
        confidence: 100
      })
    },
    
    // Optimisation RRQ
    {
      id: 'rrq-optimization',
      condition: (ctx, data) => {
        const age = data.retirement.rrqAgeActuel1;
        return age >= 60 && age < 65 && !data.retirement.rrqMontantActuel1;
      },
      generate: (ctx, data) => {
        const analysis = ctx.calculations?.rrqOptimization;
        const shouldStart = analysis?.recommandation === 'COMMENCER_MAINTENANT';
        
        return {
          id: 'rrq-optimization',
          category: 'important',
          priority: 2,
          title: '📊 Décision RRQ requise',
          description: shouldStart 
            ? 'Commencer vos prestations RRQ maintenant serait plus avantageux'
            : 'Analyser votre situation RRQ pour une décision optimale',
          impact: analysis 
            ? `Gain potentiel: ${formatCurrency(analysis.difference)}`
            : 'Impact significatif sur vos revenus de retraite',
          savings: analysis?.difference || 0,
          timeframe: 'short',
          actions: [
            {
              id: 'rrq-apply',
              label: 'Faire la demande RRQ',
              description: 'Demande en ligne sur le site de Retraite Québec',
              estimatedTime: '30 minutes',
              difficulty: 'easy',
              impact: 'high'
            },
            {
              id: 'rrq-consult',
              label: 'Consulter un conseiller',
              description: 'Validation de la stratégie optimale pour votre situation',
              difficulty: 'medium',
              impact: 'medium'
            }
          ],
          tags: ['revenus', 'retraite', 'optimisation'],
          confidence: 85
        };
      }
    },
    
    // Optimisation CELI/REER
    {
      id: 'tfsa-rrsp-room',
      condition: (ctx, data) => {
        const celiUsed = data.savings.celi1 + data.savings.celi2;
        const reerUsed = data.savings.reer1 + data.savings.reer2;
        const income = data.personal.salaire1 + data.personal.salaire2;
        const estimatedCeliRoom = 88000 - celiUsed; // Approximation 2024
        const estimatedReerRoom = income * 0.18 - reerUsed;
        
        return (estimatedCeliRoom > 10000 || estimatedReerRoom > 10000) && 
               ctx.savingsRate > 10;
      },
      generate: (ctx, data) => {
        const celiRoom = 88000 - (data.savings.celi1 + data.savings.celi2);
        const income = data.personal.salaire1 + data.personal.salaire2;
        const marginalRate = income > 100000 ? 0.45 : income > 50000 ? 0.37 : 0.27;
        const reerSavings = Math.min(10000, celiRoom) * marginalRate;
        
        return {
          id: 'tfsa-rrsp-room',
          category: 'optimization',
          priority: 3,
          title: '💰 Maximisez vos comptes enregistrés',
          description: `Vous avez de l'espace CELI/REER non utilisé`,
          impact: `Économies d'impôt potentielles: ${formatCurrency(reerSavings)}/an`,
          savings: reerSavings,
          timeframe: 'medium',
          actions: [
            {
              id: 'contribute-tfsa',
              label: `Cotiser ${formatCurrency(Math.min(6500, celiRoom))} au CELI`,
              description: 'Croissance libre d\'impôt pour toujours',
              difficulty: 'easy',
              impact: 'high'
            },
            {
              id: 'contribute-rrsp',
              label: 'Maximiser les cotisations REER',
              description: `Réduction d'impôt de ${(marginalRate * 100).toFixed(0)}%`,
              difficulty: 'easy',
              impact: 'high'
            }
          ],
          tags: ['impôts', 'épargne', 'optimisation'],
          confidence: 90
        };
      }
    },
    
    // Réduction des dépenses
    {
      id: 'expense-optimization',
      condition: (ctx) => ctx.savingsRate < 10 && ctx.monthlyExpenses > ctx.monthlyIncome * 0.8,
      generate: (ctx, data) => {
        const topExpenses = [
          { name: 'Logement', amount: data.cashflow.logement, target: 0.25 },
          { name: 'Transport', amount: data.cashflow.transport, target: 0.15 },
          { name: 'Alimentation', amount: data.cashflow.alimentation, target: 0.10 }
        ];
        
        const overspending = topExpenses
          .filter(e => e.amount > ctx.monthlyIncome * e.target)
          .sort((a, b) => b.amount - a.amount);
        
        return {
          id: 'expense-optimization',
          category: 'important',
          priority: 2,
          title: '📉 Réduisez vos dépenses',
          description: `Votre taux d'épargne (${ctx.savingsRate.toFixed(1)}%) est insuffisant`,
          impact: `Augmentez votre épargne de ${formatCurrency((ctx.monthlyIncome * 0.15) - (ctx.monthlyIncome - ctx.monthlyExpenses))}/mois`,
          savings: (ctx.monthlyIncome * 0.15 - (ctx.monthlyIncome - ctx.monthlyExpenses)) * 12,
          timeframe: 'immediate',
          actions: overspending.slice(0, 3).map(expense => ({
            id: `reduce-${expense.name.toLowerCase()}`,
            label: `Réduire ${expense.name}`,
            description: `Actuellement ${((expense.amount / ctx.monthlyIncome) * 100).toFixed(0)}% du revenu, cible: ${(expense.target * 100).toFixed(0)}%`,
            difficulty: 'medium' as const,
            impact: 'high' as const
          })),
          tags: ['budget', 'épargne', 'urgent'],
          confidence: 95
        };
      }
    },
    
    // Diversification d'actifs
    {
      id: 'asset-diversification',
      condition: (ctx, data) => {
        const totalAssets = Object.entries(data.savings)
          .filter(([key]) => key !== 'residenceValeur' && key !== 'residenceHypotheque')
          .reduce((sum, [, value]) => sum + value, 0);
        
        const cashPercentage = ((data.savings.epargne1 + data.savings.epargne2) / totalAssets) * 100;
        
        return cashPercentage > 30 && totalAssets > 50000;
      },
      generate: (ctx, data) => {
        const cash = data.savings.epargne1 + data.savings.epargne2;
        const excessCash = cash - (ctx.monthlyExpenses * 6);
        
        return {
          id: 'asset-diversification',
          category: 'optimization',
          priority: 3,
          title: '📈 Optimisez votre allocation d\'actifs',
          description: 'Trop d\'argent dort dans des comptes à faible rendement',
          impact: `Gain potentiel: ${formatCurrency(excessCash * 0.04)}/an (4% vs 1%)`,
          savings: excessCash * 0.03, // Différence de 3%
          timeframe: 'medium',
          actions: [
            {
              id: 'invest-etf',
              label: 'Investir dans des FNB diversifiés',
              description: 'XEQT, XGRO ou XBAL selon votre profil',
              difficulty: 'medium',
              impact: 'high'
            },
            {
              id: 'robo-advisor',
              label: 'Utiliser un robot-conseiller',
              description: 'Wealthsimple, Questrade Portfolios pour débuter',
              difficulty: 'easy',
              impact: 'medium'
            }
          ],
          tags: ['investissement', 'rendement', 'diversification'],
          confidence: 80
        };
      }
    }
  ];
  
  /**
   * Génère des recommandations personnalisées
   */
  static generateRecommendations(
    userData: UserData, 
    calculations: Calculations
  ): Recommendation[] {
    const context = this.buildContext(userData, calculations);
    const recommendations: Recommendation[] = [];
    
    // Appliquer chaque règle
    for (const rule of this.rules) {
      if (rule.condition(context, userData)) {
        const recommendation = rule.generate(context, userData);
        recommendations.push(recommendation);
      }
    }
    
    // Ajouter des recommandations basées sur l'âge
    recommendations.push(...this.getAgeBasedRecommendations(context, userData));
    
    // Ajouter des recommandations fiscales
    recommendations.push(...this.getTaxRecommendations(context, userData));
    
    // Trier par priorité
    return recommendations.sort((a, b) => a.priority - b.priority);
  }
  
  /**
   * Construit le contexte pour les règles
   */
  private static buildContext(
    userData: UserData, 
    calculations: Calculations
  ): RecommendationContext & { calculations: Calculations } {
    const age = this.calculateAge(userData.personal.naissance1);
    const monthlyIncome = calculations.monthlyIncome;
    const monthlyExpenses = calculations.monthlyExpenses;
    const savingsRate = monthlyIncome > 0 
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 
      : 0;
    
    // Calculer si fonds d'urgence suffisant
    const liquidAssets = userData.savings.epargne1 + userData.savings.epargne2;
    const hasEmergencyFund = liquidAssets >= (monthlyExpenses * 3);
    
    // Ratio dette/revenu
    const totalDebt = userData.savings.residenceHypotheque;
    const annualIncome = userData.personal.salaire1 + userData.personal.salaire2;
    const debtToIncomeRatio = annualIncome > 0 ? (totalDebt / annualIncome) : 0;
    
    // Allocation d'actifs approximative
    const totalAssets = calculations.netWorth;
    const realEstate = userData.savings.residenceValeur - userData.savings.residenceHypotheque;
    const cash = userData.savings.epargne1 + userData.savings.epargne2;
    const investments = totalAssets - realEstate - cash;
    
    return {
      age,
      yearsToRetirement: Math.max(0, 65 - age),
      savingsRate,
      netWorth: calculations.netWorth,
      monthlyIncome,
      monthlyExpenses,
      hasEmergencyFund,
      debtToIncomeRatio,
      assetAllocation: {
        stocks: totalAssets > 0 ? (investments * 0.7) / totalAssets : 0,
        bonds: totalAssets > 0 ? (investments * 0.3) / totalAssets : 0,
        cash: totalAssets > 0 ? cash / totalAssets : 0,
        realEstate: totalAssets > 0 ? realEstate / totalAssets : 0
      },
      calculations
    };
  }
  
  /**
   * Recommandations basées sur l'âge
   */
  private static getAgeBasedRecommendations(
    context: RecommendationContext,
    userData: UserData
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Pour les 50+
    if (context.age >= 50 && context.age < 60) {
      recommendations.push({
        id: 'catch-up-contributions',
        category: 'suggestion',
        priority: 4,
        title: '⏰ Accélérez votre épargne retraite',
        description: 'Les 10-15 prochaines années sont cruciales pour votre retraite',
        impact: 'Augmentez significativement votre capital de retraite',
        timeframe: 'medium',
        actions: [
          {
            id: 'maximize-registered',
            label: 'Maximiser REER/CELI',
            description: 'Utilisez tout l\'espace disponible',
            difficulty: 'medium',
            impact: 'high'
          },
          {
            id: 'review-allocation',
            label: 'Revoir l\'allocation d\'actifs',
            description: 'Ajuster selon votre horizon de placement',
            difficulty: 'hard',
            impact: 'medium'
          }
        ],
        tags: ['retraite', 'épargne', 'stratégie'],
        confidence: 75
      });
    }
    
    return recommendations;
  }
  
  /**
   * Recommandations fiscales
   */
  private static getTaxRecommendations(
    context: RecommendationContext,
    userData: UserData
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const income = userData.personal.salaire1 + userData.personal.salaire2;
    
    // Fractionnement de revenus
    if (userData.personal.prenom2 && Math.abs(userData.personal.salaire1 - userData.personal.salaire2) > 30000) {
      recommendations.push({
        id: 'income-splitting',
        category: 'optimization',
        priority: 4,
        title: '💑 Optimisez le fractionnement de revenus',
        description: 'Écart important entre les revenus des conjoints',
        impact: 'Réduisez l\'impôt familial global',
        savings: 5000, // Estimation
        timeframe: 'medium',
        actions: [
          {
            id: 'spousal-rrsp',
            label: 'REER de conjoint',
            description: 'Cotiser au REER du conjoint au revenu plus faible',
            difficulty: 'easy',
            impact: 'high'
          },
          {
            id: 'pension-splitting',
            label: 'Préparer le fractionnement de pension',
            description: 'Stratégie pour la retraite',
            difficulty: 'medium',
            impact: 'high'
          }
        ],
        tags: ['impôts', 'couple', 'optimisation'],
        confidence: 85
      });
    }
    
    return recommendations;
  }
  
  private static calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }
}

interface RecommendationRule {
  id: string;
  condition: (context: RecommendationContext, data: UserData) => boolean;
  generate: (context: RecommendationContext & { calculations: Calculations }, data: UserData) => Recommendation;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0
  }).format(amount);
}