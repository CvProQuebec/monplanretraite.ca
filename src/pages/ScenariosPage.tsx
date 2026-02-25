import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRetirementData } from '@/features/retirement/hooks/useRetirementData';
import { CalculationService } from '@/features/retirement/services/CalculationService';
import { ScenarioService, type Scenario } from '@/features/retirement/services/ScenarioService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, Copy, Trash2, GitBranch, FileSpreadsheet, ArrowRight, CheckCircle } from 'lucide-react';

const ScenariosPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useRetirementData();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const refresh = () => {
    try {
      setScenarios(ScenarioService.getAllScenarios());
    } catch (e: any) {
      console.error(e);
      setError('Erreur lors du chargement des scénarios.');
    }
  };

  useEffect(() => {
    try {
      // Créer le scénario de base s'il n'existe pas encore
      const existing = ScenarioService.getAllScenarios().find(s => s.isBase);
      if (!existing) {
        const calculations = CalculationService.calculateAll(userData);
        ScenarioService.createBaseScenario(userData, calculations);
      }
      refresh();
      setReady(true);
    } catch (e: any) {
      console.error(e);
      setError('Impossible d’initialiser les scénarios.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const baseScenario = useMemo(() => scenarios.find(s => s.isBase), [scenarios]);

  const handleGeneratePredefined = () => {
    try {
      const baseData = baseScenario?.userData || userData;
      ScenarioService.generatePredefinedScenarios(baseData);
      refresh();
    } catch (e: any) {
      console.error(e);
      setError('Impossible de générer les scénarios prédéfinis.');
    }
  };

  const handleDelete = (id: string) => {
    ScenarioService.deleteScenario(id);
    refresh();
  };

  const handleReset = () => {
    ScenarioService.reset();
    const calculations = CalculationService.calculateAll(userData);
    ScenarioService.createBaseScenario(userData, calculations);
    refresh();
  };

  if (!ready) {
    return <div className="min-h-[50vh] flex items-center justify-center text-slate-700">Chargement…</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-mpr-interactive-lt">
      <div className="container mx-auto px-6 py-10 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-mpr-navy">Gestion des scénarios</h1>
            <p className="text-slate-700">
              Créez des scénarios A/B/C, comparez vos options et exportez un rapport PDF en format lettre US.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} title="Réinitialiser tous les scénarios (garde la base)">
              Réinitialiser
            </Button>
            <Button className="bg-mpr-interactive hover:bg-mpr-interactive-dk" onClick={() => navigate('/scenario-comparison')}>
              <GitBranch className="w-4 h-4 mr-2" />
              Comparer
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50 text-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-2 border-mpr-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-mpr-navy">
              <FileSpreadsheet className="w-5 h-5" />
              Scénario de base
            </CardTitle>
            <CardDescription>Votre situation actuelle (point de départ de toutes les comparaisons)</CardDescription>
          </CardHeader>
          <CardContent>
            {baseScenario ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-green-300 text-green-800 bg-green-50">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Base
                  </Badge>
                  <div className="text-slate-800 font-medium">{baseScenario.name}</div>
                </div>
                <div className="text-sm text-slate-600">
                  Créé le {new Date(baseScenario.createdAt).toLocaleDateString('fr-CA')}
                </div>
              </div>
            ) : (
              <div className="text-slate-700">Non initialisé.</div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Mes scénarios</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGeneratePredefined}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Générer scénarios prédéfinis
            </Button>
            <Button onClick={() => navigate('/scenario-comparison')} className="bg-amber-600 hover:bg-amber-700">
              Aller au comparateur
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {scenarios
            .filter(s => !s.isBase)
            .map(s => (
              <Card key={s.id} className="hover:shadow-md transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{s.icon}</span>
                    <span>{s.name}</span>
                    <span className="inline-flex items-center rounded px-2 py-0.5 text-xs" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: s.color }}>
                      {s.color}
                    </span>
                  </CardTitle>
                  <CardDescription>{s.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-slate-600">
                    Créé le {new Date(s.createdAt).toLocaleDateString('fr-CA')}
                  </div>
                  <div className="text-sm text-slate-700">
                    Changements: <strong>{s.changes.length}</strong>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      title="Cloner vers un nouveau scénario (à implémenter)"
                      onClick={() => alert('Clonage rapide non implémenté (optionnel)')}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Cloner
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(s.id)}>
                      <Trash2 className="w-4 h-4 mr-1 text-red-600" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ScenariosPage;
