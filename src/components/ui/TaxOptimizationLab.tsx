import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RetirementHelpers } from '@/domain/retirement/RetirementDomainAdapter';

type AccountBalances = {
  tfsa: number;
  nonRegistered: number;
  rrsp: number;
  rrif: number;
  cppAnnual?: number;
  oasAnnual?: number;
};

type Assumptions = {
  province: string;
  startAge: number;
  grossReturnTFSA: number;
  grossReturnNonReg: number;
  grossReturnRRSP: number;
  grossReturnRRIF: number;
  inflation: number;
  includeCPP: boolean;
  includeOAS: boolean;
  nonRegCapitalGainsRatio: number;
};

type YearDecision = {
  yearIndex: number;
  withdrawTFSA: number;
  withdrawNonReg: number;
  withdrawRRSP: number;
  withdrawRRIF: number;
  startCPP: boolean;
  startOAS: boolean;
};

type YearResult = any;

function toNum(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function fmtCAD(v: number, isFr: boolean) {
  return new Intl.NumberFormat(isFr ? 'fr-CA' : 'en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v);
}

function sumCashflowAnnual(cashflow: any): number {
  if (!cashflow) return 0;
  const keys = ['logement','servicesPublics','assurances','telecom','alimentation','transport','sante','loisirs','depensesSaisonnieres'];
  const monthly = keys.reduce((s, k) => s + (Number(cashflow[k]) || 0), 0);
  return monthly * 12;
}

function deriveAge(birthISO?: string): number | undefined {
  if (!birthISO) return;
  const d = new Date(birthISO);
  if (Number.isNaN(d.getTime())) return;
  return new Date().getFullYear() - d.getFullYear();
}

function heatColorMTR(mtr: number): string {
  if (mtr >= 0.55) return 'bg-red-600 text-white';
  if (mtr >= 0.45) return 'bg-red-400 text-white';
  if (mtr >= 0.35) return 'bg-amber-500 text-white';
  if (mtr >= 0.25) return 'bg-amber-300 text-black';
  return 'bg-emerald-200 text-black';
}

function heatColorBinary(v: number): string {
  return v > 0 ? 'bg-red-500 text-white' : 'bg-emerald-200 text-black';
}

// Baseline builder: "RRSP-only" bisection to achieve target net
function buildRRSPOnlyDecisions(
  opening: AccountBalances,
  assumptions: Assumptions,
  horizonYears: number,
  targetNetAnnual: number
): YearDecision[] {
  const province = assumptions.province ?? 'QC';
  const decisions: YearDecision[] = [];
  // For benefits timing, we align with defaults: start at 70
  const startCPPAt = 70;
  const startOASAt = 70;
  let balances = { ...opening };

  for (let y = 0; y < horizonYears; y++) {
    const age = assumptions.startAge + y;
    const startCPP = (assumptions.includeCPP ?? true) && age >= startCPPAt && !balances.cppAnnual;
    const startOAS = (assumptions.includeOAS ?? true) && age >= startOASAt && !balances.oasAnnual;

    const baseNet = RetirementHelpers.computeTaxYear({
      ordinaryIncome: 0,
      eligiblePensionIncome: 0,
      cpp: balances.cppAnnual || 0,
      oas: balances.oasAnnual || 0,
      eligibleDividends: 0,
      nonEligibleDividends: 0,
      capitalGains: 0,
      age,
      province
    }).netIncome;

    const need = Math.max(0, targetNetAnnual - baseNet);

    // Bisection on RRSP gross (0..available)
    let lo = 0;
    let hi = Math.max(1000, balances.rrsp);
    let best = 0;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      const net = RetirementHelpers.computeTaxYear({
        ordinaryIncome: mid,
        eligiblePensionIncome: 0,
        cpp: balances.cppAnnual || 0,
        oas: balances.oasAnnual || 0,
        eligibleDividends: 0,
        nonEligibleDividends: 0,
        capitalGains: 0,
        age,
        province
      }).netIncome;
      const delta = net - baseNet;
      if (Math.abs(delta - need) <= 1) { best = mid; break; }
      if (delta < need) { best = mid; lo = mid; } else { hi = mid; }
    }
    const withdrawRRSP = Math.min(best, balances.rrsp);
    decisions.push({
      yearIndex: y,
      withdrawTFSA: 0,
      withdrawNonReg: 0,
      withdrawRRSP,
      withdrawRRIF: 0,
      startCPP,
      startOAS
    });
    // Update balances snapshot for next iteration (approx only)
    balances = {
      tfsa: balances.tfsa,
      nonRegistered: balances.nonRegistered,
      rrsp: Math.max(0, balances.rrsp - withdrawRRSP),
      rrif: balances.rrif,
      cppAnnual: startCPP ? (balances.cppAnnual || 9600) : balances.cppAnnual,
      oasAnnual: startOAS ? (balances.oasAnnual || 8400) : balances.oasAnnual
    };
  }
  return decisions;
}

export const TaxOptimizationLab: React.FC = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  const t = {
    title: isFr ? 'Laboratoire d’optimisation fiscale (v1)' : 'Tax Optimization Lab (v1)',
    desc: isFr
      ? 'Optimiseur baseline (Greedy): Non-enregistré → REER → CELI, avec démarrage CPP/SV configurable. Comparez au plan RRSP-seulement.'
      : 'Baseline optimizer (Greedy): Non-registered → RRSP → TFSA, with configurable CPP/OAS start. Compare against RRSP-only plan.',
    inputs: {
      startAge: isFr ? 'Âge de départ' : 'Start age',
      horizon: isFr ? 'Horizon (années)' : 'Horizon (years)',
      targetNet: isFr ? 'Revenu net cible (annuel, CAD)' : 'Target net income (annual, CAD)',
      balances: isFr ? 'Soldes initiaux' : 'Opening balances',
      tfsa: 'TFSA / CELI',
      non: isFr ? 'Non-enregistré' : 'Non-registered',
      rrsp: 'RRSP / REER',
      rrif: 'RRIF / FERR',
      startCPP: isFr ? 'Début RPC/QPP à (âge)' : 'Start CPP/QPP at (age)',
      startOAS: isFr ? 'Début SV/OAS à (âge)' : 'Start OAS at (age)',
      optimize: isFr ? 'Optimiser' : 'Optimize',
      compare: isFr ? 'Comparer (avant / après)' : 'Compare (before / after)'
    },
    results: {
      summary: isFr ? 'Résultats' : 'Results',
      optimizer: isFr ? 'Optimiseur (Greedy)' : 'Optimizer (Greedy)',
      baseline: isFr ? 'RRSP uniquement (référence)' : 'RRSP only (reference)',
      totalTax: isFr ? 'Impôt total (30 ans)' : 'Total tax (30y)',
      metTarget: isFr ? 'Objectif net atteint' : 'Target met',
      heatmaps: isFr ? 'Heatmaps (MTR / Récup. SV / SRG)' : 'Heatmaps (MTR / OAS clawback / GIS)',
      year: isFr ? 'Année' : 'Year',
      age: isFr ? 'Âge' : 'Age',
      tax: isFr ? 'Impôt' : 'Tax',
      net: isFr ? 'Net' : 'Net',
      wTFSA: 'TFSA',
      wNon: isFr ? 'Non-ENR' : 'Non-Reg',
      wRRSP: 'RRSP',
      wRRIF: 'RRIF',
    }
  };

  // Prefill from local storage
  const [startAge, setStartAge] = useState<number>(65);
  const [horizon, setHorizon] = useState<number>(30);
  const [targetNetAnnual, setTargetNetAnnual] = useState<number>(42000);

  const [opening, setOpening] = useState<AccountBalances>({
    tfsa: 30000,
    nonRegistered: 60000,
    rrsp: 250000,
    rrif: 0,
    cppAnnual: 0,
    oasAnnual: 0
  });

  const [startCPPAt, setStartCPPAt] = useState<number>(70);
  const [startOASAt, setStartOASAt] = useState<number>(70);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('retirement_data');
      if (!raw) return;
      const data = JSON.parse(raw);

      const age = deriveAge(data?.personal?.naissance1);
      if (age && age > 0 && age < 110) setStartAge(age);

      const annual = sumCashflowAnnual(data?.cashflow);
      if (annual > 0) setTargetNetAnnual(Math.round(annual));

      const s = data?.savings || {};
      const tfsa = (Number(s.celi1) || 0) + (Number(s.celi2) || 0);
      const nonReg = (Number(s.placements1) || 0) + (Number(s.placements2) || 0) + (Number(s.epargne1) || 0) + (Number(s.epargne2) || 0);
      const rrsp = (Number(s.reer1) || 0) + (Number(s.reer2) || 0);
      const rrif = 0; // v1 assume not converted yet
      setOpening(prev => ({
        ...prev,
        tfsa, nonRegistered: nonReg, rrsp, rrif
      }));
    } catch (e) {
      console.warn('TaxOptimizationLab prefill failed:', e);
    }
  }, []);

  const [optResults, setOptResults] = useState<YearResult[] | null>(null);
  const [baseResults, setBaseResults] = useState<YearResult[] | null>(null);
  const [dpResults, setDpResults] = useState<YearResult[] | null>(null);
  const [dpRunning, setDpRunning] = useState<boolean>(false);
  const [dpScore, setDpScore] = useState<number | null>(null);

  // v3 — Robust mode, decisions, robustness reports
  const [robustMode, setRobustMode] = useState<boolean>(false);
  const [greedyDecisions, setGreedyDecisions] = useState<YearDecision[] | null>(null);
  const [baseDecisions, setBaseDecisions] = useState<YearDecision[] | null>(null);
  const [dpDecisions, setDpDecisions] = useState<YearDecision[] | null>(null);
  const [robustGreedy, setRobustGreedy] = useState<any>(null);
  const [robustDP, setRobustDP] = useState<any>(null);
  const [robustBase, setRobustBase] = useState<any>(null);

  // v2.1 advanced controls + progress
  const [beamWidth, setBeamWidth] = useState<number>(120);
  const [stepSize, setStepSize] = useState<number>(5000);
  const [weightTargetMiss, setWeightTargetMiss] = useState<number>(1.0);
  const [nonRegCGRatio, setNonRegCGRatio] = useState<number>(0.25);
  const [dpProgressYear, setDpProgressYear] = useState<number>(0);
  const [dpProgressBest, setDpProgressBest] = useState<number>(0);
  const [dpProgressBeamCount, setDpProgressBeamCount] = useState<number>(0);
  const [dpWorker, setDpWorker] = useState<Worker | null>(null);

  const assumptions: Assumptions = useMemo(() => ({
    province: 'QC',
    startAge,
    grossReturnTFSA: 0.04,
    grossReturnNonReg: 0.04,
    grossReturnRRSP: 0.04,
    grossReturnRRIF: 0.04,
    inflation: 0.03,
    includeCPP: true,
    includeOAS: true,
    nonRegCapitalGainsRatio: nonRegCGRatio
  }), [startAge, nonRegCGRatio]);

  const runOptimizer = () => {
    const params: any = {
      opening,
      assumptions,
      horizonYears: horizon,
      targetNetAnnual,
      startCPPAt,
      startOASAt
    };
    const decisions = RetirementHelpers.greedyOptimize(params);
    const results = RetirementHelpers.simulateYears(opening, assumptions, decisions, horizon);
    setOptResults(results);
    setGreedyDecisions(decisions);
    if (robustMode) {
      try {
        const rep = RetirementHelpers.evaluateRobustness(
          {
            opening,
            assumptions,
            decisions,
            horizonYears: horizon,
            targetNetAnnual
          },
          isFr ? 'fr' : 'en'
        );
        setRobustGreedy(rep);
      } catch (e) {
        console.warn('Robustness (Greedy) failed:', e);
      }
    }
  };

  const runComparison = () => {
    // Optimizer first
    runOptimizer();
    // Baseline RRSP-only
    const decisions = buildRRSPOnlyDecisions(opening, assumptions, horizon, targetNetAnnual);
    const results = RetirementHelpers.simulateYears(opening, assumptions, decisions, horizon);
    setBaseResults(results);
    setBaseDecisions(decisions);
    if (robustMode) {
      try {
        const rep = RetirementHelpers.evaluateRobustness(
          {
            opening,
            assumptions,
            decisions,
            horizonYears: horizon,
            targetNetAnnual
          },
          isFr ? 'fr' : 'en'
        );
        setRobustBase(rep);
      } catch (e) {
        console.warn('Robustness (Baseline) failed:', e);
      }
    }
  };

  const runDP = () => {
    setDpRunning(true);
    setDpResults(null);
    setDpScore(null);
    setDpProgressYear(0);
    setDpProgressBest(0);
    setDpProgressBeamCount(0);
    try {
      const params = {
        opening,
        assumptions,
        horizonYears: horizon,
        targetNetAnnual,
        startCPPAt,
        startOASAt,
        beamWidth,
        stepSize,
        weightTargetMiss
      };
      const worker = new Worker(new URL('../../workers/dpBeamWorker.ts', import.meta.url), { type: 'module' });
      setDpWorker(worker);
      worker.onmessage = (evt: MessageEvent<any>) => {
        const msg = evt.data;
        if (msg?.type === 'PROGRESS') {
          setDpProgressYear(msg.payload.year);
          setDpProgressBest(msg.payload.bestScore);
          setDpProgressBeamCount(msg.payload.beamCount);
        }
        if (msg?.type === 'RESULT') {
          setDpResults(msg.payload.results);
          setDpScore(msg.payload.score);
          setDpRunning(false);
          // Capture decisions for robustness
          try {
            setDpDecisions(msg.payload.decisions || null);
            if (robustMode && (msg.payload.decisions?.length || 0) > 0) {
              const rep = RetirementHelpers.evaluateRobustness(
                {
                  opening,
                  assumptions,
                  decisions: msg.payload.decisions,
                  horizonYears: horizon,
                  targetNetAnnual
                },
                isFr ? 'fr' : 'en'
              );
              setRobustDP(rep);
            }
          } catch (e) {
            console.warn('Robustness (DP) failed:', e);
          }
          worker.terminate();
          setDpWorker(null);
        }
        if (msg?.type === 'ERROR') {
          console.warn('DP worker error:', msg.error);
          setDpRunning(false);
          worker.terminate();
          setDpWorker(null);
        }
      };
      worker.postMessage({ type: 'RUN', params });
    } catch (e) {
      console.warn('DP worker failed to start:', e);
      setDpRunning(false);
      try { dpWorker?.terminate(); } catch {}
      setDpWorker(null);
    }
  };

  const cancelDP = () => {
    try { dpWorker?.postMessage({ type: 'CANCEL' }); } catch {}
  };

  // v3 — Export PDF summary
  const handleExportPDF = async () => {
    try {
      const lang = isFr ? 'fr' : 'en';
      // Try to pull client name from local storage (optional)
      let clientName: string | undefined = undefined;
      try {
        const raw = localStorage.getItem('retirement_data');
        if (raw) {
          const d = JSON.parse(raw);
          const p = d?.personal || {};
          const name = [p.prenom1, p.nom1].filter(Boolean).join(' ');
          clientName = name || undefined;
        }
      } catch {}

      const blob = await RetirementHelpers.generateTaxOptimizationSummary({
        language: lang,
        clientName,
        horizonYears: horizon,
        targetNetAnnual,
        greedy: optResults ? { totalTax: Math.round(optResults.reduce((s, r) => s + (r.tax.totalTax || 0), 0)), robust: robustGreedy || undefined } : undefined,
        dp: dpResults ? { totalTax: Math.round(dpResults.reduce((s, r) => s + (r.tax.totalTax || 0), 0)), robust: robustDP || undefined, score: dpScore ?? undefined } : undefined,
        baseline: baseResults ? { totalTax: Math.round(baseResults.reduce((s, r) => s + (r.tax.totalTax || 0), 0)), robust: robustBase || undefined } : undefined
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = isFr ? 'Optimisation_fiscale_resume.pdf' : 'Tax_Optimization_Summary.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Export PDF failed:', e);
    }
  };

  const totalTax = (list: YearResult[] | null) => list ? Math.round(list.reduce((s, r) => s + (r.tax.totalTax || 0), 0)) : 0;
  const targetMetCount = (list: YearResult[] | null) => list ? list.filter(r => r.tax.netIncome >= targetNetAnnual - 50).length : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.desc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <Label>{t.inputs.startAge}</Label>
            <Input type="number" value={startAge} onChange={(e) => setStartAge(toNum(e.target.value))} min={50} max={100} />
          </div>
          <div>
            <Label>{t.inputs.horizon}</Label>
            <Input type="number" value={horizon} onChange={(e) => setHorizon(toNum(e.target.value))} min={5} max={40} />
          </div>
          <div>
            <Label>{t.inputs.targetNet}</Label>
            <Input type="number" value={targetNetAnnual} onChange={(e) => setTargetNetAnnual(toNum(e.target.value))} min={12000} step={1000} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="border">
            <CardHeader><CardTitle className="text-base">{t.inputs.balances}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t.inputs.tfsa}</Label>
                <Input type="number" value={opening.tfsa} onChange={(e) => setOpening({ ...opening, tfsa: toNum(e.target.value) })} />
              </div>
              <div>
                <Label>{t.inputs.non}</Label>
                <Input type="number" value={opening.nonRegistered} onChange={(e) => setOpening({ ...opening, nonRegistered: toNum(e.target.value) })} />
              </div>
              <div>
                <Label>{t.inputs.rrsp}</Label>
                <Input type="number" value={opening.rrsp} onChange={(e) => setOpening({ ...opening, rrsp: toNum(e.target.value) })} />
              </div>
              <div>
                <Label>{t.inputs.rrif}</Label>
                <Input type="number" value={opening.rrif} onChange={(e) => setOpening({ ...opening, rrif: toNum(e.target.value) })} />
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader><CardTitle className="text-base">CPP/OAS</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t.inputs.startCPP}</Label>
                <Input type="number" value={startCPPAt} onChange={(e) => setStartCPPAt(toNum(e.target.value))} min={60} max={70} />
              </div>
              <div>
                <Label>{t.inputs.startOAS}</Label>
                <Input type="number" value={startOASAt} onChange={(e) => setStartOASAt(toNum(e.target.value))} min={65} max={70} />
              </div>
              <div className="col-span-2 flex gap-2 pt-2">
                <Button onClick={runOptimizer}>{t.inputs.optimize}</Button>
                <Button variant="outline" onClick={runComparison}>{t.inputs.compare}</Button>
                <Button variant="secondary" onClick={runDP} disabled={dpRunning}>
                  {isFr ? 'Optimiser v2 (DP/Beam)' : 'Optimize v2 (DP/Beam)'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader><CardTitle className="text-base">{isFr ? 'Réglages avancés' : 'Advanced settings'}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div>
                <Label>Beam width</Label>
                <Input type="number" value={beamWidth} onChange={(e) => setBeamWidth(toNum(e.target.value))} min={20} max={500} />
              </div>
              <div>
                <Label>{isFr ? 'Taille du pas ($)' : 'Step size ($)'}</Label>
                <Input type="number" value={stepSize} onChange={(e) => setStepSize(toNum(e.target.value))} min={500} step={500} />
              </div>
              <div>
                <Label>{isFr ? 'Poids écart objectif' : 'Target miss weight'}</Label>
                <Input type="number" value={weightTargetMiss} onChange={(e) => setWeightTargetMiss(Number(e.target.value) || 0)} min={0} step={0.1} />
              </div>
              <div>
                <Label>{isFr ? 'Ratio gains en capital (Non-enr.)' : 'Capital gains ratio (Non-reg)'}</Label>
                <Input type="number" value={nonRegCGRatio} onChange={(e) => setNonRegCGRatio(Number(e.target.value) || 0)} min={0} max={1} step={0.05} />
              </div>
              <div className="col-span-2 flex items-end gap-2">
                <div>
                  <Label htmlFor="robust-mode-toggle">{isFr ? 'Mode robuste' : 'Robust mode'}</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="robust-mode-toggle"
                      type="checkbox"
                      checked={robustMode}
                      onChange={(e) => setRobustMode(e.target.checked)}
                      aria-label={isFr ? 'Activer le mode robuste' : 'Enable robust mode'}
                    />
                    <span className="text-xs text-gray-600">
                      {isFr ? 'Évalue des scénarios de chocs et calcule un score robuste' : 'Evaluate shock scenarios and compute a robust score'}
                    </span>
                  </div>
                </div>
                {dpRunning && (
                  <div className="text-xs text-gray-600">
                    {isFr ? 'Progression' : 'Progress'} — {isFr ? 'Année' : 'Year'} {dpProgressYear} • {isFr ? 'Score' : 'Score'} {Math.round(dpProgressBest)} • {isFr ? 'Faisceau' : 'Beam'} {dpProgressBeamCount}
                  </div>
                )}
                <Button variant="destructive" onClick={cancelDP} disabled={!dpRunning}>
                  {isFr ? 'Arrêter' : 'Stop'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Robust summary and Export (v3) */}
        {robustMode && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border">
                <CardHeader><CardTitle className="text-base">{isFr ? 'Robustesse — Greedy' : 'Robustness — Greedy'}</CardTitle></CardHeader>
                <CardContent className="text-sm">
                  {robustGreedy ? (
                    <>
                      <div>Score: <strong>{robustGreedy.robustScore}</strong></div>
                      <div className="mt-2 text-xs text-gray-700">
                        {robustGreedy.explanations.map((e: string, i: number) => <div key={i}>• {e}</div>)}
                      </div>
                    </>
                  ) : (<div className="text-gray-500">{isFr ? 'Aucune donnée' : 'No data'}</div>)}
                </CardContent>
              </Card>
              <Card className="border">
                <CardHeader><CardTitle className="text-base">DP/Beam</CardTitle></CardHeader>
                <CardContent className="text-sm">
                  {robustDP ? (
                    <>
                      <div>Score: <strong>{robustDP.robustScore}</strong></div>
                      <div className="mt-2 text-xs text-gray-700">
                        {robustDP.explanations.map((e: string, i: number) => <div key={i}>• {e}</div>)}
                      </div>
                    </>
                  ) : (<div className="text-gray-500">{isFr ? 'Aucune donnée' : 'No data'}</div>)}
                </CardContent>
              </Card>
              <Card className="border">
                <CardHeader><CardTitle className="text-base">{isFr ? 'RRSP seulement' : 'RRSP only'}</CardTitle></CardHeader>
                <CardContent className="text-sm">
                  {robustBase ? (
                    <>
                      <div>Score: <strong>{robustBase.robustScore}</strong></div>
                      <div className="mt-2 text-xs text-gray-700">
                        {robustBase.explanations.map((e: string, i: number) => <div key={i}>• {e}</div>)}
                      </div>
                    </>
                  ) : (<div className="text-gray-500">{isFr ? 'Aucune donnée' : 'No data'}</div>)}
                </CardContent>
              </Card>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExportPDF}>{isFr ? 'Exporter PDF (résumé robuste)' : 'Export PDF (robust summary)'}</Button>
            </div>
          </>
        )}

        {/* Results */}
        <Separator />
        <div>
          <div className="text-lg font-semibold mb-2">{t.results.summary}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border">
              <CardHeader><CardTitle className="text-base">{t.results.optimizer}</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <div>{t.results.totalTax}: <strong>{fmtCAD(totalTax(optResults), isFr)}</strong></div>
                <div>{t.results.metTarget}: <strong>{optResults ? `${targetMetCount(optResults)}/${optResults.length}` : '-'}</strong></div>
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader><CardTitle className="text-base">DP/Beam (v2)</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <div>{t.results.totalTax}: <strong>{fmtCAD(totalTax(dpResults), isFr)}</strong></div>
                <div>{t.results.metTarget}: <strong>{dpResults ? `${dpResults.filter(r => r.tax.netIncome >= targetNetAnnual - 50).length}/${dpResults.length}` : '-'}</strong></div>
                {dpScore != null && (
                  <div>Score: <strong>{Math.round(dpScore)}</strong></div>
                )}
                {dpRunning && <div className="text-gray-500 mt-1">{isFr ? 'Calcul en cours…' : 'Computing…'}</div>}
              </CardContent>
            </Card>
            <Card className="border">
              <CardHeader><CardTitle className="text-base">{t.results.baseline}</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <div>{t.results.totalTax}: <strong>{fmtCAD(totalTax(baseResults), isFr)}</strong></div>
                <div>{t.results.metTarget}: <strong>{baseResults ? `${targetMetCount(baseResults)}/${baseResults.length}` : '-'}</strong></div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Heatmaps */}
        {(optResults || baseResults) && (
          <>
            <Separator />
            <div className="text-lg font-semibold">{t.results.heatmaps}</div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* MTR + OAS/GIS for Optimizer */}
              <Card className="border">
                <CardHeader><CardTitle className="text-base">{t.results.optimizer}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-6 gap-2 text-xs">
                    <div className="font-semibold">{t.results.year}</div>
                    <div className="font-semibold">{t.results.age}</div>
                    <div className="font-semibold">MTR</div>
                    <div className="font-semibold">OAS</div>
                    <div className="font-semibold">GIS</div>
                    <div className="font-semibold">{t.results.tax}</div>
                  </div>
                  {optResults?.map(r => (
                    <div key={r.yearIndex} className="grid grid-cols-6 gap-2 text-xs items-center">
                      <div>{r.yearIndex + 1}</div>
                      <div>{r.age}</div>
                      <div><span className={`px-2 py-1 rounded ${heatColorMTR(r.mtrApprox || 0)}`}>{((r.mtrApprox || 0) * 100).toFixed(0)}%</span></div>
                      <div><span className={`px-2 py-1 rounded ${heatColorBinary(r.tax.oasClawback)}`}>{r.tax.oasClawback > 0 ? 'Claw' : 'OK'}</span></div>
                      <div><span className={`px-2 py-1 rounded ${r.tax.gisBenefit > 0 ? 'bg-emerald-300 text-black' : 'bg-gray-200 text-black'}`}>{r.tax.gisBenefit > 0 ? 'GIS+' : '—'}</span></div>
                      <div>{fmtCAD(r.tax.totalTax, isFr)}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              {/* MTR + OAS/GIS for DP/Beam */}
              <Card className="border">
                <CardHeader><CardTitle className="text-base">DP/Beam (v2)</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-6 gap-2 text-xs">
                    <div className="font-semibold">{t.results.year}</div>
                    <div className="font-semibold">{t.results.age}</div>
                    <div className="font-semibold">MTR</div>
                    <div className="font-semibold">OAS</div>
                    <div className="font-semibold">GIS</div>
                    <div className="font-semibold">{t.results.tax}</div>
                  </div>
                  {dpResults?.map(r => (
                    <div key={r.yearIndex} className="grid grid-cols-6 gap-2 text-xs items-center">
                      <div>{r.yearIndex + 1}</div>
                      <div>{r.age}</div>
                      <div><span className={`px-2 py-1 rounded ${heatColorMTR(r.mtrApprox || 0)}`}>{((r.mtrApprox || 0) * 100).toFixed(0)}%</span></div>
                      <div><span className={`px-2 py-1 rounded ${heatColorBinary(r.tax.oasClawback)}`}>{r.tax.oasClawback > 0 ? 'Claw' : 'OK'}</span></div>
                      <div><span className={`px-2 py-1 rounded ${r.tax.gisBenefit > 0 ? 'bg-emerald-300 text-black' : 'bg-gray-200 text-black'}`}>{r.tax.gisBenefit > 0 ? 'GIS+' : '—'}</span></div>
                      <div>{fmtCAD(r.tax.totalTax, isFr)}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              {/* MTR + OAS/GIS for Baseline */}
              <Card className="border">
                <CardHeader><CardTitle className="text-base">{t.results.baseline}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-6 gap-2 text-xs">
                    <div className="font-semibold">{t.results.year}</div>
                    <div className="font-semibold">{t.results.age}</div>
                    <div className="font-semibold">MTR</div>
                    <div className="font-semibold">OAS</div>
                    <div className="font-semibold">GIS</div>
                    <div className="font-semibold">{t.results.tax}</div>
                  </div>
                  {baseResults?.map(r => (
                    <div key={r.yearIndex} className="grid grid-cols-6 gap-2 text-xs items-center">
                      <div>{r.yearIndex + 1}</div>
                      <div>{r.age}</div>
                      <div><span className={`px-2 py-1 rounded ${heatColorMTR(r.mtrApprox || 0)}`}>{((r.mtrApprox || 0) * 100).toFixed(0)}%</span></div>
                      <div><span className={`px-2 py-1 rounded ${heatColorBinary(r.tax.oasClawback)}`}>{r.tax.oasClawback > 0 ? 'Claw' : 'OK'}</span></div>
                      <div><span className={`px-2 py-1 rounded ${r.tax.gisBenefit > 0 ? 'bg-emerald-300 text-black' : 'bg-gray-200 text-black'}`}>{r.tax.gisBenefit > 0 ? 'GIS+' : '—'}</span></div>
                      <div>{fmtCAD(r.tax.totalTax, isFr)}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Year table (optimizer) */}
        {optResults && (
          <>
            <Separator />
            <div className="text-lg font-semibold">{t.results.optimizer}</div>
            <div className="overflow-auto">
              <div className="min-w-[900px] grid grid-cols-12 gap-2 text-xs font-semibold">
                <div>{t.results.year}</div>
                <div>{t.results.age}</div>
                <div>{t.results.wTFSA}</div>
                <div>{t.results.wNon}</div>
                <div>{t.results.wRRSP}</div>
                <div>{t.results.wRRIF}</div>
                <div>CPP</div>
                <div>OAS</div>
                <div>{t.results.tax}</div>
                <div>{t.results.net}</div>
                <div>MTR</div>
                <div>OAS</div>
              </div>
              {optResults.map(r => (
                <div key={r.yearIndex} className="grid grid-cols-12 gap-2 text-xs items-center">
                  <div>{r.yearIndex + 1}</div>
                  <div>{r.age}</div>
                  <div>{fmtCAD(r.decisions.withdrawTFSA, isFr)}</div>
                  <div>{fmtCAD(r.decisions.withdrawNonReg, isFr)}</div>
                  <div>{fmtCAD(r.decisions.withdrawRRSP, isFr)}</div>
                  <div>{fmtCAD(r.decisions.withdrawRRIF, isFr)}</div>
                  <div>{fmtCAD(r.incomeBreakdown.cpp, isFr)}</div>
                  <div>{fmtCAD(r.incomeBreakdown.oas, isFr)}</div>
                  <div>{fmtCAD(r.tax.totalTax, isFr)}</div>
                  <div>{fmtCAD(r.tax.netIncome, isFr)}</div>
                  <div>{((r.mtrApprox || 0) * 100).toFixed(0)}%</div>
                  <div>{r.tax.oasClawback > 0 ? 'Claw' : '—'}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxOptimizationLab;
