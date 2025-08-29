// Interface unifiée pour tous les types de rapports
// Centralise l'accès aux différents services de rapports
// Gère les restrictions basées sur les plans d'abonnement

import { ReportMetadataService } from './ReportMetadataService';
import { ReportExportService, ExportOptions, ExportResult } from './ReportExportService';

export type PlanType = 'gratuit' | 'professionnel' | 'expert';

export type ReportCategory = 
  | 'personal'      // Rapports personnels de base
  | 'professional'  // Rapports pour professionnels externes
  | 'analytical'    // Analyses intelligentes et recommandations
  | 'visual'        // Rapports PDF avec graphiques
  | 'emergency';    // Plans d'urgence

export type ReportType = 
  | 'budget'
  | 'retirement_basic'
  | 'retirement_comprehensive'
  | 'intelligent_analysis'
  | 'monte_carlo'
  | 'pdf_visual'
  | 'professional_fiscal'
  | 'professional_financial_planning'
  | 'professional_banking'
  | 'professional_legal'
  | 'professional_real_estate'
  | 'emergency_plan'
  | 'ultimate_succession';

export interface ReportDefinition {
  id: ReportType;
  category: ReportCategory;
  name: string;
  description: string;
  requiredPlan: PlanType;
  estimatedTime: number; // minutes
  features: string[];
  limitations?: string[];
  serviceClass: string; // Nom du service responsable
}

export interface ReportGenerationOptions {
  reportType: ReportType;
  userData: any;
  exportOptions?: Partial<ExportOptions>;
  userName?: string;
  customTitle?: string;
}

export interface ReportGenerationResult {
  success: boolean;
  reportContent?: string;
  exportResult?: ExportResult;
  error?: string;
  warnings?: string[];
  metadata?: any;
}

