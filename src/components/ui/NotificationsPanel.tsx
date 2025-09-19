import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NotificationSchedulerService, type ScheduledNotification } from '@/services/NotificationSchedulerService';
import { useNavigate } from 'react-router-dom';
import { Calendar, Bell, Timer, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface NotificationsPanelProps {
  scenarioId?: string;
}

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    const s = isNaN(d.getTime()) ? iso : d.toLocaleDateString('fr-CA');
    const t = isNaN(d.getTime()) ? '' : ` ${d.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}`;
    return s + t;
  } catch {
    return iso;
  }
};

const mapTypeLabel = (t: ScheduledNotification['type']) => {
  switch (t) {
    case 'RRQ': return 'Demande RRQ';
    case 'SV': return 'Demande SV';
    case 'FERR': return 'Conversion REER→FERR';
    case 'WITHDRAWAL_NOTICE': return 'Préavis retrait';
    default: return t;
  }
};

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ scenarioId = 'default' }) => {
  const navigate = useNavigate();
  const [rrqDate, setRrqDate] = useState<string>('');
  const [svDate, setSvDate] = useState<string>('');
  const [withdrawalDate, setWithdrawalDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const notifications = useMemo(() => {
    try {
      return NotificationSchedulerService.list(scenarioId);
    } catch (e: any) {
      console.error(e);
      setError('Impossible de charger les notifications planifiées.');
      return [];
    }
  }, [scenarioId]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return notifications
      .filter(n => new Date(n.scheduledAt).getTime() >= now)
      .slice(0, 10);
  }, [notifications]);

  return (
    <Card className="border-2 border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Bell className="w-5 h-5" />
          Rappels 90/60/30 jours
        </CardTitle>
        <CardDescription>
          Programmez des rappels pour RRQ / SV / Conversion FERR et retraits avec préavis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-200 bg-red-50 text-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Raccourcis FERR */}
        <div className="p-3 rounded-md bg-amber-50 border border-amber-200">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-amber-700" />
              <div>
                <div className="font-semibold text-amber-800">Conversion REER → FERR</div>
                <div className="text-xs text-amber-700">Planifier automatiquement la série 90/60/30 selon votre année des 71 ans</div>
              </div>
            </div>
            <Button
              className="bg-amber-600 hover:bg-amber-700"
              onClick={() => navigate('/notifications/apply?type=FERR&scenarioId=default&leads=90,60,30&channels=inapp')}
            >
              Planifier FERR
            </Button>
          </div>
        </div>

        {/* Planification RRQ/SV */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-md border">
            <div className="text-sm font-semibold mb-2">Demande RRQ (date cible)</div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="border rounded px-2 py-1 flex-1"
                value={rrqDate}
                onChange={(e) => setRrqDate(e.target.value)}
                title="Date cible RRQ"
                aria-label="Date cible RRQ"
                placeholder="YYYY-MM-DD"
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (!rrqDate) return setError('Veuillez sélectionner une date RRQ (YYYY-MM-DD)');
                  navigate(`/notifications/apply?type=RRQ&date=${rrqDate}&scenarioId=default&leads=90,60,30&channels=inapp`);
                }}
              >
                Planifier
              </Button>
            </div>
          </div>
          <div className="p-3 rounded-md border">
            <div className="text-sm font-semibold mb-2">Demande SV (date cible)</div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="border rounded px-2 py-1 flex-1"
                value={svDate}
                onChange={(e) => setSvDate(e.target.value)}
                title="Date cible SV"
                aria-label="Date cible SV"
                placeholder="YYYY-MM-DD"
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (!svDate) return setError('Veuillez sélectionner une date SV (YYYY-MM-DD)');
                  navigate(`/notifications/apply?type=SV&date=${svDate}&scenarioId=default&leads=90,60,30&channels=inapp`);
                }}
              >
                Planifier
              </Button>
            </div>
          </div>
        </div>

        {/* Préavis de retrait */}
        <div className="p-3 rounded-md border">
          <div className="text-sm font-semibold mb-2">Préavis retrait d’investissement (date de retrait)</div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="border rounded px-2 py-1 flex-1"
              value={withdrawalDate}
              onChange={(e) => setWithdrawalDate(e.target.value)}
              title="Date de retrait d’investissement"
              aria-label="Date de retrait d’investissement"
              placeholder="YYYY-MM-DD"
            />
            <Button
              variant="outline"
              onClick={() => {
                if (!withdrawalDate) return setError('Veuillez sélectionner une date de retrait (YYYY-MM-DD)');
                navigate(`/notifications/apply?type=WITHDRAWAL_NOTICE&date=${withdrawalDate}&scenarioId=default&leads=90,60,30&channels=inapp`);
              }}
            >
              Planifier
            </Button>
          </div>
        </div>

        {/* Liste des prochains rappels */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-slate-700" />
            <div className="font-semibold">Prochains rappels</div>
            <Badge variant="outline">{upcoming.length}</Badge>
          </div>
          {upcoming.length === 0 ? (
            <div className="text-sm text-slate-600 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Aucun rappel à venir. Programmez vos rappels ci-dessus.
            </div>
          ) : (
            <div className="space-y-2">
              {upcoming.map((n) => (
                <div key={n.id} className="flex items-center justify-between border rounded px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{mapTypeLabel(n.type)}</Badge>
                    <div>
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-slate-600">{n.message}</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-700">{formatDate(n.scheduledAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Outils */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => navigate('/notifications')}
          >
            Voir tout
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              NotificationSchedulerService.clear(scenarioId);
              // For simplicity, reload page to refresh list
              window.location.reload();
            }}
          >
            Effacer tout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;
