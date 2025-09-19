/**
 * OptimalWithdrawalOrderService
 * Heuristique pragmatique pour proposer un ordre de retraits fiscal optimal.
 *
 * Principes simples:
 * - Si revenu imposable projeté > seuil de récupération SV (~90 997$): privilégier CELI puis non-enregistré, minimiser REER/FERR
 * - Sinon: optimiser REER/FERR (si taux marginal futur similaire ou inférieur), puis CELI, puis non-enregistré
 * - Après 72 ans: tenir compte des retraits FERR obligatoires
 */
import type { UserData } from '../types';

export class OptimalWithdrawalOrderService {
  // Seuil 2025 (aligné avec services OASGIS)
  private static readonly SV_SEUIL_RECUPERATION_2025 = 90997;

  static suggest(userData: UserData, options?: { age?: number; projectedTaxableIncome?: number }): string[] {
    const age = options?.age ?? this.calculateAge(userData.personal?.naissance1) ?? 65;

    const projected = options?.projectedTaxableIncome ?? this.estimateProjectedTaxableIncome(userData);

    // FERR obligatoire après 72: mettre FERR tôt dans l'ordre
    if (age >= 72) {
      if (projected > this.SV_SEUIL_RECUPERATION_2025) {
        // Rester sous seuil SV autant que possible: FERR (obligatoire), puis CELI, puis non-enregistré/complément
        return ['FERR', 'CELI', 'PLACEMENTS_NON_ENREGISTRES', 'CELI_COMPLEMENT'];
      } else {
        return ['FERR', 'CELI', 'PLACEMENTS_NON_ENREGISTRES'];
      }
    }

    // Avant 72 ans
    if (projected > this.SV_SEUIL_RECUPERATION_2025) {
      // On évite d'augmenter l'imposable: CELI d'abord, puis non-enregistré, minimiser REER
      return ['CELI', 'PLACEMENTS_NON_ENREGISTRES', 'REER_MINIMAL'];
    }

    // Revenu sous le seuil: on peut optimiser REER (selon taux marginal futur)
    return ['REER_OPTIMISE', 'CELI', 'PLACEMENTS_NON_ENREGISTRES'];
  }

  private static estimateProjectedTaxableIncome(userData: UserData): number {
    // Approximations: salaires + pensions privées + RRQ estimé + SV base (si 65+)
    const income = (userData.personal?.salaire1 || 0) + (userData.personal?.salaire2 || 0);
    const pensions = (userData.retirement?.pensionPrivee1 || 0) + (userData.retirement?.pensionPrivee2 || 0);
    const rrq = (userData.retirement?.rrqMontantActuel1 || 0) + (userData.retirement?.rrqMontantActuel2 || 0);
    const age = this.calculateAge(userData.personal?.naissance1);
    const sv = age >= 65 ? 717.15 : 0; // mensuel de base 2025
    const total = income + pensions + (rrq * 12) + (sv * 12);
    return total;
  }

  private static calculateAge(birthDate?: string): number {
    if (!birthDate) return 65;
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return Math.max(0, age);
    } catch {
      return 65;
    }
  }
}
