// Types avancés pour les fonctionnalités premium du module CPP
// Phase 3: Modélisation Monte Carlo, Optimisation fiscale, Planification successorale, API

export interface MarketSimulation {
  id: string;
  name: string;
  description: string;
  parameters: MarketParameters;
  results: MarketSimulationResult;
  createdAt: Date;
  status: 'running' | 'completed' | 'failed';
}

export interface MarketParameters {
  // Paramètres de marché
  inflationRange: { min: number; max: number; mean: number; stdDev: number };
  investmentReturnRange: { min: number; max: number; mean: number; stdDev: number };
  interestRateRange: { min: number; max: number; mean: number; stdDev: number };
  
  // Paramètres économiques
  gdpGrowthRange: { min: number; max: number; mean: number; stdDev: number };
  unemploymentRateRange: { min: number; max: number; mean: number; stdDev: number };
  
  // Paramètres démographiques
  lifeExpectancyRange: { min: number; max: number; mean: number; stdDev: number };
  mortalityRateRange: { min: number; max: number; mean: number; stdDev: number };
  
  // Paramètres de simulation
  iterations: number;
  timeHorizon: number; // années
  confidenceLevel: number; // 0.90, 0.95, 0.99
}

export interface MarketSimulationResult {
  summary: SimulationSummary;
  scenarios: MarketScenario[];
  riskMetrics: RiskMetrics;
  recommendations: string[];
  charts: ChartData[];
}

export interface SimulationSummary {
  totalScenarios: number;
  successfulScenarios: number;
  successRate: number;
  averageIncome: number;
  medianIncome: number;
  worstCaseIncome: number;
  bestCaseIncome: number;
  volatility: number;
}

export interface MarketScenario {
  id: string;
  name: string;
  probability: number;
  income: number;
  expenses: number;
  netIncome: number;
  sustainability: number;
  riskLevel: 'low' | 'medium' | 'high';
  parameters: {
    inflation: number;
    investmentReturn: number;
    interestRate: number;
    gdpGrowth: number;
    unemploymentRate: number;
    lifeExpectancy: number;
  };
}

export interface RiskMetrics {
  valueAtRisk: {
    p95: number;
    p99: number;
  };
  conditionalValueAtRisk: {
    p95: number;
    p99: number;
  };
  sharpeRatio: number;
  sortinoRatio: number;
  maximumDrawdown: number;
  calmarRatio: number;
  ulcerIndex: number;
}

export interface ChartData {
  type: 'line' | 'bar' | 'scatter' | 'heatmap';
  title: string;
  data: any[];
  options: any;
}

// Types pour l'optimisation fiscale
export interface TaxOptimizationData {
  currentTax: TaxCalculation;
  optimizedTax: TaxCalculation;
  strategies: TaxStrategy[];
  savings: TaxSavings;
  recommendations: TaxRecommendation[];
}

export interface TaxCalculation {
  grossIncome: number;
  cppDeduction: number;
  rrqDeduction: number;
  otherDeductions: number;
  taxableIncome: number;
  federalTax: number;
  provincialTax: number;
  totalTax: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
}

export interface TaxStrategy {
  id: string;
  name: string;
  description: string;
  type: 'income_splitting' | 'contribution_timing' | 'investment_structure' | 'retirement_timing';
  impact: {
    taxSavings: number;
    complexity: 'low' | 'medium' | 'high';
    risk: 'low' | 'medium' | 'high';
    implementation: string[];
  };
  requirements: string[];
  limitations: string[];
}

export interface TaxSavings {
  annual: number;
  lifetime: number;
  percentage: number;
  byStrategy: Record<string, number>;
}

export interface TaxRecommendation {
  priority: 'high' | 'medium' | 'low';
  strategy: TaxStrategy;
  reason: string;
  actionItems: string[];
  timeline: string;
}

// Types pour la planification successorale
export interface SurvivorBenefits {
  cpp: CPPSurvivorBenefits;
  rrq: RRQSurvivorBenefits;
  combined: CombinedSurvivorBenefits;
  planning: SurvivorPlanning;
}

export interface CPPSurvivorBenefits {
  deathBenefit: number;
  survivorPension: number;
  childrenBenefit: number;
  eligibility: SurvivorEligibility;
  calculation: SurvivorCalculation;
}

export interface RRQSurvivorBenefits {
  deathBenefit: number;
  survivorPension: number;
  childrenBenefit: number;
  eligibility: SurvivorEligibility;
  calculation: SurvivorCalculation;
}

export interface CombinedSurvivorBenefits {
  totalDeathBenefit: number;
  totalSurvivorPension: number;
  totalChildrenBenefit: number;
  coordination: BenefitCoordination;
  optimization: SurvivorOptimization;
}

