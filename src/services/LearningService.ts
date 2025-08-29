/**
 * Service d'Apprentissage - Phase 5 Modules Néophytes
 * Système éducatif interactif basé sur l'expertise Retraite101
 * Modules d'apprentissage progressifs avec quiz et validation
 */

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: 'budget' | 'savings' | 'investment' | 'retirement' | 'debt' | 'tax' | 'insurance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // en minutes
  prerequisites: string[];
  objectives: string[];
  content: LearningContent[];
  quiz: Quiz;
  isCompleted: boolean;
  completedAt?: Date;
  score?: number;
  attempts: number;
  maxAttempts: number;
  certificate?: Certificate;
}

export interface LearningContent {
  id: string;
  type: 'text' | 'video' | 'interactive' | 'example' | 'tip' | 'warning';
  title?: string;
  content: string;
  mediaUrl?: string;
  interactiveComponent?: string;
  order: number;
}

export interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number; // pourcentage requis pour réussir
  timeLimit?: number; // en minutes
  allowRetake: boolean;
  showCorrectAnswers: boolean;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'calculation' | 'scenario';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface Certificate {
  id: string;
  moduleId: string;
  userId: string;
  title: string;
  issuedAt: Date;
  score: number;
  validUntil?: Date;
  credentialId: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: string[]; // IDs des modules dans l'ordre
  estimatedDuration: number;
  targetAudience: string;
  completionReward: {
    points: number;
    badge: string;
    certificate: boolean;
  };
}

export interface UserProgress {
  moduleId: string;
  progress: number; // 0-100
  currentContentIndex: number;
  timeSpent: number; // en minutes
  lastAccessed: Date;
  bookmarks: string[]; // IDs du contenu marqué
  notes: Note[];
}

