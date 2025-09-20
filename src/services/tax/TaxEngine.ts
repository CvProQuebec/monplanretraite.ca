/**
 * TaxEngine — v1 (QC + Federal, 2025 baseline)
 * 100% local, deterministic. Educational approximations (not tax advice).
 *
 * Responsibilities:
 * - Compute annual tax for a household (single or couple simplified later)
 * - Handle: ordinary income, eligible/non-eligible dividends, capital gains inclusion,
 *          basic non-refundable credits (basic, age, pension), OAS clawback, GIS proxy,
 *          Quebec + Federal brackets
 * - Provide a simple MTR approximation by delta (+$100 ordinary income)
 *
 * Design:
 * - Pure functions, no UI. Consumed by ProjectionEngine/Optimizers.
 */

import {
  TAX_POLICY_2025_QC,
  type TaxPolicy,
  type TaxBracket,
  type ProvinceCode
} from './TaxPolicy2025';

export type FilingStatus = 'single' | 'couple'; // v1 focuses on 'single'; couple support can extend later

export interface IncomeInputs {
  // Ordinary income (employment, interest, pensions not specially treated below)
  ordinaryIncome: number;

  // Pension eligible for pension credit (approx annual)
  eligiblePensionIncome?: number;

  // CPP/QPP and OAS actual paid in the year (gross before recovery)
  cpp?: number;
  oas?: number;

  // Dividends (CAD)
  eligibleDividends?: number;
  nonEligibleDividends?: number;

  // Capital gains (realized)
  capitalGains?: number;

  // RRSP/RRIF flows (annual net gross)
  rrspWithdrawals?: number; // treated as ordinary income
  rrifWithdrawals?: number; // ordinary

  // Age and province
  age?: number;
  province?: ProvinceCode; // currently only 'QC'

  // Flags / future options
  status?: FilingStatus; // 'single' default
}

export interface TaxResult {
  taxableFederal: number;
  taxableQuebec: number;

  federalTaxBeforeCredits: number;
  quebecTaxBeforeCredits: number;

  nonRefundableCreditsAppliedFed: number;
  nonRefundableCreditsAppliedQc: number;

  federalTaxAfterCredits: number;
  quebecTaxAfterCredits: number;

  oasClawback: number; // recovered from OAS
  gisBenefit: number;  // positive if eligible (proxy)

  totalTax: number;    // fed + qc + oasClawback - gis (GIS reduces net tax effect)
  netIncome: number;   // gross income + gis - oasClawback - totalTax

  breakdown: {
    grossIncome: number;
    ordinary: number;
    eligibleDividends: number;
    nonEligibleDividends: number;
    capitalGainsRealized: number;
    capitalGainsTaxablePortion: number;
    cpp: number;
    oasGross: number;
  };
}

export interface MTRApprox {
  base: TaxResult;
  withDelta: TaxResult;
  marginalRate: number; // (tax(withDelta) - tax(base)) / delta
}

const policy: TaxPolicy = TAX_POLICY_2025_QC;

/**
 * Compute federal/provincial (QC) tax on a taxable base using brackets.
 */
function taxFromBrackets(taxable: number, brackets: TaxBracket[]): number {
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    const upper = b.upTo;
    const slice = Math.max(0, Math.min(taxable, upper) - prev);
    tax += slice * b.rate;
    prev = upper;
    if (taxable <= upper) break;
  }
  return tax;
}

/**
 * Non-refundable credits application:
 * - Computes credit base * creditRate; limited by tax (cannot create refund)
 */
