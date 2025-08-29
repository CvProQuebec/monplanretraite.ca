/**
 * Service de Conseiller Intelligent - Phase 3 Modules Néophytes
 * Fournit des conseils personnalisés et contextuels basés sur l'expertise Retraite101
 * Intelligence artificielle locale pour recommandations adaptées
 */

import { FinancialData } from './ErrorPreventionService';
import { UserProfile } from './OnboardingService';

export interface SmartAdvice {
  id: string;
  category: 'budget' | 'savings' | 'investment' | 'retirement' | 'debt' | 'tax' | 'emergency';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionSteps: string[];
  expectedImpact: string;
  timeframe: 'immediate' | 'short' | 'medium' | 'long'; // 0-1 mois, 1-6 mois, 6-24 mois, 2+ ans
  difficulty: 'easy' | 'moderate' | 'advanced';
  estimatedSavings?: number;
  relatedTools: string[];
  tags: string[];
  context: string;
}

export interface AdviceContext {
  userProfile: UserProfile;
  financialData: FinancialData;
  currentGoals: string[];
  completedActions: string[];
  seasonalFactors: SeasonalFactor[];
  marketConditions?: MarketCondition;
}

export interface SeasonalFactor {
  season: 'spring' | 'summer' | 'fall' | 'winter';
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface MarketCondition {
  trend: 'bull' | 'bear' | 'sideways';
  volatility: 'low' | 'medium' | 'high';
  interestRates: 'rising' | 'falling' | 'stable';
  inflationRate: number;
}

export class SmartAdvisorService {
  private static instance: SmartAdvisorService;
  
  public static getInstance(): SmartAdvisorService {
    if (!SmartAdvisorService.instance) {
      SmartAdvisorService.instance = new SmartAdvisorService();
    }
    return SmartAdvisorService.instance;
  }

  /**
   * Génère des conseils personnalisés basés sur le contexte utilisateur
   */
  public generatePersonalizedAdvice(context: AdviceContext): SmartAdvice[] {
    const allAdvice: SmartAdvice[] = [];

    // Conseils basés sur les erreurs détectées
    allAdvice.push(...this.getBudgetAdvice(context));
    allAdvice.push(...this.getSavingsAdvice(context));
    allAdvice.push(...this.getRetirementAdvice(context));
    allAdvice.push(...this.getDebtAdvice(context));
    allAdvice.push(...this.getInvestmentAdvice(context));
    allAdvice.push(...this.getTaxAdvice(context));
    allAdvice.push(...this.getEmergencyAdvice(context));
    allAdvice.push(...this.getSeasonalAdvice(context));

    // Filtrer et prioriser selon le profil utilisateur
    const filteredAdvice = this.filterAdviceForUser(allAdvice, context);
    
    // Trier par priorité et pertinence
    return this.prioritizeAdvice(filteredAdvice, context);
  }

  /**
   * Conseils budgétaires intelligents
   */
  private getBudgetAdvice(context: AdviceContext): SmartAdvice[] {
    const advice: SmartAdvice[] = [];
    const { financialData, userProfile } = context;
    const surplus = financialData.monthlyIncome - financialData.monthlyExpenses;

    if (surplus < 0) {
      advice.push({
        id: 'budget-deficit-action',
        category: 'budget',
        priority: 'high',
        title: 'Plan d\'urgence pour équilibrer votre budget',
        description: 'Votre budget est déficitaire. Une action immédiate est nécessaire pour éviter l\'endettement.',
        actionSteps: [
          'Listez toutes vos dépenses des 3 derniers mois',
          'Identifiez les 3 plus gros postes de dépenses',
          'Trouvez 2-3 dépenses non essentielles à éliminer temporairement',
          'Explorez des sources de revenus supplémentaires',
          'Fixez-vous un objectif d\'équilibre dans les 30 jours'
        ],
        expectedImpact: `Économies potentielles de ${this.formatCurrency(Math.abs(surplus))} par mois`,
        timeframe: 'immediate',
        difficulty: 'moderate',
        estimatedSavings: Math.abs(surplus),
        relatedTools: ['budget-calculator', 'expense-tracker'],
        tags: ['urgent', 'budget', 'dépenses'],
        context: 'Budget déficitaire nécessitant une action immédiate'
      });
    } else if (surplus < 200) {
      advice.push({
        id: 'budget-optimization',
        category: 'budget',
        priority: 'medium',
        title: 'Optimisez votre budget pour plus de flexibilité',
        description: 'Votre budget est équilibré mais serré. Créez plus de marge de manœuvre.',
        actionSteps: [
          'Analysez vos abonnements et services récurrents',
          'Négociez vos contrats (assurance, téléphone, internet)',
          'Planifiez vos achats importants pour profiter des soldes',
          'Explorez les programmes de fidélité et cashback',
          'Automatisez un petit montant d\'épargne (25-50$/mois)'
        ],
        expectedImpact: 'Création d\'une marge de sécurité de 100-200$ par mois',
        timeframe: 'short',
        difficulty: 'easy',
        estimatedSavings: 150,
        relatedTools: ['budget-optimizer', 'savings-calculator'],
        tags: ['optimisation', 'marge', 'sécurité'],
        context: 'Budget serré nécessitant une optimisation'
      });
    }

    return advice;
  }

