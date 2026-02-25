// src/features/retirement/components/RRQDelaySimulator.tsx
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Slider } from '@/components/ui/slider';
import { Info, Clock, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrencyOQLF } from '@/utils/localeFormat';

// EN-CA formatter
const formatCurrencyEN = (value: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 2 }).format(
    isFinite(value) ? value : 0
  );

function calcAge(dateISO?: string): number {
  if (!dateISO) return 0;
  const birth = new Date(dateISO);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return Math.max(0, age);
}

// Educational estimation: 0.6%/mo reduction before 65, 0.7%/mo uplift after 65
function estimateAtAgeFromKnown(currentAge: number, knownMonthlyAtCurrent: number, targetAge: number): number {
  if (!knownMonthlyAtCurrent || currentAge <= 0 || targetAge <= 0) return 0;

  let baseAt65 = knownMonthlyAtCurrent;
  if (currentAge < 65) {
    const monthsTo65 = (65 - currentAge) * 12;
    const reduction = monthsTo65 * 0.006;
    baseAt65 = knownMonthlyAtCurrent / (1 - reduction);
  } else if (currentAge > 65) {
    const monthsAfter65 = (currentAge - 65) * 12;
    const uplift = monthsAfter65 * 0.007;
    baseAt65 = knownMonthlyAtCurrent / (1 + uplift);
  }

  if (targetAge === 65) return baseAt65;
  if (targetAge > 65) {
    const months = (targetAge - 65) * 12;
    return baseAt65 * (1 + 0.007 * months);
  } else {
    const months = (65 - targetAge) * 12;
    return baseAt65 * (1 - 0.006 * months);
  }
}

export default function RRQDelaySimulator() {
  const { userData } = useRetirementData();
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  const age1 = useMemo(() => calcAge(userData?.personal?.naissance1), [userData?.personal?.naissance1]);
  const age2 = useMemo(() => calcAge(userData?.personal?.naissance2), [userData?.personal?.naissance2]);

  const now1 = userData?.retirement?.rrqMontantActuel1 || 0; // monthly
  const now2 = userData?.retirement?.rrqMontantActuel2 || 0;

  // Delay control (months), up to 84 months (7 years) consistent with 72 feature
  const [delayMonths, setDelayMonths] = useState<number>(24);

  // Target ages based on delay from current ages
  const targetAge1 = age1 + delayMonths / 12;
  const targetAge2 = age2 + delayMonths / 12;

  const est1 = estimateAtAgeFromKnown(age1, now1, targetAge1);
  const est2 = estimateAtAgeFromKnown(age2, now2, targetAge2);
  const estTotal = est1 + est2;
  const nowTotal = now1 + now2;

  const deltaMonthly = estTotal - nowTotal; // monthly difference if deferred by delayMonths
  // Simple educational "foregone months" notion: total months of deferral for the older person (worst case)
  const monthsForegone = delayMonths;
  const breakEvenYears = deltaMonthly > 0 ? Math.ceil(((nowTotal * monthsForegone) / (deltaMonthly * 12))) : null;

  const fmt = (v: number) => (isFrench ? formatCurrencyOQLF(v) : formatCurrencyEN(v));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-mpr-interactive" />
            {isFrench ? 'Simulateur — reporter de X mois (RRQ/CPP)' : 'Simulator — defer by X months (RRQ/CPP)'}
          </CardTitle>
          <CardDescription>
            {isFrench
              ? 'Outil éducatif: estime les montants mensuels si vous différez de quelques mois.'
              : 'Educational tool: estimates monthly amounts if you defer by a number of months.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Delay slider */}
          <div className="p-4 border rounded-lg bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {isFrench ? 'Mois de report' : 'Months of deferral'}
                </span>
              </div>
              <div className="text-xl font-bold text-mpr-navy">{delayMonths}</div>
            </div>
            <div className="px-2">
              <Slider
                defaultValue={[delayMonths]}
                min={0}
                max={84}
                step={1}
                onValueChange={(v) => setDelayMonths(v[0] ?? 0)}
                aria-label={isFrench ? 'Mois de report' : 'Months of deferral'}
              />
            </div>
            <div className="text-xs text-gray-600 mt-2">
              {isFrench
                ? 'Plage: 0 à 84 mois (jusqu’à environ 72 ans).'
                : 'Range: 0 to 84 months (up to approx. age 72).'}
            </div>
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-white">
              <div className="text-sm text-gray-600">{isFrench ? 'Montant actuel' : 'Current amount'}</div>
              <div className="text-2xl font-bold text-mpr-navy">{fmt(nowTotal)}</div>
              <div className="text-xs text-gray-600 mt-1">
                {isFrench ? 'Mensuel (ménage)' : 'Monthly (household)'}
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <div className="text-sm text-gray-600">
                {isFrench ? 'Montant estimé après report' : 'Estimated amount after deferral'}
              </div>
              <div className="text-2xl font-bold text-emerald-700">{fmt(estTotal)}</div>
              <div className="text-xs text-gray-600 mt-1">
                {isFrench ? 'Somme des deux personnes' : 'Sum of both persons'}
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-white">
              <div className="text-sm text-gray-600">{isFrench ? 'Différence mensuelle' : 'Monthly difference'}</div>
              <div className={`text-2xl font-bold ${deltaMonthly >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {fmt(deltaMonthly)}
              </div>
              {breakEvenYears !== null && breakEvenYears !== Infinity && (
                <div className="text-xs text-gray-600 mt-1">
                  {isFrench ? 'Années seuil de rentabilité' : 'Break-even years'}:{' '}
                  <span className="font-semibold">{breakEvenYears}</span>
                </div>
              )}
            </div>
          </div>

          <Alert className="border-mpr-border bg-mpr-interactive-lt">
            <Info className="h-4 w-4 text-mpr-interactive" />
            <AlertDescription className="text-mpr-navy">
              {isFrench
                ? 'Information éducative seulement : il s’agit d’estimations simplifiées. Utilisez l’analyse détaillée RRQ/CPP pour une décision officielle.'
                : 'Educational information only: simplified estimates. Use the detailed RRQ/CPP analysis for official decisions.'}
            </AlertDescription>
          </Alert>

          <Alert className="border-amber-200 bg-amber-50">
            <TrendingUp className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              {isFrench
                ? 'Astuce: testez ce choix dans le Simulateur Monte Carlo et conservez un coussin de 3–5 ans pour réduire le risque de séquence.'
                : 'Tip: test this choice in the Monte Carlo Simulator and keep a 3–5 year cash cushion to reduce sequence risk.'}
            </AlertDescription>
          </Alert>

          {nowTotal === 0 && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                {isFrench
                  ? 'Ajoutez vos montants RRQ/CPP actuels pour obtenir une simulation plus précise.'
                  : 'Add your current RRQ/CPP amounts for a more precise simulation.'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
