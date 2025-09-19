import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { wizardService } from '@/services/WizardService';
import TaxOptimizationService, { WithdrawalSource } from '@/services/TaxOptimizationService';
import NotificationSchedulerService from '@/services/NotificationSchedulerService';
import { PDFExportService } from '@/services/PDFExportService';
import SeniorsLoadingSpinner from '@/components/SeniorsLoadingSpinner';
import { formatCurrencyOQLF, formatTimeOQLF } from '@/utils/localeFormat';
import { AlertCircle, Bell, CheckCircle, FileDown, Shuffle, Wallet } from 'lucide-react';

/**
 * ResultsWizardStep
 * - Cartes "Ordre de retraits recommandé", "Rappels", "Rapport PDF"
 * - Actions: Appliquer l'ordre, Planifier rappels, Exporter PDF
 * - Données 100% locales. OQLF + UI seniors.
 */
const ResultsWizardStep: React.FC = () => {
  const { language } = useLanguage();
  const isFrench = language === 'fr';
  const scenarioId = 'default';

  const [loading, setLoading] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [monthlyNetNeed, setMonthlyNetNeed] = useState<number>(0);
  const [targetWithdrawalDate, setTargetWithdrawalDate] = useState<string>('');
  const [suggestedOrder, setSuggestedOrder] = useState<WithdrawalSource[]>([]);
  const [exporting, setExporting] = useState(false);

  // Charger userData depuis localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('retirement_data');
      if (raw) {
        const data = JSON.parse(raw);
        setUserData(data);
        // Estimation très simple d'un besoin net mensuel si budget existant
        const revenusMensuels = ((data?.personal?.salaire1 || 0) + (data?.personal?.salaire2 || 0)) / 12;
        const totalDepenses = (data?.cashflow?.logement || 0) +
          (data?.cashflow?.servicesPublics || 0) +
          (data?.cashflow?.assurances || 0) +
          (data?.cashflow?.telecom || 0) +
          (data?.cashflow?.alimentation || 0) +
          (data?.cashflow?.transport || 0) +
          (data?.cashflow?.sante || 0) +
          (data?.cashflow?.loisirs || 0) +
          (data?.cashflow?.depensesSaisonnieres || 0);
        // Si dépenses > revenus, besoin net positif (à couvrir par retraits)
        const need = Math.max(0, totalDepenses - revenusMensuels);
        setMonthlyNetNeed(Number(need.toFixed(0)));
      }
    } catch {
      // silencieux
    }
  }, []);

  // Calcul d'un ordre de retraits recommandé
  useEffect(() => {
    const order = TaxOptimizationService.suggestWithdrawalOrder(userData);
    setSuggestedOrder(order);
  }, [userData]);

  const orderLabel = (s: WithdrawalSource) => {
    switch (s) {
      case 'CELI': return 'CELI';
      case 'NON_ENREGISTRE': return isFrench ? 'Non-enregistré' : 'Non-registered';
      case 'REER': return 'REER';
      case 'RRIF': return 'FERR';
      case 'CRI': return 'CRI';
      case 'LIF': return 'LIF';
      case 'PENSION': return isFrench ? 'Rente privée' : 'Private pension';
      default: return s;
    }
  };

  const handleApplyOrder = async () => {
    if (!suggestedOrder.length) return;
    setLoading(true);
    try {
      await wizardService.applyWithdrawalOrder(suggestedOrder, scenarioId);
      setLastSavedAt(new Date());
      console.log('[Phase3] Ordre de retraits appliqué:', suggestedOrder);
      // Notification auto-save wizard
      try { (window as any).mprNotifyDataChanged?.(); } catch {}
    } catch (e) {
      console.warn('Erreur application ordre:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanNotices = async () => {
    setLoading(true);
    try {
      // Si date ciblée sélectionnée, créer 90/60/30 jours de préavis de retrait
      if (targetWithdrawalDate) {
        NotificationSchedulerService.scheduleWithdrawalNotice({ scenarioId, dateISO: targetWithdrawalDate });
      }
      // Planifier fin de mois pour 3 prochains mois
      NotificationSchedulerService.scheduleMonthEndSync({ scenarioId, months: 3 });
      // Exemple: conversion FERR à 71 ans (si on avait l'anniversaire, on utiliserait la vraie date)
      // Ici démonstration: pas de date réelle -> skip si inconnue.

      setLastSavedAt(new Date());
      console.log('[Phase3] Rappels planifiés (préavis retrait, fin de mois).');
    } catch (e) {
      console.warn('Erreur planification rappels:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      // Générer un PDF rapide de comparaison/scénario ou un résumé budget si besoin.
      const blob = await PDFExportService.generateQuickSummary(userData || {}, 85, isFrench ? 'fr' : 'en');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = isFrench ? 'Resume_Retraite.pdf' : 'Retirement_Summary.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setLastSavedAt(new Date());
      console.log('[Phase3] PDF exporté.');
    } catch (e) {
      console.warn('Erreur export PDF:', e);
    } finally {
      setExporting(false);
    }
  };

  const schedule = useMemo(() => {
    const order = suggestedOrder;
    if (!order.length || monthlyNetNeed <= 0) return null;
    return TaxOptimizationService.buildMonthlySchedule(scenarioId, monthlyNetNeed, order);
  }, [scenarioId, monthlyNetNeed, suggestedOrder]);

  return (
    <div className="space-y-6">
      {/* Bandeau état */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-blue-900">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">
            {isFrench ? 'Résultats & Plan d’action' : 'Results & Action Plan'}
          </span>
        </div>
        <div className="text-sm text-blue-800">
          {isFrench ? 'Dernière sauvegarde' : 'Last saved'}: <strong>{lastSavedAt ? formatTimeOQLF(lastSavedAt) : '—'}</strong>
        </div>
      </div>

      {/* Ordre de retraits */}
      <div className="bg-white border-2 border-gray-300 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shuffle className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">
            {isFrench ? 'Ordre de retraits recommandé' : 'Recommended withdrawal order'}
          </h2>
        </div>
        {suggestedOrder.length === 0 ? (
          <div className="text-gray-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span>{isFrench ? 'Aucune recommandation disponible (données insuffisantes).' : 'No recommendation available (insufficient data).'}</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedOrder.map((s, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm">
                {idx + 1}. {orderLabel(s)}
              </span>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="results-monthly-need" className="block text-sm text-gray-700 mb-1">
              {isFrench ? 'Besoin net mensuel à couvrir par retraits' : 'Net monthly need to cover with withdrawals'}
            </label>
            <input
              id="results-monthly-need"
              type="number"
              className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg"
              value={monthlyNetNeed || ''}
              onChange={(e) => setMonthlyNetNeed(parseFloat((e.target.value || '0').replace(',', '.')) || 0)}
              placeholder={isFrench ? '0' : '0'}
              aria-label={isFrench ? 'Besoin net mensuel' : 'Net monthly need'}
              title={isFrench ? 'Besoin net mensuel à couvrir' : 'Net monthly need to cover'}
            />
            <p className="text-xs text-gray-600 mt-1">
              {isFrench
                ? 'Estimation basée sur vos dépenses et revenus. Ajustez au besoin.'
                : 'Estimated from your expenses and income. Adjust as needed.'}
            </p>
          </div>
          <div className="flex items-end">
            <button
              className="button-primary px-6 py-3 w-full"
              onClick={handleApplyOrder}
              disabled={loading || !suggestedOrder.length}
              aria-label={isFrench ? 'Appliquer ordre' : 'Apply order'}
            >
              {loading ? (isFrench ? 'Application...' : 'Applying...') : (isFrench ? 'Appliquer l’ordre' : 'Apply order')}
            </button>
          </div>
        </div>

        {/* Aperçu horaire simple */}
        {schedule && schedule.entries.length > 0 && (
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2 text-gray-800">
              <Wallet className="w-5 h-5" />
              <span className="font-semibold">{isFrench ? 'Aperçu horaire (12 mois)' : 'Schedule preview (12 months)'}</span>
            </div>
            <div className="text-sm text-gray-700">
              {isFrench
                ? 'Répartition simplifiée (approximations pédagogiques).'
                : 'Simplified allocation (educational approximations).'}
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {schedule.entries.slice(0, 12).map((e, i) => (
                <div key={i} className="bg-white border rounded p-2 flex justify-between">
                  <span className="text-gray-800">{e.dateISO} — {orderLabel(e.source)}</span>
                  <span className="font-semibold text-emerald-700">{formatCurrencyOQLF(e.gross)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rappels */}
      <div className="bg-white border-2 border-gray-300 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            {isFrench ? 'Planifier des rappels' : 'Schedule reminders'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="results-withdrawal-date" className="block text-sm text-gray-700 mb-1">{isFrench ? 'Date prévue de retrait (optionnel)' : 'Planned withdrawal date (optional)'}</label>
            <input
              id="results-withdrawal-date"
              type="date"
              className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg"
              value={targetWithdrawalDate}
              onChange={(e) => setTargetWithdrawalDate(e.target.value)}
              aria-label={isFrench ? 'Date prévue de retrait' : 'Planned withdrawal date'}
              title={isFrench ? 'Date prévue de retrait' : 'Planned withdrawal date'}
            />
            <p className="text-xs text-gray-600 mt-1">
              {isFrench
                ? 'Crée des rappels 90/60/30 jours avant cette date.'
                : 'Creates 90/60/30-day reminders before this date.'}
            </p>
          </div>
          <div className="flex items-end">
            <button
              className="button-primary px-6 py-3 w-full"
              onClick={handlePlanNotices}
              disabled={loading}
              aria-label={isFrench ? 'Planifier' : 'Schedule'}
            >
              {loading ? (isFrench ? 'Planification...' : 'Scheduling...') : (isFrench ? 'Planifier' : 'Schedule')}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-700 mt-2">
          {isFrench
            ? 'Les rappels sont stockés localement (aucune transmission externe). Vous pourrez les consulter dans la page « Notifications ».'
            : 'Reminders are stored locally (no external transmission). You can review them in the “Notifications” page.'}
        </p>
      </div>

      {/* Export PDF */}
      <div className="bg-white border-2 border-gray-300 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileDown className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">
            {isFrench ? 'Rapport PDF' : 'PDF Report'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-gray-700 text-sm">
            {isFrench
              ? 'Téléchargez un résumé PDF. Les rapports professionnels (banquier / planificateur / notaire) seront disponibles dans la prochaine itération.'
              : 'Download a summary PDF. Professional reports (banker / planner / notary) will be available in the next iteration.'}
          </div>
          <div className="flex items-end">
            <button
              className="button-primary px-6 py-3 w-full"
              onClick={handleExportPDF}
              disabled={exporting}
              aria-label={isFrench ? 'Exporter PDF' : 'Export PDF'}
            >
              {exporting ? (isFrench ? 'Export...' : 'Export...') : (isFrench ? 'Exporter PDF' : 'Export PDF')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsWizardStep;
