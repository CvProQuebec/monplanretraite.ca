/**
 * PredictiveAnalyticsService — "Analyses prédictives IA" (100% local, sans API externe)
 *
 * Objectif:
 * - Fournir des analyses prédictives simples et robustes basées sur des signaux clés
 *   (taux d’épargne, coussin de liquidités, alignement actions vs bande recommandée, variabilité des dépenses)
 * - Prévoir le flux de trésorerie sur 12 mois (EWMA + saisonnalité simple)
 * - Donner une probabilité de succès "proxy" (logistique) et des recommandations
 *
 * NOTE: Ce n'est pas un modèle ML entraîné à partir de données externes.
 *       Il s'agit d'un score prédictif local inspiré d'approches ML (features + logistic), calibré avec des heuristiques.
 */

import { UserData } from '@/features/retirement/types';
import { recommendAllocation, recommendedEquityBand } from './PortfolioOptimizationService';

export type PredictiveRiskLevel = 'low' | 'medium' | 'high';

export interface PredictiveSummary {
  savingsRate: number;               // 0..1
  monthlyCashflow: number;           // CAD (revenus - dépenses)
  cashCushionMonths: number;         // mois estimés
  equityMisalignment: number;        // |currentEq - targetEqMid| en points décimaux (0..1)
  expenseVolatilityProxy: number;    // 0..1 (proxy simple)
}

export interface CashflowForecastPoint {
  monthIndex: number; // 1..12
  expected: number;   // CAD
  lower: number;      // CAD (IC simple)
  upper: number;      // CAD (IC simple)
}

export interface PredictiveReport {
  summary: PredictiveSummary;
  successProbability: number;        // 0..1 (proxy)
  riskLevel: PredictiveRiskLevel;
  recommendations: string[];
  forecast12m: CashflowForecastPoint[];
}

function toNumber(x: any): number {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function safeSum(values: number[]): number {
  return values.reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0);
}

function deriveAge(userData: UserData): number | undefined {
  const b = (userData as any)?.personal?.naissance1;
  if (!b) return;
  const d = new Date(b);
  if (Number.isNaN(d.getTime())) return;
  return new Date().getFullYear() - d.getFullYear();
}

function computeNetMonthlyIncome(userData: UserData): number {
  const p: any = (userData as any).personal || {};
  const explicit = toNumber(p.netMensuel);
  if (explicit > 0) return explicit;

  const yearly = toNumber(p.salaire1) + toNumber(p.salaire2);
  return yearly / 12;
}

function computeMonthlyExpenses(userData: UserData): number {
  const cf: any = (userData as any).cashflow || {};
  const keys = [
    'logement','servicesPublics','assurances','telecom',
    'alimentation','transport','sante','loisirs','depensesSaisonnieres'
  ];
  return safeSum(keys.map(k => toNumber(cf[k])));
}

function estimatePortfolioValue(userData: UserData): number {
  const s: any = (userData as any).savings || {};
  const keys = ['reer1','reer2','celi1','celi2','placements1','placements2','epargne1','epargne2','cri1','cri2'];
  return safeSum(keys.map(k => toNumber(s[k])));
}

// Estimation d’un coussin de liquidités (en mois) à partir de la cible d’allocation et du portefeuille
function estimateCashCushionMonths(userData: UserData, portfolioValue: number, monthlyEssential: number, age?: number): number {
  const rec = recommendAllocation(age ?? 70, monthlyEssential, portfolioValue);
  if (monthlyEssential <= 0) return 0;
  const cash = Math.max(0, rec.targetAllocation.cash * portfolioValue);
  return Math.floor(cash / monthlyEssential);
}

// Proxy simple de volatilité des dépenses: ratio des dépenses "discrétionnaires + saisonnières" / total
function expenseVolatilityProxy(userData: UserData): number {
  const cf: any = (userData as any).cashflow || {};
  const total = computeMonthlyExpenses(userData);
  if (total <= 0) return 0;
  const disc = toNumber(cf.loisirs) + toNumber(cf.depensesSaisonnieres) + toNumber(cf.telecom);
  const ratio = disc / total;
  return Math.max(0, Math.min(1, ratio)); // 0..1
}

/**
 * Score de probabilité de succès (proxy) via une forme logistique:
 * features:
 *  - savingsRate (plus c’est élevé, meilleur)
 *  - cashCushionMonths (>=12 mo) améliore
 *  - equityMisalignment (plus c’est grand, pire)
 *  - expenseVolatilityProxy (plus c’est grand, pire)
 */
