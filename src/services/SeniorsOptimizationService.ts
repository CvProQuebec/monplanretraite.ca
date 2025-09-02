export class SeniorsOptimizationService {

  /**
   * Précharge les modules selon le parcours utilisateur seniors
   */
  static preloadCriticalModules(): void {
    // Précharger dans l'ordre d'utilisation typique seniors
    const preloadOrder = [
      () => import('../pages/Accueil'),
      () => import('../pages/MaRetraite'),
      () => import('../components/comparison/SeniorsCompetitiveComparison'),
      () => import('../services/ProfessionalReportGenerator')
    ];

    // Préchargement séquentiel pour éviter surcharge
    let delay = 0;
    preloadOrder.forEach(moduleImport => {
      setTimeout(() => {
        moduleImport().catch(console.warn);
      }, delay);
      delay += 1000; // 1 seconde entre chaque préchargement
    });
  }

  /**
   * Précharge un module spécifique au besoin
   */
  static async preloadModule(modulePath: string): Promise<void> {
    try {
      await import(modulePath);
    } catch (error) {
      console.warn(`Failed to preload module: ${modulePath}`, error);
    }
  }

  /**
   * Optimise les calculs pour éviter blocage interface
   */
  static async optimizedCalculation<T>(
    calculation: () => T,
    fallback: T,
    timeoutMs: number = 5000
  ): Promise<T> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        console.warn('Calculation timeout, using fallback');
        resolve(fallback);
      }, timeoutMs);

      try {
        const result = calculation();
        clearTimeout(timeoutId);
        resolve(result);
      } catch (error) {
        console.warn('Calculation error, using fallback:', error);
        clearTimeout(timeoutId);
        resolve(fallback);
      }
    });
  }

  /**
   * Wrapper pour calculs asynchrones avec timeout
   */
  static async optimizedAsyncCalculation<T>(
    calculation: () => Promise<T>,
    fallback: T,
    timeoutMs: number = 8000
  ): Promise<T> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        console.warn('Async calculation timeout, using fallback');
        resolve(fallback);
      }, timeoutMs);

      calculation()
        .then((result) => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch((error) => {
          console.warn('Async calculation error, using fallback:', error);
          clearTimeout(timeoutId);
          resolve(fallback);
        });
    });
  }

  /**
   * Débouncing pour inputs seniors (éviter calculs trop fréquents)
   */
  static debounceCalculation<T extends any[]>(
    func: (...args: T) => void,
    wait: number = 1000
  ): (...args: T) => void {
    let timeout: NodeJS.Timeout;
    return (...args: T) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Throttling pour calculs intensifs
   */
  static throttleCalculation<T extends any[]>(
    func: (...args: T) => void,
    limit: number = 2000
  ): (...args: T) => void {
    let inThrottle: boolean;
    return (...args: T) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Optimisation mémoire pour gros calculs
   */
  static async memoryOptimizedCalculation<T>(
    calculation: () => T,
    options: {
      maxMemoryMB?: number;
      cleanup?: () => void;
    } = {}
  ): Promise<T> {
    const { maxMemoryMB = 50, cleanup } = options;

    // Vérifier la mémoire disponible avant calcul
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      const usedMB = memInfo.usedJSHeapSize / 1024 / 1024;

      if (usedMB > maxMemoryMB) {
        // Forcer garbage collection si disponible
        if ('gc' in window) {
          (window as any).gc();
        }

        // Nettoyer si fonction fournie
        if (cleanup) {
          cleanup();
        }
      }
    }

    return calculation();
  }

  /**
   * Préchargement intelligent basé sur navigation prédite
   */
  static setupNavigationPrediction(): void {
    let lastPath = window.location.pathname;

    // Observer les changements de navigation
    const observer = new MutationObserver(() => {
      const currentPath = window.location.pathname;
      if (currentPath !== lastPath) {
        this.predictAndPreload(currentPath);
        lastPath = currentPath;
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Prédire et précharger les modules suivants
   */
  private static predictAndPreload(currentPath: string): void {
    const predictions = this.getNavigationPredictions(currentPath);

    predictions.forEach((modulePath, index) => {
      setTimeout(() => {
        this.preloadModule(modulePath);
      }, index * 500); // Précharger progressivement
    });
  }

  /**
   * Logique de prédiction basée sur parcours utilisateur
   */
  private static getNavigationPredictions(currentPath: string): string[] {
    const predictions: { [key: string]: string[] } = {
      '/': ['../pages/MaRetraite', '../pages/ComparisonPage'],
      '/ma-retraite': ['../features/retirement/components/MonteCarloSimulator', '../services/ProfessionalReportGenerator'],
      '/comparaison': ['../services/ComparisonAnalytics', '../components/comparison/SeniorsCompetitiveComparison'],
      '/hypotheses': ['../pages/SimpleAssumptionsPage', '../services/SimpleAssumptionsService']
    };

    return predictions[currentPath] || [];
  }

  /**
   * Monitoring performance pour seniors
   */
  static monitorPerformance(): void {
    // Observer les métriques de performance
    if ('PerformanceObserver' in window) {
      // Observer les long tasks (>50ms)
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 100) { // Plus de 100ms considéré long pour seniors
            console.warn('Long task detected:', entry);
            // Ici on pourrait envoyer métriques à analytics
          }
        }
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });

      // Observer les métriques de navigation
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Navigation timing:', {
            loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            firstPaint: (entry as any).paintTiming?.firstPaint,
            firstContentfulPaint: (entry as any).paintTiming?.firstContentfulPaint
          });
        }
      });

      navigationObserver.observe({ entryTypes: ['navigation', 'paint'] });
    }
  }

  /**
   * Initialisation complète du service d'optimisation
   */
  static initialize(): void {
    // Précharger modules critiques
    this.preloadCriticalModules();

    // Setup prédiction navigation
    this.setupNavigationPrediction();

    // Monitoring performance
    this.monitorPerformance();

    console.log('SeniorsOptimizationService initialized');
  }
}

// Initialiser automatiquement
if (typeof window !== 'undefined') {
  // Attendre que le DOM soit prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      SeniorsOptimizationService.initialize();
    });
  } else {
    SeniorsOptimizationService.initialize();
  }
}
