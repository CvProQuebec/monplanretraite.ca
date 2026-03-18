import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Landmark, PiggyBank, Wallet } from 'lucide-react';

type AssetValues = {
  reerFerr: number;
  celi: number;
  celiapp: number;
  placementsNonEnregistres: number;
  liquidites: number;
  residencePrincipale: number;
  autresProprietes: number;
  assuranceVie: number;
  regimeEmployeur: number;
  autresActifs: number;
};

type LiabilityValues = {
  hypothequeResidence: number;
  autresHypotheques: number;
  cartesCredit: number;
  margesCredit: number;
  pretsAutoPersonnels: number;
  autresDettes: number;
};

const formatCurrency = (value: number) =>
  value.toLocaleString('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  });

const sumValues = (values: Record<string, number>) =>
  Object.values(values).reduce((sum, value) => sum + value, 0);

const defaultAssets: AssetValues = {
  reerFerr: 150000,
  celi: 45000,
  celiapp: 0,
  placementsNonEnregistres: 25000,
  liquidites: 18000,
  residencePrincipale: 550000,
  autresProprietes: 0,
  assuranceVie: 0,
  regimeEmployeur: 85000,
  autresActifs: 0,
};

const defaultLiabilities: LiabilityValues = {
  hypothequeResidence: 185000,
  autresHypotheques: 0,
  cartesCredit: 2500,
  margesCredit: 0,
  pretsAutoPersonnels: 12000,
  autresDettes: 0,
};

const getInterpretation = (netWorth: number) => {
  if (netWorth > 500000) {
    return 'Excellente base pour une retraite confortable.';
  }

  if (netWorth >= 250000) {
    return 'Bonne progression. Continuez à épargner et optimisez votre décaissement.';
  }

  if (netWorth >= 100000) {
    return 'Des efforts supplémentaires d’épargne seront nécessaires. Consultez nos outils.';
  }

  return 'Il est recommandé de consulter un planificateur financier pour établir un plan.';
};

const fieldClassName = 'min-h-14 text-[18px] font-semibold';

export const ActifNetModule: React.FC = () => {
  const [assets, setAssets] = useState<AssetValues>(defaultAssets);
  const [liabilities, setLiabilities] = useState<LiabilityValues>(defaultLiabilities);

  const totalAssets = useMemo(() => sumValues(assets), [assets]);
  const totalLiabilities = useMemo(() => sumValues(liabilities), [liabilities]);
  const netWorth = totalAssets - totalLiabilities;
  const interpretation = getInterpretation(netWorth);

  const updateAsset = (key: keyof AssetValues, value: number) => {
    setAssets((previous) => ({ ...previous, [key]: Math.max(0, value || 0) }));
  };

  const updateLiability = (key: keyof LiabilityValues, value: number) => {
    setLiabilities((previous) => ({ ...previous, [key]: Math.max(0, value || 0) }));
  };

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
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <CardTitle
                className="text-[28px] font-semibold leading-[1.35]"
                style={{ color: 'var(--mpr-h2)', letterSpacing: '0.025em' }}
              >
                Bilan patrimonial
              </CardTitle>
              <CardDescription
                className="mt-2 text-[18px] leading-[1.65]"
                style={{ color: 'var(--mpr-text-muted)' }}
              >
                Calculez votre actif net en comparant ce que vous possédez à ce que vous devez, sans enregistrer vos données ailleurs que sur votre appareil.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6 pt-0 md:p-8 md:pt-0">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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
                  Actifs
                </CardTitle>
                <CardDescription className="text-[18px] leading-[1.6]" style={{ color: 'var(--mpr-text-muted)' }}>
                  Ce que vous possédez
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[20px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>
                    Épargne et placements
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="asset-reer" className="text-[18px] font-semibold">REER / FERR</Label>
                      <Input id="asset-reer" type="number" value={assets.reerFerr} onChange={(e) => updateAsset('reerFerr', Number(e.target.value))} className={fieldClassName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asset-celi" className="text-[18px] font-semibold">CELI</Label>
                      <Input id="asset-celi" type="number" value={assets.celi} onChange={(e) => updateAsset('celi', Number(e.target.value))} className={fieldClassName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asset-celiapp" className="text-[18px] font-semibold">CELIAPP</Label>
                      <Input id="asset-celiapp" type="number" value={assets.celiapp} onChange={(e) => updateAsset('celiapp', Number(e.target.value))} className={fieldClassName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asset-nonreg" className="text-[18px] font-semibold">Placements non enregistrés</Label>
                      <Input id="asset-nonreg" type="number" value={assets.placementsNonEnregistres} onChange={(e) => updateAsset('placementsNonEnregistres', Number(e.target.value))} className={fieldClassName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asset-cash" className="text-[18px] font-semibold">Liquidités (comptes bancaires)</Label>
                      <Input id="asset-cash" type="number" value={assets.liquidites} onChange={(e) => updateAsset('liquidites', Number(e.target.value))} className={fieldClassName} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[20px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>
                    Immobilier
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="asset-home" className="text-[18px] font-semibold">Valeur de la résidence principale</Label>
                      <Input id="asset-home" type="number" value={assets.residencePrincipale} onChange={(e) => updateAsset('residencePrincipale', Number(e.target.value))} className={fieldClassName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asset-other-properties" className="text-[18px] font-semibold">Valeur des autres propriétés</Label>
                      <Input id="asset-other-properties" type="number" value={assets.autresProprietes} onChange={(e) => updateAsset('autresProprietes', Number(e.target.value))} className={fieldClassName} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[20px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>
                    Autres actifs
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="asset-insurance" className="text-[18px] font-semibold">Valeur de rachat d&apos;une assurance vie</Label>
                      <Input id="asset-insurance" type="number" value={assets.assuranceVie} onChange={(e) => updateAsset('assuranceVie', Number(e.target.value))} className={fieldClassName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asset-pension" className="text-[18px] font-semibold">Régime de retraite d&apos;employeur (valeur de transfert estimée)</Label>
                      <Input id="asset-pension" type="number" value={assets.regimeEmployeur} onChange={(e) => updateAsset('regimeEmployeur', Number(e.target.value))} className={fieldClassName} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asset-other" className="text-[18px] font-semibold">Autres actifs</Label>
                      <Input id="asset-other" type="number" value={assets.autresActifs} onChange={(e) => updateAsset('autresActifs', Number(e.target.value))} className={fieldClassName} />
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: 'rgba(76, 110, 245, 0.22)',
                    background: '#f0f9ff',
                  }}
                >
                  <p className="text-[18px] font-semibold" style={{ color: 'var(--mpr-text-muted)' }}>
                    Total des actifs
                  </p>
                  <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-primary)' }}>
                    {formatCurrency(totalAssets)}
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
                  <Landmark className="h-6 w-6" style={{ color: 'var(--mpr-warning)' }} />
                  Passifs
                </CardTitle>
                <CardDescription className="text-[18px] leading-[1.6]" style={{ color: 'var(--mpr-text-muted)' }}>
                  Ce que vous devez
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="liability-home-mortgage" className="text-[18px] font-semibold">Solde hypothèque résidence principale</Label>
                  <Input id="liability-home-mortgage" type="number" value={liabilities.hypothequeResidence} onChange={(e) => updateLiability('hypothequeResidence', Number(e.target.value))} className={fieldClassName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liability-other-mortgages" className="text-[18px] font-semibold">Solde autres hypothèques</Label>
                  <Input id="liability-other-mortgages" type="number" value={liabilities.autresHypotheques} onChange={(e) => updateLiability('autresHypotheques', Number(e.target.value))} className={fieldClassName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liability-cards" className="text-[18px] font-semibold">Solde cartes de crédit</Label>
                  <Input id="liability-cards" type="number" value={liabilities.cartesCredit} onChange={(e) => updateLiability('cartesCredit', Number(e.target.value))} className={fieldClassName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liability-lines" className="text-[18px] font-semibold">Marges de crédit</Label>
                  <Input id="liability-lines" type="number" value={liabilities.margesCredit} onChange={(e) => updateLiability('margesCredit', Number(e.target.value))} className={fieldClassName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liability-loans" className="text-[18px] font-semibold">Prêts auto ou personnels</Label>
                  <Input id="liability-loans" type="number" value={liabilities.pretsAutoPersonnels} onChange={(e) => updateLiability('pretsAutoPersonnels', Number(e.target.value))} className={fieldClassName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liability-other" className="text-[18px] font-semibold">Autres dettes</Label>
                  <Input id="liability-other" type="number" value={liabilities.autresDettes} onChange={(e) => updateLiability('autresDettes', Number(e.target.value))} className={fieldClassName} />
                </div>

                <div
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: 'rgba(217, 119, 6, 0.22)',
                    background: '#fff7ed',
                  }}
                >
                  <p className="text-[18px] font-semibold" style={{ color: 'var(--mpr-text-muted)' }}>
                    Total des passifs
                  </p>
                  <p className="mt-2 text-[28px] font-bold leading-tight" style={{ color: 'var(--mpr-warning)' }}>
                    {formatCurrency(totalLiabilities)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card
            className="border"
            style={{
              borderColor: 'rgba(76, 110, 245, 0.2)',
              borderRadius: 'var(--senior-radius-lg, 12px)',
              boxShadow: 'var(--senior-shadow)',
              background: '#ffffff',
            }}
          >
            <CardContent className="space-y-4 p-5 md:p-6">
              <p className="text-[20px] font-semibold" style={{ color: 'var(--mpr-h4)' }}>
                Votre actif net
              </p>
              <p
                className="text-[28px] font-bold leading-tight"
                style={{ color: 'var(--mpr-primary)' }}
              >
                {formatCurrency(netWorth)}
              </p>
              <p className="text-[18px] leading-[1.75]" style={{ color: 'var(--mpr-text)' }}>
                {interpretation}
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  className="min-h-14 min-w-[120px] px-6 text-[18px] font-semibold"
                  style={{
                    background: 'var(--mpr-primary)',
                    color: '#ffffff',
                  }}
                >
                  <a href="/withdrawals">Voir mon plan de décaissement</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-[16px] leading-[1.7]" style={{ color: 'var(--mpr-text-muted)' }}>
            Ces projections sont à titre éducatif uniquement. Consultez un planificateur financier pour une analyse personnalisée. Les données saisies dans ce module demeurent locales à votre appareil.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActifNetModule;
