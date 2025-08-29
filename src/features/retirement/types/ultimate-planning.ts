// Types pour le plan Ultimate (300 $)
// Planification successorale avancée et rapports de préparation
// Respectant la typographie québécoise et les limites professionnelles

export interface UltimatePlanningData {
  // Données de base
  userId: string;
  lastUpdated: Date;
  version: string;
  
  // Rapports de préparation
  preparationReports: PreparationReport[];
  
  // Simulations financières
  financialSimulations: FinancialSimulation[];
  
  // Planification successorale
  estatePlanning: EstatePlanning;
  
  // Collaboration et partage
  collaboration: CollaborationSettings;
}

// ===== RAPPORTS DE PRÉPARATION =====

export interface PreparationReport {
  id: string;
  title: string;
  type: 'notaire' | 'avocat' | 'conseiller' | 'assureur' | 'fiscal' | 'financial_planning' | 'banking' | 'real_estate' | 'emergency';
  createdAt: Date;
  lastModified: Date;
  status: 'brouillon' | 'finalisé' | 'partagé';
  
  // Contenu du rapport
  content: ReportContent;
  
  // Checklist de vérification
  verificationChecklist: VerificationItem[];
  
  // Questions préparées
  preparedQuestions: PreparedQuestion[];
  
  // Documents à apporter
  requiredDocuments: RequiredDocument[];
  
  // Notes et observations
  notes: string;
  
  // Métadonnées
  metadata: ReportMetadata;
}

export interface ReportContent {
  // Résumé exécutif
  executiveSummary: string;
  
  // Informations personnelles
  personalInfo: PersonalInfoSummary;
  
  // Situation financière
  financialSummary: FinancialSummary;
  
  // Situation familiale
  familySummary: FamilySummary;
  
  // Biens et propriétés
  assetsSummary: AssetsSummary;
  
  // Assurances et protection
  insuranceSummary: InsuranceSummary;
  
  // Accès numériques
  digitalAccessSummary: DigitalAccessSummary;
  
  // Préférences et souhaits
  preferencesSummary: PreferencesSummary;
}

export interface VerificationItem {
  id: string;
  category: 'légal' | 'financier' | 'fiscal' | 'assurance' | 'succession' | 'immobilier' | 'urgence' | 'autre';
  description: string;
  importance: 'critique' | 'élevée' | 'moyenne' | 'faible';
  status: 'à vérifier' | 'en cours' | 'validé' | 'problème détecté';
  notes: string;
  assignedTo?: string; // Notaire, avocat, conseiller
  dueDate?: Date;
  completedDate?: Date;
}

export interface PreparedQuestion {
  id: string;
  category: string;
  question: string;
  context: string;
  expectedAnswer: string;
  importance: 'critique' | 'élevée' | 'moyenne' | 'faible';
  notes: string;
}

export interface RequiredDocument {
  id: string;
  name: string;
  type: 'original' | 'copie' | 'certifié' | 'traduit';
  category: string;
  description: string;
  isRequired: boolean;
  notes: string;
  status: 'à obtenir' | 'obtenu' | 'en cours' | 'problème';
}

export interface ReportMetadata {
  totalPages: number;
  estimatedReadingTime: number; // en minutes
  lastDataSync: Date;
  dataCompleteness: number; // pourcentage
  generatedBy: string;
  template: string;
}

// ===== SIMULATIONS FINANCIÈRES =====

export interface FinancialSimulation {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  lastModified: Date;
  
  // Paramètres de simulation
  parameters: SimulationParameters;
  
  // Résultats de simulation
  results: SimulationResults;
  
  // Scénarios comparatifs
  scenarios: SimulationScenario[];
  
  // Analyses de sensibilité
  sensitivityAnalysis: SensitivityAnalysis;
}

export interface SimulationParameters {
  // Horizon temporel
  timeHorizon: number; // années
  
  // Taux et rendements
  inflationRate: number;
  investmentReturn: number;
  taxRate: number;
  
