import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import {
  PurchaseComparatorService,
  type ComparatorInput,
  type PurchaseOptionInput
} from '@/services/PurchaseComparatorService';

type Num = number;

function toNum(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export const PurchaseOptionsComparator: React.FC = () => {
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  const [horizonYears, setHorizonYears] = useState<Num>(5);

  // Defaults — simple car example
  const [neuf, setNeuf] = useState<PurchaseOptionInput>({
    label: 'Neuf',
    financing: {
      price: 32000,
      downPayment: 4000,
      annualRate: 0.069,
      termMonths: 72,
      salesTaxRate: 0.15,
      warrantyCost: 1200,
      registrationFees: 300
    },
    ownership: {
      maintenancePerYear: 350,
      insurancePerYear: 1400,
      fuelOrEnergyPerYear: 1800,
      expectedResaleValue: 13000,
      otherRecurringPerYear: 0
    }
  });

  const [usage, setUsage] = useState<PurchaseOptionInput>({
    label: 'Usagé',
    financing: {
      price: 18000,
      downPayment: 2000,
      annualRate: 0.069,
      termMonths: 60,
      salesTaxRate: 0.15,
      warrantyCost: 600,
      registrationFees: 300
    },
    ownership: {
      maintenancePerYear: 650,
      insurancePerYear: 1200,
      fuelOrEnergyPerYear: 1900,
      expectedResaleValue: 7000,
      otherRecurringPerYear: 0
    }
  });

  const [financement, setFinancement] = useState<PurchaseOptionInput>({
    label: 'Financement',
    financing: {
      price: 30000,
      downPayment: 0,
      annualRate: 0.089,
      termMonths: 84,
      salesTaxRate: 0.15,
      warrantyCost: 0,
      registrationFees: 300
    },
    ownership: {
      maintenancePerYear: 450,
      insurancePerYear: 1350,
      fuelOrEnergyPerYear: 1800,
      expectedResaleValue: 12000,
      otherRecurringPerYear: 0
    }
  });

  const params: ComparatorInput = useMemo(() => ({
    horizonYears: Math.max(1, Math.floor(horizonYears)),
    options: [neuf, usage, financement]
  }), [horizonYears, neuf, usage, financement]);

  const result = useMemo(() => {
    try {
      return PurchaseComparatorService.compare(params);
    } catch (e) {
      console.warn('Comparator error:', e);
      return null;
    }
  }, [params]);

  const t = {
    title: isFrench ? 'Comparateur d’options d’achat' : 'Purchase options comparator',
    subtitle: isFrench
      ? 'Comparez Neuf vs Usagé vs Financement (coût total et coût mensuel)'
      : 'Compare New vs Used vs Financing (total and monthly cost)',
    horizon: isFrench ? 'Horizon (années)' : 'Horizon (years)',
    price: isFrench ? 'Prix' : 'Price',
    down: isFrench ? 'Mise de fonds' : 'Down payment',
    rate: isFrench ? 'Taux annuel' : 'Annual rate',
    term: isFrench ? 'Terme (mois)' : 'Term (months)',
    tax: isFrench ? 'Taxes (%)' : 'Sales tax (%)',
    warranty: isFrench ? 'Garantie' : 'Warranty',
    fees: isFrench ? 'Frais' : 'Fees',
    maint: isFrench ? 'Entretien/an' : 'Maintenance/yr',
    ins: isFrench ? 'Assurance/an' : 'Insurance/yr',
    energy: isFrench ? 'Énergie/an' : 'Energy/yr',
    other: isFrench ? 'Autres/an' : 'Other/yr',
    resale: isFrench ? 'Revente (fin horizon)' : 'Resale (end of horizon)',
    compare: isFrench ? 'Comparer' : 'Compare',
    results: isFrench ? 'Résultats' : 'Results',
    monthlyPayment: isFrench ? 'Paiement mensuel' : 'Monthly payment',
    upfrontCost: isFrench ? 'Coût initial' : 'Upfront cost',
    totalCost: isFrench ? 'Coût total (TCO)' : 'Total cost (TCO)',
    monthlyTCO: isFrench ? 'TCO mensuel' : 'Monthly TCO',
    recommendation: isFrench ? 'Recommandation' : 'Recommendation'
  };

  const Currency = (v: number) =>
    new Intl.NumberFormat(isFrench ? 'fr-CA' : 'en-CA', { style: 'currency', currency: 'CAD' }).format(v);

  const Percent = (v: number) => `${(v * 100).toFixed(2)}%`;

  const onChangeFin = (setter: (v: PurchaseOptionInput) => void, prev: PurchaseOptionInput, field: keyof PurchaseOptionInput['financing'], value: any) => {
    setter({
      ...prev,
      financing: {
        ...prev.financing,
        [field]: field === 'annualRate' || field === 'salesTaxRate'
          ? toNum(value)
          : toNum(value)
      }
    });
  };
  const onChangeOwn = (setter: (v: PurchaseOptionInput) => void, prev: PurchaseOptionInput, field: keyof PurchaseOptionInput['ownership'], value: any) => {
    setter({
      ...prev,
      ownership: {
        ...prev.ownership,
        [field]: toNum(value)
      }
    });
  };

  const optionCard = (label: string, value: PurchaseOptionInput, setter: (v: PurchaseOptionInput) => void) => (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label>{t.price}</Label>
            <Input type="number" value={value.financing.price}
              onChange={(e) => onChangeFin(setter, value, 'price', e.target.value)} />
          </div>
          <div>
            <Label>{t.down}</Label>
            <Input type="number" value={value.financing.downPayment ?? 0}
              onChange={(e) => onChangeFin(setter, value, 'downPayment', e.target.value)} />
          </div>
          <div>
            <Label>{t.rate}</Label>
            <Input type="number" step="0.001" value={value.financing.annualRate ?? 0}
              onChange={(e) => onChangeFin(setter, value, 'annualRate', e.target.value)} />
          </div>
          <div>
            <Label>{t.term}</Label>
            <Input type="number" value={value.financing.termMonths ?? 0}
              onChange={(e) => onChangeFin(setter, value, 'termMonths', e.target.value)} />
          </div>
          <div>
            <Label>{t.tax}</Label>
            <Input type="number" step="0.001" value={value.financing.salesTaxRate ?? 0.15}
              onChange={(e) => onChangeFin(setter, value, 'salesTaxRate', e.target.value)} />
          </div>
          <div>
            <Label>{t.warranty}</Label>
            <Input type="number" value={value.financing.warrantyCost ?? 0}
              onChange={(e) => onChangeFin(setter, value, 'warrantyCost', e.target.value)} />
          </div>
          <div>
            <Label>{t.fees}</Label>
            <Input type="number" value={value.financing.registrationFees ?? 0}
              onChange={(e) => onChangeFin(setter, value, 'registrationFees', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label>{t.maint}</Label>
            <Input type="number" value={value.ownership.maintenancePerYear ?? 0}
              onChange={(e) => onChangeOwn(setter, value, 'maintenancePerYear', e.target.value)} />
          </div>
          <div>
            <Label>{t.ins}</Label>
            <Input type="number" value={value.ownership.insurancePerYear ?? 0}
              onChange={(e) => onChangeOwn(setter, value, 'insurancePerYear', e.target.value)} />
          </div>
          <div>
            <Label>{t.energy}</Label>
            <Input type="number" value={value.ownership.fuelOrEnergyPerYear ?? 0}
              onChange={(e) => onChangeOwn(setter, value, 'fuelOrEnergyPerYear', e.target.value)} />
          </div>
          <div>
            <Label>{t.other}</Label>
            <Input type="number" value={value.ownership.otherRecurringPerYear ?? 0}
              onChange={(e) => onChangeOwn(setter, value, 'otherRecurringPerYear', e.target.value)} />
          </div>
          <div>
            <Label>{t.resale}</Label>
            <Input type="number" value={value.ownership.expectedResaleValue ?? 0}
              onChange={(e) => onChangeOwn(setter, value, 'expectedResaleValue', e.target.value)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">{t.subtitle}</p>
          <div className="max-w-xs">
            <Label>{t.horizon}</Label>
            <Input
              type="number"
              value={horizonYears}
              onChange={(e) => setHorizonYears(toNum(e.target.value))}
              min={1}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {optionCard('Neuf', neuf, setNeuf)}
            {optionCard('Usagé', usage, setUsage)}
            {optionCard('Financement', financement, setFinancement)}
          </div>

          <div className="pt-2">
            <Button type="button" onClick={() => { /* computed via useMemo */ }}>
              {t.compare}
            </Button>
          </div>

          {result && (
            <div className="mt-4 space-y-3">
              <h3 className="text-lg font-semibold">{t.results}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {result.results.map((r) => (
                  <Card key={r.label} className="border">
                    <CardHeader>
                      <CardTitle className="text-base">{r.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                      <div><strong>{t.monthlyPayment}:</strong> {Currency(r.monthlyPayment)}</div>
                      <div><strong>{t.upfrontCost}:</strong> {Currency(r.upfrontCost)}</div>
                      <div><strong>{t.totalCost}:</strong> {Currency(r.totalCost)}</div>
                      <div><strong>{t.monthlyTCO}:</strong> {Currency(r.monthlyTCO)}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-sm text-gray-800">
                <strong>{t.recommendation}:</strong> {result.recommendation}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseOptionsComparator;
