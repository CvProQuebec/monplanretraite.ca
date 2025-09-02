interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export class CacheService {
  private static cache = new Map<string, CacheEntry<any>>();

  static set<T>(key: string, data: T, ttlMinutes: number = 30): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + (ttlMinutes * 60 * 1000)
    };
    this.cache.set(key, entry);
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  // Cache spécialisé pour projections financières
  static cacheProjection(profile: UserProfile, result: ProjectionResult): void {
    const cacheKey = this.generateProfileKey(profile);
    this.set(`projection:${cacheKey}`, result, 60); // 1 heure
  }

  static getCachedProjection(profile: UserProfile): ProjectionResult | null {
    const cacheKey = this.generateProfileKey(profile);
    return this.get(`projection:${cacheKey}`);
  }

  // Cache pour calculs Monte Carlo
  static cacheMonteCarlo(params: MonteCarloParams, result: MonteCarloResult): void {
    const cacheKey = this.generateMonteCarloKey(params);
    this.set(`montecarlo:${cacheKey}`, result, 120); // 2 heures
  }

  static getCachedMonteCarlo(params: MonteCarloParams): MonteCarloResult | null {
    const cacheKey = this.generateMonteCarloKey(params);
    return this.get(`montecarlo:${cacheKey}`);
  }

  // Cache pour analyses de sensibilité
  static cacheSensitivity(analysis: SensitivityAnalysis, result: SensitivityResult): void {
    const cacheKey = this.generateSensitivityKey(analysis);
    this.set(`sensitivity:${cacheKey}`, result, 45); // 45 minutes
  }

  static getCachedSensitivity(analysis: SensitivityAnalysis): SensitivityResult | null {
    const cacheKey = this.generateSensitivityKey(analysis);
    return this.get(`sensitivity:${cacheKey}`);
  }

  // Nettoyer le cache expiré
  static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Obtenir les statistiques du cache
  static getStats(): CacheStats {
    const now = Date.now();
    let totalEntries = 0;
    let expiredEntries = 0;
    let totalSize = 0;

    for (const [key, entry] of this.cache.entries()) {
      totalEntries++;
      if (now > entry.expiry) {
        expiredEntries++;
      }
      // Estimation grossière de la taille
      totalSize += JSON.stringify(entry.data).length;
    }

    return {
      totalEntries,
      expiredEntries,
      activeEntries: totalEntries - expiredEntries,
      totalSizeBytes: totalSize,
      hitRate: 0 // À implémenter avec métriques
    };
  }

  private static generateProfileKey(profile: UserProfile): string {
    return `${profile.currentAge}-${profile.gender}-${profile.currentSavings}-${profile.retirementAge}`;
  }

  private static generateMonteCarloKey(params: MonteCarloParams): string {
    return `${params.initialAmount}-${params.years}-${params.expectedReturn}-${params.volatility}`;
  }

  private static generateSensitivityKey(analysis: SensitivityAnalysis): string {
    return `${analysis.baseCase}-${analysis.variable}-${analysis.range}`;
  }
}

// Interfaces pour les types utilisés
interface UserProfile {
  currentAge: number;
  gender: string;
  currentSavings: number;
  retirementAge: number;
}

interface ProjectionResult {
  monthlyIncome: number;
  totalSavings: number;
  yearsOfRetirement: number;
}

interface MonteCarloParams {
  initialAmount: number;
  years: number;
  expectedReturn: number;
  volatility: number;
}

interface MonteCarloResult {
  simulations: number[];
  percentiles: { [key: number]: number };
  probabilityOfSuccess: number;
}

interface SensitivityAnalysis {
  baseCase: number;
  variable: string;
  range: number[];
}

interface SensitivityResult {
  scenarios: Array<{
    value: number;
    result: number;
  }>;
}

interface CacheStats {
  totalEntries: number;
  expiredEntries: number;
  activeEntries: number;
  totalSizeBytes: number;
  hitRate: number;
}

// Nettoyage automatique du cache toutes les 30 minutes
setInterval(() => {
  CacheService.cleanup();
}, 30 * 60 * 1000);
