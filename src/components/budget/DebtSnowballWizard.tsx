import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import MoneyInput from '@/components/ui/MoneyInput';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import type { DebtItem, DebtSnowballState } from '@/types/budget';
import { formatCurrencyLocale } from '@/utils/localeFormat';

type Props = {
  language: 'fr' | 'en';
  state: DebtSnowballState;
  onChange: (next: DebtSnowballState) => void;
};

const t = (k: string, lang: 'fr' | 'en') => {
  const M: Record<string, { fr: string; en: string }> = {
    title: { fr: 'Dettes — méthode boule de neige', en: 'Debts — snowball method' },
    subtitle: { fr: 'Remboursez vos dettes plus vite avec une stratégie simple et motivante', en: 'Pay down debts faster with a simple, motivating strategy' },
    helper: { fr: 'Astuce: payez le minimum sur toutes les dettes et concentrez un montant additionnel sur la plus petite (ou la plus coûteuse). Lorsqu’une dette est payée, son montant se rajoute à la suivante.', en: 'Tip: pay the minimum on all debts and focus an extra amount on the smallest (or the most expensive) first. When a debt is paid, roll its amount into the next.' },
    method: { fr: 'méthode', en: 'method' },
    byBalance: { fr: 'par plus petit solde', en: 'lowest balance' },
    byRate: { fr: 'par plus haut taux', en: 'highest rate' },
    extra: { fr: 'montant additionnel mensuel', en: 'extra per month' },
    addDebt: { fr: 'ajouter une dette', en: 'add debt' },
    name: { fr: 'nom', en: 'name' },
    balance: { fr: 'solde', en: 'balance' },
    rate: { fr: 'taux (%)', en: 'rate (%)' },
    min: { fr: 'paiement min.', en: 'min. payment' },
    remove: { fr: 'retirer', en: 'remove' },
    planSummary: { fr: 'Résumé de plan', en: 'Plan summary' },
    monthsToDebtFree: { fr: 'mois jusqu’à être sans dettes', en: 'months to debt-free' },
    totalInterest: { fr: 'intérêts totaux estimés', en: 'estimated total interest' },
    order: { fr: 'ordre de remboursement', en: 'repayment order' },
    none: { fr: 'Aucune dette', en: 'No debts' }
  };
  return M[k]?.[lang] ?? k;
};

/**
 * Simulation simple mensuelle de la stratégie snowball.
 * Hypothèses:
 * - Intérêt composé mensuellement: tauxAnnuel/12
 * - Paiement minimal appliqué à toutes les dettes actives; le surplus "extra" va à la dette cible selon la méthode
 * - Lorsque la dette est à 0 (ou proche), on passe à la suivante (rollover)
 */
function simulateSnowball(debtsInput: DebtItem[], extraPerMonth: number, method: 'balance' | 'rate') {
  const debts = debtsInput
    .filter(d => d.isActive && d.balance > 0 && d.minPayment >= 0)
    .map(d => ({ ...d }));

  if (debts.length === 0) {
    return { months: 0, totalInterest: 0, order: [] as string[] };
  }

  // Déterminer l'ordre de priorité initial
  const sortFn = method === 'balance'
    ? (a: DebtItem, b: DebtItem) => a.balance - b.balance
    : (a: DebtItem, b: DebtItem) => b.ratePct - a.ratePct;

  debts.sort(sortFn);
  const orderNames = debts.map(d => d.name);

  const monthlyRates = debts.map(d => (Math.max(0, d.ratePct) / 100) / 12);
  let totalInterest = 0;
  let months = 0;

  // Limiter la simulation à 600 mois (~50 ans) par sécurité
  for (months = 0; months < 600; months++) {
    // Vérifier si tout est payé
    const remaining = debts.reduce((s, d) => s + Math.max(0, d.balance), 0);
    if (remaining <= 0.01) break;

    // Trouver première dette non soldée selon l'ordre
    const targetIdx = debts.findIndex(d => d.balance > 0.01);
    if (targetIdx === -1) break;

    // 1) Ajouter intérêts
    for (let i = 0; i < debts.length; i++) {
      if (debts[i].balance <= 0) continue;
      const interest = debts[i].balance * monthlyRates[i];
      debts[i].balance += interest;
      totalInterest += interest;
    }

    // 2) Appliquer paiements minimums
    let extra = Math.max(0, extraPerMonth);
    for (let i = 0; i < debts.length; i++) {
      if (debts[i].balance <= 0) continue;
      const pay = Math.min(debts[i].minPayment, debts[i].balance);
      debts[i].balance -= pay;
      // Si la dette ciblée est celle-ci, on ne soustrait pas de l'extra ici; l'extra est appliqué ensuite
    }

    // 3) Appliquer l'extra sur la dette ciblée
    if (targetIdx >= 0 && debts[targetIdx].balance > 0) {
      const payExtra = Math.min(extra, debts[targetIdx].balance);
      debts[targetIdx].balance -= payExtra;
      extra -= payExtra;
    }

    // S'il reste de l'extra (rare si minPayment très élevé), cascade vers dettes suivantes
    let idx = targetIdx + 1;
    while (extra > 0.01 && idx < debts.length) {
      if (debts[idx].balance > 0) {
        const pay = Math.min(extra, debts[idx].balance);
        debts[idx].balance -= pay;
        extra -= pay;
      }
      idx++;
    }
  }

  return {
    months: months >= 600 ? 600 : months,
    totalInterest: Math.max(0, totalInterest),
    order: orderNames
  };
}

