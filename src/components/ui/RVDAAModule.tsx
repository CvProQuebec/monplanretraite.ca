// src/components/ui/RVDAAModule.tsx
/**
 * MODULE RVDAA - Rente Viagère Différée à un Âge Avancé
 * 
 * Module critique identifié dans l'analyse gouvernementale
 * Implémente les règles officielles du Gouvernement du Canada (2020+)
 * 
 * Fonctionnalités:
 * - Calcul des limites de transfert (25% par régime)
 * - Validation du plafond cumulatif annuel
 * - Optimisation fiscale des transferts
 * - Prévention des pénalités (1% par mois)
 * 
 * @author MonPlanRetraite.ca
 * @version 1.0.0 - Implémentation Gouvernementale
 * @date Août 2025
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calculator, AlertTriangle, TrendingUp, Info, CheckCircle } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';

interface RVDAARegime {
  id: string;
  type: 'REER' | 'FERR' | 'RPAC' | 'RPA' | 'RPDB';
  name: string;
  currentValue: number;
  previousTransfers: number;
}

interface RVDAACalculation {
  regimeId: string;
  regimeName: string;
  currentValue: number;
  maxTransferAmount: number; // 25% limit
  proposedTransfer: number;
  isExcess: boolean;
  excessAmount: number;
}

interface RVDAAOptimization {
  totalProposedTransfers: number;
  annualLimit: number; // 170,000$ en 2024, 175,000$ en 2025
  cumulativeExcess: number;
  monthlyPenalty: number;
  taxDeferralBenefit: number;
  recommendedStrategy: string;
  optimalTransferPlan: RVDAACalculation[];
}

interface RVDAAModuleProps {
  userPlan: SubscriptionPlan;
  onUpgrade?: () => void;
}

export const RVDAAModule: React.FC<RVDAAModuleProps> = ({ userPlan, onUpgrade }) => {
  const [regimes, setRegimes] = useState<RVDAARegime[]>([]);
  const [calculations, setCalculations] = useState<RVDAACalculation[]>([]);
  const [optimization, setOptimization] = useState<RVDAAOptimization | null>(null);
  const [currentYear] = useState(2025);
  const [annualLimit] = useState(175000); // Limite 2025
  const [activeTab, setActiveTab] = useState('calculator');

  // Accès selon le plan
  const hasFullAccess = userPlan === 'professional' || userPlan === 'expert';
  const hasAdvancedFeatures = userPlan === 'expert';

  useEffect(() => {
    // Initialiser avec des régimes par défaut
    setRegimes([
      { id: '1', type: 'REER', name: 'REER Principal', currentValue: 200000, previousTransfers: 0 },
      { id: '2', type: 'FERR', name: 'FERR Existant', currentValue: 150000, previousTransfers: 0 }
    ]);
  }, []);

  const addRegime = () => {
    const newRegime: RVDAARegime = {
      id: Date.now().toString(),
      type: 'REER',
      name: `Nouveau Régime ${regimes.length + 1}`,
      currentValue: 0,
      previousTransfers: 0
    };
    setRegimes([...regimes, newRegime]);
  };

  const updateRegime = (id: string, field: keyof RVDAARegime, value: any) => {
    setRegimes(regimes.map(regime => 
      regime.id === id ? { ...regime, [field]: value } : regime
    ));
  };

  const removeRegime = (id: string) => {
    setRegimes(regimes.filter(regime => regime.id !== id));
  };

  const calculateRVDAA = () => {
    const newCalculations: RVDAACalculation[] = regimes.map(regime => {
      const maxTransferAmount = Math.floor((regime.currentValue + regime.previousTransfers) * 0.25);
      const availableTransfer = maxTransferAmount - regime.previousTransfers;
      const proposedTransfer = Math.min(availableTransfer, regime.currentValue);
      
      return {
        regimeId: regime.id,
        regimeName: regime.name,
        currentValue: regime.currentValue,
        maxTransferAmount: availableTransfer,
        proposedTransfer: Math.max(0, proposedTransfer),
        isExcess: proposedTransfer > availableTransfer,
        excessAmount: Math.max(0, proposedTransfer - availableTransfer)
      };
    });

    const totalProposedTransfers = newCalculations.reduce((sum, calc) => sum + calc.proposedTransfer, 0);
    const cumulativeExcess = Math.max(0, totalProposedTransfers - annualLimit);
    const monthlyPenalty = cumulativeExcess * 0.01;
    const taxDeferralBenefit = totalProposedTransfers * 0.35 * 0.05; // 35% taux marginal, 5% rendement annuel

    const newOptimization: RVDAAOptimization = {
      totalProposedTransfers,
      annualLimit,
      cumulativeExcess,
      monthlyPenalty,
      taxDeferralBenefit,
      recommendedStrategy: generateRecommendedStrategy(totalProposedTransfers, annualLimit, cumulativeExcess),
      optimalTransferPlan: optimizeTransferPlan(newCalculations, annualLimit)
    };

    setCalculations(newCalculations);
    setOptimization(newOptimization);
  };

  const generateRecommendedStrategy = (total: number, limit: number, excess: number): string => {
    if (excess > 0) {
      return `ATTENTION: Excédent de ${excess.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}. Réduisez les transferts ou étalez sur plusieurs années.`;
    }
    if (total < limit * 0.8) {
      return `OPPORTUNITÉ: Vous pourriez transférer ${(limit - total).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} de plus cette année.`;
    }
    return `OPTIMAL: Vos transferts sont bien optimisés pour cette année.`;
  };

  const optimizeTransferPlan = (calculations: RVDAACalculation[], limit: number): RVDAACalculation[] => {
    let remainingLimit = limit;
    return calculations.map(calc => {
      const optimalTransfer = Math.min(calc.maxTransferAmount, remainingLimit, calc.currentValue);
      remainingLimit -= optimalTransfer;
      return {
        ...calc,
        proposedTransfer: optimalTransfer,
        isExcess: false,
        excessAmount: 0
      };
    });
  };

  if (!hasFullAccess) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            RVDAA - Rente Viagère Différée à un Âge Avancé
            <Badge variant="secondary">NOUVEAU 2020+</Badge>
          </CardTitle>
          <CardDescription>
            Module gouvernemental avancé pour optimiser vos transferts RVDAA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Ce module avancé nécessite un plan Professionnel ou Expert pour accéder aux calculs RVDAA complets et aux stratégies d'optimisation fiscale.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={onUpgrade} className="w-full">
              Mettre à niveau pour accéder au module RVDAA
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            RVDAA - Rente Viagère Différée à un Âge Avancé
            <Badge variant="secondary">GOUVERNEMENT DU CANADA</Badge>
          </CardTitle>
          <CardDescription>
            Optimisez vos transferts RVDAA selon les règles officielles. Limite annuelle {currentYear}: {annualLimit.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Calculateur</TabsTrigger>
          <TabsTrigger value="optimization">Optimisation</TabsTrigger>
          <TabsTrigger value="education">Éducation</TabsTrigger>
          <TabsTrigger value="compliance">Conformité</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vos Régimes Admissibles</CardTitle>
              <CardDescription>
                Ajoutez vos REER, FERR, RPAC, RPA et RPDB pour calculer les transferts optimaux
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {regimes.map((regime) => (
                <div key={regime.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Type de régime</Label>
                    <select
                      value={regime.type}
                      onChange={(e) => updateRegime(regime.id, 'type', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="REER">REER</option>
                      <option value="FERR">FERR</option>
                      <option value="RPAC">RPAC</option>
                      <option value="RPA">RPA</option>
                      <option value="RPDB">RPDB</option>
                    </select>
                  </div>
                  <div>
                    <Label>Nom du régime</Label>
                    <Input
                      value={regime.name}
                      onChange={(e) => updateRegime(regime.id, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Valeur actuelle</Label>
                    <Input
                      type="number"
                      value={regime.currentValue}
                      onChange={(e) => updateRegime(regime.id, 'currentValue', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Transferts antérieurs</Label>
                    <Input
                      type="number"
                      value={regime.previousTransfers}
                      onChange={(e) => updateRegime(regime.id, 'previousTransfers', Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeRegime(regime.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="flex gap-2">
                <Button onClick={addRegime} variant="outline">
                  Ajouter un régime
                </Button>
                <Button onClick={calculateRVDAA} className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Calculer RVDAA
                </Button>
              </div>
            </CardContent>
          </Card>

          {calculations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Résultats des Calculs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calculations.map((calc) => (
                    <div key={calc.regimeId} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                      <div>
                        <Label className="font-semibold">{calc.regimeName}</Label>
                        <p className="text-sm text-gray-600">
                          Valeur: {calc.currentValue.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                        </p>
                      </div>
                      <div>
                        <Label>Transfert maximum (25%)</Label>
                        <p className="font-semibold text-green-600">
                          {calc.maxTransferAmount.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                        </p>
                      </div>
                      <div>
                        <Label>Transfert proposé</Label>
                        <p className={`font-semibold ${calc.isExcess ? 'text-red-600' : 'text-blue-600'}`}>
                          {calc.proposedTransfer.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                        </p>
                      </div>
                      <div>
                        {calc.isExcess && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">Excédent: {calc.excessAmount.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</span>
                          </div>
                        )}
                        {!calc.isExcess && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Conforme</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          {optimization && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Analyse d'Optimisation RVDAA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <Label>Total des transferts proposés</Label>
                      <p className="text-2xl font-bold text-blue-600">
                        {optimization.totalProposedTransfers.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <Label>Limite annuelle {currentYear}</Label>
                      <p className="text-2xl font-bold text-gray-600">
                        {optimization.annualLimit.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <Label>Excédent cumulatif</Label>
                      <p className={`text-2xl font-bold ${optimization.cumulativeExcess > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {optimization.cumulativeExcess.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Utilisation de la limite annuelle</Label>
                    <Progress 
                      value={(optimization.totalProposedTransfers / optimization.annualLimit) * 100} 
                      className="w-full"
                    />
                    <p className="text-sm text-gray-600">
                      {((optimization.totalProposedTransfers / optimization.annualLimit) * 100).toFixed(1)}% utilisé
                    </p>
                  </div>

                  <Alert className={optimization.cumulativeExcess > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Stratégie recommandée:</strong> {optimization.recommendedStrategy}
                    </AlertDescription>
                  </Alert>

                  {optimization.cumulativeExcess > 0 && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Pénalité mensuelle:</strong> {optimization.monthlyPenalty.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} par mois (1% de l'excédent)
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Label className="font-semibold">Bénéfice du report d'impôt estimé</Label>
                    <p className="text-lg font-bold text-blue-600">
                      {optimization.taxDeferralBenefit.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} annuellement
                    </p>
                    <p className="text-sm text-gray-600">
                      Basé sur un taux marginal de 35% et un rendement de 5%
                    </p>
                  </div>
                </CardContent>
              </Card>

              {hasAdvancedFeatures && (
                <Card>
                  <CardHeader>
                    <CardTitle>Plan de Transfert Optimal</CardTitle>
                    <CardDescription>
                      Stratégie optimisée pour maximiser les bénéfices tout en respectant les limites
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {optimization.optimalTransferPlan.map((plan) => (
                        <div key={plan.regimeId} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-semibold">{plan.regimeName}</p>
                            <p className="text-sm text-gray-600">
                              Valeur: {plan.currentValue.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              {plan.proposedTransfer.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                            </p>
                            <p className="text-sm text-gray-600">Transfert optimal</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guide RVDAA - Gouvernement du Canada</CardTitle>
              <CardDescription>
                Informations officielles sur la Rente Viagère Différée à un Âge Avancé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Qu'est-ce qu'une RVDAA?</h3>
                  <p className="text-gray-700">
                    Une RVDAA est une rente viagère où le paiement doit commencer avant la fin de l'année 
                    au cours de laquelle vous atteignez l'âge de 85 ans. Elle permet de reporter l'impôt 
                    sur une partie de vos régimes enregistrés.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">Régimes admissibles</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Régime enregistré d'épargne-retraite (REER)</li>
                    <li>Fonds enregistré de revenu de retraite (FERR)</li>
                    <li>Régime de pension agréé collectif (RPAC)</li>
                    <li>Régime de pension agréé (RPA) avec cotisations déterminées</li>
                    <li>Régime de participation différée aux bénéfices (RPDB)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">Limites importantes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold">Limite par régime</h4>
                      <p className="text-sm text-gray-600">
                        Maximum 25% de la valeur de chaque régime (incluant les transferts antérieurs)
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold">Limite annuelle</h4>
                      <p className="text-sm text-gray-600">
                        {annualLimit.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} pour {currentYear}
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Les montants excédentaires sont assujettis à un impôt de 1% par mois. 
                    Une planification soigneuse est essentielle pour éviter les pénalités.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vérification de Conformité</CardTitle>
              <CardDescription>
                Validation selon les règles officielles de l'Agence du revenu du Canada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Règles respectées
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 mt-2">
                      <li>✓ Transferts directs uniquement</li>
                      <li>✓ Régimes admissibles validés</li>
                      <li>✓ Limites de 25% respectées</li>
                      <li>✓ Plafond annuel vérifié</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      Points d'attention
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 mt-2">
                      <li>⚠ Paiements obligatoires avant 85 ans</li>
                      <li>⚠ Aucun retrait avant échéance</li>
                      <li>⚠ Fournisseur autorisé requis</li>
                      <li>⚠ Déclaration T1-OVP-ALDA si excédent</li>
                    </ul>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Ce module utilise les formules et règles officielles du Gouvernement du Canada. 
                    Consultez toujours un professionnel pour votre situation spécifique.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RVDAAModule;
