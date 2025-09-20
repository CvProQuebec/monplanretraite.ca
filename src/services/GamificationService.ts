/**
 * Service de Gamification - Phase 4 Modules Néophytes
 * Système de motivation et récompenses pour encourager les bonnes habitudes financières
 * Badges, défis et progression pour maintenir l'engagement utilisateur
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'budget' | 'savings' | 'investment' | 'retirement' | 'debt' | 'learning' | 'milestone';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  unlockedAt?: Date;
  progress: number; // 0-100
  maxProgress: number;
  requirements: string[];
  reward?: string;
  isSecret?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: Achievement['category'];
  duration: number; // en jours
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isCompleted: boolean;
  progress: number;
  target: number;
  reward: {
    points: number;
    badge?: string;
    title?: string;
  };
  participants: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserStats {
  totalPoints: number;
  level: number;
  experiencePoints: number;
  experienceToNextLevel: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  currentStreak: number;
  longestStreak: number;
  completedChallenges: number;
  rank: string;
  joinDate: Date;
  lastActivity: Date;
}

export interface LevelInfo {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
  icon: string;
  color: string;
}

export class GamificationService {
  private static instance: GamificationService;
  
  public static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  /**
   * Obtient les statistiques utilisateur
   */
  public getUserStats(): UserStats {
    const stored = localStorage.getItem('user-stats');
    if (stored) {
      const stats = JSON.parse(stored);
      return {
        ...stats,
        joinDate: new Date(stats.joinDate),
        lastActivity: new Date(stats.lastActivity)
      };
    }

    // Statistiques par défaut pour un nouvel utilisateur
    const defaultStats: UserStats = {
      totalPoints: 0,
      level: 1,
      experiencePoints: 0,
      experienceToNextLevel: 100,
      achievementsUnlocked: 0,
      totalAchievements: this.getAllAchievements().length,
      currentStreak: 0,
      longestStreak: 0,
      completedChallenges: 0,
      rank: 'Débutant',
      joinDate: new Date(),
      lastActivity: new Date()
    };

    this.saveUserStats(defaultStats);
    return defaultStats;
  }

  /**
   * Sauvegarde les statistiques utilisateur
   */
  private saveUserStats(stats: UserStats): void {
    localStorage.setItem('user-stats', JSON.stringify(stats));
  }

  /**
   * Ajoute des points et vérifie les montées de niveau
   */
  public addPoints(points: number, reason: string): { levelUp: boolean; newLevel?: number; newTitle?: string } {
    const stats = this.getUserStats();
    stats.totalPoints += points;
    stats.experiencePoints += points;
    stats.lastActivity = new Date();

    // Vérifier montée de niveau
    const currentLevelInfo = this.getLevelInfo(stats.level);
    let levelUp = false;
    let newLevel = stats.level;
    let newTitle = currentLevelInfo.title;

    if (stats.totalPoints >= currentLevelInfo.maxPoints) {
      const nextLevel = this.getLevelInfo(stats.level + 1);
      if (nextLevel) {
        levelUp = true;
        newLevel = nextLevel.level;
        newTitle = nextLevel.title;
        stats.level = newLevel;
        stats.rank = newTitle;
        stats.experiencePoints = stats.totalPoints - nextLevel.minPoints;
        stats.experienceToNextLevel = nextLevel.maxPoints - stats.totalPoints;
      }
    } else {
      stats.experienceToNextLevel = currentLevelInfo.maxPoints - stats.totalPoints;
    }

    this.saveUserStats(stats);
    this.logActivity('points_earned', { points, reason });

    return { levelUp, newLevel: levelUp ? newLevel : undefined, newTitle: levelUp ? newTitle : undefined };
  }

  /**
   * Obtient les informations de niveau
   */
  public getLevelInfo(level: number): LevelInfo {
    const levels: LevelInfo[] = [
      {
        level: 1,
        title: 'Débutant',
        minPoints: 0,
        maxPoints: 99,
        benefits: ['Accès aux outils de base', 'Guide d\'introduction'],
        icon: '🌱',
        color: '#10B981'
      },
      {
        level: 2,
        title: 'Apprenti Financier',
        minPoints: 100,
        maxPoints: 299,
        benefits: ['Calculateurs avancés', 'Conseils personnalisés'],
        icon: '📚',
        color: '#3B82F6'
      },
      {
        level: 3,
        title: 'Gestionnaire Avisé',
        minPoints: 300,
        maxPoints: 599,
        benefits: ['Analyses détaillées', 'Projections long terme'],
        icon: '💼',
        color: '#8B5CF6'
      },
      {
        level: 4,
        title: 'Planificateur Expert',
        minPoints: 600,
        maxPoints: 999,
        benefits: ['Optimisation fiscale', 'Stratégies avancées'],
        icon: '🎯',
        color: '#F59E0B'
      },
      {
        level: 5,
        title: 'Maître de la Retraite',
        minPoints: 1000,
        maxPoints: 1999,
        benefits: ['Tous les outils premium', 'Support prioritaire'],
        icon: '👑',
        color: '#EF4444'
      },
      {
        level: 6,
        title: 'Sage Financier',
        minPoints: 2000,
        maxPoints: 9999,
        benefits: ['Statut VIP', 'Accès exclusif aux nouveautés'],
        icon: '🧙‍♂️',
        color: '#6366F1'
      }
    ];

    return levels.find(l => l.level === level) || levels[0];
  }

  /**
   * Obtient tous les succès disponibles
   */
  public getAllAchievements(): Achievement[] {
    return [
      // Succès Budget
      {
        id: 'first-budget',
        title: 'Premier Budget',
        description: 'Créez votre premier budget équilibré',
        icon: '💰',
        category: 'budget',
        difficulty: 'bronze',
        points: 50,
        progress: 0,
        maxProgress: 1,
        requirements: ['Créer un budget avec revenus ≥ dépenses'],
        reward: 'Déblocage du calculateur d\'épargne automatique'
      },
      {
        id: 'budget-master',
        title: 'Maître du Budget',
        description: 'Maintenez un budget équilibré pendant 3 mois',
        icon: '📊',
        category: 'budget',
        difficulty: 'gold',
        points: 200,
        progress: 0,
        maxProgress: 3,
        requirements: ['Budget équilibré pendant 3 mois consécutifs'],
        reward: 'Titre spécial "Gestionnaire Exemplaire"'
      },
      
      // Succès Épargne
      {
        id: 'first-savings',
        title: 'Première Épargne',
        description: 'Épargnez votre premier 100$',
        icon: '🏦',
        category: 'savings',
        difficulty: 'bronze',
        points: 25,
        progress: 0,
        maxProgress: 100,
        requirements: ['Atteindre 100$ d\'épargne totale'],
        reward: 'Guide "Stratégies d\'épargne avancées"'
      },
      {
        id: 'savings-milestone-1k',
        title: 'Cap des 1000$',
        description: 'Atteignez 1000$ d\'épargne',
        icon: '💎',
        category: 'savings',
        difficulty: 'silver',
        points: 100,
        progress: 0,
        maxProgress: 1000,
        requirements: ['Atteindre 1000$ d\'épargne totale'],
        reward: 'Calculateur d\'intérêts composés premium'
      },
      {
        id: 'emergency-fund-complete',
        title: 'Fonds d\'Urgence Complet',
        description: 'Constituez un fonds d\'urgence de 3 mois',
        icon: '🛡️',
        category: 'savings',
        difficulty: 'gold',
        points: 300,
        progress: 0,
        maxProgress: 1,
        requirements: ['Fonds d\'urgence ≥ 3 mois de dépenses'],
        reward: 'Badge "Sécurité Financière Assurée"'
      },

      // Succès Apprentissage
      {
        id: 'onboarding-complete',
        title: 'Formation Terminée',
        description: 'Complétez votre parcours d\'accompagnement',
        icon: '🎓',
        category: 'learning',
        difficulty: 'bronze',
        points: 75,
        progress: 0,
        maxProgress: 1,
        requirements: ['Terminer le parcours d\'onboarding'],
        reward: 'Accès aux modules avancés'
      },
      {
        id: 'knowledge-seeker',
        title: 'Chercheur de Savoir',
        description: 'Consultez 10 guides éducatifs',
        icon: '📖',
        category: 'learning',
        difficulty: 'silver',
        points: 150,
        progress: 0,
        maxProgress: 10,
        requirements: ['Lire 10 guides éducatifs complets'],
        reward: 'Bibliothèque de ressources premium'
      },

      // Succès Retraite
      {
        id: 'retirement-planning-start',
        title: 'Planification Retraite Amorcée',
        description: 'Créez votre premier plan de retraite',
        icon: '🏖️',
        category: 'retirement',
        difficulty: 'silver',
        points: 100,
        progress: 0,
        maxProgress: 1,
        requirements: ['Utiliser le calculateur de retraite'],
        reward: 'Guide "Optimisation REER/CELI"'
      },
      {
        id: 'retirement-on-track',
        title: 'Sur la Bonne Voie',
        description: 'Votre épargne retraite suit le plan établi',
        icon: '🎯',
        category: 'retirement',
        difficulty: 'gold',
        points: 250,
        progress: 0,
        maxProgress: 1,
        requirements: ['Épargne retraite ≥ objectif pour votre âge'],
        reward: 'Guide de préparation à une rencontre avec un professionnel'
      },

      // Succès Dettes
      {
        id: 'debt-reduction-start',
        title: 'Réduction de Dettes Amorcée',
        description: 'Réduisez vos dettes de 10%',
        icon: '📉',
        category: 'debt',
        difficulty: 'bronze',
        points: 75,
        progress: 0,
        maxProgress: 10,
        requirements: ['Réduire le total des dettes de 10%'],
        reward: 'Calculateur de remboursement optimisé'
      },
      {
        id: 'debt-free',
        title: 'Liberté Financière',
        description: 'Éliminez toutes vos dettes',
        icon: '🎉',
        category: 'debt',
        difficulty: 'platinum',
        points: 500,
        progress: 0,
        maxProgress: 1,
        requirements: ['Total des dettes = 0$'],
        reward: 'Badge "Libre de Dettes" + Titre spécial',
        isSecret: true
      },

      // Succès Jalons
      {
        id: 'consistent-user',
        title: 'Utilisateur Assidu',
        description: 'Utilisez l\'application 7 jours consécutifs',
        icon: '🔥',
        category: 'milestone',
        difficulty: 'bronze',
        points: 50,
        progress: 0,
        maxProgress: 7,
        requirements: ['Connexion quotidienne pendant 7 jours'],
        reward: 'Multiplicateur de points x1.1'
      },
      {
        id: 'power-user',
        title: 'Utilisateur Expert',
        description: 'Utilisez tous les outils disponibles',
        icon: '⚡',
        category: 'milestone',
        difficulty: 'gold',
        points: 300,
        progress: 0,
        maxProgress: 1,
        requirements: ['Utiliser chaque outil au moins une fois'],
        reward: 'Accès anticipé aux nouvelles fonctionnalités'
      }
    ];
  }

  /**
   * Obtient les succès de l'utilisateur
   */
  public getUserAchievements(): Achievement[] {
    const stored = localStorage.getItem('user-achievements');
    const allAchievements = this.getAllAchievements();
    
    if (!stored) {
      return allAchievements;
    }

    const userProgress = JSON.parse(stored);
    return allAchievements.map(achievement => ({
      ...achievement,
      progress: userProgress[achievement.id]?.progress || 0,
      unlockedAt: userProgress[achievement.id]?.unlockedAt ? new Date(userProgress[achievement.id].unlockedAt) : undefined
    }));
  }

  /**
   * Met à jour le progrès d'un succès
   */
  public updateAchievementProgress(achievementId: string, progress: number): { unlocked: boolean; achievement?: Achievement } {
    const achievements = this.getUserAchievements();
    const achievement = achievements.find(a => a.id === achievementId);
    
    if (!achievement || achievement.unlockedAt) {
      return { unlocked: false };
    }

    const newProgress = Math.min(progress, achievement.maxProgress);
    achievement.progress = newProgress;

    // Vérifier si le succès est débloqué
    let unlocked = false;
    if (newProgress >= achievement.maxProgress) {
      achievement.unlockedAt = new Date();
      unlocked = true;
      
      // Ajouter les points
      this.addPoints(achievement.points, `Succès débloqué: ${achievement.title}`);
      
      // Mettre à jour les statistiques
      const stats = this.getUserStats();
      stats.achievementsUnlocked++;
      this.saveUserStats(stats);
    }

    // Sauvegarder le progrès
    this.saveAchievementProgress(achievementId, achievement);

    return { unlocked, achievement: unlocked ? achievement : undefined };
  }

  /**
   * Sauvegarde le progrès des succès
   */
  private saveAchievementProgress(achievementId: string, achievement: Achievement): void {
    const stored = localStorage.getItem('user-achievements') || '{}';
    const userProgress = JSON.parse(stored);
    
    userProgress[achievementId] = {
      progress: achievement.progress,
      unlockedAt: achievement.unlockedAt?.toISOString()
    };
    
    localStorage.setItem('user-achievements', JSON.stringify(userProgress));
  }

  /**
   * Obtient les défis actifs
   */
  public getActiveChallenges(): Challenge[] {
    const stored = localStorage.getItem('active-challenges');
    if (!stored) {
      return this.generateWeeklyChallenges();
    }

    const challenges = JSON.parse(stored).map((c: any) => ({
      ...c,
      startDate: new Date(c.startDate),
      endDate: new Date(c.endDate)
    }));

    // Filtrer les défis expirés
    const now = new Date();
    return challenges.filter((c: Challenge) => c.endDate > now);
  }

  /**
   * Génère des défis hebdomadaires
   */
  private generateWeeklyChallenges(): Challenge[] {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Dimanche
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Samedi

    const challenges: Challenge[] = [
      {
        id: 'weekly-budget-check',
        title: 'Vérification Budgétaire',
        description: 'Consultez votre budget 3 fois cette semaine',
        category: 'budget',
        duration: 7,
        startDate: weekStart,
        endDate: weekEnd,
        isActive: true,
        isCompleted: false,
        progress: 0,
        target: 3,
        reward: {
          points: 50,
          badge: 'Gestionnaire Vigilant'
        },
        participants: Math.floor(Math.random() * 500) + 100,
        difficulty: 'easy'
      },
      {
        id: 'weekly-savings-goal',
        title: 'Objectif d\'Épargne',
        description: 'Épargnez au moins 50$ cette semaine',
        category: 'savings',
        duration: 7,
        startDate: weekStart,
        endDate: weekEnd,
        isActive: true,
        isCompleted: false,
        progress: 0,
        target: 50,
        reward: {
          points: 75,
          title: 'Épargnant de la Semaine'
        },
        participants: Math.floor(Math.random() * 300) + 50,
        difficulty: 'medium'
      }
    ];

    localStorage.setItem('active-challenges', JSON.stringify(challenges));
    return challenges;
  }

  /**
   * Met à jour le progrès d'un défi
   */
  public updateChallengeProgress(challengeId: string, progress: number): { completed: boolean; challenge?: Challenge } {
    const challenges = this.getActiveChallenges();
    const challenge = challenges.find(c => c.id === challengeId);
    
    if (!challenge || challenge.isCompleted) {
      return { completed: false };
    }

    challenge.progress = Math.min(progress, challenge.target);
    
    let completed = false;
    if (challenge.progress >= challenge.target) {
      challenge.isCompleted = true;
      completed = true;
      
      // Ajouter les points de récompense
      this.addPoints(challenge.reward.points, `Défi complété: ${challenge.title}`);
      
      // Mettre à jour les statistiques
      const stats = this.getUserStats();
      stats.completedChallenges++;
      this.saveUserStats(stats);
    }

    // Sauvegarder les défis
    localStorage.setItem('active-challenges', JSON.stringify(challenges));

    return { completed, challenge: completed ? challenge : undefined };
  }

  /**
   * Met à jour la série de connexions
   */
  public updateStreak(): { streakIncreased: boolean; currentStreak: number } {
    const stats = this.getUserStats();
    const today = new Date().toDateString();
    const lastActivity = stats.lastActivity.toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let streakIncreased = false;

    if (lastActivity === today) {
      // Déjà connecté aujourd'hui
      return { streakIncreased: false, currentStreak: stats.currentStreak };
    } else if (lastActivity === yesterdayStr) {
      // Connexion hier, continuer la série
      stats.currentStreak++;
      streakIncreased = true;
    } else {
      // Série brisée, recommencer
      stats.currentStreak = 1;
      streakIncreased = true;
    }

    // Mettre à jour le record
    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }

    stats.lastActivity = new Date();
    this.saveUserStats(stats);

    // Récompenser les séries importantes
    if (stats.currentStreak === 7) {
      this.addPoints(100, 'Série de 7 jours !');
    } else if (stats.currentStreak === 30) {
      this.addPoints(500, 'Série de 30 jours !');
    }

    return { streakIncreased, currentStreak: stats.currentStreak };
  }

  /**
   * Enregistre une activité utilisateur
   */
  public logActivity(action: string, data?: any): void {
    const activities = this.getRecentActivities();
    activities.unshift({
      id: Date.now().toString(),
      action,
      data,
      timestamp: new Date()
    });

    // Garder seulement les 50 dernières activités
    const recentActivities = activities.slice(0, 50);
    localStorage.setItem('user-activities', JSON.stringify(recentActivities));

    // Vérifier les succès basés sur l'activité
    this.checkActivityBasedAchievements(action, data);
  }

  /**
   * Obtient les activités récentes
   */
  public getRecentActivities(): any[] {
    const stored = localStorage.getItem('user-activities');
    if (!stored) return [];
    
    return JSON.parse(stored).map((a: any) => ({
      ...a,
      timestamp: new Date(a.timestamp)
    }));
  }

  /**
   * Vérifie les succès basés sur l'activité
   */
  private checkActivityBasedAchievements(action: string, data?: any): void {
    switch (action) {
      case 'budget_created':
        this.updateAchievementProgress('first-budget', 1);
        break;
      case 'savings_updated':
        if (data?.amount >= 100) {
          this.updateAchievementProgress('first-savings', data.amount);
        }
        if (data?.amount >= 1000) {
          this.updateAchievementProgress('savings-milestone-1k', data.amount);
        }
        break;
      case 'onboarding_completed':
        this.updateAchievementProgress('onboarding-complete', 1);
        break;
      case 'guide_read':
        const currentProgress = this.getUserAchievements().find(a => a.id === 'knowledge-seeker')?.progress || 0;
        this.updateAchievementProgress('knowledge-seeker', currentProgress + 1);
        break;
    }
  }

  /**
   * Obtient le classement de l'utilisateur
   */
  public getUserRanking(): { rank: number; totalUsers: number; percentile: number } {
    // Simulation du classement (dans une vraie app, ceci viendrait du serveur)
    const stats = this.getUserStats();
    const totalUsers = 10000; // Nombre simulé d'utilisateurs
    
    // Calcul approximatif du rang basé sur les points
    let rank = Math.max(1, Math.floor(totalUsers * (1 - stats.totalPoints / 3000)));
    rank = Math.min(rank, totalUsers);
    
    const percentile = Math.round(((totalUsers - rank) / totalUsers) * 100);
    
    return { rank, totalUsers, percentile };
  }

  /**
   * Réinitialise les données de gamification
   */
  public resetGamificationData(): void {
    localStorage.removeItem('user-stats');
    localStorage.removeItem('user-achievements');
    localStorage.removeItem('active-challenges');
    localStorage.removeItem('user-activities');
  }

  /**
   * Obtient un résumé des récompenses disponibles
   */
  public getAvailableRewards(): { achievements: Achievement[]; challenges: Challenge[] } {
    const achievements = this.getUserAchievements().filter(a => !a.unlockedAt && !a.isSecret);
    const challenges = this.getActiveChallenges().filter(c => !c.isCompleted);
    
    return { achievements, challenges };
  }
}

export default GamificationService;
