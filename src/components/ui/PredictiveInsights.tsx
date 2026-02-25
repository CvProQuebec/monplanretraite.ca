import React, { useMemo, useState, useEffect } from 'react';
import { useLanguage } from '@/features/retirement/hooks/useLanguage';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import PredictiveAnalyticsService, { type PredictiveReport, type PredictiveRiskLevel } from '@/services/PredictiveAnalyticsService';
import { recommendedEquityBand } from '@/services/PortfolioOptimizationService';

function toNum(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

const fmtCAD = (v: number, locale: 'fr-CA' | 'en-CA') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v);

const pct = (x: number) => `${(x * 100).toFixed(1)} %`;

const riskColor = (level: PredictiveRiskLevel) => {
  switch (level) {
    case 'low': return { badge: 'bg-emerald-600', title: 'text-emerald-800', text: 'text-emerald-900', card: 'border-emerald-300 bg-emerald-50' };
    case 'medium': return { badge: 'bg-amber-600', title: 'text-amber-800', text: 'text-amber-900', card: 'border-amber-300 bg-amber-50' };
    case 'high': return { badge: 'bg-red-600', title: 'text-red-800', text: 'text-red-900', card: 'border-red-300 bg-red-50' };
  }
};

export const PredictiveInsights: React.FC = () => {
  const { language } = useLanguage();
  const isFrench = language === 'fr';
  const locale = isFrench ? 'fr-CA' as const : 'en-CA' as const;

  const t = {
    title: isFrench ? 'Analyses prédictives (IA locale)' : 'Predictive Analytics (local AI)',
    description: isFrench
      ? 'Score de succès, risques et prévision 12 mois basés sur votre taux d’épargne, coussin, allocation et volatilité des dépenses.'
      : 'Success score, risks and 12-month forecast based on savings rate, cash cushion, allocation and expense volatility.',
    inputs: {
      age: isFrench ? 'Âge' : 'Age',
      netMonthly: isFrench ? 'Revenu net mensuel (CAD)' : 'Net monthly income (CAD)',
      portfolio: isFrench ? 'Valeur du portefeuille (CAD)' : 'Portfolio value (CAD)',
      eqPct: isFrench ? 'Actions actuelles (%)' : 'Current equities (%)',
      essentials: isFrench ? 'Dépenses essentielles (CAD/mois)' : 'Essential expenses (CAD/mo)',
      logement: isFrench ? 'Logement' : 'Housing',
      services: isFrench ? 'Services publics' : 'Utilities',
      assurances: isFrench ? 'Assurances' : 'Insurance',
      alimentation: isFrench ? 'Alimentation' : 'Food',
      transport: isFrench ? 'Transport' : 'Transport',
      sante: isFrench ? 'Santé' : 'Health',
      discretionary: isFrench ? 'Dépenses discrétionnaires (CAD/mois)' : 'Discretionary (CAD/mo)',
      telecom: isFrench ? 'Télécom' : 'Telecom',
      loisirs: isFrench ? 'Loisirs' : 'Leisure',
      seasonal: isFrench ? 'Dépenses saisonnières (CAD/mois moy.)' : 'Seasonal expenses (avg CAD/mo)'
    },
    results: {
      overall: isFrench ? 'Probabilité de succès' : 'Success probability',
      summary: isFrench ? 'Résumé' : 'Summary',
      recs: isFrench ? 'Recommandations' : 'Recommendations',
      forecast: isFrench ? 'Prévision du flux de trésorerie (12 mois)' : 'Cash flow forecast (12 months)',
      savingsRate: isFrench ? "Taux d'épargne" : 'Savings rate',
      cashCushion: isFrench ? 'Coussin (mois)' : 'Cushion (months)',
      monthlyCf: isFrench ? 'Flux mensuel' : 'Monthly cashflow',
      eqMisalign: isFrench ? "Écart d'actions vs cible" : 'Equity misalignment',
      expVol: isFrench ? 'Volatilité dépenses (proxy)' : 'Expense volatility (proxy)'
    }
  };

  // Manual inputs (with sensible defaults)
  const [age, setAge] = useState<number>(70);
  const [netMonthly, setNetMonthly] = useState<number>(3000);
  const [portfolio, setPortfolio] = useState<number>(500_000);
  const [eqPct, setEqPct] = useState<number>(65);

  // Essential expense breakdown
  const [logement, setLogement] = useState<number>(1200);
  const [services, setServices] = useState<number>(200);
  const [assurances, setAssurances] = useState<number>(150);
  const [alimentation, setAlimentation] = useState<number>(600);
  const [transport, setTransport] = useState<number>(400);
  const [sante, setSante] = useState<number>(200);

  // Discretionary and seasonal
  const [telecom, setTelecom] = useState<number>(100);
  const [loisirs, setLoisirs] = useState<number>(300);
  const [seasonal, setSeasonal] = useState<number>(200);

  // Auto-charger les valeurs depuis les données réelles de l'utilisateur (localStorage: 'retirement_data')
  useEffect(() => {
    try {
      const raw = localStorage.getItem('retirement_data');
      if (!raw) return;
      const data = JSON.parse(raw);

      // Âge (naissance1 -> année)
      const birthISO = data?.personal?.naissance1;
      if (birthISO) {
        const d = new Date(birthISO);
        if (!Number.isNaN(d.getTime())) {
          const derivedAge = new Date().getFullYear() - d.getFullYear();
          if (derivedAge > 0 && derivedAge < 110) setAge(derivedAge);
          // Ajuster eqPct par défaut vers la cible recommandée (si l'utilisateur n'a jamais saisi)
          const band = recommendedEquityBand(derivedAge);
          const mid = ((band.min + band.max) / 2) * 100;
          setEqPct(Math.round(mid));
        }
      }

      // Revenu net mensuel (préférer personal.netMensuel sinon (salaire1+salaire2)/12)
      const p = data?.personal || {};
      const netMensuel = Number(p.netMensuel);
      if (Number.isFinite(netMensuel) && netMensuel > 0) {
        setNetMonthly(netMensuel);
      } else {
        const s1 = Number(p.salaire1) || 0;
        const s2 = Number(p.salaire2) || 0;
        const computed = (s1 + s2) / 12;
        if (computed > 0) setNetMonthly(computed);
      }

      // Valeur de portefeuille (somme des principaux comptes)
      const s = data?.savings || {};
      const portfolioSum =
        (Number(s.reer1) || 0) + (Number(s.reer2) || 0) +
        (Number(s.celi1) || 0) + (Number(s.celi2) || 0) +
        (Number(s.placements1) || 0) + (Number(s.placements2) || 0) +
        (Number(s.epargne1) || 0) + (Number(s.epargne2) || 0) +
        (Number(s.cri1) || 0) + (Number(s.cri2) || 0);
      if (portfolioSum > 0) setPortfolio(portfolioSum);

      // Dépenses (cashflow)
      const cf = data?.cashflow || {};
      if (cf) {
        if (Number.isFinite(Number(cf.logement))) setLogement(Number(cf.logement));
        if (Number.isFinite(Number(cf.servicesPublics))) setServices(Number(cf.servicesPublics));
        if (Number.isFinite(Number(cf.assurances))) setAssurances(Number(cf.assurances));
        if (Number.isFinite(Number(cf.telecom))) setTelecom(Number(cf.telecom));
        if (Number.isFinite(Number(cf.alimentation))) setAlimentation(Number(cf.alimentation));
        if (Number.isFinite(Number(cf.transport))) setTransport(Number(cf.transport));
        if (Number.isFinite(Number(cf.sante))) setSante(Number(cf.sante));
        if (Number.isFinite(Number(cf.loisirs))) setLoisirs(Number(cf.loisirs));
        if (Number.isFinite(Number(cf.depensesSaisonnieres))) setSeasonal(Number(cf.depensesSaisonnieres));
      }
    } catch (e) {
      console.warn('Chargement des données utilisateur (predictive) a échoué:', e);
    }
  }, []);

  const userData = useMemo(() => {
    // Generate a minimal UserData shape for the service
    const birthYear = new Date().getFullYear() - Math.round(age);
    return {
      personal: {
        naissance1: `${birthYear}-01-01`,
        netMensuel: netMonthly
      },
      savings: {
        placements1: portfolio
      },
      cashflow: {
        logement, servicesPublics: services, assurances, telecom,
        alimentation, transport, sante, loisirs, depensesSaisonnieres: seasonal
      }
    } as any;
  }, [age, netMonthly, portfolio, logement, services, assurances, telecom, alimentation, transport, sante, loisirs, seasonal]);

  const report: PredictiveReport = useMemo(() => {
    try {
      return PredictiveAnalyticsService.analyze(userData, { currentEquityAllocation: Math.max(0, Math.min(1, eqPct / 100)) });
    } catch (e) {
      console.warn('Predictive analyze failed:', e);
      // Fallback empty
      return {
        summary: {
          savingsRate: 0, monthlyCashflow: 0, cashCushionMonths: 0, equityMisalignment: 0, expenseVolatilityProxy: 0
        },
        successProbability: 0,
        riskLevel: 'high',
        recommendations: ['Veuillez compléter les champs pour générer des analyses.'],
        forecast12m: []
      };
    }
  }, [userData, eqPct]);

  const colors = riskColor(report.riskLevel);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <Label>{t.inputs.age}</Label>
            <Input type="number" value={age} onChange={(e) => setAge(toNum(e.target.value))} min={50} max={99} />
          </div>
          <div>
            <Label>{t.inputs.netMonthly}</Label>
            <Input type="number" value={netMonthly} onChange={(e) => setNetMonthly(toNum(e.target.value))} min={0} step={50} />
          </div>
          <div>
            <Label>{t.inputs.portfolio}</Label>
            <Input type="number" value={portfolio} onChange={(e) => setPortfolio(toNum(e.target.value))} min={0} step={1000} />
          </div>
          <div>
            <Label>{t.inputs.eqPct}</Label>
            <Input type="number" value={eqPct} onChange={(e) => setEqPct(toNum(e.target.value))} min={0} max={100} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="border">
            <CardHeader><CardTitle className="text-base">{t.inputs.essentials}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><Label>{t.inputs.logement}</Label><Input type="number" value={logement} onChange={(e) => setLogement(toNum(e.target.value))} /></div>
              <div><Label>{t.inputs.services}</Label><Input type="number" value={services} onChange={(e) => setServices(toNum(e.target.value))} /></div>
              <div><Label>{t.inputs.assurances}</Label><Input type="number" value={assurances} onChange={(e) => setAssurances(toNum(e.target.value))} /></div>
              <div><Label>{t.inputs.alimentation}</Label><Input type="number" value={alimentation} onChange={(e) => setAlimentation(toNum(e.target.value))} /></div>
              <div><Label>{t.inputs.transport}</Label><Input type="number" value={transport} onChange={(e) => setTransport(toNum(e.target.value))} /></div>
              <div><Label>{t.inputs.sante}</Label><Input type="number" value={sante} onChange={(e) => setSante(toNum(e.target.value))} /></div>
            </CardContent>
          </Card>
          <Card className="border">
            <CardHeader><CardTitle className="text-base">{t.inputs.discretionary}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label>{t.inputs.telecom}</Label><Input type="number" value={telecom} onChange={(e) => setTelecom(toNum(e.target.value))} /></div>
              <div><Label>{t.inputs.loisirs}</Label><Input type="number" value={loisirs} onChange={(e) => setLoisirs(toNum(e.target.value))} /></div>
              <div className="md:col-span-2"><Label>{t.inputs.seasonal}</Label><Input type="number" value={seasonal} onChange={(e) => setSeasonal(toNum(e.target.value))} /></div>
            </CardContent>
          </Card>
          <Card className={`border ${colors.card}`}>
            <CardHeader>
              <CardTitle className="text-base">{t.results.overall}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded ${colors.badge} text-white`}>
                  {Math.round((report.successProbability || 0) * 100)}%
                </span>
                <div className={`font-semibold ${colors.title}`}>{report.riskLevel.toUpperCase()}</div>
              </div>
              <div className={`${colors.text} mt-2`}>
                {isFrench
                  ? 'Probabilité que votre plan se maintienne selon vos paramètres actuels.'
                  : 'Probability that your plan holds given current parameters.'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border">
            <CardHeader><CardTitle className="text-base">{t.results.savingsRate}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold text-mpr-navy">{pct(report.summary.savingsRate)}</CardContent>
          </Card>
          <Card className="border">
            <CardHeader><CardTitle className="text-base">{t.results.cashCushion}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold text-mpr-navy">{report.summary.cashCushionMonths}</CardContent>
          </Card>
          <Card className="border">
            <CardHeader><CardTitle className="text-base">{t.results.monthlyCf}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold text-emerald-700">{fmtCAD(report.summary.monthlyCashflow, locale)}</CardContent>
          </Card>
          <Card className="border">
            <CardHeader><CardTitle className="text-base">{t.results.eqMisalign}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold text-orange-700">{pct(report.summary.equityMisalignment)}</CardContent>
          </Card>
          <Card className="border">
            <CardHeader><CardTitle className="text-base">{t.results.expVol}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold text-red-700">{pct(report.summary.expenseVolatilityProxy)}</CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="border">
          <CardHeader><CardTitle className="text-base">{t.results.recs}</CardTitle></CardHeader>
          <CardContent className="text-sm text-gray-800 space-y-1">
            {report.recommendations.length === 0
              ? (<div>{isFrench ? 'Aucune recommandation spécifique.' : 'No specific recommendations.'}</div>)
              : report.recommendations.map((r, i) => (<div key={i}>• {r}</div>))}
          </CardContent>
        </Card>

        {/* Forecast */}
        <Card className="border">
          <CardHeader><CardTitle className="text-base">{t.results.forecast}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              {report.forecast12m.map(p => (
                <div key={p.monthIndex} className="p-3 rounded-lg border">
                  <div className="font-semibold">{isFrench ? `Mois ${p.monthIndex}` : `Month ${p.monthIndex}`}</div>
                  <div className="text-gray-700">
                    {isFrench ? 'Attendu' : 'Expected'}: {fmtCAD(p.expected, locale)}
                  </div>
                  <div className="text-gray-500">
                    {isFrench ? 'Intervalle' : 'Range'}: {fmtCAD(p.lower, locale)} — {fmtCAD(p.upper, locale)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PredictiveInsights;
