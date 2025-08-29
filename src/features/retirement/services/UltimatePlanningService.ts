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
    type: 'notaire' | 'avocat' | 'conseiller' | 'assureur' | 'fiscal' | 'financial_planning' | 'banking' | 'real_estate' | 'emergency',
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
    const contactCount = emergencyData.contactsUrgence?.length || 0;
    const medicalCount = emergencyData.informationsMedicales?.medicaments?.length || 0;
    const dependentCount = emergencyData.personnesCharge?.length || 0;
    const documentCount = emergencyData.documentsImportants?.length || 0;
    const propertyCount = emergencyData.proprietes?.length || 0;
    const insuranceCount = emergencyData.assurances?.length || 0;

    return `Ce rapport présente un résumé complet de votre situation personnelle, financière et successorale. 
    Il contient ${contactCount} contacts d'urgence, ${medicalCount} médicaments, ${dependentCount} personnes à charge, 
    ${documentCount} documents importants, ${propertyCount} propriétés et ${insuranceCount} polices d'assurance. 
    Utilisez ce rapport pour préparer votre consultation avec un professionnel.`;
  }

  private static generatePersonalInfoSummary(emergencyData: EmergencyInfoData): any {
    // Extraction des informations personnelles depuis les données d'urgence
    const primaryContact = emergencyData.contactsUrgence?.[0];
    
    return {
      fullName: primaryContact?.nomComplet || 'Non spécifié',
      dateOfBirth: emergencyData.informationsMedicales?.dateNaissance || new Date(),
      maritalStatus: emergencyData.informationsEmploi?.statutMatrimonial || 'Non spécifié',
      dependents: emergencyData.personnesCharge?.length || 0,
      province: emergencyData.informationsEmploi?.province || 'Non spécifié',
      citizenship: 'Canadien' // Valeur par défaut
    };
  }

  private static generateFinancialSummary(emergencyData: EmergencyInfoData): any {
    const totalAssets = emergencyData.proprietes?.reduce((sum, prop) => sum + (prop.valeurEstimee || 0), 0) || 0;
    const totalLiabilities = emergencyData.informationsFinancieres?.pretsPersonnels?.reduce((sum, loan) => sum + (loan.soldeRestant || 0), 0) || 0;
    const insuranceCoverage = emergencyData.assurances?.reduce((sum, ins) => sum + (ins.montantCouverture || 0), 0) || 0;

    return {
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
      liquidAssets: emergencyData.informationsFinancieres?.comptesBancaires?.reduce((sum, acc) => sum + (acc.soldeActuel || 0), 0) || 0,
      realEstate: totalAssets,
      investments: emergencyData.informationsFinancieres?.investissements?.reduce((sum, inv) => sum + (inv.valeurActuelle || 0), 0) || 0,
      insuranceCoverage,
      monthlyIncome: emergencyData.informationsEmploi?.revenuMensuel || 0,
      monthlyExpenses: 0 // À calculer selon les données disponibles
    };
  }

  private static generateFamilySummary(emergencyData: EmergencyInfoData): any {
    return {
      spouse: emergencyData.informationsEmploi?.nomConjoint || 'Non spécifié',
      children: emergencyData.personnesCharge?.filter(d => d.lienParente === 'enfant').map(d => d.nomComplet) || [],
      parents: emergencyData.personnesCharge?.filter(d => d.lienParente === 'parent').map(d => d.nomComplet) || [],
      siblings: emergencyData.personnesCharge?.filter(d => d.lienParente === 'frère/sœur').map(d => d.nomComplet) || [],
      otherDependents: emergencyData.personnesCharge?.filter(d => !['enfant', 'parent', 'frère/sœur'].includes(d.lienParente)).map(d => d.nomComplet) || [],
      familyBusiness: false // À déterminer selon les données
    };
  }

  private static generateAssetsSummary(emergencyData: EmergencyInfoData): any {
    const properties = emergencyData.proprietes?.length || 0;
    const totalValue = emergencyData.proprietes?.reduce((sum, prop) => sum + (prop.valeurEstimee || 0), 0) || 0;

    return {
      properties,
      vehicles: 0, // À ajouter si nécessaire
      investments: emergencyData.informationsFinancieres?.investissements?.length || 0,
      collectibles: 0, // À ajouter si nécessaire
      businessInterests: 0, // À ajouter si nécessaire
      totalValue
    };
  }

  private static generateInsuranceSummary(emergencyData: EmergencyInfoData): any {
    const lifeInsurance = emergencyData.assurances?.filter(ins => ins.type === 'vie').reduce((sum, ins) => sum + (ins.montantCouverture || 0), 0) || 0;
    const totalCoverage = emergencyData.assurances?.reduce((sum, ins) => sum + (ins.montantCouverture || 0), 0) || 0;
    const monthlyPremiums = emergencyData.assurances?.reduce((sum, ins) => sum + (ins.primeMensuelle || 0), 0) || 0;

    return {
      lifeInsurance,
      healthInsurance: emergencyData.assurances?.some(ins => ins.type === 'santé') || false,
      disabilityInsurance: emergencyData.assurances?.some(ins => ins.type === 'invalidité') || false,
      propertyInsurance: emergencyData.assurances?.some(ins => ins.type === 'habitation') || false,
      totalCoverage,
      monthlyPremiums
    };
  }

  private static generateDigitalAccessSummary(emergencyData: EmergencyInfoData): any {
    const emailAccounts = emergencyData.accesNumeriques?.comptesCourriel?.length || 0;
    const socialNetworks = emergencyData.accesNumeriques?.reseauxSociaux?.length || 0;
    const onlineBanking = emergencyData.accesNumeriques?.servicesBancairesEnLigne?.length || 0;
    const twoFactorEnabled = (emergencyData.accesNumeriques?.comptesCourriel?.filter(e => e.doubleAuthentification).length || 0) +
                             (emergencyData.accesNumeriques?.servicesBancairesEnLigne?.filter(b => b.doubleAuthentification).length || 0);

    return {
      emailAccounts,
      socialNetworks,
      onlineBanking,
      digitalAssets: emailAccounts + socialNetworks + onlineBanking,
      twoFactorEnabled,
      securityScore: Math.min(100, Math.round((twoFactorEnabled / Math.max(1, emailAccounts + onlineBanking)) * 100))
    };
  }

  private static generatePreferencesSummary(emergencyData: EmergencyInfoData): any {
    return {
      funeralPreferences: emergencyData.preferencesFuneraires?.type || 'Non spécifié',
      organDonation: emergencyData.preferencesFuneraires?.donOrganes || false,
      medicalDirectives: emergencyData.preferencesFuneraires?.directivesMedicales || false,
      powerOfAttorney: emergencyData.preferencesFuneraires?.procurationMedicale || false,
      executor: emergencyData.testamentSuccession?.executeur || 'Non spécifié',
      backupExecutor: emergencyData.testamentSuccession?.executeurSuppleant || 'Non spécifié'
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
      case 'fiscal':
        baseChecklist.push(
          {
            id: 'check_5',
            category: 'fiscal',
            description: 'Analyser l\'optimisation fiscale actuelle',
            importance: 'élevée',
            status: 'à vérifier',
            notes: 'Révision des stratégies REER/CELI et décaissement'
          },
          {
            id: 'check_6',
            category: 'fiscal',
            description: 'Vérifier les déclarations fiscales récentes',
            importance: 'critique',
            status: 'à vérifier',
            notes: 'Conformité et opportunités d\'optimisation'
          }
        );
        break;
      case 'financial_planning':
        baseChecklist.push(
          {
            id: 'check_7',
            category: 'financier',
            description: 'Évaluer l\'allocation d\'actifs actuelle',
            importance: 'élevée',
            status: 'à vérifier',
            notes: 'Diversification et adéquation au profil de risque'
          },
          {
            id: 'check_8',
            category: 'financier',
            description: 'Réviser les objectifs de retraite',
            importance: 'critique',
            status: 'à vérifier',
            notes: 'Réalisme et faisabilité des objectifs'
          }
        );
        break;
      case 'banking':
        baseChecklist.push(
          {
            id: 'check_9',
            category: 'financier',
            description: 'Analyser les produits bancaires actuels',
            importance: 'moyenne',
            status: 'à vérifier',
            notes: 'Optimisation des comptes et services bancaires'
          },
          {
            id: 'check_10',
            category: 'financier',
            description: 'Évaluer les besoins de crédit',
            importance: 'élevée',
            status: 'à vérifier',
            notes: 'Lignes de crédit et financement optimal'
          }
        );
        break;
      case 'real_estate':
        baseChecklist.push(
          {
            id: 'check_11',
            category: 'immobilier',
            description: 'Évaluer le portefeuille immobilier',
            importance: 'élevée',
            status: 'à vérifier',
            notes: 'Valeur marchande et potentiel d\'optimisation'
          },
          {
            id: 'check_12',
            category: 'immobilier',
            description: 'Analyser les stratégies de financement',
            importance: 'critique',
            status: 'à vérifier',
            notes: 'Hypothèques et leviers financiers'
          }
        );
        break;
      case 'emergency':
        baseChecklist.push(
          {
            id: 'check_13',
            category: 'urgence',
            description: 'Vérifier la complétude du plan d\'urgence',
            importance: 'critique',
            status: 'à vérifier',
            notes: 'Tous les éléments essentiels sont-ils couverts ?'
          },
          {
            id: 'check_14',
            category: 'urgence',
            description: 'Valider l\'accessibilité des informations',
            importance: 'élevée',
            status: 'à vérifier',
            notes: 'Les proches peuvent-ils accéder aux informations ?'
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
    const lastYear = projections[projections.length - 1];
    
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
      'assureur': 'Conseiller en assurance',
      'fiscal': 'Comptable/Fiscaliste',
      'financial_planning': 'Planificateur financier',
      'banking': 'Conseiller bancaire',
      'real_estate': 'Conseiller immobilier',
      'emergency': 'Plan d\'urgence'
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
