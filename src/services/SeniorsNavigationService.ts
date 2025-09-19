/**
 * SeniorsNavigationService - Navigation Guidée Zéro Scroll
 * Service central pour gérer l'expérience seniors parfaite (50-90 ans)
 * UNE ÉTAPE = UN ÉCRAN | ZÉRO SCROLL | ASSISTANT PERMANENT
 */

import { UserData } from '@/types';

export interface GuidedStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  assistantMessage: string;
  assistantAvatar: string;
  actionRequired: 'input' | 'choice' | 'review' | 'calculation';
  currentProgress: number; // 0-100
  totalSteps: number;
  stepNumber: number;
  nextSteps: string[];
  previousStep?: string;
  isCompleted: boolean;
  isOptional: boolean;
  category: 'profile' | 'income' | 'expenses' | 'savings' | 'benefits' | 'summary';
  difficulty: 'facile' | 'moyen' | 'avance';
  requiredFields: string[];
  validationRules: ValidationRule[];
}

export interface ValidationRule {
  field: string;
  rule: 'required' | 'numeric' | 'date' | 'email' | 'phone';
  message: string;
  minValue?: number;
  maxValue?: number;
}

export interface AssistantMessage {
  id: string;
  type: 'welcome' | 'guidance' | 'warning' | 'success' | 'tip' | 'calculation';
  message: string;
  emoji: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionButtons?: AssistantAction[];
  learnMoreLink?: string;
  dismissible: boolean;
}

export interface AssistantAction {
  label: string;
  action: 'next' | 'previous' | 'skip' | 'explain' | 'calculate' | 'help';
  variant: 'primary' | 'secondary' | 'outline';
}

export interface NavigationContext {
  currentStep: GuidedStep;
  completedSteps: string[];
  availableSteps: string[];
  recommendedNextStep: string;
  progressPercentage: number;
  estimatedTimeRemaining: string;
  userProfile: 'debutant' | 'intermediaire' | 'avance';
  assistantPersonality: 'bienveillant' | 'professionnel' | 'educatif';
}

export class SeniorsNavigationService {
  
  // ===== CONFIGURATION DES ÉTAPES GUIDÉES =====
  