  /**
   * Conseils d'épargne stratégiques
   */
  private getSavingsAdvice(context: AdviceContext): SmartAdvice[] {
    const advice: SmartAdvice[] = [];
    const { financialData, userProfile } = context;

    if (financialData.savingsRate < 0.10) {
      const targetSavings = financialData.monthlyIncome * 0.10;
      const currentSavings = financialData.monthlyIncome * financialData.savingsRate;
      const gap = targetSavings - currentSavings;

      advice.push({
        id: 'increase-savings-rate',
        category: 'savings',
        priority: 'high',
        title: 'Stratégie pour atteindre 10% d\'épargne',
        description: 'Augmentez progressivement votre taux d\'épargne pour sécuriser votre avenir financier.',
        actionSteps: [
          'Commencez par épargner 1% de plus ce mois-ci',
          'Automatisez un virement hebdomadaire de ' + this.formatCurrency(gap / 4),
          'Utilisez la règle "payez-vous en premier"',
          'Épargnez tous les montants "bonus" (remboursements, cadeaux)',
          'Augmentez votre épargne de 1% à chaque augmentation de salaire'
        ],
        expectedImpact: `Épargne supplémentaire de ${this.formatCurrency(gap)} par mois`,
        timeframe: 'medium',
        difficulty: 'moderate',
        estimatedSavings: gap * 12,
        relatedTools: ['savings-calculator', 'automatic-savings-planner'],
        tags: ['épargne', 'automatisation', 'objectifs'],
        context: 'Taux d\'épargne insuffisant pour les objectifs à long terme'
      });
    }

    // Conseil spécifique selon l'âge
    if (userProfile.age < 30 && financialData.savingsRate > 0.15) {
      advice.push({
        id: 'young-investor-opportunity',
        category: 'investment',
        priority: 'medium',
        title: 'Profitez de votre jeune âge pour investir',
        description: 'Votre excellent taux d\'épargne et votre horizon temporel long vous donnent un avantage énorme.',
        actionSteps: [
          'Ouvrez un CELI si ce n\'est pas déjà fait',
          'Considérez un portefeuille équilibré (60% actions, 40% obligations)',
          'Investissez régulièrement (même 100$/mois fait une différence)',
          'Éduquez-vous sur les FNB (ETF) à faibles frais',
          'Révisez votre stratégie annuellement'
        ],
        expectedImpact: 'Potentiel de croissance de 6-7% annuellement sur 30+ ans',
        timeframe: 'long',
        difficulty: 'moderate',
        relatedTools: ['investment-calculator', 'risk-assessment'],
        tags: ['jeune', 'investissement', 'croissance', 'long-terme'],
        context: 'Jeune épargnant avec potentiel d\'investissement élevé'
      });
    }

    return advice;
  }

