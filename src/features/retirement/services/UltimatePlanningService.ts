// Service de gestion du plan Ultimate (300 $)
// Planification successorale avancée et rapports de préparation
// Respectant la typographie québécoise et les limites professionnelles

import { 
  UltimatePlanningData, 
  PreparationReport, 
  FinancialSimulation, 
  EstatePlanning,
  CollaborationSettings,
  ReportContent,
  VerificationItem,
  PreparedQuestion,
  RequiredDocument,
  SimulationParameters,
  FinancialProjection,
  KeyMetrics,
  AssetProtectionStrategy,
  TaxOptimizationStrategy,
  InsurancePlanningStrategy,
  AssetManagementStrategy,
  TransferPlan,
  Beneficiary
} from '../types/ultimate-planning';
import { EmergencyInfoData } from '../types/emergency-info';

export class UltimatePlanningService {
  private static readonly STORAGE_KEY = 'ultimate_planning_data';
  private static readonly BACKUP_KEY = 'ultimate_planning_backup';
  private static readonly VERSION = '1.0.0';

  // ===== GESTION DES DONNÉES PRINCIPALES =====

  static getData(): UltimatePlanningData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Conversion des dates
        data.lastUpdated = new Date(data.lastUpdated);
        if (data.preparationReports) {
          data.preparationReports.forEach((report: PreparationReport) => {
            report.createdAt = new Date(report.createdAt);
            report.lastModified = new Date(report.lastModified);
          });
        }
        if (data.financialSimulations) {
          data.financialSimulations.forEach((sim: FinancialSimulation) => {
            sim.createdAt = new Date(sim.createdAt);
            sim.lastModified = new Date(sim.lastModified);
          });
        }
        return data;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données Ultimate:', error);
    }
    
    return this.getDefaultData();
  }

  static saveData(data: UltimatePlanningData): boolean {
    try {
      data.lastUpdated = new Date();
      data.version = this.VERSION;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données Ultimate:', error);
      return false;
    }
  }

  static createBackup(data: UltimatePlanningData): void {
    try {
      const backup = {
        data,
        timestamp: new Date().toISOString(),
        version: this.VERSION
      };
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
    } catch (error) {
      console.error('Erreur lors de la création du backup:', error);
    }
  }

  static restoreFromBackup(): UltimatePlanningData | null {
    try {
      const stored = localStorage.getItem(this.BACKUP_KEY);
      if (stored) {
        const backup = JSON.parse(stored);
        return backup.data;
      }
    } catch (error) {
      console.error('Erreur lors de la restauration du backup:', error);
    }
    return null;
  }

  static resetData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.BACKUP_KEY);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  }

  // ===== GESTION DES RAPPORTS DE PRÉPARATION =====

  static createPreparationReport(
    type: 'notaire' | 'avocat' | 'conseiller' | 'assureur',
    emergencyData: EmergencyInfoData
  ): PreparationReport {
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const report: PreparationReport = {
      id: reportId,
      title: `Rapport de préparation - ${this.getTypeLabel(type)}`,
      type,
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'brouillon',
      content: this.generateReportContent(emergencyData),
      verificationChecklist: this.generateVerificationChecklist(type),
      preparedQuestions: this.generatePreparedQuestions(type),
      requiredDocuments: this.generateRequiredDocuments(type),
      notes: '',
      metadata: this.generateReportMetadata()
    };

    return report;
  }

  static updatePreparationReport(reportId: string, updates: Partial<PreparationReport>): boolean {
    try {
      const data = this.getData();
      const reportIndex = data.preparationReports.findIndex(r => r.id === reportId);
      
      if (reportIndex !== -1) {
        data.preparationReports[reportIndex] = {
          ...data.preparationReports[reportIndex],
          ...updates,
          lastModified: new Date()
        };
        return this.saveData(data);
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rapport:', error);
      return false;
    }
  }

  static deletePreparationReport(reportId: string): boolean {
    try {
      const data = this.getData();
      data.preparationReports = data.preparationReports.filter(r => r.id !== reportId);
      return this.saveData(data);
    } catch (error) {
      console.error('Erreur lors de la suppression du rapport:', error);
      return false;
    }
  }

  static finalizeReport(reportId: string): boolean {
    return this.updatePreparationReport(reportId, { status: 'finalisé' });
  }

  static shareReport(reportId: string): boolean {
    return this.updatePreparationReport(reportId, { status: 'partagé' });
  }

  // ===== GÉNÉRATION DU CONTENU DES RAPPORTS =====

  private static generateReportContent(emergencyData: EmergencyInfoData): ReportContent {
    return {
      executiveSummary: this.generateExecutiveSummary(emergencyData),
      personalInfo: this.generatePersonalInfoSummary(emergencyData),
      financialSummary: this.generateFinancialSummary(emergencyData),
      familySummary: this.generateFamilySummary(emergencyData),
      assetsSummary: this.generateAssetsSummary(emergencyData),
      insuranceSummary: this.generateInsuranceSummary(emergencyData),
      digitalAccessSummary: this.generateDigitalAccessSummary(emergencyData),
      preferencesSummary: this.generatePreferencesSummary(emergencyData)
    };
  }

  private static generateExecutiveSummary(emergencyData: EmergencyInfoData): string {
    const contactCount = emergencyData.emergencyContacts.length;
    const medicalCount = emergencyData.medicalInfo.medications.length;
    const dependentCount = emergencyData.dependents.length;
    const documentCount = emergencyData.importantDocuments.length;
    const propertyCount = emergencyData.properties.length;
    const insuranceCount = emergencyData.insurances.length;

    return `Ce rapport présente un résumé complet de votre situation personnelle, financière et successorale. 
    Il contient ${contactCount} contacts d'urgence, ${medicalCount} médicaments, ${dependentCount} personnes à charge, 
    ${documentCount} documents importants, ${propertyCount} propriétés et ${insuranceCount} polices d'assurance. 
    Utilisez ce rapport pour préparer votre consultation avec un professionnel.`;
  }

  private static generatePersonalInfoSummary(emergencyData: EmergencyInfoData): any {
    // Extraction des informations personnelles depuis les données d'urgence
    const primaryContact = emergencyData.emergencyContacts[0];
    
    return {
      fullName: primaryContact?.fullName || 'Non spécifié',
      dateOfBirth: emergencyData.medicalInfo.dateOfBirth || new Date(),
      maritalStatus: emergencyData.employmentInfo.maritalStatus || 'Non spécifié',
      dependents: emergencyData.dependents.length,
      province: emergencyData.employmentInfo.province || 'Non spécifié',
      citizenship: 'Canadien' // Valeur par défaut
    };
  }

  private static generateFinancialSummary(emergencyData: EmergencyInfoData): any {
    const totalAssets = emergencyData.properties.reduce((sum, prop) => sum + (prop.estimatedValue || 0), 0);
    const totalLiabilities = emergencyData.financialInfo.personalLoans.reduce((sum, loan) => sum + (loan.outstandingBalance || 0), 0);
    const insuranceCoverage = emergencyData.insurances.reduce((sum, ins) => sum + (ins.coverageAmount || 0), 0);

    return {
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
      liquidAssets: emergencyData.financialInfo.bankAccounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0),
      realEstate: totalAssets,
      investments: emergencyData.financialInfo.investments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0),
      insuranceCoverage,
      monthlyIncome: emergencyData.employmentInfo.monthlyIncome || 0,
      monthlyExpenses: 0 // À calculer selon les données disponibles
    };
  }

  private static generateFamilySummary(emergencyData: EmergencyInfoData): any {
    return {
      spouse: emergencyData.employmentInfo.spouseName || 'Non spécifié',
      children: emergencyData.dependents.filter(d => d.relationship === 'enfant').map(d => d.fullName),
      parents: emergencyData.dependents.filter(d => d.relationship === 'parent').map(d => d.fullName),
      siblings: emergencyData.dependents.filter(d => d.relationship === 'frère/sœur').map(d => d.fullName),
      otherDependents: emergencyData.dependents.filter(d => !['enfant', 'parent', 'frère/sœur'].includes(d.relationship)).map(d => d.fullName),
      familyBusiness: false // À déterminer selon les données
    };
  }

  private static generateAssetsSummary(emergencyData: EmergencyInfoData): any {
    const properties = emergencyData.properties.length;
    const totalValue = emergencyData.properties.reduce((sum, prop) => sum + (prop.estimatedValue || 0), 0);

    return {
      properties,
      vehicles: 0, // À ajouter si nécessaire
      investments: emergencyData.financialInfo.investments.length,
      collectibles: 0, // À ajouter si nécessaire
      businessInterests: 0, // À ajouter si nécessaire
      totalValue
    };
  }

  private static generateInsuranceSummary(emergencyData: EmergencyInfoData): any {
    const lifeInsurance = emergencyData.insurances.filter(ins => ins.type === 'vie').reduce((sum, ins) => sum + (ins.coverageAmount || 0), 0);
    const totalCoverage = emergencyData.insurances.reduce((sum, ins) => sum + (ins.coverageAmount || 0), 0);
    const monthlyPremiums = emergencyData.insurances.reduce((sum, ins) => sum + (ins.monthlyPremium || 0), 0);

    return {
      lifeInsurance,
      healthInsurance: emergencyData.insurances.some(ins => ins.type === 'santé'),
      disabilityInsurance: emergencyData.insurances.some(ins => ins.type === 'invalidité'),
      propertyInsurance: emergencyData.insurances.some(ins => ins.type === 'habitation'),
      totalCoverage,
      monthlyPremiums
    };
  }

  private static generateDigitalAccessSummary(emergencyData: EmergencyInfoData): any {
    const emailAccounts = emergencyData.digitalAccess.emailAccounts.length;
    const socialNetworks = emergencyData.digitalAccess.socialNetworks.length;
    const onlineBanking = emergencyData.digitalAccess.onlineBankingServices.length;
    const twoFactorEnabled = emergencyData.digitalAccess.emailAccounts.filter(e => e.twoFactorEnabled).length +
                             emergencyData.digitalAccess.onlineBankingServices.filter(b => b.hasTwoFactor).length;

    return {
      emailAccounts,
      socialNetworks,
      onlineBanking,
      digitalAssets: emailAccounts + socialNetworks + onlineBanking,
      twoFactorEnabled,
      securityScore: Math.min(100, Math.round((twoFactorEnabled / (emailAccounts + onlineBanking)) * 100))
    };
  }

  private static generatePreferencesSummary(emergencyData: EmergencyInfoData): any {
    return {
      funeralPreferences: emergencyData.funeralPreferences.type || 'Non spécifié',
      organDonation: emergencyData.funeralPreferences.organDonation || false,
      medicalDirectives: emergencyData.funeralPreferences.medicalDirectives || false,
      powerOfAttorney: emergencyData.funeralPreferences.powerOfAttorney || false,
      executor: emergencyData.willAndSuccession.executor || 'Non spécifié',
      backupExecutor: emergencyData.willAndSuccession.backupExecutor || 'Non spécifié'
    };
  }

  // ===== GÉNÉRATION DES CHECKLISTS ET QUESTIONS =====

  private static generateVerificationChecklist(type: string): VerificationItem[] {
    const baseChecklist: VerificationItem[] = [
      {
        id: 'check_1',
        category: 'légal',
        description: 'Vérifier la validité du testament actuel',
        importance: 'critique',
        status: 'à vérifier',
        notes: 'Confirmer que le testament est conforme aux lois actuelles'
      },
      {
        id: 'check_2',
        category: 'financier',
        description: 'Réviser la planification successorale',
        importance: 'élevée',
        status: 'à vérifier',
        notes: 'S\'assurer que la planification est optimale'
      }
    ];

    // Ajouter des éléments spécifiques selon le type de professionnel
    switch (type) {
      case 'notaire':
        baseChecklist.push(
          {
            id: 'check_3',
            category: 'légal',
            description: 'Vérifier la conformité des documents légaux',
            importance: 'critique',
            status: 'à vérifier',
            notes: 'Validation de la légalité de tous les documents'
          }
        );
        break;
      case 'avocat':
        baseChecklist.push(
          {
            id: 'check_4',
            category: 'légal',
            description: 'Analyser les risques juridiques',
            importance: 'élevée',
            status: 'à vérifier',
            notes: 'Identification et mitigation des risques légaux'
          }
        );
        break;
    }

    return baseChecklist;
  }

  private static generatePreparedQuestions(type: string): PreparedQuestion[] {
    const baseQuestions: PreparedQuestion[] = [
      {
        id: 'q_1',
        category: 'général',
        question: 'Quels sont les documents supplémentaires nécessaires ?',
        context: 'Pour compléter la planification successorale',
        expectedAnswer: 'Liste des documents requis',
        importance: 'élevée',
        notes: 'Préparer une liste complète'
      }
    ];

    // Ajouter des questions spécifiques selon le type
    switch (type) {
      case 'notaire':
        baseQuestions.push({
          id: 'q_2',
          category: 'légal',
          question: 'Quelles sont les exigences légales spécifiques à ma province ?',
          context: 'Conformité provinciale',
          expectedAnswer: 'Exigences détaillées',
          importance: 'critique',
          notes: 'Vérifier les particularités provinciales'
        });
        break;
    }

    return baseQuestions;
  }

  private static generateRequiredDocuments(type: string): RequiredDocument[] {
    const baseDocuments: RequiredDocument[] = [
      {
        id: 'doc_1',
        name: 'Pièce d\'identité valide',
        type: 'original',
        category: 'identité',
        description: 'Carte d\'assurance maladie ou passeport',
        isRequired: true,
        notes: 'Doit être valide et à jour',
        status: 'à obtenir'
      },
      {
        id: 'doc_2',
        name: 'Testament actuel',
        type: 'original',
        category: 'légal',
        description: 'Copie du testament existant',
        isRequired: false,
        notes: 'Si disponible',
        status: 'à obtenir'
      }
    ];

    return baseDocuments;
  }

  private static generateReportMetadata(): any {
    return {
      totalPages: 0, // À calculer lors de la génération
      estimatedReadingTime: 15, // minutes
      lastDataSync: new Date(),
      dataCompleteness: 0, // À calculer
              generatedBy: 'MonPlanRetraite.ca',
      template: 'standard'
    };
  }

  // ===== GESTION DES SIMULATIONS FINANCIÈRES =====

  static createFinancialSimulation(
    name: string,
    description: string,
    parameters: SimulationParameters
  ): FinancialSimulation {
    const simulationId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const simulation: FinancialSimulation = {
      id: simulationId,
      name,
      description,
      createdAt: new Date(),
      lastModified: new Date(),
      parameters,
      results: this.generateSimulationResults(parameters),
      scenarios: this.generateSimulationScenarios(parameters),
      sensitivityAnalysis: this.generateSensitivityAnalysis(parameters)
    };

    return simulation;
  }

  private static generateSimulationResults(parameters: SimulationParameters): any {
    // Logique de simulation simplifiée
    const projections: FinancialProjection[] = [];
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < parameters.timeHorizon; i++) {
      const year = currentYear + i;
      projections.push({
        year,
        netWorth: 100000 * Math.pow(1 + parameters.investmentReturn, i),
        liquidAssets: 50000 * Math.pow(1 + parameters.investmentReturn, i),
        realEstate: 300000 * Math.pow(1 + parameters.inflationRate, i),
        investments: 200000 * Math.pow(1 + parameters.investmentReturn, i),
        debts: 50000 * Math.pow(1 + parameters.inflationRate, i),
        taxes: 15000 * Math.pow(1 + parameters.inflationRate, i),
        insuranceCosts: 5000 * Math.pow(1 + parameters.inflationRate, i),
        inheritanceTax: 0 // À calculer selon la province
      });
    }

    return {
      projections,
      keyMetrics: this.calculateKeyMetrics(projections),
      charts: [], // À implémenter
      summary: 'Simulation financière générée automatiquement'
    };
  }

  private static calculateKeyMetrics(projections: FinancialProjection[]): KeyMetrics {
    const firstYear = projections[0];
    const lastYear = projections[projections[projections.length - 1]];
    
    return {
      netWorthGrowth: ((lastYear.netWorth - firstYear.netWorth) / firstYear.netWorth) * 100,
      debtToAssetRatio: lastYear.debts / lastYear.netWorth,
      liquidityRatio: lastYear.liquidAssets / lastYear.debts,
      taxEfficiency: 1 - (lastYear.taxes / lastYear.netWorth),
      insuranceCoverage: 0, // À calculer
      inheritanceTaxLiability: lastYear.inheritanceTax
    };
  }

  private static generateSimulationScenarios(parameters: SimulationParameters): any[] {
    return [
      {
        id: 'scenario_1',
        name: 'Scénario optimiste',
        description: 'Croissance économique favorable',
        parameters: { ...parameters, investmentReturn: parameters.investmentReturn * 1.2 },
        results: {},
        comparison: {
          bestScenario: 'Scénario optimiste',
          worstScenario: 'Scénario pessimiste',
          recommendedScenario: 'Scénario réaliste',
          riskLevel: 'moyen',
          notes: 'Scénario recommandé pour la planification'
        }
      }
    ];
  }

  private static generateSensitivityAnalysis(parameters: SimulationParameters): any {
    return {
      stressTests: [
        {
          name: 'Test de résistance - Inflation élevée',
          description: 'Impact d\'une inflation de 5 %',
          impact: 'élevé',
          probability: 0.3,
          mitigation: 'Diversification des investissements'
        }
      ],
      criticalVariables: [
        {
          name: 'Taux de rendement des investissements',
          currentValue: parameters.investmentReturn,
          minValue: parameters.investmentReturn * 0.5,
          maxValue: parameters.investmentReturn * 1.5,
          impact: 0.8,
          recommendations: ['Diversifier le portefeuille', 'Réviser régulièrement la stratégie']
        }
      ],
      recommendations: [
        'Maintenir une diversification des actifs',
        'Réviser la planification annuellement',
        'Consulter un conseiller financier'
      ]
    };
  }

  // ===== GESTION DE LA PLANIFICATION SUCCESSORALE =====

  static generateEstatePlanningStrategies(): AssetProtectionStrategy[] {
    return [
      {
        id: 'strategy_1',
        name: 'Assurance-vie adéquate',
        description: 'Maintenir une couverture d\'assurance-vie suffisante',
        type: 'assurance',
        implementation: 'Réviser et ajuster les polices d\'assurance-vie',
        benefits: ['Protection financière pour la famille', 'Liquidités pour les impôts'],
        risks: ['Coûts des primes', 'Exclusions de couverture'],
        cost: 5000,
        timeline: 'Immédiat',
        priority: 'élevée'
      },
      {
        id: 'strategy_2',
        name: 'Planification fiscale',
        description: 'Optimiser la planification fiscale successorale',
        type: 'financier',
        implementation: 'Stratégies de transfert d\'actifs',
        benefits: ['Réduction des impôts successoraux', 'Maximisation de la transmission'],
        risks: ['Complexité', 'Changements législatifs'],
        cost: 2000,
        timeline: '6 mois',
        priority: 'moyenne'
      }
    ];
  }

  // ===== UTILITAIRES =====

  private static getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'notaire': 'Notaire',
      'avocat': 'Avocat',
      'conseiller': 'Conseiller financier',
      'assureur': 'Conseiller en assurance'
    };
    return labels[type] || type;
  }

  private static getDefaultData(): UltimatePlanningData {
    return {
      userId: '',
      lastUpdated: new Date(),
      version: this.VERSION,
      preparationReports: [],
      financialSimulations: [],
      estatePlanning: {
        assetProtection: [],
        taxOptimization: [],
        insurancePlanning: [],
        assetManagement: [],
        transferPlan: {
          immediateTransfer: [],
          gradualTransfer: [],
          conditionalTransfer: [],
          beneficiaries: [],
          conditions: [],
          timeline: {
            immediate: [],
            shortTerm: [],
            mediumTerm: [],
            longTerm: [],
            notes: ''
          }
        }
      },
      collaboration: {
        sharedAccess: [],
        workflow: [],
        notifications: [],
        security: {
          encryptionLevel: 'standard',
          twoFactorRequired: false,
          sessionTimeout: 30,
          ipRestrictions: [],
          auditLog: true
        }
      }
    };
  }

  static getUsageStats(): { totalReports: number; totalSimulations: number; lastActivity: Date | null } {
    const data = this.getData();
    return {
      totalReports: data.preparationReports.length,
      totalSimulations: data.financialSimulations.length,
      lastActivity: data.lastUpdated
    };
  }

  static exportData(): string {
    try {
      const data = this.getData();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      return '';
    }
  }

  static importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (this.validateData(data)) {
        return this.saveData(data);
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return false;
    }
  }

  private static validateData(data: any): data is UltimatePlanningData {
    // Validation de base
    return data && 
           typeof data.userId === 'string' &&
           Array.isArray(data.preparationReports) &&
           Array.isArray(data.financialSimulations);
  }
}
