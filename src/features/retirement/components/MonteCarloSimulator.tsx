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
  Zap
} from 'lucide-react';

export function MonteCarloSimulator() {
  const [simulationData, setSimulationData] = useState({
    montantInitial: 100000,
    contributionAnnuelle: 10000,
    rendementMoyen: 6.0,
    volatilite: 15.0,
    anneesSimulation: 20,
    nombreSimulations: 1000
  });

  const [results, setResults] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runMonteCarloSimulation = async () => {
    setIsSimulating(true);
    try {
      // Simulation des calculs Monte Carlo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simulations = [];
      const { montantInitial, contributionAnnuelle, rendementMoyen, volatilite, anneesSimulation } = simulationData;
      
      for (let i = 0; i < simulationData.nombreSimulations; i++) {
        let montant = montantInitial;
        const rendements = [];
        
        for (let annee = 0; annee < anneesSimulation; annee++) {
          // Génération d'un rendement aléatoire basé sur la distribution normale
          const rendement = rendementMoyen + (Math.random() - 0.5) * volatilite * 2;
          rendements.push(rendement);
          
          // Calcul du montant avec contribution et rendement
          montant = montant * (1 + rendement / 100) + contributionAnnuelle;
        }
        
        simulations.push({
          id: i,
          montantFinal: montant,
          rendementMoyen: rendements.reduce((a, b) => a + b, 0) / rendements.length,
          volatilite: Math.sqrt(rendements.reduce((a, b) => a + Math.pow(b - rendements.reduce((c, d) => c + d, 0) / rendements.length, 2), 0) / rendements.length)
        });
      }
      
      // Tri par montant final
      simulations.sort((a, b) => a.montantFinal - b.montantFinal);
      
      // Calcul des percentiles
      const p10 = simulations[Math.floor(simulations.length * 0.1)];
      const p25 = simulations[Math.floor(simulations.length * 0.25)];
      const p50 = simulations[Math.floor(simulations.length * 0.5)];
      const p75 = simulations[Math.floor(simulations.length * 0.75)];
      const p90 = simulations[Math.floor(simulations.length * 0.9)];
      
      const mockResults = {
        simulations: simulations.slice(0, 100), // Limiter à 100 pour l'affichage
        statistiques: {
          montantMoyen: simulations.reduce((a, b) => a + b.montantFinal, 0) / simulations.length,
          montantMedian: p50.montantFinal,
          montantMin: simulations[0].montantFinal,
          montantMax: simulations[simulations.length - 1].montantFinal,
          percentiles: { p10, p25, p50, p75, p90 }
        },
        scenarios: [
          {
            nom: 'Scénario pessimiste (10%)',
            montant: p10.montantFinal,
            probabilite: '10%',
            couleur: 'text-red-600',
            description: 'Dans 10% des cas, votre portefeuille vaudra moins que ce montant'
          },
          {
            nom: 'Scénario conservateur (25%)',
            montant: p25.montantFinal,
            probabilite: '25%',
            couleur: 'text-orange-600',
            description: 'Dans 25% des cas, votre portefeuille vaudra moins que ce montant'
          },
          {
            nom: 'Scénario médian (50%)',
            montant: p50.montantFinal,
            probabilite: '50%',
            couleur: 'text-blue-600',
            description: 'Dans 50% des cas, votre portefeuille vaudra plus que ce montant'
          },
          {
            nom: 'Scénario optimiste (75%)',
            montant: p75.montantFinal,
            probabilite: '75%',
            couleur: 'text-green-600',
            description: 'Dans 75% des cas, votre portefeuille vaudra plus que ce montant'
          },
          {
            nom: 'Scénario très optimiste (90%)',
            montant: p90.montantFinal,
            probabilite: '90%',
            couleur: 'text-emerald-600',
            description: 'Dans 90% des cas, votre portefeuille vaudra plus que ce montant'
          }
        ]
      };
      
      setResults(mockResults);
    } catch (error) {
      console.error('Erreur simulation Monte Carlo:', error);
    } finally {
      setIsSimulating(false);
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
              Simulateur Monte Carlo
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Analysez les scénarios probabilistes de votre planification de retraite avec des simulations avancées
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Paramètres de simulation */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-800">
                <Calculator className="w-6 h-6" />
                Paramètres de Simulation
              </CardTitle>
              <CardDescription>
                Configurez vos paramètres financiers pour la simulation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="montantInitial">Montant initial ($)</Label>
                  <Input
                    id="montantInitial"
                    type="number"
                    value={simulationData.montantInitial}
                    onChange={(e) => setSimulationData(prev => ({ ...prev, montantInitial: Number(e.target.value) }))}
                    placeholder="100000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contributionAnnuelle">Contribution annuelle ($)</Label>
                  <Input
                    id="contributionAnnuelle"
                    type="number"
                    value={simulationData.contributionAnnuelle}
                    onChange={(e) => setSimulationData(prev => ({ ...prev, contributionAnnuelle: Number(e.target.value) }))}
                    placeholder="10000"
                  />
                </div>

                <div>
                  <Label htmlFor="rendementMoyen">Rendement moyen (%)</Label>
                  <Input
                    id="rendementMoyen"
                    type="number"
                    step="0.1"
                    value={simulationData.rendementMoyen}
                    onChange={(e) => setSimulationData(prev => ({ ...prev, rendementMoyen: Number(e.target.value) }))}
                    placeholder="6.0"
                  />
                </div>

                <div>
                  <Label htmlFor="volatilite">Volatilité (%)</Label>
                  <Input
                    id="volatilite"
                    type="number"
                    step="0.1"
                    value={simulationData.volatilite}
                    onChange={(e) => setSimulationData(prev => ({ ...prev, volatilite: Number(e.target.value) }))}
                    placeholder="15.0"
                  />
                </div>

                <div>
                  <Label htmlFor="anneesSimulation">Années de simulation</Label>
                  <Input
                    id="anneesSimulation"
                    type="number"
                    value={simulationData.anneesSimulation}
                    onChange={(e) => setSimulationData(prev => ({ ...prev, anneesSimulation: Number(e.target.value) }))}
                    placeholder="20"
                  />
                </div>

                <div>
                  <Label htmlFor="nombreSimulations">Nombre de simulations</Label>
                  <Input
                    id="nombreSimulations"
                    type="number"
                    value={simulationData.nombreSimulations}
                    onChange={(e) => setSimulationData(prev => ({ ...prev, nombreSimulations: Number(e.target.value) }))}
                    placeholder="1000"
                  />
                </div>
              </div>

              <Button 
                onClick={runMonteCarloSimulation}
                disabled={isSimulating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isSimulating ? 'Simulation en cours...' : 'Lancer la simulation Monte Carlo'}
              </Button>
            </CardContent>
          </Card>

          {/* Résultats */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Statistiques principales */}
                <Card className="bg-green-50 border-2 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-green-800">
                      <CheckCircle className="w-6 h-6" />
                      Résultats de la Simulation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(results.statistiques.montantMoyen).toLocaleString()} $
                        </div>
                        <div className="text-sm text-gray-600">Montant moyen</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(results.statistiques.montantMedian).toLocaleString()} $
                        </div>
                        <div className="text-sm text-gray-600">Montant médian</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-gray-700">Montant minimum :</div>
                        <div className="text-red-600">{Math.round(results.statistiques.montantMin).toLocaleString()} $</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-700">Montant maximum :</div>
                        <div className="text-emerald-600">{Math.round(results.statistiques.montantMax).toLocaleString()} $</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Scénarios probabilistes */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-purple-800">
                      <TrendingUp className="w-6 h-6" />
                      Scénarios Probabilistes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.scenarios.map((scenario: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">{scenario.nom}</h4>
                            <Badge variant="outline" className={scenario.couleur}>
                              {scenario.probabilite}
                            </Badge>
                          </div>
                          <div className="text-2xl font-bold mb-2 text-gray-800">
                            {Math.round(scenario.montant).toLocaleString()} $
                          </div>
                          <div className="text-sm text-gray-600">
                            {scenario.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Avertissement */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-5 w-5 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Note importante :</strong> Ces simulations sont basées sur des modèles probabilistes et ne garantissent pas les résultats futurs. 
                    Consultez un conseiller financier pour des conseils personnalisés.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}