import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Calendar,
  DollarSign,
  Users
} from 'lucide-react';

interface RREGOPAnalysisSectionProps {
  userPlan: 'free' | 'professional' | 'ultimate';
}

export default function RREGOPAnalysisSection({ userPlan }: RREGOPAnalysisSectionProps) {
  const [rregopData, setRregopData] = useState({
    typeRegime: 'RREGOP',
    anneesServiceAdmissibilite: 15,
    anneesServiceCalcul: 15,
    pourcentageTempsPlein: 1.0,
    salaireActuel: 65000,
    ageRetraite: 61,
    optionSurvivant: 50
  });

  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      // Simulation des calculs RREGOP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResults = {
        valide: true,
        montantPleineRente: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul),
        montantFinal: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul),
        anneesServiceTotales: rregopData.anneesServiceCalcul,
        penalites: {
          applicable: rregopData.ageRetraite < 61,
          tauxPenalite: rregopData.ageRetraite < 61 ? (61 - rregopData.ageRetraite) * 0.06 : 0
        },
        coordination: {
          applicable: rregopData.ageRetraite < 65,
          ageApplication: 65,
          montantReduction: 0
        },
        renteConjoint: {
          pourcentage: rregopData.optionSurvivant,
          montant: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul * (rregopData.optionSurvivant / 100))
        },
        projections: {
          montantViager: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul * (85 - rregopData.ageRetraite)),
          valeurActuelle: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul * 20),
          indexationAnnuelle: 2.0
        },
        recommandations: [
          {
            type: 'optimisation',
            titre: 'Optimisation de l\'âge de retraite',
            description: 'Considérez reporter votre retraite à 61 ans pour éviter les pénalités',
            impact: 'Économie de 18% sur votre rente',
            priorite: 'haute',
            actions: ['Analyser l\'impact financier', 'Consulter un conseiller RREGOP']
          }
        ],
        scenarios: [
          {
            nom: 'Retraite à 58 ans',
            ageRetraite: 58,
            montantAnnuel: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul * 0.82),
            montantViager: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul * 0.82 * 27),
            avantages: ['Plus d\'années de liberté'],
            inconvenients: ['Pénalité de 18%', 'Coordination RRQ à 65 ans']
          },
          {
            nom: 'Retraite à 61 ans',
            ageRetraite: 61,
            montantAnnuel: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul),
            montantViager: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul * 24),
            avantages: ['Pleine rente disponible', 'Aucune pénalité'],
            inconvenients: ['Coordination RRQ à 65 ans']
          },
          {
            nom: 'Retraite à 65 ans',
            ageRetraite: 65,
            montantAnnuel: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul),
            montantViager: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul * 20),
            avantages: ['Pleine rente disponible', 'Aucune pénalité', 'Pas de coordination RRQ'],
            inconvenients: ['Moins d\'années de liberté']
          }
        ]
      };
      
      setResults(mockResults);
    } catch (error) {
      console.error('Erreur calcul RREGOP:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Building2 className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Module RREGOP
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Analysez votre régime de retraite des employés du gouvernement et des organismes publics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de saisie */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <Calculator className="w-6 h-6" />
                Données RREGOP
              </CardTitle>
              <CardDescription>
                Saisissez vos informations de service gouvernemental
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="typeRegime">Type de régime</Label>
                  <Select value={rregopData.typeRegime} onValueChange={(value) => setRregopData(prev => ({ ...prev, typeRegime: value as 'RREGOP' | 'RRPE' }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RREGOP">RREGOP</SelectItem>
                      <SelectItem value="RRPE">RRPE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="anneesService">Années de service admissibles</Label>
                  <Input
                    id="anneesService"
                    type="number"
                    value={rregopData.anneesServiceAdmissibilite}
                    onChange={(e) => setRregopData(prev => ({ ...prev, anneesServiceAdmissibilite: Number(e.target.value) }))}
                    placeholder="15"
                  />
                </div>

                <div>
                  <Label htmlFor="anneesCalcul">Années de service pour calcul</Label>
                  <Input
                    id="anneesCalcul"
                    type="number"
                    value={rregopData.anneesServiceCalcul}
                    onChange={(e) => setRregopData(prev => ({ ...prev, anneesServiceCalcul: Number(e.target.value) }))}
                    placeholder="15"
                  />
                </div>

                <div>
                  <Label htmlFor="salaireActuel">Salaire actuel</Label>
                  <Input
                    id="salaireActuel"
                    type="number"
                    value={rregopData.salaireActuel}
                    onChange={(e) => setRregopData(prev => ({ ...prev, salaireActuel: Number(e.target.value) }))}
                    placeholder="65000"
                  />
                </div>

                <div>
                  <Label htmlFor="ageRetraite">Âge de retraite souhaité</Label>
                  <Input
                    id="ageRetraite"
                    type="number"
                    value={rregopData.ageRetraite}
                    onChange={(e) => setRregopData(prev => ({ ...prev, ageRetraite: Number(e.target.value) }))}
                    placeholder="61"
                  />
                </div>

                <div>
                  <Label htmlFor="optionSurvivant">Option survivant</Label>
                  <Select value={rregopData.optionSurvivant.toString()} onValueChange={(value) => setRregopData(prev => ({ ...prev, optionSurvivant: Number(value) as 50 | 60 }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50%</SelectItem>
                      <SelectItem value="60">60%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isCalculating ? 'Calcul en cours...' : 'Calculer ma rente RREGOP'}
              </Button>
            </CardContent>
          </Card>

          {/* Résultats */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Résumé principal */}
                <Card className="bg-green-50 border-2 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-green-800">
                      <CheckCircle className="w-6 h-6" />
                      Résultats du calcul
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {results.montantFinal.toLocaleString()} $
                        </div>
                        <div className="text-sm text-gray-600">Rente annuelle</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(results.montantFinal / 12).toLocaleString()} $
                        </div>
                        <div className="text-sm text-gray-600">Rente mensuelle</div>
                      </div>
                    </div>
                    
                    {results.penalites.applicable && (
                      <Alert className="border-orange-200 bg-orange-50">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          Pénalité de {(results.penalites.tauxPenalite * 100).toFixed(1)}% pour retraite anticipée
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Scénarios */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-blue-800">
                      <TrendingUp className="w-6 h-6" />
                      Scénarios de retraite
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.scenarios.map((scenario: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">{scenario.nom}</h4>
                            <Badge variant="outline">{scenario.montantAnnuel.toLocaleString()} $/an</Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            Valeur viagère : {scenario.montantViager.toLocaleString()} $
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <div className="font-semibold text-green-600">Avantages :</div>
                              <ul className="list-disc list-inside">
                                {scenario.avantages.map((avantage: string, idx: number) => (
                                  <li key={idx}>{avantage}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="font-semibold text-red-600">Inconvénients :</div>
                              <ul className="list-disc list-inside">
                                {scenario.inconvenients.map((inconvenient: string, idx: number) => (
                                  <li key={idx}>{inconvenient}</li>
                                ))}
                              </ul>
                            </div>
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
                        Recommandations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {results.recommandations.map((recommandation: any, index: number) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-blue-800">{recommandation.titre}</h4>
                            <p className="text-sm text-gray-700 mb-2">{recommandation.description}</p>
                            <div className="text-xs text-gray-600">
                              <strong>Impact :</strong> {recommandation.impact}
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
