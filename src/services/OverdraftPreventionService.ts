import { UserData } from '@/types';

/**
 * Overdraft prevention heuristics — 100% local, no external data.
 * Computes monthly cashflow, checks buffers, and returns actionable alerts.
 */
export type OverdraftSeverity = 'info' | 'warning' | 'error';

export interface OverdraftAlert {
  id: string;
  severity: OverdraftSeverity;
  message: string;
  suggestion?: string;
}

export interface OverdraftAnalysis {
  netMonthlyIncome: number;
  totalMonthlyExpenses: number;
  monthlyCashflow: number; // income - expenses
  emergencySaved: number;
  emergencyTargetMonths: number;
  riskLevel: 'low' | 'medium' | 'high';
  alerts: OverdraftAlert[];
}

export interface OverdraftOptions {
  emergencyTargetMonths?: number; // default 3
  minMonthlyBuffer?: number;      // default 100 CAD
  incomeKeys?: Array<keyof NonNullable<UserData['personal']>>; // default ['salaire1','salaire2']
}

/**
 * Lightweight, safe math helpers
 */
function toNumber(x: any): number {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function sumNumbers(values: number[]): number {
  return values.reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0);
}

/**
 * Extract net monthly income from userData.personal (default: salaire1 + salaire2) / 12
 * If explicit monthly net income exists in personal.netMensuel, it will be used preferentially.
 */
function computeNetMonthlyIncome(userData: UserData, opts?: OverdraftOptions): number {
  const p: any = (userData as any).personal || {};
  // Prefer an explicit monthly net if present
  const explicit = toNumber(p.netMensuel);
  if (explicit > 0) return explicit;

  const keys = opts?.incomeKeys ?? (['salaire1', 'salaire2'] as const);
  const yearly = sumNumbers(keys.map(k => toNumber(p[k as string])));
  return yearly / 12;
}

/**
 * Compute total monthly expenses from primary cashflow categories (consistent with CashflowSection and CalculationService).
 */
function computeTotalMonthlyExpenses(userData: UserData): number {
  const cf: any = (userData as any).cashflow || {};
  // Primary buckets used across the app
  const keys = [
    'logement',
    'servicesPublics',
    'assurances',
    'telecom',
    'alimentation',
    'transport',
    'sante',
    'loisirs',
    'depensesSaisonnieres'
  ];
  return sumNumbers(keys.map(k => toNumber(cf[k])));
}

/**
 * Attempt to read an emergency fund amount from known places.
 * Falls back to 0 if not found.
 */
function extractEmergencySaved(userData: UserData): number {
  const root: any = userData as any;

  // 1) Dedicated budget area (if present in your app state)
  if (root.budgetSettings?.emergencyFund != null) {
    return toNumber(root.budgetSettings.emergencyFund);
  }

  // 2) Savings structure (common shapes)
  const s: any = root.savings || {};
  // Try a few standard keys often used in apps
  const candidates = [
    'emergencyFund',
    'fondsUrgence',
    'liquidSavings',
    'epargneLiquide',
    'bankSavings',
    'epargne1'
  ];
  for (const key of candidates) {
    if (s[key] != null) return toNumber(s[key]);
  }

  // 3) Nothing found
  return 0;
}

/**
 * Derive a qualitative risk level from monthly buffer and emergency capacity.
 */
function deriveRiskLevel(monthlyBuffer: number, emergencyMonthsCoverage: number): 'low' | 'medium' | 'high' {
  if (monthlyBuffer >= 0 && emergencyMonthsCoverage >= 3) return 'low';
  if (monthlyBuffer >= 0 && emergencyMonthsCoverage >= 1) return 'medium';
  if (monthlyBuffer < 0 && emergencyMonthsCoverage >= 2) return 'medium';
  return 'high';
}

