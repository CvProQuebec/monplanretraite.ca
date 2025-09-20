// src/services/PerformanceCalculationService.ts
// Calculs de performance avancés: IRR/XIRR (MWR), TWR, annualisation
// - 100 % local, sans dépendances externes
// - Typage strict + algorithmes robustes (sauvegardes numérales)
// - Conçu pour être réutilisé par l'UI (ReturnCalculator, pages Revenus, Monte Carlo)

export type Cashflow = {
  date: Date;     // Date du flux (irréguillère autorisée)
  amount: number; // Flux: dépôts négatifs (investissement), retraits/valeur finale positifs
};

export type ValuationPeriod = {
  startDate?: Date;       // Optionnel (pour annualisation TWR)
  endDate?: Date;         // Optionnel (pour annualisation TWR)
  startValue: number;     // Valeur de début de période
  endValue: number;       // Valeur de fin de période (avant/ou après flux net selon convention ci-dessous)
  netFlow?: number;       // Flux net pendant la période (dépôts positifs, retraits négatifs)
};

export interface IRROptions {
  guess?: number;         // Estimation initiale (défaut: 0.1 = 10 %)
  maxIterations?: number; // Défaut: 100
  tolerance?: number;     // Défaut: 1e-7
  lowerBound?: number;    // Défaut: -0.999 (proche de -100 %)
  upperBound?: number;    // Défaut: 10 (1000 %)
}

export interface TWRResult {
  totalReturn: number;          // Rendement total sur la période (décimal)
  annualizedReturn?: number;    // Annualisé si dates fournies (décimal)
}

export type TimeSeriesPoint = {
  date: Date;     // Date d'observation/flux
  value: number;  // Valeur de portefeuille à cette date (avant application de netFlow)
  netFlow?: number; // Flux net pendant la période précédente jusqu'à cette date (dépôts positifs, retraits négatifs)
};

export class PerformanceCalculationService {
  // === UTILITAIRES TEMPS ===
  static yearFraction(d1: Date, d2: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = (d2.getTime() - d1.getTime()) / msPerDay;
    return days / 365.25; // Convention simple (act/365.25)
  }

  // NPV pour flux irréguliers (utilisé par IRR/XIRR)
  static npvAtRate(cashflows: Cashflow[], rate: number): number {
    if (!cashflows.length) return 0;
    const t0 = cashflows[0].date;
    return cashflows.reduce((sum, cf) => {
      const y = PerformanceCalculationService.yearFraction(t0, cf.date);
      return sum + cf.amount / Math.pow(1 + rate, y);
    }, 0);
  }

  // Bracketing: cherche un intervalle [a,b] tel que NPV(a)*NPV(b) < 0
  static findBracket(
    cashflows: Cashflow[],
    lower = -0.999,
    upper = 10,
    grid: number[] = [-0.999, -0.9, -0.5, -0.2, -0.1, 0, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10]
  ): [number, number] | null {
    let prevR = grid[0];
    let prevNPV = PerformanceCalculationService.npvAtRate(cashflows, prevR);
    for (let i = 1; i < grid.length; i++) {
      const r = grid[i];
      if (r < lower || r > upper) continue;
      const npv = PerformanceCalculationService.npvAtRate(cashflows, r);
      if (prevNPV === 0) return [prevR, prevR];
      if (npv === 0) return [r, r];
      if (npv * prevNPV < 0) return [prevR, r];
      prevR = r;
      prevNPV = npv;
    }
    return null;
  }

  // Méthode de bissection robuste sur un intervalle [a,b]
  static bisectionIRR(cashflows: Cashflow[], a: number, b: number, opts?: IRROptions): number {
    const maxIterations = opts?.maxIterations ?? 100;
    const tolerance = opts?.tolerance ?? 1e-7;

    let fa = PerformanceCalculationService.npvAtRate(cashflows, a);
    let fb = PerformanceCalculationService.npvAtRate(cashflows, b);
    if (fa === 0) return a;
    if (fb === 0) return b;

    if (fa * fb > 0) {
      // Pas de changement de signe: retourne 0 par prudence
      return 0;
    }

    let left = a;
    let right = b;
    for (let i = 0; i < maxIterations; i++) {
      const mid = (left + right) / 2;
      const fmid = PerformanceCalculationService.npvAtRate(cashflows, mid);

      if (Math.abs(fmid) < tolerance || Math.abs(right - left) < tolerance) {
        return mid;
      }

      if (fa * fmid < 0) {
        right = mid;
        fb = fmid;
      } else {
        left = mid;
        fa = fmid;
      }
    }
    return (left + right) / 2;
  }

