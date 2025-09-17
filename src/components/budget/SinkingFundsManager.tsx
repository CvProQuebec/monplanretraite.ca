import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import MoneyInput from '@/components/ui/MoneyInput';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Target, Calendar as CalendarIcon, Save, Trash2 } from 'lucide-react';
import { SinkingFund } from '@/types/budget';
import { formatCurrencyLocale } from '@/utils/localeFormat';

type Props = {
  language: 'fr' | 'en';
  funds: SinkingFund[];
  onChange: (next: SinkingFund[]) => void;
};

const t = (k: string, lang: 'fr' | 'en') => {
  const M: Record<string, { fr: string; en: string }> = {
    title: { fr: 'Objectifs planifiés (sinking funds)', en: 'Planned goals (sinking funds)' },
    subtitle: { fr: 'Outils pour prévoir et répartir vos projets sur plusieurs mois', en: 'Tools to plan and spread your projects across months' },
    helper: { fr: 'Exemples: taxes municipales, voyage, réparations importantes. Entrez une échéance et un montant cible, nous calculons le montant mensuel requis.', en: 'Examples: property taxes, travel, major repairs. Enter a due date and a target amount; we compute the monthly amount required.' },
    name: { fr: 'nom du projet', en: 'project name' },
    goal: { fr: 'montant cible', en: 'target amount' },
    due: { fr: 'échéance (AAAA-MM ou AAAA-MM-JJ)', en: 'due date (YYYY-MM or YYYY-MM-DD)' },
    monthly: { fr: 'mensualité requise', en: 'required monthly' },
    saved: { fr: 'déjà épargné', en: 'already saved' },
    add: { fr: 'ajouter un objectif', en: 'add goal' },
    empty: { fr: 'Aucun objectif', en: 'No goals' },
    save: { fr: 'Enregistrer', en: 'Save' },
    remove: { fr: 'Retirer', en: 'Remove' }
  };
  return M[k]?.[lang] ?? k;
};

function monthsBetween(nowISO: string, dueISO: string): number {
  // Interpret YYYY-MM or YYYY-MM-DD
  try {
    const now = new Date(nowISO.split('T')[0] + 'T00:00:00');
    const [y, m, d] = dueISO.split('-').map(Number);
    const due = new Date(y, (m || 1) - 1, d || 1);
    let months = (due.getFullYear() - now.getFullYear()) * 12 + (due.getMonth() - now.getMonth());
    // If due day has passed in the current month, reduce 1
    if (d && due.getDate() < now.getDate()) months -= 1;
    return Math.max(1, months);
  } catch {
    return 12;
  }
}

const SinkingFundsManager: React.FC<Props> = ({ language, funds, onChange }) => {
  const isFr = language === 'fr';
  const [nowISO] = useState(() => new Date().toISOString());

  const computeMonthly = (f: SinkingFund) => {
    const remaining = Math.max(0, (f.goalAmount || 0) - (f.saved || 0));
    const months = monthsBetween(nowISO, f.dueDate || new Date().toISOString().slice(0, 10));
    return remaining / months;
  };

  const enrichedFunds = useMemo(() => {
    return (funds || []).map(f => ({
      ...f,
      monthlyRequired: Math.max(0, Math.round(computeMonthly(f)))
    }));
  }, [funds]);

  const addFund = () => {
    const id = `sf-${Date.now()}`;
    const next: SinkingFund = {
      id,
      name: isFr ? 'Nouveau projet' : 'New goal',
      goalAmount: 0,
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 6, 1).toISOString().slice(0, 10),
      monthlyRequired: 0,
      saved: 0
    };
    onChange([...(funds || []), next]);
  };

  const updateFund = (id: string, patch: Partial<SinkingFund>) => {
    const next = (funds || []).map(f => (f.id === id ? { ...f, ...patch } : f));
    onChange(next);
  };

  const removeFund = (id: string) => {
    onChange((funds || []).filter(f => f.id !== id));
  };

  // Prefill integration: consume any pending prefill (from ContextualTipsPanel) once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('sinking-prefill');
      if (!raw) return;
      const payload = JSON.parse(raw);
      const toAdd = Array.isArray(payload?.funds) ? payload.funds : [];
      if (!toAdd.length) return;

      const existingNames = new Set((funds || []).map(f => (f.name || '').toLowerCase().trim()));
      const merged = [
        ...(funds || []),
        ...toAdd.filter((f: any) => {
          const nm = (f?.name || '').toLowerCase().trim();
          return nm && !existingNames.has(nm);
        })
      ];

      if (merged.length !== (funds || []).length) {
        onChange(merged);
      }
    } catch {
      // ignore parse errors
    } finally {
      // Clear prefill so it doesn't re-apply
      localStorage.removeItem('sinking-prefill');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className="bg-white border-2 border-gray-300">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          {t('title', language)}
        </CardTitle>
        <CardDescription>{t('subtitle', language)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-indigo-200 bg-indigo-50 text-indigo-900">
          <AlertDescription>{t('helper', language)}</AlertDescription>
        </Alert>

        <div className="flex justify-end">
          <Button onClick={addFund} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            {t('add', language)}
          </Button>
        </div>

        {(enrichedFunds.length === 0) && (
          <div className="text-sm text-gray-600">{t('empty', language)}</div>
        )}

        <div className="space-y-3">
          {enrichedFunds.map(f => (
            <div key={f.id} className="grid grid-cols-12 gap-3 items-end p-3 bg-gray-50 rounded-lg border">
              <div className="col-span-4">
                <Label className="text-gray-800">{t('name', language)}</Label>
                <Input
                  value={f.name}
                  onChange={(e) => updateFund(f.id, { name: e.target.value })}
                  className="bg-white border-slate-300 text-gray-900"
                  placeholder={isFr ? 'ex.: Taxes municipales 2026' : 'e.g., Property taxes 2026'}
                />
              </div>
              <div className="col-span-3">
                <Label className="text-gray-800">{t('goal', language)}</Label>
                <MoneyInput
                  value={f.goalAmount || 0}
                  onChange={(v) => updateFund(f.id, { goalAmount: v })}
                  className="bg-white border-slate-300 text-gray-900"
                  placeholder="0"
                  allowDecimals={true}
                />
              </div>
              <div className="col-span-3">
                <Label className="text-gray-800">{t('due', language)}</Label>
                <Input
                  value={f.dueDate}
                  onChange={(e) => updateFund(f.id, { dueDate: e.target.value })}
                  className="bg-white border-slate-300 text-gray-900"
                  placeholder={isFr ? 'AAAA-MM' : 'YYYY-MM'}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-gray-800">{t('monthly', language)}</Label>
                <div className="font-semibold text-indigo-700">
                  {formatCurrencyLocale(f.monthlyRequired || 0, language)}
                </div>
              </div>
              <div className="col-span-3">
                <Label className="text-gray-800">{t('saved', language)}</Label>
                <MoneyInput
                  value={f.saved || 0}
                  onChange={(v) => updateFund(f.id, { saved: v })}
                  className="bg-white border-slate-300 text-gray-900"
                  placeholder="0"
                  allowDecimals={true}
                />
              </div>
              <div className="col-span-9 flex justify-end gap-2">
                <Button
                  variant="destructive"
                  onClick={() => removeFund(f.id)}
                  className=""
                  title={t('remove', language)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('remove', language)}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SinkingFundsManager;