export interface SurvivorEligibility {
  age: number;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  dependentChildren: boolean;
  contributionYears: number;
  minimumContributions: boolean;
}

export interface SurvivorCalculation {
  baseAmount: number;
  ageAdjustment: number;
  contributionAdjustment: number;
  finalAmount: number;
  paymentFrequency: 'monthly' | 'quarterly' | 'annually';
}

export interface BenefitCoordination {
  cppReduction: number;
  rrqReduction: number;
  netBenefit: number;
  explanation: string;
}

export interface SurvivorOptimization {
  strategies: SurvivorStrategy[];
  recommendations: string[];
  documents: RequiredDocument[];
}

export interface SurvivorStrategy {
  type: 'benefit_timing' | 'contribution_optimization' | 'documentation_preparation';
  description: string;
  benefits: string[];
  requirements: string[];
  timeline: string;
}

export interface RequiredDocument {
  name: string;
  description: string;
  importance: 'critical' | 'important' | 'helpful';
  whereToGet: string;
  validityPeriod: string;
}

export interface SurvivorPlanning {
  currentDocuments: DocumentStatus[];
  missingDocuments: RequiredDocument[];
  nextSteps: string[];
  timeline: string;
  estimatedBenefits: number;
}

export interface DocumentStatus {
  document: RequiredDocument;
  status: 'obtained' | 'pending' | 'missing';
  obtainedDate?: Date;
  expiryDate?: Date;
  notes?: string;
}

// Types pour l'intégration API
export interface GovernmentAPI {
  cpp: CPPAPI;
  rrq: RRQAPI;
  cra: CRAAPI;
  status: APIStatus;
}

export interface CPPAPI {
  baseUrl: string;
  endpoints: CPPEndpoints;
  authentication: APIAuthentication;
  rateLimits: RateLimits;
  dataTypes: CPPDataType[];
}

export interface RRQAPI {
  baseUrl: string;
  endpoints: RRQEndpoints;
  authentication: APIAuthentication;
  rateLimits: RateLimits;
  dataTypes: RRQDataType[];
}

export interface CRAAPI {
  baseUrl: string;
  endpoints: CRAEndpoints;
  authentication: APIAuthentication;
  rateLimits: RateLimits;
  dataTypes: CRADataType[];
}

export interface CPPEndpoints {
  contributionHistory: string;
  pensionEstimate: string;
  survivorBenefits: string;
  disabilityBenefits: string;
  contributionLimits: string;
  inflationAdjustments: string;
}

export interface RRQEndpoints {
  contributionHistory: string;
  pensionEstimate: string;
  survivorBenefits: string;
  disabilityBenefits: string;
  contributionLimits: string;
  inflationAdjustments: string;
}

export interface CRAEndpoints {
  taxRates: string;
  deductions: string;
  credits: string;
  incomeVerification: string;
  taxForms: string;
}

export interface APIAuthentication {
  type: 'oauth2' | 'api_key' | 'certificate';
  credentials: any;
  tokenExpiry: Date;
  refreshToken?: string;
}

export interface RateLimits {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  currentUsage: number;
  resetTime: Date;
}

export interface CPPDataType {
  name: string;
  description: string;
  updateFrequency: 'real_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  lastUpdate: Date;
  data: any;
}

export interface RRQDataType {
  name: string;
  description: string;
  updateFrequency: 'real_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  lastUpdate: Date;
  data: any;
}

export interface CRADataType {
  name: string;
  description: string;
  updateFrequency: 'real_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  lastUpdate: Date;
  data: any;
}

export interface APIStatus {
  cpp: 'online' | 'offline' | 'maintenance' | 'error';
  rrq: 'online' | 'offline' | 'maintenance' | 'error';
  cra: 'online' | 'offline' | 'maintenance' | 'error';
  lastCheck: Date;
  errors: APIError[];
}

export interface APIError {
  service: 'cpp' | 'rrq' | 'cra';
  code: string;
  message: string;
  timestamp: Date;
  retryAfter?: Date;
}

// Types pour les rapports avancés
export interface AdvancedReport {
  id: string;
  title: string;
  type: 'comprehensive' | 'monte_carlo' | 'tax_optimization' | 'survivor_planning' | 'api_integration';
  generatedAt: Date;
  data: any;
  charts: ChartData[];
  recommendations: string[];
  riskAssessment: RiskAssessment;
  executiveSummary: string;
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high';
  riskFactors: RiskFactor[];
  mitigationStrategies: string[];
  monitoringRecommendations: string[];
}

export interface RiskFactor {
  category: string;
  description: string;
  probability: number;
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}
