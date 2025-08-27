import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Crown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Target,
  Zap,
  Shield
} from 'lucide-react';

export function UltimatePlanningDashboard() {
  const [planningData, setPlanningData] = useState({
    age: 0, // Initialisé à 0
    revenuAnnuel: 0, // Initialisé à 0
    epargneActuelle: 0, // Initialisé à 0
    objectifRetraite: 0, // Initialisé à 0
    toleranceRisque: 'modere',
    horizonTemps: 0, // Initialisé à 0
    situationFamiliale: 'couple'
  });

  const [results, setResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runUltimatePlanning = async () => {
    setIsAnalyzing(true);
    try {
      // Simulation de la planification expert
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { age, revenuAnnuel, epargneActuelle, objectifRetraite, toleranceRisque, horizonTemps, situationFamiliale } = planningData;
      
      // Calculs de planification
      const ageRetraite = age + horizonTemps;
      const inflation = 0.02; // 2% par année
      const objectifRetraiteInflation = objectifRetraite * Math.pow(1 + inflation, horizonTemps);
      const capitalRequis = objectifRetraiteInflation * 25; // Règle des 4%
      
      // Stratégies d'optimisation
      const strategies = [
        {
          nom: 'Maximisation REER',
          description: 'Contribuer au maximum au REER pour réduire l\'impôt immédiatement',
          impact: 'Économie d\'impôt immédiate',
          montant: Math.min(revenuAnnuel * 0.18, 29210),
          economieAnnuelle: Math.round(Math.min(revenuAnnuel * 0.18, 29210) * 0.25),
          priorite: 'haute',
          couleur: 'bg-blue-100 border-blue-300'
        },
        {
          nom: 'Stratégie CELI',
          description: 'Utiliser le CELI pour la croissance à long terme sans impôt',
          impact: 'Croissance libre d\'impôt',
          montant: horizonTemps * 7000,
          economieAnnuelle: Math.round(horizonTemps * 7000 * 0.06),
          priorite: 'haute',
          couleur: 'bg-green-100 border-green-300'
        },
        {
          nom: 'Investissement immobilier',
          description: 'Diversifier avec l\'immobilier pour la croissance et les revenus',
          impact: 'Diversification et revenus locatifs',
          montant: Math.round(epargneActuelle * 0.3),
          economieAnnuelle: Math.round(epargneActuelle * 0.3 * 0.04),
          priorite: 'moyenne',
          couleur: 'bg-purple-100 border-purple-300'
        },
        {
          nom: 'Fonds de solidarité',
          description: 'Utiliser les fonds de solidarité pour les crédits d\'impôt',
          impact: 'Crédits d\'impôt de 30%',
          montant: 5000,
          economieAnnuelle: Math.round(5000 * 0.30),
          priorite: 'moyenne',
          couleur: 'bg-yellow-100 border-yellow-300'
        },
        {
          nom: 'Assurance vie permanente',
          description: 'Protection familiale et accumulation de valeur',
          impact: 'Protection et épargne forcée',
          montant: 100000,
          economieAnnuelle: Math.round(100000 * 0.03),
          priorite: 'basse',
          couleur: 'bg-orange-100 border-orange-300'
        }
      ];
      
      // Plan d'action personnalisé
      const planAction = [
        {
          phase: 'Phase 1 (0-5 ans)',
          actions: [
            'Maximiser les contributions REER',
            'Établir un fonds d\'urgence de 6 mois',
            'Commencer les contributions CELI',
            'Évaluer la tolérance au risque'
          ],
          priorite: 'haute'
        },
        {
          phase: 'Phase 2 (5-15 ans)',
          actions: [
            'Diversifier le portefeuille',
            'Considérer l\'investissement immobilier',
            'Optimiser la répartition des actifs',
            'Planifier la succession'
          ],
          priorite: 'moyenne'
        },
        {
          phase: 'Phase 3 (15-20 ans)',
          actions: [
            'Préparer la transition vers la retraite',
            'Optimiser les stratégies de décaissement',
            'Finaliser la planification successorale',
            'Tester le budget de retraite'
          ],
          priorite: 'moyenne'
        }
      ];
      
      // Calcul des économies totales
      const economieTotale = strategies.reduce((total, s) => total + s.economieAnnuelle, 0);
      const economieCumulative = economieTotale * horizonTemps;
      
      // Recommandations personnalisées
      const recommandations = [
        {
          type: 'optimisation',
          titre: 'Stratégie REER prioritaire',
          description: `Avec un revenu de ${revenuAnnuel.toLocaleString()} $, maximisez vos contributions REER pour réduire votre impôt de ${Math.round(Math.min(revenuAnnuel * 0.18, 29210) * 0.25).toLocaleString()} $ par année`,
          impact: 'Élevé',
          priorite: 'haute'
        },
        {
          type: 'optimisation',
          titre: 'Planification CELI',
          description: `Vous avez ${horizonTemps} années pour épargner. Utilisez le CELI pour ${(horizonTemps * 7000).toLocaleString()} $ de croissance libre d'impôt`,
          impact: 'Moyen-élevé',
          priorite: 'haute'
        },
        {
          type: 'information',
          titre: 'Objectif de retraite',
          description: `Votre objectif de ${objectifRetraite.toLocaleString()} $ nécessitera un capital de ${Math.round(capitalRequis).toLocaleString()} $ à la retraite`,
          impact: 'Moyen',
          priorite: 'moyenne'
        }
      ];
      
      const results = {
        strategies,
        planAction,
        economieTotale,
        economieCumulative,
        horizonTemps,
        recommandations,
        resume: {
          ageRetraite,
          objectifRetraiteInflation: Math.round(objectifRetraiteInflation),
          capitalRequis: Math.round(capitalRequis),
          deficit: Math.max(0, capitalRequis - epargneActuelle)
        }
      };
      
      setResults(results);
    } catch (error) {
              console.error('Erreur planification expert:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-6 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="w-12 h-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Planification Expert
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Votre plan de retraite complet et personnalisé avec des stratégies avancées d'optimisation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Paramètres de planification */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-800">
                <Target className="w-6 h-6" />
                Paramètres de Planification
              </CardTitle>
              <CardDescription>
                Configurez vos paramètres pour une planification expert personnalisée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Âge actuel</Label>
                  <Input
                    id="age"
                    type="number"
                    value={planningData.age}
                    onChange={(e) => setPlanningData(prev => ({ ...prev, age: Number(e.target.value) }))}
                    placeholder="45"
                  />
                </div>
                
                <div>
                  <Label htmlFor="revenuAnnuel">Revenu annuel ($)</Label>
                  <Input
                    id="revenuAnnuel"
                    type="number"
                    value={planningData.revenuAnnuel}
                    onChange={(e) => setPlanningData(prev => ({ ...prev, revenuAnnuel: Number(e.target.value) }))}
                    placeholder="80000"
                  />
                </div>

                <div>
                  <Label htmlFor="epargneActuelle">Épargne actuelle ($)</Label>
                  <Input
                    id="epargneActuelle"
                    type="number"
                    value={planningData.epargneActuelle}
                    onChange={(e) => setPlanningData(prev => ({ ...prev, epargneActuelle: Number(e.target.value) }))}
                    placeholder="150000"
                  />
                </div>

                <div>
                  <Label htmlFor="objectifRetraite">Objectif revenu retraite ($)</Label>
                  <Input
                    id="objectifRetraite"
                    type="number"
                    value={planningData.objectifRetraite}
                    onChange={(e) => setPlanningData(prev => ({ ...prev, objectifRetraite: Number(e.target.value) }))}
                    placeholder="60000"
                  />
                </div>

                <div>
                  <Label htmlFor="horizonTemps">Horizon de temps (années)</Label>
                  <Input
                    id="horizonTemps"
                    type="number"
                    value={planningData.horizonTemps}
                    onChange={(e) => setPlanningData(prev => ({ ...prev, horizonTemps: Number(e.target.value) }))}
                    placeholder="20"
                  />
                </div>

                <div>
                  <Label htmlFor="toleranceRisque">Tolérance au risque</Label>
                  <select
                    id="toleranceRisque"
                    name="toleranceRisque"
                    aria-label="Sélectionner votre tolérance au risque"
                    value={planningData.toleranceRisque}
                    onChange={(e) => setPlanningData(prev => ({ ...prev, toleranceRisque: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="conservateur">Conservateur</option>
                    <option value="modere">Modéré</option>
                    <option value="agressif">Agressif</option>
                  </select>
                </div>
              </div>

              <Button 
                onClick={runUltimatePlanning}
                disabled={isAnalyzing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isAnalyzing ? 'Planification en cours...' : 'Lancer la Planification Expert'}
              </Button>
            </CardContent>
          </Card>

          {/* Résultats */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Résumé de la planification */}
                <Card className="bg-purple-50 border-2 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-purple-800">
                      <CheckCircle className="w-6 h-6" />
                      Résumé de la Planification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-2">
                          {results.resume.ageRetraite} ans
                        </div>
                        <div className="text-sm text-gray-600">Âge de retraite</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {results.resume.objectifRetraiteInflation.toLocaleString()} $
                        </div>
                        <div className="text-sm text-gray-600">Objectif avec inflation</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600 mb-2">
                          {results.resume.capitalRequis.toLocaleString()} $
                        </div>
                        <div className="text-sm text-gray-600">Capital requis à la retraite</div>
                        {results.resume.deficit > 0 && (
                          <div className="text-sm text-red-600 mt-2">
                            Déficit : {results.resume.deficit.toLocaleString()} $
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stratégies d'optimisation */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-purple-800">
                      <TrendingUp className="w-6 h-6" />
                      Stratégies d'Optimisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.strategies.map((strategy: any, index: number) => (
                        <div key={index} className={`${strategy.couleur} border rounded-lg p-3`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{strategy.nom}</h4>
                              <p className="text-sm text-gray-600">{strategy.description}</p>
                            </div>
                            <Badge variant="outline">{strategy.priorite}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="font-semibold text-gray-700">Montant :</div>
                              <div className="text-purple-600">{strategy.montant.toLocaleString()} $</div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-700">Économie annuelle :</div>
                              <div className="text-blue-600">{strategy.economieAnnuelle.toLocaleString()} $</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 mt-2">
                            <strong>Impact :</strong> {strategy.impact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Plan d'action */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-blue-800">
                      <Zap className="w-6 h-6" />
                      Plan d'Action Personnalisé
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.planAction.map((phase: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-lg">{phase.phase}</h4>
                            <Badge variant={phase.priorite === 'haute' ? 'default' : 'secondary'}>
                              {phase.priorite}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {phase.actions.map((action: string, actionIndex: number) => (
                              <div key={actionIndex} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-sm">{action}</span>
                              </div>
                            ))}
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
                        Recommandations Personnalisées
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
