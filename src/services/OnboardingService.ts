/**
 * Service d'Accompagnement - Phase 2 Modules Néophytes
 * Guide les nouveaux utilisateurs dans leur première utilisation
 * Système d'onboarding intelligent et progressif
 */

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  estimatedTime: number; // en minutes
  prerequisites?: string[];
  isCompleted: boolean;
  isOptional: boolean;
  category: 'essential' | 'recommended' | 'advanced';
  helpText?: string;
  videoUrl?: string;
  tips: string[];
}

export interface UserProfile {
  age: number;
  retirementAge: number;
  hasFinancialExperience: boolean;
  primaryGoal: 'budget' | 'savings' | 'retirement' | 'debt' | 'investment';
  timeAvailable: 'quick' | 'moderate' | 'thorough'; // 15min, 30min, 60min+
  preferredLearningStyle: 'visual' | 'reading' | 'interactive';
  hasPartner: boolean;
  hasChildren: boolean;
  employmentStatus: 'employed' | 'self-employed' | 'retired' | 'student';
}

export interface OnboardingPath {
  id: string;
  name: string;
  description: string;
  estimatedDuration: number;
  steps: OnboardingStep[];
  targetAudience: string;
}

export class OnboardingService {
  private static instance: OnboardingService;
  
  public static getInstance(): OnboardingService {
    if (!OnboardingService.instance) {
      OnboardingService.instance = new OnboardingService();
    }
    return OnboardingService.instance;
  }

  /**
   * Génère un parcours d'accompagnement personnalisé
   */
  public generatePersonalizedPath(profile: UserProfile): OnboardingPath {
    const baseSteps = this.getBaseSteps();
    const filteredSteps = this.filterStepsForProfile(baseSteps, profile);
    const orderedSteps = this.orderStepsByPriority(filteredSteps, profile);

    return {
      id: `path-${Date.now()}`,
      name: this.getPathName(profile),
      description: this.getPathDescription(profile),
      estimatedDuration: orderedSteps.reduce((total, step) => total + step.estimatedTime, 0),
      steps: orderedSteps,
      targetAudience: this.getTargetAudience(profile)
    };
  }