const DebtSnowballWizard: React.FC<Props> = ({ language, state, onChange }) => {
  const isFr = language === 'fr';
  const debts = state.debts || [];
  const method = state.method || 'balance';
  const extra = state.extraPerMonth || 0;

  const { months, totalInterest, order } = useMemo(() => {
    return simulateSnowball(debts, extra, method);
  }, [debts, extra, method]);

  const addDebt = () => {
    const id = `debt-${Date.now()}`;
    const next: DebtItem = {
      id,
      name: isFr ? 'Nouvelle dette' : 'New debt',
      balance: 0,
      ratePct: 0,
      minPayment: 0,
      isActive: true
    };
    onChange({ ...state, debts: [...debts, next] });
  };

  const updateDebt = (id: string, patch: Partial<DebtItem>) => {
    const next = debts.map(d => (d.id === id ? { ...d, ...patch } : d));
    onChange({ ...state, debts: next });
  };

  const removeDebt = (id: string) => {
    const next = debts.filter(d => d.id !== id);
    onChange({ ...state, debts: next });
  };

  const setMethod = (m: 'balance' | 'rate') => {
    onChange({ ...state, method: m });
  };

  const setExtra = (v: number) => {
    onChange({ ...state, extraPerMonth: v });
  };

  return (
    <Card className="bg-white border-2 border-gray-300">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">{t('title', language)}</CardTitle>
        <CardDescription>{t('subtitle', language)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-purple-200 bg-purple-50 text-purple-900">
          <AlertDescription>{t('helper', language)}</AlertDescription>
        </Alert>

        {/* Options globales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-gray-800">{t('method', language)}</Label>
            <Select
              value={method}
              onValueChange={(v) => setMethod(v as 'balance' | 'rate')}
            >
              <SelectTrigger className="bg-white border-slate-300 text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300">
                <SelectItem value="balance">{t('byBalance', language)}</SelectItem>
                <SelectItem value="rate">{t('byRate', language)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-800">{t('extra', language)}</Label>
            <MoneyInput
              value={extra}
              onChange={setExtra}
              className="bg-white border-slate-300 text-gray-900"
              placeholder="0"
              allowDecimals={true}
            />
          </div>
          <div className="flex items-end justify-end">
            <Button onClick={addDebt} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {t('addDebt', language)}
            </Button>
          </div>
        </div>

        {/* Liste des dettes */}
        <div className="space-y-3">
          {debts.length === 0 && (
            <div className="text-sm text-gray-600">{t('none', language)}</div>
          )}
          {debts.map(d => (
            <div key={d.id} className="grid grid-cols-12 gap-3 items-end p-3 bg-gray-50 rounded-lg border">
              <div className="col-span-3">
                <Label className="text-gray-800">{t('name', language)}</Label>
                <Input
                  value={d.name}
                  onChange={(e) => updateDebt(d.id, { name: e.target.value })}
                  className="bg-white border-slate-300 text-gray-900"
                  placeholder={isFr ? 'ex.: Carte Visa' : 'e.g., Visa card'}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-gray-800">{t('balance', language)}</Label>
                <MoneyInput
                  value={d.balance}
                  onChange={(v) => updateDebt(d.id, { balance: v })}
                  className="bg-white border-slate-300 text-gray-900"
                  placeholder="0"
                  allowDecimals={true}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-gray-800">{t('rate', language)}</Label>
                <Input
                  type="number"
                  value={d.ratePct}
                  onChange={(e) => updateDebt(d.id, { ratePct: Number(e.target.value) })}
                  className="bg-white border-slate-300 text-gray-900"
                  placeholder="0"
                  min={0}
                  step="0.01"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-gray-800">{t('min', language)}</Label>
                <MoneyInput
                  value={d.minPayment}
                  onChange={(v) => updateDebt(d.id, { minPayment: v })}
                  className="bg-white border-slate-300 text-gray-900"
                  placeholder="0"
                  allowDecimals={true}
                />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <Badge variant={d.isActive ? 'default' : 'secondary'} className={d.isActive ? 'bg-green-600' : 'bg-gray-400'}>
                  {d.isActive ? (isFr ? 'active' : 'active') : (isFr ? 'inactif' : 'inactive')}
                </Badge>
                <Button
                  variant="outline"
                  onClick={() => updateDebt(d.id, { isActive: !d.isActive })}
                >
                  {d.isActive ? (isFr ? 'Désactiver' : 'Deactivate') : (isFr ? 'Activer' : 'Activate')}
                </Button>
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => removeDebt(d.id)}
                  title={t('remove', language)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé du plan */}
        <Card className="bg-gray-50 border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">{t('planSummary', language)}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-blue-600" />
              <div className="text-gray-800">
                {t('monthsToDebtFree', language)}: <strong>{months}</strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-600" />
              <div className="text-gray-800">
                {t('totalInterest', language)}:{' '}
                <strong>{formatCurrencyLocale(totalInterest, language)}</strong>
              </div>
            </div>
            <div className="text-gray-800">
              {t('order', language)}:{' '}
              {order.length ? order.join(' → ') : (isFr ? '—' : '—')}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default DebtSnowballWizard;