function logistic(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

function computeSuccessProbability(summary: PredictiveSummary): number {
  // Features
  const sr = summary.savingsRate; // 0..1
  const c  = Math.min(24, Math.max(0, summary.cashCushionMonths));
  const em = Math.min(1, Math.max(0, summary.equityMisalignment));
  const ev = Math.min(1, Math.max(0, summary.expenseVolatilityProxy));

  // Pondérations heuristiques (calibrées localement)
  // Base logit à -0.5 pour "neutre". On booste par savings et coussin, on pénalise misalignment et volatilité.
  const z = -0.5 + (2.2 * sr) + (0.06 * c) - (1.4 * em) - (0.8 * ev);

  return logistic(z); // 0..1
}

function classifyRisk(p: number): PredictiveRiskLevel {
  if (p >= 0.8) return 'low';
  if (p >= 0.55) return 'medium';
  return 'high';
}

/**
 * Forecast 12 mois du cashflow mensuel:
 * - base = (revenus - dépenses)
 * - EWMA: légère inertie
 * - saisonnalité simple: si depensesSaisonnieres > 0, on ajoute un delta modeste sur 3-4 mois (p.ex., hiver/été)
 */
function forecast12m(userData: UserData, baseMonthly: number): CashflowForecastPoint[] {
  const cf: any = (userData as any).cashflow || {};
  const seasonal = toNumber(cf.depensesSaisonnieres);

  let expected = baseMonthly;
  const alpha = 0.2; // lissage
  const points: CashflowForecastPoint[] = [];

  for (let i = 1; i <= 12; i++) {
    // saison: boost dépenses pour 3 mois (ex: mois 1-2-12), c’est arbitraire mais raisonnable
    let seasonalAdj = 0;
    if ([12,1,2].includes(i)) {
      seasonalAdj = -Math.min( seasonal / 6, Math.abs(baseMonthly) / 4 ); // extra coût => cashflow plus bas
    }

    // petite dérive vers zéro pour éviter explosion
    const drift = -0.01 * expected;

    expected = (1 - alpha) * expected + alpha * (baseMonthly + seasonalAdj + drift);

    const std = Math.max(50, Math.abs(expected) * 0.15);
    points.push({
      monthIndex: i,
      expected: Math.round(expected),
      lower: Math.round(expected - 1.28 * std), // ~80% interval
      upper: Math.round(expected + 1.28 * std),
    });
  }
  return points;
}

export class PredictiveAnalyticsService {
  static analyze(userData: UserData, opts?: { currentEquityAllocation?: number }): PredictiveReport {
    const age = deriveAge(userData) ?? 70;
    const netMonthlyIncome = computeNetMonthlyIncome(userData);
    const monthlyExpenses = computeMonthlyExpenses(userData);
    const monthlyCashflow = netMonthlyIncome - monthlyExpenses;

    const portfolioValue = estimatePortfolioValue(userData);
    const monthlyEssential = (() => {
      const cf: any = (userData as any).cashflow || {};
      const keys = ['logement','servicesPublics','assurances','alimentation','transport','sante'];
      return safeSum(keys.map(k => toNumber(cf[k])));
    })();

    const cushionMonths = estimateCashCushionMonths(userData, portfolioValue, monthlyEssential, age);

    // Taux d’épargne = max(0, cashflow + (épargne enregistrée mensuelle ?) / revenu net)
    // Minimalement: cashflow / net income
    const savingsRate = netMonthlyIncome > 0 ? Math.max(0, monthlyCashflow / netMonthlyIncome) : 0;

    // Alignement actions: si non fourni, utiliser la cible recommandée pour calculer le misalignment = 0
    const band = recommendedEquityBand(age);
    const targetEqMid = (band.min + band.max) / 2;
    const currentEq = Math.max(0, Math.min(1, toNumber(opts?.currentEquityAllocation)));
    const equityMisalignment = opts?.currentEquityAllocation == null ? 0 : Math.abs(currentEq - targetEqMid);

    const ev = expenseVolatilityProxy(userData);

    const summary: PredictiveSummary = {
      savingsRate,
      monthlyCashflow: Math.round(monthlyCashflow),
      cashCushionMonths: cushionMonths,
      equityMisalignment,
      expenseVolatilityProxy: ev
    };

    const prob = computeSuccessProbability(summary);
    const level = classifyRisk(prob);

    // Recommandations
    const recs: string[] = [];
    if (savingsRate < 0.2) {
      recs.push('Augmentez votre taux d’épargne vers 20 % (réduire dépenses discrétionnaires, optimiser factures).');
    }
    if (cushionMonths < 12) {
      recs.push('Constituez un coussin de 12–24 mois de dépenses essentielles en liquidités.');
    }
    if (opts?.currentEquityAllocation != null && equityMisalignment > 0.05) {
      recs.push('Alignez progressivement la poche actions dans la bande recommandée (rééquilibrage ±5 %).');
    }
    if (ev > 0.35) {
      recs.push('Lissez les dépenses saisonnières via “sinking funds” mensuels pour réduire la variabilité.');
    }

    const forecast = forecast12m(userData, monthlyCashflow);

    return {
      summary,
      successProbability: Math.round(prob * 1000) / 1000,
      riskLevel: level,
      recommendations: recs,
      forecast12m: forecast
    };
  }
}

export default PredictiveAnalyticsService;
