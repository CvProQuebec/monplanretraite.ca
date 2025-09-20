/**
 * DPBeamOptimizer — v2 (baseline beam search + local refinement)
 * 100% local, deterministic. Educational approximations (not tax advice).
 *
 * Strategy:
 * - Beam search over discretized actions per year to approximate the optimal multi-year plan.
 * - Actions (v2 baseline): amounts for Non-registered, RRSP (taxable), TFSA withdrawals chosen from small grids
 *   to reach target net income with minimal tax (ProjectionEngine+TaxEngine evaluate).
 * - Beam keeps top-K partial plans at each year by score (lower is better),
 *   score = totalTax + penalties (target miss, volatility).
 * - Optional local refinement pass (hill-climb) around the best plan.
 *
 * Notes:
 * - Single-filer focus v2; couple and RRIF-min, dividends, non-reg CG to extend in v2.1/v2.2.
 * - Designed to run in a Web Worker in heavy configurations; can also run inline for small beams.
 */

import {
  simulateYear,
  type AccountBalances,
  type Assumptions,
  type YearDecision,
  type YearResult
} from '../ProjectionEngine';

export interface DPParams {
  opening: AccountBalances;
  assumptions: Assumptions;
  horizonYears: number;

  // Targets / penalties
  targetNetAnnual: number;
  weightTargetMiss?: number;   // default 1.0  ($1 miss adds 1 to score)
  weightVolatility?: number;   // default 0.0  (sum of |ΔMTR| year-to-year) not used v2 baseline

  // CPP/OAS start
  startCPPAt?: number;         // default 70
  startOASAt?: number;         // default 70

  // Beam config
  beamWidth?: number;          // default 100
  rrspSteps?: number[];        // candidate RRSP gross withdrawals amounts
  tfsaSteps?: number[];        // candidate TFSA amounts
  nonRegSteps?: number[];      // candidate Non-registered amounts
  stepSize?: number;           // optional base step size override for default grids
}

export interface DPResult {
  decisions: YearDecision[];
  results: YearResult[];
  score: number;
}

type PartialPlan = {
  y: number;
  decisions: YearDecision[];
  score: number;       // cumulative score so far
  opening: AccountBalances; // balances after applying previous years (for incremental simulateYear)
  lastResult?: YearResult;
};

function defaultSteps(targetNetAnnual: number, stepSize?: number) {
  // Build small grids around target; coarse grid by default
  const step = stepSize ?? Math.max(1000, Math.round(targetNetAnnual / 10 / 1000) * 1000); // ~10 steps up to target
  const seq = [0, step, step * 2, step * 3, step * 4, step * 5];
  return {
    rrsp: seq,
    nonReg: seq,
    tfsa: [0, step, step * 1, step * 2] // tfsa narrower by default
  };
}

function penaltyTargetMiss(net: number, target: number, weight: number): number {
  return weight * Math.max(0, Math.abs(net - target));
}

function nextBalancesFromResult(r: YearResult): AccountBalances {
  return { ...r.closingBalances };
}

function buildDecision(
  y: number,
  age: number,
  balances: AccountBalances,
  p: DPParams,
  wNon: number,
  wRRSP: number,
  wTFSA: number
): YearDecision {
  const startCPP =
    (p.assumptions.includeCPP ?? true) &&
    (p.startCPPAt ?? 70) <= age &&
    !balances.cppAnnual;

  const startOAS =
    (p.assumptions.includeOAS ?? true) &&
    (p.startOASAt ?? 70) <= age &&
    !balances.oasAnnual;

  // Clamp by available balances
  const non = Math.min(wNon, balances.nonRegistered);
  const rrsp = Math.min(wRRSP, balances.rrsp);
  const tfsa = Math.min(wTFSA, balances.tfsa);

  return {
    yearIndex: y,
    withdrawTFSA: tfsa,
    withdrawNonReg: non,
    withdrawRRSP: rrsp,
    withdrawRRIF: 0,
    startCPP,
    startOAS
  };
}

