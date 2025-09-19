// src/services/TaxOptimizationService.ts
// Heuristiques locales (sans API) pour l'ordre de retraits et un horaire simple
// Phase 3 — Implémentation initiale sécurisée pour seniors + OQLF
//
// NOTE IMPORTANTE:
// - Tous les calculs sont des approximations pédagogiques (aucun conseil).
// - Aucune transmission réseau. Données locales uniquement.
// - Les fonctions sont conçues pour ne pas casser la build si des données manquent.

export type WithdrawalSource =
  | 'CELI'
  | 'NON_ENREGISTRE'
  | 'REER'
  | 'RRIF'
  | 'CRI'
  | 'LIF'
  | 'PENSION';

export interface WithdrawalScheduleEntry {
  dateISO: string;
  source: WithdrawalSource;
  gross: number;
  net?: number;
  notes?: string;
}

export interface WithdrawalSchedule {
  scenarioId: string;
  period: 'monthly' | 'annual';
  entries: WithdrawalScheduleEntry[];
}

export interface SuggestOrderOptions {
  preferTFSALast?: boolean; // défaut: true
  preferNonRegFirst?: boolean; // défaut: true
  pre71RrspPriority?: boolean; // défaut: true
}

export class TaxOptimizationService {
  /**
   * Suggère un ordre de retraits simple et robuste.
   * Heuristiques par défaut:
   *  - NON_ENREGISTRE d'abord
   *  - REER ensuite (avant 71 ans) si applicable
   *  - CELI en dernier
   * Les sources RRIF/CRI/LIF/PENSION sont conservées si déjà présentes mais en fin d'ordre.
   */
  static suggestWithdrawalOrder(userData: any, options?: SuggestOrderOptions): WithdrawalSource[] {
    const preferTFSALast = options?.preferTFSALast ?? true;
    const preferNonRegFirst = options?.preferNonRegFirst ?? true;
    const pre71RrspPriority = options?.pre71RrspPriority ?? true;

    const order: WithdrawalSource[] = [];

    if (preferNonRegFirst) order.push('NON_ENREGISTRE');
    if (pre71RrspPriority) order.push('REER');
    if (preferTFSALast) order.push('CELI');

    // Ajouter sources additionnelles si présentes dans les données (ordre après les 3 majeures)
    const additional: WithdrawalSource[] = [];
    if (TaxOptimizationService.hasAny(userData, ['rrif', 'ferr'])) additional.push('RRIF');
    if (TaxOptimizationService.hasAny(userData, ['cri'])) additional.push('CRI');
    if (TaxOptimizationService.hasAny(userData, ['lif'])) additional.push('LIF');
    if (TaxOptimizationService.hasAny(userData, ['pension', 'rente', 'pensions'])) additional.push('PENSION');

    // Filtrer doublons tout en gardant la priorité
    const seen = new Set<WithdrawalSource>();
    const result: WithdrawalSource[] = [];
    [...order, ...additional].forEach((s) => {
      if (!seen.has(s)) {
        seen.add(s);
        result.push(s);
      }
    });

    // Fallback conservateur si vide
    return result.length > 0 ? result : ['NON_ENREGISTRE', 'REER', 'CELI'];
  }

  /**
   * Construit un horaire mensuel simple pour les 12 prochains mois.
   * - Répartit la "besoin net mensuel" selon l'ordre de retraits proposé.
   * - Les montants sont bruts (=nets) par défaut (approximation).
   * - Écrit des notes pédagogiques pour expliquer la logique (FR).
   */
  static buildMonthlySchedule(
    scenarioId: string,
    monthlyNetNeed: number,
    order: WithdrawalSource[]
  ): WithdrawalSchedule {
    const entries: WithdrawalScheduleEntry[] = [];
    const need = Math.max(0, Number(monthlyNetNeed) || 0);
    if (need === 0 || order.length === 0) {
      return { scenarioId, period: 'monthly', entries };
    }

    // Répartition naïve: 100% sur la première source; si indisponible, 50/50 sur 2 premières, sinon 1/3 sur 3
    const allocation = TaxOptimizationService.computeSimpleAllocation(order);

    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const dateISO = d.toISOString().split('T')[0];

      allocation.forEach(({ source, weight }) => {
        const gross = +(need * weight).toFixed(2);
        if (gross > 0) {
          entries.push({
            dateISO,
            source,
            gross,
            net: gross,
            notes: TaxOptimizationService.noteForSource(source),
          });
        }
      });
    }

    return { scenarioId, period: 'monthly', entries };
  }

  // ----------------------
  // Helpers internes
  // ----------------------

  private static computeSimpleAllocation(order: WithdrawalSource[]): Array<{ source: WithdrawalSource; weight: number }> {
    const unique = Array.from(new Set(order));
    if (unique.length === 1) return [{ source: unique[0], weight: 1 }];
    if (unique.length === 2) return unique.map((s) => ({ source: s, weight: 0.5 }));
    // 3 et plus → 3 premières sources 1/3 chacune
    return unique.slice(0, 3).map((s) => ({ source: s, weight: 1 / 3 }));
  }

  private static noteForSource(source: WithdrawalSource): string {
    switch (source) {
      case 'NON_ENREGISTRE':
        return "Prioriser le non-enregistré peut réduire l'impôt futur sur les placements.";
      case 'REER':
        return "Utiliser le REER avant 71 ans peut réduire les retraits minimums futurs du FERR.";
      case 'CELI':
        return "Le CELI est souvent préservé en dernier pour sa croissance à l'abri de l'impôt.";
      case 'RRIF':
        return "Respectez les retraits minimums du FERR; ajustez au besoin.";
      case 'CRI':
      case 'LIF':
        return "Tenez compte des contraintes CRI/LIF; vérifiez les limites applicables.";
      case 'PENSION':
        return "Les rentes privées suivent des modalités fixes; ajustez votre budget en conséquence.";
      default:
        return 'Estimation pédagogique (non contraignante).';
    }
  }

  private static hasAny(userData: any, keys: string[]): boolean {
    try {
      const lc = JSON.stringify(userData || {}).toLowerCase();
      return keys.some((k) => lc.includes(k.toLowerCase()));
    } catch {
      return false;
    }
  }
}

export default TaxOptimizationService;
