/**
 * mcWorker.ts
 * Monte Carlo simulation (100% local) for retirement portfolio robustness.
 * Inputs are simplified; goal is to produce useful preview metrics quickly:
 *  - successProb: proportion of paths that never deplete wealth
 *  - p5/p50/p95: percentiles of final wealth
 *  - maxDrawdown: average max drawdown across paths (approx)
 *
 * Assumptions:
 *  - We aggregate all accounts into a single wealth number for simulation
 *  - Annual net withdrawal = targetNetAnnual (constant, in today's dollars)
 *  - Gross returns sampled from Normal(mu, sigma) on the aggregated wealth
 *  - Inflation passthrough is ignored at this stage (UI-level only)
 *
 * Messages:
 *  - { type: 'PROGRESS', payload: { iter, total, progress } }
 *  - { type: 'RESULT', payload: { successProb, p5, p50, p95, maxDrawdown, iterations, horizonYears } }
 *  - { type: 'ERROR', error: string }
 */

export interface MCParams {
  opening: {
    tfsa: number;
    nonRegistered: number;
    rrsp: number;
    rrif?: number;
    cppAnnual?: number;
    oasAnnual?: number;
  };
  assumptions: {
    grossReturnTFSA?: number;     // we use aggregated mu/sigma derived from these if present
    grossReturnNonReg?: number;
    grossReturnRRSP?: number;
    grossReturnRRIF?: number;
  };
  horizonYears: number;
  targetNetAnnual: number;
  iterations?: number;            // default 1000
  mu?: number;                    // optional override mean return (e.g., 0.04)
  sigma?: number;                 // optional override volatility (e.g., 0.10)
}

let cancelled = false;

function randn(): number {
  // Box-Muller
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor((p / 100) * sorted.length)));
  return sorted[idx];
}

function runMonteCarlo(p: MCParams) {
  const iters = Math.max(100, Math.min(50000, Math.floor(p.iterations ?? 1000)));
  const years = Math.max(1, Math.min(60, Math.floor(p.horizonYears)));
  const opening =
    (p.opening?.tfsa || 0) +
    (p.opening?.nonRegistered || 0) +
    (p.opening?.rrsp || 0) +
    (p.opening?.rrif || 0);

  // Aggregate simple mean and volatility
  const mu =
    typeof p.mu === 'number'
      ? p.mu
      : ((((p.assumptions?.grossReturnTFSA ?? 0.04) +
           (p.assumptions?.grossReturnNonReg ?? 0.04) +
           (p.assumptions?.grossReturnRRSP ?? 0.04) +
           (p.assumptions?.grossReturnRRIF ?? 0.04)) / 4) || 0.04);
  const sigma =
    typeof p.sigma === 'number'
      ? p.sigma
      : 0.10; // 10% stdev default for preview

  const netW = Math.max(0, p.targetNetAnnual || 0);

  let successCount = 0;
  const finalWealths: number[] = [];
  const maxDrawdowns: number[] = [];

  cancelled = false;

  for (let i = 0; i < iters; i++) {
    if (cancelled) break;

    let wealth = opening;
    let peak = opening;
    let maxDD = 0;
    let depleted = false;

    for (let y = 0; y < years; y++) {
      // Apply return
      const r = mu + sigma * randn();
      wealth = wealth * (1 + r);

      // Withdraw net target
      wealth -= netW;

      // Track peak and drawdown
      if (wealth > peak) peak = wealth;
      const dd = peak > 0 ? Math.max(0, (peak - wealth) / peak) : 0;
      if (dd > maxDD) maxDD = dd;

      if (wealth <= 0) {
        depleted = true;
        wealth = 0;
        // continue to finish path without further negative wealth
      }
    }

    if (!depleted) successCount++;
    finalWealths.push(wealth);
    maxDrawdowns.push(maxDD);
    // Progress updates ~ every 5%
    if (i % Math.max(1, Math.floor(iters / 20)) === 0) {
      (postMessage as any)({
        type: 'PROGRESS',
        payload: { iter: i + 1, total: iters, progress: (i + 1) / iters }
      });
    }
  }

  finalWealths.sort((a, b) => a - b);
  const successProb = successCount / iters;
  const p5 = percentile(finalWealths, 5);
  const p50 = percentile(finalWealths, 50);
  const p95 = percentile(finalWealths, 95);
  const avgDD =
    maxDrawdowns.reduce((s, x) => s + x, 0) / Math.max(1, maxDrawdowns.length);

  (postMessage as any)({
    type: 'RESULT',
    payload: {
      successProb,
      p5: Math.round(p5),
      p50: Math.round(p50),
      p95: Math.round(p95),
      maxDrawdown: Math.round(avgDD * opening), // convert ratio to CAD vs initial opening
      iterations: iters,
      horizonYears: years
    }
  });
}

self.onmessage = (evt: MessageEvent) => {
  const msg = evt.data || {};
  if (msg.type === 'RUN') {
    try {
      cancelled = false;
      runMonteCarlo(msg.params as MCParams);
    } catch (e: any) {
      (postMessage as any)({
        type: 'ERROR',
        error: String(e?.message || e || 'Unknown MC error')
      });
    }
    return;
  }
  if (msg.type === 'CANCEL') {
    cancelled = true;
    return;
  }
};
