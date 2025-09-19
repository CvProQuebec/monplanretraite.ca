import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
/* using plain HTML table for maximum compatibility with current UI kit */
import { CheckCircle, AlertTriangle, Target, Activity, Compass } from 'lucide-react';
import { formatCurrencyOQLF } from '@/utils/localeFormat';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { WithdrawalStrategiesService, type StrategyEvaluationResult } from '@/features/retirement/services/WithdrawalStrategiesService';
import { OptimalWithdrawalOrderService } from '@/features/retirement/services/OptimalWithdrawalOrderService';


/**
 * RetirementWithdrawalComparison
 * Comparateur de stratégies de décaissement (4%, VPW, Guardrails, Bucket)
 * + CTA "Suggérer et Appliquer l'ordre fiscal optimal"
 */
export const RetirementWithdrawalComparison: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useRetirementData();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<StrategyEvaluationResult[] | null>(null);
  const [suggestedOrder, setSuggestedOrder] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await WithdrawalStrategiesService.evaluateAll({ userData });
      setResults(res);
    } catch (e: any) {
      console.error(e);
      setError('Impossible de calculer les stratégies. Réessayez plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bestMonthly = useMemo(() => {
    if (!results || results.length === 0) return 0;
    return Math.max(...results.map(r => r.sustainableSpendingMonthly));
  }, [results]);

  const handleSuggestOrder = () => {
    try {
      const order = OptimalWithdrawalOrderService.suggest(userData, undefined);
      setSuggestedOrder(order);
    } catch (e: any) {
      console.error(e);
      setSuggestedOrder(null);
      setError('Impossible de suggérer un ordre fiscal optimal.');
    }
  };

  const handleApplyOrder = () => {
    if (!suggestedOrder || suggestedOrder.length === 0) return;
    const csv = suggestedOrder.join(',');
    navigate(`/withdrawals/apply?order=${encodeURIComponent(csv)}&redirect=/optimisation-fiscale&scenarioId=default`);
  };

  const renderTable = () => {
    if (!results) return null;

    // Fallback simple table if UI table component not available
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left p-3">Stratégie</th>
              <th className="text-left p-3">Montant mensuel soutenable</th>
              <th className="text-left p-3">Montant annuel</th>
              <th className="text-left p-3">Risque (0-100)</th>
              <th className="text-left p-3">Hypothèses</th>
              <th className="text-left p-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const highlight = r.sustainableSpendingMonthly === bestMonthly;
              return (
                <tr key={r.strategy} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-medium">
                    {mapStrategyLabel(r.strategy)}
                    {highlight && (
                      <Badge className="ml-2 bg-green-100 text-green-800 border border-green-200">Plus élevé</Badge>
                    )}
                  </td>
                  <td className="p-3 font-semibold text-blue-700">
                    {formatCurrencyOQLF(r.sustainableSpendingMonthly)}
                  </td>
                  <td className="p-3">{formatCurrencyOQLF(r.sustainableSpendingAnnual)}</td>
                  <td className="p-3">
                    <RiskBadge score={r.riskScore} />
                  </td>
                  <td className="p-3">
                    <ul className="list-disc ml-4 space-y-1">
                      {r.assumptions.slice(0, 2).map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </td>
                  <td className="p-3">
                    <ul className="list-disc ml-4 space-y-1">
                      {r.notes.slice(0, 2).map((n, i) => <li key={i}>{n}</li>)}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-10 space-y-8">
        <Card className="border-2 border-blue-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Activity className="w-5 h-5" /> Comparateur de stratégies de retrait
            </CardTitle>
            <CardDescription>
              Évaluez plusieurs approches (4%, VPW, Guardrails, Bucket) et appliquez un ordre de retraits fiscal optimal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50 text-red-800">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {loading && <div className="text-gray-700">Calcul en cours…</div>}
            {!loading && renderTable()}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-4">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Conseils: commencez avec une stratégie simple (ex.: 4% ou Bucket), et évoluez vers VPW/Guardrails avec suivi annuel.
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={load}>
                  Recalculer
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleSuggestOrder}>
                  <Compass className="w-4 h-4 mr-2" />
                  Suggérer ordre fiscal optimal
                </Button>
              </div>
            </div>

            {suggestedOrder && (
              <div className="mt-4 border rounded-md p-3 bg-amber-50 border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-amber-700" />
                  <span className="font-semibold text-amber-800">Ordre recommandé:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedOrder.map((s, i) => (
                    <Badge key={`${s}-${i}`} variant="outline" className="border-amber-300 text-amber-800 bg-amber-100">
                      {mapSourceLabel(s)}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3">
                  <Button onClick={handleApplyOrder} className="bg-amber-600 hover:bg-amber-700">
                    Appliquer ordre fiscal optimal
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            <strong>Note:</strong> Ces résultats sont à visée éducative. Vérifiez les paramètres (revenus garantis, dépenses, capital) et
            réévaluez périodiquement. L’ordre fiscal optimal dépend de votre situation (âge, seuils SV, obligations FERR).
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

function RiskBadge({ score }: { score: number }) {
  const color =
    score >= 60 ? 'bg-red-100 text-red-800 border-red-200' :
    score >= 45 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
    'bg-green-100 text-green-800 border-green-200';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs ${color}`}>{score}/100</span>;
}

function mapStrategyLabel(key: string): string {
  switch (key) {
    case 'FourPercent': return 'Règle 4%';
    case 'VPW': return 'VPW (pourcentage variable)';
    case 'Guardrails': return 'Guardrails (rails de sécurité)';
    case 'Bucket': return 'Bucket (coussin de liquidités)';
    default: return key;
  }
}

function mapSourceLabel(src: string): string {
  switch (src) {
    case 'CELI': return 'CELI';
    case 'PLACEMENTS_NON_ENREGISTRES': return 'Non-enregistré';
    case 'REER_MINIMAL': return 'REER minimal';
    case 'REER_OPTIMISE': return 'REER optimisé';
    case 'FERR': return 'FERR';
    case 'CELI_COMPLEMENT': return 'CELI (complément)';
    default: return src;
  }
}

export default RetirementWithdrawalComparison;