function applyNonRefundableCredits(
  taxBefore: number,
  creditBase: number,
  creditRate: number
): { creditApplied: number; taxAfter: number } {
  const credit = creditBase * creditRate;
  const applied = Math.min(credit, Math.max(0, taxBefore));
  return { creditApplied: applied, taxAfter: Math.max(0, taxBefore - applied) };
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

/**
 * Build taxable incomes per system (federal/provincial) including gross-ups/partial inclusion rules.
 */
function buildTaxableAmounts(input: IncomeInputs): {
  grossIncome: number;
  ordinary: number;
  eligibleDivGrossed: number;
  nonEligibleDivGrossed: number;
  capGainsTaxable: number;
  cpp: number;
  oas: number;
} {
  const p = policy;
  const ordinary = Math.max(0, Number(input.ordinaryIncome) || 0)
    + Math.max(0, Number(input.rrspWithdrawals) || 0)
    + Math.max(0, Number(input.rrifWithdrawals) || 0)
    + Math.max(0, Number(input.eligiblePensionIncome) || 0);

  const cpp = Math.max(0, Number(input.cpp) || 0);
  const oas = Math.max(0, Number(input.oas) || 0);

  const eligDiv = Math.max(0, Number(input.eligibleDividends) || 0);
  const nonEligDiv = Math.max(0, Number(input.nonEligibleDividends) || 0);

  const eligGrossed = eligDiv * (1 + p.dividends.eligible.grossUp);
  const nonEligGrossed = nonEligDiv * (1 + p.dividends.nonEligible.grossUp);

  const capG = Math.max(0, Number(input.capitalGains) || 0);
  const capGTaxable = capG * p.capitalGainsInclusion;

  const grossIncome =
    ordinary + eligDiv + nonEligDiv + capG + cpp + oas;

  return {
    grossIncome,
    ordinary,
    eligibleDivGrossed: eligGrossed,
    nonEligibleDivGrossed: nonEligGrossed,
    capGainsTaxable: capGTaxable,
    cpp,
    oas
  };
}

/**
 * Compute non-refundable credit base (federal or QC) using policy amounts.
 * v1: basic personal + age amount (if 65+) + pension amount (if eligible)
 * Phase-out logic for age amount kept simple: reduce if income beyond a threshold.
 */
function computeCreditBase(
  taxableForCredits: number,
  age?: number,
  eligiblePensionIncome?: number,
  which: 'federal' | 'qc' = 'federal'
): number {
  const c = policy.credits;
  const base =
    (which === 'federal' ? c.basicPersonalFederal : c.basicPersonalQuebec) +
    (age && age >= 65 ? (which === 'federal' ? c.ageAmountFederal : c.ageAmountQuebec) : 0) +
    (eligiblePensionIncome && eligiblePensionIncome > 0
      ? (which === 'federal' ? c.pensionAmountFederal : c.pensionAmountQuebec)
      : 0);

  // Simple phase-out for federal age amount starting at ~$42k (approx), eliminate by ~$100k.
  if (age && age >= 65 && which === 'federal') {
    const start = 42000;
    const end = 100000;
    if (taxableForCredits > start) {
      const factor = clamp(1 - (taxableForCredits - start) / (end - start), 0, 1);
      const reduction = c.ageAmountFederal * (1 - factor);
      return Math.max(0, base - reduction);
    }
  }

  return Math.max(0, base);
}

/**
 * Dividend tax credits (simplified): applied AFTER gross-up. Credits reduce tax payable.
 */
function computeDividendCredits(
  eligibleGrossed: number,
  nonEligibleGrossed: number
): { federal: number; qc: number } {
  const d = policy.dividends;
  const fed = eligibleGrossed * d.eligible.fedCredit + nonEligibleGrossed * d.nonEligible.fedCredit;
  const qc = eligibleGrossed * d.eligible.qcCredit + nonEligibleGrossed * d.nonEligible.qcCredit;
  return { federal: fed, qc };
}

/**
 * OAS clawback (recovery): 15% of income over threshold, limited to OAS amount.
 * Uses 'net income for OAS' proxy = ordinary + grossed dividends + taxable CG + CPP + OAS.
 */
function computeOasClawback(
  taxableComponents: ReturnType<typeof buildTaxableAmounts>
): number {
  const oasParams = policy.oas;
  const oasIncomeProxy =
    taxableComponents.ordinary +
    taxableComponents.eligibleDivGrossed +
    taxableComponents.nonEligibleDivGrossed +
    taxableComponents.capGainsTaxable +
    taxableComponents.cpp +
    taxableComponents.oas;

  if (oasIncomeProxy <= oasParams.recoveryStart) return 0;
  const excess = oasIncomeProxy - oasParams.recoveryStart;
  const recover = excess * oasParams.recoveryRate;
  return Math.min(recover, taxableComponents.oas); // cannot recover more than OAS received
}

/**
 * GIS proxy: baseline minus reductionRate * other income (excluding OAS itself ideally).
 * Very approximate. Floor at 0.
 */
function computeGisProxy(
  taxableComponents: ReturnType<typeof buildTaxableAmounts>
): number {
  const g = policy.gis;
  if (!g.enabled) return 0;
  const otherIncome =
    taxableComponents.ordinary +
    taxableComponents.eligibleDivGrossed +
    taxableComponents.nonEligibleDivGrossed +
    taxableComponents.capGainsTaxable +
    taxableComponents.cpp; // exclude OAS for reduction baseline
  const reduced = Math.max(0, g.baseAnnual - g.reductionRate * otherIncome);
  return reduced;
}

/**
 * Compute full tax result for the year for a single filer in QC.
 * Couple support to extend later (splitting etc.).
 */
export function computeTaxYear(input: IncomeInputs): TaxResult {
  const age = input.age ?? 70;
  const status = input.status ?? 'single';
  const province = input.province ?? 'QC';

  if (province !== 'QC') {
    throw new Error('Only QC policy is configured in v1.');
  }

  const comp = buildTaxableAmounts(input);

  // Taxable income (federal/provincial) base:
  const taxableFed =
    comp.ordinary + comp.eligibleDivGrossed + comp.nonEligibleDivGrossed + comp.capGainsTaxable + comp.cpp + comp.oas;
  const taxableQc =
    comp.ordinary + comp.eligibleDivGrossed + comp.nonEligibleDivGrossed + comp.capGainsTaxable + comp.cpp + comp.oas;

  // Bracket taxes
  const federalBefore = taxFromBrackets(taxableFed, policy.federalBrackets);
  const quebecBefore = taxFromBrackets(taxableQc, policy.quebecBrackets);

  // Non-refundable credits bases and application
  const creditBaseFed = computeCreditBase(taxableFed, age, input.eligiblePensionIncome, 'federal');
  const creditBaseQc = computeCreditBase(taxableQc, age, input.eligiblePensionIncome, 'qc');

  const crFed = applyNonRefundableCredits(federalBefore, creditBaseFed, policy.credits.federalCreditRate);
  const crQc = applyNonRefundableCredits(quebecBefore, creditBaseQc, policy.credits.quebecCreditRate);

  // Dividend credits reduce tax further (post non-refundable credits)
  const divCred = computeDividendCredits(comp.eligibleDivGrossed, comp.nonEligibleDivGrossed);

  const federalAfter = Math.max(0, crFed.taxAfter - divCred.federal);
  const quebecAfter = Math.max(0, crQc.taxAfter - divCred.qc);

  // OAS clawback
  const oasClawback = computeOasClawback(comp);

  // GIS proxy
  const gis = computeGisProxy(comp);

  const totalTax = federalAfter + quebecAfter + oasClawback - gis;

  const netIncome =
    comp.ordinary +
    input.eligiblePensionIncome! +
    comp.cpp +
    (comp.oas - oasClawback) +
    (input.eligibleDividends || 0) +
    (input.nonEligibleDividends || 0) +
    (input.capitalGains || 0) -
    (federalAfter + quebecAfter) +
    gis;

  return {
    taxableFederal: taxableFed,
    taxableQuebec: taxableQc,
    federalTaxBeforeCredits: federalBefore,
    quebecTaxBeforeCredits: quebecBefore,
    nonRefundableCreditsAppliedFed: crFed.creditApplied,
    nonRefundableCreditsAppliedQc: crQc.creditApplied,
    federalTaxAfterCredits: federalAfter,
    quebecTaxAfterCredits: quebecAfter,
    oasClawback,
    gisBenefit: gis,
    totalTax,
    netIncome,
    breakdown: {
      grossIncome: comp.grossIncome,
      ordinary: comp.ordinary,
      eligibleDividends: input.eligibleDividends || 0,
      nonEligibleDividends: input.nonEligibleDividends || 0,
      capitalGainsRealized: input.capitalGains || 0,
      capitalGainsTaxablePortion: comp.capGainsTaxable,
      cpp: comp.cpp,
      oasGross: comp.oas
    }
  };
}

/**
 * Approximate MTR by adding +delta to ordinary income and recomputing taxes.
 */
export function approxMTR(input: IncomeInputs, delta: number = 100): MTRApprox {
  const base = computeTaxYear(input);
  const withDelta = computeTaxYear({
    ...input,
    ordinaryIncome: Math.max(0, (input.ordinaryIncome || 0) + delta)
  });
  const dTax = withDelta.totalTax - base.totalTax;
  return {
    base,
    withDelta,
    marginalRate: dTax / delta
  };
}
