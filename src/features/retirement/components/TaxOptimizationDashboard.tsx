import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Calculator, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon,
  AlertTriangle, CheckCircle, Info, Target, ArrowRightLeft, Banknote
} from 'lucide-react';

interface TaxOptimizationDashboardProps {
  calculations: any;
  userData: any;
}

export const TaxOptimizationDashboard: React.FC<TaxOptimizationDashboardProps> = ({
  calculations,
  userData
}) => {
  const [activeTab, setActiveTab] = useState('reer-celi');
  
  return (
    <div className="w-full space-y-6">
      {/* En-tête avec métriques fiscales clés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Économies fiscales REER</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculations.reerCeliOptimization?.impactFiscal?.economieImmediateREER || 0)}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Impact PSV potentiel</div>
                <div className="text-2xl font-bold text-amber-600">
                  {formatCurrency(calculations.reerCeliOptimization?.impactFiscal?.impactPSV || 0)}
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Avantage net REER</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(calculations.reerCeliOptimization?.impactFiscal?.avantageNetREER || 0)}
                </div>
              </div>
              <Calculator className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reer-celi">REER vs CELI</TabsTrigger>
          <TabsTrigger value="withdrawal">Décaissement</TabsTrigger>
          <TabsTrigger value="budget">Budget Retraite</TabsTrigger>
          <TabsTrigger value="estate">Succession</TabsTrigger>
        </TabsList>
        
        {/* Onglet REER vs CELI */}
        <TabsContent value="reer-celi" className="space-y-6">
          <REERCELIAnalysisTab 
            optimization={calculations.reerCeliOptimization}
            fondsSolidarite={calculations.fondsSolidariteAnalysis}
          />
        </TabsContent>
        
        {/* Onglet Stratégie de décaissement */}
        <TabsContent value="withdrawal" className="space-y-6">
          <WithdrawalStrategyTab 
            strategy={calculations.withdrawalStrategy}
            userData={userData}
          />
        </TabsContent>
        
        {/* Onglet Budget retraite */}
        <TabsContent value="budget" className="space-y-6">
          <RetirementBudgetTab 
            budgetAnalysis={calculations.budgetAnalysis}
          />
        </TabsContent>
        
        {/* Onglet Considérations successorales */}
        <TabsContent value="estate" className="space-y-6">
          <EstateConsiderationsTab 
            estateAnalysis={calculations.estateConsiderations}
            userData={userData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ===== COMPOSANTS ONGLETS =====

const REERCELIAnalysisTab: React.FC<any> = ({ optimization, fondsSolidarite }) => {
  return (
    <div className="space-y-6">
      {/* Recommandation principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Stratégie recommandée : {optimization?.recommandation || 'En cours d\'analyse'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Répartition suggérée */}
            <div>
              <h3 className="font-medium mb-3">Répartition optimale de votre épargne</h3>
              <div className="relative w-48 h-48 mx-auto">
                <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                <div 
                  className="absolute inset-0 rounded-full bg-blue-500 transform -rotate-90"
                  style={{ 
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + (optimization?.repartitionSuggeree?.reerPart || 50) * 0.36}% 0%, 50% 50%)` 
                  }}
                ></div>
                <div className="absolute inset-0 rounded-full bg-green-500 transform -rotate-90"
                  style={{ 
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + (optimization?.repartitionSuggeree?.celiPart || 50) * 0.36}% 0%, 50% 50%)` 
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{optimization?.repartitionSuggeree?.reerPart || 50}%</div>
                    <div className="text-sm">REER</div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-2">
                <div className="text-sm text-gray-600">
                  {optimization?.repartitionSuggeree?.justification || 'Équilibre recommandé'}
                </div>
              </div>
            </div>
            
            {/* Raisonnement */}
            <div>
              <h3 className="font-medium mb-3">Pourquoi cette stratégie ?</h3>
              <div className="space-y-2">
                {optimization?.raisonnement?.map((raison: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">{raison}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Impact fiscal détaillé */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse de l'impact fiscal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">
                {formatCurrency(optimization?.impactFiscal?.economieImmediateREER || 0)}
              </div>
              <div className="text-sm text-green-600">Économie immédiate REER</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-700">
                {formatCurrency(optimization?.impactFiscal?.impactFuturREER || 0)}
              </div>
              <div className="text-sm text-blue-600">Impact fiscal futur</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-700">
                {formatCurrency(optimization?.impactFiscal?.avantageNetREER || 0)}
              </div>
              <div className="text-sm text-purple-600">Avantage net REER</div>
            </div>
            
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-lg font-bold text-amber-700">
                {formatCurrency(optimization?.impactFiscal?.impactPSV || 0)}
              </div>
              <div className="text-sm text-amber-600">Impact PSV annuel</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Fonds de solidarité */}
      {fondsSolidarite && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              Analyse des fonds de solidarité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Fondaction vs Fonds FTQ</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Fondaction (10 ans)</span>
                    <span className="font-medium">13.3%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Fonds FTQ (10 ans)</span>
                    <span className="font-medium">13.4%</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    *Rendements incluant les crédits d'impôt de 30%
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Contraintes importantes</h3>
                <div className="space-y-2">
                  {fondsSolidarite?.contraintes?.map((contrainte: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{contrainte}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const WithdrawalStrategyTab: React.FC<any> = ({ strategy, userData }) => {
  return (
    <div className="space-y-6">
      {/* Séquence de décaissement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Séquence de décaissement optimisée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategy?.sequencePhases?.map((phase: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">
                    Phase {index + 1}: {phase.ageDebut}-{phase.ageFin} ans
                  </h3>
                  <Badge variant={phase.impactFiscal === 'OPTIMISE' ? 'default' : 'secondary'}>
                    {phase.impactFiscal}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Sources prioritaires</div>
                    <div className="space-y-1">
                      {phase.sourcesPrioritaires?.map((source: string, i: number) => (
                        <Badge key={i} variant="outline" className="mr-1">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Taux de retrait</div>
                    <div className="text-lg font-medium">{(phase.tauxRetrait * 100).toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  <strong>Rationale:</strong> {phase.rationale}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Score de flexibilité */}
      <Card>
        <CardHeader>
          <CardTitle>Flexibilité de votre stratégie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span>Score de flexibilité</span>
              <Progress value={strategy?.flexibiliteScore || 0} className="flex-1" />
              <span className="text-sm font-medium">
                {strategy?.flexibiliteScore || 0}/100
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Avantages de votre stratégie</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Optimisation fiscale progressive
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Préservation des prestations gouvernementales
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Flexibilité d'ajustement selon les besoins
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Recommandations spéciales</h3>
                <div className="space-y-1">
                  {strategy?.recommendationsSpeciales?.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RetirementBudgetTab: React.FC<any> = ({ budgetAnalysis }) => {
  const depensesData = [
    { 
      categorie: 'Éliminées', 
      montant: budgetAnalysis?.depensesProjectees?.eliminees?.reduce((sum: number, dep: any) => sum + dep.montantActuel, 0) || 0,
      color: '#EF4444'
    },
    { 
      categorie: 'Diminuées', 
      montant: budgetAnalysis?.depensesProjectees?.diminuees?.reduce((sum: number, dep: any) => sum + dep.montantActuel * (1 - dep.pourcentageReduction/100), 0) || 0,
      color: '#F59E0B'
    },
    { 
      categorie: 'Stables', 
      montant: budgetAnalysis?.depensesProjectees?.stables?.reduce((sum: number, dep: any) => sum + dep.montantActuel, 0) || 0,
      color: '#6B7280'
    },
    { 
      categorie: 'Augmentées', 
      montant: budgetAnalysis?.depensesProjectees?.augmentees?.reduce((sum: number, dep: any) => sum + dep.montantActuel * (1 + dep.pourcentageAugmentation/100), 0) || 0,
      color: '#10B981'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Changements de dépenses */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution de vos dépenses à la retraite</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                {depensesData.map((categorie, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded" style={{backgroundColor: categorie.color + '20'}}>
                    <span className="text-sm font-medium">{categorie.categorie}</span>
                    <span className="text-sm">{formatCurrency(categorie.montant)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Détail par catégorie</h3>
              {depensesData.map((categorie, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded" style={{backgroundColor: categorie.color + '20'}}>
                  <span className="text-sm font-medium">{categorie.categorie}</span>
                  <span className="text-sm">{formatCurrency(categorie.montant)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Fond d'urgence et stratégie comptes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fond d'urgence recommandé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(budgetAnalysis?.fondUrgenceRequis || 0)}
              </div>
              <div className="text-sm text-gray-600">
                Équivaut à 4 mois de dépenses de retraite
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm">
                  <strong>Recommandation:</strong> Placer dans CELI pour accessibilité maximale sans impact fiscal
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Stratégie de comptes séparés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Compte dépenses fixes</div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(budgetAnalysis?.repartitionComptes?.compteDependesFixes || 0)} / mois
                </div>
                <div className="text-xs text-gray-500">
                  Loyer, assurances, taxes, abonnements
                </div>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Compte gestion courante</div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(budgetAnalysis?.repartitionComptes?.compteGestionCourante || 0)} / mois
                </div>
                <div className="text-xs text-gray-500">
                  Épicerie, essence, loisirs, imprévus
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const EstateConsiderationsTab: React.FC<any> = ({ estateAnalysis, userData }) => {
  return (
    <div className="space-y-6">
      {/* Priorités successorales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Actions successorales prioritaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {estateAnalysis?.prioritesSuccessorales?.map((priorite: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">#{priorite.ordre} - {priorite.action}</h3>
                  <Badge variant={priorite.urgence === 'CRITIQUE' ? 'destructive' : 'secondary'}>
                    {priorite.urgence}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{priorite.justification}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Avertissement comptes conjoints */}
      <Alert>
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>
          <strong>Important:</strong> En cas de décès, l'argent d'un compte conjoint sera bloqué le temps du règlement de la succession, 
          ce qui peut prendre plusieurs semaines, voire des mois. Assurez-vous que chaque conjoint ait un compte personnel 
          pour continuer les transactions courantes.
        </AlertDescription>
      </Alert>
      
      {/* Timeline des actions */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline des actions recommandées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {estateAnalysis?.timelineActions?.map((action: any, index: number) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{action.action}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                  <div className="text-xs text-blue-600 mt-1">Délai: {action.delai}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== FONCTION UTILITAIRE =====
function formatCurrency(amount: number, short: boolean = false): string {
  if (short && Math.abs(amount) >= 1000) {
    if (Math.abs(amount) >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M $`;
    } else {
      return `${(amount / 1000).toFixed(0)}k $`;
    }
  }
  
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
