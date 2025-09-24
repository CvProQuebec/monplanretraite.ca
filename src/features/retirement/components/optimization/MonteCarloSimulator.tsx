// src/features/retirement/components/MonteCarloSimulator.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart3,
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
  Shield
} from 'lucide-react';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { CalculationService } from '@/features/retirement/services/CalculationService';
import type { MonteCarloResult } from '@/features/retirement/services/AdvancedMonteCarloService';
import { formatCurrencyOQLF, formatPercentOQLF } from '@/utils/localeFormat';
import { useNavigate } from 'react-router-dom';

export function MonteCarloSimulator() {
  const { userData } = useRetirementData();
  const navigate = useNavigate();

  // Paramètres pédagogiques (n’influencent pas encore le moteur)
  const [uiParams, setUiParams] = useState({
    tauxRetrait: 4.0,        // %
    allocationActions: 60,   // %
    coussinMois: 36,         // 3 ans
    horizon: 30              // ans
  });

  const [rebalancing, setRebalancing] = useState(true);
  const [results, setResults] = useState<MonteCarloResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [scenarioNote, setScenarioNote] = useState<string | null>(null);
  const [calc, setCalc] = useState<any | null>(null);

  const runAdvancedSimulation = async () => {
    setIsSimulating(true);
    setScenarioNote(null);
    try {
      // Appel au service avancé (inclut déjà AdvancedMonteCarloService)
      const calculations = await CalculationService.calculateAllAdvanced(userData, { yearlyRebalancing: rebalancing });
      setResults(calculations.monteCarloResults ?? null);
      setCalc(calculations);
    } catch (error) {
      console.error('Erreur simulation Monte Carlo:', error);
      setResults(null);
    } finally {
      setIsSimulating(false);
    }
  };

  const applyHistoricalPreset = (preset: '1973' | '2000' | '2008') => {
    // Boutons “séquences historiques” pédagogiques (réglages UI + note).
    if (preset === '1973') {
      setUiParams(prev => ({ ...prev, allocationActions: Math.max(40, prev.allocationActions), coussinMois: Math.max(48, prev.coussinMois) }));
      setScenarioNote('Choc pétrolier 1973–74 : privilégier un coussin de 4 ans et une allocation actions disciplinée.');
    } else if (preset === '2000') {
      setUiParams(prev => ({ ...prev, allocationActions: prev.allocationActions, coussinMois: Math.max(36, prev.coussinMois) }));
      setScenarioNote('Éclatement bulle techno 2000–02 : coussin de 3 ans et rééquilibrage régulier.');
    } else {
      setUiParams(prev => ({ ...prev, allocationActions: Math.max(55, prev.allocationActions), coussinMois: Math.max(36, prev.coussinMois) }));
      setScenarioNote('Crise financière 2008–09 : maintenir la croissance à long terme et éviter de vendre en baisse grâce au coussin.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BarChart3 className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Simulateur Monte Carlo (Stress test retraite)
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Mettez votre plan à l’épreuve de milliers de scénarios. Le test de stress est un outil
            pédagogique : il n’est pas une prédiction, mais il vous aide à décider quoi faire —
            coussin de liquidités, taux de retrait, répartition d’actifs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Paramètres (pédagogie + seniors-first) */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-800">
                <Calculator className="w-6 h-6" />
                Paramètres pédagogiques
              </CardTitle>
              <CardDescription>
                Ces réglages aident à comprendre vos leviers ; le moteur avancé utilise vos données (RRQ, SV, épargne, dépenses).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tauxRetrait">Taux de retrait (%)</Label>
                  <Input
                    id="tauxRetrait"
                    type="number"
                    step="0.1"
                    value={uiParams.tauxRetrait}
                    onChange={(e) => setUiParams(prev => ({ ...prev, tauxRetrait: Number(e.target.value) }))}
                    placeholder="4,0"
                  />
                </div>

                <div>
                  <Label htmlFor="allocationActions">Allocation actions (%)</Label>
                  <Input
                    id="allocationActions"
                    type="number"
                    step="1"
                    value={uiParams.allocationActions}
                    onChange={(e) => setUiParams(prev => ({ ...prev, allocationActions: Number(e.target.value) }))}
                    placeholder="60"
                  />
                </div>

                <div>
                  <Label htmlFor="coussinMois">Coussin de liquidités (mois)</Label>
                  <Input
                    id="coussinMois"
                    type="number"
                    step="1"
                    value={uiParams.coussinMois}
                    onChange={(e) => setUiParams(prev => ({ ...prev, coussinMois: Number(e.target.value) }))}
                    placeholder="36"
                  />
                </div>

                <div>
                  <Label htmlFor="horizon">Horizon (années)</Label>
                  <Input
                    id="horizon"
                    type="number"
                    step="1"
                    value={uiParams.horizon}
                    onChange={(e) => setUiParams(prev => ({ ...prev, horizon: Number(e.target.value) }))}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  onClick={() => applyHistoricalPreset('1973')}
                  variant="outline"
                  className="border-purple-300"
                >
                  1973–74 (choc pétrolier)
                </Button>
                <Button
                  onClick={() => applyHistoricalPreset('2000')}
                  variant="outline"
                  className="border-purple-300"
                >
                  2000–02 (bulle techno)
                </Button>
                <Button
                  onClick={() => applyHistoricalPreset('2008')}
                  variant="outline"
                  className="border-purple-300"
                >
                  2008–09 (crise financière)
                </Button>
              </div>

              {/* Toggle rééquilibrage annuel */}
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="toggle-rebalancing"
                  type="checkbox"
                  checked={rebalancing}
                  onChange={(e) => setRebalancing(e.target.checked)}
                  className="w-5 h-5"
                  aria-label="Activer le rééquilibrage annuel (Monte Carlo)"
                  title="Activer le rééquilibrage annuel (Monte Carlo)"
                />
                <Label htmlFor="toggle-rebalancing" className="text-base">
                  Activer le rééquilibrage annuel (Monte Carlo)
                </Label>
              </div>

              {scenarioNote && (
                <Alert className="mt-3 border-blue-200 bg-blue-50">
                  <Info className="h-5 w-5 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    {scenarioNote}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={runAdvancedSimulation}
                disabled={isSimulating}
                className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
              >
                {isSimulating ? 'Simulation en cours…' : 'Lancer le stress test (Monte Carlo)'}
              </Button>

              <Alert className="mt-4 border-amber-200 bg-amber-50">
                <Target className="h-5 w-5 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Astuce: un coussin de liquidités de 3 à 5 ans permet de ne pas vendre en baisse
                  et de préserver votre style de vie pendant les “go-go years”.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Résultats */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Statistiques principales */}
                <Card className="bg-green-50 border-2 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-green-800">
                      <CheckCircle className="w-6 h-6" />
                      Résultats de la simulation
                    </CardTitle>
                    <CardDescription>
                      Probabilité de succès et fourchettes de résultats (0 garantie — outil éducatif)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Probabilité de succès</div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatPercentOQLF((results.statistics.successRate || 0) * 100, { min: 1, max: 1 })}
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Coussin couvert</div>
                        <div className="text-2xl font-bold text-amber-700">
                          {(uiParams.coussinMois / 12).toFixed(1)} an{uiParams.coussinMois / 12 >= 2 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Valeur médiane fin d’horizon</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrencyOQLF(results.statistics.medianFinalValue || 0)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Écart-type des résultats</div>
                        <div className="text-2xl font-bold text-gray-800">
                          {formatCurrencyOQLF(results.statistics.standardDeviation || 0)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-gray-700">Pire cas (5e pct) :</div>
                        <div className="text-red-600">{formatCurrencyOQLF(results.statistics.worstCase5th || 0)}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-700">Meilleur cas (95e pct) :</div>
                        <div className="text-emerald-600">{formatCurrencyOQLF(results.statistics.bestCase95th || 0)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Scénarios typiques */}
                {calc?.oasGisProjection && (
                  <Card className="bg-amber-50 border-2 border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-amber-800">
                        <Shield className="w-6 h-6" />
                        Sécurité de la vieillesse (SV) — intégration 2025
                      </CardTitle>
                      <CardDescription>
                        Montants SV nets et récupération (clawback) estimée, utilisés dans le revenu garanti des simulations.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-amber-700">SV mensuelle du ménage</div>
                        <div className="text-2xl font-bold text-amber-900">
                          {formatCurrencyOQLF(calc?.oasGisProjection?.householdTotal?.monthlyOAS || 0)}
                        </div>
                        <div className="text-xs text-amber-700 mt-1">
                          {formatCurrencyOQLF((calc?.oasGisProjection?.householdTotal?.monthlyOAS || 0) * 12)} / an
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-amber-700">Récupération (clawback) mensuelle estimée</div>
                        <div className="text-2xl font-bold text-amber-900">
                          {formatCurrencyOQLF(
                            (calc?.oasGisProjection?.person1?.securiteVieillesse?.recuperationPartielle || 0) +
                            (calc?.oasGisProjection?.person2?.securiteVieillesse?.recuperationPartielle || 0)
                          )}
                        </div>
                        <div className="text-xs text-amber-700 mt-1">
                          {formatCurrencyOQLF(
                            ((calc?.oasGisProjection?.person1?.securiteVieillesse?.recuperationPartielle || 0) +
                              (calc?.oasGisProjection?.person2?.securiteVieillesse?.recuperationPartielle || 0)) * 12
                          )} / an
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <Button
                          onClick={() => navigate('/analyse-oas-gis')}
                          className="bg-amber-600 hover:bg-amber-700 w-full md:w-auto"
                        >
                          Analyser OAS/SRG
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-purple-800">
                      <TrendingUp className="w-6 h-6" />
                      Scénarios représentatifs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { key: 'conservative', label: 'Conservateur (25e pct)', color: 'text-orange-700' },
                        { key: 'moderate', label: 'Médian (50e pct)', color: 'text-blue-700' },
                        { key: 'optimistic', label: 'Optimiste (75e pct)', color: 'text-emerald-700' },
                        { key: 'stressTest', label: 'Stress test (5e pct)', color: 'text-red-700' }
                      ].map((s) => {
                        const data: any = (results as any).scenarios?.[s.key];
                        if (!data) return null;
                        return (
                          <div key={s.key} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className={`font-semibold ${s.color}`}>{s.label}</h4>
                              <Badge variant="outline">{data.depletionAge ? `Épuisement à ${data.depletionAge} ans` : 'Capital non épuisé'}</Badge>
                            </div>
                            <div className="text-lg font-bold text-gray-800">
                              Valeur finale: {formatCurrencyOQLF(data.finalValue || 0)}
                            </div>
                            <div className="text-xs text-gray-600">
                              Max drawdown: {formatPercentOQLF((data.maxDrawdown || 0) * 100, { min: 1, max: 1 })} — Rendement moyen: {formatPercentOQLF((data.averageAnnualReturn || 0) * 100, { min: 1, max: 1 })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommandations concrètes (leviers contrôlables) */}
                <Card className="bg-sky-50 border-2 border-sky-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-sky-800">
                      <CheckCircle className="w-6 h-6" />
                      Recommandations actionnables
                    </CardTitle>
                    <CardDescription>Des gestes simples que vous contrôlez dès maintenant</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Constituer/maintenir un coussin de liquidités de {Math.max(36, uiParams.coussinMois)} mois (3–5 ans recommandés).</li>
                      <li>Réduire temporairement le taux de retrait à {formatPercentOQLF(Math.max(uiParams.tauxRetrait - 0.3, 2.5), { min: 1, max: 1 })} si les marchés chutent fortement.</li>
                      <li>Rééquilibrer annuellement votre portefeuille; privilégier des fonds à faible coût.</li>
                      <li>Viser {formatPercentOQLF(uiParams.allocationActions, { min: 0, max: 0 })} d’actions si votre tolérance le permet, pour contrer l’inflation à long terme.</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Avertissement pédagogique */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-5 w-5 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Information éducative seulement :</strong> ce test ne prédit pas l’avenir. Il vous aide à décider des actions concrètes — coussin de 3–5 ans, taux de retrait flexible, allocation appropriée et rééquilibrage.
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-800">
                    <AlertTriangle className="w-6 h-6 text-gray-700" />
                    En attente de simulation
                  </CardTitle>
                  <CardDescription>Lancez le stress test pour voir vos résultats.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Vous verrez ici la probabilité de succès, la médiane, les fourchettes pessimiste/optimiste
                    et des recommandations simples et concrètes adaptées aux seniors.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