  // Scénarios
  optimisticScenario: boolean;
  pessimisticScenario: boolean;
  realisticScenario: boolean;
  
  // Paramètres personnalisés
  customParameters: Record<string, number>;
}

export interface SimulationResults {
  // Projections financières
  projections: FinancialProjection[];
  
  // Indicateurs clés
  keyMetrics: KeyMetrics;
  
  // Graphiques et visualisations
  charts: ChartData[];
  
  // Résumé des résultats
  summary: string;
}

export interface ChartData {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  data: any[];
  labels: string[];
  colors: string[];
}

export interface FinancialProjection {
  year: number;
  netWorth: number;
  liquidAssets: number;
  realEstate: number;
  investments: number;
  debts: number;
  taxes: number;
  insuranceCosts: number;
  inheritanceTax: number;
}

export interface KeyMetrics {
  netWorthGrowth: number;
  debtToAssetRatio: number;
  liquidityRatio: number;
  taxEfficiency: number;
  insuranceCoverage: number;
  inheritanceTaxLiability: number;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: Partial<SimulationParameters>;
  results: Partial<SimulationResults>;
  comparison: ScenarioComparison;
}

export interface ScenarioComparison {
  bestScenario: string;
  worstScenario: string;
  recommendedScenario: string;
  riskLevel: 'faible' | 'moyen' | 'élevé';
  notes: string;
}

export interface SensitivityAnalysis {
  // Tests de résistance
  stressTests: StressTest[];
  
  // Variables critiques
  criticalVariables: CriticalVariable[];
  
  // Recommandations
  recommendations: string[];
}

export interface StressTest {
  name: string;
  description: string;
  impact: 'faible' | 'moyen' | 'élevé' | 'critique';
  probability: number;
  mitigation: string;
}

export interface CriticalVariable {
  name: string;
  currentValue: number;
  minValue: number;
  maxValue: number;
  impact: number;
  recommendations: string[];
}

// ===== PLANIFICATION SUCCESSORALE =====

export interface EstatePlanning {
  // Stratégies de protection
  assetProtection: AssetProtectionStrategy[];
  
  // Optimisation fiscale
  taxOptimization: TaxOptimizationStrategy[];
  
  // Planification d'assurance
  insurancePlanning: InsurancePlanningStrategy[];
  
  // Gestion des biens
  assetManagement: AssetManagementStrategy[];
  
  // Plan de transmission
  transferPlan: TransferPlan;
}

export interface AssetProtectionStrategy {
  id: string;
  name: string;
  description: string;
  type: 'légal' | 'financier' | 'assurance' | 'structurel';
  implementation: string;
  benefits: string[];
  risks: string[];
  cost: number;
  timeline: string;
  priority: 'élevée' | 'moyenne' | 'faible';
}

export interface TaxOptimizationStrategy {
  id: string;
  name: string;
  description: string;
  taxBenefit: string;
  implementation: string;
  requirements: string[];
  limitations: string[];
  estimatedSavings: number;
  complexity: 'simple' | 'modérée' | 'complexe';
}

export interface InsurancePlanningStrategy {
  id: string;
  name: string;
  description: string;
  coverageType: string;
  benefits: string[];
  costs: number;
  recommendations: string[];
  priority: 'élevée' | 'moyenne' | 'faible';
}

export interface AssetManagementStrategy {
  id: string;
  name: string;
  description: string;
  category: string;
  actions: string[];
  timeline: string;
  responsible: string;
  status: 'planifié' | 'en cours' | 'terminé';
}

export interface TransferPlan {
  // Plan de transmission des biens
  immediateTransfer: ImmediateTransfer[];
  gradualTransfer: GradualTransfer[];
  conditionalTransfer: ConditionalTransfer[];
  
  // Bénéficiaires
  beneficiaries: Beneficiary[];
  
  // Conditions et restrictions
  conditions: TransferCondition[];
  
  // Calendrier
  timeline: TransferTimeline;
}

export interface ImmediateTransfer {
  asset: string;
  beneficiary: string;
  value: number;
  method: string;
  conditions: string[];
}