export interface Note {
  id: string;
  contentId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export class LearningService {
  private static instance: LearningService;
  
  public static getInstance(): LearningService {
    if (!LearningService.instance) {
      LearningService.instance = new LearningService();
    }
    return LearningService.instance;
  }

  /**
   * Obtient tous les modules d'apprentissage disponibles
   */
  public getAllModules(): LearningModule[] {
    return [
      {
        id: 'budget-fundamentals',
        title: 'Les Fondamentaux du Budget',
        description: 'Apprenez à créer et gérer un budget personnel efficace',
        category: 'budget',
        difficulty: 'beginner',
        estimatedTime: 30,
        prerequisites: [],
        objectives: [
          'Comprendre l\'importance du budget',
          'Identifier ses revenus et dépenses',
          'Créer un budget équilibré',
          'Suivre et ajuster son budget'
        ],
        content: this.getBudgetFundamentalsContent(),
        quiz: this.getBudgetFundamentalsQuiz(),
        isCompleted: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: 'emergency-fund-mastery',
        title: 'Maîtrise du Fonds d\'Urgence',
        description: 'Constituez et gérez votre coussin de sécurité financière',
        category: 'savings',
        difficulty: 'beginner',
        estimatedTime: 25,
        prerequisites: ['budget-fundamentals'],
        objectives: [
          'Comprendre l\'utilité du fonds d\'urgence',
          'Calculer le montant nécessaire',
          'Stratégies pour constituer le fonds',
          'Où placer son fonds d\'urgence'
        ],
        content: this.getEmergencyFundContent(),
        quiz: this.getEmergencyFundQuiz(),
        isCompleted: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: 'retirement-planning-101',
        title: 'Planification Retraite 101',
        description: 'Les bases essentielles pour planifier votre retraite',
        category: 'retirement',
        difficulty: 'intermediate',
        estimatedTime: 45,
        prerequisites: ['budget-fundamentals', 'emergency-fund-mastery'],
        objectives: [
          'Comprendre la règle du 4%',
          'Calculer ses besoins de retraite',
          'Optimiser REER et CELI',
          'Stratégies de décaissement'
        ],
        content: this.getRetirementPlanningContent(),
        quiz: this.getRetirementPlanningQuiz(),
        isCompleted: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: 'investment-basics',
        title: 'Bases de l\'Investissement',
        description: 'Introduction aux concepts d\'investissement pour débutants',
        category: 'investment',
        difficulty: 'intermediate',
        estimatedTime: 40,
        prerequisites: ['emergency-fund-mastery'],
        objectives: [
          'Comprendre les types de placements',
          'Évaluer sa tolérance au risque',
          'Diversification de portefeuille',
          'Frais et fiscalité des placements'
        ],
        content: this.getInvestmentBasicsContent(),
        quiz: this.getInvestmentBasicsQuiz(),
        isCompleted: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: 'debt-elimination',
        title: 'Élimination Stratégique des Dettes',
        description: 'Méthodes éprouvées pour se libérer de ses dettes',
        category: 'debt',
        difficulty: 'intermediate',
        estimatedTime: 35,
        prerequisites: ['budget-fundamentals'],
        objectives: [
          'Inventaire complet des dettes',
          'Méthodes boule de neige vs avalanche',
          'Négociation avec les créanciers',
          'Prévention du réendettement'
        ],
        content: this.getDebtEliminationContent(),
        quiz: this.getDebtEliminationQuiz(),
        isCompleted: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: 'tax-optimization',
        title: 'Optimisation Fiscale Personnelle',
        description: 'Stratégies légales pour réduire votre fardeau fiscal',
        category: 'tax',
        difficulty: 'advanced',
        estimatedTime: 50,
        prerequisites: ['retirement-planning-101', 'investment-basics'],
        objectives: [
          'Comprendre le système fiscal canadien',
          'Maximiser les déductions et crédits',
          'Planification fiscale à long terme',
          'Fractionnement de revenus'
        ],
        content: this.getTaxOptimizationContent(),
        quiz: this.getTaxOptimizationQuiz(),
        isCompleted: false,
        attempts: 0,
        maxAttempts: 3
      }
    ];
  }

  /**
   * Contenu du module Budget Fundamentals
   */
  private getBudgetFundamentalsContent(): LearningContent[] {
    return [
      {
        id: 'budget-intro',
        type: 'text',
        title: 'Qu\'est-ce qu\'un budget ?',
        content: 'Un budget est un plan financier qui compare vos revenus à vos dépenses sur une période donnée. C\'est l\'outil fondamental de toute planification financière réussie.',
        order: 1
      },
      {
        id: 'budget-importance',
        type: 'tip',
        title: 'Pourquoi budgéter ?',
        content: '💡 Un budget vous permet de : contrôler vos dépenses, identifier les fuites financières, planifier vos objectifs, réduire le stress financier.',
        order: 2
      },
      {
        id: 'budget-categories',
        type: 'interactive',
        title: 'Catégories de dépenses',
        content: 'Apprenez à classer vos dépenses en catégories : fixes (loyer, assurances), variables (alimentation, loisirs), et épargne.',
        interactiveComponent: 'ExpenseCategorizer',
        order: 3
      },
      {
        id: 'budget-example',
        type: 'example',
        title: 'Exemple concret',
        content: 'Marie, 28 ans, gagne 4000$/mois. Ses dépenses fixes : 2200$, variables : 1200$, épargne : 600$. Son budget est équilibré avec 15% d\'épargne.',
        order: 4
      },
      {
        id: 'budget-tools',
        type: 'text',
        title: 'Outils de budgétisation',
        content: 'Utilisez notre calculateur de budget Excel, des applications mobiles, ou la méthode 50-20-30 pour structurer vos finances.',
        order: 5
      },
      {
        id: 'budget-warning',
        type: 'warning',
        title: 'Erreurs courantes',
        content: '⚠️ Évitez ces pièges : sous-estimer les dépenses variables, oublier les dépenses annuelles, ne pas prévoir d\'imprévus.',
        order: 6
      }
    ];
  }

  /**
   * Quiz du module Budget Fundamentals
   */
  private getBudgetFundamentalsQuiz(): Quiz {
    return {
      id: 'budget-fundamentals-quiz',
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'Quel pourcentage minimum de vos revenus devriez-vous épargner ?',
          options: ['5%', '10%', '15%', '20%'],
          correctAnswer: '10%',
          explanation: 'La règle générale recommande d\'épargner au moins 10% de ses revenus nets pour assurer sa sécurité financière.',
          points: 10,
          difficulty: 'easy',
          category: 'savings'
        },
        {
          id: 'q2',
          type: 'true-false',
          question: 'Les dépenses de loisirs sont considérées comme des dépenses fixes.',
          options: ['Vrai', 'Faux'],
          correctAnswer: 'Faux',
          explanation: 'Les dépenses de loisirs sont variables car elles peuvent être ajustées selon votre situation financière.',
          points: 10,
          difficulty: 'easy',
          category: 'budget'
        },
        {
          id: 'q3',
          type: 'calculation',
          question: 'Si vos revenus sont de 5000$ et vos dépenses de 4200$, quel est votre taux d\'épargne ?',
          correctAnswer: 16,
          explanation: 'Taux d\'épargne = (5000 - 4200) / 5000 × 100 = 16%',
          points: 15,
          difficulty: 'medium',
          category: 'calculation'
        },
        {
          id: 'q4',
          type: 'scenario',
          question: 'Jean dépense 3500$/mois mais gagne 3200$. Quelle devrait être sa priorité ?',
          options: [
            'Investir dans des actions',
            'Réduire ses dépenses immédiatement',
            'Contracter un prêt',
            'Ignorer le problème'
          ],
          correctAnswer: 'Réduire ses dépenses immédiatement',
          explanation: 'Avec un budget déficitaire, la priorité absolue est d\'équilibrer le budget en réduisant les dépenses ou augmentant les revenus.',
          points: 15,
          difficulty: 'medium',
          category: 'problem-solving'
        }
      ],
      passingScore: 70,
      timeLimit: 15,
      allowRetake: true,
      showCorrectAnswers: true
    };
  }

  /**
   * Contenu du module Emergency Fund
   */
  private getEmergencyFundContent(): LearningContent[] {
    return [
      {
        id: 'emergency-definition',
        type: 'text',
        title: 'Qu\'est-ce qu\'un fonds d\'urgence ?',
        content: 'Un fonds d\'urgence est une réserve d\'argent facilement accessible pour faire face aux imprévus : perte d\'emploi, réparations majeures, urgences médicales.',
        order: 1
      },
      {
        id: 'emergency-amount',
        type: 'interactive',
        title: 'Combien épargner ?',
        content: 'La règle générale : 3 à 6 mois de dépenses essentielles. Calculez votre montant idéal selon votre situation.',
        interactiveComponent: 'EmergencyFundCalculator',
        order: 2
      },
      {
        id: 'emergency-strategies',
        type: 'text',
        title: 'Stratégies de constitution',
        content: 'Commencez petit (500$), automatisez vos épargnes, utilisez les remboursements d\'impôt, vendez des objets inutiles.',
        order: 3
      },
      {
        id: 'emergency-placement',
        type: 'tip',
        title: 'Où placer votre fonds ?',
        content: '💡 Compte épargne à taux élevé, certificat de placement garanti à court terme, ou compte du marché monétaire. Privilégiez l\'accessibilité.',
        order: 4
      }
    ];
  }

  /**
   * Quiz du module Emergency Fund
   */
  private getEmergencyFundQuiz(): Quiz {
    return {
      id: 'emergency-fund-quiz',
      questions: [
        {
          id: 'ef-q1',
          type: 'multiple-choice',
          question: 'Combien de mois de dépenses devrait représenter votre fonds d\'urgence ?',
          options: ['1-2 mois', '3-6 mois', '12 mois', '24 mois'],
          correctAnswer: '3-6 mois',
          explanation: 'Un fonds d\'urgence de 3 à 6 mois de dépenses offre une protection adéquate contre la plupart des imprévus.',
          points: 10,
          difficulty: 'easy',
          category: 'emergency'
        }
      ],
      passingScore: 70,
      allowRetake: true,
      showCorrectAnswers: true
    };
  }

  // Méthodes similaires pour les autres modules...
  private getRetirementPlanningContent(): LearningContent[] { return []; }
  private getRetirementPlanningQuiz(): Quiz { return { id: '', questions: [], passingScore: 70, allowRetake: true, showCorrectAnswers: true }; }
  private getInvestmentBasicsContent(): LearningContent[] { return []; }
  private getInvestmentBasicsQuiz(): Quiz { return { id: '', questions: [], passingScore: 70, allowRetake: true, showCorrectAnswers: true }; }
  private getDebtEliminationContent(): LearningContent[] { return []; }
  private getDebtEliminationQuiz(): Quiz { return { id: '', questions: [], passingScore: 70, allowRetake: true, showCorrectAnswers: true }; }
  private getTaxOptimizationContent(): LearningContent[] { return []; }
  private getTaxOptimizationQuiz(): Quiz { return { id: '', questions: [], passingScore: 70, allowRetake: true, showCorrectAnswers: true }; }

  /**
   * Obtient les parcours d'apprentissage disponibles
   */
  public getLearningPaths(): LearningPath[] {
    return [
      {
        id: 'beginner-path',
        title: 'Parcours Débutant',
        description: 'Maîtrisez les bases de la planification financière',
        modules: ['budget-fundamentals', 'emergency-fund-mastery'],
        estimatedDuration: 55,
        targetAudience: 'Débutants en finance personnelle',
        completionReward: {
          points: 200,
          badge: 'Fondations Solides',
          certificate: true
        }
      },
      {
        id: 'intermediate-path',
        title: 'Parcours Intermédiaire',
        description: 'Développez vos compétences en investissement et retraite',
        modules: ['retirement-planning-101', 'investment-basics', 'debt-elimination'],
        estimatedDuration: 120,
        targetAudience: 'Personnes avec bases financières',
        completionReward: {
          points: 400,
          badge: 'Planificateur Avisé',
          certificate: true
        }
      },
      {
        id: 'advanced-path',
        title: 'Parcours Avancé',
        description: 'Optimisation fiscale et stratégies avancées',
        modules: ['tax-optimization'],
        estimatedDuration: 50,
        targetAudience: 'Investisseurs expérimentés',
        completionReward: {
          points: 300,
          badge: 'Expert Fiscal',
          certificate: true
        }
      }
    ];
  }

  /**
   * Obtient le progrès utilisateur pour un module
   */
  public getUserProgress(moduleId: string): UserProgress | null {
    const stored = localStorage.getItem(`progress-${moduleId}`);
    if (!stored) return null;
    
    const progress = JSON.parse(stored);
    return {
      ...progress,
      lastAccessed: new Date(progress.lastAccessed)
    };
  }

  /**
   * Met à jour le progrès utilisateur
   */
  public updateProgress(moduleId: string, contentIndex: number, timeSpent: number): void {
    const progress = this.getUserProgress(moduleId) || {
      moduleId,
      progress: 0,
      currentContentIndex: 0,
      timeSpent: 0,
      lastAccessed: new Date(),
      bookmarks: [],
      notes: []
    };

    const module = this.getAllModules().find(m => m.id === moduleId);
    if (!module) return;

    progress.currentContentIndex = Math.max(progress.currentContentIndex, contentIndex);
    progress.timeSpent += timeSpent;
    progress.lastAccessed = new Date();
    progress.progress = Math.round((progress.currentContentIndex / module.content.length) * 100);

    localStorage.setItem(`progress-${moduleId}`, JSON.stringify(progress));
  }

  /**
   * Soumet un quiz et calcule le score
   */
  public submitQuiz(moduleId: string, answers: Record<string, any>): { 
    score: number; 
    passed: boolean; 
    results: any[]; 
    certificate?: Certificate 
  } {
    const module = this.getAllModules().find(m => m.id === moduleId);
    if (!module) throw new Error('Module not found');

    const quiz = module.quiz;
    let totalPoints = 0;
    let earnedPoints = 0;
    const results: any[] = [];

    quiz.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        earnedPoints += question.points;
      }

      results.push({
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        points: isCorrect ? question.points : 0
      });
    });

    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= quiz.passingScore;

    // Sauvegarder le résultat
    this.saveQuizResult(moduleId, score, passed);

    // Générer un certificat si réussi
    let certificate: Certificate | undefined;
    if (passed) {
      certificate = this.generateCertificate(moduleId, score);
    }

    return { score, passed, results, certificate };
  }

  /**
   * Sauvegarde le résultat d'un quiz
   */
  private saveQuizResult(moduleId: string, score: number, passed: boolean): void {
    const results = this.getQuizResults();
    results[moduleId] = {
      score,
      passed,
      completedAt: new Date().toISOString(),
      attempts: (results[moduleId]?.attempts || 0) + 1
    };
    localStorage.setItem('quiz-results', JSON.stringify(results));
  }

  /**
   * Obtient les résultats de quiz
   */
  public getQuizResults(): Record<string, any> {
    const stored = localStorage.getItem('quiz-results');
    return stored ? JSON.parse(stored) : {};
  }

  /**
   * Génère un certificat
   */
  private generateCertificate(moduleId: string, score: number): Certificate {
    const module = this.getAllModules().find(m => m.id === moduleId);
    if (!module) throw new Error('Module not found');

    const certificate: Certificate = {
      id: `cert-${moduleId}-${Date.now()}`,
      moduleId,
      userId: 'current-user', // Dans une vraie app, ceci viendrait de l'auth
      title: `Certificat de réussite - ${module.title}`,
      issuedAt: new Date(),
      score,
      credentialId: this.generateCredentialId()
    };

    // Sauvegarder le certificat
    const certificates = this.getUserCertificates();
    certificates.push(certificate);
    localStorage.setItem('user-certificates', JSON.stringify(certificates));

    return certificate;
  }

  /**
   * Génère un ID de credential unique
   */
  private generateCredentialId(): string {
    return 'MPR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  /**
   * Obtient les certificats de l'utilisateur
   */
  public getUserCertificates(): Certificate[] {
    const stored = localStorage.getItem('user-certificates');
    if (!stored) return [];
    
    return JSON.parse(stored).map((cert: any) => ({
      ...cert,
      issuedAt: new Date(cert.issuedAt),
      validUntil: cert.validUntil ? new Date(cert.validUntil) : undefined
    }));
  }

  /**
   * Ajoute un signet
   */
  public addBookmark(moduleId: string, contentId: string): void {
    const progress = this.getUserProgress(moduleId);
    if (!progress) return;

    if (!progress.bookmarks.includes(contentId)) {
      progress.bookmarks.push(contentId);
      localStorage.setItem(`progress-${moduleId}`, JSON.stringify(progress));
    }
  }

  /**
   * Ajoute une note
   */
  public addNote(moduleId: string, contentId: string, text: string): void {
    const progress = this.getUserProgress(moduleId);
    if (!progress) return;

    const note: Note = {
      id: Date.now().toString(),
      contentId,
      text,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    progress.notes.push(note);
    localStorage.setItem(`progress-${moduleId}`, JSON.stringify(progress));
  }

  /**
   * Obtient les statistiques d'apprentissage
   */
  public getLearningStats(): {
    modulesCompleted: number;
    totalModules: number;
    certificatesEarned: number;
    totalTimeSpent: number;
    averageScore: number;
  } {
    const modules = this.getAllModules();
    const quizResults = this.getQuizResults();
    const certificates = this.getUserCertificates();

    const completedModules = Object.keys(quizResults).filter(moduleId => quizResults[moduleId].passed);
    const totalTimeSpent = modules.reduce((total, module) => {
      const progress = this.getUserProgress(module.id);
      return total + (progress?.timeSpent || 0);
    }, 0);

    const scores = Object.values(quizResults).map((result: any) => result.score).filter(Boolean);
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    return {
      modulesCompleted: completedModules.length,
      totalModules: modules.length,
      certificatesEarned: certificates.length,
      totalTimeSpent,
      averageScore: Math.round(averageScore)
    };
  }

  /**
   * Réinitialise les données d'apprentissage
   */
  public resetLearningData(): void {
    const modules = this.getAllModules();
    modules.forEach(module => {
      localStorage.removeItem(`progress-${module.id}`);
    });
    localStorage.removeItem('quiz-results');
    localStorage.removeItem('user-certificates');
  }
}

export default LearningService;
