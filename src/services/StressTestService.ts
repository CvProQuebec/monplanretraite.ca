/**
 * StressTestService
 * Dedicated stress-test module aligned with the blog guidance:
 *  - Sequence risk: -30% then -15% (années 1-2)
 *  - Inflation spike: +8% inflation during 2 years on essential expenses
 *  - Longevity risk: +5 years vs baseline
 *
 * 100% local heuristics; no external APIs. Results produce pass/warn/fail with suggestions.
 */

import { UserData } from '@/features/retirement/types';
import { recommendAllocation, recommendedEquityBand } from './PortfolioOptimizationService';

export type StressLevel = 'pass' | 'warn' | 'fail';

export interface StressScenarioResult {
  id: 'sequence' | 'inflationSpike' | 'longevity';
  title: string;
  level: StressLevel;
  summary: string;
  metrics: Record<string, number | string>;
  suggestions: string[];
}

export interface StressTestParams {
  age?: number;                        // if omitted, derived from userData.personal.naissance1
  portfolioValue?: number;             // CAD, total investable assets
  monthlyEssentialSpending?: number;   // CAD, essential monthly needs
  currentEquityAllocation?: number;    // 0..1, if known
}

export interface StressTestReport {
  scenarios: StressScenarioResult[];
  overall: StressLevel;
  notes: string[];
}

