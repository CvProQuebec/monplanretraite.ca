import React, { useMemo, useState, useEffect } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  recommendAllocation,
  computeRebalancePlan,
  recommendedEquityBand,
  type Allocation
} from '@/services/PortfolioOptimizationService';

function toNum(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

const pct = (x: number) => `${(x * 100).toFixed(1)} %`;

export const PortfolioOptimizer: React.FC = () => {
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  const t = {
    title: isFrench ? 'Optimiseur de portefeuille' : 'Portfolio optimizer',
    description: isFrench
      ? 'Allouez 60–75 % en actions selon votre âge, 12–24 mois de liquidités, et rééquilibrez à ±5 %.'
      : 'Allocate 60–75% equities by age, keep 12–24 months of cash, and rebalance at ±5%.',
    inputs: {
      age: isFrench ? 'Âge' : 'Age',
      portfolioValue: isFrench ? 'Valeur du portefeuille (CAD)' : 'Portfolio value (CAD)',
      monthlyEssential: isFrench ? 'Dépenses essentielles mensuelles (CAD)' : 'Monthly essential spending (CAD)',
      current: isFrench ? 'Allocation actuelle (%)' : 'Current allocation (%)',
      equities: isFrench ? 'Actions' : 'Equities',
      bonds: isFrench ? 'Obligations' : 'Bonds',
      cash: isFrench ? 'Liquidités' : 'Cash'
    },
    target: isFrench ? 'Allocation cible' : 'Target allocation',
    band: isFrench ? 'Bande actions recommandée' : 'Recommended equity band',
    geo: isFrench ? 'Répartition géographique (dans les actions)' : 'Geographic breakdown (within equities)',
    rebalance: isFrench ? 'Plan de rééquilibrage (règle ±5 %)' : 'Rebalancing plan (±5% rule)',
    notes: isFrench ? 'Notes' : 'Notes'
  };

  // Inputs
  const [age, setAge] = useState<number>(70);
  const [portfolioValue, setPortfolioValue] = useState<number>(500_000);
  const [monthlyEssential, setMonthlyEssential] = useState<number>(3_000);

  // Current allocation sliders (in percent)
  const [curEq, setCurEq] = useState<number>(65);
  const [curBo, setCurBo] = useState<number>(30);
  const [curCa, setCurCa] = useState<number>(5);

  // Auto-load defaults from saved user data (localStorage: 'retirement_data')
  useEffect(() => {
    try {
      const raw = localStorage.getItem('retirement_data');
      if (!raw) return;
      const data = JSON.parse(raw);

      // Age
      const birthISO = data?.personal?.naissance1;
      let derivedAge: number | undefined = undefined;
      if (birthISO) {
        const d = new Date(birthISO);
        if (!Number.isNaN(d.getTime())) {
          derivedAge = new Date().getFullYear() - d.getFullYear();
          if (derivedAge > 0 && derivedAge < 110) setAge(derivedAge);
        }
      }

      // Essential monthly spending (for cushion and recommendation)
      const cf = data?.cashflow || {};
      const essentials = ['logement','servicesPublics','assurances','alimentation','transport','sante']
        .reduce((s, k) => s + (Number(cf[k]) || 0), 0);
      if (essentials > 0) setMonthlyEssential(essentials);

      // Portfolio value (sum of primary accounts)
      const s = data?.savings || {};
      const portfolioSum =
        (Number(s.reer1) || 0) + (Number(s.reer2) || 0) +
        (Number(s.celi1) || 0) + (Number(s.celi2) || 0) +
        (Number(s.placements1) || 0) + (Number(s.placements2) || 0) +
        (Number(s.epargne1) || 0) + (Number(s.epargne2) || 0) +
        (Number(s.cri1) || 0) + (Number(s.cri2) || 0);
      if (portfolioSum > 0) setPortfolioValue(portfolioSum);

      // Default current allocation to recommended target (if user never set it)
      const ageForRec = typeof derivedAge === 'number' ? derivedAge : age;
      const rec0 = recommendAllocation(ageForRec, essentials || monthlyEssential, portfolioSum || portfolioValue);
      setCurEq(Math.round(rec0.targetAllocation.equities * 100));
      setCurBo(Math.round(rec0.targetAllocation.bonds * 100));
      setCurCa(Math.round(rec0.targetAllocation.cash * 100));
    } catch (e) {
      console.warn('PortfolioOptimizer auto-load failed:', e);
    }
  }, []);

  // Normalize current inputs to Allocation (0..1)
  const current: Allocation = useMemo(() => {
    const s = Math.max(1, curEq + curBo + curCa);
    return {
      equities: Math.max(0, curEq / s),
      bonds: Math.max(0, curBo / s),
      cash: Math.max(0, curCa / s),
    };
  }, [curEq, curBo, curCa]);

  const rec = useMemo(
    () => recommendAllocation(age, monthlyEssential, portfolioValue),
    [age, monthlyEssential, portfolioValue]
  );

  const band = useMemo(() => recommendedEquityBand(age), [age]);

  const rebalance = useMemo(
    () => computeRebalancePlan(current, rec.targetAllocation),
    [current, rec]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>{t.inputs.age}</Label>
            <Input type="number" value={age} onChange={(e) => setAge(toNum(e.target.value))} min={50} max={99} />
          </div>
          <div>
            <Label>{t.inputs.portfolioValue}</Label>
            <Input type="number" value={portfolioValue} onChange={(e) => setPortfolioValue(toNum(e.target.value))} min={10000} step={1000} />
          </div>
          <div>
            <Label>{t.inputs.monthlyEssential}</Label>
            <Input type="number" value={monthlyEssential} onChange={(e) => setMonthlyEssential(toNum(e.target.value))} min={500} step={50} />
          </div>
        </div>

        <Separator />

        {/* Current allocation */}
        <div className="space-y-2">
          <div className="font-semibold">{t.inputs.current}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>{t.inputs.equities}</Label>
              <Input type="number" value={curEq} onChange={(e) => setCurEq(toNum(e.target.value))} min={0} max={100} />
            </div>
            <div>
              <Label>{t.inputs.bonds}</Label>
              <Input type="number" value={curBo} onChange={(e) => setCurBo(toNum(e.target.value))} min={0} max={100} />
            </div>
            <div>
              <Label>{t.inputs.cash}</Label>
              <Input type="number" value={curCa} onChange={(e) => setCurCa(toNum(e.target.value))} min={0} max={100} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Target allocation and band */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border">
            <CardHeader><CardTitle className="text-base">{t.target}</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div><Badge variant="secondary">{t.inputs.equities}</Badge> {pct(rec.targetAllocation.equities)}</div>
              <div><Badge variant="secondary">{t.inputs.bonds}</Badge> {pct(rec.targetAllocation.bonds)}</div>
              <div><Badge variant="secondary">{t.inputs.cash}</Badge> {pct(rec.targetAllocation.cash)}</div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader><CardTitle className="text-base">{t.band}</CardTitle></CardHeader>
            <CardContent className="text-sm">
              {pct(band.min)} – {pct(band.max)}
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader><CardTitle className="text-base">{t.geo}</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <div>Canada: {pct(rec.equityGeoBreakdown.canada)}</div>
              <div>US: {pct(rec.equityGeoBreakdown.unitedStates)}</div>
              <div>International: {pct(rec.equityGeoBreakdown.international)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Rebalance plan */}
        <Card className="border">
          <CardHeader><CardTitle className="text-base">{t.rebalance}</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-1">
            {rebalance.deltas.map((d) => (
              <div key={d.asset}>
                <Badge variant={Math.abs(d.delta) >= 0.05 ? 'default' : 'secondary'}>
                  {d.asset.toUpperCase()}
                </Badge>{' '}
                {d.delta >= 0 ? (isFrench ? 'augmenter de' : 'increase by') : (isFrench ? 'réduire de' : 'reduce by')} {pct(Math.abs(d.delta))}
              </div>
            ))}
            <div className="text-gray-600 mt-2">{rebalance.rule}</div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="border">
          <CardHeader><CardTitle className="text-base">{t.notes}</CardTitle></CardHeader>
          <CardContent className="text-sm text-gray-700 space-y-1">
            {rec.notes.map((n, i) => (<div key={i}>• {n}</div>))}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PortfolioOptimizer;
