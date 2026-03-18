import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import GuidedPageIntro from '@/components/ui/GuidedPageIntro';
import NextStepPanel from '@/components/ui/NextStepPanel';
import { Calculator, TrendingDown, PieChart, Target, Info, DollarSign } from 'lucide-react';

interface TaxOptimizationData {
  currentAge: number;
  retirementAge: number;
  currentIncome: number;
  rrspValue: number;
  ferrValue: number;
  celiValue: number;
  nonRegisteredValue: number;
  pensionIncome: number;
  rrqCppIncome: number;
  svIncome: number;
  marginalTaxRate: number;
  province: 'QC' | 'ON' | 'BC' | 'AB' | 'SK' | 'MB' | 'NB' | 'NS' | 'PE' | 'NL' | 'YT' | 'NT' | 'NU';
  hasSpouse: boolean;
  spouseIncome: number;
}

interface TaxOptimizationStrategy {
  strategy: string;
  description: string;
  potentialSavings: number;
  complexity: 'low' | 'medium' | 'high';
  timeline: 'immediate' | 'short-term' | 'long-term';
  governmentProgram?: string;
}

interface OptimizationResult {
  currentTaxBurden: number;
  optimizedTaxBurden: number;
  totalSavings: number;
  strategies: TaxOptimizationStrategy[];
  withdrawalSequence: Array<{
    source: string;
    amount: number;
    taxImpact: number;
    netAmount: number;
    reasoning: string;
  }>;
  incomeSplittingOpportunities: Array<{
    type: string;
    maxAmount: number;
    savings: number;
    eligibilityAge: number;
  }>;
}

