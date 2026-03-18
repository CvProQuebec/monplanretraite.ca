import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Percent, WalletCards } from 'lucide-react';

const formatCurrency = (value: number) =>
  value.toLocaleString('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  });

export const Regle70PourcentModule: React.FC = () => {
  const [grossPreRetirementIncome, setGrossPreRetirementIncome] = useState(85000);

  const calculation = useMemo(() => {
    const retirementTarget = grossPreRetirementIncome * 0.7;
    const estimatedRrq = Math.min(retirementTarget * 0.28, 18000);
    const estimatedSv = Math.min(retirementTarget * 0.17, 9000);
    const savingsNeeded = Math.max(retirementTarget - estimatedRrq - estimatedSv, 0);

    return {
      retirementTarget,
      estimatedRrq,
      estimatedSv,
      savingsNeeded,
    };
  }, [grossPreRetirementIncome]);

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
              <Percent className="h-6 w-6" />
            </div>
            <div>
              <CardTitle
                className="text-[24px] font-semibold leading-[1.35]"
                style={{ color: 'var(--mpr-h2)', letterSpacing: '0.025em' }}
              >
                Calculateur Règle du 70 %
              </CardTitle>
              <CardDescription
                className="mt-2 text-[18px] leading-[1.6]"
                style={{ color: 'var(--mpr-text-muted)' }}
              >
                Un repère rapide pour estimer le revenu annuel brut à viser à la retraite.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-6 pt-0">
          <div className="space-y-2">
            <Label htmlFor="gross-income-before-retirement" className="text-[18px] font-semibold">
              Revenu annuel brut avant la retraite
            </Label>
            <Input
              id="gross-income-before-retirement"
              type="number"
              min={0}
              step={1000}
              value={grossPreRetirementIncome}
              onChange={(event) => setGrossPreRetirementIncome(Math.max(0, Number(event.target.value) || 0))}
              className="min-h-14 text-[18px] font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
            <div
              className="rounded-xl border p-5"
              style={{
                borderColor: 'rgba(76, 110, 245, 0.22)',
                background: '#f0f9ff',
              }}
            >
              <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                Objectif de revenu à la retraite (70 %)
              </p>
              <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-primary)' }}>
                {formatCurrency(calculation.retirementTarget)}
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                borderColor: 'var(--mpr-border)',
                background: '#ffffff',
              }}
            >
              <div className="flex items-center gap-2">
                <WalletCards className="h-5 w-5" style={{ color: 'var(--mpr-primary)' }} />
                <p className="text-[18px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>
                  Répartition estimée
                </p>
              </div>
              <div className="mt-4 space-y-3 text-[18px] leading-[1.7]">
                <div className="flex items-center justify-between gap-4">
                  <span>RRQ estimée</span>
                  <strong>{formatCurrency(calculation.estimatedRrq)}</strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>SV estimée</span>
                  <strong>{formatCurrency(calculation.estimatedSv)}</strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Épargne personnelle requise</span>
                  <strong>{formatCurrency(calculation.savingsNeeded)}</strong>
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl border p-5"
            style={{
              borderColor: 'rgba(217, 119, 6, 0.25)',
              background: '#fff7ed',
            }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0" style={{ color: 'var(--mpr-warning)' }} />
              <div className="space-y-3">
                <p className="text-[18px] leading-[1.75]" style={{ color: 'var(--mpr-text)' }}>
                  La règle du 70 % est une approximation générale. Elle ne s&apos;applique pas à tous. Votre objectif réel peut être inférieur si vos dépenses diminuent à la retraite (hypothèque remboursée, enfants autonomes), ou supérieur si vous prévoyez voyager ou avez des besoins de santé particuliers.
                </p>
                <a
                  href="/budget"
                  className="inline-flex min-h-12 items-center text-[18px] font-semibold no-underline"
                  style={{ color: 'var(--mpr-primary)' }}
                >
                  → Calculateur de budget retraite
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Regle70PourcentModule;
