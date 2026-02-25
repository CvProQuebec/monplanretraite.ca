// src/features/retirement/components/RRQQuickCompare.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Info, Flag, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatCurrencyOQLF } from '@/utils/localeFormat';

// Simple EN-CA currency formatter
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

// Approximate CPP/RRQ uplift rules used in prior service logic (educational quick compare)
// - Reduction: 0.6% per month before 65
// - Uplift: 0.7% per month after 65 (up to 72 here as per project spec)
function estimateAtAgeFromKnown(currentAge: number, knownMonthlyAtCurrent: number, targetAge: number): number {
  if (!knownMonthlyAtCurrent || currentAge <= 0 || targetAge <= 0) return 0;

  let baseAt65 = knownMonthlyAtCurrent;
  if (currentAge < 65) {
    const monthsTo65 = (65 - currentAge) * 12;
    const reduction = monthsTo65 * 0.006; // 0.6%/mo before 65
    baseAt65 = knownMonthlyAtCurrent / (1 - reduction);
  } else if (currentAge > 65) {
    const monthsAfter65 = (currentAge - 65) * 12;
    const uplift = monthsAfter65 * 0.007; // 0.7%/mo after 65
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

export default function RRQQuickCompare() {
  const { userData } = useRetirementData();
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  const age1 = useMemo(() => calcAge(userData?.personal?.naissance1), [userData?.personal?.naissance1]);
  const age2 = useMemo(() => calcAge(userData?.personal?.naissance2), [userData?.personal?.naissance2]);

  const now1 = userData?.retirement?.rrqMontantActuel1 || 0; // monthly
  const now2 = userData?.retirement?.rrqMontantActuel2 || 0;
  const nowTotal = now1 + now2;

  // Prefer provided 70 amounts if present, else estimate
  const at70_1 = userData?.retirement?.rrqMontant70_1 || estimateAtAgeFromKnown(age1, now1, 70);
  const at70_2 = userData?.retirement?.rrqMontant70_2 || estimateAtAgeFromKnown(age2, now2, 70);
  const at70 = at70_1 + at70_2;

  // 72 estimation (project spec includes 72)
  const at72_1 = estimateAtAgeFromKnown(age1, now1, 72);
  const at72_2 = estimateAtAgeFromKnown(age2, now2, 72);
  const at72 = at72_1 + at72_2;

  // Simple break-even (years) based on monthly differences (educational)
  const delta70 = at70 - nowTotal;
  const delta72 = at72 - nowTotal;
  // Assume 12 months per year, rough threshold of "foregone months until 70/72"
  const monthsForegone70 = Math.max(0, (70 - Math.max(age1, age2)) * 12);
  const monthsForegone72 = Math.max(0, (72 - Math.max(age1, age2)) * 12);
  const beYears70 = delta70 > 0 ? Math.ceil((nowTotal * monthsForegone70) / (delta70 * 12)) : null;
  const beYears72 = delta72 > 0 ? Math.ceil((nowTotal * monthsForegone72) / (delta72 * 12)) : null;

  const fmt = (v: number) => (isFrench ? formatCurrencyOQLF(v) : formatCurrencyEN(v));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-mpr-interactive" />
            {isFrench ? 'Comparateur RRQ/CPP — maintenant vs 70/72' : 'RRQ/CPP Quick Compare — now vs 70/72'}
          </CardTitle>
          <CardDescription>
            {isFrench
              ? 'Outil éducatif pour visualiser l’impact d’un report des prestations (montants mensuels).'
              : 'Educational tool to visualize the impact of deferring benefits (monthly amounts).'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-white">
            <div className="text-sm text-gray-600">{isFrench ? 'Commencer maintenant' : 'Start now'}</div>
            <div className="text-2xl font-bold text-mpr-navy">{fmt(nowTotal)}</div>
            <Badge variant="outline" className="mt-2">
              {isFrench ? 'Mensuel (ménage)' : 'Monthly (household)'}
            </Badge>
          </div>

          <div className="p-4 border rounded-lg bg-white">
            <div className="text-sm text-gray-600">{isFrench ? 'Reporter à 70 ans' : 'Defer to 70'}</div>
            <div className="text-2xl font-bold text-emerald-700">{fmt(at70)}</div>
            <div className="text-xs text-gray-600 mt-1">
              {isFrench ? 'Différence vs maintenant' : 'Difference vs now'} :{' '}
              <span className={delta70 >= 0 ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}>
                {fmt(delta70)}
              </span>
            </div>
            {beYears70 !== null && beYears70 !== Infinity && (
              <div className="text-xs text-gray-600">
                {isFrench ? 'Années seuil de rentabilité' : 'Break-even years'} :{' '}
                <span className="font-semibold">{beYears70}</span>
              </div>
            )}
          </div>

          <div className="p-4 border rounded-lg bg-white">
            <div className="text-sm text-gray-600">{isFrench ? 'Reporter à 72 ans' : 'Defer to 72'}</div>
            <div className="text-2xl font-bold text-emerald-700">{fmt(at72)}</div>
            <div className="text-xs text-gray-600 mt-1">
              {isFrench ? 'Différence vs maintenant' : 'Difference vs now'} :{' '}
              <span className={delta72 >= 0 ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}>
                {fmt(delta72)}
              </span>
            </div>
            {beYears72 !== null && beYears72 !== Infinity && (
              <div className="text-xs text-gray-600">
                {isFrench ? 'Années seuil de rentabilité' : 'Break-even years'} :{' '}
                <span className="font-semibold">{beYears72}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Alert className="border-mpr-border bg-mpr-interactive-lt">
        <Info className="h-4 w-4 text-mpr-interactive" />
        <AlertDescription className="text-mpr-navy">
          {isFrench
            ? 'Information éducative seulement : ces montants sont estimatifs et n’incluent pas tous les paramètres officiels. Utilisez l’analyse détaillée RRQ/CPP pour une décision.'
            : 'Educational information only: these amounts are estimates and may not reflect all official parameters. Use the detailed RRQ/CPP analysis before deciding.'}
        </AlertDescription>
      </Alert>

      {nowTotal === 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            {isFrench
              ? 'Aucun montant RRQ/CPP courant détecté. Ajoutez vos montants pour une comparaison plus précise.'
              : 'No current RRQ/CPP amount detected. Add your amounts for a more accurate comparison.'}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            {isFrench ? 'Recommandation pédagogique' : 'Educational recommendation'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          {isFrench ? (
            <ul className="list-disc pl-5 space-y-1">
              <li>Testez votre plan avec un coussin de liquidités (3–5 ans) pour réduire le risque de séquence.</li>
              <li>Comparez aussi les impacts fiscaux et la longévité attendue.</li>
              <li>Utilisez le simulateur Monte Carlo pour mettre à l’épreuve votre choix (onglet “Simulateur”).</li>
            </ul>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              <li>Test your plan with a 3–5 year cash cushion to reduce sequence risk.</li>
              <li>Also compare tax impacts and expected longevity.</li>
              <li>Use the Monte Carlo Simulator to put your choice to the test.</li>
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