  private static readonly GUIDED_STEPS: Record<string, GuidedStep> = {
    
    // === ÉTAPE 1: ACCUEIL PERSONNALISÉ ===
    'welcome': {
      id: 'welcome',
      title: 'Bienvenue dans votre plan retraite',
      description: 'Créons ensemble votre plan de retraite personnalisé en quelques étapes simples',
      estimatedTime: '1 minute',
      assistantMessage: '👋 Bonjour ! Je suis votre assistant financier personnel. En 7 étapes simples, nous allons créer votre plan de retraite sur mesure. Prêt à commencer ?',
      assistantAvatar: '🤖',
      actionRequired: 'choice',
      currentProgress: 0,
      totalSteps: 7,
      stepNumber: 1,
      nextSteps: ['personal-profile'],
      isCompleted: false,
      isOptional: false,
      category: 'profile',
      difficulty: 'facile',
      requiredFields: [],
      validationRules: []
    },

    // === ÉTAPE 2: PROFIL PERSONNEL ===
    'personal-profile': {
      id: 'personal-profile',
      title: 'Parlez-moi de vous',
      description: 'Quelques informations de base pour personnaliser votre expérience',
      estimatedTime: '2 minutes',
      assistantMessage: '📝 Pour vous donner les meilleurs conseils, j\'ai besoin de vous connaître un peu. Ces informations restent 100% confidentielles.',
      assistantAvatar: '📝',
      actionRequired: 'input',
      currentProgress: 14,
      totalSteps: 7,
      stepNumber: 2,
      nextSteps: ['income-overview'],
      previousStep: 'welcome',
      isCompleted: false,
      isOptional: false,
      category: 'profile',
      difficulty: 'facile',
      requiredFields: ['prenom1', 'naissance1', 'province1'],
      validationRules: [
        { field: 'prenom1', rule: 'required', message: 'Votre prénom est requis' },
        { field: 'naissance1', rule: 'date', message: 'Date de naissance invalide' },
        { field: 'province1', rule: 'required', message: 'Votre province est requise' }
      ]
    },

    // === ÉTAPE 3: APERÇU DES REVENUS ===
    'income-overview': {
      id: 'income-overview',
      title: 'Vos revenus actuels',
      description: 'Découvrons vos sources de revenus principales',
      estimatedTime: '3 minutes',
      assistantMessage: '💰 Maintenant, parlons de vos revenus. Pas d\'inquiétude, nous procédons étape par étape !',
      assistantAvatar: '💰',
      actionRequired: 'input',
      currentProgress: 28,
      totalSteps: 7,
      stepNumber: 3,
      nextSteps: ['expenses-overview'],
      previousStep: 'personal-profile',
      isCompleted: false,
      isOptional: false,
      category: 'income',
      difficulty: 'facile',
      requiredFields: ['salaire1'],
      validationRules: [
        { field: 'salaire1', rule: 'numeric', message: 'Le salaire doit être un nombre', minValue: 0 }
      ]
    },

    // === ÉTAPE 4: APERÇU DES DÉPENSES ===
    'expenses-overview': {
      id: 'expenses-overview',
      title: 'Vos dépenses mensuelles',
      description: 'Estimons vos dépenses principales pour la retraite',
      estimatedTime: '3 minutes',
      assistantMessage: '🏠 Regardons maintenant vos dépenses. Cela nous aide à calculer vos besoins de retraite.',
      assistantAvatar: '🏠',
      actionRequired: 'input',
      currentProgress: 42,
      totalSteps: 7,
      stepNumber: 4,
      nextSteps: ['savings-overview'],
      previousStep: 'income-overview',
      isCompleted: false,
      isOptional: false,
      category: 'expenses',
      difficulty: 'facile',
      requiredFields: ['logement', 'alimentation', 'transport'],
      validationRules: [
        { field: 'logement', rule: 'numeric', message: 'Coût du logement requis', minValue: 0 },
        { field: 'alimentation', rule: 'numeric', message: 'Coût alimentation requis', minValue: 0 }
      ]
    },

    // === ÉTAPE 5: ÉPARGNES ET INVESTISSEMENTS ===
    'savings-overview': {
      id: 'savings-overview',
      title: 'Vos épargnes actuelles',
      description: 'REER, CELI et autres placements',
      estimatedTime: '2 minutes',
      assistantMessage: '🏦 Excellent ! Maintenant découvrons vos épargnes. Chaque dollar compte pour votre retraite.',
      assistantAvatar: '🏦',
      actionRequired: 'input',
      currentProgress: 56,
      totalSteps: 7,
      stepNumber: 5,
      nextSteps: ['benefits-check'],
      previousStep: 'expenses-overview',
      isCompleted: false,
      isOptional: false,
      category: 'savings',
      difficulty: 'facile',
      requiredFields: ['reer1', 'celi1'],
      validationRules: [
        { field: 'reer1', rule: 'numeric', message: 'Montant REER invalide', minValue: 0 },
        { field: 'celi1', rule: 'numeric', message: 'Montant CELI invalide', minValue: 0 }
      ]
    },

    // === ÉTAPE 6: PRESTATIONS GOUVERNEMENTALES ===
    'benefits-check': {
      id: 'benefits-check',
      title: 'Vos prestations gouvernementales',
      description: 'RRQ, Sécurité de la Vieillesse et autres prestations',
      estimatedTime: '2 minutes',
      assistantMessage: '🍁 Presque terminé ! Vérifions vos droits aux prestations gouvernementales du Canada.',
      assistantAvatar: '🍁',
      actionRequired: 'review',
      currentProgress: 70,
      totalSteps: 7,
      stepNumber: 6,
      nextSteps: ['final-summary'],
      previousStep: 'savings-overview',
      isCompleted: false,
      isOptional: false,
      category: 'benefits',
      difficulty: 'moyen',
      requiredFields: [],
      validationRules: []
    },

    // === ÉTAPE 7: RÉSUMÉ ET RECOMMANDATIONS ===
    'final-summary': {
      id: 'final-summary',
      title: 'Votre plan de retraite personnalisé',
      description: 'Résumé complet avec recommandations et règle du 4%',
      estimatedTime: '5 minutes',
      assistantMessage: '🎉 Bravo ! Voici votre plan de retraite complet avec mes recommandations personnalisées.',
      assistantAvatar: '🎉',
      actionRequired: 'review',
      currentProgress: 100,
      totalSteps: 7,
      stepNumber: 7,
      nextSteps: [],
      previousStep: 'benefits-check',
      isCompleted: false,
      isOptional: false,
      category: 'summary',
      difficulty: 'moyen',
      requiredFields: [],
      validationRules: []
    }
  };

