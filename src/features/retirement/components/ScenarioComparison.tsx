// src/features/retirement/components/ScenarioComparison.tsx
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
  GitCompare
} from 'lucide-react';

export function ScenarioComparison() {
  const [scenarios, setScenarios] = useState([
    {
      id: 1,
      nom: 'Scénario Conservateur',
      montantInitial: 100000,
      contributionAnnuelle: 8000,
      rendementMoyen: 4.0,
      anneesEpargne: 20,
      ageRetraite: 67,
      risque: 'Faible',
      couleur: 'bg-blue-100 border-blue-300'
    },
    {
      id: 2,
      nom: 'Scénario Modéré',
      montantInitial: 100000,
      contributionAnnuelle: 10000,
      rendementMoyen: 6.0,
      anneesEpargne: 20,
      ageRetraite: 65,
      risque: 'Moyen',
      couleur: 'bg-green-100 border-green-300'
    },
    {
      id: 3,
      nom: 'Scénario Agressif',
      montantInitial: 100000,
      contributionAnnuelle: 12000,
      rendementMoyen: 8.0,
      anneesEpargne: 20,
      ageRetraite: 63,
      risque: 'Élevé',
      couleur: 'bg-purple-100 border-purple-300'
    }
  ]);

  const [results, setResults] = useState<any>(null);
  const [isComparing, setIsComparing] = useState(false);

  const calculateScenario = (scenario: any) => {
    const { montantInitial, contributionAnnuelle, rendementMoyen, anneesEpargne } = scenario;
    
    // Calcul du montant final avec intérêts composés
    const montantFinal = montantInitial * Math.pow(1 + rendementMoyen / 100, anneesEpargne) + 
                        contributionAnnuelle * ((Math.pow(1 + rendementMoyen / 100, anneesEpargne) - 1) / (rendementMoyen / 100));
    
    // Calcul de la rente annuelle (4% rule)
    const renteAnnuelle = montantFinal * 0.04;
    
    // Calcul de la valeur viagère (jusqu'à 85 ans)
    const anneesRetraite = 85 - scenario.ageRetraite;
    const valeurViagere = renteAnnuelle * anneesRetraite;
    
    return {
      montantFinal: Math.round(montantFinal),
      renteAnnuelle: Math.round(renteAnnuelle),
      valeurViagere: Math.round(valeurViagere),
      renteMensuelle: Math.round(renteAnnuelle / 12)
    };
  };

  const runComparison = async () => {
    setIsComparing(true);
    try {
      // Simulation des calculs
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const scenariosCalcules = scenarios.map(scenario => {
        const calculs = calculateScenario(scenario);
        return {
          ...scenario,
          calculs,
          score: calculateScore(scenario, calculs)
        };
      });
      
      // Tri par score
      scenariosCalcules.sort((a, b) => b.score - a.score);
      
      // Calcul des métriques de comparaison
      const montantsFinaux = scenariosCalcules.map(s => s.calculs.montantFinal);
      const rentesAnnuelles = scenariosCalcules.map(s => s.calculs.renteAnnuelle);
      
      const results = {
        scenarios: scenariosCalcules,
        comparaison: {
          montantMoyen: Math.round(montantsFinaux.reduce((a, b) => a + b, 0) / montantsFinaux.length),
          montantMin: Math.min(...montantsFinaux),
          montantMax: Math.max(...montantsFinaux),
          renteMoyenne: Math.round(rentesAnnuelles.reduce((a, b) => a + b, 0) / rentesAnnuelles.length),
          renteMin: Math.min(...rentesAnnuelles),
          renteMax: Math.max(...rentesAnnuelles)
        },
        recommandations: generateRecommendations(scenariosCalcules)
      };
      
      setResults(results);
    } catch (error) {
      console.error('Erreur comparaison des scénarios:', error);
    } finally {
      setIsComparing(false);
    }
  };

  const calculateScore = (scenario: any, calculs: any) => {
    let score = 0;
    
    // Score basé sur le montant final (40%)
    score += (calculs.montantFinal / 1000000) * 40;
    
    // Score basé sur la rente annuelle (30%)
    score += (calculs.renteAnnuelle / 100000) * 30;
    
    // Score basé sur l'âge de retraite (20%)
    score += (70 - scenario.ageRetraite) * 2;
    
    // Score basé sur le risque (10%)
    if (scenario.risque === 'Faible') score += 10;
    else if (scenario.risque === 'Moyen') score += 8;
    else score += 6;
    
    return Math.round(score);
  };

  const generateRecommendations = (scenarios: any[]) => {
    const recommandations = [];
    
    // Meilleur scénario global
    const meilleur = scenarios[0];
    recommandations.push({
      type: 'optimisation',
      titre: 'Scénario recommandé',
      description: `${meilleur.nom} offre le meilleur équilibre avec un score de ${meilleur.score}/100`,
      impact: 'Élevé',
      priorite: 'haute'
    });
    
    // Scénario le plus conservateur
    const conservateur = scenarios.find(s => s.risque === 'Faible');
    if (conservateur) {
      recommandations.push({
        type: 'information',
        titre: 'Option sécuritaire',
        description: `${conservateur.nom} offre la sécurité maximale avec un risque minimal`,
        impact: 'Moyen',
        priorite: 'moyenne'
      });
    }
    
    // Scénario le plus agressif
    const agressif = scenarios.find(s => s.risque === 'Élevé');
    if (agressif) {
      recommandations.push({
        type: 'alerte',
        titre: 'Option à haut rendement',
        description: `${agressif.nom} offre le potentiel de gains les plus élevés mais avec plus de risque`,
        impact: 'Élevé',
        priorite: 'moyenne'
      });
    }
    
    return recommandations;
  };

  const updateScenario = (id: number, field: string, value: any) => {
    setScenarios(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <GitCompare className="w-12 h-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Comparaison de Scénarios
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Comparez différents scénarios de planification de retraite et trouvez celui qui vous convient le mieux
          </p>
        </div>

        {/* Configuration des scénarios */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {scenarios.map((scenario) => (
            <Card key={scenario.id} className={`${scenario.couleur} border-2 shadow-lg`}>
              <CardHeader>
                <CardTitle className="text-lg">{scenario.nom}</CardTitle>
                <CardDescription>
                  Niveau de risque : <Badge variant="outline">{scenario.risque}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`montantInitial-${scenario.id}`}>Montant initial ($)</Label>
                    <Input
                      id={`montantInitial-${scenario.id}`}
                      type="number"
                      value={scenario.montantInitial}
                      onChange={(e) => updateScenario(scenario.id, 'montantInitial', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`contribution-${scenario.id}`}>Contribution annuelle ($)</Label>
                    <Input
                      id={`contribution-${scenario.id}`}
                      type="number"
                      value={scenario.contributionAnnuelle}
                      onChange={(e) => updateScenario(scenario.id, 'contributionAnnuelle', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`rendement-${scenario.id}`}>Rendement moyen (%)</Label>
                    <Input
                      id={`rendement-${scenario.id}`}
                      type="number"
                      step="0.1"
                      value={scenario.rendementMoyen}
                      onChange={(e) => updateScenario(scenario.id, 'rendementMoyen', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`annees-${scenario.id}`}>Années d'épargne</Label>
                    <Input
                      id={`annees-${scenario.id}`}
                      type="number"
                      value={scenario.anneesEpargne}
                      onChange={(e) => updateScenario(scenario.id, 'anneesEpargne', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`age-${scenario.id}`}>Âge de retraite</Label>
                    <Input
                      id={`age-${scenario.id}`}
                      type="number"
                      value={scenario.ageRetraite}
                      onChange={(e) => updateScenario(scenario.id, 'ageRetraite', Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bouton de comparaison */}
        <div className="text-center mb-8">
          <Button 
            onClick={runComparison}
            disabled={isComparing}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3"
          >
            {isComparing ? 'Comparaison en cours...' : 'Comparer les Scénarios'}
          </Button>
        </div>

        {/* Résultats de la comparaison */}
        {results && (
          <div className="space-y-8">
            {/* Résumé de la comparaison */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-indigo-800">
                  <BarChart3 className="w-6 h-6" />
                  Résumé de la Comparaison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600 mb-2">
                      {results.comparaison.montantMoyen.toLocaleString()} $
                    </div>
                    <div className="text-sm text-gray-600">Montant moyen</div>
                    <div className="text-xs text-gray-500">
                      Min: {results.comparaison.montantMin.toLocaleString()} $ | 
                      Max: {results.comparaison.montantMax.toLocaleString()} $
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {results.comparaison.renteMoyenne.toLocaleString()} $
                    </div>
                    <div className="text-sm text-gray-600">Rente annuelle moyenne</div>
                    <div className="text-xs text-gray-500">
                      Min: {results.comparaison.renteMin.toLocaleString()} $ | 
                      Max: {results.comparaison.renteMax.toLocaleString()} $
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {results.scenarios.length}
                    </div>
                    <div className="text-sm text-gray-600">Scénarios analysés</div>
                    <div className="text-xs text-gray-500">
                      Score moyen: {Math.round(results.scenarios.reduce((a, b) => a + b.score, 0) / results.scenarios.length)}/100
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détail des scénarios */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {results.scenarios.map((scenario: any, index: number) => (
                <Card key={scenario.id} className={`${scenario.couleur} border-2 shadow-lg`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{scenario.nom}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline">{scenario.risque}</Badge>
                        </CardDescription>
                      </div>
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        #{index + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600 mb-2">
                        {scenario.calculs.montantFinal.toLocaleString()} $
                      </div>
                      <div className="text-sm text-gray-600">Capital final</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="font-semibold text-gray-700">Rente annuelle :</div>
                        <div className="text-green-600">{scenario.calculs.renteAnnuelle.toLocaleString()} $</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-700">Rente mensuelle :</div>
                        <div className="text-blue-600">{scenario.calculs.renteMensuelle.toLocaleString()} $</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-700">Valeur viagère :</div>
                        <div className="text-purple-600">{scenario.calculs.valeurViagere.toLocaleString()} $</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-700">Score :</div>
                        <div className="text-orange-600">{scenario.score}/100</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recommandations */}
            {results.recommandations.length > 0 && (
              <Card className="bg-yellow-50 border-2 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-yellow-800">
                    <Info className="w-6 h-6" />
                    Recommandations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {results.recommandations.map((recommandation: any, index: number) => (
                      <div key={index} className="border-l-4 border-yellow-500 pl-4">
                        <h4 className="font-semibold text-yellow-800">{recommandation.titre}</h4>
                        <p className="text-sm text-gray-700 mb-2">{recommandation.description}</p>
                        <div className="text-xs text-gray-600">
                          <strong>Impact :</strong> {recommandation.impact} | <strong>Priorité :</strong> {recommandation.priorite}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}