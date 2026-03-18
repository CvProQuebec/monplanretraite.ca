import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Info, Lock, Wallet } from 'lucide-react';

type WithdrawalRateRow = {
  age: number;
  minRate: number;
  maxRate: number;
};

const frvWithdrawalTable: WithdrawalRateRow[] = [
  { age: 55, minRate: 0, maxRate: 6.4 },
  { age: 60, minRate: 0, maxRate: 6.7 },
  { age: 65, minRate: 0, maxRate: 7.09 },
  { age: 70, minRate: 5.28, maxRate: 7.59 },
  { age: 75, minRate: 5.82, maxRate: 8.27 },
  { age: 80, minRate: 6.82, maxRate: 9.27 },
  { age: 85, minRate: 8.51, maxRate: 11.0 },
];

const formatCurrency = (value: number) =>
  value.toLocaleString('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  });

const formatPercent = (value: number) => `${value.toFixed(2).replace('.', ',')} %`;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const interpolateRate = (age: number, key: 'minRate' | 'maxRate') => {
  if (age <= frvWithdrawalTable[0].age) {
    return frvWithdrawalTable[0][key];
  }

  const lastRow = frvWithdrawalTable[frvWithdrawalTable.length - 1];
  if (age >= lastRow.age) {
    return lastRow[key];
  }

  for (let index = 0; index < frvWithdrawalTable.length - 1; index += 1) {
    const current = frvWithdrawalTable[index];
    const next = frvWithdrawalTable[index + 1];

    if (age >= current.age && age <= next.age) {
      const ratio = (age - current.age) / (next.age - current.age);
      return current[key] + (next[key] - current[key]) * ratio;
    }
  }

  return lastRow[key];
};

export const CRIFRVGuideModule: React.FC = () => {
  const [frvValue, setFrvValue] = useState(250000);
  const [currentAge, setCurrentAge] = useState(65);

  const minRate = interpolateRate(currentAge, 'minRate');
  const maxRate = interpolateRate(currentAge, 'maxRate');
  const annualMinimum = frvValue * (minRate / 100);
  const annualMaximum = frvValue * (maxRate / 100);
  const monthlyMaximum = annualMaximum / 12;

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
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <CardTitle
                className="text-[28px] font-semibold leading-[1.35]"
                style={{ color: 'var(--mpr-h2)', letterSpacing: '0.025em' }}
              >
                Guide CRI vers FRV
              </CardTitle>
              <CardDescription
                className="mt-2 text-[18px] leading-[1.65]"
                style={{ color: 'var(--mpr-text-muted)' }}
              >
                Comprenez simplement comment fonctionnent les fonds immobilisés et voyez rapidement combien vous pouvez retirer de votre FRV.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6 pt-0 md:p-8 md:pt-0">
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
              <CardTitle className="text-[24px]" style={{ color: 'var(--mpr-h3)' }}>
                Section 1 — Qu&apos;est-ce qu&apos;un CRI ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[18px] leading-[1.75]" style={{ color: 'var(--mpr-text)' }}>
                Le CRI, ou Compte de retraite immobilisé, provient généralement d&apos;un fonds de pension transféré après avoir quitté un employeur. Ce capital demeure « immobilisé », ce qui signifie qu&apos;il ne peut pas être retiré librement comme un REER ordinaire.
              </p>
              <p className="text-[18px] leading-[1.75]" style={{ color: 'var(--mpr-text)' }}>
                Lorsque vient le moment de décaisser ce capital à la retraite, le CRI est habituellement converti en FRV, soit un Fonds de revenu viager. Le FRV permet des retraits encadrés par des minimums et des maximums annuels selon votre âge et les règles applicables.
              </p>
            </CardContent>
          </Card>

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
              <CardTitle className="text-[24px]" style={{ color: 'var(--mpr-h3)' }}>
                Section 2 — Table des retraits minimum et maximum FRV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--mpr-border)' }}>
                <table className="min-w-full border-collapse">
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th className="px-4 py-4 text-left text-[18px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>
                        Âge
                      </th>
                      <th className="px-4 py-4 text-left text-[18px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>
                        Retrait minimum (%)
                      </th>
                      <th className="px-4 py-4 text-left text-[18px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>
                        Retrait maximum (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {frvWithdrawalTable.map((row, index) => (
                      <tr
                        key={row.age}
                        style={{
                          background: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                          borderTop: '1px solid var(--mpr-border)',
                        }}
                      >
                        <td className="px-4 py-4 text-[18px] font-semibold" style={{ color: 'var(--mpr-text)' }}>
                          {row.age} ans
                        </td>
                        <td className="px-4 py-4 text-[18px]" style={{ color: 'var(--mpr-text)' }}>
                          {formatPercent(row.minRate)}
                        </td>
                        <td className="px-4 py-4 text-[18px]" style={{ color: 'var(--mpr-text)' }}>
                          {formatPercent(row.maxRate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[16px] leading-[1.7]" style={{ color: 'var(--mpr-text-muted)' }}>
                Source : Retraite Québec. Valeurs approximatives 2026. Les maximums varient selon le rendement prévu du fonds.
              </p>
            </CardContent>
          </Card>

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
                <Wallet className="h-6 w-6" style={{ color: 'var(--mpr-primary)' }} />
                Section 3 — Calculateur simple
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: 'var(--mpr-border)',
                    background: '#ffffff',
                    boxShadow: 'var(--senior-shadow-sm)',
                  }}
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="frv-value"
                      className="text-[18px] font-semibold leading-7"
                      style={{ color: 'var(--mpr-text)' }}
                    >
                      Valeur du FRV
                    </Label>
                    <Input
                      id="frv-value"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={1000}
                      value={frvValue}
                      onChange={(event) => setFrvValue(Math.max(0, Number(event.target.value) || 0))}
                      className="min-h-14 text-[18px] font-semibold"
                    />
                  </div>
                </div>

                <div
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: 'var(--mpr-border)',
                    background: '#ffffff',
                    boxShadow: 'var(--senior-shadow-sm)',
                  }}
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="frv-age"
                      className="text-[18px] font-semibold leading-7"
                      style={{ color: 'var(--mpr-text)' }}
                    >
                      Âge actuel
                    </Label>
                    <Input
                      id="frv-age"
                      type="number"
                      min={55}
                      max={95}
                      value={currentAge}
                      onChange={(event) => setCurrentAge(clamp(Number(event.target.value) || 55, 55, 95))}
                      className="min-h-14 text-[18px] font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: 'rgba(76, 110, 245, 0.22)',
                    background: '#f0f9ff',
                  }}
                >
                  <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                    Retrait minimum annuel
                  </p>
                  <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-primary)' }}>
                    {formatCurrency(annualMinimum)}
                  </p>
                  <p className="mt-2 text-[16px] leading-7" style={{ color: 'var(--mpr-text)' }}>
                    Taux utilisé : {formatPercent(minRate)}
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
                    Retrait maximum annuel
                  </p>
                  <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-warning)' }}>
                    {formatCurrency(annualMaximum)}
                  </p>
                  <p className="mt-2 text-[16px] leading-7" style={{ color: 'var(--mpr-text)' }}>
                    Taux utilisé : {formatPercent(maxRate)}
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
                    Retrait maximum mensuel
                  </p>
                  <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-h3)' }}>
                    {formatCurrency(monthlyMaximum)}
                  </p>
                </div>
              </div>

              <Alert
                className="border"
                style={{
                  borderColor: 'rgba(76, 110, 245, 0.2)',
                  background: '#f8fafc',
                  borderRadius: 'var(--senior-radius-lg, 12px)',
                }}
              >
                <Info className="h-5 w-5" style={{ color: 'var(--mpr-primary)' }} />
                <AlertDescription className="text-[18px] leading-[1.7]" style={{ color: 'var(--mpr-text)' }}>
                  <strong>Repère utile :</strong> dans plusieurs cas, retirer le maximum permis peut vous redonner plus de souplesse en sortant graduellement l'argent du FRV.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card
            className="border"
            style={{
              borderColor: 'rgba(217, 119, 6, 0.22)',
              borderRadius: 'var(--senior-radius-lg, 12px)',
              boxShadow: 'var(--senior-shadow)',
              background: 'linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)',
            }}
          >
            <CardHeader>
              <CardTitle className="text-[24px]" style={{ color: 'var(--mpr-h3)' }}>
                Section 4 — Option de déblocage ponctuel (Québec)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-2xl border p-5"
                style={{
                  borderColor: 'rgba(217, 119, 6, 0.2)',
                  background: 'rgba(255, 255, 255, 0.82)',
                }}
              >
                <p className="text-[20px] font-semibold leading-[1.5]" style={{ color: 'var(--mpr-h4)' }}>
                  Option unique en vie : Déblocage de 50 % du FRV
                </p>
                <p className="mt-3 text-[18px] leading-[1.75]" style={{ color: 'var(--mpr-text)' }}>
                  En vertu de la Loi sur les régimes complémentaires de retraite (Québec), vous pouvez, une seule fois, transférer jusqu&apos;à 50 % de la valeur de votre FRV vers un REER ou FERR. Cette option s&apos;exerce généralement entre 55 et 65 ans. Consultez votre institution financière pour les démarches.
                </p>
              </div>
            </CardContent>
          </Card>

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
                <BookOpen className="h-6 w-6" style={{ color: 'var(--mpr-primary)' }} />
                Section 5 — Lien article de blog
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a
                href="/blog/fr/cri-et-frv-comment-debloquer-vos-fonds-de-pension-immobilises"
                className="inline-flex min-h-14 items-center rounded-xl border px-5 py-3 text-[18px] font-semibold no-underline transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none"
                style={{
                  color: 'var(--mpr-primary)',
                  borderColor: 'var(--mpr-primary)',
                  background: '#ffffff',
                  boxShadow: 'var(--senior-shadow-sm)',
                }}
              >
                Lire notre guide complet : CRI et FRV — débloquer vos fonds immobilisés
              </a>

              <p className="text-[16px] leading-[1.7]" style={{ color: 'var(--mpr-text-muted)' }}>
                Ces projections sont à titre éducatif uniquement. Consultez un planificateur financier pour une analyse personnalisée.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRIFRVGuideModule;
