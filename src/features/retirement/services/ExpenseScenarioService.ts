import { 
  ExpenseScenario, 
  ScenarioOption, 
  PaymentOption, 
  CashFlowImpact, 
  WeeklyFinancialSnapshot,
  ExpenseScenarioState,
  FinancialAlert,
  UpcomingExpense,
  SCENARIO_TEMPLATES,
  SEASONAL_EXPENSES_TEMPLATES
} from '../types/expense-scenarios';

export class ExpenseScenarioService {
  private static readonly STORAGE_KEY = 'expense_scenarios_state';

  static calculateCashFlowImpact(
    scenario: ScenarioOption,
    currentBalance: number,
    monthlyIncome: number,
    monthlyExpenses: number,
    paymentOption: PaymentOption,
    seasonalExpenses: UpcomingExpense[] = []
  ): CashFlowImpact {
    const projectionMonths = 12; // Project 12 months ahead
    const monthlyBalances: number[] = [];
    let currentProjectedBalance = currentBalance;
    let worstCaseBalance = currentBalance;
    let worstCaseDate = new Date();
    
    // Calculate monthly impact based on payment option
    let monthlyPayment = 0;
    let totalCost = scenario.amount;
    let immediateImpact = 0;
    let payoffDate: Date | undefined;

    switch (paymentOption.type) {
      case 'immediate':
        immediateImpact = scenario.amount;
        monthlyPayment = 0;
        break;
      case 'monthly':
        if (paymentOption.duration && paymentOption.interestRate) {
          const monthlyRate = paymentOption.interestRate / 100 / 12;
          monthlyPayment = (scenario.amount * monthlyRate * Math.pow(1 + monthlyRate, paymentOption.duration)) / 
                          (Math.pow(1 + monthlyRate, paymentOption.duration) - 1);
          totalCost = monthlyPayment * paymentOption.duration;
          payoffDate = new Date(paymentOption.startDate);
          payoffDate.setMonth(payoffDate.getMonth() + paymentOption.duration);
        } else {
          monthlyPayment = paymentOption.amount;
          totalCost = monthlyPayment * (paymentOption.duration || 1);
        }
        break;
      case 'quarterly':
        monthlyPayment = paymentOption.amount / 3;
        break;
      case 'custom':
        monthlyPayment = paymentOption.amount;
        break;
    }

    // Apply immediate impact
    currentProjectedBalance -= immediateImpact;
    if (currentProjectedBalance < worstCaseBalance) {
      worstCaseBalance = currentProjectedBalance;
      worstCaseDate = new Date();
    }

    // Project monthly balances including seasonal expenses
    for (let month = 0; month < projectionMonths; month++) {
      const currentMonth = new Date();
      currentMonth.setMonth(currentMonth.getMonth() + month);
      
      // Calculate seasonal expenses for this month
      const monthlySeasonalExpenses = this.getSeasonalExpensesForMonth(
        seasonalExpenses, 
        currentMonth.getMonth() + 1
      );
      
      const netMonthlyFlow = monthlyIncome - monthlyExpenses - monthlyPayment - monthlySeasonalExpenses;
      currentProjectedBalance += netMonthlyFlow;
      monthlyBalances.push(currentProjectedBalance);

      if (currentProjectedBalance < worstCaseBalance) {
        worstCaseBalance = currentProjectedBalance;
        worstCaseDate = new Date();
        worstCaseDate.setMonth(worstCaseDate.getMonth() + month + 1);
      }
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (worstCaseBalance < 0) {
      riskLevel = 'high';
    } else if (worstCaseBalance < monthlyExpenses) {
      riskLevel = 'medium';
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (riskLevel === 'high') {
      recommendations.push('⚠️ Cette dépense pourrait causer un découvert bancaire');
      recommendations.push('Considérez reporter cette dépense ou choisir une option moins coûteuse');
      recommendations.push('Augmentez votre fonds d\'urgence avant cette dépense');
    } else if (riskLevel === 'medium') {
      recommendations.push('⚡ Cette dépense réduira significativement votre coussin financier');
      recommendations.push('Surveillez attentivement vos autres dépenses ce mois-ci');
    } else {
      recommendations.push('✅ Cette dépense est gérable avec votre situation financière actuelle');
    }

    if (paymentOption.type !== 'immediate' && totalCost > scenario.amount) {
      const interestCost = totalCost - scenario.amount;
      recommendations.push(`💰 Les intérêts ajouteront ${interestCost.toFixed(2)}$ au coût total`);
    }

    return {
      immediateImpact,
      monthlyImpact: monthlyPayment,
      totalCost,
      payoffDate,
      worstCaseBalance,
      worstCaseDate,
      riskLevel,
      recommendations
    };
  }

  static generatePaymentOptions(amount: number, startDate: Date = new Date()): PaymentOption[] {
    const options: PaymentOption[] = [
      {
        id: 'immediate',
        type: 'immediate',
        amount: amount,
        startDate,
        description: 'Paiement comptant immédiat'
      }
    ];

    // Add financing options for amounts over $500
    if (amount > 500) {
      options.push({
        id: 'monthly-12',
        type: 'monthly',
        amount: amount / 12,
        duration: 12,
        interestRate: 8.99,
        startDate,
        description: '12 mois à 8.99% d\'intérêt'
      });

      if (amount > 1000) {
        options.push({
          id: 'monthly-24',
          type: 'monthly',
          amount: amount / 24,
          duration: 24,
          interestRate: 12.99,
          startDate,
          description: '24 mois à 12.99% d\'intérêt'
        });
      }

      if (amount > 2000) {
        options.push({
          id: 'monthly-36',
          type: 'monthly',
          amount: amount / 36,
          duration: 36,
          interestRate: 15.99,
          startDate,
          description: '36 mois à 15.99% d\'intérêt'
        });
      }
    }

    return options;
  }

  static createScenarioFromTemplate(templateName: string): ExpenseScenario | null {
    const template = SCENARIO_TEMPLATES.find(t => t.name === templateName);
    if (!template) return null;

    const scenario: ExpenseScenario = {
      id: `scenario_${Date.now()}`,
      name: template.name!,
      description: template.description!,
      category: template.category!,
      scenarios: template.scenarios!.map(s => ({
        ...s,
        paymentOptions: this.generatePaymentOptions(s.amount)
      })),
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return scenario;
  }

  static compareScenarios(
    scenarios: ScenarioOption[],
    currentBalance: number,
    monthlyIncome: number,
    monthlyExpenses: number
  ): { scenario: ScenarioOption; bestPaymentOption: PaymentOption; impact: CashFlowImpact }[] {
    return scenarios.map(scenario => {
      let bestPaymentOption = scenario.paymentOptions[0];
      let bestImpact = this.calculateCashFlowImpact(
        scenario, currentBalance, monthlyIncome, monthlyExpenses, bestPaymentOption
      );

      // Find the payment option with the lowest risk
      for (const paymentOption of scenario.paymentOptions) {
        const impact = this.calculateCashFlowImpact(
          scenario, currentBalance, monthlyIncome, monthlyExpenses, paymentOption
        );
        
        if (this.isLowerRisk(impact, bestImpact)) {
          bestPaymentOption = paymentOption;
          bestImpact = impact;
        }
      }

      return {
        scenario,
        bestPaymentOption,
        impact: bestImpact
      };
    });
  }

  private static isLowerRisk(impact1: CashFlowImpact, impact2: CashFlowImpact): boolean {
    const riskOrder = { 'low': 0, 'medium': 1, 'high': 2 };
    
    if (riskOrder[impact1.riskLevel] !== riskOrder[impact2.riskLevel]) {
      return riskOrder[impact1.riskLevel] < riskOrder[impact2.riskLevel];
    }
    
    // If same risk level, prefer higher worst case balance
    return impact1.worstCaseBalance > impact2.worstCaseBalance;
  }

  static findOptimalTiming(
    scenario: ScenarioOption,
    paymentOption: PaymentOption,
    currentBalance: number,
    monthlyIncome: number,
    monthlyExpenses: number,
    maxMonthsAhead: number = 12
  ): { optimalDate: Date; impact: CashFlowImpact; reasoning: string } {
    let bestDate = new Date();
    let bestImpact = this.calculateCashFlowImpact(
      scenario, currentBalance, monthlyIncome, monthlyExpenses, paymentOption
    );
    let reasoning = 'Immédiatement - situation financière stable';

    // Test different start dates
    for (let monthsAhead = 1; monthsAhead <= maxMonthsAhead; monthsAhead++) {
      const testDate = new Date();
      testDate.setMonth(testDate.getMonth() + monthsAhead);
      
      // Project balance to that date
      const projectedBalance = currentBalance + (monthlyIncome - monthlyExpenses) * monthsAhead;
      
      const testPaymentOption = { ...paymentOption, startDate: testDate };
      const testImpact = this.calculateCashFlowImpact(
        scenario, projectedBalance, monthlyIncome, monthlyExpenses, testPaymentOption
      );

      if (this.isLowerRisk(testImpact, bestImpact)) {
        bestDate = testDate;
        bestImpact = testImpact;
        reasoning = `Dans ${monthsAhead} mois - meilleur équilibre financier`;
      }
    }

    return {
      optimalDate: bestDate,
      impact: bestImpact,
      reasoning
    };
  }

  static saveState(state: ExpenseScenarioState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving expense scenario state:', error);
    }
  }

  static loadState(): ExpenseScenarioState | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        // Convert date strings back to Date objects
        state.scenarios.forEach((scenario: ExpenseScenario) => {
          scenario.createdAt = new Date(scenario.createdAt);
          scenario.updatedAt = new Date(scenario.updatedAt);
          if (scenario.targetDate) {
            scenario.targetDate = new Date(scenario.targetDate);
          }
        });
        return state;
      }
    } catch (error) {
      console.error('Error loading expense scenario state:', error);
    }
    return null;
  }

  static generateWeeklySnapshot(
    currentBalance: number,
    plannedIncome: number,
    actualIncome: number,
    plannedExpenses: number,
    actualExpenses: number
  ): WeeklyFinancialSnapshot {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)

    const netCashFlow = actualIncome - actualExpenses;
    const alerts: FinancialAlert[] = [];

    // Generate alerts
    if (currentBalance < 500) {
      alerts.push({
        id: `alert_${Date.now()}_1`,
        type: 'low_balance',
        severity: 'warning',
        message: 'Votre solde est faible. Surveillez vos dépenses.',
        actionRequired: true,
        suggestedActions: ['Réduire les dépenses non essentielles', 'Reporter les achats importants'],
        createdAt: new Date()
      });
    }

    if (actualExpenses > plannedExpenses * 1.1) {
      alerts.push({
        id: `alert_${Date.now()}_2`,
        type: 'overspending',
        severity: 'error',
        message: 'Vous dépassez votre budget prévu de plus de 10%.',
        actionRequired: true,
        suggestedActions: ['Réviser votre budget', 'Identifier les dépenses imprévues'],
        createdAt: new Date()
      });
    }

    return {
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      plannedIncome,
      actualIncome,
      plannedExpenses,
      actualExpenses,
      netCashFlow,
      accountBalance: currentBalance,
      upcomingExpenses: this.getUpcomingSeasonalExpenses(90), // Next 90 days
      alerts
    };
  }

  // New methods for seasonal expense management
  static getSeasonalExpensesForMonth(seasonalExpenses: UpcomingExpense[], month: number): number {
    return seasonalExpenses
      .filter(expense => 
        expense.isSeasonal && 
        expense.seasonalInfo?.typicalMonths.includes(month)
      )
      .reduce((total, expense) => total + (expense.amount / 12), 0); // Amortize over year
  }

  static getUpcomingSeasonalExpenses(daysAhead: number = 90): UpcomingExpense[] {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);
    
    return SEASONAL_EXPENSES_TEMPLATES
      .filter(expense => {
        const expenseDate = new Date(expense.dueDate);
        return expenseDate >= today && expenseDate <= futureDate;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  static generateSeasonalExpenseAlerts(
    currentBalance: number,
    monthlyIncome: number,
    monthlyExpenses: number
  ): FinancialAlert[] {
    const alerts: FinancialAlert[] = [];
    const upcomingExpenses = this.getUpcomingSeasonalExpenses(60); // Next 60 days
    
    let projectedBalance = currentBalance;
    const monthlyNetFlow = monthlyIncome - monthlyExpenses;
    
    upcomingExpenses.forEach(expense => {
      const daysUntilExpense = Math.ceil(
        (new Date(expense.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      const monthsUntilExpense = daysUntilExpense / 30;
      
      // Project balance at expense date
      const balanceAtExpenseDate = projectedBalance + (monthlyNetFlow * monthsUntilExpense);
      
      if (balanceAtExpenseDate - expense.amount < 500) { // Less than $500 buffer
        const severity = balanceAtExpenseDate - expense.amount < 0 ? 'error' : 'warning';
        
        alerts.push({
          id: `seasonal_alert_${expense.id}`,
          type: 'upcoming_expense',
          severity,
          message: `⚠️ ${expense.name} (${expense.amount.toLocaleString('fr-CA', {
            style: 'currency',
            currency: 'CAD'
          })}) arrive dans ${daysUntilExpense} jours`,
          actionRequired: severity === 'error',
          suggestedActions: severity === 'error' 
            ? [
                'Commencez à épargner immédiatement',
                'Considérez un paiement échelonné si possible',
                'Réduisez les dépenses non essentielles'
              ]
            : [
                'Planifiez cette dépense dans votre budget',
                'Constituez une réserve pour cette dépense'
              ],
          createdAt: new Date()
        });
      }
    });
    
    return alerts;
  }

  static getSeasonalExpenseRecommendations(
    scenario: ScenarioOption,
    currentBalance: number,
    monthlyIncome: number,
    monthlyExpenses: number
  ): string[] {
    const recommendations: string[] = [];
    const seasonalAlerts = this.generateSeasonalExpenseAlerts(currentBalance, monthlyIncome, monthlyExpenses);
    
    if (seasonalAlerts.length > 0) {
      recommendations.push('🗓️ Attention aux dépenses saisonnières à venir :');
      
      seasonalAlerts.forEach(alert => {
        if (alert.severity === 'error') {
          recommendations.push(`❌ ${alert.message} - Risque de découvert`);
        } else {
          recommendations.push(`⚠️ ${alert.message} - Planifiez cette dépense`);
        }
      });
      
      // Suggest optimal timing considering seasonal expenses
      const nextMajorExpense = this.getUpcomingSeasonalExpenses(90)[0];
      if (nextMajorExpense && scenario.amount > 1000) {
        const daysUntilExpense = Math.ceil(
          (new Date(nextMajorExpense.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysUntilExpense < 60) {
          recommendations.push(
            `💡 Considérez reporter cet achat après ${nextMajorExpense.name} (${daysUntilExpense} jours)`
          );
        }
      }
    }
    
    return recommendations;
  }

  static enhanceRecommendationsWithSeasonalData(
    baseRecommendations: string[],
    scenario: ScenarioOption,
    currentBalance: number,
    monthlyIncome: number,
    monthlyExpenses: number
  ): string[] {
    const seasonalRecommendations = this.getSeasonalExpenseRecommendations(
      scenario, currentBalance, monthlyIncome, monthlyExpenses
    );
    
    return [...baseRecommendations, ...seasonalRecommendations];
  }
}
