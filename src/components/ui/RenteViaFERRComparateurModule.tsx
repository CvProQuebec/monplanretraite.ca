import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRightLeft, Banknote, Info, Landmark, ShieldCheck } from 'lucide-react';

interface FerrProjection {
  annualWithdrawalNow: number;
  totalWithdrawals: number;
  remainingCapital: number;
  depletionAge: number | null;
}

const formatCurrency = (value: number) =>
  value.toLocaleString('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  });

const formatPercent = (value: number) => `${value.toFixed(1).replace('.', ',')} %`;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getFerrMinimumRate = (age: number) => {
  if (age <= 54) return 1 / (90 - age);

  const rates: Record<number, number> = {
    55: 0.029,
    56: 0.03,
    57: 0.031,
    58: 0.032,
    59: 0.0333,
    60: 0.0348,
    61: 0.0357,
    62: 0.037,
    63: 0.0385,
    64: 0.04,
    65: 0.04,
    66: 0.0417,
    67: 0.0435,
    68: 0.0455,
    69: 0.0476,
    70: 0.05,
    71: 0.0528,
    72: 0.054,
    73: 0.0553,
    74: 0.0567,
    75: 0.0582,
    76: 0.0598,
    77: 0.0617,
    78: 0.0636,
    79: 0.0658,
    80: 0.0682,
    81: 0.0708,
    82: 0.0738,
    83: 0.0771,
    84: 0.0808,
    85: 0.0851,
    86: 0.0899,
    87: 0.0955,
    88: 0.1021,
    89: 0.1099,
    90: 0.1192,
    91: 0.1306,
    92: 0.1449,
    93: 0.1634,
    94: 0.1879,
  };

  return rates[age] ?? 0.2;
};

const simulateFerr = (
  capital: number,
  currentAge: number,
  targetAge: number,
  annualReturnPercent: number
): FerrProjection => {
  const annualReturn = annualReturnPercent / 100;
  const annualWithdrawalNow = capital * getFerrMinimumRate(currentAge);

  let balance = capital;
  let totalWithdrawals = 0;
  let depletionAge: number | null = null;

  for (let age = currentAge; age < targetAge; age += 1) {
    if (balance <= 0) {
      depletionAge = age;
      balance = 0;
      break;
    }

    const minWithdrawal = balance * getFerrMinimumRate(age);
    const withdrawal = Math.min(balance, minWithdrawal);
    totalWithdrawals += withdrawal;
    balance -= withdrawal;

    if (balance <= 0) {
      depletionAge = age + 1;
      balance = 0;
      break;
    }

    balance *= 1 + annualReturn;
  }

  return {
    annualWithdrawalNow,
    totalWithdrawals,
    remainingCapital: Math.max(balance, 0),
    depletionAge,
  };
};

const estimateFerrDepletionRisk = (
  capital: number,
  currentAge: number,
  targetAge: number,
  annualReturnPercent: number
) => {
  const scenarios = [
    { delta: -6, weight: 0.08 },
    { delta: -4, weight: 0.12 },
    { delta: -3, weight: 0.16 },
    { delta: -2, weight: 0.18 },
    { delta: 0, weight: 0.2 },
    { delta: 1, weight: 0.12 },
    { delta: 2, weight: 0.08 },
    { delta: 3, weight: 0.06 },
  ];

  const risk = scenarios.reduce((sum, scenario) => {
    const projection = simulateFerr(capital, currentAge, targetAge, annualReturnPercent + scenario.delta);
    return projection.depletionAge !== null && projection.depletionAge <= targetAge
      ? sum + scenario.weight
      : sum;
  }, 0);

  return clamp(risk * 100, 0, 100);
};

const calculateBreakEvenAge = (
  capital: number,
  currentAge: number,
  annuityRatePercent: number,
  ferrReturnPercent: number
) => {
  const annuityAnnualIncome = capital * (annuityRatePercent / 100);
  let annuityCumulative = 0;
  let ferrCumulative = 0;

  for (let age = currentAge; age <= 105; age += 1) {
    annuityCumulative += annuityAnnualIncome;
    const ferrProjection = simulateFerr(capital, currentAge, age + 1, ferrReturnPercent);
    ferrCumulative = ferrProjection.totalWithdrawals;

    if (annuityCumulative >= ferrCumulative) {
      return age + 1;
    }
  }

  return null;
};

const buildHybridExample = (
  capital: number,
  currentAge: number,
  targetAge: number,
  annuityRatePercent: number,
  ferrReturnPercent: number,
  marginalTaxRate: number
) => {
  const halfCapital = capital / 2;
  const annuityAnnual = halfCapital * (annuityRatePercent / 100);
  const ferrProjection = simulateFerr(halfCapital, currentAge, targetAge, ferrReturnPercent);
  const annualGrossIncome = annuityAnnual + ferrProjection.annualWithdrawalNow;
  const annualNetIncome = annualGrossIncome * (1 - marginalTaxRate / 100);

  return {
    annuityAnnual,
    ferrAnnual: ferrProjection.annualWithdrawalNow,
    totalReceived: annuityAnnual * Math.max(targetAge - currentAge, 0) + ferrProjection.totalWithdrawals,
    remainingCapital: ferrProjection.remainingCapital,
    annualGrossIncome,
    annualNetIncome,
  };
};

export const RenteViaFERRComparateurModule: React.FC = () => {
  const [capital, setCapital] = useState(250000);
  const [currentAge, setCurrentAge] = useState(65);
  const [targetAge, setTargetAge] = useState(90);
  const [annuityRate, setAnnuityRate] = useState(5.5);
  const [ferrReturn, setFerrReturn] = useState(5);
  const [marginalTaxRate, setMarginalTaxRate] = useState(30);

  useEffect(() => {
    if (targetAge <= currentAge) {
      setTargetAge(currentAge + 1);
    }
  }, [currentAge, targetAge]);

  const normalizedTargetAge = Math.max(targetAge, currentAge + 1);
  const yearsPlanned = Math.max(normalizedTargetAge - currentAge, 0);
  const annuityAnnualIncome = capital * (annuityRate / 100);
  const annuityMonthlyIncome = annuityAnnualIncome / 12;
  const annuityTotalReceived = annuityAnnualIncome * yearsPlanned;
  const annuityNetAnnualIncome = annuityAnnualIncome * (1 - marginalTaxRate / 100);
  const ferrProjection = simulateFerr(capital, currentAge, normalizedTargetAge, ferrReturn);
  const ferrRisk = estimateFerrDepletionRisk(capital, currentAge, normalizedTargetAge, ferrReturn);
  const breakEvenAge = calculateBreakEvenAge(capital, currentAge, annuityRate, ferrReturn);
  const hybridExample = buildHybridExample(
    capital,
    currentAge,
    normalizedTargetAge,
    annuityRate,
    ferrReturn,
    marginalTaxRate
  );

  return (
    <div className="w-full space-y-6" style={{ color: 'var(--mpr-text)' }}>
      <Card
        className="overflow-hidden border"
        style={{
          borderColor: 'var(--mpr-border)',
          borderRadius: 'var(--senior-radius-xl, 16px)',
          boxShadow: 'var(--senior-shadow-lg)',
          background:
            'radial-gradient(circle at top right, rgba(227, 242, 253, 0.85), transparent 32%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
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
              <ArrowRightLeft className="h-6 w-6" />
            </div>
            <div>
              <CardTitle
                className="text-[28px] font-semibold leading-[1.35]"
                style={{ color: 'var(--mpr-h2)', letterSpacing: '0.025em' }}
              >
                Comparateur Rente viagère vs FERR
              </CardTitle>
              <CardDescription
                className="mt-2 text-[18px] leading-[1.65]"
                style={{ color: 'var(--mpr-text-muted)' }}
              >
                Comparez un revenu garanti à vie avec la flexibilité d&apos;un FERR pour éclairer votre stratégie de décaissement.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6 pt-0 md:p-8 md:pt-0">
          <div
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
            role="group"
            aria-label="Paramètres de comparaison"
          >
            <div
              className="grid gap-4 rounded-2xl border p-4 md:p-5"
              style={{
                borderColor: 'var(--mpr-border)',
                background: '#ffffff',
                boxShadow: 'var(--senior-shadow)',
              }}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="capital-disponible"
                    className="text-[18px] font-semibold leading-7"
                    style={{ color: 'var(--mpr-text)' }}
                  >
                    Capital disponible
                  </Label>
                  <Input
                    id="capital-disponible"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={1000}
                    value={capital}
                    onChange={(event) => setCapital(Math.max(0, Number(event.target.value) || 0))}
                    className="min-h-14 text-[18px] font-semibold"
                    aria-describedby="capital-disponible-aide"
                  />
                  <p
                    id="capital-disponible-aide"
                    className="text-[16px] leading-7"
                    style={{ color: 'var(--mpr-text-muted)' }}
                  >
                    Exemple : 250 000 $
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="age-actuel"
                    className="text-[18px] font-semibold leading-7"
                    style={{ color: 'var(--mpr-text)' }}
                  >
                    Âge actuel
                  </Label>
                  <Input
                    id="age-actuel"
                    type="number"
                    min={55}
                    max={95}
                    value={currentAge}
                    onChange={(event) => setCurrentAge(clamp(Number(event.target.value) || 55, 55, 95))}
                    className="min-h-14 text-[18px] font-semibold"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label
                      htmlFor="esperance-vie"
                      className="text-[18px] font-semibold leading-7"
                      style={{ color: 'var(--mpr-text)' }}
                    >
                      Espérance de vie visée
                    </Label>
                    <span
                      className="rounded-full border px-4 py-2 text-[16px] font-semibold"
                      style={{
                        borderColor: 'rgba(76, 110, 245, 0.2)',
                        color: 'var(--mpr-primary)',
                        background: 'rgba(76, 110, 245, 0.06)',
                      }}
                    >
                      {normalizedTargetAge} ans
                    </span>
                  </div>
                  <Slider
                    id="esperance-vie"
                    value={[normalizedTargetAge]}
                    onValueChange={(value) => setTargetAge(value[0])}
                    min={currentAge + 1}
                    max={105}
                    step={1}
                    className="py-4"
                    aria-label="Espérance de vie visée"
                  />
                  <Input
                    type="number"
                    min={currentAge + 1}
                    max={105}
                    value={normalizedTargetAge}
                    onChange={(event) =>
                      setTargetAge(clamp(Number(event.target.value) || currentAge + 1, currentAge + 1, 105))
                    }
                    className="min-h-14 text-[18px] font-semibold"
                  />
                </div>
              </div>
            </div>

            <div
              className="grid gap-4 rounded-2xl border p-4 md:p-5"
              style={{
                borderColor: 'var(--mpr-border)',
                background: '#ffffff',
                boxShadow: 'var(--senior-shadow)',
              }}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="taux-rente"
                    className="text-[18px] font-semibold leading-7"
                    style={{ color: 'var(--mpr-text)' }}
                  >
                    Taux de rente estimé
                  </Label>
                  <Input
                    id="taux-rente"
                    type="number"
                    min={1}
                    max={12}
                    step={0.1}
                    value={annuityRate}
                    onChange={(event) => setAnnuityRate(clamp(Number(event.target.value) || 0, 1, 12))}
                    className="min-h-14 text-[18px] font-semibold"
                  />
                  <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                    Exemple : 5,5 % annuel du capital
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="rendement-ferr"
                    className="text-[18px] font-semibold leading-7"
                    style={{ color: 'var(--mpr-text)' }}
                  >
                    Rendement FERR estimé
                  </Label>
                  <Input
                    id="rendement-ferr"
                    type="number"
                    min={-2}
                    max={12}
                    step={0.1}
                    value={ferrReturn}
                    onChange={(event) => setFerrReturn(clamp(Number(event.target.value) || 0, -2, 12))}
                    className="min-h-14 text-[18px] font-semibold"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="taux-imposition"
                    className="text-[18px] font-semibold leading-7"
                    style={{ color: 'var(--mpr-text)' }}
                  >
                    Taux marginal d&apos;imposition
                  </Label>
                  <Input
                    id="taux-imposition"
                    type="number"
                    min={0}
                    max={60}
                    step={0.1}
                    value={marginalTaxRate}
                    onChange={(event) => setMarginalTaxRate(clamp(Number(event.target.value) || 0, 0, 60))}
                    className="min-h-14 text-[18px] font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <Card
              className="border"
              style={{
                borderColor: 'rgba(76, 110, 245, 0.28)',
                borderRadius: 'var(--senior-radius-lg, 12px)',
                boxShadow: 'var(--senior-shadow)',
                background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)',
              }}
            >
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-3 text-[24px]" style={{ color: 'var(--mpr-h3)' }}>
                  <ShieldCheck className="h-6 w-6" style={{ color: 'var(--mpr-primary)' }} />
                  Rente viagère
                </CardTitle>
                <CardDescription className="text-[18px] leading-[1.6]" style={{ color: 'var(--mpr-text-muted)' }}>
                  Un revenu prévisible et garanti tant que vous vivez.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--mpr-border)', background: '#ffffff' }}>
                  <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                    Revenu annuel garanti
                  </p>
                  <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-primary)' }}>
                    {formatCurrency(annuityAnnualIncome)}
                  </p>
                  <p className="mt-2 text-[16px] leading-7" style={{ color: 'var(--mpr-text)' }}>
                    Après impôt estimé : {formatCurrency(annuityNetAnnualIncome)}
                  </p>
                </div>

                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--mpr-border)', background: '#ffffff' }}>
                  <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                    Revenu mensuel garanti
                  </p>
                  <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-primary)' }}>
                    {formatCurrency(annuityMonthlyIncome)}
                  </p>
                </div>

                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--mpr-border)', background: '#ffffff' }}>
                  <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                    Total reçu à {normalizedTargetAge} ans
                  </p>
                  <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-primary)' }}>
                    {formatCurrency(annuityTotalReceived)}
                  </p>
                </div>

                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--mpr-border)', background: '#ffffff' }}>
                  <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                    Point mort
                  </p>
                  <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-primary)' }}>
                    {breakEvenAge ? `${breakEvenAge} ans` : 'Après 105 ans'}
                  </p>
                  <p className="mt-2 text-[16px] leading-7" style={{ color: 'var(--mpr-text)' }}>
                    Âge où les versements cumulés de la rente dépassent le FERR projeté.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="border"
              style={{
                borderColor: 'rgba(217, 119, 6, 0.28)',
                borderRadius: 'var(--senior-radius-lg, 12px)',
                boxShadow: 'var(--senior-shadow)',
                background: 'linear-gradient(180deg, #ffffff 0%, #fff7ed 100%)',
              }}
            >
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-3 text-[24px]" style={{ color: 'var(--mpr-h3)' }}>
                  <Landmark className="h-6 w-6" style={{ color: 'var(--mpr-warning)' }} />
                  FERR
                </CardTitle>
                <CardDescription className="text-[18px] leading-[1.6]" style={{ color: 'var(--mpr-text-muted)' }}>
                  Une option plus flexible, avec potentiel de croissance et risque de longévité financière.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--mpr-border)', background: '#ffffff' }}>
                  <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                    Revenu annuel
                  </p>
                  <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-warning)' }}>
                    {formatCurrency(ferrProjection.annualWithdrawalNow)}
                  </p>
                  <p className="mt-2 text-[16px] leading-7" style={{ color: 'var(--mpr-text)' }}>
                    Basé sur le retrait minimum à {currentAge} ans.
                  </p>
                </div>

                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--mpr-border)', background: '#ffffff' }}>
                  <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                    Capital restant estimé à {normalizedTargetAge} ans
                  </p>
                  <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-warning)' }}>
                    {formatCurrency(ferrProjection.remainingCapital)}
                  </p>
                </div>

                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--mpr-border)', background: '#ffffff' }}>
                  <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                    Total reçu à {normalizedTargetAge} ans
                  </p>
                  <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-warning)' }}>
                    {formatCurrency(ferrProjection.totalWithdrawals)}
                  </p>
                </div>

                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--mpr-border)', background: '#ffffff' }}>
                  <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                    Risque de survie au capital
                  </p>
                  <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: ferrRisk >= 50 ? 'var(--mpr-error)' : 'var(--mpr-warning)' }}>
                    {formatPercent(ferrRisk)}
                  </p>
                  <p className="mt-2 text-[16px] leading-7" style={{ color: 'var(--mpr-text)' }}>
                    Estimation basée sur plusieurs scénarios de rendement jusqu&apos;à l&apos;âge visé.
                  </p>
                </div>
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
                <Banknote className="h-6 w-6" style={{ color: 'var(--mpr-primary)' }} />
                Stratégie hybride
              </CardTitle>
              <CardDescription className="text-[18px] leading-[1.6]" style={{ color: 'var(--mpr-text-muted)' }}>
                Une combinaison 50 % rente viagère et 50 % FERR peut offrir un équilibre entre sécurité du revenu et souplesse d&apos;accès au capital.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div
                className="rounded-2xl border p-5"
                style={{
                  borderColor: 'rgba(76, 110, 245, 0.18)',
                  background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                }}
              >
                <p className="text-[18px] leading-[1.75]" style={{ color: 'var(--mpr-text)' }}>
                  Cette approche permet de couvrir une partie de vos dépenses essentielles avec une rente, tout en conservant un FERR pour les retraits ponctuels, l&apos;héritage potentiel et l&apos;adaptation à l&apos;évolution de vos besoins.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--mpr-border)', background: '#f0f9ff' }}>
                  <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                    Revenu annuel garanti
                  </p>
                  <p className="mt-2 text-[24px] font-bold" style={{ color: 'var(--mpr-primary)' }}>
                    {formatCurrency(hybridExample.annuityAnnual)}
                  </p>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--mpr-border)', background: '#fff7ed' }}>
                  <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                    Retrait FERR initial
                  </p>
                  <p className="mt-2 text-[24px] font-bold" style={{ color: 'var(--mpr-warning)' }}>
                    {formatCurrency(hybridExample.ferrAnnual)}
                  </p>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--mpr-border)', background: '#ffffff' }}>
                  <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                    Revenu annuel brut combiné
                  </p>
                  <p className="mt-2 text-[24px] font-bold" style={{ color: 'var(--mpr-h3)' }}>
                    {formatCurrency(hybridExample.annualGrossIncome)}
                  </p>
                  <p className="mt-2 text-[16px] leading-7" style={{ color: 'var(--mpr-text)' }}>
                    Net estimé : {formatCurrency(hybridExample.annualNetIncome)}
                  </p>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--mpr-border)', background: '#ffffff' }}>
                  <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                    Valeur cumulée à {normalizedTargetAge} ans
                  </p>
                  <p className="mt-2 text-[24px] font-bold" style={{ color: 'var(--mpr-h3)' }}>
                    {formatCurrency(hybridExample.totalReceived)}
                  </p>
                  <p className="mt-2 text-[16px] leading-7" style={{ color: 'var(--mpr-text)' }}>
                    Capital FERR restant : {formatCurrency(hybridExample.remainingCapital)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert
            className="border"
            style={{
              borderColor: 'rgba(76, 110, 245, 0.2)',
              background: '#f8fafc',
              borderRadius: 'var(--senior-radius-lg, 12px)',
            }}
          >
            <Info className="h-5 w-5" style={{ color: 'var(--mpr-primary)' }} />
            <AlertDescription className="space-y-4 text-[18px] leading-[1.7]" style={{ color: 'var(--mpr-text)' }}>
              <div>
                <strong>ALDA (Rente viagère différée à avancement de l&apos;âge) :</strong>{' '}
                Vous pouvez utiliser jusqu&apos;à 160 000 $ de votre REER/FERR pour acheter une rente ALDA, souscrite jusqu&apos;à 85 ans. Les versements commencent au plus tard à 85 ans.
              </div>
              <div>
                <strong>Rente assurée :</strong>{' '}
                une combinaison rente viagère + assurance-vie peut aider à sécuriser un revenu stable tout en protégeant une partie du patrimoine pour vos proches.
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <p className="text-[16px] leading-[1.7]" style={{ color: 'var(--mpr-text-muted)' }}>
              Ces projections sont à titre éducatif uniquement. Consultez un planificateur financier pour une analyse personnalisée.
            </p>

            <a
              href="/blog/fr/rente-viagere-ou-ferr-quel-choix-pour-un-revenu-garanti-a-vie"
              className="inline-flex min-h-14 items-center rounded-xl border px-5 py-3 text-[18px] font-semibold no-underline transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none"
              style={{
                color: 'var(--mpr-primary)',
                borderColor: 'var(--mpr-primary)',
                background: '#ffffff',
                boxShadow: 'var(--senior-shadow-sm)',
              }}
            >
              Lire notre guide complet : Rente viagère ou FERR ?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RenteViaFERRComparateurModule;
