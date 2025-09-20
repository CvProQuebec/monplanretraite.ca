/**
 * PurchaseComparatorService
 * Compares New vs Used vs Financing options using TCO (Total Cost of Ownership)
 * and monthly affordability. 100% local, deterministic, and typé.
 */
export type Currency = number; // CAD

export interface FinancingParams {
  price: Currency;           // Prix avant taxes
  downPayment?: Currency;    // Mise de fonds
  annualRate?: number;       // Taux annuel (ex: 0.069 pour 6.9 %)
  termMonths?: number;       // Terme en mois
  salesTaxRate?: number;     // Taxes de vente (ex: 0.15)
  warrantyCost?: Currency;   // Coût de garantie prolongée (si applicable)
  registrationFees?: Currency; // Frais d'immatriculation/administration
}

export interface OwnershipCosts {
  maintenancePerYear?: Currency; // Entretien moyen par année
  insurancePerYear?: Currency;   // Assurance par année
  fuelOrEnergyPerYear?: Currency;// Carburant/énergie par année
  expectedResaleValue?: Currency;// Valeur de revente anticipée à la fin de l'horizon
  otherRecurringPerYear?: Currency; // Autres coûts récurrents
}

export interface PurchaseOptionInput {
  label: 'Neuf' | 'Usagé' | 'Financement';
  financing: FinancingParams;
  ownership: OwnershipCosts;
}

export interface ComparatorInput {
  horizonYears: number;            // Horizon d'analyse (ex: 5 ans)
  options: PurchaseOptionInput[];  // 2-3 options à comparer
}

export interface OptionResult {
  label: string;
  monthlyPayment: Currency;       // Paiement mensuel (si financement)
  upfrontCost: Currency;          // Mise de fonds + frais initiaux + taxes sur mise de fonds si applicable
  totalCost: Currency;            // TCO sur l'horizon
  monthlyTCO: Currency;           // TCO / (horizonYears * 12)
}

export interface ComparatorResult {
  horizonYears: number;
  results: OptionResult[];
  bestByTotalCost: OptionResult;
  bestByMonthlyTCO: OptionResult;
  recommendation: string; // Phrase FR simple
}

/**
 * Amortization formula: returns monthly payment for principal P,
 * annual rate r, term n months. If rate is 0 or near 0, returns P/n.
 */
export function monthlyPayment(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 12;
  if (!isFinite(r) || Math.abs(r) < 1e-9) {
    return principal / Math.max(1, termMonths);
  }
  const a = Math.pow(1 + r, termMonths);
  return principal * (r * a) / (a - 1);
}

/**
 * Computes TCO for an option on a given horizon.
 * - Financed amount includes taxes (if salesTaxRate provided)
 * - Upfront cost includes downPayment + fees + warranty (if given)
 * - Adds recurring yearly costs over horizon
 * - Subtracts expected resale value at end (if provided)
 */
export function computeOptionTCO(horizonYears: number, input: PurchaseOptionInput): OptionResult {
  const { financing, ownership } = input;
  const price = safe(financing.price);
  const taxRate = safe(financing.salesTaxRate, 0.15); // default 15%
  const down = safe(financing.downPayment);
  const term = Math.max(1, Math.floor(safe(financing.termMonths, 60))); // default 60 mois
  const annualRate = safe(financing.annualRate, 0.07); // default 7% annuel
  const warranty = safe(financing.warrantyCost);
  const fees = safe(financing.registrationFees);

  // Taxes sur le prix (simplifié: taxes appliquées sur prix)
  const totalPriceWithTax = price * (1 + taxRate);

  // Montant financé (sans la mise de fonds)
  const financedPrincipal = Math.max(0, totalPriceWithTax - down);

  const pmt = monthlyPayment(financedPrincipal, annualRate, term);

  // Somme des paiements effectués pendant l'horizon (au plus "term" mois)
  const monthsInHorizon = Math.min(term, Math.max(1, Math.floor(horizonYears * 12)));
  const paidDuringHorizon = pmt * monthsInHorizon;

  // Coûts récurrents annuels
  const maintenance = safe(ownership.maintenancePerYear) * horizonYears;
  const insurance = safe(ownership.insurancePerYear) * horizonYears;
  const energy = safe(ownership.fuelOrEnergyPerYear) * horizonYears;
  const other = safe(ownership.otherRecurringPerYear) * horizonYears;

  // Coûts initiaux (mise de fonds + frais + garantie)
  const upfront = down + warranty + fees;

  // Valeur de revente (soustraite du TCO)
  const resale = safe(ownership.expectedResaleValue);

  // Total cost of ownership
  const totalCost = upfront + paidDuringHorizon + maintenance + insurance + energy + other - resale;

  return {
    label: input.label,
    monthlyPayment: round2(pmt),
    upfrontCost: round2(upfront),
    totalCost: round2(totalCost),
    monthlyTCO: round2(totalCost / Math.max(1, horizonYears * 12))
  };
}

export class PurchaseComparatorService {
  static compare(params: ComparatorInput): ComparatorResult {
    const horizonYears = Math.max(1, Math.floor(params.horizonYears));
    const results = params.options.map(opt => computeOptionTCO(horizonYears, opt));

    // Bests
    const bestByTotalCost = results.slice().sort((a, b) => a.totalCost - b.totalCost)[0];
    const bestByMonthlyTCO = results.slice().sort((a, b) => a.monthlyTCO - b.monthlyTCO)[0];

    // Simple recommendation (FR)
    let recommendation = '';
    if (bestByTotalCost.label === bestByMonthlyTCO.label) {
      recommendation = `Option recommandée: ${bestByTotalCost.label} (coût total et coût mensuel les plus bas).`;
    } else {
      recommendation = `Option ${bestByTotalCost.label} minimise le coût total, mais ${bestByMonthlyTCO.label} minimise le coût mensuel (meilleure liquidité).`;
    }

    return {
      horizonYears,
      results,
      bestByTotalCost,
      bestByMonthlyTCO,
      recommendation
    };
  }
}

// Helpers
function safe(v: any, def = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}
function round2(x: number): number {
  return Math.round((x + Number.EPSILON) * 100) / 100;
}
