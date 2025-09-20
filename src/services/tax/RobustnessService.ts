/**
 * RobustnessService — v3
 * 100% local. Educational approximations (not tax advice).
 *
 * Purpose:
 * - Evaluate robustness of a withdrawal plan under adverse scenarios:
 *   1) Sequence shock: -30% / -15% returns in years 1–2
 *   2) Inflation shock: assume higher inflation (proxy penalty if net shortfall vs target)
 *   3) Longevity shock: horizon extended by +5 years (repeating last decision)
 *
 * Score definition (lower is better):
 *   score = totalTax
 *         + shortfallPenalty * (years where netIncome < targetNetAnnual)
 *         + clawbackPenalty * (years with OAS clawback)
 *         + mtrSpikePenalty * (years with MTR >= 45%)
 * Notes:
 * - Penalties are heuristics to reflect discomfort/risk; tune as needed.
 */

import { simulateYear, type AccountBalances, type Assumptions, type YearDecision, type YearResult } from './ProjectionEngine';

export type ShockScenario = 'sequence' | 'inflation' | 'longevity';

export interface RobustnessParams {
  opening: AccountBalances;
  assumptions: Assumptions;
  decisions: YearDecision[];
  horizonYears: number;
  targetNetAnnual: number;

  shortfallPenalty?: number; // default 5000
  clawbackPenalty?: number;  // default 1000
  mtrSpikePenalty?: number;  // default 500
}

export interface RobustnessOutcome {
  score: number;
  totalTax: number;
  shortfallYears: number;
  clawbackYears: number;
  highMTRYears: number;
  results: YearResult[];
}

