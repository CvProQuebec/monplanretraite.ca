import React, { useMemo, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, BriefcaseBusiness, Building2, Info, PiggyBank } from 'lucide-react';

const RRSP_2026_LIMIT = 33810;
const SMALL_BUSINESS_TAX_RATE = 12.2;
const PERSONAL_MARGINAL_RATE_MIN = 37.1;
const PERSONAL_MARGINAL_RATE_MAX = 53.3;

const formatCurrency = (value: number) =>
  value.toLocaleString('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  });

const formatPercent = (value: number) => `${value.toFixed(1).replace('.', ',')} %`;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getPassiveIncomeState = (amount: number) => {
  if (amount <= 50000) {
    return {
      label: 'Sous le seuil de 50 000 $',
      color: 'var(--mpr-success)',
      background: '#f0fdf4',
      border: 'rgba(22, 163, 74, 0.25)',
      width: `${Math.min((amount / 50000) * 50, 50)}%`,
    };
  }

  if (amount < 150000) {
    return {
      label: 'Réduction graduelle du taux PME',
      color: 'var(--mpr-warning)',
      background: '#fff7ed',
      border: 'rgba(217, 119, 6, 0.25)',
      width: `${50 + Math.min(((amount - 50000) / 100000) * 50, 50)}%`,
    };
  }

  return {
    label: 'Taux PME entièrement perdu',
    color: 'var(--mpr-error)',
    background: '#fef2f2',
    border: 'rgba(220, 38, 38, 0.25)',
    width: '100%',
  };
};

export const TravailleursAutonomeModule: React.FC = () => {
  const [selfEmployedIncome, setSelfEmployedIncome] = useState(90000);
  const [selfEmployedAge, setSelfEmployedAge] = useState(44);
  const [knownRrspRoom, setKnownRrspRoom] = useState<number | ''>('');
  const [corporatePassiveIncome, setCorporatePassiveIncome] = useState(25000);

  const rrspMaximumContribution = useMemo(
    () => Math.min(selfEmployedIncome * 0.18, RRSP_2026_LIMIT),
    [selfEmployedIncome]
  );

  const rrspAvailableRoom = typeof knownRrspRoom === 'number' ? knownRrspRoom : rrspMaximumContribution;
  const estimatedQppBurden = Math.min(selfEmployedIncome * 0.12, 8500);
  const passiveIncomeState = getPassiveIncomeState(corporatePassiveIncome);
  const passiveIncomeWarning =
    corporatePassiveIncome > 150000
      ? 'Votre corporation dépasse 150 000 $ de revenus passifs annuels. Le taux PME est alors entièrement perdu et la facture fiscale grimpe fortement.'
      : corporatePassiveIncome > 50000
        ? 'Votre corporation dépasse 50 000 $ de revenus passifs annuels. Vous commencez à perdre graduellement l’accès au taux PME.'
        : 'Votre corporation demeure sous le seuil de 50 000 $ de revenus passifs annuels. Le taux PME est généralement préservé.';

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
              <PiggyBank className="h-6 w-6" />
            </div>
            <div>
              <CardTitle
                className="text-[28px] font-semibold leading-[1.35]"
                style={{ color: 'var(--mpr-h2)', letterSpacing: '0.025em' }}
              >
                Retraite pour travailleur autonome et incorporé
              </CardTitle>
              <CardDescription
                className="mt-2 text-[18px] leading-[1.65]"
                style={{ color: 'var(--mpr-text-muted)' }}
              >
                Un guide pratique pour structurer votre épargne retraite lorsque vous n&apos;avez pas de régime d&apos;employeur traditionnel.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
          <Tabs defaultValue="autonome" className="space-y-6">
            <TabsList
              className="grid h-auto w-full grid-cols-1 gap-3 rounded-2xl bg-transparent p-0 md:grid-cols-2"
              style={{ minHeight: '56px' }}
            >
              <TabsTrigger
                value="autonome"
                className="min-h-14 rounded-xl border px-5 py-4 text-[18px] font-semibold"
                style={{ borderColor: 'var(--mpr-border)' }}
              >
                Travailleur autonome
              </TabsTrigger>
              <TabsTrigger
                value="incorpore"
                className="min-h-14 rounded-xl border px-5 py-4 text-[18px] font-semibold"
                style={{ borderColor: 'var(--mpr-border)' }}
              >
                Entrepreneur incorporé
              </TabsTrigger>
            </TabsList>

            <TabsContent value="autonome" className="space-y-6">
              <Card
                className="border"
                style={{
                  borderColor: 'var(--mpr-border)',
                  borderRadius: 'var(--senior-radius-lg, 12px)',
                  boxShadow: 'var(--senior-shadow)',
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-[24px]" style={{ color: 'var(--mpr-h3)' }}>
                    <BriefcaseBusiness className="h-6 w-6" style={{ color: 'var(--mpr-primary)' }} />
                    Onglet 1 — Travailleur autonome
                  </CardTitle>
                  <CardDescription className="text-[18px] leading-[1.6]" style={{ color: 'var(--mpr-text-muted)' }}>
                    Calculez rapidement votre potentiel REER et voyez l&apos;impact des cotisations RRQ assumées seul.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="self-employed-income"
                        className="text-[18px] font-semibold leading-7"
                        style={{ color: 'var(--mpr-text)' }}
                      >
                        Revenu net de travail autonome
                      </Label>
                      <Input
                        id="self-employed-income"
                        type="number"
                        min={0}
                        step={1000}
                        value={selfEmployedIncome}
                        onChange={(event) => setSelfEmployedIncome(Math.max(0, Number(event.target.value) || 0))}
                        className="min-h-14 text-[18px] font-semibold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="self-employed-age"
                        className="text-[18px] font-semibold leading-7"
                        style={{ color: 'var(--mpr-text)' }}
                      >
                        Âge actuel
                      </Label>
                      <Input
                        id="self-employed-age"
                        type="number"
                        min={18}
                        max={80}
                        value={selfEmployedAge}
                        onChange={(event) => setSelfEmployedAge(clamp(Number(event.target.value) || 18, 18, 80))}
                        className="min-h-14 text-[18px] font-semibold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="rrsp-room"
                        className="text-[18px] font-semibold leading-7"
                        style={{ color: 'var(--mpr-text)' }}
                      >
                        Droits REER disponibles
                      </Label>
                      <Input
                        id="rrsp-room"
                        type="number"
                        min={0}
                        step={1000}
                        value={knownRrspRoom}
                        onChange={(event) => {
                          const value = event.target.value;
                          setKnownRrspRoom(value === '' ? '' : Math.max(0, Number(value) || 0));
                        }}
                        placeholder="Laisser vide pour estimer automatiquement"
                        className="min-h-14 text-[18px] font-semibold"
                      />
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
                        Votre cotisation REER maximale 2026
                      </p>
                      <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-primary)' }}>
                        {formatCurrency(rrspMaximumContribution)}
                      </p>
                      <p className="mt-2 text-[16px] leading-7" style={{ color: 'var(--mpr-text)' }}>
                        Calcul : minimum de 18 % du revenu gagné et de {formatCurrency(RRSP_2026_LIMIT)}.
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
                        Droits REER retenus pour le guide
                      </p>
                      <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-h3)' }}>
                        {formatCurrency(rrspAvailableRoom)}
                      </p>
                      <p className="mt-2 text-[16px] leading-7" style={{ color: 'var(--mpr-text)' }}>
                        {typeof knownRrspRoom === 'number'
                          ? 'Vous avez entré un montant précis.'
                          : 'Estimation automatique basée sur votre revenu net déclaré.'}
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
                        Cotisation RRQ estimative à votre charge
                      </p>
                      <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-warning)' }}>
                        {formatCurrency(estimatedQppBurden)}
                      </p>
                      <p className="mt-2 text-[16px] leading-7" style={{ color: 'var(--mpr-text)' }}>
                        Approximation simplifiée à 12 % du revenu net, plafonnée visuellement pour ce guide.
                      </p>
                    </div>
                  </div>

                  <Alert
                    className="border"
                    style={{
                      borderColor: 'rgba(217, 119, 6, 0.25)',
                      background: '#fff7ed',
                      borderRadius: 'var(--senior-radius-lg, 12px)',
                    }}
                  >
                    <AlertTriangle className="h-5 w-5" style={{ color: 'var(--mpr-warning)' }} />
                    <AlertDescription className="text-[18px] leading-[1.7]" style={{ color: 'var(--mpr-text)' }}>
                      En tant que travailleur autonome, vous payez les deux parts de cotisation RRQ (part employé + part employeur), soit environ 12 % de votre revenu net jusqu&apos;au maximum des gains admissibles. Cela réduit votre revenu net disponible pour l&apos;épargne.
                    </AlertDescription>
                  </Alert>

                  <div
                    className="rounded-2xl border p-5"
                    style={{
                      borderColor: 'rgba(76, 110, 245, 0.18)',
                      background: '#f8fafc',
                    }}
                  >
                    <p className="text-[18px] leading-[1.75]" style={{ color: 'var(--mpr-text)' }}>
                      Le REER est votre principal outil d&apos;épargne retraite avantageuse fiscalement — vous n&apos;avez pas accès à un régime d&apos;employeur.
                    </p>
                    <p className="mt-3 text-[18px] leading-[1.75]" style={{ color: 'var(--mpr-text)' }}>
                      À {selfEmployedAge} ans, l&apos;important est de bâtir un rythme de cotisation soutenable année après année, sans compromettre votre fonds d&apos;urgence ni vos obligations fiscales.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="incorpore" className="space-y-6">
              <Card
                className="border"
                style={{
                  borderColor: 'var(--mpr-border)',
                  borderRadius: 'var(--senior-radius-lg, 12px)',
                  boxShadow: 'var(--senior-shadow)',
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-[24px]" style={{ color: 'var(--mpr-h3)' }}>
                    <Building2 className="h-6 w-6" style={{ color: 'var(--mpr-primary)' }} />
                    Onglet 2 — Entrepreneur incorporé
                  </CardTitle>
                  <CardDescription className="text-[18px] leading-[1.6]" style={{ color: 'var(--mpr-text-muted)' }}>
                    Voyez comment la corporation peut servir d&apos;outil de report d&apos;impôt, tout en surveillant le seuil critique des revenus passifs.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--mpr-border)' }}>
                    <table className="min-w-full border-collapse">
                      <thead style={{ background: '#f8fafc' }}>
                        <tr>
                          <th className="px-4 py-4 text-left text-[18px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>
                            Élément
                          </th>
                          <th className="px-4 py-4 text-left text-[18px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>
                            Indication
                          </th>
                          <th className="px-4 py-4 text-left text-[18px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>
                            Lecture stratégique
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderTop: '1px solid var(--mpr-border)' }}>
                          <td className="px-4 py-4 text-[18px] font-semibold" style={{ color: 'var(--mpr-text)' }}>
                            Taux d&apos;imposition PME
                          </td>
                          <td className="px-4 py-4 text-[18px]" style={{ color: 'var(--mpr-text)' }}>
                            {formatPercent(SMALL_BUSINESS_TAX_RATE)}
                          </td>
                          <td className="px-4 py-4 text-[18px]" style={{ color: 'var(--mpr-text)' }}>
                            Le revenu laissé dans la société est souvent imposé beaucoup moins vite qu&apos;un retrait personnel immédiat.
                          </td>
                        </tr>
                        <tr style={{ borderTop: '1px solid var(--mpr-border)', background: '#f8fafc' }}>
                          <td className="px-4 py-4 text-[18px] font-semibold" style={{ color: 'var(--mpr-text)' }}>
                            Taux marginal personnel
                          </td>
                          <td className="px-4 py-4 text-[18px]" style={{ color: 'var(--mpr-text)' }}>
                            {formatPercent(PERSONAL_MARGINAL_RATE_MIN)} à {formatPercent(PERSONAL_MARGINAL_RATE_MAX)}
                          </td>
                          <td className="px-4 py-4 text-[18px]" style={{ color: 'var(--mpr-text)' }}>
                            Sortir trop de liquidités personnellement peut accélérer l&apos;impôt et réduire la capacité d&apos;investir pour la retraite.
                          </td>
                        </tr>
                        <tr style={{ borderTop: '1px solid var(--mpr-border)' }}>
                          <td className="px-4 py-4 text-[18px] font-semibold" style={{ color: 'var(--mpr-text)' }}>
                            Avantage principal
                          </td>
                          <td className="px-4 py-4 text-[18px]" style={{ color: 'var(--mpr-text)' }}>
                            Différé fiscal
                          </td>
                          <td className="px-4 py-4 text-[18px]" style={{ color: 'var(--mpr-text)' }}>
                            Reporter le revenu dans la corporation permet de différer l&apos;impôt et d&apos;augmenter le capital à investir.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <Alert
                    className="border"
                    style={{
                      borderColor: 'rgba(220, 38, 38, 0.22)',
                      background: '#fef2f2',
                      borderRadius: 'var(--senior-radius-lg, 12px)',
                    }}
                  >
                    <AlertTriangle className="h-5 w-5" style={{ color: 'var(--mpr-error)' }} />
                    <AlertDescription className="text-[18px] leading-[1.7]" style={{ color: 'var(--mpr-text)' }}>
                      Attention : Si votre corporation génère plus de 50 000 $ de revenus passifs par an, vous commencez à perdre l&apos;accès au taux d&apos;imposition des PME (12,2 %). Au-delà de 150 000 $ de revenus passifs, le taux PME est entièrement perdu.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,340px)_1fr]">
                    <div className="space-y-2">
                      <Label
                        htmlFor="corporate-passive-income"
                        className="text-[18px] font-semibold leading-7"
                        style={{ color: 'var(--mpr-text)' }}
                      >
                        Revenus passifs de la corporation
                      </Label>
                      <Input
                        id="corporate-passive-income"
                        type="number"
                        min={0}
                        step={1000}
                        value={corporatePassiveIncome}
                        onChange={(event) =>
                          setCorporatePassiveIncome(Math.max(0, Number(event.target.value) || 0))
                        }
                        className="min-h-14 text-[18px] font-semibold"
                      />
                    </div>

                    <div
                      className="rounded-2xl border p-5"
                      style={{
                        borderColor: passiveIncomeState.border,
                        background: passiveIncomeState.background,
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[16px] leading-7" style={{ color: 'var(--mpr-text-muted)' }}>
                            Indicateur du seuil de 50 000 $
                          </p>
                          <p className="mt-2 text-[24px] font-bold" style={{ color: passiveIncomeState.color }}>
                            {passiveIncomeState.label}
                          </p>
                        </div>
                        <p className="text-[24px] font-bold" style={{ color: passiveIncomeState.color }}>
                          {formatCurrency(corporatePassiveIncome)}
                        </p>
                      </div>

                      <div
                        className="mt-4 h-4 overflow-hidden rounded-full"
                        style={{ background: 'rgba(226, 232, 240, 0.9)' }}
                        aria-label="Indicateur visuel du seuil de revenus passifs"
                      >
                        <div
                          className="h-full rounded-full transition-[width] duration-300"
                          style={{
                            width: passiveIncomeState.width,
                            background: passiveIncomeState.color,
                          }}
                        />
                      </div>

                      <div className="mt-3 flex justify-between text-[16px]" style={{ color: 'var(--mpr-text-muted)' }}>
                        <span>0 $</span>
                        <span>50 000 $</span>
                        <span>150 000 $</span>
                      </div>

                      <p className="mt-4 text-[18px] leading-[1.75]" style={{ color: 'var(--mpr-text)' }}>
                        {passiveIncomeWarning}
                      </p>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl border p-5"
                    style={{
                      borderColor: 'rgba(76, 110, 245, 0.18)',
                      background: '#f8fafc',
                    }}
                  >
                    <p className="text-[20px] font-semibold leading-[1.5]" style={{ color: 'var(--mpr-h4)' }}>
                      Exonération cumulative des gains en capital (LCGE)
                    </p>
                    <p className="mt-3 text-[18px] leading-[1.75]" style={{ color: 'var(--mpr-text)' }}>
                      Si vous vendez les actions admissibles de votre PME, les premiers 1 250 000 $ de gain en capital peuvent être exonérés d&apos;impôt (montant confirmé pour 2025; le montant 2026 n&apos;est pas encore publié par l&apos;ARC). Consultez un fiscaliste.
                    </p>
                  </div>

                  <Card
                    className="border"
                    style={{
                      borderColor: 'var(--mpr-border)',
                      borderRadius: 'var(--senior-radius-lg, 12px)',
                      background: '#ffffff',
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-[24px]" style={{ color: 'var(--mpr-h3)' }}>
                        Options de retraite pour incorporés
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-[18px] leading-[1.75]" style={{ color: 'var(--mpr-text)' }}>
                        <li>REER individuel alimenté depuis le salaire versé par la corporation</li>
                        <li>IPP (Régime de pension individuel) — option avancée à évaluer avec votre conseiller</li>
                        <li>Dividendes depuis la corporation — imposés différemment du salaire</li>
                        <li>Compte de dividendes en capital (CDC) — notion avancée utile en planification intégrée</li>
                      </ul>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-y-4">
            <a
              href="/blog/fr/planifier-sa-retraite-travailleur-autonome-incorpore-quebec"
              className="inline-flex min-h-14 items-center rounded-xl border px-5 py-3 text-[18px] font-semibold no-underline transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none"
              style={{
                color: 'var(--mpr-primary)',
                borderColor: 'var(--mpr-primary)',
                background: '#ffffff',
                boxShadow: 'var(--senior-shadow-sm)',
              }}
            >
              Lire notre guide : Retraite pour travailleur autonome et incorporé
            </a>

            <div className="flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: 'var(--mpr-border)', background: '#ffffff' }}>
              <Info className="mt-1 h-5 w-5 shrink-0" style={{ color: 'var(--mpr-primary)' }} />
              <p className="text-[16px] leading-[1.7]" style={{ color: 'var(--mpr-text-muted)' }}>
                Ces projections sont à titre éducatif uniquement. Consultez un planificateur financier pour une analyse personnalisée.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravailleursAutonomeModule;
