/**
 * GreedyBaselineOptimizer — v1
 * 100% local, deterministic. Educational approximations (not tax advice).
 *
 * Strategy (single filer v1):
 * - Objective: meet a target net annual cash need with minimal taxable withdrawals
 *   using a simple order: Non-Registered -> RRSP -> TFSA, and start CPP/OAS at chosen ages.
 * - Non-Registered & TFSA withdrawals do not affect taxes in v1 (capital gains ignored).
 * - RRSP withdrawals are taxable; we use bisection on RRSP gross to bridge remaining net gap.
 * - ProjectionEngine will compute taxes; here we construct YearDecision[].
 *
 * Notes:
 * - This is a baseline to compare against more advanced optimizers (DP/beam/local search).
 * - Couple, RRIF min, dividends, and non-reg capital gains handling can be extended in v2.
 */

import { simulateYears, type AccountBalances, type Assumptions, type YearDecision } from '../ProjectionEngine';
import { computeTaxYear, type IncomeInputs } from '../TaxEngine';
import type { ProvinceCode } from '../TaxPolicy2025';

export interface OptimizeParams {
  opening: AccountBalances;
  assumptions: Assumptions & {
    province?: ProvinceCode;
  };
  horizonYears: number;
  targetNetAnnual: number;   // desired net cash per year
  startCPPAt?: number;       // age to start CPP (default: 70)
  startOASAt?: number;       // age to start OAS (default: 70)
}

export class GreedyBaselineOptimizer {
  static optimize(params: OptimizeParams): YearDecision[] {
    const {
      opening,
      assumptions,
      horizonYears,
      targetNetAnnual,
      startCPPAt = 70,
      startOASAt = 70
    } = params;

    const decisions: YearDecision[] = [];
    let balances: AccountBalances = { ...opening };
    const province = assumptions.province ?? 'QC';
    const includeCPP = assumptions.includeCPP ?? true;
    const includeOAS = assumptions.includeOAS ?? true;

    for (let y = 0; y < horizonYears; y++) {
      const age = assumptions.startAge + y;

      // 1) Determine benefits started this year (flags only; amounts set by ProjectionEngine defaults)
      const startCPP = includeCPP && age >= startCPPAt && !balances.cppAnnual;
      const startOAS = includeOAS && age >= startOASAt && !balances.oasAnnual;

      // 2) Compute net income from benefits only (0 taxable withdrawals)
      const baselineTax = computeTaxYear(buildTaxInput(0, 0, age, province, balances));
      const baseNet = baselineTax.netIncome; // net from CPP/OAS (after clawback) + credits
      let remainingNet = Math.max(0, targetNetAnnual - baseNet);

      // 3) Use Non-Registered first, then RRSP (taxable via bisection), then TFSA
      // Non-Registered: withdraw as much as possible up to remainingNet
      let withdrawNonReg = Math.min(balances.nonRegistered, remainingNet);
      remainingNet -= withdrawNonReg;

      // RRSP: find gross taxable such that net income increases by remainingNet
      let withdrawRRSP = 0;
      if (remainingNet > 0 && balances.rrsp > 0) {
        withdrawRRSP = solveRrspGrossForNetIncrease(remainingNet, age, province, balances);
        withdrawRRSP = Math.min(withdrawRRSP, balances.rrsp);
        // After RRSP gross is determined, recompute net to get precise residual
        const rrspTax = computeTaxYear(buildTaxInput(withdrawRRSP, 0, age, province, balances));
        const deltaNet = rrspTax.netIncome - baseNet;
        remainingNet = Math.max(0, remainingNet - deltaNet);
      }

      // TFSA: cover any small residual exactly
      let withdrawTFSA = 0;
      if (remainingNet > 0 && balances.tfsa > 0) {
        withdrawTFSA = Math.min(balances.tfsa, remainingNet);
        remainingNet -= withdrawTFSA;
      }

      // RRIF not used in v1 baseline (kept for extension); set 0.
      const withdrawRRIF = 0;

      // 4) Save decision
      decisions.push({
        yearIndex: y,
        withdrawTFSA,
        withdrawNonReg,
        withdrawRRSP,
        withdrawRRIF,
        startCPP,
        startOAS
      });

      // 5) Update balances (end-of-year). ProjectionEngine will grow balances at next year start.
      balances = {
        tfsa: Math.max(0, balances.tfsa - withdrawTFSA),
        nonRegistered: Math.max(0, balances.nonRegistered - withdrawNonReg),
        rrsp: Math.max(0, balances.rrsp - withdrawRRSP),
        rrif: balances.rrif, // unchanged in v1
        cppAnnual: startCPP ? (balances.cppAnnual || 9600) : balances.cppAnnual, // default base
        oasAnnual: startOAS ? (balances.oasAnnual || 8400) : balances.oasAnnual
      };
    }

    return decisions;
  }
}

/**
 * Build TaxEngine input with RRSP/RRIF taxable withdrawals only (non-reg/TFSA ignored for tax).
 * Benefits come from balances (annual).
 */
function buildTaxInput(
  rrspGross: number,
  rrifGross: number,
  age: number,
  province: ProvinceCode,
  balances: AccountBalances
): IncomeInputs {
  return {
    ordinaryIncome: rrspGross + rrifGross,
    eligiblePensionIncome: 0,
    cpp: balances.cppAnnual || 0,
    oas: balances.oasAnnual || 0,
    eligibleDividends: 0,
    nonEligibleDividends: 0,
    capitalGains: 0,
    age,
    province
  };
}

/**
 * Find RRSP gross amount that increases net income by targetDelta using bisection.
 * Monotonic assumption: higher RRSP gross -> higher tax and net income up to a point.
 */
function solveRrspGrossForNetIncrease(
  targetDeltaNet: number,
  age: number,
  province: ProvinceCode,
  balances: AccountBalances
): number {
  const base = computeTaxYear(buildTaxInput(0, 0, age, province, balances)).netIncome;

  let lo = 0;
  let hi = Math.max(1000, balances.rrsp); // cap at available RRSP
  const tol = 1; // $1 precision
  let best = 0;

  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    const net = computeTaxYear(buildTaxInput(mid, 0, age, province, balances)).netIncome;
    const delta = net - base;

    if (Math.abs(delta - targetDeltaNet) <= tol) {
      best = mid;
      break;
    }

    if (delta < targetDeltaNet) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return Math.max(0, Math.min(best, balances.rrsp));
}

export default GreedyBaselineOptimizer;
