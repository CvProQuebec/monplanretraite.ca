import React, { useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MoneyInput from '@/components/ui/MoneyInput';
import { BudgetSettings, DeductionItem, NetIncomeMethod } from '@/types/budget';
import { formatCurrencyLocale, enforceOqlfFrenchTitle } from '@/utils/localeFormat';

type Props = {
  language: 'fr' | 'en';
  value: BudgetSettings;
  onChange: (next: BudgetSettings) => void;
};

const DEDUCTION_TYPES: { value: DeductionItem['type']; labelFr: string; labelEn: string }[] = [
  { value: 'federal_tax', labelFr: 'impôt fédéral', labelEn: 'federal tax' },
  { value: 'provincial_tax', labelFr: 'impôt provincial', labelEn: 'provincial tax' },
  { value: 'social_security', labelFr: 'régime public (RRQ/RPC)', labelEn: 'social security (CPP/QPP)' },
  { value: 'health_insurance', labelFr: 'assurance santé', labelEn: 'health insurance' },
  { value: 'retirement', labelFr: 'retraite (REER/RRSP)', labelEn: 'retirement (RRSP)' },
  { value: 'union_dues', labelFr: 'cotisations syndicales', labelEn: 'union dues' },
  { value: 'other', labelFr: 'autre', labelEn: 'other' }
];

const t = (k: string, lang: 'fr' | 'en') => {
  const dict: Record<string, { fr: string; en: string }> = {
    title: { fr: 'Revenus et déductions', en: 'Income and deductions' },
    subtitle: { fr: 'Calculez votre revenu net de base pour le budget', en: 'Calculate your net income baseline for budgeting' },
    method: { fr: 'Méthode de revenu', en: 'Income method' },
    method_regular: { fr: 'régulier', en: 'regular' },
    method_avg12: { fr: 'moyenne 12 mois', en: '12-month average' },
    method_lowest: { fr: 'mois le plus bas', en: 'lowest month' },
    gross: { fr: 'revenu brut (par période)', en: 'gross income (per period)' },
    deductions: { fr: 'déductions', en: 'deductions' },
    add_deduction: { fr: 'ajouter une déduction', en: 'add deduction' },
    type: { fr: 'type', en: 'type' },
    amount: { fr: 'montant', en: 'amount' },
    remove: { fr: 'retirer', en: 'remove' },
    net: { fr: 'revenu net estimé (mensuel)', en: 'estimated net income (monthly)' },
    salaryFrequency: { fr: 'fréquence du salaire', en: 'salary frequency' },
    freq_weekly: { fr: 'hebdomadaire', en: 'weekly' },
    freq_biweekly: { fr: 'aux 2 semaines', en: 'bi-weekly' },
    freq_semimonthly: { fr: 'bimensuel', en: 'semi-monthly' },
    freq_monthly: { fr: 'mensuel', en: 'monthly' }
  };
  const v = dict[k]?.[lang] ?? k;
  return lang === 'fr' ? enforceOqlfFrenchTitle(v) : v.charAt(0).toUpperCase() + v.slice(1);
};

export const IncomeDeductionsForm: React.FC<Props> = ({ language, value, onChange }) => {
  const isFr = language === 'fr';
  const deductions = value.deductions ?? [];

  const currentFreq = value.grossFrequency ?? 'monthly';
  const freqName = useMemo(() => {
    switch (currentFreq) {
      case 'weekly': return t('freq_weekly', language);
      case 'biweekly': return t('freq_biweekly', language);
      case 'semimonthly': return t('freq_semimonthly', language);
      case 'monthly': default: return t('freq_monthly', language);
    }
  }, [currentFreq, language]);

  const freqFactor = (freq: NonNullable<BudgetSettings['grossFrequency']>) => {
    switch (freq) {
      case 'weekly': return 52 / 12;
      case 'biweekly': return 26 / 12;
      case 'semimonthly': return 24 / 12;
      case 'monthly': default: return 1;
    }
  };

  const net = useMemo(() => {
    const grossPeriod = value.grossIncome ?? 0;
    const period = value.grossFrequency ?? 'monthly';
    const factor = freqFactor(period);
    const monthlyGross = grossPeriod * factor;

    const totalDeductionsPeriod = (value.deductions ?? []).reduce((s, d) => s + (d.amount || 0), 0);
    const monthlyDeductions = totalDeductionsPeriod * factor;

    const netMonthly = Math.max(0, monthlyGross - monthlyDeductions);
    return netMonthly;
  }, [value.grossIncome, value.deductions, value.grossFrequency]);

  // Figures mensuelles pour résumé compact (brut/déductions) afin de limiter le scroll
  const monthlyGross = useMemo(() => {
    const period = value.grossFrequency ?? 'monthly';
    const factor = freqFactor(period);
    return (value.grossIncome ?? 0) * factor;
  }, [value.grossIncome, value.grossFrequency]);

  const monthlyDeductions = useMemo(() => {
    const period = value.grossFrequency ?? 'monthly';
    const factor = freqFactor(period);
    const totalDeductionsPeriod = (value.deductions ?? []).reduce((s, d) => s + (d.amount || 0), 0);
    return totalDeductionsPeriod * factor;
  }, [value.deductions, value.grossFrequency]);

  const update = (patch: Partial<BudgetSettings>) => {
    const next: BudgetSettings = {
      ...value,
      ...patch,
      netIncome: net
    };
    onChange(next);
  };

  const updateDeduction = (idx: number, patch: Partial<DeductionItem>) => {
    const arr = [...deductions];
    arr[idx] = { ...arr[idx], ...patch };
    update({ deductions: arr });
  };

  useEffect(() => {
    // Initialiser fréquence par défaut et déductions de base si vides
    if (!value.grossFrequency) {
      update({ grossFrequency: 'monthly' });
    }
    if ((value.deductions ?? []).length === 0) {
      update({
        deductions: [
          { type: 'other', label: isFr ? 'Impôt fédéral' : 'Federal tax', amount: 0 },
          { type: 'other', label: isFr ? 'Impôt provincial' : 'Provincial tax', amount: 0 },
          { type: 'other', label: isFr ? 'Assurance emploi' : 'Employment insurance', amount: 0 },
          { type: 'other', label: 'RRQ', amount: 0 },
          { type: 'other', label: 'RQAP', amount: 0 }
        ]
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const addDeduction = () => {
    update({
      deductions: [
        ...deductions,
        { type: 'other', label: '', amount: 0 }
      ]
    });
  };

  const removeDeduction = (idx: number) => {
    const arr = deductions.filter((_, i) => i !== idx);
    update({ deductions: arr });
  };

  return (
    <Card className="bg-white border-2 border-gray-300">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">
          {t('title', language)}
        </CardTitle>
        <CardDescription>
          {t('subtitle', language)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Résumé compact (seniors: réduire le scroll et donner les totaux clés en haut) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
          <div className="bg-slate-50 border rounded p-2 text-center">
            <div className="text-xs text-slate-600">{isFr ? 'Brut mensuel' : 'Monthly gross'}</div>
            <div className="font-semibold text-slate-800">{formatCurrencyLocale(monthlyGross, language)}</div>
          </div>
          <div className="bg-slate-50 border rounded p-2 text-center">
            <div className="text-xs text-slate-600">{isFr ? 'Déductions mensuelles' : 'Monthly deductions'}</div>
            <div className="font-semibold text-rose-700">{formatCurrencyLocale(monthlyDeductions, language)}</div>
          </div>
          <div className="bg-slate-50 border rounded p-2 text-center">
            <div className="text-xs text-slate-600">{t('net', language)}</div>
            <div className="font-semibold text-green-700">{formatCurrencyLocale(net, language)}</div>
          </div>
        </div>
        {/* Méthode */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="bg-white border rounded-md p-3">
            <Label>{t('method', language)}</Label>
            <Select
              value={value.netIncomeMethod}
              onValueChange={(v) => update({ netIncomeMethod: v as NetIncomeMethod })}
            >
              <SelectTrigger className="bg-white border-slate-300 text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300">
                <SelectItem value="regular">{t('method_regular', language)}</SelectItem>
                <SelectItem value="avg12">{t('method_avg12', language)}</SelectItem>
                <SelectItem value="lowestMonth">{t('method_lowest', language)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Fréquence du salaire */}
          <div>
            <Label>{t('salaryFrequency', language)}</Label>
            <Select
              value={value.grossFrequency ?? 'monthly'}
              onValueChange={(v) => update({ grossFrequency: v as NonNullable<BudgetSettings['grossFrequency']> })}
            >
              <SelectTrigger className="bg-white border-slate-300 text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300">
                <SelectItem value="weekly">{t('freq_weekly', language)}</SelectItem>
                <SelectItem value="biweekly">{t('freq_biweekly', language)}</SelectItem>
                <SelectItem value="semimonthly">{t('freq_semimonthly', language)}</SelectItem>
                <SelectItem value="monthly">{t('freq_monthly', language)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('gross', language)}</Label>
            <MoneyInput
              value={value.grossIncome ?? 0}
              onChange={(v) => update({ grossIncome: v })}
              className="bg-white border-slate-300 text-gray-900"
              placeholder="0"
              allowDecimals={true}
            />
            <p className="text-xs text-gray-500 mt-1">
              {isFr
                ? `Montant par période sélectionnée (${freqName}).`
                : `Amount per selected period (${freqName}).`}
            </p>
          </div>
          <div>
            <Label>{t('net', language)}</Label>
            <div className="font-semibold text-green-700 text-lg">
              {formatCurrencyLocale(net, language)}
            </div>
          </div>
        </div>

        {/* Déductions */}
          {/* En-tête compact pour colonnes (seniors: repères visuels, moins de scroll) */}
          <div className="hidden md:grid grid-cols-12 gap-2 py-2 border-y bg-white sticky top-0 z-10 text-xs text-slate-600">
            <div className="col-span-4">{t('type', language)}</div>
            <div className="col-span-4">{isFr ? 'libellé' : 'label'}</div>
            <div className="col-span-2">{t('amount', language)}</div>
            <div className="col-span-2">{isFr ? 'actions' : 'actions'}</div>
          </div>

          <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base">{t('deductions', language)}</Label>
            <Button type="button" onClick={addDeduction} className="bg-blue-600 hover:bg-blue-700">
              {t('add_deduction', language)}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            {isFr
              ? `Les déductions sont saisies par période (${freqName}) et converties automatiquement en équivalent mensuel.`
              : `Deductions are entered per period (${freqName}) and automatically converted to monthly equivalent.`}
          </p>

          <div className="space-y-3">
            {deductions.length === 0 && (
              <div className="text-sm text-gray-500">
                {isFr ? 'Aucune déduction' : 'No deductions'}
              </div>
            )}
            {deductions.map((d, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded border">
                <div className="col-span-4">
                  <Label className="sr-only">{t('type', language)}</Label>
                  <Select
                    value={d.type}
                    onValueChange={(v) => updateDeduction(idx, { type: v as DeductionItem['type'] })}
                  >
                    <SelectTrigger className="bg-white border-slate-300 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-300 shadow-md">
                      {DEDUCTION_TYPES.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {isFr ? opt.labelFr : opt.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-4">
                  <Label className="sr-only">{isFr ? 'libellé (optionnel)' : 'label (optional)'}</Label>
                  <Input
                    value={d.label ?? ''}
                    onChange={(e) => updateDeduction(idx, { label: e.target.value })}
                    className="bg-white border-slate-300 text-gray-900"
                    placeholder={isFr ? 'ex.: assurance collective' : 'e.g., group insurance'}
                  />
                </div>
                <div className="col-span-2">
                  <Label>{t('amount', language)}</Label>
                  <MoneyInput
                    value={d.amount ?? 0}
                    onChange={(v) => updateDeduction(idx, { amount: v })}
                    className="bg-white border-slate-300 text-gray-900"
                    placeholder="0"
                    allowDecimals={true}
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button type="button" variant="destructive" onClick={() => removeDeduction(idx)}>
                    {t('remove', language)}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeDeductionsForm;