export interface GradualTransfer {
  asset: string;
  beneficiary: string;
  totalValue: number;
  annualAmount: number;
  duration: number;
  conditions: string[];
}

export interface ConditionalTransfer {
  asset: string;
  beneficiary: string;
  value: number;
  conditions: string[];
  triggers: string[];
}

export interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  percentage: number;
  specificAssets: string[];
  conditions: string[];
  contactInfo: string;
}

export interface TransferCondition {
  id: string;
  description: string;
  type: 'âge' | 'éducation' | 'mariage' | 'profession' | 'autre';
  value: string;
  verification: string;
}

export interface TransferTimeline {
  immediate: string[];
  shortTerm: string[]; // 1-5 ans
  mediumTerm: string[]; // 5-15 ans
  longTerm: string[]; // 15+ ans
  notes: string;
}

// ===== COLLABORATION ET PARTAGE =====

export interface CollaborationSettings {
  // Accès partagés
  sharedAccess: SharedAccess[];
  
  // Workflow collaboratif
  workflow: WorkflowStep[];
  
  // Notifications
  notifications: NotificationSetting[];
  
  // Sécurité
  security: SecuritySettings;
}

export interface SharedAccess {
  id: string;
  email: string;
  name: string;
  role: 'lecture' | 'commentaire' | 'édition' | 'approbation';
  permissions: string[];
  grantedDate: Date;
  expiryDate?: Date;
  status: 'actif' | 'inactif' | 'expiré';
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  responsible: string;
  required: boolean;
  order: number;
  status: 'en attente' | 'en cours' | 'approuvé' | 'rejeté';
  comments: string[];
  completedDate?: Date;
}

export interface NotificationSetting {
  type: 'email' | 'push' | 'sms';
  event: string;
  enabled: boolean;
  frequency: 'immédiat' | 'quotidien' | 'hebdomadaire';
  recipients: string[];
}

export interface SecuritySettings {
  encryptionLevel: 'standard' | 'élevé' | 'maximum';
  twoFactorRequired: boolean;
  sessionTimeout: number; // minutes
  ipRestrictions: string[];
  auditLog: boolean;
}

// ===== RÉSUMÉS ET MÉTADONNÉES =====

export interface PersonalInfoSummary {
  fullName: string;
  dateOfBirth: Date;
  maritalStatus: string;
  dependents: number;
  province: string;
  citizenship: string;
}

export interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  liquidAssets: number;
  realEstate: number;
  investments: number;
  insuranceCoverage: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface FamilySummary {
  spouse: string;
  children: string[];
  parents: string[];
  siblings: string[];
  otherDependents: string[];
  familyBusiness: boolean;
}

export interface AssetsSummary {
  properties: number;
  vehicles: number;
  investments: number;
  collectibles: number;
  businessInterests: number;
  totalValue: number;
}

export interface InsuranceSummary {
  lifeInsurance: number;
  healthInsurance: boolean;
  disabilityInsurance: boolean;
  propertyInsurance: boolean;
  totalCoverage: number;
  monthlyPremiums: number;
}

export interface DigitalAccessSummary {
  emailAccounts: number;
  socialNetworks: number;
  onlineBanking: number;
  digitalAssets: number;
  twoFactorEnabled: number;
  securityScore: number;
}

export interface PreferencesSummary {
  funeralPreferences: string;
  organDonation: boolean;
  medicalDirectives: boolean;
  powerOfAttorney: boolean;
  executor: string;
  backupExecutor: string;
}

// ===== TYPES UTILITAIRES =====

export type ReportStatus = 'brouillon' | 'finalisé' | 'partagé';
export type ImportanceLevel = 'critique' | 'élevée' | 'moyenne' | 'faible';
export type DocumentType = 'original' | 'copie' | 'certifié' | 'traduit';
export type SimulationStatus = 'en cours' | 'terminé' | 'erreur';
export type CollaborationRole = 'lecture' | 'commentaire' | 'édition' | 'approbation';
