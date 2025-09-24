import type {
  IRetirementDomain,
  ITaxEngine,
  ITaxPolicy,
  IProjectionEngine,
  IRobustnessService,
  ITaxOptimizationService,
  IGovernmentBenefitService,
  IRetirementCalculationService,
  IProfessionalReportService
} from './index';

// Importer les impl existantes (façade, sans modifier la logique)
import * as TaxPolicy2025 from '@/services/tax/TaxPolicy2025';
import * as TaxPDF from '@/services/tax/TaxOptimizationPDFService';
import * as Robustness from '@/services/tax/RobustnessService';
import * as Projection from '@/services/tax/ProjectionEngine';
import * as TaxEngineMod from '@/services/tax/TaxEngine';
import GreedyBaselineOptimizer from '@/services/tax/optimizers/GreedyBaselineOptimizer';

import TaxOptimizationService from '@/services/TaxOptimizationService';
import { PDFExportService } from '@/services/PDFExportService';

// NOTE: Ces imports "gouvernementaux" sont optionnels pour l&#39;instant; le ResultsWizardStep/TaxOptimizationLab n&#39;en a pas besoin.
// Gardés pour complétude de l&#39;adapter, mais en "any" si absents.
let Government: Partial<IGovernmentBenefitService> = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const SRGService = require('@/services/SRGService').default;
  Government.analyzeGIS = (input: any) => (SRGService as any)?.calculateSRGAnalysis?.(input);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RREGOPService = require('@/services/RREGOPService').default;
  Government.analyzeRRQ = (input: any) => (RREGOPService as any)?.analyzeRRQ?.(input);
} catch { /* no-op */ }

/**
 * Impl ITaxEngine via modules existants.
 * On s&#39;aligne au mieux sur le contrat, sans changer les calculs.
 */
const taxEngine: ITaxEngine = {
  computeAnnualTax(input: any) {
    // ProjectionEngine/Optimizers utilisent computeTaxYear()
    try {
      const out: any = (TaxEngineMod as any).computeTaxYear?.(input);
      if (out && typeof out === 'object') {
        return {
          totalTax: out.totalTax ?? out.total ?? 0,
          breakdown: out.breakdown ?? {}
        };
      }
      return { totalTax: Number(out) || 0, breakdown: {} };
    } catch {
      return { totalTax: 0, breakdown: {} };
    }
  },
  projectMultiYear(input: any) {
    // Façade minimale: délègue à ProjectionEngine.simulateYears si disponible
    try {
      const res: any = (Projection as any).simulateYears?.(input);
      const years: number[] = Array.isArray(res?.timeline)
        ? res.timeline.map((x: any) => x?.year ?? 0)
        : [];
      const totals: number[] = Array.isArray(res?.timeline)
        ? res.timeline.map((x: any) => x?.totalTax ?? 0)
        : [];
      return { years, totals, details: res };
    } catch {
      return { years: [], totals: [], details: null };
    }
  }
};

const taxPolicy: ITaxPolicy = {
  getBrackets(province: string, year: number) {
    try {
      return (TaxPolicy2025 as any).getBrackets?.(province, year) ?? {};
    } catch { return {}; }
  },
  getCredits(year: number) {
    try {
      return (TaxPolicy2025 as any).getCredits?.(year) ?? {};
    } catch { return {}; }
  }
};

const projection: IProjectionEngine = {
  runProjection(params: any) {
    try {
      const out: any = (Projection as any).simulateYears?.(params);
      return { timeline: out?.timeline ?? [], aggregates: out?.aggregates ?? {} };
    } catch {
      return { timeline: [], aggregates: {} };
    }
  }
};

const robustness: IRobustnessService = {
  evaluateShocks(plan: any, options?: { inflationHigh?: boolean; longevityPlus?: boolean; sequenceShock?: boolean }) {
    try {
      const out: any = (Robustness as any).evaluateShocks?.(plan, options);
      return {
        score: out?.score ?? 0,
        explanations: out?.explanations ?? [],
        metrics: out?.metrics ?? {}
      };
    } catch {
      return { score: 0, explanations: [], metrics: {} };
    }
  }
};

