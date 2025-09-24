/**
 * Themed barrel — Budget
 * Non-breaking: re-exports existing services to enable clearer imports.
 * Usage (recommended):
 *   import { BudgetComputationService, BudgetLinkService } from '@/services/budget';
 */

export * from '../BudgetComputationService';
export * from '../BudgetLinkService';
export * from '../IncomeIntegrationService';
export * from '../IncomeSynchronizationService';

// Payroll-related helpers often used with budget flows
export * from '../PayrollCalendarService';
export * from '../PayrollTestService';
