// src/services/NotificationSchedulerService.ts
// Planification locale de rappels (aucune API externe)
// Stockage: secureStorage (AES-GCM) avec fallback localStorage
//
// Clés: scenario:${scenarioId}:notifications
//
// Types et API minimales Phase 3:
// - scheduleSeries({ type, scenarioId, targetDate, options }) -> crée 90/60/30 autour d'une date cible
// - scheduleRRQ({ scenarioId, targetDate })
// - scheduleSV({ scenarioId, targetDate })
// - scheduleFERRConversion({ scenarioId, seventyOneBirthday })
// - scheduleWithdrawalNotice({ scenarioId, dateISO })
// - list, clear

import { secureStorage } from '@/lib/secureStorage';

export type NotificationType =
  | 'WITHDRAWAL_NOTICE'     // Préavis de retrait
  | 'RRQ_APPLICATION'       // Demande RRQ
  | 'OAS_APPLICATION'       // Demande SV
  | 'FERR_CONVERSION'       // Conversion FERR (71 ans)
  | 'MONTH_END_SYNC'        // Rappel fin de mois
  ;

export interface ScheduledNotification {
  id: string;
  scenarioId: string;
  type: NotificationType;
  title: string;
  message: string;
  dateISO: string; // YYYY-MM-DD
  createdAt: number;
  meta?: Record<string, any>;
}

export interface ScheduleSeriesParams {
  type: NotificationType;
  scenarioId: string;
  targetDateISO: string; // YYYY-MM-DD
  leads?: number[]; // jours avant la date cible (défaut: [90, 60, 30])
  title?: string;
  message?: string;
  meta?: Record<string, any>;
}

const NOTIF_KEY = (scenarioId: string) => `scenario:${scenarioId}:notifications`;

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function uid() {
  return `n-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function readAll(scenarioId: string): ScheduledNotification[] {
  const key = NOTIF_KEY(scenarioId);
  try {
    return secureStorage.getItem<ScheduledNotification[]>(key) ?? (JSON.parse(localStorage.getItem(key) || '[]') as ScheduledNotification[]);
  } catch {
    return [];
  }
}

function writeAll(scenarioId: string, list: ScheduledNotification[]) {
  const key = NOTIF_KEY(scenarioId);
  secureStorage.setItem(key, list);
  try { localStorage.setItem(key, JSON.stringify(list)); } catch {}
}

export class NotificationSchedulerService {
  static list(scenarioId: string): ScheduledNotification[] {
    return readAll(scenarioId);
  }

  static clear(scenarioId: string) {
    writeAll(scenarioId, []);
  }

  static scheduleSeries(params: ScheduleSeriesParams): ScheduledNotification[] {
    const leads = (params.leads && params.leads.length > 0) ? params.leads : [90, 60, 30];
    const baseTitle = params.title || NotificationSchedulerService.defaultTitle(params.type);
    const baseMessage = params.message || NotificationSchedulerService.defaultMessage(params.type);
    const target = fromISO(params.targetDateISO);
    const now = Date.now();
    const exist = readAll(params.scenarioId);

    const created: ScheduledNotification[] = [];
    leads.forEach((lead) => {
      const d = new Date(target);
      d.setDate(d.getDate() - lead);
      const iso = toISO(d);
      const n: ScheduledNotification = {
        id: uid(),
        scenarioId: params.scenarioId,
        type: params.type,
        title: `${baseTitle} — ${lead} j`,
        message: baseMessage,
        dateISO: iso,
        createdAt: now,
        meta: { ...(params.meta || {}), leadDays: lead, targetDateISO: params.targetDateISO }
      };
      created.push(n);
    });

    writeAll(params.scenarioId, [...exist, ...created]);
    return created;
  }

  static scheduleRRQ(opts: { scenarioId: string; targetDateISO: string; title?: string; message?: string }) {
    return this.scheduleSeries({
      type: 'RRQ_APPLICATION',
      scenarioId: opts.scenarioId,
      targetDateISO: opts.targetDateISO,
      title: opts.title,
      message: opts.message
    });
  }

  static scheduleSV(opts: { scenarioId: string; targetDateISO: string; title?: string; message?: string }) {
    return this.scheduleSeries({
      type: 'OAS_APPLICATION',
      scenarioId: opts.scenarioId,
      targetDateISO: opts.targetDateISO,
      title: opts.title,
      message: opts.message
    });
  }

  static scheduleFERRConversion(opts: { scenarioId: string; seventyOneBirthdayISO: string; title?: string; message?: string }) {
    return this.scheduleSeries({
      type: 'FERR_CONVERSION',
      scenarioId: opts.scenarioId,
      targetDateISO: opts.seventyOneBirthdayISO,
      title: opts.title || 'Conversion FERR (71 ans)',
      message: opts.message || 'Planifier la conversion du REER en FERR et revoir l’ordre de retraits.'
    });
  }

  static scheduleWithdrawalNotice(opts: { scenarioId: string; dateISO: string; title?: string; message?: string }) {
    // Série simplifiée: 90/60/30 jours avant le retrait prévu
    return this.scheduleSeries({
      type: 'WITHDRAWAL_NOTICE',
      scenarioId: opts.scenarioId,
      targetDateISO: opts.dateISO,
      title: opts.title || 'Préavis de retrait',
      message: opts.message || 'Préparer un retrait et vérifier les impacts fiscaux.'
    });
  }

  static scheduleMonthEndSync(opts: { scenarioId: string; months?: number }) {
    const months = Math.max(1, Math.min(12, Number(opts.months || 3)));
    const now = new Date();
    const created: ScheduledNotification[] = [];
    const exist = readAll(opts.scenarioId);
    const baseTitle = 'Rappel fin de mois';
    const baseMessage = 'Synchroniser budget/dépenses et enregistrer un instantané.';
    const createdAt = Date.now();
    for (let i = 0; i < months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 0); // dernier jour du mois
      created.push({
        id: uid(),
        scenarioId: opts.scenarioId,
        type: 'MONTH_END_SYNC',
        title: baseTitle,
        message: baseMessage,
        dateISO: toISO(d),
        createdAt,
      });
    }
    writeAll(opts.scenarioId, [...exist, ...created]);
    return created;
  }

  private static defaultTitle(type: NotificationType): string {
    switch (type) {
      case 'RRQ_APPLICATION': return 'Demande RRQ';
      case 'OAS_APPLICATION': return 'Demande SV';
      case 'FERR_CONVERSION': return 'Conversion FERR';
      case 'WITHDRAWAL_NOTICE': return 'Préavis de retrait';
      case 'MONTH_END_SYNC': return 'Rappel fin de mois';
      default: return 'Rappel';
    }
  }

  private static defaultMessage(type: NotificationType): string {
    switch (type) {
      case 'RRQ_APPLICATION': return 'Vérifier l’âge cible et préparer la demande RRQ.';
      case 'OAS_APPLICATION': return 'Préparer la demande de Sécurité de la vieillesse (SV).';
      case 'FERR_CONVERSION': return 'Préparer la conversion REER→FERR et ajuster les retraits.';
      case 'WITHDRAWAL_NOTICE': return 'Planifier un retrait et vérifier les impacts fiscaux.';
      case 'MONTH_END_SYNC': return 'Synchroniser budget et dépenses; enregistrer un instantané.';
      default: return 'Rappel planifié.';
    }
  }
}

export default NotificationSchedulerService;