export interface RobustnessReport {
  sequence: RobustnessOutcome;
  inflation: RobustnessOutcome;
  longevity: RobustnessOutcome;
  robustScore: number;               // weighted sum (equally weighted in v3)
  explanations: string[];            // human-readable reasons
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/**
 * Simulate one plan with per-year shocks applied by scenario.
 */
function simulateWithScenario(
  opening: AccountBalances,
  baseAssumptions: Assumptions,
  decisions: YearDecision[],
  horizon: number,
  targetNetAnnual: number,
  scenario: ShockScenario
): RobustnessOutcome {
  const shortfallPenalty = 5000;
  const clawbackPenalty = 1000;
  const mtrSpikePenalty = 500;

  let bal = { ...opening };
  const results: YearResult[] = [];
  let totalTax = 0;
  let shortfallYears = 0;
  let clawbackYears = 0;
  let highMTRYears = 0;

  // Extend horizon for longevity (+5 years) by repeating last decision
  const effectiveHorizon = scenario === 'longevity' ? horizon + 5 : horizon;

  for (let y = 0; y < effectiveHorizon; y++) {
    const dec = decisions[y] || decisions[decisions.length - 1] || { yearIndex: y };
    const age = (baseAssumptions.startAge || 70) + y;

    // Build per-year assumptions copy
    const a: Assumptions = { ...baseAssumptions };

    // Apply shocks
    if (scenario === 'sequence') {
      // Sequence risk: -30% year 1, -15% year 2
      if (y === 0) {
        a.grossReturnTFSA = -0.30;
        a.grossReturnNonReg = -0.30;
        a.grossReturnRRSP = -0.30;
        a.grossReturnRRIF = -0.30;
      } else if (y === 1) {
        a.grossReturnTFSA = -0.15;
        a.grossReturnNonReg = -0.15;
        a.grossReturnRRSP = -0.15;
        a.grossReturnRRIF = -0.15;
      }
    } else if (scenario === 'inflation') {
      // Elevated inflation proxy; we raise inflation (for future UI) and penalize net income shortfalls directly
      a.inflation = Math.max(0.03, (baseAssumptions.inflation ?? 0.03) + 0.03);
    } else if (scenario === 'longevity') {
      // No per-year change; effect is captured by longer horizon
    }

    const yr = simulateYear(y, age, bal, { ...dec, yearIndex: y }, a);
    results.push(yr);
    bal = yr.closingBalances;

    totalTax += Math.max(0, yr.tax.totalTax || 0);
    if (yr.tax.netIncome < targetNetAnnual - 50) shortfallYears += 1;
    if ((yr.tax.oasClawback || 0) > 0) clawbackYears += 1;
    if ((yr.mtrApprox || 0) >= 0.45) highMTRYears += 1;
  }

  const score =
    totalTax +
    shortfallPenalty * shortfallYears +
    clawbackPenalty * clawbackYears +
    mtrSpikePenalty * highMTRYears;

  return {
    score,
    totalTax: Math.round(totalTax),
    shortfallYears,
    clawbackYears,
    highMTRYears,
    results
  };
}

function makeExplanations(seq: RobustnessOutcome, inf: RobustnessOutcome, lon: RobustnessOutcome, lang: 'fr' | 'en'): string[] {
  const fr = lang === 'fr';
  const lines: string[] = [];

  // Sequence shock
  if (seq.shortfallYears > 0) {
    lines.push(
      fr
        ? `Séquence négative: ${seq.shortfallYears} an(s) sous l'objectif net (prioriser coussin et limiter retraits imposables).`
        : `Negative sequence: ${seq.shortfallYears} year(s) below target net (prioritize cash cushion and limit taxable withdrawals).`
    );
  }
  if (seq.highMTRYears > 0) {
    lines.push(
      fr
        ? `Pics de taux marginaux sous choc: ${seq.highMTRYears} an(s) ≥ 45%.`
        : `Marginal rate spikes under shock: ${seq.highMTRYears} year(s) ≥ 45%.`
    );
  }

  // Inflation shock
  if (inf.shortfallYears > 0) {
    lines.push(
      fr
        ? `Inflation élevée: ${inf.shortfallYears} an(s) sous l'objectif (prévoir indexation du besoin net).`
        : `High inflation: ${inf.shortfallYears} year(s) below target (index the net need).`
    );
  }

  // Longevity shock
  if (lon.shortfallYears > 0) {
    lines.push(
      fr
        ? `Longévité +5 ans: ${lon.shortfallYears} an(s) sous l'objectif (renforcer durabilité des retraits).`
        : `Longevity +5y: ${lon.shortfallYears} year(s) below target (reinforce withdrawal sustainability).`
    );
  }

  // OAS clawback notes
  const totalClaw = seq.clawbackYears + inf.clawbackYears + lon.clawbackYears;
  if (totalClaw > 0) {
    lines.push(
      fr
        ? `Récupération SV présente dans ${totalClaw} cas (lisser les retraits pour rester sous le seuil).`
        : `OAS clawback present in ${totalClaw} cases (smooth withdrawals to stay under threshold).`
    );
  }

  if (lines.length === 0) {
    lines.push(fr ? 'Plan robuste dans les trois scénarios testés.' : 'Plan robust across the three tested scenarios.');
  }

  return lines;
}

export function evaluateRobustness(params: RobustnessParams, language: 'fr' | 'en' = 'fr'): RobustnessReport {
  const { opening, assumptions, decisions, horizonYears, targetNetAnnual } = params;

  const seq = simulateWithScenario(opening, assumptions, decisions, horizonYears, targetNetAnnual, 'sequence');
  const inf = simulateWithScenario(opening, assumptions, decisions, horizonYears, targetNetAnnual, 'inflation');
  const lon = simulateWithScenario(opening, assumptions, decisions, horizonYears, targetNetAnnual, 'longevity');

  // Equal-weight robust score
  const robustScore = Math.round((seq.score + inf.score + lon.score) / 3);
  const explanations = makeExplanations(seq, inf, lon, language);

  return {
    sequence: seq,
    inflation: inf,
    longevity: lon,
    robustScore,
    explanations
  };
}
