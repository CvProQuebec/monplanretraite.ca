/**
 * Types pour le module MVP "Hypothèses de Calcul"
 * Version simplifiée pour clientèle 55-90 ans
 * 
 * @version 2025.1.0
 * @date 2025-01-09
 */

export interface SimpleAssumptions {
  /** Taux d'inflation annuel (ex: 0.021 = 2,1%) */
  inflation: number;
  
  /** Rendement actions canadiennes (ex: 0.066 = 6,6%) */
  stockReturns: number;
  
  /** Rendement obligations (ex: 0.034 = 3,4%) */
  bondReturns: number;
  
  /** Croissance des salaires (ex: 0.031 = 3,1%) */
  salaryGrowth: number;
  
  /** Source officielle des hypothèses */
  source: string;
  
  /** Date de dernière mise à jour */
  lastUpdated: string;
}

export interface SimpleTooltip {
  /** Titre de l'hypothèse */
  title: string;
  
  /** Description simple (niveau 5e année) */
  description: string;
  
  /** Exemple concret avec chiffres */
  example: string;
  
  /** Icône emoji pour l'affichage */
  icon?: string;
}

export interface AssumptionRowProps {
  /** Libellé de l'hypothèse */
  label: string;
  
  /** Valeur formatée (ex: "2,1 %") */
  value: string;
  
  /** Information tooltip */
  tooltip: SimpleTooltip;
  
  /** Icône emoji */
  icon: string;
}

/**
 * Contextes pour les notifications de transparence
 */
export type TransparencyContext = 
  | 'retirement'      // Projections de retraite
  | 'investment'      // Calculs d'investissement
  | 'budget'          // Planification budgétaire
  | 'general';        // Contexte général

export interface TransparencyNotification {
  /** Contexte d'utilisation */
  context: TransparencyContext;
  
  /** Message à afficher */
  message: string;
  
  /** Lien vers les détails (optionnel) */
  detailsLink?: string;
}
