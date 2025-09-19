import React, { useEffect, useMemo, useState } from 'react';
import { ScenarioService, type Scenario } from '@/features/retirement/services/ScenarioService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PDFExportService } from '@/services/PDFExportService';
import { GitBranch, Download, BarChart3, CheckCircle, AlertTriangle } from 'lucide-react';

type MetricType = 'currency' | 'percentage' | 'years' | 'number';

const ScenarioComparisonPage: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    try {
      const list = ScenarioService.getAllScenarios();
      setScenarios(list);
      // Pré-sélectionner base + 2 premiers si disponibles
      const defaults: Record<string, boolean> = {};
      list.forEach((s, idx) => {
        defaults[s.id] = s.isBase ? true : idx < 3;
      });
      setSelected(defaults);
    } catch (e: any) {
      console.error(e);
      setError('Impossible de charger les scénarios.');
    }
  }, []);

  const selectedIds = useMemo(() => Object.keys(selected).filter(id => selected[id]), [selected]);
  const canCompare = selectedIds.length >= 2;

  const toggle = (id: string) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAll = () => {
    const all: Record<string, boolean> = {};
    scenarios.forEach(s => { all[s.id] = true; });
    setSelected(all);
  };

  const clearAll = () => {
    const none: Record<string, boolean> = {};
    scenarios.forEach(s => { none[s.id] = false; });
    setSelected(none);
  };

  // Métriques de synthèse locale pour l'aperçu
  const previewMetrics = useMemo(() => {
    try {
      if (selectedIds.length < 2) return null;
      const cmp = ScenarioService.compareScenarios(selectedIds);
      return cmp.metrics.slice(0, 4); // 4 premières métriques
    } catch (e) {
      return null;
    }
  }, [selectedIds, scenarios]);

  const handleExportPDF = async () => {
    if (!canCompare) {
      setError('Sélectionnez au moins 2 scénarios.');
      return;
    }
    setError(null);
    setExporting(true);
    try {
      const cmp = ScenarioService.compareScenarios(selectedIds);

      // Adapter aux types attendus par PDFExportService.generateScenarioComparisonReport
      const payload = {
        scenarios: cmp.scenarios.map(s => ({
          id: s.id,
          name: s.name,
          description: s.description,
          icon: s.icon,
          color: s.color
        })),
        metrics: cmp.metrics.map(m => ({
          label: m.label,
          type: m.type as MetricType,
          values: m.values
        })),
        recommendations: cmp.recommendations
      };

      const blob = await PDFExportService.generateScenarioComparisonReport('fr', payload, {
        reportTitle: 'Comparaison de Scénarios',
        authorName: 'MonPlanRetraite.ca'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Nom de fichier: scenarios-YYYYMMDD.pdf
      const now = new Date();
      const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      a.download = `comparaison-scenarios-${stamp}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      console.error(e);
      setError('Échec export PDF.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-10 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Comparateur de scénarios</h1>
            <p className="text-slate-700">
              Sélectionnez deux scénarios ou plus, visualisez les métriques clés et exportez un rapport PDF (lettre US) avec logo en bas de page.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={selectAll} title="Tout sélectionner">Tout sélectionner</Button>
            <Button variant="ghost" onClick={clearAll} title="Tout désélectionner">Tout désélectionner</Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={!canCompare || exporting}
              onClick={handleExportPDF}
              title="Exporter PDF"
            >
              <Download className="w-4 h-4 mr-2" />
              {exporting ? 'Export…' : 'Exporter PDF'}
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50 text-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-800">
              <GitBranch className="w-5 h-5" />
              Mes scénarios
            </CardTitle>
            <CardDescription>Sélectionnez au moins deux scénarios à comparer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {scenarios.map((s) => (
                <label key={s.id} className={`flex items-start gap-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 ${selected[s.id] ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-200'}`}>
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={!!selected[s.id]}
                    onChange={() => toggle(s.id)}
                    aria-label={`Sélectionner le scénario ${s.name}`}
                    title={`Sélectionner ${s.name}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{s.icon}</span>
                      <div className="font-medium text-slate-800">{s.name}</div>
                      {s.isBase && (
                        <Badge variant="outline" className="border-green-300 text-green-800 bg-green-50">Base</Badge>
                      )}
                    </div>
                    {s.description && (
                      <div className="text-xs text-slate-600 mt-1">{s.description}</div>
                    )}
                    <div className="text-xs text-slate-500 mt-1">
                      Créé le {new Date(s.createdAt).toLocaleDateString('fr-CA')}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Aperçu métriques clés */}
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-800">
              <BarChart3 className="w-5 h-5" />
              Aperçu des métriques
            </CardTitle>
            <CardDescription>
              Un aperçu rapide des 4 premières métriques comparatives. Utilisez "Exporter PDF" pour le rapport complet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!previewMetrics || previewMetrics.length === 0 ? (
              <div className="text-slate-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Sélectionnez au moins 2 scénarios pour voir l’aperçu.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left p-3">Métrique</th>
                      {scenarios.filter(s => selected[s.id]).map(s => (
                        <th key={s.id} className="text-left p-3">{s.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewMetrics.map((m) => (
                      <tr key={m.key} className="border-b">
                        <td className="p-3 font-medium">{m.label}</td>
                        {scenarios.filter(s => selected[s.id]).map(s => {
                          const v = m.values.find(x => x.scenarioId === s.id)?.value ?? 0;
                          const display = formatMetricValue(v, m.type as MetricType);
                          const isBest = m.bestScenarioId === s.id;
                          return (
                            <td key={s.id} className="p-3">
                              <div className="inline-flex items-center gap-2">
                                <span className="font-semibold">{display}</span>
                                {isBest && (
                                  <Badge variant="outline" className="border-green-300 text-green-800 bg-green-50">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Meilleur
                                  </Badge>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function formatMetricValue(val: number, type: MetricType): string {
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);
    case 'percentage':
      return `${val.toFixed(1)}%`;
    case 'years':
      return `${val}`;
    default:
      return `${val}`;
  }
}

export default ScenarioComparisonPage;