// Façade "optimizer": non utilisée par les pages refactorées, fournie pour complétude.
const optimizer: ITaxOptimizationService = {
  optimize(input: any, _strategy?: 'DP_BEAM' | 'GREEDY' | 'RRSP_ONLY') {
    // Pas de changement de logique: fournir un résultat neutre si jamais appelé.
    return {
      policy: null,
      schedule: [],
      totalTax: 0,
      notes: ['Adapter.optimize: non-implémenté (UI n&#39;utilise pas cette API pour l&#39;instant)']
    };
  }
};

// Services RRQ/CPP/SV/SRG (contrat optionnel)
const benefits: IGovernmentBenefitService = {
  analyzeRRQ: Government.analyzeRRQ || ((_: any) => ({} as any)),
  analyzeCPP: Government.analyzeCPP || ((_: any) => ({} as any)),
  analyzeOAS: Government.analyzeOAS || ((_: any) => ({} as any)),
  analyzeGIS: Government.analyzeGIS || ((_: any) => ({} as any))
};

// Calcul global (placeholder neutre)
const calculator: IRetirementCalculationService = {
  calculateAll(userData: any) {
    return {
      // Remplissage neutre pour éviter tout couplage fort ici
      monthlyIncome: userData?.cashflow?.monthlyIncome ?? 0,
      monthlyExpenses: userData?.cashflow?.monthlyExpenses ?? 0
    };
  }
};

const reports: IProfessionalReportService = {
  async generateSummaryPDF(data: any): Promise<Blob> {
    // Délègue au service existant (résumé rapide)
    return PDFExportService.generateQuickSummary(data || {}, 85, 'fr');
  },
  async generatePlannerPDF(data: any): Promise<Blob> {
    return PDFExportService.generatePlannerReport?.('fr', data) as Promise<Blob>;
  },
  async generateNotaryPDF(data: any): Promise<Blob> {
    return PDFExportService.generateNotaryReport?.('fr', data) as Promise<Blob>;
  }
};

/**
 * Adapter (contrat domaine) — agrège les services existants.
 * Aucun changement des calculs; uniquement une façade.
 */
export const RetirementDomainAdapter: IRetirementDomain = {
  taxEngine,
  taxPolicy,
  projection,
  robustness,
  optimizer,
  benefits,
  calculator,
  reports
};

/**
 * Helpers adaptés pour la couche UI — expose EXACTEMENT ce que les pages consommaient
 * avant (préserve le comportement).
 */
export const RetirementHelpers = {
  // UI wrappers (préservent les signatures existantes côté UI)
  suggestWithdrawalOrder(userData: any, options?: Parameters<typeof TaxOptimizationService.suggestWithdrawalOrder>[1]) {
    return TaxOptimizationService.suggestWithdrawalOrder(userData, options as any);
  },
  buildMonthlySchedule(
    scenarioId: string,
    monthlyNetNeed: number,
    order: ReturnType<typeof TaxOptimizationService.suggestWithdrawalOrder>
  ) {
    return TaxOptimizationService.buildMonthlySchedule(scenarioId, monthlyNetNeed, order as any);
  },
  async generateTaxOptimizationSummary(payload: any) {
    return (TaxPDF as any).TaxOptimizationPDFService?.generateSummary?.(payload);
  },

  // Lab/optimizers + projection + tax + robustesse
  greedyOptimize(params: any) {
    return (GreedyBaselineOptimizer as any).optimize(params);
  },
  simulateYears(opening: any, assumptions: any, decisions: any, horizonYears: number) {
    return (Projection as any).simulateYears(opening, assumptions, decisions, horizonYears);
  },
  computeTaxYear(input: any) {
    return (TaxEngineMod as any).computeTaxYear(input);
  },
  evaluateRobustness(plan: any, language: 'fr' | 'en') {
    return (Robustness as any).evaluateRobustness?.(plan, language);
  }
};
