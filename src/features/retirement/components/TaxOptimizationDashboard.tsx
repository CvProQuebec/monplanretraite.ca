import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  DollarSign,
  Shield,
  Target
} from 'lucide-react';

export function TaxOptimizationDashboard() {
  const [taxData, setTaxData] = useState({
    revenuAnnuel: 0, // Initialisé à 0
    age: 0, // Initialisé à 0
    montantREER: 0, // Initialisé à 0
    montantCELI: 0, // Initialisé à 0
    montantNonEnregistre: 0, // Initialisé à 0
    ageRetraite: 0, // Initialisé à 0
    revenuRetraite: 0 // Initialisé à 0
  });

  const [results, setResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runTaxOptimization = async () => {
    setIsAnalyzing(true);
    try {
      // Simulation de l'analyse fiscale
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { revenuAnnuel, age, montantREER, montantCELI, montantNonEnregistre, ageRetraite, revenuRetraite } = taxData;
      
      // Calculs d'optimisation fiscale
      const anneesEpargne = ageRetraite - age;
      const contributionREERMax = Math.min(revenuAnnuel * 0.18, 29210); // Limite 2025
      const contributionCELIMax = anneesEpargne * 7000; // Limite annuelle CELI
      
      // Stratégies d'optimisation
      const strategies = [
        {
          nom: 'Maximisation REER',
          description: 'Contribuer au maximum au REER pour réduire l\'impôt immédiatement',
          impact: 'Économie d\'impôt immédiate',
          montant: Math.min(contributionREERMax, revenuAnnuel * 0.25),
          economieAnnuelle: Math.round(Math.min(contributionREERMax, revenuAnnuel * 0.25) * 0.25),
          priorite: 'haute',
          couleur: 'bg-blue-100 border-blue-300'
        },
        {
          nom: 'Stratégie CELI',
          description: 'Utiliser le CELI pour la croissance à long terme sans impôt',
          impact: 'Croissance libre d\'impôt',
          montant: Math.min(contributionCELIMax, montantNonEnregistre * 0.3),
          economieAnnuelle: Math.round(Math.min(contributionCELIMax, montantNonEnregistre * 0.3) * 0.06),
          priorite: 'haute',
          couleur: 'bg-green-100 border-green-300'
        },
        {
          nom: 'Conversion REER vers FERR',
          description: 'Convertir le REER en FERR à 71 ans pour éviter la pénalité',
          impact: 'Éviter la pénalité de 1% par mois',
          montant: montantREER,
          economieAnnuelle: Math.round(montantREER * 0.12),
          priorite: 'moyenne',
          couleur: 'bg-purple-100 border-purple-300'
        },
        {
          nom: 'Retrait progressif REER',
          description: 'Retirer le REER progressivement pour minimiser l\'impôt',
          impact: 'Réduction de l\'impôt sur le revenu',
          montant: Math.round(montantREER / 20),
          economieAnnuelle: Math.round((montantREER / 20) * 0.15),
          priorite: 'moyenne',
          couleur: 'bg-yellow-100 border-yellow-300'
        },
        {
          nom: 'Dividendes éligibles',
          description: 'Utiliser les dividendes éligibles pour réduire l\'impôt',
          impact: 'Crédit d\'impôt sur dividendes',
          montant: Math.round(montantNonEnregistre * 0.4),
          economieAnnuelle: Math.round(montantNonEnregistre * 0.4 * 0.15),
          priorite: 'basse',
          couleur: 'bg-orange-100 border-orange-300'
        }
      ];
      
      // Calcul des économies totales
      const economieTotale = strategies.reduce((total, s) => total + s.economieAnnuelle, 0);
      const economieCumulative = economieTotale * anneesEpargne;
      
      // Recommandations personnalisées
      const recommandations = [
        {
          type: 'optimisation',
          titre: 'Priorité aux REER',
          description: `Avec un revenu de ${revenuAnnuel.toLocaleString()} $, maximisez vos contributions REER pour réduire votre impôt de ${Math.round(contributionREERMax * 0.25).toLocaleString()} $ par année`,
          impact: 'Élevé',
          priorite: 'haute'
        },
        {
          type: 'optimisation',
          titre: 'Stratégie CELI',
          description: `Vous avez ${anneesEpargne} années pour épargner. Utilisez le CELI pour ${Math.min(contributionCELIMax, montantNonEnregistre * 0.3).toLocaleString()} $ de croissance libre d'impôt`,
          impact: 'Moyen-élevé',
          priorite: 'haute'
        },
        {
          type: 'information',
          titre: 'Planification de retrait',
          description: `Planifiez vos retraits REER progressivement pour éviter de passer dans une tranche d'impôt plus élevée`,
          impact: 'Moyen',
          priorite: 'moyenne'
        }
      ];
      
      const results = {
        strategies,
        economieTotale,
        economieCumulative,
        anneesEpargne,
        recommandations,
        resume: {
          contributionREERMax,
          contributionCELIMax,
          montantTotalOptimise: strategies.reduce((total, s) => total + s.montant, 0)
        }
      };
      
      setResults(results);
    } catch (error) {
      console.error('Erreur optimisation fiscale:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-6 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Target className="w-12 h-12 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Optimisation Fiscale
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Optimisez votre planification fiscale pour maximiser vos économies d'impôt et votre capital de retraite
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Paramètres fiscaux */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-emerald-800">
                <Calculator className="w-6 h-6" />
                Paramètres Fiscaux
              </CardTitle>
              <CardDescription>
                Configurez vos paramètres financiers pour l'optimisation fiscale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="revenuAnnuel">Revenu annuel ($)</Label>
                  <Input
                    id="revenuAnnuel"
                    type="number"
                    value={taxData.revenuAnnuel}
                    onChange={(e) => setTaxData(prev => ({ ...prev, revenuAnnuel: Number(e.target.value) }))}
                    placeholder="80000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="age">Âge actuel</Label>
                  <Input
                    id="age"
                    type="number"
                    value={taxData.age}
                    onChange={(e) => setTaxData(prev => ({ ...prev, age: Number(e.target.value) }))}
                    placeholder="45"
                  />
                </div>

                <div>
                  <Label htmlFor="montantREER">Montant REER actuel ($)</Label>
                  <Input
                    id="montantREER"
                    type="number"
                    value={taxData.montantREER}
                    onChange={(e) => setTaxData(prev => ({ ...prev, montantREER: Number(e.target.value) }))}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label htmlFor="montantCELI">Montant CELI actuel ($)</Label>
                  <Input
                    id="montantCELI"
                    type="number"
                    value={taxData.montantCELI}
                    onChange={(e) => setTaxData(prev => ({ ...prev, montantCELI: Number(e.target.value) }))}
                    placeholder="30000"
                  />
                </div>

                <div>
                  <Label htmlFor="montantNonEnregistre">Épargne non enregistrée ($)</Label>
                  <Input
                    id="montantNonEnregistre"
                    type="number"
                    value={taxData.montantNonEnregistre}
                    onChange={(e) => setTaxData(prev => ({ ...prev, montantNonEnregistre: Number(e.target.value) }))}
                    placeholder="100000"
                  />
                </div>

                <div>
                  <Label htmlFor="ageRetraite">Âge de retraite souhaité</Label>
                  <Input
                    id="ageRetraite"
                    type="number"
                    value={taxData.ageRetraite}
                    onChange={(e) => setTaxData(prev => ({ ...prev, ageRetraite: Number(e.target.value) }))}
                    placeholder="65"
                  />
                </div>
              </div>

              <Button 
                onClick={runTaxOptimization}
                disabled={isAnalyzing}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isAnalyzing ? 'Analyse en cours...' : 'Lancer l\'optimisation fiscale'}
              </Button>
            </CardContent>
          </Card>

          {/* Résultats */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Résumé des économies */}
                <Card className="bg-emerald-50 border-2 border-emerald-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-emerald-800">
                      <CheckCircle className="w-6 h-6" />
                      Résumé des Économies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600 mb-2">
                          {results.economieTotale.toLocaleString()} $
                        </div>
                        <div className="text-sm text-gray-600">Économie annuelle</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {results.economieCumulative.toLocaleString()} $
                        </div>
                        <div className="text-sm text-gray-600">Économie totale ({results.anneesEpargne} ans)</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">Limites annuelles :</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>REER : {results.resume.contributionREERMax.toLocaleString()} $</div>
                        <div>CELI : {results.resume.contributionCELIMax.toLocaleString()} $</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stratégies d'optimisation */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-emerald-800">
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
                              <div className="text-emerald-600">{strategy.montant.toLocaleString()} $</div>
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

                {/* Recommandations */}
                {results.recommandations.length > 0 && (
                  <Card className="bg-blue-50 border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-blue-800">
                        <Info className="w-6 h-6" />
                        Recommandations Personnalisées
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {results.recommandations.map((recommandation: any, index: number) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-blue-800">{recommandation.titre}</h4>
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