  // Newton-Raphson avec fallback bissection
  static irr(cashflows: Cashflow[], opts?: IRROptions): number {
    // Validation: au moins un flux positif et un négatif
    const hasPos = cashflows.some((c) => c.amount > 0);
    const hasNeg = cashflows.some((c) => c.amount < 0);
    if (!hasPos || !hasNeg) return 0;

    const guess = opts?.guess ?? 0.1;
    const maxIterations = opts?.maxIterations ?? 100;
    const tolerance = opts?.tolerance ?? 1e-7;
    const lower = opts?.lowerBound ?? -0.999;
    const upper = opts?.upperBound ?? 10;

    // Newton-Raphson
    let rate = guess;
    for (let i = 0; i < maxIterations; i++) {
      const f = PerformanceCalculationService.npvAtRate(cashflows, rate);
      if (Math.abs(f) < tolerance) return rate;

      const delta = 1e-6;
      const fPlus = PerformanceCalculationService.npvAtRate(cashflows, rate + delta);
      const fMinus = PerformanceCalculationService.npvAtRate(cashflows, rate - delta);
      const derivative = (fPlus - fMinus) / (2 * delta);

      // Si dérivée trop petite ou divergence: fallback bissection
      if (Math.abs(derivative) < 1e-12 || !isFinite(derivative)) break;

      const next = rate - f / derivative;

      if (!isFinite(next) || next <= lower || next >= upper) break;
      rate = next;
    }

    // Fallback: bissection sur un bracket valide
    const bracket = PerformanceCalculationService.findBracket(cashflows, lower, upper);
    if (bracket) {
      return PerformanceCalculationService.bisectionIRR(cashflows, bracket[0], bracket[1], opts);
    }
    return 0;
  }

  // XIRR: identique à irr() car npvAtRate utilise des dates réelles
  static xirr(cashflows: Cashflow[], opts?: IRROptions): number {
    // S'assure que les cashflows sont triés
    const flows = [...cashflows].sort((a, b) => a.date.getTime() - b.date.getTime());
    return PerformanceCalculationService.irr(flows, opts);
  }

  // TWR total (produit des rendements par périodes de valorisation)
  // Convention utilisée: pour chaque période i,
  //   r_i = (V_end_i - netFlow_i) / V_start_i
  // Le TWR total = Π r_i - 1
  static twr(periods: ValuationPeriod[]): TWRResult {
    if (!periods.length) return { totalReturn: 0 };

    let product = 1;
    let firstDate: Date | undefined;
    let lastDate: Date | undefined;

    periods.forEach((p, idx) => {
      const start = p.startValue;
      const end = p.endValue;
      const flow = p.netFlow ?? 0;

      if (start <= 0) return; // ignorer période invalide

      const r = (end - flow) / start;
      if (r > 0) product *= r;

      if (idx === 0) firstDate = p.startDate;
      if (idx === periods.length - 1) lastDate = p.endDate;
    });

    const totalReturn = product - 1;

    // Annualisation si dates disponibles
    let annualizedReturn: number | undefined;
    if (firstDate && lastDate) {
      const years = PerformanceCalculationService.yearFraction(firstDate, lastDate);
      if (years > 0) {
        annualizedReturn = Math.pow(1 + totalReturn, 1 / years) - 1;
      }
    }

    return { totalReturn, annualizedReturn };
  }

  // MWR: alias IRR/XIRR sur les flux (cashflows positifs/négatifs)
  static mwr(cashflows: Cashflow[], opts?: IRROptions): number {
    return PerformanceCalculationService.xirr(cashflows, opts);
  }

  // Annualisation générique
  static annualize(totalReturn: number, years: number): number {
    if (years <= 0) return totalReturn;
    return Math.pow(1 + totalReturn, 1 / years) - 1;
  }

  // Construit des périodes de valorisation TWR à partir d'une série temporelle:
  // points[i-1] -> points[i] constitue une période:
  //  - startValue = points[i-1].value
  //  - endValue   = points[i].value
  //  - netFlow    = points[i].netFlow (flux survenu pendant la période)
  // Hypothèse: points[i].value représente la valeur à la fin de période AVANT application du flux netFlow (convention cohérente avec r_i = (V_end - flow)/V_start)
  static buildTwrPeriods(points: TimeSeriesPoint[]): ValuationPeriod[] {
    if (!points || points.length < 2) return [];
    const sorted = [...points].sort((a, b) => a.date.getTime() - b.date.getTime());
    const periods: ValuationPeriod[] = [];

    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];

      if (!isFinite(prev.value) || !isFinite(curr.value)) continue;
      if (prev.value <= 0) continue;

      periods.push({
        startDate: prev.date,
        endDate: curr.date,
        startValue: prev.value,
        endValue: curr.value,
        netFlow: curr.netFlow ?? 0
      });
    }

    return periods;
  }
}

// Notes d'intégration UI:
// - ReturnCalculator.tsx peut construire les cashflows (startBalance: flux négatif au départ,
//   contributions: dépôts négatifs / retraits positifs, endBalance: flux positif à la fin)
//   et appeler mwr(cashflows) pour IRR/XIRR.
// - Pour TWR, découper la série en périodes [V_start, V_end, netFlow] à chaque flux.
// - Les fonctions renvoient des décimaux (0.12 = 12 %); le formatage “ %” (espace insécable) est géré par l'UI.
