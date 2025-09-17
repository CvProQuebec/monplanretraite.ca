import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import MoneyInput from '@/components/ui/MoneyInput';
import { Shield, Target } from 'lucide-react';
import { formatCurrencyLocale } from '@/utils/localeFormat';

type Props = {
  language: 'fr' | 'en';
  // Montant mensuel de besoins (utiliser les "needs" du 50/30/20)
  monthlyNeeds: number;
  // Montant déjà accumulé (budgetData.emergencyFund existant)
  currentSaved: number;
  onSavedChange?: (next: number) => void;
  // Persistance cible (stockée dans budgetSettings via parent, on utilise any pour compat TS)
  monthsTarget?: number; // 3 à 12
  onMonthsTargetChange?: (next: number) => void;
};

const t = (k: string, lang: 'fr' | 'en') => {
  const M: Record<string, { fr: string; en: string }> = {
    title: { fr: 'Fonds d’urgence', en: 'Emergency fund' },
    subtitle: { fr: 'Sécurité financière en cas d’imprévu', en: 'Financial safety in case of emergencies' },
    monthsLabel: { fr: 'cible en mois (3 à 12)', en: 'target in months (3 to 12)' },
    targetAmount: { fr: 'montant cible', en: 'target amount' },
    currentSaved: { fr: 'montant épargné', en: 'amount saved' },
    progress: { fr: 'progression', en: 'progress' },
    info: { fr: 'Recommandation : 3 mois (revenus stables) à 12 mois (revenus irréguliers).', en: 'Recommendation: 3 months (stable income) to 12 months (irregular income).' }
  };
  return M[k]?.[lang] ?? k;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(v)));

const EmergencyFundCard: React.FC<Props> = ({
  language,
  monthlyNeeds,
  currentSaved,
  onSavedChange,
  monthsTarget = 3,
  onMonthsTargetChange
}) => {
  const [localMonths, setLocalMonths] = useState(clamp(monthsTarget, 3, 12));
  const [localSaved, setLocalSaved] = useState(Math.max(0, currentSaved || 0));

  useEffect(() => {
    setLocalMonths(clamp(monthsTarget || 3, 3, 12));
  }, [monthsTarget]);

  useEffect(() => {
    setLocalSaved(Math.max(0, currentSaved || 0));
  }, [currentSaved]);

  const targetAmount = useMemo(() => {
    const needs = Math.max(0, monthlyNeeds || 0);
    return needs * localMonths;
  }, [monthlyNeeds, localMonths]);

  const progressPct = useMemo(() => {
    if (targetAmount <= 0) return 0;
    return Math.max(0, Math.min(100, (localSaved / targetAmount) * 100));
  }, [localSaved, targetAmount]);

  return (
    <Card className="bg-white border-2 border-gray-300">
      <CardHeader className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          <CardTitle className="text-xl text-gray-900">{t('title', language)}</CardTitle>
        </div>
        <CardDescription>
          {t('subtitle', language)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cible en mois */}
        <div>
          <Label className="text-gray-800">{t('monthsLabel', language)}</Label>
          <div className="flex items-center gap-4 mt-2">
            <Slider
              defaultValue={[localMonths]}
              min={3}
              max={12}
              step={1}
              onValueChange={(val) => {
                const next = clamp(val[0], 3, 12);
                setLocalMonths(next);
                onMonthsTargetChange?.(next);
              }}
              className="w-full"
            />
            <div className="min-w-[48px] text-right font-semibold text-gray-900">{localMonths}</div>
          </div>
          <div className="text-xs text-gray-600 mt-1">{t('info', language)}</div>
        </div>

        {/* Montant cible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="bg-gray-50 border rounded-md p-3">
            <div className="flex items-center gap-2 text-gray-800">
              <Target className="w-4 h-4 text-indigo-600" />
              <span className="font-medium">{t('targetAmount', language)}</span>
            </div>
            <div className="text-2xl font-bold text-indigo-700 mt-1">
              {formatCurrencyLocale(targetAmount, language)}
            </div>
          </div>

          {/* Montant épargné (éditable) */}
          <div>
            <Label className="text-gray-800">{t('currentSaved', language)}</Label>
            <MoneyInput
              value={localSaved}
              onChange={(v) => {
                setLocalSaved(v);
                onSavedChange?.(v);
              }}
              className="bg-white border-slate-300 text-gray-900"
              placeholder="0"
              allowDecimals={true}
            />
          </div>
        </div>

        {/* Progression */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700">{t('progress', language)}</span>
            <span className="text-sm font-semibold text-emerald-700">{Math.round(progressPct)}%</span>
          </div>
          <Progress value={progressPct} className="w-full h-3" />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyFundCard;
