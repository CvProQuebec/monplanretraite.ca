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
import { useLanguage } from '../hooks/useLanguage';

interface RREGOPAnalysisSectionProps {
  userPlan: 'free' | 'professional' | 'ultimate';
}

export default function RREGOPAnalysisSection({ userPlan }: RREGOPAnalysisSectionProps) {
  const { language } = useLanguage();
  const isFrench = language === 'fr';

  // Traductions
  const t = {
    title: isFrench ? 'Module RREGOP' : 'RREGOP Module',
    subtitle: isFrench 
      ? 'Analysez votre régime de retraite des employés du gouvernement et des organismes publics'
      : 'Analyze your retirement plan for government and public agency employees',
    rregopData: isFrench ? 'Données RREGOP' : 'RREGOP Data',
    dataDescription: isFrench 
      ? 'Saisissez vos informations de service gouvernemental'
      : 'Enter your government service information',
    regimeType: isFrench ? 'Type de régime' : 'Scheme type',
    eligibleYears: isFrench ? 'Années de service admissibles' : 'Eligible years of service',
    calculationYears: isFrench ? 'Années de service pour calcul' : 'Years of service for calculation',
    currentSalary: isFrench ? 'Salaire actuel' : 'Current salary',
    retirementAge: isFrench ? 'Âge de retraite souhaité' : 'Desired retirement age',
    survivorOption: isFrench ? 'Option survivant' : 'Survivor option',
    calculate: isFrench ? 'Calculer ma rente RREGOP' : 'Calculate my RREGOP pension',
    calculating: isFrench ? 'Calcul en cours...' : 'Calculating...',
    results: isFrench ? 'Résultats du calcul' : 'Calculation Results',
    annualPension: isFrench ? 'Rente annuelle' : 'Annual pension',
    monthlyPension: isFrench ? 'Rente mensuelle' : 'Monthly pension',
    earlyRetirementPenalty: isFrench ? 'Pénalité de' : 'Penalty of',
    forEarlyRetirement: isFrench ? 'pour retraite anticipée' : 'for early retirement',
    retirementScenarios: isFrench ? 'Scénarios de retraite' : 'Retirement Scenarios',
    lifetimeValue: isFrench ? 'Valeur viagère :' : 'Lifetime value:',
    advantages: isFrench ? 'Avantages :' : 'Advantages:',
    disadvantages: isFrench ? 'Inconvénients :' : 'Disadvantages:',
    recommendations: isFrench ? 'Recommandations' : 'Recommendations',
    impact: isFrench ? 'Impact :' : 'Impact:',
    moreYearsOfFreedom: isFrench ? 'Plus d\'années de liberté' : 'More years of freedom',
    penalty18: isFrench ? 'Pénalité de 18 %' : '18% penalty',
    rrqCoordination: isFrench ? 'Coordination RRQ à 65 ans' : 'RRQ coordination at 65',
    fullPensionAvailable: isFrench ? 'Pleine rente disponible' : 'Full pension available',
    noPenalty: isFrench ? 'Aucune pénalité' : 'No penalty',
    noRRQCoordination: isFrench ? 'Pas de coordination RRQ' : 'No RRQ coordination',
    fewerYearsOfFreedom: isFrench ? 'Moins d\'années de liberté' : 'Fewer years of freedom',
    retirementAgeOptimization: isFrench ? 'Optimisation de l\'âge de retraite' : 'Retirement Age Optimization',
    retirementAgeDescription: isFrench 
      ? 'Considérez reporter votre retraite à 61 ans pour éviter les pénalités'
      : 'Consider postponing your retirement to age 61 to avoid penalties',
    savings18: isFrench ? 'Économie de 18 % sur votre rente' : '18% savings on your pension',
    highPriority: isFrench ? 'Priorité haute' : 'High Priority',
    analyzeFinancialImpact: isFrench ? 'Analyser l\'impact financier' : 'Analyze financial impact',
    consultRREGOPAdvisor: isFrench ? 'Consulter un conseiller RREGOP' : 'Consult a RREGOP advisor',
    retirementAt58: isFrench ? 'Retraite à 58 ans' : 'Retirement at 58',
    retirementAt61: isFrench ? 'Retraite à 61 ans' : 'Retirement at 61',
    retirementAt65: isFrench ? 'Retraite à 65 ans' : 'Retirement at 65'
  };

  const [rregopData, setRregopData] = useState({
    typeRegime: 'RREGOP',
    anneesServiceAdmissibilite: 0, // Initialisé à 0
    anneesServiceCalcul: 0, // Initialisé à 0
    pourcentageTempsPlein: 1.0,
    salaireActuel: 0, // Initialisé à 0
    ageRetraite: 0, // Initialisé à 0
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
            titre: t.retirementAgeOptimization,
            description: t.retirementAgeDescription,
            impact: t.savings18,
            priorite: 'haute',
            actions: [t.analyzeFinancialImpact, t.consultRREGOPAdvisor]
          }
        ],
        scenarios: [
          {
            nom: t.retirementAt58,
            ageRetraite: 58,
            montantAnnuel: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul * 0.82),
            montantViager: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul * 0.82 * 27),
            avantages: [t.moreYearsOfFreedom],
            inconvenients: [t.penalty18, t.rrqCoordination]
          },
          {
            nom: t.retirementAt61,
            ageRetraite: 61,
            montantAnnuel: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul),
            montantViager: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul * 24),
            avantages: [t.fullPensionAvailable, t.noPenalty],
            inconvenients: [t.rrqCoordination]
          },
          {
            nom: t.retirementAt65,
            ageRetraite: 65,
            montantAnnuel: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul),
            montantViager: Math.round(rregopData.salaireActuel * 0.02 * rregopData.anneesServiceCalcul * 20),
            avantages: [t.fullPensionAvailable, t.noPenalty, t.noRRQCoordination],
            inconvenients: [t.fewerYearsOfFreedom]
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
              {t.title}
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de saisie */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <Calculator className="w-6 h-6" />
                {t.rregopData}
              </CardTitle>
              <CardDescription>
                {t.dataDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="typeRegime">{t.regimeType}</Label>
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
                  <Label htmlFor="anneesService">{t.eligibleYears}</Label>
                  <Input
                    id="anneesService"
                    type="number"
                    value={rregopData.anneesServiceAdmissibilite}
                    onChange={(e) => setRregopData(prev => ({ ...prev, anneesServiceAdmissibilite: Number(e.target.value) }))}
                    placeholder="15"
                  />
                </div>

                <div>
                  <Label htmlFor="anneesCalcul">{t.calculationYears}</Label>
                  <Input
                    id="anneesCalcul"
                    type="number"
                    value={rregopData.anneesServiceCalcul}
                    onChange={(e) => setRregopData(prev => ({ ...prev, anneesServiceCalcul: Number(e.target.value) }))}
                    placeholder="15"
                  />
                </div>

                <div>
                  <Label htmlFor="salaireActuel">{t.currentSalary}</Label>
                  <Input
                    id="salaireActuel"
                    type="number"
                    value={rregopData.salaireActuel}
                    onChange={(e) => setRregopData(prev => ({ ...prev, salaireActuel: Number(e.target.value) }))}
                    placeholder="65000"
                  />
                </div>

                <div>
                  <Label htmlFor="ageRetraite">{t.retirementAge}</Label>
                  <Input
                    id="ageRetraite"
                    type="number"
                    value={rregopData.ageRetraite}
                    onChange={(e) => setRregopData(prev => ({ ...prev, ageRetraite: Number(e.target.value) }))}
                    placeholder="61"
                  />
                </div>

                <div>
                  <Label htmlFor="optionSurvivant">{t.survivorOption}</Label>
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
                {isCalculating ? t.calculating : t.calculate}
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
                      {t.results}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {results.montantFinal.toLocaleString()} $
                        </div>
                        <div className="text-sm text-gray-600">{t.annualPension}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(results.montantFinal / 12).toLocaleString()} $
                        </div>
                        <div className="text-sm text-gray-600">{t.monthlyPension}</div>
                      </div>
                    </div>
                    
                    {results.penalites.applicable && (
                      <Alert className="border-orange-200 bg-orange-50">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          {t.earlyRetirementPenalty} {(results.penalites.tauxPenalite * 100).toFixed(1)}% {t.forEarlyRetirement}
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
                      {t.retirementScenarios}
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
                            {t.lifetimeValue} {scenario.montantViager.toLocaleString()} $
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <div className="font-semibold text-green-600">{t.advantages}</div>
                              <ul className="list-disc list-inside">
                                {scenario.avantages.map((avantage: string, idx: number) => (
                                  <li key={idx}>{avantage}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="font-semibold text-red-600">{t.disadvantages}</div>
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
                        {t.recommendations}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {results.recommandations.map((recommandation: any, index: number) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-blue-800">{recommandation.titre}</h4>
                            <p className="text-sm text-gray-700 mb-2">{recommandation.description}</p>
                            <div className="text-xs text-gray-600">
                              <strong>{t.impact}</strong> {recommandation.impact}
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
