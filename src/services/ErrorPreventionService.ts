/**
 * Service de Prévention d'Erreurs - Phase 1 Modules Néophytes
 * Détecte et prévient les 9 erreurs courantes des débutants en planification financière
 * Conforme aux standards Retraite101 et OQLF
 */

export interface ErrorAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'budget' | 'savings' | 'investment' | 'retirement' | 'debt' | 'emergency';
  title: string;
  message: string;
  suggestion: string;
  learnMoreUrl?: string;
  priority: number; // 1-10, 10 étant le plus critique
}

export interface FinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  emergencyFund: number;
  totalDebt: number;
  savingsRate: number;
  retirementSavings: number;
  age: number;
  retirementAge: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  hasRRSP: boolean;
  hasTFSA: boolean;
  hasEmployerPension: boolean;
}

export class ErrorPreventionService {
  private static instance: ErrorPreventionService;
  
  public static getInstance(): ErrorPreventionService {
    if (!ErrorPreventionService.instance) {
      ErrorPreventionService.instance = new ErrorPreventionService();
    }
    return ErrorPreventionService.instance;
  }

  /**
   * Analyse complète des données financières pour détecter les erreurs courantes
   */
  public analyzeFinancialData(data: FinancialData): ErrorAlert[] {
    const alerts: ErrorAlert[] = [];

    // Erreur #1: Budget déséquilibré (dépenses > revenus)
    alerts.push(...this.checkBudgetBalance(data));

    // Erreur #2: Absence de fonds d'urgence
    alerts.push(...this.checkEmergencyFund(data));

    // Erreur #3: Taux d'épargne insuffisant
    alerts.push(...this.checkSavingsRate(data));

    // Erreur #4: Retard dans la planification retraite
    alerts.push(...this.checkRetirementPlanning(data));

    // Erreur #5: Mauvaise utilisation des comptes enregistrés
    alerts.push(...this.checkRegisteredAccounts(data));

    // Erreur #6: Endettement excessif
    alerts.push(...this.checkDebtLevels(data));

    // Erreur #7: Profil de risque inadéquat
    alerts.push(...this.checkRiskProfile(data));

    // Erreur #8: Négligence de l'inflation
    alerts.push(...this.checkInflationConsideration(data));

    // Erreur #9: Planification trop optimiste
    alerts.push(...this.checkRealisticExpectations(data));

    // Trier par priorité (plus critique en premier)
    return alerts.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Erreur #1: Vérification de l'équilibre budgétaire
   */
  private checkBudgetBalance(data: FinancialData): ErrorAlert[] {
    const alerts: ErrorAlert[] = [];
    const deficit = data.monthlyExpenses - data.monthlyIncome;

    if (deficit > 0) {
      alerts.push({
        id: 'budget-deficit',
        type: 'critical',
        category: 'budget',
        title: 'Budget déficitaire détecté',
        message: `Vos dépenses mensuelles (${this.formatCurrency(data.monthlyExpenses)}) dépassent vos revenus (${this.formatCurrency(data.monthlyIncome)}) de ${this.formatCurrency(deficit)}.`,
        suggestion: 'Réduisez vos dépenses ou augmentez vos revenus pour équilibrer votre budget. Commencez par analyser vos trois plus gros postes de dépenses.',
        learnMoreUrl: '/guide/budget-equilibre',
        priority: 10
      });
    } else if (deficit > -200) {
      alerts.push({
        id: 'budget-tight',
        type: 'warning',
        category: 'budget',
        title: 'Budget très serré',
        message: `Votre marge budgétaire est très faible (${this.formatCurrency(Math.abs(deficit))}/mois).`,
        suggestion: 'Créez une marge de sécurité en réduisant certaines dépenses non essentielles.',
        priority: 7
      });
    }

    return alerts;
  }

  /**
   * Erreur #2: Vérification du fonds d'urgence
   */
  private checkEmergencyFund(data: FinancialData): ErrorAlert[] {
    const alerts: ErrorAlert[] = [];
    const recommendedFund = data.monthlyExpenses * 3;
    const fundRatio = data.emergencyFund / recommendedFund;

    if (data.emergencyFund === 0) {
      alerts.push({
        id: 'no-emergency-fund',
        type: 'critical',
        category: 'emergency',
        title: 'Aucun fonds d\'urgence',
        message: 'Vous n\'avez pas de fonds d\'urgence pour faire face aux imprévus.',
        suggestion: `Constituez un fonds d'urgence de ${this.formatCurrency(recommendedFund)} (3 mois de dépenses) en épargnant graduellement.`,
        learnMoreUrl: '/guide/fonds-urgence',
        priority: 9
      });
    } else if (fundRatio < 0.5) {
      alerts.push({
        id: 'insufficient-emergency-fund',
        type: 'warning',
        category: 'emergency',
        title: 'Fonds d\'urgence insuffisant',
        message: `Votre fonds d'urgence (${this.formatCurrency(data.emergencyFund)}) représente seulement ${Math.round(fundRatio * 100)}% du montant recommandé.`,
        suggestion: `Augmentez votre fonds d'urgence à ${this.formatCurrency(recommendedFund)} pour une sécurité optimale.`,
        priority: 6
      });
    }

    return alerts;
  }

  /**
   * Erreur #3: Vérification du taux d'épargne
   */
  private checkSavingsRate(data: FinancialData): ErrorAlert[] {
    const alerts: ErrorAlert[] = [];
    const minimumSavingsRate = 0.10; // 10% recommandé

    if (data.savingsRate < 0.05) {
      alerts.push({
        id: 'very-low-savings',
        type: 'critical',
        category: 'savings',
        title: 'Taux d\'épargne très faible',
        message: `Votre taux d'épargne (${Math.round(data.savingsRate * 100)}%) est insuffisant pour atteindre vos objectifs financiers.`,
        suggestion: 'Visez un taux d\'épargne d\'au moins 10% de vos revenus nets. Automatisez vos épargnes pour faciliter le processus.',
        learnMoreUrl: '/guide/epargne-automatique',
        priority: 8
      });
    } else if (data.savingsRate < minimumSavingsRate) {
      alerts.push({
        id: 'low-savings-rate',
        type: 'warning',
        category: 'savings',
        title: 'Taux d\'épargne à améliorer',
        message: `Votre taux d'épargne (${Math.round(data.savingsRate * 100)}%) pourrait être optimisé.`,
        suggestion: 'Augmentez graduellement votre taux d\'épargne vers 10-15% pour une meilleure sécurité financière.',
        priority: 5
      });
    }

    return alerts;
  }

  /**
   * Erreur #4: Vérification de la planification retraite
   */
  private checkRetirementPlanning(data: FinancialData): ErrorAlert[] {
    const alerts: ErrorAlert[] = [];
    const yearsToRetirement = data.retirementAge - data.age;
    const expectedAnnualReturn = 0.06; // 6% rendement moyen
    
    // Calcul approximatif du capital requis (règle du 4%)
    const estimatedAnnualExpenses = data.monthlyExpenses * 12 * 0.7; // 70% des dépenses actuelles
    const requiredCapital = estimatedAnnualExpenses / 0.04;
    
    // Projection des épargnes actuelles
    const currentSavingsProjection = data.retirementSavings * Math.pow(1 + expectedAnnualReturn, yearsToRetirement);
    const shortfall = requiredCapital - currentSavingsProjection;

    if (data.age > 30 && data.retirementSavings === 0) {
      alerts.push({
        id: 'no-retirement-savings',
        type: 'critical',
        category: 'retirement',
        title: 'Aucune épargne retraite',
        message: 'Vous n\'avez pas encore commencé à épargner pour votre retraite.',
        suggestion: 'Commencez immédiatement à cotiser à un REER ou CELI. Chaque année de retard coûte cher en intérêts composés.',
        learnMoreUrl: '/guide/epargne-retraite',
        priority: 9
      });
    } else if (shortfall > 0 && yearsToRetirement > 5) {
      const monthlyContributionNeeded = this.calculateMonthlyContribution(shortfall, yearsToRetirement, expectedAnnualReturn);
      
      alerts.push({
        id: 'retirement-shortfall',
        type: 'warning',
        category: 'retirement',
        title: 'Épargne retraite insuffisante',
        message: `Selon vos objectifs, il vous manque environ ${this.formatCurrency(shortfall)} pour votre retraite.`,
        suggestion: `Augmentez vos cotisations d'environ ${this.formatCurrency(monthlyContributionNeeded)}/mois pour combler l'écart.`,
        priority: 7
      });
    }

    return alerts;
  }

  /**
   * Erreur #5: Vérification de l'utilisation des comptes enregistrés
   */
  private checkRegisteredAccounts(data: FinancialData): ErrorAlert[] {
    const alerts: ErrorAlert[] = [];

    if (!data.hasRRSP && !data.hasTFSA && data.age > 25) {
      alerts.push({
        id: 'no-registered-accounts',
        type: 'warning',
        category: 'investment',
        title: 'Aucun compte enregistré',
        message: 'Vous n\'utilisez ni REER ni CELI pour vos épargnes.',
        suggestion: 'Ouvrez un CELI et/ou un REER pour bénéficier des avantages fiscaux. Le CELI est souvent recommandé en premier.',
        learnMoreUrl: '/guide/comptes-enregistres',
        priority: 6
      });
    }

    return alerts;
  }

  /**
   * Erreur #6: Vérification des niveaux d'endettement
   */
  private checkDebtLevels(data: FinancialData): ErrorAlert[] {
    const alerts: ErrorAlert[] = [];
    const debtToIncomeRatio = (data.totalDebt * 0.05) / data.monthlyIncome; // Assume 5% monthly payment

    if (debtToIncomeRatio > 0.4) {
      alerts.push({
        id: 'excessive-debt',
        type: 'critical',
        category: 'debt',
        title: 'Endettement excessif',
        message: `Votre ratio d'endettement dépasse 40% de vos revenus.`,
        suggestion: 'Priorisez le remboursement de vos dettes avant d\'augmenter vos épargnes. Considérez la consolidation de dettes.',
        learnMoreUrl: '/guide/gestion-dettes',
        priority: 8
      });
    } else if (debtToIncomeRatio > 0.3) {
      alerts.push({
        id: 'high-debt',
        type: 'warning',
        category: 'debt',
        title: 'Endettement élevé',
        message: 'Votre niveau d\'endettement pourrait limiter votre capacité d\'épargne.',
        suggestion: 'Établissez un plan de remboursement accéléré pour réduire vos dettes plus rapidement.',
        priority: 6
      });
    }

    return alerts;
  }

  /**
   * Erreur #7: Vérification du profil de risque
   */
  private checkRiskProfile(data: FinancialData): ErrorAlert[] {
    const alerts: ErrorAlert[] = [];
    const yearsToRetirement = data.retirementAge - data.age;

    if (yearsToRetirement > 20 && data.riskTolerance === 'conservative') {
      alerts.push({
        id: 'overly-conservative',
        type: 'info',
        category: 'investment',
        title: 'Profil peut-être trop conservateur',
        message: 'Avec plus de 20 ans avant la retraite, un profil plus équilibré pourrait être avantageux.',
        suggestion: 'Considérez un portefeuille équilibré pour bénéficier de la croissance à long terme tout en gérant les risques.',
        learnMoreUrl: '/guide/profil-investisseur',
        priority: 3
      });
    } else if (yearsToRetirement < 10 && data.riskTolerance === 'aggressive') {
      alerts.push({
        id: 'overly-aggressive',
        type: 'warning',
        category: 'investment',
        title: 'Profil peut-être trop agressif',
        message: 'Avec moins de 10 ans avant la retraite, un profil plus conservateur pourrait être prudent.',
        suggestion: 'Réduisez graduellement votre exposition aux actifs volatils en approchant de la retraite.',
        priority: 5
      });
    }

    return alerts;
  }

  /**
   * Erreur #8: Considération de l'inflation
   */
  private checkInflationConsideration(data: FinancialData): ErrorAlert[] {
    const alerts: ErrorAlert[] = [];
    const yearsToRetirement = data.retirementAge - data.age;
    
    if (yearsToRetirement > 15) {
      const currentExpenses = data.monthlyExpenses * 12;
      const inflatedExpenses = currentExpenses * Math.pow(1.02, yearsToRetirement);
      const inflationImpact = inflatedExpenses - currentExpenses;

      alerts.push({
        id: 'inflation-reminder',
        type: 'info',
        category: 'retirement',
        title: 'Impact de l\'inflation à considérer',
        message: `Dans ${yearsToRetirement} ans, vos dépenses actuelles de ${this.formatCurrency(currentExpenses)} équivaudront à ${this.formatCurrency(inflatedExpenses)} (inflation 2%).`,
        suggestion: 'Intégrez l\'inflation dans vos calculs de retraite. Privilégiez des placements qui battent l\'inflation.',
        learnMoreUrl: '/guide/inflation-retraite',
        priority: 4
      });
    }

    return alerts;
  }

  /**
   * Erreur #9: Vérification des attentes réalistes
   */
  private checkRealisticExpectations(data: FinancialData): ErrorAlert[] {
    const alerts: ErrorAlert[] = [];
    const yearsToRetirement = data.retirementAge - data.age;

    if (yearsToRetirement < 10 && data.retirementSavings < data.monthlyExpenses * 12 * 5) {
      alerts.push({
        id: 'unrealistic-timeline',
        type: 'warning',
        category: 'retirement',
        title: 'Objectifs peut-être trop optimistes',
        message: 'Avec le temps et les épargnes actuelles, vos objectifs de retraite pourraient être difficiles à atteindre.',
        suggestion: 'Révisez vos objectifs : retardez la retraite, réduisez les dépenses prévues, ou augmentez drastiquement l\'épargne.',
        learnMoreUrl: '/guide/objectifs-realistes',
        priority: 7
      });
    }

    return alerts;
  }

  /**
   * Calcule la cotisation mensuelle requise pour atteindre un objectif
   */
  private calculateMonthlyContribution(targetAmount: number, years: number, annualReturn: number): number {
    const monthlyRate = annualReturn / 12;
    const totalMonths = years * 12;
    
    if (monthlyRate === 0) {
      return targetAmount / totalMonths;
    }
    
    return targetAmount * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
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
   * Obtient des conseils personnalisés basés sur les alertes
   */
  public getPersonalizedAdvice(alerts: ErrorAlert[]): string[] {
    const advice: string[] = [];
    const criticalAlerts = alerts.filter(a => a.type === 'critical');
    const warningAlerts = alerts.filter(a => a.type === 'warning');

    if (criticalAlerts.length > 0) {
      advice.push('🚨 Priorité absolue : Corrigez d\'abord les problèmes critiques identifiés.');
    }

    if (criticalAlerts.some(a => a.category === 'budget')) {
      advice.push('💰 Équilibrez votre budget avant tout autre objectif financier.');
    }

    if (criticalAlerts.some(a => a.category === 'emergency')) {
      advice.push('🛡️ Constituez un fonds d\'urgence pour vous protéger des imprévus.');
    }

    if (warningAlerts.some(a => a.category === 'retirement')) {
      advice.push('🎯 Augmentez vos cotisations retraite pour rattraper le retard.');
    }

    if (alerts.length === 0) {
      advice.push('✅ Excellente gestion financière ! Continuez sur cette voie.');
    }

    return advice;
  }

  /**
   * Génère un score de santé financière (0-100)
   */
  public calculateFinancialHealthScore(alerts: ErrorAlert[]): number {
    let score = 100;
    
    alerts.forEach(alert => {
      switch (alert.type) {
        case 'critical':
          score -= 15;
          break;
        case 'warning':
          score -= 8;
          break;
        case 'info':
          score -= 3;
          break;
      }
    });

    return Math.max(0, score);
  }
}

export default ErrorPreventionService;