  // ===== MÉTHODES PRINCIPALES =====

  /**
   * Obtenir l'étape actuelle basée sur les données utilisateur
   */
  static getCurrentStep(userData: UserData): GuidedStep {
    // Logique pour déterminer l'étape actuelle
    if (!userData.personal?.prenom1) {
      return this.GUIDED_STEPS['welcome'];
    }
    if (!userData.personal?.salaire1) {
      return this.GUIDED_STEPS['personal-profile'];
    }
    if (!userData.cashflow?.logement) {
      return this.GUIDED_STEPS['income-overview'];
    }
    if (!userData.savings?.reer1 && userData.savings?.reer1 !== 0) {
      return this.GUIDED_STEPS['expenses-overview'];
    }
    if (!userData.retirement?.rrqMontantActuel1) {
      return this.GUIDED_STEPS['savings-overview'];
    }
    
    return this.GUIDED_STEPS['benefits-check'];
  }

  /**
   * Obtenir le contexte de navigation complet
   */
  static getNavigationContext(userData: UserData): NavigationContext {
    const currentStep = this.getCurrentStep(userData);
    const completedSteps = this.getCompletedSteps(userData);
    const progressPercentage = (completedSteps.length / Object.keys(this.GUIDED_STEPS).length) * 100;
    
    return {
      currentStep,
      completedSteps,
      availableSteps: Object.keys(this.GUIDED_STEPS),
      recommendedNextStep: currentStep.nextSteps[0] || '',
      progressPercentage: Math.round(progressPercentage),
      estimatedTimeRemaining: this.calculateRemainingTime(completedSteps),
      userProfile: this.detectUserProfile(userData),
      assistantPersonality: 'bienveillant'
    };
  }

  /**
   * Obtenir les étapes complétées
   */
  private static getCompletedSteps(userData: UserData): string[] {
    const completed: string[] = [];
    
    if (userData.personal?.prenom1) completed.push('welcome');
    if (userData.personal?.salaire1) completed.push('personal-profile');
    if (userData.cashflow?.logement) completed.push('income-overview');
    if (userData.savings?.reer1 !== undefined) completed.push('expenses-overview');
    if (userData.retirement?.rrqMontantActuel1) completed.push('savings-overview');
    
    return completed;
  }

  /**
   * Calculer le temps restant estimé
   */
  private static calculateRemainingTime(completedSteps: string[]): string {
    const totalSteps = Object.keys(this.GUIDED_STEPS).length;
    const remainingSteps = totalSteps - completedSteps.length;
    const avgTimePerStep = 3; // minutes
    
    const totalMinutes = remainingSteps * avgTimePerStep;
    
    if (totalMinutes < 5) return '< 5 minutes';
    if (totalMinutes < 10) return '5-10 minutes';
    return `${totalMinutes} minutes`;
  }