  /**
   * Conseils retraite personnalisés
   */
  private getRetirementAdvice(context: AdviceContext): SmartAdvice[] {
    const advice: SmartAdvice[] = [];
    const { financialData, userProfile } = context;
    const yearsToRetirement = userProfile.retirementAge - userProfile.age;

    if (yearsToRetirement > 10 && financialData.retirementSavings < financialData.monthlyExpenses * 12 * 2) {
      advice.push({
        id: 'retirement-catch-up',
        category: 'retirement',
        priority: 'high',
        title: 'Accélérez votre épargne retraite maintenant',
        description: 'Vous avez encore du temps, mais il faut agir pour rattraper le retard.',
        actionSteps: [
          'Calculez votre objectif retraite avec la règle du 4%',
          'Maximisez vos cotisations REER pour la déduction fiscale',
          'Utilisez le remboursement d\'impôt pour cotiser au CELI',
          'Augmentez vos cotisations de 1% chaque année',
          'Considérez un conseiller financier si l\'écart est important'
        ],
        expectedImpact: 'Réduction significative de l\'écart retraite',
        timeframe: 'long',
        difficulty: 'moderate',
        relatedTools: ['retirement-calculator', 'rrsp-calculator'],
        tags: ['retraite', 'rattrapage', 'REER', 'CELI'],
        context: 'Épargne retraite insuffisante avec temps de rattrapage disponible'
      });
    }

    if (yearsToRetirement < 10 && yearsToRetirement > 0) {
      advice.push({
        id: 'pre-retirement-strategy',
        category: 'retirement',
        priority: 'high',
        title: 'Stratégie de pré-retraite : sécurisez vos acquis',
        description: 'Approchant de la retraite, il est temps de sécuriser et optimiser vos placements.',
        actionSteps: [
          'Réduisez graduellement votre exposition aux actions (règle 100 - âge)',
          'Planifiez votre stratégie de décaissement',
          'Optimisez l\'ordre de retrait (REER vs CELI vs non-enregistré)',
          'Considérez le fractionnement de revenus avec votre conjoint',
          'Planifiez vos dépenses de retraite en détail'
        ],
        expectedImpact: 'Optimisation fiscale et réduction des risques',
        timeframe: 'medium',
        difficulty: 'advanced',
        relatedTools: ['withdrawal-calculator', 'tax-optimizer'],
        tags: ['pré-retraite', 'sécurisation', 'fiscalité'],
        context: 'Approche de la retraite nécessitant une stratégie conservatrice'
      });
    }

    return advice;
  }

  /**
   * Conseils de gestion de dettes
   */
  private getDebtAdvice(context: AdviceContext): SmartAdvice[] {
    const advice: SmartAdvice[] = [];
    const { financialData } = context;

    if (financialData.totalDebt > 0) {
      const monthlyDebtPayment = financialData.totalDebt * 0.05; // Estimation 5% par mois
      const debtToIncomeRatio = monthlyDebtPayment / financialData.monthlyIncome;

      if (debtToIncomeRatio > 0.3) {
        advice.push({
          id: 'debt-consolidation-strategy',
          category: 'debt',
          priority: 'high',
          title: 'Plan de consolidation et remboursement accéléré',
          description: 'Votre niveau d\'endettement limite votre capacité d\'épargne. Agissez maintenant.',
          actionSteps: [
            'Listez toutes vos dettes avec taux d\'intérêt et soldes',
            'Explorez la consolidation de dettes à taux réduit',
            'Appliquez la méthode avalanche (plus haut taux en premier)',
            'Négociez avec vos créanciers pour réduire les taux',
            'Évitez absolument de nouvelles dettes'
          ],
          expectedImpact: `Économies potentielles de ${this.formatCurrency(monthlyDebtPayment * 0.2)} par mois en intérêts`,
          timeframe: 'medium',
          difficulty: 'moderate',
          estimatedSavings: monthlyDebtPayment * 0.2 * 12,
          relatedTools: ['debt-calculator', 'consolidation-planner'],
          tags: ['dettes', 'consolidation', 'intérêts'],
          context: 'Endettement élevé nécessitant une stratégie de remboursement'
        });
      }
    }

    return advice;
  }

  /**
   * Conseils d'investissement adaptés
   */
  private getInvestmentAdvice(context: AdviceContext): SmartAdvice[] {
    const advice: SmartAdvice[] = [];
    const { userProfile, financialData } = context;

    if (userProfile.hasFinancialExperience && financialData.emergencyFund >= financialData.monthlyExpenses * 3) {
      advice.push({
        id: 'diversification-strategy',
        category: 'investment',
        priority: 'medium',
        title: 'Diversifiez vos placements pour optimiser le rendement',
        description: 'Votre situation financière stable vous permet d\'explorer des stratégies d\'investissement plus sophistiquées.',
        actionSteps: [
          'Évaluez votre allocation d\'actifs actuelle',
          'Considérez l\'ajout d\'actifs internationaux (20-30%)',
          'Explorez les FNB sectoriels pour la diversification',
          'Rééquilibrez votre portefeuille annuellement',
          'Surveillez les frais de gestion (visez moins de 0.5%)'
        ],
        expectedImpact: 'Amélioration potentielle du rendement de 0.5-1% annuellement',
        timeframe: 'long',
        difficulty: 'advanced',
        relatedTools: ['portfolio-analyzer', 'rebalancing-calculator'],
        tags: ['diversification', 'FNB', 'rendement'],
        context: 'Investisseur expérimenté avec base financière solide'
      });
    }

    return advice;
  }

