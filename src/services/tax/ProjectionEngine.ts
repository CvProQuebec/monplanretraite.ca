/**
 * ProjectionEngine — v1
 * 100% local, deterministic. Educational approximations (not tax advice).
 *
 * Purpose:
 * - Simulate multi-year retirement cashflows and taxes given simple inputs and decisions.
 * - Single-filer focus in v1 (extendable to couple in v2).
 * - Uses TaxEngine to compute tax each year.
 *
 * Design:
 * - Pure functions, no UI side effects.
 * - Optimizers provide YearDecision[]; engine applies and returns YearResult[].
 */

import { computeTaxYear, type IncomeInputs, approxMTR } from './TaxEngine';
import type { ProvinceCode } from './TaxPolicy2025';

export interface AccountBalances {
  tfsa: number;
  nonRegistered: number;
  rrsp: number;
  rrif: number;
  cppAnnual?: number;  // if already started, annual CPP benefit
  oasAnnual?: number;  // if already started, annual OAS benefit (gross before clawback)
}

export interface Assumptions {
  province?: ProvinceCode;         // 'QC' default
  startAge: number;                // age at year 0
  grossReturnTFSA?: number;        // default 0.04
  grossReturnNonReg?: number;      // default 0.04
  grossReturnRRSP?: number;        // default 0.04
  grossReturnRRIF?: number;        // default 0.04
  inflation?: number;              // default 0.03
  targetNetAnnual?: number;        // target net income per year (optional)
  includeCPP?: boolean;            // if true, include CPP income when started
  includeOAS?: boolean;            // if true, include OAS income when started

  // v2.2: simple modeling for capital gains on non-registered withdrawals
  // Portion of non-registered withdrawal treated as realized capital gains
  nonRegCapitalGainsRatio?: number; // default 0.25 (25%) if not specified
}

export interface YearDecision {
  yearIndex: number;          // 0..N-1
  withdrawTFSA?: number;      // gross
  withdrawNonReg?: number;    // gross
  withdrawRRSP?: number;      // gross (taxable)
  withdrawRRIF?: number;      // gross (taxable)
  startCPP?: boolean;         // if CPP starts this year
  startOAS?: boolean;         // if OAS starts this year
}

export interface YearResult {
  yearIndex: number;
  age: number;
  openingBalances: AccountBalances;
  decisions: Required<Pick<YearDecision,'withdrawTFSA'|'withdrawNonReg'|'withdrawRRSP'|'withdrawRRIF'>> & { startCPP: boolean; startOAS: boolean };
  tax: {
    totalTax: number;
    netIncome: number;
    oasClawback: number;
    gisBenefit: number;
    taxableFederal: number;
    taxableQuebec: number;
  };
  incomeBreakdown: {
    ordinaryIncome: number;
    eligiblePensionIncome: number;
    cpp: number;
    oas: number;
    dividendsEligible: number;
    dividendsNonEligible: number;
    capitalGains: number;
  };
  closingBalances: AccountBalances;
  mtrApprox?: number;
}

/**
 * Apply simple growth to balances at start of year (before withdrawals).
 */
function growBalances(b: AccountBalances, a: Assumptions): AccountBalances {
  const rTFSA = a.grossReturnTFSA ?? 0.04;
  const rNon = a.grossReturnNonReg ?? 0.04;
  const rRRSP = a.grossReturnRRSP ?? 0.04;
  const rRRIF = a.grossReturnRRIF ?? 0.04;
  return {
    tfsa: b.tfsa * (1 + rTFSA),
    nonRegistered: b.nonRegistered * (1 + rNon),
    rrsp: b.rrsp * (1 + rRRSP),
    rrif: b.rrif * (1 + rRRIF),
    cppAnnual: b.cppAnnual,
    oasAnnual: b.oasAnnual
  };
}

/**
 * Clamp withdrawals to available balances; returns tuple [actual, newBalance].
 */
function applyWithdrawal(avail: number, wanted: number): [number, number] {
  const w = Math.max(0, wanted || 0);
  const actual = Math.min(avail, w);
  return [actual, avail - actual];
}

/**
 * Simulate a single year.
 */
