import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Alert, AlertDescription } from './alert';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Calculator, TrendingUp, Clock, DollarSign, Users, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';

interface ProgressiveRetirementStrategy {
  name: string;
  description: string;
  ageRange: string;
  benefits: string[];
  considerations: string[];
  governmentPrograms: string[];
  taxImplications: string;
}

interface RetirementPhase {
  phase: string;
  ageRange: string;
  workStatus: string;
  incomeStrategy: string;
  governmentBenefits: string[];
  recommendations: string[];
}

interface ProgressiveRetirementPlan {
  currentAge: number;
  targetFullRetirement: number;
  currentIncome: number;
  desiredRetirementIncome: number;
  phases: RetirementPhase[];
  totalProjectedIncome: number;
  governmentBenefitsOptimization: number;
}

const ProgressiveRetirementModule: React.FC = () => {
  const [currentAge, setCurrentAge] = useState<number>(55);
  const [targetRetirement, setTargetRetirement] = useState<number>(65);
  const [currentIncome, setCurrentIncome] = useState<number>(75000);
  const [desiredRetirementIncome, setDesiredRetirementIncome] = useState<number>(52500);
  const [hasEmployerPension, setHasEmployerPension] = useState<boolean>(false);
  const [reerValue, setReerValue] = useState<number>(200000);
  const [plan, setPlan] = useState<ProgressiveRetirementPlan | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('gradual');

  const progressiveStrategies: ProgressiveRetirementStrategy[] = [
    {
      name: "Retraite graduelle (55-65 ans)",
      description: "Réduction progressive des heures de travail avec optimisation des revenus gouvernementaux",
      ageRange: "55-65 ans",
      benefits: [
        "Transition en douceur vers la retraite",
        "Maintien d'une partie du revenu d'emploi",
        "Optimisation des cotisations REER jusqu'à 71 ans",
        "Report possible du RRQ pour bonification"
      ],
      considerations: [
        "Négociation avec l'employeur nécessaire",
        "Impact sur les prestations d'employeur",
        "Planification fiscale complexe"
      ],
      governmentPrograms: ["RRQ (report possible)", "Assurance-emploi (conditions spéciales)", "REER (cotisations continues)"],
      taxImplications: "Optimisation possible par étalement du revenu sur plusieurs années"
    },
    {
      name: "Pont vers la retraite (60-65 ans)",
      description: "Utilisation de l'épargne personnelle en attendant les prestations gouvernementales complètes",
      ageRange: "60-65 ans",
      benefits: [
        "Accès au RRQ dès 60 ans (réduit)",
        "Utilisation stratégique du CELI",
        "Préservation du REER pour après 65 ans",
        "Évitement de la récupération de la SV"
      ],
      considerations: [
        "RRQ réduit de 36% si pris à 60 ans",
        "Épuisement possible de l'épargne non-enregistrée",
        "Planification minutieuse requise"
      ],
      governmentPrograms: ["RRQ (réduit)", "CELI", "REER (conversion différée)"],
      taxImplications: "Minimisation de l'impôt par utilisation du CELI en premier"
    },
    {
      name: "Retraite différée (65-70 ans)",
      description: "Report de la retraite complète pour maximiser les prestations gouvernementales",
      ageRange: "65-70 ans",
      benefits: [
        "RRQ bonifié de 42% si pris à 70 ans",
        "SV bonifiée de 36% si prise à 70 ans",
        "Cotisations REER jusqu'à 71 ans",
        "Revenus d'emploi supplémentaires"
      ],
      considerations: [
        "Santé et capacité de travail",
        "Risque de changements gouvernementaux",
        "Perte de temps de retraite"
      ],
      governmentPrograms: ["RRQ (bonifié)", "SV (bonifiée)", "REER (cotisations étendues)"],
      taxImplications: "Revenus élevés mais optimisation fiscale possible"
    }
  ];

  const calculateProgressivePlan = (): ProgressiveRetirementPlan => {
    const phases: RetirementPhase[] = [];
    let totalProjectedIncome = 0;
    let governmentOptimization = 0;

    // Phase 1: Pré-retraite (55-60 ans)
    if (currentAge < 60) {
      phases.push({
        phase: "Pré-retraite",
        ageRange: `${currentAge}-60 ans`,
        workStatus: "Temps plein ou réduit",
        incomeStrategy: "Maximiser REER, utiliser CELI pour projets",
        governmentBenefits: ["Aucune prestation de retraite"],
        recommendations: [
          "Cotiser au maximum au REER",
          "Utiliser le CELI pour l'épargne flexible",
          "Planifier la transition avec l'employeur",
          "Évaluer les options de retraite progressive"
        ]
      });
    }

    // Phase 2: Retraite anticipée (60-65 ans)
    phases.push({
      phase: "Retraite anticipée",
      ageRange: "60-65 ans",
      workStatus: selectedStrategy === 'gradual' ? "Temps partiel possible" : "Retraité",
      incomeStrategy: "RRQ réduit + épargne personnelle",
      governmentBenefits: ["RRQ (64% si pris à 60 ans)"],
      recommendations: [
        "Évaluer le coût du RRQ anticipé (-36%)",
        "Utiliser le CELI en priorité",
        "Conserver le REER pour après 65 ans",
        "Considérer un emploi à temps partiel"
      ]
    });

    // Phase 3: Retraite complète (65+ ans)
    phases.push({
      phase: "Retraite complète",
      ageRange: "65 ans et plus",
      workStatus: "Retraité",
      incomeStrategy: "RRQ + SV + FERR + épargne",
      governmentBenefits: ["RRQ (100%)", "SV", "SRG (si admissible)"],
      recommendations: [
        "Convertir REER en FERR avant 72 ans",
        "Optimiser les retraits pour minimiser l'impôt",
        "Utiliser le fractionnement de revenu",
        "Planifier les soins de santé"
      ]
    });

    // Calculs approximatifs
    const rrqMax = 1433; // Montant maximum mensuel RRQ 2024
    const svMax = 728; // Montant maximum mensuel SV 2024
    
    if (selectedStrategy === 'early') {
      // RRQ à 60 ans (réduit de 36%)
      const rrqReduced = rrqMax * 0.64 * 12;
      totalProjectedIncome = rrqReduced + (svMax * 12) + (reerValue * 0.04); // 4% de retrait
      governmentOptimization = rrqMax * 12 * 0.36; // Perte due au retrait anticipé
    } else if (selectedStrategy === 'delayed') {
      // RRQ à 70 ans (bonifié de 42%)
      const rrqBonified = rrqMax * 1.42 * 12;
      const svBonified = svMax * 1.36 * 12;
      totalProjectedIncome = rrqBonified + svBonified + (reerValue * 0.04);
      governmentOptimization = (rrqMax * 1.42 - rrqMax) * 12 + (svMax * 1.36 - svMax) * 12;
    } else {
      // Stratégie normale à 65 ans
      totalProjectedIncome = (rrqMax * 12) + (svMax * 12) + (reerValue * 0.04);
      governmentOptimization = 0;
    }

    return {
      currentAge,
      targetFullRetirement: targetRetirement,
      currentIncome,
      desiredRetirementIncome,
      phases,
      totalProjectedIncome,
      governmentBenefitsOptimization: governmentOptimization
    };
  };

  useEffect(() => {
    setPlan(calculateProgressivePlan());
  }, [currentAge, targetRetirement, currentIncome, selectedStrategy, reerValue]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Stratégies de retraite progressive
          </CardTitle>
          <CardDescription>
            Planifiez votre transition vers la retraite selon les recommandations du Gouvernement du Canada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <BookOpen className="h-4 w-4" />
            <AlertDescription>
              <strong>Expertise gouvernementale :</strong> Module basé sur les guides officiels du Gouvernement du Canada 
              pour optimiser votre transition vers la retraite et maximiser vos prestations.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calculator">Calculateur</TabsTrigger>
              <TabsTrigger value="strategies">Stratégies</TabsTrigger>
              <TabsTrigger value="education">Éducation</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentAge">Âge actuel</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(Number(e.target.value))}
                      min="50"
                      max="70"
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetRetirement">Âge de retraite ciblé</Label>
                    <Input
                      id="targetRetirement"
                      type="number"
                      value={targetRetirement}
                      onChange={(e) => setTargetRetirement(Number(e.target.value))}
                      min="55"
                      max="75"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentIncome">Revenu actuel annuel</Label>
                    <Input
                      id="currentIncome"
                      type="number"
                      value={currentIncome}
                      onChange={(e) => setCurrentIncome(Number(e.target.value))}
                      min="0"
                      step="1000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reerValue">Valeur actuelle REER/FERR</Label>
                    <Input
                      id="reerValue"
                      type="number"
                      value={reerValue}
                      onChange={(e) => setReerValue(Number(e.target.value))}
                      min="0"
                      step="5000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="strategy">Stratégie préférée</Label>
                    <select
                      id="strategy"
                      value={selectedStrategy}
                      onChange={(e) => setSelectedStrategy(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="early">Retraite anticipée (60 ans)</option>
                      <option value="gradual">Retraite graduelle (55-65 ans)</option>
                      <option value="normal">Retraite normale (65 ans)</option>
                      <option value="delayed">Retraite différée (70 ans)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {plan && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Résumé de votre plan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span>Revenu de retraite projeté :</span>
                            <span className="font-semibold">{formatCurrency(plan.totalProjectedIncome)}/an</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taux de remplacement :</span>
                            <span className="font-semibold">
                              {((plan.totalProjectedIncome / currentIncome) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Optimisation gouvernementale :</span>
                            <span className={`font-semibold ${plan.governmentBenefitsOptimization >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {plan.governmentBenefitsOptimization >= 0 ? '+' : ''}{formatCurrency(plan.governmentBenefitsOptimization)}/an
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                          {plan.governmentBenefitsOptimization > 0 
                            ? `Excellente stratégie ! Vous optimisez vos prestations gouvernementales de ${formatCurrency(plan.governmentBenefitsOptimization)} par année.`
                            : plan.governmentBenefitsOptimization < 0
                            ? `Attention : Cette stratégie vous fait perdre ${formatCurrency(Math.abs(plan.governmentBenefitsOptimization))} par année en prestations gouvernementales.`
                            : "Stratégie équilibrée avec prestations gouvernementales standard."
                          }
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              </div>

              {plan && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Phases de votre retraite progressive</h3>
                  <div className="space-y-4">
                    {plan.phases.map((phase, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Badge variant="outline">{phase.phase}</Badge>
                            <span>{phase.ageRange}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <strong>Statut de travail :</strong> {phase.workStatus}
                          </div>
                          <div>
                            <strong>Stratégie de revenus :</strong> {phase.incomeStrategy}
                          </div>
                          <div>
                            <strong>Prestations gouvernementales :</strong>
                            <ul className="list-disc list-inside ml-4">
                              {phase.governmentBenefits.map((benefit, i) => (
                                <li key={i}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <strong>Recommandations :</strong>
                            <ul className="list-disc list-inside ml-4">
                              {phase.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="strategies" className="space-y-4">
              <div className="space-y-4">
                {progressiveStrategies.map((strategy, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {strategy.name}
                      </CardTitle>
                      <CardDescription>{strategy.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Badge variant="outline">{strategy.ageRange}</Badge>
                      </div>

                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">Avantages :</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {strategy.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-700 mb-2">Considérations :</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {strategy.considerations.map((consideration, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                              {consideration}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Programmes gouvernementaux impliqués :</h4>
                        <div className="flex flex-wrap gap-2">
                          {strategy.governmentPrograms.map((program, i) => (
                            <Badge key={i} variant="secondary">{program}</Badge>
                          ))}
                        </div>
                      </div>

                      <Alert>
                        <DollarSign className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Implications fiscales :</strong> {strategy.taxImplications}
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Guide de la retraite progressive - Gouvernement du Canada</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Timing optimal des prestations gouvernementales</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <strong>RRQ à 60 ans :</strong> Réduction de 0,6% par mois (36% de réduction maximale)
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <strong>RRQ à 65 ans :</strong> Montant complet sans réduction ni bonification
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <strong>RRQ à 70 ans :</strong> Bonification de 0,7% par mois (42% de bonification maximale)
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Sécurité de la vieillesse (SV)</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <strong>Âge normal :</strong> 65 ans pour les personnes nées avant 1958
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <strong>Report possible :</strong> Bonification de 0,6% par mois jusqu'à 70 ans (36% maximum)
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <strong>Récupération :</strong> Réduction si revenu net dépasse 90 997$ (2024)
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Stratégies de transition recommandées</h3>
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <strong>Phase 1 (55-60 ans) :</strong> Réduction graduelle des heures, maximisation des cotisations REER
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <strong>Phase 2 (60-65 ans) :</strong> Utilisation stratégique du CELI, évaluation du RRQ anticipé
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <strong>Phase 3 (65+ ans) :</strong> Optimisation complète des prestations, conversion REER en FERR
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <BookOpen className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Conseil d'expert :</strong> La retraite progressive permet d'optimiser vos prestations 
                      gouvernementales tout en maintenant une transition en douceur. Consultez un planificateur financier 
                      pour personnaliser votre stratégie selon votre situation.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressiveRetirementModule;