export class UnifiedReportManager {
  private static readonly REPORT_DEFINITIONS: Record<ReportType, ReportDefinition> = {
    // Rapports gratuits (Plan d'urgence)
    budget: {
      id: 'budget',
      category: 'personal',
      name: 'Rapport de budget personnel',
      description: 'Analyse de base de votre budget mensuel',
      requiredPlan: 'gratuit',
      estimatedTime: 5,
      features: ['Revenus et dépenses', 'Équilibre budgétaire', 'Recommandations de base'],
      serviceClass: 'BudgetReportService'
    },
    
    retirement_basic: {
      id: 'retirement_basic',
      category: 'personal',
      name: 'Rapport de retraite de base',
      description: 'Estimation simple de vos besoins de retraite',
      requiredPlan: 'gratuit',
      estimatedTime: 10,
      features: ['Règle du 4%', 'Calculs de base', 'Objectifs simples'],
      serviceClass: 'BasicRetirementService'
    },

    emergency_plan: {
      id: 'emergency_plan',
      category: 'emergency',
      name: 'Plan d\'urgence complet',
      description: 'Document d\'urgence pour vos proches',
      requiredPlan: 'gratuit',
      estimatedTime: 15,
      features: ['Contacts d\'urgence', 'Informations médicales', 'Documents importants'],
      serviceClass: 'EmergencyPlanningService'
    },

    // Rapports professionnels
    retirement_comprehensive: {
      id: 'retirement_comprehensive',
      category: 'analytical',
      name: 'Rapport de retraite complet',
      description: 'Analyse détaillée avec optimisations SRG et RREGOP',
      requiredPlan: 'professionnel',
      estimatedTime: 20,
      features: ['Analyse SRG', 'Optimisation RREGOP', 'Scénarios comparatifs', 'Actions prioritaires'],
      serviceClass: 'IntelligentReportService'
    },

    intelligent_analysis: {
      id: 'intelligent_analysis',
      category: 'analytical',
      name: 'Analyse intelligente personnalisée',
      description: 'Recommandations personnalisées avec calendrier d\'actions',
      requiredPlan: 'professionnel',
      estimatedTime: 25,
      features: ['Alertes critiques', 'Actions prioritaires', 'Calendrier de mise en œuvre'],
      serviceClass: 'IntelligentReportService'
    },

    pdf_visual: {
      id: 'pdf_visual',
      category: 'visual',
      name: 'Rapport PDF avec graphiques',
      description: 'Rapport visuel professionnel en format PDF',
      requiredPlan: 'professionnel',
      estimatedTime: 30,
      features: ['Graphiques interactifs', 'Métriques visuelles', 'Plan d\'action détaillé'],
      serviceClass: 'PDFReportService'
    },

    professional_fiscal: {
      id: 'professional_fiscal',
      category: 'professional',
      name: 'Rapport pour comptable/fiscaliste',
      description: 'Rapport spécialisé pour consultation fiscale',
      requiredPlan: 'professionnel',
      estimatedTime: 15,
      features: ['Optimisations fiscales', 'Stratégies REER/CELI', 'Checklist de vérification'],
      serviceClass: 'UltimatePlanningService'
    },

    professional_financial_planning: {
      id: 'professional_financial_planning',
      category: 'professional',
      name: 'Rapport pour planificateur financier',
      description: 'Rapport détaillé pour consultation en planification',
      requiredPlan: 'professionnel',
      estimatedTime: 20,
      features: ['Allocation d\'actifs', 'Objectifs de retraite', 'Profil de risque'],
      serviceClass: 'UltimatePlanningService'
    },

    professional_banking: {
      id: 'professional_banking',
      category: 'professional',
      name: 'Rapport pour conseiller bancaire',
      description: 'Rapport pour optimisation des services bancaires',
      requiredPlan: 'professionnel',
      estimatedTime: 15,
      features: ['Produits bancaires', 'Besoins de crédit', 'Optimisation des comptes'],
      serviceClass: 'UltimatePlanningService'
    },

    // Rapports experts (Plan Ultimate)
    monte_carlo: {
      id: 'monte_carlo',
      category: 'analytical',
      name: 'Analyse Monte Carlo',
      description: 'Simulation de 10 000 scénarios pour évaluer les risques',
      requiredPlan: 'expert',
      estimatedTime: 35,
      features: ['10 000 simulations', 'Analyse de probabilité', 'Tests de résistance'],
      limitations: ['Nécessite des données complètes'],
      serviceClass: 'MonteCarloService'
    },

    professional_legal: {
      id: 'professional_legal',
      category: 'professional',
      name: 'Rapport pour notaire/avocat',
      description: 'Rapport spécialisé pour consultation juridique',
      requiredPlan: 'expert',
      estimatedTime: 25,
      features: ['Documents légaux', 'Planification successorale', 'Risques juridiques'],
      serviceClass: 'UltimatePlanningService'
    },

    professional_real_estate: {
      id: 'professional_real_estate',
      category: 'professional',
      name: 'Rapport immobilier',
      description: 'Analyse du portefeuille immobilier et stratégies',
      requiredPlan: 'expert',
      estimatedTime: 20,
      features: ['Évaluation immobilière', 'Stratégies de financement', 'Optimisation fiscale'],
      serviceClass: 'UltimatePlanningService'
    },

    ultimate_succession: {
      id: 'ultimate_succession',
      category: 'professional',
      name: 'Planification successorale avancée',
      description: 'Rapport complet de planification successorale',
      requiredPlan: 'expert',
      estimatedTime: 40,
      features: ['Stratégies avancées', 'Simulations financières', 'Plan de transmission'],
      serviceClass: 'UltimatePlanningService'
    }
  };

  /**
   * Vérifie si un utilisateur peut générer un type de rapport
   */
  static canGenerateReport(reportType: ReportType, userPlan: PlanType): boolean {
    const reportDef = this.REPORT_DEFINITIONS[reportType];
    if (!reportDef) return false;

    const planHierarchy: Record<PlanType, number> = {
      'gratuit': 1,
      'professionnel': 2,
      'expert': 3
    };

    return planHierarchy[userPlan] >= planHierarchy[reportDef.requiredPlan];
  }

