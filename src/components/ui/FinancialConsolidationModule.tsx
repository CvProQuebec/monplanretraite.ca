import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Layers, TrendingUp, Target, Info, Building, DollarSign } from 'lucide-react';

interface ConsolidationAccount {
  id: string;
  institution: string;
  accountType: 'REER' | 'FERR' | 'CELI' | 'Non-enregistré' | 'Pension';
  balance: number;
  managementFees: number;
  performanceRating: 'excellent' | 'good' | 'fair' | 'poor';
}

interface ConsolidationData {
  accounts: ConsolidationAccount[];
  targetInstitution: string;
  consolidationGoals: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  timeHorizon: number;
}

interface ConsolidationAnalysis {
  totalAssets: number;
  currentFees: number;
  projectedFees: number;
  feeSavings: number;
  diversificationScore: number;
  managementComplexity: 'low' | 'medium' | 'high';
  consolidationBenefits: Array<{
    benefit: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    savings?: number;
  }>;
  consolidationRisks: Array<{
    risk: string;
    description: string;
    mitigation: string;
  }>;
  recommendations: string[];
}

const FinancialConsolidationModule: React.FC = () => {
  const [data, setData] = useState<ConsolidationData>({
    accounts: [
      {
        id: '1',
        institution: 'Banque A',
        accountType: 'REER',
        balance: 200000,
        managementFees: 2.5,
        performanceRating: 'good'
      },
      {
        id: '2',
        institution: 'Banque B',
        accountType: 'REER',
        balance: 150000,
        managementFees: 2.8,
        performanceRating: 'fair'
      },
      {
        id: '3',
        institution: 'Caisse C',
        accountType: 'CELI',
        balance: 75000,
        managementFees: 1.8,
        performanceRating: 'excellent'
      }
    ],
    targetInstitution: '',
    consolidationGoals: [],
    riskTolerance: 'moderate',
    timeHorizon: 10
  });

  const [analysis, setAnalysis] = useState<ConsolidationAnalysis | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Analyse de consolidation selon les meilleures pratiques
  const analyzeConsolidation = useCallback(() => {
    setIsCalculating(true);
    
    const totalAssets = data.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const currentFees = data.accounts.reduce((sum, acc) => sum + (acc.balance * acc.managementFees / 100), 0);
    
    // Estimation des frais après consolidation (généralement plus bas)
    const averageConsolidatedFee = 2.0; // Frais typiques après consolidation
    const projectedFees = totalAssets * (averageConsolidatedFee / 100);
    const feeSavings = currentFees - projectedFees;
    
    // Score de diversification (plus il y a d'institutions, plus c'est complexe)
    const institutionCount = new Set(data.accounts.map(acc => acc.institution)).size;
    const diversificationScore = Math.max(0, 100 - (institutionCount - 1) * 15);
    
    // Complexité de gestion
    let managementComplexity: 'low' | 'medium' | 'high';
    if (institutionCount <= 2) {
      managementComplexity = 'low';
    } else if (institutionCount <= 4) {
      managementComplexity = 'medium';
    } else {
      managementComplexity = 'high';
    }
    
    // Avantages de la consolidation
    const consolidationBenefits = [
      {
        benefit: 'Réduction des Frais de Gestion',
        description: 'Les institutions offrent souvent de meilleurs taux pour des montants plus élevés',
        impact: 'high' as const,
        savings: feeSavings
      },
      {
        benefit: 'Simplification Administrative',
        description: 'Un seul relevé, une seule institution à contacter, gestion simplifiée',
        impact: 'high' as const
      },
      {
        benefit: 'Meilleure Vue d\'Ensemble',
        description: 'Vision globale de votre portefeuille pour de meilleures décisions',
        impact: 'medium' as const
      },
      {
        benefit: 'Optimisation FERR',
        description: 'Un seul FERR facilite la gestion des retraits minimums obligatoires',
        impact: 'high' as const
      },
      {
        benefit: 'Négociation de Conditions',
        description: 'Plus de pouvoir de négociation avec un montant consolidé important',
        impact: 'medium' as const
      }
    ];
    
    // Risques de la consolidation
    const consolidationRisks = [
      {
        risk: 'Concentration du Risque Institutionnel',
        description: 'Tous vos œufs dans le même panier institutionnel',
        mitigation: 'Choisir une institution solide et bien réglementée (banques, caisses établies)'
      },
      {
        risk: 'Perte de Diversification des Produits',
        description: 'Risque de perdre accès à des produits spécialisés',
        mitigation: 'Vérifier que l\'institution cible offre une gamme complète de produits'
      },
      {
        risk: 'Coûts de Transfert',
        description: 'Frais de transfert et pénalités potentielles',
        mitigation: 'Négocier la prise en charge des frais de transfert par la nouvelle institution'
      },
      {
        risk: 'Période de Transition',
        description: 'Interruption temporaire des services pendant les transferts',
        mitigation: 'Planifier les transferts en dehors des périodes critiques'
      }
    ];
    
    // Recommandations basées sur l'analyse
    const recommendations = [];
    
    if (institutionCount > 3) {
      recommendations.push('Consolidation fortement recommandée - trop d\'institutions à gérer');
    }
    
    if (feeSavings > 1000) {
      recommendations.push(`Économies de frais significatives : ${formatCurrency(feeSavings)} par année`);
    }
    
    if (data.accounts.some(acc => acc.performanceRating === 'poor')) {
      recommendations.push('Certains comptes sous-performent - consolidation peut améliorer les rendements');
    }
    
    const hasMultipleFERR = data.accounts.filter(acc => acc.accountType === 'FERR').length > 1;
    if (hasMultipleFERR) {
      recommendations.push('Multiples FERR compliquent la gestion des retraits minimums - consolidez');
    }
    
    const hasMultipleREER = data.accounts.filter(acc => acc.accountType === 'REER').length > 1;
    if (hasMultipleREER) {
      recommendations.push('Multiples REER - consolidation facilite la conversion en FERR à 71 ans');
    }
    
    if (totalAssets > 500000) {
      recommendations.push('Montant élevé - négociez de meilleurs taux et conditions');
    }
    
    recommendations.push('Vérifiez la couverture d\'assurance-dépôts après consolidation');
    recommendations.push('Planifiez les transferts pour éviter les interruptions de service');
    
    setAnalysis({
      totalAssets,
      currentFees,
      projectedFees,
      feeSavings,
      diversificationScore,
      managementComplexity,
      consolidationBenefits,
      consolidationRisks,
      recommendations
    });
    
    setIsCalculating(false);
  }, [data]);

  const addAccount = () => {
    const newAccount: ConsolidationAccount = {
      id: Date.now().toString(),
      institution: '',
      accountType: 'REER',
      balance: 0,
      managementFees: 2.5,
      performanceRating: 'good'
    };
    setData(prev => ({
      ...prev,
      accounts: [...prev.accounts, newAccount]
    }));
  };

  const updateAccount = (id: string, field: keyof ConsolidationAccount, value: string | number) => {
    setData(prev => ({
      ...prev,
      accounts: prev.accounts.map(acc => 
        acc.id === id ? { ...acc, [field]: value } : acc
      )
    }));
  };

  const removeAccount = (id: string) => {
    setData(prev => ({
      ...prev,
      accounts: prev.accounts.filter(acc => acc.id !== id)
    }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('$', '').trim() + ' $';
  };

  const getPerformanceColor = (rating: string): string => {
    switch (rating) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Layers className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Consolidation Financière
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Analysez vos comptes dispersés et optimisez votre gestion financière 
          en consolidant vos actifs selon les meilleures pratiques.
        </p>
        
        <Alert className="max-w-2xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Conseil d'Expert :</strong> La consolidation peut réduire vos frais de 
            gestion de 0,5% à 1,5% annuellement et simplifier grandement votre gestion.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Mes Comptes
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Analyse
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Avantages
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Éducation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Vos Comptes Actuels
              </CardTitle>
              <CardDescription>
                Ajoutez tous vos comptes d'épargne et de retraite pour l'analyse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {data.accounts.map((account, index) => (
                  <div key={account.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Compte {index + 1}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAccount(account.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label>Institution</Label>
                        <Input
                          value={account.institution}
                          onChange={(e) => updateAccount(account.id, 'institution', e.target.value)}
                          placeholder="Ex: Institution financière, Caisse populaire"
                        />
                      </div>
                      
                      <div>
                        <Label>Type de Compte</Label>
                        <select
                          value={account.accountType}
                          onChange={(e) => updateAccount(account.id, 'accountType', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="REER">REER</option>
                          <option value="FERR">FERR</option>
                          <option value="CELI">CELI</option>
                          <option value="Non-enregistré">Non-enregistré</option>
                          <option value="Pension">Fonds de Pension</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label>Solde ($)</Label>
                        <Input
                          type="number"
                          value={account.balance || ''}
                          onChange={(e) => updateAccount(account.id, 'balance', parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 200 000"
                        />
                      </div>
                      
                      <div>
                        <Label>Frais de Gestion (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={account.managementFees || ''}
                          onChange={(e) => updateAccount(account.id, 'managementFees', parseFloat(e.target.value) || 0)}
                          placeholder="Ex: 2.5"
                        />
                      </div>
                      
                      <div>
                        <Label>Performance</Label>
                        <select
                          value={account.performanceRating}
                          onChange={(e) => updateAccount(account.id, 'performanceRating', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="excellent">Excellente</option>
                          <option value="good">Bonne</option>
                          <option value="fair">Moyenne</option>
                          <option value="poor">Pauvre</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <Badge className={`${getPerformanceColor(account.performanceRating)} px-3 py-1`}>
                          {formatCurrency(account.balance)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button onClick={addAccount} variant="outline" className="w-full">
                  Ajouter un Compte
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="targetInstitution">Institution Cible (optionnel)</Label>
                  <Input
                    id="targetInstitution"
                    value={data.targetInstitution}
                    onChange={(e) => setData(prev => ({ ...prev, targetInstitution: e.target.value }))}
                    placeholder="Ex: Institution financière, Caisse populaire"
                  />
                </div>
                
                <div>
                  <Label htmlFor="timeHorizon">Horizon de Placement (années)</Label>
                  <Input
                    id="timeHorizon"
                    type="number"
                    value={data.timeHorizon || ''}
                    onChange={(e) => setData(prev => ({ ...prev, timeHorizon: parseFloat(e.target.value) || 0 }))}
                    placeholder="Ex: 10"
                  />
                </div>
              </div>
              
              <Button 
                onClick={analyzeConsolidation}
                disabled={isCalculating || data.accounts.length === 0}
                className="w-full"
                size="lg"
              >
                {isCalculating ? 'Analyse en cours...' : 'Analyser la Consolidation'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {analysis && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Analyse Financière
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(analysis.totalAssets)}
                      </div>
                      <div className="text-sm text-gray-600">Total des Actifs</div>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(analysis.currentFees)}
                      </div>
                      <div className="text-sm text-gray-600">Frais Actuels/An</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(analysis.projectedFees)}
                      </div>
                      <div className="text-sm text-gray-600">Frais Projetés/An</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(analysis.feeSavings)}
                      </div>
                      <div className="text-sm text-gray-600">Économies/An</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {analysis.diversificationScore}/100
                      </div>
                      <div className="text-sm text-gray-600">Score de Simplicité</div>
                    </div>
                    
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {analysis.managementComplexity === 'low' ? 'Faible' :
                         analysis.managementComplexity === 'medium' ? 'Moyenne' : 'Élevée'}
                      </div>
                      <div className="text-sm text-gray-600">Complexité de Gestion</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(analysis.feeSavings * 10)}
                    </div>
                    <div className="text-sm text-gray-600">Économies sur 10 ans</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommandations Personnalisées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          {analysis && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Avantages de la Consolidation</CardTitle>
                  <CardDescription>
                    Bénéfices potentiels de regrouper vos comptes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.consolidationBenefits.map((benefit, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{benefit.benefit}</h4>
                          <div className="flex gap-2">
                            <Badge className={getImpactColor(benefit.impact)}>
                              Impact {benefit.impact === 'high' ? 'Élevé' : 
                                     benefit.impact === 'medium' ? 'Moyen' : 'Faible'}
                            </Badge>
                            {benefit.savings && (
                              <Badge variant="outline">
                                {formatCurrency(benefit.savings)}/an
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Risques et Mitigations</CardTitle>
                  <CardDescription>
                    Risques potentiels et comment les gérer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.consolidationRisks.map((risk, index) => (
                      <div key={index} className="p-4 border-l-4 border-red-500 bg-red-50">
                        <h4 className="font-semibold text-red-800">{risk.risk}</h4>
                        <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                        <div className="mt-2 p-2 bg-green-50 rounded">
                          <p className="text-sm text-green-800">
                            <strong>Mitigation :</strong> {risk.mitigation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Éducation : Consolidation Financière</CardTitle>
              <CardDescription>
                Comprendre les enjeux de la consolidation de vos actifs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Avantages de la Consolidation</h4>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium">Réduction des Frais</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Les institutions offrent souvent de meilleurs taux pour des montants plus élevés. 
                    Une réduction de 0,5% des frais sur 500 000$ représente 2 500$ d'économies annuelles.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium">Gestion Simplifiée</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Un seul relevé, une seule institution à contacter, une vue d'ensemble claire 
                    de votre situation financière.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium">Optimisation FERR</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Avoir un seul FERR simplifie grandement la gestion des retraits minimums 
                    obligatoires à partir de 72 ans.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Considérations Importantes</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-orange-600">Assurance-Dépôts</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      SADC : 100 000$ par institution. AMF (Québec) : 100 000$ par institution. 
                      Vérifiez la couverture après consolidation.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-orange-600">Frais de Transfert</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Les transferts peuvent coûter 100-300$ par compte. Négociez la prise 
                      en charge par la nouvelle institution.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-orange-600">Gamme de Produits</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Assurez-vous que l'institution cible offre tous les produits 
                      nécessaires à votre stratégie de placement.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-orange-600">Service Client</h5>
                    <p className="text-sm text-gray-600 mt-2">
                      Évaluez la qualité du service client et l'accessibilité 
                      des conseillers de l'institution cible.
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Conseil Important :</strong> La consolidation n'est pas toujours 
                  la meilleure solution. Évaluez vos besoins spécifiques et consultez un 
                  planificateur financier avant de prendre une décision.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialConsolidationModule;
