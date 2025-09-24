import type {
  MemoryOptimizationEnvironment,
  MemoryOptimizationOptions,
  ModuleImportTask,
  ModulePreloadErrorContext,
  ModulePreloadOptions,
  ModuleWarningReporter,
  NavigationPredictionMap,
  PerformanceMonitorHandlers,
  ScheduledTaskHandle,
  ScheduledTaskToken
} from '../types/services';

const DEFAULT_PRELOAD_DELAY = 1000;

const DEFAULT_NAVIGATION_PREDICTIONS: NavigationPredictionMap = {
  '/': ['../pages/MaRetraite', '../pages/ComparisonPage'],
  '/ma-retraite': [
    '../features/retirement/components/optimization/MonteCarloSimulator',
    '../services/ProfessionalReportGenerator'
  ],
  '/comparaison': [
    '../services/ComparisonAnalytics',
    '../components/comparison/SeniorsCompetitiveComparison'
  ],
  '/hypotheses': ['../pages/SimpleAssumptionsPage', '../services/SimpleAssumptionsService']
};

export type PerformanceEnvironment = {
  PerformanceObserver?: typeof PerformanceObserver;
  console?: Pick<Console, 'warn' | 'log'>;
  document?: Document;
  location?: Location;
};

export interface SeniorsOptimizationInitializeConfig {
  environment?: PerformanceEnvironment;
  preloadOptions?: ModulePreloadOptions;
  predictions?: NavigationPredictionMap;
  reporter?: ModuleWarningReporter;
  performanceHandlers?: PerformanceMonitorHandlers;
}

export class SeniorsOptimizationService {
  private static report(
    reporter: ModuleWarningReporter | undefined,
    message: string,
    error?: unknown
  ): void {
    if (reporter) {
      reporter(message, error);
    }
  }

  private static schedule(task: () => void, delay: number, options?: ModulePreloadOptions): ScheduledTaskToken {
    const scheduler = options?.scheduleTask ?? ((cb: () => void, d: number) => setTimeout(cb, d));
    return scheduler(task, delay);
  }

  private static createHandle(token: ScheduledTaskToken, options?: ModulePreloadOptions): ScheduledTaskHandle {
    return {
      cancel: () => {
        const cancelTask = options?.cancelTask ?? ((handle: ScheduledTaskToken) => clearTimeout(handle as never));
        cancelTask(token);
      }
    };
  }

  private static getDefaultMemoryEnvironment(): MemoryOptimizationEnvironment | undefined {
    if (typeof performance === 'undefined' || !(performance as unknown as { memory?: { usedJSHeapSize: number } }).memory) {
      return undefined;
    }

    const perfWithMemory = performance as unknown as { memory?: { usedJSHeapSize: number } };
    const usedHeapSize = perfWithMemory.memory?.usedJSHeapSize;
    if (typeof usedHeapSize !== 'number') {
      return undefined;
    }

    const collectGarbage = typeof (globalThis as { gc?: () => void }).gc === 'function'
      ? () => (globalThis as { gc: () => void }).gc()
      : undefined;

    return {
      usedHeapMB: usedHeapSize / 1024 / 1024,
      collectGarbage
    };
  }

  static preloadModules(
    tasks: readonly ModuleImportTask[],
    options?: ModulePreloadOptions,
    reporter?: ModuleWarningReporter
  ): ScheduledTaskHandle[] {
    const handles: ScheduledTaskHandle[] = [];
    const baseDelay = options?.delayMs ?? DEFAULT_PRELOAD_DELAY;

    tasks.forEach((task, index) => {
      const executeTask = async () => {
        try {
          await task();
        } catch (error) {
          const context: ModulePreloadErrorContext = { index, error, task };
          options?.onError?.(context);
          this.report(reporter, 'Failed to preload module', error);
        }
      };

      const token = this.schedule(() => {
        void executeTask();
      }, index * baseDelay, options);

      handles.push(this.createHandle(token, options));
    });

    return handles;
  }

  static preloadCriticalModules(
    options?: ModulePreloadOptions,
    reporter?: ModuleWarningReporter
  ): ScheduledTaskHandle[] {
    const tasks: ModuleImportTask[] = [
      () => import('../pages/Accueil'),
      () => import('../pages/MaRetraite'),
      () => import('../components/comparison/SeniorsCompetitiveComparison'),
      () => import('../services/ProfessionalReportGenerator')
    ];

    return this.preloadModules(tasks, options, reporter);
  }

  static async preloadModule(modulePath: string, reporter?: ModuleWarningReporter): Promise<void> {
    try {
      await import(/* @vite-ignore */ modulePath);
    } catch (error) {
      this.report(reporter, `Failed to preload module: ${modulePath}`, error);
      throw error;
    }
  }

