// src/features/retirement/services/SecureCalculationService.ts
import { UserData, Calculations } from '../types';
import { securityLogger, SecurityEventType, SecuritySeverity } from '../../../lib/securityLogger';

export class SecureCalculationService {
  private static readonly API_ENDPOINT = '/.netlify/functions/retirement-calculator';
  private static readonly MAX_RETRIES = 3;
  private static readonly TIMEOUT = 10000; // 10 secondes

  /**
   * Effectue les calculs de retraite via l'API sécurisée
   */
  static async calculateAll(userData: UserData): Promise<Calculations> {
    try {
      // Log de la demande
      securityLogger.logEvent({
        type: SecurityEventType.CALCULATION_REQUEST,
        severity: SecuritySeverity.LOW,
        source: 'SecureCalculationService',
        details: {
          message: 'Demande de calcul sécurisé',
          userId: userData.personal?.prenom1 || 'anonyme'
        }
      });

      const response = await this.makeSecureRequest(userData);
      
      if (!response.success) {
        throw new Error(response.message || 'Erreur lors du calcul');
      }

      // Log du succès
      securityLogger.logEvent({
        type: SecurityEventType.CALCULATION_SUCCESS,
        severity: SecuritySeverity.LOW,
        source: 'SecureCalculationService',
        details: {
          message: 'Calcul sécurisé réussi',
          userId: userData.personal?.prenom1 || 'anonyme'
        }
      });

      return {
        netWorth: response.data.netWorth,
        retirementCapital: response.data.retirementCapital,
        sufficiency: response.data.sufficiency,
        taxSavings: 0, // Calculé côté serveur si nécessaire
        monthlyIncome: response.data.monthlyIncome,
        monthlyExpenses: response.data.monthlyExpenses,
        rrqOptimization: response.data.rrqOptimization
      };

    } catch (error) {
      console.error('Erreur dans SecureCalculationService:', error);
      
      // Log de l'erreur
      securityLogger.logEvent({
        type: SecurityEventType.CALCULATION_ERROR,
        severity: SecuritySeverity.MEDIUM,
        source: 'SecureCalculationService',
        details: {
          message: 'Erreur lors du calcul sécurisé',
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
      });

      // Retourner des valeurs par défaut en cas d'erreur
      return this.getFallbackCalculations(userData);
    }
  }

  /**
   * Effectue une requête sécurisée avec retry et timeout
   */
  private static async makeSecureRequest(userData: UserData, retryCount = 0): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(userData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      clearTimeout(timeoutId);
      
      // Retry logic
      if (retryCount < this.MAX_RETRIES && this.isRetryableError(error)) {
        console.warn(`Tentative ${retryCount + 1} échouée, nouvelle tentative...`);
        await this.delay(1000 * (retryCount + 1)); // Exponential backoff
        return this.makeSecureRequest(userData, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * Détermine si une erreur est récupérable
   */
  private static isRetryableError(error: any): boolean {
    if (error.name === 'AbortError') return true;
    if (error.message?.includes('network')) return true;
    if (error.message?.includes('timeout')) return true;
    return false;
  }

  /**
   * Délai pour le retry
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Calculs de fallback en cas d'erreur API
   */
  private static getFallbackCalculations(userData: UserData): Calculations {
    console.warn('Utilisation des calculs de fallback');
    
    // Calculs simplifiés côté client en cas d'urgence
    const netWorth = this.calculateSimpleNetWorth(userData);
    const monthlyIncome = (userData.personal.salaire1 || 0) + (userData.personal.salaire2 || 0);
    const monthlyExpenses = this.calculateSimpleMonthlyExpenses(userData);

    return {
      netWorth,
      retirementCapital: netWorth * 1.5, // Estimation simple
      sufficiency: 50, // Valeur par défaut
      taxSavings: 0,
      monthlyIncome,
      monthlyExpenses,
      rrqOptimization: undefined
    };
  }

  /**
   * Calcul simple de valeur nette (fallback)
   */
  private static calculateSimpleNetWorth(userData: UserData): number {
    const { savings } = userData;
    if (!savings) return 0;

    return (
      (savings.reer1 || 0) + (savings.reer2 || 0) +
      (savings.celi1 || 0) + (savings.celi2 || 0) +
      (savings.placements1 || 0) + (savings.placements2 || 0) +
      (savings.epargne1 || 0) + (savings.epargne2 || 0) +
      (savings.cri1 || 0) + (savings.cri2 || 0) +
      Math.max(0, (savings.residenceValeur || 0) - (savings.residenceHypotheque || 0))
    );
  }

  /**
   * Calcul simple des dépenses mensuelles (fallback)
   */
  private static calculateSimpleMonthlyExpenses(userData: UserData): number {
    const { expenses } = userData;
    if (!expenses) return 0;

    return Object.values(expenses).reduce((sum: number, expense: any) => sum + (expense || 0), 0);
  }

  /**
   * Vérifie si l'API est disponible
   */
  static async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