const MultiSourceTaxOptimizationModule: React.FC = () => {
  const [data, setData] = useState<TaxOptimizationData>({
    currentAge: 60,
    retirementAge: 65,
    currentIncome: 80000,
    rrspValue: 400000,
    ferrValue: 0,
    celiValue: 100000,
    nonRegisteredValue: 150000,
    pensionIncome: 30000,
    rrqCppIncome: 15000,
    svIncome: 8500,
    marginalTaxRate: 37.1,
    province: 'QC',
    hasSpouse: false,
    spouseIncome: 0
  });

  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calcul de l'optimisation fiscale selon les rÃ¨gles gouvernementales
  const calculateTaxOptimization = useCallback(() => {
    setIsCalculating(true);
    
    const totalRetirementIncome = data.pensionIncome + data.rrqCppIncome + data.svIncome;
    const totalAssets = data.rrspValue + data.ferrValue + data.celiValue + data.nonRegisteredValue;
    
    // Pistes simples d'optimisation basÃ©es sur les rÃ¨gles gouvernementales
    const strategies: TaxOptimizationStrategy[] = [];
    
    // 1. Fractionnement de revenu de pension (65 ans+)
    if (data.hasSpouse && data.currentAge >= 65) {
      const maxSplittableIncome = Math.min(totalRetirementIncome * 0.5, 
        Math.abs(data.currentIncome - data.spouseIncome) * 0.5);
      const potentialSavings = maxSplittableIncome * 0.15;
      
      strategies.push({
        strategy: 'Fractionnement de Revenu de Pension',
        description: 'TransfÃ©rez jusqu\'Ã  50% de votre revenu de pension admissible Ã  votre conjoint pour rÃ©duire l\'impÃ´t total du couple.',
        potentialSavings,
        complexity: 'low',
        timeline: 'immediate',
        governmentProgram: 'Loi de l\'impÃ´t sur le revenu - Article 60.03'
      });
    }
    
    // 2. Report des prestations RRQ/RPC
    if (data.currentAge < 70) {
      const delayYears = Math.min(5, 70 - data.currentAge);
      const bonification = delayYears * 0.7 * 12;
      const additionalIncome = data.rrqCppIncome * (bonification / 100);
      const potentialSavings = additionalIncome * 0.25 * 15;
      
      strategies.push({
        strategy: 'Report des Prestations RRQ/RPC',
        description: `Reporter vos prestations jusqu'Ã  70 ans augmente votre rente de ${bonification.toFixed(1)}% Ã  vie.`,
        potentialSavings,
        complexity: 'low',
        timeline: 'long-term',
        governmentProgram: 'RÃ©gime de rentes du QuÃ©bec / RÃ©gime de pensions du Canada'
      });
    }
    
    // 3. Optimisation de la sÃ©quence de retrait
    if (totalAssets > 100000) {
      const celiFirst = data.celiValue * 0.05;
      const taxSavings = celiFirst * (data.marginalTaxRate / 100);
      
      strategies.push({
        strategy: 'SÃ©quence de Retrait OptimisÃ©e',
        description: 'Retirez d\'abord du CELI, puis des comptes non-enregistrÃ©s, ensuite du REER/FERR pour minimiser l\'impÃ´t.',
        potentialSavings: taxSavings * 10,
        complexity: 'medium',
        timeline: 'immediate',
        governmentProgram: 'StratÃ©gie recommandÃ©e par l\'ARC'
      });
    }
    
    // Calcul de la sÃ©quence de retrait optimale
    const withdrawalSequence = [
      {
        source: 'CELI',
        amount: data.celiValue * 0.05,
        taxImpact: 0,
        netAmount: data.celiValue * 0.05,
        reasoning: 'Aucun impÃ´t, n\'affecte pas les prestations gouvernementales'
      },
      {
        source: 'Comptes Non-EnregistrÃ©s',
        amount: data.nonRegisteredValue * 0.04,
        taxImpact: data.nonRegisteredValue * 0.04 * 0.5 * (data.marginalTaxRate / 100),
        netAmount: data.nonRegisteredValue * 0.04 * (1 - 0.5 * (data.marginalTaxRate / 100)),
        reasoning: 'Gains en capital imposÃ©s Ã  50%, plus avantageux que le revenu ordinaire'
      },
      {
        source: 'FERR (Minimum Obligatoire)',
        amount: data.ferrValue * 0.0528,
        taxImpact: data.ferrValue * 0.0528 * (data.marginalTaxRate / 100),
        netAmount: data.ferrValue * 0.0528 * (1 - data.marginalTaxRate / 100),
        reasoning: 'Retrait minimum obligatoire, imposÃ© comme revenu ordinaire'
      }
    ];
    
    // OpportunitÃ©s de fractionnement de revenu
    const incomeSplittingOpportunities = [];
    
    if (data.hasSpouse) {
      incomeSplittingOpportunities.push({
        type: 'Revenu de Pension',
        maxAmount: totalRetirementIncome * 0.5,
        savings: Math.abs(data.currentIncome - data.spouseIncome) * 0.1,
        eligibilityAge: 65
      });
      
      if (data.currentAge < 71) {
        incomeSplittingOpportunities.push({
          type: 'REER Conjoint',
          maxAmount: 33810,
          savings: 33810 * (data.marginalTaxRate / 100) * 0.3,
          eligibilityAge: data.currentAge
        });
      }
    }
    
    const currentTaxBurden = totalRetirementIncome * (data.marginalTaxRate / 100);
    const totalPotentialSavings = strategies.reduce((sum, s) => sum + s.potentialSavings, 0);
    const optimizedTaxBurden = currentTaxBurden - totalPotentialSavings;
    
    setOptimization({
      currentTaxBurden,
      optimizedTaxBurden: Math.max(0, optimizedTaxBurden),
      totalSavings: totalPotentialSavings,
      strategies: strategies.sort((a, b) => b.potentialSavings - a.potentialSavings),
      withdrawalSequence,
      incomeSplittingOpportunities
    });
    
    setIsCalculating(false);
  }, [data]);

  const handleInputChange = (field: keyof TaxOptimizationData, value: string | boolean) => {
    if (typeof value === 'boolean') {
      setData(prev => ({ ...prev, [field]: value }));
    } else {
      const numValue = parseFloat(value) || 0;
      setData(prev => ({ ...prev, [field]: numValue }));
    }
  };

  const handleSelectChange = (field: keyof TaxOptimizationData, value: string) => {
    setData(prev => ({ ...prev, [field]: value as any }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('$', '').trim() + ' $';
  };

  const getComplexityColor = (complexity: string): string => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimelineColor = (timeline: string): string => {
    switch (timeline) {
      case 'immediate': return 'bg-blue-100 text-blue-800';
      case 'short-term': return 'bg-purple-100 text-purple-800';
      case 'long-term': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <GuidedPageIntro
        eyebrow="ImpÃ´t Ã  la retraite"
        title="Calculateur pour payer moins d’impôt à la retraite"
        description="Cette page compare vos revenus de pension, vos retraits REER ou FERR, votre CELI et vos placements non enregistrés. Le but est de vous montrer dans quel ordre retirer votre argent pour éviter de payer trop d’impôt."
        bullets={[
          'Entrez dâ€™abord vos montants de revenus et vos soldes principaux.',
          'Lancez ensuite le calcul pour voir les stratÃ©gies les plus utiles.',
          'Gardez surtout les pistes simples Ã  discuter avec votre planificateur.',
        ]}
        primaryLink={{ label: 'PrÃ©parer mon dossier', href: '/mon-dossier' }}
        secondaryLink={{ label: 'Voir les outils fiscaux', href: '/outils#impots' }}
      />

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <TrendingDown className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Payer moins d'impôt à la retraite
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Voyez dans quel ordre retirer vos revenus de retraite pour éviter de payer plus d'impôt que nécessaire.
        </p>
        
        <Alert className="max-w-2xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Idée clé :</strong> Le même montant d'argent peut avoir un effet fiscal très différent selon qu'il vient d'un REER, d'un FERR, d'un CELI ou d'un compte non enregistré.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Mes chiffres
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Pistes simples
          </TabsTrigger>
          <TabsTrigger value="sequence" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Ordre des retraits
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            À retenir
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Vos revenus et vos comptes
                </CardTitle>
              <CardDescription>
                Entrez vos revenus et vos soldes principaux pour faire ressortir les pistes les plus utiles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Vos renseignements</h4>
                  
                  <div>
                    <Label htmlFor="currentAge">Ã‚ge Actuel</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={data.currentAge || ''}
                      onChange={(e) => handleInputChange('currentAge', e.target.value)}
                      placeholder="Ex: 60"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="retirementAge">Ã‚ge de Retraite</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      value={data.retirementAge || ''}
                      onChange={(e) => handleInputChange('retirementAge', e.target.value)}
                      placeholder="Ex: 65"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="province">Province</Label>
                    <select
                      id="province"
                      value={data.province}
                      onChange={(e) => handleSelectChange('province', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="QC">QuÃ©bec</option>
                      <option value="ON">Ontario</option>
                      <option value="BC">Colombie-Britannique</option>
                      <option value="AB">Alberta</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasSpouse"
                      checked={data.hasSpouse}
                      onChange={(e) => handleInputChange('hasSpouse', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="hasSpouse">J'ai un conjoint</Label>
                  </div>
                  
                  {data.hasSpouse && (
                    <div>
                      <Label htmlFor="spouseIncome">Revenu du Conjoint ($/an)</Label>
                      <Input
                        id="spouseIncome"
                        type="number"
                        value={data.spouseIncome || ''}
                        onChange={(e) => handleInputChange('spouseIncome', e.target.value)}
                        placeholder="Ex: 50 000"
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Vos comptes et revenus</h4>
                  
                  <div>
                    <Label htmlFor="rrspValue">Valeur REER ($)</Label>
                    <Input
                      id="rrspValue"
                      type="number"
                      value={data.rrspValue || ''}
                      onChange={(e) => handleInputChange('rrspValue', e.target.value)}
                      placeholder="Ex: 400 000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="celiValue">Valeur CELI ($)</Label>
                    <Input
                      id="celiValue"
                      type="number"
                      value={data.celiValue || ''}
                      onChange={(e) => handleInputChange('celiValue', e.target.value)}
                      placeholder="Ex: 100 000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pensionIncome">Revenu de Pension ($/an)</Label>
                    <Input
                      id="pensionIncome"
                      type="number"
                      value={data.pensionIncome || ''}
                      onChange={(e) => handleInputChange('pensionIncome', e.target.value)}
                      placeholder="Ex: 30 000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="rrqCppIncome">RRQ/RPC EstimÃ© ($/an)</Label>
                    <Input
                      id="rrqCppIncome"
                      type="number"
                      value={data.rrqCppIncome || ''}
                      onChange={(e) => handleInputChange('rrqCppIncome', e.target.value)}
                      placeholder="Ex: 15 000"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={calculateTaxOptimization}
                disabled={isCalculating}
                className="w-full"
                size="lg"
              >
                {isCalculating ? 'Analyse en cours...' : 'Analyser l\'Optimisation Fiscale'}
              </Button>
            </CardContent>
          </Card>

          {optimization && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  RÃ©sultats de l'Optimisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(optimization.currentTaxBurden)}
                    </div>
                    <div className="text-sm text-gray-600">Fardeau Fiscal Actuel</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(optimization.optimizedTaxBurden)}
                    </div>
                    <div className="text-sm text-gray-600">Fardeau Fiscal OptimisÃ©</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(optimization.totalSavings)}
                    </div>
                    <div className="text-sm text-gray-600">Ã‰conomies Totales</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          {optimization && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Pistes pour réduire votre impôt</h3>
              
              {optimization.strategies.map((strategy, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{strategy.strategy}</CardTitle>
                    <CardDescription>{strategy.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Badge className={getComplexityColor(strategy.complexity)}>
                          {strategy.complexity === 'low' ? 'Faible' : 
                           strategy.complexity === 'medium' ? 'Moyenne' : 'Ã‰levÃ©e'}
                        </Badge>
                        <Badge className={getTimelineColor(strategy.timeline)}>
                          {strategy.timeline === 'immediate' ? 'ImmÃ©diat' :
                           strategy.timeline === 'short-term' ? 'Court terme' : 'Long terme'}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(strategy.potentialSavings)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sequence" className="space-y-6">
          {optimization && (
            <Card>
              <CardHeader>
                <CardTitle>SÃ©quence de Retrait Optimale</CardTitle>
                <CardDescription>
                  Ordre recommandÃ© pour minimiser l'impact fiscal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimization.withdrawalSequence.map((withdrawal, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{index + 1}. {withdrawal.source}</h4>
                        <Badge variant="outline">
                          Net: {formatCurrency(withdrawal.netAmount)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{withdrawal.reasoning}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        Montant: {formatCurrency(withdrawal.amount)} | 
                        ImpÃ´t: {formatCurrency(withdrawal.taxImpact)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>À retenir</CardTitle>
              <CardDescription>
                Les repères simples à garder en tête avant de parler stratégie avec votre planificateur.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Règles utiles</h4>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium">Fractionnement de Revenu de Pension</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Ã€ partir de 65 ans, vous pouvez transfÃ©rer jusqu'Ã  50% de votre revenu de pension 
                    admissible Ã  votre conjoint pour rÃ©duire l'impÃ´t total du couple.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium">Report des Prestations RRQ/RPC</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Reporter vos prestations aprÃ¨s 65 ans les augmente de 0,7% par mois, 
                    soit 8,4% par annÃ©e jusqu'Ã  70 ans.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium">CrÃ©dit d'ImpÃ´t pour Revenu de Pension</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    CrÃ©dit de 2 000$ sur le revenu de pension admissible, disponible dÃ¨s 65 ans 
                    ou en cas de dÃ©cÃ¨s du conjoint.
                  </p>
                </div>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>À retenir :</strong> Le but n'est pas d'appliquer une stratégie compliquée. Le plus utile est souvent d'arriver avec 2 ou 3 pistes claires à valider avec votre planificateur.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <NextStepPanel
        title="Prochaine Ã©tape"
        text="Gardez les 2 ou 3 stratÃ©gies les plus simples et ajoutez-les Ã  votre dossier. Câ€™est souvent suffisant pour avoir une discussion beaucoup plus productive avec votre planificateur."
        primaryLabel="PrÃ©parer mon dossier"
        primaryHref="/mon-dossier"
        secondaryLabel="Voir les revenus de retraite"
        secondaryHref="/outils#revenus"
      />
      <p className="text-sm leading-6" style={{ color: '#64748b' }}>
        Ces outils sont fournis Ã  titre Ã©ducatif uniquement et ne constituent pas des conseils financiers, fiscaux ou juridiques. Les projections sont basÃ©es sur des hypothÃ¨ses et ne garantissent pas les rÃ©sultats futurs. Consultez un planificateur financier agrÃ©Ã© pour des conseils adaptÃ©s Ã  votre situation.
      </p>
    </div>
  );
};

export default MultiSourceTaxOptimizationModule;


