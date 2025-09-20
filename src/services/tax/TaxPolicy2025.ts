/**
 * TaxPolicy2025 — QC + Federal (baseline approx for 2025)
 * 100% local; values are configurable and easy to update yearly.
 *
 * DISCLAIMER:
 * - Educational approximations; not tax advice.
 * - Rounded thresholds; tune as needed when official values are published.
 * - Designed to be consumed by TaxEngine.ts (pure, deterministic).
 */

export type ProvinceCode = 'QC';

export interface TaxBracket {
  upTo: number;   // inclusive upper bound for this bracket, Infinity for last
  rate: number;   // marginal rate (e.g., 0.205 for 20.5%)
}

export interface NonRefundableCredits {
  // Basic personal amounts
  basicPersonalFederal: number;
  basicPersonalQuebec: number;

  // Age amount (phase-out handled in engine)
  ageAmountFederal: number;
  ageAmountQuebec: number;

  // Pension amount (eligible pension income)
  pensionAmountFederal: number;
  pensionAmountQuebec: number;

  // Spouse/common-law basic amount (handled if needed later)
  spouseAmountFederal: number;
  spouseAmountQuebec: number;

  // Disability tax credit (placeholder baseline)
  disabilityAmountFederal: number;
  disabilityAmountQuebec: number;

  // Credit rates (non-refundable)
  federalCreditRate: number; // e.g., 0.15
  quebecCreditRate: number;  // e.g., 0.15
}

export interface DividendParams {
  eligible: {
    grossUp: number;     // e.g., 0.38 → grossed-up by +38%
    fedCredit: number;   // e.g., 0.1502 → 15.02% federal div tax credit on grossed-up
    qcCredit: number;    // provincial credit on grossed-up (approx)
  };
  nonEligible: {
    grossUp: number;     // e.g., 0.15 → +15%
    fedCredit: number;   // federal DTC
    qcCredit: number;    // provincial DTC
  };
}

export interface OasParams {
  annualBenefitMax: number;     // approximate annual OAS benefit if fully eligible
  recoveryStart: number;        // income threshold where clawback begins
  recoveryRate: number;         // e.g., 0.15 (15%)
}

export interface GisParams {
  // GIS is complex: we attach a placeholder model here; engine can refine later.
  // For now, we expose a basic toggle and reduction per dollar of income above a baseline (approx).
  enabled: boolean;
  baseAnnual: number;          // base GIS at zero other income (approx for single)
  reductionRate: number;       // per dollar of income (approx effective)
}

export interface RrifParams {
  minFactorsByAge: Record<number, number>; // age -> min withdrawal factor (e.g., 71 → 0.0528)
}

export interface TaxPolicy {
  year: number;
  province: ProvinceCode;

  federalBrackets: TaxBracket[];
  quebecBrackets: TaxBracket[];

  credits: NonRefundableCredits;
  dividends: DividendParams;
  oas: OasParams;
  gis: GisParams;
  rrif: RrifParams;

  capitalGainsInclusion: number; // e.g., 0.5 (50%)
}

/**
 * 2025 Federal brackets (approx; indexation TBD)
 * Based on recent ranges; adjust with official 2025 thresholds when available.
 */
export const FEDERAL_BRACKETS_2025: TaxBracket[] = [
  { upTo: 55867, rate: 0.15 },
  { upTo: 111733, rate: 0.205 },
  { upTo: 173205, rate: 0.26 },
  { upTo: 246752, rate: 0.29 },
  { upTo: Infinity, rate: 0.33 }
];

/**
 * 2025 Québec brackets (approx; indexation TBD)
 */
export const QUEBEC_BRACKETS_2025: TaxBracket[] = [
  { upTo: 51780, rate: 0.14 },
  { upTo: 103545, rate: 0.19 },
  { upTo: 126000, rate: 0.24 },
  { upTo: Infinity, rate: 0.2575 }
];

/**
 * 2025 Non-refundable credits (baseline approximations)
 * Update when official values are published.
 */
export const CREDITS_2025: NonRefundableCredits = {
  basicPersonalFederal: 15700, // approx
  basicPersonalQuebec: 17800,  // approx
  ageAmountFederal: 8200,      // approx, subject to phase-out
  ageAmountQuebec: 3200,       // approx, subject to phase-out
  pensionAmountFederal: 2000,
  pensionAmountQuebec: 2000,
  spouseAmountFederal: 15000,  // approx
  spouseAmountQuebec: 17000,   // approx
  disabilityAmountFederal: 9300, // approx
  disabilityAmountQuebec: 3500,  // approx
  federalCreditRate: 0.15,
  quebecCreditRate: 0.15
};

/**
 * Dividend parameters (approx current rules)
 */
export const DIVIDENDS_2025: DividendParams = {
  eligible: { grossUp: 0.38, fedCredit: 0.1502, qcCredit: 0.11 },
  nonEligible: { grossUp: 0.15, fedCredit: 0.091, qcCredit: 0.04 }
};

/**
 * OAS parameters (approx; adjust each July if needed)
 */
export const OAS_2025: OasParams = {
  annualBenefitMax: 8400,  // approx annual OAS at full
  recoveryStart: 93000,    // approx 2025 threshold
  recoveryRate: 0.15
};

/**
 * GIS placeholder model (very approximate)
 * Real GIS depends on marital status, OAS, other income. Keep simple baseline here.
 */
export const GIS_2025: GisParams = {
  enabled: true,
  baseAnnual: 12000,      // baseline for single, no other income (approx)
  reductionRate: 0.5      // 50% reduction per dollar of income (very rough proxy)
};

/**
 * RRIF minimum withdrawal factors (subset; extend as needed)
 * Source: CRA tables. These are approximations.
 */
export const RRIF_MIN_FACTORS: Record<number, number> = {
  71: 0.0528, 72: 0.0540, 73: 0.0553, 74: 0.0567, 75: 0.0582,
  76: 0.0598, 77: 0.0617, 78: 0.0636, 79: 0.0658, 80: 0.0682,
  81: 0.0708, 82: 0.0738, 83: 0.0771, 84: 0.0808, 85: 0.0851,
  86: 0.0899, 87: 0.0955, 88: 0.1021, 89: 0.1099, 90: 0.1192,
  91: 0.1306, 92: 0.1449, 93: 0.1634, 94: 0.1879, 95: 0.20
};

export const TAX_POLICY_2025_QC: TaxPolicy = {
  year: 2025,
  province: 'QC',
  federalBrackets: FEDERAL_BRACKETS_2025,
  quebecBrackets: QUEBEC_BRACKETS_2025,
  credits: CREDITS_2025,
  dividends: DIVIDENDS_2025,
  oas: OAS_2025,
  gis: GIS_2025,
  rrif: { minFactorsByAge: RRIF_MIN_FACTORS },
  capitalGainsInclusion: 0.5
};