export class DPBeamOptimizer {
  static optimize(
    params: DPParams,
    opts?: {
      onProgress?: (info: { year: number; bestScore: number; beamCount: number }) => void;
      isCancelled?: () => boolean;
    }
  ): DPResult {
    const {
      opening,
      assumptions,
      horizonYears,
      targetNetAnnual,
      weightTargetMiss = 1.0,
      weightVolatility = 0.0,
      beamWidth = 100
    } = params;

    const rrspSteps = params.rrspSteps ?? defaultSteps(targetNetAnnual, params.stepSize).rrsp;
    const nonRegSteps = params.nonRegSteps ?? defaultSteps(targetNetAnnual, params.stepSize).nonReg;
    const tfsaSteps = params.tfsaSteps ?? defaultSteps(targetNetAnnual, params.stepSize).tfsa;

    let beam: PartialPlan[] = [
      { y: 0, decisions: [], score: 0, opening: { ...opening } }
    ];

    for (let y = 0; y < horizonYears; y++) {
      const age = assumptions.startAge + y;
      const next: PartialPlan[] = [];

      for (const plan of beam) {
        // Generate candidate actions for this year
        for (const wNon of nonRegSteps) {
          for (const wRRSP of rrspSteps) {
            // Quick heuristic: skip combinations clearly over target by huge margin
            if (wNon + wRRSP > targetNetAnnual * 2) continue;

            for (const wTFSA of tfsaSteps) {
              const dec = buildDecision(y, age, plan.opening, params, wNon, wRRSP, wTFSA);

              // Simulate one year incrementally
              const yr = simulateYear(y, age, plan.opening, dec, assumptions);

              // Score: tax + penalty if net misses target
              let score = plan.score;
              score += Math.max(0, yr.tax.totalTax);
              score += penaltyTargetMiss(yr.tax.netIncome, targetNetAnnual, weightTargetMiss);

              // Optional volatility penalty on MTR (off in v2 baseline)
              if (weightVolatility > 0 && plan.lastResult) {
                const dMTR = Math.abs((yr.mtrApprox || 0) - (plan.lastResult.mtrApprox || 0));
                score += weightVolatility * dMTR * 10000; // scale
              }

              next.push({
                y: y + 1,
                decisions: [...plan.decisions, dec],
                score,
                opening: nextBalancesFromResult(yr),
                lastResult: yr
              });
            }
          }
        }
      }

      // Keep best beamWidth candidates
      next.sort((a, b) => a.score - b.score);
      beam = next.slice(0, beamWidth);

      // Progress + cancel handling
      opts?.onProgress?.({
        year: y + 1,
        bestScore: beam[0]?.score ?? Infinity,
        beamCount: beam.length
      });
      if (beam.length === 0 || opts?.isCancelled?.()) break;
    }

    const best = beam[0];
    if (!best) {
      return { decisions: [], results: [], score: Infinity };
    }

    // Build full results timeline by re-simulating (to ensure continuity)
    const results: YearResult[] = [];
    let bal = { ...opening };
    for (let i = 0; i < best.decisions.length; i++) {
      const age = assumptions.startAge + i;
      const yr = simulateYear(i, age, bal, best.decisions[i], assumptions);
      results.push(yr);
      bal = yr.closingBalances;
    }

    // Optional local refinement (very light hill-climb around best) — v2.1 pass
    // Adjust +/- (stepBase/2) on RRSP per year and keep improvements.
    const stepBase = params.stepSize ?? Math.max(1000, Math.round(targetNetAnnual / 10 / 1000) * 1000);
    let refinedDecisions = best.decisions.map(d => ({ ...d }));
    let bestScore = best.score;

    // Helper to score a full plan (re-simulate)
    const scorePlan = (decisions: YearDecision[]): number => {
      let bal = { ...opening };
      let score = 0;
      for (let i = 0; i < decisions.length; i++) {
        const age = assumptions.startAge + i;
        const yr = simulateYear(i, age, bal, decisions[i], assumptions);
        score += Math.max(0, yr.tax.totalTax);
        score += penaltyTargetMiss(yr.tax.netIncome, targetNetAnnual, weightTargetMiss);
        bal = yr.closingBalances;
      }
      return score;
    };

    // Single pass hill-climb on RRSP withdrawals
    const delta = Math.round(stepBase / 2);
    if (delta > 0) {
      for (let i = 0; i < refinedDecisions.length; i++) {
        for (const sign of [-1, 1] as const) {
          const variant = refinedDecisions.map(d => ({ ...d }));
          variant[i].withdrawRRSP = Math.max(0, (variant[i].withdrawRRSP || 0) + sign * delta);
          const s = scorePlan(variant);
          if (s < bestScore) {
            bestScore = s;
            refinedDecisions = variant;
          }
        }
      }
    }

    // Build results for refined plan
    const finalResults: YearResult[] = [];
    {
      let bal = { ...opening };
      for (let i = 0; i < refinedDecisions.length; i++) {
        const age = assumptions.startAge + i;
        const yr = simulateYear(i, age, bal, refinedDecisions[i], assumptions);
        finalResults.push(yr);
        bal = yr.closingBalances;
      }
    }

    return {
      decisions: refinedDecisions,
      results: finalResults,
      score: bestScore
    };
  }
}

export default DPBeamOptimizer;