export function simulateYear(
  yearIndex: number,
  age: number,
  opening: AccountBalances,
  dec: YearDecision,
  assumptions: Assumptions
): YearResult {
  // 1) Grow balances at the start of the year (very simple accrual model)
  let grown = growBalances(opening, assumptions);

  // 2) Apply withdrawals (clamped to balance)
  const [wTFSA, tfsaAfter] = applyWithdrawal(grown.tfsa, dec.withdrawTFSA || 0);
  const [wNon, nonAfter] = applyWithdrawal(grown.nonRegistered, dec.withdrawNonReg || 0);

  // RRSP can convert to RRIF later; v1 treat separately if both exist
  const [wRRSP, rrspAfter] = applyWithdrawal(grown.rrsp, dec.withdrawRRSP || 0);
  const [wRRIF, rrifAfter] = applyWithdrawal(grown.rrif, dec.withdrawRRIF || 0);

  // 3) Benefits (CPP/OAS) if started/ongoing (kept constant in v1; inflation step can be added)
  let cppAnnual = grown.cppAnnual || 0;
  let oasAnnual = grown.oasAnnual || 0;

  if (dec.startCPP && (assumptions.includeCPP ?? true)) {
    // Use a simple default if none present; v1: 9600$ base (approx), tune via UI later.
    cppAnnual = cppAnnual > 0 ? cppAnnual : 9600;
  }
  if (dec.startOAS && (assumptions.includeOAS ?? true)) {
    // Use default 8400$ if none present; refined by TaxEngine clawback later.
    oasAnnual = oasAnnual > 0 ? oasAnnual : 8400;
  }

  // 4) Build TaxEngine input for the year
  const province = assumptions.province ?? 'QC';
  const ordinaryIncome =
    (wRRSP + wRRIF) + // fully taxable
    0 +               // employment/interest not modeled here
    0;                // add other sources if needed

  const eligiblePensionIncome = 0; // v1 keep 0; can include RRIF portions eligible for credit later
  const eligibleDividends = 0;     // v1: dividends not modeled explicitly
  const nonEligibleDividends = 0;

  // v2.2: treat part of non-registered withdrawals as realized capital gains (approx)
  const capitalGains = (dec.withdrawNonReg || 0) * (assumptions.nonRegCapitalGainsRatio ?? 0.25);

  const taxInput: IncomeInputs = {
    ordinaryIncome,
    eligiblePensionIncome,
    cpp: cppAnnual,
    oas: oasAnnual,
    eligibleDividends,
    nonEligibleDividends,
    capitalGains,
    age,
    province
  };

  const tax = computeTaxYear(taxInput);

  // 5) Compose result and closing balances
  const closing: AccountBalances = {
    tfsa: tfsaAfter,
    nonRegistered: nonAfter,
    rrsp: rrspAfter,
    rrif: rrifAfter,
    cppAnnual,
    oasAnnual
  };

  // MTR approx (delta +$100 ordinary income)
  const mtr = approxMTR(taxInput, 100).marginalRate;

  return {
    yearIndex,
    age,
    openingBalances: opening,
    decisions: {
      withdrawTFSA: wTFSA,
      withdrawNonReg: wNon,
      withdrawRRSP: wRRSP,
      withdrawRRIF: wRRIF,
      startCPP: !!dec.startCPP,
      startOAS: !!dec.startOAS
    },
    tax: {
      totalTax: tax.totalTax,
      netIncome: tax.netIncome,
      oasClawback: tax.oasClawback,
      gisBenefit: tax.gisBenefit,
      taxableFederal: tax.taxableFederal,
      taxableQuebec: tax.taxableQuebec
    },
    incomeBreakdown: {
      ordinaryIncome: taxInput.ordinaryIncome,
      eligiblePensionIncome: eligiblePensionIncome || 0,
      cpp: cppAnnual,
      oas: oasAnnual,
      dividendsEligible: eligibleDividends,
      dividendsNonEligible: nonEligibleDividends,
      capitalGains: capitalGains
    },
    closingBalances: closing,
    mtrApprox: mtr
  };
}

/**
 * Simulate multiple years using a list of decisions. If decisions shorter than horizon,
 * last decision is repeated.
 */
export function simulateYears(
  opening: AccountBalances,
  assumptions: Assumptions,
  decisions: YearDecision[],
  horizonYears: number
): YearResult[] {
  const results: YearResult[] = [];
  let bal = { ...opening };
  for (let y = 0; y < horizonYears; y++) {
    const dec = decisions[y] || decisions[decisions.length - 1] || { yearIndex: y };
    const age = assumptions.startAge + y;
    const result = simulateYear(y, age, bal, { ...dec, yearIndex: y }, assumptions);
    results.push(result);
    bal = result.closingBalances;
  }
  return results;
}