  /**
   * Conseils fiscaux optimisés
   */
  private getTaxAdvice(context: AdviceContext): SmartAdvice[] {
    const advice: SmartAdvice[] = [];
    const { financialData, userProfile } = context;

    // Conseil de fin d'année fiscale
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 10) { // Novembre-Décembre
      advice.push({
        id: 'year-end-tax-planning',
        category: 'tax',
        priority: 'medium',
        title: 'Optimisation fiscale de fin d\'année',
        description: 'Profitez des dernières semaines de l\'année pour optimiser votre situation fiscale.',
        actionSteps: [
          'Maximisez vos cotisations REER avant le 1er mars',
          'Réalisez vos pertes en capital si applicable',
          'Planifiez vos dons de charité pour la déduction',
          'Considérez le fractionnement de revenus avec votre conjoint',
          'Préparez vos documents pour la déclaration'
        ],
        expectedImpact: 'Réduction potentielle d\'impôt de 500-2000$',
        timeframe: 'immediate',
        difficulty: 'moderate',
        estimatedSavings: 1000,
        relatedTools: ['tax-calculator', 'rrsp-optimizer'],
        tags: ['fiscalité', 'fin-année', 'REER', 'déductions'],
        context: 'Période propice à l\'optimisation fiscale de fin d\'année'
      });
    }

    return advice;
  }

  /**
   * Conseils de fonds d'urgence
   */
  private getEmergencyAdvice(context: AdviceContext): SmartAdvice[] {
    const advice: SmartAdvice[] = [];
    const { financialData } = context;
    const recommendedFund = financialData.monthlyExpenses * 3;

    if (financialData.emergencyFund < recommendedFund * 0.5) {
      advice.push({
        id: 'emergency-fund-priority',
        category: 'emergency',
        priority: 'high',
        title: 'Constituez votre fonds d\'urgence en priorité',
        description: 'Un fonds d\'urgence vous protège des imprévus et évite l\'endettement.',
        actionSteps: [
          'Ouvrez un compte épargne à taux élevé séparé',
          'Automatisez un virement de ' + this.formatCurrency((recommendedFund - financialData.emergencyFund) / 12) + ' par mois',
          'Utilisez tous les montants "bonus" pour accélérer',
          'Gardez ce fonds facilement accessible mais séparé',
          'Ne touchez à ce fonds qu\'en vraie urgence'
        ],
        expectedImpact: `Sécurité financière pour ${Math.round(recommendedFund / financialData.monthlyExpenses)} mois de dépenses`,
        timeframe: 'short',
        difficulty: 'easy',
        relatedTools: ['emergency-fund-calculator'],
        tags: ['urgence', 'sécurité', 'automatisation'],
        context: 'Fonds d\'urgence insuffisant pour la sécurité financière'
      });
    }

    return advice;
  }

  /**
   * Conseils saisonniers
   */
  private getSeasonalAdvice(context: AdviceContext): SmartAdvice[] {
    const advice: SmartAdvice[] = [];
    const currentMonth = new Date().getMonth();

    // Conseils de printemps (mars-mai)
    if (currentMonth >= 2 && currentMonth <= 4) {
      advice.push({
        id: 'spring-financial-cleanup',
        category: 'budget',
        priority: 'low',
        title: 'Grand ménage financier de printemps',
        description: 'Profitez du printemps pour faire le ménage dans vos finances.',
        actionSteps: [
          'Révisez et mettez à jour votre budget',
          'Annulez les abonnements non utilisés',
          'Organisez vos documents financiers',
          'Planifiez vos objectifs financiers pour l\'année',
          'Faites le point sur vos assurances'
        ],
        expectedImpact: 'Organisation améliorée et économies potentielles',
        timeframe: 'immediate',
        difficulty: 'easy',
        relatedTools: ['budget-review', 'goal-planner'],
        tags: ['organisation', 'révision', 'printemps'],
        context: 'Période idéale pour la révision financière annuelle'
      });
    }

    // Conseils d'été (juin-août)
    if (currentMonth >= 5 && currentMonth <= 7) {
      advice.push({
        id: 'summer-savings-boost',
        category: 'savings',
        priority: 'low',
        title: 'Boostez vos épargnes pendant l\'été',
        description: 'Profitez des activités gratuites de l\'été pour épargner davantage.',
        actionSteps: [
          'Profitez des activités gratuites (parcs, plages, festivals)',
          'Cultivez un jardin pour réduire les coûts alimentaires',
          'Organisez des échanges de services avec vos voisins',
          'Planifiez des vacances économiques (camping, échange de maisons)',
          'Vendez les objets dont vous ne vous servez plus'
        ],
        expectedImpact: 'Économies supplémentaires de 200-500$ sur la saison',
        timeframe: 'short',
        difficulty: 'easy',
        estimatedSavings: 350,
        relatedTools: ['expense-tracker'],
        tags: ['été', 'économies', 'activités-gratuites'],
        context: 'Opportunités d\'économies saisonnières estivales'
      });
    }

    return advice;
  }