  /**
   * Étapes de base disponibles
   */
  private getBaseSteps(): OnboardingStep[] {
    return [
      {
        id: 'welcome',
        title: 'Bienvenue sur MonPlanRetraite.ca',
        description: 'Découvrez les fonctionnalités principales et la philosophie de sécurité de notre plateforme.',
        component: 'WelcomeStep',
        estimatedTime: 3,
        isCompleted: false,
        isOptional: false,
        category: 'essential',
        helpText: 'Cette étape vous familiarise avec l\'interface et les principes de sécurité.',
        tips: [
          'Toutes vos données restent sur votre appareil',
          'Aucune information n\'est transmise à nos serveurs',
          'Vous pouvez sauvegarder vos données localement'
        ]
      },
      {
        id: 'security-overview',
        title: 'Comprendre la sécurité de vos données',
        description: 'Apprenez comment vos informations financières sont protégées.',
        component: 'SecurityOverviewStep',
        estimatedTime: 5,
        isCompleted: false,
        isOptional: false,
        category: 'essential',
        helpText: 'La sécurité est notre priorité absolue. Comprenez nos mesures de protection.',
        tips: [
          'Chiffrement AES-256-GCM de niveau bancaire',
          'Calculs 100% locaux dans votre navigateur',
          'Aucun stockage sur serveurs externes'
        ]
      },
      {
        id: 'profile-setup',
        title: 'Configuration de votre profil',
        description: 'Renseignez vos informations de base pour des conseils personnalisés.',
        component: 'ProfileSetupStep',
        estimatedTime: 7,
        isCompleted: false,
        isOptional: false,
        category: 'essential',
        helpText: 'Ces informations permettent de personnaliser vos calculs et conseils.',
        tips: [
          'Soyez honnête pour des conseils précis',
          'Vous pouvez modifier ces informations à tout moment',
          'Plus d\'informations = conseils plus pertinents'
        ]
      },
      {
        id: 'budget-basics',
        title: 'Les bases du budget',
        description: 'Apprenez les principes fondamentaux de la budgétisation.',
        component: 'BudgetBasicsStep',
        estimatedTime: 10,
        isCompleted: false,
        isOptional: false,
        category: 'essential',
        helpText: 'Le budget est la fondation de toute planification financière.',
        videoUrl: '/videos/budget-basics.mp4',
        tips: [
          'Commencez par lister tous vos revenus',
          'Catégorisez vos dépenses (fixes vs variables)',
          'Visez un budget équilibré ou excédentaire'
        ]
      },
      {
        id: 'emergency-fund',
        title: 'Constituer un fonds d\'urgence',
        description: 'Comprenez l\'importance et comment créer votre coussin de sécurité.',
        component: 'EmergencyFundStep',
        estimatedTime: 8,
        isCompleted: false,
        isOptional: false,
        category: 'essential',
        helpText: 'Un fonds d\'urgence vous protège des imprévus financiers.',
        tips: [
          'Visez 3 mois de dépenses essentielles',
          'Gardez cet argent facilement accessible',
          'Constituez-le graduellement, même 25$/mois aide'
        ]
      },
      {
        id: 'savings-strategy',
        title: 'Stratégie d\'épargne',
        description: 'Découvrez comment épargner efficacement selon vos objectifs.',
        component: 'SavingsStrategyStep',
        estimatedTime: 12,
        isCompleted: false,
        isOptional: false,
        category: 'recommended',
        helpText: 'L\'épargne systématique est la clé de la réussite financière.',
        tips: [
          'Automatisez vos épargnes',
          'Commencez petit mais soyez constant',
          'Augmentez graduellement votre taux d\'épargne'
        ]
      },
      {
        id: 'registered-accounts',
        title: 'Comptes enregistrés (REER, CELI)',
        description: 'Comprenez les avantages fiscaux des comptes enregistrés.',
        component: 'RegisteredAccountsStep',
        estimatedTime: 15,
        isCompleted: false,
        isOptional: false,
        category: 'recommended',
        helpText: 'Les comptes enregistrés offrent des avantages fiscaux importants.',
        tips: [
          'CELI : croissance libre d\'impôt',
          'REER : déduction fiscale immédiate',
          'Maximisez vos cotisations selon votre situation'
        ]
      },
      {
        id: 'retirement-planning',
        title: 'Planification de la retraite',
        description: 'Apprenez les bases de la planification retraite.',
        component: 'RetirementPlanningStep',
        estimatedTime: 20,
        isCompleted: false,
        isOptional: false,
        category: 'recommended',
        helpText: 'Plus tôt vous commencez, plus facile sera votre retraite.',
        tips: [
          'Utilisez la règle du 4% comme point de départ',
          'Considérez l\'inflation dans vos calculs',
          'Diversifiez vos sources de revenus de retraite'
        ]
      },
      {
        id: 'investment-basics',
        title: 'Bases de l\'investissement',
        description: 'Introduction aux concepts d\'investissement pour débutants.',
        component: 'InvestmentBasicsStep',
        estimatedTime: 18,
        isCompleted: false,
        isOptional: true,
        category: 'advanced',
        helpText: 'L\'investissement peut accélérer l\'atteinte de vos objectifs.',
        tips: [
          'Commencez par comprendre votre tolérance au risque',
          'Diversifiez vos placements',
          'Investissez régulièrement (dollar cost averaging)'
        ]
      },
      {
        id: 'debt-management',
        title: 'Gestion des dettes',
        description: 'Stratégies pour gérer et réduire vos dettes efficacement.',
        component: 'DebtManagementStep',
        estimatedTime: 12,
        isCompleted: false,
        isOptional: true,
        category: 'recommended',
        prerequisites: ['budget-basics'],
        helpText: 'Réduire vos dettes libère de l\'argent pour vos objectifs.',
        tips: [
          'Listez toutes vos dettes avec taux d\'intérêt',
          'Priorisez les dettes à taux élevé',
          'Considérez la méthode boule de neige ou avalanche'
        ]
      },
      {
        id: 'tax-optimization',
        title: 'Optimisation fiscale de base',
        description: 'Stratégies simples pour réduire votre fardeau fiscal.',
        component: 'TaxOptimizationStep',
        estimatedTime: 15,
        isCompleted: false,
        isOptional: true,
        category: 'advanced',
        prerequisites: ['registered-accounts'],
        helpText: 'Payez votre juste part d\'impôt, pas plus.',
        tips: [
          'Maximisez vos déductions fiscales',
          'Planifiez le timing de vos revenus',
          'Utilisez les crédits d\'impôt disponibles'
        ]
      },
      {
        id: 'tools-overview',
        title: 'Tour des outils disponibles',
        description: 'Découvrez tous les calculateurs et outils à votre disposition.',
        component: 'ToolsOverviewStep',
        estimatedTime: 10,
        isCompleted: false,
        isOptional: false,
        category: 'essential',
        helpText: 'Familiarisez-vous avec nos outils pour maximiser leur utilité.',
        tips: [
          'Chaque outil a un objectif spécifique',
          'Commencez par les outils de base',
          'Sauvegardez régulièrement vos données'
        ]
      }
    ];
  }

