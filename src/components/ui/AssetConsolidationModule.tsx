import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Calculator,
  FileText,
  Target,
  Lightbulb,
  DollarSign,
  Clock,
  Shield
} from 'lucide-react';

interface Institution {
  id: string;
  name: string;
  accountType: string;
  balance: number;
  fees: number;
  taxSlips: number;
  complexity: 'low' | 'medium' | 'high';
}

interface ConsolidationPlan {
  targetInstitutions: number;
  estimatedSavings: number;
  complexityReduction: number;
  taxSlipReduction: number;
}

const AssetConsolidationModule: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [consolidationPlan, setConsolidationPlan] = useState<ConsolidationPlan | null>(null);
  const [activeTab, setActiveTab] = useState('assessment');

  // Ajouter une institution
  const addInstitution = () => {
    const newInstitution: Institution = {
      id: Date.now().toString(),
      name: '',
      accountType: 'RRSP',
      balance: 0,
      fees: 0,
      taxSlips: 1,
      complexity: 'medium'
    };
    setInstitutions([...institutions, newInstitution]);
  };

  // Mettre à jour une institution
  const updateInstitution = (id: string, field: keyof Institution, value: any) => {
    setInstitutions(institutions.map(inst => 
      inst.id === id ? { ...inst, [field]: value } : inst
    ));
  };

  // Supprimer une institution
  const removeInstitution = (id: string) => {
    setInstitutions(institutions.filter(inst => inst.id !== id));
  };

  // Calculer le plan de consolidation
  const calculateConsolidationPlan = () => {
    if (institutions.length === 0) return;

    const totalBalance = institutions.reduce((sum, inst) => sum + inst.balance, 0);
    const totalFees = institutions.reduce((sum, inst) => sum + inst.fees, 0);
    const totalTaxSlips = institutions.reduce((sum, inst) => sum + inst.taxSlips, 0);
    
    // Recommandation : 1-2 institutions maximum
    const targetInstitutions = totalBalance > 500000 ? 2 : 1;
    
    // Estimation des économies (réduction des frais de 30-50%)
    const estimatedSavings = totalFees * 0.4;
    
    // Réduction de complexité (basée sur le nombre d'institutions)
    const complexityReduction = Math.max(0, (institutions.length - targetInstitutions) / institutions.length * 100);
    
    // Réduction des feuillets fiscaux
    const taxSlipReduction = Math.max(0, totalTaxSlips - targetInstitutions);

    setConsolidationPlan({
      targetInstitutions,
      estimatedSavings,
      complexityReduction,
      taxSlipReduction
    });
  };

  // Calculer automatiquement quand les institutions changent
  useEffect(() => {
    if (institutions.length > 0) {
      calculateConsolidationPlan();
    }
  }, [institutions]);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConsolidationScore = () => {
    if (institutions.length <= 2) return { score: 90, status: 'Excellent', color: 'text-green-600' };
    if (institutions.length <= 4) return { score: 70, status: 'Bon', color: 'text-yellow-600' };
    if (institutions.length <= 6) return { score: 50, status: 'À améliorer', color: 'text-orange-600' };
    return { score: 30, status: 'Critique', color: 'text-red-600' };
  };

  const consolidationScore = getConsolidationScore();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Module de Consolidation d'Actifs
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Simplifiez votre retraite en consolidant vos comptes. Réduisez la complexité, 
          les frais et le nombre de feuillets fiscaux.
        </p>
      </div>

      {/* Score de consolidation */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Score de Consolidation
            </CardTitle>
            <Badge className={`${consolidationScore.color} bg-transparent border-current`}>
              {consolidationScore.score}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={consolidationScore.score} className="h-3" />
            <div className="flex items-center justify-between">
              <span className={`font-semibold ${consolidationScore.color}`}>
                {consolidationScore.status}
              </span>
              <span className="text-sm text-gray-600">
                {institutions.length} institution{institutions.length > 1 ? 's' : ''} actuellement
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assessment">Évaluation</TabsTrigger>
          <TabsTrigger value="plan">Plan de Consolidation</TabsTrigger>
          <TabsTrigger value="benefits">Avantages</TabsTrigger>
          <TabsTrigger value="action">Plan d'Action</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Vos Institutions Financières
              </CardTitle>
              <CardDescription>
                Ajoutez toutes vos institutions où vous avez des comptes de retraite
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {institutions.map((institution) => (
                <div key={institution.id} className="p-4 border rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`name-${institution.id}`}>Nom de l'institution</Label>
                      <Input
                        id={`name-${institution.id}`}
                        value={institution.name}
                        onChange={(e) => updateInstitution(institution.id, 'name', e.target.value)}
                        placeholder="Ex: Institution financière"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`type-${institution.id}`}>Type de compte</Label>
                      <select
                        id={`type-${institution.id}`}
                        value={institution.accountType}
                        onChange={(e) => updateInstitution(institution.id, 'accountType', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="RRSP">RRSP</option>
                        <option value="RIFF">RIFF</option>
                        <option value="CELI">CELI</option>
                        <option value="Non-enregistré">Non-enregistré</option>
                        <option value="Pension">Pension d'entreprise</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor={`balance-${institution.id}`}>Solde ($)</Label>
                      <Input
                        id={`balance-${institution.id}`}
                        type="number"
                        value={institution.balance}
                        onChange={(e) => updateInstitution(institution.id, 'balance', parseFloat(e.target.value) || 0)}
                        placeholder="100000"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`fees-${institution.id}`}>Frais annuels ($)</Label>
                      <Input
                        id={`fees-${institution.id}`}
                        type="number"
                        value={institution.fees}
                        onChange={(e) => updateInstitution(institution.id, 'fees', parseFloat(e.target.value) || 0)}
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`taxslips-${institution.id}`}>Feuillets fiscaux</Label>
                      <Input
                        id={`taxslips-${institution.id}`}
                        type="number"
                        value={institution.taxSlips}
                        onChange={(e) => updateInstitution(institution.id, 'taxSlips', parseInt(e.target.value) || 1)}
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`complexity-${institution.id}`}>Complexité</Label>
                      <select
                        id={`complexity-${institution.id}`}
                        value={institution.complexity}
                        onChange={(e) => updateInstitution(institution.id, 'complexity', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="low">Faible</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Élevée</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={getComplexityColor(institution.complexity)}>
                      Complexité {institution.complexity === 'low' ? 'Faible' : 
                                 institution.complexity === 'medium' ? 'Moyenne' : 'Élevée'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeInstitution(institution.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}

              <Button onClick={addInstitution} className="w-full">
                <Building2 className="h-4 w-4 mr-2" />
                Ajouter une institution
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan" className="space-y-6">
          {consolidationPlan && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Plan Recommandé
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Institutions cibles</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {consolidationPlan.targetInstitutions}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Économies annuelles</span>
                    <Badge className="bg-green-100 text-green-800">
                      {consolidationPlan.estimatedSavings.toLocaleString('fr-CA', {
                        style: 'currency',
                        currency: 'CAD'
                      })}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium">Réduction complexité</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {consolidationPlan.complexityReduction.toFixed(0)}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Feuillets fiscaux en moins</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      -{consolidationPlan.taxSlipReduction}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Impact sur 10 ans
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(consolidationPlan.estimatedSavings * 10).toLocaleString('fr-CA', {
                        style: 'currency',
                        currency: 'CAD'
                      })}
                    </div>
                    <div className="text-sm text-green-700">
                      Économies totales sur 10 ans
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Temps économisé/an</span>
                      <span className="text-sm font-medium">~20 heures</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Stress réduit</span>
                      <span className="text-sm font-medium">Significatif</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Erreurs évitées</span>
                      <span className="text-sm font-medium">Multiples</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!consolidationPlan && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Ajoutez au moins une institution dans l'onglet "Évaluation" pour voir votre plan de consolidation.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Avantages Financiers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Réduction des frais</div>
                    <div className="text-sm text-gray-600">
                      Négociation de meilleurs tarifs avec moins d'institutions
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Optimisation fiscale</div>
                    <div className="text-sm text-gray-600">
                      Stratégies de décaissement plus efficaces
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Meilleur rendement</div>
                    <div className="text-sm text-gray-600">
                      Accès à des produits institutionnels avec des soldes plus élevés
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Avantages Pratiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Simplification administrative</div>
                    <div className="text-sm text-gray-600">
                      Moins de relevés, moins de feuillets fiscaux
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Gestion centralisée</div>