  static preloadPredictedModules(
    currentPath: string,
    options?: ModulePreloadOptions,
    predictions: NavigationPredictionMap = DEFAULT_NAVIGATION_PREDICTIONS,
    reporter?: ModuleWarningReporter
  ): ScheduledTaskHandle[] {
    const modules = this.getNavigationPredictions(currentPath, predictions);
    if (modules.length === 0) {
      return [];
    }

    const tasks = modules.map<ModuleImportTask>((modulePath) => () =>
      this.preloadModule(modulePath, reporter)
    );

    return this.preloadModules(tasks, options, reporter);
  }

  static optimizedCalculation<T>(
    calculation: () => T,
    fallback: T,
    options?: { timeoutMs?: number; reporter?: ModuleWarningReporter }
  ): Promise<T> {
    const timeoutMs = options?.timeoutMs ?? 5000;

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        this.report(options?.reporter, 'Calculation timeout, using fallback');
        resolve(fallback);
      }, timeoutMs);

      try {
        const result = calculation();
        clearTimeout(timeoutId);
        resolve(result);
      } catch (error) {
        this.report(options?.reporter, 'Calculation error, using fallback', error);
        clearTimeout(timeoutId);
        resolve(fallback);
      }
    });
  }

  static optimizedAsyncCalculation<T>(
    calculation: () => Promise<T>,
    fallback: T,
    options?: { timeoutMs?: number; reporter?: ModuleWarningReporter }
  ): Promise<T> {
    const timeoutMs = options?.timeoutMs ?? 8000;

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        this.report(options?.reporter, 'Async calculation timeout, using fallback');
        resolve(fallback);
      }, timeoutMs);

      calculation()
        .then((result) => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch((error) => {
          this.report(options?.reporter, 'Async calculation error, using fallback', error);
          clearTimeout(timeoutId);
          resolve(fallback);
        });
    });
  }

  static debounceCalculation<T extends unknown[]>(
    func: (...args: T) => void,
    wait: number = 1000
  ): (...args: T) => void {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    return (...args: T) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    };
  }

  static throttleCalculation<T extends unknown[]>(
    func: (...args: T) => void,
    limit: number = 2000
  ): (...args: T) => void {
    let inThrottle = false;

    return (...args: T) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;

        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }

  static async memoryOptimizedCalculation<T>(
    calculation: () => T,
    options: MemoryOptimizationOptions<T> = {}
  ): Promise<T> {
    const { maxMemoryMB = 50, cleanup, environment } = options;
    const env = environment ?? this.getDefaultMemoryEnvironment();

    if (env?.usedHeapMB !== undefined && env.usedHeapMB > maxMemoryMB) {
      env.collectGarbage?.();
      cleanup?.();
    }

    return calculation();
  }

  static getNavigationPredictions(
    currentPath: string,
    predictions: NavigationPredictionMap = DEFAULT_NAVIGATION_PREDICTIONS
  ): readonly string[] {
    return predictions[currentPath] ?? [];
  }

  static monitorPerformance(
    environment: PerformanceEnvironment = globalThis as PerformanceEnvironment,
    handlers: PerformanceMonitorHandlers = {}
  ): () => void {
    const env = environment ?? (globalThis as PerformanceEnvironment);
    const ObserverCtor = env?.PerformanceObserver ?? globalThis.PerformanceObserver;
    if (typeof ObserverCtor !== 'function') {
      return () => {};
    }

    const observers: PerformanceObserver[] = [];
    const consoleRef = env?.console ?? globalThis.console;

    if (handlers.handleLongTask || consoleRef?.warn) {
      const longTaskObserver = new ObserverCtor((list) => {
        for (const entry of list.getEntries()) {
          if (handlers.handleLongTask) {
            handlers.handleLongTask(entry);
          } else {
            consoleRef?.warn?.('Long task detected', entry);
          }
        }
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        observers.push(longTaskObserver);
      } catch {
        longTaskObserver.disconnect();
      }
    }

    if (handlers.handleNavigation || consoleRef?.log) {
      const navigationObserver = new ObserverCtor((list) => {
        for (const entry of list.getEntries()) {
          const navigationEntry = entry as PerformanceNavigationTiming;
          if (handlers.handleNavigation) {
            handlers.handleNavigation(navigationEntry);
          } else if ('loadEventEnd' in navigationEntry && 'loadEventStart' in navigationEntry) {
            const loadTime = navigationEntry.loadEventEnd - navigationEntry.loadEventStart;
            const domContentLoaded =
              ('domContentLoadedEventEnd' in navigationEntry && 'domContentLoadedEventStart' in navigationEntry)
                ? navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart
                : undefined;

            consoleRef?.log?.('Navigation timing', {
              loadTime,
              domContentLoaded
            });
          } else {
            consoleRef?.log?.('Performance entry', navigationEntry);
          }
        }
      });

      try {
        navigationObserver.observe({ entryTypes: ['navigation', 'paint'] });
        observers.push(navigationObserver);
      } catch {
        navigationObserver.disconnect();
      }
    }

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }
}
