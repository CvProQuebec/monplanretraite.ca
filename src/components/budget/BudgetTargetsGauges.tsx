import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BudgetTargets } from '@/types/budget';
import { AllocationTotals } from '@/services/BudgetComputationService';
import { formatCurrencyLocale, formatPercentLocale, enforceOqlfFrenchTitle } from '@/utils/localeFormat';

type Props = {
  language: 'fr' | 'en';
  netMonthlyIncome: number;
  allocations: AllocationTotals;
  targets: BudgetTargets;
  onChangeTargets: (next: BudgetTargets) => void;
};

const t = (k: string, lang: 'fr' | 'en') => {
  const dict: Record<string, { fr: string; en: string }> = {
    title: { fr: '50/30/20 - suivi', en: '50/30/20 - tracking' },
    subtitle: { fr: 'Visualisez vos allocations vs vos cibles', en: 'See your allocations vs targets' },
    needs: { fr: 'besoins', en: 'needs' },
    wants: { fr: 'envies', en: 'wants' },
    savings: { fr: 'épargne et dettes', en: 'savings & debt' },
    current: { fr: 'actuel', en: 'current' },
    target: { fr: 'cible', en: 'target' },
    delta: { fr: 'écart', en: 'delta' },
    totalIncome: { fr: 'revenu net mensuel', en: 'net monthly income' },
    warningSum: { fr: 'La somme des cibles devrait être 100 %', en: 'Targets should sum to 100%' }
  };
  const v = dict[k]?.[lang] ?? k;
  return lang === 'fr' ? enforceOqlfFrenchTitle(v) : v.charAt(0).toUpperCase() + v.slice(1);
};

const clampPct = (v: number) => {
  if (Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
};

const Row: React.FC<{
  label: string;
  color: string;
  currentPct: number;
  currentAmount: number;
  targetPct: number;
  onTargetChange: (pct: number) => void;
  language: 'fr' | 'en';
  netMonthlyIncome: number;
}> = ({
  label,
  color,
  currentPct,
  currentAmount,
  targetPct,
  onTargetChange,
  language,
  netMonthlyIncome
}) => {
  // Delta (%) = actuel - cible (positif si on dépasse)
  const deltaPct = currentPct - targetPct;

  // Delta ($) = montant cible - montant actuel (sur revenu net mensuel)
  const targetAmount = (Math.max(0, targetPct) / 100) * (isFinite(netMonthlyIncome) ? netMonthlyIncome : 0);
  const deltaAmount = targetAmount - (isFinite(currentAmount) ? currentAmount : 0);

  // Libellés compacts FR/EN
  const L = language === 'fr'
    ? { target: 'Cible %', dPct: 'Écart (%)', dAmt: 'Écart ($)' }
    : { target: 'Target %', dPct: 'Delta (%)', dAmt: 'Delta ($)' };

  return (
    <div
      className="flex items-center justify-between gap-2 p-2 rounded border bg-white"
      style={{ borderLeft: `4px solid ${color}` }}
      aria-label={label}
    >
      <div className="min-w-[110px] font-medium text-gray-800 truncate">{label}</div>

      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-slate-500">{L.target}</span>
          <Input
            type="number"
            min={0}
            max={100}
            value={Math.round(targetPct)}
            onChange={(e) => onTargetChange(clampPct(parseFloat(e.target.value)))}
            className="w-16 h-8 bg-white border-slate-300 text-gray-900 px-2 py-1"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500">{L.dPct}</span>
          <span className={`font-semibold ${deltaPct >= 0 ? 'text-amber-700' : 'text-green-700'}`}>
            {formatPercentLocale(deltaPct, language)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500">{L.dAmt}</span>
          <span className={`font-semibold ${deltaAmount >= 0 ? 'text-amber-700' : 'text-green-700'}`}>
            {formatCurrencyLocale(deltaAmount, language)}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Affiche 3 jauges (besoins/envies/épargne+dettes) et permet d'ajuster les cibles (en %).
 * Remarque: la normalisation à 100 % n'est pas imposée automatiquement (MVP).
 */
const BudgetTargetsGauges: React.FC<Props> = ({ language, netMonthlyIncome, allocations, targets, onChangeTargets }) => {
  const isFr = language === 'fr';
  const needsAmt = allocations.totalNeeds;
  const wantsAmt = allocations.totalWants;
  const savingsAmt = allocations.totalSavingsDebt;

  const sumTargets = (targets.needsPct || 0) + (targets.wantsPct || 0) + (targets.savingsDebtPct || 0);

  return (
    <Card className="bg-white border-2 border-gray-300">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">{t('title', language)}</CardTitle>
        <CardDescription>{t('subtitle', language)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          {t('totalIncome', language)}: <span className="font-semibold text-green-700">{formatCurrencyLocale(netMonthlyIncome || 0, language)}</span>
        </div>

        {sumTargets !== 100 && (
          <div className="text-sm text-amber-700 border border-amber-200 bg-amber-50 rounded p-2">
            {t('warningSum', language)}: {formatPercentLocale(sumTargets, language)}
          </div>
        )}

        <Row
          label={t('needs', language)}
          color="#22c55e"
          currentPct={allocations.pctNeeds}
          currentAmount={needsAmt}
          targetPct={targets.needsPct}
          onTargetChange={(pct) => onChangeTargets({ ...targets, needsPct: pct })}
          language={language}
          netMonthlyIncome={netMonthlyIncome}
        />
        <Row
          label={t('wants', language)}
          color="#6366f1"
          currentPct={allocations.pctWants}
          currentAmount={wantsAmt}
          targetPct={targets.wantsPct}
          onTargetChange={(pct) => onChangeTargets({ ...targets, wantsPct: pct })}
          language={language}
          netMonthlyIncome={netMonthlyIncome}
        />
        <Row
          label={t('savings', language)}
          color="#f59e0b"
          currentPct={allocations.pctSavingsDebt}
          currentAmount={savingsAmt}
          targetPct={targets.savingsDebtPct}
          onTargetChange={(pct) => onChangeTargets({ ...targets, savingsDebtPct: pct })}
          language={language}
          netMonthlyIncome={netMonthlyIncome}
        />
      </CardContent>
    </Card>
  );
};

export default BudgetTargetsGauges;
