import React from 'react';
import NotificationsPanel from '@/components/ui/NotificationsPanel';

const NotificationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <div className="container mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-amber-900">Mes rappels</h1>
          <p className="text-slate-700">
            Planifiez et consultez vos rappels 90/60/30 jours pour RRQ, SV, conversion REER→FERR et retraits à préavis.
          </p>
        </div>
        <NotificationsPanel scenarioId="default" />
      </div>
    </div>
  );
};

export default NotificationsPage;
