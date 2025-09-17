/**
 * BudgetLinkService
 * - Gère les liens entre des éléments du module Budget et les sources "Revenus" ou "Dépenses"
 * - Objectif: éviter la double saisie, garder une source de vérité (Revenus/Dépenses) et afficher/planifier dans Budget
 *
 * Stockage recommandé:
 * userData.personal.budgetLinks?: Array<BudgetLink>
 *   - budgetItemId: string (ex: id d'une dépense dans budgetData.expenses)
 *   - sourceType: 'income' | 'expense'
 *   - sourceId: string (id de l'élément dans unifiedIncome1/2 ou dans la liste des dépenses)
 */

export type BudgetSourceType = 'income' | 'expense';

export interface BudgetLink {
  budgetItemId: string;
  sourceType: BudgetSourceType;
  sourceId: string;
}

export class BudgetLinkService {
  /**
   * Récupère la liste des liens à partir de userData
   */
  static getLinks(userData: any): BudgetLink[] {
    return (userData?.personal as any)?.budgetLinks || [];
  }

  /**
   * Récupère le lien pour un item Budget donné (si existe)
   */
  static getLinkedSource(userData: any, budgetItemId: string): BudgetLink | undefined {
    const links = this.getLinks(userData);
    return links.find(l => l.budgetItemId === budgetItemId);
  }

  /**
   * Indique si un item Budget est lié
   */
  static isLinked(userData: any, budgetItemId: string): boolean {
    return !!this.getLinkedSource(userData, budgetItemId);
  }

  /**
   * Crée ou met à jour un lien
   */
  static linkBudgetItem(
    userData: any,
    budgetItemId: string,
    sourceType: BudgetSourceType,
    sourceId: string
  ): BudgetLink[] {
    const links = this.getLinks(userData);
    const idx = links.findIndex(l => l.budgetItemId === budgetItemId);
    const next: BudgetLink = { budgetItemId, sourceType, sourceId };

    if (idx >= 0) {
      links[idx] = next;
      return links;
    }
    return [...links, next];
  }

  /**
   * Supprime un lien
   */
  static unlinkBudgetItem(userData: any, budgetItemId: string): BudgetLink[] {
    const links = this.getLinks(userData);
    return links.filter(l => l.budgetItemId !== budgetItemId);
  }

  /**
   * Utilitaire: applique la liste mise à jour dans userData.personal
   * (à utiliser avec updateUserData('personal', { budgetLinks: updated }))
   */
  static applyLinksToPersonal(personal: any, updated: BudgetLink[]): any {
    return {
      ...personal,
      budgetLinks: updated
    };
  }
}

export default BudgetLinkService;
