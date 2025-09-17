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
}> = ({ label, color, currentPct, currentAmount, targetPct, onTargetChange, language }) => {
  const deltaPct = currentPct - targetPct;
  return (
    <div className="space-y-2 p-3 rounded-lg border bg-white">
      <div className="flex items-center justify-between">
        <div className="font-medium text-gray-800">{label}</div>
        <div className="text-sm text-gray-600">
          {t('current', language)}: {formatPercentLocale(currentPct, language)} • {formatCurrencyLocale(currentAmount, language)}
        </div>
      </div>

      {/* Barre de progression */}
      <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
        <div
          className="h-3 rounded-full transition-all"
          style={{ width: `${Math.max(0, Math.min(100, currentPct))}%`, backgroundColor: color }}
          role="progressbar"
          aria-label={label}
          aria-valuenow={Math.round(isFinite(currentPct) ? currentPct : 0)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Cible et écart */}
      <div className="grid grid-cols-3 gap-3 items-end">
        <div>
          <Label className="text-sm text-gray-700">{t('target', language)} (%)</Label>
          <Input
            type="number"
            className="bg-white border-slate-300 text-gray-900"
            min={0}
            max={100}
            value={Math.round(targetPct)}
            onChange={(e) => onTargetChange(clampPct(parseFloat(e.target.value)))}
          />
        </div>
        <div>
          <Label className="text-sm text-gray-700">{t('delta', language)} (%)</Label>
          <div className={`mt-2 font-semibold ${deltaPct >= 0 ? 'text-amber-700' : 'text-green-700'}`}>
            {formatPercentLocale(deltaPct, language)}
          </div>
        </div>
        <div>
          <Label className="text-sm text-gray-700">{t('delta', language)} ($)</Label>
          <div className={`mt-2 font-semibold ${deltaPct >= 0 ? 'text-amber-700' : 'text-green-700'}`}>
            {formatCurrencyLocale((deltaPct / 100) * (isFinite(currentAmount) ? (currentAmount / (currentPct || 1)) * targetPct - currentAmount : 0), language)}
          </div>
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
        />
        <Row
          label={t('wants', language)}
          color="#6366f1"
          currentPct={allocations.pctWants}
          currentAmount={wantsAmt}
          targetPct={targets.wantsPct}
          onTargetChange={(pct) => onChangeTargets({ ...targets, wantsPct: pct })}
          language={language}
        />
        <Row
          label={t('savings', language)}
          color="#f59e0b"
          currentPct={allocations.pctSavingsDebt}
          currentAmount={savingsAmt}
          targetPct={targets.savingsDebtPct}
          onTargetChange={(pct) => onChangeTargets({ ...targets, savingsDebtPct: pct })}
          language={language}
        />
      </CardContent>
    </Card>
  );
};

export default BudgetTargetsGauges;