  /**
   * Détecter le profil utilisateur
   */
  private static detectUserProfile(userData: UserData): 'debutant' | 'intermediaire' | 'avance' {
    const hasMultipleSources = (userData.personal?.unifiedIncome1?.length || 0) > 2;
    const hasInvestments = (userData.savings?.reer1 || 0) > 50000;
    const hasComplexSituation = userData.personal?.seasonalJobs1?.length || userData.retirement?.rregopMembre1;
    
    if (hasComplexSituation || hasInvestments) return 'avance';
    if (hasMultipleSources) return 'intermediaire';
    return 'debutant';
  }

  /**
   * Obtenir le message de l'assistant contextualisé
   */
  static getContextualAssistantMessage(step: GuidedStep, userData: UserData): AssistantMessage {
    const baseMessage = step.assistantMessage;
    
    // Personnaliser selon le profil
    const userProfile = this.detectUserProfile(userData);
    const userName = userData.personal?.prenom1 || '';
    
    let personalizedMessage = baseMessage;
    if (userName) {
      personalizedMessage = personalizedMessage.replace('Bonjour !', `Bonjour ${userName} !`);
    }
    
    return {
      id: `${step.id}-message`,
      type: step.stepNumber === 1 ? 'welcome' : 'guidance',
      message: personalizedMessage,
      emoji: step.assistantAvatar,
      priority: 'medium',
      actionButtons: this.getAssistantActions(step),
      dismissible: false
    };
  }

  /**
   * Obtenir les actions de l'assistant
   */
  private static getAssistantActions(step: GuidedStep): AssistantAction[] {
    const actions: AssistantAction[] = [];
    
    if (step.previousStep) {
      actions.push({
        label: '← Précédent',
        action: 'previous',
        variant: 'outline'
      });
    }
    
    if (step.nextSteps.length > 0) {
      actions.push({
        label: 'Continuer →',
        action: 'next',
        variant: 'primary'
      });
    }
    
    if (step.isOptional) {
      actions.push({
        label: 'Passer',
        action: 'skip',
        variant: 'secondary'
      });
    }
    
    return actions;
  }

  /**
   * Valider les données d'une étape
   */
  static validateStep(stepId: string, userData: UserData): { isValid: boolean; errors: string[] } {
    const step = this.GUIDED_STEPS[stepId];
    if (!step) return { isValid: false, errors: ['Étape introuvable'] };
    
    const errors: string[] = [];
    
    step.validationRules.forEach(rule => {
      const value = this.getFieldValue(userData, rule.field);
      
      switch (rule.rule) {
        case 'required':
          if (!value || value === '' || value === null || value === undefined) {
            errors.push(rule.message);
          }
          break;
        case 'numeric':
          if (value !== undefined && value !== null && value !== '' && isNaN(Number(value))) {
            errors.push(rule.message);
          }
          if (rule.minValue !== undefined && Number(value) < rule.minValue) {
            errors.push(`${rule.field} doit être au moins ${rule.minValue}`);
          }
          if (rule.maxValue !== undefined && Number(value) > rule.maxValue) {
            errors.push(`${rule.field} ne peut pas dépasser ${rule.maxValue}`);
          }
          break;
        case 'date':
          if (value && isNaN(Date.parse(value))) {
            errors.push(rule.message);
          }
          break;
      }
    });
    
    return { isValid: errors.length === 0, errors };
  }

  /**
   * Obtenir la valeur d'un champ dans userData
   */
  private static getFieldValue(userData: UserData, fieldPath: string): any {
    const parts = fieldPath.split('.');
    let current: any = userData;
    
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Essayer dans les sections principales
        if (userData.personal && part in userData.personal) return userData.personal[part];
        if (userData.cashflow && part in userData.cashflow) return userData.cashflow[part];
        if (userData.savings && part in userData.savings) return userData.savings[part];
        if (userData.retirement && part in userData.retirement) return userData.retirement[part];
        return undefined;
      }
    }
    
    return current;
  }
}