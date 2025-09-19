import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NotificationSchedulerService, type NotificationType } from '@/services/NotificationSchedulerService';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';

const parseLeads = (raw: string | null | undefined): number[] | undefined => {
  if (!raw) return undefined;
  const nums = raw.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
  return nums.length ? nums : undefined;
};

const parseChannels = (raw: string | null | undefined): Array<'inapp'|'email'|'sms'> | undefined => {
  if (!raw) return undefined;
  const allowed = new Set(['inapp','email','sms']);
  const arr = raw.split(',').map(s => s.trim()).filter(s => allowed.has(s)) as Array<'inapp'|'email'|'sms'>;
  return arr.length ? arr : undefined;
};

/**
 * ApplyNotification
 * Deep-link pour planifier une série de notifications 90/60/30.
 * Exemples:
 *  - /notifications/apply?type=FERR&scenarioId=default&leads=90,60,30&channels=inapp
 *  - /notifications/apply?type=RRQ&date=2026-02-01&scenarioId=default
 *  - /notifications/apply?type=WITHDRAWAL_NOTICE&date=2025-12-15&leads=30,14,7&channels=inapp,email
 *  - /notifications/apply?type=SV&date=2025-05-01&redirect=/notifications
 */
const ApplyNotification: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { userData } = useRetirementData();
  const [status, setStatus] = useState<'idle'|'applying'|'done'|'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setStatus('applying');
      setError(null);
      const type = (params.get('type') as NotificationType | null) || null;
      const date = params.get('date'); // ISO YYYY-MM-DD
      const leads = parseLeads(params.get('leads'));
      const channels = parseChannels(params.get('channels'));
      const scenarioId = params.get('scenarioId') || 'default';
      const redirect = params.get('redirect') || '/notifications';

      try {
        if (!type) throw new Error('Paramètre "type" manquant (RRQ|SV|FERR|WITHDRAWAL_NOTICE)');

        if (type === 'FERR') {
          NotificationSchedulerService.scheduleFERRConversion(userData, scenarioId, { leads, channels });
        } else if (type === 'RRQ') {
          if (!date) throw new Error('Paramètre "date" requis pour RRQ (YYYY-MM-DD)');
          NotificationSchedulerService.scheduleRRQ(scenarioId, date, { leads, channels });
        } else if (type === 'SV') {
          if (!date) throw new Error('Paramètre "date" requis pour SV (YYYY-MM-DD)');
          NotificationSchedulerService.scheduleSV(scenarioId, date, { leads, channels });
        } else if (type === 'WITHDRAWAL_NOTICE') {
          if (!date) throw new Error('Paramètre "date" requis pour WITHDRAWAL_NOTICE (YYYY-MM-DD)');
          NotificationSchedulerService.scheduleWithdrawalNotice(scenarioId, date, { leads, channels });
        }

        setStatus('done');
        setTimeout(() => navigate(redirect), 250);
      } catch (e: any) {
        console.error('ApplyNotification error:', e);
        setError(e?.message || 'Erreur lors de la planification des notifications');
        setStatus('error');
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        {status === 'applying' && <p className="text-gray-700">Planification des notifications…</p>}
        {status === 'done' && <p className="text-green-700">Notifications planifiées. Redirection…</p>}
        {status === 'error' && (
          <div className="text-red-700">
            <p>Une erreur est survenue.</p>
            {error && <p className="text-sm mt-2">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyNotification;
