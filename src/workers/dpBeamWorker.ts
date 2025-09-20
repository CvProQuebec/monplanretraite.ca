/* eslint-disable no-restricted-globals */
/**
 * Web Worker for DP/Beam Optimizer (v2)
 * Receives DPParams, runs optimization, posts DPResult back to main thread.
 * 100% local; no network calls.
 */

import DPBeamOptimizer, { type DPParams, type DPResult } from '@/services/tax/optimizers/DPBeamOptimizer';

type InMsg =
  | { type: 'RUN'; params: DPParams }
  | { type: 'CANCEL' };

type OutMsg =
  | { type: 'RESULT'; payload: DPResult }
  | { type: 'PROGRESS'; payload: { year: number; bestScore: number; beamCount: number } }
  | { type: 'ERROR'; error: string };

let cancelFlag = false;

self.addEventListener('message', (evt: MessageEvent<InMsg>) => {
  const data = evt.data;
  if (!data) return;

  if (data.type === 'CANCEL') {
    cancelFlag = true;
    return;
  }

  if (data.type === 'RUN') {
    cancelFlag = false;
    try {
      const res = DPBeamOptimizer.optimize(data.params, {
        onProgress: (info) => {
          const out: OutMsg = { type: 'PROGRESS', payload: info };
          // @ts-ignore
          self.postMessage(out);
        },
        isCancelled: () => cancelFlag,
      });
      const out: OutMsg = { type: 'RESULT', payload: res };
      // @ts-ignore
      self.postMessage(out);
    } catch (e: any) {
      const out: OutMsg = { type: 'ERROR', error: e?.message || String(e) };
      // @ts-ignore
      self.postMessage(out);
    }
  }
});