  /**
   * Filtre les étapes selon le profil utilisateur
   */
  private filterStepsForProfile(steps: OnboardingStep[], profile: UserProfile): OnboardingStep[] {
    let filteredSteps = [...steps];

    // Filtrer selon l'expérience financière
    if (!profile.hasFinancialExperience) {
      // Inclure toutes les étapes essentielles et recommandées
      filteredSteps = filteredSteps.filter(step => 
        step.category === 'essential' || step.category === 'recommended'
      );
    }

    // Filtrer selon le temps disponible
    if (profile.timeAvailable === 'quick') {
      // Seulement les étapes essentielles courtes
      filteredSteps = filteredSteps.filter(step => 
        step.category === 'essential' && step.estimatedTime <= 10
      );
    } else if (profile.timeAvailable === 'moderate') {
      // Essentielles + quelques recommandées
      filteredSteps = filteredSteps.filter(step => 
        step.category === 'essential' || 
        (step.category === 'recommended' && step.estimatedTime <= 15)
      );
    }

    // Filtrer selon l'objectif principal
    if (profile.primaryGoal === 'debt') {
      // Inclure obligatoirement la gestion des dettes
      const debtStep = steps.find(s => s.id === 'debt-management');
      if (debtStep && !filteredSteps.includes(debtStep)) {
        filteredSteps.push(debtStep);
      }
    }

    if (profile.primaryGoal === 'retirement') {
      // Inclure obligatoirement la planification retraite
      const retirementStep = steps.find(s => s.id === 'retirement-planning');
      if (retirementStep && !filteredSteps.includes(retirementStep)) {
        filteredSteps.push(retirementStep);
      }
    }

    return filteredSteps;
  }

  /**
   * Ordonne les étapes par priorité selon le profil
   */
  private orderStepsByPriority(steps: OnboardingStep[], profile: UserProfile): OnboardingStep[] {
    const orderedSteps = [...steps];

    // Ordre de base : essential -> recommended -> advanced
    orderedSteps.sort((a, b) => {
      const categoryOrder = { essential: 0, recommended: 1, advanced: 2 };
      const categoryDiff = categoryOrder[a.category] - categoryOrder[b.category];
      
      if (categoryDiff !== 0) return categoryDiff;
      
      // Dans la même catégorie, trier par temps estimé (plus court en premier)
      return a.estimatedTime - b.estimatedTime;
    });

    // Ajustements selon l'objectif principal
    if (profile.primaryGoal === 'budget') {
      this.moveStepToPosition(orderedSteps, 'budget-basics', 3);
    } else if (profile.primaryGoal === 'retirement') {
      this.moveStepToPosition(orderedSteps, 'retirement-planning', 4);
    } else if (profile.primaryGoal === 'debt') {
      this.moveStepToPosition(orderedSteps, 'debt-management', 4);
    }

    return orderedSteps;
  }

  /**
   * Déplace une étape à une position spécifique
   */
  private moveStepToPosition(steps: OnboardingStep[], stepId: string, position: number): void {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    if (stepIndex !== -1) {
      const [step] = steps.splice(stepIndex, 1);
      steps.splice(Math.min(position, steps.length), 0, step);
    }
  }

