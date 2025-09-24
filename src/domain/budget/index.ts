/**
 * Domaine: Budget — Interfaces de contrat (pas d'implémentation ici)
 * Objectif: clarifier la frontière UI ↔ Domaine sans modifier le code existant.
 * NOTE: ces interfaces guident l'évolution, sans imposer de migration immédiate.
 */

export interface BudgetUserData {
  [key: string]: any;
}

export interface BudgetComputationInputs {
  budgetData: any;
  netMonthlyIncome: number;
  presets?: '50-30-20' | '55-25-20' | '45-25-30' | string;
}

export interface BudgetAllocation {
  needs: number;
  wants: number;
  savings: number;
  [key: string]: number;
}

export interface BudgetComputationResult {
  allocation: BudgetAllocation;
  warnings?: string[];
  notes?: string[];
}

export interface NetWorthSnapshot {
  date: string; // ISO
  assets: number;
  liabilities: number;
  net: number;
}

export interface SmartGoal {
  id: string;
  title: string;
  measure: string;
  target: number;
  deadline?: string; // ISO
  relevance?: string;
}

export interface IBudgetService {
  computeAllocations(input: BudgetComputationInputs): BudgetComputationResult;
}

export interface INetWorthService {
  createSnapshot(userData: BudgetUserData): NetWorthSnapshot;
  listSnapshots(userData: BudgetUserData): NetWorthSnapshot[];
}

export interface INotificationService {
  scheduleSeries(params: {
    type: 'SINKING_FUNDS' | 'MONTH_END' | 'RRQ' | 'SV' | 'FERR' | 'WITHDRAWAL_NOTICE';
    scenarioId?: string;
    targetDate?: string;
    options?: Record<string, any>;
  }): { ids: string[]; scheduledAt: string };
}

export interface IGamificationService {
  logEvent(event: 'budget_created' | 'savings_updated' | 'goal_created', payload?: any): void;
  listAchievements?(): Array<{ id: string; label: string; unlockedAt: string }>;
}

export interface IBudgetDomain {
  budget: IBudgetService;
  netWorth: INetWorthService;
  notifications: INotificationService;
  gamification: IGamificationService;
}

/**
 * Exemple d'adaptateur (esquisse) — non implémenté ici:
 * export function createBudgetDomain(adapters: {...}): IBudgetDomain;
 * L'impl permettrait de brancher BudgetComputationService, NotificationSchedulerService, GamificationService, etc.
 */