export class OverdraftPreventionService {
  /**
   * Analyze user data and return overdraft-related alerts and metrics.
   * - monthlyCashflow < 0 –> warnings/errors depending on magnitude
   * - emergency buffer check vs target months
   * - minimal monthly buffer threshold (e.g., 100 CAD)
   */
  static analyze(userData: UserData, options: OverdraftOptions = {}): OverdraftAnalysis {
    const emergencyTargetMonths = options.emergencyTargetMonths ?? 3;
    const minMonthlyBuffer = options.minMonthlyBuffer ?? 100;

    const netMonthlyIncome = computeNetMonthlyIncome(userData, options);
    const totalMonthlyExpenses = computeTotalMonthlyExpenses(userData);
    const monthlyCashflow = netMonthlyIncome - totalMonthlyExpenses;

    const emergencySaved = extractEmergencySaved(userData);
    const emergencyMonthsNeeded = emergencyTargetMonths;
    const requiredEmergency = Math.max(0, totalMonthlyExpenses) * emergencyMonthsNeeded;
    const emergencyShortfall = Math.max(0, requiredEmergency - emergencySaved);
    const emergencyCoverageMonths = totalMonthlyExpenses > 0 ? (emergencySaved / totalMonthlyExpenses) : Infinity;

    const alerts: OverdraftAlert[] = [];

    // 1) Monthly cashflow negative
    if (monthlyCashflow < 0) {
      const deficit = Math.abs(monthlyCashflow);
      alerts.push({
        id: 'negative-monthly-cashflow',
        severity: deficit >= 250 ? 'error' : 'warning',
        message:
          `Votre flux de trésorerie mensuel est négatif de ${deficit.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}.`,
        suggestion:
          'Réduisez vos dépenses essentielles/discrétionnaires et reportez les achats non urgents. Augmentez vos revenus ou ajustez le plan.'
      });
    } else if (monthlyCashflow < minMonthlyBuffer) {
      alerts.push({
        id: 'insufficient-monthly-buffer',
        severity: 'warning',
        message:
          `Votre marge mensuelle est faible (${monthlyCashflow.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}).`,
        suggestion:
          'Conservez un coussin minimum de 100–200 $ par mois pour prévenir les découverts (imprévus, variabilité des factures).'
      });
    }

    // 2) Emergency fund capacity vs target
    if (emergencyShortfall > 0) {
      alerts.push({
        id: 'emergency-fund-shortfall',
        severity: monthlyCashflow < 0 ? 'error' : 'warning',
        message:
          `Fonds d’urgence insuffisant de ${emergencyShortfall.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} (cible ${emergencyTargetMonths} mois).`,
        suggestion:
          'Alimentez votre fonds d’urgence en priorité (visez 3–6 mois de dépenses essentielles).'
      });
    } else {
      alerts.push({
        id: 'emergency-fund-ok',
        severity: 'info',
        message:
          `Fonds d’urgence adéquat (~${emergencyCoverageMonths.toFixed(1)} mois de dépenses couvertes).`,
      });
    }

    // 3) Seasonal expenses sanity hint
    const cf: any = (userData as any).cashflow || {};
    const seasonal = toNumber(cf.depensesSaisonnieres);
    if (seasonal > 0 && monthlyCashflow - seasonal / 12 < 0) {
      alerts.push({
        id: 'seasonal-expense-risk',
        severity: 'warning',
        message:
          'Vos dépenses saisonnières peuvent réduire votre marge mensuelle et causer un découvert lors des périodes de pointe.',
        suggestion:
          'Utilisez des “sinking funds” mensuels pour lisser les dépenses saisonnières et éviter un choc de trésorerie.'
      });
    }

    const riskLevel = deriveRiskLevel(monthlyCashflow, emergencyCoverageMonths);

    return {
      netMonthlyIncome,
      totalMonthlyExpenses,
      monthlyCashflow,
      emergencySaved,
      emergencyTargetMonths,
      riskLevel,
      alerts
    };
  }
}

export default OverdraftPreventionService;