  /**
   * Génère le nom du parcours selon le profil
   */
  private getPathName(profile: UserProfile): string {
    const goalNames = {
      budget: 'Maîtrise du Budget',
      savings: 'Stratégie d\'Épargne',
      retirement: 'Planification Retraite',
      debt: 'Liberté Financière',
      investment: 'Investissement Intelligent'
    };

    const experienceLevel = profile.hasFinancialExperience ? 'Intermédiaire' : 'Débutant';
    const goalName = goalNames[profile.primaryGoal] || 'Planification Complète';

    return `Parcours ${experienceLevel} - ${goalName}`;
  }

  /**
   * Génère la description du parcours
   */
  private getPathDescription(profile: UserProfile): string {
    const timeDescriptions = {
      quick: 'parcours express (15-20 minutes)',
      moderate: 'parcours équilibré (30-45 minutes)',
      thorough: 'parcours complet (60+ minutes)'
    };

    const goalDescriptions = {
      budget: 'pour maîtriser votre budget et contrôler vos dépenses',
      savings: 'pour développer une stratégie d\'épargne efficace',
      retirement: 'pour planifier sereinement votre retraite',
      debt: 'pour vous libérer de vos dettes et retrouver la liberté financière',
      investment: 'pour faire fructifier votre argent intelligemment'
    };

    const timeDesc = timeDescriptions[profile.timeAvailable];
    const goalDesc = goalDescriptions[profile.primaryGoal] || 'pour une planification financière complète';

    return `Un ${timeDesc} personnalisé ${goalDesc}. Adapté à votre niveau d'expérience et vos objectifs spécifiques.`;
  }

  /**
   * Détermine l'audience cible
   */
  private getTargetAudience(profile: UserProfile): string {
    const audiences = [];
    
    if (!profile.hasFinancialExperience) {
      audiences.push('débutants en finance');
    }
    
    if (profile.age < 35) {
      audiences.push('jeunes professionnels');
    } else if (profile.age >= 50) {
      audiences.push('pré-retraités');
    }
    
    if (profile.hasChildren) {
      audiences.push('parents');
    }
    
    if (profile.employmentStatus === 'self-employed') {
      audiences.push('travailleurs autonomes');
    }

    return audiences.length > 0 ? audiences.join(', ') : 'tous les utilisateurs';
  }

  /**
   * Marque une étape comme complétée
   */
  public completeStep(pathId: string, stepId: string): void {
    // Logique de sauvegarde locale
    const completedSteps = this.getCompletedSteps(pathId);
    completedSteps.add(stepId);
    localStorage.setItem(`onboarding-${pathId}`, JSON.stringify([...completedSteps]));
  }

  /**
   * Récupère les étapes complétées
   */
  public getCompletedSteps(pathId: string): Set<string> {
    const stored = localStorage.getItem(`onboarding-${pathId}`);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  }

  /**
   * Calcule le progrès du parcours
   */
  public calculateProgress(path: OnboardingPath): { completed: number; total: number; percentage: number } {
    const completedSteps = this.getCompletedSteps(path.id);
    const completed = path.steps.filter(step => completedSteps.has(step.id)).length;
    const total = path.steps.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  }

  /**
   * Obtient la prochaine étape à compléter
   */
  public getNextStep(path: OnboardingPath): OnboardingStep | null {
    const completedSteps = this.getCompletedSteps(path.id);
    
    for (const step of path.steps) {
      if (!completedSteps.has(step.id)) {
        // Vérifier les prérequis
        if (step.prerequisites) {
          const prerequisitesMet = step.prerequisites.every(prereq => completedSteps.has(prereq));
          if (!prerequisitesMet) continue;
        }
        return step;
      }
    }
    
    return null; // Toutes les étapes sont complétées
  }

  /**
   * Réinitialise le parcours
   */
  public resetPath(pathId: string): void {
    localStorage.removeItem(`onboarding-${pathId}`);
  }

  /**
   * Sauvegarde les préférences utilisateur
   */
  public saveUserProfile(profile: UserProfile): void {
    localStorage.setItem('user-profile', JSON.stringify(profile));
  }

  /**
   * Récupère les préférences utilisateur
   */
  public getUserProfile(): UserProfile | null {
    const stored = localStorage.getItem('user-profile');
    return stored ? JSON.parse(stored) : null;
  }
}

export default OnboardingService;
