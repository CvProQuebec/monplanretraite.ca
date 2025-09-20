import React, { useMemo, useState, useEffect } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import StressTestService, { type StressTestReport, type StressLevel } from '@/services/StressTestService';
import { recommendedEquityBand } from '@/services/PortfolioOptimizationService';

function toNum(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

const levelColor = (level: StressLevel) => {
  switch (level) {
    case 'pass':
      return { badge: 'bg-emerald-600', card: 'border-emerald-300 bg-emerald-50', title: 'text-emerald-800', text: 'text-emerald-900' };
    case 'warn':
      return { badge: 'bg-amber-600', card: 'border-amber-300 bg-amber-50', title: 'text-amber-800', text: 'text-amber-900' };
    case 'fail':
      return { badge: 'bg-red-600', card: 'border-red-300 bg-red-50', title: 'text-red-800', text: 'text-red-900' };
  }
};

export const StressTestModule: React.FC = () => {
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  const t = {
    title: isFrench ? 'Stress-test de retraite (aligné 60–75 % actions)' : 'Retirement Stress-test (aligned 60–75% equities)',
    description: isFrench
      ? 'Trois chocs: séquence de -30 % / -15 %, pic d’inflation, longévité +5 ans. Basé sur la stratégie moderne prônée dans notre article.'
      : 'Three shocks: sequence -30%/-15%, inflation spike, longevity +5 years. Based on our modern allocation guidance.',
    inputs: {
      age: isFrench ? 'Âge' : 'Age',
      portfolioValue: isFrench ? 'Valeur du portefeuille (CAD)' : 'Portfolio value (CAD)',
      monthlyEssential: isFrench ? 'Dépenses essentielles mensuelles (CAD)' : 'Monthly essential spending (CAD)',
      currentEq: isFrench ? 'Actions actuelles (%)' : 'Current equities (%)',
    },
    results: isFrench ? 'Résultats' : 'Results',
    overall: isFrench ? 'Conclusion globale' : 'Overall conclusion',
    notes: isFrench ? 'Notes' : 'Notes',
  };

  // Inputs (manuels pour rester indépendant du reste du store)
  const [age, setAge] = useState<number>(70);
  const [portfolioValue, setPortfolioValue] = useState<number>(500_000);
  const [monthlyEssential, setMonthlyEssential] = useState<number>(3_000);
  const [currentEqPct, setCurrentEqPct] = useState<number>(65);

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

      // Portfolio value (sum of primary accounts)
      const s = data?.savings || {};
      const portfolioSum =
        (Number(s.reer1) || 0) + (Number(s.reer2) || 0) +
        (Number(s.celi1) || 0) + (Number(s.celi2) || 0) +
        (Number(s.placements1) || 0) + (Number(s.placements2) || 0) +
        (Number(s.epargne1) || 0) + (Number(s.epargne2) || 0) +
        (Number(s.cri1) || 0) + (Number(s.cri2) || 0);
      if (portfolioSum > 0) setPortfolioValue(portfolioSum);

      // Essential monthly spending
      const cf = data?.cashflow || {};
      const essentials = ['logement', 'servicesPublics', 'assurances', 'alimentation', 'transport', 'sante']
        .reduce((sum, k) => sum + (Number(cf[k]) || 0), 0);
      if (essentials > 0) setMonthlyEssential(essentials);

      // Current equities % — default to recommended band mid if not known
      const ageForBand = typeof derivedAge === 'number' ? derivedAge : age;
      const band = recommendedEquityBand(ageForBand);
      const mid = ((band.min + band.max) / 2) * 100;
      setCurrentEqPct(Math.round(mid));
    } catch (e) {
      console.warn('StressTestModule auto-load failed:', e);
    }
  }, []);

  const report: StressTestReport = useMemo(() => {
    return StressTestService.run(
      // userData minimal – non utilisé par le service lorsqu’on fournit les params
      {} as any,
      {
        age,
        portfolioValue,
        monthlyEssentialSpending: monthlyEssential,
        currentEquityAllocation: Math.max(0, Math.min(1, currentEqPct / 100))
      }
    );
  }, [age, portfolioValue, monthlyEssential, currentEqPct]);

  const overallColors = levelColor(report.overall);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <div>
            <Label>{t.inputs.currentEq}</Label>
            <Input type="number" value={currentEqPct} onChange={(e) => setCurrentEqPct(toNum(e.target.value))} min={0} max={100} />
          </div>
        </div>

        <Separator />

        {/* Overall */}
        <div className={`border rounded-lg p-4 ${overallColors.card}`}>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 rounded ${overallColors.badge} text-white`}>
              {report.overall.toUpperCase()}
            </span>
            <div className={`font-semibold ${overallColors.title}`}>{t.overall}</div>
          </div>
          <ul className={`mt-2 list-disc pl-5 ${overallColors.text}`}>
            {report.notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>

        {/* Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.scenarios.map((s) => {
            const c = levelColor(s.level);
            return (
              <div key={s.id} className={`border rounded-lg p-4 ${c.card}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-1 rounded ${c.badge} text-white`}>{s.level.toUpperCase()}</span>
                  <div className={`font-semibold ${c.title}`}>{s.title}</div>
                </div>
                <div className={`${c.text} text-sm`}>{s.summary}</div>
                <div className="mt-2 text-xs text-gray-700">
                  {Object.entries(s.metrics).map(([k, v]) => (
                    <div key={k}><strong>{k}:</strong> {String(v)}</div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-800">
                  <ul className="list-disc pl-5">
                    {s.suggestions.map((sg, i) => <li key={i}>{sg}</li>)}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StressTestModule;
