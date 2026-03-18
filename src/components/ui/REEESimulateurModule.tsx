import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, PiggyBank } from 'lucide-react';

const CESG_RATE = 0.2;
const CESG_ANNUAL_MAX = 500;
const CESG_LIFETIME_MAX = 7200;
const IQEE_RATE = 0.1;
const IQEE_ANNUAL_MAX = 250;
const IQEE_LIFETIME_MAX = 3600;
const GRANT_ELIGIBLE_CONTRIBUTION = 2500;

type ProjectionRow = {
  yearLabel: string;
  contribution: number;
  cesg: number;
  iqee: number;
  totalValue: number;
};

const formatCurrency = (value: number) =>
  value.toLocaleString('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  });

const formatPercent = (value: number) => `${value.toFixed(1).replace('.', ',')} %`;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const REEESimulateurModule: React.FC = () => {
  const [childAge, setChildAge] = useState(4);
  const [monthlyContribution, setMonthlyContribution] = useState(150);
  const [initialAnnualContribution, setInitialAnnualContribution] = useState<number | ''>('');
  const [expectedReturn, setExpectedReturn] = useState(5);

  const projection = useMemo(() => {
    const rows: ProjectionRow[] = [];
    const yearsRemaining = Math.max(18 - childAge, 0);
    const annualReturn = expectedReturn / 100;
    let value = 0;
    let totalContributions = 0;
    let totalCesg = 0;
    let totalIqee = 0;

    for (let year = 0; year < yearsRemaining; year += 1) {
      const childAgeThisYear = childAge + year;
      const annualContribution = year === 0
        ? (typeof initialAnnualContribution === 'number' ? initialAnnualContribution : 0) + monthlyContribution * 12
        : monthlyContribution * 12;

      const cesgRemaining = Math.max(CESG_LIFETIME_MAX - totalCesg, 0);
      const iqeeRemaining = Math.max(IQEE_LIFETIME_MAX - totalIqee, 0);

      const cesg = Math.min(annualContribution * CESG_RATE, CESG_ANNUAL_MAX, cesgRemaining, GRANT_ELIGIBLE_CONTRIBUTION * CESG_RATE);
      const iqee = Math.min(annualContribution * IQEE_RATE, IQEE_ANNUAL_MAX, iqeeRemaining, GRANT_ELIGIBLE_CONTRIBUTION * IQEE_RATE);

      value = (value + annualContribution + cesg + iqee) * (1 + annualReturn);
      totalContributions += annualContribution;
      totalCesg += cesg;
      totalIqee += iqee;

      rows.push({
        yearLabel: `${childAgeThisYear} à ${childAgeThisYear + 1} ans`,
        contribution: annualContribution,
        cesg,
        iqee,
        totalValue: value,
      });
    }

    return {
      rows,
      totalContributions,
      totalGrants: totalCesg + totalIqee,
      finalValue: value,
    };
  }, [childAge, monthlyContribution, initialAnnualContribution, expectedReturn]);

  const grantsShare =
    projection.finalValue > 0 ? (projection.totalGrants / projection.finalValue) * 100 : 0;

  return (
    <div className="w-full space-y-6" style={{ color: 'var(--mpr-text)' }}>
      <Card
        className="overflow-hidden border"
        style={{
          borderColor: 'var(--mpr-border)',
          borderRadius: 'var(--senior-radius-xl, 16px)',
          boxShadow: 'var(--senior-shadow-lg)',
          background:
            'radial-gradient(circle at top right, rgba(227, 242, 253, 0.85), transparent 30%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <CardHeader className="space-y-3 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded-xl border"
              style={{
                borderColor: 'rgba(76, 110, 245, 0.2)',
                background: 'rgba(76, 110, 245, 0.08)',
                color: 'var(--mpr-primary)',
              }}
            >
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <CardTitle
                className="text-[28px] font-semibold leading-[1.35]"
                style={{ color: 'var(--mpr-h2)', letterSpacing: '0.025em' }}
              >
                Simulateur REEE
              </CardTitle>
              <CardDescription
                className="mt-2 text-[18px] leading-[1.65]"
                style={{ color: 'var(--mpr-text-muted)' }}
              >
                Visualisez combien l&apos;épargne-études d&apos;un enfant peut croître avec les subventions fédérales et québécoises.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6 pt-0 md:p-8 md:pt-0">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="child-age" className="text-[18px] font-semibold">Âge actuel de l&apos;enfant</Label>
              <Input
                id="child-age"
                type="number"
                min={0}
                max={17}
                value={childAge}
                onChange={(event) => setChildAge(clamp(Number(event.target.value) || 0, 0, 17))}
                className="min-h-14 text-[18px] font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly-contribution" className="text-[18px] font-semibold">Cotisation mensuelle</Label>
              <Input
                id="monthly-contribution"
                type="number"
                min={0}
                step={25}
                value={monthlyContribution}
                onChange={(event) => setMonthlyContribution(Math.max(0, Number(event.target.value) || 0))}
                className="min-h-14 text-[18px] font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial-annual-contribution" className="text-[18px] font-semibold">Cotisation annuelle initiale</Label>
              <Input
                id="initial-annual-contribution"
                type="number"
                min={0}
                step={100}
                value={initialAnnualContribution}
                onChange={(event) => {
                  const value = event.target.value;
                  setInitialAnnualContribution(value === '' ? '' : Math.max(0, Number(value) || 0));
                }}
                placeholder="Optionnel"
                className="min-h-14 text-[18px] font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expected-return" className="text-[18px] font-semibold">Rendement prévu (%)</Label>
              <Input
                id="expected-return"
                type="number"
                min={0}
                max={12}
                step={0.1}
                value={expectedReturn}
                onChange={(event) => setExpectedReturn(clamp(Number(event.target.value) || 0, 0, 12))}
                className="min-h-14 text-[18px] font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <Card
              className="border"
              style={{
                borderColor: 'rgba(76, 110, 245, 0.22)',
                borderRadius: 'var(--senior-radius-lg, 12px)',
                boxShadow: 'var(--senior-shadow)',
                background: '#f0f9ff',
              }}
            >
              <CardHeader>
                <CardTitle className="text-[24px]" style={{ color: 'var(--mpr-h3)' }}>
                  Subvention SCEE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-[18px] leading-[1.7]">
                <p>20 % des cotisations annuelles, maximum 500 $ par année.</p>
                <p>Les subventions sont calculées sur les premières 2 500 $ cotisées par an.</p>
                <p>Maximum cumulatif SCEE : {formatCurrency(CESG_LIFETIME_MAX)} par enfant.</p>
              </CardContent>
            </Card>

            <Card
              className="border"
              style={{
                borderColor: 'rgba(217, 119, 6, 0.22)',
                borderRadius: 'var(--senior-radius-lg, 12px)',
                boxShadow: 'var(--senior-shadow)',
                background: '#fff7ed',
              }}
            >
              <CardHeader>
                <CardTitle className="text-[24px]" style={{ color: 'var(--mpr-h3)' }}>
                  Subvention IQEE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-[18px] leading-[1.7]">
                <p>10 % supplémentaires au taux de base, maximum 250 $ par année.</p>
                <p>Les subventions sont calculées sur les premières 2 500 $ cotisées par an.</p>
                <p>Maximum cumulatif IQEE : {formatCurrency(IQEE_LIFETIME_MAX)} par enfant.</p>
              </CardContent>
            </Card>
          </div>

          <Card
            className="border"
            style={{
              borderColor: 'var(--mpr-border)',
              borderRadius: 'var(--senior-radius-lg, 12px)',
              boxShadow: 'var(--senior-shadow)',
              background: '#ffffff',
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-[24px]" style={{ color: 'var(--mpr-h3)' }}>
                <PiggyBank className="h-6 w-6" style={{ color: 'var(--mpr-primary)' }} />
                Projection année par année
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projection.rows.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--mpr-border)' }}>
                  <table className="min-w-full border-collapse">
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th className="px-4 py-4 text-left text-[18px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>Année</th>
                        <th className="px-4 py-4 text-left text-[18px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>Cotisations</th>
                        <th className="px-4 py-4 text-left text-[18px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>SCEE reçue</th>
                        <th className="px-4 py-4 text-left text-[18px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>IQEE reçue</th>
                        <th className="px-4 py-4 text-left text-[18px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>Valeur totale estimée</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projection.rows.map((row, index) => (
                        <tr
                          key={row.yearLabel}
                          style={{
                            background: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                            borderTop: '1px solid var(--mpr-border)',
                          }}
                        >
                          <td className="px-4 py-4 text-[18px] font-semibold" style={{ color: 'var(--mpr-text)' }}>{row.yearLabel}</td>
                          <td className="px-4 py-4 text-[18px]" style={{ color: 'var(--mpr-text)' }}>{formatCurrency(row.contribution)}</td>
                          <td className="px-4 py-4 text-[18px]" style={{ color: 'var(--mpr-text)' }}>{formatCurrency(row.cesg)}</td>
                          <td className="px-4 py-4 text-[18px]" style={{ color: 'var(--mpr-text)' }}>{formatCurrency(row.iqee)}</td>
                          <td className="px-4 py-4 text-[18px] font-semibold" style={{ color: 'var(--mpr-primary)' }}>{formatCurrency(row.totalValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: 'var(--mpr-border)',
                    background: '#f8fafc',
                  }}
                >
                  <p className="text-[18px] leading-[1.7]" style={{ color: 'var(--mpr-text)' }}>
                    À 17 ans, il reste moins d&apos;une année complète avant les 18 ans de l&apos;enfant. Ajustez l&apos;âge si vous souhaitez voir une projection sur plusieurs années.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'rgba(76, 110, 245, 0.22)',
                background: '#f0f9ff',
              }}
            >
              <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                Total cotisé par les parents
              </p>
              <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-primary)' }}>
                {formatCurrency(projection.totalContributions)}
              </p>
            </div>

            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'rgba(217, 119, 6, 0.22)',
                background: '#fff7ed',
              }}
            >
              <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                Total subventions reçues
              </p>
              <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-warning)' }}>
                {formatCurrency(projection.totalGrants)}
              </p>
            </div>

            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--mpr-border)',
                background: '#ffffff',
              }}
            >
              <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                Valeur estimée à 18 ans
              </p>
              <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-h3)' }}>
                {formatCurrency(projection.finalValue)}
              </p>
            </div>

            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--mpr-border)',
                background: '#ffffff',
              }}
            >
              <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                Part des subventions dans l&apos;épargne totale
              </p>
              <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-h3)' }}>
                {formatPercent(grantsShare)}
              </p>
              <p className="mt-2 text-[16px] leading-7" style={{ color: 'var(--mpr-text)' }}>
                Les subventions représentent {formatPercent(grantsShare)} de l&apos;épargne totale.
              </p>
            </div>
          </div>

          <div
            className="rounded-2xl border p-5"
            style={{
              borderColor: 'var(--mpr-border)',
              background: '#f8fafc',
            }}
          >
            <p className="text-[18px] leading-[1.75]" style={{ color: 'var(--mpr-text)' }}>
              Les subventions sont calculées sur les premières 2 500 $ cotisées par an. Les revenus du REEE sont imposables à l&apos;étudiant lors du retrait (généralement à faible taux).
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

export default REEESimulateurModule;
