import { BudgetData, ExpenseEntry, BudgetTargets } from '@/types/budget';
import { AppLanguage } from '@/utils/localeFormat';

export type Bucket = 'need' | 'want' | 'savings_debt';

/**
 * Mappage par défaut Catégorie -> Bucket 50/30/20
 * - Besoins: logement, services, transport, alimentation, santé
 * - Envies: loisirs, divers
 * - Épargne/Dettes: épargne
 */
const DEFAULT_CATEGORY_BUCKET: Record<ExpenseEntry['category'], Bucket> = {
  logement: 'need',
  services: 'need',
  transport: 'need',
  alimentation: 'need',
  sante: 'need',
  loisirs: 'want',
  epargne: 'savings_debt',
  divers: 'want'
};

export interface AllocationTotals {
  totalNeeds: number;
  totalWants: number;
  totalSavingsDebt: number;
  totalExpenses: number;
  pctNeeds: number;       // en % du revenu net (0..100)
  pctWants: number;       // en % du revenu net (0..100)
  pctSavingsDebt: number; // en % du revenu net (0..100)
}

export class BudgetComputationService {
  /**
   * Retourne le multiplicateur annuel pour transformer un montant en équivalent mensuel
   */
  static getFrequencyMultiplier(freq: ExpenseEntry['frequency']): number {
    switch (freq) {
      case 'weekly':
        return 52;
      case 'biweekly':
        return 26;
      case 'monthly':
        return 12;
      case 'quarterly':
        return 4;
      case 'annually':
        return 1;
      case 'seasonal':
        return 1; // montant réparti sur 12 mois plus bas
      default:
        return 12;
    }
  }

  /**
   * Convertit un poste de dépense en coût mensuel
   */
  static toMonthlyAmount(entry: ExpenseEntry): number {
    if (!entry.isActive) return 0;
    if (entry.frequency === 'seasonal') {
      return (entry.amount || 0) / 12;
    }
    const mult = this.getFrequencyMultiplier(entry.frequency);
    return ((entry.amount || 0) * mult) / 12;
  }

  /**
   * Calcule les allocations 50/30/20 à partir des dépenses et du revenu net
   */
  static computeAllocations(budget: BudgetData, netMonthlyIncome: number): AllocationTotals {
    let totalNeeds = 0;
    let totalWants = 0;
    let totalSavingsDebt = 0;

    for (const e of budget.expenses || []) {
      const monthly = this.toMonthlyAmount(e);
      if (monthly <= 0) continue;

      const defaultBucket = DEFAULT_CATEGORY_BUCKET[e.category];

      // L'épargne/dettes ne se scinde pas : reste dans savings_debt
      if (defaultBucket === 'savings_debt') {
        totalSavingsDebt += monthly;
        continue;
      }

      // Zones grises: si needSharePct est défini (0..100), ventiler besoin/envie
      const hasSplit = typeof e.needSharePct === 'number' && !Number.isNaN(e.needSharePct);
      if (hasSplit) {
        const pct = Math.max(0, Math.min(100, Number(e.needSharePct)));
        const needPart = (monthly * pct) / 100;
        const wantPart = monthly - needPart;
        totalNeeds += needPart;
        totalWants += wantPart;
      } else {
        // Sinon, bucket par défaut
        if (defaultBucket === 'need') totalNeeds += monthly;
        else totalWants += monthly;
      }
    }

    // Hypothèque séparée
    if (budget.mortgage?.isActive) {
      const freq = budget.mortgage.frequency;
      const mult = freq === 'weekly' ? 52 : freq === 'biweekly' ? 26 : 12;
      totalNeeds += (budget.mortgage.amount * mult) / 12;
    }

    const totalExpenses = totalNeeds + totalWants + totalSavingsDebt;
    const base = Math.max(1, netMonthlyIncome || 0);

    return {
      totalNeeds,
      totalWants,
      totalSavingsDebt,
      totalExpenses,
      pctNeeds: (totalNeeds / base) * 100,
      pctWants: (totalWants / base) * 100,
      pctSavingsDebt: (totalSavingsDebt / base) * 100
    };
  }

  /**
   * Valeurs cibles par défaut 50/30/20
   */
  static defaultTargets(): BudgetTargets {
    return { needsPct: 50, wantsPct: 30, savingsDebtPct: 20 };
  }
}
