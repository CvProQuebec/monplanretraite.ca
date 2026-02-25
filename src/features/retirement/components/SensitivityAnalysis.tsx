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
  Target
} from 'lucide-react';

export function SensitivityAnalysis() {
  const [analysisData, setAnalysisData] = useState({
    montantInitial: 100000,
    contributionAnnuelle: 10000,
    rendementMoyen: 6.0,
    anneesSimulation: 20,
    ageRetraite: 65
  });

  const [results, setResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runSensitivityAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Simulation de l'analyse de sensibilité
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { montantInitial, contributionAnnuelle, rendementMoyen, anneesSimulation, ageRetraite } = analysisData;
      
      // Calculs de base
      const montantBase = montantInitial * Math.pow(1 + rendementMoyen / 100, anneesSimulation) + 
                          contributionAnnuelle * ((Math.pow(1 + rendementMoyen / 100, anneesSimulation) - 1) / (rendementMoyen / 100));
      
      // Variations des paramètres
      const variations = {
        rendement: [-2, -1, 0, 1, 2], // -2% à +2%
        contribution: [-2000, -1000, 0, 1000, 2000], // -2000$ à +2000$
        annees: [-5, -2, 0, 2, 5], // -5 à +5 ans
        age: [-3, -1, 0, 1, 3] // -3 à +3 ans
      };
      
      const results = {
        montantBase: Math.round(montantBase),
        analyses: {
          rendement: variations.rendement.map(v => {
            const nouveauRendement = rendementMoyen + v;
            const nouveauMontant = montantInitial * Math.pow(1 + nouveauRendement / 100, anneesSimulation) + 
                                  contributionAnnuelle * ((Math.pow(1 + nouveauRendement / 100, anneesSimulation) - 1) / (nouveauRendement / 100));
            return {
              variation: v,
              nouveauRendement,
              montant: Math.round(nouveauMontant),
              impact: Math.round(nouveauMontant - montantBase),
              impactPourcentage: Math.round(((nouveauMontant - montantBase) / montantBase) * 100)
            };
          }),
          contribution: variations.contribution.map(v => {
            const nouvelleContribution = contributionAnnuelle + v;
            const nouveauMontant = montantInitial * Math.pow(1 + rendementMoyen / 100, anneesSimulation) + 
                                  nouvelleContribution * ((Math.pow(1 + rendementMoyen / 100, anneesSimulation) - 1) / (rendementMoyen / 100));
            return {
              variation: v,
              nouvelleContribution,
              montant: Math.round(nouveauMontant),
              impact: Math.round(nouveauMontant - montantBase),
              impactPourcentage: Math.round(((nouveauMontant - montantBase) / montantBase) * 100)
            };
          }),
          annees: variations.annees.map(v => {
            const nouvellesAnnees = anneesSimulation + v;
            const nouveauMontant = montantInitial * Math.pow(1 + rendementMoyen / 100, nouvellesAnnees) + 
                                  contributionAnnuelle * ((Math.pow(1 + rendementMoyen / 100, nouvellesAnnees) - 1) / (rendementMoyen / 100));
            return {
              variation: v,
              nouvellesAnnees,
              montant: Math.round(nouveauMontant),
              impact: Math.round(nouveauMontant - montantBase),
              impactPourcentage: Math.round(((nouveauMontant - montantBase) / montantBase) * 100)
            };
          }),
          age: variations.age.map(v => {
            const nouvelAge = ageRetraite + v;
            const anneesEpargne = nouvelAge - (65 - anneesSimulation);
            const nouveauMontant = montantInitial * Math.pow(1 + rendementMoyen / 100, anneesEpargne) + 
                                  contributionAnnuelle * ((Math.pow(1 + rendementMoyen / 100, anneesEpargne) - 1) / (rendementMoyen / 100));
            return {
              variation: v,
              nouvelAge,
              anneesEpargne,
              montant: Math.round(nouveauMontant),
              impact: Math.round(nouveauMontant - montantBase),
              impactPourcentage: Math.round(((nouveauMontant - montantBase) / montantBase) * 100)
            };
          })
        },
        recommandations: [
          {
            type: 'optimisation',
            titre: 'Optimisation du rendement',
            description: 'Une augmentation de 1% du rendement peut augmenter votre capital de retraite de 15-20%',
            impact: 'Impact élevé',
            priorite: 'haute',
            actions: ['Diversifiez votre portefeuille', 'Consultez un conseiller en placement']
          },
          {
            type: 'optimisation',
            titre: 'Augmentation des contributions',
            description: 'Augmenter vos contributions annuelles de 1000$ peut avoir un impact significatif à long terme',
            impact: 'Impact moyen-élevé',
            priorite: 'haute',
            actions: ['Automatisez vos contributions', 'Utilisez les REER et CELI']
          },
          {
            type: 'information',
            titre: 'Durée d\'épargne',
            description: 'Chaque année supplémentaire d\'épargne peut augmenter votre capital de 8-12%',
            impact: 'Impact élevé',
            priorite: 'moyenne',
            actions: ['Considérez reporter votre retraite', 'Commencez tôt l\'épargne']
          }
        ]
      };
      
      setResults(results);
    } catch (error) {
      console.error('Erreur analyse de sensibilité:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-mpr-interactive-lt">
      <div className="container mx-auto px-6 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Target className="w-12 h-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Analyse de Sensibilité
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Comprenez l'impact des variations de paramètres sur votre planification de retraite
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Paramètres de base */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-800">
                <Calculator className="w-6 h-6" />
                Paramètres de Base
              </CardTitle>
              <CardDescription>
                Configurez vos paramètres financiers de référence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="montantInitial">Montant initial ($)</Label>
                  <Input
                    id="montantInitial"
                    type="number"
                    value={analysisData.montantInitial}
                    onChange={(e) => setAnalysisData(prev => ({ ...prev, montantInitial: Number(e.target.value) }))}
                    placeholder="100000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contributionAnnuelle">Contribution annuelle ($)</Label>
                  <Input
                    id="contributionAnnuelle"
                    type="number"
                    value={analysisData.contributionAnnuelle}
                    onChange={(e) => setAnalysisData(prev => ({ ...prev, contributionAnnuelle: Number(e.target.value) }))}
                    placeholder="10000"
                  />
                </div>

                <div>
                  <Label htmlFor="rendementMoyen">Rendement moyen (%)</Label>
                  <Input
                    id="rendementMoyen"
                    type="number"
                    step="0.1"
                    value={analysisData.rendementMoyen}
                    onChange={(e) => setAnalysisData(prev => ({ ...prev, rendementMoyen: Number(e.target.value) }))}
                    placeholder="6.0"
                  />
                </div>

                <div>
                  <Label htmlFor="anneesSimulation">Années d'épargne</Label>
                  <Input
                    id="anneesSimulation"
                    type="number"
                    value={analysisData.anneesSimulation}
                    onChange={(e) => setAnalysisData(prev => ({ ...prev, anneesSimulation: Number(e.target.value) }))}
                    placeholder="20"
                  />
                </div>

                <div>
                  <Label htmlFor="ageRetraite">Âge de retraite</Label>
                  <Input
                    id="ageRetraite"
                    type="number"
                    value={analysisData.ageRetraite}
                    onChange={(e) => setAnalysisData(prev => ({ ...prev, ageRetraite: Number(e.target.value) }))}
                    placeholder="65"
                  />
                </div>
              </div>

              <Button 
                onClick={runSensitivityAnalysis}
                disabled={isAnalyzing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isAnalyzing ? 'Analyse en cours...' : 'Lancer l\'analyse de sensibilité'}
              </Button>
            </CardContent>
          </Card>

          {/* Résultats */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Résumé principal */}
                <Card className="bg-mpr-interactive-lt border-2 border-mpr-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-mpr-navy">
                      <CheckCircle className="w-6 h-6" />
                      Scénario de Référence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-mpr-interactive mb-2">
                        {results.montantBase.toLocaleString()} $
                      </div>
                      <div className="text-sm text-gray-600">
                        Capital de retraite projeté
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sensibilité au rendement */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-green-800">
                      <TrendingUp className="w-6 h-6" />
                      Sensibilité au Rendement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.analyses.rendement.map((analyse: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">
                              Rendement {analyse.nouveauRendement.toFixed(1)}%
                            </h4>
                            <Badge variant={analyse.impact >= 0 ? "default" : "destructive"}>
                              {analyse.impact >= 0 ? '+' : ''}{analyse.impactPourcentage}%
                            </Badge>
                          </div>
                          <div className="text-lg font-bold mb-1">
                            {analyse.montant.toLocaleString()} $
                          </div>
                          <div className="text-sm text-gray-600">
                            Impact : {analyse.impact >= 0 ? '+' : ''}{analyse.impact.toLocaleString()} $
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sensibilité aux contributions */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-mpr-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-mpr-navy">
                      <Calculator className="w-6 h-6" />
                      Sensibilité aux Contributions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.analyses.contribution.map((analyse: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">
                              Contribution {analyse.nouvelleContribution.toLocaleString()} $
                            </h4>
                            <Badge variant={analyse.impact >= 0 ? "default" : "destructive"}>
                              {analyse.impact >= 0 ? '+' : ''}{analyse.impactPourcentage}%
                            </Badge>
                          </div>
                          <div className="text-lg font-bold mb-1">
                            {analyse.montant.toLocaleString()} $
                          </div>
                          <div className="text-sm text-gray-600">
                            Impact : {analyse.impact >= 0 ? '+' : ''}{analyse.impact.toLocaleString()} $
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommandations */}
                {results.recommandations.length > 0 && (
                  <Card className="bg-yellow-50 border-2 border-yellow-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-yellow-800">
                        <Info className="w-6 h-6" />
                        Recommandations d'Optimisation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