  /**
   * Filtre les conseils selon le profil utilisateur
   */
  private filterAdviceForUser(advice: SmartAdvice[], context: AdviceContext): SmartAdvice[] {
    const { userProfile } = context;
    
    return advice.filter(item => {
      // Filtrer selon l'expérience
      if (!userProfile.hasFinancialExperience && item.difficulty === 'advanced') {
        return false;
      }
      
      // Filtrer selon l'objectif principal
      if (userProfile.primaryGoal !== 'investment' && item.category === 'investment' && item.difficulty === 'advanced') {
        return false;
      }
      
      // Filtrer selon le temps disponible
      if (userProfile.timeAvailable === 'quick' && item.timeframe === 'long') {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Priorise les conseils selon le contexte
   */
  private prioritizeAdvice(advice: SmartAdvice[], context: AdviceContext): SmartAdvice[] {
    return advice.sort((a, b) => {
      // Priorité par urgence
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Puis par impact financier estimé
      const aImpact = a.estimatedSavings || 0;
      const bImpact = b.estimatedSavings || 0;
      
      return bImpact - aImpact;
    });
  }

  /**
   * Obtient des conseils rapides pour le tableau de bord
   */
  public getQuickTips(context: AdviceContext): SmartAdvice[] {
    const allAdvice = this.generatePersonalizedAdvice(context);
    return allAdvice
      .filter(advice => advice.difficulty === 'easy' && advice.timeframe === 'immediate')
      .slice(0, 3);
  }

  /**
   * Obtient des conseils par catégorie
   */
  public getAdviceByCategory(context: AdviceContext, category: SmartAdvice['category']): SmartAdvice[] {
    const allAdvice = this.generatePersonalizedAdvice(context);
    return allAdvice.filter(advice => advice.category === category);
  }

  /**
   * Marque un conseil comme complété
   */
  public markAdviceCompleted(adviceId: string): void {
    const completedAdvice = this.getCompletedAdvice();
    completedAdvice.add(adviceId);
    localStorage.setItem('completed-advice', JSON.stringify([...completedAdvice]));
  }

  /**
   * Récupère les conseils complétés
   */
  public getCompletedAdvice(): Set<string> {
    const stored = localStorage.getItem('completed-advice');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  }

  /**
   * Formate un montant en devise canadienne
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Génère des conseils contextuels basés sur l'activité récente
   */
  public getContextualAdvice(recentActivity: string[], context: AdviceContext): SmartAdvice[] {
    const advice: SmartAdvice[] = [];
    
    if (recentActivity.includes('budget-updated')) {
      advice.push({
        id: 'budget-follow-up',
        category: 'budget',
        priority: 'medium',
        title: 'Excellent ! Maintenant automatisez votre épargne',
        description: 'Vous avez mis à jour votre budget. L\'étape suivante est d\'automatiser vos épargnes.',
        actionSteps: [
          'Configurez un virement automatique vers votre épargne',
          'Choisissez une date juste après votre paie',
          'Commencez petit (50-100$) et augmentez graduellement'
        ],
        expectedImpact: 'Épargne constante et sans effort',
        timeframe: 'immediate',
        difficulty: 'easy',
        relatedTools: ['automatic-savings'],
        tags: ['suivi', 'automatisation', 'épargne'],
        context: 'Suite logique après mise à jour du budget'
      });
    }
    
    return advice;
  }
}

export default SmartAdvisorService;
