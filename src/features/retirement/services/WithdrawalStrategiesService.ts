/**
 * WithdrawalStrategiesService
 * Évalue différentes stratégies de décaissement: FourPercent, VPW, Guardrails, Bucket
 * Basé sur des approximations prudentes et des paramètres disponibles dans userData/calculations.
 */
import { CalculationService } from './CalculationService';
import type { UserData } from '../types';

export type StrategyKey = 'FourPercent' | 'VPW' | 'Guardrails' | 'Bucket';

export interface StrategyEvaluationInput {
  userData: UserData;
  // capitalRetraite, revenus garantis, etc., si déjà calculés (sinon on calcule en interne)
  calculations?: any;
  retirementAge?: number; // âge de début, sinon déduit
}

export interface StrategyEvaluationResult {
  strategy: StrategyKey;
  sustainableSpendingAnnual: number; // $/an
  sustainableSpendingMonthly: number; // $/mois
  assumptions: string[];
  notes: string[];
  riskScore: number; // 0..100 (risque perçu: plus haut = plus risqué)
}

export class WithdrawalStrategiesService {
  static async evaluateAll(input: StrategyEvaluationInput): Promise<StrategyEvaluationResult[]> {
    const calcs = input.calculations || (await CalculationService.calculateAll(input.userData));
    const results: StrategyEvaluationResult[] = [];

    results.push(this.evaluateFourPercent(input, calcs));
    results.push(this.evaluateVPW(input, calcs));
    results.push(this.evaluateGuardrails(input, calcs));
    results.push(this.evaluateBucket(input, calcs));

    return results;
  }

  static evaluateFourPercent(input: StrategyEvaluationInput, calcs: any): StrategyEvaluationResult {
    const capital = calcs.retirementCapital || 0;
    const annual = Math.max(0, capital * 0.04);
    return {
      strategy: 'FourPercent',
      sustainableSpendingAnnual: annual,
      sustainableSpendingMonthly: Math.round(annual / 12),
      assumptions: [
        'Taux de retrait fixe 4% (règle classique)',
        'Portefeuille bien diversifié (~60/40)',
      ],
      notes: [
        'Simple à appliquer',
        'Peut être conservateur si fortes rentes viagères (RRQ/SV)',
      ],
      riskScore: 55
    };
  }

  static evaluateVPW(input: StrategyEvaluationInput, calcs: any): StrategyEvaluationResult {
    const capital = calcs.retirementCapital || 0;
    const age = this.getRetirementAge(input);
    // Table VPW très simplifiée: pour un portefeuille équilibré, % augmente avec l'âge
    const vpwPct = this.estimateVPWPercent(age);

    const annual = Math.max(0, capital * vpwPct);
    return {
      strategy: 'VPW',
      sustainableSpendingAnnual: annual,
      sustainableSpendingMonthly: Math.round(annual / 12),
      assumptions: [
        `Pour ${age} ans, pourcentage VPW estimé: ${(vpwPct * 100).toFixed(1)}%`,
        'Ajusté annuellement selon la valeur du portefeuille et l\'âge',
      ],
      notes: [
        'Suit mieux la réalité du capital (varie chaque année)',
        'Peut baisser après mauvaise performance (discipline nécessaire)',
      ],
      riskScore: 50
    };
  }

  static evaluateGuardrails(input: StrategyEvaluationInput, calcs: any): StrategyEvaluationResult {
    const capital = calcs.retirementCapital || 0;
    // Baseline 4% avec "rails": +/-10% ajustement si écart significatif
    const baseline = capital * 0.04;
    // Sans historique complet, on reste au baseline
    const annual = Math.max(0, baseline);

    return {
      strategy: 'Guardrails',
      sustainableSpendingAnnual: annual,
      sustainableSpendingMonthly: Math.round(annual / 12),
      assumptions: [
        'Baseline 4% avec ajustements si le ratio portefeuille/valeur initiale dévie',
        'Réduction/augmentation annuelle typique: 10% (plancher/plafond)',
      ],
      notes: [
        'Réduit le risque d\'épuisement par ajustements progressifs',
        'Nécessite un suivi annuel discipliné',
      ],
      riskScore: 45
    };
  }

  static evaluateBucket(input: StrategyEvaluationInput, calcs: any): StrategyEvaluationResult {
    const capital = calcs.retirementCapital || 0;
    // Constituer 3 ans de dépenses essentielles en cash (approche pédago)
    const monthlyExpenses = calcs.monthlyExpenses || CalculationService.calculateMonthlyExpenses(input.userData);
    const essentials = monthlyExpenses * 0.6; // approximation "essentielles"
    const cashBucket = essentials * 12 * 3; // 3 ans
    const investable = Math.max(0, capital - cashBucket);
    const annualFromInvestable = investable * 0.04;
    // Complément possible via bucket si besoin (mais on reste prudent)
    const annual = Math.max(0, annualFromInvestable);

    return {
      strategy: 'Bucket',
      sustainableSpendingAnnual: annual,
      sustainableSpendingMonthly: Math.round(annual / 12),
      assumptions: [
        'Coussin 3 ans de dépenses essentielles en liquidités',
        'Le reste investi produit ~4% de retrait',
      ],
      notes: [
        'Réduit le risque de vendre en baisse (séquence des rendements)',
        'Soutenabilité dépend de la taille du coussin et de la discipline de reconstitution',
      ],
      riskScore: 40
    };
  }

  private static estimateVPWPercent(age: number): number {
    // Barème VPW simplifié basé sur des tables publiques (approximations)
    if (age <= 60) return 0.035;
    if (age <= 65) return 0.040;
    if (age <= 70) return 0.045;
    if (age <= 75) return 0.050;
    if (age <= 80) return 0.055;
    if (age <= 85) return 0.060;
    return 0.065;
    // NB: les vraies tables VPW sont plus fines (selon rendement attendu et inflation)
  }

  private static getRetirementAge(input: StrategyEvaluationInput): number {
    const birth = input.userData?.personal?.naissance1;
    const desired = input.retirementAge || input.userData?.personal?.ageRetraiteSouhaite1 || 65;
    if (!birth) return desired;
    try {
      const birthDate = new Date(birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      return Math.max(age, desired);
    } catch {
      return desired;
    }
  }
}
