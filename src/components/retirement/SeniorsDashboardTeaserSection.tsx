import React, { useEffect, useMemo, useState } from 'react';
import SeniorsDashboard from '@/components/SeniorsDashboard';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { formatCurrencyOQLF, formatPercentOQLF } from '@/utils/localeFormat';
import { ChevronDown, ChevronUp, LayoutDashboard, PiggyBank, Target, Calendar } from 'lucide-react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';

/**
 * Section ancrée (#dashboard) affichée en bas de la page "Ma retraite".
 * - Teaser visible par défaut (2–3 indicateurs clés)
 * - Collapsible pour afficher le tableau de bord complet
 * - Respect OQLF : monnaie (1 234,56 $), pourcentage (92,5 % avec espace)
 */
const SeniorsDashboardTeaserSection: React.FC = () => {
  const { userData } = useRetirementData();
  const { language } = useLanguage();
  const isFrench = language === 'fr';
  const [open, setOpen] = useState(false);

  // Ouvrir automatiquement si l'ancre #dashboard est présente
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.hash === '#dashboard' || window.location.hash === '#tableau-de-bord')) {
      setOpen(true);
      // Scroll doux jusqu'à la section
      const el = document.getElementById('dashboard');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Teaser KPIs (simples, robustes)
  const { monthlyIncome, totalSavings, fourPercentMonthly, savingsRatePct } = useMemo(() => {
    const personal = userData.personal || {};
    const savings = userData.savings || ({} as any);
    const cashflow = userData.cashflow || ({} as any);

    const mi = Math.max(0, Number((personal as any).salaire1 || 0) / 12);
    const ts = Math.max(0,
      Number((savings as any).reer1 || 0) +
      Number((savings as any).celi1 || 0) +
      Number((savings as any).placements1 || 0)
    );
    const fpm = Math.round((ts * 0.04) / 12); // règle de 4 % (mensuelle)
    const annualIncome = Math.max(1, Number((personal as any).salaire1 || 0));
    const sr = Math.max(0, Math.min(100, (ts / (annualIncome * 10)) * 100)); // épargne vs 10x le revenu

    return {
      monthlyIncome: mi,
      totalSavings: ts,
      fourPercentMonthly: fpm,
      savingsRatePct: sr
    };
  }, [userData]);

  return (
    <section id="dashboard" className="mt-8">
      {/* Teaser compact */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-amber-600" />
            {isFrench ? 'Aperçu du tableau de bord' : 'Dashboard Overview'}
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            {isFrench 
              ? 'Un aperçu de vos indicateurs clés. Cliquez sur le bouton pour afficher le tableau de bord complet.'
              : 'An overview of your key indicators. Click the button to display the complete dashboard.'
            }
          </p>
        </div>

        <div className="px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Revenu mensuel (approx.) */}
            <div className="flex items-center gap-3 border rounded-md p-3">
              <Calendar className="w-5 h-5 text-slate-600" />
              <div>
                <div className="text-xs text-slate-500">
                  {isFrench ? 'Revenu net mensuel (approx.)' : 'Monthly Net Income (approx.)'}
                </div>
                <div className="text-base font-semibold text-slate-800">
                  {formatCurrencyOQLF(monthlyIncome, { min: 0, max: 0 })}
                </div>
              </div>
            </div>

            {/* Règle du 4 % (mensuel) */}
            <div className="flex items-center gap-3 border rounded-md p-3">
              <Target className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-xs text-slate-500">
                  {isFrench ? 'Règle du 4 % — mensuel' : '4% Rule — Monthly'}
                </div>
                <div className="text-base font-semibold text-slate-800">
                  {formatCurrencyOQLF(fourPercentMonthly, { min: 0, max: 0 })}
                </div>
              </div>
            </div>

            {/* Épargnes totales et taux */}
            <div className="flex items-center gap-3 border rounded-md p-3">
              <PiggyBank className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="text-xs text-slate-500">
                  {isFrench ? 'Épargnes totales' : 'Total Savings'}
                </div>
                <div className="text-base font-semibold text-slate-800">
                  {formatCurrencyOQLF(totalSavings, { min: 0, max: 0 })}
                </div>
                <div className="text-xs text-slate-500">
                  {isFrench 
                    ? `Taux d'épargne estimé : ${formatPercentOQLF(savingsRatePct, { min: 0, max: 1 })}`
                    : `Estimated Savings Rate: ${formatPercentOQLF(savingsRatePct, { min: 0, max: 1 })}`
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Bouton collapsible */}
          <div className="mt-4 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              aria-expanded={open ? 'true' : 'false'}
              className="inline-flex items-center gap-2 rounded-md border border-amber-300 bg-amber-600 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {open ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  {isFrench ? 'Masquer le tableau de bord' : 'Hide Dashboard'}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  {isFrench ? 'Afficher le tableau de bord' : 'Show Dashboard'}
                </>
              )}
            </button>
          </div>

          {/* Contenu repliable */}
          {open && (
            <div className="mt-4 border rounded-md">
              <SeniorsDashboard />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SeniorsDashboardTeaserSection;
