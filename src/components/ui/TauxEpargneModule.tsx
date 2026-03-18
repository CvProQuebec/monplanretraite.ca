import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PiggyBank, TrendingUp } from 'lucide-react';

const ASSUMED_YEARS_TO_RETIREMENT = 25;
const HYPOTHETICAL_RETURN = 0.05;

const formatCurrency = (value: number) =>
  value.toLocaleString('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  });

const formatPercent = (value: number) => `${value.toFixed(1).replace('.', ',')} %`;

const futureValueOfMonthlySavings = (monthlySavings: number, years: number, annualRate: number) => {
  const monthlyRate = annualRate / 12;
  const months = years * 12;

  if (monthlyRate === 0) {
    return monthlySavings * months;
  }

  return monthlySavings * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
};

const getInterpretation = (rate: number) => {
  if (rate < 5) {
    return {
      color: 'var(--mpr-error)',
      background: '#fef2f2',
      border: 'rgba(220, 38, 38, 0.22)',
      message: 'Votre taux d’épargne est insuffisant pour assurer votre retraite.',
    };
  }

  if (rate < 10) {
    return {
      color: 'var(--mpr-warning)',
      background: '#fff7ed',
      border: 'rgba(217, 119, 6, 0.22)',
      message: 'Bien, mais augmentez progressivement vers 15 %.',
    };
  }

  if (rate <= 20) {
    return {
      color: 'var(--mpr-success)',
      background: '#f0fdf4',
      border: 'rgba(22, 163, 74, 0.22)',
      message: 'Excellent taux d’épargne. Vous êtes sur la bonne voie.',
    };
  }

  return {
    color: '#166534',
    background: '#ecfdf5',
    border: 'rgba(22, 101, 52, 0.22)',
    message: 'Taux exceptionnel. Vérifiez que vous maximisez vos comptes enregistrés en priorité.',
  };
};

export const TauxEpargneModule: React.FC = () => {
  const [monthlyNetIncome, setMonthlyNetIncome] = useState(5000);
  const [monthlySavings, setMonthlySavings] = useState(750);

  const savingsRate = useMemo(() => {
    if (monthlyNetIncome <= 0) return 0;
    return (monthlySavings / monthlyNetIncome) * 100;
  }, [monthlyNetIncome, monthlySavings]);

  const projectedSavings = useMemo(
    () => futureValueOfMonthlySavings(monthlySavings, ASSUMED_YEARS_TO_RETIREMENT, HYPOTHETICAL_RETURN),
    [monthlySavings]
  );

  const interpretation = getInterpretation(savingsRate);

  return (
    <div className="w-full space-y-5" style={{ color: 'var(--mpr-text)' }}>
      <Card
        className="overflow-hidden border"
        style={{
          borderColor: 'var(--mpr-border)',
          borderRadius: 'var(--senior-radius-xl, 16px)',
          boxShadow: 'var(--senior-shadow-lg)',
          background:
            'radial-gradient(circle at top right, rgba(227, 242, 253, 0.8), transparent 28%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <CardHeader className="space-y-3 p-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded-xl border"
              style={{
                borderColor: 'rgba(76, 110, 245, 0.2)',
                background: 'rgba(76, 110, 245, 0.08)',
                color: 'var(--mpr-primary)',
              }}
            >
              <PiggyBank className="h-6 w-6" />
            </div>
            <div>
              <CardTitle
                className="text-[24px] font-semibold leading-[1.35]"
                style={{ color: 'var(--mpr-h2)', letterSpacing: '0.025em' }}
              >
                Calculateur du taux d&apos;épargne
              </CardTitle>
              <CardDescription
                className="mt-2 text-[18px] leading-[1.6]"
                style={{ color: 'var(--mpr-text-muted)' }}
              >
                Mesurez rapidement la part de votre revenu net que vous consacrez à votre avenir financier.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-6 pt-0">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="monthly-net-income" className="text-[18px] font-semibold">
                Revenu mensuel net (après impôt)
              </Label>
              <Input
                id="monthly-net-income"
                type="number"
                min={0}
                step={100}
                value={monthlyNetIncome}
                onChange={(event) => setMonthlyNetIncome(Math.max(0, Number(event.target.value) || 0))}
                className="min-h-14 text-[18px] font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly-savings" className="text-[18px] font-semibold">
                Total des épargnes mensuelles
              </Label>
              <Input
                id="monthly-savings"
                type="number"
                min={0}
                step={50}
                value={monthlySavings}
                onChange={(event) => setMonthlySavings(Math.max(0, Number(event.target.value) || 0))}
                className="min-h-14 text-[18px] font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div
              className="rounded-xl border p-5"
              style={{
                borderColor: 'rgba(76, 110, 245, 0.22)',
                background: '#f0f9ff',
              }}
            >
              <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                Taux d&apos;épargne actuel
              </p>
              <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-primary)' }}>
                {formatPercent(savingsRate)}
              </p>
              <p className="mt-3 text-[18px] leading-[1.7]" style={{ color: 'var(--mpr-text)' }}>
                Pour une retraite confortable, visez au moins 10 % de votre revenu net.
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                borderColor: interpretation.border,
                background: interpretation.background,
              }}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5" style={{ color: interpretation.color }} />
                <p className="text-[20px] font-semibold" style={{ color: interpretation.color }}>
                  Interprétation
                </p>
              </div>
              <p className="mt-3 text-[18px] leading-[1.75]" style={{ color: 'var(--mpr-text)' }}>
                {interpretation.message}
              </p>
            </div>
          </div>

          <div
            className="rounded-2xl border p-5"
            style={{
              borderColor: 'var(--mpr-border)',
              background: '#ffffff',
              boxShadow: 'var(--senior-shadow)',
            }}
          >
            <p className="text-[20px] font-semibold leading-[1.5]" style={{ color: 'var(--mpr-h4)' }}>
              Projection simplifiée
            </p>
            <p className="mt-3 text-[18px] leading-[1.75]" style={{ color: 'var(--mpr-text)' }}>
              Si vous mainteniez ce taux d&apos;épargne pendant {ASSUMED_YEARS_TO_RETIREMENT} années jusqu&apos;à la retraite, votre épargne totale pourrait atteindre environ {formatCurrency(projectedSavings)} (rendement 5 % hypothétique).
            </p>
          </div>

          <p className="text-[16px] leading-[1.7]" style={{ color: 'var(--mpr-text-muted)' }}>
            Ces projections sont à titre éducatif uniquement. Consultez un planificateur financier pour une analyse personnalisée.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TauxEpargneModule;
