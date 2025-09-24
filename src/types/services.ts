export type ModuleImportTask = () => Promise<unknown>;

export type NavigationPredictionMap = Record<string, readonly string[]>;

export type ScheduledTaskToken = ReturnType<typeof setTimeout>;

export interface ScheduledTaskHandle {
  cancel(): void;
}

export interface ModulePreloadErrorContext {
  index: number;
  error: unknown;
  task: ModuleImportTask;
}

export interface ModulePreloadOptions {
  delayMs?: number;
  scheduleTask?: (task: () => void, delay: number) => ScheduledTaskToken;
  cancelTask?: (token: ScheduledTaskToken) => void;
  onError?: (context: ModulePreloadErrorContext) => void;
}

export type ModuleWarningReporter = (message: string, error?: unknown) => void;

export interface ModuleTestLogEntry {
  level: 'info' | 'success' | 'error';
  message: string;
  error?: unknown;
}

export interface ModuleTestResult {
  success: boolean;
  errors: string[];
  logs: ModuleTestLogEntry[];
}

export interface PageTestResult {
  success: boolean;
  error?: string;
  logs: ModuleTestLogEntry[];
}

export interface MemoryOptimizationEnvironment {
  usedHeapMB?: number;
  collectGarbage?: () => void;
}

export interface MemoryOptimizationOptions<T> {
  maxMemoryMB?: number;
  cleanup?: () => void;
  environment?: MemoryOptimizationEnvironment;
}

export interface PerformanceMonitorHandlers {
  handleLongTask?: (entry: PerformanceEntry) => void;
  handleNavigation?: (entry: PerformanceNavigationTiming | PerformanceEntry) => void;
}
