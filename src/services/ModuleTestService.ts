import type {
  ModuleTestLogEntry,
  ModuleTestResult,
  PageTestResult
} from '../types/services';

interface ModuleTestOptions {
  log?: (entry: ModuleTestLogEntry) => void;
}

interface PageTestOptions extends ModuleTestOptions {
  preload?: boolean;
}

const payrollCalendarConfig = {
  firstPayDateOfYear: '2025-01-02',
  frequency: 'biweekly' as const
};

export class ModuleTestService {
  private static addLog(
    logs: ModuleTestLogEntry[],
    entry: ModuleTestLogEntry,
    options?: ModuleTestOptions
  ): void {
    logs.push(entry);
    options?.log?.(entry);
  }

  static async testModuleLoading(options?: ModuleTestOptions): Promise<ModuleTestResult> {
    const logs: ModuleTestLogEntry[] = [];
    const errors: string[] = [];

    const runTest = async (
      label: string,
      task: () => Promise<void>
    ): Promise<void> => {
      this.addLog(logs, { level: 'info', message: `🧪 ${label}` }, options);

      try {
        await task();
        this.addLog(logs, { level: 'success', message: `✅ ${label}` }, options);
      } catch (error) {
        const message = `❌ ${label}`;
        errors.push(message);
        this.addLog(logs, { level: 'error', message, error }, options);
      }
    };

    await runTest('Test chargement PayrollCalendarService', async () => {
      const { PayrollCalendarService } = await import('./PayrollCalendarService');

      const validation = PayrollCalendarService.validateConfig(payrollCalendarConfig);
      if (!validation.isValid) {
        throw new Error('PayrollCalendarService validation failed');
      }
    });

    await runTest('Test chargement CalculationTestService', async () => {
      await import('./CalculationTestService');
    });

    await runTest('Test chargement PayrollTestService', async () => {
      await import('./PayrollTestService');
    });

    return {
      success: errors.length === 0,
      errors,
      logs
    };
  }

  static async testRevenusPageLoading(
    options?: PageTestOptions
  ): Promise<PageTestResult> {
    const logs: ModuleTestLogEntry[] = [];

    const add = (entry: ModuleTestLogEntry) => this.addLog(logs, entry, options);

    add({ level: 'info', message: '🧪 Test chargement page Revenus' });

    try {
      const { default: Revenus } = await import('../pages/Revenus');

      if (options?.preload) {
        add({ level: 'info', message: '↺ Préchargement composant Revenus' });
        await Revenus;
      }

      add({ level: 'success', message: '✅ Page Revenus chargée avec succès' });
      return { success: true, logs };
    } catch (error) {
      const message = '❌ Erreur lors du chargement de la page Revenus';
      add({ level: 'error', message, error });
      return {
        success: false,
        error: `${message}: ${(error as Error)?.message ?? 'Erreur inconnue'}`,
        logs
      };
    }
  }
}