  /**
   * Obtient la liste des rapports disponibles pour un plan
   */
  static getAvailableReports(userPlan: PlanType): ReportDefinition[] {
    return Object.values(this.REPORT_DEFINITIONS)
      .filter(report => this.canGenerateReport(report.id, userPlan))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Obtient les rapports par catégorie
   */
  static getReportsByCategory(userPlan: PlanType): Record<ReportCategory, ReportDefinition[]> {
    const availableReports = this.getAvailableReports(userPlan);
    const categories: Record<ReportCategory, ReportDefinition[]> = {
      personal: [],
      professional: [],
      analytical: [],
      visual: [],
      emergency: []
    };

    availableReports.forEach(report => {
      categories[report.category].push(report);
    });

    return categories;
  }

  /**
   * Génère un rapport selon le type spécifié
   */
  static async generateReport(
    options: ReportGenerationOptions,
    userPlan: PlanType
  ): Promise<ReportGenerationResult> {
    try {
      // Vérification des permissions
      if (!this.canGenerateReport(options.reportType, userPlan)) {
        return {
          success: false,
          error: `Votre plan ${userPlan} ne permet pas de générer ce type de rapport. Mise à niveau requise.`
        };
      }

      const reportDef = this.REPORT_DEFINITIONS[options.reportType];
      const warnings: string[] = [];

      // Validation des données
      const dataValidation = this.validateUserData(options.userData, options.reportType);
      if (!dataValidation.isValid) {
        return {
          success: false,
          error: `Données insuffisantes: ${dataValidation.errors.join(', ')}`
        };
      }
      warnings.push(...dataValidation.warnings);

      // Génération du contenu selon le service approprié
      let reportContent: string;
      let metadata: any = {};

      switch (reportDef.serviceClass) {
        case 'IntelligentReportService':
          reportContent = await this.generateIntelligentReport(options);
          break;
        case 'PDFReportService':
          reportContent = await this.generatePDFReport(options);
          break;
        case 'UltimatePlanningService':
          reportContent = await this.generateProfessionalReport(options);
          break;
        case 'EmergencyPlanningService':
          reportContent = await this.generateEmergencyReport(options);
          break;
        default:
          reportContent = await this.generateBasicReport(options);
      }

      // Export si demandé
      let exportResult: ExportResult | undefined;
      if (options.exportOptions) {
        const title = options.customTitle || reportDef.name;
        exportResult = ReportExportService.exportToMarkdown(
          reportContent,
          title,
          reportDef.category,
          {
            ...options.exportOptions,
            userName: options.userName
          }
        );
      }

      // Métadonnées du rapport
      metadata = {
        ...ReportMetadataService.generateStandardMetadata('personal'),
        reportType: options.reportType,
        category: reportDef.category,
        estimatedReadingTime: reportDef.estimatedTime,
        features: reportDef.features
      };

      return {
        success: true,
        reportContent,
        exportResult,
        warnings: warnings.length > 0 ? warnings : undefined,
        metadata
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de la génération'
      };
    }
  }

  /**
   * Obtient les statistiques d'utilisation des rapports
   */
  static getUsageStats(userPlan: PlanType): {
    availableReports: number;
    totalReports: number;
    planUtilization: number;
    recommendedUpgrade?: PlanType;
  } {
    const availableReports = this.getAvailableReports(userPlan).length;
    const totalReports = Object.keys(this.REPORT_DEFINITIONS).length;
    const planUtilization = (availableReports / totalReports) * 100;

    let recommendedUpgrade: PlanType | undefined;
    if (userPlan === 'gratuit') recommendedUpgrade = 'professionnel';
    else if (userPlan === 'professionnel') recommendedUpgrade = 'expert';

    return {
      availableReports,
      totalReports,
      planUtilization: Math.round(planUtilization),
      recommendedUpgrade
    };
  }

  /**
   * Obtient les fonctionnalités manquantes pour un plan
   */
  static getMissingFeatures(userPlan: PlanType): {
    missingReports: ReportDefinition[];
    nextPlanBenefits: string[];
  } {
    const allReports = Object.values(this.REPORT_DEFINITIONS);
    const availableReports = this.getAvailableReports(userPlan);
    const missingReports = allReports.filter(
      report => !availableReports.some(available => available.id === report.id)
    );

    const nextPlanBenefits: string[] = [];
    if (userPlan === 'gratuit') {
      nextPlanBenefits.push(
        'Rapports professionnels pour consultations',
        'Analyses intelligentes avec recommandations',
        'Rapports PDF avec graphiques',
        'Optimisations SRG et RREGOP'
      );
    } else if (userPlan === 'professionnel') {
      nextPlanBenefits.push(
        'Analyse Monte Carlo (10 000 simulations)',
        'Planification successorale avancée',
        'Rapports pour notaires et avocats',
        'Simulations financières sophistiquées'
      );
    }

    return {
      missingReports,
      nextPlanBenefits
    };
  }

  // Méthodes privées pour la génération de rapports

  private static async generateIntelligentReport(options: ReportGenerationOptions): Promise<string> {
    // Simulation - à remplacer par l'appel au vrai service
    return `# Analyse Intelligente Personnalisée

## Résumé Exécutif
Votre situation financière a été analysée et des recommandations personnalisées ont été générées.

## Alertes Critiques
- Optimisation SRG possible : +5 000 $/an
- Stratégie REER/CELI à réviser

## Actions Prioritaires
1. Maximiser les cotisations CELI
2. Optimiser la séquence de décaissement
3. Planifier la demande SRG

## Calendrier de Mise en Œuvre
- **Immédiat** : Révision allocation CELI
- **3 mois** : Optimisation fiscale
- **6 mois** : Planification SRG

*Rapport généré par le service d'analyse intelligente*`;
  }

  private static async generatePDFReport(options: ReportGenerationOptions): Promise<string> {
    return `# Rapport PDF Visuel

## Métriques Clés
- Valeur nette actuelle : 500 000 $
- Capital de retraite nécessaire : 1 000 000 $
- Suffisance actuelle : 75%

## Graphiques Inclus
- Évolution de la valeur nette
- Répartition des actifs
- Projections de retraite
- Analyse Monte Carlo

## Plan d'Action Détaillé
1. Augmenter épargne mensuelle de 200 $
2. Rééquilibrer portefeuille
3. Optimiser stratégies fiscales

*Ce rapport sera généré en format PDF avec graphiques interactifs*`;
  }

  private static async generateProfessionalReport(options: ReportGenerationOptions): Promise<string> {
    const reportType = options.reportType;
    const professionalType = reportType.replace('professional_', '');
    
    return `# Rapport Professionnel - ${professionalType}

## Informations Client
- Données saisies par l'utilisateur sans validation
- Dernière mise à jour : ${new Date().toLocaleDateString('fr-CA')}

## Checklist de Vérification
- [ ] Vérifier l'exactitude des données
- [ ] Confirmer les objectifs
- [ ] Réviser les stratégies proposées

## Recommandations Spécialisées
Selon votre expertise en ${professionalType}, voici les points à examiner...

## Documents Requis
- Pièce d'identité
- Relevés financiers récents
- Documents légaux pertinents

*Rapport préparé pour consultation professionnelle*`;
  }

  private static async generateEmergencyReport(options: ReportGenerationOptions): Promise<string> {
    return `# Plan d'Urgence Complet

## Contacts d'Urgence
- Famille proche
- Médecin traitant
- Services d'urgence

## Informations Médicales
- Allergies et médicaments
- Conditions médicales
- Directives médicales

## Documents Importants
- Localisation des documents
- Codes d'accès
- Instructions spéciales

## Préférences Personnelles
- Souhaits funéraires
- Don d'organes
- Volontés particulières

*Document d'urgence pour vos proches*`;
  }

  private static async generateBasicReport(options: ReportGenerationOptions): Promise<string> {
    return `# Rapport de Base

## Analyse Financière Simple
Votre situation financière de base a été analysée.

## Recommandations Générales
- Maintenir un budget équilibré
- Épargner régulièrement
- Planifier pour la retraite

## Prochaines Étapes
1. Compléter vos informations
2. Considérer une mise à niveau de plan
3. Consulter un professionnel si nécessaire

*Rapport de base - Fonctionnalités limitées*`;
  }

  private static validateUserData(userData: any, reportType: ReportType): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validations de base
    if (!userData) {
      errors.push('Aucune donnée utilisateur fournie');
      return { isValid: false, errors, warnings };
    }

    // Validations spécifiques selon le type de rapport
    switch (reportType) {
      case 'retirement_comprehensive':
      case 'intelligent_analysis':
        if (!userData.personal?.salaire1) warnings.push('Salaire manquant pour optimisations');
        if (!userData.savings?.reer1) warnings.push('Données REER manquantes');
        break;
      
      case 'professional_fiscal':
        if (!userData.personal?.salaire1) errors.push('Salaire requis pour rapport fiscal');
        break;
      
      case 'monte_carlo':
        if (!userData.savings || !userData.personal) {
          errors.push('Données complètes requises pour analyse Monte Carlo');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