function toNumber(x: any): number {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function deriveAgeFromUserData(userData: UserData): number | undefined {
  const b = (userData as any)?.personal?.naissance1;
  if (!b) return undefined;
  const d = new Date(b);
  if (Number.isNaN(d.getTime())) return undefined;
  return new Date().getFullYear() - d.getFullYear();
}

function sumObjValues(obj: any, keys: string[]): number {
  return keys.reduce((s, k) => s + toNumber(obj?.[k]), 0);
}

function computeMonthlyEssential(userData: UserData): number {
  const cf: any = (userData as any).cashflow || {};
  // Essential buckets: logement, servicesPublics, assurances, alimentation, transport, sante
  const keys = ['logement', 'servicesPublics', 'assurances', 'alimentation', 'transport', 'sante'];
  return sumObjValues(cf, keys);
}

function computePortfolioValueHeuristic(userData: UserData): number {
  const s: any = (userData as any).savings || {};
  const candidates = [
    'reer1','reer2','celi1','celi2','placements1','placements2','epargne1','epargne2','cri1','cri2'
  ];
  return candidates.reduce((sum, k) => sum + toNumber(s[k]), 0);
}

function classify(levels: StressLevel[]): StressLevel {
  if (levels.includes('fail')) return 'fail';
  if (levels.includes('warn')) return 'warn';
  return 'pass';
}

export class StressTestService {
  static run(userData: UserData, params: StressTestParams = {}): StressTestReport {
    const age = params.age ?? deriveAgeFromUserData(userData) ?? 70;
    const monthlyEssentialSpending = params.monthlyEssentialSpending ?? computeMonthlyEssential(userData);
    const portfolioValue = params.portfolioValue ?? computePortfolioValueHeuristic(userData);
    const currentEq = params.currentEquityAllocation; // unknown -> we will advise band

    // Recommendation baseline (aligné article)
    const rec = recommendAllocation(age, monthlyEssentialSpending, portfolioValue);
    const band = recommendedEquityBand(age);

    const scenarios: StressScenarioResult[] = [];

    // 1) Sequence risk: -30% then -15% (années 1-2)
    // Coverage heuristic: cash cushion >= 12 months passes; 6-11 -> warn; <6 -> fail
    const cashMonths = portfolioValue > 0 ? Math.min(24, Math.max(0, Math.floor((rec.targetAllocation.cash * portfolioValue) / Math.max(1, monthlyEssentialSpending)))) : 0;
    let seqLevel: StressLevel = 'pass';
    if (cashMonths < 6) seqLevel = 'fail';
    else if (cashMonths < 12) seqLevel = 'warn';
    const seqSuggestions: string[] = [];
    if (cashMonths < 12) {
      seqSuggestions.push(
        'Constituez un coussin de 12–24 mois de dépenses essentielles en liquidités (comptes à intérêt élevé, CPG courts).'
      );
    }
    // Equity allocation guidance for sequence risk
    if (currentEq != null) {
      if (currentEq < band.min) {
        seqSuggestions.push(`Augmentez graduellement la poche actions vers ${Math.round(((band.min + band.max)/2)*100)} % (bandes ${Math.round(band.min*100)}–${Math.round(band.max*100)} %).`);
        if (seqLevel !== 'fail') seqLevel = 'warn';
      } else if (currentEq > band.max) {
        seqSuggestions.push('Ramenez la poche actions dans la bande recommandée pour limiter la variabilité des deux premières années.');
        if (seqLevel !== 'fail') seqLevel = 'warn';
      }
    } else {
      seqSuggestions.push(`Ciblez ${Math.round(((band.min + band.max)/2) * 100)} % d’actions avec rééquilibrage annuel et bande ±5 %.`);
    }
    seqSuggestions.push('Rééquilibrez annuellement; vendez ce qui a trop monté et achetez ce qui a baissé (discipline).');

    scenarios.push({
      id: 'sequence',
      title: 'Risque de séquence (-30% puis -15%)',
      level: seqLevel,
      summary: cashMonths >= 12
        ? 'Coussin suffisant pour traverser 2 années défavorables sans vendre des actions.'
        : 'Coussin insuffisant pour absorber deux années défavorables sans ventes forcées.',
      metrics: {
        cashCushionMonths: cashMonths,
        recommendedEquityMid: ((band.min + band.max)/2).toFixed(2)
      },
      suggestions: seqSuggestions
    });

    // 2) Inflation spike: +8% inflation for 2 years on essential spending
    // Heuristic: if essential spending * 1.08^2 still leaves monthlyCashflow >= 0 (assuming income stable), pass; slight negative -> warn; large negative -> fail
    // We don't have full income pipeline here, so we check if cash cushion + bond pocket can absorb the 2-year shock.
    const twoYearInflated = monthlyEssentialSpending * Math.pow(1.08, 2);
    const extraPerMonth = twoYearInflated - monthlyEssentialSpending; // delta due to spike
    const monthlyBuffer = Math.max(0, (rec.targetAllocation.cash * portfolioValue) / Math.max(1, 12)); // approx monthly from 12 months cushion
    const absorbRatio = monthlyBuffer > 0 ? extraPerMonth / monthlyBuffer : Infinity; // <=1 means covered by cash buffer approximation

    let infLevel: StressLevel = 'pass';
    if (!Number.isFinite(absorbRatio) || absorbRatio > 1.5) infLevel = 'fail';
    else if (absorbRatio > 0.6) infLevel = 'warn';

    const infSuggestions: string[] = [
      'Indexez vos retraits d’environ 3 % par an en régime normal et évitez de sur‑indexer lors des pics temporaires.',
      'Privilégiez des actions de qualité et des secteurs résilients (santé, biens de consommation, financiers).',
    ];
    if (infLevel !== 'pass') {
      infSuggestions.push('Augmentez le coussin de liquidités (vers 18–24 mois) pour amortir les pics d’inflation temporaires.');
    }

    scenarios.push({
      id: 'inflationSpike',
      title: 'Choc d’inflation (+8 % sur 2 ans)',
      level: infLevel,
      summary: infLevel === 'pass'
        ? 'Coussin et allocation compatibles avec un pic d’inflation de 2 ans.'
        : 'Pic d’inflation stressant la marge mensuelle: ajustez le coussin et tenez la ligne de rééquilibrage.',
      metrics: {
        inflatedMonthly: Math.round(twoYearInflated),
        extraPerMonth: Math.round(extraPerMonth),
        approxMonthlyFromCash: Math.round(monthlyBuffer)
      },
      suggestions: infSuggestions
    });

    // 3) Longevity +5 years
    // Heuristic: If age-band equities ok and cash cushion >= 12 months -> pass; else warn/fail
    let lonLevel: StressLevel = 'pass';
    const notesLon: string[] = ['Pensez sur 30 ans, pas 3 mois; l’inflation ne pardonne pas.'];
    if (currentEq != null && (currentEq < band.min || currentEq > band.max)) {
      lonLevel = 'warn';
      notesLon.push('Alignez la poche actions avec la bande recommandée (60–75 % typiquement) pour préserver le pouvoir d’achat sur +5 ans.');
    }
    if (cashMonths < 12) {
      lonLevel = lonLevel === 'warn' ? 'fail' : 'warn';
      notesLon.push('Un coussin de 12–24 mois renforce la robustesse de fin de vie (+5 ans).');
    }

    scenarios.push({
      id: 'longevity',
      title: 'Longévité +5 ans',
      level: lonLevel,
      summary: lonLevel === 'pass'
        ? 'Allocation et coussin compatibles avec +5 ans de longévité.'
        : 'Ajustez la poche actions et/ou le coussin pour un horizon plus long.',
      metrics: {
        equityBandMin: band.min,
        equityBandMax: band.max,
        cashCushionMonths: cashMonths
      },
      suggestions: notesLon
    });

    const overall = classify(scenarios.map(s => s.level));
    const notes: string[] = [
      'Stratégie moderne: 60–75 % actions diversifiées, 25–40 % obligations, 12–24 mois de liquidités.',
      'Rééquilibrage annuel et bande ±5 %: vendez ce qui a trop monté, achetez ce qui a baissé.',
      'Diversification géographique: CA ~27,5 %, US ~37,5 %, International ~35 % (dans la poche actions).'
    ];

    return { scenarios, overall, notes };
  }
}

export default StressTestService;
