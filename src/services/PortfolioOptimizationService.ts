/**
 * PortfolioOptimizationService
 * Recommande une allocation cible moderne (2025) alignée avec l’article:
 *  - 60–75 % d’actions selon l’âge
 *  - Répartition géographique (CA/US/International)
 *  - Coussin de liquidités 12–24 mois
 *  - Règle de rééquilibrage: +/-5 % autour de la cible (suggestions)
 *
 * 100% local, sans API externe.
 */

export type Allocation = {
  equities: number;   // 0..1
  bonds: number;      // 0..1
  cash: number;       // 0..1
};

export type EquityGeoBreakdown = {
  canada: number;       // part des actions (0..1)
  unitedStates: number; // part des actions (0..1)
  international: number;// part des actions (0..1)
};

export type OptimizationRecommendation = {
  targetAllocation: Allocation;
  equityBand: { min: number; max: number }; // 0..1
  equityGeoBreakdown: EquityGeoBreakdown;   // parts dans la poche actions
  cashCushionMonths: { min: number; max: number };
  notes: string[];
};

export type RebalanceDelta = {
  asset: 'equities' | 'bonds' | 'cash';
  delta: number; // positif = à augmenter, négatif = à réduire (en points décimaux 0..1)
};

export type RebalancePlan = {
  current: Allocation;
  target: Allocation;
  deltas: RebalanceDelta[];
  rule: string; // ex. 'Rééquilibrage si écart > 5 %'
};

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

function round2(x: number): number {
  return Math.round((x + Number.EPSILON) * 100) / 100;
}

/**
 * Bande recommandée d’actions selon l’âge (alignée avec l’article)
 */
export function recommendedEquityBand(age: number): { min: number; max: number } {
  if (age < 60) return { min: 0.70, max: 0.75 }; // pré‑retraite active
  if (age <= 65) return { min: 0.70, max: 0.75 };
  if (age <= 75) return { min: 0.65, max: 0.70 };
  if (age <= 85) return { min: 0.60, max: 0.65 };
  return { min: 0.55, max: 0.60 };
}

/**
 * Répartition géographique recommandée pour la poche actions (doit sommer à 1.0)
 *  - Canada 25–30 %
 *  - États‑Unis 35–40 %
 *  - International 25–30 %
 * On prend les points médians.
 */
export function recommendedEquityGeoBreakdown(): EquityGeoBreakdown {
  return {
    canada: 0.275,
    unitedStates: 0.375,
    international: 0.35
  };
}

/**
 * Recommandation d’allocation globale (Actions/Obligations/Cash)
 * - Équities = milieu de bande
 * - Cash: coussin de 12–24 mois converti en proportion si un coût mensuel est fourni,
 *         sinon alloue par défaut 5 % et ajuste obligations.
 */
export function recommendAllocation(
  age: number,
  monthlyEssentialSpending?: number, // pour convertir le coussin en %
  portfolioValue?: number            // valeur du portefeuille
): OptimizationRecommendation {
  const band = recommendedEquityBand(age);
  const equities = (band.min + band.max) / 2;

  // Coussin 12–24 mois (par défaut)
  const cushionMonths = { min: 12, max: 24 };

  // Si on a des montants, calculer la proportion de cash correspondant à 12 mois (côté prudent)
  let cashPct = 0.05; // valeur par défaut
  if (monthlyEssentialSpending && portfolioValue && portfolioValue > 0) {
    const neededCash = monthlyEssentialSpending * cushionMonths.min;
    cashPct = clamp01(neededCash / portfolioValue);
    // borne raisonnable: 0–15 %
    cashPct = Math.min(cashPct, 0.15);
  }

  // Obligations = reste
  let bonds = clamp01(1 - equities - cashPct);

  const targetAllocation: Allocation = {
    equities: round2(equities),
    bonds: round2(bonds),
    cash: round2(1 - round2(equities) - round2(bonds)) // assurer somme = 1
  };

  const notes: string[] = [
    'Allocation alignée sur la planification moderne (60–75 % actions).',
    'Maintenez un coussin de 12–24 mois de dépenses essentielles en liquidités pour traverser les baisses.',
    'Rééquilibrez annuellement et dès qu’un écart dépasse ±5 % de la cible (vendre ce qui a trop monté, acheter ce qui a baissé).',
    'Diversification actions: CA 27,5 %, US 37,5 %, International 35 %.'
  ];

  return {
    targetAllocation,
    equityBand: band,
    equityGeoBreakdown: recommendedEquityGeoBreakdown(),
    cashCushionMonths: cushionMonths,
    notes
  };
}

/**
 * Plan de rééquilibrage: retourne les deltas à appliquer par classe d’actifs (en points de pourcentage décimaux)
 * Règle: déclencher si |delta| > 0.05 (5 points de pourcentage).
 */
export function computeRebalancePlan(current: Allocation, target: Allocation): RebalancePlan {
  const deltas: RebalanceDelta[] = [
    { asset: 'equities', delta: round2(target.equities - current.equities) },
    { asset: 'bonds', delta: round2(target.bonds - current.bonds) },
    { asset: 'cash', delta: round2(target.cash - current.cash) }
  ];

  // Normaliser si la somme cible n’est pas exactement 1
  const sumTarget = target.equities + target.bonds + target.cash;
  if (Math.abs(sumTarget - 1) > 1e-6) {
    const norm = (x: number) => x / sumTarget;
    target = {
      equities: round2(norm(target.equities)),
      bonds: round2(norm(target.bonds)),
      cash: round2(norm(target.cash))
    };
  }

  return {
    current,
    target,
    deltas,
    rule: 'Rééquilibrage si écart > 5 % (points de pourcentage).'
  };
}
